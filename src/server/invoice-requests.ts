import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq, gt, inArray, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { products as productsTable, emailEvents, paymentAttempts } from '~/lib/db/schema'
import { activeGiftProductIds, computeFreeGifts } from '~/lib/promotions'
import { contestLive, freePacksFor } from '~/lib/contest'
import { overlaySquareData } from './square'
import { sendHiAkBlockedAlertEmail, sendInvoiceRequestEmails } from './email'

// Alaska and Hawaii can't check out on the site yet (BLOCK_HI_AK_CHECKOUT).
// Instead the shopper sends their cart as an invoice request: the owner gets
// it by email (reply-to the shopper) and sends an invoice with real shipping.
// Prices are read here from the live catalog, never taken from the client.
const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  street: z.string().trim().min(1).max(200),
  apartment: z.string().trim().max(100).optional(),
  city: z.string().trim().min(1).max(100),
  state: z.enum(['AK', 'HI']),
  zip: z.string().trim().min(3).max(12),
  note: z.string().trim().max(1000).optional(),
  lines: z.array(z.object({ productId: z.string().max(200), qty: z.number().int().positive().max(500) })).min(1).max(60),
})

export const requestInvoice = createServerFn({ method: 'POST' })
  .validator(schema)
  .handler(async ({ data }) => {
    const db = getDb()
    // A light brake on repeat sends to the same address (this form emails
    // whoever is typed in): at most 3 requests per address in 10 minutes.
    const [recent] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(emailEvents)
      .where(and(eq(emailEvents.type, 'invoice_request_confirmation'), sql`lower(${emailEvents.email}) = ${data.email.toLowerCase()}`, gt(emailEvents.createdAt, new Date(Date.now() - 10 * 60 * 1000))))
    if ((recent?.n ?? 0) >= 3) throw new Error("We've already got your request. We'll be in touch by email soon.")
    const ids = [...new Set([...data.lines.map((l) => l.productId), ...activeGiftProductIds()])]
    const rows = await db.select().from(productsTable).where(inArray(productsTable.id, ids))
    const live = await overlaySquareData(
      rows.map((r) => ({ id: r.id, name: r.name, price: r.price, stock: r.stock, squareVariationId: r.squareVariationId, published: r.published, notSellable: r.notSellable, comingSoon: r.comingSoon })),
    )
    const byId = new Map(live.map((p) => [p.id, p]))
    const paid = data.lines
      .map((l) => ({ l, p: byId.get(l.productId) }))
      .filter((x) => x.p && x.p.published && !x.p.notSellable && !x.p.comingSoon)
    if (paid.length === 0) throw new Error('Your cart is empty. Add something and try again.')
    const items: Array<{ name: string; qty: number; unitPrice: number; free?: boolean }> = paid.map(({ l, p }) => ({ name: p!.name, qty: l.qty, unitPrice: p!.price }))
    const giftStock = Object.fromEntries(activeGiftProductIds().map((id) => [id, Math.max(0, byId.get(id)?.stock ?? 0)]))
    for (const g of computeFreeGifts(paid.map(({ l }) => l), giftStock)) {
      const gp = byId.get(g.productId)
      if (gp) items.push({ name: `${gp.name} (free gift)`, qty: g.qty, unitPrice: 0, free: true })
    }
    const subtotal = Math.round(items.reduce((t, i) => t + i.unitPrice * i.qty, 0) * 100) / 100
    const address = [data.street, data.apartment, `${data.city}, ${data.state} ${data.zip}`].filter(Boolean).join(', ')
    const promotionLive = contestLive()
    const sent = await sendInvoiceRequestEmails({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      address,
      state: data.state,
      note: data.note || null,
      items,
      subtotal,
      freePacks: freePacksFor(subtotal),
      promotionLive,
    })
    // Kept on the email log as the record of the request.
    try {
      await db.insert(emailEvents).values([
        { email: 'eastblueinternational@gmail.com', type: 'invoice_request', status: sent.owner.status, errorMessage: 'error' in sent.owner ? (sent.owner.error ?? null) : null, resendId: 'resendId' in sent.owner ? (sent.owner.resendId ?? null) : null },
        { email: data.email, type: 'invoice_request_confirmation', status: sent.customer.status, errorMessage: 'error' in sent.customer ? (sent.customer.error ?? null) : null, resendId: 'resendId' in sent.customer ? (sent.customer.resendId ?? null) : null },
      ])
    } catch (err) {
      console.error('Failed to log invoice request:', err)
    }
    if (sent.owner.status !== 'sent') {
      // Also on the admin orders page's failures list, so a request whose
      // email to the owner failed still shows up somewhere.
      try {
        await db.insert(paymentAttempts).values({ email: data.email, amount: subtotal, errorMessage: `Invoice request (${data.state}) email to owner failed: ${'error' in sent.owner ? sent.owner.error ?? sent.owner.status : sent.owner.status}` })
      } catch (err) {
        console.error('Failed to record failed invoice request:', err)
      }
      throw new Error("We couldn't send your request just now. Please email eastblueinternational@gmail.com and we'll sort it out.")
    }
    return { ok: true as const, subtotal, freePacks: freePacksFor(subtotal), promotionLive }
  })

