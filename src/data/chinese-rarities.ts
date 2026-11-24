// Card counts at each rarity for every Simplified Chinese set we have a card list for,
// in each set's own rarity order (rarityOrder in its data file). Kept as a small file so the
// rarities post does not ship every card list to the browser.
// chinese-rarities.test.ts recounts these from the set data files, so they cannot drift.
// `null` counts cards the set data gives no rarity (30th Celebration classics, Energy and promos).

export interface SetRarityCounts {
  /** The set data file, src/data/<file>.json */
  file: string
  code: string
  cardCount: number
  counts: [rarity: string | null, cards: number][]
}

export const SET_RARITY_COUNTS: SetRarityCounts[] = [
  { file: 'csv1', code: 'CSV1C', cardCount: 167, counts: [["Common (C)", 55], ["Uncommon (U)", 43], ["Rare (R)", 15], ["Double Rare (RR)", 14], ["Art Rare (AR)", 8], ["Super Rare (SR)", 17], ["Special Art Rare (SAR)", 11], ["Ultra Rare (UR)", 4]] },
  { file: 'csv2', code: 'CSV2C', cardCount: 163, counts: [["Common (C)", 57], ["Uncommon (U)", 47], ["Rare (R)", 11], ["Double Rare (RR)", 13], ["Art Rare (AR)", 8], ["Super Rare (SR)", 15], ["Special Art Rare (SAR)", 8], ["Ultra Rare (UR)", 4]] },
  { file: 'csv3', code: 'CSV3C', cardCount: 165, counts: [["Common (C)", 56], ["Uncommon (U)", 47], ["Rare (R)", 13], ["Double Rare (RR)", 14], ["Art Rare (AR)", 8], ["Super Rare (SR)", 15], ["Special Art Rare (SAR)", 8], ["Ultra Rare (UR)", 4]] },
  { file: 'csv4', code: 'CSV4C', cardCount: 165, counts: [["Common (C)", 57], ["Uncommon (U)", 44], ["Rare (R)", 14], ["Double Rare (RR)", 14], ["Art Rare (AR)", 8], ["Super Rare (SR)", 15], ["Special Art Rare (SAR)", 9], ["Ultra Rare (UR)", 4]] },
  { file: 'csv5', code: 'CSV5C', cardCount: 164, counts: [["Common (C)", 61], ["Uncommon (U)", 41], ["Rare (R)", 13], ["Double Rare (RR)", 14], ["Art Rare (AR)", 8], ["Super Rare (SR)", 15], ["Special Art Rare (SAR)", 8], ["Ultra Rare (UR)", 4]] },
  { file: 'csv6', code: 'CSV6C', cardCount: 163, counts: [["Common (C)", 61], ["Uncommon (U)", 41], ["Rare (R)", 13], ["Double Rare (RR)", 13], ["Art Rare (AR)", 8], ["Super Rare (SR)", 15], ["Special Art Rare (SAR)", 8], ["Ultra Rare (UR)", 4]] },
  { file: 'csv7', code: 'CSV7C', cardCount: 259, counts: [["Common (C)", 90], ["Uncommon (U)", 63], ["Rare (R)", 20], ["Double Rare (RR)", 22], ["Art Rare (AR)", 6], ["ACE SPEC Rare (ACE)", 9], ["Super Rare (SR)", 26], ["Special Art Rare (SAR)", 14], ["Ultra Rare (UR)", 9]] },
  { file: 'csv8', code: 'CSV8C', cardCount: 264, counts: [["Common (C)", 93], ["Uncommon (U)", 61], ["Rare (R)", 22], ["Double Rare (RR)", 22], ["Art Rare (AR)", 6], ["ACE SPEC Rare (ACE)", 9], ["Super Rare (SR)", 28], ["Special Art Rare (SAR)", 14], ["Ultra Rare (UR)", 9]] },
  { file: 'csv9', code: 'CSV9C', cardCount: 266, counts: [["Common (C)", 92], ["Uncommon (U)", 65], ["Rare (R)", 20], ["Double Rare (RR)", 22], ["Art Rare (AR)", 6], ["ACE SPEC Rare (ACE)", 9], ["Super Rare (SR)", 27], ["Special Art Rare (SAR)", 16], ["Ultra Rare (UR)", 9]] },
  { file: 'csv9-5', code: 'CSV9.5C', cardCount: 259, counts: [["Common (C)", 61], ["Uncommon (U)", 66], ["Rare (R)", 44], ["Double Rare (RR)", 29], ["ACE SPEC Rare (ACE)", 8], ["Super Rare (SR)", 12], ["Special Art Rare (SAR)", 34], ["Ultra Rare (UR)", 5]] },
  { file: 'csv10', code: 'CSV10C', cardCount: 287, counts: [["Common (C)", 98], ["Uncommon (U)", 71], ["Rare (R)", 29], ["Double Rare (RR)", 24], ["Art Rare (AR)", 6], ["Super Rare (SR)", 33], ["Special Art Rare (SAR)", 18], ["Ultra Rare (UR)", 8]] },
  { file: 'black-bolt', code: 'CSV10.5C', cardCount: 174, counts: [["Common (C)", 39], ["Uncommon (U)", 31], ["Rare (R)", 10], ["Double Rare (RR)", 6], ["Art Rare (AR)", 72], ["Super Rare (SR)", 8], ["Special Art Rare (SAR)", 7], ["Black White Rare (BWR)", 1]] },
  { file: 'white-flare', code: 'CSV10.6C', cardCount: 174, counts: [["Common (C)", 38], ["Uncommon (U)", 32], ["Rare (R)", 10], ["Double Rare (RR)", 6], ["Art Rare (AR)", 72], ["Super Rare (SR)", 8], ["Special Art Rare (SAR)", 7], ["Black White Rare (BWR)", 1]] },
  { file: 'collect-151', code: '151C', cardCount: 192, counts: [["Common (C)", 63], ["Uncommon (U)", 51], ["Rare (R)", 25], ["Double Rare (RR)", 12], ["Shiny (S)", 18], ["Art Rare (AR)", 4], ["Super Rare (SR)", 12], ["Shiny Super Rare (SSR)", 3], ["Special Art Rare (SAR)", 3], ["Ultra Rare (UR)", 1]] },
  { file: '30th-celebration', code: '30thC', cardCount: 206, counts: [["Common (C)", 45], ["Rare (R)", 18], ["Pikachu Rare", 30], ["Double Rare (RR)", 10], ["Art Rare (AR)", 20], ["Special Art Rare (SAR)", 10], ["Futuristic Rare (FUR)", 2], [null, 71]] },
  { file: 'gem-vol-1', code: 'CBB1C', cardCount: 115, counts: [["Common", 32], ["Uncommon", 23], ["Rare", 23], ["Double Rare", 19], ["Triple Rare", 18]] },
  { file: 'gem-vol-2', code: 'CBB2C', cardCount: 140, counts: [["Common", 36], ["Uncommon", 36], ["Rare", 27], ["Double Rare", 21], ["Triple Rare", 20]] },
  { file: 'gem-vol-3', code: 'CBB3C', cardCount: 136, counts: [["Common", 36], ["Uncommon", 36], ["Rare", 27], ["Double Rare", 21], ["Triple Rare", 16]] },
  { file: 'gem-vol-4', code: 'CBB4C', cardCount: 196, counts: [["Common", 56], ["Uncommon", 56], ["Rare", 28], ["Double Rare", 28], ["Triple Rare", 28]] },
  { file: 'gem-vol-5', code: 'CBB5C', cardCount: 196, counts: [["Common", 56], ["Uncommon", 56], ["Rare", 28], ["Double Rare", 28], ["Triple Rare", 28]] },
  { file: 'gem-vol-6', code: 'CBB6C', cardCount: 196, counts: [["Common", 56], ["Uncommon", 56], ["Rare", 28], ["Double Rare", 28], ["Triple Rare", 28]] },
  { file: 'gem-vol-7', code: 'CBB7C', cardCount: 196, counts: [["Common", 56], ["Uncommon", 56], ["Rare", 28], ["Double Rare", 28], ["Triple Rare", 28]] },
]
