import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { handleSquareWebhook } from './server/square-webhook'
import { handleResendWebhook } from './server/resend-webhook'
import { handleSitemapRequest } from './server/sitemap'
import { CSP_REPORT_ONLY, CSP_REPORT_PATH, handleCspReport } from './server/csp'
import { REMOVED_PAGE_HTML, isRemovedOldSetPath } from './lib/old-set-paths'
import { handleOneClickUnsubscribe } from './server/unsubscribe'

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
  // Report-only: browsers report what this policy would block and block
  // nothing. See src/server/csp.ts.
  headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY)
  // Lets Google show a large image preview (the picture beside a result,
  // and in Discover). Google combines this with each page's own robots
  // meta tag, so a noindex page stays noindex. Pages that set their own
  // X-Robots-Tag keep it.
  if (!headers.has('X-Robots-Tag') && (headers.get('content-type') ?? '').includes('text/html')) {
    headers.set('X-Robots-Tag', 'max-image-preview:large')
  }
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
    // Some AI tools ask for pages as Markdown only (Accept: text/markdown).
    // There's no Markdown version, and answering 406 gives them nothing, so
    // they get the normal HTML page like everyone else.
    const accept = request.headers.get('accept') ?? ''
    if (request.method === 'GET' && /text\/markdown/i.test(accept) && !/text\/html|\*\/\*/i.test(accept)) {
      const headers = new Headers(request.headers)
      headers.set('accept', 'text/html')
      request = new Request(request, { headers })
    }
    if (request.method === 'POST' && url.pathname === '/api/webhooks/square') {
      return handleSquareWebhook(request)
    }
    if (request.method === 'POST' && url.pathname === '/api/webhooks/resend') {
      return handleResendWebhook(request)
    }
    // Google Search Console ownership check. Served from here and not as a
    // static file because static .html files are redirected to their
    // extensionless address, and Google wants this exact address to answer
    // directly. It must stay for the site to remain verified.
    if (request.method === 'GET' && url.pathname === '/googlebf98bffc1bcc2bc8.html') {
      return new Response('google-site-verification: googlebf98bffc1bcc2bc8.html', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      })
    }
    // Gmail/Yahoo one-click unsubscribe from a list email (RFC 8058). See
    // server/unsubscribe.ts.
    if (request.method === 'POST' && url.pathname === '/api/unsubscribe') {
      return handleOneClickUnsubscribe(request)
    }
    if (request.method === 'POST' && url.pathname === CSP_REPORT_PATH) {
      return handleCspReport(request)
    }
    // Old set addresses (/sets/gem-vol-4?card=...) from before the set
    // pages moved to /sets/chinese/. The owner chose to retire them rather
    // than redirect, so they answer 410 Gone and Google drops them. See
    // lib/old-set-paths.ts.
    // /hello-world/ is a leftover from an old WordPress site on this domain.
    if ((request.method === 'GET' || request.method === 'HEAD') && (isRemovedOldSetPath(url.pathname) || /^\/hello-world\/?$/.test(url.pathname))) {
      return withSecurityHeaders(
        new Response(request.method === 'HEAD' ? null : REMOVED_PAGE_HTML, {
          status: 410,
          headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'public, max-age=3600' },
        }),
      )
    }
    // Enumerates live published products from the DB — a static public/
    // file would go stale the moment a product is added or unpublished.
    if (request.method === 'GET' && url.pathname === '/sitemap.xml') {
      return handleSitemapRequest()
    }
    const response = await startFetch(request, opts)
    // Emailed order and email-preference links carry their key in the URL:
    // never cache the page anywhere, keep it out of search, and don't send
    // the address on to sites linked from it (carrier tracking pages).
    if (url.pathname.startsWith('/orders/') || url.pathname === '/email-preferences' || url.pathname === '/unsubscribe') {
      const secured = withSecurityHeaders(response)
      secured.headers.set('Cache-Control', 'private, no-store')
      secured.headers.set('X-Robots-Tag', 'noindex, nofollow')
      secured.headers.set('Referrer-Policy', 'no-referrer')
      return secured
    }
    return withSecurityHeaders(response)
  },
}

export default entry
