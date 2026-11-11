// Shared across every Gem Set release — collectors expect these names,
// codes and symbols to mean the same thing on every set's page.
//
// The "(C)"/"(RR)"/etc entries are for standard officially-numbered sets
// (Black Bolt, White Flare), which use Chen's own 8-tier scheme with the
// abbreviation written into the rarity string itself, rather than Chen's
// Gem Pack 5-tier naming — a lookup by plain "Double Rare" won't match
// "Double Rare (RR)", so both forms are listed rather than normalized
// away, keeping each set's `rarity` strings exactly as its data file has
// them.
export const RARITY_CODE: Record<string, string> = {
  Common: 'C',
  Uncommon: 'U',
  Rare: 'R',
  'Double Rare': 'RR',
  'Triple Rare': 'RRR',
  'Common (C)': 'C',
  'Uncommon (U)': 'U',
  'Rare (R)': 'R',
  'Double Rare (RR)': 'RR',
  'Art Rare (AR)': 'AR',
  'Super Rare (SR)': 'SR',
  'Special Art Rare (SAR)': 'SAR',
  'Black White Rare (BWR)': 'BWR',
}
export const RARITY_SYMBOL: Record<string, string> = {
  Common: '●',
  Uncommon: '◆',
  Rare: '★',
  'Double Rare': '★★',
  'Triple Rare': '★★★',
  'Common (C)': '●',
  'Uncommon (U)': '◆',
  'Rare (R)': '★',
  'Double Rare (RR)': '★★',
  'Art Rare (AR)': '✦',
  'Super Rare (SR)': '✦✦',
  'Special Art Rare (SAR)': '✦✦✦',
  'Black White Rare (BWR)': '✧',
}
