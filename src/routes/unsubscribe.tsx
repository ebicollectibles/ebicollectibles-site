import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { getUnsubscribeState, resubscribeWithToken, unsubscribeWithToken } from '~/server/unsubscribe'

// Where the "Unsubscribe" link in a list email's footer lands. Opening the
// page changes nothing: the visitor confirms with a button, because email
// security scanners open every link in an email and would otherwise
// unsubscribe people by accident. Gmail's own one-click button goes to
// /api/unsubscribe instead (server.ts).
export const Route = createFileRoute('/unsubscribe')({
  validateSearch: z.object({ t: z.string().max(600).optional().catch(undefined), c: z.string().max(64).optional().catch(undefined) }),
  loaderDeps: ({ search }) => ({ t: search.t }),
  loader: ({ deps }) => (deps.t ? getUnsubscribeState({ data: { token: deps.t } }) : Promise.resolve({ valid: false as const })),
  head: () => ({
    meta: [
      { title: 'Email preferences | EBI Collectibles' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: UnsubscribePage,
})

const INK = '#131b28'
const MUTED = '#5a6875'
const ACCENT = '#3f7a63'

const eyebrow: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: ACCENT,
}
const primaryBtn: React.CSSProperties = {
  background: INK,
  color: '#fff',
  border: `1px solid ${INK}`,
  borderRadius: 2,
  padding: '14px 26px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  minWidth: 190,
}
const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  background: '#fff',
  color: INK,
  border: '1px solid #c9ced5',
  display: 'inline-block',
  textDecoration: 'none',
  textAlign: 'center',
}

type View = 'confirm' | 'done' | 'resubscribed'

function UnsubscribePage() {
  const state = Route.useLoaderData()
  const { t, c } = Route.useSearch()
  const [view, setView] = React.useState<View>(state.valid && !state.subscribed ? 'done' : 'confirm')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const act = async (fn: typeof unsubscribeWithToken, next: View) => {
    if (!t) return
    setBusy(true)
    setError(null)
    try {
      await fn({ data: { token: t, c } })
      setView(next)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section style={{ background: '#f6f7f8', borderBottom: '1px solid #e3e6ea' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '72px 20px 96px' }}>
        <div style={{ background: '#fff', border: '1px solid #e3e6ea', padding: 'clamp(28px, 6vw, 48px)', textAlign: 'center' }}>
          {!state.valid ? (
            <>
              <div style={eyebrow}>Email preferences</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 32px)', letterSpacing: '-0.02em', fontWeight: 700, margin: '14px 0 0' }}>This link doesn&rsquo;t work</h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: MUTED, margin: '14px auto 0', maxWidth: '46ch' }}>
                It may have been copied incompletely. Open the Unsubscribe link from the bottom of any of our emails again, or email{' '}
                <a href="mailto:eastblueinternational@gmail.com" style={{ color: INK, fontWeight: 600 }}>
                  eastblueinternational@gmail.com
                </a>{' '}
                and we&rsquo;ll take you off the list.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link to="/" style={secondaryBtn}>
                  Back to the shop
                </Link>
              </div>
            </>
          ) : view === 'confirm' ? (
            <>
              <div style={eyebrow}>Email preferences</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 32px)', letterSpacing: '-0.02em', fontWeight: 700, margin: '14px 0 0' }}>
                Unsubscribe from our emails?
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: MUTED, margin: '14px auto 0', maxWidth: '46ch' }}>
                We&rsquo;ll stop sending restock alerts and new release news to
              </p>
              <EmailChip email={state.email} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 30 }}>
                <button type="button" style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={() => act(unsubscribeWithToken, 'done')}>
                  {busy ? 'Unsubscribing…' : 'Unsubscribe'}
                </button>
                <Link to="/" style={secondaryBtn}>
                  Keep me subscribed
                </Link>
              </div>
              {error && (
                <p role="alert" style={{ fontSize: 13, color: '#a85b2c', margin: '14px 0 0' }}>
                  {error}
                </p>
              )}
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: MUTED, margin: '26px 0 0' }}>
                Order confirmations and shipping updates aren&rsquo;t affected.
              </p>
            </>
          ) : view === 'done' ? (
            <>
              <Check />
              <div style={{ ...eyebrow, marginTop: 18 }}>Email preferences</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 32px)', letterSpacing: '-0.02em', fontWeight: 700, margin: '12px 0 0' }}>You&rsquo;re unsubscribed</h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: MUTED, margin: '14px auto 0', maxWidth: '46ch' }}>
                You won&rsquo;t get restock or new release emails from us at
              </p>
              <EmailChip email={state.email} />
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, margin: '18px auto 0', maxWidth: '46ch' }}>
                Order confirmations and shipping updates still arrive as normal.
              </p>
              <div style={{ borderTop: '1px solid #e3e6ea', margin: '30px 0 0', paddingTop: 26 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Unsubscribed by mistake?</p>
                <button
                  type="button"
                  style={{ ...secondaryBtn, marginTop: 14, opacity: busy ? 0.6 : 1 }}
                  disabled={busy}
                  onClick={() => act(resubscribeWithToken, 'resubscribed')}
                >
                  {busy ? 'Resubscribing…' : 'Resubscribe'}
                </button>
                {error && (
                  <p role="alert" style={{ fontSize: 13, color: '#a85b2c', margin: '14px 0 0' }}>
                    {error}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <Check />
              <div style={{ ...eyebrow, marginTop: 18 }}>Email preferences</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 32px)', letterSpacing: '-0.02em', fontWeight: 700, margin: '12px 0 0' }}>Welcome back</h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: MUTED, margin: '14px auto 0', maxWidth: '46ch' }}>
                You&rsquo;re back on the list for restock alerts and new release news at
              </p>
              <EmailChip email={state.email} />
              <div style={{ marginTop: 28 }}>
                <Link to="/shop" style={{ ...primaryBtn, display: 'inline-block', textDecoration: 'none' }}>
                  Shop the latest
                </Link>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px', justifyContent: 'center', marginTop: 26, fontSize: 13 }}>
          <Link to="/shop" style={{ color: INK }}>
            Shop
          </Link>
          <Link to="/sets/chinese" style={{ color: INK }}>
            Set lists
          </Link>
          <Link to="/blog" style={{ color: INK }}>
            Blog
          </Link>
          <Link to="/privacy" style={{ color: INK }}>
            Privacy policy
          </Link>
        </div>
      </div>
    </section>
  )
}

function EmailChip({ email }: { email: string }) {
  return (
    <div
      style={{
        display: 'inline-block',
        marginTop: 12,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14,
        color: INK,
        background: '#f6f7f8',
        border: '1px solid #e3e6ea',
        padding: '8px 14px',
        borderRadius: 2,
        maxWidth: '100%',
        overflowWrap: 'anywhere',
      }}
    >
      {email}
    </div>
  )
}

function Check() {
  return (
    <div
      aria-hidden="true"
      style={{ width: 52, height: 52, borderRadius: '50%', background: '#e7f0ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>
  )
}
