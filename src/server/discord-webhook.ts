// Posts a restock/launch alert embed to the DropNotify Discord webhook, in
// the exact field layout DropNotify asked for (see the conversation this was
// built from). Deliberately separate from email.ts's notify-me blasts —
// this is unrelated infrastructure (an outbound webhook to a third party's
// Discord server, not our own customer email list) and fires automatically
// from admin.ts rather than being admin-triggered like a notify-me blast.

import { and, eq } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { dropnotifyAlertEvents, products as productsTable } from '~/lib/db/schema'

export type DropnotifyAlertTrigger = 'admin_save' | 'square_inventory'

const SITE_URL = 'https://ebicollectibles.com'
// The referral code DropNotify's own traffic should be attributed under —
// see resolveAffiliateAttribution in affiliates.ts. Admin needs to have
// actually created this code under /admin/affiliates for it to credit a
// commission; if it doesn't exist yet the link still works, it just won't
// match anything at checkout.
const DROPNOTIFY_REF_CODE = 'dn'

interface DiscordEmbed {
  title: string
  url: string
  color: number
  thumbnail?: { url: string }
  fields: Array<{ name: string; value: string; inline?: boolean }>
  footer: { text: string }
}

export interface DropnotifyAlertProduct {
  id: string
  name: string
  price: number
  stock: number
  img: string | null
}

function absoluteImageUrl(img: string): string {
  return img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`
}

// Discord rejects the entire webhook call if any single field exceeds its
// length limit (title 256, field value 1024, footer 2048) — admin-typed
// product names are short today, but nothing upstream enforces that, so a
// future long name would otherwise silently kill the whole alert instead of
// just looking a little clipped.
function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

// Best-effort from the caller's point of view — a failed or unconfigured
// webhook should never block or fail a product save, so this never throws.
// Every attempt (sent, failed, or skipped for no configured webhook) is
// logged to dropnotifyAlertEvents so a dead/revoked webhook or a Discord
// outage shows up somewhere admin can actually see, instead of only in a
// console nobody is tailing — see the conversation this was built from.
export async function sendDropnotifyAlert(product: DropnotifyAlertProduct, trigger: DropnotifyAlertTrigger): Promise<void> {
  const db = getDb()
  const logAttempt = (status: 'sent' | 'failed' | 'skipped', errorMessage?: string) =>
    db
      .insert(dropnotifyAlertEvents)
      .values({ productId: product.id, productName: product.name, trigger, status, errorMessage: errorMessage ?? null })
      .catch((err) => console.error('Failed to record dropnotifyAlertEvents row:', err))

  const webhookUrl = process.env.DISCORD_DN_WEBHOOK_URL
  if (!webhookUrl) {
    await logAttempt('skipped', 'DISCORD_DN_WEBHOOK_URL is not set')
    return
  }

  const productUrl = `${SITE_URL}/products/${product.id}?ref=${DROPNOTIFY_REF_CODE}`
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'short',
    timeStyle: 'medium',
  })

  const embed: DiscordEmbed = {
    title: truncate(product.name, 256),
    url: productUrl,
    // Green when in stock — matches the 🟢/🔴 availability field below.
    color: 0x2ecc71,
    fields: [
      { name: 'Price', value: `**${'$' + product.price.toFixed(2)}**`, inline: true },
      { name: 'Availability', value: product.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock', inline: true },
      { name: 'Total Stock', value: String(Math.max(0, product.stock)), inline: true },
      // No dedicated SKU column on products — the id slug is the closest
      // stable per-product identifier the site has.
      { name: 'SKU', value: truncate(product.id, 1024), inline: true },
      // No one-click "add to cart" URL exists (cart is client-side only) —
      // link to the product page itself rather than build something that
      // only half-works.
      { name: '​', value: truncate(`[View Product](${productUrl})`, 1024), inline: false },
    ],
    footer: { text: truncate(`DropNotify x EBI Collectibles • #ad • ${timestamp}`, 2048) },
  }
  if (product.img) embed.thumbnail = { url: absoluteImageUrl(product.img) }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })
    if (res.ok) {
      await logAttempt('sent')
    } else {
      const body = await res.text().catch(() => '')
      console.error(`DropNotify Discord webhook failed (${res.status}):`, body)
      await logAttempt('failed', `HTTP ${res.status}: ${truncate(body, 500)}`)
    }
  } catch (err) {
    console.error('DropNotify Discord webhook failed:', err)
    await logAttempt('failed', err instanceof Error ? err.message : 'Unknown error')
  }
}

