import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { ProductForm } from '~/components/ProductForm'
import { requireAdmin } from '~/server/admin-auth'
import { adminGetProduct, adminUpdateProduct, adminDeleteProduct } from '~/server/admin'
import type { GoogleCondition, ProductCategory, ProductSubcategory } from '~/lib/products'

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
      <AdminNav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Edit product</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate({ to: '/admin/products/new', search: { duplicateFrom: id } })}
            style={{ background: 'none', border: '1px solid #cfd4da', color: '#131b28', borderRadius: 2, padding: '9px 14px', fontSize: 12.5, cursor: 'pointer' }}
          >
            Duplicate
          </button>
          <button
            onClick={async () => {
              if (!confirm('Delete this product? This cannot be undone.')) return
              await adminDeleteProduct({ data: { id } })
              navigate({ to: '/admin' })
            }}
            style={{ background: 'none', border: '1px solid #cfd4da', color: '#a85b2c', borderRadius: 2, padding: '9px 14px', fontSize: 12.5, cursor: 'pointer' }}
          >
            Delete product
          </button>
        </div>
      </div>
      <ProductForm
        submitLabel="Save changes"
        lockId
        initial={{
          id: product.id,
          name: product.name,
          // Cast, not "any" — admin.ts's z.enum() already guarantees these are
          // always one of the valid values at write time; Drizzle just can't
          // know that from a plain text() column, so the DB read comes back
          // typed as a bare string.
          category: product.category as ProductCategory,
          subcategory: product.subcategory as ProductSubcategory,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? 0,
          stock: product.stock,
          squareVariationId: product.squareVariationId ?? '',
          img: product.img ?? '',
          imgTablet: product.imgTablet ?? '',
          imgMobile: product.imgMobile ?? '',
          imgAlt: product.imgAlt ?? '',
          images: product.images ?? [],
          tags: product.tags ?? [],
          bestSellingRank: product.bestSellingRank ?? 0,
          newAndUpcomingRank: product.newAndUpcomingRank ?? 0,
          hideFromBestSelling: product.hideFromBestSelling,
          hideFromNewAndUpcoming: product.hideFromNewAndUpcoming,
          description: product.description ?? '',
          preorder: product.preorder,
          shipsWithDelay: product.shipsWithDelay,
          restockNote: product.restockNote ?? '',
          comingSoon: product.comingSoon,
          hidePrice: product.hidePrice,
          notSellable: product.notSellable,
          placeholder: product.placeholder ?? '',
          published: product.published,
          dropnotifyAlert: product.dropnotifyAlert,
          gtin: product.gtin ?? '',
          brand: product.brand ?? '',
          condition: (product.condition as GoogleCondition) ?? 'new',
          googleProductCategory: product.googleProductCategory ?? '',
          weightLb: product.weightLb ?? 0,
          variantGroupId: product.variantGroupId ?? '',
          variantLabel: product.variantLabel ?? '',
          variantSortOrder: product.variantSortOrder ?? 0,
          hideFromShopGrid: product.hideFromShopGrid,
        }}
        onSubmit={async (values) => {
          await adminUpdateProduct({
            data: {
              ...values,
              originalId: id,
              compareAtPrice: values.compareAtPrice || null,
              bestSellingRank: values.bestSellingRank || null,
              newAndUpcomingRank: values.newAndUpcomingRank || null,
              squareVariationId: values.squareVariationId || null,
              img: values.img || undefined,
              imgTablet: values.imgTablet || undefined,
              imgMobile: values.imgMobile || undefined,
              imgAlt: values.imgAlt.trim() || undefined,
              images: values.images.map((u) => u.trim()).filter(Boolean),
              description: values.description.trim() || undefined,
              restockNote: values.restockNote.trim() || undefined,
              placeholder: values.placeholder || undefined,
              gtin: values.gtin.trim() || null,
              brand: values.brand.trim() || undefined,
              condition: values.condition || null,
              googleProductCategory: values.googleProductCategory.trim() || undefined,
              weightLb: values.weightLb || null,
              variantGroupId: values.variantGroupId.trim() || undefined,
              variantLabel: values.variantLabel.trim() || undefined,
              variantSortOrder: values.variantSortOrder || null,
            },
          })
          navigate({ to: '/admin' })
        }}
      />

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>Edit history</h2>
      {product.editHistory.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#5a6875' }}>No recorded edits yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.editHistory.map((edit, i) => (
            <div
              key={i}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f4', fontSize: 12.5 }}
            >
              <span>
                <span style={{ fontWeight: 600 }}>{fieldLabel[edit.field] ?? edit.field}</span>{' '}
                <span style={{ color: '#5a6875' }}>
                  {edit.oldValue ?? '—'} → {edit.newValue ?? '—'}
                </span>
              </span>
              <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
                {new Date(edit.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 36, marginBottom: 16 }}>DropNotify alert history</h2>
      {product.dropnotifyHistory.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#5a6875' }}>No alerts sent yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.dropnotifyHistory.map((event, i) => (
            <div
              key={i}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f2f4', fontSize: 12.5 }}
            >
              <span>
                <span style={{ fontWeight: 600, color: dropnotifyStatusColor[event.status] ?? '#131b28' }}>
                  {dropnotifyStatusLabel[event.status] ?? event.status}
                </span>{' '}
                <span style={{ color: '#5a6875' }}>
                  ({dropnotifyTriggerLabel[event.trigger] ?? event.trigger})
                  {event.errorMessage ? ` — ${event.errorMessage}` : ''}
                </span>
              </span>
              <span style={{ color: '#5a6875', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: 'nowrap' }}>
                {new Date(event.createdAt).toLocaleString()}
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

const dropnotifyStatusLabel: Record<string, string> = {
  sent: 'Sent',
  failed: 'Failed',
  skipped: 'Skipped',
}
const dropnotifyStatusColor: Record<string, string> = {
  sent: '#3f7a63',
  failed: '#a85b2c',
  skipped: '#5a6875',
}
const dropnotifyTriggerLabel: Record<string, string> = {
  admin_save: 'saved here',
  square_inventory: 'Square restock',
}
