import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { GEM_SETS } from '~/data/gem-sets-index'

const post = BLOG_POSTS.find((p) => p.slug === 'eevee-gift-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/eevee-gift-box-${name}.webp`

// The booster packs: 15 of Terastal Gathering, 10 cards each.
const SET_PATH = '/sets/chinese/terastal-gathering-csv9-5'
// Card count comes from the set list index, so it always matches the set page.
const SET_CARDS = GEM_SETS.find((g) => g.path === SET_PATH)!.cardCount
const PACKS = 15
const CARDS_PER_PACK = 10

// Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: 'Terastal Gathering booster packs', qty: String(PACKS), note: `Set code CSV9.5C, ${CARDS_PER_PACK} cards each, ${PACKS * CARDS_PER_PACK} cards in all` },
  { item: 'Espeon ex holo promo card', qty: '1', note: '297/SV-P' },
  { item: 'Umbreon ex holo promo card', qty: '1', note: '298/SV-P' },
  { item: 'Playmat', qty: '1', note: 'Stellar Eevee with the eight Eeveelutions' },
  { item: 'Playmat storage box', qty: '1', note: 'Long box for the playmat' },
  { item: 'Deck box', qty: '1', note: 'Comes with 1 card protector' },
  { item: 'Card sleeves', qty: '64', note: 'One set' },
  { item: 'Damage counter box', qty: '1', note: 'Sylveon on the lid' },
  { item: 'Damage counter dice', qty: '9', note: '' },
  { item: 'Coin die', qty: '1', note: '' },
  { item: 'Metal magnet', qty: '1', note: 'Sylveon on the front' },
  { item: 'Poisoned marker', qty: '1', note: '' },
  { item: 'Burned marker', qty: '1', note: '' },
]

