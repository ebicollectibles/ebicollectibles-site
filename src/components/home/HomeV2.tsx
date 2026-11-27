import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { ResponsiveImage } from '~/components/ResponsiveImage'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { SHIPPING_HANDLING_MAX_DAYS, SHIPPING_HANDLING_MIN_DAYS } from '~/lib/policy'
import { FLAT_SHIPPING_RATE, formatMoney, isOnSale, rankProducts, type Product } from '~/lib/products'
import { HomeRail, availability, percentOff, sortForRail } from './HomeRail'
import { HomeSets } from './HomeSets'
import { HomeGuides } from './HomeGuides'
import { HomeFeatured } from './HomeFeatured'

// Homepage body (routes/index.tsx). Order, top to bottom: sale banner (in
// the route), the featured pre-orders and deal, the biggest markdowns, shop
// by set, best sellers, the non-card categories, new & upcoming, pre-orders,
// the trust strip, the blog, and the restock email band (in the route).
// Everything product-related is worked out from the live catalog.

type ShopSearch = Record<string, unknown>

const eligibleFor = (products: Product[]) =>
  products.filter((p) => !p.hideFromShopGrid && (SHOW_ACRYLICS || p.category !== 'Acrylic Cases'))

const isBlind = (p: Product) => p.subcategory === 'Blind Box'
const isFigure = (p: Product) => p.subcategory === 'Figure' || p.subcategory === 'Plush'

interface Category {
  key: string
  title: string
  blurb: string
  match: (p: Product) => boolean
  search: ShopSearch
}

const MORE_THAN_CARDS: Category[] = [
  { key: 'special', title: 'Gift & Special Boxes', blurb: 'Premium boxes and display sets', match: (p) => p.subcategory === 'Special Products', search: { subcategory: 'Special Products' } },
  { key: 'blind', title: 'Blind Boxes', blurb: 'Figure and plush blind boxes', match: isBlind, search: { subcategory: 'Blind Box' } },
  { key: 'figure', title: 'Figures & Plush', blurb: 'Collector figures and plush', match: isFigure, search: { subcategories: ['Figure', 'Plush'] } },
  { key: 'binder', title: 'Binders', blurb: 'Pokémon China card binders', match: (p) => p.subcategory === 'Binder', search: { subcategory: 'Binder' } },
]

const TRUST_ICONS: Record<string, React.ReactNode> = {
  ship: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M3 6h11v10H3zM14 9.5h4l3 3.5v3h-7z" />
      <circle cx="7" cy="17.5" r="1.8" fill="#131b28" />
      <circle cx="17.5" cy="17.5" r="1.8" fill="#131b28" />
    </g>
  ),
  rate: <path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  family: (
    <path d="M4 11l8-6 8 6M6 10v9h12v-9M10 19v-5h4v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  alerts: (
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
  ),
}

