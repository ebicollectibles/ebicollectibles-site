import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { SquareCardField, squareConfigured, type SquareCardFieldHandle } from '~/components/SquareCardField'
import { ApplePayButton } from '~/components/ApplePayButton'
import { CardBrandLogos } from '~/components/CardBrandLogos'
import { OrderConfirmation } from '~/components/OrderConfirmation'
import { PasswordInput } from '~/components/PasswordInput'
import { trackEvent } from '~/lib/analytics'
import { useCart, type BillingAddress, type CheckoutContact } from '~/lib/cart-context'
import { DELAYED_SHIPMENT_WARNING, hasDelayedShipment, hasMixedPreorderCart, isHiOrAk, MIXED_PREORDER_ERROR } from '~/lib/order-math'
import { BLOCK_HI_AK_CHECKOUT } from '~/lib/feature-flags'
import { formatMoney } from '~/lib/products'
import { US_STATES } from '~/lib/us-states'
import { customerLogout, getCurrentCustomer } from '~/server/customer-auth'
import { customerLogin } from '~/server/customers'
import { startGoogleAuth } from '~/server/google-auth'
import { getSalesTaxRate } from '~/server/tax'
import { getHiAkShippingEstimate } from '~/server/shippo'
import { getMyStoreCredit } from '~/server/store-credit'

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
  // iOS Safari auto-zooms the page in when a focused input's font-size is
  // under 16px, to keep the text legible — and doesn't always zoom back
  // out cleanly on blur, leaving the page stuck zoomed in. 16px is the
  // smallest size that avoids triggering it at all.
  fontSize: 16,
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
  phone: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
}

