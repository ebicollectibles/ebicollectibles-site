# Collect 151 (Chinese): sourcing notes

Sources: https://www.chencards.com/sets/collect_151 plus Chen's four release pages, `collect_151_journey`, `_hope`, `_surprise` and `_gathering` (Chen Cards, used with permission), fetched 2026-11-12.

## Set facts

- Name: **Collect 151** (收集啦151). Official set code **151C**. Files: `src/data/collect-151.json`, `collect-151-images/`, branch `collect-151-data`, `slug: "collect-151"`. Image placeholders: `Chinese/Collect 151/Cards/NNNN.webp`.
- Series: Chen files it as its own **"Collect 151"** series, not under "Chinese Scarlet & Violet Series". It's the Simplified Chinese take on the Scarlet & Violet "151" set: an official Pokémon TCG set, not a Gem Pack.
- Language: Simplified Chinese
- Release: **2025-01-17** for the set and its first release, Journey. Three later releases followed; see below.
- **192 cards**: `001/151`–`151/151` main set + `152/151`–`192/151` secret rares (printed total **151**).
- **Main set = the 151 original Pokémon in Pokédex order**: 001 Bulbasaur … 151 Mew ex, so for 001–151 the collector number **is** the National Pokédex number. There are **no Trainer or Energy cards at all** (the Japanese/English "151" sets have them; this Chinese set doesn't).
- **No odds chart on Chen** for the set or any release, and no cards-per-pack figure.
- **One numbering system. Every card has a rarity and an image.** I read the printed C/U letter on all 114 Commons and Uncommons, and every one matches Chen's label, so no corrections.

## The five Chen pages = one card list + four releases

Chen has **five** Collect 151 pages. They hold the **identical 192-card list**: I checked every number, name, rarity and image URL. The four named pages are **release waves** of the same set, each pointing back to the base page (`sharedFrom: collect_151`) and each with **its own exclusive cards**:

| Release (Chen page) | Released | Chen-flagged exclusive(s) |
|---|---|---|
| Collect 151 (base page, `collect_151`) | 2025-01-17 | none (the shared card list) |
| Collect 151 Journey (`collect_151_journey`) | 2025-01-17 | 170/151 Pikachu AR |
| Collect 151 Hope (`collect_151_hope`) | 2025-04-18 | 171/151 Pikachu AR |
| Collect 151 Surprise (`collect_151_surprise`) | 2025-07-18 | 172/151 Pikachu AR, 189/151 Alakazam ex SAR, 191/151 Mew ex SAR |
| Collect 151 Gathering (`collect_151_gathering`) | 2025-10-17 | 173/151 Pikachu AR, 190/151 Zapdos ex SAR |

- Each release gets **one of the four Pikachu Art Rares** (170 → 173 in release order). The three Special Art Rares are split between the last two releases: **Surprise** has 189 Alakazam ex and 191 Mew ex, **Gathering** has 190 Zapdos ex.
- Only the release pages have no set code on Chen (`code: null`); the set is 151C throughout.
- **How it's encoded:** the schema has one `exclusiveCardNumbers` list, so the JSON holds the **union of all seven** (170/151, 171/151, 172/151, 173/151, 189/151, 190/151, 191/151). **The per-release mapping exists only in this table.** If the site wants a page or tab per release ("Pikachu AR only in Hope boxes"), add a release field or a small mapping in the page config, rather than five copies of the 192-card JSON.

## Rarity tiers, most common to rarest

| Rank | Chen's exact string | Abbr. | Cards | Numbers |
|---|---|---|---|---|
| 1 | Common (C) | C | 63 | main set |
| 2 | Uncommon (U) | U | 51 | main set |
| 3 | Rare (R) | R | 25 | main set |
| 4 | Double Rare (RR) | RR | 12 | main set (the 12 ex) |
| 5 | Shiny (S) | S | 18 | 152–169 |
| 6 | Art Rare (AR) | AR | 4 | 170–173 |
| 7 | Super Rare (SR) | SR | 12 | 174–185 |
| 8 | Shiny Super Rare (SSR) | SSR | 3 | 186–188 |
| 9 | Special Art Rare (SAR) | SAR | 3 | 189–191 |
| 10 | Ultra Rare (UR) | UR | 1 | 192 |
| | **Total** | | **192** | |

- **Two tiers no other Chen set has used: "Shiny (S)"** (18 shiny-colour Pokémon with a star-sparkle frame, 152–169) and **"Shiny Super Rare (SSR)"** (3 shiny full-art ex, 186–188).
- **No odds chart, so the ranking is unconfirmed.** I ordered the secret tiers by their numbering (S < AR < SR < SSR < SAR < UR), which is how every other Chinese SV set orders its secret block. The main-set ladder is C < U < R < RR.
- **No AR for most Pokémon**: only the 4 Pikachu ARs. **No ACE SPEC, no Trainers, no Ball-pattern parallels** on Chen.

## Structure: a flat officially-numbered catalog

**Not a Gem-style ladder.** One collector number `NNN/151` per card; rarer versions sit at unrelated numbers in the secret block and match only **by name**, e.g. Mew ex is 151 (RR), 185 (SR), 188 (SSR), 191 (SAR) and 192 (UR).

| Numbers | Block | Cards | Rarities |
|---|---|---|---|
| 001–151 | The 151 Kanto Pokémon, Pokédex order | 151 | C 63, U 51, R 25, RR 12 |
| 152–169 | Shiny Pokémon | 18 | S |
| 170–173 | Pikachu Art Rares, one per release | 4 | AR |
| 174–185 | Super Rare full arts of the 12 ex | 12 | SR |
| 186–188 | Shiny full-art ex | 3 | SSR |
| 189–191 | Special Art Rare ex | 3 | SAR |
| 192 | Ultra Rare gold Mew ex | 1 | UR |

### Irregularities to handle

- **Pikachu appears 5 times:** 025 (C) and the four Pikachu ARs 170–173, which are **four different arts with the same name and rarity**, one per release. Keep them distinguishable by number.
- **Same ex at many tiers:** Mew ex (151 RR, 185 SR, 188 SSR, 191 SAR, 192 UR); Alakazam ex (065 RR, 180 SR, 187 SSR, 189 SAR); Wigglytuff ex (040 RR, 179 SR, 186 SSR); Zapdos ex (145 RR, 184 SR, 190 SAR).
- **Shiny versions of non-ex Pokémon** (152–169) are named exactly like the main-set card (e.g. 004 Charmander C and 152 Charmander S), so a name match finds both; that's correct.
- Every secret-rare name exists in the main set (no orphans).
- No null rarities, no missing images, no split cards. All images are 300×418 or 300×419.
- **pokemonIndex = Pokédex number for 001–151**, a nice bonus if the page wants Pokédex sorting or links.

### Will the existing Gem Set engine render it as-is? **No.**

Same `number.slice(0, 4)` problem as the other official sets (`"001/151"` gives id `"001/"`). Use the flat-catalog page CSV10 uses. If the site wants per-release pages, they can all read the one JSON and differ only in which exclusives they highlight.

### JSON mapping

Same top-level and card fields as `csv10.json`. `code` is `151C`, `series` is Chen's "Collect 151", `releaseDate` is the base and Journey date. `exclusiveCardNumbers` is the union of the four releases' exclusives (see the table above). No `catalogGroups`.

## Suggested hero theme colors

The logo "收集啦151" is **Kanto green** (`#56935A`) and sage (`#C8D3C0`) lettering with a warm sand tone (`#A59783`) and a dark cocoa outline (`#221410`), with a retro, Pokédex-like feel.

- **Primary, Kanto green `#56935A`:** chips, rules and the Pokédex-number accents. For text on white, darken it to about `#3E6E42`.
- **Secondary, deep cocoa `#221410`:** the hero background, matching the logo outline, with sand `#A59783` for small details.

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **191/151 Mew ex SAR** | Mew ex SAR, the set's headline chase (Surprise exclusive) |
| inner left | **175/151 Charizard ex SR** | Charizard ex SR, always a top seller |
| inner right | **190/151 Zapdos ex SAR** | Zapdos ex SAR (Gathering exclusive) |
| outer left | **189/151 Alakazam ex SAR** | Alakazam ex SAR (Surprise exclusive) |
| outer right | **192/151 Mew ex UR** | Mew ex UR, gold, the top tier |

Alternatives: one of the Pikachu ARs 170–173 (especially for a per-release page), 188 Mew ex SSR, or 174/176 Venusaur / Blastoise ex SR to complete the starters.

## Files

- `src/data/collect-151.json`: 192 cards, schema as above.
- `collect-151-images/cards/0001.webp`–`0192.webp`: all 192 images (shared by all five Chen pages).

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Note |
|---|---|---|---|---|
| 001/151 | Bulbasaur | Common (C) |  | Pokémon, Pokédex #001 |
| 002/151 | Ivysaur | Uncommon (U) |  | Pokémon, Pokédex #002 |
| 003/151 | Venusaur ex | Double Rare (RR) |  | Pokémon ex, Pokédex #003 |
| 004/151 | Charmander | Common (C) |  | Pokémon, Pokédex #004 |
| 005/151 | Charmeleon | Uncommon (U) |  | Pokémon, Pokédex #005 |
| 006/151 | Charizard ex | Double Rare (RR) |  | Pokémon ex, Pokédex #006 |
| 007/151 | Squirtle | Common (C) |  | Pokémon, Pokédex #007 |
| 008/151 | Wartortle | Uncommon (U) |  | Pokémon, Pokédex #008 |
| 009/151 | Blastoise ex | Double Rare (RR) |  | Pokémon ex, Pokédex #009 |
| 010/151 | Caterpie | Common (C) |  | Pokémon, Pokédex #010 |
| 011/151 | Metapod | Common (C) |  | Pokémon, Pokédex #011 |
| 012/151 | Butterfree | Uncommon (U) |  | Pokémon, Pokédex #012 |
| 013/151 | Weedle | Common (C) |  | Pokémon, Pokédex #013 |
| 014/151 | Kakuna | Common (C) |  | Pokémon, Pokédex #014 |
| 015/151 | Beedrill | Rare (R) |  | Pokémon, Pokédex #015 |
| 016/151 | Pidgey | Common (C) |  | Pokémon, Pokédex #016 |
| 017/151 | Pidgeotto | Common (C) |  | Pokémon, Pokédex #017 |
| 018/151 | Pidgeot | Uncommon (U) |  | Pokémon, Pokédex #018 |
| 019/151 | Rattata | Common (C) |  | Pokémon, Pokédex #019 |
| 020/151 | Raticate | Uncommon (U) |  | Pokémon, Pokédex #020 |
| 021/151 | Spearow | Common (C) |  | Pokémon, Pokédex #021 |
| 022/151 | Fearow | Uncommon (U) |  | Pokémon, Pokédex #022 |
| 023/151 | Ekans | Common (C) |  | Pokémon, Pokédex #023 |
| 024/151 | Arbok ex | Double Rare (RR) |  | Pokémon ex, Pokédex #024 |
| 025/151 | Pikachu | Common (C) |  | Pokémon, Pokédex #025 |
| 026/151 | Raichu | Rare (R) |  | Pokémon, Pokédex #026 |
| 027/151 | Sandshrew | Common (C) |  | Pokémon, Pokédex #027 |
| 028/151 | Sandslash | Uncommon (U) |  | Pokémon, Pokédex #028 |
| 029/151 | Nidoran ♀ | Common (C) |  | Pokémon, Pokédex #029 |
| 030/151 | Nidorina | Uncommon (U) |  | Pokémon, Pokédex #030 |
| 031/151 | Nidoqueen | Uncommon (U) |  | Pokémon, Pokédex #031 |
| 032/151 | Nidoran ♂ | Common (C) |  | Pokémon, Pokédex #032 |
| 033/151 | Nidorino | Uncommon (U) |  | Pokémon, Pokédex #033 |
| 034/151 | Nidoking | Rare (R) |  | Pokémon, Pokédex #034 |
| 035/151 | Clefairy | Common (C) |  | Pokémon, Pokédex #035 |
| 036/151 | Clefable | Uncommon (U) |  | Pokémon, Pokédex #036 |
| 037/151 | Vulpix | Common (C) |  | Pokémon, Pokédex #037 |
| 038/151 | Ninetales ex | Double Rare (RR) |  | Pokémon ex, Pokédex #038 |
| 039/151 | Jigglypuff | Common (C) |  | Pokémon, Pokédex #039 |
| 040/151 | Wigglytuff ex | Double Rare (RR) |  | Pokémon ex, Pokédex #040 |
| 041/151 | Zubat | Common (C) |  | Pokémon, Pokédex #041 |
| 042/151 | Golbat | Uncommon (U) |  | Pokémon, Pokédex #042 |
| 043/151 | Oddish | Common (C) |  | Pokémon, Pokédex #043 |
| 044/151 | Gloom | Uncommon (U) |  | Pokémon, Pokédex #044 |
| 045/151 | Vileplume | Rare (R) |  | Pokémon, Pokédex #045 |
| 046/151 | Paras | Common (C) |  | Pokémon, Pokédex #046 |
| 047/151 | Parasect | Uncommon (U) |  | Pokémon, Pokédex #047 |
| 048/151 | Venonat | Common (C) |  | Pokémon, Pokédex #048 |
| 049/151 | Venomoth | Uncommon (U) |  | Pokémon, Pokédex #049 |
| 050/151 | Diglett | Common (C) |  | Pokémon, Pokédex #050 |
| 051/151 | Dugtrio | Uncommon (U) |  | Pokémon, Pokédex #051 |
| 052/151 | Meowth | Common (C) |  | Pokémon, Pokédex #052 |
| 053/151 | Persian | Uncommon (U) |  | Pokémon, Pokédex #053 |
| 054/151 | Psyduck | Common (C) |  | Pokémon, Pokédex #054 |
| 055/151 | Golduck | Uncommon (U) |  | Pokémon, Pokédex #055 |
| 056/151 | Mankey | Common (C) |  | Pokémon, Pokédex #056 |
| 057/151 | Primeape | Uncommon (U) |  | Pokémon, Pokédex #057 |
| 058/151 | Growlithe | Common (C) |  | Pokémon, Pokédex #058 |
| 059/151 | Arcanine | Uncommon (U) |  | Pokémon, Pokédex #059 |
| 060/151 | Poliwag | Common (C) |  | Pokémon, Pokédex #060 |
| 061/151 | Poliwhirl | Common (C) |  | Pokémon, Pokédex #061 |
| 062/151 | Poliwrath | Uncommon (U) |  | Pokémon, Pokédex #062 |
| 063/151 | Abra | Common (C) |  | Pokémon, Pokédex #063 |
| 064/151 | Kadabra | Uncommon (U) |  | Pokémon, Pokédex #064 |
| 065/151 | Alakazam ex | Double Rare (RR) |  | Pokémon ex, Pokédex #065 |
| 066/151 | Machop | Common (C) |  | Pokémon, Pokédex #066 |
| 067/151 | Machoke | Uncommon (U) |  | Pokémon, Pokédex #067 |
| 068/151 | Machamp | Rare (R) |  | Pokémon, Pokédex #068 |
| 069/151 | Bellsprout | Common (C) |  | Pokémon, Pokédex #069 |
| 070/151 | Weepinbell | Common (C) |  | Pokémon, Pokédex #070 |
| 071/151 | Victreebel | Uncommon (U) |  | Pokémon, Pokédex #071 |
| 072/151 | Tentacool | Common (C) |  | Pokémon, Pokédex #072 |
| 073/151 | Tentacruel | Uncommon (U) |  | Pokémon, Pokédex #073 |
| 074/151 | Geodude | Common (C) |  | Pokémon, Pokédex #074 |
| 075/151 | Graveler | Uncommon (U) |  | Pokémon, Pokédex #075 |
| 076/151 | Golem ex | Double Rare (RR) |  | Pokémon ex, Pokédex #076 |
| 077/151 | Ponyta | Common (C) |  | Pokémon, Pokédex #077 |
| 078/151 | Rapidash | Uncommon (U) |  | Pokémon, Pokédex #078 |
| 079/151 | Slowpoke | Common (C) |  | Pokémon, Pokédex #079 |
| 080/151 | Slowbro | Uncommon (U) |  | Pokémon, Pokédex #080 |
| 081/151 | Magnemite | Common (C) |  | Pokémon, Pokédex #081 |
| 082/151 | Magneton | Uncommon (U) |  | Pokémon, Pokédex #082 |
| 083/151 | Farfetch'd | Common (C) |  | Pokémon, Pokédex #083 |
| 084/151 | Doduo | Common (C) |  | Pokémon, Pokédex #084 |
| 085/151 | Dodrio | Rare (R) |  | Pokémon, Pokédex #085 |
| 086/151 | Seel | Common (C) |  | Pokémon, Pokédex #086 |
| 087/151 | Dewgong | Uncommon (U) |  | Pokémon, Pokédex #087 |
| 088/151 | Grimer | Common (C) |  | Pokémon, Pokédex #088 |
| 089/151 | Muk | Uncommon (U) |  | Pokémon, Pokédex #089 |
| 090/151 | Shellder | Common (C) |  | Pokémon, Pokédex #090 |
| 091/151 | Cloyster | Uncommon (U) |  | Pokémon, Pokédex #091 |
| 092/151 | Gastly | Common (C) |  | Pokémon, Pokédex #092 |
| 093/151 | Haunter | Uncommon (U) |  | Pokémon, Pokédex #093 |
| 094/151 | Gengar | Rare (R) |  | Pokémon, Pokédex #094 |
| 095/151 | Onix | Uncommon (U) |  | Pokémon, Pokédex #095 |
| 096/151 | Drowzee | Common (C) |  | Pokémon, Pokédex #096 |
| 097/151 | Hypno | Uncommon (U) |  | Pokémon, Pokédex #097 |
| 098/151 | Krabby | Common (C) |  | Pokémon, Pokédex #098 |
| 099/151 | Kingler | Uncommon (U) |  | Pokémon, Pokédex #099 |
| 100/151 | Voltorb | Common (C) |  | Pokémon, Pokédex #100 |
| 101/151 | Electrode | Rare (R) |  | Pokémon, Pokédex #101 |
| 102/151 | Exeggcute | Common (C) |  | Pokémon, Pokédex #102 |
| 103/151 | Exeggutor | Uncommon (U) |  | Pokémon, Pokédex #103 |
| 104/151 | Cubone | Common (C) |  | Pokémon, Pokédex #104 |
| 105/151 | Marowak | Rare (R) |  | Pokémon, Pokédex #105 |
| 106/151 | Hitmonlee | Uncommon (U) |  | Pokémon, Pokédex #106 |
| 107/151 | Hitmonchan | Uncommon (U) |  | Pokémon, Pokédex #107 |
| 108/151 | Lickitung | Common (C) |  | Pokémon, Pokédex #108 |
| 109/151 | Koffing | Common (C) |  | Pokémon, Pokédex #109 |
| 110/151 | Weezing | Rare (R) |  | Pokémon, Pokédex #110 |
| 111/151 | Rhyhorn | Common (C) |  | Pokémon, Pokédex #111 |
| 112/151 | Rhydon | Uncommon (U) |  | Pokémon, Pokédex #112 |
| 113/151 | Chansey | Rare (R) |  | Pokémon, Pokédex #113 |
| 114/151 | Tangela | Common (C) |  | Pokémon, Pokédex #114 |
| 115/151 | Kangaskhan ex | Double Rare (RR) |  | Pokémon ex, Pokédex #115 |
| 116/151 | Horsea | Common (C) |  | Pokémon, Pokédex #116 |
| 117/151 | Seadra | Uncommon (U) |  | Pokémon, Pokédex #117 |
| 118/151 | Goldeen | Common (C) |  | Pokémon, Pokédex #118 |
| 119/151 | Seaking | Uncommon (U) |  | Pokémon, Pokédex #119 |
| 120/151 | Staryu | Common (C) |  | Pokémon, Pokédex #120 |
| 121/151 | Starmie | Rare (R) |  | Pokémon, Pokédex #121 |
| 122/151 | Mr. Mime | Rare (R) |  | Pokémon, Pokédex #122 |
| 123/151 | Scyther | Uncommon (U) |  | Pokémon, Pokédex #123 |
| 124/151 | Jynx ex | Double Rare (RR) |  | Pokémon ex, Pokédex #124 |
| 125/151 | Electabuzz | Common (C) |  | Pokémon, Pokédex #125 |
| 126/151 | Magmar | Common (C) |  | Pokémon, Pokédex #126 |
| 127/151 | Pinsir | Uncommon (U) |  | Pokémon, Pokédex #127 |
| 128/151 | Tauros | Uncommon (U) |  | Pokémon, Pokédex #128 |
| 129/151 | Magikarp | Common (C) |  | Pokémon, Pokédex #129 |
| 130/151 | Gyarados | Rare (R) |  | Pokémon, Pokédex #130 |
| 131/151 | Lapras | Uncommon (U) |  | Pokémon, Pokédex #131 |
| 132/151 | Ditto | Rare (R) |  | Pokémon, Pokédex #132 |
| 133/151 | Eevee | Common (C) |  | Pokémon, Pokédex #133 |
| 134/151 | Vaporeon | Rare (R) |  | Pokémon, Pokédex #134 |
| 135/151 | Jolteon | Rare (R) |  | Pokémon, Pokédex #135 |
| 136/151 | Flareon | Rare (R) |  | Pokémon, Pokédex #136 |
| 137/151 | Porygon | Common (C) |  | Pokémon, Pokédex #137 |
| 138/151 | Omanyte | Uncommon (U) |  | Pokémon, Pokédex #138 |
| 139/151 | Omastar | Rare (R) |  | Pokémon, Pokédex #139 |
| 140/151 | Kabuto | Uncommon (U) |  | Pokémon, Pokédex #140 |
| 141/151 | Kabutops | Rare (R) |  | Pokémon, Pokédex #141 |
| 142/151 | Aerodactyl | Rare (R) |  | Pokémon, Pokédex #142 |
| 143/151 | Snorlax | Uncommon (U) |  | Pokémon, Pokédex #143 |
| 144/151 | Articuno | Rare (R) |  | Pokémon, Pokédex #144 |
| 145/151 | Zapdos ex | Double Rare (RR) |  | Pokémon ex, Pokédex #145 |
| 146/151 | Moltres | Rare (R) |  | Pokémon, Pokédex #146 |
| 147/151 | Dratini | Common (C) |  | Pokémon, Pokédex #147 |
| 148/151 | Dragonair | Uncommon (U) |  | Pokémon, Pokédex #148 |
| 149/151 | Dragonite | Rare (R) |  | Pokémon, Pokédex #149 |
| 150/151 | Mewtwo | Rare (R) |  | Pokémon, Pokédex #150 |
| 151/151 | Mew ex | Double Rare (RR) |  | Pokémon ex, Pokédex #151 |
| 152/151 | Charmander | Shiny (S) | Charmander 004/151 | Pokémon |
| 153/151 | Pidgey | Shiny (S) | Pidgey 016/151 | Pokémon |
| 154/151 | Pidgeotto | Shiny (S) | Pidgeotto 017/151 | Pokémon |
| 155/151 | Raichu | Shiny (S) | Raichu 026/151 | Pokémon |
| 156/151 | Jigglypuff | Shiny (S) | Jigglypuff 039/151 | Pokémon |
| 157/151 | Oddish | Shiny (S) | Oddish 043/151 | Pokémon |
| 158/151 | Gloom | Shiny (S) | Gloom 044/151 | Pokémon |
| 159/151 | Vileplume | Shiny (S) | Vileplume 045/151 | Pokémon |
| 160/151 | Abra | Shiny (S) | Abra 063/151 | Pokémon |
| 161/151 | Kadabra | Shiny (S) | Kadabra 064/151 | Pokémon |
| 162/151 | Doduo | Shiny (S) | Doduo 084/151 | Pokémon |
| 163/151 | Dodrio | Shiny (S) | Dodrio 085/151 | Pokémon |
| 164/151 | Voltorb | Shiny (S) | Voltorb 100/151 | Pokémon |
| 165/151 | Electrode | Shiny (S) | Electrode 101/151 | Pokémon |
| 166/151 | Staryu | Shiny (S) | Staryu 120/151 | Pokémon |
| 167/151 | Starmie | Shiny (S) | Starmie 121/151 | Pokémon |
| 168/151 | Ditto | Shiny (S) | Ditto 132/151 | Pokémon |
| 169/151 | Snorlax | Shiny (S) | Snorlax 143/151 | Pokémon |
| 170/151 | Pikachu | Art Rare (AR) | Pikachu 025/151 | Pokémon, **Collect 151 Journey exclusive (Chen)** |
| 171/151 | Pikachu | Art Rare (AR) | Pikachu 025/151 | Pokémon, **Collect 151 Hope exclusive (Chen)** |
| 172/151 | Pikachu | Art Rare (AR) | Pikachu 025/151 | Pokémon, **Collect 151 Surprise exclusive (Chen)** |
| 173/151 | Pikachu | Art Rare (AR) | Pikachu 025/151 | Pokémon, **Collect 151 Gathering exclusive (Chen)** |
| 174/151 | Venusaur ex | Super Rare (SR) | Venusaur ex 003/151 | Pokémon ex |
| 175/151 | Charizard ex | Super Rare (SR) | Charizard ex 006/151 | Pokémon ex |
| 176/151 | Blastoise ex | Super Rare (SR) | Blastoise ex 009/151 | Pokémon ex |
| 177/151 | Arbok ex | Super Rare (SR) | Arbok ex 024/151 | Pokémon ex |
| 178/151 | Ninetales ex | Super Rare (SR) | Ninetales ex 038/151 | Pokémon ex |
| 179/151 | Wigglytuff ex | Super Rare (SR) | Wigglytuff ex 040/151 | Pokémon ex |
| 180/151 | Alakazam ex | Super Rare (SR) | Alakazam ex 065/151 | Pokémon ex |
| 181/151 | Golem ex | Super Rare (SR) | Golem ex 076/151 | Pokémon ex |
| 182/151 | Kangaskhan ex | Super Rare (SR) | Kangaskhan ex 115/151 | Pokémon ex |
| 183/151 | Jynx ex | Super Rare (SR) | Jynx ex 124/151 | Pokémon ex |
| 184/151 | Zapdos ex | Super Rare (SR) | Zapdos ex 145/151 | Pokémon ex |
| 185/151 | Mew ex | Super Rare (SR) | Mew ex 151/151 | Pokémon ex |
| 186/151 | Wigglytuff ex | Shiny Super Rare (SSR) | Wigglytuff ex 040/151 | Pokémon ex |
| 187/151 | Alakazam ex | Shiny Super Rare (SSR) | Alakazam ex 065/151 | Pokémon ex |
| 188/151 | Mew ex | Shiny Super Rare (SSR) | Mew ex 151/151 | Pokémon ex |
| 189/151 | Alakazam ex | Special Art Rare (SAR) | Alakazam ex 065/151 | Pokémon ex, **Collect 151 Surprise exclusive (Chen)** |
| 190/151 | Zapdos ex | Special Art Rare (SAR) | Zapdos ex 145/151 | Pokémon ex, **Collect 151 Gathering exclusive (Chen)** |
| 191/151 | Mew ex | Special Art Rare (SAR) | Mew ex 151/151 | Pokémon ex, **Collect 151 Surprise exclusive (Chen)** |
| 192/151 | Mew ex | Ultra Rare (UR) | Mew ex 151/151 | Pokémon ex |
