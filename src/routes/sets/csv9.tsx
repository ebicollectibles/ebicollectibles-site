import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv9.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/stellar_crystal — see csv9-notes.md for
// the full structure/color-theme research this config is based on.
//
// Stellar Crystal (Terapagos / Stellar Tera) is the same flat-catalog
// shape as CSV4, CSV5, CSV7, CSV8 and CSV10 (src/data/csv9.json sets
// groupByName: true), with 9 ACE SPEC Rare cards in the main set, same
// as CSV7/CSV8. The sourcing session caught one card Chen mislabeled
// Common that prints as Uncommon (124 Grimmsnarl) — already corrected
// in the JSON. Applin (011, 148, both Common) repeats within the main
// set itself at the same rarity — groupByName already shows these
// together as multiple printings of the same name, same as any other
// reprint pair, so no engine changes were needed.
//
// No `productId`: EBI doesn't carry Stellar Crystal yet, unlike every
// other CSV set so far — the shared engine's hero CTA and FAQ already
// fall back cleanly to "Shop all Pokémon" when productId is omitted
// (see GemSetConfig.productId in src/lib/gem-sets/types.ts).

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/csv9',
  storageKey: 'csv9-have',
  // Terapagos ex SAR (the set's mascot) centered, flanked by Pikachu ex
  // SAR and Latias ex SAR, with the Chinese-exclusive Lisia's Appeal SAR
  // and the gold Pikachu ex UR on the outside.
  fanIds: ['257', '245', '251', '247', '260'],
  fanCaption: "The set's top chase cards",
  // Stellar rose and slate blue, from the set's own "星彩晶璃" rainbow-
  // crystal logo gradient — distinct from every other CSV set's colors.
  glow1: 'rgb(210 110 123 / .30)',
  glow2: 'rgb(92 103 134 / .25)',
  heroLede:
    'All 266 cards in Stellar Crystal: 175 Pokémon across the main 208-card set — Items, Pokémon Tools, Supporters, Stadiums and Special Energy round it out, including 9 pink-framed ACE SPEC cards — plus Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares as secret rares from 209 up. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '175',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–208 (mixed)',
    'Uncommon (U)': '001–208 (mixed)',
    'Rare (R)': '001–208 (mixed)',
    'Double Rare (RR)': '001–208 (mixed)',
    'ACE SPEC Rare (ACE)': '176, 180, 183, 186, 187, 188, 191, 205, 208',
    'Art Rare (AR)': '209–214',
    'Super Rare (SR)': '215–241',
    'Special Art Rare (SAR)': '242–257',
    'Ultra Rare (UR)': '258–266',
  },
  aboutParagraphs: [
    'Stellar Crystal (set code CSV9C) is an officially-licensed Pokémon TCG expansion in the Chinese Scarlet & Violet series, released May 15, 2026 — a Terapagos-led set built around 175 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, for 266 cards in total.',
    'Every card has its own collector number, 001 through 266. The 208-card main set runs from Common up to Double Rare, and includes 9 ACE SPEC cards — a one-per-deck Trainer/Energy tier printed in a distinct pink frame. The 58 secret rares that follow reprint select cards as Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, the set\'s top chase tier.',
  ],
  faq: [
    { q: 'How many cards are in Stellar Crystal?', a: '266 cards: a 208-card main set covering 175 Pokémon plus Trainers, Stadiums, Special Energy and 9 ACE SPEC cards, with 58 secret rares (Art Rare, Super Rare, Special Art Rare and Ultra Rare).' },
    { q: 'What are the chase cards?', a: "The set's top tier is Ultra Rare — 9 gold cards, including Pikachu ex and Terapagos ex. Lisia's Appeal 257/208, a Special Art Rare, is this set's Chinese exclusive." },
    { q: "What's Stellar Crystal's rarity scheme?", a: 'A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'What is an ACE SPEC card?', a: 'A one-per-deck Trainer or Energy card printed in a distinct pink frame — 9 of them sit inside the main set at their own collector numbers.' },
    { q: 'When did Stellar Crystal release?', a: 'May 15, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
  ],
  metaTitle: 'Stellar Crystal (CSV9) Card List — All 266 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Stellar Crystal (CSV9, Simplified Chinese): 175 Pokémon, ACE SPEC Rares, Art Rares, Super Rares, Special Art Rares and the gold Ultra Rares, including the exclusive Lisia\'s Appeal.',
  ogTitle: 'Stellar Crystal Card List — All 266 Cards',
  ogDescription: 'All 266 cards in Pokémon TCG Stellar Crystal — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/csv9')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv9Page,
})

function Csv9Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/csv9', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
