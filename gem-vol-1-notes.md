# Gem Vol 1: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_1 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 1, **CBB1C**, Gem Set series, Simplified Chinese
- Release: 2025-01-17
- **115 cards**, 4 holo cards per pack (from the official odds chart)
- The first Gem Pack: the **Paldea starters** (Sprigatito, Fuecoco, Quaxly and their middle evolutions) with **Captain Pikachu**, tied to the Pokémon Horizons anime, plus 9 other Pokémon and Trainer and Energy blocks

## Structure: irregular, a fourth pattern

Vol 1 matches **none** of the earlier patterns. It isn't Vols 4–7's 28 × 7, Vol 3's 18 × 7, or Vol 2's 9 × 14/15. Its Pokémon blocks come in **three ladder lengths, each with its own denominator** (`/09`, `/08`, `/05`), and the `/09` and `/08` groups **alternate** in the numbering. Like Vols 2 and 3, it has separate Trainer and Energy catalog blocks.

### Pokémon blocks: 16 Pokémon, groups 01–16

| Group | Pokémon | Numbering | Versions |
|---|---|---|---|
| 01 | Sprigatito | `01VV/09` | 9 |
| 02 | Floragato | `02VV/08` | 8 |
| 03 | Fuecoco | `03VV/09` | 9 |
| 04 | Crocalor | `04VV/08` | 8 |
| 05 | Quaxly | `05VV/09` | 9 |
| 06 | Quaxwell | `06VV/08` | 8 |
| 07 | Captain Pikachu | `07VV/09` | 9 |
| 08 | Vulpix | `08VV/05` | 5 |
| 09 | Pawmo | `09VV/05` | 5 |
| 10 | Fidough | `10VV/05` | 5 |
| 11 | Sudowoodo | `11VV/05` | 5 |
| 12 | Rockruff | `12VV/05` | 5 |
| 13 | Paldean Wooper | `13VV/05` | 5 |
| 14 | Maschiff | `14VV/05` | 5 |
| 15 | Chansey | `15VV/05` | 5 |
| 16 | Lechonk | `16VV/05` | 5 |

**Mixed denominators:** `/09` for the 3 basic starters and Captain Pikachu (01, 03, 05, 07), `/08` for the 3 middle evolutions (02, 04, 06), and `/05` for groups 08–16. So the first 7 groups alternate 9, 8, 9, 8, 9, 8, 9 versions.

The three ladders:

| Version | `/09` (01, 03, 05, 07) | `/08` (02, 04, 06) | `/05` (08–16) |
|---|---|---|---|
| 01 | ● Common, base card | ● Common, base card | ● Common, base card |
| 02 | ● Common | ● Common | ● Common |
| 03 | ◆ Uncommon | ◆ Uncommon | ◆ Uncommon |
| 04 | ◆ Uncommon | ◆ Uncommon | ★ Rare |
| 05 | ★ Rare | ★ Rare | ★★ Double Rare (Gem Pack stamp) |
| 06 | ★ Rare, **shiny-style card** | ★ Rare, **shiny-style art** | n/a |
| 07 | ★★ Double Rare (Gem Pack stamp) | ★★ Double Rare (Gem Pack stamp) | n/a |
| 08 | ★★★ Triple Rare, illustration full art | ★★★ Triple Rare, illustration full art | n/a |
| 09 | ★★★ Triple Rare, **Horizons full art (exclusive)** | n/a | n/a |

Details to watch:

