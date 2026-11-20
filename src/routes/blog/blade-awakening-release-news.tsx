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

const post = BLOG_POSTS.find((p) => p.slug === 'blade-awakening-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Blade%20Awakening/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The Chinese Exclusive: the Ciphermaniac's Codebreaking Special Art Rare 245.
const CHINESE_EXCLUSIVE = new Set(['245'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/204, Blade Awakening`} loading="lazy" width={300} height={419} />
            <figcaption>
              {CHINESE_EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/204 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const EXCLUSIVE = [
  { n: '245', name: "Ciphermaniac's Codebreaking", note: 'Special Art Rare · Taira Akitsu' },
  { n: '228', name: "Ciphermaniac's Codebreaking", note: 'Super Rare · Taira Akitsu' },
]

const GRENINJA = [
  { n: '242', name: 'Greninja ex', note: 'Special Art Rare · akagi' },
  { n: '223', name: 'Greninja ex', note: 'Super Rare · 5ban Graphics' },
  { n: '123', name: 'Greninja ex', note: 'Double Rare · 5ban Graphics' },
]

const SAR_POKEMON = [
  { n: '244', name: 'Raging Bolt ex', note: 'Special Art Rare · Teeziro' },
  { n: '239', name: 'Walking Wake ex', note: 'Special Art Rare · Teeziro' },
  { n: '238', name: 'Gouging Fire ex', note: 'Special Art Rare · Teeziro' },
  { n: '241', name: 'Iron Crown ex', note: 'Special Art Rare · nagimiso' },
]

const SAR_TRAINERS = [
  { n: '250', name: "Morty's Conviction", note: 'Special Art Rare · Megumi Mizutani' },
  { n: '249', name: "Bianca's Devotion", note: 'Special Art Rare · Cona Nitanda' },
  { n: '246', name: "Lana's Aid", note: 'Special Art Rare · Toshinao Aoki' },
  { n: '248', name: 'Eri', note: 'Special Art Rare · DOM' },
]

const ULTRA = [
  { n: '256', name: 'Raging Bolt ex', note: 'Ultra Rare · aky CG Works' },
  { n: '253', name: 'Walking Wake ex', note: 'Ultra Rare · takuyoa' },
  { n: '252', name: 'Gouging Fire ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '254', name: 'Iron Crown ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '251', name: 'Iron Leaves ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '255', name: 'Iron Boulder ex', note: 'Ultra Rare · 5ban Graphics' },
]

const MAIN_EX = [
  { n: '163', name: 'Lugia ex', note: 'Double Rare · 5ban Graphics' },
  { n: '038', name: 'Blaziken ex', note: 'Double Rare · takuyoa' },
  { n: '060', name: 'Kyogre ex', note: 'Double Rare · takuyoa' },
  { n: '137', name: 'Tyranitar ex', note: 'Double Rare · 5ban Graphics' },
  { n: '085', name: 'Tapu Koko ex', note: 'Double Rare · PLANETA Igarashi' },
  { n: '154', name: 'Raging Bolt ex', note: 'Double Rare · aky CG Works' },
]

const ART_RARES = [
  { n: '209', name: 'Metagross', note: 'Art Rare · Katsunori Sato' },
  { n: '210', name: 'Drampa', note: 'Art Rare · Mékayu' },
  { n: '205', name: 'Shiftry', note: 'Art Rare · SIE NANAHARA' },
  { n: '206', name: 'Iron Thorns', note: 'Art Rare · Tonji Matsuno' },
  { n: '207', name: 'Bronzor', note: 'Art Rare · sowsow' },
  { n: '208', name: 'Arbok', note: 'Art Rare · OKUBO' },
]

const ACE = [
  { n: '181', name: 'Master Ball', note: 'ACE SPEC Rare · Item' },
  { n: '180', name: 'Prime Catcher', note: 'ACE SPEC Rare · Item' },
  { n: '187', name: "Hero's Cape", note: 'ACE SPEC Rare · Pokémon Tool' },
  { n: '176', name: 'Awakening Drum', note: 'ACE SPEC Rare · Item' },
  { n: '178', name: 'Hyper Aroma', note: 'ACE SPEC Rare · Item' },
  { n: '183', name: 'Reboot Pod', note: 'ACE SPEC Rare · Item' },
  { n: '186', name: 'Survival Brace', note: 'ACE SPEC Rare · Pokémon Tool' },
  { n: '189', name: 'Maximum Belt', note: 'ACE SPEC Rare · Pokémon Tool' },
  { n: '203', name: 'Neo Upper Energy', note: 'ACE SPEC Rare · Special Energy' },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '13.82%', jumbo: '22.11%' },
  { band: 'Double Rare, Art Rare, ACE SPEC Rare and Master Ball pattern holo', slim: '5.45%', jumbo: '6.89%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

// The same shares applied to one box: 75 cards (slim) or 120 cards (jumbo).
const BOXES = [
  { row: 'Packs, cards, holos', slim: '15 packs, 75 cards, 15 holos', jumbo: '6 packs, 120 cards, 36 holos' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 10', jumbo: 'about 26 to 27' },
  { row: 'Double Rare, Art Rare, ACE SPEC Rare and Master Ball pattern', slim: 'about 4', jumbo: 'about 8' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'ciphermaniac', label: "Chinese Exclusive: Ciphermaniac's Codebreaking" },
  { id: 'greninja', label: 'Tera Greninja ex' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'ace-spec', label: 'ACE SPEC cards' },
  { id: 'main-set-ex', label: 'Lugia ex and the main-set ex' },
  { id: 'odds', label: 'Odds and box math' },
  { id: 'parallels', label: 'Poké Ball and Master Ball holos' },
  { id: 'coin-set', label: 'The coin set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Blade Awakening released?',
    a: 'January 16, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What is the Chinese Exclusive in Blade Awakening?',
    a: "Ciphermaniac's Codebreaking 245/204, a Special Art Rare by Taira Akitsu. English has Ciphermaniac's Codebreaking as a Supporter and a full art, but not with this illustration.",
  },
  {
    q: 'What is the difference between the slim and jumbo Blade Awakening packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo rarity group.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs). The jumbo box gives you more of them.",
  },
  {
    q: 'Where do the Blade Awakening illustrations come from?',
    a: 'Mostly from English Temporal Forces, which matches 173 of its 259 cards, with 68 more from Twilight Masquerade. The other 17 come from six English sources, and one card is the new Chinese Exclusive.',
    link: { to: '/sets/chinese/blade-awakening-csv7', before: 'See every card on the ', label: 'Blade Awakening card list', after: '.' },
  },
  {
    q: 'How many ACE SPEC cards are in Blade Awakening?',
    a: "Nine, all in the main set: Awakening Drum, Hyper Aroma, Prime Catcher, Master Ball, Reboot Pod, Survival Brace, Hero's Cape, Maximum Belt and Neo Upper Energy. Only one ACE SPEC card is allowed in a deck.",
  },
  {
    q: 'How many cards are in Blade Awakening?',
    a: '259 numbered cards: 204 in the main set and 55 secret rares. Counting the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 605 different cards.',
  },
]

export const Route = createFileRoute('/blog/blade-awakening-release-news')({
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
  component: BladeAwakeningReleasePost,
})

function BladeAwakeningReleasePost() {
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
        lede="Tera Greninja ex leads a 259-card set full of Ancient and Future Pokémon, with nine ACE SPEC cards and a Chinese Exclusive Ciphermaniac Special Art Rare."
        cta={{
          heading: 'Shop Blade Awakening',
          body: 'Slim and jumbo booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-blade-awakening-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-blade-awakening-slim-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Blade Awakening (<Zh>利刃猛醒</Zh>, set code CSV7C) released on January 16, 2026. It is a 259-card set of the Chinese Scarlet &
          Violet series with Tera Greninja ex on the pack. The set is full of Ancient and Future Pokémon such as Raging Bolt ex, Walking
          Wake ex and Iron Crown ex, and it has nine ACE SPEC cards. Its Chinese Exclusive is a Ciphermaniac's Codebreaking Special Art
          Rare.
        </p>
        <p>
          Our <Link to="/blog/blade-awakening-set-guide">set guide</Link> shows every secret rare and each Pokémon ex at every rarity,
          and our <Link to="/blog/blade-awakening-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <aside className="fact-box" aria-label="Blade Awakening key facts">
          <img
            src={`${SITE_URL}/assets/blog/blade-awakening-slim-pack.webp`}
            alt="Blade Awakening slim booster pack with Greninja on the front"
            loading="lazy"
            width={600}
            height={1129}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Blade Awakening (<Zh>利刃猛醒</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV7C</dd>
              <dt>Released</dt>
              <dd>January 16, 2026</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo. 6 packs per box</dd>
              <dt>Set size</dt>
              <dd>259 cards: 204 in the main set, 55 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Greninja ex Special Art Rare, Raging Bolt ex Special Art Rare and gold Ultra Rare, Ciphermaniac's Codebreaking Special Art Rare</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Ciphermaniac's Codebreaking Special Art Rare 245/204</dd>
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
          Blade Awakening comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is 20
          cards with six holos. Pokémon China published an odds chart for each, and the jumbo pack is better at every holo level. Super
          Rares, Special Art Rares and Ultra Rares are 1.00% of jumbo cards against 0.73% of slim cards. That works out to about one of
          those cards every 5 jumbo packs, against one every 27 slim packs.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/blade-awakening-slim-pack.webp`}
                alt="Blade Awakening slim pack, 5 cards"
                loading="lazy"
                width={600}
                height={1129}
              />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/blade-awakening-jumbo-pack.webp`}
                alt="Blade Awakening jumbo pack, 20 cards"
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
        <p>
          A jumbo box (6 packs, 120 cards, 36 holos) averages about 1.2 of those top cards. A slim box (15 packs, 75 cards, 15 holos)
          averages about half of one. The full numbers are in <a href="#odds">Odds and box math</a> below.
        </p>

        <h2 id="ciphermaniac">Chinese Exclusive: Ciphermaniac's Codebreaking</h2>
        <p>
          Ciphermaniac's Codebreaking 245/204 is a Special Art Rare with a new illustration by Taira Akitsu, who also drew the regular
          card. It shows the Ciphermaniac in a blue-lit street with a magnifying glass in one hand and an open book in the other.
          English has this Supporter as a regular card and a full art, and both are in this set too. The card is not in English with
          this illustration.
        </p>
        <Grid cards={EXCLUSIVE} cols={2} />

        <h2 id="greninja">Tera Greninja ex</h2>
        <p>
          Greninja ex is the pack Pokémon, a Fighting-type Tera Pokémon with 310 HP. While it sits on your Bench it takes no damage from
          attacks. It comes at three rarities, and the Special Art Rare by akagi is the one most collectors want.
        </p>
        <Grid cards={GRENINJA} cols={3} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          There are fourteen Special Art Rares, numbered 237 to 250. Eight are Pokémon ex: Greninja ex, Dachsbun ex and six Paradox
          Pokémon. Teeziro drew Raging Bolt ex, Walking Wake ex and Gouging Fire ex as a matching set.
        </p>
        <Grid cards={SAR_POKEMON} cols={4} />
        <p>
          The other six are Supporters: Ciphermaniac's Codebreaking, Lana's Aid, Salvatore, Eri, Bianca's Devotion and Morty's
          Conviction, which shows Morty with his Gengar.
        </p>
        <Grid cards={SAR_TRAINERS} cols={4} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          There are nine gold Ultra Rares, numbered 251 to 259. Six are the Paradox Pokémon ex, so Raging Bolt ex, Walking Wake ex, Gouging Fire ex, Iron Crown
          ex, Iron Leaves ex and Iron Boulder ex each run from Double Rare to Super Rare, Special Art Rare and gold. The other three are
          Earthen Vessel, Buddy-Buddy Poffin and Rescue Board.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          There are six Art Rares, numbered 205 to 210. Katsunori Sato drew Metagross in a snowy town, and Mékayu drew Drampa carrying
          two children over the rooftops.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="ace-spec">ACE SPEC cards</h2>
        <p>
          Blade Awakening has nine ACE SPEC cards. These are Trainers and Energy with a pink frame and strong effects, and a deck can
          only include one. All nine sit in the main set between 176 and 203, at their own ACE SPEC Rare rarity, which shares a rarity
          group with the Double Rares.
        </p>
        <Grid cards={ACE} cols={3} />

        <h2 id="main-set-ex">Lugia ex and the main-set ex</h2>
        <p>
          There are 22 Pokémon ex in the main set, and five of them, Lugia ex, Blaziken ex, Kyogre ex, Tyranitar ex and Tapu Koko ex, have
          no higher rarity. Their Double Rares are the only versions in the set. Raging Bolt ex, last below, is the opposite: its Double
          Rare starts a run that goes all the way to gold.
        </p>
        <Grid cards={MAIN_EX} cols={3} />

        <h2 id="odds">Odds and box math</h2>
        <p>These are Pokémon China's charts for each pack size, in the rarity groups they use:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Odds and box math: Share of print, Slim, Jumbo</caption>
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
        <p>Applied to one box of each, the shares work out to this:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Odds and box math: Per box, Slim, Jumbo</caption>
            <thead>
              <tr>
                <th scope="col">Per box</th>
                <th scope="col">Slim</th>
                <th scope="col">Jumbo</th>
              </tr>
            </thead>
            <tbody>
              {BOXES.map((b) => (
                <tr key={b.row}>
                  <th scope="row">{b.row}</th>
                  <td>{b.slim}</td>
                  <td>{b.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official print shares, not guarantees. Individual boxes vary.</p>
        <p>
          The top group holds 49 different cards: 26 Super Rares, 14 Special Art Rares and 9 Ultra Rares. Per card, the jumbo pack has
          about 37% more of them.
        </p>

        <h2 id="parallels">Poké Ball and Master Ball holos</h2>
        <p>
          Every Common, Uncommon and Rare, 173 cards, also comes as a Poké Ball pattern holo and a Master Ball pattern holo. The card is
          the same, only the holo pattern changes. That adds 346 cards, for 605 in a true master set. The Master Ball versions share a rarity
          group with the Double Rares, so they take a long time to collect.
        </p>

        <h2 id="coin-set">The coin set</h2>
        <p>
          Pokémon China also released a Blade Awakening coin set: three slim packs, one featured holo from a list of 30, and a Pokémon coin
          that matches the card. Five of the 30 holos are Double Rares and 25 are Commons, Uncommons and Rares, which come as a Poké Ball
          pattern or, at 1 in 100, a Master Ball pattern. Each coin has two regular designs and a gold hidden design, printed at 1 hidden
          coin for every 99 regular ones. A Greninja coin album with 30 slots came out the same day.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/blade-awakening-coin-set.webp`}
                alt="Blade Awakening coin set package with Greninja on the front"
                loading="lazy"
                width={600}
                height={1190}
              />
              <figcaption>
                <strong>Coin set</strong>3 slim packs, 1 featured holo, 1 coin
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${SITE_URL}/assets/blog/blade-awakening-gold-coins.webp`}
                alt="The 30 gold hidden Blade Awakening coins"
                loading="lazy"
                width={900}
                height={795}
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
          Blade Awakening goes deep: six Paradox Pokémon ex run all the way to gold, and the Greninja ex Special Art Rare by akagi
          is the card most collectors want. The Ciphermaniac's Codebreaking Special Art Rare does not exist in English. If you are
          opening for Super Rares and above, the jumbo box is the better buy on the published odds.
        </p>
      </BlogPostLayout>
    </>
  )
}
