import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'
import { getMyOrders } from '~/server/customers'
import { getMyStoreCredit } from '~/server/store-credit'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/account/orders/')({
  beforeLoad: () => requireCustomer(),
  loader: async () => {
    const [orders, credit] = await Promise.all([getMyOrders(), getMyStoreCredit()])
    return { orders, credit }
  },
  component: OrdersPage,
})

const fulfillmentLabel: Record<string, string> = {
  pending: 'Pending',
  partially_shipped: 'Partially shipped',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

const creditEventLabel: Record<string, string> = {
  issued: 'Credit issued',
  redeemed: 'Used on order',
  reversed: 'Refund restored',
  adjusted: 'Adjustment',
}

function StoreCreditCard({
  credit,
}: {
  credit: { balance: number; history: Array<{ type: string; amount: number; orderId: string | null; orderNo: number | null; reason: string | null; createdAt: Date | string }> }
}) {
  const [expanded, setExpanded] = React.useState(false)
  if (credit.balance <= 0 && credit.history.length === 0) return null

  return (
    <div style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 20px', marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6875' }}>
            Store credit
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600, marginTop: 4 }}>{formatMoney(credit.balance)}</div>
        </div>
        {credit.history.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            style={{ background: 'none', border: 0, padding: 0, fontSize: 12, color: '#5a6875', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {expanded ? 'Hide history' : 'View history'}
          </button>
        )}
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0f2f4', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {credit.history.map((event, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12.5 }}>
              <div>
                <span style={{ color: '#131b28' }}>{creditEventLabel[event.type] ?? event.type}</span>
                {event.orderId && event.orderNo != null && (
                  <>
                    {' '}
                    <Link to="/account/orders/$id" params={{ id: event.orderId }} style={{ color: '#3f7a63', fontWeight: 600, textDecoration: 'none' }}>
                      #EBI-{event.orderNo}
                    </Link>
                  </>
                )}
                {event.reason && <span style={{ color: '#5a6875' }}> — {event.reason}</span>}
                <div style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginTop: 2 }}>
                  {new Date(event.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  color: event.amount >= 0 ? '#3f7a63' : '#131b28',
                  whiteSpace: 'nowrap',
                }}
              >
                {event.amount >= 0 ? '+' : ''}
                {formatMoney(event.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OrdersPage() {
  const { orders, credit } = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Order history</h1>

      <StoreCreditCard credit={credit} />

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px' }}>
          <p style={{ fontSize: 15, color: '#131b28', marginBottom: 20 }}>No orders yet — ready to shop?</p>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
          {orders.map((order) => {
            const itemCount = order.items.reduce((n, item) => n + item.qty, 0)
            return (
              <Link
                key={order.id}
                to="/account/orders/$id"
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
                  <div style={{ marginTop: 4, fontSize: 12, color: '#5a6875' }}>
                    {new Date(order.createdAt).toLocaleDateString()} · {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                    {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>
                    {formatMoney(order.total)}
                  </span>
                  <span style={{ fontSize: 13, color: '#5a6875' }}>›</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
