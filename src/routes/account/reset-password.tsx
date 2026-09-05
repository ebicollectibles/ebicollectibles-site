import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { resetPasswordWithCode, resendPasswordResetCode } from '~/server/customers'

const searchSchema = z.object({ email: z.string().email() })

export const Route = createFileRoute('/account/reset-password')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
})

const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
const codeField: React.CSSProperties = {
  ...field,
  fontSize: 22,
  textAlign: 'center',
  letterSpacing: '0.3em',
  fontFamily: "'IBM Plex Mono', monospace",
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

function ResetPasswordPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { email } = Route.useSearch()
  const [code, setCode] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [resendState, setResendState] = React.useState<'idle' | 'sending' | 'sent'>('idle')
  const [cooldown, setCooldown] = React.useState(0)

  React.useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await resetPasswordWithCode({ data: { email, code, newPassword } })
      await router.invalidate()
      navigate({ to: '/account/orders' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.')
    } finally {
      setSubmitting(false)
    }
  }

  const resend = async () => {
    setError(null)
    setResendState('sending')
    try {
      await resendPasswordResetCode({ data: { email } })
      setResendState('sent')
      setCooldown(30)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.')
      setResendState('idle')
    }
  }

  return (
    <section style={{ maxWidth: 400, margin: '0 auto', padding: '70px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Enter your reset code</h1>
      <p style={{ fontSize: 13.5, color: '#131b28', marginBottom: 28 }}>
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
      </p>

      <form onSubmit={submit}>
        <label style={label}>Reset code</label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          style={codeField}
          autoFocus
        />
        <label style={{ ...label, marginTop: 16 }}>New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={field}
        />
        <p style={{ fontSize: 11, color: '#98a1ab', marginTop: 6 }}>At least 8 characters.</p>
        {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          style={{ ...submitBtn, marginTop: 16, opacity: submitting || code.length !== 6 ? 0.6 : 1 }}
        >
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      <p style={{ fontSize: 12.5, color: '#5a6875', marginTop: 20, textAlign: 'center' }}>
        Didn't get it?{' '}
        <button
          type="button"
          onClick={resend}
          disabled={resendState === 'sending' || cooldown > 0}
          style={{ background: 'none', border: 0, padding: 0, color: '#131b28', fontWeight: 600, cursor: cooldown > 0 ? 'default' : 'pointer', fontSize: 12.5 }}
        >
          {cooldown > 0 ? `Resend code (${cooldown}s)` : resendState === 'sending' ? 'Sending…' : 'Resend code'}
        </button>
      </p>
    </section>
  )
}
