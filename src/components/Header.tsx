import * as React from 'react'
import { Link, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { customerLogout } from '~/server/customer-auth'
import { HeaderSearch } from '~/components/HeaderSearch'

interface HeaderCustomer {
  id: string
  email: string
  name: string | null
}

function PersonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Header({ customer }: { customer: HeaderCustomer | null }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // Full href (not just pathname) — the Pokemon submenu links all stay on
  // /shop with different `search` params, so pathname alone never changes
  // and the close-on-navigate effect below would never fire.
  const locationHref = useRouterState({ select: (s) => s.location.href })
  const router = useRouter()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [pokemonMenuOpen, setPokemonMenuOpen] = React.useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false)
  const pokemonMenuRef = React.useRef<HTMLDivElement>(null)
  const accountMenuRef = React.useRef<HTMLDivElement>(null)

  const navColor = (active: boolean) => (active ? '#131b28' : '#5a6875')

  const logout = async () => {
    await customerLogout()
    await router.invalidate()
    navigate({ to: '/' })
  }

  React.useEffect(() => {
    setMenuOpen(false)
    setPokemonMenuOpen(false)
    setAccountMenuOpen(false)
  }, [locationHref])

  React.useEffect(() => {
    if (!pokemonMenuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (!pokemonMenuRef.current?.contains(e.target as Node)) setPokemonMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [pokemonMenuOpen])

  React.useEffect(() => {
    if (!accountMenuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (!accountMenuRef.current?.contains(e.target as Node)) setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [accountMenuOpen])

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
        className="ebi-header-row"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="ebi-header-burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            flexShrink: 0,
            background: 'transparent',
            border: '1px solid #e3e6ea',
            borderRadius: 2,
            cursor: 'pointer',
            color: '#131b28',
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

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

        <nav
          className="ebi-header-desktop-nav"
          style={{ alignItems: 'center', gap: 26, fontSize: 13.5, fontWeight: 500 }}
        >
          <Link to="/" style={{ color: navColor(pathname === '/'), padding: '4px 0' }}>
            Home
          </Link>
          <div ref={pokemonMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setPokemonMenuOpen((v) => !v)}
              aria-expanded={pokemonMenuOpen}
              style={{
                background: 'transparent',
                border: 0,
                padding: '4px 0',
                font: 'inherit',
                color: navColor(pathname === '/shop' || pokemonMenuOpen),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
              }}
            >
              Pokemon
              <span style={{ fontSize: 9, color: '#98a1ab' }}>{pokemonMenuOpen ? '▴' : '▾'}</span>
            </button>
            {pokemonMenuOpen && (
              <div className="ebi-nav-dropdown-panel">
                <Link to="/shop" search={{ category: 'Chinese Pokémon Products' }} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  All Pokemon (Chinese)
                </Link>
                <Link to="/shop" search={{ subcategory: 'Booster Box' }} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Booster Boxes
                </Link>
                <Link to="/shop" search={{ subcategory: 'Blind Box' }} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Blind Boxes
                </Link>
                <Link to="/shop" search={{ subcategories: ['Figure', 'Plush'] }} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Figures &amp; Plush
                </Link>
                <Link to="/shop" search={{ subcategory: 'Special Products' }} style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Special Products
                </Link>
              </div>
            )}
          </div>
          {SHOW_ACRYLICS && (
            <Link
              to="/shop"
              search={{ category: 'Acrylic Cases' }}
              className="ebi-nav-link"
              style={{ color: '#5a6875', padding: '4px 0' }}
            >
              Acrylics
            </Link>
          )}
          <Link to="/shipping-returns" style={{ color: navColor(pathname === '/shipping-returns'), padding: '4px 0' }}>
            Shipping &amp; returns
          </Link>
        </nav>

        <div style={{ flex: 1 }} />

        <HeaderSearch variant="desktop" />

        {customer ? (
          <div ref={accountMenuRef} className="ebi-header-account" style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((v) => !v)}
              aria-expanded={accountMenuOpen}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                background: 'transparent',
                border: 0,
                padding: '4px 0',
                font: 'inherit',
                color: navColor(pathname.startsWith('/account') || accountMenuOpen),
                cursor: 'pointer',
              }}
            >
              <PersonIcon />
              <span style={{ fontSize: 10.5, fontWeight: 600 }}>My Account</span>
            </button>
            {accountMenuOpen && (
              <div className="ebi-nav-dropdown-panel" style={{ right: 0, left: 'auto' }}>
                <Link to="/account/orders" style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Orders
                </Link>
                <Link to="/account/profile" style={{ display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }}>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 14px',
                    fontSize: 13,
                    color: '#3d4753',
                    whiteSpace: 'nowrap',
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/account/login"
            className="ebi-header-account"
            style={{ color: navColor(pathname.startsWith('/account')), padding: '4px 0', fontSize: 13.5, fontWeight: 500, flexShrink: 0 }}
          >
            Log in
          </Link>
        )}

        <Link
          to="/cart"
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
            flexShrink: 0,
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
        </Link>
      </div>

      <div className={`ebi-mobile-menu${menuOpen ? ' is-open' : ''}`} style={{ flexDirection: 'column', borderTop: '1px solid #e3e6ea', padding: '14px 20px 20px', background: '#ffffff' }}>
        <div style={{ marginBottom: 16 }}>
          <HeaderSearch variant="mobile" onNavigate={() => setMenuOpen(false)} />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 15, fontWeight: 500 }}>
          <Link to="/" style={{ color: navColor(pathname === '/'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Home
          </Link>
          <Link to="/shop" search={{ category: 'Chinese Pokémon Products' }} style={{ color: navColor(pathname === '/shop'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            All Pokemon (Chinese)
          </Link>
          <Link to="/shop" search={{ subcategory: 'Booster Box' }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Booster Boxes
          </Link>
          <Link to="/shop" search={{ subcategory: 'Blind Box' }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Blind Boxes
          </Link>
          <Link to="/shop" search={{ subcategories: ['Figure', 'Plush'] }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Figures &amp; Plush
          </Link>
          <Link to="/shop" search={{ subcategory: 'Special Products' }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Special Products
          </Link>
          {SHOW_ACRYLICS && (
            <Link
              to="/shop"
              search={{ category: 'Acrylic Cases' }}
              style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}
            >
              Acrylics
            </Link>
          )}
          <Link
            to="/shipping-returns"
            style={{ color: navColor(pathname === '/shipping-returns'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}
          >
            Shipping &amp; returns
          </Link>
          {customer ? (
            <>
              <Link to="/account/orders" style={{ color: navColor(pathname.startsWith('/account/orders')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                Orders
              </Link>
              <Link to="/account/profile" style={{ color: navColor(pathname.startsWith('/account/profile')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                Profile
              </Link>
              <button
                type="button"
                onClick={logout}
                style={{ textAlign: 'left', color: '#5a6875', padding: '10px 0', background: 'none', border: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/account/login" style={{ color: navColor(pathname.startsWith('/account')), padding: '10px 0' }}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
