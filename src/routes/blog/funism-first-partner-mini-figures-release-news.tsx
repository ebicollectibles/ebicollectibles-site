import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'funism-first-partner-mini-figures-release-news')!

const IMG = `${SITE_URL}/assets/blog/funism-first-partner`

// The 27 figures, three per generation, in the order of Funism's lineup chart.
const GENERATIONS = [
  { region: 'Kanto', gen: 1, trio: ['Bulbasaur', 'Charmander', 'Squirtle'], photo: 'kanto' },
  { region: 'Johto', gen: 2, trio: ['Chikorita', 'Cyndaquil', 'Totodile'], photo: 'johto' },
  { region: 'Hoenn', gen: 3, trio: ['Treecko', 'Torchic', 'Mudkip'], photo: 'hoenn' },
  { region: 'Sinnoh', gen: 4, trio: ['Turtwig', 'Chimchar', 'Piplup'], photo: 'sinnoh' },
  { region: 'Unova', gen: 5, trio: ['Snivy', 'Tepig', 'Oshawott'], photo: 'unova' },
  { region: 'Kalos', gen: 6, trio: ['Chespin', 'Fennekin', 'Froakie'], photo: 'kalos' },
  { region: 'Alola', gen: 7, trio: ['Rowlet', 'Litten', 'Popplio'], photo: 'alola' },
  { region: 'Galar', gen: 8, trio: ['Grookey', 'Scorbunny', 'Sobble'], photo: null },
  { region: 'Paldea', gen: 9, trio: ['Sprigatito', 'Fuecoco', 'Quaxly'], photo: 'paldea' },
] as const

const TOC = [
  { id: 'what-it-is', label: 'What is the Funism First Partner set?' },
  { id: 'lineup', label: 'All 27 First Partner figures' },
  { id: 'in-each-box', label: 'What comes in each box?' },
  { id: 'display', label: 'How many boxes make a full set?' },
  { id: 'secret', label: 'Is there a secret figure?' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Funism First Partner set?',
    a: 'A set of 27 small Pokémon figures made by Funism (玩乐主义), an officially licensed Pokémon figure maker in China. It covers the three first partner Pokémon from every generation, Kanto to Paldea, and is part of the Palm-Size Wonders (小小奇遇) series. The box carries the Pokémon 30th anniversary logo.',
  },
  {
    q: 'When did the Funism First Partner figures come out?',
    a: 'July 10, 2026, in mainland China, according to Chinese launch coverage. Pokémon China’s goods pages do not list this set, so the date is not from an official page.',
  },
  {
    q: 'How many figures are in one First Partner box?',
    a: 'Three. Funism’s photo shows each box holding a small brown suitcase with three Poké Balls inside, and a figure goes with each Poké Ball. Chinese launch coverage and retailer listings say the three are one generation’s first partners, such as Bulbasaur, Charmander and Squirtle.',
  },
  {
    q: 'Can you choose which generation you get?',
    a: 'No. It is a blind box, and every box has the same Charmander art on the front, so you do not know which generation is inside until you open it.',
  },
  {
    q: 'How many boxes are in a full display?',
    a: 'Nine. Funism’s display render shows nine suitcase boxes, three across and three deep, with the 27 figures printed along the front. Nine boxes of three figures is 27. Chinese launch coverage says a full display gives one box of each generation, but Funism’s images do not state it.',
  },
  {
    q: 'Is there a secret First Partner figure?',
    a: 'Funism’s lineup chart shows 27 figures and no secret slot. One Chinese launch report says there is no hidden figure, but we have not seen Funism say so itself.',
  },
  {
    q: 'Who makes the First Partner figures?',
    a: 'Funism (玩乐主义), an officially licensed Pokémon figure maker in China. Its Palm-Size Wonders (小小奇遇) series also includes Happy Ditto, the 12 figures of Ditto copying other Pokémon.',
  },
  {
    q: 'Is the First Partner set sold under other names?',
    a: 'Yes. Shops translate it differently. First Partners Little Adventures, Palmsize Wonders First Partner and First Partner 30th Anniversary Blind Box are the same set.',
  },
]

export const Route = createFileRoute('/blog/funism-first-partner-mini-figures-release-news')({
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
  component: FunismFirstPartnerReleasePost,
})

