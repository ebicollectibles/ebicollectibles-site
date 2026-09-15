import type * as React from 'react'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { rankProducts } from '~/lib/products'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

// The full, ranked version of a homepage teaser (Best Selling / New &
// Upcoming) — every product, ranked ones first (lowest rank first), then
// everything unranked after them. Shared by both /best-selling and
// /new-and-upcoming since they're otherwise identical.
export function RankedProductPage({ title, rankField }: { title: string; rankField: 'bestSellingRank' | 'newAndUpcomingRank' }) {
  const { products } = useCart()
  const ranked = rankProducts(products, rankField)

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={monoLabel}>Shop</div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>{title}</h1>
      <div className="ebi-shop-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea', marginTop: 24 }}>
        {ranked.map((p) => (
          <ProductCard key={p.id} product={p} variant="full" />
        ))}
      </div>
    </section>
  )
}
