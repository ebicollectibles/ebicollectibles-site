import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs3a.json'
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
  "routePath": "/sets/chinese/primordial-arts-overgrow-cs3a",
  "storageKey": "swsh-cs3a-have",
  "fanIds": [
    "180",
    "178",
    "177",
    "179",
    "181"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 184 cards in Primordial Arts: Overgrow (CS3aC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 125, and 59 secret cards run from 126 to 184. Tap any card for its rarity and number.",
  "pokemonFact": "105",
  "rarityVersionLabelsOverride": {
    "Common (C)": "003–104 (mixed)",
    "Uncommon (U)": "005–125 (mixed)",
    "Rare (R)": "017–096 (mixed)",
    "Double Rare (RR)": "001–101 (mixed)",
    "Triple Rare (RRR)": "002–102 (mixed)",
    "Character Rare (CHR)": "126–129",
    "Super Rare (SR)": "130–154",
    "Character Super Rare (CSR)": "155–160",
    "Hyper Rare (HR)": "161–176",
    "Ultra Rare (UR)": "177–184"
  },
  "aboutParagraphs": [
    "Primordial Arts: Overgrow (洪荒演武 茂, set code CS3aC, printed as CS3a) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on November 17, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 184 cards: 125 in the main set (105 Pokémon, the rest Trainers and Energy) and 59 secret cards numbered above /125. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Character Rare, Super Rare, Character Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S5I Single Strike Master, S6K Jet-Black Spirit, S6H Silver Lance, S5a Peerless Fighters, SEF deck, S5R).",
    "Primordial Arts: Overgrow is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Primordial Arts: Overgrow?",
      "a": "184 cards: 125 in the main set plus 59 secret cards."
    },
    {
      "q": "When did Primordial Arts: Overgrow release?",
      "a": "November 17, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Primordial Arts: Overgrow (CS3aC) Card List: All 184 Cards | EBI Collectibles",
  "metaDescription": "All 184 cards in Pokémon Primordial Arts: Overgrow (CS3aC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Primordial Arts: Overgrow (CS3aC) Card List: All 184 Cards",
  "ogDescription": "All 184 cards in Pokémon Primordial Arts: Overgrow (CS3aC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/primordial-arts-overgrow-cs3a')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: PrimordialArtsOvergrowCs3APage,
})

function PrimordialArtsOvergrowCs3APage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/primordial-arts-overgrow-cs3a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
