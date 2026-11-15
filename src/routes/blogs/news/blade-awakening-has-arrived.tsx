import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'blade-awakening-has-arrived')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Blade%20Awakening/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/204, Blade Awakening`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/204 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const EXCLUSIVE = [
  { n: '245', name: "Ciphermaniac's Codebreaking", note: 'SAR · Taira Akitsu · Chinese exclusive' },
  { n: '228', name: "Ciphermaniac's Codebreaking", note: 'Super Rare · Taira Akitsu' },
]

const GRENINJA = [
  { n: '242', name: 'Greninja ex', note: 'SAR · akagi' },
  { n: '223', name: 'Greninja ex', note: 'Super Rare · 5ban Graphics' },
  { n: '123', name: 'Greninja ex', note: 'Double Rare · 5ban Graphics' },
]

const SAR_POKEMON = [
  { n: '244', name: 'Raging Bolt ex', note: 'SAR · Teeziro' },
  { n: '239', name: 'Walking Wake ex', note: 'SAR · Teeziro' },
  { n: '238', name: 'Gouging Fire ex', note: 'SAR · Teeziro' },
  { n: '241', name: 'Iron Crown ex', note: 'SAR · nagimiso' },
]

const SAR_TRAINERS = [
  { n: '250', name: "Morty's Conviction", note: 'SAR · Megumi Mizutani' },
  { n: '249', name: "Bianca's Devotion", note: 'SAR · Cona Nitanda' },
  { n: '246', name: "Lana's Aid", note: 'SAR · Toshinao Aoki' },
  { n: '248', name: 'Eri', note: 'SAR · DOM' },
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
  { id: 'ciphermaniac', label: "Ciphermaniac's Codebreaking, only in Chinese" },
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
    q: 'What is the Chinese exclusive card in Blade Awakening?',
    a: "Ciphermaniac's Codebreaking 245/204, a Special Art Rare by Taira Akitsu. Pokémon China says it was added specially to this set. English has Ciphermaniac's Codebreaking as a Supporter and a full art, but not this illustration.",
  },
  {
    q: 'What is the difference between the slim and jumbo Blade Awakening packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo band.',
  },
  {
    q: 'Which box gives more chase cards?',
    a: 'The jumbo box. Pokémon China prints Super Rares, Special Art Rares and Ultra Rares at 1.00% of jumbo cards against 0.73% of slim cards, so a jumbo box averages about 1.2 of them and a slim box about 0.55.',
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

export const Route = createFileRoute('/blogs/news/blade-awakening-has-arrived')({
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
  component: BladeAwakeningReleasePost,
})

function BladeAwakeningReleasePost() {
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
        lede="Tera Greninja ex leads a 259-card set full of Ancient and Future Pokémon, with nine ACE SPEC cards and a Ciphermaniac Special Art Rare added just for China."
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
          Blade Awakening (利刃猛醒) released on January 16, 2026. It is the CSV7C set of the Chinese Scarlet & Violet series and a big
          one: 259 cards, with Tera Greninja ex on the pack, Raging Bolt ex, Walking Wake ex, Iron Crown ex and the other Ancient and
          Future Pokémon in the chase, and nine ACE SPEC cards, the powerful Trainers you can only play one of per deck. Its Chinese
          exclusive is a Ciphermaniac's Codebreaking Special Art Rare.
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
              <dd>Blade Awakening (利刃猛醒)</dd>
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
              <dd>Greninja ex SAR, Raging Bolt ex SAR and gold, Ciphermaniac's Codebreaking SAR</dd>
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
          cards with six holos. Pokémon China published an odds chart for each, and the jumbo pack wins at every holo level: Super
          Rares, Special Art Rares and Ultra Rares are 1.00% of jumbo cards against 0.73% of slim cards. That works out to about one big
          hit every 5 jumbo packs, against one every 27 slim packs.
        </p>
        <div className="card-grid cols-2">
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
        </div>
        <p>
          A jumbo box (6 packs, 120 cards, 36 holos) averages about 1.2 of those top cards. A slim box (15 packs, 75 cards, 15 holos)
          averages about half of one. The full numbers are in <a href="#odds">Odds and box math</a> below.
        </p>

        <h2 id="ciphermaniac">Ciphermaniac's Codebreaking, only in Chinese</h2>
        <p>
          Pokémon China says it added a brand-new Ciphermaniac's Codebreaking Special Art Rare to Blade Awakening. Taira Akitsu, who drew
          the regular card, shows the Ciphermaniac in a blue-lit street, magnifying glass in one hand and the Violet Book in the other.
          English has this Supporter as a regular card and a full art, both of which are here too, but never this art.
        </p>
        <Grid cards={EXCLUSIVE} cols={2} />

        <h2 id="greninja">Tera Greninja ex</h2>
        <p>
          Greninja ex is the pack Pokémon, a Fighting-type Tera Pokémon with 310 HP. While it sits on your Bench it takes no damage from
          attacks. It comes at three rarities, and the Special Art Rare by akagi is the one most collectors will chase.
        </p>
        <Grid cards={GRENINJA} cols={3} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Fourteen Special Art Rares, 237 to 250. Eight are Pokémon ex: Greninja ex, Dachsbun ex and six Paradox Pokémon, with Teeziro
          drawing Raging Bolt ex, Walking Wake ex and Gouging Fire ex as a matching set.
        </p>
        <Grid cards={SAR_POKEMON} cols={4} />
        <p>
          The other six are Supporters: Ciphermaniac's Codebreaking, Lana's Aid, Salvatore, Eri, Bianca's Devotion and Morty's Conviction,
          which puts Gengar in the frame with Morty.
        </p>
        <Grid cards={SAR_TRAINERS} cols={4} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Nine gold cards, 251 to 259. Six are the Paradox Pokémon ex, so Raging Bolt ex, Walking Wake ex, Gouging Fire ex, Iron Crown
          ex, Iron Leaves ex and Iron Boulder ex each run from Double Rare to Super Rare, Special Art Rare and gold. The other three are
          Earthen Vessel, Buddy-Buddy Poffin and Rescue Board.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>Six Art Rares, 205 to 210. Metagross in a snowy town by Katsunori Sato and Drampa carrying two children over the rooftops by Mékayu are the standouts.</p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="ace-spec">ACE SPEC cards</h2>
        <p>
          Pokémon China makes the ACE SPEC cards a headline of Blade Awakening. These are Trainers and Energy with a pink frame and
          strong effects, and a deck can only include one. All nine sit in the main set between 176 and 203, at their own ACE
          SPEC Rare rarity, which shares the Double Rare odds band.
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
        <p>Pokémon China's charts for each pack size, in the bands they use:</p>
        <div className="table-scroll">
          <table className="data-table">
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
        <p>Applied to one box of each:</p>
        <div className="table-scroll">
          <table className="data-table">
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
          The top band holds 49 different cards: 26 Super Rares, 14 Special Art Rares and 9 Ultra Rares. Per card, the jumbo pack prints
          it about 37% more often.
        </p>

        <h2 id="parallels">Poké Ball and Master Ball holos</h2>
        <p>
          Every Common, Uncommon and Rare, 173 cards, also comes as a Poké Ball pattern holo and a Master Ball pattern holo. The card is
          the same, only the foil changes. That adds 346 cards, for 605 in a true master set. The Master Ball versions share the Double
          Rare odds band, so they are a chase of their own.
        </p>

        <h2 id="coin-set">The coin set</h2>
        <p>
          Pokémon China also released a Blade Awakening coin set: three slim packs, one featured holo from a list of 30, and a Pokémon coin
          that matches the card. Five of the 30 holos are Double Rares and 25 are Commons, Uncommons and Rares, which come as a Poké Ball
          pattern or, at 1 in 100, a Master Ball pattern. Each coin has two regular designs and a gold hidden design, printed at 1 hidden
          coin for every 99 regular ones. A Greninja coin album with 30 slots came out the same day.
        </p>
        <div className="card-grid cols-2">
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
        </div>
        <p>
          Our <Link to="/blogs/news/blade-awakening-set-guide">set guide</Link> has every secret rare and each Pokémon ex at every rarity,
          and our <Link to="/blogs/news/blade-awakening-card-origins">card origins guide</Link> matches every card to its English version.
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
          Blade Awakening is a set with real depth: six Paradox Pokémon run all the way to gold, and the akagi Greninja ex sits on
          top. The Ciphermaniac SAR is a quiet favorite that English collectors cannot get. For hits,
          the jumbo box is the better buy on the published odds.
        </p>
      </BlogPostLayout>
    </>
  )
}
