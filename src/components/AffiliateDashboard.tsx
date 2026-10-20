import * as React from 'react'
import { formatMoney } from '~/lib/products'

const SITE_URL = 'https://ebicollectibles.com'

export type AffiliateDashboardData = {
  code: string
  name: string
  commissionRate: number
  // Every published product with its effective rate (its own override,
  // or the affiliate's default commissionRate if it doesn't have one).
  // isDefault marks a row that's just inheriting the default, rather than
  // having its own override. excluded means this product earns nothing
  // (only possible when restrictToScopedProducts is true and this product
  // has no override — commissionRate is 0 in that case too).
  productRates: Array<{ productName: string; productImg?: string; commissionRate: number; isDefault: boolean; excluded: boolean }>
  // true: ONLY products with their own override earn anything, everything
  // else earns nothing. false: everything earns commissionRate by
  // default, and overridden products are just special-cased on top.
  restrictToScopedProducts: boolean
  orderCount: number
  totalCommission: number
  paidCommission: number
  owedCommission: number
  // commissionRate here is the blended rate THIS order actually earned
  // at (null for an order placed before this was tracked) — can differ
  // from the affiliate's current default/productRates above, which only
  // ever show what's in effect right now, not what applied historically.
  // items breaks that same order down per line — a null rate there means
  // that specific line earned nothing (out of scope for a restricted
  // affiliate), not that it's untracked.
  orders: Array<{
    orderNo: number
    createdAt: Date | string
    subtotal: number
    commission: number
    commissionRate: number | null
    paid: boolean
    refunded: boolean
    items: Array<{ productName: string; productImg?: string; unitPrice: number; qty: number; commissionRate: number | null; commission: number }>
  }>
}

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#5a6875',
}

const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#131b28',
  padding: '8px 12px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #e3e6ea',
  fontSize: 13,
}

// Small inline thumbnail used next to a product's name in both the "Rate by
// item" list and the per-order item breakdown — just enough to recognize
// which item is which at a glance, not a full product shot. Renders a plain
// gray placeholder box (no broken-image icon) when there's no image, same
// idea as the striped placeholder elsewhere in the app.
function ProductThumb({ src, alt }: { src?: string; alt: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 30,
        height: 30,
        flexShrink: 0,
        background: '#f6f7f8',
        border: '1px solid #e3e6ea',
        borderRadius: 2,
        overflow: 'hidden',
        verticalAlign: 'middle',
      }}
    >
      {src && <img src={src} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
    </span>
  )
}

function StatTile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 18px' }}>
      <div style={monoLabel}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600, marginTop: 6, color: color ?? '#131b28' }}>{value}</div>
    </div>
  )
}

/**
 * The affiliate dashboard itself — shared between the affiliate's own
 * /account/affiliate page and admin's read-only "view as" preview
 * (/admin/affiliates/$id/dashboard), so what admin sees is provably the
 * exact same thing the affiliate sees, not a hand-maintained lookalike.
 */
