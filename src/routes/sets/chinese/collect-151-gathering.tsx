import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
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
// https://www.chencards.com/sets/collect_151_gathering — see
// collect-151-notes.md for the full structure/color-theme research this
// config is based on.
//
// One of four release pages sharing src/data/collect-151.json — see the
// long comment in collect-151-journey.tsx for why (one 192-card list,
// re-released four times, each page overrides `name`, `releaseDate` and
// `exclusiveCardNumbers` to just its own release). Gathering has two
// exclusives of its own — a Pikachu Art Rare and a Zapdos ex Special
// Art Rare.
//
// No `productId`: EBI doesn't carry Collect 151 in any release.

const sourced = rawData as GemSetData

const raw: GemSetData = {
  ...sourced,
  name: 'Collect 151: Gathering',
  releaseDate: '2025-10-17',
  exclusiveCardNumbers: ['173/151', '190/151'],
}
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/collect-151-gathering',
  storageKey: 'collect-151-gathering-have',
  // Zapdos ex SAR, Gathering's higher-tier exclusive, centered — flanked
  // by Mew ex SR and this release's own Pikachu AR, with Blastoise ex SR
  // and the gold Mew ex UR on the outside.
  fanIds: ['173', '185', '190', '176', '192'],
  fanCaption: "Gathering's two Chinese Exclusives, plus Blastoise ex and two Mew ex",
  // Kanto green and deep cocoa, from the set's own "收集啦151" logo —
  // shared across all four Collect 151 releases, since they're the same
  // card list under the same branding.
  glow1: 'rgb(86 147 90 / .30)',
  glow2: 'rgb(34 20 16 / .25)',
  heroLede:
    "All 192 cards in Collect 151 (151C): the 151 original Kanto Pokémon in Pokédex order, then 41 secret rares numbered 152–192, including Shiny cards, Super Rares and a gold Ultra Rare Mew ex. Gathering was the fourth and last release. Its two Chinese Exclusives are Pikachu 173/151 (Art Rare) and Zapdos ex 190/151 (Special Art Rare). Tap any card for a closer look and every other printing beside it.",
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
    "Collect 151 (set code 151C) is an official Pokémon TCG set in Simplified Chinese. Its main set is the 151 original Kanto Pokémon in Pokédex order, so 001 is Bulbasaur and 151 is Mew ex. There are no Trainer or Energy cards. The set came out in four releases: Journey (January 17, 2025), Hope (April 18, 2025), Surprise (July 18, 2025) and Gathering (October 17, 2025). All four share the same main set and most of the secret rares, but each release has its own Chinese Exclusive cards. This page covers Gathering.",
    "Every card has its own collector number, printed out of 151. The main set, 001–151, has 63 Commons, 51 Uncommons, 25 Rares and 12 Double Rare ex. The 41 secret rares are 18 Shiny cards (152–169), 4 Pikachu Art Rares (170–173, one per release), 12 Super Rares (174–185), 3 Shiny Super Rares (186–188), 3 Special Art Rares (189–191) and one gold Ultra Rare Mew ex (192).",
  ],
  faq: [
    { q: "How many cards are in Collect 151?", a: "192 cards: the 151 Kanto Pokémon in the main set, plus 41 secret rares numbered 152–192." },
    { q: "What makes the Gathering release different?", a: "Collect 151 came out in four releases: Journey, Hope, Surprise and Gathering. They share the same main set. Each release has its own Chinese Exclusive cards. Gathering's are Pikachu 173/151 (Art Rare) and Zapdos ex 190/151 (Special Art Rare)." },
    { q: "What rarities does Collect 151 have?", a: "Ten. The main set has Common, Uncommon, Rare and Double Rare. The secret rares, in number order, are Shiny, Art Rare, Super Rare, Shiny Super Rare, Special Art Rare and Ultra Rare." },
    { q: "What is the Shiny tier?", a: "Shiny cards show a main-set Pokémon in its shiny colors with a star-sparkle frame. There are 18 of them, numbered 152–169. The set also has 3 Shiny Super Rare ex at 186–188: Wigglytuff ex, Alakazam ex and Mew ex." },
    { q: "Does Collect 151 have Trainer or Energy cards?", a: "No. Every card in the set is a Pokémon." },
    { q: "When did Collect 151: Gathering release?", a: "October 17, 2025. It was the fourth and last of the Collect 151 releases." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
  ],
  metaTitle: "Pokémon Collect 151: Gathering (151C) Card List: All 192 Cards | EBI Collectibles",
  metaDescription:
    "All 192 cards in Pokémon Collect 151: Gathering (151C) in Simplified Chinese, including the Chinese Exclusive Pikachu AR 173/151 and Zapdos ex SAR 190/151.",
  ogTitle: "Pokémon Collect 151: Gathering (151C) Card List: All 192 Cards",
  ogDescription:
    "All 192 cards in Pokémon Collect 151: Gathering (151C) in Simplified Chinese, including the Chinese Exclusive Pikachu AR 173/151 and Zapdos ex SAR 190/151.",
}

export const Route = createFileRoute('/sets/chinese/collect-151-gathering')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/collect-151-gathering' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: CollectGatheringPage,
})

function CollectGatheringPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/collect-151-gathering', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
