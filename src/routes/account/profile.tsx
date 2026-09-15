import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireCustomer, getCurrentCustomer } from '~/server/customer-auth'
import { setPassword } from '~/server/customers'
import { PasswordInput } from '~/components/PasswordInput'

export const Route = createFileRoute('/account/profile')({
  beforeLoad: () => requireCustomer(),
  loader: () => getCurrentCustomer(),
  component: ProfilePage,
})

const label: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#5a6875',
  marginBottom: 4,
}
const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
const submitBtn: React.CSSProperties = {
  background: '#131b28',
  color: '#ffffff',
  border: 0,
  borderRadius: 2,
  padding: '11px 20px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}

function ProfilePage() {
  const customer = Route.useLoaderData()
  // Local override so the form disappears immediately on success, without
  // needing a full loader refetch just to flip one boolean.
  const [justSet, setJustSet] = React.useState(false)

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Profile</h1>

      {customer && (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 420 }}>
          <div>
            <div style={label}>Email</div>
            <div style={{ fontSize: 15, color: '#131b28' }}>{customer.email}</div>
          </div>

          {customer.name && (
            <div>
              <div style={label}>Name</div>
              <div style={{ fontSize: 15, color: '#131b28' }}>{customer.name}</div>
            </div>
          )}

          <div>
            <div style={label}>Password</div>
            {customer.hasPassword || justSet ? (
              <div style={{ fontSize: 15, color: '#131b28' }}>
                {justSet ? (
                  <span style={{ color: '#3f7a63' }}>Password set — you can now log in with your email and password.</span>
                ) : (
                  'Set — you can log in with your email and password.'
                )}
              </div>
            ) : (
              <SetPasswordForm onSuccess={() => setJustSet(true)} />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function SetPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [newPassword, setNewPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await setPassword({ data: { newPassword } })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: 4 }}>
      <p style={{ fontSize: 13, color: '#5a6875', margin: '0 0 12px', lineHeight: 1.5 }}>
        You signed up with Google, so there's no password on this account yet. Set one to also be able to log in
        with your email directly.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={field}
          />
        </div>
        <button type="submit" disabled={submitting} style={{ ...submitBtn, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Setting…' : 'Set password'}
        </button>
      </form>
      <p style={{ fontSize: 11, color: '#5a6875', margin: '6px 0 0' }}>At least 8 characters.</p>
      {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{error}</p>}
    </div>
  )
}
