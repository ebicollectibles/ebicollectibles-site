import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-journey-release-news')!

// Collect 151 is one 192-card list released four times (Journey, Hope,
// Surprise, Gathering). This post is the Journey release. Facts are from
// Pokémon China's announcement of December 22, 2024 (pokemon.cn) and our card list; Journey's own cards
// match the per-release Chen Cards pages behind /sets/chinese/collect-151-journey.
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Collect%20151/Cards/0${n}.webp`
const PACK = `${SITE_URL}/assets/sets/packs/collect-151-journey.webp`

type Shown = { n: string; name: string; note: string; own?: boolean }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/151, Collect 151`} loading="lazy" width={300} height={418} />
            <figcaption>
              {c.own && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/151 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

// This release's own cards.
const OWN: Shown[] = [
  { n: '170', name: 'Pikachu', note: 'Art Rare · Oswaldo KATO', own: true },
]

// The top of the shared list, in every release.
const SHARED: Shown[] = [
  { n: '192', name: 'Mew ex', note: 'Ultra Rare · aky CG Works' },
  { n: '175', name: 'Charizard ex', note: 'Super Rare · PLANETA Mochizuki' },
  { n: '185', name: 'Mew ex', note: 'Super Rare · aky CG Works' },
  { n: '188', name: 'Mew ex', note: 'Shiny Super Rare · aky CG Works' },
]

// The other Pikachu Art Rares, one in each of the other releases.
const OTHER_PIKACHU: Shown[] = [
  { n: '171', name: 'Pikachu', note: 'Hope · Art Rare' },
  { n: '172', name: 'Pikachu', note: 'Surprise · Art Rare' },
  { n: '173', name: 'Pikachu', note: 'Gathering · Art Rare' },
]

const BLOCKS = [
  { nos: '001 to 151', what: 'The 151 Kanto Pokémon, in Pokédex order', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '152 to 169', what: 'Shiny versions of 18 main-set Pokémon', rarity: 'Shiny' },
  { nos: '170 to 173', what: 'Pikachu, one per release', rarity: 'Art Rare' },
  { nos: '174 to 185', what: 'Full arts of the 12 Pokémon ex', rarity: 'Super Rare' },
  { nos: '186 to 188', what: 'Shiny full arts of Wigglytuff ex, Alakazam ex and Mew ex', rarity: 'Shiny Super Rare' },
  { nos: '189 to 191', what: 'Alakazam ex and Mew ex (Surprise), Zapdos ex (Gathering)', rarity: 'Special Art Rare' },
  { nos: '192', what: 'Gold Mew ex', rarity: 'Ultra Rare' },
]

const TOC = [
  { id: 'what-it-is', label: 'One set, four releases' },
  { id: 'own-cards', label: "Journey's own card" },
  { id: 'packs', label: 'Pack size' },
  { id: 'products', label: 'Products with Journey packs' },
  { id: 'chase', label: 'The top cards in every release' },
  { id: 'set', label: 'How the set is built' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Collect 151: Journey released?',
    a: 'January 17, 2025, in mainland China. It is a Simplified Chinese release, and the first of the four Collect 151 releases.',
  },
  {
    q: 'Is Collect 151: Journey a different set from Hope, Surprise and Gathering?',
    a: 'No. All four are releases of one set, Collect 151 (set code 151C), with the same 192-card list. Each release has its own pack art and its own Pikachu Art Rare. Journey\'s is 170/151.',
  },
  {
    q: 'Is Collect 151: Journey the same as Miracle Journey?',
    a: 'No. Collect 151: Journey is 收集啦151 旅. Miracle Journey is a different set, 奇迹启程, with set code CSV2C.',
  },
  {
    q: 'Does Journey have a Special Art Rare of its own?',
    a: 'No. The three Special Art Rares are in the later releases: Alakazam ex and Mew ex in Surprise, and Zapdos ex in Gathering.',
  },
  {
    q: 'How many cards are in a Journey pack?',
    a: '5. Every Journey product Pokémon China announced uses the 5-card pack.',
  },
]

export const Route = createFileRoute('/blog/collect-151-journey-release-news')({
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
  component: Collect151JourneyReleasePost,
})

function Collect151JourneyReleasePost() {
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
        lede="Collect 151: Journey released on January 17, 2025, the first of four Collect 151 releases. It brings the 151 original Kanto Pokémon to Simplified Chinese in Pokédex order, with Pikachu on the pack and a Pikachu Art Rare of its own."
        cta={{
          heading: 'Collect 151: Journey',
          body: 'See every card on the full card list, or read the set guide for all four releases.',
          links: [
            { to: '/sets/chinese/collect-151-journey', label: 'See the full card list' },
            { to: '/blog/collect-151-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Collect 151: Journey (<Zh>收集啦151 旅</Zh>, set code 151C) released on January 17, 2025. It was the first of four Collect 151 releases from Pokémon China, followed by Hope, Surprise and Gathering. Its main set is the 151 original Kanto Pokémon in Pokédex order, from Bulbasaur 001 to Mew ex 151, with no Trainer or Energy cards.
        </p>
        <p>
          Our <Link to="/blog/collect-151-set-guide">set guide</Link> compares all four releases and shows every secret rare, and
          our <Link to="/blog/collect-151-card-origins">card origins guide</Link> matches every card to its Japanese and English
          version. The other releases have posts too: <Link to="/blog/collect-151-hope-release-news">Hope</Link>, <Link to="/blog/collect-151-surprise-release-news">Surprise</Link> and <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>.
        </p>

        <aside className="fact-box" aria-label="Collect 151: Journey key facts">
          <img
            src={PACK}
            alt="Collect 151: Journey booster pack with Pikachu on the front"
            loading="lazy"
            width={352}
            height={654}
            style={{ background: 'transparent', boxShadow: 'none' }}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Release</dt>
              <dd>
                Collect 151: Journey (<Zh>收集啦151 旅</Zh>), release 1 of 4
              </dd>
              <dt>Set code</dt>
              <dd>151C</dd>
              <dt>Released</dt>
              <dd>January 17, 2025</dd>
              <dt>Packs</dt>
              <dd>5 cards</dd>
              <dt>Set size</dt>
              <dd>192 cards: 151 in the main set, 41 secret rares</dd>
              <dt>Its own cards</dt>
              <dd>Pikachu 170/151 (Art Rare)</dd>
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

        <h2 id="what-it-is">One set, four releases</h2>
        <p>
          Collect 151 is one set that Pokémon China released in four parts: Journey in January 2025, Hope in April, Surprise in July
          and Gathering in October. All four use the same 192-card list, so the main set, the Shiny cards, the Super Rares and the
          gold Mew ex can come from any of them. What changes is the pack art, a few cards found in only one release, and which types
          of Poké Ball and Master Ball pattern holos turn up more often.
        </p>
        <p>
          Journey is the first release. Its pack shows Pikachu, with Mew and Oddish in the background.
        </p>

        <h2 id="own-cards">Journey's own card</h2>
        <p>
          Journey's own card is Pikachu 170/151, an Art Rare by Oswaldo KATO. It shows Pikachu running through a meadow with Mew in the sky behind it, much like the pack. Each later release has a different Pikachu Art Rare by the same artist, numbered 171 to 173.
        </p>
        <Grid cards={OWN} cols={1} />
        <p>
          Our card lists mark each release's own cards with the Chinese Exclusive label, since you will only find them in that
          release. The other three Pikachu Art Rares are in the other releases:
        </p>
        <Grid cards={OTHER_PIKACHU} cols={3} />

        <h2 id="packs">Pack size</h2>
        <p>
          Journey came in 5-card packs. That is the pack in every Journey product Pokémon China announced, from the fridge magnet set to the gift boxes below. Pokémon China has not published an odds chart for Collect 151.
        </p>
        <p>
          The later releases each favor three types among their Poké Ball and Master Ball pattern holos. We have not found an
          announcement that names boosted types for Journey.
        </p>

        <BuyStrip />

        <h2 id="products">Products with Journey packs</h2>
        <p>Pokémon China announced these products with Journey packs inside:</p>
        <ul>
          <li>
            <strong>Collect 151 puzzle fridge magnet set (<Zh>收集啦151拼图冰箱贴套装</Zh>):</strong> One random metal fridge magnet of a Pokémon from 001 to 151, with one hidden version, plus a 5-card Journey pack. The magnets fit together like puzzle pieces.
          </li>
          <li>
            <strong>Collect 151 New Year gift box (<Zh>收集啦151宝可梦新春礼盒</Zh>):</strong> Two 5-card Journey packs, a fridge magnet set, a pair of Pokémon New Year couplets and a paper New Year decoration.
          </li>
          <li>
            <strong>Collect 151 plush deck box sets (<Zh>收集啦151毛绒卡组收纳盒套装</Zh>):</strong> A Pikachu or Eevee plush deck box with a 5-card Journey pack.
          </li>
        </ul>
        <p>
          Journey packs also come in products we have covered: the <Link to="/blog/dream-painting-151-vol-1-release-news">Collect 151 Dream Painting figure set</Link>, with two Journey packs in every box; the <Link to="/blog/collect-151-first-partner-display-sets-release-news">Collect 151 First Partner display sets</Link>, with one Journey, one Hope and one Surprise pack.
        </p>

        <h2 id="chase">The top cards in every release</h2>
        <p>
          These are part of the shared list, so they can come from Journey packs or any other Collect 151 release. The gold Mew ex
          192/151 is the top card of the set, and Charizard ex comes as a Super Rare full art.
        </p>
        <Grid cards={SHARED} cols={4} />

        <h2 id="set">How the set is built</h2>
        <p>
          Every card has one number out of 151. For the main set, the number is the Pokédex number, so Bulbasaur is 001 and Mew ex is
          151. There are no Trainer or Energy cards. The main set has 63 Commons, 51 Uncommons, 25 Rares and 12 Double Rare ex, and
          everything above 151 is a secret rare.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">How Collect 151 is numbered</caption>
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
        <p>
          The <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey card list</Link> shows every card.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
