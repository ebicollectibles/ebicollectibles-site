import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'lisia-gift-box-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/lisia-gift-box-${name}.webp`

// Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: "Lisia's Appeal special illustration holo card", qty: '1', note: 'Promo 352/SV-P' },
  { item: 'Stellar Crystal booster packs', qty: '4', note: 'Set code CSV9C, 20 cards each' },
  { item: 'Terastal Gathering booster packs', qty: '4', note: 'Set code CSV9.5C, 10 cards each' },
  { item: 'Chasing Glory booster packs', qty: '5', note: 'Set code CSV10C, 20 cards each' },
  { item: "Lisia's Shine art sleeves", qty: '64', note: 'One pack of 64' },
  { item: "Lisia's Shine deck box", qty: '1', note: 'With 2 dividers' },
  { item: "Lisia's Shine card display frame", qty: '1', note: '' },
  { item: 'Altaria plush', qty: '1', note: '' },
]

const PACKS = [
  { set: 'Stellar Crystal', code: 'CSV9C', qty: 4, size: 20, to: '/sets/chinese/stellar-crystal-csv9' },
  { set: 'Terastal Gathering', code: 'CSV9.5C', qty: 4, size: 10, to: '/sets/chinese/terastal-gathering-csv9-5' },
  { set: 'Chasing Glory', code: 'CSV10C', qty: 5, size: 20, to: '/sets/chinese/chasing-glory-csv10' },
]

