import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'eternal-birth-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Eternal%20Birth%20CSV1/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/127, Eternal Birth`} loading="lazy" width={300} height={418} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/127 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// The lead chase cards: the two cover legendaries as Special Art Rares and
// as gold Ultra Rares.
const LEAD = [
  { n: '154', name: 'Miraidon ex', note: 'SAR · kantaro' },
  { n: '157', name: 'Koraidon ex', note: 'SAR · Ryota Murayama' },
  { n: '164', name: 'Miraidon ex', note: 'Ultra Rare' },
  { n: '165', name: 'Koraidon ex', note: 'Ultra Rare' },
]

const POKEMON_EX = [
  { n: '050', name: 'Miraidon ex', note: 'Double Rare' },
  { n: '084', name: 'Koraidon ex', note: 'Double Rare' },
  { n: '068', name: 'Tinkaton ex', note: 'Double Rare' },
  { n: '086', name: 'Absol ex', note: 'Double Rare' },
]

const SAR_POKEMON = [
  { n: '155', name: 'Tinkaton ex', note: 'SAR · Tika Matsuno' },
  { n: '153', name: 'Spidops ex', note: 'SAR · Miki Tanaka' },
  { n: '156', name: 'Great Tusk ex', note: 'SAR · Pani Kobayashi' },
  { n: '158', name: 'Iron Treads ex', note: 'SAR · KEIICHIRO ITO' },
]

const SAR_SUPPORTERS = [
  { n: '163', name: 'Miriam', note: 'SAR · Akira Komayama' },
  { n: '162', name: 'Penny', note: 'SAR · OKACHEKE' },
  { n: '161', name: 'Arven', note: 'SAR · kantaro' },
  { n: '160', name: 'Jacq', note: 'SAR · Oswaldo KATO' },
  { n: '159', name: "Giovanni's Charisma", note: 'SAR · Hideki Ishikawa' },
]

const ULTRA_RARES = [
  { n: '164', name: 'Miraidon ex', note: 'Ultra Rare' },
  { n: '165', name: 'Koraidon ex', note: 'Ultra Rare' },
  { n: '166', name: 'Super Rod', note: 'Ultra Rare' },
  { n: '167', name: 'Switch', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '128', name: 'Tarountula', note: 'Art Rare · Miki Tanaka' },
  { n: '129', name: 'Dolliv', note: 'Art Rare · Oswaldo KATO' },
  { n: '130', name: 'Wiglett', note: 'Art Rare · You Iribi' },
  { n: '131', name: 'Wugtrio', note: 'Art Rare · Tetsu Kayama' },
  { n: '132', name: 'Dondozo', note: 'Art Rare · AKIRA EGAWA' },
  { n: '133', name: 'Tinkatink', note: 'Art Rare · Tika Matsuno' },
  { n: '134', name: 'Tinkatuff', note: 'Art Rare · Tika Matsuno' },
  { n: '135', name: 'Grafaiai', note: 'Art Rare · Oswaldo KATO' },
]

// Pokémon China's two odds charts, for the 5-card and the 20-card pack, in the
// bands they use. The per-pack average is the print share times the pack size.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', s5: '80.00%', p5: '4', s20: '70.00%', p20: '14' },
  { band: 'Poké Ball pattern holo and Rare', s5: '14.53%', p5: 'about 0.73', s20: '22.99%', p20: 'about 4.6' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', s5: '4.74%', p5: 'about 0.24', s20: '6.01%', p20: 'about 1.2' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', s5: '0.73%', p5: 'about 0.04', s20: '1.00%', p20: 'about 0.2' },
]

