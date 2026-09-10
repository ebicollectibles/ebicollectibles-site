// Dynamic sitemap.xml — intercepted directly in src/server.ts, same reason
// as the Square webhook: this needs to enumerate live published products
// from the DB, so a static public/ file would go stale the moment a
// product is added, removed, or unpublished.

const SITE_URL = 'https://ebicollectibles.com'

const STATIC_PATHS = ['', '/shop', '/shipping-returns', '/privacy']

function xmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function handleSitemapRequest(): Promise<Response> {
  const { getDb } = await import('~/lib/db/client')
  const { products } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()

  const rows = await db
    .select({ id: products.id, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.published, true))

  const urls = [
    ...STATIC_PATHS.map((path) => `<url><loc>${xmlEscape(SITE_URL + path)}</loc></url>`),
    ...rows.map(
      (r) =>
        `<url><loc>${xmlEscape(`${SITE_URL}/products/${r.id}`)}</loc><lastmod>${r.updatedAt.toISOString().slice(0, 10)}</lastmod></url>`,
    ),
  ].join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
