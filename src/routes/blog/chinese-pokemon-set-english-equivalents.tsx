import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { MAIN_SET_EQUIVALENTS, type SetEquivalent } from '~/data/chinese-set-equivalents'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-pokemon-set-english-equivalents')!

// ---------------------------------------------------------------------------
// The main-expansion numbers come from chinese-set-equivalents.ts, which a
// test recounts from each set's card origins post. The Gem Pack, Collect 151
// and 30th Celebration rows repeat what those sets' card origins posts say,
// in their words; the post is linked from each row.
// ---------------------------------------------------------------------------

type LineKey = 'main' | 'gem' | '151' | 'special'
function lineOf(s: GemSetSummary): LineKey {
  if (/^CBB[\d.]+C$/.test(s.code)) return 'gem'
  if (/^CSV[\d.]+C$/.test(s.code)) return 'main'
  if (/151/.test(s.series) || /^151/.test(s.code)) return '151'
  return 'special'
}
const setKey = (s: GemSetSummary) => (lineOf(s) === '151' ? 'collect-151' : s.slug.replace(/-csv[0-9-]+$/, ''))
const num = (n: number) => n.toLocaleString('en-US')
const pct = (n: number, of: number) => Math.round((n / of) * 100)
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// An English set counts as a main source when it supplies at least a tenth
// of the Chinese set's cards.
const MAIN_SHARE = 0.1
const mainSources = (e: SetEquivalent) => e.english.filter((x) => x.cards >= e.total * MAIN_SHARE)
const EQUIV = new Map(MAIN_SET_EQUIVALENTS.map((e) => [e.key, e]))

// One row per set, newest first. The four Collect 151 releases share one card
// list and one row, dated from the first release.
const ROW_SETS = [...GEM_SETS]
  .filter((s) => lineOf(s) !== '151' || s.slug === 'collect-151-journey')
  .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.code.localeCompare(b.code, 'en', { numeric: true }))

const C151_RELEASES = GEM_SETS.filter((s) => lineOf(s) === '151').sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))

// What each Gem Pack's card origins post says about where its art comes from.
const GEM_ORIGIN: Record<string, string> = {
  'gem-vol-1': 'Mostly English Scarlet & Violet cards, nearly half of them from Paldea Evolved',
  'gem-vol-2': 'Mostly Sword & Shield sets and promos; eight of the nine VMAX use Evolving Skies art',
  'gem-vol-3': 'Mostly 2023 Scarlet & Violet sets, led by Obsidian Flames and Scarlet & Violet',
  'gem-vol-4': 'Led by Temporal Forces',
  'gem-vol-5': 'Led by Surging Sparks',
  'gem-vol-6': 'Led by Surging Sparks',
  'gem-vol-7': 'Led by Destined Rivals, with Journey Together and four Black Star Promos',
}

const MAIN_ROWS = ROW_SETS.filter((s) => lineOf(s) === 'main')
const ONE_TO_ONE = MAIN_ROWS.filter((s) => {
  const e = EQUIV.get(setKey(s))
  return e && e.english[0].set === s.name
})
const MIXED = MAIN_ROWS.filter((s) => !ONE_TO_ONE.includes(s))
const GEM_ROWS = ROW_SETS.filter((s) => lineOf(s) === 'gem')

