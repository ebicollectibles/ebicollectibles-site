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
    // One <article> for the whole post: its header (title, intro, date,
    // author) and its body. Screen readers get a single article landmark
    // whose first heading is the h1, and reader modes / e-readers pick up
    // the title, date and byline together with the text.
    <article className={wide ? 'ebi-blog is-wide' : 'ebi-blog'} style={{ '--glow-1': post.glow1, '--glow-2': post.glow2 } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <header className="hero">
        <div className="wrap-narrow">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog" activeOptions={{ exact: true }} activeProps={{}}>Blog</Link>
          </nav>
          <div className="eyebrow">
            <span className="dot" aria-hidden="true" />
            {post.tag}
          </div>
          <h1>{post.title}</h1>
          <p className="lede">{lede}</p>
          <div className="meta-row">
            <span>
              <span className="sr-only">Published </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            {updated && updated.slice(0, 10) > post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={updated.slice(0, 10)}>{formatDate(updated.slice(0, 10))}</time>
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="byline">
              <span className="sr-only">By </span>
              <span className="author">EBI Collectibles</span>
            </span>
          </div>
        </div>
      </header>
      <div className={`${wide ? 'wrap-wide' : 'wrap-narrow'} article`}>
        <Link to="/blog" className="back-link">
          <span>
            <span aria-hidden="true">←</span> Back to Blog
          </span>
        </Link>
        <img
          className="article-hero-img"
          src={post.heroImage}
          srcSet={`${post.heroImage.replace(/\.webp$/, '-800.webp')} 800w, ${post.heroImage} 1600w`}
          sizes="(max-width: 840px) 100vw, 1170px"
          alt={post.heroAlt}
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="sync"
        />
        <div className="prose">{children}</div>
        <ShopPanel products={shop} heading={cta.heading} body={cta.body} links={cta.links} />
      </div>
    </article>
  )
}
