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

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-hope-release-news')!

// Collect 151 is one 192-card list released four times (Journey, Hope,
// Surprise, Gathering). This post is the Hope release. Facts are from
// Pokémon China's announcement of March 16, 2025 (pokemon.cn) and our card list; Hope's own cards
// match the per-release Chen Cards pages behind /sets/chinese/collect-151-hope.
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Collect%20151/Cards/0${n}.webp`
const PACK = `${SITE_URL}/assets/sets/packs/collect-151-hope.webp`

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
  { n: '171', name: 'Pikachu', note: 'Art Rare · Oswaldo KATO', own: true },
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
  { n: '170', name: 'Pikachu', note: 'Journey · Art Rare' },
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
  { id: 'own-cards', label: "Hope's own card" },
  { id: 'packs', label: 'Pack sizes and boosted types' },
  { id: 'products', label: 'Products with Hope packs' },
  { id: 'chase', label: 'The top cards in every release' },
  { id: 'set', label: 'How the set is built' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Collect 151: Hope released?',
    a: 'April 18, 2025, in mainland China. It is a Simplified Chinese release, and the second of the four Collect 151 releases.',
  },
  {
    q: 'What is different about Collect 151: Hope?',
    a: 'The card list is the same as the other Collect 151 releases. Hope has its own Pikachu Art Rare, 171/151, and Pokémon China says its Poké Ball and Master Ball pattern holos favor Water, Dragon and Colorless Pokémon.',
  },
  {
    q: 'How many cards are in a Hope pack?',
    a: 'There are two sizes: 5 cards with 1 holo, and 20 cards with 7 holos.',
  },
  {
    q: 'What is in a Collect 151 Hope coin set?',
    a: 'A Poké Ball pattern holo of one Pokémon (1 in 100 is the Master Ball pattern), a coin of that Pokémon (1 in 100 is the hidden version) and three 5-card Hope packs. There are 139 versions, one for each Pokémon that is not an ex, plus 12 ex versions that add a 20-card pack.',
  },
  {
    q: 'Does Hope have a Special Art Rare of its own?',
    a: 'No. The three Special Art Rares are in Surprise (Alakazam ex and Mew ex) and Gathering (Zapdos ex).',
  },
]

export const Route = createFileRoute('/blog/collect-151-hope-release-news')({
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
  component: Collect151HopeReleasePost,
})

function Collect151HopeReleasePost() {
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
        lede="Collect 151: Hope released on April 18, 2025, the second of four Collect 151 releases. It has the same card list as Journey, Psyduck and Pikachu on the pack, a new Pikachu Art Rare, and more Water, Dragon and Colorless pattern holos."
        cta={{
          heading: 'Collect 151: Hope',
          body: 'See every card on the full card list, or read the set guide for all four releases.',
          links: [
            { to: '/sets/chinese/collect-151-hope', label: 'See the full card list' },
            { to: '/blog/collect-151-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Collect 151: Hope (<Zh>收集啦151 望</Zh>, set code 151C) released on April 18, 2025. Pokémon China announced it on March 16, 2025, two months after Journey. It is the second of four Collect 151 releases and has the same 192-card list: the 151 original Kanto Pokémon in Pokédex order, then 41 secret rares.
        </p>
        <p>
          Our <Link to="/blog/collect-151-set-guide">set guide</Link> compares all four releases and shows every secret rare, and
          our <Link to="/blog/collect-151-card-origins">card origins guide</Link> matches every card to its Japanese and English
          version. The other releases have posts too: <Link to="/blog/collect-151-journey-release-news">Journey</Link>, <Link to="/blog/collect-151-surprise-release-news">Surprise</Link> and <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>.
        </p>

        <aside className="fact-box" aria-label="Collect 151: Hope key facts">
          <img
            src={PACK}
            alt="Collect 151: Hope booster pack with Psyduck and Pikachu on the front"
            loading="lazy"
            width={405}
            height={760}
            style={{ background: 'transparent', boxShadow: 'none' }}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Release</dt>
              <dd>
                Collect 151: Hope (<Zh>收集啦151 望</Zh>), release 2 of 4
              </dd>
              <dt>Set code</dt>
              <dd>151C</dd>
              <dt>Released</dt>
              <dd>April 18, 2025</dd>
              <dt>Packs</dt>
              <dd>5 cards with 1 holo, or 20 cards with 7 holos</dd>
              <dt>Set size</dt>
              <dd>192 cards: 151 in the main set, 41 secret rares</dd>
              <dt>Its own cards</dt>
              <dd>Pikachu 171/151 (Art Rare)</dd>
              <dt>Boosted holo types</dt>
              <dd>Water, Dragon and Colorless</dd>
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
          Hope is the second release. Its pack shows Psyduck and Pikachu, with Jigglypuff, Eevee and Squirtle around them.
        </p>

        <h2 id="own-cards">Hope's own card</h2>
        <p>
          Hope's own card is Pikachu 171/151, an Art Rare by Oswaldo KATO, with Pikachu and Psyduck in a meadow. When it announced Hope, Pokémon China said more new Pikachu Art Rares would follow in later releases, and Surprise and Gathering each have one.
        </p>
        <Grid cards={OWN} cols={1} />
        <p>
          Our card lists mark each release's own cards with the Chinese Exclusive label, since you will only find them in that
          release. The other three Pikachu Art Rares are in the other releases:
        </p>
        <Grid cards={OTHER_PIKACHU} cols={3} />

        <h2 id="packs">Pack sizes and boosted types</h2>
        <p>
          Hope comes in two sizes: a 5-card pack with 1 holo and a 20-card pack with 7 holos. Pokémon China has not published an odds chart for Collect 151.
        </p>
        <h3>More Water, Dragon and Colorless pattern holos</h3>
        <p>
          Pokémon China says Water, Dragon and Colorless Pokémon turn up more often than other types among Hope's Poké Ball pattern and Master Ball pattern holos. If you collect those patterns for these types, Hope is the release to open.
        </p>

        <BuyStrip />

        <h2 id="products">Products with Hope packs</h2>
        <p>Pokémon China announced these products with Hope packs inside:</p>
        <ul>
          <li>
            <strong>Collect 151 coin sets: Hope (<Zh>收集啦151硬币套装 望</Zh>):</strong> 139 versions, one for each Pokémon in the set that is not an ex. Each has a Poké Ball pattern holo of its Pokémon (1 in 100 is the Master Ball pattern instead), a coin of the same Pokémon (1 in 100 is the hidden version), and three 5-card Hope packs.
          </li>
          <li>
            <strong>Collect 151 ex coin sets: Hope (<Zh>收集啦151硬币套装ex 望</Zh>):</strong> 12 versions, one for each Pokémon ex. Each has a holo of its Pokémon ex, a coin, three 5-card Hope packs and one 20-card Hope pack.
          </li>
          <li>
            <strong>Pokémon coin album: Collect 151 (<Zh>宝可梦硬币收藏册 收集啦151</Zh>):</strong> A PU leather album with Pikachu on the cover and 165 coin slots over 11 pages.
          </li>
        </ul>
        <p>
          Hope packs also come in products we have covered: the <Link to="/blog/journey-gift-boxes-release-news">Journey gift boxes</Link>, with three 20-card Hope packs in each box; the <Link to="/blog/collect-151-first-partner-display-sets-release-news">Collect 151 First Partner display sets</Link>, with one Journey, one Hope and one Surprise pack.
        </p>

        <h2 id="chase">The top cards in every release</h2>
        <p>
          These are part of the shared list, so they can come from Hope packs or any other Collect 151 release. The gold Mew ex
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
          The <Link to="/sets/chinese/collect-151-hope">Collect 151: Hope card list</Link> shows every card.
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
