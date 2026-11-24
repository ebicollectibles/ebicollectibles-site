import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import type { Product } from '~/lib/products'

// One swipeable product row on the homepage (routes/index.tsx).
// Phones swipe it (scroll-snap, the next card peeks in so it reads as
// scrollable); desktop shows four at a time with arrow buttons. The cards
// themselves are the shop's usual ProductCard, so prices, Sale badges and
// Add to cart behave exactly as they do everywhere else.

export type RailPill = { text: string; tone: 'sale' | 'rank' | 'new' }

// Buyable first, then pre-orders and coming soon, then sold out, so a row
// never opens on a dead end. Same order as the first homepage draft.
export function availability(p: Product): number {
  if (p.notSellable || p.comingSoon || p.preorder) return 1
  return p.stock > 0 ? 0 : 2
}

export function sortForRail(list: Product[]): Product[] {
  return list
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        availability(a.p) - availability(b.p) ||
        (a.p.bestSellingRank ?? 999) - (b.p.bestSellingRank ?? 999) ||
        (a.p.newAndUpcomingRank ?? 999) - (b.p.newAndUpcomingRank ?? 999) ||
        b.i - a.i,
    )
    .map((x) => x.p)
}

/** Whole-number percent off from the site's compare-at price, or 0. */
export function percentOff(p: Product): number {
  if (!(p.price > 0) || p.hidePrice || p.compareAtPrice == null || p.compareAtPrice <= p.price) return 0
  return Math.round((1 - p.price / p.compareAtPrice) * 100)
}

const MAX_ITEMS = 12

export function HomeRail({
  id,
  eyebrow,
  title,
  blurb,
  products,
  pill,
  seeAll,
  tone = 'plain',
}: {
  id: string
  eyebrow?: string
  title: string
  blurb?: React.ReactNode
  products: Product[]
  pill?: (p: Product, index: number) => RailPill | null
  seeAll?: { label: string; to: string; search?: Record<string, unknown> }
  tone?: 'plain' | 'cream'
}) {
  const listRef = React.useRef<HTMLUListElement>(null)
  const items = products.slice(0, MAX_ITEMS)
  if (items.length === 0) return null
  const headingId = `hp2-${id}`

  const scrollBy = (dir: 1 | -1) => {
    const el = listRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <section className={`hp2-section hp2-rail-section${tone === 'cream' ? ' hp2-cream' : ''}`} aria-labelledby={headingId}>
      <div className="hp2-wrap">
        <div className="hp2-head">
          <div>
            {eyebrow && <div className="hp2-eyebrow">{eyebrow}</div>}
            <h2 id={headingId}>{title}</h2>
            {blurb && <p>{blurb}</p>}
          </div>
          <div className="hp2-head-actions">
            {items.length > 4 && (
              <span className="hp2-arrows">
                <button type="button" onClick={() => scrollBy(-1)} aria-label={`Scroll ${title} back`}>
                  ←
                </button>
                <button type="button" onClick={() => scrollBy(1)} aria-label={`Scroll ${title} forward`}>
                  →
                </button>
              </span>
            )}
            {seeAll && (
              <Link to={seeAll.to as never} search={seeAll.search as never} className="hp2-seeall">
                {seeAll.label}
              </Link>
            )}
          </div>
        </div>
        <ul ref={listRef} className={`hp2-rail${items.length <= 2 ? ' hp2-rail--few' : ''}`}>
          {items.map((p, i) => {
            const tag = pill?.(p, i) ?? null
            return (
              <li key={p.id} className="hp2-cell">
                <ProductCard product={p} variant="compact" />
                {tag && <span className={`hp2-pill hp2-pill--${tag.tone}`}>{tag.text}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
