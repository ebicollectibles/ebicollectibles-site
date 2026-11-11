# White Flare: sourcing notes

Source: https://www.chencards.com/sets/white_flare (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: White Flare (白焰迸涌), **CSV10.6C**
- Series: **Chinese Scarlet & Violet Series**. This is an **official Pokémon TCG expansion** (the Simplified Chinese release of the Scarlet & Violet Black Bolt / White Flare pair), not a Gem Pack. Chen's sets list files it under "Chinese Scarlet & Violet Series" with CSV1C–CSV10C, not under "Gem Set". The page URL follows the same pattern as the Gem sets (`/sets/white_flare`).
- Release: 2026-11-06, the **same day** as its twin Black Bolt (CSV10.5C) and as Gem Vol 7
- **174 cards**: 086 numbered in the main set plus 088 secret rares (`printedTotal` on Chen = "086")
- **No pack-odds chart.** Chen shows none for this set (`packOddsImageUrl` and `cardsPerPack` are empty), unlike every Gem set. So there are no official production ratios or cards-per-pack figures here. Get them from the pokemon.cn product page or the box insert before putting odds on the page.

## Structure: a standard numbered set, not a Gem-style ladder

This set is **not** built like any Gem set. There are no per-Pokémon version ladders (`PPVV`), no Gem Pack stamp tier, and no repeated treatments of one card. Every card has a single **collector number `NNN/086`**, 001–174, in the normal official layout: main set first (mixed rarities), then the secret rares, grouped by rarity.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–078 | Pokémon, grouped by type (Grass, Fire, Water, …), Pokédex order within each type | 78 | C, U, R, and RR for the 6 ex |
| 079–085 | Trainers | 7 | U, except the Fossil (081/086), which is C |
| 086 | Special Energy | 1 | U |
| 087–158 | **Art Rare** of every non-ex Pokémon from 001–078, same order | 72 | AR |
| 159–166 | **Super Rare** full arts: the 6 ex + 2 Supporters | 8 | SR |
| 167–173 | **Special Art Rare**: the 6 ex + 1 Supporter | 7 | SAR |
| 174 | **Black White Rare**: Reshiram ex | 1 | BWR |

### Rarity tiers, most common to rarest

