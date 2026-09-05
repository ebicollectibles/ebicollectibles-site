import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { asc, desc, eq, inArray, or, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import {
  authEvents,
  orderItems,
  orderStatusEvents,
  orders,
  paymentAttempts,
  productEditEvents,
  products as productsTable,
  refundEvents,
  users,
} from '~/lib/db/schema'
import { assertAdmin } from './admin-auth'
import { overlaySquareData, searchSquareCatalogItems } from './square'

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(['Booster box', 'Special box', 'Figures', 'Acrylic']),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative(),
  squareVariationId: z.string().nullable().optional(),
  img: z.string().optional(),
  imgTablet: z.string().optional(),
  imgMobile: z.string().optional(),
  imgAlt: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  preorder: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
})

export const adminListProducts = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const rows = await db.select().from(productsTable).orderBy(asc(productsTable.createdAt))
  return overlaySquareData(rows)
})

export const adminGetProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    if (!row) return null
    const [withLiveStock] = await overlaySquareData([row])

    const editHistory = await db
      .select({ field: productEditEvents.field, oldValue: productEditEvents.oldValue, newValue: productEditEvents.newValue, createdAt: productEditEvents.createdAt })
      .from(productEditEvents)
      .where(eq(productEditEvents.productId, data.id))
      .orderBy(desc(productEditEvents.createdAt))
      .limit(50)

    return { ...withLiveStock, editHistory }
  })

export const adminSearchSquareCatalog = createServerFn({ method: 'GET' })
  .validator(z.object({ query: z.string().optional() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    return searchSquareCatalogItems(data.query)
  })

export const adminCreateProduct = createServerFn({ method: 'POST' })
  .validator(productSchema)
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.insert(productsTable).values(data)
    return { ok: true }
  })

const TRACKED_EDIT_FIELDS = ['price', 'compareAtPrice', 'stock'] as const

export const adminUpdateProduct = createServerFn({ method: 'POST' })
  .validator(productSchema.extend({ originalId: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const { originalId, ...rest } = data

    const [before] = await db.select().from(productsTable).where(eq(productsTable.id, originalId)).limit(1)

    await db
      .update(productsTable)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(productsTable.id, originalId))

    if (before) {
      const edits = TRACKED_EDIT_FIELDS.filter((field) => before[field] !== rest[field]).map((field) => ({
        productId: originalId,
        productName: rest.name,
        field,
        oldValue: before[field] == null ? null : String(before[field]),
        newValue: rest[field] == null ? null : String(rest[field]),
      }))
      if (edits.length > 0) await db.insert(productEditEvents).values(edits)
    }

    return { ok: true }
  })

export const adminDeleteProduct = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.delete(productsTable).where(eq(productsTable.id, data.id))
    return { ok: true }
  })

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>()
  for (const row of rows) {
    const k = key(row)
    const list = map.get(k) ?? []
    list.push(row)
    map.set(k, list)
  }
  return map
}

export const adminListOrders = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  const itemRows = await db.select().from(orderItems)
  const statusRows = await db
    .select({ orderId: orderStatusEvents.orderId, status: orderStatusEvents.status, createdAt: orderStatusEvents.createdAt })
    .from(orderStatusEvents)
    .orderBy(asc(orderStatusEvents.createdAt))
  const refundRows = await db
    .select({ orderId: refundEvents.orderId, amount: refundEvents.amount, status: refundEvents.status, createdAt: refundEvents.createdAt })
    .from(refundEvents)
    .orderBy(desc(refundEvents.createdAt))

  const itemsByOrder = groupBy(itemRows, (i) => i.orderId)
  const statusByOrder = groupBy(statusRows, (s) => s.orderId)
  const refundsByOrder = groupBy(refundRows.filter((r) => r.orderId), (r) => r.orderId as string)

  return orderRows.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
    statusHistory: statusByOrder.get(order.id) ?? [],
    refunds: refundsByOrder.get(order.id) ?? [],
  }))
})

export const adminUpdateOrderStatus = createServerFn({ method: 'POST' })
  .validator(z.object({ orderId: z.string(), status: z.enum(['pending', 'shipped', 'cancelled']) }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.update(orders).set({ fulfillmentStatus: data.status }).where(eq(orders.id, data.orderId))
    await db.insert(orderStatusEvents).values({ orderId: data.orderId, status: data.status })
    return { ok: true }
  })

export const adminListPaymentFailures = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({ id: paymentAttempts.id, email: paymentAttempts.email, amount: paymentAttempts.amount, errorMessage: paymentAttempts.errorMessage, createdAt: paymentAttempts.createdAt })
    .from(paymentAttempts)
    .orderBy(desc(paymentAttempts.createdAt))
    .limit(30)
})

export const adminListCustomers = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const customerRows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      hasPassword: sql<boolean>`${users.passwordHash} is not null`,
      hasGoogle: sql<boolean>`${users.googleId} is not null`,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  const counts = await db
    .select({ userId: orders.userId, count: sql<number>`count(*)::int` })
    .from(orders)
    .where(sql`${orders.userId} is not null`)
    .groupBy(orders.userId)
  const countByUser = new Map(counts.map((c) => [c.userId, c.count]))

  return customerRows.map((c) => ({ ...c, orderCount: countByUser.get(c.id) ?? 0 }))
})

export const adminGetCustomer = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [customer] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        hasPassword: sql<boolean>`${users.passwordHash} is not null`,
        hasGoogle: sql<boolean>`${users.googleId} is not null`,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1)
    if (!customer) return null

    const authEventRows = await db
      .select({ type: authEvents.type, createdAt: authEvents.createdAt })
      .from(authEvents)
      .where(eq(authEvents.userId, data.id))
      .orderBy(desc(authEvents.createdAt))
      .limit(50)

    const failedPayments = await db
      .select({ amount: paymentAttempts.amount, errorMessage: paymentAttempts.errorMessage, createdAt: paymentAttempts.createdAt })
      .from(paymentAttempts)
      .where(or(eq(paymentAttempts.userId, data.id), eq(paymentAttempts.email, customer.email)))
      .orderBy(desc(paymentAttempts.createdAt))
      .limit(50)

    const events = [
      ...authEventRows.map((e) => ({ type: e.type, createdAt: e.createdAt, detail: null as string | null })),
      ...failedPayments.map((p) => ({ type: 'payment_failed', createdAt: p.createdAt, detail: p.errorMessage })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const orderRows = await db.select().from(orders).where(eq(orders.userId, data.id)).orderBy(desc(orders.createdAt))
    const orderIds = orderRows.map((o) => o.id)
    const itemRows = orderIds.length === 0 ? [] : await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    const statusRows =
      orderIds.length === 0
        ? []
        : await db
            .select({ orderId: orderStatusEvents.orderId, status: orderStatusEvents.status, createdAt: orderStatusEvents.createdAt })
            .from(orderStatusEvents)
            .where(inArray(orderStatusEvents.orderId, orderIds))
            .orderBy(asc(orderStatusEvents.createdAt))

    const itemsByOrder = groupBy(itemRows, (i) => i.orderId)
    const statusByOrder = groupBy(statusRows, (s) => s.orderId)

    return {
      customer,
      orders: orderRows.map((order) => ({
        ...order,
        items: itemsByOrder.get(order.id) ?? [],
        statusHistory: statusByOrder.get(order.id) ?? [],
      })),
      events,
    }
  })
