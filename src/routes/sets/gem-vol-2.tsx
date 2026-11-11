import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-2.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 3-7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_2 — see gem-vol-2-notes.md for
// the structure/color-theme research this config is based on.
//
// Gem Vol 2 is an Eevee-family set: only 9 Pokémon, but each with a 14-
// or 15-version ladder (Eevee, Umbreon, Leafeon and Sylveon add a 15th,
// exclusive version) culminating in a V and a VMAX — plus a Trainer
// block and an Energy block, same catalogGroups mechanism as Gem Vol 3
// (src/data/gem-vol-2.json sets catalogGroups: [10, 11]). Rare repeats
// at version 13 (the V card) same as Vol 3's "ex" cards, and the mixed
// 14/15 version counts mean the auto-derived hero copy and odds-table
// labels would be wrong if not overridden below — see
// src/lib/gem-sets/buildSetData.ts for why.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/gem-vol-2',
  storageKey: 'gem2-have',
  productId: 'pokemon-chinese-gem-volume-2-booster-box',
  // This set's 4 exclusives — the version-15 full-art illustrations for
  // Eevee (centered), Umbreon, Leafeon and Sylveon — plus Umbreon VMAX
  // for a 5th highlight.
  fanIds: ['0615', '0715', '0115', '0915', '0614'],
  // Gem Vol 2's Gem Pack branding is the same magenta family as Vol 3-6,
  // paired here with a soft forest teal echoing the 4 exclusives' sunlit
  // style — distinct from Vol 3 (lantern peach), Vol 4 (coral), Vol 5
  // (gold), Vol 6 (green) and Vol 7 (plum/blue).
  glow1: 'rgb(194 23 116 / .30)',
  glow2: 'rgb(86 134 135 / .25)',
  heroLede:
    'All 140 cards in Gem Vol 2: an Eevee-family set of Eevee and all 8 Eeveelutions, each across 14 or 15 versions culminating in a V, a VMAX and — for Eevee, Umbreon, Leafeon and Sylveon — an exclusive full-art illustration, plus 4 Trainer cards and 6 Energy cards. Tap any card for a closer look and every version beside it.',
  pokemonFact: '9 × 14–15',
  rarityVersionLabelsOverride: {
    Common: '01–04',
    Uncommon: '05–08',
    Rare: '09–10 + 9 V',
    'Double Rare': '11–12',
    'Triple Rare': '9 VMAX + 4 full arts + Penny + 6 Energies',
  },
  aboutParagraphs: [
    'Gem Vol 2 (set code CBB2C) is the second release in the Simplified Chinese Gem Set series, out May 16, 2025 — an Eevee-family set built around Eevee and all 8 Eeveelutions, with 140 cards: 9 Pokémon, 4 Trainer cards and 6 Energy cards.',
    'Each Pokémon has 14 versions (15 for Eevee, Umbreon, Leafeon and Sylveon): two alternating base-card treatments across Common, Uncommon, Rare and Double Rare, then a Rare-rarity V card and a Triple Rare VMAX. Eevee, Umbreon, Leafeon and Sylveon add a 15th version — a Triple Rare full-art illustration exclusive to this set. The Trainer block adds Poké Ball, Level Ball and Quick Ball (Double Rare) plus a Triple Rare full-art Penny; the Energy block has Basic Lightning, Basic Psychic and Basic Darkness Energy, each printed twice, all Triple Rare.',
  ],
  faq: [
    { q: 'How many cards are in Gem Vol 2?', a: '140 cards: 9 Pokémon (Eevee and its 8 Eeveelutions) across 14 or 15 versions each, plus 4 Trainer cards and 6 Energy cards.' },
    {
      q: 'What are the chase cards?',
      a: 'Four Triple Rare full-art illustrations — Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15 — are Chinese exclusives, only appearing in the Simplified Chinese Gem Vol 2 release.',
    },
    {
      q: "What's a V or VMAX card?",
      a: 'Each of the 9 Pokémon has a Rare-rarity V card and a Triple Rare VMAX card near the top of its ladder, in addition to its regular Common through Double Rare versions.',
    },
    { q: 'When did Gem Vol 2 release?', a: 'May 16, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 2?', a: 'EBI Collectibles carries Gem Vol 2 packs and boxes.' },
  ],
  metaTitle: 'Gem Vol 2 Card List — All 140 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Gem Vol 2 (Simplified Chinese): Eevee and all 8 Eeveelutions with V, VMAX and exclusive full-art cards, plus a printable checklist.',
  ogTitle: 'Gem Vol 2 Card List — All 140 Cards',
  ogDescription: 'All 140 cards in Pokémon TCG Gem Vol 2 — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/gem-vol-2')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol2Page,
})

function GemVol2Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/gem-vol-2', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
