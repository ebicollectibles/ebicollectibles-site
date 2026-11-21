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

const post = BLOG_POSTS.find((p) => p.slug === 'black-crystal-blaze-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Dark%20Crystal%20Blaze%20CSV5/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

// The two Chinese Exclusives: the Larry Special Art Rare 157 and the gold Defiance Band 164.
const EXCLUSIVE = new Set(['157', '164'])

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.n}>
          <figure>
            <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/129, Black Crystal Blaze`} loading="lazy" width={300} height={419} />
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

const CHARIZARD = [
  { n: '075', name: 'Charizard ex', note: 'Double Rare' },
  { n: '145', name: 'Charizard ex', note: 'Super Rare' },
  { n: '155', name: 'Charizard ex', note: 'Special Art Rare · AKIRA EGAWA' },
  { n: '162', name: 'Charizard ex', note: 'Ultra Rare' },
]

const EXCLUSIVES = [
  { n: '157', name: 'Larry', note: 'Special Art Rare · Kariya' },
  { n: '164', name: 'Defiance Band', note: 'Ultra Rare · inose yukie' },
]

const SAR = [
  { n: '159', name: 'Poppy', note: 'Special Art Rare · Ryota Murayama' },
  { n: '160', name: 'Mela', note: 'Special Art Rare · rika' },
  { n: '154', name: 'Garchomp ex', note: 'Special Art Rare · Oswaldo KATO' },
  { n: '156', name: 'Altaria ex', note: 'Special Art Rare · Jiro Sasumo' },
  { n: '158', name: 'Clive', note: 'Special Art Rare · Taiga Kayama' },
  { n: '153', name: 'Eiscue ex', note: 'Special Art Rare · Toshinao Aoki' },
]

const ULTRA = [
  { n: '161', name: 'Garchomp ex', note: 'Ultra Rare' },
  { n: '164', name: 'Defiance Band', note: 'Ultra Rare' },
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

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, in the rarity groups the chart uses.
const ODDS = [
  { group: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { group: 'Poké Ball pattern holo and Rare', slim: '14.53%', jumbo: '22.99%' },
  { group: 'Double Rare, Art Rare and Master Ball pattern holo', slim: '4.74%', jumbo: '6.01%' },
  { group: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const TOC = [
  { id: 'packs-and-odds', label: 'Slim and jumbo boxes' },
  { id: 'charizard', label: 'Darkness Tera Charizard ex' },
  { id: 'exclusives', label: 'Chinese Exclusives: Larry and Defiance Band' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Black Crystal Blaze released?',
    a: 'September 12, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'What are the Chinese Exclusives in Black Crystal Blaze?',
    a: 'Two: the Larry Special Art Rare 157/129 by Kariya and the gold Defiance Band Ultra Rare 164/129 by inose yukie. Neither card exists in English.',
  },
  {
    q: 'What is the difference between the slim and jumbo boxes?',
    a: 'A slim box has 15 packs of 5 cards, which is 75 cards with 15 holos. A jumbo box has 6 packs of 20 cards, which is 120 cards with 36 holos. Both pull from the same card list, but Pokémon China publishes a separate odds chart for each pack size.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, going by Pokémon China's print shares. That averages about 0.55 per slim box (one in every 27 packs) and about 1.2 per jumbo box (one in every 5 packs).",
  },
  {
    q: 'Where do the Black Crystal Blaze illustrations come from?',
    a: 'From several English sets at once. Most of its cards match Paradox Rift (73), Obsidian Flames (61) and Paldean Fates (18). Ten more match five other English sources, and the two Chinese Exclusives do not exist in English.',
    link: { to: '/sets/chinese/black-crystal-blaze-csv5', before: 'See every card on the ', label: 'Black Crystal Blaze card list', after: '.' },
  },
  {
    q: 'Which Charizard ex is the most wanted?',
    a: 'The Special Art Rare 155/129 by AKIRA EGAWA, followed by the gold Ultra Rare 162/129. Both match the Obsidian Flames versions.',
  },
  {
    q: 'How many cards are in Black Crystal Blaze?',
    a: '164 numbered cards: 129 in the main set and 35 secret rares. Counting the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 394 different cards.',
  },
  {
    q: 'Is Black Crystal Blaze also sold under other names?',
    a: 'Yes. The set has no official English name, so shops translate it differently. Black Crystal Blazing, Crystal Blaze and Dark Crystal Blaze are the same set, CSV5C.',
  },
]

export const Route = createFileRoute('/blog/black-crystal-blaze-release-news')({
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
        lede="Darkness Tera Charizard ex is on the pack of the fifth Chinese Scarlet & Violet set, which has two Chinese Exclusives: a Larry Special Art Rare and a gold Defiance Band."
        cta={{
          heading: 'Shop Black Crystal Blaze',
          body: 'Slim and jumbo booster boxes, plus the full card list with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Black Crystal Blaze (<Zh>黑晶炽诚</Zh>, set code CSV5C) released on September 12, 2025. It is the fifth main set of the Chinese Scarlet & Violet series,
          built around Pokémon whose Tera type differs from their usual type, and the Darkness Tera Charizard ex is on the pack. Elite
          Four members Larry and Poppy join as Supporters, and two secret rares are Chinese Exclusives: a Larry Special Art Rare and a
          gold Defiance Band.
        </p>
        <p>
          Our <Link to="/blog/black-crystal-blaze-set-guide">set guide</Link> shows every secret rare and what each box holds, and our{' '}
          <Link to="/blog/black-crystal-blaze-card-origins">card origins guide</Link> matches every card to its English version.
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
              <dd>Black Crystal Blaze (<Zh>黑晶炽诚</Zh>)</dd>
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
              <dd>Charizard ex Special Art Rare, Larry Special Art Rare, gold Defiance Band</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Larry Special Art Rare 157/129, gold Defiance Band Ultra Rare 164/129</dd>
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
          Black Crystal Blaze comes in two pack sizes with the same card list. The slim pack has 5 cards with one holo, and the jumbo
          pack has 20 cards with six holos. A slim box is 15 packs, 75 cards and 15 holos. A jumbo box is 6 packs, 120 cards and 36
          holos. Pokémon China publishes a separate odds chart for each pack size, and they are not the same.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/black-crystal-blaze-slim-pack.webp`} alt="Black Crystal Blaze slim pack, 5 cards" loading="lazy" width={600} height={1127} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/black-crystal-blaze-jumbo-pack.webp`} alt="Black Crystal Blaze jumbo pack, 20 cards" loading="lazy" width={600} height={1196} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim and jumbo boxes</caption>
            <thead>
              <tr>
                <th scope="col">Share of print</th>
                <th scope="col">Slim</th>
                <th scope="col">Jumbo</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.group}>
                  <th scope="row">{o.group}</th>
                  <td>{o.slim}</td>
                  <td>{o.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">From Pokémon China's odds chart for each pack size.</p>
        <p>
          The jumbo pack is better in every holo group. Super Rares, Special Art Rares and Ultra Rares together are 1.00% of jumbo
          cards against 0.73% of slim cards. That averages about 1.2 per jumbo box, or one in every 5 packs, and about 0.55 per slim
          box, or one in every 27 packs.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a Master Ball pattern holo, 115 of each, which
          brings the full set to 394 cards.
        </p>

        <h2 id="charizard">Darkness Tera Charizard ex</h2>
        <p>
          Charizard ex is the card most people open this set for, and it is a Darkness-type Tera Pokémon here. When you evolve into it
          from your hand, its ability attaches up to three basic Fire Energy from your deck, and its attack hits harder for every Prize card your opponent has taken. It appears at four
          rarities, and the Special Art Rare by AKIRA EGAWA is the most wanted card in the set.
        </p>
        <Grid cards={CHARIZARD} cols={4} />

        <h2 id="exclusives">Chinese Exclusives: Larry and Defiance Band</h2>
        <p>
          Two secret rares are Chinese Exclusives. The Larry Special Art Rare by Kariya shows him after work, passing a food stall on a
          city street at night with his briefcase in hand. Defiance Band is a gold Ultra Rare by inose yukie. English has Larry as a
          Supporter and a full art, and Defiance Band as a regular Pokémon Tool, but these two cards do not exist in English.
        </p>
        <Grid cards={EXCLUSIVES} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          There are eight Special Art Rares, numbered 153 to 160. Four are Pokémon ex (Eiscue ex, Garchomp ex, Charizard ex and
          Altaria ex) and four are Supporters (Larry, Clive, Poppy and Mela).
        </p>
        <Grid cards={SAR} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Four gold Ultra Rares top the set, numbered 161 to 164. They are Garchomp ex, Charizard ex, Rare Candy and the Chinese
          Exclusive Defiance Band.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>There are eight Art Rares, numbered 130 to 137. Each one gives a main-set Pokémon a full illustration.</p>
        <Grid cards={ART_RARES} cols={3} />

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
          Black Crystal Blaze is a Charizard set first, and the AKIRA EGAWA Special Art Rare is the card most collectors open it for.
          The Larry Special Art Rare and the gold Defiance Band are two cards that do not exist in English. On the published odds, the
          jumbo box is the better pick, both for holos and for Super Rares and above.
        </p>
      </BlogPostLayout>
    </>
  )
}
