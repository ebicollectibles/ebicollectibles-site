import { Link } from '@tanstack/react-router'

export function Footer() {
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
            Simplified Chinese Pokémon boxes, figures and blind boxes — sourced directly from China and checked
            in-house before it ships.
          </p>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#131b28',
            }}
          >
            Shop
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <Link to="/shop" search={{ category: 'Chinese Pokémon Products' }}>
              Chinese Pokémon Products
            </Link>
            <Link to="/shop" search={{ subcategory: 'Gem Series' }}>
              Gem Series
            </Link>
            <Link to="/shop" search={{ subcategory: 'CSV Series' }}>
              CSV Series
            </Link>
            <Link to="/shop" search={{ subcategory: 'Blind Box' }}>
              Figures &amp; plush
            </Link>
            <Link to="/shop" search={{ category: 'Acrylic Cases' }}>
              Acrylic Cases
            </Link>
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#131b28',
            }}
          >
            Help
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <Link to="/shipping-returns">Shipping &amp; returns</Link>
            <a href="mailto:hello@ebicollectibles.com">Contact us</a>
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#131b28',
            }}
          >
            Elsewhere
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <a href="https://www.instagram.com/ebicollectibles" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #e3e6ea' }}>
        <div
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
            color: '#98a1ab',
          }}
        >
          <span>© 2026 EBI Collectibles</span>
          <span>Not affiliated with, or endorsed by, any card publisher.</span>
        </div>
      </div>
    </footer>
  )
}
