import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv6.json'

const post = BLOG_POSTS.find((p) => p.slug === 'true-mystery-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, True Mystery`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.number}
            {EXCLUSIVE.has(c.number) ? ' · Chinese exclusive' : ''}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Non-holo cards per box', slim: '60', jumbo: '84' },
]

const BLOCKS = [
  { nos: '001 to 113', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '114 to 117', what: 'Items', rarity: 'U' },
  { nos: '118 to 120', what: 'Pokémon Tools', rarity: 'U' },
  { nos: '121 to 126', what: 'Supporters', rarity: 'U (Geeta is R)' },
  { nos: '127 to 128', what: 'Stadiums', rarity: 'U' },
  { nos: '129 to 136', what: 'Art Rares', rarity: 'AR' },
  { nos: '137 to 151', what: 'Super Rare full arts of 9 ex and 6 Supporters', rarity: 'SR' },
  { nos: '152 to 159', what: 'Special Art Rares of 4 ex and 4 Supporters', rarity: 'SAR' },
  { nos: '160 to 163', what: 'Gold Ultra Rares', rarity: 'UR' },
]

const LADDER_NAMES = ['Roaring Moon ex', 'Iron Valiant ex', 'Iron Hands ex', 'Sandy Shocks ex']
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
    a: 'A jumbo box has 120 cards and 36 holos against 75 cards and 15 holos in a slim box. On the odds Pokémon China published, the jumbo box also averages more big hits: about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 in a slim box. The slim box gives you more packs to open.',
  },
  {
    q: 'Which True Mystery card is a Chinese exclusive?',
    a: 'The Iron Hands ex Special Art Rare 152/128 by Tonji Matsuno.',
  },
  {
    q: 'Which Pokémon ex reach the gold Ultra Rare tier?',
    a: 'Two: Roaring Moon ex (096, 144, 155 and 161) and Iron Valiant ex (066, 142, 153 and 160). Each has a Double Rare, Super Rare, Special Art Rare and gold Ultra Rare.',
  },
  {
    q: 'How many secret rares are in True Mystery?',
    a: '35: 8 Art Rares, 15 Super Rares, 8 Special Art Rares and 4 gold Ultra Rares, numbered 129 to 163.',
  },
]

export const Route = createFileRoute('/blog/true-mystery-set-guide')({
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
  component: TrueMysterySetGuide,
})

function TrueMysterySetGuide() {
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
        lede="Slim box or jumbo box, every secret rare in True Mystery, the Paradox Pokémon ex at every rarity, and how the 163 numbers fit together."
        cta={{
          heading: 'Collect True Mystery',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/chinese/true-mystery-csv6', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-true-mystery-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          True Mystery (CSV6C) is the Paradox set: 163 cards, an Iron Hands ex Special Art Rare only in Chinese, and slim and jumbo
          boxes. Our <Link to="/blog/true-mystery-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/true-mystery-card-origins">card origins guide</Link> matches every card to English. Use this one to sort
          your pulls or plan the full set.
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
        <p>Both boxes pull from the same 163-card list. Here is what each one holds:</p>
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
        <p className="table-note">Cards and holos per pack from Pokémon China's product page.</p>
        <p>
          Pokémon China's odds charts put Super Rares, Special Art Rares and Ultra Rares at 0.73% of slim-pack cards and 1.00% of
          jumbo-pack cards. Over a box that averages about 0.55 in a slim box and 1.2 in a jumbo box. Art Rares and Master Ball pattern
          holos share a band at 4.74% (slim) and 6.01% (jumbo), about 3.6 and 7.2 per box. On holos alone, a jumbo box has 36 against
          15 in a slim box, 2.4 times as many. The slim box gives you more packs to open: 15 against 6.
        </p>

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>
          152 to 159: Iron Hands ex, Iron Valiant ex, Sandy Shocks ex and Roaring Moon ex, then Professor Sada's Vitality, Geeta,
          Professor Turo's Scenario and Tulip. Iron Hands ex 152 is the Chinese exclusive.
        </p>
        <Gallery cards={byRange(152, 159)} cols={4} />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>Full arts of nine Pokémon ex, 137 to 145:</p>
        <Gallery cards={byRange(137, 145)} cols={3} />
        <p>And six Supporters, 146 to 151:</p>
        <Gallery cards={byRange(146, 151)} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>
          The gold cards, 160 to 163. English has never printed a gold Pal Pad, and Pokémon China calls this one new.
        </p>
        <Gallery cards={byRange(160, 163)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>129 to 136, each a full illustration of a main-set Pokémon.</p>
        <Gallery cards={byRange(129, 136)} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>The four Pokémon ex with a Special Art Rare, and every number they print at:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">RR</th>
                <th scope="col">SR</th>
                <th scope="col">SAR</th>
                <th scope="col">UR</th>
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
          Every card has one number out of 128. The main set runs 001 to 128, and everything above is a secret rare. The rarer versions
          of a card sit in the secret block at unrelated numbers, so match them by name.
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
        <p className="table-note">The main set is 61 Commons, 41 Uncommons, 13 Rares and 13 Double Rares.</p>

        <h2 id="master-set">Completing the set</h2>
        <p>
          The numbered set is 163 cards: 128 in the main set and 35 secret rares. Pokémon China's odds chart also lists a Poké Ball
          pattern holo and a Master Ball pattern holo of all 115 Commons, Uncommons and Rares, so a master set with both parallels is
          393 cards.
        </p>
        <p>
          The 35 secret rares are where the time goes. Many collectors open boxes for the main set and the fun of the rip, then buy the
          top Special Art Rares and gold cards as singles. The <Link to="/sets/chinese/true-mystery-csv6">True Mystery card list</Link> lets you tick off
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
