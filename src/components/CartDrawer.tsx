import { useNavigate } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { formatMoney } from '~/lib/products'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

export function CartDrawer() {
  const { cartOpen, closeCart, lines, cartCount, cartEmpty, subtotal, freeShipNote, bump, removeFromCart } =
    useCart()
  const navigate = useNavigate()

  if (!cartOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        onClick={closeCart}
        className="ebi-cart-overlay"
        style={{ position: 'absolute', inset: 0, background: 'rgba(19,27,40,0.42)' }}
      />
      <aside
        className="ebi-cart-panel"
        style={{
          position: 'relative',
          width: 404,
          maxWidth: '92vw',
          background: '#ffffff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 50px rgba(19,27,40,0.18)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #e3e6ea',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.02em' }}>
            Your cart{' '}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: '#98a1ab' }}>
              ({cartCount})
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{ background: 'transparent', border: 0, fontSize: 20, lineHeight: 1, color: '#5a6875', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
          {cartEmpty && (
            <div style={{ padding: '70px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Nothing in here yet.</div>
              <p style={{ fontSize: 13, color: '#98a1ab', margin: '8px 0 18px' }}>
                Sealed Chinese boxes move fast — grab one while it's live.
              </p>
              <button
                onClick={() => {
                  closeCart()
                  navigate({ to: '/shop' })
                }}
                style={{
                  background: '#131b28',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: 2,
                  padding: '12px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Browse products
              </button>
            </div>
          )}
          {lines.map((line) => (
            <div key={line.id} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid #f0f2f4' }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  flexShrink: 0,
                  background: '#f6f7f8',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundImage: line.product.img ? `url(${line.product.img})` : STRIPES,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>{line.product.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#98a1ab', marginTop: 4 }}>
                  {line.product.code}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e3e6ea', borderRadius: 2 }}>
                    <button
                      onClick={() => bump(line.id, -1)}
                      style={{ width: 28, height: 28, background: 'transparent', border: 0, cursor: 'pointer', color: '#5a6875', fontSize: 14 }}
                    >
                      −
                    </button>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, width: 24, textAlign: 'center' }}>
                      {line.qty}
                    </span>
                    <button
                      onClick={() => bump(line.id, 1)}
                      style={{ width: 28, height: 28, background: 'transparent', border: 0, cursor: 'pointer', color: '#5a6875', fontSize: 14 }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
                    {formatMoney(line.lineTotal)}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(line.id)}
                  style={{ background: 'transparent', border: 0, padding: '8px 0 0', fontSize: 11.5, color: '#98a1ab', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #e3e6ea', padding: '20px 24px', background: '#f6f7f8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13.5, color: '#5a6875' }}>Subtotal</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19 }}>{formatMoney(subtotal)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 6 }}>{freeShipNote}</div>
          <button
            onClick={() => {
              closeCart()
              navigate({ to: '/checkout' })
            }}
            className="ebi-btn-dark"
            style={{
              marginTop: 16,
              width: '100%',
              background: '#131b28',
              color: '#ffffff',
              border: 0,
              borderRadius: 2,
              padding: 14,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}
