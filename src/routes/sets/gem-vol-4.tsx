import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-4.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 5, 6 and 7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_4 — see gem-vol-4-notes.md for
// the structure/color-theme research this config is based on.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/gem-vol-4',
  storageKey: 'gem4-have',
  productId: 'pokemon-chinese-gem-volume-4-booster-box',
  // Ponyta (0107) is this set's Chinese exclusive — a pale Ponyta with a
  // resting Rapidash in a sunset meadow — centered, flanked by 4 other
  // likely chase-card full arts for variety (Eevee, Sawsbuck, Enamorus
  // and Flutter Mane).
  fanIds: ['0407', '1807', '0107', '2707', '2807'],
  // Gem Vol 4's Gem Pack branding is the same magenta family as Vol 5/6,
  // paired here with a warm coral/terracotta to match its earthy,
  // autumnal full-art palette — distinct from Vol 5 (magenta/gold),
  // Vol 6 (magenta/green) and Vol 7 (plum/blue).
  glow1: 'rgb(198 23 117 / .30)',
  glow2: 'rgb(208 129 105 / .25)',
  aboutParagraphs: [
    'Gem Vol 4 (set code CBB4C) is the fourth release in the Simplified Chinese Gem Set series, out February 6, 2026. It has 196 cards built around 28 Pokémon, with no trainer-owned cards or anime tie-in this time — just an evenly mixed lineup from Ponyta and Eevee through to the Paradox Pokémon Flutter Mane.',
    'Every Pokémon comes in 7 numbered versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is a full-art Triple Rare. Card numbers read as Pokémon number then version, so 0107/07 is the 7th version of the 1st Pokémon.',
  ],
  faq: [
    { q: 'How many cards are in Gem Vol 4?', a: '196 cards: 28 Pokémon with 7 versions each. That breaks down to 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
    { q: 'What are the chase cards?', a: 'The 28 Triple Rares (version 07 of each Pokémon) are full-art cards. Ponyta 0107/07 is a Chinese exclusive — this full art only appears in the Simplified Chinese Gem Vol 4 release.' },
    { q: 'When did Gem Vol 4 release?', a: 'February 6, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 4?', a: 'EBI Collectibles carries Gem Vol 4 packs and boxes.' },
  ],
  metaTitle: 'Gem Vol 4 Card List — All 196 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Gem Vol 4 (Simplified Chinese): all 28 Pokémon across 7 rarities each, with full-art Triple Rares and a printable checklist.',
  ogTitle: 'Gem Vol 4 Card List — All 196 Cards',
  ogDescription: 'All 196 cards in Pokémon TCG Gem Vol 4 — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/gem-vol-4')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol4Page,
})

function GemVol4Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/gem-vol-4', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
