import { Zh } from '~/components/blog/Zh'
import { rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv1.json'

const post = BLOG_POSTS.find((p) => p.slug === 'eternal-birth-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const byNos = (nos: string[]) => nos.map((n) => setData.cards.find((c) => c.number === `${n}/127`)!)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 127), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/127`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Eternal Birth`} loading="lazy" width={300} height={418} />
            <figcaption>
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
  { nos: '001 to 106', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '107 to 113', what: 'Items', rarity: 'Uncommon' },
  { nos: '114 to 118', what: 'Pokémon Tools', rarity: 'Uncommon' },
  { nos: '119 to 125', what: 'Supporters', rarity: 'Uncommon (both Professor’s Research are Rare)' },
  { nos: '126 to 127', what: 'Stadium and Special Energy', rarity: 'Uncommon' },
  { nos: '128 to 135', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '136 to 152', what: 'Super Rare full arts of ex and Supporters', rarity: 'Super Rare' },
  { nos: '153 to 163', what: 'Special Art Rares of ex and Supporters', rarity: 'Special Art Rare' },
  { nos: '164 to 167', what: 'Gold Ultra Rares', rarity: 'Ultra Rare' },
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

const LADDER_NAMES = ['Miraidon ex', 'Koraidon ex', 'Tinkaton ex', 'Spidops ex', 'Great Tusk ex', 'Iron Treads ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'pack', label: 'What a pack holds' },
  { id: 'chase-cards', label: 'Lead chase cards: Miraidon ex and Koraidon ex' },
  { id: 'special-art-rares', label: 'All 11 Special Art Rares' },
  { id: 'super-rares', label: 'All 17 Super Rares' },
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
    q: 'What are the chase cards in Eternal Birth?',
    a: 'The lead chase cards are the Miraidon ex and Koraidon ex Special Art Rares, 154/127 and 157/127, and their gold Ultra Rares, 164/127 and 165/127. Ultra Rare is the top rarity, with four cards.',
  },
  {
    q: 'How often does a pack hold a Super Rare or better?',
    a: "About one slim pack in 27 holds one, or one jumbo pack in 5, going by Pokémon China's print shares. Super Rares, Special Art Rares and Ultra Rares make up 0.73% of slim-pack cards and 1.00% of jumbo-pack cards.",
  },
  {
    q: 'Which Pokémon ex have no secret rare?',
    a: 'Decidueye ex, Victini ex, Lucario ex and Cyclizar ex only appear as Double Rares.',
  },
  {
    q: 'How many cards are in an Eternal Birth master set?',
    a: 'A master set has 393 cards: the 167 numbered cards plus a Poké Ball and a Master Ball pattern holo of each of the 113 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blog/eternal-birth-set-guide')({
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
  component: EternalBirthSetGuide,
})

function EternalBirthSetGuide() {
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
        lede="Eternal Birth has 40 secret rares behind a 127-card main set, and its 5-card slim and 20-card jumbo packs have different pull odds. This guide shows every chase card and how often you can expect to pull one."
        cta={{
          heading: 'Collect Eternal Birth',
          body: 'Browse all 167 cards on the full card list.',
          links: [{ to: '/sets/chinese/eternal-birth-csv1', label: 'See the full card list' }],
        }}
      >
        <p>
          Eternal Birth (<Zh>亘古开来</Zh>, set code CSV1C) released on January 17, 2025. It is the Miraidon set that opened the Chinese
          Scarlet & Violet series. It has 167 cards, 14 of them Pokémon ex, and it comes in 5-card slim packs and 20-card jumbo packs.
        </p>
        <p>
          Our <Link to="/blog/eternal-birth-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/eternal-birth-card-origins">card origins guide</Link> matches every card to its English version. Use
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
        <p>Pokémon China publishes an odds chart for the slim pack and one for the jumbo pack. Applied to one pack of each, they work out to roughly:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">What a pack holds</caption>
            <thead>
              <tr>
                <th scope="col">Per pack</th>
                <th scope="col">Slim pack</th>
                <th scope="col">Jumbo pack</th>
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
          The top rarity group holds 32 different cards. It averages about one every 27 slim packs, or one every 5 jumbo packs. Card
          for card, the jumbo pack has more holos: 30% of its cards are holos, against 20% in the slim pack.
        </p>

        <h2 id="chase-cards">Lead chase cards: Miraidon ex and Koraidon ex</h2>
        <p>
          Miraidon ex and Koraidon ex are the only cards printed at four rarities. Their Special Art Rares are 154/127 and 157/127,
          and their gold Ultra Rares are 164/127 and 165/127.
        </p>
        <Gallery cards={byNos(['154', '157', '164', '165'])} cols={4} />

        <h2 id="special-art-rares">All 11 Special Art Rares</h2>
        <p>These are numbered 153 to 163. Six are Pokémon ex and five are Supporters.</p>
        <Gallery cards={lead(byRange(153, 163), ['154', '157', '155', '163'])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 17 Super Rares</h2>
        <p>These are full arts of ten Pokémon ex and seven Supporters, numbered 136 to 152. Professor's Research has two, one for each professor.</p>
        <Gallery cards={lead(byRange(136, 152), ['138', '142', '140', '152', '151', '150'])} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>These are the gold cards, numbered 164 to 167.</p>
        <Gallery cards={byRange(164, 167)} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>These are numbered 128 to 135.</p>
        <Gallery cards={byRange(128, 135)} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>These are the Pokémon ex with a Special Art Rare, and the number of each version:</p>
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
          Magnezone ex, Banette ex, Absol ex and Toxicroak ex also have Super Rares (137, 139, 143 and 144). Giovanni's Charisma,
          Jacq, Arven, Penny and Miriam each have an Uncommon, a Super Rare and a Special Art Rare. Super Rod and Switch each have
          an Uncommon and a gold Ultra Rare.
        </p>

        <h2 id="double-rares">All 14 Pokémon ex</h2>
        <p>These are the Double Rares from the main set. Miraidon ex is 050/127 and Koraidon ex is 084/127.</p>
        <Gallery cards={lead(setData.cards.filter((c) => c.rarity === 'Double Rare (RR)'), ['050', '084', '068', '086', '075', '023', '008'])} cols={4} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 127. The main set runs 001 to 127, and everything above is a secret rare. The rarer versions
          of a card sit among the secret rares at unrelated numbers, so match them by name.
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
          The numbered set is 167 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 113 Commons, Uncommons
          and Rares, for 393 in total.
        </p>
        <p>
          With one holo per slim pack and six per jumbo pack, the Master Ball holos and the 32 cards in the top rarity group take a long time to
          pull. The <Link to="/sets/chinese/eternal-birth-csv1">Eternal Birth card list</Link> shows every card.
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
