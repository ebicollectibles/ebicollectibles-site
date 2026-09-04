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
  onTokenize,
  onError,
  disabled,
}: {
  amount: number
  onTokenize: (sourceId: string) => void
  onError: (message: string) => void
  disabled?: boolean
}) {
  const [available, setAvailable] = React.useState(false)
  const applePayRef = React.useRef<any>(null)

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
  }, [amount])

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

  const applePayLogo = (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.7 1.3c-1 1.2-2.6 2.1-4.2 2-.2-1.6.6-3.3 1.5-4.3C15 -.2 16.8-1 18.2-1c.1 1.6-.5 3.2-1.5 4.3zM19.6 8.2c-2.3-.1-4.3 1.3-5.4 1.3-1.1 0-2.8-1.3-4.6-1.2-2.4 0-4.6 1.4-5.8 3.5-2.5 4.3-.7 10.7 1.8 14.2 1.2 1.7 2.6 3.7 4.5 3.6 1.8-.1 2.5-1.2 4.6-1.2 2.2 0 2.8 1.2 4.6 1.1 1.9 0 3.2-1.7 4.4-3.4 1.4-2 2-3.9 2-4-.1 0-3.8-1.5-3.9-5.7-.1-3.5 2.8-5.2 3-5.3-1.6-2.4-4.1-2.7-5-2.9z" />
    </svg>
  )

  if (!available) {
    // Not yet live here (domain not verified with Square for Apple Pay yet,
    // or the SDK just can't reach us) — show a matching placeholder instead
    // of nothing, so checkout doesn't look unfinished. Deliberately inert:
    // never wire this up to look clickable, since it isn't.
    return (
      <div
        aria-hidden="true"
        title="Apple Pay — coming soon"
        style={{
          width: '100%',
          height: 44,
          marginBottom: 14,
          background: '#e3e6ea',
          borderRadius: 4,
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          color: '#98a1ab',
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {applePayLogo}
        Pay
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Pay with Apple Pay"
      style={{
        width: '100%',
        height: 44,
        marginBottom: 14,
        background: '#000000',
        border: 0,
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      {applePayLogo}
      Pay
    </button>
  )
}
