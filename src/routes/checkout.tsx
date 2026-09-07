import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { SquareCardField, squareConfigured, type SquareCardFieldHandle } from '~/components/SquareCardField'
import { ApplePayButton } from '~/components/ApplePayButton'
import { PasswordInput } from '~/components/PasswordInput'
import { useCart, type BillingAddress, type CheckoutContact } from '~/lib/cart-context'
import { formatMoney } from '~/lib/products'
import { US_STATES } from '~/lib/us-states'
import { customerLogout, getCurrentCustomer } from '~/server/customer-auth'
import { customerLogin } from '~/server/customers'
import { startGoogleAuth } from '~/server/google-auth'
import { getSalesTaxRate } from '~/server/tax'

export const Route = createFileRoute('/checkout')({
  loader: () => getCurrentCustomer(),
  component: CheckoutPage,
})

type Account = { id: string; email: string; name: string | null }

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

const fieldStyle: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '13px 14px',
  fontSize: 14,
  outline: 'none',
  color: '#131b28',
}

const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: 'block' }

const darkBtn: React.CSSProperties = {
  width: '100%',
  background: '#131b28',
  color: '#ffffff',
  border: 0,
  borderRadius: 2,
  padding: '12px 22px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

const outlineBtn: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  color: '#131b28',
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '12px 22px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

const emptyContact: CheckoutContact = {
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
}

const emptyBilling: BillingAddress = {
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// A stored account name is one free-text field; the checkout form wants it
// split into first/last — best-effort on the first space, never blocking.
function splitName(name: string | null): { firstName: string; lastName: string } {
  if (!name) return { firstName: '', lastName: '' }
  const trimmed = name.trim()
  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) return { firstName: trimmed, lastName: '' }
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1).trim() }
}

