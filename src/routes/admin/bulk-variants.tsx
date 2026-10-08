import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminBulkAssignVariants } from '~/server/admin'

export const Route = createFileRoute('/admin/bulk-variants')({
  beforeLoad: () => requireAdmin(),
  component: BulkVariantsPage,
})

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
const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#131b28',
  padding: '8px 10px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = {
  padding: '8px 10px',
  borderBottom: '1px solid #e3e6ea',
  fontSize: 13,
}

type ParsedRow = { id: string; variantLabel: string; variantSortOrder: number }

// Accepts rows pasted straight from a spreadsheet (tab-separated) or a
// plain CSV export (comma-separated): id, variant label, optional sort
// order. Blank lines are skipped; sort order defaults to paste position
// when the third column is left out.
function parseRows(text: string): ParsedRow[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const cols = (line.includes('\t') ? line.split('\t') : line.split(',')).map((c) => c.trim())
      const sortOrder = cols[2] ? Number.parseInt(cols[2], 10) : i + 1
      return { id: cols[0] ?? '', variantLabel: cols[1] ?? '', variantSortOrder: Number.isFinite(sortOrder) ? sortOrder : i + 1 }
    })
    .filter((row) => row.id)
}

function BulkVariantsPage() {
  const [variantGroupId, setVariantGroupId] = React.useState('')
  const [pasted, setPasted] = React.useState('')
  const [applying, setApplying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<{ id: string; ok: boolean; error?: string }[] | null>(null)

  const rows = React.useMemo(() => parseRows(pasted), [pasted])

  const apply = async () => {
    setError(null)
    setResults(null)
    const groupId = variantGroupId.trim()
    if (!groupId) {
      setError('Variant group ID is required — use the hub product’s own ID.')
      return
    }
    if (rows.length === 0) {
      setError('Paste at least one row.')
      return
    }
    setApplying(true)
    try {
      const { results: outcome } = await adminBulkAssignVariants({ data: { variantGroupId: groupId, rows } })
      setResults(outcome)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <div style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Bulk variant assign</h1>
        <p style={{ fontSize: 13, color: '#5a6875', margin: '6px 0 0', maxWidth: '68ch', lineHeight: 1.6 }}>
          For product lines that already exist as standalone products and need to be grouped under a hub after the fact — sets
          each row's variant group, variant label, and sort order in one pass instead of editing 30 products by hand. Create the
          notSellable hub product separately on the New Product page first, then come back here for its real variants.
        </p>
      </div>

      <div style={{ marginTop: 24, maxWidth: 360 }}>
        <label style={label}>Variant group ID</label>
        <input
          value={variantGroupId}
          onChange={(e) => setVariantGroupId(e.target.value)}
          placeholder="the hub product's own ID"
          style={input}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={label}>Rows — id, variant label, optional sort order (one per line, tab or comma separated)</label>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder={'pokemon-pikachu-dream-painting-01\t01\npokemon-pikachu-dream-painting-02\t02'}
          rows={12}
          style={{ ...input, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, resize: 'vertical' }}
        />
        <p style={{ fontSize: 12, color: '#5a6875', marginTop: 6 }}>{rows.length} row{rows.length === 1 ? '' : 's'} parsed.</p>
      </div>

      <button
        onClick={apply}
        disabled={applying}
        style={{
          marginTop: 10,
          background: '#131b28',
          color: '#fff',
          border: 0,
          borderRadius: 2,
          padding: '10px 20px',
          fontSize: 13,
          fontWeight: 600,
          cursor: applying ? 'default' : 'pointer',
          opacity: applying ? 0.6 : 1,
        }}
      >
        {applying ? 'Applying…' : `Apply to ${rows.length || ''} product${rows.length === 1 ? '' : 's'}`}
      </button>

      {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginTop: 10 }}>{error}</p>}

      {results && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {results.filter((r) => r.ok).length} of {results.length} updated
            {results.some((r) => !r.ok) ? ' — see failures below.' : '.'}
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10, minWidth: 420 }}>
              <thead>
                <tr>
                  <th style={th}>Product ID</th>
                  <th style={th}>Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace" }}>{r.id}</td>
                    <td style={{ ...td, color: r.ok ? '#3f7a63' : '#b4622f' }}>{r.ok ? 'Updated' : r.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
