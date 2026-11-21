import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'master-strategy-deck-charizard-gardevoir-miraidon-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/master-strategy-deck-1-${name}.webp`

// Pokémon China's contents list, in its order. All three sets hold the same items, in their own Pokémon.
const CONTENTS = [
  { item: 'Pokémon ex deck', qty: '1', note: '60 cards: Charizard ex, Gardevoir ex or Miraidon ex' },
  { item: 'Upgrade pack', qty: '1', note: '15 cards for the same deck' },
  { item: 'Blade Awakening booster packs', qty: '4', note: 'Set code CSV7C, 20 cards each, 80 cards in all' },
  { item: 'Art sleeves', qty: '64', note: 'One of 8 designs, at random' },
  { item: 'Deck box', qty: '1', note: 'In the deck’s Pokémon, with 2 dividers' },
  { item: 'Coin die', qty: '1', note: 'With the deck’s Pokémon in silhouette' },
  { item: 'Damage counter dice', qty: '6', note: 'Metal' },
  { item: 'VSTAR marker', qty: '1', note: 'Acrylic' },
  { item: 'Burn marker', qty: '1', note: '' },
  { item: 'Poison marker', qty: '1', note: '' },
  { item: 'Basic strategy sheet', qty: '1', note: 'How the deck plays' },
  { item: 'Upgrade guide', qty: '1', note: 'How to change the deck' },
]

// Deck lists read off Pokémon China's images. Pokémon China gives Chinese card names only; the English names are ours.
const DECKS = [
  {
    id: 'charizard',
    name: 'Charizard ex',
    cards: [
      ['Charmander', 4], ['Charmeleon', 2], ['Radiant Charizard', 1], ['Charizard ex', 3], ['Pidgey', 2], ['Pidgeotto', 1],
      ['Pidgeot ex', 2], ['Counter Catcher', 2], ['Super Rod', 2], ['Buddy-Buddy Poffin', 2], ['Nest Ball', 4], ['Ultra Ball', 4],
      ['Rare Candy', 4], ['Switch', 2], ['Vitality Band', 2], ['Defiance Band', 1], ['Iono', 4], ["Professor's Research", 2],
      ['Arven', 4], ["Boss's Orders", 2], ['Artazon', 2], ['Basic Fire Energy', 8],
    ],
  },
  {
    id: 'gardevoir',
    name: 'Gardevoir ex',
    cards: [
      ['Radiant Greninja', 1], ['Ralts', 4], ['Kirlia', 4], ['Gardevoir ex', 3], ['Drifloon', 2], ['Scream Tail', 1],
      ['Flutter Mane', 1], ['Counter Catcher', 2], ['Super Rod', 2], ['Earthen Vessel', 2], ['Buddy-Buddy Poffin', 2],
      ['Nest Ball', 4], ['Ultra Ball', 4], ['Bravery Charm', 3], ['Technical Machine: Evolution', 2], ['Iono', 4],
      ["Professor's Research", 2], ['Arven', 4], ["Boss's Orders", 2], ['Artazon', 2], ['Basic Psychic Energy', 9],
    ],
  },
  {
    id: 'miraidon',
    name: 'Miraidon ex',
    cards: [
      ['Raichu V', 1], ['Raikou V', 1], ['Iron Hands ex', 2], ['Miraidon ex', 2], ['Squawkabilly ex', 1], ['Switch Cart', 4],
      ['Electric Generator', 4], ['Super Rod', 2], ['Nest Ball', 4], ['Ultra Ball', 2], ['Rescue Board', 1], ['Heavy Baton', 1],
      ['Forest Seal Stone', 2], ['Bravery Charm', 2], ["Professor's Research", 4], ['Arven', 4], ["Boss's Orders", 4],
      ['Town Store', 2], ['Double Turbo Energy', 2], ['Basic Lightning Energy', 15],
    ],
  },
] as const

