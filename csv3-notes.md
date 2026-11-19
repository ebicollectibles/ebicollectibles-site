# Fearless Terastal CSV3: sourcing notes

Source: https://www.chencards.com/sets/fearless_terastal (Chen Cards, used with permission), fetched 2026-11-19. Chen's `/sets/csv3c` URL is an empty page; the set lives under the English-name slug.

## Set facts

- Name: **Fearless Terastal** (无畏太晶). Official set code: **CSV3C**. Files: `src/data/csv3.json`, `slug: "csv3"`, page `/sets/chinese/fearless-terastal-csv3`.
- Series: **Chinese Scarlet & Violet Series**, a main numbered expansion, not a Gem Pack. Language: Simplified Chinese.
- Release: **2025-05-16** (Chen and the official page agree; official announcement dated 2025-04-11).
- **165 cards**: `001/130`–`130/130` main set + `131/130`–`165/130` secret rares (printed total **130**).
- Official page: https://www.pokemon.cn/tcg/product/15519.html. Odds chart image: Chen's `set-odds/csv3c.webp` (same chart as the official page).
- Packs (official page): a **5-card pack with 1 holo** and a **20-card pack with 6 holos**. The first odds chart is for the 5-card pack: 4 non-holo (C/U) + 1 holo (shares 80.00 / 14.53 / 4.74 / 0.73%). The official page has a second chart for the 20-card pack: 14 non-holo + 6 holos (shares 70.00 / 22.99 / 6.01 / 1.00%), same kind counts.
- Pack art: **Tera Arcanine ex**.
- Images: every card image came from Chen (165 of 165, 300 × 418 WebP). R2 path: `Chinese/Fearless Terastal CSV3/Cards/NNNN.webp`.

## Rarity tiers, most common to rarest

| Rank | Chart tier | String in the data | Kinds (chart) | Cards here | Production share (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 56 | 56 | 80.00% (C + U, the 4 non-holo slots) |
| 2 | Uncommon | Uncommon (U) | 47 | 47 | ↑ |
| 3 | Poké Ball pattern holo (精灵球纹样) | *not on Chen* | 116 | 0 | 14.53% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 13 | 13 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 14 | 14 | 4.74% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 8 | 8 | ↑ |
| 7 | Master Ball pattern holo (大师球纹样) | *not on Chen* | 116 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | 15 | 15 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | 8 | 8 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | 4 | 4 | ↑ |

The chart's footnote says the Poké Ball and Master Ball pattern holos are the C, U and R cards (56 + 47 + 13 = 116) with a different finish. They are parallels and have no separate numbers, so they are not in the data.

## Rarity corrections made to Chen's data

Chen listed 48 Common and 55 Uncommon; the official chart says 56 and 47. I enlarged the rarity mark printed after the collector number on all 103 Common and Uncommon cards and read each one:

- Chen says Uncommon, card prints **C** (10): 002 Skiploom, 026, 027, 030, 041, 047, 049, 091, 103, 110.
- Chen says Common, card prints **U** (2): 116 Great Ball, 127 Ryme.

After the corrections the data has 56 Common and 47 Uncommon, an exact match to the chart. Rare (13) and everything above already matched.

## Numbering

- 001–114: Pokémon (114). 115–117: Items (3). 118–120: Pokémon Tools (3). 121–127: Supporters (7). 128–129: Stadiums (2). 130: Special Energy (Therapeutic Energy). Card types read from the type label on cards 115–130.
- 14 Double Rares, all Pokémon ex: Forretress, Wo-Chien, Arcanine, Chi-Yu, Gyarados, Chien-Pao, Ampharos, Bellibolt, Mimikyu, Klawf, Ting-Lu, Houndoom, Melmetal, Oinkologne.
- Tera Pokémon ex named on the official page: Arcanine ex, Forretress ex, Gyarados ex.

## Secret rares (35)

- 131–138 Art Rare (8): Frigibax, Arctibax, Baxcalibur, Sandygast, Mabosstiff, Orthworm, Farigiraf, Dudunsparce.
- 139–153 Super Rare (15): 9 Pokémon ex (Forretress, Wo-Chien, Arcanine, Chi-Yu, Gyarados, Chien-Pao, Bellibolt, Ting-Lu, Oinkologne) and 6 Supporters (Grusha, Iono, Falkner, Giacomo, Bill's Transfer, Ryme).
- 154–161 Special Art Rare (8): Wo-Chien ex, Arcanine ex, Chi-Yu ex, Chien-Pao ex, Ting-Lu ex, Grusha, Iono, Giacomo.
- 162–165 Ultra Rare (4, gold): Chien-Pao ex, Ting-Lu ex, Superior Energy Retrieval, Reversal Energy.

## Exclusives

Chen flags **one** card as exclusive to this set: **155/130 Arcanine ex (SAR)**. The official page also calls out this SAR as newly included. It is the only entry in `exclusiveCardNumbers`.

## Not verified

- English matches: now done for every card in src/routes/blog/fearless-terastal-card-origins.tsx.
- Box sizes (packs per box) for either pack type: not on Chen or the official page.
