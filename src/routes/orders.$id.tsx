import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { getOrderByLink } from '~/server/order-link'
import { OrderDetail } from '~/components/OrderDetail'

// The page the "View your order" button in order emails opens. See
// server/order-link.ts. Kept out of search results; server.ts also marks
// it no-store and no-referrer so the link isn't cached or leaked.
export const Route = createFileRoute('/orders/$id')({
  validateSearch: z.object({ k: z.string().max(64).optional() }),
  loaderDeps: ({ search }) => ({ k: search.k }),
  loader: async ({ params, deps }) => {
    const ok = z.string().uuid().safeParse(params.id).success
    const res = ok ? await getOrderByLink({ data: { id: params.id, k: deps.k } }) : ({ status: 'invalid' } as const)
    if (res.status === 'owner') throw redirect({ to: '/account/orders/$id', params: { id: res.id } })
    return res
  },
  head: () => ({ meta: [{ title: 'Your order | EBI Collectibles' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: OrderLinkPage,
})

const mono = "'IBM Plex Mono', monospace"
const btn = { display: 'inline-block', background: '#131b28', color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '11px 18px', borderRadius: 3, textDecoration: 'none' } as const

function OrderLinkPage() {
  const res = Route.useLoaderData()
  const { id } = Route.useParams()

  if (res.status !== 'ok') {
    return (
      <section style={{ maxWidth: 560, margin: '0 auto', padding: '72px 24px 110px', fontFamily: 'Archivo, Helvetica, sans-serif', textAlign: 'center' }}>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a6875' }}>Your order</div>
        <h1 style={{ fontSize: 26, margin: '12px 0 0' }}>This order link doesn&rsquo;t work</h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5a6875', margin: '12px 0 26px' }}>
          It may have been cut off when it was copied. Open the button in your order email again, or sign in to see all your orders.
        </p>
        <Link to="/account/login" search={{ redirect: '/account/orders' }} style={btn}>
          Sign in
        </Link>
      </section>
    )
  }

  const banner = (
    <div style={{ background: '#f6f7f8', border: '1px solid #e3e6ea', borderRadius: 4, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div style={{ minWidth: 0, flex: '1 1 260px' }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#131b28' }}>
          {res.hasAccount ? 'Sign in to see all your orders' : 'Keep all your orders in one place'}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#5a6875', marginTop: 3 }}>
          {res.hasAccount
            ? 'Order history, tracking and store credit, all in your account.'
            : 'Create a free account with the email you ordered with. This order and any past ones are added automatically.'}
        </div>
      </div>
      {res.hasAccount ? (
        <Link to="/account/login" search={{ redirect: `/account/orders/${id}` }} style={btn}>
          Sign in
        </Link>
      ) : (
        <Link to="/account/signup" style={btn}>
          Create account
        </Link>
      )}
    </div>
  )

  return <OrderDetail order={res.order} view="link" banner={banner} />
}
