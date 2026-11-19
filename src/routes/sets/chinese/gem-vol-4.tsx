import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/gem-vol-4.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 5, 6 and 7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_4 — see gem-vol-4-notes.md for
// the structure/color-theme research this config is based on.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/gem-vol-4',
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
    'Gem Vol 4 (Gem Pack Vol. 4, set code CBB4C) is the fourth Simplified Chinese Gem Pack, released February 6, 2026, in time for Lunar New Year. Ponyta leads the set, a fitting pick for the Year of the Horse. It has 196 cards built around 28 Pokémon, and every card is a holo. None of the Pokémon belong to a Trainer this time. The lineup runs from Ponyta, Eevee and Sawsbuck to Enamorus and the Paradox Pokémon Flutter Mane.',
    'Every Pokémon has 7 versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is a full-art Triple Rare. Card numbers read as Pokémon number then version, so 0107/07 is version 7 of Pokémon 01.',
  ],
  faq: [
    { q: 'How many cards are in Gem 4?', a: '196 cards: 28 Pokémon with 7 versions each. By rarity that is 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
    { q: 'What are the chase cards?', a: 'Ponyta 0107/07, a full art by MINAMINAMI Take drawn for this set. It is a Triple Rare Chinese Exclusive, found only in Gem Vol 4. Beyond Ponyta, collectors chase the other 27 full arts, every card numbered 07.' },
    { q: 'When did Gem Vol 4 release?', a: 'February 6, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 4?', a: 'EBI Collectibles carries Gem Vol 4 packs and boxes.' },
  ],
  metaTitle: 'Pokémon Gem Pack Vol. 4 (Gem 4) Card List: All 196 Cards | EBI Collectibles',
  metaDescription:
    'All 196 cards in Pokémon Gem Pack Vol. 4 (CBB4C), Simplified Chinese: 28 Pokémon in 7 versions each, 28 full arts and the Chinese Exclusive Ponyta.',
  ogTitle: 'Pokémon Gem Pack Vol. 4 (Gem 4) Card List: All 196 Cards',
  ogDescription: 'All 196 cards in Pokémon Gem Pack Vol. 4 (CBB4C). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/gem-vol-4')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/gem-vol-4' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{4}$/),
  head: () => buildGemSetHead(data, config),
  component: GemVol4Page,
})

function GemVol4Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gem-vol-4', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
