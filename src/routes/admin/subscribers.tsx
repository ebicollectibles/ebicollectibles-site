import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminListSubscribers, adminListSubscriberEvents, adminUnsubscribe, adminResubscribe, adminCampaignStatus, adminSendCampaign } from '~/server/admin'

const SUBSCRIBERS_PER_PAGE = 30
const EVENTS_PER_PAGE = 30

export const Route = createFileRoute('/admin/subscribers')({
  beforeLoad: () => requireAdmin(),
  loader: async () => {
    const [subscribers, events, campaigns] = await Promise.all([adminListSubscribers(), adminListSubscriberEvents(), adminCampaignStatus()])
    return { subscribers, events, campaigns }
  },
  component: AdminSubscribersPage,
})

const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#131b28',
  padding: '10px 12px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #e3e6ea',
  fontSize: 13.5,
}

const sourceLabel: Record<string, string> = {
  homepage: 'Homepage',
  checkout: 'Checkout',
  admin: 'Admin',
}
// Blog post signup boxes tag their signups "blog-<name>", e.g.
// "blog-pikachu-gift-box" reads as "Blog: pikachu gift box".
const labelFor = (source: string) => sourceLabel[source] ?? (source.startsWith('blog-') ? `Blog: ${source.slice(5).replace(/-/g, ' ')}` : source)

const eventLabel: Record<string, string> = {
  subscribed: 'Subscribed',
  unsubscribed: 'Unsubscribed',
  requested: 'Asked for updates',
}

const eventColor: Record<string, string> = {
  subscribed: '#3f7a63',
  unsubscribed: '#a85b2c',
}

function AdminSubscribersPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { subscribers, events, campaigns } = Route.useLoaderData()
  const [subPage, setSubPage] = React.useState(1)
  const [eventPage, setEventPage] = React.useState(1)
  const [updatingEmail, setUpdatingEmail] = React.useState<string | null>(null)

  const activeCount = subscribers.filter((s) => !s.unsubscribedAt).length

  // Who signed up on each blog post's signup box, newest first. Built from
  // the activity log, so it includes people who were already subscribed.
  const unsubscribed = new Set(subscribers.filter((s) => s.unsubscribedAt).map((s) => s.email))
  const byPage = new Map<string, { email: string; at: string | Date }[]>()
  for (const e of events) {
    if (!e.source?.startsWith('blog-') || e.type === 'unsubscribed') continue
    const list = byPage.get(e.source) ?? []
    if (!list.some((x) => x.email === e.email)) list.push({ email: e.email, at: e.createdAt })
    byPage.set(e.source, list)
  }
  const [copied, setCopied] = React.useState<string | null>(null)

  const totalSubPages = Math.max(1, Math.ceil(subscribers.length / SUBSCRIBERS_PER_PAGE))
  const currentSubPage = Math.min(subPage, totalSubPages)
  const pageSubscribers = subscribers.slice((currentSubPage - 1) * SUBSCRIBERS_PER_PAGE, currentSubPage * SUBSCRIBERS_PER_PAGE)

  const totalEventPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE))
  const currentEventPage = Math.min(eventPage, totalEventPages)
  const pageEvents = events.slice((currentEventPage - 1) * EVENTS_PER_PAGE, currentEventPage * EVENTS_PER_PAGE)

  const toggleSubscribed = async (email: string, currentlyActive: boolean) => {
    const confirmed = currentlyActive
      ? confirm(`Unsubscribe ${email}? They'll stop receiving restock and drop emails.`)
      : confirm(`Resubscribe ${email}? They'll start receiving restock and drop emails again.`)
    if (!confirmed) return

    setUpdatingEmail(email)
    try {
      if (currentlyActive) {
        await adminUnsubscribe({ data: { email } })
      } else {
        await adminResubscribe({ data: { email } })
      }
      await router.invalidate()
    } finally {
      setUpdatingEmail(null)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Subscribers</h1>
        <span style={{ fontSize: 13.5, color: '#5a6875' }}>
          {activeCount} active · {subscribers.length} total
        </span>
      </div>

      <CampaignPanel status={campaigns} onDone={() => router.invalidate()} />

      {subscribers.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No subscribers yet.</p>}

      {byPage.size > 0 && (
        <section aria-labelledby="by-page-title" style={{ marginTop: 28 }}>
          <h2 id="by-page-title" style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>
            Signups by page
          </h2>
          <p style={{ fontSize: 12.5, color: '#5a6875', margin: '0 0 14px' }}>People who left their email on a blog post's signup box. Unsubscribed emails are struck through and left out of Copy.</p>
          {[...byPage.entries()].map(([source, list]) => {
            const active = list.filter((x) => !unsubscribed.has(x.email))
            return (
              <details key={source} style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: '10px 14px', marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>
                  {labelFor(source)} <span style={{ color: '#5a6875', fontWeight: 400 }}>· {active.length} {active.length === 1 ? 'person' : 'people'}</span>
                </summary>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(active.map((x) => x.email).join(', '))
                    setCopied(source)
                  }}
                  style={{ margin: '12px 0 8px', background: '#ffffff', border: '1px solid #131b28', borderRadius: 2, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: '#131b28', cursor: 'pointer' }}
                >
                  {copied === source ? 'Copied' : 'Copy emails'}
                </button>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {list.map((x) => (
                    <li key={x.email} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderTop: '1px solid #f0f2f4', fontSize: 12.5 }}>
                      <span style={unsubscribed.has(x.email) ? { textDecoration: 'line-through', color: '#5a6875' } : undefined}>{x.email}</span>
                      <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: 'nowrap' }}>{new Date(x.at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </section>
      )}

      {subscribers.length > 0 && (
        <div className="ebi-admin-scroll-hint" style={{ fontSize: 11.5, color: '#5a6875', marginTop: 14 }}>
          Swipe to see more →
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>Email</th>
              <th style={th}>Name</th>
              <th style={th}>Status</th>
              <th style={th}>Source</th>
              <th style={th}>Subscribed</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {pageSubscribers.map((s) => {
              const active = !s.unsubscribedAt
              const busy = updatingEmail === s.email
              return (
                <tr key={s.id}>
                  <td style={td}>{s.email}</td>
                  <td style={{ ...td, color: s.firstName ? '#131b28' : '#5a6875' }}>{s.firstName || '—'}</td>
                  <td style={td}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10.5,
                        textTransform: 'uppercase',
                        color: active ? '#3f7a63' : '#5a6875',
                      }}
                    >
                      {active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
                    {labelFor(s.source)}
                  </td>
                  <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(s.subscribedAt).toLocaleString()}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      disabled={busy}
                      onClick={() => toggleSubscribed(s.email, active)}
                      style={{
                        background: 'none',
                        border: '1px solid #cfd4da',
                        borderRadius: 2,
                        padding: '4px 8px',
                        fontSize: 11,
                        color: '#131b28',
                        cursor: busy ? 'default' : 'pointer',
                        opacity: busy ? 0.5 : 1,
                      }}
                    >
                      {active ? 'Unsubscribe' : 'Resubscribe'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalSubPages > 1 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={currentSubPage === 1}
            onClick={() => setSubPage((p) => p - 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '8px 14px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentSubPage === 1 ? 'default' : 'pointer',
              opacity: currentSubPage === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
            Page {currentSubPage} of {totalSubPages}
          </span>
          <button
            disabled={currentSubPage === totalSubPages}
            onClick={() => setSubPage((p) => p + 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '8px 14px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentSubPage === totalSubPages ? 'default' : 'pointer',
              opacity: currentSubPage === totalSubPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 44, marginBottom: 16 }}>Activity</h2>
      <p style={{ fontSize: 12.5, color: '#5a6875', margin: '0 0 16px' }}>
        Every subscribe / unsubscribe, in order — this is where a resubscribe shows up as two events for the same email.
      </p>

      {events.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#131b28' }}>No activity yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pageEvents.map((e) => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f0f2f4',
                fontSize: 12.5,
                gap: 12,
              }}
            >
              <span>
                <span style={{ color: eventColor[e.type] ?? '#131b28', fontWeight: 600 }}>{eventLabel[e.type] ?? e.type}</span>
                {' — '}
                {e.email}
                {e.source && <span style={{ color: '#5a6875' }}> ({labelFor(e.source)})</span>}
                {e.type === 'unsubscribed' && e.utmCampaign && (
                  <span style={{ color: '#a85b2c' }}> · from email: {e.utmCampaign}</span>
                )}
              </span>
              <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: 'nowrap' }}>
                {new Date(e.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {totalEventPages > 1 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={currentEventPage === 1}
            onClick={() => setEventPage((p) => p - 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '8px 14px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentEventPage === 1 ? 'default' : 'pointer',
              opacity: currentEventPage === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
            Page {currentEventPage} of {totalEventPages}
          </span>
          <button
            disabled={currentEventPage === totalEventPages}
            onClick={() => setEventPage((p) => p + 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '8px 14px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentEventPage === totalEventPages ? 'default' : 'pointer',
              opacity: currentEventPage === totalEventPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

// Send a list email from src/emails/campaigns.ts: a test copy to the shop's
// own address first, then everyone still subscribed (never twice).
function CampaignPanel({ status, onDone }: { status: Awaited<ReturnType<typeof adminCampaignStatus>>; onDone: () => void }) {
  const [busy, setBusy] = React.useState<string | null>(null)
  const [note, setNote] = React.useState<Record<string, string>>({})
  const [tested, setTested] = React.useState<Record<string, boolean>>({})
  const run = async (id: string, mode: 'test' | 'all') => {
    if (mode === 'all' && !window.confirm(`Send this email to ${status.activeSubscribers} subscribers now? People who already got it are skipped.`)) return
    setBusy(`${id}:${mode}`)
    try {
      const r = await adminSendCampaign({ data: { campaignId: id, mode } })
      if (mode === 'test') setTested((t) => ({ ...t, [id]: r.sent > 0 }))
      setNote((n) => ({
        ...n,
        [id]:
          mode === 'test'
            ? r.sent ? `Test sent to ${status.testRecipient}. Check it, then send to everyone.` : `Test failed: ${r.error ?? 'unknown error'}`
            : `Sent to ${r.sent}${r.failed ? `, ${r.failed} failed (${r.error ?? 'error'})` : ''}${r.skippedAlreadySent ? `. Skipped ${r.skippedAlreadySent} already sent.` : '.'}`,
      }))
      onDone()
    } catch (e) {
      setNote((n) => ({ ...n, [id]: e instanceof Error ? e.message : 'Something went wrong.' }))
    } finally {
      setBusy(null)
    }
  }
  const btn: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 2, cursor: 'pointer', fontFamily: 'inherit' }
  return (
    <section aria-labelledby="campaigns-title" style={{ marginTop: 28, border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 18px' }}>
      <h2 id="campaigns-title" style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>List emails</h2>
      <p style={{ fontSize: 12.5, color: '#5a6875', margin: '0 0 12px' }}>
        Send a test to {status.testRecipient} first. Each subscriber gets their own unsubscribe link, and unsubscribes from an email show below as &ldquo;from email&rdquo;.
      </p>
      {status.campaigns.map((c) => (
        <div key={c.id} style={{ borderTop: '1px solid #f0f2f4', paddingTop: 12, marginTop: 4 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
          <div style={{ fontSize: 12, color: '#5a6875', marginTop: 2 }}>
            Subject: {c.subject} · Sent to {c.sent} · Unsubscribed from it: {c.unsubscribed}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button type="button" disabled={!!busy} onClick={() => run(c.id, 'test')} style={{ ...btn, background: '#fff', border: '1px solid #131b28', color: '#131b28' }}>
              {busy === `${c.id}:test` ? 'Sending…' : 'Send test to me'}
            </button>
            <button
              type="button"
              disabled={!!busy || !tested[c.id]}
              title={tested[c.id] ? '' : 'Send a test first'}
              onClick={() => run(c.id, 'all')}
              style={{ ...btn, background: '#131b28', border: '1px solid #131b28', color: '#fff', opacity: tested[c.id] ? 1 : 0.4 }}
            >
              {busy === `${c.id}:all` ? 'Sending…' : `Send to all ${status.activeSubscribers}`}
            </button>
          </div>
          {note[c.id] && <p style={{ fontSize: 12.5, color: '#3f7a63', margin: '8px 0 0' }}>{note[c.id]}</p>}
        </div>
      ))}
    </section>
  )
}
