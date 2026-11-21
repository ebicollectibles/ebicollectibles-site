import { createFileRoute } from '@tanstack/react-router'
import homeV2CssUrl from '~/styles/home-v2.css?url'
import { AnniversaryCountdown } from '~/components/AnniversaryCountdown'
import { HomeShelves } from '~/components/home/HomeShelves'
import { EmailSignup } from '~/components/home/EmailSignup'
import { useCart } from '~/lib/cart-context'
import { getMySubscriptionStatus } from '~/server/subscribers'

// Draft of a new homepage for the owner to review. Not linked from
// anywhere, kept out of search and the sitemap. Once approved, its body
// replaces the one in routes/index.tsx and this route goes away.
export const Route = createFileRoute('/home-preview')({
  loader: () => getMySubscriptionStatus(),
  head: () => ({
    meta: [
      { title: 'Homepage draft | EBI Collectibles' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'stylesheet', href: homeV2CssUrl }],
  }),
  component: HomePreview,
})

function HomePreview() {
  const { products } = useCart()
  const status = Route.useLoaderData()
  return (
    <>
      <h1 className="sr-only">EBI Collectibles: sealed Simplified Chinese Pokémon cards, figures and blind boxes</h1>
      <AnniversaryCountdown />
      <HomeShelves products={products} />
      <div className="hv2-email-wrap">
        <EmailSignup status={status} />
      </div>
    </>
  )
}
