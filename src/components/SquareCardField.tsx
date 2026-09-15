import * as React from 'react'
import { loadSquareSdk, squareConfigured, SQUARE_APP_ID, SQUARE_LOCATION_ID } from '~/lib/square-sdk'

export interface SquareCardFieldHandle {
  tokenize: () => Promise<string | null>
}

export { squareConfigured }

export const SquareCardField = React.forwardRef<SquareCardFieldHandle>(function SquareCardField(_props, ref) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading')

  React.useEffect(() => {
    if (!squareConfigured) return
    let cancelled = false

    async function init() {
      await loadSquareSdk().catch(() => null)
      if (cancelled || !window.Square) {
        setStatus('error')
        return
      }
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID)
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
