import { createFileRoute } from '@tanstack/react-router'
import { RankedProductPage } from '~/components/RankedProductPage'

const SITE_URL = 'https://ebicollectibles.com'

export const Route = createFileRoute('/new-and-upcoming')({
  head: () => ({
    meta: [
      { title: 'New & Upcoming — EBI Collectibles' },
      { name: 'description', content: 'Shop New & Upcoming — Simplified Chinese Pokémon, verified before it ships.' },
      { property: 'og:title', content: 'New & Upcoming — EBI Collectibles' },
      { property: 'og:description', content: 'Shop New & Upcoming — Simplified Chinese Pokémon, verified before it ships.' },
      { property: 'og:url', content: `${SITE_URL}/new-and-upcoming` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/new-and-upcoming` }],
  }),
  component: () => <RankedProductPage title="New & Upcoming" rankField="newAndUpcomingRank" />,
})
