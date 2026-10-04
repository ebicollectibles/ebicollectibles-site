import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminListNotifyMeEvents, adminListNotifyMeSignups, adminListNotifyMeSignupsForProduct, adminSendNotifyMeBlast } from '~/server/admin'

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
}

const eventColor: Record<string, string> = {
  signed_up: '#3f7a63',
  canceled: '#b4622f',
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
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', color: p.notifiedAt ? '#3f7a63' : '#cfd4da' }}>
                {p.notifiedAt ? new Date(p.notifiedAt).toLocaleString() : 'Pending'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      await router.invalidate()
    } finally {
      setSendingId(null)
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

      {signups.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 20 }}>No signups yet.</p>}

      {signups.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, minWidth: 640 }}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Interested</th>
                <th style={th}>Pending</th>
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
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {result?.productId === s.productId && <span style={{ fontSize: 11.5, color: '#5a6875', marginRight: 12 }}>{result.text}</span>}
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
                    <td colSpan={4} style={{ padding: 0, borderBottom: '1px solid #e3e6ea' }}>
                      <NotifyMeSignupList productId={s.productId} />
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
