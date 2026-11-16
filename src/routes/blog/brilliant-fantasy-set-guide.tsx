import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv8.json'

const post = BLOG_POSTS.find((p) => p.slug === 'brilliant-fantasy-set-guide')!

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
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, Brilliant Fantasy`} loading="lazy" width={300} height={419} />
          <figcaption>
            {EXCLUSIVE.has(c.number) && <ChineseExclusiveBadge />}
            <strong>{c.name}</strong>
            {c.number}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// Averages from Pokémon China's two odds charts. Each share is of all
// cards printed for that pack size, applied to the cards in one box.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Common and Uncommon', slim: '60', jumbo: '84' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 10', jumbo: 'about 27' },
  { row: 'Double Rare, Art Rare, ACE SPEC and Master Ball pattern', slim: 'about 4', jumbo: 'about 8' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

const BLOCKS = [
  { nos: '001 to 172', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '173 to 183', what: 'Items', rarity: 'U, ACE' },
  { nos: '184 to 190', what: 'Pokémon Tools', rarity: 'U, ACE' },
  { nos: '191 to 200', what: 'Supporters', rarity: 'U (Caretaker is C)' },
  { nos: '201 to 205', what: 'Stadiums', rarity: 'U, ACE' },
  { nos: '206 to 207', what: 'Special Energy', rarity: 'U, ACE' },
  { nos: '208 to 213', what: 'Art Rares', rarity: 'AR' },
  { nos: '214 to 241', what: 'Super Rare full arts of 18 ex and 10 Supporters', rarity: 'SR' },
  { nos: '242 to 255', what: 'Special Art Rares of 10 ex and 4 Supporters', rarity: 'SAR' },
  { nos: '256 to 264', what: 'Gold Ultra Rares', rarity: 'UR' },
]

// Every Pokémon ex that reaches the secret block, with every number it prints at.
const LADDER_NAMES = [
  'Milotic ex',
  'Teal Mask Ogerpon ex',
  'Pecharunt ex',
  'Bloodmoon Ursaluna ex',
  'Hearthflame Mask Ogerpon ex',
  'Wellspring Mask Ogerpon ex',
  'Cornerstone Mask Ogerpon ex',
  'Okidogi ex',
  'Munkidori ex',
  'Fezandipiti ex',
  'Dragapult ex',
  'Black Kyurem ex',
  'Kingdra ex',
  'Palafin ex',
  'Revavroom ex',
  'Medicham ex',
  'Orthworm ex',
  'Blissey ex',
]
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim box vs jumbo box' },
  { id: 'special-art-rares', label: 'All 14 Special Art Rares' },
  { id: 'super-rares', label: 'All 28 Super Rares' },
  { id: 'ultra-rares', label: 'All 9 Ultra Rares' },
  { id: 'art-rares', label: 'All 6 Art Rares' },
  { id: 'ladders', label: 'Every Pokémon ex at every rarity' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Should I buy the slim or the jumbo Brilliant Fantasy box?',
    a: 'For chase cards, jumbo. A jumbo box averages about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 for a slim box, and its odds are better per card too. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both pull from the same 264-card list and the same Poké Ball and Master Ball holos. Only the number of cards per pack and the odds change.',
  },
  {
    q: 'What is the Chinese Exclusive in Brilliant Fantasy?',
    a: 'Carmine 255/207, a Special Art Rare by OKACHEKE.',
  },
  {
    q: 'Which Pokémon ex reach the gold Ultra Rare tier?',
    a: 'Three: Teal Mask Ogerpon ex, Pecharunt ex and Bloodmoon Ursaluna ex. Each also has a Double Rare, a Super Rare and a Special Art Rare.',
  },
  {
    q: 'How many cards are in a Brilliant Fantasy master set?',
    a: '616: the 264 numbered cards plus a Poké Ball pattern and a Master Ball pattern holo of each of the 176 Common, Uncommon and Rare cards.',
  },
]

export const Route = createFileRoute('/blog/brilliant-fantasy-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
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
  component: BrilliantFantasySetGuide,
})

function BrilliantFantasySetGuide() {
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
        lede="Slim box or jumbo box, every chase card in Brilliant Fantasy from the Carmine SAR down, each Pokémon ex at every rarity, and what a master set takes."
        cta={{
          heading: 'Collect Brilliant Fantasy',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/chinese/brilliant-fantasy-csv8', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Brilliant Fantasy (CSV8C) is the Kitakami set: 264 cards with Milotic on the pack, every Ogerpon mask, and a Chinese
          Exclusive Carmine Special Art Rare, sold in slim and jumbo packs. Our <Link to="/blog/brilliant-fantasy-release-news">release post</Link> covers
          what is new, and our <Link to="/blog/brilliant-fantasy-card-origins">card origins guide</Link> traces every card to its
          English printing. Use this one to pick a box, sort your pulls or plan a master set.
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
          card as well: 1.00% of jumbo cards are Super Rare or higher, against 0.73% of slim cards. That is about one top-band card every
          5 jumbo packs, against one every 27 slim packs: about half of one per slim box on average, and more than one per jumbo box.
        </p>

        <h2 id="special-art-rares">All 14 Special Art Rares</h2>
        <p>
          242 to 255. The two headline cards first: Milotic ex, the pack Pokémon, and Carmine 255/207, the Chinese Exclusive.
        </p>
        <Gallery cards={pick([244, 255])} cols={2} />
        <p>The Kitakami eight: the four Ogerpon ex masks by Yano Keiji, then Pecharunt ex and the Loyal Three by kantaro.</p>
        <Gallery cards={pick([242, 245, 243, 246, 250, 249, 248, 247])} cols={4} />
        <p>Kieran, Bloodmoon Ursaluna ex, Perrin and Cassiopeia.</p>
        <Gallery cards={pick([254, 251, 253, 252])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 28 Super Rares</h2>
        <p>Full arts of 18 Pokémon ex (214 to 231) and 10 Supporters (232 to 241).</p>
        <Gallery
          cards={pick([
            240, 239, 217, 214, 227, 231, 220, 215, 223, 226, 225, 224, 229, 218, 238, 234, 216, 219, 221, 222, 228, 230, 232, 233, 235,
            236, 237, 241,
          ])}
          cols={4}
        />

        <h2 id="ultra-rares">All 9 Ultra Rares</h2>
        <p>The gold cards, 256 to 264: three Pokémon ex, then the Trainers and Energy.</p>
        <Gallery cards={pick([256, 257, 258, 259, 260, 261, 262, 263, 264])} cols={3} />

        <h2 id="art-rares">All 6 Art Rares</h2>
        <p>208 to 213, each a full illustration of a main-set Pokémon.</p>
        <Gallery cards={pick([209, 208, 213, 210, 211, 212])} cols={3} />

        <h2 id="ladders">Every Pokémon ex at every rarity</h2>
        <p>
          18 of the 22 Pokémon ex reach the secret block. These are the numbers each one prints at. Amoonguss ex, Reshiram ex, Xerneas ex
          and Dialga ex are Double Rare only.
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
          Every card has one number out of 207. The main set runs 001 to 207, from Common to Double Rare, with nine pink ACE SPEC cards
          among the Trainers and Energy. Everything above 207 is a secret rare. The rarer versions of a card sit in the secret block at
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
          The numbered set is 264 cards. A true master set adds a Poké Ball pattern holo and a Master Ball pattern holo of each of the 176
          Common, Uncommon and Rare cards, for 616 in total.
        </p>
        <p>
          The Poké Ball holos come quickly, since they share the most common holo band. The Master Ball holos share the Double Rare band,
          which averages about 4 cards per slim box or 8 per jumbo box across 213 different cards, so they take a long time. The 51
          top-band cards are harder still. The practical route is to open boxes for fun and the lower tiers, then pick up the big cards as
          singles. The <Link to="/sets/chinese/brilliant-fantasy-csv8">Brilliant Fantasy card list</Link> lets you tick off what you have.
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
