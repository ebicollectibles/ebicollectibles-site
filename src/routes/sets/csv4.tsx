import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv4.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/reward_round_csv4 — see csv4-notes.md
// for the full structure/color-theme research this config is based on.
//
// Reward Round (set code CSV4C) is an earlier main numbered CSV expansion
// — same flat-catalog shape as CSV10 (src/data/csv4.json sets
// groupByName: true), and just as clean: one numbering system, no null
// rarities, no missing images, no split cards. The sourcing session
// caught 5 cards Chen mislabeled Uncommon that print as Common (046,
// 065, 068, 073, 100) — already corrected in the JSON, matching the
// official odds chart exactly.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv4',
  storageKey: 'csv4-have',
  productId: 'pokemon-chinese-reward-round-booster-box',
  // Gholdengo ex SAR (a gold mascot fitting a "reward" set) centered,
  // flanked by Pidgeot ex SAR and this set's two Chinese exclusives —
  // Maushold ex SAR and Rika SAR — with the gold Gholdengo ex UR on the
  // outside.
  fanIds: ['159', '157', '156', '158', '162'],
  fanCaption: "The set's top chase cards",
  // Teal and gold, from the set's own "嘉奖回合" logo — distinct from
  // every other CSV set's colors.
  glow1: 'rgb(46 123 134 / .30)',
  glow2: 'rgb(179 130 68 / .25)',
  heroLede:
    'All 165 cards in Reward Round: 114 Pokémon across the main 129-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 130 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '114',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–129 (mixed)',
    'Uncommon (U)': '001–129 (mixed)',
    'Rare (R)': '001–129 (mixed)',
    'Double Rare (RR)': '001–129 (mixed)',
    'Art Rare (AR)': '130–137',
    'Super Rare (SR)': '138–152',
    'Special Art Rare (SAR)': '153–161',
    'Ultra Rare (UR)': '162–165',
  },
  aboutParagraphs: [
    'Reward Round (set code CSV4C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released July 18, 2025 — built around 114 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 165 cards in total.',
    'Every card has its own collector number, 001 through 165. The 129-card main set runs from Common up to Double Rare; the 36 secret rares that follow reprint select cards in rarer treatments — an Art Rare for a handful of main-set Pokémon, a Super Rare and Special Art Rare for its ex Pokémon and top Supporters, and a run of gold Ultra Rares as the set\'s top chase cards.',
  ],
  faq: [
    { q: 'How many cards are in Reward Round?', a: '165 cards: a 129-card main set covering 114 Pokémon plus Trainers, Stadiums and Special Energy, with 36 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 4 gold cards, including Gholdengo ex (162/129). Maushold ex 158/129 and Rika 159/129, both Special Art Rares, are this set's two Chinese exclusives." },
    { q: "What's Reward Round's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'When did Reward Round release?', a: 'July 18, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Reward Round?', a: 'EBI Collectibles carries Reward Round packs and boxes.' },
  ],
  metaTitle: 'Reward Round (CSV4) Card List — All 165 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Reward Round (CSV4, Simplified Chinese): 114 Pokémon, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Maushold ex and Rika.',
  ogTitle: 'Reward Round Card List — All 165 Cards',
  ogDescription: 'All 165 cards in Pokémon TCG Reward Round — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv4')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv4Page,
})

function Csv4Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv4', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
