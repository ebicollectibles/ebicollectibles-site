import { createFileRoute } from '@tanstack/react-router'
import homeV2CssUrl from '~/styles/home-v2.css?url'
import homeShopCssUrl from '~/styles/home-shop.css?url'
import { BlackFridayBanner } from '~/components/home/BlackFridayBanner'
import { HomeV2 } from '~/components/home/HomeV2'
import { EmailSignup } from '~/components/home/EmailSignup'
import { useCart } from '~/lib/cart-context'
import { getMySubscriptionStatus } from '~/server/subscribers'
import { getBlogLiveMap } from '~/server/blog-status'

// Homepage: sale banner, category chips, trust strip, shop by set, sale,
// best sellers, other categories, new & upcoming, pre-orders,
// the blog and the restock email band.
// Everything product-related comes from the live catalog (components/home/HomeV2).
export const Route = createFileRoute('/')({
  loader: async () => {
    const [status, live] = await Promise.all([getMySubscriptionStatus(), getBlogLiveMap()])
    return { status, live }
  },
  // Title/description/og:url come from __root.tsx's defaults, which are
  // written for the homepage; only the canonical link is added here.
  head: () => ({
    links: [
      { rel: 'canonical', href: 'https://ebicollectibles.com' },
      // home-v2.css carries the email band's styles (EmailSignup).
      { rel: 'stylesheet', href: homeV2CssUrl },
      { rel: 'stylesheet', href: homeShopCssUrl },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { products } = useCart()
  const { status, live } = Route.useLoaderData()
  return (
    <>
      <h1 className="sr-only">EBI Collectibles: sealed Simplified Chinese Pokémon cards, figures and blind boxes</h1>
      {/* Black Friday Week: keep at the top while the sale runs. */}
      <BlackFridayBanner />
      <HomeV2 products={products} live={live} />
      <div className="hv2-email-wrap" id="restock-alerts">
        <EmailSignup status={status} />
      </div>
    </>
  )
}
