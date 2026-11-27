import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { GEM_SETS } from '~/data/gem-sets-index'

const post = BLOG_POSTS.find((p) => p.slug === 'pikachu-gift-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/pikachu-gift-box-${name}.webp`

// The seven booster sets on Pokémon China's contents list, in its order.
// Every one is a 2026 Scarlet & Violet release with a card list on this site.
const PACKS = [
  { set: 'Blade Awakening', code: 'CSV7C', cards: 20, to: '/sets/chinese/blade-awakening-csv7' },
  { set: 'Brilliant Fantasy', code: 'CSV8C', cards: 20, to: '/sets/chinese/brilliant-fantasy-csv8' },
  { set: 'Stellar Crystal', code: 'CSV9C', cards: 20, to: '/sets/chinese/stellar-crystal-csv9' },
  { set: 'Terastal Gathering', code: 'CSV9.5C', cards: 10, to: '/sets/chinese/terastal-gathering-csv9-5' },
  { set: 'Chasing Glory', code: 'CSV10C', cards: 20, to: '/sets/chinese/chasing-glory-csv10' },
  { set: 'Black Bolt', code: 'CSV10.5C', cards: 20, to: '/sets/chinese/black-bolt-csv10-5' },
  { set: 'White Flare', code: 'CSV10.6C', cards: 20, to: '/sets/chinese/white-flare-csv10-6' },
] as const
// Card counts come from the set list index, so they always match the set pages.
const cardCount = (to: string) => GEM_SETS.find((g) => g.path === to)!.cardCount
const PACKS_EACH = 3
const TOTAL_PACKS = PACKS.length * PACKS_EACH
const TOTAL_CARDS = PACKS.reduce((n, p) => n + p.cards * PACKS_EACH, 0)

// Pokémon China's contents list, with the seven booster rows folded into one.
const CONTENTS = [
  { item: 'Pikachu ex special illustration holo promo card', qty: '1', note: '489/SV-P' },
  { item: 'Booster packs', qty: String(TOTAL_PACKS), note: `${PACKS_EACH} each from the seven sets released in 2026` },
  { item: 'Themed art sleeves', qty: '64', note: 'One set' },
  { item: 'Themed deck box', qty: '1', note: 'With 2 dividers' },
  { item: 'Themed card display frame', qty: '1', note: 'For showing a single card' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Radiant Crystal Pikachu gift box?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promo', label: 'The Pikachu ex promo card' },
  { id: 'packs', label: 'The 21 booster packs' },
  { id: 'accessories', label: 'The sleeves, deck box and display frame' },
  { id: 'box', label: 'The box itself' },
  { id: 'names', label: 'What is it called?' },
  { id: 'not-known', label: 'What Pokémon China has not said' },
  { id: 'pre-orders', label: 'Pre-orders at EBI Collectibles' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Radiant Crystal Pikachu gift box?',
    a: 'An official Pokémon TCG gift box from Pokémon China, themed on Pikachu with the Stellar Tera Type. Its Chinese name is 璀璨晶耀 皮卡丘专属礼盒. It holds a Pikachu ex promo card, 21 booster packs, 64 sleeves, a deck box and a card display frame.',
  },
  {
    q: 'When does the Radiant Crystal Pikachu gift box release?',
    a: 'December 4, 2026. Pokémon China announced it on November 20, 2026.',
  },
  {
    q: 'What is the promo card in the Pikachu gift box?',
    a: 'Pikachu ex, numbered 489/SV-P and illustrated by James Turner. It is a Lightning-type Tera Pokémon ex with 200 HP.',
  },
  {
    q: 'How many booster packs are in the Pikachu gift box?',
    a: `${TOTAL_PACKS}: three packs from each of the seven Simplified Chinese Scarlet & Violet sets released in 2026. Six of the sets come as 20-card packs and Terastal Gathering comes as 10-card packs, which is ${TOTAL_CARDS} cards in all.`,
  },
  {
    q: 'Which sets are the booster packs from?',
    a: 'Three packs from each of the seven Simplified Chinese Scarlet & Violet sets released in 2026.',
    links: [{ to: '/sets/chinese/blade-awakening-csv7', label: 'Blade Awakening' }, { to: '/sets/chinese/brilliant-fantasy-csv8', label: 'Brilliant Fantasy' }, { to: '/sets/chinese/stellar-crystal-csv9', label: 'Stellar Crystal' }, { to: '/sets/chinese/terastal-gathering-csv9-5', label: 'Terastal Gathering' }, { to: '/sets/chinese/chasing-glory-csv10', label: 'Chasing Glory' }, { to: '/sets/chinese/black-bolt-csv10-5', label: 'Black Bolt' }, { to: '/sets/chinese/white-flare-csv10-6', label: 'White Flare' }],
  },
  {
    q: 'What accessories come in the Pikachu gift box?',
    a: 'A set of 64 themed art sleeves, a themed deck box with two dividers, and a themed card display frame.',
  },
  {
    q: 'What is the Pikachu gift box called in Chinese?',
    a: '璀璨晶耀 皮卡丘专属礼盒. It translates roughly as Brilliant Crystal Shine: Pikachu Exclusive Gift Box. There is no official English name, most shops call it the Radiant Crystal Pikachu Gift Box. You may also see the Pikachu Exclusive Gift Box or the Stellar Pikachu Gift Box. It is not the older Radiant Energy Pikachu gift box from 2024.',
  },
  {
    q: 'Can I pre-order the Radiant Crystal Pikachu gift box?',
    a: 'Yes. Pre-orders are open at EBI Collectibles. The box ships the week after the December 4 release.',
  },
  {
    q: 'How much is the Radiant Crystal Pikachu gift box?',
    a: 'See the pre-order box in this post for our current price. The box releases on December 4, 2026.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The promo card and all 21 booster packs are from the Simplified Chinese release.',
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


export const Route = createFileRoute('/blog/pikachu-gift-box-release-news')({
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
  component: PikachuGiftBoxPost,
})

function PikachuGiftBoxPost() {
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
    name: 'What comes in the Chinese Radiant Crystal Pikachu gift box',
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
        lede="Pokémon China's Radiant Crystal Pikachu gift box releases on December 4, 2026. This post covers everything in it: the Stellar Tera Pikachu ex promo, the 21 booster packs from this year's seven sets, and the matching accessories."
        cta={{
          heading: 'Pre-order the Radiant Crystal Pikachu Gift Box',
          body: 'On pre-order now. Ships the week after the December 4 release.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-radiant-crystal-pikachu-gift-box' }, label: 'Pre-order the gift box' },
            { to: '/sets/chinese', label: 'Browse the Chinese set lists', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Radiant Crystal Pikachu gift box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG gift box from Pokémon China, announced on November 20, 2026, and releasing on December 4,
          2026. Its Chinese name is <Zh>璀璨晶耀 皮卡丘专属礼盒</Zh>, which translates roughly as Brilliant Crystal Shine: Pikachu
          Exclusive Gift Box. Shops in the US sell it as the Radiant Crystal Pikachu Gift Box. It is part of the Scarlet &amp; Violet
          series.
        </p>
        <p>
          The box is themed on Pikachu with the Stellar Tera Type, the crowned, jewelled Pikachu that is also on the Stellar Crystal pack.
          Inside are a Pikachu ex promo card with a special illustration, three booster packs from each of the seven sets released in
          2026, and a matching set of sleeves, a deck box and a card display frame.
        </p>

        <p>
          <strong>Pre-orders are open at EBI Collectibles.</strong> <a href="#pre-orders">See the price and pre-order</a>.
        </p>

        <aside className="fact-box" aria-label="Radiant Crystal Pikachu gift box key facts">
          {/* Same card as in the promo section below, where it is described, so this copy is decorative */}
          <img src={img('pikachu-ex-promo')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Brilliant Crystal Shine: Pikachu Exclusive Gift Box (<Zh>璀璨晶耀 皮卡丘专属礼盒</Zh>)
              </dd>
              <dt>Releases</dt>
              <dd>December 4, 2026</dd>
              <dt>Series</dt>
              <dd>Scarlet &amp; Violet</dd>
              <dt>Promo card</dt>
              <dd>Pikachu ex, 489/SV-P</dd>
              <dt>Booster packs</dt>
              <dd>
                {TOTAL_PACKS} packs, {PACKS_EACH} from each of 7 sets
              </dd>
              <dt>Accessories</dt>
              <dd>64 sleeves, deck box, card display frame</dd>
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
        <p>Going by Pokémon China's own contents list:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Radiant Crystal Pikachu gift box
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
            src={img('announcement')}
            alt="Pokémon China's announcement image for the gift box: the pink box in the middle, with the Pikachu ex promo card, sleeves, deck box, display frame and booster packs around it, and the release date December 4, 2026 in Chinese along the bottom"
            loading="lazy"
            width={1400}
            height={1051}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
          <figcaption>Pokémon China's announcement image, showing everything in the box.</figcaption>
        </figure>

        <h2 id="promo">The Pikachu ex promo card</h2>
        <p>
          The gift box includes one holo promo card: Pikachu ex, numbered 489/SV-P and illustrated by James Turner. Pikachu wears its
          Stellar crown and throws its arms out with a big smile, against a magenta background, with Tera jewels of every colour
          around its head.
        </p>
        <p>
          It is a Lightning-type Tera Pokémon ex with 200 HP. Its Ability keeps it in play with 10 HP if an attack would Knock it Out
          from full HP. Its attack does 300 damage and makes you discard three Energy from it.
        </p>
        <ul className="card-grid cols-1">
          <li>
            <figure>
              <img src={img('pikachu-ex-promo')} alt="Pikachu ex 489/SV-P promo card: Stellar Tera Pikachu smiling with its arms out on a magenta background" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Pikachu ex</strong>489/SV-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 21 booster packs</h2>
        <p>
          The box holds {PACKS_EACH} booster packs from each of the seven Simplified Chinese Scarlet &amp; Violet sets released in 2026.
          Six of the sets come as 20-card packs. Terastal Gathering only comes in 10-card packs. That is {TOTAL_PACKS} packs and{' '}
          {TOTAL_CARDS} cards in all.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-packs" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-packs" className="sr-only">
              Booster packs in the Radiant Crystal Pikachu gift box
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Set code</th>
                <th scope="col">Packs</th>
                <th scope="col">Cards per pack</th>
                <th scope="col">Card list</th>
              </tr>
            </thead>
            <tbody>
              {PACKS.map((p) => (
                <tr key={p.code}>
                  <th scope="row">{p.set}</th>
                  <td>{p.code}</td>
                  <td>{PACKS_EACH}</td>
                  <td>{p.cards}</td>
                  <td>
                    <Link to={p.to}>
                      All {cardCount(p.to)} {p.set} cards
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          We have a full card list and checklist for every set in the box. All of them are on our{' '}
          <Link to="/sets/chinese">Chinese set lists</Link> page.
        </p>
        <p>
          The 20-card packs are the larger of the two pack sizes these sets come in, the size sold in Jumbo booster boxes. Each has 6
          holos, or 7 in Black Bolt and White Flare. Pokémon China
          points to each set's own product page for its odds. Our guides cover them for{' '}
          <Link to="/blog/stellar-crystal-set-guide">Stellar Crystal</Link>, <Link to="/blog/terastal-gathering-set-guide">Terastal Gathering</Link>,{' '}
          <Link to="/blog/chasing-glory-set-guide">Chasing Glory</Link>,{' '}
          <Link to="/blog/black-bolt-set-guide">Black Bolt</Link> and <Link to="/blog/white-flare-set-guide">White Flare</Link>.
        </p>

        <h2 id="accessories">The sleeves, deck box and display frame</h2>
        <p>
          Three accessories come with the box, all in the same pink Stellar Pikachu design. There is a set of 64 art sleeves, a deck
          box with two dividers, and a card display frame for showing off a single card.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('sleeves')} alt="Pink card sleeves printed with Stellar Tera Pikachu in gold, fanned out" loading="lazy" width={1000} height={967} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Art sleeves</strong>64 in the set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('deck-box')} alt="Pink deck box with Stellar Tera Pikachu on the front flap" loading="lazy" width={549} height={659} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Deck box</strong>With 2 dividers
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('display-frame')} alt="Pink acrylic card display frame with four gold screws and a stand" loading="lazy" width={900} height={1502} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Card display frame</strong>Holds one card
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="box">The box itself</h2>
        <p>
          The outer box takes its colours from the promo card. It is pink with a faceted, crystal-like pattern, and Stellar Tera
          Pikachu is printed across the lid in gold with pale jewels above its head. Pokémon China says a special print finish makes
          the Pikachu on the box shine.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 640 }}>
          <img src={img('box')} alt="The pink Radiant Crystal Pikachu gift box, closed, with Pikachu printed in gold across the lid" loading="lazy" width={1100} height={612} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The gift box.</figcaption>
        </figure>

        <h2 id="names">What is it called?</h2>
        <p>
          Pokémon China calls it <Zh>璀璨晶耀 皮卡丘专属礼盒</Zh>. There is no official English name. A close translation is Brilliant
          Crystal Shine: Pikachu Exclusive Gift Box. Most shops call it the Radiant Crystal Pikachu Gift Box, and so do we. You may also
          see the Stellar Pikachu Gift Box, the Chinese Pikachu Gift Box, the Pikachu Exclusive Gift Box or the Pikachu ex Gift Box.
          They are all the same product.
        </p>
        <p>
          It is not the Radiant Energy Pikachu gift box from 2024, an older Simplified Chinese box with different packs and cards.
        </p>

        <h2 id="not-known">What Pokémon China has not said</h2>
        <p>
          The announcement gives the release date and the full contents. It does not say how many boxes are being made, and it does not
          say which stores will sell it.
        </p>

        <h2 id="pre-orders">Pre-orders at EBI Collectibles</h2>
        <p>
          The Radiant Crystal Pikachu gift box is on pre-order at EBI Collectibles. It ships the week after the December 4 release, from
          the US. Pre-orders are charged in full at checkout.
        </p>
        <BuyStrip />

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
          This box is a look back at the whole year: three packs from every 2026 set, a Pikachu ex promo with its own illustration,
          and accessories that match it. If you missed any of this year's sets, it is one way to open a little of each.
        </p>
      </BlogPostLayout>
    </>
  )
}
