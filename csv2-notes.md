# Miracle Journey CSV2: sourcing notes

Source: https://www.chencards.com/sets/miracle_journey (Chen Cards, used with permission), fetched 2026-11-19. Chen's `/sets/csv2c` URL is an empty page; the set lives under the English-name slug (the page's own `code` field is `CSV2C`).

## Set facts

- Name: **Miracle Journey** (奇迹启程). Official set code: **CSV2C**. Files: `src/data/csv2.json`, `slug: "csv2"`, page `/sets/chinese/miracle-journey-csv2`.
- Series: **Chinese Scarlet & Violet Series**, a main numbered expansion, not a Gem Pack. Language: Simplified Chinese.
- Release: **2025-03-21** (Chen and the official page agree; official announcement dated 2025-02-21).
- **163 cards**: `001/128`–`128/128` main set + `129/128`–`163/128` secret rares (printed total **128**).
- Official page: https://www.pokemon.cn/tcg/product/15556.html (Chen's `packOddsSourceUrl`). Odds chart image: Chen's `set-odds/csv2c.webp`.
- Packs (official page): a **5-card pack with 1 holo** and a **20-card pack with 6 holos**. The odds chart is for the 5-card pack: 4 non-holo (C/U) + 1 holo.
- Pack art: **Gardevoir** (the official page names it as the cover Pokémon; viewed: Gardevoir on a pink background, same art on both pack sizes). It is in the set as Gardevoir ex.
- Images: every card image came from Chen (163 of 163, no failures; 300 px wide WebP, 418 or 419 px tall, re-encoded at quality 82). R2 path: `Chinese/Miracle Journey CSV2/Cards/NNNN.webp`. Local folder `csv2-images/cards/` is untracked.

## Rarity tiers, most common to rarest

| Rank | Chart tier | String in the data | Kinds (chart) | Cards here | Production share (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 57 | 57 | 80% (C + U, the 4 non-holo slots) |
| 2 | Uncommon | Uncommon (U) | 47 | 47 | ↑ |
| 3 | Poké Ball pattern holo (精灵球纹样) | *not on Chen* | 115 | 0 | 14.53% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 11 | 11 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 13 | 13 | 4.74% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 8 | 8 | ↑ |
| 7 | Master Ball pattern holo (大师球纹样) | *not on Chen* | 115 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | 15 | 15 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | 8 | 8 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | 4 | 4 | ↑ |

The chart's footnote says the Poké Ball and Master Ball pattern holos are the C, U and R cards (57 + 47 + 11 = 115) with a different finish. They are parallels and have no separate numbers, so they are not in the data.

## Rarity corrections made to Chen's data

Chen listed 51 Common and 53 Uncommon; the official chart says 57 and 47. Cards from this set do print a letter mark after the collector number. I enlarged that mark on all 128 main-set cards (contact sheets, 8 per row) and read each one:

- Chen says Uncommon, card prints **C** (9): 011 Floragato, 020 Crocalor, 029 Frogadier, 032 Quaxwell, 040 Luxio, 063 Gothorita, 069 Tinkatuff, 091 Zweilous, 097 Skarmory.
- Chen says Common, card prints **U** (3): 112 Rare Candy, 113 Pokégear 3.0, 121 Clavell.

After the corrections the data has 57 Common and 47 Uncommon, an exact match to the chart. Rare (11), Double Rare (13) and everything above already matched, and every R and RR mark read agreed with Chen.

## Numbering

- 001–109: Pokémon (109). 110–113: Items (4). 114–117: Pokémon Tools (4). 118–125: Supporters (8). 126–127: Stadiums (2, Moonlit Hill and Artazon). 128: Special Energy (Reversal Energy). Card types read from the type label on cards 107–128.
- Paldean Tauros appears three times in the main set (015, 022, 073, all Uncommon) and once as an Art Rare (134).
- 13 Double Rares, all Pokémon ex: Meowscarada, Skeledirge, Greninja, Quaquaval, Miraidon, Gardevoir, Lycanroc, Koraidon, Paldean Clodsire, Mabosstiff, Copperajah, Squawkabilly, Grafaiai.
- Cards featured on the official page: Gardevoir ex (with Ralts, Kirlia and Drifblim), Meowscarada ex, Skeledirge ex, Quaquaval ex, Squawkabilly ex, Grafaiai ex, Paldean Clodsire ex, Mabosstiff ex; Erika's Invitation, Artazon, Letter of Encouragement, Rigid Band.

## Secret rares (35)

- 129–136 Art Rare (8): Tropius, Pyroar, Bellibolt, Ralts, Kirlia, Paldean Tauros, Klawf, Flamigo.
- 137–151 Super Rare (15): 8 Pokémon ex (Meowscarada, Skeledirge, Quaquaval, Gardevoir, Lycanroc, Paldean Clodsire, Copperajah, Squawkabilly) and 7 Supporters (Erika's Invitation, Katy, Dendra, Clavell, Saguaro, Judge, Team Star Grunt).
- 152–159 Special Art Rare (8): Meowscarada ex, Skeledirge ex, Quaquaval ex, Gardevoir ex, Squawkabilly ex, Erika's Invitation, Dendra, Saguaro.
- 160–163 Ultra Rare (4, gold): Meowscarada ex, Skeledirge ex, Quaquaval ex, Artazon.

## Exclusives

Chen flags **no** exclusive cards for this set (`exclusiveCardNumbers: []`), so the data uses `[]` and the page does not use the term.

## Fan cards

`['157', '152', '155', '154', '160']`: Erika's Invitation SAR, Meowscarada ex SAR, Gardevoir ex SAR (centre, the cover Pokémon's SAR), Quaquaval ex SAR, gold Meowscarada ex UR. All viewed before picking.

## Not verified

- English or Japanese set matches for each card.
- Box sizes (packs per box) for either pack type: not on Chen or the official page.
