import * as React from 'react'
import { Link, useLoaderData } from '@tanstack/react-router'
import type { BlogShopProduct } from '~/server/blog-status'

// Shop panels for blog posts: a compact strip under the banner and the
// "where to buy" panel at the end. Prices and stock come live from the
// store (getBlogPostStatus), so nothing here can go stale.

export type CtaLink = {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  label: string
  variant?: 'light' | 'ghost'
}

type Status = { label: string; tone: 'ok' | 'low' | 'pre' | 'out'; action: string; buyable: boolean }

function statusOf(p: BlogShopProduct): Status {
  if (p.comingSoon) return { label: 'Coming soon', tone: 'pre', action: 'View product', buyable: false }
  if (p.preorder) return { label: 'Pre-order', tone: 'pre', action: 'Pre-order now', buyable: true }
  if (p.stock > 0 && p.stock <= 5) return { label: `Only ${p.stock} left`, tone: 'low', action: 'Shop now', buyable: true }
  if (p.stock > 0) return { label: 'In stock', tone: 'ok', action: 'Shop now', buyable: true }
  return { label: 'Sold out', tone: 'out', action: 'View product', buyable: false }
}

function money(n: number) {
  return `$${n.toFixed(2)}`
}

function priceOf(p: BlogShopProduct) {
  return !p.hidePrice && p.price > 0 ? money(p.price) : null
}

/** "Pokemon TCG: Black Bolt Booster Box - Jumbo (Simplified Chinese)" -> { title: 'Black Bolt Booster Box', kind: 'Jumbo' } */
function splitName(p: BlogShopProduct) {
  const clean = p.name
    .replace(/^Pokemon (TCG: )?/, '')
    .replace(/\s*\(Simplified Chinese\)/, '')
    .trim()
  const [title, kind] = clean.split(/\s+-\s+/)
  return { title: title.trim(), kind: kind?.trim() ?? null }
}

function kindLabel(p: BlogShopProduct): string | null {
  const { kind } = splitName(p)
  if (kind === 'Slim') return 'Slim box'
  if (kind === 'Jumbo') return 'Jumbo box'
  if (p.variantLabel) return p.variantLabel
  return kind
}

function noteFor(p: BlogShopProduct): string | null {
  const { kind } = splitName(p)
  if (kind === 'Slim') return 'Smaller packs and a lower box price.'
  if (kind === 'Jumbo') return 'Bigger packs, with more cards and holos in each pack.'
  return null
}

function ProductLinkButton({ p, className }: { p: BlogShopProduct; className: string }) {
  const s = statusOf(p)
  return (
    <Link to="/products/$id" params={{ id: p.id }} className={className}>
      {s.action}
      <span aria-hidden="true">→</span>
    </Link>
  )
}

/** Placed in a post's body right after the chase cards; reads the post's live products itself. */
export function BuyStrip() {
  const loaded = useLoaderData({ strict: false }) as { shop?: BlogShopProduct[] } | undefined
  return <ShopStrip products={loaded?.shop ?? []} />
}

