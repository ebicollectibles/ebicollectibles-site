# 30th Celebration: sourcing notes

Source: https://www.chencards.com/sets/30th_celebration (Chen Cards, used with permission), fetched 2026-11-11.

## Set facts

- Name: **30th Celebration** (logo: "30th CELEBRATION" with "30周年庆典", the 30th anniversary celebration)
- Official set code: **30thC**, printed as the "30th C" set mark on the cards
- Series / era: an **official 30th-anniversary special set**, current era (the cards carry regulation mark **J** and modern "ex" frames). It isn't a numbered main expansion, and it isn't a Gem Pack. Chen files it under its **"New Release"** heading, not "Chinese Scarlet & Violet Series" or "Gem Set". The JSON's `series` is "30th Anniversary Special Set", since "New Release" is a Chen section label, not a series.
- Language: Simplified Chinese
- Release: **2026-09-16**
- **206 cards on Chen's page**, made up of three different numbering systems:
  - **165 numbered set cards**, `001/103`–`165/103` (printed total **103**; 104–165 are secret rares)
  - **8 basic Energy cards** that Chen labels `No. 166`–`No. 173`. The cards themselves don't seem to print a collector number; the footer shows only the set mark, the "GRA" mark and the illustrator. So 166–173 is Chen's numbering, not printed.
  - **33 promos** numbered `001/30th-P`–`033/30th-P` (a separate **PROMO** series; Chen hosts them in a separate "30th-celebration-promos" image folder)
