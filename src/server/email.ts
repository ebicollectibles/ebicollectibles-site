// Plain fetch against Resend's REST API — same pattern as square.ts, no SDK
// so this keeps working unmodified on Cloudflare Workers.

import { carrierTrackingUrl } from '~/lib/carriers'
import { formatMoney } from '~/lib/products'
import { orderViewUrl } from './order-link'

// Shared visual language for every email — same palette as the site itself
// (see src/styles/app.css :root), same header/footer shell, same item-row
// shape — so every email reads as one consistent system. Table-based layout
// throughout (no flex/grid) since Outlook's rendering engine doesn't support
// either; inline styles only, the <style> block in <head> just tightens the
// side padding and headline size on phones where the client allows it.
const INK = '#131b28'
const MUTED = '#5a6875'
const BORDER = '#e3e6ea'
const SURFACE = '#f6f7f8'
const GREEN = '#3f7a63'

const LOGO_URL = 'https://ebicollectibles.com/assets/ebi-logo.jpg'
// The wide lockup (mark + COLLECTIBLES) used on the blog banners, in Ink.
const WIDE_LOGO_URL = 'https://ebicollectibles.com/assets/ebi-logo-wide-ink.png'
// Web fonts load where the client allows it (Apple Mail, iOS); Gmail and
// Outlook fall back to Helvetica/Arial and the system mono.
const HEAD_FONT = "font-family:'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif;"
const BODY_FONT = "font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;"
const MONO_FONT = "font-family:'IBM Plex Mono',SFMono-Regular,Menlo,Consolas,monospace;"

// Small spaced uppercase mono label: the email's status line above the
// headline, and the section labels ("In this order", "Ship to").
function monoLabel(text: string, color: string = MUTED): string {
  return `<div style="${MONO_FONT}font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:${color};">${text}</div>`
}

// One vertical block with a gap above it — padding on a cell rather than
// margins, which Outlook ignores on tables.
function section(html: string, top: number): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding-top:${top}px;">${html}</td></tr></table>`
}

function fullWidthButton(label: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="${INK}" style="background:${INK};border-radius:4px;"><a href="${url}" style="display:block;padding:16px 20px;${BODY_FONT}font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;">${label}</a></td></tr></table>`
}

function inlineButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="${INK}" style="background:${INK};border-radius:3px;"><a href="${url}" style="display:inline-block;padding:14px 26px;white-space:nowrap;${BODY_FONT}font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a></td></tr></table>`
}

function paragraph(html: string, opts: { size?: number; color?: string } = {}): string {
  return `<p style="${BODY_FONT}font-size:${opts.size ?? 15}px;line-height:1.6;color:${opts.color ?? MUTED};margin:0;">${html}</p>`
}

// Light grey rounded box with mono-labelled cells side by side (ship-to
// and payment method on the confirmation, the amount on store credit).
function detailsBoxHtml(cells: Array<{ label: string; valueHtml: string; large?: boolean }>): string {
  if (cells.length === 0) return ''
  const width = Math.floor(100 / cells.length)
  const tds = cells
    .map(
      (cell) =>
        `<td width="${width}%" style="padding:16px 18px;vertical-align:top;">${monoLabel(cell.label)}<div style="${cell.large ? `${HEAD_FONT}font-size:24px;font-weight:800;` : `${BODY_FONT}font-size:13.5px;line-height:1.6;`}color:${INK};padding-top:8px;">${cell.valueHtml}</div></td>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${SURFACE}" style="background:${SURFACE};border-radius:6px;"><tr>${tds}</tr></table>`
}

// Tinted notice box (pre-order terms, refund amount, combined shipping).
const NOTICE_GREEN = { bg: '#eaf2ee', border: '#c7ddd1' }
const NOTICE_AMBER = { bg: '#fdf3ec', border: '#e6c4a8' }
function noticeHtml(html: string, tone: { bg: string; border: string }): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${tone.bg}" style="background:${tone.bg};border:1px solid ${tone.border};border-radius:6px;"><tr><td style="padding:12px 16px;"><p style="${BODY_FONT}font-size:13px;line-height:1.6;color:${INK};margin:0;">${html}</p></td></tr></table>`
}

// Totals under the items: the last strong row (the total) gets the bold
// type and the ink rule above it.
function totalsHtml(rows: Array<{ label: string; value: string; strong?: boolean } | null>): string {
  const out = rows
    .filter((row): row is { label: string; value: string; strong?: boolean } => row !== null)
    .map((row, i, all) => {
      const afterStrong = i > 0 && all[i - 1].strong
      const style = row.strong
        ? `font-size:16px;font-weight:800;color:${INK};padding:12px 0 4px;border-top:1px solid ${INK};`
        : `font-size:13.5px;font-weight:400;color:${MUTED};padding:${afterStrong ? 8 : 4}px 0 4px;`
      return `<tr><td style="${BODY_FONT}${style}">${row.label}</td><td align="right" style="${BODY_FONT}${style}text-align:right;white-space:nowrap;">${row.value}</td></tr>`
    })
    .join('')
  // A compact block on the right, like a receipt, rather than labels and
  // amounts at opposite edges of the card.
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="right"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:280px;">${out}</table></td></tr></table>`
}

