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

const fulfillmentColor: Record<string, string> = {
  pending: '#98a1ab',
  shipped: '#3f7a63',
  cancelled: '#b4622f',
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

  const { customer, orders, events } = data

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
        {customer.name && <span style={{ fontSize: 13.5, color: '#131b28' }}>{customer.email}</span>}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 12.5, color: '#5a6875' }}>
        <span>{customer.hasPassword && customer.hasGoogle ? 'Password + Google sign-in' : customer.hasGoogle ? 'Google sign-in' : 'Password sign-in'}</span>
        <span>·</span>
        <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
        <span>·</span>
        <span>{orders.length} order{orders.length === 1 ? '' : 's'}</span>
        <span>·</span>
        <span>Last login {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : 'never'}</span>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>Order history</h2>

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28' }}>No orders yet.</p>}

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
                    fontSize: 10,
                    textTransform: 'uppercase',
                    color: '#5a6875',
                    border: '1px solid #cfd4da',
                    borderRadius: 2,
                    padding: '2px 6px',
                  }}
                >
                  {order.checkoutMode === 'account' ? 'Account' : 'Guest'}
                </span>
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
            <div style={{ marginTop: 8, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  textTransform: 'uppercase',
                  color: fulfillmentColor[order.fulfillmentStatus] ?? '#98a1ab',
                }}
              >
                {order.fulfillmentStatus}
              </span>
              {order.statusHistory.length > 1 && (
                <span style={{ color: '#98a1ab' }}>
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
        ))}
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>Recent activity</h2>

      {events.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#98a1ab' }}>No recorded activity yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {events.map((event, i) => (
            <div
              key={i}
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
                <span style={{ color: eventColor[event.type] ?? '#131b28', fontWeight: 600 }}>
                  {eventLabel[event.type] ?? event.type}
                </span>
                {event.detail && <span style={{ color: '#98a1ab' }}> — {event.detail}</span>}
              </span>
              <span style={{ color: '#98a1ab', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: 'nowrap' }}>
                {new Date(event.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const eventLabel: Record<string, string> = {
  signup: 'Account created',
  login: 'Logged in',
  login_failed: 'Failed login attempt',
  google_link: 'Linked Google sign-in',
  password_reset: 'Password reset',
  payment_failed: 'Payment failed',
  email_verified: 'Email verified',
}

const eventColor: Record<string, string> = {
  login_failed: '#b4622f',
  signup: '#3f7a63',
  payment_failed: '#b4622f',
  email_verified: '#3f7a63',
}
