import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { asc, desc, eq } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { orderItems, orders, products as productsTable } from '~/lib/db/schema'
import { assertAdmin } from './admin-auth'

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(['Booster box', 'Special box', 'Figures']),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative(),
  img: z.string().optional(),
  preorder: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
})

export const adminListProducts = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db.select().from(productsTable).orderBy(asc(productsTable.createdAt))
})

export const adminGetProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    return row ?? null
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