// Kept deliberately short compared to a bigger storefront's email footer —
// no unsubscribe line (every email through this shell is transactional,
// triggered by something the recipient did, not a marketing list they
// opted into) and no physical mailing address (not published anywhere
// else on the site either). Just the policy links, the shop and the real
// social presence, matching Footer.tsx's own "Elsewhere"/"Help" sections
// rather than inventing anything not already true of the site. List emails
// add their address + Unsubscribe lines (marketingEmailExtras) inside the
// same grey block, right under the copyright line.
function emailFooterHtml(listFooterHtml = ''): string {
  const year = new Date().getFullYear()
  // One type scale for the whole footer: small mono labels, 12px links.
  const head = `${MONO_FONT}font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:${MUTED};margin:0 0 6px;`
  const link = `color:${INK};text-decoration:none;font-weight:600;`
  const quiet = `color:${MUTED};text-decoration:none;font-weight:500;`
  const row = `${BODY_FONT}font-size:12px;line-height:1.5;margin:0;`
  const dot = `<span style="color:#b6bec7;">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>`
  return `
      <tr>
        <td align="center" bgcolor="${SURFACE}" style="padding:30px 36px 30px;background:${SURFACE};text-align:center;">
          <img src="${WIDE_LOGO_URL}" width="132" height="34" alt="EBI Collectibles" style="display:inline-block;width:132px;height:34px;border:0;">
          <p style="${row}margin-top:14px;"><a href="${SITE_URL}/shop" style="${link}">Shop now &rarr;</a></p>
          <p style="${head}margin-top:22px;">Socials</p>
          <p style="${row}"><a href="https://www.instagram.com/ebicollectibles" style="${link}">Instagram</a>${dot}<a href="https://x.com/ebicollectibles" style="${link}">X</a></p>
          <p style="${head}margin-top:18px;">Policies</p>
          <p style="${row}"><a href="${SITE_URL}/shipping-policy" style="${quiet}">Shipping</a>${dot}<a href="${SITE_URL}/refund-policy" style="${quiet}">Refunds</a>${dot}<a href="${SITE_URL}/privacy" style="${quiet}">Privacy</a></p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:22px auto 0;"><tr><td width="48" style="border-top:1px solid ${BORDER};font-size:0;line-height:0;">&nbsp;</td></tr></table>
          <p style="${BODY_FONT}font-size:10px;line-height:1.6;color:${MUTED};margin:16px 0 0;">&copy; ${year} EBI Collectibles &middot; Not affiliated with, or endorsed by, any card publisher.</p>${listFooterHtml}
        </td>
      </tr>`
}

// Extra footer lines and headers for LIST emails only (restock and new
// release emails sent to subscribers), never order or shipping emails.
// Laid out like the big senders do it, centered:
//   EBI Collectibles - <postal address>
//   Don't want emails like these? Unsubscribe
// plus the List-Unsubscribe headers that make Gmail and Yahoo show their
// own one-click Unsubscribe button (required for bulk senders).
// Throws while BUSINESS_POSTAL_ADDRESS is empty: CAN-SPAM requires a
// postal address in commercial email, so a list email can't go out without.
// Email apps turn street addresses into blue map links. A zero-width
// non-joiner after each digit and comma breaks their address detection
// without changing what anyone sees.
function noAutoLink(text: string): string {
  return text.replace(/([0-9,])/g, '$1&zwnj;')
}

