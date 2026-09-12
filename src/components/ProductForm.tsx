import * as React from 'react'
import { PRODUCT_CATEGORIES, SUBCATEGORIES_BY_CATEGORY, type ProductCategory, type ProductSubcategory } from '~/lib/products'
import { listProductImages, uploadProductImage } from '~/server/uploads'
import { adminSearchSquareCatalog } from '~/server/admin'
import type { SquareCatalogOption } from '~/server/square'

export interface ProductFormValues {
  id: string
  name: string
  category: ProductCategory
  subcategory: ProductSubcategory
  price: number
  compareAtPrice: number
  stock: number
  squareVariationId: string
  img: string
  imgTablet: string
  imgMobile: string
  imgAlt: string
  images: string[]
  description: string
  preorder: boolean
  comingSoon: boolean
  placeholder: string
  published: boolean
}

const emptyValues: ProductFormValues = {
  id: '',
  name: '',
  category: 'Chinese Pokémon Products',
  subcategory: 'Gem Series',
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  squareVariationId: '',
  img: '',
  imgTablet: '',
  imgMobile: '',
  imgAlt: '',
  images: [],
  description: '',
  preorder: false,
  comingSoon: false,
  placeholder: '',
  published: true,
}

const field: React.CSSProperties = {
  border: '1px solid #cfd4da',
  borderRadius: 2,
  padding: '11px 13px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
const disabledField: React.CSSProperties = {
  ...field,
  background: '#f6f7f8',
  color: '#98a1ab',
  cursor: 'not-allowed',
}
const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: 'block' }

// Product photos land straight from a phone camera or a screenshot with no
// size limit but the 8MB server-side cap — a multi-MB image at 3000px+ wide
// serves identically to one a tenth the size at every width this site ever
// displays it (see git history: three existing product photos were doing
// exactly this before being fixed by hand). Resizes/recompresses in the
// browser before upload so this can't recur; never uploads something worse
// than what was picked, and leaves small files alone entirely.
const MAX_UPLOAD_DIMENSION = 1600
const SKIP_RESIZE_BELOW_BYTES = 900_000

