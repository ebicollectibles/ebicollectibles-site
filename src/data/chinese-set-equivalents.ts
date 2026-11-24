// Where the cards in each Simplified Chinese main expansion come from in
// English, counted from the card-by-card tables in each set's card origins
// post (src/routes/blog/<set>-card-origins.tsx). Each card is counted under
// the English set its origins post matches it to; noEnglish counts the cards
// that post marks as having no English version.
// chinese-set-equivalents.test.ts recounts those tables and fails when this
// file no longer matches them.
export interface EnglishSource {
  set: string
  cards: number
}
export interface SetEquivalent {
  /** Set key, as in blog-shop.ts: the set page slug without its -csvN suffix. */
  key: string
  total: number
  english: EnglishSource[]
  noEnglish: number
}

export const MAIN_SET_EQUIVALENTS: SetEquivalent[] = [
  { key: 'eternal-birth', total: 167, english: [{ set: 'Scarlet & Violet', cards: 134 }, { set: 'Paldea Evolved', cards: 16 }, { set: 'Obsidian Flames', cards: 7 }, { set: '151', cards: 5 }, { set: 'SV Black Star Promos', cards: 3 }, { set: 'Paradox Rift', cards: 1 }, { set: 'Paldean Fates', cards: 1 }], noEnglish: 0 },
  { key: 'miracle-journey', total: 163, english: [{ set: 'Paldea Evolved', cards: 80 }, { set: 'Scarlet & Violet', cards: 43 }, { set: 'Obsidian Flames', cards: 26 }, { set: 'SV Black Star Promos', cards: 6 }, { set: '151', cards: 5 }, { set: 'Paldean Fates', cards: 3 }], noEnglish: 0 },
  { key: 'fearless-terastal', total: 165, english: [{ set: 'Paldea Evolved', cards: 96 }, { set: 'Obsidian Flames', cards: 34 }, { set: 'Scarlet & Violet', cards: 22 }, { set: 'SV Black Star Promos', cards: 5 }, { set: '151', cards: 4 }, { set: 'Paradox Rift', cards: 3 }], noEnglish: 1 },
  { key: 'reward-round', total: 165, english: [{ set: 'Obsidian Flames', cards: 69 }, { set: 'Paldea Evolved', cards: 41 }, { set: 'Paradox Rift', cards: 31 }, { set: 'Scarlet & Violet', cards: 9 }, { set: 'Paldean Fates', cards: 6 }, { set: 'SV Black Star Promos', cards: 2 }, { set: '151', cards: 2 }, { set: 'Stellar Crown', cards: 1 }, { set: 'Twilight Masquerade', cards: 1 }], noEnglish: 3 },
  { key: 'black-crystal-blaze', total: 164, english: [{ set: 'Paradox Rift', cards: 73 }, { set: 'Obsidian Flames', cards: 61 }, { set: 'Paldean Fates', cards: 18 }, { set: 'Scarlet & Violet', cards: 5 }, { set: 'SV Black Star Promos', cards: 2 }, { set: 'Temporal Forces', cards: 1 }, { set: '151', cards: 1 }, { set: 'Paldea Evolved', cards: 1 }], noEnglish: 2 },
  { key: 'true-mystery', total: 163, english: [{ set: 'Paradox Rift', cards: 128 }, { set: 'Obsidian Flames', cards: 16 }, { set: 'Paldean Fates', cards: 15 }, { set: 'SV Black Star Promos', cards: 1 }, { set: '151', cards: 1 }], noEnglish: 2 },
  { key: 'blade-awakening', total: 259, english: [{ set: 'Temporal Forces', cards: 173 }, { set: 'Twilight Masquerade', cards: 68 }, { set: 'Journey Together', cards: 4 }, { set: 'Stellar Crown', cards: 4 }, { set: 'Prismatic Evolutions', cards: 4 }, { set: 'SV Black Star Promos', cards: 2 }, { set: 'Surging Sparks', cards: 2 }, { set: 'Shrouded Fable', cards: 1 }], noEnglish: 1 },
  { key: 'brilliant-fantasy', total: 264, english: [{ set: 'Twilight Masquerade', cards: 109 }, { set: 'Shrouded Fable', cards: 76 }, { set: 'Surging Sparks', cards: 38 }, { set: 'Stellar Crown', cards: 32 }, { set: 'Journey Together', cards: 3 }, { set: 'Temporal Forces', cards: 2 }, { set: 'SV Black Star Promos', cards: 2 }, { set: 'Destined Rivals', cards: 1 }], noEnglish: 1 },
  { key: 'stellar-crystal', total: 266, english: [{ set: 'Surging Sparks', cards: 160 }, { set: 'Stellar Crown', cards: 79 }, { set: 'Shrouded Fable', cards: 10 }, { set: 'Twilight Masquerade', cards: 8 }, { set: 'SV Black Star Promos', cards: 6 }, { set: 'Prismatic Evolutions', cards: 2 }], noEnglish: 1 },
  { key: 'terastal-gathering', total: 259, english: [{ set: 'Prismatic Evolutions', cards: 156 }, { set: 'SV Black Star Promos', cards: 28 }, { set: 'Paradox Rift', cards: 25 }, { set: 'Twilight Masquerade', cards: 16 }, { set: 'Temporal Forces', cards: 15 }, { set: 'Shrouded Fable', cards: 8 }, { set: 'Paldea Evolved', cards: 3 }, { set: 'Scarlet & Violet', cards: 2 }, { set: 'Obsidian Flames', cards: 1 }, { set: 'Stellar Crown', cards: 1 }, { set: 'Surging Sparks', cards: 1 }, { set: 'Paldean Fates', cards: 1 }], noEnglish: 2 },
  { key: 'chasing-glory', total: 287, english: [{ set: 'Destined Rivals', cards: 190 }, { set: 'Journey Together', cards: 94 }, { set: 'Ascended Heroes', cards: 2 }], noEnglish: 1 },
  { key: 'black-bolt', total: 174, english: [{ set: 'Black Bolt', cards: 160 }, { set: 'White Flare', cards: 10 }, { set: 'SV Black Star Promos', cards: 3 }], noEnglish: 1 },
  { key: 'white-flare', total: 174, english: [{ set: 'White Flare', cards: 161 }, { set: 'Black Bolt', cards: 10 }, { set: 'SV Black Star Promos', cards: 2 }], noEnglish: 1 },
]
