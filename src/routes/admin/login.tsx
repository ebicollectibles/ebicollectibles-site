import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignIn } from '@clerk/tanstack-react-start/legacy'
import { useClerk } from '@clerk/tanstack-react-start'
import { verifyAdminAccess } from '~/server/admin-auth'
import { clerkErrorMessage } from '~/lib/clerk-error'
import { attemptClientTrustCode, challengeClientTrustIfNeeded } from '~/lib/clerk-client-trust'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const clerk = useClerk()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [needsCode, setNeedsCode] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const afterSignedIn = async (sessionId: string) => {
    // afterSignedIn is only ever called from submit/submitCode after their
    // own `if (!isLoaded) return` guard already passed — setActive is
    // always defined by then, but TS can't see that across the closure.
    await setActive!({ session: sessionId })
    try {
      await verifyAdminAccess()
    } catch (accessErr) {
      // A real account, just not one flagged as admin — sign back out
      // rather than leaving a non-admin Clerk session sitting on this
      // page, since every admin route/action re-checks this anyway.
      await clerk.signOut()
      throw accessErr
    }
    navigate({ to: '/admin' })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setSubmitting(true)
    try {
      const result = await signIn.create({ strategy: 'password', identifier: email, password })
      if (await challengeClientTrustIfNeeded(signIn, result)) {
        setNeedsCode(true)
        return
      }
      if (result.status !== 'complete') {
        throw new Error("Couldn't finish signing in — try again.")
      }
      await afterSignedIn(result.createdSessionId!)
    } catch (err) {
      setError(clerkErrorMessage(err, 'Login failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setSubmitting(true)
    try {
      const result = await attemptClientTrustCode(signIn, code)
      await afterSignedIn(result.createdSessionId!)
    } catch (err) {
      setError(clerkErrorMessage(err, 'Login failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f7f8',
        fontFamily: 'Archivo, Helvetica, sans-serif',
      }}
    >
      <form
        onSubmit={needsCode ? submitCode : submit}
        style={{ background: '#ffffff', border: '1px solid #e3e6ea', padding: 32, width: 340, borderRadius: 4 }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>EBI COLLECTIBLES</div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#131b28',
            marginTop: 4,
          }}
        >
          Admin
        </div>
        {needsCode ? (
          <>
            <p style={{ fontSize: 12.5, color: '#5a6875', marginTop: 16, lineHeight: 1.5 }}>
              For your security, we emailed a code to {email}. Enter it below.
            </p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Code"
              aria-label="Code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="ebi-field"
              style={{
                marginTop: 10,
                width: '100%',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                padding: '12px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ebi-field"
              style={{
                marginTop: 20,
                width: '100%',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                padding: '12px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ebi-field"
              style={{
                marginTop: 10,
                width: '100%',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                padding: '12px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </>
        )}
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 10 }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting || !isLoaded}
          style={{
            marginTop: 16,
            width: '100%',
            background: '#131b28',
            color: '#ffffff',
            border: 0,
            borderRadius: 2,
            padding: 13,
            fontSize: 14,
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Signing in…' : needsCode ? 'Verify code' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
