import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs1b.json'
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
// names cross-checked against PokeAPI. Card images: the official 300x419
// scans from that mirror, hosted on R2, for development review only (the
// mirror's licence is non-commercial; settle images before going public).

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  "routePath": "/sets/chinese/dynamax-clash-flame-cs1b",
  "storageKey": "swsh-cs1b-have",
  "fanIds": [
    "193",
    "191",
    "190",
    "192",
    "194"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 199 cards in Dynamax Clash: Flame (CS1bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 136, and 63 secret cards run from 137 to 199. Tap any card for its rarity and number.",
  "pokemonFact": "120",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–123 (mixed)",
    "Uncommon (U)": "003–136 (mixed)",
    "Rare (R)": "026–132 (mixed)",
    "Double Rare (RR)": "004–120 (mixed)",
    "Triple Rare (RRR)": "005–100 (mixed)",
    "Shiny (S)": "137–161",
    "Super Rare (SR)": "162–175",
    "Shiny Super Rare (SSR)": "176–182",
    "Hyper Rare (HR)": "183–189",
    "Ultra Rare (UR)": "190–199"
  },
  "aboutParagraphs": [
    "Dynamax Clash: Flame (极巨争锋 焰, set code CS1bC, printed as CS1b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on May 19, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 199 cards: 136 in the main set (120 Pokémon, the rest Trainers and Energy) and 63 secret cards numbered above /136. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S2, S1a, S1H, S1W, S2a, SC starter, S4a, S-P promos).",
    "Dynamax Clash: Flame is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Dynamax Clash: Flame?",
      "a": "199 cards: 136 in the main set plus 63 secret cards."
    },
    {
      "q": "When did Dynamax Clash: Flame release?",
      "a": "May 19, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Dynamax Clash: Flame (CS1bC) Card List: All 199 Cards | EBI Collectibles",
  "metaDescription": "All 199 cards in Pokémon Dynamax Clash: Flame (CS1bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Dynamax Clash: Flame (CS1bC) Card List: All 199 Cards",
  "ogDescription": "All 199 cards in Pokémon Dynamax Clash: Flame (CS1bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/dynamax-clash-flame-cs1b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: DynamaxClashFlameCs1BPage,
})

function DynamaxClashFlameCs1BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/dynamax-clash-flame-cs1b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
