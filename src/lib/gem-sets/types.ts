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
}

export interface Card {
  id: string // 4-digit "pokemon index + version", e.g. "0307"
  name: string
  owner: string | null // "Team Rocket", "Misty", etc. — null when the card has no trainer prefix
  mon: string // the Pokémon's own name, with any "X's " prefix stripped
  rarity: string
  version: number
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
  productId: string
  fanIds: string[] // 5 card ids shown in the hero fan
  glow1: string // hero radial-gradient color, e.g. 'rgb(138 61 120 / .30)'
  glow2: string
  aboutParagraphs: string[]
  faq: FaqItem[]
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
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
