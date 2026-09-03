import * as React from 'react'
import { PRODUCT_TYPES, type ProductType } from '~/lib/products'
import { listProductImages, uploadProductImage } from '~/server/uploads'

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

function UploadButton({
  label: buttonLabel = 'Upload',
  onUploaded,
  onError,
}: {
  label?: string
  onUploaded: (url: string) => void
  onError: (message: string) => void
}) {
  const [busy, setBusy] = React.useState(false)

  return (
    <label
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 14px',
        background: '#ffffff',
        border: '1px solid #cfd4da',
        borderRadius: 2,
        fontSize: 12.5,
        color: '#5a6875',
        cursor: busy ? 'not-allowed' : 'pointer',
        opacity: busy ? 0.6 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {busy ? 'Uploading…' : buttonLabel}
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setBusy(true)
          try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadProductImage({ data: formData })
            onUploaded(result.url)
          } catch (err) {
            onError(err instanceof Error ? err.message : 'Upload failed.')
          } finally {
            setBusy(false)
          }
        }}
      />
    </label>
  )
}

function BrowseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '0 14px',
        background: '#ffffff',
        border: '1px solid #cfd4da',
        borderRadius: 2,
        fontSize: 12.5,
        color: '#5a6875',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      Browse
    </button>
  )
}

function ImagePicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = React.useState<Array<{ key: string; url: string }> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    listProductImages()
      .then(setImages)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load images.'))
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(19,27,40,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 4,
          padding: 24,
          width: '100%',
          maxWidth: 640,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Choose an uploaded image</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 0, fontSize: 20, lineHeight: 1, cursor: 'pointer', color: '#5a6875' }}
          >
            ×
          </button>
        </div>
        {error && <p style={{ fontSize: 12.5, color: '#b4622f' }}>{error}</p>}
        {!images && !error && <p style={{ fontSize: 13, color: '#98a1ab' }}>Loading…</p>}
        {images && images.length === 0 && <p style={{ fontSize: 13, color: '#98a1ab' }}>No uploaded images yet — use Upload instead.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10 }}>
          {images?.map((img) => (
            <button
              key={img.key}
              type="button"
              onClick={() => onSelect(img.url)}
              aria-label="Use this image"
              style={{
                padding: 0,
                aspectRatio: '1 / 1',
                background: '#f6f7f8',
                backgroundImage: `url(${img.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e3e6ea',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type PickerTarget = { kind: 'img' } | { kind: 'images'; index: number } | { kind: 'images-new' }

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
  const [pickerTarget, setPickerTarget] = React.useState<PickerTarget | null>(null)

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handlePicked = (url: string) => {
    if (!pickerTarget) return
    if (pickerTarget.kind === 'img') set('img', url)
    else if (pickerTarget.kind === 'images') {
      const index = pickerTarget.index
      set('images', values.images.map((u, j) => (j === index ? url : u)))
    } else set('images', [...values.images, url])
    setPickerTarget(null)
  }

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
    <>
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
        <label style={label}>Feature image (leave blank for a placeholder square)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={field} value={values.img} onChange={(e) => set('img', e.target.value)} placeholder="/assets/example.png or paste a URL" />
          <UploadButton onUploaded={(url) => set('img', url)} onError={setError} />
          <BrowseButton onClick={() => setPickerTarget({ kind: 'img' })} />
        </div>
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
              placeholder="/assets/example-2.png or paste a URL"
            />
            <UploadButton
              onUploaded={(url2) => set('images', values.images.map((u, j) => (j === i ? url2 : u)))}
              onError={setError}
            />
            <BrowseButton onClick={() => setPickerTarget({ kind: 'images', index: i })} />
            <button
              type="button"
              onClick={() => {
                if (!confirm('Remove this image from the list?')) return
                set('images', values.images.filter((_, j) => j !== i))
              }}
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => set('images', [...values.images, ''])}
            style={{
              flex: 1,
              background: 'none',
              border: '1px dashed #cfd4da',
              borderRadius: 2,
              padding: '9px 13px',
              fontSize: 12.5,
              color: '#5a6875',
              cursor: 'pointer',
            }}
          >
            + Add image URL
          </button>
          <UploadButton
            label="+ Upload image"
            onUploaded={(url) => set('images', [...values.images, url])}
            onError={setError}
          />
          <BrowseButton onClick={() => setPickerTarget({ kind: 'images-new' })} />
        </div>
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
    {pickerTarget && <ImagePicker onSelect={handlePicked} onClose={() => setPickerTarget(null)} />}
    </>
  )
}
