import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { Zh } from '~/components/blog/Zh'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'what-is-a-gem-pack')!

// The Gem Pack volumes, oldest first, straight from the set registry: a new
// volume added there shows up in the table, the counts and the FAQ.
const VOLS = GEM_SETS.filter((s) => /^CBB\d+C$/.test(s.code)).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
const FIRST = VOLS[0]
const LATEST = VOLS[VOLS.length - 1]
const volNo = (code: string) => Number(code.replace(/^CBB/, '').replace(/C$/, ''))

// The Pokémon on the front of each pack, as shown in each volume's own
// release post banner (src/data/blog-posts.ts heroAlt and the set pages).
const PACK_FRONT: Record<number, string> = { 1: 'Sprigatito', 2: 'Sylveon', 3: 'Gengar', 4: 'Ponyta', 5: 'Floragato', 6: 'Applin', 7: 'Psyduck' }

// Each volume's set guide, typed for the router.
const GUIDE: Record<number, `/blog/${string}`> = Object.fromEntries(VOLS.map((v) => [volNo(v.code), `/blog/gem-vol-${volNo(v.code)}-set-guide`]))
const guidePost = (vol: number) => BLOG_POSTS.find((p) => p.path === GUIDE[vol])

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
const num = (n: number) => n.toLocaleString('en-US')
const TOTAL_EXCLUSIVES = VOLS.reduce((n, v) => n + v.exclusiveCount, 0)

// Pokémon China's product page for each volume. Every fact on this page
// about what a pack holds comes from these.
const SOURCES = [
  { vol: 1, href: 'https://www.pokemon.cn/tcg/product/15582.html' },
  { vol: 2, href: 'https://www.pokemon.cn/tcg/product/15518.html' },
  { vol: 3, href: 'https://www.pokemon.cn/tcg/product/15431.html' },
  { vol: 4, href: 'https://www.pokemon.cn/tcg/product/20382.html' },
  { vol: 5, href: 'https://www.pokemon.cn/tcg/product/21078.html' },
  { vol: 6, href: 'https://www.pokemon.cn/tcg/product/23048.html' },
  { vol: 7, href: 'https://www.pokemon.cn/tcg/product/24281.html' },
]

