import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-first-partner-display-sets-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/collect-151-first-partner-display-${name}.webp`

// Pokémon China's contents list, in its order. All three sets hold the same items, in their own Pokémon.
const CONTENTS = [
  { item: 'Holo promo card', qty: '1', note: 'Bulbasaur, Charmander or Squirtle: Poké Ball pattern, or Master Ball pattern in 1 of every 100' },
  { item: 'Paper card display frame', qty: '1', note: 'Green, red or blue, to match the Pokémon' },
  { item: 'Collect 151: Journey booster pack', qty: '1', note: 'Set code 151C, 5 cards' },
  { item: 'Collect 151: Hope booster pack', qty: '1', note: 'Set code 151C, 5 cards' },
  { item: 'Collect 151: Surprise booster pack', qty: '1', note: 'Set code 151C, 5 cards' },
]

const PROMOS = [
  { name: 'Bulbasaur', pokeBall: '066/SV-P', masterBall: '069/SV-P', illus: 'OKACHEKE', frame: 'Green' },
  { name: 'Charmander', pokeBall: '067/SV-P', masterBall: '070/SV-P', illus: 'NC Empire', frame: 'Red' },
  { name: 'Squirtle', pokeBall: '068/SV-P', masterBall: '071/SV-P', illus: 'Gemi', frame: 'Blue' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Collect 151 First Partner display sets?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promos', label: 'The Bulbasaur, Charmander and Squirtle promos' },
  { id: 'master-ball', label: 'The Master Ball pattern versions' },
  { id: 'frame', label: 'The display frame' },
  { id: 'packs', label: 'The 3 Collect 151 packs' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Collect 151 First Partner display sets?',
    a: 'Three official Pokémon TCG sets from Pokémon China: Bulbasaur, Charmander and Squirtle. Their Chinese name is 收集啦151 最初的伙伴展示套装. Each holds a holo promo card of its Pokémon with a new illustration, a paper card display frame in a matching colour, and one 5-card pack each of Collect 151: Journey, Hope and Surprise.',
  },
  {
    q: 'When were the First Partner display sets released?',
    a: 'August 22, 2025. Pokémon China announced them on July 25, 2025.',
  },
  {
    q: 'Which promo cards come in the sets?',
    a: 'Bulbasaur 066/SV-P by OKACHEKE, Charmander 067/SV-P by NC Empire and Squirtle 068/SV-P by Gemi, each with a Poké Ball pattern. The Master Ball pattern versions are 069/SV-P, 070/SV-P and 071/SV-P.',
  },
  {
    q: 'How rare are the Master Ball pattern promos?',
    a: 'Pokémon China gives a production ratio of 99 to 1. Each set has one promo, and 1 in every 100 is the Master Ball pattern in place of the Poké Ball pattern.',
  },
  {
    q: 'Which booster packs are in each set?',
    a: 'One 5-card pack each of Collect 151: Journey, Collect 151: Hope and Collect 151: Surprise (set code 151C), which is 15 cards.',
    links: [
      { to: '/sets/chinese/collect-151-journey', label: 'Collect 151: Journey' },
      { to: '/sets/chinese/collect-151-hope', label: 'Collect 151: Hope' },
      { to: '/sets/chinese/collect-151-surprise', label: 'Collect 151: Surprise' },
    ],
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The promo card and all 3 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Are these sets sold under other names?',
    a: 'Yes. Pokémon China has no English name for them, so shops translate it differently. The 151 First Partner Display Box is the same product.',
  },
]
// Card list links shown after an FAQ answer, and added to its JSON-LD text.
type FaqLink = { to: string; label: string }
const faqLinksText = (links?: readonly FaqLink[]) =>
  links && links.length
    ? ` See the card list for ${links.map((l) => l.label).join(', ').replace(/, ([^,]*)$/, ' and $1')}.`
    : ''
function FaqLinks({ links }: { links?: readonly FaqLink[] }) {
  if (!links || !links.length) return null
  return (
    <>
      {' '}See the card list for{' '}
      {links.map((l, i) => (
        <span key={l.to}>
          {i > 0 && (i === links.length - 1 ? ' and ' : ', ')}
          <Link to={l.to}>{l.label}</Link>
        </span>
      ))}
      .
    </>
  )
}


export const Route = createFileRoute('/blog/collect-151-first-partner-display-sets-release-news')({
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
  component: Collect151FirstPartnerDisplayPost,
})

function Collect151FirstPartnerDisplayPost() {
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
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a + faqLinksText('links' in f ? f.links : undefined) } })),
  }
  const contentsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "What comes in each Chinese Collect 151 First Partner display set (Bulbasaur, Charmander, Squirtle)",
    numberOfItems: CONTENTS.length,
    itemListElement: CONTENTS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.qty} x ${c.item}` })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contentsJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China's Collect 151 First Partner display sets released on August 22, 2025, in three versions: Bulbasaur, Charmander and Squirtle. This post covers what is in each one: a holo promo with a new illustration, a display frame and 3 Collect 151 packs."
        cta={{
          heading: 'Looking for Chinese special products?',
          body: 'Browse our gift boxes and special sets, or see the full Collect 151 card list.',
          links: [
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products' },
            { to: '/sets/chinese/collect-151-surprise', label: 'See the Collect 151 card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Collect 151 First Partner display sets?</h2>
        <p>
          They are three official Simplified Chinese Pokémon TCG sets from Pokémon China, released on August 22, 2025. Their Chinese name is{' '}
          <Zh>收集啦151 最初的伙伴展示套装</Zh>, which translates as Collect 151 First Partner Display Set. The three versions are Bulbasaur,
          Charmander and Squirtle, the first partners of the Kanto region.
        </p>
        <p>
          Each set holds a holo promo card of its Pokémon, which Pokémon China describes as a new illustration, and a paper frame to display
          it in. It also has one 5-card pack each of Collect 151: Journey, Hope and Surprise. Pokémon China invites you to put the card in the
          frame to remember meeting your first partner and the start of your adventure.
        </p>

        <aside className="fact-box" aria-label="Collect 151 First Partner display set key facts">
          {/* Same card as in the promo section below, where it is described, so this copy is decorative */}
          <img src={img('charmander-poke-ball')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Collect 151 First Partner Display Set (<Zh>收集啦151 最初的伙伴展示套装</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Bulbasaur, Charmander, Squirtle</dd>
              <dt>Released</dt>
              <dd>August 22, 2025</dd>
              <dt>Promo cards</dt>
              <dd>066/SV-P to 068/SV-P (Poké Ball), 069/SV-P to 071/SV-P (Master Ball)</dd>
              <dt>Set code</dt>
              <dd>151C (the 3 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>Collect 151: Journey, Hope and Surprise, 5 cards each</dd>
              <dt>Extra</dt>
              <dd>Paper card display frame</dd>
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

        <h2 id="contents">What comes inside?</h2>
        <p>Pokémon China lists five items in each set. All three hold the same items, each in its own Pokémon:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Collect 151 First Partner display set
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
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('bulbasaur-set')} alt="The Bulbasaur set: a green and white hanging box showing the Bulbasaur promo in its frame through a window" loading="lazy" width={700} height={1384} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Bulbasaur set</strong>Green
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charmander-set')} alt="The Charmander set: a red and white hanging box showing the Charmander promo in its frame through a window" loading="lazy" width={700} height={1385} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charmander set</strong>Red
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('squirtle-set')} alt="The Squirtle set: a blue and white hanging box showing the Squirtle promo in its frame through a window" loading="lazy" width={700} height={1384} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Squirtle set</strong>Blue
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="promos">The Bulbasaur, Charmander and Squirtle promos</h2>
        <p>
          Each set has one holo promo of its Pokémon, and Pokémon China describes all three as new illustrations. The lower half of each card
          carries a large Poké Ball pattern. All three have 70 HP and are numbered
          as SV-P promos.
        </p>
        <ul>
          <li>Bulbasaur 066/SV-P, by OKACHEKE: Bulbasaur smiling in a sunlit forest.</li>
          <li>Charmander 067/SV-P, by NC Empire: Charmander on dark rocks under a red sky, its tail flame lit.</li>
          <li>Squirtle 068/SV-P, by Gemi: Squirtle standing in a pond among lily pads.</li>
        </ul>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('bulbasaur-poke-ball')} alt="Bulbasaur 066/SV-P promo: Bulbasaur smiling in a sunlit forest, with a Poké Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Bulbasaur</strong>066/SV-P · Poké Ball
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charmander-poke-ball')} alt="Charmander 067/SV-P promo: Charmander on dark rocks under a red sky, with a Poké Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charmander</strong>067/SV-P · Poké Ball
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('squirtle-poke-ball')} alt="Squirtle 068/SV-P promo: Squirtle standing in a pond among lily pads, with a Poké Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Squirtle</strong>068/SV-P · Poké Ball
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="master-ball">The Master Ball pattern versions</h2>
        <p>
          Each promo also comes in a Master Ball pattern version, with the same illustration and its own number. Pokémon China gives the
          production ratio as 99 Poké Ball to 1 Master Ball, so about 1 set in 100 has the Master Ball card in place of the Poké Ball one. The
          box front says the Master Ball card can turn up.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-promos" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-promos" className="sr-only">
              Promo card numbers and illustrators
            </caption>
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">Poké Ball</th>
                <th scope="col">Master Ball</th>
                <th scope="col">Illustrator</th>
              </tr>
            </thead>
            <tbody>
              {PROMOS.map((p) => (
                <tr key={p.name}>
                  <th scope="row">{p.name}</th>
                  <td>{p.pokeBall}</td>
                  <td>{p.masterBall}</td>
                  <td>{p.illus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('bulbasaur-master-ball')} alt="Bulbasaur 069/SV-P promo with a Master Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Bulbasaur</strong>069/SV-P · Master Ball
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charmander-master-ball')} alt="Charmander 070/SV-P promo with a Master Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charmander</strong>070/SV-P · Master Ball
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('squirtle-master-ball')} alt="Squirtle 071/SV-P promo with a Master Ball pattern on the lower half" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Squirtle</strong>071/SV-P · Master Ball
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="frame">The display frame</h2>
        <p>
          Each set has a paper card display frame in a colour that matches its Pokémon: green for Bulbasaur, red for Charmander and blue for
          Squirtle. It stands up on its own and holds one card behind a window, with the Pokémon TCG name printed below. Pokémon China does
          not give its size.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('bulbasaur-frame')} alt="The green paper display frame standing up, holding the Bulbasaur promo" loading="lazy" width={700} height={800} style={{ aspectRatio: '7 / 8', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Green frame</strong>Bulbasaur set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charmander-frame')} alt="The red paper display frame standing up, holding the Charmander promo" loading="lazy" width={700} height={800} style={{ aspectRatio: '7 / 8', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Red frame</strong>Charmander set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('squirtle-frame')} alt="The blue paper display frame standing up, holding the Squirtle promo" loading="lazy" width={700} height={800} style={{ aspectRatio: '7 / 8', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Blue frame</strong>Squirtle set
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 3 Collect 151 packs</h2>
        <p>
          Each set holds one 5-card pack of three Collect 151 releases: Journey, Hope and Surprise, which is 15 cards. The set code is 151C.
          Collect 151 is the set of the 151 original Kanto Pokémon, released in four parts that share the same main set, each with its own
          Chinese Exclusive cards. The card lists for <Link to="/sets/chinese/collect-151-journey">Collect 151: Journey</Link>,{' '}
          <Link to="/sets/chinese/collect-151-hope">Collect 151: Hope</Link> and{' '}
          <Link to="/sets/chinese/collect-151-surprise">Collect 151: Surprise</Link> cover them.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('journey-pack')} alt="A Collect 151: Journey pack with Pikachu running through a meadow" loading="lazy" width={400} height={742} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Collect 151: Journey</strong>5 cards
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('hope-pack')} alt="A Collect 151: Hope pack with Psyduck, Pikachu and Jigglypuff" loading="lazy" width={400} height={751} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Collect 151: Hope</strong>5 cards
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('surprise-pack')} alt="A Collect 151: Surprise pack with Gengar looming over Pikachu" loading="lazy" width={400} height={751} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Collect 151: Surprise</strong>5 cards
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {zh(f.a)}
                <FaqLinks links={'links' in f ? f.links : undefined} />
              </p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          These are small sets built around one card. Each promo has its own illustration of a Kanto first partner, the frame lets you put it
          on a shelf, and the 3 packs cover three of the Collect 151 releases. Pick your first partner, or collect all three and look for the
          Master Ball versions.
        </p>
      </BlogPostLayout>
    </>
  )
}
