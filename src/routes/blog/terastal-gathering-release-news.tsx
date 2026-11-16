import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'terastal-gathering-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Crystal%20Gathering/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/208, Terastal Gathering`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/208 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const STELLAR = [
  { n: '104', name: 'Umbreon ex', note: 'Double Rare' },
  { n: '068', name: 'Espeon ex', note: 'Double Rare' },
  { n: '076', name: 'Sylveon ex', note: 'Double Rare' },
  { n: '140', name: 'Eevee ex', note: 'Double Rare' },
  { n: '047', name: 'Glaceon ex', note: 'Double Rare' },
  { n: '036', name: 'Vaporeon ex', note: 'Double Rare' },
]

const SAR = [
  { n: '239', name: 'Umbreon ex', note: 'SAR · YASHIRO Nanaco' },
  { n: '232', name: 'Espeon ex', note: 'SAR · sui' },
  { n: '245', name: 'Eevee ex', note: 'SAR · tono' },
  { n: '227', name: 'Glaceon ex', note: 'SAR · Kamome Shirahama' },
  { n: '226', name: 'Vaporeon ex', note: 'SAR · Narano' },
  { n: '243', name: 'Dragapult ex', note: 'SAR · Jerky' },
]

const ULTRA = [
  { n: '258', name: 'Pikachu ex', note: 'Ultra Rare' },
  { n: '259', name: 'Terapagos ex', note: 'Ultra Rare' },
  { n: '256', name: 'Teal Mask Ogerpon ex', note: 'Ultra Rare' },
]

const ACE = [
  { n: '172', name: 'Sparkling Crystal', note: 'ACE SPEC' },
  { n: '168', name: 'Prime Catcher', note: 'ACE SPEC' },
  { n: '208', name: 'Legacy Energy', note: 'ACE SPEC' },
]

// Pokémon China's odds chart. The three shares are grouped bands of the whole print run.
const ODDS = [
  { band: 'Common, Uncommon and Rare', share: '85.60%', box: 'about 86' },
  { band: 'Double Rare, ACE SPEC, Poké Ball and Master Ball pattern holos', share: '13.00%', box: 'about 13' },
  { band: 'Special Art Rare, Super Rare and Ultra Rare', share: '1.40%', box: 'about 1.4' },
]

const TOC = [
  { id: 'sylveon', label: 'A second Sylveon ex, only in Chinese' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'stellar-eeveelutions', label: 'The Stellar Eeveelutions' },
  { id: 'more-than-prismatic', label: 'More than Prismatic Evolutions' },
  { id: 'ace-spec', label: 'ACE SPEC cards' },
  { id: 'packs-and-boxes', label: 'Packs, boxes and odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Is Terastal Gathering the Chinese Prismatic Evolutions?',
    a: 'Yes, it is the Simplified Chinese counterpart. 156 of its 259 cards share their art with Prismatic Evolutions, and the rest come from other Scarlet & Violet sets, English promos and two new arts.',
  },
  {
    q: 'What is in a Terastal Gathering pack?',
    a: 'Ten cards: either 7 non-holo and 3 holo, or 6 non-holo and 4 holo. A booster box holds 10 packs.',
  },
  {
    q: 'What is the Chinese exclusive card?',
    a: 'Sylveon ex 234/208, a Special Art Rare by rika. The set has two Sylveon ex SARs: 233/208 matches Prismatic Evolutions, and 234/208 is the one you will only find in Chinese.',
  },
  {
    q: 'What are the chase cards?',
    a: 'Umbreon ex 239/208 is the headline Special Art Rare, followed by the other Eeveelution SARs, the two Eevee ex SARs and the gold Pikachu ex 258/208.',
  },
  {
    q: 'How many big hits are in a box?',
    a: 'Special Art Rares, Super Rares and Ultra Rares are 1.40% of the print run, which works out to roughly 1.4 per 100-card box, or about one in every 7 packs. These are averages.',
  },
]

export const Route = createFileRoute('/blog/terastal-gathering-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
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
  component: TerastalGatheringReleasePost,
})

