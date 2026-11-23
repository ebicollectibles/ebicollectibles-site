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

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-surprise-release-news')!

// Collect 151 is one 192-card list released four times (Journey, Hope,
// Surprise, Gathering). This post is the Surprise release. Facts are from
// Pokémon China's announcements of June 8 and September 2025 (pokemon.cn) and our card list; Surprise's own cards
// match the per-release Chen Cards pages behind /sets/chinese/collect-151-surprise.
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Collect%20151/Cards/0${n}.webp`
const PACK = `${SITE_URL}/assets/sets/packs/collect-151-surprise.webp`

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
  { n: '191', name: 'Mew ex', note: 'Special Art Rare · USGMEN', own: true },
  { n: '189', name: 'Alakazam ex', note: 'Special Art Rare · Shinya Komatsu', own: true },
  { n: '172', name: 'Pikachu', note: 'Art Rare · Oswaldo KATO', own: true },
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
  { n: '171', name: 'Pikachu', note: 'Hope · Art Rare' },
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
  { id: 'own-cards', label: "Surprise's own cards" },
  { id: 'packs', label: 'Pack sizes and boosted types' },
  { id: 'products', label: 'Products with Surprise packs' },
  { id: 'chase', label: 'The top cards in every release' },
  { id: 'set', label: 'How the set is built' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Collect 151: Surprise released?',
    a: 'July 18, 2025, in mainland China. It is a Simplified Chinese release, and the third of the four Collect 151 releases.',
  },
  {
    q: 'Which Collect 151 release has the Mew ex Special Art Rare?',
    a: 'Surprise. Mew ex 191/151 by USGMEN is a Surprise card, and so is the Alakazam ex Special Art Rare 189/151.',
  },
  {
    q: 'What cards are only in Collect 151: Surprise?',
    a: 'Three: Pikachu 172/151 (Art Rare), Alakazam ex 189/151 and Mew ex 191/151 (Special Art Rares).',
  },
  {
    q: 'How many cards are in a Surprise pack?',
    a: 'There are two sizes: 5 cards with 1 holo, and 20 cards with 7 holos.',
  },
  {
    q: 'Which types are boosted in Collect 151: Surprise?',
    a: 'Grass, Psychic and Darkness. Pokémon China says their Poké Ball and Master Ball pattern holos turn up more often than other types in Surprise.',
  },
]

export const Route = createFileRoute('/blog/collect-151-surprise-release-news')({
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
  component: Collect151SurpriseReleasePost,
})

function Collect151SurpriseReleasePost() {
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
        lede="Collect 151: Surprise released on July 18, 2025, the third of four Collect 151 releases. Gengar and Pikachu are on the pack, and it has three cards of its own: a Pikachu Art Rare and the Mew ex and Alakazam ex Special Art Rares."
        cta={{
          heading: 'Collect 151: Surprise',
          body: 'See every card on the full card list, or read the set guide for all four releases.',
          links: [
            { to: '/sets/chinese/collect-151-surprise', label: 'See the full card list' },
            { to: '/blog/collect-151-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Collect 151: Surprise (<Zh>收集啦151 惊</Zh>, set code 151C) released on July 18, 2025. Pokémon China announced it on June 8, 2025, together with Gathering. It is the third of four Collect 151 releases and has the same 192-card list as the others: the 151 original Kanto Pokémon in Pokédex order, then 41 secret rares.
        </p>
        <p>
          Our <Link to="/blog/collect-151-set-guide">set guide</Link> compares all four releases and shows every secret rare, and
          our <Link to="/blog/collect-151-card-origins">card origins guide</Link> matches every card to its Japanese and English
          version. The other releases have posts too: <Link to="/blog/collect-151-journey-release-news">Journey</Link>, <Link to="/blog/collect-151-hope-release-news">Hope</Link> and <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>.
        </p>

        <aside className="fact-box" aria-label="Collect 151: Surprise key facts">
          <img
            src={PACK}
            alt="Collect 151: Surprise booster pack with Gengar and Pikachu on the front"
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
                Collect 151: Surprise (<Zh>收集啦151 惊</Zh>), release 3 of 4
              </dd>
              <dt>Set code</dt>
              <dd>151C</dd>
              <dt>Released</dt>
              <dd>July 18, 2025</dd>
              <dt>Packs</dt>
              <dd>5 cards with 1 holo, or 20 cards with 7 holos</dd>
              <dt>Set size</dt>
              <dd>192 cards: 151 in the main set, 41 secret rares</dd>
              <dt>Its own cards</dt>
              <dd>Mew ex 191/151 (Special Art Rare), Alakazam ex 189/151 (Special Art Rare), Pikachu 172/151 (Art Rare)</dd>
              <dt>Boosted holo types</dt>
              <dd>Grass, Psychic and Darkness</dd>
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
          Surprise is the third release. Its pack shows Pikachu with Gengar, Gastly, Ekans and Parasect.
        </p>

        <h2 id="own-cards">Surprise's own cards</h2>
        <p>
          Surprise has more cards of its own than any other release. Pikachu 172/151 is an Art Rare by Oswaldo KATO. Pokémon China describes it as Gengar hiding behind the trees while Pikachu looks around, with Parasect in the distance and Ekans close by, all under a full moon. Surprise also has two of the set's three Special Art Rares: Mew ex 191/151 by USGMEN and Alakazam ex 189/151 by Shinya Komatsu. Mew ex 191 is the one most collectors want.
        </p>
        <Grid cards={OWN} cols={3} />
        <p>
          Our card lists mark each release's own cards with the Chinese Exclusive label, since you will only find them in that
          release. The Pikachu Art Rare is new art. The Special Art Rares use art first printed in Japan, which our card origins guide covers. The other three Pikachu Art Rares are in the other releases:
        </p>
        <Grid cards={OTHER_PIKACHU} cols={3} />

        <h2 id="packs">Pack sizes and boosted types</h2>
        <p>
          Surprise comes in two sizes: a 5-card pack with 1 holo and a 20-card pack with 7 holos. Pokémon China has not published an odds chart for Collect 151.
        </p>
        <h3>More Grass, Psychic and Darkness pattern holos</h3>
        <p>
          Pokémon China says Grass, Psychic and Darkness Pokémon turn up more often than other types among Surprise's Poké Ball pattern and Master Ball pattern holos. Those are the types of the four Pokémon on the cover with Pikachu: Gengar, Gastly, Ekans and Parasect.
        </p>

        <BuyStrip />

        <h2 id="products">Products with Surprise packs</h2>
        <p>Pokémon China announced these products with Surprise packs inside:</p>
        <ul>
          <li>
            <strong>Collect 151 coin sets: Surprise (<Zh>收集啦151硬币套装 惊</Zh>):</strong> 139 versions, one for each Pokémon that is not an ex. Each has a Poké Ball pattern holo of its Pokémon (sometimes the Master Ball pattern instead), a coin of the same Pokémon and three 5-card Surprise packs. The regular coins come in three colors, for Grass, Psychic and Darkness, plus one hidden version.
          </li>
          <li>
            <strong>Collect 151 ex coin sets: Surprise (<Zh>收集啦151硬币套装ex 惊</Zh>):</strong> 12 versions, one for each Pokémon ex. Each has a holo of its Pokémon ex, a coin, three 5-card Surprise packs and one 20-card Surprise pack.
          </li>
          <li>
            <strong>2025 Pokémon Mid-Autumn gift box (<Zh>2025宝可梦中秋礼盒</Zh>):</strong> Released September 12, 2025, with one 20-card Surprise pack, a Mid-Autumn plate set and a Mid-Autumn lamp.
          </li>
        </ul>
        <p>
          Surprise packs also come in products we have covered: the <Link to="/blog/collect-151-first-partner-display-sets-release-news">Collect 151 First Partner display sets</Link>, with one Journey, one Hope and one Surprise pack.
        </p>

        <h2 id="chase">The top cards in every release</h2>
        <p>
          These are part of the shared list, so they can come from Surprise packs or any other Collect 151 release. The gold Mew ex
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
          The <Link to="/sets/chinese/collect-151-surprise">Collect 151: Surprise card list</Link> shows every card.
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
