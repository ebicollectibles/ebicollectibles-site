# Gem Vol 2: sourcing notes

Source: https://www.chencards.com/sets/gem_vol_2 (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name / code: Gem Vol 2, **CBB2C**, Gem Set series, Simplified Chinese
- Release: 2025-05-16
- **140 cards**, 4 holo cards per pack (from the official odds chart)
- An **Eevee-family set**: Eevee and all 8 Eeveelutions, plus Trainer and Energy blocks

## Structure: irregular, and different from both Vol 3 and Vols 4–7

Vol 2 follows **neither** the simple Vols 4–7 pattern (28 Pokémon × 7) **nor** Vol 3's pattern (18 Pokémon × 7 plus Trainer and Energy blocks). It has Trainer and Energy blocks like Vol 3, but only 9 Pokémon, each with a much longer ladder of **14 or 15 versions**, and two denominators mixed across the Pokémon blocks.

### Pokémon blocks: 9 Pokémon, groups 01–09

| Group | Pokémon | Numbering | Versions |
|---|---|---|---|
| 01 | Eevee | `01VV/15` | 15 |
| 02 | Vaporeon | `02VV/14` | 14 |
| 03 | Jolteon | `03VV/14` | 14 |
| 04 | Flareon | `04VV/14` | 14 |
| 05 | Espeon | `05VV/14` | 14 |
| 06 | Umbreon | `06VV/15` | 15 |
| 07 | Leafeon | `07VV/15` | 15 |
| 08 | Glaceon | `08VV/14` | 14 |
| 09 | Sylveon | `09VV/15` | 15 |

Every Pokémon has the same 14-version ladder. Four of them (Eevee, Umbreon, Leafeon, Sylveon) add a 15th version, and only those four use the `/15` denominator. The other five use `/14`.

| Version | Rarity | What it is |
|---|---|---|
| 01, 03 | ● Common | base card **A**, two treatments |
| 02, 04 | ● Common | base card **B**, two treatments |
| 05, 07 | ◆ Uncommon | card A, holo treatments |
| 06, 08 | ◆ Uncommon | card B, holo treatments |
| 09 / 10 | ★ Rare | card A / card B |
| 11 / 12 | ★★ Double Rare | card A / card B, Gem Pack logo stamp |
| 13 | ★ **Rare** | **Pokémon V** (e.g. "Eevee V") |
| 14 | ★★★ Triple Rare | **Pokémon VMAX** (e.g. "Eevee VMAX") |
| 15 | ★★★ Triple Rare | full-art illustration, **only for Eevee, Umbreon, Leafeon and Sylveon**, and all 4 are the set's exclusives |

Details to watch:

- **Two different base cards per Pokémon, interleaved.** Versions 01–12 aren't 12 treatments of one card. They are two different cards, A and B (different art, abilities and attacks), alternating odd and even: A at 01, 03, 05, 07, 09, 11 and B at 02, 04, 06, 08, 10, 12. I checked visually on Eevee and Vaporeon and confirmed it on all 9 Pokémon by comparing the artwork. Chen's data gives A and B the same name ("Vaporeon"), so the JSON can't tell them apart; a page that wants to label them has to use the version's odd/even parity.
- **Rare repeats at a non-contiguous version.** Rare covers versions 09, 10 **and 13**, with Double Rare (11–12) in between. The V card is Rare, as Vol 3's ex cards were, which the official chart confirms (27 ★ = 18 regular Rares + 9 V). `computeRarityVersionLabels` should therefore produce "09, 10, 13" for Rare. A "09–13" range would wrongly cover 11–12.
- **Names change inside a Pokémon block:** "Eevee" → "Eevee V" → "Eevee VMAX" → "Eevee" (v15). The normal adjacency grouping handles this, because it groups by prefix rather than name, so the Pokémon blocks must **not** be in `catalogGroups`.
- **Mixed denominators affect the shared engine.** `buildGemSetData` takes `versionsPerMon` from the first group and `versionSuffix` from the first card. With cards sorted by number, the first group is Eevee (15 versions, `/15`), so both will say 15, which is wrong for Vaporeon, Jolteon, Flareon, Espeon and Glaceon (`/14`). Each card's own `suffix` is still right, since it's read per card. The route config will likely need to override the hero copy and odds-table labels, as Vol 3's does.

