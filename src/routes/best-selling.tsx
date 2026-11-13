import { createFileRoute } from '@tanstack/react-router'
import { RankedProductPage } from '~/components/RankedProductPage'

const SITE_URL = 'https://ebicollectibles.com'

export const Route = createFileRoute('/best-selling')({
  head: () => ({
    meta: [
      { title: 'Best Selling — EBI Collectibles' },
      { name: 'description', content: 'Shop Best Selling — Simplified Chinese Pokémon, verified before it ships.' },
      { property: 'og:title', content: 'Best Selling — EBI Collectibles' },
      { property: 'og:description', content: 'Shop Best Selling — Simplified Chinese Pokémon, verified before it ships.' },
      { property: 'og:url', content: `${SITE_URL}/best-selling` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/best-selling` }],
  }),
  component: () => <RankedProductPage title="Best Selling" rankField="bestSellingRank" />,
})