const originsPost = (s: GemSetSummary) => BLOG_POSTS.find((p) => p.slug === `${setKey(s)}-card-origins`)

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Do Simplified Chinese Pokémon sets have English equivalents?',
    a: `Not one to one, for most of them. ${joinList(ONE_TO_ONE.map((s) => s.name))} mostly match the English sets with the same names. The other ${num(MIXED.length)} main expansions draw on several English sets each. Gem Packs have no single English set: they reprint art from several.`,
  },
  ...MAIN_ROWS.map((s) => {
    const e = EQUIV.get(setKey(s))!
    const main = mainSources(e)
    return {
      q: `What is ${s.name} (${s.code}) in English?`,
      a: `${main.length === 1 ? 'Mostly' : 'There is no single one. Mostly'} ${joinList(main.map((x) => `${x.set} (${num(x.cards)} cards)`))}, out of ${num(e.total)}.${
        e.noEnglish > 0 ? ` ${num(e.noEnglish)} ${e.noEnglish === 1 ? 'card has' : 'cards have'} no English version.` : ''
      }`,
    }
  }),
  {
    q: 'What is Collect 151 in English and Japanese?',
    a: 'Its cards match English 151 (166 cards) and Paldean Fates (22 cards), and Japanese Pokémon Card 151 (SV2a) and Shiny Treasure ex (SV4a). The other 4 cards are new Pikachu Art Rares. The main set has the same numbers as English 151, 001 to 151.',
  },
  {
    q: 'What is the Chinese 30th Celebration in Japanese and English?',
    a: 'It matches the Japanese 30th CELEBRATION (M6a) number for number. Every card is also in English, split across the English 30th Celebration set, the 30th Classic Collection and MEP Black Star Promos.',
  },
]

export const Route = createFileRoute('/blog/chinese-pokemon-set-english-equivalents')({
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
  component: EnglishEquivalentsPost,
})

function EnglishCell({ s }: { s: GemSetSummary }) {
  const line = lineOf(s)
  if (line === 'main') {
    const e = EQUIV.get(setKey(s))
    if (!e) return null
    return (
      <>
        {mainSources(e).map((x, i) => (
          <React.Fragment key={x.set}>
            {i > 0 && <br />}
            <strong>{x.set}</strong> ({pct(x.cards, e.total)}%)
          </React.Fragment>
        ))}
      </>
    )
  }
  if (line === 'gem')
    return (
      <>
        <strong>No single English set.</strong> {GEM_ORIGIN[s.slug] ?? ''}
      </>
    )
  if (line === '151')
    return (
      <>
        <strong>151</strong> and <strong>Paldean Fates</strong>
      </>
    )
  if (s.slug === '30th-celebration')
    return (
      <>
        <strong>30th Celebration</strong>, <strong>30th Classic Collection</strong> and MEP Black Star Promos
      </>
    )
  return null
}

function JapaneseCell({ s }: { s: GemSetSummary }) {
  if (lineOf(s) === '151') return <>Pokémon Card 151 (SV2a) and Shiny Treasure ex (SV4a)</>
  if (s.slug === '30th-celebration')
    return (
      <>
        <Link to="/sets/japanese/30th-celebration-m6a">30th CELEBRATION (M6a)</Link>, number for number
      </>
    )
  return <span className="cell-none">Not covered</span>
}

