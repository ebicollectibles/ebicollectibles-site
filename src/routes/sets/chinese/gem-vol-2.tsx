import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/gem-vol-2.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

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
  routePath: '/sets/chinese/gem-vol-2',
  storageKey: 'gem2-have',
  productId: 'pokemon-chinese-gem-volume-2-booster-box',
  // Just this set's 4 real exclusives — the version-15 full-art
  // illustrations for Eevee, Umbreon, Leafeon and Sylveon — no filler
  // card added to pad it out to 5; the fan lays out 4 just as well.
  fanIds: ['0615', '0715', '0115', '0915'],
  // Gem Vol 2's Gem Pack branding is the same magenta family as Vol 3-6,
  // paired here with a soft forest teal echoing the 4 exclusives' sunlit
  // style — distinct from Vol 3 (lantern peach), Vol 4 (coral), Vol 5
  // (gold), Vol 6 (green) and Vol 7 (plum/blue).
  glow1: 'rgb(194 23 116 / .30)',
  glow2: 'rgb(86 134 135 / .25)',
  heroLede:
    'All 140 cards in Gem Vol 2 (Gem 2): Eevee and all 8 Eeveelutions, each in 14 or 15 versions up to a V and a VMAX, plus 4 Trainer cards and 6 Energy cards. Eevee, Umbreon, Leafeon and Sylveon also get a Chinese Exclusive full art. Tap any card for a closer look and every version beside it.',
  pokemonFact: '9 × 14–15',
  rarityVersionLabelsOverride: {
    Common: '01–04',
    Uncommon: '05–08',
    Rare: '09–10 + 9 V',
    'Double Rare': '11–12 + 3 Trainers',
    'Triple Rare': '9 VMAX + 4 full arts + Penny + 6 Energy',
  },
  aboutParagraphs: [
    'Gem Vol 2 (Gem Pack Vol. 2, set code CBB2C) is the second Simplified Chinese Gem Pack, released May 16, 2025. It is an Eevee set with 140 cards: Eevee and all 8 Eeveelutions, 4 Trainer cards and 6 Energy cards. Every card is a holo.',
    'Each Pokémon has 14 versions. Versions 01 to 12 alternate between two different base cards, with different art and attacks, across Common (01–04), Uncommon (05–08), Rare (09–10) and Double Rare (11–12). Version 13 is the Pokémon V, a Rare, and version 14 is the VMAX, a Triple Rare. Eevee, Umbreon, Leafeon and Sylveon get a 15th version: a Triple Rare full art by HYOGONOSUKE and a Chinese Exclusive. The Trainer block has Poké Ball, Level Ball and Quick Ball (Double Rare) and a full-art Penny (Triple Rare). The Energy block has Basic Lightning, Basic Psychic and Basic Darkness Energy, each printed twice, all Triple Rare.',
  ],
  faq: [
    { q: 'How many cards are in Gem 2?', a: '140 cards: 9 Pokémon (Eevee and its 8 Eeveelutions) in 14 or 15 versions each, plus 4 Trainer cards and 6 Energy cards. By rarity that is 36 Common, 36 Uncommon, 27 Rare, 21 Double Rare and 20 Triple Rare.' },
    {
      q: 'What are the chase cards?',
      a: 'The four full arts by HYOGONOSUKE: Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15. All four are Triple Rare Chinese Exclusives, found only in Gem Vol 2, and side by side they form one forest scene.',
    },
    {
      q: "What's a V or VMAX card?",
      a: 'Each of the 9 Pokémon has a Pokémon V at version 13 (Rare) and a VMAX at version 14 (Triple Rare), on top of its 12 regular Common to Double Rare versions.',
    },
    { q: 'When did Gem Vol 2 release?', a: 'May 16, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 2?', a: 'EBI Collectibles carries Gem Vol 2 packs and boxes.' },
  ],
  metaTitle: 'Pokémon Gem Pack Vol. 2 (Gem 2) Card List: All 140 Cards | EBI Collectibles',
  metaDescription:
    'All 140 cards in Pokémon Gem Pack Vol. 2 (CBB2C), Simplified Chinese: Eevee and all 8 Eeveelutions with V and VMAX, plus 4 Chinese Exclusive full arts.',
  ogTitle: 'Pokémon Gem Pack Vol. 2 (Gem 2) Card List: All 140 Cards',
  ogDescription: 'All 140 cards in Pokémon Gem Pack Vol. 2 (CBB2C). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/gem-vol-2')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/gem-vol-2' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{4}$/),
  head: () => buildGemSetHead(data, config),
  component: GemVol2Page,
})

function GemVol2Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gem-vol-2', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
