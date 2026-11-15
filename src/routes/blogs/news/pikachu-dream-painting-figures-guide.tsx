import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'pikachu-dream-painting-figures-guide')!

const figImg = (n: string) =>
  `${R2_IMAGE_HOST}/Chinese/30th%20Anniversary/Pikachu%20Figures/pokemon-chinese-pikachu-30th-celebration-figure-${n}-product-photo-badged.webp`

// Checklist in card order. fig = Pikachu number printed on the card (1 to 30). HP read off the cards.
type Fig = { fig: string; card: string; illus: string; hp: number; pose: string }
const CHECKLIST: Fig[] = [
  { fig: '01', card: '017', illus: 'Ken Sugimori', hp: 70, pose: 'Round, standing, small smile' },
  { fig: '06', card: '022', illus: 'sowsow', hp: 60, pose: 'Sitting with a Poké Ball in its lap' },
  { fig: '10', card: '026', illus: 'Tomokazu Komiya', hp: 50, pose: 'Tumbling past a red streamer' },
  { fig: '12', card: '028', illus: 'USGMEN', hp: 70, pose: 'Flat, graphic style, big open grin' },
  { fig: '14', card: '030', illus: 'OKACHEKE', hp: 70, pose: 'Between two wooden posts' },
  { fig: '15', card: '031', illus: 'Yuu Nishida', hp: 70, pose: 'On its back, paws in the air' },
  { fig: '18', card: '034', illus: 'Shinji Kanda', hp: 80, pose: 'Arms up, pencil hatching painted on' },
  { fig: '21', card: '037', illus: 'OOYAMA', hp: 70, pose: 'Lying on its side, eyes shut' },
  { fig: '24', card: '040', illus: 'svlt', hp: 60, pose: 'Leaning into the breeze, eyes closed' },
  { fig: '25', card: '041', illus: 'Atsuko Nishida', hp: 70, pose: 'Running toward you' },
  { fig: '28', card: '044', illus: 'Shimaris Yukichi', hp: 80, pose: 'Sitting, crumbs on its face' },
  { fig: '30', card: '046', illus: 'Kazuki Minami', hp: 70, pose: 'Mid-spin, tail out to the side' },
]

// Completing the 12 regulars from random boxes (coupon collector, regular share 143/144).
const MATH = [
  { row: 'A specific regular figure', avg: 'about 1 box in 12.1' },
  { row: 'The secret classic Pikachu', avg: '1 box in 144' },
  { row: 'All 12 regulars from random boxes', avg: 'about 37.5 boxes on average' },
  { row: 'A 50% chance at the secret', avg: 'about 100 boxes' },
  { row: 'Chance of a secret in 12 random boxes', avg: 'about 8%' },
]

const LOOKALIKES = [
  { a: '017 Ken Sugimori', b: '028 USGMEN', tell: 'Both are round and front-facing. 028 has a wide open grin and flat colors; 017 has a small closed smile.' },
  { a: '031 Yuu Nishida', b: '037 OOYAMA', tell: 'Both lie down. 031 is on its back with paws up and eyes open; 037 lies on its side with its eyes shut, on a beach card.' },
  { a: '040 svlt', b: '041 Atsuko Nishida', tell: 'Both are mid-stride. 040 has its eyes closed; 041 looks straight at you with its mouth open.' },
]

const TOC = [
  { id: 'checklist', label: 'The checklist' },
  { id: 'gallery', label: 'Every figure' },
  { id: 'secret', label: 'The secret figure' },
  { id: 'odds', label: 'Odds and completing the set' },
  { id: 'case-or-box', label: 'Case, boxes or singles' },
  { id: 'tell-apart', label: 'Telling them apart' },
  { id: 'display', label: 'Displaying them' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which 30th Celebration cards are the Dream Painting figures based on?',
    a: 'The 12 regulars are Pikachu 017, 022, 026, 028, 030, 031, 034, 037, 040, 041, 044 and 046. The secret is the classic Pikachu 136/103.',
  },
  {
    q: 'How many boxes does it take to get all 12 regular figures?',
    a: 'From random blind boxes, about 37.5 on average, because the last few designs take a long time to turn up. Buying the ones you are missing as singles saves a lot of duplicate boxes.',
  },
  {
    q: 'How rare is the secret figure?',
    a: 'About 1 box in 144, from Pokémon China’s 143 to 1 production ratio. That is roughly one secret per 12 cases.',
  },
  {
    q: 'Does the card in the box count as a 30th Celebration card?',
    a: 'Yes. Each box has the 30th Celebration card the figure is based on, with the same card number, so it fills that slot in your set.',
  },
  {
    q: 'How do I know which figure I have?',
    a: 'Read the card in the box: the card number (for example 034/103) and the Pikachu number (18/30) match the figure.',
  },
]

export const Route = createFileRoute('/blogs/news/pikachu-dream-painting-figures-guide')({
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
  component: PikachuDreamPaintingGuide,
})