function EnglishEquivalentsPost() {
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`Most Simplified Chinese Pokémon sets have no single English equivalent. Only ${joinList(ONE_TO_ONE.map((s) => s.name))} share a name with the English set most of their cards come from. The other main expansions draw on several English sets, and Gem Packs reprint art from many. This table shows where each set's cards come from.`}
        cta={{
          heading: 'Explore the Chinese sets',
          body: 'Every card list, with the English card each one matches in its card origins post.',
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/blog/chinese-pokemon-sets-in-order', label: 'Every set in order', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Main expansions draw on several English sets.</strong> {num(MIXED.length)} of the {num(MAIN_ROWS.length)} CSV sets
            have no English set of the same name. Their cards come from one to four main English sets, plus a few promos.
          </li>
          {ONE_TO_ONE.length > 0 && (
            <li>
              <strong>{joinList(ONE_TO_ONE.map((s) => s.name))}</strong> mostly match the English sets of the same name.
            </li>
          )}
          <li>
            <strong>Collect 151</strong> matches English 151 and Paldean Fates, and <strong>30th Celebration</strong> matches the
            Japanese 30th CELEBRATION card for card.
          </li>
          <li>
            <strong>Gem Packs</strong> are their own line, with no single English set. Their art is reprinted from several English sets.
          </li>
          <li>
            <strong>Chinese Exclusives</strong> mostly have no English version. They are listed in{' '}
            <Link to="/blog/chinese-exclusive-pokemon-cards">Every Chinese Exclusive Pokémon card</Link>.
          </li>
        </ul>

        <h2 id="table">Every set and its English equivalent</h2>
        <p>
          Percentages are the share of the Chinese set&rsquo;s cards that use the same art as a card in that English set. Each card is
          counted under the English set its card origins post matches it to. English sets with less than a tenth of the cards are in
          the <a href="#counts">full counts</a> below.
        </p>
        <div className="table-scroll breakout" role="group" aria-labelledby="tbl-eq" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-eq" className="sr-only">
              Simplified Chinese Pokémon TCG sets and the English and Japanese sets their cards come from
            </caption>
            <thead>
              <tr>
                <th scope="col">Chinese set</th>
                <th scope="col">Code</th>
                <th scope="col">Released</th>
                <th scope="col">English set(s)</th>
                <th scope="col">Japanese set</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {ROW_SETS.map((s) => {
                const origins = originsPost(s)
                const is151 = lineOf(s) === '151'
                return (
                  <tr key={s.slug}>
                    <th scope="row">
                      <Link to={s.path}>{is151 ? 'Collect 151' : s.name}</Link>
                      {lineOf(s) === 'gem' && <> (Gem Pack)</>}
                    </th>
                    <td>{s.code}</td>
                    <td>{is151 ? `${formatDate(C151_RELEASES[0].releaseDate)} to ${formatDate(C151_RELEASES[C151_RELEASES.length - 1].releaseDate)}` : formatDate(s.releaseDate)}</td>
                    <td>
                      <EnglishCell s={s} />
                    </td>
                    <td>
                      <JapaneseCell s={s} />
                    </td>
                    <td>{origins && <Link to={origins.path}>Card origins</Link>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          &ldquo;Not covered&rdquo; means our card origins post for that set compares it with English cards only. Collect 151 came out in
          four releases ({joinList(C151_RELEASES.map((s) => s.name.replace(/^Collect 151:\s*/, '')))}) that share one card list.
        </p>

        <h2 id="counts">Full counts for the main expansions</h2>
        <p>Every English source for each main expansion, by number of cards, from its card origins post.</p>
        <ul>
          {MAIN_ROWS.map((s) => {
            const e = EQUIV.get(setKey(s))!
            const origins = originsPost(s)
            return (
              <li key={s.slug}>
                <strong>
                  {s.name} ({s.code}), {num(e.total)} cards:
                </strong>{' '}
                {joinList(e.english.map((x) => `${x.set} ${num(x.cards)}`))}
                {e.noEnglish > 0 && `, and ${num(e.noEnglish)} with no English version`}.
                {origins && (
                  <>
                    {' '}
                    <Link to={origins.path}>Card by card</Link>
                  </>
                )}
              </li>
            )
          })}
        </ul>

        <h2 id="gem-packs">Gem Packs</h2>
        <p>
          A Gem Pack is a Simplified Chinese line of 4-card all-holo packs, and no English set lines up with one. Each volume reprints
          art from several English sets on new holo cards, and adds a few new illustrations, the Chinese Exclusives among them. What a
          Gem Pack is, and every volume so far, is covered in <Link to="/blog/what-is-a-gem-pack">What is a Gem Pack?</Link>
        </p>
        <ul>
          {GEM_ROWS.map((s) => {
            const origins = originsPost(s)
            return (
              <li key={s.slug}>
                <strong>
                  {s.name} ({s.code}):
                </strong>{' '}
                {GEM_ORIGIN[s.slug]}.{' '}
                {origins && <Link to={origins.path}>Card origins</Link>}
              </li>
            )
          })}
        </ul>

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
