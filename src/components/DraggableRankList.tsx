import * as React from 'react'
import { adminListProducts, adminSetProductRanks } from '~/server/admin'

type AdminProduct = Awaited<ReturnType<typeof adminListProducts>>[number]
type RankField = 'bestSellingRank' | 'newAndUpcomingRank'

const HIDE_FIELD = {
  bestSellingRank: 'hideFromBestSelling',
  newAndUpcomingRank: 'hideFromNewAndUpcoming',
} as const

// Shopify-style manual collection: admin explicitly adds products to a
// small curated, ordered list here (not the whole catalog) — everything
// else still shows up on the public "View All" page after this set,
// newest first (see rankProducts in lib/products.ts), it just isn't
// managed from this screen.
export function DraggableRankList({ products, field }: { products: AdminProduct[]; field: RankField }) {
  const initialAdded = React.useMemo(
    () =>
      products
        .filter((p) => p[field] != null)
        .sort((a, b) => a[field]! - b[field]!),
    [products, field],
  )
  const [added, setAdded] = React.useState<AdminProduct[]>(initialAdded)
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const [dirty, setDirty] = React.useState(false)
  const [savedAt, setSavedAt] = React.useState<number | null>(null)

  const addedIds = React.useMemo(() => new Set(added.map((p) => p.id)), [added])
  const trimmedQuery = query.trim().toLowerCase()
  const matches = trimmedQuery
    ? products
        .filter((p) => !addedIds.has(p.id) && !p[HIDE_FIELD[field]] && p.name.toLowerCase().includes(trimmedQuery))
        .slice(0, 8)
    : []

  const addProduct = (p: AdminProduct) => {
    setAdded((prev) => [...prev, p])
    setQuery('')
    setDirty(true)
  }

  const removeProduct = (id: string) => {
    setAdded((prev) => prev.filter((p) => p.id !== id))
    setDirty(true)
  }

  const moveTo = (id: string, overId: string) => {
    if (id === overId) return
    setAdded((prev) => {
      const from = prev.findIndex((p) => p.id === id)
      const to = prev.findIndex((p) => p.id === overId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
    setDirty(true)
  }

  const move = (index: number, direction: -1 | 1) => {
    const to = index + direction
    if (to < 0 || to >= added.length) return
    setAdded((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.splice(to, 0, item)
      return next
    })
    setDirty(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      await adminSetProductRanks({ data: { field, orderedIds: added.map((p) => p.id) } })
      setDirty(false)
      setSavedAt(Date.now())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          style={{
            background: '#131b28',
            color: '#ffffff',
            border: 0,
            borderRadius: 2,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: dirty && !saving ? 'pointer' : 'not-allowed',
            opacity: dirty && !saving ? 1 : 0.5,
          }}
        >
          {saving ? 'Saving…' : 'Save order'}
        </button>
        {!dirty && savedAt && <span style={{ fontSize: 12.5, color: '#3f7a63' }}>Saved</span>}
        {dirty && <span style={{ fontSize: 12.5, color: '#98a1ab' }}>Unsaved changes</span>}
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 420 }}>
        <label htmlFor="rank-list-search" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#98a1ab', marginBottom: 4, display: 'block' }}>
          Add a product
        </label>
        <input
          id="rank-list-search"
          className="ebi-field"
          style={{ border: '1px solid #cfd4da', borderRadius: 2, padding: '10px 12px', fontSize: 13.5, width: '100%' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name…"
        />
        {matches.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#ffffff', border: '1px solid #e3e6ea', borderRadius: 2, boxShadow: '0 8px 20px rgba(19,27,40,0.12)', zIndex: 5, maxHeight: 280, overflowY: 'auto' }}>
            {matches.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addProduct(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 0,
                  borderBottom: '1px solid #f0f2f4',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                <div style={{ width: 28, height: 28, flexShrink: 0, background: '#f6f7f8', border: '1px solid #e3e6ea', overflow: 'hidden' }}>
                  {p.img && <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {added.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#98a1ab' }}>
          Nothing added yet — search above to feature a product here. Everything else still shows up on the "View
          All" page after whatever you add, newest first.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: '#98a1ab', margin: '0 0 16px', maxWidth: '60ch' }}>
            Drag a row (or use the arrows) to reorder — everything between its old and new spot shifts to make room.
            Only the top 8 show on the homepage; the rest are still visible on the full "View All" page, in this
            order, followed by every product not added here.
          </p>
          <div style={{ border: '1px solid #e3e6ea', borderRadius: 2 }}>
            {added.map((p, i) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => setDraggedId(p.id)}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (draggedId) moveTo(draggedId, p.id)
                }}
                onDrop={(e) => e.preventDefault()}
                onDragEnd={() => setDraggedId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderBottom: i === added.length - 1 ? 'none' : '1px solid #e3e6ea',
                  background: draggedId === p.id ? '#f6f7f8' : '#ffffff',
                  cursor: 'grab',
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: '#98a1ab',
                    width: 26,
                    flexShrink: 0,
                    textAlign: 'right',
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ width: 40, height: 40, flexShrink: 0, background: '#f6f7f8', border: '1px solid #e3e6ea', overflow: 'hidden' }}>
                  {p.img && <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: '#98a1ab' }}>{p.subcategory}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${p.name} up`}
                    style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, width: 22, height: 18, cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1, fontSize: 10, lineHeight: 1 }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === added.length - 1}
                    aria-label={`Move ${p.name} down`}
                    style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, width: 22, height: 18, cursor: i === added.length - 1 ? 'not-allowed' : 'pointer', opacity: i === added.length - 1 ? 0.4 : 1, fontSize: 10, lineHeight: 1 }}
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(p.id)}
                  aria-label={`Remove ${p.name}`}
                  style={{ background: 'none', border: 0, color: '#98a1ab', fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