- **No rarity repeats at a non-contiguous version.** I checked every Pokémon group in the data: each ladder runs strictly Common → Uncommon → Rare → Double Rare → Triple Rare with no gaps or returns. Vol 1 has **no V or ex cards**, so there's nothing like Vol 2's "Rare at 09, 10 and 13" or Vol 3's "Rare at 05 and 07". The irregularity is in the ladder lengths and in which **card** sits at each slot, not in the rarity order.
- **Version 06 is a different card in the `/09` groups.** For the four basics, v06 is a separate card with shiny-coloured art and a star-sparkle frame, and different HP and attacks from v01. For example, Fuecoco v01 is 90 HP while v06 is a pink shiny Fuecoco at 80 HP, and Quaxly v01 is 60 HP while v06 is 70 HP. In the `/08` middle evolutions, v06 also uses the shiny star-frame art, but its HP and attacks match v01, so it's a shiny-art version of the same card. Versions 01–05 and 07 are the base card in every group; v07 adds the Gem Pack logo stamp.
- **Which card each v08 full art reprints varies**, from visual inspection of the card text. Sprigatito 0108 and Pikachu 0708 reprint the **v06** card; Fuecoco 0308 and Quaxly 0508 reprint the **v01** card. I didn't verify this for the `/08` groups. The data has no field for it, so this is only a note.
- **Names change inside group 07.** Group 07 is "Captain Pikachu", but **0706/09 and 0708/09 are named plain "Pikachu"**. They are a different card: an ordinary Pikachu, with shiny-style art at v06 and an illustration full art at v08. The other seven cards in the group (0701–0705, 0707, 0709) are "Captain Pikachu". This is a real difference in the cards, not a Chen naming error. The engine's adjacency grouping by prefix keeps all 9 together, which is right, so group 07 must **not** be in `catalogGroups`. A page that splits `owner`/`mon` on "'s " is unaffected, since neither name contains it.
- **The engine's derived labels will be wrong for most groups.** `buildGemSetData` takes `versionsPerMon` and `rarityVersionLabels` from the **first** group and `versionSuffix` from the first card. With cards sorted by number, that's Sprigatito: 9 versions, `/09`, labels Common 01–02, Uncommon 03–04, Rare 05–06, Double Rare 07, Triple Rare 08–09. Those labels are wrong for the `/08` groups (Triple Rare is 08 only) and very wrong for the nine `/05` groups (Rare 04, Double Rare 05). `monCount` would also count the Trainer and Energy groups. Each card's own `suffix` is still right. The route config will need to override the hero copy and odds-table labels, as Vols 2 and 3 do.

### Trainer block: catalog group 17, `17VV/04`

Four different cards: **Poké Ball**, **Great Ball** and **Ultra Ball** (★★ Double Rare, Items, each with the Gem Pack stamp) and **Nemona** (★★★ Triple Rare, full-art Supporter).

### Energy block: catalog group 18, `18VV/06`

Six Triple Rares: three basic Energy types, each printed twice, and the two printings of a type are **not adjacent**. They interleave G, F, W, G, F, W:

- Basic Grass Energy: **1801** and **1804**
- Basic Fire Energy: **1802** and **1805**
- Basic Water Energy: **1803** and **1806**

So `catalogGroups: [17, 18]`, the same mechanism as Vol 3's `[19, 20]` and Vol 2's `[10, 11]`. The Trainer and Energy groups are **17 and 18** here. In Chen's images, 1805 and 1806 carry the Gem Pack stamp.

### Rarity counts and odds

| Rarity | Symbol | Cards | Which cards | Production ratio |
|---|---|---|---|---|
| Common | ● | 32 | v01–02 × 16 | 50.00% |
| Uncommon | ◆ | 23 | v03–04 × 7 (`/09`, `/08`) + v03 × 9 (`/05`) | 25.00% |
| Rare | ★ | 23 | v05–06 × 7 + v04 × 9 | 17.90% |
| Double Rare | ★★ | 19 | v07 × 7 + v05 × 9 + 3 Ball Trainers | 4.93% |
| Triple Rare | ★★★ | 18 | 7 v08 full arts + 4 v09 Horizons full arts + Nemona + 6 Energies | 2.17% (combined) |

