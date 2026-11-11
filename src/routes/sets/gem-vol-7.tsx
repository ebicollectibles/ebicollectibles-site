import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-7.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — deliberately not linked from the nav,
// footer, sitemap, or any other page (per the approved plan). The
// approved preview is at https://claude.ai/artifact/4KCMsj8H8knHr12zLUMpPH.
// Shares its rendering, filtering, hero-fan-carousel and lightbox logic
// with every other Gem Set page via src/components/gem-set/GemSetPage.tsx
// — this file only supplies this set's data and editorial config.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/gem-vol-7',
  storageKey: 'gem7-have',
  productId: 'pokemon-chinese-gem-volume-7-booster-box',
  // The 5 full-art Triple Rares fanned in the hero — same picks as the
  // approved preview. Misty's Psyduck (0307) sits in the center slot.
  fanIds: ['1907', '0707', '0307', '2507', '1607'],
  // Gem Vol 7's own purple/blue hero glow — kept as this set's signature
  // accent even though the component now lets every set pick its own.
  glow1: 'rgb(138 61 120 / .30)',
  glow2: 'rgb(58 110 165 / .25)',
  aboutParagraphs: [
    `Gem Vol 7 (set code ${raw.code}) is the seventh release in the Simplified Chinese Gem Set series, out November 6, 2026. It has 196 cards built around 28 Pokémon, many of them partnered with trainers such as Team Rocket, Misty, Cynthia, N, Marnie and Iono.`,
    'Every Pokémon comes in 7 numbered versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is a full-art Triple Rare. Card numbers read as Pokémon number then version, so 0307/07 is the 7th version of the 3rd Pokémon.',
  ],
  faq: [
    { q: 'How many cards are in Gem Vol 7?', a: '196 cards: 28 Pokémon with 7 versions each. That breaks down to 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
    { q: 'What are the chase cards?', a: 'The 28 Triple Rares (version 07 of each Pokémon) are full-art cards. Misty’s Psyduck 0307/07 is a Chinese exclusive — this full art only appears in the Simplified Chinese Gem Vol 7 release.' },
    { q: 'When did Gem Vol 7 release?', a: 'November 6, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 7?', a: 'EBI Collectibles carries Gem Vol 7 packs and boxes.' },
  ],
  metaTitle: 'Gem Vol 7 Card List — All 196 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Gem Vol 7 (Simplified Chinese): all 28 Pokémon across 7 rarities each, with full-art Triple Rares and a printable checklist.',
  ogTitle: 'Gem Vol 7 Card List — All 196 Cards',
  ogDescription: 'All 196 cards in Pokémon TCG Gem Vol 7 — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/gem-vol-7')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol7Page,
})

function GemVol7Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/gem-vol-7', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
