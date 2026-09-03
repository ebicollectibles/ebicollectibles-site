import * as React from 'react'
import { PRODUCT_TYPES, type ProductType } from '~/lib/products'

export interface ProductFormValues {
  id: string
  name: string
  code: string
  type: ProductType
  price: number
  compareAtPrice: number
  stock: number
  img: string
  images: string[]
  preorder: boolean
  placeholder: string
}

const emptyValues: ProductFormValues = {
  id: '',
  name: '',
  code: '',
  type: 'Booster box',
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  img: '',
  images: [],
  preorder: false,
  placeholder: '',
}

const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: 'block' }

export function ProductForm({
  initial,
  lockId,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<ProductFormValues>
  lockId?: boolean
  submitLabel: string
  onSubmit: (values: ProductFormValues) => Promise<void>
}) {
  const [values, setValues] = React.useState<ProductFormValues>({ ...emptyValues, ...initial })
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 520, marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Product ID (slug, e.g. "gem6")</label>
        <input
          style={field}
          value={values.id}
          disabled={lockId}
          onChange={(e) => set('id', e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Name</label>
        <input style={field} value={values.name} onChange={(e) => set('name', e.target.value)} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={label}>Code</label>
          <input style={field} value={values.code} onChange={(e) => set('code', e.target.value)} required />
        </div>
        <div>
          <label style={label}>Type</label>
          <select style={field} value={values.type} onChange={(e) => set('type', e.target.value as ProductType)}>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={label}>Price (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            style={field}
            value={values.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label style={label}>Stock</label>
          <input
            type="number"
            step="1"
            min="0"
            style={field}
            value={values.stock}
            onChange={(e) => set('stock', Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Compare-at price (USD) — leave 0 for no sale badge</label>
        <input
          type="number"
          step="0.01"
          min="0"
          style={field}
          value={values.compareAtPrice}
          onChange={(e) => set('compareAtPrice', Number(e.target.value))}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Feature image URL (leave blank for a placeholder square)</label>
        <input style={field} value={values.img} onChange={(e) => set('img', e.target.value)} placeholder="/assets/example.png" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Additional images (shown as a gallery on the product page)</label>
        {values.images.map((url, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              style={field}
              value={url}
              onChange={(e) =>
                set(
                  'images',
                  values.images.map((u, j) => (j === i ? e.target.value : u)),
                )
              }
              placeholder="/assets/example-2.png"
            />
            <button
              type="button"
              onClick={() => set('images', values.images.filter((_, j) => j !== i))}
              aria-label="Remove image"
              style={{
                flexShrink: 0,
                width: 40,
                background: '#ffffff',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                cursor: 'pointer',
                color: '#b4622f',
                fontSize: 16,
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set('images', [...values.images, ''])}
          style={{
            background: 'none',
            border: '1px dashed #cfd4da',
            borderRadius: 2,
            padding: '9px 13px',
            fontSize: 12.5,
            color: '#5a6875',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          + Add image
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Placeholder caption (shown when no image)</label>
        <input
          style={field}
          value={values.placeholder}
          onChange={(e) => set('placeholder', e.target.value)}
          placeholder="product shot / sealed box front"
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 20 }}>
        <input type="checkbox" checked={values.preorder} onChange={(e) => set('preorder', e.target.checked)} />
        Pre-order item
      </label>

      {error && <p style={{ fontSize: 12.5, color: '#b4622f', marginBottom: 12 }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: '#131b28',
          color: '#ffffff',
          border: 0,
          borderRadius: 2,
          padding: '12px 22px',
          fontSize: 13.5,
          fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
