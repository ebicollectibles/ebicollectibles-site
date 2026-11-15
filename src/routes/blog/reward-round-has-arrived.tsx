import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'reward-round-has-arrived')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Reward%20Round%20CSV4/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/129, Reward Round`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/129 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const GHOLDENGO = [
  { n: '089', name: 'Gholdengo ex', note: 'Double Rare' },
  { n: '144', name: 'Gholdengo ex', note: 'Super Rare' },
  { n: '156', name: 'Gholdengo ex', note: 'SAR · Akira Komayama' },
  { n: '162', name: 'Gholdengo ex', note: 'Ultra Rare · Chinese exclusive' },
]

const EXCLUSIVES = [
  { n: '162', name: 'Gholdengo ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '158', name: 'Maushold ex', note: 'SAR · Yoshimi Miyoshi' },
  { n: '159', name: 'Rika', note: 'SAR · kantaro' },
]

const SAR = [
  { n: '157', name: 'Pidgeot ex', note: 'SAR · Jerky' },
  { n: '154', name: 'Tapu Koko ex', note: 'SAR · Jerky' },
  { n: '161', name: "Boss's Orders", note: 'SAR · hncl' },
  { n: '153', name: 'Golisopod ex', note: 'SAR · Oku' },
  { n: '160', name: 'Parasol Lady', note: 'SAR · En Morikura' },
  { n: '155', name: 'Revavroom ex', note: 'SAR · Souichirou Gunjima' },
]

const ART_RARES = [
  { n: '133', name: 'Gimmighoul', note: 'Art Rare · Akira Komayama' },
  { n: '136', name: 'Pidgey', note: 'Art Rare · Jerky' },
  { n: '137', name: 'Pidgeotto', note: 'Art Rare · Jerky' },
  { n: '132', name: 'Palafin', note: 'Art Rare · Akira Komayama' },
  { n: '131', name: 'Wimpod', note: 'Art Rare · Oku' },
  { n: '135', name: 'Varoom', note: 'Art Rare · Souichirou Gunjima' },
]

// Pokémon China's odds chart for the 5-card pack, in the bands it uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', share: '80.00%', box: '60' },
  { band: 'Poké Ball pattern holo and Rare', share: '14.53%', box: 'about 11' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', share: '4.74%', box: 'about 3 to 4' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', share: '0.73%', box: 'about 0.55' },
]

const TOC = [
  { id: 'exclusives', label: 'Three cards only in Chinese' },
  { id: 'gholdengo', label: 'Gholdengo, the cover star' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'packs-and-odds', label: 'Slim and jumbo packs' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese exclusive cards in Reward Round?',
    a: 'Three: the gold Gholdengo ex Ultra Rare 162/129, the Maushold ex Special Art Rare 158/129 and the Rika Special Art Rare 159/129. None of them has an English version.',
  },
  {
    q: 'What is in a Reward Round pack?',
    a: 'The slim pack has 5 cards, 4 non-holo and 1 holo. Pokémon China also sells a 20-card jumbo pack with 6 holos.',
  },
  {
    q: 'How many packs are in a slim booster box?',
    a: '15 packs of 5 cards, so 75 cards with 15 holos.',
  },
  {
    q: 'How many big hits are in a slim box?',
    a: 'Super Rares, Special Art Rares and Ultra Rares are 0.73% of the 5-card print run, which works out to about 0.55 per 15-pack box, or one in every 27 packs on average.',
  },
  {
    q: 'How many cards are in Reward Round?',
    a: '165 numbered cards: 129 in the main set and 36 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 395 different cards.',
  },
]

export const Route = createFileRoute('/blog/reward-round-has-arrived')({
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
  component: RewardRoundReleasePost,
})

function RewardRoundReleasePost() {
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
        lede="Gholdengo takes the cover of the fourth Chinese Scarlet & Violet set, with a gold Ultra Rare and two Special Art Rares you can only pull in Simplified Chinese."
        cta={{
          heading: 'Shop Reward Round',
          body: 'Slim booster boxes in stock now, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-reward-round-booster-box' }, label: 'Shop the slim box' },
            { to: '/sets/reward-round-csv4', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Reward Round (嘉奖回合) released on July 18, 2025. It is the fourth main set of the Chinese Scarlet & Violet series, with
          Gholdengo on the pack and a cast of Paldea Pokémon and Trainers around it. It came in two pack sizes, slim and jumbo, and it
          hides three cards English collectors cannot pull.
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
              <dd>Reward Round (嘉奖回合)</dd>
              <dt>Set code</dt>
              <dd>CSV4C</dd>
              <dt>Released</dt>
              <dd>July 18, 2025</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>165 cards: 129 in the main set, 36 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Gold Gholdengo ex, Maushold ex SAR, Rika SAR</dd>
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

        <h2 id="exclusives">Three cards only in Chinese</h2>
        <p>
          Three secret rares have no English version: the gold Gholdengo ex, a Maushold ex Special Art Rare of the mouse family playing at
          home, and a Rika Special Art Rare of the Elite Four member with her Clodsire. These are the cards that make the Chinese set worth
          chasing even if you already own the English ones.
        </p>
        <Grid cards={EXCLUSIVES} cols={3} />

        <h2 id="gholdengo">Gholdengo, the cover star</h2>
        <p>
          Gholdengo ex draws you an extra card every turn with its ability, two if it is in the Active Spot, and its attack discards any
          number of basic Energy from your hand for 50 damage each. Build up a hand, then cash it in. It appears at four rarities in the
          set, and the gold Ultra Rare is the one with no English version.
        </p>
        <Grid cards={GHOLDENGO} cols={4} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Nine Special Art Rares, 153 to 161: six Pokémon ex, including the Chinese-exclusive Maushold ex, and three Supporters,
          including the Chinese-exclusive Rika.
        </p>
        <Grid cards={SAR} cols={3} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold cards top the set, 162 to 165: Gholdengo ex, Nest Ball, Luxurious Cape and the Beach Court Stadium. Gholdengo ex is
          the only Pokémon among them.
        </p>

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Eight Art Rares, 130 to 137, give main-set Pokémon a full illustration, including Akira Komayama's Palafin and Gimmighoul and
          Jerky's Pidgey and Pidgeotto.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="packs-and-odds">Slim and jumbo packs</h2>
        <p>
          Reward Round came in a slim 5-card pack with one holo and a jumbo 20-card pack with six holos. We carry the slim booster box: 15
          packs, 75 cards, 15 holos. Pokémon China's odds chart for the 5-card pack, applied to one slim box:
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${SITE_URL}/assets/blog/reward-round-slim-pack.webp`} alt="Reward Round slim pack, 5 cards" loading="lazy" width={600} height={1128} />
            <figcaption>
              <strong>Slim pack</strong>5 cards · 1 holo
            </figcaption>
          </figure>
          <figure>
            <img src={`${SITE_URL}/assets/blog/reward-round-jumbo-pack.webp`} alt="Reward Round jumbo pack, 20 cards" loading="lazy" width={600} height={1196} />
            <figcaption>
              <strong>Jumbo pack</strong>20 cards · 6 holo
            </figcaption>
          </figure>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Share of print</th>
                <th scope="col">Per slim box</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.share}</td>
                  <td>{o.box}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official 5-card chart. Individual boxes vary.</p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings the full set to
          395 cards. Our <Link to="/blog/reward-round-set-guide">set guide</Link> has the full checklist, and our{' '}
          <Link to="/blog/reward-round-card-origins">card origins guide</Link> matches every card to its English version.
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

        <h2 id="our-take">Our take</h2>
        <p>
          Reward Round is a fun, bright set, and the three Chinese exclusives give it a real reason to exist alongside the English sets
          it draws from. If you only chase one card, make it the gold Gholdengo ex.
        </p>
      </BlogPostLayout>
    </>
  )
}
