import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'greninja-sylveon-display-set-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/greninja-sylveon-display-set-${name}.webp`

// Pokémon China's contents list. Each set holds the same three items, in its own Pokémon.
const CONTENTS = [
  { item: 'Pokémon ex holo promo card', qty: '1', note: 'Greninja ex 032/30th-P or Sylveon ex 033/30th-P' },
  { item: 'Card display keychain', qty: '1', note: 'A card holder in the same Pokémon, with a key ring, clip and strap' },
  { item: '30th Celebration booster packs', qty: '3', note: 'Set code 30thC, 6 cards each, 18 cards in all' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Greninja ex and Sylveon ex sets?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promos', label: 'The Greninja ex and Sylveon ex promos' },
  { id: 'keychain', label: 'The card display keychain' },
  { id: 'packs', label: 'The 3 booster packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Greninja ex and Sylveon ex keychain sets?',
    a: 'Two official Pokémon TCG sets from Pokémon China for the 30th anniversary. Their Chinese name is 30周年庆典 卡牌展示套套装. Each holds a Pokémon ex holo promo card with a new illustration, a card display keychain in the same Pokémon, and 3 booster packs of 30th Celebration.',
  },
  {
    q: 'When were the Greninja ex and Sylveon ex sets released?',
    a: 'September 16, 2026, from 10:00 China time, the same day as the 30th Celebration set. Pokémon China announced them on August 26, 2026.',
  },
  {
    q: 'What promo cards come in the sets?',
    a: 'The Greninja set has Greninja ex 032/30th-P and the Sylveon set has Sylveon ex 033/30th-P. Both are holo, both have new illustrations, and both are illustrated by 5ban Graphics.',
  },
  {
    q: 'How many booster packs are in each set?',
    a: 'Three 30th Celebration booster packs (set code 30thC) of 6 cards each, which is 18 cards.',
    links: [{ to: '/sets/chinese/30th-celebration', label: '30th Celebration' }],
  },
  {
    q: 'Is the card display keychain the same in both sets?',
    a: 'No. Each set has its own: the Greninja set comes with a light blue Greninja card holder and the Sylveon set with a pink Sylveon one. Both have a metal key ring, a clip and a strap.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The promo card and all 3 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Are these sets sold under other names?',
    a: 'Yes. Pokémon China has no English name for them, so shops translate it differently. The Card Display Sleeve Set, the Card Display Set and the Keychain Card Display Box are the same products.',
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


export const Route = createFileRoute('/blog/greninja-sylveon-display-set-release-news')({
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
  component: GreninjaSylveonDisplaySetPost,
})

function GreninjaSylveonDisplaySetPost() {
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
    name: 'What comes in each Chinese Greninja ex or Sylveon ex card display set',
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
        lede="Pokémon China's Greninja ex and Sylveon ex card display sets released on September 16, 2026, alongside 30th Celebration. This post covers what is in each one: a new promo card, a card display keychain and 3 booster packs."
        cta={{
          heading: 'Shop the Greninja ex and Sylveon ex sets',
          body: 'Each set has its promo card, its card display keychain and 3 packs of 30th Celebration.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-sylveon-ex-keychain-box' }, label: 'Shop the Sylveon ex set' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-greninja-ex-keychain-box' }, label: 'Shop the Greninja ex set', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Greninja ex and Sylveon ex sets?</h2>
        <p>
          They are two official Simplified Chinese Pokémon TCG sets from Pokémon China, released on September 16, 2026, the same day as
          the 30th Celebration set. Their Chinese name is <Zh>30周年庆典 卡牌展示套套装</Zh>, which translates as 30th Celebration Card
          Display Sleeve Set. One version is Greninja ex and the other is Sylveon ex.
        </p>
        <p>
          Each set holds the same three items in its own Pokémon: a holo promo card with a new illustration, a card holder you can
          clip to a bag or keys, and 3 packs of 30th Celebration.
        </p>

        <aside className="fact-box" aria-label="Greninja ex and Sylveon ex set key facts">
          {/* Same cards as in the promo section below, where they are described, so this copy is decorative */}
          <img src={img('sylveon-ex-promo')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Celebration Card Display Sleeve Set (<Zh>30周年庆典 卡牌展示套套装</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Greninja ex, Sylveon ex</dd>
              <dt>Released</dt>
              <dd>September 16, 2026, 10:00 China time</dd>
              <dt>Promo cards</dt>
              <dd>Greninja ex 032/30th-P, Sylveon ex 033/30th-P</dd>
              <dt>Set code</dt>
              <dd>30thC (the 3 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>3 packs of 30th Celebration, 6 cards each</dd>
              <dt>Extra</dt>
              <dd>Card display keychain</dd>
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
        <p>Pokémon China lists three items in each set:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Greninja ex or Sylveon ex card display set
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
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('greninja-box')} alt="The Greninja ex set: a hanging box with a 30th Celebration pack, the Greninja ex promo and a blue Greninja card holder behind a window" loading="lazy" width={1100} height={883} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Greninja ex set</strong>Blue box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('sylveon-box')} alt="The Sylveon ex set: a hanging box with a 30th Celebration pack, the Sylveon ex promo and a pink Sylveon card holder behind a window" loading="lazy" width={1100} height={883} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Sylveon ex set</strong>Silver box
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="promos">The Greninja ex and Sylveon ex promos</h2>
        <p>
          Each set has one holo promo card, and Pokémon China describes both as new illustrations. Both are by 5ban Graphics. Greninja
          ex 032/30th-P shows Greninja in a swirl of water. Sylveon ex 033/30th-P shows Sylveon among bubbles, its ribbons trailing.
        </p>
        <p>
          Greninja ex has 300 HP. Its first attack does 30 damage for each damage counter already on one of your opponent's Pokémon,
          and its second does 160. Sylveon ex has 270 HP, and its attack does 50 damage for each type of basic Energy attached to your
          Pokémon.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('greninja-ex-promo')} alt="Greninja ex 032/30th-P promo: Greninja in a swirl of water" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Greninja ex</strong>032/30th-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('sylveon-ex-promo')} alt="Sylveon ex 033/30th-P promo: Sylveon among bubbles with its ribbons trailing" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Sylveon ex</strong>033/30th-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          In Simplified Chinese, each card comes only in its own set. They are numbered with the 30th Celebration promos, and the{' '}
          <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> shows them with the rest of the set.
        </p>

        <h2 id="keychain">The card display keychain</h2>
        <p>
          Pokémon China calls it a card display sleeve, for showing off a favourite card. Each one is a card holder in the set's
          Pokémon, with a metal key ring, a clip and a strap printed with the 30th Celebration logo. The Greninja one is light
          blue and the Sylveon one is pink, and both carry the 30th anniversary Pikachu mark in the corner.
        </p>
        <p>
          The Pokémon on the front is raised, so it stands out from the holder. Pokémon China does not say what the holder is made of
          or how the card goes in.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('greninja-keychain')} alt="The Greninja card display keychain: a light blue card holder with a raised Greninja on the front, a metal key ring and clip, and a blue strap" loading="lazy" width={700} height={881} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Greninja keychain</strong>In the Greninja ex set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('sylveon-keychain')} alt="The Sylveon card display keychain: a pink card holder with a raised Sylveon on the front, a metal key ring and clip, and a pink strap" loading="lazy" width={700} height={959} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Sylveon keychain</strong>In the Sylveon ex set
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 3 booster packs</h2>
        <p>
          Each set holds 3 packs of 30th Celebration, 6 cards each, which is 18 cards. The set code is 30thC, printed in the top corner
          of each pack. 30th Celebration is the 30th anniversary set, with 30 different Pikachu cards and 30 classic cards brought back
          from the game's history. Every pack has a Pikachu.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>
          Pokémon China announced these sets on August 26, 2026, together with other 30th Celebration products released on September
          16:
        </p>
        <ul>
          <li>
            <strong>The Day &amp; Night gift box.</strong> Espeon ex and Umbreon ex promos, 15 packs, a display frame and two magnets.
            Our <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link> covers it.
          </li>
          <li>
            <strong>Deluxe deck sets, Espeon or Umbreon.</strong> A ready-to-play Espeon ex or Umbreon ex deck with a metal deck box
            and 2 booster packs.
          </li>
          <li>
            <strong>30th Celebration accessories.</strong> Art sleeves, a deck box, a damage counter box and a coin album.
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
          These are the small 30th Celebration sets: one promo card with its own illustration, a holder to carry it in, and a few packs
          to open. Pick the Pokémon you like best, or get both and keep the pair.
        </p>
      </BlogPostLayout>
    </>
  )
}
