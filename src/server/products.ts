import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { asc, eq } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { products as productsTable } from '~/lib/db/schema'
import type { Product } from '~/lib/products'

export const getProducts = createServerFn({ method: 'GET' }).handler(async (): Promise<Product[]> => {
  const db = getDb()
  const rows = await db.select().from(productsTable).orderBy(asc(productsTable.createdAt))
  return rows.map(toProduct)
})

export const getProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Product | null> => {
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    return row ? toProduct(row) : null
  })

function toProduct(row: typeof productsTable.$inferSelect): Product {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.type as Product['type'],
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    stock: row.stock,
    img: row.img ?? undefined,
    images: row.images,
    preorder: row.preorder,
    placeholder: row.placeholder ?? undefined,
  }
}
