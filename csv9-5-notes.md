# CSV9.5 Crystal Gathering: sourcing notes

Source: https://www.chencards.com/sets/crystal_gathering (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name: **Crystal Gathering** (太晶盛聚, roughly "Terastal Gathering"). **Chen has no set called "Terastal Festival"**: `/sets/terastal_festival` is an empty page, and the only Chen set with "Terastal" in the name is Fearless Terastal (CSV3C). You confirmed CSV9.5. This set is the Chinese counterpart of Japan's **Terastal Festival ex** reprint/compilation set: an Eeveelution-heavy holo set with 10-card packs and the Poké Ball / Master Ball pattern parallels. Chen even hosts its images in a folder called `terastal-gathering`.
- Official set code: **CSV9.5C**. I used `slug: "csv9-5"` and the files `src/data/csv9-5.json` / `csv9-5-images/` / branch `csv9-5-data` to avoid a dot in paths. The image placeholders use the set name: `Chinese/Crystal Gathering/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, the ".5" special set between CSV9C Stellar Crystal and CSV10C Chasing Glory. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2026-06-12**
- **259 cards on Chen's page**: `001/208`–`208/208` main set + `209/208`–`259/208` secret rares (printed total **208**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/21997.html): **10 cards per pack, either 7 non-holo + 3 holo or 6 non-holo + 4 holo.**
- **One numbering system, every card has a rarity and an image.** The irregularities are about names and tiers; see below.

## Rarity tiers, most common to rarest

The official chart ranks **eleven** kinds of card. Chen uses **eight** rarity strings, because it lists neither Ball-pattern parallel and merges the chart's two SAR tiers into one:

| Chart rank | Chart tier | Chen's exact string | Abbr. | Kinds (chart) | On Chen's list | Production ratio (chart, grouped) |
|---|---|---|---|---|---|---|
| 1 | C | Common (C) | C | 61 | 61 | 85.60% (C + U, the non-holo slots) |
| 2 | U | Uncommon (U) | U | 66 | 66 | ↑ |
| 3 | R | Rare (R) | R | 44 | 44 | 13.00% (R through Master Ball pattern) |
| 4 | RR | Double Rare (RR) | RR | 29 | 29 | ↑ |
| 5 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | none | 171 | 0 | ↑ |
| 6 | ACE | ACE SPEC Rare (ACE) | ACE | 8 | 8 | ↑ |
| 7 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | none | 171 | 0 | ↑ |
| 8 | **SAR (Pokémon)** (宝可梦) | Special Art Rare (SAR) | SAR | 28 | 28 | 1.40% (SAR + SR + SAR + UR) |
| 9 | SR | Super Rare (SR) | SR | 12 | 12 | ↑ |
| 10 | **SAR (Trainer)** (训练家) | Special Art Rare (SAR) | SAR | 6 | 6 | ↑ |
| 11 | UR | Ultra Rare (UR) | UR | 5 | 5 | ↑ |
| | **Total** | | | 601 | **259** | 100% |

Things to watch in this table:

- **Poké Ball and Master Ball pattern parallels (171 each).** The chart footnotes say they cover every C, U and R card (61 + 66 + 44 = 171), with the same content and a different finish, and that in this product they're a special-process version. As with CSV10, they're real cards with **no entries or images on Chen** and **aren't in the JSON**. Model them as a per-card finish if the page wants them.
- **ACE SPEC Rare (ACE)** is a tier Chen hasn't used before: 8 Trainer and Energy cards (ACE SPEC, one per deck), each with a pink frame header. They sit **inside the main set** at their natural Trainer numbers (163, 166, 168, 169, 172, 179, 205, 208), not in the secret block. The chart ranks ACE between RR and the Master Ball pattern.
- **The chart splits SAR into two tiers with Super Rare between them:** SAR (Pokémon) 28 < SR 12 < SAR (Trainer) 6 < UR 5. **Chen uses one string, "Special Art Rare (SAR)", for all 34.** A single `rarityOrder` can't express that. I kept the order consistent with the other sets (**… SR < SAR < UR**) so the EBI pages rank tiers the same way. If this page shows an odds table, split SAR the way the chart does: the Pokémon SARs are the 28 ex cards (221–248) and the Trainer SARs are 249–254. All four secret-rare tiers share one 1.40% production band, so the in-band order doesn't change the odds shown.
- **No Art Rare (AR) tier** in this set.
- The production ratios are grouped bands, so present them as bands.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "ACE SPEC Rare (ACE)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–208) | Secret (209–259) |
|---|---|---|
| Common (C) | 61 | 0 |
| Uncommon (U) | 66 | 0 |
| Rare (R) | 44 | 0 |
| Double Rare (RR) | 29 | 0 |
| ACE SPEC Rare (ACE) | 8 | 0 |
| Super Rare (SR) | 0 | 12 |
| Special Art Rare (SAR) | 0 | 34 |
| Ultra Rare (UR) | 0 | 5 |

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/208`. Rarer versions sit at unrelated numbers in the secret block and match only **by name**, e.g. Teal Mask Ogerpon ex is 021 (RR), 222 (SAR) and 256 (UR); Umbreon is 103 (U), Umbreon ex 104 (RR) and 239 (SAR).

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–156 | Pokémon, grouped by type | 156 | C, U, R, RR (29 ex) |
| 157–171 | Items | 15 | U, 4 ACE |
| 172–181 | Pokémon Tools | 10 | U, 2 ACE |
| 182–200 | Supporters | 19 | U, except 188 Black Belt's Training (R) |
| 201–205 | Stadiums | 5 | U, 1 ACE |
| 206–208 | Special Energy | 3 | U, 1 ACE |
| 209–220 | Super Rare full arts of Supporters | 12 | SR |
| 221–248 | Special Art Rares of 28 ex (chart: "SAR Pokémon") | 28 | SAR |
| 249–254 | Special Art Rares of 6 Supporters (chart: "SAR Trainer") | 6 | SAR |
| 255–259 | Ultra Rare gold ex | 5 | UR |

