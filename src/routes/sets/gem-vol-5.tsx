import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-5.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 6 and 7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_5 — see gem-vol-5-notes.md for
// the structure/color-theme research this config is based on.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/gem-vol-5',
  storageKey: 'gem5-have',
  productId: 'pokemon-chinese-gem-volume-5-booster-box',
  // Unlike Gem Vol 6/7 (one Chinese exclusive each), Gem Vol 5 has four:
  // all four Pokémon Horizons-anime full arts. Captain Pikachu (the most
  // iconic) sits in the center slot with the other three exclusives
  // flanking it, plus Tatsugiri for a 5th visual anchor.
  fanIds: ['2207', '2307', '0107', '2407', '2807'],
  // Gem Vol 5's Gem Pack branding is the same magenta family as Gem Vol
  // 6's, but its card palette leans warm gold rather than green — paired
  // here with the magenta so this set still reads distinctly from both
  // Gem Vol 6 (magenta/green) and Gem Vol 7 (plum/blue).
  glow1: 'rgb(197 24 116 / .30)',
  glow2: 'rgb(230 191 61 / .22)',
  aboutParagraphs: [
    'Gem Vol 5 (set code CBB5C) is the fifth release in the Simplified Chinese Gem Set series, out April 24, 2026. It has 196 cards built around 28 Pokémon, headlined by four Triple Rare full arts drawn with characters from the Pokémon Horizons anime — Captain Pikachu with Friede, Floragato with Liko, Crocalor with Roy, and Quaxwell — each carrying its own Pokémon Horizons logo stamp.',
    'Every Pokémon comes in 7 numbered versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is a full-art Triple Rare. Card numbers read as Pokémon number then version, so 0107/07 is the 7th version of the 1st Pokémon.',
  ],
  faq: [
    { q: 'How many cards are in Gem Vol 5?', a: '196 cards: 28 Pokémon with 7 versions each. That breaks down to 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
    { q: 'What are the chase cards?', a: 'The 28 Triple Rares (version 07 of each Pokémon) are full-art cards. Four of them — Captain Pikachu 0107/07, Floragato 2207/07, Crocalor 2307/07 and Quaxwell 2407/07 — are Chinese exclusives drawn with Pokémon Horizons anime characters, and only appear in the Simplified Chinese Gem Vol 5 release.' },
    { q: 'When did Gem Vol 5 release?', a: 'April 24, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 5?', a: 'EBI Collectibles carries Gem Vol 5 packs and boxes.' },
  ],
  metaTitle: 'Gem Vol 5 Card List — All 196 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Gem Vol 5 (Simplified Chinese): all 28 Pokémon across 7 rarities each, with full-art Triple Rares and a printable checklist.',
  ogTitle: 'Gem Vol 5 Card List — All 196 Cards',
  ogDescription: 'All 196 cards in Pokémon TCG Gem Vol 5 — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/gem-vol-5')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol5Page,
})

function GemVol5Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/gem-vol-5', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
