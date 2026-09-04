import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { customerLogin } from '~/server/customers'
import { startGoogleAuth } from '~/server/google-auth'

const searchSchema = z.object({ error: z.string().optional() })

export const Route = createFileRoute('/account/login')({
  validateSearch: searchSchema,
  component: LoginPage,
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

function LoginPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const search = Route.useSearch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(search.error ?? null)
  const [submitting, setSubmitting] = React.useState(false)
  const [googleBusy, setGoogleBusy] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await customerLogin({ data: { email, password } })
      await router.invalidate()
      navigate({ to: '/account/orders' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
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
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Log in</h1>
      <p style={{ fontSize: 13.5, color: '#131b28', marginBottom: 28 }}>
        New here?{' '}
        <Link to="/account/signup" style={{ color: '#131b28', fontWeight: 600 }}>
          Create an account
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
        <label style={label}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
        <label style={{ ...label, marginTop: 14 }}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={field}
        />
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 14 }}>{error}</p>}
        <button type="submit" disabled={submitting} style={{ ...submitBtn, marginTop: 20, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </section>
  )
}
