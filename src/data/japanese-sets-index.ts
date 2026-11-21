// Japanese set card lists. While a set here is a draft (`draft: true`), its
// page is noindex, it is left out of the sitemap, and nothing on the site
// links to it; the Japanese index page itself is noindex until the owner
// switches the section on.

export interface JapaneseSetSummary {
  slug: string
  path: string // e.g. '/sets/japanese/aura-seeker'
  name: string // English name used by English-language sites
  nameJa: string // official Japanese name
  series: string
  code: string // the set's own code, matching its data file
  cardCount: number
  releaseDate: string
  tagline: string
  heroImage: string
  heroAlt: string
  packImage?: { src: string; w: number; h: number }
  glow1: string
  glow2: string
  draft: boolean
}

export const JAPANESE_SETS: JapaneseSetSummary[] = []
