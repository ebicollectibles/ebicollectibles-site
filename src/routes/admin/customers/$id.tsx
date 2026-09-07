import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminGetCustomer } from '~/server/admin'
import { formatMoney } from '~/lib/products'

const ORDERS_PER_PAGE = 10

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

function AdminCustomerDetailPage() {
  const navigate = useNavigate()
  const data = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  if (!data) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px' }}>
        <p>Customer not found.</p>
      </div>
    )
  }

  const { customer, orders, events } = data
  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pageOrders.map((order) => {
          const itemCount = order.items.reduce((n, item) => n + item.qty, 0)
          return (
            <Link
              key={order.id}
              to="/admin/orders/$id"
              params={{ id: order.id }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                border: '1px solid #e3e6ea',
                borderRadius: 4,
                padding: '16px 20px',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                  #EBI-{order.orderNo}
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: '#98a1ab' }}>
                  {new Date(order.createdAt).toLocaleDateString()} · {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                  <span style={{ color: fulfillmentColor[order.fulfillmentStatus] ?? '#98a1ab' }}>
                    {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </span>
                  {' · '}
                  <span style={{ color: paymentColor[order.paymentStatus] ?? '#98a1ab' }}>{order.paymentStatus}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>
                  {formatMoney(order.total)}
                </span>
                <span style={{ fontSize: 13, color: '#98a1ab' }}>›</span>
              </div>
            </Link>
          )
        })}
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
