import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/30th-celebration.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData, RawCard } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/30th_celebration — see
// 30th-celebration-notes.md for the full structure/color-theme research
// this config is based on.
//
// Like Black Bolt and White Flare, 30th Celebration is a flat official
// catalog (src/data/30th-celebration.json sets groupByName: true) — but
// with three irregularities those two sets don't have, all handled here
// rather than in the shared engine, so Chen's sourced JSON stays exactly
// as fetched:
//
// 1. Three numbering systems collide once `id` is derived from `number`
//    (buildGemSetData takes the part before the slash): 33 promos are
//    numbered "001/30th-P"–"033/30th-P", the same leading digits as set
//    cards "001/103"–"033/103", and 8 basic Energy print no number at
//    all (Chen calls them "No. 166"–"No. 173"). normalizeCard() below
//    rewrites a promo's number to "P001/30th-P" (matching its own image
//    filename, P001.webp) and an Energy's to "166/E", so every card's id
//    is unique before the engine ever sees it.
// 2. 71 cards (30 classic reprints, 8 Energy, 33 promos) have no rarity
//    on Chen at all — rather than invent a tier in the data, those stay
//    `rarity: null` in the JSON and normalizeCard() gives each a neutral
//    display label here (RARITY_CODE/SYMBOL reuse Common's gray for all
//    three, see src/lib/gem-sets/rarity.ts).
// 3. 4 cards (119, 128, 129, 131) have no image on Chen at all — the
//    engine renders a "coming soon" placeholder for a null `image`
//    instead of hiding the card.

const sourced = rawData as GemSetData

// "No. 166" -> "166/E" (a real, unique 3-digit id — 166-173 is free,
// since the numbered set cards stop at 165). "001/30th-P" -> "P001/30th-P"
// (matches that card's own image filename, P001.webp — set cards never
// start with "P", so this can't collide with them either).
function normalizeNumber(c: RawCard): string {
  if (c.number.startsWith('No. ')) return `${String(c.pokemonIndex).padStart(3, '0')}/E`
  if (c.number.endsWith('/30th-P')) return `P${c.number}`
  return c.number
}

function normalizeRarity(c: RawCard): string {
  if (c.rarity) return c.rarity
  if (c.pokemonIndex >= 1001) return 'Promo'
  if (c.pokemonIndex >= 166) return 'Basic Energy'
  return 'Classic Reprint'
}

const raw: GemSetData = {
  ...sourced,
  // The 3 unrated blocks get their own chips/odds-table rows alongside
  // Chen's 7 real tiers, once normalizeRarity() has labeled every card.
  rarityOrder: [...sourced.rarityOrder, 'Classic Reprint', 'Basic Energy', 'Promo'],
  cards: sourced.cards.map((c) => ({ ...c, number: normalizeNumber(c), rarity: normalizeRarity(c) })),
}
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/30th-celebration',
  storageKey: '30th-celebration-have',
  productId: 'pokemon-chinese-30th-celebration-booster-box',
  // Pikachu ex SAR (the anniversary mascot, main named-tier chase card),
  // flanked by the set's two Futuristic Rares, with classic Charizard
  // and the Chinese-exclusive Ditto AR on the outside.
  fanIds: ['126', '134', '135', '137', '121'],
  fanCaption: '30th-anniversary chase cards',
  // Anniversary gold and deep cocoa, lifted from the set's own logo —
  // no Gem Pack magenta, and distinct from Black Bolt/White Flare's
  // blue/teal and red/peach.
  glow1: 'rgb(222 185 97 / .30)',
  glow2: 'rgb(90 45 5 / .25)',
  heroLede:
    "All 206 cards in 30th Celebration: 100 Pokémon across the main 103-card set (plus 3 Trainers), 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares, 30 classic reprints spanning the TCG's history, 8 basic Energy and 33 promos. Tap any card for a closer look and every other printing beside it.",
  pokemonFact: '100',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–103 (mixed)',
    'Rare (R)': '001–103 (mixed)',
    'Pikachu Rare': '017–046',
    'Double Rare (RR)': '001–103 (mixed)',
    'Art Rare (AR)': '104–123',
    'Special Art Rare (SAR)': '124–133',
    'Futuristic Rare (FUR)': '134–135',
    'Classic Reprint': '136–165',
    'Basic Energy': '166–173',
    Promo: 'P001–P033',
  },
  aboutParagraphs: [
    "30th Celebration (set code 30thC) is an officially-licensed Pokémon TCG special set marking the franchise's 30th anniversary, released September 16, 2026. It isn't part of a numbered main expansion or Chen's own Gem Pack branding — it's a standalone celebration set built around a 100-Pokémon main lineup, 30 reprints of famous cards from the TCG's history, and its own promo line.",
    "The 165 numbered set cards run 001–103 for the main set (100 Pokémon plus 3 Trainers, across Common, Rare, a set-specific Pikachu Rare tier for 30 different Pikachu, and Double Rare) and 104–165 for secret rares: Art Rares, Special Art Rares, two Futuristic Rares (Mewtwo ex and Mew ex), and 30 classic reprints of cards spanning the TCG's history in their original frames. 8 basic Energy and 33 promos (27 starter Pokémon across all 9 generations plus 6 ex) round out the set at 206 cards total. Chen gives no rarity for the classic reprints, Energy or promos — they're shown here under their own neutral labels rather than a guessed tier.",
  ],
  faq: [
    { q: 'How many cards are in 30th Celebration?', a: "206 cards: 165 numbered set cards (100 Pokémon plus 3 Trainers in the main 103-card set, plus Art Rares, Special Art Rares, Futuristic Rares and 30 classic reprints as secret rares), 8 basic Energy and 33 promos." },
    { q: 'What are the chase cards?', a: 'Mewtwo ex and Mew ex (134/103, 135/103) are the set\'s only Futuristic Rares, its highest named tier. Ditto 121/103, an Art Rare, is this set\'s pullable Chinese exclusive — English only released it as a separate promo.' },
    { q: "What's 30th Celebration's rarity scheme?", a: 'Common, Rare, a set-specific Pikachu Rare tier (30 different Pikachu), Double Rare, Art Rare, Special Art Rare and Futuristic Rare, plus unrated classic reprints, Energy and promos — different from every other EBI card list.' },
    { q: 'What is the Pikachu Rare tier?', a: "A 30-card run (017–046) of different Pikachu, each with its own art and a Pikachu-face holo pattern — unique to this set, with no official odds chart confirming its exact rank." },
    { q: 'When did 30th Celebration release?', a: 'September 16, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy 30th Celebration?', a: 'EBI Collectibles carries 30th Celebration packs and boxes.' },
  ],
  metaTitle: '30th Celebration Card List — All 206 Cards | EBI Collectibles',
  metaDescription:
    "Browse every card in Pokémon TCG 30th Celebration (Simplified Chinese): 100 Pokémon, the Pikachu Rare tier, Art Rares, Special Art Rares, Futuristic Rares, 30 classic reprints, Energy and promos.",
  ogTitle: '30th Celebration Card List — All 206 Cards',
  ogDescription: 'All 206 cards in Pokémon TCG 30th Celebration — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/30th-celebration')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^P?\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: ThirtiethCelebrationPage,
})

function ThirtiethCelebrationPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/30th-celebration', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
