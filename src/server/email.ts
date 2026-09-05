// Plain fetch against Resend's REST API — same pattern as square.ts, no SDK
// so this keeps working unmodified on Cloudflare Workers.

import { formatMoney } from '~/lib/products'

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
  items: OrderEmailItem[]
}

// Best-effort: called right after an order is placed and paid for. A failed
// or skipped send should never affect the order itself — the caller wraps
// this in try/catch and only logs on failure.
export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL

  if (!apiKey || !from || !order.email) return

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e3e6ea;font-size:13.5px;color:#131b28;">${item.qty}× ${escapeHtml(item.productName)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e3e6ea;font-size:13.5px;color:#131b28;text-align:right;white-space:nowrap;">${formatMoney(item.unitPrice * item.qty)}</td>
        </tr>`,
    )
    .join('')

  const summaryRow = (label: string, value: string) => `
    <tr>
      <td style="padding:4px 0;font-size:12.5px;color:#5a6875;">${label}</td>
      <td style="padding:4px 0;font-size:12.5px;color:#5a6875;text-align:right;">${value}</td>
    </tr>`

  const address = [order.street, order.apartment, order.city ? `${order.city} ${order.zip ?? ''}`.trim() : order.zip]
    .filter(Boolean)
    .join('<br>')

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px 20px;">
    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#98a1ab;font-weight:700;">EBI Collectibles</div>
    <h1 style="font-size:20px;margin:12px 0 4px;color:#131b28;">Thanks for your order${order.firstName ? `, ${escapeHtml(order.firstName)}` : ''}!</h1>
    <p style="font-size:13.5px;color:#5a6875;margin:0 0 20px;">Order #EBI-${order.orderNo} is confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      ${itemRows}
    </table>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${summaryRow('Subtotal', formatMoney(order.subtotal))}
      ${summaryRow('Shipping', formatMoney(order.shippingCost))}
      ${summaryRow('Tax', formatMoney(order.tax))}
      <tr>
        <td style="padding:8px 0 0;font-size:14.5px;font-weight:700;color:#131b28;border-top:1px solid #131b28;">Total</td>
        <td style="padding:8px 0 0;font-size:14.5px;font-weight:700;color:#131b28;text-align:right;border-top:1px solid #131b28;">${formatMoney(order.total)}</td>
      </tr>
    </table>
    ${address ? `<p style="font-size:12.5px;color:#5a6875;margin:0 0 4px;font-weight:600;">Shipping to</p><p style="font-size:12.5px;color:#5a6875;margin:0 0 20px;">${address}</p>` : ''}
    <p style="font-size:12px;color:#98a1ab;margin:20px 0 0;">You'll get tracking info by email once your order ships.</p>
  </div>`

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
  ].join('\n')

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
    console.error(`Failed to send confirmation email for order ${order.orderNo}:`, json?.message || res.status)
  }
}

// Unlike sendOrderConfirmationEmail, this throws on failure — there's no
// other way for the customer to get the code, so the caller (signup/login)
// should surface the error instead of silently leaving them stuck.
export async function sendVerificationCodeEmail(opts: { email: string; code: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
