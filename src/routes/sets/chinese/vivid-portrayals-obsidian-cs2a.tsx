import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs2a.json'
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
  "routePath": "/sets/chinese/vivid-portrayals-obsidian-cs2a",
  "storageKey": "swsh-cs2a-have",
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
  "heroLede": "All 143 cards in Vivid Portrayals: Obsidian (CS2aC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 115, and 28 secret cards run from 116 to 143. Tap any card for its rarity and number.",
  "pokemonFact": "101",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–100 (mixed)",
    "Uncommon (U)": "003–115 (mixed)",
    "Rare (R)": "014–109 (mixed)",
    "Double Rare (RR)": "024–091 (mixed)",
    "Triple Rare (RRR)": "025–092 (mixed)",
    "Amazing Rare (A)": "037–093 (mixed)",
    "Shiny (S)": "116–120",
    "Super Rare (SR)": "121–132",
    "Shiny Super Rare (SSR)": "133–134",
    "Hyper Rare (HR)": "135–141",
    "Ultra Rare (UR)": "142–143"
  },
  "aboutParagraphs": [
    "Vivid Portrayals: Obsidian (浓墨重彩 黎, set code CS2aC, printed as CS2a) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on August 18, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 143 cards: 115 in the main set (101 Pokémon, the rest Trainers and Energy) and 28 secret cards numbered above /115. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Amazing Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S3 Infinity Zone, S3a Legendary Heartbeat, S4 Amazing Volt Tackle, SC, S-P).",
    "Vivid Portrayals: Obsidian is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Vivid Portrayals: Obsidian?",
      "a": "143 cards: 115 in the main set plus 28 secret cards."
    },
    {
      "q": "When did Vivid Portrayals: Obsidian release?",
      "a": "August 18, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Vivid Portrayals: Obsidian (CS2aC) Card List: All 143 Cards | EBI Collectibles",
  "metaDescription": "All 143 cards in Pokémon Vivid Portrayals: Obsidian (CS2aC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Vivid Portrayals: Obsidian (CS2aC) Card List: All 143 Cards",
  "ogDescription": "All 143 cards in Pokémon Vivid Portrayals: Obsidian (CS2aC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/vivid-portrayals-obsidian-cs2a')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: VividPortrayalsObsidianCs2APage,
})

function VividPortrayalsObsidianCs2APage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/vivid-portrayals-obsidian-cs2a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
