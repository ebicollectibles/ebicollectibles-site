import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { getInStockVariant, isOnSale, PRODUCT_CATEGORIES, SUBCATEGORIES_BY_CATEGORY, type ProductCategory, type ProductSubcategory } from '~/lib/products'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { searchText, shopSearchSchema } from '~/lib/shop-search'

// Same set of category pills shown everywhere on this page — computed once
// so the filter panel and product-visibility check can't drift apart.
const VISIBLE_CATEGORIES = PRODUCT_CATEGORIES.filter((cat) => SHOW_ACRYLICS || cat !== 'Acrylic Cases')

const categoryLabel = (cat: ProductCategory) =>
  cat === 'Chinese Pokémon Products' ? 'Pokemon (Simplified Chinese)' : cat === 'Japanese Pokémon Products' ? 'Pokemon (Japanese)' : cat

const SITE_URL = 'https://ebicollectibles.com'

export const Route = createFileRoute('/shop')({
  validateSearch: shopSearchSchema,
  head: ({ match }) => {
    const label =
      match.search.subcategories?.join(' & ') ||
      match.search.subcategory ||
      (match.search.category ? categoryLabel(match.search.category) : undefined) ||
      (match.search.variantGroup ? 'Full Collection' : undefined) ||
      (match.search.preorder ? 'Pre-orders' : undefined) ||
      (match.search.sale ? 'On Sale' : undefined)
    // The Binders link from the menu gets its own preview: a plural title
    // and a card showing the binders in place of the generic shop one.
    const binders = match.search.subcategory === 'Binder' && !match.search.subcategories?.length
    const title = binders ? 'Binders — EBI Collectibles' : label ? `${label} — EBI Collectibles` : 'Shop — EBI Collectibles'
    const description = binders
      ? 'Official Pokémon China card binders, from the Psyduck Mini Binder to the 30th Celebration 9-pocket zip binder. Ships from the US.'
      : label
        ? match.search.category === 'Japanese Pokémon Products'
          ? `Shop ${label} — Japanese Pokémon booster boxes and pre-orders.`
          : match.search.preorder && !match.search.category
            ? 'Pokémon pre-orders at EBI Collectibles: price shown up front, charged at checkout, shipped after release.'
            : `Shop ${label} — Simplified Chinese Pokémon, verified before it ships.`
        : 'Shop the full EBI Collectibles catalog — Simplified Chinese Pokémon booster boxes, blind boxes, plush, figures, and more, verified before it ships.'
    // Every category/subcategory/price/search filter is just client-side UX
    // on top of the same underlying catalog, not distinct content — so,
    // same as faceted navigation on any storefront, they all canonicalize
    // back to the one plain /shop URL rather than each filtered query
    // string competing with it (or each other) as a near-duplicate page.
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE_URL}/shop` },
        { property: 'og:image', content: `${SITE_URL}/assets/share/${binders ? 'shop-binders' : 'shop'}.jpg` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/shop` }],
    }
  },
  component: ShopPage,
})

type SortMode = 'featured' | 'low' | 'high' | 'name'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

