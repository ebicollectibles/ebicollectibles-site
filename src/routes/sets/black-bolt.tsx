import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/black-bolt.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

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
// exactly, down to the shared field names — see src/routes/sets/white-flare.tsx.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/black-bolt',
  storageKey: 'black-bolt-have',
  productId: 'pokemon-chinese-black-bolt-slim-booster-box',
  // Zekrom ex's full progression (Super Rare, Special Art Rare, and the
  // set's single Black White Rare, centered) plus Genesect ex's SAR and
  // this set's Chinese exclusive, N's Plan.
  fanIds: ['160', '169', '174', '172', '173'],
  fanCaption: "The set's top chase cards",
  // An official set, not a Gem Pack — no Gem Pack magenta. Electric blue
  // and deep sea teal echo the set's own black/lightning box art and
  // card palette, paired to read alongside White Flare's red/peach.
  glow1: 'rgb(119 167 201 / .30)',
  glow2: 'rgb(72 121 119 / .25)',
  heroLede:
    "All 174 cards in Black Bolt: 78 Pokémon (6 of them ex) across 8 rarities, from Common up to the set's single Black White Rare — Zekrom ex. Tap any card for a closer look and every other printing beside it.",
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
    "Black Bolt (set code CSV10.5C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 6, 2026 alongside its twin set White Flare. It's built around the Unova region, with 78 Pokémon (including 6 ex) split between the two sets, plus Trainer and Energy cards — 174 cards in Black Bolt in total.",
    "Every card has its own collector number, 001 through 174. The first 86 cards are the main set — Pokémon, Trainers and a Special Energy, in mixed rarities from Common up to Double Rare. The 88 secret rares that follow reprint select cards in rarer treatments: an Art Rare for every non-ex Pokémon, a Super Rare and Special Art Rare for each of the 6 ex Pokémon and two Supporters, and a single Black White Rare — this set's exclusive Zekrom ex — as its top chase card.",
  ],
  faq: [
    { q: 'How many cards are in Black Bolt?', a: '174 cards: an 86-card main set plus 88 secret rares, covering 78 Pokémon (6 of them ex), 7 Trainer cards and 1 Special Energy.' },
    { q: 'What are the chase cards?', a: "The set's highest tier is its single Black White Rare, Zekrom ex (174/086). N's Plan 173/086, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Black Bolt's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Black White Rare, from most common to rarest — different from the Gem Set releases.' },
    { q: 'How does Black Bolt relate to White Flare?', a: "Twin sets released the same day, splitting the Unova Pokédex between them — Black Bolt's mascot is Zekrom ex, White Flare's is Reshiram ex." },
    { q: 'When did Black Bolt release?', a: 'November 6, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Black Bolt?', a: 'EBI Collectibles carries Black Bolt packs and boxes.' },
  ],
  metaTitle: 'Black Bolt Card List — All 174 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Black Bolt (Simplified Chinese): 78 Pokémon including 6 ex, Art Rares, Super Rares, Special Art Rares and the exclusive Zekrom ex Black White Rare.',
  ogTitle: 'Black Bolt Card List — All 174 Cards',
  ogDescription: 'All 174 cards in Pokémon TCG Black Bolt — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/black-bolt')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: BlackBoltPage,
})

function BlackBoltPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/black-bolt', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
