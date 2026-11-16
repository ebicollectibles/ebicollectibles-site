import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/gem-vol-2.json'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-2-set-guide')!

type Card = (typeof setData.cards)[number]
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)

const POKEMON_CARDS = setData.cards.filter((c) => c.pokemonIndex <= 9)
// Galleries show the most wanted Eeveelutions first: Umbreon, Sylveon, Espeon, Eevee, Glaceon, Leafeon, Vaporeon, Jolteon, Flareon.
const RANK = [6, 9, 5, 1, 8, 7, 2, 3, 4]
const byRank = (cards: Card[]) => [...cards].sort((a, b) => RANK.indexOf(a.pokemonIndex) - RANK.indexOf(b.pokemonIndex))
// The full arts stay in panorama order (Leafeon, Sylveon, Umbreon, Eevee) so the forest scene reads left to right.
const PANORAMA = [7, 9, 6, 1]
const FULL_ARTS = POKEMON_CARDS.filter((c) => c.version === 15).sort((a, b) => PANORAMA.indexOf(a.pokemonIndex) - PANORAMA.indexOf(b.pokemonIndex))
const VMAX = byRank(POKEMON_CARDS.filter((c) => c.version === 14))
const V_CARDS = byRank(POKEMON_CARDS.filter((c) => c.version === 13))
// Penny's full art first, then the Poké Balls and Energy.
const TRAINERS_ENERGY = setData.cards
  .filter((c) => c.pokemonIndex >= 10)
  .sort((a, b) => Number(b.number.startsWith('1004')) - Number(a.number.startsWith('1004')))
const ROSTER = POKEMON_CARDS.filter((c) => c.version === 1).map((c) => {
  const count = POKEMON_CARDS.filter((x) => x.pokemonIndex === c.pokemonIndex).length
  return { pp: c.number.slice(0, 2), name: c.name, count, fullArt: count === 15 }
})

// How to tell the versions apart. Base card A sits on the odd versions
// and base card B on the even ones, as printed on Eevee's run.
const VERSIONS = [
  { v: '01, 02', symbol: '●', rarity: 'Common', look: 'Energy-type pattern foil (base card A, then B)' },
  { v: '03, 04', symbol: '●', rarity: 'Common', look: 'Poké Ball pattern foil' },
  { v: '05, 06', symbol: '◆', rarity: 'Uncommon', look: 'Glitter foil across the whole card' },
  { v: '07, 08', symbol: '◆', rarity: 'Uncommon', look: 'Starburst foil across the whole card' },
  { v: '09, 10', symbol: '★', rarity: 'Rare', look: 'Master Ball pattern foil' },
  { v: '11, 12', symbol: '★★', rarity: 'Double Rare', look: 'Pink Gem Pack logo stamped on the art' },
  { v: '13', symbol: '★', rarity: 'Rare', look: 'Pokémon V' },
  { v: '14', symbol: '★★★', rarity: 'Triple Rare', look: 'Pokémon VMAX' },
  { v: '15', symbol: '★★★', rarity: 'Triple Rare', look: 'Full art, only for Eevee, Umbreon, Leafeon and Sylveon' },
]

// Average contents of one 60-card box, from Pokémon China's print shares.
const BOX_AVERAGE = [
  { label: 'Common', share: '50.00%', perBox: '30' },
  { label: 'Uncommon', share: '25.00%', perBox: '15' },
  { label: 'Rare', share: '18.13%', perBox: 'about 11' },
  { label: 'Double Rare', share: '4.70%', perBox: 'about 3' },
  { label: 'Triple Rare', share: '2.17%', perBox: 'about 1.3' },
]

