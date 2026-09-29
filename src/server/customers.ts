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

export const getMyOrders = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Not logged in.')

  const { getCustomerScopedRows } = await import('~/lib/db/client')
  const [orderRows, itemRows] = await getCustomerScopedRows(userId, (sql) => [
    sql`select * from orders where user_id = ${userId} order by created_at desc`,
    sql`select oi.* from order_items oi join orders o on o.id = oi.order_id where o.user_id = ${userId}`,
  ])
  const orders = orderRows as OrderRow[]
  const items = itemRows as OrderItemRow[]

  const itemsByOrder = new Map<string, OrderItemRow[]>()
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }
  return orders.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }))
})

export const getMyOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Not logged in.')

    const { getCustomerScopedRows } = await import('~/lib/db/client')
    const [orderRows, itemRows, shipmentRows, shipmentItemRows] = await getCustomerScopedRows(userId, (sql) => [
      sql`select * from orders where id = ${data.id} and user_id = ${userId} limit 1`,
      sql`select * from order_items where order_id = ${data.id}`,
      sql`select * from shipments where order_id = ${data.id}`,
      sql`select si.* from shipment_items si join shipments s on s.id = si.shipment_id where s.order_id = ${data.id}`,
    ])
    const order = (orderRows as OrderRow[])[0]
    if (!order) return null

    const items = itemRows as OrderItemRow[]
    const shipments = shipmentRows as ShipmentRow[]
    const shipmentItems = shipmentItemRows as ShipmentItemRow[]
    const itemById = new Map(items.map((i) => [i.id, i]))
    const orderShipments = buildShipmentsByOrder(shipments, shipmentItems, itemById).get(data.id) ?? []

    return { ...order, items, shipments: orderShipments }
  })
