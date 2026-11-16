// Dynamic sitemap.xml — intercepted directly in src/server.ts, same reason
// as the Square webhook: this needs to enumerate live published products
// from the DB, so a static public/ file would go stale the moment a
// product is added, removed, or unpublished.

const SITE_URL = 'https://ebicollectibles.com'

const STATIC_PATHS = ['', '/shop', '/sets', '/sets/chinese', '/shipping-policy', '/refund-policy', '/privacy', '/cookie-policy', '/terms-of-service']

function xmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function handleSitemapRequest(): Promise<Response> {
  const { getDb } = await import('~/lib/db/client')
  const { products } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const { GEM_SETS } = await import('~/data/gem-sets-index')
  const db = getDb()

  const rows = await db
    .select({ id: products.id, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.published, true))

  const { readLiveMap } = await import('~/server/blog-status')
  const { BLOG_POSTS } = await import('~/data/blog-posts')
  const live = await readLiveMap()
  const livePosts = BLOG_POSTS.filter((p) => p.slug in live)
  const blogUrls = livePosts.length
    ? [
        `<url><loc>${xmlEscape(`${SITE_URL}/blog`)}</loc></url>`,
        ...livePosts.map((p) => `<url><loc>${xmlEscape(SITE_URL + p.path)}</loc><lastmod>${live[p.slug].slice(0, 10)}</lastmod></url>`),
      ]
    : []

  const urls = [
    ...STATIC_PATHS.map((path) => `<url><loc>${xmlEscape(SITE_URL + path)}</loc></url>`),
    ...rows.map(
      (r) =>
        `<url><loc>${xmlEscape(`${SITE_URL}/products/${r.id}`)}</loc><lastmod>${r.updatedAt.toISOString().slice(0, 10)}</lastmod></url>`,
    ),
    // Every set's own card-list page — these were missing from the
    // sitemap entirely despite being full, content-rich, indexable pages
    // (reachable from /sets, just never previously declared here).
    ...GEM_SETS.map((s) => `<url><loc>${xmlEscape(`${SITE_URL}${s.path}`)}</loc></url>`),
    // Blog: only posts switched live in /admin/blog, plus the list once any are.
    ...blogUrls,
  ].join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
