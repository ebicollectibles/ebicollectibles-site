import { z } from 'zod'
import { ALL_SUBCATEGORIES, PRODUCT_CATEGORIES } from '~/lib/products'

// Search params for /shop. Everything here is a filter on one catalog, so
// a value that is unknown, mistyped or the wrong shape must degrade to
// "that filter is off" rather than throw: a throw inside validateSearch
// surfaces as an HTTP 500 for the whole page (`/shop?subcategory=123`,
// `/shop?category=true`, `/shop?subcategories=Figure` all did). Hence the
// per-field .catch(undefined).
const subcategory = z.enum(ALL_SUBCATEGORIES as [string, ...string[]])

// The router JSON-parses each query value, so free text that happens to be
// all digits (`?q=151`) arrives as a number. Kept in the form it arrived
// in (the router redirects when the validated search re-serialises
// differently from the requested URL); read it through searchText().
const looseText = z.union([z.string(), z.number()]).optional().catch(undefined)

// Same shape as preorder above: only `true` or absent.
const saleFlag = z
  .union([z.boolean(), z.string()])
  .optional()
  .catch(undefined)
  .transform((v) => (v === true || v === 'true' ? true : undefined))

export const shopSearchSchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional().catch(undefined),
  subcategory: subcategory.optional().catch(undefined),
  // Plural variant, for a nav link that spans more than one subcategory at
  // once (e.g. "Figures & Plush") — subcategory (singular) still works
  // for the common single-subcategory case. A hand-typed single value
  // (`?subcategories=Figure`) is accepted as a one-item list, and unknown
  // names are dropped from the list rather than failing all of it.
  subcategories: z
    .preprocess((v) => {
      const list = typeof v === 'string' ? [v] : v
      if (!Array.isArray(list)) return undefined
      const known = list.filter((s) => subcategory.safeParse(s).success)
      return known.length ? known : undefined
    }, z.array(subcategory).optional())
    .catch(undefined),
  q: looseText,
  // Browse every product sharing one variantGroupId at once, ignoring
  // hideFromShopGrid — the one place that flag is deliberately overridden,
  // for a "see the full collection" link off a notSellable hub listing.
  // Category/subcategory/search filters are ignored in this mode (a
  // collection is its own self-contained browse, not a slice of the catalog).
  variantGroup: looseText,
  // Show only pre-order items, across every category — combinable with the
  // category/subcategory filters (unlike variantGroup, which is its
  // own self-contained view). Accepts a real boolean (how the nav Link
  // passes it) or the string "true" (how it can arrive when someone types
  // or pastes the raw URL).
  //
  // Only ever `true` or absent, never `false`: the router rebuilds the URL
  // from the validated search and redirects when it differs, so emitting
  // `preorder: false` by default made plain `/shop` (the canonical URL,
  // and the one in the sitemap) and every shop nav link answer with a 307
  // to `...preorder=false`.
  preorder: z
    .union([z.boolean(), z.string()])
    .optional()
    .catch(undefined)
    .transform((v) => (v === true || v === 'true' ? true : undefined)),
  // Show only marked-down items (see isOnSale), e.g. from the homepage sale banner.
  sale: saleFlag,
})

export type ShopSearch = z.infer<typeof shopSearchSchema>

/** A looseText search value as trimmed text ('' when absent). */
export function searchText(value: string | number | undefined): string {
  return value == null ? '' : String(value).trim()
}
