import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'miracle-journey-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Miracle%20Journey%20CSV2/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/128, Miracle Journey`} loading="lazy" width={300} height={418} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/128 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const GARDEVOIR = [
  { n: '155', name: 'Gardevoir ex', note: 'SAR · Jiro Sasumo' },
  { n: '132', name: 'Ralts', note: 'Art Rare · Jiro Sasumo' },
  { n: '133', name: 'Kirlia', note: 'Art Rare · Jiro Sasumo' },
]

const STARTERS = [
  { n: '012', name: 'Meowscarada ex', note: 'Double Rare' },
  { n: '021', name: 'Skeledirge ex', note: 'Double Rare' },
  { n: '033', name: 'Quaquaval ex', note: 'Double Rare' },
]

const MORE_EX = [
  { n: '055', name: 'Gardevoir ex', note: 'Double Rare' },
  { n: '030', name: 'Greninja ex', note: 'Double Rare' },
  { n: '050', name: 'Miraidon ex', note: 'Double Rare' },
  { n: '081', name: 'Koraidon ex', note: 'Double Rare' },
]

const SARS = [
  { n: '152', name: 'Meowscarada ex', note: 'SAR · Kouki Saitou' },
  { n: '153', name: 'Skeledirge ex', note: 'SAR · kantaro' },
  { n: '154', name: 'Quaquaval ex', note: 'SAR · Souichirou Gunjima' },
  { n: '156', name: 'Squawkabilly ex', note: 'SAR · Amelicart' },
]

const SUPPORTERS = [
  { n: '157', name: "Erika's Invitation", note: 'SAR · Cona Nitanda' },
  { n: '158', name: 'Dendra', note: 'SAR · GIDORA' },
  { n: '159', name: 'Saguaro', note: 'SAR · Sanosuke Sakuma' },
]

const ULTRA_RARES = [
  { n: '160', name: 'Meowscarada ex', note: 'Ultra Rare' },
  { n: '161', name: 'Skeledirge ex', note: 'Ultra Rare' },
  { n: '162', name: 'Quaquaval ex', note: 'Ultra Rare' },
  { n: '163', name: 'Artazon', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '132', name: 'Ralts', note: 'Art Rare · Jiro Sasumo' },
  { n: '133', name: 'Kirlia', note: 'Art Rare · Jiro Sasumo' },
  { n: '129', name: 'Tropius', note: 'Art Rare · Jerky' },
  { n: '130', name: 'Pyroar', note: 'Art Rare · Po-Suzuki' },
  { n: '131', name: 'Bellibolt', note: 'Art Rare · KEIICHIRO ITO' },
  { n: '134', name: 'Paldean Tauros', note: 'Art Rare · Anesaki Dynamic' },
  { n: '135', name: 'Klawf', note: 'Art Rare · Mina Nakai' },
  { n: '136', name: 'Flamigo', note: 'Art Rare · Shibuzoh.' },
]

// Pokémon China's two odds charts, for the 5-card and the 20-card pack, in the
// bands they use. The per-pack average is the print share times the pack size.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', s5: '80.00%', p5: '4', s20: '70.00%', p20: '14' },
  { band: 'Poké Ball pattern holo and Rare', s5: '14.53%', p5: 'about 0.73', s20: '22.99%', p20: 'about 4.6' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', s5: '4.74%', p5: 'about 0.24', s20: '6.01%', p20: 'about 1.2' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', s5: '0.73%', p5: 'about 0.04', s20: '1.00%', p20: 'about 0.2' },
]