// Only facts the shop's own policy pages and header already state.
function TrustStrip() {
  const items: { k: string; title: string; sub: string; to?: string; href?: string }[] = [
    { k: 'ship', title: 'Ships from WA', sub: `In-stock orders ship in ${SHIPPING_HANDLING_MIN_DAYS}–${SHIPPING_HANDLING_MAX_DAYS} business days`, to: '/shipping-policy' },
    { k: 'rate', title: `${formatMoney(FLAT_SHIPPING_RATE).replace('.00', '')} flat-rate US shipping`, sub: 'Tracking emailed on every order', to: '/shipping-policy' },
    { k: 'family', title: 'Family owned', sub: 'Sourced from China, checked before it ships' },
    { k: 'alerts', title: 'Restock alerts', sub: 'Email updates on restocks and new drops', href: '#restock-alerts' },
  ]
  return (
    <section className="hp2-trust" aria-label="Why shop with us">
      <ul className="hp2-wrap">
        {items.map((it) => {
          const body = (
            <>
              <svg className="hp2-trust-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                {TRUST_ICONS[it.k]}
              </svg>
              <span className="hp2-trust-text">
                <b>{it.title}</b>
                <span>{it.sub}</span>
              </span>
            </>
          )
          return (
            <li key={it.k}>
              {it.to ? (
                <Link to={it.to as never} className="hp2-trust-item">
                  {body}
                </Link>
              ) : it.href ? (
                <a href={it.href} className="hp2-trust-item">
                  {body}
                </a>
              ) : (
                <span className="hp2-trust-item">{body}</span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function MoreThanCards({ eligible }: { eligible: Product[] }) {
  const tiles = MORE_THAN_CARDS.map((c) => {
    const items = sortForRail(eligible.filter(c.match))
    return { ...c, lead: items.find((p) => p.img), total: items.length }
  }).filter((t) => t.total > 0)
  if (tiles.length === 0) return null
  return (
    <section className="hp2-section" aria-labelledby="hp2-more">
      <div className="hp2-wrap">
        <div className="hp2-head">
          <div>
            <div className="hp2-eyebrow">Beyond booster boxes</div>
            <h2 id="hp2-more">Gift boxes, figures &amp; more</h2>
          </div>
          <div className="hp2-head-actions">
            <Link to="/shop" className="hp2-seeall">
              Shop everything
            </Link>
          </div>
        </div>
        <ul className="hp2-cats">
          {tiles.map((t) => (
            <li key={t.key}>
              <Link to="/shop" search={t.search as never} className="hp2-cat">
                <span className="hp2-cat-img">
                  {t.lead?.img && <ResponsiveImage desktop={t.lead.img} alt="" loading="lazy" sizes="(max-width: 700px) 45vw, 280px" />}
                </span>
                <span className="hp2-cat-title">{t.title}</span>
                <span className="hp2-cat-sub">{t.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function PreorderBand({ items }: { items: Product[] }) {
  if (items.length === 0) return null
  return (
    <section className="hp2-section hp2-pre" aria-labelledby="hp2-pre">
      <div className="hp2-wrap hp2-pre-in">
        <div className="hp2-pre-copy">
          <div className="hp2-eyebrow hp2-eyebrow--gold">Pre-orders &amp; coming soon</div>
          <h2 id="hp2-pre">What's coming next</h2>
          <p>
            Pre-orders are charged in full at checkout and ship separately from in-stock items. Release dates come from the
            manufacturer or distributor and can move.
          </p>
          <div className="hp2-pre-links">
            <Link to="/shop" search={{ preorder: true }} className="hp2-btn-gold">
              All pre-orders
            </Link>
            <Link to="/shipping-policy" className="hp2-link-on-dark">
              How pre-orders ship
            </Link>
          </div>
        </div>
        <ul className="hp2-pre-cards" style={{ '--n': Math.min(items.length, 3) } as React.CSSProperties}>
          {items.slice(0, 3).map((p) => (
            <li key={p.id} className="hp2-cell">
              <ProductCard product={p} variant="compact" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HomeV2({ products, live }: { products: Product[]; live: Record<string, string> }) {
  const data = React.useMemo(() => {
    const eligible = eligibleFor(products)
    const sale = eligible
      .filter((p) => !p.comingSoon && !p.notSellable && p.stock > 0 && percentOff(p) > 0)
      .sort((a, b) => percentOff(b) - percentOff(a) || (a.bestSellingRank ?? 999) - (b.bestSellingRank ?? 999))
    const saleCount = eligible.filter((p) => isOnSale(p, products)).length
    // Admin's Best Selling order, minus anything sold out.
    const best = rankProducts(products, 'bestSellingRank').filter((p) => p.bestSellingRank != null && availability(p) < 2)
    // Only pre-orders that can actually be placed; "opens soon" items stay out
    // of the band so it never shows a row of disabled buttons.
    const preorders = eligible.filter((p) => p.preorder && !p.comingSoon && !p.notSellable)
    // New & Upcoming as admin ranks it, without what the top of Best sellers
    // already shows. Pre-orders stay in (owner wants Aura Seeker leading it).
    const seen = new Set(best.slice(0, 8).map((p) => p.id))
    const fresh = rankProducts(products, 'newAndUpcomingRank').filter((p) => p.newAndUpcomingRank != null && (p.preorder || !seen.has(p.id)))
    return { eligible, sale, saleCount, best, preorders, fresh }
  }, [products])

  return (
    <div className="hp2">
      {/* Leads with the featured pre-orders and deal, then the sale (owner's call,
          Nov 2026: a calmer top that points people at what to buy). */}
      <HomeFeatured products={products} />
      <HomeRail
        id="sale"
        eyebrow="On sale now"
        title="Biggest markdowns"
        blurb="Sorted by percent off."
        products={data.sale}
        pill={(p) => {
          const off = percentOff(p)
          return off >= 1 ? { text: `${off}% off`, tone: 'sale' } : null
        }}
        seeAll={{ label: `See all ${data.saleCount}`, to: '/shop', search: { sale: true } }}
        tone="cream"
      />
      <HomeSets products={products} />
      <HomeRail
        id="best"
        eyebrow="What collectors buy"
        title="Best sellers"
        products={data.best}
        pill={(_, i) => (i < 10 ? { text: `#${i + 1}`, tone: 'rank' } : null)}
        seeAll={{ label: 'See all', to: '/best-selling' }}
      />
      <MoreThanCards eligible={data.eligible} />
      <HomeRail
        id="new"
        eyebrow="Just landed"
        title="New & upcoming"
        products={data.fresh}
        seeAll={{ label: 'See all', to: '/new-and-upcoming' }}
      />
      <PreorderBand items={data.preorders} />
      <TrustStrip />
      <HomeGuides live={live} />
    </div>
  )
}
