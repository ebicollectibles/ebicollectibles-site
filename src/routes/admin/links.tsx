import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListShortLinks, adminListProducts, adminCreateShortLink, adminUpdateShortLink, adminDeleteShortLink } from '~/server/admin'

export const Route = createFileRoute('/admin/links')({
  beforeLoad: () => requireAdmin(),
  loader: async () => {
    const [links, products] = await Promise.all([adminListShortLinks(), adminListProducts()])
    return { links, products }
  },
  component: AdminLinksPage,
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

const emptyForm = { slug: '', destinationPath: '', utmSource: 'discord', utmMedium: '', utmCampaign: '' }

function AdminLinksPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { links, products } = Route.useLoaderData()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(emptyForm)
  const [pickedProductId, setPickedProductId] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setPickedProductId('')
    setError(null)
    setShowForm(true)
  }
  const startEdit = (link: (typeof links)[number]) => {
    setEditingId(link.id)
    setForm({
      slug: link.slug,
      destinationPath: link.destinationPath,
      utmSource: link.utmSource ?? '',
      utmMedium: link.utmMedium ?? '',
      utmCampaign: link.utmCampaign ?? '',
    })
    setError(null)
    setShowForm(true)
  }
  const cancel = () => {
    setShowForm(false)
    setError(null)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const data = {
        slug: form.slug.trim().toLowerCase(),
        destinationPath: form.destinationPath.trim(),
        utmSource: form.utmSource.trim() || undefined,
        utmMedium: form.utmMedium.trim() || undefined,
        utmCampaign: form.utmCampaign.trim() || undefined,
      }
      if (editingId) {
        await adminUpdateShortLink({ data: { ...data, id: editingId } })
      } else {
        await adminCreateShortLink({ data })
      }
      await router.invalidate()
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string, slug: string) => {
    if (!confirm(`Delete /go/${slug}? Any posted links using it will stop working.`)) return
    await adminDeleteShortLink({ data: { id } })
    await router.invalidate()
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Short links</h1>
          <p style={{ fontSize: 13, color: '#5a6875', margin: '6px 0 0' }}>
            Branded <code>/go/</code> links for Discord and anywhere else you post outside the site.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            style={{ background: '#131b28', color: '#fff', border: 0, borderRadius: 2, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            New link
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginTop: 20, border: '1px solid #cfd4da', borderRadius: 4, padding: 18, background: '#f6f7f8' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>{editingId ? 'Edit link' : 'New link'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={label}>Slug (/go/…)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="gem6-launch"
                style={input}
              />
            </div>
            <div>
              <label style={label}>Destination (path or full URL)</label>
              <input
                value={form.destinationPath}
                onChange={(e) => setForm((f) => ({ ...f, destinationPath: e.target.value }))}
                placeholder="/products/abc123 or https://…"
                style={input}
              />
              <select
                value={pickedProductId}
                onChange={(e) => {
                  const id = e.target.value
                  if (id) setForm((f) => ({ ...f, destinationPath: `/products/${id}` }))
                  setPickedProductId('')
                }}
                style={{ ...input, marginTop: 8, color: '#5a6875' }}
              >
                <option value="">…or pick a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>utm_source</label>
              <input value={form.utmSource} onChange={(e) => setForm((f) => ({ ...f, utmSource: e.target.value }))} style={input} />
            </div>
            <div>
              <label style={label}>utm_medium</label>
              <input
                value={form.utmMedium}
                onChange={(e) => setForm((f) => ({ ...f, utmMedium: e.target.value }))}
                placeholder="community"
                style={input}
              />
            </div>
            <div>
              <label style={label}>utm_campaign</label>
              <input
                value={form.utmCampaign}
                onChange={(e) => setForm((f) => ({ ...f, utmCampaign: e.target.value }))}
                placeholder="gem6-launch"
                style={input}
              />
            </div>
          </div>
          {form.slug.trim() && (
            <p style={{ fontSize: 12, color: '#5a6875', marginTop: 12 }}>
              {SITE_URL}/go/{form.slug.trim().toLowerCase()}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
            <button
              onClick={save}
              disabled={saving || !form.slug.trim() || !form.destinationPath.trim()}
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

      {links.length === 0 && !showForm && <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No short links yet.</p>}

      {links.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, minWidth: 720 }}>
            <thead>
              <tr>
                <th style={th}>Link</th>
                <th style={th}>Destination</th>
                <th style={th}>UTM</th>
                <th style={th}>Clicks</th>
                <th style={th}>Created</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>/go/{link.slug}</td>
                  <td style={{ ...td, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#5a6875' }}>
                    {link.destinationPath}
                  </td>
                  <td style={{ ...td, fontSize: 11.5, color: '#5a6875' }}>
                    {[link.utmSource, link.utmMedium, link.utmCampaign].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{link.clickCount}</td>
                  <td style={{ ...td, fontSize: 12, color: '#5a6875' }}>{new Date(link.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => startEdit(link)} style={{ background: 'none', border: 'none', color: '#3f7a63', fontSize: 12.5, cursor: 'pointer', marginRight: 12 }}>
                      Edit
                    </button>
                    <button onClick={() => remove(link.id, link.slug)} style={{ background: 'none', border: 'none', color: '#b4622f', fontSize: 12.5, cursor: 'pointer' }}>
                      Delete
                    </button>
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
