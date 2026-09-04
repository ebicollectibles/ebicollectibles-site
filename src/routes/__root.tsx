/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { AnnouncementBar } from '~/components/AnnouncementBar'
import { Header } from '~/components/Header'
import { Footer } from '~/components/Footer'
import { CartProvider } from '~/lib/cart-context'
import { getProducts } from '~/server/products'
import { getCurrentCustomer } from '~/server/customer-auth'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  loader: async () => {
    const [products, customer] = await Promise.all([getProducts(), getCurrentCustomer()])
    return { products, customer }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'EBI Collectibles — Sealed Chinese Pokémon, verified' },
      {
        name: 'description',
        content:
          'Simplified Chinese Pokémon booster boxes, figures and blind boxes — sourced through authorised distribution and verified before it ships.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/jpeg', href: '/assets/ebi-logo.jpg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Falls back to safe defaults when the loader hasn't resolved (or failed) —
  // this shell also wraps the error boundary itself, so it must render
  // something even when the loader rejected, instead of crashing on
  // `data` being undefined and hiding the real error underneath.
  const data = Route.useLoaderData()
  const products = data?.products ?? []
  const customer = data?.customer ?? null
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith('/admin') })

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider products={products}>
          {isAdmin ? (
            <main>{children}</main>
          ) : (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
              <AnnouncementBar />
              <Header customer={customer} />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </div>
          )}
        </CartProvider>
        <Scripts />
      </body>
    </html>
  )
}
