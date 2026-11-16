import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import rawData from '~/data/gem-vol-6.json'
import { buildGemSetData } from '~/lib/gem-sets/buildSetData'
import { buildGemSetHead } from '~/lib/gem-sets/head'
import type { GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { GemSetPage } from '~/components/gem-set/GemSetPage'
import { getBlogGuidesFor } from '~/server/blog-status'

// Reachable only by direct URL — same deliberately-unlinked treatment as
// Gem Vol 7. Built on the shared Gem Set engine
// (src/components/gem-set/GemSetPage.tsx); this file only supplies this
// set's data and editorial config. Sourced from
// https://www.chencards.com/sets/gem_vol_6 — see gem-vol-6-notes.md for
// the structure/color-theme research this config is based on.

const raw = rawData as GemSetData
const data = buildGemSetData(raw)

const config: GemSetConfig = {
  routePath: '/sets/chinese/gem-vol-6',
  storageKey: 'gem6-have',
  productId: 'pokemon-chinese-gem-volume-6-booster-box',
  // The 5 full-art Triple Rares fanned in the hero. Applin (1907) is this
  // set's Chinese-exclusive chase card and sits in the center slot;
  // Mesprit, Tapu Bulu, Appletun and Okidogi round it out for variety.
  fanIds: ['1207', '1807', '1907', '2107', '2607'],
  // Gem Vol 6's own magenta/green hero glow — the set's Gem Pack branding
  // is magenta-pink, and its card palette leans green, so this set reads
  // distinctly from Gem Vol 7's purple/blue while the rest of the page
  // stays on the same EBI palette.
  glow1: 'rgb(199 22 116 / .30)',
  glow2: 'rgb(78 119 104 / .25)',
  aboutParagraphs: [
    'Gem Vol 6 (Gem Pack Vol. 6, set code CBB6C) is the sixth Simplified Chinese Gem Pack, released August 7, 2026. It has 196 cards built around 28 Pokémon, and every card is a holo. None of the Pokémon belong to a Trainer this time. The lineup leans on fruit, garden and tea Pokémon: Applin, Flapple, Appletun and Dipplin, plus Exeggcute, Castform Sunny Form and Poltchageist. The Loyal Three (Okidogi, Munkidori and Fezandipiti) close out the set.',
    'Every Pokémon has 7 versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is a full-art Triple Rare. Card numbers read as Pokémon number then version, so 1907/07 is version 7 of Pokémon 19.',
  ],
  faq: [
    { q: 'How many cards are in Gem 6?', a: '196 cards: 28 Pokémon with 7 versions each. By rarity that is 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
    { q: 'What are the chase cards?', a: 'Applin 1907/07, a full art by Jiro Sasumo drawn for this set. It is a Triple Rare Chinese Exclusive, found only in Gem Vol 6. Beyond Applin, collectors chase the other 27 full arts, every card numbered 07.' },
    { q: 'When did Gem Vol 6 release?', a: 'August 7, 2026.' },
    { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
    { q: 'Where can I buy Gem Vol 6?', a: 'EBI Collectibles carries Gem Vol 6 packs and boxes.' },
  ],
  metaTitle: 'Pokémon Gem Pack Vol. 6 (Gem 6) Card List: All 196 Cards | EBI Collectibles',
  metaDescription:
    'All 196 cards in Pokémon Gem Pack Vol. 6 (CBB6C), Simplified Chinese: 28 Pokémon in 7 versions each, 28 full arts and the Chinese Exclusive Applin.',
  ogTitle: 'Pokémon Gem Pack Vol. 6 (Gem 6) Card List: All 196 Cards',
  ogDescription: 'All 196 cards in Pokémon Gem Pack Vol. 6 (CBB6C). Browse by Pokémon, filter by rarity and track which ones you own.',
}

export const Route = createFileRoute('/sets/chinese/gem-vol-6')({
  loader: () => getBlogGuidesFor({ data: { setPath: '/sets/chinese/gem-vol-6' } }).catch(() => []),
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => buildGemSetHead(data, config),
  component: GemVol6Page,
})

function GemVol6Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const navigateToCard = React.useCallback(
    (id: string | undefined) => navigate({ to: '/sets/chinese/gem-vol-6', search: (prev) => ({ ...prev, card: id }), replace: true }),
    [navigate],
  )
  return <GemSetPage raw={raw} data={data} config={config} openCardId={search.card ?? null} navigateToCard={navigateToCard} />
}
