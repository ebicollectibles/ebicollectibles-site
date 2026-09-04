import { createFileRoute } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'

export const Route = createFileRoute('/account/profile')({
  beforeLoad: () => requireCustomer(),
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Profile</h1>
    </section>
  )
}
