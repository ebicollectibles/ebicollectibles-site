import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminGetCustomer } from '~/server/admin'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/admin/customers/$id')({
  beforeLoad: () => requireAdmin(),
  loader: ({ params }) => adminGetCustomer({ data: { id: params.id } }),
  component: AdminCustomerDetailPage,
})

const paymentColor: Record<string, string> = {
  paid: '#3f7a63',
  test: '#b4622f',
  failed: '#b4622f',
  unpaid: '#98a1ab',
}

function AdminCustomerDetailPage() {
  const navigate = useNavigate()
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px' }}>
        <p>Customer not found.</p>
      </div>
    )
  }

  const { customer, orders } = data

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />

      <Link to="/admin/customers" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
        ← All customers
      </Link>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{customer.name || customer.email}</h1>
        {customer.name && <span style={{ fontSize: 13.5, color: '#5a6875' }}>{customer.email}</span>}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 12.5, color: '#5a6875' }}>
        <span>{customer.hasPassword && customer.hasGoogle ? 'Password + Google sign-in' : customer.hasGoogle ? 'Google sign-in' : 'Password sign-in'}</span>
        <span>·</span>
        <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
        <span>·</span>
        <span>{orders.length} order{orders.length === 1 ? '' : 's'}</span>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>Order history</h2>

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#98a1ab' }}>No orders yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                #EBI-{order.orderNo}
              </span>
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
            <div style={{ marginTop: 10, fontSize: 12.5, color: '#5a6875' }}>
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
