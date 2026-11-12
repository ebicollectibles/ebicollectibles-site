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
  // 30th Celebration's own set-specific tiers, plus its three unrated
  // blocks (classic reprints, basic Energy, promos — Chen gives them no
  // rarity at all). The unrated three intentionally reuse Common's
  // code/color: they aren't a real rarity, just a neutral display bucket,
  // and the card's own rarity STRING is still shown as the tag text.
  'Pikachu Rare': 'SR',
  'Futuristic Rare (FUR)': 'RRR',
  'Classic Reprint': 'C',
  'Basic Energy': 'C',
  Promo: 'C',
  // CSV10's own top tier (the gold cards) — reuses BWR's color hook since
  // CSV10 has no Black White Rare of its own.
  'Ultra Rare (UR)': 'BWR',
  // CSV9.5's own tier (pink-framed ACE SPEC Trainers/Energy, one per deck)
  // — reuses Triple Rare's color hook since this set has none of its own.
  'ACE SPEC Rare (ACE)': 'RRR',
  // Collect 151's own tiers — a shiny-colored main-set Pokémon (152–169)
  // and its full-art ex counterpart (186–188), both exclusive to this
  // set's rarity scheme. "Shiny Super Rare" reuses Triple Rare's color
  // hook (this set has no ACE SPEC or Futuristic Rare to collide with);
  // "Shiny" gets its own teal-cyan color (--r-s), a genuinely new tier
  // this set needs since every other page-unused code is already spoken
  // for by this same set's own other tiers.
  'Shiny (S)': 'S',
  'Shiny Super Rare (SSR)': 'RRR',
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
  'Pikachu Rare': '✪',
  'Futuristic Rare (FUR)': '✦✦✦✦',
  'Classic Reprint': '✺',
  'Basic Energy': '◉',
  Promo: '◇',
  'Ultra Rare (UR)': '✧',
  'ACE SPEC Rare (ACE)': '❖',
  'Shiny (S)': '✶',
  'Shiny Super Rare (SSR)': '✶✶',
}
