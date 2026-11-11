# Gem Vol 4: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_4 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 4, **CBB4C**, Gem Set series, Simplified Chinese
- Release: 2026-02-06
- 196 cards, 4 holo cards per pack (from the official odds chart)

## Structure

Same layout as Gem Vol 5, 6 and 7: **28 Pokémon × 7 versions**, numbered `PPVV/07` (Pokémon index, then version).

| Version | Rarity | Symbol | Cards | Production ratio |
|---|---|---|---|---|
| 01–02 | Common | ● | 56 | 50.00% |
| 03–04 | Uncommon | ◆ | 56 | 25.00% |
| 05 | Rare | ★ | 28 | 17.39% |
| 06 | Double Rare (Gem Pack logo stamp) | ★★ | 28 | 5.80% |
| 07 | Triple Rare (full-art illustration) | ★★★ | 28 | 1.81% |

Production ratios come from the official pokemon.cn odds chart (https://www.pokemon.cn/tcg/product/20382.html). The numbers are the same as Vol 5 and Vol 6. The chart image is Pokémon's own, so it isn't included here; restate the numbers in your own table.

Pokémon: 01 Ponyta, 02 Lickitung, 03 Pinsir, 04 Eevee, 05 Paldean Wooper, 06 Torkoal, 07 Relicanth, 08 Grotle, 09 Infernape, 10 Chatot, 11 Probopass, 12 Froslass, 13 Phione, 14 Excadrill, 15 Minccino, 16 Cinccino, 17 Deerling, 18 Sawsbuck, 19 Heliolisk, 20 Litten, 21 Charjabug, 22 Cutiefly, 23 Mudsdale, 24 Meltan, 25 Cramorant, 26 Snom, 27 Enamorus, 28 Flutter Mane.

There are no trainer-owned Pokémon and no anime tie-in.

## Chase cards and exclusives

- **0107/07 Ponyta** (Triple Rare full art) is the one card Chen flags as exclusive to Gem Vol 4. The art is a pale Ponyta with a resting Rapidash in a sunset meadow, a soft painterly style. Like the Vol 6 and Vol 7 exclusives, its image is slightly oversized (320×447).
- Other likely chase cards (my read, not a Chen flag): Eevee 0407/07, the Sawsbuck 1807/07 and Infernape 0907/07 full arts, and the two Paradox / legendary picks, Enamorus 2707/07 and Flutter Mane 2807/07.
- Quirk: **0503/07 Paldean Wooper** (an Uncommon) is also 320×445 rather than 300×419. Nothing marks it as special; it's probably just a different source scan. Crop it the same as the rest.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo / Gem Pack brand:** the same magenta as Vol 5–6. Main `#C61775`, bright `#DD057B`, soft `#DC57A0`.
- **Overall card palette:** the most evenly mixed of the four sets, with no single frame color dominating. The full arts lean earthy and autumnal: tan `#9C8268`, sage `#B9B99E`, coral `#D08169`, brick `#984748`, sea teal `#6DB1B3` and deep slate `#343E44`. That fits the Ponyta meadow and Deerling/Sawsbuck seasons themes.
- **Frame colors by Pokémon** (from each Pokémon's version 01):
  - Silver/white, 6: 02, 04, 10, 15, 16, 24
  - Blue (light blue plus Wooper's deep teal), 5: 05, 12, 13, 25, 26
  - Tan/orange, 4: 01, 06, 09, 20
  - Gold, 4: 07, 11, 14, 23
  - Yellow-green, 4: 03, 08, 17, 18
  - Pink/lilac, 3: 22, 27, 28
  - Pale yellow, 2: 19, 21
- **Suggested page accents:** Gem Pack magenta as the main accent, with a warm coral or terracotta (`#D08169`) as the second color. Use sea teal for small highlights. This sets Vol 4 apart from Vol 5 (gold), Vol 6 (green) and Vol 7 (plum and blue).

## Files

- `src/data/gem-vol-4.json`: same schema as `gem-vol-5.json`. The `image` fields are placeholder R2 paths (`Chinese/Gem 4/Cards/NNNN.webp`).
- `gem-vol-4-images/cards/NNNN.webp`: all 196 card images. These are the largest Chen serves (300×419; 320×447 for 0107 and 320×445 for 0503); no higher-resolution originals are published there.
