import * as React from 'react'

declare global {
  interface Window {
    Square?: any
  }
}

export interface SquareCardFieldHandle {
  tokenize: () => Promise<string | null>
}

const APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined
const LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined
const ENVIRONMENT = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) === 'production' ? 'production' : 'sandbox'

export const squareConfigured = Boolean(APP_ID && LOCATION_ID)

const SDK_SRC = ENVIRONMENT === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'

export const SquareCardField = React.forwardRef<SquareCardFieldHandle>(function SquareCardField(_props, ref) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading')

  React.useEffect(() => {
    if (!squareConfigured) return
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
      if (cancelled || !window.Square) {
        setStatus('error')
        return
      }
      try {
        const payments = window.Square.payments(APP_ID, LOCATION_ID)
        const card = await payments.card()
        if (cancelled) return
        await card.attach(containerRef.current)
        cardRef.current = card
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }

    init()
    return () => {
      cancelled = true
      cardRef.current?.destroy?.()
    }
  }, [])

  React.useImperativeHandle(ref, () => ({
    tokenize: async () => {
      if (!cardRef.current) return null
      const result = await cardRef.current.tokenize()
      if (result.status === 'OK') return result.token as string
      throw new Error(result.errors?.[0]?.message || 'Card details could not be verified.')
    },
  }))

  if (!squareConfigured) return null

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: 90 }} />
      {status === 'error' && (
        <p style={{ fontSize: 12, color: '#b4622f', marginTop: 8 }}>
          Couldn't load the card form. Refresh and try again.
        </p>
      )}
    </div>
  )
})
