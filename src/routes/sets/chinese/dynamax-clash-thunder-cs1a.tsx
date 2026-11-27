import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs1a.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// HIDDEN DRAFT. Simplified Chinese Sword & Shield set list, reachable by
// direct URL only: noindex, not in the sets index, not in the sitemap.
// Card list, numbers and rarities: the official Pokémon China card
// database (mirrored by duanxr/PTCG-CHS-Datasets), checked card by card
// against Bulbapedia; the rarity disagreements were settled by the rarity
// mark printed on the card. English names: Bulbapedia, with Pokémon
// names cross-checked against PokeAPI. No card images yet: the only
// source's licence is non-commercial, so images wait on the owner.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  "routePath": "/sets/chinese/dynamax-clash-thunder-cs1a",
  "storageKey": "swsh-cs1a-have",
  "fanIds": [
    "215",
    "213",
    "212",
    "214",
    "216"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 217 cards in Dynamax Clash: Thunder (CS1aC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 135, and 82 secret cards run from 136 to 217. Tap any card for its rarity and number.",
  "pokemonFact": "119",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–118 (mixed)",
    "Uncommon (U)": "007–135 (mixed)",
    "Rare (R)": "017–132 (mixed)",
    "Double Rare (RR)": "008–111 (mixed)",
    "Triple Rare (RRR)": "009–112 (mixed)",
    "Shiny (S)": "136–174",
    "Super Rare (SR)": "175–192",
    "Shiny Super Rare (SSR)": "193–199",
    "Hyper Rare (HR)": "200–211",
    "Ultra Rare (UR)": "212–217"
  },
  "aboutParagraphs": [
    "Dynamax Clash: Thunder (极巨争锋 雷, set code CS1aC, printed as CS1a) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on May 19, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 217 cards: 135 in the main set (119 Pokémon, the rest Trainers and Energy) and 82 secret cards numbered above /135. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S2 Rebellion Crash, S1a VMAX Rising, S1W Sword, S1H Shield, S2a Explosive Walker, S4 Amazing Volt Tackle, S4a/SA/SSB promos).",
    "Dynamax Clash: Thunder is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Dynamax Clash: Thunder?",
      "a": "217 cards: 135 in the main set plus 82 secret cards."
    },
    {
      "q": "When did Dynamax Clash: Thunder release?",
      "a": "May 19, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Dynamax Clash: Thunder (CS1aC) Card List: All 217 Cards | EBI Collectibles",
  "metaDescription": "All 217 cards in Pokémon Dynamax Clash: Thunder (CS1aC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Dynamax Clash: Thunder (CS1aC) Card List: All 217 Cards",
  "ogDescription": "All 217 cards in Pokémon Dynamax Clash: Thunder (CS1aC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/dynamax-clash-thunder-cs1a')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: DynamaxClashThunderCs1APage,
})

function DynamaxClashThunderCs1APage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/dynamax-clash-thunder-cs1a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
