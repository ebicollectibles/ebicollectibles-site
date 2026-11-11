import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv10.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/chasing_glory — see csv10-notes.md for
// the full structure/color-theme research this config is based on.
//
// CSV10 (Chasing Glory) is the main numbered expansion in the same
// Chinese Scarlet & Violet era as Black Bolt (CSV10.5C) and White Flare
// (CSV10.6C) — same flat-catalog shape (src/data/csv10.json sets
// groupByName: true) and the cleanest of the four non-Gem sets so far:
// one numbering system, no null rarities, no missing images, no split
// cards. Its rarity scheme reuses 6 of Black Bolt/White Flare's 8 tier
// names, swapping their Black White Rare for its own top tier, Ultra
// Rare (UR) — see src/lib/gem-sets/rarity.ts.
//
// Many Pokémon here carry a trainer's name ("Team Rocket's Mewtwo ex"),
// and the plain and owned versions of the same species are different
// cards (e.g. 043 Psyduck vs 045 Misty's Psyduck) — groupByName already
// matches by the card's full name, so this falls out for free. A few
// Trainer cards also contain "'s " (e.g. "Team Rocket's Great Ball");
// the engine's owner/name split still reads fine for those (it just
// shows the trainer's name on its own line above the card name, same as
// for a Pokémon), so no special-casing was needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv10',
  storageKey: 'csv10-have',
  productId: 'pokemon-chinese-chasing-glory-slim-booster-box',
  // Team Rocket's Mewtwo ex's SAR (the set's headline Pokémon — Team
  // Rocket is the main theme) centered, flanked by two more Special Art
  // Rares and this set's Chinese exclusive, Brock's Scouting.
  fanIds: ['268', '264', '279', '269', '276'],
  fanCaption: "The set's top chase cards",
  // Blaze orange and ember-black, from the set's own "Chasing Glory"
  // logo gradient — warmer than White Flare's flame red, and distinct
  // from every other set's colors.
  glow1: 'rgb(232 129 61 / .30)',
  glow2: 'rgb(29 16 19 / .25)',
  heroLede:
    'All 287 cards in Chasing Glory: 188 Pokémon across the main 222-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out — plus Art Rares, Super Rares, Special Art Rares and Ultra Rares as secret rares from 223 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '188',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–222 (mixed)',
    'Uncommon (U)': '001–222 (mixed)',
    'Rare (R)': '001–222 (mixed)',
    'Double Rare (RR)': '001–222 (mixed)',
    'Art Rare (AR)': '223–228',
    'Super Rare (SR)': '229–261',
    'Special Art Rare (SAR)': '262–279',
    'Ultra Rare (UR)': '280–287',
  },
  aboutParagraphs: [
    "Chasing Glory (set code CSV10C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released July 16, 2026 — the main numbered set that Black Bolt and White Flare follow. It's built around 188 Pokémon (many of them partnered with a trainer, Team Rocket's cards alone number 46) plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 287 cards in total.",
    'Every card has its own collector number, 001 through 287. The 222-card main set runs from Common up to Double Rare; the 65 secret rares that follow reprint select cards in rarer treatments — an Art Rare for a handful of main-set Pokémon, a Super Rare and Special Art Rare for its ex Pokémon and top Supporters, and a run of gold Ultra Rares as the set\'s top chase cards.',
  ],
  faq: [
    { q: 'How many cards are in Chasing Glory?', a: '287 cards: a 222-card main set covering 188 Pokémon plus Trainers, Stadiums and Special Energy, with 65 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 8 gold cards, including Team Rocket's Mewtwo ex (282/222). Brock's Scouting 276/222, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Chasing Glory's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'How does Chasing Glory relate to Black Bolt and White Flare?', a: "Chasing Glory is the main numbered CSV10 set; Black Bolt (CSV10.5C) and White Flare (CSV10.6C) are the two half-sets that followed it." },
    { q: 'When did Chasing Glory release?', a: 'July 16, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Chasing Glory?', a: 'EBI Collectibles carries Chasing Glory packs and boxes.' },
  ],
  metaTitle: 'Chasing Glory (CSV10) Card List — All 287 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Chasing Glory (CSV10, Simplified Chinese): 188 Pokémon, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Brock\'s Scouting.',
  ogTitle: 'Chasing Glory Card List — All 287 Cards',
  ogDescription: 'All 287 cards in Pokémon TCG Chasing Glory — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv10')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv10Page,
})

function Csv10Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv10', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
