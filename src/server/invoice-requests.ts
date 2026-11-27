import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq, gt, inArray, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { products as productsTable, emailEvents } from '~/lib/db/schema'
import { activeGiftProductIds, computeFreeGifts } from '~/lib/promotions'
import { contestLive, freePacksFor } from '~/lib/contest'
import { overlaySquareData } from './square'
import { sendInvoiceRequestEmails } from './email'

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
      throw new Error("We couldn't send your request just now. Please email eastblueinternational@gmail.com and we'll sort it out.")
    }
    return { ok: true as const, subtotal, freePacks: freePacksFor(subtotal), promotionLive }
  })
