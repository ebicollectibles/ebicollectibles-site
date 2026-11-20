import { Zh } from '~/components/blog/Zh'
import { rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv3.json'

const post = BLOG_POSTS.find((p) => p.slug === 'fearless-terastal-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// The data marks the one Chinese Exclusive, the Arcanine ex Special Art Rare 155/130.
const isExclusive = (c: Card) => EXCLUSIVE.has(c.number)
// Most wanted cards first (by number out of 130), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/130`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Fearless Terastal`} loading="lazy" width={300} height={418} />
            <figcaption>
              {isExclusive(c) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.number}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const BLOCKS = [
  { nos: '001 to 114', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '115 to 120', what: 'Items and Pokémon Tools', rarity: 'Uncommon' },
  { nos: '121 to 127', what: 'Supporters', rarity: 'Uncommon' },
  { nos: '128 to 130', what: 'Stadiums and Special Energy', rarity: 'Uncommon' },
  { nos: '131 to 138', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '139 to 153', what: 'Super Rare full arts of ex and Supporters', rarity: 'Super Rare' },
  { nos: '154 to 161', what: 'Special Art Rares of ex and Supporters', rarity: 'Special Art Rare' },
  { nos: '162 to 165', what: 'Gold Ultra Rares', rarity: 'Ultra Rare' },
]

// Pokémon China's two odds charts applied to one pack of each size. The
// average is the group's print share (in brackets) times the pack size.
const PACK = [
  { row: 'Cards', p5: '5', p20: '20' },
  { row: 'Holos', p5: '1', p20: '6' },
  { row: 'Common and Uncommon', p5: '4 (80.00%)', p20: '14 (70.00%)' },
  { row: 'Poké Ball pattern holo and Rare', p5: 'about 0.73 (14.53%)', p20: 'about 4.6 (22.99%)' },
  { row: 'Double Rare, Art Rare and Master Ball pattern holo', p5: 'about 0.24 (4.74%)', p20: 'about 1.2 (6.01%)' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', p5: 'about 0.04 (0.73%)', p20: 'about 0.2 (1.00%)' },
]

const LADDER_NAMES = ['Arcanine ex', 'Chien-Pao ex', 'Ting-Lu ex', 'Wo-Chien ex', 'Chi-Yu ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'pack', label: 'What a pack holds' },
  { id: 'exclusive', label: 'Chinese Exclusive: Arcanine ex' },
  { id: 'special-art-rares', label: 'All 8 Special Art Rares' },
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
    q: 'What is the Chinese Exclusive in Fearless Terastal?',
    a: 'The Arcanine ex Special Art Rare 155/130. It is the only card in the set that does not exist in English.',
  },
  {
    q: 'How often does a pack hold a Super Rare or better?',
    a: "About one 5-card pack in 27, or one 20-card pack in five, going by Pokémon China's print shares. Super Rares, Special Art Rares and Ultra Rares make up 0.73% of the 5-card print run and 1.00% of the 20-card print run.",
  },
  {
    q: 'Which Pokémon ex have no secret rare?',
    a: 'Ampharos ex, Mimikyu ex, Klawf ex, Houndoom ex and Melmetal ex only appear as Double Rares.',
  },
  {
    q: 'How many cards are in a Fearless Terastal master set?',
    a: '397: the 165 numbered cards plus a Poké Ball and a Master Ball pattern holo of each of the 116 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blog/fearless-terastal-set-guide')({
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
  component: FearlessTerastalSetGuide,
})

function FearlessTerastalSetGuide() {
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
        lede="Fearless Terastal has 35 secret rares behind a 130-card main set, and its 5-card and 20-card packs have different pull odds. This guide shows every chase card and how often you can expect to pull one."
        cta={{
          heading: 'Collect Fearless Terastal',
          body: 'Browse all 165 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/fearless-terastal-csv3', label: 'See the full card list' }],
        }}
      >
        <p>
          Fearless Terastal (<Zh>无畏太晶</Zh>, set code CSV3C) released on May 16, 2025. It is the Tera Arcanine set: 165 cards in
          5-card and 20-card packs, with 35 secret rares and one Chinese Exclusive, the Arcanine ex Special Art Rare 155/130.
        </p>
        <p>
          Our <Link to="/blog/fearless-terastal-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/fearless-terastal-card-origins">card origins guide</Link> matches every card to its English version. Use
          this guide to sort your pulls or plan a master set.
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

        <h2 id="pack">What a pack holds</h2>
        <p>Pokémon China publishes one odds chart for the 5-card pack and another for the 20-card pack. Applied to one pack of each, they work out to roughly:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">What a pack holds</caption>
            <thead>
              <tr>
                <th scope="col">Per pack</th>
                <th scope="col">5-card pack</th>
                <th scope="col">20-card pack</th>
              </tr>
            </thead>
            <tbody>
              {PACK.map((b) => (
                <tr key={b.row}>
                  <th scope="row">{b.row}</th>
                  <td>{b.p5}</td>
                  <td>{b.p20}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official print shares, shown in brackets. They are not guarantees.</p>
        <p>
          The top group holds 27 different cards. It averages about one in every 27 of the 5-card packs, or one in every five of the
          20-card packs. Card for card the 20-card pack is the richer one: 30% of its cards are holos, against 20% in the 5-card pack.
        </p>

        <h2 id="exclusive">Chinese Exclusive: Arcanine ex</h2>
        <p>
          The Arcanine ex Special Art Rare, 155/130, is the one card here that does not exist in English. Arcanine ex also has a Double Rare
          and a Super Rare, and both of those match English cards.
        </p>
        <Gallery cards={['155', '018', '141'].map((n) => setData.cards.find((c) => c.number === `${n}/130`)!)} cols={3} />

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>These are numbered 154 to 161: five Pokémon ex and three Supporters. Arcanine ex 155/130 is the Chinese Exclusive.</p>
        <Gallery cards={lead(byRange(154, 161), ['155', '160', '157', '158'])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>These are the full arts of nine Pokémon ex and six Supporters, numbered 139 to 153.</p>
        <Gallery cards={lead(byRange(139, 153), ['141', '149', '143', '144', '146', '148'])} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>These are the gold cards, numbered 162 to 165.</p>
        <Gallery cards={byRange(162, 165)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>These are numbered 131 to 138. Each one gives a main-set Pokémon a full illustration.</p>
        <Gallery cards={byRange(131, 138)} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>These are the Pokémon ex with a Special Art Rare, and the number of each version.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">One Pokémon, several rarities</caption>
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">Double Rare</th>
                <th scope="col">Super Rare</th>
                <th scope="col">Special Art Rare</th>
                <th scope="col">Ultra Rare</th>
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
        <p className="table-note">
          Forretress ex, Gyarados ex, Bellibolt ex and Oinkologne ex also have Super Rares (139, 143, 145 and 147). Grusha, Iono and
          Giacomo each have an Uncommon, a Super Rare and a Special Art Rare.
        </p>

        <h2 id="double-rares">All 14 Pokémon ex</h2>
        <p>These are the Double Rares from the main set. Arcanine ex, Forretress ex and Gyarados ex are the Tera Pokémon ex.</p>
        <Gallery cards={lead(setData.cards.filter((c) => c.rarity === 'Double Rare (RR)'), ['018', '033', '005', '043', '080', '015', '031'])} cols={4} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 130. The main set runs 001 to 130, and everything above is a secret rare. The rarer versions
          of a card sit in the secret block at unrelated numbers, so match them by name.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">How the numbers work</caption>
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
          The numbered set is 165 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 116 Commons, Uncommons
          and Rares, for 397 in total.
        </p>
        <p>
          With one holo per 5-card pack and six per 20-card pack, the Master Ball holos and the 27 cards in the top
          rarity group take a long time to pull. Most collectors open packs for fun and the lower rarities, then buy the rarest cards as singles. The{' '}
          <Link to="/sets/chinese/fearless-terastal-csv3">Fearless Terastal card list</Link> lets you tick off what you have.
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
