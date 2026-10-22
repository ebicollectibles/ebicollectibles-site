// Posts a restock/launch alert embed to the DropNotify Discord webhook, in
// the exact field layout DropNotify asked for (see the conversation this was
// built from). Deliberately separate from email.ts's notify-me blasts —
// this is unrelated infrastructure (an outbound webhook to a third party's
// Discord server, not our own customer email list) and fires automatically
// from admin.ts rather than being admin-triggered like a notify-me blast.

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

// Best-effort, fire-and-forget from the caller's point of view — a failed or
// unconfigured webhook should never block or fail a product save. Returns
// nothing; errors are logged, not thrown.
export async function sendDropnotifyAlert(product: DropnotifyAlertProduct): Promise<void> {
  const webhookUrl = process.env.DISCORD_DN_WEBHOOK_URL
  if (!webhookUrl) return

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
    if (!res.ok) console.error(`DropNotify Discord webhook failed (${res.status}):`, await res.text().catch(() => ''))
  } catch (err) {
    console.error('DropNotify Discord webhook failed:', err)
  }
}
