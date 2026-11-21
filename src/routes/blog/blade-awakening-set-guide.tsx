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
import setData from '~/data/csv7.json'

const post = BLOG_POSTS.find((p) => p.slug === 'blade-awakening-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
// Most wanted cards first (by number out of 204), then the rest of the range in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/204`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Blade Awakening`} loading="lazy" width={300} height={419} />
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

// The eight Paradox Pokémon ex with Super Rares; the other nine are listed after.
const PARADOX = new Set([
  'Iron Leaves ex',
  'Gouging Fire ex',
  'Walking Wake ex',
  'Iron Thorns ex',
  'Scream Tail ex',
  'Iron Crown ex',
  'Iron Boulder ex',
  'Raging Bolt ex',
])
const SR_EX = byRange(211, 227)
const ACE_CARDS = setData.cards.filter((c) => c.rarity === 'ACE SPEC Rare (ACE)')

// Averages from Pokémon China's two odds charts. Each share is of all
// cards printed for that pack size, applied to the cards in one box.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (6 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '36' },
  { row: 'Common and Uncommon', slim: '60', jumbo: '84' },
  { row: 'Poké Ball pattern holo and Rare', slim: 'about 10', jumbo: 'about 26 to 27' },
  { row: 'Double Rare, Art Rare, ACE SPEC Rare and Master Ball pattern', slim: 'about 4', jumbo: 'about 8' },
  { row: 'Super Rare, Special Art Rare and Ultra Rare', slim: 'about 0.55', jumbo: 'about 1.2' },
]

const BLOCKS = [
  { nos: '001 to 173', what: 'Pokémon, grouped by type', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '174 to 183', what: 'Items', rarity: 'Uncommon, plus 5 ACE SPEC' },
  { nos: '184 to 190', what: 'Pokémon Tools', rarity: 'Uncommon, plus 3 ACE SPEC' },
  { nos: '191 to 199', what: 'Supporters', rarity: 'Uncommon' },
  { nos: '200 to 202', what: 'Stadiums', rarity: 'Uncommon' },
  { nos: '203 to 204', what: 'Special Energy', rarity: 'ACE SPEC (Neo Upper Energy), Uncommon (Mist Energy)' },
  { nos: '205 to 210', what: 'Art Rares', rarity: 'Art Rare' },
  { nos: '211 to 236', what: 'Super Rare full arts of 17 ex and 9 Supporters', rarity: 'Super Rare' },
  { nos: '237 to 250', what: 'Special Art Rares of 8 ex and 6 Supporters', rarity: 'Special Art Rare' },
  { nos: '251 to 259', what: 'Gold Ultra Rares of 6 ex and 3 Trainers', rarity: 'Ultra Rare' },
]

const LADDER_NAMES = [
  'Greninja ex',
  'Raging Bolt ex',
  'Walking Wake ex',
  'Gouging Fire ex',
  'Iron Crown ex',
  'Iron Leaves ex',
  'Iron Boulder ex',
  'Dachsbun ex',
]
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim box vs jumbo box' },
  { id: 'special-art-rares', label: 'All 14 Special Art Rares' },
  { id: 'super-rares', label: 'All 26 Super Rares' },
  { id: 'ultra-rares', label: 'All 9 Ultra Rares' },
  { id: 'art-rares', label: 'All 6 Art Rares' },
  { id: 'ace-spec', label: 'All 9 ACE SPEC cards' },
  { id: 'ladders', label: 'One Pokémon, several rarities' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Should I buy the slim or the jumbo Blade Awakening box?',
    a: 'For the rarest cards, jumbo. A jumbo box averages about 1.2 Super Rares, Special Art Rares or Ultra Rares against about 0.55 for a slim box, and its odds are better per card too. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both pull from the same 259-card list and the same Poké Ball and Master Ball holos. Only the number of cards per pack and the odds change.',
  },
  {
    q: 'What is the Chinese Exclusive in Blade Awakening?',
    a: "Ciphermaniac's Codebreaking 245/204, a Special Art Rare. Ciphermaniac's Codebreaking is in English as a Supporter and a full art, but not with this illustration.",
  },
  {
    q: 'Which Pokémon ex have a gold Ultra Rare?',
    a: 'Six Paradox Pokémon: Iron Leaves ex, Gouging Fire ex, Walking Wake ex, Iron Crown ex, Iron Boulder ex and Raging Bolt ex. Greninja ex stops at Special Art Rare.',
  },
  {
    q: 'Where are the ACE SPEC cards numbered?',
    a: 'In the main set, among the Trainers and Energy: 176, 178, 180, 181, 183, 186, 187, 189 and 203. They are not secret rares.',
  },
  {
    q: 'How many cards are in a Blade Awakening master set?',
    a: "605: the 259 numbered cards plus a Poké Ball pattern and a Master Ball pattern holo of each of the 173 Common, Uncommon and Rare cards. That matches the 605 kinds on Pokémon China's odds chart.",
  },
]

export const Route = createFileRoute('/blog/blade-awakening-set-guide')({
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
  component: BladeAwakeningSetGuide,
})

