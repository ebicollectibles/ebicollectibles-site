import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-3.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 4-7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_3 — see gem-vol-3-notes.md for
// the structure/color-theme research this config is based on.
//
// Gem Vol 3 is structurally different from Vol 4-7: 18 Pokémon (not 28),
// plus a 4-card Trainer block and a 6-card Energy block that don't fit
// the "one creature's 7-rarity ladder" shape — src/data/gem-vol-3.json's
// catalogGroups field tells the shared engine to group those by matching
// name instead of simple adjacency. Half the Pokémon also have a Rare
// "ex" card in their version-07 slot instead of a Triple Rare full art,
// which is why this config overrides the auto-derived hero copy and
// odds-table labels instead of letting them be computed — see
// src/lib/gem-sets/buildSetData.ts for why the normal derivation can't
// state this set's structure accurately.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/gem-vol-3',
  storageKey: 'gem3-have',
  productId: 'pokemon-chinese-gem-volume-3-booster-box',
  // All 5 of this set's Chinese exclusives, sharing one night-time town
  // scene — Gengar, the most recognizable, centered.
  fanIds: ['0207', '0407', '0307', '1107', '1507'],
  // Gem Vol 3's Gem Pack branding is the same magenta family as Vol 4-6,
  // paired here with a warm lantern peach to echo the exclusives' night-
  // town lantern glow — distinct from Vol 4 (coral), Vol 5 (gold), Vol 6
  // (green) and Vol 7 (plum/blue).
  glow1: 'rgb(196 26 118 / .30)',
  glow2: 'rgb(214 169 151 / .25)',
  heroLede:
    'All 136 cards in Gem Vol 3 (Gem 3): 18 Pokémon in 7 versions each, topped by 9 Triple Rare full arts and 9 Pokémon ex, plus 4 Trainer cards and 6 Energy cards. Tap any card for a closer look and every version beside it.',
  pokemonFact: '18 × 7',
  rarityVersionLabelsOverride: {
    Common: '01–02',
    Uncommon: '03–04',
    Rare: '05 + 9 ex',
    'Double Rare': '06 + 3 Trainers',
    'Triple Rare': '9 full arts + Arven + 6 Energy',
  },
  aboutParagraphs: [
    'Gem Vol 3 (Gem Pack Vol. 3, set code CBB3C) is the third Simplified Chinese Gem Pack, released September 26, 2025. It is a night-time set with Gengar on the pack and plenty of Ghost and Dark types. It has 136 cards: 18 Pokémon, 4 Trainer cards and 6 Energy cards, and every card is a holo.',
    'Each Pokémon has 7 versions. Versions 01–02 are Common, 03–04 Uncommon, 05 Rare and 06 Double Rare. Version 07 is either a Triple Rare full art (Meowth, Gengar, Cubone, Mismagius, Chandelure, Mimikyu, Morpeko, Ceruledge and Greavard) or a Pokémon ex at Rare (Clefable, Houndoom, Gardevoir, Banette, Absol, Darkrai, Lycanroc, Houndstone and Annihilape). The Trainer block has Super Rod, Nest Ball and Switch (Double Rare) and a full-art Arven (Triple Rare). The Energy block has Basic Fighting Energy, Basic Metal Energy and Luminous Energy, each printed twice, all Triple Rare.',
  ],
  faq: [
    { q: 'How many cards are in Gem 3?', a: '136 cards: 18 Pokémon with 7 versions each, plus 4 Trainer cards and 6 Energy cards. By rarity that is 36 Common, 36 Uncommon, 27 Rare, 21 Double Rare and 16 Triple Rare.' },
    {
      q: 'What are the chase cards?',
      a: 'The five full arts drawn for this set: Meowth 0207/07 by Makura Tami, Gengar 0307/07 by aspara, Cubone 0407/07 by Katsunori Sato, Chandelure 1107/07 by satoma and Ceruledge 1507/07 by kodama. All five are Triple Rare Chinese Exclusives, found only in Gem Vol 3.',
    },
    {
      q: "What's a Pokémon ex card?",
      a: 'Nine Pokémon (Clefable, Houndoom, Gardevoir, Banette, Absol, Darkrai, Lycanroc, Houndstone and Annihilape) have a Pokémon ex at version 07, at Rare. The other nine get a Triple Rare full art in that slot.',
    },
    { q: 'When did Gem Vol 3 release?', a: 'September 26, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 3?', a: 'EBI Collectibles carries Gem Vol 3 packs and boxes.' },
  ],
  metaTitle: 'Pokémon Gem Pack Vol. 3 (Gem 3) Card List: All 136 Cards | EBI Collectibles',
  metaDescription:
    'All 136 cards in Pokémon Gem Pack Vol. 3 (CBB3C), Simplified Chinese: 18 Pokémon, 9 Pokémon ex, Trainers, Energy and 5 Chinese Exclusive full arts.',
  ogTitle: 'Pokémon Gem Pack Vol. 3 (Gem 3) Card List: All 136 Cards',
  ogDescription: 'All 136 cards in Pokémon Gem Pack Vol. 3 (CBB3C). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/gem-vol-3')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/gem-vol-3' } }).catch(() => []),
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol3Page,
})

function GemVol3Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gem-vol-3', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
