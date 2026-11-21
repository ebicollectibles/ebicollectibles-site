import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'first-partner-30th-vol-1-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/first-partner-30th-vol-1-${name}.webp`

// Pokémon China's contents list for one box.
const CONTENTS = [
  { item: 'First partner special illustration holo card', qty: '1', note: 'One of 9, picked at random. All 9 are made in equal numbers.' },
  { item: 'Acrylic magnetic card display frame', qty: '1', note: 'Made to hold one of these cards' },
  { item: 'Brilliant Fantasy booster pack', qty: '1', note: 'Set code CSV8C, 5 cards' },
]

// The 9 cards. Numbers, HP and illustrator read off Pokémon China's card images.
const CARDS = [
  { no: '001/30th-P', name: 'Bulbasaur', region: 'Kanto', type: 'Grass', hp: 80 },
  { no: '002/30th-P', name: 'Charmander', region: 'Kanto', type: 'Fire', hp: 80 },
  { no: '003/30th-P', name: 'Squirtle', region: 'Kanto', type: 'Water', hp: 80 },
  { no: '010/30th-P', name: 'Turtwig', region: 'Sinnoh', type: 'Grass', hp: 90 },
  { no: '011/30th-P', name: 'Chimchar', region: 'Sinnoh', type: 'Fire', hp: 60 },
  { no: '012/30th-P', name: 'Piplup', region: 'Sinnoh', type: 'Water', hp: 70 },
  { no: '019/30th-P', name: 'Rowlet', region: 'Alola', type: 'Grass', hp: 70 },
  { no: '020/30th-P', name: 'Litten', region: 'Alola', type: 'Fire', hp: 70 },
  { no: '021/30th-P', name: 'Popplio', region: 'Alola', type: 'Water', hp: 70 },
]

const REGIONS = [
  {
    id: 'kanto',
    name: 'Kanto',
    cards: 'Bulbasaur 001, Charmander 002, Squirtle 003',
    alt: 'Bulbasaur 001/30th-P, Charmander 002/30th-P and Squirtle 003/30th-P side by side, their illustrations joining into one picture of Kanto',
    height: 646,
    text: "Pokémon China's page points to setting out from home in Pallet Town, Professor Oak's lab, a sleeping Snorlax blocking the road and the S.S. Anne. Bulbasaur's card has a red Pokédex, and Squirtle's has the ship and a bicycle.",
  },
  {
    id: 'sinnoh',
    name: 'Sinnoh',
    cards: 'Turtwig 010, Chimchar 011, Piplup 012',
    alt: 'Turtwig 010/30th-P, Chimchar 011/30th-P and Piplup 012/30th-P side by side, their illustrations joining into one picture of Sinnoh',
    height: 646,
    text: "The Sinnoh cards recall the Starly attack at Lake Verity, digging for treasure and building secret bases in the Underground, and the climb up Mt. Coronet to Spear Pillar, where Piplup's card shows the stone columns.",
  },
  {
    id: 'alola',
    name: 'Alola',
    cards: 'Rowlet 019, Litten 020, Popplio 021',
    alt: 'Rowlet 019/30th-P, Litten 020/30th-P and Popplio 021/30th-P side by side, their illustrations joining into one picture of Alola',
    height: 646,
    text: 'The Alola cards recall moving to Melemele Island, the island challenge, the Ultra Beasts coming through Ultra Wormholes, and the altar on Poni Island where Lillie and the player play the Sun Flute and Moon Flute.',
  },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the First Partner Set Vol.1?' },
  { id: 'contents', label: 'What comes in a box?' },
  { id: 'cards', label: 'All 9 first partner cards' },
  { id: 'odds', label: 'What are the odds?' },
  { id: 'frame', label: 'The magnetic display frame' },
  { id: 'pack', label: 'The Brilliant Fantasy pack' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese First Partner Set Vol.1?',
    a: 'An official Pokémon TCG blind box from Pokémon China for the 30th anniversary of Pokémon. Its Chinese name is 30周年庆典 最初的伙伴特别插画闪卡套装 Vol.1. Each box holds one random first partner holo card with a new illustration, an acrylic magnetic display frame and one Brilliant Fantasy booster pack.',
  },
  {
    q: 'When was the First Partner Set Vol.1 released?',
    a: 'March 20, 2026, from 10:00 China time. Pokémon China announced it on February 9, 2026.',
  },
  {
    q: 'Which Pokémon are in Vol.1?',
    a: 'The first partners of three regions. Kanto: Bulbasaur, Charmander and Squirtle. Sinnoh: Turtwig, Chimchar and Piplup. Alola: Rowlet, Litten and Popplio. That is 9 cards, all illustrated by Saboteri.',
  },
  {
    q: 'What are the card numbers?',
    a: 'Bulbasaur 001/30th-P, Charmander 002/30th-P, Squirtle 003/30th-P, Turtwig 010/30th-P, Chimchar 011/30th-P, Piplup 012/30th-P, Rowlet 019/30th-P, Litten 020/30th-P and Popplio 021/30th-P. Each card is marked PROMO.',
  },
  {
    q: 'Is there a secret card?',
    a: 'Pokémon China lists no secret. It says the 9 cards are made in equal numbers, so each one is about 1 box in 9.',
  },
  {
    q: 'Is the card on the front of the box the one inside?',
    a: 'Not always. Every box shows Bulbasaur on the front, and the box says the card inside may not be the one shown.',
  },
  {
    q: 'Can the cards be played?',
    a: 'Yes. Pokémon China says all the special illustration cards in this set can be used in the Standard format.',
  },
  {
    q: 'Is this set sold under other names?',
    a: 'Yes. Pokémon China gives it no English name, so shops translate it differently. We list it as First Partner 30th Celebration Volume 1.',
  },
]