function BladeAwakeningSetGuide() {
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
        lede="Blade Awakening is the Tera Greninja ex set, with nine ACE SPEC cards and slim and jumbo boxes that have different odds. This guide helps you pick a box, shows the most wanted cards, and explains what a 605-card master set takes."
        cta={{
          heading: 'Collect Blade Awakening',
          body: 'See every card on the full card list, or pick up a box.',
          links: [
            { to: '/sets/chinese/blade-awakening-csv7', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-blade-awakening-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Blade Awakening (<Zh>利刃猛醒</Zh>, set code CSV7C) released on January 16, 2026. It is the Tera Greninja ex set: 259 cards
          with nine ACE SPEC cards and one Chinese Exclusive, the Ciphermaniac's Codebreaking Special Art Rare 245/204. It is sold in
          slim and jumbo boxes, and each has its own odds.
        </p>
        <p>
          Our <Link to="/blog/blade-awakening-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/blade-awakening-card-origins">card origins guide</Link> matches every card to its English version. Use
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

        <h2 id="slim-vs-jumbo">Slim box vs jumbo box</h2>
        <p>Pokémon China published an odds chart for each pack size. Applied to one box of each, they come out like this:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Slim box vs jumbo box</caption>
            <thead>
              <tr>
                <th scope="col">Per box</th>
                <th scope="col">Slim</th>
                <th scope="col">Jumbo</th>
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
          The top group is 0.73% of slim cards and 1.00% of jumbo cards. That is about one Super Rare, Special Art Rare or Ultra Rare
          every 27 slim packs, against one every 5 jumbo packs. A slim box averages about half of one, and a jumbo box averages more
          than one. If you want those cards, jumbo is the stronger box.
        </p>

        <h2 id="special-art-rares">All 14 Special Art Rares</h2>
        <p>Eight are Pokémon ex, numbered 237 to 244. Greninja ex 242/204 is the one most collectors want.</p>
        <Gallery cards={lead(byRange(237, 244), ['242', '244', '239', '238'])} cols={4} />
        <p>The other six are Supporters, numbered 245 to 250. Ciphermaniac's Codebreaking 245/204 is the Chinese Exclusive.</p>
        <Gallery cards={byRange(245, 250)} cols={3} />

        <BuyStrip />

        <h2 id="super-rares">All 26 Super Rares</h2>
        <p>These are full arts of 17 Pokémon ex and 9 Supporters. The eight Paradox Pokémon ex come first.</p>
        <Gallery cards={SR_EX.filter((c) => PARADOX.has(c.name))} cols={4} />
        <p>These are the other nine Pokémon ex.</p>
        <Gallery cards={SR_EX.filter((c) => !PARADOX.has(c.name))} cols={3} />
        <p>The nine Supporters are numbered 228 to 236.</p>
        <Gallery cards={byRange(228, 236)} cols={3} />

        <h2 id="ultra-rares">All 9 Ultra Rares</h2>
        <p>These are the gold cards, numbered 251 to 259: six Paradox Pokémon ex, then Earthen Vessel, Buddy-Buddy Poffin and Rescue Board.</p>
        <Gallery cards={byRange(251, 259)} cols={3} />

        <h2 id="art-rares">All 6 Art Rares</h2>
        <p>These are numbered 205 to 210. Each is a full illustration of a main-set Pokémon.</p>
        <Gallery cards={byRange(205, 210)} cols={3} />

        <h2 id="ace-spec">All 9 ACE SPEC cards</h2>
        <p>
          ACE SPEC Rare is its own rarity. The cards are printed in the main set among the Trainers and Energy, and they share a
          rarity group with the Double Rares. You can play only one ACE SPEC card per deck.
        </p>
        <Gallery cards={ACE_CARDS} cols={3} />

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
          Torterra ex, Magcargo ex, Incineroar ex, Luxray ex, Wugtrio ex, Iron Thorns ex, Scream Tail ex, Farigiraf ex and Scizor ex also
          have Super Rares. Blaziken ex, Kyogre ex, Tapu Koko ex, Tyranitar ex and Lugia ex come only as Double Rares.
        </p>

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 204. The main set runs 001 to 204, ACE SPEC cards included, and everything above is a secret
          rare. The rarer versions of a card sit in the secret block at unrelated numbers, so match them by name.
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
        <p className="table-note">
          The main set is 90 Commons, 63 Uncommons, 20 Rares, 22 Double Rares and 9 ACE SPEC Rares, the same counts as Pokémon China's
          chart.
        </p>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 259 cards. A true master set adds the Poké Ball and Master Ball pattern holos of all 173 Commons, Uncommons
          and Rares, for 605 in total, the same figure Pokémon China's chart gives.
        </p>
        <p>
          The 173 Master Ball holos and the 49 Super Rares, Special Art Rares and Ultra Rares take the longest. Many collectors open
          boxes for fun and the lower rarities, then buy the rarest cards as singles. The <Link to="/sets/chinese/blade-awakening-csv7">Blade Awakening card list</Link> shows every card.
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
