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
  | '/sets/30th-celebration'
  | '/sets/csv10'
  | '/sets/csv9-5'
  | '/sets/csv4'
  | '/sets/csv5'
  | '/sets/csv6'

export interface GemSetSummary {
  slug: string
  path: GemSetRoutePath
  name: string
  series: string // shown as a small tag, since this list now mixes Chen's own "Gem Set" releases with real officially-licensed sets
  code: string // the set's own code, e.g. "CSV10.5C", matching each set's own data file
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
    slug: '30th-celebration',
    path: '/sets/30th-celebration',
    name: '30th Celebration',
    series: '30th Anniversary Special Set',
    code: '30thC',
    cardCount: 206,
    releaseDate: '2026-09-16',
    exclusiveCount: 0,
    tagline: '100 Pokémon, 30 classic reprints and the Pikachu Rare tier',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0126.webp',
    heroAlt: 'Pikachu ex Special Art Rare',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .25)',
  },
  {
    slug: 'csv4',
    path: '/sets/csv4',
    name: 'Reward Round',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV4C',
    cardCount: 165,
    releaseDate: '2025-07-18',
    exclusiveCount: 2,
    tagline: '114 Pokémon led by a gold Gholdengo ex',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0156.webp',
    heroAlt: 'Gholdengo ex Special Art Rare',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(179 130 68 / .25)',
  },
  {
    slug: 'csv5',
    path: '/sets/csv5',
    name: 'Black Crystal Blaze',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV5C',
    cardCount: 164,
    releaseDate: '2025-09-12',
    exclusiveCount: 1,
    tagline: '113 Pokémon led by a gold Charizard ex',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Dark%20Crystal%20Blaze%20CSV5/Cards/0155.webp',
    heroAlt: 'Charizard ex Special Art Rare',
    glow1: 'rgb(161 23 57 / .30)',
    glow2: 'rgb(44 35 47 / .25)',
  },
  {
    slug: 'csv6',
    path: '/sets/csv6',
    name: 'True Mystery',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV6C',
    cardCount: 163,
    releaseDate: '2025-11-07',
    exclusiveCount: 1,
    tagline: '113 Pokémon led by a gold Roaring Moon ex',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/True%20Mystic/Cards/0155.webp',
    heroAlt: 'Roaring Moon ex Special Art Rare',
    glow1: 'rgb(64 58 113 / .30)',
    glow2: 'rgb(40 133 151 / .25)',
  },
  {
    slug: 'csv9-5',
    path: '/sets/csv9-5',
    name: 'Terastal Gathering',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV9.5C',
    cardCount: 259,
    releaseDate: '2026-06-12',
    exclusiveCount: 1,
    tagline: '156 Pokémon in an Eeveelution-heavy special set',
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Crystal%20Gathering/Cards/0239.webp',
    heroAlt: 'Umbreon ex Special Art Rare',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'csv10',
    path: '/sets/csv10',
    name: 'Chasing Glory',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV10C',
    cardCount: 287,
    releaseDate: '2026-07-16',
    exclusiveCount: 1,
    tagline: "188 Pokémon led by Team Rocket, the main CSV10 set",
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Chasing%20Glory/Cards/0268.webp',
    heroAlt: "Team Rocket's Mewtwo ex Special Art Rare",
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(29 16 19 / .25)',
  },
  {
    slug: 'black-bolt',
    path: '/sets/black-bolt',
    name: 'Black Bolt',
    series: 'Chinese Scarlet & Violet',
    code: 'CSV10.5C',
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
    code: 'CSV10.6C',
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
    code: 'CBB7C',
    cardCount: 196,
    releaseDate: '2026-11-06',
    exclusiveCount: 1,
    tagline: "Misty's Psyduck and the full 28-Pokémon roster",
    heroImage: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0307.webp',
    heroAlt: "Misty's Psyduck full art",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
  },
  {
    slug: 'gem-vol-6',
    path: '/sets/gem-vol-6',
    name: 'Gem Vol 6',
    series: 'Gem Set',
    code: 'CBB6C',
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
    code: 'CBB5C',
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
    code: 'CBB4C',
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
    code: 'CBB3C',
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
    code: 'CBB2C',
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
    code: 'CBB1C',
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
