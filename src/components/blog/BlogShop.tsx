import * as React from 'react'
import { Link, useLoaderData } from '@tanstack/react-router'
import type { BlogShopProduct } from '~/server/blog-status'

// Shop panels for blog posts: a compact strip after the chase cards and a
// panel at the end. Prices come live from the store (getBlogPostStatus).
// Stock is deliberately not shown: every button just opens the product
// page, which handles availability (add to cart, sold out, notify me).

export type CtaLink = {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  label: string
  variant?: 'light' | 'ghost'
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
  return (
    <Link to="/products/$id" params={{ id: p.id }} className={className}>
      Shop now
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
  const lead = products[0]

  if (products.length === 1) {
    const p = products[0]
    const price = priceOf(p)
    return (
      <div className="shop-strip">
        {p.img && <img src={p.img} alt={p.imgAlt || p.name} width={64} height={64} />}
        <div className="shop-strip-text">
          <b>{splitName(p).title}</b>
          {price && <span>{price}</span>}
        </div>
        <ProductLinkButton p={p} className="btn btn-dark" />
      </div>
    )
  }

  const prices = products.map(priceOf).filter(Boolean)
  const min = products.filter((p) => priceOf(p)).reduce((m, p) => Math.min(m, p.price), Infinity)
  const kinds = products.map((p) => kindLabel(p)?.replace(/ box$/i, '').toLowerCase()).filter(Boolean)
  const title = splitName(lead).title
  return (
    <div className="shop-strip">
      {lead.img && <img src={lead.img} alt={lead.imgAlt || lead.name} width={64} height={64} />}
      <div className="shop-strip-text">
        <b>
          {title}: {kinds.join(' or ')}
        </b>
        {prices.length > 0 && <span>From {money(min)}</span>}
      </div>
      <a href="#shop" className="btn btn-dark">
        Choose your box
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  )
}

/** End of post: product tiles with live prices, then the reading links. */
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
        {products.length === 0 && <p>{body}</p>}
      </div>

      {products.length > 0 && (
        <div className={`shop-tiles n-${Math.min(products.length, 3)}`}>
          {products.map((p) => {
            const price = priceOf(p)
            const kind = kindLabel(p)
            const note = noteFor(p)
            return (
              <div key={p.id} className="shop-tile">
                <Link to="/products/$id" params={{ id: p.id }} className="shop-tile-img" tabIndex={-1} aria-hidden="true">
                  {p.img && <img src={p.img} alt="" loading="lazy" width={240} height={240} />}
                </Link>
                <div className="shop-tile-body">
                  {kind && <span className="shop-kind">{kind}</span>}
                  <Link to="/products/$id" params={{ id: p.id }} className="shop-title">
                    {splitName(p).title}
                  </Link>
                  {note && <p className="shop-note">{note}</p>}
                  {price && (
                    <div className="shop-meta">
                      <span className="shop-price">{price}</span>
                    </div>
                  )}
                  <ProductLinkButton p={p} className="btn btn-dark btn-block" />
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
