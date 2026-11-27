import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs2b.json'
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
  "routePath": "/sets/chinese/vivid-portrayals-indigo-cs2b",
  "storageKey": "swsh-cs2b-have",
  "fanIds": [
    "136",
    "143",
    "142",
    "135",
    "137"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 143 cards in Vivid Portrayals: Indigo (CS2bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 115, and 28 secret cards run from 116 to 143. Tap any card for its rarity and number.",
  "pokemonFact": "102",
  "rarityVersionLabelsOverride": {
    "Common (C)": "003–105 (mixed)",
    "Uncommon (U)": "001–115 (mixed)",
    "Rare (R)": "002–100 (mixed)",
    "Double Rare (RR)": "010–092 (mixed)",
    "Triple Rare (RRR)": "011–093 (mixed)",
    "Amazing Rare (A)": "006–071 (mixed)",
    "Shiny (S)": "116–121",
    "Super Rare (SR)": "122–132",
    "Shiny Super Rare (SSR)": "133–134",
    "Hyper Rare (HR)": "135–141",
    "Ultra Rare (UR)": "142–143"
  },
  "aboutParagraphs": [
    "Vivid Portrayals: Indigo (浓墨重彩 靛, set code CS2bC, printed as CS2b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on August 18, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 143 cards: 115 in the main set (102 Pokémon, the rest Trainers and Energy) and 28 secret cards numbered above /115. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Amazing Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S3, S4, S3a, S4a Shiny Star V).",
    "Vivid Portrayals: Indigo is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Vivid Portrayals: Indigo?",
      "a": "143 cards: 115 in the main set plus 28 secret cards."
    },
    {
      "q": "When did Vivid Portrayals: Indigo release?",
      "a": "August 18, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Vivid Portrayals: Indigo (CS2bC) Card List: All 143 Cards | EBI Collectibles",
  "metaDescription": "All 143 cards in Pokémon Vivid Portrayals: Indigo (CS2bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Vivid Portrayals: Indigo (CS2bC) Card List: All 143 Cards",
  "ogDescription": "All 143 cards in Pokémon Vivid Portrayals: Indigo (CS2bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/vivid-portrayals-indigo-cs2b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: VividPortrayalsIndigoCs2BPage,
})

function VividPortrayalsIndigoCs2BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/vivid-portrayals-indigo-cs2b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
