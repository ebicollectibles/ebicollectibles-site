import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/white-flare.json'

const post = BLOG_POSTS.find((p) => p.slug === 'white-flare-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const pick = (nos: number[]) => nos.map((n) => setData.cards.find((c) => c.pokemonIndex === n)!)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.number}>
          <img src={c.image} alt={`${c.name} ${c.number} ${short(c.rarity)}, White Flare`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.number} · {short(c.rarity)}
            {EXCLUSIVE.has(c.number) ? ' · Chinese exclusive' : ''}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// Averages from Pokémon China's two odds charts (5-card and 20-card packs).
// Each share is of all cards printed for that pack size, applied to the
// cards in one box: slim 15 x 5 = 75 cards, jumbo 6 x 20 = 120 cards.
const BOXES = [
  { row: 'Packs per box', slim: '15', jumbo: '6' },
  { row: 'Cards per pack', slim: '5 (1 holo)', jumbo: '20 (7 holo)' },
  { row: 'Cards per box', slim: '75', jumbo: '120' },
  { row: 'Holos per box', slim: '15', jumbo: '42' },
  { row: 'Common and Uncommon (80.00% / 65.00%)', slim: '60', jumbo: '78' },
  { row: 'Poké Ball pattern holo and Rare (13.23% / 26.45%)', slim: 'about 10', jumbo: 'about 32' },
  { row: 'Double Rare, Art Rare and Master Ball pattern (6.04% / 7.55%)', slim: 'about 4.5', jumbo: 'about 9' },
  { row: 'Super Rare, Special Art Rare and Black White Rare (0.73% / 1.00%)', slim: 'about 0.55', jumbo: 'about 1.2' },
  { row: 'One top-band card every', slim: 'about 27 packs', jumbo: 'about 5 packs' },
]

// The six Pokémon ex and the two Supporters with secret rares, and every number they print at.
const LADDER_NAMES = ['Reshiram ex', 'Hydreigon ex', 'Keldeo ex', 'Whimsicott ex', 'Jellicent ex', 'Bouffalant ex', 'Hilda', 'Harlequin']
const TIERS = ['main', 'Super Rare (SR)', 'Special Art Rare (SAR)', 'Black White Rare (BWR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map(
    (t) =>
      setData.cards.find((c) => c.name === name && (t === 'main' ? c.pokemonIndex <= 86 : c.rarity === t))?.number.slice(0, 3) ?? '–',
  ),
}))

const BLOCKS = [
  { nos: '001 to 078', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '079 to 085', what: 'Items, a Pokémon Tool and Supporters', rarity: 'U (Antique Plume Fossil is C)' },
  { nos: '086', what: 'Ignition Energy', rarity: 'U' },
  { nos: '087 to 158', what: 'Art Rares of all 72 non-ex Pokémon, in main-set order', rarity: 'AR' },
  { nos: '159 to 166', what: 'Super Rare full arts of the 6 ex, Harlequin and Hilda', rarity: 'SR' },
  { nos: '167 to 173', what: 'Special Art Rares of the 6 ex and Hilda', rarity: 'SAR' },
  { nos: '174', what: 'Reshiram ex', rarity: 'BWR' },
]

const TOC = [
  { id: 'slim-vs-jumbo', label: 'Slim box or jumbo box' },
  { id: 'top-chases', label: 'The Black White Rare and 7 SARs' },
  { id: 'super-rares', label: 'All 8 Super Rares' },
  { id: 'art-rares', label: 'Art Rares to look for' },
  { id: 'ladders', label: 'One card, every rarity' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Should I buy the slim or the jumbo White Flare box?',
    a: 'For chase cards, jumbo. A jumbo box averages about 1.2 Super Rares, Special Art Rares or Black White Rares against about 0.55 for a slim box, and its odds are better per card too: 1.00% of jumbo cards against 0.73% of slim cards. The slim box gives you more packs to open: 15 against 6.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both odds charts list the same 174 cards and the same 80 Poké Ball and 80 Master Ball pattern holos. Only the cards per pack and the odds change.',
  },
  {
    q: 'What is the Chinese exclusive in White Flare?',
    a: 'Hilda 173/086, a Special Art Rare by Ligton. English White Flare has a different Hilda Special Illustration Rare, and that one is not in the Chinese set.',
  },
  {
    q: 'How rare is the Reshiram ex Black White Rare?',
    a: 'Pokémon China groups it with the 8 Super Rares and 7 Special Art Rares, and that band turns up about once every 27 slim packs or every 5 jumbo packs. The chart does not give odds for the Black White Rare on its own.',
  },
  {
    q: 'How many cards are in a White Flare master set?',
    a: '334: the 174 numbered cards plus a Poké Ball pattern and a Master Ball pattern holo of each of the 80 Common, Uncommon and Rare cards.',
  },
]

