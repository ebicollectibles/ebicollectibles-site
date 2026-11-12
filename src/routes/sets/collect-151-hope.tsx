import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/collect-151.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/collect_151_hope — see
// collect-151-notes.md for the full structure/color-theme research this
// config is based on.
//
// One of four release pages sharing src/data/collect-151.json — see the
// long comment in collect-151-journey.tsx for why (one 192-card list,
// re-released four times, each page overrides `name`, `releaseDate` and
// `exclusiveCardNumbers` to just its own release).
//
// No `productId`: EBI doesn't carry Collect 151 in any release.

const sourced = rawData as GemSetData

const raw: GemSetData = {
  ...sourced,
  name: 'Collect 151: Hope',
  releaseDate: '2025-04-18',
  exclusiveCardNumbers: ['171/151'],
}
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/collect-151-hope',
  storageKey: 'collect-151-hope-have',
  // Hope's own exclusive Pikachu Art Rare, centered, flanked by
  // Wigglytuff ex and Alakazam ex Super Rares, with Zapdos ex Super
  // Rare and the gold Mew ex Super Rare on the outside.
  fanIds: ['179', '184', '171', '180', '185'],
  fanCaption: "The set's top chase cards",
  // Kanto green and deep cocoa, from the set's own "收集啦151" logo —
  // shared across all four Collect 151 releases, since they're the same
  // card list under the same branding.
  glow1: 'rgb(86 147 90 / .30)',
  glow2: 'rgb(34 20 16 / .25)',
  heroLede:
    'All 192 cards in Collect 151: the 151 original Kanto Pokémon in Pokédex order, plus Shiny treatments, Art Rares, Super Rares, Shiny Super Rares, Special Art Rares and a gold Ultra Rare Mew ex as secret rares from 152 up. Hope, the second release, adds its own exclusive Pikachu Art Rare. Tap any card for a closer look and every other printing beside it.',
  pokemonFact: '151',
  rarityVersionLabelsOverride: {
    'Common (C)': '001–151 (mixed)',
    'Uncommon (U)': '001–151 (mixed)',
    'Rare (R)': '001–151 (mixed)',
    'Double Rare (RR)': '001–151 (mixed)',
    'Shiny (S)': '152–169',
    'Art Rare (AR)': '170–173',
    'Super Rare (SR)': '174–185',
    'Shiny Super Rare (SSR)': '186–188',
    'Special Art Rare (SAR)': '189–191',
    'Ultra Rare (UR)': '192',
  },
  aboutParagraphs: [
    'Collect 151 (set code 151C) is an officially-licensed Pokémon TCG expansion in Simplified Chinese, built entirely around the 151 original Kanto Pokémon in Pokédex order — there isn\'t a single Trainer or Energy card in the whole set. It was released four times: Journey, Hope (April 18, 2025), Surprise and Gathering, each the same 192-card list plus its own small set of exclusive cards. This is the Hope release.',
    'Every card has its own collector number, 001 through 192. The 151-card main set runs from Common up to Double Rare; the 41 secret rares that follow add 18 Shiny treatments, 4 Pikachu Art Rares (one per release), 12 Super Rares, 3 Shiny Super Rares and 3 Special Art Rares of the set\'s strongest Pokémon, topped by a single gold Ultra Rare Mew ex.',
  ],
  faq: [
    { q: 'How many cards are in Collect 151?', a: '192 cards: the 151 Kanto Pokémon plus 41 secret rares (Shiny, Art Rare, Super Rare, Shiny Super Rare, Special Art Rare and one Ultra Rare).' },
    { q: 'What makes the Hope release different?', a: 'Journey, Hope, Surprise and Gathering are the same 192-card Collect 151 list, released four times. Hope\'s own exclusive is Pikachu 171/151, an Art Rare.' },
    { q: "What's Collect 151's rarity scheme?", a: 'A 10-tier scheme: Common, Uncommon, Rare, Double Rare, Shiny, Art Rare, Super Rare, Shiny Super Rare, Special Art Rare and Ultra Rare, from most common to rarest.' },
    { q: 'What is the Shiny tier?', a: 'A shiny-colored main-set Pokémon in its own star-sparkle frame — 18 of them, numbered 152–169, alongside 3 Shiny Super Rare full-art ex at 186–188.' },
    { q: 'When did Collect 151: Hope release?', a: 'April 18, 2025.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
  ],
  metaTitle: 'Collect 151: Hope Card List — All 192 Cards | EBI Collectibles',
  metaDescription:
    'Browse every card in Pokémon TCG Collect 151: Hope (Simplified Chinese): the 151 Kanto Pokémon, Shiny cards, Super Rares and the gold Ultra Rare Mew ex, including the exclusive Pikachu Art Rare.',
  ogTitle: 'Collect 151: Hope Card List — All 192 Cards',
  ogDescription: 'All 192 cards in Pokémon TCG Collect 151: Hope — browse by Pokémon, filter by rarity, and track which ones you own.',
}

export const Route = createFileRoute('/sets/collect-151-hope')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: CollectHopePage,
})

function CollectHopePage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/collect-151-hope', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
