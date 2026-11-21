import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BLOG_POSTS, blogShareImage } from './blog-posts'
import { GEM_SETS } from './gem-sets-index'
import { JAPANESE_SETS } from './japanese-sets-index'
import shareProductIds from './share-products.json'
import shareProductOverrides from './share-product-overrides.json'

// Link previews (og:image) point at wide JPG cards in public/assets/share.
// A missing file would mean a blank preview wherever the page is shared.
const local = (url: string) => url.replace(/^https?:\/\/[^/]+/, 'public')

describe('link preview images', () => {
  it('exist for every blog post', () => {
    expect(BLOG_POSTS.map((p) => local(blogShareImage(p))).filter((f) => !existsSync(f))).toEqual([])
  })
  it('exist for every set list', () => {
    expect(GEM_SETS.map((s) => `public/assets/share/set-${s.slug}.jpg`).filter((f) => !existsSync(f))).toEqual([])
  })
  it('exist for every Japanese set list, drafts included', () => {
    expect(JAPANESE_SETS.map((s) => `public/assets/share/set-${s.path.split('/').pop()}.jpg`).filter((f) => !existsSync(f))).toEqual([])
  })
  it('exist for every product listed in share-products.json', () => {
    expect((shareProductIds as string[]).map((id) => `public/assets/share/product-${id}.jpg`).filter((f) => !existsSync(f))).toEqual([])
  })
  it('exist for every product share image override', () => {
    expect(Object.values(shareProductOverrides as Record<string, string>).map((f) => `public/assets/share/${f}`).filter((f) => !existsSync(f))).toEqual([])
  })
  it('exist for the site, shop, binders shelf, set index and blog index', () => {
    expect(['site', 'shop', 'shop-binders', 'sets', 'blog'].map((n) => `public/assets/share/${n}.jpg`).filter((f) => !existsSync(f))).toEqual([])
  })
})