const TOC = [
  { id: 'what-it-is', label: "What is the Lisia's Shine gift box?" },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'promo', label: "The Lisia's Appeal promo" },
  { id: 'plush', label: 'The Altaria plush and display frame' },
  { id: 'deck-box', label: 'The deck box, dividers and sleeves' },
  { id: 'packs', label: 'The 13 booster packs' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: "What is the Chinese Lisia's Shine gift box?",
    a: "An official Pokémon TCG gift box from Pokémon China themed on Lisia, the Hoenn contest idol, and her partner Altaria. Its Chinese name is 琉琪亚的闪耀专属礼盒. It holds a Lisia's Appeal special illustration holo card, 13 booster packs from three sets, an Altaria plush, a card display frame, a deck box with 2 dividers and 64 sleeves.",
  },
  {
    q: "When was the Lisia's Shine gift box released?",
    a: 'August 7, 2026. Pokémon China announced it on July 17, 2026.',
  },
  {
    q: 'What promo card comes in the box?',
    a: "Lisia's Appeal 352/SV-P, a Supporter card with a special illustration by Nobusawa and Mochipuyo. It shows Lisia winking and reaching out toward you. The Stellar Crystal set has its own Lisia's Appeal Special Art Rare, 257/208, with a different illustration.",
    links: [{ to: '/sets/chinese/stellar-crystal-csv9', label: 'Stellar Crystal' }],
  },
  {
    q: "How many booster packs are in the Lisia's Shine gift box?",
    a: '13: 4 Stellar Crystal packs of 20 cards, 4 Terastal Gathering packs of 10 cards and 5 Chasing Glory packs of 20 cards, which is 220 cards.',
    links: [
      { to: '/sets/chinese/stellar-crystal-csv9', label: 'Stellar Crystal' },
      { to: '/sets/chinese/terastal-gathering-csv9-5', label: 'Terastal Gathering' },
      { to: '/sets/chinese/chasing-glory-csv10', label: 'Chasing Glory' },
    ],
  },
  {
    q: 'Can the plush hold a card?',
    a: 'The plush and the display frame are separate pieces. Pokémon China says you can display them on their own or together, and its photos show the plush holding the frame, with a card in it, between its cotton wings.',
  },
  {
    q: 'What language are the cards?',
    a: "Simplified Chinese. The promo card and all 13 booster packs are from the Simplified Chinese release.",
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


export const Route = createFileRoute('/blog/lisia-gift-box-release-news')({
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
  component: LisiaGiftBoxPost,
})

function LisiaGiftBoxPost() {
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
    name: "What comes in the Chinese Lisia's Shine gift box",
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
        lede="Pokémon China's Lisia's Shine gift box released on August 7, 2026. This post covers everything in it: the Lisia's Appeal promo, an Altaria plush, a card display frame, a deck box, sleeves and 13 booster packs from three sets."
        cta={{
          heading: 'Looking for a Chinese gift box?',
          body: 'Browse our special products, or see the card lists for the three sets in this box.',
          links: [
            { to: '/shop', search: { subcategory: 'Special Products' }, label: 'Browse special products' },
            { to: '/sets/chinese/stellar-crystal-csv9', label: 'See the Stellar Crystal card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Lisia's Shine gift box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG gift box from Pokémon China, released on August 7, 2026. Its Chinese name
          is <Zh>琉琪亚的闪耀专属礼盒</Zh>, which translates as Lisia's Shine Exclusive Gift Box. Lisia is the contest idol of the Hoenn
          region, and the box is themed on her and her partner Altaria, in light blue and light purple with white sparkles.
        </p>
        <p>
          The box holds a Lisia's Appeal promo card with a special illustration, an Altaria plush, a matching card display frame, deck
          box and sleeves, and 13 booster packs: Stellar Crystal, Terastal Gathering and Chasing Glory.
        </p>

        <aside className="fact-box" aria-label="Lisia's Shine gift box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={790} height={1000} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Lisia's Shine Exclusive Gift Box (<Zh>琉琪亚的闪耀专属礼盒</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>August 7, 2026</dd>
              <dt>Promo card</dt>
              <dd>Lisia's Appeal 352/SV-P, special illustration holo</dd>
              <dt>Set codes</dt>
              <dd>CSV9C, CSV9.5C, CSV10C (the 13 packs inside)</dd>
              <dt>Booster packs</dt>
              <dd>4 Stellar Crystal, 4 Terastal Gathering, 5 Chasing Glory</dd>
              <dt>Extras</dt>
              <dd>Altaria plush, card display frame, deck box with 2 dividers, 64 sleeves</dd>
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
        <p>Pokémon China lists eight items in the box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Lisia's Shine gift box
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
        <figure style={{ margin: '28px auto', maxWidth: 460 }}>
          <img
            src={img('box')}
            alt="The Lisia's Shine gift box: a clear-topped box with the Altaria plush sitting inside, above a light purple base printed with Lisia and the box's name"
            loading="lazy"
            width={790}
            height={1000}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption>The Altaria plush sits in the clear top of the box.</figcaption>
        </figure>

        <h2 id="promo">The Lisia's Appeal promo</h2>
        <p>
          The promo card is Lisia's Appeal 352/SV-P, a Supporter card that Pokémon China describes as a special illustration holo. It is
          illustrated by Nobusawa and Mochipuyo and shows Lisia up close, winking and reaching out toward you among streamers and pink
          cotton clouds.
        </p>
        <p>
          Its effect switches one of your opponent's Benched Basic Pokémon with their Active Pokémon, and the new Active Pokémon is now
          Confused. It is the same card as Lisia's Appeal in{' '}
          <Link to="/sets/chinese/stellar-crystal-csv9">Stellar Crystal</Link>, where the Special Art Rare 257/208 is a Chinese
          Exclusive with a different illustration of Lisia on stage. The promo is a new illustration.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 340 }}>
          <img
            src={img('lisias-appeal-promo')}
            alt="Lisia's Appeal 352/SV-P promo: Lisia winking and reaching out toward the viewer among streamers and pink cotton clouds"
            loading="lazy"
            width={788}
            height={1100}
            style={{ width: '100%', height: 'auto', background: 'transparent', boxShadow: 'none' }}
          />
          <figcaption>Lisia's Appeal 352/SV-P · Promo</figcaption>
        </figure>

        <h2 id="plush">The Altaria plush and display frame</h2>
        <p>
          Pokémon China calls the Altaria plush and the Lisia's Shine card display frame the highlight of the box. They are two separate
          pieces. You can display each on its own or use them together, and Pokémon China's photos show the plush holding the deck box or
          the frame, with a card in it, between its cotton wings. Pokémon China also suggests the plush as a decoration for your room.
        </p>
        <p>
          The plush is Altaria with a blue head and neck and a body of white, fluffy cotton wings. Pokémon China does not give its size.
        </p>
        <figure style={{ margin: '24px auto 30px' }}>
          <img
            src={img('plush')}
            alt="Three views of the Altaria plush: on its own, holding the Lisia deck box between its cotton wings, and holding the card display frame with the Lisia's Appeal promo in it"
            loading="lazy"
            width={1400}
            height={488}
            style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 10 }}
          />
          <figcaption>The plush on its own, holding the deck box, and holding the display frame.</figcaption>
        </figure>

        <h2 id="deck-box">The deck box, dividers and sleeves</h2>
        <p>
          The Lisia's Shine deck box shows Lisia and Altaria on both sides, on light blue at the front and light purple at the back. It comes with
          2 dividers, each printed on both sides, and the box holds 64 art sleeves of Lisia with Altaria.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('deck-box-front')} alt="Front of the Lisia's Shine deck box: Lisia winking with Altaria on light blue" loading="lazy" width={576} height={700} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Deck box</strong>Front
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('deck-box-back')} alt="Back of the Lisia's Shine deck box: Lisia waving with Altaria on light purple" loading="lazy" width={569} height={700} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Deck box</strong>Back
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('sleeves')} alt="The Lisia's Shine art sleeves: Lisia with Altaria on a light purple background" loading="lazy" width={664} height={733} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: '#fff' }} />
              <figcaption>
                <strong>Art sleeves</strong>64 sleeves
              </figcaption>
            </figure>
          </li>
        </ul>
        <ul className="card-grid cols-4">
          {[
            { n: 1, alt: 'First divider, front: Lisia waving with Altaria behind her', cap: 'Divider 1 · Front', w: 376 },
            { n: 2, alt: 'First divider, back: a light purple side with a small round bird outline and music notes', cap: 'Divider 1 · Back', w: 374 },
            { n: 3, alt: 'Second divider, front: Lisia winking with Altaria on light blue', cap: 'Divider 2 · Front', w: 372 },
            { n: 4, alt: 'Second divider, back: a light blue side with an Altaria outline and music notes', cap: 'Divider 2 · Back', w: 369 },
          ].map((d) => (
            <li key={d.n}>
              <figure>
                <img src={img(`divider-${d.n}`)} alt={d.alt} loading="lazy" width={d.w} height={500} style={{ aspectRatio: '3 / 4', objectFit: 'contain', background: '#fff' }} />
                <figcaption>
                  <strong>Divider</strong>
                  {d.cap}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="packs">The 13 booster packs</h2>
        <p>The box holds packs from three Simplified Chinese sets, 220 cards in all:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-packs" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-packs" className="sr-only">
              Booster packs in the Lisia's Shine gift box
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Set code</th>
                <th scope="col">Packs</th>
                <th scope="col">Cards per pack</th>
              </tr>
            </thead>
            <tbody>
              {PACKS.map((p) => (
                <tr key={p.code}>
                  <th scope="row">
                    <Link to={p.to}>{p.set}</Link>
                  </th>
                  <td>{p.code}</td>
                  <td>{p.qty}</td>
                  <td>{p.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figure style={{ margin: '24px auto 30px', maxWidth: 620 }}>
          <img
            src={img('packs')}
            alt="The three booster packs in the box: Stellar Crystal times 4, Terastal Gathering times 4 and Chasing Glory times 5"
            loading="lazy"
            width={1200}
            height={648}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>
        <p>
          Stellar Crystal is the set with the Stellar Tera Pikachu ex and the Lisia's Appeal Special Art Rare. Terastal Gathering is the
          Eeveelution set, and Chasing Glory is the Trainer's Pokémon set. Our{' '}
          <Link to="/blog/stellar-crystal-release-news">Stellar Crystal</Link>,{' '}
          <Link to="/blog/terastal-gathering-release-news">Terastal Gathering</Link> and{' '}
          <Link to="/blog/chasing-glory-release-news">Chasing Glory</Link> posts cover each set.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>Pokémon China released these products on August 7, 2026, as well:</p>
        <ul>
          <li>
            <strong>Gem Pack Vol 6.</strong> The all-holo Gem Pack led by Applin. Our{' '}
            <Link to="/blog/gem-vol-6-release-news">Gem Vol 6 post</Link> covers it.
          </li>
          <li>
            <strong>30th Celebration First Partner special illustration set Vol.3.</strong> A random First Partner holo card, an acrylic
            magnetic display frame and a Chasing Glory pack.
          </li>
          <li>
            <strong>Dream Painting Eevee figure set.</strong> A blind box of Eevee and Eeveelution figures, each with its matching card and
            a Terastal Gathering pack.
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
          This is the box for Lisia fans. The promo has its own illustration, the Altaria plush and frame make a small display on a shelf,
          and 13 packs from three recent sets give you plenty to open.
        </p>
      </BlogPostLayout>
    </>
  )
}
