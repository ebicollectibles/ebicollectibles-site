import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv10.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/chasing_glory — see csv10-notes.md for
// the full structure/color-theme research this config is based on.
//
// CSV10 (Chasing Glory) is the main numbered expansion in the same
// Chinese Scarlet & Violet era as Black Bolt (CSV10.5C) and White Flare
// (CSV10.6C) — same flat-catalog shape (src/data/csv10.json sets
// groupByName: true) and the cleanest of the four non-Gem sets so far:
// one numbering system, no null rarities, no missing images, no split
// cards. Its rarity scheme reuses 6 of Black Bolt/White Flare's 8 tier
// names, swapping their Black White Rare for its own top tier, Ultra
// Rare (UR) — see src/lib/gem-sets/rarity.ts.
//
// Many Pokémon here carry a trainer's name ("Team Rocket's Mewtwo ex"),
// and the plain and owned versions of the same species are different
// cards (e.g. 043 Psyduck vs 045 Misty's Psyduck) — groupByName already
// matches by the card's full name, so this falls out for free. A few
// Trainer cards also contain "'s " (e.g. "Team Rocket's Great Ball");
// the engine's owner/name split still reads fine for those (it just
// shows the trainer's name on its own line above the card name, same as
// for a Pokémon), so no special-casing was needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/chasing-glory-csv10',
  storageKey: 'csv10-have',
  productId: 'pokemon-chinese-chasing-glory-slim-booster-box',
  // This set's Chinese exclusive, Brock's Scouting, centered — flanked
  // by Team Rocket's Mewtwo ex (the set's headline Pokémon, Team Rocket
  // is the main theme) and two more Special Art Rares.
  fanIds: ['268', '264', '276', '269', '279'],
  fanCaption: "The set's top chase cards",
  // Blaze orange and ember-black, from the set's own "Chasing Glory"
  // logo gradient — warmer than White Flare's flame red, and distinct
  // from every other set's colors.
  glow1: 'rgb(232 129 61 / .30)',
  glow2: 'rgb(29 16 19 / .25)',
  heroLede:
    "All 287 cards in Chasing Glory (CSV10C). The 222-card main set has 188 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy. Secret rares run from 223 to 287: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "188",
  rarityVersionLabelsOverride: {
    "Common (C)": "002–204 (mixed)",
    "Uncommon (U)": "001–222 (mixed)",
    "Rare (R)": "005–187 (mixed)",
    "Double Rare (RR)": "003–179 (mixed)",
    "Art Rare (AR)": "223–228",
    "Super Rare (SR)": "229–261",
    "Special Art Rare (SAR)": "262–279",
    "Ultra Rare (UR)": "280–287",
  },
  aboutParagraphs: [
    "Chasing Glory (set code CSV10C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released July 16, 2026. Its theme is Trainer's Pokémon: 121 of its 188 Pokémon belong to a Trainer, and Team Rocket alone has 46. It has 287 cards: a main set of 188 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, then 65 secret rares.",
    "Every card has its own collector number, 001 through 287. The 222-card main set runs from Common up to Double Rare. The 65 secret rares are 6 Art Rares of main-set Pokémon, 33 Super Rares and 18 Special Art Rares of ex Pokémon and Supporters, and 8 gold Ultra Rares: 6 ex, the Levincia Stadium and Spiky Energy.",
  ],
  faq: [
    { q: "How many cards are in Chasing Glory?", a: "287 cards: a 222-card main set with 188 Pokémon, 32 Trainer cards and 2 Special Energy, plus 65 secret rares (6 Art Rare, 33 Super Rare, 18 Special Art Rare and 8 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 8 gold cards including Team Rocket's Mewtwo ex 282/222. The Brock's Scouting Special Art Rare 276/222 is this set's Chinese Exclusive." },
    { q: "What's Chasing Glory's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "How does Chasing Glory relate to Black Bolt and White Flare?", a: "Chasing Glory is the main CSV10C set. Black Bolt (CSV10.5C) and White Flare (CSV10.6C) came after it, both released November 6, 2026." },
    { q: "When did Chasing Glory release?", a: "July 16, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Chasing Glory?", a: "EBI Collectibles carries Chasing Glory packs and boxes." },
  ],
  metaTitle: "Pokémon Chasing Glory (CSV10C) Card List: All 287 Cards | EBI Collectibles",
  metaDescription:
    "All 287 cards in Pokémon Chasing Glory (CSV10C), Simplified Chinese, from Team Rocket's Mewtwo ex to the Chinese Exclusive Brock's Scouting.",
  ogTitle: "Pokémon Chasing Glory (CSV10C) Card List: All 287 Cards",
  ogDescription:
    "All 287 cards in Pokémon Chasing Glory (CSV10C), Simplified Chinese, from Team Rocket's Mewtwo ex to the Chinese Exclusive Brock's Scouting.",
}

export const Route = createFileRoute('/sets/chinese/chasing-glory-csv10')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/chasing-glory-csv10' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv10Page,
})

function Csv10Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/chasing-glory-csv10', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
