import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminListCustomers } from '~/server/admin'
import { adminCancelPendingStoreCredit, adminIssueStoreCreditByEmail, adminListPendingStoreCredits } from '~/server/store-credit'
import { formatMoney } from '~/lib/products'
import { STORE_CREDIT_REASONS } from '~/lib/store-credit'

const CUSTOMERS_PER_PAGE = 20

export const Route = createFileRoute('/admin/customers/')({
  beforeLoad: () => requireAdmin(),
  loader: async () => {
    const [customers, pendingCredits] = await Promise.all([adminListCustomers(), adminListPendingStoreCredits()])
    return { customers, pendingCredits }
  },
  component: AdminCustomersPage,
})

function GrantPendingCreditForm() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [reason, setReason] = React.useState('')
  const [otherDetail, setOtherDetail] = React.useState('')
  const [note, setNote] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ claimed: boolean; emailStatus: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (!email.trim()) return setError('Enter an email address.')
    if (!Number.isFinite(parsed) || parsed <= 0) return setError('Enter a dollar amount greater than 0.')
    if (!reason) return setError('Select a reason.')
    if (reason === 'Other' && !otherDetail.trim()) return setError('Describe the reason for "Other".')
    const finalReason = reason === 'Other' ? `Other — ${otherDetail.trim()}` : reason
    setBusy(true)
    setError(null)
    try {
      const res = await adminIssueStoreCreditByEmail({ data: { email: email.trim(), amount: parsed, reason: finalReason, note: note.trim() || undefined } })
      setResult(res)
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not issue credit.')
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return (
      <p style={{ fontSize: 12.5, color: '#3f7a63', marginTop: 10 }}>
        {result.claimed
          ? `${formatMoney(Number(amount))} added to ${email.trim()}'s account.`
          : `${formatMoney(Number(amount))} set aside for ${email.trim()} — claimed automatically once they sign up with that email.`}
        {result.emailStatus === 'sent' && ' An email went out just now.'}{' '}
        <button
          onClick={() => {
            setResult(null)
            setEmail('')
            setAmount('')
            setReason('')
            setOtherDetail('')
            setNote('')
            setOpen(false)
          }}
          style={{ background: 'none', border: 'none', color: '#3f7a63', textDecoration: 'underline', fontSize: 12.5, cursor: 'pointer', padding: 0 }}
        >
          Grant another
        </button>
      </p>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ marginTop: 10, background: 'none', border: '1px solid #cfd4da', borderRadius: 2, padding: '8px 14px', fontSize: 12.5, cursor: 'pointer', color: '#131b28' }}
      >
        + Grant credit by email
      </button>
    )
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 10, border: '1px solid #e3e6ea', borderRadius: 4, padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <p style={{ flex: '1 1 100%', fontSize: 12, color: '#5a6875', margin: 0 }}>
        For an email with no order to attach this to (e.g. every attempt failed) — same as the "Issue store credit" panel on an order page, just
        without needing an order.
      </p>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ flex: '2 1 220px', padding: '8px 10px', border: '1px solid #cfd4da', borderRadius: 2, fontSize: 13 }}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount, e.g. 5"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ flex: '1 1 140px', padding: '8px 10px', border: '1px solid #cfd4da', borderRadius: 2, fontSize: 13 }}
      />
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ flex: '2 1 200px', padding: '8px 10px', border: '1px solid #cfd4da', borderRadius: 2, fontSize: 13, color: reason ? '#131b28' : '#5a6875' }}
      >
        <option value="">Select a reason…</option>
        {STORE_CREDIT_REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {reason === 'Other' && (
        <input
          type="text"
          placeholder="Describe the reason"
          value={otherDetail}
          onChange={(e) => setOtherDetail(e.target.value)}
          style={{ flex: '2 1 200px', padding: '8px 10px', border: '1px solid #cfd4da', borderRadius: 2, fontSize: 13 }}
        />
      )}
      <textarea
        placeholder="Internal note (optional) — never shown to the customer"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        style={{ flex: '1 1 100%', padding: '8px 10px', border: '1px solid #cfd4da', borderRadius: 2, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={busy}
        style={{ background: '#131b28', color: '#fff', border: 0, borderRadius: 2, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}
      >
        {busy ? 'Saving…' : 'Grant credit'}
      </button>
      <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, cursor: 'pointer', padding: '8px 10px' }}>
        Cancel
      </button>
      {error && <p style={{ flex: '1 1 100%', fontSize: 12.5, color: '#b4622f', margin: 0 }}>{error}</p>}
    </form>
  )
}

