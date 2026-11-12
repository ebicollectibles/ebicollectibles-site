import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv6.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/true_mystic — see csv6-notes.md for the
// full structure/color-theme research this config is based on. Chen's
// own display name for it is "True Mystic" (真实玄虚), but the store's
// existing product listing calls it "True Mystery" — `name` matches
// that for consistency, same as CSV9.5's "Terastal Gathering".
//
// CSV6 is the same flat-catalog shape as CSV4, CSV5 and CSV10
// (src/data/csv6.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. Chen has no
// official odds chart for this set (unlike every other Chinese SV set);
// the sourcing session checked every Common/Uncommon card's printed
// rarity letter by hand instead and found no corrections needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv6',
  storageKey: 'csv6-have',
  productId: 'pokemon-chinese-true-mystery-slim-booster-box',
  // Roaring Moon ex SAR (the headline Ancient Paradox) centered, flanked
  // by its Future counterpart Iron Valiant ex SAR and the Chinese-
  // exclusive Iron Hands ex SAR, with Geeta SAR and the gold Roaring
  // Moon ex UR on the outside.
  fanIds: ['157', '153', '155', '152', '161'],
  fanCaption: "The set's top chase cards",
  // Mystic indigo and teal, from the set's own "真实玄虚" logo gradient —
  // a Paradox (Ancient/Future) set, distinct from every other CSV set's
  // colors.
  glow1: 'rgb(64 58 113 / .30)',
  glow2: 'rgb(40 133 151 / .25)',
  heroLede:
    'All 163 cards in True Mystery: 113 Pokémon across the main 128-card set — Items, Pokémon Tools, Supporters and Stadiums round it out — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 129 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '113',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–128 (mixed)',
    'Uncommon (U)': '001–128 (mixed)',
    'Rare (R)': '001–128 (mixed)',
    'Double Rare (RR)': '001–128 (mixed)',
    'Art Rare (AR)': '129–136',
    'Super Rare (SR)': '137–151',
    'Special Art Rare (SAR)': '152–159',
    'Ultra Rare (UR)': '160–163',
  },
  aboutParagraphs: [
    'True Mystery (set code CSV6C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 7, 2025 — an Ancient/Future Paradox-themed set built around 113 Pokémon plus Items, Pokémon Tools, Supporters and Stadiums, for 163 cards in total.',
    'Every card has its own collector number, 001 through 163. The 128-card main set runs from Common up to Double Rare; the 35 secret rares that follow reprint select cards in rarer treatments — an Art Rare for a handful of main-set Pokémon, a Super Rare and Special Art Rare for its ex Pokémon and top Supporters, and a run of gold Ultra Rares as the set\'s top chase cards.',
  ],
  faq: [
    { q: 'How many cards are in True Mystery?', a: '163 cards: a 128-card main set covering 113 Pokémon plus Trainers and Stadiums, with 35 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 4 gold cards, including Roaring Moon ex (161/128). Iron Hands ex 152/128, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's True Mystery's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'When did True Mystery release?', a: 'November 7, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy True Mystery?', a: 'EBI Collectibles carries True Mystery packs and boxes.' },
  ],
  metaTitle: 'True Mystery (CSV6) Card List — All 163 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG True Mystery (CSV6, Simplified Chinese): 113 Pokémon, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Iron Hands ex.',
  ogTitle: 'True Mystery Card List — All 163 Cards',
  ogDescription: 'All 163 cards in Pokémon TCG True Mystery — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv6')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv6Page,
})

function Csv6Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv6', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
