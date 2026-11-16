// Which store products each blog post sells, keyed by the set part of the
// post slug (the slug minus -release-news / -set-guide / -card-origins).
// Order is display order: slim before jumbo, single box before case.
// A set with no listing (e.g. Stellar Crystal today) just has no entry and
// its posts fall back to the card list link.
const SET_PRODUCTS: Record<string, string[]> = {
  'gem-vol-2': ['pokemon-chinese-gem-volume-2-booster-box'],
  'gem-vol-3': ['pokemon-chinese-gem-volume-3-booster-box'],
  'gem-vol-4': ['pokemon-chinese-gem-volume-4-booster-box'],
  'gem-vol-5': ['pokemon-chinese-gem-volume-5-booster-box'],
  'gem-vol-6': ['pokemon-chinese-gem-volume-6-booster-box'],
  'gem-vol-7': ['pokemon-chinese-gem-volume-7-booster-box'],
  '30th-celebration': ['pokemon-chinese-30th-celebration-booster-box'],
  'reward-round': ['pokemon-chinese-reward-round-booster-box'],
  'black-crystal-blaze': ['pokemon-chinese-black-crystal-blaze-booster-box', 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box'],
  'true-mystery': ['pokemon-chinese-true-mystery-slim-booster-box', 'pokemon-chinese-true-mystery-jumbo-booster-box'],
  'blade-awakening': ['pokemon-chinese-blade-awakening-slim-booster-box', 'pokemon-chinese-blade-awakening-jumbo-booster-box'],
  'brilliant-fantasy': ['pokemon-chinese-brilliant-fantasy-slim-booster-box', 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box'],
  'terastal-gathering': ['pokemon-chinese-terastal-gathering-booster-box'],
  'chasing-glory': ['pokemon-chinese-chasing-glory-slim-booster-box', 'pokemon-chinese-chasing-glory-jumbo-booster-box'],
  'black-bolt': ['pokemon-chinese-black-bolt-slim-booster-box', 'pokemon-chinese-black-bolt-jumbo-booster-box'],
  'white-flare': ['pokemon-chinese-white-flare-slim-booster-box', 'pokemon-chinese-white-flare-jumbo-booster-box'],
  'funism-ditto-palm-size-wonders': [
    'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box',
    'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box-case',
  ],
  'pikachu-dream-painting-figures': [
    'pokemon-chinese-pikachu-30th-celebration-figures-blind-box',
    'pokemon-chinese-pikachu-30th-celebration-figures-blind-box-case',
  ],
}

export function blogShopProductIds(slug: string): string[] {
  return SET_PRODUCTS[slug.replace(/-(release-news|set-guide|card-origins)$/, '')] ?? []
}

/** The set key ('gem-vol-7', 'chasing-glory') for a set page path like /sets/chinese/chasing-glory-csv10. */
export function blogSetKeyForSetPath(path: string): string | null {
  const m = path.match(/^\/sets\/chinese\/([^/?#]+)/)
  return m ? m[1].replace(/-csv[0-9-]+$/, '') : null
}

/** The set key for a store product, if any blog set sells it. */
export function blogSetKeyForProduct(productId: string): string | null {
  for (const [key, ids] of Object.entries(SET_PRODUCTS)) if (ids.includes(productId)) return key
  return null
}