const TOC = [
  { id: 'box-average', label: 'What an average box holds' },
  { id: 'full-arts', label: 'The 4 new full arts' },
  { id: 'vmax', label: 'All 9 VMAX' },
  { id: 'v-cards', label: 'All 9 Pokémon V' },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'roster', label: 'The full roster' },
  { id: 'reading-a-card', label: 'Reading a Gem Vol 2 card' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Why do some Gem 2 cards end in /14 and others in /15?',
    a: 'Eevee, Umbreon, Leafeon and Sylveon have a 15th card, the full art, so their cards are numbered out of 15. The other five Eeveelutions stop at the VMAX and are numbered out of 14.',
  },
  {
    q: 'Why does one Pokémon have two different base cards?',
    a: 'Versions 01 to 12 alternate between two base cards with different art and attacks. Base card A is on the odd versions and base card B on the even ones, so every finish comes in both.',
  },
  {
    q: 'What do the symbols next to the card number mean?',
    a: 'They show rarity: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare. The Pokémon V are Rares, and the VMAX and full arts are Triple Rares.',
  },
  {
    q: 'Which cards are exclusive to Gem Vol 2?',
    a: 'The four full arts by HYOGONOSUKE: Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15. They were drawn for this set and join into one scene.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. With about 1.3 Triple Rares per box spread across 20 different cards, landing every VMAX and full art from boxes alone takes dozens of boxes, so most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-2-set-guide')({
  head: () => ({
    meta: [
      { title: `${post.title.replace('Gem Vol 2', 'Gem Vol 2 (Gem 2)')} | EBI Collectibles` },
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
  component: GemVol2SetGuide,
})

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number}, Gem Vol 2`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.number}
            {EXCLUSIVE.has(c.number) ? ' · Exclusive' : ''}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function SymbolCell({ symbol, label }: { symbol: string; label: string }) {
  return (
    <>
      <span className="sym" aria-hidden="true">
        {symbol}
      </span>{' '}
      {label}
    </>
  )
}

function GemVol2SetGuide() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
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
        lede="How to read a Gem Pack Vol. 2 card, the four new full arts, every V and VMAX, the full roster, and what a master set takes."
        cta={{
          heading: 'Collect Gem Vol 2',
          body: 'Track every card on the full checklist, or pick up a booster box and start ripping.',
          links: [
            { to: '/sets/chinese/gem-vol-2', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-2-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 2 (Gem 2, CBB2C) is the Eevee set: 140 holo cards across Eevee and its eight evolutions, with a V and VMAX for each and
          a block of Trainer and Energy cards. Our <Link to="/blog/gem-vol-2-release-news">release post</Link> covers what is new
          in the set, and our <Link to="/blog/gem-vol-2-card-origins">card origins guide</Link> traces every artwork back to its
          English card. Use this one to sort your pulls or plan a master set.
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

        <h2 id="box-average">What an average box holds</h2>
        <p>
          A booster box is 15 packs of 4, so 60 holo cards, and every pack has three Common or Uncommon cards plus one that is Rare or
          better. Applied to one box, Pokémon China's print shares work out to roughly this:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Print share</th>
                <th scope="col">Per 60-card box</th>
              </tr>
            </thead>
            <tbody>
              {BOX_AVERAGE.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  <td>{r.share}</td>
                  <td>{r.perBox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages, not guarantees. Individual boxes vary.</p>

        <h2 id="full-arts">The 4 new full arts</h2>
        <p>
          New art by HYOGONOSUKE, drawn for this set, and shown here in order: lined up as Leafeon, Sylveon, Umbreon and Eevee,
          the four form one forest scene.
        </p>
        <Gallery cards={FULL_ARTS} cols={4} />

        <h2 id="vmax">All 9 VMAX</h2>
        <Gallery cards={VMAX} cols={3} />

        <h2 id="v-cards">All 9 Pokémon V</h2>
        <Gallery cards={V_CARDS} cols={3} />

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Poké Ball, Level Ball and Quick Ball are Double Rares, and Penny is a full-art Triple Rare. The six Energy cards, all Triple
          Rares, are Basic Lightning, Psychic and Darkness Energy, each printed twice.
        </p>
        <Gallery cards={TRAINERS_ENERGY} cols={4} />

        <h2 id="roster">The full roster</h2>
        <p>All nine Pokémon, with how many cards each one has.</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pokémon</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((r) => (
                <tr key={r.pp} className={r.fullArt ? 'is-current' : undefined}>
                  <th scope="row">{r.pp}</th>
                  <td>{r.name}</td>
                  <td>
                    {r.count}
                    {r.fullArt ? ', including a full art' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="reading-a-card">Reading a Gem Vol 2 card</h2>
        <p>
          Pokémon cards are numbered PPVV: the first two digits are the Pokémon (01 to 09) and the next two are the version, so 0614/15
          is Umbreon VMAX. Trainers are numbered 10VV/04 and Energy 11VV/06. The symbol after the number gives the rarity, and the foil
          tells you the version:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">Rarity</th>
                <th scope="col">What to look for</th>
              </tr>
            </thead>
            <tbody>
              {VERSIONS.map((v) => (
                <tr key={v.v}>
                  <th scope="row">{v.v}</th>
                  <td>
                    <SymbolCell symbol={v.symbol} label={v.rarity} />
                  </td>
                  <td>{v.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Finishes as printed on Eevee's run, 0101/15 to 0115/15.</p>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set is all 140 cards. The 72 Commons and Uncommons fill in steadily at 45 a box, and the 27 Rares, including the nine
          V, at about 11.
        </p>
        <p>
          The Triple Rares are the hard part. A box averages about 1.3, and that slot is shared by the nine VMAX, the four full arts,
          Penny and the six Energy cards, 20 cards in all. If each is equally likely, any one specific Triple Rare shows up in roughly 1
          box in 15, so pulling every one from boxes alone takes dozens of boxes.
        </p>
        <p>
          So most collectors open a few boxes for fun and for the lower rarities, then buy the VMAX and full arts they still need as
          singles. The <Link to="/sets/chinese/gem-vol-2">Gem Vol 2 card list</Link> makes it easy to track what you still need.
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
