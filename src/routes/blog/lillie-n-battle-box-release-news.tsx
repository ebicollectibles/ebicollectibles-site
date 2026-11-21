import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'lillie-n-battle-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/lillie-n-battle-box-${name}.webp`

// Pokémon China's contents list, in its order. Both boxes hold the same items, in their own Trainer.
const CONTENTS = [
  { item: 'Chasing Glory booster packs', qty: '6', note: 'Set code CSV10C, 20 cards each, 120 cards in all' },
  { item: 'Art sleeves', qty: '64', note: 'One pack of 64, Lillie or N' },
  { item: 'Deck box', qty: '1', note: 'With 2 dividers' },
  { item: 'Coin', qty: '1', note: 'Lillie or N' },
  { item: 'Damage counter dice', qty: '6', note: '' },
  { item: 'Card storage box', qty: '1', note: 'Lillie or N' },
]

const TOC = [
  { id: 'what-it-is', label: 'What are the Lillie and N battle set boxes?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'lillie', label: 'The Lillie box' },
  { id: 'n', label: 'The N box' },
  { id: 'packs', label: 'The 6 Chasing Glory packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What are the Chinese Lillie and N battle set boxes?',
    a: 'Two official Pokémon TCG boxes from Pokémon China, one themed on Lillie and one on N. Their Chinese names are 对战套装礼盒 莉莉艾 and 对战套装礼盒 N. Each holds 6 Chasing Glory booster packs and a set of battle accessories in its Trainer’s design: sleeves, a deck box, a coin, 6 damage counter dice and a card storage box.',
  },
  {
    q: 'When were the Lillie and N boxes released?',
    a: 'July 16, 2026, from 10:00 China time, the same day as Chasing Glory. Pokémon China announced them on June 29, 2026.',
  },
  {
    q: 'Is there a promo card in the Lillie or N box?',
    a: 'No. Pokémon China lists no promo card. Each box is 6 Chasing Glory packs and the accessories.',
  },
  {
    q: 'How many booster packs are in each box?',
    a: 'Six Chasing Glory booster packs (set code CSV10C) of 20 cards each, which is 120 cards.',
    links: [{ to: '/sets/chinese/chasing-glory-csv10', label: 'Chasing Glory' }],
  },
  {
    q: 'Which Lillie and N cards are in Chasing Glory?',
    a: "Lillie's Clefairy ex and N's Zoroark ex are the big ones, each as a Double Rare, Super Rare and Special Art Rare, and N's Zoroark ex also as an Ultra Rare. N's Reshiram has an Art Rare.",
    links: [{ to: '/sets/chinese/chasing-glory-csv10', label: 'Chasing Glory' }],
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. All 6 packs are from the Simplified Chinese release.',
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


export const Route = createFileRoute('/blog/lillie-n-battle-box-release-news')({
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
  component: LillieNBattleBoxPost,
})

function LillieNBattleBoxPost() {
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
    name: 'What comes in each Chinese Lillie or N battle set box',
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
        lede="Pokémon China's Lillie and N battle set boxes released on July 16, 2026, alongside Chasing Glory. This post covers what is in each one: 6 Chasing Glory booster packs and a set of battle accessories in the Trainer's design."
        cta={{
          heading: 'Looking for Chasing Glory?',
          body: 'Open the set these boxes are built around, or browse our special products.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-slim-booster-box' }, label: 'Shop the Chasing Glory booster box' },
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What are the Lillie and N battle set boxes?</h2>
        <p>
          They are two official Simplified Chinese Pokémon TCG boxes from Pokémon China, released on July 16, 2026, the same day as the
          Chasing Glory set. Their Chinese names are <Zh>对战套装礼盒 莉莉艾</Zh> and <Zh>对战套装礼盒 N</Zh>, which translate as Battle Set
          Gift Box: Lillie and Battle Set Gift Box: N.
        </p>
        <p>
          Chasing Glory is the set of Trainer's Pokémon, and Lillie and N are two of its Trainers. Each box holds 6 packs of the set and
          a set of battle accessories in its Trainer's design. There is no promo card in either box.
        </p>

        <aside className="fact-box" aria-label="Lillie and N battle set box key facts">
          {/* Same box as in the Lillie section below, where it is described, so this copy is decorative */}
          <img src={img('lillie-box')} alt="" loading="lazy" width={1094} height={739} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Battle Set Gift Box (<Zh>对战套装礼盒</Zh>)
              </dd>
              <dt>Versions</dt>
              <dd>Lillie, N</dd>
              <dt>Released</dt>
              <dd>July 16, 2026, 10:00 China time</dd>
              <dt>Set code</dt>
              <dd>CSV10C (the 6 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>6 packs of Chasing Glory, 20 cards each</dd>
              <dt>Promo card</dt>
              <dd>None</dd>
              <dt>Extras</dt>
              <dd>64 sleeves, deck box with 2 dividers, coin, 6 damage counter dice, card storage box</dd>
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
        <p>Pokémon China lists six items in each box. Both boxes hold the same items, each in its own Trainer's design:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of each Lillie or N battle set box
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
          Pokémon China lists a card storage box alongside the deck box but does not show it on its own or say whether it is the long box
          in its photos.
        </p>

        <h2 id="lillie">The Lillie box</h2>
        <p>
          The Lillie box is in soft blue. Pokémon China describes its front as Lillie spending a relaxed summer day by the sea with her
          Pokémon. The illustration shows her on the beach in white with Clefairy, Cutiefly and a lei of Comfey flowers. Lillie and Clefairy
          also appear on the sleeves and the deck box, and the coin carries Lillie's portrait.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('lillie-box')} alt="The Lillie battle set box: a long light blue box printed with Lillie on a beach with Clefairy, Cutiefly and Comfey" loading="lazy" width={1094} height={739} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Lillie box</strong>Soft blue
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('lillie-contents')} alt="Everything in the Lillie box: the box, Chasing Glory packs, a Lillie coin, 6 blue damage counter dice, Lillie art sleeves, and a Lillie deck box with dividers" loading="lazy" width={1200} height={834} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Lillie contents</strong>Pokémon China's photo
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="n">The N box</h2>
        <p>
          The N box is in green, to match N's hair. Pokémon China describes it as N surrounded by his partner Pokémon. The illustration
          shows him sitting on a mossy stone wall with Zoroark, Darmanitan and Klinklang around him and Reshiram behind. N and his Pokémon
          also appear on the sleeves and the deck box, and the coin carries N's portrait.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('n-box')} alt="The N battle set box: a long green box printed with N on a mossy wall with Zoroark, Darmanitan and his other Pokémon" loading="lazy" width={1094} height={739} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>N box</strong>Green
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('n-contents')} alt="Everything in the N box: the box, Chasing Glory packs, an N coin, 6 green damage counter dice, N art sleeves, and an N deck box with dividers" loading="lazy" width={1200} height={832} style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>N contents</strong>Pokémon China's photo
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The 6 Chasing Glory packs</h2>
        <p>
          Each box holds 6 packs of Chasing Glory, 20 cards each, which is 120 cards. The set code is CSV10C. Chasing Glory is built around
          Trainer's Pokémon, and both Trainers have cards in it: Lillie's Clefairy ex and N's Zoroark ex each come as a Double Rare, Super
          Rare and Special Art Rare, and N's Zoroark ex also as an Ultra Rare. Our{' '}
          <Link to="/blog/chasing-glory-release-news">Chasing Glory post</Link> and the{' '}
          <Link to="/sets/chinese/chasing-glory-csv10">Chasing Glory card list</Link> cover the set.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these products on July 16, 2026, with Chasing Glory:</p>
        <ul>
          <li>
            <strong>The Team Rocket briefcase.</strong> A Team Rocket's Mewtwo ex promo, a box of 6 Chasing Glory packs and a briefcase.
            Our <Link to="/blog/team-rocket-briefcase-release-news">Team Rocket briefcase post</Link> covers it.
          </li>
          <li>
            <strong>Master Strategy deck build sets.</strong> Raging Bolt ex, Dragapult ex and Gholdengo ex, each with a deck, an upgrade
            pack and 4 Chasing Glory packs.
          </li>
          <li>
            <strong>Happy Combo.</strong> A starter set of four decks: Dragonite ex, Mewtwo ex, Camerupt and Sinistcha.
          </li>
          <li>
            <strong>Chasing Glory coin set and Mewtwo coin album.</strong>
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
          These are boxes for fans of the two Trainers. There is no promo card, so the draw is the 6 Chasing Glory packs and a matching set
          of sleeves, deck box, coin and dice for playing with Lillie or N.
        </p>
      </BlogPostLayout>
    </>
  )
}
