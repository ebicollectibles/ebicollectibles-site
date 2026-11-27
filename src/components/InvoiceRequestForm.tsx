import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { CONTEST_ENDS_LABEL, contestLive, freePacksFor } from '~/lib/contest'
import { formatMoney } from '~/lib/products'
import { requestInvoice } from '~/server/invoice-requests'

// Alaska and Hawaii can't check out on the site yet. This sends the cart as
// an invoice request instead (server/invoice-requests.ts): the owner emails
// back an invoice with real shipping. Used in checkout (when the address is
// AK/HI) and in the cart (for the Apple Pay quick checkout).
export interface InvoicePrefill {
  name?: string
  email?: string
  phone?: string
  street?: string
  apartment?: string
  city?: string
  state?: string
  zip?: string
}

const input: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #cfd4da', borderRadius: 3, fontSize: 14, background: '#fff', color: '#131b28', boxSizing: 'border-box' }
const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#131b28', marginBottom: 4 }

export function InvoiceRequestForm({ prefill, compact = false }: { prefill?: InvoicePrefill; compact?: boolean }) {
  const cart = useCart()
  const [f, setF] = React.useState({
    name: prefill?.name ?? '',
    email: prefill?.email ?? '',
    phone: prefill?.phone ?? '',
    street: prefill?.street ?? '',
    apartment: prefill?.apartment ?? '',
    city: prefill?.city ?? '',
    state: prefill?.state === 'HI' ? 'HI' : 'AK',
    zip: prefill?.zip ?? '',
    note: '',
  })
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState<{ subtotal: number; freePacks: number; promotionLive: boolean; email: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }))

  if (done) {
    return (
      <div role="status" style={{ marginTop: 14, padding: '18px 18px', background: '#eef6f2', border: '1px solid #cfe5da', borderRadius: 4, color: '#131b28' }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Request sent. We&rsquo;ll get back to you!</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '8px 0 0' }}>
          We&rsquo;ll email <b>{done.email}</b> an invoice that includes shipping. Nothing has been charged, and a copy of your request is on its way to
          your inbox.
        </p>
        {done.promotionLive && (
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '8px 0 0' }}>
            <b>You&rsquo;re fully in the Black Friday Promotion.</b> This order gets {done.freePacks} free Chinese pack{done.freePacks === 1 ? '' : 's'},
            and its {formatMoney(done.subtotal)} counts toward the top spender prizes, the same as an order placed on the site.
          </p>
        )}
        <Link to="/shop" style={{ display: 'inline-block', marginTop: 12, fontSize: 13.5, fontWeight: 700, color: '#131b28' }}>
          Keep shopping →
        </Link>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (cart.cartEmpty) return setError('Your cart is empty. Add something first.')
    setBusy(true)
    try {
      const res = await requestInvoice({
        data: {
          name: f.name,
          email: f.email,
          phone: f.phone || undefined,
          street: f.street,
          apartment: f.apartment || undefined,
          city: f.city,
          state: f.state as 'AK' | 'HI',
          zip: f.zip,
          note: f.note || undefined,
          lines: cart.lines.map((l) => ({ productId: l.id, qty: l.qty })),
        },
      })
      setDone({ ...res, email: f.email })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const live = contestLive()
  const packs = freePacksFor(cart.subtotal)
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 10 }
  return (
    <form onSubmit={submit} style={{ marginTop: 14, padding: '16px 16px 18px', background: '#fdf3ec', border: '1px solid #e6c4a8', borderRadius: 4 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#131b28' }}>Shipping to Alaska or Hawaii? Request an invoice</div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: '#131b28', margin: '6px 0 0' }}>
        Checkout can&rsquo;t ship there yet, so send us this cart instead. We&rsquo;ll email you an invoice with shipping included. Nothing is charged
        now.
        {live && (
          <>
            {' '}
            <b>It counts fully toward the Black Friday Promotion</b> ({packs} free Chinese pack{packs === 1 ? '' : 's'} and the top spender prizes),
            ends {CONTEST_ENDS_LABEL}.
          </>
        )}
      </p>
      <div style={{ ...grid2, marginTop: 12 }}>
        <div>
          <label style={label} htmlFor="inv-name">Name</label>
          <input id="inv-name" required autoComplete="name" value={f.name} onChange={set('name')} style={input} />
        </div>
        <div>
          <label style={label} htmlFor="inv-email">Email</label>
          <input id="inv-email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} style={input} />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={label} htmlFor="inv-street">Street address</label>
        <input id="inv-street" required autoComplete="address-line1" value={f.street} onChange={set('street')} style={input} />
      </div>
      <div style={{ ...grid2, marginTop: 10 }}>
        <div>
          <label style={label} htmlFor="inv-apt">Apartment, suite (optional)</label>
          <input id="inv-apt" autoComplete="address-line2" value={f.apartment} onChange={set('apartment')} style={input} />
        </div>
        <div>
          <label style={label} htmlFor="inv-city">City</label>
          <input id="inv-city" required autoComplete="address-level2" value={f.city} onChange={set('city')} style={input} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
        <div>
          <label style={label} htmlFor="inv-state">State</label>
          <select id="inv-state" value={f.state} onChange={set('state')} style={input}>
            <option value="AK">Alaska</option>
            <option value="HI">Hawaii</option>
          </select>
        </div>
        <div>
          <label style={label} htmlFor="inv-zip">ZIP</label>
          <input id="inv-zip" required autoComplete="postal-code" value={f.zip} onChange={set('zip')} style={input} />
        </div>
        <div>
          <label style={label} htmlFor="inv-phone">Phone (optional)</label>
          <input id="inv-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} style={input} />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={label} htmlFor="inv-note">Anything else? (optional)</label>
        <textarea id="inv-note" rows={2} value={f.note} onChange={set('note')} style={{ ...input, resize: 'vertical' }} />
      </div>
      {error && <p style={{ fontSize: 12.5, color: '#a85b2c', margin: '10px 0 0' }}>{error}</p>}
      <button
        type="submit"
        disabled={busy}
        style={{ marginTop: 12, width: '100%', background: '#131b28', color: '#fff', border: 0, borderRadius: 3, padding: 13, fontSize: 14, fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1 }}
      >
        {busy ? 'Sending…' : `Send invoice request (${formatMoney(cart.subtotal)})`}
      </button>
    </form>
  )
}