const ACCESSORIES = [
  { name: 'playmat', title: 'Playmat', note: 'Zones labelled in English', alt: 'White playmat with a gold Stellar Eevee in the middle and the eight Eeveelutions around the Prize, Deck and Trash zones', w: 1400, h: 724 },
  { name: 'playmat-case', title: 'Playmat storage box', note: 'Holds the playmat', alt: 'Long white playmat box with Stellar Eevee in a round medallion and the Eeveelutions’ ear shapes in colour along the lid', w: 1000, h: 278 },
  { name: 'deck-box', title: 'Deck box', note: 'With 1 card protector', alt: 'White deck box with a front flap and Espeon and Umbreon line drawings in two linked circles on the front', w: 1000, h: 765 },
  { name: 'sleeves', title: 'Card sleeves', note: '64 in the set', alt: 'Card sleeve with Leafeon and Glaceon line drawings in green and blue diamonds', w: 792, h: 1088 },
  { name: 'damage-counter-box', title: 'Damage counter box', note: 'Sylveon on the lid', alt: 'White damage counter box with a pink and blue lid, a Sylveon line drawing on top and Eeveelution ear shapes on the side', w: 1000, h: 721 },
  { name: 'dice', title: 'Dice', note: '9 damage counter dice and a coin die', alt: 'Nine pink and blue damage counter dice showing 10, and a larger blue coin die with a Poké Ball', w: 757, h: 635 },
  { name: 'markers', title: 'Poisoned and Burned markers', note: 'One of each', alt: 'Round purple Poisoned marker and round orange and red Burned marker, both with gold rims', w: 1000, h: 504 },
  { name: 'magnet', title: 'Metal magnet', note: 'Sylveon on the front', alt: 'Round metal magnet with Sylveon’s face, pink flowers and a Sylveon ribbon banner', w: 1000, h: 1000 },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Chinese Eevee and Friends gift box?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promos', label: 'The Espeon ex and Umbreon ex promos' },
  { id: 'packs', label: 'The 15 booster packs' },
  { id: 'accessories', label: 'The playmat, deck box and other accessories' },
  { id: 'box', label: 'The box itself' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Eevee and Friends gift box?',
    a: 'An official Pokémon TCG gift box from Pokémon China, themed on Eevee and its eight evolutions. Its Chinese name is 伊布“们”的专属礼盒. It holds 15 Terastal Gathering booster packs, an Espeon ex and an Umbreon ex holo promo card, a playmat, a deck box, 64 sleeves and a set of dice, markers and other play accessories.',
  },
  {
    q: 'When was the Eevee and Friends gift box released?',
    a: 'June 12, 2026, from 10:00 China time, the same day as the Terastal Gathering set. Pokémon China announced it on May 25, 2026.',
  },
  {
    q: 'What promo cards come in the Eevee and Friends gift box?',
    a: 'Espeon ex 297/SV-P and Umbreon ex 298/SV-P, both holo and both illustrated by 5ban Graphics. Each shows the Pokémon wearing a crystal crown inside a ring of jewels in every colour.',
  },
  {
    q: 'How many booster packs are in the Eevee and Friends gift box?',
    a: `Fifteen Terastal Gathering booster packs (set code CSV9.5C) of ${CARDS_PER_PACK} cards each, which is ${PACKS * CARDS_PER_PACK} cards.`,
    links: [{ to: '/sets/chinese/terastal-gathering-csv9-5', label: 'Terastal Gathering' }],
  },
  {
    q: 'What accessories come in the box?',
    a: 'A playmat, a playmat storage box, a deck box with one card protector, 64 card sleeves, a damage counter box, 9 damage counter dice, a coin die, a Poisoned marker, a Burned marker and a metal magnet with Sylveon on the front.',
  },
  {
    q: 'Is this the same as the Day & Night gift box?',
    a: 'No. The Day & Night gift box came out on September 16, 2026, with Espeon ex 028/30th-P and Umbreon ex 029/30th-P, 15 packs of 30th Celebration, a display frame and two magnets. The Eevee and Friends gift box has different Espeon ex and Umbreon ex promos, 297/SV-P and 298/SV-P, and Terastal Gathering packs.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The two promo cards and all 15 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Is this the Chinese SPC, and is it sold under other names?',
    a: 'Yes. Collectors often call it the Chinese SPC, after the English Prismatic Evolutions Super-Premium Collection, because its packs are Terastal Gathering, the Simplified Chinese counterpart to Prismatic Evolutions. Its contents are not the same as the English box. Pokémon China has no English name for it, so shops translate it differently. The Eevee Exclusive Premium Box, the Eevee Premium Gift Box and the Prismatic Eevee Gift Box are the same product.',
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


export const Route = createFileRoute('/blog/eevee-gift-box-release-news')({
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
  component: EeveeGiftBoxPost,
})

function EeveeGiftBoxPost() {
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
    name: 'What comes in the Chinese Eevee and Friends gift box',
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
        lede="Pokémon China's Eevee and Friends gift box released on June 12, 2026, alongside Terastal Gathering. This post covers everything in it: the Espeon ex and Umbreon ex promos, the 15 booster packs, the playmat, the deck box and the rest of the accessories."
        cta={{
          heading: 'Shop the Eevee and Friends gift box',
          body: 'Two promo cards, 15 packs of Terastal Gathering and a full set of Eevee accessories.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-eevees-exclusive-premium-box' }, label: 'Shop the Eevee and Friends gift box' },
            { to: SET_PATH, label: 'See the Terastal Gathering card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Chinese Eevee and Friends gift box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG gift box from Pokémon China, released on June 12, 2026, the same day as the
          Terastal Gathering set (set code CSV9.5C). Its Chinese name is <Zh>伊布“们”的专属礼盒</Zh>, which translates as Eevee and
          Friends Exclusive Gift Box. The <Zh>“们”</Zh> in the name turns Eevee into a group: Eevee and its eight evolutions. It is part
          of the Scarlet &amp; Violet series.
        </p>
        <p>
          Pokémon China describes it as the box that brings all the Eevees together. Inside are 15 packs of Terastal Gathering, the
          Simplified Chinese counterpart to Prismatic Evolutions, an Espeon ex and an Umbreon ex holo promo card, and a full set of
          play accessories in the same white and crystal Eevee design.
        </p>

        <aside className="fact-box" aria-label="Eevee and Friends gift box key facts">
          {/* Same box as in the box section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={1100} height={1081} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Eevee and Friends Exclusive Gift Box (<Zh>伊布“们”的专属礼盒</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>June 12, 2026, 10:00 China time</dd>
              <dt>Series</dt>
              <dd>Scarlet &amp; Violet</dd>
              <dt>Set code</dt>
              <dd>CSV9.5C (the 15 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>
                {PACKS} packs of Terastal Gathering, {CARDS_PER_PACK} cards each
              </dd>
              <dt>Promo cards</dt>
              <dd>Espeon ex 297/SV-P, Umbreon ex 298/SV-P</dd>
              <dt>Accessories</dt>
              <dd>Playmat and storage box, deck box, 64 sleeves, damage counter box, dice, markers, magnet</dd>
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
        <p>Thirteen items, going by Pokémon China's own contents list:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Eevee and Friends gift box
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

        <h2 id="promos">The Espeon ex and Umbreon ex promos</h2>
        <p>
          The box has two holo promo cards, both illustrated by 5ban Graphics. Pokémon China describes them as shining like gemstones.
          Each shows its Pokémon in Stellar Tera form, wearing a crystal crown inside a ring of jewels in every colour, with a rainbow
          crystal border around the card.
        </p>
        <p>
          Espeon ex 297/SV-P is a Psychic-type Tera Pokémon ex with 270 HP. Its first attack does 160 damage and discards a card from
          your opponent's hand without looking. Its second removes one Evolution card from each of your opponent's evolved Pokémon and
          shuffles them back into their deck. Umbreon ex 298/SV-P is a Darkness-type Tera Pokémon ex with 280 HP. Its first attack does
          160 damage and makes your opponent's Active Pokémon Confused. Its second discards all Energy from Umbreon ex and lets you take
          a Prize card.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('espeon-ex-promo')} alt="Espeon ex 297/SV-P promo: Espeon wearing a crystal crown inside a ring of jewels in every colour" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Espeon ex</strong>297/SV-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('umbreon-ex-promo')} alt="Umbreon ex 298/SV-P promo: Umbreon wearing a crystal crown inside a ring of jewels in every colour" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Umbreon ex</strong>298/SV-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          These are not the Espeon ex and Umbreon ex promos from the Day &amp; Night gift box. Those are numbered 028/30th-P and
          029/30th-P and have different illustrations. Our <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box post</Link>{' '}
          covers them.
        </p>

        <h2 id="packs">The 15 booster packs</h2>
        <p>
          The box holds {PACKS} packs of Terastal Gathering, {CARDS_PER_PACK} cards each, which is {PACKS * CARDS_PER_PACK} cards. The set
          code is CSV9.5C, printed in the top corner of each pack. Terastal Gathering is the Simplified Chinese counterpart to Prismatic
          Evolutions, with Eevee and all eight Eeveelutions as Stellar Tera Pokémon ex. Pokémon China points to the set's own product
          page for its odds.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 300 }}>
          <img src={img('terastal-gathering-pack')} alt="A Terastal Gathering booster pack with Eevee in the middle and the Eeveelutions around it, the set code CSV9.5C in the top corner" loading="lazy" width={585} height={1100} style={{ width: '100%', height: 'auto' }} />
          <figcaption>A Terastal Gathering pack.</figcaption>
        </figure>
        <p className="table-note">
          We have the <Link to={SET_PATH}>full list of all {SET_CARDS} Terastal Gathering cards</Link>. The{' '}
          <Link to="/blog/terastal-gathering-set-guide">Terastal Gathering set guide</Link> covers the chase cards and what a box holds, and{' '}
          <Link to="/blog/terastal-gathering-card-origins">Terastal Gathering card origins</Link> matches every card to English.
        </p>

        <h2 id="accessories">The playmat, deck box and other accessories</h2>
        <p>
          Pokémon China says the accessories cover what you need to play a game, and all of them carry the same Eevee design. The
          playmat has a gold Stellar Eevee in the middle, with Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon and Sylveon
          around the zones, which are labelled in English. It comes with a long storage box. The deck box shows Espeon and Umbreon and
          comes with one card protector. The sleeves show Leafeon and Glaceon.
        </p>
        <p>
          The rest are for playing: a damage counter box with Sylveon on the lid, 9 damage counter dice, a coin die, and a Poisoned and a
          Burned marker. The metal magnet has Sylveon's face on the front, and Pokémon China says the back has the Eeveelutions'
          silhouettes in a ring. Pokémon China does not say what the playmat or the boxes are made of.
        </p>
        <ul className="card-grid cols-2">
          {ACCESSORIES.map((a) => (
            <li key={a.name}>
              <figure>
                <img src={img(a.name)} alt={a.alt} loading="lazy" width={a.w} height={a.h} style={{ aspectRatio: '3 / 2', objectFit: 'contain', background: '#fff' }} />
                <figcaption>
                  <strong>{a.title}</strong>
                  {a.note}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="box">The box itself</h2>
        <p>
          The outer box is white with a crystal pattern and rainbow edges. A gold Stellar Eevee in its crown sits in an oval on the front,
          above the Chinese name in rainbow letters, with faint outlines of the Eeveelutions behind it. The side shows Eevee, Vaporeon,
          Jolteon and Flareon in colour.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 560 }}>
          <img src={img('box')} alt="The white Eevee and Friends gift box with a gold Stellar Eevee in an oval on the front and Eevee, Vaporeon, Jolteon and Flareon on the side" loading="lazy" width={1100} height={1081} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The gift box.</figcaption>
        </figure>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China announced the gift box on May 25, 2026, together with two other products released on June 12:</p>
        <ul>
          <li>
            <strong>Terastal Gathering.</strong> The booster set itself, in 10-card packs. Our{' '}
            <Link to="/blog/terastal-gathering-release-news">Terastal Gathering release post</Link> covers it.
          </li>
          <li>
            <strong>Eevee set gift boxes.</strong> Nine smaller boxes, one each for Eevee, Vaporeon, Jolteon, Flareon, Espeon, Umbreon,
            Leafeon, Glaceon and Sylveon. Each holds a binder and 64 sleeves for its Pokémon and 8 packs of Terastal Gathering, with no
            promo card.
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
          This is the big Terastal Gathering box: 15 packs, an Espeon ex and an Umbreon ex promo, and everything you need to play, all in
          one Eevee design. If you like the Eeveelutions and want to open a good run of the set, it covers both.
        </p>
      </BlogPostLayout>
    </>
  )
}