export async function marketingEmailExtras(email: string): Promise<{ footerHtml: string; footerText: string; headers: Record<string, string> }> {
  const { BUSINESS_LEGAL_NAME, BUSINESS_POSTAL_ADDRESS } = await import('~/lib/business')
  if (!BUSINESS_POSTAL_ADDRESS) throw new Error('Set BUSINESS_POSTAL_ADDRESS in src/lib/business.ts before sending list emails.')
  const { unsubscribePageUrl, oneClickUnsubscribeUrl, preferencesPageUrl } = await import('./unsubscribe')
  const [pageUrl, oneClickUrl, prefsUrl] = await Promise.all([unsubscribePageUrl(email), oneClickUnsubscribeUrl(email), preferencesPageUrl(email)])
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // Lines only, no row of its own: emailShell drops these inside the grey
  // footer block, right under the copyright line, so they read as one footer.
  const footerHtml = `
          <p style="${BODY_FONT}font-size:8px;line-height:1.5;color:#7b8690;margin:12px 0 0;-webkit-text-size-adjust:none;">${esc(BUSINESS_LEGAL_NAME)} - <span style="color:#7b8690;text-decoration:none;">${noAutoLink(esc(BUSINESS_POSTAL_ADDRESS))}</span></p>
          <p style="${BODY_FONT}font-size:8px;line-height:1.5;color:#7b8690;margin:0;-webkit-text-size-adjust:none;"><a href="${prefsUrl}" style="color:#7b8690;text-decoration:underline;">Update preferences</a> &middot; <a href="${pageUrl}" style="color:#7b8690;text-decoration:underline;">Unsubscribe</a></p>`
  const footerText = `${BUSINESS_LEGAL_NAME} - ${BUSINESS_POSTAL_ADDRESS}\nUpdate preferences: ${prefsUrl}\nUnsubscribe: ${pageUrl}`
  return {
    footerHtml,
    footerText,
    headers: { 'List-Unsubscribe': `<${oneClickUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  }
}

// The one shell every email goes through: white header bar with the logo,
// the status label + headline + intro, then (optionally) a lead block and
// the primary button straight under the intro, then the body, then the grey
// footer. `heading`, `intro`, `leadHtml`, `afterButtonHtml` and `bodyHtml`
// are raw HTML — callers escape anything user/DB-provided before passing it.
function emailShell(opts: {
  badgeLabel?: string
  badgeColor?: string
  heading: string
  intro: string
  leadHtml?: string
  primaryButton?: { label: string; url: string; inline?: boolean }
  afterButtonHtml?: string
  bodyHtml?: string
  listFooterHtml?: string
}): string {
  const button = opts.primaryButton
    ? section(opts.primaryButton.inline ? inlineButton(opts.primaryButton.label, opts.primaryButton.url) : fullWidthButton(opts.primaryButton.label, opts.primaryButton.url), 24)
    : ''
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-weight:inherit!important}@media (max-width:600px){.px{padding-left:22px!important;padding-right:22px!important}.h1{font-size:26px!important}}</style>
</head>
<body style="margin:0;padding:0;background:${SURFACE};">
  <div style="background:${SURFACE};padding:28px 12px;${BODY_FONT}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#ffffff;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
      <tr>
        <td class="px" style="padding:22px 36px;border-bottom:1px solid ${BORDER};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;"><img src="${WIDE_LOGO_URL}" width="171" height="44" alt="EBI Collectibles" style="display:block;width:171px;height:44px;border:0;"></td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td class="px" style="padding:34px 36px 34px;">
          ${opts.badgeLabel ? monoLabel(opts.badgeLabel, opts.badgeColor ?? MUTED) : ''}
          <h1 class="h1" style="${HEAD_FONT}font-size:30px;line-height:1.12;letter-spacing:-.02em;font-weight:800;color:${INK};margin:${opts.badgeLabel ? 12 : 0}px 0 0;">${opts.heading}</h1>
          ${section(paragraph(opts.intro), 12)}
          ${opts.leadHtml ?? ''}
          ${button}
          ${opts.afterButtonHtml ?? ''}
          ${opts.bodyHtml ?? ''}
        </td>
      </tr>
      ${emailFooterHtml(opts.listFooterHtml ?? '')}
    </table>
  </div>
</body>
</html>`
}

function formatAddress(order: {
  firstName?: string | null
  lastName?: string | null
  street: string | null
  apartment: string | null
  city: string | null
  state: string | null
  zip: string | null
}): string | null {
  // Every field here is free-text from the checkout form — escape before
  // joining with <br>, since the result is injected as raw HTML below (a
  // guest checkout can address an order to anyone's email, so this isn't
  // just self-XSS against the person who typed it).
  const name = [order.firstName, order.lastName].filter(Boolean).join(' ')
  const cityStateZip = [order.city, [order.state, order.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  const address = [name, order.street, order.apartment, cityStateZip]
    .filter(Boolean)
    .map((part) => escapeHtml(part as string))
    .join('<br>')
  return address || null
}

// One row per item: 62px white tile for the photo (product photos are shot
// on white, so the tile keeps them from floating on the page), name, a
// "Qty n" meta line, and the line price on the right when showPrice.
function itemsTableHtml(items: OrderEmailItem[], opts: { showPrice?: boolean } = {}): string {
  const showPrice = opts.showPrice ?? true
  const cell = `border-bottom:1px solid ${BORDER};vertical-align:middle;`

  const rows = items
    .map((item) => {
      const img = item.img
        ? `<img src="${escapeHtml(item.img)}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;object-fit:contain;border:0;">`
        : '&nbsp;'
      return `
        <tr>
          <td width="76" style="width:76px;padding:12px 0;${cell}">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="62" height="62" align="center" valign="middle" bgcolor="#ffffff" style="width:62px;height:62px;background:#ffffff;border:1px solid ${BORDER};border-radius:4px;text-align:center;vertical-align:middle;">${img}</td>
            </tr></table>
          </td>
          <td style="padding:12px 10px;${cell}">
            <div style="${BODY_FONT}font-size:14px;font-weight:600;color:${INK};line-height:1.35;">${escapeHtml(item.productName)}</div>
            <div style="${BODY_FONT}font-size:12.5px;color:${MUTED};padding-top:3px;">Qty ${item.qty}</div>
          </td>
          ${showPrice ? `<td align="right" style="padding:12px 0;${cell}white-space:nowrap;text-align:right;"><div style="${BODY_FONT}font-size:14px;font-weight:700;color:${INK};">${formatMoney(item.unitPrice * item.qty)}</div></td>` : ''}
        </tr>`
    })
    .join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`
}

// Section label + item rows, as one block.
function itemsSectionHtml(label: string, items: OrderEmailItem[], opts: { showPrice?: boolean } = {}): string {
  return section(`${monoLabel(label)}${section(itemsTableHtml(items, opts), 6)}`, 30)
}

interface OrderEmailItem {
  productName: string
  qty: number
  unitPrice: number
  img?: string | null
}

interface OrderEmailData {
  orderId: string
  orderNo: number
  email: string | null
  firstName: string | null
  lastName: string | null
  street: string | null
  apartment: string | null
  city: string | null
  state: string | null
  zip: string | null
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  paymentMethodSummary: string | null
  items: OrderEmailItem[]
  // Mirrors the on-page notice in OrderConfirmation.tsx — that page is seen
  // once, right after checkout, and never again unless the customer
  // happens to screenshot it. This is the lasting written record of the
  // pre-order final-sale terms, which matters most if a chargeback dispute
  // ever needs to show the customer was actually told.
  hasPreorder?: boolean
  // Set when this order's free shipping came from explicitly choosing to
  // wait and ship with a pending order (see combineWithOrderId in
  // schema.ts) — without this, the email just shows "Shipping: $0.00"
  // with no explanation, right after the customer made that choice at
  // checkout, which reads like a pricing mistake rather than the free
  // shipping they just picked.
  combineWithOrderNo?: number
}

// resendId is the Resend-assigned email id from a real send — kept so a
// later delivery/open/click/bounce webhook (see server/resend-webhook.ts)
// can be matched back to the email_events row that triggered it.
export type EmailSendResult = { status: 'sent' | 'failed' | 'skipped'; error?: string; resendId?: string }

// Best-effort: called right after an order is placed and paid for. A failed
// or skipped send should never affect the order itself — the caller logs
// the returned status/error to email_events instead of this throwing.
export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const address = formatAddress(order)
  const orderUrl = await orderViewUrl(order.orderId)

  const detailCells = [
    address ? { label: 'Ship to', valueHtml: address } : null,
    order.paymentMethodSummary ? { label: 'Payment method', valueHtml: escapeHtml(order.paymentMethodSummary) } : null,
  ].filter((cell) => cell !== null)

  const bodyHtml = `
    ${itemsSectionHtml('In this order', order.items)}
    ${section(
      totalsHtml([
        { label: 'Subtotal', value: formatMoney(order.subtotal) },
        { label: 'Shipping', value: formatMoney(order.shippingCost) },
        order.tax > 0 ? { label: 'Tax', value: formatMoney(order.tax) } : null,
        { label: 'Total', value: formatMoney(order.total), strong: true },
      ]),
      14,
    )}
    ${
      order.combineWithOrderNo != null
        ? section(
            noticeHtml(
              `You chose free shipping on this order by waiting for it to ship together with order <strong>#EBI-${order.combineWithOrderNo}</strong>. It'll ship once that one does.`,
              NOTICE_GREEN,
            ),
            20,
          )
        : ''
    }
    ${detailCells.length ? section(detailsBoxHtml(detailCells), 28) : ''}
    ${
      order.hasPreorder
        ? section(
            noticeHtml(
              `This order includes a pre-order item, charged in full today. Cancellations before shipment are subject to a 5% fee. See our <a href="${SITE_URL}/refund-policy" style="color:${INK};font-weight:600;">Refund Policy</a> for details.`,
              NOTICE_AMBER,
            ),
            20,
          )
        : ''
    }
    ${section(paragraph(`Questions about this order? Email us at <a href="mailto:eastblueinternational@gmail.com" style="color:${MUTED};">eastblueinternational@gmail.com</a>.`, { size: 13 }), 24)}
  `

  const html = emailShell({
    badgeLabel: 'Order confirmed',
    badgeColor: GREEN,
    heading: `Thanks for your order${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`,
    intro: `Order #EBI-${order.orderNo} is confirmed — here's what's in it.`,
    primaryButton: { label: 'View your order', url: orderUrl },
    bodyHtml,
  })

  const text = [
    `Thanks for your order${order.firstName ? `, ${order.firstName}` : ''}!`,
    `Order #EBI-${order.orderNo}`,
    '',
    ...order.items.map((item) => `${item.qty}x ${item.productName} — ${formatMoney(item.unitPrice * item.qty)}`),
    '',
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Shipping: ${formatMoney(order.shippingCost)}`,
    order.tax > 0 ? `Tax: ${formatMoney(order.tax)}` : null,
    `Total: ${formatMoney(order.total)}`,
    '',
    order.combineWithOrderNo != null
      ? `You chose free shipping on this order by waiting for it to ship together with order #EBI-${order.combineWithOrderNo}. It'll ship once that one does.\n`
      : null,
    address ? `Ship to:\n${address.replace(/<br>/g, '\n')}` : null,
    order.paymentMethodSummary ? `Payment method: ${order.paymentMethodSummary}` : null,
    order.hasPreorder
      ? `\nThis order includes a pre-order item, charged in full today. Cancellations before shipment are subject to a 5% fee. See our Refund Policy for details: ${SITE_URL}/refund-policy`
      : null,
    '',
    `View your order: ${orderUrl}`,
    'Questions about this order? Email us at eastblueinternational@gmail.com.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: order.email,
      subject: `Order confirmation — #EBI-${order.orderNo}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send confirmation email for order ${order.orderNo}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

interface OrderCancellationEmailData {
  orderId: string
  orderNo: number
  email: string | null
  firstName: string | null
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  // What was actually returned to the customer — kept distinct from `total`
  // rather than assumed equal, so this can never silently claim a bigger
  // refund than actually happened when a cancellation fee was withheld.
  refundedAmount: number
  // >0 when admin charged the standard cancellation fee instead of waiving
  // it (see adminCancelAndRefundOrder in server/admin.ts) — shown as its own
  // line so the customer can see exactly why refundedAmount is less than
  // total, instead of being left to guess.
  cancellationFee: number
  // >0 when this order had store credit applied at checkout — that credit
  // goes back to the customer's account balance on cancellation (either via
  // the Square refund webhook's own auto-restore, or explicitly in
  // adminCancelAndRefundOrder when the webhook won't fire — see the
  // comment there), separate from and in addition to whatever cash refund
  // is shown above.
  creditRestored: number
  paymentMethodSummary: string | null
  items: OrderEmailItem[]
}

// Same best-effort, return-a-result contract as sendOrderConfirmationEmail —
// called right after admin cancels and refunds an order (see
// adminCancelAndRefundOrder in server/admin.ts). Mirrors that email's exact
// visual structure (same shell, same items table, same summary rows) so the
// two read as one consistent system rather than a mismatched pair.
export async function sendOrderCancellationEmail(order: OrderCancellationEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const orderUrl = await orderViewUrl(order.orderId)

  const bodyHtml = `
    ${itemsSectionHtml('In this order', order.items)}
    ${section(
      totalsHtml([
        { label: 'Subtotal', value: formatMoney(order.subtotal) },
        { label: 'Shipping', value: formatMoney(order.shippingCost) },
        order.tax > 0 ? { label: 'Tax', value: formatMoney(order.tax) } : null,
        { label: 'Order total', value: formatMoney(order.total), strong: true },
        order.cancellationFee > 0 ? { label: 'Cancellation fee', value: `-${formatMoney(order.cancellationFee)}` } : null,
      ]),
      14,
    )}
    ${section(
      noticeHtml(
        `<strong>${formatMoney(order.refundedAmount)} has been refunded</strong> to your original payment method${
          order.cancellationFee > 0 ? ', after the cancellation fee shown above' : ''
        }. Refunds typically take 5–10 business days to appear on your statement, depending on your bank.`,
        NOTICE_GREEN,
      ),
      20,
    )}
    ${
      order.creditRestored > 0
        ? section(
            noticeHtml(
              `<strong>${formatMoney(order.creditRestored)} in store credit has been restored</strong> to your account and is ready to use on a future order.`,
              NOTICE_GREEN,
            ),
            12,
          )
        : ''
    }
    ${order.paymentMethodSummary ? section(detailsBoxHtml([{ label: 'Refunded to', valueHtml: escapeHtml(order.paymentMethodSummary) }]), 20) : ''}
    ${section(paragraph(`Questions about this cancellation? Email us at <a href="mailto:eastblueinternational@gmail.com" style="color:${MUTED};">eastblueinternational@gmail.com</a>.`, { size: 13 }), 24)}
  `

  const html = emailShell({
    badgeLabel: 'Order cancelled',
    badgeColor: AMBER,
    heading: `Order #EBI-${order.orderNo} has been cancelled`,
    intro: `${order.firstName ? `Hi ${escapeHtml(order.firstName)} — ` : ''}here's a summary of what was cancelled and refunded.`,
    primaryButton: { label: 'View your order', url: orderUrl },
    bodyHtml,
  })

  const text = [
    `Order #EBI-${order.orderNo} has been cancelled${order.firstName ? `, ${order.firstName}` : ''}.`,
    '',
    ...order.items.map((item) => `${item.qty}x ${item.productName} — ${formatMoney(item.unitPrice * item.qty)}`),
    '',
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Shipping: ${formatMoney(order.shippingCost)}`,
    order.tax > 0 ? `Tax: ${formatMoney(order.tax)}` : null,
    `Order total: ${formatMoney(order.total)}`,
    order.cancellationFee > 0 ? `Cancellation fee: -${formatMoney(order.cancellationFee)}` : null,
    '',
    `${formatMoney(order.refundedAmount)} has been refunded to your original payment method${order.cancellationFee > 0 ? ', after the cancellation fee shown above' : ''}. Refunds typically take 5-10 business days to appear on your statement, depending on your bank.`,
    order.creditRestored > 0 ? `${formatMoney(order.creditRestored)} in store credit has been restored to your account and is ready to use on a future order.` : null,
    order.paymentMethodSummary ? `Refunded to: ${order.paymentMethodSummary}` : null,
    '',
    `View your order: ${orderUrl}`,
    'Questions about this cancellation? Email us at eastblueinternational@gmail.com.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: order.email,
      subject: `Order cancelled — #EBI-${order.orderNo}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send cancellation email for order ${order.orderNo}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

export interface PartialRefundEmailData {
  orderId: string
  orderNo: number
  email: string | null
  firstName: string | null
  amount: number
  // Already in its customer-facing form (customerRefundReason in
  // lib/refunds.ts). Null for a refund made in Square's dashboard with no
  // reason: the email then just leaves the reason out.
  reason: string | null
  paymentMethodSummary: string | null
  items: OrderEmailItem[]
}

// Only ever sent from the admin order page's "Send refund email" button
// (adminSendPartialRefundEmail), never automatically when a refund lands.
export async function sendPartialRefundEmail(data: PartialRefundEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from || !data.email) return { status: 'skipped' }

  const orderUrl = await orderViewUrl(data.orderId)
  const amount = formatMoney(data.amount)
  const statementNote = 'It usually shows on your statement in 2–10 business days, depending on your bank.'

  const leadHtml = `
    ${data.reason ? section(`${monoLabel('Reason')}${section(paragraph(escapeHtml(data.reason).replace(/\n/g, '<br>'), { size: 14.5, color: INK }), 6)}`, 22) : ''}
    ${section(
      detailsBoxHtml([
        ...(data.paymentMethodSummary ? [{ label: 'Refunded to', valueHtml: escapeHtml(data.paymentMethodSummary) }] : []),
        { label: 'Amount', valueHtml: `<strong>${amount}</strong>` },
        { label: 'Order', valueHtml: `#EBI-${data.orderNo}` },
      ]),
      22,
    )}
    ${section(paragraph(statementNote, { size: 13.5 }), 14)}
  `
  const bodyHtml = `
    ${itemsSectionHtml('In this order', data.items, { showPrice: false })}
    ${section(paragraph(`Questions about this refund? Email us at <a href="mailto:eastblueinternational@gmail.com" style="color:${MUTED};">eastblueinternational@gmail.com</a>.`, { size: 13 }), 24)}
  `

  const html = emailShell({
    badgeLabel: 'Partial refund',
    badgeColor: GREEN,
    heading: `We've refunded ${amount}`,
    intro: `${data.firstName ? `Hi ${escapeHtml(data.firstName)}, w` : 'W'}e've refunded part of order #EBI-${data.orderNo} to your ${data.paymentMethodSummary ? 'card' : 'original payment method'}.`,
    leadHtml,
    primaryButton: { label: 'View your order', url: orderUrl },
    bodyHtml,
  })

  const text = [
    `We've refunded ${amount}`,
    `${data.firstName ? `Hi ${data.firstName}, w` : 'W'}e've refunded part of order #EBI-${data.orderNo} to your ${data.paymentMethodSummary ? 'card' : 'original payment method'}.`,
    '',
    data.reason ? `Reason: ${data.reason}` : null,
    data.paymentMethodSummary ? `Refunded to: ${data.paymentMethodSummary}` : null,
    `Amount: ${amount}`,
    `Order: #EBI-${data.orderNo}`,
    '',
    statementNote,
    '',
    'In this order:',
    ...data.items.map((item) => `${item.qty}x ${item.productName}`),
    '',
    `View your order: ${orderUrl}`,
    'Questions about this refund? Email us at eastblueinternational@gmail.com.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `Partial refund — #EBI-${data.orderNo}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send partial refund email for order ${data.orderNo}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

// Same best-effort, return-a-result contract as sendOrderConfirmationEmail —
// called right after admin issues store credit (see server/store-credit.ts).
// Only for a fresh grant, never for a deduction/correction or an automatic
// refund reversal — those aren't "you got something" moments for the
// customer the way a new grant is.
interface StoreCreditEmailData {
  email: string
  // users.name is a single free-text field (not split into first/last like
  // the checkout form collects) — whatever they entered at signup.
  name: string | null
  amount: number
}

const LOGIN_URL = 'https://ebicollectibles.com/account/login'
const SITE_URL = 'https://ebicollectibles.com'
const AMBER = '#a85b2c'

export async function sendStoreCreditEmail(data: StoreCreditEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) return { status: 'skipped' }

  // No running balance shown here deliberately — it's one more number that
  // can go stale by the time they read the email (another grant, another
  // order). The button sends them to log in and see the real, current
  // balance on /account/orders instead of trusting a snapshot.
  const leadHtml = `
    ${section(detailsBoxHtml([{ label: 'Amount added', valueHtml: formatMoney(data.amount), large: true }]), 24)}
    ${section(paragraph(`It'll apply automatically at your next checkout — no code needed.`, { size: 13.5 }), 14)}
  `

  const html = emailShell({
    badgeLabel: 'Store credit added',
    badgeColor: GREEN,
    heading: `You've got store credit${data.name ? `, ${escapeHtml(data.name)}` : ''}!`,
    intro: `From EBI Collectibles — ${formatMoney(data.amount)} has been added to your account.`,
    leadHtml,
    primaryButton: { label: 'Log in to your account', url: LOGIN_URL },
  })

  const text = [
    `You've got store credit${data.name ? `, ${data.name}` : ''}!`,
    `${formatMoney(data.amount)} has been added to your account from EBI Collectibles.`,
    '',
    `It'll apply automatically at your next checkout — no code needed.`,
    '',
    `Log in to your account: ${LOGIN_URL}`,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `You've received ${formatMoney(data.amount)} in store credit`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error('Failed to send store credit email:', error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

// Sibling of sendStoreCreditEmail above, for a grant made against an email
// that has no account yet (see adminIssueStoreCreditByEmail in
// server/store-credit.ts) — the credit isn't spendable until an account
// exists under this email, so the CTA here is "create an account" rather
// than "log in," and it links straight to a signup form prefilled with the
// email (see the `email` search param read by routes/account/signup.tsx).
interface PendingStoreCreditEmailData {
  email: string
  amount: number
}

export async function sendPendingStoreCreditEmail(data: PendingStoreCreditEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) return { status: 'skipped' }

  const signupUrl = `${SITE_URL}/account/signup?email=${encodeURIComponent(data.email)}`

  const leadHtml = `
    ${section(detailsBoxHtml([{ label: 'Amount set aside', valueHtml: formatMoney(data.amount), large: true }]), 24)}
    ${section(paragraph(`Create a free account with this email address and it'll be added to your balance automatically — no code needed, it'll just be there.`, { size: 13.5 }), 14)}
  `

  const html = emailShell({
    badgeLabel: 'Store credit waiting for you',
    badgeColor: GREEN,
    heading: `You've got store credit waiting!`,
    intro: `From EBI Collectibles — ${formatMoney(data.amount)} is set aside for you at ${escapeHtml(data.email)}.`,
    leadHtml,
    primaryButton: { label: 'Create your account', url: signupUrl },
  })

  const text = [
    `You've got store credit waiting!`,
    `${formatMoney(data.amount)} has been set aside for you from EBI Collectibles at ${data.email}.`,
    '',
    `Create a free account with this email address and it'll be added to your balance automatically — no code needed.`,
    '',
    `Create your account: ${signupUrl}`,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `${formatMoney(data.amount)} in store credit is waiting for you`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error('Failed to send pending store credit email:', error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

interface DelayEmailData {
  orderNo: number
  orderId: string
  email: string | null
  firstName: string | null
  // Admin-written, free text — this is what actually explains the delay
  // (customs, a manufacturer restock, etc.), since no canned copy fits every
  // reason an order is running late.
  message: string
  items: OrderEmailItem[]
}

// Best-effort, same contract as the other order emails — sent from the
// admin order list for one or more selected orders at once (see
// adminSendDelayNotice), not tied to any status change of its own.
export async function sendShippingDelayEmail(data: DelayEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from || !data.email) return { status: 'skipped' }

  const orderUrl = await orderViewUrl(data.orderId)
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br>')

  // The admin's own explanation leads, right under the intro that points
  // to it ("here's what's going on"), then the button.
  const leadHtml = section(paragraph(messageHtml, { size: 14.5, color: INK }), 18)
  const bodyHtml = itemsSectionHtml('In this order', data.items, { showPrice: false })

  const html = emailShell({
    badgeLabel: 'Order update',
    badgeColor: AMBER,
    heading: `An update on your order${data.firstName ? `, ${escapeHtml(data.firstName)}` : ''}`,
    intro: `Order #EBI-${data.orderNo} hasn't shipped yet — here's what's going on.`,
    leadHtml,
    primaryButton: { label: 'View your order', url: orderUrl },
    bodyHtml,
  })

  const itemsLine = data.items.map((item) => `${item.qty}× ${item.productName}`).join(', ')
  const text = [
    `An update on your order${data.firstName ? `, ${data.firstName}` : ''}`,
    `Order #EBI-${data.orderNo} hasn't shipped yet — here's what's going on. Includes: ${itemsLine}.`,
    '',
    data.message,
    '',
    `View your order: ${orderUrl}`,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `An update on your order — #EBI-${data.orderNo}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send delay email for order ${data.orderNo}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

interface CheckoutIssueEmailData {
  email: string
  firstName: string | null
  // Admin-written, free text — same reasoning as DelayEmailData.message:
  // what actually happened varies, so there's no single canned body that
  // fits every incident. The admin UI seeds a sensible default.
  message: string
}

// Sent from the admin orders page's "Recent payment failures" list (see
// adminSendCheckoutIssueNotice) to someone whose checkout attempt never
// became a real order — there's no order to link to, so unlike
// sendShippingDelayEmail the CTA just points back at the shop.
export async function sendCheckoutIssueEmail(data: CheckoutIssueEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) return { status: 'skipped' }

  const shopUrl = `${SITE_URL}/shop`
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br>')

  const leadHtml = section(paragraph(messageHtml, { size: 14.5, color: INK }), 18)

  const html = emailShell({
    badgeLabel: 'Checkout issue resolved',
    badgeColor: GREEN,
    heading: `Sorry about that${data.firstName ? `, ${escapeHtml(data.firstName)}` : ''}`,
    intro: `We noticed your checkout didn't go through recently — here's what happened.`,
    leadHtml,
    primaryButton: { label: 'Shop again', url: shopUrl },
  })

  const text = [
    `Sorry about that${data.firstName ? `, ${data.firstName}` : ''}`,
    `We noticed your checkout didn't go through recently — here's what happened.`,
    '',
    data.message,
    '',
    `Shop again: ${shopUrl}`,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: 'About your recent checkout attempt',
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send checkout-issue email to ${data.email}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

interface NotifyMeAlertData {
  email: string
  productId: string
  productName: string
  productImg: string | null
  price: number
}

// Sent to everyone who signed up for a specific product once admin
// triggers the blast (see adminSendNotifyMeBlast) — one send per signup,
// never automatic, since admin wants to hand-time the announcement.
export async function sendNotifyMeAlertEmail(data: NotifyMeAlertData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) return { status: 'skipped' }

  const productUrl = `${SITE_URL}/products/${data.productId}`
  // A product announcement, so it's sent as a list email: postal address,
  // Unsubscribe link and the one-click headers (CAN-SPAM, Gmail/Yahoo).
  const extras = await marketingEmailExtras(data.email)

  // Product photo large, on its white tile (photos are shot on white).
  const leadHtml = data.productImg
    ? section(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${BORDER};border-radius:8px;"><tr><td align="center" style="padding:4px;"><img src="${escapeHtml(data.productImg)}" width="500" alt="${escapeHtml(data.productName)}" style="display:block;width:100%;max-width:500px;height:auto;margin:0 auto;border:0;"></td></tr></table>`,
        22,
      )
    : ''

  const html = emailShell({
    badgeLabel: 'Now available',
    badgeColor: GREEN,
    heading: `${escapeHtml(data.productName)} is here!`,
    intro: `You asked to be notified — it's live now.`,
    leadHtml,
    primaryButton: { label: 'Shop now', url: productUrl, inline: true },
    listFooterHtml: extras.footerHtml,
  })

  const text = [
    `${data.productName} is here!`,
    `You asked to be notified — it's live now at ${formatMoney(data.price)}.`,
    '',
    `Shop now: ${productUrl}`,
    '',
    extras.footerText,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: data.email,
      subject: `${data.productName} is now available`,
      html,
      text,
      headers: extras.headers,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send notify-me alert for product ${data.productId}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

// Small grey box under the "Track" button: carrier as the label, tracking
// number in mono, linked to the carrier's own tracking page when we know it.
// One tidy card for a shipment: carrier and tracking number (linked to the
// carrier), with a small "Track package" button under it. Used instead of a
// full-width button, which repeated what the tracking number already says.
function shipmentCardHtml(carrier: string | null, trackingNumber: string | null, trackingUrl: string | null, orderUrl: string | null): string {
  // "Track package" opens the carrier's own tracking page; the site's order
  // page is the quieter link under it (or the button, if there's no carrier link).
  const buttonUrl = trackingUrl ?? orderUrl
  const label = carrier && carrier !== 'Other' ? `${escapeHtml(carrier)} &middot; Tracking` : 'Tracking'
  const number = trackingNumber ? escapeHtml(trackingNumber) : null
  const numberHtml = number
    ? `<div style="${MONO_FONT}font-size:15px;color:${INK};padding-top:7px;letter-spacing:.05em;word-break:break-all;">${
        trackingUrl ? `<a href="${trackingUrl}" style="color:${INK};text-decoration:none;">${number}</a>` : number
      }</div>`
    : ''
  const button = buttonUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr><td bgcolor="${INK}" style="background:${INK};border-radius:3px;"><a href="${buttonUrl}" style="display:inline-block;padding:10px 18px;white-space:nowrap;${BODY_FONT}font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">Track package &rarr;</a></td></tr></table>`
    : ''
  const orderLink =
    orderUrl && trackingUrl
      ? `<p style="${BODY_FONT}font-size:12.5px;margin:12px 0 0;"><a href="${orderUrl}" style="color:${MUTED};text-decoration:underline;">View order details &rarr;</a></p>`
      : ''
  if (!numberHtml && !button) return ''
  return section(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:6px;"><tr><td style="padding:18px 20px;">${monoLabel(label)}${numberHtml}${button}${orderLink}</td></tr></table>`,
    24,
  )
}

interface ShipmentEmailData {
  // The site order this shipment belongs to — the "Track your order" button
  // opens it through the signed order link (see order-link.ts).
  orderId: string
  orderNo: number
  email: string | null
  firstName: string | null
  lastName: string | null
  street: string | null
  apartment: string | null
  city: string | null
  state: string | null
  zip: string | null
  carrier: string | null
  trackingNumber: string | null
  // Whether this shipment covers everything left on the order — false means
  // more items are still to ship separately, which changes the wording so
  // the customer isn't confused into thinking the whole order arrived.
  isFinalShipment: boolean
  items: OrderEmailItem[]
}

// Same best-effort, return-a-result contract as sendOrderConfirmationEmail —
// called right after admin records a shipment (an order can ship in more
// than one package). Reiterates the ship-to address alongside the items in
// *this* shipment and its tracking link (no prices or payment method —
// that's the confirmation email's job), since this may be the only email a
// customer actually opens.
export async function sendShipmentEmail(order: ShipmentEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const trackingUrl = carrierTrackingUrl(order.carrier, order.trackingNumber)
  const orderUrl = await orderViewUrl(order.orderId)

  const address = formatAddress(order)

  const bodyHtml = `
    ${itemsSectionHtml('In this package', order.items, { showPrice: false })}
    ${address ? section(detailsBoxHtml([{ label: 'Ship to', valueHtml: address }]), 28) : ''}
  `

  const badgeLabel = order.isFinalShipment ? 'Shipped' : 'Partially shipped'
  const heading = order.isFinalShipment
    ? `Your order is on its way${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`
    : `Part of your order is on its way${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`
  const intro = order.isFinalShipment
    ? `Order #EBI-${order.orderNo} has shipped.`
    : `This is one shipment from order #EBI-${order.orderNo} — the rest is still on its way separately.`

  const html = emailShell({
    badgeLabel,
    badgeColor: GREEN,
    heading,
    intro,
    afterButtonHtml: shipmentCardHtml(order.carrier, order.trackingNumber, trackingUrl, orderUrl),
    bodyHtml,
  })

  const itemsLine = order.items.map((item) => `${item.qty}× ${item.productName}`).join(', ')
  const text = [
    heading,
    `${intro} Includes: ${itemsLine}.`,
    order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : null,
    trackingUrl ?? null,
    '',
    address ? `Ship to:\n${address.replace(/<br>/g, '\n')}` : null,
    '',
    `View order details: ${orderUrl}`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: order.email,
      subject: order.isFinalShipment ? `Your order has shipped — #EBI-${order.orderNo}` : `Part of your order has shipped — #EBI-${order.orderNo}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error(`Failed to send shipment email for order ${order.orderNo}:`, error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

interface MarketplaceShipmentEmailData {
  // Square's order.source.name (e.g. "DropNotify") — named in the copy so
  // this doesn't read as a generic, unexplained "your order" email to
  // someone who never checked out through this site directly.
  sourceName: string
  // Square's order.reference_id, e.g. "DN-003-BJEY7K" — the other
  // storefront's own order number, if it set one. Null just means no
  // number to show, not an error.
  referenceId: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  street: string | null
  apartment: string | null
  city: string | null
  state: string | null
  zip: string | null
  carrier: string | null
  trackingNumber: string | null
  // Whether this shipment covers everything left on the order — see the
  // same field on ShipmentEmailData above. Marketplace orders can now also
  // go out in more than one package (see marketplace_shipments in schema.ts).
  isFinalShipment: boolean
  items: OrderEmailItem[]
}

// Same shape/contract as sendShipmentEmail, for orders placed on a
// different storefront selling against this same Square inventory (e.g.
// DropNotify) — see marketplace_orders/marketplace_shipments in schema.ts.
export async function sendMarketplaceShipmentEmail(order: MarketplaceShipmentEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const trackingUrl = carrierTrackingUrl(order.carrier, order.trackingNumber)

  const address = formatAddress(order)

  const bodyHtml = `
    ${itemsSectionHtml('In this package', order.items, { showPrice: false })}
    ${address ? section(detailsBoxHtml([{ label: 'Ship to', valueHtml: address }]), 28) : ''}
  `

  const sourceName = escapeHtml(order.sourceName)
  const badgeLabel = order.isFinalShipment ? 'Shipped' : 'Partially shipped'
  const heading = order.isFinalShipment
    ? `Your ${sourceName} order is on its way${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`
    : `Part of your ${sourceName} order is on its way${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`
  const intro = order.isFinalShipment
    ? order.referenceId
      ? `Order ${escapeHtml(order.referenceId)} has shipped.`
      : "Here's what shipped and how to track it."
    : order.referenceId
      ? `This is one shipment from order ${escapeHtml(order.referenceId)} — the rest is still on its way separately.`
      : 'This is one shipment from your order — the rest is still on its way separately.'

  // Marketplace orders aren't site orders, so there's no order page to link
  // to: the main button goes straight to the carrier's tracking page, when
  // the carrier has one.
  const html = emailShell({
    badgeLabel,
    badgeColor: GREEN,
    heading,
    intro,
    afterButtonHtml: shipmentCardHtml(order.carrier, order.trackingNumber, trackingUrl, null),
    bodyHtml,
  })

  const itemsLine = order.items.map((item) => `${item.qty}× ${item.productName}`).join(', ')
  const text = [
    heading,
    `Includes: ${itemsLine}.`,
    order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : null,
    trackingUrl ?? null,
    '',
    address ? `Ship to:\n${address.replace(/<br>/g, '\n')}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: order.email,
      subject: order.isFinalShipment
        ? order.referenceId
          ? `Your order has shipped — ${order.referenceId}`
          : `Your ${order.sourceName} order has shipped`
        : order.referenceId
          ? `Part of your order has shipped — ${order.referenceId}`
          : `Part of your ${order.sourceName} order has shipped`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const error = json?.message || `HTTP ${res.status}`
    console.error('Failed to send marketplace shipment email:', error)
    return { status: 'failed', error }
  }

  const sentJson = await res.json().catch(() => null)
  return { status: 'sent', resendId: sentJson?.id }
}

// The one-time code, big and in mono, in the grey box.
function codeBoxHtml(code: string): string {
  return section(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${SURFACE}" style="background:${SURFACE};border-radius:6px;"><tr><td align="center" style="padding:20px 16px;${MONO_FONT}font-size:34px;font-weight:500;letter-spacing:.2em;color:${INK};text-align:center;">${escapeHtml(code)}</td></tr></table>`,
    24,
  )
}

// Unlike sendOrderConfirmationEmail, this throws on failure — there's no
// other way for the customer to get the code, so the caller (signup/login)
// should surface the error instead of silently leaving them stuck.
export async function sendVerificationCodeEmail(opts: { email: string; code: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  // Falls back to ORDER_FROM_EMAIL if the dedicated account address isn't
  // set, so this keeps working unchanged until that secret is added.
  const from = process.env.ACCOUNT_FROM_EMAIL || process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) {
    throw new Error('Email sending is not configured.')
  }

  const html = emailShell({
    heading: 'Verify your email',
    intro: 'Enter this code to finish setting up your account. It expires in 15 minutes.',
    leadHtml: `${codeBoxHtml(opts.code)}${section(paragraph(`If you didn't request this, you can ignore this email.`, { size: 13 }), 20)}`,
  })

  const text = `Your EBI Collectibles verification code is ${opts.code}. It expires in 15 minutes.`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: opts.email,
      subject: `Your verification code: ${opts.code}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.message || `Failed to send verification email (${res.status}).`)
  }
}

// Same throw-on-failure reasoning as sendVerificationCodeEmail.
export async function sendPasswordResetCodeEmail(opts: { email: string; code: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ACCOUNT_FROM_EMAIL || process.env.ORDER_FROM_EMAIL
  if (!apiKey || !from) {
    throw new Error('Email sending is not configured.')
  }

  const html = emailShell({
    heading: 'Reset your password',
    intro: 'Enter this code to set a new password. It expires in 15 minutes.',
    leadHtml: `${codeBoxHtml(opts.code)}${section(paragraph(`If you didn't request this, you can ignore this email — your password won't change.`, { size: 13 }), 20)}`,
  })

  const text = `Your EBI Collectibles password reset code is ${opts.code}. It expires in 15 minutes.`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: opts.email,
      subject: `Your password reset code: ${opts.code}`,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.message || `Failed to send password reset email (${res.status}).`)
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
