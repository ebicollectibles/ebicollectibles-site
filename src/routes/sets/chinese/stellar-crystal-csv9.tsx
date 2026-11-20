import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv9.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

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
  routePath: '/sets/chinese/stellar-crystal-csv9',
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
    "All 266 cards in Stellar Crystal (CSV9C). The 208-card main set has 175 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy, including 9 pink-framed ACE SPEC cards. Secret rares run from 209 to 266: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "175",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–201 (mixed)",
    "Uncommon (U)": "003–207 (mixed)",
    "Rare (R)": "014–174 (mixed)",
    "Double Rare (RR)": "006–175 (mixed)",
    "Art Rare (AR)": "209–214",
    "ACE SPEC Rare (ACE)": "176, 180, 183, 186, 187, 188, 191, 205, 208",
    "Super Rare (SR)": "215–241",
    "Special Art Rare (SAR)": "242–257",
    "Ultra Rare (UR)": "258–266",
  },
  aboutParagraphs: [
    "Stellar Crystal (set code CSV9C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released May 15, 2026. It's the Terapagos set, with Stellar Tera Pikachu ex on the cover. It has 266 cards: a main set of 175 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy, then 58 secret rares.",
    "Every card has its own collector number, 001 through 266. The 208-card main set runs from Common up to Double Rare and includes 9 ACE SPEC cards, one-per-deck Trainer and Energy cards printed in a pink frame. The 58 secret rares are 6 Art Rares of main-set Pokémon, 27 Super Rares and 16 Special Art Rares of ex Pokémon and Supporters, and 9 gold Ultra Rares.",
  ],
  faq: [
    { q: "How many cards are in Stellar Crystal?", a: "266 cards: a 208-card main set with 175 Pokémon, 32 Trainer cards and 1 Special Energy (9 of them ACE SPEC cards), plus 58 secret rares (6 Art Rare, 27 Super Rare, 16 Special Art Rare and 9 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 9 gold cards including Pikachu ex 260/208 and Terapagos ex 262/208. The Lisia's Appeal Special Art Rare 257/208 is this set's Chinese Exclusive." },
    { q: "What's Stellar Crystal's rarity scheme?", a: "A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "What is an ACE SPEC card?", a: "A one-per-deck Trainer or Energy card printed in a pink frame. Stellar Crystal has 9 of them, all in the main set at their own collector numbers." },
    { q: "When did Stellar Crystal release?", a: "May 15, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
  ],
  metaTitle: "Pokémon Stellar Crystal (CSV9C) Card List: All 266 Cards | EBI Collectibles",
  metaDescription:
    "All 266 cards in Pokémon Stellar Crystal (CSV9C), Simplified Chinese, with Terapagos ex, Pikachu ex and the Chinese Exclusive Lisia's Appeal.",
  ogTitle: "Pokémon Stellar Crystal (CSV9C) Card List: All 266 Cards",
  ogDescription:
    "All 266 cards in Pokémon Stellar Crystal (CSV9C), Simplified Chinese, with Terapagos ex, Pikachu ex and the Chinese Exclusive Lisia's Appeal.",
}

export const Route = createFileRoute('/sets/chinese/stellar-crystal-csv9')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/stellar-crystal-csv9' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv9Page,
})

function Csv9Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/stellar-crystal-csv9', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
