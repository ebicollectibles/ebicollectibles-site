import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/csv4.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// every other set page. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/reward_round_csv4 — see csv4-notes.md
// for the full structure/color-theme research this config is based on.
//
// Reward Round (set code CSV4C) is an earlier main numbered CSV expansion
// — same flat-catalog shape as CSV10 (src/data/csv4.json sets
// groupByName: true), and just as clean: one numbering system, no null
// rarities, no missing images, no split cards. The sourcing session
// caught 5 cards Chen mislabeled Uncommon that print as Common (046,
// 065, 068, 073, 100) — already corrected in the JSON, matching the
// official odds chart exactly.

const raw: GemSetData = { ...(rawData as GemSetData) }
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/reward-round-csv4',
  storageKey: 'csv4-have',
  productId: 'pokemon-chinese-reward-round-booster-box',
  // Gholdengo ex SAR (a gold mascot fitting a "reward" set) centered,
  // flanked by Pidgeot ex SAR and this set's two Chinese exclusives —
  // Maushold ex SAR and Rika SAR — with the gold Gholdengo ex UR on the
  // outside.
  fanIds: ['159', '157', '156', '158', '162'],
  fanCaption: "The set's top chase cards",
  // Teal and gold, from the set's own "嘉奖回合" logo — distinct from
  // every other CSV set's colors.
  glow1: 'rgb(46 123 134 / .30)',
  glow2: 'rgb(179 130 68 / .25)',
  heroLede:
    "All 165 cards in Reward Round (CSV4C). The 129-card main set has 114 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy. Secret rares run from 130 to 165: Art Rares, Super Rares, Special Art Rares and gold Ultra Rares. Tap any card for a closer look and its other printings.",
  pokemonFact: "114",
  rarityVersionLabelsOverride: {
    "Common (C)": "001–124 (mixed)",
    "Uncommon (U)": "005–129 (mixed)",
    "Rare (R)": "012–125 (mixed)",
    "Double Rare (RR)": "026–114 (mixed)",
    "Art Rare (AR)": "130–137",
    "Super Rare (SR)": "138–152",
    "Special Art Rare (SAR)": "153–161",
    "Ultra Rare (UR)": "162–165",
  },
  aboutParagraphs: [
    "Reward Round (set code CSV4C) is an official Pokémon TCG expansion in the Chinese Scarlet & Violet series, released July 18, 2025, with Gholdengo on the cover. It has 165 cards: a main set of 114 Pokémon plus Items, Pokémon Tools, Supporters, Stadiums and a Special Energy, then 36 secret rares.",
    "Every card has its own collector number, 001 through 165. The 129-card main set runs from Common up to Double Rare. The 36 secret rares are 8 Art Rares of main-set Pokémon, 15 Super Rares and 9 Special Art Rares of ex Pokémon and Supporters, and 4 gold Ultra Rares: Gholdengo ex, Nest Ball, Luxurious Cape and Beach Court.",
  ],
  faq: [
    { q: "How many cards are in Reward Round?", a: "165 cards: a 129-card main set with 114 Pokémon, 14 Trainer cards and 1 Special Energy, plus 36 secret rares (8 Art Rare, 15 Super Rare, 9 Special Art Rare and 4 Ultra Rare)." },
    { q: "What are the chase cards?", a: "The top tier is Ultra Rare, with 4 gold cards led by Gholdengo ex 162/129. The set has three Chinese Exclusives: that gold Gholdengo ex and two Special Art Rares, Maushold ex 158/129 and Rika 159/129." },
    { q: "What's Reward Round's rarity scheme?", a: "An 8-tier scheme: Common, Uncommon, Rare, Double Rare, Art Rare, Super Rare, Special Art Rare and Ultra Rare, from most common to rarest." },
    { q: "When did Reward Round release?", a: "July 18, 2025." },
    { q: "What language are the cards in?", a: "Simplified Chinese." },
    { q: "Where can I buy Reward Round?", a: "EBI Collectibles carries Reward Round packs and boxes." },
  ],
  metaTitle: "Pokémon Reward Round (CSV4C) Card List: All 165 Cards | EBI Collectibles",
  metaDescription:
    "All 165 cards in Pokémon Reward Round (CSV4C), Simplified Chinese, with the Chinese Exclusive gold Gholdengo ex, Maushold ex SAR and Rika SAR.",
  ogTitle: "Pokémon Reward Round (CSV4C) Card List: All 165 Cards",
  ogDescription:
    "All 165 cards in Pokémon Reward Round (CSV4C), Simplified Chinese, with the Chinese Exclusive gold Gholdengo ex, Maushold ex SAR and Rika SAR.",
}

export const Route = createFileRoute('/sets/chinese/reward-round-csv4')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/reward-round-csv4' } }).catch(() => []),
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{3}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: Csv4Page,
})

function Csv4Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/reward-round-csv4', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
