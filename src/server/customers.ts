import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { buildShipmentsByOrder } from '~/lib/shipments'
import { getCurrentUserId } from './customer-auth'
import type { getDb } from '~/lib/db/client'

// Db/schema imports are dynamic (not top-level) throughout this file —
// same reasoning as admin-auth.ts/customer-auth.ts: keeps the Postgres
// driver out of the client bundle. A top-level import here was pulling
// `postgres`/`drizzle-orm/postgres-js` into the browser bundle in dev
// (crashing with "Buffer is not defined", a Node-only global) even though
// every actual DB call only ever happens inside a server-only handler body.

/** Claims any guest orders placed under this email before the account existed. Called from customer-auth.ts's syncClerkUser. */
export async function linkGuestOrders(db: ReturnType<typeof getDb>, userId: string, email: string) {
  const { orders } = await import('~/lib/db/schema')
  const { and, isNull, sql } = await import('drizzle-orm')
  await db
    .update(orders)
    .set({ userId })
    .where(and(sql`lower(${orders.email}) = ${email}`, isNull(orders.userId)))
}

// These two read via the RLS-scoped app_customer role (getCustomerScopedRows,
// see client.ts) instead of the normal Drizzle query builder — drizzle-orm's
// neon-http driver has no transaction support, and the set_config() that
// scopes RLS to this user has to run in the same transaction as the actual
// query (see scripts/rls-setup.sql for the policies this relies on).
type OrderRow = typeof import('~/lib/db/schema').orders.$inferSelect
type OrderItemRow = typeof import('~/lib/db/schema').orderItems.$inferSelect
type ShipmentRow = typeof import('~/lib/db/schema').shipments.$inferSelect
type ShipmentItemRow = typeof import('~/lib/db/schema').shipmentItems.$inferSelect
type RefundEventRow = typeof import('~/lib/db/schema').refundEvents.$inferSelect

export const getMyOrders = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Not logged in.')

  const { getCustomerScopedRows } = await import('~/lib/db/client')
  const [orderRows, itemRows, refundRows] = await getCustomerScopedRows(userId, (sql) => [
    sql`select * from orders where user_id = ${userId} order by created_at desc`,
    sql`select oi.* from order_items oi join orders o on o.id = oi.order_id where o.user_id = ${userId}`,
    sql`select re.* from refund_events re join orders o on o.id = re.order_id where o.user_id = ${userId}`,
  ])
  const orders = orderRows as OrderRow[]
  const items = itemRows as OrderItemRow[]
  const refunds = refundRows as RefundEventRow[]

  const itemsByOrder = new Map<string, OrderItemRow[]>()
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }
  // Same rule as admin's totalRefunded — only a COMPLETED refund counts
  // toward what's shown as actually refunded; a PENDING/REJECTED/FAILED one
  // isn't money back yet.
  const refundedByOrder = new Map<string, number>()
  for (const r of refunds) {
    if (r.status !== 'COMPLETED' || r.orderId == null) continue
    refundedByOrder.set(r.orderId, (refundedByOrder.get(r.orderId) ?? 0) + (r.amount ?? 0))
  }
  // The anchor order (see combineWithOrderId in schema.ts) is always one of
  // this customer's own orders too, so it's already in `orders` above —
  // no extra query needed to label it by order number. Carrying its status
  // too, not just its number, so the UI can hide the "waiting to ship
  // together" note if that order was cancelled out from under this one —
  // without it, a customer would see a stale promise to combine with an
  // order that's never going to ship.
  const orderNoById = new Map(orders.map((o) => [o.id, o.orderNo]))
  const orderStatusById = new Map(orders.map((o) => [o.id, o.fulfillmentStatus]))
  return orders.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
    totalRefunded: refundedByOrder.get(order.id) ?? 0,
    combineWithOrderNo: order.combineWithOrderId ? (orderNoById.get(order.combineWithOrderId) ?? null) : null,
    combineWithOrderStatus: order.combineWithOrderId ? (orderStatusById.get(order.combineWithOrderId) ?? null) : null,
  }))
})