function PikachuDreamPaintingGuide() {
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
        lede="All 13 Dream Painting Pikachu figures with their cards and illustrators, the secret odds, and what it really takes to finish the set."
        cta={{
          heading: 'Finish your Pikachu display',
          body: 'Every regular figure as a single, plus blind boxes and the 12-box case.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box-case' }, label: 'Shop the 12-box case' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }, label: 'Shop a blind box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          The Dream Painting 30th Anniversary Pikachu Figure Set has 13 figures, each based on a Pikachu card from{' '}
          <Link to="/blogs/news/30th-celebration-has-arrived">30th Celebration</Link>. Our{' '}
          <Link to="/blogs/news/pikachu-dream-painting-figures-have-arrived">release post</Link> covers what the line is. Use this one
          to tick off what you have and plan what is left.
        </p>

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

        <h2 id="checklist">The checklist</h2>
        <p>
          The figure number is the Pikachu number printed on its card, next to the card number. The box side lists the regulars by card
          number.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Card</th>
                <th scope="col">Illustrator</th>
                <th scope="col">HP</th>
                <th scope="col">Pose</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST.map((f) => (
                <tr key={f.fig}>
                  <th scope="row">
                    <Link to="/products/$id" params={{ id: `pokemon-chinese-pikachu-30th-celebration-figure-${f.fig}` }}>
                      {f.fig}/30
                    </Link>
                  </th>
                  <td>{f.card}/103</td>
                  <td>{f.illus}</td>
                  <td>{f.hp}</td>
                  <td>{f.pose}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Secret</th>
                <td>136/103</td>
                <td>Mitsuhiro Arita</td>
                <td>40</td>
                <td>Classic Base Set Pikachu, round and upright</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="gallery">Every figure</h2>
        <div className="card-grid cols-4">
          {CHECKLIST.map((f) => (
            <figure key={f.fig}>
              <img
                src={figImg(f.fig)}
                alt={`Dream Painting Pikachu figure ${f.fig}/30 with card ${f.card}/103 by ${f.illus}`}
                loading="lazy"
                width={600}
                height={600}
                style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
              />
              <figcaption>
                <strong>{f.fig}/30 · card {f.card}</strong>
                {f.illus}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="secret">The secret figure</h2>
        <p>
          The secret is the classic Pikachu, card 136/103, a reprint of the 1999 Base Set Pikachu by Mitsuhiro Arita, with its card. It
          is the only figure not drawn from the 30 Pikachu Rares (017 to 046), and the only one with a gold-glitter classic card behind it.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 720 }}>
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-secret.webp`}
            alt="Secret Dream Painting figure, classic Pikachu, with card 136/103"
            loading="lazy"
            width={1200}
            height={800}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <h2 id="odds">Odds and completing the set</h2>
        <p>
          Pokémon China says each regular figure is produced in equal numbers and that regular boxes outnumber the secret 143 to 1. From
          that:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Goal</th>
                <th scope="col">Average</th>
              </tr>
            </thead>
            <tbody>
              {MATH.map((m) => (
                <tr key={m.row}>
                  <th scope="row">{m.row}</th>
                  <td>{m.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Computed from the official 143:1 ratio, treating every box as an independent random pull. Real runs vary.</p>
        <p>
          The 37.5 boxes is the catch with random blind boxes. Your first few boxes are almost all new figures, but by the time you
          have 11, each box has only about a 1 in 12 chance of being the one you need.
        </p>

        <h2 id="case-or-box">Case, boxes or singles</h2>
        <ul>
          <li>
            <strong>A 12-box case</strong> is the way to get the full regular display in one go, with 12 sealed 30th Celebration packs on
            top.
          </li>
          <li>
            <strong>Single blind boxes</strong> are for the rip and the 1 in 144 shot at the secret. Every box still has a pack.
          </li>
          <li>
            <strong>Singles</strong> are for the figures you are missing or the one you love most. Ours are opened only to confirm the
            design, with the card, stand and sealed pack included.
          </li>
        </ul>

        <h2 id="tell-apart">Telling them apart</h2>
        <p>
          Before the box is open there is no way to tell: the boxes are identical. After, the card settles it. Three pairs look alike in
          small photos:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Looks like</th>
                <th scope="col">The difference</th>
              </tr>
            </thead>
            <tbody>
              {LOOKALIKES.map((l) => (
                <tr key={l.a}>
                  <th scope="row">{l.a}</th>
                  <td>{l.b}</td>
                  <td>{l.tell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="display">Displaying them</h2>
        <p>
          Each box comes with its own clear display stand that holds the card upright behind the figure. Keep the
          card in it, since the figure is posed to come out of that exact illustration and a few of them, like 026 and 046, reach past
          the card edge on purpose. Line them up in card order, 017 to 046, and the box side's checklist doubles as a shelf label.
        </p>
        <figure style={{ margin: '24px 0 30px' }}>
          <img
            src={`${SITE_URL}/assets/blog/pikachu-dream-painting-keyart.webp`}
            alt="Pokémon China's key art of the 12 Dream Painting Pikachu figures displayed on white plinths"
            loading="lazy"
            width={1400}
            height={1051}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>
        <p>
          The 30th Celebration pack in each box is a full 6-card pack, and every card in it is a holo. There is one Pikachu Rare in every
          pack, so opening the packs is also a way into the other 18 Pikachu that did not get a figure.
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
      </BlogPostLayout>
    </>
  )
}
