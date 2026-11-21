import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'journey-gift-boxes-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/journey-gift-boxes-${name}.webp`

// Pokémon China's contents list, in its order. All four boxes hold the same items, in their own Pokémon.
const CONTENTS = [
  { item: 'Booster packs', qty: '3', note: '3 of the same set, at random: Eternal Birth, Miracle Journey or Fearless Terastal; 20 cards each' },
  { item: 'Collect 151: Hope booster packs', qty: '3', note: 'Set code 151C, 20 cards each' },
  { item: 'Journey theme packs', qty: '6', note: '2 cards each' },
  { item: 'Art sleeves', qty: '64', note: 'In the box’s Pokémon' },
  { item: 'Coin die', qty: '1', note: 'In the box’s Pokémon' },
  { item: 'Damage counter dice', qty: '4', note: '' },
  { item: 'Card storage box', qty: '1', note: 'In the box’s Pokémon, with 2 dividers' },
]

// Pokémon China's odds for the Journey theme pack. Each pack has 2 cards, one from each group.
const ODDS = [
  { slot: 'First card', cards: '001–049', what: '36 Pokémon and 13 Pokémon ex', odds: '92.9%' },
  { slot: 'First card', cards: '050–085', what: '36 Shiny Pokémon holos', odds: '5.5%' },
  { slot: 'First card', cards: '112–118', what: '7 Shiny Pokémon ex holos', odds: '1.6%' },
  { slot: 'Second card', cards: 'Unnumbered', what: '8 basic Energy holos', odds: '85%' },
  { slot: 'Second card', cards: '086–111', what: '26 art illustration holos', odds: '13%' },
  { slot: 'Second card', cards: '119–122', what: '4 Special Art Rares', odds: '0.5%' },
  { slot: 'Second card', cards: '123–133', what: '11 gold cards', odds: '1.5%' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Journey gift boxes?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'theme-pack', label: 'The Journey theme pack' },
  { id: 'chase', label: 'The Special Art Rares and gold cards' },
  { id: 'packs', label: 'The 6 booster packs' },
  { id: 'accessories', label: 'The sleeves, dice and storage box' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Journey gift boxes?',
    a: 'Four official Pokémon TCG gift boxes from Pokémon China: Venusaur, Charizard, Blastoise and Gardevoir. Their Chinese name is 启程礼盒. Each holds 6 Journey theme packs, 3 Scarlet & Violet booster packs, 3 Collect 151: Hope booster packs, and sleeves, dice and a card storage box in the box’s Pokémon.',
  },
  {
    q: 'When were the Journey gift boxes released?',
    a: 'June 13, 2025. Pokémon China announced them on May 18, 2025.',
  },
  {
    q: 'What is a Journey theme pack?',
    a: 'A 2-card pack that Pokémon China put in its Journey boxes: these four and the two smaller Journey boxes released the same day. The first card is a Pokémon or Pokémon ex, sometimes a Shiny one. The second is usually a basic Energy holo, and can be an art illustration holo, a Special Art Rare or a gold card. The cards are marked CSVL1C.',
  },
  {
    q: 'Which Special Art Rares are in the Journey theme pack?',
    a: 'Venusaur ex 119/049 by Yoriyuki Ikegami, Charizard ex 120/049 by miki kudo, Blastoise ex 121/049 by Mitsuhiro Arita and Gardevoir ex 122/049 by Kuroimori. Pokémon China gives the four together a 0.5% chance per pack.',
  },
  {
    q: 'Which booster packs are in each box?',
    a: 'Three Collect 151: Hope packs, and 3 packs of one Scarlet & Violet set picked at random: Eternal Birth (CSV1C), Miracle Journey (CSV2C) or Fearless Terastal (CSV3C). The 3 packs in a box are always the same set. All 6 have 20 cards.',
    links: [
      { to: '/sets/chinese/collect-151-hope', label: 'Collect 151: Hope' },
      { to: '/sets/chinese/eternal-birth-csv1', label: 'Eternal Birth' },
      { to: '/sets/chinese/miracle-journey-csv2', label: 'Miracle Journey' },
      { to: '/sets/chinese/fearless-terastal-csv3', label: 'Fearless Terastal' },
    ],
  },
  {
    q: 'Are the Journey boxes part of Collect 151: Journey or Miracle Journey?',
    a: 'No. The names are close in English but not in Chinese. The boxes are 启程礼盒 and hold the Journey theme pack (启程专题包). Collect 151: Journey is 收集啦151 旅, and Miracle Journey is 奇迹启程. Miracle Journey can be one of the random booster packs in the box.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The theme packs and all 6 booster packs are from the Simplified Chinese release.',
  },
  {
    q: 'Are these boxes sold under other names?',
    a: 'Yes. Pokémon China has no English name for them, so shops translate it differently. The Departure Gift Box is the same product.',
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


export const Route = createFileRoute('/blog/journey-gift-boxes-release-news')({
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
  component: JourneyGiftBoxesPost,
})

function JourneyGiftBoxesPost() {
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
    name: "What comes in each Chinese Journey gift box (Venusaur, Charizard, Blastoise, Gardevoir)",
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
        lede="Pokémon China's Journey gift boxes released on June 13, 2025, in four designs: Venusaur, Charizard, Blastoise and Gardevoir. This post covers what is in each one: 6 Journey theme packs, 6 booster packs and a set of accessories in the box's Pokémon."
        cta={{
          heading: 'Looking for Chinese special products?',
          body: 'Browse our gift boxes and special sets, or see the Collect 151: Hope card list.',
          links: [
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products' },
            { to: '/sets/chinese/collect-151-hope', label: 'See the Collect 151: Hope card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Journey gift boxes?</h2>
        <p>
          They are four official Simplified Chinese Pokémon TCG gift boxes from Pokémon China, released on June 13, 2025. Their Chinese name
          is <Zh>启程礼盒</Zh>, which translates as Journey Gift Box. The four designs are Venusaur, Charizard, Blastoise and Gardevoir.
        </p>
        <p>
          Pokémon China describes them as the box for anyone who wants to open plenty of packs. Each holds 6 Journey theme packs, a 2-card
          pack made for these boxes, plus 3 Scarlet &amp; Violet booster packs and 3 Collect 151: Hope booster packs. The sleeves, coin die,
          damage counter dice and card storage box all match the box's Pokémon.
        </p>

        <aside className="fact-box" aria-label="Journey gift box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('charizard-box')} alt="" loading="lazy" width={956} height={631} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Journey Gift Box (<Zh>启程礼盒</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Venusaur, Charizard, Blastoise, Gardevoir</dd>
              <dt>Released</dt>
              <dd>June 13, 2025</dd>
              <dt>Set codes</dt>
              <dd>CSVL1C (theme packs), 151C (Hope packs), CSV1C, CSV2C or CSV3C (the other 3 packs)</dd>
              <dt>Theme packs</dt>
              <dd>6 Journey theme packs, 2 cards each</dd>
              <dt>Booster packs</dt>
              <dd>3 Collect 151: Hope and 3 of one Scarlet &amp; Violet set, 20 cards each</dd>
              <dt>Extras</dt>
              <dd>64 sleeves, coin die, 4 damage counter dice, card storage box</dd>
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
        <p>Pokémon China lists seven items in each box. All four hold the same items, each in its own Pokémon:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Journey gift box
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
        <p>
          The boxes are white, each with its Pokémon in black silhouette and a splash of colour: green leaves for Venusaur, orange flame for
          Charizard, blue water for Blastoise and a pink ribbon for Gardevoir.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('venusaur-box')} alt="The Venusaur Journey gift box: a long white box with a black Venusaur silhouette and green leaves" loading="lazy" width={952} height={631} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Venusaur</strong>Green
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charizard-box')} alt="The Charizard Journey gift box: a long white box with a black Charizard silhouette and an orange flame" loading="lazy" width={956} height={631} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Charizard</strong>Orange
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('blastoise-box')} alt="The Blastoise Journey gift box: a long white box with a black Blastoise silhouette and a blue water splash" loading="lazy" width={975} height={631} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Blastoise</strong>Blue
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('gardevoir-box')} alt="The Gardevoir Journey gift box: a long white box with a black Gardevoir silhouette and a pink ribbon" loading="lazy" width={960} height={631} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Gardevoir</strong>Pink
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="theme-pack">The Journey theme pack</h2>
        <p>
          The Journey theme pack (<Zh>启程专题包</Zh>) is a teal pack of 2 cards, and each box has 6 of them. Its cards are marked CSVL1C and
          numbered out of 049. Pokémon China says the first card may be a Pokémon card that has already appeared in the Scarlet &amp; Violet
          series, and with luck a Shiny one. The second card is most often a basic Energy holo in a new finish, and can also be an art
          illustration holo, a Special Art Rare or a gold card.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 260 }}>
          <img src={img('theme-pack')} alt="The Journey theme pack: a teal pack with a Poké Ball and the words 启程专题包" loading="lazy" width={500} height={938} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
          <figcaption>The Journey theme pack, 2 cards.</figcaption>
        </figure>
        <p>Pokémon China publishes the odds for each card:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Journey theme pack odds
            </caption>
            <thead>
              <tr>
                <th scope="col">Slot</th>
                <th scope="col">Numbers</th>
                <th scope="col">Cards</th>
                <th scope="col">Chance</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.cards}>
                  <th scope="row">{o.slot}</th>
                  <td>{o.cards}</td>
                  <td>{o.what}</td>
                  <td>{o.odds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Within each group, Pokémon China says every card is made in equal numbers. For the first group it adds that the 36 Pokémon make up
          88.3% and the 13 Pokémon ex 11.7%.
        </p>

        <h2 id="chase">The Special Art Rares and gold cards</h2>
        <p>
          The four Special Art Rares match the four boxes: Venusaur ex, Charizard ex, Blastoise ex and Gardevoir ex. Opening the Charizard box
          does not make the Charizard ex more likely, as the cards are packed at random. Together they have a 0.5% chance in each theme pack.
        </p>
        <ul>
          <li>Venusaur ex 119/049, by Yoriyuki Ikegami: Venusaur in a jungle of bright flowers.</li>
          <li>Charizard ex 120/049, by miki kudo: Charizard flying over a volcano at sunset.</li>
          <li>Blastoise ex 121/049, by Mitsuhiro Arita: Blastoise underwater among bubbles.</li>
          <li>Gardevoir ex 122/049, by Kuroimori: Gardevoir in a misty forest by the water.</li>
        </ul>
        <figure style={{ margin: '24px auto', maxWidth: 728 }}>
          <img src={img('special-art-rares')} alt="The four Special Art Rares: Venusaur ex 119/049, Charizard ex 120/049, Blastoise ex 121/049 and Gardevoir ex 122/049" loading="lazy" width={1600} height={539} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
          <figcaption>The four Special Art Rares in the Journey theme pack.</figcaption>
        </figure>
        <p>
          The gold cards, 123 to 133, are 11 cards with a 1.5% chance together. Pokémon China describes three of them as special illustration
          holos in a new finish: Chien-Pao ex 123/049 by aky CG Works, Ting-Lu ex 124/049 by 5ban Graphics and Koraidon ex 125/049 by aky CG
          Works. The rest are gold basic Energy cards.
        </p>
        <figure style={{ margin: '24px auto', maxWidth: 600 }}>
          <img src={img('gold-ex')} alt="The three gold cards: Chien-Pao ex 123/049, Ting-Lu ex 124/049 and Koraidon ex 125/049, drawn in gold lines on gold and green" loading="lazy" width={1000} height={445} style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }} />
          <figcaption>Chien-Pao ex, Ting-Lu ex and Koraidon ex, the gold ex cards.</figcaption>
        </figure>

        <h2 id="packs">The 6 booster packs</h2>
        <p>
          Each box also holds 6 booster packs of 20 cards. Three are Collect 151: Hope (set code 151C). The other three are the same Scarlet
          &amp; Violet set, picked at random from Eternal Birth (CSV1C), Miracle Journey (CSV2C) and Fearless Terastal (CSV3C), with each made in
          equal numbers. The card lists for <Link to="/sets/chinese/collect-151-hope">Collect 151: Hope</Link>,{' '}
          <Link to="/sets/chinese/eternal-birth-csv1">Eternal Birth</Link>,{' '}
          <Link to="/sets/chinese/miracle-journey-csv2">Miracle Journey</Link> and{' '}
          <Link to="/sets/chinese/fearless-terastal-csv3">Fearless Terastal</Link> cover the sets.
        </p>
        <ul className="card-grid cols-4">
          <li>
            <figure>
              <img src={img('collect-151-hope-pack')} alt="A Collect 151: Hope booster pack with Psyduck and Pikachu" loading="lazy" width={400} height={798} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Collect 151: Hope</strong>3 in each box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('eternal-birth-pack')} alt="An Eternal Birth booster pack with Miraidon" loading="lazy" width={400} height={798} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Eternal Birth</strong>Or one of the others
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('miracle-journey-pack')} alt="A Miracle Journey booster pack with Gardevoir" loading="lazy" width={400} height={798} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Miracle Journey</strong>Or one of the others
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('fearless-terastal-pack')} alt="A Fearless Terastal booster pack with Arcanine" loading="lazy" width={400} height={798} style={{ aspectRatio: '1 / 2', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Fearless Terastal</strong>Or one of the others
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="accessories">The sleeves, dice and storage box</h2>
        <p>
          Every accessory follows the box's design. The 64 sleeves are white with the Pokémon's black silhouette and its colour splash. The
          coin die shows the same silhouette, and the 4 damage counter dice are white with numbers in the Pokémon's colour. The card storage
          box, with 2 dividers, matches the outer box. These are the Charizard ones; the other three boxes have the same items in their own
          Pokémon.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('charizard-storage-box')} alt="The Charizard card storage box: white, with a black Charizard silhouette and an orange flame" loading="lazy" width={745} height={457} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Card storage box</strong>Charizard box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charizard-sleeves')} alt="The Charizard art sleeves: white, with a black Charizard silhouette and an orange swirl" loading="lazy" width={700} height={776} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Art sleeves</strong>64 in each box
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('charizard-dice')} alt="The Charizard coin die with a Charizard silhouette and 4 white damage counter dice with orange numbers" loading="lazy" width={800} height={406} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Coin die and dice</strong>1 and 4
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="released-with">What else came out the same day</h2>
        <p>
          Pokémon China announced two smaller Journey boxes with the gift boxes, also released on June 13, 2025. Each has 1 Journey theme pack:
        </p>
        <ul>
          <li>
            <strong>Journey collection accessory box.</strong> One theme pack, one 20-card Scarlet &amp; Violet pack, one 5-card Collect 151:
            Hope pack, and a damage counter case shaped like a Pokémon or an Energy symbol, picked at random from 37 designs.
          </li>
          <li>
            <strong>Journey battle accessory box.</strong> One theme pack, two 5-card Scarlet &amp; Violet packs, one 5-card Collect 151: Hope
            pack, and a pack of 64 art sleeves, picked at random from 37 designs.
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
          These are the boxes for chasing the Journey theme pack. Six of them come with each box, and each of the four Pokémon on the boxes
          has its own Special Art Rare in that pack. The 6 booster packs and a full set of matching accessories make each box more than the
          theme packs alone. Pick the Pokémon you like best.
        </p>
      </BlogPostLayout>
    </>
  )
}
