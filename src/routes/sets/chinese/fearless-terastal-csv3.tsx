import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv3.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Built on the shared Gem Set engine (src/components/gem-set/GemSetPage.tsx);
// this file only supplies this set's data and editorial config. Sourced
// from https://www.chencards.com/sets/fearless_terastal, see
// csv3-notes.md for the structure research this config is based on.
//
// Fearless Terastal (set code CSV3C) is the third main numbered CSV
// expansion, the same flat-catalog shape as CSV4 (src/data/csv3.json
// sets groupByName: true): one numbering system, no null rarities, no
// missing images. The sourcing pass read the rarity mark printed on
// every Common and Uncommon card and corrected 12 that the source had
// swapped (10 to Common, 2 to Uncommon), which brings the data in line
// with the official odds chart (56 Common, 47 Uncommon).
//
// No dedicated product listing in the store, so productId is omitted
// and the Shop buttons link to /shop.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/fearless-terastal-csv3',
  storageKey: 'csv3-have',
  // The Chinese Exclusive Arcanine ex SAR centered, flanked by the
  // Chien-Pao ex and Ting-Lu ex SARs, with the Iono SAR and the gold
  // Chien-Pao ex UR on the outside.
  fanIds: ['160', '157', '155', '158', '162'],
  fanCaption: "The set's top chase cards",
  // Arcanine's orange against the blue of a Tera crystal.
  glow1: 'rgb(214 96 40 / .30)',
  glow2: 'rgb(64 130 170 / .25)',
  heroLede:
    "All 165 cards in Fearless Terastal (CSV3C). The 130-card main set has 114 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy. Secret rares run from 131 to 165: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "114",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–111 (mixed)",
    "Uncommon (U)": "007–130 (mixed)",
    "Rare (R)": "003–113 (mixed)",
    "Double Rare (RR)": "005–112 (mixed)",
    "Art Rare (AR)": "131–138",
    "Super Rare (SR)": "139–153",
    "Special Art Rare (SAR)": "154–161",
    "Ultra Rare (UR)": "162–165",
  },
  aboutParagraphs: [
    "Fearless Terastal (set code CSV3C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released May 16, 2025, with Tera Arcanine ex on the pack. It has 165 cards: a main set of 114 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy, then 35 secret rares.",
    "Every card has its own collector number, 001 through 165. The 130-card main set runs from Common up to Double Rare. The 35 secret rares are 8 Art Rares of main-set Pokémon, 15 Super Rares and 8 Special Art Rares of Pokémon ex and Supporters, and 4 gold Ultra Rares: Chien-Pao ex, Ting-Lu ex, Superior Energy Retrieval and Reversal Energy.",
  ],
  faq: [
    { q: "How many cards are in Fearless Terastal?", a: "165 cards: a 130-card main set with 114 Pokémon, 15 Trainer cards and 1 Special Energy, plus 35 secret rares (8 Art Rare, 15 Super Rare, 8 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 4 gold cards led by Chien-Pao ex 162/130 and Ting-Lu ex 163/130. The set has one Chinese Exclusive: the Arcanine ex Special Art Rare, 155/130." },
    { q: "What's Fearless Terastal's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did Fearless Terastal release?", a: "May 16, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Fearless Terastal?", a: "Fearless Terastal doesn't currently have a dedicated listing. Browse EBI Collectibles' shop for current Pokémon TCG stock." },
  ],
  metaTitle: "Pokémon Fearless Terastal (CSV3C) Card List: All 165 Cards | EBI Collectibles",
  metaDescription:
    "All 165 cards in Pokémon Fearless Terastal (CSV3C), Simplified Chinese, led by Tera Arcanine ex and its Chinese Exclusive Special Art Rare.",
  ogTitle: "Pokémon Fearless Terastal (CSV3C) Card List: All 165 Cards",
  ogDescription:
    "All 165 cards in Pokémon Fearless Terastal (CSV3C), Simplified Chinese, led by Tera Arcanine ex and its Chinese Exclusive Special Art Rare.",
}

export const Route = createFileRoute('/sets/chinese/fearless-terastal-csv3')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/fearless-terastal-csv3' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv3Page,
})

function Csv3Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/fearless-terastal-csv3', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
