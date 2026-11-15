import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv4.json'

const post = BLOG_POSTS.find((p) => p.slug === 'reward-round-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// The data marks all three Chinese exclusives, including the gold Gholdengo ex 162.
const isExclusive = (c: Card) => EXCLUSIVE.has(c.number) || c.number === '162/129'
// Most wanted cards first (by number out of 129), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/129`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Reward Round`} loading="lazy" width={300} height={419} />
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
  { nos: '001 to 114', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '115 to 120', what: 'Items and Pokémon Tools', rarity: 'U' },
  { nos: '121 to 126', what: 'Supporters', rarity: 'C, U, R' },
  { nos: '127 to 129', what: 'Stadiums and Special Energy', rarity: 'U' },
  { nos: '130 to 137', what: 'Art Rares', rarity: 'AR' },
  { nos: '138 to 152', what: 'Super Rare full arts of ex and Supporters', rarity: 'SR' },
  { nos: '153 to 161', what: 'Special Art Rares of ex and Supporters', rarity: 'SAR' },
  { nos: '162 to 165', what: 'Gold Ultra Rares', rarity: 'UR' },
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

const LADDER_NAMES = ['Gholdengo ex', 'Maushold ex', 'Pidgeot ex', 'Revavroom ex', 'Golisopod ex', 'Tapu Koko ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'box', label: 'What a slim box holds' },
  { id: 'special-art-rares', label: 'All 9 Special Art Rares' },
  { id: 'super-rares', label: 'All 15 Super Rares' },
  { id: 'ultra-rares', label: 'All 4 Ultra Rares' },
  { id: 'art-rares', label: 'All 8 Art Rares' },
  { id: 'ladders', label: 'One Pokémon, several rarities' },
  { id: 'double-rares', label: 'All 14 Pokémon ex' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which Reward Round cards are Chinese exclusives?',
    a: 'The gold Gholdengo ex 162/129, the Maushold ex Special Art Rare 158/129 and the Rika Special Art Rare 159/129.',
  },
  {
    q: 'How many Super Rares or better are in a slim box?',
    a: 'About 0.55 on average, so most slim boxes do not have one. Over two boxes you would expect about one.',
  },
  {
    q: 'Which Pokémon ex have no secret rare?',
    a: 'Pawmot ex, Houndstone ex, Garganacl ex and Dragonite ex only appear as Double Rares.',
  },
  {
    q: 'How many cards are in a Reward Round master set?',
    a: '395: the 165 numbered cards plus a Poké Ball and a Master Ball pattern holo of each of the 115 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blogs/news/reward-round-set-guide')({
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
  component: RewardRoundSetGuide,
})

function RewardRoundSetGuide() {
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
        lede="Every chase card in Reward Round, what a slim box averages, each Pokémon ex at every rarity, and what a master set takes."
        cta={{
          heading: 'Collect Reward Round',
          body: 'Track every card on the full checklist, or pick up a slim box and start ripping.',
          links: [
            { to: '/sets/csv4', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-reward-round-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Reward Round (CSV4C) is the Gholdengo set: 165 cards, three Chinese exclusives, and slim and jumbo packs. Our{' '}
          <Link to="/blogs/news/reward-round-has-arrived">release post</Link> covers what is new, and our{' '}
          <Link to="/blogs/news/reward-round-card-origins">card origins guide</Link> matches every card to English. Use this one to sort
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
          The top band holds 28 different cards and averages about one every 27 packs, so most slim boxes will not have one. The 20-card
          jumbo pack holds six holos instead of one.
        </p>

        <h2 id="special-art-rares">All 9 Special Art Rares</h2>
        <p>153 to 161. Maushold ex 158 and Rika 159 are Chinese exclusives.</p>
        <Gallery cards={lead(byRange(153, 161), ['158', '159', '157', '156', '154', '161'])} cols={3} />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>Full arts of ten Pokémon ex and five Supporters, 138 to 152.</p>
        <Gallery cards={lead(byRange(138, 152), ['146', '144', '150', '149', '152', '151'])} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>The gold cards, 162 to 165. Gholdengo ex 162 is the third Chinese exclusive.</p>
        <Gallery cards={byRange(162, 165)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>130 to 137.</p>
        <Gallery cards={lead(byRange(130, 137), ['133', '136', '137', '132', '131'])} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>The Pokémon ex with a Special Art Rare, and every number they print at:</p>
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
        <p className="table-note">Slowking ex, Dedenne ex, Annihilape ex and Noivern ex also have Super Rares (140, 141, 142 and 145).</p>

        <h2 id="double-rares">All 14 Pokémon ex</h2>
        <p>The Double Rares from the main set.</p>
        <Gallery cards={lead(setData.cards.filter((c) => c.rarity === 'Double Rare (RR)'), ['092', '101', '089', '114', '032', '058'])} cols={4} />

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

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 165 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 115 Commons, Uncommons
          and Rares, for 395 in total.
        </p>
        <p>
          With one holo per slim pack, the Master Ball holos and the 28 top-band cards take a long time to pull. Most collectors open boxes
          for fun and the lower rarities, then buy the big cards as singles. The <Link to="/sets/csv4">Reward Round card list</Link> lets
          you tick off what you have.
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
