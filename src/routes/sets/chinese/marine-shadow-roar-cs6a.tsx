import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs6a.json'
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
  "routePath": "/sets/chinese/marine-shadow-roar-cs6a",
  "storageKey": "swsh-cs6a-have",
  "fanIds": [
    "158",
    "168",
    "167",
    "169",
    "159"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 169 cards in Marine Shadow: Roar (CS6aC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 131, and 38 secret cards run from 132 to 169. Tap any card for its rarity and number.",
  "pokemonFact": "119",
  "rarityVersionLabelsOverride": {
    "Common (C)": "002–128 (mixed)",
    "Uncommon (U)": "004–131 (mixed)",
    "Rare (R)": "011–124 (mixed)",
    "Double Rare (RR)": "001–104 (mixed)",
    "Triple Rare (RRR)": "020–103 (mixed)",
    "Radiant Rare (K)": "027–086 (mixed)",
    "Art Rare (AR)": "132–134",
    "Super Rare (SR)": "135–153",
    "Special Art Rare (SAR)": "154–157",
    "Hyper Rare (HR)": "158–166",
    "Ultra Rare (UR)": "167–169"
  },
  "aboutParagraphs": [
    "Marine Shadow: Roar (碧海暗影 啸, set code CS6aC, printed as CS6a) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on September 20, 2024. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 169 cards: 131 in the main set (119 Pokémon, the rest Trainers and Energy) and 38 secret cards numbered above /131. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Art Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S12 Paradigm Trigger, S11 Lost Abyss, S11a Incandescent Arcana, S9/S10D/SI (Start Deck 100)).",
    "Marine Shadow: Roar is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Marine Shadow: Roar?",
      "a": "169 cards: 131 in the main set plus 38 secret cards."
    },
    {
      "q": "When did Marine Shadow: Roar release?",
      "a": "September 20, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Marine Shadow: Roar (CS6aC) Card List: All 169 Cards | EBI Collectibles",
  "metaDescription": "All 169 cards in Pokémon Marine Shadow: Roar (CS6aC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Marine Shadow: Roar (CS6aC) Card List: All 169 Cards",
  "ogDescription": "All 169 cards in Pokémon Marine Shadow: Roar (CS6aC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/marine-shadow-roar-cs6a')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: MarineShadowRoarCs6APage,
})

function MarineShadowRoarCs6APage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/marine-shadow-roar-cs6a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
