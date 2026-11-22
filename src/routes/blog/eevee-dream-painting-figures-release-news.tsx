import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'eevee-dream-painting-figures-release-news')!

const figImg = (n: string) => `${SITE_URL}/assets/blog/eevee-dream-painting-figures-${n}.webp`
const cardImg = (folder: string, n: string) => `${R2_IMAGE_HOST}/Chinese/${folder}/Cards/0${n}.webp`

// The 9 regular figures, in the order Pokémon China shows them. Card numbers and illustrators are read
// off the cards: Vaporeon, Jolteon, Umbreon and Glaceon show their numbers on Pokémon China's photos;
// the rest are matched to the same illustration in each set's card list.
type Fig = { key: string; name: string; set: string; folder: string; card: string; illus: string; pose: string }
const FIGURES: Fig[] = [
  { key: 'eevee', name: 'Eevee', set: 'Reward Round', folder: 'Reward%20Round%20CSV4', card: '103/129', illus: 'ryoma uratsuka', pose: 'Mid-stride, one front paw reaching forward' },
  { key: 'vaporeon', name: 'Vaporeon', set: 'Collect 151', folder: 'Collect%20151', card: '134/151', illus: 'kirisAki', pose: 'Leaping out of the card, tail curled up behind it' },
  { key: 'jolteon', name: 'Jolteon', set: 'Terastal Gathering', folder: 'Crystal%20Gathering', card: '057/208', illus: 'Nisota Niso', pose: 'Standing side on, spiky fur raised' },
  { key: 'flareon', name: 'Flareon', set: 'Collect 151', folder: 'Collect%20151', card: '136/151', illus: 'Ryota Murayama', pose: 'Rolled up inside its huge, fluffy tail' },
  { key: 'espeon', name: 'Espeon', set: 'Reward Round', folder: 'Reward%20Round%20CSV4', card: '048/129', illus: 'Cona Nitanda', pose: 'Walking, one paw raised, tail curled high' },
  { key: 'umbreon', name: 'Umbreon', set: 'Terastal Gathering', folder: 'Crystal%20Gathering', card: '103/208', illus: 'motozo', pose: 'Crouched low, one front leg stretched out' },
  { key: 'leafeon', name: 'Leafeon', set: 'Terastal Gathering', folder: 'Crystal%20Gathering', card: '005/208', illus: 'Iori Suzuki', pose: 'Crouched down, leaf tail up behind it' },
  { key: 'glaceon', name: 'Glaceon', set: 'Blade Awakening', folder: 'Blade%20Awakening', card: '061/204', illus: 'rika', pose: 'Stepping forward, ribbons spread wide' },
  { key: 'sylveon', name: 'Sylveon', set: 'Brilliant Fantasy', folder: 'Brilliant%20Fantasy', card: '087/207', illus: 'Kuroimori', pose: 'Lunging forward, feelers trailing behind' },
]