/** What you can buy, at a glance, with one next step. */
export function ShopStrip({ products }: { products: BlogShopProduct[] }) {
  if (products.length === 0) return null
  const lead = products.find((p) => statusOf(p).buyable) ?? products[0]
  const anyBuyable = products.some((p) => statusOf(p).buyable)
  const anySoon = products.some((p) => p.comingSoon)

  if (products.length === 1) {
    const p = products[0]
    const s = statusOf(p)
    const price = priceOf(p)
    return (
      <div className="shop-strip">
        {p.img && <img src={p.img} alt={p.imgAlt || p.name} width={64} height={64} />}
        <div className="shop-strip-text">
          <b>{splitName(p).title}</b>
          <span>
            {price && <>{price} · </>}
            <span className={`shop-dot is-${s.tone}`} />
            {s.label}
          </span>
        </div>
        <ProductLinkButton p={p} className={s.buyable ? 'btn btn-dark' : 'btn btn-outline'} />
      </div>
    )
  }

  const prices = products.map(priceOf).filter(Boolean)
  const min = products.filter((p) => priceOf(p)).reduce((m, p) => Math.min(m, p.price), Infinity)
  const kinds = products.map((p) => kindLabel(p)?.toLowerCase()).filter(Boolean)
  const title = splitName(lead).title
  const inStock = products.filter((p) => statusOf(p).buyable).length
  return (
    <div className="shop-strip">
      {lead.img && <img src={lead.img} alt={lead.imgAlt || lead.name} width={64} height={64} />}
      <div className="shop-strip-text">
        <b>
          {title}: {kinds.join(' or ')}
        </b>
        <span>
          {prices.length > 0 && <>From {money(min)} · </>}
          <span className={`shop-dot is-${anyBuyable ? 'ok' : anySoon ? 'pre' : 'out'}`} />
          {anyBuyable ? `${inStock} of ${products.length} in stock` : anySoon ? 'Coming soon' : 'Sold out right now'}
        </span>
      </div>
      <a href="#shop" className={anyBuyable ? 'btn btn-dark' : 'btn btn-outline'}>
        {anyBuyable ? 'Choose your box' : 'See options'}
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  )
}

/** End of post: product tiles with live status, then the reading links. */
export function ShopPanel({
  products,
  heading,
  body,
  links,
}: {
  products: BlogShopProduct[]
  heading: string
  body: string
  links: CtaLink[]
}) {
  // With live product tiles, the CTA's own product links are redundant; keep
  // the reading links (card list, other posts) as secondary links.
  const readLinks = products.length > 0 ? links.filter((l) => l.to !== '/products/$id') : []
  const fallbackButtons = products.length > 0 ? [] : links

  return (
    <section className="shop-panel" id="shop" aria-labelledby="shop-heading">
      <div className="shop-head">
        <h3 id="shop-heading">{heading}</h3>
        <p>{body}</p>
      </div>

      {products.length > 0 && (
        <div className={`shop-tiles n-${Math.min(products.length, 3)}`}>
          {products.map((p) => {
            const s = statusOf(p)
            const price = priceOf(p)
            const kind = kindLabel(p)
            const note = noteFor(p)
            return (
              <div key={p.id} className={`shop-tile${s.buyable ? '' : ' is-muted'}`}>
                <Link to="/products/$id" params={{ id: p.id }} className="shop-tile-img" tabIndex={-1} aria-hidden="true">
                  {p.img && <img src={p.img} alt="" loading="lazy" width={240} height={240} />}
                </Link>
                <div className="shop-tile-body">
                  {kind && <span className="shop-kind">{kind}</span>}
                  <Link to="/products/$id" params={{ id: p.id }} className="shop-title">
                    {splitName(p).title}
                  </Link>
                  {note && <p className="shop-note">{note}</p>}
                  <div className="shop-meta">
                    {price && <span className="shop-price">{price}</span>}
                    <span className="shop-status">
                      <span className={`shop-dot is-${s.tone}`} />
                      {s.label}
                    </span>
                  </div>
                  <ProductLinkButton p={p} className={s.buyable ? 'btn btn-dark btn-block' : 'btn btn-outline btn-block'} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {fallbackButtons.length > 0 && (
        <div className="cta-actions">
          {fallbackButtons.map((l, i) => (
            <Link
              key={i}
              to={l.to as never}
              params={l.params as never}
              search={l.search as never}
              className={`btn ${i === 0 ? 'btn-dark' : 'btn-outline'}`}
            >
              {l.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      )}

      <div className="shop-foot">
        {readLinks.length > 0 && (
          <div className="shop-read">
            {readLinks.map((l, i) => (
              <Link key={i} to={l.to as never} params={l.params as never} search={l.search as never}>
                {l.label}
                <span aria-hidden="true"> →</span>
              </Link>
            ))}
          </div>
        )}
        <p className="shop-trust">Ships from Washington · Checked in-house before it ships · Family owned</p>
      </div>
    </section>
  )
}
