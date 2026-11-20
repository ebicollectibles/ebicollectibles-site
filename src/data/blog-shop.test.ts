import { describe, expect, it } from 'vitest'
import { BLOG_POSTS } from './blog-posts'
import { blogPostSlugsForSetKey, blogSetKeyForProduct, blogSetKeyForSetPath, companionProductIds } from './blog-shop'

describe('blog posts linked from set and product pages', () => {
  it('uses the shared release post for Black Bolt and White Flare', () => {
    expect(blogPostSlugsForSetKey('black-bolt')).toEqual(['black-bolt-white-flare-release-news', 'black-bolt-set-guide', 'black-bolt-card-origins'])
    expect(blogPostSlugsForSetKey('white-flare')[0]).toBe('black-bolt-white-flare-release-news')
  })
  it('uses the set\'s own release post everywhere else', () => {
    expect(blogPostSlugsForSetKey('gem-vol-7')).toEqual(['gem-vol-7-release-news', 'gem-vol-7-set-guide', 'gem-vol-7-card-origins'])
  })
  it('points at posts that exist', () => {
    const known = new Set<string>(BLOG_POSTS.map((p) => p.slug))
    for (const key of ['black-bolt', 'white-flare']) expect(blogPostSlugsForSetKey(key).filter((s) => !known.has(s))).toEqual([])
  })
  it('still resolves a set page and a product to their own set', () => {
    expect(blogSetKeyForSetPath('/sets/chinese/black-bolt-csv10-5')).toBe('black-bolt')
    expect(blogSetKeyForProduct('pokemon-chinese-white-flare-slim-booster-box')).toBe('white-flare')
  })
})

describe('companionProductIds', () => {
  it('pairs the Gem Pack Vol. 7 booster box with its Psyduck binder, both ways', () => {
    const box = 'pokemon-chinese-gem-volume-7-booster-box'
    const binder = 'pokemon-chinese-gem-volume-7-psyduck-collector-binder'
    expect(companionProductIds(box)).toEqual([binder])
    expect(companionProductIds(binder)).toEqual([box])
    expect(companionProductIds('pokemon-chinese-gem-volume-6-booster-box')).toEqual([])
  })
})
