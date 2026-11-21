import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-3-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%203/Cards/${id}.webp`

// Gengar's six holo versions, in collector-number order. All share one
// illustration by Nelnal and differ only in rarity and holo pattern.
const GENGAR_RUN = [
  { id: '0301', rarity: 'Common', finish: 'Energy-type pattern holo' },
  { id: '0302', rarity: 'Common', finish: 'Poké Ball pattern holo' },
  { id: '0303', rarity: 'Uncommon', finish: 'Glitter holo' },
  { id: '0304', rarity: 'Uncommon', finish: 'Starburst holo' },
  { id: '0305', rarity: 'Rare', finish: 'Master Ball pattern holo' },
  { id: '0306', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
]

// The five new full arts drawn for this set (Gengar is featured
// separately above them).
const NEW_FULL_ARTS = [
  { id: '0207', name: 'Meowth', illus: 'Makura Tami' },
  { id: '0407', name: 'Cubone', illus: 'Katsunori Sato' },
  { id: '1107', name: 'Chandelure', illus: 'satoma' },
  { id: '1507', name: 'Ceruledge', illus: 'kodama' },
]

// The other four full arts, reprinted from existing cards.
const OTHER_FULL_ARTS = [
  { id: '1307', name: 'Mimikyu', illus: 'Mitsuhiro Arita' },
  { id: '0907', name: 'Mismagius', illus: 'aoki' },
  { id: '1407', name: 'Morpeko', illus: 'Yuu Nishida' },
  { id: '1607', name: 'Greavard', illus: 'sowsow' },
]

// The nine Pokémon ex, which take the 07 slot for these Pokémon. Most wanted first.
const EX_CARDS = [
  { id: '0607', name: 'Gardevoir ex' },
  { id: '1007', name: 'Darkrai ex' },
  { id: '0807', name: 'Absol ex' },
  { id: '0507', name: 'Houndoom ex' },
  { id: '1207', name: 'Lycanroc ex' },
  { id: '0107', name: 'Clefable ex' },
  { id: '0707', name: 'Banette ex' },
  { id: '1807', name: 'Annihilape ex' },
  { id: '1707', name: 'Houndstone ex' },
]

const TRAINERS = [
  { id: '1901', name: 'Super Rod', rarity: 'Double Rare' },
  { id: '1902', name: 'Nest Ball', rarity: 'Double Rare' },
  { id: '1903', name: 'Switch', rarity: 'Double Rare' },
  { id: '1904', name: 'Arven', rarity: 'Triple Rare' },
]

// One row per rarity, with Pokémon China's print shares.
const RARITY = [
  { symbol: '●', label: 'Common', which: 'Versions 01, 02', cards: 36, print: '50.00%' },
  { symbol: '◆', label: 'Uncommon', which: 'Versions 03, 04', cards: 36, print: '25.00%' },
  { symbol: '★', label: 'Rare', which: 'Version 05 and the 9 ex', cards: 27, print: '18.42%' },
  { symbol: '★★', label: 'Double Rare', which: 'Version 06 and 3 Trainers', cards: 21, print: '4.77%' },
  { symbol: '★★★', label: 'Triple Rare', which: '9 full arts, Arven, 6 Energy', cards: 16, print: '1.81%' },
]

const TOC = [
  { id: 'lantern-full-arts', label: 'Chinese Exclusives: five new full arts' },
  { id: 'pokemon-ex', label: 'Nine Pokémon ex' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'gengar', label: 'Gengar, six holo versions' },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'binders', label: 'The five binders' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 3 released?',
    a: 'September 26, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Is Gem 3 the same as "Gemstone Vol. 3"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB3C.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '18 packs of 4 cards each, so 72 cards per box.',
  },
  {
    q: 'Are all the cards holo?',
    a: 'Yes. Every card in every pack is a holo, including the Trainer and Energy cards.',
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 3?',
    a: 'The five new full arts drawn for this set: Meowth 0207/07 by Makura Tami, Gengar 0307/07 by aspara, Cubone 0407/07 by Katsunori Sato, Chandelure 1107/07 by satoma and Ceruledge 1507/07 by kodama. Gengar, the pack mascot, is the one most collectors go after first.',
  },
  {
    q: 'What are the odds of pulling a Triple Rare?',
    a: "Triple Rares, the tier that holds the nine full arts, make up 1.81% of the print run, going by Pokémon China's print shares. With 72 cards in a box, that averages about 1.3 per box, or roughly one in every 14 packs.",
  },
  {
    q: 'Where do the Gem 3 illustrations come from?',
    a: 'Mostly from English cards. 35 of the 40 illustrations we traced are the same art you will find on English cards, mostly 2023 Scarlet & Violet sets.',
    link: { to: '/sets/chinese/gem-vol-3', before: 'See every card on the ', label: 'Gem Vol 3 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-3-release-news')({
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
  component: GemVol3Post,
})

function GemVol3Post() {
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
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.link ? `${f.a} ${f.link.before}${f.link.label}${f.link.after}` : f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Gengar fronts the third Simplified Chinese Gem Pack: 136 all-holo cards of Pokémon that come out at night, nine Pokémon ex, and five Chinese Exclusive full arts."
        cta={{
          heading: 'Shop Gem Vol 3',
          body: 'Booster boxes, plus the full 136-card list with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-3-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-3', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 3 (Gem 3, set code CBB3C) lands in mainland China on September 26, 2025. Like every Gem Pack, it is an official Simplified Chinese
          Pokémon TCG product built for collecting, with small 4-card packs where every card is a holo. This volume is set in a city
          after dark, with Pokémon that are most active at night: Gengar on the pack, plenty of Ghost and Dark types, and five new full
          arts.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 3 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-3-booster-pack.webp`}
            alt="Gem Pack Vol. 3 booster pack with Gengar on the front"
            loading="lazy"
            width={600}
            height={1105}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 3 (<Zh>宝石包 VOL.3</Zh>), also called Gemstone Vol. 3</dd>
              <dt>Set code</dt>
              <dd>CBB3C</dd>
              <dt>Released</dt>
              <dd>September 26, 2025, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>18 packs, 72 cards</dd>
              <dt>Set size</dt>
              <dd>136 cards: 18 Pokémon × 7, plus 4 Trainers and 6 Energy</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Five new full arts: Meowth 0207/07, Gengar 0307/07 by aspara, Cubone 0407/07, Chandelure 1107/07 and Ceruledge 1507/07</dd>
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

        <h2 id="lantern-full-arts">Chinese Exclusives: five new full arts</h2>
        <figure className="feature-card">
          <img src={cardImg('0307')} alt="Gengar 0307/07 Chinese Exclusive full art, Triple Rare, Gem Vol 3" loading="lazy" width={300} height={419} />
          <figcaption>
            <ChineseExclusiveBadge />
            <strong>0307/07</strong>
            Triple Rare · Full art · Illus. aspara
          </figcaption>
        </figure>
        <p>
          Five of the nine full arts are new illustrations drawn for this set, all evening and night scenes. Gengar grins over a table set for tea while cups and plates float around it, and Meowth sits on a rooftop under the moon watching lanterns drift
          past.
        </p>
        <ul className="card-grid cols-2">
          {NEW_FULL_ARTS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 3`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <ChineseExclusiveBadge />
                  <strong>{c.name}</strong>
                  {c.id}/07 · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          Because these five debut here, Gem Vol 3 is the only place to pull them. The other four full arts reprint art from existing
          cards:
        </p>
        <ul className="card-grid cols-4">
          {OTHER_FULL_ARTS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 3`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.id}/07 · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="pokemon-ex">Nine Pokémon ex</h2>
        <p>
          Each Pokémon's seventh card, the 07 slot, is either a full art or a Pokémon ex. For the other nine Pokémon, it is the ex. In this set the ex cards are marked Rare (★), the same as the Master Ball pattern holos, so they turn up more often than the full arts. Gardevoir ex and Darkrai ex are the ones to watch.
        </p>
        <ul className="card-grid cols-3">
          {EX_CARDS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/07, Gem Vol 3`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.id}/07 · Rare
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Each of the 18 Pokémon gets seven numbered cards. The first six share one illustration and step up in rarity and holo
          pattern. The seventh is where Vol. 3 differs from later volumes: for nine Pokémon it is a full art, and for the other nine it
          is a Pokémon ex. Four Trainer cards and six Energy cards round out the set.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">How the set is built</caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col" className="col-versions">
                  Which cards
                </th>
                <th scope="col">In the set</th>
                <th scope="col">Print share</th>
              </tr>
            </thead>
            <tbody>
              {RARITY.map((r) => (
                <tr key={r.label}>
                  <th scope="row">
                    <span className="sym" aria-hidden="true">
                      {r.symbol}
                    </span>{' '}
                    {r.label}
                  </th>
                  <td className="col-versions">{r.which}</td>
                  <td>{r.cards}</td>
                  <td>{r.print}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Print shares are published by Pokémon China.</p>

        <h2 id="gengar">Gengar, six holo versions</h2>
        <p>
          Gengar shows how a run works. Versions 01 to 06 share the same tongue-out illustration by Nelnal. Only the holo
          changes: Energy-type and Poké Ball patterns, glitter, starburst, the Master Ball pattern, and the pink Gem Pack logo
          stamp.
        </p>
        <ul className="card-grid cols-3">
          {GENGAR_RUN.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`Gengar ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 3`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.id}/07</strong>
                  {c.rarity} · {c.finish}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Every pack can also hold a holo Trainer or Energy card. Super Rod, Nest Ball and Switch are Double Rares, and Arven is a
          full-art Triple Rare. The six Energy cards are Basic Fighting, Basic Metal and Luminous Energy, each printed twice.
        </p>
        <ul className="card-grid cols-4">
          {TRAINERS.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/04, Gem Vol 3`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.id}/04 · {c.rarity}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          The rest of the Pokémon roster: Clefable, Houndoom, Gardevoir, Banette, Absol, Darkrai, Lycanroc, Houndstone and Annihilape,
          alongside the full-art Pokémon above. The <Link to="/sets/chinese/gem-vol-3">full card list</Link> shows all 136 cards.
        </p>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 18 packs of 4 holo cards, 72 cards in total. Pulls are random, so duplicates are normal and no specific card is
          guaranteed.
        </p>
        <p>
          Going by the print shares above, a box averages about one Triple Rare, and that slot is shared by the nine full arts, Arven and
          the Energy cards. Landing a specific new full art from a single box is a long shot, so most collectors buy their favorites
          as singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 3 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Vol. 3 is
          the last volume with Trainer and Energy cards and Pokémon ex in the 07 slot. From Vol. 4 on, every volume is 28 Pokémon × 7.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Where Vol. 3 fits in the Gem Pack line</caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 3 ? 'is-current' : undefined}>
                  <th scope="row">
                    <Link to={`/sets/chinese/gem-vol-${g.vol}` as never}>Gem Pack Vol. {g.vol}</Link>
                  </th>
                  <td>{g.date}</td>
                  <td>{g.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          For every full art and ex in one place, the full roster and master set math, see our{' '}
          <Link to="/blog/gem-vol-3-set-guide">Gem Vol 3 set guide</Link>.
        </p>

        <h2 id="binders">Five binders to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 3 binder the same day, in five cover designs that match the new
          full arts: Meowth, Gengar, Cubone, Chandelure and Ceruledge. Each binder holds 30 cards, one per page,
          which is enough for your favorite pulls.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-3-binders.webp`}
          alt="The five official Gem Pack Vol. 3 card binders, with Meowth, Gengar, Cubone, Chandelure and Ceruledge covers"
          loading="lazy"
          width={1600}
          height={356}
        />

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {zh(f.a)}
                {f.link && (
                  <>
                    {' '}
                    {f.link.before}
                    <Link to={f.link.to as never}>{f.link.label}</Link>
                    {f.link.after}
                  </>
                )}
              </p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Gem Vol 3 is the moodiest Gem Pack yet. Every card is a holo, the ex cards give every pack a real shot at a big hit, and the
          new full arts are some of the best-looking cards in the line. If you only chase one card, make it the Gengar full art.
        </p>
      </BlogPostLayout>
    </>
  )
}