const TOC = [
  { id: 'gardevoir', label: 'Gardevoir ex and its Special Art Rare' },
  { id: 'starters', label: 'The Paldea starters as Pokémon ex' },
  { id: 'pokemon-ex', label: 'All 13 Pokémon ex' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'packs-and-odds', label: 'Packs and pull odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Miracle Journey released?',
    a: 'March 21, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What is in a Miracle Journey pack?',
    a: 'The 5-card pack has 4 non-holo cards and 1 holo. The 20-card pack has 14 non-holo cards and 6 holos.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of the 5-card print run, going by Pokémon China's print shares. That averages about one in every 27 packs. In the 20-card pack they make up 1.00%, about one in every five packs.",
  },
  {
    q: 'How many cards are in Miracle Journey?',
    a: '163 numbered cards: 128 in the main set and 35 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 393 different cards.',
  },
  {
    q: 'Where do the Miracle Journey illustrations come from?',
    a: 'From several English sets at once. Most of its cards match Paldea Evolved (80), Scarlet & Violet (43) and Obsidian Flames (26), and every card has an English version.',
    link: { to: '/sets/chinese/miracle-journey-csv2', before: 'See every card on the ', label: 'Miracle Journey card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/miracle-journey-release-news')({
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
  component: MiracleJourneyReleasePost,
})

function MiracleJourneyReleasePost() {
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
        lede="Gardevoir takes the cover of the second Chinese Scarlet & Violet set, and the final forms of the three Paldea starters arrive as Pokémon ex. The Gardevoir ex Special Art Rare leads its 35 secret rares."
        cta={{
          heading: 'Collect Miracle Journey',
          body: 'Browse all 163 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/miracle-journey-csv2', label: 'See the full card list' }],
        }}
      >
        <p>
          Miracle Journey (奇迹启程) released on March 21, 2025. It is the second main set of the Chinese Scarlet & Violet series, with
          Gardevoir on the pack and in the set as Gardevoir ex. Around it are Meowscarada ex, Skeledirge ex and Quaquaval ex, more
          Pokémon and Trainers from Paldea, and 35 secret rares.
        </p>

        <aside className="fact-box" aria-label="Miracle Journey key facts">
          <img src={cardImg('155')} alt="Gardevoir ex 155/128 Special Art Rare, Miracle Journey" loading="lazy" width={300} height={418} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Miracle Journey (奇迹启程)</dd>
              <dt>Set code</dt>
              <dd>CSV2C</dd>
              <dt>Released</dt>
              <dd>March 21, 2025</dd>
              <dt>5-card pack</dt>
              <dd>4 non-holo cards, 1 holo</dd>
              <dt>20-card pack</dt>
              <dd>14 non-holo cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>163 cards: 128 in the main set, 35 secret rares</dd>
              <dt>Cover Pokémon</dt>
              <dd>Gardevoir</dd>
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

        <h2 id="gardevoir">Gardevoir ex and its Special Art Rare</h2>
        <p>
          Gardevoir ex is a Stage 2 with 310 HP. Its Psychic Embrace Ability can be used "as often as you like during your turn":
          attach a Basic Psychic Energy card from your discard pile to one of your Psychic Pokémon, then put 2 damage counters on that
          Pokémon. Its Miracle Force attack does 190 damage.
        </p>
        <p>
          The lead chase card is the Special Art Rare, 155/128, by Jiro Sasumo. Gardevoir sits on a sofa holding balls of yarn while a
          woman knits beside it and a man with a camera sits at the coffee table. Jiro Sasumo also drew the Ralts and Kirlia Art
          Rares, and the three cards follow one household: Ralts watches a young woman unpack moving boxes, and Kirlia sits beside
          her as she holds a baby.
        </p>
        <Grid cards={GARDEVOIR} cols={3} />

        <h2 id="starters">The Paldea starters as Pokémon ex</h2>
        <p>
          The final forms of Sprigatito, Fuecoco and Quaxly arrive as Stage 2 Pokémon ex. Meowscarada ex has 310 HP, and its
          Scratching Nails attack does 100 damage plus 120 more if the opponent's Active Pokémon already has any damage counters on it.
          Skeledirge ex has 340 HP, and its Burning Voice attack does 270 damage for two Fire Energy, less 10 for each damage counter
          on Skeledirge ex. Quaquaval ex has 320 HP and does 230 with Spiral Shot.
        </p>
        <p>Each of the three has a Double Rare, a Super Rare, a Special Art Rare and a gold Ultra Rare.</p>
        <Grid cards={STARTERS} cols={3} />

        <h2 id="pokemon-ex">All 13 Pokémon ex</h2>
        <p>
          The main set has 13 Pokémon ex, all Double Rares. Beside Gardevoir ex and the three starters there are Greninja ex,
          Miraidon ex, Koraidon ex, Lycanroc ex, Paldean Clodsire ex, Mabosstiff ex, Copperajah ex, Squawkabilly ex and Grafaiai ex.
          Squawkabilly ex has the Squawk and Seize Ability: once during your first turn, you may discard your hand and draw 6 cards.
        </p>
        <Grid cards={MORE_EX} cols={4} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Eight Special Art Rares, 152 to 159: five Pokémon ex and three Supporters. Skeledirge ex walks down a shopping street
          beside a Trainer, and a green Squawkabilly ex perches on a tiled rooftop.
        </p>
        <Grid cards={SARS} cols={4} />
        <p>
          The three Supporters are Erika's Invitation, Dendra and Saguaro. Erika, in a yellow kimono, looks down at something cupped
          in her hands. Dendra grins beside a running tap, and Saguaro washes his hands at a kitchen sink with a Jigglypuff next to
          him.
        </p>
        <Grid cards={SUPPORTERS} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>Four gold cards top the set, 160 to 163: Meowscarada ex, Skeledirge ex, Quaquaval ex and the Artazon Stadium.</p>
        <Grid cards={ULTRA_RARES} cols={4} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Eight Art Rares, 129 to 136, give main-set Pokémon a full illustration. Beside Ralts and Kirlia, Bellibolt glows in a dark
          cave and a herd of Paldean Tauros stands under a low sun.
        </p>
        <Grid cards={ART_RARES} cols={4} />

        <h2 id="packs-and-odds">Packs and pull odds</h2>
        <p>
          Miracle Journey came in a 5-card pack with one holo and a 20-card pack with six holos. Pokémon China publishes an odds
          chart for each one. The charts give each rarity group's share of the print run, and multiplying a share by the pack size
          gives the average number of those cards per pack:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">5-card pack: share of print</th>
                <th scope="col">Per 5-card pack</th>
                <th scope="col">20-card pack: share of print</th>
                <th scope="col">Per 20-card pack</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.s5}</td>
                  <td>{o.p5}</td>
                  <td>{o.s20}</td>
                  <td>{o.p20}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the two official charts. Individual packs vary.</p>
        <p>
          In the top group that works out to about one Super Rare, Special Art Rare or Ultra Rare in every 27 of the 5-card packs, or
          one in every five of the 20-card packs.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings the full set to
          393 cards. Our <Link to="/blog/miracle-journey-set-guide">set guide</Link> has every chase card, and our{' '}
          <Link to="/blog/miracle-journey-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

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
          Miracle Journey is the set for Gardevoir and the Paldea starters. Jiro Sasumo's Ralts, Kirlia and Gardevoir ex are best
          seen side by side, so we would collect them as a trio.
        </p>
      </BlogPostLayout>
    </>
  )
}
