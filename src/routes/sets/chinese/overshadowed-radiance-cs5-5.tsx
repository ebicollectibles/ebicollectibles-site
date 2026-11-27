import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs5-5.json'
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
  "routePath": "/sets/chinese/overshadowed-radiance-cs5-5",
  "storageKey": "swsh-cs5-5-have",
  "fanIds": [
    "081",
    "088",
    "087",
    "089",
    "082"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 89 cards in Overshadowed Radiance (CS5.5C), a Simplified Chinese Sword & Shield set. The main set runs 001 to 066, and 23 secret cards run from 067 to 089. Tap any card for its rarity and number.",
  "pokemonFact": "58",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–048 (mixed)",
    "Uncommon (U)": "002–066 (mixed)",
    "Rare (R)": "008–056 (mixed)",
    "Double Rare (RR)": "003–057 (mixed)",
    "Triple Rare (RRR)": "050–058 (mixed)",
    "Radiant Rare (K)": "007–015 (mixed)",
    "Super Rare (SR)": "067–076",
    "Special Art Rare (SAR)": "077–080",
    "Hyper Rare (HR)": "081–086",
    "Ultra Rare (UR)": "087–089"
  },
  "aboutParagraphs": [
    "Overshadowed Radiance (暗影夺辉, set code CS5.5C, printed as CS5.5) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on August 2, 2024. Enhanced packs have 6 cards each, 20 packs per box.",
    "It has 89 cards: 66 in the main set (58 Pokémon, the rest Trainers and Energy) and 23 secret cards numbered above /66. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S10a Dark Phantasma, S10D, S9a, S10b, S9, S10P, S11).",
    "Overshadowed Radiance is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Overshadowed Radiance?",
      "a": "89 cards: 66 in the main set plus 23 secret cards."
    },
    {
      "q": "When did Overshadowed Radiance release?",
      "a": "August 2, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Overshadowed Radiance (CS5.5C) Card List: All 89 Cards | EBI Collectibles",
  "metaDescription": "All 89 cards in Pokémon Overshadowed Radiance (CS5.5C), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Overshadowed Radiance (CS5.5C) Card List: All 89 Cards",
  "ogDescription": "All 89 cards in Pokémon Overshadowed Radiance (CS5.5C), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/overshadowed-radiance-cs5-5')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: OvershadowedRadianceCs55Page,
})

function OvershadowedRadianceCs55Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/overshadowed-radiance-cs5-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
