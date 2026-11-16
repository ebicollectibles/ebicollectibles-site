import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'true-mystery-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/True%20Mystic/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The Chinese Exclusive: the Iron Hands ex SAR 152.
const CHINESE_EXCLUSIVE = new Set(['152'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/128, True Mystery`} loading="lazy" width={300} height={419} />
          <figcaption>
            {CHINESE_EXCLUSIVE.has(c.n) && <ChineseExclusiveBadge />}
            <strong>{c.name}</strong>
            {c.n}/128 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const EXCLUSIVE = [
  { n: '152', name: 'Iron Hands ex', note: 'SAR · Tonji Matsuno' },
  { n: '051', name: 'Iron Hands ex', note: 'Double Rare · PLANETA Mochizuki' },
]

const SAR = [
  { n: '155', name: 'Roaring Moon ex', note: 'SAR · Ryota Murayama' },
  { n: '153', name: 'Iron Valiant ex', note: 'SAR · kantaro' },
  { n: '159', name: 'Tulip', note: 'SAR · AKIRA EGAWA' },
  { n: '157', name: 'Geeta', note: 'SAR · DOM' },
  { n: '156', name: "Professor Sada's Vitality", note: 'SAR · Ryota Murayama' },
  { n: '158', name: "Professor Turo's Scenario", note: 'SAR · Atsushi Furusawa' },
]

const SUPER = [
  { n: '144', name: 'Roaring Moon ex', note: 'Super Rare · takuyoa' },
  { n: '142', name: 'Iron Valiant ex', note: 'Super Rare · aky CG Works' },
  { n: '151', name: 'Tulip', note: 'Super Rare · Naoki Saito' },
  { n: '147', name: 'Geeta', note: 'Super Rare · kirisAki' },
]

const ULTRA = [
  { n: '161', name: 'Roaring Moon ex', note: 'Ultra Rare · takuyoa' },
  { n: '160', name: 'Iron Valiant ex', note: 'Ultra Rare · aky CG Works' },
  { n: '162', name: 'Counter Catcher', note: 'Ultra Rare · Toyste Beach' },
  { n: '163', name: 'Pal Pad', note: 'Ultra Rare · Studio Bora Inc.' },
]

const ART_RARES = [
  { n: '131', name: 'Espathra', note: 'Art Rare · AKIRA EGAWA' },
  { n: '136', name: 'Iron Jugulis', note: 'Art Rare · GIDORA' },
  { n: '133', name: 'Slither Wing', note: 'Art Rare · Takeshi Nakamura' },
  { n: '135', name: 'Brute Bonnet', note: 'Art Rare · Tomokazu Komiya' },
  { n: '129', name: 'Iron Moth', note: 'Art Rare · Takeshi Nakamura' },
  { n: '130', name: 'Veluza', note: 'Art Rare · Shibuzoh.' },
  { n: '132', name: 'Garganacl', note: 'Art Rare · kodama' },
  { n: '134', name: 'Garbodor', note: 'Art Rare · Shinya Komatsu' },
]

const BLOCKS = [
  { nos: '001 to 113', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '114 to 128', what: 'Items, Pokémon Tools, Supporters and Stadiums', rarity: 'U (Geeta is R)' },
  { nos: '129 to 136', what: 'Art Rares', rarity: 'AR' },
  { nos: '137 to 151', what: 'Super Rare full arts of 9 ex and 6 Supporters', rarity: 'SR' },
  { nos: '152 to 159', what: 'Special Art Rares of 4 ex and 4 Supporters', rarity: 'SAR' },
  { nos: '160 to 163', what: 'Gold Ultra Rares', rarity: 'UR' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'iron-hands', label: 'Chinese Exclusive: Iron Hands ex SAR' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'super-rares', label: 'Super Rare full arts' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'set-structure', label: 'How the set is numbered' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was True Mystery released?',
    a: 'November 7, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What is the Chinese Exclusive in True Mystery?',
    a: 'The Iron Hands ex Special Art Rare 152/128 by Tonji Matsuno. It is new art for this set, and it has no English version.',
  },
  {
    q: 'What is the difference between the slim and jumbo boxes?',
    a: 'A slim box has 15 packs of 5 cards, 75 cards with 15 holos. A jumbo box has 6 packs of 20 cards, 120 cards with 36 holos. Both pull from the same card list.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs).",
  },
  {
    q: 'Where does the True Mystery artwork come from?',
    a: 'Mostly from Paradox Rift: 128 of its 163 cards match it. The rest come from Obsidian Flames (16), Paldean Fates (15), 151 (1) and an SV Black Star Promo (1), plus 2 cards with no English version.',
    link: { to: '/sets/chinese/true-mystery-csv6', before: 'See every card on the ', label: 'True Mystery card list', after: '.' },
  },
  {
    q: 'Who is on the True Mystery pack?',
    a: 'Iron Valiant, a Future Paradox Pokémon. The set is built around Ancient and Future Paradox Pokémon and the Trainer cards that support them.',
  },
  {
    q: 'How many cards are in True Mystery?',
    a: '163 numbered cards: 128 in the main set and 35 secret rares, from Art Rare up to the four gold Ultra Rares.',
  },
]

export const Route = createFileRoute('/blog/true-mystery-release-news')({
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
  component: TrueMysteryReleasePost,
})

function TrueMysteryReleasePost() {
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
        lede="Iron Valiant takes the pack and the Paradox Pokémon take over the set. True Mystery brings Roaring Moon ex, Iron Valiant ex and a Chinese Exclusive Iron Hands ex Special Art Rare."
        cta={{
          heading: 'Shop True Mystery',
          body: 'Slim and jumbo booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-true-mystery-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-true-mystery-slim-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          True Mystery (真实玄虚) released on November 7, 2025. It is the CSV6C set of the Chinese Scarlet & Violet series, and it is all
          about the Paradox Pokémon from Area Zero: Ancient forms like Roaring Moon and Sandy Shocks, Future forms like Iron Valiant and
          Iron Hands, and the Ancient and Future Trainer cards built to support them. Iron Valiant is on the pack, and the Iron Hands ex
          Special Art Rare is the set's Chinese Exclusive.
        </p>

        <aside className="fact-box" aria-label="True Mystery key facts">
          <img
            src={`${SITE_URL}/assets/blog/true-mystery-slim-pack.webp`}
            alt="True Mystery slim booster pack with Iron Valiant on the front"
            loading="lazy"
            width={600}
            height={1127}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>True Mystery (真实玄虚)</dd>
              <dt>Set code</dt>
              <dd>CSV6C</dd>
              <dt>Released</dt>
              <dd>November 7, 2025</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo. 6 packs per box</dd>
              <dt>Set size</dt>
              <dd>163 cards: 128 in the main set, 35 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Roaring Moon ex SAR, Iron Valiant ex SAR, Iron Hands ex SAR</dd>
              <dt>Chinese Exclusive</dt>
              <dd>Iron Hands ex SAR 152/128</dd>
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
          True Mystery comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is 20
          cards with six holos. A slim box is 15 packs, 75 cards and 15 holos. A jumbo box is 6 packs, 120 cards and 36 holos, so it
          holds more than twice the holos of a slim box.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${SITE_URL}/assets/blog/true-mystery-slim-pack.webp`} alt="True Mystery slim pack, 5 cards" loading="lazy" width={600} height={1127} />
            <figcaption>
              <strong>Slim pack</strong>5 cards · 1 holo
            </figcaption>
          </figure>
          <figure>
            <img src={`${SITE_URL}/assets/blog/true-mystery-jumbo-pack.webp`} alt="True Mystery jumbo pack, 20 cards" loading="lazy" width={600} height={1196} />
            <figcaption>
              <strong>Jumbo pack</strong>20 cards · 6 holo
            </figcaption>
          </figure>
        </div>
        <p>
          Pokémon China published an odds chart for each pack size. Super Rares, Special Art Rares and Ultra Rares together are 0.73% of
          slim-pack cards and 1.00% of jumbo-pack cards: about one every 27 slim packs, against one every 5 jumbo packs. That averages
          about 0.55 per slim box and 1.2 per jumbo box. Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a
          Master Ball pattern holo, 115 of each.
        </p>

        <h2 id="iron-hands">Chinese Exclusive: Iron Hands ex SAR</h2>
        <p>
          Iron Hands ex 152/128 is the Chinese Exclusive, a Special Art Rare with no English version. Tonji Matsuno draws it in a
          burst of yellow and blue light, mid-punch. English has Iron Hands ex in Paradox Rift, including its own Special Illustration
          Rare, but not this art. The regular Double Rare by PLANETA Mochizuki is in the set too.
        </p>
        <Grid cards={EXCLUSIVE} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Eight Special Art Rares, 152 to 159. Roaring Moon ex by Ryota Murayama and Iron Valiant ex by kantaro head the Pokémon, with
          Sandy Shocks ex and Iron Hands ex alongside. The Supporters are Tulip by AKIRA EGAWA, Geeta, Professor Sada's Vitality and
          Professor Turo's Scenario.
        </p>
        <Grid cards={SAR} cols={3} />

        <BuyStrip />

        <h2 id="super-rares">Super Rare full arts</h2>
        <p>
          Fifteen Super Rares, 137 to 151: full arts of nine Pokémon ex, including Roaring Moon ex, Iron Valiant ex and Tyranitar ex, plus
          six Supporters.
        </p>
        <Grid cards={SUPER} cols={4} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold cards top the set, 160 to 163: Iron Valiant ex, Roaring Moon ex, Counter Catcher and Pal Pad. Pokémon China calls
          the gold Pal Pad new. English has printed Pal Pad only as a regular Item, never in gold.
        </p>
        <Grid cards={ULTRA} cols={4} />

        <h2 id="art-rares">Art Rares</h2>
        <p>Eight Art Rares, 129 to 136, give main-set Pokémon a full illustration. Espathra by AKIRA EGAWA is the pick of them.</p>
        <Grid cards={ART_RARES} cols={4} />

        <h2 id="set-structure">How the set is numbered</h2>
        <p>
          Every card has one number out of 128. Rarer versions of a card sit in the secret block at unrelated numbers, so match them by
          name. Four Pokémon ex, Espathra ex, Great Tusk ex, Skeledirge ex and Iron Treads ex, appear only as Double Rares.
        </p>
        <div className="table-scroll">
          <table className="data-table">
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
        <p>
          Our <Link to="/blog/true-mystery-set-guide">set guide</Link> has every secret rare and each Pokémon ex at every rarity,
          and our <Link to="/blog/true-mystery-card-origins">card origins guide</Link> matches every card to its English version.
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
          True Mystery is the Paradox set, and the Roaring Moon ex and Iron Valiant ex runs are the ones to chase, each from Double Rare
          up to gold. The Iron Hands ex SAR gives Chinese collectors a card English never had. On the published odds, the jumbo box is
          the better pick for hits as well as holos.
        </p>
      </BlogPostLayout>
    </>
  )
}