- **No pack-odds chart** and no cards-per-pack figure on Chen.
- **4 cards had no image on Chen**: 119/103 Kommo-o (Art Rare (AR)), 128/103 Mewtwo ex (Special Art Rare (SAR)), 129/103 Mew ex (Special Art Rare (SAR)), 131/103 Gengar ex (Special Art Rare (SAR)).
  - **119 is now filled in** from the official Pokémon China 30th campaign page (https://campaign-30th.pokemon.cn/products/30th-celebration/), resized to 300×419 to match the rest of the folder. That's the only image added; every other image is still Chen's original.
  - **128, 129 and 131 are still `null`** with no file. Pokémon China's official card list left exactly these three out when it was published (52Poke notes the same: they were revealed only at launch), and Chen, the official campaign page and 52Poke all have no image for them. Render a placeholder until a real scan is available.

## Rarity tiers, most common to rarest

| Rank | Tier (Chen's exact string) | Abbr. | Cards | Where |
|---|---|---|---|---|
| 1 | Common (C) | C | 45 | 001–103 (Pokémon and the 3 Trainers 101–103) |
| 2 | Rare (R) | R | 18 | 001–103 |
| 3 | Pikachu Rare | none (Chen gives no abbreviation) | 30 | **017–046**: 30 different Pikachu, one unbroken run |
| 4 | Double Rare (RR) | RR | 10 | 001–103 (the ex) |
| 5 | Art Rare (AR) | AR | 20 | 104–123 |
| 6 | Special Art Rare (SAR) | SAR | 10 | 124–133 |
| 7 | Futuristic Rare (FUR) | FUR | 2 | 134–135 |
| | **no rarity on Chen** (`null`) | | **71** | 136–165 (30 classic reprints), the 8 Energy, the 33 promos |
| | **Total** | | **206** | |

Things to watch in this table:

- **There's no Uncommon tier.** The main set goes straight from Common to Rare.
- **"Pikachu Rare" is a set-specific tier** that exists only here: 30 Pikachu cards (017–046), each with its own art and a Pikachu-face holo pattern. There's no odds chart, so **its rank is a guess.** I've put it between Rare and Double Rare because it sits in the main set (001–103) and isn't a secret rare. **Check the box insert before showing an odds table.** Chen's string has no abbreviation in parentheses, unlike the other tiers.
- **Futuristic Rare (FUR)** is also specific to this set: Mewtwo ex and Mew ex in a distinct "futuristic" treatment, numbered right after the SARs, so it's likely the top **named** tier. **Unconfirmed without a chart.**
- **71 cards have rarity `null`** in Chen's data, and I left them `null` rather than invent a tier:
  - **136–165 Classic collection:** 30 reprints of famous cards from the TCG's history, in their original frames (Base Set-style Pikachu and Charizard, Gym-era owner cards, Shining, Dark, old-style ex, LV.X, SP, LEGEND, EX, Mega, BREAK, GX, TAG TEAM, V, VMAX, VSTAR …) with a gold-glitter border and a 30th-anniversary Pikachu stamp. Their footers show the set mark and number (e.g. `30th C 136/103`) but **no readable rarity symbol**, and some of the later ones carry a regulation letter (C, E, F, G) from the card they reprint. They're numbered after the FUR cards and are probably the set's rarest pulls, but **their tier is unknown.**
  - **The 8 basic Energy** and **the 33 promos**: promos normally have no rarity (the footer shows **PROMO**).
- **Code and engine impact:** `rarityOrder` lists only the 7 named tiers, using Chen's exact strings. Anything that assumes every card's `rarity` is a string that appears in `rarityOrder` will break on the 71 `null`s. Add a "Classic" / "Promo" / "Energy" display label in the page config rather than changing the data.

## Structure: a flat official catalog, like Black Bolt and White Flare, with extra irregularities

**This is not a Gem-style ladder.** No Pokémon's rarer versions sit at adjacent or prefix-matching numbers. Rarer versions are scattered at unrelated numbers and can only be matched **by name**, the same as Black Bolt and White Flare, e.g. Mewtwo ex is 055 (RR), 128 (SAR) and 134 (FUR); Lapras is 011 (C) and 106 (AR).

| Numbers | Block | Cards | Rarity |
|---|---|---|---|
| 001–100 | Pokémon, grouped by type (Grass, Fire, Water, Lightning, Psychic, …) | 100 | C, R, Pikachu Rare, RR |
| 017–046 | (inside the above) the **30-card Pikachu Rare run**, all named "Pikachu" | 30 | Pikachu Rare |
| 101–103 | Trainers: Poké Pad, Switch, Ultra Ball | 3 | C |
| 104–123 | Art Rares of main-set Pokémon | 20 | AR |
| 124–133 | Special Art Rares of the main-set ex | 10 | SAR |
| 134–135 | Futuristic Rares: Mewtwo ex, Mew ex | 2 | FUR |
| 136–165 | Classic collection reprints | 30 | `null` |
| "No. 166"–"No. 173" | Basic Energy (Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal) | 8 | `null` |
| 001/30th-P–033/30th-P | Promos: 27 starter Pokémon (Bulbasaur → Quaxly, all 9 generations) + 6 ex | 33 | `null` |

Irregularities beyond Black Bolt and White Flare:

- **Three numbering systems on one page:** `NNN/103`, Chen's `No. NNN` for the Energy, and `NNN/30th-P` for the promos. **Promo numbers collide with set numbers** (`001/30th-P` Bulbasaur vs `001/103` Exeggcute), so any lookup needs the full string.
- **Heavy name duplication:** **"Pikachu" appears 31 times** (the 30 Pikachu Rares + 136 classic Pikachu), **"Pikachu ex" 6 times** (047, 048, 126, 127, promos 030 and 031), Lugia twice (097 R, 142 classic), Gengar ex/Gengar, and so on. Matching "other versions" by name will produce big groups; Pikachu would need special handling.
- **One card split over two numbers:** **151 and 152 are both "Darkrai & Cresselia LEGEND"**, the two halves of one LEGEND card. A page should show them side by side, not as duplicates.
- **The two Pikachu ex pairs:** 047 and 048 are **two different** Pikachu ex cards (different attacks). From the attack text, SAR **126 reprints 047** and **127 reprints 048**.

### Will the existing Gem Set engine render it as-is? **No.**

For the same reasons as Black Bolt and White Flare, plus more:

- `buildGemSetData` takes `id = number.slice(0, 4)` and `groupId = id.slice(0, 2)`. `"001/103"` gives id `"001/"` and dumps 001–009 into one group; `"001/30th-P"` gives the **same id `"001/"`** as the set card, so `cardById` would overwrite one with the other; and `"No. 166"` gives id `"No. "` for all 8 Energy, collapsing them into one entry.
- The per-Pokémon ladder rows, derived rarity-version labels, hero copy and odds table all assume the Gem shape.
- `rarity: null` (71 cards) and `image: null` (3 cards) aren't expected by the Gem types.
- **What it needs:** the same flat-catalog page that Black Bolt and White Flare need (numbered checklist, rarity filter, "other versions" by name), plus display labels for the unrated blocks, a promo tab or section, and a placeholder for missing images. If that page gets built for Black Bolt and White Flare first, 30th Celebration can reuse it.

### How the JSON maps onto the Black Bolt / White Flare schema

- Same top-level fields as `black-bolt.json`, and the same card fields (`number`, `pokemonIndex`, `version`, `name`, `rarity`, `image`). No `catalogGroups`.
- **`number`** is Chen's string, exactly: `001/103`, `No. 166`, `001/30th-P`.
- **`pokemonIndex`** is the collector number for set cards (1–165) and Chen's number for the Energy (166–173). For the promos it's **`1000 + promo number` (1001–1033)**, a value **I made up** so it doesn't collide with set cards 1–33. **`version` = 1** throughout. Cards are sorted by `pokemonIndex`: set, then Energy, then promos.
- **`rarity`** is Chen's exact string or **`null`**, see above.
- **`image`** is the placeholder path `Chinese/30th Celebration/Cards/NNNN.webp` for set and Energy cards (zero-padded `0001`–`0173`) and `…/PNNN.webp` for promos (`P001`–`P033`), or **`null`** for the 4 cards with no image on Chen. Filenames in `30th-celebration-images/cards/` match.
- **`exclusiveCardNumbers`** is `["121/103"]`, from Chen.

## Chinese-exclusive card

- **121/103 Ditto (Art Rare)** is the only card Chen flags. Chen's own note: *"English only has this as a promo, handed out rather than packed. Here it is part of the set, so it comes out of boxes."* (heading: "Can be pulled from 30th Celebration"). So it isn't exclusive art: it's a card that **English only released as a give-away promo**, but in the Chinese set it's a normal pull from boxes. Phrase it on the page as "pullable here", not "Chinese-only art".
- No other card is flagged. The 33 `30th-P` promos aren't marked exclusive.
- Image sizes: everything is 300×419 except **15 promos at 320×447**: P007–P009, P016–P018 and P025–P033. Those are the two starter trios plus the 6 ex promos.

## Suggested hero theme colors

The box and logo are all **anniversary gold**: the logo is gold lettering (`#FDE57D` → `#DEB961` → `#9B7132`) with a deep chocolate outline (`#5A2D05`), and the 30 classic reprints all wear a **gold-glitter border** (average `#C5A84C`). Pikachu yellow (`#F7DE2C`) runs through the 30 Pikachu Rares.

- **Primary, celebration gold `#DEB961`:** fills, badges and rules. It's too light for text on white.
- **Secondary, deep cocoa `#5A2D05`:** the hero background or text-weight accent. It reads well as text on white and makes the gold glow, matching the logo's own outline.

That sets it apart from the Gem sets (magenta) and from Black Bolt and White Flare (black and blue, white and red).

## Top chase cards: suggested hero fan (5)

| Position | Card | Why |
|---|---|---|
| center | **126/103 Pikachu ex SAR** | the anniversary mascot at the set's main SAR tier, a crowded celebration-parade scene |
| inner left | **134/103 Mewtwo ex FUR** | top named tier, unique "Futuristic" treatment |
| inner right | **135/103 Mew ex FUR** | the other FUR, pairs with Mewtwo |
| outer left | **137/103 Charizard (classic)** | the most recognizable card in the TCG's history, in its original-style frame |
| outer right | **121/103 Ditto AR** | the one card Chen flags (promo-only in English, pullable here) |

Alternatives: 127/103 (the other Pikachu ex SAR), 141 Shining Celebi or 160 Pikachu & Zekrom-GX from the classic block, and the Charizard-free option 136 classic Pikachu. **Don't** use 128 Mewtwo ex SAR, 129 Mew ex SAR or 131 Gengar ex SAR: they have no image yet.

## Files

- `src/data/30th-celebration.json`: 206 cards, schema as above.
- `30th-celebration-images/cards/`: 203 images (`0001`–`0173`, `P001`–`P033`); 128, 129 and 131 are missing.

## Appendix: full card list

| No. | Card | Rarity | Reprint / alt-art of | Note |
|---|---|---|---|---|
| 001/103 | Exeggcute | Common (C) |  | Pokémon |
| 002/103 | Alolan Exeggutor | Common (C) |  | Pokémon |
| 003/103 | Volbeat | Common (C) |  | Pokémon |
| 004/103 | Illumise | Common (C) |  | Pokémon |
| 005/103 | Vivillon | Common (C) |  | Pokémon |
| 006/103 | Moltres | Common (C) |  | Pokémon |
| 007/103 | Ho-Oh | Rare (R) |  | Pokémon |
| 008/103 | Reshiram | Rare (R) |  | Pokémon |
| 009/103 | Fuecoco ex | Double Rare (RR) |  | Pokémon ex |
| 010/103 | Slowpoke | Common (C) |  | Pokémon |
| 011/103 | Lapras | Common (C) |  | Pokémon |
| 012/103 | Articuno | Common (C) |  | Pokémon |
| 013/103 | Kyogre | Rare (R) |  | Pokémon |
| 014/103 | Palkia | Rare (R) |  | Pokémon |
| 015/103 | Greninja ex | Double Rare (RR) |  | Pokémon ex |
| 016/103 | Wishiwashi | Common (C) |  | Pokémon |
| 017/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 018/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 019/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 020/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 021/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 022/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 023/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 024/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 025/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 026/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 027/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 028/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 029/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 030/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 031/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 032/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 033/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 034/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 035/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 036/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 037/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 038/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 039/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 040/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 041/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 042/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 043/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 044/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 045/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 046/103 | Pikachu | Pikachu Rare |  | Pokémon |
| 047/103 | Pikachu ex | Double Rare (RR) |  | Pokémon ex |
| 048/103 | Pikachu ex | Double Rare (RR) |  | Pokémon ex |
| 049/103 | Zapdos | Common (C) |  | Pokémon |
| 050/103 | Zekrom | Rare (R) |  | Pokémon |
| 051/103 | Toxtricity | Common (C) |  | Pokémon |
| 052/103 | Morpeko | Common (C) |  | Pokémon |
| 053/103 | Miraidon | Rare (R) |  | Pokémon |
| 054/103 | Mewtwo | Rare (R) |  | Pokémon |
| 055/103 | Mewtwo ex | Double Rare (RR) |  | Pokémon ex |
| 056/103 | Mew | Rare (R) |  | Pokémon |
| 057/103 | Mew ex | Double Rare (RR) |  | Pokémon ex |
| 058/103 | Espeon | Common (C) |  | Pokémon |
| 059/103 | Sylveon ex | Double Rare (RR) |  | Pokémon ex |
| 060/103 | Unown | Common (C) |  | Pokémon |
| 061/103 | Drifloon | Common (C) |  | Pokémon |
| 062/103 | Chandelure | Common (C) |  | Pokémon |
| 063/103 | Xerneas | Rare (R) |  | Pokémon |
| 064/103 | Cosmog | Common (C) |  | Pokémon |
| 065/103 | Cosmoem | Common (C) |  | Pokémon |
| 066/103 | Lunala | Rare (R) |  | Pokémon |
| 067/103 | Gimmighoul | Common (C) |  | Pokémon |
| 068/103 | Groudon | Rare (R) |  | Pokémon |
| 069/103 | Lucario | Common (C) |  | Pokémon |
| 070/103 | Seismitoad | Common (C) |  | Pokémon |
| 071/103 | Lycanroc | Common (C) |  | Pokémon |
| 072/103 | Koraidon | Rare (R) |  | Pokémon |
| 073/103 | Nidoran ♀ | Common (C) |  | Pokémon |
| 074/103 | Nidorina | Common (C) |  | Pokémon |
| 075/103 | Alolan Meowth | Common (C) |  | Pokémon |
| 076/103 | Gengar ex | Double Rare (RR) |  | Pokémon ex |
| 077/103 | Umbreon | Common (C) |  | Pokémon |
| 078/103 | Scraggy | Common (C) |  | Pokémon |
| 079/103 | Yveltal | Rare (R) |  | Pokémon |
| 080/103 | Galarian Meowth | Common (C) |  | Pokémon |
| 081/103 | Jirachi ex | Double Rare (RR) |  | Pokémon ex |
| 082/103 | Dialga | Rare (R) |  | Pokémon |
| 083/103 | Ferrothorn | Common (C) |  | Pokémon |
| 084/103 | Solgaleo | Rare (R) |  | Pokémon |
| 085/103 | Zacian | Rare (R) |  | Pokémon |
| 086/103 | Zamazenta | Rare (R) |  | Pokémon |
| 087/103 | Gholdengo | Common (C) |  | Pokémon |
| 088/103 | Salamence ex | Double Rare (RR) |  | Pokémon ex |
| 089/103 | Jangmo-o | Common (C) |  | Pokémon |
| 090/103 | Hakamo-o | Common (C) |  | Pokémon |
| 091/103 | Kommo-o | Common (C) |  | Pokémon |
| 092/103 | Meowth | Common (C) |  | Pokémon |
| 093/103 | Ditto | Common (C) |  | Pokémon |
| 094/103 | Eevee | Common (C) |  | Pokémon |
| 095/103 | Snorlax | Common (C) |  | Pokémon |
| 096/103 | Igglybuff | Common (C) |  | Pokémon |
| 097/103 | Lugia | Rare (R) |  | Pokémon |
| 098/103 | Hisuian Zorua | Common (C) |  | Pokémon |
| 099/103 | Hisuian Zoroark | Common (C) |  | Pokémon |
| 100/103 | Maushold | Common (C) |  | Pokémon |
| 101/103 | Poké Pad | Common (C) |  | Trainer (Item) |
| 102/103 | Switch | Common (C) |  | Trainer (Item) |
| 103/103 | Ultra Ball | Common (C) |  | Trainer (Item) |
| 104/103 | Alolan Exeggutor | Art Rare (AR) | Alolan Exeggutor 002/103 |  |
| 105/103 | Moltres | Art Rare (AR) | Moltres 006/103 |  |
| 106/103 | Lapras | Art Rare (AR) | Lapras 011/103 |  |
| 107/103 | Articuno | Art Rare (AR) | Articuno 012/103 |  |
| 108/103 | Zapdos | Art Rare (AR) | Zapdos 049/103 |  |
| 109/103 | Toxtricity | Art Rare (AR) | Toxtricity 051/103 |  |
| 110/103 | Morpeko | Art Rare (AR) | Morpeko 052/103 |  |
| 111/103 | Drifloon | Art Rare (AR) | Drifloon 061/103 |  |
| 112/103 | Chandelure | Art Rare (AR) | Chandelure 062/103 |  |
| 113/103 | Lycanroc | Art Rare (AR) | Lycanroc 071/103 |  |
| 114/103 | Nidorina | Art Rare (AR) | Nidorina 074/103 |  |
| 115/103 | Alolan Meowth | Art Rare (AR) | Alolan Meowth 075/103 |  |
| 116/103 | Scraggy | Art Rare (AR) | Scraggy 078/103 |  |
| 117/103 | Galarian Meowth | Art Rare (AR) | Galarian Meowth 080/103 |  |
| 118/103 | Gholdengo | Art Rare (AR) | Gholdengo 087/103 |  |
| 119/103 | Kommo-o | Art Rare (AR) | Kommo-o 091/103 | image from the official Pokémon China campaign page (none on Chen) |
| 120/103 | Meowth | Art Rare (AR) | Meowth 092/103 |  |
| 121/103 | Ditto | Art Rare (AR) | Ditto 093/103 | **flagged by Chen** (promo-only in English) |
| 122/103 | Hisuian Zorua | Art Rare (AR) | Hisuian Zorua 098/103 |  |
| 123/103 | Maushold | Art Rare (AR) | Maushold 100/103 |  |
| 124/103 | Fuecoco ex | Special Art Rare (SAR) | Fuecoco ex 009/103 |  |
| 125/103 | Greninja ex | Special Art Rare (SAR) | Greninja ex 015/103 |  |
| 126/103 | Pikachu ex | Special Art Rare (SAR) | Pikachu ex 047/103 (matched by attack text) |  |
| 127/103 | Pikachu ex | Special Art Rare (SAR) | Pikachu ex 048/103 (matched by attack text) |  |
| 128/103 | Mewtwo ex | Special Art Rare (SAR) | Mewtwo ex 055/103 | **no image on Chen** |
| 129/103 | Mew ex | Special Art Rare (SAR) | Mew ex 057/103 | **no image on Chen** |
| 130/103 | Sylveon ex | Special Art Rare (SAR) | Sylveon ex 059/103 |  |
| 131/103 | Gengar ex | Special Art Rare (SAR) | Gengar ex 076/103 | **no image on Chen** |
| 132/103 | Jirachi ex | Special Art Rare (SAR) | Jirachi ex 081/103 |  |
| 133/103 | Salamence ex | Special Art Rare (SAR) | Salamence ex 088/103 |  |
| 134/103 | Mewtwo ex | Futuristic Rare (FUR) | Mewtwo ex 055/103 |  |
| 135/103 | Mew ex | Futuristic Rare (FUR) | Mew ex 057/103 |  |
| 136/103 | Pikachu | `null` |  | classic reprint: classic Pikachu, original-style frame |
| 137/103 | Charizard | `null` |  | classic reprint: classic Charizard, original-style frame |
| 138/103 | Misty | `null` |  | classic reprint: classic Trainer card |
| 139/103 | Erika's Jigglypuff | `null` |  | classic reprint: classic Gym-era owner card |
| 140/103 | Sneasel | `null` |  | classic reprint |
| 141/103 | Shining Celebi | `null` |  | classic reprint: Shining Pokémon |
| 142/103 | Lugia | `null` |  | classic reprint |
| 143/103 | Delcatty | `null` |  | classic reprint |
| 144/103 | Dark Tyranitar | `null` |  | classic reprint: Dark Pokémon |
| 145/103 | Scizor ex | `null` |  | classic reprint: Pokémon ex (old-style) |
| 146/103 | Metagross | `null` |  | classic reprint |
| 147/103 | Palkia LV.X | `null` |  | classic reprint: LV.X |
| 148/103 | Uxie | `null` |  | classic reprint |
| 149/103 | Crobat G | `null` |  | classic reprint: Pokémon SP (G) |
| 150/103 | Gengar | `null` |  | classic reprint |
| 151/103 | Darkrai & Cresselia LEGEND | `null` |  | classic reprint: LEGEND, one half (pairs with 152) |
| 152/103 | Darkrai & Cresselia LEGEND | `null` |  | classic reprint: LEGEND, other half (pairs with 151) |
| 153/103 | N | `null` |  | classic reprint |
| 154/103 | Rayquaza-EX | `null` |  | classic reprint: Pokémon-EX |
| 155/103 | Genesect-EX | `null` |  | classic reprint: Pokémon-EX |
| 156/103 | M Gardevoir-EX | `null` |  | classic reprint: Mega Evolution-EX |
| 157/103 | Greninja BREAK | `null` |  | classic reprint: BREAK |
| 158/103 | Solgaleo-GX | `null` |  | classic reprint: Pokémon-GX |
| 159/103 | Buzzwole-GX | `null` |  | classic reprint: Pokémon-GX |
| 160/103 | Pikachu & Zekrom-GX | `null` |  | classic reprint: TAG TEAM-GX |
| 161/103 | Zacian V | `null` |  | classic reprint: Pokémon V |
| 162/103 | Raikou | `null` |  | classic reprint |
| 163/103 | Mew VMAX | `null` |  | classic reprint: VMAX |
| 164/103 | Arceus VSTAR | `null` |  | classic reprint: VSTAR |
| 165/103 | Magikarp | `null` |  | classic reprint |
| No. 166 | Basic Grass Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 167 | Basic Fire Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 168 | Basic Water Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 169 | Basic Lightning Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 170 | Basic Psychic Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 171 | Basic Fighting Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 172 | Basic Darkness Energy | `null` |  | basic Energy; number assigned by Chen |
| No. 173 | Basic Metal Energy | `null` |  | basic Energy; number assigned by Chen |
| 001/30th-P | Bulbasaur | `null` |  | promo |
| 002/30th-P | Charmander | `null` |  | promo |
| 003/30th-P | Squirtle | `null` |  | promo |
| 004/30th-P | Chikorita | `null` |  | promo |
| 005/30th-P | Cyndaquil | `null` |  | promo |
| 006/30th-P | Totodile | `null` |  | promo |
| 007/30th-P | Treecko | `null` |  | promo |
| 008/30th-P | Torchic | `null` |  | promo |
| 009/30th-P | Mudkip | `null` |  | promo |
| 010/30th-P | Turtwig | `null` |  | promo |
| 011/30th-P | Chimchar | `null` |  | promo |
| 012/30th-P | Piplup | `null` |  | promo |
| 013/30th-P | Snivy | `null` |  | promo |
| 014/30th-P | Tepig | `null` |  | promo |
| 015/30th-P | Oshawott | `null` |  | promo |
| 016/30th-P | Chespin | `null` |  | promo |
| 017/30th-P | Fennekin | `null` |  | promo |
| 018/30th-P | Froakie | `null` |  | promo |
| 019/30th-P | Rowlet | `null` |  | promo |
| 020/30th-P | Litten | `null` |  | promo |
| 021/30th-P | Popplio | `null` |  | promo |
| 022/30th-P | Grookey | `null` |  | promo |
| 023/30th-P | Scorbunny | `null` |  | promo |
| 024/30th-P | Sobble | `null` |  | promo |
| 025/30th-P | Sprigatito | `null` |  | promo |
| 026/30th-P | Fuecoco | `null` |  | promo |
| 027/30th-P | Quaxly | `null` |  | promo |
| 028/30th-P | Espeon ex | `null` |  | promo |
| 029/30th-P | Umbreon ex | `null` |  | promo |
| 030/30th-P | Pikachu ex | `null` |  | promo |
| 031/30th-P | Pikachu ex | `null` |  | promo |
| 032/30th-P | Greninja ex | `null` |  | promo |
| 033/30th-P | Sylveon ex | `null` |  | promo |
