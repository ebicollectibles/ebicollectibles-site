import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/white-flare.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every Gem Vol page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/white_flare — see white-flare-notes.md
// for the structure/color-theme research this config is based on.
//
// White Flare is Black Bolt's twin — same real, officially-licensed
// structure (src/data/white-flare.json also sets groupByName: true; see
// src/routes/sets/chinese/black-bolt-csv10-5.tsx for the full explanation of why), same
// 8-tier rarity scheme, same card counts, split Unova Pokédex. Its
// mascot is Reshiram ex where Black Bolt's is Zekrom ex.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/white-flare-csv10-6',
  storageKey: 'white-flare-have',
  productId: 'pokemon-chinese-white-flare-slim-booster-box',
  // Reshiram ex's full progression (Super Rare, Special Art Rare, and the
  // set's single Black White Rare, centered) plus Bouffalant ex's SAR and
  // this set's Chinese exclusive, Hilda.
  fanIds: ['160', '168', '174', '172', '173'],
  fanCaption: "The set's top chase cards",
  // An official set, not a Gem Pack — no Gem Pack magenta. Flame red and
  // warm peach echo the set's own white/flame box art and card palette,
  // paired to read alongside Black Bolt's blue/teal.
  glow1: 'rgb(171 49 42 / .30)',
  glow2: 'rgb(219 172 132 / .22)',
  heroLede:
    "All 174 cards in White Flare (CSV10.6C): 78 Pokémon (6 of them ex) across 8 rarities, from Common up to the set's single Black White Rare, Reshiram ex. Tap any card for a closer look and its other printings.",
  pokemonFact: "78",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–081 (mixed)",
    "Uncommon (U)": "003–086 (mixed)",
    "Rare (R)": "010–078 (mixed)",
    "Double Rare (RR)": "005–075 (mixed)",
    "Art Rare (AR)": "087–158",
    "Super Rare (SR)": "159–166",
    "Special Art Rare (SAR)": "167–173",
    "Black White Rare (BWR)": "174",
  },
  aboutParagraphs: [
    "White Flare (set code CSV10.6C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 6, 2026 alongside its twin set Black Bolt. Both sets are built from Unova Pokémon. White Flare has 78 of them (6 as ex) and Black Bolt has a different 78, so no Pokémon appears in both. With its Trainer cards, Special Energy and secret rares, White Flare has 174 cards.",
    "Every card has its own collector number, 001 through 174. The first 86 cards are the main set: 78 Pokémon, 7 Trainer cards and a Special Energy, in mixed rarities from Common up to Double Rare. The 88 secret rares are an Art Rare of every non-ex Pokémon (72 in all), a Super Rare and a Special Art Rare of each of the 6 ex, Super Rares of the Supporters Harlequin and Hilda, a Special Art Rare of Hilda, and one Black White Rare, Reshiram ex.",
  ],
  faq: [
    { q: "How many cards are in White Flare?", a: "174 cards: an 86-card main set with 78 Pokémon (6 of them ex), 7 Trainer cards and 1 Special Energy, plus 88 secret rares." },
    { q: "What are the chase cards?", a: "The top tier is the single Black White Rare, Reshiram ex 174/086. The Hilda Special Art Rare 173/086 is this set's Chinese Exclusive." },
    { q: "What's White Flare's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Black White Rare, from most common to rarest." },
    { q: "How does White Flare relate to Black Bolt?", a: "They are twin sets released the same day, each with its own 78 Unova Pokémon. White Flare's Black White Rare is Reshiram ex. Black Bolt's is Zekrom ex." },
    { q: "When did White Flare release?", a: "November 6, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy White Flare?", a: "EBI Collectibles carries White Flare packs and boxes." },
  ],
  metaTitle: "Pokémon White Flare (CSV10.6C) Card List: All 174 Cards | EBI Collectibles",
  metaDescription:
    "All 174 cards in Pokémon White Flare (CSV10.6C), Simplified Chinese: Unova Pokémon, the Reshiram ex Black White Rare and the Chinese Exclusive Hilda.",
  ogTitle: "Pokémon White Flare (CSV10.6C) Card List: All 174 Cards",
  ogDescription:
    "All 174 cards in Pokémon White Flare (CSV10.6C), Simplified Chinese: Unova Pokémon, the Reshiram ex Black White Rare and the Chinese Exclusive Hilda.",
}

export const Route = createFileRoute('/sets/chinese/white-flare-csv10-6')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/white-flare-csv10-6' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: WhiteFlarePage,
})

function WhiteFlarePage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/white-flare-csv10-6', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
