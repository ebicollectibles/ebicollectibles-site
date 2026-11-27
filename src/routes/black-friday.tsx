import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import homeShopCssUrl from '~/styles/home-shop.css?url'
import { ProductCard } from '~/components/ProductCard'
import { PRIZE_IMAGES } from '~/components/home/HomeContest'
import { useCart } from '~/lib/cart-context'
import { CONTEST_ENDS_LABEL, CONTEST_PRIZES, contestLive } from '~/lib/contest'
import { FREE_GIFT_PROMOS } from '~/lib/promotions'
import { getInStockVariant, isOnSale, type Product } from '~/lib/products'

const SITE_URL = 'https://ebicollectibles.com'

// The Black Friday Promotion page: the prizes, how the free packs work, and
// in-stock picks to shop (owner's call, Nov 2026: only items that ship now,
// no pre-orders). Every "See prizes" link points here.
export const Route = createFileRoute('/black-friday')({
  head: () => ({
    meta: [
      { title: 'Black Friday Promotion: Free Packs and Prizes | EBI Collectibles' },
      { name: 'description', content: 'Every order gets a free Chinese pack, every $100 adds another, and the top spender gets a free 30th Celebration Pokémon Center ETB. Ends Monday 11/30.' },
      { property: 'og:title', content: 'Black Friday Promotion at EBI Collectibles' },
      { property: 'og:description', content: 'Every order gets a free Chinese pack, every $100 adds another, and the top spender gets a free 30th Celebration Pokémon Center ETB. Ends Monday 11/30.' },
      { property: 'og:image', content: `${SITE_URL}/assets/share/home-black-friday-v3.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: `${SITE_URL}/black-friday` },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/black-friday` },
      { rel: 'stylesheet', href: homeShopCssUrl },
    ],
  }),
  component: BlackFridayPage,
})

// The first picks, in the owner's order (Nov 2026): the two pre-orders, the
// Gem Vol 7 binder deal, then the 30th Celebration box and Day & Night UPC,
// then Black Bolt and White Flare, then the 30th binder. Anything not orderable is skipped.
const LEAD_PICKS = [
  'pokemon-chinese-radiant-crystal-pikachu-gift-box',
  'pokemon-japanese-aura-seeker-m7-booster-box',
  'pokemon-chinese-gem-volume-7-booster-box',
  'pokemon-chinese-30th-celebration-booster-box',
  'pokemon-chinese-day-night-ex-gift-box',
  'pokemon-chinese-black-bolt-slim-booster-box',
  'pokemon-chinese-white-flare-slim-booster-box',
  'pokemon-chinese-black-bolt-jumbo-booster-box',
  'pokemon-chinese-white-flare-jumbo-booster-box',
  'pokemon-chinese-30th-celebration-9-pocket-zip-binder',
]

const pctOff = (p: Product) => (p.compareAtPrice && p.compareAtPrice > p.price && p.price > 0 ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0)

