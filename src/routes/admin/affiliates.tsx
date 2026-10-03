import * as React from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import {
  adminListAffiliates,
  adminListAffiliateOrders,
  adminCreateAffiliate,
  adminUpdateAffiliate,
  adminMarkAffiliateCommissionPaid,
  adminListProducts,
} from '~/server/admin'

export const Route = createFileRoute('/admin/affiliates')({
  beforeLoad: () => requireAdmin(),
  loader: async () => {
    const [affiliates, products] = await Promise.all([adminListAffiliates(), adminListProducts()])
    return { affiliates, products }
  },
  component: AdminAffiliatesPage,
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
}
const label: React.CSSProperties = {
  display: 'block',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#5a6875',
  marginBottom: 6,
}
const input: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px',
  fontSize: 13,
  border: '1px solid #cfd4da',
  borderRadius: 2,
  fontFamily: 'inherit',
}

const SITE_URL = 'https://ebicollectibles.com'

const emptyForm = { code: '', name: '', email: '', commissionRate: '10', active: true, productIds: [] as string[] }

function money(n: number) {
  return `$${n.toFixed(2)}`
}

function AdminAffiliatesPage() {
  const router = useRouter()
  const { affiliates, products } = Route.useLoaderData()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(emptyForm)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [payingId, setPayingId] = React.useState<string | null>(null)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const copyLink = async (id: string, code: string) => {
    const url = `${SITE_URL}/?ref=${code}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link:', url)
      return
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500)
  }

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }
  const startEdit = (affiliate: (typeof affiliates)[number]) => {
    setEditingId(affiliate.id)
    setForm({
      code: affiliate.code,
      name: affiliate.name,
      email: affiliate.email ?? '',
      commissionRate: String(affiliate.commissionRate),
      active: affiliate.active,
      productIds: affiliate.productIds,
    })
    setError(null)
    setShowForm(true)
  }
  const cancel = () => {
    setShowForm(false)
    setError(null)
  }

  const toggleProduct = (productId: string) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(productId) ? f.productIds.filter((id) => id !== productId) : [...f.productIds, productId],
    }))
  }

  const save = async () => {
    const rate = Number(form.commissionRate)
    if (!Number.isFinite(rate)) {
      setError('Commission rate must be a number.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const data = { code: form.code.trim().toLowerCase(), name: form.name.trim(), email: form.email.trim(), commissionRate: rate, productIds: form.productIds }
      if (editingId) {
        await adminUpdateAffiliate({ data: { ...data, id: editingId, active: form.active } })
      } else {
        await adminCreateAffiliate({ data })
      }
      await router.invalidate()
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const markPaid = async (affiliate: (typeof affiliates)[number]) => {
    if (!confirm(`Mark ${money(affiliate.owedCommission)} as paid to ${affiliate.name}? Only do this after you've actually sent it.`)) return
    setPayingId(affiliate.id)
    try {
      await adminMarkAffiliateCommissionPaid({ data: { affiliateId: affiliate.id } })
      await router.invalidate()
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Affiliates</h1>
          <p style={{ fontSize: 13, color: '#5a6875', margin: '6px 0 0' }}>
            Give someone a referral code and their link (<code>?ref=code</code>) credits any order they drive — commission is a snapshot taken
            at checkout, so changing a rate here never touches past orders.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            style={{ background: '#131b28', color: '#fff', border: 0, borderRadius: 2, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            New affiliate
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginTop: 20, border: '1px solid #cfd4da', borderRadius: 4, padding: 18, background: '#f6f7f8' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>{editingId ? 'Edit affiliate' : 'New affiliate'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={label}>Code (?ref=…)</label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="zephyr" style={input} />
            </div>
            <div>
              <label style={label}>Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Zephyr" style={input} />
            </div>
            <div>
              <label style={label}>Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="zephyr@example.com"
                style={input}
              />
            </div>
            <div>
              <label style={label}>Commission rate (% of the commissionable amount)</label>
              <input
                type="number"
                min={0}
                max={50}
                step="0.5"
                value={form.commissionRate}
                onChange={(e) => setForm((f) => ({ ...f, commissionRate: e.target.value }))}
                style={input}
              />
            </div>
            {editingId && (
              <div>
                <label style={label}>Status</label>
                <select
                  value={form.active ? 'active' : 'inactive'}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'active' }))}
                  style={input}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive (code stops crediting new orders)</option>
                </select>
              </div>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={label}>Scoped to products (optional)</label>
            <p style={{ fontSize: 12, color: '#5a6875', margin: '0 0 8px', lineHeight: 1.4 }}>
              Leave all unchecked for a general affiliate, commissioned on the whole order. Check specific products if this affiliate is only
              being paid to promote those — commission then only counts what's actually in the cart from this list.
            </p>
            <div style={{ border: '1px solid #cfd4da', borderRadius: 2, maxHeight: 180, overflowY: 'auto', background: '#fff' }}>
              {products.map((p) => (
                <label
                  key={p.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 12.5, borderBottom: '1px solid #f0f2f4', cursor: 'pointer' }}
                >
                  <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          {form.code.trim() && (
            <p style={{ fontSize: 12, color: '#5a6875', marginTop: 12 }}>
              {SITE_URL}/?ref={form.code.trim().toLowerCase()}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
            <button
              onClick={save}
              disabled={saving || !form.code.trim() || !form.name.trim() || !form.commissionRate.trim()}
              style={{
                background: '#131b28',
                color: '#fff',
                border: 0,
                borderRadius: 2,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
          {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 8 }}>{error}</p>}
        </div>
      )}

      {affiliates.length === 0 && !showForm && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No affiliates yet.</p>}

      {affiliates.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, minWidth: 880 }}>
            <thead>
              <tr>
                <th style={th}>Affiliate</th>
                <th style={th}>Rate</th>
                <th style={th}>Status</th>
                <th style={th}>Orders</th>
                <th style={th}>Owed</th>
                <th style={th}>Paid</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <React.Fragment key={a.id}>
                <tr>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>?ref={a.code}</div>
                    <div style={{ fontSize: 11, color: '#5a6875', marginTop: 2 }}>
                      {a.productNames.length === 0 ? 'All products' : `Scoped: ${a.productNames.join(', ')}`}
                    </div>
                  </td>
                  <td style={td}>{a.commissionRate}%</td>
                  <td style={td}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10.5,
                        textTransform: 'uppercase',
                        color: a.active ? '#3f7a63' : '#5a6875',
                      }}
                    >
                      {a.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {a.orderCount > 0 ? (
                      <button
                        onClick={() => toggleExpanded(a.id)}
                        style={{ background: 'none', border: 'none', color: '#131b28', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        {a.orderCount} {expandedId === a.id ? '▲' : '▼'}
                      </button>
                    ) : (
                      a.orderCount
                    )}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: a.owedCommission > 0 ? 700 : 400, color: a.owedCommission > 0 ? '#b4622f' : '#131b28' }}>
                    {money(a.owedCommission)}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", color: '#5a6875' }}>{money(a.paidCommission)}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ position: 'relative', display: 'inline-block' }}>
                      {copiedId === a.id && (
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
                        onClick={() => copyLink(a.id, a.code)}
                        style={{ background: 'none', border: 'none', color: '#131b28', fontSize: 12.5, cursor: 'pointer', marginRight: 12 }}
                      >
                        Copy link
                      </button>
                    </span>
                    {a.owedCommission > 0 && (
                      <button
                        disabled={payingId === a.id}
                        onClick={() => markPaid(a)}
                        style={{ background: 'none', border: 'none', color: '#3f7a63', fontSize: 12.5, cursor: 'pointer', marginRight: 12 }}
                      >
                        Mark paid
                      </button>
                    )}
                    <button onClick={() => startEdit(a)} style={{ background: 'none', border: 'none', color: '#131b28', fontSize: 12.5, cursor: 'pointer' }}>
                      Edit
                    </button>
                  </td>
                </tr>
                {expandedId === a.id && (
                  <tr>
                    <td colSpan={7} style={{ padding: 0, borderBottom: '1px solid #e3e6ea' }}>
                      <AffiliateOrders affiliateId={a.id} />
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AffiliateOrders({ affiliateId }: { affiliateId: string }) {
  const [orders, setOrders] = React.useState<Awaited<ReturnType<typeof adminListAffiliateOrders>> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    adminListAffiliateOrders({ data: { affiliateId } })
      .then((rows) => {
        if (!cancelled) setOrders(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load orders.')
      })
    return () => {
      cancelled = true
    }
  }, [affiliateId])

  if (error) return <p style={{ fontSize: 12.5, color: '#b4622f', padding: '12px 16px' }}>{error}</p>
  if (!orders) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>Loading…</p>
  if (orders.length === 0) return <p style={{ fontSize: 12.5, color: '#5a6875', padding: '12px 16px' }}>No orders yet.</p>

  return (
    <div style={{ background: '#f6f7f8', padding: '10px 16px 14px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Order</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Date</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Subtotal</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Commission</th>
            <th style={{ ...th, borderBottom: '1px solid #cfd4da' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec' }}>
                <Link to="/admin/orders/$id" params={{ id: o.id }} style={{ color: '#131b28', fontFamily: "'IBM Plex Mono', monospace" }}>
                  #{o.orderNo}
                </Link>
              </td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', color: '#5a6875' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', fontFamily: "'IBM Plex Mono', monospace" }}>{money(o.subtotal)}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec', fontFamily: "'IBM Plex Mono', monospace" }}>{money(o.affiliateCommission ?? 0)}</td>
              <td style={{ ...td, borderBottom: '1px solid #e8eaec' }}>
                {o.refunded ? (
                  <span style={{ fontSize: 11.5, color: '#b4622f' }}>Refunded — excluded</span>
                ) : o.affiliateCommissionPaidAt ? (
                  <span style={{ fontSize: 11.5, color: '#3f7a63' }}>Paid</span>
                ) : (
                  <span style={{ fontSize: 11.5, color: '#5a6875' }}>Owed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
