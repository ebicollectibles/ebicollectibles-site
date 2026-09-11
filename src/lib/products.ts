export const PRODUCT_CATEGORIES = ['Chinese Pokémon Products', 'Acrylic Cases'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export type ProductSubcategory = 'Gem Series' | 'CSV Series' | 'Blind Box' | 'ETB Case' | 'Booster Box Case' | 'SPC Box Case'

// Which subcategories are valid under each category — drives the dependent
// dropdown in the admin product form and the grouped shop filter.
export const SUBCATEGORIES_BY_CATEGORY: Record<ProductCategory, ProductSubcategory[]> = {
  'Chinese Pokémon Products': ['Gem Series', 'CSV Series', 'Blind Box'],
  'Acrylic Cases': ['ETB Case', 'Booster Box Case', 'SPC Box Case'],
}

export const ALL_SUBCATEGORIES: ProductSubcategory[] = Object.values(SUBCATEGORIES_BY_CATEGORY).flat()

export interface Product {
  id: string
  name: string
  code: string
  category: ProductCategory
  subcategory: ProductSubcategory
  price: number
  compareAtPrice?: number
  stock: number
  squareVariationId?: string
  img?: string
  imgTablet?: string
  imgMobile?: string
  imgAlt?: string
  images?: string[]
  description?: string
  preorder?: boolean
  comingSoon?: boolean
  placeholder?: string
}

// Product catalog now lives in Postgres (see src/lib/db/schema.ts and
// scripts/seed.ts for the initial data) — fetched via src/server/products.ts.

export const FLAT_SHIPPING_RATE = 10

export function formatMoney(n: number): string {
  return '$' + n.toFixed(2)
}
