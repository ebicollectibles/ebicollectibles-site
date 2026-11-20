import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv5.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/dark_crystal_blaze_csv5 — see
// csv5-notes.md for the full structure/color-theme research this config
// is based on. Chen's own name for it, 黑晶炽诚, is this set's own CSV5
// identity, but the store's existing product listing calls it "Black
// Crystal Blaze" — `name` matches that for consistency, same as CSV9.5's
// "Terastal Gathering".
//
// CSV5 is the same flat-catalog shape as CSV4 and CSV10
// (src/data/csv5.json sets groupByName: true), and just as clean: one
// numbering system, no null rarities, no missing images. The sourcing
// session caught one card Chen mislabeled Uncommon that prints as
// Common (112 Cyclizar) — already corrected in the JSON. Two name pairs
// repeat within the main set itself rather than against a secret rare —
// Flamigo (074 Common, 113 Uncommon) and Paldean Student (124, 125, both
// Uncommon) — groupByName already shows these together as multiple
// printings of the same name, same as any other reprint pair, so no
// engine changes were needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/black-crystal-blaze-csv5',
  storageKey: 'csv5-have',
  productId: 'pokemon-chinese-black-crystal-blaze-booster-box',
  // Charizard ex SAR (the set's headline chase) centered, flanked by
  // Garchomp ex SAR and Altaria ex SAR, with the Chinese-exclusive Larry
  // SAR and the gold Charizard ex UR on the outside.
  fanIds: ['157', '154', '155', '156', '162'],
  fanCaption: "The set's top chase cards",
  // Crimson and obsidian, from the set's own "黑晶炽诚" (dark crystal)
  // logo gradient — distinct from every other CSV set's colors.
  glow1: 'rgb(161 23 57 / .30)',
  glow2: 'rgb(44 35 47 / .25)',
  heroLede:
    "All 164 cards in Black Crystal Blaze (CSV5C). The 129-card main set has 113 Pokémon plus Items, Pokémon Tools, Supporters, a Stadium and a Special Energy. Secret rares run from 130 to 164: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "113",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–121 (mixed)",
    "Uncommon (U)": "003–129 (mixed)",
    "Rare (R)": "013–102 (mixed)",
    "Double Rare (RR)": "010–109 (mixed)",
    "Art Rare (AR)": "130–137",
    "Super Rare (SR)": "138–152",
    "Special Art Rare (SAR)": "153–160",
    "Ultra Rare (UR)": "161–164",
  },
  aboutParagraphs: [
    "Black Crystal Blaze (set code CSV5C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released September 12, 2025. It has 164 cards: a main set of 113 Pokémon plus Items, Pokémon Tools, Supporters, a Stadium and a Special Energy, then 35 secret rares.",
    "Every card has its own collector number, 001 through 164. The 129-card main set runs from Common up to Double Rare. The 35 secret rares are 8 Art Rares of main-set Pokémon, 15 Super Rares and 8 Special Art Rares of ex Pokémon and Supporters, and 4 gold Ultra Rares: Garchomp ex, Charizard ex, Rare Candy and Defiance Band.",
  ],
  faq: [
    { q: "How many cards are in Black Crystal Blaze?", a: "164 cards: a 129-card main set with 113 Pokémon, 15 Trainer cards and 1 Special Energy, plus 35 secret rares (8 Art Rare, 15 Super Rare, 8 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 4 gold cards including Charizard ex 162/129. The set has two Chinese Exclusives: the Larry Special Art Rare 157/129 and the gold Defiance Band Ultra Rare 164/129." },
    { q: "What's Black Crystal Blaze's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did Black Crystal Blaze release?", a: "September 12, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Black Crystal Blaze?", a: "EBI Collectibles carries Black Crystal Blaze packs and boxes." },
  ],
  metaTitle: "Pokémon Black Crystal Blaze (CSV5C) Card List: All 164 Cards | EBI Collectibles",
  metaDescription:
    "All 164 cards in Pokémon Black Crystal Blaze (CSV5C), Simplified Chinese, from Charizard ex to the Chinese Exclusive Larry and gold Defiance Band.",
  ogTitle: "Pokémon Black Crystal Blaze (CSV5C) Card List: All 164 Cards",
  ogDescription:
    "All 164 cards in Pokémon Black Crystal Blaze (CSV5C), Simplified Chinese, from Charizard ex to the Chinese Exclusive Larry and gold Defiance Band.",
}

export const Route = createFileRoute('/sets/chinese/black-crystal-blaze-csv5')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/black-crystal-blaze-csv5' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv5Page,
})

function Csv5Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/black-crystal-blaze-csv5', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
