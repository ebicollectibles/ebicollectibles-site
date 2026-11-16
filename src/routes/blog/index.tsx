import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { getBlogListState } from '~/server/blog-status'

export const Route = createFileRoute('/blog/')({
  loader: () => getBlogListState(),
  head: ({ loaderData }) => ({
    meta: [
      { title: 'News | EBI Collectibles' },
      // Indexable once at least one post is live (see /admin/blog).
      { name: 'robots', content: loaderData && Object.keys(loaderData.live).length > 0 ? 'index, follow' : 'noindex, nofollow' },
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
  const { live, isAdmin } = Route.useLoaderData()
  // Everyone sees live posts; a signed-in admin also sees drafts, labelled.
  const posts = [...BLOG_POSTS].filter((p) => isAdmin || p.slug in live).sort((a, b) => (a.date < b.date ? 1 : -1))
  const livePosts = posts.filter((p) => p.slug in live)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'EBI Collectibles News',
    url: `${BLOG_SITE_URL}/blog`,
    blogPost: livePosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      dateModified: live[p.slug]?.slice(0, 10) ?? p.date,
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
        {posts.length === 0 && <p className="lede" style={{ padding: '24px 0 48px' }}>New posts are on the way. Check back soon.</p>}
        <div className="post-grid">
          {posts.map((p) => (
            <Link key={p.slug} className="post-card" to={p.path}>
              <div className="post-card-art">
                <img src={p.heroImage} alt={p.heroAlt} loading="lazy" width={400} height={250} />
              </div>
              <div className="post-card-body">
                <span className="post-card-date">
                  {!(p.slug in live) && <span className="post-card-draft">Draft</span>}
                  <span className="post-card-kind">{p.tag}</span>
                  <span aria-hidden="true"> · </span>
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