export const Route = createFileRoute('/blog/white-flare-set-guide')({
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
  component: WhiteFlareSetGuide,
})

function WhiteFlareSetGuide() {
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
        lede="Slim box or jumbo box, every chase card from the Reshiram ex Black White Rare down, each ex at every rarity, and what a White Flare master set takes."
        cta={{
          heading: 'Collect White Flare',
          body: 'Track every card on the full checklist, or pick up a box and start ripping.',
          links: [
            { to: '/sets/chinese/white-flare-csv10-6', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-white-flare-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          White Flare (CSV10.6C) is the Reshiram half of the Unova pair: 174 cards, a Chinese-exclusive Hilda Special Art Rare, and slim
          and jumbo boxes with their own odds. Our <Link to="/blog/white-flare-card-origins">card origins guide</Link> matches every card to English. Use this
          one to pick a box, sort your pulls or plan a master set.
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

        <h2 id="slim-vs-jumbo">Slim box or jumbo box</h2>
        <p>
          Both boxes pull from the same card list, but Pokémon China published a separate odds chart for the 5-card and the 20-card pack.
          Applied to one box, the shares work out to roughly this (slim share / jumbo share in brackets):
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
          The jumbo box has 1.6 times the cards of a slim box but more than twice the top-band pulls, because each jumbo card is more
          likely to be one: 1.00% against 0.73%. A slim box averages about half a Super Rare or better, so many slim boxes will not have
          one. A jumbo pack also carries 7 holos to the slim pack's 1, which is why the jumbo box ends up with 42 holos to 15.
        </p>

        <h2 id="top-chases">The Black White Rare and 7 Special Art Rares</h2>
        <p>
          Reshiram ex 174/086 is the set's only Black White Rare, a monochrome full art and the top tier. Below it sit seven Special Art
          Rares: the six Pokémon ex and Hilda 173/086, the Chinese exclusive.
        </p>
        <Gallery cards={pick([174, 173, 168, 171, 169, 167, 170, 172])} cols={4} />

        <BuyStrip />

        <h2 id="super-rares">All 8 Super Rares</h2>
        <p>Full arts of the six Pokémon ex and the Supporters Harlequin and Hilda, 159 to 166.</p>
        <Gallery cards={pick([160, 166, 163, 161, 159, 162, 164, 165])} cols={4} />

        <h2 id="art-rares">Art Rares to look for</h2>
        <p>
          Every non-ex Pokémon in the set gets an Art Rare, 72 in all, numbered 087 to 158 in the same order as the main set. A few that
          stand out:
        </p>
        <Gallery cards={pick([141, 140, 102, 96, 104, 98, 113, 153])} cols={4} />
        <p>
          The other 64 are on the <Link to="/sets/chinese/white-flare-csv10-6">White Flare card list</Link>.
        </p>

        <h2 id="ladders">One card, every rarity</h2>
        <p>
          The ex Pokémon skip the Art Rare tier and get a Super Rare and a Special Art Rare instead. These are the numbers each one prints at,
          plus the two Supporters with secret rares:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">Main set</th>
                <th scope="col">SR</th>
                <th scope="col">SAR</th>
                <th scope="col">BWR</th>
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
        <p className="table-note">Main-set ex cards are Double Rare. Hilda and Harlequin are Uncommon in the main set.</p>

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 086. The main set runs 001 to 086, and everything above is a secret rare. An Art Rare does not
          share a fixed offset with its main-set card, because the ex are skipped: Sewaddle 001 is Art Rare 087, but Tornadus 078 is Art Rare
          158. Match them by name.
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
          The numbered set is 174 cards. A full master set adds a Poké Ball pattern holo and a Master Ball pattern holo of each of the 80
          Common, Uncommon and Rare cards, for 334 in total.
        </p>
        <p>
          The Poké Ball holos come fastest, since they share the most common holo band. The Master Ball holos share a band with the 6 Double
          Rares and 72 Art Rares, about 4.5 per slim box or 9 per jumbo box spread across 158 different cards, so they take a long time. The
          16 top-band cards are harder still. The practical route is to open boxes for the lower tiers, then pick up the big cards as singles.
          The <Link to="/sets/chinese/white-flare-csv10-6">White Flare card list</Link> lets you tick off what you have. Its twin,{' '}
          <Link to="/blog/black-bolt-set-guide">Black Bolt</Link>, is a separate 174-card set with its own Pokémon.
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
