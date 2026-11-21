import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'ogerpon-mask-gift-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/ogerpon-mask-gift-box-${name}.webp`

// Pokémon China's contents list, in its order. All four boxes hold the same items in their own mask.
const CONTENTS = [
  { item: 'Brilliant Fantasy booster packs', qty: '3', note: 'Set code CSV8C, 20 cards each' },
  { item: 'Stellar Crystal booster packs', qty: '3', note: 'Set code CSV9C, 20 cards each' },
  { item: 'Kitakami theme pack', qty: '1', note: '5 holo cards, code csvNC' },
  { item: 'Ogerpon mask art sleeves', qty: '64', note: 'One pack of 64, in the box’s mask' },
  { item: 'Ogerpon mask coin die', qty: '1', note: '' },
  { item: 'Damage counter dice', qty: '4', note: '' },
  { item: 'Ogerpon mask fridge magnet', qty: '1', note: 'Shaped like the mask' },
  { item: 'Ogerpon mask card storage box', qty: '1', note: 'With 2 dividers' },
]

const BOXES = [
  { key: 'teal', name: 'Teal Mask', zh: '碧草面具', colour: 'Green', boxH: 714, accH: 700, accW: 628 },
  { key: 'hearthflame', name: 'Hearthflame Mask', zh: '火灶面具', colour: 'Red', boxH: 711, accH: 700, accW: 636 },
  { key: 'wellspring', name: 'Wellspring Mask', zh: '水井面具', colour: 'Blue', boxH: 721, accH: 700, accW: 604 },
  { key: 'cornerstone', name: 'Cornerstone Mask', zh: '础石面具', colour: 'Brown', boxH: 720, accH: 700, accW: 591 },
]

