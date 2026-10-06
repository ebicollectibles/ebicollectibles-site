/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { AnnouncementBar } from '~/components/AnnouncementBar'
import { Header } from '~/components/Header'
import { Footer } from '~/components/Footer'
import { CartProvider } from '~/lib/cart-context'
import { getProducts } from '~/server/products'
import { getCurrentCustomer } from '~/server/customer-auth'
import { isAdminAuthenticated } from '~/server/admin-auth'
import { hasMyAffiliate } from '~/server/affiliate-dashboard'
import { isMaintenanceMode } from '~/server/maintenance'
import { AFFILIATE_REF_COOKIE } from '~/lib/affiliate-ref'
import appCss from '~/styles/app.css?url'

// Not secret — a GA4 measurement ID is meant to be visible in the page
// source, same as a Stripe publishable key. Unset locally by default so
// dev traffic never pollutes real analytics; set as a GitHub Actions
// repository *variable* for production (see README-DEPLOY.md).
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

const SITE_URL = 'https://ebicollectibles.com'

export const Route = createRootRoute({
  loader: async () => {
    const [products, customer, maintenanceMode] = await Promise.all([getProducts(), getCurrentCustomer(), isMaintenanceMode()])
    // Only checked once a customer session exists — skips the extra
    // lookups entirely for the (vast majority of) anonymous visitors, who
    // can never be an admin or an affiliate anyway.
    const [isAdmin, isAffiliate] = customer ? await Promise.all([isAdminAuthenticated(), hasMyAffiliate()]) : [false, false]
    return { products, customer, maintenanceMode, isAdmin, isAffiliate }
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
      // Open Graph / Twitter Card defaults — a leaf route (e.g. a product
      // page) can override any of these by declaring the same property in
      // its own head(); TanStack Router dedupes by name/property, leaf wins.
      // Matters a lot here specifically: most of this store's traffic comes
      // from links shared in Discord, and without these a shared link shows
      // no preview card at all.
      { property: 'og:site_name', content: 'EBI Collectibles' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'EBI Collectibles — Sealed Chinese Pokémon, verified' },
      {
        property: 'og:description',
        content: 'Simplified Chinese Pokémon booster boxes, figures and blind boxes — sourced through authorised distribution and verified before it ships.',
      },
      { property: 'og:image', content: 'https://ebicollectibles.com/assets/ebi-logo.jpg' },
      { property: 'og:url', content: 'https://ebicollectibles.com' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
  const isAdminUser = data?.isAdmin ?? false
  const isAffiliateUser = data?.isAffiliate ?? false
  const maintenanceMode = data?.maintenanceMode ?? false
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const href = useRouterState({ select: (s) => s.location.href })
  const isAdmin = pathname.startsWith('/admin')

  // Captures `?ref=<code>` into a 30-day cookie on any page (a specific
  // product, the shop, anywhere) — re-runs on every navigation (href
  // changes on both pathname and search-param changes), not just on first
  // load, since this is the client-rendered shell and persists across
  // client-side route transitions. Last-touch: a newer ref overwrites an
  // older one. Validating the code against real affiliates happens later,
  // at checkout (resolveAffiliateAttribution) — nothing here needs to be
  // trusted, an unknown code just never matches anything.
  React.useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref')
    const code = ref?.trim().toLowerCase()
    if (!code) return
    document.cookie = `${AFFILIATE_REF_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=lax`
  }, [href])
  // /admin is never gated — the operator needs it working precisely during
  // a maintenance window (running the migration, checking things over)
  // even while the customer-facing site shows "back soon".
  const showMaintenance = maintenanceMode && !isAdmin
  // Self-referencing canonical, stripping any query string (e.g. /shop's
  // filter params) — without this, Search Console treats filtered/param
  // variants of a page as duplicates with no signal for which URL is the
  // "real" one. Leaf routes don't need to override this; the pathname
  // alone is always the right canonical target here.
  const canonicalUrl = pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="canonical" href={canonicalUrl} />
        {/* Skipped on /admin — that's the operator's own traffic, not a visitor to track. */}
        {GA_MEASUREMENT_ID && !isAdmin && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <ClerkProvider>
          <CartProvider products={products}>
            {showMaintenance ? (
              <MaintenancePage />
            ) : isAdmin ? (
              <main>{children}</main>
            ) : (
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
                <AnnouncementBar />
                <Header customer={customer} isAdminUser={isAdminUser} isAffiliateUser={isAffiliateUser} />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </div>
            )}
          </CartProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}

function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontFamily: 'Archivo, Helvetica, sans-serif',
        background: '#ffffff',
      }}
    >
      <img src="/assets/ebi-logo.jpg" alt="EBI Collectibles" style={{ width: 96, height: 96, objectFit: 'contain', mixBlendMode: 'multiply', marginBottom: 20 }} />
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>We'll be back shortly</h1>
      <p style={{ fontSize: 14, color: '#5a6875', maxWidth: 380, marginTop: 10, lineHeight: 1.6 }}>
        We're making some quick improvements to the site. This usually only takes a few minutes — thanks for your patience.
      </p>
    </div>
  )
}
