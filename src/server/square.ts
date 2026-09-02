// Plain fetch against Square's REST API — deliberately avoids the official
// Square Node SDK so this keeps working unmodified on Cloudflare Workers.

interface ChargeResult {
  status: 'paid' | 'test' | 'failed'
  squarePaymentId?: string
  error?: string
}

export async function chargeSquarePayment(opts: {
  sourceId: string | null
  amount: number
  orderNo: number
}): Promise<ChargeResult> {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'

  if (!accessToken || !locationId) {
    // Square isn't configured yet — record the order without charging so the
    // rest of the flow (DB, admin panel) can still be exercised end to end.
    // Set SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID to go live.
    return { status: 'test' }
  }

  if (!opts.sourceId) {
    return { status: 'failed', error: 'Missing payment token from Square Web Payments SDK.' }
  }

  const baseUrl = environment === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'

  const res = await fetch(`${baseUrl}/v2/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': '2025-01-23',
    },
    body: JSON.stringify({
      source_id: opts.sourceId,
      idempotency_key: `ebi-order-${opts.orderNo}`,
      amount_money: {
        amount: Math.round(opts.amount * 100),
        currency: 'USD',
      },
      location_id: locationId,
    }),
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const message = json?.errors?.[0]?.detail || `Square API error (${res.status})`
    return { status: 'failed', error: message }
  }

  return { status: 'paid', squarePaymentId: json?.payment?.id }
}
