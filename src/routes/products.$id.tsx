import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/products/$id')({
  component: ProductDetailPage,
})

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

function ProductDetailPage() {
  const { id } = Route.useParams()
  const { products, addToCart } = useCart()
  const product = products.find((p) => p.id === id)

  const [justAdded, setJustAdded] = React.useState(false)
  const revertTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(revertTimer.current), [])

  const related = React.useMemo(() => {
    if (!product) return []
    const sameType = products.filter((p) => p.id !== product.id && p.type === product.type)
    const rest = products.filter((p) => p.id !== product.id && p.type !== product.type)
    return [...sameType, ...rest].slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '96px 20px', textAlign: 'center' }}>
        <div style={monoLabel}>Not found</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '10px 0 24px' }}>We couldn&apos;t find that product.</h1>
        <Link
          to="/shop"
          className="ebi-btn-dark"
          style={{ background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '13px 24px', fontSize: 13.5, fontWeight: 600 }}
        >
          Back to shop
        </Link>
      </section>
    )
  }

  const soldOut = product.stock === 0
  const low = !soldOut && product.stock <= 5
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  const badge = product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : low ? 'Low stock' : onSale ? 'Sale' : null
  const badgeBg = product.preorder ? '#3f7a63' : soldOut ? '#98a1ab' : '#b4622f'
  const stockLabel = soldOut ? 'Out of stock' : product.preorder ? 'Ships on release' : `${product.stock} in stock`
  const stockColor = soldOut ? '#98a1ab' : low ? '#b4622f' : '#3f7a63'
  const btnLabel = soldOut ? 'Sold out' : product.preorder ? 'Pre-order' : 'Add to cart'

  const handleAdd = () => {
    addToCart(product)
    setJustAdded(true)
    clearTimeout(revertTimer.current)
    revertTimer.current = setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 90px' }}>
      <div style={monoLabel}>
        <Link to="/shop" style={{ color: 'inherit' }}>
          Shop
        </Link>{' '}
        / {product.type}
      </div>

      <div className="ebi-product-detail-grid" style={{ marginTop: 24 }}>
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
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#98a1ab',
                textAlign: 'center',
                padding: 24,
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
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 10px',
                background: badgeBg,
                color: '#ffffff',
              }}
            >
              {badge}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#98a1ab' }}>
            {product.code} · {product.type}
          </div>
          <h1 style={{ fontSize: 32, letterSpacing: '-0.02em', fontWeight: 700, lineHeight: 1.15, margin: '10px 0 0', textWrap: 'pretty' }}>
            {product.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
            {onSale && (
              <span style={{ fontSize: 18, color: '#98a1ab', textDecoration: 'line-through' }}>
                {formatMoney(product.compareAtPrice!)}
              </span>
            )}
            <span style={{ fontSize: 26, fontWeight: 700, color: onSale ? '#b4622f' : '#131b28' }}>{formatMoney(product.price)}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: stockColor }}>{stockLabel}</span>
          </div>

          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#5a6875', maxWidth: '52ch', margin: '20px 0 0' }}>
            Sourced through authorised mainland distribution — never a grey-market repack. This unit is
            weight-checked against factory spec, seam-inspected and photographed against its case code before it
            ships, with those photos included in your tracking email.
          </p>

          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="ebi-atc-btn"
            style={{
              marginTop: 26,
              width: '100%',
              maxWidth: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              border: '1px solid #131b28',
              background: soldOut ? '#ffffff' : '#131b28',
              color: soldOut ? '#98a1ab' : '#ffffff',
              borderRadius: 2,
              padding: 14,
              fontSize: 13.5,
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

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid #e3e6ea', fontSize: 12.5, color: '#5a6875', lineHeight: 1.7 }}>
            <div>Ships double-boxed with tracking. {product.preorder ? 'Pre-order lines dispatch within 48 hours of the mainland street date.' : 'In-stock orders dispatch within 48 hours.'}</div>
            <div style={{ marginTop: 6 }}>
              Fails authentication? We refund it in full, shipping included. See{' '}
              <Link to="/faq" style={{ color: '#3f7a63', fontWeight: 600 }}>
                shipping &amp; authenticity
              </Link>
              .
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: 22,
              borderBottom: '1px solid #131b28',
            }}
          >
            <div>
              <div style={monoLabel}>Keep browsing</div>
              <h2 style={{ fontSize: 26, letterSpacing: '-0.02em', fontWeight: 700, margin: '9px 0 0' }}>You may also like</h2>
            </div>
          </div>
          <div className="ebi-arrivals-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea', borderTop: 0 }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