// The Kitakami theme pack's slots, from Pokémon China's odds table.
const SLOTS = [
  { slot: 'Pokémon holo (3 cards)', base: '20 cards, 93.33%', chase: 'Art rare holo: 2 cards, 6.67%' },
  { slot: 'Pokémon ex holo (1 card)', base: '11 cards, 95.00%', chase: 'Teal Mask Ogerpon ex special holo: 1 card, 5.00%' },
  { slot: 'Trainer holo (1 card)', base: '9 cards, 99.00%', chase: 'Carmine special illustration holo: 1 card, 1.00%' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Ogerpon mask gift boxes?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'four-boxes', label: 'The four masks' },
  { id: 'kitakami-pack', label: 'The Kitakami theme pack' },
  { id: 'chase-cards', label: 'The chase cards in the theme pack' },
  { id: 'packs', label: 'The 6 booster packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Ogerpon mask gift boxes?',
    a: 'Four official Pokémon TCG gift boxes from Pokémon China, one for each of Ogerpon’s masks: Teal, Hearthflame, Wellspring and Cornerstone. Their Chinese name is 厄诡椪 面具礼盒. Each holds 3 Brilliant Fantasy packs, 3 Stellar Crystal packs, a Kitakami theme pack and accessories in its mask’s design.',
  },
  {
    q: 'When were the Ogerpon mask gift boxes released?',
    a: 'May 15, 2026, the same day as Stellar Crystal. Pokémon China announced them on April 17, 2026.',
  },
  {
    q: 'What is the Kitakami theme pack?',
    a: 'A new 5-card pack made for these boxes, with Pokémon and Trainers from Kitakami. Every card is holo: 3 Pokémon, 1 Pokémon ex and 1 Trainer. It is only sold inside the Ogerpon mask gift boxes.',
  },
  {
    q: 'What are the chase cards in the Kitakami theme pack?',
    a: 'Teal Mask Ogerpon ex 043/040, a special holo in 5% of packs, and Carmine 044/040, a special illustration holo in 1% of packs. Two art rare holos, Teal Mask Ogerpon 041/040 and Pecharunt 042/040, come up 6.67% of the time in the Pokémon slots.',
  },
  {
    q: 'Do the four boxes have different contents?',
    a: 'Only the designs differ. Every box holds the same packs and the same accessories, each in its own mask’s colours.',
  },
  {
    q: 'How many booster packs are in each box?',
    a: '6 booster packs of 20 cards, 3 Brilliant Fantasy and 3 Stellar Crystal, plus 1 Kitakami theme pack of 5 cards. That is 125 cards.',
    links: [
      { to: '/sets/chinese/brilliant-fantasy-csv8', label: 'Brilliant Fantasy' },
      { to: '/sets/chinese/stellar-crystal-csv9', label: 'Stellar Crystal' },
    ],
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. All the packs, the theme pack included, are from the Simplified Chinese release.',
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


export const Route = createFileRoute('/blog/ogerpon-mask-gift-box-release-news')({
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
  component: OgerponMaskGiftBoxPost,
})

function OgerponMaskGiftBoxPost() {
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
    name: 'What comes in each Chinese Ogerpon mask gift box',
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
        lede="Pokémon China's four Ogerpon mask gift boxes released on May 15, 2026. This post covers what is in each one: 6 booster packs, a new Kitakami theme pack with its own chase cards, and accessories in the box's mask."
        cta={{
          heading: 'Looking for a Chinese gift box?',
          body: 'Browse our special products, or open Brilliant Fantasy, one of the two sets in these boxes.',
          links: [
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-slim-booster-box' }, label: 'Shop the Brilliant Fantasy booster box', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Ogerpon mask gift boxes?</h2>
        <p>
          They are four official Simplified Chinese Pokémon TCG gift boxes from Pokémon China, released on May 15, 2026, the same day as
          Stellar Crystal. Each is named after one of Ogerpon's masks, for example <Zh>厄诡椪 碧草面具礼盒</Zh>, the Ogerpon Teal Mask
          Gift Box. The others are Hearthflame, Wellspring and Cornerstone.
        </p>
        <p>
          The theme is Kitakami and its Festival of Masks. Every box holds 3 Brilliant Fantasy packs, 3 Stellar Crystal packs and a new
          Kitakami theme pack that is only sold in these boxes, plus sleeves, dice, a magnet and a card storage box in its mask's design.
        </p>

        <aside className="fact-box" aria-label="Ogerpon mask gift box key facts">
          {/* Same card as in the chase card section below, where it is described, so this copy is decorative */}
          <img src={img('teal-mask-ogerpon-ex')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Ogerpon Mask Gift Box (<Zh>厄诡椪 面具礼盒</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Teal, Hearthflame, Wellspring, Cornerstone</dd>
              <dt>Released</dt>
              <dd>May 15, 2026</dd>
              <dt>Set codes</dt>
              <dd>CSV8C and CSV9C (the 6 booster packs), csvNC (the theme pack)</dd>
              <dt>Booster packs</dt>
              <dd>3 Brilliant Fantasy, 3 Stellar Crystal, 20 cards each</dd>
              <dt>Theme pack</dt>
              <dd>1 Kitakami theme pack, 5 holo cards</dd>
              <dt>Extras</dt>
              <dd>64 sleeves, coin die, 4 damage counter dice, fridge magnet, card storage box</dd>
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
        <p>Pokémon China lists eight items in each box. All four boxes hold the same items, each in its own mask:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Ogerpon mask gift box
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

        <h2 id="four-boxes">The four masks</h2>
        <p>
          Each box is a long box in one mask's colour, printed with Ogerpon wearing that mask and the mask's symbol on the end. The sleeves
          show the mask itself, and the fridge magnet is cut in the mask's shape. Pokémon China lists a card storage box with 2 dividers in
          each set but does not show it on its own or say whether it is the long box in the photos.
        </p>
        <ul className="card-grid cols-2">
          {BOXES.map((b) => (
            <li key={b.key}>
              <figure>
                <img src={img(`${b.key}-box`)} alt={`The Ogerpon ${b.name} gift box: a long ${b.colour.toLowerCase()} box printed with Ogerpon in the ${b.name}`} loading="lazy" width={1000} height={b.boxH} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>{b.name}</strong>
                  <Zh>{b.zh}</Zh> · {b.colour}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <ul className="card-grid cols-4">
          {BOXES.map((b) => (
            <li key={b.key}>
              <figure>
                <img src={img(`${b.key}-accessories`)} alt={`The ${b.name} accessories: art sleeves showing the mask, a coin die, 4 damage counter dice and a mask-shaped fridge magnet`} loading="lazy" width={b.accW} height={b.accH} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
                <figcaption>
                  <strong>{b.name}</strong>Sleeves, dice, magnet
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="kitakami-pack">The Kitakami theme pack</h2>
        <p>
          The Kitakami theme pack (<Zh>北上乡专题包</Zh>) is new with these boxes. Pokémon China describes it as a pack of the Pokémon and
          Trainers you meet at Kitakami's Festival of Masks: Ogerpon, Okidogi, Munkidori, Fezandipiti and Pecharunt, and Trainers such as
          Carmine. Its cards are numbered out of 040 and carry the code csvNC.
        </p>
        <p>Each pack has 5 cards, and every one is holo:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-slots" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-slots" className="sr-only">
              Kitakami theme pack slots and odds
            </caption>
            <thead>
              <tr>
                <th scope="col">Slot</th>
                <th scope="col">Regular cards</th>
                <th scope="col">Chase</th>
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((s) => (
                <tr key={s.slot}>
                  <th scope="row">{s.slot}</th>
                  <td>{s.base}</td>
                  <td>{s.chase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Percentages are the ones Pokémon China publishes for each slot. Cards within each group are made in equal numbers.</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', margin: '24px 0' }}>
          <figure style={{ margin: 0, flex: '0 0 180px' }}>
            <img src={img('kitakami-pack')} alt="The Kitakami theme pack: a green pack with the four Ogerpon mask symbols" loading="lazy" width={472} height={800} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
            <figcaption>Kitakami theme pack</figcaption>
          </figure>
          <figure style={{ margin: 0, flex: '1 1 320px' }}>
            <img src={img('kitakami-holos')} alt="Eight of the Pokémon holo cards in the Kitakami theme pack, all four Ogerpon masks, a second Teal Mask Ogerpon, Munkidori, Bloodmoon Ursaluna and Pecharunt" loading="lazy" width={1200} height={835} style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 10 }} />
            <figcaption>Some of the Pokémon holos.</figcaption>
          </figure>
        </div>
        <figure style={{ margin: '24px auto' }}>
          <img src={img('kitakami-ex')} alt="Eight of the Pokémon ex holo cards in the Kitakami theme pack, all four Ogerpon ex, Hydrapple ex, Fezandipiti ex, Pecharunt ex and Bloodmoon Ursaluna ex" loading="lazy" width={1200} height={835} style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 10 }} />
          <figcaption>Some of the Pokémon ex holos. One comes in every pack.</figcaption>
        </figure>
        <figure style={{ margin: '24px auto' }}>
          <img src={img('kitakami-trainers')} alt="Three Trainer holo cards from the Kitakami theme pack: Festival Grounds 039/040, Binding Mochi 033/040 and Briar 038/040" loading="lazy" width={1200} height={553} style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 10 }} />
          <figcaption>Festival Grounds, Binding Mochi and Briar, three of the Trainer holos.</figcaption>
        </figure>

        <h2 id="chase-cards">The chase cards in the theme pack</h2>
        <p>
          Teal Mask Ogerpon ex 043/040 is the special holo in the ex slot, in 5% of packs. It is a Tera Pokémon ex with 210 HP by 5ban
          Graphics. Its Ability, Teal Dance, attaches a Basic Grass Energy from your hand to it once a turn and draws a card, and its attack
          does 30 more damage for each Energy attached to both Active Pokémon.
        </p>
        <p>
          Carmine 044/040 is the special illustration holo in the Trainer slot, in 1% of packs. Illustrated by En Morikura, it shows Carmine
          grinning and holding out a tray of noodles at the festival. Pokémon China asks who she is inviting to share the food. The card
          has you discard your hand and draw 5 cards.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('teal-mask-ogerpon-ex')} alt="Teal Mask Ogerpon ex 043/040 special holo: Ogerpon in green crystal shapes behind the mask" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Teal Mask Ogerpon ex</strong>043/040 · 5% of packs
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('carmine')} alt="Carmine 044/040 special illustration: Carmine grinning and holding out a tray of noodles at the festival" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Carmine</strong>044/040 · 1% of packs
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The two art rare holos are Teal Mask Ogerpon 041/040 by kodama, Ogerpon walking through a field of tall grass at sunset, and
          Pecharunt 042/040 by nagimiso, Pecharunt floating over a pink, misty forest.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 640 }}>
          <img src={img('kitakami-art-rares')} alt="The two art rare holos: Teal Mask Ogerpon 041/040 in tall grass at sunset, and Pecharunt 042/040 over a pink misty forest" loading="lazy" width={1200} height={832} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
        </figure>

        <h2 id="packs">The 6 booster packs</h2>
        <p>
          Each box also holds 3 packs of Brilliant Fantasy (set code CSV8C) and 3 packs of Stellar Crystal (set code CSV9C), 20 cards each.
          Brilliant Fantasy is the set with Milotic ex and every Ogerpon mask, which suits the theme. Our{' '}
          <Link to="/blog/brilliant-fantasy-release-news">Brilliant Fantasy</Link> and{' '}
          <Link to="/blog/stellar-crystal-release-news">Stellar Crystal</Link> posts cover both sets.
        </p>
        <ul className="card-grid cols-4" style={{ maxWidth: 420 }}>
          <li>
            <figure>
              <img src={img('brilliant-fantasy-pack')} alt="A Brilliant Fantasy 20-card booster pack with Milotic on the front" loading="lazy" width={351} height={700} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Brilliant Fantasy</strong>3 packs
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('stellar-crystal-pack')} alt="A Stellar Crystal 20-card booster pack with Pikachu on the front" loading="lazy" width={351} height={700} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Stellar Crystal</strong>3 packs
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these products on May 15, 2026, as well:</p>
        <ul>
          <li>
            <strong>Stellar Crystal booster packs.</strong> The set with Stellar Tera Pikachu ex. Our{' '}
            <Link to="/blog/stellar-crystal-release-news">Stellar Crystal post</Link> covers it.
          </li>
          <li>
            <strong>Stellar Crystal coin sets and accessories.</strong> A coin set with 3 packs, a Pikachu coin album and two Pikachu coin
            case charms.
          </li>
          <li>
            <strong>2026 Dragon Boat Festival gift box.</strong> 5 Stellar Crystal packs, a fridge magnet and a pouch.
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
          The packs and accessories are the same in all four, so pick the mask you like best. The draw is the Kitakami theme pack: it is
          only in these boxes, every card is holo, and it has its own Teal Mask Ogerpon ex and Carmine chase cards.
        </p>
      </BlogPostLayout>
    </>
  )
}
