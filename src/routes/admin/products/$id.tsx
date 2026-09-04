import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { ProductForm } from '~/components/ProductForm'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminGetProduct, adminUpdateProduct, adminDeleteProduct } from '~/server/admin'

export const Route = createFileRoute('/admin/products/$id')({
  beforeLoad: () => requireAdmin(),
  loader: ({ params }) => adminGetProduct({ data: { id: params.id } }),
  component: EditProductPage,
})

function EditProductPage() {
  const navigate = useNavigate()
  const product = Route.useLoaderData()
  const { id } = Route.useParams()

  if (!product) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px' }}>
        <p>Product not found.</p>
      </div>
    )
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
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Edit product</h1>
        <button
          onClick={async () => {
            if (!confirm('Delete this product? This cannot be undone.')) return
            await adminDeleteProduct({ data: { id } })
            navigate({ to: '/admin' })
          }}
          style={{ background: 'none', border: '1px solid #cfd4da', color: '#b4622f', borderRadius: 2, padding: '9px 14px', fontSize: 12.5, cursor: 'pointer' }}
        >
          Delete product
        </button>
      </div>
      <ProductForm
        submitLabel="Save changes"
        lockId
        initial={{
          id: product.id,
          name: product.name,
          code: product.code,
          type: product.type as any,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? 0,
          stock: product.stock,
          squareVariationId: product.squareVariationId ?? '',
          img: product.img ?? '',
          imgAlt: product.imgAlt ?? '',
          images: product.images ?? [],
          preorder: product.preorder,
          placeholder: product.placeholder ?? '',
        }}
        onSubmit={async (values) => {
          await adminUpdateProduct({
            data: {
              ...values,
              originalId: id,
              compareAtPrice: values.compareAtPrice || null,
              squareVariationId: values.squareVariationId || null,
              img: values.img || undefined,
              imgAlt: values.imgAlt.trim() || undefined,
              images: values.images.map((u) => u.trim()).filter(Boolean),
              placeholder: values.placeholder || undefined,
            },
          })
          navigate({ to: '/admin' })
        }}
      />

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>Edit history</h2>
      {product.editHistory.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#98a1ab' }}>No recorded edits yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.editHistory.map((edit, i) => (
            <div
              key={i}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f4', fontSize: 12.5 }}
            >
              <span>
                <span style={{ fontWeight: 600 }}>{fieldLabel[edit.field] ?? edit.field}</span>{' '}
                <span style={{ color: '#98a1ab' }}>
                  {edit.oldValue ?? '—'} → {edit.newValue ?? '—'}
                </span>
              </span>
              <span style={{ color: '#98a1ab', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
                {new Date(edit.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const fieldLabel: Record<string, string> = {
  price: 'Price',
  compareAtPrice: 'Compare-at price',
  stock: 'Stock',
}
