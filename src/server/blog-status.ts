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

/** A store product as the blog's shop panels show it. */
export type BlogShopProduct = {
  id: string
  name: string
  price: number
  stock: number
  preorder: boolean
  comingSoon: boolean
  hidePrice: boolean
  img: string | null
  imgAlt: string | null
  variantLabel: string | null
}

// Live price and stock for the products a post sells (see data/blog-shop.ts).
// Never throws: on any error the post just shows no product tiles.
async function readShopProducts(slug: string): Promise<BlogShopProduct[]> {
  try {
    const { blogShopProductIds } = await import('~/data/blog-shop')
    const ids = blogShopProductIds(slug)
    if (ids.length === 0) return []
    const { getDb } = await import('~/lib/db/client')
    const { products } = await import('~/lib/db/schema')
    const { inArray } = await import('drizzle-orm')
    const { overlaySquareData } = await import('./square')
    const rows = await getDb().select().from(products).where(inArray(products.id, ids))
    const live = await overlaySquareData(
      rows
        .filter((r) => r.published)
        .map((r) => ({
          id: r.id,
          name: r.name,
          price: r.price,
          stock: r.stock,
          squareVariationId: r.squareVariationId,
          preorder: r.preorder,
          comingSoon: r.comingSoon,
          hidePrice: r.hidePrice,
          img: r.img,
          imgAlt: r.imgAlt,
          variantLabel: r.variantLabel,
        })),
    )
    return ids
      .map((id) => live.find((p) => p.id === id))
      .filter((p): p is (typeof live)[number] => !!p)
      .map(({ squareVariationId: _sq, ...p }) => p)
  } catch (err) {
    console.error('[blog-status] could not read shop products', err)
    return []
  }
}

/** Public: one post's state, for its head (robots) and "Updated" date, plus the products it sells. */
export const getBlogPostStatus = createServerFn({ method: 'GET' })
  .validator(z.string().min(1).max(200))
  .handler(async ({ data: slug }) => {
    const [map, shop] = await Promise.all([readLiveMap(), readShopProducts(slug)])
    return { live: slug in map, liveAt: map[slug] ?? null, shop }
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

export type BlogGuideLink = { path: string; title: string; tag: string }

/**
 * Public: the live blog posts about one set, for linking from its set page
 * or product page. Pass a set page path or a product id. Release news first,
 * then the set guide, then card origins. Never throws.
 */
export const getBlogGuidesFor = createServerFn({ method: 'GET' })
  .validator(z.object({ setPath: z.string().max(200).optional(), productId: z.string().max(200).optional() }))
  .handler(async ({ data }): Promise<BlogGuideLink[]> => {
    try {
      const { blogSetKeyForProduct, blogSetKeyForSetPath } = await import('~/data/blog-shop')
      const key = data.productId ? blogSetKeyForProduct(data.productId) : data.setPath ? blogSetKeyForSetPath(data.setPath) : null
      if (!key) return []
      const { BLOG_POSTS } = await import('~/data/blog-posts')
      const live = await readLiveMap()
      const order = ['release-news', 'set-guide', 'card-origins']
      return BLOG_POSTS.filter((p) => p.slug in live && order.some((k) => p.slug === `${key}-${k}`))
        .sort((a, b) => order.findIndex((k) => a.slug.endsWith(k)) - order.findIndex((k) => b.slug.endsWith(k)))
        .map((p) => ({ path: p.path, title: p.title, tag: p.tag }))
    } catch {
      return []
    }
  })