| Rank | Tier (Chen's exact string) | Abbr. | Cards | Main set (001–086) | Secret (087–174) | English-print equivalent |
|---|---|---|---|---|---|---|
| 1 | Common (C) | C | 38 | 38 | 0 | Common |
| 2 | Uncommon (U) | U | 32 | 32 | 0 | Uncommon |
| 3 | Rare (R) | R | 10 | 10 | 0 | Rare |
| 4 | Double Rare (RR) | RR | 6 | 6 | 0 | Double Rare |
| 5 | Art Rare (AR) | AR | 72 | 0 | 72 | Illustration Rare |
| 6 | Super Rare (SR) | SR | 8 | 0 | 8 | Ultra Rare (full art) |
| 7 | Special Art Rare (SAR) | SAR | 7 | 0 | 7 | Special Illustration Rare |
| 8 | Black White Rare (BWR) | BWR | 1 | 0 | 1 | Black White Rare (this pair's top tier) |
| | **Total** | | **174** | **86** | **88** | |

This order is the standard modern Chinese/Japanese ladder (C < U < R < RR < AR < SR < SAR, with BWR at the top, where Hyper Rare or UR usually sits). **There's no chart to confirm the ranking**, so it comes from the card numbering and standard practice. It matches the secret-rare numbering order exactly: AR 087–158, then SR, SAR, BWR. **It's an 8-tier scheme, not the Gem 5-tier one.** None of the Gem tier names except "Double Rare" apply, and Chen's strings include the abbreviation in parentheses ("Double Rare (RR)", not "Double Rare"). `rarityOrder` and every card's `rarity` use Chen's exact strings, so any code that looks rarities up by the Gem names ("Triple Rare", or plain "Double Rare") won't match.

**The Gem "rarity repeated at a non-contiguous version" problem doesn't apply**, because there are no versions. In the **main set (001–086)** rarities are mixed, as in any official set: cards follow type then Pokédex order, so C, U, R and RR alternate (e.g. 001 C, 002 C, 003 RR, 004 C). In the **secret block (087–174)** each tier is one unbroken run (AR, then SR, then SAR, then BWR). The **same Pokémon** does appear at several tiers under different numbers, the normal way official sets do alternate arts:

| Card | Main set | AR | SR | SAR | BWR |
|---|---|---|---|---|---|
| Whimsicott ex | 005/086 RR | n/a | 159/086 | 167/086 |  |
| Reshiram ex | 017/086 RR | n/a | 160/086 | 168/086 | 174/086 |
| Keldeo ex | 027/086 RR | n/a | 161/086 | 169/086 |  |
| Jellicent ex | 042/086 RR | n/a | 162/086 | 170/086 |  |
| Hydreigon ex | 062/086 RR | n/a | 163/086 | 171/086 |  |
| Bouffalant ex | 075/086 RR | n/a | 164/086 | 172/086 |  |
| Harlequin (Supporter) | 083/086 U | n/a | 165/086 | n/a | |
| Hilda (Supporter) | 085/086 U | n/a | 166/086 | 173/086 | |

Every **non-ex** Pokémon in 001–078 has exactly one AR, and the 72 ARs (087–158) run in the **same order** as the main set with the ex left out. So there is **no fixed offset** between a card and its AR: the number shifts back by one after each skipped ex (e.g. 001 Sewaddle → 087, 004 Cottonee → 090, 078 Tornadus → 158). The appendix gives each AR's matching main-set number. The ex Pokémon get no AR; they get an SR and an SAR instead.

### Trainer and Energy cards

Types are read from each card's frame header (物品 = Item, 宝可梦道具 = Pokémon Tool, 支援者 = Supporter, 特殊能量 = Special Energy). Chen's data has no card-type field.

| No. | Card | Type | Rarity |
|---|---|---|---|
| 079/086 | Energy Retrieval | Item | Uncommon (U) |
| 080/086 | Tool Scrapper | Item | Uncommon (U) |
| 081/086 | Antique Plume Fossil | Item | Common (C) |
| 082/086 | Brave Bangle | Pokémon Tool | Uncommon (U) |
| 083/086 | Harlequin | Supporter | Uncommon (U) |
| 084/086 | Cheren | Supporter | Uncommon (U) |
| 085/086 | Hilda | Supporter | Uncommon (U) |
| 086/086 | Ignition Energy | Special Energy | Uncommon (U) |

These are ordinary single cards, each appearing once in the main set. There's no interleaved catalog block like the Gem sets' Trainer/Energy groups, and no basic Energy cards at all.

### How this maps onto the Gem schema, and where it doesn't

`src/data/white-flare.json` keeps the `gem-vol-1.json` field names, but several fields can't mean what they mean for a Gem set:

- **`pokemonIndex` = the collector number (1–174) and `version` = 1 for every card.** There is no Pokémon/version ladder to encode. That keeps every card unique and in order, but `pokemonIndex` is **not** a Pokémon grouping here: Sewaddle is 1 and its Art Rare is 87.
- **No `catalogGroups`.** It exists to regroup Gem Trainer/Energy blocks by name. Here every card is its own entry, so the field is left out rather than given a meaningless value.
- **`number` is the official `NNN/086`**, 3 digits. `buildGemSetData` (`src/lib/gem-sets/buildSetData.ts`) assumes the Gem `PPVV/NN` format: it takes `id = number.slice(0, 4)` and `groupId = id.slice(0, 2)`. For `"001/086"` that gives id `"001/"` and puts cards 001–009 into one group "00", 010–019 into "01", and so on. **The existing Gem engine won't render this set correctly as-is.** A page for it needs either a separate component (a flat numbered checklist with rarity filters and an "other versions of this Pokémon" link, matched by name) or engine changes. Its hero copy, odds table and per-Pokémon ladder rows all assume the Gem shape.
- **`rarityOrder` has 8 entries using Chen's exact strings**, see above.
- **`exclusiveCardNumbers` uses the official number** (`173/086`). Note that `173/086` is also the exclusive's number in the twin set; see below.
- **Image filenames** are the collector number zero-padded to 4 digits (`0001.webp`–`0174.webp`) to fit the `NNNN.webp` pattern. They are **not** the Gem `PPVV` ids.

### Relationship to Black Bolt: independent sets, mirror-image structure

- **No shared numbering.** White Flare (CSV10.6C) and Black Bolt (CSV10.5C) each run their own `001/086`–`174/086`, so every number exists in both sets as a different card (e.g. 001/086 is Snivy in Black Bolt and Sewaddle in White Flare). Any lookup or URL must include the set, never the number alone.
- **No shared odds chart**, since Chen shows none for either. Cards-per-pack and production ratios are unknown here for both.
- **Same skeleton.** Both have 78 Pokémon (6 ex), 7 Trainers in the same type order, 1 Special Energy, 72 AR, 8 SR, 7 SAR and 1 BWR. Only Common/Uncommon differ by one (Black Bolt 39 C / 31 U, White Flare 38 C / 32 U). Each set's legendary mascot is its BWR (Zekrom ex vs Reshiram ex), and each set's 173/086 is its single Supporter SAR, which Chen flags as the exclusive.
- The two sets split the Unova Pokédex between them rather than duplicating it. Each Pokémon line appears in one set, e.g. Snivy/Servine/Serperior in Black Bolt and Tepig/Pignite/Emboar in White Flare.

## Chase cards and exclusives

- Chen flags **one** card as exclusive to White Flare: **173/086 Hilda** (Special Art Rare (SAR)), Hilda in close-up with a warm red-orange flare. It is the set's only Trainer SAR. Like the Gem exclusives, Chen's image of it is slightly oversized (320×448) compared with the rest.
- **Top chase:** **174/086 Reshiram ex, Black White Rare**, the set's highest tier and only BWR. It's a monochrome white Reshiram full art.
- **Other chase cards** (my read, not a Chen flag): the 7 SARs (167–173), especially **168/086 Reshiram ex SAR**, then the 8 SRs (159–166) and standout Art Rares.

Image sizes: main-set cards 001–086 that aren't R/RR are 300×418, everything else is 300×419, and 173 is 320×448. These are the largest Chen serves; no higher-resolution originals are published there.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo:** "白焰迸涌" in silver-white lettering with a **flame-red** outline, on a dark plate. Logo swatches: red `#AB312A`, dark maroon `#502B27`, blush `#C49B94`, warm white `#EFE0DB` / `#FDFAF3`, charcoal plate `#1F201F`.
- **Identity:** the **white / Reshiram / flame** half of the pair. The box legend Reshiram ex closes the set as the all-white **Black White Rare** (174/086): almost pure pale grey and white (`#DEDCDB`, `#EEEBEB`, `#F8F6F5`).
- **Overall card palette:** warmer than Black Bolt: rose-brown `#9D7769`, maroon `#734147`, peach `#DBAC84`, with teal `#437074` and navy `#203747` from the Water and Dark cards.
- **SR / SAR chase cards:** warm and dusky: slate `#444859`, steel blue `#5A8898`, rose `#9A5655`, tan `#B08B7A`, gold `#DEBA86`.
- **Suggested page accents:** a **warm white / pale-grey hero** (`#F3F1F0`) with **flame red** (`#AB312A`, which reads fine as text on white) as the main accent and dark maroon `#502B27` for text-weight details. **Don't** use Gem Pack magenta. Pair it with Black Bolt's black and electric blue so the two pages read as a pair.

## Files

- `src/data/white-flare.json`: `gem-vol-1.json` field names, adapted as described above. 174 cards, sorted by collector number. The `image` fields are placeholder R2 paths (`Chinese/White Flare/Cards/NNNN.webp`).
- `white-flare-images/cards/NNNN.webp`: all 174 card images, named by zero-padded collector number.

## Appendix: full card list

| No. | Card | Rarity | Type / note |
|---|---|---|---|
| 001/086 | Sewaddle | Common (C) | Pokémon |
| 002/086 | Swadloon | Common (C) | Pokémon |
| 003/086 | Leavanny | Uncommon (U) | Pokémon |
| 004/086 | Cottonee | Common (C) | Pokémon |
| 005/086 | Whimsicott ex | Double Rare (RR) | Pokémon ex |
| 006/086 | Deerling | Common (C) | Pokémon |
| 007/086 | Sawsbuck | Uncommon (U) | Pokémon |
| 008/086 | Shelmet | Common (C) | Pokémon |
| 009/086 | Accelgor | Uncommon (U) | Pokémon |
| 010/086 | Virizion | Rare (R) | Pokémon |
| 011/086 | Tepig | Common (C) | Pokémon |
| 012/086 | Pignite | Common (C) | Pokémon |
| 013/086 | Emboar | Rare (R) | Pokémon |
| 014/086 | Pansear | Common (C) | Pokémon |
| 015/086 | Simisear | Uncommon (U) | Pokémon |
| 016/086 | Heatmor | Uncommon (U) | Pokémon |
| 017/086 | Reshiram ex | Double Rare (RR) | Pokémon ex |
| 018/086 | Oshawott | Common (C) | Pokémon |
| 019/086 | Dewott | Common (C) | Pokémon |
| 020/086 | Samurott | Rare (R) | Pokémon |
| 021/086 | Basculin | Common (C) | Pokémon |
| 022/086 | Ducklett | Common (C) | Pokémon |
| 023/086 | Swanna | Uncommon (U) | Pokémon |
| 024/086 | Vanillite | Common (C) | Pokémon |
| 025/086 | Vanillish | Common (C) | Pokémon |
| 026/086 | Vanilluxe | Uncommon (U) | Pokémon |
| 027/086 | Keldeo ex | Double Rare (RR) | Pokémon ex |
| 028/086 | Blitzle | Common (C) | Pokémon |
| 029/086 | Zebstrika | Uncommon (U) | Pokémon |
| 030/086 | Joltik | Common (C) | Pokémon |
| 031/086 | Galvantula | Uncommon (U) | Pokémon |
| 032/086 | Stunfisk | Uncommon (U) | Pokémon |
| 033/086 | Woobat | Common (C) | Pokémon |
| 034/086 | Swoobat | Uncommon (U) | Pokémon |
| 035/086 | Sigilyph | Uncommon (U) | Pokémon |
| 036/086 | Yamask | Common (C) | Pokémon |
| 037/086 | Cofagrigus | Rare (R) | Pokémon |
| 038/086 | Gothita | Common (C) | Pokémon |
| 039/086 | Gothorita | Common (C) | Pokémon |
| 040/086 | Gothitelle | Rare (R) | Pokémon |
| 041/086 | Frillish | Common (C) | Pokémon |
| 042/086 | Jellicent ex | Double Rare (RR) | Pokémon ex |
| 043/086 | Roggenrola | Common (C) | Pokémon |
| 044/086 | Boldore | Common (C) | Pokémon |
| 045/086 | Gigalith | Uncommon (U) | Pokémon |
| 046/086 | Sawk | Uncommon (U) | Pokémon |
| 047/086 | Archen | Uncommon (U) | Pokémon |
| 048/086 | Archeops | Rare (R) | Pokémon |
| 049/086 | Mienfoo | Common (C) | Pokémon |
| 050/086 | Mienshao | Uncommon (U) | Pokémon |
| 051/086 | Terrakion | Rare (R) | Pokémon |
| 052/086 | Purrloin | Common (C) | Pokémon |
| 053/086 | Liepard | Uncommon (U) | Pokémon |
| 054/086 | Scraggy | Common (C) | Pokémon |
| 055/086 | Scrafty | Uncommon (U) | Pokémon |
| 056/086 | Trubbish | Common (C) | Pokémon |
| 057/086 | Garbodor | Uncommon (U) | Pokémon |
| 058/086 | Zorua | Common (C) | Pokémon |
| 059/086 | Zoroark | Rare (R) | Pokémon |
| 060/086 | Deino | Common (C) | Pokémon |
| 061/086 | Zweilous | Common (C) | Pokémon |
| 062/086 | Hydreigon ex | Double Rare (RR) | Pokémon ex |
| 063/086 | Ferroseed | Common (C) | Pokémon |
| 064/086 | Ferrothorn | Uncommon (U) | Pokémon |
| 065/086 | Klink | Common (C) | Pokémon |
| 066/086 | Klang | Common (C) | Pokémon |
| 067/086 | Klinklang | Rare (R) | Pokémon |
| 068/086 | Durant | Uncommon (U) | Pokémon |
| 069/086 | Druddigon | Uncommon (U) | Pokémon |
| 070/086 | Patrat | Common (C) | Pokémon |
| 071/086 | Watchog | Uncommon (U) | Pokémon |
| 072/086 | Lillipup | Common (C) | Pokémon |
| 073/086 | Herdier | Common (C) | Pokémon |
| 074/086 | Stoutland | Uncommon (U) | Pokémon |
| 075/086 | Bouffalant ex | Double Rare (RR) | Pokémon ex |
| 076/086 | Rufflet | Common (C) | Pokémon |
| 077/086 | Braviary | Uncommon (U) | Pokémon |
| 078/086 | Tornadus | Rare (R) | Pokémon |
| 079/086 | Energy Retrieval | Uncommon (U) | Item |
| 080/086 | Tool Scrapper | Uncommon (U) | Item |
| 081/086 | Antique Plume Fossil | Common (C) | Item |
| 082/086 | Brave Bangle | Uncommon (U) | Pokémon Tool |
| 083/086 | Harlequin | Uncommon (U) | Supporter |
| 084/086 | Cheren | Uncommon (U) | Supporter |
| 085/086 | Hilda | Uncommon (U) | Supporter |
| 086/086 | Ignition Energy | Uncommon (U) | Special Energy |
| 087/086 | Sewaddle | Art Rare (AR) | Art Rare of 001/086 |
| 088/086 | Swadloon | Art Rare (AR) | Art Rare of 002/086 |
| 089/086 | Leavanny | Art Rare (AR) | Art Rare of 003/086 |
| 090/086 | Cottonee | Art Rare (AR) | Art Rare of 004/086 |
| 091/086 | Deerling | Art Rare (AR) | Art Rare of 006/086 |
| 092/086 | Sawsbuck | Art Rare (AR) | Art Rare of 007/086 |
| 093/086 | Shelmet | Art Rare (AR) | Art Rare of 008/086 |
| 094/086 | Accelgor | Art Rare (AR) | Art Rare of 009/086 |
| 095/086 | Virizion | Art Rare (AR) | Art Rare of 010/086 |
| 096/086 | Tepig | Art Rare (AR) | Art Rare of 011/086 |
| 097/086 | Pignite | Art Rare (AR) | Art Rare of 012/086 |
| 098/086 | Emboar | Art Rare (AR) | Art Rare of 013/086 |
| 099/086 | Pansear | Art Rare (AR) | Art Rare of 014/086 |
| 100/086 | Simisear | Art Rare (AR) | Art Rare of 015/086 |
| 101/086 | Heatmor | Art Rare (AR) | Art Rare of 016/086 |
| 102/086 | Oshawott | Art Rare (AR) | Art Rare of 018/086 |
| 103/086 | Dewott | Art Rare (AR) | Art Rare of 019/086 |
| 104/086 | Samurott | Art Rare (AR) | Art Rare of 020/086 |
| 105/086 | Basculin | Art Rare (AR) | Art Rare of 021/086 |
| 106/086 | Ducklett | Art Rare (AR) | Art Rare of 022/086 |
| 107/086 | Swanna | Art Rare (AR) | Art Rare of 023/086 |
| 108/086 | Vanillite | Art Rare (AR) | Art Rare of 024/086 |
| 109/086 | Vanillish | Art Rare (AR) | Art Rare of 025/086 |
| 110/086 | Vanilluxe | Art Rare (AR) | Art Rare of 026/086 |
| 111/086 | Blitzle | Art Rare (AR) | Art Rare of 028/086 |
| 112/086 | Zebstrika | Art Rare (AR) | Art Rare of 029/086 |
| 113/086 | Joltik | Art Rare (AR) | Art Rare of 030/086 |
| 114/086 | Galvantula | Art Rare (AR) | Art Rare of 031/086 |
| 115/086 | Stunfisk | Art Rare (AR) | Art Rare of 032/086 |
| 116/086 | Woobat | Art Rare (AR) | Art Rare of 033/086 |
| 117/086 | Swoobat | Art Rare (AR) | Art Rare of 034/086 |
| 118/086 | Sigilyph | Art Rare (AR) | Art Rare of 035/086 |
| 119/086 | Yamask | Art Rare (AR) | Art Rare of 036/086 |
| 120/086 | Cofagrigus | Art Rare (AR) | Art Rare of 037/086 |
| 121/086 | Gothita | Art Rare (AR) | Art Rare of 038/086 |
| 122/086 | Gothorita | Art Rare (AR) | Art Rare of 039/086 |
| 123/086 | Gothitelle | Art Rare (AR) | Art Rare of 040/086 |
| 124/086 | Frillish | Art Rare (AR) | Art Rare of 041/086 |
| 125/086 | Roggenrola | Art Rare (AR) | Art Rare of 043/086 |
| 126/086 | Boldore | Art Rare (AR) | Art Rare of 044/086 |
| 127/086 | Gigalith | Art Rare (AR) | Art Rare of 045/086 |
| 128/086 | Sawk | Art Rare (AR) | Art Rare of 046/086 |
| 129/086 | Archen | Art Rare (AR) | Art Rare of 047/086 |
| 130/086 | Archeops | Art Rare (AR) | Art Rare of 048/086 |
| 131/086 | Mienfoo | Art Rare (AR) | Art Rare of 049/086 |
| 132/086 | Mienshao | Art Rare (AR) | Art Rare of 050/086 |
| 133/086 | Terrakion | Art Rare (AR) | Art Rare of 051/086 |
| 134/086 | Purrloin | Art Rare (AR) | Art Rare of 052/086 |
| 135/086 | Liepard | Art Rare (AR) | Art Rare of 053/086 |
| 136/086 | Scraggy | Art Rare (AR) | Art Rare of 054/086 |
| 137/086 | Scrafty | Art Rare (AR) | Art Rare of 055/086 |
| 138/086 | Trubbish | Art Rare (AR) | Art Rare of 056/086 |
| 139/086 | Garbodor | Art Rare (AR) | Art Rare of 057/086 |
| 140/086 | Zorua | Art Rare (AR) | Art Rare of 058/086 |
| 141/086 | Zoroark | Art Rare (AR) | Art Rare of 059/086 |
| 142/086 | Deino | Art Rare (AR) | Art Rare of 060/086 |
| 143/086 | Zweilous | Art Rare (AR) | Art Rare of 061/086 |
| 144/086 | Ferroseed | Art Rare (AR) | Art Rare of 063/086 |
| 145/086 | Ferrothorn | Art Rare (AR) | Art Rare of 064/086 |
| 146/086 | Klink | Art Rare (AR) | Art Rare of 065/086 |
| 147/086 | Klang | Art Rare (AR) | Art Rare of 066/086 |
| 148/086 | Klinklang | Art Rare (AR) | Art Rare of 067/086 |
| 149/086 | Durant | Art Rare (AR) | Art Rare of 068/086 |
| 150/086 | Druddigon | Art Rare (AR) | Art Rare of 069/086 |
| 151/086 | Patrat | Art Rare (AR) | Art Rare of 070/086 |
| 152/086 | Watchog | Art Rare (AR) | Art Rare of 071/086 |
| 153/086 | Lillipup | Art Rare (AR) | Art Rare of 072/086 |
| 154/086 | Herdier | Art Rare (AR) | Art Rare of 073/086 |
| 155/086 | Stoutland | Art Rare (AR) | Art Rare of 074/086 |
| 156/086 | Rufflet | Art Rare (AR) | Art Rare of 076/086 |
| 157/086 | Braviary | Art Rare (AR) | Art Rare of 077/086 |
| 158/086 | Tornadus | Art Rare (AR) | Art Rare of 078/086 |
| 159/086 | Whimsicott ex | Super Rare (SR) | full art |
| 160/086 | Reshiram ex | Super Rare (SR) | full art |
| 161/086 | Keldeo ex | Super Rare (SR) | full art |
| 162/086 | Jellicent ex | Super Rare (SR) | full art |
| 163/086 | Hydreigon ex | Super Rare (SR) | full art |
| 164/086 | Bouffalant ex | Super Rare (SR) | full art |
| 165/086 | Harlequin | Super Rare (SR) | full art, Supporter |
| 166/086 | Hilda | Super Rare (SR) | full art, Supporter |
| 167/086 | Whimsicott ex | Special Art Rare (SAR) | special art |
| 168/086 | Reshiram ex | Special Art Rare (SAR) | special art |
| 169/086 | Keldeo ex | Special Art Rare (SAR) | special art |
| 170/086 | Jellicent ex | Special Art Rare (SAR) | special art |
| 171/086 | Hydreigon ex | Special Art Rare (SAR) | special art |
| 172/086 | Bouffalant ex | Special Art Rare (SAR) | special art |
| 173/086 | Hilda | Special Art Rare (SAR) | special art, Supporter, **exclusive (Chen)** |
| 174/086 | Reshiram ex | Black White Rare (BWR) | Black White Rare, monochrome full art |
