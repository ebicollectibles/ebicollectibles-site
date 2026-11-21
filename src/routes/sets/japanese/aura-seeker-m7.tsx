import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/jp-aura-seeker-m7.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Draft Japanese set page: noindex, left out of the sitemap and of every
// listing (see src/data/japanese-sets-index.ts). Built on the shared Gem
// Set engine; this file only supplies the set's data and editorial config.
//
// Aura Seeker (M7), officially 拡張パック「ハドウシーカー」 (Hadou Seeker).
// "Aura Seeker" is the name English-language sites use; there is no English
// release yet. The card list is PARTIAL: the official card database has
// the full 78-card main set (product 964), and only one secret rare,
// 113/078, has been shown (on pokemon-card.com/ex/m7). The secret rare
// total is not announced. Trainer names and the "Z ex" Mega names are
// translations, not official English names.

const raw: GemSetData = { ...(rawData as GemSetData), name: 'Aura Seeker' }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/japanese/aura-seeker-m7',
  storageKey: 'jp-m7-have',
  // Mega Lucario Z ex, the set's headline Pokémon, in the center, with the
  // one secret rare shown so far (the Crasher Wake's Fervor Special Art
  // Rare) and the other Mega Z ex and Mega ex cards around it.
  fanIds: ['030', '113', '057', '067', '054'],
  fanCaption: 'Mega Lucario Z ex and the first secret rare',
  // Aura blue and deep indigo, after Lucario and the set's name.
  glow1: 'rgb(40 90 180 / .30)',
  glow2: 'rgb(60 40 120 / .25)',
  region: { label: 'Japanese', path: '/sets/japanese', listName: 'Japanese Sets' },
  noindex: true,
  titleSub: 'Partial card list',
  heroLede:
    'The full Aura Seeker (M7) card list is not out yet. This page shows 79 cards: the complete 78-card main set and the one secret rare shown so far, the Crasher Wake\'s Fervor Special Art Rare 113/078. Mega Lucario Z ex leads the main set. Tap any card for a closer look.',
  pokemonFact: '73',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–072 (mixed)',
    'Uncommon (U)': '003–078 (mixed)',
    'Rare (R)': '016–073 (mixed)',
    'Double Rare (RR)': '008–067 (mixed)',
    'Special Art Rare (SAR)': '113',
  },
  aboutParagraphs: [
    'Aura Seeker, 拡張パック「ハドウシーカー」 (Hadou Seeker), is a Japanese Pokémon TCG expansion in the Mega Evolution series (ポケモンカードゲーム MEGA), releasing November 27, 2026, with set code M7. "Aura Seeker" is the name English-language sites use for it; there is no English release yet. Mega Lucario Z ex is the headline card. A booster pack has 5 cards and a box has 30 packs.',
    'The full card list is not out yet, so this page shows 79 cards. The 78-card main set is complete: 73 Pokémon, including 8 Double Rare ex (Mega Lucario Z ex, Mega Absol Z ex, Mega Garchomp Z ex, Mega Glimmora ex, Sceptile ex, Floatzel ex, Sigilyph ex and Togedemaru ex), and 5 Trainer cards. Only one secret rare has been shown so far: the Crasher Wake\'s Fervor Special Art Rare 113/078, illustrated by manga artist Tetsuo Hara. Its number means the set runs to at least 113 cards, but the total has not been announced.',
    'Pokémon names here are the official English names. The Trainer card names and the English styling of the "Z ex" Mega Pokémon are translations, since no English version of these cards exists yet.',
  ],
  faq: [
    { q: 'How many cards are in Aura Seeker?', a: 'The total has not been announced. The main set is 78 cards, and the one secret rare shown so far is numbered 113/078, so the set has at least 113 cards. This page lists the 79 cards known so far.' },
    { q: 'Is Aura Seeker the official name?', a: 'The official Japanese name is ハドウシーカー (Hadou Seeker). Aura Seeker is the English name used by English-language sites. There is no English release of the set yet.' },
    { q: 'What are the chase cards?', a: "Mega Lucario Z ex 057/078 is the set's headline card. The only secret rare shown so far is the Crasher Wake's Fervor Special Art Rare 113/078, illustrated by Tetsuo Hara." },
    { q: "What's the rarity scheme so far?", a: 'The main set uses Common, Uncommon, Rare and Double Rare. The one secret rare shown so far is a Special Art Rare.' },
    { q: 'How many cards are in a pack?', a: '5 cards per booster pack, and 30 packs per box.' },
    { q: 'When does Aura Seeker release?', a: 'November 27, 2026, in Japan.' },
    { q: 'What language are the cards in?', a: 'Japanese.' },
  ],
  metaTitle: 'Pokémon Aura Seeker (M7) Japanese Card List | EBI Collectibles',
  metaDescription:
    'Aura Seeker (ハドウシーカー, Hadou Seeker, M7) Japanese card list: the full 78-card main set led by Mega Lucario Z ex, plus the first secret rare shown.',
  ogTitle: 'Pokémon Aura Seeker (M7) Japanese Card List',
  ogDescription:
    'Aura Seeker (ハドウシーカー, Hadou Seeker, M7): the full 78-card main set led by Mega Lucario Z ex, plus the first secret rare shown.',
}

export const Route = createFileRoute('/sets/japanese/aura-seeker-m7')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/japanese/aura-seeker-m7' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: AuraSeekerPage,
})

function AuraSeekerPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/japanese/aura-seeker-m7', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
