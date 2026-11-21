import { Zh } from '~/components/blog/Zh'
import { rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv6.json'

const post = BLOG_POSTS.find((p) => p.slug === 'true-mystery-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 128), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/128`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, True Mystery`} loading="lazy" width={300} height={419} />
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

// Averages from Pokémon China's two odds charts. Each share is of all
// cards printed for that pack size, applied to the cards in one box.
// Slim: 80.00%, 14.53%, 4.74%, 0.73%. Jumbo: 70.00%, 22.99%, 6.01%, 1.00%.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Common and Uncommon', slim: '60', jumbo: '84' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 11', jumbo: 'about 28' },
  { row: 'Double Rare, Art Rare and Master Ball pattern holo', slim: 'about 3 to 4', jumbo: 'about 7' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

const BLOCKS = [
  { nos: '001 to 113', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '114 to 117', what: 'Items', rarity: 'Uncommon' },
  { nos: '118 to 120', what: 'Pokémon Tools', rarity: 'Uncommon' },
  { nos: '121 to 126', what: 'Supporters', rarity: 'Uncommon (Geeta is Rare)' },
  { nos: '127 to 128', what: 'Stadiums', rarity: 'Uncommon' },
  { nos: '129 to 136', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '137 to 151', what: 'Super Rare full arts of 9 ex and 6 Supporters', rarity: 'Super Rare' },
  { nos: '152 to 159', what: 'Special Art Rares of 4 ex and 4 Supporters', rarity: 'Special Art Rare' },
  { nos: '160 to 163', what: 'Gold Ultra Rares', rarity: 'Ultra Rare' },
]

const LADDER_NAMES = ['Iron Valiant ex', 'Roaring Moon ex', 'Sandy Shocks ex', 'Iron Hands ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim box vs jumbo box' },
  { id: 'special-art-rares', label: 'All 8 Special Art Rares' },
  { id: 'super-rares', label: 'All 15 Super Rares' },
  { id: 'ultra-rares', label: 'All 4 Ultra Rares' },
  { id: 'art-rares', label: 'All 8 Art Rares' },
  { id: 'ladders', label: 'One Pokémon, several rarities' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Completing the set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Should I buy a slim or a jumbo True Mystery box?',
    a: 'For Super Rares and above, the jumbo box. It averages about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 for a slim box, and it has 36 holos against 15. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'What is the Chinese Exclusive in True Mystery?',
    a: 'The Iron Hands ex Special Art Rare 152/128 by Tonji Matsuno. Iron Hands ex is in English, but not with this illustration.',
  },
  {
    q: 'Which Pokémon ex have a gold Ultra Rare?',
    a: 'Two: Iron Valiant ex (066, 142, 153 and 160) and Roaring Moon ex (096, 144, 155 and 161). Each has a Double Rare, Super Rare, Special Art Rare and gold Ultra Rare.',
  },
  {
    q: 'How many secret rares are in True Mystery?',
    a: 'There are 35: 8 Art Rares, 15 Super Rares, 8 Special Art Rares and 4 gold Ultra Rares, numbered 129 to 163.',
  },
]

export const Route = createFileRoute('/blog/true-mystery-set-guide')({
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
  component: TrueMysterySetGuide,
})

function TrueMysterySetGuide() {
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
        lede="True Mystery is the Paradox set, with Iron Valiant on the pack. This guide helps you choose between slim and jumbo boxes, shows every secret rare, and explains how the 163 card numbers fit together."
        cta={{
          heading: 'Collect True Mystery',
          body: 'Track every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/true-mystery-csv6', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-true-mystery-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          True Mystery (<Zh>真实玄虚</Zh>, set code CSV6C) released on November 7, 2025. It is the Paradox Pokémon set, with Iron
          Valiant on the pack: 163 cards sold in slim and jumbo boxes, with one Chinese Exclusive, the Iron Hands ex Special Art Rare
          152/128.
        </p>
        <p>
          Our <Link to="/blog/true-mystery-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/true-mystery-card-origins">card origins guide</Link> matches every card to its English version. Use this
          guide to pick a box, sort your pulls or plan the full set.
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

        <h2 id="slim-vs-jumbo">Slim box vs jumbo box</h2>
        <p>
          Both boxes pull from the same 163-card list, but Pokémon China publishes a different odds chart for each pack size. Applied
          to one box, the published shares work out to roughly this:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim box vs jumbo box</caption>
            <thead>
              <tr>
                <th scope="col">Per box</th>
                <th scope="col">Slim box</th>
                <th scope="col">Jumbo box</th>
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
          Super Rares, Special Art Rares and Ultra Rares are 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, so most slim boxes
          will not have one and most jumbo boxes will. Double Rares, Art Rares and Master Ball pattern holos share a rarity group at
          4.74% of slim cards and 6.01% of jumbo cards. A jumbo box also has 36 holos against 15 in a slim box. The slim box gives you
          more packs to open: 15 against 6.
        </p>

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>
          These are numbered 152 to 159. The four Pokémon ex are Iron Valiant ex, Roaring Moon ex, Sandy Shocks ex and Iron Hands ex,
          and the four Supporters are Professor Sada's Vitality, Geeta, Professor Turo's Scenario and Tulip. Iron Hands ex 152/128 is
          the Chinese Exclusive.
        </p>
        <Gallery cards={lead(byRange(152, 159), ['153', '155', '154'])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>Nine are full arts of Pokémon ex, numbered 137 to 145.</p>
        <Gallery cards={lead(byRange(137, 145), ['142', '144'])} cols={3} />
        <p>The other six are full arts of Supporters, numbered 146 to 151.</p>
        <Gallery cards={byRange(146, 151)} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>
          These are the gold cards, numbered 160 to 163. The gold Pal Pad 163/128 is new art and does not exist in English, where Pal
          Pad is a regular Item.
        </p>
        <Gallery cards={byRange(160, 163)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>These are numbered 129 to 136. Each one is a full illustration of a main-set Pokémon.</p>
        <Gallery cards={byRange(129, 136)} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>Four Pokémon ex have a Special Art Rare. These are the numbers each one prints at:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">One Pokémon, several rarities</caption>
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">Double Rare</th>
                <th scope="col">Super Rare</th>
                <th scope="col">Special Art Rare</th>
                <th scope="col">Ultra Rare</th>
              </tr>
            </thead>
            <tbody>
              {LADDER.map((l) => (
                <tr key={l.name}>
                  <th scope="row">{l.name}</th>
                  {l.nos.map((n, i) => (
                    <td key={i}>{n}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Froslass ex, Tsareena ex, Tyranitar ex, Cofagrigus ex and Bombirdier ex also have Super Rares (137 to 139, 141 and 145).
          Espathra ex, Great Tusk ex, Skeledirge ex and Iron Treads ex are Double Rare only.
        </p>

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 128. The main set runs 001 to 128, from Common to Double Rare, and everything above 128 is a secret rare. The rarer versions
          of a card sit in the secret block at unrelated numbers, so match them by name.
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
        <p className="table-note">The main set is 61 Commons, 41 Uncommons, 13 Rares and 13 Double Rares.</p>

        <h2 id="master-set">Completing the set</h2>
        <p>
          The numbered set is 163 cards: 128 in the main set and 35 secret rares. Pokémon China's odds charts also list a Poké Ball
          pattern holo and a Master Ball pattern holo of all 115 Commons, Uncommons and Rares, so a master set with both is 393 cards.
        </p>
        <p>
          The 35 secret rares and the Master Ball pattern holos take the longest. Many collectors open boxes for fun and the main
          set, then buy the Special Art Rares and gold cards they still need as singles. The <Link to="/sets/chinese/true-mystery-csv6">True Mystery card list</Link> lets you tick off
          what you have.
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