export function AffiliateDashboardView({ affiliate, heading = 'Affiliate' }: { affiliate: AffiliateDashboardData; heading?: string }) {
  const [copied, setCopied] = React.useState(false)
  const [expandedOrderNos, setExpandedOrderNos] = React.useState<Set<number>>(new Set())
  const toggleOrderExpanded = (orderNo: number) => {
    setExpandedOrderNos((current) => {
      const next = new Set(current)
      if (next.has(orderNo)) next.delete(orderNo)
      else next.add(orderNo)
      return next
    })
  }
  const link = `${SITE_URL}/?ref=${affiliate.code}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Clipboard API can be blocked (no HTTPS context, permissions,
      // older browser) — fall back to a prompt so the link is still
      // copyable by hand instead of silently doing nothing.
      window.prompt('Copy the referral link:', link)
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{heading}</h1>
      <p style={{ fontSize: 14, color: '#5a6875', marginTop: 8 }}>
        {affiliate.name} · {affiliate.commissionRate}% default commission
      </p>

      {affiliate.productRates.length > 0 && (
        <div style={{ marginTop: 16, border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 20px' }}>
          <div style={monoLabel}>Rate by item</div>
          <p style={{ fontSize: 12, color: '#5a6875', margin: '4px 0 10px' }}>
            {affiliate.restrictToScopedProducts
              ? 'Only items with their own rate earn commission — everything else earns nothing.'
              : `Everything earns the ${affiliate.commissionRate}% default unless it has its own rate below.`}
          </p>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...th, position: 'sticky', top: 0, background: '#fff' }}>Item</th>
                  <th style={{ ...th, position: 'sticky', top: 0, background: '#fff', textAlign: 'right' }}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {affiliate.productRates.map((p) => (
                  <tr key={p.productName}>
                    <td style={{ ...td, color: p.isDefault ? '#5a6875' : '#131b28' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ProductThumb src={p.productImg} alt="" />
                        {p.productName}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {p.excluded ? (
                        <span
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10.5,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#5a6875',
                          }}
                        >
                          Not included
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 10,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontWeight: 700,
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                            background: p.isDefault ? '#eef0f2' : '#e3f0e9',
                            color: p.isDefault ? '#5a6875' : '#2f6b4f',
                          }}
                        >
                          {p.commissionRate}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 20px' }}>
        <div style={monoLabel}>Referral link</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <code style={{ fontSize: 14, color: '#131b28' }}>{link}</code>
          <span style={{ position: 'relative' }}>
            {copied && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 6,
                  background: '#131b28',
                  color: '#fff',
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                Copied to clipboard
              </span>
            )}
            <button
              type="button"
              onClick={copyLink}
              style={{
                background: '#131b28',
                color: '#fff',
                border: 0,
                borderRadius: 2,
                padding: '7px 14px',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Copy link
            </button>
          </span>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <StatTile label="Orders" value={String(affiliate.orderCount)} />
        <StatTile label="Total commission" value={formatMoney(affiliate.totalCommission)} />
        <StatTile label="Paid" value={formatMoney(affiliate.paidCommission)} color="#3f7a63" />
        <StatTile label="Owed" value={formatMoney(affiliate.owedCommission)} color="#b4622f" />
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 36, marginBottom: 0 }}>Orders</h2>
      {affiliate.orders.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#5a6875', marginTop: 12 }}>No orders attributed to this link yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={th}></th>
                <th style={th}>Order</th>
                <th style={th}>Date</th>
                <th style={th}>Subtotal</th>
                <th style={th}>Rate</th>
                <th style={th}>Commission</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {affiliate.orders.map((o) => {
                const expanded = expandedOrderNos.has(o.orderNo)
                return (
                  <React.Fragment key={o.orderNo}>
                    <tr
                      onClick={() => toggleOrderExpanded(o.orderNo)}
                      style={{ cursor: o.items.length > 0 ? 'pointer' : 'default' }}
                    >
                      <td style={{ ...td, color: '#5a6875', width: 20 }}>{o.items.length > 0 ? (expanded ? '▲' : '▼') : ''}</td>
                      <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>#EBI-{o.orderNo}</td>
                      <td style={{ ...td, color: '#5a6875' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={td}>{formatMoney(o.subtotal)}</td>
                      <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", color: '#5a6875' }}>
                        {o.commissionRate != null ? `${o.commissionRate}%` : '—'}
                      </td>
                      <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(o.commission)}</td>
                      <td style={{ ...td, color: o.refunded ? '#5a6875' : o.paid ? '#3f7a63' : '#b4622f' }}>
                        {o.refunded ? 'Refunded' : o.paid ? 'Paid' : 'Owed'}
                      </td>
                    </tr>
                    {expanded && o.items.length > 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '0 12px 14px 32px', borderBottom: '1px solid #e3e6ea' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th style={{ ...th, borderBottom: '1px solid #e3e6ea' }}>Item</th>
                                <th style={{ ...th, borderBottom: '1px solid #e3e6ea', textAlign: 'right' }}>Qty</th>
                                <th style={{ ...th, borderBottom: '1px solid #e3e6ea', textAlign: 'right' }}>Rate</th>
                                <th style={{ ...th, borderBottom: '1px solid #e3e6ea', textAlign: 'right' }}>Commission</th>
                              </tr>
                            </thead>
                            <tbody>
                              {o.items.map((item, i) => (
                                <tr key={i}>
                                  <td style={{ ...td, fontSize: 12.5 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <ProductThumb src={item.productImg} alt="" />
                                      {item.productName}
                                    </span>
                                  </td>
                                  <td style={{ ...td, fontSize: 12.5, textAlign: 'right' }}>{item.qty}</td>
                                  <td style={{ ...td, fontSize: 12.5, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", color: '#5a6875' }}>
                                    {item.commissionRate != null ? `${item.commissionRate}%` : 'Not included'}
                                  </td>
                                  <td style={{ ...td, fontSize: 12.5, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {formatMoney(item.commission)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
