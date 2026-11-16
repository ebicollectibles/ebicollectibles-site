import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-7-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%207/Cards/${id}.webp`

// All seven Misty's Psyduck cards, in collector-number order. Versions
// 01-06 share one illustration and differ only in rarity and holo
// finish; 07 is the full art.
const PSYDUCK_RUN = [
  { id: '0301', rarity: 'Common', finish: 'Water-type pattern holo' },
  { id: '0302', rarity: 'Common', finish: 'Poké Ball pattern holo' },
  { id: '0303', rarity: 'Uncommon', finish: 'Glitter holo' },
  { id: '0304', rarity: 'Uncommon', finish: 'Starburst holo' },
  { id: '0305', rarity: 'Rare', finish: 'Master Ball pattern holo' },
  { id: '0306', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
  { id: '0307', rarity: 'Triple Rare', finish: 'Full art' },
]

// The six full arts Pokémon China showed alongside Psyduck in its
// launch announcement.
const REVEALED_FULL_ARTS = [
  { id: '0207', name: "Team Rocket's Meowth", note: 'with Giovanni' },
  { id: '2007', name: "Lillie's Ribombee", note: 'with Lillie' },
  { id: '1907', name: "N's Zorua", note: 'with N' },
  { id: '1607', name: "Cynthia's Roserade", note: 'with Cynthia' },
  { id: '1507', name: "Steven's Beldum", note: 'with Steven' },
  { id: '1707', name: 'Shaymin', note: 'in a flower field' },
]

// One row per rarity: how many cards of it are in the 196-card set, and
// the share of the print run Pokémon China says it makes up.
const RARITY = [
  { symbol: '●', label: 'Common', versions: '01, 02', cards: 56, print: '50.00%' },
  { symbol: '◆', label: 'Uncommon', versions: '03, 04', cards: 56, print: '25.00%' },
  { symbol: '★', label: 'Rare', versions: '05', cards: 28, print: '17.39%' },
  { symbol: '★★', label: 'Double Rare', versions: '06', cards: 28, print: '5.80%' },
  { symbol: '★★★', label: 'Full art', versions: '07', cards: 28, print: '1.81%' },
]

const TOC = [
  { id: 'psyduck-full-art', label: "Chinese Exclusive: Misty's Psyduck full art" },
  { id: 'trainers', label: 'Trainers and their Pokémon' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'mistys-psyduck', label: "Misty's Psyduck, six holo versions" },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'psyduck-binder', label: 'The Psyduck binder' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
  { vol: 5, date: 'April 24, 2026', cards: 196 },
  { vol: 6, date: 'August 7, 2026', cards: 196 },
  { vol: 7, date: 'November 6, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 7 released?',
    a: 'November 6, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Is Gem 7 the same as "Gemstone Vol. 7"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB7C.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '18 packs of 4 cards each, so 72 cards per box.',
  },
  {
    q: 'Are all the cards holo?',
    a: 'Yes. Every card in every pack is a holo.',
  },
  {
    q: 'What is the Chinese Exclusive in Gem Vol 7?',
    a: "Misty's Psyduck 0307/07, the full art by Cona Nitanda drawn for this set, and the main chase card. Beyond that, collectors chase the 28 full arts (every card numbered 07).",
  },
  {
    q: 'What are the odds of pulling a full art?',
    a: "Full arts make up 1.81% of the print run, going by Pokémon China's print shares. With 72 cards in a box, that averages about 1.3 full arts per box, or roughly one in every 14 packs.",
  },
  {
    q: 'Where do the Gem 7 illustrations come from?',
    a: 'Mostly from English cards. 55 of the 56 illustrations are the same art you will find on English Scarlet & Violet cards, mostly from Destined Rivals.',
    link: { to: '/sets/chinese/gem-vol-7', before: 'See every card on the ', label: 'Gem Vol 7 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-7-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:image:width', content: '1600' },
      { property: 'og:image:height', content: '900' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: post.heroImage },
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
  component: GemVol7Post,
})

function GemVol7Post() {
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
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.link ? `${f.a} ${f.link.before}${f.link.label}${f.link.after}` : f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Psyduck fronts the seventh Simplified Chinese Gem Pack: 28 Pokémon, seven cards each, every card a holo, and the Chinese Exclusive Misty's Psyduck full art by Cona Nitanda, drawn for this set."
        cta={{
          heading: 'Shop Gem Vol 7',
          body: 'Booster boxes, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-7', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 7 (Gem 7) landed in mainland China on November 6, 2026. Like every Gem Pack, it is an official Simplified Chinese
          Pokémon TCG product built for collecting: small 4-card packs where every card is a holo, and a set structure that gives each
          Pokémon its own run of seven cards. This volume leans into Trainers and their partner Pokémon, with Psyduck on the
          pack and a Chinese Exclusive full art of Misty's Psyduck.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 7 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-7-booster-pack.webp`}
            alt="Gem Pack Vol. 7 booster pack with Psyduck on the front"
            loading="lazy"
            width={1200}
            height={2130}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 7 (宝石包 VOL.7), also called Gemstone Vol. 7</dd>
              <dt>Set code</dt>
              <dd>CBB7C</dd>
              <dt>Released</dt>
              <dd>November 6, 2026, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>18 packs, 72 cards</dd>
              <dt>Set size</dt>
              <dd>196 cards: 28 Pokémon × 7 versions</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Misty's Psyduck full art 0307/07, by Cona Nitanda</dd>
            </dl>
          </div>
        </aside>

        <nav className="toc" aria-label="In this guide">
          <p className="toc-title">In this guide</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="psyduck-full-art">Chinese Exclusive: Misty's Psyduck full art</h2>
        <figure className="feature-card">
          <img src={cardImg('0307')} alt="Misty's Psyduck 0307/07 Chinese Exclusive full art, Triple Rare, Gem Vol 7" loading="lazy" width={300} height={419} />
          <figcaption>
            <ChineseExclusiveBadge />
            <strong>0307/07</strong>
            Triple Rare · Full art · Illus. Cona Nitanda
          </figcaption>
        </figure>
        <p>
          The full art is a new illustration by Cona Nitanda. Psyduck sits in a blue beach chair under an umbrella with one hand up on a
          beach ball, and Misty stands in the background in her swimsuit.
        </p>
        <p>
          Because the illustration debuts here, Gem Vol 7 is the only place to pull it. It sits in the 07 slot, the rarest in every
          run, so plan on opening plenty of packs or picking it up as a single.
        </p>

        <h2 id="trainers">Trainers and their Pokémon</h2>
        <p>
          19 of the 28 Pokémon belong to a Trainer, like Misty's Psyduck or Team Rocket's Meowth. Team Rocket has the most
          with eight: Raticate, Meowth,
          Weezing, Murkrow, Wobbuffet, Houndoom, Orbeetle and Spidops. Misty brings Psyduck and Lapras, and the rest of the cast
          includes Ethan, Steven, Cynthia, N, Lillie, Arven, Hop, Marnie and Iono. Pokémon China revealed these six full arts alongside
          Psyduck:
        </p>
        <div className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 7`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/07 · {c.note}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The other nine Pokémon appear without a Trainer: Rapidash, Furret, Swinub, Blaziken, Clamperl, Shaymin, Crustle, Lycanroc and
          Hydrapple. Curious where these illustrations have appeared before? Our <Link to="/blog/gem-vol-7-card-origins">card origins guide</Link>{' '}
          traces it card by card.
        </p>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          holo pattern. The seventh is a full art with its own illustration. Card numbers tell you exactly where you are: read 0307/07
          as Pokémon 03, version 07 of 7, so it is the full art of the third Pokémon in the set.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col" className="col-versions">Versions</th>
                <th scope="col">In the set</th>
                <th scope="col">Print share</th>
              </tr>
            </thead>
            <tbody>
              {RARITY.map((r) => (
                <tr key={r.label}>
                  <th scope="row">
                    <span className="sym" aria-hidden="true">
                      {r.symbol}
                    </span>{' '}
                    {r.label}
                  </th>
                  <td className="col-versions">{r.versions}</td>
                  <td>{r.cards}</td>
                  <td>{r.print}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Print shares are published by Pokémon China.</p>

        <h2 id="mistys-psyduck">Misty's Psyduck, six holo versions</h2>
        <p>
          Psyduck shows how a run works. Versions 01 to 06 share the same pool-deck illustration by Yuu
          Nishida. Only the holo
          changes: Energy-type and Poké Ball patterns, glitter, starburst, the Master Ball
          pattern, and the pink Gem Pack logo stamp.
        </p>
        <div className="card-grid cols-3">
          {PSYDUCK_RUN.filter((c) => c.id !== '0307').map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Misty's Psyduck ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 7`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.id}/07</strong>
                {c.rarity} · {c.finish}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 18 packs of 4 holo cards, 72 cards in total. Pulls are random, so duplicates are normal and no specific Pokémon or
          finish is guaranteed.
        </p>
        <p>
          Going by the print shares above, a box averages one or two full arts, though some boxes run hot and some run cold. With 196 cards in the set and 72 per box, finishing a master set takes several boxes or picking up
          singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 7 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Since Vol.
          4, every volume has used the same 196-card, 28 × 7 shape.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 7 ? 'is-current' : undefined}>
                  <th scope="row">
                    <Link to={`/sets/chinese/gem-vol-${g.vol}` as never}>Gem Pack Vol. {g.vol}</Link>
                  </th>
                  <td>{g.date}</td>
                  <td>{g.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="psyduck-binder">A Psyduck binder to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 7 binder with Psyduck on the cover the same day. It holds 30 cards, one per page,
          which is enough for your favorite pulls, like the Psyduck full art or all seven Psyduck versions.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-7-psyduck-collector-binder.webp`}
          alt="Official Gem Pack Vol. 7 Psyduck card binder, 30 pockets"
          loading="lazy"
          width={2000}
          height={1333}
        />

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
                    <Link to={f.link.to as never}>{f.link.label}</Link>
                    {f.link.after}
                  </>
                )}
              </p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Gem Vol 7 is a fun one to open. Every card is a holo, the packs are small enough to rip a few at a time, and having Misty,
          Cynthia, N and Team Rocket on the cards makes the Trainer pulls stand out. If you only chase one card, make it the Misty's Psyduck full art. If you like completing runs, Psyduck's six holo
          versions are an easy place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
