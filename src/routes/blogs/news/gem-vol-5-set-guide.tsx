import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/gem-vol-5.json'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-5-set-guide')!

const FULL_ARTS = setData.cards.filter((c) => c.version === 7)
// The gallery shows the most wanted full arts first (the exclusive Captain Pikachu and the three Horizons starters, then Latios and other favorites), then the rest in number order.
const GALLERY_FIRST = [1, 22, 23, 24, 13, 25, 8, 4, 2, 20, 28, 18]
const galleryRank = (c: (typeof FULL_ARTS)[number]) => {
  const i = GALLERY_FIRST.indexOf(c.pokemonIndex)
  return i < 0 ? 100 + c.pokemonIndex : i
}
const FULL_ARTS_GALLERY = [...FULL_ARTS].sort((a, b) => galleryRank(a) - galleryRank(b))
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)

// How to tell the seven versions of any Pokémon apart. Finishes are as
// printed on Floragato's run (2201 to 2207) and match Pokémon China's list.
const VERSIONS = [
  { v: '01', symbol: '●', rarity: 'Common', look: "Energy-type pattern foil, matching the Pokémon's type" },
  { v: '02', symbol: '●', rarity: 'Common', look: 'Poké Ball pattern foil' },
  { v: '03', symbol: '◆', rarity: 'Uncommon', look: 'Glitter foil across the whole card' },
  { v: '04', symbol: '◆', rarity: 'Uncommon', look: 'Starburst foil across the whole card' },
  { v: '05', symbol: '★', rarity: 'Rare', look: 'Master Ball pattern foil' },
  { v: '06', symbol: '★★', rarity: 'Double Rare', look: 'Pink Gem Pack logo stamped on the art' },
  { v: '07', symbol: '★★★', rarity: 'Triple Rare', look: 'Full art with its own illustration' },
]

// Average contents of one 72-card box, from Pokémon China's print shares.
const BOX_AVERAGE = [
  { label: 'Common', share: '50.00%', perBox: '36' },
  { label: 'Uncommon', share: '25.00%', perBox: '18' },
  { label: 'Rare', share: '17.39%', perBox: 'about 12 to 13' },
  { label: 'Double Rare', share: '5.80%', perBox: 'about 4' },
  { label: 'Full art', share: '1.81%', perBox: 'about 1.3' },
]

const TOC = [
  { id: 'box-average', label: 'What an average box holds' },
  { id: 'full-arts', label: 'All 28 full arts' },
  { id: 'roster', label: 'The full roster' },
  { id: 'reading-a-card', label: 'Reading a Gem Vol 5 card' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many full arts are in Gem Vol 5?',
    a: '28, one for every Pokémon in the set. Every full art is numbered 07, for example 0107/07 for Captain Pikachu.',
  },
  {
    q: 'What do the symbols next to the card number mean?',
    a: 'They show rarity: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare, and ★★★ for the full art (Triple Rare).',
  },
  {
    q: 'Which cards are exclusive to Gem Vol 5?',
    a: 'The four Pokémon Horizons full arts: Captain Pikachu with Friede (0107/07), Floragato with Liko (2207/07), Crocalor with Roy (2307/07) and Quaxwell with Dot (2407/07). They are new art drawn for this set, with no English printing.',
  },
  {
    q: 'Does Gem Vol 5 have Trainer’s Pokémon?',
    a: 'No. Four full arts show Pokémon Horizons characters alongside their Pokémon, but no card is a Trainer’s Pokémon with a Trainer in the card name.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. Commons fill in fast, but with about 1.3 full arts per box and 28 to find, landing every full art from boxes alone takes dozens of boxes, so most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-5-set-guide')({
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
  component: GemVol5SetGuide,
})

function GemVol5SetGuide() {
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
        lede="How to tell each Gem Pack Vol. 5 version apart, every full art in the set, the full roster, and what a master set takes."
        cta={{
          heading: 'Collect Gem Vol 5',
          body: 'Track every card on the full checklist, or pick up a booster box and start ripping.',
          links: [
            { to: '/sets/gem-vol-5', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-5-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 5 (CBB5C) is the Pokémon Horizons set: 196 holo cards, 28 Pokémon with seven versions each, and four full arts
          starring the Rising Volt Tacklers. Our <Link to="/blogs/news/gem-vol-5-has-arrived">release post</Link> covers what is new in the set, and our{' '}
          <Link to="/blogs/news/gem-vol-5-card-origins">card origins guide</Link> traces every illustration back to its English card.
          Use this one to sort your pulls or plan a master set.
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

        <h2 id="full-arts">All 28 full arts</h2>
        <p>
          There is one full art per Pokémon, each with its own illustration. Four of them, the Pokémon Horizons cards, were drawn just for Gem Vol 5.
        </p>
        <div className="card-grid cols-4">
          {FULL_ARTS_GALLERY.map((c) => (
            <figure key={c.number}>
              <img src={c.image} alt={`${c.name} full art ${c.number}, Gem Vol 5`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.number}
                {EXCLUSIVE.has(c.number) ? ' · Exclusive' : ''}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="roster">The full roster</h2>
        <p>
          All 28 Pokémon, in set order. Each one has seven cards, numbered from its first two digits plus 01 to 07. There are no
          Trainer's Pokémon in this volume.
        </p>
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
              {FULL_ARTS.map((c) => {
                const pp = c.number.slice(0, 2)
                return (
                  <tr key={c.number} className={EXCLUSIVE.has(c.number) ? 'is-current' : undefined}>
                    <th scope="row">{pp}</th>
                    <td>{c.name}</td>
                    <td>
                      {pp}01 to {pp}07
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h2 id="reading-a-card">Reading a Gem Vol 5 card</h2>
        <p>
          Every card number has two parts. The first two digits are the Pokémon (01 to 28) and the next two are the version (01 to
          07), so 2205/07 is Floragato's version 05. The symbol printed after the number gives the rarity, and the foil tells you the
          version at a glance:
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
                    <span className="sym" aria-hidden="true">
                      {v.symbol}
                    </span>{' '}
                    {v.rarity}
                  </td>
                  <td>{v.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Finishes as printed on Floragato's run, 2201/07 to 2207/07.</p>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set is all 196 cards. The commons and uncommons come quickly, since a box averages 54 of them and there are only
          112 to find. The higher rarities take much longer.
        </p>
        <p>
          A box averages about 1.3 full arts, spread across 28 different cards. If each full art is equally likely, any one
          specific full art shows up in roughly 1 box in 21, and pulling all 28 from boxes alone would take dozens of boxes. The
          Double Rares are friendlier, at about 4 per box, but still take many boxes to complete.
        </p>
        <p>
          So most collectors open a few boxes for fun and for the lower rarities, then buy the full arts and Double Rares they still
          need as singles. The <Link to="/sets/gem-vol-5">Gem Vol 5 card list</Link> makes it easy
          to track what you still need.
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
