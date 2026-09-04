import type * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { requireCustomer, getCurrentCustomer, customerLogout } from '~/server/customer-auth'
import { getMyOrders } from '~/server/customers'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/account/')({
  beforeLoad: () => requireCustomer(),
  loader: async () => {
    const [customer, orders] = await Promise.all([getCurrentCustomer(), getMyOrders()])
    return { customer, orders }
  },
  component: AccountPage,
})

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

function AccountPage() {
  const navigate = useNavigate()
  const { customer, orders } = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>My account</h1>
          <p style={{ fontSize: 13.5, color: '#5a6875', marginTop: 6 }}>
            {customer?.name ? `${customer.name} · ` : ''}
            {customer?.email}
          </p>
        </div>
        <button
          onClick={async () => {
            await customerLogout()
            navigate({ to: '/' })
          }}
          style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, padding: '9px 14px', fontSize: 12.5, cursor: 'pointer', color: '#5a6875' }}
        >
          Log out
        </button>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Order history</h2>

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#98a1ab' }}>No orders yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                #EBI-{order.orderNo}
              </span>
              <span style={{ fontSize: 11.5, color: '#98a1ab' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span>
                    {item.qty}× {item.productName}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#5a6875' }}>
                    {formatMoney(item.unitPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e3e6ea', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#98a1ab' }}>
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#98a1ab' }}>
                <span>Shipping</span>
                <span>{formatMoney(order.shippingCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#98a1ab' }}>
                <span>Tax</span>
                <span>{formatMoney(order.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 700, marginTop: 4 }}>
                <span>Total</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(order.total)}</span>
              </div>
            </div>

            <div style={{ marginTop: 10, ...monoLabel, textTransform: 'none', letterSpacing: 0 }}>
              {order.paymentStatus === 'paid' && <span style={{ color: '#3f7a63' }}>Paid</span>}
              {order.paymentStatus === 'test' && <span>Test order — no card charged</span>}
              {order.paymentStatus === 'failed' && <span style={{ color: '#b4622f' }}>Payment failed</span>}
              {' · '}
              {order.fulfillmentStatus === 'shipped' ? 'Shipped' : order.fulfillmentStatus === 'cancelled' ? 'Cancelled' : 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
