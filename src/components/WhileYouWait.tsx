import * as React from 'react'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { SHIPPING_HANDLING_MAX_DAYS, SHIPPING_HANDLING_MIN_DAYS } from '~/lib/policy'

// In-stock picks shown to someone buying a pre-order: in the cart (they can
// add them to the same order, which then waits and ships together) and on
// the order confirmation (a new order, which ships on its own). The owner
// chose these three products. Prices, stock and badges come from the live
// catalog through ProductCard; anything sold out or already in the cart is
// left out, and the whole block hides if nothing is left.
export const WHILE_YOU_WAIT_IDS = [
  'pokemon-chinese-gem-volume-7-booster-box',
  'pokemon-chinese-day-night-ex-gift-box',
  'pokemon-chinese-30th-celebration-booster-box',
]

// On (owner approved Nov 2026). routes/preview-while-you-wait.tsx shows it
// without needing a pre-order in the cart.
export const SHOW_WHILE_YOU_WAIT = true

const CSS = `
.wyw { margin-top: 40px; }
.wyw-eyebrow { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #a85b2c; }
.wyw h2 { margin: 6px 0 0; font-size: 22px; letter-spacing: -.02em; font-weight: 700; color: #131b28; }
.wyw-note { margin: 8px 0 0; font-size: 13px; line-height: 1.55; color: #5a6875; max-width: 60ch; }
.wyw-row { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: #e3e6ea; border: 1px solid #e3e6ea; }
.wyw-row > li { display: flex; min-width: 0; }
.wyw-row > li > article { flex: 1; }
@media (max-width: 640px) {
  .wyw-row { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; gap: 1px; }
  .wyw-row::-webkit-scrollbar { display: none; }
  .wyw-row > li { flex: 0 0 62%; scroll-snap-align: start; }
}
.wyw--after { text-align: left; margin-top: 44px; padding-top: 28px; border-top: 1px solid #e3e6ea; }
`

export function WhileYouWait({ mode }: { mode: 'cart' | 'after' }) {
  const { products, lines } = useCart()
  const inCart = new Set(lines.map((l) => l.product.id))
  const picks = WHILE_YOU_WAIT_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => !!p && p.stock > 0 && !p.comingSoon && !p.notSellable && !p.preorder && (mode === 'after' || !inCart.has(p.id)),
  )
  if (picks.length === 0) return null
  const days = `${SHIPPING_HANDLING_MIN_DAYS}–${SHIPPING_HANDLING_MAX_DAYS}`
  return (
    <section className={`wyw${mode === 'after' ? ' wyw--after' : ''}`} aria-labelledby={`wyw-${mode}`}>
      <style>{CSS}</style>
      <div className="wyw-eyebrow">{mode === 'cart' ? 'Add to your order' : 'Ships with your pre-order'}</div>
      <h2 id={`wyw-${mode}`}>{mode === 'cart' ? 'Ships with your pre-order' : 'Add to your pre-order'}</h2>
      <p className="wyw-note">
        {mode === 'cart'
          ? 'In stock now. Anything you add here goes in the same box as your pre-order and ships together with it.'
          : `In stock now. Signed in to your account? Add these to your cart and at checkout choose to ship them with your pre-order: no extra shipping. Otherwise a new order ships in ${days} business days.`}
      </p>
      <ul className="wyw-row">
        {picks.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  )
}
