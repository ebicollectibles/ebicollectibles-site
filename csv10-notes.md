# CSV10 Chasing Glory: sourcing notes

Source: https://www.chencards.com/sets/chasing_glory (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name: **Chasing Glory** (共逐荣光). Chen's URL slug is `chasing_glory`, and its sets list shows it as CSV10C. I used `slug: "csv10"` and the file `src/data/csv10.json` as you asked; the placeholder image paths use the set name (`Chinese/Chasing Glory/Cards/`), the same convention as Black Bolt and White Flare.
- Official set code: **CSV10C**
- Series / era: **Chinese Scarlet & Violet Series**, the main numbered expansion **CSV10**. Black Bolt (CSV10.5C) and White Flare (CSV10.6C) are the ".5/.6" sets that follow it. It's an official Pokémon TCG expansion, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2026-07-16**
- **287 cards on Chen's page**: `001/222`–`222/222` main set + `223/222`–`287/222` secret rares (printed total **222**)
- **Official odds chart:** Chen links it (https://www.pokemon.cn/tcg/product/20012.html). It gives **5 cards per pack: 4 non-holo (C/U) + 1 holo.**
- **Single numbering system. Every card has a rarity and an image on Chen.** None of 30th Celebration's gaps apply.

## Rarity tiers, most common to rarest

The official chart ranks **ten** kinds of card. Chen's card list includes only **eight** of them. The other two are holo-pattern **parallel** versions of existing cards, which Chen doesn't list separately:

| Rank | Tier | Chen's exact string | Abbr. | Kinds (chart) | On Chen's list | Production ratio (chart, grouped) |
|---|---|---|---|---|---|---|
| 1 | Common | Common (C) | C | 98 | 98 | 80.00% (C + U, the 4 non-holo slots) |
| 2 | Uncommon | Uncommon (U) | U | 71 | 71 | ↑ |
| 3 | **Poké Ball pattern** holo (精灵球纹样) | *not on Chen* | none | 198 | 0 | 14.01% (Poké Ball pattern + R) |
| 4 | Rare | Rare (R) | R | 29 | 29 | ↑ |
| 5 | Double Rare | Double Rare (RR) | RR | 24 | 24 | 5.26% (RR + AR + Master Ball pattern) |
| 6 | Art Rare | Art Rare (AR) | AR | 6 | 6 | ↑ |
| 7 | **Master Ball pattern** holo (大师球纹样) | *not on Chen* | none | 198 | 0 | ↑ |
| 8 | Super Rare | Super Rare (SR) | SR | 33 | 33 | 0.73% (SR + SAR + UR) |
| 9 | Special Art Rare | Special Art Rare (SAR) | SAR | 18 | 18 | ↑ |
| 10 | Ultra Rare | Ultra Rare (UR) | UR | 8 | 8 | ↑ |
| | **Total** | | | 683 | **287** | 100% |

- **The two Ball-pattern parallels.** The chart's footnote: *"精灵球纹样闪卡和大师球纹样闪卡种类为C、U、R之和，内容相同，加工不同"*. The Poké Ball and Master Ball pattern holos each cover **every C, U and R card** (98 + 71 + 29 = 198), with the same card content but a different holo finish. They're real, separately collected cards (so **683 kinds in total**), but they have **no entries, numbers or images on Chen**, and **they aren't in `csv10.json`.** If the page wants them, add them as a version or finish attribute on each C/U/R card rather than as new numbers, since they print the same collector number. Getting images would need another source.
- `rarityOrder` lists the **8 tiers Chen uses**, in the chart's order with the two parallels left out: C < U < R < RR < AR < SR < SAR < UR. The chart confirms this ranking.
- Chen's tier strings include the abbreviation in parentheses, as in Black Bolt and White Flare. **Only 6 Art Rares**: much fewer than Black Bolt/White Flare's 72. The top tier here is **Ultra Rare (UR)**, the gold cards; there's no BWR or FUR.
- The production ratios are **grouped bands** of the 1 holo slot, not per-tier odds, so present them as bands.

| Tier | Main set (001–222) | Secret (223–287) |
|---|---|---|
| Common (C) | 98 | 0 |
| Uncommon (U) | 71 | 0 |
| Rare (R) | 29 | 0 |
| Double Rare (RR) | 24 | 0 |
| Art Rare (AR) | 0 | 6 |
| Super Rare (SR) | 0 | 33 |
| Special Art Rare (SAR) | 0 | 18 |
| Ultra Rare (UR) | 0 | 8 |

## Structure: a flat officially-numbered catalog, like Black Bolt and White Flare

**Not a Gem-style ladder.** Every card has one collector number `NNN/222`. Rarer versions of a card sit at unrelated numbers in the secret block and can only be matched **by exact name**, e.g. Team Rocket's Mewtwo ex is 085 (RR), 239 (SR), 268 (SAR) and 282 (UR).

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–188 | Pokémon, grouped by type, Pokédex order within type | 188 | C, U, R, RR (24 ex) |
| 189–199 | Items | 11 | U |
| 200–202 | Pokémon Tools | 3 | U |
| 203–213 | Supporters | 11 | U, except 204 Emcee's Hype (C) |
| 214–220 | Stadiums | 7 | U |
| 221–222 | Special Energy | 2 | U |
| 223–228 | Art Rares of 6 main-set Pokémon | 6 | AR |
| 229–250 | Super Rare full arts of the 22 ex | 22 | SR |
| 251–261 | Super Rare full arts of 11 Supporters | 11 | SR |
| 262–275 | Special Art Rares of 14 ex | 14 | SAR |
| 276–279 | Special Art Rares of 4 Supporters | 4 | SAR |
| 280–285 | Ultra Rare (gold) of 6 ex | 6 | UR |
| 286–287 | Ultra Rare (gold) Stadium Levincia + Special Energy Spiky Energy | 2 | UR |

Card types for 189–222 were read from each card's frame header (物品 Item, 宝可梦道具 Pokémon Tool, 支援者 Supporter, 竞技场 Stadium, 特殊能量 Special Energy). Chen has no card-type field. Unlike the Gem sets there's **no basic Energy and no interleaved catalog block**, so `catalogGroups` isn't used.

### Irregularities to handle

- **Trainer-owned Pokémon ("X's Pokémon") are everywhere:** 121 of the 188 Pokémon have an owner prefix. Team Rocket's 46, N's 11, Hop's 10, Ethan's 9, Cynthia's 8, Marnie's 8, Steven's 7, Misty's 6, Iono's 6, Arven's 6, Lillie's 4.
  - **Owned and plain versions are different cards**, so match versions by the **full name**, never the species alone. Pairs in this set: 043 Psyduck vs 045 Misty's Psyduck; 051 Articuno vs 052 Team Rocket's Articuno; 105 Larvitar vs 107 Team Rocket's Larvitar; 106 Pupitar vs 108 Team Rocket's Pupitar; 137 Tyranitar vs 109 Team Rocket's Tyranitar. Also two different owners of one species: 139 N's Purrloin vs 140 Marnie's Purrloin.
  - **The "'s " split also catches Trainer cards** (23 of them, e.g. "Team Rocket's Great Ball", "Iris's Fighting Spirit", "Lillie's Pearl"). The Gem engine's `owner`/`mon` split on "'s " would treat "Team Rocket's" as the owner of a Poké Ball; display those names whole.
- **Same card at several tiers** (all matched by exact name; every secret-rare name exists exactly once in 001–222):

| Card | Main | AR | SR | SAR | UR |
|---|---|---|---|---|---|
| Yanma | 002 C | 223 |  |  |  |
| Yanmega ex | 003 RR |  | 229 | 262 |  |
| Maractus | 008 U | 224 |  |  |  |
| Arboliva ex | 022 RR |  | 230 |  |  |
| Team Rocket's Moltres ex | 027 RR |  | 231 | 263 |  |
| Ethan's Ho-Oh ex | 035 RR |  | 232 | 264 | 280 |
| Volcanion ex | 042 RR |  | 233 | 265 |  |
| Misty's Psyduck | 045 U | 225 |  |  |  |
| Cetitan ex | 062 RR |  | 234 |  |  |
| Dondozo ex | 063 RR |  | 235 |  |  |
| Electivire ex | 067 RR |  | 236 |  |  |
| Rotom | 075 C | 226 |  |  |  |
| Iono's Bellibolt ex | 079 RR |  | 237 | 266 | 281 |
| Lillie's Clefairy ex | 082 RR |  | 238 | 267 |  |
| Team Rocket's Mewtwo ex | 085 RR |  | 239 | 268 | 282 |
| Mamoswine ex | 104 RR |  | 242 |  |  |
| Regirock ex | 110 RR |  | 240 |  |  |
| Cynthia's Garchomp ex | 113 RR |  | 241 | 269 | 283 |
| Team Rocket's Nidoking ex | 127 RR |  | 243 | 270 |  |
| Team Rocket's Crobat ex | 130 RR |  | 244 | 271 | 284 |
| N's Zoroark ex | 145 RR |  | 245 | 272 | 285 |
| Arven's Mabosstiff ex | 151 RR |  | 246 | 273 |  |
| Hop's Zacian ex | 161 RR |  | 247 | 274 |  |
| Zamazenta | 162 R | 227 |  |  |  |
| Salamence ex | 165 RR |  | 248 | 275 |  |
| N's Reshiram | 166 R | 228 |  |  |  |
| Team Rocket's Persian ex | 170 RR |  | 249 |  |  |
| Dudunsparce ex | 179 RR |  | 250 |  |  |
| Iris's Fighting Spirit | 203 U |  | 251 |  |  |
| Emcee's Hype | 204 C |  | 252 |  |  |
| Ruffian | 205 U |  | 253 |  |  |
| Judge | 206 U |  | 254 |  |  |
| Brock's Scouting | 207 U |  | 255 | 276 |  |
| Ethan's Adventure | 208 U |  | 256 | 277 |  |
| Team Rocket's Ariana | 209 U |  | 257 | 278 |  |
| Team Rocket's Archer | 210 U |  | 258 |  |  |
| Team Rocket's Giovanni | 211 U |  | 259 | 279 |  |
| Team Rocket's Petrel | 212 U |  | 260 |  |  |
| Team Rocket's Proton | 213 U |  | 261 |  |  |
| Levincia | 217 U |  |  |  | 286 |
| Spiky Energy | 221 U |  |  |  | 287 |

- **No split or paired cards, no missing images, no null rarities, one numbering system.**
- **Image sizes:** 169 at 300×418, 117 at 300×419, and **276 at 320×449**, the exclusive, the same quirk as the other sets' exclusives.

### Will the existing Gem Set engine render it as-is? **No.**

Same reasons as Black Bolt and White Flare: `buildGemSetData` takes `id = number.slice(0, 4)` and `groupId = id.slice(0, 2)`, so `"001/222"` gives id `"001/"`, and cards 001–009, 010–019, … collapse into groups by their first two digits. The per-Pokémon ladder rows, derived rarity-version labels and odds table all assume the Gem shape. It needs the same **flat-catalog page** as Black Bolt, White Flare and 30th Celebration (numbered checklist, rarity filter, "other versions" by exact name). It's the cleanest of the four to build that page on, because it has no nulls or extra numbering. If you also want the Poké Ball and Master Ball parallels, the page needs a per-card finish toggle.

### JSON mapping

Same top-level and card fields as `black-bolt.json`. `number` is Chen's `NNN/222`; `pokemonIndex` is the collector number (1–287); `version` is 1; `rarity` is Chen's exact string; `image` is `Chinese/Chasing Glory/Cards/NNNN.webp` (zero-padded `0001`–`0287`, matching the files in `csv10-images/cards/`). `series` is Chen's "Chinese Scarlet & Violet Series". No `catalogGroups`.

## Chinese-exclusive card

- Chen flags **one** card: **276/222 Brock's Scouting, Special Art Rare**: Brock sitting on a rock above a mountain valley. It's the first of the four Supporter SARs. Chen gives no extra note for it (unlike 30th Celebration's Ditto).

## Suggested hero theme colors

The logo "共逐荣光" is a **fiery gradient**, pale gold at the top (`#FFEB99`), through **blaze orange** (`#E8813D`), to **ember red** (`#AD311A`), with a near-black outline (`#1D1013`). The 8 gold Ultra Rares add metallic gold (`#DABD5E`).

- **Primary, blaze orange `#E8813D`:** accents, chips and the hero glow. It's too light for body text on white.
- **Secondary, ember-black `#1D1013`:** the hero background, matching the logo outline, with the orange-to-gold gradient over it.

If you'd rather have a light hero, use **ember red `#AD311A`** as the text-safe accent on white instead of the black. That gives Chasing Glory a warm "glory" identity distinct from Black Bolt (black and electric blue), White Flare (white and flame red: keep the reds apart, since this set's leans orange), 30th Celebration (gold and cocoa) and the magenta Gem sets.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **268/222 Team Rocket's Mewtwo ex SAR** | the set's headline Pokémon (Team Rocket is the main theme: 58 Team Rocket's cards in 001–222) |
| inner left | **264/222 Ethan's Ho-Oh ex SAR** | the other big legendary, a bright warm palette that suits the hero colors |
| inner right | **279/222 Team Rocket's Giovanni SAR** | the boss himself, the standout Supporter SAR |
| outer left | **269/222 Cynthia's Garchomp ex SAR** | a fan-favorite trainer and Pokémon pairing |
| outer right | **276/222 Brock's Scouting SAR** | the one Chinese-exclusive card |

Alternatives: the gold **282/222 Team Rocket's Mewtwo ex UR** (top tier) in place of the center card, 266 Iono's Bellibolt ex SAR, 272 N's Zoroark ex SAR or 278 Team Rocket's Ariana SAR.

## Files

- `src/data/csv10.json`: 287 cards, schema as above.
- `csv10-images/cards/0001.webp`–`0287.webp`: all 287 images. The odds chart and logo aren't included, since the chart is Pokémon's own image.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Type / note |
|---|---|---|---|---|
| 001/222 | Ethan's Pinsir | Uncommon (U) |  | Pokémon |
| 002/222 | Yanma | Common (C) |  | Pokémon |
| 003/222 | Yanmega ex | Double Rare (RR) |  | Pokémon ex |
| 004/222 | Cynthia's Roselia | Common (C) |  | Pokémon |
| 005/222 | Cynthia's Roserade | Rare (R) |  | Pokémon |
| 006/222 | Mow Rotom | Common (C) |  | Pokémon |
| 007/222 | Shaymin | Uncommon (U) |  | Pokémon |
| 008/222 | Maractus | Uncommon (U) |  | Pokémon |
| 009/222 | Dwebble | Common (C) |  | Pokémon |
| 010/222 | Crustle | Rare (R) |  | Pokémon |
| 011/222 | Team Rocket's Blipbug | Common (C) |  | Pokémon |
| 012/222 | Applin | Common (C) |  | Pokémon |
| 013/222 | Dipplin | Common (C) |  | Pokémon |
| 014/222 | Hydrapple | Rare (R) |  | Pokémon |
| 015/222 | Sprigatito | Common (C) |  | Pokémon |
| 016/222 | Floragato | Common (C) |  | Pokémon |
| 017/222 | Meowscarada | Rare (R) |  | Pokémon |
| 018/222 | Team Rocket's Tarountula | Common (C) |  | Pokémon |
| 019/222 | Team Rocket's Spidops | Rare (R) |  | Pokémon |
| 020/222 | Smoliv | Common (C) |  | Pokémon |
| 021/222 | Dolliv | Common (C) |  | Pokémon |
| 022/222 | Arboliva ex | Double Rare (RR) |  | Pokémon ex |
| 023/222 | Ponyta | Common (C) |  | Pokémon |
| 024/222 | Rapidash | Uncommon (U) |  | Pokémon |
| 025/222 | Magmar | Common (C) |  | Pokémon |
| 026/222 | Magmortar | Rare (R) |  | Pokémon |
| 027/222 | Team Rocket's Moltres ex | Double Rare (RR) |  | Pokémon ex |
| 028/222 | Ethan's Cyndaquil | Common (C) |  | Pokémon |
| 029/222 | Ethan's Quilava | Common (C) |  | Pokémon |
| 030/222 | Ethan's Typhlosion | Rare (R) |  | Pokémon |
| 031/222 | Ethan's Slugma | Common (C) |  | Pokémon |
| 032/222 | Ethan's Magcargo | Rare (R) |  | Pokémon |
| 033/222 | Team Rocket's Houndour | Common (C) |  | Pokémon |
| 034/222 | Team Rocket's Houndoom | Uncommon (U) |  | Pokémon |
| 035/222 | Ethan's Ho-Oh ex | Double Rare (RR) |  | Pokémon ex |
| 036/222 | Torchic | Common (C) |  | Pokémon |
| 037/222 | Combusken | Common (C) |  | Pokémon |
| 038/222 | Blaziken | Rare (R) |  | Pokémon |
| 039/222 | Heat Rotom | Common (C) |  | Pokémon |
| 040/222 | N's Darumaka | Common (C) |  | Pokémon |
| 041/222 | N's Darmanitan | Uncommon (U) |  | Pokémon |
| 042/222 | Volcanion ex | Double Rare (RR) |  | Pokémon ex |
| 043/222 | Psyduck | Common (C) |  | Pokémon |
| 044/222 | Golduck | Uncommon (U) |  | Pokémon |
| 045/222 | Misty's Psyduck | Uncommon (U) |  | Pokémon |
| 046/222 | Misty's Staryu | Common (C) |  | Pokémon |
| 047/222 | Misty's Starmie | Uncommon (U) |  | Pokémon |
| 048/222 | Misty's Magikarp | Common (C) |  | Pokémon |
| 049/222 | Misty's Gyarados | Rare (R) |  | Pokémon |
| 050/222 | Misty's Lapras | Common (C) |  | Pokémon |
| 051/222 | Articuno | Uncommon (U) |  | Pokémon |
| 052/222 | Team Rocket's Articuno | Rare (R) |  | Pokémon |
| 053/222 | Wailmer | Common (C) |  | Pokémon |
| 054/222 | Wailord | Rare (R) |  | Pokémon |
| 055/222 | Cynthia's Feebas | Common (C) |  | Pokémon |
| 056/222 | Cynthia's Milotic | Uncommon (U) |  | Pokémon |
| 057/222 | Clamperl | Common (C) |  | Pokémon |
| 058/222 | Huntail | Uncommon (U) |  | Pokémon |
| 059/222 | Gorebyss | Rare (R) |  | Pokémon |
| 060/222 | Wash Rotom | Common (C) |  | Pokémon |
| 061/222 | Cetoddle | Common (C) |  | Pokémon |
| 062/222 | Cetitan ex | Double Rare (RR) |  | Pokémon ex |
| 063/222 | Dondozo ex | Double Rare (RR) |  | Pokémon ex |
| 064/222 | Iono's Voltorb | Common (C) |  | Pokémon |
| 065/222 | Iono's Electrode | Uncommon (U) |  | Pokémon |
| 066/222 | Electabuzz | Common (C) |  | Pokémon |
| 067/222 | Electivire ex | Double Rare (RR) |  | Pokémon ex |
| 068/222 | Team Rocket's Zapdos | Rare (R) |  | Pokémon |
| 069/222 | Ethan's Pichu | Common (C) |  | Pokémon |
| 070/222 | Team Rocket's Mareep | Common (C) |  | Pokémon |
| 071/222 | Team Rocket's Flaaffy | Common (C) |  | Pokémon |
| 072/222 | Team Rocket's Ampharos | Uncommon (U) |  | Pokémon |
| 073/222 | Electrike | Common (C) |  | Pokémon |
| 074/222 | Manectric | Common (C) |  | Pokémon |
| 075/222 | Rotom | Common (C) |  | Pokémon |
| 076/222 | N's Joltik | Common (C) |  | Pokémon |
| 077/222 | Zeraora | Rare (R) |  | Pokémon |
| 078/222 | Iono's Tadbulb | Common (C) |  | Pokémon |
| 079/222 | Iono's Bellibolt ex | Double Rare (RR) |  | Pokémon ex |
| 080/222 | Iono's Wattrel | Common (C) |  | Pokémon |
| 081/222 | Iono's Kilowattrel | Rare (R) |  | Pokémon |
| 082/222 | Lillie's Clefairy ex | Double Rare (RR) |  | Pokémon ex |
| 083/222 | Team Rocket's Drowzee | Common (C) |  | Pokémon |
| 084/222 | Team Rocket's Hypno | Uncommon (U) |  | Pokémon |
| 085/222 | Team Rocket's Mewtwo ex | Double Rare (RR) |  | Pokémon ex |
| 086/222 | Team Rocket's Wobbuffet | Rare (R) |  | Pokémon |
| 087/222 | Steven's Baltoy | Common (C) |  | Pokémon |
| 088/222 | Steven's Claydol | Uncommon (U) |  | Pokémon |
| 089/222 | Team Rocket's Chingling | Common (C) |  | Pokémon |
| 090/222 | N's Sigilyph | Common (C) |  | Pokémon |
| 091/222 | Steven's Carbink | Common (C) |  | Pokémon |
| 092/222 | Lillie's Cutiefly | Common (C) |  | Pokémon |
| 093/222 | Lillie's Ribombee | Uncommon (U) |  | Pokémon |
| 094/222 | Lillie's Comfey | Common (C) |  | Pokémon |
| 095/222 | Team Rocket's Mimikyu | Uncommon (U) |  | Pokémon |
| 096/222 | Team Rocket's Dottler | Common (C) |  | Pokémon |
| 097/222 | Team Rocket's Orbeetle | Uncommon (U) |  | Pokémon |
| 098/222 | Mankey | Common (C) |  | Pokémon |
| 099/222 | Primeape | Common (C) |  | Pokémon |
| 100/222 | Annihilape | Rare (R) |  | Pokémon |
| 101/222 | Ethan's Sudowoodo | Common (C) |  | Pokémon |
| 102/222 | Swinub | Common (C) |  | Pokémon |
| 103/222 | Piloswine | Common (C) |  | Pokémon |
| 104/222 | Mamoswine ex | Double Rare (RR) |  | Pokémon ex |
| 105/222 | Larvitar | Common (C) |  | Pokémon |
| 106/222 | Pupitar | Common (C) |  | Pokémon |
| 107/222 | Team Rocket's Larvitar | Common (C) |  | Pokémon |
| 108/222 | Team Rocket's Pupitar | Uncommon (U) |  | Pokémon |
| 109/222 | Team Rocket's Tyranitar | Rare (R) |  | Pokémon |
| 110/222 | Regirock ex | Double Rare (RR) |  | Pokémon ex |
| 111/222 | Cynthia's Gible | Common (C) |  | Pokémon |
| 112/222 | Cynthia's Gabite | Common (C) |  | Pokémon |
| 113/222 | Cynthia's Garchomp ex | Double Rare (RR) |  | Pokémon ex |
| 114/222 | Rockruff | Common (C) |  | Pokémon |
| 115/222 | Lycanroc | Rare (R) |  | Pokémon |
| 116/222 | Hop's Silicobra | Common (C) |  | Pokémon |
| 117/222 | Hop's Sandaconda | Uncommon (U) |  | Pokémon |
| 118/222 | Arven's Toedscool | Common (C) |  | Pokémon |
| 119/222 | Arven's Toedscruel | Uncommon (U) |  | Pokémon |
| 120/222 | Team Rocket's Ekans | Common (C) |  | Pokémon |
| 121/222 | Team Rocket's Arbok | Uncommon (U) |  | Pokémon |
| 122/222 | Team Rocket's Nidoran ♀ | Common (C) |  | Pokémon |
| 123/222 | Team Rocket's Nidorina | Common (C) |  | Pokémon |
| 124/222 | Team Rocket's Nidoqueen | Uncommon (U) |  | Pokémon |
| 125/222 | Team Rocket's Nidoran ♂ | Common (C) |  | Pokémon |
| 126/222 | Team Rocket's Nidorino | Common (C) |  | Pokémon |
| 127/222 | Team Rocket's Nidoking ex | Double Rare (RR) |  | Pokémon ex |
| 128/222 | Team Rocket's Zubat | Common (C) |  | Pokémon |
| 129/222 | Team Rocket's Golbat | Uncommon (U) |  | Pokémon |
| 130/222 | Team Rocket's Crobat ex | Double Rare (RR) |  | Pokémon ex |
| 131/222 | Team Rocket's Grimer | Common (C) |  | Pokémon |
| 132/222 | Team Rocket's Muk | Uncommon (U) |  | Pokémon |
| 133/222 | Team Rocket's Koffing | Common (C) |  | Pokémon |
| 134/222 | Team Rocket's Weezing | Uncommon (U) |  | Pokémon |
| 135/222 | Team Rocket's Murkrow | Uncommon (U) |  | Pokémon |
| 136/222 | Team Rocket's Sneasel | Rare (R) |  | Pokémon |
| 137/222 | Tyranitar | Rare (R) |  | Pokémon |
| 138/222 | Cynthia's Spiritomb | Uncommon (U) |  | Pokémon |
| 139/222 | N's Purrloin | Common (C) |  | Pokémon |
| 140/222 | Marnie's Purrloin | Common (C) |  | Pokémon |
| 141/222 | Marnie's Liepard | Uncommon (U) |  | Pokémon |
| 142/222 | Marnie's Scraggy | Common (C) |  | Pokémon |
| 143/222 | Marnie's Scrafty | Uncommon (U) |  | Pokémon |
| 144/222 | N's Zorua | Common (C) |  | Pokémon |
| 145/222 | N's Zoroark ex | Double Rare (RR) |  | Pokémon ex |
| 146/222 | Marnie's Impidimp | Common (C) |  | Pokémon |
| 147/222 | Marnie's Morgrem | Uncommon (U) |  | Pokémon |
| 148/222 | Marnie's Grimmsnarl ex | Double Rare (RR) |  | Pokémon ex |
| 149/222 | Marnie's Morpeko | Rare (R) |  | Pokémon |
| 150/222 | Arven's Maschiff | Common (C) |  | Pokémon |
| 151/222 | Arven's Mabosstiff ex | Double Rare (RR) |  | Pokémon ex |
| 152/222 | Steven's Skarmory | Common (C) |  | Pokémon |
| 153/222 | Steven's Beldum | Common (C) |  | Pokémon |
| 154/222 | Steven's Metang | Uncommon (U) |  | Pokémon |
| 155/222 | Steven's Metagross ex | Double Rare (RR) |  | Pokémon ex |
| 156/222 | N's Klink | Common (C) |  | Pokémon |
| 157/222 | N's Klang | Common (C) |  | Pokémon |
| 158/222 | N's Klinklang | Uncommon (U) |  | Pokémon |
| 159/222 | Magearna | Rare (R) |  | Pokémon |
| 160/222 | Hop's Corviknight | Uncommon (U) |  | Pokémon |
| 161/222 | Hop's Zacian ex | Double Rare (RR) |  | Pokémon ex |
| 162/222 | Zamazenta | Rare (R) |  | Pokémon |
| 163/222 | Bagon | Common (C) |  | Pokémon |
| 164/222 | Shelgon | Common (C) |  | Pokémon |
| 165/222 | Salamence ex | Double Rare (RR) |  | Pokémon ex |
| 166/222 | N's Reshiram | Rare (R) |  | Pokémon |
| 167/222 | Team Rocket's Rattata | Common (C) |  | Pokémon |
| 168/222 | Team Rocket's Raticate | Common (C) |  | Pokémon |
| 169/222 | Team Rocket's Meowth | Common (C) |  | Pokémon |
| 170/222 | Team Rocket's Persian ex | Double Rare (RR) |  | Pokémon ex |
| 171/222 | Kangaskhan | Common (C) |  | Pokémon |
| 172/222 | Team Rocket's Porygon | Common (C) |  | Pokémon |
| 173/222 | Team Rocket's Porygon2 | Common (C) |  | Pokémon |
| 174/222 | Team Rocket's Porygon-Z | Uncommon (U) |  | Pokémon |
| 175/222 | Hop's Snorlax | Rare (R) |  | Pokémon |
| 176/222 | Sentret | Common (C) |  | Pokémon |
| 177/222 | Furret | Common (C) |  | Pokémon |
| 178/222 | Dunsparce | Common (C) |  | Pokémon |
| 179/222 | Dudunsparce ex | Double Rare (RR) |  | Pokémon ex |
| 180/222 | Noibat | Common (C) |  | Pokémon |
| 181/222 | Noivern | Uncommon (U) |  | Pokémon |
| 182/222 | Arven's Skwovet | Common (C) |  | Pokémon |
| 183/222 | Arven's Greedent | Rare (R) |  | Pokémon |
| 184/222 | Hop's Rookidee | Common (C) |  | Pokémon |
| 185/222 | Hop's Corvisquire | Common (C) |  | Pokémon |
| 186/222 | Hop's Wooloo | Common (C) |  | Pokémon |
| 187/222 | Hop's Dubwool | Rare (R) |  | Pokémon |
| 188/222 | Hop's Cramorant | Uncommon (U) |  | Pokémon |
| 189/222 | Super Potion | Uncommon (U) |  | Item |
| 190/222 | N's PP Up | Uncommon (U) |  | Item |
| 191/222 | Energy Recycler | Uncommon (U) |  | Item |
| 192/222 | Sacred Ash | Uncommon (U) |  | Item |
| 193/222 | Redeemable Ticket | Uncommon (U) |  | Item |
| 194/222 | Arven's Sandwich | Uncommon (U) |  | Item |
| 195/222 | Hop's Bag | Uncommon (U) |  | Item |
| 196/222 | Team Rocket's Bother-Bot | Uncommon (U) |  | Item |
| 197/222 | Team Rocket's Great Ball | Uncommon (U) |  | Item |
| 198/222 | Team Rocket's Venture Bomb | Uncommon (U) |  | Item |
| 199/222 | Team Rocket's Transceiver | Uncommon (U) |  | Item |
| 200/222 | Cynthia's Power Weight | Uncommon (U) |  | Pokémon Tool |
| 201/222 | Hop's Choice Band | Uncommon (U) |  | Pokémon Tool |
| 202/222 | Lillie's Pearl | Uncommon (U) |  | Pokémon Tool |
| 203/222 | Iris's Fighting Spirit | Uncommon (U) |  | Supporter |
| 204/222 | Emcee's Hype | Common (C) |  | Supporter |
| 205/222 | Ruffian | Uncommon (U) |  | Supporter |
| 206/222 | Judge | Uncommon (U) |  | Supporter |
| 207/222 | Brock's Scouting | Uncommon (U) |  | Supporter |
| 208/222 | Ethan's Adventure | Uncommon (U) |  | Supporter |
| 209/222 | Team Rocket's Ariana | Uncommon (U) |  | Supporter |
| 210/222 | Team Rocket's Archer | Uncommon (U) |  | Supporter |
| 211/222 | Team Rocket's Giovanni | Uncommon (U) |  | Supporter |
| 212/222 | Team Rocket's Petrel | Uncommon (U) |  | Supporter |
| 213/222 | Team Rocket's Proton | Uncommon (U) |  | Supporter |
| 214/222 | Granite Cave | Uncommon (U) |  | Stadium |
| 215/222 | N's Castle | Uncommon (U) |  | Stadium |
| 216/222 | Spikemuth Gym | Uncommon (U) |  | Stadium |
| 217/222 | Levincia | Uncommon (U) |  | Stadium |
| 218/222 | Postwick | Uncommon (U) |  | Stadium |
| 219/222 | Team Rocket's Watchtower | Uncommon (U) |  | Stadium |
| 220/222 | Team Rocket's Factory | Uncommon (U) |  | Stadium |
| 221/222 | Spiky Energy | Uncommon (U) |  | Special Energy |
| 222/222 | Team Rocket's Energy | Uncommon (U) |  | Special Energy |
| 223/222 | Yanma | Art Rare (AR) | Yanma 002/222 | Art Rare |
| 224/222 | Maractus | Art Rare (AR) | Maractus 008/222 | Art Rare |
| 225/222 | Misty's Psyduck | Art Rare (AR) | Misty's Psyduck 045/222 | Art Rare |
| 226/222 | Rotom | Art Rare (AR) | Rotom 075/222 | Art Rare |
| 227/222 | Zamazenta | Art Rare (AR) | Zamazenta 162/222 | Art Rare |
| 228/222 | N's Reshiram | Art Rare (AR) | N's Reshiram 166/222 | Art Rare |
| 229/222 | Yanmega ex | Super Rare (SR) | Yanmega ex 003/222 | full art |
| 230/222 | Arboliva ex | Super Rare (SR) | Arboliva ex 022/222 | full art |
| 231/222 | Team Rocket's Moltres ex | Super Rare (SR) | Team Rocket's Moltres ex 027/222 | full art |
| 232/222 | Ethan's Ho-Oh ex | Super Rare (SR) | Ethan's Ho-Oh ex 035/222 | full art |
| 233/222 | Volcanion ex | Super Rare (SR) | Volcanion ex 042/222 | full art |
| 234/222 | Cetitan ex | Super Rare (SR) | Cetitan ex 062/222 | full art |
| 235/222 | Dondozo ex | Super Rare (SR) | Dondozo ex 063/222 | full art |
| 236/222 | Electivire ex | Super Rare (SR) | Electivire ex 067/222 | full art |
| 237/222 | Iono's Bellibolt ex | Super Rare (SR) | Iono's Bellibolt ex 079/222 | full art |
| 238/222 | Lillie's Clefairy ex | Super Rare (SR) | Lillie's Clefairy ex 082/222 | full art |
| 239/222 | Team Rocket's Mewtwo ex | Super Rare (SR) | Team Rocket's Mewtwo ex 085/222 | full art |
| 240/222 | Regirock ex | Super Rare (SR) | Regirock ex 110/222 | full art |
| 241/222 | Cynthia's Garchomp ex | Super Rare (SR) | Cynthia's Garchomp ex 113/222 | full art |
| 242/222 | Mamoswine ex | Super Rare (SR) | Mamoswine ex 104/222 | full art |
| 243/222 | Team Rocket's Nidoking ex | Super Rare (SR) | Team Rocket's Nidoking ex 127/222 | full art |
| 244/222 | Team Rocket's Crobat ex | Super Rare (SR) | Team Rocket's Crobat ex 130/222 | full art |
| 245/222 | N's Zoroark ex | Super Rare (SR) | N's Zoroark ex 145/222 | full art |
| 246/222 | Arven's Mabosstiff ex | Super Rare (SR) | Arven's Mabosstiff ex 151/222 | full art |
| 247/222 | Hop's Zacian ex | Super Rare (SR) | Hop's Zacian ex 161/222 | full art |
| 248/222 | Salamence ex | Super Rare (SR) | Salamence ex 165/222 | full art |
| 249/222 | Team Rocket's Persian ex | Super Rare (SR) | Team Rocket's Persian ex 170/222 | full art |
| 250/222 | Dudunsparce ex | Super Rare (SR) | Dudunsparce ex 179/222 | full art |
| 251/222 | Iris's Fighting Spirit | Super Rare (SR) | Iris's Fighting Spirit 203/222 | full art, Supporter |
| 252/222 | Emcee's Hype | Super Rare (SR) | Emcee's Hype 204/222 | full art, Supporter |
| 253/222 | Ruffian | Super Rare (SR) | Ruffian 205/222 | full art, Supporter |
| 254/222 | Judge | Super Rare (SR) | Judge 206/222 | full art, Supporter |
| 255/222 | Brock's Scouting | Super Rare (SR) | Brock's Scouting 207/222 | full art, Supporter |
| 256/222 | Ethan's Adventure | Super Rare (SR) | Ethan's Adventure 208/222 | full art, Supporter |
| 257/222 | Team Rocket's Ariana | Super Rare (SR) | Team Rocket's Ariana 209/222 | full art, Supporter |
| 258/222 | Team Rocket's Archer | Super Rare (SR) | Team Rocket's Archer 210/222 | full art, Supporter |
| 259/222 | Team Rocket's Giovanni | Super Rare (SR) | Team Rocket's Giovanni 211/222 | full art, Supporter |
| 260/222 | Team Rocket's Petrel | Super Rare (SR) | Team Rocket's Petrel 212/222 | full art, Supporter |
| 261/222 | Team Rocket's Proton | Super Rare (SR) | Team Rocket's Proton 213/222 | full art, Supporter |
| 262/222 | Yanmega ex | Special Art Rare (SAR) | Yanmega ex 003/222 | special art |
| 263/222 | Team Rocket's Moltres ex | Special Art Rare (SAR) | Team Rocket's Moltres ex 027/222 | special art |
| 264/222 | Ethan's Ho-Oh ex | Special Art Rare (SAR) | Ethan's Ho-Oh ex 035/222 | special art |
| 265/222 | Volcanion ex | Special Art Rare (SAR) | Volcanion ex 042/222 | special art |
| 266/222 | Iono's Bellibolt ex | Special Art Rare (SAR) | Iono's Bellibolt ex 079/222 | special art |
| 267/222 | Lillie's Clefairy ex | Special Art Rare (SAR) | Lillie's Clefairy ex 082/222 | special art |
| 268/222 | Team Rocket's Mewtwo ex | Special Art Rare (SAR) | Team Rocket's Mewtwo ex 085/222 | special art |
| 269/222 | Cynthia's Garchomp ex | Special Art Rare (SAR) | Cynthia's Garchomp ex 113/222 | special art |
| 270/222 | Team Rocket's Nidoking ex | Special Art Rare (SAR) | Team Rocket's Nidoking ex 127/222 | special art |
| 271/222 | Team Rocket's Crobat ex | Special Art Rare (SAR) | Team Rocket's Crobat ex 130/222 | special art |
| 272/222 | N's Zoroark ex | Special Art Rare (SAR) | N's Zoroark ex 145/222 | special art |
| 273/222 | Arven's Mabosstiff ex | Special Art Rare (SAR) | Arven's Mabosstiff ex 151/222 | special art |
| 274/222 | Hop's Zacian ex | Special Art Rare (SAR) | Hop's Zacian ex 161/222 | special art |
| 275/222 | Salamence ex | Special Art Rare (SAR) | Salamence ex 165/222 | special art |
| 276/222 | Brock's Scouting | Special Art Rare (SAR) | Brock's Scouting 207/222 | special art, Supporter, **Chinese exclusive (Chen)** |
| 277/222 | Ethan's Adventure | Special Art Rare (SAR) | Ethan's Adventure 208/222 | special art, Supporter |
| 278/222 | Team Rocket's Ariana | Special Art Rare (SAR) | Team Rocket's Ariana 209/222 | special art, Supporter |
| 279/222 | Team Rocket's Giovanni | Special Art Rare (SAR) | Team Rocket's Giovanni 211/222 | special art, Supporter |
| 280/222 | Ethan's Ho-Oh ex | Ultra Rare (UR) | Ethan's Ho-Oh ex 035/222 | gold |
| 281/222 | Iono's Bellibolt ex | Ultra Rare (UR) | Iono's Bellibolt ex 079/222 | gold |
| 282/222 | Team Rocket's Mewtwo ex | Ultra Rare (UR) | Team Rocket's Mewtwo ex 085/222 | gold |
| 283/222 | Cynthia's Garchomp ex | Ultra Rare (UR) | Cynthia's Garchomp ex 113/222 | gold |
| 284/222 | Team Rocket's Crobat ex | Ultra Rare (UR) | Team Rocket's Crobat ex 130/222 | gold |
| 285/222 | N's Zoroark ex | Ultra Rare (UR) | N's Zoroark ex 145/222 | gold |
| 286/222 | Levincia | Ultra Rare (UR) | Levincia 217/222 | gold, Stadium |
| 287/222 | Spiky Energy | Ultra Rare (UR) | Spiky Energy 221/222 | gold, Special Energy |
