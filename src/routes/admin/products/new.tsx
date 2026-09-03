import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { ProductForm } from '~/components/ProductForm'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminCreateProduct } from '~/server/admin'

export const Route = createFileRoute('/admin/products/new')({
  beforeLoad: () => requireAdmin(),
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>New product</h1>
      <ProductForm
        submitLabel="Create product"
        onSubmit={async (values) => {
          await adminCreateProduct({
            data: {
              ...values,
              compareAtPrice: values.compareAtPrice || null,
              img: values.img || undefined,
              placeholder: values.placeholder || undefined,
            },
          })
          navigate({ to: '/admin' })
        }}
      />
    </div>
  )
}
