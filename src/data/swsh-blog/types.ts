// Shared types for the Simplified Chinese Sword & Shield blog series (set
// overview, card origins and set guide for each booster set).

/** English Sword & Shield era sets a Chinese card can match (pokemontcg.io ids). */
export type EnSet =
  | 'swshp'
  | 'swsh1'
  | 'swsh2'
  | 'swsh3'
  | 'swsh35'
  | 'swsh4'
  | 'swsh45'
  | 'swsh45sv'
  | 'swsh5'
  | 'swsh6'
  | 'swsh7'
  | 'cel25'
  | 'cel25c'
  | 'swsh8'
  | 'swsh9'
  | 'swsh9tg'
  | 'swsh10'
  | 'swsh10tg'
  | 'pgo'
  | 'swsh11'
  | 'swsh11tg'
  | 'swsh12'
  | 'swsh12tg'
  | 'swsh12pt5'
  | 'swsh12pt5gg'

export const EN_SET_NAME: Record<EnSet, string> = {
  swshp: 'SWSH Black Star Promo',
  swsh1: 'Sword & Shield',
  swsh2: 'Rebel Clash',
  swsh3: 'Darkness Ablaze',
  swsh35: "Champion's Path",
  swsh4: 'Vivid Voltage',
  swsh45: 'Shining Fates',
  swsh45sv: 'Shining Fates Shiny Vault',
  swsh5: 'Battle Styles',
  swsh6: 'Chilling Reign',
  swsh7: 'Evolving Skies',
  cel25: 'Celebrations',
  cel25c: 'Celebrations Classic Collection',
  swsh8: 'Fusion Strike',
  swsh9: 'Brilliant Stars',
  swsh9tg: 'Brilliant Stars Trainer Gallery',
  swsh10: 'Astral Radiance',
  swsh10tg: 'Astral Radiance Trainer Gallery',
  pgo: 'Pokémon GO',
  swsh11: 'Lost Origin',
  swsh11tg: 'Lost Origin Trainer Gallery',
  swsh12: 'Silver Tempest',
  swsh12tg: 'Silver Tempest Trainer Gallery',
  swsh12pt5: 'Crown Zenith',
  swsh12pt5gg: 'Crown Zenith Galarian Gallery',
}

/** [Chinese number, English set, English number, illustrator]. For a card whose art has no English print,
 * the set is 'jp' and the third field names the Japanese product it comes from. */
export type SwshOrigin = [string, EnSet | 'jp', string, string]

export type SwshCard = { number: string; pokemonIndex: number; name: string; rarity: string; image: string }

export type SwshSetData = {
  name: string
  slug: string
  code: string
  releaseDate: string
  cardCount: number
  cards: SwshCard[]
}

/** A product from Pokémon China's official catalogue that contains this set. */
export type SwshProduct = { name: string; zh: string; released: string; contents: string }

export type SwshBlogSet = {
  /** Blog slug stem, e.g. "dynamax-clash-thunder". Posts are <key>-release-news, -card-origins, -set-guide. */
  key: string
  name: string
  zh: string
  /** Official database code, e.g. CS1aC. */
  code: string
  /** Expansion mark printed on the card, e.g. CS1a. */
  mark: string
  released: string
  releasedText: string
  data: SwshSetData
  /** Cards numbered up to this are the main set; above are secret cards. */
  mainCount: number
  /** Pokémon cards in the main set (the rest are Trainers and Energy), from the official card list. */
  mainPokemon: number
  cardListPath: string
  origins: SwshOrigin[]
  /** Pack line-up, as published by Pokémon China and the set's card list page. */
  packs: { label: string; detail: string }[]
  /** One or two sentences on the set's theme and cover Pokémon. */
  theme: string
  /** The other half of a two-part main set, if any. */
  partner?: { name: string; key: string; cardListPath: string }
  /** Japanese sets the cards were first printed in, for the overview. */
  japaneseSources: string
  /** Other official products that contained these packs. */
  products: SwshProduct[]
  /** Card numbers (3 digits) for the overview's lead gallery, most wanted first. */
  headline: string[]
  /** One line on the headline cards. */
  headlineNote: string
  /** Shown beside each Pokémon in the "several rarities" table. */
  ladderNames: string[]
  /** Cards matching English sets released after this one are called out as "from later English sets". Default swsh45sv. */
  laterThan?: EnSet
  /** Per-set wording for the "What it is" column, where the default does not fit. */
  tierMeaning?: Partial<Record<string, string>>
  /** Cards whose printed Chinese illustrator credit differs from the English print of the same art. */
  creditNotes?: { cn: string; name: string; zhCredit: string; enCredit: string }[]
}
