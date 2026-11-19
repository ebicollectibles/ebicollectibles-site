import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv9-5.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/crystal_gathering — see
// csv9-5-notes.md for the full structure/color-theme research this
// config is based on. Chen's own name for it, 太晶盛聚, translates
// literally to "Crystal Gathering" (src/data/csv9-5.json keeps that in
// `source`), but the store's existing product listing calls it
// "Terastal Gathering" — `name` matches that for consistency.
//
// CSV9.5, the ".5" special set between CSV9C and CSV10C (Chasing
// Glory), is the same flat-catalog shape as Black Bolt, White Flare and
// CSV10 (src/data/csv9-5.json sets groupByName: true), and just as
// clean as CSV10 — one numbering system, no null rarities, no missing
// images. It adds one rarity tier CSV10 doesn't have, ACE SPEC Rare
// (see src/lib/gem-sets/rarity.ts), and — as a compilation-style set —
// 11 secret rares with no main-set printing to pair with (they just
// show as a single-version "group", same as any other card with no
// reprint) plus a couple of same-name, same-rarity art variants (two
// Sylveon ex SARs, two Eevee ex SARs, two "Atticus" SRs) that
// groupByName already shows together as multiple versions, same as a
// normal reprint — no engine changes were needed for either case.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/terastal-gathering-csv9-5',
  storageKey: 'csv9-5-have',
  productId: 'pokemon-chinese-terastal-gathering-booster-box',
  // Umbreon ex's SAR (the set's headline chase in this Eeveelution-heavy
  // set) centered, flanked by an Eevee ex SAR, the Chinese-exclusive
  // Sylveon ex SAR, the Terastal legendary, and the gold Pikachu ex UR.
  fanIds: ['245', '239', '234', '248', '258'],
  fanCaption: "The set's top chase cards",
  // Deep Tera teal and coral, from the set's own Tera-crystal rainbow
  // logo — distinct from CSV10 (orange/ember-black), Black Bolt/White
  // Flare and 30th Celebration (gold/cocoa).
  glow1: 'rgb(71 118 121 / .30)',
  glow2: 'rgb(216 123 115 / .25)',
  heroLede:
    "All 259 cards in Terastal Gathering (CSV9.5C). The 208-card main set has 156 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, including 8 pink-framed ACE SPEC cards. Secret rares run from 209 to 259: Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "156",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–153 (mixed)",
    "Uncommon (U)": "002–207 (mixed)",
    "Rare (R)": "008–188 (mixed)",
    "Double Rare (RR)": "006–156 (mixed)",
    "ACE SPEC Rare (ACE)": "163, 166, 168, 169, 172, 179, 205, 208",
    "Super Rare (SR)": "209–220",
    "Special Art Rare (SAR)": "221–254",
    "Ultra Rare (UR)": "255–259",
  },
  aboutParagraphs: [
    "Terastal Gathering (set code CSV9.5C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released June 12, 2026. It's the \".5\" special set between Stellar Crystal (CSV9C) and Chasing Glory (CSV10C), with an Eeveelution-heavy lineup. It has 259 cards: a main set of 156 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, then 51 secret rares.",
    "Every card has its own collector number, 001 through 259. The 208-card main set runs from Common up to Double Rare and includes 8 ACE SPEC cards, one-per-deck Trainer and Energy cards printed in a pink frame. The 51 secret rares are 12 Super Rare Supporters, 34 Special Art Rares (28 ex Pokémon and 6 Supporters) and 5 gold Ultra Rare ex. There are no Art Rares. Most secret rares reprint main-set cards, but Pikachu ex, Ceruledge ex and nine Supporter cards appear only as secret rares.",
  ],
  faq: [
    { q: "How many cards are in Terastal Gathering?", a: "259 cards: a 208-card main set with 156 Pokémon, 49 Trainer cards and 3 Special Energy (8 of them ACE SPEC cards), plus 51 secret rares (12 Super Rare, 34 Special Art Rare and 5 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 5 gold cards including Pikachu ex 258/208. The Sylveon ex Special Art Rare 234/208 is this set's Chinese Exclusive. A second Sylveon ex Special Art Rare, 233/208, has the same name and rarity, so check the number." },
    { q: "What's Terastal Gathering's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare. Pokémon China's chart splits the Special Art Rares in two: it ranks the 28 Pokémon SARs below the Super Rares and the 6 Trainer SARs above them, with Ultra Rare at the top." },
    { q: "What is an ACE SPEC card?", a: "A one-per-deck Trainer or Energy card printed in a pink frame. Terastal Gathering has 8 of them, all in the main set at their own collector numbers." },
    { q: "When did Terastal Gathering release?", a: "June 12, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Terastal Gathering?", a: "EBI Collectibles carries Terastal Gathering packs and boxes." },
  ],
  metaTitle: "Pokémon Terastal Gathering (CSV9.5C) Card List: All 259 Cards | EBI Collectibles",
  metaDescription:
    "All 259 cards in Pokémon Terastal Gathering (CSV9.5C), the Simplified Chinese Eeveelution set, with 34 SARs and the Chinese Exclusive Sylveon ex SAR.",
  ogTitle: "Pokémon Terastal Gathering (CSV9.5C) Card List: All 259 Cards",
  ogDescription:
    "All 259 cards in Pokémon Terastal Gathering (CSV9.5C), the Simplified Chinese Eeveelution set, with 34 SARs and the Chinese Exclusive Sylveon ex SAR.",
}

export const Route = createFileRoute('/sets/chinese/terastal-gathering-csv9-5')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/terastal-gathering-csv9-5' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv95Page,
})

function Csv95Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/terastal-gathering-csv9-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
