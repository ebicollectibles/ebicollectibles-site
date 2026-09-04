import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { formatMoney, type Product } from '~/lib/products'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

export function ProductCard({ product, variant = 'full' }: { product: Product; variant?: 'compact' | 'full' }) {
  const { addToCart } = useCart()
  const [justAdded, setJustAdded] = React.useState(false)
  const revertTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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

  const compact = variant === 'compact'
  const padding = compact ? 18 : 20
  const nameMinHeight = compact ? 38 : 40
  const nameFontSize = compact ? 14 : 15
  const priceFontSize = compact ? 16 : 17
  const buttonPadding = compact ? 11 : 12
  const buttonMarginTop = compact ? 14 : 16

  return (
    <article style={{ background: '#ffffff', padding, display: 'flex', flexDirection: 'column' }}>
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}
      >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}>
        {product.img ? (
          <img
            src={product.img}
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
    </article>
  )
}
