import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { handleSquareWebhook } from './server/square-webhook'
import { handleResendWebhook } from './server/resend-webhook'
import { handleSitemapRequest } from './server/sitemap'

const startFetch = createStartHandler(defaultStreamHandler)

type ServerEntry = { fetch: RequestHandler<Register> }

// Response headers that carry no risk of breaking anything the site
// actually does — unlike a Content-Security-Policy (which would need
// testing against Square's card iframe and Google Analytics/OAuth from a
// network that can actually reach them), these only restrict what OTHER
// sites can do with a response from this one: embed it in a frame
// (clickjacking), have the browser guess its MIME type, leak the full
// referrer URL to a third party, or reach browser features it never uses.
// Passed through as a plain Headers merge rather than mutating
// response.headers directly, since that throws "immutable headers" on some
// Response implementations once a response is already built.
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)')
  // No includeSubDomains/preload — those apply to every subdomain of
  // ebicollectibles.com, including any that might exist outside this
  // deploy (mail, a future tool) and aren't confirmed HTTPS-only.
  headers.set('Strict-Transport-Security', 'max-age=15552000')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

// Square's refund webhook and Resend's delivery webhook both POST a raw
// signed JSON body directly to a fixed URL — neither can go through
// TanStack's createServerFn RPC mechanism, so they're intercepted here,
// ahead of the normal router-driven request handling.
// A second literal `?` in a URL (e.g. appending "?ref=code" by hand to a
// link that already has its own query string, like "/shop?preorder=true")
// isn't a separate parameter — everything after the first `?` is one query
// string, so the browser hands it through as part of the first param's
// value instead of a second param. The affiliate ref never gets read at
// all in that case, and any param expecting a real type (shop.tsx's
// preorder boolean) sees garbled text instead. Normalizing every `?` after
// the first into `&` and redirecting fixes it for any link built this way,
// on any page, rather than only the one case someone happens to report.
function withNormalizedQueryString(request: Request): Response | null {
  if (request.method !== 'GET') return null
  const rawUrl = request.url
  const firstQ = rawUrl.indexOf('?')
  if (firstQ === -1 || rawUrl.indexOf('?', firstQ + 1) === -1) return null
  const fixedUrl = rawUrl.slice(0, firstQ + 1) + rawUrl.slice(firstQ + 1).replaceAll('?', '&')
  return Response.redirect(fixedUrl, 301)
}

const entry: ServerEntry = {
  async fetch(request, opts) {
    const normalized = withNormalizedQueryString(request)
    if (normalized) return normalized
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/api/webhooks/square') {
      return handleSquareWebhook(request)
    }
    if (request.method === 'POST' && url.pathname === '/api/webhooks/resend') {
      return handleResendWebhook(request)
    }
    // Enumerates live published products from the DB — a static public/
    // file would go stale the moment a product is added or unpublished.
    if (request.method === 'GET' && url.pathname === '/sitemap.xml') {
      return handleSitemapRequest()
    }
    const response = await startFetch(request, opts)
    return withSecurityHeaders(response)
  },
}

export default entry
