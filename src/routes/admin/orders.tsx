import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListOrders } from '~/server/admin'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/admin/orders')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListOrders(),
  component: AdminOrdersPage,
})

const paymentColor: Record<string, string> = {
  paid: '#3f7a63',
  test: '#b4622f',
  failed: '#b4622f',
  unpaid: '#98a1ab',
}

function AdminOrdersPage() {
  const navigate = useNavigate()
  const orders = Route.useLoaderData()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Orders</h1>

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No orders yet.</p>}

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                  #EBI-{order.orderNo}
                </span>
                <span style={{ fontSize: 12.5, color: '#131b28', marginLeft: 10 }}>
                  {order.firstName} {order.lastName} · {order.email}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
          </div>
        ))}
      </div>
    </div>
  )
}
