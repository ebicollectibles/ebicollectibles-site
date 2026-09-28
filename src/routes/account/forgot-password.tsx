import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSignIn } from '@clerk/tanstack-react-start/legacy'
import { clerkErrorMessage } from '~/lib/clerk-error'

export const Route = createFileRoute('/account/forgot-password')({
  component: ForgotPasswordPage,
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

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { isLoaded, signIn } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setSubmitting(true)
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email })
      navigate({ to: '/account/reset-password' })
    } catch (err) {
      setError(clerkErrorMessage(err, 'Failed to send reset code.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ maxWidth: 400, margin: '0 auto', padding: '70px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Reset your password</h1>
      <p style={{ fontSize: 13.5, color: '#131b28', marginBottom: 28 }}>
        Enter your account email and we'll send you a code to reset your password.
      </p>

      <form onSubmit={submit}>
        <label htmlFor="forgot-email" style={label}>
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ebi-field"
          style={field}
          autoFocus
        />
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 12 }}>{error}</p>}
        <button type="submit" disabled={submitting || !isLoaded} style={{ ...submitBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Sending…' : 'Send reset code'}
        </button>
      </form>

      <p style={{ fontSize: 12.5, color: '#5a6875', marginTop: 20, textAlign: 'center' }}>
        <Link to="/account/login" style={{ color: '#131b28', fontWeight: 600 }}>
          Back to log in
        </Link>
      </p>
    </section>
  )
}
