import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { safeJsonLd } from '~/lib/gem-sets/head'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: 'News | EBI Collectibles' },
      // Unlisted for now — reachable only by direct link, not linked from
      // nav/footer/sitemap, and excluded from indexing until launched properly.
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'Release posts and collecting guides for Simplified Chinese Pokémon TCG sets and Pokémon figures.',
      },
      { property: 'og:title', content: 'News | EBI Collectibles' },
      {
        property: 'og:description',
        content: 'Release coverage and collecting guides for Simplified Chinese Pokémon TCG sets.',
      },
      { property: 'og:url', content: `${BLOG_SITE_URL}/blog` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}/blog` },
    ],
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'EBI Collectibles News',
    url: `${BLOG_SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      url: `${BLOG_SITE_URL}${p.path}`,
      image: p.heroImage,
    })),
  }

  return (
    <div className="ebi-blog">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <section className="hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>News</span>
          </div>
          <div className="eyebrow">
            <span className="dot" />
            EBI Collectibles
          </div>
          <h1>News &amp; collecting guides</h1>
          <p className="lede">
            New Simplified Chinese Pokémon TCG releases, the chase cards in each set, and which English cards their art comes from.
          </p>
        </div>
      </section>
      <main className="wrap">
        <div className="post-grid">
          {posts.map((p) => (
            <Link key={p.slug} className="post-card" to={p.path}>
              <div className="post-card-art">
                <span className="post-card-tag">{p.tag}</span>
                <img src={p.heroImage} alt={p.heroAlt} loading="lazy" width={400} height={250} />
              </div>
              <div className="post-card-body">
                <span className="post-card-date">
                  {new Date(`${p.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </span>
                <h2 className="post-card-title">{p.title}</h2>
                <p className="post-card-excerpt">{p.excerpt}</p>
                <span className="post-card-link">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
