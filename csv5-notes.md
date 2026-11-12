# Dark Crystal Blaze CSV5: sourcing notes

Source: https://www.chencards.com/sets/dark_crystal_blaze_csv5 (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Dark Crystal Blaze CSV5** (黑晶炽诚).
- Official set code: **CSV5C**. Files: `src/data/csv5.json`, `csv5-images/`, branch `csv5-data`, `slug: "csv5"`. The image placeholders use the set name: `Chinese/Dark Crystal Blaze CSV5/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2025-09-12**
- **164 cards**: `001/129`–`129/129` main set + `130/129`–`164/129` secret rares (printed total **129**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/15453.html): **5 cards per pack, 4 non-holo (C/U) + 1 holo.**
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

The official chart ranks these kinds of card. Chen's card list covers all of them **except the two Ball-pattern parallels**:

| Rank | Chart tier | Chen's exact string | Kinds (chart) | Cards here | Production band (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 61 | 61 | 80.00% (C + U (4 non-holo slots)) |
| 2 | Uncommon | Uncommon (U) | 41 | 41 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | 115 | 0 | 14.53% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 13 | 13 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 14 | 14 | 4.74% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 8 | 8 | ↑ |
| 7 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | 115 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | 15 | 15 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | 8 | 8 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | 4 | 4 | ↑ |
| | **Total** | | 394 | **164** | 100% |

- **Poké Ball and Master Ball pattern parallels (115 each).** The chart footnote says they cover every C, U and R card, with the same content and a different holo finish. They're real, separately collected cards with the same collector numbers, but Chen has **no entries or images** for them and **they aren't in the JSON**. If the page wants them, add a per-card finish.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–129) | Secret (130–164) |
|---|---|---|
| Common (C) | 61 | 0 |
| Uncommon (U) | 41 | 0 |
| Rare (R) | 13 | 0 |
| Double Rare (RR) | 14 | 0 |
| Art Rare (AR) | 0 | 8 |
| Super Rare (SR) | 0 | 15 |
| Special Art Rare (SAR) | 0 | 8 |
| Ultra Rare (UR) | 0 | 4 |

### Rarity corrections to Chen's data

Chen's Common/Uncommon split (**60 C / 42 U**) didn't match the official chart (**61 C / 41 U**). I read the rarity letter printed after the collector number on every Uncommon card, and these are labelled wrong on Chen:

| No. | Card | Chen says | Printed on card | Used in JSON |
|---|---|---|---|---|
| 112/129 | Cyclizar | Uncommon (U) | C | Common (C) |

With these 1 fixed, the JSON's counts match the chart exactly (61 C / 41 U). Everything else on Chen matched the chart. Worth telling Chen so they can fix their page.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/129`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–113 | Pokémon, grouped by type | 113 | C 60, U 26, R 13, RR 14 (14 ex) |
| 114–116 | Items | 3 | U 3 |
| 117–120 | Pokémon Tools | 4 | U 4 |
| 121–127 | Supporters | 7 | C 1, U 6 |
| 128 | Stadiums | 1 | U 1 |
| 129 | Special Energy | 1 | U 1 |
| 130–137 | Art Rares of main-set Pokémon | 8 | AR |
| 138–152 | Super Rare full arts (ex + Supporters) | 15 | SR |
| 153–160 | Special Art Rares (ex + Supporters) | 8 | SAR |
| 161–164 | Ultra Rare gold (ex + Trainers/Energy) | 4 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (2):** 163/129 Rare Candy (Ultra Rare (UR)); 164/129 Defiance Band (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Same name twice in the main set, as different cards:** Flamigo (074 C, 113 U); Paldean Student (124 U, 125 U). Keep them distinct when matching versions by name.
- **Main-set ex with no secret version:** 010 Toedscruel ex, 012 Scovillain ex, 039 Mewtwo ex, 109 Greedent ex.
- **Image sizes:** 300×418 and 300×419 only; nothing oversized.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/129"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/129`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 1 corrections above**; `image` is `Chinese/Dark Crystal Blaze CSV5/Cards/NNNN.webp` (matching `csv5-images/cards/`). No `catalogGroups`.

## Chinese-exclusive card

- **157/129**: Larry (Supporter), Special Art Rare.

Chen gives no extra note for it.

## Suggested hero theme colors

The logo "黑晶炽诚" is a crimson-to-peach gradient on a dark plum-black outline.

- **Primary, crimson `#A11739`:** main accent, readable as text on white.
- **Secondary, obsidian `#2C232F`:** hero background, matching the logo's dark crystal; rose `#A94855` and peach `#F5AA8D` for highlights.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **155/129 Charizard ex SAR** | Charizard ex SAR, the set's headline chase |
| inner left | **154/129 Garchomp ex SAR** | Garchomp ex SAR |
| inner right | **156/129 Altaria ex SAR** | Altaria ex SAR, a soft sky scene that balances the fire |
| outer left | **157/129 Larry SAR** | Larry SAR, the Chinese exclusive |
| outer right | **162/129 Charizard ex UR** | Charizard ex UR, gold, the top tier |

Alternatives: 153 Eiscue ex SAR, 158 Clive SAR, 159 Poppy SAR or 161 Garchomp ex UR.

## Files

- `src/data/csv5.json`: 164 cards, schema as above.
- `csv5-images/cards/0001.webp`–`0164.webp`: all 164 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/129 | Oddish | Common (C) |  | Pokémon |
| 002/129 | Gloom | Common (C) |  | Pokémon |
| 003/129 | Bellossom | Uncommon (U) |  | Pokémon |
| 004/129 | Shuckle | Common (C) |  | Pokémon |
| 005/129 | Combee | Common (C) |  | Pokémon |
| 006/129 | Phantump | Common (C) |  | Pokémon |
| 007/129 | Trevenant | Uncommon (U) |  | Pokémon |
| 008/129 | Toedscool | Common (C) |  | Pokémon |
| 009/129 | Toedscruel | Uncommon (U) |  | Pokémon |
| 010/129 | Toedscruel ex | Double Rare (RR) |  | Pokémon ex |
| 011/129 | Capsakid | Common (C) |  | Pokémon |
| 012/129 | Scovillain ex | Double Rare (RR) |  | Pokémon ex |
| 013/129 | Wo-Chien | Rare (R) |  | Pokémon |
| 014/129 | Charmander | Common (C) |  | Pokémon |
| 015/129 | Charmeleon | Common (C) |  | Pokémon |
| 016/129 | Darumaka | Common (C) |  | Pokémon |
| 017/129 | Darmanitan | Uncommon (U) |  | Pokémon |
| 018/129 | Heatmor | Common (C) |  | Pokémon |
| 019/129 | Eiscue ex | Double Rare (RR) |  | Pokémon ex |
| 020/129 | Charcadet | Common (C) |  | Pokémon |
| 021/129 | Armarouge ex | Double Rare (RR) |  | Pokémon ex |
| 022/129 | Chi-Yu | Rare (R) |  | Pokémon |
| 023/129 | Lapras | Common (C) |  | Pokémon |
| 024/129 | Remoraid | Common (C) |  | Pokémon |
| 025/129 | Octillery | Common (C) |  | Pokémon |
| 026/129 | Carvanha | Common (C) |  | Pokémon |
| 027/129 | Sharpedo | Uncommon (U) |  | Pokémon |
| 028/129 | Garchomp ex | Double Rare (RR) |  | Pokémon ex |
| 029/129 | Mantyke | Common (C) |  | Pokémon |
| 030/129 | Palkia | Rare (R) |  | Pokémon |
| 031/129 | Tympole | Common (C) |  | Pokémon |
| 032/129 | Palpitoad | Common (C) |  | Pokémon |
| 033/129 | Seismitoad | Uncommon (U) |  | Pokémon |
| 034/129 | Wimpod | Common (C) |  | Pokémon |
| 035/129 | Golisopod | Rare (R) |  | Pokémon |
| 036/129 | Cetoddle | Common (C) |  | Pokémon |
| 037/129 | Cetitan | Rare (R) |  | Pokémon |
| 038/129 | Dondozo | Uncommon (U) |  | Pokémon |
| 039/129 | Mewtwo ex | Double Rare (RR) |  | Pokémon ex |
| 040/129 | Chinchou | Common (C) |  | Pokémon |
| 041/129 | Lanturn | Uncommon (U) |  | Pokémon |
| 042/129 | Plusle | Common (C) |  | Pokémon |
| 043/129 | Minun | Common (C) |  | Pokémon |
| 044/129 | Joltik | Common (C) |  | Pokémon |
| 045/129 | Galvantula | Common (C) |  | Pokémon |
| 046/129 | Tynamo | Common (C) |  | Pokémon |
| 047/129 | Eelektrik | Common (C) |  | Pokémon |
| 048/129 | Eelektross | Uncommon (U) |  | Pokémon |
| 049/129 | Zekrom | Rare (R) |  | Pokémon |
| 050/129 | Toxel | Common (C) |  | Pokémon |
| 051/129 | Exeggcute | Common (C) |  | Pokémon |
| 052/129 | Exeggutor | Uncommon (U) |  | Pokémon |
| 053/129 | Natu | Common (C) |  | Pokémon |
| 054/129 | Xatu | Rare (R) |  | Pokémon |
| 055/129 | Deoxys | Rare (R) |  | Pokémon |
| 056/129 | Vespiquen ex | Double Rare (RR) |  | Pokémon ex |
| 057/129 | Greavard | Common (C) |  | Pokémon |
| 058/129 | Houndstone | Uncommon (U) |  | Pokémon |
| 059/129 | Gligar | Common (C) |  | Pokémon |
| 060/129 | Gliscor | Uncommon (U) |  | Pokémon |
| 061/129 | Phanpy | Common (C) |  | Pokémon |
| 062/129 | Donphan | Uncommon (U) |  | Pokémon |
| 063/129 | Nosepass | Common (C) |  | Pokémon |
| 064/129 | Groudon | Rare (R) |  | Pokémon |
| 065/129 | Bonsly | Common (C) |  | Pokémon |
| 066/129 | Gible | Common (C) |  | Pokémon |
| 067/129 | Gabite | Common (C) |  | Pokémon |
| 068/129 | Stunfisk | Uncommon (U) |  | Pokémon |
| 069/129 | Hoopa ex | Double Rare (RR) |  | Pokémon ex |
| 070/129 | Minior | Uncommon (U) |  | Pokémon |
| 071/129 | Toxtricity ex | Double Rare (RR) |  | Pokémon ex |
| 072/129 | Glimmet | Common (C) |  | Pokémon |
| 073/129 | Glimmora ex | Double Rare (RR) |  | Pokémon ex |
| 074/129 | Flamigo | Common (C) |  | Pokémon |
| 075/129 | Charizard ex | Double Rare (RR) |  | Pokémon ex |
| 076/129 | Gastly | Common (C) |  | Pokémon |
| 077/129 | Haunter | Common (C) |  | Pokémon |
| 078/129 | Gengar | Uncommon (U) |  | Pokémon |
| 079/129 | Paldean Wooper | Common (C) |  | Pokémon |
| 080/129 | Paldean Clodsire | Uncommon (U) |  | Pokémon |
| 081/129 | Houndour | Common (C) |  | Pokémon |
| 082/129 | Houndoom | Uncommon (U) |  | Pokémon |
| 083/129 | Absol | Uncommon (U) |  | Pokémon |
| 084/129 | Darkrai | Rare (R) |  | Pokémon |
| 085/129 | Scraggy | Common (C) |  | Pokémon |
| 086/129 | Scrafty | Uncommon (U) |  | Pokémon |
| 087/129 | Inkay | Common (C) |  | Pokémon |
| 088/129 | Malamar | Uncommon (U) |  | Pokémon |
| 089/129 | Yveltal | Rare (R) |  | Pokémon |
| 090/129 | Nickit | Common (C) |  | Pokémon |
| 091/129 | Thievul | Rare (R) |  | Pokémon |
| 092/129 | Jirachi | Common (C) |  | Pokémon |
| 093/129 | Probopass | Common (C) |  | Pokémon |
| 094/129 | Ferroseed | Common (C) |  | Pokémon |
| 095/129 | Ferrothorn | Uncommon (U) |  | Pokémon |
| 096/129 | Pawniard | Common (C) |  | Pokémon |
| 097/129 | Bisharp | Common (C) |  | Pokémon |
| 098/129 | Kingambit | Uncommon (U) |  | Pokémon |
| 099/129 | Honedge | Common (C) |  | Pokémon |
| 100/129 | Doublade | Common (C) |  | Pokémon |
| 101/129 | Aegislash ex | Double Rare (RR) |  | Pokémon ex |
| 102/129 | Zacian | Rare (R) |  | Pokémon |
| 103/129 | Orthworm | Uncommon (U) |  | Pokémon |
| 104/129 | Altaria ex | Double Rare (RR) |  | Pokémon ex |
| 105/129 | Zigzagoon | Common (C) |  | Pokémon |
| 106/129 | Linoone | Common (C) |  | Pokémon |
| 107/129 | Swablu | Common (C) |  | Pokémon |
| 108/129 | Skwovet | Common (C) |  | Pokémon |
| 109/129 | Greedent ex | Double Rare (RR) |  | Pokémon ex |
| 110/129 | Lechonk | Common (C) |  | Pokémon |
| 111/129 | Oinkologne | Uncommon (U) |  | Pokémon |
| 112/129 | Cyclizar | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 113/129 | Flamigo | Uncommon (U) |  | Pokémon |
| 114/129 | Energy Sticker | Uncommon (U) |  | Item |
| 115/129 | Snorlax Doll | Uncommon (U) |  | Item |
| 116/129 | Fighting Au Lait | Uncommon (U) |  | Item |
| 117/129 | Cursed Duster | Uncommon (U) |  | Pokémon Tool |
| 118/129 | Patrol Cap | Uncommon (U) |  | Pokémon Tool |
| 119/129 | Technical Machine: Evolution | Uncommon (U) |  | Pokémon Tool |
| 120/129 | Technical Machine: Devolution | Uncommon (U) |  | Pokémon Tool |
| 121/129 | Larry | Common (C) |  | Supporter |
| 122/129 | Shauntal | Uncommon (U) |  | Supporter |
| 123/129 | Clive | Uncommon (U) |  | Supporter |
| 124/129 | Paldean Student | Uncommon (U) |  | Supporter |
| 125/129 | Paldean Student | Uncommon (U) |  | Supporter |
| 126/129 | Poppy | Uncommon (U) |  | Supporter |
| 127/129 | Mela | Uncommon (U) |  | Supporter |
| 128/129 | Town Store | Uncommon (U) |  | Stadium |
| 129/129 | Medical Energy | Uncommon (U) |  | Special Energy |
| 130/129 | Gloom | Art Rare (AR) | Gloom 002/129 | Art Rare |
| 131/129 | Toedscruel | Art Rare (AR) | Toedscruel 009/129 | Art Rare |
| 132/129 | Joltik | Art Rare (AR) | Joltik 044/129 | Art Rare |
| 133/129 | Minior | Art Rare (AR) | Minior 070/129 | Art Rare |
| 134/129 | Houndour | Art Rare (AR) | Houndour 081/129 | Art Rare |
| 135/129 | Yveltal | Art Rare (AR) | Yveltal 089/129 | Art Rare |
| 136/129 | Swablu | Art Rare (AR) | Swablu 107/129 | Art Rare |
| 137/129 | Lechonk | Art Rare (AR) | Lechonk 110/129 | Art Rare |
| 138/129 | Eiscue ex | Super Rare (SR) | Eiscue ex 019/129 | full art |
| 139/129 | Armarouge ex | Super Rare (SR) | Armarouge ex 021/129 | full art |
| 140/129 | Garchomp ex | Super Rare (SR) | Garchomp ex 028/129 | full art |
| 141/129 | Vespiquen ex | Super Rare (SR) | Vespiquen ex 056/129 | full art |
| 142/129 | Hoopa ex | Super Rare (SR) | Hoopa ex 069/129 | full art |
| 143/129 | Toxtricity ex | Super Rare (SR) | Toxtricity ex 071/129 | full art |
| 144/129 | Glimmora ex | Super Rare (SR) | Glimmora ex 073/129 | full art |
| 145/129 | Charizard ex | Super Rare (SR) | Charizard ex 075/129 | full art |
| 146/129 | Aegislash ex | Super Rare (SR) | Aegislash ex 101/129 | full art |
| 147/129 | Altaria ex | Super Rare (SR) | Altaria ex 104/129 | full art |
| 148/129 | Larry | Super Rare (SR) | Larry 121/129 | full art, Supporter |
| 149/129 | Shauntal | Super Rare (SR) | Shauntal 122/129 | full art, Supporter |
| 150/129 | Clive | Super Rare (SR) | Clive 123/129 | full art, Supporter |
| 151/129 | Poppy | Super Rare (SR) | Poppy 126/129 | full art, Supporter |
| 152/129 | Mela | Super Rare (SR) | Mela 127/129 | full art, Supporter |
| 153/129 | Eiscue ex | Special Art Rare (SAR) | Eiscue ex 019/129 | special art |
| 154/129 | Garchomp ex | Special Art Rare (SAR) | Garchomp ex 028/129 | special art |
| 155/129 | Charizard ex | Special Art Rare (SAR) | Charizard ex 075/129 | special art |
| 156/129 | Altaria ex | Special Art Rare (SAR) | Altaria ex 104/129 | special art |
| 157/129 | Larry | Special Art Rare (SAR) | Larry 121/129 | special art, Supporter, **Chinese exclusive (Chen)** |
| 158/129 | Clive | Special Art Rare (SAR) | Clive 123/129 | special art, Supporter |
| 159/129 | Poppy | Special Art Rare (SAR) | Poppy 126/129 | special art, Supporter |
| 160/129 | Mela | Special Art Rare (SAR) | Mela 127/129 | special art, Supporter |
| 161/129 | Garchomp ex | Ultra Rare (UR) | Garchomp ex 028/129 | gold |
| 162/129 | Charizard ex | Ultra Rare (UR) | Charizard ex 075/129 | gold |
| 163/129 | Rare Candy | Ultra Rare (UR) | *(no main-set card)* | gold |
| 164/129 | Defiance Band | Ultra Rare (UR) | *(no main-set card)* | gold |
