import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { asc, eq } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { products as productsTable } from '~/lib/db/schema'
import { overlaySquareData } from './square'
import type { Product } from '~/lib/products'

export const getProducts = createServerFn({ method: 'GET' }).handler(async (): Promise<Product[]> => {
  const db = getDb()
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.published, true))
    .orderBy(asc(productsTable.createdAt))
  return overlaySquareData(rows.map(toProduct))
})

export const getProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Product | null> => {
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    if (!row || !row.published) return null
    const [withLiveStock] = await overlaySquareData([toProduct(row)])
    return withLiveStock
  })

function toProduct(row: typeof productsTable.$inferSelect): Product {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    category: row.category as Product['category'],
    subcategory: row.subcategory as Product['subcategory'],
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    stock: row.stock,
    squareVariationId: row.squareVariationId ?? undefined,
    img: row.img ?? undefined,
    imgTablet: row.imgTablet ?? undefined,
    imgMobile: row.imgMobile ?? undefined,
    imgAlt: row.imgAlt ?? undefined,
    images: row.images,
    description: row.description ?? undefined,
    preorder: row.preorder,
    comingSoon: row.comingSoon,
    placeholder: row.placeholder ?? undefined,
  }
}
