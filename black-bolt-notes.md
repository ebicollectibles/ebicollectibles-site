# Black Bolt: sourcing notes

Source: https://www.chencards.com/sets/black_bolt (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Black Bolt (黑雷奔流), **CSV10.5C**
- Series: **Chinese Scarlet & Violet Series**. This is an **official Pokémon TCG expansion** (the Simplified Chinese release of the Scarlet & Violet Black Bolt / White Flare pair), not a Gem Pack. Chen's sets list files it under "Chinese Scarlet & Violet Series" with CSV1C–CSV10C, not under "Gem Set". The page URL follows the same pattern as the Gem sets (`/sets/black_bolt`).
- Release: 2026-11-06, the **same day** as its twin White Flare (CSV10.6C) and as Gem Vol 7
- **174 cards**: 086 numbered in the main set plus 088 secret rares (`printedTotal` on Chen = "086")
- **No pack-odds chart.** Chen shows none for this set (`packOddsImageUrl` and `cardsPerPack` are empty), unlike every Gem set. So there are no official production ratios or cards-per-pack figures here. Get them from the pokemon.cn product page or the box insert before putting odds on the page.

## Structure: a standard numbered set, not a Gem-style ladder

This set is **not** built like any Gem set. There are no per-Pokémon version ladders (`PPVV`), no Gem Pack stamp tier, and no repeated treatments of one card. Every card has a single **collector number `NNN/086`**, 001–174, in the normal official layout: main set first (mixed rarities), then the secret rares, grouped by rarity.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–078 | Pokémon, grouped by type (Grass, Fire, Water, …), Pokédex order within each type | 78 | C, U, R, and RR for the 6 ex |
| 079–085 | Trainers | 7 | U, except the Fossil (080/086), which is C |
| 086 | Special Energy | 1 | U |
| 087–158 | **Art Rare** of every non-ex Pokémon from 001–078, same order | 72 | AR |
| 159–166 | **Super Rare** full arts: the 6 ex + 2 Supporters | 8 | SR |
| 167–173 | **Special Art Rare**: the 6 ex + 1 Supporter | 7 | SAR |
| 174 | **Black White Rare**: Zekrom ex | 1 | BWR |

### Rarity tiers, most common to rarest

