import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-badge-set-2-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/gem-badge-set-2-${name}.webp`
const pack = (vol: number) => `${SITE_URL}/assets/sets/packs/gem-vol-${vol}.webp`

// Pokémon China's contents list, in its order (pokemon.cn product page 22759).
const CONTENTS = [
  { item: 'Gem Pack Vol. 4', qty: '1 pack', note: '4 cards' },
  { item: 'Gem Pack Vol. 5', qty: '1 pack', note: '4 cards' },
  { item: 'Gem Pack Vol. 6', qty: '1 pack', note: '4 cards' },
  { item: 'Gem Pack badge', qty: '1', note: 'One of 52: 45 regular, 6 hidden, 1 super hidden' },
]

// The six hidden badges, as labelled on Pokémon China's image.
const HIDDEN = ['Pikachu', 'Floragato', 'Quaxwell', 'Crocalor', 'Applin', 'Ponyta']

// Production ratio as printed: regular : hidden : super hidden = 191 : 8 : 1,
// each design equal within its tier. Shares below are that ratio worked out.
const BADGE_ODDS = [
  { tier: 'Regular', designs: 45, share: '95.5%', each: 'about 2.1%, or 1 in 47' },
  { tier: 'Hidden', designs: 6, share: '4%', each: 'about 0.67%, or 1 in 150' },
  { tier: 'Super hidden', designs: 1, share: '0.5%', each: '0.5%, or 1 in 200' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is Gem Pack Badge Set 2?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'packs', label: 'The three Gem Packs' },
  { id: 'badges', label: 'The 52 badges' },
  { id: 'odds', label: 'Hidden badge odds' },
  { id: 'vs-first', label: 'How it differs from the first badge set' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Gem Pack Badge Set 2?',
    a: 'An official Simplified Chinese Pokémon TCG product from Pokémon China. Its Chinese name is 宝石包徽章套装第二弹, the second Gem Pack Badge Set. Each set holds one pack each of Gem Pack Vol. 4, Vol. 5 and Vol. 6 and one random Gem Pack badge.',
  },
  {
    q: 'When was Gem Pack Badge Set 2 released?',
    a: 'November 6, 2026, at 10:00 in mainland China, the same day as Gem Pack Vol. 7. Pokémon China announced it on October 16, 2026. Its suggested retail price in China is 39 yuan.',
  },
  {
    q: 'How many badges are there to collect?',
    a: '52: 45 regular badges, each with one Pokémon from Gem Pack Vol. 4 to 6, 6 hidden badges and 1 super hidden badge with the Gem Pack logo. Every set has one badge, packed at random.',
  },
  {
    q: 'Which Pokémon are on the hidden badges?',
    a: 'Pikachu, Floragato, Quaxwell, Crocalor, Applin and Ponyta, each in a single colour on a faceted metallic background.',
  },
  {
    q: 'What are the odds of a hidden badge?',
    a: 'Pokémon China prints the production ratio as 191 regular to 8 hidden to 1 super hidden. That works out to a 4% chance of a hidden badge (about 0.67%, or 1 in 150, for each of the six) and a 0.5% chance, or 1 in 200, of the super hidden Gem Pack logo badge. It is a production ratio, not a promise for any one case of sets.',
  },
  {
    q: 'Is there a promo card in Gem Pack Badge Set 2?',
    a: 'No. Pokémon China lists only the three Gem Packs and the badge. The first Gem Pack Badge Set had a starter promo card; the second does not.',
  },
  {
    q: 'Which Gem Packs are in the set?',
    a: 'One pack each of Gem Pack Vol. 4, Vol. 5 and Vol. 6. Every Gem Pack has 4 holo cards, so the set holds 12 Gem Pack cards.',
    links: [
      { to: '/sets/chinese/gem-vol-4', label: 'Gem Vol 4' },
      { to: '/sets/chinese/gem-vol-5', label: 'Gem Vol 5' },
      { to: '/sets/chinese/gem-vol-6', label: 'Gem Vol 6' },
    ],
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The three Gem Packs are from the Simplified Chinese release.',
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

export const Route = createFileRoute('/blog/gem-badge-set-2-release-news')({
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
  component: GemBadgeSet2Post,
})

function GemBadgeSet2Post() {
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
    name: 'What comes in the Chinese Gem Pack Badge Set',
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
        lede="Pokémon China's Gem Pack Badge Set 2 released on November 6, 2026, the same day as Gem Pack Vol. 7. This post covers what is in it: one pack each of Gem Pack Vol. 4, 5 and 6 and one of 52 Gem Pack badges, with the official hidden badge ratio."
        cta={{
          heading: 'Shop Gem Pack booster boxes',
          body: 'The badge set holds one pack each of Vol. 4, 5 and 6. A full box holds 18 packs.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-6-booster-box' }, label: 'Gem Vol. 6 booster box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-5-booster-box' }, label: 'Gem Vol. 5 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-4-booster-box' }, label: 'Gem Vol. 4 booster box', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is Gem Pack Badge Set 2?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG product from Pokémon China, released on November 6, 2026. Its Chinese name is{' '}
          <Zh>宝石包徽章套装第二弹</Zh>, which translates as Gem Pack Badge Set, second release. Each set holds one pack each of Gem
          Pack Vol. 4, Vol. 5 and Vol. 6 and one random badge. Its suggested retail price in China is 39 yuan, the same as the first
          badge set.
        </p>
        <p>
          The badges show Pokémon from Gem Pack Vol. 4 to 6. Unlike the <Link to="/blog/gem-badge-set-1-release-news">first Gem Pack
          Badge Set</Link>, there is no promo card.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Badge Set 2 key facts">
          {/* Same pouch as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('bag')} alt="" loading="lazy" width={700} height={1421} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Gem Pack Badge Set 2 (<Zh>宝石包徽章套装第二弹</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>November 6, 2026</dd>
              <dt>Price in China</dt>
              <dd>39 yuan (suggested retail)</dd>
              <dt>Packs</dt>
              <dd>Gem Pack Vol. 4, 5 and 6, one of each, 4 cards per pack</dd>
              <dt>Badge</dt>
              <dd>1 of 52: 45 regular, 6 hidden, 1 super hidden</dd>
              <dt>Promo card</dt>
              <dd>None</dd>
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
        <p>Four items, going by Pokémon China's own contents list:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of Gem Pack Badge Set 2
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
        <figure style={{ margin: '28px auto', maxWidth: 300 }}>
          <img src={img('bag')} alt="The Gem Pack Badge Set 2 pouch with Floragato on the front by a window, the Gem Pack logo at the top and small pictures of the badges and packs at the bottom" loading="lazy" width={700} height={1421} style={{ width: '100%', height: 'auto' }} />
          <figcaption>Gem Pack Badge Set 2, from Pokémon China's product image.</figcaption>
        </figure>

        <h2 id="packs">The three Gem Packs</h2>
        <p>
          The set holds one pack each of Gem Pack Vol. 4, Vol. 5 and Vol. 6. Every Gem Pack has 4 cards, all holo, so that is 12 Gem
          Pack cards. Our <Link to="/blog/what-is-a-gem-pack">guide to Gem Packs</Link> explains how they differ from regular packs, and{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates</Link> covers the odds in each volume.
        </p>
        <ul className="card-grid cols-3">
          {[4, 5, 6].map((v) => (
            <li key={v}>
              <figure>
                <img src={pack(v)} alt={`A Gem Pack Vol. ${v} booster pack`} loading="lazy" width={418} height={760} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>Gem Pack Vol. {v}</strong>
                  <Link to={`/sets/chinese/gem-vol-${v}` as '/sets/chinese/gem-vol-4'}>Card list</Link>
                  {' · '}
                  <Link to={`/blog/gem-vol-${v}-set-guide` as '/blog/gem-vol-4-set-guide'}>Set guide</Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="badges">The 52 badges</h2>
        <p>
          Every set has one badge, packed at random. Pokémon China says the 45 regular badges each show one Pokémon from Gem Pack Vol.
          4, 5 and 6, a selection of the Pokémon in those volumes, and each regular design is made in equal numbers.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 820 }}>
          <img src={img('badges')} alt="The 45 regular Gem Pack badges in rows, each a round badge with one Pokémon and its Chinese name, among them Ponyta, Applin, Pikachu and Floragato" loading="lazy" width={1400} height={795} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The 45 regular badges.</figcaption>
        </figure>
        <p>
          The 6 hidden badges show {HIDDEN.join(', ').replace(/, ([^,]*)$/, ' and $1')}, each drawn in a single colour on a faceted
          metallic background. Pokémon China describes them as the representative Pokémon of Vol. 4 to 6. The single super hidden badge
          has the pink Gem Pack logo.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 820 }}>
          <img src={img('hidden-badges')} alt="The six hidden badges: gold Pikachu, green Floragato, blue Quaxwell, red Crocalor, green Applin and red Ponyta, each a white line drawing on a faceted metallic background" loading="lazy" width={1400} height={217} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The 6 hidden badges.</figcaption>
        </figure>
        <figure style={{ margin: '28px auto', maxWidth: 260 }}>
          <img src={img('super-hidden-badge')} alt="The super hidden badge: the Gem Pack logo in white on a faceted pink background" loading="lazy" width={500} height={503} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The super hidden Gem Pack logo badge.</figcaption>
        </figure>

        <h2 id="odds">Hidden badge odds</h2>
        <p>
          Pokémon China prints the production ratio of regular to hidden to super hidden badges as 191 to 8 to 1, with every design
          equal within its tier. Worked out per set:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Gem Pack Badge Set 2 badge odds by tier
            </caption>
            <thead>
              <tr>
                <th scope="col">Tier</th>
                <th scope="col">Designs</th>
                <th scope="col">Chance per set</th>
                <th scope="col">Chance of one named design</th>
              </tr>
            </thead>
            <tbody>
              {BADGE_ODDS.map((o) => (
                <tr key={o.tier}>
                  <th scope="row">{o.tier}</th>
                  <td>{o.designs}</td>
                  <td>{o.share}</td>
                  <td>{o.each}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          From the printed 191 : 8 : 1 ratio. It describes the whole print run, so a case of sets can have more or fewer hidden badges.
        </p>

        <h2 id="vs-first">How it differs from the first badge set</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-vs" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-vs" className="sr-only">
              Gem Pack Badge Set and Gem Pack Badge Set 2 compared
            </caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Badge Set</th>
                <th scope="col">Badge Set 2</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Released</th><td>January 16, 2026</td><td>November 6, 2026</td></tr>
              <tr><th scope="row">Packs</th><td>Vol. 1, 2 and 3</td><td>Vol. 4, 5 and 6</td></tr>
              <tr><th scope="row">Promo card</th><td>1 of 3 starters</td><td>None</td></tr>
              <tr><th scope="row">Badges</th><td>47 (43 / 3 / 1)</td><td>52 (45 / 6 / 1)</td></tr>
              <tr><th scope="row">Ratio</th><td>193 : 6 : 1</td><td>191 : 8 : 1</td></tr>
              <tr><th scope="row">Price in China</th><td>39 yuan</td><td>39 yuan</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="released-with">What else came out the same day</h2>
        <p>November 6, 2026 was also the release day of:</p>
        <ul>
          <li>
            <strong>Gem Pack Vol. 7.</strong> The next Gem Pack volume, led by Misty's Psyduck. Our{' '}
            <Link to="/blog/gem-vol-7-release-news">Gem Vol 7 release post</Link> covers it.
          </li>
          <li>
            <strong>Black Bolt and White Flare.</strong> The paired main sets CSV10.5C and CSV10.6C. See the{' '}
            <Link to="/blog/black-bolt-white-flare-release-news">Black Bolt and White Flare release post</Link>.
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
          A second run for badge collectors, now with packs from Vol. 4 to 6 and twice the hidden badges of the first set. There is no
          promo card this time, so the badges are the reason to buy it over three loose Gem Packs.
        </p>
      </BlogPostLayout>
    </>
  )
}
