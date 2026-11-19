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

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-5-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%205/Cards/${id}.webp`

// Floragato's six holo versions, in collector-number order. All share one
// illustration by Felicia Chen and differ only in rarity and holo pattern.
const FLORAGATO_RUN = [
  { id: '2201', rarity: 'Common', finish: 'Grass-type pattern holo' },
  { id: '2202', rarity: 'Common', finish: 'Poké Ball pattern holo' },
  { id: '2203', rarity: 'Uncommon', finish: 'Glitter holo' },
  { id: '2204', rarity: 'Uncommon', finish: 'Starburst holo' },
  { id: '2205', rarity: 'Rare', finish: 'Master Ball pattern holo' },
  { id: '2206', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
]

// The four Pokémon Horizons full arts drawn for this set.
const HORIZONS_FULL_ARTS = [
  { id: '0107', name: 'Captain Pikachu', with: 'Friede', illus: 'Keita Hagiwara' },
  { id: '2207', name: 'Floragato', with: 'Liko', illus: 'Lyu YiFei' },
  { id: '2307', name: 'Crocalor', with: 'Roy', illus: 'Kouki Yanagihara' },
  { id: '2407', name: 'Quaxwell', with: 'Dot', illus: 'Rei Yamazaki' },
]

// The other full arts Pokémon China showed in its announcement, with the
// illustrator printed on each card.
const REVEALED_FULL_ARTS = [
  { id: '0207', name: 'Hisuian Growlithe', illus: 'GIDORA' },
  { id: '2807', name: 'Tatsugiri', illus: 'osare' },
  { id: '1807', name: 'Vivillon', illus: 'REND' },
  { id: '1207', name: 'Spheal', illus: 'miki kudo' },
  { id: '1107', name: 'Chimecho', illus: 'REND' },
  { id: '0307', name: 'Magneton', illus: 'Shinji Kanda' },
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
  { id: 'horizons-full-arts', label: 'Chinese Exclusives: four Horizons full arts' },
  { id: 'lineup', label: 'The rest of the lineup' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'floragato', label: 'Floragato, six holo versions' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'binders', label: 'The four binders' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
  { vol: 5, date: 'April 24, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 5 released?',
    a: 'April 24, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Is Gem 5 the same as "Gemstone Vol. 5"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB5C.',
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
    q: 'What are the Chinese Exclusives in Gem Vol 5?',
    a: 'The four Pokémon Horizons full arts drawn for this set: Captain Pikachu 0107/07 with Friede by Keita Hagiwara, Floragato 2207/07 by Lyu YiFei, Crocalor 2307/07 by Kouki Yanagihara and Quaxwell 2407/07 by Rei Yamazaki. Captain Pikachu is the main chase. Beyond those, collectors chase the rest of the 28 full arts (every card numbered 07).',
  },
  {
    q: 'What are the odds of pulling a full art?',
    a: "Full arts make up 1.81% of the print run, going by Pokémon China's print shares. With 72 cards in a box, that averages about 1.3 full arts per box, or roughly one in every 14 packs.",
  },
  {
    q: 'Where do the Gem 5 illustrations come from?',
    a: 'Mostly from English cards. 51 of the 56 illustrations are the same art you will find on English Scarlet & Violet cards, mostly from Surging Sparks.',
    link: { to: '/sets/chinese/gem-vol-5', before: 'See every card on the ', label: 'Gem Vol 5 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-5-release-news')({
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
  component: GemVol5Post,
})

function GemVol5Post() {
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
        lede="The fifth Simplified Chinese Gem Pack brings Pokémon Horizons to the line: 28 Pokémon, seven cards each, every card a holo, and four Chinese Exclusive full arts starring Friede, Liko, Roy and Dot."
        cta={{
          heading: 'Shop Gem Vol 5',
          body: 'Booster boxes, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-5-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-5', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 5 (Gem 5, set code CBB5C) lands in mainland China on April 24, 2026. Like every Gem Pack, it is an official Simplified Chinese Pokémon
          TCG product built for collecting: small 4-card packs where every card is a holo, and a set structure that gives each Pokémon
          its own run of seven cards. This volume sets sail with Pokémon Horizons, with Floragato on the pack and four new full arts of
          the Rising Volt Tacklers and their partners.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 5 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-5-booster-pack.webp`}
            alt="Gem Pack Vol. 5 booster pack with Floragato on the front"
            loading="lazy"
            width={600}
            height={1092}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 5 (<Zh>宝石包 VOL.5</Zh>), also called Gemstone Vol. 5</dd>
              <dt>Set code</dt>
              <dd>CBB5C</dd>
              <dt>Released</dt>
              <dd>April 24, 2026, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>18 packs, 72 cards</dd>
              <dt>Set size</dt>
              <dd>196 cards: 28 Pokémon × 7 versions</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Four Pokémon Horizons full arts: Captain Pikachu 0107/07 by Keita Hagiwara, Floragato 2207/07, Crocalor 2307/07 and Quaxwell 2407/07</dd>
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

        <h2 id="horizons-full-arts">Chinese Exclusives: four Horizons full arts</h2>
        <p>
          Gem Vol 5 has four Chinese Exclusive full arts, drawn for this set, each pairing a Pokémon with a member of the Rising Volt Tacklers from
          the Pokémon Horizons anime. Captain Pikachu rides the deck of the Brave Asagi with Friede, while Floragato, Crocalor and
          Quaxwell share a meal with Liko, Roy and Dot. Each one carries a small Pokémon Horizons logo.
        </p>
        <ul className="card-grid cols-2">
          {HORIZONS_FULL_ARTS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} with ${c.with}, full art ${c.id}/07, Gem Vol 5`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <ChineseExclusiveBadge />
                  <strong>
                    {c.name} with {c.with}
                  </strong>
                  {c.id}/07 · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          Because the art debuts here, Gem Vol 5 is the only place to pull these four. Each sits in the 07 slot, the rarest in every
          run, so plan on opening plenty of packs or picking them up as singles. Captain Pikachu is the one most collectors go after
          first.
        </p>

        <h2 id="lineup">The rest of the lineup</h2>
        <p>
          Apart from the Horizons cards, none of the Pokémon belong to a Trainer. The lineup mixes fan favorites like Latios, Ceruledge and Hisuian
          Growlithe with Paldea picks such as Tatsugiri, Cetitan and Wattrel. Pokémon China revealed these full arts alongside the
          Horizons four:
        </p>
        <ul className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 5`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.id}/07 · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          The rest of the roster: Chansey, Horsea, Sunflora, Skarmory, Houndoom, Phanpy, Vibrava, Timburr, Joltik, Stunfisk, Braviary,
          Raboot, Applin and Milcery. The <Link to="/sets/chinese/gem-vol-5">full card list</Link> shows all 196 cards.
        </p>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          holo pattern. The seventh is a full art with its own illustration. Card numbers tell you exactly where you are: read 2207/07
          as Pokémon 22, version 07 of 7, so it is the full art of the twenty-second Pokémon in the set, which is Floragato.
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

        <h2 id="floragato">Floragato, six holo versions</h2>
        <p>
          Floragato shows how a run works. Versions 01 to 06 share the same illustration by Felicia Chen, with Floragato swinging its flower bud among scattered petals. Only the holo
          changes: Grass-type and Poké Ball patterns, glitter, starburst, the
          Master Ball pattern, and the pink Gem Pack logo stamp.
        </p>
        <ul className="card-grid cols-3">
          {FLORAGATO_RUN.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`Floragato ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 5`} loading="lazy" width={300} height={419} />
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
          Going by the print shares above, a box averages one or two full arts, though some boxes run hot and some run cold. With 196
          cards in the set and 72 per box, finishing a master set takes several boxes or picking up singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 5 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Since Vol.
          4, every volume has used the same 196-card, 28 × 7 shape.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Where Vol. 5 fits in the Gem Pack line</caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 5 ? 'is-current' : undefined}>
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
          <Link to="/blog/gem-vol-5-set-guide">Gem Vol 5 set guide</Link>.
        </p>

        <h2 id="binders">Four binders to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 5 binder the same day, in four cover designs: Pikachu, Floragato,
          Crocalor and Quaxwell. Each binder holds 30 cards, one per page, which is
          enough for your favorite pulls, like a Horizons full art and its run.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-5-binders.webp`}
          alt="The four official Gem Pack Vol. 5 card binders, with Pikachu, Floragato, Crocalor and Quaxwell covers"
          loading="lazy"
          width={1600}
          height={447}
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
          Gem Vol 5 is the one for Pokémon Horizons fans. Every card is a holo, the packs are small enough to rip a few at a time, and
          the four Horizons full arts give it chase cards no other volume has. If you only chase one card, make it Captain Pikachu with
          Friede. If you like completing runs, Floragato's six holo versions are an easy place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
