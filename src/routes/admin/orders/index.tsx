import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListOrders, adminListPaymentFailures } from '~/server/admin'
import { formatMoney } from '~/lib/products'

const ORDERS_PER_PAGE = 20

export const Route = createFileRoute('/admin/orders/')({
  beforeLoad: () => requireAdmin(),
  loader: async () => ({ orders: await adminListOrders(), paymentFailures: await adminListPaymentFailures() }),
  component: AdminOrdersPage,
})

const paymentColor: Record<string, string> = {
  paid: '#3f7a63',
  test: '#b4622f',
  failed: '#b4622f',
  unpaid: '#98a1ab',
}

const fulfillmentColor: Record<string, string> = {
  pending: '#98a1ab',
  partially_shipped: '#3a6ea5',
  shipped: '#3f7a63',
  cancelled: '#b4622f',
}

const fulfillmentLabel: Record<string, string> = {
  pending: 'pending',
  partially_shipped: 'partially shipped',
  shipped: 'shipped',
  cancelled: 'cancelled',
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

function AdminOrdersPage() {
  const navigate = useNavigate()
  const { orders, paymentFailures } = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Orders</h1>

      {paymentFailures.length > 0 && (
        <div style={{ marginTop: 20, border: '1px solid #e3c7b4', background: '#fbf3ec', borderRadius: 4, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#8a4a26' }}>Recent payment failures</h2>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {paymentFailures.map((f) => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#131b28' }}>
                <span>
                  {f.email || 'unknown email'} — {formatMoney(f.amount ?? 0)} — {f.errorMessage}
                </span>
                <span style={{ color: '#98a1ab', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                  {new Date(f.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No orders yet.</p>}

      {orders.length > 0 && (
        <>
          <div className="ebi-admin-scroll-hint" style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 14 }}>
            Swipe to see more →
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>Order</th>
                <th style={th}>Customer</th>
                <th style={th}>Payment</th>
                <th style={th}>Fulfillment</th>
                <th style={th}>Total</th>
                <th style={th}>Date</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {pageOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>#EBI-{order.orderNo}</td>
                  <td style={td}>
                    <div>
                      {order.firstName} {order.lastName}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#98a1ab' }}>{order.email}</div>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: paymentColor[order.paymentStatus] ?? '#98a1ab' }}>
                    {order.paymentStatus}
                    {order.totalRefunded > 0 && (
                      <div style={{ color: '#8a4a26', fontSize: 10.5, marginTop: 2 }}>Refunded {formatMoney(order.totalRefunded)}</div>
                    )}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: fulfillmentColor[order.fulfillmentStatus] ?? '#98a1ab' }}>
                    {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{formatMoney(order.total)}</td>
                  <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link to="/admin/orders/$id" params={{ id: order.id }} style={{ fontSize: 12.5, color: '#3f7a63' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

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
