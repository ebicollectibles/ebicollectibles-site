import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/master-strategy-deck-2-${name}.webp`

// Pokémon China's contents list, in its order. All three sets hold the same items, in their own Pokémon.
const CONTENTS = [
  { item: 'Pokémon ex deck', qty: '1', note: '60 cards: Raging Bolt ex, Dragapult ex or Gholdengo ex' },
  { item: 'Upgrade pack', qty: '1', note: '15 cards for the same deck' },
  { item: 'Chasing Glory booster packs', qty: '4', note: 'Set code CSV10C, 20 cards each, 80 cards in all' },
  { item: 'Art sleeves', qty: '64', note: 'One of 8 designs, at random' },
  { item: 'Deck box', qty: '1', note: 'In the deck’s Pokémon, with 2 dividers' },
  { item: 'Coin die', qty: '1', note: 'With Raging Bolt, Dragapult and Gholdengo in silhouette' },
  { item: 'Damage counter dice', qty: '6', note: 'Metal' },
  { item: 'Burn marker', qty: '1', note: '' },
  { item: 'Poison marker', qty: '1', note: '' },
  { item: 'Basic strategy sheet', qty: '1', note: 'How the deck plays' },
  { item: 'Upgrade guide', qty: '1', note: 'How to change the deck' },
]

// Deck lists read off Pokémon China's images. Pokémon China gives Chinese card names only; the English names are ours.
const DECKS = [
  {
    id: 'raging-bolt',
    name: 'Raging Bolt ex',
    cards: [
      ['Teal Mask Ogerpon ex', 3], ['Fezandipiti ex', 1], ['Raging Bolt ex', 3], ['Hoothoot', 3], ['Noctowl', 3], ['Fan Rotom', 2],
      ['Energy Retrieval', 2], ['Earthen Vessel', 4], ['Nest Ball', 4], ['Ultra Ball', 4], ['Prime Catcher', 1], ['Switch', 2],
      ['Night Stretcher', 2], ['Crispin', 2], ["Professor Sada's Vitality", 4], ['Iono', 4], ["Boss's Orders", 2],
      ['Area Zero Underdepths', 2], ['Basic Grass Energy', 6], ['Basic Fighting Energy', 3], ['Basic Lightning Energy', 3],
    ],
  },
  {
    id: 'dragapult',
    name: 'Dragapult ex',
    cards: [
      ['Munkidori', 2], ['Fezandipiti ex', 1], ['Dreepy', 4], ['Drakloak', 4], ['Dragapult ex', 3], ['Tatsugiri', 1],
      ['Counter Catcher', 2], ['Earthen Vessel', 2], ['Buddy-Buddy Poffin', 4], ['Nest Ball', 2], ['Ultra Ball', 4],
      ['Night Stretcher', 2], ['Exp. Share', 2], ['Rescue Board', 2], ['Technical Machine: Evolution', 2], ['Iono', 4],
      ["Professor's Research", 2], ['Arven', 4], ["Boss's Orders", 2], ['Artazon', 2], ['Neo Upper Energy', 1],
      ['Luminous Energy', 4], ['Basic Psychic Energy', 2], ['Basic Fire Energy', 2],
    ],
  },
  {
    id: 'gholdengo',
    name: 'Gholdengo ex',
    cards: [
      ['Mew ex', 1], ['Gimmighoul', 4], ['Fezandipiti ex', 1], ['Gholdengo ex', 4], ['Dunsparce', 2], ['Dudunsparce', 2],
      ['Superior Energy Retrieval', 4], ['Earthen Vessel', 2], ['Buddy-Buddy Poffin', 4], ['Nest Ball', 2], ['Ultra Ball', 4],
      ['Prime Catcher', 1], ['Night Stretcher', 2], ['Technical Machine: Evolution', 2], ["Ciphermaniac's Codebreaking", 2],
      ['Iono', 4], ['Arven', 4], ["Boss's Orders", 2], ['Artazon', 2], ['Basic Metal Energy', 11],
    ],
  },
] as const

const TOC = [
  { id: 'what-it-is', label: 'What are the Master Strategy deck building sets?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'decks', label: 'The three decks' },
  { id: 'upgrade', label: 'The upgrade pack and guides' },
  { id: 'packs', label: 'The 4 Chasing Glory packs' },
  { id: 'accessories', label: 'The deck box, sleeves and dice' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Raging Bolt ex, Dragapult ex and Gholdengo ex Master Strategy sets?',
    a: 'Three official Pokémon TCG deck sets from Pokémon China, the second series of Master Strategy deck building sets. Their Chinese name is 大师战略卡组构筑套装. Each holds a ready-built 60-card deck, a 15-card upgrade pack, 4 Chasing Glory booster packs, battle accessories, and two sheets on how to play and change the deck.',
  },
  {
    q: 'When were these Master Strategy sets released?',
    a: 'July 16, 2026, the same day as Chasing Glory. Pokémon China announced them on June 29, 2026.',
  },
  {
    q: 'How are they different from the first Master Strategy sets?',
    a: 'The layout is the same: a 60-card deck, a 15-card upgrade pack, 4 booster packs and the accessories. The first series, released on January 16, 2026, has Charizard ex, Gardevoir ex and Miraidon ex decks with Blade Awakening packs and a VSTAR marker. This series has Raging Bolt ex, Dragapult ex and Gholdengo ex decks with Chasing Glory packs, and no VSTAR marker.',
  },
  {
    q: 'How many booster packs are in each set?',
    a: 'Four Chasing Glory booster packs (set code CSV10C) of 20 cards each, which is 80 cards.',
    links: [{ to: '/sets/chinese/chasing-glory-csv10', label: 'Chasing Glory' }],
  },
  {
    q: 'Which ACE SPEC card is in each deck?',
    a: 'Pokémon China names Prime Catcher in the Raging Bolt ex and Gholdengo ex decks, and Neo Upper Energy in the Dragapult ex deck. Each deck has one copy.',
  },
  {
    q: 'Is there a promo card in these sets?',
    a: 'Pokémon China lists no promo card. Each set is the deck, the upgrade pack, the 4 packs and the accessories.',
  },
  {
    q: 'Do the three sets come with the same sleeves?',
    a: 'Not always. Each set has one pack of 64 sleeves in one of 8 designs, made in equal numbers and packed at random. The designs are Raging Bolt, Dragapult, Gholdengo, Dunsparce, Teal Mask Ogerpon, Tatsugiri, the Energy symbols and a Poké Ball.',
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

export const Route = createFileRoute('/blog/master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news')({
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
  component: MasterStrategyDeckTwoPost,
})

function MasterStrategyDeckTwoPost() {
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
    name: 'What comes in each Chinese Master Strategy deck building set (Raging Bolt ex, Dragapult ex, Gholdengo ex)',
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
        lede="Pokémon China's second series of Master Strategy deck building sets released on July 16, 2026, alongside Chasing Glory. This post covers what is in each one: a ready-built Raging Bolt ex, Dragapult ex or Gholdengo ex deck, a 15-card upgrade pack, 4 Chasing Glory packs and a set of battle accessories."
        cta={{
          heading: 'Looking for Chasing Glory?',
          body: 'Open the set these decks come with, or browse our special products.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-slim-booster-box' }, label: 'Shop the Chasing Glory booster box' },
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Raging Bolt ex, Dragapult ex and Gholdengo ex sets?</h2>
        <p>
          They are three official Simplified Chinese Pokémon TCG deck sets from Pokémon China, released on July 16, 2026, the same day as
          the Chasing Glory set. Their Chinese name is <Zh>大师战略卡组构筑套装</Zh>, which translates as Master Strategy Deck Building
          Set. The three versions are Raging Bolt ex, Dragapult ex and Gholdengo ex.
        </p>
        <p>
          This is the second series. The first, with Charizard ex, Gardevoir ex and Miraidon ex decks, came out on January 16, 2026, and
          our <Link to="/blog/master-strategy-deck-charizard-gardevoir-miraidon-release-news">first Master Strategy sets post</Link> covers
          it. Each set is built for playing. It holds a ready-built 60-card deck, a sheet on how the deck plays, and a 15-card upgrade pack
          with a guide to changing the deck. There are also 4 packs of Chasing Glory and the accessories you need for a game: a deck box,
          sleeves, a coin die, damage counter dice and markers.
        </p>

        <aside className="fact-box" aria-label="Master Strategy deck building set key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('raging-bolt-box')} alt="" loading="lazy" width={765} height={470} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Master Strategy Deck Building Set (<Zh>大师战略卡组构筑套装</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Raging Bolt ex, Dragapult ex, Gholdengo ex</dd>
              <dt>Released</dt>
              <dd>July 16, 2026</dd>
              <dt>Set code</dt>
              <dd>CSV10C (the 4 packs inside)</dd>
              <dt>Deck</dt>
              <dd>60 cards, plus a 15-card upgrade pack</dd>
              <dt>Booster packs</dt>
              <dd>4 packs of Chasing Glory, 20 cards each</dd>
              <dt>Promo card</dt>
              <dd>None listed</dd>
              <dt>Extras</dt>
              <dd>64 sleeves, deck box, coin die, 6 damage counter dice, burn and poison markers</dd>
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
        <p>Pokémon China lists eleven items in each set. All three hold the same items, each in its own Pokémon:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Raging Bolt ex, Dragapult ex or Gholdengo ex Master Strategy set
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
              <img src={img('raging-bolt-box')} alt="The Raging Bolt ex set: a black and lilac box with the Raging Bolt ex card behind a window and Raging Bolt on the side" loading="lazy" width={765} height={470} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Raging Bolt ex set</strong>Lilac
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('dragapult-box')} alt="The Dragapult ex set: a black and teal box with the Dragapult ex card behind a window and Dragapult on the side" loading="lazy" width={765} height={470} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Dragapult ex set</strong>Teal
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('gholdengo-box')} alt="The Gholdengo ex set: a black and yellow box with the Gholdengo ex card behind a window and Gholdengo on the side" loading="lazy" width={765} height={470} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Gholdengo ex set</strong>Yellow
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="decks">The three decks</h2>
        <p>
          Each deck is 60 cards and has one ACE SPEC card. Pokémon China published the full list for all three, numbered in the deck's own
          run (for example 001/031 in the Raging Bolt ex deck). The lists below are read off those images. Pokémon China gives the card names
          in Chinese only, so the English names are ours.
        </p>

        <h3>Raging Bolt ex</h3>
        <p>
          Pokémon China pitches this deck at players who like to attack hard and win fast. Alongside Raging Bolt ex it names Teal Mask
          Ogerpon ex and Fezandipiti ex as its strong Pokémon, Earthen Vessel, Night Stretcher and Crispin among its Trainers, and Prime
          Catcher as its ACE SPEC.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('raging-bolt-cards')} alt="One of each card in the Raging Bolt ex deck, fanned out: the Pokémon along the front and the Trainers and Energy behind" loading="lazy" width={1057} height={679} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Raging Bolt ex deck, from Pokémon China.</figcaption>
        </figure>
        <DeckList deck={DECKS[0]} />

        <h3>Dragapult ex</h3>
        <p>
          Pokémon China describes this one as a deck that spreads damage over time and then sweeps the board. It names Munkidori and
          Tatsugiri alongside Dragapult ex, Buddy-Buddy Poffin, Night Stretcher and Technical Machine: Evolution among its Trainers, and Neo
          Upper Energy as its ACE SPEC.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('dragapult-cards')} alt="One of each card in the Dragapult ex deck, fanned out: the Pokémon along the front and the Trainers and Energy behind" loading="lazy" width={1052} height={846} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Dragapult ex deck, from Pokémon China.</figcaption>
        </figure>
        <DeckList deck={DECKS[1]} />

        <h3>Gholdengo ex</h3>
        <p>
          Pokémon China calls this the deck for players who like to keep reusing their resources. It names Mew ex and Dudunsparce alongside
          Gholdengo ex, Buddy-Buddy Poffin, Superior Energy Retrieval and Ciphermaniac's Codebreaking among its Trainers, and Prime Catcher as
          its ACE SPEC.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 640 }}>
          <img src={img('gholdengo-cards')} alt="One of each card in the Gholdengo ex deck, fanned out: the Pokémon along the front and the Trainers and Metal Energy behind" loading="lazy" width={1055} height={713} style={{ width: '100%', height: 'auto' }} />
          <figcaption>One of each card in the Gholdengo ex deck, from Pokémon China.</figcaption>
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
              <img src={img('strategy-sheet')} alt="The Raging Bolt ex basic strategy sheet: a lilac sheet showing Raging Bolt ex and Teal Mask Ogerpon ex with notes on how to play them" loading="lazy" width={728} height={1029} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Basic strategy sheet</strong>Raging Bolt ex deck
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('rebuild-guide')} alt="The Raging Bolt ex upgrade guide: a black sheet with steps for changing the deck and a row of suggested cards" loading="lazy" width={728} height={1029} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Upgrade guide</strong>Raging Bolt ex deck
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 4 Chasing Glory packs</h2>
        <p>
          Each set holds 4 packs of Chasing Glory, 20 cards each, which is 80 cards. The set code is CSV10C. Chasing Glory is built around
          Trainer's Pokémon, and Pokémon China suggests opening the packs to find new cards for the deck. Our{' '}
          <Link to="/blog/chasing-glory-release-news">Chasing Glory post</Link> and the{' '}
          <Link to="/sets/chinese/chasing-glory-csv10">Chasing Glory card list</Link> cover the set.
        </p>

        <h2 id="accessories">The deck box, sleeves and dice</h2>
        <p>
          The deck box matches the set: lilac with Raging Bolt, teal with Dragapult, or yellow with Gholdengo, and each has 2 dividers. The
          coin die shows Raging Bolt, Dragapult and Gholdengo in silhouette. There are 6 metal damage counter dice and round burn and poison
          markers. Unlike the first series, there is no VSTAR marker.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('raging-bolt-deck-box')} alt="The lilac Raging Bolt deck box with Raging Bolt on the front" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Raging Bolt deck box</strong>Raging Bolt ex set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('dragapult-deck-box')} alt="The teal Dragapult deck box with Dragapult on the front" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Dragapult deck box</strong>Dragapult ex set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('gholdengo-deck-box')} alt="The yellow Gholdengo deck box with Gholdengo on the front" loading="lazy" width={700} height={822} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Gholdengo deck box</strong>Gholdengo ex set
              </figcaption>
            </figure>
          </li>
        </ul>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('coin-die')} alt="The grey coin die, with Pokémon silhouettes on its faces" loading="lazy" width={694} height={728} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Coin die</strong>1 in each set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('damage-dice')} alt="Six black damage counter dice marked 10, 20 and 50" loading="lazy" width={800} height={440} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Damage counter dice</strong>6 in each set
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('markers')} alt="The round red burn marker and purple poison marker" loading="lazy" width={600} height={805} style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Markers</strong>Burn and poison
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The 64 sleeves come in one of 8 designs, made in equal numbers and packed at random, so the sleeves do not always match the deck.
          The designs are Raging Bolt, Dragapult, Gholdengo, Dunsparce, Teal Mask Ogerpon, Tatsugiri, the Energy symbols and a Poké Ball.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 680 }}>
          <img src={img('sleeves')} alt="The 8 sleeve designs: Raging Bolt on lilac, Dragapult on teal, Gholdengo on yellow, Dunsparce on pale yellow, Teal Mask Ogerpon on green, Tatsugiri on coral, and the Energy symbols and a Poké Ball on dark blue" loading="lazy" width={1192} height={784} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
          <figcaption>The 8 sleeve designs, in Pokémon China's sample images. Each set has one, at random.</figcaption>
        </figure>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these products on July 16, 2026, with Chasing Glory:</p>
        <ul>
          <li>
            <strong>Chasing Glory.</strong> The main set, with its coin set and a Mewtwo coin album. Our{' '}
            <Link to="/blog/chasing-glory-release-news">Chasing Glory post</Link> covers it.
          </li>
          <li>
            <strong>The Team Rocket briefcase.</strong> A Team Rocket's Mewtwo ex promo, a box of 6 Chasing Glory packs and a briefcase.
            Our <Link to="/blog/team-rocket-briefcase-release-news">Team Rocket briefcase post</Link> covers it.
          </li>
          <li>
            <strong>Lillie and N battle set boxes.</strong> Six Chasing Glory packs and battle accessories in each Trainer's design.
          </li>
          <li>
            <strong>Happy Combo.</strong> A starter set of four decks: Dragonite ex, Mewtwo ex, Camerupt and Sinistcha.
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
          Like the first series, these are the sets to buy if you want to play. Each one is a full 60-card deck with an ACE SPEC, a plan for
          how to use it and a way to improve it, and the 4 Chasing Glory packs give you something to open on top. Pick the deck you want to
          play.
        </p>
      </BlogPostLayout>
    </>
  )
}
