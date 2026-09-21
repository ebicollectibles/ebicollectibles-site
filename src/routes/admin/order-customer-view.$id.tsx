import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { requireAdmin } from '~/server/admin-auth'
import { adminGetOrder } from '~/server/admin'
import { formatMoney } from '~/lib/products'
import { carrierTrackingUrl } from '~/lib/carriers'

// Read-only recreation of the customer's own /account/orders/$id page —
// no ship tools, cancel/revert buttons, risk/AVS/CVV info, or email logs.
// Reached only from a customer's profile (admin/customers/$id), when
// admin wants to see exactly what the customer sees, not manage the
// order. Day-to-day order management stays on /admin/orders/$id.
export const Route = createFileRoute('/admin/order-customer-view/$id')({
  beforeLoad: () => requireAdmin(),
  loader: ({ params }) => adminGetOrder({ data: { id: params.id } }),
  validateSearch: (search) => z.object({ customerId: z.string().optional() }).parse(search),
  component: AdminOrderCustomerViewPage,
})

const fulfillmentColor: Record<string, string> = {
  pending: '#5a6875',
  partially_shipped: '#3a6ea5',
  shipped: '#3f7a63',
  cancelled: '#b4622f',
}

const fulfillmentLabel: Record<string, string> = {
  pending: 'Pending',
  partially_shipped: 'Partially shipped',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

function AdminOrderCustomerViewPage() {
  const order = Route.useLoaderData()
  const { customerId } = Route.useSearch()

  const backLink = customerId ? (
    <Link to="/admin/customers/$id" params={{ id: customerId }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
      ← Back to customer
    </Link>
  ) : (
    <Link to="/admin/customers" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
      ← All customers
    </Link>
  )

  if (!order) {
    return (
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
        <p>Order not found.</p>
        {backLink}
      </section>
    )
  }

  const sameBilling =
    !order.billingStreet ||
    (order.billingFirstName === order.firstName &&
      order.billingLastName === order.lastName &&
      order.billingStreet === order.street &&
      order.billingApartment === order.apartment &&
      order.billingCity === order.city &&
      order.billingState === order.state &&
      order.billingZip === order.zip)

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      {backLink}
      <div
        style={{
          marginTop: 10,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#b4622f',
        }}
      >
        Viewing as the customer sees it
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>#EBI-{order.orderNo}</h1>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            textTransform: 'uppercase',
            color: fulfillmentColor[order.fulfillmentStatus] ?? '#5a6875',
          }}
        >
          {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
        </span>
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: '#5a6875' }}>{new Date(order.createdAt).toLocaleString()}</div>

      {order.shipments.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e3e6ea' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6875' }}>
            Tracking
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {order.shipments.map((s) => {
              const url = carrierTrackingUrl(s.carrier, s.trackingNumber)
              return (
                <div key={s.id}>
                  <div style={{ fontSize: 13.5, color: '#131b28' }}>
                    <span style={{ fontWeight: 700 }}>{s.carrier || 'Package'}</span>
                    {s.trackingNumber &&
                      (url ? (
                        <>
                          {' — '}
                          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#3f7a63', fontWeight: 600 }}>
                            {s.trackingNumber}
                          </a>
                        </>
                      ) : (
                        ` — ${s.trackingNumber}`
                      ))}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 12, color: '#5a6875' }}>
                    {s.items.map((i) => `${i.qty} × ${i.productName}`).join(', ')} · shipped {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                flexShrink: 0,
                background: '#f6f7f8',
                border: '1px solid #e3e6ea',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {item.img && <img src={item.img} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: '#131b28' }}>{item.productName}</div>
              <div style={{ fontSize: 12, color: '#5a6875' }}>
                {item.qty} × {formatMoney(item.unitPrice)}
              </div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#131b28' }}>{formatMoney(item.qty * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e3e6ea', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#131b28' }}>
          <span>Subtotal</span>
          <span>{formatMoney(order.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#131b28' }}>
          <span>Shipping</span>
          <span>{formatMoney(order.shippingCost)}</span>
        </div>
        {order.tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#131b28' }}>
            <span>Tax</span>
            <span>{formatMoney(order.tax)}</span>
          </div>
        )}
        {order.creditApplied > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#3f7a63' }}>
            <span>Store credit</span>
            <span>-{formatMoney(order.creditApplied)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginTop: 4 }}>
          <span>{order.creditApplied > 0 ? 'Amount charged' : 'Total'}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(order.total - order.creditApplied)}</span>
        </div>
      </div>

      {order.paymentMethodSummary && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e3e6ea' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6875' }}>
            Payment
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#131b28' }}>{order.paymentMethodSummary}</div>
        </div>
      )}

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e3e6ea', display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6875' }}>
            Shipping address
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#131b28', lineHeight: 1.5 }}>
            {order.firstName} {order.lastName}
            <br />
            {order.street}
            {order.apartment ? `, ${order.apartment}` : ''}
            <br />
            {order.city}, {order.state} {order.zip}
            {order.phone && (
              <>
                <br />
                {order.phone}
              </>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6875' }}>
            Billing address
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#131b28', lineHeight: 1.5 }}>
            {sameBilling ? (
              'Same as shipping'
            ) : (
              <>
                {order.billingFirstName} {order.billingLastName}
                <br />
                {order.billingStreet}
                {order.billingApartment ? `, ${order.billingApartment}` : ''}
                <br />
                {order.billingCity}, {order.billingState} {order.billingZip}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
