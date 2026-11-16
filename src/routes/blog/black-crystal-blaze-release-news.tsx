import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'black-crystal-blaze-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Dark%20Crystal%20Blaze%20CSV5/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/129, Black Crystal Blaze`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/129 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const CHARIZARD = [
  { n: '075', name: 'Charizard ex', note: 'Double Rare' },
  { n: '145', name: 'Charizard ex', note: 'Super Rare' },
  { n: '155', name: 'Charizard ex', note: 'SAR · AKIRA EGAWA' },
  { n: '162', name: 'Charizard ex', note: 'Ultra Rare' },
]

const EXCLUSIVES = [
  { n: '157', name: 'Larry', note: 'SAR · Kariya · Chinese exclusive' },
  { n: '164', name: 'Defiance Band', note: 'Ultra Rare · inose yukie · Chinese exclusive' },
]

const SAR = [
  { n: '159', name: 'Poppy', note: 'SAR · Ryota Murayama' },
  { n: '160', name: 'Mela', note: 'SAR · rika' },
  { n: '154', name: 'Garchomp ex', note: 'SAR · Oswaldo KATO' },
  { n: '156', name: 'Altaria ex', note: 'SAR · Jiro Sasumo' },
  { n: '158', name: 'Clive', note: 'SAR · Taiga Kayama' },
  { n: '153', name: 'Eiscue ex', note: 'SAR · Toshinao Aoki' },
]

const ULTRA = [
  { n: '161', name: 'Garchomp ex', note: 'Ultra Rare' },
  { n: '164', name: 'Defiance Band', note: 'Ultra Rare · Chinese exclusive' },
  { n: '163', name: 'Rare Candy', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '135', name: 'Yveltal', note: 'Art Rare · Masako Tomii' },
  { n: '136', name: 'Swablu', note: 'Art Rare · Jiro Sasumo' },
  { n: '132', name: 'Joltik', note: 'Art Rare · Atsushi Furusawa' },
  { n: '133', name: 'Minior', note: 'Art Rare · 0313' },
  { n: '137', name: 'Lechonk', note: 'Art Rare · Narumi Sato' },
  { n: '130', name: 'Gloom', note: 'Art Rare · Masako Tomii' },
]

// Pokémon China's odds chart for the 5-card pack, in the bands it uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', share: '80.00%', box: '60' },
  { band: 'Poké Ball pattern holo and Rare', share: '14.53%', box: 'about 11' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', share: '4.74%', box: 'about 3 to 4' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', share: '0.73%', box: 'about 0.55' },
]

const TOC = [
  { id: 'packs-and-odds', label: 'Slim and jumbo boxes' },
  { id: 'exclusives', label: 'Two cards only in Chinese' },
  { id: 'charizard', label: 'Darkness Tera Charizard ex' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese exclusive cards in Black Crystal Blaze?',
    a: 'Two: the Larry Special Art Rare 157/129 by Kariya and the gold Defiance Band Ultra Rare 164/129 by inose yukie. Neither has an English version.',
  },
  {
    q: 'What is the difference between the slim and jumbo boxes?',
    a: 'A slim box has 15 packs of 5 cards, 75 cards with 15 holos. A jumbo box has 6 packs of 20 cards, 120 cards with 36 holos. Both pull from the same card list.',
  },
  {
    q: 'How many big hits are in a slim box?',
    a: 'Super Rares, Special Art Rares and Ultra Rares are 0.73% of the 5-card print run, about 0.55 per slim box, or one in every 27 packs on average.',
  },
  {
    q: 'Which Charizard ex is the chase card?',
    a: 'The Special Art Rare 155/129 by AKIRA EGAWA, followed by the gold Ultra Rare 162/129. Both match the Obsidian Flames versions.',
  },
  {
    q: 'How many cards are in Black Crystal Blaze?',
    a: '164 numbered cards: 129 in the main set and 35 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 394 different cards.',
  },
]

export const Route = createFileRoute('/blog/black-crystal-blaze-release-news')({
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
  component: BlackCrystalBlazeReleasePost,
})

