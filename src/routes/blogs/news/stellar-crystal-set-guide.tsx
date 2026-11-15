import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv9.json'

const post = BLOG_POSTS.find((p) => p.slug === 'stellar-crystal-set-guide')!

type Card = (typeof setData.cards)[number]
const BY_NO = new Map(setData.cards.map((c) => [c.pokemonIndex, c]))
// Cards in the order we want them shown (most wanted first), by collector number.
const pick = (nos: number[]) => nos.map((n) => BY_NO.get(n)!)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Stellar Crystal`} loading="lazy" width={300} height={419} />
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

// Averages per pack from Pokémon China's two odds charts. Each share is of
// all cards printed for that pack size, applied to the cards in one pack.
const PACKS = [
  { row: 'Cards per pack', slim: '5', jumbo: '20' },
  { row: 'Holos per pack', slim: '1', jumbo: '6' },
  { row: 'Common and Uncommon', slim: '4', jumbo: '14' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 0.7', jumbo: 'about 4.4' },
  { row: 'Double Rare, Art Rare, ACE SPEC and Master Ball pattern', slim: 'about 0.27 (1 in 4 packs)', jumbo: 'about 1.4' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: '1 in 27 packs', jumbo: '1 in 5 packs' },
]

const BLOCKS = [
  { nos: '001 to 175', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '176 to 189', what: 'Items', rarity: 'C, U, ACE' },
  { nos: '190 to 195', what: 'Pokémon Tools', rarity: 'U, ACE' },
  { nos: '196 to 204', what: 'Supporters', rarity: 'U (Drasna is C)' },
  { nos: '205 to 207', what: 'Stadiums', rarity: 'U, ACE' },
  { nos: '208', what: 'Special Energy', rarity: 'ACE' },
  { nos: '209 to 214', what: 'Art Rares', rarity: 'AR' },
  { nos: '215 to 241', what: 'Super Rare full arts of 18 ex and 9 Supporters', rarity: 'SR' },
  { nos: '242 to 257', what: 'Special Art Rares of 10 ex and 6 Supporters', rarity: 'SAR' },
  { nos: '258 to 266', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// Every Pokémon ex that reaches the secret block, with every number it prints at.
const LADDER_NAMES = [
  'Pikachu ex',
  'Terapagos ex',
  'Latias ex',
  'Hydreigon ex',
  'Alolan Exeggutor ex',
  'Lapras ex',
  'Cinderace ex',
  'Archaludon ex',
  'Hydrapple ex',
  'Sinistcha ex',
  'Galvantula ex',
  'Durant ex',
  'Flygon ex',
  'Tatsugiri ex',
  'Scovillain ex',
  'Palossand ex',
  'Slaking ex',
  'Cyclizar ex',
]
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim pack vs jumbo pack' },
  { id: 'special-art-rares', label: 'All 16 Special Art Rares' },
  { id: 'super-rares', label: 'All 27 Super Rares' },
  { id: 'ultra-rares', label: 'All 9 Ultra Rares' },
  { id: 'art-rares', label: 'All 6 Art Rares' },
  { id: 'ladders', label: 'Every Pokémon ex at every rarity' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are slim or jumbo Stellar Crystal packs better?',
    a: 'For chase cards, jumbo. Pokémon China prints Super Rares, Special Art Rares and Ultra Rares at 1.00% of jumbo cards against 0.73% of slim cards, so a jumbo pack averages one every 5 packs and a slim pack one every 27.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both pull from the same 266-card list and the same Poké Ball and Master Ball holos. Only the number of cards per pack and the odds change.',
  },
  {
    q: 'Which Stellar Crystal card is a Chinese exclusive?',
    a: "Lisia's Appeal 257/208, a Special Art Rare by En Morikura.",
  },
  {
    q: 'Which Pokémon ex reach the gold Ultra Rare tier?',
    a: 'Five: Cinderace ex, Lapras ex, Pikachu ex, Alolan Exeggutor ex and Terapagos ex. Pikachu ex, Alolan Exeggutor ex and Terapagos ex also have a Special Art Rare.',
  },
  {
    q: 'How many cards are in a Stellar Crystal master set?',
    a: '620: the 266 numbered cards plus a Poké Ball pattern and a Master Ball pattern holo of each of the 177 Common, Uncommon and Rare cards.',
  },
]

export const Route = createFileRoute('/blogs/news/stellar-crystal-set-guide')({
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
  component: StellarCrystalSetGuide,
})

function StellarCrystalSetGuide() {
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
        lede="Slim pack or jumbo pack, every chase card in Stellar Crystal from the Pikachu ex SAR down, each Pokémon ex at every rarity, and what a master set takes."
        cta={{
          heading: 'Collect Stellar Crystal',
          body: 'Track every card on the full checklist and tick off what you have.',
          links: [{ to: '/sets/csv9', label: 'Browse the card list' }],
        }}
      >
        <p>
          Stellar Crystal (CSV9C) is the Stellar Tera set: 266 cards with Pikachu on the pack, Terapagos ex, and one Chinese exclusive,
          sold in slim and jumbo packs. Our <Link to="/blogs/news/stellar-crystal-has-arrived">release post</Link> covers what is new,
          and our <Link to="/blogs/news/stellar-crystal-card-origins">card origins guide</Link> traces every card to its English
          printing. Use this one to pick a pack size, sort your pulls or plan a master set.
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

        <h2 id="slim-vs-jumbo">Slim pack vs jumbo pack</h2>
        <p>
          Both pack sizes pull from the same card list, but Pokémon China prints a different odds chart for each. Applied to one pack,
          the published shares work out to roughly this:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Per pack</th>
                <th scope="col">Slim pack</th>
                <th scope="col">Jumbo pack</th>
              </tr>
            </thead>
            <tbody>
              {PACKS.map((b) => (
                <tr key={b.row}>
                  <th scope="row">{b.row}</th>
                  <td>{b.slim}</td>
                  <td>{b.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official print shares, not guarantees.</p>
        <p>
          The jumbo pack is better per card as well as bigger: 1.00% of jumbo cards are Super Rare or higher, against 0.73% of slim
          cards, about 37% more. Card for card, 120 jumbo cards average about 1.2 top-band pulls and 75 slim cards about 0.55.
        </p>

        <h2 id="special-art-rares">All 16 Special Art Rares</h2>
        <p>
          242 to 257: ten Pokémon ex and six Supporters. Lisia's Appeal 257/208 is the Simplified Chinese exclusive.
        </p>
        <Gallery cards={pick([245, 257, 251, 247, 248, 250, 249, 244, 243, 246, 242, 253, 254, 252, 255, 256])} cols={4} />

        <h2 id="super-rares">All 27 Super Rares</h2>
        <p>Full arts of 18 Pokémon ex (215 to 232) and 9 Supporters (233 to 241).</p>
        <Gallery
          cards={pick([
            221, 241, 232, 223, 226, 218, 220, 228, 227, 237, 234, 233, 236, 240, 239, 238, 235, 217, 216, 222, 225, 229, 215, 219, 224,
            230, 231,
          ])}
          cols={3}
        />

        <h2 id="ultra-rares">All 9 Ultra Rares</h2>
        <p>The gold cards, 258 to 266: five Pokémon ex, then the Trainers.</p>
        <Gallery cards={pick([260, 262, 259, 258, 261, 266, 263, 264, 265])} cols={3} />

        <h2 id="art-rares">All 6 Art Rares</h2>
        <p>209 to 214, each a full illustration of a main-set Pokémon.</p>
        <Gallery cards={pick([212, 211, 214, 210, 209, 213])} cols={3} />

        <h2 id="ladders">Every Pokémon ex at every rarity</h2>
        <p>
          18 of the 22 Pokémon ex reach the secret block. Here is every number each one prints at. Ceruledge ex, Sylveon ex, Zacian ex
          and Noivern ex are Double Rare only.
        </p>
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

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 208. The main set runs 001 to 208, from Common to Double Rare, with nine pink ACE SPEC cards
          among the Trainers and Energy. Everything above 208 is a secret rare. The rarer versions of a card sit in the secret block at
          unrelated numbers, so match them by name.
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
          The numbered set is 266 cards. A true master set adds a Poké Ball pattern holo and a Master Ball pattern holo of each of the 177
          Common, Uncommon and Rare cards, for 620 in total.
        </p>
        <p>
          The Poké Ball holos come quickly, since they share the most common holo band. The Master Ball holos share the Double Rare band,
          which averages about one card every 4 slim packs or 1.4 per jumbo pack across 214 different cards, so they take a long time.
          The 52 top-band cards are harder still. The practical route is to open packs for fun and the lower tiers, then pick up the big
          cards as singles. The <Link to="/sets/csv9">Stellar Crystal card list</Link> lets you tick off what you have.
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
