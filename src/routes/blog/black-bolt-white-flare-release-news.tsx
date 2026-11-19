import { Zh } from '~/components/blog/Zh'
import { RarityAbbr, rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import blackBolt from '~/data/black-bolt.json'
import whiteFlare from '~/data/white-flare.json'

const post = BLOG_POSTS.find((p) => p.slug === 'black-bolt-white-flare-release-news')!

const SETS = { bb: blackBolt, wf: whiteFlare } as const
type SetKey = keyof typeof SETS
type Pick = [SetKey, number]

const short = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r
const card = ([set, no]: Pick) => {
  const data = SETS[set]
  return { set: data.name, exclusive: data.exclusiveCardNumbers.includes(data.cards.find((c) => c.pokemonIndex === no)!.number), ...data.cards.find((c) => c.pokemonIndex === no)! }
}

function Grid({ picks, cols }: { picks: Pick[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {picks.map(card).map((c) => (
        <li key={`${c.set}-${c.number}`}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, ${c.set}`} loading="lazy" width={300} height={419} />
            <figcaption>
              {c.exclusive && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.set} {c.number} · <RarityAbbr code={short(c.rarity)} />
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const EXCLUSIVES: Pick[] = [['bb', 173], ['wf', 173]]
const BWR: Pick[] = [['bb', 174], ['wf', 174]]
const BB_SAR: Pick[] = [['bb', 169], ['bb', 168], ['bb', 172], ['bb', 167], ['bb', 170], ['bb', 171]]
const WF_SAR: Pick[] = [['wf', 168], ['wf', 169], ['wf', 171], ['wf', 167], ['wf', 170], ['wf', 172]]
const FIRST_ART_RARES: Pick[] = [['bb', 87], ['bb', 88], ['bb', 89], ['wf', 87], ['wf', 88], ['wf', 89]]

// Counted from the two card lists, so the page cannot drift from them.
const pokemonIn = (set: SetKey) => SETS[set].cards.filter((c) => c.pokemonIndex <= 78).map((c) => c.name.replace(/ ex$/, ''))
const UNOVA_TOTAL = new Set([...pokemonIn('bb'), ...pokemonIn('wf')]).size
const exNames = (set: SetKey) => SETS[set].cards.filter((c) => c.pokemonIndex <= 78 && / ex$/.test(c.name)).map((c) => c.name)
const list = (items: string[]) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

const COMPARE = [
  { row: 'Chinese name', bb: <Zh>黑雷奔流</Zh>, wf: <Zh>白焰迸涌</Zh> },
  { row: 'Set code', bb: 'CSV10.5C', wf: 'CSV10.6C' },
  { row: 'Pack Pokémon', bb: 'Zekrom', wf: 'Reshiram' },
  { row: 'Cards', bb: '174 (86 main, 88 secret)', wf: '174 (86 main, 88 secret)' },
  { row: 'Pokémon ex', bb: list(exNames('bb')), wf: list(exNames('wf')) },
  { row: 'Black White Rare', bb: 'Zekrom ex 174/086', wf: 'Reshiram ex 174/086' },
  { row: 'Chinese Exclusive', bb: "N's Plan SAR 173/086", wf: 'Hilda SAR 173/086' },
  { row: 'Art Rares', bb: '72', wf: '72' },
]

// Pokémon China's two odds charts, which are the same for both sets. Each
// share is of all cards printed for that pack size.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '65.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '13.23%', jumbo: '26.45%' },
  { band: 'Double Rare, Art Rare and Master Ball pattern holo', slim: '6.04%', jumbo: '7.55%' },
  { band: 'Super Rare, Special Art Rare and Black White Rare', slim: '0.73%', jumbo: '1.00%' },
]

const TOC = [
  { id: 'the-pair', label: 'Two sets, one release' },
  { id: 'exclusives', label: "Chinese Exclusives: N's Plan and Hilda" },
  { id: 'black-white-rares', label: 'The Black White Rares' },
  { id: 'pokemon-ex', label: 'Twelve Pokémon ex' },
  { id: 'art-rares', label: 'An Art Rare for every Pokémon' },
  { id: 'which-set', label: 'Which Pokémon are in which set' },
  { id: 'packs-and-odds', label: 'Packs and pull odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ: Array<{ q: string; a: string; link?: { to: string; before: string; label: string; after: string } }> = [
  {
    q: 'When were Black Bolt and White Flare released in Chinese?',
    a: 'November 6, 2026, in mainland China. Both sets released on the same day, in Simplified Chinese.',
  },
  {
    q: 'What is the difference between Black Bolt and White Flare?',
    a: `They are two halves of one release. Each has 174 cards and 78 different Unova Pokémon, with no Pokémon in both. Black Bolt is led by Zekrom ex and White Flare by Reshiram ex. Together they cover ${UNOVA_TOTAL} Unova Pokémon.`,
  },
  {
    q: 'What are the Chinese Exclusives in Black Bolt and White Flare?',
    a: "One in each set: the N's Plan Special Art Rare 173/086 in Black Bolt, by Iwamoto05, and the Hilda Special Art Rare 173/086 in White Flare, by Ligton. Neither illustration has an English version.",
  },
  {
    q: 'What is a Black White Rare?',
    a: 'The top rarity of this pair: a monochrome full art. Black Bolt has one, Zekrom ex 174/086, printed in black. White Flare has one, Reshiram ex 174/086, printed in white.',
  },
  {
    q: 'Do I need both sets to collect every Unova Pokémon?',
    a: `Yes. The ${UNOVA_TOTAL} Pokémon are split evenly, 78 in each set, and no Pokémon appears in both.`,
    link: { to: '/sets/chinese/black-bolt-csv10-5', before: 'Start with the ', label: 'Black Bolt card list', after: '.' },
  },
  {
    q: 'Are the pull odds the same for both sets?',
    a: 'Yes. Pokémon China publishes the same two odds charts for each set, one for the 5-card slim pack and one for the 20-card jumbo pack.',
  },
]

export const Route = createFileRoute('/blog/black-bolt-white-flare-release-news')({
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
  component: BlackBoltWhiteFlareReleasePost,
})

function BlackBoltWhiteFlareReleasePost() {
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
        lede={`Zekrom and Reshiram lead two sets that released on the same day and split ${UNOVA_TOTAL} Unova Pokémon between them. Each set also has one Chinese Exclusive: an N's Plan and a Hilda Special Art Rare.`}
        cta={{
          heading: 'Collect Black Bolt and White Flare',
          body: 'Browse all 174 cards of each set on its checklist and tick off what you have.',
          links: [
            { to: '/sets/chinese/black-bolt-csv10-5', label: 'Black Bolt card list' },
            { to: '/sets/chinese/white-flare-csv10-6', label: 'White Flare card list' },
          ],
        }}
      >
        <p>
          Black Bolt (<Zh>黑雷奔流</Zh>) and White Flare (<Zh>白焰迸涌</Zh>) released together on November 6, 2026. They are a matched
          pair in the Chinese Scarlet & Violet series: Zekrom is on the Black Bolt pack and Reshiram is on the White Flare pack. Each
          set has 174 cards, and between them they print {UNOVA_TOTAL} Pokémon from the Unova region, with no Pokémon in both.
        </p>

        <aside className="fact-box" aria-label="Black Bolt and White Flare key facts">
          <img src={card(['bb', 174]).image} alt="Zekrom ex 174/086 Black White Rare, Black Bolt" loading="lazy" width={300} height={419} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Sets</dt>
              <dd>Black Bolt (CSV10.5C) and White Flare (CSV10.6C)</dd>
              <dt>Released</dt>
              <dd>November 6, 2026</dd>
              <dt>Set size</dt>
              <dd>174 cards each: 86 in the main set, 88 secret rares</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 7 holo</dd>
              <dt>Top rarity</dt>
              <dd>Black White Rare: Zekrom ex and Reshiram ex</dd>
              <dt>Chinese Exclusives</dt>
              <dd>N's Plan SAR (Black Bolt) and Hilda SAR (White Flare)</dd>
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

        <h2 id="the-pair">Two sets, one release</h2>
        <p>
          The two sets are built the same way, card for card. Both have 78 Pokémon, seven Trainer cards and one Special Energy in the
          main set, and both have 88 secret rares in the same four tiers. What changes is which Pokémon and Trainers you get.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-pair" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-pair" className="sr-only">
              Black Bolt and White Flare side by side
            </caption>
            <thead>
              <tr>
                <td />
                <th scope="col">Black Bolt</th>
                <th scope="col">White Flare</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.row}>
                  <th scope="row">{r.row}</th>
                  <td>{r.bb}</td>
                  <td>{r.wf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="exclusives">Chinese Exclusives: N's Plan and Hilda</h2>
        <p>
          Each set has one card that was never printed in English, and it is the same slot in both: the Special Art Rare at 173/086.
        </p>
        <p>
          Black Bolt's is N's Plan, illustrated by Iwamoto05. N leans on a railing at night and looks back over his shoulder, with city
          lights blurred behind him.
        </p>
        <p>
          White Flare's is Hilda, illustrated by Ligton. She is drawn up close with her fist clenched, and flames rise around her.
        </p>
        <p>
          The English sets also have a Special Illustration Rare of N's Plan and of Hilda, but each uses a different illustration.
          The English ones are not in the Chinese sets, and these two are not in the English ones.
        </p>
        <Grid picks={EXCLUSIVES} cols={2} />

        <h2 id="black-white-rares">The Black White Rares</h2>
        <p>
          The top tier is new for this pair. A Black White Rare is a full art printed in a single tone: Zekrom ex in black for Black
          Bolt, and Reshiram ex in white for White Flare. Each set has exactly one, at 174/086.
        </p>
        <Grid picks={BWR} cols={2} />

        <BuyStrip />

        <h2 id="pokemon-ex">Twelve Pokémon ex</h2>
        <p>
          Each set has six Pokémon ex, and every one comes as a Double Rare, a Super Rare and a Special Art Rare. Black Bolt has{' '}
          {list(exNames('bb'))}. Here are its six Special Art Rares:
        </p>
        <Grid picks={BB_SAR} cols={3} />
        <p>White Flare has {list(exNames('wf'))}. Its six Special Art Rares:</p>
        <Grid picks={WF_SAR} cols={3} />

        <h2 id="art-rares">An Art Rare for every Pokémon</h2>
        <p>
          Every Pokémon that is not a Pokémon ex gets an Art Rare, so each set has 72 of them, 144 across the pair. They are numbered
          087 to 158 in the same order as the main set. Here are the first three from each set: Snivy, Servine and Pansage in Black
          Bolt, and Sewaddle, Swadloon and Leavanny in White Flare.
        </p>
        <Grid picks={FIRST_ART_RARES} cols={3} />

        <h2 id="which-set">Which Pokémon are in which set</h2>
        <p>
          The Chinese sets do not split the Pokémon exactly the way the English ones do. Litwick, Lampent, Chandelure, Vullaby and
          Mandibuzz are in Chinese Black Bolt, and Klink, Klang, Klinklang, Rufflet and Braviary are in Chinese White Flare. In English
          those two groups are the other way round. Victini is in Black Bolt as a Rare and an Art Rare. Our card origins guides for{' '}
          <Link to="/blog/black-bolt-card-origins">Black Bolt</Link> and <Link to="/blog/white-flare-card-origins">White Flare</Link>{' '}
          match every card to its English version.
        </p>

        <h2 id="packs-and-odds">Packs and pull odds</h2>
        <p>
          Both sets come in a slim box of 15 packs with 5 cards each, and a jumbo box of 6 packs with 20 cards each. A slim pack has one
          holo and a jumbo pack has seven. Pokémon China publishes an odds chart for each pack size, and the two sets share the same
          numbers. Each figure is that rarity group's share of all the cards printed:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Pull odds for slim and jumbo packs
            </caption>
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Slim pack (5 cards)</th>
                <th scope="col">Jumbo pack (20 cards)</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.slim}</td>
                  <td>{o.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">From the two official charts. Individual packs vary.</p>
        <p>
          In the top group that works out to about one Super Rare, Special Art Rare or Black White Rare in every 27 slim packs, or one
          in every five jumbo packs. The charts do not give odds for a Black White Rare on its own.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern and a Master Ball pattern holo, which brings each set to 334
          cards. The set guides for <Link to="/blog/black-bolt-set-guide">Black Bolt</Link> and{' '}
          <Link to="/blog/white-flare-set-guide">White Flare</Link> compare the slim and jumbo boxes and list every chase card.
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
          Pick the set by the Pokémon you want, since nothing overlaps. Black Bolt has Zekrom, Kyurem, Genesect and the N's Plan
          exclusive. White Flare has Reshiram, Keldeo, Hydreigon and the Hilda exclusive. Collecting all of Unova takes both.
        </p>
      </BlogPostLayout>
    </>
  )
}
