import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv7.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/blade_awakening — see csv7-notes.md for
// the full structure/color-theme research this config is based on.
//
// Blade Awakening is the same flat-catalog shape as CSV4–CSV6 and CSV10
// (src/data/csv7.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. It's the first
// set so far to carry 9 ACE SPEC Rare (ACE) cards inside the MAIN set at
// their own Trainer/Energy numbers (pink frame), rather than only as
// secret rares — see src/lib/gem-sets/rarity.ts. The sourcing session
// caught 4 cards Chen mislabeled Uncommon that print as Common (107,
// 130, 132, 173) — already corrected in the JSON.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/blade-awakening-csv7',
  storageKey: 'csv7-have',
  productId: 'pokemon-chinese-blade-awakening-slim-booster-box',
  // Greninja ex SAR (the set's most popular chase) centered, flanked by
  // Raging Bolt ex SAR and Walking Wake ex SAR, with Morty's Conviction
  // SAR and the Chinese-exclusive Ciphermaniac's Codebreaking SAR on
  // the outside.
  fanIds: ['250', '244', '242', '239', '245'],
  fanCaption: "The set's top chase cards",
  // Blade orange and near-black, from the set's own "利刃猛醒" logo
  // gradient — distinct from every other CSV set's colors.
  glow1: 'rgb(208 105 57 / .30)',
  glow2: 'rgb(13 13 18 / .25)',
  heroLede:
    "All 259 cards in Blade Awakening (CSV7C). The 204-card main set has 173 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, including 9 pink-framed ACE SPEC cards. Secret rares run from 205 to 259: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "173",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–173 (mixed)",
    "Uncommon (U)": "006–204 (mixed)",
    "Rare (R)": "023–172 (mixed)",
    "Double Rare (RR)": "019–163 (mixed)",
    "Art Rare (AR)": "205–210",
    "ACE SPEC Rare (ACE)": "176, 178, 180, 181, 183, 186, 187, 189, 203",
    "Super Rare (SR)": "211–236",
    "Special Art Rare (SAR)": "237–250",
    "Ultra Rare (UR)": "251–259",
  },
  aboutParagraphs: [
    "Blade Awakening (set code CSV7C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released January 16, 2026. It has 259 cards: a main set of 173 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, then 55 secret rares.",
    "Every card has its own collector number, 001 through 259. The 204-card main set runs from Common up to Double Rare and includes 9 ACE SPEC cards, one-per-deck Trainer and Energy cards printed in a pink frame. The 55 secret rares are 6 Art Rares of main-set Pokémon, 26 Super Rares and 14 Special Art Rares of ex Pokémon and Supporters, and 9 gold Ultra Rares.",
  ],
  faq: [
    { q: "How many cards are in Blade Awakening?", a: "259 cards: a 204-card main set with 173 Pokémon, 29 Trainer cards and 2 Special Energy (9 of them ACE SPEC cards), plus 55 secret rares (6 Art Rare, 26 Super Rare, 14 Special Art Rare and 9 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 9 gold cards including Gouging Fire ex 252/204 and Walking Wake ex 253/204. Greninja ex has a Super Rare and a Special Art Rare (242/204) but no gold card. The Ciphermaniac's Codebreaking Special Art Rare 245/204 is this set's Chinese Exclusive." },
    { q: "What's Blade Awakening's rarity scheme?", a: "A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "What is an ACE SPEC card?", a: "A one-per-deck Trainer or Energy card printed in a pink frame. Blade Awakening has 9 of them, all in the main set at their own collector numbers." },
    { q: "When did Blade Awakening release?", a: "January 16, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Blade Awakening?", a: "EBI Collectibles carries Blade Awakening packs and boxes." },
  ],
  metaTitle: "Pokémon Blade Awakening (CSV7C) Card List: All 259 Cards | EBI Collectibles",
  metaDescription:
    "All 259 cards in Pokémon Blade Awakening (CSV7C), Simplified Chinese, with 9 ACE SPEC cards and the Chinese Exclusive Ciphermaniac's Codebreaking SAR.",
  ogTitle: "Pokémon Blade Awakening (CSV7C) Card List: All 259 Cards",
  ogDescription:
    "All 259 cards in Pokémon Blade Awakening (CSV7C), Simplified Chinese, with 9 ACE SPEC cards and the Chinese Exclusive Ciphermaniac's Codebreaking SAR.",
}

export const Route = createFileRoute('/sets/chinese/blade-awakening-csv7')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/blade-awakening-csv7' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv7Page,
})

function Csv7Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/blade-awakening-csv7', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
