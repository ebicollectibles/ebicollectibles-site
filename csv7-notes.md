# CSV7 Blade Awakening: sourcing notes

Source: https://www.chencards.com/sets/blade_awakening (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Blade Awakening** (利刃猛醒).
- Official set code: **CSV7C**. Files: `src/data/csv7.json`, `csv7-images/`, branch `csv7-data`, `slug: "csv7"`. The image placeholders use the set name: `Chinese/Blade Awakening/Cards/NNNN.webp`.
- Series / era: **Chinese Scarlet & Violet Series**, a main numbered expansion. It's an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2026-01-16**
- **259 cards**: `001/204`–`204/204` main set + `205/204`–`259/204` secret rares (printed total **204**)
- **Official odds chart** linked by Chen (https://www.pokemon.cn/tcg/product/19812.html): **5 cards per pack, 4 non-holo (C/U) + 1 holo.**
- **One numbering system. Every card has a rarity and an image on Chen.**

## Rarity tiers, most common to rarest

The official chart ranks these kinds of card. Chen's card list covers all of them **except the two Ball-pattern parallels**:

| Rank | Chart tier | Chen's exact string | Kinds (chart) | Cards here | Production band (chart) |
|---|---|---|---|---|---|
| 1 | Common | Common (C) | 90 | 90 | 80.00% (C + U (4 non-holo slots)) |
| 2 | Uncommon | Uncommon (U) | 63 | 63 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | 173 | 0 | 13.82% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | 20 | 20 | ↑ |
| 5 | Double Rare | Double Rare (RR) | 22 | 22 | 5.45% (RR + AR + ACE + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | 6 | 6 | ↑ |
| 7 | ACE SPEC Rare | ACE SPEC Rare (ACE) | 9 | 9 | ↑ |
| 8 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | 173 | 0 | ↑ |
| 9 | Super Rare | Super Rare (SR) | 26 | 26 | 0.73% (SR + SAR + UR) |
| 10 | Special Art Rare | Special Art Rare (SAR) | 14 | 14 | ↑ |
| 11 | Ultra Rare | Ultra Rare (UR) | 9 | 9 | ↑ |
| | **Total** | | 605 | **259** | 100% |

- **Poké Ball and Master Ball pattern parallels (173 each).** The chart footnote says they cover every C, U and R card, with the same content and a different holo finish. They're real, separately collected cards with the same collector numbers, but Chen has **no entries or images** for them and **they aren't in the JSON**. If the page wants them, add a per-card finish.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.
- **ACE SPEC Rare (ACE)** cards sit **inside the main set** at their natural Trainer and Energy numbers (pink frame header), not in the secret block: 176 Awakening Drum, 178 Hyper Aroma, 180 Prime Catcher, 181 Master Ball, 183 Reboot Pod, 186 Survival Brace, 187 Hero's Cape, 189 Maximum Belt, 203 Neo Upper Energy.

`rarityOrder` = ["Common (C)", "Uncommon (U)", "Rare (R)", "Double Rare (RR)", "Art Rare (AR)", "ACE SPEC Rare (ACE)", "Super Rare (SR)", "Special Art Rare (SAR)", "Ultra Rare (UR)"]

| Tier | Main set (001–204) | Secret (205–259) |
|---|---|---|
| Common (C) | 90 | 0 |
| Uncommon (U) | 63 | 0 |
| Rare (R) | 20 | 0 |
| Double Rare (RR) | 22 | 0 |
| Art Rare (AR) | 0 | 6 |
| ACE SPEC Rare (ACE) | 9 | 0 |
| Super Rare (SR) | 0 | 26 |
| Special Art Rare (SAR) | 0 | 14 |
| Ultra Rare (UR) | 0 | 9 |

### Rarity corrections to Chen's data

Chen's Common/Uncommon split (**86 C / 67 U**) didn't match the official chart (**90 C / 63 U**). I read the rarity letter printed after the collector number on every Uncommon card, and these are labelled wrong on Chen:

| No. | Card | Chen says | Printed on card | Used in JSON |
|---|---|---|---|---|
| 107/204 | Scream Tail | Uncommon (U) | C | Common (C) |
| 130/204 | Great Tusk | Uncommon (U) | C | Common (C) |
| 132/204 | Sandy Shocks | Uncommon (U) | C | Common (C) |
| 173/204 | Iron Jugulis | Uncommon (U) | C | Common (C) |

With these 4 fixed, the JSON's counts match the chart exactly (90 C / 63 U). Everything else on Chen matched the chart. Worth telling Chen so they can fix their page.

## Structure: a flat officially-numbered catalog, like Black Bolt, White Flare, CSV9.5 and CSV10

**Not a Gem-style ladder.** Every card has one collector number `NNN/204`; rarer versions sit at unrelated numbers in the secret block and match only **by name**.

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–173 | Pokémon, grouped by type | 173 | C 90, U 41, R 20, RR 22 (22 ex) |
| 174–183 | Items | 10 | U 5, ACE 5 |
| 184–190 | Pokémon Tools | 7 | U 4, ACE 3 |
| 191–199 | Supporters | 9 | U 9 |
| 200–202 | Stadiums | 3 | U 3 |
| 203–204 | Special Energy | 2 | U 1, ACE 1 |
| 205–210 | Art Rares of main-set Pokémon | 6 | AR |
| 211–236 | Super Rare full arts (ex + Supporters) | 26 | SR |
| 237–250 | Special Art Rares (ex + Supporters) | 14 | SAR |
| 251–259 | Ultra Rare gold (ex + Trainers/Energy) | 9 | UR |

Card types were read from each Trainer/Energy card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. No basic Energy and no catalog block, so no `catalogGroups`.

### Irregularities to handle

- **Secret rares with no main-set card (1):** 257/204 Earthen Vessel (Ultra Rare (UR)). These are gold UR Trainer/Energy reprints, so an "other versions" lookup by name finds nothing for them.
- **Same name twice in the main set, as different cards:** Great Tusk (130 C, 131 U). Keep them distinct when matching versions by name.
- **Main-set ex with no secret version:** 038 Blaziken ex, 060 Kyogre ex, 085 Tapu Koko ex, 137 Tyranitar ex, 163 Lugia ex.
- **Names with "'s ":** 0 Pokémon and 6 Trainer cards (e.g. Hero's Cape, Ciphermaniac's Codebreaking, Lana's Aid, Explorer's Guidance). Display them whole; the Gem engine's owner/mon split on "'s " doesn't fit Trainer names.
- **Image sizes:** 300×418 and 300×419 only; nothing oversized.
- No null rarities, no missing images, no split cards, one numbering system.

### Will the existing Gem Set engine render it as-is? **No.**

Same reason as Black Bolt, White Flare, CSV9.5 and CSV10: `buildGemSetData` takes `id = number.slice(0, 4)`, so `"001/204"` gives id `"001/"` and cards are grouped by their first two digits; the ladder rows, labels and odds table assume the Gem shape. It needs the **flat-catalog page** that CSV10 already uses on main.

### JSON mapping

Same top-level and card fields as `csv10.json`. `number` is Chen's `NNN/204`; `pokemonIndex` is the collector number; `version` is 1; `rarity` is Chen's exact string, **except the 4 corrections above**; `image` is `Chinese/Blade Awakening/Cards/NNNN.webp` (matching `csv7-images/cards/`). No `catalogGroups`.

## Chinese-exclusive card

- **245/204**: Ciphermaniac's Codebreaking (Supporter), Special Art Rare.

Chen gives no extra note for it.

## Suggested hero theme colors

The logo "利刃猛醒" is a gold-to-orange blade gradient (`#FED088` → `#D06939`) with a near-black outline.

- **Primary, blade orange `#D06939`:** chips, glow and rules (fills; use `#4C2020` for text).
- **Secondary, near-black `#0D0D12`:** hero background, matching the logo outline.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **242/204 Greninja ex SAR** | Greninja ex SAR, the set's most popular chase |
| inner left | **244/204 Raging Bolt ex SAR** | Raging Bolt ex SAR |
| inner right | **239/204 Walking Wake ex SAR** | Walking Wake ex SAR |
| outer left | **250/204 Morty's Conviction SAR** | Morty's Conviction SAR, with Gengar |
| outer right | **245/204 Ciphermaniac's Codebreaking SAR** | Ciphermaniac's Codebreaking SAR, the Chinese exclusive |

Alternatives: 238 Gouging Fire ex SAR, 241 Iron Crown ex SAR, 240 Dachsbun ex SAR or any of the gold URs 251–256.

## Files

- `src/data/csv7.json`: 259 cards, schema as above.
- `csv7-images/cards/0001.webp`–`0259.webp`: all 259 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/204 | Tangela | Common (C) |  | Pokémon |
| 002/204 | Tangrowth | Common (C) |  | Pokémon |
| 003/204 | Scyther | Common (C) |  | Pokémon |
| 004/204 | Pinsir | Common (C) |  | Pokémon |
| 005/204 | Spinarak | Common (C) |  | Pokémon |
| 006/204 | Ariados | Uncommon (U) |  | Pokémon |
| 007/204 | Sunkern | Common (C) |  | Pokémon |
| 008/204 | Sunflora | Uncommon (U) |  | Pokémon |
| 009/204 | Heracross | Uncommon (U) |  | Pokémon |
| 010/204 | Seedot | Common (C) |  | Pokémon |
| 011/204 | Nuzleaf | Common (C) |  | Pokémon |
| 012/204 | Shiftry | Uncommon (U) |  | Pokémon |
| 013/204 | Shroomish | Common (C) |  | Pokémon |
| 014/204 | Breloom | Common (C) |  | Pokémon |
| 015/204 | Roselia | Common (C) |  | Pokémon |
| 016/204 | Roserade | Uncommon (U) |  | Pokémon |
| 017/204 | Turtwig | Common (C) |  | Pokémon |
| 018/204 | Grotle | Common (C) |  | Pokémon |
| 019/204 | Torterra ex | Double Rare (RR) |  | Pokémon ex |
| 020/204 | Leafeon | Uncommon (U) |  | Pokémon |
| 021/204 | Shaymin | Uncommon (U) |  | Pokémon |
| 022/204 | Cottonee | Common (C) |  | Pokémon |
| 023/204 | Whimsicott | Rare (R) |  | Pokémon |
| 024/204 | Deerling | Common (C) |  | Pokémon |
| 025/204 | Sawsbuck | Uncommon (U) |  | Pokémon |
| 026/204 | Grubbin | Common (C) |  | Pokémon |
| 027/204 | Dhelmise | Uncommon (U) |  | Pokémon |
| 028/204 | Bramblin | Common (C) |  | Pokémon |
| 029/204 | Brambleghast | Rare (R) |  | Pokémon |
| 030/204 | Rellor | Common (C) |  | Pokémon |
| 031/204 | Rabsca | Uncommon (U) |  | Pokémon |
| 032/204 | Iron Leaves | Rare (R) |  | Pokémon |
| 033/204 | Iron Leaves ex | Double Rare (RR) |  | Pokémon ex |
| 034/204 | Slugma | Common (C) |  | Pokémon |
| 035/204 | Magcargo ex | Double Rare (RR) |  | Pokémon ex |
| 036/204 | Torchic | Common (C) |  | Pokémon |
| 037/204 | Combusken | Common (C) |  | Pokémon |
| 038/204 | Blaziken ex | Double Rare (RR) |  | Pokémon ex |
| 039/204 | Torkoal | Common (C) |  | Pokémon |
| 040/204 | Chimchar | Common (C) |  | Pokémon |
| 041/204 | Monferno | Common (C) |  | Pokémon |
| 042/204 | Infernape | Rare (R) |  | Pokémon |
| 043/204 | Victini | Common (C) |  | Pokémon |
| 044/204 | Heatmor | Common (C) |  | Pokémon |
| 045/204 | Litten | Common (C) |  | Pokémon |
| 046/204 | Torracat | Common (C) |  | Pokémon |
| 047/204 | Incineroar ex | Double Rare (RR) |  | Pokémon ex |
| 048/204 | Sizzlipede | Common (C) |  | Pokémon |
| 049/204 | Centiskorch | Uncommon (U) |  | Pokémon |
| 050/204 | Chi-Yu | Uncommon (U) |  | Pokémon |
| 051/204 | Gouging Fire ex | Double Rare (RR) |  | Pokémon ex |
| 052/204 | Totodile | Common (C) |  | Pokémon |
| 053/204 | Croconaw | Common (C) |  | Pokémon |
| 054/204 | Feraligatr | Rare (R) |  | Pokémon |
| 055/204 | Carvanha | Common (C) |  | Pokémon |
| 056/204 | Sharpedo | Uncommon (U) |  | Pokémon |
| 057/204 | Snorunt | Common (C) |  | Pokémon |
| 058/204 | Glalie | Uncommon (U) |  | Pokémon |
| 059/204 | Froslass | Rare (R) |  | Pokémon |
| 060/204 | Kyogre ex | Double Rare (RR) |  | Pokémon ex |
| 061/204 | Glaceon | Uncommon (U) |  | Pokémon |
| 062/204 | Phione | Common (C) |  | Pokémon |
| 063/204 | Keldeo | Uncommon (U) |  | Pokémon |
| 064/204 | Froakie | Common (C) |  | Pokémon |
| 065/204 | Frogadier | Common (C) |  | Pokémon |
| 066/204 | Cramorant | Uncommon (U) |  | Pokémon |
| 067/204 | Snom | Common (C) |  | Pokémon |
| 068/204 | Frosmoth | Common (C) |  | Pokémon |
| 069/204 | Wiglett | Common (C) |  | Pokémon |
| 070/204 | Finizen | Common (C) |  | Pokémon |
| 071/204 | Palafin | Uncommon (U) |  | Pokémon |
| 072/204 | Iron Bundle | Uncommon (U) |  | Pokémon |
| 073/204 | Walking Wake | Rare (R) |  | Pokémon |
| 074/204 | Walking Wake ex | Double Rare (RR) |  | Pokémon ex |
| 075/204 | Electabuzz | Common (C) |  | Pokémon |
| 076/204 | Electivire | Uncommon (U) |  | Pokémon |
| 077/204 | Zapdos | Rare (R) |  | Pokémon |
| 078/204 | Shinx | Common (C) |  | Pokémon |
| 079/204 | Luxio | Common (C) |  | Pokémon |
| 080/204 | Luxray ex | Double Rare (RR) |  | Pokémon ex |
| 081/204 | Helioptile | Common (C) |  | Pokémon |
| 082/204 | Heliolisk | Common (C) |  | Pokémon |
| 083/204 | Charjabug | Common (C) |  | Pokémon |
| 084/204 | Vikavolt | Uncommon (U) |  | Pokémon |
| 085/204 | Tapu Koko ex | Double Rare (RR) |  | Pokémon ex |
| 086/204 | Zeraora | Uncommon (U) |  | Pokémon |
| 087/204 | Morpeko | Uncommon (U) |  | Pokémon |
| 088/204 | Wugtrio ex | Double Rare (RR) |  | Pokémon ex |
| 089/204 | Iron Hands | Common (C) |  | Pokémon |
| 090/204 | Iron Thorns | Rare (R) |  | Pokémon |
| 091/204 | Iron Thorns ex | Double Rare (RR) |  | Pokémon ex |
| 092/204 | Mr. Mime | Common (C) |  | Pokémon |
| 093/204 | Girafarig | Common (C) |  | Pokémon |
| 094/204 | Bronzor | Common (C) |  | Pokémon |
| 095/204 | Bronzong | Uncommon (U) |  | Pokémon |
| 096/204 | Solosis | Common (C) |  | Pokémon |
| 097/204 | Duosion | Common (C) |  | Pokémon |
| 098/204 | Reuniclus | Uncommon (U) |  | Pokémon |
| 099/204 | Flabébé | Common (C) |  | Pokémon |
| 100/204 | Floette | Common (C) |  | Pokémon |
| 101/204 | Florges | Uncommon (U) |  | Pokémon |
| 102/204 | Cutiefly | Common (C) |  | Pokémon |
| 103/204 | Ribombee | Uncommon (U) |  | Pokémon |
| 104/204 | Enamorus | Rare (R) |  | Pokémon |
| 105/204 | Fidough | Common (C) |  | Pokémon |
| 106/204 | Dachsbun ex | Double Rare (RR) |  | Pokémon ex |
| 107/204 | Scream Tail | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 108/204 | Scream Tail ex | Double Rare (RR) |  | Pokémon ex |
| 109/204 | Flutter Mane | Rare (R) |  | Pokémon |
| 110/204 | Iron Valiant | Rare (R) |  | Pokémon |
| 111/204 | Iron Crown ex | Double Rare (RR) |  | Pokémon ex |
| 112/204 | Larvitar | Common (C) |  | Pokémon |
| 113/204 | Pupitar | Common (C) |  | Pokémon |
| 114/204 | Nosepass | Common (C) |  | Pokémon |
| 115/204 | Probopass | Uncommon (U) |  | Pokémon |
| 116/204 | Meditite | Common (C) |  | Pokémon |
| 117/204 | Medicham | Common (C) |  | Pokémon |
| 118/204 | Relicanth | Rare (R) |  | Pokémon |
| 119/204 | Drilbur | Common (C) |  | Pokémon |
| 120/204 | Excadrill | Uncommon (U) |  | Pokémon |
| 121/204 | Golett | Common (C) |  | Pokémon |
| 122/204 | Golurk | Uncommon (U) |  | Pokémon |
| 123/204 | Greninja ex | Double Rare (RR) |  | Pokémon ex |
| 124/204 | Hawlucha | Common (C) |  | Pokémon |
| 125/204 | Mudbray | Common (C) |  | Pokémon |
| 126/204 | Mudsdale | Uncommon (U) |  | Pokémon |
| 127/204 | Rolycoly | Common (C) |  | Pokémon |
| 128/204 | Carkol | Common (C) |  | Pokémon |
| 129/204 | Coalossal | Uncommon (U) |  | Pokémon |
| 130/204 | Great Tusk | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 131/204 | Great Tusk | Uncommon (U) |  | Pokémon |
| 132/204 | Sandy Shocks | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 133/204 | Ting-Lu | Rare (R) |  | Pokémon |
| 134/204 | Iron Boulder ex | Double Rare (RR) |  | Pokémon ex |
| 135/204 | Ekans | Common (C) |  | Pokémon |
| 136/204 | Arbok | Common (C) |  | Pokémon |
| 137/204 | Tyranitar ex | Double Rare (RR) |  | Pokémon ex |
| 138/204 | Poochyena | Common (C) |  | Pokémon |
| 139/204 | Mightyena | Common (C) |  | Pokémon |
| 140/204 | Sableye | Uncommon (U) |  | Pokémon |
| 141/204 | Farigiraf ex | Double Rare (RR) |  | Pokémon ex |
| 142/204 | Brute Bonnet | Uncommon (U) |  | Pokémon |
| 143/204 | Roaring Moon | Rare (R) |  | Pokémon |
| 144/204 | Scizor ex | Double Rare (RR) |  | Pokémon ex |
| 145/204 | Mawile | Common (C) |  | Pokémon |
| 146/204 | Beldum | Common (C) |  | Pokémon |
| 147/204 | Metang | Common (C) |  | Pokémon |
| 148/204 | Metagross | Uncommon (U) |  | Pokémon |
| 149/204 | Meltan | Common (C) |  | Pokémon |
| 150/204 | Melmetal | Rare (R) |  | Pokémon |
| 151/204 | Iron Treads | Uncommon (U) |  | Pokémon |
| 152/204 | Koraidon | Rare (R) |  | Pokémon |
| 153/204 | Miraidon | Rare (R) |  | Pokémon |
| 154/204 | Raging Bolt ex | Double Rare (RR) |  | Pokémon ex |
| 155/204 | Lickitung | Common (C) |  | Pokémon |
| 156/204 | Lickilicky | Common (C) |  | Pokémon |
| 157/204 | Eevee | Common (C) |  | Pokémon |
| 158/204 | Snorlax | Uncommon (U) |  | Pokémon |
| 159/204 | Hoothoot | Common (C) |  | Pokémon |
| 160/204 | Noctowl | Common (C) |  | Pokémon |
| 161/204 | Dunsparce | Common (C) |  | Pokémon |
| 162/204 | Dudunsparce | Rare (R) |  | Pokémon |
| 163/204 | Lugia ex | Double Rare (RR) |  | Pokémon ex |
| 164/204 | Skitty | Common (C) |  | Pokémon |
| 165/204 | Delcatty | Uncommon (U) |  | Pokémon |
| 166/204 | Chatot | Common (C) |  | Pokémon |
| 167/204 | Pidove | Common (C) |  | Pokémon |
| 168/204 | Tranquill | Common (C) |  | Pokémon |
| 169/204 | Unfezant | Uncommon (U) |  | Pokémon |
| 170/204 | Minccino | Common (C) |  | Pokémon |
| 171/204 | Cinccino | Uncommon (U) |  | Pokémon |
| 172/204 | Drampa | Rare (R) |  | Pokémon |
| 173/204 | Iron Jugulis | Common (C) |  | Pokémon, **rarity corrected** (Chen: Uncommon (U)) |
| 174/204 | Boxed Order | Uncommon (U) |  | Item |
| 175/204 | Enhanced Hammer | Uncommon (U) |  | Item |
| 176/204 | Awakening Drum | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 177/204 | Buddy-Buddy Poffin | Uncommon (U) |  | Item |
| 178/204 | Hyper Aroma | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 179/204 | Hand Trimmer | Uncommon (U) |  | Item |
| 180/204 | Prime Catcher | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 181/204 | Master Ball | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 182/204 | Love Ball | Uncommon (U) |  | Item |
| 183/204 | Reboot Pod | ACE SPEC Rare (ACE) |  | Item, ACE SPEC |
| 184/204 | Passho Berry | Uncommon (U) |  | Pokémon Tool |
| 185/204 | Rescue Board | Uncommon (U) |  | Pokémon Tool |
| 186/204 | Survival Brace | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 187/204 | Hero's Cape | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 188/204 | Heavy Baton | Uncommon (U) |  | Pokémon Tool |
| 189/204 | Maximum Belt | ACE SPEC Rare (ACE) |  | Pokémon Tool, ACE SPEC |
| 190/204 | Lucky Helmet | Uncommon (U) |  | Pokémon Tool |
| 191/204 | Ciphermaniac's Codebreaking | Uncommon (U) |  | Supporter |
| 192/204 | Lucian | Uncommon (U) |  | Supporter |
| 193/204 | Lana's Aid | Uncommon (U) |  | Supporter |
| 194/204 | Salvatore | Uncommon (U) |  | Supporter |
| 195/204 | Explorer's Guidance | Uncommon (U) |  | Supporter |
| 196/204 | Hassel | Uncommon (U) |  | Supporter |
| 197/204 | Eri | Uncommon (U) |  | Supporter |
| 198/204 | Bianca's Devotion | Uncommon (U) |  | Supporter |
| 199/204 | Morty's Conviction | Uncommon (U) |  | Supporter |
| 200/204 | Perilous Jungle | Uncommon (U) |  | Stadium |
| 201/204 | Gravity Mountain | Uncommon (U) |  | Stadium |
| 202/204 | Full Metal Lab | Uncommon (U) |  | Stadium |
| 203/204 | Neo Upper Energy | ACE SPEC Rare (ACE) |  | Special Energy, ACE SPEC |
| 204/204 | Mist Energy | Uncommon (U) |  | Special Energy |
| 205/204 | Shiftry | Art Rare (AR) | Shiftry 012/204 | Art Rare |
| 206/204 | Iron Thorns | Art Rare (AR) | Iron Thorns 090/204 | Art Rare |
| 207/204 | Bronzor | Art Rare (AR) | Bronzor 094/204 | Art Rare |
| 208/204 | Arbok | Art Rare (AR) | Arbok 136/204 | Art Rare |
| 209/204 | Metagross | Art Rare (AR) | Metagross 148/204 | Art Rare |
| 210/204 | Drampa | Art Rare (AR) | Drampa 172/204 | Art Rare |
| 211/204 | Torterra ex | Super Rare (SR) | Torterra ex 019/204 | full art |
| 212/204 | Iron Leaves ex | Super Rare (SR) | Iron Leaves ex 033/204 | full art |
| 213/204 | Magcargo ex | Super Rare (SR) | Magcargo ex 035/204 | full art |
| 214/204 | Incineroar ex | Super Rare (SR) | Incineroar ex 047/204 | full art |
| 215/204 | Gouging Fire ex | Super Rare (SR) | Gouging Fire ex 051/204 | full art |
| 216/204 | Walking Wake ex | Super Rare (SR) | Walking Wake ex 074/204 | full art |
| 217/204 | Luxray ex | Super Rare (SR) | Luxray ex 080/204 | full art |
| 218/204 | Wugtrio ex | Super Rare (SR) | Wugtrio ex 088/204 | full art |
| 219/204 | Iron Thorns ex | Super Rare (SR) | Iron Thorns ex 091/204 | full art |
| 220/204 | Dachsbun ex | Super Rare (SR) | Dachsbun ex 106/204 | full art |
| 221/204 | Scream Tail ex | Super Rare (SR) | Scream Tail ex 108/204 | full art |
| 222/204 | Iron Crown ex | Super Rare (SR) | Iron Crown ex 111/204 | full art |
| 223/204 | Greninja ex | Super Rare (SR) | Greninja ex 123/204 | full art |
| 224/204 | Iron Boulder ex | Super Rare (SR) | Iron Boulder ex 134/204 | full art |
| 225/204 | Farigiraf ex | Super Rare (SR) | Farigiraf ex 141/204 | full art |
| 226/204 | Scizor ex | Super Rare (SR) | Scizor ex 144/204 | full art |
| 227/204 | Raging Bolt ex | Super Rare (SR) | Raging Bolt ex 154/204 | full art |
| 228/204 | Ciphermaniac's Codebreaking | Super Rare (SR) | Ciphermaniac's Codebreaking 191/204 | full art, Supporter |
| 229/204 | Lucian | Super Rare (SR) | Lucian 192/204 | full art, Supporter |
| 230/204 | Lana's Aid | Super Rare (SR) | Lana's Aid 193/204 | full art, Supporter |
| 231/204 | Salvatore | Super Rare (SR) | Salvatore 194/204 | full art, Supporter |
| 232/204 | Explorer's Guidance | Super Rare (SR) | Explorer's Guidance 195/204 | full art, Supporter |
| 233/204 | Hassel | Super Rare (SR) | Hassel 196/204 | full art, Supporter |
| 234/204 | Eri | Super Rare (SR) | Eri 197/204 | full art, Supporter |
| 235/204 | Bianca's Devotion | Super Rare (SR) | Bianca's Devotion 198/204 | full art, Supporter |
| 236/204 | Morty's Conviction | Super Rare (SR) | Morty's Conviction 199/204 | full art, Supporter |
| 237/204 | Iron Leaves ex | Special Art Rare (SAR) | Iron Leaves ex 033/204 | special art |
| 238/204 | Gouging Fire ex | Special Art Rare (SAR) | Gouging Fire ex 051/204 | special art |
| 239/204 | Walking Wake ex | Special Art Rare (SAR) | Walking Wake ex 074/204 | special art |
| 240/204 | Dachsbun ex | Special Art Rare (SAR) | Dachsbun ex 106/204 | special art |
| 241/204 | Iron Crown ex | Special Art Rare (SAR) | Iron Crown ex 111/204 | special art |
| 242/204 | Greninja ex | Special Art Rare (SAR) | Greninja ex 123/204 | special art |
| 243/204 | Iron Boulder ex | Special Art Rare (SAR) | Iron Boulder ex 134/204 | special art |
| 244/204 | Raging Bolt ex | Special Art Rare (SAR) | Raging Bolt ex 154/204 | special art |
| 245/204 | Ciphermaniac's Codebreaking | Special Art Rare (SAR) | Ciphermaniac's Codebreaking 191/204 | special art, Supporter, **Chinese exclusive (Chen)** |
| 246/204 | Lana's Aid | Special Art Rare (SAR) | Lana's Aid 193/204 | special art, Supporter |
| 247/204 | Salvatore | Special Art Rare (SAR) | Salvatore 194/204 | special art, Supporter |
| 248/204 | Eri | Special Art Rare (SAR) | Eri 197/204 | special art, Supporter |
| 249/204 | Bianca's Devotion | Special Art Rare (SAR) | Bianca's Devotion 198/204 | special art, Supporter |
| 250/204 | Morty's Conviction | Special Art Rare (SAR) | Morty's Conviction 199/204 | special art, Supporter |
| 251/204 | Iron Leaves ex | Ultra Rare (UR) | Iron Leaves ex 033/204 | gold |
| 252/204 | Gouging Fire ex | Ultra Rare (UR) | Gouging Fire ex 051/204 | gold |
| 253/204 | Walking Wake ex | Ultra Rare (UR) | Walking Wake ex 074/204 | gold |
| 254/204 | Iron Crown ex | Ultra Rare (UR) | Iron Crown ex 111/204 | gold |
| 255/204 | Iron Boulder ex | Ultra Rare (UR) | Iron Boulder ex 134/204 | gold |
| 256/204 | Raging Bolt ex | Ultra Rare (UR) | Raging Bolt ex 154/204 | gold |
| 257/204 | Earthen Vessel | Ultra Rare (UR) | *(no main-set card)* | gold |
| 258/204 | Buddy-Buddy Poffin | Ultra Rare (UR) | Buddy-Buddy Poffin 177/204 | gold, Item |
| 259/204 | Rescue Board | Ultra Rare (UR) | Rescue Board 185/204 | gold, Pokémon Tool |
