import { createFileRoute, Link } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'
import { getMyOrders } from '~/server/customers'
import { formatMoney } from '~/lib/products'

export const Route = createFileRoute('/account/orders/')({
  beforeLoad: () => requireCustomer(),
  loader: () => getMyOrders(),
  component: OrdersPage,
})

const fulfillmentLabel: Record<string, string> = {
  pending: 'Pending',
  partially_shipped: 'Partially shipped',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

function OrdersPage() {
  const orders = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Order history</h1>

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
                  <div style={{ marginTop: 4, fontSize: 12, color: '#98a1ab' }}>
                    {new Date(order.createdAt).toLocaleDateString()} · {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                    {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
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
      )}
    </section>
  )
}
