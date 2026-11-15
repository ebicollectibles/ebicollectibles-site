import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv10.json'

const post = BLOG_POSTS.find((p) => p.slug === 'chasing-glory-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 222), then the rest of the range in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/222`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Chasing Glory`} loading="lazy" width={300} height={419} />
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

const BLOCKS = [
  { nos: '001 to 188', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '189 to 202', what: 'Items and Pokémon Tools', rarity: 'U' },
  { nos: '203 to 213', what: 'Supporters', rarity: 'U (Emcee’s Hype is C)' },
  { nos: '214 to 222', what: 'Stadiums and Special Energy', rarity: 'U' },
  { nos: '223 to 228', what: 'Art Rares', rarity: 'AR' },
  { nos: '229 to 261', what: 'Super Rare full arts of 22 ex and 11 Supporters', rarity: 'SR' },
  { nos: '262 to 279', what: 'Special Art Rares of 14 ex and 4 Supporters', rarity: 'SAR' },
  { nos: '280 to 287', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// Averages from Pokémon China's two odds charts. Each share is of all
// cards printed for that pack size, applied to the cards in one box.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Common and Uncommon', slim: '60', jumbo: '84' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 10 to 11', jumbo: 'about 27' },
  { row: 'Double Rare, Art Rare and Master Ball pattern', slim: 'about 4', jumbo: 'about 8' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

// Pokémon ex that reach the gold Ultra Rare tier, with every number they print at.
const LADDER_NAMES = [
  "Team Rocket's Mewtwo ex",
  "Ethan's Ho-Oh ex",
  "Iono's Bellibolt ex",
  "Cynthia's Garchomp ex",
  "Team Rocket's Crobat ex",
  "N's Zoroark ex",
]
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

// Who owns what among the 188 Pokémon.
const ROSTER = (() => {
  const m = new Map<string, string[]>()
  for (const c of byRange(1, 188)) {
    const i = c.name.indexOf("'s ")
    if (i < 0) continue
    const owner = c.name.slice(0, i)
    const mon = c.name.slice(i + 3)
    if (!m.has(owner)) m.set(owner, [])
    const list = m.get(owner)!
    if (!list.includes(mon)) list.push(mon)
  }
  return [...m.entries()]
    .map(([owner, mons]) => ({ owner, count: byRange(1, 188).filter((c) => c.name.startsWith(`${owner}'s `)).length, mons }))
    .sort((a, b) => b.count - a.count)
})()

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim box vs jumbo box' },
  { id: 'special-art-rares', label: 'All 18 Special Art Rares' },
  { id: 'super-rares', label: 'All 33 Super Rares' },
  { id: 'ultra-rares', label: 'All 8 Ultra Rares' },
  { id: 'art-rares', label: 'All 6 Art Rares' },
  { id: 'ladders', label: 'One Pokémon, four rarities' },
  { id: 'roster', label: 'The Trainer roster' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Should I buy the slim or the jumbo Chasing Glory box?',
    a: 'For chase cards, jumbo. A jumbo box averages about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 for a slim box, and its odds are better per card too. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both pull from the same 287-card list and the same Poké Ball and Master Ball holos. Only the number of cards per pack and the odds change.',
  },
  {
    q: 'How many Ultra Rares are in Chasing Glory?',
    a: "Eight gold Ultra Rares, 280 to 287: Ethan's Ho-Oh ex, Iono's Bellibolt ex, Team Rocket's Mewtwo ex, Cynthia's Garchomp ex, Team Rocket's Crobat ex, N's Zoroark ex, Levincia and Spiky Energy.",
  },
  {
    q: 'Which Trainer has the most cards?',
    a: 'Team Rocket, with 46 of the 188 Pokémon, plus Giovanni, Ariana, Archer, Petrel and Proton as Supporters.',
  },
  {
    q: 'How many cards are in a Chasing Glory master set?',
    a: '683: the 287 numbered cards plus a Poké Ball pattern and a Master Ball pattern holo of each of the 198 Common, Uncommon and Rare cards.',
  },
]

export const Route = createFileRoute('/blogs/news/chasing-glory-set-guide')({
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
  component: ChasingGlorySetGuide,
})

function ChasingGlorySetGuide() {
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
        lede="Slim box or jumbo box, every chase card in the set, which Trainer owns which Pokémon, and what a Chasing Glory master set takes."
        cta={{
          heading: 'Collect Chasing Glory',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/csv10', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Chasing Glory (CSV10C) is the Trainer's Pokémon set: 287 cards led by Team Rocket, sold in slim and jumbo packs. Our{' '}
          <Link to="/blogs/news/chasing-glory-has-arrived">release post</Link> covers what is new, and our{' '}
          <Link to="/blogs/news/chasing-glory-card-origins">card origins guide</Link> traces every card to its English printing. Use
          this one to pick a box, sort your pulls or plan a master set.
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
          Both boxes pull from the same card list, but Pokémon China prints a different odds chart for each pack size. Applied to one
          box, the published shares work out to roughly this:
        </p>
        <div className="table-scroll">
          <table className="data-table">
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
          The jumbo box has 1.6 times the cards of a slim box but more than twice the top-band pulls, because its odds are better per
          card as well: 1.00% of jumbo cards are Super Rare or higher, against 0.73% of slim cards. Most slim boxes will not have a
          Super Rare, Special Art Rare or Ultra Rare in them. Most jumbo boxes will have one.
        </p>

        <h2 id="special-art-rares">All 18 Special Art Rares</h2>
        <p>
          Fourteen Pokémon ex and four Supporters, 262 to 279. Brock's Scouting 276/222 is the Simplified Chinese exclusive.
        </p>
        <Gallery cards={lead(byRange(262, 279), ['268', '276', '267', '279', '272', '269', '266', '264'])} cols={3} />

        <h2 id="super-rares">All 33 Super Rares</h2>
        <p>Full arts of all 22 Pokémon ex (229 to 250) and 11 Supporters (251 to 261).</p>
        <Gallery cards={lead(byRange(229, 261), ['239', '259', '238', '237', '245', '241', '232', '255'])} cols={3} />

        <h2 id="ultra-rares">All 8 Ultra Rares</h2>
        <p>The gold cards, 280 to 287. Team Rocket's Mewtwo ex is the top chase.</p>
        <Gallery cards={lead(byRange(280, 287), ['282', '280', '281', '285', '283', '284'])} cols={4} />

        <h2 id="art-rares">All 6 Art Rares</h2>
        <p>Only six this time, each a full illustration of a main-set Pokémon.</p>
        <Gallery cards={lead(byRange(223, 228), ['228', '225', '227', '226'])} cols={3} />

        <h2 id="ladders">One Pokémon, four rarities</h2>
        <p>Six Pokémon ex reach the gold tier. Here is every number each one prints at, if you want to collect the full run:</p>
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

        <h2 id="roster">The Trainer roster</h2>
        <p>
          Every Trainer in the set and the Pokémon they own, from most cards to fewest. A Trainer's Pokémon only evolves from the same
          Trainer's Pokémon, so build each line from one Trainer.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Trainer</th>
                <th scope="col">Cards</th>
                <th scope="col">Pokémon</th>
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((r) => (
                <tr key={r.owner}>
                  <th scope="row">{r.owner}</th>
                  <td>{r.count}</td>
                  <td>{r.mons.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 222. The main set runs 001 to 222, from Common to Double Rare, and everything above 222 is a
          secret rare. The rarer versions of a card sit in the secret block at unrelated numbers, so match them by name.
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
          The numbered set is 287 cards. A true master set adds a Poké Ball pattern holo and a Master Ball pattern holo of each of the 198
          Common, Uncommon and Rare cards, for 683 in total.
        </p>
        <p>
          The Poké Ball holos come fastest, since they share the most common holo band. The Master Ball holos share the Double Rare band,
          about 4 per slim box or 8 per jumbo box spread across 228 different cards in that band, so they take a long time. The 59 top-band
          cards are harder still. Like most sets, the practical route is to open boxes for fun and the lower tiers, then pick up the big
          cards as singles. The <Link to="/sets/csv10">Chasing Glory card list</Link> lets you tick off what you have.
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
