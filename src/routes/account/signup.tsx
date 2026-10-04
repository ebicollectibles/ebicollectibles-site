import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useSignUp } from '@clerk/tanstack-react-start/legacy'
import { syncClerkUser } from '~/server/customer-auth'
import { clerkErrorMessage } from '~/lib/clerk-error'
import { PasswordInput } from '~/components/PasswordInput'
import { DiscordIcon } from '~/components/DiscordIcon'
import { GoogleIcon } from '~/components/GoogleIcon'

export const Route = createFileRoute('/account/signup')({
  component: SignupPage,
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

function SignupPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)
  const [discordBusy, setDiscordBusy] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setSubmitting(true)
    try {
      const result = await signUp.create({ emailAddress: email, password, firstName: name || undefined })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        await syncClerkUser()
        await router.invalidate()
        navigate({ to: '/account/orders' })
        return
      }
      // Almost always 'missing_requirements' here — Clerk wants the email
      // verified before the account is usable. verify.tsx picks up the
      // same pending signUp attempt (Clerk persists it client-side) rather
      // than needing the email passed along explicitly.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      navigate({ to: '/account/verify' })
    } catch (err) {
      setError(clerkErrorMessage(err, 'Signup failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  const continueWithGoogle = async () => {
    if (!isLoaded) return
    setError(null)
    setGoogleBusy(true)
    try {
      await signUp.authenticateWithRedirect({
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
      await signUp.authenticateWithRedirect({
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
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Create an account</h1>
      <p style={{ fontSize: 13.5, color: '#131b28', marginBottom: 28 }}>
        Already have one?{' '}
        <Link to="/account/login" style={{ color: '#131b28', fontWeight: 600 }}>
          Log in
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
        <label htmlFor="signup-name" style={label}>
          Name (optional)
        </label>
        <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} className="ebi-field" style={field} />
        <label htmlFor="signup-email" style={{ ...label, marginTop: 14 }}>
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ebi-field"
          style={field}
        />
        <label htmlFor="signup-password" style={{ ...label, marginTop: 14 }}>
          Password
        </label>
        <PasswordInput
          id="signup-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="ebi-field"
          style={field}
        />
        <p style={{ fontSize: 11, color: '#5a6875', marginTop: 6 }}>At least 8 characters.</p>
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{error}</p>}
        <button type="submit" disabled={submitting || !isLoaded} style={{ ...submitBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </section>
  )
}
