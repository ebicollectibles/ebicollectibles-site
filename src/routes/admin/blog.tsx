import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin } from '~/server/admin-auth'
import { adminSetBlogPostLive, getBlogLiveMap } from '~/server/blog-status'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'

// Turn blog posts on one at a time. A live post is indexable, listed on
// /blog and in the sitemap, and shows "Updated <date it went live>". Drafts
// stay reachable by direct link (for review) but are noindex and unlisted.
// Filters live in the URL (?status=draft&type=guide) so they survive a
// reload, going live, or coming back to the page later.
const KINDS = [
  { key: 'release', label: 'Release news', suffix: '-release-news' },
  { key: 'guide', label: 'Set guide', suffix: '-set-guide' },
  { key: 'origins', label: 'Card origins', suffix: '-card-origins' },
] as const
type Kind = (typeof KINDS)[number]['key']

export const Route = createFileRoute('/admin/blog')({
  validateSearch: (search: Record<string, unknown>): { status?: 'live' | 'draft'; type?: Kind } => ({
    status: search.status === 'live' || search.status === 'draft' ? search.status : undefined,
    type: KINDS.some((k) => k.key === search.type) ? (search.type as Kind) : undefined,
  }),
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
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const filter: Filter = search.status ?? 'all'
  const kind = search.type
  const setFilter = (f: Filter) => navigate({ search: (prev) => ({ ...prev, status: f === 'all' ? undefined : f }), replace: true })
  const setKind = (k: Kind | undefined) => navigate({ search: (prev) => ({ ...prev, type: k }), replace: true })
  const [busy, setBusy] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
  const kindOf = (slug: string): Kind | undefined => KINDS.find((k) => slug.endsWith(k.suffix))?.key
  const ofKind = posts.filter((p) => !kind || kindOf(p.slug) === kind)
  const liveCount = posts.filter((p) => p.slug in live).length
  const kindLive = ofKind.filter((p) => p.slug in live).length
  const shown = ofKind.filter((p) => (filter === 'all' ? true : filter === 'live' ? p.slug in live : !(p.slug in live)))

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
        {chip('all', `All (${ofKind.length})`)}
        {chip('live', `Live (${kindLive})`)}
        {chip('draft', `Draft (${ofKind.length - kindLive})`)}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {[{ key: undefined, label: 'All types' }, ...KINDS].map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => setKind(k.key)}
            style={{
              ...btn,
              fontSize: 12,
              padding: '5px 9px',
              background: kind === k.key ? '#24314a' : '#f5f6f8',
              color: kind === k.key ? '#ffffff' : '#24314a',
              borderColor: kind === k.key ? '#24314a' : '#e3e6ea',
            }}
          >
            {k.label}
            {k.key ? ` (${posts.filter((p) => kindOf(p.slug) === k.key && !(p.slug in live)).length} draft)` : ''}
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <p style={{ color: '#5a6875', fontSize: 14, margin: '6px 0 18px' }}>
          {filter === 'draft' ? 'Nothing left in draft here. Everything is live.' : 'No posts match these filters.'}
        </p>
      )}
      {error && <p style={{ color: '#a85b2c', fontSize: 13.5 }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
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
                  <td style={{ ...td, width: 328 }}>
                    <a href={p.path} target="_blank" rel="noreferrer">
                      <img
                        src={p.heroImage}
                        alt={p.heroAlt}
                        loading="lazy"
                        width={320}
                        height={180}
                        style={{ display: 'block', width: 320, height: 180, objectFit: 'cover', borderRadius: 4, border: '1px solid #e3e6ea' }}
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
