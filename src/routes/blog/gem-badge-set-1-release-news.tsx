import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-badge-set-1-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/gem-badge-set-1-${name}.webp`
const pack = (vol: number) => `${SITE_URL}/assets/sets/packs/gem-vol-${vol}.webp`

// Pokémon China's contents list, in its order (pokemon.cn product page 19753).
const CONTENTS = [
  { item: 'Gem Pack Vol. 1', qty: '1 pack', note: '4 cards' },
  { item: 'Gem Pack Vol. 2', qty: '1 pack', note: '4 cards' },
  { item: 'Gem Pack Vol. 3', qty: '1 pack', note: '4 cards' },
  { item: 'Set-exclusive Gem Pack holo promo card', qty: '1', note: 'One of 3, each printed in equal numbers' },
  { item: 'Gem Pack badge', qty: '1', note: 'One of 47: 43 regular, 3 hidden, 1 super hidden' },
]

// The three promos, read off Pokémon China's card images.
const PROMOS = [
  { name: 'Sprigatito', no: '118/SV-P', zhName: '新叶喵', type: 'Grass', hp: 70, illus: 'Yuu Nishida', file: 'sprigatito-promo' },
  { name: 'Fuecoco', no: '119/SV-P', zhName: '呆火鳄', type: 'Fire', hp: 80, illus: 'Ryuta Fuse', file: 'fuecoco-promo' },
  { name: 'Quaxly', no: '120/SV-P', zhName: '润水鸭', type: 'Water', hp: 70, illus: 'Narumi Sato', file: 'quaxly-promo' },
]

// Production ratio as printed: regular : hidden : super hidden = 193 : 6 : 1,
// each design equal within its tier. Shares below are that ratio worked out.
const BADGE_ODDS = [
  { tier: 'Regular', designs: 43, share: '96.5%', each: 'about 2.2%, or 1 in 45' },
  { tier: 'Hidden', designs: 3, share: '3%', each: '1%, or 1 in 100' },
  { tier: 'Super hidden', designs: 1, share: '0.5%', each: '0.5%, or 1 in 200' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Gem Pack Badge Set?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'packs', label: 'The three Gem Packs' },
  { id: 'promos', label: 'The three starter promos' },
  { id: 'badges', label: 'The 47 badges' },
  { id: 'odds', label: 'Hidden badge odds' },
  { id: 'released-with', label: 'What else came out the same day' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Gem Pack Badge Set?',
    a: 'An official Simplified Chinese Pokémon TCG product from Pokémon China. Its Chinese name is 宝石包徽章套装. Each set holds one pack each of Gem Pack Vol. 1, Vol. 2 and Vol. 3, one set-exclusive holo promo card and one random Gem Pack badge.',
  },
  {
    q: 'When was the Gem Pack Badge Set released?',
    a: 'January 16, 2026, at 10:00 in mainland China. Pokémon China announced it on December 26, 2025. Its suggested retail price in China is 39 yuan.',
  },
  {
    q: 'What promo cards come in the Gem Pack Badge Set?',
    a: 'One of three: Sprigatito 118/SV-P, Fuecoco 119/SV-P or Quaxly 120/SV-P. Each is a holo with the Gem Pack logo printed on the art, and Pokémon China says the three are printed in equal numbers.',
  },
  {
    q: 'How many badges are there to collect?',
    a: '47: 43 regular badges, each with one Pokémon from Gem Pack Vol. 1 to 3, 3 hidden badges, one for each of those three volumes, and 1 super hidden badge with the Gem Pack logo. Every set has one badge, packed at random.',
  },
  {
    q: 'What are the odds of a hidden badge?',
    a: 'Pokémon China prints the production ratio as 193 regular to 6 hidden to 1 super hidden. That works out to a 3% chance of a hidden badge (1% for each of the three) and a 0.5% chance, or 1 in 200, of the super hidden Gem Pack logo badge. It is a production ratio, not a promise for any one case of sets.',
  },
  {
    q: 'Which Gem Packs are in the set?',
    a: 'One pack each of Gem Pack Vol. 1, Vol. 2 and Vol. 3. Every Gem Pack has 4 holo cards, so the set holds 12 Gem Pack cards plus the promo.',
    links: [
      { to: '/sets/chinese/gem-vol-1', label: 'Gem Vol 1' },
      { to: '/sets/chinese/gem-vol-2', label: 'Gem Vol 2' },
      { to: '/sets/chinese/gem-vol-3', label: 'Gem Vol 3' },
    ],
  },
  {
    q: 'Is there a second Gem Pack Badge Set?',
    a: 'Yes. Gem Pack Badge Set 2 released on November 6, 2026, with one pack each of Gem Pack Vol. 4, 5 and 6 and a new run of 52 badges. It has no promo card.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The three Gem Packs and the promo card are from the Simplified Chinese release.',
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

export const Route = createFileRoute('/blog/gem-badge-set-1-release-news')({
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
  component: GemBadgeSetPost,
})

function GemBadgeSetPost() {
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
        lede="Pokémon China's Gem Pack Badge Set released on January 16, 2026. This post covers what is in it: one pack each of Gem Pack Vol. 1, 2 and 3, one of three starter promo cards and one of 47 Gem Pack badges, with the official hidden badge ratio."
        cta={{
          heading: 'Shop Gem Pack booster boxes',
          body: 'The badge set holds one pack from each of the first three volumes. Full boxes hold 15 or 18 packs.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-3-booster-box' }, label: 'Gem Vol. 3 booster box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-2-booster-box' }, label: 'Gem Vol. 2 booster box', variant: 'ghost' },
            { to: '/sets/chinese/gem-vol-1', label: 'See the Gem Vol 1 card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Gem Pack Badge Set?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG product from Pokémon China, released on January 16, 2026. Its Chinese name is{' '}
          <Zh>宝石包徽章套装</Zh>, which translates as Gem Pack Badge Set. Each set holds one pack each of Gem Pack Vol. 1, Vol. 2 and
          Vol. 3, a holo promo card with the Gem Pack logo and one random badge. Its suggested retail price in China is 39 yuan.
        </p>
        <p>
          The badges cover every Pokémon that appeared in the first three Gem Pack volumes, and the promo is one of the three Paldea
          starters, Sprigatito, Fuecoco or Quaxly.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Badge Set key facts">
          {/* Same pouch as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('bag')} alt="" loading="lazy" width={700} height={1421} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Gem Pack Badge Set (<Zh>宝石包徽章套装</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>January 16, 2026</dd>
              <dt>Price in China</dt>
              <dd>39 yuan (suggested retail)</dd>
              <dt>Packs</dt>
              <dd>Gem Pack Vol. 1, 2 and 3, one of each, 4 cards per pack</dd>
              <dt>Promo card</dt>
              <dd>1 of 3: Sprigatito 118/SV-P, Fuecoco 119/SV-P, Quaxly 120/SV-P</dd>
              <dt>Badge</dt>
              <dd>1 of 47: 43 regular, 3 hidden, 1 super hidden</dd>
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
        <p>Five items, going by Pokémon China's own contents list:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Gem Pack Badge Set
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
          <img src={img('bag')} alt="The pink Gem Pack Badge Set pouch with Sprigatito on the front, the Gem Pack logo at the top and small pictures of the badges and packs at the bottom" loading="lazy" width={700} height={1421} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The Gem Pack Badge Set, from Pokémon China's product image.</figcaption>
        </figure>

        <h2 id="packs">The three Gem Packs</h2>
        <p>
          The set holds one pack each of Gem Pack Vol. 1, Vol. 2 and Vol. 3. Every Gem Pack has 4 cards, all holo, so that is 12 Gem
          Pack cards. Our <Link to="/blog/what-is-a-gem-pack">guide to Gem Packs</Link> explains how they differ from regular packs, and{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates</Link> covers the odds in each volume.
        </p>
        <ul className="card-grid cols-3">
          {[1, 2, 3].map((v) => (
            <li key={v}>
              <figure>
                <img src={pack(v)} alt={`A Gem Pack Vol. ${v} booster pack`} loading="lazy" width={413} height={760} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>Gem Pack Vol. {v}</strong>
                  <Link to={`/sets/chinese/gem-vol-${v}` as '/sets/chinese/gem-vol-1'}>Card list</Link>
                  {' · '}
                  <Link to={`/blog/gem-vol-${v}-set-guide` as '/blog/gem-vol-1-set-guide'}>Set guide</Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="promos">The three starter promos</h2>
        <p>
          Each set has one promo card, picked at random from three, and Pokémon China says the three are printed in equal numbers. They
          are the Paldea starters, each a holo with the pink Gem Pack logo printed on the art. Pokémon China lists them as exclusive to this set.
        </p>
        <ul className="card-grid cols-3">
          {PROMOS.map((p) => (
            <li key={p.no}>
              <figure>
                <img src={img(p.file)} alt={`${p.name} ${p.no} promo: ${p.name} with the Gem Pack logo printed on the art`} loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
                <figcaption>
                  <strong>{p.name}</strong>
                  {p.no} · {p.type}, {p.hp} HP · Illus. {p.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="badges">The 47 badges</h2>
        <p>
          Every set has one badge, packed at random. Pokémon China says the 43 regular badges cover every Pokémon that appeared in Gem
          Pack Vol. 1, 2 and 3, one Pokémon per badge, and each regular design is made in equal numbers.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 820 }}>
          <img src={img('badges')} alt="The 43 regular Gem Pack badges in rows, each a round badge with one Pokémon, among them Sprigatito, Pikachu, Eevee and its evolutions, Gengar and Mimikyu" loading="lazy" width={1400} height={1030} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The 43 regular badges.</figcaption>
        </figure>
        <p>
          The 3 hidden badges each show a group of Pokémon from one volume: Sprigatito, Fuecoco, Quaxly and Pikachu for Vol. 1, Eevee,
          Umbreon, Sylveon and Leafeon for Vol. 2, and Gengar, Cubone, Mimikyu and Meowth for Vol. 3. The single super hidden badge has
          the Gem Pack logo on a glittering background. Pokémon China notes that the super hidden badge's background pattern can vary
          slightly from one badge to the next.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 820 }}>
          <img src={img('hidden-badges')} alt="The three hidden badges with gold scalloped edges: the Paldea starters with Pikachu, Eevee with Umbreon, Sylveon and Leafeon, and Gengar with Cubone, Mimikyu and Meowth" loading="lazy" width={1400} height={434} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The 3 hidden badges.</figcaption>
        </figure>
        <figure style={{ margin: '28px auto', maxWidth: 260 }}>
          <img src={img('super-hidden-badge')} alt="The super hidden badge: the pink Gem Pack logo on a glittering rainbow background with a gold rim" loading="lazy" width={461} height={457} style={{ width: '100%', height: 'auto' }} />
          <figcaption>The super hidden Gem Pack logo badge.</figcaption>
        </figure>

        <h2 id="odds">Hidden badge odds</h2>
        <p>
          Pokémon China prints the production ratio of regular to hidden to super hidden badges as 193 to 6 to 1, with every design
          equal within its tier. Worked out per set:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Gem Pack Badge Set badge odds by tier
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
          From the printed 193 : 6 : 1 ratio. It describes the whole print run, so a case of sets can have more or fewer hidden badges.
        </p>

        <h2 id="released-with">What else came out the same day</h2>
        <p>January 16, 2026 was also the release day of:</p>
        <ul>
          <li>
            <strong>Blade Awakening.</strong> The main set CSV7C, in slim and jumbo packs. Our{' '}
            <Link to="/blog/blade-awakening-release-news">Blade Awakening release post</Link> covers it.
          </li>
          <li>
            <strong>Master Strategy deck building sets.</strong> Ready-built decks with Blade Awakening packs. See the{' '}
            <Link to="/blog/master-strategy-deck-charizard-gardevoir-miraidon-release-news">Master Strategy deck post</Link>.
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
          A small way into Gem Packs: one pack from each of the first three volumes, a starter promo you can only get here and a badge.
          The regular badges are the collecting goal, and with 43 designs and a 1 in 200 super hidden, finishing the run takes a lot of
          sets.
        </p>
      </BlogPostLayout>
    </>
  )
}
