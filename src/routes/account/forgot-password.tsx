import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { requestPasswordReset } from '~/server/customers'

export const Route = createFileRoute('/account/forgot-password')({
  component: ForgotPasswordPage,
})

const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  fontSize: 14,
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
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await requestPasswordReset({ data: { email } })
      navigate({ to: '/account/reset-password', search: { email } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code.')
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
        <label style={label}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={field} autoFocus />
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 12 }}>{error}</p>}
        <button type="submit" disabled={submitting} style={{ ...submitBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
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
