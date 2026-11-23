import { Zh, zh } from '~/components/blog/Zh'
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
  { file: 'pikachu-030', no: '030/103', of: '14/30', illus: 'OKACHEKE', alt: 'Pikachu 030/103 from 30th Celebration: Pikachu leaning on a wooden balcony rail and smiling, illustrated by OKACHEKE' },
  { file: 'pikachu-031', no: '031/103', of: '15/30', illus: 'Yuu Nishida', alt: 'Pikachu 031/103 from 30th Celebration: Pikachu leaping out of a burst of lightning in a forest, illustrated by Yuu Nishida' },
  { file: 'pikachu-041', no: '041/103', of: '25/30', illus: 'Atsuko Nishida', alt: 'Pikachu 041/103 from 30th Celebration: Pikachu running through a green meadow with mountains behind it, illustrated by Atsuko Nishida' },
]

const TOC = [
  { id: 'gold-cards', label: 'The 30 pure gold cards' },
  { id: 'gold-value', label: 'How much gold is that?' },
  { id: 'what-it-is', label: 'What is the Shanghai Finale?' },
  { id: 'activities', label: 'What is on at the event?' },
  { id: 'pikachu-cards', label: 'The 30 Pikachu cards in 30th Celebration' },
  { id: 'real-gold', label: 'Real gold cards and gold-colored cards' },
  { id: 'gold-math', label: 'The gold math, in plain English' },
  { id: 'other-events', label: 'Other 30th anniversary events in Asia' },
  { id: 'other-news', label: 'Other 30th anniversary news from Pokémon China' },
  { id: 'not-known', label: 'What has not been announced' },
  { id: 'at-ebi', label: '30th Celebration at EBI Collectibles' },
  { id: 'faq', label: 'FAQ' },
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
    q: 'Can you buy the gold cards?',
    a: 'Nothing has been announced. The poster presents them as an exhibition display.',
  },
  {
    q: 'Where in Shanghai is the event, and do you need a ticket?',
    a: 'The poster does not give the venue. Nothing has been announced about tickets or reservations.',
  },
  {
    q: 'Are the gold metal Pokémon cards sold online official?',
    a: 'No. The gold-plated metal "Pokémon cards" sold online are unlicensed. They are not official Pokémon products.',
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
    location: { '@type': 'Place', name: 'Shanghai', address: { '@type': 'PostalAddress', addressLocality: 'Shanghai', addressCountry: 'CN' } },
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
        lede="Pokémon China is holding a 30th anniversary event in Shanghai from November 28, 2026 to January 3, 2027. The official poster says 30 pure gold cards will be on display. This post covers what we know so far."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'The booster box, the Dream Painting Pikachu figures and the Pikachu 30th plush keychains.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/blog/30th-celebration-set-guide', label: 'Read the 30th Celebration set guide', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="gold-cards">The 30 pure gold cards</h2>
        <p>
          The line for the card art exhibition ends with <Zh>还有30张足金卡牌展出哦</Zh>, which means "30 pure gold cards will also be
          on display." <Zh>足金</Zh> is the term Chinese jewelers use for pure gold.
        </p>
        <p>
          That is all the poster says about them. It does not say what the cards show, how they are made or how much gold is in each
          one.
        </p>

        <figure className="poster-pair">
          <div className="poster-pair-grid">
            <img
              src={img('event-poster')}
              alt="The official Pokémon 30th Anniversary Shanghai Finale poster in Chinese: Pikachu in a white hat and tuxedo and Totodile in a bow tie run out of a splash of water, with a shark Pokémon and Cramorant on either side, the Shanghai skyline behind them, the dates across the top and the four activities listed along the bottom"
              width={813}
              height={1186}
              style={{ width: '100%', height: 'auto', borderRadius: 10 }}
            />
            <img
              src={img('event-poster-en')}
              alt="The same poster with its Chinese text translated into English: Shanghai, Nov 28, 2026 to Jan 3, 2027, some activities end Dec 27, 2026, and the four activities, including the Pokémon Card Art Illustration Exhibition with 30 pure gold cards on display"
              width={1626}
              height={2372}
              style={{ width: '100%', height: 'auto', borderRadius: 10 }}
            />
          </div>
          <figcaption>
The official event poster, then the same poster with its Chinese text translated into English.</figcaption>
        </figure>

        <aside className="fact-box" aria-label="Shanghai Finale key facts">
          {/* Same card as in the Pikachu section below, where it is described, so this copy is decorative */}
          <img src={img('pikachu-031')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Event</dt>
              <dd>
                Pokémon 30th Anniversary Shanghai Finale (<Zh>宝可梦30周年上海盛典</Zh>)
              </dd>
              <dt>Dates</dt>
              <dd>November 28, 2026 (Saturday) to January 3, 2027 (Sunday)</dd>
              <dt>Early end</dt>
              <dd>Some activities end December 27, 2026</dd>
              <dt>City</dt>
              <dd>Shanghai, China</dd>
              <dt>Gold cards</dt>
              <dd>30 pure gold cards on display</dd>
              <dt>Venue and tickets</dt>
              <dd>Not announced</dd>
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

        <h2 id="gold-value">How much gold is that?</h2>
        <p>
          A widely shared post puts the gold value at about ¥600,000, based on gold prices on November 23. That figure only works for
          all 30 cards together.
        </p>
        <p>
          If each card weighs 30 g, as reported, then 30 cards hold 900 g of gold. ¥600,000 for 900 g is about
          ¥667 per gram. So ¥600,000 is a figure for the whole set of 30, not for one card.
        </p>
        <p>None of these numbers are official. The weight comes from photos, and the price of gold changes every day. <a href="#gold-math">The gold math</a> section below goes through it in more detail.</p>

        <h2 id="what-it-is">What is the Shanghai Finale?</h2>
        <p>
          The Pokémon 30th Anniversary Shanghai Finale (<Zh>宝可梦30周年上海盛典</Zh>) is an event from Pokémon China for the 30th
          anniversary of Pokémon. Going by the official poster, it runs from Saturday, November 28, 2026 to Sunday, January 3, 2027.
          Some activities end earlier, on December 27, 2026.
        </p>
        <p>
          The poster shows Pikachu in a tuxedo and Totodile in a bow tie, with Cramorant, a shark Pokémon and the Shanghai skyline
          behind them. One line on it stands out for card collectors: 30 pure gold cards will be on display.
        </p>

        <h2 id="activities">What is on at the event?</h2>
        <p>The poster lists four activities:</p>
        <ol>
          {ACTIVITIES.map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong> (<Zh>{a.zh}</Zh>). {a.text}
            </li>
          ))}
        </ol>
        <p>The poster does not say which activities end on December 27.</p>
        <h2 id="pikachu-cards">The 30 Pikachu cards in 30th Celebration</h2>
        <p>
          The 30th Celebration expansion released on September 16, 2026, in China and around the world. It has 30 different Pikachu
          cards, each by a different illustrator, and every pack has one. These are three of them from the Simplified Chinese set.
        </p>
        <ul className="card-grid cols-3">
          {PIKACHU_CARDS.map((c) => (
            <li key={c.no}>
              <figure>
                <img src={img(c.file)} alt={c.alt} loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>Pikachu</strong>
                  {c.no} · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          Our <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link> covers the whole set, and the{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration release news</Link> covers the pack and the box.
        </p>

        <h2 id="real-gold">Real gold cards and gold-colored cards</h2>
        <ul>
          <li>
            <strong>Gold-plated metal cards sold online.</strong> These "Pokémon cards" are unlicensed. They are not official products.
          </li>
          <li>
            <strong>Gold cards in booster packs.</strong> Official gold-colored cards in sets are printed cards. The gold is a printed
            finish, not real gold.
          </li>
          <li>
            <strong>Real gold.</strong> The only earlier real gold Pokémon card that is widely known is the pure gold Pikachu card made
            in Japan in 2016. It was sold by reservation.
          </li>
        </ul>

        <h2 id="gold-math">The gold math, in plain English</h2>
        <p>
          Pokémon China has not given these numbers. They start from the reported 30 g per card and the 999 on the label, so treat them
          as rough estimates.
        </p>

        <h3>How pure is 999 gold?</h3>
        <p>
          999 means 99.9% gold. A 30 g card would be almost entirely gold, with about 0.03 g of anything else, roughly the weight of a
          grain of rice. All 30 cards together would weigh 900 g, about 2 pounds.
        </p>
        <p>
          Gold is usually priced by the troy ounce, which is 31.1 g. One 30 g card is just under one troy ounce of gold.
        </p>

        <h3>What is the gold worth?</h3>
        <p>This is the value of the gold alone, at late November 2026 prices. Gold prices change every day.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-gold-value" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-gold-value" className="sr-only">
              Estimated gold value of one card and of all 30 cards
            </caption>
            <thead>
              <tr>
                <th scope="col">Gold price used</th>
                <th scope="col">One card</th>
                <th scope="col">All 30 cards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">China, about ¥755 a gram (Nov 21)</th>
                <td>about ¥22,650</td>
                <td>about ¥680,000</td>
              </tr>
              <tr>
                <th scope="row">US, about $3,620 an ounce (Nov 23)</th>
                <td>about $3,500</td>
                <td>about $105,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The ¥600,000 figure that has been shared is a little lower than this. It works out to about ¥667 a gram, so it probably used
          a lower gold price.
        </p>
        <p>
          Gold was much more expensive earlier this year. At its January high of about ¥1,256 a gram, the 30 cards would have held over
          ¥1.1 million in gold.
        </p>
        <p>
          The gold is only the starting point. A one-of-a-kind set made by Pokémon China for its 30th anniversary would be worth far
          more to a collector than the metal. Nothing has been said about selling them, though.
        </p>

        <h3>How thick would a gold card be?</h3>
        <p>
          Gold is very dense. If a 30 g gold card is the size of a normal card, it would be about 0.28 mm thick. A normal printed card
          is about 0.3 mm, so the gold card would look about as thin. It would just be much heavier: a normal card weighs under 2 g, so
          a gold one would weigh about 17 times more.
        </p>
        <p>This assumes a flat card at normal size. Pokémon China has not said how big or thick the cards are.</p>

        <h2 id="other-events">Other 30th anniversary events in Asia</h2>
        <p>
          Shanghai is not the only big 30th anniversary event in Asia. Of the ones we found, it is the only one called a finale.
        </p>
        <ul>
          <li>
            <strong>PokéXciting! tour.</strong> A free two-day celebration in five cities: Kuala Lumpur (September 12 to 13, 2026),
            Taipei (October 10 to 11), Singapore (November 7 to 8), Manila (January 23 to 24, 2027) and Bangkok (February 13 to 14,
            2027). Kuala Lumpur had a Pokémon drone show over the Petronas Twin Towers, a night stage with a city-colored PokéXciting!
            Pikachu, photo spots and a Pokémon Center pop-up store. Each stop also has Pokémon GO bonuses, including its own colored
            Pikachu.
          </li>
          <li>
            <strong>Pokémon Mega Festa 2026, Seoul.</strong> Billed as the franchise's largest event yet, it ran from May to June
            2026. It included a Pokémon forest garden at Seoul Forest, a Ditto playground, pop-up stores, a Pokémon Run and a Pokémon
            Sports Day with card game qualifiers.
          </li>
        </ul>

        <h2 id="other-news">Other 30th anniversary news from Pokémon China</h2>
        <p>
          Pokémon China also runs a campaign on pokemon.cn called the Trainers' 30th Anniversary Celebration. Its goal is to collect
          300,000 cards at shops from September 24 to December 31, 2026. On November 6, 2026, Pokémon China said the 300,000 goal had
          been reached and that it "will advance the previously planned celebration."
        </p>

        <h2 id="not-known">What has not been announced</h2>
        <p>
          The poster does not give the exact venue in Shanghai, and nothing has been announced about tickets or reservations. There is
          also no word on whether the gold cards will ever be sold. The poster presents them as an exhibition display.
        </p>

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

        <h2 id="our-take">Our take</h2>
        <p>
          The poster confirms 30 pure gold cards. The details that make them stand out, the Pikachu designs and the 30 g weight, come
          from photos shared online, not from Pokémon China.
        </p>
      </BlogPostLayout>
    </>
  )
}
