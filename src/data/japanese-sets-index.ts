// Japanese set card lists, shown on /sets/japanese and in the sitemap.
// `draft: true` keeps a set out of both (its own page should then also set
// noindex in its config).

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

export const JAPANESE_SETS: JapaneseSetSummary[] = [
  {
    slug: 'storm-emeralda-m6',
    path: '/sets/japanese/storm-emeralda-m6',
    name: 'Storm Emeralda',
    nameJa: '拡張パック「ストームエメラルダ」',
    series: 'Japanese Mega Evolution',
    code: 'M6',
    cardCount: 113,
    releaseDate: '2026-07-31',
    tagline: 'Mega Rayquaza ex, and the Japanese set behind Delta Reign',
    heroImage: 'https://www.pokemon-card.com/assets/images/card_images/large/M6/050551_P_MREKKUUZAIEKKUSU.jpg',
    heroAlt: 'Mega Rayquaza ex 110/076, Special Art Rare',
    packImage: { src: '/assets/sets/packs/jp-storm-emeralda-m6.webp', w: 376, h: 760 },
    glow1: 'rgb(28 120 82 / .30)',
    glow2: 'rgb(70 150 170 / .24)',
    draft: false,
  },
  {
    slug: '30th-celebration-m6a',
    path: '/sets/japanese/30th-celebration-m6a',
    name: '30th Celebration',
    nameJa: 'ポケモンカードゲーム MEGA 拡張パック「30th CELEBRATION」',
    series: 'Japanese Mega Evolution',
    code: 'M6a',
    cardCount: 173,
    releaseDate: '2026-09-16',
    tagline: '30 different Pikachu, 30 classic reprints and 2 Futuristic Rares',
    heroImage: 'https://www.pokemon-card.com/assets/images/card_images/large/M6a/050956_P_PIKACHIXYUUIEKKUSU.jpg',
    heroAlt: 'Pikachu ex 126/103, Special Art Rare',
    packImage: { src: '/assets/sets/packs/jp-30th-celebration-m6a.webp', w: 376, h: 760 },
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .25)',
    draft: false,
  },
  {
    slug: 'aura-seeker-m7',
    path: '/sets/japanese/aura-seeker-m7',
    name: 'Aura Seeker',
    nameJa: '拡張パック「ハドウシーカー」',
    series: 'Japanese Mega Evolution',
    code: 'M7',
    // 78-card main set plus 36 secret rares (079-114).
    cardCount: 114,
    releaseDate: '2026-11-27',
    tagline: 'Mega Lucario Z ex leads, with a gold Mega Ultra Rare',
    heroImage: '/assets/sets/cards/jp-m7/110.webp',
    heroAlt: 'Mega Lucario Z ex 110/078, Special Art Rare',
    packImage: { src: '/assets/sets/packs/jp-aura-seeker-m7.webp', w: 376, h: 760 },
    glow1: 'rgb(40 90 180 / .30)',
    glow2: 'rgb(60 40 120 / .25)',
    draft: false,
  },
]

/** Sets that are switched on: listed and in the sitemap. */
export const LIVE_JAPANESE_SETS = JAPANESE_SETS.filter((s) => !s.draft)
