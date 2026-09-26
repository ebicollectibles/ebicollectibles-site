import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { getMyNotifyMeStatus, notifyMeCancel, notifyMeSignUp } from '~/server/notify-me'

// Sign-in gated on purpose — see notify_me_signups in lib/db/schema.ts for
// why. Sits wherever AddToCartControl would otherwise show a disabled
// "Coming soon"/"Sold out" button, so it takes the same width/spacing
// props to line up with it.
export function NotifyMeButton({
  productId,
  padding = 14,
  fontSize = 13.5,
  maxWidth,
  marginTop,
}: {
  productId: string
  padding?: number
  fontSize?: number
  maxWidth?: number
  marginTop?: number
}) {
  const [status, setStatus] = React.useState<{ loggedIn: boolean; signedUp: boolean } | null>(null)
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    getMyNotifyMeStatus({ data: { productId } }).then((result) => {
      if (!cancelled) setStatus(result)
    })
    return () => {
      cancelled = true
    }
  }, [productId])

  const containerStyle: React.CSSProperties = { maxWidth, marginTop: marginTop ?? 14 }

  if (!status) return <div style={{ ...containerStyle, height: 44 }} />

  if (!status.loggedIn) {
    return (
      <Link
        to="/account/login"
        style={{
          ...containerStyle,
          display: 'block',
          textAlign: 'center',
          background: '#ffffff',
          color: '#131b28',
          border: '1px solid #131b28',
          borderRadius: 2,
          padding,
          fontSize,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Log in to get notified
      </Link>
    )
  }

  if (status.signedUp) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize, fontWeight: 600, color: '#3f7a63' }}>✓ We'll email you when it's available</span>
        <button
          onClick={async () => {
            setPending(true)
            await notifyMeCancel({ data: { productId } })
            setStatus({ loggedIn: true, signedUp: false })
            setPending(false)
          }}
          disabled={pending}
          style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: fontSize - 1.5, cursor: pending ? 'default' : 'pointer', flexShrink: 0 }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={async () => {
        setPending(true)
        await notifyMeSignUp({ data: { productId } })
        setStatus({ loggedIn: true, signedUp: true })
        setPending(false)
      }}
      disabled={pending}
      style={{
        ...containerStyle,
        display: 'block',
        width: maxWidth ? '100%' : undefined,
        background: '#131b28',
        color: '#ffffff',
        border: 0,
        borderRadius: 2,
        padding,
        fontSize,
        fontWeight: 600,
        cursor: pending ? 'default' : 'pointer',
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? 'Adding…' : 'Notify me'}
    </button>
  )
}
