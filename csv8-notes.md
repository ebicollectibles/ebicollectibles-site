# CSV8 Brilliant Fantasy: sourcing notes

Source: https://www.chencards.com/sets/brilliant_fantasy (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Brilliant Fantasy** (璀璨诡幻). Chen hosts its images in a folder called `brilliant-illusions`, an alternate English name for the set; I used Chen's display name "Brilliant Fantasy" everywhere.
- Official set code: **CSV8C**. Files: `src/data/csv8.json`, `csv8-images/`, branch `csv8-data`, `slug: "csv8"`. The image placeholders use the set name: `Chinese/Brilliant Fantasy/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2026-03-13**
- **264 cards**: `001/207`–`207/207` main set + `208/207`–`264/207` secret rares (printed total **207**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/20627.html): **5 cards per pack, 4 non-holo (C/U) + 1 holo.**
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

The official chart ranks these kinds of card. Chen's card list covers all of them **except the two Ball-pattern parallels**:

| Rank | Chart tier | Chen's exact string | Kinds (chart) | Cards here | Production band (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 93 | 93 | 80.00% (C + U (4 non-holo slots)) |
| 2 | Uncommon | Uncommon (U) | 61 | 61 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | 176 | 0 | 13.82% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 22 | 22 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 22 | 22 | 5.45% (RR + AR + ACE + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 6 | 6 | ↑ |
| 7 | ACE SPEC Rare | ACE SPEC Rare (ACE) | 9 | 9 | ↑ |
| 8 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | 176 | 0 | ↑ |
| 9 | Super Rare | Super Rare (SR) | 28 | 28 | 0.73% (SR + SAR + UR) |
| 10 | Special Art Rare | Special Art Rare (SAR) | 14 | 14 | ↑ |
| 11 | Ultra Rare | Ultra Rare (UR) | 9 | 9 | ↑ |
| | **Total** | | 616 | **264** | 100% |

- **Poké Ball and Master Ball pattern parallels (176 each).** The chart footnote says they cover every C, U and R card, with the same content and a different holo finish. They're real, separately collected cards with the same collector numbers, but Chen has **no entries or images** for them and **they aren't in the JSON**. If the page wants them, add a per-card finish.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.
- **ACE SPEC Rare (ACE)** cards sit **inside the main set** at their natural Trainer and Energy numbers (pink frame header), not in the secret block: 173 Unfair Stamp, 176 Secret Box, 178 Dangerous Laser, 180 Poké Vital A, 181 Scoop Up Cyclone, 186 Sparkling Crystal, 189 Deluxe Bomb, 204 Neutralization Zone, 207 Legacy Energy.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "ACE SPEC Rare (ACE)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–207) | Secret (208–264) |
|---|---|---|
| Common (C) | 93 | 0 |
| Uncommon (U) | 61 | 0 |
| Rare (R) | 22 | 0 |
| Double Rare (RR) | 22 | 0 |
| Art Rare (AR) | 0 | 6 |
| ACE SPEC Rare (ACE) | 9 | 0 |
| Super Rare (SR) | 0 | 28 |
| Special Art Rare (SAR) | 0 | 14 |
| Ultra Rare (UR) | 0 | 9 |

### Rarity corrections to Chen's data

None needed: Chen's counts match the official chart for every tier.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/207`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–172 | Pokémon, grouped by type | 172 | C 92, U 36, R 22, RR 22 (22 ex) |
| 173–183 | Items | 11 | U 6, ACE 5 |
| 184–190 | Pokémon Tools | 7 | U 5, ACE 2 |
| 191–200 | Supporters | 10 | C 1, U 9 |
| 201–205 | Stadiums | 5 | U 4, ACE 1 |
| 206–207 | Special Energy | 2 | U 1, ACE 1 |
| 208–213 | Art Rares of main-set Pokémon | 6 | AR |
| 214–241 | Super Rare full arts (ex + Supporters) | 28 | SR |
| 242–255 | Special Art Rares (ex + Supporters) | 14 | SAR |
| 256–264 | Ultra Rare gold (ex + Trainers/Energy) | 9 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (5):** 259/207 Enhanced Hammer (Ultra Rare (UR)); 260/207 Bravery Charm (Ultra Rare (UR)); 261/207 Gravity Mountain (Ultra Rare (UR)); 263/207 Jet Energy (Ultra Rare (UR)); 264/207 Luminous Energy (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Same name twice in the main set, as different cards:** Applin (023 C, 155 C); Dipplin (024 U, 156 U). Keep them distinct when matching versions by name.
- **Main-set ex with no secret version:** 008 Amoonguss ex, 038 Reshiram ex, 088 Xerneas ex, 141 Dialga ex.
- **Names with "'s ":** 0 Pokémon and 4 Trainer cards (e.g. Ogre's Mask, Colress's Tenacity, Janine's Secret Art, Xerosic's Machinations). Display them whole; the Gem engine's owner/mon split on "'s " doesn't fit Trainer names.
- **Image sizes:** mostly 300×418/419, plus 7 at 320×445–448 (0208, 0209, 0212, 0239, 0244, 0255, 0256), so scale to a common box.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/207"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/207`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 0 corrections above**; `image` is `Chinese/Brilliant Fantasy/Cards/NNNN.webp` (matching `csv8-images/cards/`). No `catalogGroups`.

## Chinese-exclusive card

- **255/207**: Carmine (Supporter), Special Art Rare.

Chen gives no extra note for it.

## Suggested hero theme colors

The logo "璀璨诡幻" runs ice blue → jade → orchid on a deep plum outline. It's the Ogerpon / Loyal Three / Pecharunt (Kitakami) set.

- **Primary, deep plum `#380D28`:** hero background or text accent.
- **Secondary, jade teal `#409B94`:** chips and highlights; orchid `#754B81` and blush `#ECBBCE` as softer accents.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **250/207 Pecharunt ex SAR** | Pecharunt ex SAR, the set's mythical |
| inner left | **242/207 Teal Mask Ogerpon ex SAR** | Teal Mask Ogerpon ex SAR |
| inner right | **251/207 Bloodmoon Ursaluna ex SAR** | Bloodmoon Ursaluna ex SAR |
| outer left | **254/207 Kieran SAR** | Kieran SAR |
| outer right | **255/207 Carmine SAR** | Carmine SAR, the Chinese exclusive |

Alternatives: 243/245/246 the other Ogerpon mask SARs, 247–249 the Loyal Three SARs, or 256 Teal Mask Ogerpon ex UR.

## Files

- `src/data/csv8.json`: 264 cards, schema as above.
- `csv8-images/cards/0001.webp`–`0264.webp`: all 264 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/207 | Exeggcute | Common (C) |  | Pokémon |
| 002/207 | Exeggutor | Uncommon (U) |  | Pokémon |
| 003/207 | Ledyba | Common (C) |  | Pokémon |
| 004/207 | Ledian | Rare (R) |  | Pokémon |
| 005/207 | Volbeat | Common (C) |  | Pokémon |
| 006/207 | Illumise | Common (C) |  | Pokémon |
| 007/207 | Foongus | Common (C) |  | Pokémon |
| 008/207 | Amoonguss ex | Double Rare (RR) |  | Pokémon ex |
| 009/207 | Joltik | Common (C) |  | Pokémon |
| 010/207 | Galvantula | Uncommon (U) |  | Pokémon |
| 011/207 | Scatterbug | Common (C) |  | Pokémon |
| 012/207 | Spewpa | Common (C) |  | Pokémon |
| 013/207 | Vivillon | Uncommon (U) |  | Pokémon |
| 014/207 | Rowlet | Common (C) |  | Pokémon |
| 015/207 | Dartrix | Common (C) |  | Pokémon |
| 016/207 | Decidueye | Uncommon (U) |  | Pokémon |
| 017/207 | Morelull | Common (C) |  | Pokémon |
| 018/207 | Shiinotic | Uncommon (U) |  | Pokémon |
| 019/207 | Tapu Bulu | Rare (R) |  | Pokémon |
| 020/207 | Grookey | Common (C) |  | Pokémon |
| 021/207 | Thwackey | Common (C) |  | Pokémon |
| 022/207 | Rillaboom | Uncommon (U) |  | Pokémon |
| 023/207 | Applin | Common (C) |  | Pokémon |
| 024/207 | Dipplin | Uncommon (U) |  | Pokémon |
| 025/207 | Poltchageist | Common (C) |  | Pokémon |
| 026/207 | Sinistcha | Rare (R) |  | Pokémon |
| 027/207 | Teal Mask Ogerpon | Rare (R) |  | Pokémon |
| 028/207 | Teal Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 029/207 | Slugma | Common (C) |  | Pokémon |
| 030/207 | Magcargo | Rare (R) |  | Pokémon |
| 031/207 | Houndour | Common (C) |  | Pokémon |
| 032/207 | Houndoom | Common (C) |  | Pokémon |
| 033/207 | Litwick | Common (C) |  | Pokémon |
| 034/207 | Lampent | Common (C) |  | Pokémon |
| 035/207 | Chandelure | Rare (R) |  | Pokémon |
| 036/207 | Larvesta | Common (C) |  | Pokémon |
| 037/207 | Volcarona | Common (C) |  | Pokémon |
| 038/207 | Reshiram ex | Double Rare (RR) |  | Pokémon ex |
| 039/207 | Charcadet | Common (C) |  | Pokémon |
| 040/207 | Armarouge | Uncommon (U) |  | Pokémon |
| 041/207 | Ceruledge | Uncommon (U) |  | Pokémon |
| 042/207 | Iron Moth | Uncommon (U) |  | Pokémon |
| 043/207 | Hearthflame Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 044/207 | Poliwag | Common (C) |  | Pokémon |
| 045/207 | Poliwhirl | Common (C) |  | Pokémon |
| 046/207 | Poliwrath | Uncommon (U) |  | Pokémon |
| 047/207 | Horsea | Common (C) |  | Pokémon |
| 048/207 | Seadra | Common (C) |  | Pokémon |
| 049/207 | Kingdra ex | Double Rare (RR) |  | Pokémon ex |
| 050/207 | Goldeen | Common (C) |  | Pokémon |
| 051/207 | Seaking | Common (C) |  | Pokémon |
| 052/207 | Sneasel | Common (C) |  | Pokémon |
| 053/207 | Weavile | Uncommon (U) |  | Pokémon |
| 054/207 | Corphish | Common (C) |  | Pokémon |
| 055/207 | Crawdaunt | Common (C) |  | Pokémon |
| 056/207 | Feebas | Common (C) |  | Pokémon |
| 057/207 | Milotic ex | Double Rare (RR) |  | Pokémon ex |
| 058/207 | Black Kyurem ex | Double Rare (RR) |  | Pokémon ex |
| 059/207 | Crabominable | Uncommon (U) |  | Pokémon |
| 060/207 | Chewtle | Common (C) |  | Pokémon |
| 061/207 | Drednaw | Rare (R) |  | Pokémon |
| 062/207 | Finizen | Common (C) |  | Pokémon |
| 063/207 | Palafin | Uncommon (U) |  | Pokémon |
| 064/207 | Palafin ex | Double Rare (RR) |  | Pokémon ex |
| 065/207 | Cetoddle | Common (C) |  | Pokémon |
| 066/207 | Cetitan | Common (C) |  | Pokémon |
| 067/207 | Wellspring Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 068/207 | Tadbulb | Common (C) |  | Pokémon |
| 069/207 | Bellibolt | Uncommon (U) |  | Pokémon |
| 070/207 | Wattrel | Common (C) |  | Pokémon |
| 071/207 | Kilowattrel | Uncommon (U) |  | Pokémon |
| 072/207 | Revavroom ex | Double Rare (RR) |  | Pokémon ex |
| 073/207 | Abra | Common (C) |  | Pokémon |
| 074/207 | Kadabra | Common (C) |  | Pokémon |
| 075/207 | Alakazam | Rare (R) |  | Pokémon |
| 076/207 | Drowzee | Common (C) |  | Pokémon |
| 077/207 | Hypno | Uncommon (U) |  | Pokémon |
| 078/207 | Girafarig | Common (C) |  | Pokémon |
| 079/207 | Farigiraf | Uncommon (U) |  | Pokémon |
| 080/207 | Smoochum | Common (C) |  | Pokémon |
| 081/207 | Duskull | Common (C) |  | Pokémon |
| 082/207 | Dusclops | Common (C) |  | Pokémon |
| 083/207 | Dusknoir | Rare (R) |  | Pokémon |
| 084/207 | Chimecho | Common (C) |  | Pokémon |
| 085/207 | Swirlix | Common (C) |  | Pokémon |
| 086/207 | Slurpuff | Uncommon (U) |  | Pokémon |
| 087/207 | Sylveon | Uncommon (U) |  | Pokémon |
| 088/207 | Xerneas ex | Double Rare (RR) |  | Pokémon ex |
| 089/207 | Tapu Lele | Rare (R) |  | Pokémon |
| 090/207 | Milcery | Common (C) |  | Pokémon |
| 091/207 | Alcremie | Uncommon (U) |  | Pokémon |
| 092/207 | Flittle | Common (C) |  | Pokémon |
| 093/207 | Espathra | Uncommon (U) |  | Pokémon |
| 094/207 | Munkidori | Rare (R) |  | Pokémon |
| 095/207 | Fezandipiti | Rare (R) |  | Pokémon |
| 096/207 | Iron Boulder | Rare (R) |  | Pokémon |
| 097/207 | Hisuian Growlithe | Common (C) |  | Pokémon |
| 098/207 | Hisuian Arcanine | Rare (R) |  | Pokémon |
| 099/207 | Cubone | Common (C) |  | Pokémon |
| 100/207 | Marowak | Uncommon (U) |  | Pokémon |
| 101/207 | Rhyhorn | Common (C) |  | Pokémon |
| 102/207 | Rhydon | Common (C) |  | Pokémon |
| 103/207 | Rhyperior | Rare (R) |  | Pokémon |
| 104/207 | Phanpy | Common (C) |  | Pokémon |
| 105/207 | Donphan | Common (C) |  | Pokémon |
| 106/207 | Meditite | Common (C) |  | Pokémon |
| 107/207 | Medicham ex | Double Rare (RR) |  | Pokémon ex |
| 108/207 | Croagunk | Common (C) |  | Pokémon |
| 109/207 | Toxicroak | Common (C) |  | Pokémon |
| 110/207 | Timburr | Common (C) |  | Pokémon |
| 111/207 | Gurdurr | Common (C) |  | Pokémon |
| 112/207 | Conkeldurr | Uncommon (U) |  | Pokémon |
| 113/207 | Mienfoo | Common (C) |  | Pokémon |
| 114/207 | Mienshao | Uncommon (U) |  | Pokémon |
| 115/207 | Crabrawler | Common (C) |  | Pokémon |
| 116/207 | Bloodmoon Ursaluna | Rare (R) |  | Pokémon |
| 117/207 | Glimmet | Common (C) |  | Pokémon |
| 118/207 | Glimmora | Uncommon (U) |  | Pokémon |
| 119/207 | Slither Wing | Uncommon (U) |  | Pokémon |
| 120/207 | Okidogi | Rare (R) |  | Pokémon |
| 121/207 | Cornerstone Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 122/207 | Zubat | Common (C) |  | Pokémon |
| 123/207 | Golbat | Common (C) |  | Pokémon |
| 124/207 | Crobat | Uncommon (U) |  | Pokémon |
| 125/207 | Poochyena | Common (C) |  | Pokémon |
| 126/207 | Mightyena | Uncommon (U) |  | Pokémon |
| 127/207 | Absol | Common (C) |  | Pokémon |
| 128/207 | Venipede | Common (C) |  | Pokémon |
| 129/207 | Whirlipede | Common (C) |  | Pokémon |
| 130/207 | Scolipede | Uncommon (U) |  | Pokémon |
| 131/207 | Inkay | Common (C) |  | Pokémon |
| 132/207 | Malamar | Uncommon (U) |  | Pokémon |
| 133/207 | Okidogi ex | Double Rare (RR) |  | Pokémon ex |
| 134/207 | Munkidori ex | Double Rare (RR) |  | Pokémon ex |
| 135/207 | Fezandipiti ex | Double Rare (RR) |  | Pokémon ex |
| 136/207 | Pecharunt ex | Double Rare (RR) |  | Pokémon ex |
| 137/207 | Skarmory | Common (C) |  | Pokémon |
| 138/207 | Aron | Common (C) |  | Pokémon |
| 139/207 | Lairon | Common (C) |  | Pokémon |
| 140/207 | Aggron | Uncommon (U) |  | Pokémon |
| 141/207 | Dialga ex | Double Rare (RR) |  | Pokémon ex |
| 142/207 | Heatran | Rare (R) |  | Pokémon |
| 143/207 | Klink | Common (C) |  | Pokémon |
| 144/207 | Klang | Common (C) |  | Pokémon |
| 145/207 | Klinklang | Rare (R) |  | Pokémon |
| 146/207 | Klefki | Common (C) |  | Pokémon |
| 147/207 | Cufant | Common (C) |  | Pokémon |
| 148/207 | Copperajah | Rare (R) |  | Pokémon |
| 149/207 | Varoom | Common (C) |  | Pokémon |
| 150/207 | Orthworm ex | Double Rare (RR) |  | Pokémon ex |
| 151/207 | Axew | Common (C) |  | Pokémon |
| 152/207 | Fraxure | Common (C) |  | Pokémon |
| 153/207 | Haxorus | Rare (R) |  | Pokémon |
| 154/207 | Turtonator | Uncommon (U) |  | Pokémon |
| 155/207 | Applin | Common (C) |  | Pokémon |
| 156/207 | Dipplin | Uncommon (U) |  | Pokémon |
| 157/207 | Dreepy | Common (C) |  | Pokémon |
| 158/207 | Drakloak | Common (C) |  | Pokémon |
| 159/207 | Dragapult ex | Double Rare (RR) |  | Pokémon ex |
| 160/207 | Tatsugiri | Uncommon (U) |  | Pokémon |
| 161/207 | Raging Bolt | Rare (R) |  | Pokémon |
| 162/207 | Meowth | Common (C) |  | Pokémon |
| 163/207 | Persian | Common (C) |  | Pokémon |
| 164/207 | Chansey | Common (C) |  | Pokémon |
| 165/207 | Blissey ex | Double Rare (RR) |  | Pokémon ex |
| 166/207 | Eevee | Common (C) |  | Pokémon |
| 167/207 | Ducklett | Common (C) |  | Pokémon |
| 168/207 | Swanna | Uncommon (U) |  | Pokémon |
| 169/207 | Bouffalant | Common (C) |  | Pokémon |
| 170/207 | Stufful | Common (C) |  | Pokémon |
| 171/207 | Bewear | Common (C) |  | Pokémon |
| 172/207 | Bloodmoon Ursaluna ex | Double Rare (RR) |  | Pokémon ex |
| 173/207 | Unfair Stamp | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 174/207 | Ogre's Mask | Uncommon (U) |  | Item |
| 175/207 | Accompanying Flute | Uncommon (U) |  | Item |
| 176/207 | Secret Box | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 177/207 | Dusk Ball | Uncommon (U) |  | Item |
| 178/207 | Dangerous Laser | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 179/207 | Meddling Memo | Uncommon (U) |  | Item |
| 180/207 | Poké Vital A | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 181/207 | Scoop Up Cyclone | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 182/207 | Bug Catching Set | Uncommon (U) |  | Item |
| 183/207 | Night Stretcher | Uncommon (U) |  | Item |
| 184/207 | Payapa Berry | Uncommon (U) |  | Pokémon Tool |
| 185/207 | Occa Berry | Uncommon (U) |  | Pokémon Tool |
| 186/207 | Sparkling Crystal | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 187/207 | Binding Mochi | Uncommon (U) |  | Pokémon Tool |
| 188/207 | Powerglass | Uncommon (U) |  | Pokémon Tool |
| 189/207 | Deluxe Bomb | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 190/207 | Handheld Fan | Uncommon (U) |  | Pokémon Tool |
| 191/207 | Colress's Tenacity | Uncommon (U) |  | Supporter |
| 192/207 | Janine's Secret Art | Uncommon (U) |  | Supporter |
| 193/207 | Cassiopeia | Uncommon (U) |  | Supporter |
| 194/207 | Caretaker | Common (C) |  | Supporter |
| 195/207 | Xerosic's Machinations | Uncommon (U) |  | Supporter |
| 196/207 | Surfer | Uncommon (U) |  | Supporter |
| 197/207 | Perrin | Uncommon (U) |  | Supporter |
| 198/207 | Kieran | Uncommon (U) |  | Supporter |
| 199/207 | Carmine | Uncommon (U) |  | Supporter |
| 200/207 | Kofu | Uncommon (U) |  | Supporter |
| 201/207 | Festival Grounds | Uncommon (U) |  | Stadium |
| 202/207 | Community Center | Uncommon (U) |  | Stadium |
| 203/207 | Jamming Tower | Uncommon (U) |  | Stadium |
| 204/207 | Neutralization Zone | ACE SPEC Rare (ACE) |  | Stadium, ACE SPEC |
| 205/207 | Academy at Night | Uncommon (U) |  | Stadium |
| 206/207 | Boomerang Energy | Uncommon (U) |  | Special Energy |
| 207/207 | Legacy Energy | ACE SPEC Rare (ACE) |  | Special Energy, ACE SPEC |
| 208/207 | Larvesta | Art Rare (AR) | Larvesta 036/207 | Art Rare |
| 209/207 | Feebas | Art Rare (AR) | Feebas 056/207 | Art Rare |
| 210/207 | Duskull | Art Rare (AR) | Duskull 081/207 | Art Rare |
| 211/207 | Dusclops | Art Rare (AR) | Dusclops 082/207 | Art Rare |
| 212/207 | Dusknoir | Art Rare (AR) | Dusknoir 083/207 | Art Rare |
| 213/207 | Fraxure | Art Rare (AR) | Fraxure 152/207 | Art Rare |
| 214/207 | Teal Mask Ogerpon ex | Super Rare (SR) | Teal Mask Ogerpon ex 028/207 | full art |
| 215/207 | Hearthflame Mask Ogerpon ex | Super Rare (SR) | Hearthflame Mask Ogerpon ex 043/207 | full art |
| 216/207 | Kingdra ex | Super Rare (SR) | Kingdra ex 049/207 | full art |
| 217/207 | Milotic ex | Super Rare (SR) | Milotic ex 057/207 | full art |
| 218/207 | Black Kyurem ex | Super Rare (SR) | Black Kyurem ex 058/207 | full art |
| 219/207 | Palafin ex | Super Rare (SR) | Palafin ex 064/207 | full art |
| 220/207 | Wellspring Mask Ogerpon ex | Super Rare (SR) | Wellspring Mask Ogerpon ex 067/207 | full art |
| 221/207 | Revavroom ex | Super Rare (SR) | Revavroom ex 072/207 | full art |
| 222/207 | Medicham ex | Super Rare (SR) | Medicham ex 107/207 | full art |
| 223/207 | Cornerstone Mask Ogerpon ex | Super Rare (SR) | Cornerstone Mask Ogerpon ex 121/207 | full art |
| 224/207 | Okidogi ex | Super Rare (SR) | Okidogi ex 133/207 | full art |
| 225/207 | Munkidori ex | Super Rare (SR) | Munkidori ex 134/207 | full art |
| 226/207 | Fezandipiti ex | Super Rare (SR) | Fezandipiti ex 135/207 | full art |
| 227/207 | Pecharunt ex | Super Rare (SR) | Pecharunt ex 136/207 | full art |
| 228/207 | Orthworm ex | Super Rare (SR) | Orthworm ex 150/207 | full art |
| 229/207 | Dragapult ex | Super Rare (SR) | Dragapult ex 159/207 | full art |
| 230/207 | Blissey ex | Super Rare (SR) | Blissey ex 165/207 | full art |
| 231/207 | Bloodmoon Ursaluna ex | Super Rare (SR) | Bloodmoon Ursaluna ex 172/207 | full art |
| 232/207 | Colress's Tenacity | Super Rare (SR) | Colress's Tenacity 191/207 | full art, Supporter |
| 233/207 | Janine's Secret Art | Super Rare (SR) | Janine's Secret Art 192/207 | full art, Supporter |
| 234/207 | Cassiopeia | Super Rare (SR) | Cassiopeia 193/207 | full art, Supporter |
| 235/207 | Caretaker | Super Rare (SR) | Caretaker 194/207 | full art, Supporter |
| 236/207 | Xerosic's Machinations | Super Rare (SR) | Xerosic's Machinations 195/207 | full art, Supporter |
| 237/207 | Surfer | Super Rare (SR) | Surfer 196/207 | full art, Supporter |
| 238/207 | Perrin | Super Rare (SR) | Perrin 197/207 | full art, Supporter |
| 239/207 | Kieran | Super Rare (SR) | Kieran 198/207 | full art, Supporter |
| 240/207 | Carmine | Super Rare (SR) | Carmine 199/207 | full art, Supporter |
| 241/207 | Kofu | Super Rare (SR) | Kofu 200/207 | full art, Supporter |
| 242/207 | Teal Mask Ogerpon ex | Special Art Rare (SAR) | Teal Mask Ogerpon ex 028/207 | special art |
| 243/207 | Hearthflame Mask Ogerpon ex | Special Art Rare (SAR) | Hearthflame Mask Ogerpon ex 043/207 | special art |
| 244/207 | Milotic ex | Special Art Rare (SAR) | Milotic ex 057/207 | special art |
| 245/207 | Wellspring Mask Ogerpon ex | Special Art Rare (SAR) | Wellspring Mask Ogerpon ex 067/207 | special art |
| 246/207 | Cornerstone Mask Ogerpon ex | Special Art Rare (SAR) | Cornerstone Mask Ogerpon ex 121/207 | special art |
| 247/207 | Okidogi ex | Special Art Rare (SAR) | Okidogi ex 133/207 | special art |
| 248/207 | Munkidori ex | Special Art Rare (SAR) | Munkidori ex 134/207 | special art |
| 249/207 | Fezandipiti ex | Special Art Rare (SAR) | Fezandipiti ex 135/207 | special art |
| 250/207 | Pecharunt ex | Special Art Rare (SAR) | Pecharunt ex 136/207 | special art |
| 251/207 | Bloodmoon Ursaluna ex | Special Art Rare (SAR) | Bloodmoon Ursaluna ex 172/207 | special art |
| 252/207 | Cassiopeia | Special Art Rare (SAR) | Cassiopeia 193/207 | special art, Supporter |
| 253/207 | Perrin | Special Art Rare (SAR) | Perrin 197/207 | special art, Supporter |
| 254/207 | Kieran | Special Art Rare (SAR) | Kieran 198/207 | special art, Supporter |
| 255/207 | Carmine | Special Art Rare (SAR) | Carmine 199/207 | special art, Supporter, **Chinese exclusive (Chen)** |
| 256/207 | Teal Mask Ogerpon ex | Ultra Rare (UR) | Teal Mask Ogerpon ex 028/207 | gold |
| 257/207 | Pecharunt ex | Ultra Rare (UR) | Pecharunt ex 136/207 | gold |
| 258/207 | Bloodmoon Ursaluna ex | Ultra Rare (UR) | Bloodmoon Ursaluna ex 172/207 | gold |
| 259/207 | Enhanced Hammer | Ultra Rare (UR) | *(no main-set card)* | gold |
| 260/207 | Bravery Charm | Ultra Rare (UR) | *(no main-set card)* | gold |
| 261/207 | Gravity Mountain | Ultra Rare (UR) | *(no main-set card)* | gold |
| 262/207 | Jamming Tower | Ultra Rare (UR) | Jamming Tower 203/207 | gold, Stadium |
| 263/207 | Jet Energy | Ultra Rare (UR) | *(no main-set card)* | gold |
| 264/207 | Luminous Energy | Ultra Rare (UR) | *(no main-set card)* | gold |