function PendingCreditsSection({ pendingCredits }: { pendingCredits: Awaited<ReturnType<typeof adminListPendingStoreCredits>> }) {
  const router = useRouter()
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const cancel = async (id: string) => {
    if (!confirm('Cancel this pending credit? It was never claimed, so nothing to reverse — this just removes it.')) return
    setBusyId(id)
    try {
      await adminCancelPendingStoreCredit({ data: { id } })
      await router.invalidate()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Pending credits — no account yet</h2>
      <p style={{ fontSize: 12.5, color: '#5a6875', margin: '6px 0 0' }}>
        Set aside for an email with no account. Claimed automatically into real store credit the moment they sign up with that email, or
        complete any order under it (guest checkout included).
      </p>
      <GrantPendingCreditForm />
      {pendingCredits.length === 0 ? (
        <p style={{ fontSize: 12.5, color: '#5a6875', marginTop: 14 }}>None outstanding.</p>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {pendingCredits.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, border: '1px solid #e3e6ea', borderRadius: 4, padding: '10px 14px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#131b28' }}>{p.email}</span>
              {p.orderId && p.orderNo != null && (
                <>
                  {' '}
                  <Link to="/admin/orders/$id" params={{ id: p.orderId }} style={{ color: '#3f7a63', fontWeight: 600, textDecoration: 'none' }}>
                    #EBI-{p.orderNo}
                  </Link>
                </>
              )}
              {p.reason && <span style={{ color: '#5a6875' }}> — {p.reason}</span>}
              <div style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginTop: 2 }}>
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: '#3f7a63', whiteSpace: 'nowrap' }}>{formatMoney(p.amount)}</span>
              <button
                onClick={() => cancel(p.id)}
                disabled={busyId === p.id}
                style={{ background: 'none', border: 'none', color: '#b4622f', fontSize: 12, cursor: busyId === p.id ? 'default' : 'pointer', padding: '6px 4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

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
  fontSize: 13.5,
}

function AdminCustomersPage() {
  const navigate = useNavigate()
  const { customers, pendingCredits } = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(customers.length / CUSTOMERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageCustomers = customers.slice((currentPage - 1) * CUSTOMERS_PER_PAGE, currentPage * CUSTOMERS_PER_PAGE)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Customers</h1>

      {customers.length === 0 && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No customer accounts yet.</p>}

      {customers.length > 0 && (
        <div className="ebi-admin-scroll-hint" style={{ fontSize: 11.5, color: '#5a6875', marginTop: 14 }}>
          Swipe to see more →
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Sign-in</th>
              <th style={th}>Orders</th>
              <th style={th}>Credit</th>
              <th style={th}>Last login</th>
              <th style={th}>Joined</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {pageCustomers.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.name || <span style={{ color: '#5a6875' }}>—</span>}</td>
                <td style={td}>{c.email}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
                  {c.hasPassword && c.hasGoogle ? 'Password + Google' : c.hasGoogle ? 'Google' : 'Password'}
                </td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{c.orderCount}</td>
                <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {c.creditBalance > 0 ? formatMoney(c.creditBalance) : <span style={{ color: '#5a6875' }}>—</span>}
                </td>
                <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>
                  {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString() : 'Never'}
                </td>
                <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link to="/admin/customers/$id" params={{ id: c.id }} style={{ fontSize: 12.5, color: '#3f7a63' }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '8px 14px',
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
              padding: '8px 14px',
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

      <PendingCreditsSection pendingCredits={pendingCredits} />
    </div>
  )
}