function BlackFridayPage() {
  const { products } = useCart()
  const live = contestLive()
  const picks = React.useMemo(() => {
    const inStock = products.filter(
      (p) =>
        !p.hideFromShopGrid &&
        !p.preorder &&
        !p.comingSoon &&
        p.category !== 'Acrylic Cases' &&
        (p.notSellable ? !!getInStockVariant(p, products) : p.stock > 0 && p.price > 0),
    )
    const byId = new Map(products.map((p) => [p.id, p]))
    const lead = LEAD_PICKS.map((id) => byId.get(id)).filter(
      (p): p is Product => !!p && !p.hideFromShopGrid && !p.comingSoon && !p.notSellable && p.stock > 0 && p.price > 0,
    )
    const leadIds = new Set(lead.map((p) => p.id))
    const onSale = [
      ...lead,
      ...inStock.filter((p) => !leadIds.has(p.id) && isOnSale(p, products)).sort((a, b) => pctOff(b) - pctOff(a) || (a.bestSellingRank ?? 999) - (b.bestSellingRank ?? 999)),
    ]
    const shown = new Set(onSale.map((p) => p.id))
    const rest = inStock.filter((p) => !shown.has(p.id)).sort((a, b) => (a.bestSellingRank ?? 999) - (b.bestSellingRank ?? 999))
    return { onSale, rest }
  }, [products])
  const gem = FREE_GIFT_PROMOS.find((p) => p.id === 'gem7-psyduck-binder')!
  const gemBox = products.find((p) => p.id === gem.buyProductId)
  const binder = products.find((p) => p.id === gem.giftProductId)
  const gemDeal = gem.active && gemBox && gemBox.stock > 0 && binder && binder.stock > 0

  return (
    <div className="hp2">
      <section className="hp2-contest" style={{ padding: '36px 0 40px' }}>
        <div className="hp2-wrap">
          <span className="hp2-contest-eyebrow">{live ? `Black Friday Promotion · Ends ${CONTEST_ENDS_LABEL}` : 'Black Friday Promotion · Ended'}</span>
          <h1 style={{ margin: '8px 0 0', fontSize: 38, letterSpacing: '-0.025em', lineHeight: 1.08 }}>Spend more, get more</h1>
          {live ? (
            <p style={{ margin: '10px 0 0', fontSize: 15.5, lineHeight: 1.6, color: '#c9d1da', maxWidth: 720 }}>
              <b style={{ color: '#fff' }}>Every order gets a free Chinese pack.</b> Every $100 adds another, so a $250 order gets 3. Keep going: the top 3
              spenders by {CONTEST_ENDS_LABEL} get 30th Celebration prizes.
            </p>
          ) : (
            <p style={{ margin: '10px 0 0', fontSize: 15.5, lineHeight: 1.6, color: '#c9d1da' }}>The promotion has ended. Thank you to everyone who shopped it!</p>
          )}
          <ol className="hp2-bf-prizes">
            {CONTEST_PRIZES.map((p) => {
              const img = PRIZE_IMAGES[p.place]
              return (
                <li key={p.place}>
                  <div className="hp2-bf-prize-img">{img && <img src={img.src} alt={img.alt} />}</div>
                  <div className="hp2-bf-prize-cap">
                    <b>{p.label}</b>
                    <span>{p.prize}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {live && (
        <section className="hp2-wrap" style={{ paddingTop: 28 }}>
          <ol className="hp2-bf-steps">
            <li>
              <b>1</b>
              <span>Place any order and it gets a free Chinese pack.</span>
            </li>
            <li>
              <b>2</b>
              <span>Every $100 you spend adds another free pack to the same order.</span>
            </li>
            <li>
              <b>3</b>
              <span>The top 3 spenders by {CONTEST_ENDS_LABEL} get the prizes above.</span>
            </li>
          </ol>
          {gemDeal && (
            <p className="hp2-bf-deal">
              Stacking up? Every 5 <Link to="/products/$id" params={{ id: gemBox!.id }}>Gem Vol 7 booster boxes</Link> also adds a free Psyduck Mini
              Binder to your cart, while supplies last.
            </p>
          )}
        </section>
      )}

      {picks.onSale.length > 0 && (
        <section className="hp2-wrap" style={{ paddingTop: 36 }}>
          <div className="hp2-head">
            <div>
              <div className="hp2-eyebrow">Black Friday picks</div>
              <h2>Shop the sale</h2>
              <p>Pre-orders and our top picks first, then the biggest markdowns. Pre-orders count toward the promotion too.</p>
            </div>
          </div>
          <div className="ebi-shop-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea' }}>
            {picks.onSale.map((p, i) => (
              <ProductCard key={p.id} product={p} variant="full" priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      {picks.rest.length > 0 && (
        <section className="hp2-wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
          <div className="hp2-head">
            <div>
              <div className="hp2-eyebrow">In stock · Ships now</div>
              <h2>More to add to your order</h2>
              <p>Best sellers first.</p>
            </div>
          </div>
          <div className="ebi-shop-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea' }}>
            {picks.rest.map((p) => (
              <ProductCard key={p.id} product={p} variant="full" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
