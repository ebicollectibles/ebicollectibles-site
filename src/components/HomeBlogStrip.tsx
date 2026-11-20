import { Link } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import type { BlogLiveMap } from '~/server/blog-status'

// How many posts the strip shows. Enough to scroll, few enough to stay a
// footnote to the store above it.
const MAX_POSTS = 10

/**
 * A single quiet row near the bottom of the home page: the newest published
 * blog posts, scrolling sideways. It exists to show visitors (and search
 * engines, through the links) that the store has a blog, without taking
 * space or attention from the products. Renders nothing if no post is live.
 */
export function HomeBlogStrip({ live }: { live: BlogLiveMap }) {
  // Same order as the blog index: newest post date first.
  const posts = [...BLOG_POSTS]
    .filter((p) => p.slug in live)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, MAX_POSTS)
  if (posts.length === 0) return null

  return (
    <section className="ebi-blog-strip" aria-labelledby="ebi-blog-strip-title">
      <div className="ebi-blog-strip-head">
        <h2 id="ebi-blog-strip-title">From the blog</h2>
        <Link to="/blog" className="ebi-blog-strip-all">
          All posts<span className="sr-only"> on the blog</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
      {/* Focusable so the row can be scrolled with the arrow keys. */}
      <ul className="ebi-blog-strip-row" tabIndex={0} aria-label="Latest blog posts, scrolls sideways">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={p.path} className="ebi-blog-strip-card">
              {/* Decorative: the title beside it says what the post is. The
                  800px copy of the banner is plenty at this size. */}
              <img src={p.heroImage.replace(/\.webp$/, '-800.webp')} alt="" loading="lazy" width={800} height={450} />
              <span className="ebi-blog-strip-tag">{p.tag}</span>
              <span className="ebi-blog-strip-title">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
