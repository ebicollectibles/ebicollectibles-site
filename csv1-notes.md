# Eternal Birth CSV1: sourcing notes

Source: https://www.chencards.com/sets/eternal_birth (Chen Cards, used with permission), fetched 2026-11-19. Chen's `/sets/csv1c` URL is an empty page; the set lives under the English-name slug (the page's own `code` field is `CSV1C`).

## Set facts

- Name: **Eternal Birth** (亘古开来). Official set code: **CSV1C**. Files: `src/data/csv1.json`, `slug: "csv1"`, page `/sets/chinese/eternal-birth-csv1`.
- Series: **Chinese Scarlet & Violet Series**, a main numbered expansion, not a Gem Pack. The official page calls it the first expansion (第一弹补充包) of the Scarlet & Violet series, the point where the Simplified Chinese game moved on from Sword & Shield. Language: Simplified Chinese.
- Release: **2025-01-17** (Chen and the official page agree; official announcement dated 2024-12-22).
- **167 cards**: `001/127`–`127/127` main set + `128/127`–`167/127` secret rares (printed total **127**).
- Official page: https://www.pokemon.cn/tcg/product/15585.html (Chen's `packOddsSourceUrl`). Odds chart image: Chen's `set-odds/csv1c.webp`.
- Packs (official page): a **5-card pack with 1 holo** and a **20-card pack with 6 holos**. The odds chart is for the 5-card pack: 4 non-holo (C/U) + 1 holo. Each pack also carries one extra slip: a Pokémon UNITE (宝可梦大集结) campaign or item code card for Miraidon items.
- Pack art: **Miraidon** (viewed on the official page: Miraidon with yellow lightning over a blue city, same art on both pack sizes).
- Images: every card image came from Chen (167 of 167, no failures; 300 px wide WebP, 418 or 419 px tall, re-encoded at quality 82). R2 path: `Chinese/Eternal Birth CSV1/Cards/NNNN.webp`. Local folder `csv1-images/cards/` is untracked.

## Rarity tiers, most common to rarest

| Rank | Chart tier | String in the data | Kinds (chart) | Cards here | Production share (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 55 | 55 | 80% (C + U, the 4 non-holo slots) |
| 2 | Uncommon | Uncommon (U) | 43 | 43 | ↑ |
| 3 | Poké Ball pattern holo (精灵球纹样) | *not on Chen* | 113 | 0 | 14.53% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 15 | 15 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 14 | 14 | 4.74% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 8 | 8 | ↑ |
| 7 | Master Ball pattern holo (大师球纹样) | *not on Chen* | 113 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | 17 | 17 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | 11 | 11 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | 4 | 4 | ↑ |

The chart's footnote says the Poké Ball and Master Ball pattern holos are the C, U and R cards (55 + 43 + 15 = 113) with a different finish. They are parallels and have no separate numbers, so they are not in the data.

## Rarity corrections made to Chen's data

Chen listed 53 Common and 45 Uncommon; the official chart says 55 and 43. Cards from this set do print a letter mark after the collector number. I enlarged that mark on all 127 main-set cards (contact sheets, 8 per row) and read each one:

- Chen says Uncommon, card prints **C** (6): 007 Dartrix, 010 Floragato, 025 Crocalor, 036 Quaxwell, 066 Tinkatuff, 082 Stonjourner.
- Chen says Common, card prints **U** (4): 108 Crushing Hammer, 109 Super Rod, 111 Pal Pad, 113 Switch.

After the corrections the data has 55 Common and 43 Uncommon, an exact match to the chart. Rare (15), Double Rare (14) and everything above already matched, and every R and RR mark read agreed with Chen.

## Numbering

- 001–106: Pokémon (106). 107–113: Items (7). 114–118: Pokémon Tools (5). 119–125: Supporters (7). 126: Stadium (1, Mesagoza). 127: Special Energy (Luminous Energy). Card types read from the type label on cards 104–127.
- Professor's Research appears twice in the main set, 121 (Professor Sada) and 122 (Professor Turo), both Rare, and again as SR 148 and 149.
- 14 Double Rares, all Pokémon ex: Decidueye, Spidops, Victini, Magnezone, Miraidon, Banette, Tinkaton, Lucario, Great Tusk, Koraidon, Absol, Toxicroak, Iron Treads, Cyclizar.
- Cards featured on the official page: Miraidon ex, Koraidon ex, Absol ex, Tinkaton ex; Giovanni's Charisma, Electric Generator, Bravery Charm, Mesagoza. It also notes the Sprigatito, Fuecoco and Quaxly lines are in this set.

## Secret rares (40)

- 128–135 Art Rare (8): Tarountula, Dolliv, Wiglett, Wugtrio, Dondozo, Tinkatink, Tinkatuff, Grafaiai.
- 136–152 Super Rare (17): 10 Pokémon ex (Spidops, Magnezone, Miraidon, Banette, Tinkaton, Great Tusk, Koraidon, Absol, Toxicroak, Iron Treads) and 7 Supporters (Giovanni's Charisma, Jacq, Professor's Research ×2, Arven, Penny, Miriam).
- 153–163 Special Art Rare (11): Spidops ex, Miraidon ex, Tinkaton ex, Great Tusk ex, Koraidon ex, Iron Treads ex, Giovanni's Charisma, Jacq, Arven, Penny, Miriam.
- 164–167 Ultra Rare (4, gold): Miraidon ex, Koraidon ex, Super Rod, Switch.

## Exclusives

Chen flags **no** exclusive cards for this set (`exclusiveCardNumbers: []`), so the data uses `[]` and the page does not use the term.

## Fan cards

`['163', '157', '154', '155', '164']`: Miriam SAR, Koraidon ex SAR, Miraidon ex SAR (centre, the lead SAR), Tinkaton ex SAR, gold Miraidon ex UR. All viewed before picking.

## Not verified

- English or Japanese set matches for each card.
- Box sizes (packs per box) for either pack type: not on Chen or the official page.
