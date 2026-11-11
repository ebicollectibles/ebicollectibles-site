# Gem Vol 6: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_6 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 6, **CBB6C**, Gem Set series, Simplified Chinese
- Release: 2026-08-07
- 196 cards, 4 holo cards per pack (from the official odds chart)

## Structure

Same layout as Gem Vol 7: **28 Pokémon × 7 versions**, numbered `PPVV/07` (Pokémon index, then version).

| Version | Rarity | Symbol | Cards | Production ratio |
|---|---|---|---|---|
| 01–02 | Common | ● | 56 | 50.00% |
| 03–04 | Uncommon | ◆ | 56 | 25.00% |
| 05 | Rare | ★ | 28 | 17.39% |
| 06 | Double Rare (Gem Pack logo stamp) | ★★ | 28 | 5.80% |
| 07 | Triple Rare (full-art illustration) | ★★★ | 28 | 1.81% |

Production ratios come from the official pokemon.cn odds chart (https://www.pokemon.cn/tcg/product/23048.html), saved as `gem-vol-6-images/pack-odds.webp`. The chart is in Chinese and is Pokémon's own image, so restate the numbers in your own table rather than putting the image on the page.

Pokémon: 01 Alolan Dugtrio, 02 Persian, 03 Exeggcute, 04 Ledian, 05 Slakoth, 06 Lairon, 07 Meditite, 08 Gulpin, 09 Lileep, 10 Castform Sunny Form, 11 Kecleon, 12 Mesprit, 13 Reuniclus, 14 Crabominable, 15 Shiinotic, 16 Bewear, 17 Bruxish, 18 Tapu Bulu, 19 Applin, 20 Flapple, 21 Appletun, 22 Clobbopus, 23 Cufant, 24 Dipplin, 25 Poltchageist, 26 Okidogi, 27 Munkidori, 28 Fezandipiti.

There are no trainer-owned Pokémon (Vol 7 has many "Team Rocket's", "Misty's" etc.). There's a clear apple/garden thread: Applin, Flapple, Appletun, Dipplin, Exeggcute, Poltchageist, plus the Loyal Three (Okidogi, Munkidori, Fezandipiti).

## Exclusivity

- **1907/07 Applin** (Triple Rare full art) is flagged by Chen as exclusive to Gem Vol 6. Same treatment as 0307/07 Misty's Psyduck in Vol 7.
- Its image is slightly larger (320×447) than the rest. Chen used the same size quirk on the Vol 7 exclusive.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo / Gem Pack brand:** magenta-pink. Main `#C71674`, bright `#DE047B`, soft `#D7569C`. This is the same Gem Pack pink as the ★★ stamp on version 06.
- **Overall card palette:** green-leaning. 8 of 28 Pokémon have the yellow-green frame (`~#C6CF4F`). The full arts lean deep green `#4E7768`, sage `#96BEA6`, warm coral `#C3796D`, sand `#DAB597` and cream `#E8E2AA`.
- **Frame colors by Pokémon** (from each Pokémon's version 01):
  - Yellow-green, 8: 03, 04, 09, 15, 18, 19, 24, 25
  - Silver/white, 7: 01, 02, 05, 06, 11, 16, 23
  - Pink/lilac, 4: 12, 13, 27, 28
  - Gold, 3: 07, 22, 26
  - Tan-gold, 2: 20, 21
  - Blue/teal, 3: 08, 14, 17
  - Orange, 1: 10
- **Suggested page accents:** Gem Pack magenta as the main accent, with a deep green (`#4E7768`) or apple green as the second color. Vol 7's preview used plum and blue, so this sets Vol 6 apart.

## Files

- `src/data/gem-vol-6.json`: same schema as `gem-vol-7.json`. The `image` fields are placeholder R2 paths (`Chinese/Gem 6/Cards/NNNN.webp`).
- `gem-vol-6-images/cards/NNNN.webp`: all 196 card images. These are the largest Chen serves (300×419; 320×447 for 1907). No higher-resolution originals are published there.
- `gem-vol-6-images/set-logo.webp`: Chen's copy of the Gem Pack Vol.6 logo. It is small (93×75), fine for a badge but not a hero.
- `gem-vol-6-images/pack-odds.webp`: the official odds chart, kept for reference only.
