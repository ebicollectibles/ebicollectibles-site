import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { useCookiePreferencesUI } from '~/components/CookieConsent'

const footerHeading: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  fontWeight: 400,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
  margin: 0,
}

export function Footer() {
  const { openPreferences } = useCookiePreferencesUI()

  return (
    <footer style={{ borderTop: '1px solid #e3e6ea', background: '#f6f7f8' }}>
      <div
        className="ebi-footer-grid"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '46px 20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/assets/ebi-logo.jpg"
              alt=""
              style={{ width: 34, height: 34, objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.16em' }}>EBI COLLECTIBLES</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#131b28', margin: '14px 0 0', maxWidth: '34ch' }}>
            Simplified Chinese Pokémon boxes, figures and blind boxes, sourced directly from China and checked
            in-house before it ships.
          </p>
        </div>
        <nav aria-labelledby="footer-shop">
          <h2 id="footer-shop" style={footerHeading}>
            Shop
          </h2>
          <ul className="ebi-footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 13 }}>
            <li>
              <Link to="/shop" search={{ category: 'Chinese Pokémon Products' }}>
                All Pokemon (Chinese)
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ subcategory: 'Booster Box' }}>
                Booster Boxes
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ subcategory: 'Blind Box' }}>
                Blind Boxes
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ subcategories: ['Figure', 'Plush'] }}>
                Figures &amp; Plush
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ subcategory: 'Special Products' }}>
                Special Products
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ subcategory: 'Binder' }}>
                Binders
              </Link>
            </li>
            {SHOW_ACRYLICS && (
              <li>
                <Link to="/shop" search={{ category: 'Acrylic Cases' }}>
                  Acrylic Cases
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <nav aria-labelledby="footer-help">
          <h2 id="footer-help" style={footerHeading}>
            Help
          </h2>
          <ul className="ebi-footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 13 }}>
            <li>
              <Link to="/shipping-policy">Shipping policy</Link>
            </li>
            <li>
              <Link to="/refund-policy">Refund policy</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link to="/cookie-policy">Cookie policy</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Terms of service</Link>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere" style={footerHeading}>
            Elsewhere
          </h2>
          <ul className="ebi-footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 13 }}>
            <li>
              <a href="https://www.instagram.com/ebicollectibles" target="_blank" rel="noopener noreferrer">
                Instagram
              <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ borderTop: '1px solid #e3e6ea' }}>
        <div
          className="ebi-footer-bottom"
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '18px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: '#5a6875',
          }}
        >
          <span>© 2026 EBI Collectibles</span>
          <button
            type="button"
            data-cookie-preferences
            aria-haspopup="dialog"
            onClick={openPreferences}
            style={{ background: 'none', border: 'none', color: '#5a6875', fontFamily: 'inherit', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            Cookie preferences
          </button>
          <span>Not affiliated with, or endorsed by, any card publisher.</span>
        </div>
      </div>
    </footer>
  )
}
