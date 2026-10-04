import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useSignIn } from '@clerk/tanstack-react-start/legacy'
import { syncClerkUser } from '~/server/customer-auth'
import { clerkErrorMessage } from '~/lib/clerk-error'
import { attemptClientTrustCode, challengeClientTrustIfNeeded } from '~/lib/clerk-client-trust'
import { PasswordInput } from '~/components/PasswordInput'
import { DiscordIcon } from '~/components/DiscordIcon'
import { GoogleIcon } from '~/components/GoogleIcon'

const searchSchema = z.object({ error: z.string().optional() })

export const Route = createFileRoute('/account/login')({
  validateSearch: searchSchema,
  component: LoginPage,
})

const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  // 16px avoids iOS Safari auto-zooming the page in on focus (it does
  // that for any focused input under 16px, and doesn't always zoom back
  // out cleanly on blur).
  fontSize: 16,
  outline: 'none',
  width: '100%',
}
const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: 'block' }
const submitBtn: React.CSSProperties = {
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
const googleBtn: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#ffffff',
  color: '#131b28',
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '12px 22px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}
// Discord's brand purple ("blurple") — see discord.com/branding.
const discordBtn: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#5865F2',
  color: '#ffffff',
  border: 0,
  borderRadius: 2,
  padding: '12px 22px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

function LoginPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const search = Route.useSearch()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [needsCode, setNeedsCode] = React.useState(false)
  const [error, setError] = React.useState<string | null>(search.error ?? null)
  const [submitting, setSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)
  const [discordBusy, setDiscordBusy] = React.useState(false)

  const afterSignedIn = async (sessionId: string) => {
    // Only ever called from submit/submitCode after their own
    // `if (!isLoaded) return` guard already passed.
    await setActive!({ session: sessionId })
    await syncClerkUser()
    await router.invalidate()
    navigate({ to: '/account/orders' })
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

  const continueWithGoogle = async () => {
    if (!isLoaded) return
    setError(null)
    setGoogleBusy(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/account/orders',
      })
    } catch (err) {
      setError(clerkErrorMessage(err, 'Google sign-in is not available right now.'))
      setGoogleBusy(false)
    }
  }

  const continueWithDiscord = async () => {
    if (!isLoaded) return
    setError(null)
    setDiscordBusy(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_discord',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/account/orders',
      })
    } catch (err) {
      setError(clerkErrorMessage(err, 'Discord sign-in is not available right now.'))
      setDiscordBusy(false)
    }
  }

  return (
    <section style={{ maxWidth: 400, margin: '0 auto', padding: '70px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Log in</h1>

      {needsCode ? (
        <form onSubmit={submitCode}>
          <p style={{ fontSize: 13.5, color: '#3d4753', marginBottom: 20, lineHeight: 1.5 }}>
            For your security, we emailed a code to {email}. Enter it below.
          </p>
          <label htmlFor="login-code" style={label}>
            Code
          </label>
          <input
            id="login-code"
            type="text"
            inputMode="numeric"
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="ebi-field"
            style={field}
          />
          {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
          <button type="submit" disabled={submitting || !isLoaded} style={{ ...submitBtn, marginTop: 20, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Verifying…' : 'Verify code'}
          </button>
        </form>
      ) : (
        <>
          <p style={{ fontSize: 13.5, color: '#131b28', marginBottom: 28 }}>
            New here?{' '}
            <Link to="/account/signup" style={{ color: '#131b28', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>

          <button type="button" onClick={continueWithGoogle} disabled={googleBusy || discordBusy || !isLoaded} style={googleBtn}>
            <GoogleIcon />
            {googleBusy ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <button
            type="button"
            onClick={continueWithDiscord}
            disabled={googleBusy || discordBusy || !isLoaded}
            style={{ ...discordBtn, marginTop: 10, opacity: discordBusy ? 0.85 : 1 }}
          >
            <DiscordIcon />
            {discordBusy ? 'Redirecting…' : 'Continue with Discord'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', fontSize: 11.5, color: '#5a6875' }}>
            <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
            or
            <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
          </div>

          <form onSubmit={submit}>
            <label htmlFor="login-email" style={label}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ebi-field"
              style={field}
            />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
              <label htmlFor="login-password" style={{ ...label, marginTop: 0, marginBottom: 0 }}>
                Password
              </label>
              <Link to="/account/forgot-password" style={{ fontSize: 12, color: '#5a6875' }}>
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ebi-field"
              style={{ ...field, marginTop: 6 }}
            />
            {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
            <button type="submit" disabled={submitting || !isLoaded} style={{ ...submitBtn, marginTop: 20, opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </>
      )}
    </section>
  )
}
