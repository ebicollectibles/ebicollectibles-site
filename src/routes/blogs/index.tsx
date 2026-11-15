import { createFileRoute, redirect } from '@tanstack/react-router'

// The blog lives at /blog. /blogs is a natural guess (and the old Shopify-style
// prefix), so send it there permanently.
export const Route = createFileRoute('/blogs/')({
  loader: () => {
    throw redirect({ href: '/blog', statusCode: 301 })
  },
  component: () => null,
})
