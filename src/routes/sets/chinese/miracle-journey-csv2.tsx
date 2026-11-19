import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv2.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Built on the shared Gem Set engine (src/components/gem-set/GemSetPage.tsx);
// this file only supplies this set's data and editorial config. Sourced
// from https://www.chencards.com/sets/miracle_journey, see
// csv2-notes.md for the structure research this config is based on.
//
// Miracle Journey (set code CSV2C) is the second main numbered CSV
// expansion, the same flat-catalog shape as CSV3 (src/data/csv2.json
// sets groupByName: true): one numbering system, no null rarities, no
// missing images. The sourcing pass read the rarity mark printed on
// every main-set card and corrected 12 that the source had swapped
// (9 to Common, 3 to Uncommon), which brings the data in line with the
// official odds chart (57 Common, 47 Uncommon).
//
// The source flags no exclusive cards for this set, so
// exclusiveCardNumbers is empty and the page never uses that term.
//
// No dedicated product listing in the store, so productId is omitted
// and the Shop buttons link to /shop.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/miracle-journey-csv2',
  storageKey: 'csv2-have',
  // The Gardevoir ex SAR centered, flanked by the Meowscarada ex and
  // Quaquaval ex SARs, with the Erika's Invitation SAR and the gold
  // Meowscarada ex UR on the outside.
  fanIds: ['157', '152', '155', '154', '160'],
  fanCaption: "The set's top chase cards",
  // The pink of the pack against Gardevoir's green.
  glow1: 'rgb(226 110 170 / .30)',
  glow2: 'rgb(70 160 90 / .25)',
  heroLede:
    "All 163 cards in Miracle Journey (CSV2C). The 128-card main set has 109 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy. Secret rares run from 129 to 163: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "109",
  rarityVersionLabelsOverride: {
    "Common (C)": "002–106 (mixed)",
    "Uncommon (U)": "001–128 (mixed)",
    "Rare (R)": "014–108 (mixed)",
    "Double Rare (RR)": "012–107 (mixed)",
    "Art Rare (AR)": "129–136",
    "Super Rare (SR)": "137–151",
    "Special Art Rare (SAR)": "152–159",
    "Ultra Rare (UR)": "160–163",
  },
  aboutParagraphs: [
    "Miracle Journey (set code CSV2C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released March 21, 2025, with Gardevoir on the pack. It has 163 cards: a main set of 109 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy, then 35 secret rares.",
    "Every card has its own collector number, 001 through 163. The 128-card main set runs from Common up to Double Rare, with 13 Pokémon ex including Gardevoir ex, Meowscarada ex, Skeledirge ex and Quaquaval ex. The 35 secret rares are 8 Art Rares of main-set Pokémon, 15 Super Rares and 8 Special Art Rares of Pokémon ex and Supporters, and 4 gold Ultra Rares: Meowscarada ex, Skeledirge ex, Quaquaval ex and Artazon.",
  ],
  faq: [
    { q: "How many cards are in Miracle Journey?", a: "163 cards: a 128-card main set with 109 Pokémon, 18 Trainer cards and 1 Special Energy, plus 35 secret rares (8 Art Rare, 15 Super Rare, 8 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 4 gold cards: Meowscarada ex 160/128, Skeledirge ex 161/128, Quaquaval ex 162/128 and Artazon 163/128. The pack's cover Pokémon has a Special Art Rare, Gardevoir ex 155/128." },
    { q: "What's Miracle Journey's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did Miracle Journey release?", a: "March 21, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Miracle Journey?", a: "Miracle Journey doesn't currently have a dedicated listing. Browse EBI Collectibles' shop for current Pokémon TCG stock." },
  ],
  metaTitle: "Pokémon Miracle Journey (CSV2C) Card List: All 163 Cards | EBI Collectibles",
  metaDescription:
    "All 163 cards in Pokémon Miracle Journey (CSV2C), Simplified Chinese, led by Gardevoir ex and gold Meowscarada ex, Skeledirge ex and Quaquaval ex.",
  ogTitle: "Pokémon Miracle Journey (CSV2C) Card List: All 163 Cards",
  ogDescription:
    "All 163 cards in Pokémon Miracle Journey (CSV2C), Simplified Chinese, led by Gardevoir ex and gold Meowscarada ex, Skeledirge ex and Quaquaval ex.",
}

export const Route = createFileRoute('/sets/chinese/miracle-journey-csv2')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/miracle-journey-csv2' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv2Page,
})

function Csv2Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/miracle-journey-csv2', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
