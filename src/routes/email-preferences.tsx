import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { getEmailPreferences, removeAlertWithToken, setListPreference, unsubscribeAllWithToken } from '~/server/unsubscribe'

// Where "Update preferences" in a list email's footer lands. Same signed
// token as the Unsubscribe link (server/unsubscribe.ts), so it opens with no
// sign-in and only shows or changes the address it was made for. Opening it
// changes nothing; every change is a deliberate click.
export const Route = createFileRoute('/email-preferences')({
  validateSearch: z.object({ t: z.string().max(600).optional().catch(undefined) }),
  loaderDeps: ({ search }) => ({ t: search.t }),
  loader: ({ deps }) => (deps.t ? getEmailPreferences({ data: { token: deps.t } }) : Promise.resolve({ valid: false as const })),
  head: () => ({
    meta: [
      { title: 'Email preferences | EBI Collectibles' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: PreferencesPage,
})

const INK = '#131b28'
const MUTED = '#5a6875'
const LINE = '#e3e6ea'
const MIST = '#f6f7f8'
const PINE = '#3f7a63'
const RUST = '#a85b2c'
const MONO = "'IBM Plex Mono', monospace"

const card: React.CSSProperties = { background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8 }
const label: React.CSSProperties = { fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }
const ghostBtn: React.CSSProperties = {
  background: '#fff',
  color: INK,
  border: '1px solid #c9ced5',
  borderRadius: 3,
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

// "Pokemon Eevee & Friends ... (Simplified Chinese)" reads as just the
// product here; the language goes on its own small line.
function splitName(name: string): { title: string; meta: string | null } {
  const m = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  const title = (m ? m[1] : name).replace(/^Pok[eé]mon\s+/i, '')
  return { title, meta: m ? m[2] : null }
}

type Prefs = { valid: true; email: string; list: boolean; alerts: { id: string; productId: string; productName: string; img: string | null }[] }

function PreferencesPage() {
  const loaded = Route.useLoaderData()
  const { t } = Route.useSearch()
  const [prefs, setPrefs] = React.useState<Prefs | null>(loaded.valid ? (loaded as Prefs) : null)
  const [busy, setBusy] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<{ text: string; error?: boolean } | null>(null)
  const [confirmAll, setConfirmAll] = React.useState(false)
  // Remove is two quick taps: the first turns the button into "Confirm",
  // which goes back to "Remove" on its own after a few seconds.
  const [armed, setArmed] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!armed) return
    const id = setTimeout(() => setArmed(null), 3500)
    return () => clearTimeout(id)
  }, [armed])

  React.useEffect(() => {
    if (!status || status.error) return
    const id = setTimeout(() => setStatus(null), 2600)
    return () => clearTimeout(id)
  }, [status])

  const run = async (key: string, fn: () => Promise<Prefs>, done: string, optimistic?: Prefs) => {
    if (!t || !prefs) return
    const before = prefs
    if (optimistic) setPrefs(optimistic)
    setBusy(key)
    setStatus(null)
    try {
      setPrefs(await fn())
      setStatus({ text: done })
    } catch {
      setPrefs(before)
      setStatus({ text: 'That didn’t save. Please try again.', error: true })
    } finally {
      setBusy(null)
    }
  }

  if (!prefs || !t) return <InvalidLink />

  const token = t
  const toggleList = () =>
    run('list', () => setListPreference({ data: { token, on: !prefs.list } }) as Promise<Prefs>, prefs.list ? 'Turned off. You won’t get release and restock emails.' : 'You’re on the list.', {
      ...prefs,
      list: !prefs.list,
    })
  const removeAlert = (id: string, name: string) =>
    run(`alert:${id}`, () => removeAlertWithToken({ data: { token, signupId: id } }) as Promise<Prefs>, `Removed the alert for ${name}.`, {
      ...prefs,
      alerts: prefs.alerts.filter((a) => a.id !== id),
    })
  const unsubscribeAll = () =>
    run('all', () => unsubscribeAllWithToken({ data: { token } }) as Promise<Prefs>, 'You’re unsubscribed from everything.').then(() => setConfirmAll(false))

  const nothingOn = !prefs.list && prefs.alerts.length === 0

  return (
    <section style={{ background: MIST, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(40px, 8vw, 72px) 16px 88px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...label, color: PINE }}>Email preferences</div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 38px)', letterSpacing: '-0.025em', fontWeight: 800, margin: '12px 0 0', lineHeight: 1.08 }}>
            Your inbox, <span style={{ color: MUTED }}>your call.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: MUTED, margin: '14px auto 0', maxWidth: '44ch' }}>Pick what EBI Collectibles sends to</p>
          <div
            style={{
              display: 'inline-block',
              marginTop: 10,
              fontFamily: MONO,
              fontSize: 13.5,
              color: INK,
              background: '#fff',
              border: `1px solid ${LINE}`,
              padding: '7px 13px',
              borderRadius: 3,
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            }}
          >
            {prefs.email}
          </div>
        </div>

        <div aria-live="polite" style={{ minHeight: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0 6px' }}>
          {status && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: 999,
                background: status.error ? '#fbeee6' : '#e7f0ec',
                color: status.error ? RUST : PINE,
                border: `1px solid ${status.error ? '#e6c4a8' : '#c7ddd1'}`,
              }}
            >
              {status.error ? '' : '✓ '}
              {status.text}
            </div>
          )}
        </div>

        {/* The email list */}
        <div style={{ ...card, padding: 'clamp(18px, 4vw, 26px)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ minWidth: 0 }}>
              <div style={label}>Newsletter</div>
              <h2 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', margin: '8px 0 0' }}>New releases &amp; restocks</h2>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: '6px 0 0', maxWidth: '40ch' }}>
                Pre-order openings, new sets and restock news.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Switch on={prefs.list} busy={busy === 'list'} onToggle={toggleList} label="New releases and restocks emails" />
              <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', color: prefs.list ? INK : MUTED }}>{prefs.list ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>

        {/* Product alerts */}
        <div style={{ ...card, marginTop: 14 }}>
          <div style={{ padding: 'clamp(18px, 4vw, 26px) clamp(18px, 4vw, 26px) 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={label}>Product alerts</div>
              {prefs.alerts.length > 0 && (
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#fff', background: INK, borderRadius: 999, padding: '1px 8px' }}>{prefs.alerts.length}</span>
              )}
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', margin: '8px 0 0' }}>Notify me when it&rsquo;s available</h2>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: '6px 0 0' }}>Products you asked to hear about. Remove any you no longer want.</p>
          </div>
          {prefs.alerts.length === 0 ? (
            <div style={{ margin: '14px clamp(18px, 4vw, 26px) clamp(18px, 4vw, 26px)', padding: '18px', background: MIST, borderRadius: 6, fontSize: 13.5, color: MUTED, textAlign: 'center' }}>
              No product alerts right now. Tap <b style={{ color: INK }}>Notify me</b> on a product page to add one.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
              {prefs.alerts.map((a) => (
                <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px clamp(18px, 4vw, 26px)', borderTop: `1px solid ${LINE}` }}>
                  <Link to="/products/$id" params={{ id: a.productId }} style={{ flexShrink: 0 }} aria-hidden="true" tabIndex={-1}>
                    <div style={{ width: 58, height: 58, border: `1px solid ${LINE}`, borderRadius: 6, background: '#fff', overflow: 'hidden' }}>
                      {a.img && <img src={a.img} alt="" width={58} height={58} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </div>
                  </Link>
                  <Link to="/products/$id" params={{ id: a.productId }} style={{ flex: 1, minWidth: 0, color: INK, textDecoration: 'none' }}>
                    <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{splitName(a.productName).title}</span>
                    {splitName(a.productName).meta && (
                      <span style={{ display: 'block', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginTop: 4 }}>
                        {splitName(a.productName).meta}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    style={{
                      ...ghostBtn,
                      minWidth: 92,
                      transition: 'background .15s, color .15s, border-color .15s',
                      ...(armed === a.id ? { background: RUST, borderColor: RUST, color: '#fff' } : {}),
                      opacity: busy === `alert:${a.id}` ? 0.5 : 1,
                    }}
                    disabled={!!busy}
                    onClick={() => {
                      if (armed === a.id) {
                        setArmed(null)
                        removeAlert(a.id, a.productName)
                      } else setArmed(a.id)
                    }}
                    aria-label={armed === a.id ? `Confirm removing the alert for ${a.productName}` : `Remove the alert for ${a.productName}`}
                  >
                    {armed === a.id ? 'Confirm' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {prefs.alerts.length > 0 && <div style={{ height: 8 }} />}
        </div>

        {/* Order emails: always on */}
        <div style={{ ...card, marginTop: 14, padding: '16px clamp(18px, 4vw, 26px)', display: 'flex', gap: 14, alignItems: 'center', background: 'transparent', borderStyle: 'dashed', borderColor: '#cfd4da' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: MUTED, margin: 0 }}>
            <b style={{ color: INK }}>Order and shipping emails always arrive</b>, so you never miss a confirmation or tracking number.
          </p>
        </div>

        {/* Unsubscribe from all */}
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          {nothingOn ? (
            <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>You&rsquo;re not subscribed to any emails from us.</p>
          ) : confirmAll ? (
            <div style={{ ...card, padding: '18px', display: 'inline-block', maxWidth: 460 }}>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: INK, margin: 0 }}>
                Turn off the newsletter{prefs.alerts.length ? ` and remove ${prefs.alerts.length === 1 ? 'your product alert' : `all ${prefs.alerts.length} product alerts`}` : ''}?
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
                <button type="button" style={{ ...ghostBtn, background: RUST, color: '#fff', borderColor: RUST, opacity: busy === 'all' ? 0.6 : 1 }} disabled={!!busy} onClick={unsubscribeAll}>
                  {busy === 'all' ? 'Unsubscribing…' : 'Yes, unsubscribe from all'}
                </button>
                <button type="button" style={ghostBtn} onClick={() => setConfirmAll(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmAll(true)}
              style={{ background: 'none', border: 'none', color: MUTED, fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', padding: 6 }}
            >
              Unsubscribe from all emails
            </button>
          )}
        </div>

      </div>
    </section>
  )
}

function Switch({ on, busy, onToggle, label: aria }: { on: boolean; busy: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={aria}
      disabled={busy}
      onClick={onToggle}
      style={{
        flexShrink: 0,
        width: 52,
        height: 30,
        borderRadius: 999,
        border: 'none',
        padding: 3,
        cursor: busy ? 'default' : 'pointer',
        background: on ? INK : '#cfd4da',
        transition: 'background .18s',
        display: 'flex',
        justifyContent: on ? 'flex-end' : 'flex-start',
        marginTop: 4,
      }}
    >
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(19,27,40,.25)', display: 'block' }} />
    </button>
  )
}

function InvalidLink() {
  return (
    <section style={{ background: MIST, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '72px 16px 96px', textAlign: 'center' }}>
        <div style={{ ...card, padding: 'clamp(28px, 6vw, 44px)' }}>
          <div style={{ ...label, color: PINE }}>Email preferences</div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 30px)', letterSpacing: '-0.02em', fontWeight: 800, margin: '12px 0 0' }}>This link doesn&rsquo;t work</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: MUTED, margin: '12px auto 0', maxWidth: '44ch' }}>
            It may have been cut off when it was copied. Open <b style={{ color: INK }}>Update preferences</b> from the bottom of any of our emails again, or email{' '}
            <a href="mailto:eastblueinternational@gmail.com" style={{ color: INK, fontWeight: 600 }}>
              eastblueinternational@gmail.com
            </a>{' '}
            and we&rsquo;ll sort it out.
          </p>
        </div>
      </div>
    </section>
  )
}
