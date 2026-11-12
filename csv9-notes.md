# CSV9 Stellar Crystal: sourcing notes

Source: https://www.chencards.com/sets/stellar_crystal (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Stellar Crystal** (星彩晶璃).
- Official set code: **CSV9C**. Files: `src/data/csv9.json`, `csv9-images/`, branch `csv9-data`, `slug: "csv9"`. The image placeholders use the set name: `Chinese/Stellar Crystal/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2026-05-15**
- **266 cards**: `001/208`–`208/208` main set + `209/208`–`266/208` secret rares (printed total **208**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/21383.html): **5 cards per pack, 4 non-holo (C/U) + 1 holo.**
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

The official chart ranks these kinds of card. Chen's card list covers all of them **except the two Ball-pattern parallels**:

| Rank | Chart tier | Chen's exact string | Kinds (chart) | Cards here | Production band (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 92 | 92 | 80.00% (C + U (4 non-holo slots)) |
| 2 | Uncommon | Uncommon (U) | 65 | 65 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | 177 | 0 | 13.82% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 20 | 20 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 22 | 22 | 5.45% (RR + AR + ACE + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 6 | 6 | ↑ |
| 7 | ACE SPEC Rare | ACE SPEC Rare (ACE) | 9 | 9 | ↑ |
| 8 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | 177 | 0 | ↑ |
| 9 | Super Rare | Super Rare (SR) | 27 | 27 | 0.73% (SR + SAR + UR) |
| 10 | Special Art Rare | Special Art Rare (SAR) | 16 | 16 | ↑ |
| 11 | Ultra Rare | Ultra Rare (UR) | 9 | 9 | ↑ |
| | **Total** | | 620 | **266** | 100% |

- **Poké Ball and Master Ball pattern parallels (177 each).** The chart footnote says they cover every C, U and R card, with the same content and a different holo finish. They're real, separately collected cards with the same collector numbers, but Chen has **no entries or images** for them and **they aren't in the JSON**. If the page wants them, add a per-card finish.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.
- **ACE SPEC Rare (ACE)** cards sit **inside the main set** at their natural Trainer and Energy numbers (pink frame header), not in the secret block: 176 Energy Search Pro, 180 Scramble Switch, 183 Brilliant Blender, 186 Precious Trolley, 187 Miracle Headset, 188 Megaton Blower, 191 Amulet of Hope, 205 Grand Tree, 208 Enriching Energy.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "ACE SPEC Rare (ACE)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–208) | Secret (209–266) |
|---|---|---|
| Common (C) | 92 | 0 |
| Uncommon (U) | 65 | 0 |
| Rare (R) | 20 | 0 |
| Double Rare (RR) | 22 | 0 |
| Art Rare (AR) | 0 | 6 |
| ACE SPEC Rare (ACE) | 9 | 0 |
| Super Rare (SR) | 0 | 27 |
| Special Art Rare (SAR) | 0 | 16 |
| Ultra Rare (UR) | 0 | 9 |

### Rarity corrections to Chen's data

Chen's Common/Uncommon split (**93 C / 64 U**) didn't match the official chart (**92 C / 65 U**). I read the rarity letter printed after the collector number on every Common card, and these are labelled wrong on Chen:

| No. | Card | Chen says | Printed on card | Used in JSON |
|---|---|---|---|---|
| 124/208 | Grimmsnarl | Common (C) | U | Uncommon (U) |

With these 1 fixed, the JSON's counts match the chart exactly (92 C / 65 U). Everything else on Chen matched the chart. Worth telling Chen so they can fix their page.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/208`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–175 | Pokémon, grouped by type | 175 | C 89, U 44, R 20, RR 22 (22 ex) |
| 176–189 | Items | 14 | C 2, U 6, ACE 6 |
| 190–195 | Pokémon Tools | 6 | U 5, ACE 1 |
| 196–204 | Supporters | 9 | C 1, U 8 |
| 205–207 | Stadiums | 3 | U 2, ACE 1 |
| 208 | Special Energy | 1 | ACE 1 |
| 209–214 | Art Rares of main-set Pokémon | 6 | AR |
| 215–241 | Super Rare full arts (ex + Supporters) | 27 | SR |
| 242–257 | Special Art Rares (ex + Supporters) | 16 | SAR |
| 258–266 | Ultra Rare gold (ex + Trainers/Energy) | 9 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (2):** 263/208 Night Stretcher (Ultra Rare (UR)); 265/208 Powerglass (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Same name twice in the main set, as different cards:** Applin (011 C, 148 C). Keep them distinct when matching versions by name.
- **Main-set ex with no secret version:** 034 Ceruledge ex, 090 Sylveon ex, 139 Zacian ex, 169 Noivern ex.
- **Names with "'s ":** 0 Pokémon and 3 Trainer cards (e.g. Clemont's Quick Wit, Jasmine's Gaze, Lisia's Appeal). Display them whole; the Gem engine's owner/mon split on "'s " doesn't fit Trainer names.
- **Image sizes:** 300×418 and 300×419 only; nothing oversized.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/208"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/208`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 1 corrections above**; `image` is `Chinese/Stellar Crystal/Cards/NNNN.webp` (matching `csv9-images/cards/`). No `catalogGroups`.

## Chinese-exclusive card

- **257/208**: Lisia's Appeal (Supporter), Special Art Rare.

Chen gives no extra note for it.

## Suggested hero theme colors

The logo "星彩晶璃" is a rainbow-crystal gradient (cream-gold, rose, slate) with a near-black outline (`#0F0D10`). It's the Stellar Tera / Terapagos set.

- **Primary, stellar rose `#D26E7B`:** chips, glow and rules (fills; use `#591B27` for text).
- **Secondary, slate blue `#5C6786`:** hero background or text accent; cream-gold `#FDDC93` for highlights.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **251/208 Terapagos ex SAR** | Terapagos ex SAR, the set's mascot |
| inner left | **245/208 Pikachu ex SAR** | Pikachu ex SAR |
| inner right | **247/208 Latias ex SAR** | Latias ex SAR |
| outer left | **257/208 Lisia's Appeal SAR** | Lisia's Appeal SAR, the Chinese exclusive |
| outer right | **260/208 Pikachu ex UR** | Pikachu ex UR, gold, the top tier |

Alternatives: 248 Hydreigon ex SAR, 249 Archaludon ex SAR, 250 Alolan Exeggutor ex SAR or 262 Terapagos ex UR.

## Files

- `src/data/csv9.json`: 266 cards, schema as above.
- `csv9-images/cards/0001.webp`–`0266.webp`: all 266 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/208 | Exeggcute | Common (C) |  | Pokémon |
| 002/208 | Lileep | Common (C) |  | Pokémon |
| 003/208 | Cradily | Uncommon (U) |  | Pokémon |
| 004/208 | Carnivine | Common (C) |  | Pokémon |
| 005/208 | Mow Rotom | Common (C) |  | Pokémon |
| 006/208 | Durant ex | Double Rare (RR) |  | Pokémon ex |
| 007/208 | Grubbin | Common (C) |  | Pokémon |
| 008/208 | Dhelmise | Common (C) |  | Pokémon |
| 009/208 | Gossifleur | Common (C) |  | Pokémon |
| 010/208 | Eldegoss | Uncommon (U) |  | Pokémon |
| 011/208 | Applin | Common (C) |  | Pokémon |
| 012/208 | Dipplin | Common (C) |  | Pokémon |
| 013/208 | Hydrapple ex | Double Rare (RR) |  | Pokémon ex |
| 014/208 | Zarude | Rare (R) |  | Pokémon |
| 015/208 | Capsakid | Common (C) |  | Pokémon |
| 016/208 | Rellor | Common (C) |  | Pokémon |
| 017/208 | Rabsca | Rare (R) |  | Pokémon |
| 018/208 | Wo-Chien | Uncommon (U) |  | Pokémon |
| 019/208 | Poltchageist | Common (C) |  | Pokémon |
| 020/208 | Sinistcha ex | Double Rare (RR) |  | Pokémon ex |
| 021/208 | Ho-Oh | Common (C) |  | Pokémon |
| 022/208 | Castform Sunny Form | Common (C) |  | Pokémon |
| 023/208 | Victini | Uncommon (U) |  | Pokémon |
| 024/208 | Salandit | Common (C) |  | Pokémon |
| 025/208 | Salazzle | Uncommon (U) |  | Pokémon |
| 026/208 | Turtonator | Common (C) |  | Pokémon |
| 027/208 | Scorbunny | Common (C) |  | Pokémon |
| 028/208 | Raboot | Common (C) |  | Pokémon |
| 029/208 | Cinderace ex | Double Rare (RR) |  | Pokémon ex |
| 030/208 | Fuecoco | Common (C) |  | Pokémon |
| 031/208 | Crocalor | Common (C) |  | Pokémon |
| 032/208 | Skeledirge | Rare (R) |  | Pokémon |
| 033/208 | Charcadet | Common (C) |  | Pokémon |
| 034/208 | Ceruledge ex | Double Rare (RR) |  | Pokémon ex |
| 035/208 | Scovillain ex | Double Rare (RR) |  | Pokémon ex |
| 036/208 | Gouging Fire | Rare (R) |  | Pokémon |
| 037/208 | Lapras ex | Double Rare (RR) |  | Pokémon ex |
| 038/208 | Feebas | Common (C) |  | Pokémon |
| 039/208 | Milotic | Uncommon (U) |  | Pokémon |
| 040/208 | Spheal | Common (C) |  | Pokémon |
| 041/208 | Sealeo | Common (C) |  | Pokémon |
| 042/208 | Walrein | Uncommon (U) |  | Pokémon |
| 043/208 | Shellos | Common (C) |  | Pokémon |
| 044/208 | Tirtouga | Common (C) |  | Pokémon |
| 045/208 | Carracosta | Uncommon (U) |  | Pokémon |
| 046/208 | Cryogonal | Common (C) |  | Pokémon |
| 047/208 | Bruxish | Uncommon (U) |  | Pokémon |
| 048/208 | Quaxly | Common (C) |  | Pokémon |
| 049/208 | Quaxwell | Common (C) |  | Pokémon |
| 050/208 | Quaquaval | Uncommon (U) |  | Pokémon |
| 051/208 | Veluza | Uncommon (U) |  | Pokémon |
| 052/208 | Iron Bundle | Uncommon (U) |  | Pokémon |
| 053/208 | Chien-Pao | Rare (R) |  | Pokémon |
| 054/208 | Pikachu ex | Double Rare (RR) |  | Pokémon ex |
| 055/208 | Magnemite | Common (C) |  | Pokémon |
| 056/208 | Magneton | Uncommon (U) |  | Pokémon |
| 057/208 | Magnezone | Uncommon (U) |  | Pokémon |
| 058/208 | Electabuzz | Common (C) |  | Pokémon |
| 059/208 | Electivire | Uncommon (U) |  | Pokémon |
| 060/208 | Chinchou | Common (C) |  | Pokémon |
| 061/208 | Lanturn | Uncommon (U) |  | Pokémon |
| 062/208 | Rotom | Common (C) |  | Pokémon |
| 063/208 | Joltik | Common (C) |  | Pokémon |
| 064/208 | Galvantula ex | Double Rare (RR) |  | Pokémon ex |
| 065/208 | Stunfisk | Common (C) |  | Pokémon |
| 066/208 | Charjabug | Common (C) |  | Pokémon |
| 067/208 | Vikavolt | Uncommon (U) |  | Pokémon |
| 068/208 | Tapu Koko | Rare (R) |  | Pokémon |
| 069/208 | Zeraora | Rare (R) |  | Pokémon |
| 070/208 | Miraidon | Uncommon (U) |  | Pokémon |
| 071/208 | Slowpoke | Common (C) |  | Pokémon |
| 072/208 | Slowking | Uncommon (U) |  | Pokémon |
| 073/208 | Togepi | Common (C) |  | Pokémon |
| 074/208 | Togetic | Common (C) |  | Pokémon |
| 075/208 | Togekiss | Rare (R) |  | Pokémon |
| 076/208 | Marill | Common (C) |  | Pokémon |
| 077/208 | Azumarill | Common (C) |  | Pokémon |
| 078/208 | Latias ex | Double Rare (RR) |  | Pokémon ex |
| 079/208 | Latios | Uncommon (U) |  | Pokémon |
| 080/208 | Drifloon | Common (C) |  | Pokémon |
| 081/208 | Drifblim | Uncommon (U) |  | Pokémon |
| 082/208 | Uxie | Common (C) |  | Pokémon |
| 083/208 | Mesprit | Common (C) |  | Pokémon |
| 084/208 | Azelf | Common (C) |  | Pokémon |
| 085/208 | Cresselia | Rare (R) |  | Pokémon |
| 086/208 | Yamask | Common (C) |  | Pokémon |
| 087/208 | Cofagrigus | Rare (R) |  | Pokémon |
| 088/208 | Espurr | Common (C) |  | Pokémon |
| 089/208 | Meowstic | Uncommon (U) |  | Pokémon |
| 090/208 | Sylveon ex | Double Rare (RR) |  | Pokémon ex |
| 091/208 | Dedenne | Common (C) |  | Pokémon |
| 092/208 | Oricorio | Common (C) |  | Pokémon |
| 093/208 | Sandygast | Common (C) |  | Pokémon |
| 094/208 | Palossand ex | Double Rare (RR) |  | Pokémon ex |
| 095/208 | Flutter Mane | Uncommon (U) |  | Pokémon |
| 096/208 | Gimmighoul | Common (C) |  | Pokémon |
| 097/208 | Mankey | Common (C) |  | Pokémon |
| 098/208 | Primeape | Common (C) |  | Pokémon |
| 099/208 | Annihilape | Uncommon (U) |  | Pokémon |
| 100/208 | Trapinch | Common (C) |  | Pokémon |
| 101/208 | Vibrava | Common (C) |  | Pokémon |
| 102/208 | Flygon ex | Double Rare (RR) |  | Pokémon ex |
| 103/208 | Gastrodon | Rare (R) |  | Pokémon |
| 104/208 | Landorus | Rare (R) |  | Pokémon |
| 105/208 | Pancham | Common (C) |  | Pokémon |
| 106/208 | Diancie | Uncommon (U) |  | Pokémon |
| 107/208 | Clobbopus | Common (C) |  | Pokémon |
| 108/208 | Grapploct | Common (C) |  | Pokémon |
| 109/208 | Falinks | Common (C) |  | Pokémon |
| 110/208 | Glimmet | Common (C) |  | Pokémon |
| 111/208 | Glimmora | Common (C) |  | Pokémon |
| 112/208 | Koraidon | Uncommon (U) |  | Pokémon |
| 113/208 | Gulpin | Common (C) |  | Pokémon |
| 114/208 | Swalot | Uncommon (U) |  | Pokémon |
| 115/208 | Zorua | Common (C) |  | Pokémon |
| 116/208 | Zoroark | Rare (R) |  | Pokémon |
| 117/208 | Deino | Common (C) |  | Pokémon |
| 118/208 | Zweilous | Common (C) |  | Pokémon |
| 119/208 | Hydreigon ex | Double Rare (RR) |  | Pokémon ex |
| 120/208 | Pangoro | Uncommon (U) |  | Pokémon |
| 121/208 | Yveltal | Uncommon (U) |  | Pokémon |
| 122/208 | Impidimp | Common (C) |  | Pokémon |
| 123/208 | Morgrem | Common (C) |  | Pokémon |
| 124/208 | Grimmsnarl | Uncommon (U) |  | Pokémon, **rarity corrected** (Chen: Common (C)) |
| 125/208 | Shroodle | Common (C) |  | Pokémon |
| 126/208 | Grafaiai | Uncommon (U) |  | Pokémon |
| 127/208 | Pecharunt | Uncommon (U) |  | Pokémon |
| 128/208 | Alolan Diglett | Common (C) |  | Pokémon |
| 129/208 | Alolan Dugtrio | Uncommon (U) |  | Pokémon |
| 130/208 | Skarmory | Common (C) |  | Pokémon |
| 131/208 | Bronzor | Common (C) |  | Pokémon |
| 132/208 | Bronzong | Common (C) |  | Pokémon |
| 133/208 | Genesect | Uncommon (U) |  | Pokémon |
| 134/208 | Meltan | Common (C) |  | Pokémon |
| 135/208 | Melmetal | Uncommon (U) |  | Pokémon |
| 136/208 | Duraludon | Common (C) |  | Pokémon |
| 137/208 | Archaludon | Rare (R) |  | Pokémon |
| 138/208 | Archaludon ex | Double Rare (RR) |  | Pokémon ex |
| 139/208 | Zacian ex | Double Rare (RR) |  | Pokémon ex |
| 140/208 | Varoom | Common (C) |  | Pokémon |
| 141/208 | Revavroom | Uncommon (U) |  | Pokémon |
| 142/208 | Gholdengo | Uncommon (U) |  | Pokémon |
| 143/208 | Iron Crown | Rare (R) |  | Pokémon |
| 144/208 | Alolan Exeggutor ex | Double Rare (RR) |  | Pokémon ex |
| 145/208 | Dialga | Rare (R) |  | Pokémon |
| 146/208 | Palkia | Rare (R) |  | Pokémon |
| 147/208 | Kyurem | Uncommon (U) |  | Pokémon |
| 148/208 | Applin | Common (C) |  | Pokémon |
| 149/208 | Flapple | Uncommon (U) |  | Pokémon |
| 150/208 | Appletun | Uncommon (U) |  | Pokémon |
| 151/208 | Eternatus | Rare (R) |  | Pokémon |
| 152/208 | Tatsugiri ex | Double Rare (RR) |  | Pokémon ex |
| 153/208 | Eevee | Common (C) |  | Pokémon |
| 154/208 | Hoothoot | Common (C) |  | Pokémon |
| 155/208 | Noctowl | Rare (R) |  | Pokémon |
| 156/208 | Slakoth | Common (C) |  | Pokémon |
| 157/208 | Vigoroth | Common (C) |  | Pokémon |
| 158/208 | Slaking ex | Double Rare (RR) |  | Pokémon ex |
| 159/208 | Zangoose | Common (C) |  | Pokémon |
| 160/208 | Kecleon | Common (C) |  | Pokémon |
| 161/208 | Fan Rotom | Common (C) |  | Pokémon |
| 162/208 | Bouffalant | Uncommon (U) |  | Pokémon |
| 163/208 | Rufflet | Common (C) |  | Pokémon |
| 164/208 | Braviary | Uncommon (U) |  | Pokémon |
| 165/208 | Fletchling | Common (C) |  | Pokémon |
| 166/208 | Fletchinder | Common (C) |  | Pokémon |
| 167/208 | Talonflame | Uncommon (U) |  | Pokémon |
| 168/208 | Noibat | Common (C) |  | Pokémon |
| 169/208 | Noivern ex | Double Rare (RR) |  | Pokémon ex |
| 170/208 | Oranguru | Common (C) |  | Pokémon |
| 171/208 | Tandemaus | Common (C) |  | Pokémon |
| 172/208 | Maushold | Uncommon (U) |  | Pokémon |
| 173/208 | Cyclizar ex | Double Rare (RR) |  | Pokémon ex |
| 174/208 | Terapagos | Rare (R) |  | Pokémon |
| 175/208 | Terapagos ex | Double Rare (RR) |  | Pokémon ex |
| 176/208 | Energy Search Pro | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 177/208 | Call Bell | Uncommon (U) |  | Item |
| 178/208 | Glass Trumpet | Uncommon (U) |  | Item |
| 179/208 | Deduction Kit | Uncommon (U) |  | Item |
| 180/208 | Scramble Switch | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 181/208 | Tera Orb | Uncommon (U) |  | Item |
| 182/208 | Chill Teaser Toy | Uncommon (U) |  | Item |
| 183/208 | Brilliant Blender | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 184/208 | Antique Root Fossil | Common (C) |  | Item |
| 185/208 | Antique Cover Fossil | Common (C) |  | Item |
| 186/208 | Precious Trolley | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 187/208 | Miracle Headset | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 188/208 | Megaton Blower | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 189/208 | Dragon Elixir | Uncommon (U) |  | Item |
| 190/208 | Counter Gain | Uncommon (U) |  | Pokémon Tool |
| 191/208 | Amulet of Hope | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 192/208 | Gravity Gemstone | Uncommon (U) |  | Pokémon Tool |
| 193/208 | Colbur Berry | Uncommon (U) |  | Pokémon Tool |
| 194/208 | Babiri Berry | Uncommon (U) |  | Pokémon Tool |
| 195/208 | Technical Machine: Fluorite | Uncommon (U) |  | Pokémon Tool |
| 196/208 | Crispin | Uncommon (U) |  | Supporter |
| 197/208 | Drayton | Uncommon (U) |  | Supporter |
| 198/208 | Cyrano | Uncommon (U) |  | Supporter |
| 199/208 | Clemont's Quick Wit | Uncommon (U) |  | Supporter |
| 200/208 | Lacey | Uncommon (U) |  | Supporter |
| 201/208 | Drasna | Common (C) |  | Supporter |
| 202/208 | Briar | Uncommon (U) |  | Supporter |
| 203/208 | Jasmine's Gaze | Uncommon (U) |  | Supporter |
| 204/208 | Lisia's Appeal | Uncommon (U) |  | Supporter |
| 205/208 | Grand Tree | ACE SPEC Rare (ACE) |  | Stadium, ACE SPEC |
| 206/208 | Lively Stadium | Uncommon (U) |  | Stadium |
| 207/208 | Area Zero Underdepths | Uncommon (U) |  | Stadium |
| 208/208 | Enriching Energy | ACE SPEC Rare (ACE) |  | Special Energy, ACE SPEC |
| 209/208 | Turtonator | Art Rare (AR) | Turtonator 026/208 | Art Rare |
| 210/208 | Zeraora | Art Rare (AR) | Zeraora 069/208 | Art Rare |
| 211/208 | Cresselia | Art Rare (AR) | Cresselia 085/208 | Art Rare |
| 212/208 | Zorua | Art Rare (AR) | Zorua 115/208 | Art Rare |
| 213/208 | Archaludon | Art Rare (AR) | Archaludon 137/208 | Art Rare |
| 214/208 | Noctowl | Art Rare (AR) | Noctowl 155/208 | Art Rare |
| 215/208 | Durant ex | Super Rare (SR) | Durant ex 006/208 | full art |
| 216/208 | Sinistcha ex | Super Rare (SR) | Sinistcha ex 020/208 | full art |
| 217/208 | Hydrapple ex | Super Rare (SR) | Hydrapple ex 013/208 | full art |
| 218/208 | Cinderace ex | Super Rare (SR) | Cinderace ex 029/208 | full art |
| 219/208 | Scovillain ex | Super Rare (SR) | Scovillain ex 035/208 | full art |
| 220/208 | Lapras ex | Super Rare (SR) | Lapras ex 037/208 | full art |
| 221/208 | Pikachu ex | Super Rare (SR) | Pikachu ex 054/208 | full art |
| 222/208 | Galvantula ex | Super Rare (SR) | Galvantula ex 064/208 | full art |
| 223/208 | Latias ex | Super Rare (SR) | Latias ex 078/208 | full art |
| 224/208 | Palossand ex | Super Rare (SR) | Palossand ex 094/208 | full art |
| 225/208 | Flygon ex | Super Rare (SR) | Flygon ex 102/208 | full art |
| 226/208 | Hydreigon ex | Super Rare (SR) | Hydreigon ex 119/208 | full art |
| 227/208 | Archaludon ex | Super Rare (SR) | Archaludon ex 138/208 | full art |
| 228/208 | Alolan Exeggutor ex | Super Rare (SR) | Alolan Exeggutor ex 144/208 | full art |
| 229/208 | Tatsugiri ex | Super Rare (SR) | Tatsugiri ex 152/208 | full art |
| 230/208 | Slaking ex | Super Rare (SR) | Slaking ex 158/208 | full art |
| 231/208 | Cyclizar ex | Super Rare (SR) | Cyclizar ex 173/208 | full art |
| 232/208 | Terapagos ex | Super Rare (SR) | Terapagos ex 175/208 | full art |
| 233/208 | Crispin | Super Rare (SR) | Crispin 196/208 | full art, Supporter |
| 234/208 | Drayton | Super Rare (SR) | Drayton 197/208 | full art, Supporter |
| 235/208 | Cyrano | Super Rare (SR) | Cyrano 198/208 | full art, Supporter |
| 236/208 | Clemont's Quick Wit | Super Rare (SR) | Clemont's Quick Wit 199/208 | full art, Supporter |
| 237/208 | Lacey | Super Rare (SR) | Lacey 200/208 | full art, Supporter |
| 238/208 | Drasna | Super Rare (SR) | Drasna 201/208 | full art, Supporter |
| 239/208 | Briar | Super Rare (SR) | Briar 202/208 | full art, Supporter |
| 240/208 | Jasmine's Gaze | Super Rare (SR) | Jasmine's Gaze 203/208 | full art, Supporter |
| 241/208 | Lisia's Appeal | Super Rare (SR) | Lisia's Appeal 204/208 | full art, Supporter |
| 242/208 | Durant ex | Special Art Rare (SAR) | Durant ex 006/208 | special art |
| 243/208 | Sinistcha ex | Special Art Rare (SAR) | Sinistcha ex 020/208 | special art |
| 244/208 | Hydrapple ex | Special Art Rare (SAR) | Hydrapple ex 013/208 | special art |
| 245/208 | Pikachu ex | Special Art Rare (SAR) | Pikachu ex 054/208 | special art |
| 246/208 | Galvantula ex | Special Art Rare (SAR) | Galvantula ex 064/208 | special art |
| 247/208 | Latias ex | Special Art Rare (SAR) | Latias ex 078/208 | special art |
| 248/208 | Hydreigon ex | Special Art Rare (SAR) | Hydreigon ex 119/208 | special art |
| 249/208 | Archaludon ex | Special Art Rare (SAR) | Archaludon ex 138/208 | special art |
| 250/208 | Alolan Exeggutor ex | Special Art Rare (SAR) | Alolan Exeggutor ex 144/208 | special art |
| 251/208 | Terapagos ex | Special Art Rare (SAR) | Terapagos ex 175/208 | special art |
| 252/208 | Drayton | Special Art Rare (SAR) | Drayton 197/208 | special art, Supporter |
| 253/208 | Clemont's Quick Wit | Special Art Rare (SAR) | Clemont's Quick Wit 199/208 | special art, Supporter |
| 254/208 | Lacey | Special Art Rare (SAR) | Lacey 200/208 | special art, Supporter |
| 255/208 | Briar | Special Art Rare (SAR) | Briar 202/208 | special art, Supporter |
| 256/208 | Jasmine's Gaze | Special Art Rare (SAR) | Jasmine's Gaze 203/208 | special art, Supporter |
| 257/208 | Lisia's Appeal | Special Art Rare (SAR) | Lisia's Appeal 204/208 | special art, Supporter, **Chinese exclusive (Chen)** |
| 258/208 | Cinderace ex | Ultra Rare (UR) | Cinderace ex 029/208 | gold |
| 259/208 | Lapras ex | Ultra Rare (UR) | Lapras ex 037/208 | gold |
| 260/208 | Pikachu ex | Ultra Rare (UR) | Pikachu ex 054/208 | gold |
| 261/208 | Alolan Exeggutor ex | Ultra Rare (UR) | Alolan Exeggutor ex 144/208 | gold |
| 262/208 | Terapagos ex | Ultra Rare (UR) | Terapagos ex 175/208 | gold |
| 263/208 | Night Stretcher | Ultra Rare (UR) | *(no main-set card)* | gold |
| 264/208 | Counter Gain | Ultra Rare (UR) | Counter Gain 190/208 | gold, Pokémon Tool |
| 265/208 | Powerglass | Ultra Rare (UR) | *(no main-set card)* | gold |
| 266/208 | Area Zero Underdepths | Ultra Rare (UR) | Area Zero Underdepths 207/208 | gold, Stadium |
