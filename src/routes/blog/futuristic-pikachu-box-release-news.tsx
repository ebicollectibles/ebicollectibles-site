import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'futuristic-pikachu-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/futuristic-pikachu-box-${name}.webp`

// Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: 'Pikachu ex holo promo cards', qty: '2', note: '030/30th-P and 031/30th-P, one of each' },
  { item: 'Pokémon coins', qty: '2', note: '30th anniversary Pikachu mark' },
  { item: 'Damage counter dice', qty: '12', note: '' },
  { item: 'Poison marker', qty: '1', note: '' },
  { item: 'Burn marker', qty: '1', note: '' },
  { item: 'Special art sleeves', qty: '64', note: 'One pack of 64' },
  { item: 'Deck box', qty: '1', note: '' },
  { item: 'Special card display frame', qty: '1 set', note: '' },
  { item: 'Special rubber playmat', qty: '1', note: '' },
  { item: 'Damage counter box', qty: '1', note: '' },
  { item: 'Playmat storage case', qty: '1', note: '' },
]

// Accessory photos, in the order Pokémon China shows them.
const ACCESSORIES = [
  { name: 'sleeves', title: 'Art sleeves', note: '64 sleeves', w: 700, h: 620, alt: 'The special art sleeves: a Poké Ball over a rainbow of colour, surrounded by Energy symbols in glass bubbles' },
  { name: 'deck-box', title: 'Deck box', note: 'Flip-top lid', w: 539, h: 700, alt: 'The deck box with a flip-top lid, printed with Energy bubbles, the 30th anniversary Pikachu mark and Pokémon Card Game' },
  { name: 'playmat-case', title: 'Playmat case', note: 'A long storage case', w: 700, h: 265, alt: 'The long playmat storage case, printed with the same Energy bubbles and rainbow colours' },
  { name: 'playmat', title: 'Rubber playmat', note: 'Special design', w: 700, h: 407, alt: 'The rubber playmat: a large Poké Ball with Energy bubbles on a streak of rainbow colour' },
  { name: 'dice', title: 'Damage counter dice', note: '12 dice', w: 700, h: 499, alt: 'Twelve damage counter dice in rainbow colours, marked 100 and 20' },
  { name: 'counter-box', title: 'Damage counter box', note: 'Holds the counters', w: 700, h: 524, alt: 'The damage counter box with a flap lid, printed with a Poké Ball and the 30th anniversary Pikachu mark' },
  { name: 'coins', title: 'Pokémon coins', note: '2 coins', w: 700, h: 331, alt: 'Two Pokémon coins, one teal and one purple, each with the 30th anniversary Pikachu mark' },
  { name: 'markers', title: 'Poison and Burn markers', note: '1 of each', w: 700, h: 352, alt: 'The Poison and Burn markers, two round markers in purple and pink' },
  { name: 'display-frame', title: 'Card display frame', note: 'Clear frame', w: 700, h: 551, alt: 'The clear card display frame with two card-shaped spaces side by side and a rainbow edge' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the 30th Celebration Futuristic Box?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promos', label: 'The two Pikachu ex promos' },
  { id: 'accessories', label: 'The accessories' },
  { id: 'no-packs', label: 'Does it have booster packs?' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese 30th Celebration Futuristic Box?',
    a: 'An official Pokémon TCG collector box from Pokémon China for the 30th anniversary. Its Chinese name is 30周年庆典 幻彩未来纪念礼盒. It holds two Pikachu ex holo promo cards in the Futuristic Rare style by YOSHIROTTEN and a full set of battle accessories in the same design.',
  },
  {
    q: 'When was the Futuristic Box released?',
    a: 'September 16, 2026, the same day as the 30th Celebration set. Pokémon China announced it on June 6, 2026.',
  },
  {
    q: 'What promo cards come in the Futuristic Box?',
    a: 'Two Pikachu ex cards, 030/30th-P and 031/30th-P, one of each. Both are holo, both have 190 HP and both are illustrated by YOSHIROTTEN, who also drew the Mew ex and Mewtwo ex Futuristic Rares in 30th Celebration.',
    links: [{ to: '/sets/chinese/30th-celebration', label: '30th Celebration' }],
  },
  {
    q: 'Does the Futuristic Box have booster packs?',
    a: 'No. Pokémon China lists no booster packs. The box is the two promo cards and the accessories.',
  },
  {
    q: 'What accessories come in the box?',
    a: '64 art sleeves, a deck box, a rubber playmat with its storage case, a card display frame, 12 damage counter dice, a damage counter box, 2 Pokémon coins, and a Poison and a Burn marker.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. Both Pikachu ex promos are from the Simplified Chinese release.',
  },
  {
    q: 'Is the Futuristic Box sold under other names?',
    a: 'Yes. The lid reads Futuristic Box, but the Chinese name translates as Colorful Future Commemorative Box, so some shops list it under that name or a similar translation. They are the same product.',
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


export const Route = createFileRoute('/blog/futuristic-pikachu-box-release-news')({
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
  component: FuturisticPikachuBoxPost,
})

function FuturisticPikachuBoxPost() {
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
    name: 'What comes in the Chinese 30th Celebration Futuristic Box',
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
        lede="Pokémon China's 30th Celebration Futuristic Box released on September 16, 2026, alongside the 30th Celebration set. This post covers everything in it: two Pikachu ex promos by YOSHIROTTEN and a full set of accessories in the same design."
        cta={{
          heading: 'Looking for 30th Celebration products?',
          body: 'Browse our special products, or open the 30th Celebration set itself.',
          links: [
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the 30th Celebration booster box', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the 30th Celebration Futuristic Box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG collector box from Pokémon China, released on September 16, 2026, the same
          day as the 30th Celebration set. Its Chinese name is <Zh>30周年庆典 幻彩未来纪念礼盒</Zh>, which translates as 30th Celebration
          Colorful Future Commemorative Box. The lid itself reads Futuristic Box in English.
        </p>
        <p>
          The box is built around two Pikachu ex promo cards in the Futuristic Rare style, the new rarity made for 30th Celebration.
          Like the set's Mew ex and Mewtwo ex Futuristic Rares, both cards are by the graphic artist YOSHIROTTEN, and every accessory in
          the box carries his design.
        </p>

        <aside className="fact-box" aria-label="30th Celebration Futuristic Box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={1100} height={754} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Celebration Futuristic Box (<Zh>30周年庆典 幻彩未来纪念礼盒</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>September 16, 2026</dd>
              <dt>Released with</dt>
              <dd>30th Celebration</dd>
              <dt>Promo cards</dt>
              <dd>Pikachu ex 030/30th-P, Pikachu ex 031/30th-P</dd>
              <dt>Illustrator</dt>
              <dd>YOSHIROTTEN</dd>
              <dt>Booster packs</dt>
              <dd>None</dd>
              <dt>Extras</dt>
              <dd>Sleeves, deck box, playmat and case, display frame, dice, coins, markers, counter box</dd>
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
        <p>Pokémon China lists eleven items in the box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the 30th Celebration Futuristic Box
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
        <figure style={{ margin: '28px auto', maxWidth: 760 }}>
          <img
            src={img('contents')}
            alt="Everything in the Futuristic Box laid out: the box, the two Pikachu ex promos, the sleeves, the playmat and its case, the deck box, the dice, the coins and the display frame"
            loading="lazy"
            width={1400}
            height={924}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption>Pokémon China's photo of the full contents.</figcaption>
        </figure>

        <h2 id="promos">The two Pikachu ex promos</h2>
        <p>
          The box holds one of each Pikachu ex, numbered 030/30th-P and 031/30th-P. Pokémon China calls them collector holo cards in the
          Futuristic Rare style. Both are by YOSHIROTTEN and both fill the card with Energy symbols drawn as glossy bubbles. On 030,
          Pikachu leaps through soft rainbow colours with a Poké Ball behind it. On 031, a glowing pink and purple Pikachu dives across a
          dark background.
        </p>
        <p>
          Both are Basic Pokémon ex with 190 HP. On 030, the first attack puts any number of Basic Pokémon from your deck onto your Bench,
          and the second does 200 damage and discards all Energy from Pikachu ex. On 031, the first attack attaches any number of basic
          Energy from your hand to your Pokémon in any way you like, and the second does 200 damage and 30 damage to Pikachu ex itself.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pikachu-ex-030-promo')} alt="Pikachu ex 030/30th-P promo by YOSHIROTTEN: Pikachu leaping through rainbow colours among Energy bubbles" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Pikachu ex</strong>030/30th-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pikachu-ex-031-promo')} alt="Pikachu ex 031/30th-P promo by YOSHIROTTEN: a glowing pink and purple Pikachu diving across a dark background among Energy bubbles" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Pikachu ex</strong>031/30th-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          In Simplified Chinese, these two cards come only in this box. They are numbered with the 30th Celebration promos, and the{' '}
          <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> shows them with the rest of the set and its two
          Futuristic Rares.
        </p>

        <h2 id="accessories">The accessories</h2>
        <p>
          Every accessory uses the same YOSHIROTTEN design: Energy symbols in glass bubbles over streaks of rainbow colour, with the 30th
          anniversary Pikachu mark. Together they make a full battle kit, from sleeves and a deck box to dice, coins and a playmat that
          packs away in its own case. Pokémon China does not give sizes or materials for them.
        </p>
        <ul className="card-grid cols-3">
          {ACCESSORIES.map((a) => (
            <li key={a.name}>
              <figure>
                <img src={img(a.name)} alt={a.alt} loading="lazy" width={a.w} height={a.h} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
                <figcaption>
                  <strong>{a.title}</strong>
                  {a.note}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="no-packs">Does it have booster packs?</h2>
        <p>
          No. Pokémon China's contents list has no booster packs, which sets this box apart from the other 30th Celebration boxes. It is
          for collecting the two Pikachu ex cards and using the matching accessories. To open 30th Celebration packs, see the{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration release post</Link>.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>The Futuristic Box released on September 16, 2026, with the 30th Celebration set and other products for the anniversary:</p>
        <ul>
          <li>
            <strong>30th Celebration booster packs.</strong> 6 cards each, every one a holo. Our{' '}
            <Link to="/blog/30th-celebration-release-news">30th Celebration post</Link> covers the set.
          </li>
          <li>
            <strong>The Day &amp; Night gift box.</strong> Espeon ex and Umbreon ex promos and 15 packs. Our{' '}
            <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link> covers it.
          </li>
          <li>
            <strong>Greninja ex and Sylveon ex sets.</strong> A promo card, a card display keychain and 3 packs. Our{' '}
            <Link to="/blog/greninja-sylveon-display-set-release-news">Greninja ex and Sylveon ex post</Link> covers them.
          </li>
          <li>
            <strong>The Charizard collector figure box.</strong> A Charizard figure, a jumbo card and 15 packs. Our{' '}
            <Link to="/blog/charizard-figure-box-release-news">Charizard figure box post</Link> covers it.
          </li>
          <li>
            <strong>Dream Painting Pikachu figures.</strong> A blind box of figures based on the set's Pikachu cards. Our{' '}
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu post</Link> covers them.
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
          This is the anniversary box for collectors who want the Futuristic Rare look without chasing it in packs. Two Pikachu ex cards
          by YOSHIROTTEN, a frame to show them in, and a battle kit in the same design make it the most collector-focused of the 30th
          Celebration products.
        </p>
      </BlogPostLayout>
    </>
  )
}
