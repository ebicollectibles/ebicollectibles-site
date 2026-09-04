import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { requireCustomer, getCurrentCustomer, customerLogout } from '~/server/customer-auth'
import { AccountNav } from '~/components/AccountNav'

export const Route = createFileRoute('/account/profile')({
  beforeLoad: () => requireCustomer(),
  loader: () => getCurrentCustomer(),
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const customer = Route.useLoaderData()

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AccountNav
        email={customer?.email}
        name={customer?.name}
        onLogout={async () => {
          await customerLogout()
          navigate({ to: '/' })
        }}
      />
    </section>
  )
}
