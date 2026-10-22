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

  // crypto.subtle.verify does the HMAC comparison itself (constant-time,
  // not a `===` on the computed digest) — a plain string/byte compare here
  // would let an attacker recover the correct signature one byte at a time
  // via response-timing differences.
  let signatureBytes: Uint8Array
  try {
    signatureBytes = Uint8Array.from(atob(signatureHeader), (c) => c.charCodeAt(0))
  } catch {
    return false // not valid base64 — definitely not a real Square signature
  }

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(signingKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  return crypto.subtle.verify('HMAC', key, signatureBytes as BufferSource, new TextEncoder().encode(requestUrl + rawBody))
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
      const { orders, refundEvents, storeCreditBalances, storeCreditEvents } = await import('~/lib/db/schema')
      const { eq, sql } = await import('drizzle-orm')
      const db = getDb()

      const squarePaymentId: string | undefined = refund.payment_id
      let orderId: string | null = null
      if (squarePaymentId) {
        const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.squarePaymentId, squarePaymentId)).limit(1)
        orderId = order?.id ?? null
      }

      const amount = refund.amount_money?.amount != null ? refund.amount_money.amount / 100 : null
      const squareRefundId: string = refund.id

      const [existing] = await db.select({ id: refundEvents.id, status: refundEvents.status }).from(refundEvents).where(eq(refundEvents.squareRefundId, squareRefundId)).limit(1)
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

      // Auto-restore store credit only on this refund's first transition to
      // COMPLETED (guards against the webhook firing again for the same
      // status — Square retries and re-sends updates), and only when it's a
      // FULL refund of what was actually charged to the card (amountDue,
      // not the order's gross total — see server/store-credit.ts). A
      // partial refund doesn't auto-restore anything; that's a manual admin
      // action, since guessing the right split would be too easy to get
      // wrong with real money.
      const justCompleted = refund.status === 'COMPLETED' && existing?.status !== 'COMPLETED'
      if (justCompleted && orderId && amount != null) {
        const [order] = await db
          .select({ userId: orders.userId, total: orders.total, creditApplied: orders.creditApplied })
          .from(orders)
          .where(eq(orders.id, orderId))
          .limit(1)
        const amountCharged = order ? order.total - order.creditApplied : null
        if (order?.userId && order.creditApplied > 0 && amountCharged != null && amount >= amountCharged - 0.005) {
          await db
            .insert(storeCreditBalances)
            .values({ userId: order.userId, balance: order.creditApplied })
            .onConflictDoUpdate({
              target: storeCreditBalances.userId,
              set: { balance: sql`${storeCreditBalances.balance} + ${order.creditApplied}`, updatedAt: new Date() },
            })
          await db.insert(storeCreditEvents).values({
            userId: order.userId,
            type: 'reversed',
            amount: order.creditApplied,
            orderId,
            reason: 'Full refund',
          })
        }
      }
    }
  } else if (type === 'inventory.count.updated') {
    // The actual DropNotify restock trigger for sellers who manage stock in
    // Square directly rather than by editing a product's stock field here —
    // overlaySquareData (square.ts) only reads Square's live count at
    // render time, it never writes it back to the DB, so admin.ts's
    // claim/rearm calls (which only fire from a product-form save) would
    // otherwise never see a Square-side restock at all. This event type has
    // to be added to the webhook subscription's event list in the Square
    // Developer Dashboard (Webhooks → the existing subscription → event
    // types) before Square will actually start sending it — see the
    // conversation this was built from.
    //
    // Square reports one or more counts per event, one per inventory
    // *state* a variation can be in (IN_STOCK, COMMITTED, WASTE, custom
    // states, etc.) — only IN_STOCK is "available to sell," so every other
    // state is ignored here. quantity arrives as a decimal string per
    // Square's convention, not a number.
    const counts = event?.data?.object?.inventory_counts
    if (Array.isArray(counts)) {
      const { handleSquareInventoryCountUpdate } = await import('./discord-webhook')
      const locationId = process.env.SQUARE_LOCATION_ID
      for (const count of counts) {
        if (count?.state !== 'IN_STOCK') continue
        // Same single-location assumption the rest of this app makes
        // everywhere else (searchMarketplaceOrders, overlaySquareData,
        // etc.) — only relevant if the merchant account ever has more than
        // one Square location.
        if (locationId && count?.location_id && count.location_id !== locationId) continue
        const catalogObjectId: string | undefined = count?.catalog_object_id
        const quantity = Number(count?.quantity)
        if (!catalogObjectId || !Number.isFinite(quantity)) continue
        try {
          await handleSquareInventoryCountUpdate(catalogObjectId, quantity)
        } catch (err) {
          console.error(`Failed to process inventory.count.updated for ${catalogObjectId}:`, err)
        }
      }
    }
  }

  return new Response('ok', { status: 200 })
}
