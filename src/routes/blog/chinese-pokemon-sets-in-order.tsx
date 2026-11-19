import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { thumbSrcSet } from '~/components/ResponsiveImage'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-pokemon-sets-in-order')!

// ---------------------------------------------------------------------------
// Everything below is worked out from the set registry (gem-sets-index.ts).
// Nothing is listed by hand: a set added there shows up here, in date order,
// and every count on the page (sets, cards, Chinese Exclusives, the FAQ
// answers) updates with it.
// ---------------------------------------------------------------------------

type LineKey = 'main' | 'gem' | '151' | 'special'

const LINES: Record<LineKey, { label: string; one: string }> = {
  main: { label: 'Main expansion', one: 'main expansion' },
  gem: { label: 'Gem Pack', one: 'Gem Pack' },
  '151': { label: 'Collect 151', one: 'Collect 151 release' },
  special: { label: 'Special set', one: 'special set' },
}
const LINE_ORDER: LineKey[] = ['main', 'gem', '151', 'special']

function lineOf(s: GemSetSummary): LineKey {
  if (/^CBB[\d.]+C$/.test(s.code)) return 'gem'
  if (/^CSV[\d.]+C$/.test(s.code)) return 'main'
  if (/151/.test(s.series) || /^151/.test(s.code)) return '151'
  return 'special'
}

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

const nameWithCode = (s: GemSetSummary) => `${s.name} (${s.code})`

// Oldest first. Sets that share a date keep a steady order: Gem Packs lead,
// then main expansions, then Collect 151, then special sets, then by set code.
const SAME_DAY_ORDER: LineKey[] = ['gem', 'main', '151', 'special']
const SETS = [...GEM_SETS].sort(
  (a, b) =>
    a.releaseDate.localeCompare(b.releaseDate) ||
    SAME_DAY_ORDER.indexOf(lineOf(a)) - SAME_DAY_ORDER.indexOf(lineOf(b)) ||
    a.code.localeCompare(b.code, 'en', { numeric: true }) ||
    a.name.localeCompare(b.name),
)

interface Stop {
  date: string
  sets: GemSetSummary[]
}
interface YearGroup {
  year: string
  stops: Stop[]
  count: number
}

const YEARS: YearGroup[] = []
for (const s of SETS) {
  const year = s.releaseDate.slice(0, 4)
  let group = YEARS[YEARS.length - 1]
  if (!group || group.year !== year) {
    group = { year, stops: [], count: 0 }
    YEARS.push(group)
  }
  let stop = group.stops[group.stops.length - 1]
  if (!stop || stop.date !== s.releaseDate) {
    stop = { date: s.releaseDate, sets: [] }
    group.stops.push(stop)
  }
  stop.sets.push(s)
  group.count += 1
}

const ALL_STOPS = YEARS.flatMap((y) => y.stops)
const FIRST_STOP = ALL_STOPS[0]
const LAST_STOP = ALL_STOPS[ALL_STOPS.length - 1]
const TOTAL_CARDS = SETS.reduce((n, s) => n + s.cardCount, 0)
const TOTAL_EXCLUSIVES = SETS.reduce((n, s) => n + s.exclusiveCount, 0)
const SETS_WITH_EXCLUSIVES = SETS.filter((s) => s.exclusiveCount > 0).length
const BY_LINE = LINE_ORDER.map((key) => ({ key, ...LINES[key], sets: SETS.filter((s) => lineOf(s) === key) })).filter((l) => l.sets.length > 0)
const lineSets = (key: LineKey) => BY_LINE.find((l) => l.key === key)?.sets ?? []
const LINE_BREAKDOWN = joinList(BY_LINE.map((l) => plural(l.sets.length, l.one)))

// Set code examples, read from the registry's own codes.
const codeNumber = (s: GemSetSummary) => s.code.replace(/^[A-Z]+/, '').replace(/C$/, '')
const MAIN_SETS = lineSets('main')
const GEM_PACKS = lineSets('gem')
const C151_SETS = lineSets('151')
const SPECIAL_SETS = lineSets('special')
const MAIN_WHOLE = MAIN_SETS.find((s) => !codeNumber(s).includes('.'))
const MAIN_DECIMAL = MAIN_SETS.filter((s) => codeNumber(s).includes('.'))
const C151_CODES = [...new Set(C151_SETS.map((s) => s.code))]

