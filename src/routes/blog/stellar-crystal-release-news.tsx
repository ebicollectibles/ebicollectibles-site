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

const post = BLOG_POSTS.find((p) => p.slug === 'stellar-crystal-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Stellar%20Crystal/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The Chinese Exclusive: the Lisia's Appeal SAR 257.
const CHINESE_EXCLUSIVE = new Set(['257'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/208, Stellar Crystal`} loading="lazy" width={300} height={419} />
            <figcaption>
              {CHINESE_EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.n}/208 · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const LISIA = [
  { n: '257', name: "Lisia's Appeal", note: 'SAR · En Morikura' },
  { n: '241', name: "Lisia's Appeal", note: 'Super Rare · En Morikura' },
]

const SAR = [
  { n: '245', name: 'Pikachu ex', note: 'SAR · GIDORA' },
  { n: '251', name: 'Terapagos ex', note: 'SAR · Saboteri' },
  { n: '247', name: 'Latias ex', note: 'SAR · OKACHEKE' },
  { n: '248', name: 'Hydreigon ex', note: 'SAR · AKIRA EGAWA' },
  { n: '250', name: 'Alolan Exeggutor ex', note: 'SAR · Yuriko Akase' },
  { n: '249', name: 'Archaludon ex', note: 'SAR · Shinya Mizuno' },
  { n: '253', name: "Clemont's Quick Wit", note: 'SAR · Shinya Mizuno' },
  { n: '254', name: 'Lacey', note: 'SAR · Souichirou Gunjima' },
]

const ULTRA = [
  { n: '260', name: 'Pikachu ex', note: 'Ultra Rare' },
  { n: '262', name: 'Terapagos ex', note: 'Ultra Rare' },
  { n: '259', name: 'Lapras ex', note: 'Ultra Rare' },
  { n: '258', name: 'Cinderace ex', note: 'Ultra Rare' },
  { n: '261', name: 'Alolan Exeggutor ex', note: 'Ultra Rare' },
  { n: '266', name: 'Area Zero Underdepths', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '212', name: 'Zorua', note: 'Art Rare · REND' },
  { n: '211', name: 'Cresselia', note: 'Art Rare · satoma' },
  { n: '214', name: 'Noctowl', note: 'Art Rare · Tetsu Kayama' },
  { n: '210', name: 'Zeraora', note: 'Art Rare · Kazumasa Yasukuni' },
  { n: '209', name: 'Turtonator', note: 'Art Rare · Yukihiro Tada' },
  { n: '213', name: 'Archaludon', note: 'Art Rare · Toshinao Aoki' },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '13.82%', jumbo: '22.11%' },
  { band: 'Double Rare, Art Rare, ACE SPEC and Master Ball pattern holo', slim: '5.45%', jumbo: '6.89%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const BLOCKS = [
  { nos: '001 to 175', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '176 to 208', what: 'Items, Tools, Supporters, Stadiums, Special Energy', rarity: 'C, U, ACE' },
  { nos: '209 to 214', what: 'Art Rares', rarity: 'AR' },
  { nos: '215 to 241', what: 'Super Rare full arts of 18 ex and 9 Supporters', rarity: 'SR' },
  { nos: '242 to 257', what: 'Special Art Rares of 10 ex and 6 Supporters', rarity: 'SAR' },
  { nos: '258 to 266', what: 'Gold Ultra Rares', rarity: 'UR' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'lisia', label: "Chinese Exclusive: Lisia's Appeal" },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'set-and-odds', label: 'How the set is built, and the odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Stellar Crystal released?',
    a: 'May 15, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What is the Chinese Exclusive in Stellar Crystal?',
    a: "Lisia's Appeal 257/208, a Special Art Rare by En Morikura showing Lisia and her Altaria performing on stage in front of a crowd. English has a Lisia's Appeal Special Illustration Rare, but with different art.",
  },
  {
    q: 'What is the difference between the slim and jumbo Stellar Crystal packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, and Pokémon China published a better odds chart for the jumbo pack.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs).",
  },
  {
    q: 'Where do the Stellar Crystal illustrations come from?',
    a: 'Mostly from English Surging Sparks (160 cards) and Stellar Crown (79). The rest match Shrouded Fable (10), Twilight Masquerade (8), SV Black Star Promos (6) and Prismatic Evolutions (2), plus one Chinese Exclusive.',
    link: { to: '/sets/chinese/stellar-crystal-csv9', before: 'See every card on the ', label: 'Stellar Crystal card list', after: '.' },
  },
  {
    q: 'Who is on the Stellar Crystal pack?',
    a: 'Pikachu, as a Stellar Tera Pokémon. Pikachu ex comes as a Double Rare, a Super Rare, a Special Art Rare by GIDORA and a gold Ultra Rare.',
  },
  {
    q: 'How many cards are in Stellar Crystal?',
    a: '266 numbered cards: 208 in the main set and 58 secret rares. With the Poké Ball and Master Ball pattern holos of all 177 Commons, Uncommons and Rares, there are 620 different cards.',
  },
]

export const Route = createFileRoute('/blog/stellar-crystal-release-news')({
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
  component: StellarCrystalReleasePost,
})

function StellarCrystalReleasePost() {
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
        lede="Stellar Tera Pikachu ex takes the cover of Stellar Crystal, the Terapagos set, with a Chinese Exclusive Lisia's Appeal Special Art Rare."
        cta={{
          heading: 'Collect Stellar Crystal',
          body: 'Browse all 266 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/stellar-crystal-csv9', label: 'See the full card list' }],
        }}
      >
        <p>
          Stellar Crystal (<Zh>星彩晶璃</Zh>, set code CSV9C) released on May 15, 2026. It brings the new Stellar Tera type into Chinese, led by a Stellar Tera
          Pikachu ex on the pack and the Legendary Terapagos ex. Stellar Pokémon ex have attacks that need three different Energy types
          to use. Blueberry Academy's Crispin, Drayton and Lacey join as Supporters, and a new Lisia's Appeal Special Art Rare is the
          set's Chinese Exclusive.
        </p>

        <aside className="fact-box" aria-label="Stellar Crystal key facts">
          <img
            src={`${SITE_URL}/assets/blog/stellar-crystal-slim-pack.webp`}
            alt="Stellar Crystal slim booster pack with Stellar Tera Pikachu on the front"
            loading="lazy"
            width={600}
            height={1128}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Stellar Crystal (<Zh>星彩晶璃</Zh>)</dd>
              <dt>Set code</dt>
              <dd>CSV9C</dd>
              <dt>Released</dt>
              <dd>May 15, 2026</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>266 cards: 208 in the main set, 58 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Pikachu ex SAR and Ultra Rare, Lisia's Appeal SAR, Terapagos ex SAR</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Lisia's Appeal SAR 257/208</dd>
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
          Stellar Crystal comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is 20
          cards with six holos. Pokémon China published a separate odds chart for each, and the jumbo pack is better at every holo
          level.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/stellar-crystal-slim-pack.webp`} alt="Stellar Crystal slim pack, 5 cards" loading="lazy" width={600} height={1128} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/stellar-crystal-jumbo-pack.webp`} alt="Stellar Crystal jumbo pack, 20 cards" loading="lazy" width={600} height={1197} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The top band (Super Rare, Special Art Rare and Ultra Rare) is 1.00% of jumbo cards against 0.73% of slim cards, about 37% more
          per card. In practice that is roughly one top-band card in every 5 jumbo packs, against one in every 27 slim packs. The full
          odds are further down.
        </p>

        <h2 id="lisia">Chinese Exclusive: Lisia's Appeal</h2>
        <p>
          Lisia's Appeal 257/208 is a Special Art Rare drawn for this set by En Morikura. Lisia and her Altaria perform together on a
          stage under spotlights, with the crowd below full of lights. English has a Lisia's Appeal Special Illustration Rare with different art,
          and it is not in this set. The Super Rare, also by En Morikura, is here too.
        </p>
        <Grid cards={LISIA} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Sixteen Special Art Rares, 242 to 257: ten Pokémon ex and six Supporters. Pikachu ex by GIDORA is the headline, with Terapagos
          ex, Latias ex and Hydreigon ex close behind.
        </p>
        <Grid cards={SAR} cols={4} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Nine gold cards, 258 to 266. Five are Pokémon ex: Cinderace ex, Lapras ex, Pikachu ex, Alolan Exeggutor ex and Terapagos ex.
          The other four are Night Stretcher, Counter Gain, Powerglass and Area Zero Underdepths.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>Six Art Rares, 209 to 214, each a full illustration of a main-set Pokémon.</p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="set-and-odds">How the set is built, and the odds</h2>
        <p>
          Every card has one number out of 208. The main set runs 001 to 208, with nine pink ACE SPEC cards among the Trainers and
          Energy, and everything above 208 is a secret rare. The rarer versions of a card sit in the secret block at unrelated numbers,
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
        <p>Pokémon China's odds charts for each pack size:</p>
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
          Over 15 slim packs (75 cards) that averages about 0.55 top-band cards and about 4 from the Double Rare band. Over 6 jumbo
          packs (120 cards) it averages about 1.2 and about 8.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a Master Ball pattern holo, 177 of each. The card is
          the same, only the holo pattern changes, which brings a true master set to 620 cards. The Master Ball versions share the Double Rare
          band, so they are a real chase on their own. Our <Link to="/blog/stellar-crystal-set-guide">set guide</Link> has every
          chase card and the box math, and our <Link to="/blog/stellar-crystal-card-origins">card origins guide</Link> matches
          every card to its English version.
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
          Stellar Crystal is a Pikachu set first, and the GIDORA Special Art Rare and the gold Pikachu ex are the cards most collectors
          will chase. The Lisia's Appeal SAR gives the Chinese version something English does not have, and with six Supporter SARs there is
          plenty here for Trainer collectors too. If you are opening for hits, the jumbo pack has
          the better odds.
        </p>
      </BlogPostLayout>
    </>
  )
}
