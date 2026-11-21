import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'charizard-figure-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/charizard-figure-box-${name}.webp`

// Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: 'Charizard figure', qty: '1', note: 'Made from the Charizard card illustration' },
  { item: 'Charizard jumbo card', qty: '1', note: '137/103, about 13.3 cm by 18.7 cm' },
  { item: '30th Celebration booster packs', qty: '15', note: 'Set code 30thC, 6 cards each, 90 cards in all' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Chinese Charizard figure box?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'figure', label: 'The Charizard figure' },
  { id: 'jumbo-card', label: 'The Charizard jumbo card' },
  { id: 'packs', label: 'The 15 booster packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Charizard collector figure box?',
    a: 'An official Pokémon TCG box from Pokémon China for the 30th anniversary. Its Chinese name is 30周年庆典 典藏手办礼盒 喷火龙. It holds a Charizard figure, a Charizard jumbo card and 15 booster packs of 30th Celebration.',
  },
  {
    q: 'When was the Charizard figure box released?',
    a: 'September 16, 2026, from 10:00 China time, the same day as the 30th Celebration set. Pokémon China announced it on August 18, 2026.',
  },
  {
    q: 'Which card is the jumbo card?',
    a: 'The classic Charizard 137/103 from 30th Celebration, illustrated by Mitsuhiro Arita. It brings back the Base Set Charizard of 1999 in its original-style frame, with a gold glitter border and the 30th anniversary stamp.',
  },
  {
    q: 'How big is the jumbo card?',
    a: 'About 13.3 cm wide and 18.7 cm tall, going by Pokémon China.',
  },
  {
    q: 'Is there a regular-size promo card in the box?',
    a: 'Pokémon China does not list one. The contents are the figure, the jumbo card and 15 booster packs. The regular-size Charizard 137/103 is a card in 30th Celebration packs.',
  },
  {
    q: 'How many booster packs are in the Charizard figure box?',
    a: 'Fifteen 30th Celebration booster packs (set code 30thC) of 6 cards each, which is 90 cards.',
  },
  {
    q: 'How big is the Charizard figure?',
    a: 'Pokémon China does not give the size of the figure or say what it is made of.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The jumbo card and all 15 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Is the Charizard figure box sold under other names?',
    a: 'Yes. Pokémon China has no English name for it, so shops translate it differently. The Charizard Collector Figure Gift Box and the 30th Celebration Charizard Figure are the same product.',
  },
]

export const Route = createFileRoute('/blog/charizard-figure-box-release-news')({
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
  component: CharizardFigureBoxPost,
})

