import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/white-flare.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every Gem Vol page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/white_flare — see white-flare-notes.md
// for the structure/color-theme research this config is based on.
//
// White Flare is Black Bolt's twin — same real, officially-licensed
// structure (src/data/white-flare.json also sets groupByName: true; see
// src/routes/sets/black-bolt.tsx for the full explanation of why), same
// 8-tier rarity scheme, same card counts, split Unova Pokédex. Its
// mascot is Reshiram ex where Black Bolt's is Zekrom ex.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/white-flare',
  storageKey: 'white-flare-have',
  productId: 'pokemon-chinese-white-flare-slim-booster-box',
  // Reshiram ex's full progression (Super Rare, Special Art Rare, and the
  // set's single Black White Rare, centered) plus Bouffalant ex's SAR and
  // this set's Chinese exclusive, Hilda.
  fanIds: ['161', '168', '174', '172', '173'],
  fanCaption: "The set's top chase cards",
  // An official set, not a Gem Pack — no Gem Pack magenta. Flame red and
  // warm peach echo the set's own white/flame box art and card palette,
  // paired to read alongside Black Bolt's blue/teal.
  glow1: 'rgb(171 49 42 / .30)',
  glow2: 'rgb(219 172 132 / .22)',
  heroLede:
    "All 174 cards in White Flare: 78 Pokémon (6 of them ex) across 8 rarities, from Common up to the set's single Black White Rare — Reshiram ex. Tap any card for a closer look and every other printing beside it.",
  pokemonFact: '78',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–085 (mixed)',
    'Uncommon (U)': '001–086 (mixed)',
    'Rare (R)': '001–085 (mixed)',
    'Double Rare (RR)': '001–086 (mixed)',
    'Art Rare (AR)': '087–158',
    'Super Rare (SR)': '159–166',
    'Special Art Rare (SAR)': '167–173',
    'Black White Rare (BWR)': '174',
  },
  aboutParagraphs: [
    "White Flare (set code CSV10.6C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 6, 2026 alongside its twin set Black Bolt. It's built around the Unova region, with 78 Pokémon (including 6 ex) split between the two sets, plus Trainer and Energy cards — 174 cards in White Flare in total.",
    "Every card has its own collector number, 001 through 174. The first 86 cards are the main set — Pokémon, Trainers and a Special Energy, in mixed rarities from Common up to Double Rare. The 88 secret rares that follow reprint select cards in rarer treatments: an Art Rare for every non-ex Pokémon, a Super Rare and Special Art Rare for each of the 6 ex Pokémon and two Supporters, and a single Black White Rare — this set's exclusive Reshiram ex — as its top chase card.",
  ],
  faq: [
    { q: 'How many cards are in White Flare?', a: '174 cards: an 86-card main set plus 88 secret rares, covering 78 Pokémon (6 of them ex), 7 Trainer cards and 1 Special Energy.' },
    { q: 'What are the chase cards?', a: "The set's highest tier is its single Black White Rare, Reshiram ex (174/086). Hilda 173/086, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's White Flare's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Black White Rare, from most common to rarest — different from the Gem Set releases.' },
    { q: 'How does White Flare relate to Black Bolt?', a: "Twin sets released the same day, splitting the Unova Pokédex between them — White Flare's mascot is Reshiram ex, Black Bolt's is Zekrom ex." },
    { q: 'When did White Flare release?', a: 'November 6, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy White Flare?', a: 'EBI Collectibles carries White Flare packs and boxes.' },
  ],
  metaTitle: 'White Flare Card List — All 174 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG White Flare (Simplified Chinese): 78 Pokémon including 6 ex, Art Rares, Super Rares, Special Art Rares and the exclusive Reshiram ex Black White Rare.',
  ogTitle: 'White Flare Card List — All 174 Cards',
  ogDescription: 'All 174 cards in Pokémon TCG White Flare — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/white-flare')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: WhiteFlarePage,
})

function WhiteFlarePage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/white-flare', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
