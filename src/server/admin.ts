import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { orderItems, orders, products as productsTable, users } from '~/lib/db/schema'
import { assertAdmin } from './admin-auth'
import { overlaySquareStock, searchSquareCatalogItems } from './square'

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
  imgAlt: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  preorder: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
})

export const adminListProducts = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const rows = await db.select().from(productsTable).orderBy(asc(productsTable.createdAt))
  return overlaySquareStock(rows)
})

export const adminGetProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    if (!row) return null
    const [withLiveStock] = await overlaySquareStock([row])
    return withLiveStock
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

export const adminUpdateProduct = createServerFn({ method: 'POST' })
  .validator(productSchema.extend({ originalId: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const { originalId, ...rest } = data
    await db
      .update(productsTable)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(productsTable.id, originalId))
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

export const adminListOrders = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  const itemRows = await db.select().from(orderItems)
  const itemsByOrder = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }
  return orderRows.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }))
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
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1)
    if (!customer) return null

    const orderRows = await db.select().from(orders).where(eq(orders.userId, data.id)).orderBy(desc(orders.createdAt))
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

    return {
      customer,
      orders: orderRows.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] })),
    }
  })
