# Reward Round CSV4: sourcing notes

Source: https://www.chencards.com/sets/reward_round_csv4 (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Reward Round CSV4** (嘉奖回合). Chen hosts its images in a folder called `bonus-round`, an alternate English name for the set; I used Chen's display name "Reward Round CSV4" everywhere.
- Official set code: **CSV4C**. Files: `src/data/csv4.json`, `csv4-images/`, branch `csv4-data`, `slug: "csv4"`. The image placeholders use the set name: `Chinese/Reward Round CSV4/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2025-07-18**
- **165 cards**: `001/129`–`129/129` main set + `130/129`–`165/129` secret rares (printed total **129**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/15488.html): **5 cards per pack, 4 non-holo (C/U) + 1 holo.**
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

The official chart ranks these kinds of card. Chen's card list covers all of them **except the two Ball-pattern parallels**:

| Rank | Chart tier | Chen's exact string | Kinds (chart) | Cards here | Production band (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 57 | 57 | 80.00% (C + U (4 non-holo slots)) |
| 2 | Uncommon | Uncommon (U) | 44 | 44 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | 115 | 0 | 14.53% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 14 | 14 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 14 | 14 | 4.74% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 8 | 8 | ↑ |
| 7 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | 115 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | 15 | 15 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | 9 | 9 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | 4 | 4 | ↑ |
| | **Total** | | 395 | **165** | 100% |

- **Poké Ball and Master Ball pattern parallels (115 each).** The chart footnote says they cover every C, U and R card, with the same content and a different holo finish. They're real, separately collected cards with the same collector numbers, but Chen has **no entries or images** for them and **they aren't in the JSON**. If the page wants them, add a per-card finish.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–129) | Secret (130–165) |
|---|---|---|
| Common (C) | 57 | 0 |
| Uncommon (U) | 44 | 0 |
| Rare (R) | 14 | 0 |
| Double Rare (RR) | 14 | 0 |
| Art Rare (AR) | 0 | 8 |
| Super Rare (SR) | 0 | 15 |
| Special Art Rare (SAR) | 0 | 9 |
| Ultra Rare (UR) | 0 | 4 |

### Rarity corrections to Chen's data

Chen's Common/Uncommon split (**52 C / 49 U**) didn't match the official chart (**57 C / 44 U**). I read the rarity letter printed after the collector number on every Uncommon card, and these are labelled wrong on Chen:

| No. | Card | Chen says | Printed on card | Used in JSON |
|---|---|---|---|---|
| 046/129 | Togetic | Uncommon (U) | C | Common (C) |
| 065/129 | Primeape | Uncommon (U) | C | Common (C) |
| 068/129 | Pupitar | Uncommon (U) | C | Common (C) |
| 073/129 | Naclstack | Uncommon (U) | C | Common (C) |
| 100/129 | Pidgeotto | Uncommon (U) | C | Common (C) |

With these 5 fixed, the JSON's counts match the chart exactly (57 C / 44 U). Everything else on Chen matched the chart. Worth telling Chen so they can fix their page.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/129`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–114 | Pokémon, grouped by type | 114 | C 56, U 31, R 13, RR 14 (14 ex) |
| 115–116 | Items | 2 | U 2 |
| 117–120 | Pokémon Tools | 4 | U 4 |
| 121–126 | Supporters | 6 | C 1, U 4, R 1 |
| 127–128 | Stadiums | 2 | U 2 |
| 129 | Special Energy | 1 | U 1 |
| 130–137 | Art Rares of main-set Pokémon | 8 | AR |
| 138–152 | Super Rare full arts (ex + Supporters) | 15 | SR |
| 153–161 | Special Art Rares (ex + Supporters) | 9 | SAR |
| 162–165 | Ultra Rare gold (ex + Trainers/Energy) | 4 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (1):** 163/129 Nest Ball (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Main-set ex with no secret version:** 039 Pawmot ex, 062 Houndstone ex, 075 Garganacl ex, 092 Dragonite ex.
- **Names with "'s ":** 0 Pokémon and 2 Trainer cards (e.g. Daisy's Help, Boss's Orders). Display them whole; the Gem engine's owner/mon split on "'s " doesn't fit Trainer names.
- **Image sizes:** 300×418 and 300×419 only; nothing oversized.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/129"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/129`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 5 corrections above**; `image` is `Chinese/Reward Round CSV4/Cards/NNNN.webp` (matching `csv4-images/cards/`). No `catalogGroups`.

## Chinese-exclusive cards

- **158/129**: Maushold ex, Special Art Rare.
- **159/129**: Rika (Supporter), Special Art Rare.

Chen gives no extra note for these.

## Suggested hero theme colors

The logo "嘉奖回合" is teal and gold with a near-black outline (`#071216`) and a sage mid-tone (`#B5BC80`).

- **Primary, teal `#2E7B86`:** hero background or text-weight accent (readable as text on white).
- **Secondary, gold `#FBD572`:** fills, chips and glow (too light for text); bronze `#B38244` for a deeper gold.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **156/129 Gholdengo ex SAR** | Gholdengo ex SAR, a gold mascot that suits a "reward" set |
| inner left | **157/129 Pidgeot ex SAR** | Pidgeot ex SAR, a fan-favourite in a bright sky scene |
| inner right | **158/129 Maushold ex SAR** | Maushold ex SAR, one of the two Chinese exclusives |
| outer left | **159/129 Rika SAR** | Rika SAR, the other Chinese exclusive |
| outer right | **162/129 Gholdengo ex UR** | Gholdengo ex UR, gold, the top tier |

Alternatives: 153 Golisopod ex SAR, 154 Tapu Koko ex SAR, 155 Revavroom ex SAR or 161 Boss's Orders SAR.

## Files

- `src/data/csv4.json`: 165 cards, schema as above.
- `csv4-images/cards/0001.webp`–`0165.webp`: all 165 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/129 | Scyther | Common (C) |  | Pokémon |
| 002/129 | Skiddo | Common (C) |  | Pokémon |
| 003/129 | Gogoat | Common (C) |  | Pokémon |
| 004/129 | Tarountula | Common (C) |  | Pokémon |
| 005/129 | Spidops | Uncommon (U) |  | Pokémon |
| 006/129 | Smoliv | Common (C) |  | Pokémon |
| 007/129 | Dolliv | Uncommon (U) |  | Pokémon |
| 008/129 | Arboliva | Uncommon (U) |  | Pokémon |
| 009/129 | Bramblin | Common (C) |  | Pokémon |
| 010/129 | Brambleghast | Uncommon (U) |  | Pokémon |
| 011/129 | Capsakid | Common (C) |  | Pokémon |
| 012/129 | Scovillain | Rare (R) |  | Pokémon |
| 013/129 | Rellor | Common (C) |  | Pokémon |
| 014/129 | Vulpix | Common (C) |  | Pokémon |
| 015/129 | Ninetales | Uncommon (U) |  | Pokémon |
| 016/129 | Entei | Rare (R) |  | Pokémon |
| 017/129 | Numel | Common (C) |  | Pokémon |
| 018/129 | Camerupt | Uncommon (U) |  | Pokémon |
| 019/129 | Charcadet | Common (C) |  | Pokémon |
| 020/129 | Buizel | Common (C) |  | Pokémon |
| 021/129 | Floatzel | Uncommon (U) |  | Pokémon |
| 022/129 | Cubchoo | Common (C) |  | Pokémon |
| 023/129 | Beartic | Uncommon (U) |  | Pokémon |
| 024/129 | Cryogonal | Common (C) |  | Pokémon |
| 025/129 | Wimpod | Common (C) |  | Pokémon |
| 026/129 | Golisopod ex | Double Rare (RR) |  | Pokémon ex |
| 027/129 | Wiglett | Common (C) |  | Pokémon |
| 028/129 | Wugtrio | Uncommon (U) |  | Pokémon |
| 029/129 | Finizen | Common (C) |  | Pokémon |
| 030/129 | Palafin | Rare (R) |  | Pokémon |
| 031/129 | Veluza | Rare (R) |  | Pokémon |
| 032/129 | Tapu Koko ex | Double Rare (RR) |  | Pokémon ex |
| 033/129 | Toxel | Common (C) |  | Pokémon |
| 034/129 | Toxtricity | Rare (R) |  | Pokémon |
| 035/129 | Pincurchin | Common (C) |  | Pokémon |
| 036/129 | Pawmi | Common (C) |  | Pokémon |
| 037/129 | Pawmo | Uncommon (U) |  | Pokémon |
| 038/129 | Pawmot | Uncommon (U) |  | Pokémon |
| 039/129 | Pawmot ex | Double Rare (RR) |  | Pokémon ex |
| 040/129 | Tadbulb | Common (C) |  | Pokémon |
| 041/129 | Bellibolt | Common (C) |  | Pokémon |
| 042/129 | Slowpoke | Common (C) |  | Pokémon |
| 043/129 | Slowking ex | Double Rare (RR) |  | Pokémon ex |
| 044/129 | Cleffa | Common (C) |  | Pokémon |
| 045/129 | Togepi | Common (C) |  | Pokémon |
| 046/129 | Togetic | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 047/129 | Togekiss | Rare (R) |  | Pokémon |
| 048/129 | Espeon | Uncommon (U) |  | Pokémon |
| 049/129 | Snubbull | Common (C) |  | Pokémon |
| 050/129 | Granbull | Uncommon (U) |  | Pokémon |
| 051/129 | Lunatone | Uncommon (U) |  | Pokémon |
| 052/129 | Solrock | Uncommon (U) |  | Pokémon |
| 053/129 | Baltoy | Common (C) |  | Pokémon |
| 054/129 | Claydol | Rare (R) |  | Pokémon |
| 055/129 | Cottonee | Common (C) |  | Pokémon |
| 056/129 | Whimsicott | Uncommon (U) |  | Pokémon |
| 057/129 | Dedenne | Common (C) |  | Pokémon |
| 058/129 | Dedenne ex | Double Rare (RR) |  | Pokémon ex |
| 059/129 | Ceruledge | Rare (R) |  | Pokémon |
| 060/129 | Rabsca | Rare (R) |  | Pokémon |
| 061/129 | Greavard | Common (C) |  | Pokémon |
| 062/129 | Houndstone ex | Double Rare (RR) |  | Pokémon ex |
| 063/129 | Gimmighoul | Common (C) |  | Pokémon |
| 064/129 | Mankey | Common (C) |  | Pokémon |
| 065/129 | Primeape | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 066/129 | Annihilape ex | Double Rare (RR) |  | Pokémon ex |
| 067/129 | Larvitar | Common (C) |  | Pokémon |
| 068/129 | Pupitar | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 069/129 | Rockruff | Common (C) |  | Pokémon |
| 070/129 | Lycanroc | Uncommon (U) |  | Pokémon |
| 071/129 | Falinks | Common (C) |  | Pokémon |
| 072/129 | Nacli | Common (C) |  | Pokémon |
| 073/129 | Naclstack | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 074/129 | Garganacl | Rare (R) |  | Pokémon |
| 075/129 | Garganacl ex | Double Rare (RR) |  | Pokémon ex |
| 076/129 | Umbreon | Uncommon (U) |  | Pokémon |
| 077/129 | Tyranitar | Rare (R) |  | Pokémon |
| 078/129 | Maschiff | Common (C) |  | Pokémon |
| 079/129 | Mabosstiff | Uncommon (U) |  | Pokémon |
| 080/129 | Bombirdier | Uncommon (U) |  | Pokémon |
| 081/129 | Scizor | Rare (R) |  | Pokémon |
| 082/129 | Mawile | Uncommon (U) |  | Pokémon |
| 083/129 | Honedge | Common (C) |  | Pokémon |
| 084/129 | Doublade | Common (C) |  | Pokémon |
| 085/129 | Aegislash | Rare (R) |  | Pokémon |
| 086/129 | Togedemaru | Uncommon (U) |  | Pokémon |
| 087/129 | Varoom | Common (C) |  | Pokémon |
| 088/129 | Revavroom ex | Double Rare (RR) |  | Pokémon ex |
| 089/129 | Gholdengo ex | Double Rare (RR) |  | Pokémon ex |
| 090/129 | Dratini | Common (C) |  | Pokémon |
| 091/129 | Dragonair | Uncommon (U) |  | Pokémon |
| 092/129 | Dragonite ex | Double Rare (RR) |  | Pokémon ex |
| 093/129 | Altaria | Uncommon (U) |  | Pokémon |
| 094/129 | Noibat | Common (C) |  | Pokémon |
| 095/129 | Noivern ex | Double Rare (RR) |  | Pokémon ex |
| 096/129 | Drampa | Uncommon (U) |  | Pokémon |
| 097/129 | Cyclizar | Uncommon (U) |  | Pokémon |
| 098/129 | Tatsugiri | Uncommon (U) |  | Pokémon |
| 099/129 | Pidgey | Common (C) |  | Pokémon |
| 100/129 | Pidgeotto | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 101/129 | Pidgeot ex | Double Rare (RR) |  | Pokémon ex |
| 102/129 | Kangaskhan | Uncommon (U) |  | Pokémon |
| 103/129 | Eevee | Common (C) |  | Pokémon |
| 104/129 | Swablu | Common (C) |  | Pokémon |
| 105/129 | Zangoose | Common (C) |  | Pokémon |
| 106/129 | Lillipup | Common (C) |  | Pokémon |
| 107/129 | Herdier | Common (C) |  | Pokémon |
| 108/129 | Stoutland | Uncommon (U) |  | Pokémon |
| 109/129 | Audino | Common (C) |  | Pokémon |
| 110/129 | Lechonk | Common (C) |  | Pokémon |
| 111/129 | Oinkologne | Uncommon (U) |  | Pokémon |
| 112/129 | Tandemaus | Common (C) |  | Pokémon |
| 113/129 | Maushold | Uncommon (U) |  | Pokémon |
| 114/129 | Maushold ex | Double Rare (RR) |  | Pokémon ex |
| 115/129 | Energy Retrieval | Uncommon (U) |  | Item |
| 116/129 | Delivery Drone | Uncommon (U) |  | Item |
| 117/129 | Luxurious Cape | Uncommon (U) |  | Pokémon Tool |
| 118/129 | Defiance Vest | Uncommon (U) |  | Pokémon Tool |
| 119/129 | Technical Machine: Turbo Energize | Uncommon (U) |  | Pokémon Tool |
| 120/129 | Technical Machine: Blindside | Uncommon (U) |  | Pokémon Tool |
| 121/129 | Ortega | Uncommon (U) |  | Supporter |
| 122/129 | Rika | Uncommon (U) |  | Supporter |
| 123/129 | Daisy's Help | Uncommon (U) |  | Supporter |
| 124/129 | Parasol Lady | Common (C) |  | Supporter |
| 125/129 | Boss's Orders | Rare (R) |  | Supporter |
| 126/129 | Raifort | Uncommon (U) |  | Supporter |
| 127/129 | Beach Court | Uncommon (U) |  | Stadium |
| 128/129 | Practice Studio | Uncommon (U) |  | Stadium |
| 129/129 | Jet Energy | Uncommon (U) |  | Special Energy |
| 130/129 | Bramblin | Art Rare (AR) | Bramblin 009/129 | Art Rare |
| 131/129 | Wimpod | Art Rare (AR) | Wimpod 025/129 | Art Rare |
| 132/129 | Palafin | Art Rare (AR) | Palafin 030/129 | Art Rare |
| 133/129 | Gimmighoul | Art Rare (AR) | Gimmighoul 063/129 | Art Rare |
| 134/129 | Nacli | Art Rare (AR) | Nacli 072/129 | Art Rare |
| 135/129 | Varoom | Art Rare (AR) | Varoom 087/129 | Art Rare |
| 136/129 | Pidgey | Art Rare (AR) | Pidgey 099/129 | Art Rare |
| 137/129 | Pidgeotto | Art Rare (AR) | Pidgeotto 100/129 | Art Rare |
| 138/129 | Golisopod ex | Super Rare (SR) | Golisopod ex 026/129 | full art |
| 139/129 | Tapu Koko ex | Super Rare (SR) | Tapu Koko ex 032/129 | full art |
| 140/129 | Slowking ex | Super Rare (SR) | Slowking ex 043/129 | full art |
| 141/129 | Dedenne ex | Super Rare (SR) | Dedenne ex 058/129 | full art |
| 142/129 | Annihilape ex | Super Rare (SR) | Annihilape ex 066/129 | full art |
| 143/129 | Revavroom ex | Super Rare (SR) | Revavroom ex 088/129 | full art |
| 144/129 | Gholdengo ex | Super Rare (SR) | Gholdengo ex 089/129 | full art |
| 145/129 | Noivern ex | Super Rare (SR) | Noivern ex 095/129 | full art |
| 146/129 | Pidgeot ex | Super Rare (SR) | Pidgeot ex 101/129 | full art |
| 147/129 | Maushold ex | Super Rare (SR) | Maushold ex 114/129 | full art |
| 148/129 | Ortega | Super Rare (SR) | Ortega 121/129 | full art, Supporter |
| 149/129 | Rika | Super Rare (SR) | Rika 122/129 | full art, Supporter |
| 150/129 | Daisy's Help | Super Rare (SR) | Daisy's Help 123/129 | full art, Supporter |
| 151/129 | Parasol Lady | Super Rare (SR) | Parasol Lady 124/129 | full art, Supporter |
| 152/129 | Boss's Orders | Super Rare (SR) | Boss's Orders 125/129 | full art, Supporter |
| 153/129 | Golisopod ex | Special Art Rare (SAR) | Golisopod ex 026/129 | special art |
| 154/129 | Tapu Koko ex | Special Art Rare (SAR) | Tapu Koko ex 032/129 | special art |
| 155/129 | Revavroom ex | Special Art Rare (SAR) | Revavroom ex 088/129 | special art |
| 156/129 | Gholdengo ex | Special Art Rare (SAR) | Gholdengo ex 089/129 | special art |
| 157/129 | Pidgeot ex | Special Art Rare (SAR) | Pidgeot ex 101/129 | special art |
| 158/129 | Maushold ex | Special Art Rare (SAR) | Maushold ex 114/129 | special art, **Chinese exclusive (Chen)** |
| 159/129 | Rika | Special Art Rare (SAR) | Rika 122/129 | special art, Supporter, **Chinese exclusive (Chen)** |
| 160/129 | Parasol Lady | Special Art Rare (SAR) | Parasol Lady 124/129 | special art, Supporter |
| 161/129 | Boss's Orders | Special Art Rare (SAR) | Boss's Orders 125/129 | special art, Supporter |
| 162/129 | Gholdengo ex | Ultra Rare (UR) | Gholdengo ex 089/129 | gold |
| 163/129 | Nest Ball | Ultra Rare (UR) | *(no main-set card)* | gold |
| 164/129 | Luxurious Cape | Ultra Rare (UR) | Luxurious Cape 117/129 | gold, Pokémon Tool |
| 165/129 | Beach Court | Ultra Rare (UR) | Beach Court 127/129 | gold, Stadium |
