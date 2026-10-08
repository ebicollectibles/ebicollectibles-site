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
  productRates: Array<{ productName: string; commissionRate: number; isDefault: boolean; excluded: boolean }>
  // true: ONLY products with their own override earn anything, everything
  // else earns nothing. false: everything earns commissionRate by
  // default, and overridden products are just special-cased on top.
  restrictToScopedProducts: boolean
  orderCount: number
  totalCommission: number
  paidCommission: number
  owedCommission: number
  orders: Array<{ orderNo: number; createdAt: Date | string; subtotal: number; commission: number; paid: boolean; refunded: boolean }>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
            {affiliate.productRates.map((p) => (
              <div key={p.productName} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span style={{ color: p.isDefault ? '#5a6875' : '#131b28' }}>{p.productName}</span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: p.isDefault ? 400 : 600,
                    color: p.excluded ? '#5a6875' : '#131b28',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.excluded ? 'Not included' : `${p.commissionRate}%`}
                </span>
              </div>
            ))}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, minWidth: 480 }}>
            <thead>
              <tr>
                <th style={th}>Order</th>
                <th style={th}>Date</th>
                <th style={th}>Subtotal</th>
                <th style={th}>Commission</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {affiliate.orders.map((o) => (
                <tr key={o.orderNo}>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>#EBI-{o.orderNo}</td>
                  <td style={{ ...td, color: '#5a6875' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={td}>{formatMoney(o.subtotal)}</td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{formatMoney(o.commission)}</td>
                  <td style={{ ...td, color: o.refunded ? '#5a6875' : o.paid ? '#3f7a63' : '#b4622f' }}>
                    {o.refunded ? 'Refunded' : o.paid ? 'Paid' : 'Owed'}
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
