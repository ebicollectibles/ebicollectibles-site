import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv9-5.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/crystal_gathering — see
// csv9-5-notes.md for the full structure/color-theme research this
// config is based on. Chen's own name for it, 太晶盛聚, translates
// literally to "Crystal Gathering" (src/data/csv9-5.json keeps that in
// `source`), but the store's existing product listing calls it
// "Terastal Gathering" — `name` matches that for consistency.
//
// CSV9.5, the ".5" special set between CSV9C and CSV10C (Chasing
// Glory), is the same flat-catalog shape as Black Bolt, White Flare and
// CSV10 (src/data/csv9-5.json sets groupByName: true), and just as
// clean as CSV10 — one numbering system, no null rarities, no missing
// images. It adds one rarity tier CSV10 doesn't have, ACE SPEC Rare
// (see src/lib/gem-sets/rarity.ts), and — as a compilation-style set —
// 11 secret rares with no main-set printing to pair with (they just
// show as a single-version "group", same as any other card with no
// reprint) plus a couple of same-name, same-rarity art variants (two
// Sylveon ex SARs, two Eevee ex SARs, two "Atticus" SRs) that
// groupByName already shows together as multiple versions, same as a
// normal reprint — no engine changes were needed for either case.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv9-5',
  storageKey: 'csv9-5-have',
  productId: 'pokemon-chinese-terastal-gathering-booster-box',
  // Umbreon ex's SAR (the set's headline chase in this Eeveelution-heavy
  // set) centered, flanked by an Eevee ex SAR, the Chinese-exclusive
  // Sylveon ex SAR, the Terastal legendary, and the gold Pikachu ex UR.
  fanIds: ['245', '239', '234', '248', '258'],
  fanCaption: "The set's top chase cards",
  // Deep Tera teal and coral, from the set's own Tera-crystal rainbow
  // logo — distinct from CSV10 (orange/ember-black), Black Bolt/White
  // Flare and 30th Celebration (gold/cocoa).
  glow1: 'rgb(71 118 121 / .30)',
  glow2: 'rgb(216 123 115 / .25)',
  heroLede:
    "All 259 cards in Terastal Gathering: 156 Pokémon across the main 208-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out, including 8 pink-framed ACE SPEC cards — plus Super Rares, Special Art Rares and Ultra Rares as secret rares from 209 up. Tap any card for a closer look and every other printing beside it.",
  pokemonFact: '156',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–208 (mixed)',
    'Uncommon (U)': '001–208 (mixed)',
    'Rare (R)': '001–208 (mixed)',
    'Double Rare (RR)': '001–208 (mixed)',
    'ACE SPEC Rare (ACE)': '163, 166, 168, 169, 172, 179, 205, 208',
    'Super Rare (SR)': '209–220',
    'Special Art Rare (SAR)': '221–254',
    'Ultra Rare (UR)': '255–259',
  },
  aboutParagraphs: [
    "Terastal Gathering (set code CSV9.5C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released June 12, 2026 — a \".5\" special set between CSV9C and CSV10C (Chasing Glory), built around an Eeveelution-heavy lineup of 156 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 259 cards in total.",
    "Every card has its own collector number, 001 through 259. The 208-card main set runs from Common up to Double Rare, and includes 8 ACE SPEC cards — a one-per-deck Trainer/Energy tier printed in a distinct pink frame. The 51 secret rares that follow reprint select cards as Super Rares, Special Art Rares and gold Ultra Rares, the set's top chase tier.",
  ],
  faq: [
    { q: 'How many cards are in Terastal Gathering?', a: '259 cards: a 208-card main set covering 156 Pokémon plus Trainers, Stadiums, Special Energy and 8 ACE SPEC cards, with 51 secret rares (Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 5 gold cards, including Pikachu ex. Sylveon ex 234/208, a Special Art Rare, is this set's Chinese exclusive — it shares its name and rarity with a second Sylveon ex SAR (233), so look for the number." },
    { q: "What's Terastal Gathering's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'What is an ACE SPEC card?', a: 'A one-per-deck Trainer or Energy card printed in a distinct pink frame — 8 of them sit inside the main set at their own collector numbers.' },
    { q: 'When did Terastal Gathering release?', a: 'June 12, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Terastal Gathering?', a: 'EBI Collectibles carries Terastal Gathering packs and boxes.' },
  ],
  metaTitle: 'Terastal Gathering (CSV9.5) Card List — All 259 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Terastal Gathering (CSV9.5, Simplified Chinese): 156 Pokémon, ACE SPEC Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Sylveon ex.',
  ogTitle: 'Terastal Gathering Card List — All 259 Cards',
  ogDescription: 'All 259 cards in Pokémon TCG Terastal Gathering — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv9-5')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv95Page,
})

function Csv95Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv9-5', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
