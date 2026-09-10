import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { PRODUCT_CATEGORIES, SUBCATEGORIES_BY_CATEGORY, ALL_SUBCATEGORIES, type ProductSubcategory } from '~/lib/products'

const shopSearchSchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  subcategory: z.enum(ALL_SUBCATEGORIES as [string, ...string[]]).optional(),
})

export const Route = createFileRoute('/shop')({
  validateSearch: shopSearchSchema,
  head: ({ match }) => {
    const label = match.search.subcategory ?? match.search.category
    if (!label) return {}
    const title = `${label} — EBI Collectibles`
    const description = `Shop ${label} — Simplified Chinese Pokémon, verified before it ships.`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
      ],
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
    if (search.subcategory) return [search.subcategory as ProductSubcategory]
    if (search.category) return SUBCATEGORIES_BY_CATEGORY[search.category]
    return []
  }

  const [subcategories, setSubcategories] = React.useState<ProductSubcategory[]>(seedSubcategories())
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [maxPrice, setMaxPrice] = React.useState(150)
  const [sort, setSort] = React.useState<SortMode>('featured')
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  // Re-seed the filter when arriving via a nav link that targets a specific category/subcategory.
  const seededKey = React.useRef(`${search.category ?? ''}|${search.subcategory ?? ''}`)
  React.useEffect(() => {
    const key = `${search.category ?? ''}|${search.subcategory ?? ''}`
    if (key !== seededKey.current) {
      seededKey.current = key
      setSubcategories(seedSubcategories())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.category, search.subcategory])

  const resetFilters = () => {
    setSubcategories([])
    setInStockOnly(false)
    setMaxPrice(150)
    setSort('featured')
  }

  const toggleSubcategory = (s: ProductSubcategory) => {
    setSubcategories((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  let visible = products.filter((p) => {
    if (subcategories.length && !subcategories.includes(p.subcategory)) return false
    if (inStockOnly && p.stock === 0) return false
    if (p.price > maxPrice) return false
    return true
  })
  if (sort === 'low') visible = [...visible].sort((a, b) => a.price - b.price)
  if (sort === 'high') visible = [...visible].sort((a, b) => b.price - a.price)
  if (sort === 'name') visible = [...visible].sort((a, b) => a.name.localeCompare(b.name))

  const shopTitle = subcategories.length === 1 ? subcategories[0] : 'Chinese Pokémon Products'

  const filterPanel = (
    <aside className="ebi-sticky-aside">
      <div style={monoLabel}>Filter</div>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 10 }}>Product type</div>
        {PRODUCT_CATEGORIES.map((cat) => (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#98a1ab', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {cat}
            </div>
            {SUBCATEGORIES_BY_CATEGORY[cat].map((s) => {
              const count = products.filter((p) => p.subcategory === s).length
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
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#98a1ab' }}>{count}</span>
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
          max={150}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#131b28' }}
        />
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#131b28', marginTop: 8 }}>
          up to ${maxPrice}.00
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

  const productGrid = (
    <>
      <div className="ebi-shop-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea', marginTop: 16 }}>
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} variant="full" />
        ))}
      </div>

      {visible.length === 0 && (
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
      <div style={monoLabel}>Shop / Simplified Chinese</div>
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
            {visible.length} products
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
