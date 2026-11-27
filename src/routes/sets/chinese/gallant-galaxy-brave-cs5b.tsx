import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs5b.json'
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
  "routePath": "/sets/chinese/gallant-galaxy-brave-cs5b",
  "storageKey": "swsh-cs5b-have",
  "fanIds": [
    "175",
    "173",
    "172",
    "174",
    "176"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 178 cards in Gallant Galaxy: Brave (CS5bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 128, and 50 secret cards run from 129 to 178. Tap any card for its rarity and number.",
  "pokemonFact": "113",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–126 (mixed)",
    "Uncommon (U)": "002–128 (mixed)",
    "Rare (R)": "003–123 (mixed)",
    "Double Rare (RR)": "030–113 (mixed)",
    "Triple Rare (RRR)": "031–104 (mixed)",
    "Radiant Rare (K)": "004–088 (mixed)",
    "Art Rare (AR)": "129–132",
    "Super Rare (SR)": "133–155",
    "Special Art Rare (SAR)": "156–158",
    "Hyper Rare (HR)": "159–171",
    "Ultra Rare (UR)": "172–178"
  },
  "aboutParagraphs": [
    "Gallant Galaxy: Brave (勇魅群星 勇, set code CS5bC, printed as CS5b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on June 18, 2024. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 178 cards: 128 in the main set (113 Pokémon, the rest Trainers and Energy) and 50 secret cards numbered above /128. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Art Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S9, S10P, S10D, S9a, S10a, S10b, S11a, SLL).",
    "Gallant Galaxy: Brave is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Gallant Galaxy: Brave?",
      "a": "178 cards: 128 in the main set plus 50 secret cards."
    },
    {
      "q": "When did Gallant Galaxy: Brave release?",
      "a": "June 18, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Gallant Galaxy: Brave (CS5bC) Card List: All 178 Cards | EBI Collectibles",
  "metaDescription": "All 178 cards in Pokémon Gallant Galaxy: Brave (CS5bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Gallant Galaxy: Brave (CS5bC) Card List: All 178 Cards",
  "ogDescription": "All 178 cards in Pokémon Gallant Galaxy: Brave (CS5bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/gallant-galaxy-brave-cs5b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: GallantGalaxyBraveCs5BPage,
})

function GallantGalaxyBraveCs5BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gallant-galaxy-brave-cs5b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
