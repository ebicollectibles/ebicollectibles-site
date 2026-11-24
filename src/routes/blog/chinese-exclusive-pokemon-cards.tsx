import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { CHINESE_EXCLUSIVES, type ChineseExclusiveCard } from '~/data/chinese-exclusives'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { cardSearchValue } from '~/lib/gem-sets/card-search'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-exclusive-pokemon-cards')!

// ---------------------------------------------------------------------------
// Everything below is worked out from the set registry (gem-sets-index.ts)
// and the Chinese Exclusive list (chinese-exclusives.ts, checked against each
// set's own data by chinese-exclusives.test.ts). The counts are the same ones
// the "sets in order" post shows: each set's exclusiveCount.
// ---------------------------------------------------------------------------

type LineKey = 'main' | 'gem' | '151' | 'special'
function lineOf(s: GemSetSummary): LineKey {
  if (/^CBB[\d.]+C$/.test(s.code)) return 'gem'
  if (/^CSV[\d.]+C$/.test(s.code)) return 'main'
  if (/151/.test(s.series) || /^151/.test(s.code)) return '151'
  return 'special'
}
const LINE_LABEL: Record<LineKey, string> = { main: 'Main expansion', gem: 'Gem Pack', '151': 'Collect 151', special: 'Special set' }

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
const num = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

// Newest first. Sets that share a date: main expansions, then Gem Packs,
// then Collect 151, then special sets, then by set code.
const SAME_DAY: LineKey[] = ['main', 'gem', '151', 'special']
const ALL_SETS = [...GEM_SETS].sort(
  (a, b) =>
    b.releaseDate.localeCompare(a.releaseDate) ||
    SAME_DAY.indexOf(lineOf(a)) - SAME_DAY.indexOf(lineOf(b)) ||
    a.code.localeCompare(b.code, 'en', { numeric: true }) ||
    a.name.localeCompare(b.name),
)
const GROUPS = ALL_SETS.filter((s) => s.exclusiveCount > 0).map((set) => ({
  set,
  cards: CHINESE_EXCLUSIVES.filter((c) => c.set === set.slug),
}))
const SETS_WITHOUT = ALL_SETS.filter((s) => s.exclusiveCount === 0)
const TOTAL = ALL_SETS.reduce((n, s) => n + s.exclusiveCount, 0)
const MOST = Math.max(...GROUPS.map((g) => g.set.exclusiveCount))
const MOST_SETS = GROUPS.filter((g) => g.set.exclusiveCount === MOST).map((g) => g.set)

// By line, for the summary.
const LINE_TOTALS = (['main', 'gem', '151'] as const)
  .map((k) => ({ key: k, sets: GROUPS.filter((g) => lineOf(g.set) === k), cards: GROUPS.filter((g) => lineOf(g.set) === k).reduce((n, g) => n + g.cards.length, 0) }))
  .filter((l) => l.cards > 0)

// By rarity, most common first. Rarity names are as each set's data gives them.
const shortRarity = (r: string) => r.replace(/\s*\([A-Z]+\)$/, '')
const RARITY_COUNTS = Object.entries(
  CHINESE_EXCLUSIVES.reduce<Record<string, number>>((m, c) => ((m[shortRarity(c.rarity)] = (m[shortRarity(c.rarity)] ?? 0) + 1), m), {}),
).sort((a, b) => b[1] - a[1])

// The three Collect 151 Special Art Rares carry the label because they belong
// to one release each, but their art was first printed in Japan and is also
// in English (see the Collect 151 card origins post). Every other Chinese
// Exclusive is marked as having no English version in its set's card
// origins post.
const ENGLISH_PRINTED = new Set(['collect-151-surprise 189/151', 'collect-151-gathering 190/151', 'collect-151-surprise 191/151'])
const NO_ENGLISH = CHINESE_EXCLUSIVES.filter((c) => !ENGLISH_PRINTED.has(`${c.set} ${c.number}`)).length

