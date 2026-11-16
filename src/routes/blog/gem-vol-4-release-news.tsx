import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-4-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%204/Cards/${id}.webp`

// Ponyta's six holo versions, in collector-number order. All share one
// illustration by Ayako Ozaki and differ only in rarity and foil finish.
const PONYTA_RUN = [
  { id: '0101', rarity: 'Common', finish: 'Fire-type pattern foil' },
  { id: '0102', rarity: 'Common', finish: 'Poké Ball pattern foil' },
  { id: '0103', rarity: 'Uncommon', finish: 'Glitter foil' },
  { id: '0104', rarity: 'Uncommon', finish: 'Starburst foil' },
  { id: '0105', rarity: 'Rare', finish: 'Master Ball pattern foil' },
  { id: '0106', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
]

// The full arts Pokémon China showed alongside Ponyta in its
// announcement, with the illustrator printed on each card. Most wanted first.
const REVEALED_FULL_ARTS = [
  { id: '0407', name: 'Eevee', illus: 'Narumi Sato' },
  { id: '0907', name: 'Infernape', illus: 'Krgc' },
  { id: '2007', name: 'Litten', illus: 'Makura Tami' },
  { id: '2407', name: 'Meltan', illus: 'Masa' },
  { id: '1607', name: 'Cinccino', illus: 'Shibuzoh.' },
  { id: '2307', name: 'Mudsdale', illus: 'MINAMINAMI Take' },
  { id: '1407', name: 'Excadrill', illus: 'Saboteri' },
  { id: '0607', name: 'Torkoal', illus: 'Masa' },
  { id: '1907', name: 'Heliolisk', illus: 'Tonji Matsuno' },
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
  { id: 'ponyta-full-art', label: 'The chase: Ponyta full art' },
  { id: 'lineup', label: 'Horses, seasons and a Paradox Pokémon' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'ponyta', label: 'Ponyta, six holo versions' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'ponyta-binder', label: 'The Ponyta binder' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'Is Gem 4 the same as "Gemstone Vol. 4"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB4C.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '18 packs of 4 cards each, so 72 cards per box.',
  },
  {
    q: 'Are all the cards foil?',
    a: 'Yes. Every card in every pack is a holo. There are no plain non-foil cards in the set.',
  },
  {
    q: 'What is the main chase card?',
    a: 'Ponyta 0107/07, the full art by MINAMINAMI Take drawn for this set. Beyond that, collectors chase the 28 full arts (every card numbered 07).',
  },
  {
    q: 'Can I complete the set from one box?',
    a: 'No. The set has 196 cards and a box holds 72, so even with zero duplicates you would need at least three boxes. In practice a full set takes several boxes or buying singles.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-4-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title.replace('Gem Vol 4', 'Gem Vol 4 (Gem 4)')} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: GemVol4Post,
})

function GemVol4Post() {
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
    publisher: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
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
        lede="Ponyta fronts the fourth Simplified Chinese Gem Pack: 28 Pokémon, seven cards each, every card a foil, and a new Ponyta full art by MINAMINAMI Take you can only pull here."
        cta={{
          heading: 'Shop Gem Vol 4',
          body: 'Booster boxes in stock now, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-4-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-4', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 4 (Gem 4) lands in mainland China on February 6, 2026, right in time for Lunar New Year. Like every Gem Pack, it is an
          official Simplified Chinese Pokémon TCG product built for collecting: small 4-card packs where every card is a holo, and a
          set structure that gives each Pokémon its own run of seven cards. This volume is all about Ponyta, a fitting pick for the
          Year of the Horse, with a brand-new Ponyta full art as the headline card.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 4 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-4-booster-pack.webp`}
            alt="Gem Pack Vol. 4 booster pack with Ponyta on the front"
            loading="lazy"
            width={600}
            height={1092}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 4 (宝石包 VOL.4), also called Gemstone Vol. 4</dd>
              <dt>Set code</dt>
              <dd>CBB4C</dd>
              <dt>Released</dt>
              <dd>February 6, 2026, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>18 packs, 72 cards</dd>
              <dt>Set size</dt>
              <dd>196 cards: 28 Pokémon × 7 versions</dd>
              <dt>Chase card</dt>
              <dd>Ponyta full art 0107/07, by MINAMINAMI Take</dd>
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

        <h2 id="ponyta-full-art">The chase: Ponyta full art</h2>
        <figure className="feature-card">
          <img src={cardImg('0107')} alt="Ponyta 0107/07 full art, Triple Rare, Gem Vol 4" loading="lazy" width={320} height={447} />
          <figcaption>
            <strong>0107/07</strong>
            Triple Rare · Full art · Illus. MINAMINAMI Take
          </figcaption>
        </figure>
        <p>
          The full art is new artwork by MINAMINAMI Take, drawn for this set. It is a sunset scene on open grassland, with Ponyta
          mid-stride across the field while a Rapidash rests behind it and keeps watch.
        </p>
        <p>
          Because the illustration debuts here, Gem Vol 4 is the only place to pull it. It sits in the 07 slot, the rarest in every
          run, so plan on opening plenty of packs or picking it up as a single.
        </p>

        <h2 id="lineup">Horses, seasons and a Paradox Pokémon</h2>
        <p>
          There are no Trainer's Pokémon in this volume. Ponyta has company in Mudsdale, Deerling and Sawsbuck bring the changing
          seasons, and Eevee, Litten, Minccino and Cinccino round out the cute side. Enamorus and the Paradox Pokémon Flutter Mane give
          the set a couple of heavier hitters. Pokémon China revealed these full arts alongside Ponyta:
        </p>
        <div className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 4`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/07 · Illus. {c.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The rest of the roster: Lickitung, Pinsir, Paldean Wooper, Relicanth, Grotle, Chatot, Probopass, Froslass, Phione, Charjabug,
          Cutiefly, Cramorant and Snom. The <Link to="/sets/chinese/gem-vol-4">full card list</Link> shows all 196 cards.
        </p>

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          foil finish. The seventh is a full art with its own illustration. Card numbers tell you exactly where you are: read 0107/07
          as Pokémon 01, version 07 of 7, so it is the full art of the first Pokémon in the set, which is Ponyta.
        </p>
        <div className="table-scroll">
          <table className="data-table">
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

        <h2 id="ponyta">Ponyta, six holo versions</h2>
        <p>
          Ponyta shows how a run works. Versions 01 to 06 share the same illustration by Ayako Ozaki, with Ponyta resting in a
          flower-dotted meadow, and each one gets its own holo finish: Fire-type and Poké Ball patterns, glitter, starburst, the Master
          Ball pattern, and the pink Gem Pack logo stamp.
        </p>
        <div className="card-grid cols-3">
          {PONYTA_RUN.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Ponyta ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 4`} loading="lazy" width={300} height={419} />
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
          Going by the print shares above, a box averages one or two full arts, though some boxes run hot and some run cold. With 196
          cards in the set and 72 per box, finishing a master set takes several boxes or picking up singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 4 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Vol. 4 is
          the first volume with the 196-card, 28 × 7 shape, up from 136 cards in Vol. 3.
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
                <tr key={g.vol} className={g.vol === 4 ? 'is-current' : undefined}>
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
          <Link to="/blog/gem-vol-4-set-guide">Gem Vol 4 set guide</Link>.
        </p>

        <h2 id="ponyta-binder">A Ponyta binder to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 4 binder the same day, red with Ponyta on the cover. Each page holds a
          single card, so it works as a showcase for your best pulls, like the Ponyta full art or all seven Ponyta versions, rather than
          as storage for the whole set.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-4-ponyta-binder.webp`}
          alt="Official Gem Pack Vol. 4 Ponyta card binder, 30 pockets, red cover"
          loading="lazy"
          width={1600}
          height={1067}
        />

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Gem Vol 4 is a bright, easy set to open. Every card is a holo, the packs are small enough to rip a few at a time, and the
          Ponyta theme makes it a natural Lunar New Year pickup. If you only chase one card, make it the Ponyta full art. If you like
          completing runs, Ponyta's six holo versions are an easy place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
