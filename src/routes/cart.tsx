import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

function CartPage() {
  const { lines, cartCount, cartEmpty, subtotal, bump, removeFromCart } = useCart()
  const navigate = useNavigate()

  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 90px' }}>
      <div style={monoLabel}>Shop / Cart</div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Your cart</h1>

      {cartEmpty ? (
        <div style={{ border: '1px solid #e3e6ea', marginTop: 32, padding: '70px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Your cart is empty.</div>
          <p style={{ fontSize: 13.5, color: '#98a1ab', margin: '8px 0 20px' }}>
            Sealed Chinese boxes move fast — grab one while it's live.
          </p>
          <Link
            to="/shop"
            className="ebi-btn-dark"
            style={{
              display: 'inline-block',
              background: '#131b28',
              color: '#ffffff',
              border: 0,
              borderRadius: 2,
              padding: '13px 24px',
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div style={{ borderTop: '1px solid #131b28', marginTop: 24 }}>
            {lines.map((line) => (
              <div
                key={line.id}
                style={{ display: 'flex', gap: 18, padding: '22px 4px', borderBottom: '1px solid #e3e6ea', alignItems: 'center' }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    flexShrink: 0,
                    background: '#f6f7f8',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: line.product.img ? `url(${line.product.img})` : STRIPES,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{line.product.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#98a1ab', marginTop: 4 }}>
                    {line.product.code} · {formatMoney(line.product.price)} each
                  </div>
                  <button
                    onClick={() => removeFromCart(line.id)}
                    style={{ background: 'transparent', border: 0, padding: '10px 0 0', fontSize: 11.5, color: '#98a1ab', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e3e6ea', borderRadius: 2, flexShrink: 0 }}>
                  <button
                    onClick={() => bump(line.id, -1)}
                    aria-label="Decrease quantity"
                    style={{ width: 34, height: 34, background: 'transparent', border: 0, cursor: 'pointer', color: '#5a6875', fontSize: 15 }}
                  >
                    −
                  </button>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, width: 30, textAlign: 'center' }}>
                    {line.qty}
                  </span>
                  <button
                    onClick={() => bump(line.id, 1)}
                    aria-label="Increase quantity"
                    disabled={line.qty >= line.product.stock}
                    style={{
                      width: 34,
                      height: 34,
                      background: 'transparent',
                      border: 0,
                      cursor: line.qty >= line.product.stock ? 'not-allowed' : 'pointer',
                      color: line.qty >= line.product.stock ? '#cfd4da' : '#5a6875',
                      fontSize: 15,
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14.5, width: 76, textAlign: 'right', flexShrink: 0 }}>
                  {formatMoney(line.lineTotal)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, color: '#5a6875' }}>Subtotal ({cartCount} item{cartCount === 1 ? '' : 's'})</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 500 }}>{formatMoney(subtotal)}</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 8 }}>Shipping and tax are calculated at checkout.</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <Link
                  to="/shop"
                  className="ebi-btn-outline"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#131b28',
                    border: '1px solid #cfd4da',
                    borderRadius: 2,
                    padding: 13,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Continue shopping
                </Link>
                <button
                  onClick={() => navigate({ to: '/checkout' })}
                  className="ebi-btn-dark"
                  style={{
                    flex: 1,
                    background: '#131b28',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: 2,
                    padding: 13,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
