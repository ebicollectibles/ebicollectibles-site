# Gem Vol 5: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_5 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 5, **CBB5C**, Gem Set series, Simplified Chinese
- Release: 2026-04-24
- 196 cards, 4 holo cards per pack (from the official odds chart)

## Structure

Same layout as Gem Vol 6 and 7: **28 Pokémon × 7 versions**, numbered `PPVV/07` (Pokémon index, then version).

| Version | Rarity | Symbol | Cards | Production ratio |
|---|---|---|---|---|
| 01–02 | Common | ● | 56 | 50.00% |
| 03–04 | Uncommon | ◆ | 56 | 25.00% |
| 05 | Rare | ★ | 28 | 17.39% |
| 06 | Double Rare (Gem Pack logo stamp) | ★★ | 28 | 5.80% |
| 07 | Triple Rare (full-art illustration) | ★★★ | 28 | 1.81% |

Production ratios come from the official pokemon.cn odds chart (https://www.pokemon.cn/tcg/product/21078.html). They are identical to Gem Vol 6. The chart image is Pokémon's own, so it isn't included here; restate the numbers in your own table.

Pokémon: 01 Captain Pikachu, 02 Hisuian Growlithe, 03 Magneton, 04 Chansey, 05 Horsea, 06 Sunflora, 07 Skarmory, 08 Houndoom, 09 Phanpy, 10 Vibrava, 11 Chimecho, 12 Spheal, 13 Latios, 14 Timburr, 15 Joltik, 16 Stunfisk, 17 Braviary, 18 Vivillon, 19 Raboot, 20 Applin, 21 Milcery, 22 Floragato, 23 Crocalor, 24 Quaxwell, 25 Ceruledge, 26 Wattrel, 27 Cetitan, 28 Tatsugiri.

## Chase cards and exclusives

Chen flags **four** cards as exclusive to Gem Vol 5. Vol 6 and Vol 7 have one each. All four are Triple Rare full arts drawn with characters from the Pokémon Horizons anime. Each carries a "宝可梦 地平线" (Pokémon Horizons) logo stamp in the lower left, which the other Triple Rares don't have.

| No. | Card | Art |
|---|---|---|
| 0107/07 | Captain Pikachu | with Friede, on a ship's deck |
| 2207/07 | Floragato | with Liko, picnic scene |
| 2307/07 | Crocalor | with Roy, at a meal |
| 2407/07 | Quaxwell | with a Horizons character, eating noodles |

These four, especially Captain Pikachu, are the natural chase cards to feature on the page. Unlike the Vol 6 exclusive, their images aren't oversized; all 196 are 300×419.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo / Gem Pack brand:** the same magenta as Vol 6. Main `#C51874`, bright `#DE047C`, soft `#D95AA0`.
- **Overall card palette:** warm yellow and gold. 11 of 28 Pokémon have yellow or gold frames, and the set leads with Pikachu, Magneton, Joltik, Stunfisk and Wattrel. The full arts add sky teal (`#448691`, `#70BAC1`), deep slate (`#2C3F4B`), sage (`#BAC8B2`) and terracotta (`#C88D69`).
- **Frame colors by Pokémon** (from each Pokémon's version 01):
  - Pale yellow, 7: 01, 03, 15, 16, 20, 26, 28
  - Gold, 4: 02, 09, 10, 14
  - Tan/orange, 4: 08, 19, 23, 25
  - Light blue, 4: 05, 12, 24, 27
  - Pink/lilac, 3: 11, 13, 21
  - Yellow-green, 3: 06, 18, 22
  - Silver/white, 3: 04, 07, 17
- **Suggested page accents:** Gem Pack magenta as the main accent, with a warm gold (`~#E6BF3D`) as the second color. Gold is too light for text on white, so keep it for fills, rules and badges. Use deep slate or teal for text-weight accents. This sets Vol 5 apart from Vol 6's magenta and green and Vol 7's plum and blue.

## Files

- `src/data/gem-vol-5.json`: same schema as `gem-vol-6.json`. The `image` fields are placeholder R2 paths (`Chinese/Gem 5/Cards/NNNN.webp`).
- `gem-vol-5-images/cards/NNNN.webp`: all 196 card images. These are the largest Chen serves (300×419); no higher-resolution originals are published there.
