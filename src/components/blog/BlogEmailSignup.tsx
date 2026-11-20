import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { subscribeToNewsletter } from '~/server/subscribers'

/**
 * An email signup box for a blog post about something not on sale yet.
 * Signups join the same list as the home page form, tagged with `source`
 * (for example "blog-pikachu-gift-box") so the people who asked about one
 * product can be found and emailed when it opens.
 */
export function BlogEmailSignup({ heading, body, source }: { heading: string; body: string; source: string }) {
  const [email, setEmail] = React.useState('')
  const [state, setState] = React.useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const id = React.useId()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')
    try {
      await subscribeToNewsletter({ data: { email, source } })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <aside className="signup-box" aria-labelledby={`${id}-h`}>
      <div>
        <h3 id={`${id}-h`}>{heading}</h3>
        <p>{body}</p>
      </div>
      {state === 'done' ? (
        <p role="status" className="signup-done">
          You're on the list. We'll email you when it opens.
        </p>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <input id={`${id}-email`} type="email" required autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-light" disabled={state === 'submitting'}>
            {state === 'submitting' ? 'Submitting…' : 'Email me'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p role="alert" className="signup-error">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="signup-note">
        You will also get our restock and new release emails. Unsubscribe any time. See our <Link to="/privacy">privacy policy</Link>.
      </p>
    </aside>
  )
}
