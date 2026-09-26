import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListNotifyMeSignups, adminSendNotifyMeBlast } from '~/server/admin'

export const Route = createFileRoute('/admin/notify-me')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListNotifyMeSignups(),
  component: AdminNotifyMePage,
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
  fontSize: 13,
}

function AdminNotifyMePage() {
  const navigate = useNavigate()
  const router = useRouter()
  const signups = Route.useLoaderData()
  const [sendingId, setSendingId] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ productId: string; text: string } | null>(null)

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
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
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
                <tr key={s.productId}>
                  <td style={td}>
                    <Link to="/products/$id" params={{ id: s.productId }} style={{ color: '#131b28', textDecoration: 'none', fontWeight: 600 }}>
                      {s.productName}
                    </Link>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{s.total}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
