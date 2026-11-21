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
    draft: true,
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
    draft: true,
  },
  {
    slug: 'aura-seeker-m7',
    path: '/sets/japanese/aura-seeker-m7',
    name: 'Aura Seeker',
    nameJa: '拡張パック「ハドウシーカー」',
    series: 'Japanese Mega Evolution',
    code: 'M7',
    // Cards known so far: the 78-card main set and the one secret rare
    // shown (113/078). The full list is not out yet.
    cardCount: 79,
    releaseDate: '2026-11-27',
    tagline: 'Mega Lucario Z ex leads; full list not out yet',
    heroImage: 'https://www.pokemon-card.com/assets/images/card_images/large/M7/050912_P_MRUKARIOZETTOIEKKUSU.jpg',
    heroAlt: 'Mega Lucario Z ex 057/078, Double Rare',
    packImage: { src: '/assets/sets/packs/jp-aura-seeker-m7.webp', w: 376, h: 760 },
    glow1: 'rgb(40 90 180 / .30)',
    glow2: 'rgb(60 40 120 / .25)',
    draft: true,
  },
]
