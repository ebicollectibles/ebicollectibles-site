import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs4b.json'
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
  "routePath": "/sets/chinese/polychromatic-gathering-origin-cs4b",
  "storageKey": "swsh-cs4b-have",
  "fanIds": [
    "176",
    "174",
    "173",
    "175",
    "177"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 177 cards in Polychromatic Gathering: Origin (CS4bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 132, and 45 secret cards run from 133 to 177. Tap any card for its rarity and number.",
  "pokemonFact": "115",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–125 (mixed)",
    "Uncommon (U)": "006–132 (mixed)",
    "Rare (R)": "003–096 (mixed)",
    "Double Rare (RR)": "009–112 (mixed)",
    "Triple Rare (RRR)": "010–113 (mixed)",
    "Super Rare (SR)": "133–155",
    "Character Super Rare (CSR)": "156",
    "Hyper Rare (HR)": "157–172",
    "Ultra Rare (UR)": "173–177"
  },
  "aboutParagraphs": [
    "Polychromatic Gathering: Origin (九彩汇聚 源, set code CS4bC, printed as CS4b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on March 1, 2024. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 177 cards: 132 in the main set (115 Pokémon, the rest Trainers and Energy) and 45 secret cards numbered above /132. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Super Rare, Character Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S8, S7R, S7D, S6a, SGG, S8b VMAX Climax).",
    "Polychromatic Gathering: Origin is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Polychromatic Gathering: Origin?",
      "a": "177 cards: 132 in the main set plus 45 secret cards."
    },
    {
      "q": "When did Polychromatic Gathering: Origin release?",
      "a": "March 1, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Polychromatic Gathering: Origin (CS4bC) Card List: All 177 Cards | EBI Collectibles",
  "metaDescription": "All 177 cards in Pokémon Polychromatic Gathering: Origin (CS4bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Polychromatic Gathering: Origin (CS4bC) Card List: All 177 Cards",
  "ogDescription": "All 177 cards in Pokémon Polychromatic Gathering: Origin (CS4bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/polychromatic-gathering-origin-cs4b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: PolychromaticGatheringOriginCs4BPage,
})

function PolychromaticGatheringOriginCs4BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/polychromatic-gathering-origin-cs4b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
