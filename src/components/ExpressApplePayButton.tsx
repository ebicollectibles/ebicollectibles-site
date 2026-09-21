import * as React from 'react'
import { loadSquareSdk, SQUARE_APP_ID, SQUARE_LOCATION_ID } from '~/lib/square-sdk'
import { useCart, type BillingAddress, type CheckoutContact } from '~/lib/cart-context'
import { US_STATE_CODES } from '~/lib/us-states'
import { trackEvent } from '~/lib/analytics'
import { getSalesTaxRate } from '~/server/tax'
import { getMyStoreCredit } from '~/server/store-credit'

// Lets someone pay straight from the cart page with Apple Pay, skipping the
// regular checkout form entirely — Apple Pay collects the shipping/billing
// contact itself instead. Distinct from ApplePayButton (used on the
// checkout page), which relies on contact info already typed into the
// form and never asks Apple Pay for it again — see the comment there.
export function ExpressApplePayButton({
  disabled,
  onOrderPlaced,
  onError,
}: {
  disabled?: boolean
  onOrderPlaced: (result: { orderNo: number; paymentStatus: string; hasPreorder: boolean; hasDelayedShipment: boolean }) => void
  onError: (message: string) => void
}) {
  const cart = useCart()
  const [available, setAvailable] = React.useState(false)
  const applePayRef = React.useRef<any>(null)
  const [busy, setBusy] = React.useState(false)

  // Store credit only exists for signed-in accounts (see
  // server/store-credit.ts) — getMyStoreCredit already returns 0 for a
  // guest, so no separate "am I signed in" check is needed here. This is
  // the same preview-only balance checkout.tsx uses; placeOrder always
  // re-derives and clamps the real amount server-side regardless of what's
  // shown in the Apple Pay sheet.
  const [creditBalance, setCreditBalance] = React.useState(0)
  React.useEffect(() => {
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
  }, [])

  // handleClick reads this when placing the order — a ref rather than state
  // since it's updated from inside the Apple Pay SDK's own event handler
  // (shippingcontactchanged), not from a React render.
  const creditAppliedRef = React.useRef(0)

  React.useEffect(() => {
    if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID || cart.cartEmpty) return
    let cancelled = false

    async function init() {
      await loadSquareSdk().catch(() => null)
      if (cancelled || !window.Square) return
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID)

        const initialTotal = cart.subtotal + cart.shippingCost
        const initialCreditApplied = Math.min(creditBalance, initialTotal)
        const initialAmountDue = Math.max(0, Math.round((initialTotal - initialCreditApplied) * 100) / 100)
        // Nothing left to charge via card before tax is even known — Apple
        // Pay has nothing to do here. The regular checkout page (or the
        // "Checkout" button just above this one) handles a fully-credit-
        // covered order correctly; this express button just sits out.
        if (initialAmountDue <= 0 && creditBalance > 0) {
          setAvailable(false)
          return
        }
        creditAppliedRef.current = initialCreditApplied

        // Tax is unknown until Apple Pay tells us a shipping address (see
        // the shippingcontactchanged handler below) — starts at $0 and
        // updates live once the buyer picks an address in the sheet, the
        // same way any "pick an address, see tax update" checkout works.
        const paymentRequest = payments.paymentRequest({
          countryCode: 'US',
          currencyCode: 'USD',
          requestBillingContact: true,
          requestShippingContact: true,
          // A flat lineItems array — not the separate shippingLineItems/
          // taxLineItems fields the SDK's types also document — is what
          // actually renders in the sheet's itemized breakdown (confirmed
          // against the checkout-page Apple Pay button); rebuilt whole on
          // every update below rather than only touching the tax entry.
          lineItems: [
            { label: 'Subtotal', amount: cart.subtotal.toFixed(2) },
            { label: 'Shipping', amount: cart.shippingCost.toFixed(2) },
            ...(initialCreditApplied > 0 ? [{ label: 'Store credit', amount: (-initialCreditApplied).toFixed(2) }] : []),
          ],
          // Only one rate exists, but showing it as a "Shipping Method" row
          // (rather than just a line in the total) is what buyers expect
          // from Apple Pay — every other flat-rate checkout still shows it.
          shippingOptions: [{ id: 'flat', label: 'Standard Shipping', amount: cart.shippingCost.toFixed(2) }],
          total: {
            amount: initialAmountDue.toFixed(2),
            label: 'EBI Collectibles',
          },
        })

        paymentRequest.addEventListener('shippingcontactchanged', async (contact: any) => {
          if (contact.countryCode && contact.countryCode !== 'US') {
            return { error: 'Sorry, we only ship within the US.' }
          }
          if (contact.state && !US_STATE_CODES.includes(contact.state)) {
            return { error: 'Enter a valid US state.' }
          }
          const { rate } = await getSalesTaxRate({
            data: { state: contact.state ?? '', city: contact.city ?? '', zip: contact.postalCode ?? '', street: contact.addressLines?.[0] ?? '' },
          }).catch(() => ({ rate: 0 }))
          const tax = Math.round(cart.subtotal * rate * 100) / 100
          const total = cart.subtotal + cart.shippingCost + tax
          const creditApplied = Math.min(creditBalance, total)
          const amountDue = Math.max(0, Math.round((total - creditApplied) * 100) / 100)
          creditAppliedRef.current = creditApplied
          return {
            total: { amount: amountDue.toFixed(2), label: 'EBI Collectibles' },
            lineItems: [
              { label: 'Subtotal', amount: cart.subtotal.toFixed(2) },
              { label: 'Shipping', amount: cart.shippingCost.toFixed(2) },
              ...(rate > 0 ? [{ label: 'Tax', amount: tax.toFixed(2) }] : []),
              ...(creditApplied > 0 ? [{ label: 'Store credit', amount: (-creditApplied).toFixed(2) }] : []),
            ],
          }
        })

        const applePay = await payments.applePay(paymentRequest)
        if (cancelled) return
        applePayRef.current = applePay
        setAvailable(true)
      } catch {
        // Same as ApplePayButton — not available here, no error to show.
        setAvailable(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.cartEmpty, cart.subtotal, cart.shippingCost, creditBalance])

  const handleClick = async () => {
    if (!applePayRef.current || busy) return
    setBusy(true)
    try {
      const result = await applePayRef.current.tokenize()
      if (result.status !== 'OK') {
        onError(result.errors?.[0]?.message || 'Apple Pay could not be completed.')
        return
      }

      const shippingContact = result.details?.shipping?.contact
      const billingContact = result.details?.billing
      if (!shippingContact?.postalCode || !shippingContact?.state) {
        onError('Apple Pay did not share a shipping address — try again or use the regular checkout.')
        return
      }
      if (!shippingContact.email) {
        onError('Apple Pay did not share an email address — try again or use the regular checkout.')
        return
      }

      const contact: CheckoutContact = {
        email: shippingContact.email,
        phone: shippingContact.phone ?? '',
        firstName: shippingContact.givenName ?? '',
        lastName: shippingContact.familyName ?? '',
        street: shippingContact.addressLines?.[0] ?? '',
        apartment: shippingContact.addressLines?.[1] ?? '',
        city: shippingContact.city ?? '',
        state: shippingContact.state,
        zip: shippingContact.postalCode,
      }
      // Falls back to the shipping contact when Apple Pay doesn't separately
      // share a billing contact — happens when the buyer's card billing
      // address matches their shipping address in Wallet.
      const billing: BillingAddress = billingContact
        ? {
            firstName: billingContact.givenName ?? contact.firstName,
            lastName: billingContact.familyName ?? contact.lastName,
            street: billingContact.addressLines?.[0] ?? contact.street,
            apartment: billingContact.addressLines?.[1] ?? contact.apartment,
            city: billingContact.city ?? contact.city,
            state: billingContact.state ?? contact.state,
            zip: billingContact.postalCode ?? contact.zip,
          }
        : { ...contact }

      const orderResult = await cart.placeOrder({ contact, billing, sourceId: result.token, emailOptIn: false, creditApplied: creditAppliedRef.current })
      trackEvent('purchase', {
        transaction_id: String(orderResult.orderNo),
        currency: 'USD',
        value: orderResult.total,
        items: cart.lines.map((l) => ({ item_id: l.product.id, item_name: l.product.name, price: l.product.price, quantity: l.qty })),
      })
      onOrderPlaced({
        orderNo: orderResult.orderNo,
        paymentStatus: orderResult.paymentStatus,
        hasPreorder: cart.lines.some((l) => l.product.preorder),
        hasDelayedShipment: cart.lines.some((l) => l.product.shipsWithDelay),
      })
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Apple Pay could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  if (!available) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || busy}
      aria-label="Express checkout with Apple Pay"
      className="ebi-apple-pay-button"
    />
  )
}
