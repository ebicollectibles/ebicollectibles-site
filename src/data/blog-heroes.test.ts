import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BLOG_POSTS } from './blog-posts'

// BlogPostLayout serves `<banner>-800.webp` to phones (srcset). Every banner
// needs that smaller copy next to it, or phones would get a broken image.
describe('blog banners', () => {
  it('have an 800px copy for every heroImage', () => {
    const missing = BLOG_POSTS.map((p) => p.heroImage.replace(/^https?:\/\/[^/]+/, 'public').replace(/\.webp$/, '-800.webp')).filter(
      (f) => !existsSync(f),
    )
    expect(missing).toEqual([])
  })
})
