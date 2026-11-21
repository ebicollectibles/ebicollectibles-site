import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'day-night-gift-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/day-night-gift-box-${name}.webp`

// Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: 'Espeon ex holo promo card', qty: '1', note: '028/30th-P' },
  { item: 'Umbreon ex holo promo card', qty: '1', note: '029/30th-P' },
  { item: 'Day celebration fridge magnet', qty: '1', note: 'Espeon and friends by day' },
  { item: 'Night celebration fridge magnet', qty: '1', note: 'Umbreon and friends by night' },
  { item: 'Two-card display frame', qty: '1', note: 'Holds both promo cards side by side' },
  { item: '30th Celebration booster packs', qty: '15', note: 'Set code 30thC, 6 cards each, 90 cards in all' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Chinese Day & Night gift box?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promos', label: 'The Espeon ex and Umbreon ex promos' },
  { id: 'packs', label: 'The 15 booster packs' },
  { id: 'frame-and-magnets', label: 'The display frame and magnets' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Day & Night gift box?',
    a: 'An official Pokémon TCG gift box from Pokémon China for the 30th anniversary. Its Chinese name is 30周年庆典 收藏展示礼盒 太阳伊布ex&月亮伊布ex. It holds an Espeon ex and an Umbreon ex holo promo card, 15 booster packs of 30th Celebration, a two-card display frame and two fridge magnets.',
  },
  {
    q: 'When was the Day & Night gift box released?',
    a: 'September 16, 2026, the same day as the 30th Celebration set. Pokémon China announced it on August 26, 2026.',
  },
  {
    q: 'What promo cards come in the Day & Night gift box?',
    a: 'Espeon ex 028/30th-P and Umbreon ex 029/30th-P, both holo and both illustrated by REND. Espeon ex sits on a balcony by day and Umbreon ex by night, each looking out at a celebration in the distance.',
  },
  {
    q: 'How many booster packs are in the Day & Night gift box?',
    a: 'Fifteen 30th Celebration booster packs (set code 30thC) of 6 cards each, which is 90 cards.',
    links: [{ to: '/sets/chinese/30th-celebration', label: '30th Celebration' }],
  },
  {
    q: 'Is the gift box the same as the Espeon or Umbreon deluxe deck set?',
    a: 'No. The deluxe deck sets came out the same day and each holds a ready-to-play Espeon ex or Umbreon ex deck, a metal deck box and 2 booster packs. The gift box is the collector product, with both promo cards, the display frame, the magnets and 15 packs.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The two promo cards and all 15 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Is the Day & Night gift box sold under other names?',
    a: 'Yes. Pokémon China has no English name for it, so shops translate it differently. The Espeon ex & Umbreon ex Collection Box, the 30th Celebration Collection Display Box and the Day & Night Gift Box are the same product.',
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


export const Route = createFileRoute('/blog/day-night-gift-box-release-news')({
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
  component: DayNightGiftBoxPost,
})

function DayNightGiftBoxPost() {
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
    name: 'What comes in the Chinese Day & Night gift box',
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
        lede="Pokémon China's Day & Night gift box released on September 16, 2026, alongside 30th Celebration. This post covers everything in it: the Espeon ex and Umbreon ex promos, the 15 booster packs, the display frame and the two magnets."
        cta={{
          heading: 'Shop the Day & Night gift box',
          body: 'Both promo cards, 15 packs of 30th Celebration, the display frame and both magnets.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-day-night-ex-gift-box' }, label: 'Shop the gift box' },
            { to: '/sets/chinese/30th-celebration', label: 'See the 30th Celebration card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Chinese Day &amp; Night gift box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG gift box from Pokémon China, released on September 16, 2026, the same day
          as the 30th Celebration set. Its Chinese name is <Zh>30周年庆典 收藏展示礼盒 太阳伊布ex&amp;月亮伊布ex</Zh>, which translates
          as 30th Celebration Collection Display Box: Espeon ex &amp; Umbreon ex.
        </p>
        <p>
          The theme is day and night. Pokémon China describes Pokémon celebrating the 30th anniversary around the clock, with Espeon
          leading the day and Umbreon the night. The box holds a holo promo card of each, 15 packs of 30th Celebration, a frame that
          displays both cards together, and a day and a night fridge magnet.
        </p>

        <aside className="fact-box" aria-label="Day and Night gift box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={1000} height={923} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Celebration Collection Display Box: Espeon ex &amp; Umbreon ex (<Zh>30周年庆典 收藏展示礼盒</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>September 16, 2026</dd>
              <dt>Released with</dt>
              <dd>30th Celebration</dd>
              <dt>Promo cards</dt>
              <dd>Espeon ex 028/30th-P, Umbreon ex 029/30th-P</dd>
              <dt>Booster packs</dt>
              <dd>15 packs of 30th Celebration (set code 30thC), 6 cards each</dd>
              <dt>Extras</dt>
              <dd>Two-card display frame, 2 fridge magnets</dd>
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
        <p>Pokémon China lists six items in the box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Day and Night gift box
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
        <figure style={{ margin: '28px auto', maxWidth: 620 }}>
          <img
            src={img('box')}
            alt="The Day and Night gift box: a window box with the Espeon ex and Umbreon ex promos at the top among 30th Celebration packs, and the two magnets along the bottom"
            loading="lazy"
            width={1000}
            height={923}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption>The box shows both promo cards, the packs and the magnets through its window.</figcaption>
        </figure>

        <h2 id="promos">The Espeon ex and Umbreon ex promos</h2>
        <p>
          The two promo cards are the reason to buy this box. Both are holo and both are illustrated by REND. Pokémon China describes
          them as a pair: Espeon by day and Umbreon by night, each sitting on a balcony and looking out at a celebration in the
          distance, with Eevee beside them. Pokémon China invites you to look closely and spot the other Pokémon in each scene.
        </p>
        <p>
          Espeon ex 028/30th-P has 260 HP, and its attack does 30 damage for each of your Pokémon in play. Umbreon ex 029/30th-P has
          270 HP, and its attack does 100 damage, or 240 if your opponent's Active Pokémon already has damage counters on it.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('espeon-ex-promo')} alt="Espeon ex 028/30th-P promo: Espeon sitting on a balcony by day beside Eevee, with a 30 in the sky" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Espeon ex</strong>028/30th-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-ex-promo')} alt="Umbreon ex 029/30th-P promo: Umbreon sitting on a balcony at night beside Eevee, with fireworks and a 30 in the sky" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Umbreon ex</strong>029/30th-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          In Simplified Chinese, these two cards come only in this box. They are numbered with the 30th Celebration promos, which come in the special products
          released around the set. The <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> shows them with the
          rest of the set.
        </p>

        <h2 id="packs">The 15 booster packs</h2>
        <p>
          The box holds 15 packs of 30th Celebration, 6 cards each, which is 90 cards. The set code is 30thC, printed in the top
          corner of each pack. 30th Celebration is the 30th anniversary set,
          with 30 different Pikachu cards and 30 classic cards brought back from the game's history. Every pack has a Pikachu.
        </p>

        <h2 id="frame-and-magnets">The display frame and magnets</h2>
        <p>
          The two-card display frame holds the Espeon ex and Umbreon ex promos side by side. Pokémon China describes its colours as
          bright and dark meeting in the middle, to match the day and night cards.
        </p>
        <p>
          The two fridge magnets carry the same theme. One shows Espeon and other Pokémon celebrating by day, and the other shows
          Umbreon and others celebrating by night. Each is built from three layers of illustration, which gives it a 3D look.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('display-frame')} alt="The two-card display frame holding the Espeon ex and Umbreon ex promos, light on the left and dark on the right" loading="lazy" width={1000} height={740} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Display frame</strong>Holds both promos
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('magnet')} alt="The day celebration fridge magnet: Espeon, Pikachu and other Pokémon celebrating in bright daylight" loading="lazy" width={1000} height={583} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Day magnet</strong>Espeon by day
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('night-magnet')} alt="The night celebration fridge magnet: Umbreon and Pikachu dancing on a stage with Mewtwo, Gengar, Greninja and other Pokémon under fireworks" loading="lazy" width={1000} height={578} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Night magnet</strong>Umbreon by night
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="released-with">What else came out the same day</h2>
        <p>
          Pokémon China announced the gift box on August 26, 2026, together with other 30th Celebration products released on
          September 16. They are easy to mix up, so here is how they differ:
        </p>
        <ul>
          <li>
            <strong>Deluxe deck sets, Espeon or Umbreon.</strong> A ready-to-play Espeon ex or Umbreon ex deck with a metal deck box,
            a coin, a paper playmat and 2 booster packs. These are for playing, not the collector box.
          </li>
          <li>
            <strong>Card display sleeve sets, Greninja ex or Sylveon ex.</strong> A promo card with a new illustration, a card display
            keychain and 3 booster packs. Our{' '}
            <Link to="/blog/greninja-sylveon-display-set-release-news">Greninja ex and Sylveon ex sets post</Link> covers them.
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
          This is the 30th Celebration box for collectors. The Espeon ex and Umbreon ex promos come only in this box, the frame shows
          them off as the pair they are drawn to be, and 15 packs make it a proper way to open the set.
        </p>
      </BlogPostLayout>
    </>
  )
}
