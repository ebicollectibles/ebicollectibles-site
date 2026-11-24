import { createFileRoute, Link } from '@tanstack/react-router'
import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-pokemon-slim-vs-jumbo')!

// ---------------------------------------------------------------------------
// Pack facts are from Pokémon China's product page for each set (its
// "5张装" and "20张装" lines and its two odds charts), as already used in
// each set's release post. Box sizes are not on those pages: 15 slim packs
// and 6 jumbo packs are the boxes we sell. Every average below is worked out
// here from the shares, so the maths is shown, not typed.
// ---------------------------------------------------------------------------

const SLIM = { cards: 5, perBox: 15 }
const JUMBO = { cards: 20, perBox: 6 }

const setBy = (code: string) => GEM_SETS.find((s) => s.code === code)!

// Each odds chart, in the four groups Pokémon China prints. Shares are of
// all cards printed for that pack size.
const CHARTS = [
  {
    key: 'sv1',
    codes: ['CSV1C', 'CSV2C', 'CSV3C', 'CSV4C', 'CSV5C'],
    jumboHolos: 6,
    group2: 'Double Rare, Art Rare and Master Ball pattern holo',
    slim: [80.0, 14.53, 4.74, 0.73],
    jumbo: [70.0, 22.99, 6.01, 1.0],
  },
  {
    key: 'sv7',
    codes: ['CSV7C', 'CSV8C', 'CSV9C'],
    jumboHolos: 6,
    group2: 'Double Rare, Art Rare, ACE SPEC Rare and Master Ball pattern holo',
    slim: [80.0, 13.82, 5.45, 0.73],
    jumbo: [70.0, 22.11, 6.89, 1.0],
  },
  {
    key: 'sv10',
    codes: ['CSV10C'],
    jumboHolos: 6,
    group2: 'Double Rare, Art Rare and Master Ball pattern holo',
    slim: [80.0, 14.01, 5.26, 0.73],
    jumbo: [70.0, 22.35, 6.65, 1.0],
  },
  {
    key: 'sv105',
    codes: ['CSV10.5C', 'CSV10.6C'],
    jumboHolos: 7,
    group2: 'Double Rare, Art Rare and Master Ball pattern holo',
    slim: [80.0, 13.23, 6.04, 0.73],
    jumbo: [65.0, 26.45, 7.55, 1.0],
  },
] as const
const TOP_GROUP_NAME = (key: string) => (key === 'sv105' ? 'Super Rare, Special Art Rare and Black White Rare' : 'Super Rare, Special Art Rare and Ultra Rare')

// Main expansions sold in both sizes, oldest first. True Mystery's full chart
// is not in our notes, so only its pack sizes and top group are used.
const BOTH = ['CSV1C', 'CSV2C', 'CSV3C', 'CSV4C', 'CSV5C', 'CSV6C', 'CSV7C', 'CSV8C', 'CSV9C', 'CSV10C', 'CSV10.5C', 'CSV10.6C']
const jumboHolosFor = (code: string) => (code === 'CSV10.5C' || code === 'CSV10.6C' ? 7 : 6)
const guideFor = {
  CSV1C: '/blog/eternal-birth-set-guide',
  CSV2C: '/blog/miracle-journey-set-guide',
  CSV3C: '/blog/fearless-terastal-set-guide',
  CSV4C: '/blog/reward-round-set-guide',
  CSV5C: '/blog/black-crystal-blaze-set-guide',
  CSV6C: '/blog/true-mystery-set-guide',
  CSV7C: '/blog/blade-awakening-set-guide',
  CSV8C: '/blog/brilliant-fantasy-set-guide',
  CSV9C: '/blog/stellar-crystal-set-guide',
  CSV10C: '/blog/chasing-glory-set-guide',
  'CSV10.5C': '/blog/black-bolt-set-guide',
  'CSV10.6C': '/blog/white-flare-set-guide',
} as const

