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

const post = BLOG_POSTS.find((p) => p.slug === 'brilliant-fantasy-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Brilliant%20Fantasy/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The Chinese Exclusive: the Carmine Special Art Rare 255.
const CHINESE_EXCLUSIVE = new Set(['255'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/207, Brilliant Fantasy`} loading="lazy" width={300} height={419} />
            <figcaption>
              {CHINESE_EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/207 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const MILOTIC = [
  { n: '244', name: 'Milotic ex', note: 'Special Art Rare · Kuroimori' },
  { n: '217', name: 'Milotic ex', note: 'Super Rare · N-DESIGN Inc.' },
  { n: '057', name: 'Milotic ex', note: 'Double Rare · hncl' },
]

const CARMINE = [
  { n: '255', name: 'Carmine', note: 'Special Art Rare · OKACHEKE' },
  { n: '240', name: 'Carmine', note: 'Super Rare · kantaro' },
]

const SAR_POKEMON = [
  { n: '242', name: 'Teal Mask Ogerpon ex', note: 'Special Art Rare · Yano Keiji' },
  { n: '245', name: 'Wellspring Mask Ogerpon ex', note: 'Special Art Rare · Yano Keiji' },
  { n: '243', name: 'Hearthflame Mask Ogerpon ex', note: 'Special Art Rare · Yano Keiji' },
  { n: '246', name: 'Cornerstone Mask Ogerpon ex', note: 'Special Art Rare · Yano Keiji' },
  { n: '250', name: 'Pecharunt ex', note: 'Special Art Rare · kantaro' },
  { n: '247', name: 'Okidogi ex', note: 'Special Art Rare · kantaro' },
  { n: '248', name: 'Munkidori ex', note: 'Special Art Rare · kantaro' },
  { n: '249', name: 'Fezandipiti ex', note: 'Special Art Rare · kantaro' },
]

const SAR_OTHERS = [
  { n: '251', name: 'Bloodmoon Ursaluna ex', note: 'Special Art Rare · MINAMINAMI Take' },
  { n: '254', name: 'Kieran', note: 'Special Art Rare · Teeziro' },
  { n: '253', name: 'Perrin', note: 'Special Art Rare · GIDORA' },
  { n: '252', name: 'Cassiopeia', note: 'Special Art Rare · burari' },
]

const ULTRA = [
  { n: '256', name: 'Teal Mask Ogerpon ex', note: 'Ultra Rare · 5ban Graphics' },
  { n: '257', name: 'Pecharunt ex', note: 'Ultra Rare · aky CG Works' },
  { n: '258', name: 'Bloodmoon Ursaluna ex', note: 'Ultra Rare · aky CG Works' },
]

const ART_RARES = [
  { n: '209', name: 'Feebas', note: 'Art Rare · Kuroimori' },
  { n: '208', name: 'Larvesta', note: 'Art Rare · Whisker' },
  { n: '213', name: 'Fraxure', note: 'Art Rare · MINAMINAMI Take' },
  { n: '210', name: 'Duskull', note: 'Art Rare · James Turner' },
  { n: '211', name: 'Dusclops', note: 'Art Rare · James Turner' },
  { n: '212', name: 'Dusknoir', note: 'Art Rare · James Turner' },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '13.82%', jumbo: '22.11%' },
  { band: 'Double Rare, Art Rare, ACE SPEC Rare and Master Ball pattern holo', slim: '5.45%', jumbo: '6.89%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const BLOCKS = [
  { nos: '001 to 172', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '173 to 207', what: 'Items, Pokémon Tools, Supporters, Stadiums and Special Energy', rarity: 'Common, Uncommon, plus 9 ACE SPEC' },
  { nos: '208 to 213', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '214 to 241', what: 'Super Rare full arts of 18 ex and 10 Supporters', rarity: 'Super Rare' },
  { nos: '242 to 255', what: 'Special Art Rares of 10 ex and 4 Supporters', rarity: 'Special Art Rare' },
  { nos: '256 to 264', what: 'Gold Ultra Rares', rarity: 'Ultra Rare' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'milotic', label: 'Milotic ex' },
  { id: 'carmine', label: 'Chinese Exclusive: Carmine' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'set-and-odds', label: 'How the set is built, and the odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Brilliant Fantasy released?',
    a: 'March 13, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Who is on the Brilliant Fantasy pack?',
    a: 'Milotic. Milotic ex comes as a Double Rare, a Super Rare and a Special Art Rare. The Special Art Rare is by Kuroimori, who also drew the Art Rare of its pre-evolution, Feebas.',
  },
  {
    q: 'What is the Chinese Exclusive in Brilliant Fantasy?',
    a: 'Carmine 255/207, a Special Art Rare by OKACHEKE that shows Carmine and Kieran sitting together with slices of watermelon. English has a Carmine Special Illustration Rare, but not with this illustration.',
  },
  {
    q: 'What is the difference between the slim and jumbo Brilliant Fantasy packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, but the jumbo pack has better published odds for every holo rarity group.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs).",
  },
  {
    q: 'Where do the Brilliant Fantasy illustrations come from?',
    a: 'Mostly from four English sets. Twilight Masquerade matches 109 of its 264 cards and Shrouded Fable matches 76, with 38 more from Surging Sparks and 32 from Stellar Crown. The other 8 come from four English sources, and one card is the new Chinese Exclusive.',
    link: { to: '/sets/chinese/brilliant-fantasy-csv8', before: 'See every card on the ', label: 'Brilliant Fantasy card list', after: '.' },
  },
  {
    q: 'How many cards are in Brilliant Fantasy?',
    a: '264 numbered cards: 207 in the main set and 57 secret rares. With the Poké Ball and Master Ball pattern holos of all 176 Commons, Uncommons and Rares, there are 616 different cards.',
  },
  {
    q: 'Is Brilliant Fantasy also sold under other names?',
    a: 'Yes. The set has no official English name, so shops translate it differently. Sparkling Fantasy and Bright Fantasy are the same set, CSV8C.',
  },
]

export const Route = createFileRoute('/blog/brilliant-fantasy-release-news')({
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
  component: BrilliantFantasyReleasePost,
})

function BrilliantFantasyReleasePost() {
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
        lede="Milotic takes the cover of Brilliant Fantasy, the Kitakami set with four Ogerpon ex and the Loyal Three, plus a Chinese Exclusive Carmine Special Art Rare."
        cta={{
          heading: 'Shop Brilliant Fantasy',
          body: 'Slim and jumbo booster boxes, plus the full card list with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-slim-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Brilliant Fantasy (<Zh>璀璨诡幻</Zh>, set code CSV8C) released on March 13, 2026. Milotic is on the pack, and the set is built
          around Kitakami. It has all four masks of Ogerpon ex, Okidogi ex, Munkidori ex, Fezandipiti ex and Pecharunt ex, with Kieran,
          Carmine and Perrin as Supporters. The Chinese Exclusive is a Carmine Special Art Rare with a new illustration.
        </p>
        <p>
          Our <Link to="/blog/brilliant-fantasy-set-guide">set guide</Link> shows every secret rare and the box odds, and our{' '}
          <Link to="/blog/brilliant-fantasy-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <aside className="fact-box" aria-label="Brilliant Fantasy key facts">
          <img
            src={`${SITE_URL}/assets/blog/brilliant-fantasy-slim-pack.webp`}
            alt="Brilliant Fantasy slim booster pack with Milotic on the front"
            loading="lazy"
            width={600}
            height={1126}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Brilliant Fantasy (<Zh>璀璨诡幻</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV8C</dd>
              <dt>Released</dt>
              <dd>March 13, 2026</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo. 6 packs per box</dd>
              <dt>Set size</dt>
              <dd>264 cards: 207 in the main set, 57 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>The Special Art Rares of Milotic ex, Carmine, the four Ogerpon ex and Pecharunt ex</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Carmine Special Art Rare 255/207</dd>
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
          Brilliant Fantasy comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is
          20 cards with six holos. Pokémon China published an odds chart for each, and the jumbo pack is better at every holo level.
          Super Rares, Special Art Rares and Ultra Rares are 1.00% of jumbo cards against 0.73% of slim cards. That works out to about
          one of those cards every 5 jumbo packs, against one every 27 slim packs.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/brilliant-fantasy-slim-pack.webp`} alt="Brilliant Fantasy slim pack, 5 cards" loading="lazy" width={600} height={1126} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/brilliant-fantasy-jumbo-pack.webp`} alt="Brilliant Fantasy jumbo pack, 20 cards" loading="lazy" width={600} height={1198} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          A jumbo box (6 packs, 120 cards, 36 holos) averages about 1.2 Super Rares, Special Art Rares or Ultra Rares. A slim box (15
          packs, 75 cards, 15 holos) averages about half of one. The full numbers are in{' '}
          <a href="#set-and-odds">How the set is built, and the odds</a> below.
        </p>

        <h2 id="milotic">Milotic ex</h2>
        <p>
          Milotic is the pack Pokémon. Milotic ex is a Stage 1 Water Pokémon with 270 HP, and its Ability stops all damage and effects
          from attacks by your opponent's Tera Pokémon. It comes at three rarities, and the Special Art Rare by Kuroimori is the one
          most collectors want. Kuroimori also drew the Feebas Art Rare.
        </p>
        <Grid cards={MILOTIC} cols={3} />

        <h2 id="carmine">Chinese Exclusive: Carmine</h2>
        <p>
          Carmine 255/207 is a Special Art Rare with a new illustration by OKACHEKE. It shows Carmine and her brother Kieran sitting
          side by side in bright sunlight, each with a slice of watermelon. English has a Carmine Special Illustration Rare with a
          different illustration, and that one is not in this set. The Carmine Super Rare by kantaro is in this set too.
        </p>
        <Grid cards={CARMINE} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          There are fourteen Special Art Rares, numbered 242 to 255: ten Pokémon ex and four Supporters. Milotic ex and Carmine are
          shown above. The four Ogerpon ex are a matching set by Yano Keiji, and kantaro drew Pecharunt ex, Okidogi ex, Munkidori ex
          and Fezandipiti ex as another.
        </p>
        <Grid cards={SAR_POKEMON} cols={4} />
        <p>The other four are Bloodmoon Ursaluna ex and the Supporters Kieran, Perrin and Cassiopeia.</p>
        <Grid cards={SAR_OTHERS} cols={4} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          There are nine gold Ultra Rares, numbered 256 to 264. Three are Pokémon ex: Teal Mask Ogerpon ex, Pecharunt ex and Bloodmoon Ursaluna ex. The other six
          are Enhanced Hammer, Bravery Charm, Gravity Mountain, Jamming Tower, Jet Energy and Luminous Energy.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          There are six Art Rares, numbered 208 to 213. Feebas is by Kuroimori, the artist behind the Milotic ex Special Art Rare, and James Turner drew
          Duskull, Dusclops and Dusknoir as a set of three.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="set-and-odds">How the set is built, and the odds</h2>
        <p>
          Every card has one number out of 207. The main set runs 001 to 207, with nine pink ACE SPEC cards among the Trainers and
          Energy, and everything above 207 is a secret rare. The rarer versions of a card sit in the secret block at unrelated numbers,
          so match them by name.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">How the set is built, and the odds: Numbers, What they are, Rarity</caption>
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
        <p>These are Pokémon China's odds charts for each pack size, in the rarity groups they use:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">How the set is built, and the odds: Share of print, Slim, Jumbo</caption>
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
          Applied to one box, a slim box averages about 10 Poké Ball pattern holos and Rares, about 4 cards from the Double Rare rarity
          group and about 0.55 Super Rares or better. A jumbo box averages about 26 to 27, about 8 and about 1.2.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a Master Ball pattern holo, 176 of each. The card is
          the same, only the holo pattern changes, which brings a true master set to 616 cards. The Master Ball versions share a rarity
          group with the Double Rares, so they take a long time to collect.
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
          Brilliant Fantasy is the set for Kitakami fans, with every Ogerpon mask and the Loyal Three at Special Art Rare. The Milotic
          ex Special Art Rare matches the pack, and the Carmine Special Art Rare does not exist in English with this illustration. If
          you are opening for Super Rares and above, the jumbo box is the better buy on the published odds.
        </p>
      </BlogPostLayout>
    </>
  )
}