const stopNames = (stop: Stop) => joinList(stop.sets.map(nameWithCode))

const FAQ: { q: string; a: string; link?: { to: '/sets/chinese'; before: string; label: string; after: string } }[] = [
  {
    q: 'What was the first Simplified Chinese Pokémon TCG set of the Scarlet & Violet era?',
    a: `The Scarlet & Violet era releases start on ${formatDate(FIRST_STOP.date)}. ${
      FIRST_STOP.sets.length === 1 ? `The set released that day was ${stopNames(FIRST_STOP)}.` : `${plural(FIRST_STOP.sets.length, 'set')} came out that day: ${stopNames(FIRST_STOP)}.`
    } Earlier Simplified Chinese sets from the Sword & Shield era exist, and they are not on this timeline.`,
  },
  {
    q: 'How many Simplified Chinese Pokémon sets are on this timeline?',
    a: `${plural(SETS.length, 'set')}, released from ${formatDate(FIRST_STOP.date)} to ${formatDate(LAST_STOP.date)}: ${LINE_BREAKDOWN}. Together they hold ${num(TOTAL_CARDS)} cards. The count goes up each time we add a card list.`,
  },
  {
    q: 'What is the newest Simplified Chinese Pokémon set?',
    a: `The newest on this timeline ${LAST_STOP.sets.length === 1 ? 'is' : 'are'} ${stopNames(LAST_STOP)}, released on ${formatDate(LAST_STOP.date)}.`,
  },
  ...(GEM_PACKS.length > 0
    ? [
        {
          q: 'What is a Gem Pack?',
          a: `A Gem Pack is a small collector pack where every card is a holo. The Gem Pack line runs alongside the main expansions, and its set codes start with CBB. ${
            GEM_PACKS.length === 1
              ? `One volume is on this timeline: ${nameWithCode(GEM_PACKS[0])}.`
              : `${plural(GEM_PACKS.length, 'volume')} are on this timeline, from ${nameWithCode(GEM_PACKS[0])} to ${nameWithCode(GEM_PACKS[GEM_PACKS.length - 1])}.`
          }`,
        },
      ]
    : []),
  {
    q: 'What does "Chinese Exclusive" mean on this site?',
    a: `A Chinese Exclusive is a card whose illustration is only printed in the Simplified Chinese release. Each set list flags them. Across the ${plural(SETS.length, 'set')} here, ${plural(TOTAL_EXCLUSIVES, 'card')} carry the flag, spread over ${plural(SETS_WITH_EXCLUSIVES, 'set')}.`,
  },
  {
    q: 'Are Sword & Shield era Simplified Chinese sets included?',
    a: `No. This timeline covers the sets we have a full card list for, and those start with the Scarlet & Violet era releases of ${formatDate(FIRST_STOP.date)}.`,
  },
  {
    q: 'Where can I find the card list for each set?',
    a: 'Every entry on the timeline links to its full card list, where you can tick off the cards you own.',
    link: { to: '/sets/chinese', before: 'All of them are also on the ', label: 'Chinese sets page', after: '.' },
  },
]

export const Route = createFileRoute('/blog/chinese-pokemon-sets-in-order')({
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
  component: ChineseSetsTimelinePost,
})

