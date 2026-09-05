import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { customerSignup } from '~/server/customers'
import { startGoogleAuth } from '~/server/google-auth'

export const Route = createFileRoute('/account/signup')({
  component: SignupPage,
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
const googleBtn: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  color: '#131b28',
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '12px 22px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

function SignupPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await customerSignup({ data: { email, password, name } })
      await router.invalidate()
      if (result.verificationRequired) {
        navigate({ to: '/account/verify', search: { email: result.email } })
      } else {
        navigate({ to: '/account/orders' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const continueWithGoogle = async () => {
    setError(null)
    setGoogleBusy(true)
    try {
      const { url } = await startGoogleAuth()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in is not available right now.')
      setGoogleBusy(false)
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

      <button type="button" onClick={continueWithGoogle} disabled={googleBusy} style={googleBtn}>
        {googleBusy ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', fontSize: 11.5, color: '#98a1ab' }}>
        <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
        or
        <div style={{ flex: 1, height: 1, background: '#e3e6ea' }} />
      </div>

      <form onSubmit={submit}>
        <label style={label}>Name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={field} />
        <label style={{ ...label, marginTop: 14 }}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
        <label style={{ ...label, marginTop: 14 }}>Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={field}
        />
        <p style={{ fontSize: 11, color: '#98a1ab', marginTop: 6 }}>At least 8 characters.</p>
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{error}</p>}
        <button type="submit" disabled={submitting} style={{ ...submitBtn, marginTop: 16, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </section>
  )
}