Card types for 157–208 were read from each card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

**1. Secret rares with no main-set card (11).** As a compilation set, many secret rares print cards that aren't in 001–208 at all, so a name-match "other versions" link finds nothing for them:

| No. | Card | Rarity | Note |
|---|---|---|---|
| 210/208 | Ortega | Super Rare (SR) | Supporter not in the main set |
| 211/208 | Brassius | Super Rare (SR) | Supporter not in the main set |
| 212/208 | Atticus | Super Rare (SR) | Supporter not in the main set |
| 213/208 | Atticus | Super Rare (SR) | Supporter not in the main set |
| 214/208 | Tyme | Super Rare (SR) | Supporter not in the main set |
| 217/208 | Giacomo | Super Rare (SR) | Supporter not in the main set |
| 218/208 | Eri | Super Rare (SR) | Supporter not in the main set |
| 220/208 | Raifort | Super Rare (SR) | Supporter not in the main set |
| 224/208 | Ceruledge ex | Special Art Rare (SAR) | main set has only plain **Ceruledge** (077 R), not the ex |
| 251/208 | Drayton | Special Art Rare (SAR) | Supporter not in the main set |
| 258/208 | Pikachu ex | Ultra Rare (UR) | no Pikachu at all in 001–208 |

**2. Same name, different cards.** Matching versions by name will merge cards that aren't the same:

- **Hawlucha** appears twice in the main set: 095/208 Rare (R), 153/208 Common (C). They're different cards (in the images, one has a Fighting and one a Colorless frame) that happen to share a name.
- **Bloodmoon Ursaluna** 096 (R) and **Bloodmoon Ursaluna ex** 154 (RR) are separate cards, matched only if you strip "ex".
- **Atticus** has two secret-rare versions at the **same rarity** with different art: 212/208 Super Rare (SR), 213/208 Super Rare (SR). Both cards print the same Chinese name (秋明) but show **different art**: 212 is the masked Team Star look, 213 a different, unmasked look. Worth checking against a physical card or an official list before labeling them.
- **Sylveon ex** has two secret-rare versions at the **same rarity** with different art: 233/208 Special Art Rare (SAR), 234/208 Special Art Rare (SAR). **234 is Chen's exclusive**, so the two need to stay distinguishable.
- **Eevee ex** has two secret-rare versions at the **same rarity** with different art: 245/208 Special Art Rare (SAR), 246/208 Special Art Rare (SAR).

**3. Main-set ex with no secret version:** 030 Gouging Fire ex, 045 Garchomp ex. Fine, but note it so nobody expects an SAR.

