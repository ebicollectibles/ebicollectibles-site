import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { SET_PACK_IMAGES } from '~/data/set-pack-images'
import { formatMoney, type Product } from '~/lib/products'
import { percentOff } from './HomeRail'

// "Shop by set" for the homepage proposal: each Simplified Chinese set we
// have booster boxes of, as its own pack art, newest release first. The
// price is the lowest live price among that set's boxes in stock, and the
// set's tagline and Chinese Exclusive count come from the /sets index, so
// nothing here is typed in by hand.

const BOX_NAME: Record<string, (s: GemSetSummary) => string> = {
  gem: (s) => s.name.replace(/^Gem Vol /, 'Gem Volume ') + ' Booster Box',
  default: (s) => `${s.name} Booster Box`,
}

/** The product-name text that identifies this set's booster boxes (also the shop search that lists them). */
export function setBoxQuery(s: GemSetSummary): string {
  return (s.series === 'Gem Set' ? BOX_NAME.gem : BOX_NAME.default)(s)
}

export interface SetTile {
  set: GemSetSummary
  query: string
  boxes: Product[]
  fromPrice: number | null
  maxOff: number
  hasSlimAndJumbo: boolean
}

export function buildSetTiles(products: Product[]): SetTile[] {
  const tiles: SetTile[] = []
  for (const set of GEM_SETS) {
    if (!SET_PACK_IMAGES[set.slug]) continue
    const query = setBoxQuery(set)
    const q = query.toLowerCase()
    const boxes = products.filter(
      (p) => p.subcategory === 'Booster Box' && !p.hideFromShopGrid && !p.notSellable && p.name.toLowerCase().includes(q),
    )
    const buyable = boxes.filter((p) => !p.comingSoon && (p.stock > 0 || p.preorder) && p.price > 0 && !p.hidePrice)
    if (buyable.length === 0) continue
    tiles.push({
      set,
      query,
      boxes: buyable,
      fromPrice: Math.min(...buyable.map((p) => p.price)),
      maxOff: Math.max(0, ...buyable.map(percentOff)),
      hasSlimAndJumbo: buyable.some((p) => /slim/i.test(p.name)) && buyable.some((p) => /jumbo/i.test(p.name)),
    })
  }
  // Newest first; same-day releases keep the /sets index order.
  return tiles
    .map((t, i) => ({ t, i }))
    .sort((a, b) => b.t.set.releaseDate.localeCompare(a.t.set.releaseDate) || a.i - b.i)
    .map((x) => x.t)
}

export function HomeSets({ products }: { products: Product[] }) {
  const tiles = React.useMemo(() => buildSetTiles(products), [products])
  if (tiles.length === 0) return null
  return (
    <section className="hp2-section" aria-labelledby="hp2-sets">
      <div className="hp2-wrap">
        <div className="hp2-head">
          <div>
            <div className="hp2-eyebrow">Booster boxes</div>
            <h2 id="hp2-sets">Shop by set</h2>
            <p>Every Simplified Chinese set we have in stock, newest first.</p>
          </div>
          <div className="hp2-head-actions">
            <Link to="/sets/chinese" className="hp2-seeall hp2-seeall--quiet">
              Card lists →
            </Link>
            <Link to="/shop" search={{ subcategory: 'Booster Box' }} className="hp2-seeall">
              All booster boxes
            </Link>
          </div>
        </div>
        <ul className="hp2-sets">
          {tiles.map(({ set, query, fromPrice, maxOff, hasSlimAndJumbo, boxes }, i) => {
            const img = SET_PACK_IMAGES[set.slug]
            return (
              <li key={set.slug} className="hp2-set">
                <Link to="/shop" search={{ q: query }} className="hp2-set-main">
                  <span className="hp2-set-art">
                    <img
                      src={`/assets/sets/packs/${set.slug}.webp`}
                      alt=""
                      width={img.w}
                      height={img.h}
                      loading={i < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </span>
                  <span className="hp2-set-code">
                    {set.code}
                    {maxOff >= 10 && <span className="hp2-set-sale">Sale</span>}
                  </span>
                  <span className="hp2-set-name">{set.name}</span>
                  <span className="hp2-set-tag">{set.tagline}</span>
                  <span className="hp2-set-price">
                    {fromPrice != null && (
                      <>
                        {boxes.length > 1 ? 'From ' : ''}
                        <b>{formatMoney(fromPrice)}</b>
                      </>
                    )}
                    {hasSlimAndJumbo && <span className="hp2-set-fmt"> · Slim &amp; Jumbo</span>}
                  </span>
                </Link>
                <Link to={set.path} className="hp2-set-list">
                  {set.cardCount}-card list →<span className="sr-only">: {set.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
