import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import {
  adminListNotifyMeBlastRecipients,
  adminListNotifyMeBlastsForProduct,
  adminListNotifyMeEvents,
  adminListNotifyMeSignups,
  adminListNotifyMeSignupsForProduct,
  adminSendNotifyMeBlast,
  adminSendNotifyMeTestEmail,
} from '~/server/admin'

const EVENTS_PER_PAGE = 30

export const Route = createFileRoute('/admin/notify-me')({
  beforeLoad: () => requireAdmin(),
  loader: async () => {
    const [signups, events] = await Promise.all([adminListNotifyMeSignups(), adminListNotifyMeEvents()])
    return { signups, events }
  },
  component: AdminNotifyMePage,
})

const eventLabel: Record<string, string> = {
  signed_up: 'Signed up',
  canceled: 'Canceled',
  notified: 'Notified',
}

const eventColor: Record<string, string> = {
  signed_up: '#3f7a63',
  canceled: '#b4622f',
  notified: '#5a6875',
}

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
  fontSize: 13,
}

function NotifyMeSignupList({ productId }: { productId: string }) {
  const [people, setPeople] = React.useState<Awaited<ReturnType<typeof adminListNotifyMeSignupsForProduct>> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    adminListNotifyMeSignupsForProduct({ data: { productId } })
      .then((rows) => {
        if (!cancelled) setPeople(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load signups.')
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  if (error) return <p style={{ fontSize: 12.5, color: '#b4622f', padding: '12px 16px' }}>{error}</p>
  if (!people) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>Loading…</p>
  if (people.length === 0) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>No one yet.</p>

  return (
    <div style={{ background: '#f6f7f8', padding: '10px 16px 14px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Name</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Email</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Signed up</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Notified</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', color: p.name ? '#131b28' : '#5a6875' }}>{p.name || '—'}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec' }}>{p.email}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', color: '#5a6875' }}>{new Date(p.createdAt).toLocaleString()}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', color: p.notifiedCount > 0 ? '#3f7a63' : '#cfd4da' }}>
                {p.notifiedCount === 0 ? (
                  'Pending'
                ) : (
                  <span
                    title={p.notifiedDates.map((d) => new Date(d).toLocaleString()).join('\n')}
                    style={{ textDecoration: 'underline dotted', cursor: 'help' }}
                  >
                    {p.notifiedCount}× — last {new Date(p.notifiedDates[p.notifiedDates.length - 1]).toLocaleString()}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NotifyMeBlastRecipients({ blastId }: { blastId: string }) {
  const [recipients, setRecipients] = React.useState<Awaited<ReturnType<typeof adminListNotifyMeBlastRecipients>> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    adminListNotifyMeBlastRecipients({ data: { blastId } })
      .then((rows) => {
        if (!cancelled) setRecipients(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load recipients.')
      })
    return () => {
      cancelled = true
    }
  }, [blastId])

  if (error) return <p style={{ fontSize: 11.5, color: '#b4622f', margin: '8px 0 0' }}>{error}</p>
  if (!recipients) return <p style={{ fontSize: 11.5, color: '#5a6875', margin: '8px 0 0' }}>Loading…</p>
  if (recipients.length === 0) return <p style={{ fontSize: 11.5, color: '#5a6875', margin: '8px 0 0' }}>Nobody was actually emailed in this batch.</p>

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '8px 0 0' }}>
      <tbody>
        {recipients.map((r) => {
          const status = deliveryStatus(r)
          return (
            <tr key={r.id}>
              <td style={{ padding: '3px 0', fontSize: 12, color: '#131b28' }}>{r.email}</td>
              <td style={{ padding: '3px 0', fontSize: 11.5, color: status.color, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {status.label}
                {status.at && <span style={{ color: '#5a6875' }}> · {new Date(status.at).toLocaleString()}</span>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// Resend's delivery webhook fills these in asynchronously after the send —
// a recipient can be "Sent" for a while before "Delivered" arrives, and not
// every send gets a webhook at all if RESEND_WEBHOOK_SECRET isn't
// configured, so "Sent" also just means "no delivery confirmation yet."
function deliveryStatus(r: { deliveredAt: Date | null; openedAt: Date | null; clickedAt: Date | null; bouncedAt: Date | null; complainedAt: Date | null }): {
  label: string
  color: string
  at: Date | null
} {
  if (r.complainedAt) return { label: 'Complained', color: '#b4622f', at: r.complainedAt }
  if (r.bouncedAt) return { label: 'Bounced', color: '#b4622f', at: r.bouncedAt }
  if (r.clickedAt) return { label: 'Clicked', color: '#3f7a63', at: r.clickedAt }
  if (r.openedAt) return { label: 'Opened', color: '#3f7a63', at: r.openedAt }
  if (r.deliveredAt) return { label: 'Delivered', color: '#5a6875', at: r.deliveredAt }
  return { label: 'Sent', color: '#cfd4da', at: null }
}

// Every past "Send now" batch for one product — the persistent history
// behind the toggle, independent of notifyMeSignups.notifiedAt (which gets
// cleared again if someone re-signs-up for a later restock).
function NotifyMeBlastHistory({ productId }: { productId: string }) {
  const [blasts, setBlasts] = React.useState<Awaited<ReturnType<typeof adminListNotifyMeBlastsForProduct>> | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [openBlastId, setOpenBlastId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    adminListNotifyMeBlastsForProduct({ data: { productId } })
      .then((rows) => {
        if (!cancelled) setBlasts(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load history.')
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  if (error) return <p style={{ fontSize: 12.5, color: '#b4622f', padding: '12px 16px' }}>{error}</p>
  if (!blasts) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>Loading…</p>
  if (blasts.length === 0) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>No batches sent yet.</p>

  return (
    <div style={{ background: '#f6f7f8', padding: '10px 16px 14px' }}>
      {blasts.map((b) => (
        <div key={b.id} style={{ borderBottom: '1px solid #e8eaec', padding: '8px 0' }}>
          <button
            onClick={() => setOpenBlastId((id) => (id === b.id ? null : b.id))}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: 12.5,
            }}
          >
            <span>
              <span style={{ fontWeight: 600, color: '#3f7a63' }}>{b.sentCount} sent</span>
              {b.failedCount > 0 && <span style={{ color: '#b4622f' }}> · {b.failedCount} failed</span>}
              {b.skippedCount > 0 && <span style={{ color: '#5a6875' }}> · {b.skippedCount} skipped</span>}
            </span>
            <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'nowrap' }}>
              {new Date(b.createdAt).toLocaleString()} {openBlastId === b.id ? '▲' : '▼'}
            </span>
          </button>
          {openBlastId === b.id && <NotifyMeBlastRecipients blastId={b.id} />}
        </div>
      ))}
    </div>
  )
}

function AdminNotifyMePage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { signups, events } = Route.useLoaderData()
  const [sendingId, setSendingId] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ productId: string; text: string } | null>(null)
  const [eventPage, setEventPage] = React.useState(1)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const toggleExpanded = (productId: string) => setExpandedId((id) => (id === productId ? null : productId))
  const [historyExpandedId, setHistoryExpandedId] = React.useState<string | null>(null)
  const toggleHistoryExpanded = (productId: string) => setHistoryExpandedId((id) => (id === productId ? null : productId))
  // Bumped on every real send so an already-open History panel remounts
  // (via the key below) and re-fetches instead of showing what it loaded
  // before this send happened.
  const [historyRefreshKey, setHistoryRefreshKey] = React.useState(0)
  const [testEmail, setTestEmail] = React.useState('eastblueinternational@gmail.com')
  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [testResult, setTestResult] = React.useState<{ productId: string; text: string } | null>(null)

  const totalEventPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE))
  const currentEventPage = Math.min(eventPage, totalEventPages)
  const pageEvents = events.slice((currentEventPage - 1) * EVENTS_PER_PAGE, currentEventPage * EVENTS_PER_PAGE)

  const send = async (productId: string, productName: string) => {
    if (!confirm(`Email everyone still waiting on "${productName}"?`)) return
    setSendingId(productId)
    setResult(null)
    try {
      const tally = await adminSendNotifyMeBlast({ data: { productId } })
      const parts = [`Sent ${tally.sent}`]
      if (tally.skipped > 0) parts.push(`skipped ${tally.skipped}`)
      if (tally.failed > 0) parts.push(`failed ${tally.failed}`)
      setResult({ productId, text: parts.join(', ') + '.' })
      setHistoryRefreshKey((n) => n + 1)
      await router.invalidate()
    } finally {
      setSendingId(null)
    }
  }

  // Sends the real email through the real pipeline to testEmail instead of
  // the signup list — doesn't mark anyone notified, doesn't count as a send.
  const sendTest = async (productId: string) => {
    setTestingId(productId)
    setTestResult(null)
    try {
      const sendResult = await adminSendNotifyMeTestEmail({ data: { productId, testEmail } })
      setTestResult({
        productId,
        text: sendResult.status === 'sent' ? `Sent to ${testEmail}.` : `${sendResult.status}${sendResult.error ? `: ${sendResult.error}` : '.'}`,
      })
    } catch (err) {
      setTestResult({ productId, text: err instanceof Error ? err.message : 'Test send failed.' })
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <div style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Notify me signups</h1>
        <p style={{ fontSize: 13, color: '#5a6875', margin: '6px 0 0' }}>
          Sign-in-gated interest per product — a real demand signal, and the send list for "it's live" once you're ready.
        </p>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#5a6875' }}>Test emails go to:</label>
        <input
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 8px', fontSize: 12, minWidth: 220 }}
        />
      </div>

      {signups.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 20 }}>No signups yet.</p>}

      {signups.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, minWidth: 640 }}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Interested</th>
                <th style={th}>Pending</th>
                <th style={th}>History</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <React.Fragment key={s.productId}>
                <tr>
                  <td style={td}>
                    <Link to="/products/$id" params={{ id: s.productId }} style={{ color: '#131b28', textDecoration: 'none', fontWeight: 600 }}>
                      {s.productName}
                    </Link>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
                    <button
                      onClick={() => toggleExpanded(s.productId)}
                      style={{ background: 'none', border: 'none', color: '#131b28', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      {s.total} {expandedId === s.productId ? '▲' : '▼'}
                    </button>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", color: s.pending > 0 ? '#3f7a63' : '#cfd4da' }}>{s.pending}</td>
                  <td style={td}>
                    <button
                      onClick={() => toggleHistoryExpanded(s.productId)}
                      style={{ background: 'none', border: 'none', color: '#131b28', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      View {historyExpandedId === s.productId ? '▲' : '▼'}
                    </button>
                  </td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {result?.productId === s.productId && <span style={{ fontSize: 11.5, color: '#5a6875', marginRight: 12 }}>{result.text}</span>}
                    {testResult?.productId === s.productId && <span style={{ fontSize: 11.5, color: '#5a6875', marginRight: 12 }}>{testResult.text}</span>}
                    <button
                      onClick={() => sendTest(s.productId)}
                      disabled={testingId === s.productId}
                      style={{
                        background: 'none',
                        border: '1px solid #cfd4da',
                        borderRadius: 2,
                        padding: '7px 14px',
                        fontSize: 12,
                        color: '#131b28',
                        cursor: testingId ? 'default' : 'pointer',
                        opacity: testingId === s.productId ? 0.6 : 1,
                        marginRight: 8,
                      }}
                    >
                      {testingId === s.productId ? 'Sending…' : 'Send test to me'}
                    </button>
                    <button
                      onClick={() => send(s.productId, s.productName)}
                      disabled={s.pending === 0 || sendingId === s.productId}
                      style={{
                        background: '#131b28',
                        color: '#fff',
                        border: 0,
                        borderRadius: 2,
                        padding: '7px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: s.pending === 0 || sendingId ? 'default' : 'pointer',
                        opacity: s.pending === 0 ? 0.4 : sendingId === s.productId ? 0.6 : 1,
                      }}
                    >
                      {sendingId === s.productId ? 'Sending…' : 'Send now'}
                    </button>
                  </td>
                </tr>
                {expandedId === s.productId && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0, borderBottom: '1px solid #e3e6ea' }}>
                      <NotifyMeSignupList productId={s.productId} />
                    </td>
                  </tr>
                )}
                {historyExpandedId === s.productId && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0, borderBottom: '1px solid #e3e6ea' }}>
                      <NotifyMeBlastHistory key={historyRefreshKey} productId={s.productId} />
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 44, marginBottom: 16 }}>Activity</h2>
      <p style={{ fontSize: 12.5, color: '#5a6875', margin: '0 0 16px' }}>
        Every signup / cancel, in order — this is where someone who signed up, canceled, then signed up again shows up
        as three events.
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
                {' on '}
                {e.productId ? (
                  <Link to="/products/$id" params={{ id: e.productId }} style={{ color: '#131b28' }}>
                    {e.productName}
                  </Link>
                ) : (
                  <span style={{ color: '#5a6875' }}>{e.productName} (deleted)</span>
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
              padding: '5px 10px',
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
              padding: '5px 10px',
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