async function resizeImageForUpload(file: File): Promise<File> {
  if (file.size < SKIP_RESIZE_BELOW_BYTES) return file

  try {
    const bitmap = await createImageBitmap(file)
    if (Math.max(bitmap.width, bitmap.height) <= MAX_UPLOAD_DIMENSION) {
      bitmap.close()
      return file
    }

    const scale = MAX_UPLOAD_DIMENSION / Math.max(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }

    // JPEG sources (the overwhelmingly common case — phone photos) never
    // have an alpha channel, so recompressing as JPEG is always safe. PNG
    // (and anything else) might be a deliberately transparent graphic, so
    // re-encode as PNG instead and only use the result if it's actually
    // smaller — resizing alone doesn't guarantee a smaller PNG, since
    // canvas re-encoding isn't always as efficient as whatever made the
    // original.
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg'
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const targetType = isJpeg ? 'image/jpeg' : 'image/png'
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, targetType, isJpeg ? 0.87 : undefined))
    if (!blob || blob.size >= file.size) return file

    const ext = isJpeg ? (file.name.match(/\.jpe?g$/i) ? '' : '.jpg') : ''
    return new File([blob], ext ? file.name.replace(/\.[^.]+$/, '') + ext : file.name, { type: targetType })
  } catch {
    // Any failure (decode error, unsupported format, etc.) just falls back
    // to uploading the original — resizing is an optimization, not a gate.
    return file
  }
}

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
        position: 'relative',
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
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setBusy(true)
          try {
            const resized = await resizeImageForUpload(file)
            const formData = new FormData()
            formData.append('file', resized)
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ImagePicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [prefix, setPrefix] = React.useState('')
  const [listing, setListing] = React.useState<{
    folders: Array<{ prefix: string; name: string }>
    files: Array<{ key: string; url: string; name: string; size: number }>
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    setListing(null)
    setError(null)
    listProductImages({ data: { prefix } })
      .then(setListing)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load images.'))
  }, [prefix])

  // Breadcrumb segments for the current folder, e.g. "gem series/vol 6/" ->
  // [{ label: 'gem series', prefix: 'gem series/' }, { label: 'vol 6', prefix: 'gem series/vol 6/' }]
  const crumbs: Array<{ label: string; prefix: string }> = []
  if (prefix) {
    let running = ''
    for (const segment of prefix.split('/').filter(Boolean)) {
      running += `${segment}/`
      crumbs.push({ label: segment, prefix: running })
    }
  }

  const filteredFiles = listing?.files.filter((img) => img.name.toLowerCase().includes(query.trim().toLowerCase()))
  const isEmpty = listing && listing.folders.length === 0 && listing.files.length === 0

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {prefix && (
            <button
              type="button"
              onClick={() => {
                const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2].prefix : ''
                setPrefix(parent)
                setQuery('')
              }}
              aria-label="Back one folder"
              style={{
                background: 'none',
                border: '1px solid #cfd4da',
                borderRadius: 2,
                padding: '3px 8px',
                fontSize: 12,
                color: '#131b28',
                cursor: 'pointer',
                marginRight: 4,
              }}
            >
              ‹ Back
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setPrefix('')
              setQuery('')
            }}
            style={{
              background: 'none',
              border: 0,
              padding: 0,
              fontSize: 12.5,
              fontWeight: prefix ? 500 : 700,
              color: prefix ? '#5a6875' : '#131b28',
              cursor: 'pointer',
            }}
          >
            Home
          </button>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.prefix}>
              <span style={{ fontSize: 12.5, color: '#cfd4da' }}>/</span>
              <button
                type="button"
                onClick={() => {
                  setPrefix(crumb.prefix)
                  setQuery('')
                }}
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  fontSize: 12.5,
                  fontWeight: i === crumbs.length - 1 ? 700 : 500,
                  color: i === crumbs.length - 1 ? '#131b28' : '#5a6875',
                  cursor: 'pointer',
                }}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        {error && <p style={{ fontSize: 12.5, color: '#b4622f' }}>{error}</p>}
        {!listing && !error && <p style={{ fontSize: 13, color: '#98a1ab' }}>Loading…</p>}
        {isEmpty && <p style={{ fontSize: 13, color: '#98a1ab' }}>Nothing in this folder yet.</p>}
        {listing && listing.files.length > 0 && (
          <input
            aria-label="Search this folder's images by file name"
            className="ebi-field"
            style={{ ...field, marginBottom: 14 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this folder by file name…"
            autoFocus
          />
        )}
        {filteredFiles && filteredFiles.length === 0 && listing && listing.files.length > 0 && (
          <p style={{ fontSize: 13, color: '#98a1ab' }}>No file names match "{query}".</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {listing?.folders.map((folder) => (
            <button
              key={folder.prefix}
              type="button"
              onClick={() => {
                setPrefix(folder.prefix)
                setQuery('')
              }}
              aria-label={`Open folder ${folder.name}`}
              title={folder.name}
              style={{
                padding: 0,
                background: 'none',
                border: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  aspectRatio: '1 / 1',
                  background: '#f6f7f8',
                  border: '1px solid #e3e6ea',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                }}
              >
                📁
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#131b28',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {folder.name}
              </div>
            </button>
          ))}
          {filteredFiles?.map((img) => (
            <button
              key={img.key}
              type="button"
              onClick={() => onSelect(img.url)}
              aria-label={`Use ${img.name}`}
              title={img.name}
              style={{
                padding: 0,
                background: 'none',
                border: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  aspectRatio: '1 / 1',
                  background: '#f6f7f8',
                  backgroundImage: `url(${img.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #e3e6ea',
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  marginTop: 5,
                  fontSize: 11,
                  color: '#3d4753',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {img.name}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#98a1ab' }}>
                {formatFileSize(img.size)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SquarePicker({ onSelect, onClose }: { onSelect: (option: SquareCatalogOption) => void; onClose: () => void }) {
  const [query, setQuery] = React.useState('')
  const [options, setOptions] = React.useState<SquareCatalogOption[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setOptions(null)
    setError(null)
    const timer = setTimeout(() => {
      adminSearchSquareCatalog({ data: { query: query.trim() || undefined } })
        .then((result) => {
          if (!cancelled) setOptions(result)
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load Square catalog.')
        })
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

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
          maxWidth: 560,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Link a Square catalog item</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 0, fontSize: 20, lineHeight: 1, cursor: 'pointer', color: '#5a6875' }}
          >
            ×
          </button>
        </div>
        <input
          aria-label="Search Square catalog by name"
          className="ebi-field"
          style={{ ...field, marginBottom: 12 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Square catalog by name…"
          autoFocus
        />
        <div style={{ overflowY: 'auto' }}>
          {error && <p style={{ fontSize: 12.5, color: '#b4622f' }}>{error}</p>}
          {!options && !error && <p style={{ fontSize: 13, color: '#98a1ab' }}>Loading…</p>}
          {options && options.length === 0 && (
            <p style={{ fontSize: 13, color: '#98a1ab' }}>No matching items found in Square.</p>
          )}
          {options?.map((opt) => (
            <button
              key={opt.variationId}
              type="button"
              onClick={() => onSelect(opt)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: '#ffffff',
                border: '1px solid #e3e6ea',
                borderRadius: 2,
                marginBottom: 6,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600 }}>{opt.label}</div>
              {opt.sku && <div style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 2 }}>SKU: {opt.sku}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type PickerTarget = { kind: 'img' } | { kind: 'imgTablet' } | { kind: 'imgMobile' } | { kind: 'images'; index: number } | { kind: 'images-new' }

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
  const [squarePickerOpen, setSquarePickerOpen] = React.useState(false)
  const [squareLabel, setSquareLabel] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!values.squareVariationId) {
      setSquareLabel(null)
      return
    }
    let cancelled = false
    adminSearchSquareCatalog({ data: {} })
      .then((options) => {
        if (cancelled) return
        const match = options.find((o) => o.variationId === values.squareVariationId)
        setSquareLabel(match ? match.label : null)
      })
      .catch(() => {
        if (!cancelled) setSquareLabel(null)
      })
    return () => {
      cancelled = true
    }
    // Only re-resolve when the linked id itself changes, not on every keystroke elsewhere in the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.squareVariationId])

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handlePicked = (url: string) => {
    if (!pickerTarget) return
    if (pickerTarget.kind === 'img') set('img', url)
    else if (pickerTarget.kind === 'imgTablet') set('imgTablet', url)
    else if (pickerTarget.kind === 'imgMobile') set('imgMobile', url)
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
        <label htmlFor="pf-id" style={label}>
          Product ID (slug, e.g. "gem6")
        </label>
        <input
          id="pf-id"
          className="ebi-field"
          style={field}
          value={values.id}
          disabled={lockId}
          onChange={(e) => set('id', e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-name" style={label}>
          Name
        </label>
        <input id="pf-name" className="ebi-field" style={field} value={values.name} onChange={(e) => set('name', e.target.value)} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-category" style={label}>
          Category
        </label>
        <select
          id="pf-category"
          className="ebi-field"
          style={field}
          value={values.category}
          onChange={(e) => {
            const category = e.target.value as ProductCategory
            set('category', category)
            set('subcategory', SUBCATEGORIES_BY_CATEGORY[category][0])
          }}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-subcategory" style={label}>
          Subcategory
        </label>
        <select
          id="pf-subcategory"
          className="ebi-field"
          style={field}
          value={values.subcategory}
          onChange={(e) => set('subcategory', e.target.value as ProductSubcategory)}
        >
          {SUBCATEGORIES_BY_CATEGORY[values.category].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          marginBottom: 20,
          padding: '12px 14px',
          background: values.published ? '#f6f7f8' : '#fdf3ec',
          border: '1px solid ' + (values.published ? '#e3e6ea' : '#e6c4a8'),
          borderRadius: 2,
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <input type="checkbox" checked={values.published} onChange={(e) => set('published', e.target.checked)} />
          Published (visible in the shop)
        </label>
        <p style={{ fontSize: 11.5, color: '#5a6875', margin: '6px 0 0' }}>
          Uncheck this to set up and link the product to Square while keeping it off the live site — it stays fully editable
          here and just won&apos;t appear in the shop, on the homepage, or at its product page until you check it again.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label htmlFor="pf-price" style={label}>
            Price (USD)
          </label>
          <input
            id="pf-price"
            type="number"
            step="0.01"
            min="0"
            className="ebi-field"
            style={values.squareVariationId ? disabledField : field}
            value={values.price}
            onChange={(e) => set('price', Number(e.target.value))}
            disabled={!!values.squareVariationId}
            required
          />
          {values.squareVariationId && (
            <p style={{ fontSize: 11, color: '#98a1ab', marginTop: 6 }}>Synced live from Square — edit the price there.</p>
          )}
        </div>
        <div>
          <label htmlFor="pf-stock" style={label}>
            Stock
          </label>
          <input
            id="pf-stock"
            type="number"
            step="1"
            min="0"
            className="ebi-field"
            style={values.squareVariationId ? disabledField : field}
            value={values.stock}
            onChange={(e) => set('stock', Number(e.target.value))}
            disabled={!!values.squareVariationId}
            required
          />
          {values.squareVariationId && (
            <p style={{ fontSize: 11, color: '#98a1ab', marginTop: 6 }}>Synced live from Square — edit the stock there.</p>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Square inventory link (optional)</label>
        {values.squareVariationId ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '10px 13px',
              fontSize: 13,
            }}
          >
            <span>{squareLabel ?? `Linked (${values.squareVariationId})`}</span>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button type="button" onClick={() => setSquarePickerOpen(true)} style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: '#5a6875' }}>
                Change
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirm('Unlink this product from Square? Stock goes back to being managed locally, starting at 0 until you set a real count — price stays at its last synced value.')) return
                  set('squareVariationId', '')
                  set('stock', 0)
                }}
                style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: '#b4622f' }}
              >
                Unlink
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSquarePickerOpen(true)}
              style={{
                background: '#ffffff',
                border: '1px dashed #cfd4da',
                borderRadius: 2,
                padding: '9px 13px',
                fontSize: 12.5,
                color: '#5a6875',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              + Link to a Square catalog item
            </button>
            <p style={{ fontSize: 11.5, color: '#98a1ab', marginTop: 6 }}>
              Links this product to an item in your Square catalog (e.g. one already managed by another app). When linked, price and
              stock above are both read live from Square instead — edit them there, not here — and a sale here deducts from the same
              Square inventory.
            </p>
          </>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-compare-price" style={label}>
          Compare-at price (USD) — leave 0 for no sale badge
        </label>
        <input
          id="pf-compare-price"
          type="number"
          step="0.01"
          min="0"
          className="ebi-field"
          style={field}
          value={values.compareAtPrice}
          onChange={(e) => set('compareAtPrice', Number(e.target.value))}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-img" style={label}>
          Feature image — desktop (leave blank for a placeholder square)
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="pf-img"
            className="ebi-field"
            style={field}
            value={values.img}
            onChange={(e) => set('img', e.target.value)}
            placeholder="/assets/example.png or paste a URL"
          />
          <UploadButton onUploaded={(url) => set('img', url)} onError={setError} />
          <BrowseButton onClick={() => setPickerTarget({ kind: 'img' })} />
        </div>
        <input
          aria-label="Desktop image alt text"
          className="ebi-field"
          style={{ ...field, marginTop: 8 }}
          value={values.imgAlt}
          onChange={(e) => set('imgAlt', e.target.value)}
          placeholder={`Alt text (defaults to "${values.name || 'the product name'}" if left blank)`}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-img-tablet" style={label}>
          Feature image — tablet (optional, falls back to desktop)
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="pf-img-tablet"
            className="ebi-field"
            style={field}
            value={values.imgTablet}
            onChange={(e) => set('imgTablet', e.target.value)}
            placeholder="/assets/example-tablet.png or paste a URL"
          />
          <UploadButton onUploaded={(url) => set('imgTablet', url)} onError={setError} />
          <BrowseButton onClick={() => setPickerTarget({ kind: 'imgTablet' })} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-img-mobile" style={label}>
          Feature image — mobile (optional, falls back to desktop)
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="pf-img-mobile"
            className="ebi-field"
            style={field}
            value={values.imgMobile}
            onChange={(e) => set('imgMobile', e.target.value)}
            placeholder="/assets/example-mobile.png or paste a URL"
          />
          <UploadButton onUploaded={(url) => set('imgMobile', url)} onError={setError} />
          <BrowseButton onClick={() => setPickerTarget({ kind: 'imgMobile' })} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Additional images (shown as a gallery on the product page)</label>
        {values.images.map((url, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              aria-label={`Additional image ${i + 1} URL`}
              className="ebi-field"
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
        <label htmlFor="pf-placeholder" style={label}>
          Placeholder caption (shown when no image)
        </label>
        <input
          id="pf-placeholder"
          className="ebi-field"
          style={field}
          value={values.placeholder}
          onChange={(e) => set('placeholder', e.target.value)}
          placeholder="product shot / sealed box front"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="pf-description" style={label}>
          Description (shown on the product page — leave blank to use the default sourcing/QC paragraph)
        </label>
        <textarea
          id="pf-description"
          className="ebi-field"
          style={{ ...field, minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What's in the box, set details, pull rates, condition notes…"
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 12 }}>
        <input type="checkbox" checked={values.preorder} onChange={(e) => set('preorder', e.target.checked)} />
        Pre-order item
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 20 }}>
        <input type="checkbox" checked={values.comingSoon} onChange={(e) => set('comingSoon', e.target.checked)} />
        Coming soon — listed but not orderable yet (no price shown, add-to-cart disabled)
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
    {squarePickerOpen && (
      <SquarePicker
        onSelect={(opt) => {
          set('squareVariationId', opt.variationId)
          // Old local stock is meaningless once Square starts driving it —
          // zero it out rather than leave a stale number sitting unused.
          // Price is left alone: it'll show the live Square value once
          // saved and reloaded, no need to zero it in the meantime.
          set('stock', 0)
          setSquareLabel(opt.label)
          setSquarePickerOpen(false)
        }}
        onClose={() => setSquarePickerOpen(false)}
      />
    )}
    </>
  )
}
