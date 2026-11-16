import { Link } from '@tanstack/react-router'
import type { BlogGuideLink } from '~/server/blog-status'

// "Read our guides" links from a set page or product page to that set's
// live blog posts. Renders nothing until at least one post is live.
export function BlogGuideLinks({ guides, maxWidth = 320 }: { guides: BlogGuideLink[]; maxWidth?: number }) {
  if (guides.length === 0) return null
  return (
    <nav aria-label="Guides for this set" style={{ marginTop: 28, maxWidth, borderTop: '1px solid #e3e6ea', paddingTop: 18 }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#5a6875',
          marginBottom: 10,
        }}
      >
        Read our guides
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {guides.map((g) => (
          <li key={g.path}>
            <Link to={g.path as never} style={{ display: 'block', color: '#131b28', textDecoration: 'none' }}>
              <span style={{ display: 'block', fontSize: 11.5, color: '#5a6875', fontWeight: 600 }}>{g.tag}</span>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, textDecoration: 'underline', textUnderlineOffset: 3 }}>{g.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
