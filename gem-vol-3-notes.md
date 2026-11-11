# Gem Vol 3: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_3 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 3, **CBB3C**, Gem Set series, Simplified Chinese
- Release: 2025-09-26
- **136 cards**, 4 holo cards per pack (from the official odds chart)

## Structure: different from Vols 4–7

Vols 4–7 are 28 Pokémon × 7 versions. Vol 3 is smaller, and the version 07 slot works differently:

- **18 Pokémon × 7 versions** (`PPVV/07`, Pokémon 01–18). Versions 01–02 are Common, 03–04 Uncommon, 05 Rare, 06 Double Rare (Gem Pack logo stamp). Version 07 is one of two things:
  - a **Triple Rare full art**, for 9 Pokémon: 02 Meowth, 03 Gengar, 04 Cubone, 09 Mismagius, 11 Chandelure, 13 Mimikyu, 14 Morpeko, 15 Ceruledge, 16 Greavard;
  - a **Pokémon ex**, rarity Rare (★), for the other 9: 01 Clefable ex, 05 Houndoom ex, 06 Gardevoir ex, 07 Banette ex, 08 Absol ex, 10 Darkrai ex, 12 Lycanroc ex, 17 Houndstone ex, 18 Annihilape ex.
- **Group 19: 4 Trainer cards** (`19VV/04`). Super Rod, Nest Ball and Switch are Double Rare; **Arven** (1904/04) is a Triple Rare full-art Supporter.
- **Group 20: 6 Energy cards** (`20VV/06`), all Triple Rare: Basic Fighting, Basic Metal and Luminous Energy, each printed twice (2001–2003 and 2004–2006).

The schema is the same as `gem-vol-4.json`, but `pokemonIndex` 19 and 20 are the Trainer and Energy groups, not Pokémon. A page that shows one row per Pokémon should handle them as their own section. The cards are sorted by number. Chen's page lists groups 19 and 20 first.

Labeling ex cards as Rare isn't a Chen data error. The official chart counts 27 ★ cards: the 18 version-05 cards plus the 9 ex.

| Rarity | Symbol | Cards | Which cards | Production ratio |
|---|---|---|---|---|
| Common | ● | 36 | v01–02 | 50.00% |
| Uncommon | ◆ | 36 | v03–04 | 25.00% |
| Rare | ★ | 27 | v05 + 9 ex | 18.42% |
| Double Rare | ★★ | 21 | v06 + 3 Trainers | 4.77% |
| Triple Rare | ★★★ | 16 | 9 Pokémon full arts + Arven + 6 Energies | 1.81% (combined) |

From the official pokemon.cn chart (https://www.pokemon.cn/tcg/product/15431.html; the image is Pokémon's own, so it isn't included). The chart splits the 16 Triple Rares into **9 Pokémon holos, 4 non-gold-foil holos and 3 gold-foil holos**. The last 7 are Arven plus the 6 Energies, but neither Chen's data nor the chart says which 3 are gold-foil. A likely guess is one of the two printings of each Energy, but confirm against physical cards before labeling any of them.

## Chase cards and exclusives

Chen flags **five** cards as exclusive to Gem Vol 3, the most of any Gem set so far. All five are Triple Rare full arts sharing one night-time town scene, with lanterns, a full moon and lit windows:

| No. | Card | Art |
|---|---|---|
| 0207/07 | Meowth | on a rooftop under a full moon and floating lanterns |
| 0307/07 | Gengar | grinning among floating plates and teacups |
| 0407/07 | Cubone | on a bridge at dusk, autumn leaves |
| 1107/07 | Chandelure | over a lantern-lit square |
| 1507/07 | Ceruledge | on the rooftops at night |

Other cards collectors are likely to chase (my read, not a Chen flag): the **Arven** full art, the **Mimikyu**, **Mismagius** and **Greavard** full arts, and the **Gardevoir ex** and **Darkrai ex** cards.

Image size quirk: 0107 (Clefable ex), 0707 (Banette ex), 1207 (Lycanroc ex) and 1904 (Arven) are 320×447. Every other image is 300×419. Unlike Vols 4, 6 and 7, the exclusives here are normal size.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Theme:** a Halloween and night-town set, released in late September. The roster leans heavily on Ghost and Dark Pokémon (Gengar, Banette, Mismagius, Darkrai, Chandelure, Mimikyu, Greavard, Houndstone, Houndoom, Absol, Annihilape, Ceruledge).
- **Set logo / Gem Pack brand:** the same magenta as Vols 4–6. Main `#C41A76`, bright `#DC057A`, soft `#DB5DA4`.
- **Overall card palette:** the darkest and coolest Gem set: night navy `#1D3652`, deep teal `#2E6D84`, plum `#663F5A`, dusty rose `#A5747A`, with cream `#E0DDCB` highlights. The full arts and ex cards add twilight violet `#382C47`, slate blue `#465D76`, rose `#B06F78`, berry `#924A5F` and lantern peach `#D6A997`.
- **Frame colors by Pokémon** (from each Pokémon's version 01):
  - Pink/lilac, 6: 01, 09, 13, 15, 16, 17
  - Deep teal-blue, 4: 03, 08, 10, 14
  - Gold, 3: 04, 12, 18
  - Mauve/purple, 2: 06, 07
  - Tan/orange, 2: 05, 11
  - Silver/white, 1: 02
- **Suggested page accents:** a night navy (`#1D3652`) or twilight violet hero background, Gem Pack magenta as the main accent, and a warm lantern amber or peach (`#D6A997`, or gold `~#E2B83C` for fills) as the second color, echoing the exclusives' lantern glow. This sets Vol 3 apart from Vol 4 (coral), Vol 5 (gold), Vol 6 (green) and Vol 7 (plum and blue).

## Files

- `src/data/gem-vol-3.json`: same schema as `gem-vol-4.json`, 136 cards. The `image` fields are placeholder R2 paths (`Chinese/Gem 3/Cards/NNNN.webp`).
- `gem-vol-3-images/cards/NNNN.webp`: all 136 card images. These are the largest Chen serves (300×419, four at 320×447); no higher-resolution originals are published there.
