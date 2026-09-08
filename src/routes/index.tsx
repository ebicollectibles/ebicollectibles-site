import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'
import { subscribeToNewsletter } from '~/server/subscribers'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

const SUBSCRIBED_STORAGE_KEY = 'ebi-subscribed'

function HomePage() {
  const { products } = useCart()
  const featured = products.slice(0, 4)
  const totalProductCount = products.length

  const [subscribeEmail, setSubscribeEmail] = React.useState('')
  const [subscribeState, setSubscribeState] = React.useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  // Remembers a successful signup in this browser so revisiting the
  // homepage shows "you're on the list" instead of a blank form again —
  // without this, someone could reasonably wonder if resubmitting keeps
  // adding them. The database itself already dedupes by email regardless
  // (unique constraint), this is purely so it doesn't *look* uncertain.
  React.useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_STORAGE_KEY)) setSubscribeState('done')
    } catch {
      // Ignore unavailable storage — form just behaves as if never subscribed.
    }
  }, [])

  const submitSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeState('submitting')
    try {
      await subscribeToNewsletter({ data: { email: subscribeEmail } })
      setSubscribeState('done')
      try {
        localStorage.setItem(SUBSCRIBED_STORAGE_KEY, '1')
      } catch {
        // Storage can be unavailable (private mode, quota) — subscription still succeeded server-side.
      }
    } catch {
      setSubscribeState('error')
    }
  }

  return (
    <>
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
              src="/assets/gem-vol5.png"
              alt="Gem Pack Vol. 5 booster pack"
              style={{ width: '30%', boxShadow: '0 18px 40px rgba(19,27,40,0.16)', transform: 'rotate(-6deg)', borderRadius: 4 }}
            />
            <img
              src="/assets/gem-vol6.png"
              alt="Gem Pack Vol. 6 booster pack"
              style={{ width: '38%', boxShadow: '0 26px 60px rgba(19,27,40,0.22)', borderRadius: 4, position: 'relative', zIndex: 2 }}
            />
            <img
              src="/assets/gem-vol4.png"
              alt="Gem Pack Vol. 4 booster pack"
              style={{ width: '30%', boxShadow: '0 18px 40px rgba(19,27,40,0.16)', transform: 'rotate(6deg)', borderRadius: 4 }}
            />
          </div>
        </div>
      </section>

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
          <div>
            <h2 style={{ fontSize: 30, letterSpacing: '-0.02em', fontWeight: 700, margin: 0 }}>New arrivals</h2>
          </div>
          <Link to="/shop" style={{ fontSize: 13, fontWeight: 600, color: '#3f7a63', paddingBottom: 4 }}>
            View all {totalProductCount} products →
          </Link>
        </div>
        <div
          className="ebi-arrivals-grid"
          style={{
            background: '#e3e6ea',
            border: '1px solid #e3e6ea',
            borderTop: 0,
          }}
        >
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '68px 20px' }}>
        <div className="ebi-tiles-grid">
          <Link
            to="/shop"
            search={{ subcategory: 'Gem Series' }}
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
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Booster boxes</div>
              <div style={{ fontSize: 13, color: '#131b28', marginTop: 6 }}>CBB &amp; CSV sets, sealed cases on request</div>
            </div>
          </Link>
          <Link
            to="/shop"
            search={{ subcategory: 'Blind Box' }}
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
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Figures &amp; blind boxes</div>
              <div style={{ fontSize: 13, color: '#131b28', marginTop: 6 }}>Poképeace, Hollybox, festival gift sets</div>
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
            <div style={{ ...monoLabel, color: '#7f8b9a' }}>Restock alerts</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Chinese sets sell out in hours.</div>
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
                      fontSize: 12.5,
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
