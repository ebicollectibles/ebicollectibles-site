import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { cardSearchValidator, cardSearchValue, openCardIdFromSearch } from '~/lib/gem-sets/card-search'
import rawData from '~/data/csv8.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/brilliant_fantasy — see csv8-notes.md
// for the full structure/color-theme research this config is based on.
//
// Brilliant Fantasy (Ogerpon / Loyal Three / Pecharunt, Kitakami) is the
// same flat-catalog shape as CSV4–CSV7 and CSV10 (src/data/csv8.json
// sets groupByName: true), with 9 ACE SPEC Rare cards in the main set,
// same as CSV7 — see src/lib/gem-sets/rarity.ts. Chen's counts already
// matched the official odds chart exactly; no rarity corrections needed.
// Applin (023 Common, 155 Common) and Dipplin (024 Uncommon, 156
// Uncommon) each repeat within the main set itself at the same rarity —
// groupByName already shows these together as multiple printings of the
// same name, same as any other reprint pair, so no engine changes were
// needed.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/brilliant-fantasy-csv8',
  storageKey: 'csv8-have',
  productId: 'pokemon-chinese-brilliant-fantasy-slim-booster-box',
  // The Chinese-exclusive Carmine SAR centered, flanked by Pecharunt ex
  // SAR (the set's mythical) and Bloodmoon Ursaluna ex SAR, with Kieran
  // SAR and Teal Mask Ogerpon ex SAR on the outside.
  fanIds: ['254', '242', '255', '251', '250'],
  fanCaption: "The set's top chase cards",
  // Deep plum and jade teal, from the set's own "璀璨诡幻" logo gradient
  // — distinct from every other CSV set's colors.
  glow1: 'rgb(56 13 40 / .30)',
  glow2: 'rgb(64 155 148 / .25)',
  heroLede:
    "All 264 cards in Brilliant Fantasy (CSV8C). The 207-card main set has 172 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, including 9 pink-framed ACE SPEC cards. Secret rares run from 208 to 264: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "172",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–194 (mixed)",
    "Uncommon (U)": "002–206 (mixed)",
    "Rare (R)": "004–161 (mixed)",
    "Double Rare (RR)": "008–172 (mixed)",
    "Art Rare (AR)": "208–213",
    "ACE SPEC Rare (ACE)": "173, 176, 178, 180, 181, 186, 189, 204, 207",
    "Super Rare (SR)": "214–241",
    "Special Art Rare (SAR)": "242–255",
    "Ultra Rare (UR)": "256–264",
  },
  aboutParagraphs: [
    "Brilliant Fantasy (set code CSV8C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released March 13, 2026. It's a Kitakami set, with all four Ogerpon ex, the Loyal Three and Pecharunt ex. It has 264 cards: a main set of 172 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and Special Energy, then 57 secret rares.",
    "Every card has its own collector number, 001 through 264. The 207-card main set runs from Common up to Double Rare and includes 9 ACE SPEC cards, one-per-deck Trainer and Energy cards printed in a pink frame. The 57 secret rares are 6 Art Rares of main-set Pokémon, 28 Super Rares and 14 Special Art Rares of ex Pokémon and Supporters, and 9 gold Ultra Rares.",
  ],
  faq: [
    { q: "How many cards are in Brilliant Fantasy?", a: "264 cards: a 207-card main set with 172 Pokémon, 33 Trainer cards and 2 Special Energy (9 of them ACE SPEC cards), plus 57 secret rares (6 Art Rare, 28 Super Rare, 14 Special Art Rare and 9 Ultra Rare)." },
    { q: "What are the chase cards?", a: "Milotic ex, the Pokémon on the pack, has a Special Art Rare 244/207. The top tier is Ultra Rare, with 9 gold cards including Teal Mask Ogerpon ex 256/207 and Pecharunt ex 257/207. The Carmine Special Art Rare 255/207 is this set's Chinese Exclusive." },
    { q: "What's Brilliant Fantasy's rarity scheme?", a: "A 9-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, ACE SPEC Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "What is an ACE SPEC card?", a: "A one-per-deck Trainer or Energy card printed in a pink frame. Brilliant Fantasy has 9 of them, all in the main set at their own collector numbers." },
    { q: "When did Brilliant Fantasy release?", a: "March 13, 2026." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Brilliant Fantasy?", a: "EBI Collectibles carries Brilliant Fantasy packs and boxes." },
  ],
  metaTitle: "Pokémon Brilliant Fantasy (CSV8C) Card List: All 264 Cards | EBI Collectibles",
  metaDescription:
    "All 264 cards in Pokémon Brilliant Fantasy (CSV8C), the Simplified Chinese Kitakami set, with Milotic on the pack, four Ogerpon ex and a Chinese Exclusive Carmine.",
  ogTitle: "Pokémon Brilliant Fantasy (CSV8C) Card List: All 264 Cards",
  ogDescription:
    "All 264 cards in Pokémon Brilliant Fantasy (CSV8C), the Simplified Chinese Kitakami set, with Milotic on the pack, four Ogerpon ex and a Chinese Exclusive Carmine.",
}

export const Route = createFileRoute('/sets/chinese/brilliant-fantasy-csv8')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/brilliant-fantasy-csv8' } }).catch(() => []),
  validateSearch: cardSearchValidator(/^\d{3}$/),
  head: () => buildGemSetHead(data, config),
  component: Csv8Page,
})

function Csv8Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/brilliant-fantasy-csv8', search: (prev) => ({ ...prev, card: cardSearchValue(id) }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={openCardIdFromSearch(search)} navigateToCard={navigateToCard} />
}
