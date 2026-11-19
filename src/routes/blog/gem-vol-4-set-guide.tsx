import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/gem-vol-4.json'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-4-set-guide')!

const FULL_ARTS = setData.cards.filter((c) => c.version === 7)
// The gallery shows the most wanted full arts first (the Chinese Exclusive Ponyta, then Eevee, Flutter Mane and other favorites), then the rest in number order.
const GALLERY_FIRST = [1, 4, 28, 9, 20, 24, 12, 27, 16, 22]
const galleryRank = (c: (typeof FULL_ARTS)[number]) => {
  const i = GALLERY_FIRST.indexOf(c.pokemonIndex)
  return i < 0 ? 100 + c.pokemonIndex : i
}
const FULL_ARTS_GALLERY = [...FULL_ARTS].sort((a, b) => galleryRank(a) - galleryRank(b))
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)

// How to tell the seven versions of any Pokémon apart. Finishes are as
// printed on Ponyta's run (0101 to 0107) and match Pokémon China's list.
const VERSIONS = [
  { v: '01', symbol: '●', rarity: 'Common', look: "Energy-type pattern holo, matching the Pokémon's type" },
  { v: '02', symbol: '●', rarity: 'Common', look: 'Poké Ball pattern holo' },
  { v: '03', symbol: '◆', rarity: 'Uncommon', look: 'Glitter holo across the whole card' },
  { v: '04', symbol: '◆', rarity: 'Uncommon', look: 'Starburst holo across the whole card' },
  { v: '05', symbol: '★', rarity: 'Rare', look: 'Master Ball pattern holo' },
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
  { id: 'reading-a-card', label: 'Reading a Gem Vol 4 card' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many full arts are in Gem 4?',
    a: '28, one for every Pokémon in the set. Every full art is numbered 07, for example 0107/07 for Ponyta.',
  },
  {
    q: 'What do the symbols next to the card number mean?',
    a: 'They show rarity: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare, and ★★★ for the full art (Triple Rare).',
  },
  {
    q: 'What is the Chinese Exclusive in Gem Vol 4?',
    a: 'Ponyta 0107/07, the full art by MINAMINAMI Take. It is new art drawn for this set, with no English printing.',
  },
  {
    q: 'Does Gem Vol 4 have Trainer’s Pokémon?',
    a: 'No. Every Pokémon in Gem Vol 4 is printed on its own, with no Trainer in the card name.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. Commons fill in fast, but with about 1.3 full arts per box and 28 to find, landing every full art from boxes alone takes dozens of boxes, so most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-4-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
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
  component: GemVol4SetGuide,
})

function GemVol4SetGuide() {
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
        lede="Each of the 28 Pokémon comes in seven versions, from a common holo to a full art, led by Ponyta's Chinese Exclusive. This guide shows how to tell them apart and what it really takes to finish the set."
        cta={{
          heading: 'Collect Gem Vol 4',
          body: 'Track every card on the full checklist, or pick up a booster box and start ripping.',
          links: [
            { to: '/sets/chinese/gem-vol-4', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-4-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 4 (Gem 4, CBB4C) is the Ponyta set: 196 holo cards, 28 Pokémon with seven versions each, and a Year of the Horse theme to
          match, led by the Chinese Exclusive Ponyta full art. Our <Link to="/blog/gem-vol-4-release-news">release post</Link> covers what is new in the set, and our{' '}
          <Link to="/blog/gem-vol-4-card-origins">card origins guide</Link> traces every illustration back to its English card.
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
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">What an average box holds</caption>
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
          There is one full art per Pokémon, each with its own illustration. Ponyta's is the only Chinese Exclusive, drawn just for Gem Vol 4.
        </p>
        <ul className="card-grid cols-4">
          {FULL_ARTS_GALLERY.map((c) => (
            <li key={c.number}>
              <figure>
                <img src={c.image} alt={`${c.name} full art ${c.number}, Gem Vol 4`} loading="lazy" width={300} height={419} />
                <figcaption>
                  {EXCLUSIVE.has(c.number) && <ChineseExclusiveBadge />}
                  <strong>{c.name}</strong>
                  {c.number}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <BuyStrip />

        <h2 id="roster">The full roster</h2>
        <p>
          All 28 Pokémon, in set order. Each one has seven cards, numbered from its first two digits plus 01 to 07. None of
          them belong to a Trainer.
        </p>
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
              {FULL_ARTS.map((c) => {
                const pp = c.number.slice(0, 2)
                return (
                  <tr key={c.number} className={EXCLUSIVE.has(c.number) ? 'is-current' : undefined}>
                    <th scope="row">{pp}</th>
                    <td>{c.name}</td>
                    <td>
                      {pp}01 to {pp}07
                      {EXCLUSIVE.has(c.number) ? ' (07 is a Chinese Exclusive)' : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h2 id="reading-a-card">Reading a Gem Vol 4 card</h2>
        <p>
          Every card number has two parts. The first two digits are the Pokémon (01 to 28) and the next two are the version (01 to
          07), so 0105/07 is Ponyta's version 05. The symbol printed after the number gives the rarity, and the holo pattern tells you the
          version at a glance:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">Reading a Gem Vol 4 card</caption>
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
        <p className="table-note">Finishes as printed on Ponyta's run, 0101/07 to 0107/07.</p>

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
          need as singles. The <Link to="/sets/chinese/gem-vol-4">Gem Vol 4 card list</Link> makes it easy
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
