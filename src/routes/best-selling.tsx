import { createFileRoute } from '@tanstack/react-router'
import { RankedProductPage } from '~/components/RankedProductPage'

export const Route = createFileRoute('/best-selling')({
  head: () => ({
    meta: [
      { title: 'Best Selling — EBI Collectibles' },
      { name: 'description', content: 'Shop Best Selling — Simplified Chinese Pokémon, verified before it ships.' },
    ],
  }),
  component: () => <RankedProductPage title="Best Selling" rankField="bestSellingRank" />,
})
