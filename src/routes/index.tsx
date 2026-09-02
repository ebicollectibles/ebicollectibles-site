import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { useCart } from '~/lib/cart-context'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const STEPS = [
  {
    num: '01 / Sourcing',
    title: 'Authorised distribution only',
    body: 'Invoices on file for every case we open for singles or split boxes.',
  },
  {
    num: '02 / Inspection',
    title: 'Weighed & seam-checked',
    body: 'Gram-accurate weights logged per box, compared against factory spec.',
  },
  {
    num: '03 / Packing',
    title: 'Rigid, double-boxed',
    body: 'Corner protection and void fill on every order over one box.',
  },
  {
    num: '04 / Guarantee',
    title: 'Full refund on any fake',
    body: 'If a product fails authentication anywhere, we refund it in full.',
  },
]

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#98a1ab',
}

function HomePage() {
  const { products } = useCart()
  const featured = products.slice(0, 4)
  const totalProductCount = products.length

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
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#5a6875', maxWidth: '47ch', margin: '20px 0 0' }}>
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
              <Link
                to="/faq"
                className="ebi-btn-outline"
                style={{
                  background: '#ffffff',
                  color: '#131b28',
                  border: '1px solid #cfd4da',
                  borderRadius: 2,
                  padding: '15px 28px',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                How we verify
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 34,
                marginTop: 44,
                paddingTop: 26,
                borderTop: '1px solid #e3e6ea',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>4.98</div>
                <div style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#98a1ab', marginTop: 4 }}>
                  412 reviews
                </div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>0</div>
                <div style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#98a1ab', marginTop: 4 }}>
                  Counterfeit claims
                </div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>48h</div>
                <div style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#98a1ab', marginTop: 4 }}>
                  Dispatch window
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 18, padding: '28px 0' }}>
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

      <section style={{ borderBottom: '1px solid #e3e6ea' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>
          <div className="ebi-steps-grid">
            {STEPS.map((step) => (
              <div key={step.num} className="ebi-step-card" style={{ padding: '30px 28px' }}>
                <div style={monoLabel}>{step.num}</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 10 }}>{step.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: '#5a6875', margin: '7px 0 0' }}>{step.body}</p>
              </div>
            ))}
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
            <div style={monoLabel}>Restocked this week</div>
            <h2 style={{ fontSize: 30, letterSpacing: '-0.02em', fontWeight: 700, margin: '9px 0 0' }}>New arrivals</h2>
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
            search={{ type: 'Booster box' }}
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
              <div style={{ fontSize: 13, color: '#5a6875', marginTop: 6 }}>CBB &amp; CSV sets, sealed cases on request</div>
            </div>
          </Link>
          <Link
            to="/shop"
            search={{ type: 'Figures' }}
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
              <div style={{ fontSize: 13, color: '#5a6875', marginTop: 6 }}>Poképeace, Hollybox, festival gift sets</div>
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
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', gap: 8, marginTop: 14 }}
              >
                <input
                  type="email"
                  placeholder="you@email.com"
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
                  style={{
                    background: '#ffffff',
                    color: '#131b28',
                    border: 0,
                    borderRadius: 2,
                    padding: '10px 16px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Notify me
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
