import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { shortLinks } from '~/lib/db/schema'

const SITE_URL = 'https://ebicollectibles.com'

// Looks up a /go/{slug} redirect and bumps its click count in the same
// query (UPDATE ... RETURNING) — one round trip, no separate read-then-
// write. Public/unauthenticated by design, same as getProduct: anyone with
// the link is meant to be able to follow it. Returns null for an unknown
// slug so the route can fall back to the homepage instead of erroring.
export const resolveShortLink = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<{ url: string } | null> => {
    const db = getDb()
    const [row] = await db
      .update(shortLinks)
      .set({ clickCount: sql`${shortLinks.clickCount} + 1` })
      .where(eq(shortLinks.slug, data.slug))
      .returning()
    if (!row) return null

    const params = new URLSearchParams()
    if (row.utmSource) params.set('utm_source', row.utmSource)
    if (row.utmMedium) params.set('utm_medium', row.utmMedium)
    if (row.utmCampaign) params.set('utm_campaign', row.utmCampaign)
    const query = params.toString()

    const base = row.destinationPath.startsWith('http') ? row.destinationPath : `${SITE_URL}${row.destinationPath}`
    const separator = base.includes('?') ? '&' : '?'
    return { url: query ? `${base}${separator}${query}` : base }
  })
