import { Link, useRouterState } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { cartCount, openCart } = useCart()

  const navColor = (active: boolean) => (active ? '#131b28' : '#5a6875')

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e3e6ea',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
          <img
            src="/assets/ebi-logo.jpg"
            alt="EBI Collectibles"
            style={{ width: 42, height: 42, objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.16em' }}>EBI</span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.24em',
                color: '#5a6875',
                textTransform: 'uppercase',
              }}
            >
              Collectibles
            </span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 13.5, fontWeight: 500 }}>
          <Link to="/" style={{ color: navColor(pathname === '/'), padding: '4px 0' }}>
            Home
          </Link>
          <Link
            to="/shop"
            style={{ color: navColor(pathname === '/shop'), padding: '4px 0' }}
          >
            Shop all
          </Link>
          <Link
            to="/shop"
            search={{ type: 'Booster box' }}
            className="ebi-nav-link"
            style={{ color: '#5a6875', padding: '4px 0' }}
          >
            Booster boxes
          </Link>
          <Link
            to="/shop"
            search={{ type: 'Figures' }}
            className="ebi-nav-link"
            style={{ color: '#5a6875', padding: '4px 0' }}
          >
            Figures
          </Link>
          <Link to="/faq" style={{ color: navColor(pathname === '/faq'), padding: '4px 0' }}>
            FAQ &amp; shipping
          </Link>
        </nav>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid #e3e6ea',
            borderRadius: 2,
            padding: '8px 12px',
            width: 210,
            background: '#f6f7f8',
          }}
        >
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#98a1ab' }}>⌕</span>
          <input
            placeholder="Search sets, CBB codes…"
            style={{ border: 0, background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#131b28' }}
          />
        </div>

        <button
          onClick={openCart}
          className="ebi-btn-dark"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#131b28',
            color: '#ffffff',
            border: 0,
            borderRadius: 2,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span>Cart</span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11.5,
              background: 'rgba(255,255,255,0.16)',
              borderRadius: 2,
              padding: '2px 7px',
            }}
          >
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  )
}