// Whether a product currently qualifies for a DropNotify alert — opted in,
// published, and actually in stock. Shared by every trigger path below
// (admin.ts's product-form saves, and the Square inventory webhook).
export function isDropnotifyAlertable(p: { dropnotifyAlert: boolean; published: boolean; stock: number }): boolean {
  return p.dropnotifyAlert && p.published && p.stock > 0
}

// Atomically claims this product's DropNotify alert — only the caller that
// flips dropnotifyArmed from true to false gets true back, so two
// concurrent triggers that both land on the same restock (e.g. admin saves
// the product form at the same moment Square's inventory webhook fires for
// it) can't both send the alert. A plain read-then-write (fetch "armed",
// decide, write) would race here; this single UPDATE...WHERE is still
// atomic per-row without needing a transaction, which the neon-http driver
// doesn't support anyway (see lib/db/client.ts). Caller is responsible for
// only invoking this when isDropnotifyAlertable is already true.
export async function claimDropnotifyAlert(db: ReturnType<typeof getDb>, productId: string): Promise<boolean> {
  const claimed = await db
    .update(productsTable)
    .set({ dropnotifyArmed: false })
    .where(and(eq(productsTable.id, productId), eq(productsTable.dropnotifyArmed, true)))
    .returning({ id: productsTable.id })
  return claimed.length > 0
}

// Re-arms the alert so the *next* restock fires again — called whenever a
// trigger leaves the product not currently alertable (sold out,
// unpublished, or opted out). Safe/idempotent to call repeatedly.
export async function rearmDropnotifyAlert(db: ReturnType<typeof getDb>, productId: string): Promise<void> {
  await db.update(productsTable).set({ dropnotifyArmed: true }).where(eq(productsTable.id, productId))
}

// Entry point for Square's inventory.count.updated webhook (see
// server/square-webhook.ts) — the actual trigger path for sellers who
// manage stock in Square rather than by editing the product form here.
// admin.ts's claim/rearm calls only fire from a product-form save, which
// never happens for a Square-managed restock (overlaySquareData reads
// Square's live count at render time without ever writing it back to the
// stock column — see square.ts), so without this, dropnotifyAlert would
// silently never fire for any Square-linked, Square-managed product.
// catalogObjectId is the item VARIATION id Square reports in the webhook
// payload, matched against products.squareVariationId; quantity is the
// IN_STOCK count Square reports for it at this location (already parsed
// from the webhook's decimal-string quantity field by the caller). A
// variation can in principle be linked from more than one product row
// (nothing in the schema enforces uniqueness), so this updates every match.
export async function handleSquareInventoryCountUpdate(catalogObjectId: string, quantity: number): Promise<void> {
  const db = getDb()
  const matches = await db
    .select({ id: productsTable.id, name: productsTable.name, price: productsTable.price, img: productsTable.img, dropnotifyAlert: productsTable.dropnotifyAlert, published: productsTable.published })
    .from(productsTable)
    .where(eq(productsTable.squareVariationId, catalogObjectId))

  for (const p of matches) {
    if (!p.dropnotifyAlert) continue // not opted in — armed state doesn't matter, skip the extra write
    if (isDropnotifyAlertable({ dropnotifyAlert: p.dropnotifyAlert, published: p.published, stock: quantity })) {
      if (await claimDropnotifyAlert(db, p.id)) {
        await sendDropnotifyAlert({ id: p.id, name: p.name, price: p.price, stock: quantity, img: p.img }, 'square_inventory')
      }
    } else {
      await rearmDropnotifyAlert(db, p.id)
    }
  }
}
