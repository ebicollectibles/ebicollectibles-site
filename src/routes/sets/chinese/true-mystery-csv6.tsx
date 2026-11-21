import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv6.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/true_mystic — see csv6-notes.md for the
// full structure/color-theme research this config is based on. Chen's
// own display name for it is "True Mystic" (真实玄虚), but the store's
// existing product listing calls it "True Mystery" — `name` matches
// that for consistency, same as CSV9.5's "Terastal Gathering".
//
// CSV6 is the same flat-catalog shape as CSV4, CSV5 and CSV10
// (src/data/csv6.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. Chen has no
// official odds chart for this set (unlike every other Chinese SV set);
// the sourcing session checked every Common/Uncommon card's printed
// rarity letter by hand instead and found no corrections needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/true-mystery-csv6',
  storageKey: 'csv6-have',
  productId: 'pokemon-chinese-true-mystery-slim-booster-box',
  // Roaring Moon ex SAR (the headline Ancient Paradox) centered, flanked
  // by its Future counterpart Iron Valiant ex SAR and the Chinese-
  // exclusive Iron Hands ex SAR, with Geeta SAR and the gold Roaring
  // Moon ex UR on the outside.
  fanIds: ['157', '153', '155', '152', '161'],
  fanCaption: "The set's top chase cards",
  // Mystic indigo and teal, from the set's own "真实玄虚" logo gradient —
  // a Paradox (Ancient/Future) set, distinct from every other CSV set's
  // colors.
  glow1: 'rgb(64 58 113 / .30)',
  glow2: 'rgb(40 133 151 / .25)',
  heroLede:
    "All 163 cards in True Mystery (CSV6C). The 128-card main set has 113 Pokémon plus Items, Pokémon Tools, Supporters and Stadiums. Secret rares run from 129 to 163: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "113",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–111 (mixed)",
    "Uncommon (U)": "002–128 (mixed)",
    "Rare (R)": "025–122 (mixed)",
    "Double Rare (RR)": "003–112 (mixed)",
    "Art Rare (AR)": "129–136",
    "Super Rare (SR)": "137–151",
    "Special Art Rare (SAR)": "152–159",
    "Ultra Rare (UR)": "160–163",
  },
  aboutParagraphs: [
    "True Mystery (set code CSV6C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released November 7, 2025. It's built around Ancient and Future Paradox Pokémon. It has 163 cards: a main set of 113 Pokémon plus Items, Pokémon Tools, Supporters and Stadiums, then 35 secret rares.",
    "Every card has its own collector number, 001 through 163. The 128-card main set runs from Common up to Double Rare. The 35 secret rares are 8 Art Rares of main-set Pokémon, 15 Super Rares and 8 Special Art Rares of ex Pokémon and Supporters, and 4 gold Ultra Rares: Iron Valiant ex, Roaring Moon ex, Counter Catcher and Pal Pad.",
  ],
  faq: [
    { q: "How many cards are in True Mystery?", a: "163 cards: a 128-card main set with 113 Pokémon and 15 Trainer cards, plus 35 secret rares (8 Art Rare, 15 Super Rare, 8 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "Iron Valiant ex, the Pokémon on the pack, has a Special Art Rare 153/128. The top tier is Ultra Rare, with 4 gold cards including Iron Valiant ex 160/128 and Roaring Moon ex 161/128. The Iron Hands ex Special Art Rare 152/128 is this set's Chinese Exclusive." },
    { q: "What's True Mystery's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did True Mystery release?", a: "November 7, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy True Mystery?", a: "EBI Collectibles carries True Mystery packs and boxes." },
  ],
  metaTitle: "Pokémon True Mystery (CSV6C) Card List: All 163 Cards | EBI Collectibles",
  metaDescription:
    "All 163 cards in Pokémon True Mystery (CSV6C), the Simplified Chinese Paradox set, with Iron Valiant on the pack, Roaring Moon ex and a Chinese Exclusive Iron Hands ex.",
  ogTitle: "Pokémon True Mystery (CSV6C) Card List: All 163 Cards",
  ogDescription:
    "All 163 cards in Pokémon True Mystery (CSV6C), the Simplified Chinese Paradox set, with Iron Valiant on the pack, Roaring Moon ex and a Chinese Exclusive Iron Hands ex.",
}

export const Route = createFileRoute('/sets/chinese/true-mystery-csv6')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/true-mystery-csv6' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv6Page,
})

function Csv6Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/true-mystery-csv6', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
