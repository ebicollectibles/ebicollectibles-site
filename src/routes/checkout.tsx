import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SquareCardField, squareConfigured, type SquareCardFieldHandle } from '~/components/SquareCardField'
import { useCart, type CheckoutContact } from '~/lib/cart-context'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

const fieldStyle: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '13px 14px',
  fontSize: 14,
  outline: 'none',
  color: '#131b28',
}

const emptyContact: CheckoutContact = {
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  zip: '',
}

function CheckoutPage() {
  const cart = useCart()
  const cardRef = React.useRef<SquareCardFieldHandle>(null)
  const [contact, setContact] = React.useState<CheckoutContact>(emptyContact)
  const [confirmed, setConfirmed] = React.useState<{ orderNo: number; paymentStatus: string } | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (confirmed) {
    return <Confirmation orderNo={confirmed.orderNo} paymentStatus={confirmed.paymentStatus} />
  }

  const field = (key: keyof CheckoutContact) => ({
    value: contact[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setContact((c) => ({ ...c, [key]: e.target.value })),
  })

  const submit = async () => {
    setError(null)
    setSubmitting(true)
    try {
      let sourceId: string | null = null
      if (squareConfigured) {
        sourceId = (await cardRef.current?.tokenize()) ?? null
      }
      const result = await cart.placeOrder({ contact, sourceId })
      setConfirmed({ orderNo: result.orderNo, paymentStatus: result.paymentStatus })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 20px 90px' }}>
      <Link to="/shop" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
        ← Continue shopping
      </Link>
      <h1 style={{ fontSize: 34, letterSpacing: '-0.025em', fontWeight: 700, margin: '14px 0 0' }}>Checkout</h1>

      <div className="ebi-checkout-layout" style={{ marginTop: 34, alignItems: 'start' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div style={{ borderTop: '1px solid #131b28', paddingTop: 22 }}>
            <div style={monoLabel}>01 / Contact</div>
            <input
              placeholder="Email address"
              type="email"
              className="ebi-field"
              style={{ ...fieldStyle, marginTop: 14, width: '100%' }}
              {...field('email')}
            />
          </div>

          <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
            <div style={monoLabel}>02 / Shipping address</div>
            <div className="ebi-checkout-2col" style={{ marginTop: 14 }}>
              <input placeholder="First name" className="ebi-field" style={fieldStyle} {...field('firstName')} />
              <input placeholder="Last name" className="ebi-field" style={fieldStyle} {...field('lastName')} />
              <input
                placeholder="Street address"
                className="ebi-field ebi-field-full"
                style={fieldStyle}
                {...field('street')}
              />
              <input
                placeholder="Apartment, suite (optional)"
                className="ebi-field ebi-field-full"
                style={fieldStyle}
                {...field('apartment')}
              />
              <input placeholder="City" className="ebi-field" style={fieldStyle} {...field('city')} />
              <input placeholder="ZIP code" className="ebi-field" style={fieldStyle} {...field('zip')} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
            <div style={monoLabel}>03 / Payment</div>
            <div style={{ marginTop: 14 }}>
              {squareConfigured ? (
                <SquareCardField ref={cardRef} />
              ) : (
                <>
                  <div className="ebi-checkout-2col">
                    <input
                      placeholder="Card number"
                      disabled
                      className="ebi-field ebi-field-full"
                      style={{ ...fieldStyle, fontFamily: "'IBM Plex Mono', monospace", background: '#f6f7f8' }}
                    />
                    <input
                      placeholder="MM / YY"
                      disabled
                      className="ebi-field"
                      style={{ ...fieldStyle, fontFamily: "'IBM Plex Mono', monospace", background: '#f6f7f8' }}
                    />
                    <input
                      placeholder="CVC"
                      disabled
                      className="ebi-field"
                      style={{ ...fieldStyle, fontFamily: "'IBM Plex Mono', monospace", background: '#f6f7f8' }}
                    />
                  </div>
                  <p style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 8 }}>
                    Payments aren't configured yet — orders will be recorded without charging a card. Set
                    SQUARE_ACCESS_TOKEN / VITE_SQUARE_APPLICATION_ID to go live.
                  </p>
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#98a1ab' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7a63' }} />
              <span>Encrypted · Visa · Mastercard · Amex · Apple Pay · Alipay</span>
            </div>
          </div>

          {/* Order summary + place-order action lives in the aside for desktop layout parity with the design */}
        </form>

        <aside className="ebi-sticky-aside" style={{ border: '1px solid #e3e6ea', padding: 24 }}>
          <div style={monoLabel}>Order summary</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.lines.map((line) => (
              <div key={line.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 54, height: 54, flexShrink: 0, background: '#f6f7f8', overflow: 'hidden' }}>
                  {line.product.img ? (
                    <img
                      src={line.product.img}
                      alt={line.product.imgAlt || line.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundImage: STRIPES }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{line.product.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#98a1ab', marginTop: 3 }}>
                    Qty {line.qty}
                  </div>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{formatMoney(line.lineTotal)}</div>
              </div>
            ))}
          </div>
          {cart.cartEmpty && (
            <p style={{ fontSize: 13.5, color: '#98a1ab', margin: '4px 0 0' }}>Your cart is empty — add a box to check out.</p>
          )}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #e3e6ea', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5a6875' }}>Subtotal</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(cart.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5a6875' }}>Shipping</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cart.shippingLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5a6875' }}>Estimated tax</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(cart.tax)}</span>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #131b28', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 21, fontWeight: 500 }}>{formatMoney(cart.total)}</span>
          </div>
          {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={cart.cartEmpty || submitting}
            className="ebi-btn-dark"
            style={{
              marginTop: 20,
              width: '100%',
              background: '#131b28',
              color: '#ffffff',
              border: 0,
              borderRadius: 2,
              padding: 15,
              fontSize: 14,
              fontWeight: 600,
              cursor: cart.cartEmpty || submitting ? 'not-allowed' : 'pointer',
              opacity: cart.cartEmpty || submitting ? 0.45 : 1,
            }}
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
          <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#98a1ab', margin: '12px 0 0' }}>
            Pre-order lines are charged now and reserved against our allocation. Everything ships double-boxed with
            tracking.
          </p>
        </aside>
      </div>
    </section>
  )
}

function Confirmation({ orderNo, paymentStatus }: { orderNo: number; paymentStatus: string }) {
  return (
    <section style={{ maxWidth: 640, margin: '0 auto', padding: '110px 28px 140px', textAlign: 'center' }}>
      <div
        style={{
          width: 52,
          height: 52,
          margin: '0 auto',
          border: '1px solid #3f7a63',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3f7a63',
          fontSize: 22,
        }}
      >
        ✓
      </div>
      <h1 style={{ fontSize: 32, letterSpacing: '-0.02em', fontWeight: 700, margin: '24px 0 0' }}>Order confirmed</h1>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: '#5a6875', margin: '12px 0 0' }}>
        Order <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>#EBI-{orderNo}</span> is in the queue.
        You'll get the authentication photo set and tracking number by email within 48 hours.
      </p>
      {paymentStatus === 'test' && (
        <p style={{ fontSize: 12.5, color: '#b4622f', margin: '10px 0 0' }}>
          (Test mode — no card was charged. Configure Square to accept real payments.)
        </p>
      )}
      <Link
        to="/shop"
        className="ebi-btn-dark"
        style={{
          display: 'inline-block',
          marginTop: 28,
          background: '#131b28',
          color: '#ffffff',
          border: 0,
          borderRadius: 2,
          padding: '14px 26px',
          fontSize: 13.5,
          fontWeight: 600,
        }}
      >
        Back to the catalogue
      </Link>
    </section>
  )
}
