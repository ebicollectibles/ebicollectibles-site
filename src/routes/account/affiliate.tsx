import { createFileRoute } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'
import { getMyAffiliate } from '~/server/affiliate-dashboard'
import { AffiliateDashboardView } from '~/components/AffiliateDashboard'

export const Route = createFileRoute('/account/affiliate')({
  beforeLoad: () => requireCustomer(),
  loader: () => getMyAffiliate(),
  component: AffiliateDashboardPage,
})

function AffiliateDashboardPage() {
  const affiliate = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      {affiliate ? (
        <AffiliateDashboardView affiliate={affiliate} />
      ) : (
        <>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Affiliate</h1>
          <p style={{ fontSize: 14, color: '#5a6875', marginTop: 16 }}>This account isn't set up as an affiliate.</p>
        </>
      )}
    </section>
  )
}
