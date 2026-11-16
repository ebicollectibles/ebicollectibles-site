import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminSetBlogPostLive, getBlogLiveMap } from '~/server/blog-status'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'

// Turn blog posts on one at a time. A live post is indexable, listed on
// /blog and in the sitemap, and shows "Updated <date it went live>". Drafts
// stay reachable by direct link (for review) but are noindex and unlisted.
export const Route = createFileRoute('/admin/blog')({
  beforeLoad: () => requireAdmin(),
  loader: () => getBlogLiveMap(),
  component: AdminBlogPage,
})

type Filter = 'all' | 'live' | 'draft'

const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#131b28',
  padding: '10px 12px',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #e3e6ea', fontSize: 13.5, verticalAlign: 'middle' }
const btn: React.CSSProperties = {
  border: '1px solid #cfd4da',
  background: '#ffffff',
  color: '#131b28',
  borderRadius: 2,
  padding: '6px 10px',
  fontSize: 12.5,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function AdminBlogPage() {
  const router = useRouter()
  const live = Route.useLoaderData()
  const [filter, setFilter] = React.useState<Filter>('all')
  const [busy, setBusy] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
  const liveCount = posts.filter((p) => p.slug in live).length
  const shown = posts.filter((p) => (filter === 'all' ? true : filter === 'live' ? p.slug in live : !(p.slug in live)))

  const toggle = async (slug: string, makeLive: boolean, title: string) => {
    if (!makeLive && !window.confirm(`Unpublish "${title}"? It goes back to draft: hidden from /blog, Google and the sitemap.`)) return
    setBusy(slug)
    setError(null)
    try {
      await adminSetBlogPostLive({ data: { slug, live: makeLive } })
      await router.invalidate()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  const copy = async (slug: string, path: string) => {
    try {
      await navigator.clipboard.writeText(`${BLOG_SITE_URL}${path}`)
      setCopied(slug)
      setTimeout(() => setCopied((c) => (c === slug ? null : c)), 1500)
    } catch {
      /* clipboard blocked; the View link still works */
    }
  }

  const chip = (f: Filter, label: string) => (
    <button
      type="button"
      onClick={() => setFilter(f)}
      style={{
        ...btn,
        background: filter === f ? '#131b28' : '#ffffff',
        color: filter === f ? '#ffffff' : '#131b28',
        borderColor: filter === f ? '#131b28' : '#cfd4da',
      }}
    >
      {label}
    </button>
  )

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 20px 80px' }}>
      <AdminNav />
      <h1 style={{ fontSize: 28, margin: '24px 0 6px' }}>Blog</h1>
      <p style={{ color: '#5a6875', fontSize: 14, margin: '0 0 18px' }}>
        <b style={{ color: '#131b28' }}>
          {liveCount} of {posts.length}
        </b>{' '}
        posts live. Going live makes a post public: listed on /blog, in the sitemap and open to Google. After going live, paste the
        copied URL into Google Search Console's URL inspection and click Request indexing.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {chip('all', `All (${posts.length})`)}
        {chip('live', `Live (${liveCount})`)}
        {chip('draft', `Draft (${posts.length - liveCount})`)}
      </div>
      {error && <p style={{ color: '#a85b2c', fontSize: 13.5 }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 940 }}>
          <thead>
            <tr>
              <th style={th}>Banner</th>
              <th style={th}>Post</th>
              <th style={th}>Type</th>
              <th style={th}>Dated</th>
              <th style={th}>Status</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const isLive = p.slug in live
              return (
                <tr key={p.slug}>
                  <td style={{ ...td, width: 168 }}>
                    <a href={p.path} target="_blank" rel="noreferrer">
                      <img
                        src={p.heroImage}
                        alt={p.heroAlt}
                        loading="lazy"
                        width={160}
                        height={90}
                        style={{ display: 'block', width: 160, height: 90, objectFit: 'cover', borderRadius: 4, border: '1px solid #e3e6ea' }}
                      />
                    </a>
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#5a6875' }}>{p.path}</div>
                  </td>
                  <td style={td}>{p.tag}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmt(`${p.date}T12:00:00Z`)}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    {isLive ? (
                      <span style={{ color: '#3f7a63', fontWeight: 700 }}>● Live · {fmt(live[p.slug])}</span>
                    ) : (
                      <span style={{ color: '#5a6875' }}>○ Draft</span>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <a href={p.path} target="_blank" rel="noreferrer" style={{ ...btn, textDecoration: 'none' }}>
                        View
                      </a>
                      {isLive && (
                        <button type="button" style={btn} onClick={() => copy(p.slug, p.path)}>
                          {copied === p.slug ? 'Copied' : 'Copy URL'}
                        </button>
                      )}
                      {isLive ? (
                        <button type="button" style={btn} disabled={busy === p.slug} onClick={() => toggle(p.slug, false, p.title)}>
                          {busy === p.slug ? '…' : 'Unpublish'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={{ ...btn, background: '#131b28', color: '#ffffff', borderColor: '#131b28' }}
                          disabled={busy === p.slug}
                          onClick={() => toggle(p.slug, true, p.title)}
                        >
                          {busy === p.slug ? '…' : 'Go live'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
