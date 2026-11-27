import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs6b.json'
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
  "routePath": "/sets/chinese/marine-shadow-banish-cs6b",
  "storageKey": "swsh-cs6b-have",
  "fanIds": [
    "172",
    "170",
    "169",
    "171",
    "159"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 172 cards in Marine Shadow: Banish (CS6bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 131, and 41 secret cards run from 132 to 172. Tap any card for its rarity and number.",
  "pokemonFact": "120",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–121 (mixed)",
    "Uncommon (U)": "002–131 (mixed)",
    "Rare (R)": "005–124 (mixed)",
    "Double Rare (RR)": "007–115 (mixed)",
    "Triple Rare (RRR)": "022–116 (mixed)",
    "Radiant Rare (K)": "028–111 (mixed)",
    "Art Rare (AR)": "132–136",
    "Super Rare (SR)": "137–155",
    "Special Art Rare (SAR)": "156–158",
    "Hyper Rare (HR)": "159–168",
    "Ultra Rare (UR)": "169–172"
  },
  "aboutParagraphs": [
    "Marine Shadow: Banish (碧海暗影 逐, set code CS6bC, printed as CS6b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on September 20, 2024. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 172 cards: 131 in the main set (120 Pokémon, the rest Trainers and Energy) and 41 secret cards numbered above /131. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Art Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S11, S12, S9, S11a, S9a).",
    "Marine Shadow: Banish is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Marine Shadow: Banish?",
      "a": "172 cards: 131 in the main set plus 41 secret cards."
    },
    {
      "q": "When did Marine Shadow: Banish release?",
      "a": "September 20, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Marine Shadow: Banish (CS6bC) Card List: All 172 Cards | EBI Collectibles",
  "metaDescription": "All 172 cards in Pokémon Marine Shadow: Banish (CS6bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Marine Shadow: Banish (CS6bC) Card List: All 172 Cards",
  "ogDescription": "All 172 cards in Pokémon Marine Shadow: Banish (CS6bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/marine-shadow-banish-cs6b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: MarineShadowBanishCs6BPage,
})

function MarineShadowBanishCs6BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/marine-shadow-banish-cs6b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