### Trainer block: catalog group 10, `10VV/04`

Four different cards, not versions of one: **Poké Ball**, **Level Ball** and **Quick Ball** (★★ Double Rare, Items) and **Penny** (★★★ Triple Rare, full-art Supporter).

### Energy block: catalog group 11, `11VV/06`

Six Triple Rares: three basic Energy types, each printed twice, and the two printings of a type are **not adjacent**. They interleave L, P, D, L, P, D:

- Basic Lightning Energy: **1101** and **1104**
- Basic Psychic Energy: **1102** and **1105**
- Basic Darkness Energy: **1103** and **1106**

That interleaving is why groups 10 and 11 are in `catalogGroups: [10, 11]` (the same mechanism as Vol 3's `[19, 20]`), so the engine groups them by matching name instead of adjacency. In Chen's images, 1105 and 1106 carry the Gem Pack stamp.

Note that the Trainer and Energy groups here are **10 and 11**, not 19 and 20 as in Vol 3.

### Rarity counts and odds

| Rarity | Symbol | Cards | Which cards | Production ratio |
|---|---|---|---|---|
| Common | ● | 36 | v01–04 × 9 | 50.00% |
| Uncommon | ◆ | 36 | v05–08 × 9 | 25.00% |
| Rare | ★ | 27 | v09–10 × 9 + 9 V | 18.13% |
| Double Rare | ★★ | 21 | v11–12 × 9 + 3 Ball Trainers | 4.70% |
| Triple Rare | ★★★ | 20 | 9 VMAX + 4 v15 full arts + Penny + 6 Energies | 2.17% (combined) |

From the official pokemon.cn chart (https://www.pokemon.cn/tcg/product/15518.html; the image is Pokémon's own, so it isn't included). These odds differ from every later set: Rare is 18.13% (Vol 3: 18.42%), Double Rare 4.70% (Vol 3: 4.77%) and Triple Rare 2.17% (Vols 3–6: 1.81%). The chart splits the 20 Triple Rares into **13 Pokémon holos** (9 VMAX + 4 full arts), **4 non-gold-foil** and **3 gold-foil** holos. The last 7 are Penny plus the 6 Energies, but neither Chen nor the chart says which 3 are gold-foil, so confirm against physical cards before labeling any of them.

## Chase cards and exclusives

Chen flags **four** cards as exclusive to Gem Vol 2: the four version-15 full arts, which are also the only version-15 cards in the set. All four are by the same illustrator (HYOGONOSUKE) and share one soft, sunlit-forest style:

| No. | Card | Art |
|---|---|---|
| 0115/15 | Eevee | sitting in a sunny meadow of yellow flowers |
| 0615/15 | Umbreon | lying in the grass under trees |
| 0715/15 | Leafeon | resting on a tree branch among falling leaves |
| 0915/15 | Sylveon | prancing through a bright meadow |

Other cards collectors are likely to chase (my read, not a Chen flag): the **9 VMAX** cards (version 14), especially **Umbreon VMAX** and **Sylveon VMAX**, and the **Penny** full-art Supporter.

All 140 images are 300×419. None are oversized, unlike Vols 3, 4, 6 and 7.

## Color theme

Measured from the card images and set logo; the hex values are approximate.

- **Set logo / Gem Pack brand:** the same magenta as Vols 3–6. Main `#C21774`, bright `#DE057B`, soft `#D65BA1`.
- **Overall card palette:** a full **rainbow, one hue per Eeveelution**, with no single color dominating. Overall swatches: navy `#25425C`, teal `#418890`, aqua `#70B2AD`, mint `#AFC9BA`, mauve `#84505C` and tan `#AB8B7B`.
- **Chase cards (V, VMAX, full arts):** softer and sunlit: sage `#B9C0A1`, forest teal `#568687`, aqua `#76B4B3`, coral `#CE8C6E`, slate `#324855` and warm cream `#DFBF90`.
- **Frame color by Pokémon** (version 01): each Pokémon has its own type color, which works as a ready-made per-row accent:
  - 01 Eevee, silver `#DDDBD6`
  - 02 Vaporeon, blue `#43A9D2`
  - 03 Jolteon, yellow `#E8CC1E`
  - 04 Flareon, orange-red `#DA6F45`
  - 05 Espeon, purple `#955596`
  - 06 Umbreon, deep teal `#247B90`
  - 07 Leafeon, green `#89B645`
  - 08 Glaceon, ice blue `#3DAAD4`
  - 09 Sylveon, pink `#CF5591`
- **Suggested page accents:** Gem Pack magenta as the main accent (it sits right next to Sylveon's pink), with a soft forest teal (`#568687`) or sunlit sage as the second color, echoing the four exclusives. Each Eeveelution row could also take its own type color as a thin rule or chip. That gives this set a colorful identity distinct from Vol 3 (night navy and lantern), Vol 4 (coral), Vol 5 (gold), Vol 6 (green) and Vol 7 (plum and blue).

## Files

- `src/data/gem-vol-2.json`: same schema as `gem-vol-3.json`, including `catalogGroups: [10, 11]`. 140 cards, sorted by number. Chen's page lists the Trainer and Energy blocks first, then the `/14` Pokémon, then the `/15` Pokémon. The `image` fields are placeholder R2 paths (`Chinese/Gem 2/Cards/NNNN.webp`).
- `gem-vol-2-images/cards/NNNN.webp`: all 140 card images, 300×419, the largest Chen serves.

## Appendix: full card list

The "base card A/B" notes come from visual inspection, not Chen's data.

| No. | Card | Rarity | Note |
|---|---|---|---|
| 0101/15 | Eevee | ● Common | base card A |
| 0102/15 | Eevee | ● Common | base card B |
| 0103/15 | Eevee | ● Common | base card A |
| 0104/15 | Eevee | ● Common | base card B |
| 0105/15 | Eevee | ◆ Uncommon | base card A |
| 0106/15 | Eevee | ◆ Uncommon | base card B |
| 0107/15 | Eevee | ◆ Uncommon | base card A |
| 0108/15 | Eevee | ◆ Uncommon | base card B |
| 0109/15 | Eevee | ★ Rare | base card A |
| 0110/15 | Eevee | ★ Rare | base card B |
| 0111/15 | Eevee | ★★ Double Rare | base card A |
| 0112/15 | Eevee | ★★ Double Rare | base card B |
| 0113/15 | Eevee V | ★ Rare | V |
| 0114/15 | Eevee VMAX | ★★★ Triple Rare | VMAX |
| 0115/15 | Eevee | ★★★ Triple Rare | full art, exclusive |
| 0201/14 | Vaporeon | ● Common | base card A |
| 0202/14 | Vaporeon | ● Common | base card B |
| 0203/14 | Vaporeon | ● Common | base card A |
| 0204/14 | Vaporeon | ● Common | base card B |
| 0205/14 | Vaporeon | ◆ Uncommon | base card A |
| 0206/14 | Vaporeon | ◆ Uncommon | base card B |
| 0207/14 | Vaporeon | ◆ Uncommon | base card A |
| 0208/14 | Vaporeon | ◆ Uncommon | base card B |
| 0209/14 | Vaporeon | ★ Rare | base card A |
| 0210/14 | Vaporeon | ★ Rare | base card B |
| 0211/14 | Vaporeon | ★★ Double Rare | base card A |
| 0212/14 | Vaporeon | ★★ Double Rare | base card B |
| 0213/14 | Vaporeon V | ★ Rare | V |
| 0214/14 | Vaporeon VMAX | ★★★ Triple Rare | VMAX |
| 0301/14 | Jolteon | ● Common | base card A |
| 0302/14 | Jolteon | ● Common | base card B |
| 0303/14 | Jolteon | ● Common | base card A |
| 0304/14 | Jolteon | ● Common | base card B |
| 0305/14 | Jolteon | ◆ Uncommon | base card A |
| 0306/14 | Jolteon | ◆ Uncommon | base card B |
| 0307/14 | Jolteon | ◆ Uncommon | base card A |
| 0308/14 | Jolteon | ◆ Uncommon | base card B |
| 0309/14 | Jolteon | ★ Rare | base card A |
| 0310/14 | Jolteon | ★ Rare | base card B |
| 0311/14 | Jolteon | ★★ Double Rare | base card A |
| 0312/14 | Jolteon | ★★ Double Rare | base card B |
| 0313/14 | Jolteon V | ★ Rare | V |
| 0314/14 | Jolteon VMAX | ★★★ Triple Rare | VMAX |
| 0401/14 | Flareon | ● Common | base card A |
| 0402/14 | Flareon | ● Common | base card B |
| 0403/14 | Flareon | ● Common | base card A |
| 0404/14 | Flareon | ● Common | base card B |
| 0405/14 | Flareon | ◆ Uncommon | base card A |
| 0406/14 | Flareon | ◆ Uncommon | base card B |
| 0407/14 | Flareon | ◆ Uncommon | base card A |
| 0408/14 | Flareon | ◆ Uncommon | base card B |
| 0409/14 | Flareon | ★ Rare | base card A |
| 0410/14 | Flareon | ★ Rare | base card B |
| 0411/14 | Flareon | ★★ Double Rare | base card A |
| 0412/14 | Flareon | ★★ Double Rare | base card B |
| 0413/14 | Flareon V | ★ Rare | V |
| 0414/14 | Flareon VMAX | ★★★ Triple Rare | VMAX |
| 0501/14 | Espeon | ● Common | base card A |
| 0502/14 | Espeon | ● Common | base card B |
| 0503/14 | Espeon | ● Common | base card A |
| 0504/14 | Espeon | ● Common | base card B |
| 0505/14 | Espeon | ◆ Uncommon | base card A |
| 0506/14 | Espeon | ◆ Uncommon | base card B |
| 0507/14 | Espeon | ◆ Uncommon | base card A |
| 0508/14 | Espeon | ◆ Uncommon | base card B |
| 0509/14 | Espeon | ★ Rare | base card A |
| 0510/14 | Espeon | ★ Rare | base card B |
| 0511/14 | Espeon | ★★ Double Rare | base card A |
| 0512/14 | Espeon | ★★ Double Rare | base card B |
| 0513/14 | Espeon V | ★ Rare | V |
| 0514/14 | Espeon VMAX | ★★★ Triple Rare | VMAX |
| 0601/15 | Umbreon | ● Common | base card A |
| 0602/15 | Umbreon | ● Common | base card B |
| 0603/15 | Umbreon | ● Common | base card A |
| 0604/15 | Umbreon | ● Common | base card B |
| 0605/15 | Umbreon | ◆ Uncommon | base card A |
| 0606/15 | Umbreon | ◆ Uncommon | base card B |
| 0607/15 | Umbreon | ◆ Uncommon | base card A |
| 0608/15 | Umbreon | ◆ Uncommon | base card B |
| 0609/15 | Umbreon | ★ Rare | base card A |
| 0610/15 | Umbreon | ★ Rare | base card B |
| 0611/15 | Umbreon | ★★ Double Rare | base card A |
| 0612/15 | Umbreon | ★★ Double Rare | base card B |
| 0613/15 | Umbreon V | ★ Rare | V |
| 0614/15 | Umbreon VMAX | ★★★ Triple Rare | VMAX |
| 0615/15 | Umbreon | ★★★ Triple Rare | full art, exclusive |
| 0701/15 | Leafeon | ● Common | base card A |
| 0702/15 | Leafeon | ● Common | base card B |
| 0703/15 | Leafeon | ● Common | base card A |
| 0704/15 | Leafeon | ● Common | base card B |
| 0705/15 | Leafeon | ◆ Uncommon | base card A |
| 0706/15 | Leafeon | ◆ Uncommon | base card B |
| 0707/15 | Leafeon | ◆ Uncommon | base card A |
| 0708/15 | Leafeon | ◆ Uncommon | base card B |
| 0709/15 | Leafeon | ★ Rare | base card A |
| 0710/15 | Leafeon | ★ Rare | base card B |
| 0711/15 | Leafeon | ★★ Double Rare | base card A |
| 0712/15 | Leafeon | ★★ Double Rare | base card B |
| 0713/15 | Leafeon V | ★ Rare | V |
| 0714/15 | Leafeon VMAX | ★★★ Triple Rare | VMAX |
| 0715/15 | Leafeon | ★★★ Triple Rare | full art, exclusive |
| 0801/14 | Glaceon | ● Common | base card A |
| 0802/14 | Glaceon | ● Common | base card B |
| 0803/14 | Glaceon | ● Common | base card A |
| 0804/14 | Glaceon | ● Common | base card B |
| 0805/14 | Glaceon | ◆ Uncommon | base card A |
| 0806/14 | Glaceon | ◆ Uncommon | base card B |
| 0807/14 | Glaceon | ◆ Uncommon | base card A |
| 0808/14 | Glaceon | ◆ Uncommon | base card B |
| 0809/14 | Glaceon | ★ Rare | base card A |
| 0810/14 | Glaceon | ★ Rare | base card B |
| 0811/14 | Glaceon | ★★ Double Rare | base card A |
| 0812/14 | Glaceon | ★★ Double Rare | base card B |
| 0813/14 | Glaceon V | ★ Rare | V |
| 0814/14 | Glaceon VMAX | ★★★ Triple Rare | VMAX |
| 0901/15 | Sylveon | ● Common | base card A |
| 0902/15 | Sylveon | ● Common | base card B |
| 0903/15 | Sylveon | ● Common | base card A |
| 0904/15 | Sylveon | ● Common | base card B |
| 0905/15 | Sylveon | ◆ Uncommon | base card A |
| 0906/15 | Sylveon | ◆ Uncommon | base card B |
| 0907/15 | Sylveon | ◆ Uncommon | base card A |
| 0908/15 | Sylveon | ◆ Uncommon | base card B |
| 0909/15 | Sylveon | ★ Rare | base card A |
| 0910/15 | Sylveon | ★ Rare | base card B |
| 0911/15 | Sylveon | ★★ Double Rare | base card A |
| 0912/15 | Sylveon | ★★ Double Rare | base card B |
| 0913/15 | Sylveon V | ★ Rare | V |
| 0914/15 | Sylveon VMAX | ★★★ Triple Rare | VMAX |
| 0915/15 | Sylveon | ★★★ Triple Rare | full art, exclusive |
| 1001/04 | Poké Ball | ★★ Double Rare | Item |
| 1002/04 | Level Ball | ★★ Double Rare | Item |
| 1003/04 | Quick Ball | ★★ Double Rare | Item |
| 1004/04 | Penny | ★★★ Triple Rare | Supporter, full art |
| 1101/06 | Basic Lightning Energy | ★★★ Triple Rare | printing 1 |
| 1102/06 | Basic Psychic Energy | ★★★ Triple Rare | printing 1 |
| 1103/06 | Basic Darkness Energy | ★★★ Triple Rare | printing 1 |
| 1104/06 | Basic Lightning Energy | ★★★ Triple Rare | printing 2 |
| 1105/06 | Basic Psychic Energy | ★★★ Triple Rare | printing 2 |
| 1106/06 | Basic Darkness Energy | ★★★ Triple Rare | printing 2 |
