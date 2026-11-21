import * as React from 'react'
import { subscribeToNewsletter } from '~/server/subscribers'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#7f8b9a',
}

// The restock / new drop email form, as a dark band. Same behaviour as the
// one in the homepage's bottom tile row (see routes/index.tsx): a signed-in
// subscriber starts on "You're on the list", a guest's form resets shortly
// after a successful sign-up.
export function EmailSignup({ status }: { status: { loggedIn: boolean; email?: string | null; subscribed: boolean } }) {
  const [email, setEmail] = React.useState(status.email ?? '')
  const [state, setState] = React.useState<'idle' | 'submitting' | 'done' | 'error'>(
    status.loggedIn && status.subscribed ? 'done' : 'idle',
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')
    try {
      await subscribeToNewsletter({ data: { email } })
      setState('done')
      if (!status.loggedIn) {
        setTimeout(() => {
          setEmail('')
          setState('idle')
        }, 2500)
      }
    } catch {
      setState('error')
    }
  }

  return (
    <div className="hv2-email">
      <div>
        <div style={monoLabel}>Email updates</div>
        <div className="hv2-email-h">Email me about restocks and new drops.</div>
      </div>
      <div>
        {state === 'done' ? (
          <div role="status" style={{ fontSize: 14 }}>You're on the list.</div>
        ) : (
          <form onSubmit={submit} className="hv2-email-form">
            <input
              type="email"
              required
              aria-label="Email address"
              autoComplete="email"
              className="ebi-on-dark"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Submitting…' : 'Notify me'}
            </button>
          </form>
        )}
        {state === 'error' && (
          <div role="alert" style={{ marginTop: 8, fontSize: 12, color: '#e39a7a' }}>Something went wrong. Try again.</div>
        )}
      </div>
    </div>
  )
}
