import * as React from 'react'
import { Link, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@clerk/tanstack-react-start'
import { useCart } from '~/lib/cart-context'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { HeaderSearch } from '~/components/HeaderSearch'

interface HeaderCustomer {
  id: string
  email: string
  name: string | null
}

function PersonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const menuItemStyle: React.CSSProperties = { display: 'block', padding: '9px 14px', fontSize: 13, color: '#3d4753', whiteSpace: 'nowrap' }

// A header dropdown (Pokemon, Set Lists, My Account) as a menu button:
// the trigger says whether it is open (aria-expanded) and which panel it
// controls; Enter, Space or the Down arrow opens it and moves focus to the
// first item, Up/Down/Home/End move between items (Tab works too), and
// Escape closes it and puts focus back on the trigger. Clicking outside,
// tabbing away, picking an item or navigating closes it as well.
function NavMenu({
  id,
  label,
  closeKey,
  triggerStyle,
  panelStyle,
  wrapperClassName,
  wrapperStyle,
  children,
}: {
  id: string
  /** Trigger contents; `open` lets the caller style or swap the arrow. */
  label: (open: boolean) => React.ReactNode
  /** Changes whenever the page navigates, which closes the menu. */
  closeKey: string
  triggerStyle: (open: boolean) => React.CSSProperties
  panelStyle?: React.CSSProperties
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const focusOnOpen = React.useRef<'first' | 'last' | null>(null)
  const items = () => Array.from(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

  React.useEffect(() => {
    setOpen(false)
  }, [closeKey])

  React.useEffect(() => {
    if (!open) return
    if (focusOnOpen.current) {
      const list = items()
      ;(focusOnOpen.current === 'last' ? list[list.length - 1] : list[0])?.focus()
      focusOnOpen.current = null
    }
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (!open) return
      e.stopPropagation()
      setOpen(false)
      btnRef.current?.focus()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    const down = e.key === 'ArrowDown'
    if (!open) {
      if (e.key === 'Home' || e.key === 'End') return
      e.preventDefault()
      focusOnOpen.current = down ? 'first' : 'last'
      setOpen(true)
      return
    }
    const list = items()
    if (list.length === 0) return
    const i = list.indexOf(document.activeElement as HTMLElement)
    if ((e.key === 'Home' || e.key === 'End') && i < 0) return
    e.preventDefault()
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : i < 0 ? (down ? 0 : list.length - 1) : (i + (down ? 1 : -1) + list.length) % list.length
    list[next]?.focus()
  }

  return (
    <div
      ref={wrapRef}
      className={wrapperClassName}
      style={{ position: 'relative', ...wrapperStyle }}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        // Tabbing out of the menu closes it. A null relatedTarget (a mouse
        // press, a window switch) is left to the click-outside handler.
        const to = e.relatedTarget as Node | null
        if (to && !wrapRef.current?.contains(to)) setOpen(false)
      }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          // detail is 0 when the click came from Enter or Space: focus then
          // moves into the menu, as it does for the Down arrow.
          if (!open && e.detail === 0) focusOnOpen.current = 'first'
          setOpen((v) => !v)
        }}
        style={triggerStyle(open)}
      >
        {label(open)}
      </button>
      {/* Always in the page so aria-controls points at something; hidden when closed. */}
      <div
        id={id}
        role="menu"
        hidden={!open}
        className="ebi-nav-dropdown-panel"
        style={panelStyle}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('[role="menuitem"]')) setOpen(false)
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Header({
  customer,
  isAdminUser = false,
  isAffiliateUser = false,
}: {
  customer: HeaderCustomer | null
  isAdminUser?: boolean
  isAffiliateUser?: boolean
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // Full href (not just pathname) — the Pokemon submenu links all stay on
  // /shop with different `search` params, so pathname alone never changes
  // and the close-on-navigate effect below would never fire.
  const locationHref = useRouterState({ select: (s) => s.location.href })
  const router = useRouter()
  const navigate = useNavigate()
  // Gates the header's logged-in/out UI on Clerk's own session state, not
  // on whether our users table has a row linked yet — those can briefly
  // disagree (e.g. a session that never finished syncing), and this way
  // there's always a working "Log out" whenever Clerk thinks you're
  // signed in, instead of a stuck "Log in" with no way back out.
  const { isSignedIn, signOut } = useAuth()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const burgerRef = React.useRef<HTMLButtonElement>(null)
  // Read out when the cart count changes (not on first load).
  const [cartNotice, setCartNotice] = React.useState('')
  const lastCartCount = React.useRef<number | null>(null)
  React.useEffect(() => {
    if (lastCartCount.current !== null && lastCartCount.current !== cartCount) {
      setCartNotice(`Cart updated: ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`)
    }
    lastCartCount.current = cartCount
  }, [cartCount])

  const navColor = (active: boolean) => (active ? '#131b28' : '#5a6875')

  const logout = async () => {
    await signOut()
    await router.invalidate()
    navigate({ to: '/' })
  }

  React.useEffect(() => {
    setMenuOpen(false)
  }, [locationHref])

  // Escape closes the mobile menu and returns focus to its button.
  React.useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || document.querySelector('[data-ebi-modal]')) return
      setMenuOpen(false)
      burgerRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

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
          ref={burgerRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="ebi-header-burger"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="ebi-mobile-menu"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            flexShrink: 0,
            background: 'transparent',
            border: '1px solid #e3e6ea',
            borderRadius: 2,
            cursor: 'pointer',
            color: '#131b28',
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* The logo sits beside the same words as text, so its alt is empty
            and the link is named once, by that text ("EBI Collectibles"). */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
          <img
            src="/assets/ebi-logo.jpg"
            alt=""
            width={42}
            height={42}
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
          aria-label="Main"
          className="ebi-header-desktop-nav"
          style={{ alignItems: 'center', gap: 26, fontSize: 13.5, fontWeight: 500 }}
        >
          <Link to="/" style={{ color: navColor(pathname === '/'), padding: '4px 0' }}>
            Home
          </Link>
          <NavMenu
            id="ebi-nav-pokemon"
            closeKey={locationHref}
            triggerStyle={(open) => ({
              background: 'transparent',
              border: 0,
              padding: '4px 0',
              font: 'inherit',
              color: navColor(pathname === '/shop' || open),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            })}
            label={(open) => (
              <>
                Pokemon
                <span aria-hidden="true" style={{ fontSize: 9, color: '#5a6875' }}>
                  {open ? '▴' : '▾'}
                </span>
              </>
            )}
          >
            <Link role="menuitem" to="/shop" search={{ category: 'Chinese Pokémon Products' }} style={menuItemStyle}>
              All Pokemon (Chinese)
            </Link>
            <Link role="menuitem" to="/shop" search={{ preorder: true }} style={menuItemStyle}>
              Preorders
            </Link>
            <Link role="menuitem" to="/shop" search={{ subcategory: 'Booster Box' }} style={menuItemStyle}>
              Booster Boxes
            </Link>
            <Link role="menuitem" to="/shop" search={{ subcategory: 'Blind Box' }} style={menuItemStyle}>
              Blind Boxes
            </Link>
            <Link role="menuitem" to="/shop" search={{ subcategories: ['Figure', 'Plush'] }} style={menuItemStyle}>
              Figures &amp; Plush
            </Link>
            <Link role="menuitem" to="/shop" search={{ subcategory: 'Special Products' }} style={menuItemStyle}>
              Special Products
            </Link>
            <Link role="menuitem" to="/shop" search={{ subcategory: 'Binder' }} style={menuItemStyle}>
              Binders
            </Link>
          </NavMenu>
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
          <NavMenu
            id="ebi-nav-sets"
            closeKey={locationHref}
            triggerStyle={(open) => ({
              background: 'transparent',
              border: 0,
              padding: '4px 0',
              font: 'inherit',
              color: navColor(pathname.startsWith('/sets') || open),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            })}
            label={(open) => (
              <>
                Set Lists
                <span aria-hidden="true" style={{ fontSize: 9, color: '#5a6875' }}>
                  {open ? '▴' : '▾'}
                </span>
              </>
            )}
          >
            <Link role="menuitem" to="/sets/chinese" style={menuItemStyle}>
              Simplified Chinese
            </Link>
          </NavMenu>
          <Link to="/blog" style={{ color: navColor(pathname.startsWith('/blog')), padding: '4px 0' }}>
            Blog
          </Link>
          <Link to="/shipping-policy" style={{ color: navColor(pathname === '/shipping-policy'), padding: '4px 0', whiteSpace: 'nowrap' }}>
            Shipping policy
          </Link>
        </nav>

        <div style={{ flex: 1 }} />

        <HeaderSearch variant="desktop" />

        {isSignedIn ? (
          <NavMenu
            id="ebi-nav-account"
            closeKey={locationHref}
            wrapperClassName="ebi-header-account"
            wrapperStyle={{ flexShrink: 0 }}
            panelStyle={{ right: 0, left: 'auto' }}
            triggerStyle={(open) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'transparent',
              border: 0,
              padding: '4px 0',
              font: 'inherit',
              color: navColor(pathname.startsWith('/account') || open),
              cursor: 'pointer',
            })}
            label={() => (
              <>
                <PersonIcon />
                <span style={{ fontSize: 10.5, fontWeight: 600 }}>My Account</span>
              </>
            )}
          >
            <Link role="menuitem" to="/account/orders" style={menuItemStyle}>
              Orders
            </Link>
            <Link role="menuitem" to="/account/profile" style={menuItemStyle}>
              Profile
            </Link>
            {isAffiliateUser && (
              <Link role="menuitem" to="/account/affiliate" style={menuItemStyle}>
                Affiliate
              </Link>
            )}
            {isAdminUser && (
              <Link role="menuitem" to="/admin" style={{ ...menuItemStyle, borderTop: '1px solid #f0f2f4' }}>
                Admin
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              style={{ ...menuItemStyle, width: '100%', textAlign: 'left', background: 'none', border: 0, cursor: 'pointer' }}
            >
              Log out
            </button>
          </NavMenu>
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
          <span className="sr-only">{cartCount === 1 ? 'item' : 'items'}</span>
        </Link>
        <span className="sr-only" role="status">
          {cartNotice}
        </span>
      </div>

      <div id="ebi-mobile-menu" className={`ebi-mobile-menu${menuOpen ? ' is-open' : ''}`} style={{ flexDirection: 'column', borderTop: '1px solid #e3e6ea', padding: '14px 20px 20px', background: '#ffffff' }}>
        <div style={{ marginBottom: 16 }}>
          <HeaderSearch variant="mobile" onNavigate={() => setMenuOpen(false)} />
        </div>
        <nav aria-label="Main" style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 15, fontWeight: 500 }}>
          <Link to="/" style={{ color: navColor(pathname === '/'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Home
          </Link>
          <Link to="/shop" search={{ category: 'Chinese Pokémon Products' }} style={{ color: navColor(pathname === '/shop'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            All Pokemon (Chinese)
          </Link>
          <Link to="/shop" search={{ preorder: true }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Preorders
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
          <Link to="/shop" search={{ subcategory: 'Binder' }} style={{ color: '#5a6875', padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Binders
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
          <Link to="/sets/chinese" style={{ color: navColor(pathname.startsWith('/sets')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Set Lists: Simplified Chinese
          </Link>
          <Link to="/blog" style={{ color: navColor(pathname.startsWith('/blog')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
            Blog
          </Link>
          <Link
            to="/shipping-policy"
            style={{ color: navColor(pathname === '/shipping-policy'), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}
          >
            Shipping policy
          </Link>
          {isSignedIn ? (
            <>
              <Link to="/account/orders" style={{ color: navColor(pathname.startsWith('/account/orders')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                Orders
              </Link>
              <Link to="/account/profile" style={{ color: navColor(pathname.startsWith('/account/profile')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                Profile
              </Link>
              {isAffiliateUser && (
                <Link to="/account/affiliate" style={{ color: navColor(pathname.startsWith('/account/affiliate')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                  Affiliate
                </Link>
              )}
              {isAdminUser && (
                <Link to="/admin" style={{ color: navColor(pathname.startsWith('/admin')), padding: '10px 0', borderBottom: '1px solid #f0f2f4' }}>
                  Admin
                </Link>
              )}
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
