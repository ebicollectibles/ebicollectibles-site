import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-1-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%201/Cards/${id}.webp`

// The four Pokémon Horizons full arts (version 09), the set's Chinese
// Exclusives. Art notes were checked against the card images.
const HORIZONS = [
  { id: '0109', name: 'Sprigatito', with: 'Liko', art: 'Liko kneels in the grass, winking as she holds up her glowing pendant, with Sprigatito leaping up beside her.' },
  { id: '0309', name: 'Fuecoco', with: 'Roy', art: 'Roy sits on a wooden deck under a blue sky with Fuecoco in his lap, balancing a bronze Poké Ball on one finger.' },
  { id: '0509', name: 'Quaxly', with: 'Nidothing', art: "Quaxly spreads its wings against a starry purple and blue sky, with Nidothing, Dot's costumed streaming persona, behind it." },
  { id: '0709', name: 'Captain Pikachu', with: 'Friede', art: 'Captain Pikachu, arms folded, stands on the back of a sofa while Friede leans in behind him, hand on chin.' },
]

// The seven illustration full arts (version 08).
const FULL_ARTS = [
  { id: '0708', name: 'Pikachu', no: '0708/09' },
  { id: '0108', name: 'Sprigatito', no: '0108/09' },
  { id: '0208', name: 'Floragato', no: '0208/08' },
  { id: '0308', name: 'Fuecoco', no: '0308/09' },
  { id: '0408', name: 'Crocalor', no: '0408/08' },
  { id: '0508', name: 'Quaxly', no: '0508/09' },
  { id: '0608', name: 'Quaxwell', no: '0608/08' },
]

// A sample of Sprigatito's 9 cards.
const SPRIGATITO_SAMPLE = [
  { id: '0101', label: 'Base card', note: 'Common' },
  { id: '0104', label: 'Base card', note: 'Uncommon' },
  { id: '0106', label: 'Shiny-style card', note: 'Rare' },
  { id: '0107', label: 'Base card', note: 'Double Rare · Gem Pack logo stamp' },
  { id: '0108', label: 'Illustration full art', note: 'Triple Rare' },
  { id: '0109', label: 'Horizons full art', note: 'Triple Rare', exclusive: true },
]

const TRAINERS = [
  { id: '1704', name: 'Nemona', rarity: 'Triple Rare' },
  { id: '1701', name: 'Poké Ball', rarity: 'Double Rare' },
  { id: '1702', name: 'Great Ball', rarity: 'Double Rare' },
  { id: '1703', name: 'Ultra Ball', rarity: 'Double Rare' },
]

// One row per rarity, with Pokémon China's print shares.
const RARITY = [
  { symbol: '●', label: 'Common', which: 'Versions 01 and 02 of all 16 Pokémon', cards: 32, print: '50.00%' },
  { symbol: '◆', label: 'Uncommon', which: 'Versions 03 and 04 of the 9- and 8-card runs, version 03 of the 5-card runs', cards: 23, print: '25.00%' },
  { symbol: '★', label: 'Rare', which: 'Versions 05 and 06 of the 9- and 8-card runs, version 04 of the 5-card runs', cards: 23, print: '17.90%' },
  { symbol: '★★', label: 'Double Rare', which: 'Version 07 of the 9- and 8-card runs, version 05 of the 5-card runs, Poké Ball, Great Ball and Ultra Ball', cards: 19, print: '4.93%' },
  { symbol: '★★★', label: 'Triple Rare', which: '7 illustration full arts, 4 Horizons full arts, Nemona, 6 Energy', cards: 18, print: '2.17%' },
]

const TOC = [
  { id: 'horizons-full-arts', label: 'Chinese Exclusives: four Horizons full arts' },
  { id: 'full-arts', label: 'Seven illustration full arts' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'sprigatito', label: "Sprigatito's 9 cards" },
  { id: 'pikachu', label: 'Captain Pikachu and Pikachu' },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'gem-pack-timeline', label: 'Where Vol. 1 fits in the Gem Pack line' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
  { vol: 5, date: 'April 24, 2026', cards: 196 },
  { vol: 6, date: 'August 7, 2026', cards: 196 },
  { vol: 7, date: 'November 6, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 1 released?',
    a: 'January 17, 2025, in mainland China. It is a Simplified Chinese release, and the first Gem Pack.',
  },
  {
    q: 'Is Gem 1 the same as "Gemstone Vol. 1"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB1C.',
  },
  {
    q: 'What is in each pack?',
    a: 'Four cards, and every one of them is a holo.',
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 1?',
    a: 'The four Pokémon Horizons full arts: Sprigatito 0109/09 with Liko, Fuecoco 0309/09 with Roy, Quaxly 0509/09 with Nidothing and Captain Pikachu 0709/09 with Friede. They are the only version 09 cards in the set, and all four are Triple Rares.',
  },
  {
    q: 'What are the odds of pulling a Triple Rare?',
    a: "Triple Rares make up 2.17% of the print run, going by Pokémon China's print shares. That tier holds the seven illustration full arts, the four Horizons full arts, Nemona and the six Energy cards. With 4 cards in a pack, that averages roughly one Triple Rare in every 12 packs.",
  },
  {
    q: "Why is there a card just called \"Pikachu\" in Captain Pikachu's row?",
    a: 'Two cards in that row, 0706/09 and 0708/09, are an ordinary Pikachu, not Captain Pikachu. 0706/09 is the shiny-style card and 0708/09 is the illustration full art. The names are correct.',
  },
  {
    q: 'Where do the Gem 1 illustrations come from?',
    a: 'Mostly from English cards. 33 of the 38 illustrations we traced are the same art you will find on English Scarlet & Violet cards, nearly half of them from Paldea Evolved.',
    link: { to: '/sets/chinese/gem-vol-1', before: 'See every card on the ', label: 'Gem Vol 1 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-1-release-news')({
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
  component: GemVol1Post,
})

function GemVol1Post() {
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
        lede="The first Simplified Chinese Gem Pack starts with the Paldea starters: 115 all-holo cards across Sprigatito, Fuecoco, Quaxly, their middle evolutions and Captain Pikachu, with four Chinese Exclusive Pokémon Horizons full arts."
        cta={{
          heading: 'Collect Gem Vol 1',
          body: 'Browse all 115 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/gem-vol-1', label: 'See the full card list' }],
        }}
      >
        <p>
          Gem Pack Vol. 1 (Gem 1) landed in mainland China on January 17, 2025, and started the Gem Pack line. It is an official
          Simplified Chinese Pokémon TCG product built for collecting, with small 4-card packs where every card is a holo. This first
          volume is a Paldea set: Sprigatito on the pack, the three starters and their middle evolutions, Captain Pikachu, and four
          new full arts from the Pokémon Horizons anime.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 1 key facts">
          <img src={cardImg('0109')} alt="Sprigatito 0109/09 Horizons full art with Liko, Gem Vol 1" loading="lazy" width={300} height={419} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 1 (宝石包 VOL.1), also called Gemstone Vol. 1</dd>
              <dt>Set code</dt>
              <dd>CBB1C</dd>
              <dt>Released</dt>
              <dd>January 17, 2025, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Set size</dt>
              <dd>115 cards: 16 Pokémon, plus 4 Trainers and 6 Energy</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Four Pokémon Horizons full arts: Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09 and Captain Pikachu 0709/09</dd>
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

        <h2 id="horizons-full-arts">Chinese Exclusives: four Horizons full arts</h2>
        <p>
          The four Chinese Exclusives are new full arts based on the Pokémon Horizons anime. Each one is version 09 of its Pokémon,
          the only version 09 cards in the set, and each carries a small Pokémon Horizons logo. Three of them put the anime cast next
          to their partner Pokémon: Liko with Sprigatito, Roy with Fuecoco and Friede with Captain Pikachu. Quaxly appears with
          Nidothing, the costumed persona Dot streams as.
        </p>
        <div className="card-grid cols-4">
          {HORIZONS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/09 Horizons full art${c.with ? ` with ${c.with}` : ''}, Gem Vol 1`} loading="lazy" width={300} height={419} />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>{c.name}</strong>
                {c.id}/09 · {c.art}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          All four are Triple Rares. Because the art debuts here, Gem Vol 1 is the only place to pull them. The idea came back in{' '}
          <Link to="/blog/gem-vol-5-release-news">Gem Vol 5</Link>, whose four Horizons full arts feature Captain Pikachu again and the
          evolutions of these starters, Floragato, Crocalor and Quaxwell.
        </p>

        <h2 id="full-arts">Seven illustration full arts</h2>
        <p>
          The other big pulls are the version 08 full arts, one for each of the seven long runs. The plain Pikachu runs through a
          flower meadow with Sprigatito and Pawmi. The six starter cards come in pairs that share a scene: Sprigatito curls up among
          potted flowers and Floragato sits in a tree above a white house covered in flowers, Fuecoco rides in a shopping cart and
          Crocalor stands at a fruit stall, and Quaxly and Quaxwell share the same room under a hanging lamp.
        </p>
        <div className="card-grid cols-4">
          {FULL_ARTS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.no} illustration full art, Gem Vol 1`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.no} · Triple Rare
              </figcaption>
            </figure>
          ))}
        </div>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Vol. 1 has 16 Pokémon, and their runs come in three lengths. Sprigatito, Fuecoco, Quaxly and Captain Pikachu have 9 cards each,
          numbered out of 09. Floragato, Crocalor and Quaxwell have 8, numbered out of 08. The other nine Pokémon, Vulpix, Pawmo,
          Fidough, Sudowoodo, Rockruff, Paldean Wooper, Maschiff, Chansey and Lechonk, have 5 cards each, numbered out of 05. Every run
          climbs from Common up through the rarities in order, with no repeats.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col" className="col-versions">
                  Which cards
                </th>
                <th scope="col">In the set</th>
                <th scope="col">Print share</th>
              </tr>
            </thead>
            <tbody>
              {RARITY.map((r) => (
                <tr key={r.label}>
                  <th scope="row">
                    <span className="sym" aria-hidden="true">
                      {r.symbol}
                    </span>{' '}
                    {r.label}
                  </th>
                  <td className="col-versions">{r.which}</td>
                  <td>{r.cards}</td>
                  <td>{r.print}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Print shares are published by Pokémon China. Its chart splits the 18 Triple Rares into 11 illustration full art Pokémon cards,
          4 holo cards without gold stamping and 3 with it. The counts line up with the set: the 11 are the seven version 08 full arts and the four Horizons full arts, the 4 are Nemona and Energy 1801 to 1803, and the 3 appear to be Energy 1804 to 1806, the ones with the Gem Pack logo stamp. The chart itself doesn't name the cards.
        </p>

        <h2 id="sprigatito">Sprigatito's 9 cards</h2>
        <p>
          Sprigatito shows the whole ladder. One base card runs through versions 01 to 05 and 07, picking up a new holo pattern at each
          step and the pink Gem Pack logo stamp at 07. Version 06 is a separate shiny-style card with its own attacks. Then come the
          illustration full art and the Horizons full art.
        </p>
        <div className="card-grid cols-3">
          {SPRIGATITO_SAMPLE.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Sprigatito ${c.id}/09, ${c.label}, Gem Vol 1`} loading="lazy" width={300} height={419} />
              <figcaption>
                {c.exclusive && <ChineseExclusiveBadge />}
                <strong>{c.id}/09</strong>
                {c.label} · {c.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="pikachu">Captain Pikachu and Pikachu</h2>
        <p>
          Captain Pikachu's row holds two different Pokémon. Seven cards are Captain Pikachu, in his captain's hat, with a Pokémon
          Horizons logo on the art. On the base card he leaps toward you under a blue sky while Friede waves behind him. The other
          two, 0706/09 and 0708/09, are named plain Pikachu: the shiny-style card and the meadow full art.
        </p>
        <div className="card-grid cols-3">
          {[
            { id: '0701', name: 'Captain Pikachu', note: 'Base card · Common' },
            { id: '0706', name: 'Pikachu', note: 'Shiny-style card · Rare' },
            { id: '0708', name: 'Pikachu', note: 'Illustration full art · Triple Rare' },
          ].map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/09, Gem Vol 1`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/09 · {c.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Packs can also hold a holo Trainer or Energy card. Poké Ball, Great Ball and Ultra Ball are Double Rares with the Gem Pack
          logo stamp, and Nemona is a full-art Triple Rare, with Pawmi at her shoulder as she throws a Poké Ball. The six Energy cards are
          Basic Grass, Fire and Water Energy, each printed twice, all Triple Rares. The second printing of each, 1804 to 1806, carries
          the Gem Pack logo stamp.
        </p>
        <div className="card-grid cols-4">
          {TRAINERS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/04, Gem Vol 1`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/04 · {c.rarity}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The full lineup: Sprigatito, Floragato, Fuecoco, Crocalor, Quaxly, Quaxwell, Captain Pikachu, Vulpix, Pawmo, Fidough,
          Sudowoodo, Rockruff, Paldean Wooper, Maschiff, Chansey and Lechonk. The <Link to="/sets/chinese/gem-vol-1">full card list</Link>{' '}
          shows all 115 cards.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 1 fits in the Gem Pack line</h2>
        <p>
          Vol. 1 started the Gem Pack line in January 2025, and every volume since has kept the same 4-holo pack. It is still the
          smallest volume at 115 cards.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 1 ? 'is-current' : undefined}>
                  <th scope="row">
                    <Link to={`/sets/chinese/gem-vol-${g.vol}` as never}>Gem Pack Vol. {g.vol}</Link>
                  </th>
                  <td>{g.date}</td>
                  <td>{g.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          For every full art and shiny-style card in one place, the full roster and how to read each version, see our{' '}
          <Link to="/blog/gem-vol-1-set-guide">Gem Vol 1 set guide</Link>. To see which English card each illustration comes from, read
          our <Link to="/blog/gem-vol-1-card-origins">Gem Vol 1 card origins guide</Link>.
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
          Gem Vol 1 is the pick for Paldea starter fans. Every card is a holo, and each starter gets a full run from Common to full art.
          If you only chase one thing, make it the four Horizons full arts. If you like completing runs, Sprigatito's nine cards are a good
          place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
