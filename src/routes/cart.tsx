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
  color: '#131b28',
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
          <p style={{ fontSize: 13.5, color: '#131b28', margin: '8px 0 20px' }}>
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
              <div key={line.id} style={{ display: 'flex', gap: 20, padding: '24px 4px', borderBottom: '1px solid #e3e6ea' }}>
                <div className="ebi-cart-line-image" style={{ flexShrink: 0, background: '#f6f7f8', overflow: 'hidden' }}>
                  {line.product.img ? (
                    <img
                      src={line.product.img}
                      alt={line.product.imgAlt || line.product.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundImage: STRIPES }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>{line.product.name}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, flexShrink: 0 }}>
                      {formatMoney(line.lineTotal)}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#131b28', marginTop: 6 }}>
                    {formatMoney(line.product.price)}
                  </div>
                  <div style={{ flex: 1, minHeight: 14 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cfd4da', borderRadius: 4 }}>
                      <button
                        onClick={() => bump(line.id, -1)}
                        aria-label="Decrease quantity"
                        style={{ width: 44, height: 44, background: 'transparent', border: 0, cursor: 'pointer', color: '#5a6875', fontSize: 17 }}
                      >
                        −
                      </button>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, width: 34, textAlign: 'center' }}>
                        {line.qty}
                      </span>
                      <button
                        onClick={() => bump(line.id, 1)}
                        aria-label="Increase quantity"
                        disabled={line.qty >= line.product.stock}
                        style={{
                          width: 44,
                          height: 44,
                          background: 'transparent',
                          border: 0,
                          cursor: line.qty >= line.product.stock ? 'not-allowed' : 'pointer',
                          color: line.qty >= line.product.stock ? '#cfd4da' : '#5a6875',
                          fontSize: 17,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(line.id)}
                      aria-label="Remove from cart"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        color: '#131b28',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, color: '#131b28' }}>Subtotal ({cartCount} item{cartCount === 1 ? '' : 's'})</span>
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