From the official pokemon.cn chart (https://www.pokemon.cn/tcg/product/15582.html; the image is Pokémon's own, so it isn't included). The chart splits the 18 Triple Rares into **11 illustration-rare Pokémon holos** (7 v08 + 4 v09), **4 non-gold-foil** and **3 gold-foil** holos. The last 7 are Nemona plus the 6 Energies, but neither Chen nor the chart says which 3 are gold-foil, so confirm against physical cards before labeling any of them. These odds differ from every other Gem set: Rare 17.90% and Double Rare 4.93%. The 2.17% Triple Rare rate matches Vol 2 only.

## Chase cards and exclusives

Chen flags **four** cards as exclusive to Gem Vol 1: the four version-09 full arts, which are also the only version-09 cards in the set. All four carry the **Pokémon Horizons** logo stamp and show the anime cast. It's the same idea as Vol 5's four Horizons exclusives, which feature these Pokémon's evolutions with the same trainers.

| No. | Card | Art |
|---|---|---|
| 0109/09 | Sprigatito | with Liko |
| 0309/09 | Fuecoco | with Roy |
| 0509/09 | Quaxly | among stars, with a Pokémon companion |
| 0709/09 | Captain Pikachu | with Friede |

Other cards collectors are likely to chase (my read, not a Chen flag): the seven **v08 illustration full arts**, especially plain **Pikachu 0708/09** (with Sprigatito and other Pokémon in a flower field) and **Sprigatito 0108/09**, the **Nemona** full-art Supporter, and the shiny-style **v06** basics.

All 115 images are 300×419. None are oversized.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo / Gem Pack brand:** the same magenta as Vols 2–6. Main `#C21A76`, bright `#DC057B`, soft `#D65AA0`.
- **Overall card palette:** the bright, warm **starter trio**, grass green, fire orange and water blue, plus Pikachu's yellow. Overall swatches: sun yellow `#E0C15B`, sea teal `#42908B`, aqua `#6EB9B4`, sage `#AEC4AB`, brick `#A05850`, deep slate `#385154` and tan `#B49476`.
- **Triple Rare full arts:** sunny and pastel: pale sage `#C5C8AD`, teal `#558882`, slate blue `#384D5C`, warm gold `#E9CA80`, rose-brick `#9B5054` and peach `#C4926D`.
- **Frame colors by Pokémon** (from each Pokémon's version 01):
  - Grass green: 01 Sprigatito `#CCD650`, 02 Floragato `#C7D050`
  - Fire orange/tan: 03 Fuecoco `#E6B889`, 04 Crocalor `#E9BA8A`, 08 Vulpix `#E6B888`
  - Water blue: 05 Quaxly `#97CAE0`, 06 Quaxwell `#9AD0E7`
  - Pale yellow: 07 Captain Pikachu `#EFDD83`, 09 Pawmo `#EBDA81`
  - Pink: 10 Fidough `#D7ADC5`
  - Gold: 11 Sudowoodo `#E2BC3D`, 12 Rockruff `#E9C13D`
  - Deep teal: 13 Paldean Wooper `#1588A5`, 14 Maschiff `#1287A3`
  - Silver/white: 15 Chansey `#E4E3E1`, 16 Lechonk `#E7E7E5`
- **Suggested page accents:** Gem Pack magenta as the main accent on a clean light page, with the **starter trio** (grass `#CCD650`, fire `#E6B889`, water `#97CAE0`) as small chips or rules for the 01–06 rows, and Pikachu yellow for row 07. The trio colors are too light for text, so use deep slate (`#384D5C`) for text-weight accents. That gives the first Gem set a bright, "starting out" identity distinct from Vol 2 (rainbow and forest teal), Vol 3 (night navy and lantern), Vol 4 (coral), Vol 5 (gold), Vol 6 (green) and Vol 7 (plum and blue).

## Files

- `src/data/gem-vol-1.json`: same schema as `gem-vol-2.json`, including `catalogGroups: [17, 18]`. 115 cards, sorted by number. Chen's page lists Trainers, then the `/05` Pokémon, Energies, `/08` Pokémon and `/09` Pokémon. The `image` fields are placeholder R2 paths (`Chinese/Gem 1/Cards/NNNN.webp`).
- `gem-vol-1-images/cards/NNNN.webp`: all 115 card images, 300×419, the largest Chen serves.

## Appendix: full card list

The "shiny-style" and "illustration full art" notes come from visual inspection, not Chen's data.

| No. | Card | Rarity | Note |
|---|---|---|---|
| 0101/09 | Sprigatito | ● Common | base card |
| 0102/09 | Sprigatito | ● Common | base card |
| 0103/09 | Sprigatito | ◆ Uncommon | base card |
| 0104/09 | Sprigatito | ◆ Uncommon | base card |
| 0105/09 | Sprigatito | ★ Rare | base card |
| 0106/09 | Sprigatito | ★ Rare | shiny-style card (a different card from v01) |
| 0107/09 | Sprigatito | ★★ Double Rare | base card, Gem Pack stamp |
| 0108/09 | Sprigatito | ★★★ Triple Rare | illustration full art |
| 0109/09 | Sprigatito | ★★★ Triple Rare | Pokémon Horizons full art, **exclusive** |
| 0201/08 | Floragato | ● Common | base card |
| 0202/08 | Floragato | ● Common | base card |
| 0203/08 | Floragato | ◆ Uncommon | base card |
| 0204/08 | Floragato | ◆ Uncommon | base card |
| 0205/08 | Floragato | ★ Rare | base card |
| 0206/08 | Floragato | ★ Rare | shiny-style art (same attacks as v01) |
| 0207/08 | Floragato | ★★ Double Rare | base card, Gem Pack stamp |
| 0208/08 | Floragato | ★★★ Triple Rare | illustration full art |
| 0301/09 | Fuecoco | ● Common | base card |
| 0302/09 | Fuecoco | ● Common | base card |
| 0303/09 | Fuecoco | ◆ Uncommon | base card |
| 0304/09 | Fuecoco | ◆ Uncommon | base card |
| 0305/09 | Fuecoco | ★ Rare | base card |
| 0306/09 | Fuecoco | ★ Rare | shiny-style card (a different card from v01) |
| 0307/09 | Fuecoco | ★★ Double Rare | base card, Gem Pack stamp |
| 0308/09 | Fuecoco | ★★★ Triple Rare | illustration full art |
| 0309/09 | Fuecoco | ★★★ Triple Rare | Pokémon Horizons full art, **exclusive** |
| 0401/08 | Crocalor | ● Common | base card |
| 0402/08 | Crocalor | ● Common | base card |
| 0403/08 | Crocalor | ◆ Uncommon | base card |
| 0404/08 | Crocalor | ◆ Uncommon | base card |
| 0405/08 | Crocalor | ★ Rare | base card |
| 0406/08 | Crocalor | ★ Rare | shiny-style art (same attacks as v01) |
| 0407/08 | Crocalor | ★★ Double Rare | base card, Gem Pack stamp |
| 0408/08 | Crocalor | ★★★ Triple Rare | illustration full art |
| 0501/09 | Quaxly | ● Common | base card |
| 0502/09 | Quaxly | ● Common | base card |
| 0503/09 | Quaxly | ◆ Uncommon | base card |
| 0504/09 | Quaxly | ◆ Uncommon | base card |
| 0505/09 | Quaxly | ★ Rare | base card |
| 0506/09 | Quaxly | ★ Rare | shiny-style card (a different card from v01) |
| 0507/09 | Quaxly | ★★ Double Rare | base card, Gem Pack stamp |
| 0508/09 | Quaxly | ★★★ Triple Rare | illustration full art |
| 0509/09 | Quaxly | ★★★ Triple Rare | Pokémon Horizons full art, **exclusive** |
| 0601/08 | Quaxwell | ● Common | base card |
| 0602/08 | Quaxwell | ● Common | base card |
| 0603/08 | Quaxwell | ◆ Uncommon | base card |
| 0604/08 | Quaxwell | ◆ Uncommon | base card |
| 0605/08 | Quaxwell | ★ Rare | base card |
| 0606/08 | Quaxwell | ★ Rare | shiny-style art (same attacks as v01) |
| 0607/08 | Quaxwell | ★★ Double Rare | base card, Gem Pack stamp |
| 0608/08 | Quaxwell | ★★★ Triple Rare | illustration full art |
| 0701/09 | Captain Pikachu | ● Common | base card |
| 0702/09 | Captain Pikachu | ● Common | base card |
| 0703/09 | Captain Pikachu | ◆ Uncommon | base card |
| 0704/09 | Captain Pikachu | ◆ Uncommon | base card |
| 0705/09 | Captain Pikachu | ★ Rare | base card |
| 0706/09 | Pikachu | ★ Rare | shiny-style card (a different card from v01) |
| 0707/09 | Captain Pikachu | ★★ Double Rare | base card, Gem Pack stamp |
| 0708/09 | Pikachu | ★★★ Triple Rare | illustration full art |
| 0709/09 | Captain Pikachu | ★★★ Triple Rare | Pokémon Horizons full art, **exclusive** |
| 0801/05 | Vulpix | ● Common | base card |
| 0802/05 | Vulpix | ● Common | base card |
| 0803/05 | Vulpix | ◆ Uncommon | base card |
| 0804/05 | Vulpix | ★ Rare | base card |
| 0805/05 | Vulpix | ★★ Double Rare | base card, Gem Pack stamp |
| 0901/05 | Pawmo | ● Common | base card |
| 0902/05 | Pawmo | ● Common | base card |
| 0903/05 | Pawmo | ◆ Uncommon | base card |
| 0904/05 | Pawmo | ★ Rare | base card |
| 0905/05 | Pawmo | ★★ Double Rare | base card, Gem Pack stamp |
| 1001/05 | Fidough | ● Common | base card |
| 1002/05 | Fidough | ● Common | base card |
| 1003/05 | Fidough | ◆ Uncommon | base card |
| 1004/05 | Fidough | ★ Rare | base card |
| 1005/05 | Fidough | ★★ Double Rare | base card, Gem Pack stamp |
| 1101/05 | Sudowoodo | ● Common | base card |
| 1102/05 | Sudowoodo | ● Common | base card |
| 1103/05 | Sudowoodo | ◆ Uncommon | base card |
| 1104/05 | Sudowoodo | ★ Rare | base card |
| 1105/05 | Sudowoodo | ★★ Double Rare | base card, Gem Pack stamp |
| 1201/05 | Rockruff | ● Common | base card |
| 1202/05 | Rockruff | ● Common | base card |
| 1203/05 | Rockruff | ◆ Uncommon | base card |
| 1204/05 | Rockruff | ★ Rare | base card |
| 1205/05 | Rockruff | ★★ Double Rare | base card, Gem Pack stamp |
| 1301/05 | Paldean Wooper | ● Common | base card |
| 1302/05 | Paldean Wooper | ● Common | base card |
| 1303/05 | Paldean Wooper | ◆ Uncommon | base card |
| 1304/05 | Paldean Wooper | ★ Rare | base card |
| 1305/05 | Paldean Wooper | ★★ Double Rare | base card, Gem Pack stamp |
| 1401/05 | Maschiff | ● Common | base card |
| 1402/05 | Maschiff | ● Common | base card |
| 1403/05 | Maschiff | ◆ Uncommon | base card |
| 1404/05 | Maschiff | ★ Rare | base card |
| 1405/05 | Maschiff | ★★ Double Rare | base card, Gem Pack stamp |
| 1501/05 | Chansey | ● Common | base card |
| 1502/05 | Chansey | ● Common | base card |
| 1503/05 | Chansey | ◆ Uncommon | base card |
| 1504/05 | Chansey | ★ Rare | base card |
| 1505/05 | Chansey | ★★ Double Rare | base card, Gem Pack stamp |
| 1601/05 | Lechonk | ● Common | base card |
| 1602/05 | Lechonk | ● Common | base card |
| 1603/05 | Lechonk | ◆ Uncommon | base card |
| 1604/05 | Lechonk | ★ Rare | base card |
| 1605/05 | Lechonk | ★★ Double Rare | base card, Gem Pack stamp |
| 1701/04 | Poké Ball | ★★ Double Rare | Item |
| 1702/04 | Great Ball | ★★ Double Rare | Item |
| 1703/04 | Ultra Ball | ★★ Double Rare | Item |
| 1704/04 | Nemona | ★★★ Triple Rare | Supporter, full art |
| 1801/06 | Basic Grass Energy | ★★★ Triple Rare | printing 1 |
| 1802/06 | Basic Fire Energy | ★★★ Triple Rare | printing 1 |
| 1803/06 | Basic Water Energy | ★★★ Triple Rare | printing 1 |
| 1804/06 | Basic Grass Energy | ★★★ Triple Rare | printing 2 |
| 1805/06 | Basic Fire Energy | ★★★ Triple Rare | printing 2 |
| 1806/06 | Basic Water Energy | ★★★ Triple Rare | printing 2 |
