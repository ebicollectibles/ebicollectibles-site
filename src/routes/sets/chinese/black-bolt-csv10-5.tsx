import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/black-bolt.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every Gem Vol page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/black_bolt — see black-bolt-notes.md
// for the structure/color-theme research this config is based on.
//
// Unlike every Gem Vol set, Black Bolt is a real, officially-licensed
// Pokémon TCG expansion (Chinese Scarlet & Violet series) — not Chen's
// own Gem Pack branding. It has no per-Pokémon version ladder at all:
// every card has its own unique collector number (src/data/black-bolt.json
// sets groupByName: true so the engine groups by matching name across
// the whole set instead), and it uses an entirely different 8-tier
// rarity scheme. Its twin set, White Flare, mirrors this structure
// exactly, down to the shared field names — see src/routes/sets/chinese/white-flare-csv10-6.tsx.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/black-bolt-csv10-5',
  storageKey: 'black-bolt-have',
  productId: 'pokemon-chinese-black-bolt-slim-booster-box',
  // Zekrom ex's full progression (Super Rare, Special Art Rare, and the
  // set's single Black White Rare, centered) plus Genesect ex's SAR and
  // this set's Chinese exclusive, N's Plan.
  fanIds: ['161', '169', '174', '172', '173'],
  fanCaption: "The set's top chase cards",
  // An official set, not a Gem Pack — no Gem Pack magenta. Electric blue
  // and deep sea teal echo the set's own black/lightning box art and
  // card palette, paired to read alongside White Flare's red/peach.
  glow1: 'rgb(119 167 201 / .30)',
  glow2: 'rgb(72 121 119 / .25)',
  heroLede:
    "All 174 cards in Black Bolt (CSV10.5C): 78 Pokémon (6 of them ex) across 8 rarities, from Common up to the set's single Black White Rare, Zekrom ex. Tap any card for a closer look and its other printings.",
  pokemonFact: "78",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–080 (mixed)",
    "Uncommon (U)": "005–086 (mixed)",
    "Rare (R)": "012–072 (mixed)",
    "Double Rare (RR)": "003–069 (mixed)",
    "Art Rare (AR)": "087–158",
    "Super Rare (SR)": "159–166",
    "Special Art Rare (SAR)": "167–173",
    "Black White Rare (BWR)": "174",
  },
  aboutParagraphs: [
    "Black Bolt (set code CSV10.5C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 6, 2026 alongside its twin set White Flare. Both sets are built from Unova Pokémon. Black Bolt has 78 of them (6 as ex) and White Flare has a different 78, so no Pokémon appears in both. With its Trainer cards, Special Energy and secret rares, Black Bolt has 174 cards.",
    "Every card has its own collector number, 001 through 174. The first 86 cards are the main set: 78 Pokémon, 7 Trainer cards and a Special Energy, in mixed rarities from Common up to Double Rare. The 88 secret rares are an Art Rare of every non-ex Pokémon (72 in all), a Super Rare and a Special Art Rare of each of the 6 ex, Super Rares of the Supporters N's Plan and Fennel, a Special Art Rare of N's Plan, and one Black White Rare, Zekrom ex.",
  ],
  faq: [
    { q: "How many cards are in Black Bolt?", a: "174 cards: an 86-card main set with 78 Pokémon (6 of them ex), 7 Trainer cards and 1 Special Energy, plus 88 secret rares." },
    { q: "What are the chase cards?", a: "The top tier is the single Black White Rare, Zekrom ex 174/086. The N's Plan Special Art Rare 173/086 is this set's Chinese Exclusive." },
    { q: "What's Black Bolt's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Black White Rare, from most common to rarest." },
    { q: "How does Black Bolt relate to White Flare?", a: "They are twin sets released the same day, each with its own 78 Unova Pokémon. Black Bolt's Black White Rare is Zekrom ex. White Flare's is Reshiram ex." },
    { q: "When did Black Bolt release?", a: "November 6, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Black Bolt?", a: "EBI Collectibles carries Black Bolt packs and boxes." },
  ],
  metaTitle: "Pokémon Black Bolt (CSV10.5C) Card List: All 174 Cards | EBI Collectibles",
  metaDescription:
    "All 174 cards in Pokémon Black Bolt (CSV10.5C), Simplified Chinese: Unova Pokémon, the Zekrom ex Black White Rare and the Chinese Exclusive N's Plan.",
  ogTitle: "Pokémon Black Bolt (CSV10.5C) Card List: All 174 Cards",
  ogDescription:
    "All 174 cards in Pokémon Black Bolt (CSV10.5C), Simplified Chinese: Unova Pokémon, the Zekrom ex Black White Rare and the Chinese Exclusive N's Plan.",
}

export const Route = createFileRoute('/sets/chinese/black-bolt-csv10-5')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/black-bolt-csv10-5' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: BlackBoltPage,
})

function BlackBoltPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/black-bolt-csv10-5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
