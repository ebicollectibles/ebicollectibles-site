import { createFileRoute, Link } from '@tanstack/react-router'
import { Zh, zh } from '~/components/blog/Zh'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-booster-box-guaranteed-hits')!

// ---------------------------------------------------------------------------
// Pack facts and odds are the same ones used in our slim vs jumbo guide and
// each set guide: Pokémon China's product page for each set (its 5张装 and
// 20张装 lines and its two odds charts). Box sizes are not on those pages:
// 15 slim packs and 6 jumbo packs are the boxes we sell. Every average below
// is worked out here from the shares, so the maths is shown, not typed.
// ---------------------------------------------------------------------------

const SLIM = { cards: 5, perBox: 15 }
const JUMBO = { cards: 20, perBox: 6 }
// The top group (Super Rare, Special Art Rare and Ultra Rare, or Black White
// Rare in Black Bolt and White Flare) is 0.73% of slim-pack cards and 1.00% of
// jumbo-pack cards in every chart.
const TOP_SLIM = 0.73
const TOP_JUMBO = 1.0

const setBy = (code: string) => GEM_SETS.find((s) => s.code === code)!

// The second-highest group's share in each chart (Double Rare, Art Rare,
// ACE SPEC Rare where the set has them, and Master Ball pattern holo).
const CHARTS = [
  { key: 'sv1', codes: ['CSV1C', 'CSV2C', 'CSV3C', 'CSV4C', 'CSV5C'], slim2: 4.74, jumbo2: 6.01, jumboHolos: 6 },
  { key: 'sv7', codes: ['CSV7C', 'CSV8C', 'CSV9C'], slim2: 5.45, jumbo2: 6.89, jumboHolos: 6 },
  { key: 'sv10', codes: ['CSV10C'], slim2: 5.26, jumbo2: 6.65, jumboHolos: 6 },
  { key: 'sv105', codes: ['CSV10.5C', 'CSV10.6C'], slim2: 6.04, jumbo2: 7.55, jumboHolos: 7 },
] as const

// Every main set sold in both sizes, newest first. `top` is how many different
// cards are in the top group, counted from each set's card list (Super Rare,
// Special Art Rare and Ultra Rare, or Black White Rare). The example is each
// set's lead Special Art Rare, or its Black White Rare.
const SETS = [
  { code: 'CSV10.6C', top: 16, guide: '/blog/white-flare-set-guide' },
  { code: 'CSV10.5C', top: 16, guide: '/blog/black-bolt-set-guide' },
  { code: 'CSV10C', top: 59, guide: '/blog/chasing-glory-set-guide' },
  { code: 'CSV9C', top: 52, guide: '/blog/stellar-crystal-set-guide' },
  { code: 'CSV8C', top: 51, guide: '/blog/brilliant-fantasy-set-guide' },
  { code: 'CSV7C', top: 49, guide: '/blog/blade-awakening-set-guide' },
  { code: 'CSV6C', top: 27, guide: '/blog/true-mystery-set-guide' },
  { code: 'CSV5C', top: 27, guide: '/blog/black-crystal-blaze-set-guide' },
  { code: 'CSV4C', top: 28, guide: '/blog/reward-round-set-guide' },
  { code: 'CSV3C', top: 27, guide: '/blog/fearless-terastal-set-guide' },
  { code: 'CSV2C', top: 27, guide: '/blog/miracle-journey-set-guide' },
  { code: 'CSV1C', top: 32, guide: '/blog/eternal-birth-set-guide' },
] as const

