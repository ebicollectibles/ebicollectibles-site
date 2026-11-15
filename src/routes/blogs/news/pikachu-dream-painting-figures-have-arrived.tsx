import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'pikachu-dream-painting-figures-have-arrived')!

const figImg = (n: string) =>
  `${R2_IMAGE_HOST}/Chinese/30th%20Anniversary/Pikachu%20Figures/pokemon-chinese-pikachu-30th-celebration-figure-${n}-product-photo-badged.webp`
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/30th%20Celebration/Cards/0${n}.webp`

// The 12 regular figures. fig = the Pikachu number printed on the card (1 to 30), card = 30th Celebration number.
// Card numbers read off the box side and the official photos; illustrators read off the cards.
type Fig = { fig: string; card: string; illus: string; pose: string }
const FIGURES: Fig[] = [
  { fig: '18', card: '034', illus: 'Shinji Kanda', pose: 'Arms up, with the sketch lines of the card painted on' },
  { fig: '01', card: '017', illus: 'Ken Sugimori', pose: 'A round, standing Pikachu' },
  { fig: '10', card: '026', illus: 'Tomokazu Komiya', pose: 'Tumbling past a red streamer' },
  { fig: '15', card: '031', illus: 'Yuu Nishida', pose: 'Rolling on its back, paws up' },
  { fig: '25', card: '041', illus: 'Atsuko Nishida', pose: 'Running out of a mountain view' },
  { fig: '30', card: '046', illus: 'Kazuki Minami', pose: 'Mid-spin, tail flung out of the frame' },
  { fig: '06', card: '022', illus: 'sowsow', pose: 'Sitting with a Poké Ball' },
  { fig: '28', card: '044', illus: 'Shimaris Yukichi', pose: 'Mid-snack, crumbs on its face' },
  { fig: '21', card: '037', illus: 'OOYAMA', pose: 'Lying on the beach, eyes shut' },
  { fig: '14', card: '030', illus: 'OKACHEKE', pose: 'Peeking out between wooden posts' },
  { fig: '12', card: '028', illus: 'USGMEN', pose: 'A flat, graphic Pikachu with a big grin' },
  { fig: '24', card: '040', illus: 'svlt', pose: 'Leaning into the breeze, eyes closed' },
]

function FigureGrid({ figs }: { figs: Fig[] }) {
  return (
    <div className="card-grid cols-4">
      {figs.map((f) => (
        <figure key={f.fig}>
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
      ))}
    </div>
  )
}

const TOC = [
  { id: 'lineup', label: 'The 12 regular figures' },
  { id: 'secret', label: 'The secret: classic Pikachu' },
  { id: 'in-the-box', label: 'What is in a box' },
  { id: 'odds', label: 'Odds and cases' },
  { id: 'collecting', label: 'How to collect them' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
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
    q: 'What are the odds of the secret figure?',
    a: 'Pokémon China gives a production ratio of 143 regular boxes to 1 secret, so about 1 box in 144. The 12 regular figures are made in equal numbers.',
  },
  {
    q: 'When did the Dream Painting Pikachu figures release?',
    a: 'September 16, 2026, the same day as the 30th Celebration booster set.',
  },
  {
    q: 'What does figure 18/30 mean?',
    a: 'Each of the 30 Pikachu cards in 30th Celebration carries its own Pikachu number from 1 to 30 next to the card number. Figure 18/30 is the Pikachu on card 034/103.',
  },
]

export const Route = createFileRoute('/blogs/news/pikachu-dream-painting-figures-have-arrived')({
  head: () => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
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
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
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
        wide
        post={post}
        lede="Twelve of the 30 Pikachu cards from 30th Celebration, sculpted so the Pikachu climbs out of its own card, plus a secret classic Pikachu in 1 box out of 144."
        cta={{
          heading: 'Shop the Pikachu figures',
          body: 'Blind boxes, a 12-box case, or the exact figure you want as a single.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }, label: 'Shop the blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box-case' }, label: 'Shop the 12-box case', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Dream Painting (绘梦点睛) is Pokémon China's figure line built on card art: each figure recreates the Pokémon from one card
          illustration, and you stand the card behind it so the figure looks like it is stepping out of the picture. This release, the
          30th Anniversary Pikachu Figure Set, takes 12 of the 30 Pikachu cards from <Link to="/blogs/news/30th-celebration-has-arrived">30th
          Celebration</Link>. Every box also has the matching card and a sealed 30th Celebration pack. The secret is the classic Base Set
          Pikachu.
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
              <dd>Dream Painting 30th Anniversary Pikachu Figure Set (绘梦点睛 30周年皮卡丘手办套装)</dd>
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

        <h2 id="lineup">The 12 regular figures</h2>
        <p>
          Each 30th Celebration Pikachu card was drawn by a different illustrator, so no two figures share a style. Some stay close to
          the card, like Shinji Kanda's Pikachu with the pencil hatching painted onto the figure. Others break the frame: Tomokazu
          Komiya's tumbling Pikachu trails a red streamer past the card edge, and Kazuki Minami's spinning Pikachu flings its tail out
          to the side. Atsuko Nishida, Pikachu's original designer, and Ken Sugimori each have one of the 12.
        </p>
        <FigureGrid figs={FIGURES} />
        <p className="table-note">Our photos of the figures, each on its stand with its card. The number is the Pikachu number printed on the card.</p>
        <figure style={{ margin: '28px 0' }}>
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-lineup.webp`}
            alt="Pokémon China's photo of all 12 regular Dream Painting Pikachu figures on their stands"
            loading="lazy"
            width={1400}
            height={1135}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>
        <p>And the cards they come from, in the same order:</p>
        <div className="card-grid cols-4">
          {FIGURES.map((f) => (
            <figure key={f.card}>
              <img src={cardImg(f.card)} alt={`Pikachu ${f.card}/103, 30th Celebration`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>Pikachu {f.card}/103</strong>
                {f.illus}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="secret">The secret: classic Pikachu</h2>
        <p>
          The 13th figure is hidden. It is the Pikachu from card 136/103, one of the 30 classic cards in 30th Celebration that reprint
          famous English cards in their original frames. This one is the 1999 Base Set Pikachu by Mitsuhiro Arita: the chubby,
          round-cheeked Pikachu from the very first set, now a figure with the same soft painted look. It comes with the 136/103 card.
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

        <h2 id="in-the-box">What is in a box</h2>
        <p>Pokémon China lists three things in each box, and the official photos show the stand the figure and card sit on:</p>
        <ul>
          <li>1 random Pikachu figure, one of 13</li>
          <li>The 30th Celebration Pikachu card that figure is based on</li>
          <li>A clear display stand: the card slots in at the back, the figure stands in front</li>
          <li>1 sealed 30th Celebration booster pack of 6 cards, every one a holo</li>
        </ul>
        <p>
          The box is a cube with all 12 regular figures and their card numbers printed on the side, plus a question mark for the secret.
        </p>

        <h2 id="odds">Odds and cases</h2>
        <p>
          Pokémon China publishes the ratio: each regular figure is made in equal numbers, and regular boxes outnumber secret boxes 143
          to 1. So about 1 box in 144 is the secret, and each regular figure is about 1 box in 12.
        </p>
        <div className="table-scroll">
          <table className="data-table">
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
        <p className="table-note">From Pokémon China's 143:1 production ratio. Averages, not guarantees.</p>
        <p>
          A case is 12 boxes. At 1 in 144, you would expect a secret about once every 12 cases, and 12 random boxes have about an 8%
          chance of holding one. Our <Link to="/blogs/news/pikachu-dream-painting-figures-guide">figure guide</Link> has the full
          checklist and the math on completing the set.
        </p>

        <h2 id="collecting">How to collect them</h2>
        <p>
          If you want the whole display, a case is the simple route. If you want one Pikachu, the one by your favorite illustrator or
          the one from a card you already own, buy it as a single: every regular figure is on our shelf individually, opened only to
          confirm the design, with its card, stand and sealed pack still included. Blind boxes are for the fun of the rip and the small
          shot at the secret, and every box still gives you a 30th Celebration pack.
        </p>
        <p>
          The singles: {FIGURES.map((f, i) => (
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
          This is the best thing to come out of the 30th Celebration launch that is not a card. The figures are faithful to very
          different art styles, the card-behind-figure display looks great on a shelf, and the secret is the right choice: the Pikachu
          that started it all. Pair a figure with the same card from your binder and you have a 30th anniversary display that costs
          you one shelf slot.
        </p>
      </BlogPostLayout>
    </>
  )
}
