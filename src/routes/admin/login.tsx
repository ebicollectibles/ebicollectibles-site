import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { adminLogin } from '~/server/admin-auth'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await adminLogin({ data: { password } })
      navigate({ to: '/admin' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
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
        onSubmit={submit}
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
        <input
          type="password"
          placeholder="Password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 10 }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
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
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