export const Route = createFileRoute('/blog/first-partner-30th-vol-1-release-news')({
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
  component: FirstPartnerVol1Post,
})

function FirstPartnerVol1Post() {
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
    name: 'All 9 cards in the Chinese First Partner Set Vol.1',
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
        lede="Pokémon China's First Partner Set Vol.1 released on March 20, 2026. Each blind box holds one of 9 new first partner cards from Kanto, Sinnoh and Alola, a magnetic acrylic display frame and a Brilliant Fantasy booster pack."
        cta={{
          heading: 'Shop the First Partner Set Vol.1',
          body: 'One random first partner card, its display frame and a Brilliant Fantasy pack in every box.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-first-partner-30th-celebration-vol1' }, label: 'Shop the Vol.1 blind box' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the First Partner Set Vol.1?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG blind box from Pokémon China, made for the 30th anniversary of Pokémon. Its
          Chinese name is <Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.1</Zh>, which translates as 30th Celebration First Partner Special
          Illustration Holo Card Set Vol.1. It went on sale on March 20, 2026, from 10:00 China time.
        </p>
        <p>
          Vol.1 has 9 new holo cards of the first partner Pokémon from Kanto, Sinnoh and Alola, and each box holds one of them at random.
          Every card is full of small details from that region's games, and the three cards from one region join into one long picture
          when you put them side by side.
        </p>

        <aside className="fact-box" aria-label="First Partner Set Vol.1 key facts">
          <img src={img('box')} alt="The First Partner Set Vol.1 box, with the Bulbasaur card on the front" loading="lazy" width={600} height={1110} style={{ background: 'transparent', boxShadow: 'none' }} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                First Partner Special Illustration Set Vol.1 (<Zh>30周年庆典 最初的伙伴特别插画闪卡套装 Vol.1</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>March 20, 2026, 10:00 China time</dd>
              <dt>Cards</dt>
              <dd>9 first partners from Kanto, Sinnoh and Alola, 1 per box</dd>
              <dt>Numbers</dt>
              <dd>001 to 003, 010 to 012 and 019 to 021/30th-P</dd>
              <dt>Odds</dt>
              <dd>Made in equal numbers, about 1 box in 9 each. No secret listed.</dd>
              <dt>Set code</dt>
              <dd>CSV8C (the Brilliant Fantasy pack inside)</dd>
              <dt>Booster packs</dt>
              <dd>1 pack of Brilliant Fantasy, 5 cards</dd>
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
              Contents of each First Partner Set Vol.1 box
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
          Every box shows the Bulbasaur card on the front, but the box itself says the card inside may not be the one shown. The front also
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
              The 9 cards in the First Partner Set Vol.1
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
          on average, and a full set takes at least 9 boxes. Pokémon China lists no secret card for Vol.1.
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
              <img src={img('pack')} alt="The Brilliant Fantasy booster pack, set code CSV8C, with Milotic on the front" loading="lazy" width={479} height={900} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Brilliant Fantasy pack</strong>CSV8C · 5 cards
              </figcaption>
            </figure>
          </li>
        </ul>
        <figure style={{ margin: '24px 0 30px' }}>
          <img src={img('frames-linked')} alt="Bulbasaur, Charmander and Squirtle in three display frames joined side by side, making one long Kanto picture" loading="lazy" width={1400} height={810} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
        </figure>

        <h2 id="pack">The Brilliant Fantasy pack</h2>
        <p>
          Each box also holds one pack of Brilliant Fantasy (<Zh>璀璨诡幻</Zh>), set code CSV8C, with 5 cards. Brilliant Fantasy released one
          week earlier, on March 13, 2026, with Milotic on the pack. Our{' '}
          <Link to="/blog/brilliant-fantasy-release-news">Brilliant Fantasy release post</Link> covers the set, and the{' '}
          <Link to="/sets/chinese/brilliant-fantasy-csv8">Brilliant Fantasy card list</Link> shows every card you can pull.
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
          This is a small box with a lot of care in it. Every card is packed with nods to its region, and the frames turn each set of three
          into one picture. Pick a box for your own first partner, or collect a whole region and line them up.
        </p>
      </BlogPostLayout>
    </>
  )
}
