import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/jp-aura-seeker-m7.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Japanese set page, listed on /sets/japanese and in the sitemap. Built on the shared Gem
// Set engine; this file only supplies the set's data and editorial config.
//
// Aura Seeker (M7), officially 拡張パック「ハドウシーカー」 (Hadou Seeker).
// "Aura Seeker" is the name English-language sites use; there is no English
// release yet. Main set 001-078 is from the official card database (product
// 964). Secret rares 079-114 were checked against PokeBeach, Bill's Archive
// and TCG Watchtower; their images are kept in public/assets/sets/cards/jp-m7/
// (113 loads from pokemon-card.com/ex/m7). Trainer names and the "Z ex" Mega
// names are translations, not official English names.

const raw: GemSetData = { ...(rawData as GemSetData), name: 'Aura Seeker' }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/japanese/aura-seeker-m7',
  storageKey: 'jp-m7-have',
  productId: 'pokemon-japanese-aura-seeker-m7-booster-box',
  shopLabel: 'Pre-order Aura Seeker',
  // Mega Lucario Z ex, the Pokémon on the pack, leads: its Special Art Rare
  // in the center, its gold Mega Ultra Rare beside it, with the Mega Absol Z
  // ex, Mega Garchomp Z ex and Crasher Wake's Fervor Special Art Rares around them.
  fanIds: ['111', '108', '110', '114', '113'],
  fanCaption: "The set's top chase cards",
  // Aura blue and deep indigo, after Lucario and the set's name.
  glow1: 'rgb(40 90 180 / .30)',
  glow2: 'rgb(60 40 120 / .25)',
  region: { label: 'Japanese', path: '/sets/japanese', listName: 'Japanese Sets' },
  heroLede:
    'All 114 cards in Aura Seeker (M7). The 78-card main set has 73 Pokémon and 5 Trainer cards, led by Mega Lucario Z ex. Secret rares run from 079 to 114: Art Rares, Super Rares, Special Art Rares and a gold Mega Ultra Rare Mega Lucario Z ex. Tap any card for a closer look and its other printings.',
  pokemonFact: '73',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–072 (mixed)',
    'Uncommon (U)': '003–078 (mixed)',
    'Rare (R)': '016–073 (mixed)',
    'Double Rare (RR)': '008–067 (mixed)',
    'Art Rare (AR)': '079–090',
    'Super Rare (SR)': '091–107',
    'Special Art Rare (SAR)': '108–113',
    'Mega Ultra Rare (MUR)': '114',
  },
  aboutParagraphs: [
    'Aura Seeker, 拡張パック「ハドウシーカー」 (Hadou Seeker), is a Japanese Pokémon TCG expansion in the Mega Evolution series (ポケモンカードゲーム MEGA), released November 27, 2026, with set code M7. "Aura Seeker" is the name English-language sites use for it; there is no English release yet. Mega Lucario Z ex is on the pack. A booster pack has 5 cards and a box has 30 packs.',
    'The set has 114 cards. The 78-card main set has 73 Pokémon, including 8 Double Rare ex (Mega Lucario Z ex, Mega Absol Z ex, Mega Garchomp Z ex, Mega Glimmora ex, Sceptile ex, Floatzel ex, Sigilyph ex and Togedemaru ex), and 5 Trainer cards. The 36 secret rares are 12 Art Rares, 17 Super Rares (8 ex Pokémon, 6 Trainer cards and 3 Energy cards), 6 Special Art Rares and one Mega Ultra Rare, a gold Mega Lucario Z ex. The Crasher Wake\'s Fervor Special Art Rare 113/078 is illustrated by manga artist Tetsuo Hara.',
    'Pokémon names here are the official English names. The Trainer card names, the Energy card names and the English styling of the "Z ex" Mega Pokémon are translations, since no English version of these cards exists yet.',
  ],
  faq: [
    { q: 'How many cards are in Aura Seeker?', a: '114 cards: a 78-card main set (73 Pokémon and 5 Trainer cards) plus 36 secret rares (12 Art Rare, 17 Super Rare, 6 Special Art Rare and 1 Mega Ultra Rare).' },
    { q: 'Is Aura Seeker the official name?', a: 'The official Japanese name is ハドウシーカー (Hadou Seeker). Aura Seeker is the English name used by English-language sites. There is no English release of the set yet.' },
    { q: 'What are the chase cards?', a: "Mega Lucario Z ex, the Pokémon on the pack, as the gold Mega Ultra Rare 114/078 and the Special Art Rare 110/078. The other Special Art Rares are Mega Absol Z ex, Sigilyph ex, Mega Garchomp Z ex, Korrina's Earnestness and Crasher Wake's Fervor, illustrated by Tetsuo Hara." },
    { q: "What's Aura Seeker's rarity scheme?", a: 'An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Mega Ultra Rare, from most common to rarest.' },
    { q: 'How many cards are in a pack?', a: '5 cards per booster pack, and 30 packs per box.' },
    { q: 'When did Aura Seeker release?', a: 'November 27, 2026, in Japan.' },
    { q: 'What language are the cards in?', a: 'Japanese.' },
  ],
  metaTitle: 'Pokémon Aura Seeker (M7) Japanese Card List: All 114 Cards | EBI Collectibles',
  metaDescription:
    'All 114 cards in Aura Seeker (ハドウシーカー, Hadou Seeker, M7), with all 36 secret rares and Mega Lucario Z ex as a gold Mega Ultra Rare.',
  ogTitle: 'Pokémon Aura Seeker (M7) Japanese Card List: All 114 Cards',
  shareImageFile: 'set-aura-seeker-m7-v2.jpg',
  ogDescription:
    'All 114 cards in Aura Seeker (ハドウシーカー, Hadou Seeker, M7), with all 36 secret rares. Browse by Pokémon and filter by rarity.',
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
