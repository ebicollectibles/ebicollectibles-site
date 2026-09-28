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

export const getMyOrders = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Not logged in.')

  const { getDb } = await import('~/lib/db/client')
  const { orderItems, orders } = await import('~/lib/db/schema')
  const { desc, eq, inArray } = await import('drizzle-orm')
  const db = getDb()

  const orderRows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
  const itemRows =
    orderRows.length === 0
      ? []
      : await db
          .select()
          .from(orderItems)
          .where(
            inArray(
              orderItems.orderId,
              orderRows.map((o) => o.id),
            ),
          )
  const itemsByOrder = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }
  return orderRows.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }))
})

export const getMyOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Not logged in.')

    const { getDb } = await import('~/lib/db/client')
    const { orderItems, orders, shipmentItems, shipments } = await import('~/lib/db/schema')
    const { eq, inArray } = await import('drizzle-orm')
    const db = getDb()

    const [order] = await db.select().from(orders).where(eq(orders.id, data.id)).limit(1)
    if (!order || order.userId !== userId) return null

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, data.id))
    const shipmentRows = await db.select().from(shipments).where(eq(shipments.orderId, data.id))
    const shipmentIds = shipmentRows.map((s) => s.id)
    const shipmentItemRows =
      shipmentIds.length === 0 ? [] : await db.select().from(shipmentItems).where(inArray(shipmentItems.shipmentId, shipmentIds))
    const itemById = new Map(items.map((i) => [i.id, i]))
    const orderShipments = buildShipmentsByOrder(shipmentRows, shipmentItemRows, itemById).get(data.id) ?? []

    return { ...order, items, shipments: orderShipments }
  })
