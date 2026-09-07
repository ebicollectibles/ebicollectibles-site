import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminCreateShipment, adminGetOrder, adminUpdateOrderStatus } from '~/server/admin'
import { formatMoney } from '~/lib/products'
import { CARRIERS, carrierTrackingUrl } from '~/lib/carriers'
import { remainingQtyByItem } from '~/lib/shipments'

export const Route = createFileRoute('/admin/orders/$id')({
  beforeLoad: () => requireAdmin(),
  loader: ({ params }) => adminGetOrder({ data: { id: params.id } }),
  component: AdminOrderDetailPage,
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

const emailTypeLabel: Record<string, string> = {
  order_confirmation: 'Confirmation',
  shipment_notice: 'Shipped email',
}

const emailStatusColor: Record<string, string> = {
  sent: '#3f7a63',
  failed: '#b4622f',
  skipped: '#98a1ab',
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

function AdminOrderDetailPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const order = Route.useLoaderData()
  const [updating, setUpdating] = React.useState(false)
  const [shipFormOpen, setShipFormOpen] = React.useState(false)
  const [carrierInput, setCarrierInput] = React.useState('')
  const [trackingInput, setTrackingInput] = React.useState('')
  const [shipQtyByItem, setShipQtyByItem] = React.useState<Record<string, number>>({})

  if (!order) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 28px' }}>
        <p>Order not found.</p>
      </div>
    )
  }

  const totalRefunded = order.refunds.reduce((t, r) => t + (r.status === 'COMPLETED' ? r.amount ?? 0 : 0), 0)
  const sameBilling =
    !order.billingStreet ||
    (order.billingFirstName === order.firstName &&
      order.billingLastName === order.lastName &&
      order.billingStreet === order.street &&
      order.billingApartment === order.apartment &&
      order.billingCity === order.city &&
      order.billingState === order.state &&
      order.billingZip === order.zip)
  const remaining = remainingQtyByItem(order.items, order.shipments.flatMap((s) => s.items))
  const hasRemaining = [...remaining.values()].some((qty) => qty > 0)
  const totalToShip = Object.values(shipQtyByItem).reduce((t, qty) => t + qty, 0)

  const changeStatus = async (status: 'pending' | 'cancelled') => {
    const message =
      status === 'cancelled'
        ? `Cancel order #EBI-${order.orderNo}? This won't automatically refund the payment or notify the customer — you'd need to do that separately.`
        : `Revert order #EBI-${order.orderNo} back to pending?`
    if (!confirm(message)) return
    setUpdating(true)
    try {
      await adminUpdateOrderStatus({ data: { orderId: order.id, status } })
      await router.invalidate()
    } finally {
      setUpdating(false)
    }
  }

  const openShipForm = () => {
    setShipFormOpen(true)
    setCarrierInput('')
    setTrackingInput('')
    const initial: Record<string, number> = {}
    for (const item of order.items) {
      const left = remaining.get(item.id) ?? 0
      if (left > 0) initial[item.id] = left
    }
    setShipQtyByItem(initial)
  }

  const confirmShipment = async () => {
    const items = Object.entries(shipQtyByItem)
      .filter(([, qty]) => qty > 0)
      .map(([orderItemId, qty]) => ({ orderItemId, qty }))
    if (items.length === 0) return
    setUpdating(true)
    try {
      await adminCreateShipment({
        data: {
          orderId: order.id,
          carrier: (carrierInput || null) as (typeof CARRIERS)[number] | null,
          trackingNumber: trackingInput.trim() || null,
          items,
        },
      })
      setShipFormOpen(false)
      await router.invalidate()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />

      <Link to="/admin/orders" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
        ← All orders
      </Link>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>#EBI-{order.orderNo}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={tagStyle}>{order.checkoutMode === 'account' ? 'Account' : 'Guest'}</span>
          {totalRefunded > 0 && (
            <span style={{ ...tagStyle, color: '#8a4a26', border: '1px solid #e3c7b4' }}>Refunded {formatMoney(totalRefunded)}</span>
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
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 500 }}>{formatMoney(order.total)}</span>
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 13.5, color: '#131b28' }}>
        {order.firstName} {order.lastName} · {order.email}
        {order.phone ? ` · ${order.phone}` : ''}
      </div>

      <div style={{ marginTop: 18, border: '1px solid #e3e6ea', borderRadius: 4, padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                {item.img && (
                  <img src={item.img} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: '#131b28' }}>{item.productName}</div>
                <div style={{ fontSize: 12, color: '#98a1ab' }}>
                  {item.qty} × {formatMoney(item.unitPrice)}
                </div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#131b28' }}>{formatMoney(item.qty * item.unitPrice)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f0f2f4', display: 'flex', flexDirection: 'column', gap: 4 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginTop: 4 }}>
            <span>Total</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(order.total)}</span>
          </div>
        </div>

        {order.paymentMethodSummary && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f2f4' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#98a1ab' }}>
              Payment
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#131b28' }}>{order.paymentMethodSummary}</div>
          </div>
        )}

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f2f4', display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#98a1ab' }}>
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
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#98a1ab' }}>
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

        <div style={{ marginTop: 12, fontSize: 11.5, color: '#98a1ab' }}>
          {order.shipMethod} · placed {new Date(order.createdAt).toLocaleString()}
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              textTransform: 'uppercase',
              color: fulfillmentColor[order.fulfillmentStatus] ?? '#98a1ab',
            }}
          >
            {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
          </span>
          {(['pending', 'cancelled'] as const)
            .filter((s) => s !== order.fulfillmentStatus)
            .map((s) => (
              <button
                key={s}
                disabled={updating}
                onClick={() => changeStatus(s)}
                style={{
                  background: 'none',
                  border: '1px solid #cfd4da',
                  borderRadius: 2,
                  padding: '4px 8px',
                  fontSize: 11,
                  color: '#131b28',
                  cursor: updating ? 'default' : 'pointer',
                  opacity: updating ? 0.5 : 1,
                }}
              >
                Mark {s}
              </button>
            ))}
          {hasRemaining && (
            <button
              disabled={updating}
              onClick={openShipForm}
              style={{
                background: 'none',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                padding: '4px 8px',
                fontSize: 11,
                color: '#131b28',
                cursor: updating ? 'default' : 'pointer',
                opacity: updating ? 0.5 : 1,
              }}
            >
              {order.fulfillmentStatus === 'partially_shipped' ? 'Ship remaining' : 'Ship items'}
            </button>
          )}
        </div>

        {order.statusHistory.length > 1 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {order.statusHistory.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 11 }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: fulfillmentColor[s.status] ?? '#98a1ab',
                    width: 100,
                    flexShrink: 0,
                  }}
                >
                  {fulfillmentLabel[s.status] ?? s.status}
                </span>
                <span style={{ color: '#98a1ab' }}>{new Date(s.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {shipFormOpen && (
          <div style={{ marginTop: 10, padding: 12, background: '#f6f7f8', borderRadius: 2 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {order.items.map((item) => {
                const left = remaining.get(item.id) ?? 0
                if (left <= 0) return null
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ flex: 1, color: '#131b28' }}>{item.productName}</span>
                    <input
                      type="number"
                      min={0}
                      max={left}
                      value={shipQtyByItem[item.id] ?? 0}
                      onChange={(e) => {
                        const n = Math.max(0, Math.min(left, Math.floor(Number(e.target.value)) || 0))
                        setShipQtyByItem((q) => ({ ...q, [item.id]: n }))
                      }}
                      style={{ width: 56, border: '1px solid #cfd4da', borderRadius: 2, padding: '4px 6px', fontSize: 12 }}
                    />
                    <span style={{ color: '#98a1ab', fontSize: 11, minWidth: 62 }}>of {left} left</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <select
                value={carrierInput}
                onChange={(e) => setCarrierInput(e.target.value)}
                style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 6px', fontSize: 12 }}
              >
                <option value="">Carrier (optional)</option>
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Tracking number (optional)"
                style={{ flex: 1, minWidth: 160, border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 8px', fontSize: 12 }}
              />
              <button
                disabled={updating || totalToShip === 0}
                onClick={confirmShipment}
                style={{
                  background: '#131b28',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: 2,
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: updating || totalToShip === 0 ? 'default' : 'pointer',
                  opacity: updating || totalToShip === 0 ? 0.5 : 1,
                }}
              >
                Confirm shipment
              </button>
              <button
                disabled={updating}
                onClick={() => setShipFormOpen(false)}
                style={{ background: 'none', border: 0, fontSize: 11, color: '#98a1ab', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {order.shipments.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {order.shipments.map((s) => {
              const url = carrierTrackingUrl(s.carrier, s.trackingNumber)
              return (
                <div key={s.id} style={{ fontSize: 11.5, color: '#5a6875' }}>
                  <span style={{ fontWeight: 600, color: '#131b28' }}>{s.carrier || 'Shipment'}</span>
                  {s.trackingNumber && (
                    <>
                      {' · '}
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" style={{ color: '#3f7a63', fontWeight: 600 }}>
                          {s.trackingNumber}
                        </a>
                      ) : (
                        s.trackingNumber
                      )}
                    </>
                  )}
                  {' — '}
                  {s.items.map((i) => `${i.qty}× ${i.productName}`).join(', ')}
                  {' · '}
                  <span style={{ color: '#98a1ab' }}>{new Date(s.createdAt).toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        )}

        {order.emails.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#98a1ab' }}>
            {order.emails.map((e, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <span style={{ color: emailStatusColor[e.status] ?? '#98a1ab' }}>
                  {emailTypeLabel[e.type] ?? e.type} {e.status}
                </span>
                {e.status === 'failed' && e.errorMessage ? ` (${e.errorMessage})` : ''}
                {' — '}
                {new Date(e.createdAt).toLocaleString()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
