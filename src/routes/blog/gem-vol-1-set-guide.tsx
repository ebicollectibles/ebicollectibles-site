import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/gem-vol-1.json'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-1-set-guide')!

type Card = (typeof setData.cards)[number]
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)

const POKEMON_CARDS = setData.cards.filter((c) => c.pokemonIndex <= 16)
// The seven long runs (9 or 8 cards): the starters, their middle evolutions and Captain Pikachu.
const LONG_RUNS = POKEMON_CARDS.filter((c) => c.pokemonIndex <= 7)
// Galleries show the most wanted first: Pikachu, then the starters in number order.
const RANK = [7, 1, 2, 3, 4, 5, 6]
const byRank = (cards: Card[]) => [...cards].sort((a, b) => RANK.indexOf(a.pokemonIndex) - RANK.indexOf(b.pokemonIndex))
const HORIZONS = byRank(LONG_RUNS.filter((c) => c.version === 9))
const FULL_ARTS = byRank(LONG_RUNS.filter((c) => c.version === 8))
const SHINY = byRank(LONG_RUNS.filter((c) => c.version === 6))
// Nemona's full art first, then the Poké Balls and Energy.
const TRAINERS_ENERGY = setData.cards
  .filter((c) => c.pokemonIndex >= 17)
  .sort((a, b) => Number(b.number.startsWith('1704')) - Number(a.number.startsWith('1704')))
const ROSTER = POKEMON_CARDS.filter((c) => c.version === 1).map((c) => {
  const count = POKEMON_CARDS.filter((x) => x.pokemonIndex === c.pokemonIndex).length
  return { pp: c.number.slice(0, 2), name: c.name, count, suffix: c.number.slice(4), horizons: count === 9 }
})

// How to tell the versions apart, as printed on Sprigatito (9 cards),
// Floragato (8) and Vulpix (5).
const VERSIONS = [
  { v: '01', symbol: '●', rarity: 'Common', short: { symbol: '●', rarity: 'Common' }, look: 'Energy-type symbol pattern holo' },
  { v: '02', symbol: '●', rarity: 'Common', short: { symbol: '●', rarity: 'Common' }, look: 'Poké Ball pattern holo' },
  { v: '03', symbol: '◆', rarity: 'Uncommon', short: { symbol: '◆', rarity: 'Uncommon' }, look: 'Star glitter holo across the whole card' },
  { v: '04', symbol: '◆', rarity: 'Uncommon', short: { symbol: '★', rarity: 'Rare' }, look: 'Mosaic holo across the whole card (5-card runs: Master Ball pattern)' },
  { v: '05', symbol: '★', rarity: 'Rare', short: { symbol: '★★', rarity: 'Double Rare' }, look: 'Master Ball pattern holo (5-card runs: pink Gem Pack logo stamp)' },
  { v: '06', symbol: '★', rarity: 'Rare', short: null, look: 'Shiny-style card with a star-sparkle frame' },
  { v: '07', symbol: '★★', rarity: 'Double Rare', short: null, look: 'Pink Gem Pack logo stamped on the art' },
  { v: '08', symbol: '★★★', rarity: 'Triple Rare', short: null, look: 'Illustration full art' },
  { v: '09', symbol: '★★★', rarity: 'Triple Rare', short: null, look: 'Pokémon Horizons full art, only in the 9-card runs' },
]

// Pokémon China's print shares, with the cards in each tier.
const PRINT_SHARES = [
  { label: 'Common', share: '50.00%', cards: 32 },
  { label: 'Uncommon', share: '25.00%', cards: 23 },
  { label: 'Rare', share: '17.90%', cards: 23 },
  { label: 'Double Rare', share: '4.93%', cards: 19 },
  { label: 'Triple Rare', share: '2.17%', cards: 18 },
]