const TOC = [
  { id: 'what-it-is', label: 'What are the Master Strategy deck building sets?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'decks', label: 'The three decks' },
  { id: 'upgrade', label: 'The upgrade pack and guides' },
  { id: 'packs', label: 'The 4 Blade Awakening packs' },
  { id: 'accessories', label: 'The deck box, sleeves and dice' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Master Strategy deck building sets?',
    a: 'Three official Pokémon TCG deck sets from Pokémon China: Charizard ex, Gardevoir ex and Miraidon ex. Their Chinese name is 大师战略卡组构筑套装. Each holds a ready-built 60-card deck, a 15-card upgrade pack, 4 Blade Awakening booster packs, battle accessories, and two sheets on how to play and change the deck.',
  },
  {
    q: 'When were the Master Strategy sets released?',
    a: 'January 16, 2026, the same day as Blade Awakening. Pokémon China announced them on December 25, 2025.',
  },
  {
    q: 'How many booster packs are in each set?',
    a: 'Four Blade Awakening booster packs (set code CSV7C) of 20 cards each, which is 80 cards.',
    links: [{ to: '/sets/chinese/blade-awakening-csv7', label: 'Blade Awakening' }],
  },
  {
    q: 'Is there a promo card in the Master Strategy sets?',
    a: 'Pokémon China lists no promo card. Each set is the deck, the upgrade pack, the 4 packs and the accessories.',
  },
  {
    q: 'Which cards are in the upgrade pack?',
    a: 'Pokémon China says it holds 15 useful cards for changing the deck, and the upgrade guide explains how to use them. It does not list the 15 cards, and its photos of the guide show only part of it.',
  },
  {
    q: 'Do the three sets come with the same sleeves?',
    a: 'Not always. Each set has one pack of 64 sleeves in one of 8 designs, made in equal numbers and packed at random. The designs are Charizard, Pidgeot, Gardevoir, Drifloon, Miraidon, Iron Hands, a Poké Ball and the Energy symbols.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The deck, the upgrade pack and all 4 booster packs are from the Simplified Chinese release.',
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

function DeckList({ deck }: { deck: (typeof DECKS)[number] }) {
  return (
    <div className="table-scroll" role="group" aria-labelledby={`tbl-${deck.id}`} tabIndex={0}>
      <table className="data-table">
        <caption id={`tbl-${deck.id}`} className="sr-only">
          The 60 cards in the {deck.name} deck
        </caption>
        <thead>
          <tr>
            <th scope="col">Card</th>
            <th scope="col">Copies</th>
          </tr>
        </thead>
        <tbody>
          {deck.cards.map(([name, n]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Route = createFileRoute('/blog/master-strategy-deck-charizard-gardevoir-miraidon-release-news')({
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
  component: MasterStrategyDeckOnePost,
})

function MasterStrategyDeckOnePost() {
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
    name: 'What comes in each Chinese Master Strategy deck building set (Charizard ex, Gardevoir ex, Miraidon ex)',
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
        lede="Pokémon China's Master Strategy deck building sets released on January 16, 2026, alongside Blade Awakening. This post covers what is in each one: a ready-built Charizard ex, Gardevoir ex or Miraidon ex deck, a 15-card upgrade pack, 4 Blade Awakening packs and a set of battle accessories."
        cta={{
          heading: 'Looking for Blade Awakening?',
          body: 'Open the set these decks come with, or browse our special products.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-blade-awakening-slim-booster-box' }, label: 'Shop the Blade Awakening booster box' },
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Master Strategy deck building sets?</h2>
        <p>
          They are three official Simplified Chinese Pokémon TCG deck sets from Pokémon China, released on January 16, 2026, the same day
          as the Blade Awakening set. Their Chinese name is <Zh>大师战略卡组构筑套装</Zh>, which translates as Master Strategy Deck
          Building Set. The three versions are Charizard ex, Gardevoir ex and Miraidon ex.
        </p>
        <p>
          Each set is built for playing. It holds a ready-built 60-card deck, a sheet on how the deck plays, and a 15-card upgrade pack
          with a guide to changing the deck. There are also 4 packs of Blade Awakening and the accessories you need for a game: a deck box,
          sleeves, a coin die, damage counter dice and markers.
        </p>

        <aside className="fact-box" aria-label="Master Strategy deck building set key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('charizard-box')} alt="" loading="lazy" width={765} height={468} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Master Strategy Deck Building Set (<Zh>大师战略卡组构筑套装</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Charizard ex, Gardevoir ex, Miraidon ex</dd>
              <dt>Released</dt>
              <dd>January 16, 2026</dd>
              <dt>Set code</dt>
              <dd>CSV7C (the 4 packs inside)</dd>
              <dt>Deck</dt>
              <dd>60 cards, plus a 15-card upgrade pack</dd>
              <dt>Booster packs</dt>
              <dd>4 packs of Blade Awakening, 20 cards each</dd>
              <dt>Promo card</dt>
              <dd>None listed</dd>
              <dt>Extras</dt>
              <dd>64 sleeves, deck box, coin die, 6 damage counter dice, VSTAR, burn and poison markers</dd>
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
        <p>Pokémon China lists twelve items in each set. All three hold the same items, each in its own Pokémon:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Master Strategy deck building set
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
              <img src={img('charizard-box')} alt="The Charizard ex set: a black and orange box with the Charizard ex card behind a window and a large Charizard on the side" loading="lazy" width={765} height={468} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charizard ex set</strong>Orange
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('gardevoir-box')} alt="The Gardevoir ex set: a black and green box with the Gardevoir ex card behind a window and Gardevoir on the side" loading="lazy" width={765} height={468} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Gardevoir ex set</strong>Green
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('miraidon-box')} alt="The Miraidon ex set: a black and purple box with the Miraidon ex card behind a window and Miraidon on the side" loading="lazy" width={765} height={468} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Miraidon ex set</strong>Purple
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="decks">The three decks</h2>
        <p>
          Each deck is 60 cards. Pokémon China published the full list for all three, numbered in the deck's own run (for example 001/033
          in the Charizard ex deck). The lists below are read off those images. Pokémon China gives the card names in Chinese only, so the
          English names are ours.
        </p>

        <h3>Charizard ex</h3>
        <p>
          Pokémon China pitches this deck at players who like big damage and coming back to win with one hit. Alongside Charizard ex it
          names Pidgeot ex and Radiant Charizard as its strong Pokémon, and Arven, Buddy-Buddy Poffin and Counter Catcher among its
          Trainers.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('charizard-cards')} alt="One of each card in the Charizard ex deck, fanned out: the Pokémon along the front and the Trainers and Fire Energy behind" loading="lazy" width={1068} height={695} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Charizard ex deck, from Pokémon China.</figcaption>
        </figure>
        <DeckList deck={DECKS[0]} />

        <h3>Gardevoir ex</h3>
        <p>
          Pokémon China describes this one as a deck for careful planning and control. It names Drifloon and Radiant Greninja alongside
          Gardevoir ex, and Iono, Buddy-Buddy Poffin and Earthen Vessel among its Trainers.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('gardevoir-cards')} alt="One of each card in the Gardevoir ex deck, fanned out: the Pokémon along the front and the Trainers and Psychic Energy behind" loading="lazy" width={1068} height={756} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Gardevoir ex deck, from Pokémon China.</figcaption>
        </figure>
        <DeckList deck={DECKS[1]} />

        <h3>Miraidon ex</h3>
        <p>
          Pokémon China calls this the fast deck, for players who want to win before the opponent sets up. It names Iron Hands ex and Raikou
          V alongside Miraidon ex, and Electric Generator, Rescue Board and Forest Seal Stone among its Trainers.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('miraidon-cards')} alt="One of each card in the Miraidon ex deck, fanned out: the Pokémon along the front and the Trainers and Energy behind" loading="lazy" width={1068} height={694} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Miraidon ex deck, from Pokémon China.</figcaption>
        </figure>
        <DeckList deck={DECKS[2]} />

        <h2 id="upgrade">The upgrade pack and guides</h2>
        <p>
          Each set comes with two sheets. The basic strategy sheet explains how the deck plays, so you can sit down for a game with friends
          or at a store. The upgrade guide is for later: once you have played a few games, it walks through changing the deck using the 15
          cards in the upgrade pack. Pokémon China does not list those 15 cards, and its photos show only part of each sheet.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('strategy-sheet')} alt="The Charizard ex basic strategy sheet: an orange sheet showing Charizard ex and Pidgeot ex with notes on how to play them" loading="lazy" width={728} height={1029} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Basic strategy sheet</strong>Charizard ex deck
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('rebuild-guide')} alt="The Charizard ex upgrade guide: a black sheet with steps for changing the deck and a row of suggested cards" loading="lazy" width={728} height={1029} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Upgrade guide</strong>Charizard ex deck
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 4 Blade Awakening packs</h2>
        <p>
          Each set holds 4 packs of Blade Awakening, 20 cards each, which is 80 cards. The set code is CSV7C. Pokémon China suggests opening
          them to find new cards for the deck, and points out that Blade Awakening has ACE SPEC cards. Our{' '}
          <Link to="/blog/blade-awakening-release-news">Blade Awakening post</Link> and the{' '}
          <Link to="/sets/chinese/blade-awakening-csv7">Blade Awakening card list</Link> cover the set.
        </p>

        <h2 id="accessories">The deck box, sleeves and dice</h2>
        <p>
          The deck box matches the set: orange with Charizard, green with Gardevoir, or purple with Miraidon, and each has 2 dividers. The
          coin die shows the same Pokémon in silhouette. There are 6 metal damage counter dice, an acrylic VSTAR marker, and round burn and
          poison markers.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('charizard-deck-box')} alt="The orange Charizard deck box with Charizard wrapped around it" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charizard deck box</strong>Charizard ex set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('gardevoir-deck-box')} alt="The light green Gardevoir deck box with Gardevoir on the front" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Gardevoir deck box</strong>Gardevoir ex set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('miraidon-deck-box')} alt="The purple Miraidon deck box with Miraidon on the front" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Miraidon deck box</strong>Miraidon ex set
              </figcaption>
            </figure>
          </li>
        </ul>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('markers')} alt="The burn and poison markers, a grey coin die with a Pokémon silhouette, and a clear acrylic VSTAR marker" loading="lazy" width={800} height={671} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Markers and coin die</strong>Burn, poison, VSTAR
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('damage-dice')} alt="Six black damage counter dice marked 10, 20 and 50" loading="lazy" width={800} height={440} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Damage counter dice</strong>6 in each set
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The 64 sleeves come in one of 8 designs, made in equal numbers and packed at random, so the sleeves do not always match the deck.
          The designs are Charizard, Pidgeot, Gardevoir, Drifloon, Miraidon, Iron Hands, a Poké Ball and the Energy symbols.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 680 }}>
          <img src={img('sleeves')} alt="The 8 sleeve designs: Charizard on orange, Pidgeot on cream, Gardevoir on green, Drifloon on purple, Miraidon on dark purple, Iron Hands on grey, a Poké Ball on black, and the Energy symbols on black" loading="lazy" width={1192} height={784} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
          <figcaption>The 8 sleeve designs. Each set has one, at random.</figcaption>
        </figure>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these products on January 16, 2026, with Blade Awakening:</p>
        <ul>
          <li>
            <strong>Blade Awakening.</strong> The main set, with its coin set and a Greninja coin album. Our{' '}
            <Link to="/blog/blade-awakening-release-news">Blade Awakening post</Link> covers it.
          </li>
          <li>
            <strong>Battle Academy.</strong> A box for learning the game, with Sprigatito ex, Pikachu ex, Greninja ex and Lucario ex decks.
          </li>
          <li>
            <strong>2026 Lunar New Year gift box.</strong> Five Blade Awakening packs with seasonal extras.
          </li>
          <li>
            <strong>Gem Pack badge set.</strong> Packs of Gem Pack Vol. 1, 2 and 3 with a promo card and a random badge.
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
          These are the sets to buy if you want to play. Each one is a full 60-card deck with a plan for how to use it and a way to improve
          it, and the 4 Blade Awakening packs give you something to open on top. Pick the Pokémon you want to play.
        </p>
      </BlogPostLayout>
    </>
  )
}