function TerastalGatheringReleasePost() {
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
        updated={status.liveAt}
        wide
        post={post}
        lede="Eevee and all eight Eeveelutions arrive as Stellar Tera ex in China's take on Prismatic Evolutions, with a few cards English never put in a booster pack."
        cta={{
          heading: 'Shop Terastal Gathering',
          body: 'Booster boxes in stock now, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-terastal-gathering-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/terastal-gathering-csv9-5', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Terastal Gathering (太晶盛聚) released on June 12, 2026. It is the special set between Stellar Crystal and Chasing Glory, and
          the Simplified Chinese counterpart to Prismatic Evolutions: Eevee and its evolutions in Stellar Tera form, a deep run of
          Special Art Rares, and 10-card packs with three or four holos in every one. It also has a Sylveon ex Special Art Rare that
          is only in the Chinese set.
        </p>

        <aside className="fact-box" aria-label="Terastal Gathering key facts">
          <img
            src={`${SITE_URL}/assets/blog/terastal-gathering-booster-pack.webp`}
            alt="Terastal Gathering booster pack with Eevee, Umbreon and Sylveon on the front"
            loading="lazy"
            width={600}
            height={1128}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Terastal Gathering (太晶盛聚)</dd>
              <dt>Set code</dt>
              <dd>CSV9.5C</dd>
              <dt>Released</dt>
              <dd>June 12, 2026</dd>
              <dt>Pack</dt>
              <dd>10 cards: 7 non-holo and 3 holo, or 6 and 4</dd>
              <dt>Booster box</dt>
              <dd>10 packs, 100 cards</dd>
              <dt>Set size</dt>
              <dd>259 cards: 208 in the main set, 51 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Umbreon ex SAR, Eevee ex SARs, Chinese-exclusive Sylveon ex SAR</dd>
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

        <h2 id="sylveon">A second Sylveon ex, only in Chinese</h2>
        <p>
          Sylveon ex has two Special Art Rares here. 233/208 by Cona Nitanda is the same card as in Prismatic Evolutions. 234/208 by
          rika is new: Pokémon China calls it a special addition to this set, and there is no English version of it. If you are
          buying a single, check the number.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={cardImg('233')} alt="Sylveon ex 233/208 Special Art Rare, Terastal Gathering" loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>Sylveon ex</strong>233/208 · SAR · Cona Nitanda
            </figcaption>
          </figure>
          <figure>
            <img src={cardImg('234')} alt="Sylveon ex 234/208 Special Art Rare, Chinese exclusive" loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>Sylveon ex</strong>234/208 · SAR · rika · Chinese exclusive
            </figcaption>
          </figure>
        </div>

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Thirty-four Special Art Rares, 221 to 254, are the heart of the set. Pokémon China splits them into
          28 Pokémon SARs and 6 Trainer SARs. Eevee ex and all eight of its evolutions get one, in Stellar Tera form, with two
          each for Eevee ex and Sylveon ex. They sit alongside favorites like Dragapult ex, Iron Hands ex and Terapagos ex.
        </p>
        <Grid cards={SAR} cols={3} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Five gold cards top the set, 255 to 259: Iron Leaves ex, Teal Mask Ogerpon ex, Walking Wake ex, Pikachu ex and Terapagos ex.
          The gold Pikachu ex is the only Pikachu in the whole set.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="stellar-eeveelutions">The Stellar Eeveelutions</h2>
        <p>
          In the main set, the Eeveelutions are nine Stellar Tera ex: Eevee ex and all eight of its evolutions. Eevee ex can evolve
          straight into any of the others, which is what makes the line playable. Each of these Double Rares also has a Special Art
          Rare in the secret block.
        </p>
        <Grid cards={STELLAR} cols={3} />
        <p className="table-note">Leafeon ex 006, Flareon ex 023 and Jolteon ex 058 complete the nine.</p>

        <h2 id="more-than-prismatic">More than Prismatic Evolutions</h2>
        <p>
          Terastal Gathering has 259 cards against Prismatic Evolutions' 180. Its main set adds Double Rares that Prismatic Evolutions
          only has as Special Art Rares or gold cards, like Gholdengo ex and Pecharunt ex, plus Garchomp ex and Gouging Fire ex, which
          Prismatic Evolutions does not have at all. Nine of these Double Rares, including Roaring Moon ex, Raging Bolt ex, Walking Wake
          ex and Bloodmoon Ursaluna ex, use art that English only released as Black Star promos, not the art from their original sets.
          Garchomp ex has brand-new art. Our <Link to="/blog/terastal-gathering-card-origins">card origins guide</Link>{' '}
          maps every card.
        </p>

        <h2 id="ace-spec">ACE SPEC cards</h2>
        <p>
          Eight ACE SPEC cards sit inside the main set, each with a pink frame and a one-per-deck rule: Max Rod, Treasure Tracker, Prime
          Catcher, Scoop Up Cyclone, Sparkling Crystal, Maximum Belt, Neutralization Zone and Legacy Energy. They are a rarity of their
          own, ranked above Double Rare and the Poké Ball pattern holos on Pokémon China's chart.
        </p>
        <Grid cards={ACE} cols={3} />

        <h2 id="packs-and-boxes">Packs, boxes and odds</h2>
        <p>
          Every pack has 10 cards, with either three or four holos. A box of 10 packs gives you 100 cards and somewhere between 30 and 40
          holos. Pokémon China groups its odds into three bands:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Share of print</th>
                <th scope="col">Per 100-card box</th>
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
        <p className="table-note">Averages from the official print shares. Individual boxes vary.</p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, and Pokémon China notes they
          use a special finish in this set. With those, there are 601 different cards to collect. The{' '}
          <Link to="/blog/terastal-gathering-set-guide">set guide</Link> covers the full checklist.
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
          If you love Eevee, this is the set. The Stellar Eeveelution SARs are some of the best-looking cards of the era, and Chinese
          adds a Sylveon ex SAR that English collectors cannot pull. With three or four holos in every pack, it is also just a fun box to
          open.
        </p>
      </BlogPostLayout>
    </>
  )
}
