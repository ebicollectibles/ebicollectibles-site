import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'first-partner-30th-vol-2-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/first-partner-30th-vol-2-${name}.webp`

// Pokémon China's contents list for one box.
const CONTENTS = [
  { item: 'First partner special illustration holo card', qty: '1', note: 'One of 9, picked at random. All 9 are made in equal numbers.' },
  { item: 'Acrylic magnetic card display frame', qty: '1', note: 'Made to hold one of these cards' },
  { item: 'Stellar Crystal booster pack', qty: '1', note: 'Set code CSV9C, 5 cards' },
]

// The 9 cards. Numbers, HP and illustrator read off Pokémon China's card images.
const CARDS = [
  { no: '004/30th-P', name: 'Chikorita', region: 'Johto', type: 'Grass', hp: 70 },
  { no: '005/30th-P', name: 'Cyndaquil', region: 'Johto', type: 'Fire', hp: 70 },
  { no: '006/30th-P', name: 'Totodile', region: 'Johto', type: 'Water', hp: 80 },
  { no: '013/30th-P', name: 'Snivy', region: 'Unova', type: 'Grass', hp: 60 },
  { no: '014/30th-P', name: 'Tepig', region: 'Unova', type: 'Fire', hp: 80 },
  { no: '015/30th-P', name: 'Oshawott', region: 'Unova', type: 'Water', hp: 70 },
  { no: '022/30th-P', name: 'Grookey', region: 'Galar', type: 'Grass', hp: 70 },
  { no: '023/30th-P', name: 'Scorbunny', region: 'Galar', type: 'Fire', hp: 70 },
  { no: '024/30th-P', name: 'Sobble', region: 'Galar', type: 'Water', hp: 70 },
]

const REGIONS = [
  {
    id: 'johto',
    name: 'Johto',
    cards: 'Chikorita 004, Cyndaquil 005, Totodile 006',
    alt: 'Chikorita 004/30th-P, Cyndaquil 005/30th-P and Totodile 006/30th-P side by side among autumn leaves, their illustrations joining into one picture of Johto',
    height: 644,
    text: "Pokémon China's page points to setting out from home in New Bark Town, the Rainbow Wing and Silver Wing that lead to Ho-Oh at the Bell Tower and Lugia at the Whirl Islands, and the climb up Mt. Silver to face a strong trainer at the top. All three cards are full of autumn leaves. Chikorita's card has a rainbow feather, and Totodile's has a silver feather and a red Gyarados.",
  },
  {
    id: 'unova',
    name: 'Unova',
    cards: 'Snivy 013, Tepig 014, Oshawott 015',
    alt: 'Snivy 013/30th-P, Tepig 014/30th-P and Oshawott 015/30th-P side by side over city buildings, their illustrations joining into one picture of Unova',
    height: 646,
    text: "The Unova cards recall Professor Juniper's gift of a first partner, N's castle rising up at the Pokémon League, and the Battle Subway at Gear Station in Nimbasa City. Oshawott's card has the subway trains and a Ferris wheel.",
  },
  {
    id: 'galar',
    name: 'Galar',
    cards: 'Grookey 022, Scorbunny 023, Sobble 024',
    alt: 'Grookey 022/30th-P, Scorbunny 023/30th-P and Sobble 024/30th-P side by side with gym badges, their illustrations joining into one picture of Galar',
    height: 646,
    text: 'The Galar cards recall taking on wild Dynamax Pokémon with friends in the Wild Area, Dynamax battles at Hammerlocke Stadium, and finding the Rusted Sword and Rusted Shield in the Slumbering Weald before the crisis around Eternatus. The cards are dotted with gym badges.',
  },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the First Partner Set Vol.2?' },
  { id: 'contents', label: 'What comes in a box?' },
  { id: 'cards', label: 'All 9 first partner cards' },
  { id: 'odds', label: 'What are the odds?' },
  { id: 'frame', label: 'The magnetic display frame' },
  { id: 'pack', label: 'The Stellar Crystal pack' },
  { id: 'vol-1', label: 'How Vol.2 compares with Vol.1' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese First Partner Set Vol.2?',
    a: 'An official Pokémon TCG blind box from Pokémon China for the 30th anniversary of Pokémon. Its Chinese name is 30周年庆典 最初的伙伴特别插画闪卡套装 Vol.2. Each box holds one random first partner holo card with a new illustration, an acrylic magnetic display frame and one Stellar Crystal booster pack.',
  },
  {
    q: 'When was the First Partner Set Vol.2 released?',
    a: 'June 19, 2026, from 10:00 China time. Pokémon China announced it on May 8, 2026.',
  },
  {
    q: 'Which Pokémon are in Vol.2?',
    a: 'The first partners of three regions. Johto: Chikorita, Cyndaquil and Totodile. Unova: Snivy, Tepig and Oshawott. Galar: Grookey, Scorbunny and Sobble. That is 9 cards, all illustrated by Saboteri.',
  },
  {
    q: 'What are the card numbers?',
    a: 'Chikorita 004/30th-P, Cyndaquil 005/30th-P, Totodile 006/30th-P, Snivy 013/30th-P, Tepig 014/30th-P, Oshawott 015/30th-P, Grookey 022/30th-P, Scorbunny 023/30th-P and Sobble 024/30th-P. Each card is marked PROMO.',
  },
  {
    q: 'Is there a secret card?',
    a: 'Pokémon China lists no secret. It says the 9 cards are made in equal numbers, so each one is about 1 box in 9.',
  },
  {
    q: 'Is the card on the front of the box the one inside?',
    a: 'Not always. Every box shows Totodile on the front, and the box says the card inside may not be the one shown.',
  },
  {
    q: 'How is Vol.2 different from Vol.1?',
    a: 'Only the Pokémon and the pack. Vol.1, released on March 20, 2026, has the Kanto, Sinnoh and Alola first partners with a Brilliant Fantasy pack. Vol.2 has Johto, Unova and Galar with a Stellar Crystal pack. The box layout, the display frame and the 1 in 9 odds are the same.',
  },
  {
    q: 'Is this set sold under other names?',
    a: 'Yes. Pokémon China gives it no English name, so shops translate it differently. We list it as First Partner 30th Celebration Volume 2.',
  },
]

