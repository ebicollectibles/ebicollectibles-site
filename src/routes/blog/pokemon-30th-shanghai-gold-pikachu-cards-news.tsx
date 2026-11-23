import { Zh, zh } from '~/components/blog/Zh'
import { BlogEmailSignup } from '~/components/blog/BlogEmailSignup'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'pokemon-30th-shanghai-gold-pikachu-cards-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/shanghai-gold-pikachu-cards-${name}.webp`

// The four activities on the official event poster, in its order.
const ACTIVITIES = [
  { name: 'Pokémon meet-and-greet', zh: '宝可梦们来啦', text: 'Take photos with nearly 30 different Pokémon.' },
  { name: 'Stamp rally', zh: '集章之旅', text: 'There are 30 different stamps to collect.' },
  { name: 'Pokémon Card Art Illustration Exhibition', zh: '宝可梦卡牌艺术插画展', text: '30 pure gold cards will also be on display.' },
  { name: 'Pokémon card faction battle', zh: '宝可梦卡牌阵营赛', text: 'Pick a faction and challenge the champion.' },
]

// Three of the 30 Pikachu cards in the Simplified Chinese 30th Celebration set.
const PIKACHU_CARDS = [
  { file: 'pikachu-034', w: 300, h: 419, no: '034/103', of: '18/30', illus: 'Shinji Kanda', alt: 'Pikachu 034/103 (18/30) from 30th Celebration: Pikachu in a bright rainbow burst of color, illustrated by Shinji Kanda' },
  { file: 'pikachu-021', w: 300, h: 419, no: '021/103', of: '05/30', illus: 'Asako Ito', alt: 'Pikachu 021/103 (05/30) from 30th Celebration: a crochet-style Pikachu napping on the grass, illustrated by Asako Ito' },
  { file: 'pikachu-024', w: 300, h: 419, no: '024/103', of: '08/30', illus: 'DOM', alt: 'Pikachu 024/103 (08/30) from 30th Celebration: Pikachu glowing with lightning at night, illustrated by DOM' },
  { file: 'pikachu-036', w: 300, h: 419, no: '036/103', of: '20/30', illus: 'Akira', alt: 'Pikachu 036/103 (20/30) from 30th Celebration: Pikachu running through a field under a bright sky, illustrated by Akira' },
  { file: 'pikachu-017', w: 300, h: 419, no: '017/103', of: '01/30', illus: 'Ken Sugimori', alt: 'Pikachu 017/103 (01/30) from 30th Celebration: a round, classic-style Pikachu standing in a forest with lightning, illustrated by Ken Sugimori' },
  { file: 'pikachu-030', w: 788, h: 1100, no: '030/103', of: '14/30', illus: 'OKACHEKE', alt: 'Pikachu 030/103 (14/30) from 30th Celebration: Pikachu leaning on a wooden balcony rail and smiling, illustrated by OKACHEKE' },
]

const FAQ = [
  {
    q: 'What is the Pokémon 30th Anniversary Shanghai Finale?',
    a: 'An event in Shanghai from Pokémon China for the 30th anniversary of Pokémon. Its Chinese name is 宝可梦30周年上海盛典. The poster lists four activities: a Pokémon meet-and-greet, a stamp rally, a card art exhibition and a card faction battle.',
  },
  {
    q: 'When is the Shanghai Finale?',
    a: 'From Saturday, November 28, 2026 to Sunday, January 3, 2027. The poster says some activities end on December 27, 2026.',
  },
  {
    q: 'Will there be real gold Pokémon cards at the event?',
    a: 'Yes. The official poster says 30 pure gold (足金) cards will be on display at the Pokémon Card Art Illustration Exhibition.',
  },
  {
    q: 'Are the gold cards Pikachu cards?',
    a: 'The poster does not say. Photos shared online show card designs that appear to match the 30 Pikachu illustrations from the 30th Celebration set.',
  },
  {
    q: 'How much gold is in each card?',
    a: 'Pokémon China has not said. A display board in photos shared online reads 30 g per card. If that is right, the 30 cards hold 900 g of gold in all.',
  },
  {
    q: 'Is one gold card worth ¥600,000?',
    a: 'No. A widely shared post puts the gold value at about ¥600,000, based on gold prices on November 23. That only adds up for all 30 cards together, at about ¥667 per gram. It is not an official figure.',
  },
  {
    q: 'How can I get more news like this?',
    a: 'Join the email list in the More Pokémon China news section of this post.',
  },
  {
    q: 'Can you buy the gold cards?',
    a: 'Nothing has been announced. The poster presents them as an exhibition display.',
  },
  {
    q: 'Where in Shanghai is the event, and do you need a ticket?',
    a: 'The card art exhibition is at the Lafayette Cultural & Art Center, 323 Fuxing Middle Road, Huangpu District, from November 28 to December 27, 2026. Entry is free, but you must book ahead. Bookings open in batches, the first on November 25 at 3:00 pm China time.',
  },
]

