import { createFileRoute } from '@tanstack/react-router'
import { RankedProductPage } from '~/components/RankedProductPage'

export const Route = createFileRoute('/new-and-upcoming')({
  head: () => ({
    meta: [
      { title: 'New & Upcoming — EBI Collectibles' },
      { name: 'description', content: 'Shop New & Upcoming — Simplified Chinese Pokémon, verified before it ships.' },
    ],
  }),
  component: () => <RankedProductPage title="New & Upcoming" rankField="newAndUpcomingRank" />,
})
