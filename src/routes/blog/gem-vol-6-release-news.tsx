import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-6-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%206/Cards/${id}.webp`

// Applin's six holo versions, in collector-number order. All share one
// illustration by Tetsu Kayama and differ only in rarity and holo pattern.
const APPLIN_RUN = [
  { id: '1901', rarity: 'Common', finish: 'Grass-type pattern holo' },
  { id: '1902', rarity: 'Common', finish: 'Poké Ball pattern holo' },
  { id: '1903', rarity: 'Uncommon', finish: 'Glitter holo' },
  { id: '1904', rarity: 'Uncommon', finish: 'Starburst holo' },
  { id: '1905', rarity: 'Rare', finish: 'Master Ball pattern holo' },
  { id: '1906', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
]

// The six full arts Pokémon China showed alongside Applin in its
// announcement, with the illustrator printed on each card.
const REVEALED_FULL_ARTS = [
  { id: '2007', name: 'Flapple', illus: 'Uninori' },
  { id: '2107', name: 'Appletun', illus: 'MINAMINAMI Take' },
  { id: '2407', name: 'Dipplin', illus: 'Akira Komayama' },
  { id: '2507', name: 'Poltchageist', illus: 'Saboteri' },
  { id: '2707', name: 'Munkidori', illus: 'Teeziro' },
  { id: '1007', name: 'Castform Sunny Form', illus: 'Narano' },
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
  { id: 'applin-full-art', label: 'Chinese Exclusive: Applin full art' },
  { id: 'lineup', label: 'Apples, tea and the Loyal Three' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'applin', label: 'Applin, six holo versions' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'applin-binder', label: 'The Applin binder' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
  { vol: 5, date: 'April 24, 2026', cards: 196 },
  { vol: 6, date: 'August 7, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 6 released?',
    a: 'August 7, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Is Gem 6 the same as "Gemstone Vol. 6"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB6C.',
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
    q: 'What is the Chinese Exclusive in Gem Vol 6?',
    a: 'Applin 1907/07, the full art by Jiro Sasumo drawn for this set, and the main chase card. Beyond that, collectors chase the 28 full arts (every card numbered 07).',
  },
  {
    q: 'What are the odds of pulling a full art?',
    a: "Full arts make up 1.81% of the print run, going by Pokémon China's print shares. With 72 cards in a box, that averages about 1.3 full arts per box, or roughly one in every 14 packs.",
  },
  {
    q: 'Where do the Gem 6 illustrations come from?',
    a: 'Mostly from English cards. 55 of the 56 illustrations are the same art you will find on English Scarlet & Violet cards, mostly from Surging Sparks.',
    link: { to: '/sets/chinese/gem-vol-6', before: 'See every card on the ', label: 'Gem Vol 6 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-6-release-news')({
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
  component: GemVol6Post,
})

function GemVol6Post() {
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
        lede="Applin fronts the sixth Simplified Chinese Gem Pack: 28 Pokémon, seven cards each, every card a holo, and a Chinese Exclusive Applin full art by Jiro Sasumo."
        cta={{
          heading: 'Shop Gem Vol 6',
          body: 'Booster boxes, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-6-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-6', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 6 (Gem 6, set code CBB6C) lands in mainland China on August 7, 2026. Like every Gem Pack, it is an official Simplified Chinese
          Pokémon TCG product built for collecting: small 4-card packs where every card is a holo, and a set structure that gives each
          Pokémon its own run of seven cards. This volume is built around Applin: it is on the pack, the whole apple family is in the
          lineup, and a brand-new Applin full art is the headline card.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 6 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-6-booster-pack.webp`}
            alt="Gem Pack Vol. 6 booster pack with Applin on the front"
            loading="lazy"
            width={600}
            height={1092}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 6 (<Zh>宝石包 VOL.6</Zh>), also called Gemstone Vol. 6</dd>
              <dt>Set code</dt>
              <dd>CBB6C</dd>
              <dt>Released</dt>
              <dd>August 7, 2026, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>18 packs, 72 cards</dd>
              <dt>Set size</dt>
              <dd>196 cards: 28 Pokémon × 7 versions</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Applin full art 1907/07, by Jiro Sasumo</dd>
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

        <h2 id="applin-full-art">Chinese Exclusive: Applin full art</h2>
        <figure className="feature-card">
          <img src={cardImg('1907')} alt="Applin 1907/07 Chinese Exclusive full art, Triple Rare, Gem Vol 6" loading="lazy" width={320} height={447} />
          <figcaption>
            <ChineseExclusiveBadge />
            <strong>1907/07</strong>
            Triple Rare · Full art · Illus. Jiro Sasumo
          </figcaption>
        </figure>
        <p>
          The full art is a new illustration by Jiro Sasumo. The table is covered in jars of fruit drinks, a teapot, oranges and a
          fruit tart, and Applin sits among the fruit looking like one more apple.
        </p>
        <p>
          Because the illustration debuts here, Gem Vol 6 is the only place to pull it. It sits in the 07 slot, the rarest in every
          run, so plan on opening plenty of packs or picking it up as a single.
        </p>

        <h2 id="lineup">Apples, tea and the Loyal Three</h2>
        <p>
          This time none of the Pokémon belong to a Trainer. Instead the lineup leans on fruit, garden and tea Pokémon: Applin and its whole family,
          Flapple, Appletun and Dipplin, plus Exeggcute, Castform in its Sunny Form, and Poltchageist the tea-cup Pokémon. The Loyal
          Three from Kitakami, Okidogi, Munkidori and Fezandipiti, close out the set. Pokémon China pitches the set as a treasure hunt,
          with each illustration telling a small story about its Pokémon, and revealed these six full arts alongside Applin:
        </p>
        <ul className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 6`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.id}/07 · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          The rest of the roster: Alolan Dugtrio, Persian, Ledian, Slakoth, Lairon, Meditite, Gulpin, Lileep, Kecleon, Mesprit,
          Reuniclus, Crabominable, Shiinotic, Bewear, Bruxish, Tapu Bulu, Clobbopus and Cufant. The{' '}
          <Link to="/sets/chinese/gem-vol-6">full card list</Link> shows all 196 cards.
        </p>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          holo pattern. The seventh is a full art with its own illustration. Card numbers tell you exactly where you are: read 1907/07
          as Pokémon 19, version 07 of 7, so it is the full art of the nineteenth Pokémon in the set, which is Applin.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">How the set is built</caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col" className="col-versions">
                  Versions
                </th>
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

        <h2 id="applin">Applin, six holo versions</h2>
        <p>
          Applin shows how a run works. Versions 01 to 06 share the same illustration by Tetsu Kayama, with Applin sitting in the grass beside a blossoming tree. Only the holo
          changes: Grass-type and Poké Ball patterns, glitter, starburst,
          the Master Ball pattern, and the pink Gem Pack logo stamp.
        </p>
        <ul className="card-grid cols-3">
          {APPLIN_RUN.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`Applin ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 6`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.id}/07</strong>
                  {c.rarity} · {c.finish}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 18 packs of 4 holo cards, 72 cards in total. Pulls are random, so duplicates are normal and no specific Pokémon or
          finish is guaranteed.
        </p>
        <p>
          Going by the print shares above, a box averages one or two full arts, though some boxes run hot and some run cold. With 196 cards in the set and 72 per box, finishing a master set takes several boxes or picking up
          singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 6 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Since Vol.
          4, every volume has used the same 196-card, 28 × 7 shape.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Where Vol. 6 fits in the Gem Pack line</caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 6 ? 'is-current' : undefined}>
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
        <p>
          For all 28 full arts, the full roster and master set math, see our{' '}
          <Link to="/blog/gem-vol-6-set-guide">Gem Vol 6 set guide</Link>.
        </p>

        <h2 id="applin-binder">An Applin binder to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 6 binder the same day, pink with Applin on the cover. It holds 30 cards, one
          per page, which is enough for your favorite pulls, like the Applin full art or all seven Applin versions.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-6-applin-binder.webp`}
          alt="Official Gem Pack Vol. 6 Applin card binder, 30 pockets, pink cover"
          loading="lazy"
          width={1600}
          height={1067}
        />

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {zh(f.a)}
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
          Gem Vol 6 is a cozy set. Every card is a holo, the packs are small enough to rip a few at a time, and the apple
          theme gives it its own look. If you only chase one card, make it the Applin full art. If you like
          completing runs, Applin's six holo versions are an easy place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
