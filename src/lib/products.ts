import { SHOW_ACRYLICS } from './feature-flags'

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
  // Absolute opt-out of a section — see the comment in lib/db/schema.ts.
  hideFromBestSelling?: boolean
  hideFromNewAndUpcoming?: boolean
  description?: string
  preorder?: boolean
  // In stock and purchasable, but fulfillment is temporarily delayed — see
  // the comment in lib/db/schema.ts. Unlike preorder, doesn't block being
  // ordered alongside other items; the UI just warns the whole order will
  // ship together once this item is ready.
  shipsWithDelay?: boolean
  comingSoon?: boolean
  placeholder?: string
  gtin?: string
  brand?: string
  condition?: GoogleCondition
  googleProductCategory?: string
  weightLb?: number
  // Product variants (e.g. a sealed blind box + each specific opened
  // figure) — see the comment in lib/db/schema.ts. Every product sharing
  // the same variantGroupId is a full, independently sellable product;
  // products.$id.tsx renders them as a selector on each other's page.
  variantGroupId?: string
  variantLabel?: string
  variantSortOrder?: number
  // Keeps a variant out of grid-style listings (shop, home sections,
  // header search — see rankProducts below) without affecting its own
  // detail page, Square sync, or orderability.
  hideFromShopGrid?: boolean
}

// Google's condition [condition] attribute values — see the comment on
// products.condition in lib/db/schema.ts.
export const GOOGLE_CONDITIONS = ['new', 'used', 'refurbished'] as const
export type GoogleCondition = (typeof GOOGLE_CONDITIONS)[number]

// GS1 check-digit validation for a GTIN-13 (UPC/EAN barcode) — shared by
// the admin form (instant feedback) and the server (authoritative check).
// Algorithm: from the 12 digits excluding the check digit, weight the
// rightmost 3, alternating 1/3 going left, sum, check digit = (10 - sum%10) % 10.
export function isValidGtin13(value: string): boolean {
  if (!/^\d{13}$/.test(value)) return false
  const digits = value.split('').map(Number)
  const checkDigit = digits[12]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const fromRight = 11 - i
    sum += digits[i] * (fromRight % 2 === 0 ? 3 : 1)
  }
  return (10 - (sum % 10)) % 10 === checkDigit
}

// Product catalog now lives in Postgres (see src/lib/db/schema.ts and
// scripts/seed.ts for the initial data) — fetched via src/server/products.ts.

export const FLAT_SHIPPING_RATE = 10

export function formatMoney(n: number): string {
  return '$' + n.toFixed(2)
}

const HIDE_FIELD = {
  bestSellingRank: 'hideFromBestSelling',
  newAndUpcomingRank: 'hideFromNewAndUpcoming',
} as const

// Shared by the homepage's Best Selling/New & Upcoming teasers and their
// "View All" pages: ranked products first (lowest rank first), then every
// unranked product after them — except anything hidden from this specific
// section (see hideFromBestSelling/hideFromNewAndUpcoming), which never
// shows here at all, curated or not. `products` is assumed to already be
// in createdAt-ascending order (how getProducts returns it) — reversed for
// the unranked tail so those come out newest-first.
export function rankProducts(products: Product[], rankField: 'bestSellingRank' | 'newAndUpcomingRank'): Product[] {
  // A variant meant only to be reached via its sibling's selector (see
  // hideFromShopGrid on Product above) shouldn't surface here either, same
  // as it's excluded from the shop grid and header search. Acrylic Cases is
  // excluded too while SHOW_ACRYLICS is off, same reasoning as shop.tsx.
  const eligible = products.filter(
    (p) => !p[HIDE_FIELD[rankField]] && !p.hideFromShopGrid && (SHOW_ACRYLICS || p.category !== 'Acrylic Cases'),
  )
  const ranked = eligible.filter((p) => p[rankField] != null).sort((a, b) => a[rankField]! - b[rankField]!)
  const unranked = eligible.filter((p) => p[rankField] == null).slice().reverse()
  return [...ranked, ...unranked]
}
