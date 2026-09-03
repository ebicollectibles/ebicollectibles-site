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
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5a6875', margin: '14px 0 0', maxWidth: '34ch' }}>
            Simplified Chinese Pokémon boxes, figures and blind boxes — sourced through authorised distribution and
            verified in-house.
          </p>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#98a1ab',
            }}
          >
            Shop
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <Link to="/shop">Chinese Pokémon Products</Link>
            <Link to="/shop" search={{ type: 'Booster box' }}>
              Booster boxes
            </Link>
            <Link to="/shop" search={{ type: 'Figures' }}>
              Figures &amp; blind boxes
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
              color: '#98a1ab',
            }}
          >
            Help
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <Link to="/faq">FAQ &amp; shipping</Link>
            <Link to="/faq">Authenticity guarantee</Link>
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
              color: '#98a1ab',
            }}
          >
            Elsewhere
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14, fontSize: 13 }}>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">YouTube</a>
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
