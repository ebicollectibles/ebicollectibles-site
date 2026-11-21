import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/jp-storm-emeralda-m6.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Japanese set page, listed on /sets/japanese and in the sitemap. Built on the shared Gem
// Set engine; this file only supplies the set's data and editorial config.
//
// Storm Emeralda (M6) is the Japanese set behind the English Delta Reign.
// The list comes from the official Japanese card database (product 955):
// 113 cards, 001 to 076 main set plus 37 secret rares. English Trainer and
// Stadium names are the official ones from Delta Reign.
//
// The three Legendary Stadiums are each printed across two cards that join
// into one picture (071+072, 073+074, 075+076). The official database only
// has the joined landscape image, so each half is a crop of it, kept in
// public/assets/sets/cards/jp-m6/ (src/data/jp-storm-emeralda-m6.json).
// Every other image loads from pokemon-card.com.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/japanese/storm-emeralda-m6',
  storageKey: 'jp-m6-have',
  // Mega Rayquaza ex, the Pokémon on the pack, leads: its Special Art Rare
  // in the center, its gold Mega Ultra Rare beside it, with the Mega
  // Golisopod ex, Raikou ex and Mega Golurk ex Special Art Rares around them.
  fanIds: ['108', '107', '110', '113', '109'],
  fanCaption: "The set's top chase cards",
  // Emerald green and storm teal, after the set's name and pack.
  glow1: 'rgb(28 120 82 / .30)',
  glow2: 'rgb(70 150 170 / .24)',
  region: { label: 'Japanese', path: '/sets/japanese', listName: 'Japanese Sets' },
  heroLede:
    'All 113 cards in Storm Emeralda (M6), the Japanese set behind the English Delta Reign. The 76-card main set has 62 Pokémon, 8 Trainer cards and three Legendary Stadiums that each join across two cards. Secret rares run from 077 to 113: Art Rares, Super Rares, Special Art Rares and a gold Mega Ultra Rare Mega Rayquaza ex. Tap any card for a closer look and its other printings.',
  pokemonFact: '62',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–067 (mixed)',
    'Uncommon (U)': '013–076 (mixed)',
    'Rare (R)': '005–056 (mixed)',
    'Double Rare (RR)': '009–062 (mixed)',
    'Art Rare (AR)': '077–088',
    'Super Rare (SR)': '089–106',
    'Special Art Rare (SAR)': '107–112',
    'Mega Ultra Rare (MUR)': '113',
  },
  aboutParagraphs: [
    'Storm Emeralda, 拡張パック「ストームエメラルダ」, is a Japanese Pokémon TCG expansion in the Mega Evolution series (ポケモンカードゲーム MEGA), released July 31, 2026, with set code M6. Mega Rayquaza ex is on the pack. A booster pack has 5 cards and a box has 30 packs.',
    'The set has 113 cards. The 76-card main set has 62 Pokémon, including 8 Double Rare ex (Mega Rayquaza ex, Mega Golisopod ex, Mega Golurk ex, Mega Malamar ex, Heat Rotom ex, Wishiwashi ex, Raikou ex and Talonflame ex), 8 Trainer cards, and three Legendary Stadiums (Legendary Trench, Legendary Summit and Legendary Pyroduct). Each stadium is printed across two numbered cards whose illustrations join into one. The 37 secret rares are 12 Art Rares, 18 Super Rares (8 ex Pokémon, 7 Trainer cards and 3 Energy cards), 6 Special Art Rares and one Mega Ultra Rare, a gold Mega Rayquaza ex.',
    "Storm Emeralda's cards were released in English as part of Delta Reign, which also takes in cards from the 2026 Japanese ex Starter Sets and numbers everything again, so the English set is larger and its card numbers differ from the Japanese ones. This page lists the Japanese set as printed, with the official English card names.",
  ],
  faq: [
    { q: 'How many cards are in Storm Emeralda?', a: '113 cards: a 76-card main set (62 Pokémon, 8 Trainer cards and 6 Legendary Stadium halves) plus 37 secret rares (12 Art Rare, 18 Super Rare, 6 Special Art Rare and 1 Mega Ultra Rare).' },
    { q: 'What is the English version of Storm Emeralda?', a: 'Delta Reign. It is built from Storm Emeralda plus cards from the 2026 Japanese ex Starter Sets, so it has more cards than the Japanese set and different card numbers.' },
    { q: 'What are the chase cards?', a: 'Mega Rayquaza ex, the Pokémon on the pack, as the Mega Ultra Rare 113/076 and the Special Art Rare 110/076. The other Special Art Rares are Mega Golisopod ex, Raikou ex, Mega Golurk ex, Aarune and Zinnia\'s Trust.' },
    { q: "What's Storm Emeralda's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Mega Ultra Rare, from most common to rarest.' },
    { q: 'What are the Legendary Stadiums?', a: 'Legendary Trench (071 and 072), Legendary Summit (073 and 074) and Legendary Pyroduct (075 and 076). Each is two cards whose illustrations join into one picture when placed side by side.' },
    { q: 'How many cards are in a pack?', a: '5 cards per booster pack, and 30 packs per box.' },
    { q: 'When did Storm Emeralda release?', a: 'July 31, 2026, in Japan.' },
    { q: 'What language are the cards in?', a: 'Japanese.' },
  ],
  metaTitle: 'Pokémon Storm Emeralda (M6) Japanese Card List: All 113 Cards | EBI Collectibles',
  metaDescription:
    'All 113 cards in Storm Emeralda (ストームエメラルダ, M6), the Japanese set behind the English Delta Reign, with Mega Rayquaza ex as a gold Mega Ultra Rare.',
  ogTitle: 'Pokémon Storm Emeralda (M6) Japanese Card List: All 113 Cards',
  ogDescription:
    'All 113 cards in Storm Emeralda (ストームエメラルダ, M6), the Japanese set behind the English Delta Reign. Browse by Pokémon and filter by rarity.',
}

export const Route = createFileRoute('/sets/japanese/storm-emeralda-m6')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/japanese/storm-emeralda-m6' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: StormEmeraldaPage,
})

function StormEmeraldaPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/japanese/storm-emeralda-m6', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
