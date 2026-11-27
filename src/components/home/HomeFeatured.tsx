import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { formatMoney, type Product } from '~/lib/products'
import { FREE_GIFT_PROMOS } from '~/lib/promotions'

// The three things the homepage leads with, right under the sale banner:
// two pre-orders and the Gem Vol 7 free-binder deal. Each card is worked
// out from the live catalog and drops out on its own when it can't be
// bought (sold out, not orderable, or the free binders are gone).
const RADIANT = 'pokemon-chinese-radiant-crystal-pikachu-gift-box'
const AURA = 'pokemon-japanese-aura-seeker-m7-booster-box'
const GEM7_PROMO = FREE_GIFT_PROMOS.find((p) => p.id === 'gem7-psyduck-binder')!

interface Card {
  key: string
  eyebrow: string
  title: string
  body: string
  price: string
  cta: string
  productId: string
  images: Array<{ src: string; alt: string }>
  tone: 'pink' | 'teal' | 'gold'
}

const orderable = (p: Product | undefined): p is Product => !!p && !p.comingSoon && !p.notSellable && p.stock > 0 && !p.hideFromShopGrid

export function HomeFeatured({ products }: { products: Product[] }) {
  const byId = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const cards: Card[] = []

  const radiant = byId.get(RADIANT)
  if (orderable(radiant)) {
    cards.push({
      key: 'radiant',
      eyebrow: 'Pre-order now',
      title: 'Radiant Crystal Pikachu Gift Box',
      body: 'Stellar Pikachu ex promo and 21 booster packs. Ships after the December 4 release.',
      price: formatMoney(radiant.price),
      cta: 'Pre-order',
      productId: radiant.id,
      images: radiant.img ? [{ src: radiant.img, alt: radiant.imgAlt || radiant.name }] : [],
      tone: 'pink',
    })
  }

  const aura = byId.get(AURA)
  if (orderable(aura)) {
    cards.push({
      key: 'aura',
      eyebrow: 'Pre-order · Japanese',
      title: 'Aura Seeker Booster Box',
      body: `Mega Lucario Z ex leads the new Japanese set. ${aura.restockNote ? `${aura.restockNote}.` : ''}`.trim(),
      price: formatMoney(aura.price),
      cta: 'Pre-order',
      productId: aura.id,
      images: aura.img ? [{ src: aura.img, alt: aura.imgAlt || aura.name }] : [],
      tone: 'teal',
    })
  }

  const gem7 = byId.get(GEM7_PROMO.buyProductId)
  const binder = byId.get(GEM7_PROMO.giftProductId)
  if (GEM7_PROMO.active && orderable(gem7) && binder && binder.stock > 0) {
    cards.push({
      key: 'gem7',
      eyebrow: 'Deal · While supplies last',
      title: `Buy ${GEM7_PROMO.buyQty} Gem Vol 7, get a Psyduck Mini Binder free`,
      body: `Add ${GEM7_PROMO.buyQty} Gem Vol 7 booster boxes and the binder goes in your cart for free, one for every ${GEM7_PROMO.buyQty} boxes.`,
      price: `${formatMoney(gem7.price)} a box`,
      cta: 'Shop Gem Vol 7',
      productId: gem7.id,
      images: [
        ...(gem7.img ? [{ src: gem7.img, alt: gem7.imgAlt || gem7.name }] : []),
        ...(binder.img ? [{ src: binder.img, alt: binder.imgAlt || binder.name }] : []),
      ],
      tone: 'gold',
    })
  }

  if (cards.length === 0) return null
  return (
    <section className="hp2-feat" aria-label="Featured">
      <ul className={`hp2-wrap hp2-feat-grid n-${cards.length}`}>
        {cards.map((c) => (
          <li key={c.key} className={`hp2-feat-card is-${c.tone}`}>
            <Link to="/products/$id" params={{ id: c.productId }} className="hp2-feat-img" tabIndex={-1} aria-hidden="true">
              {c.images.map((im, i) => (
                <img key={i} src={im.src} alt="" loading="eager" />
              ))}
            </Link>
            <div className="hp2-feat-body">
              <span className="hp2-feat-eyebrow">{c.eyebrow}</span>
              <Link to="/products/$id" params={{ id: c.productId }} className="hp2-feat-title">
                {c.title}
              </Link>
              <p>{c.body}</p>
              <div className="hp2-feat-foot">
                <span className="hp2-feat-price">{c.price}</span>
                <Link to="/products/$id" params={{ id: c.productId }} className="hp2-feat-btn">
                  {c.cta} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
