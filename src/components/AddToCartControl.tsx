import * as React from 'react'
import { useCart } from '~/lib/cart-context'
import type { Product } from '~/lib/products'

const qtyBtnStyle: React.CSSProperties = {
  flexShrink: 0,
  background: 'transparent',
  color: '#ffffff',
  border: 0,
  fontSize: 16,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
}

export function AddToCartControl({
  product,
  padding = 12,
  fontSize = 12.5,
  qtyBtnWidth = 40,
  maxWidth,
  marginTop,
}: {
  product: Product
  padding?: number
  fontSize?: number
  qtyBtnWidth?: number
  maxWidth?: number
  marginTop?: number
}) {
  const { addToCart, bump, lines } = useCart()
  const [justAdded, setJustAdded] = React.useState(false)
  const revertTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const qtyInCart = lines.find((l) => l.product.id === product.id)?.qty ?? 0

  // Brief scale pulse whenever the quantity actually changes (but not on
  // first mount, e.g. a cart restored from localStorage) — quick tactile
  // confirmation that a tap registered, without needing a full re-animation.
  const prevQty = React.useRef(qtyInCart)
  const [pulse, setPulse] = React.useState(false)
  React.useEffect(() => {
    if (prevQty.current !== qtyInCart) {
      prevQty.current = qtyInCart
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 220)
      return () => clearTimeout(t)
    }
  }, [qtyInCart])

  React.useEffect(() => () => clearTimeout(revertTimer.current), [])

  const handleAdd = () => {
    addToCart(product)
    setJustAdded(true)
    clearTimeout(revertTimer.current)
    revertTimer.current = setTimeout(() => setJustAdded(false), 1400)
  }

  const soldOut = product.stock === 0
  const btnLabel = soldOut ? 'Sold out' : product.preorder ? 'Pre-order' : 'Add to cart'
  const atMaxStock = qtyInCart >= product.stock

  // Once added, the card settles into a persistent stepper instead of
  // reverting to a plain "Add to cart" button — the brief checkmark still
  // plays first (justAdded), then this takes over.
  const showStepper = qtyInCart > 0 && !justAdded

  if (showStepper) {
    return (
      <div
        className="ebi-qty-stepper"
        style={{
          marginTop,
          maxWidth,
          display: 'flex',
          alignItems: 'stretch',
          border: '1px solid #131b28',
          borderRadius: 2,
          overflow: 'hidden',
          background: '#131b28',
        }}
      >
        <button
          type="button"
          onClick={() => bump(product.id, -1)}
          aria-label="Remove one from cart"
          className="ebi-qty-btn"
          style={{ ...qtyBtnStyle, width: qtyBtnWidth, borderRight: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer' }}
        >
          −
        </button>
        <span
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: '#ffffff',
            fontSize,
            fontWeight: 600,
            lineHeight: 1,
            padding,
          }}
        >
          <span
            className={pulse ? 'ebi-qty-pulse' : undefined}
            style={{ display: 'inline-block', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
          >
            {qtyInCart}
          </span>
          <span style={{ fontWeight: 500, opacity: 0.7 }}>in cart</span>
        </span>
        <button
          type="button"
          onClick={() => bump(product.id, 1)}
          disabled={atMaxStock}
          aria-label="Add one more to cart"
          className="ebi-qty-btn"
          style={{
            ...qtyBtnStyle,
            width: qtyBtnWidth,
            borderLeft: '1px solid rgba(255,255,255,0.18)',
            opacity: atMaxStock ? 0.35 : 1,
            cursor: atMaxStock ? 'not-allowed' : 'pointer',
          }}
        >
          +
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={soldOut}
      className="ebi-atc-btn"
      style={{
        marginTop,
        maxWidth,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: '1px solid #131b28',
        background: soldOut ? '#ffffff' : '#131b28',
        color: soldOut ? '#98a1ab' : '#ffffff',
        borderRadius: 2,
        padding,
        fontSize,
        fontWeight: 600,
        cursor: soldOut ? 'not-allowed' : 'pointer',
        opacity: soldOut ? 0.45 : 1,
      }}
    >
      {justAdded ? (
        <svg className="ebi-atc-check" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="ebi-atc-label">{btnLabel}</span>
      )}
    </button>
  )
}
