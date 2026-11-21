import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/jp-30th-celebration-m6a.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData, RawCard } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Draft Japanese set page: noindex, left out of the sitemap and of every
// listing (see src/data/japanese-sets-index.ts). Built on the shared Gem
// Set engine; this file only supplies the set's data and editorial config.
//
// The Japanese 30th CELEBRATION (M6a), from the official Japanese card
// database (product 961): 165 numbered cards plus 8 unnumbered basic
// Energy. Handled the same way as the Chinese 30th Celebration page
// (src/routes/sets/chinese/30th-celebration.tsx), with these differences:
//
// 1. The Energy print no number. The data file calls them "No. 166" to
//    "No. 173" (the site's own convention, not an official number), and
//    normalizeCard() turns that into "166/E" so each id is unique.
// 2. Most cards carry no rarity in the data (`rarity: null`). Unlike the
//    Chinese release, the Japanese 001 to 103 print no rarity letter, and
//    the official database rates only the 10 Double Rares among them. The
//    30 Pikachu print a Pikachu mark with "NN/30" and are listed as
//    Pikachu Rare. The other 63 main-set cards are shown as "No Rarity
//    Mark" rather than given a Common or Rare they do not have; the
//    reprints and Energy get the same neutral labels as the Chinese page.
// 3. There are no promos in the Japanese database for this product.

const sourced = rawData as GemSetData

function normalizeNumber(c: RawCard): string {
  if (c.number.startsWith('No. ')) return `${String(c.pokemonIndex).padStart(3, '0')}/E`
  return c.number
}

function normalizeRarity(c: RawCard): string {
  if (c.rarity) return c.rarity
  if (c.pokemonIndex >= 166) return 'Basic Energy'
  if (c.pokemonIndex >= 136) return 'Classic Reprint'
  return 'No Rarity Mark'
}

const raw: GemSetData = {
  ...sourced,
  name: '30th Celebration',
  // The unrated blocks first, then the printed tiers from most common to
  // rarest, so Futuristic Rare stays the top tier the page keys off.
  rarityOrder: ['No Rarity Mark', 'Basic Energy', 'Classic Reprint', ...sourced.rarityOrder],
  cards: sourced.cards.map((c) => ({ ...c, number: normalizeNumber(c), rarity: normalizeRarity(c) })),
}
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/japanese/30th-celebration-m6a',
  storageKey: 'jp-m6a-have',
  // Pikachu, the anniversary mascot, leads: the Pikachu ex Special Art Rare
  // in the center between the two Futuristic Rares (Mewtwo ex and Mew ex),
  // with the second Pikachu ex Special Art Rare and the classic Charizard
  // reprint on the outside.
  fanIds: ['127', '134', '126', '135', '137'],
  fanCaption: '30th-anniversary chase cards',
  // Anniversary gold and deep cocoa, the same family as the Chinese page.
  glow1: 'rgb(222 185 97 / .30)',
  glow2: 'rgb(90 45 5 / .25)',
  region: { label: 'Japanese', path: '/sets/japanese', listName: 'Japanese Sets' },
  noindex: true,
  heroLede:
    'All 173 cards in the Japanese 30th Celebration (M6a), led by 30 different Pikachu: the 103-card main set (100 Pokémon plus 3 Trainers), 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares, 30 classic reprints and 8 basic Energy. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '100',
  rarityVersionLabelsOverride: {
    'No Rarity Mark': '001–103 (mixed)',
    'Basic Energy': '166–173',
    'Classic Reprint': '136–165',
    'Pikachu Rare': '017–046',
    'Double Rare (RR)': '009–088 (mixed)',
    'Art Rare (AR)': '104–123',
    'Special Art Rare (SAR)': '124–133',
    'Futuristic Rare (FUR)': '134–135',
  },
  aboutParagraphs: [
    '30th Celebration, ポケモンカードゲーム MEGA 拡張パック「30th CELEBRATION」, is the Japanese Pokémon TCG set for the franchise\'s 30th anniversary, released September 16, 2026, with set code M6a. The official site calls it the series\' first global simultaneous release. Every card in a pack is holo: a pack has 6 cards, one of them a basic Energy, and a box has 20 packs.',
    'The main set runs 001 to 103: 100 Pokémon and 3 Trainers (Ultra Ball, Poké Pad and Switch), with 30 different Pikachu at 017 to 046, each drawn by a different illustrator and marked 1/30 to 30/30. In the main set, the official card database gives a rarity only to the 10 Double Rare ex, and the 30 Pikachu carry their own 1/30 to 30/30 mark. The other 63 main-set cards have no rarity, so they are listed here as No Rarity Mark. After the main set come 20 Art Rares, 10 Special Art Rares and 2 Futuristic Rares (Mewtwo ex and Mew ex), then 30 classic reprints numbered 136 to 165, chosen to mark the series\' 30 years. Darkrai & Cresselia LEGEND takes two numbers, 151 and 152.',
    'The 8 basic Energy, designed by YOSHIROTTEN, print no collector number. They are listed here as 166 to 173 so each one has its own place in the checklist.',
  ],
  faq: [
    { q: 'How many cards are in the Japanese 30th Celebration?', a: '173 cards: 165 numbered cards (the 103-card main set, 20 Art Rares, 10 Special Art Rares, 2 Futuristic Rares and 30 classic reprints) plus 8 basic Energy with no number.' },
    { q: 'Is it the same as the English 30th Celebration?', a: 'No. Both sets share the name and came out together, but the English set has its own card list and numbering. This page lists the Japanese set.' },
    { q: 'What are the chase cards?', a: "Mewtwo ex 134/103 and Mew ex 135/103, the set's only Futuristic Rares, and the 10 Special Art Rares, led by the two Pikachu ex at 126/103 and 127/103." },
    { q: "What's the rarity scheme?", a: 'The rated tiers are Pikachu Rare, Double Rare, Art Rare, Special Art Rare and Futuristic Rare. The other 63 main-set cards, the classic reprints and the basic Energy have no rarity.' },
    { q: 'What are the 30 Pikachu?', a: 'Pikachu 017/103 to 046/103, each drawn by a different illustrator and marked 1/30 to 30/30 in place of a rarity letter. They are listed here as Pikachu Rare.' },
    { q: 'Are the classic reprints legal to play?', a: 'Not in the current Standard format. The 30 reprints at 136 to 165 are cards chosen to mark the series\' 30 years.' },
    { q: 'When did 30th Celebration release in Japan?', a: 'September 16, 2026.' },
    { q: 'What language are the cards in?', a: 'Japanese.' },
  ],
  metaTitle: 'Pokémon 30th Celebration (M6a) Japanese Card List: All 173 Cards | EBI Collectibles',
  metaDescription:
    'All 173 cards in the Japanese 30th Celebration (30th CELEBRATION, M6a): 30 Pikachu, Special Art Rares, 2 Futuristic Rares, 30 classic reprints and 8 basic Energy.',
  ogTitle: 'Pokémon 30th Celebration (M6a) Japanese Card List: All 173 Cards',
  ogDescription:
    'All 173 cards in the Japanese 30th Celebration (30th CELEBRATION, M6a). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/japanese/30th-celebration-m6a')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/japanese/30th-celebration-m6a' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: ThirtiethCelebrationJpPage,
})

function ThirtiethCelebrationJpPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/japanese/30th-celebration-m6a', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
