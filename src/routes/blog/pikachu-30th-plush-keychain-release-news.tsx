import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'pikachu-30th-plush-keychain-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/pikachu-30th-plush-keychain-${name}.webp`
const productId = (n: number) => `pokemon-chinese-pikachu-30th-celebration-plush-keychain-${n}`

// The 30 styles, numbered as in our shop photos. Each line describes only what the photo shows.
const STYLES: { n: number; look: string }[] = [
  { n: 1, look: 'Laughing, eyes shut, paws up by its cheeks' },
  { n: 2, look: 'Eyes shut, mouth open in a smile, sitting back' },
  { n: 3, look: 'One eye shut, a paw rubbing its cheek' },
  { n: 4, look: 'Crouched side-on, looking out, tail up' },
  { n: 5, look: 'Winking with a small smile' },
  { n: 6, look: 'Laughing, eyes shut, paws held out' },
  { n: 7, look: 'Lying on its front, tail in the air' },
  { n: 8, look: 'A paw over its mouth, eyes wide' },
  { n: 9, look: 'Eyes squeezed shut, leaning hard to one side' },
  { n: 10, look: 'Paws raised beside its head, a small frown' },
  { n: 11, look: 'Mouth open in surprise, a paw by its cheek' },
  { n: 12, look: 'Both paws up, mouth wide open' },
  { n: 13, look: 'Both paws up by its face, mouth open' },
  { n: 14, look: 'Eyes wide and blank, one arm flung out' },
  { n: 15, look: 'Eyes shut, ears drooping, a flat mouth' },
  { n: 16, look: 'Lying on its side, asleep' },
  { n: 17, look: 'Crouched low with a fierce frown' },
  { n: 18, look: 'One paw up, waving, mouth open' },
  { n: 19, look: 'Eyes shut, smiling, paws together' },
  { n: 20, look: 'Lying on its front, chin down, looking up' },
  { n: 21, look: 'Eyes squeezed shut, head tilted, frowning' },
  { n: 22, look: 'Sitting up straight, paws in front, a wavy mouth' },
  { n: 23, look: 'Looking back over its shoulder, tail curled round' },
  { n: 24, look: 'Sitting with one paw raised, a small smile' },
  { n: 25, look: 'Winking, a paw at its cheek' },
  { n: 26, look: 'Sitting, eyes shut, head nodding forward' },
  { n: 27, look: 'Looking up to one side, mouth a little open' },
  { n: 28, look: 'Ears out wide, paws together, smiling' },
  { n: 29, look: 'Lying down with one eye open' },
  { n: 30, look: 'Winking, one paw up, mouth open in a smile' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the 30th anniversary Pikachu plush keychains?' },
  { id: 'how-sold', label: 'Blind box or chosen style?' },
  { id: 'styles', label: 'All 30 styles' },
  { id: 'tag', label: 'The 30 tag on each keychain' },
  { id: 'cards', label: 'Are they linked to the 30th Celebration Pikachu cards?' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the 30th anniversary Pikachu plush keychains?',
    a: "A line of small plush Pikachu on key chains, from Pokémon China's 30th anniversary goods. The Chinese name is 30周年纪念系列 皮卡丘毛绒挂件, which translates as 30th Anniversary Series Pikachu Plush Keychain. Each style has its own expression and pose.",
  },
  {
    q: 'When were they released?',
    a: 'September 16, 2026, in mainland China. Pokémon China announced the date on its official Weibo account on September 9, 2026.',
  },
  {
    q: 'Are they blind boxes?',
    a: 'No. Pokémon China invites buyers to choose their own Pikachu, so each style is sold as itself. Pokémon China does not mention a secret style.',
  },
  {
    q: 'How many styles are there?',
    a: '30. Each one is a different Pikachu: laughing, winking, sleeping, waving, frowning and more.',
  },
  {
    q: 'Where were they sold in China?',
    a: "Pokémon China named three places: the Pokémon official flagship store online, the Pokémon official card gyms, and Pokémon's official pop-up shops.",
  },
  {
    q: 'Are they a Pokémon TCG product?',
    a: 'No. They are general Pokémon 30th anniversary goods, not part of the 30th Celebration card set, and they come with no cards or packs. They went on sale the same day as 30th Celebration.',
  },
  {
    q: 'Are these keychains sold under other names?',
    a: 'Yes. Some shops call them Pikachu 30th anniversary plush charms or mascots.',
  },
]

export const Route = createFileRoute('/blog/pikachu-30th-plush-keychain-release-news')({
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
  component: Pikachu30thPlushKeychainPost,
})

function Pikachu30thPlushKeychainPost() {
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
  const stylesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All 30 Pikachu plush keychain styles, Pokémon 30th anniversary',
    numberOfItems: STYLES.length,
    itemListElement: STYLES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Style ${s.n}: ${s.look}`,
      image: img(`style-${String(s.n).padStart(2, '0')}`),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(stylesJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China released 30 plush Pikachu keychains for the 30th anniversary on September 16, 2026. Every style has its own expression and pose, each comes with its own version of the 30 tag, and you choose the one you want."
        cta={{
          heading: 'Shop the Pikachu plush keychains',
          body: 'Pick the Pikachu you want from all 30 styles.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-pikachu-30th-celebration-plush-keychain' }, label: 'Shop all 30 styles' },
            { to: '/products/$id', params: { id: productId(15) }, label: 'Style 15', variant: 'ghost' },
            { to: '/products/$id', params: { id: productId(17) }, label: 'Style 17', variant: 'ghost' },
            { to: '/products/$id', params: { id: productId(18) }, label: 'Style 18', variant: 'ghost' },
            { to: '/products/$id', params: { id: productId(22) }, label: 'Style 22', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the 30th anniversary Pikachu plush keychains?</h2>
        <p>
          They are small plush Pikachu on key chains, part of Pokémon China's goods for the Pokémon 30th anniversary. The Chinese name
          is <Zh>30周年纪念系列 皮卡丘毛绒挂件</Zh>, which translates as 30th Anniversary Series Pikachu Plush Keychain. Pokémon China
          announced them on its official Weibo account on September 9, 2026, and they went on sale on September 16, 2026.
        </p>
        <p>
          There are 30 styles, all Pikachu. Pokémon China calls them Pikachu with different expressions, and each one also has its own
          pose. Every keychain hangs from a gold-coloured chain with a key ring and a clasp, and carries a tag with the 30 anniversary
          logo.
        </p>

        <aside className="fact-box" aria-label="Pikachu plush keychain key facts">
          {/* Same photo as style 18 in the grid below, where it is described, so this copy is decorative */}
          <img src={img('style-18')} alt="" loading="lazy" width={600} height={600} style={{ background: '#fff' }} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Anniversary Pikachu Plush Keychain (<Zh>30周年纪念系列 皮卡丘毛绒挂件</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>September 16, 2026</dd>
              <dt>Styles</dt>
              <dd>30, all Pikachu</dd>
              <dt>How it is sold</dt>
              <dd>You choose the style, not a blind box</dd>
              <dt>Secret</dt>
              <dd>None mentioned by Pokémon China</dd>
              <dt>Sold at</dt>
              <dd>Pokémon official flagship store, official card gyms, official pop-up shops</dd>
              <dt>Type</dt>
              <dd>Pokémon 30th anniversary goods, not a TCG product</dd>
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

        <h2 id="how-sold">Blind box or chosen style?</h2>
        <p>
          Chosen style. Pokémon China's announcement invites buyers to pick their own Pikachu at the official flagship store, the
          official card gyms and the official pop-up shops. So unlike the{' '}
          <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures</Link>, which come in blind boxes,
          you know which Pikachu you are getting. Pokémon China does not mention a secret style.
        </p>
        <figure style={{ margin: '28px auto' }}>
          <img
            src={img('full-set')}
            alt="All 30 Pikachu plush keychains sitting on white steps, each with a different expression and pose"
            loading="lazy"
            width={1200}
            height={1200}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <h2 id="styles">All 30 styles</h2>
        <p>
          All 30 are Pikachu. What changes is the face and the pose. Most sit up, a few lie down (styles 7,
          16, 20 and 29) and two crouch side-on (styles 4 and 17). The numbers below are the ones on our shop listings.
        </p>
        <ul className="card-grid cols-4">
          {STYLES.map((s) => (
            <li key={s.n}>
              <figure>
                <img
                  src={img(`style-${String(s.n).padStart(2, '0')}`)}
                  alt={`Pikachu plush keychain style ${s.n}: ${s.look.toLowerCase()}`}
                  loading="lazy"
                  width={600}
                  height={600}
                  style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }}
                />
                <figcaption>
                  <strong>Style {s.n}</strong>
                  {s.look}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="table-note">These are our shop photos of the 30 styles. Each style has its own listing.</p>

        <BuyStrip />

        <h2 id="tag">The 30 tag on each keychain</h2>
        <p>
          Each keychain carries a tag with the Pokémon 30th anniversary logo: a red 30 with a Poké Ball for the 0 and the words
          Pokémon: Since 1996. The tags are not all the same. Each one has its own small Pikachu drawn on the 30, so the tag changes
          with the style.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 728 }}>
          <img
            src={img('tags')}
            alt="Eight 30 anniversary tags from different keychain styles side by side, each with a different Pikachu on the red 30"
            loading="lazy"
            width={1680}
            height={660}
            style={{ width: '100%', height: 'auto', borderRadius: 10, background: '#fff' }}
          />
        </figure>
        <p>
          Our photo of the full set shows the 30 keychains arranged as the number 30.
        </p>
        <figure style={{ margin: '24px auto 30px' }}>
          <img
            src={img('formation')}
            alt="The 30 Pikachu plush keychains arranged on white steps to form the number 30"
            loading="lazy"
            width={1200}
            height={1200}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <h2 id="cards">Are they linked to the 30th Celebration Pikachu cards?</h2>
        <p>
          Not that Pokémon China says. The{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration</Link> card set also has 30 different Pikachu, but Pokémon
          China does not connect the keychains to those cards. The keychains
          are general 30th anniversary goods, and their tag uses the Pokémon 30th anniversary logo, not the 30th Celebration set logo.
          They come with no cards or packs.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>The keychains went on sale on the same day as several 30th Celebration products from Pokémon China:</p>
        <ul>
          <li>
            <strong>30th Celebration.</strong> The 30th anniversary booster set, with 30 Pikachu cards and a Pikachu in every pack.
            The <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> has every card.
          </li>
          <li>
            <strong>Dream Painting Pikachu figures.</strong> Blind box figures based on 12 of the 30th Celebration Pikachu cards. Our{' '}
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting post</Link> covers all 12 and the secret.
          </li>
          <li>
            <strong>30th Celebration card products.</strong> Including the Charizard figure gift box, deluxe deck sets and card display
            sets.
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
          These are simple: one Pikachu, 30 moods. Because you choose the style, they work well as a gift for someone who has a
          favourite Pikachu face, and the changing tag gives each one a small extra detail. Styles 15, 17, 18 and 22 each have their
          own listing: <Link to="/products/$id" params={{ id: productId(15) }}>style 15</Link>,{' '}
          <Link to="/products/$id" params={{ id: productId(17) }}>style 17</Link>,{' '}
          <Link to="/products/$id" params={{ id: productId(18) }}>style 18</Link> and{' '}
          <Link to="/products/$id" params={{ id: productId(22) }}>style 22</Link>.
        </p>
      </BlogPostLayout>
    </>
  )
}
