import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'first-partner-30th-vol-3-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/first-partner-30th-vol-3-${name}.webp`

// Pokémon China's contents list for one box.
const CONTENTS = [
  { item: 'First partner special illustration holo card', qty: '1', note: 'One of 9, picked at random. All 9 are made in equal numbers.' },
  { item: 'Acrylic magnetic card display frame', qty: '1', note: 'Made to hold one of these cards' },
  { item: 'Chasing Glory booster pack', qty: '1', note: 'Set code CSV10C, 5 cards' },
]

// The 9 cards. Numbers, HP and illustrator read off Pokémon China's card images.
const CARDS = [
  { no: '007/30th-P', name: 'Treecko', region: 'Hoenn', type: 'Grass', hp: 70 },
  { no: '008/30th-P', name: 'Torchic', region: 'Hoenn', type: 'Fire', hp: 60 },
  { no: '009/30th-P', name: 'Mudkip', region: 'Hoenn', type: 'Water', hp: 70 },
  { no: '016/30th-P', name: 'Chespin', region: 'Kalos', type: 'Grass', hp: 70 },
  { no: '017/30th-P', name: 'Fennekin', region: 'Kalos', type: 'Fire', hp: 70 },
  { no: '018/30th-P', name: 'Froakie', region: 'Kalos', type: 'Water', hp: 70 },
  { no: '025/30th-P', name: 'Sprigatito', region: 'Paldea', type: 'Grass', hp: 70 },
  { no: '026/30th-P', name: 'Fuecoco', region: 'Paldea', type: 'Fire', hp: 90 },
  { no: '027/30th-P', name: 'Quaxly', region: 'Paldea', type: 'Water', hp: 70 },
]

const REGIONS = [
  {
    id: 'hoenn',
    name: 'Hoenn',
    cards: 'Treecko 007, Torchic 008, Mudkip 009',
    alt: 'Treecko 007/30th-P, Torchic 008/30th-P and Mudkip 009/30th-P side by side, their illustrations joining into one picture of Hoenn',
    height: 646,
    text: "Pokémon China's page points to moving to Littleroot Town and helping Professor Birch, stopping Team Magma or Team Aqua on Mt. Chimney, the hot springs in Lavaridge Town, the strange weather from Groudon and Kyogre, and meeting Rayquaza at the top of Sky Pillar. Treecko's card has two bicycles, and Torchic's has a hot spring and a beach.",
  },
  {
    id: 'kalos',
    name: 'Kalos',
    cards: 'Chespin 016, Fennekin 017, Froakie 018',
    alt: 'Chespin 016/30th-P, Fennekin 017/30th-P and Froakie 018/30th-P side by side among hats, coats and shoes, their illustrations joining into one picture of Kalos',
    height: 646,
    text: "Pokémon China calls Kalos the region full of fashion, and the cards are scattered with hats, coats, shoes and a handbag. They also recall getting a Mega Ring and Mega Stones for Mega Evolution, stopping Team Flare, and facing the Elite Four and Champion Diantha at the Pokémon League.",
  },
  {
    id: 'paldea',
    name: 'Paldea',
    cards: 'Sprigatito 025, Fuecoco 026, Quaxly 027',
    alt: 'Sprigatito 025/30th-P, Fuecoco 026/30th-P and Quaxly 027/30th-P side by side, their illustrations joining into one picture of Paldea',
    height: 646,
    text: "The Paldea cards recall getting the Tera Orb and Terastallizing, riding Koraidon or Miraidon across Paldea, picnics with homemade sandwiches, and the mysterious Pokémon of Area Zero from the old expedition journal. Sprigatito's card has Koraidon and a sandwich, and Quaxly's has a book.",
  },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the First Partner Set Vol.3?' },
  { id: 'contents', label: 'What comes in a box?' },
  { id: 'cards', label: 'All 9 first partner cards' },
  { id: 'odds', label: 'What are the odds?' },
  { id: 'frame', label: 'The magnetic display frame' },
  { id: 'pack', label: 'The Chasing Glory pack' },
  { id: 'earlier', label: 'Vol.1 and Vol.2' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese First Partner Set Vol.3?',
    a: 'An official Pokémon TCG blind box from Pokémon China for the 30th anniversary of Pokémon. Its Chinese name is 30周年庆典 最初的伙伴特别插画闪卡套装 Vol.3. Each box holds one random first partner holo card with a new illustration, an acrylic magnetic display frame and one Chasing Glory booster pack.',
  },
  {
    q: 'When was the First Partner Set Vol.3 released?',
    a: 'August 7, 2026, from 10:00 China time. Pokémon China announced it on July 17, 2026.',
  },
  {
    q: 'Which Pokémon are in Vol.3?',
    a: 'The first partners of three regions. Hoenn: Treecko, Torchic and Mudkip. Kalos: Chespin, Fennekin and Froakie. Paldea: Sprigatito, Fuecoco and Quaxly. That is 9 cards, all illustrated by Saboteri.',
  },
  {
    q: 'What are the card numbers?',
    a: 'Treecko 007/30th-P, Torchic 008/30th-P, Mudkip 009/30th-P, Chespin 016/30th-P, Fennekin 017/30th-P, Froakie 018/30th-P, Sprigatito 025/30th-P, Fuecoco 026/30th-P and Quaxly 027/30th-P. Each card is marked PROMO.',
  },
  {
    q: 'Is there a secret card?',
    a: 'Pokémon China lists no secret. It says the 9 cards are made in equal numbers, so each one is about 1 box in 9.',
  },
  {
    q: 'Is the card on the front of the box the one inside?',
    a: 'Not always. Every box shows Torchic on the front, and the box says the card inside may not be the one shown.',
  },
  {
    q: 'How is Vol.3 different from Vol.1 and Vol.2?',
    a: 'Only the Pokémon and the pack. Vol.1 (March 20, 2026) has Kanto, Sinnoh and Alola with a Brilliant Fantasy pack. Vol.2 (June 19, 2026) has Johto, Unova and Galar with a Stellar Crystal pack. Vol.3 has Hoenn, Kalos and Paldea with a Chasing Glory pack. The box layout, the display frame and the 1 in 9 odds are the same in all three.',
  },
  {
    q: 'Is this set sold under other names?',
    a: 'Yes. Pokémon China gives it no English name, so shops translate it differently. We list it as First Partner 30th Celebration Volume 3.',
  },
]