const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
const pct = (n: number) => `${n.toFixed(2)}%`
const TOP_SLIM = 0.73
const TOP_JUMBO = 1.0
const slimBoxCards = SLIM.cards * SLIM.perBox
const jumboBoxCards = JUMBO.cards * JUMBO.perBox
const topPerSlimBox = (slimBoxCards * TOP_SLIM) / 100
const topPerJumboBox = (jumboBoxCards * TOP_JUMBO) / 100
const slimPacksPerTop = 100 / (SLIM.cards * TOP_SLIM)
const jumboPacksPerTop = 100 / (JUMBO.cards * TOP_JUMBO)
const names = (codes: readonly string[]) => {
  const n = codes.map((c) => setBy(c).name)
  return n.length <= 2 ? n.join(' and ') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`
}

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'packs', label: 'What is in each pack' },
  { id: 'boxes', label: 'What is in each box' },
  { id: 'sets', label: 'Which sets have slim and jumbo packs' },
  { id: 'odds', label: 'The official odds, side by side' },
  { id: 'per-box', label: 'Top cards per box, with the maths' },
  { id: 'other-sizes', label: 'Sets with other pack sizes' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

const FAQ = [
  {
    q: 'What is the difference between slim and jumbo Chinese Pokémon packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo, or 13 and 7 in Black Bolt and White Flare. Both pull from the same card list, and Pokémon China publishes a separate odds chart for each.',
  },
  {
    q: 'How many packs are in a Chinese slim or jumbo booster box?',
    a: 'Pokémon China does not list a box size on its product pages. The slim boxes we sell hold 15 packs (75 cards) and the jumbo boxes hold 6 packs (120 cards).',
  },
  {
    q: 'Do jumbo packs have better odds than slim packs?',
    a: 'Yes, per card. In every chart, Super Rares, Special Art Rares and Ultra Rares are 0.73% of slim-pack cards and 1.00% of jumbo-pack cards, and each holo group has a higher share in the jumbo pack.',
  },
  {
    q: 'Do slim and jumbo packs have different cards?',
    a: 'No. Both sizes pull from the same card list. Only the number of cards per pack and the odds change.',
  },
  {
    q: 'What do 5张装 and 20张装 mean?',
    a: 'They are Pokémon China’s names for the two pack sizes: 5张装 is the 5-card pack (slim) and 20张装 is the 20-card pack (jumbo). The packs themselves print 随机封入5张卡牌 or 随机封入20张卡牌, meaning 5 or 20 cards packed at random.',
  },
  {
    q: 'Do Gem Packs come in slim and jumbo?',
    a: 'No. Every Gem Pack has 4 cards, all holo. Terastal Gathering and 30th Celebration also have one pack size each: 10 cards and 6 cards.',
  },
]

export const Route = createFileRoute('/blog/chinese-pokemon-slim-vs-jumbo')({
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
  component: SlimVsJumboPost,
})

function SlimVsJumboPost() {
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
  const cg = setBy('CSV10C')
  const tg = setBy('CSV9.5C')
  const c30 = setBy('30thC')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Simplified Chinese Pokémon expansions come in two pack sizes with the same card list. A slim pack has 5 cards with 1 holo. A jumbo pack has 20 cards with 6 holos, or 7 in Black Bolt and White Flare, and better published odds for every holo group."
        cta={{
          heading: 'Shop slim and jumbo boxes',
          body: 'Sealed Simplified Chinese slim and jumbo booster boxes.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-jumbo-booster-box' }, label: 'Black Bolt jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-slim-booster-box' }, label: 'Black Bolt slim box', variant: 'ghost' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Slim pack:</strong> 5 cards, 4 non-holo and 1 holo. Pokémon China calls it the 5-card pack (<Zh>5张装</Zh>).
          </li>
          <li>
            <strong>Jumbo pack:</strong> 20 cards, 14 non-holo and 6 holo (13 and 7 in Black Bolt and White Flare). Pokémon China
            calls it the 20-card pack (<Zh>20张装</Zh>).
          </li>
          <li>
            <strong>Same cards.</strong> Both sizes pull from the same card list. Only the pack size and the odds differ.
          </li>
          <li>
            <strong>Better odds per card in jumbo.</strong> The rarest group (Super Rare, Special Art Rare and Ultra Rare) is{' '}
            {pct(TOP_SLIM)} of slim-pack cards and {pct(TOP_JUMBO)} of jumbo-pack cards in every chart.
          </li>
          <li>
            <strong>Boxes:</strong> the slim boxes we sell hold {SLIM.perBox} packs and the jumbo boxes {JUMBO.perBox}. That averages
            about {fmt(topPerSlimBox, 2)} top cards per slim box and about {fmt(topPerJumboBox)} per jumbo box.
          </li>
        </ul>
        <p>
          In this article we cover what each pack and box holds, which sets come in both sizes and how the official odds compare, set
          by set.
        </p>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="packs">What is in each pack</h2>
        <p>
          Here are the two {cg.name} ({cg.code}) packs. They share the same art. The top corner tells them apart: the slim pack reads{' '}
          <Zh>随机封入5张卡牌</Zh> and the jumbo pack <Zh>随机封入20张卡牌</Zh>, 5 or 20 cards packed at random.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/chasing-glory-slim-pack.webp`} alt="Chasing Glory slim pack, 5 cards" loading="lazy" width={600} height={1128} />
              <figcaption>
                <strong>Slim pack</strong>5 cards · 1 holo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${SITE_URL}/assets/blog/chasing-glory-jumbo-pack.webp`} alt="Chasing Glory jumbo pack, 20 cards" loading="lazy" width={600} height={1197} />
              <figcaption>
                <strong>Jumbo pack</strong>20 cards · 6 holo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          In the slim pack, the four non-holo cards are Commons and Uncommons, and the holo is the one card that can be a Rare or
          better. In the jumbo pack, the extra holos raise the holo share of the pack from 20% to 30% (35% in Black Bolt and White
          Flare).
        </p>

        <h2 id="boxes">What is in each box</h2>
        <p>
          Pokémon China&rsquo;s product pages give the pack sizes but not the number of packs in a box. These are the boxes we sell:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-box" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-box" className="sr-only">
              Slim box and jumbo box contents
            </caption>
            <thead>
              <tr>
                <th scope="col">Per box</th>
                <th scope="col">Slim box</th>
                <th scope="col">Jumbo box</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Packs</th>
                <td>{SLIM.perBox}</td>
                <td>{JUMBO.perBox}</td>
              </tr>
              <tr>
                <th scope="row">Cards per pack</th>
                <td>{SLIM.cards}</td>
                <td>{JUMBO.cards}</td>
              </tr>
              <tr>
                <th scope="row">Cards per box</th>
                <td>{slimBoxCards}</td>
                <td>{jumboBoxCards}</td>
              </tr>
              <tr>
                <th scope="row">Holos per box</th>
                <td>{SLIM.perBox}</td>
                <td>
                  {JUMBO.perBox * 6} ({JUMBO.perBox * 7} in Black Bolt and White Flare)
                </td>
              </tr>
              <tr>
                <th scope="row">Super Rare, Special Art Rare and Ultra Rare (average)</th>
                <td>about {fmt(topPerSlimBox, 2)}</td>
                <td>about {fmt(topPerJumboBox)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages from the official print shares, not guarantees. Individual boxes vary.</p>
        <p>
          A jumbo box has fewer packs but more cards: {jumboBoxCards} against {slimBoxCards}, and more than twice the holos. A slim box
          gives you {SLIM.perBox} packs to open against {JUMBO.perBox}.
        </p>

        <BuyStrip />

        <h2 id="sets">Which sets have slim and jumbo packs</h2>
        <p>
          Every main expansion on our card lists, from {setBy(BOTH[0]).name} to {setBy(BOTH[BOTH.length - 1]).name}, comes in both
          sizes, except {tg.name}, which has a single 10-card pack. So do three of the four Collect 151 releases.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-sets" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-sets" className="sr-only">
              Simplified Chinese sets with slim and jumbo packs
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Code</th>
                <th scope="col">Slim pack</th>
                <th scope="col">Jumbo pack</th>
                <th scope="col">Guide</th>
              </tr>
            </thead>
            <tbody>
              {BOTH.map((code) => {
                const s = setBy(code)
                return (
                  <tr key={code}>
                    <th scope="row">
                      <Link to={s.path}>{s.name}</Link>
                    </th>
                    <td>{code}</td>
                    <td>5 cards, 1 holo</td>
                    <td>20 cards, {jumboHolosFor(code)} holo</td>
                    <td>
                      <Link to={guideFor[code as keyof typeof guideFor]}>Set guide</Link>
                    </td>
                  </tr>
                )
              })}
              <tr>
                <th scope="row">
                  <Link to="/blog/collect-151-set-guide">Collect 151: Hope, Surprise, Gathering</Link>
                </th>
                <td>151C</td>
                <td>5 cards, 1 holo</td>
                <td>20 cards, 7 holo</td>
                <td>
                  <Link to="/blog/collect-151-set-guide">Set guide</Link>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey</Link>
                </th>
                <td>151C</td>
                <td>5 cards, 1 holo</td>
                <td>None announced</td>
                <td>
                  <Link to="/blog/collect-151-journey-release-news">Release post</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">Pack sizes from Pokémon China&rsquo;s product page for each set.</p>

        <h2 id="odds">The official odds, side by side</h2>
        <p>
          Pokémon China prints one odds chart for the slim pack and one for the jumbo pack. Each chart splits the cards into four
          groups and gives each group&rsquo;s share of all cards printed for that size. The charts change a little from set to set:
        </p>
        {CHARTS.map((c) => (
          <div key={c.key}>
            <h3 id={`odds-${c.key}`}>{names(c.codes)}</h3>
            <div className="table-scroll" role="group" aria-labelledby={`tbl-${c.key}`} tabIndex={0}>
              <table className="data-table">
                <caption id={`tbl-${c.key}`} className="sr-only">
                  Slim and jumbo odds for {names(c.codes)}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Share of print</th>
                    <th scope="col">Slim</th>
                    <th scope="col">Jumbo</th>
                  </tr>
                </thead>
                <tbody>
                  {['Common and Uncommon (non-holo)', 'Poké Ball pattern holo and Rare', c.group2, TOP_GROUP_NAME(c.key)].map((band, i) => (
                    <tr key={band}>
                      <th scope="row">{band}</th>
                      <td>{pct(c.slim[i])}</td>
                      <td>{pct(c.jumbo[i])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <p className="table-note">From Pokémon China&rsquo;s odds charts for each pack size.</p>
        <p>
          {setBy('CSV6C').name} ({setBy('CSV6C').code}) uses the same top group shares, {pct(TOP_SLIM)} slim and {pct(TOP_JUMBO)}
          jumbo. Its <Link to="/blog/true-mystery-set-guide">set guide</Link> covers the rest.
        </p>
        <p>
          The jumbo pack has the higher share in every holo group, in every chart. The non-holo share drops from 80% to 70% (65% in
          Black Bolt and White Flare), and the difference goes to the holos.
        </p>

        <h2 id="per-box">Top cards per box, with the maths</h2>
        <p>Each average is the number of cards times the group&rsquo;s share.</p>
        <ul>
          <li>
            <strong>Slim pack:</strong> {SLIM.cards} cards × {pct(TOP_SLIM)} = {fmt((SLIM.cards * TOP_SLIM) / 100, 4)}, about one
            top card every {fmt(slimPacksPerTop, 0)} packs.
          </li>
          <li>
            <strong>Jumbo pack:</strong> {JUMBO.cards} cards × {pct(TOP_JUMBO)} = {fmt((JUMBO.cards * TOP_JUMBO) / 100, 2)}, about
            one top card every {fmt(jumboPacksPerTop, 0)} packs.
          </li>
          <li>
            <strong>Slim box:</strong> {SLIM.perBox} packs × {SLIM.cards} cards × {pct(TOP_SLIM)} = about {fmt(topPerSlimBox, 2)}.
          </li>
          <li>
            <strong>Jumbo box:</strong> {JUMBO.perBox} packs × {JUMBO.cards} cards × {pct(TOP_JUMBO)} = about {fmt(topPerJumboBox)}.
          </li>
        </ul>
        <p>
          The charts give one share for the whole top group, so they do not say how often a Special Art Rare turns up on its own. Each
          set guide shows that set&rsquo;s chase cards. For what each rarity means, see{' '}
          <Link to="/blog/chinese-pokemon-card-rarities">Chinese Pokémon card rarities explained</Link>.
        </p>

        <h2 id="other-sizes">Sets with other pack sizes</h2>
        <ul>
          <li>
            <strong>
              <Link to={tg.path}>{tg.name}</Link> ({tg.code}):
            </strong>{' '}
            one 10-card pack, with 7 non-holo and 3 holo cards or 6 non-holo and 4 holo cards.
          </li>
          <li>
            <strong>
              <Link to={c30.path}>{c30.name}</Link> ({c30.code}):
            </strong>{' '}
            one 6-card pack, every card a holo. See the <Link to="/blog/30th-celebration-set-guide">set guide</Link>.
          </li>
          <li>
            <strong>Gem Packs (CBB1C to CBB7C):</strong> one 4-card pack, every card a holo. Our{' '}
            <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link> covers their odds.
          </li>
        </ul>
        <p>
          See <Link to="/blog/chinese-pokemon-sets-in-order">every Simplified Chinese set in order</Link> for where each set falls.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>

        <h2 id="sources">Sources</h2>
        <p>Pokémon China product pages, for each set&rsquo;s pack sizes and odds charts:</p>
        <ul>
          {[
            ['Eternal Birth', 'https://www.pokemon.cn/tcg/product/15585.html'],
            ['Miracle Journey', 'https://www.pokemon.cn/tcg/product/15556.html'],
            ['Fearless Terastal', 'https://www.pokemon.cn/tcg/product/15519.html'],
            ['Reward Round', 'https://www.pokemon.cn/tcg/product/15488.html'],
            ['Black Crystal Blaze', 'https://www.pokemon.cn/tcg/product/15453.html'],
            ['True Mystery', 'https://www.pokemon.cn/tcg/17555.html'],
            ['Blade Awakening', 'https://www.pokemon.cn/tcg/product/19812.html'],
            ['Brilliant Fantasy', 'https://www.pokemon.cn/tcg/product/20627.html'],
            ['Stellar Crystal', 'https://www.pokemon.cn/tcg/product/21383.html'],
            ['Terastal Gathering', 'https://www.pokemon.cn/tcg/product/21997.html'],
            ['Chasing Glory', 'https://www.pokemon.cn/tcg/product/20012.html'],
            ['Black Bolt and White Flare', 'https://www.pokemon.cn/tcg/product/24290.html'],
            ['Collect 151: Hope', 'https://www.pokemon.cn/tcg/product/15541.html'],
            ['Collect 151: Surprise and Gathering', 'https://www.pokemon.cn/tcg/product/15486.html'],
            ['Collect 151: Journey products', 'https://www.pokemon.cn/tcg/product/15688.html'],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </BlogPostLayout>
    </>
  )
}