**4. Image sizes are mixed:** 117 at 300×418, 92 at 300×419 and **50 at 320×446/447**. Unlike the earlier sets, the 320-wide size **doesn't mark the exclusive**: it's spread across normal main-set and secret cards (e.g. 004 Budew, 006 Leafeon ex, 139 Eevee, 221 Leafeon ex SAR). Scale every image to a common box rather than relying on its native size.

### Will the existing Gem Set engine render it as-is? **No.**

Same `number.slice(0, 4)` problem as Black Bolt, White Flare, CSV10 and 30th Celebration (`"001/208"` gives id `"001/"` and groups cards by their first two digits), plus the Gem ladder rows, labels and odds table don't fit. It needs the **flat-catalog page**, with three extras: "other versions" that tolerates orphans and same-name pairs, the ACE tier color, and optionally the two-SAR odds split and the Ball-pattern finishes.

### JSON mapping

Same top-level and card fields as `black-bolt.json`/`csv10.json`. `number` is Chen's `NNN/208`; `pokemonIndex` is the collector number (1–259); `version` is 1; `rarity` is Chen's exact string; `image` is `Chinese/Crystal Gathering/Cards/NNNN.webp` (`0001`–`0259`, matching `csv9-5-images/cards/`). `series` is Chen's "Chinese Scarlet & Violet Series". No `catalogGroups`.

## Chinese-exclusive card

- Chen flags **one** card: **234/208 Sylveon ex, Special Art Rare**, the **second** Sylveon ex SAR (233 is the other one). Chen gives no extra note. On the page, label 234 specifically, since 233 shares its name and rarity.

## Suggested hero theme colors

The logo "太晶盛聚" is a **Tera-crystal rainbow** (peach, mint and coral bands) with a near-black outline (`#0E1214`) and a deep plum shadow (`#4D1C29`). Its strongest colors are **Tera teal** (`#69B49B`, deeper `#477679`) and **coral** (`#D87B73`). The 5 gold URs are bright gold (`#EDC10E`).

- **Primary, deep Tera teal `#477679`:** hero background or text-weight accent; it's readable as text on white.
- **Secondary, coral `#D87B73`:** chips, highlights and the rarity glow (fills only; too light for body text).

A thin rainbow gradient echoing the logo (peach → mint → coral) works as a hero underline. That keeps it distinct from CSV10 (orange and ember-black), Black Bolt and White Flare, 30th Celebration (gold and cocoa) and the magenta Gem sets.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **239/208 Umbreon ex SAR** | the set's headline chase, the equivalent of the most sought-after card in this kind of Eeveelution set |
| inner left | **245/208 Eevee ex SAR** | the mascot of an Eeveelution-heavy set (pick 245 or 246, the two Eevee ex SARs) |
| inner right | **234/208 Sylveon ex SAR** | the Chinese exclusive |
| outer left | **248/208 Terapagos ex SAR** | the Terastal legendary, in keeping with the crystal theme |
| outer right | **258/208 Pikachu ex UR** | gold Pikachu, the top tier and instantly recognizable |

Alternatives: 222 Teal Mask Ogerpon ex SAR, 243 Dragapult ex SAR, 231 Iron Hands ex SAR, or the gold 259 Terapagos ex UR.

## Files

