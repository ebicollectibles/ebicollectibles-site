import * as React from 'react'

declare global {
  interface Window {
    Square?: any
  }
}

const APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined
const LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined
const ENVIRONMENT = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) === 'production' ? 'production' : 'sandbox'
const SDK_SRC = ENVIRONMENT === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'

// Apple Pay only ever shows up in Safari on a Mac/iPhone/iPad with a card
// already in Apple Wallet, over a domain Square has verified for Apple Pay
// in the Developer Dashboard — everywhere else, `payments.applePay()`
// simply rejects and this component renders nothing. That's expected, not
// an error state; there's no user-facing fallback needed since the regular
// card field is always shown alongside it.
export function ApplePayButton({
  amount,
  lineItems,
  onTokenize,
  onError,
  disabled,
}: {
  amount: number
  // Shown above the total in the Apple Pay sheet — e.g. Subtotal/Shipping/
  // Tax, the same breakdown as the order summary on the rest of the
  // checkout page. Optional: with nothing passed, the sheet just shows the
  // one total line.
  lineItems?: Array<{ label: string; amount: number }>
  onTokenize: (sourceId: string) => void
  onError: (message: string) => void
  disabled?: boolean
}) {
  const [available, setAvailable] = React.useState(false)
  const applePayRef = React.useRef<any>(null)
  // amount alone doesn't catch every case where the breakdown changed but
  // happened to sum to the same total — stringify lineItems too so the
  // sheet is rebuilt whenever the actual numbers shown in it change.
  const lineItemsKey = lineItems?.map((l) => `${l.label}:${l.amount}`).join('|') ?? ''

  React.useEffect(() => {
    if (!APP_ID || !LOCATION_ID || amount <= 0) return
    let cancelled = false

    async function init() {
      if (!window.Square) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = SDK_SRC
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Square SDK'))
          document.head.appendChild(script)
        }).catch(() => null)
      }
      if (cancelled || !window.Square) return
      try {
        const payments = window.Square.payments(APP_ID, LOCATION_ID)
        const paymentRequest = payments.paymentRequest({
          countryCode: 'US',
          currencyCode: 'USD',
          total: { amount: amount.toFixed(2), label: 'EBI Collectibles' },
          lineItems: lineItems?.map((l) => ({ label: l.label, amount: l.amount.toFixed(2) })),
        })
        const applePay = await payments.applePay(paymentRequest)
        if (cancelled) return
        applePayRef.current = applePay
        setAvailable(true)
      } catch {
        // Apple Pay isn't available here (wrong browser/device, no card in
        // Wallet, or the domain isn't verified with Square yet) — hide the
        // button rather than surface an error.
        setAvailable(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, lineItemsKey])

  const handleClick = async () => {
    if (!applePayRef.current) return
    try {
      const result = await applePayRef.current.tokenize()
      if (result.status === 'OK') {
        onTokenize(result.token as string)
      } else {
        onError(result.errors?.[0]?.message || 'Apple Pay could not be completed.')
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Apple Pay could not be completed.')
    }
  }

  // Not available here (wrong browser/device, no card in Wallet, or the
  // domain isn't verified with Square yet) — render nothing, per the
  // comment above. A visible placeholder would make it look like an Apple
  // Pay option exists on browsers that will never be able to use it.
  if (!available) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Pay with Apple Pay"
      className="ebi-apple-pay-button"
    />
  )
}
