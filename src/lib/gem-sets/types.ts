// Shared shapes for every "Gem Set" card-list page (Gem Vol 7, Gem Vol 6,
// and whatever comes after). One of these per set lives in src/data/*.json;
// buildGemSetData() below turns it into the derived lookups the page needs.

export interface RawCard {
  number: string // e.g. "0101/07"
  pokemonIndex: number
  version: number
  name: string
  rarity: string
  image: string
}

export interface GemSetData {
  name: string
  slug: string
  code: string
  series: string
  language: string
  releaseDate: string
  cardCount: number
  rarityOrder: string[]
  exclusiveCardNumbers: string[]
  source: string
  cards: RawCard[]
  // pokemonIndex values whose cards are a CATALOG of distinct items sharing
  // a numbering prefix (Trainer cards, Energy cards) rather than one
  // creature's rarity ladder — e.g. Gem Vol 3's Trainer block (prefix 19:
  // Super Rod, Nest Ball, Switch, Arven — four different cards, not four
  // versions of one) and Energy block (prefix 20: three energy types,
  // each printed twice, interleaved rather than adjacent). Within one of
  // these indexes, cards are grouped by matching `name` instead of by
  // being adjacent in the list. Omit entirely for a normal set — every
  // pokemonIndex is grouped the original way (by prefix, adjacency only).
  catalogGroups?: number[]
}

export interface Card {
  id: string // 4-digit "pokemon index + version", e.g. "0307"
  pokemonIndex: number
  name: string
  owner: string | null // "Team Rocket", "Misty", etc. — null when the card has no trainer prefix
  mon: string // the Pokémon's own name, with any "X's " prefix stripped
  rarity: string
  version: number
  suffix: string // this card's own version denominator, e.g. "07" or, for a
  // catalog card in a differently-sized block (Trainers, Energy), "04"/"06"
  image: string
  exclusive: boolean
}

export interface CardGroup {
  groupId: string // first 2 digits of the card ids in it, e.g. "03"
  cards: Card[]
}

export interface FaqItem {
  q: string
  a: string
}

// Everything about a set that takes editorial judgment rather than being
// derivable from its data file — hero/about copy, SEO text, which cards
// headline the hero fan, and its accent colors.
export interface GemSetConfig {
  routePath: string // e.g. '/sets/gem-vol-7' — must match the file route exactly
  storageKey: string // localStorage key for "have" tracking, e.g. 'gem7-have'
  productId?: string // omit when the set has no dedicated product listing — Shop buttons link to /shop instead
  fanIds: string[] // 5 card ids shown in the hero fan
  glow1: string // hero radial-gradient color, e.g. 'rgb(138 61 120 / .30)'
  glow2: string
  aboutParagraphs: string[]
  faq: FaqItem[]
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  // Overrides for copy/data the normal auto-derivation can't state
  // accurately for a structurally irregular set (e.g. Gem Vol 3, whose
  // Pokémon aren't a uniform 28×7, and whose "ex" cards repeat a rarity
  // at two non-adjacent version numbers). Omit all three for a normal
  // set — the auto-derived hero sentence, fact tile and odds table are
  // used exactly as before.
  heroLede?: string
  pokemonFact?: string // the hero's "Pokémon" fact tile value, e.g. "18 × 7"
  rarityVersionLabelsOverride?: Record<string, string>
}

export interface BuiltGemSetData {
  cards: Card[]
  cardById: Map<string, Card>
  groups: CardGroup[]
  versionSuffix: string // e.g. "07"
  versionsPerMon: number
  monCount: number
  rarityVersionLabels: Record<string, string> // e.g. { Common: '01–02', 'Triple Rare': '07' }
}