export const Route = createFileRoute('/blog/pokemon-30th-shanghai-gold-pikachu-cards-news')({
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
  component: ShanghaiGoldCardsPost,
})

function ShanghaiGoldCardsPost() {
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
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Pokémon 30th Anniversary Shanghai Finale',
    alternateName: '宝可梦30周年上海盛典',
    startDate: '2026-11-28',
    endDate: '2027-01-03',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Lafayette Cultural & Art Center', address: { '@type': 'PostalAddress', streetAddress: '323 Fuxing Middle Road, Huangpu District', addressLocality: 'Shanghai', addressCountry: 'CN' } },
    isAccessibleForFree: true,
    organizer: { '@type': 'Organization', name: 'Pokémon China' },
    image: img('event-poster'),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China will display 30 pure gold cards at the Pokémon 30th Anniversary Shanghai Finale, from November 28, 2026 to January 3, 2027."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'The booster box, the Dream Painting Pikachu figures and the Pikachu 30th plush keychains.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/blog/30th-celebration-set-guide', label: 'Read the 30th Celebration set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          <strong>SHANGHAI, November 23, 2026</strong> — Pokémon China will put 30 pure gold cards on display at the Pokémon 30th
          Anniversary Shanghai Finale (<Zh>宝可梦30周年上海盛典</Zh>), its big end-of-year celebration of Pokémon's 30th anniversary. The
          event runs from Saturday, November 28, 2026 to Sunday, January 3, 2027.
        </p>
        <p>
          The official event poster lists the cards as part of the Pokémon Card Art Illustration Exhibition:{' '}
          <Zh>还有30张足金卡牌展出哦</Zh>, "30 pure gold cards will also be on display." <Zh>足金</Zh> is the term used in China for pure
          gold.
        </p>
        <p>
          Photos shared online show gold Pikachu cards marked "999" and "30g", with designs that match the 30 Pikachu cards in the 30th
          Celebration expansion. Pokémon China has not confirmed the designs or the weight.
        </p>
        <p>
          The banner above is our illustration: printed 30th Celebration Pikachu cards with a gold border added. It is not a photo of the
          gold cards, which are made of gold.
        </p>
        <p>
          <strong>Want more Pokémon China news like this?</strong> <a href="#news-signup">Join our email list</a>.
        </p>

        <div className="poster-pair">
          <div className="poster-pair-grid">
            <figure>
              <img
                src={img('event-poster')}
                alt="The official Pokémon 30th Anniversary Shanghai Finale poster in Chinese: Pikachu in a white hat and tuxedo and Totodile in a bow tie run out of a splash of water, with a shark Pokémon and Cramorant on either side, the Shanghai skyline behind them, the dates across the top and the four activities listed along the bottom"
                width={813}
                height={1186}
                style={{ width: '100%', height: 'auto', borderRadius: 10 }}
              />
              <figcaption>Chinese poster</figcaption>
            </figure>
            <figure>
              <img
                src={img('event-poster-en')}
                alt="The same poster with its Chinese text translated into English: Shanghai, Nov 28, 2026 to Jan 3, 2027, some activities end Dec 27, 2026, and the four activities, including the Pokémon Card Art Illustration Exhibition with 30 pure gold cards on display"
                width={1626}
                height={2372}
                style={{ width: '100%', height: 'auto', borderRadius: 10 }}
              />
              <figcaption>English poster</figcaption>
            </figure>
          </div>
        </div>

        <h2 id="event">What else is at the Shanghai Finale</h2>
        <p>The poster lists four activities:</p>
        <ol>
          {ACTIVITIES.map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong> (<Zh>{a.zh}</Zh>). {a.text}
            </li>
          ))}
        </ol>
        <p>Some activities end early, on December 27, 2026.</p>

        <h2 id="visit">Visiting the card art exhibition</h2>
        <p>
          Pokémon China shared the details on November 23. The exhibition, where the gold cards are shown, is free, but you need to
          book ahead.
        </p>
        <ul>
          <li>
            <strong>Dates.</strong> November 28 to December 27, 2026.
          </li>
          <li>
            <strong>Venue.</strong> Lafayette Cultural & Art Center (<Zh>拉法耶文化艺术中心</Zh>), 323 Fuxing Middle Road, Huangpu District,
            Shanghai.
          </li>
          <li>
            <strong>Getting there.</strong> Metro Lines 10 and 13, Xintiandi station, Exit 2.
          </li>
          <li>
            <strong>Floors.</strong> 1F Pokémon Waters, 1.5F Dream Forest, 2F Pikachu Art Gallery and 3F Charizard Valley, with
            workshops and a shop on B1.
          </li>
          <li>
            <strong>Booking.</strong> Bookings open in batches at 3:00 pm China time: November 25 (for November 28 to December 4),
            December 2 (December 5 to 11), December 9 (December 12 to 18) and December 16 (December 19 to 27).
          </li>
          <li>
            <strong>Free workshops.</strong> Make a celebration ribbon for your own Pokémon plush, make a sand-art keychain, or try a
            traditional glass silver-engraving class. Kits are limited.
          </li>
        </ul>
        <p>Pokémon China has not said whether the gold cards will ever be sold.</p>

        <h2 id="pikachu-cards">The Pikachu cards behind the designs</h2>
        <p>
          The 30th Celebration expansion released on September 16, 2026, in China and around the world. It has 30 different Pikachu
          cards, each by a different illustrator, and every pack has one. These six are among the most sought-after, shown in the Simplified Chinese set.
        </p>
        <ul className="card-grid cols-3">
          {PIKACHU_CARDS.map((c) => (
            <li key={c.no}>
              <figure>
                <img src={img(c.file)} alt={c.alt} loading="lazy" width={c.w} height={c.h} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>Pikachu</strong>
                  {c.of} · {c.no} · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          Our <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link> covers the whole set, and the{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration release news</Link> covers the pack and the box.
        </p>

        <h2 id="gold-math">The gold, by the numbers</h2>
        <p>Rough estimates from the reported 999 purity and 30 g per card. Pokémon China has not given these figures.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-gold" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-gold" className="sr-only">
              Estimated purity, weight and gold value of one gold card and of all 30
            </caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">One card</th>
                <th scope="col">All 30 cards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Purity</th>
                <td>99.9% gold</td>
                <td>99.9% gold</td>
              </tr>
              <tr>
                <th scope="row">Weight</th>
                <td>30 g (just under 1 oz)</td>
                <td>900 g (about 2 lb)</td>
              </tr>
              <tr>
                <th scope="row">Gold value in China (¥755/g, Nov 21)</th>
                <td>about ¥22,650</td>
                <td>about ¥680,000</td>
              </tr>
              <tr>
                <th scope="row">Gold value in US dollars ($3,620/oz, Nov 23)</th>
                <td>about $3,500</td>
                <td>about $105,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The widely shared ¥600,000 figure is for all 30 cards, not one. Gold prices change daily, and as one-of-a-kind pieces the
          cards would be worth far more to collectors than the gold.
        </p>

        <h2 id="other-events">Other 30th anniversary events</h2>
        <p>Shanghai is one of several big 30th anniversary events in Asia this year. The PokéXciting! tour stops are free.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-events" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-events" className="sr-only">
              Other Pokémon 30th anniversary events in Asia, with where and when
            </caption>
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Where</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">PokéXciting! tour</th>
                <td>Kuala Lumpur</td>
                <td>Sep 12–13, 2026</td>
              </tr>
              <tr>
                <th scope="row">PokéXciting! tour</th>
                <td>Taipei</td>
                <td>Oct 10–11, 2026</td>
              </tr>
              <tr>
                <th scope="row">PokéXciting! tour</th>
                <td>Singapore</td>
                <td>Nov 7–8, 2026</td>
              </tr>
              <tr>
                <th scope="row">PokéXciting! tour</th>
                <td>Manila</td>
                <td>Jan 23–24, 2027</td>
              </tr>
              <tr>
                <th scope="row">PokéXciting! tour</th>
                <td>Bangkok</td>
                <td>Feb 13–14, 2027</td>
              </tr>
              <tr>
                <th scope="row">Pokémon Mega Festa 2026</th>
                <td>Seoul</td>
                <td>May–June 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          In China, Pokémon China's Trainers' 30th Anniversary Celebration campaign set out to collect 300,000 cards at shops. It hit
          the goal on November 6.
        </p>

        <h2 id="news-signup">More Pokémon China news</h2>
        <p>Join our email list below to get more news like this.</p>
        <BlogEmailSignup heading="Get more news like this" body="Join our email list." source="blog-shanghai-gold-cards" doneText="You're on the list." />

        <h2 id="at-ebi">30th Celebration at EBI Collectibles</h2>
        <p>
          The gold cards are on display in Shanghai. The printed Pikachu cards they appear to be based on come in 30th Celebration
          packs. We sell the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-30th-celebration-booster-box' }}>
            30th Celebration booster box
          </Link>
          , the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }}>
            Dream Painting Pikachu figures
          </Link>{' '}
          and the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-plush-keychain' }}>
            Pikachu 30th plush keychains
          </Link>
          .
        </p>
        <p>More on the 30th Celebration:</p>
        <ul>
          <li>
            <Link to="/blog/30th-celebration-release-news">30th Celebration release news</Link>
          </li>
          <li>
            <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link>
          </li>
          <li>
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures: all 12 and the secret</Link>
          </li>
        </ul>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>

      </BlogPostLayout>
    </>
  )
}
