import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { Zh } from '~/components/blog/Zh'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

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

// Packs per box: Pokémon China gives 15 for Vol. 1; the other sizes are from
// our own product listings (same figures as chinese-gem-pack-hit-rates).
const BOX_PACKS: Record<number, number> = { 1: 15, 2: 15, 3: 18, 4: 18, 5: 18, 6: 18, 7: 18 }

// Each volume's lead chase card: the mascot or best-known Chinese Exclusive
// full art (as chosen in chinese-gem-pack-hit-rates).
const LEAD: Record<number, { id: string; no: string; name: string; alt: string }> = {
  7: { id: '0307', no: '0307/07', name: "Misty's Psyduck", alt: "Misty's Psyduck 0307/07 Chinese Exclusive full art from Gem Vol 7: Psyduck lies in a beach chair holding up a beach ball, with Misty behind it" },
  6: { id: '1907', no: '1907/07', name: 'Applin', alt: 'Applin 1907/07 Chinese Exclusive full art from Gem Vol 6: Applin hides in an apple on a sunny kitchen table among fruit and drinks' },
  5: { id: '0107', no: '0107/07', name: 'Captain Pikachu', alt: 'Captain Pikachu 0107/07 Chinese Exclusive full art from Gem Vol 5: Captain Pikachu salutes beside Friede at a ship rail' },
  4: { id: '0107', no: '0107/07', name: 'Ponyta', alt: 'Ponyta 0107/07 Chinese Exclusive full art from Gem Vol 4: Ponyta prances through a sunset meadow while a Rapidash rests behind it' },
  3: { id: '0307', no: '0307/07', name: 'Gengar', alt: 'Gengar 0307/07 Chinese Exclusive full art from Gem Vol 3: Gengar grins among floating plates and teacups' },
  2: { id: '0115', no: '0115/15', name: 'Eevee', alt: 'Eevee 0115/15 Chinese Exclusive full art from Gem Vol 2: Eevee sits in a sunlit forest' },
  1: { id: '0109', no: '0109/09', name: 'Sprigatito', alt: 'Sprigatito 0109/09 Chinese Exclusive Pokémon Horizons full art from Gem Vol 1: Sprigatito beside a winking Liko' },
}
const cardImg = (vol: number, id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%20${vol}/Cards/${id}.webp`

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

const TOC = [
  { id: 'in-a-pack', label: 'What is in a Gem Pack' },
  { id: 'rarity', label: 'The five rarity marks' },
  { id: 'how-a-set-works', label: 'How a Gem Pack set is built' },
  { id: 'volumes', label: 'Every volume so far' },
  { id: 'chase', label: 'The chase card in each volume' },
  { id: 'boxes', label: 'Packs and boxes' },
  { id: 'odds', label: 'Odds at a glance' },
  { id: 'faq', label: 'FAQ' },
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
    q: 'How many packs are in a Gem Pack booster box?',
    a: 'Pokémon China says 15 packs per box for Vol. 1. The Vol. 2 boxes we sell hold 15 packs, and the Vol. 3 to Vol. 7 boxes hold 18.',
  },
  {
    q: 'Does a Gem Pack box guarantee a full art?',
    a: 'No. A box averages about 1.3 three-star cards, where the full arts are, but Pokémon China does not promise one per box. In Vols. 1 to 3 some three-star cards are Energy or Trainer cards.',
  },
  {
    q: 'What are the odds of a full art in a Gem Pack?',
    a: 'A three-star card turns up in about 1 pack in 12 in Vols. 1 and 2 and about 1 pack in 14 in Vols. 3 to 7. The full odds tables are in our Gem Pack hit rates guide.',
  },
  {
    q: 'How much does a Gem Pack cost in China?',
    a: "Pokémon China's pages for Vols. 2 to 7 list a pack at 10 yuan.",
  },
  {
    q: 'Can you play the game with Gem Pack cards?',
    a: 'Pokémon China says a Gem Pack on its own cannot be used to play, and suggests combining the cards with other products to build a deck.',
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
  {
    q: 'Are Gem Packs sold under other names?',
    a: 'Yes. Shops also call them Gem Volume, Chinese Gem Pack or Baokemeng Gem Pack, and some list Vol. 1 as Horizons Gem. They are the same Simplified Chinese products.',
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
        lede={`A Gem Pack is a Simplified Chinese Pokémon TCG booster pack of 4 cards, all holo, and one card in every pack is Rare or better. Pokémon China has released ${num(VOLS.length)} volumes, from Vol. ${volNo(FIRST.code)} on ${formatDate(FIRST.releaseDate)} to Vol. ${volNo(LATEST.code)} on ${formatDate(LATEST.releaseDate)}, each with its own Chinese Exclusive full art.`}
        cta={{
          heading: 'Shop Gem Pack booster boxes',
          body: 'Sealed Simplified Chinese Gem Pack booster boxes, newest volume first.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Gem Vol. 7 booster box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-6-booster-box' }, label: 'Gem Vol. 6 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-5-booster-box' }, label: 'Gem Vol. 5 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-4-booster-box' }, label: 'Gem Vol. 4 booster box', variant: 'ghost' },
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
              <dt>Packs per box</dt>
              <dd>15 (Vols. 1 and 2), 18 (Vols. 3 to 7)</dd>
              <dt>Box guarantee</dt>
              <dd>None stated by Pokémon China</dd>
              <dt>Price in China</dt>
              <dd>10 yuan a pack (Vols. 2 to 7)</dd>
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
                <th scope="col">Packs per box</th>
                <th scope="col">Chinese Exclusives</th>
                <th scope="col">Lead chase card</th>
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
                    <td>{BOX_PACKS[n] ?? ''}</td>
                    <td>{num(v.exclusiveCount)}</td>
                    <td>{LEAD[n] ? `${LEAD[n].name} ${LEAD[n].no}` : ''}</td>
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

        <h2 id="chase">The chase card in each volume</h2>
        <p>
          Each volume has its own Chinese Exclusive full arts with new illustrations, printed only in Gem Packs. These are the best-known
          one from each volume, newest first.
        </p>
        <ul className="card-grid cols-4">
          {[...VOLS].reverse().map((v) => {
            const n = volNo(v.code)
            const c = LEAD[n]
            if (!c) return null
            const guide = guidePost(n)
            return (
              <li key={v.slug}>
                <figure>
                  <img src={cardImg(n, c.id)} alt={c.alt} loading="lazy" width={300} height={419} />
                  <figcaption>
                    <ChineseExclusiveBadge />
                    <strong>{c.name}</strong>
                    {c.no} · Gem Vol. {n} · <Link to={v.path}>Card list</Link>
                    {guide && (
                      <>
                        {' · '}
                        <Link to={guide.path}>Set guide</Link>
                      </>
                    )}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>

        <h2 id="boxes">Packs and boxes</h2>
        <p>
          Pokémon China gives a box size only for Vol. 1: 15 packs. The Vol. 2 boxes we sell hold 15 packs, and the Vol. 3 to Vol. 7
          boxes hold 18. A box has no extra guarantee beyond what is in its packs. The{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates" hash="per-box">
            full arts per box
          </Link>{' '}
          section of the hit-rates article shows the averages.
        </p>

        <h2 id="odds">Odds at a glance</h2>
        <ul>
          <li>Every pack: 1 card Rare (★) or better.</li>
          <li>A three-star card, where the full arts are: about 1 pack in 12 in Vols. 1 and 2, and about 1 pack in 14 in Vols. 3 to 7.</li>
          <li>Per box: about 1.3 three-star cards on average in every volume, with no guarantee.</li>
          <li>
            One named full art in Vols. 4 to 7, such as Misty&rsquo;s Psyduck: about 1 box in 21.5, if every three-star card is printed in
            equal numbers, which Pokémon China does not say.
          </li>
        </ul>
        <p>
          The official odds chart for every volume, with the maths, is in{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Chinese Gem Pack hit rates</Link>.
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
      </BlogPostLayout>
    </>
  )
}