function BlackCrystalBlazeReleasePost() {
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
        lede="Darkness Tera Charizard ex takes the cover of the fifth Chinese Scarlet & Violet set, with a Larry Special Art Rare and a gold Defiance Band you can only pull in Simplified Chinese."
        cta={{
          heading: 'Shop Black Crystal Blaze',
          body: 'Slim and jumbo booster boxes in stock now, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Black Crystal Blaze (黑晶炽诚) released on September 12, 2025. It is the fifth main set of the Chinese Scarlet & Violet series,
          built around Pokémon whose Tera type differs from their usual type, led by the Darkness Tera Charizard ex on the pack. Elite
          Four members Larry and Poppy join as Supporters, and two secret rares are new for China.
        </p>

        <aside className="fact-box" aria-label="Black Crystal Blaze key facts">
          <img
            src={`${SITE_URL}/assets/blog/black-crystal-blaze-slim-pack.webp`}
            alt="Black Crystal Blaze slim booster pack with Tera Charizard on the front"
            loading="lazy"
            width={600}
            height={1127}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Black Crystal Blaze (黑晶炽诚)</dd>
              <dt>Set code</dt>
              <dd>CSV5C</dd>
              <dt>Released</dt>
              <dd>September 12, 2025</dd>
              <dt>Slim box</dt>
              <dd>15 packs of 5 cards, 1 holo per pack</dd>
              <dt>Jumbo box</dt>
              <dd>6 packs of 20 cards, 6 holo per pack</dd>
              <dt>Set size</dt>
              <dd>164 cards: 129 in the main set, 35 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Charizard ex SAR, Larry SAR, gold Defiance Band</dd>
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

        <h2 id="packs-and-odds">Slim and jumbo boxes</h2>
        <p>
          Black Crystal Blaze comes in a slim 5-card pack with one holo and a jumbo 20-card pack with six holos, and we carry both boxes.
          A slim box is 15 packs, 75 cards and 15 holos. A jumbo box is 6 packs, 120 cards and 36 holos, so it has more than twice the
          holos.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${SITE_URL}/assets/blog/black-crystal-blaze-slim-pack.webp`} alt="Black Crystal Blaze slim pack, 5 cards" loading="lazy" width={600} height={1127} />
            <figcaption>
              <strong>Slim pack</strong>5 cards · 1 holo
            </figcaption>
          </figure>
          <figure>
            <img src={`${SITE_URL}/assets/blog/black-crystal-blaze-jumbo-pack.webp`} alt="Black Crystal Blaze jumbo pack, 20 cards" loading="lazy" width={600} height={1196} />
            <figcaption>
              <strong>Jumbo pack</strong>20 cards · 6 holo
            </figcaption>
          </figure>
        </div>
        <p>Pokémon China's odds chart for the 5-card pack, applied to one slim box:</p>
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
        <p className="table-note">Averages from the official 5-card chart. Pokémon China did not publish a separate chart for the jumbo pack.</p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings the full set to
          394 cards. Our <Link to="/blog/black-crystal-blaze-set-guide">set guide</Link> has the full checklist, and our{' '}
          <Link to="/blog/black-crystal-blaze-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <h2 id="exclusives">Two cards only in Chinese</h2>
        <p>
          Two secret rares have no English version. Larry gets a Special Art Rare by Kariya showing him at work in the city, and Defiance
          Band gets a gold Ultra Rare by inose yukie. English has Larry as a Supporter and a full art, and Defiance Band only as a regular
          Pokémon Tool.
        </p>
        <Grid cards={EXCLUSIVES} cols={2} />

        <h2 id="charizard">Darkness Tera Charizard ex</h2>
        <p>
          Charizard ex is the card most people open this set for, and it is a Darkness-type Tera Pokémon here. When you evolve into it
          from your hand, its ability attaches up to three basic Fire Energy from your deck, and its attack hits harder for every Prize card your opponent has taken. It appears at four
          rarities, with the Special Art Rare by AKIRA EGAWA as the set's top chase.
        </p>
        <Grid cards={CHARIZARD} cols={4} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Eight Special Art Rares, 153 to 160: Eiscue ex, Garchomp ex, Charizard ex and Altaria ex, plus the Supporters Larry, Clive,
          Poppy and Mela.
        </p>
        <Grid cards={SAR} cols={3} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold cards top the set, 161 to 164: Garchomp ex, Charizard ex, Rare Candy and the Chinese-exclusive Defiance Band.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>Eight Art Rares, 130 to 137, give main-set Pokémon a full illustration.</p>
        <Grid cards={ART_RARES} cols={3} />

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
          Black Crystal Blaze is a Charizard set first, and the AKIRA EGAWA Special Art Rare is the card most collectors are opening it for.
          The Larry SAR and gold Defiance Band give Chinese collectors something English cannot match. For more holos per box, the jumbo
          box is the better rip.
        </p>
      </BlogPostLayout>
    </>
  )
}
