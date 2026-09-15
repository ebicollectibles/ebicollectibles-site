import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { DraggableRankList } from '~/components/DraggableRankList'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListProducts } from '~/server/admin'

export const Route = createFileRoute('/admin/best-selling')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListProducts(),
  component: AdminBestSellingPage,
})

function AdminBestSellingPage() {
  const products = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '24px 0 20px' }}>Best Selling order</h1>
      <DraggableRankList products={products} field="bestSellingRank" />
    </div>
  )
}