function ShopPage() {
  const search = Route.useSearch()
  const { products } = useCart()

  const seedSubcategories = (): ProductSubcategory[] => {
    if (search.subcategories?.length) return search.subcategories as ProductSubcategory[]
    if (search.subcategory) return [search.subcategory as ProductSubcategory]
    if (search.category) return SUBCATEGORIES_BY_CATEGORY[search.category]
    return []
  }

  // The slider's own ceiling — must cover the priciest product or that
  // product becomes permanently unreachable on this page (no way to move
  // the slider past its max), not just filtered by default. Rounded up to
  // the nearest $10 so it isn't an oddly specific number, floored at $150
  // so the slider still has reasonable range on a catalog with nothing
  // expensive in it yet.
  const priceCeiling = Math.max(150, ...products.map((p) => Math.ceil(p.price / 10) * 10))

  const [subcategories, setSubcategories] = React.useState<ProductSubcategory[]>(seedSubcategories())
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [maxPrice, setMaxPrice] = React.useState(priceCeiling)
  const [sort, setSort] = React.useState<SortMode>('featured')
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  // Re-seed the filter when arriving via a nav link that targets a specific category/subcategory.
  const seededKey = React.useRef(`${search.category ?? ''}|${search.subcategory ?? ''}|${(search.subcategories ?? []).join(',')}`)
  React.useEffect(() => {
    const key = `${search.category ?? ''}|${search.subcategory ?? ''}|${(search.subcategories ?? []).join(',')}`
    if (key !== seededKey.current) {
      seededKey.current = key
      setSubcategories(seedSubcategories())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.category, search.subcategory, search.subcategories])

  const resetFilters = () => {
    setSubcategories([])
    setInStockOnly(false)
    setMaxPrice(priceCeiling)
    setSort('featured')
  }

  const toggleSubcategory = (s: ProductSubcategory) => {
    setSubcategories((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const searchQuery = searchText(search.q)
  const query = searchQuery.toLowerCase()
  const variantGroup = searchText(search.variantGroup) || undefined

  // A collection view ignores every other filter — it's a deliberate,
  // self-contained browse of one variant group's full set of real
  // variants, not a slice of the normal catalog. The notSellable hub
  // listing itself (if any) is excluded — it's what linked here, not one
  // of the 30 things to actually buy.
  let visible = variantGroup
    ? products
        .filter((p) => p.variantGroupId === variantGroup && !p.notSellable)
        // Admin's own list order for this group (same field the product
        // page's Options dropdown sorts by) rather than createdAt — a
        // collection view is browsing one deliberately curated set, not a
        // slice of the catalog. Still overridden below if the shopper picks
        // an explicit Low/High/Name sort.
        .sort((a, b) => (a.variantSortOrder ?? Infinity) - (b.variantSortOrder ?? Infinity) || a.name.localeCompare(b.name))
    : products.filter((p) => {
        // A variant meant only to be reached via its sibling's selector (see
        // Product.hideFromShopGrid in lib/products.ts) doesn't get its own
        // grid tile — same reasoning as rankProducts excluding it from the
        // homepage sections.
        if (p.hideFromShopGrid) return false
        if (!SHOW_ACRYLICS && p.category === 'Acrylic Cases') return false
        // Chinese and Japanese share product types (both have Booster
        // Boxes), so a category link filters by the category itself too.
        if (search.category && p.category !== search.category) return false
        if (search.preorder && !p.preorder) return false
        if (search.sale && !isOnSale(p, products)) return false
        if (query && !p.name.toLowerCase().includes(query)) return false
        if (subcategories.length && !subcategories.includes(p.subcategory)) return false
        // <= 0, not === 0 — see ProductCard.tsx's identical fix for why.
        // A sold-out item with another variant in stock still counts (getInStockVariant).
        if (inStockOnly && p.stock <= 0 && !getInStockVariant(p, products)) return false
        if (p.price > maxPrice) return false
        return true
      })
  // Featured (the default) pins anything with a shopSortOrder to the front,
  // lowest first, ahead of the grid's normal createdAt order — same
  // ranked-then-everything-else shape as rankProducts, but admin opts a
  // product into this one explicitly rather than every product
  // participating by default. Still fully overridden by an explicit
  // Low/High/Name sort below, same as the variantGroup view's own order is.
  if (sort === 'featured' && !variantGroup) {
    const pinned = visible.filter((p) => p.shopSortOrder != null).sort((a, b) => a.shopSortOrder! - b.shopSortOrder!)
    const rest = visible.filter((p) => p.shopSortOrder == null)
    visible = [...pinned, ...rest]
  }
  // Items with no price a shopper can see (coming soon at $0, hidePrice,
  // notSellable hubs) go after every priced item in BOTH price sorts —
  // treated as 0 they used to lead "Price: low to high".
  const hasVisiblePrice = (p: (typeof products)[number]) => p.price > 0 && !p.hidePrice
  const byPrice = (dir: 1 | -1) => (a: (typeof products)[number], b: (typeof products)[number]) => {
    const pa = hasVisiblePrice(a)
    const pb = hasVisiblePrice(b)
    if (pa !== pb) return pa ? -1 : 1
    return pa ? dir * (a.price - b.price) : 0
  }
  if (sort === 'low') visible = [...visible].sort(byPrice(1))
  if (sort === 'high') visible = [...visible].sort(byPrice(-1))
  if (sort === 'name') visible = [...visible].sort((a, b) => a.name.localeCompare(b.name))

  // If every subcategory of a category is selected, that's really "show all
  // of this category" (e.g. landing via the "All Pokemon (Chinese)" link
  // seeds all 5 Chinese Pokémon subcategories) — show the category label
  // rather than joining every subcategory name together.
  const sameAsCategory = (cat: ProductCategory) =>
    subcategories.length === SUBCATEGORIES_BY_CATEGORY[cat].length && subcategories.every((s) => SUBCATEGORIES_BY_CATEGORY[cat].includes(s))
  // The arrival category wins; otherwise only the multi-type categories are
  // guessed from the ticked boxes (Japanese's short list would otherwise
  // match a plain "Booster Box" pick).
  const matchedCategory =
    search.category && sameAsCategory(search.category)
      ? search.category
      : PRODUCT_CATEGORIES.find((cat) => cat !== 'Japanese Pokémon Products' && sameAsCategory(cat))

  const collectionHub = variantGroup ? products.find((p) => p.variantGroupId === variantGroup && p.notSellable) : undefined

  const shopTitle = variantGroup
    ? collectionHub
      ? `${collectionHub.name} — Full Collection`
      : 'Full Collection'
    : searchQuery
      ? `Results for "${searchQuery}"`
      : search.preorder && subcategories.length === 0
        ? 'Pre-orders'
        : search.sale && subcategories.length === 0
        ? 'On Sale'
        : matchedCategory
          ? categoryLabel(matchedCategory)
          : subcategories.length === 1
          ? subcategories[0]
          : subcategories.length > 1
            ? subcategories.join(' & ')
            : 'Chinese Pokémon Products'

  const filterPanel = (
    <aside className="ebi-sticky-aside">
      <div style={monoLabel}>Filter</div>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 10 }}>Product type</div>
        {(search.category ? [search.category] : VISIBLE_CATEGORIES.filter((c) => c !== 'Japanese Pokémon Products')).map((cat) => (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5a6875', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {cat}
            </div>
            {SUBCATEGORIES_BY_CATEGORY[cat].map((s) => {
              const count = products.filter((p) => p.subcategory === s && !p.hideFromShopGrid && (!search.category || p.category === search.category)).length
              return (
                <label
                  key={s}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: '#3d4753', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={subcategories.includes(s)}
                    onChange={() => toggleSubcategory(s)}
                    style={{ width: 14, height: 14, accentColor: '#131b28', cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1 }}>{s}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#5a6875' }}>{count}</span>
                </label>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e3e6ea' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 10 }}>Availability</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: '#3d4753', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly((v) => !v)}
            style={{ width: 14, height: 14, accentColor: '#131b28', cursor: 'pointer' }}
          />
          <span>In stock only</span>
        </label>
      </div>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e3e6ea' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>Max price</div>
        <input
          type="range"
          min={10}
          max={priceCeiling}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#131b28' }}
        />
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#131b28', marginTop: 8 }}>
          {maxPrice >= priceCeiling ? 'No price limit' : `up to $${maxPrice}.00`}
        </div>
      </div>
      <button
        onClick={resetFilters}
        className="ebi-reset-btn"
        style={{
          marginTop: 26,
          width: '100%',
          background: '#ffffff',
          border: '1px solid #cfd4da',
          borderRadius: 2,
          padding: 10,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          color: '#5a6875',
        }}
      >
        Reset filters
      </button>
    </aside>
  )

  // On the pre-orders view, tell shoppers plainly when nothing is up for
  // pre-order at all, rather than blaming their filters.
  const noActivePreorders =
    !!search.preorder && !variantGroup && !products.some((p) => p.preorder && !p.hideFromShopGrid && !p.notSellable)

  const productGrid = (
    <>
      <h2 className="sr-only">Products</h2>
      <div className="ebi-shop-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea', marginTop: 16 }}>
        {visible.map((p, i) => (
          <ProductCard key={p.id} product={p} variant="full" priority={i < 4} />
        ))}
      </div>

      {visible.length === 0 && noActivePreorders && (
        <div style={{ border: '1px solid #e3e6ea', borderTop: 0, padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>There are no active pre-orders at the moment.</div>
          <p style={{ fontSize: 13.5, color: '#5a6875', margin: '10px auto 0', maxWidth: 440, lineHeight: 1.6 }}>
            Take a look at what is new or browse everything in stock.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
            <Link
              to="/new-and-upcoming"
              style={{ background: '#131b28', color: '#ffffff', borderRadius: 2, padding: '11px 20px', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
            >
              New &amp; upcoming
            </Link>
            <Link
              to="/shop"
              style={{ background: '#ffffff', color: '#131b28', border: '1px solid #cfd4da', borderRadius: 2, padding: '10px 20px', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
            >
              Shop all products
            </Link>
          </div>
        </div>
      )}

      {visible.length === 0 && !noActivePreorders && (
        <div style={{ border: '1px solid #e3e6ea', borderTop: 0, padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Nothing matches those filters.</div>
          <button
            onClick={resetFilters}
            style={{ marginTop: 14, background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '11px 20px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  )

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={monoLabel}>
        {search.category === 'Japanese Pokémon Products'
          ? 'Shop / Japanese'
          : search.category === 'Chinese Pokémon Products' || !(search.preorder || search.sale)
            ? 'Shop / Simplified Chinese'
            : 'Shop'}
      </div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>{shopTitle}</h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 32,
          borderTop: '1px solid #131b28',
          paddingTop: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="ebi-reset-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: filtersOpen ? '#131b28' : '#ffffff',
              color: filtersOpen ? '#ffffff' : '#5a6875',
              border: '1px solid ' + (filtersOpen ? '#131b28' : '#cfd4da'),
              borderRadius: 2,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Filter
            <span style={{ fontSize: 9 }}>{filtersOpen ? '▴' : '▾'}</span>
          </button>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
            {visible.length} {visible.length === 1 ? 'product' : 'products'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label
            htmlFor="shop-sort"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#131b28' }}
          >
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="ebi-field"
            style={{ border: '1px solid #e3e6ea', borderRadius: 2, padding: '8px 10px', fontSize: 12.5, background: '#ffffff', color: '#131b28', cursor: 'pointer' }}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {filtersOpen ? (
        <div className="ebi-shop-layout" style={{ marginTop: 24, alignItems: 'start' }}>
          {filterPanel}
          <div>{productGrid}</div>
        </div>
      ) : (
        productGrid
      )}
    </section>
  )
}
