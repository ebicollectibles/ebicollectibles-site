import { Link } from '@tanstack/react-router'
import { BLOG_POSTS, type BlogPostSummary } from '~/data/blog-posts'

// The blog on the homepage proposal: the newest live posts as a swipeable
// row of banners, next to the evergreen guides a first-time buyer of
// Chinese product needs. Only posts that are live (see /admin/blog) show.

const TAG_LABEL: Record<string, string> = {
  'New release': 'Release news',
  'Set guide': 'Set guide',
  'Collecting guide': 'Guide',
  News: 'News',
}

function label(p: BlogPostSummary): string {
  if (p.slug.endsWith('-card-origins')) return 'Card origins'
  return TAG_LABEL[p.tag] ?? p.tag
}

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const EVERGREEN = ['chinese-pokemon-sets-in-order', 'chinese-gem-pack-hit-rates'] as const

export function HomeGuides({ live }: { live: Record<string, string> }) {
  const isLive = (p: BlogPostSummary) => p.slug in live
  const latest = BLOG_POSTS.filter((p) => isLive(p) && !(EVERGREEN as readonly string[]).includes(p.slug))
    // Newest by publish date, then by when it went live.
    .sort((a, b) => b.date.localeCompare(a.date) || (live[b.slug] ?? '').localeCompare(live[a.slug] ?? ''))
    .slice(0, 8)
  const evergreen = EVERGREEN.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter((p): p is BlogPostSummary => !!p && isLive(p))
  if (latest.length === 0 && evergreen.length === 0) return null

  return (
    <section className="hp2-section" aria-labelledby="hp2-guides">
      <div className="hp2-wrap">
        <div className="hp2-head">
          <div>
            <div className="hp2-eyebrow">From the blog</div>
            <h2 id="hp2-guides">Know what's in the box</h2>
            <p>Release news, set guides with the chase cards, and where each card's art comes from.</p>
          </div>
          <div className="hp2-head-actions">
            <Link to="/blog" className="hp2-seeall">
              All posts
            </Link>
          </div>
        </div>
        <div className="hp2-guides">
          <ul className="hp2-guide-rail">
            {latest.map((g) => (
              <li key={g.slug}>
                <a href={g.path} className="hp2-guide">
                  <span className="hp2-guide-img">
                    <img
                      src={g.heroImage.replace(/\.webp$/, '-800.webp')}
                      srcSet={`${g.heroImage.replace(/\.webp$/, '-800.webp')} 800w, ${g.heroImage} 1600w`}
                      sizes="(max-width: 700px) 78vw, 300px"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={450}
                    />
                  </span>
                  <span className="hp2-guide-meta">
                    <span className="hp2-guide-tag">{label(g)}</span>
                    <span className="hp2-guide-date">{shortDate(g.date)}</span>
                  </span>
                  <span className="hp2-guide-title">{g.title}</span>
                </a>
              </li>
            ))}
          </ul>
          {evergreen.length > 0 && (
            <aside className="hp2-starter" aria-label="Start here">
              <div className="hp2-eyebrow hp2-eyebrow--on-dark">New to Chinese Pokémon? Start here</div>
              <ul>
                {evergreen.map((g) => (
                  <li key={g.slug}>
                    <a href={g.path}>{g.title}</a>
                  </li>
                ))}
                <li>
                  <Link to="/sets/chinese">Every Simplified Chinese card list, with rarities</Link>
                </li>
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
