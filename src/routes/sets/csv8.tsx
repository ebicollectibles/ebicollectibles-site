import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv8.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/brilliant_fantasy — see csv8-notes.md
// for the full structure/color-theme research this config is based on.
//
// Brilliant Fantasy (Ogerpon / Loyal Three / Pecharunt, Kitakami) is the
// same flat-catalog shape as CSV4–CSV7 and CSV10 (src/data/csv8.json
// sets groupByName: true), with 9 ACE SPEC Rare cards in the main set,
// same as CSV7 — see src/lib/gem-sets/rarity.ts. Chen's counts already
// matched the official odds chart exactly; no rarity corrections needed.
// Applin (023 Common, 155 Common) and Dipplin (024 Uncommon, 156
// Uncommon) each repeat within the main set itself at the same rarity —
// groupByName already shows these together as multiple printings of the
// same name, same as any other reprint pair, so no engine changes were
// needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv8',
  storageKey: 'csv8-have',
  productId: 'pokemon-chinese-brilliant-fantasy-slim-booster-box',
  // Pecharunt ex SAR (the set's mythical) centered, flanked by Teal Mask
  // Ogerpon ex SAR and Bloodmoon Ursaluna ex SAR, with Kieran SAR and
  // the Chinese-exclusive Carmine SAR on the outside.
  fanIds: ['254', '242', '250', '251', '255'],
  fanCaption: "The set's top chase cards",
  // Deep plum and jade teal, from the set's own "璀璨诡幻" logo gradient
  // — distinct from every other CSV set's colors.
  glow1: 'rgb(56 13 40 / .30)',
  glow2: 'rgb(64 155 148 / .25)',
  heroLede:
    'All 264 cards in Brilliant Fantasy: 172 Pokémon across the main 207-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out, including 9 pink-framed ACE SPEC cards — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 208 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '172',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–207 (mixed)',
    'Uncommon (U)': '001–207 (mixed)',
    'Rare (R)': '001–207 (mixed)',
    'Double Rare (RR)': '001–207 (mixed)',
    'ACE SPEC Rare (ACE)': '173, 176, 178, 180, 181, 186, 189, 204, 207',
    'Art Rare (AR)': '208–213',
    'Super Rare (SR)': '214–241',
    'Special Art Rare (SAR)': '242–255',
    'Ultra Rare (UR)': '256–264',
  },
  aboutParagraphs: [
    'Brilliant Fantasy (set code CSV8C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released March 13, 2026 — a Kitakami-themed set built around 172 Pokémon (led by Ogerpon, the Loyal Three and the mythical Pecharunt) plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 264 cards in total.',
    'Every card has its own collector number, 001 through 264. The 207-card main set runs from Common up to Double Rare, and includes 9 ACE SPEC cards — a one-per-deck Trainer/Energy tier printed in a distinct pink frame. The 57 secret rares that follow reprint select cards as Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, the set\'s top chase tier.',
  ],
  faq: [
    { q: 'How many cards are in Brilliant Fantasy?', a: '264 cards: a 207-card main set covering 172 Pokémon plus Trainers, Stadiums, Special Energy and 9 ACE SPEC cards, with 57 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 9 gold cards, including Teal Mask Ogerpon ex. Carmine 255/207, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Brilliant Fantasy's rarity scheme?", a: 'A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'What is an ACE SPEC card?', a: 'A one-per-deck Trainer or Energy card printed in a distinct pink frame — 9 of them sit inside the main set at their own collector numbers.' },
    { q: 'When did Brilliant Fantasy release?', a: 'March 13, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Brilliant Fantasy?', a: 'EBI Collectibles carries Brilliant Fantasy packs and boxes.' },
  ],
  metaTitle: 'Brilliant Fantasy (CSV8) Card List — All 264 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Brilliant Fantasy (CSV8, Simplified Chinese): 172 Pokémon, ACE SPEC Rares, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Carmine.',
  ogTitle: 'Brilliant Fantasy Card List — All 264 Cards',
  ogDescription: 'All 264 cards in Pokémon TCG Brilliant Fantasy — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv8')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv8Page,
})

function Csv8Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv8', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
