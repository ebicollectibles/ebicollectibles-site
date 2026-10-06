import { createFileRoute, Link } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminGetAffiliateDashboard } from '~/server/admin'
import { AffiliateDashboardView } from '~/components/AffiliateDashboard'

export const Route = createFileRoute('/admin/affiliates_/$id/dashboard')({
  beforeLoad: () => requireAdmin(),
  loader: ({ params }) => adminGetAffiliateDashboard({ data: { affiliateId: params.id } }),
  component: AdminAffiliateDashboardPage,
})

function AdminAffiliateDashboardPage() {
  const affiliate = Route.useLoaderData()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav />
      <div style={{ marginTop: 24 }}>
        <Link to="/admin/affiliates" style={{ fontSize: 12.5, color: '#5a6875' }}>
          ← Affiliates
        </Link>
      </div>
      <div style={{ marginTop: 12 }}>
        {affiliate ? (
          <AffiliateDashboardView affiliate={affiliate} heading={`Viewing as ${affiliate.name}`} />
        ) : (
          <p style={{ fontSize: 14, color: '#5a6875' }}>Affiliate not found.</p>
        )}
      </div>
    </div>
  )
}
