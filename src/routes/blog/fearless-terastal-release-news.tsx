import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'fearless-terastal-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Fearless%20Terastal%20CSV3/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The one Chinese Exclusive: the Arcanine ex Special Art Rare 155.
const EXCLUSIVE = new Set(['155'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/130, Fearless Terastal`} loading="lazy" width={300} height={418} />
            <figcaption>
              {EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/130 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const ARCANINE = [
  { n: '155', name: 'Arcanine ex', note: 'Special Art Rare · Gemi' },
  { n: '018', name: 'Arcanine ex', note: 'Double Rare · 5ban Graphics' },
  { n: '141', name: 'Arcanine ex', note: 'Super Rare · 5ban Graphics' },
]

const TERA = [
  { n: '018', name: 'Arcanine ex', note: 'Double Rare · 5ban Graphics' },
  { n: '005', name: 'Forretress ex', note: 'Double Rare · 5ban Graphics' },
  { n: '033', name: 'Gyarados ex', note: 'Double Rare · 5ban Graphics' },
]

const TREASURES = [
  { n: '154', name: 'Wo-Chien ex', note: 'Special Art Rare · takuyoa' },
  { n: '156', name: 'Chi-Yu ex', note: 'Special Art Rare · AKIRA EGAWA' },
  { n: '157', name: 'Chien-Pao ex', note: 'Special Art Rare · kodama' },
  { n: '158', name: 'Ting-Lu ex', note: 'Special Art Rare · KEIICHIRO ITO' },
]

const SUPPORTERS = [
  { n: '160', name: 'Iono', note: 'Special Art Rare · kirisAki' },
  { n: '159', name: 'Grusha', note: 'Special Art Rare · DOM' },
  { n: '161', name: 'Giacomo', note: 'Special Art Rare · KIYOTAKA OSHIYAMA' },
]

const ULTRA_RARES = [
  { n: '162', name: 'Chien-Pao ex', note: 'Ultra Rare · aky CG Works' },
  { n: '163', name: 'Ting-Lu ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '164', name: 'Superior Energy Retrieval', note: 'Ultra Rare · Studio Bora Inc.' },
  { n: '165', name: 'Reversal Energy', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '131', name: 'Frigibax', note: 'Art Rare · Tomokazu Komiya' },
  { n: '132', name: 'Arctibax', note: 'Art Rare · Tomokazu Komiya' },
  { n: '133', name: 'Baxcalibur', note: 'Art Rare · Tomokazu Komiya' },
  { n: '134', name: 'Sandygast', note: 'Art Rare · Teeziro' },
  { n: '135', name: 'Mabosstiff', note: 'Art Rare · OKACHEKE' },
  { n: '136', name: 'Orthworm', note: 'Art Rare · OKACHEKE' },
  { n: '137', name: 'Farigiraf', note: 'Art Rare · Mina Nakai' },
  { n: '138', name: 'Dudunsparce', note: 'Art Rare · Saya Tsuruta' },
]

// Pokémon China's two odds charts, for the 5-card and the 20-card pack, in the
// rarity groups they use. The per-pack average is the print share times the pack size.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', s5: '80.00%', p5: '4', s20: '70.00%', p20: '14' },
  { band: 'Poké Ball pattern holo and Rare', s5: '14.53%', p5: 'about 0.73', s20: '22.99%', p20: 'about 4.6' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', s5: '4.74%', p5: 'about 0.24', s20: '6.01%', p20: 'about 1.2' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', s5: '0.73%', p5: 'about 0.04', s20: '1.00%', p20: 'about 0.2' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'exclusive', label: 'Arcanine ex and its Chinese Exclusive' },
  { id: 'tera', label: 'Tera Pokémon ex' },
  { id: 'treasures', label: 'The four Treasures of Ruin' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'packs-and-odds', label: 'Pull odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Fearless Terastal released?',
    a: 'May 16, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Who is on the Fearless Terastal pack?',
    a: 'Tera Arcanine. Arcanine ex comes as a Double Rare, a Super Rare and a Special Art Rare. The Special Art Rare by Gemi is the set\'s Chinese Exclusive.',
  },
  {
    q: 'What is the Chinese Exclusive in Fearless Terastal?',
    a: 'The Arcanine ex Special Art Rare 155/130, illustrated by Gemi. English has Tera Arcanine ex as a Double Rare and a full art, but this illustration does not exist in English.',
  },
  {
    q: 'What is the difference between the slim and jumbo Fearless Terastal packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo rarity group.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about one in every 27 slim packs, or one in every 5 jumbo packs.",
  },
  {
    q: 'Where do the Fearless Terastal illustrations come from?',
    a: 'Mostly from three English sets. Paldea Evolved matches 96 of its 165 cards, Obsidian Flames matches 34 and Scarlet & Violet matches 22. The other 12 come from three English sources, and one card, the Arcanine ex Special Art Rare, does not exist in English.',
    link: { to: '/sets/chinese/fearless-terastal-csv3', before: 'See every card on the ', label: 'Fearless Terastal card list', after: '.' },
  },
  {
    q: 'How many cards are in Fearless Terastal?',
    a: '165 numbered cards: 130 in the main set and 35 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 397 different cards.',
  },
]

export const Route = createFileRoute('/blog/fearless-terastal-release-news')({
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
  component: FearlessTerastalReleasePost,
})

function FearlessTerastalReleasePost() {
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
        lede="Tera Arcanine ex takes the cover of the third Chinese Scarlet & Violet set, and the four Treasures of Ruin arrive as Pokémon ex. It also brings one Chinese Exclusive: an Arcanine ex Special Art Rare."
        cta={{
          heading: 'Collect Fearless Terastal',
          body: 'Browse all 165 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/fearless-terastal-csv3', label: 'See the full card list' }],
        }}
      >
        <p>
          Fearless Terastal (<Zh>无畏太晶</Zh>, set code CSV3C) released on May 16, 2025. It is the third main set of the Chinese Scarlet & Violet series, and it
          introduces Terastallized Pokémon as Tera Pokémon ex, with a crystal Arcanine on the pack. Around it are the
          four legendary Treasures of Ruin, a cast of Paldea Pokémon and Trainers, and one Chinese Exclusive that does not exist in English.
        </p>
        <p>
          Our <Link to="/blog/fearless-terastal-set-guide">set guide</Link> shows every secret rare and the pull odds, and our{' '}
          <Link to="/blog/fearless-terastal-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <aside className="fact-box" aria-label="Fearless Terastal key facts">
          <img src={cardImg('155')} alt="Arcanine ex 155/130 Special Art Rare, Fearless Terastal" loading="lazy" width={300} height={418} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Fearless Terastal (<Zh>无畏太晶</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV3C</dd>
              <dt>Released</dt>
              <dd>May 16, 2025</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>165 cards: 130 in the main set, 35 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>The Special Art Rares of Arcanine ex, the four Treasures of Ruin and Iono</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Arcanine ex Special Art Rare 155/130</dd>
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

        <h2 id="slim-or-jumbo">Slim or jumbo?</h2>
        <p>
          Fearless Terastal comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is
          20 cards with six holos. Pokémon China published an odds chart for each, and the jumbo pack is better at every holo level.
          Super Rares, Special Art Rares and Ultra Rares are 1.00% of jumbo cards against 0.73% of slim cards. That works out to about
          one of those cards every 5 jumbo packs, against one every 27 slim packs.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${BLOG_SITE_URL}/assets/blog/fearless-terastal-slim-pack.webp`} alt="Fearless Terastal slim pack, 5 cards" loading="lazy" width={600} height={1127} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${BLOG_SITE_URL}/assets/blog/fearless-terastal-jumbo-pack.webp`} alt="Fearless Terastal jumbo pack, 20 cards" loading="lazy" width={600} height={1196} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The full numbers are in <a href="#packs-and-odds">Pull odds</a> below.
        </p>

        <h2 id="exclusive">Arcanine ex and its Chinese Exclusive</h2>
        <p>
          Tera Arcanine is the pack Pokémon. Arcanine ex comes at three rarities, and the Special Art Rare, 155/130, illustrated by Gemi,
          is the one card in the set that does not exist in English. It shows the Terastallized Arcanine with its head up and its mouth
          open, its body cut like crystal, with a red Tera Jewel crown on its head and dark tree trunks behind it. The Double Rare and
          Super Rare match English cards, so the Special Art Rare is the set's one Chinese Exclusive.
        </p>
        <Grid cards={ARCANINE} cols={3} />

        <h2 id="tera">Tera Pokémon ex</h2>
        <p>
          Tera Pokémon ex have the word Tera printed under their HP, and they take no damage from attacks while they sit on the Bench.
          Fearless Terastal has three. Arcanine ex has 280 HP and hits for 250 with three Fire Energy. Forretress ex can Knock itself Out
          to attach up to five Basic Grass Energy from the deck to your Pokémon. Gyarados ex has 300 HP, and its Tyrannical Tail attack can reach 360 damage.
        </p>
        <Grid cards={TERA} cols={3} />

        <h2 id="treasures">The four Treasures of Ruin</h2>
        <p>
          Wo-Chien, Chi-Yu, Chien-Pao and Ting-Lu, the four legendary Pokémon tied to Paldea's old tale of ruin, all arrive as Pokémon
          ex. Each one has a Double Rare, a Super Rare and a Special Art Rare, and Chien-Pao ex and Ting-Lu ex also have a gold Ultra
          Rare. The Special Art Rares place each one in its own scene: Wo-Chien ex in a green forest of tangled roots, Chi-Yu ex under
          beams of red and gold light, Chien-Pao ex inside a swirl of snow, and Ting-Lu ex standing on cracked, snowy ground.
        </p>
        <Grid cards={TREASURES} cols={4} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          There are eight Special Art Rares, numbered 154 to 161: five Pokémon ex and three Supporters. The five Pokémon ex, the
          Chinese Exclusive Arcanine ex and the four Treasures of Ruin, are shown above. Iono holds up a plate of pancakes and a cup of
          ice cream, Grusha is seen through a window behind snow-covered branches, and Giacomo stands behind a set of DJ decks.
        </p>
        <Grid cards={SUPPORTERS} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold cards top the set, numbered 162 to 165: Chien-Pao ex, Ting-Lu ex, Superior Energy Retrieval and Reversal Energy.
        </p>
        <Grid cards={ULTRA_RARES} cols={4} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Eight Art Rares, numbered 131 to 138, give main-set Pokémon a full illustration. Tomokazu Komiya drew the whole Frigibax line, and
          OKACHEKE drew Mabosstiff and Orthworm.
        </p>
        <Grid cards={ART_RARES} cols={4} />

        <h2 id="packs-and-odds">Pull odds</h2>
        <p>
          Pokémon China publishes an odds chart for each pack size. The charts give each rarity group's share of the print run, and
          multiplying a share by the pack size gives the average number of those cards per pack.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Pull odds</caption>
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Slim pack: share of print</th>
                <th scope="col">Per slim pack</th>
                <th scope="col">Jumbo pack: share of print</th>
                <th scope="col">Per jumbo pack</th>
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
          In the top rarity group that works out to about one Super Rare, Special Art Rare or Ultra Rare in every 27 slim packs, or one
          in every 5 jumbo packs.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings the full set to
          397 cards. Our <Link to="/blog/fearless-terastal-set-guide">set guide</Link> covers what a master set takes.
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
          Fearless Terastal gathers Tera Arcanine ex, the Treasures of Ruin and Iono in one set, and the Arcanine ex Special Art Rare
          gives it a card of its own. If you only want one card from this set, make it that one.
        </p>
      </BlogPostLayout>
    </>
  )
}