// Each set's card origins post, typed for the router. The four Collect 151
// releases share one.
const ORIGINS_POST: Record<string, `/blog/${string}`> = Object.fromEntries(
  GEM_SETS.map((s) => {
    const key = s.slug.startsWith('collect-151-') ? 'collect-151' : s.slug.replace(/-csv[0-9-]+$/, '')
    return [s.slug, `/blog/${key}-card-origins`]
  }),
)
const originsPost = (slug: string) => BLOG_POSTS.find((p) => p.path === ORIGINS_POST[slug])

const cardId = (c: ChineseExclusiveCard) => c.number.split('/')[0]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'How many Chinese Exclusive Pokémon cards are there?',
    a: `${num(TOTAL)} across the ${plural(ALL_SETS.length, 'Simplified Chinese set')} we have card lists for, spread over ${plural(GROUPS.length, 'set')}. ${
      SETS_WITHOUT.length > 0 ? `${plural(SETS_WITHOUT.length, 'set')} on our lists ${SETS_WITHOUT.length === 1 ? 'has' : 'have'} none: ${joinList(SETS_WITHOUT.map((s) => s.name))}.` : ''
    }`.trim(),
  },
  {
    q: 'What does Chinese Exclusive mean?',
    a: 'It is the label our set lists give a card whose illustration is only printed in the Simplified Chinese release. In Collect 151, which came out in four releases, the label marks the cards that belong to one release.',
  },
  {
    q: 'Which set has the most Chinese Exclusives?',
    a: `${joinList(MOST_SETS.map((s) => `${s.name} (${s.code})`))}, with ${num(MOST)}.`,
  },
  {
    q: 'Are Chinese Exclusive cards printed in English?',
    a: `${num(NO_ENGLISH)} of the ${num(TOTAL)} have no English version, according to our card origins posts. The other ${num(TOTAL - NO_ENGLISH)} are the Collect 151 Special Art Rares (Alakazam ex, Zapdos ex and Mew ex), whose art was first printed in Japan and is also in English.`,
  },
  {
    q: 'Does every Simplified Chinese set have a Chinese Exclusive?',
    a: SETS_WITHOUT.length
      ? `No. ${joinList(SETS_WITHOUT.map((s) => s.name))} ${SETS_WITHOUT.length === 1 ? 'has' : 'have'} none on our card lists.`
      : 'Every set on our card lists has at least one.',
  },
  {
    q: 'How do I find a Chinese Exclusive on a card list?',
    a: 'Every card on this page links to its own entry on its set list. Each set list also marks its Chinese Exclusives.',
  },
]

export const Route = createFileRoute('/blog/chinese-exclusive-pokemon-cards')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: blogShareImage(post) },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: blogShareImage(post) },
      { name: 'twitter:image:alt', content: post.heroAlt },
      { property: 'article:published_time', content: post.date },
      ...(loaderData?.liveAt ? [{ property: 'article:modified_time', content: loaderData.liveAt.slice(0, 10) }] : []),
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: ChineseExclusivesPost,
})

function ExclusiveCard({ set, c }: { set: GemSetSummary; c: ChineseExclusiveCard }) {
  return (
    <li>
      <figure>
        <Link to={set.path} search={{ card: cardSearchValue(cardId(c)) }}>
          <img src={c.image} alt={`${c.name} ${c.number}, a Chinese Exclusive ${shortRarity(c.rarity)} from ${set.name}`} loading="lazy" decoding="async" width={300} height={419} />
        </Link>
        <figcaption>
          <ChineseExclusiveBadge />
          <strong>
            <Link to={set.path} search={{ card: cardSearchValue(cardId(c)) }}>
              {c.name}
            </Link>
          </strong>
          {c.number} · {c.rarity}
        </figcaption>
      </figure>
    </li>
  )
}

