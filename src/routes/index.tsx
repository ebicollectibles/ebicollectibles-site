import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { AnniversaryCountdown } from '~/components/AnniversaryCountdown'
import { useCart } from '~/lib/cart-context'
import { rankProducts } from '~/lib/products'
import { subscribeToNewsletter, getMySubscriptionStatus } from '~/server/subscribers'

// How many show in the homepage teaser before "View All" takes over —
// 2 columns × 4 rows on mobile/tablet (see .ebi-arrivals-grid in app.css).
const HOMEPAGE_SECTION_SIZE = 8

// Hidden for now, at Leon's request — flip back to true to bring the hero
// banner back.
const SHOW_HERO = false

export const Route = createFileRoute('/')({
  loader: () => getMySubscriptionStatus(),
  component: HomePage,
})

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

function HomePage() {
  const { products } = useCart()
  const bestSelling = rankProducts(products, 'bestSellingRank')
  const newAndUpcoming = rankProducts(products, 'newAndUpcomingRank')
  const subStatus = Route.useLoaderData()

  const [subscribeEmail, setSubscribeEmail] = React.useState(subStatus.email ?? '')
  // Logged-in visitors start already knowing the real answer (their account
  // email is checked against subscribers server-side); logged-out visitors
  // always start from a blank form — there's no reliable, honest way to
  // "remember" a guest between visits, so this doesn't try to fake it.
  const [subscribeState, setSubscribeState] = React.useState<'idle' | 'submitting' | 'done' | 'error'>(
    subStatus.loggedIn && subStatus.subscribed ? 'done' : 'idle',
  )

  // subStatus comes from the route loader, which reruns (with the fresh
  // signed-in-or-not answer) whenever the router is invalidated — e.g.
  // logging in or out elsewhere and coming back to "/" without this
  // component unmounting. The useState initializers above only run on the
  // very first mount, so without this effect the form would keep showing
  // whichever visitor was signed in (or not) the first time this page
  // loaded. Guarded by a key so it doesn't stomp on an in-progress edit or
  // the post-submit "done" state on every unrelated re-render.
  const subStatusKey = `${subStatus.loggedIn}|${subStatus.email ?? ''}|${subStatus.subscribed}`
  const syncedSubStatusKey = React.useRef(subStatusKey)
  React.useEffect(() => {
    if (subStatusKey === syncedSubStatusKey.current) return
    syncedSubStatusKey.current = subStatusKey
    setSubscribeEmail(subStatus.email ?? '')
    setSubscribeState(subStatus.loggedIn && subStatus.subscribed ? 'done' : 'idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subStatusKey])

  const submitSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeState('submitting')
    try {
      await subscribeToNewsletter({ data: { email: subscribeEmail } })
      setSubscribeState('done')
      // A logged-in visitor's "done" reflects their real account, so it
      // stays. A guest gets a brief, seamless confirmation and then the
      // form quietly resets — we can't honestly know it's the same person
      // next visit, so we don't pretend to.
      if (!subStatus.loggedIn) {
        setTimeout(() => {
          setSubscribeEmail('')
          setSubscribeState('idle')
        }, 2500)
      }
    } catch {
      setSubscribeState('error')
    }
  }

  return (
    <>
      <AnniversaryCountdown />
      {SHOW_HERO && (
      <section style={{ borderBottom: '1px solid #e3e6ea', background: '#f6f7f8' }}>
        <div
          className="ebi-hero-grid"
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '76px 20px 84px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#3f7a63',
                border: '1px solid #cfdcd6',
                background: '#ffffff',
                borderRadius: 2,
                padding: '6px 11px',
              }}
            >
              Simplified Chinese · 宝可梦
            </div>
            <h1
              className="ebi-hero-h1"
              style={{
                lineHeight: 1.02,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                margin: '22px 0 0',
                textWrap: 'pretty',
              }}
            >
              Sealed Chinese Pokémon, verified before it leaves the shelf.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#131b28', maxWidth: '47ch', margin: '20px 0 0' }}>
              We buy direct from authorised mainland distribution — never grey-market repacks. Every box is
              weight-checked, seam-inspected and photographed against its case code before we list it.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <Link
                to="/shop"
                className="ebi-btn-dark"
                style={{
                  background: '#131b28',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: 2,
                  padding: '15px 28px',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Shop the catalogue
              </Link>
            </div>
          </div>
          <div
            className="ebi-hero-image"
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 18, padding: '28px 0' }}
          >
            <img
              src="/assets/gem-vol5.jpg"
              alt="Gem Pack Vol. 5 booster pack"
              style={{ width: '30%', boxShadow: '0 18px 40px rgba(19,27,40,0.16)', transform: 'rotate(-6deg)', borderRadius: 4 }}
            />
            <img
              src="/assets/gem-vol6.jpg"
              alt="Gem Pack Vol. 6 booster pack"
              style={{ width: '38%', boxShadow: '0 26px 60px rgba(19,27,40,0.22)', borderRadius: 4, position: 'relative', zIndex: 2 }}
            />
            <img
              src="/assets/gem-vol4.jpg"
              alt="Gem Pack Vol. 4 booster pack"
              style={{ width: '30%', boxShadow: '0 18px 40px rgba(19,27,40,0.16)', transform: 'rotate(6deg)', borderRadius: 4 }}
            />
          </div>
        </div>
      </section>
      )}

      {bestSelling.length > 0 && (
        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '68px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: 22,
              borderBottom: '1px solid #131b28',
            }}
          >
            <h2 style={{ fontSize: 30, letterSpacing: '-0.02em', fontWeight: 700, margin: 0 }}>Best Selling</h2>
          </div>
          <div
            className="ebi-arrivals-grid"
            style={{
              background: '#e3e6ea',
              border: '1px solid #e3e6ea',
              borderTop: 0,
            }}
          >
            {bestSelling.slice(0, HOMEPAGE_SECTION_SIZE).map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
          {bestSelling.length > HOMEPAGE_SECTION_SIZE && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link
                to="/best-selling"
                className="ebi-btn-dark"
                style={{ display: 'inline-block', background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '13px 26px', fontSize: 13, fontWeight: 600 }}
              >
                View All
              </Link>
            </div>
          )}
        </section>
      )}

      {newAndUpcoming.length > 0 && (
        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '68px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: 22,
              borderBottom: '1px solid #131b28',
            }}
          >
            <h2 style={{ fontSize: 30, letterSpacing: '-0.02em', fontWeight: 700, margin: 0 }}>New &amp; Upcoming</h2>
          </div>
          <div
            className="ebi-arrivals-grid"
            style={{
              background: '#e3e6ea',
              border: '1px solid #e3e6ea',
              borderTop: 0,
            }}
          >
            {newAndUpcoming.slice(0, HOMEPAGE_SECTION_SIZE).map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
          {newAndUpcoming.length > HOMEPAGE_SECTION_SIZE && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link
                to="/new-and-upcoming"
                className="ebi-btn-dark"
                style={{ display: 'inline-block', background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '13px 26px', fontSize: 13, fontWeight: 600 }}
              >
                View All
              </Link>
            </div>
          )}
        </section>
      )}

      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '68px 20px' }}>
        <div className="ebi-tiles-grid">
          <Link
            to="/shop"
            search={{ subcategory: 'Booster Box' }}
            className="ebi-tile"
            style={{
              border: '1px solid #e3e6ea',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 168,
              background: '#ffffff',
            }}
          >
            <div style={monoLabel}>Collection</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Booster Boxes</div>
              <div style={{ fontSize: 13, color: '#131b28', marginTop: 6 }}>Gem Series &amp; CSV sets</div>
            </div>
          </Link>
          <Link
            to="/shop"
            search={{ subcategories: ['Figure', 'Blind Box'] }}
            className="ebi-tile"
            style={{
              border: '1px solid #e3e6ea',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 168,
              background: '#ffffff',
            }}
          >
            <div style={monoLabel}>Collection</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Figures &amp; Blind Boxes</div>
              <div style={{ fontSize: 13, color: '#131b28', marginTop: 6 }}>Nuzzle Cheeks, Eevee Figures &amp; more</div>
            </div>
          </Link>
          <div
            style={{
              background: '#131b28',
              color: '#ffffff',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 168,
            }}
          >
            <div style={{ ...monoLabel, color: '#7f8b9a' }}>Email updates</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Email me about restocks and new drops.</div>
              {subscribeState === 'done' ? (
                <div style={{ marginTop: 14, fontSize: 13, color: '#ffffff' }}>You're on the list.</div>
              ) : (
                <form onSubmit={submitSubscribe} style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 2,
                      padding: '10px 12px',
                      color: '#ffffff',
                      // 16px avoids iOS Safari auto-zooming on focus.
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subscribeState === 'submitting'}
                    style={{
                      background: '#ffffff',
                      color: '#131b28',
                      border: 0,
                      borderRadius: 2,
                      padding: '10px 16px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: subscribeState === 'submitting' ? 'default' : 'pointer',
                      opacity: subscribeState === 'submitting' ? 0.6 : 1,
                    }}
                  >
                    {subscribeState === 'submitting' ? 'Submitting…' : 'Notify me'}
                  </button>
                </form>
              )}
              {subscribeState === 'error' && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#e39a7a' }}>Something went wrong — try again.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
