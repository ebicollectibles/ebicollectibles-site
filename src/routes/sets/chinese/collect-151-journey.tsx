import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/collect-151.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/collect_151 plus Chen's four release
// pages — see collect-151-notes.md for the full structure/color-theme
// research this config is based on.
//
// Collect 151 is one 192-card list (001–151 are the 151 Kanto Pokémon in
// Pokédex order, no Trainers or Energy at all) that Chen's source re-
// released four times — Journey, Hope, Surprise, Gathering — each
// adding its own small batch of exclusive cards on top of the same base
// set. Rather than four copies of a 192-card JSON, all four pages
// (collect-151-journey.tsx, -hope, -surprise, -gathering) import the
// SAME src/data/collect-151.json and each overrides `name`,
// `releaseDate` and — this is the important one — `exclusiveCardNumbers`
// to just its own release's cards; the JSON's own exclusiveCardNumbers
// is the union of all seven across all four releases (per
// collect-151-notes.md), which would wrongly tag every release's
// exclusive on every other release's page if left as-is.
//
// Same flat-catalog shape as every other official CSV set
// (groupByName: true), and introduces two tiers no set before it has
// needed — Shiny (S) and Shiny Super Rare (SSR), both shiny-colored
// treatments unique to this set (src/lib/gem-sets/rarity.ts,
// src/styles/gem-set.css's new --r-s token). Pikachu appears 5 times
// (the main-set card plus all four releases' own Art Rares) and Mew ex
// appears at 5 different tiers — groupByName's plain name-matching
// already groups all of these correctly with zero further engine
// changes, same as every other official set's name-repeat quirks so far.
//
// No `productId` on any of the four release pages: EBI doesn't carry
// Collect 151 in any release.

const sourced = rawData as GemSetData

const raw: GemSetData = {
  ...sourced,
  name: 'Collect 151: Journey',
  releaseDate: '2025-01-17',
  exclusiveCardNumbers: ['170/151'],
}
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/collect-151-journey',
  storageKey: 'collect-151-journey-have',
  // Journey's own exclusive Pikachu Art Rare, centered, flanked by the
  // three starters' Super Rares and the gold Mew ex on the outside.
  fanIds: ['174', '176', '170', '175', '192'],
  fanCaption: "Journey's Pikachu Art Rare, the Kanto starters and gold Mew ex",
  // Kanto green and deep cocoa, from the set's own "收集啦151" logo —
  // shared across all four Collect 151 releases, since they're the same
  // card list under the same branding.
  glow1: 'rgb(86 147 90 / .30)',
  glow2: 'rgb(34 20 16 / .25)',
  heroLede:
    "All 192 cards in Collect 151 (151C): the 151 original Kanto Pokémon in Pokédex order, then 41 secret rares numbered 152–192, including Shiny cards, Super Rares and a gold Ultra Rare Mew ex. Journey was the first of the four releases, and its Chinese Exclusive is Pikachu 170/151, an Art Rare. Tap any card for a closer look and every other printing beside it.",
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
    "Collect 151 (set code 151C) is an official Pokémon TCG set in Simplified Chinese. Its main set is the 151 original Kanto Pokémon in Pokédex order, so 001 is Bulbasaur and 151 is Mew ex. There are no Trainer or Energy cards. The set came out in four releases: Journey (January 17, 2025), Hope (April 18, 2025), Surprise (July 18, 2025) and Gathering (October 17, 2025). All four share the same main set and most of the secret rares, but each release has its own Chinese Exclusive cards. This page covers Journey.",
    "Every card has its own collector number, printed out of 151. The main set, 001–151, has 63 Commons, 51 Uncommons, 25 Rares and 12 Double Rare ex. The 41 secret rares are 18 Shiny cards (152–169), 4 Pikachu Art Rares (170–173, one per release), 12 Super Rares (174–185), 3 Shiny Super Rares (186–188), 3 Special Art Rares (189–191) and one gold Ultra Rare Mew ex (192).",
  ],
  faq: [
    { q: "How many cards are in Collect 151?", a: "192 cards: the 151 Kanto Pokémon in the main set, plus 41 secret rares numbered 152–192." },
    { q: "What makes the Journey release different?", a: "Collect 151 came out in four releases: Journey, Hope, Surprise and Gathering. They share the same main set. Each release has its own Chinese Exclusive cards. Journey's is Pikachu 170/151, an Art Rare." },
    { q: "What rarities does Collect 151 have?", a: "Ten. The main set has Common, Uncommon, Rare and Double Rare. The secret rares, in number order, are Shiny, Art Rare, Super Rare, Shiny Super Rare, Special Art Rare and Ultra Rare." },
    { q: "What is the Shiny tier?", a: "Shiny cards show a main-set Pokémon in its shiny colors with a star-sparkle frame. There are 18 of them, numbered 152–169. The set also has 3 Shiny Super Rare ex at 186–188: Wigglytuff ex, Alakazam ex and Mew ex." },
    { q: "Does Collect 151 have Trainer or Energy cards?", a: "No. Every card in the set is a Pokémon." },
    { q: "When did Collect 151: Journey release?", a: "January 17, 2025. It was the first of the four Collect 151 releases." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
  ],
  metaTitle: "Pokémon Collect 151: Journey (151C) Card List: All 192 Cards | EBI Collectibles",
  metaDescription:
    "All 192 cards in Pokémon Collect 151: Journey (151C) in Simplified Chinese, including the Chinese Exclusive Pikachu Art Rare 170/151 and gold Mew ex.",
  ogTitle: "Pokémon Collect 151: Journey (151C) Card List: All 192 Cards",
  ogDescription:
    "All 192 cards in Pokémon Collect 151: Journey (151C) in Simplified Chinese, including the Chinese Exclusive Pikachu Art Rare 170/151 and gold Mew ex.",
}

export const Route = createFileRoute('/sets/chinese/collect-151-journey')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/collect-151-journey' } }).catch(() => []),
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: CollectJourneyPage,
})

function CollectJourneyPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/collect-151-journey', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
