import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv2.json'

const post = BLOG_POSTS.find((p) => p.slug === 'miracle-journey-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 128), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/128`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Miracle Journey`} loading="lazy" width={300} height={418} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.number}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const BLOCKS = [
  { nos: '001 to 109', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '110 to 117', what: 'Items and Pokémon Tools', rarity: 'U' },
  { nos: '118 to 125', what: 'Supporters', rarity: 'U' },
  { nos: '126 to 128', what: 'Stadiums and Special Energy', rarity: 'U' },
  { nos: '129 to 136', what: 'Art Rares', rarity: 'AR' },
  { nos: '137 to 151', what: 'Super Rare full arts of ex and Supporters', rarity: 'SR' },
  { nos: '152 to 159', what: 'Special Art Rares of ex and Supporters', rarity: 'SAR' },
  { nos: '160 to 163', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// Pokémon China's two odds charts applied to one pack of each size. The
// average is the group's print share (in brackets) times the pack size.
const PACK = [
  { row: 'Cards', p5: '5', p20: '20' },
  { row: 'Holos', p5: '1', p20: '6' },
  { row: 'Common and Uncommon', p5: '4 (80.00%)', p20: '14 (70.00%)' },
  { row: 'Poké Ball pattern holo and Rare', p5: 'about 0.73 (14.53%)', p20: 'about 4.6 (22.99%)' },
  { row: 'Double Rare, Art Rare and Master Ball pattern holo', p5: 'about 0.24 (4.74%)', p20: 'about 1.2 (6.01%)' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', p5: 'about 0.04 (0.73%)', p20: 'about 0.2 (1.00%)' },
]

const LADDER_NAMES = ['Gardevoir ex', 'Meowscarada ex', 'Skeledirge ex', 'Quaquaval ex', 'Squawkabilly ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'pack', label: 'What a pack holds' },
  { id: 'gardevoir', label: 'The lead chase: Gardevoir ex' },
  { id: 'special-art-rares', label: 'All 8 Special Art Rares' },
  { id: 'super-rares', label: 'All 15 Super Rares' },
  { id: 'ultra-rares', label: 'All 4 Ultra Rares' },
  { id: 'art-rares', label: 'All 8 Art Rares' },
  { id: 'ladders', label: 'One Pokémon, several rarities' },
  { id: 'double-rares', label: 'All 13 Pokémon ex' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the chase cards in Miracle Journey?',
    a: "The Gardevoir ex Special Art Rare 155/128 leads the set. The other Special Art Rares are Meowscarada ex, Skeledirge ex, Quaquaval ex, Squawkabilly ex, Erika's Invitation, Dendra and Saguaro, and the four gold Ultra Rares are Meowscarada ex, Skeledirge ex, Quaquaval ex and Artazon.",
  },
  {
    q: 'How often does a pack hold a Super Rare or better?',
    a: "About one 5-card pack in 27, or one 20-card pack in five, going by Pokémon China's print shares. Super Rares, Special Art Rares and Ultra Rares make up 0.73% of the 5-card print run and 1.00% of the 20-card print run.",
  },
  {
    q: 'Which Pokémon ex have no secret rare?',
    a: 'Greninja ex, Miraidon ex, Koraidon ex, Mabosstiff ex and Grafaiai ex only appear as Double Rares.',
  },
  {
    q: 'How many cards are in a Miracle Journey master set?',
    a: '393: the 163 numbered cards plus a Poké Ball and a Master Ball pattern holo of each of the 115 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blog/miracle-journey-set-guide')({
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
  component: MiracleJourneySetGuide,
})

function MiracleJourneySetGuide() {
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
        lede="Miracle Journey has 35 secret rares behind a 128-card main set, and its 5-card and 20-card packs have different pull odds. This guide shows every chase card and how often you can expect to pull one."
        cta={{
          heading: 'Collect Miracle Journey',
          body: 'Browse all 163 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/miracle-journey-csv2', label: 'See the full card list' }],
        }}
      >
        <p>
          Miracle Journey (CSV2C) is the Gardevoir set: 163 cards, sold in 5-card and 20-card packs. Our{' '}
          <Link to="/blog/miracle-journey-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/miracle-journey-card-origins">card origins guide</Link> matches every card to English. Use this one to sort
          your pulls or plan a master set.
        </p>

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

        <h2 id="pack">What a pack holds</h2>
        <p>Pokémon China's odds charts for the 5-card and the 20-card pack, applied to one pack of each:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Per pack</th>
                <th scope="col">5-card pack</th>
                <th scope="col">20-card pack</th>
              </tr>
            </thead>
            <tbody>
              {PACK.map((b) => (
                <tr key={b.row}>
                  <th scope="row">{b.row}</th>
                  <td>{b.p5}</td>
                  <td>{b.p20}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official print shares, shown in brackets. They are not guarantees.</p>
        <p>
          The top band holds 27 different cards. It averages about one every 27 of the 5-card packs, or one every five of the 20-card
          packs. Card for card the 20-card pack is the richer one: 30% of its cards are holos, against 20% in the 5-card pack.
        </p>

        <h2 id="gardevoir">The lead chase: Gardevoir ex</h2>
        <p>
          Gardevoir is the cover Pokémon, and the Gardevoir ex Special Art Rare, 155/128, is the set's lead chase card. Gardevoir ex
          also has a Double Rare and a Super Rare.
        </p>
        <Gallery cards={['155', '055', '140'].map((n) => setData.cards.find((c) => c.number === `${n}/128`)!)} cols={3} />

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>152 to 159: five Pokémon ex and three Supporters.</p>
        <Gallery cards={lead(byRange(152, 159), ['155', '157', '152', '154'])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>Full arts of eight Pokémon ex and seven Supporters, 137 to 151.</p>
        <Gallery cards={lead(byRange(137, 151), ['140', '145', '137', '138', '139', '146'])} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>The gold cards, 160 to 163.</p>
        <Gallery cards={byRange(160, 163)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>129 to 136. Ralts and Kirlia share an illustrator, Jiro Sasumo, with the Gardevoir ex Special Art Rare.</p>
        <Gallery cards={lead(byRange(129, 136), ['132', '133'])} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>The Pokémon ex with a Special Art Rare, and every number they print at:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">RR</th>
                <th scope="col">SR</th>
                <th scope="col">SAR</th>
                <th scope="col">UR</th>
              </tr>
            </thead>
            <tbody>
              {LADDER.map((l) => (
                <tr key={l.name}>
                  <th scope="row">{l.name}</th>
                  {l.nos.map((n, i) => (
                    <td key={i}>{n}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Lycanroc ex, Paldean Clodsire ex and Copperajah ex also have Super Rares (141, 142 and 143). Erika's Invitation, Dendra and
          Saguaro each have an Uncommon, a Super Rare and a Special Art Rare. Katy, Clavell, Judge and Team Star Grunt each have an
          Uncommon and a Super Rare.
        </p>

        <h2 id="double-rares">All 13 Pokémon ex</h2>
        <p>The Double Rares from the main set. Meowscarada ex, Skeledirge ex and Quaquaval ex are the final forms of the Paldea starters.</p>
        <Gallery cards={lead(setData.cards.filter((c) => c.rarity === 'Double Rare (RR)'), ['055', '012', '021', '033', '030', '050', '081'])} cols={4} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 128. The main set runs 001 to 128, and everything above is a secret rare. The rarer versions
          of a card sit in the secret block at unrelated numbers, so match them by name.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Numbers</th>
                <th scope="col">What they are</th>
                <th scope="col">Rarity</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((b) => (
                <tr key={b.nos}>
                  <th scope="row">{b.nos}</th>
                  <td>{b.what}</td>
                  <td>{b.rarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 163 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 115 Commons, Uncommons
          and Rares, for 393 in total.
        </p>
        <p>
          With one holo per 5-card pack and six per 20-card pack, the Master Ball holos and the 27 top-band cards take a long time to pull. Most collectors open
          packs for fun and the lower rarities, then buy the big cards as singles. The{' '}
          <Link to="/sets/chinese/miracle-journey-csv2">Miracle Journey card list</Link> lets you tick off what you have.
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
