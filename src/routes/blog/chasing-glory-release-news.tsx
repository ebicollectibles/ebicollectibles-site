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

const post = BLOG_POSTS.find((p) => p.slug === 'chasing-glory-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Chasing%20Glory/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/222, Chasing Glory`} loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>{c.name}</strong>
              {c.n}/222 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const TRAINERS = [
  { n: '085', name: "Team Rocket's Mewtwo ex", note: 'Double Rare' },
  { n: '082', name: "Lillie's Clefairy ex", note: 'Double Rare' },
  { n: '079', name: "Iono's Bellibolt ex", note: 'Double Rare' },
  { n: '145', name: "N's Zoroark ex", note: 'Double Rare' },
  { n: '113', name: "Cynthia's Garchomp ex", note: 'Double Rare' },
  { n: '035', name: "Ethan's Ho-Oh ex", note: 'Double Rare' },
]

const OWNERS = [
  { who: 'Team Rocket', count: 46 },
  { who: 'N', count: 11 },
  { who: 'Hop', count: 10 },
  { who: 'Ethan', count: 9 },
  { who: 'Cynthia', count: 8 },
  { who: 'Marnie', count: 8 },
  { who: 'Steven', count: 7 },
  { who: 'Misty', count: 6 },
  { who: 'Iono', count: 6 },
  { who: 'Arven', count: 6 },
  { who: 'Lillie', count: 4 },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '14.01%', jumbo: '22.35%' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', slim: '5.26%', jumbo: '6.65%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const ULTRA = [
  { n: '282', name: "Team Rocket's Mewtwo ex", note: 'Ultra Rare' },
  { n: '280', name: "Ethan's Ho-Oh ex", note: 'Ultra Rare' },
  { n: '281', name: "Iono's Bellibolt ex", note: 'Ultra Rare' },
  { n: '285', name: "N's Zoroark ex", note: 'Ultra Rare' },
  { n: '283', name: "Cynthia's Garchomp ex", note: 'Ultra Rare' },
  { n: '284', name: "Team Rocket's Crobat ex", note: 'Ultra Rare' },
]

const SAR = [
  { n: '268', name: "Team Rocket's Mewtwo ex", note: 'SAR · Iwamoto05' },
  { n: '267', name: "Lillie's Clefairy ex", note: 'SAR · Susumu Maeya' },
  { n: '279', name: "Team Rocket's Giovanni", note: 'SAR · Krgc' },
  { n: '272', name: "N's Zoroark ex", note: 'SAR · Megumi Mizutani' },
  { n: '269', name: "Cynthia's Garchomp ex", note: 'SAR · HICO KIM' },
  { n: '264', name: "Ethan's Ho-Oh ex", note: 'SAR · Atsushi Furusawa' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'brock', label: "Chinese Exclusive: Brock's Scouting" },
  { id: 'special-art-rares', label: 'The chase: Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'trainers-pokemon', label: "Trainer's Pokémon" },
  { id: 'parallels', label: 'Poké Ball and Master Ball holos' },
  { id: 'coin-set', label: 'The coin set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Chasing Glory released?',
    a: 'July 16, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What is the difference between the slim and jumbo Chasing Glory packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo group.',
  },
  {
    q: 'How many packs are in each booster box?',
    a: 'A slim box holds 15 packs, 75 cards. A jumbo box holds 6 packs, 120 cards.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs). The jumbo box gives you more of them.",
  },
  {
    q: 'What is the Chinese Exclusive in Chasing Glory?',
    a: "Brock's Scouting 276/222, a Special Art Rare by Atsushi Furusawa. English and Japanese have Brock's Scouting as a Supporter and a full art, but not this illustration.",
  },
  {
    q: 'Where do the Chasing Glory illustrations come from?',
    a: 'From English Destined Rivals (190 cards) and Journey Together (94 cards). Two more, Psyduck and Golduck, match Ascended Heroes, and Brock’s Scouting 276/222 is a Chinese Exclusive.',
    link: { to: '/sets/chinese/chasing-glory-csv10', before: 'See every card on the ', label: 'Chasing Glory card list', after: '.' },
  },
  {
    q: "Can a Trainer's Pokémon evolve from a regular Pokémon?",
    a: "No. A Trainer's Pokémon only evolves from the same Trainer's Pokémon, so Misty's Gyarados needs Misty's Magikarp, not a plain Magikarp.",
  },
  {
    q: 'How many cards are in Chasing Glory?',
    a: '287 numbered cards: 222 in the main set and 65 secret rares. Counting the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 683 different cards.',
  },
  {
    q: 'Is Chasing Glory also sold under other names?',
    a: 'Yes. The set has no official English name, so shops translate it differently. Chasing Glory Together is the same set, CSV10C. Some shops also list it as The Glory of Team Rocket, the name of the Japanese set it is based on.',
  },
]

export const Route = createFileRoute('/blog/chasing-glory-release-news')({
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
  component: ChasingGloryReleasePost,
})

function ChasingGloryReleasePost() {
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
        lede="Trainers and their partner Pokémon arrive in Simplified Chinese. Chasing Glory is the main CSV10 set, led by Team Rocket, and it comes in two pack sizes with different odds."
        cta={{
          heading: 'Shop Chasing Glory',
          body: 'Slim and jumbo booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-slim-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Chasing Glory (<Zh>共逐荣光</Zh>, set code CSV10C) released on July 16, 2026. It is the main numbered set of the CSV10 block, the one that Black Bolt
          and White Flare follow, and its big idea is the Trainer's Pokémon: Team Rocket, Cynthia, N, Iono, Misty and other Trainers
          each bring their own partner Pokémon onto the card. The cards to chase are Team Rocket's Mewtwo ex in Special Art Rare and
          gold, and the set's Chinese Exclusive is a Brock's Scouting Special Art Rare with an illustration found only in the Chinese set.
        </p>

        <aside className="fact-box" aria-label="Chasing Glory key facts">
          <img
            src={`${SITE_URL}/assets/blog/chasing-glory-slim-pack.webp`}
            alt="Chasing Glory booster pack with Giovanni, Mewtwo, Cynthia and N on the front"
            loading="lazy"
            width={600}
            height={1128}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Chasing Glory (<Zh>共逐荣光</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV10C</dd>
              <dt>Released</dt>
              <dd>July 16, 2026</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo. 6 packs per box</dd>
              <dt>Set size</dt>
              <dd>287 cards: 222 in the main set, 65 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Team Rocket's Mewtwo ex SAR and Ultra Rare, Brock's Scouting SAR</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Brock's Scouting SAR 276/222</dd>
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
          Chasing Glory comes in two pack sizes with the same card list. The slim pack is the classic 5-card pack with one holo. The
          jumbo pack is 20 cards with six holos. Pokémon China publishes a separate odds chart for each, and they are not the same.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/chasing-glory-slim-pack.webp`}
                alt="Chasing Glory slim pack, 5 cards"
                loading="lazy"
                width={600}
                height={1128}
              />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/chasing-glory-jumbo-pack.webp`}
                alt="Chasing Glory jumbo pack, 20 cards"
                loading="lazy"
                width={600}
                height={1197}
              />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim or jumbo?</caption>
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
          The jumbo pack is better at every holo level. The top group (Super Rare, Special Art Rare and Ultra Rare) is 1.00% of jumbo
          cards against 0.73% of slim cards, about 37% more per card. In practice that is roughly one top-group card in every 5 jumbo
          packs, against one in every 27 slim packs.
        </p>
        <p>
          Per box, a jumbo box (6 packs, 120 cards, 36 holos) averages about 1.2 top-group cards and 8 from the Double Rare group. A slim
          box (15 packs, 75 cards, 15 holos) averages about half a top-group card and 4 from the Double Rare group. If you are chasing
          the rarest cards, jumbo is the stronger box. If you like ripping lots of small packs, slim is the classic experience. Our{' '}
          <Link to="/blog/chasing-glory-set-guide">set guide</Link> breaks down both boxes in full.
        </p>

        <h2 id="brock">Chinese Exclusive: Brock's Scouting</h2>
        <p>
          Brock's Scouting 276/222 is a Special Art Rare drawn just for this set by Atsushi Furusawa: Brock sitting on a rock above a
          mountain valley. Brock's Scouting exists in English and Japanese as a Supporter and a full art, but this illustration is a
          Chinese Exclusive.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={cardImg('276')} alt="Brock's Scouting 276/222 Special Art Rare, Chasing Glory" loading="lazy" width={320} height={449} />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Brock's Scouting</strong>276/222 · SAR
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={cardImg('255')} alt="Brock's Scouting 255/222 Super Rare, Chasing Glory" loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>Brock's Scouting</strong>255/222 · Super Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="special-art-rares">The chase: Special Art Rares</h2>
        <p>
          Brock's Scouting is one of eighteen Special Art Rares, 262 to 279, which give fourteen Pokémon ex and four Supporters a
          full scene, usually with the Trainer right there next to their partner. Team Rocket's Mewtwo ex shows Giovanni standing
          beside it, and Cynthia's Garchomp ex and N's Zoroark ex do the same for their Trainers.
        </p>
        <Grid cards={SAR} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Alongside the SARs sit eight gold Ultra Rares, 280 to 287: six Pokémon ex plus the Levincia Stadium and Spiky Energy. Team
          Rocket's Mewtwo ex 282/222 is the gold card most collectors want first.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="trainers-pokemon">Trainer's Pokémon</h2>
        <p>
          121 of the set's 188 Pokémon belong to a Trainer, with the Trainer's name in the card name and their portrait on the art.
          Team Rocket alone has 46. The rule that matters in play: a Trainer's Pokémon only evolves from the same Trainer's Pokémon, so
          Misty's Gyarados needs Misty's Magikarp, and plain and owned versions of a species are different cards.
        </p>
        <Grid cards={TRAINERS} cols={3} />
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Trainer's Pokémon</caption>
            <thead>
              <tr>
                <th scope="col">Trainer</th>
                <th scope="col">Pokémon in the set</th>
              </tr>
            </thead>
            <tbody>
              {OWNERS.map((o) => (
                <tr key={o.who}>
                  <th scope="row">{o.who}</th>
                  <td>{o.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Counted from the 188 Pokémon in 001 to 188. The other 67 have no Trainer.</p>

        <h2 id="parallels">Poké Ball and Master Ball holos</h2>
        <p>
          Every Common, Uncommon and Rare card also comes as a Poké Ball pattern holo and a Master Ball pattern holo. The card is the
          same, only the holo pattern changes. That adds 396 cards to a true master set, for 683 in total. The Master Ball versions sit in the
          same odds group as Double Rares and Art Rares, so they are a real chase on their own.
        </p>

        <h2 id="coin-set">The coin set</h2>
        <p>
          Alongside the boxes, Pokémon China released a Chasing Glory coin set: three slim packs, one of 30 featured holo cards, and a
          Pokémon coin that matches the card. Each coin has two regular designs and a gold hidden design, printed at 1 gold coin for
          every 99 regular ones. A Mewtwo coin album with 30 slots came out the same day.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/chasing-glory-coin-set.webp`}
                alt="Chasing Glory coin set package"
                loading="lazy"
                width={600}
                height={1191}
              />
              <figcaption>
                <strong>Coin set</strong>3 slim packs, 1 featured holo, 1 coin
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/chasing-glory-gold-coins.webp`}
                alt="The 30 gold hidden Chasing Glory coins"
                loading="lazy"
                width={900}
                height={769}
              />
              <figcaption>
                <strong>Gold hidden coins</strong>1 in 100 coins
              </figcaption>
            </figure>
          </li>
        </ul>

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
          Chasing Glory is the set for anyone who grew up with a favorite Trainer. Team Rocket fans get 46 Pokémon and a Giovanni SAR,
          and the gold Mewtwo ex is the card to beat. If you are opening for hits, the jumbo box is the better buy on the odds. Want to
          know where each card first appeared in English? See our{' '}
          <Link to="/blog/chasing-glory-card-origins">card origins guide</Link>.
        </p>
      </BlogPostLayout>
    </>
  )
}
