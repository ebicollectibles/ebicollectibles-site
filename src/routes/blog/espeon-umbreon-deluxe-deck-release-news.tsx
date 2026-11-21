import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'espeon-umbreon-deluxe-deck-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/espeon-umbreon-deluxe-deck-${name}.webp`

// Pokémon China's contents list, in its order. Both sets hold the same items, in their own Pokémon.
const CONTENTS = [
  { item: 'Pokémon ex deck', qty: '1', note: 'Espeon ex or Umbreon ex; Pokémon China does not give the card count' },
  { item: 'Metal deck box', qty: '1', note: 'Espeon or Umbreon, with a damage counter box' },
  { item: 'Coin', qty: '1', note: 'Espeon or Umbreon' },
  { item: 'Paper playmat', qty: '1', note: 'Espeon or Umbreon' },
  { item: 'Paper damage counters', qty: '1 sheet', note: '' },
  { item: 'Deck play guide', qty: '1', note: 'How the Espeon ex or Umbreon ex deck plays' },
  { item: '30th Celebration booster packs', qty: '2', note: 'Set code 30thC, 6 cards each, 12 cards in all' },
  { item: 'Player starter guide', qty: '1', note: 'The rules and how a turn works' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Espeon ex and Umbreon ex deluxe deck sets?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'decks', label: 'The Espeon ex and Umbreon ex decks' },
  { id: 'guides', label: 'The play guides' },
  { id: 'accessories', label: 'The metal deck box, playmat and coin' },
  { id: 'packs', label: 'The 2 booster packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Espeon ex and Umbreon ex deluxe deck sets?',
    a: 'Two official Pokémon TCG deck sets from Pokémon China for the 30th anniversary. Their Chinese names are 30周年庆典 豪华卡组套装 太阳伊布 and 30周年庆典 豪华卡组套装 月亮伊布. Each holds a ready-to-play Espeon ex or Umbreon ex deck, a metal deck box, a coin, a paper playmat, paper damage counters, two guides and 2 booster packs of 30th Celebration.',
  },
  {
    q: 'When were the deluxe deck sets released?',
    a: 'September 16, 2026, the same day as the 30th Celebration set. Pokémon China announced them on August 26, 2026.',
  },
  {
    q: 'Which Espeon ex and Umbreon ex cards lead the decks?',
    a: 'Espeon ex 014/040, illustrated by 5ban Graphics, and Umbreon ex 017/040, illustrated by Keisuke Azuma. Both are marked 30thDC, the deck sets’ own code.',
  },
  {
    q: 'Are these the same cards as the Espeon ex and Umbreon ex in the Day & Night gift box?',
    a: 'No. The gift box has Espeon ex 028/30th-P and Umbreon ex 029/30th-P, illustrated by REND, with Espeon and Umbreon on a balcony. The deck cards have different numbers, illustrators and illustrations. The HP and attacks are the same.',
  },
  {
    q: 'How many booster packs are in each deluxe deck set?',
    a: 'Two 30th Celebration booster packs (set code 30thC) of 6 cards each, which is 12 cards.',
    links: [{ to: '/sets/chinese/30th-celebration', label: '30th Celebration' }],
  },
  {
    q: 'How many cards are in each deck?',
    a: 'Pokémon China does not say. It lists the deck as one set and publishes no deck list.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The deck and both booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Are these sets sold under other names?',
    a: 'Yes. Pokémon China has no English name for them, so shops translate it differently. The 30th Celebration Espeon ex Deck Set and Umbreon ex Deck Set are the same products.',
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


export const Route = createFileRoute('/blog/espeon-umbreon-deluxe-deck-release-news')({
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
  component: EspeonUmbreonDeluxeDeckPost,
})

function EspeonUmbreonDeluxeDeckPost() {
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
    name: "What comes in each Chinese 30th Celebration Espeon ex or Umbreon ex deluxe deck set",
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
        lede="Pokémon China's Espeon ex and Umbreon ex deluxe deck sets released on September 16, 2026, alongside 30th Celebration. This post covers what is in each one: a ready-to-play deck, a metal deck box, a playmat, a coin, two guides and 2 booster packs."
        cta={{
          heading: 'Looking for 30th Celebration?',
          body: 'Open the set these decks come with, or browse our special products.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the 30th Celebration booster box' },
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Espeon ex and Umbreon ex deluxe deck sets?</h2>
        <p>
          They are two official Simplified Chinese Pokémon TCG deck sets from Pokémon China, released on September 16, 2026, the same day
          as the 30th Celebration set. Their Chinese name is <Zh>30周年庆典 豪华卡组套装</Zh>, which translates as 30th Celebration Deluxe
          Deck Set. One version is Espeon (<Zh>太阳伊布</Zh>) and the other is Umbreon (<Zh>月亮伊布</Zh>).
        </p>
        <p>
          Each set is a ready-to-play deck built around its Pokémon ex, with the battle accessories in the same design, a guide to the deck
          and a starter guide to the rules. Pokémon China says the guides are there so that someone playing for the first time can pick it
          up quickly. Each set also has 2 packs of 30th Celebration.
        </p>

        <aside className="fact-box" aria-label="Espeon ex and Umbreon ex deluxe deck set key facts">
          {/* Same card as in the decks section below, where it is described, so this copy is decorative */}
          <img src={img('espeon-ex')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                30th Celebration Deluxe Deck Set (<Zh>30周年庆典 豪华卡组套装</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Espeon ex, Umbreon ex</dd>
              <dt>Released</dt>
              <dd>September 16, 2026</dd>
              <dt>Lead cards</dt>
              <dd>Espeon ex 014/040, Umbreon ex 017/040 (marked 30thDC)</dd>
              <dt>Set code</dt>
              <dd>30thC (the 2 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>2 packs of 30th Celebration, 6 cards each</dd>
              <dt>Extras</dt>
              <dd>Metal deck box, coin, paper playmat, paper damage counters, 2 guides</dd>
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
        <p>Pokémon China lists eight items in each set. Both hold the same items, each in its own Pokémon:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Espeon ex or Umbreon ex deluxe deck set
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
              <img src={img('espeon-set')} alt="The Espeon deluxe deck set: a silver window box showing 2 booster packs, the Espeon ex card, an Espeon coin and a pastel metal deck box with an Espeon outline" loading="lazy" width={1000} height={821} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Espeon set</strong>Silver box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-set')} alt="The Umbreon deluxe deck set: a dark blue window box showing 2 booster packs, the Umbreon ex card, an Umbreon coin and a dark metal deck box with an Umbreon outline" loading="lazy" width={1000} height={822} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Umbreon set</strong>Dark blue box
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="decks">The Espeon ex and Umbreon ex decks</h2>
        <p>
          Each deck is built around one Pokémon ex, shown at the front of the box. Both cards carry the 30th anniversary Pikachu mark. They are numbered out of 40 and marked 30thDC, the code for these deck sets.
        </p>
        <p>
          Espeon ex 014/040 is illustrated by 5ban Graphics and shows Espeon leaping among stars and falling petals. It has 260 HP, and its
          attack does 30 damage for each of your Pokémon in play, so Pokémon China's advice is to fill your Bench. Umbreon ex 017/040 is
          illustrated by Keisuke Azuma and shows Umbreon dashing through streaks of light. It has 270 HP, and its attack does 100 damage, or
          240 if your opponent's Active Pokémon already has damage counters on it.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('espeon-ex')} alt="Espeon ex 014/040: Espeon leaping among stars and yellow petals, with the 30th anniversary Pikachu mark" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Espeon ex</strong>014/040 · Espeon deck
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-ex')} alt="Umbreon ex 017/040: Umbreon dashing through streaks of light, with the 30th anniversary Pikachu mark" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Umbreon ex</strong>017/040 · Umbreon deck
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          Pokémon China does not publish a deck list or say how many cards are in each deck. Its play guides show some of the other cards.
          The Espeon ex guide shows Cherrim, Azumarill, Mew, Victini and Eevee, and the Umbreon ex guide shows Zoroark, Zeraora, Mewtwo and
          Hydreigon. Both show Poké Pad and Ultra Ball. A note on the Umbreon ex guide says some cards are packed at random, so a deck may
          not have every card shown.
        </p>
        <p>
          These are different cards from the Espeon ex and Umbreon ex promos in the Day &amp; Night gift box, which have their own numbers,
          illustrations and illustrator. Our <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link> covers
          those.
        </p>

        <h2 id="guides">The play guides</h2>
        <p>
          Each set has two guides. The deck play guide shows how the deck wins: fill the Bench to power up Espeon ex, or put damage on the
          opponent first and finish with Umbreon ex. It also explains a few common cards. The player starter guide covers the rules and the
          steps of a turn, with the set's own Pokémon ex as the example.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('espeon-deck-guide')} alt="The Espeon ex deck play guide: a light sheet showing Espeon ex, the cards that support it, and a playmat diagram adding up 180 damage" loading="lazy" width={1000} height={711} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Espeon ex guide</strong>Espeon set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-deck-guide')} alt="The Umbreon ex deck play guide: a dark blue sheet showing Umbreon ex, the cards that support it, and a playmat diagram adding up 240 damage" loading="lazy" width={1000} height={711} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Umbreon ex guide</strong>Umbreon set
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="accessories">The metal deck box, playmat and coin</h2>
        <p>
          The deck box is metal and holds a separate box for damage counters. The Espeon one is in pastel blue, pink and green with a rainbow
          outline of Espeon, and the Umbreon one is dark blue with a rainbow outline of Umbreon. Both have the 30th anniversary Pikachu on the
          lid. The paper playmat comes in the same two designs, and the coin is light blue with Espeon or purple with Umbreon. A sheet of
          paper damage counters, with burn and poison markers, is the same in both sets.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('espeon-deck-box')} alt="The Espeon metal deck box: tall, in pastel blue, pink and green, with a rainbow Espeon outline and the 30th anniversary Pikachu on the lid" loading="lazy" width={600} height={974} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Espeon deck box</strong>Metal
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-deck-box')} alt="The Umbreon metal deck box: tall, in dark blue, with a rainbow Umbreon outline and the 30th anniversary Pikachu on the lid" loading="lazy" width={600} height={974} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Umbreon deck box</strong>Metal
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('damage-counters')} alt="The paper damage counter sheet: yellow 10, orange 50 and red 100 counters with burn and poison markers" loading="lazy" width={1000} height={480} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Damage counters</strong>Paper, in both sets
              </figcaption>
            </figure>
          </li>
        </ul>
        <ul className="card-grid cols-4">
          <li>
            <figure>
              <img src={img('espeon-playmat')} alt="The Espeon paper playmat: a light pastel mat with a rainbow Espeon outline and card zones" loading="lazy" width={800} height={781} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Espeon playmat</strong>Paper
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-playmat')} alt="The Umbreon paper playmat: a dark blue mat with an Umbreon outline and card zones" loading="lazy" width={800} height={780} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Umbreon playmat</strong>Paper
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('espeon-coin')} alt="The light blue Espeon coin" loading="lazy" width={415} height={415} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Espeon coin</strong>Light blue
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-coin')} alt="The purple Umbreon coin" loading="lazy" width={415} height={415} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Umbreon coin</strong>Purple
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 2 booster packs</h2>
        <p>
          Each set holds 2 packs of 30th Celebration, 6 cards each, which is 12 cards. The set code is 30thC, printed in the top corner of
          each pack. 30th Celebration is the 30th anniversary set, with 30 different Pikachu cards and 30 classic cards brought back from the
          game's history. The <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> covers the set.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>
          Pokémon China announced the deluxe deck sets on August 26, 2026, together with other 30th Celebration products released on
          September 16:
        </p>
        <ul>
          <li>
            <strong>The Day &amp; Night gift box.</strong> Espeon ex and Umbreon ex promos, 15 packs, a display frame
            and two magnets. Our <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link> covers it.
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
          These are the 30th Celebration sets for starting to play. Each one is a deck you can use straight away, with a metal deck box, a
          playmat and two guides, so a new player has everything needed for a first game. Espeon ex and Umbreon ex each have their own
          illustration here, separate from the Day &amp; Night gift box promos.
        </p>
      </BlogPostLayout>
    </>
  )
}
