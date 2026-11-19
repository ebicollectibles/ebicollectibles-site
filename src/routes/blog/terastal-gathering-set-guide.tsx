import { rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv9-5.json'

const post = BLOG_POSTS.find((p) => p.slug === 'terastal-gathering-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 208), then the rest of the range in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/208`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Terastal Gathering`} loading="lazy" width={300} height={419} />
            <figcaption>
              {EXCLUSIVE.has(c.number) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.number}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const BLOCKS = [
  { nos: '001 to 156', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '157 to 181', what: 'Items and Pokémon Tools', rarity: 'U, 6 ACE SPEC' },
  { nos: '182 to 200', what: 'Supporters', rarity: 'U (Black Belt’s Training is R)' },
  { nos: '201 to 208', what: 'Stadiums and Special Energy', rarity: 'U, 2 ACE SPEC' },
  { nos: '209 to 220', what: 'Super Rare full-art Trainers', rarity: 'SR' },
  { nos: '221 to 248', what: 'Special Art Rares of 28 Pokémon ex', rarity: 'SAR' },
  { nos: '249 to 254', what: 'Special Art Rares of 6 Trainers', rarity: 'SAR' },
  { nos: '255 to 259', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// Averages for one 10-pack box, from Pokémon China's grouped print shares.
const BOX = [
  { row: 'Cards', avg: '100 (10 packs of 10)' },
  { row: 'Holos', avg: '30 to 40 (3 or 4 per pack)' },
  { row: 'Common, Uncommon and Rare (85.60%)', avg: 'about 86' },
  { row: 'Double Rare, ACE SPEC, Poké Ball and Master Ball holos (13.00%)', avg: 'about 13' },
  { row: 'Special Art Rare, Super Rare and Ultra Rare (1.40%)', avg: 'about 1.4' },
]

const EEVEELUTIONS = ['Eevee', 'Vaporeon', 'Jolteon', 'Flareon', 'Espeon', 'Umbreon', 'Leafeon', 'Glaceon', 'Sylveon']
const num = (c: Card) => c.number.slice(0, 3)
const CHECKLIST = EEVEELUTIONS.map((mon) => ({
  mon,
  plain: setData.cards.filter((c) => c.name === mon).map(num).join(', '),
  ex: setData.cards.filter((c) => c.name === `${mon} ex` && c.rarity === 'Double Rare (RR)').map(num).join(', '),
  sar: setData.cards.filter((c) => c.name === `${mon} ex` && c.rarity === 'Special Art Rare (SAR)').map(num).join(', '),
}))

const TOC = [
  { id: 'box', label: 'What a box holds' },
  { id: 'pokemon-sars', label: 'All 28 Pokémon SARs' },
  { id: 'trainer-sars', label: 'All 6 Trainer SARs' },
  { id: 'super-rares', label: 'All 12 Super Rares' },
  { id: 'ultra-rares', label: 'All 5 Ultra Rares' },
  { id: 'eeveelutions', label: 'The Eeveelution checklist' },
  { id: 'ace-spec', label: 'All 8 ACE SPEC cards' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many Special Art Rares are in Terastal Gathering?',
    a: '34: 28 Pokémon ex (221 to 248) and 6 Trainers (249 to 254). Eevee ex and Sylveon ex each have two.',
  },
  {
    q: 'What is the Chinese Exclusive in Terastal Gathering?',
    a: 'Sylveon ex 234/208, a Special Art Rare by rika. The other Sylveon ex SAR, 233/208 by Cona Nitanda, is the one that matches Prismatic Evolutions.',
  },
  {
    q: 'How many cards are in a Terastal Gathering booster box?',
    a: '10 packs of 10 cards, so 100 cards, with 3 or 4 holos in every pack.',
  },
  {
    q: 'Are there Poké Ball and Master Ball versions?',
    a: 'Yes. Every Common, Uncommon and Rare comes as a Poké Ball pattern holo and a Master Ball pattern holo, 171 of each, with a special finish in this set.',
  },
  {
    q: 'How many cards are in a Terastal Gathering master set?',
    a: '601: the 259 numbered cards plus 171 Poké Ball and 171 Master Ball pattern holos.',
  },
]

export const Route = createFileRoute('/blog/terastal-gathering-set-guide')({
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
  component: TerastalGatheringSetGuide,
})

function TerastalGatheringSetGuide() {
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
        lede="Every Eeveelution in the set, every Special Art Rare and gold card, what a 10-pack box averages, and what a Terastal Gathering master set takes."
        cta={{
          heading: 'Collect Terastal Gathering',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/chinese/terastal-gathering-csv9-5', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-terastal-gathering-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Terastal Gathering (CSV9.5C) is the Stellar Eeveelution set: 259 cards in 10-card packs, with 34 Special Art Rares
          and one Chinese Exclusive, the Sylveon ex SAR 234/208. Our{' '}
          <Link to="/blog/terastal-gathering-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/terastal-gathering-card-origins">card origins guide</Link> matches every card to English. Use this one
          to sort your pulls or plan a master set.
        </p>

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

        <h2 id="box">What a box holds</h2>
        <p>Pokémon China publishes its odds as three grouped bands. Applied to one 10-pack box, that works out to roughly:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">What a box holds</caption>
            <thead>
              <tr>
                <th scope="col">Per box</th>
                <th scope="col">Average</th>
              </tr>
            </thead>
            <tbody>
              {BOX.map((b) => (
                <tr key={b.row}>
                  <th scope="row">{b.row}</th>
                  <td>{b.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages, not guarantees. Individual boxes vary.</p>
        <p>
          That top band holds 51 different cards, so a box averages a bit more than one big hit, about one every 7 packs. Pulling a
          specific Special Art Rare, like Umbreon ex, takes many boxes.
        </p>

        <h2 id="pokemon-sars">All 28 Pokémon SARs</h2>
        <p>221 to 248, including every Stellar Eeveelution.</p>
        <Gallery cards={lead(byRange(221, 248), ['239', '234', '232', '245', '233', '246', '227', '226'])} cols={4} />

        <h2 id="trainer-sars">All 6 Trainer SARs</h2>
        <p>
          249 to 254. Pokémon China ranks these as rarer than both the Pokémon SARs and the Super Rares.
        </p>
        <Gallery cards={lead(byRange(249, 254), ['253', '252', '250'])} cols={3} />

        <BuyStrip />

        <h2 id="super-rares">All 12 Super Rares</h2>
        <p>Full-art Trainers, 209 to 220. Atticus has two with different art.</p>
        <Gallery cards={byRange(209, 220)} cols={4} />

        <h2 id="ultra-rares">All 5 Ultra Rares</h2>
        <p>The gold cards, 255 to 259.</p>
        <Gallery cards={lead(byRange(255, 259), ['258', '259'])} cols={3} />

        <h2 id="eeveelutions">The Eeveelution checklist</h2>
        <p>Every Eevee family card in the set, by number:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">The Eeveelution checklist</caption>
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">Plain</th>
                <th scope="col">ex (RR)</th>
                <th scope="col">ex SAR</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST.map((r) => (
                <tr key={r.mon} className={r.mon === 'Sylveon' ? 'is-current' : undefined}>
                  <th scope="row">{r.mon}</th>
                  <td>{r.plain || '–'}</td>
                  <td>{r.ex || '–'}</td>
                  <td>{r.sar || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Sylveon ex SAR 234 is the Chinese Exclusive.</p>

        <h2 id="ace-spec">All 8 ACE SPEC cards</h2>
        <p>Pink-framed, one per deck, and numbered within the main set.</p>
        <Gallery cards={setData.cards.filter((c) => c.rarity === 'ACE SPEC Rare (ACE)')} cols={4} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 208. The main set runs 001 to 208, and everything above 208 is a secret rare. The rarer
          versions of a card sit in the secret block at unrelated numbers, so match them by name.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">How the numbers work</caption>
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

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 259 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 171 Commons,
          Uncommons and Rares, for 601 in total.
        </p>
        <p>
          The main set fills in quickly with three or four holos per pack. The Poké Ball and Master Ball holos share the 13% band with
          Double Rares and ACE SPECs, about 13 cards a box spread across 379 different cards, so both take many boxes, and Pokémon China
          ranks the Master Ball holos as the rarest in that band. For the Special Art Rares and gold cards, most collectors
          open a few boxes for fun, then buy the cards they still need as singles. The{' '}
          <Link to="/sets/chinese/terastal-gathering-csv9-5">Terastal Gathering card list</Link> lets you tick off what you have.
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
      </BlogPostLayout>
    </>
  )
}