function CheckoutPage() {
  const cart = useCart()
  const initialAccount = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const cardRef = React.useRef<SquareCardFieldHandle>(null)

  // Logged-in visitors skip straight to the real form; logged-out visitors
  // see the guest-or-sign-in choice first — but only here, not on /cart.
  const [checkoutAs, setCheckoutAs] = React.useState<'guest' | 'account' | null>(initialAccount ? 'account' : null)
  const [account, setAccount] = React.useState<Account | null>(initialAccount)
  const [contact, setContact] = React.useState<CheckoutContact>(() =>
    initialAccount ? { ...emptyContact, email: initialAccount.email, ...splitName(initialAccount.name) } : emptyContact,
  )
  const contactComplete =
    EMAIL_RE.test(contact.email.trim()) &&
    contact.firstName.trim() !== '' &&
    contact.lastName.trim() !== '' &&
    contact.street.trim() !== '' &&
    contact.city.trim() !== '' &&
    contact.state.trim() !== '' &&
    contact.zip.trim() !== ''
  const [sameAsShipping, setSameAsShipping] = React.useState(false)
  const [billing, setBilling] = React.useState<BillingAddress>(emptyBilling)
  const billingComplete =
    sameAsShipping ||
    (billing.street.trim() !== '' && billing.city.trim() !== '' && billing.state.trim() !== '' && billing.zip.trim() !== '')
  const [confirmed, setConfirmed] = React.useState<{ orderNo: number; paymentStatus: string } | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Only WA is taxed right now, and the rate is destination-based (varies by
  // address, not just state) — so there's nothing meaningful to show until
  // they've picked WA and typed a ZIP. Re-resolved live (debounced) as the
  // shipping address changes; the actual charge is always recomputed
  // authoritatively server-side in placeOrder regardless of this estimate.
  const [taxRate, setTaxRate] = React.useState(0)
  React.useEffect(() => {
    if (contact.state !== 'WA' || contact.zip.trim() === '') {
      setTaxRate(0)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      getSalesTaxRate({ data: { state: contact.state, street: contact.street, city: contact.city, zip: contact.zip } })
        .then((result) => {
          if (!cancelled) setTaxRate(result.rate)
        })
        .catch(() => {
          if (!cancelled) setTaxRate(0)
        })
    }, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [contact.state, contact.street, contact.city, contact.zip])
  const tax = Math.round(cart.subtotal * taxRate * 100) / 100
  const total = cart.subtotal + cart.shippingCost + tax

  const [signinEmail, setSigninEmail] = React.useState('')
  const [signinPassword, setSigninPassword] = React.useState('')
  const [signinError, setSigninError] = React.useState<string | null>(null)
  const [signinSubmitting, setSigninSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)

  if (confirmed) {
    return <Confirmation orderNo={confirmed.orderNo} paymentStatus={confirmed.paymentStatus} />
  }

  const field = (
    key: keyof CheckoutContact,
    invalidMessages?: Partial<Record<'valueMissing' | 'typeMismatch', string>>,
  ) => ({
    value: contact[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.setCustomValidity('')
      setContact((c) => ({ ...c, [key]: e.target.value }))
    },
    onInvalid: invalidMessages
      ? (e: React.InvalidEvent<HTMLInputElement>) => {
          const target = e.target as HTMLInputElement
          const message = target.validity.valueMissing
            ? invalidMessages.valueMissing
            : target.validity.typeMismatch
              ? invalidMessages.typeMismatch
              : undefined
          target.setCustomValidity(message ?? '')
        }
      : undefined,
  })

  const billingField = (
    key: keyof BillingAddress,
    invalidMessages?: Partial<Record<'valueMissing' | 'typeMismatch', string>>,
  ) => ({
    value: billing[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.setCustomValidity('')
      setBilling((b) => ({ ...b, [key]: e.target.value }))
    },
    onInvalid: invalidMessages
      ? (e: React.InvalidEvent<HTMLInputElement>) => {
          const target = e.target as HTMLInputElement
          target.setCustomValidity(target.validity.valueMissing ? (invalidMessages.valueMissing ?? '') : '')
        }
      : undefined,
  })

  const finishOrder = async (sourceId: string | null) => {
    setError(null)
    setSubmitting(true)
    try {
      const effectiveBilling: BillingAddress = sameAsShipping
        ? { street: contact.street, apartment: contact.apartment, city: contact.city, state: contact.state, zip: contact.zip }
        : billing
      const result = await cart.placeOrder({ contact, billing: effectiveBilling, sourceId })
      setConfirmed({ orderNo: result.orderNo, paymentStatus: result.paymentStatus })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  const submit = async () => {
    let sourceId: string | null = null
    if (squareConfigured) {
      try {
        sourceId = (await cardRef.current?.tokenize()) ?? null
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Card details could not be verified.')
        return
      }
    }
    await finishOrder(sourceId)
  }

  const continueAsGuest = () => setCheckoutAs('guest')

  const switchToSignin = () => setCheckoutAs(null)

  const switchAccount = async () => {
    await customerLogout()
    await router.invalidate()
    setAccount(null)
    setCheckoutAs(null)
    setContact(emptyContact)
  }

  const submitSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSigninError(null)
    setSigninSubmitting(true)
    try {
      const result = await customerLogin({ data: { email: signinEmail, password: signinPassword } })
      if (result.verificationRequired) {
        navigate({ to: '/account/verify', search: { email: result.email } })
        return
      }
      await router.invalidate()
      const acct = await getCurrentCustomer()
      setAccount(acct)
      setContact((c) => ({
        ...c,
        email: acct?.email ?? signinEmail,
        ...(acct ? splitName(acct.name) : {}),
      }))
      setCheckoutAs('account')
    } catch (err) {
      setSigninError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setSigninSubmitting(false)
    }
  }

  const continueWithGoogle = async () => {
    setSigninError(null)
    setGoogleBusy(true)
    try {
      const { url } = await startGoogleAuth({ data: { next: '/checkout' } })
      window.location.href = url
    } catch (err) {
      setSigninError(err instanceof Error ? err.message : 'Google sign-in is not available right now.')
      setGoogleBusy(false)
    }
  }

  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 20px 90px' }}>
      <Link to="/shop" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
        ← Continue shopping
      </Link>
      <h1 style={{ fontSize: 34, letterSpacing: '-0.025em', fontWeight: 700, margin: '14px 0 0' }}>Checkout</h1>

      <div className="ebi-checkout-layout" style={{ marginTop: 34, alignItems: 'start' }}>
        <div>
          {checkoutAs === null ? (
            <ChoicePanel
              signinEmail={signinEmail}
              setSigninEmail={setSigninEmail}
              signinPassword={signinPassword}
              setSigninPassword={setSigninPassword}
              signinError={signinError}
              signinSubmitting={signinSubmitting}
              googleBusy={googleBusy}
              onSubmitSignin={submitSignin}
              onContinueWithGoogle={continueWithGoogle}
              onContinueAsGuest={continueAsGuest}
            />
          ) : (
            <form
              id="checkout-form"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#3f7a63',
                  background: '#eaf2ee',
                  borderRadius: 2,
                  padding: '7px 12px',
                  marginBottom: 20,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7a63', flexShrink: 0 }} />
                {checkoutAs === 'account' ? `Signed in as ${account?.email}` : 'Checking out as guest'}
                <button
                  type="button"
                  onClick={checkoutAs === 'account' ? switchAccount : switchToSignin}
                  style={{ marginLeft: 4, background: 'none', border: 0, padding: 0, color: '#5a6875', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}
                >
                  {checkoutAs === 'account' ? 'not you?' : 'sign in instead'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid #131b28', paddingTop: 22 }}>
                <div style={monoLabel}>01 / Contact</div>
                <input
                  placeholder="Email address"
                  type="email"
                  required
                  className="ebi-field"
                  style={{ ...fieldStyle, marginTop: 14, width: '100%' }}
                  {...field('email', {
                    valueMissing: 'Enter your email address so we can send your order confirmation.',
                    typeMismatch: 'That email address doesn’t look right — double-check it.',
                  })}
                />
              </div>

              <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
                <div style={monoLabel}>02 / Shipping address</div>
                <div className="ebi-checkout-2col" style={{ marginTop: 14 }}>
                  <input
                    placeholder="First name"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('firstName', { valueMissing: 'Enter your first name.' })}
                  />
                  <input
                    placeholder="Last name"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('lastName', { valueMissing: 'Enter your last name.' })}
                  />
                  <input
                    placeholder="Street address"
                    required
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('street', { valueMissing: 'Enter the street address to ship to.' })}
                  />
                  <input
                    placeholder="Apartment, suite (optional)"
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('apartment')}
                  />
                  <input
                    placeholder="City"
                    required
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('city', { valueMissing: 'Enter the city to ship to.' })}
                  />
                  <select
                    required
                    className="ebi-field"
                    style={{ ...fieldStyle, color: contact.state ? fieldStyle.color : '#98a1ab' }}
                    value={contact.state}
                    onChange={(e) => {
                      e.target.setCustomValidity('')
                      setContact((c) => ({ ...c, state: e.target.value }))
                    }}
                    onInvalid={(e) => e.currentTarget.setCustomValidity('Select the state to ship to.')}
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="ZIP code"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('zip', { valueMissing: 'Enter the ZIP code to ship to.' })}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
                <div style={monoLabel}>03 / Billing address</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />
                  Use shipping address as billing address
                </label>
                {!sameAsShipping && (
                  <div className="ebi-checkout-2col" style={{ marginTop: 14 }}>
                    <input
                      placeholder="Street address"
                      required
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('street', { valueMissing: 'Enter the billing street address.' })}
                    />
                    <input
                      placeholder="Apartment, suite (optional)"
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('apartment')}
                    />
                    <input
                      placeholder="City"
                      required
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('city', { valueMissing: 'Enter the billing city.' })}
                    />
                    <select
                      required
                      className="ebi-field"
                      style={{ ...fieldStyle, color: billing.state ? fieldStyle.color : '#98a1ab' }}
                      value={billing.state}
                      onChange={(e) => {
                        e.target.setCustomValidity('')
                        setBilling((b) => ({ ...b, state: e.target.value }))
                      }}
                      onInvalid={(e) => e.currentTarget.setCustomValidity('Select the billing state.')}
                    >
                      <option value="">State</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="ZIP code"
                      required
                      className="ebi-field"
                      style={fieldStyle}
                      {...billingField('zip', { valueMissing: 'Enter the billing ZIP code.' })}
                    />
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
                <div style={monoLabel}>04 / Payment</div>
                <div style={{ marginTop: 14 }}>
                  {squareConfigured ? (
                    <>
                      <ApplePayButton
                        amount={total}
                        disabled={submitting || !contactComplete || !billingComplete}
                        onTokenize={(sourceId) => finishOrder(sourceId)}
                        onError={setError}
                      />
                      <SquareCardField ref={cardRef} />
                    </>
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
              </div>

              {/* Order summary + place-order action lives in the aside for desktop layout parity with the design */}
            </form>
          )}
        </div>

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
            <p style={{ fontSize: 13.5, color: '#131b28', margin: '4px 0 0' }}>Your cart is empty — add a box to check out.</p>
          )}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #e3e6ea', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#131b28' }}>Subtotal</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(cart.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#131b28' }}>Shipping</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cart.shippingLabel}</span>
            </div>
            {contact.state === 'WA' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#131b28' }}>Estimated tax</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(tax)}</span>
              </div>
            )}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #131b28', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 21, fontWeight: 500 }}>{formatMoney(total)}</span>
          </div>
          {checkoutAs !== null && (
            <>
              {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
              <button
                type="submit"
                form="checkout-form"
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
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

function ChoicePanel({
  signinEmail,
  setSigninEmail,
  signinPassword,
  setSigninPassword,
  signinError,
  signinSubmitting,
  googleBusy,
  onSubmitSignin,
  onContinueWithGoogle,
  onContinueAsGuest,
}: {
  signinEmail: string
  setSigninEmail: (v: string) => void
  signinPassword: string
  setSigninPassword: (v: string) => void
  signinError: string | null
  signinSubmitting: boolean
  googleBusy: boolean
  onSubmitSignin: (e: React.FormEvent) => void
  onContinueWithGoogle: () => void
  onContinueAsGuest: () => void
}) {
  const cardStyle: React.CSSProperties = { border: '1px solid #e3e6ea', borderRadius: 2, padding: '20px 22px', marginBottom: 14 }

  return (
    <div style={{ borderTop: '1px solid #131b28', paddingTop: 22 }}>
      <p style={{ fontSize: 13.5, color: '#3d4753', margin: '0 0 20px' }}>How would you like to check out?</p>

      <div style={{ ...cardStyle, borderColor: '#131b28' }}>
        <h2 style={{ fontSize: 15.5, fontWeight: 700, margin: 0 }}>Sign in</h2>
        <p style={{ fontSize: 12.5, color: '#98a1ab', margin: '6px 0 16px', lineHeight: 1.5, maxWidth: '46ch' }}>
          Skip retyping your address, and track this order from your account. New here?{' '}
          <Link to="/account/signup" style={{ color: '#131b28', fontWeight: 600 }}>
            Create an account
          </Link>{' '}
          instead.
        </p>

        <button type="button" onClick={onContinueWithGoogle} disabled={googleBusy} style={{ ...outlineBtn, cursor: googleBusy ? 'not-allowed' : 'pointer', opacity: googleBusy ? 0.6 : 1 }}>
          {googleBusy ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', fontSize: 11.5, color: '#98a1ab' }}>
          <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
          or
          <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
        </div>

        <form onSubmit={onSubmitSignin}>
          <label style={label}>Email</label>
          <input
            type="email"
            required
            value={signinEmail}
            onChange={(e) => setSigninEmail(e.target.value)}
            style={{ ...fieldStyle, width: '100%' }}
          />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
            <label style={{ ...label, marginTop: 0, marginBottom: 0 }}>Password</label>
            <Link to="/account/forgot-password" style={{ fontSize: 12, color: '#5a6875' }}>
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            required
            value={signinPassword}
            onChange={(e) => setSigninPassword(e.target.value)}
            style={{ ...fieldStyle, width: '100%', marginTop: 6 }}
          />
          {signinError && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{signinError}</p>}
          <button
            type="submit"
            disabled={signinSubmitting}
            style={{ ...darkBtn, marginTop: 16, cursor: signinSubmitting ? 'not-allowed' : 'pointer', opacity: signinSubmitting ? 0.6 : 1 }}
          >
            {signinSubmitting ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: 15.5, fontWeight: 700, margin: 0 }}>Continue as guest</h2>
        <p style={{ fontSize: 12.5, color: '#98a1ab', margin: '6px 0 16px', lineHeight: 1.5, maxWidth: '46ch' }}>
          Enter your shipping details and pay — we'll email your receipt. No account required.
        </p>
        <button type="button" onClick={onContinueAsGuest} style={outlineBtn}>
          Continue as guest →
        </button>
      </div>
    </div>
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
      <p style={{ fontSize: 15, lineHeight: 1.65, color: '#131b28', margin: '12px 0 0' }}>
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
