import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-6-set-guide')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%206/Cards/${id}.webp`

// Applin's six holo versions, in collector-number order. All share one
// illustration by Tetsu Kayama and differ only in rarity and foil finish.
const APPLIN_RUN = [
  { id: '1901', rarity: 'Common', finish: 'Grass-type pattern foil' },
  { id: '1902', rarity: 'Common', finish: 'Poké Ball pattern foil' },
  { id: '1903', rarity: 'Uncommon', finish: 'Glitter foil' },
  { id: '1904', rarity: 'Uncommon', finish: 'Starburst foil' },
  { id: '1905', rarity: 'Rare', finish: 'Master Ball pattern foil' },
  { id: '1906', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
]

// The six full arts Pokémon China showed alongside Applin in its
// announcement, with the illustrator printed on each card.
const REVEALED_FULL_ARTS = [
  { id: '2007', name: 'Flapple', illus: 'Uninori' },
  { id: '2107', name: 'Appletun', illus: 'MINAMINAMI Take' },
  { id: '2407', name: 'Dipplin', illus: 'Akira Komayama' },
  { id: '1007', name: 'Castform Sunny Form', illus: 'Narano' },
  { id: '2507', name: 'Poltchageist', illus: 'Saboteri' },
  { id: '2707', name: 'Munkidori', illus: 'Teeziro' },
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
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'applin', label: 'Applin, six holo versions' },
  { id: 'applin-full-art', label: 'The chase: Applin full art' },
  { id: 'lineup', label: 'Apples, tea and the Loyal Three' },
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
  { vol: 7, date: 'November 6, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'Is Gem Pack Vol. 6 the same as "Gemstone Vol. 6"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB6C.',
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
    a: 'Applin 1907/07, the kitchen full art drawn for this set. Beyond that, collectors chase the 28 full arts (every card numbered 07).',
  },
  {
    q: 'Can I complete the set from one box?',
    a: 'No. The set has 196 cards and a box holds 72, so even with zero duplicates you would need at least three boxes. In practice a full set takes several boxes or buying singles.',
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-6-set-guide')({
  head: () => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: 'noindex, nofollow' },
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
  component: GemVol6Post,
})

function GemVol6Post() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
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
        wide
        post={post}
        lede="Applin fronts the sixth Simplified Chinese Gem Pack: 28 Pokémon, seven cards each, every card a foil, and a cozy kitchen full art of Applin you can only pull here."
        cta={{
          heading: 'Shop Gem Vol 6',
          body: 'Booster boxes in stock now, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-6-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/gem-vol-6', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 6 came out in mainland China on August 7, 2026. Like every Gem Pack, it is an official Simplified Chinese
          Pokémon TCG product built for collecting: small 4-card packs where every card is a holo, and a set structure that gives each
          Pokémon its own run of seven cards. This volume has an orchard feel, with Applin on the pack, the whole apple family in the
          lineup, and a brand-new Applin full art as the headline card.
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
              <dd>Gem Pack Vol. 6 (宝石包 VOL.6), also called Gemstone Vol. 6</dd>
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
              <dt>Chase card</dt>
              <dd>Applin full art, 1907/07</dd>
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

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          foil finish. The seventh is a full art with its own illustration. Card numbers tell you exactly where you are: read 1907/07
          as Pokémon 19, version 07 of 7, so it is the full art of the nineteenth Pokémon in the set, which is Applin.
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

        <h2 id="applin">Applin, six holo versions</h2>
        <p>
          Applin's run shows the ladder clearly. Versions 01 to 06 share the same orchard illustration by Tetsu Kayama, with Applin
          tucked under a blossoming tree, and each one gets its own holo finish: Grass-type and Poké Ball patterns, glitter, starburst,
          the Master Ball pattern, and the pink Gem Pack logo stamp.
        </p>
        <div className="card-grid cols-3">
          {APPLIN_RUN.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Applin ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 6`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.id}/07</strong>
                {c.rarity} · {c.finish}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="applin-full-art">The chase: Applin full art</h2>
        <figure className="feature-card">
          <img src={cardImg('1907')} alt="Applin 1907/07 full art, Triple Rare, Gem Vol 6" loading="lazy" width={320} height={447} />
          <figcaption>
            <strong>1907/07</strong>
            Triple Rare · Full art · Illus. Jiro Sasumo
          </figcaption>
        </figure>
        <p>
          The full art is new artwork by Jiro Sasumo, drawn for this set. It is a sunny kitchen scene: jars of fruit drinks, a teapot,
          oranges and a fresh fruit tart on the table, and Applin sitting among the fruit like it belongs there. It is a fun one to
          study, because Applin blends right in.
        </p>
        <p>
          Because the illustration debuts here, Gem Vol 6 is the only place to pull it. It sits in the 07 slot, the rarest in every
          run, so plan on opening plenty of packs or picking it up as a single.
        </p>

        <h2 id="lineup">Apples, tea and the Loyal Three</h2>
        <p>
          There are no Trainer's Pokémon this time. Instead the lineup has a garden-and-kitchen feel: Applin and its whole family,
          Flapple, Appletun and Dipplin, plus Exeggcute, Castform in its Sunny Form, and Poltchageist the tea-cup Pokémon. The Loyal
          Three from Kitakami, Okidogi, Munkidori and Fezandipiti, close out the set. Pokémon China pitches the set as a treasure hunt,
          with each illustration telling a small story about its Pokémon, and revealed these six full arts alongside Applin:
        </p>
        <div className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 6`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/07 · Illus. {c.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The rest of the roster: Alolan Dugtrio, Persian, Ledian, Slakoth, Lairon, Meditite, Gulpin, Lileep, Kecleon, Mesprit,
          Reuniclus, Crabominable, Shiinotic, Bewear, Bruxish, Tapu Bulu, Clobbopus and Cufant. The{' '}
          <Link to="/sets/gem-vol-6">full card list</Link> shows all 196 cards.
        </p>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 18 packs of 4 holo cards, 72 cards in total. Pulls are random, so duplicates are normal and no specific Pokémon or
          finish is guaranteed.
        </p>
        <p>
          Going by the print shares above, a box averages roughly one or two full arts. That is an estimate, not a promise, and some
          boxes run hot or cold. With 196 cards in the set and 72 per box, finishing a master set takes several boxes or picking up
          singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 6 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Since Vol.
          4, every volume has used the same 196-card, 28 × 7 shape, and Vol. 7 followed three months after this one.
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
                <tr key={g.vol} className={g.vol === 6 ? 'is-current' : undefined}>
                  <th scope="row">
                    <Link to={`/sets/gem-vol-${g.vol}` as never}>Gem Pack Vol. {g.vol}</Link>
                  </th>
                  <td>{g.date}</td>
                  <td>{g.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Picking up the newest volume too? Our <Link to="/blogs/news/gem-vol-7-has-arrived">Gem Vol 7 guide</Link> covers Misty's
          Psyduck and the Trainer-paired lineup.
        </p>

        <h2 id="applin-binder">An Applin binder to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 6 binder the same day, pink with Applin on the cover. It holds one card
          per pocket, which suits a single Applin run or a page of favorite full arts.
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
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Gem Vol 6 is a warm, easygoing set. Every card is a holo, the packs are small enough to rip a few at a time, and the apple and
          kitchen art gives it a look no other volume has. If you only chase one card, make it the Applin full art. If you like
          completing runs, Applin's six holo versions are an easy place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
