import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/swsh-cs1-5.json'
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
  "routePath": "/sets/chinese/dynamax-tactics-cs1-5",
  "storageKey": "swsh-cs1-5-have",
  "fanIds": [
    "094",
    "092",
    "091",
    "093",
    "095"
  ],
  "fanCaption": "The set's top rarity cards",
  "glow1": "rgb(70 100 170 / .30)",
  "glow2": "rgb(150 60 80 / .22)",
  "heroLede": "All 96 cards in Dynamax Tactics (CS1.5C), a Simplified Chinese Sword & Shield set. The main set runs 001 to 055, and 41 secret cards run from 056 to 096. Tap any card for its rarity and number.",
  "pokemonFact": "41",
  "rarityVersionLabelsOverride": {
    "Common (C)": "003–038 (mixed)",
    "Uncommon (U)": "005–055 (mixed)",
    "Rare (R)": "008–039 (mixed)",
    "Double Rare (RR)": "001–040 (mixed)",
    "Triple Rare (RRR)": "002–041 (mixed)",
    "Shiny (S)": "056–072",
    "Super Rare (SR)": "073–082",
    "Shiny Super Rare (SSR)": "083–086",
    "Hyper Rare (HR)": "087–090",
    "Ultra Rare (UR)": "091–096"
  },
  "aboutParagraphs": [
    "Dynamax Tactics (极巨攻防, set code CS1.5C, printed as CS1.5) is an official Simplified Chinese Pokémon TCG set from the Sword & Shield series, released in mainland China on June 28, 2023. Enhanced packs have 6 cards each, 20 packs per box.",
    "It has 96 cards: 55 in the main set (41 Pokémon, the rest Trainers and Energy) and 41 secret cards numbered above /55. The rarities are Common, Uncommon, Rare, Double Rare, Triple Rare, Shiny, Super Rare, Shiny Super Rare, Hyper Rare and Ultra Rare. Like other Simplified Chinese releases, it collects cards first printed in Japanese sets (S2a, S2, S1H, S1W, S1a, SP1/SP2 decks, S4a).",
    "Dynamax Tactics is the English translation English-language collectors use; the set has no official English name. Card names here are the English names of the same cards."
  ],
  "faq": [
    {
      "q": "How many cards are in Dynamax Tactics?",
      "a": "96 cards: 55 in the main set plus 41 secret cards."
    },
    {
      "q": "When did Dynamax Tactics release?",
      "a": "June 28, 2023, in mainland China."
    },
    {
      "q": "What language are the cards in?",
      "a": "Simplified Chinese."
    }
  ],
  "metaTitle": "Pokémon Dynamax Tactics (CS1.5C) Card List: All 96 Cards | EBI Collectibles",
  "metaDescription": "All 96 cards in Pokémon Dynamax Tactics (CS1.5C), a Simplified Chinese Sword & Shield set.",
  "ogTitle": "Pokémon Dynamax Tactics (CS1.5C) Card List: All 96 Cards",
  "ogDescription": "All 96 cards in Pokémon Dynamax Tactics (CS1.5C), a Simplified Chinese Sword & Shield set.",
  "noindex": true
}

export const Route = createFileRoute('/sets/chinese/dynamax-tactics-cs1-5')({
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: DynamaxTacticsCs15Page,
})

function DynamaxTacticsCs15Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/dynamax-tactics-cs1-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
