// Plain fetch against Resend's REST API — same pattern as square.ts, no SDK
// so this keeps working unmodified on Cloudflare Workers.

import { carrierTrackingUrl } from '~/lib/carriers'
import { formatMoney } from '~/lib/products'

// Shared visual language for every transactional email — same palette as
// the site itself (see src/styles/app.css :root), same header/footer shell,
// same items-table shape — so order confirmation and shipment emails read
// as one consistent system rather than two different designs. Table-based
// layout throughout (no flex/grid) since Outlook's rendering engine doesn't
// support either.
const INK = '#131b28'
const MUTED = '#5a6875'
const BORDER = '#e3e6ea'
const SURFACE = '#f6f7f8'
const GREEN = '#3f7a63'

function emailShell(opts: { badgeLabel: string; badgeColor: string; heading: string; intro: string; bodyHtml: string }): string {
  return `
  <div style="background:${SURFACE};padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ${BORDER};border-radius:6px;overflow:hidden;">
      <tr>
        <td style="background:${INK};padding:22px 32px;">
          <span style="font-size:13px;font-weight:700;letter-spacing:0.1em;color:#ffffff;text-transform:uppercase;">EBI Collectibles</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${opts.badgeColor};border:1px solid ${opts.badgeColor};border-radius:2px;padding:4px 9px;">${opts.badgeLabel}</span>
          <h1 style="font-size:21px;margin:14px 0 4px;color:${INK};">${opts.heading}</h1>
          <p style="font-size:13.5px;color:${MUTED};margin:0 0 24px;">${opts.intro}</p>
          ${opts.bodyHtml}
        </td>
      </tr>
    </table>
  </div>`
}

function formatAddress(order: { street: string | null; apartment: string | null; city: string | null; zip: string | null }): string | null {
  const address = [order.street, order.apartment, order.city ? `${order.city} ${order.zip ?? ''}`.trim() : order.zip]
    .filter(Boolean)
    .join('<br>')
  return address || null
}

function itemsTableHtml(items: OrderEmailItem[], opts: { showPrice?: boolean } = {}): string {
  const showPrice = opts.showPrice ?? true

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13.5px;color:${INK};">${escapeHtml(item.productName)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13.5px;color:${MUTED};text-align:center;white-space:nowrap;">${item.qty}</td>
          ${showPrice ? `<td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13.5px;color:${INK};text-align:right;white-space:nowrap;">${formatMoney(item.unitPrice * item.qty)}</td>` : ''}
        </tr>`,
    )
    .join('')

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:0 0 8px;border-bottom:1px solid ${INK};font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">Item</td>
        <td style="padding:0 0 8px;border-bottom:1px solid ${INK};font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};text-align:center;">Qty</td>
        ${showPrice ? `<td style="padding:0 0 8px;border-bottom:1px solid ${INK};font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};text-align:right;">Price</td>` : ''}
      </tr>
      ${rows}
    </table>`
}

function labelValueBlock(label: string, valueHtml: string): string {
  return `<p style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};margin:0 0 4px;">${label}</p><p style="font-size:13.5px;color:${INK};margin:0 0 20px;">${valueHtml}</p>`
}

interface OrderEmailItem {
  productName: string
  qty: number
  unitPrice: number
}

interface OrderEmailData {
  orderNo: number
  email: string | null
  firstName: string | null
  lastName: string | null
  street: string | null
  apartment: string | null
  city: string | null
  zip: string | null
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  paymentMethodSummary: string | null
  items: OrderEmailItem[]
}

export type EmailSendResult = { status: 'sent' | 'failed' | 'skipped'; error?: string }

