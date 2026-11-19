import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv1.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Built on the shared Gem Set engine (src/components/gem-set/GemSetPage.tsx);
// this file only supplies this set's data and editorial config. Sourced
// from https://www.chencards.com/sets/eternal_birth, see
// csv1-notes.md for the structure research this config is based on.
//
// Eternal Birth (set code CSV1C) is the first main numbered CSV
// expansion, the same flat-catalog shape as CSV3 (src/data/csv1.json
// sets groupByName: true): one numbering system, no null rarities, no
// missing images. The sourcing pass read the rarity mark printed on
// every main-set card and corrected 10 that the source had swapped
// (6 to Common, 4 to Uncommon), which brings the data in line with the
// official odds chart (55 Common, 43 Uncommon).
//
// The source flags no exclusive cards for this set, so
// exclusiveCardNumbers is empty and the page never uses that term.
//
// No dedicated product listing in the store, so productId is omitted
// and the Shop buttons link to /shop.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/eternal-birth-csv1',
  storageKey: 'csv1-have',
  // The Miraidon ex SAR centered, flanked by the Koraidon ex and
  // Tinkaton ex SARs, with the Miriam SAR and the gold Miraidon ex UR
  // on the outside.
  fanIds: ['163', '157', '154', '155', '164'],
  fanCaption: "The set's top chase cards",
  // Miraidon's violet against the yellow lightning on the pack.
  glow1: 'rgb(98 78 190 / .30)',
  glow2: 'rgb(230 200 60 / .25)',
  heroLede:
    "All 167 cards in Eternal Birth (CSV1C). The 127-card main set has 106 Pokémon plus Items, Pokémon Tools, Supporters, a Stadium and a Special Energy. Secret rares run from 128 to 167: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "106",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–104 (mixed)",
    "Uncommon (U)": "002–127 (mixed)",
    "Rare (R)": "016–122 (mixed)",
    "Double Rare (RR)": "008–106 (mixed)",
    "Art Rare (AR)": "128–135",
    "Super Rare (SR)": "136–152",
    "Special Art Rare (SAR)": "153–163",
    "Ultra Rare (UR)": "164–167",
  },
  aboutParagraphs: [
    "Eternal Birth (set code CSV1C) is an official Pokémon TCG expansion and the first set in the Chinese Scarlet & Violet series, released January 17, 2025, with Miraidon on the pack. It has 167 cards: a main set of 106 Pokémon plus Items, Pokémon Tools, Supporters, a Stadium and a Special Energy, then 40 secret rares.",
    "Every card has its own collector number, 001 through 167. The 127-card main set runs from Common up to Double Rare, with 14 Pokémon ex including Miraidon ex and Koraidon ex. The 40 secret rares are 8 Art Rares of main-set Pokémon, 17 Super Rares and 11 Special Art Rares of Pokémon ex and Supporters, and 4 gold Ultra Rares: Miraidon ex, Koraidon ex, Super Rod and Switch.",
  ],
  faq: [
    { q: "How many cards are in Eternal Birth?", a: "167 cards: a 127-card main set with 106 Pokémon, 20 Trainer cards and 1 Special Energy, plus 40 secret rares (8 Art Rare, 17 Super Rare, 11 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 4 gold cards led by Miraidon ex 164/127 and Koraidon ex 165/127. Both also have a Special Art Rare: Miraidon ex 154/127 and Koraidon ex 157/127." },
    { q: "What's Eternal Birth's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did Eternal Birth release?", a: "January 17, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Eternal Birth?", a: "Eternal Birth doesn't currently have a dedicated listing. Browse EBI Collectibles' shop for current Pokémon TCG stock." },
  ],
  metaTitle: "Pokémon Eternal Birth (CSV1C) Card List: All 167 Cards | EBI Collectibles",
  metaDescription:
    "All 167 cards in Pokémon Eternal Birth (CSV1C), the first Simplified Chinese Scarlet & Violet set, led by Miraidon ex and Koraidon ex.",
  ogTitle: "Pokémon Eternal Birth (CSV1C) Card List: All 167 Cards",
  ogDescription:
    "All 167 cards in Pokémon Eternal Birth (CSV1C), the first Simplified Chinese Scarlet & Violet set, led by Miraidon ex and Koraidon ex.",
}

export const Route = createFileRoute('/sets/chinese/eternal-birth-csv1')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/eternal-birth-csv1' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv1Page,
})

function Csv1Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/eternal-birth-csv1', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
