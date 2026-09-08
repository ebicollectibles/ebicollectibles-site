import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListSubscribers } from '~/server/admin'

const SUBSCRIBERS_PER_PAGE = 30

export const Route = createFileRoute('/admin/subscribers')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListSubscribers(),
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
}

function AdminSubscribersPage() {
  const navigate = useNavigate()
  const subscribers = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(subscribers.length / SUBSCRIBERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageSubscribers = subscribers.slice((currentPage - 1) * SUBSCRIBERS_PER_PAGE, currentPage * SUBSCRIBERS_PER_PAGE)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Subscribers</h1>
        <span style={{ fontSize: 13.5, color: '#98a1ab' }}>{subscribers.length} total</span>
      </div>

      {subscribers.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No subscribers yet.</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 480 }}>
          <thead>
            <tr>
              <th style={th}>Email</th>
              <th style={th}>Source</th>
              <th style={th}>Added</th>
            </tr>
          </thead>
          <tbody>
            {pageSubscribers.map((s) => (
              <tr key={s.id}>
                <td style={td}>{s.email}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
                  {sourceLabel[s.source] ?? s.source}
                </td>
                <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '5px 10px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '5px 10px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