// Best-effort: called right after an order is placed and paid for. A failed
// or skipped send should never affect the order itself — the caller logs
// the returned status/error to email_events instead of this throwing.
export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const summaryRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:4px 0;font-size:${strong ? '14px' : '12.5px'};font-weight:${strong ? '700' : '400'};color:${strong ? INK : MUTED};${strong ? `border-top:1px solid ${INK};padding-top:10px;` : ''}">${label}</td>
      <td style="padding:4px 0;font-size:${strong ? '14px' : '12.5px'};font-weight:${strong ? '700' : '400'};color:${strong ? INK : MUTED};text-align:right;${strong ? `border-top:1px solid ${INK};padding-top:10px;` : ''}">${value}</td>
    </tr>`

  const address = formatAddress(order)

  const bodyHtml = `
    ${itemsTableHtml(order.items)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${summaryRow('Subtotal', formatMoney(order.subtotal))}
      ${summaryRow('Shipping', formatMoney(order.shippingCost))}
      ${summaryRow('Tax', formatMoney(order.tax))}
      ${summaryRow('Total', formatMoney(order.total), true)}
    </table>
    ${address ? labelValueBlock('Ship to', address) : ''}
    ${order.paymentMethodSummary ? labelValueBlock('Payment method', escapeHtml(order.paymentMethodSummary)) : ''}
  `

  const html = emailShell({
    badgeLabel: 'Order confirmed',
    badgeColor: GREEN,
    heading: `Thanks for your order${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`,
    intro: `Order #EBI-${order.orderNo} is confirmed — here's what's in it.`,
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
    `Tax: ${formatMoney(order.tax)}`,
    `Total: ${formatMoney(order.total)}`,
    '',
    address ? `Ship to:\n${address.replace(/<br>/g, '\n')}` : null,
    order.paymentMethodSummary ? `Payment method: ${order.paymentMethodSummary}` : null,
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

  return { status: 'sent' }
}

interface ShipmentEmailData {
  orderNo: number
  email: string | null
  firstName: string | null
  street: string | null
  apartment: string | null
  city: string | null
  zip: string | null
  carrier: string | null
  trackingNumber: string | null
  items: OrderEmailItem[]
}

// Same best-effort, return-a-result contract as sendOrderConfirmationEmail —
// called right after admin marks an order shipped. Reiterates the ship-to
// address alongside the items and tracking link (no prices or payment
// method — that's the confirmation email's job), since this may be the
// only email a customer actually opens.
export async function sendShipmentEmail(order: ShipmentEmailData): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return { status: 'skipped' }

  const trackingUrl = carrierTrackingUrl(order.carrier, order.trackingNumber)
  const trackingValue = order.trackingNumber
    ? trackingUrl
      ? `<a href="${trackingUrl}" style="color:${GREEN};font-weight:600;">${escapeHtml(order.trackingNumber)}</a>`
      : escapeHtml(order.trackingNumber)
    : null

  const address = formatAddress(order)

  const bodyHtml = `
    ${itemsTableHtml(order.items, { showPrice: false })}
    ${trackingValue ? labelValueBlock('Tracking number', trackingValue) : ''}
    ${address ? labelValueBlock('Ship to', address) : ''}
  `

  const html = emailShell({
    badgeLabel: 'Shipped',
    badgeColor: GREEN,
    heading: `Your order is on its way${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!`,
    intro: `Order #EBI-${order.orderNo} has shipped.`,
    bodyHtml,
  })

  const itemsLine = order.items.map((item) => `${item.qty}× ${item.productName}`).join(', ')
  const text = [
    `Your order is on its way${order.firstName ? `, ${order.firstName}` : ''}!`,
    `Order #EBI-${order.orderNo} has shipped: ${itemsLine}.`,
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
      subject: `Your order has shipped — #EBI-${order.orderNo}`,
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

  return { status: 'sent' }
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

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px 20px;">
    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#98a1ab;font-weight:700;">EBI Collectibles</div>
    <h1 style="font-size:20px;margin:12px 0 4px;color:#131b28;">Verify your email</h1>
    <p style="font-size:13.5px;color:#5a6875;margin:0 0 20px;">Enter this code to finish setting up your account. It expires in 15 minutes.</p>
    <div style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;letter-spacing:0.2em;color:#131b28;background:#f6f7f8;padding:16px 20px;text-align:center;border-radius:4px;">${opts.code}</div>
    <p style="font-size:12px;color:#98a1ab;margin:20px 0 0;">If you didn't request this, you can ignore this email.</p>
  </div>`

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

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px 20px;">
    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#98a1ab;font-weight:700;">EBI Collectibles</div>
    <h1 style="font-size:20px;margin:12px 0 4px;color:#131b28;">Reset your password</h1>
    <p style="font-size:13.5px;color:#5a6875;margin:0 0 20px;">Enter this code to set a new password. It expires in 15 minutes.</p>
    <div style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;letter-spacing:0.2em;color:#131b28;background:#f6f7f8;padding:16px 20px;text-align:center;border-radius:4px;">${opts.code}</div>
    <p style="font-size:12px;color:#98a1ab;margin:20px 0 0;">If you didn't request this, you can ignore this email — your password won't change.</p>
  </div>`

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
