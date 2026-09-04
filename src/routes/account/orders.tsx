import type * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'
import { getMyOrders } from '~/server/customers'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/account/orders')({
  beforeLoad: () => requireCustomer(),
  loader: () => getMyOrders(),
  component: OrdersPage,
})

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

function OrdersPage() {
  const orders = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Order history</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px' }}>
          <p style={{ fontSize: 15, color: '#5a6875', marginBottom: 20 }}>No orders yet — ready to shop?</p>
          <Link
            to="/"
            className="ebi-btn-dark"
            style={{
              display: 'inline-block',
              background: '#131b28',
              color: '#ffffff',
              border: 0,
              borderRadius: 2,
              padding: '13px 24px',
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Go to home page
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
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
      )}
    </section>
  )
}
