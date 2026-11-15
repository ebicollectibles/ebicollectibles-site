import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv5.json'

const post = BLOG_POSTS.find((p) => p.slug === 'black-crystal-blaze-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// The gold Defiance Band is also new for China, though the data source only flags the Larry SAR.
const isExclusive = (c: Card) => EXCLUSIVE.has(c.number) || c.number === '164/129'

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Black Crystal Blaze`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.number}
            {isExclusive(c) ? ' · Chinese exclusive' : ''}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const BLOCKS = [
  { nos: '001 to 113', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '114 to 129', what: 'Trainers and Energy', rarity: 'U (Larry is C)' },
  { nos: '130 to 137', what: 'Art Rares', rarity: 'AR' },
  { nos: '138 to 152', what: 'Super Rare full arts of ex and Supporters', rarity: 'SR' },
  { nos: '153 to 160', what: 'Special Art Rares of ex and Supporters', rarity: 'SAR' },
  { nos: '161 to 164', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// One slim box (15 packs of 5) with Pokémon China's 5-card odds applied.
const BOX = [
  { row: 'Cards', avg: '75 (15 packs of 5)' },
  { row: 'Holos', avg: '15 (1 per pack)' },
  { row: 'Common and Uncommon (80.00%)', avg: '60' },
  { row: 'Poké Ball pattern holo and Rare (14.53%)', avg: 'about 11' },
  { row: 'Double Rare, Art Rare and Master Ball pattern (4.74%)', avg: 'about 3 to 4' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare (0.73%)', avg: 'about 0.55' },
]

const LADDER_NAMES = ['Charizard ex', 'Garchomp ex', 'Eiscue ex', 'Altaria ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'box', label: 'What a slim box holds' },
  { id: 'ladders', label: 'One Pokémon, several rarities' },
  { id: 'ultra-rares', label: 'All 4 Ultra Rares' },
  { id: 'special-art-rares', label: 'All 8 Special Art Rares' },
  { id: 'super-rares', label: 'All 15 Super Rares' },
  { id: 'art-rares', label: 'All 8 Art Rares' },
  { id: 'double-rares', label: 'All 14 Pokémon ex' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which Black Crystal Blaze cards are Chinese exclusives?',
    a: 'The Larry Special Art Rare 157/129 and the gold Defiance Band Ultra Rare 164/129.',
  },
  {
    q: 'How many Super Rares or better are in a slim box?',
    a: 'About 0.55 on average, so most slim boxes do not have one. Over two boxes you would expect about one.',
  },
  {
    q: 'Should I buy a slim or a jumbo box?',
    a: 'A jumbo box has 120 cards and 36 holos against 75 cards and 15 holos in a slim box. Pokémon China only published odds for the 5-card pack, so the jumbo box is the safe pick for more holos, and the slim box for more packs to open.',
  },
  {
    q: 'How many cards are in a Black Crystal Blaze master set?',
    a: '394: the 164 numbered cards plus a Poké Ball and a Master Ball pattern holo of each of the 115 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blogs/news/black-crystal-blaze-set-guide')({
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
  component: BlackCrystalBlazeSetGuide,
})

function BlackCrystalBlazeSetGuide() {
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
        lede="Every chase card in Black Crystal Blaze, slim box against jumbo box, each Pokémon ex at every rarity, and what a master set takes."
        cta={{
          heading: 'Collect Black Crystal Blaze',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/csv5', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Black Crystal Blaze (CSV5C) is the Tera Charizard set: 164 cards, two Chinese exclusives, and slim and jumbo boxes. Our{' '}
          <Link to="/blogs/news/black-crystal-blaze-has-arrived">release post</Link> covers what is new, and our{' '}
          <Link to="/blogs/news/black-crystal-blaze-card-origins">card origins guide</Link> matches every card to English. Use this one to sort
          your pulls or plan a master set.
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

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 129. The main set runs 001 to 129, and everything above is a secret rare. The rarer versions
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

        <h2 id="box">What a slim box holds</h2>
        <p>Pokémon China's odds chart for the 5-card pack, applied to one 15-pack slim box:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Per slim box</th>
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
        <p className="table-note">Averages from the official print shares, not guarantees.</p>
        <p>
          The top band holds 27 different cards and averages about one every 27 packs, so most slim boxes will not have one. A jumbo box
          has 120 cards and 36 holos instead of 75 and 15. Pokémon China did not publish separate odds for the 20-card pack.
        </p>

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>The Pokémon ex that reach the secret block, and every number they print at:</p>
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
        <p className="table-note">Armarouge ex, Vespiquen ex, Hoopa ex, Toxtricity ex, Glimmora ex and Aegislash ex also have Super Rares (139, 141 to 144 and 146).</p>

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>The gold cards, 161 to 164. Defiance Band is new for China.</p>
        <Gallery cards={byRange(161, 164)} cols={4} />

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>153 to 160. Larry 157 is the Chinese exclusive.</p>
        <Gallery cards={byRange(153, 160)} cols={4} />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>Full arts of ten Pokémon ex and five Supporters, 138 to 152.</p>
        <Gallery cards={byRange(138, 152)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>130 to 137.</p>
        <Gallery cards={byRange(130, 137)} cols={4} />

        <h2 id="double-rares">All 14 Pokémon ex</h2>
        <p>The Double Rares from the main set.</p>
        <Gallery cards={setData.cards.filter((c) => c.rarity === 'Double Rare (RR)')} cols={4} />

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 164 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 115 Commons, Uncommons
          and Rares, for 394 in total.
        </p>
        <p>
          The Master Ball holos and the 27 top-band cards take a long time to pull. Most collectors open boxes for fun and the lower
          rarities, then buy the big cards as singles. The <Link to="/sets/csv5">Black Crystal Blaze card list</Link> lets you tick off
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
