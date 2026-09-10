import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { handleSquareWebhook } from './server/square-webhook'
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

// Square's refund webhook POSTs a raw signed JSON body directly to a fixed
// URL — it can't go through TanStack's createServerFn RPC mechanism, so it's
// intercepted here, ahead of the normal router-driven request handling.
const entry: ServerEntry = {
  async fetch(request, opts) {
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/api/webhooks/square') {
      return handleSquareWebhook(request)
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
