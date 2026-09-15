export const PRODUCT_CATEGORIES = ['Chinese Pokémon Products', 'Acrylic Cases'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export type ProductSubcategory = 'Booster Box' | 'Blind Box' | 'Figure' | 'Plush' | 'Special Products' | 'ETB Case' | 'Booster Box Case' | 'SPC Box Case'

// Which subcategories are valid under each category — drives the dependent
// dropdown in the admin product form and the grouped shop filter. "Gem
// Series"/"CSV Series" used to live here as subcategories — they're free-
// form tags now (see Product.tags below), since they're really collection/
// series names, not a product type, and admin wants to keep adding new
// ones without a code change each time.
export const SUBCATEGORIES_BY_CATEGORY: Record<ProductCategory, ProductSubcategory[]> = {
  'Chinese Pokémon Products': ['Booster Box', 'Blind Box', 'Figure', 'Plush', 'Special Products'],
  'Acrylic Cases': ['ETB Case', 'Booster Box Case', 'SPC Box Case'],
}

export const ALL_SUBCATEGORIES: ProductSubcategory[] = Object.values(SUBCATEGORIES_BY_CATEGORY).flat()

export interface Product {
  id: string
  name: string
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
  // Free-form collection labels (e.g. "Gem Series", "CSV Series") — unlike
  // subcategory, not a fixed list: admin can create a new one just by
  // typing it on a product, no code change needed to add a collection.
  tags?: string[]
  // Rank within "Best Selling" / "New & Upcoming" — see the comment in
  // lib/db/schema.ts. Undefined/null means unranked.
  bestSellingRank?: number
  newAndUpcomingRank?: number
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

// Shared by the homepage's Best Selling/New & Upcoming teasers and their
// "View All" pages: ranked products first (lowest rank first), then every
// unranked product after them. `products` is assumed to already be in
// createdAt-ascending order (how getProducts returns it) — reversed for the
// unranked tail so those come out newest-first.
export function rankProducts(products: Product[], rankField: 'bestSellingRank' | 'newAndUpcomingRank'): Product[] {
  const ranked = products.filter((p) => p[rankField] != null).sort((a, b) => a[rankField]! - b[rankField]!)
  const unranked = products.filter((p) => p[rankField] == null).slice().reverse()
  return [...ranked, ...unranked]
}