const TOC = [
  { id: 'in-a-pack', label: 'What is in a Gem Pack' },
  { id: 'rarity', label: 'The five rarity marks' },
  { id: 'how-a-set-works', label: 'How a Gem Pack set is built' },
  { id: 'volumes', label: 'Every volume so far' },
  { id: 'boxes', label: 'Packs and boxes' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

const FAQ = [
  {
    q: 'What is a Pokémon Gem Pack?',
    a: `A Simplified Chinese Pokémon TCG booster pack of 4 cards, all holo. Pokémon China calls it Pokémon宝石包 (Pokémon Gem Pack). ${num(VOLS.length)} volumes have come out, from Vol. ${volNo(FIRST.code)} on ${formatDate(FIRST.releaseDate)} to Vol. ${volNo(LATEST.code)} on ${formatDate(LATEST.releaseDate)}.`,
  },
  {
    q: 'How many cards are in a Gem Pack?',
    a: 'Four, and every one is a holo.',
  },
  {
    q: 'What is guaranteed in a Gem Pack?',
    a: 'One card that is Rare (★) or better. The other three are Common (●) or Uncommon (◆). Pokémon China does not promise a full art in a pack or a box.',
  },
  {
    q: 'How many Gem Pack volumes are there?',
    a: `${num(VOLS.length)}, with set codes ${FIRST.code} to ${LATEST.code}. The newest is Vol. ${volNo(LATEST.code)}, released ${formatDate(LATEST.releaseDate)}.`,
  },
  {
    q: 'What does CBB mean in a Gem Pack set code?',
    a: `It marks the Gem Pack line. The number after it is the volume, so ${FIRST.code} is Vol. ${volNo(FIRST.code)} and ${LATEST.code} is Vol. ${volNo(LATEST.code)}.`,
  },
  {
    q: 'Do Gem Packs have Chinese Exclusive cards?',
    a: `Yes. Across all ${num(VOLS.length)} volumes, ${num(TOTAL_EXCLUSIVES)} cards are Chinese Exclusives, all of them three-star full arts.`,
  },
]

export const Route = createFileRoute('/blog/what-is-a-gem-pack')({
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
  component: WhatIsAGemPackPost,
})

function WhatIsAGemPackPost() {
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
        lede={`A Gem Pack is a small Simplified Chinese Pokémon TCG pack of 4 cards, and every card in it is a holo. One of the 4 is always Rare or better. Pokémon China has released ${num(VOLS.length)} volumes so far, from ${formatDate(FIRST.releaseDate)} to ${formatDate(LATEST.releaseDate)}.`}
        cta={{
          heading: 'Shop Gem Pack booster boxes',
          body: 'Sealed Simplified Chinese Gem Pack booster boxes, newest volume first.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Gem Vol. 7 booster box' },
            { to: '/blog/chinese-gem-pack-hit-rates', label: 'Gem Pack hit rates', variant: 'ghost' },
          ],
        }}
      >
        <aside className="fact-box" aria-label="Gem Pack key facts">
          <img
            src={`${SITE_URL}/assets/sets/packs/gem-vol-${volNo(LATEST.code)}.webp`}
            alt={`A Gem Pack Vol. ${volNo(LATEST.code)} booster pack with ${PACK_FRONT[volNo(LATEST.code)] ?? 'its Pokémon'} on the front`}
            loading="lazy"
            width={428}
            height={760}
            style={{ background: 'transparent', boxShadow: 'none' }}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Name</dt>
              <dd>
                Pokémon Gem Pack (<Zh>Pokémon宝石包</Zh>)
              </dd>
              <dt>Language</dt>
              <dd>Simplified Chinese</dd>
              <dt>Cards per pack</dt>
              <dd>4, all holo</dd>
              <dt>Every pack has</dt>
              <dd>1 card Rare (★) or better</dd>
              <dt>Volumes</dt>
              <dd>
                {num(VOLS.length)} ({FIRST.code} to {LATEST.code})
              </dd>
              <dt>First volume</dt>
              <dd>{formatDate(FIRST.releaseDate)}</dd>
              <dt>Latest volume</dt>
              <dd>{formatDate(LATEST.releaseDate)}</dd>
            </dl>
          </div>
        </aside>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="in-a-pack">What is in a Gem Pack</h2>
        <p>
          Every Gem Pack holds 4 cards, and Pokémon China lists all of them as holo in every volume. Its pages for Vol. 1 and Vol. 2 also
          say how the 4 are split: 3 are Common or Uncommon, and 1 is Rare, Double Rare or Triple Rare. So the one card you can count
          on is a Rare or better.
        </p>
        <p>
          That fourth card is usually a one-star Rare. The full arts sit in the three-star tier, which turns up in about 1 pack in 12
          in Vols. 1 and 2 and about 1 pack in 14 from Vol. 3 on. Pokémon China does not promise a full art in a box. The odds for every volume, and the maths
          behind them, are in <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates</Link>.
        </p>
        <p>
          Pokémon China introduced the line with Vol. 1 as a new way to collect Pokémon cards. Its pages for Vols. 2 to 7 list a pack at
          10 yuan.
        </p>

        <h2 id="rarity">The five rarity marks</h2>
        <p>Gem Pack cards use their own rarity marks, which Pokémon China notes differ from those in regular booster packs.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rarity" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rarity" className="sr-only">
              Gem Pack rarity marks and their names
            </caption>
            <thead>
              <tr>
                <th scope="col">Mark</th>
                <th scope="col">Rarity</th>
                <th scope="col">Cards per pack</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">●</th>
                <td>Common</td>
                <td rowSpan={2}>3 of the 4</td>
              </tr>
              <tr>
                <th scope="row">◆</th>
                <td>Uncommon</td>
              </tr>
              <tr>
                <th scope="row">★</th>
                <td>Rare</td>
                <td rowSpan={3}>1 of the 4</td>
              </tr>
              <tr>
                <th scope="row">★★</th>
                <td>Double Rare</td>
              </tr>
              <tr>
                <th scope="row">★★★</th>
                <td>Triple Rare</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="how-a-set-works">How a Gem Pack set is built</h2>
        <p>
          A Gem Pack set prints each Pokémon several times, from Common up to a full art. Since Vol. 4, every volume has 28 Pokémon with
          7 versions each, 196 cards in all: versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare and 07 a full-art
          Triple Rare.
        </p>
        <p>
          The card number reads as Pokémon number, then version. In Vol. 7, 0307/07 is version 7 of Pokémon 03, the Misty&rsquo;s Psyduck
          full art.
        </p>
        <p>
          Vols. 1 to 3 are built the same way with different ladder lengths, and each also has 4 Trainer cards and 6 Energy cards. In
          those three volumes the three-star tier holds the Energy cards and a Supporter full art as well as the Pokémon. The set guides
          linked in the table below walk through each volume.
        </p>
        <p>
          Most of the art is reprinted from English Scarlet &amp; Violet and Sword &amp; Shield cards, with new holo patterns. Each
          volume has a card origins post that traces every illustration, new ones included, such as the one for{' '}
          <Link to="/blog/gem-vol-7-card-origins">Gem Vol. 7</Link>. Every Gem Pack
          Chinese Exclusive is listed in <Link to="/blog/chinese-exclusive-pokemon-cards">Every Chinese Exclusive Pokémon card</Link>.
        </p>

        <h2 id="volumes">Every volume so far</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-vols" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-vols" className="sr-only">
              Every Gem Pack volume with its set code, release date, card count and Chinese Exclusives
            </caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Set code</th>
                <th scope="col">Released</th>
                <th scope="col">On the pack</th>
                <th scope="col">Cards</th>
                <th scope="col">Chinese Exclusives</th>
                <th scope="col">Read more</th>
              </tr>
            </thead>
            <tbody>
              {VOLS.map((v) => {
                const n = volNo(v.code)
                const guide = guidePost(n)
                return (
                  <tr key={v.slug}>
                    <th scope="row">
                      <Link to={v.path}>Vol. {n}</Link>
                    </th>
                    <td>{v.code}</td>
                    <td>{formatDate(v.releaseDate)}</td>
                    <td>{PACK_FRONT[n] ?? ''}</td>
                    <td>{num(v.cardCount)}</td>
                    <td>{num(v.exclusiveCount)}</td>
                    <td>
                      <Link to={v.path}>Card list</Link>
                      {guide && (
                        <>
                          {', '}
                          <Link to={guide.path}>set guide</Link>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          All {num(VOLS.length)} volumes also sit on the <Link to="/blog/chinese-pokemon-sets-in-order">Simplified Chinese release timeline</Link>.
        </p>

        <h2 id="boxes">Packs and boxes</h2>
        <p>
          Pokémon China gives a box size only for Vol. 1: 15 packs. The Vol. 2 boxes we sell hold 15 packs, and the Vol. 3 to Vol. 7
          boxes hold 18. A box has no extra guarantee beyond what is in its packs. The{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates" hash="per-box">
            full arts per box
          </Link>{' '}
          section of the hit-rates article shows the averages.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2 id="sources">Sources</h2>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href}>Pokémon China, Gem Pack Vol. {s.vol} product page</a>
            </li>
          ))}
        </ul>
      </BlogPostLayout>
    </>
  )
}
