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
import setData from '~/data/csv5.json'

const post = BLOG_POSTS.find((p) => p.slug === 'black-crystal-blaze-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// The data marks both Chinese Exclusives, the Larry Special Art Rare 157 and the gold Defiance Band 164.
const isExclusive = (c: Card) => EXCLUSIVE.has(c.number) || c.number === '164/129'
// Most wanted cards first (by number out of 129), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/129`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Black Crystal Blaze`} loading="lazy" width={300} height={419} />
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
  { nos: '001 to 113', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '114 to 129', what: 'Trainers and Energy', rarity: 'Uncommon (Larry is Common)' },
  { nos: '130 to 137', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '138 to 152', what: 'Super Rare full arts of ex and Supporters', rarity: 'Super Rare' },
  { nos: '153 to 160', what: 'Special Art Rares of ex and Supporters', rarity: 'Special Art Rare' },
  { nos: '161 to 164', what: 'Gold Ultra Rares', rarity: 'Ultra Rare' },
]

// Averages from Pokémon China's two odds charts. Each share is of all
// cards printed for that pack size, applied to the cards in one box.
// Slim: 80.00%, 14.53%, 4.74%, 0.73%. Jumbo: 70.00%, 22.99%, 6.01%, 1.00%.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Common and Uncommon', slim: '60', jumbo: '84' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 11', jumbo: 'about 28' },
  { row: 'Double Rare, Art Rare and Master Ball pattern holo', slim: 'about 3 to 4', jumbo: 'about 7' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

const LADDER_NAMES = ['Charizard ex', 'Garchomp ex', 'Eiscue ex', 'Altaria ex']
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'box', label: 'Slim box vs jumbo box' },
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
    q: 'What are the Chinese Exclusives in Black Crystal Blaze?',
    a: 'The Larry Special Art Rare 157/129 and the gold Defiance Band Ultra Rare 164/129.',
  },
  {
    q: 'How many Super Rares or better are in a box?',
    a: 'A slim box averages about 0.55, so most slim boxes do not have one. A jumbo box averages about 1.2, so most jumbo boxes do.',
  },
  {
    q: 'Should I buy a slim or a jumbo box?',
    a: 'For Super Rares and above, the jumbo box. It averages about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 for a slim box, and it has 36 holos against 15. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'How many cards are in a Black Crystal Blaze master set?',
    a: 'A master set is 394 cards: the 164 numbered cards plus a Poké Ball pattern holo and a Master Ball pattern holo of each of the 115 Commons, Uncommons and Rares.',
  },
]

export const Route = createFileRoute('/blog/black-crystal-blaze-set-guide')({
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
  component: BlackCrystalBlazeSetGuide,
})

function BlackCrystalBlazeSetGuide() {
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
        lede="Black Crystal Blaze is the Tera Charizard set, with two Chinese Exclusives and slim and jumbo boxes. This guide helps you pick a box, shows every chase card, and explains what a master set takes."
        cta={{
          heading: 'Collect Black Crystal Blaze',
          body: 'Track every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/black-crystal-blaze-csv5', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Black Crystal Blaze (<Zh>黑晶炽诚</Zh>, set code CSV5C) released on September 12, 2025. It is the Tera Charizard set: 164
          cards sold in slim and jumbo boxes, with two Chinese Exclusives, the Larry Special Art Rare 157/129 and the gold Defiance Band
          Ultra Rare 164/129.
        </p>
        <p>
          Our <Link to="/blog/black-crystal-blaze-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/black-crystal-blaze-card-origins">card origins guide</Link> matches every card to its English version. Use
          this guide to pick a box, sort your pulls or plan a master set.
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

        <h2 id="box">Slim box vs jumbo box</h2>
        <p>
          Both boxes pull from the same card list, but Pokémon China publishes a different odds chart for each pack size. Applied to
          one box, the published shares work out to roughly this:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim box vs jumbo box</caption>
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
          The top rarity group holds 27 different cards: the Super Rares, Special Art Rares and Ultra Rares. They are 0.73% of slim
          cards, about one every 27 packs, so most slim boxes will not have one. They are 1.00% of jumbo cards, about one every 5
          packs, so most jumbo boxes will have one.
        </p>

        <h2 id="special-art-rares">All 8 Special Art Rares</h2>
        <p>These are numbered 153 to 160: four Pokémon ex and four Supporters. Larry 157/129 is a Chinese Exclusive.</p>
        <Gallery cards={lead(byRange(153, 160), ['155', '157', '159', '160', '154', '156', '158'])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 15 Super Rares</h2>
        <p>These are full arts of ten Pokémon ex and five Supporters, numbered 138 to 152.</p>
        <Gallery cards={lead(byRange(138, 152), ['145', '151', '152', '148', '149', '140'])} cols={3} />

        <h2 id="ultra-rares">All 4 Ultra Rares</h2>
        <p>These are the gold cards, numbered 161 to 164. Defiance Band 164/129 is the second Chinese Exclusive.</p>
        <Gallery cards={lead(byRange(161, 164), ['162', '161', '164'])} cols={4} />

        <h2 id="art-rares">All 8 Art Rares</h2>
        <p>These are numbered 130 to 137. Each one is a full illustration of a main-set Pokémon.</p>
        <Gallery cards={lead(byRange(130, 137), ['135', '136', '132', '133', '134', '137'])} cols={4} />

        <h2 id="ladders">One Pokémon, several rarities</h2>
        <p>Four Pokémon ex have a Special Art Rare. These are the numbers each one prints at:</p>
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
        <p className="table-note">Armarouge ex, Vespiquen ex, Hoopa ex, Toxtricity ex, Glimmora ex and Aegislash ex also have Super Rares (139, 141 to 144 and 146).</p>

        <h2 id="double-rares">All 14 Pokémon ex</h2>
        <p>These are the Double Rares from the main set.</p>
        <Gallery cards={lead(setData.cards.filter((c) => c.rarity === 'Double Rare (RR)'), ['075', '039', '028', '104', '069', '101'])} cols={4} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 129. The main set runs 001 to 129, from Common to Double Rare, and everything above 129 is a secret rare. The rarer versions
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
          The numbered set is 164 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 115 Commons, Uncommons
          and Rares, for 394 in total.
        </p>
        <p>
          The Master Ball holos share a rarity group with the Double Rares and Art Rares, about 3 to 4 cards per slim box or 7 per
          jumbo box spread across 137 different cards, so they take a long time. The 27 cards in the top group are harder still. Most
          collectors open boxes for fun and the lower rarities, then buy the cards they still need as singles. The <Link to="/sets/chinese/black-crystal-blaze-csv5">Black Crystal Blaze card list</Link> lets you tick off
          what you have.
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
