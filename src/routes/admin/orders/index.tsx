import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListOrders, adminListPaymentFailures, adminSendDelayNotice } from '~/server/admin'
import { formatMoney } from '~/lib/products'

const ORDERS_PER_PAGE = 20

export const Route = createFileRoute('/admin/orders/')({
  beforeLoad: () => requireAdmin(),
  loader: async () => ({ orders: await adminListOrders(), paymentFailures: await adminListPaymentFailures() }),
  component: AdminOrdersPage,
})

const paymentColor: Record<string, string> = {
  paid: '#3f7a63',
  test: '#b4622f',
  failed: '#b4622f',
  unpaid: '#5a6875',
}

const fulfillmentColor: Record<string, string> = {
  pending: '#5a6875',
  partially_shipped: '#3a6ea5',
  shipped: '#3f7a63',
  cancelled: '#b4622f',
}

const riskColor: Record<string, string> = {
  NORMAL: '#3f7a63',
  MODERATE: '#b4622f',
  HIGH: '#a13a3a',
}
const riskLabel: Record<string, string> = {
  NORMAL: 'Normal',
  MODERATE: 'Moderate',
  HIGH: 'High',
}

const fulfillmentLabel: Record<string, string> = {
  pending: 'pending',
  partially_shipped: 'partially shipped',
  shipped: 'shipped',
  cancelled: 'cancelled',
}

// "Hasn't arrived yet" — anything not fully shipped and not cancelled. Not
// exposed as its own status value in the schema, just a filter shortcut.
const NOT_SHIPPED_STATUSES = new Set(['pending', 'partially_shipped'])

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
}

const DEFAULT_MESSAGE =
  "I wanted to reach out personally — your order hasn't arrived yet, and I wanted to give you a real update rather than let you wonder. [Explain what's going on and the new estimate here.]\n\nI'm sorry for the wait, and happy to answer any questions in the meantime."

type AdminOrder = Awaited<ReturnType<typeof adminListOrders>>[number]

