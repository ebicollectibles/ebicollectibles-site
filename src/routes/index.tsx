import { createFileRoute } from '@tanstack/react-router'
import homeV2CssUrl from '~/styles/home-v2.css?url'
import homeShopCssUrl from '~/styles/home-shop.css?url'
import { BlackFridayBanner } from '~/components/home/BlackFridayBanner'
import { HomeV2 } from '~/components/home/HomeV2'
import { EmailSignup } from '~/components/home/EmailSignup'
import { useCart } from '~/lib/cart-context'
import { getMySubscriptionStatus } from '~/server/subscribers'
import { getBlogLiveMap } from '~/server/blog-status'
import { contestLive } from '~/lib/contest'

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
    // While the Black Friday Promotion runs, a shared homepage link shows the
    // sale and prizes (lib/contest.ts); after it ends, the site-wide card.
    meta: contestLive()
      ? [
          { property: 'og:title', content: 'Black Friday Week at EBI Collectibles: sale, free packs and prizes' },
          {
            property: 'og:description',
            content: 'Sale prices on Simplified Chinese Pokémon, a free Chinese pack on every order, and prizes for the top 3 spenders. Ends Monday 11/30.',
          },
          { property: 'og:image', content: 'https://ebicollectibles.com/assets/share/home-black-friday-v3.jpg' },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: 'Black Friday Week at EBI Collectibles, ends Monday 11/30: a free Chinese pack on every order and prizes for the top 3 spenders' },
          { name: 'twitter:image', content: 'https://ebicollectibles.com/assets/share/home-black-friday-v3.jpg' },
        ]
      : [],
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
