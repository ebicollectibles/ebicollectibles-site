import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'reward-round-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Reward%20Round%20CSV4/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The three Chinese Exclusives: Maushold ex 158, Rika 159 and the gold Gholdengo ex 162.
const EXCLUSIVE = new Set(['158', '159', '162'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/129, Reward Round`} loading="lazy" width={300} height={419} />
            <figcaption>
              {EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/129 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const GHOLDENGO = [
  { n: '162', name: 'Gholdengo ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '156', name: 'Gholdengo ex', note: 'Special Art Rare · Akira Komayama' },
  { n: '144', name: 'Gholdengo ex', note: 'Super Rare · takuyoa' },
  { n: '089', name: 'Gholdengo ex', note: 'Double Rare · takuyoa' },
]

const EXCLUSIVES = [
  { n: '158', name: 'Maushold ex', note: 'Special Art Rare · Yoshimi Miyoshi' },
  { n: '159', name: 'Rika', note: 'Special Art Rare · kantaro' },
]

const SAR = [
  { n: '157', name: 'Pidgeot ex', note: 'Special Art Rare · Jerky' },
  { n: '154', name: 'Tapu Koko ex', note: 'Special Art Rare · Jerky' },
  { n: '153', name: 'Golisopod ex', note: 'Special Art Rare · Oku' },
  { n: '155', name: 'Revavroom ex', note: 'Special Art Rare · Souichirou Gunjima' },
  { n: '161', name: "Boss's Orders", note: 'Special Art Rare · hncl' },
  { n: '160', name: 'Parasol Lady', note: 'Special Art Rare · En Morikura' },
]

const ULTRA = [
  { n: '163', name: 'Nest Ball', note: 'Ultra Rare · Toyste Beach' },
  { n: '164', name: 'Luxurious Cape', note: 'Ultra Rare · Toyste Beach' },
  { n: '165', name: 'Beach Court', note: 'Ultra Rare · Oswaldo KATO' },
]

const ART_RARES = [
  { n: '133', name: 'Gimmighoul', note: 'Art Rare · Akira Komayama' },
  { n: '136', name: 'Pidgey', note: 'Art Rare · Jerky' },
  { n: '137', name: 'Pidgeotto', note: 'Art Rare · Jerky' },
  { n: '132', name: 'Palafin', note: 'Art Rare · Akira Komayama' },
  { n: '131', name: 'Wimpod', note: 'Art Rare · Oku' },
  { n: '135', name: 'Varoom', note: 'Art Rare · Souichirou Gunjima' },
  { n: '130', name: 'Bramblin', note: 'Art Rare · sowsow' },
  { n: '134', name: 'Nacli', note: 'Art Rare · Ryota Murayama' },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '14.53%', jumbo: '22.99%' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', slim: '4.74%', jumbo: '6.01%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const TOC = [
  { id: 'gholdengo', label: 'Gholdengo ex, the cover star' },
  { id: 'exclusives', label: 'Chinese Exclusives: Gholdengo ex, Maushold ex and Rika' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'packs-and-odds', label: 'Slim and jumbo packs' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Reward Round released?',
    a: 'July 18, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Who is on the Reward Round pack?',
    a: 'Gholdengo. Gholdengo ex comes as a Double Rare, a Super Rare, a Special Art Rare by Akira Komayama and a gold Ultra Rare. The gold Ultra Rare is new and does not exist in English. Akira Komayama also drew the Art Rare of its pre-evolution, Gimmighoul.',
  },
  {
    q: 'What are the Chinese Exclusives in Reward Round?',
    a: 'Three: the gold Gholdengo ex Ultra Rare 162/129, the Maushold ex Special Art Rare 158/129 and the Rika Special Art Rare 159/129. None of the three exists in English. English has a Rika Special Illustration Rare in Paradox Rift, but with a different illustration.',
  },
  {
    q: 'What is the difference between the slim and jumbo Reward Round packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo rarity group.',
  },
  {
    q: 'How many packs are in a slim booster box?',
    a: '15 packs of 5 cards, so 75 cards with 15 holos.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per 15-pack slim box (one in every 27 slim packs) and one in every 5 jumbo packs.",
  },
  {
    q: 'Where do the Reward Round illustrations come from?',
    a: 'Mostly from three English sets. Obsidian Flames matches 69 of its 165 cards, Paldea Evolved matches 41 and Paradox Rift matches 31. The other 21 come from six English sources, and three cards are the new Chinese Exclusives.',
    link: { to: '/sets/chinese/reward-round-csv4', before: 'See every card on the ', label: 'Reward Round card list', after: '.' },
  },
  {
    q: 'How many cards are in Reward Round?',
    a: '165 numbered cards: 129 in the main set and 36 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 395 different cards.',
  },
  {
    q: 'Is Reward Round also sold under other names?',
    a: 'Yes. The set has no official English name, so shops translate it differently. Prize Turn and Awards Round are the same set, CSV4C.',
  },
]

export const Route = createFileRoute('/blog/reward-round-release-news')({
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
  component: RewardRoundReleasePost,
})

function RewardRoundReleasePost() {
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
        lede="Gholdengo takes the cover of the fourth Chinese Scarlet & Violet set, and it brings three Chinese Exclusives: a gold Gholdengo ex Ultra Rare and Special Art Rares of Maushold ex and Rika."
        cta={{
          heading: 'Shop Reward Round',
          body: 'Slim booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-reward-round-booster-box' }, label: 'Shop the slim box' },
            { to: '/sets/chinese/reward-round-csv4', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Reward Round (<Zh>嘉奖回合</Zh>, set code CSV4C) released on July 18, 2025. It is the fourth main set of the Chinese Scarlet & Violet series, with
          Gholdengo on the pack and a cast of Paldea Pokémon and Trainers around it. It came in two pack sizes, slim and jumbo, and it
          has three Chinese Exclusives that do not exist in English.
        </p>
        <p>
          Our <Link to="/blog/reward-round-set-guide">set guide</Link> shows every secret rare and what a slim box holds, and our{' '}
          <Link to="/blog/reward-round-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <aside className="fact-box" aria-label="Reward Round key facts">
          <img
            src={`${SITE_URL}/assets/blog/reward-round-slim-pack.webp`}
            alt="Reward Round slim booster pack with Gholdengo on the front"
            loading="lazy"
            width={600}
            height={1128}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Reward Round (<Zh>嘉奖回合</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV4C</dd>
              <dt>Released</dt>
              <dd>July 18, 2025</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per slim box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>165 cards: 129 in the main set, 36 secret rares</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Gold Gholdengo ex Ultra Rare, Maushold ex Special Art Rare, Rika Special Art Rare</dd>
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

        <h2 id="gholdengo">Gholdengo ex, the cover star</h2>
        <p>
          Gholdengo is the pack Pokémon. Gholdengo ex is a Stage 1 Metal Pokémon with 260 HP. Once during your turn, its Ability draws a
          card, or two if it is in the Active Spot, and its attack discards any number of basic Energy from your hand for 50 damage
          each. Build up a hand, then cash it in. It comes at four rarities. The gold Ultra Rare is new and does not exist in English,
          and the Special Art Rare by Akira Komayama matches English.
        </p>
        <Grid cards={GHOLDENGO} cols={4} />

        <h2 id="exclusives">Chinese Exclusives: Gholdengo ex, Maushold ex and Rika</h2>
        <p>
          Three secret rares do not exist in English. The first is the gold Gholdengo ex Ultra Rare shown above. The other two are
          Special Art Rares. Maushold ex shows the mouse family playing at home, and Rika shows the Elite Four member holding up a Poké
          Ball, with her partner Clodsire behind her. English has a Rika Special Illustration Rare in Paradox Rift, but it uses a
          different illustration.
        </p>
        <Grid cards={EXCLUSIVES} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          There are nine Special Art Rares, numbered 153 to 161: six Pokémon ex and three Supporters. Gholdengo ex and the Chinese
          Exclusives Maushold ex and Rika are shown above. These are the other six.
        </p>
        <Grid cards={SAR} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold cards top the set, numbered 162 to 165: Gholdengo ex, Nest Ball, Luxurious Cape and the Beach Court Stadium. Gholdengo ex is
          the only Pokémon among them and is shown above.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Eight Art Rares, numbered 130 to 137, give main-set Pokémon a full illustration. Gimmighoul, the Pokémon Gholdengo evolves
          from, is by Akira Komayama, who also drew Palafin and the Gholdengo ex Special Art Rare. Jerky drew Pidgey and Pidgeotto.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="packs-and-odds">Slim and jumbo packs</h2>
        <p>
          Reward Round came in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is 20
          cards with six holos. Pokémon China published an odds chart for each, and the jumbo pack is better at every holo level.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/reward-round-slim-pack.webp`} alt="Reward Round slim pack, 5 cards" loading="lazy" width={600} height={1128} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/reward-round-jumbo-pack.webp`} alt="Reward Round jumbo pack, 20 cards" loading="lazy" width={600} height={1196} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim and jumbo packs</caption>
            <thead>
              <tr>
                <th scope="col">Share of print</th>
                <th scope="col">Slim</th>
                <th scope="col">Jumbo</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.slim}</td>
                  <td>{o.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">From Pokémon China's odds chart for each pack size.</p>
        <p>
          We carry the slim booster box: 15 packs, 75 cards and 15 holos. Applied to one slim box, the chart works out to about 11
          Poké Ball pattern holos and Rares, about 3 to 4 cards from the Double Rare rarity group and about 0.55 Super Rares or better,
          one in every 27 slim packs. In jumbo packs, the top group comes about once every 5 packs.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a Master Ball pattern holo, 115 of each. The card
          is the same, only the holo pattern changes, which brings the full set to 395 cards. Our <Link to="/blog/reward-round-set-guide">set guide</Link> covers what a master set takes.
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
          Reward Round is a fun, bright set, and the three Chinese Exclusives give it a real reason to exist alongside the English sets
          it draws from. If you only chase one card, make it the gold Gholdengo ex.
        </p>
      </BlogPostLayout>
    </>
  )
}
