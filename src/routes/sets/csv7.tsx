import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv7.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/blade_awakening — see csv7-notes.md for
// the full structure/color-theme research this config is based on.
//
// Blade Awakening is the same flat-catalog shape as CSV4–CSV6 and CSV10
// (src/data/csv7.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. It's the first
// set so far to carry 9 ACE SPEC Rare (ACE) cards inside the MAIN set at
// their own Trainer/Energy numbers (pink frame), rather than only as
// secret rares — see src/lib/gem-sets/rarity.ts. The sourcing session
// caught 4 cards Chen mislabeled Uncommon that print as Common (107,
// 130, 132, 173) — already corrected in the JSON.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv7',
  storageKey: 'csv7-have',
  productId: 'pokemon-chinese-blade-awakening-slim-booster-box',
  // Greninja ex SAR (the set's most popular chase) centered, flanked by
  // Raging Bolt ex SAR and Walking Wake ex SAR, with Morty's Conviction
  // SAR and the Chinese-exclusive Ciphermaniac's Codebreaking SAR on
  // the outside.
  fanIds: ['250', '244', '242', '239', '245'],
  fanCaption: "The set's top chase cards",
  // Blade orange and near-black, from the set's own "利刃猛醒" logo
  // gradient — distinct from every other CSV set's colors.
  glow1: 'rgb(208 105 57 / .30)',
  glow2: 'rgb(13 13 18 / .25)',
  heroLede:
    'All 259 cards in Blade Awakening: 173 Pokémon across the main 204-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out, including 9 pink-framed ACE SPEC cards — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 205 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '173',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–204 (mixed)',
    'Uncommon (U)': '001–204 (mixed)',
    'Rare (R)': '001–204 (mixed)',
    'Double Rare (RR)': '001–204 (mixed)',
    'ACE SPEC Rare (ACE)': '176, 178, 180, 181, 183, 186, 187, 189, 203',
    'Art Rare (AR)': '205–210',
    'Super Rare (SR)': '211–236',
    'Special Art Rare (SAR)': '237–250',
    'Ultra Rare (UR)': '251–259',
  },
  aboutParagraphs: [
    'Blade Awakening (set code CSV7C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released January 16, 2026 — built around 173 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 259 cards in total.',
    'Every card has its own collector number, 001 through 259. The 204-card main set runs from Common up to Double Rare, and includes 9 ACE SPEC cards — a one-per-deck Trainer/Energy tier printed in a distinct pink frame. The 55 secret rares that follow reprint select cards as Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, the set\'s top chase tier.',
  ],
  faq: [
    { q: 'How many cards are in Blade Awakening?', a: '259 cards: a 204-card main set covering 173 Pokémon plus Trainers, Stadiums, Special Energy and 9 ACE SPEC cards, with 55 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 9 gold cards, including Greninja ex. Ciphermaniac's Codebreaking 245/204, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Blade Awakening's rarity scheme?", a: 'A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'What is an ACE SPEC card?', a: 'A one-per-deck Trainer or Energy card printed in a distinct pink frame — 9 of them sit inside the main set at their own collector numbers.' },
    { q: 'When did Blade Awakening release?', a: 'January 16, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Blade Awakening?', a: 'EBI Collectibles carries Blade Awakening packs and boxes.' },
  ],
  metaTitle: 'Blade Awakening (CSV7) Card List — All 259 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Blade Awakening (CSV7, Simplified Chinese): 173 Pokémon, ACE SPEC Rares, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Ciphermaniac\'s Codebreaking.',
  ogTitle: 'Blade Awakening Card List — All 259 Cards',
  ogDescription: 'All 259 cards in Pokémon TCG Blade Awakening — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv7')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv7Page,
})

function Csv7Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv7', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
