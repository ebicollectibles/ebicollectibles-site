import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs6-5.json'
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
  "routePath": "/sets/chinese/victory-lodestar-cs6-5",
  "storageKey": "swsh-cs6-5-have",
  "fanIds": [
    "089",
    "095",
    "094",
    "096",
    "090"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 96 cards in Victory Lodestar (CS6.5C), a Simplified Chinese Sword & Shield set. The main set runs 001 to 072, and 24 secret cards run from 073 to 096. Tap any card for its rarity and number.",
  "pokemonFact": "61",
  "rarityVersionLabelsOverride": {
    "Common (C)": "002–061 (mixed)",
    "Uncommon (U)": "003–072 (mixed)",
    "Rare (R)": "004–066 (mixed)",
    "Double Rare (RR)": "001–054 (mixed)",
    "Triple Rare (RRR)": "014–055 (mixed)",
    "Radiant Rare (K)": "020–025 (mixed)",
    "Super Rare (SR)": "073–084",
    "Special Art Rare (SAR)": "085–088",
    "Hyper Rare (HR)": "089–093",
    "Ultra Rare (UR)": "094–096"
  },
  "aboutParagraphs": [
    "Victory Lodestar (胜象星引, set code CS6.5C, printed as CS6.5) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on November 15, 2024. Enhanced packs have 6 cards each, 20 packs per box.",
    "It has 96 cards: 72 in the main set (61 Pokémon, the rest Trainers and Energy) and 24 secret cards numbered above /72. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S11a, S12, S11, S12a VSTAR Universe).",
    "Victory Lodestar is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Victory Lodestar?",
      "a": "96 cards: 72 in the main set plus 24 secret cards."
    },
    {
      "q": "When did Victory Lodestar release?",
      "a": "November 15, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Victory Lodestar (CS6.5C) Card List: All 96 Cards | EBI Collectibles",
  "metaDescription": "All 96 cards in Pokémon Victory Lodestar (CS6.5C), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Victory Lodestar (CS6.5C) Card List: All 96 Cards",
  "ogDescription": "All 96 cards in Pokémon Victory Lodestar (CS6.5C), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/victory-lodestar-cs6-5')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: VictoryLodestarCs65Page,
})

function VictoryLodestarCs65Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/victory-lodestar-cs6-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
