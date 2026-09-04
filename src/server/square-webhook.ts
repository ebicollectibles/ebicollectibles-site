// Handles Square's refund webhook. This is invoked directly from the custom
// server entry (src/server.ts) — it is NOT a createServerFn, since Square
// POSTs a raw signed JSON body directly to this URL, not through TanStack's
// client RPC call format. DB/schema imports are dynamic (not top-level),
// matching the pattern used elsewhere in src/server/ for any plain exported
// function that might be reachable from client-rendered code — see
// customer-auth.ts for the full reasoning.

const SQUARE_SIGNATURE_HEADER = 'x-square-hmacsha256-signature'

async function verifySquareSignature(rawBody: string, signatureHeader: string | null, requestUrl: string): Promise<boolean> {
  const signingKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  if (!signingKey || !signatureHeader) return false

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(signingKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signatureBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(requestUrl + rawBody))
  const expected = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
  return expected === signatureHeader
}

export async function handleSquareWebhook(request: Request): Promise<Response> {
  const rawBody = await request.text()
  const signature = request.headers.get(SQUARE_SIGNATURE_HEADER)

  const valid = await verifySquareSignature(rawBody, signature, request.url)
  if (!valid) {
    return new Response('Invalid signature', { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const type = event?.type as string | undefined
  if (type === 'refund.created' || type === 'refund.updated') {
    const refund = event?.data?.object?.refund
    if (refund?.id) {
      const { getDb } = await import('~/lib/db/client')
      const { orders, refundEvents } = await import('~/lib/db/schema')
      const { eq } = await import('drizzle-orm')
      const db = getDb()

      const squarePaymentId: string | undefined = refund.payment_id
      let orderId: string | null = null
      if (squarePaymentId) {
        const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.squarePaymentId, squarePaymentId)).limit(1)
        orderId = order?.id ?? null
      }

      const amount = refund.amount_money?.amount != null ? refund.amount_money.amount / 100 : null
      const squareRefundId: string = refund.id

      const [existing] = await db.select({ id: refundEvents.id }).from(refundEvents).where(eq(refundEvents.squareRefundId, squareRefundId)).limit(1)
      if (existing) {
        await db
          .update(refundEvents)
          .set({ status: refund.status ?? null, amount, reason: refund.reason ?? null })
          .where(eq(refundEvents.id, existing.id))
      } else {
        await db.insert(refundEvents).values({
          orderId,
          squarePaymentId: squarePaymentId ?? null,
          squareRefundId,
          amount,
          status: refund.status ?? null,
          reason: refund.reason ?? null,
        })
      }
    }
  }

  return new Response('ok', { status: 200 })
}
