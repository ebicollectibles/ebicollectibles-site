import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import {
  adminCreateMarketplaceShipment,
  adminListMarketplaceOrders,
  adminSendMarketplaceShipmentTest,
  adminSyncMarketplaceOrders,
} from '~/server/admin'
import { CARRIERS, carrierTrackingUrl } from '~/lib/carriers'
import { remainingQtyByItem } from '~/lib/shipments'

export const Route = createFileRoute('/admin/marketplace-orders')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListMarketplaceOrders(),
  component: MarketplaceOrdersPage,
})

type MarketplaceOrder = Awaited<ReturnType<typeof adminListMarketplaceOrders>>[number]

const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#131b28',
  padding: '10px 12px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #e3e6ea',
  fontSize: 13,
  verticalAlign: 'top',
}

function MarketplaceOrdersPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const orders = Route.useLoaderData()
  const [syncing, setSyncing] = React.useState(false)
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null)
  const [showShipped, setShowShipped] = React.useState(false)
  const [testEmail, setTestEmail] = React.useState('eastblueinternational@gmail.com')
  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [testMessage, setTestMessage] = React.useState<Record<string, string>>({})
  const [sendingId, setSendingId] = React.useState<string | null>(null)
  const [rowError, setRowError] = React.useState<Record<string, string>>({})

  // Only one row's ship form open at a time — mirrors the regular order
  // detail page's single-form pattern rather than tracking per-row state.
  const [shipFormOpenId, setShipFormOpenId] = React.useState<string | null>(null)
  const [carrierInput, setCarrierInput] = React.useState('')
  const [trackingInput, setTrackingInput] = React.useState('')
  const [shipQtyByItem, setShipQtyByItem] = React.useState<Record<string, number>>({})

  const pending = orders.filter((o) => !o.shippedAt)
  // Most-recently-shipped first — the base list order (by placedAt) isn't
  // what you want to scan here, since a recently-shipped order might have
  // been placed a while ago.
  const shipped = orders.filter((o) => o.shippedAt).sort((a, b) => new Date(b.shippedAt!).getTime() - new Date(a.shippedAt!).getTime())
  const visible = showShipped ? shipped : pending

  const remainingFor = (order: MarketplaceOrder) =>
    remainingQtyByItem(
      order.items,
      order.shipments.flatMap((s) => s.items.map((i) => ({ orderItemId: i.marketplaceOrderItemId, qty: i.qty }))),
    )
  const totalToShip = Object.values(shipQtyByItem).reduce((t, qty) => t + qty, 0)

  const sync = async () => {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const result = await adminSyncMarketplaceOrders()
      const parts = []
      if (result.imported > 0) parts.push(`imported ${result.imported} new order${result.imported === 1 ? '' : 's'}`)
      if (result.refreshed > 0) parts.push(`refreshed ${result.refreshed} pending order${result.refreshed === 1 ? '' : 's'}`)
      setSyncMessage(parts.length === 0 ? 'Nothing to sync.' : parts.join(', ') + '.')
      await router.invalidate()
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : 'Sync failed.')
    } finally {
      setSyncing(false)
    }
  }

  const openShipForm = (order: MarketplaceOrder) => {
    setShipFormOpenId(order.id)
    setRowError((e) => ({ ...e, [order.id]: '' }))
    setTestMessage((m) => ({ ...m, [order.id]: '' }))
    // order.carrier/trackingNumber is Square's own pulled-from-Shippo value
    // for the order as a whole — a genuinely useful prefill for the FIRST
    // shipment. Once any shipment has been recorded, those legacy columns
    // just mirror whichever shipment was recorded most recently (see
    // adminCreateMarketplaceShipment), so they no longer describe "the
    // order's tracking" — carrying that forward here would silently
    // pre-fill a second, unrelated package (e.g. a separate manual Shippo
    // order not linked back to this one) with the first package's tracking
    // number. Leave it blank so it's obviously something to paste in.
    const hasPriorShipment = order.shipments.length > 0
    setCarrierInput(hasPriorShipment ? '' : order.carrier ?? '')
    setTrackingInput(hasPriorShipment ? '' : order.trackingNumber ?? '')
    const remaining = remainingFor(order)
    const initial: Record<string, number> = {}
    for (const item of order.items) {
      const left = remaining.get(item.id) ?? 0
      if (left > 0) initial[item.id] = left
    }
    setShipQtyByItem(initial)
  }

  const closeShipForm = () => {
    setShipFormOpenId(null)
    setShipQtyByItem({})
  }

  const confirmShipment = async (order: MarketplaceOrder) => {
    const items = Object.entries(shipQtyByItem)
      .filter(([, qty]) => qty > 0)
      .map(([marketplaceOrderItemId, qty]) => ({ marketplaceOrderItemId, qty }))
    if (items.length === 0) return
    setSendingId(order.id)
    setRowError((e) => ({ ...e, [order.id]: '' }))
    try {
      await adminCreateMarketplaceShipment({
        data: {
          id: order.id,
          carrier: (carrierInput || null) as (typeof CARRIERS)[number] | null,
          trackingNumber: trackingInput.trim() || null,
          items,
        },
      })
      closeShipForm()
      await router.invalidate()
    } catch (err) {
      setRowError((e) => ({ ...e, [order.id]: err instanceof Error ? err.message : 'Failed to ship.' }))
    } finally {
      setSendingId(null)
    }
  }

  // Previews whatever items/qty are currently staged in the open ship
  // form — doesn't write anything, doesn't require the shipment to exist.
  const sendTest = async (order: MarketplaceOrder) => {
    const items = Object.entries(shipQtyByItem)
      .filter(([, qty]) => qty > 0)
      .map(([marketplaceOrderItemId, qty]) => ({ marketplaceOrderItemId, qty }))
    if (items.length === 0) return
    setTestingId(order.id)
    setTestMessage((m) => ({ ...m, [order.id]: '' }))
    try {
      await adminSendMarketplaceShipmentTest({
        data: {
          id: order.id,
          testEmail,
          carrier: (carrierInput || null) as (typeof CARRIERS)[number] | null,
          trackingNumber: trackingInput.trim() || null,
          items,
        },
      })
      setTestMessage((m) => ({ ...m, [order.id]: `Sent to ${testEmail}.` }))
    } catch (err) {
      setTestMessage((m) => ({ ...m, [order.id]: err instanceof Error ? err.message : 'Test send failed.' }))
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Marketplace orders</h1>
        <button
          onClick={sync}
          disabled={syncing}
          style={{
            background: '#131b28',
            color: '#fff',
            border: 0,
            borderRadius: 2,
            padding: '9px 16px',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: syncing ? 'not-allowed' : 'pointer',
            opacity: syncing ? 0.6 : 1,
          }}
        >
          {syncing ? 'Syncing…' : 'Sync from Square'}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: '#5a6875', marginTop: 8 }}>
        Orders from other storefronts selling against this same Square inventory (e.g. DropNotify) — paid, not yet shipped. Ship items below (an order can
        go out in more than one package) to send the customer a "your order has shipped" email.
      </p>
      {syncMessage && <p style={{ fontSize: 12.5, color: '#3f7a63', marginTop: 8 }}>{syncMessage}</p>}

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#5a6875' }}>Test emails go to:</label>
        <input
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 8px', fontSize: 12, minWidth: 220 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 20, borderBottom: '1px solid #e3e6ea' }}>
        <button
          onClick={() => setShowShipped(false)}
          style={{
            background: 'none',
            border: 0,
            borderBottom: !showShipped ? '2px solid #131b28' : '2px solid transparent',
            padding: '8px 2px',
            fontSize: 13,
            fontWeight: 600,
            color: !showShipped ? '#131b28' : '#5a6875',
            cursor: 'pointer',
          }}
        >
          Needs shipping ({pending.length})
        </button>
        <button
          onClick={() => setShowShipped(true)}
          style={{
            background: 'none',
            border: 0,
            borderBottom: showShipped ? '2px solid #131b28' : '2px solid transparent',
            padding: '8px 2px',
            fontSize: 13,
            fontWeight: 600,
            color: showShipped ? '#131b28' : '#5a6875',
            cursor: 'pointer',
          }}
        >
          Shipped ({shipped.length})
        </button>
      </div>

      {visible.length === 0 && (
        <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>{showShipped ? 'No shipped marketplace orders yet.' : 'Nothing waiting to ship.'}</p>
      )}

      {visible.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 900 }}>
            <thead>
              <tr>
                <th style={th}>Source</th>
                <th style={th}>Customer</th>
                <th style={th}>Items</th>
                <th style={th}>Placed</th>
                <th style={th}>{showShipped ? 'Shipped via' : 'Status'}</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => {
                const remaining = remainingFor(order)
                const hasRemaining = [...remaining.values()].some((qty) => qty > 0)
                const partiallyShipped = !showShipped && order.shipments.length > 0
                const formOpen = shipFormOpenId === order.id
                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
                        {order.sourceName}
                        {order.referenceId && <div style={{ color: '#5a6875', fontSize: 10.5 }}>{order.referenceId}</div>}
                      </td>
                      <td style={td}>
                        <div>
                          {order.firstName} {order.lastName}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#5a6875' }}>{order.email}</div>
                      </td>
                      <td style={{ ...td, fontSize: 12.5 }}>
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.qty}× {item.productName}
                          </div>
                        ))}
                      </td>
                      <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(order.placedAt).toLocaleDateString()}</td>
                      <td style={td}>
                        {showShipped ? (
                          <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {order.shipments.length > 0 ? (
                              order.shipments.map((s) => {
                                const url = carrierTrackingUrl(s.carrier, s.trackingNumber)
                                return (
                                  <div key={s.id}>
                                    <span style={{ fontWeight: 600, color: '#131b28' }}>{s.carrier || 'Shipment'}</span>
                                    {s.trackingNumber &&
                                      (url ? (
                                        <>
                                          {' · '}
                                          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#3f7a63', fontWeight: 600 }}>
                                            {s.trackingNumber}
                                          </a>
                                        </>
                                      ) : (
                                        <> · {s.trackingNumber}</>
                                      ))}
                                    <div style={{ color: '#5a6875', fontSize: 11 }}>
                                      {s.items.map((i) => `${i.qty}× ${i.productName}`).join(', ')} · {new Date(s.createdAt).toLocaleDateString()}
                                    </div>
                                    {s.emailStatus && s.emailStatus !== 'sent' && (
                                      <div style={{ color: '#b4622f', fontSize: 11 }}>
                                        Email {s.emailStatus}
                                        {s.emailError ? `: ${s.emailError}` : ''}
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              // Orders shipped before per-shipment records existed —
                              // fall back to the legacy single-shipment columns.
                              <div>
                                {order.carrier || '—'}
                                {order.trackingNumber && <div style={{ color: '#5a6875', fontSize: 11.5 }}>{order.trackingNumber}</div>}
                                {order.shippedAt && (
                                  <div style={{ color: '#5a6875', fontSize: 11 }}>Marked shipped {new Date(order.shippedAt).toLocaleString()}</div>
                                )}
                                {order.emailStatus && order.emailStatus !== 'sent' && (
                                  <div style={{ color: '#b4622f', fontSize: 11 }}>
                                    Email {order.emailStatus}
                                    {order.emailError ? `: ${order.emailError}` : ''}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11.5 }}>
                            {partiallyShipped ? (
                              <span style={{ color: '#3a6ea5', fontWeight: 600 }}>Partially shipped</span>
                            ) : (
                              <span style={{ color: '#5a6875' }}>Not shipped</span>
                            )}
                            {order.carrier && order.shipments.length === 0 && (
                              <div style={{ color: '#3f7a63', marginTop: 4, maxWidth: 160 }}>Already shipped in Square — review and send below.</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {!showShipped && !formOpen && (
                          <button
                            onClick={() => openShipForm(order)}
                            disabled={!hasRemaining}
                            style={{
                              background: '#3f7a63',
                              color: '#fff',
                              border: 0,
                              borderRadius: 2,
                              padding: '7px 12px',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: hasRemaining ? 'pointer' : 'not-allowed',
                              opacity: hasRemaining ? 1 : 0.5,
                            }}
                          >
                            {partiallyShipped ? 'Ship remaining' : 'Ship items'}
                          </button>
                        )}
                      </td>
                    </tr>

                    {!showShipped && partiallyShipped && !formOpen && (
                      <tr>
                        <td colSpan={6} style={{ ...td, borderBottom: '1px solid #e3e6ea', background: '#f6f7f8' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {order.shipments.map((s) => {
                              const url = carrierTrackingUrl(s.carrier, s.trackingNumber)
                              return (
                                <div key={s.id} style={{ fontSize: 11.5, color: '#5a6875' }}>
                                  <span style={{ fontWeight: 600, color: '#131b28' }}>{s.carrier || 'Shipment'}</span>
                                  {s.trackingNumber &&
                                    (url ? (
                                      <>
                                        {' · '}
                                        <a href={url} target="_blank" rel="noreferrer" style={{ color: '#3f7a63', fontWeight: 600 }}>
                                          {s.trackingNumber}
                                        </a>
                                      </>
                                    ) : (
                                      <> · {s.trackingNumber}</>
                                    ))}
                                  {' — '}
                                  {s.items.map((i) => `${i.qty}× ${i.productName}`).join(', ')}
                                  {' · '}
                                  {new Date(s.createdAt).toLocaleString()}
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )}

                    {!showShipped && formOpen && (
                      <tr>
                        <td colSpan={6} style={{ ...td, borderBottom: '1px solid #e3e6ea', background: '#f6f7f8' }}>
                          {order.shipments.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                              {order.shipments.map((s) => (
                                <div key={s.id} style={{ fontSize: 11.5, color: '#5a6875' }}>
                                  Already shipped: <span style={{ fontWeight: 600, color: '#131b28' }}>{s.carrier || 'Shipment'}</span>
                                  {s.trackingNumber && ` · ${s.trackingNumber}`} — {s.items.map((i) => `${i.qty}× ${i.productName}`).join(', ')}
                                </div>
                              ))}
                            </div>
                          )}
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
                                  <span style={{ color: '#5a6875', fontSize: 11, minWidth: 62 }}>of {left} left</span>
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
                              disabled={sendingId === order.id || totalToShip === 0}
                              onClick={() => confirmShipment(order)}
                              style={{
                                background: '#131b28',
                                color: '#ffffff',
                                border: 0,
                                borderRadius: 2,
                                padding: '6px 12px',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: sendingId === order.id || totalToShip === 0 ? 'default' : 'pointer',
                                opacity: sendingId === order.id || totalToShip === 0 ? 0.5 : 1,
                              }}
                            >
                              {sendingId === order.id ? 'Sending…' : 'Confirm shipment & email'}
                            </button>
                            <button
                              disabled={testingId === order.id || totalToShip === 0}
                              onClick={() => sendTest(order)}
                              style={{
                                background: 'none',
                                color: '#131b28',
                                border: '1px solid #cfd4da',
                                borderRadius: 2,
                                padding: '5px 12px',
                                fontSize: 11.5,
                                cursor: testingId === order.id || totalToShip === 0 ? 'default' : 'pointer',
                                opacity: testingId === order.id || totalToShip === 0 ? 0.5 : 1,
                              }}
                            >
                              {testingId === order.id ? 'Sending test…' : 'Send test to me'}
                            </button>
                            <button
                              disabled={sendingId === order.id}
                              onClick={closeShipForm}
                              style={{ background: 'none', border: 0, fontSize: 11, color: '#5a6875', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                          {rowError[order.id] && <div style={{ color: '#b4622f', fontSize: 11, marginTop: 6 }}>{rowError[order.id]}</div>}
                          {testMessage[order.id] && (
                            <div style={{ color: testMessage[order.id].startsWith('Sent') ? '#3f7a63' : '#b4622f', fontSize: 11, marginTop: 6 }}>
                              {testMessage[order.id]}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
