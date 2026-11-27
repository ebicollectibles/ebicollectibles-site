import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs3-5.json'
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
  "routePath": "/sets/chinese/scorching-skies-cs3-5",
  "storageKey": "swsh-cs3-5-have",
  "fanIds": [
    "083",
    "089",
    "088",
    "090",
    "084"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 90 cards in Scorching Skies (CS3.5C), a Simplified Chinese Sword & Shield set. The main set runs 001 to 066, and 24 secret cards run from 067 to 090. Tap any card for its rarity and number.",
  "pokemonFact": "54",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–053 (mixed)",
    "Uncommon (U)": "002–066 (mixed)",
    "Rare (R)": "003–054 (mixed)",
    "Double Rare (RR)": "005–041 (mixed)",
    "Triple Rare (RRR)": "009–029 (mixed)",
    "Character Rare (CHR)": "067–068",
    "Super Rare (SR)": "069–080",
    "Character Super Rare (CSR)": "081–082",
    "Hyper Rare (HR)": "083–087",
    "Ultra Rare (UR)": "088–090"
  },
  "aboutParagraphs": [
    "Scorching Skies (怒炎灼天, set code CS3.5C, printed as CS3.5) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on January 5, 2024. Enhanced packs have 6 cards each, 20 packs per box.",
    "It has 90 cards: 66 in the main set (54 Pokémon, the rest Trainers and Energy) and 24 secret cards numbered above /66. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Character Rare, Super Rare, Character Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S5a, S5R, S6K, S5I, S6H).",
    "Scorching Skies is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Scorching Skies?",
      "a": "90 cards: 66 in the main set plus 24 secret cards."
    },
    {
      "q": "When did Scorching Skies release?",
      "a": "January 5, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Scorching Skies (CS3.5C) Card List: All 90 Cards | EBI Collectibles",
  "metaDescription": "All 90 cards in Pokémon Scorching Skies (CS3.5C), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Scorching Skies (CS3.5C) Card List: All 90 Cards",
  "ogDescription": "All 90 cards in Pokémon Scorching Skies (CS3.5C), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/scorching-skies-cs3-5')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: ScorchingSkiesCs35Page,
})

function ScorchingSkiesCs35Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/scorching-skies-cs3-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
