import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { assertAdmin, isAdminAuthenticated } from './admin-auth'

// Live/draft state for blog posts (see blogPostStatus in lib/db/schema.ts).
// Reads never throw: if the table is missing or the DB is unreachable every
// post is treated as a draft, which is the safe default (noindex, hidden).

export type BlogLiveMap = Record<string, string> // slug -> liveAt (ISO)

export async function readLiveMap(): Promise<BlogLiveMap> {
  try {
    const { getDb } = await import('~/lib/db/client')
    const { blogPostStatus } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const rows = await getDb()
      .select({ slug: blogPostStatus.slug, liveAt: blogPostStatus.liveAt })
      .from(blogPostStatus)
      .where(eq(blogPostStatus.live, true))
    const map: BlogLiveMap = {}
    for (const r of rows) map[r.slug] = (r.liveAt ?? new Date()).toISOString()
    return map
  } catch (err) {
    console.error('[blog-status] could not read blog_post_status', err)
    return {}
  }
}

/** Public: the live posts and when each went live. */
export const getBlogLiveMap = createServerFn({ method: 'GET' }).handler(() => readLiveMap())

/** Public: one post's state, for its head (robots) and "Updated" date. */
export const getBlogPostStatus = createServerFn({ method: 'GET' })
  .validator(z.string().min(1).max(200))
  .handler(async ({ data: slug }) => {
    const map = await readLiveMap()
    return { live: slug in map, liveAt: map[slug] ?? null }
  })

/** /blog list: live posts for everyone; admins also see drafts, labelled. */
export const getBlogListState = createServerFn({ method: 'GET' }).handler(async () => {
  const [live, isAdmin] = await Promise.all([readLiveMap(), isAdminAuthenticated().catch(() => false)])
  return { live, isAdmin }
})

/** Admin: put a post live or back to draft. */
export const adminSetBlogPostLive = createServerFn({ method: 'POST' })
  .validator(z.object({ slug: z.string().min(1).max(200), live: z.boolean() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const { BLOG_POSTS } = await import('~/data/blog-posts')
    if (!BLOG_POSTS.some((p) => p.slug === data.slug)) throw new Error('Unknown post')
    const { getDb } = await import('~/lib/db/client')
    const { blogPostStatus } = await import('~/lib/db/schema')
    const now = new Date()
    await getDb()
      .insert(blogPostStatus)
      .values({ slug: data.slug, live: data.live, liveAt: data.live ? now : null, updatedAt: now })
      .onConflictDoUpdate({
        target: blogPostStatus.slug,
        set: { live: data.live, liveAt: data.live ? now : null, updatedAt: now },
      })
    return { ok: true }
  })
