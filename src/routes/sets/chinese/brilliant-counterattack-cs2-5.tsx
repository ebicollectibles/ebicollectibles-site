import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs2-5.json'
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
  "routePath": "/sets/chinese/brilliant-counterattack-cs2-5",
  "storageKey": "swsh-cs2-5-have",
  "fanIds": [
    "075",
    "079",
    "078",
    "074",
    "076"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 79 cards in Brilliant Counterattack (CS2.5C), a Simplified Chinese Sword & Shield set. The main set runs 001 to 059, and 20 secret cards run from 060 to 079. Tap any card for its rarity and number.",
  "pokemonFact": "45",
  "rarityVersionLabelsOverride": {
    "Common (C)": "002–052 (mixed)",
    "Uncommon (U)": "004–059 (mixed)",
    "Rare (R)": "008–041 (mixed)",
    "Double Rare (RR)": "009–044 (mixed)",
    "Triple Rare (RRR)": "035–045 (mixed)",
    "Amazing Rare (A)": "001–030 (mixed)",
    "Shiny (S)": "060–061",
    "Super Rare (SR)": "062–071",
    "Shiny Super Rare (SSR)": "072–073",
    "Hyper Rare (HR)": "074–077",
    "Ultra Rare (UR)": "078–079"
  },
  "aboutParagraphs": [
    "Brilliant Counterattack (璀璨反击, set code CS2.5C, printed as CS2.5) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on September 29, 2023. Enhanced packs have 6 cards each, 20 packs per box.",
    "It has 79 cards: 59 in the main set (45 Pokémon, the rest Trainers and Energy) and 20 secret cards numbered above /59. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Amazing Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S4, S3, S3a, S4a).",
    "Brilliant Counterattack is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Brilliant Counterattack?",
      "a": "79 cards: 59 in the main set plus 20 secret cards."
    },
    {
      "q": "When did Brilliant Counterattack release?",
      "a": "September 29, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Brilliant Counterattack (CS2.5C) Card List: All 79 Cards | EBI Collectibles",
  "metaDescription": "All 79 cards in Pokémon Brilliant Counterattack (CS2.5C), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Brilliant Counterattack (CS2.5C) Card List: All 79 Cards",
  "ogDescription": "All 79 cards in Pokémon Brilliant Counterattack (CS2.5C), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/brilliant-counterattack-cs2-5')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: BrilliantCounterattackCs25Page,
})

function BrilliantCounterattackCs25Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/brilliant-counterattack-cs2-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