function FigureGrid({ figs }: { figs: Fig[] }) {
  return (
    <ul className="card-grid cols-3">
      {figs.map((f) => (
        <li key={f.key}>
          <figure>
            <img
              src={figImg(f.key)}
              alt={`Dream Painting ${f.name} figure on its stand in front of ${f.set} card ${f.card}`}
              loading="lazy"
              width={600}
              height={600}
              style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
            />
            <figcaption>
              <strong>{f.name}</strong>
              {f.pose}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const TOC = [
  { id: 'what-it-is', label: 'What are the Dream Painting Eevee & Friends figures?' },
  { id: 'lineup', label: 'All 9 regular figures' },
  { id: 'cards', label: 'The card in each box' },
  { id: 'secret', label: 'What is the secret figure?' },
  { id: 'in-the-box', label: 'What comes in a box?' },
  { id: 'odds', label: 'What are the odds of the secret figure?' },
  { id: 'collecting', label: 'Blind box or single figure?' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

// Buying options side by side.
const OPTIONS = [
  { row: 'Which figure', box: 'Random, one of 10', single: 'The one you choose' },
  { row: 'Secret figure', box: 'About 1 box in 81', single: 'Not possible' },
  { row: 'Card, stand and pack', box: 'Included', single: 'Included' },
  { row: 'Best for', box: 'The surprise, or building the set', single: 'One Eeveelution you want' },
]

const FAQ = [
  {
    q: 'When were the Dream Painting Eevee & Friends figures released?',
    a: 'August 7, 2026, in mainland China. Pokémon China announced them on July 27, 2026.',
  },
  {
    q: 'What is in a Dream Painting Eevee & Friends blind box?',
    a: 'One random figure, the Pokémon card that figure is based on, and one sealed Terastal Gathering (CSV9.5C) booster pack. Pokémon China shows the figure and card on a clear display stand.',
  },
  {
    q: 'How many Dream Painting Eevee & Friends figures are there?',
    a: '10: 9 regular figures and 1 secret. The 9 regulars are Eevee, Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon and Sylveon.',
  },
  {
    q: 'What is the secret figure?',
    a: 'A sleeping Eevee lying on its back, from the promo card 299/SV-P illustrated by Makura Tami. The figure recreates part of the room around it, and the box comes with that card.',
  },
  {
    q: 'What are the odds of pulling the secret figure?',
    a: 'Pokémon China gives a production ratio of 80 regular boxes to 1 secret, so about 1 box in 81. The 9 regular figures are made in equal numbers, so each one is about 1 box in 9.',
  },
  {
    q: 'Which sets are the cards from?',
    a: 'Five sets. Eevee and Espeon are from Reward Round, Vaporeon and Flareon from Collect 151, Jolteon, Umbreon and Leafeon from Terastal Gathering, Glaceon from Blade Awakening and Sylveon from Brilliant Fantasy.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The card in the box and the Terastal Gathering pack are both from the Simplified Chinese release.',
  },
]

export const Route = createFileRoute('/blog/eevee-dream-painting-figures-release-news')({
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
  component: EeveeDreamPaintingReleasePost,
})

function EeveeDreamPaintingReleasePost() {
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
    name: 'All 9 regular Dream Painting Eevee & Friends figures',
    numberOfItems: FIGURES.length,
    itemListElement: FIGURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${f.name} figure, from ${f.set} card ${f.card} by ${f.illus}`,
      image: figImg(f.key),
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
        lede="Pokémon China turned Eevee and eight Eeveelution cards into figures that stand in front of their own card. Each box has one random figure, its card, a display stand and a Terastal Gathering pack, and about 1 box in 81 holds a secret sleeping Eevee."
        cta={{
          heading: 'Shop the Eevee & Friends figures',
          body: 'A random blind box, or Espeon, Flareon or Leafeon as a single.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-eevee-friends-dream-painting-figures-blind-box' }, label: 'Shop the blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-eevee-friends-dream-painting-figures-espeon' }, label: 'Shop Espeon', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-eevee-friends-dream-painting-figures-flareon' }, label: 'Shop Flareon', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-eevee-friends-dream-painting-figures-leafeon' }, label: 'Shop Leafeon', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Dream Painting Eevee &amp; Friends figures?</h2>
        <p>
          The Dream Painting Eevee &amp; Friends Figure Set (<Zh>绘梦点睛 伊布“们”的手办套装</Zh>) is a blind box of Eevee and Eeveelution
          figures from Pokémon China. It went on sale in China on August 7, 2026. Dream Painting (<Zh>绘梦点睛</Zh>) is Pokémon China's
          figure line based on card illustrations, the same line as the{' '}
          <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures</Link>. Each figure recreates the
          Pokémon from one card, and the card stands behind it, so the figure looks like it is stepping out of the picture.
        </p>
        <p>
          This release has Eevee and all eight of its evolutions, plus one secret figure. Every box has one random figure, the card it is
          based on and a sealed booster pack of Terastal Gathering (set code CSV9.5C).
        </p>

        <aside className="fact-box" aria-label="Dream Painting Eevee & Friends key facts">
          <img
            src={`${SITE_URL}/assets/blog/eevee-dream-painting-figures-box.webp`}
            alt="Dream Painting Eevee & Friends Figure Set blind box, with Eevee on the front"
            loading="lazy"
            width={600}
            height={501}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Dream Painting Eevee &amp; Friends Figure Set (<Zh>绘梦点睛 伊布“们”的手办套装</Zh>)</dd>
              <dt>Released</dt>
              <dd>August 7, 2026</dd>
              <dt>Designs</dt>
              <dd>9 + 1 secret</dd>
              <dt>Per box</dt>
              <dd>1 random figure, its matching card, 1 Terastal Gathering booster pack</dd>
              <dt>Set code</dt>
              <dd>CSV9.5C (the booster pack)</dd>
              <dt>Secret odds</dt>
              <dd>80 regular to 1 secret, about 1 box in 81</dd>
              <dt>Secret</dt>
              <dd>Sleeping Eevee, promo card 299/SV-P, illustrated by Makura Tami</dd>
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

        <h2 id="lineup">All 9 regular figures</h2>
        <p>
          Each figure follows the pose on its card. Some stay inside the frame, like Espeon walking past with its tail curled high. Others
          reach out past the card: Vaporeon leaps forward with its tail curled behind it, Glaceon spreads its ribbons wider than the card,
          and Flareon is rolled up in a tail so big it spills past the edge of the card.
        </p>
        <FigureGrid figs={FIGURES} />
        <p className="table-note">Pokémon China's photos of the 9 regular figures, each on its stand in front of its card.</p>

        <h2 id="cards">The card in each box</h2>
        <p>
          Every figure comes with the card it is based on. The cards come from five sets. Three of them, Jolteon, Umbreon and Leafeon, are
          from <Link to="/blog/terastal-gathering-release-news">Terastal Gathering</Link>, the same set as the pack in the box. Eevee and
          Espeon are from <Link to="/blog/reward-round-release-news">Reward Round</Link>, Vaporeon and Flareon from Collect 151, Glaceon
          from <Link to="/blog/blade-awakening-release-news">Blade Awakening</Link> and Sylveon from{' '}
          <Link to="/blog/brilliant-fantasy-release-news">Brilliant Fantasy</Link>.
        </p>
        <ul className="card-grid cols-3">
          {FIGURES.map((f) => (
            <li key={f.card}>
              <figure>
                <img src={cardImg(f.folder, f.card.slice(0, 3))} alt={`${f.name} ${f.card}, ${f.set}`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>
                    {f.name} {f.card}
                  </strong>
                  {f.set} · {f.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="secret">What is the secret figure?</h2>
        <p>
          The secret figure is Eevee asleep on its back, from the full-art promo card 299/SV-P illustrated by Makura Tami. On the card,
          Eevee sleeps in a room full of plush toys. The figure keeps the sleeping pose and part of the scene: a round cushion behind it,
          a Pikachu plush, a Voltorb plush and a small photo of Eevee. The secret figure comes with that card.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 720 }}>
          <img
            src={`${SITE_URL}/assets/blog/eevee-dream-painting-figures-secret.webp`}
            alt="The secret Dream Painting figure: a sleeping Eevee on its stand, next to promo card 299/SV-P by Makura Tami"
            loading="lazy"
            width={1200}
            height={794}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>

        <BuyStrip />

        <h2 id="in-the-box">What comes in a box?</h2>
        <p>
          Pokémon China lists a figure, its card and a booster pack in each box, and its photos show the clear stand that the figure and
          card sit on.
        </p>
        <ul>
          <li>1 random figure, one of 10</li>
          <li>The Pokémon card that figure is based on</li>
          <li>A clear display stand: the card stands at the back, the figure in front</li>
          <li>
            1 sealed <Link to="/blog/terastal-gathering-release-news">Terastal Gathering</Link> booster pack
          </li>
        </ul>
        <p>
          The side of the box shows all 9 regular figures with their names, plus a silhouette with a question mark for the secret.
        </p>

        <h2 id="odds">What are the odds of the secret figure?</h2>
        <p>
          About 1 box in 81. Pokémon China publishes the production ratio: the 9 regular figures are made in equal numbers, and regular
          boxes outnumber secret boxes 80 to 1. Each regular figure is about 1 box in 9.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Odds for each Dream Painting Eevee &amp; Friends figure</caption>
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
                <td>10.97%</td>
                <td>9.1</td>
              </tr>
              <tr>
                <th scope="row">Secret sleeping Eevee</th>
                <td>1.23%</td>
                <td>81</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">These figures come from Pokémon China's 80 to 1 production ratio. They are averages, not guarantees.</p>
        <p>
          Nine random boxes, one for each regular design, have about an 11% chance of holding the secret. Nine boxes will not always give
          you all nine regulars, since each box is random.
        </p>

        <h2 id="collecting">Blind box or single figure?</h2>
        <p>
          It depends on whether you want the surprise or one Eeveelution in particular. A blind box is random and is the only way to get
          the secret. Espeon, Flareon and Leafeon are also listed on their own, so you can pick the one you want.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-options" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-options" className="sr-only">
              A blind box compared with a single figure
            </caption>
            <thead>
              <tr>
                <td />
                <th scope="col">Blind box</th>
                <th scope="col">Single figure</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((o) => (
                <tr key={o.row}>
                  <th scope="row">{o.row}</th>
                  <td>{o.box}</td>
                  <td>{o.single}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The singles:{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-eevee-friends-dream-painting-figures-espeon' }}>
            Espeon
          </Link>
          ,{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-eevee-friends-dream-painting-figures-flareon' }}>
            Flareon
          </Link>{' '}
          and{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-eevee-friends-dream-painting-figures-leafeon' }}>
            Leafeon
          </Link>
          .
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these on August 7, 2026, too:</p>
        <ul>
          <li>
            <strong>Gem Pack Vol. 6.</strong> The sixth Gem Pack booster set, led by Applin. Our{' '}
            <Link to="/blog/gem-vol-6-release-news">Gem Vol. 6 release post</Link> covers it.
          </li>
          <li>
            <strong>First Partner Set Vol.3.</strong> A blind box with one of 9 first partner cards from Hoenn, Kalos and Paldea, a display
            frame and a Chasing Glory pack. Our <Link to="/blog/first-partner-30th-vol-3-release-news">First Partner Set Vol.3 post</Link>{' '}
            covers it.
          </li>
        </ul>

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
          With 9 regular designs, this is a smaller set to finish than the 12 Pikachu figures, and Eevee with all eight evolutions makes a
          complete family on the shelf. The sleeping Eevee is a good pick for the secret: it brings part of the card's room along with it,
          so it looks like a small scene.
        </p>
      </BlogPostLayout>
    </>
  )
}