const TOC = [
  { id: 'print-shares', label: 'Rarities and print shares' },
  { id: 'horizons', label: 'The 4 Chinese Exclusive Horizons full arts' },
  { id: 'full-arts', label: 'All 7 illustration full arts' },
  { id: 'shiny', label: 'All 7 shiny-style cards' },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'roster', label: 'The full roster' },
  { id: 'reading-a-card', label: 'Reading a Gem Vol 1 card' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Why do some Gem 1 cards end in /09, others in /08 or /05?',
    a: 'The number after the slash is how many cards that Pokémon has. Sprigatito, Fuecoco, Quaxly and Captain Pikachu have 9, including a Horizons full art. Floragato, Crocalor and Quaxwell have 8. The other nine Pokémon have 5.',
  },
  {
    q: 'What is the shiny-style card at version 06?',
    a: 'In the 9- and 8-card runs, version 06 shows the Pokémon in its shiny colors inside a star-sparkle frame. For Sprigatito, Fuecoco, Quaxly and Pikachu it is a different card from the base card, with its own attacks, and the three starters also change HP. For Floragato, Crocalor and Quaxwell the attacks match the base card.',
  },
  {
    q: 'What do the symbols next to the card number mean?',
    a: 'They show rarity: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare. The illustration full arts and Horizons full arts are Triple Rares.',
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 1?',
    a: 'The four Pokémon Horizons full arts: Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09 and Captain Pikachu 0709/09. They are new art made for this set, and the only version 09 cards in it.',
  },
  {
    q: "Why are two cards in Captain Pikachu's row named Pikachu?",
    a: '0706/09 and 0708/09 are an ordinary Pikachu, not Captain Pikachu: the shiny-style card and the illustration full art. They still sit in row 07 and are numbered out of 09.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-1-set-guide')({
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
  component: GemVol1SetGuide,
})

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number}, Gem Vol 1`} loading="lazy" width={300} height={419} />
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

function GemVol1SetGuide() {
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
        lede="The first Gem Pack mixes 9-, 8- and 5-card runs, so the numbering takes a minute to learn. This guide explains it, shows the four Chinese Exclusive Horizons full arts, and works out what it takes to finish the set."
        cta={{
          heading: 'Collect Gem Vol 1',
          body: 'Track every card on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/gem-vol-1', label: 'See the full card list' }],
        }}
      >
        <p>
          Gem Pack Vol. 1 (Gem 1, CBB1C) is the Paldea starter set: 115 holo cards across 16 Pokémon, a block of Trainer and Energy
          cards, and four Chinese Exclusives: the Pokémon Horizons full arts of Sprigatito, Fuecoco, Quaxly and Captain Pikachu. Our{' '}
          <Link to="/blog/gem-vol-1-release-news">release post</Link> covers what is in the set, and our{' '}
          <Link to="/blog/gem-vol-1-card-origins">card origins guide</Link> traces each illustration back to its English card, where there is one. Use this
          one to sort your pulls or plan a master set.
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

        {/* The anchor id sits on a span inside the heading: reader modes drop a heading whose own id

            contains a word like "promo" or "share", and this section would lose its title there. */}

        <h2>

          <span id="print-shares">Rarities and print shares</span>

        </h2>
        <p>
          Every pack has 4 cards, all holo. Pokémon China publishes how much of the print run each rarity takes up, and how many
          different cards share it:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Rarities and print shares</caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Print share</th>
                <th scope="col">Cards in the set</th>
              </tr>
            </thead>
            <tbody>
              {PRINT_SHARES.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  <td>{r.share}</td>
                  <td>{r.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Print shares are published by Pokémon China. Pulls are random, so individual packs vary.</p>

        <h2 id="horizons">The 4 Chinese Exclusive Horizons full arts</h2>
        <p>
          New art from the Pokémon Horizons anime, drawn for this set. Liko kneels with Sprigatito, Roy sits with Fuecoco in his lap,
          Quaxly spreads its wings among stars, and Captain Pikachu stands with Friede.
        </p>
        <Gallery cards={HORIZONS} cols={4} />

        <h2 id="full-arts">All 7 illustration full arts</h2>
        <p>
          Version 08 of every long run. Pikachu runs through a flower meadow with Sprigatito and Pawmi, and each pair of starters shares
          a scene: a flower-filled town for Sprigatito and Floragato, a shop and a market for Fuecoco and Crocalor, and one room for
          Quaxly and Quaxwell.
        </p>
        <Gallery cards={FULL_ARTS} cols={4} />

        <BuyStrip />

        <h2 id="shiny">All 7 shiny-style cards</h2>
        <p>
          Version 06 of every long run shows the Pokémon in its shiny colors, set in a star-sparkle frame. Sprigatito, Fuecoco, Quaxly and
          Pikachu get a different card here, with new attacks (and a different HP for the three starters). Floragato, Crocalor and Quaxwell keep their base card's attacks.
        </p>
        <Gallery cards={SHINY} cols={4} />

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Poké Ball, Great Ball and Ultra Ball are Double Rares, and Nemona is a full-art Triple Rare. The six Energy cards, all Triple
          Rares, are Basic Grass, Fire and Water Energy, each printed twice. The two printings are not side by side in the numbering: they
          run Grass, Fire, Water, then Grass, Fire, Water again, and the second set, 1804 to 1806, carries the Gem Pack logo stamp.
        </p>
        <Gallery cards={TRAINERS_ENERGY} cols={4} />

        <h2 id="roster">The full roster</h2>
        <p>All 16 Pokémon, with how many cards each one has.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">The full roster</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pokémon</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((r) => (
                <tr key={r.pp} className={r.horizons ? 'is-current' : undefined}>
                  <th scope="row">{r.pp}</th>
                  <td>{r.name}</td>
                  <td>
                    {r.count} (numbered {r.suffix})
                    {r.horizons ? ', including a Horizons full art' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Row 07 also holds two plain Pikachu cards, 0706/09 and 0708/09.</p>

        <h2 id="reading-a-card">Reading a Gem Vol 1 card</h2>
        <p>
          Pokémon cards are numbered PPVV: the first two digits are the Pokémon (01 to 16) and the next two are the version, so 0709/09 is
          the Captain Pikachu Horizons full art. Trainers are numbered 17VV/04 and Energy 18VV/06. The symbol after the number gives the
          rarity, and the holo pattern tells you the version. The 5-card runs follow the same order but move up a rarity sooner:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">Reading a Gem Vol 1 card</caption>
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">9- and 8-card runs</th>
                <th scope="col">5-card runs</th>
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
                  <td className={v.short ? undefined : 'cell-none'}>{v.short ? <SymbolCell symbol={v.short.symbol} label={v.short.rarity} /> : 'None'}</td>
                  <td>{v.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Finishes as printed on Sprigatito 0101/09 to 0109/09, Floragato 0201/08 to 0208/08 and Vulpix 0801/05 to 0805/05.</p>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set is all 115 cards. The 55 Commons and Uncommons make up three quarters of the print run, so they fill in fast. The
          23 Rares, including the seven shiny-style cards, take a little longer.
        </p>
        <p>
          The Triple Rares are the hard part. They take up 2.17% of the print run, and that share is split across the seven illustration
          full arts, the four Horizons full arts, Nemona and the six Energy cards, 18 cards in all. If each is equally likely, any one
          specific Triple Rare turns up about once in every 830 cards, or roughly once in 210 packs.
        </p>
        <p>
          So most collectors open packs for fun and for the lower rarities, then buy the full arts they still need as singles. The{' '}
          <Link to="/sets/chinese/gem-vol-1">Gem Vol 1 card list</Link> makes it easy to track what you still need.
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