const TOC = [
  { id: 'chase-cards', label: 'Lead chase cards: Miraidon ex and Koraidon ex' },
  { id: 'pokemon-ex', label: 'Pokémon ex arrive' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'packs-and-odds', label: 'Packs and pull odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Eternal Birth released?',
    a: 'January 17, 2025, in mainland China. It is a Simplified Chinese release and the first set of the Chinese Scarlet & Violet series.',
  },
  {
    q: 'What is in an Eternal Birth pack?',
    a: 'The 5-card pack has 4 non-holo cards and 1 holo. The 20-card pack has 14 non-holo cards and 6 holos.',
  },
  {
    q: 'What are the odds of pulling a Super Rare or better?',
    a: "Super Rares, Special Art Rares and Ultra Rares make up 0.73% of the 5-card print run, going by Pokémon China's print shares. That averages about one in every 27 packs. In the 20-card pack they make up 1.00%, about one in every five packs.",
  },
  {
    q: 'How many cards are in Eternal Birth?',
    a: '167 numbered cards: 127 in the main set and 40 secret rares. With the Poké Ball and Master Ball pattern holos of every Common, Uncommon and Rare, there are 393 different cards.',
  },
  {
    q: 'Where do the Eternal Birth illustrations come from?',
    a: 'Mostly from the first English Scarlet & Violet set, which matches 134 of the 167 cards. Paldea Evolved (16), Obsidian Flames (7), 151 (5) and three other English sources supply the rest.',
    link: { to: '/sets/chinese/eternal-birth-csv1', before: 'See every card on the ', label: 'Eternal Birth card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/eternal-birth-release-news')({
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
  component: EternalBirthReleasePost,
})

function EternalBirthReleasePost() {
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
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.link ? `${f.a} ${f.link.before}${f.link.label}${f.link.after}` : f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Eternal Birth is the set that moved the Simplified Chinese game from Sword & Shield to Scarlet & Violet, with Miraidon on the pack. It comes in a 5-card and a 20-card pack, and Miraidon ex and Koraidon ex are the cards collectors look for first."
        cta={{
          heading: 'Collect Eternal Birth',
          body: 'Browse all 167 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/eternal-birth-csv1', label: 'See the full card list' }],
        }}
      >
        <p>
          Eternal Birth (亘古开来) released on January 17, 2025. It is the first main set of the Chinese Scarlet & Violet series, and
          it introduces Pokémon ex to Simplified Chinese. It also includes the Paldea starters Sprigatito, Fuecoco and Quaxly. Miraidon is
          on the pack, and Miraidon ex and Koraidon ex are the lead chase cards.
        </p>

        <aside className="fact-box" aria-label="Eternal Birth key facts">
          <img src={cardImg('154')} alt="Miraidon ex 154/127 Special Art Rare, Eternal Birth" loading="lazy" width={300} height={418} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Eternal Birth (亘古开来)</dd>
              <dt>Set code</dt>
              <dd>CSV1C</dd>
              <dt>Released</dt>
              <dd>January 17, 2025</dd>
              <dt>5-card pack</dt>
              <dd>4 non-holo cards, 1 holo</dd>
              <dt>20-card pack</dt>
              <dd>14 non-holo cards, 6 holo</dd>
              <dt>Set size</dt>
              <dd>167 cards: 127 in the main set, 40 secret rares</dd>
              <dt>On the pack</dt>
              <dd>Miraidon</dd>
            </dl>
          </div>
        </aside>

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

        <h2 id="chase-cards">Lead chase cards: Miraidon ex and Koraidon ex</h2>
        <p>
          The two legendary Pokémon of Paldea each appear four times: as a Double Rare, a Super Rare, a Special Art Rare and a gold
          Ultra Rare. The Miraidon ex Special Art Rare, 154/127, shows Miraidon in front of a neon-lit city at night. The
          Koraidon ex Special Art Rare, 157/127, sets Koraidon in a dense green jungle. The gold Ultra Rares are 164 and 165.
        </p>
        <Grid cards={LEAD} cols={4} />

        <h2 id="pokemon-ex">Pokémon ex arrive</h2>
        <p>
          Pokémon ex are new to the Simplified Chinese game with the Scarlet & Violet series. They have high HP and strong attacks, and your opponent takes two Prize cards when one
          is Knocked Out. Eternal Birth has 14 of them. Miraidon ex has 220 HP, and its Tandem Unit Ability puts up to 2 Basic
          Lightning Pokémon from your deck onto your Bench. Koraidon ex has 230 HP, and its Dino Cry Ability attaches up to 2 Basic
          Fighting Energy cards from your discard pile to your Basic Fighting Pokémon, then ends your turn. Both attack for 220.
        </p>
        <p>
          Tinkaton ex is a Stage 2 with 300 HP, and its Big Hammer attack does 30 damage for each card in your hand. Absol ex does
          100 damage with Cursed Slug, and 120 more if your opponent has 3 or fewer cards in their hand.
        </p>
        <Grid cards={POKEMON_EX} cols={4} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Eleven Special Art Rares, 153 to 163: six Pokémon ex and five Supporters. Besides Miraidon ex and Koraidon ex, Tinkaton ex
          sits with its giant hammer over its shoulder, Spidops ex hangs from its threads beside a tree, Great Tusk ex crosses a
          desert under a swirling red sky, and Iron Treads ex is set against a starry night sky.
        </p>
        <Grid cards={SAR_POKEMON} cols={4} />
        <p>
          The five Supporters each get a scene of their own. Miriam runs past a stream of flying books, Penny sits at a classroom
          desk in warm sunlight, Arven makes sandwiches at an outdoor table, Jacq has fallen asleep at a desk piled with books, and
          Giovanni sits on a sofa with a Persian beside him.
        </p>
        <Grid cards={SAR_SUPPORTERS} cols={3} />

        <BuyStrip />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>Four gold cards top the set, 164 to 167: Miraidon ex, Koraidon ex, Super Rod and Switch.</p>
        <Grid cards={ULTRA_RARES} cols={4} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Eight Art Rares, 128 to 135, give main-set Pokémon a full illustration. Tika Matsuno drew Tinkatink and Tinkatuff as well
          as the Tinkaton ex Special Art Rare, and Oswaldo KATO drew Dolliv and Grafaiai.
        </p>
        <Grid cards={ART_RARES} cols={4} />

        <h2 id="packs-and-odds">Packs and pull odds</h2>
        <p>
          Eternal Birth came in a 5-card pack with one holo and a 20-card pack with six holos. Pokémon China publishes an odds chart
          for each one. The charts give each rarity group's share of the print run, and multiplying a share by the pack size gives
          the average number of those cards per pack:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">5-card pack: share of print</th>
                <th scope="col">Per 5-card pack</th>
                <th scope="col">20-card pack: share of print</th>
                <th scope="col">Per 20-card pack</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.s5}</td>
                  <td>{o.p5}</td>
                  <td>{o.s20}</td>
                  <td>{o.p20}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the two official charts. Individual packs vary.</p>
        <p>
          In the top group that works out to about one Super Rare, Special Art Rare or Ultra Rare in every 27 of the 5-card packs, or
          one in every five of the 20-card packs. Each pack also holds one extra slip for the game Pokémon UNITE.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings the full set to
          393 cards. Our <Link to="/blog/eternal-birth-set-guide">set guide</Link> has every chase card, and our{' '}
          <Link to="/blog/eternal-birth-card-origins">card origins guide</Link> matches every card to its English version.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {f.a}
                {f.link && (
                  <>
                    {' '}
                    {f.link.before}
                    <Link to={f.link.to as never}>{f.link.label}</Link>
                    {f.link.after}
                  </>
                )}
              </p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Eternal Birth is the starting point of the Chinese Scarlet & Violet series: Pokémon ex, the Paldea starters and
          both of Paldea's legendary Pokémon in one set. The Miraidon ex and Koraidon ex Special Art Rares are its lead chase cards.
        </p>
      </BlogPostLayout>
    </>
  )
}
