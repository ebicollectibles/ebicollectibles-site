import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/30th-celebration.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData, RawCard } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

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
  routePath: '/sets/chinese/30th-celebration',
  storageKey: '30th-celebration-have',
  productId: 'pokemon-chinese-30th-celebration-booster-box',
  // Pikachu ex SAR (the anniversary mascot, main named-tier chase card),
  // flanked by the set's two Futuristic Rares, with classic Charizard
  // and the Ditto AR on the outside — Ditto is pullable here, where
  // English only ever released it as a separate promo, but the card
  // itself isn't exclusive to this release, so it carries no "Chinese
  // exclusive" tag (exclusiveCardNumbers in src/data/30th-celebration.json
  // is empty; this set has none).
  fanIds: ['126', '134', '135', '137', '121'],
  fanCaption: '30th-anniversary chase cards',
  // Anniversary gold and deep cocoa, lifted from the set's own logo —
  // no Gem Pack magenta, and distinct from Black Bolt/White Flare's
  // blue/teal and red/peach.
  glow1: 'rgb(222 185 97 / .30)',
  glow2: 'rgb(90 45 5 / .25)',
  heroLede:
    "All 206 cards in 30th Celebration, led by 30 different Pikachu, one in every pack: the 103-card main set (100 Pokémon plus 3 Trainers), 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares, 30 classic reprints, 8 basic Energy and 33 promos. Tap any card for a closer look and every other printing beside it.",
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
    "30th Celebration is an official Simplified Chinese Pokémon TCG special set for the franchise's 30th anniversary, released September 16, 2026. It is not a Gem Pack or part of a numbered main series. It is a standalone set with a 103-card main set, secret rares, 30 classic reprints and its own promo line. Every card is a holo, and every pack has one of the 30 Pikachu.",
    "The main set runs 001–103: 100 Pokémon and 3 Trainers (Poké Pad, Switch and Ultra Ball). Its rarities are Common, Rare, Double Rare and a Pikachu Rare tier made for this set, 30 different Pikachu numbered 017–046. There is no Uncommon tier. The secret rares run 104–165: 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares (Mewtwo ex and Mew ex) and 30 classic reprints of famous cards from 1999 to 2023 in their original frames. Eight basic Energy cards and 33 promos sit outside the numbered set. The promos come in special products, not booster packs. The classic reprints, Energy and promos have no standard rarity tier, so they are listed here as Classic Reprint, Basic Energy and Promo.",
  ],
  faq: [
    { q: 'How many cards are in 30th Celebration?', a: '206 cards: 165 numbered set cards (the 103-card main set plus 62 secret rares: 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares and 30 classic reprints), 8 basic Energy and 33 promos.' },
    { q: 'What are the chase cards?', a: "Mewtwo ex 134/103 and Mew ex 135/103, the set's only Futuristic Rares, a rarity made for this set. Pokémon China's odds chart puts them in its rarest band with the Special Art Rares. Ditto 121/103, an Art Rare, is another one to note: in English that art was only released as a promo, but here it comes out of booster packs." },
    { q: "What's 30th Celebration's rarity scheme?", a: 'Common, Rare, Pikachu Rare, Double Rare, Art Rare, Special Art Rare and Futuristic Rare. There is no Uncommon tier. The classic reprints, basic Energy and promos have no rarity tier.' },
    { q: 'What is the Pikachu Rare tier?', a: "A run of 30 different Pikachu, numbered 017–046, each with its own art and a Pikachu-face holo pattern. It only exists in this set. Every pack has one, and Pokémon China's odds chart groups them with the Commons and basic Energy in its most common band." },
    { q: 'When did 30th Celebration release?', a: 'September 16, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy 30th Celebration?', a: 'EBI Collectibles carries 30th Celebration packs and boxes.' },
  ],
  metaTitle: 'Pokémon TCG 30th Celebration Card List: All 206 Cards | EBI Collectibles',
  metaDescription:
    'All 206 cards in Pokémon 30th Celebration, Simplified Chinese: 30 Pikachu, Art Rares, SARs, 2 Futuristic Rares, 30 classic reprints, Energy and promos.',
  ogTitle: 'Pokémon TCG 30th Celebration Card List: All 206 Cards',
  ogDescription: 'All 206 cards in Pokémon 30th Celebration (Simplified Chinese). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/30th-celebration')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/30th-celebration' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^P?\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: ThirtiethCelebrationPage,
})

function ThirtiethCelebrationPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/30th-celebration', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
