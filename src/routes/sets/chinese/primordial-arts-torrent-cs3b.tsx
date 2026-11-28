import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs3b.json'
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
  "routePath": "/sets/chinese/primordial-arts-torrent-cs3b",
  "storageKey": "swsh-cs3b-have",
  "fanIds": [
    "177",
    "175",
    "174",
    "176",
    "178"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 179 cards in Primordial Arts: Torrent (CS3bC), a Simplified Chinese Sword & Shield set. The main set runs 001 to 122, and 57 secret cards run from 123 to 179. Tap any card for its rarity and number.",
  "pokemonFact": "103",
  "rarityVersionLabelsOverride": {
    "Common (C)": "001–103 (mixed)",
    "Uncommon (U)": "005–122 (mixed)",
    "Rare (R)": "002–097 (mixed)",
    "Double Rare (RR)": "018–100 (mixed)",
    "Triple Rare (RRR)": "019–092 (mixed)",
    "Character Rare (CHR)": "123–126",
    "Super Rare (SR)": "127–149",
    "Character Super Rare (CSR)": "150–156",
    "Hyper Rare (HR)": "157–173",
    "Ultra Rare (UR)": "174–179"
  },
  "aboutParagraphs": [
    "Primordial Arts: Torrent (洪荒演武 激, set code CS3bC, printed as CS3b) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on November 17, 2023. Main expansions came in 5-card packs (30 per box) and 25-card packs (24 per box).",
    "It has 179 cards: 122 in the main set (103 Pokémon, the rest Trainers and Energy) and 57 secret cards numbered above /122. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Character Rare, Super Rare, Character Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S5R Rapid Strike Master, S6H, S5a, S6K, S5I, SEK).",
    "Primordial Arts: Torrent is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Primordial Arts: Torrent?",
      "a": "179 cards: 122 in the main set plus 57 secret cards."
    },
    {
      "q": "When did Primordial Arts: Torrent release?",
      "a": "November 17, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Primordial Arts: Torrent (CS3bC) Card List: All 179 Cards | EBI Collectibles",
  "metaDescription": "All 179 cards in Pokémon Primordial Arts: Torrent (CS3bC), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Primordial Arts: Torrent (CS3bC) Card List: All 179 Cards",
  "ogDescription": "All 179 cards in Pokémon Primordial Arts: Torrent (CS3bC), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/primordial-arts-torrent-cs3b')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: PrimordialArtsTorrentCs3BPage,
})

function PrimordialArtsTorrentCs3BPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/primordial-arts-torrent-cs3b', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
