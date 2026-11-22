import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'dream-painting-151-vol-1-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/dream-painting-151-vol-1-${name}.webp`
const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Collect%20151/Cards/0${n}.webp`

// The 12 regular figures, in the order Pokémon China shows them (Pokédex order). Pokémon China's photos
// show each card's name, HP and illustration but not its number, so each card is matched to the same
// illustration in the Collect 151 card list, and the number and illustrator are read off that card.
type Fig = { key: string; name: string; card: string; illus: string; pose: string }
const FIGURES: Fig[] = [
  { key: 'ivysaur', name: 'Ivysaur', card: '002', illus: 'Yuu Nishida', pose: 'Crouched low, leaves spread past the card' },
  { key: 'arcanine', name: 'Arcanine', card: '059', illus: 'Atsushi Furusawa', pose: 'Standing side on, head turned back' },
  { key: 'machoke', name: 'Machoke', card: '067', illus: 'Ryuta Fuse', pose: 'Fists up in a fighting stance' },
  { key: 'seel', name: 'Seel', card: '086', illus: 'aoki', pose: 'Lying flat out in front of the card' },
  { key: 'grimer', name: 'Grimer', card: '088', illus: 'Nisota Niso', pose: 'Rising out of its sludge, hands up' },
  { key: 'gengar', name: 'Gengar', card: '094', illus: 'Tomokazu Komiya', pose: 'Grinning, arms spread wide' },
  { key: 'electrode', name: 'Electrode', card: '101', illus: 'nagimiso', pose: 'A round Electrode with a wide grin' },
  { key: 'exeggcute', name: 'Exeggcute', card: '102', illus: 'Shigenori Negishi', pose: 'Six eggs, each with its own face' },
  { key: 'cubone', name: 'Cubone', card: '104', illus: 'Shinya Komatsu', pose: 'Sitting, holding its bone up' },
  { key: 'chansey', name: 'Chansey', card: '113', illus: 'Taiga Kayama', pose: 'Sitting, with a clover on its head' },
  { key: 'porygon', name: 'Porygon', card: '137', illus: '5ban Graphics', pose: 'Blocky, standing on its short legs' },
  { key: 'dratini', name: 'Dratini', card: '147', illus: 'Sanosuke Sakuma', pose: 'Coiled up, head raised' },
]

function FigureGrid({ figs }: { figs: Fig[] }) {
  return (
    <ul className="card-grid cols-4">
      {figs.map((f) => (
        <li key={f.key}>
          <figure>
            <img
              src={img(f.key)}
              alt={`Collect 151 Dream Painting ${f.name} figure on its stand in front of Collect 151 card ${f.card}/151`}
              loading="lazy"
              width={400}
              height={400}
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
  { id: 'what-it-is', label: 'What is the Collect 151 Dream Painting figure set?' },
  { id: 'lineup', label: 'All 12 regular figures' },
  { id: 'cards', label: 'The card in each box' },
  { id: 'secret', label: 'What is the secret figure?' },
  { id: 'in-the-box', label: 'What comes in a box?' },
  { id: 'odds', label: 'What are the odds of the secret figure?' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was the Collect 151 Dream Painting figure set released?',
    a: 'November 28, 2025, in mainland China. Pokémon China announced it on October 31, 2025.',
  },
  {
    q: 'What is in a Collect 151 Dream Painting blind box?',
    a: 'One random figure, a Poké Ball holo card of the same Pokémon, and two 5-card Collect 151: Journey booster packs (set code 151C).',
  },
  {
    q: 'How many Collect 151 Dream Painting figures are there?',
    a: '13: 12 regular figures and 1 secret. The 12 regulars are Ivysaur, Arcanine, Machoke, Seel, Grimer, Gengar, Electrode, Exeggcute, Cubone, Chansey, Porygon and Dratini.',
  },
  {
    q: 'What is the secret figure?',
    a: 'Machoke carrying potted plants, from the full-art promo card 072/SV-P illustrated by Tetsu Kayama. On the card, Machoke helps with a house move. The secret figure comes with that card.',
  },
  {
    q: 'What are the odds of pulling the secret figure?',
    a: 'Pokémon China gives a production ratio of 143 regular boxes to 1 secret, so about 1 box in 144. The regular Machoke is made slightly less often than the other 11 regulars, at a ratio of 11 to 12.',
  },
  {
    q: 'Which cards are the figures based on?',
    a: 'Collect 151 cards. Each regular figure uses the illustration of one Collect 151 card, from Ivysaur 002/151 to Dratini 147/151. The card in the box is a Poké Ball holo card with the same illustration.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The card in the box and the two Collect 151: Journey packs are both from the Simplified Chinese release.',
  },
]

export const Route = createFileRoute('/blog/dream-painting-151-vol-1-release-news')({
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
  component: DreamPainting151ReleasePost,
})

function DreamPainting151ReleasePost() {
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
    name: 'All 12 regular Collect 151 Dream Painting figures',
    numberOfItems: FIGURES.length,
    itemListElement: FIGURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${f.name} figure, from the Collect 151 card ${f.card}/151 illustration by ${f.illus}`,
      image: img(f.key),
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
        lede="Pokémon China turned 12 Collect 151 cards into figures that stand in front of their own card. Each box of the Collect 151 Dream Painting figure set has one random figure, a Poké Ball holo card of the same Pokémon and two Collect 151: Journey packs, and about 1 box in 144 holds a secret Machoke."
        cta={{
          heading: 'Browse our figure blind boxes',
          body: 'We do not carry this set. Our blind box range includes the Dream Painting Pikachu figures.',
          links: [
            { to: '/shop', search: { subcategory: 'Blind Box' }, label: 'Browse blind boxes' },
            {
              to: '/products/$id',
              params: { id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' },
              label: 'More Dream Painting figures',
              variant: 'ghost',
            },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Collect 151 Dream Painting figure set?</h2>
        <p>
          The Collect 151 Dream Painting figure set (<Zh>绘梦点睛 收集啦151手办套装</Zh>) is a blind box of figures from Pokémon China. It
          went on sale in China on November 28, 2025. Dream Painting (<Zh>绘梦点睛</Zh>) is Pokémon China's figure line based on card
          illustrations. Each figure recreates the Pokémon from one card, including the brushwork of the illustration, and the card stands
          behind it, so the figure looks like it is stepping out of the picture. Pokémon China later used the same idea for the{' '}
          <Link to="/blog/eevee-dream-painting-figures-release-news">Dream Painting Eevee &amp; Friends figures</Link>.
        </p>
        <p>
          This set uses 12 Pokémon from Collect 151, plus one secret figure. Every box has one random figure, a Poké Ball holo card of the
          same Pokémon and two sealed 5-card booster packs of{' '}
          <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey</Link> (set code 151C).
        </p>

        <aside className="fact-box" aria-label="Collect 151 Dream Painting key facts">
          <img
            src={img('box')}
            alt="Collect 151 Dream Painting figure set blind box, with the Gengar figure on the front"
            loading="lazy"
            width={600}
            height={503}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Collect 151 Dream Painting figure set (<Zh>绘梦点睛 收集啦151手办套装</Zh>)</dd>
              <dt>Released</dt>
              <dd>November 28, 2025</dd>
              <dt>Designs</dt>
              <dd>12 + 1 secret</dd>
              <dt>Per box</dt>
              <dd>1 random figure, its matching Poké Ball holo card, 2 Collect 151: Journey packs (5 cards each)</dd>
              <dt>Set code</dt>
              <dd>151C (the booster packs)</dd>
              <dt>Secret odds</dt>
              <dd>143 regular to 1 secret, about 1 box in 144</dd>
              <dt>Secret</dt>
              <dd>Machoke carrying potted plants, promo card 072/SV-P, illustrated by Tetsu Kayama</dd>
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

        <h2 id="lineup">All 12 regular figures</h2>
        <p>
          Pokémon China shows the 12 regulars in Pokédex order, from Ivysaur to Dratini, and Gengar is on the front of the box. Each figure
          follows the pose on its card. Some stay inside the frame, like Arcanine standing with its head turned back. Others reach out past
          the card: Ivysaur's leaves spread wider than the card, Seel lies stretched out in front of it, and Grimer rises out of a pool of
          sludge at its base.
        </p>
        <FigureGrid figs={FIGURES} />
        <p className="table-note">Pokémon China's photos of the 12 regular figures, each on its stand in front of its card.</p>
        <figure style={{ margin: '28px auto', maxWidth: 560 }}>
          <img
            src={img('lineup')}
            alt="All 12 regular Collect 151 Dream Painting figures on their stands, as shown by Pokémon China"
            loading="lazy"
            width={1000}
            height={1371}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>

        <h2 id="cards">The card in each box</h2>
        <p>
          Every figure comes with a card of the same Pokémon. Pokémon China calls it a Poké Ball holo card (<Zh>精灵球闪卡</Zh>). Its photos
          show each card's name, HP and illustration but not its number. Each illustration and HP matches one card in Collect 151, so these
          are the Collect 151 cards the figures come from, in the same order. All 12 are in the main Collect 151 list, which is the same in
          each of our card lists for <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey</Link>,{' '}
          <Link to="/sets/chinese/collect-151-hope">Hope</Link>, <Link to="/sets/chinese/collect-151-surprise">Surprise</Link> and{' '}
          <Link to="/sets/chinese/collect-151-gathering">Gathering</Link>.
        </p>
        <ul className="card-grid cols-4">
          {FIGURES.map((f) => (
            <li key={f.card}>
              <figure>
                <img src={cardImg(f.card)} alt={`${f.name} ${f.card}/151, Collect 151`} loading="lazy" width={300} height={418} />
                <figcaption>
                  <strong>
                    {f.name} {f.card}/151
                  </strong>
                  {f.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="table-note">Card numbers and illustrators are read off the Collect 151 cards with the same illustration.</p>

        <h2 id="secret">What is the secret figure?</h2>
        <p>
          The secret figure is Machoke, from the full-art promo card 072/SV-P illustrated by Tetsu Kayama. Pokémon China calls it a special
          illustration card, and says the illustration packs a whole house move into one scene. Several Machoke carry boxes and plants
          through a house, from the top floor down to the street. The figure is the Machoke at the centre of the card, holding a
          potted plant in one hand and a branching plant in the other. The secret figure comes with that card.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 720 }}>
          <img
            src={img('secret')}
            alt="The secret Collect 151 Dream Painting figure: Machoke carrying potted plants on its stand, next to promo card 072/SV-P by Tetsu Kayama"
            loading="lazy"
            width={1000}
            height={684}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>

        <BuyStrip />

        <h2 id="in-the-box">What comes in a box?</h2>
        <p>
          Pokémon China lists a figure, its card and two booster packs in each box. Its photos show the figure and card on a clear stand
          with a white base, and it invites you to put the two together on the stand.
        </p>
        <ul>
          <li>1 random figure, one of 13</li>
          <li>A Poké Ball holo card of the same Pokémon (the secret comes with promo card 072/SV-P)</li>
          <li>
            2 sealed <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey</Link> booster packs of 5 cards each
          </li>
        </ul>
        <p>
          The side of the box shows all 12 regular figures with their names, plus a silhouette with a question mark for the secret.
        </p>

        <h2 id="odds">What are the odds of the secret figure?</h2>
        <p>
          About 1 box in 144. Pokémon China publishes the production ratio: regular boxes outnumber secret boxes 143 to 1. The regulars are
          not quite equal. Pokémon China gives the regular Machoke a ratio of 11 to 12 against each of the other 11 regulars, so it is a
          little harder to find than the rest.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Odds for each Collect 151 Dream Painting figure</caption>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Share of boxes</th>
                <th scope="col">About 1 box in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Each of the other 11 regulars</th>
                <td>8.33%</td>
                <td>12</td>
              </tr>
              <tr>
                <th scope="row">Regular Machoke</th>
                <td>7.64%</td>
                <td>13.1</td>
              </tr>
              <tr>
                <th scope="row">Secret Machoke</th>
                <td>0.69%</td>
                <td>144</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">
          These figures come from Pokémon China's 143 to 1 and 11 to 12 production ratios. They are averages, not guarantees.
        </p>
        <p>
          Twelve random boxes, one for each regular design, have about an 8% chance of holding the secret. Twelve boxes will not always
          give you all twelve regulars, since each box is random.
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
          The lineup mixes favorites like Gengar and Dratini with less obvious picks like Grimer, Exeggcute and Porygon, and the figures
          stay close to 12 very different illustration styles. The secret is a good choice: a busy promo illustration turned into one
          Machoke with its arms full. Two Collect 151 packs in every box are a welcome extra.
        </p>
      </BlogPostLayout>
    </>
  )
}