function CharizardFigureBoxPost() {
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
  const contentsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'What comes in the Chinese Charizard collector figure box',
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
        lede="Pokémon China's Charizard collector figure box released on September 16, 2026, alongside 30th Celebration. This post covers everything in it: a Charizard figure made from the classic card, a jumbo Charizard card and 15 booster packs."
        cta={{
          heading: 'Shop the Charizard figure box',
          body: 'The Charizard figure, the jumbo Charizard card and 15 packs of 30th Celebration.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-charizard-30th-celebration-figure-box' }, label: 'Shop the figure box' },
            { to: '/sets/chinese/30th-celebration', label: 'See the 30th Celebration card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Chinese Charizard figure box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG box from Pokémon China, released on September 16, 2026, the same day as the
          30th Celebration set. Its Chinese name is <Zh>30周年庆典 典藏手办礼盒 喷火龙</Zh>, which translates as 30th Celebration Collector
          Figure Gift Box: Charizard.
        </p>
        <p>
          The box is built around one card: the classic Charizard that 30th Celebration brings back from the first set of 1999. Pokémon
          China notes that the set has the first Simplified Chinese printing of this card. The box holds a jumbo version of it, a
          Charizard figure made from its illustration, and 15 packs of 30th Celebration.
        </p>

        <aside className="fact-box" aria-label="Charizard figure box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={1000} height={1125} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Celebration Collector Figure Gift Box: Charizard (<Zh>30周年庆典 典藏手办礼盒 喷火龙</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>September 16, 2026, 10:00 China time</dd>
              <dt>Released with</dt>
              <dd>30th Celebration</dd>
              <dt>Set code</dt>
              <dd>30thC (the 15 packs inside)</dd>
              <dt>Figure</dt>
              <dd>Charizard, made from the card illustration</dd>
              <dt>Jumbo card</dt>
              <dd>Charizard 137/103, about 13.3 cm by 18.7 cm</dd>
              <dt>Booster packs</dt>
              <dd>15 packs of 30th Celebration, 6 cards each</dd>
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
        <p>Pokémon China lists three items in the box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Charizard collector figure box
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
        <figure style={{ margin: '28px auto', maxWidth: 560 }}>
          <img
            src={img('box')}
            alt="The Charizard collector figure box: a dark red box with the 30th Celebration logo and a window showing the Charizard figure, mouth open and wings spread"
            loading="lazy"
            width={1000}
            height={1125}
            style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }}
          />
          <figcaption>The box is dark red, with the Charizard figure behind a large window.</figcaption>
        </figure>

        <h2 id="figure">The Charizard figure</h2>
        <p>
          Pokémon China describes the figure as a faithful copy of Charizard's pose on the card: wings spread, breathing fire. In the
          official photos it leans forward with its mouth wide open and its tongue out, its wings raised behind it, standing on a white
          base.
        </p>
        <p>
          Pokémon China suggests displaying the figure together with the jumbo card, and its photo shows the card standing upright in a
          holder behind the figure, so Charizard looks like it is coming out of its own card. The contents list names only the
          figure, the jumbo card and the packs, and Pokémon China does not say how big the figure is, what it is made of, or how the
          base and holder come in the box.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 560 }}>
          <img
            src={img('figure-with-jumbo-card')}
            alt="The Charizard figure on a white base, with the jumbo Charizard 137/103 card standing upright behind it"
            loading="lazy"
            width={1000}
            height={1448}
            style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }}
          />
          <figcaption>The figure in front of the jumbo card, as Pokémon China shows them displayed together.</figcaption>
        </figure>

        <h2 id="jumbo-card">The Charizard jumbo card</h2>
        <p>
          The jumbo card is Charizard 137/103 from 30th Celebration, illustrated by Mitsuhiro Arita. It is the Base Set Charizard of 1999
          in its original-style frame, printed in Simplified Chinese with a gold glitter border, a holo illustration and the 30th
          anniversary Pikachu stamp. Pokémon China gives its size as about 13.3 cm wide and 18.7 cm tall, and says the details of the
          print are clearer than on a regular-size card.
        </p>
        <p>
          Charizard is a Stage 2 Pokémon that evolves from Charmeleon, with 120 HP. Its Pokémon Power,
          Energy Burn, turns all Energy attached to it into Fire Energy, and its attack, Fire Spin, does 100 damage for 4 Fire Energy
          and discards 2 Energy cards from it.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 420 }}>
          <img
            src={img('jumbo-card')}
            alt="Charizard 137/103 jumbo card: the classic Charizard breathing fire, in the original-style frame with a gold glitter border and the 30th anniversary Pikachu stamp"
            loading="lazy"
            width={788}
            height={1100}
            style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }}
          />
          <figcaption>
            <strong>Charizard</strong> 137/103 · Mitsuhiro Arita
          </figcaption>
        </figure>
        <p>
          The regular-size Charizard 137/103 is one of the 30 classic cards in 30th Celebration packs. The{' '}
          <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> shows it with the rest of the set, and our{' '}
          <Link to="/blog/30th-celebration-card-origins">card origins guide</Link> traces all 30 classics back to the original card.
        </p>

        <h2 id="packs">The 15 booster packs</h2>
        <p>
          The box holds 15 packs of 30th Celebration, 6 cards each, which is 90 cards. The set code is 30thC, printed in the top corner
          of each pack. 30th Celebration is the 30th anniversary set, with 30 different Pikachu cards and 30 classic cards brought back
          from the game's history, the regular-size Charizard among them. Every pack has a Pikachu. Our{' '}
          <Link to="/blog/30th-celebration-release-news">30th Celebration release post</Link> covers the set.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 260 }}>
          <img
            src={img('booster-pack')}
            alt="A 30th Celebration booster pack with Pikachu, Mew and Mewtwo on the front and the set code 30thC in the top corner"
            loading="lazy"
            width={447}
            height={900}
            style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }}
          />
          <figcaption>One of the 15 packs of 30th Celebration.</figcaption>
        </figure>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Several other 30th Celebration products went on sale in China on September 16, 2026:</p>
        <ul>
          <li>
            <strong>The Day &amp; Night gift box.</strong> Espeon ex and Umbreon ex promos, 15 packs, a display frame and two magnets.
            Our <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link> covers it.
          </li>
          <li>
            <strong>Card display sleeve sets, Greninja ex or Sylveon ex.</strong> A promo card with a new illustration, a card display
            keychain and 3 booster packs. Our{' '}
            <Link to="/blog/greninja-sylveon-display-set-release-news">Greninja ex and Sylveon ex sets post</Link> covers them.
          </li>
          <li>
            <strong>Dream Painting Pikachu figures.</strong> A blind box of Pikachu figures made from 30th Celebration Pikachu cards, each
            with its card and a pack. Our <Link to="/blog/pikachu-dream-painting-figures-release-news">Pikachu figures post</Link> covers
            them.
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
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          This is the 30th Celebration box for Charizard fans. The figure and the jumbo card both come from the 1999 Base Set Charizard,
          they display together as one piece, and the 15 packs make it a proper way to open the set as well.
        </p>
      </BlogPostLayout>
    </>
  )
}
