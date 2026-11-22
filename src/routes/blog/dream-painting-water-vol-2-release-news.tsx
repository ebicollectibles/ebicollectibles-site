import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'dream-painting-water-vol-2-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/dream-painting-water-vol-2-${name}.webp`

// The 12 regular figures, in the order Pokémon China shows them. Its photos show each card's name, HP and
// illustration. Where the number and illustrator are hidden behind the figure, the card is matched to the
// same illustration and HP in our card lists and read off that card. Poliwag and Corphish come from older
// sets we have no card list for: their set codes and numbers are from 52poke, and Corphish's illustrator
// is visible in Pokémon China's photo.
type SetLink =
  | '/sets/chinese/collect-151-journey'
  | '/sets/chinese/eternal-birth-csv1'
  | '/sets/chinese/fearless-terastal-csv3'
  | '/sets/chinese/black-crystal-blaze-csv5'
  | '/sets/chinese/blade-awakening-csv7'
type Fig = { key: string; name: string; card: string; set: string; setLink?: SetLink; illus: string; pose: string }
const FIGURES: Fig[] = [
  { key: 'squirtle', name: 'Squirtle', card: '007/151', set: 'Collect 151', setLink: '/sets/chinese/collect-151-journey', illus: 'kantaro', pose: 'Stretched out in front of the card, mouth open' },
  { key: 'poliwag', name: 'Poliwag', card: '016', set: 'CS5.5C', illus: 'Not shown', pose: 'Sitting up, tail raised behind it' },
  { key: 'slowbro', name: 'Slowbro', card: '030/127', set: 'Eternal Birth (CSV1C)', setLink: '/sets/chinese/eternal-birth-csv1', illus: 'Shinji Kanda', pose: 'Lying flat, with Shellder on its tail' },
  { key: 'shellder', name: 'Shellder', card: '090/151', set: 'Collect 151', setLink: '/sets/chinese/collect-151-journey', illus: 'Nelnal', pose: 'Shell open, tongue out' },
  { key: 'goldeen', name: 'Goldeen', card: '118/151', set: 'Collect 151', setLink: '/sets/chinese/collect-151-journey', illus: 'SIE NANAHARA', pose: 'Fins spread, held up on a clear rod' },
  { key: 'starmie', name: 'Starmie', card: '121/151', set: 'Collect 151', setLink: '/sets/chinese/collect-151-journey', illus: 'Arai Kiriko', pose: 'Covering most of the card' },
  { key: 'corphish', name: 'Corphish', card: '030', set: 'CS5DC', illus: 'Sekio', pose: 'Claws up, standing on its legs' },
  { key: 'luvdisc', name: 'Luvdisc', card: '036/130', set: 'Fearless Terastal (CSV3C)', setLink: '/sets/chinese/fearless-terastal-csv3', illus: 'ryoma uratsuka', pose: 'Held up on a clear rod' },
  { key: 'golisopod', name: 'Golisopod', card: '035/129', set: 'Black Crystal Blaze (CSV5C)', setLink: '/sets/chinese/black-crystal-blaze-csv5', illus: 'nagimiso', pose: 'Crouched, spikes reaching past the card' },
  { key: 'cramorant', name: 'Cramorant', card: '066/204', set: 'Blade Awakening (CSV7C)', setLink: '/sets/chinese/blade-awakening-csv7', illus: 'OKACHEKE', pose: 'Beak open, wings spread' },
  { key: 'wugtrio', name: 'Wugtrio', card: '039/127', set: 'Eternal Birth (CSV1C)', setLink: '/sets/chinese/eternal-birth-csv1', illus: 'KIYOTAKA OSHIYAMA', pose: 'Three heads rising around a rock' },
  { key: 'palafin', name: 'Palafin', card: '071/204', set: 'Blade Awakening (CSV7C)', setLink: '/sets/chinese/blade-awakening-csv7', illus: 'DOM', pose: 'Arms raised above its head' },
]