// Used by checkout.tsx to waive the flat shipping rate when this account
// already has an order nothing has shipped on yet — it can go in the same
// box, so charging a second flat rate would just be double-charging for
// one shipment. 'pending' specifically (not 'partially_shipped') — once
// anything has gone out the door, the rest of that order may ship
// separately anyway, so there's no guaranteed box left to combine into.
// hasPreorder must match the pending order's own snapshot — a pre-order
// ships whenever its release date arrives, which is nothing like an
// in-stock order's near-immediate ship time, so the two can never
// meaningfully combine into one box (same reasoning as MIXED_PREORDER_ERROR
// blocking them from sharing a cart in the first place).
// False for a guest/signed-out shopper — this is account-scoped only; a
// guest typing the same email as a past order doesn't get it, since email
// alone isn't a reliable enough identity check for waiving a real charge.
//
// mismatchedPending (a pending order of the OPPOSITE type) is reported
// alongside waived so checkout.tsx can explain itself when shipping *isn't*
// waived — a customer who got free shipping once on a matching order could
// otherwise reasonably assume "I have a pending order" is enough on its own
// and not understand why a mismatched one didn't also get it. Both checks
// share one round trip rather than two separate calls.
export const hasPendingOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ hasPreorder: z.boolean() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) return { waived: false, mismatchedPending: false, combineCandidate: null }

    const { getCustomerScopedRows } = await import('~/lib/db/client')
    const [matchingRows, mismatchedRows] = await getCustomerScopedRows(userId, (sql) => [
      sql`select id from orders where user_id = ${userId} and fulfillment_status = 'pending' and has_preorder = ${data.hasPreorder} limit 1`,
      sql`select id, order_no from orders where user_id = ${userId} and fulfillment_status = 'pending' and has_preorder = ${!data.hasPreorder} limit 1`,
    ])
    const mismatched = mismatchedRows[0] as { id: string; orderNo: number } | undefined
    // Only surfaced in one direction — see resolveCombineWithOrder in
    // server/orders.ts for why only an existing pending pre-order can be
    // waited on (mismatched here is a pre-order exactly when the current
    // cart, hasPreorder, is not — i.e. data.hasPreorder is false), never
    // the reverse.
    const combineCandidate = !data.hasPreorder && mismatched ? { id: mismatched.id, orderNo: mismatched.orderNo } : null
    return { waived: matchingRows.length > 0, mismatchedPending: mismatchedRows.length > 0, combineCandidate }
  })

// Same check as hasPendingOrder, but by typed email instead of a signed-in
// session — used only to softly prompt a guest checkout shopper to log in
// ("you have a pending order, sign in to combine shipping"), never to
// actually waive anything (placeOrder's server-side recompute only ever
// trusts sessionUserId, same as before — see resolveFreeShippingOverride in
// server/orders.ts). This is a narrower version of a lookup the app already
// does silently at order-placement time (a guest checking out under an
// email with an existing account gets linked to it without being told) —
// surfacing it as a prompt here doesn't expose anything that wasn't already
// implicitly true of how guest checkout works.
export const hasPendingOrderForEmail = createServerFn({ method: 'GET' })
  .validator(z.object({ email: z.string().trim().email(), hasPreorder: z.boolean() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { orders, users } = await import('~/lib/db/schema')
    const { and, eq, sql } = await import('drizzle-orm')
    const db = getDb()
    const [row] = await db
      .select({ id: orders.id })
      .from(users)
      .innerJoin(orders, eq(orders.userId, users.id))
      .where(and(sql`lower(${users.email}) = ${data.email.trim().toLowerCase()}`, eq(orders.fulfillmentStatus, 'pending'), eq(orders.hasPreorder, data.hasPreorder)))
      .limit(1)
    return !!row
  })

export const getMyOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Not logged in.')

    const { getCustomerScopedRows } = await import('~/lib/db/client')
    const [orderRows, itemRows, shipmentRows, shipmentItemRows, refundRows] = await getCustomerScopedRows(userId, (sql) => [
      sql`select * from orders where id = ${data.id} and user_id = ${userId} limit 1`,
      sql`select * from order_items where order_id = ${data.id}`,
      sql`select * from shipments where order_id = ${data.id}`,
      sql`select si.* from shipment_items si join shipments s on s.id = si.shipment_id where s.order_id = ${data.id}`,
      sql`select * from refund_events where order_id = ${data.id} order by created_at desc`,
    ])
    const order = (orderRows as OrderRow[])[0]
    if (!order) return null

    const items = itemRows as OrderItemRow[]
    const shipments = shipmentRows as ShipmentRow[]
    const shipmentItems = shipmentItemRows as ShipmentItemRow[]
    const refunds = refundRows as RefundEventRow[]
    const itemById = new Map(items.map((i) => [i.id, i]))
    const orderShipments = buildShipmentsByOrder(shipments, shipmentItems, itemById).get(data.id) ?? []
    const totalRefunded = refunds.filter((r) => r.status === 'COMPLETED').reduce((t, r) => t + (r.amount ?? 0), 0)

    // Looked up separately since this order's own id is needed first to
    // know whether there's an anchor to look up at all — the anchor (see
    // combineWithOrderId in schema.ts) is always this same customer's own
    // order too, so the RLS policy on orders already permits reading it.
    // Carrying its status too, not just its number, so the UI can hide the
    // "waiting to ship together" note if that order was cancelled out from
    // under this one.
    let combineWithOrderNo: number | null = null
    let combineWithOrderStatus: string | null = null
    if (order.combineWithOrderId) {
      const [[anchorRow]] = await getCustomerScopedRows(userId, (sql) => [
        sql`select order_no, fulfillment_status from orders where id = ${order.combineWithOrderId} and user_id = ${userId} limit 1`,
      ])
      const anchor = anchorRow as { orderNo: number; fulfillmentStatus: string } | undefined
      combineWithOrderNo = anchor?.orderNo ?? null
      combineWithOrderStatus = anchor?.fulfillmentStatus ?? null
    }

    return { ...order, items, shipments: orderShipments, totalRefunded, combineWithOrderNo, combineWithOrderStatus }
  })
