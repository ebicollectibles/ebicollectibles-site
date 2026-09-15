// Simple, low-risk brand marks (plain geometry / styled text) rather than
// hand-traced logo paths — a hand-drawn Apple Pay mark shipped earlier with
// a bad bounding box and clipped, so these deliberately stick to shapes
// that can't render wrong: two flat circles for Mastercard, styled
// wordmarks for Visa/Amex.
export function CardBrandLogos() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} aria-hidden="true">
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 13,
          color: '#1434cb',
          letterSpacing: '-0.02em',
        }}
      >
        VISA
      </span>
      <svg width="22" height="14" viewBox="0 0 22 14" role="img" aria-label="Mastercard">
        <circle cx="8" cy="7" r="7" fill="#eb001b" />
        <circle cx="14" cy="7" r="7" fill="#f79e1b" />
        <path d="M11 1.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#ff5f00" />
      </svg>
      <span
        style={{
          background: '#006fcf',
          color: '#ffffff',
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: '0.03em',
          padding: '2px 4px',
          borderRadius: 2,
        }}
      >
        AMEX
      </span>
    </span>
  )
}