function AdminOrdersPage() {
  const navigate = useNavigate()
  const { orders, paymentFailures } = Route.useLoaderData()
  const [page, setPage] = React.useState(1)
  const [itemFilter, setItemFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'not_shipped' | 'pending' | 'partially_shipped' | 'all'>('not_shipped')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [composing, setComposing] = React.useState(false)
  const [message, setMessage] = React.useState(DEFAULT_MESSAGE)
  const [sending, setSending] = React.useState(false)
  const [sendResult, setSendResult] = React.useState<{ sent: number; failed: number; skipped: number } | null>(null)
  const [sendError, setSendError] = React.useState<string | null>(null)

  const filteredOrders = React.useMemo(() => {
    const query = itemFilter.trim().toLowerCase()
    return orders.filter((order: AdminOrder) => {
      if (statusFilter === 'not_shipped' && !NOT_SHIPPED_STATUSES.has(order.fulfillmentStatus)) return false
      if (statusFilter === 'pending' && order.fulfillmentStatus !== 'pending') return false
      if (statusFilter === 'partially_shipped' && order.fulfillmentStatus !== 'partially_shipped') return false
      if (query && !order.itemNames.some((name) => name.toLowerCase().includes(query))) return false
      return true
    })
  }, [orders, itemFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = filteredOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)

  const resetFilters = (next: Partial<{ itemFilter: string; statusFilter: typeof statusFilter }>) => {
    if (next.itemFilter !== undefined) setItemFilter(next.itemFilter)
    if (next.statusFilter !== undefined) setStatusFilter(next.statusFilter)
    setPage(1)
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllFiltered = () => setSelectedIds(new Set(filteredOrders.map((o: AdminOrder) => o.id)))
  const clearSelection = () => setSelectedIds(new Set())

  const sendNotice = async () => {
    if (!message.trim() || selectedIds.size === 0) return
    setSending(true)
    setSendError(null)
    setSendResult(null)
    try {
      const { results } = await adminSendDelayNotice({ data: { orderIds: [...selectedIds], message: message.trim() } })
      const tally = { sent: 0, failed: 0, skipped: 0 }
      for (const r of results) tally[r.status]++
      setSendResult(tally)
      clearSelection()
      setComposing(false)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send.')
    } finally {
      setSending(false)
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
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Orders</h1>

      {paymentFailures.length > 0 && (
        <div style={{ marginTop: 20, border: '1px solid #e3c7b4', background: '#fbf3ec', borderRadius: 4, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#8a4a26' }}>Recent payment failures</h2>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {paymentFailures.map((f) => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#131b28' }}>
                <span>
                  {f.email || 'unknown email'} — {formatMoney(f.amount ?? 0)} — {f.errorMessage}
                </span>
                <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                  {new Date(f.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No orders yet.</p>}

      {orders.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a6875', marginBottom: 6 }}>
                Item contains
              </label>
              <input
                value={itemFilter}
                onChange={(e) => resetFilters({ itemFilter: e.target.value })}
                placeholder="e.g. Chinese 30th"
                style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #cfd4da', borderRadius: 2, width: 220 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a6875', marginBottom: 6 }}>
                Fulfillment
              </label>
              <select
                value={statusFilter}
                onChange={(e) => resetFilters({ statusFilter: e.target.value as typeof statusFilter })}
                style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #cfd4da', borderRadius: 2, background: '#fff' }}
              >
                <option value="not_shipped">Hasn't arrived (pending + partially shipped)</option>
                <option value="pending">Pending only</option>
                <option value="partially_shipped">Partially shipped only</option>
                <option value="all">All</option>
              </select>
            </div>
            <div style={{ fontSize: 12.5, color: '#5a6875', paddingBottom: 9 }}>
              {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} match
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div style={{ marginTop: 16, border: '1px solid #cfd4da', borderRadius: 4, padding: 16, background: '#f6f7f8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedIds.size} customer{selectedIds.size === 1 ? '' : 's'} selected</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={clearSelection} style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, cursor: 'pointer' }}>
                    Clear selection
                  </button>
                  {!composing && (
                    <button
                      onClick={() => setComposing(true)}
                      style={{ background: '#131b28', color: '#fff', border: 0, borderRadius: 2, padding: '8px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Notify about a delay
                    </button>
                  )}
                </div>
              </div>

              {composing && (
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a6875', marginBottom: 6 }}>
                    Message — sent as-is, same to every selected customer
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    style={{ width: '100%', padding: 10, fontSize: 13.5, lineHeight: 1.5, border: '1px solid #cfd4da', borderRadius: 2, fontFamily: 'inherit', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                    <button
                      onClick={sendNotice}
                      disabled={sending || !message.trim()}
                      style={{
                        background: '#131b28',
                        color: '#fff',
                        border: 0,
                        borderRadius: 2,
                        padding: '9px 18px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: sending ? 'default' : 'pointer',
                        opacity: sending ? 0.6 : 1,
                      }}
                    >
                      {sending ? 'Sending…' : `Send to ${selectedIds.size}`}
                    </button>
                    <button onClick={() => setComposing(false)} style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                  {sendError && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{sendError}</p>}
                </div>
              )}
            </div>
          )}

          {sendResult && (
            <div style={{ marginTop: 16, border: '1px solid #cfe3d8', background: '#f1f7f4', borderRadius: 4, padding: 14, fontSize: 12.5, color: '#3f7a63' }}>
              Sent {sendResult.sent}
              {sendResult.skipped > 0 ? `, skipped ${sendResult.skipped} (no email on file)` : ''}
              {sendResult.failed > 0 ? `, failed ${sendResult.failed}` : ''}.
            </div>
          )}

          <div className="ebi-admin-scroll-hint" style={{ fontSize: 11.5, color: '#5a6875', marginTop: 14 }}>
            Swipe to see more →
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ ...th, width: 30 }}>
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && filteredOrders.every((o: AdminOrder) => selectedIds.has(o.id))}
                    onChange={(e) => (e.target.checked ? selectAllFiltered() : clearSelection())}
                    aria-label="Select all matching orders"
                  />
                </th>
                <th style={th}>Order</th>
                <th style={th}>Customer</th>
                <th style={th}>Items</th>
                <th style={th}>Payment</th>
                <th style={th}>Risk</th>
                <th style={th}>Fulfillment</th>
                <th style={th}>Total</th>
                <th style={th}>Date</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {pageOrders.map((order: AdminOrder) => (
                <tr key={order.id}>
                  <td style={td}>
                    <input type="checkbox" checked={selectedIds.has(order.id)} onChange={() => toggleSelected(order.id)} aria-label={`Select order #EBI-${order.orderNo}`} />
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>#EBI-{order.orderNo}</td>
                  <td style={td}>
                    <div>
                      {order.firstName} {order.lastName}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#5a6875' }}>{order.email}</div>
                  </td>
                  <td style={{ ...td, fontSize: 12, color: '#5a6875', maxWidth: 180 }}>{order.itemNames.join(', ')}</td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: paymentColor[order.paymentStatus] ?? '#5a6875' }}>
                    {order.paymentStatus}
                    {order.totalRefunded > 0 && (
                      <div style={{ color: '#8a4a26', fontSize: 10.5, marginTop: 2 }}>Refunded {formatMoney(order.totalRefunded)}</div>
                    )}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: 'uppercase' }}>
                    {order.riskLevel ? (
                      <span
                        style={{
                          color: riskColor[order.riskLevel] ?? '#5a6875',
                          border: `1px solid ${riskColor[order.riskLevel] ?? '#5a6875'}`,
                          borderRadius: 2,
                          padding: '2px 6px',
                        }}
                      >
                        {riskLabel[order.riskLevel] ?? order.riskLevel}
                      </span>
                    ) : (
                      <span style={{ color: '#cfd4da' }}>—</span>
                    )}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: fulfillmentColor[order.fulfillmentStatus] ?? '#5a6875' }}>
                    {fulfillmentLabel[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{formatMoney(order.total)}</td>
                  <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link to="/admin/orders/$id" params={{ id: order.id }} style={{ fontSize: 12.5, color: '#3f7a63' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {pageOrders.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ ...td, textAlign: 'center', color: '#5a6875' }}>
                    No orders match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </>
      )}

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
    </div>
  )
}
