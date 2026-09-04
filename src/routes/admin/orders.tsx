import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListOrders, adminListPaymentFailures, adminUpdateOrderStatus } from '~/server/admin'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/admin/orders')({
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
  shipped: '#3f7a63',
  cancelled: '#b4622f',
}

const tagStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  textTransform: 'uppercase',
  color: '#5a6875',
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '2px 6px',
}

function AdminOrdersPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { orders, paymentFailures } = Route.useLoaderData()
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  const changeStatus = async (orderId: string, status: 'pending' | 'shipped' | 'cancelled') => {
    setUpdatingId(orderId)
    try {
      await adminUpdateOrderStatus({ data: { orderId, status } })
      await router.invalidate()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
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

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((order) => {
          const totalRefunded = order.refunds.reduce((t, r) => t + (r.status === 'COMPLETED' ? r.amount ?? 0 : 0), 0)
          return (
            <div key={order.id} style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                    #EBI-{order.orderNo}
                  </span>
                  <span style={{ fontSize: 12.5, color: '#131b28', marginLeft: 10 }}>
                    {order.firstName} {order.lastName} · {order.email}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={tagStyle}>{order.checkoutMode === 'account' ? 'Account' : 'Guest'}</span>
                  {totalRefunded > 0 && (
                    <span style={{ ...tagStyle, color: '#8a4a26', border: '1px solid #e3c7b4' }}>
                      Refunded {formatMoney(totalRefunded)}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10.5,
                      textTransform: 'uppercase',
                      color: paymentColor[order.paymentStatus] ?? '#98a1ab',
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 500 }}>
                    {formatMoney(order.total)}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12.5, color: '#131b28' }}>
                {order.items.map((item) => `${item.qty}× ${item.productName}`).join(', ')}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: '#98a1ab' }}>
                {order.street}
                {order.apartment ? `, ${order.apartment}` : ''}, {order.city} {order.zip} · {order.shipMethod} ·{' '}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10.5,
                      textTransform: 'uppercase',
                      color: fulfillmentColor[order.fulfillmentStatus] ?? '#98a1ab',
                    }}
                  >
                    {order.fulfillmentStatus}
                  </span>
                  {(['pending', 'shipped', 'cancelled'] as const)
                    .filter((s) => s !== order.fulfillmentStatus)
                    .map((s) => (
                      <button
                        key={s}
                        disabled={updatingId === order.id}
                        onClick={() => changeStatus(order.id, s)}
                        style={{
                          background: 'none',
                          border: '1px solid #cfd4da',
                          borderRadius: 2,
                          padding: '4px 8px',
                          fontSize: 11,
                          color: '#131b28',
                          cursor: updatingId === order.id ? 'default' : 'pointer',
                          opacity: updatingId === order.id ? 0.5 : 1,
                        }}
                      >
                        Mark {s}
                      </button>
                    ))}
                </div>
                {order.statusHistory.length > 1 && (
                  <span style={{ fontSize: 11, color: '#98a1ab' }}>
                    {order.statusHistory.map((s, i) => (
                      <span key={i}>
                        {i > 0 && ' → '}
                        {s.status} {new Date(s.createdAt).toLocaleString()}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
