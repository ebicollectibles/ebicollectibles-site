import { createFileRoute } from '@tanstack/react-router'
import { requireCustomer, getCurrentCustomer } from '~/server/customer-auth'

export const Route = createFileRoute('/account/profile')({
  beforeLoad: () => requireCustomer(),
  loader: () => getCurrentCustomer(),
  component: ProfilePage,
})

function ProfilePage() {
  const customer = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Profile</h1>

      {customer && (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#98a1ab', marginBottom: 4 }}>
              Email
            </div>
            <div style={{ fontSize: 15, color: '#131b28' }}>{customer.email}</div>
          </div>

          {customer.name && (
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#98a1ab', marginBottom: 4 }}>
                Name
              </div>
              <div style={{ fontSize: 15, color: '#131b28' }}>{customer.name}</div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
