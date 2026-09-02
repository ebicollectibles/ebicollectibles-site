import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '110px 28px 140px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 32, letterSpacing: '-0.02em', fontWeight: 700, margin: 0 }}>Page not found</h1>
      <div style={{ fontSize: 15, lineHeight: 1.65, color: '#5a6875', margin: '12px 0 0' }}>
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: 28,
          background: '#131b28',
          color: '#ffffff',
          borderRadius: 2,
          padding: '14px 26px',
          fontSize: '13.5px',
          fontWeight: 600,
        }}
      >
        Back to the catalogue
      </Link>
    </div>
  )
}
