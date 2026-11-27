import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs5a.json'
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
  "routePath": "/sets/chinese/gallant-galaxy-charm-cs5a",
  "storageKey": "swsh-cs5a-have",
  "fanIds": [
    "173",
    "171",
    "170",
    "172",
    "174"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 176 cards in Gallant Galaxy: Charm (CS5aC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 127, and 49 secret cards run from 128 to 176. Tap any card for its rarity and number.",
  "pokemonFact": "111",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–109 (mixed)",
    "Uncommon (U)": "002–127 (mixed)",
    "Rare (R)": "003–105 (mixed)",
    "Double Rare (RR)": "004–111 (mixed)",
    "Triple Rare (RRR)": "005–107 (mixed)",
    "Radiant Rare (K)": "014–092 (mixed)",
    "Art Rare (AR)": "128–130",
    "Super Rare (SR)": "131–151",
    "Special Art Rare (SAR)": "152–157",
    "Hyper Rare (HR)": "158–169",
    "Ultra Rare (UR)": "170–176"
  },
  "aboutParagraphs": [
    "Gallant Galaxy: Charm (勇魅群星 魅, set code CS5aC, printed as CS5a) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on June 18, 2024. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 176 cards: 127 in the main set (111 Pokémon, the rest Trainers and Energy) and 49 secret cards numbered above /127. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Radiant Rare, Art Rare, Super Rare, Special Art Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S9 Star Birth, S9a Battle Region, S10P Space Juggler, S10b Pokémon GO, S10D Time Gazer, S10a Dark Phantasma, S11a).",
    "Gallant Galaxy: Charm is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Gallant Galaxy: Charm?",
      "a": "176 cards: 127 in the main set plus 49 secret cards."
    },
    {
      "q": "When did Gallant Galaxy: Charm release?",
      "a": "June 18, 2024, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Gallant Galaxy: Charm (CS5aC) Card List: All 176 Cards | EBI Collectibles",
  "metaDescription": "All 176 cards in Pokémon Gallant Galaxy: Charm (CS5aC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Gallant Galaxy: Charm (CS5aC) Card List: All 176 Cards",
  "ogDescription": "All 176 cards in Pokémon Gallant Galaxy: Charm (CS5aC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/gallant-galaxy-charm-cs5a')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: GallantGalaxyCharmCs5APage,
})

function GallantGalaxyCharmCs5APage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gallant-galaxy-charm-cs5a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
