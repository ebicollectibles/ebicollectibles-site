import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-1.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 2-7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_1 — see gem-vol-1-notes.md for
// the structure/color-theme research this config is based on.
//
// Gem Vol 1, the first Gem set, is irregular in yet another way: 16
// Pokémon across THREE ladder lengths/denominators (9, 8 or 5 versions),
// plus Trainer/Energy catalog blocks (catalogGroups: [17, 18] in
// src/data/gem-vol-1.json — same mechanism as Gem Vol 2/3). No rarity
// repeats at a non-contiguous version here (unlike Vol 2's V cards or
// Vol 3's ex cards) — the irregularity is purely in how long each
// ladder is, which is still enough to make the auto-derived hero copy
// and odds-table labels wrong, hence the overrides below. This set also
// has no dedicated product listing in the store, so productId is
// omitted — the Shop buttons fall back to linking /shop generally.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/gem-vol-1',
  storageKey: 'gem1-have',
  // This set's 4 real exclusives — the Pokémon Horizons full arts for
  // Sprigatito, Fuecoco, Captain Pikachu (centered) and Quaxly.
  fanIds: ['0109', '0309', '0709', '0509'],
  // Gem Vol 1's Gem Pack branding is the same magenta family as every
  // other Gem set, paired here with a pastel water blue (Quaxly's own
  // color) for a brighter, "starting out" feel — distinct from Vol 2
  // (forest teal), Vol 3 (lantern peach), Vol 4 (terracotta), Vol 5
  // (gold), Vol 6 (green) and Vol 7's darker plum/navy blue.
  glow1: 'rgb(194 26 118 / .30)',
  glow2: 'rgb(151 202 224 / .22)',
  heroLede:
    'All 115 cards in Gem Vol 1: the first Gem set, built around the Paldea starters Sprigatito, Fuecoco and Quaxly and their middle evolutions, plus Captain Pikachu, 9 other Pokémon, 4 Trainer cards and 6 Energy cards. Tap any card for a closer look and every version beside it.',
  pokemonFact: '16 × 5–9',
  rarityVersionLabelsOverride: {
    Common: '01–02',
    Uncommon: '03–04',
    Rare: '04–06',
    'Double Rare': '05–07 + 3 Trainers',
    'Triple Rare': '08–09 + Nemona + 6 Energies',
  },
  aboutParagraphs: [
    'Gem Vol 1 (set code CBB1C) is the first release in the Simplified Chinese Gem Set series, out January 17, 2025 — built around the Paldea starters Sprigatito, Fuecoco and Quaxly (plus their middle evolutions Floragato, Crocalor and Quaxwell) and Captain Pikachu, alongside 9 other Pokémon, 4 Trainer cards and 6 Energy cards. 115 cards in all.',
    'Each starter and Captain Pikachu has a 9-version ladder (8 for the middle evolutions): Common through Double Rare, a shiny-style alternate art at version 06, an illustration full art at version 08, and — for the four most iconic of them — a Pokémon Horizons full art exclusive to this set at version 09. The other 9 Pokémon have a shorter 5-version ladder running straight through to Double Rare. The Trainer block adds Poké Ball, Great Ball and Ultra Ball (Double Rare) plus a Triple Rare full-art Nemona; the Energy block has Basic Grass, Basic Fire and Basic Water Energy, each printed twice, all Triple Rare.',
  ],
  faq: [
    { q: 'How many cards are in Gem Vol 1?', a: '115 cards: 16 Pokémon (the Paldea starters, their middle evolutions, Captain Pikachu and 9 others) plus 4 Trainer cards and 6 Energy cards.' },
    {
      q: 'What are the chase cards?',
      a: 'Four Triple Rare Pokémon Horizons full arts — Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09 and Captain Pikachu 0709/09 — are Chinese exclusives, only appearing in the Simplified Chinese Gem Vol 1 release.',
    },
    {
      q: "Why is there a card just called \"Pikachu\" in Captain Pikachu's row?",
      a: 'Two cards in that row — 0706/09 and 0708/09 — are a separate, ordinary Pikachu rather than Captain Pikachu. That’s a genuine difference between the cards, not a labeling error.',
    },
    { q: 'When did Gem Vol 1 release?', a: 'January 17, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 1?', a: "Gem Vol 1 doesn't currently have a dedicated listing — browse EBI Collectibles' shop for current Pokémon TCG stock." },
  ],
  metaTitle: 'Gem Vol 1 Card List — All 115 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Gem Vol 1 (Simplified Chinese): the Paldea starters and Captain Pikachu with Horizons full-art exclusives, plus a printable checklist.',
  ogTitle: 'Gem Vol 1 Card List — All 115 Cards',
  ogDescription: 'All 115 cards in Pokémon TCG Gem Vol 1 — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/gem-vol-1')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol1Page,
})

function GemVol1Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/gem-vol-1', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