function FunismFirstPartnerReleasePost() {
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
  const lineupJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All 27 Funism First Partner figures',
    numberOfItems: 27,
    itemListElement: GENERATIONS.flatMap((g) => g.trio).map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(lineupJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Funism's First Partner set has 27 small figures, the three first partner Pokémon from all nine generations. Each blind box is shaped like a suitcase and holds three figures with three Poké Balls."
        cta={{
          heading: 'More Funism figures',
          body: 'The First Partner set is not in our shop. Funism’s Happy Ditto, from the same Palm-Size Wonders series, has its own listing, and our other blind boxes are in the shop.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box' }, label: 'See Funism Happy Ditto' },
            { to: '/shop', search: { subcategory: 'Blind Box' }, label: 'Browse blind boxes', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Funism First Partner set?</h2>
        <p>
          First Partner (<Zh>最初的伙伴</Zh>) is a set of 27 small Pokémon figures from Funism's Palm-Size Wonders (<Zh>小小奇遇</Zh>) series.
          It went on sale in China on July 10, 2026, and the box carries the Pokémon 30th anniversary logo. The lineup is every
          generation's three first partners, from Bulbasaur, Charmander and Squirtle in Kanto to Sprigatito, Fuecoco and Quaxly in
          Paldea.
        </p>
        <p>
          It is sold as a blind box, and the box is printed to look like a brown suitcase with a carry handle. Inside is a smaller
          brown suitcase that opens to show three Poké Balls in a black tray, and three figures. Charmander is on the
          front of every box.
        </p>

        <aside className="fact-box" aria-label="First Partner key facts">
          <img src={`${IMG}-box-and-suitcase.webp`} alt="Funism First Partner box with the open suitcase, three Poké Balls and the Bulbasaur, Charmander and Squirtle figures" loading="lazy" width={881} height={909} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Palm-Size Wonders First Partner (<Zh>小小奇遇系列 最初的伙伴</Zh>)</dd>
              <dt>Maker</dt>
              <dd>Funism (<Zh>玩乐主义</Zh>), officially licensed</dd>
              <dt>Released</dt>
              <dd>July 10, 2026, in China</dd>
              <dt>Type</dt>
              <dd>Blind box figures</dd>
              <dt>Figures</dt>
              <dd>27, three from each of nine generations</dd>
              <dt>Per box</dt>
              <dd>3 figures and 3 Poké Balls in a small suitcase</dd>
              <dt>Display</dt>
              <dd>9 boxes</dd>
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

        <h2 id="lineup">All 27 First Partner figures</h2>
        <p>
          Funism's lineup chart lists the figures in generation order, nine to a row. Every first partner trio from the main series
          games is here, so the set runs from the 1996 Kanto starters to the Paldea ones.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 760 }}>
          <img
            src={`${IMG}-lineup.webp`}
            alt="Funism First Partner lineup chart showing all 27 figures with their names"
            loading="lazy"
            width={800}
            height={455}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>
        <div className="table-scroll" role="group" aria-labelledby="tbl-lineup" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-lineup" className="sr-only">
              The 27 Funism First Partner figures by generation
            </caption>
            <thead>
              <tr>
                <th scope="col">Generation</th>
                <th scope="col">Region</th>
                <th scope="col">Figures</th>
              </tr>
            </thead>
            <tbody>
              {GENERATIONS.map((g) => (
                <tr key={g.region}>
                  <th scope="row">{g.gen}</th>
                  <td>{g.region}</td>
                  <td>{g.trio.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Funism also photographed the figures by generation. Its photos cover eight of the nine trios; Galar's Grookey, Scorbunny
          and Sobble are in the lineup chart above.
        </p>
        <ul className="card-grid cols-4">
          {GENERATIONS.filter((g) => g.photo).map((g) => (
            <li key={g.region}>
              <figure>
                <img src={`${IMG}-gen-${g.photo}.webp`} alt={`Funism First Partner figures from ${g.region}: ${g.trio.join(', ')}`} loading="lazy" width={448} height={560} style={{ aspectRatio: '448 / 560', objectFit: 'cover' }} />
                <figcaption>
                  <strong>{g.region}</strong>
                  {g.trio.join(', ')}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="in-each-box">What comes in each box?</h2>
        <p>
          Three figures and a small suitcase. Funism's photo shows the suitcase open, with gold-colored clasps, a carry handle and a
          black tray holding three Poké Balls. The Bulbasaur, Charmander and Squirtle figures sit beside it, and Squirtle is perched
          on one of the Poké Balls.
        </p>
        <p>
          Chinese launch coverage and retailer listings say each box holds one generation's three first partners. That fits
          Funism's photos, which always show the figures in their generation's trio, but the box itself does not say which
          generation is inside. You find out when you open it.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 640 }}>
          <img
            src={`${IMG}-all-27-figures.webp`}
            alt="All 27 Funism First Partner figures standing on grass along a small stream"
            loading="lazy"
            width={800}
            height={800}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <BuyStrip />

        <h2 id="display">How many boxes make a full set?</h2>
        <p>
          Nine. Funism's display render shows nine suitcase boxes, three across and three deep, under a header card with Bulbasaur,
          Charmander and Squirtle coming out of Poké Balls. The 27 figures are printed along the front edge. Nine boxes of three
          figures is 27.
        </p>
        <p>
          Chinese launch coverage says a full display gives one box of each generation, so all 27 figures with no repeats. Funism's
          images do not state that, so treat it as likely, not certain. Boxes bought one at a time are random and can repeat.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 560 }}>
          <img
            src={`${IMG}-display-box.webp`}
            alt="Funism First Partner display holding nine suitcase boxes, with the 27 figures printed along the front"
            loading="lazy"
            width={1001}
            height={1000}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>

        <h2 id="secret">Is there a secret figure?</h2>
        <p>
          Funism's lineup chart shows 27 figures and no secret slot, and the display prints the same 27. One Chinese launch report
          says there is no hidden figure, but we have not seen Funism say so itself. For most collectors the chase will be their own
          first partner trio.
        </p>
        <p>
          Happy Ditto, the Palm-Size Wonders set that followed in September 2026, also turns the box into part of the display: its
          figures come inside a plastic Ditto. Our <Link to="/blog/funism-ditto-palm-size-wonders-release-news">Happy Ditto post</Link>{' '}
          covers that set.
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
          Every first partner in one set, three to a suitcase, is a strong idea for the 30th anniversary. The suitcase is worth
          keeping on the shelf with its trio, and a full display should cover all nine generations. The blind format is the catch if
          you only want your own starters.
        </p>
      </BlogPostLayout>
    </>
  )
}
