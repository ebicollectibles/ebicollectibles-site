import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/gem-vol-3.json'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-3-set-guide')!

type Card = (typeof setData.cards)[number]
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)

const POKEMON_CARDS = setData.cards.filter((c) => c.pokemonIndex <= 18)
const FULL_ARTS = POKEMON_CARDS.filter((c) => c.version === 7 && c.rarity === 'Triple Rare')
const EX_CARDS = POKEMON_CARDS.filter((c) => c.version === 7 && c.rarity === 'Rare')
const TRAINERS_ENERGY = setData.cards.filter((c) => c.pokemonIndex >= 19)
const ROSTER = POKEMON_CARDS.filter((c) => c.version === 1).map((c) => {
  const top = POKEMON_CARDS.find((x) => x.pokemonIndex === c.pokemonIndex && x.version === 7)!
  return { pp: c.number.slice(0, 2), name: c.name, seventh: top.rarity === 'Rare' ? top.name : 'Full art', exclusive: EXCLUSIVE.has(top.number) }
})

// How to tell the versions apart. Finishes as printed on Gengar's run.
const VERSIONS = [
  { v: '01', symbol: '●', rarity: 'Common', look: 'Energy-type pattern foil' },
  { v: '02', symbol: '●', rarity: 'Common', look: 'Poké Ball pattern foil' },
  { v: '03', symbol: '◆', rarity: 'Uncommon', look: 'Glitter foil across the whole card' },
  { v: '04', symbol: '◆', rarity: 'Uncommon', look: 'Starburst foil across the whole card' },
  { v: '05', symbol: '★', rarity: 'Rare', look: 'Master Ball pattern foil' },
  { v: '06', symbol: '★★', rarity: 'Double Rare', look: 'Pink Gem Pack logo stamped on the art' },
  { v: '07', symbol: '★★★ or ★', rarity: 'Full art or ex', look: 'A full art (Triple Rare) for 9 Pokémon, a Pokémon ex (Rare) for the other 9' },
]

// Average contents of one 72-card box, from Pokémon China's print shares.
const BOX_AVERAGE = [
  { label: 'Common', share: '50.00%', perBox: '36' },
  { label: 'Uncommon', share: '25.00%', perBox: '18' },
  { label: 'Rare', share: '18.42%', perBox: 'about 13' },
  { label: 'Double Rare', share: '4.77%', perBox: 'about 3 to 4' },
  { label: 'Triple Rare', share: '1.81%', perBox: 'about 1.3' },
]

const TOC = [
  { id: 'reading-a-card', label: 'Reading a Gem Vol 3 card' },
  { id: 'full-arts', label: 'All 9 full arts' },
  { id: 'pokemon-ex', label: 'All 9 Pokémon ex' },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'roster', label: 'The full roster' },
  { id: 'box-average', label: 'What an average box holds' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many full arts are in Gem Vol 3?',
    a: 'Nine. Five of them, Meowth, Gengar, Cubone, Chandelure and Ceruledge, are new art drawn for this set. The other four, Mismagius, Mimikyu, Morpeko and Greavard, reprint existing art.',
  },
  {
    q: 'Why are the Pokémon ex marked Rare?',
    a: 'In Gem Vol 3 the nine Pokémon ex use the ★ Rare symbol, the same as version 05. Pokémon China counts them with the Rares, which is why there are 27 Rare cards in the set.',
  },
  {
    q: 'What do the symbols next to the card number mean?',
    a: 'They show rarity: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare.',
  },
  {
    q: 'Which cards are exclusive to Gem Vol 3?',
    a: 'The five lantern full arts: Meowth 0207/07, Gengar 0307/07, Cubone 0407/07, Chandelure 1107/07 and Ceruledge 1507/07. They were drawn for this set and do not appear in any other product.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. Commons fill in fast, but with about 1.3 Triple Rares per box spread across 16 different cards, landing every one from boxes alone takes dozens of boxes, so most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-3-set-guide')({
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
  component: GemVol3SetGuide,
})

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number}, Gem Vol 3`} loading="lazy" width={300} height={419} />
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

function GemVol3SetGuide() {
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
        lede="How to read a Gem Pack Vol. 3 card, every full art and Pokémon ex in the set, the full roster, and what a master set takes."
        cta={{
          heading: 'Collect Gem Vol 3',
          body: 'Track every card on the full checklist, or pick up a booster box and start ripping.',
          links: [
            { to: '/sets/gem-vol-3', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-3-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 3 (CBB3C) is the night-town set: 136 holo cards, 18 Pokémon with seven versions each, and a block of Trainer and
          Energy cards. Our <Link to="/blogs/news/gem-vol-3-has-arrived">release post</Link> covers what is new in the set, and our{' '}
          <Link to="/blogs/news/gem-vol-3-card-origins">card origins guide</Link> traces every artwork back to its English card. Use
          this one to sort your pulls or plan a master set.
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

        <h2 id="reading-a-card">Reading a Gem Vol 3 card</h2>
        <p>
          Pokémon cards are numbered PPVV/07: the first two digits are the Pokémon (01 to 18) and the next two are the version, so 0305/07
          is Gengar's version 05. Trainers are numbered 19VV/04 and Energy 20VV/06. The symbol after the number gives the rarity, and
          the foil tells you the version at a glance:
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
        <p className="table-note">Finishes as printed on Gengar's run, 0301/07 to 0306/07.</p>

        <h2 id="full-arts">All 9 full arts</h2>
        <p>Five of these are new art drawn for this set, marked Exclusive. The other four reprint existing art.</p>
        <Gallery cards={FULL_ARTS} cols={3} />

        <h2 id="pokemon-ex">All 9 Pokémon ex</h2>
        <p>The other nine Pokémon get a Pokémon ex in the 07 slot instead of a full art. In this set they are Rares (★).</p>
        <Gallery cards={EX_CARDS} cols={3} />

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Super Rod, Nest Ball and Switch are Double Rares, and Arven is a full-art Triple Rare. The six Energy cards, all Triple Rares,
          are Basic Fighting, Basic Metal and Luminous Energy, each printed twice.
        </p>
        <Gallery cards={TRAINERS_ENERGY} cols={4} />

        <h2 id="roster">The full roster</h2>
        <p>All 18 Pokémon in set order, with what each one gets in the 07 slot.</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pokémon</th>
                <th scope="col">Version 07</th>
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((r) => (
                <tr key={r.pp} className={r.exclusive ? 'is-current' : undefined}>
                  <th scope="row">{r.pp}</th>
                  <td>{r.name}</td>
                  <td>
                    {r.seventh}
                    {r.exclusive ? ' (exclusive)' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="box-average">What an average box holds</h2>
        <p>
          A booster box is 18 packs of 4, so 72 holo cards. Pokémon China publishes the share of the print run each rarity makes up.
          Applied to one box, that works out to roughly this:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Print share</th>
                <th scope="col">Per 72-card box</th>
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

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set is all 136 cards. The 72 Commons and Uncommons come quickly, since a box averages 54 of them. The Rares,
          including the nine ex, fill in at about 13 a box.
        </p>
        <p>
          The Triple Rares are the hard part. A box averages about 1.3, and that slot is shared by the nine full arts, Arven and the six
          Energy cards, 16 cards in all. If each is equally likely, any one specific Triple Rare shows up in roughly 1 box in 12, so
          pulling every one from boxes alone takes dozens of boxes.
        </p>
        <p>
          So most collectors open a few boxes for fun and for the lower rarities, then buy the full arts they still need as singles. The{' '}
          <Link to="/sets/gem-vol-3">Gem Vol 3 card list</Link> makes it easy to track what you still need.
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
