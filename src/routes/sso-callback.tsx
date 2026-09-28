import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useClerk } from '@clerk/tanstack-react-start'
import { syncClerkUser } from '~/server/customer-auth'

// Where both login.tsx and signup.tsx point their Google button's
// redirectUrl — Clerk's OAuth flow bounces the browser back here once
// Google's side is done, and this page finishes the sign-in/sign-up and
// forwards on to wherever redirectUrlComplete said (usually /account/orders).
export const Route = createFileRoute('/sso-callback')({
  component: SsoCallbackPage,
})

function SsoCallbackPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const clerk = useClerk()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    clerk
      .handleRedirectCallback({}, async (to: string) => {
        if (cancelled) return
        try {
          await syncClerkUser()
        } catch {
          // Best-effort — a returning user's row already exists from their
          // first sign-in, so a failure here is worth landing them on the
          // site anyway rather than stranding them on this callback page.
        }
        await router.invalidate()
        navigate({ href: to })
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Google sign-in failed.')
      })
    return () => {
      cancelled = true
    }
  }, [clerk, navigate, router])

  return (
    <section style={{ maxWidth: 400, margin: '0 auto', padding: '100px 24px', textAlign: 'center', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      {error ? <p style={{ fontSize: 13.5, color: '#b4622f' }}>{error}</p> : <p style={{ fontSize: 13.5, color: '#5a6875' }}>Signing you in…</p>}
    </section>
  )
}