- `src/data/csv9-5.json`: 259 cards, schema as above.
- `csv9-5-images/cards/0001.webp`–`0259.webp`: all 259 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/208 | Exeggcute | Common (C) |  | Pokémon |
| 002/208 | Exeggutor | Uncommon (U) |  | Pokémon |
| 003/208 | Pinsir | Common (C) |  | Pokémon |
| 004/208 | Budew | Common (C) |  | Pokémon |
| 005/208 | Leafeon | Uncommon (U) |  | Pokémon |
| 006/208 | Leafeon ex | Double Rare (RR) |  | Pokémon ex |
| 007/208 | Cottonee | Common (C) |  | Pokémon |
| 008/208 | Whimsicott | Rare (R) |  | Pokémon |
| 009/208 | Grookey | Common (C) |  | Pokémon |
| 010/208 | Thwackey | Common (C) |  | Pokémon |
| 011/208 | Applin | Common (C) |  | Pokémon |
| 012/208 | Dipplin | Common (C) |  | Pokémon |
| 013/208 | Bramblin | Common (C) |  | Pokémon |
| 014/208 | Brambleghast | Rare (R) |  | Pokémon |
| 015/208 | Rellor | Common (C) |  | Pokémon |
| 016/208 | Rabsca | Uncommon (U) |  | Pokémon |
| 017/208 | Wo-Chien | Rare (R) |  | Pokémon |
| 018/208 | Iron Leaves ex | Double Rare (RR) |  | Pokémon ex |
| 019/208 | Poltchageist | Common (C) |  | Pokémon |
| 020/208 | Sinistcha | Rare (R) |  | Pokémon |
| 021/208 | Teal Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 022/208 | Flareon | Rare (R) |  | Pokémon |
| 023/208 | Flareon ex | Double Rare (RR) |  | Pokémon ex |
| 024/208 | Litleo | Common (C) |  | Pokémon |
| 025/208 | Pyroar | Uncommon (U) |  | Pokémon |
| 026/208 | Charcadet | Common (C) |  | Pokémon |
| 027/208 | Iron Moth | Rare (R) |  | Pokémon |
| 028/208 | Chi-Yu | Rare (R) |  | Pokémon |
| 029/208 | Hearthflame Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 030/208 | Gouging Fire ex | Double Rare (RR) |  | Pokémon ex |
| 031/208 | Slowpoke | Common (C) |  | Pokémon |
| 032/208 | Slowking | Uncommon (U) |  | Pokémon |
| 033/208 | Goldeen | Common (C) |  | Pokémon |
| 034/208 | Seaking | Uncommon (U) |  | Pokémon |
| 035/208 | Vaporeon | Rare (R) |  | Pokémon |
| 036/208 | Vaporeon ex | Double Rare (RR) |  | Pokémon ex |
| 037/208 | Totodile | Common (C) |  | Pokémon |
| 038/208 | Croconaw | Common (C) |  | Pokémon |
| 039/208 | Feraligatr | Rare (R) |  | Pokémon |
| 040/208 | Suicune | Rare (R) |  | Pokémon |
| 041/208 | Feebas | Common (C) |  | Pokémon |
| 042/208 | Milotic | Uncommon (U) |  | Pokémon |
| 043/208 | Snorunt | Common (C) |  | Pokémon |
| 044/208 | Froslass | Rare (R) |  | Pokémon |
| 045/208 | Garchomp ex | Double Rare (RR) |  | Pokémon ex |
| 046/208 | Glaceon | Uncommon (U) |  | Pokémon |
| 047/208 | Glaceon ex | Double Rare (RR) |  | Pokémon ex |
| 048/208 | Wiglett | Common (C) |  | Pokémon |
| 049/208 | Wugtrio | Uncommon (U) |  | Pokémon |
| 050/208 | Finizen | Common (C) |  | Pokémon |
| 051/208 | Palafin | Common (C) |  | Pokémon |
| 052/208 | Palafin ex | Double Rare (RR) |  | Pokémon ex |
| 053/208 | Iron Bundle | Uncommon (U) |  | Pokémon |
| 054/208 | Chien-Pao | Rare (R) |  | Pokémon |
| 055/208 | Walking Wake ex | Double Rare (RR) |  | Pokémon ex |
| 056/208 | Wellspring Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 057/208 | Jolteon | Rare (R) |  | Pokémon |
| 058/208 | Jolteon ex | Double Rare (RR) |  | Pokémon ex |
| 059/208 | Zeraora | Rare (R) |  | Pokémon |
| 060/208 | Iron Hands ex | Double Rare (RR) |  | Pokémon ex |
| 061/208 | Iron Thorns | Rare (R) |  | Pokémon |
| 062/208 | Abra | Common (C) |  | Pokémon |
| 063/208 | Kadabra | Common (C) |  | Pokémon |
| 064/208 | Alakazam | Rare (R) |  | Pokémon |
| 065/208 | Natu | Common (C) |  | Pokémon |
| 066/208 | Xatu | Uncommon (U) |  | Pokémon |
| 067/208 | Espeon | Uncommon (U) |  | Pokémon |
| 068/208 | Espeon ex | Double Rare (RR) |  | Pokémon ex |
| 069/208 | Duskull | Common (C) |  | Pokémon |
| 070/208 | Dusclops | Common (C) |  | Pokémon |
| 071/208 | Dusknoir | Rare (R) |  | Pokémon |
| 072/208 | Spritzee | Common (C) |  | Pokémon |
| 073/208 | Aromatisse | Rare (R) |  | Pokémon |
| 074/208 | Swirlix | Common (C) |  | Pokémon |
| 075/208 | Sylveon | Uncommon (U) |  | Pokémon |
| 076/208 | Sylveon ex | Double Rare (RR) |  | Pokémon ex |
| 077/208 | Ceruledge | Rare (R) |  | Pokémon |
| 078/208 | Scream Tail | Uncommon (U) |  | Pokémon |
| 079/208 | Flutter Mane | Rare (R) |  | Pokémon |
| 080/208 | Gimmighoul | Common (C) |  | Pokémon |
| 081/208 | Iron Valiant ex | Double Rare (RR) |  | Pokémon ex |
| 082/208 | Munkidori | Rare (R) |  | Pokémon |
| 083/208 | Fezandipiti | Rare (R) |  | Pokémon |
| 084/208 | Iron Boulder | Rare (R) |  | Pokémon |
| 085/208 | Iron Crown ex | Double Rare (RR) |  | Pokémon ex |
| 086/208 | Larvitar | Common (C) |  | Pokémon |
| 087/208 | Pupitar | Common (C) |  | Pokémon |
| 088/208 | Relicanth | Rare (R) |  | Pokémon |
| 089/208 | Groudon | Rare (R) |  | Pokémon |
| 090/208 | Gible | Common (C) |  | Pokémon |
| 091/208 | Gabite | Common (C) |  | Pokémon |
| 092/208 | Hippopotas | Common (C) |  | Pokémon |
| 093/208 | Hippowdon | Common (C) |  | Pokémon |
| 094/208 | Drilbur | Common (C) |  | Pokémon |
| 095/208 | Hawlucha | Rare (R) |  | Pokémon |
| 096/208 | Bloodmoon Ursaluna | Rare (R) |  | Pokémon |
| 097/208 | Great Tusk | Uncommon (U) |  | Pokémon |
| 098/208 | Slither Wing | Uncommon (U) |  | Pokémon |
| 099/208 | Sandy Shocks ex | Double Rare (RR) |  | Pokémon ex |
| 100/208 | Ting-Lu | Rare (R) |  | Pokémon |
| 101/208 | Okidogi | Rare (R) |  | Pokémon |
| 102/208 | Cornerstone Mask Ogerpon ex | Double Rare (RR) |  | Pokémon ex |
| 103/208 | Umbreon | Uncommon (U) |  | Pokémon |
| 104/208 | Umbreon ex | Double Rare (RR) |  | Pokémon ex |
| 105/208 | Sneasel | Common (C) |  | Pokémon |
| 106/208 | Houndour | Common (C) |  | Pokémon |
| 107/208 | Houndoom | Uncommon (U) |  | Pokémon |
| 108/208 | Trubbish | Common (C) |  | Pokémon |
| 109/208 | Garbodor | Uncommon (U) |  | Pokémon |
| 110/208 | Zorua | Common (C) |  | Pokémon |
| 111/208 | Zoroark | Rare (R) |  | Pokémon |
| 112/208 | Morpeko | Rare (R) |  | Pokémon |
| 113/208 | Brute Bonnet | Rare (R) |  | Pokémon |
| 114/208 | Roaring Moon | Rare (R) |  | Pokémon |
| 115/208 | Roaring Moon ex | Double Rare (RR) |  | Pokémon ex |
| 116/208 | Pecharunt ex | Double Rare (RR) |  | Pokémon ex |
| 117/208 | Beldum | Common (C) |  | Pokémon |
| 118/208 | Metang | Common (C) |  | Pokémon |
| 119/208 | Jirachi | Common (C) |  | Pokémon |
| 120/208 | Bronzor | Common (C) |  | Pokémon |
| 121/208 | Bronzong | Common (C) |  | Pokémon |
| 122/208 | Heatran | Rare (R) |  | Pokémon |
| 123/208 | Honedge | Common (C) |  | Pokémon |
| 124/208 | Doublade | Common (C) |  | Pokémon |
| 125/208 | Aegislash | Rare (R) |  | Pokémon |
| 126/208 | Duraludon | Common (C) |  | Pokémon |
| 127/208 | Archaludon | Rare (R) |  | Pokémon |
| 128/208 | Varoom | Common (C) |  | Pokémon |
| 129/208 | Revavroom | Rare (R) |  | Pokémon |
| 130/208 | Iron Treads | Uncommon (U) |  | Pokémon |
| 131/208 | Gholdengo ex | Double Rare (RR) |  | Pokémon ex |
| 132/208 | Dreepy | Common (C) |  | Pokémon |
| 133/208 | Drakloak | Common (C) |  | Pokémon |
| 134/208 | Dragapult ex | Double Rare (RR) |  | Pokémon ex |
| 135/208 | Tatsugiri | Uncommon (U) |  | Pokémon |
| 136/208 | Koraidon | Rare (R) |  | Pokémon |
| 137/208 | Miraidon | Rare (R) |  | Pokémon |
| 138/208 | Raging Bolt ex | Double Rare (RR) |  | Pokémon ex |
| 139/208 | Eevee | Common (C) |  | Pokémon |
| 140/208 | Eevee ex | Double Rare (RR) |  | Pokémon ex |
| 141/208 | Hoothoot | Common (C) |  | Pokémon |
| 142/208 | Noctowl | Rare (R) |  | Pokémon |
| 143/208 | Dunsparce | Common (C) |  | Pokémon |
| 144/208 | Dudunsparce | Rare (R) |  | Pokémon |
| 145/208 | Miltank | Rare (R) |  | Pokémon |
| 146/208 | Buneary | Common (C) |  | Pokémon |
| 147/208 | Lopunny | Common (C) |  | Pokémon |
| 148/208 | Fan Rotom | Common (C) |  | Pokémon |
| 149/208 | Regigigas | Uncommon (U) |  | Pokémon |
| 150/208 | Shaymin | Common (C) |  | Pokémon |
| 151/208 | Bouffalant | Uncommon (U) |  | Pokémon |
| 152/208 | Furfrou | Common (C) |  | Pokémon |
| 153/208 | Hawlucha | Common (C) |  | Pokémon |
| 154/208 | Bloodmoon Ursaluna ex | Double Rare (RR) |  | Pokémon ex |
| 155/208 | Iron Jugulis | Rare (R) |  | Pokémon |
| 156/208 | Terapagos ex | Double Rare (RR) |  | Pokémon ex |
| 157/208 | Ogre's Mask | Uncommon (U) |  | Item |
| 158/208 | Enhanced Hammer | Uncommon (U) |  | Item |
| 159/208 | Counter Catcher | Uncommon (U) |  | Item |
| 160/208 | Glass Trumpet | Uncommon (U) |  | Item |
| 161/208 | Superior Energy Retrieval | Uncommon (U) |  | Item |
| 162/208 | Earthen Vessel | Uncommon (U) |  | Item |
| 163/208 | Max Rod | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 164/208 | Techno Radar | Uncommon (U) |  | Item |
| 165/208 | Tera Orb | Uncommon (U) |  | Item |
| 166/208 | Treasure Tracker | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 167/208 | Buddy-Buddy Poffin | Uncommon (U) |  | Item |
| 168/208 | Prime Catcher | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 169/208 | Scoop Up Cyclone | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 170/208 | Bug Catching Set | Uncommon (U) |  | Item |
| 171/208 | Night Stretcher | Uncommon (U) |  | Item |
| 172/208 | Sparkling Crystal | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 173/208 | Rescue Board | Uncommon (U) |  | Pokémon Tool |
| 174/208 | Binding Mochi | Uncommon (U) |  | Pokémon Tool |
| 175/208 | Luxurious Cape | Uncommon (U) |  | Pokémon Tool |
| 176/208 | Haban Berry | Uncommon (U) |  | Pokémon Tool |
| 177/208 | Ancient Booster Energy Capsule | Uncommon (U) |  | Pokémon Tool |
| 178/208 | Future Booster Energy Capsule | Uncommon (U) |  | Pokémon Tool |
| 179/208 | Maximum Belt | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 180/208 | Technical Machine: Evolution | Uncommon (U) |  | Pokémon Tool |
| 181/208 | Technical Machine: Devolution | Uncommon (U) |  | Pokémon Tool |
| 182/208 | Larry's Skill | Uncommon (U) |  | Supporter |
| 183/208 | Crispin | Uncommon (U) |  | Supporter |
| 184/208 | Colress's Tenacity | Uncommon (U) |  | Supporter |
| 185/208 | Ciphermaniac's Codebreaking | Uncommon (U) |  | Supporter |
| 186/208 | Janine's Secret Art | Uncommon (U) |  | Supporter |
| 187/208 | Professor Sada's Vitality | Uncommon (U) |  | Supporter |
| 188/208 | Black Belt's Training | Rare (R) |  | Supporter |
| 189/208 | Lana's Aid | Uncommon (U) |  | Supporter |
| 190/208 | Kieran | Uncommon (U) |  | Supporter |
| 191/208 | Carmine | Uncommon (U) |  | Supporter |
| 192/208 | Lacey | Uncommon (U) |  | Supporter |
| 193/208 | Explorer's Guidance | Uncommon (U) |  | Supporter |
| 194/208 | Amarys | Uncommon (U) |  | Supporter |
| 195/208 | Friends in Paldea | Uncommon (U) |  | Supporter |
| 196/208 | Professor Turo's Scenario | Uncommon (U) |  | Supporter |
| 197/208 | Briar | Uncommon (U) |  | Supporter |
| 198/208 | Bianca's Devotion | Uncommon (U) |  | Supporter |
| 199/208 | Morty's Conviction | Uncommon (U) |  | Supporter |
| 200/208 | Mela | Uncommon (U) |  | Supporter |
| 201/208 | Festival Grounds | Uncommon (U) |  | Stadium |
| 202/208 | Jamming Tower | Uncommon (U) |  | Stadium |
| 203/208 | Area Zero Underdepths | Uncommon (U) |  | Stadium |
| 204/208 | Moonlit Hill | Uncommon (U) |  | Stadium |
| 205/208 | Neutralization Zone | ACE SPEC Rare (ACE) |  | Stadium, ACE SPEC |
| 206/208 | Jet Energy | Uncommon (U) |  | Special Energy |
| 207/208 | Mist Energy | Uncommon (U) |  | Special Energy |
| 208/208 | Legacy Energy | ACE SPEC Rare (ACE) |  | Special Energy, ACE SPEC |
| 209/208 | Larry's Skill | Super Rare (SR) | Larry's Skill 182/208 | full art, Supporter |
| 210/208 | Ortega | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 211/208 | Brassius | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 212/208 | Atticus | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 213/208 | Atticus | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 214/208 | Tyme | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 215/208 | Amarys | Super Rare (SR) | Amarys 194/208 | full art, Supporter |
| 216/208 | Friends in Paldea | Super Rare (SR) | Friends in Paldea 195/208 | full art, Supporter |
| 217/208 | Giacomo | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 218/208 | Eri | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 219/208 | Mela | Super Rare (SR) | Mela 200/208 | full art, Supporter |
| 220/208 | Raifort | Super Rare (SR) | *(no main-set card)* | full art, Supporter |
| 221/208 | Leafeon ex | Special Art Rare (SAR) | Leafeon ex 006/208 | special art, Pokémon (chart: SAR Pokémon) |
| 222/208 | Teal Mask Ogerpon ex | Special Art Rare (SAR) | Teal Mask Ogerpon ex 021/208 | special art, Pokémon (chart: SAR Pokémon) |
| 223/208 | Flareon ex | Special Art Rare (SAR) | Flareon ex 023/208 | special art, Pokémon (chart: SAR Pokémon) |
| 224/208 | Ceruledge ex | Special Art Rare (SAR) | *(no main-set card)* | special art, Pokémon (chart: SAR Pokémon) |
| 225/208 | Hearthflame Mask Ogerpon ex | Special Art Rare (SAR) | Hearthflame Mask Ogerpon ex 029/208 | special art, Pokémon (chart: SAR Pokémon) |
| 226/208 | Vaporeon ex | Special Art Rare (SAR) | Vaporeon ex 036/208 | special art, Pokémon (chart: SAR Pokémon) |
| 227/208 | Glaceon ex | Special Art Rare (SAR) | Glaceon ex 047/208 | special art, Pokémon (chart: SAR Pokémon) |
| 228/208 | Palafin ex | Special Art Rare (SAR) | Palafin ex 052/208 | special art, Pokémon (chart: SAR Pokémon) |
| 229/208 | Wellspring Mask Ogerpon ex | Special Art Rare (SAR) | Wellspring Mask Ogerpon ex 056/208 | special art, Pokémon (chart: SAR Pokémon) |
| 230/208 | Jolteon ex | Special Art Rare (SAR) | Jolteon ex 058/208 | special art, Pokémon (chart: SAR Pokémon) |
| 231/208 | Iron Hands ex | Special Art Rare (SAR) | Iron Hands ex 060/208 | special art, Pokémon (chart: SAR Pokémon) |
| 232/208 | Espeon ex | Special Art Rare (SAR) | Espeon ex 068/208 | special art, Pokémon (chart: SAR Pokémon) |
| 233/208 | Sylveon ex | Special Art Rare (SAR) | Sylveon ex 076/208 | special art, Pokémon (chart: SAR Pokémon) |
| 234/208 | Sylveon ex | Special Art Rare (SAR) | Sylveon ex 076/208 | special art, Pokémon (chart: SAR Pokémon), **Chinese exclusive (Chen)** |
| 235/208 | Iron Valiant ex | Special Art Rare (SAR) | Iron Valiant ex 081/208 | special art, Pokémon (chart: SAR Pokémon) |
| 236/208 | Iron Crown ex | Special Art Rare (SAR) | Iron Crown ex 085/208 | special art, Pokémon (chart: SAR Pokémon) |
| 237/208 | Sandy Shocks ex | Special Art Rare (SAR) | Sandy Shocks ex 099/208 | special art, Pokémon (chart: SAR Pokémon) |
| 238/208 | Cornerstone Mask Ogerpon ex | Special Art Rare (SAR) | Cornerstone Mask Ogerpon ex 102/208 | special art, Pokémon (chart: SAR Pokémon) |
| 239/208 | Umbreon ex | Special Art Rare (SAR) | Umbreon ex 104/208 | special art, Pokémon (chart: SAR Pokémon) |
| 240/208 | Roaring Moon ex | Special Art Rare (SAR) | Roaring Moon ex 115/208 | special art, Pokémon (chart: SAR Pokémon) |
| 241/208 | Pecharunt ex | Special Art Rare (SAR) | Pecharunt ex 116/208 | special art, Pokémon (chart: SAR Pokémon) |
| 242/208 | Gholdengo ex | Special Art Rare (SAR) | Gholdengo ex 131/208 | special art, Pokémon (chart: SAR Pokémon) |
| 243/208 | Dragapult ex | Special Art Rare (SAR) | Dragapult ex 134/208 | special art, Pokémon (chart: SAR Pokémon) |
| 244/208 | Raging Bolt ex | Special Art Rare (SAR) | Raging Bolt ex 138/208 | special art, Pokémon (chart: SAR Pokémon) |
| 245/208 | Eevee ex | Special Art Rare (SAR) | Eevee ex 140/208 | special art, Pokémon (chart: SAR Pokémon) |
| 246/208 | Eevee ex | Special Art Rare (SAR) | Eevee ex 140/208 | special art, Pokémon (chart: SAR Pokémon) |
| 247/208 | Bloodmoon Ursaluna ex | Special Art Rare (SAR) | Bloodmoon Ursaluna ex 154/208 | special art, Pokémon (chart: SAR Pokémon) |
| 248/208 | Terapagos ex | Special Art Rare (SAR) | Terapagos ex 156/208 | special art, Pokémon (chart: SAR Pokémon) |
| 249/208 | Crispin | Special Art Rare (SAR) | Crispin 183/208 | special art, Supporter (chart: SAR Trainer) |
| 250/208 | Janine's Secret Art | Special Art Rare (SAR) | Janine's Secret Art 186/208 | special art, Supporter (chart: SAR Trainer) |
| 251/208 | Drayton | Special Art Rare (SAR) | *(no main-set card)* | special art, Supporter (chart: SAR Trainer) |
| 252/208 | Kieran | Special Art Rare (SAR) | Kieran 190/208 | special art, Supporter (chart: SAR Trainer) |
| 253/208 | Lacey | Special Art Rare (SAR) | Lacey 192/208 | special art, Supporter (chart: SAR Trainer) |
| 254/208 | Amarys | Special Art Rare (SAR) | Amarys 194/208 | special art, Supporter (chart: SAR Trainer) |
| 255/208 | Iron Leaves ex | Ultra Rare (UR) | Iron Leaves ex 018/208 | gold |
| 256/208 | Teal Mask Ogerpon ex | Ultra Rare (UR) | Teal Mask Ogerpon ex 021/208 | gold |
| 257/208 | Walking Wake ex | Ultra Rare (UR) | Walking Wake ex 055/208 | gold |
| 258/208 | Pikachu ex | Ultra Rare (UR) | *(no main-set card)* | gold |
| 259/208 | Terapagos ex | Ultra Rare (UR) | Terapagos ex 156/208 | gold |
