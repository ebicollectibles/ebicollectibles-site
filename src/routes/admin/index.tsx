import type * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListProducts, adminDeleteProduct } from '~/server/admin'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListProducts(),
  component: AdminDashboard,
})

const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#98a1ab',
  padding: '10px 12px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #e3e6ea',
  fontSize: 13.5,
}

function AdminDashboard() {
  const products = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()

  const remove = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await adminDeleteProduct({ data: { id } })
    router.invalidate()
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Products</h1>
        <Link
          to="/admin/products/new"
          style={{ background: '#131b28', color: '#ffffff', padding: '10px 16px', borderRadius: 2, fontSize: 13, fontWeight: 600 }}
        >
          + New product
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Code</th>
              <th style={th}>Type</th>
              <th style={th}>Price</th>
              <th style={th}>Stock</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.name}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{p.code}</td>
                <td style={td}>{p.type}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(p.price)}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", color: p.stock === 0 ? '#b4622f' : undefined }}>
                  {p.stock}
                </td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link to="/admin/products/$id" params={{ id: p.id }} style={{ fontSize: 12.5, color: '#3f7a63', marginRight: 14 }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => remove(p.id)}
                    style={{ background: 'none', border: 0, color: '#98a1ab', fontSize: 12.5, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
