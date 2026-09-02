import { useCart } from '~/lib/cart-context'
import { formatMoney, type Product } from '~/lib/products'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

export function ProductCard({ product, variant = 'full' }: { product: Product; variant?: 'compact' | 'full' }) {
  const { addToCart } = useCart()

  const soldOut = product.stock === 0
  const low = !soldOut && product.stock <= 5
  const badge = product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : low ? 'Low stock' : null
  const badgeBg = product.preorder ? '#3f7a63' : soldOut ? '#98a1ab' : '#b4622f'
  const stockLabel = soldOut ? 'Out of stock' : product.preorder ? 'Ships on release' : `${product.stock} in stock`
  const stockColor = soldOut ? '#98a1ab' : low ? '#b4622f' : '#3f7a63'
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
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: product.img ? `url(${product.img})` : STRIPES,
          }}
        />
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

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.12em',
          color: '#98a1ab',
          marginTop: compact ? 14 : 16,
        }}
      >
        {compact ? product.code : `${product.code} · ${product.type}`}
      </div>
      <h3
        style={{
          fontSize: nameFontSize,
          fontWeight: 600,
          lineHeight: 1.35,
          margin: '6px 0 0',
          minHeight: nameMinHeight,
          textWrap: 'pretty',
        }}
      >
        {product.name}
      </h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: compact ? 8 : 9, marginTop: 10 }}>
        <span style={{ fontSize: priceFontSize, fontWeight: 600 }}>{formatMoney(product.price)}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: stockColor }}>
          {stockLabel}
        </span>
      </div>
      <button
        onClick={() => addToCart(product)}
        disabled={soldOut}
        style={{
          marginTop: buttonMarginTop,
          width: '100%',
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
        {btnLabel}
      </button>
    </article>
  )
}
