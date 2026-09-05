import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { formatMoney, type Product } from '~/lib/products'
import { ResponsiveImage } from '~/components/ResponsiveImage'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const qtyBtnStyle: React.CSSProperties = {
  width: 40,
  flexShrink: 0,
  background: 'transparent',
  color: '#ffffff',
  border: 0,
  fontSize: 16,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export function ProductCard({ product, variant = 'full' }: { product: Product; variant?: 'compact' | 'full' }) {
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
  const low = !soldOut && product.stock <= 5
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  const badge = product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : low ? 'Low stock' : onSale ? 'Sale' : null
  const badgeBg = product.preorder ? '#3f7a63' : soldOut ? '#98a1ab' : '#b4622f'
  const btnLabel = soldOut ? 'Sold out' : product.preorder ? 'Pre-order' : 'Add to cart'
  const atMaxStock = qtyInCart >= product.stock

  const compact = variant === 'compact'
  const padding = compact ? 18 : 20
  const nameMinHeight = compact ? 38 : 40
  const nameFontSize = compact ? 14 : 15
  const priceFontSize = compact ? 16 : 17
  const buttonPadding = compact ? 11 : 12
  const buttonMarginTop = compact ? 14 : 16

  // Once added, the card settles into a persistent stepper instead of
  // reverting to a plain "Add to cart" button — the brief checkmark still
  // plays first (justAdded), then this takes over.
  const showStepper = qtyInCart > 0 && !justAdded

  return (
    <article style={{ background: '#ffffff', padding, display: 'flex', flexDirection: 'column' }}>
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}
      >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}>
        {product.img ? (
          <ResponsiveImage
            desktop={product.img}
            tablet={product.imgTablet}
            mobile={product.imgMobile}
            alt={product.imgAlt || product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundImage: STRIPES }} />
        )}
        {!product.img && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#98a1ab',
              textAlign: 'center',
              padding: compact ? 16 : 18,
            }}
          >
            {product.placeholder || 'product shot'}
          </div>
        )}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '5px 9px',
              background: badgeBg,
              color: '#ffffff',
            }}
          >
            {badge}
          </div>
        )}
      </div>

      <h3
        style={{
          fontSize: nameFontSize,
          fontWeight: 600,
          lineHeight: 1.35,
          margin: 0,
          marginTop: compact ? 14 : 16,
          minHeight: nameMinHeight,
          textWrap: 'pretty',
        }}
      >
        {product.name}
      </h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
        {onSale && (
          <span style={{ fontSize: priceFontSize - 3, color: '#98a1ab', textDecoration: 'line-through' }}>
            {formatMoney(product.compareAtPrice!)}
          </span>
        )}
        <span style={{ fontSize: priceFontSize, fontWeight: 600, color: '#131b28' }}>
          {formatMoney(product.price)}
        </span>
      </div>
      </Link>
      {showStepper ? (
        <div
          className="ebi-qty-stepper"
          style={{
            marginTop: buttonMarginTop,
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
            style={{ ...qtyBtnStyle, borderRight: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer' }}
          >
            −
          </button>
          <span
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 600,
              padding: buttonPadding,
            }}
          >
            <span className={pulse ? 'ebi-qty-pulse' : undefined} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5 }}>
              {qtyInCart}
            </span>
            in cart
          </span>
          <button
            type="button"
            onClick={() => bump(product.id, 1)}
            disabled={atMaxStock}
            aria-label="Add one more to cart"
            className="ebi-qty-btn"
            style={{
              ...qtyBtnStyle,
              borderLeft: '1px solid rgba(255,255,255,0.18)',
              opacity: atMaxStock ? 0.35 : 1,
              cursor: atMaxStock ? 'not-allowed' : 'pointer',
            }}
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="ebi-atc-btn"
          style={{
            marginTop: buttonMarginTop,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            border: '1px solid #131b28',
            background: soldOut ? '#ffffff' : '#131b28',
            color: soldOut ? '#98a1ab' : '#ffffff',
            borderRadius: 2,
            padding: buttonPadding,
            fontSize: 12.5,
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
      )}
    </article>
  )
}
