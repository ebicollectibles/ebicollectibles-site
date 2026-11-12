# CSV6 True Mystic: sourcing notes

Source: https://www.chencards.com/sets/true_mystic (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **True Mystic** (真实玄虚). Chen hosts its images in a folder called `true-mystery`, an alternate English name for the set; I used Chen's display name "True Mystic" everywhere.
- Official set code: **CSV6C**. Files: `src/data/csv6.json`, `csv6-images/`, branch `csv6-data`, `slug: "csv6"`. The image placeholders use the set name: `Chinese/True Mystic/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2025-11-07**
- **163 cards**: `001/128`–`128/128` main set + `129/128`–`163/128` secret rares (printed total **128**)
- **No odds chart on Chen** for this set (no image, no source link, no cards-per-pack figure), so the counts below can't be cross-checked against an official chart. I checked every C/U card's printed rarity letter instead; see below.
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

| Rank | Chen's exact string | Cards |
|---|---|---|
| 1 | Common (C) | 61 |
| 2 | Uncommon (U) | 41 |
| 3 | Rare (R) | 13 |
| 4 | Double Rare (RR) | 13 |
| 5 | Art Rare (AR) | 8 |
| 6 | Super Rare (SR) | 15 |
| 7 | Special Art Rare (SAR) | 8 |
| 8 | Ultra Rare (UR) | 4 |
| | **Total** | **163** |

Order follows the other Chinese SV sets' official charts (C < U < R < RR < AR < SR < SAR < UR); this set's own chart isn't on Chen. The sister sets' charts also list Poké Ball and Master Ball pattern parallels of every C/U/R card. Expect the same here, but neither appears on Chen.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–128) | Secret (129–163) |
|---|---|---|
| Common (C) | 61 | 0 |
| Uncommon (U) | 41 | 0 |
| Rare (R) | 13 | 0 |
| Double Rare (RR) | 13 | 0 |
| Art Rare (AR) | 0 | 8 |
| Super Rare (SR) | 0 | 15 |
| Special Art Rare (SAR) | 0 | 8 |
| Ultra Rare (UR) | 0 | 4 |

### Rarity corrections to Chen's data

None found. With no chart, I read the printed rarity letter on all 102 Common/Uncommon cards, and every one matches Chen's label.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/128`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–113 | Pokémon, grouped by type | 113 | C 61, U 27, R 12, RR 13 (13 ex) |
| 114–117 | Items | 4 | U 4 |
| 118–120 | Pokémon Tools | 3 | U 3 |
| 121–126 | Supporters | 6 | U 5, R 1 |
| 127–128 | Stadiums | 2 | U 2 |
| 129–136 | Art Rares of main-set Pokémon | 8 | AR |
| 137–151 | Super Rare full arts (ex + Supporters) | 15 | SR |
| 152–159 | Special Art Rares (ex + Supporters) | 8 | SAR |
| 160–163 | Ultra Rare gold (ex + Trainers/Energy) | 4 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (1):** 163/128 Pal Pad (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Main-set ex with no secret version:** 015 Espathra ex, 081 Great Tusk ex, 099 Skeledirge ex, 100 Iron Treads ex.
- **Names with "'s ":** 0 Pokémon and 3 Trainer cards (e.g. Nemona's Backpack, Professor Sada's Vitality, Professor Turo's Scenario). Display them whole; the Gem engine's owner/mon split on "'s " doesn't fit Trainer names.
- **Image sizes:** 300×418 and 300×419 only; nothing oversized.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/128"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/128`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 0 corrections above**; `image` is `Chinese/True Mystic/Cards/NNNN.webp` (matching `csv6-images/cards/`). No `catalogGroups`.

## Chinese-exclusive card

- **152/128**: Iron Hands ex, Special Art Rare.

Chen gives no extra note for it.

## Suggested hero theme colors

The logo "真实玄虚" is teal fading into indigo and orchid, with a near-black outline (`#111A22`). It's the Paradox (Ancient/Future) set.

- **Primary, mystic indigo `#403A71`:** hero background or text accent (readable as text on white).
- **Secondary, teal `#288597`:** chips and highlights; orchid `#9E5193` as a third accent.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **155/128 Roaring Moon ex SAR** | Roaring Moon ex SAR, the headline Ancient Paradox |
| inner left | **153/128 Iron Valiant ex SAR** | Iron Valiant ex SAR, its Future counterpart |
| inner right | **152/128 Iron Hands ex SAR** | Iron Hands ex SAR, the Chinese exclusive |
| outer left | **157/128 Geeta SAR** | Geeta SAR |
| outer right | **161/128 Roaring Moon ex UR** | Roaring Moon ex UR, gold, the top tier |

Alternatives: 154 Sandy Shocks ex SAR, 158 Professor Turo's Scenario SAR, 156 Professor Sada's Vitality SAR or 160 Iron Valiant ex UR.

## Files

- `src/data/csv6.json`: 163 cards, schema as above.
- `csv6-images/cards/0001.webp`–`0163.webp`: all 163 images.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/128 | Surskit | Common (C) |  | Pokémon |
| 002/128 | Masquerain | Uncommon (U) |  | Pokémon |
| 003/128 | Froslass ex | Double Rare (RR) |  | Pokémon ex |
| 004/128 | Pansage | Common (C) |  | Pokémon |
| 005/128 | Simisage | Uncommon (U) |  | Pokémon |
| 006/128 | Maractus | Common (C) |  | Pokémon |
| 007/128 | Dwebble | Common (C) |  | Pokémon |
| 008/128 | Crustle | Common (C) |  | Pokémon |
| 009/128 | Bounsweet | Common (C) |  | Pokémon |
| 010/128 | Steenee | Uncommon (U) |  | Pokémon |
| 011/128 | Blipbug | Common (C) |  | Pokémon |
| 012/128 | Dottler | Common (C) |  | Pokémon |
| 013/128 | Orbeetle | Uncommon (U) |  | Pokémon |
| 014/128 | Nymble | Common (C) |  | Pokémon |
| 015/128 | Espathra ex | Double Rare (RR) |  | Pokémon ex |
| 016/128 | Magby | Common (C) |  | Pokémon |
| 017/128 | Magmar | Common (C) |  | Pokémon |
| 018/128 | Magmortar | Uncommon (U) |  | Pokémon |
| 019/128 | Heat Rotom | Common (C) |  | Pokémon |
| 020/128 | Pansear | Common (C) |  | Pokémon |
| 021/128 | Simisear | Uncommon (U) |  | Pokémon |
| 022/128 | Volcanion | Common (C) |  | Pokémon |
| 023/128 | Fuecoco | Common (C) |  | Pokémon |
| 024/128 | Crocalor | Common (C) |  | Pokémon |
| 025/128 | Iron Moth | Rare (R) |  | Pokémon |
| 026/128 | Horsea | Common (C) |  | Pokémon |
| 027/128 | Seadra | Common (C) |  | Pokémon |
| 028/128 | Kingdra | Rare (R) |  | Pokémon |
| 029/128 | Lapras | Common (C) |  | Pokémon |
| 030/128 | Feebas | Common (C) |  | Pokémon |
| 031/128 | Milotic | Rare (R) |  | Pokémon |
| 032/128 | Snorunt | Common (C) |  | Pokémon |
| 033/128 | Panpour | Common (C) |  | Pokémon |
| 034/128 | Simipour | Uncommon (U) |  | Pokémon |
| 035/128 | Vanillite | Common (C) |  | Pokémon |
| 036/128 | Vanillish | Common (C) |  | Pokémon |
| 037/128 | Vanilluxe | Uncommon (U) |  | Pokémon |
| 038/128 | Tsareena ex | Double Rare (RR) |  | Pokémon ex |
| 039/128 | Wiglett | Common (C) |  | Pokémon |
| 040/128 | Wugtrio | Uncommon (U) |  | Pokémon |
| 041/128 | Veluza | Uncommon (U) |  | Pokémon |
| 042/128 | Iron Bundle | Uncommon (U) |  | Pokémon |
| 043/128 | Chien-Pao | Rare (R) |  | Pokémon |
| 044/128 | Elekid | Common (C) |  | Pokémon |
| 045/128 | Tyranitar ex | Double Rare (RR) |  | Pokémon ex |
| 046/128 | Blitzle | Common (C) |  | Pokémon |
| 047/128 | Zebstrika | Uncommon (U) |  | Pokémon |
| 048/128 | Oricorio | Common (C) |  | Pokémon |
| 049/128 | Tadbulb | Common (C) |  | Pokémon |
| 050/128 | Bellibolt | Common (C) |  | Pokémon |
| 051/128 | Iron Hands ex | Double Rare (RR) |  | Pokémon ex |
| 052/128 | Chimecho | Common (C) |  | Pokémon |
| 053/128 | Mime Jr. | Common (C) |  | Pokémon |
| 054/128 | Woobat | Common (C) |  | Pokémon |
| 055/128 | Swoobat | Uncommon (U) |  | Pokémon |
| 056/128 | Yamask | Common (C) |  | Pokémon |
| 057/128 | Cofagrigus ex | Double Rare (RR) |  | Pokémon ex |
| 058/128 | Pumpkaboo | Common (C) |  | Pokémon |
| 059/128 | Gourgeist | Uncommon (U) |  | Pokémon |
| 060/128 | Flittle | Common (C) |  | Pokémon |
| 061/128 | Espathra | Rare (R) |  | Pokémon |
| 062/128 | Tinkatink | Common (C) |  | Pokémon |
| 063/128 | Tinkatuff | Common (C) |  | Pokémon |
| 064/128 | Tinkaton | Uncommon (U) |  | Pokémon |
| 065/128 | Scream Tail | Uncommon (U) |  | Pokémon |
| 066/128 | Iron Valiant ex | Double Rare (RR) |  | Pokémon ex |
| 067/128 | Onix | Common (C) |  | Pokémon |
| 068/128 | Larvitar | Common (C) |  | Pokémon |
| 069/128 | Pupitar | Common (C) |  | Pokémon |
| 070/128 | Mienfoo | Common (C) |  | Pokémon |
| 071/128 | Mienshao | Uncommon (U) |  | Pokémon |
| 072/128 | Diggersby | Common (C) |  | Pokémon |
| 073/128 | Clobbopus | Common (C) |  | Pokémon |
| 074/128 | Grapploct | Uncommon (U) |  | Pokémon |
| 075/128 | Nacli | Common (C) |  | Pokémon |
| 076/128 | Naclstack | Common (C) |  | Pokémon |
| 077/128 | Garganacl | Rare (R) |  | Pokémon |
| 078/128 | Toedscool | Common (C) |  | Pokémon |
| 079/128 | Toedscruel | Uncommon (U) |  | Pokémon |
| 080/128 | Klawf | Uncommon (U) |  | Pokémon |
| 081/128 | Great Tusk ex | Double Rare (RR) |  | Pokémon ex |
| 082/128 | Slither Wing | Uncommon (U) |  | Pokémon |
| 083/128 | Sandy Shocks ex | Double Rare (RR) |  | Pokémon ex |
| 084/128 | Ting-Lu | Rare (R) |  | Pokémon |
| 085/128 | Zubat | Common (C) |  | Pokémon |
| 086/128 | Golbat | Common (C) |  | Pokémon |
| 087/128 | Crobat | Uncommon (U) |  | Pokémon |
| 088/128 | Paldean Wooper | Common (C) |  | Pokémon |
| 089/128 | Paldean Clodsire | Uncommon (U) |  | Pokémon |
| 090/128 | Purrloin | Common (C) |  | Pokémon |
| 091/128 | Liepard | Common (C) |  | Pokémon |
| 092/128 | Trubbish | Common (C) |  | Pokémon |
| 093/128 | Garbodor | Uncommon (U) |  | Pokémon |
| 094/128 | Lokix | Rare (R) |  | Pokémon |
| 095/128 | Brute Bonnet | Rare (R) |  | Pokémon |
| 096/128 | Roaring Moon ex | Double Rare (RR) |  | Pokémon ex |
| 097/128 | Steelix | Rare (R) |  | Pokémon |
| 098/128 | Durant | Uncommon (U) |  | Pokémon |
| 099/128 | Skeledirge ex | Double Rare (RR) |  | Pokémon ex |
| 100/128 | Iron Treads ex | Double Rare (RR) |  | Pokémon ex |
| 101/128 | Porygon | Common (C) |  | Pokémon |
| 102/128 | Porygon2 | Common (C) |  | Pokémon |
| 103/128 | Porygon-Z | Rare (R) |  | Pokémon |
| 104/128 | Aipom | Common (C) |  | Pokémon |
| 105/128 | Ambipom | Uncommon (U) |  | Pokémon |
| 106/128 | Miltank | Common (C) |  | Pokémon |
| 107/128 | Whismur | Common (C) |  | Pokémon |
| 108/128 | Loudred | Common (C) |  | Pokémon |
| 109/128 | Exploud | Uncommon (U) |  | Pokémon |
| 110/128 | Spinda | Common (C) |  | Pokémon |
| 111/128 | Bunnelby | Common (C) |  | Pokémon |
| 112/128 | Bombirdier ex | Double Rare (RR) |  | Pokémon ex |
| 113/128 | Iron Jugulis | Rare (R) |  | Pokémon |
| 114/128 | Counter Catcher | Uncommon (U) |  | Item |
| 115/128 | Earthen Vessel | Uncommon (U) |  | Item |
| 116/128 | Techno Radar | Uncommon (U) |  | Item |
| 117/128 | Nemona's Backpack | Uncommon (U) |  | Item |
| 118/128 | Ancient Booster Energy Capsule | Uncommon (U) |  | Pokémon Tool |
| 119/128 | Future Booster Energy Capsule | Uncommon (U) |  | Pokémon Tool |
| 120/128 | Technical Machine: Crisis Punch | Uncommon (U) |  | Pokémon Tool |
| 121/128 | Professor Sada's Vitality | Uncommon (U) |  | Supporter |
| 122/128 | Geeta | Rare (R) |  | Supporter |
| 123/128 | Norman | Uncommon (U) |  | Supporter |
| 124/128 | Roark | Uncommon (U) |  | Supporter |
| 125/128 | Professor Turo's Scenario | Uncommon (U) |  | Supporter |
| 126/128 | Tulip | Uncommon (U) |  | Supporter |
| 127/128 | Cycling Road | Uncommon (U) |  | Stadium |
| 128/128 | Pokémon League Headquarters | Uncommon (U) |  | Stadium |
| 129/128 | Iron Moth | Art Rare (AR) | Iron Moth 025/128 | Art Rare |
| 130/128 | Veluza | Art Rare (AR) | Veluza 041/128 | Art Rare |
| 131/128 | Espathra | Art Rare (AR) | Espathra 061/128 | Art Rare |
| 132/128 | Garganacl | Art Rare (AR) | Garganacl 077/128 | Art Rare |
| 133/128 | Slither Wing | Art Rare (AR) | Slither Wing 082/128 | Art Rare |
| 134/128 | Garbodor | Art Rare (AR) | Garbodor 093/128 | Art Rare |
| 135/128 | Brute Bonnet | Art Rare (AR) | Brute Bonnet 095/128 | Art Rare |
| 136/128 | Iron Jugulis | Art Rare (AR) | Iron Jugulis 113/128 | Art Rare |
| 137/128 | Froslass ex | Super Rare (SR) | Froslass ex 003/128 | full art |
| 138/128 | Tsareena ex | Super Rare (SR) | Tsareena ex 038/128 | full art |
| 139/128 | Tyranitar ex | Super Rare (SR) | Tyranitar ex 045/128 | full art |
| 140/128 | Iron Hands ex | Super Rare (SR) | Iron Hands ex 051/128 | full art |
| 141/128 | Cofagrigus ex | Super Rare (SR) | Cofagrigus ex 057/128 | full art |
| 142/128 | Iron Valiant ex | Super Rare (SR) | Iron Valiant ex 066/128 | full art |
| 143/128 | Sandy Shocks ex | Super Rare (SR) | Sandy Shocks ex 083/128 | full art |
| 144/128 | Roaring Moon ex | Super Rare (SR) | Roaring Moon ex 096/128 | full art |
| 145/128 | Bombirdier ex | Super Rare (SR) | Bombirdier ex 112/128 | full art |
| 146/128 | Professor Sada's Vitality | Super Rare (SR) | Professor Sada's Vitality 121/128 | full art, Supporter |
| 147/128 | Geeta | Super Rare (SR) | Geeta 122/128 | full art, Supporter |
| 148/128 | Norman | Super Rare (SR) | Norman 123/128 | full art, Supporter |
| 149/128 | Roark | Super Rare (SR) | Roark 124/128 | full art, Supporter |
| 150/128 | Professor Turo's Scenario | Super Rare (SR) | Professor Turo's Scenario 125/128 | full art, Supporter |
| 151/128 | Tulip | Super Rare (SR) | Tulip 126/128 | full art, Supporter |
| 152/128 | Iron Hands ex | Special Art Rare (SAR) | Iron Hands ex 051/128 | special art, **Chinese exclusive (Chen)** |
| 153/128 | Iron Valiant ex | Special Art Rare (SAR) | Iron Valiant ex 066/128 | special art |
| 154/128 | Sandy Shocks ex | Special Art Rare (SAR) | Sandy Shocks ex 083/128 | special art |
| 155/128 | Roaring Moon ex | Special Art Rare (SAR) | Roaring Moon ex 096/128 | special art |
| 156/128 | Professor Sada's Vitality | Special Art Rare (SAR) | Professor Sada's Vitality 121/128 | special art, Supporter |
| 157/128 | Geeta | Special Art Rare (SAR) | Geeta 122/128 | special art, Supporter |
| 158/128 | Professor Turo's Scenario | Special Art Rare (SAR) | Professor Turo's Scenario 125/128 | special art, Supporter |
| 159/128 | Tulip | Special Art Rare (SAR) | Tulip 126/128 | special art, Supporter |
| 160/128 | Iron Valiant ex | Ultra Rare (UR) | Iron Valiant ex 066/128 | gold |
| 161/128 | Roaring Moon ex | Ultra Rare (UR) | Roaring Moon ex 096/128 | gold |
| 162/128 | Counter Catcher | Ultra Rare (UR) | Counter Catcher 114/128 | gold, Item |
| 163/128 | Pal Pad | Ultra Rare (UR) | *(no main-set card)* | gold |