const emptyBilling: BillingAddress = {
  firstName: '',
  lastName: '',
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

// Small "?" that shows a tooltip on hover (desktop) or tap (mobile — a tap
// both focuses and clicks the button, and a tap elsewhere blurs it closed).
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        aria-label="More info"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid #5a6875',
          background: 'none',
          color: '#5a6875',
          fontSize: 10.5,
          fontWeight: 700,
          lineHeight: '14px',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '130%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#131b28',
            color: '#ffffff',
            fontSize: 11.5,
            lineHeight: 1.4,
            padding: '7px 10px',
            borderRadius: 3,
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

function CheckoutPage() {
  const cart = useCart()
  const mixedPreorder = hasMixedPreorderCart(cart.lines.map((l) => ({ preorder: !!l.product.preorder })))
  const delayedShipment = hasDelayedShipment(cart.lines.map((l) => ({ shipsWithDelay: !!l.product.shipsWithDelay })))
  const initialAccount = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const cardRef = React.useRef<SquareCardFieldHandle>(null)

  // Fires once the cart has actually hydrated from localStorage (it starts
  // empty for a beat on mount) — not on every later cart edit, just the
  // moment someone lands on checkout with items in it.
  const firedBeginCheckout = React.useRef(false)
  React.useEffect(() => {
    if (cart.cartEmpty || firedBeginCheckout.current) return
    firedBeginCheckout.current = true
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: cart.subtotal,
      items: cart.lines.map((l) => ({ item_id: l.product.id, item_name: l.product.name, price: l.product.price, quantity: l.qty })),
    })
  }, [cart.cartEmpty, cart.lines, cart.subtotal])

  // Logged-in visitors skip straight to the real form; logged-out visitors
  // see the guest-or-sign-in choice first — but only here, not on /cart.
  const [checkoutAs, setCheckoutAs] = React.useState<'guest' | 'account' | null>(initialAccount ? 'account' : null)
  const [account, setAccount] = React.useState<Account | null>(initialAccount)
  const [contact, setContact] = React.useState<CheckoutContact>(() =>
    initialAccount ? { ...emptyContact, email: initialAccount.email, ...splitName(initialAccount.name) } : emptyContact,
  )

  // initialAccount comes from the route loader, which reruns (and returns
  // the fresh signed-in-or-not state) whenever the router is invalidated —
  // e.g. logging in or out elsewhere and coming back to /checkout without
  // this component unmounting. But the useState initializers above only run
  // on the very first mount, so without this effect the page would keep
  // showing whichever auth state was true the first time it was visited.
  // Guarded by account id so it doesn't clobber in-progress form edits on
  // every unrelated re-render.
  const initialAccountId = initialAccount?.id ?? null
  const syncedAccountId = React.useRef(initialAccountId)
  React.useEffect(() => {
    if (initialAccountId === syncedAccountId.current) return
    syncedAccountId.current = initialAccountId
    setAccount(initialAccount)
    setCheckoutAs(initialAccount ? 'account' : null)
    setContact(initialAccount ? { ...emptyContact, email: initialAccount.email, ...splitName(initialAccount.name) } : emptyContact)
  }, [initialAccountId, initialAccount])
  // See BLOCK_HI_AK_CHECKOUT in feature-flags.ts — Shippo isn't live yet, so
  // rather than charge the flat mainland rate on a package that can genuinely
  // cost more, checkout is blocked outright for these two states for now.
  const hiAkBlocked = BLOCK_HI_AK_CHECKOUT && isHiOrAk(contact.state)
  const contactComplete =
    !hiAkBlocked &&
    EMAIL_RE.test(contact.email.trim()) &&
    contact.firstName.trim() !== '' &&
    contact.lastName.trim() !== '' &&
    contact.street.trim() !== '' &&
    contact.city.trim() !== '' &&
    contact.state.trim() !== '' &&
    contact.zip.trim() !== ''
  const [emailOptIn, setEmailOptIn] = React.useState(false)
  const [sameAsShipping, setSameAsShipping] = React.useState(false)
  const [billing, setBilling] = React.useState<BillingAddress>(emptyBilling)
  const billingComplete =
    sameAsShipping ||
    (billing.firstName.trim() !== '' &&
      billing.lastName.trim() !== '' &&
      billing.street.trim() !== '' &&
      billing.city.trim() !== '' &&
      billing.state.trim() !== '' &&
      billing.zip.trim() !== '')
  const [confirmed, setConfirmed] = React.useState<{
    orderNo: number
    paymentStatus: string
    hasPreorder: boolean
    hasDelayedShipment: boolean
  } | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [applePayAvailable, setApplePayAvailable] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'applePay'>('card')

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

  // Alaska/Hawaii only — everywhere else keeps the flat cart.shippingCost.
  // Same debounced-preview/authoritative-server-recompute split as tax
  // above; falls back to the flat rate on any failure so a Shippo hiccup
  // never blocks checkout.
  const [hiAkShippingCost, setHiAkShippingCost] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (hiAkBlocked || (contact.state !== 'HI' && contact.state !== 'AK')) {
      setHiAkShippingCost(null)
      return
    }
    if (contact.street.trim() === '' || contact.city.trim() === '' || contact.zip.trim() === '') {
      setHiAkShippingCost(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      getHiAkShippingEstimate({
        data: {
          items: cart.lines.map((l) => ({ weightLb: l.product.weightLb, qty: l.qty })),
          name: `${contact.firstName} ${contact.lastName}`.trim(),
          state: contact.state,
          street: contact.street,
          apartment: contact.apartment,
          city: contact.city,
          zip: contact.zip,
        },
      })
        .then((result) => {
          if (!cancelled) setHiAkShippingCost(result.rate)
        })
        .catch(() => {
          if (!cancelled) setHiAkShippingCost(null)
        })
    }, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [hiAkBlocked, contact.state, contact.street, contact.apartment, contact.city, contact.zip, contact.firstName, contact.lastName, cart.lines])
  const shippingCost = hiAkShippingCost ?? cart.shippingCost
  const shippingLabel = cart.cartEmpty ? '—' : formatMoney(shippingCost)
  const total = cart.subtotal + shippingCost + tax

  // Store credit only exists for signed-in accounts (see
  // server/store-credit.ts) — fetched once on sign-in, not re-fetched as
  // the form changes. Defaults to applying automatically when available,
  // same as how a gift card balance behaves at Amazon checkout; the
  // checkbox lets someone opt out (e.g. saving it for a future order).
  // placeOrder always re-derives and clamps this from the real DB balance —
  // this is purely a preview.
  const [creditBalance, setCreditBalance] = React.useState(0)
  const [applyCredit, setApplyCredit] = React.useState(true)
  React.useEffect(() => {
    if (checkoutAs !== 'account') {
      setCreditBalance(0)
      return
    }
    let cancelled = false
    getMyStoreCredit()
      .then((result) => {
        if (!cancelled) setCreditBalance(result.balance)
      })
      .catch(() => {
        if (!cancelled) setCreditBalance(0)
      })
    return () => {
      cancelled = true
    }
  }, [checkoutAs])
  const creditApplied = applyCredit ? Math.min(creditBalance, total) : 0
  const amountDue = Math.max(0, Math.round((total - creditApplied) * 100) / 100)

  const [signinEmail, setSigninEmail] = React.useState('')
  const [signinPassword, setSigninPassword] = React.useState('')
  const [signinError, setSigninError] = React.useState<string | null>(null)
  const [signinSubmitting, setSigninSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)

  if (confirmed) {
    return (
      <OrderConfirmation
        orderNo={confirmed.orderNo}
        paymentStatus={confirmed.paymentStatus}
        hasPreorder={confirmed.hasPreorder}
        hasDelayedShipment={confirmed.hasDelayedShipment}
      />
    )
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
    if (mixedPreorder) {
      setError(MIXED_PREORDER_ERROR)
      return
    }
    setSubmitting(true)
    try {
      const effectiveBilling: BillingAddress = sameAsShipping
        ? {
            firstName: contact.firstName,
            lastName: contact.lastName,
            street: contact.street,
            apartment: contact.apartment,
            city: contact.city,
            state: contact.state,
            zip: contact.zip,
          }
        : billing
      const result = await cart.placeOrder({ contact, billing: effectiveBilling, sourceId, emailOptIn, creditApplied })
      trackEvent('purchase', {
        transaction_id: String(result.orderNo),
        currency: 'USD',
        value: total,
        tax,
        shipping: shippingCost,
        items: cart.lines.map((l) => ({ item_id: l.product.id, item_name: l.product.name, price: l.product.price, quantity: l.qty })),
      })
      setConfirmed({
        orderNo: result.orderNo,
        paymentStatus: result.paymentStatus,
        hasPreorder: cart.lines.some((l) => l.product.preorder),
        hasDelayedShipment: cart.lines.some((l) => l.product.shipsWithDelay),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  const submit = async () => {
    if (hiAkBlocked) return
    let sourceId: string | null = null
    // Fully covered by store credit — nothing to tokenize, no card was
    // ever asked for. placeOrder skips Square entirely in this case too
    // (see server/orders.ts).
    if (squareConfigured && amountDue > 0) {
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
                  aria-label="Email address"
                  type="email"
                  required
                  className="ebi-field"
                  style={{ ...fieldStyle, marginTop: 14, width: '100%' }}
                  {...field('email', {
                    valueMissing: 'Enter your email address so we can send your order confirmation.',
                    typeMismatch: 'That email address doesn’t look right — double-check it.',
                  })}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, marginBottom: 6 }}>
                  <label htmlFor="checkout-phone" style={{ ...label, marginBottom: 0 }}>
                    Phone (optional)
                  </label>
                  <InfoTooltip text="In case we need to contact you about your order" />
                </div>
                <input
                  id="checkout-phone"
                  placeholder="(555) 555-5555"
                  type="tel"
                  className="ebi-field"
                  style={{ ...fieldStyle, width: '100%' }}
                  {...field('phone')}
                />
              </div>

              <div style={{ borderTop: '1px solid #e3e6ea', marginTop: 30, paddingTop: 22 }}>
                <div style={monoLabel}>02 / Shipping address</div>
                <div className="ebi-checkout-2col" style={{ marginTop: 14 }}>
                  <input
                    placeholder="First name"
                    aria-label="Shipping first name"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('firstName', { valueMissing: 'Enter your first name.' })}
                  />
                  <input
                    placeholder="Last name"
                    aria-label="Shipping last name"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('lastName', { valueMissing: 'Enter your last name.' })}
                  />
                  <input
                    placeholder="Street address"
                    aria-label="Shipping street address"
                    required
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('street', { valueMissing: 'Enter the street address to ship to.' })}
                  />
                  <input
                    placeholder="Apartment, suite (optional)"
                    aria-label="Shipping apartment or suite (optional)"
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('apartment')}
                  />
                  <input
                    placeholder="City"
                    aria-label="Shipping city"
                    required
                    className="ebi-field ebi-field-full"
                    style={fieldStyle}
                    {...field('city', { valueMissing: 'Enter the city to ship to.' })}
                  />
                  <select
                    required
                    aria-label="Shipping state"
                    className="ebi-field"
                    style={{ ...fieldStyle, color: contact.state ? fieldStyle.color : '#5a6875' }}
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
                    aria-label="Shipping ZIP code"
                    required
                    className="ebi-field"
                    style={fieldStyle}
                    {...field('zip', { valueMissing: 'Enter the ZIP code to ship to.' })}
                  />
                </div>
                {hiAkBlocked && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: '12px 16px',
                      background: '#fdf3ec',
                      border: '1px solid #e6c4a8',
                      borderRadius: 2,
                    }}
                  >
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: '#131b28', margin: 0 }}>
                      We can't ship to Alaska or Hawaii through the site just yet. Email{' '}
                      <a href="mailto:eastblueinternational@gmail.com" style={{ color: '#131b28', fontWeight: 600 }}>
                        eastblueinternational@gmail.com
                      </a>{' '}
                      and we'll get your order sorted directly.
                    </p>
                  </div>
                )}
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
                      placeholder="First name"
                      aria-label="Billing first name"
                      required
                      className="ebi-field"
                      style={fieldStyle}
                      {...billingField('firstName', { valueMissing: 'Enter the billing first name.' })}
                    />
                    <input
                      placeholder="Last name"
                      aria-label="Billing last name"
                      required
                      className="ebi-field"
                      style={fieldStyle}
                      {...billingField('lastName', { valueMissing: 'Enter the billing last name.' })}
                    />
                    <input
                      placeholder="Street address"
                      aria-label="Billing street address"
                      required
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('street', { valueMissing: 'Enter the billing street address.' })}
                    />
                    <input
                      placeholder="Apartment, suite (optional)"
                      aria-label="Billing apartment or suite (optional)"
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('apartment')}
                    />
                    <input
                      placeholder="City"
                      aria-label="Billing city"
                      required
                      className="ebi-field ebi-field-full"
                      style={fieldStyle}
                      {...billingField('city', { valueMissing: 'Enter the billing city.' })}
                    />
                    <select
                      required
                      aria-label="Billing state"
                      className="ebi-field"
                      style={{ ...fieldStyle, color: billing.state ? fieldStyle.color : '#5a6875' }}
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
                      aria-label="Billing ZIP code"
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
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            border: applePayAvailable ? '1px solid ' + (paymentMethod === 'card' ? '#131b28' : '#cfd4da') : 'none',
                            borderRadius: 2,
                            marginBottom: applePayAvailable ? 10 : 0,
                          }}
                        >
                          {applePayAvailable && (
                            <label
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}
                            >
                              <input
                                type="radio"
                                name="payment-method"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                style={{ width: 16, height: 16, accentColor: '#131b28', flexShrink: 0 }}
                              />
                              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Credit Card</span>
                              <span style={{ marginLeft: 'auto' }}>
                                <CardBrandLogos />
                              </span>
                            </label>
                          )}
                          <div
                            style={{
                              display: !applePayAvailable || paymentMethod === 'card' ? 'block' : 'none',
                              padding: applePayAvailable ? '0 14px 14px' : 0,
                            }}
                          >
                            <SquareCardField ref={cardRef} />
                          </div>
                        </div>

                        {/* Always mounted (never conditionally removed) even while hidden — its
                            own onAvailabilityChange call below is what sets applePayAvailable in
                            the first place, so it has to exist before that's known to be true. */}
                        <div
                          style={{
                            display: applePayAvailable ? 'block' : 'none',
                            border: '1px solid ' + (paymentMethod === 'applePay' ? '#131b28' : '#cfd4da'),
                            borderRadius: 2,
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentMethod === 'applePay'}
                              onChange={() => setPaymentMethod('applePay')}
                              style={{ width: 16, height: 16, accentColor: '#131b28', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: 13.5, fontWeight: 600 }}>Apple Pay</span>
                            {/* U+F8FF is Apple's own logo glyph in SF Pro — renders correctly only
                                on Apple devices, which is exactly who ever sees this option (Apple
                                Pay is only ever available in Safari on a Mac/iPhone/iPad). */}
                            <span style={{ marginLeft: 'auto', fontSize: 15 }} aria-hidden="true">
                              {'\uF8FF'} Pay
                            </span>
                          </label>
                          <div style={{ display: paymentMethod === 'applePay' ? 'block' : 'none', padding: '0 14px 14px' }}>
                            <ApplePayButton
                              amount={amountDue}
                              lineItems={[
                                { label: 'Subtotal', amount: cart.subtotal },
                                { label: 'Shipping', amount: shippingCost },
                                ...(contact.state === 'WA' ? [{ label: 'Tax', amount: tax }] : []),
                                ...(creditApplied > 0 ? [{ label: 'Store credit', amount: -creditApplied }] : []),
                              ]}
                              // amountDue <= 0 means credit alone covers the order — nothing
                              // for Apple Pay to charge, so it's disabled; "Place order"
                              // handles that case directly (see submit()).
                              disabled={submitting || !contactComplete || !billingComplete || mixedPreorder || amountDue <= 0}
                              onTokenize={(sourceId) => finishOrder(sourceId)}
                              onError={setError}
                              onAvailabilityChange={setApplePayAvailable}
                            />
                          </div>
                        </div>
                      </div>
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
                      <p style={{ fontSize: 11.5, color: '#5a6875', marginTop: 8 }}>
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
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#5a6875', marginTop: 3 }}>
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
          {mixedPreorder && (
            <p style={{ fontSize: 12.5, color: '#b4622f', margin: '12px 0 0', lineHeight: 1.5 }}>{MIXED_PREORDER_ERROR}</p>
          )}
          {!mixedPreorder && delayedShipment && (
            <p style={{ fontSize: 12.5, color: '#b4622f', margin: '12px 0 0', lineHeight: 1.5 }}>{DELAYED_SHIPMENT_WARNING}</p>
          )}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #e3e6ea', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#131b28' }}>Subtotal</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(cart.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#131b28' }}>Shipping</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{shippingLabel}</span>
            </div>
            {contact.state === 'WA' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#131b28' }}>Estimated tax</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(tax)}</span>
              </div>
            )}
            {creditApplied > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3f7a63' }}>Store credit</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#3f7a63' }}>-{formatMoney(creditApplied)}</span>
              </div>
            )}
          </div>
          {checkoutAs === 'account' && creditBalance > 0 && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 14,
                padding: '10px 12px',
                background: '#f6f7f8',
                borderRadius: 2,
                fontSize: 12.5,
                color: '#131b28',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={applyCredit} onChange={(e) => setApplyCredit(e.target.checked)} />
              <span>
                Store credit available: <strong>{formatMoney(creditBalance)}</strong> — apply to this order
              </span>
            </label>
          )}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #131b28', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 21, fontWeight: 500 }}>{formatMoney(amountDue)}</span>
          </div>
          {checkoutAs !== null && (
            <>
              {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 12.5, color: '#131b28', cursor: 'pointer' }}>
                <input type="checkbox" checked={emailOptIn} onChange={(e) => setEmailOptIn(e.target.checked)} />
                Email me about restocks and new drops
              </label>
              <button
                type="submit"
                form="checkout-form"
                disabled={cart.cartEmpty || mixedPreorder || submitting || hiAkBlocked}
                className="ebi-btn-dark"
                style={{
                  marginTop: 14,
                  width: '100%',
                  background: '#131b28',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: 2,
                  padding: 15,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: cart.cartEmpty || mixedPreorder || submitting || hiAkBlocked ? 'not-allowed' : 'pointer',
                  opacity: cart.cartEmpty || mixedPreorder || submitting || hiAkBlocked ? 0.45 : 1,
                }}
              >
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
              <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#5a6875', margin: '12px 0 0' }}>
                Carrier is chosen by us for the safest delivery. By placing this order, you agree to our{' '}
                <Link to="/shipping-policy" style={{ color: '#131b28', fontWeight: 600 }}>
                  Shipping Policy
                </Link>{' '}
                and{' '}
                <Link to="/refund-policy" style={{ color: '#131b28', fontWeight: 600 }}>
                  Refund Policy
                </Link>
                .
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
        <p style={{ fontSize: 12.5, color: '#5a6875', margin: '6px 0 16px', lineHeight: 1.5, maxWidth: '46ch' }}>
          Skip retyping your address, and track this order from your account. New here?{' '}
          <Link to="/account/signup" style={{ color: '#131b28', fontWeight: 600 }}>
            Create an account
          </Link>{' '}
          instead.
        </p>

        <button type="button" onClick={onContinueWithGoogle} disabled={googleBusy} style={{ ...outlineBtn, cursor: googleBusy ? 'not-allowed' : 'pointer', opacity: googleBusy ? 0.6 : 1 }}>
          {googleBusy ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', fontSize: 11.5, color: '#5a6875' }}>
          <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
          or
          <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
        </div>

        <form onSubmit={onSubmitSignin}>
          <label htmlFor="checkout-signin-email" style={label}>
            Email
          </label>
          <input
            id="checkout-signin-email"
            type="email"
            required
            value={signinEmail}
            onChange={(e) => setSigninEmail(e.target.value)}
            className="ebi-field"
            style={{ ...fieldStyle, width: '100%' }}
          />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
            <label htmlFor="checkout-signin-password" style={{ ...label, marginTop: 0, marginBottom: 0 }}>
              Password
            </label>
            <Link to="/account/forgot-password" style={{ fontSize: 12, color: '#5a6875' }}>
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="checkout-signin-password"
            required
            value={signinPassword}
            onChange={(e) => setSigninPassword(e.target.value)}
            className="ebi-field"
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
        <p style={{ fontSize: 12.5, color: '#5a6875', margin: '6px 0 16px', lineHeight: 1.5, maxWidth: '46ch' }}>
          Enter your shipping details and pay — we'll email your receipt. No account required.
        </p>
        <button type="button" onClick={onContinueAsGuest} style={outlineBtn}>
          Continue as guest →
        </button>
      </div>
    </div>
  )
}

