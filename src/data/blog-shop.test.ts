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
  it('uses one shared set guide and card origins post for the four Collect 151 releases', () => {
    expect(blogPostSlugsForSetKey('collect-151-surprise')).toEqual(['collect-151-surprise-release-news', 'collect-151-set-guide', 'collect-151-card-origins'])
    expect(blogSetKeyForSetPath('/sets/chinese/collect-151-hope')).toBe('collect-151-hope')
  })
  it('points at posts that exist', () => {
    const known = new Set<string>(BLOG_POSTS.map((p) => p.slug))
    const keys = ['black-bolt', 'white-flare', 'collect-151-journey', 'collect-151-hope', 'collect-151-surprise', 'collect-151-gathering']
    for (const key of keys) expect(blogPostSlugsForSetKey(key).filter((s) => !known.has(s))).toEqual([])
  })
  it('still resolves a set page and a product to their own set', () => {
    expect(blogSetKeyForSetPath('/sets/chinese/black-bolt-csv10-5')).toBe('black-bolt')
    expect(blogSetKeyForProduct('pokemon-chinese-white-flare-slim-booster-box')).toBe('white-flare')
  })
  it('wires up Japanese set pages one by one, so a shared name never picks up the Chinese set', () => {
    expect(blogSetKeyForSetPath('/sets/japanese/aura-seeker-m7')).toBe('aura-seeker')
    expect(blogSetKeyForSetPath('/sets/japanese/30th-celebration-m6a')).toBeNull()
    expect(blogSetKeyForProduct('pokemon-japanese-aura-seeker-m7-booster-box')).toBe('aura-seeker')
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