export const Route = createFileRoute('/blog/first-partner-30th-vol-3-release-news')({
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
  component: FirstPartnerVol3Post,
})

function FirstPartnerVol3Post() {
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
    name: 'All 9 cards in the Chinese First Partner Set Vol.3',
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
        lede="Pokémon China's First Partner Set Vol.3 released on August 7, 2026. Each blind box holds one of 9 new first partner cards from Hoenn, Kalos and Paldea, a magnetic acrylic display frame and a Chasing Glory booster pack."
        cta={{
          heading: 'Shop the First Partner Set Vol.3',
          body: 'One random first partner card, its display frame and a Chasing Glory pack in every box.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol3' }, label: 'Shop the Vol.3 blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol2' }, label: 'Shop Vol.2', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol1' }, label: 'Shop Vol.1', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the First Partner Set Vol.3?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG blind box from Pokémon China, made for the 30th anniversary of Pokémon. Its
          Chinese name is <Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.3</Zh>, which translates as 30th Celebration First Partner Special
          Illustration Holo Card Set Vol.3. It went on sale on August 7, 2026, from 10:00 China time.
        </p>
        <p>
          Vol.3 has 9 new holo cards of the first partner Pokémon from Hoenn, Kalos and Paldea, and each box holds one of them at random.
          Every card is full of small details from that region's games, and the three cards from one region join into one long picture
          when you put them side by side.
        </p>

        <aside className="fact-box" aria-label="First Partner Set Vol.3 key facts">
          <img src={img('box')} alt="The First Partner Set Vol.3 box, with the Torchic card on the front" loading="lazy" width={600} height={1105} style={{ background: 'transparent', boxShadow: 'none' }} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                First Partner Special Illustration Set Vol.3 (<Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.3</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>August 7, 2026, 10:00 China time</dd>
              <dt>Cards</dt>
              <dd>9 first partners from Hoenn, Kalos and Paldea, 1 per box</dd>
              <dt>Numbers</dt>
              <dd>007 to 009, 016 to 018 and 025 to 027/30th-P</dd>
              <dt>Odds</dt>
              <dd>Made in equal numbers, about 1 box in 9 each. No secret listed.</dd>
              <dt>Set code</dt>
              <dd>CSV10C (the Chasing Glory pack inside)</dd>
              <dt>Booster packs</dt>
              <dd>1 pack of Chasing Glory, 5 cards</dd>
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
              Contents of each First Partner Set Vol.3 box
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
          Every box shows the Torchic card on the front, but the box itself says the card inside may not be the one shown. The front also
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
              The 9 cards in the First Partner Set Vol.3
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
          on average, and a full set takes at least 9 boxes. Pokémon China lists no secret card for Vol.3, the same as Vol.1 and Vol.2.
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
              <img src={img('pack')} alt="The Chasing Glory booster pack, set code CSV10C, with Giovanni and Mewtwo on the front" loading="lazy" width={479} height={900} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Chasing Glory pack</strong>CSV10C · 5 cards
              </figcaption>
            </figure>
          </li>
        </ul>
        <figure style={{ margin: '24px 0 30px' }}>
          <img src={img('frames-linked')} alt="Treecko, Torchic and Mudkip in three display frames joined side by side, making one long Hoenn picture" loading="lazy" width={1400} height={788} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
        </figure>

        <h2 id="pack">The Chasing Glory pack</h2>
        <p>
          Each box also holds one pack of Chasing Glory (<Zh>共逐荣光</Zh>), set code CSV10C, with 5 cards. Chasing Glory released on July 16,
          2026, with Giovanni and Mewtwo on the pack. Our{' '}
          <Link to="/blog/chasing-glory-release-news">Chasing Glory release post</Link> covers the set, and the{' '}
          <Link to="/sets/chinese/chasing-glory-csv10">Chasing Glory card list</Link> shows every card you can pull.
        </p>

        <h2 id="earlier">Vol.1 and Vol.2</h2>
        <p>
          Vol.3 follows two earlier sets with the same box, the same display frame and the same odds. The{' '}
          <Link to="/blog/first-partner-30th-vol-1-release-news">First Partner Set Vol.1</Link> released on March 20, 2026 with Kanto,
          Sinnoh and Alola and a Brilliant Fantasy pack. The{' '}
          <Link to="/blog/first-partner-30th-vol-2-release-news">First Partner Set Vol.2</Link> released on June 19, 2026 with Johto, Unova
          and Galar and a Stellar Crystal pack.
        </p>
        <p>
          With Vol.3, the three sets hold the first partners of all nine regions: 27 cards, numbered 001 to 027/30th-P in region order.
          Kanto is 001 to 003, Johto 004 to 006, Hoenn 007 to 009, and so on to Paldea at 025 to 027. Saboteri illustrated all 27.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-vols" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-vols" className="sr-only">
              The three First Partner sets side by side
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Released</th>
                <th scope="col">Regions</th>
                <th scope="col">Pack inside</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Vol.1</th>
                <td>March 20, 2026</td>
                <td>Kanto, Sinnoh, Alola</td>
                <td>Brilliant Fantasy (CSV8C)</td>
              </tr>
              <tr>
                <th scope="row">Vol.2</th>
                <td>June 19, 2026</td>
                <td>Johto, Unova, Galar</td>
                <td>Stellar Crystal (CSV9C)</td>
              </tr>
              <tr>
                <th scope="row">Vol.3</th>
                <td>August 7, 2026</td>
                <td>Hoenn, Kalos, Paldea</td>
                <td>Chasing Glory (CSV10C)</td>
              </tr>
            </tbody>
          </table>
        </div>

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
          Vol.3 brings the first partners of all nine regions together. The cards are as full of detail as the first two sets, and with 27
          frames you can line up every region. Pick a box for your own first partner, or collect the region you started in.
        </p>
      </BlogPostLayout>
    </>
  )
}