export const Route = createFileRoute('/blog/first-partner-30th-vol-2-release-news')({
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
  component: FirstPartnerVol2Post,
})

function FirstPartnerVol2Post() {
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
  const cardsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All 9 cards in the Chinese First Partner Set Vol.2',
    numberOfItems: CARDS.length,
    itemListElement: CARDS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name} ${c.no}, ${c.region}` })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(cardsJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China's First Partner Set Vol.2 released on June 19, 2026. Each blind box holds one of 9 new first partner cards from Johto, Unova and Galar, a magnetic acrylic display frame and a Stellar Crystal booster pack."
        cta={{
          heading: 'Shop the First Partner Set Vol.2',
          body: 'One random first partner card, its display frame and a Stellar Crystal pack in every box.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol2' }, label: 'Shop the Vol.2 blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol1' }, label: 'Shop Vol.1', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the First Partner Set Vol.2?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG blind box from Pokémon China, made for the 30th anniversary of Pokémon. Its
          Chinese name is <Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.2</Zh>, which translates as 30th Celebration First Partner Special
          Illustration Holo Card Set Vol.2. It went on sale on June 19, 2026, from 10:00 China time.
        </p>
        <p>
          Vol.2 has 9 new holo cards of the first partner Pokémon from Johto, Unova and Galar, and each box holds one of them at random.
          Every card is full of small details from that region's games, and the three cards from one region join into one long picture
          when you put them side by side.
        </p>

        <aside className="fact-box" aria-label="First Partner Set Vol.2 key facts">
          <img src={img('box')} alt="The First Partner Set Vol.2 box, with the Totodile card on the front" loading="lazy" width={600} height={1109} style={{ background: 'transparent', boxShadow: 'none' }} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                First Partner Special Illustration Set Vol.2 (<Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.2</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>June 19, 2026, 10:00 China time</dd>
              <dt>Cards</dt>
              <dd>9 first partners from Johto, Unova and Galar, 1 per box</dd>
              <dt>Numbers</dt>
              <dd>004 to 006, 013 to 015 and 022 to 024/30th-P</dd>
              <dt>Odds</dt>
              <dd>Made in equal numbers, about 1 box in 9 each. No secret listed.</dd>
              <dt>Set code</dt>
              <dd>CSV9C (the Stellar Crystal pack inside)</dd>
              <dt>Booster packs</dt>
              <dd>1 pack of Stellar Crystal, 5 cards</dd>
              <dt>Extra</dt>
              <dd>Acrylic magnetic card display frame</dd>
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

        <h2 id="contents">What comes in a box?</h2>
        <p>Pokémon China lists three items in each box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each First Partner Set Vol.2 box
            </caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {CONTENTS.map((c) => (
                <tr key={c.item}>
                  <th scope="row">{c.item}</th>
                  <td>{c.qty}</td>
                  <td>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Every box shows the Totodile card on the front, but the box itself says the card inside may not be the one shown. The front also
          says there are 9 designs, made in equal numbers, with one inside at random.
        </p>

        <h2 id="cards">All 9 first partner cards</h2>
        <p>
          All 9 cards are Basic Pokémon, marked PROMO, and all are illustrated by Saboteri. Each has a 30th anniversary Pikachu mark on
          the right. Pokémon China describes them as new illustrations and invites you to spot the places and items from each region's
          games.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-cards" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-cards" className="sr-only">
              The 9 cards in the First Partner Set Vol.2
            </caption>
            <thead>
              <tr>
                <th scope="col">Number</th>
                <th scope="col">Pokémon</th>
                <th scope="col">Region</th>
                <th scope="col">Type</th>
                <th scope="col">HP</th>
              </tr>
            </thead>
            <tbody>
              {CARDS.map((c) => (
                <tr key={c.no}>
                  <th scope="row">{c.no}</th>
                  <td>{c.name}</td>
                  <td>{c.region}</td>
                  <td>{c.type}</td>
                  <td>{c.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {REGIONS.map((r) => (
          <div key={r.id}>
            <h3 id={r.id}>{r.name}: {r.cards}</h3>
            <p>{r.text}</p>
            <figure style={{ margin: '20px 0 28px' }}>
              <img src={img(r.id)} alt={r.alt} loading="lazy" width={1400} height={r.height} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
            </figure>
          </div>
        ))}

        <h2 id="odds">What are the odds?</h2>
        <p>
          Pokémon China says the 9 cards are made in equal numbers and each box holds one at random. That makes each card about 1 box in 9
          on average, and a full set takes at least 9 boxes. Pokémon China lists no secret card for Vol.2, the same as Vol.1.
        </p>

        <h2 id="frame">The magnetic display frame</h2>
        <p>
          Each box has an acrylic magnetic card display frame, which Pokémon China says is made to hold and show these cards. The frame is
          clear, with a silver band at the top carrying the 30th anniversary Pikachu mark.
        </p>
        <p>
          Pokémon China says the frame holds firmly to iron surfaces, and that frames link side by side with their magnets. Line up the
          three cards from one region and their illustrations join up across the frames. Pokémon China does not give the frame's size.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('display-frame')} alt="The empty acrylic display frame: clear, with the 30th anniversary Pikachu mark on a silver band at the top" loading="lazy" width={518} height={900} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Display frame</strong>1 in every box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pack')} alt="The Stellar Crystal booster pack, set code CSV9C, with Stellar Tera Pikachu on the front" loading="lazy" width={479} height={900} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Stellar Crystal pack</strong>CSV9C · 5 cards
              </figcaption>
            </figure>
          </li>
        </ul>
        <figure style={{ margin: '24px 0 30px' }}>
          <img src={img('frames-linked')} alt="Chikorita, Cyndaquil and Totodile in three display frames joined side by side, making one long Johto picture" loading="lazy" width={1400} height={800} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
        </figure>

        <h2 id="pack">The Stellar Crystal pack</h2>
        <p>
          Each box also holds one pack of Stellar Crystal (<Zh>星彩晶璃</Zh>), set code CSV9C, with 5 cards. Stellar Crystal released on May
          15, 2026, with Stellar Tera Pikachu on the pack. Our{' '}
          <Link to="/blog/stellar-crystal-release-news">Stellar Crystal release post</Link> covers the set, and the{' '}
          <Link to="/sets/chinese/stellar-crystal-csv9">Stellar Crystal card list</Link> shows every card you can pull.
        </p>

        <h2 id="vol-1">How Vol.2 compares with Vol.1</h2>
        <p>
          Vol.2 follows the <Link to="/blog/first-partner-30th-vol-1-release-news">First Partner Set Vol.1</Link>, which released on March
          20, 2026 with the first partners of Kanto, Sinnoh and Alola and a Brilliant Fantasy pack. Vol.2 keeps the same box, the same
          display frame and the same odds, with three new regions and a Stellar Crystal pack.
        </p>
        <p>
          The cards are numbered in region order. Vol.1 has 001 to 003, 010 to 012 and 019 to 021, and Vol.2 has 004 to 006, 013 to 015 and
          022 to 024. Saboteri illustrated every card in both sets.
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
          Vol.2 keeps everything that made Vol.1 good: cards packed with nods to their region, and frames that turn each set of three into
          one picture. The autumn Johto cards are our pick of this set.
        </p>
      </BlogPostLayout>
    </>
  )
}
