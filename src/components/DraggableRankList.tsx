import * as React from 'react'
import { adminListProducts, adminSetProductRanks } from '~/server/admin'

type AdminProduct = Awaited<ReturnType<typeof adminListProducts>>[number]
type RankField = 'bestSellingRank' | 'newAndUpcomingRank'

// Ranked products first (lowest rank first), then everything unranked
// after them, newest first — same ordering rule the public site uses (see
// rankProducts in lib/products.ts), just working against the admin row
// shape instead of the public Product type.
function initialOrder(products: AdminProduct[], field: RankField): AdminProduct[] {
  const ranked = products.filter((p) => p[field] != null).sort((a, b) => a[field]! - b[field]!)
  const unranked = products
    .filter((p) => p[field] == null)
    .slice()
    .reverse()
  return [...ranked, ...unranked]
}

export function DraggableRankList({ products, field }: { products: AdminProduct[]; field: RankField }) {
  const [order, setOrder] = React.useState<AdminProduct[]>(() => initialOrder(products, field))
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [savedAt, setSavedAt] = React.useState<number | null>(null)
  const [dirty, setDirty] = React.useState(false)

  const moveTo = (id: string, overId: string) => {
    if (id === overId) return
    setOrder((prev) => {
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
    if (to < 0 || to >= order.length) return
    setOrder((prev) => {
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
      await adminSetProductRanks({ data: { field, orderedIds: order.map((p) => p.id) } })
      setDirty(false)
      setSavedAt(Date.now())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
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

      <p style={{ fontSize: 12.5, color: '#98a1ab', margin: '0 0 16px', maxWidth: '60ch' }}>
        Drag a row (or use the arrows) to reorder — everything between its old and new spot shifts to make room.
        Only the top 8 show on the homepage; the rest are still visible on the full "View All" page, in this order.
      </p>

      <div style={{ border: '1px solid #e3e6ea', borderRadius: 2 }}>
        {order.map((p, i) => (
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
              borderBottom: i === order.length - 1 ? 'none' : '1px solid #e3e6ea',
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
                disabled={i === order.length - 1}
                aria-label={`Move ${p.name} down`}
                style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, width: 22, height: 18, cursor: i === order.length - 1 ? 'not-allowed' : 'pointer', opacity: i === order.length - 1 ? 0.4 : 1, fontSize: 10, lineHeight: 1 }}
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
