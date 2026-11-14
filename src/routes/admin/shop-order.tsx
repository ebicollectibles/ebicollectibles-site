import { createFileRoute } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { DraggableRankList } from '~/components/DraggableRankList'
import { requireAdmin } from '~/server/admin-auth'
import { adminListProducts } from '~/server/admin'

export const Route = createFileRoute('/admin/shop-order')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListProducts(),
  component: AdminShopOrderPage,
})

function AdminShopOrderPage() {
  const products = Route.useLoaderData()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '24px 0 20px' }}>Shop order</h1>
      <p style={{ fontSize: 13.5, color: '#5a6875', margin: '0 0 20px', maxWidth: '60ch' }}>
        Pins products to the front of /shop's default "Featured" sort, in this order. Everything else still shows up
        after them, in the catalog's normal order — this doesn't change Low/High/Name sort, or any individual
        category/subcategory filter.
      </p>
      <DraggableRankList
        products={products}
        field="shopSortOrder"
        emptyHint="Nothing pinned yet — search above to pin a product to the front of /shop. Everything else still shows up after it, in the catalog's normal order."
        addedHint="Drag a row (or use the arrows) to reorder — everything between its old and new spot shifts to make room. These show first on /shop (in this order), followed by every product not pinned here."
      />
    </div>
  )
}
