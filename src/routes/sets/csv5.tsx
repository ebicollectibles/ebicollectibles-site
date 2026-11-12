import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv5.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/dark_crystal_blaze_csv5 — see
// csv5-notes.md for the full structure/color-theme research this config
// is based on. Chen's own name for it, 黑晶炽诚, is this set's own CSV5
// identity, but the store's existing product listing calls it "Black
// Crystal Blaze" — `name` matches that for consistency, same as CSV9.5's
// "Terastal Gathering".
//
// CSV5 is the same flat-catalog shape as CSV4 and CSV10
// (src/data/csv5.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. The sourcing
// session caught one card Chen mislabeled Uncommon that prints as
// Common (112 Cyclizar) — already corrected in the JSON. Two name pairs
// repeat within the main set itself rather than against a secret rare —
// Flamigo (074 Common, 113 Uncommon) and Paldean Student (124, 125, both
// Uncommon) — groupByName already shows these together as multiple
// printings of the same name, same as any other reprint pair, so no
// engine changes were needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv5',
  storageKey: 'csv5-have',
  productId: 'pokemon-chinese-black-crystal-blaze-booster-box',
  // Charizard ex SAR (the set's headline chase) centered, flanked by
  // Garchomp ex SAR and Altaria ex SAR, with the Chinese-exclusive Larry
  // SAR and the gold Charizard ex UR on the outside.
  fanIds: ['157', '154', '155', '156', '162'],
  fanCaption: "The set's top chase cards",
  // Crimson and obsidian, from the set's own "黑晶炽诚" (dark crystal)
  // logo gradient — distinct from every other CSV set's colors.
  glow1: 'rgb(161 23 57 / .30)',
  glow2: 'rgb(44 35 47 / .25)',
  heroLede:
    'All 164 cards in Black Crystal Blaze: 113 Pokémon across the main 129-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 130 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '113',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–129 (mixed)',
    'Uncommon (U)': '001–129 (mixed)',
    'Rare (R)': '001–129 (mixed)',
    'Double Rare (RR)': '001–129 (mixed)',
    'Art Rare (AR)': '130–137',
    'Super Rare (SR)': '138–152',
    'Special Art Rare (SAR)': '153–160',
    'Ultra Rare (UR)': '161–164',
  },
  aboutParagraphs: [
    'Black Crystal Blaze (set code CSV5C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released September 12, 2025 — built around 113 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 164 cards in total.',
    'Every card has its own collector number, 001 through 164. The 129-card main set runs from Common up to Double Rare; the 35 secret rares that follow reprint select cards in rarer treatments — an Art Rare for a handful of main-set Pokémon, a Super Rare and Special Art Rare for its ex Pokémon and top Supporters, and a run of gold Ultra Rares as the set\'s top chase cards.',
  ],
  faq: [
    { q: 'How many cards are in Black Crystal Blaze?', a: '164 cards: a 129-card main set covering 113 Pokémon plus Trainers, Stadiums and Special Energy, with 35 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 4 gold cards, including Charizard ex (162/129). Larry 157/129, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Black Crystal Blaze's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'When did Black Crystal Blaze release?', a: 'September 12, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Black Crystal Blaze?', a: 'EBI Collectibles carries Black Crystal Blaze packs and boxes.' },
  ],
  metaTitle: 'Black Crystal Blaze (CSV5) Card List — All 164 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Black Crystal Blaze (CSV5, Simplified Chinese): 113 Pokémon, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Larry.',
  ogTitle: 'Black Crystal Blaze Card List — All 164 Cards',
  ogDescription: 'All 164 cards in Pokémon TCG Black Crystal Blaze — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv5')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv5Page,
})

function Csv5Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv5', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
