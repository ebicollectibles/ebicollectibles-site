import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/gem-vol-1.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

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
  routePath: '/sets/chinese/gem-vol-1',
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
    'All 115 cards in Gem Vol 1 (Gem 1), the first Gem Pack: the Paldea starters Sprigatito, Fuecoco and Quaxly, their middle evolutions, Captain Pikachu and 9 other Pokémon, plus 4 Trainer cards and 6 Energy cards. Tap any card for a closer look and every version beside it.',
  pokemonFact: '16 × 5–9',
  rarityVersionLabelsOverride: {
    Common: '01–02',
    Uncommon: '03–04',
    Rare: '04–06',
    'Double Rare': '05–07 + 3 Trainers',
    'Triple Rare': '08–09 + Nemona + 6 Energy',
  },
  aboutParagraphs: [
    'Gem Vol 1 (Gem Pack Vol. 1, set code CBB1C) is the first Simplified Chinese Gem Pack, released January 17, 2025. It has 115 cards: 16 Pokémon, 4 Trainer cards and 6 Energy cards, and every card is a holo. The set is built around the Paldea starters Sprigatito, Fuecoco and Quaxly, their middle evolutions Floragato, Crocalor and Quaxwell, and Captain Pikachu.',
    'Sprigatito, Fuecoco, Quaxly and Captain Pikachu each have 9 versions, and the three middle evolutions have 8. Both runs go from Common up to Double Rare, with a shiny-style card at version 06 and an illustration full art at version 08. Version 09 is a Pokémon Horizons full art, and all four are Chinese Exclusives. The other 9 Pokémon have 5 versions each, from Common up to Double Rare. The Trainer block has Poké Ball, Great Ball and Ultra Ball (Double Rare) and a full-art Nemona (Triple Rare). The Energy block has Basic Grass, Basic Fire and Basic Water Energy, each printed twice, all Triple Rare.',
  ],
  faq: [
    { q: 'How many cards are in Gem 1?', a: '115 cards: 16 Pokémon (the three Paldea starters, their middle evolutions, Captain Pikachu and 9 others), 4 Trainer cards and 6 Energy cards. By rarity that is 32 Common, 23 Uncommon, 23 Rare, 19 Double Rare and 18 Triple Rare.' },
    {
      q: 'What are the chase cards?',
      a: 'The four Pokémon Horizons full arts: Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09 and Captain Pikachu 0709/09. All four are Triple Rare Chinese Exclusives, found only in Gem Vol 1.',
    },
    {
      q: "Why is there a card just called \"Pikachu\" in Captain Pikachu's row?",
      a: 'Two cards in that row, 0706/09 and 0708/09, are a different card: an ordinary Pikachu, not Captain Pikachu. The names are correct.',
    },
    { q: 'When did Gem Vol 1 release?', a: 'January 17, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 1?', a: "Gem Vol 1 doesn't currently have a dedicated listing. Browse EBI Collectibles' shop for current Pokémon TCG stock." },
  ],
  metaTitle: 'Pokémon Gem Pack Vol. 1 (Gem 1) Card List: All 115 Cards | EBI Collectibles',
  metaDescription:
    'All 115 cards in Pokémon Gem Pack Vol. 1 (CBB1C), Simplified Chinese: the Paldea starters, Captain Pikachu and four Chinese Exclusive Horizons full arts.',
  ogTitle: 'Pokémon Gem Pack Vol. 1 (Gem 1) Card List: All 115 Cards',
  ogDescription: 'All 115 cards in Pokémon Gem Pack Vol. 1 (CBB1C). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/gem-vol-1')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/gem-vol-1' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{4}$/),
  head: () => buildGemSetHead(data, config),
  component: GemVol1Page,
})

function GemVol1Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gem-vol-1', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
