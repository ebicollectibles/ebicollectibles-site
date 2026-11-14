import * as React from 'react'
import { Link } from '@tanstack/react-router'
import type { BlogPostSummary } from '~/data/blog-posts'

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

export function BlogPostLayout({
  post,
  lede,
  children,
  cta,
}: {
  post: BlogPostSummary
  lede: string
  children: React.ReactNode
  cta: {
    heading: string
    body: string
    links: Array<{ to: string; params?: Record<string, string>; search?: Record<string, unknown>; label: string; variant?: 'light' | 'ghost' }>
  }
}) {
  return (
    <div className="ebi-blog" style={{ '--glow-1': post.glow1, '--glow-2': post.glow2 } as React.CSSProperties}>
      <section className="hero">
        <div className="wrap-narrow">
          <div className="crumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/blogs/news">News</Link>
          </div>
          <div className="eyebrow">
            <span className="dot" />
            {post.tag}
          </div>
          <h1>{post.title}</h1>
          <p className="lede">{lede}</p>
          <div className="meta-row">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>EBI Collectibles</span>
          </div>
        </div>
      </section>
      <article className="wrap-narrow article">
        <Link to="/blogs/news" className="back-link">
          ← Back to News
        </Link>
        <img className="article-hero-img" src={post.heroImage} alt={post.heroAlt} width={1280} height={720} />
        <div className="prose">{children}</div>
        <div className="cta-box">
          <div>
            <h3>{cta.heading}</h3>
            <p>{cta.body}</p>
          </div>
          <div className="cta-actions">
            {cta.links.map((l, i) => (
              <Link
                key={i}
                to={l.to as never}
                params={l.params as never}
                search={l.search as never}
                className={`btn ${l.variant === 'ghost' ? 'btn-ghost' : 'btn-light'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
