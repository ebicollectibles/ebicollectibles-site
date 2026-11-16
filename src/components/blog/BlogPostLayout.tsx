import * as React from 'react'
import { Link, useLoaderData } from '@tanstack/react-router'
import { ShopPanel, type CtaLink } from './BlogShop'
import type { BlogShopProduct } from '~/server/blog-status'
import { BLOG_SITE_URL, type BlogPostSummary } from '~/data/blog-posts'
import { safeJsonLd } from '~/lib/gem-sets/head'

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

export function BlogPostLayout({
  post,
  lede,
  children,
  cta,
  wide = false,
  updated,
}: {
  post: BlogPostSummary
  /** Reading column for text, with the hero image and `.breakout` blocks spanning the full 1170px width. */
  wide?: boolean
  /** When the post went live (ISO); shown as "Updated" when later than its publish date. */
  updated?: string | null
  lede: string
  children: React.ReactNode
  cta: {
    heading: string
    body: string
    links: CtaLink[]
  }
}) {
  // Every post route loads getBlogPostStatus, which includes the live shop products.
  const loaded = useLoaderData({ strict: false }) as { shop?: BlogShopProduct[] } | undefined
  const shop = loaded?.shop ?? []
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BLOG_SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BLOG_SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BLOG_SITE_URL}${post.path}` },
    ],
  }
  return (
    <div className={wide ? 'ebi-blog is-wide' : 'ebi-blog'} style={{ '--glow-1': post.glow1, '--glow-2': post.glow2 } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <section className="hero">
        <div className="wrap-narrow">
          <div className="crumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/blog">Blog</Link>
          </div>
          <div className="eyebrow">
            <span className="dot" />
            {post.tag}
          </div>
          <h1>{post.title}</h1>
          <p className="lede">{lede}</p>
          <div className="meta-row">
            <span>{formatDate(post.date)}</span>
            {updated && updated.slice(0, 10) > post.date && (
              <>
                <span>·</span>
                <span>Updated {formatDate(updated.slice(0, 10))}</span>
              </>
            )}
            <span>·</span>
            <span>EBI Collectibles</span>
          </div>
        </div>
      </section>
      <article className={`${wide ? 'wrap-wide' : 'wrap-narrow'} article`}>
        <Link to="/blog" className="back-link">
          ← Back to Blog
        </Link>
        <img className="article-hero-img" src={post.heroImage} alt={post.heroAlt} width={1280} height={720} />
        <div className="prose">{children}</div>
        <ShopPanel products={shop} heading={cta.heading} body={cta.body} links={cta.links} />
      </article>
    </div>
  )
}