function SetCard({ set, side }: { set: GemSetSummary; side: 'left' | 'right' }) {
  const srcSet = thumbSrcSet(set.heroImage)
  return (
    <li className={`tl-card is-${side}`} style={{ '--g1': set.glow1, '--g2': set.glow2 } as React.CSSProperties}>
      <img
        className="tl-card-img"
        src={set.heroImage}
        srcSet={srcSet}
        sizes={srcSet ? '120px' : undefined}
        alt={`${set.heroAlt}, ${set.name}`}
        loading="lazy"
        decoding="async"
        width={300}
        height={419}
      />
      <div className="tl-card-body">
        <p className="tl-card-kind">
          <span>{LINES[lineOf(set)].label}</span>
          <span className="tl-code">{set.code}</span>
          {set.preorder && <span className="tl-soon">Pre-order</span>}
        </p>
        <h3 id={`set-${set.slug}`}>{set.name}</h3>
        <p className="tl-card-facts">
          <span>{plural(set.cardCount, 'card')}</span>
          {set.exclusiveCount > 0 && <span className="tl-ce">{plural(set.exclusiveCount, 'Chinese Exclusive')}</span>}
        </p>
        <p className="tl-card-tagline">{set.tagline}</p>
        <Link to={set.path} className="tl-card-link">
          See the full card list
          <span className="tl-sr"> for {set.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </li>
  )
}

function ChineseSetsTimelinePost() {
  const status = Route.useLoaderData()
  const timelineRef = React.useRef<HTMLDivElement>(null)

  // Scroll-in animation. The server HTML shows every card. Once this runs it
  // adds the hidden start state by class (.tl-reveal, see blog.css) and
  // reveals each card as it enters the viewport, so with no JavaScript, or
  // with reduced motion, every card is simply visible.
  React.useEffect(() => {
    const root = timelineRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.tl-card, .tl-date'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    // Cards already on screen (or above it) never start hidden.
    for (const c of cards) {
      if (c.getBoundingClientRect().top < window.innerHeight) c.classList.add('is-in')
      else io.observe(c)
    }
    root.classList.add('tl-reveal')
    return () => {
      io.disconnect()
      root.classList.remove('tl-reveal')
    }
  }, [])

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
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.link ? `${f.a} ${f.link.before}${f.link.label}${f.link.after}` : f.a },
    })),
  }
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Simplified Chinese Pokémon TCG sets in release order',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: SETS.length,
    itemListElement: SETS.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nameWithCode(s),
      url: `${BLOG_SITE_URL}${s.path}`,
    })),
  }

  // Single-set dates alternate sides down the spine; a date with several
  // sets fills both sides, starting from whichever side is next.
  let nextSide = 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`A release timeline of the Simplified Chinese Pokémon TCG, oldest first: ${plural(SETS.length, 'set')} from ${formatDate(FIRST_STOP.date)} to ${formatDate(LAST_STOP.date)}, each with its set code, card count and full card list.`}
        cta={{
          heading: 'Explore the Chinese sets',
          body: `Browse all ${num(SETS.length)} card lists and tick off what you have, or see what is in the shop.`,
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <p>
          This is every Simplified Chinese Pokémon TCG set we have a card list for, in release order. It starts with the Scarlet &amp;
          Violet era releases of {formatDate(FIRST_STOP.date)} and runs to {formatDate(LAST_STOP.date)}. Earlier Simplified Chinese
          sets from the Sword &amp; Shield era exist, and they are not listed here.
        </p>
        <p>
          The sets come in {BY_LINE.length === 1 ? 'one line' : `${num(BY_LINE.length)} lines`} that release side by side, so the
          dates overlap. Sets that came out on the same day share one date marker.
        </p>

        <ul className="tl-lines" aria-label="The lines on this timeline">
          {BY_LINE.map((l) => (
            <li key={l.key}>
              <strong>
                {l.label} <span className="tl-lines-n">{num(l.sets.length)}</span>
              </strong>
              {l.key === 'main' && 'The numbered Scarlet & Violet sets, with codes that start with CSV.'}
              {l.key === 'gem' && 'Small all-holo collector packs, numbered by volume, with codes that start with CBB.'}
              {l.key === '151' && `The Collect 151 set, which came out in parts. ${plural(l.sets.length, 'release')} ${l.sets.length === 1 ? 'is' : 'are'} on this timeline.`}
              {l.key === 'special' && `One-off releases outside the numbered lines: ${joinList(l.sets.map((s) => s.name))}.`}
            </li>
          ))}
        </ul>

        <dl className="tl-summary breakout" aria-label="Timeline at a glance">
          <div>
            <dt>Sets</dt>
            <dd>{num(SETS.length)}</dd>
          </div>
          <div>
            <dt>Cards</dt>
            <dd>{num(TOTAL_CARDS)}</dd>
          </div>
          <div>
            <dt>Chinese Exclusives</dt>
            <dd>{num(TOTAL_EXCLUSIVES)}</dd>
          </div>
          <div>
            <dt>First release</dt>
            <dd className="is-date">
              <time dateTime={FIRST_STOP.date}>{formatDate(FIRST_STOP.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Latest release</dt>
            <dd className="is-date">
              <time dateTime={LAST_STOP.date}>{formatDate(LAST_STOP.date)}</time>
            </dd>
          </div>
        </dl>

        <nav className="tl-jump" aria-label="Jump to year">
          <p className="toc-title">Jump to</p>
          <ul>
            {YEARS.map((y) => (
              <li key={y.year}>
                <a href={`#sets-${y.year}`}>
                  {y.year}
                  <span>{plural(y.count, 'set')}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#set-codes">Set codes</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </nav>

        <div className="tl breakout" ref={timelineRef}>
          {YEARS.map((y) => (
            <section key={y.year} className="tl-year" aria-labelledby={`sets-${y.year}`}>
              <h2 id={`sets-${y.year}`} className="tl-year-head">
                <span className="tl-year-pill">
                  <span className="tl-year-num">{y.year}</span>
                  <span className="tl-year-sub">
                    <span className="tl-sr">: </span>
                    {plural(y.count, 'set')}
                  </span>
                </span>
              </h2>
              <ol className="tl-stops">
                {y.stops.map((stop) => {
                  const start = nextSide
                  nextSide = (nextSide + stop.sets.length) % 2
                  return (
                    <li key={stop.date} className={`tl-stop${stop.sets.length > 1 ? ' is-multi' : ''}`}>
                      <p className="tl-date">
                        <span className="tl-dot" aria-hidden="true" />
                        <time dateTime={stop.date}>{formatDate(stop.date)}</time>
                        {stop.sets.length > 1 && <span className="tl-date-n">{plural(stop.sets.length, 'set')}</span>}
                      </p>
                      <ul className="tl-cards">
                        {stop.sets.map((s, i) => (
                          <SetCard key={s.slug} set={s} side={(start + i) % 2 === 0 ? 'left' : 'right'} />
                        ))}
                      </ul>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
          <span className="tl-spine" aria-hidden="true" />
        </div>

        <h2 id="set-codes">How to read a set code</h2>
        <p>
          Every set has a short code, shown on each entry above. The code tells you which line a set belongs to and where it sits in
          that line.
        </p>
        <ul>
          {MAIN_WHOLE && (
            <li>
              <strong>Main expansions: CSV, a number, then C.</strong> {MAIN_WHOLE.code} is {MAIN_WHOLE.name}. The number counts up with
              each expansion
              {MAIN_SETS.length > 1 && (
                <>
                  , from {MAIN_SETS[0].code} to {MAIN_SETS[MAIN_SETS.length - 1].code} on this timeline
                </>
              )}
              .
            </li>
          )}
          {MAIN_DECIMAL.length > 0 && (
            <li>
              <strong>A decimal marks a set that follows the expansion with that number.</strong> {joinList(MAIN_DECIMAL.map((s) => `${s.code} is ${s.name}`))}.
            </li>
          )}
          {GEM_PACKS.length > 0 && (
            <li>
              <strong>Gem Packs: CBB, a number, then C.</strong> The number is the volume, so {GEM_PACKS[0].code} is {GEM_PACKS[0].name}
              {GEM_PACKS.length > 1 && (
                <>
                  {' '}
                  and {GEM_PACKS[GEM_PACKS.length - 1].code} is {GEM_PACKS[GEM_PACKS.length - 1].name}
                </>
              )}
              .
            </li>
          )}
          {C151_SETS.length > 0 && (
            <li>
              <strong>Collect 151: {joinList(C151_CODES)}.</strong>{' '}
              {C151_CODES.length === 1 && C151_SETS.length > 1
                ? `All ${num(C151_SETS.length)} releases share that code: ${joinList(C151_SETS.map((s) => s.name.replace(/^Collect 151:\s*/, '')))}.`
                : `Used by ${joinList(C151_SETS.map((s) => s.name))}.`}
            </li>
          )}
          {SPECIAL_SETS.length > 0 && (
            <li>
              <strong>Special sets have their own codes.</strong> {joinList(SPECIAL_SETS.map((s) => `${s.name} is ${s.code}`))}.
            </li>
          )}
        </ul>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {f.a}
                {f.link && (
                  <>
                    {' '}
                    {f.link.before}
                    <Link to={f.link.to}>{f.link.label}</Link>
                    {f.link.after}
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
