import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListCustomers } from '~/server/admin'

const CUSTOMERS_PER_PAGE = 20

export const Route = createFileRoute('/admin/customers/')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListCustomers(),
  component: AdminCustomersPage,
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

function AdminCustomersPage() {
  const navigate = useNavigate()
  const customers = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(customers.length / CUSTOMERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageCustomers = customers.slice((currentPage - 1) * CUSTOMERS_PER_PAGE, currentPage * CUSTOMERS_PER_PAGE)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Customers</h1>

      {customers.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No customer accounts yet.</p>}

      {customers.length > 0 && (
        <div className="ebi-admin-scroll-hint" style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 14 }}>
          Swipe to see more →
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Sign-in</th>
              <th style={th}>Orders</th>
              <th style={th}>Last login</th>
              <th style={th}>Joined</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {pageCustomers.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.name || <span style={{ color: '#98a1ab' }}>—</span>}</td>
                <td style={td}>{c.email}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
                  {c.hasPassword && c.hasGoogle ? 'Password + Google' : c.hasGoogle ? 'Google' : 'Password'}
                </td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{c.orderCount}</td>
                <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>
                  {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString() : 'Never'}
                </td>
                <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link to="/admin/customers/$id" params={{ id: c.id }} style={{ fontSize: 12.5, color: '#3f7a63' }}>
                    View
                  </Link>
                </td>
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