function ChineseExclusivesPost() {
  const status = Route.useLoaderData()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: status.liveAt?.slice(0, 10) ?? post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EBI Collectibles',
      url: BLOG_SITE_URL,
      logo: { '@type': 'ImageObject', url: `${BLOG_SITE_URL}/assets/ebi-logo.jpg`, width: 240, height: 240 },
    },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Chinese Exclusive Pokémon cards, by set',
    numberOfItems: TOTAL,
    itemListElement: GROUPS.flatMap((g) => g.cards.map((c) => ({ set: g.set, c }))).map(({ set, c }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${c.name} ${c.number} (${set.name})`,
      url: `${BLOG_SITE_URL}${set.path}?card=${encodeURIComponent(cardId(c))}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`There are ${num(TOTAL)} Chinese Exclusive cards across the ${plural(ALL_SETS.length, 'Simplified Chinese Pokémon set')} we have card lists for. Here is every one, set by set and newest first, with its card number, rarity and a link to the card on its set list.`}
        cta={{
          heading: 'Explore the Chinese sets',
          body: `Every set list marks its Chinese Exclusives. Browse all ${num(ALL_SETS.length)} card lists.`,
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/blog/chinese-pokemon-sets-in-order', label: 'Every set in order', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-means">What &ldquo;Chinese Exclusive&rdquo; means</h2>
        <p>
          A Chinese Exclusive is a card whose illustration is only printed in the Simplified Chinese release. Our set lists flag each
          one, and this page collects them all in one place.
        </p>
        <p>
          Collect 151 is the one set where the label works a little differently. It came out in four releases, Journey, Hope, Surprise
          and Gathering, and the label marks the cards that belong to one release. Its four Pikachu Art Rares are new art. Its three
          Special Art Rares use art first printed in Japan, which the{' '}
          <Link to="/blog/collect-151-card-origins">Collect 151 card origins post</Link> covers.
        </p>

        <dl className="tl-summary breakout" aria-label="Chinese Exclusives at a glance">
          <div>
            <dt>Chinese Exclusives</dt>
            <dd>{num(TOTAL)}</dd>
          </div>
          <div>
            <dt>Sets with one or more</dt>
            <dd>{num(GROUPS.length)}</dd>
          </div>
          <div>
            <dt>Sets checked</dt>
            <dd>{num(ALL_SETS.length)}</dd>
          </div>
          <div>
            <dt>No English version</dt>
            <dd>{num(NO_ENGLISH)}</dd>
          </div>
          <div>
            <dt>Most in one set</dt>
            <dd>{num(MOST)}</dd>
          </div>
        </dl>

        <ul>
          {LINE_TOTALS.map((l) => (
            <li key={l.key}>
              <strong>{l.key === 'main' ? 'Main expansions' : l.key === 'gem' ? 'Gem Packs' : 'Collect 151'}:</strong>{' '}
              {plural(l.cards, 'card')} across {plural(l.sets.length, l.key === '151' ? 'release' : 'set')}.
            </li>
          ))}
          <li>
            <strong>By rarity:</strong> {joinList(RARITY_COUNTS.map(([r, n]) => `${num(n)} ${r}`))}.
          </li>
          {SETS_WITHOUT.length > 0 && (
            <li>
              <strong>No Chinese Exclusive:</strong> {joinList(SETS_WITHOUT.map((s) => `${s.name} (${s.code})`))}.
            </li>
          )}
        </ul>
        <p>
          In the Gem Packs, the Chinese Exclusives are three-star full arts. How often those turn up is covered in{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates</Link>.
        </p>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
          <ol>
            {GROUPS.map((g) => (
              <li key={g.set.slug}>
                <a href={`#${g.set.slug}`}>
                  {g.set.name} ({g.cards.length})
                </a>
              </li>
            ))}
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ol>
        </nav>

        {GROUPS.map((g) => {
          const origins = originsPost(g.set.slug)
          return (
            <React.Fragment key={g.set.slug}>
              <h2 id={g.set.slug}>
                {g.set.name} ({g.set.code})
              </h2>
              <p>
                {LINE_LABEL[lineOf(g.set)]}, released {formatDate(g.set.releaseDate)}. {plural(g.cards.length, 'Chinese Exclusive')}{' '}
                in {num(g.set.cardCount)} cards. <Link to={g.set.path}>Full card list</Link>
                {origins && (
                  <>
                    {' '}
                    · <Link to={origins.path}>Card origins</Link>
                  </>
                )}
              </p>
              <ul className="card-grid cols-4">
                {g.cards.map((c) => (
                  <ExclusiveCard key={c.number} set={g.set} c={c} />
                ))}
              </ul>
            </React.Fragment>
          )
        })}

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