// An Alaska or Hawaii shopper stopped at checkout. Each one emails the owner
// and lands on the admin orders page's "Recent payment failures" list, so a
// shopper who leaves without sending the invoice request is never missed.
// Called from the checkout page, the Apple Pay sheet and placeOrder itself.
export interface HiAkBlockedReport {
  state: 'AK' | 'HI'
  source: 'checkout' | 'apple-pay' | 'place-order'
  email?: string | null
  name?: string | null
  city?: string | null
  zip?: string | null
  lines: Array<{ productId: string; qty: number }>
}

const DEDUPE_MINUTES = 30
const MAX_ALERTS_PER_HOUR = 30

export async function recordHiAkBlocked(report: HiAkBlockedReport): Promise<'sent' | 'duplicate' | 'capped' | 'failed' | 'skipped'> {
  const db = getDb()
  const email = report.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.email.trim()) ? report.email.trim() : null
  // Without an email the shopper is keyed on state and ZIP.
  const key = email ? email.toLowerCase() : `no-email:${report.state}:${(report.zip || '').trim() || 'unknown'}`
  const [recent] = await db
    .select({
      same: sql<number>`count(*) filter (where lower(${emailEvents.email}) = ${key} and ${emailEvents.createdAt} > ${new Date(Date.now() - DEDUPE_MINUTES * 60 * 1000)})::int`,
      hour: sql<number>`count(*) filter (where ${emailEvents.createdAt} > ${new Date(Date.now() - 60 * 60 * 1000)})::int`,
    })
    .from(emailEvents)
    .where(eq(emailEvents.type, 'hi_ak_blocked_alert'))
  if ((recent?.same ?? 0) > 0) return 'duplicate'
  if ((recent?.hour ?? 0) >= MAX_ALERTS_PER_HOUR) return 'capped'

  const ids = [...new Set(report.lines.map((l) => l.productId))]
  const rows = ids.length ? await db.select().from(productsTable).where(inArray(productsTable.id, ids)) : []
  const live = await overlaySquareData(
    rows.map((r) => ({ id: r.id, name: r.name, price: r.price, stock: r.stock, squareVariationId: r.squareVariationId, published: r.published, notSellable: r.notSellable, comingSoon: r.comingSoon })),
  ).catch(() => rows.map((r) => ({ id: r.id, name: r.name, price: r.price })))
  const byId = new Map(live.map((p) => [p.id, p]))
  const items = report.lines
    .map((l) => ({ l, p: byId.get(l.productId) }))
    .filter((x) => x.p)
    .map(({ l, p }) => ({ name: p!.name, qty: l.qty, unitPrice: Number(p!.price) || 0 }))
  const subtotal = Math.round(items.reduce((t, i) => t + i.unitPrice * i.qty, 0) * 100) / 100
  const place = [report.city?.trim(), [report.state, report.zip?.trim()].filter(Boolean).join(' ')].filter(Boolean).join(', ')

  const sent = await sendHiAkBlockedAlertEmail({ state: report.state, source: report.source, email, name: report.name?.trim() || null, place, items, subtotal })
  try {
    await db.insert(emailEvents).values({ email: key, type: 'hi_ak_blocked_alert', status: sent.status, errorMessage: sent.error ?? null, resendId: sent.resendId ?? null })
    await db.insert(paymentAttempts).values({
      email,
      amount: subtotal,
      errorMessage: `Alaska/Hawaii checkout blocked (${report.state}, ${report.source})${email ? '' : `, no email yet${report.zip ? `, ZIP ${report.zip}` : ''}`}. Alert email: ${sent.status}`,
    })
  } catch (err) {
    console.error('Failed to record AK/HI blocked checkout:', err)
  }
  return sent.status === 'sent' ? 'sent' : sent.status
}

const blockedSchema = z.object({
  state: z.enum(['AK', 'HI']),
  source: z.enum(['checkout', 'apple-pay']),
  email: z.string().trim().max(200).optional(),
  name: z.string().trim().max(120).optional(),
  city: z.string().trim().max(100).optional(),
  zip: z.string().trim().max(12).optional(),
  lines: z.array(z.object({ productId: z.string().max(200), qty: z.number().int().positive().max(500) })).max(60),
})

export const reportHiAkBlocked = createServerFn({ method: 'POST' })
  .validator(blockedSchema)
  .handler(async ({ data }) => ({ result: await recordHiAkBlocked(data) }))
