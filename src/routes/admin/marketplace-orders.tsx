import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListMarketplaceOrders, adminSendMarketplaceShipment, adminSyncMarketplaceOrders } from '~/server/admin'
import { CARRIERS } from '~/lib/carriers'

export const Route = createFileRoute('/admin/marketplace-orders')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListMarketplaceOrders(),
  component: MarketplaceOrdersPage,
})

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
  const [drafts, setDrafts] = React.useState<Record<string, { carrier: string; trackingNumber: string }>>({})
  const [sendingId, setSendingId] = React.useState<string | null>(null)
  const [rowError, setRowError] = React.useState<Record<string, string>>({})
  const [showShipped, setShowShipped] = React.useState(false)

  const pending = orders.filter((o) => !o.shippedAt)
  const shipped = orders.filter((o) => o.shippedAt)
  const visible = showShipped ? shipped : pending

  // Falls back to whatever carrier/tracking Square already had for this
  // order (pre-filled at import time, see adminSyncMarketplaceOrders) rather
  // than blank — the other storefront may have already shipped it, we're
  // just the one who still needs to send the actual notification email.
  const draftFor = (id: string) => {
    if (drafts[id]) return drafts[id]
    const order = orders.find((o) => o.id === id)
    return { carrier: order?.carrier ?? '', trackingNumber: order?.trackingNumber ?? '' }
  }
  const setDraft = (id: string, patch: Partial<{ carrier: string; trackingNumber: string }>) =>
    setDrafts((d) => ({ ...d, [id]: { ...draftFor(id), ...patch } }))

  const sync = async () => {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const result = await adminSyncMarketplaceOrders()
      setSyncMessage(result.imported === 0 ? 'No new orders to import.' : `Imported ${result.imported} new order${result.imported === 1 ? '' : 's'}.`)
      await router.invalidate()
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : 'Sync failed.')
    } finally {
      setSyncing(false)
    }
  }

  const sendShipment = async (id: string) => {
    setSendingId(id)
    setRowError((e) => ({ ...e, [id]: '' }))
    try {
      const draft = draftFor(id)
      await adminSendMarketplaceShipment({
        data: {
          id,
          carrier: (draft.carrier || null) as (typeof CARRIERS)[number] | null,
          trackingNumber: draft.trackingNumber.trim() || null,
        },
      })
      await router.invalidate()
    } catch (err) {
      setRowError((e) => ({ ...e, [id]: err instanceof Error ? err.message : 'Failed to send.' }))
    } finally {
      setSendingId(null)
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
        Orders from other storefronts selling against this same Square inventory (e.g. DropNotify) — paid, not yet shipped. Add tracking below to send
        the customer a "your order has shipped" email.
      </p>
      {syncMessage && <p style={{ fontSize: 12.5, color: '#3f7a63', marginTop: 8 }}>{syncMessage}</p>}

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
            color: !showShipped ? '#131b28' : '#98a1ab',
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
            color: showShipped ? '#131b28' : '#98a1ab',
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
                <th style={th}>{showShipped ? 'Shipped via' : 'Carrier / tracking'}</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{order.sourceName}</td>
                  <td style={td}>
                    <div>
                      {order.firstName} {order.lastName}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#98a1ab' }}>{order.email}</div>
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
                      <div style={{ fontSize: 12.5 }}>
                        {order.carrier || '—'}
                        {order.trackingNumber && <div style={{ color: '#98a1ab', fontSize: 11.5 }}>{order.trackingNumber}</div>}
                        {order.emailStatus && order.emailStatus !== 'sent' && (
                          <div style={{ color: '#b4622f', fontSize: 11 }}>Email {order.emailStatus}{order.emailError ? `: ${order.emailError}` : ''}</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                        <select
                          value={draftFor(order.id).carrier}
                          onChange={(e) => setDraft(order.id, { carrier: e.target.value })}
                          style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 6px', fontSize: 12 }}
                        >
                          <option value="">Carrier…</option>
                          {CARRIERS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          value={draftFor(order.id).trackingNumber}
                          onChange={(e) => setDraft(order.id, { trackingNumber: e.target.value })}
                          placeholder="Tracking number"
                          style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '5px 6px', fontSize: 12 }}
                        />
                        {order.carrier && !drafts[order.id] && (
                          <span style={{ fontSize: 11, color: '#3f7a63' }}>Already shipped in Square — just review and send.</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {!showShipped && (
                      <>
                        <button
                          onClick={() => sendShipment(order.id)}
                          disabled={sendingId === order.id}
                          style={{
                            background: '#3f7a63',
                            color: '#fff',
                            border: 0,
                            borderRadius: 2,
                            padding: '7px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: sendingId === order.id ? 'not-allowed' : 'pointer',
                            opacity: sendingId === order.id ? 0.6 : 1,
                          }}
                        >
                          {sendingId === order.id ? 'Sending…' : 'Mark shipped & email'}
                        </button>
                        {rowError[order.id] && <div style={{ color: '#b4622f', fontSize: 11, marginTop: 4, maxWidth: 180 }}>{rowError[order.id]}</div>}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