| Rank | Tier (Chen's exact string) | Abbr. | Cards | Main set (001–086) | Secret (087–174) | English-print equivalent |
|---|---|---|---|---|---|---|
| 1 | Common (C) | C | 39 | 39 | 0 | Common |
| 2 | Uncommon (U) | U | 31 | 31 | 0 | Uncommon |
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
| Serperior ex | 003/086 RR | n/a | 159/086 | 167/086 |  |
| Kyurem ex | 031/086 RR | n/a | 160/086 | 168/086 |  |
| Zekrom ex | 037/086 RR | n/a | 161/086 | 169/086 | 174/086 |
| Meloetta ex | 047/086 RR | n/a | 162/086 | 170/086 |  |
| Excadrill ex | 049/086 RR | n/a | 163/086 | 171/086 |  |
| Genesect ex | 069/086 RR | n/a | 164/086 | 172/086 |  |
| N's Plan (Supporter) | 083/086 U | n/a | 165/086 | 173/086 | |
| Fennel (Supporter) | 085/086 U | n/a | 166/086 | n/a | |

Every **non-ex** Pokémon in 001–078 has exactly one AR, and the 72 ARs (087–158) run in the **same order** as the main set with the ex left out. So there is **no fixed offset** between a card and its AR: the number shifts back by one after each skipped ex (e.g. 001 Snivy → 087, 005 Simisage → 090, 078 Cinccino → 158). The appendix gives each AR's matching main-set number. The ex Pokémon get no AR; they get an SR and an SAR instead.

### Trainer and Energy cards

Types are read from each card's frame header (物品 = Item, 宝可梦道具 = Pokémon Tool, 支援者 = Supporter, 特殊能量 = Special Energy). Chen's data has no card-type field.

| No. | Card | Type | Rarity |
|---|---|---|---|
| 079/086 | Energy Coin | Item | Uncommon (U) |
| 080/086 | Antique Cover Fossil | Item | Common (C) |
| 081/086 | Pokégear 3.0 | Item | Uncommon (U) |
| 082/086 | Air Balloon | Pokémon Tool | Uncommon (U) |
| 083/086 | N's Plan | Supporter | Uncommon (U) |
| 084/086 | Professor's Research | Supporter | Uncommon (U) |
| 085/086 | Fennel | Supporter | Uncommon (U) |
| 086/086 | Prism Energy | Special Energy | Uncommon (U) |

These are ordinary single cards, each appearing once in the main set. There's no interleaved catalog block like the Gem sets' Trainer/Energy groups, and no basic Energy cards at all.

### How this maps onto the Gem schema, and where it doesn't

`src/data/black-bolt.json` keeps the `gem-vol-1.json` field names, but several fields can't mean what they mean for a Gem set:

- **`pokemonIndex` = the collector number (1–174) and `version` = 1 for every card.** There is no Pokémon/version ladder to encode. That keeps every card unique and in order, but `pokemonIndex` is **not** a Pokémon grouping here: Snivy is 1 and its Art Rare is 87.
- **No `catalogGroups`.** It exists to regroup Gem Trainer/Energy blocks by name. Here every card is its own entry, so the field is left out rather than given a meaningless value.
- **`number` is the official `NNN/086`**, 3 digits. `buildGemSetData` (`src/lib/gem-sets/buildSetData.ts`) assumes the Gem `PPVV/NN` format: it takes `id = number.slice(0, 4)` and `groupId = id.slice(0, 2)`. For `"001/086"` that gives id `"001/"` and puts cards 001–009 into one group "00", 010–019 into "01", and so on. **The existing Gem engine won't render this set correctly as-is.** A page for it needs either a separate component (a flat numbered checklist with rarity filters and an "other versions of this Pokémon" link, matched by name) or engine changes. Its hero copy, odds table and per-Pokémon ladder rows all assume the Gem shape.
- **`rarityOrder` has 8 entries using Chen's exact strings**, see above.
- **`exclusiveCardNumbers` uses the official number** (`173/086`). Note that `173/086` is also the exclusive's number in the twin set; see below.
- **Image filenames** are the collector number zero-padded to 4 digits (`0001.webp`–`0174.webp`) to fit the `NNNN.webp` pattern. They are **not** the Gem `PPVV` ids.

### Relationship to White Flare: independent sets, mirror-image structure

- **No shared numbering.** Black Bolt (CSV10.5C) and White Flare (CSV10.6C) each run their own `001/086`–`174/086`, so every number exists in both sets as a different card (e.g. 001/086 is Snivy in Black Bolt and Sewaddle in White Flare). Any lookup or URL must include the set, never the number alone.
- **No shared odds chart**, since Chen shows none for either. Cards-per-pack and production ratios are unknown here for both.
- **Same skeleton.** Both have 78 Pokémon (6 ex), 7 Trainers in the same type order, 1 Special Energy, 72 AR, 8 SR, 7 SAR and 1 BWR. Only Common/Uncommon differ by one (Black Bolt 39 C / 31 U, White Flare 38 C / 32 U). Each set's legendary mascot is its BWR (Zekrom ex vs Reshiram ex), and each set's 173/086 is its single Supporter SAR, which Chen flags as the exclusive.
- The two sets split the Unova Pokédex between them rather than duplicating it. Each Pokémon line appears in one set, e.g. Snivy/Servine/Serperior in Black Bolt and Tepig/Pignite/Emboar in White Flare.

## Chase cards and exclusives

- Chen flags **one** card as exclusive to Black Bolt: **173/086 N's Plan** (Special Art Rare (SAR)), N standing in a cool blue, light-streaked scene. It is the set's only Trainer SAR. Like the Gem exclusives, Chen's image of it is slightly oversized (320×449) compared with the rest.
- **Top chase:** **174/086 Zekrom ex, Black White Rare**, the set's highest tier and only BWR. It's a monochrome black Zekrom full art.
- **Other chase cards** (my read, not a Chen flag): the 7 SARs (167–173), especially **169/086 Zekrom ex SAR**, then the 8 SRs (159–166) and standout Art Rares.

Image sizes: main-set cards 001–086 that aren't R/RR are 300×418, everything else is 300×419, and 173 is 320×449. These are the largest Chen serves; no higher-resolution originals are published there.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo:** "黑雷奔流" in black lettering with an **electric-blue** outline. Logo swatches: near-black `#141525`, electric blue `#77A7C9`, steel blue `#2C4E6C`, slate `#586172`, white highlight `#F8F6F7`.
- **Identity:** the **black / Zekrom / lightning** half of the pair. The box legend Zekrom ex closes the set as the all-black **Black White Rare** (174/086): almost pure charcoal and black (`#0D0A0B`, `#211C1C`, `#464242`).
- **Overall card palette:** cool and deep. Dark slate-teal `#273A40`, sea teal `#487977`, aqua `#69B1A8`, sage `#ADBCA5`, with warm terracotta `#BF8067` and brick `#7D4646` from the Fire and Fighting cards.
- **SR / SAR chase cards:** cool grey-teal: mist `#A8BCB8`, slate `#333E49`, teal `#468084`, aqua `#66AEAC`.
- **Suggested page accents:** a **near-black hero** (`#141525` or `#0D0A0B`) with **electric blue** (`#77A7C9`; use the deeper `#2C4E6C` for text on white) as the main accent. These are official sets, so **don't** use Gem Pack magenta. Pair it with White Flare's white and red so the two pages read as a pair.

## Files

- `src/data/black-bolt.json`: `gem-vol-1.json` field names, adapted as described above. 174 cards, sorted by collector number. The `image` fields are placeholder R2 paths (`Chinese/Black Bolt/Cards/NNNN.webp`).
- `black-bolt-images/cards/NNNN.webp`: all 174 card images, named by zero-padded collector number.

## Appendix: full card list

| No. | Card | Rarity | Type / note |
|---|---|---|---|
| 001/086 | Snivy | Common (C) | Pokémon |
| 002/086 | Servine | Common (C) | Pokémon |
| 003/086 | Serperior ex | Double Rare (RR) | Pokémon ex |
| 004/086 | Pansage | Common (C) | Pokémon |
| 005/086 | Simisage | Uncommon (U) | Pokémon |
| 006/086 | Petilil | Common (C) | Pokémon |
| 007/086 | Lilligant | Uncommon (U) | Pokémon |
| 008/086 | Maractus | Common (C) | Pokémon |
| 009/086 | Karrablast | Common (C) | Pokémon |
| 010/086 | Foongus | Common (C) | Pokémon |
| 011/086 | Amoonguss | Uncommon (U) | Pokémon |
| 012/086 | Victini | Rare (R) | Pokémon |
| 013/086 | Darumaka | Common (C) | Pokémon |
| 014/086 | Darmanitan | Uncommon (U) | Pokémon |
| 015/086 | Litwick | Common (C) | Pokémon |
| 016/086 | Lampent | Common (C) | Pokémon |
| 017/086 | Chandelure | Rare (R) | Pokémon |
| 018/086 | Larvesta | Common (C) | Pokémon |
| 019/086 | Volcarona | Rare (R) | Pokémon |
| 020/086 | Panpour | Common (C) | Pokémon |
| 021/086 | Simipour | Uncommon (U) | Pokémon |
| 022/086 | Tympole | Common (C) | Pokémon |
| 023/086 | Palpitoad | Common (C) | Pokémon |
| 024/086 | Seismitoad | Uncommon (U) | Pokémon |
| 025/086 | Tirtouga | Uncommon (U) | Pokémon |
| 026/086 | Carracosta | Rare (R) | Pokémon |
| 027/086 | Alomomola | Uncommon (U) | Pokémon |
| 028/086 | Cubchoo | Common (C) | Pokémon |
| 029/086 | Beartic | Rare (R) | Pokémon |
| 030/086 | Cryogonal | Uncommon (U) | Pokémon |
| 031/086 | Kyurem ex | Double Rare (RR) | Pokémon ex |
| 032/086 | Emolga | Common (C) | Pokémon |
| 033/086 | Tynamo | Common (C) | Pokémon |
| 034/086 | Eelektrik | Uncommon (U) | Pokémon |
| 035/086 | Eelektross | Uncommon (U) | Pokémon |
| 036/086 | Thundurus | Rare (R) | Pokémon |
| 037/086 | Zekrom ex | Double Rare (RR) | Pokémon ex |
| 038/086 | Munna | Common (C) | Pokémon |
| 039/086 | Musharna | Uncommon (U) | Pokémon |
| 040/086 | Solosis | Common (C) | Pokémon |
| 041/086 | Duosion | Common (C) | Pokémon |
| 042/086 | Reuniclus | Uncommon (U) | Pokémon |
| 043/086 | Elgyem | Common (C) | Pokémon |
| 044/086 | Beheeyem | Uncommon (U) | Pokémon |
| 045/086 | Golett | Common (C) | Pokémon |
| 046/086 | Golurk | Uncommon (U) | Pokémon |
| 047/086 | Meloetta ex | Double Rare (RR) | Pokémon ex |
| 048/086 | Drilbur | Common (C) | Pokémon |
| 049/086 | Excadrill ex | Double Rare (RR) | Pokémon ex |
| 050/086 | Timburr | Common (C) | Pokémon |
| 051/086 | Gurdurr | Common (C) | Pokémon |
| 052/086 | Conkeldurr | Rare (R) | Pokémon |
| 053/086 | Throh | Uncommon (U) | Pokémon |
| 054/086 | Dwebble | Common (C) | Pokémon |
| 055/086 | Crustle | Uncommon (U) | Pokémon |
| 056/086 | Landorus | Rare (R) | Pokémon |
| 057/086 | Venipede | Common (C) | Pokémon |
| 058/086 | Whirlipede | Common (C) | Pokémon |
| 059/086 | Scolipede | Uncommon (U) | Pokémon |
| 060/086 | Sandile | Common (C) | Pokémon |
| 061/086 | Krokorok | Common (C) | Pokémon |
| 062/086 | Krookodile | Uncommon (U) | Pokémon |
| 063/086 | Vullaby | Common (C) | Pokémon |
| 064/086 | Mandibuzz | Uncommon (U) | Pokémon |
| 065/086 | Escavalier | Uncommon (U) | Pokémon |
| 066/086 | Pawniard | Common (C) | Pokémon |
| 067/086 | Bisharp | Uncommon (U) | Pokémon |
| 068/086 | Cobalion | Rare (R) | Pokémon |
| 069/086 | Genesect ex | Double Rare (RR) | Pokémon ex |
| 070/086 | Axew | Common (C) | Pokémon |
| 071/086 | Fraxure | Common (C) | Pokémon |
| 072/086 | Haxorus | Rare (R) | Pokémon |
| 073/086 | Pidove | Common (C) | Pokémon |
| 074/086 | Tranquill | Common (C) | Pokémon |
| 075/086 | Unfezant | Uncommon (U) | Pokémon |
| 076/086 | Audino | Common (C) | Pokémon |
| 077/086 | Minccino | Common (C) | Pokémon |
| 078/086 | Cinccino | Uncommon (U) | Pokémon |
| 079/086 | Energy Coin | Uncommon (U) | Item |
| 080/086 | Antique Cover Fossil | Common (C) | Item |
| 081/086 | Pokégear 3.0 | Uncommon (U) | Item |
| 082/086 | Air Balloon | Uncommon (U) | Pokémon Tool |
| 083/086 | N's Plan | Uncommon (U) | Supporter |
| 084/086 | Professor's Research | Uncommon (U) | Supporter |
| 085/086 | Fennel | Uncommon (U) | Supporter |
| 086/086 | Prism Energy | Uncommon (U) | Special Energy |
| 087/086 | Snivy | Art Rare (AR) | Art Rare of 001/086 |
| 088/086 | Servine | Art Rare (AR) | Art Rare of 002/086 |
| 089/086 | Pansage | Art Rare (AR) | Art Rare of 004/086 |
| 090/086 | Simisage | Art Rare (AR) | Art Rare of 005/086 |
| 091/086 | Petilil | Art Rare (AR) | Art Rare of 006/086 |
| 092/086 | Lilligant | Art Rare (AR) | Art Rare of 007/086 |
| 093/086 | Maractus | Art Rare (AR) | Art Rare of 008/086 |
| 094/086 | Karrablast | Art Rare (AR) | Art Rare of 009/086 |
| 095/086 | Foongus | Art Rare (AR) | Art Rare of 010/086 |
| 096/086 | Amoonguss | Art Rare (AR) | Art Rare of 011/086 |
| 097/086 | Victini | Art Rare (AR) | Art Rare of 012/086 |
| 098/086 | Darumaka | Art Rare (AR) | Art Rare of 013/086 |
| 099/086 | Darmanitan | Art Rare (AR) | Art Rare of 014/086 |
| 100/086 | Litwick | Art Rare (AR) | Art Rare of 015/086 |
| 101/086 | Lampent | Art Rare (AR) | Art Rare of 016/086 |
| 102/086 | Chandelure | Art Rare (AR) | Art Rare of 017/086 |
| 103/086 | Larvesta | Art Rare (AR) | Art Rare of 018/086 |
| 104/086 | Volcarona | Art Rare (AR) | Art Rare of 019/086 |
| 105/086 | Panpour | Art Rare (AR) | Art Rare of 020/086 |
| 106/086 | Simipour | Art Rare (AR) | Art Rare of 021/086 |
| 107/086 | Tympole | Art Rare (AR) | Art Rare of 022/086 |
| 108/086 | Palpitoad | Art Rare (AR) | Art Rare of 023/086 |
| 109/086 | Seismitoad | Art Rare (AR) | Art Rare of 024/086 |
| 110/086 | Tirtouga | Art Rare (AR) | Art Rare of 025/086 |
| 111/086 | Carracosta | Art Rare (AR) | Art Rare of 026/086 |
| 112/086 | Alomomola | Art Rare (AR) | Art Rare of 027/086 |
| 113/086 | Cubchoo | Art Rare (AR) | Art Rare of 028/086 |
| 114/086 | Beartic | Art Rare (AR) | Art Rare of 029/086 |
| 115/086 | Cryogonal | Art Rare (AR) | Art Rare of 030/086 |
| 116/086 | Emolga | Art Rare (AR) | Art Rare of 032/086 |
| 117/086 | Tynamo | Art Rare (AR) | Art Rare of 033/086 |
| 118/086 | Eelektrik | Art Rare (AR) | Art Rare of 034/086 |
| 119/086 | Eelektross | Art Rare (AR) | Art Rare of 035/086 |
| 120/086 | Thundurus | Art Rare (AR) | Art Rare of 036/086 |
| 121/086 | Munna | Art Rare (AR) | Art Rare of 038/086 |
| 122/086 | Musharna | Art Rare (AR) | Art Rare of 039/086 |
| 123/086 | Solosis | Art Rare (AR) | Art Rare of 040/086 |
| 124/086 | Duosion | Art Rare (AR) | Art Rare of 041/086 |
| 125/086 | Reuniclus | Art Rare (AR) | Art Rare of 042/086 |
| 126/086 | Elgyem | Art Rare (AR) | Art Rare of 043/086 |
| 127/086 | Beheeyem | Art Rare (AR) | Art Rare of 044/086 |
| 128/086 | Golett | Art Rare (AR) | Art Rare of 045/086 |
| 129/086 | Golurk | Art Rare (AR) | Art Rare of 046/086 |
| 130/086 | Drilbur | Art Rare (AR) | Art Rare of 048/086 |
| 131/086 | Timburr | Art Rare (AR) | Art Rare of 050/086 |
| 132/086 | Gurdurr | Art Rare (AR) | Art Rare of 051/086 |
| 133/086 | Conkeldurr | Art Rare (AR) | Art Rare of 052/086 |
| 134/086 | Throh | Art Rare (AR) | Art Rare of 053/086 |
| 135/086 | Dwebble | Art Rare (AR) | Art Rare of 054/086 |
| 136/086 | Crustle | Art Rare (AR) | Art Rare of 055/086 |
| 137/086 | Landorus | Art Rare (AR) | Art Rare of 056/086 |
| 138/086 | Venipede | Art Rare (AR) | Art Rare of 057/086 |
| 139/086 | Whirlipede | Art Rare (AR) | Art Rare of 058/086 |
| 140/086 | Scolipede | Art Rare (AR) | Art Rare of 059/086 |
| 141/086 | Sandile | Art Rare (AR) | Art Rare of 060/086 |
| 142/086 | Krokorok | Art Rare (AR) | Art Rare of 061/086 |
| 143/086 | Krookodile | Art Rare (AR) | Art Rare of 062/086 |
| 144/086 | Vullaby | Art Rare (AR) | Art Rare of 063/086 |
| 145/086 | Mandibuzz | Art Rare (AR) | Art Rare of 064/086 |
| 146/086 | Escavalier | Art Rare (AR) | Art Rare of 065/086 |
| 147/086 | Pawniard | Art Rare (AR) | Art Rare of 066/086 |
| 148/086 | Bisharp | Art Rare (AR) | Art Rare of 067/086 |
| 149/086 | Cobalion | Art Rare (AR) | Art Rare of 068/086 |
| 150/086 | Axew | Art Rare (AR) | Art Rare of 070/086 |
| 151/086 | Fraxure | Art Rare (AR) | Art Rare of 071/086 |
| 152/086 | Haxorus | Art Rare (AR) | Art Rare of 072/086 |
| 153/086 | Pidove | Art Rare (AR) | Art Rare of 073/086 |
| 154/086 | Tranquill | Art Rare (AR) | Art Rare of 074/086 |
| 155/086 | Unfezant | Art Rare (AR) | Art Rare of 075/086 |
| 156/086 | Audino | Art Rare (AR) | Art Rare of 076/086 |
| 157/086 | Minccino | Art Rare (AR) | Art Rare of 077/086 |
| 158/086 | Cinccino | Art Rare (AR) | Art Rare of 078/086 |
| 159/086 | Serperior ex | Super Rare (SR) | full art |
| 160/086 | Kyurem ex | Super Rare (SR) | full art |
| 161/086 | Zekrom ex | Super Rare (SR) | full art |
| 162/086 | Meloetta ex | Super Rare (SR) | full art |
| 163/086 | Excadrill ex | Super Rare (SR) | full art |
| 164/086 | Genesect ex | Super Rare (SR) | full art |
| 165/086 | N's Plan | Super Rare (SR) | full art, Supporter |
| 166/086 | Fennel | Super Rare (SR) | full art, Supporter |
| 167/086 | Serperior ex | Special Art Rare (SAR) | special art |
| 168/086 | Kyurem ex | Special Art Rare (SAR) | special art |
| 169/086 | Zekrom ex | Special Art Rare (SAR) | special art |
| 170/086 | Meloetta ex | Special Art Rare (SAR) | special art |
| 171/086 | Excadrill ex | Special Art Rare (SAR) | special art |
| 172/086 | Genesect ex | Special Art Rare (SAR) | special art |
| 173/086 | N's Plan | Special Art Rare (SAR) | special art, Supporter, **exclusive (Chen)** |
| 174/086 | Zekrom ex | Black White Rare (BWR) | Black White Rare, monochrome full art |