function FigureGrid({ figs }: { figs: Fig[] }) {
  return (
    <ul className="card-grid cols-4">
      {figs.map((f) => (
        <li key={f.key}>
          <figure>
            <img
              src={img(f.key)}
              alt={`Dream Painting Water ${f.name} figure on its stand in front of its card`}
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
  { id: 'what-it-is', label: 'What is the Dream Painting Water figure set?' },
  { id: 'lineup', label: 'All 12 regular figures' },
  { id: 'cards', label: 'The card in each box' },
  { id: 'secret', label: 'What is the secret figure?' },
  { id: 'in-the-box', label: 'What comes in a box?' },
  { id: 'odds', label: 'What are the odds of the secret figure?' },
  { id: 'vol-1', label: 'How Vol.2 compares with Vol.1' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was the Dream Painting Water figure set released?',
    a: 'April 24, 2026, from 10:00, in mainland China. Pokémon China announced it on April 13, 2026.',
  },
  {
    q: 'Is it called Dream Painting Vol. 2?',
    a: 'Not by Pokémon China. Its name is 绘梦点睛 水生态手办套装, which translates as Dream Painting Water Pokémon Figure Set, with no number. Fans and shops call it Vol. 2 because it is the second Dream Painting set, after the Collect 151 set.',
  },
  {
    q: 'What is in a Dream Painting Water blind box?',
    a: 'One random figure, a card of the same Pokémon, and two 5-card Brilliant Fantasy booster packs (set code CSV8C). The packs are Brilliant Fantasy, not Collect 151.',
  },
  {
    q: 'How many Dream Painting Water figures are there?',
    a: '13: 12 regular figures and 1 secret, all Water types. The 12 regulars are Squirtle, Poliwag, Slowbro, Shellder, Goldeen, Starmie, Corphish, Luvdisc, Golisopod, Cramorant, Wugtrio and Palafin.',
  },
  {
    q: 'What is the secret figure?',
    a: 'Wailord, from the art illustration holo card 241/SV-P illustrated by Katsunori Sato. The secret figure comes with that card.',
  },
  {
    q: 'What are the odds of pulling the secret figure?',
    a: 'Pokémon China gives a production ratio of 143 regular boxes to 1 secret, so about 1 box in 144. The 12 regular figures are made in equal numbers.',
  },
  {
    q: 'How much does it cost in China?',
    a: "Pokémon China's suggested retail price in China is ¥88.",
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The card in the box and the two Brilliant Fantasy packs are both from the Simplified Chinese release.',
  },
]

export const Route = createFileRoute('/blog/dream-painting-water-vol-2-release-news')({
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
  component: DreamPaintingWaterReleasePost,
})

function DreamPaintingWaterReleasePost() {
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
    name: 'All 12 regular Dream Painting Water figures',
    numberOfItems: FIGURES.length,
    itemListElement: FIGURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${f.name} figure, from card ${f.card} (${f.set})`,
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
        lede="Pokémon China's second Dream Painting figure set turns 12 Water-type cards into figures that stand in front of their own card. Each box has one random figure, a card of the same Pokémon and two Brilliant Fantasy packs, and about 1 box in 144 holds a secret Wailord."
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
        <h2 id="what-it-is">What is the Dream Painting Water figure set?</h2>
        <p>
          The Dream Painting Water figure set (<Zh>绘梦点睛 水生态手办套装</Zh>) is a blind box of figures from Pokémon China. It went on
          sale in China on April 24, 2026. Dream Painting (<Zh>绘梦点睛</Zh>) is Pokémon China's figure line based on card illustrations:
          each figure recreates the Pokémon from one card, with the brushwork and colours of the illustration, and the card stands behind
          it on a display stand.
        </p>
        <p>
          It is the second Dream Painting set, after the{' '}
          <Link to="/blog/dream-painting-151-vol-1-release-news">Collect 151 Dream Painting figure set</Link>, so fans and shops call it
          Vol. 2. Pokémon China does not number the sets. This one is all Water types: Pokémon China says it gathers Pokémon that live in
          ponds, lakes and the sea. Every box has one random figure, a card of the same Pokémon and two sealed 5-card booster packs of{' '}
          <Link to="/sets/chinese/brilliant-fantasy-csv8">Brilliant Fantasy</Link> (set code CSV8C).
        </p>

        <aside className="fact-box" aria-label="Dream Painting Water key facts">
          <img
            src={img('box')}
            alt="Dream Painting Water figure set blind box, with the Starmie figure on the front"
            loading="lazy"
            width={600}
            height={501}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Dream Painting Water figure set (<Zh>绘梦点睛 水生态手办套装</Zh>)</dd>
              <dt>Released</dt>
              <dd>April 24, 2026</dd>
              <dt>Designs</dt>
              <dd>12 + 1 secret</dd>
              <dt>Per box</dt>
              <dd>1 random figure, a card of the same Pokémon, 2 Brilliant Fantasy packs (5 cards each)</dd>
              <dt>Set code</dt>
              <dd>CSV8C (the booster packs)</dd>
              <dt>Secret odds</dt>
              <dd>143 regular to 1 secret, about 1 box in 144</dd>
              <dt>Secret</dt>
              <dd>Wailord, art illustration holo card 241/SV-P, illustrated by Katsunori Sato</dd>
              <dt>Price in China</dt>
              <dd>¥88 (Pokémon China's suggested retail price)</dd>
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
          Pokémon China shows the 12 regulars in Pokédex order, from Squirtle to Palafin, and Starmie is on the front of the box. Each
          figure follows the pose on its card. Some sit low in front of the card, like Shellder with its tongue out and Slowbro lying flat
          with Shellder on its tail. Others are held up on a clear rod, like Goldeen and Luvdisc, and Starmie and Golisopod are big enough
          to cover most of their card.
        </p>
        <FigureGrid figs={FIGURES} />
        <p className="table-note">Pokémon China's photos of the 12 regular figures, each on its stand in front of its card.</p>

        <h2 id="cards">The card in each box</h2>
        <p>
          Every figure comes with a card of the same Pokémon. Unlike Vol. 1, where all 12 cards came from Collect 151, these cards come from
          several sets: four from Collect 151, six from Scarlet &amp; Violet main sets and two from older sets. Pokémon China's photos show each card's name, HP and illustration, but the figure often hides the number. Where it does,
          the card below is the one in our card lists with the same illustration and HP, and the number and illustrator are read off that
          card.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-cards" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-cards" className="sr-only">
              The card that comes with each Dream Painting Water figure
            </caption>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Card</th>
                <th scope="col">Set</th>
                <th scope="col">Illustrator</th>
              </tr>
            </thead>
            <tbody>
              {FIGURES.map((f) => (
                <tr key={f.key}>
                  <th scope="row">{f.name}</th>
                  <td>{f.card}</td>
                  <td>{f.setLink ? <Link to={f.setLink}>{f.set}</Link> : f.set}</td>
                  <td>{f.illus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Poliwag and Corphish are from older sets we do not have card lists for. Their set codes and numbers are from the fan wiki 52poke.
          Corphish's illustrator also shows in Pokémon China's photo; Poliwag's is hidden behind the figure. The four Collect 151
          cards are in the main Collect 151 list, which is the same in all four Collect 151 releases.
        </p>

        <h2 id="secret">What is the secret figure?</h2>
        <p>
          The secret figure is Wailord, from the promo card 241/SV-P illustrated by Katsunori Sato. Pokémon China calls it an art
          illustration holo card (<Zh>艺术插画闪卡</Zh>). In the illustration, Wailord rises from a colourful sea floor towards the surface,
          so large that the boats and islands above it look tiny. The figure is Wailord upright on a clear rod in front of the card, with
          its tail curling out to the side. The secret figure comes with that card.
        </p>
        <p>
          The card is a Stage 1 Wailord with 240 HP. Pokémon China notes that it has regulation mark I and can be used in its current
          official events.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 720 }}>
          <img
            src={img('secret')}
            alt="The secret Dream Painting Water figure: Wailord on its stand, next to the art illustration holo card 241/SV-P by Katsunori Sato"
            loading="lazy"
            width={1000}
            height={725}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption className="table-note">Pokémon China's image of the secret Wailord figure and its card.</figcaption>
        </figure>

        <h2 id="in-the-box">What comes in a box?</h2>
        <p>Pokémon China lists three items in each box:</p>
        <ul>
          <li>1 random figure, one of 13</li>
          <li>A card of the same Pokémon (the secret comes with the art illustration holo card 241/SV-P)</li>
          <li>
            2 sealed <Link to="/sets/chinese/brilliant-fantasy-csv8">Brilliant Fantasy</Link> booster packs of 5 cards each
          </li>
        </ul>
        <p>
          Some shops list the packs as Collect 151, as in Vol. 1. Pokémon China's page names Brilliant Fantasy (<Zh>璀璨诡幻</Zh>), the
          set that released on March 13, 2026 with Milotic on the pack. Our{' '}
          <Link to="/blog/brilliant-fantasy-release-news">Brilliant Fantasy release post</Link> covers it. The side of the box shows all
          12 regular figures with their names, plus a silhouette with a question mark for the secret.
        </p>

        <h2 id="odds">What are the odds of the secret figure?</h2>
        <p>
          About 1 box in 144. Pokémon China publishes the production ratio: regular boxes outnumber secret boxes 143 to 1. It also says the
          12 regular figures are made in equal numbers.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">Odds for each Dream Painting Water figure</caption>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Share of boxes</th>
                <th scope="col">About 1 box in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Each of the 12 regulars</th>
                <td>8.28%</td>
                <td>12.1</td>
              </tr>
              <tr>
                <th scope="row">Secret Wailord</th>
                <td>0.69%</td>
                <td>144</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">These figures come from Pokémon China's 143 to 1 production ratio. They are averages, not guarantees.</p>
        <p>
          Twelve random boxes have about an 8% chance of holding the secret. Twelve boxes will not always give you all twelve regulars,
          since each box is random.
        </p>

        <h2 id="vol-1">How Vol.2 compares with Vol.1</h2>
        <p>
          Vol.2 follows the <Link to="/blog/dream-painting-151-vol-1-release-news">Collect 151 Dream Painting figure set</Link>, which
          released on November 28, 2025. Both have 12 regular figures and 1 secret, a figure on a stand in front of its card, two 5-card
          packs per box and the same 143 to 1 secret ratio.
        </p>
        <ul>
          <li>
            <strong>Theme.</strong> Vol.1 takes 12 Pokémon from Collect 151. Vol.2 is all Water types, with cards from several sets.
          </li>
          <li>
            <strong>Packs.</strong> Vol.1 has two Collect 151: Journey packs (151C). Vol.2 has two Brilliant Fantasy packs (CSV8C).
          </li>
          <li>
            <strong>Secret.</strong> Vol.1's secret is Machoke from promo 072/SV-P by Tetsu Kayama. Vol.2's is Wailord from promo
            241/SV-P by Katsunori Sato.
          </li>
          <li>
            <strong>Regular odds.</strong> In Vol.1 the regular Machoke is made a little less often than the others, at 11 to 12. In Vol.2
            all 12 regulars are made in equal numbers.
          </li>
        </ul>
        <p>
          Pokémon China has since used the same idea for the{' '}
          <Link to="/blog/eevee-dream-painting-figures-release-news">Dream Painting Eevee &amp; Friends figures</Link> and the{' '}
          <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures</Link>.
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
          The Water theme runs from Squirtle and Starmie to newer picks like Wugtrio and Palafin. Taking cards from
          several sets mixes Collect 151 illustrations with ones from newer and older sets. Wailord is a good secret: a huge Pokémon on the card,
          made as a tall figure.
        </p>
      </BlogPostLayout>
    </>
  )
}
