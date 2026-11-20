import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'pikachu-dream-painting-figures-release-news')!

const figImg = (n: string) =>
  `${R2_IMAGE_HOST}/Chinese/30th%20Anniversary/Pikachu%20Figures/pokemon-chinese-pikachu-30th-celebration-figure-${n}-product-photo-badged.webp`
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/30th%20Celebration/Cards/0${n}.webp`

// The 12 regular figures. fig = the Pikachu number printed on the card (1 to 30), card = 30th Celebration number.
// Card numbers read off the box side and the official photos; illustrators read off the cards.
type Fig = { fig: string; card: string; illus: string; pose: string }
const FIGURES: Fig[] = [
  { fig: '18', card: '034', illus: 'Shinji Kanda', pose: "One paw raised, with the card's sketch lines painted on" },
  { fig: '01', card: '017', illus: 'Ken Sugimori', pose: 'A round, standing Pikachu' },
  { fig: '10', card: '026', illus: 'Tomokazu Komiya', pose: 'Tumbling past a red streamer' },
  { fig: '15', card: '031', illus: 'Yuu Nishida', pose: 'Rolling on its back, paws up' },
  { fig: '25', card: '041', illus: 'Atsuko Nishida', pose: 'Running out of a mountain view' },
  { fig: '30', card: '046', illus: 'Kazuki Minami', pose: 'Mid-spin, tail flung out of the frame' },
  { fig: '06', card: '022', illus: 'sowsow', pose: 'Sitting with a Poké Ball' },
  { fig: '28', card: '044', illus: 'Shimaris Yukichi', pose: 'Eyes shut, mid-snack' },
  { fig: '21', card: '037', illus: 'OOYAMA', pose: 'Lying on the beach, eyes shut' },
  { fig: '14', card: '030', illus: 'OKACHEKE', pose: 'Peeking out between wooden posts' },
  { fig: '12', card: '028', illus: 'USGMEN', pose: 'A flat, graphic Pikachu with a big grin' },
  { fig: '24', card: '040', illus: 'svlt', pose: 'Leaning into the breeze, eyes closed' },
]

function FigureGrid({ figs }: { figs: Fig[] }) {
  return (
    <ul className="card-grid cols-4">
      {figs.map((f) => (
        <li key={f.fig}>
          <figure>
            <img
              src={figImg(f.fig)}
              alt={`Dream Painting Pikachu figure ${f.fig}/30 on its stand with card ${f.card}/103`}
              loading="lazy"
              width={600}
              height={600}
              style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
            />
            <figcaption>
              <strong>Figure {f.fig}/30</strong>
              Card {f.card}/103 · {f.illus}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const TOC = [
  { id: 'what-it-is', label: 'What are the Dream Painting Pikachu figures?' },
  { id: 'lineup', label: 'All 12 regular Pikachu figures' },
  { id: 'secret', label: 'What is the secret figure?' },
  { id: 'in-the-box', label: 'What comes in a box?' },
  { id: 'odds', label: 'What are the odds of the secret figure?' },
  { id: 'collecting', label: 'Blind box, case or single figure?' },
  { id: 'faq', label: 'FAQ' },
]

// Buying options side by side. Pokémon China has not said what a case holds
// beyond 12 boxes, so the case column says the boxes are random.
const OPTIONS = [
  { row: 'What you get', box: '1 sealed box', sealed: '12 sealed boxes', single: '1 box we opened to confirm the figure' },
  { row: 'Which figure', box: 'Random', sealed: 'Random', single: 'The one you choose' },
  { row: 'Secret figure', box: 'About 1 box in 144', sealed: 'About an 8% chance in 12 boxes', single: 'Not possible' },
  { row: 'Card, stand and pack', box: 'Included', sealed: 'Included in every box', single: 'Included, with the pack still sealed' },
  { row: 'Best for', box: 'The surprise', sealed: 'Starting a full set of 12', single: 'One Pikachu you want' },
]

const FAQ = [
  {
    q: 'When were the Dream Painting Pikachu figures released?',
    a: 'September 16, 2026, in mainland China, the same day as the 30th Celebration booster set.',
  },
  {
    q: 'What is in a Dream Painting Pikachu blind box?',
    a: 'One random Pikachu figure, the 30th Celebration card it is based on, a clear display stand for the two, and one 30th Celebration booster pack of 6 cards.',
  },
  {
    q: 'How many Dream Painting Pikachu figures are there?',
    a: '13: 12 regular figures and 1 secret. The 12 regulars are based on 30th Celebration cards 017, 022, 026, 028, 030, 031, 034, 037, 040, 041, 044 and 046.',
  },
  {
    q: 'What is the secret figure?',
    a: 'The classic Pikachu from 30th Celebration, card 136/103, a reprint of the 1999 Base Set Pikachu drawn by Mitsuhiro Arita. It comes with that card.',
  },
  {
    q: 'What are the odds of pulling the secret figure?',
    a: 'Pokémon China gives a production ratio of 143 regular boxes to 1 secret, so about 1 box in 144. The 12 regular figures are made in equal numbers.',
  },
  {
    q: 'Does a case have one of each figure?',
    a: 'A case holds 12 boxes, the same as the number of regular designs, but Pokémon China has not said that a case holds one of each. Treat the boxes as random.',
  },
  {
    q: 'What does figure 18/30 mean?',
    a: 'Each of the 30 Pikachu cards in 30th Celebration carries its own Pikachu number from 1 to 30 next to the card number. Figure 18/30 is the Pikachu on card 034/103.',
  },
]

export const Route = createFileRoute('/blog/pikachu-dream-painting-figures-release-news')({
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
  component: PikachuDreamPaintingReleasePost,
})

function PikachuDreamPaintingReleasePost() {
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
    name: 'All 12 regular Dream Painting Pikachu figures',
    numberOfItems: FIGURES.length,
    itemListElement: FIGURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Pikachu figure ${f.fig}/30, from 30th Celebration card ${f.card}/103 by ${f.illus}`,
      image: figImg(f.fig),
    })),
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
        lede="Pokémon China turned 12 of the 30th Celebration Pikachu cards into figures that stand in front of their own card. Each box has one random figure, its card, a display stand and a 30th Celebration pack, and about 1 box in 144 holds a secret classic Pikachu."
        cta={{
          heading: 'Shop the Pikachu figures',
          body: 'One blind box, a 12-box case, or the exact figure you want as a single.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }, label: 'Shop the blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box-case' }, label: 'Shop the 12-box case', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Dream Painting Pikachu figures?</h2>
        <p>
          The Dream Painting 30th Anniversary Pikachu Figure Set (<Zh>绘梦点睛 30周年皮卡丘手办套装</Zh>) is a blind box of Pikachu figures from
          Pokémon China. It went on sale in China on September 16, 2026, the same day as the{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration</Link> booster set. Dream Painting (<Zh>绘梦点睛</Zh>) is Pokémon
          China's figure line based on card illustrations. Each figure recreates the Pokémon from one card, and the card stands behind it, so
          the figure looks like it is stepping out of the picture.
        </p>
        <p>
          This release uses 12 of the 30 Pikachu cards from 30th Celebration, plus one secret figure. Every box has one random figure, the
          card it is based on, a display stand and a sealed 30th Celebration pack.
        </p>

        <aside className="fact-box" aria-label="Dream Painting Pikachu key facts">
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-box.webp`}
            alt="Dream Painting 30th Anniversary Pikachu Figure Set blind box"
            loading="lazy"
            width={600}
            height={501}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Dream Painting 30th Anniversary Pikachu Figure Set (<Zh>绘梦点睛 30周年皮卡丘手办套装</Zh>)</dd>
              <dt>Released</dt>
              <dd>September 16, 2026</dd>
              <dt>Designs</dt>
              <dd>13: 12 regular, 1 secret</dd>
              <dt>Per box</dt>
              <dd>1 random figure, its matching card, a display stand, 1 30th Celebration pack (6 cards)</dd>
              <dt>Secret odds</dt>
              <dd>143 regular to 1 secret, about 1 box in 144</dd>
              <dt>Secret</dt>
              <dd>Classic Pikachu, card 136/103, illustrated by Mitsuhiro Arita</dd>
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

        <h2 id="lineup">All 12 regular Pikachu figures</h2>
        <p>
          Each 30th Celebration Pikachu card was drawn by a different illustrator, so no two figures share a style. Some stay close to
          the card, like Shinji Kanda's Pikachu, which has the card's hatching lines painted onto the figure. Others reach past the card:
          Tomokazu Komiya's Pikachu trails a red streamer out to the side, and Kazuki Minami's Pikachu swings its tail out past the
          card edge. Atsuko Nishida, Pikachu's original designer, and Ken Sugimori each have one of the 12.
        </p>
        <FigureGrid figs={FIGURES} />
        <p className="table-note">These are our photos of the figures, each on its stand with its card. The number is the Pikachu number printed on the card.</p>
        <figure style={{ margin: '28px 0' }}>
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-lineup.webp`}
            alt="All 12 regular Dream Painting Pikachu figures on their stands, as shown by Pokémon China"
            loading="lazy"
            width={1400}
            height={1135}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>
        <p>These are the cards the figures come from, in the same order.</p>
        <ul className="card-grid cols-4">
          {FIGURES.map((f) => (
            <li key={f.card}>
              <figure>
                <img src={cardImg(f.card)} alt={`Pikachu ${f.card}/103, 30th Celebration`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>Pikachu {f.card}/103</strong>
                  {f.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="secret">What is the secret figure?</h2>
        <p>
          The secret figure is the classic Pikachu from card 136/103. That card is one of the 30 classic cards in 30th Celebration, which
          reprint famous cards from the TCG's history in their original frames. This one is the 1999 Base Set Pikachu by Mitsuhiro Arita,
          the round Pikachu from the very first set. The figure comes with the 136/103 card.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 720 }}>
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-secret.webp`}
            alt="The secret Dream Painting figure: classic Pikachu with card 136/103 by Mitsuhiro Arita"
            loading="lazy"
            width={1200}
            height={800}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <BuyStrip />

        <h2 id="in-the-box">What comes in a box?</h2>
        <p>
          Pokémon China lists a figure, its card and a booster pack in each box, and its photos show the stand that the figure and card
          sit on.
        </p>
        <ul>
          <li>1 random Pikachu figure, one of 13</li>
          <li>The 30th Celebration Pikachu card that figure is based on</li>
          <li>A clear display stand: the card slots in at the back, the figure stands in front</li>
          <li>1 sealed 30th Celebration booster pack of 6 cards, every one a holo</li>
        </ul>
        <p>
          The box has all 12 regular figures and their card numbers printed on the side, plus a silhouette for the secret.
        </p>

        <h2 id="odds">What are the odds of the secret figure?</h2>
        <p>
          About 1 box in 144. Pokémon China publishes the production ratio: the 12 regular figures are made in equal numbers, and regular
          boxes outnumber secret boxes 143 to 1. Each regular figure is about 1 box in 12.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Odds for each Dream Painting Pikachu figure</caption>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Share of boxes</th>
                <th scope="col">About 1 box in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Each regular figure</th>
                <td>8.28%</td>
                <td>12.1</td>
              </tr>
              <tr>
                <th scope="row">Secret classic Pikachu</th>
                <td>0.69%</td>
                <td>144</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">These figures come from Pokémon China's 143 to 1 production ratio. They are averages, not guarantees.</p>
        <p>
          A case is 12 boxes. At 1 box in 144, you would expect a secret about once every 12 cases, and 12 random boxes have about an 8%
          chance of holding one.
        </p>

        <h2 id="collecting">Blind box, case or single figure?</h2>
        <p>
          It depends on whether you want the surprise, the whole set or one Pikachu. A case holds 12 boxes, the same as the number of
          regular designs, but Pokémon China has not said that a case holds one of each, so treat the boxes as random. A single is a box
          we opened only to confirm the figure. Its card, stand and sealed pack are still included.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-options" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-options" className="sr-only">
              A blind box compared with a 12-box case and a single figure
            </caption>
            <thead>
              <tr>
                <td />
                <th scope="col">Blind box</th>
                <th scope="col">12-box case</th>
                <th scope="col">Single figure</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((o) => (
                <tr key={o.row}>
                  <th scope="row">{o.row}</th>
                  <td>{o.box}</td>
                  <td>{o.sealed}</td>
                  <td>{o.single}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each regular figure has its own listing: {FIGURES.map((f, i) => (
            <span key={f.fig}>
              <Link to="/products/$id" params={{ id: `pokemon-chinese-pikachu-30th-celebration-figure-${f.fig}` }}>
                {f.fig}/30
              </Link>
              {i < FIGURES.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Of everything released around 30th Celebration that is not a card, these are our favorite. The figures stay faithful to 12 very
          different illustration styles, and the card standing behind the figure makes a good shelf display. The Base Set Pikachu is a
          fitting choice for the secret.
        </p>
      </BlogPostLayout>
    </>
  )
}