const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
const pct = (n: number) => `${n.toFixed(2)}%`
const slimBoxCards = SLIM.cards * SLIM.perBox
const jumboBoxCards = JUMBO.cards * JUMBO.perBox
const topPerSlimBox = (slimBoxCards * TOP_SLIM) / 100
const topPerJumboBox = (jumboBoxCards * TOP_JUMBO) / 100
const slimPacksPerTop = 100 / (SLIM.cards * TOP_SLIM)
const jumboPacksPerTop = 100 / (JUMBO.cards * TOP_JUMBO)
// Odds of one named top-group card, if every card in the group is printed in
// equal numbers (the charts do not say).
const oneCard = (top: number) => {
  const slimPack = (SLIM.cards * TOP_SLIM) / 100 / top
  const jumboPack = (JUMBO.cards * TOP_JUMBO) / 100 / top
  return {
    slimBoxes: 1 / (slimPack * SLIM.perBox),
    jumboBoxes: 1 / (jumboPack * JUMBO.perBox),
    slimTen: 1 - (1 - slimPack) ** (SLIM.perBox * 10),
    jumboTen: 1 - (1 - jumboPack) ** (JUMBO.perBox * 10),
  }
}
const exampleName = (code: string) => setBy(code).heroAlt.replace(/, (Special Art Rare|Black White Rare)$/, '')
const names = (codes: readonly string[]) => {
  const n = codes.map((c) => setBy(c).name)
  return n.length <= 2 ? n.join(' and ') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`
}

const CHASE = ['CSV5C', 'CSV10C', 'CSV10.5C', 'CSV10.6C'] as const

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'pack', label: 'What every pack guarantees' },
  { id: 'box', label: 'What a box guarantees' },
  { id: 'per-box', label: 'Hits per box, with the maths' },
  { id: 'slim-or-jumbo', label: 'Slim or jumbo for hits' },
  { id: 'one-card', label: 'Odds of pulling one specific chase card' },
  { id: 'other-products', label: 'Gem Packs, Collect 151 and other boxes' },
  { id: 'faq', label: 'FAQ' },
]

const sv1 = CHARTS[0]
const sv105 = CHARTS[3]
const charizard = oneCard(27)
const mewtwo = oneCard(59)
const zekrom = oneCard(16)

const FAQ = [
  {
    q: 'Do Chinese Pokémon booster boxes have guaranteed hits?',
    a: `No. Pokémon China does not promise a Special Art Rare, a Super Rare or any other top card per box. What a box holds is set by its packs: every slim pack has 1 holo and every jumbo pack has 6 or 7. A slim box averages about ${fmt(topPerSlimBox, 2)} top cards and a jumbo box about ${fmt(topPerJumboBox)}, which are averages, not promises.`,
  },
  {
    q: 'Do Chinese Pokémon cards have guaranteed hits in every pack?',
    a: `Every pack has a guaranteed holo: 1 in a 5-card slim pack, 6 in a 20-card jumbo pack (7 in Black Bolt and White Flare). The top cards are not guaranteed. They turn up about once every ${fmt(slimPacksPerTop, 0)} slim packs and once every ${fmt(jumboPacksPerTop, 0)} jumbo packs.`,
  },
  {
    q: 'How many Special Art Rares are in a Chinese booster box?',
    a: `Pokémon China gives one share for Super Rares, Special Art Rares and Ultra Rares together, so it does not say. That whole group averages about ${fmt(topPerSlimBox, 2)} cards in a 15-pack slim box and about ${fmt(topPerJumboBox)} in a 6-pack jumbo box.`,
  },
  {
    q: 'Does a jumbo box guarantee a Special Art Rare?',
    a: `No. A jumbo box averages about ${fmt(topPerJumboBox)} top cards (6 packs × 20 cards × 1.00%), so many boxes have one, some have two and some have none. That top group also includes the Super Rares and Ultra Rares, not only Special Art Rares.`,
  },
  {
    q: 'Is a slim box or a jumbo box better for hits?',
    a: `By card count, the jumbo box. It has 120 cards to the slim box's 75, and the top group is a bigger share of jumbo cards (1.00% against 0.73%). That gives about ${fmt(topPerJumboBox)} top cards per jumbo box against about ${fmt(topPerSlimBox, 2)} per slim box. The slim box gives you 15 packs to open against 6.`,
  },
  {
    q: 'What are the odds of pulling a specific Special Art Rare from a Chinese box?',
    a: `It depends on how many top cards the set has. Charizard ex in Black Crystal Blaze is one of 27, which works out to about 1 in ${fmt(charizard.jumboBoxes, 0)} jumbo boxes or 1 in ${fmt(charizard.slimBoxes, 0)} slim boxes. Team Rocket's Mewtwo ex in Chasing Glory is one of 59, about 1 in ${fmt(mewtwo.jumboBoxes, 0)} jumbo boxes. Both assume every top card is printed in equal numbers, which Pokémon China does not say.`,
  },
  {
    q: 'How many packs are in a Chinese booster box?',
    a: 'Pokémon China does not list a box size on its product pages. The slim boxes we sell hold 15 five-card packs (75 cards) and the jumbo boxes hold 6 twenty-card packs (120 cards). Gem Pack boxes hold 15 or 18 four-card packs.',
  },
  {
    q: 'Does Pokémon China publish pull rates?',
    a: 'Yes. Each set’s product page has an odds chart for the 5-card pack and one for the 20-card pack, giving each rarity group’s share of all cards printed. The packs print 随机封入5张卡牌 or 随机封入20张卡牌, 5 or 20 cards packed at random.',
  },
  {
    q: 'Do Collect 151 boxes have guaranteed hits?',
    a: 'Pokémon China has not published an odds chart for Collect 151, so we give no pull rates for it. Its announcements say a 5-card pack has 1 holo and a 20-card pack has 7. Nothing is promised per box.',
  },
  {
    q: 'Do Chinese Gem Pack boxes guarantee a full art?',
    a: 'No. Every Gem Pack has one Rare or better, and a box averages about 1.3 three-star cards, but none is promised. Our Gem Pack hit rates guide covers all seven volumes.',
  },
]

