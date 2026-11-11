// Curated summary of every Gem Set card-list page, for the /sets index.
// Pulled from each set's own data file + route config at the time this
// was written — not derived live, since it's just a handful of editorial
// facts (tagline, which card to show) that don't change once a set ships.
// The exact literal route paths TanStack Router registers for these
// pages (src/routes/sets/gem-vol-N.tsx) — typed this way, rather than
// built from `slug` at render time, so <Link to={...}> stays type-safe
// without a cast.
export type GemSetRoutePath =
  | '/sets/gem-vol-1'
  | '/sets/gem-vol-2'
  | '/sets/gem-vol-3'
  | '/sets/gem-vol-4'
  | '/sets/gem-vol-5'
  | '/sets/gem-vol-6'
  | '/sets/gem-vol-7'
  | '/sets/black-bolt'
  | '/sets/white-flare'

export interface GemSetSummary {
  slug: string
  path: GemSetRoutePath
  name: string
  series: string // shown as a small tag, since this list now mixes Chen's own "Gem Set" releases with real officially-licensed sets
  cardCount: number
  releaseDate: string
  exclusiveCount: number
  tagline: string
  heroImage: string
  heroAlt: string
  glow1: string
  glow2: string
  preorder?: boolean
}

export const GEM_SETS: GemSetSummary[] = [
  {
    slug: 'black-bolt',
    path: '/sets/black-bolt',
    name: 'Black Bolt',
    series: 'Chinese Scarlet & Violet',
    cardCount: 174,
    releaseDate: '2026-11-06',
    exclusiveCount: 1,
    tagline: "Zekrom ex and half the Unova Pokédex",
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Black%20Bolt/Cards/0174.webp',
    heroAlt: 'Zekrom ex Black White Rare',
    glow1: 'rgb(119 167 201 / .30)',
    glow2: 'rgb(72 121 119 / .25)',
  },
  {
    slug: 'white-flare',
    path: '/sets/white-flare',
    name: 'White Flare',
    series: 'Chinese Scarlet & Violet',
    cardCount: 174,
    releaseDate: '2026-11-06',
    exclusiveCount: 1,
    tagline: "Reshiram ex and the other half of Unova",
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/White%20Flare/Cards/0174.webp',
    heroAlt: 'Reshiram ex Black White Rare',
    glow1: 'rgb(171 49 42 / .30)',
    glow2: 'rgb(219 172 132 / .22)',
  },
  {
    slug: 'gem-vol-7',
    path: '/sets/gem-vol-7',
    name: 'Gem Vol 7',
    series: 'Gem Set',
    cardCount: 196,
    releaseDate: '2026-11-06',
    exclusiveCount: 1,
    tagline: "Misty's Psyduck and the full 28-Pokémon roster",
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0307.webp',
    heroAlt: "Misty's Psyduck full art",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
    preorder: true,
  },
  {
    slug: 'gem-vol-6',
    path: '/sets/gem-vol-6',
    name: 'Gem Vol 6',
    series: 'Gem Set',
    cardCount: 196,
    releaseDate: '2026-08-07',
    exclusiveCount: 1,
    tagline: 'An apple-orchard lineup led by Applin',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%206/Cards/1907.webp',
    heroAlt: 'Applin full art',
    glow1: 'rgb(199 22 116 / .30)',
    glow2: 'rgb(78 119 104 / .25)',
  },
  {
    slug: 'gem-vol-5',
    path: '/sets/gem-vol-5',
    name: 'Gem Vol 5',
    series: 'Gem Set',
    cardCount: 196,
    releaseDate: '2026-04-24',
    exclusiveCount: 4,
    tagline: 'Four Pokémon Horizons anime exclusives',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%205/Cards/0107.webp',
    heroAlt: 'Captain Pikachu full art',
    glow1: 'rgb(197 24 116 / .30)',
    glow2: 'rgb(230 191 61 / .22)',
  },
  {
    slug: 'gem-vol-4',
    path: '/sets/gem-vol-4',
    name: 'Gem Vol 4',
    series: 'Gem Set',
    cardCount: 196,
    releaseDate: '2026-02-06',
    exclusiveCount: 1,
    tagline: 'An evenly mixed lineup from Ponyta to Flutter Mane',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%204/Cards/0107.webp',
    heroAlt: 'Ponyta full art',
    glow1: 'rgb(198 23 117 / .30)',
    glow2: 'rgb(208 129 105 / .25)',
  },
  {
    slug: 'gem-vol-3',
    path: '/sets/gem-vol-3',
    name: 'Gem Vol 3',
    series: 'Gem Set',
    cardCount: 136,
    releaseDate: '2025-09-26',
    exclusiveCount: 5,
    tagline: 'A Halloween night-town set with Pokémon ex',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/0307.webp',
    heroAlt: 'Gengar full art',
    glow1: 'rgb(196 26 118 / .30)',
    glow2: 'rgb(214 169 151 / .25)',
  },
  {
    slug: 'gem-vol-2',
    path: '/sets/gem-vol-2',
    name: 'Gem Vol 2',
    series: 'Gem Set',
    cardCount: 140,
    releaseDate: '2025-05-16',
    exclusiveCount: 4,
    tagline: 'Eevee and all 8 Eeveelutions, with V and VMAX',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%202/Cards/0115.webp',
    heroAlt: 'Eevee full art',
    glow1: 'rgb(194 23 116 / .30)',
    glow2: 'rgb(86 134 135 / .25)',
  },
  {
    slug: 'gem-vol-1',
    path: '/sets/gem-vol-1',
    name: 'Gem Vol 1',
    series: 'Gem Set',
    cardCount: 115,
    releaseDate: '2025-01-17',
    exclusiveCount: 4,
    tagline: 'The first Gem set — Paldea starters & Captain Pikachu',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%201/Cards/0709.webp',
    heroAlt: 'Captain Pikachu full art',
    glow1: 'rgb(194 26 118 / .30)',
    glow2: 'rgb(151 202 224 / .22)',
  },
]