export const Route = createFileRoute('/blog/chinese-booster-box-guaranteed-hits')({
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
  component: ChineseBoosterBoxGuaranteedHitsPost,
})

function ChineseBoosterBoxGuaranteedHitsPost() {
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
        lede={`Chinese Pokémon booster boxes have no guaranteed hit. Every pack has a guaranteed holo, but the top cards, the Super Rares, Special Art Rares and Ultra Rares, are left to chance. A jumbo box averages about ${fmt(topPerJumboBox)} of them and a slim box about ${fmt(topPerSlimBox, 2)}.`}
        cta={{
          heading: 'Shop Chinese booster boxes',
          body: 'Sealed Simplified Chinese slim and jumbo booster boxes, newest set first.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-white-flare-jumbo-booster-box' }, label: 'White Flare jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-jumbo-booster-box' }, label: 'Black Bolt jumbo box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-jumbo-booster-box' }, label: 'Chasing Glory jumbo box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-slim-booster-box' }, label: 'Chasing Glory slim box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box' }, label: 'Brilliant Fantasy jumbo box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Black Crystal Blaze jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>No box has a guaranteed hit.</strong> Pok&eacute;mon China does not promise a Special Art Rare, Super Rare or any
            other top card per box, for any set.
          </li>
          <li>
            <strong>Every pack has a guaranteed holo.</strong> A 5-card slim pack has 1 holo. A 20-card jumbo pack has 6, or 7 in Black
            Bolt and White Flare.
          </li>
          <li>
            <strong>Top cards are about one per jumbo box.</strong> A 6-pack jumbo box averages about {fmt(topPerJumboBox)} and a 15-pack
            slim box about {fmt(topPerSlimBox, 2)}, so plenty of slim boxes have none.
          </li>
          <li>
            <strong>Chasing one card takes many boxes.</strong> In a big set like Chasing Glory, one named Special Art Rare works out to
            about 1 in {fmt(mewtwo.jumboBoxes, 0)} jumbo boxes.
          </li>
        </ul>
        <p>
          The rest of this guide shows where those numbers come from, using Pok&eacute;mon China&rsquo;s own odds charts. Gem Packs work
          differently: see our <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link>.
        </p>

        <aside className="fact-box" aria-label="Chinese booster box key facts">
          <img
            src={`${SITE_URL}/assets/sets/packs/black-crystal-blaze-csv5.webp`}
            alt="A Black Crystal Blaze slim booster pack with Charizard on the front"
            loading="lazy"
            width={405}
            height={760}
            style={{ background: 'transparent', boxShadow: 'none' }}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Covers</dt>
              <dd>Simplified Chinese Scarlet &amp; Violet sets, CSV1C to CSV10.6C</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo (7 in Black Bolt and White Flare)</dd>
              <dt>Packs per box</dt>
              <dd>15 slim or 6 jumbo</dd>
              <dt>Box guarantee</dt>
              <dd>None stated by Pokémon China</dd>
              <dt>Top cards per box</dt>
              <dd>
                About {fmt(topPerSlimBox, 2)} slim, about {fmt(topPerJumboBox)} jumbo
              </dd>
              <dt>Language</dt>
              <dd>Simplified Chinese</dd>
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

        <h2 id="pack">What every pack guarantees</h2>
        <p>
          Pok&eacute;mon China&rsquo;s product page for each set lists two pack sizes. The 5-card pack (<Zh>5张装</Zh>), sold in slim
          boxes, has 4 non-holo cards and 1 holo. The 20-card pack (<Zh>20张装</Zh>), sold in jumbo boxes, has 14 non-holo cards and 6
          holos, or 13 and 7 in Black Bolt and White Flare.
        </p>
        <p>
          That holo is the one thing every pack promises. It can be a Pok&eacute; Ball pattern holo of a Common, a Rare, a Double Rare,
          an Art Rare or one of the top cards. The packs themselves print <Zh>随机封入5张卡牌</Zh> or <Zh>随机封入20张卡牌</Zh>: 5 or 20
          cards packed at random.
        </p>

        <h2 id="box">What a box guarantees</h2>
        <p>
          Nothing beyond what is in its packs. None of the product pages or odds charts we use promises a top card per box. A slim box
          is 15 packs, so 15 holos. A jumbo box is 6 packs, so 36 holos, or 42 in Black Bolt and White Flare.
        </p>
        <p>
          You will see listings online saying a box guarantees a Special Art Rare or a &ldquo;hit&rdquo;. That is a seller&rsquo;s
          claim, not Pok&eacute;mon China&rsquo;s. A jumbo box averages about one top card, so many boxes do have one, but an average is
          not a promise.
        </p>

        <h2 id="per-box">Hits per box, with the maths</h2>
        <p>
          Each odds chart splits the cards into four groups and gives each group&rsquo;s share of all cards printed for that pack size.
          A box&rsquo;s average is its number of cards times the share. The top group is {pct(TOP_SLIM)} of slim-pack cards and{' '}
          {pct(TOP_JUMBO)} of jumbo-pack cards in every chart:
        </p>
        <ul>
          <li>
            <strong>Slim box:</strong> {SLIM.perBox} packs × {SLIM.cards} cards × {pct(TOP_SLIM)} = about {fmt(topPerSlimBox, 2)} top
            cards, about one every {fmt(slimPacksPerTop, 0)} packs.
          </li>
          <li>
            <strong>Jumbo box:</strong> {JUMBO.perBox} packs × {JUMBO.cards} cards × {pct(TOP_JUMBO)} = about {fmt(topPerJumboBox)} top
            cards, about one every {fmt(jumboPacksPerTop, 0)} packs.
          </li>
        </ul>
        <div className="table-scroll" role="group" aria-labelledby="tbl-perbox" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-perbox" className="sr-only">
              Average holos and Double Rare group cards per slim and jumbo box, by odds chart
            </caption>
            <thead>
              <tr>
                <th scope="col">Sets</th>
                <th scope="col">Holos, slim box</th>
                <th scope="col">Holos, jumbo box</th>
                <th scope="col">Double Rare group, slim box</th>
                <th scope="col">Double Rare group, jumbo box</th>
              </tr>
            </thead>
            <tbody>
              {CHARTS.map((c) => (
                <tr key={c.key}>
                  <th scope="row" style={{ whiteSpace: 'normal', minWidth: 180 }}>
                    {names(c.codes)}
                  </th>
                  <td>15</td>
                  <td>{JUMBO.perBox * c.jumboHolos}</td>
                  <td>
                    about {fmt((slimBoxCards * c.slim2) / 100)} ({pct(c.slim2)})
                  </td>
                  <td>
                    about {fmt((jumboBoxCards * c.jumbo2) / 100)} ({pct(c.jumbo2)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Averages from Pok&eacute;mon China&rsquo;s odds charts, not guarantees. The top group is the same in every chart: about {fmt(topPerSlimBox, 2)} per slim box and about {fmt(topPerJumboBox)} per jumbo box. {setBy('CSV6C').name} uses the same top group shares;
          its full chart is in its <Link to="/blog/true-mystery-set-guide">set guide</Link>. The Double Rare group also holds Art Rares,
          Master Ball pattern holos and, in {names(['CSV7C', 'CSV8C', 'CSV9C'])}, ACE SPEC Rares. The top group is Super Rare, Special
          Art Rare and Ultra Rare, or Black White Rare in Black Bolt and White Flare.
        </p>

        <h2 id="slim-or-jumbo">Slim or jumbo for hits</h2>
        <p>
          By card count, the jumbo box gives more hits. It has {jumboBoxCards} cards to the slim box&rsquo;s {slimBoxCards}, and every
          holo group has a higher share in the jumbo pack. In {names(sv1.codes)}, that is about {fmt((jumboBoxCards * sv1.jumbo2) / 100)}{' '}
          cards from the Double Rare group per jumbo box against about {fmt((slimBoxCards * sv1.slim2) / 100)} per slim box. In{' '}
          {names(sv105.codes)}, it is about {fmt((jumboBoxCards * sv105.jumbo2) / 100)} against about{' '}
          {fmt((slimBoxCards * sv105.slim2) / 100)}.
        </p>
        <p>
          The slim box gives you more packs to open: 15 against 6. Our{' '}
          <Link to="/blog/chinese-pokemon-slim-vs-jumbo">slim vs jumbo guide</Link> lays out every chart side by side.
        </p>

        <h2 id="one-card">Odds of pulling one specific chase card</h2>
        <p>
          The top cards per box are shared across every card in the top group. Your odds of one named card, such as a set&rsquo;s lead
          Special Art Rare, are that share divided by the number of top cards in the set. Big sets spread the same share across more
          cards, so each one is harder to pull.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-onecard" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-onecard" className="sr-only">
              Odds of pulling one specific top card per slim and jumbo box, and across 10 boxes, for each set
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Example card</th>
                <th scope="col">Top cards</th>
                <th scope="col">Per jumbo box</th>
                <th scope="col">Per slim box</th>
                <th scope="col">Chance in 10 jumbo boxes</th>
                <th scope="col">Chance in 10 slim boxes</th>
              </tr>
            </thead>
            <tbody>
              {SETS.map((s) => {
                const set = setBy(s.code)
                const o = oneCard(s.top)
                return (
                  <tr key={s.code}>
                    <th scope="row">
                      <Link to={s.guide}>{set.name}</Link>
                    </th>
                    <td>{exampleName(s.code)}</td>
                    <td>{s.top}</td>
                    <td>1 in {fmt(o.jumboBoxes)}</td>
                    <td>1 in {fmt(o.slimBoxes)}</td>
                    <td>{fmt(o.jumboTen * 100, 0)}%</td>
                    <td>{fmt(o.slimTen * 100, 0)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Per pack is the pack&rsquo;s cards × the top group share ÷ the number of top cards. The chance in 10 boxes is 1 − (1 − per
          pack) to the power of the packs in 10 boxes (150 slim, 60 jumbo). Both assume every top card is printed in equal numbers,
          which Pok&eacute;mon China does not say. Top cards counted from each set&rsquo;s card list.
        </p>
        <p>
          Black Bolt and White Flare have only 16 top cards each, so a named card there, like Zekrom ex 174/086, is
          about 1 in {fmt(zekrom.jumboBoxes)} jumbo boxes. Each set guide shows its chase cards:
        </p>
        <ul className="card-grid cols-4">
          {CHASE.map((code) => {
            const s = setBy(code)
            return (
              <li key={code}>
                <figure>
                  <img src={s.heroImage} alt={`${s.heroAlt} from ${s.name}`} loading="lazy" width={300} height={419} />
                  <figcaption>
                    <strong>{exampleName(code)}</strong>
                    {s.name} · <Link to={SETS.find((x) => x.code === code)!.guide}>Set guide</Link> ·{' '}
                    <Link to={s.path}>Card list</Link>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>

        <h2 id="other-products">Gem Packs, Collect 151 and other boxes</h2>
        <ul>
          <li>
            <strong>Gem Packs (CBB1C to CBB7C):</strong> 4 holo cards per pack, one of them Rare or better. A box averages about 1.3
            three-star cards, with no guarantee. See the <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link>.
          </li>
          <li>
            <strong>
              <Link to="/blog/collect-151-set-guide">Collect 151</Link>:
            </strong>{' '}
            Pok&eacute;mon China has not published an odds chart, so we give no pull rates. A 5-card pack has 1 holo and a 20-card pack
            has 7.
          </li>
          <li>
            <strong>
              <Link to={setBy('CSV9.5C').path}>{setBy('CSV9.5C').name}</Link>:
            </strong>{' '}
            one 10-card pack. Its odds are in the <Link to="/blog/terastal-gathering-set-guide">set guide</Link>.
          </li>
          <li>
            <strong>
              <Link to={setBy('30thC').path}>{setBy('30thC').name}</Link>:
            </strong>{' '}
            one 6-card pack, every card a holo. Its odds are in the <Link to="/blog/30th-celebration-set-guide">set guide</Link>.
          </li>
        </ul>
        <p>
          For what each rarity means, see <Link to="/blog/chinese-pokemon-card-rarities">Chinese Pokémon card rarities explained</Link>,
          and for where each set falls, <Link to="/blog/chinese-pokemon-sets-in-order">every Simplified Chinese set in order</Link>.
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

        <h2 id="our-take">Our take</h2>
        <p>
          Open a Chinese box for the holos and the odds, not for a promised card. A jumbo box is the better bet for top cards by count,
          with about one per box on average. If you want one specific Special Art Rare, the table above shows how many boxes that
          usually takes, and buying the single is often the surer route.
        </p>
      </BlogPostLayout>
    </>
  )
}
