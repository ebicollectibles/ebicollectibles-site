import { BuyStrip } from '~/components/blog/BlogShop'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-2-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%202/Cards/${id}.webp`

// A sample of Eevee's 15 cards: both base illustrations, the stamped
// Double Rare, then the V, the VMAX and the full art.
const EEVEE_SAMPLE = [
  { id: '0101', label: 'Base card A', note: 'Common' },
  { id: '0102', label: 'Base card B', note: 'Common' },
  { id: '0111', label: 'Base card A', note: 'Double Rare · Gem Pack logo stamp' },
  { id: '0113', label: 'Eevee V', note: 'Rare' },
  { id: '0114', label: 'Eevee VMAX', note: 'Triple Rare' },
  { id: '0115', label: 'Full art', note: 'Triple Rare', exclusive: true },
]

// Most wanted first.
const VMAX = [
  { id: '0614', name: 'Umbreon VMAX' },
  { id: '0914', name: 'Sylveon VMAX' },
  { id: '0514', name: 'Espeon VMAX' },
  { id: '0114', name: 'Eevee VMAX' },
  { id: '0814', name: 'Glaceon VMAX' },
  { id: '0714', name: 'Leafeon VMAX' },
  { id: '0214', name: 'Vaporeon VMAX' },
  { id: '0314', name: 'Jolteon VMAX' },
  { id: '0414', name: 'Flareon VMAX' },
]

const TRAINERS = [
  { id: '1001', name: 'Poké Ball', rarity: 'Double Rare' },
  { id: '1002', name: 'Level Ball', rarity: 'Double Rare' },
  { id: '1003', name: 'Quick Ball', rarity: 'Double Rare' },
  { id: '1004', name: 'Penny', rarity: 'Triple Rare' },
]

// One row per rarity, with Pokémon China's print shares.
const RARITY = [
  { symbol: '●', label: 'Common', which: 'Versions 01 to 04', cards: 36, print: '50.00%' },
  { symbol: '◆', label: 'Uncommon', which: 'Versions 05 to 08', cards: 36, print: '25.00%' },
  { symbol: '★', label: 'Rare', which: 'Versions 09, 10 and the 9 V', cards: 27, print: '18.13%' },
  { symbol: '★★', label: 'Double Rare', which: 'Versions 11, 12 and 3 Trainers', cards: 21, print: '4.70%' },
  { symbol: '★★★', label: 'Triple Rare', which: '9 VMAX, 4 full arts, Penny, 6 Energy', cards: 20, print: '2.17%' },
]

const TOC = [
  { id: 'forest-full-arts', label: 'Chinese Exclusives: four full arts, one scene' },
  { id: 'vmax', label: 'Nine VMAX' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'eevee', label: "Eevee's 15 cards" },
  { id: 'trainers-energy', label: 'Trainers and Energy' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'gem-pack-timeline', label: 'Gem Pack timeline' },
  { id: 'binders', label: 'The four binders' },
  { id: 'faq', label: 'FAQ' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
]

const FAQ = [
  {
    q: 'When was Gem Vol 2 released?',
    a: 'May 16, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Is Gem 2 the same as "Gemstone Vol. 2"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB2C.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '15 packs of 4 cards each, so 60 cards per box.',
  },
  {
    q: 'What is in each pack?',
    a: 'Four holo cards: three are Common or Uncommon, and one is Rare or better.',
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 2?',
    a: 'The four HYOGONOSUKE full arts: Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15, which join into one scene. After those, Umbreon VMAX and Sylveon VMAX lead the nine VMAX.',
  },
  {
    q: 'What are the odds of pulling a Triple Rare?',
    a: "Triple Rares, the tier that holds the nine VMAX and the four full arts, make up 2.17% of the print run, going by Pokémon China's print shares. With 60 cards in a box, that averages about 1.3 per box, or roughly one in every 12 packs.",
  },
  {
    q: 'Where does the Gem 2 artwork come from?',
    a: 'Mostly from English cards. 40 of the 44 artworks we traced are the same art you will find on English cards, mostly from Sword & Shield sets and promos.',
    link: { to: '/sets/chinese/gem-vol-2', before: 'See every card on the ', label: 'Gem Vol 2 card list', after: '.' },
  },
]

export const Route = createFileRoute('/blog/gem-vol-2-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:image:width', content: '1600' },
      { property: 'og:image:height', content: '900' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: post.heroImage },
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
  component: GemVol2Post,
})

function GemVol2Post() {
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
        lede="The second Simplified Chinese Gem Pack is all about Eevee: 140 all-holo cards across Eevee and its eight evolutions, a V and VMAX for each, and four Chinese Exclusive full arts that join into one scene."
        cta={{
          heading: 'Shop Gem Vol 2',
          body: 'Booster boxes, plus the full 140-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-2-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/gem-vol-2', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 2 (Gem 2) lands in mainland China on May 16, 2025. Like every Gem Pack, it is an official Simplified Chinese Pokémon TCG
          product built for collecting, with small 4-card packs where every card is a holo. This one is an Eevee set from top to
          bottom: Eevee and all eight Eeveelutions, Sylveon on the pack, and four new full arts by HYOGONOSUKE that line up into a single picture.
        </p>

        <aside className="fact-box" aria-label="Gem Pack Vol. 2 key facts">
          <img
            src={`${SITE_URL}/assets/blog/gem-vol-2-booster-pack.webp`}
            alt="Gem Pack Vol. 2 booster pack with Sylveon on the front"
            loading="lazy"
            width={600}
            height={1106}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Gem Pack Vol. 2 (宝石包 VOL.2), also called Gemstone Vol. 2</dd>
              <dt>Set code</dt>
              <dd>CBB2C</dd>
              <dt>Released</dt>
              <dd>May 16, 2025, mainland China</dd>
              <dt>Pack</dt>
              <dd>4 cards, all holo</dd>
              <dt>Booster box</dt>
              <dd>15 packs, 60 cards</dd>
              <dt>Set size</dt>
              <dd>140 cards: 9 Pokémon, plus 4 Trainers and 6 Energy</dd>
              <dt>Chinese Exclusives</dt>
              <dd>Four new full arts by HYOGONOSUKE: Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15</dd>
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

        <h2 id="forest-full-arts">Chinese Exclusives: four full arts, one scene</h2>
        <p>
          The four Chinese Exclusives are full arts by HYOGONOSUKE, new artwork drawn for this set. Each works on its own, but lay them side by side in the
          order Leafeon, Sylveon, Umbreon, Eevee and they join into one long picture of the four resting and playing in a sunlit
          forest.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-2-forest-panorama.webp`}
          alt="The four Gem Pack Vol. 2 full arts, Leafeon, Sylveon, Umbreon and Eevee, lined up to form one forest scene"
          loading="lazy"
          width={1600}
          height={562}
        />
        <p>
          The four are Leafeon 0715/15, Sylveon 0915/15, Umbreon 0615/15 and Eevee 0115/15, all Triple Rares. Because the art debuts
          here, Gem Vol 2 is the only place to pull them, and completing all four is the goal for most collectors of this set.
        </p>

        <h2 id="vmax">Nine VMAX</h2>
        <p>
          After the full arts, the VMAX are the next big pulls. Every Pokémon in the set has one, all Triple Rares, and Umbreon VMAX
          and Sylveon VMAX are the usual favorites.
        </p>
        <div className="card-grid cols-3">
          {VMAX.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.id}, Gem Vol 2`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id} · Triple Rare
              </figcaption>
            </figure>
          ))}
        </div>

        <BuyStrip />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          Vol. 2 has only nine Pokémon, but each one gets a long run. Versions 01 to 12 alternate between two different base cards, with
          different art and attacks, so every finish comes in both. Version 13 is the Pokémon V and version 14 is the VMAX. Eevee,
          Umbreon, Leafeon and Sylveon also get a 15th card, the full art. Each pack has three Common or Uncommon cards and one card that
          is Rare or better.
        </p>
        <div className="table-scroll">
          <table className="data-table">
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

        <h2 id="eevee">Eevee's 15 cards</h2>
        <p>
          Eevee shows the whole ladder. Its two base cards trade off through versions 01 to 12, picking up Energy-type and Poké Ball
          patterns, glitter, starburst, the Master Ball pattern and finally the pink Gem Pack logo stamp. Then come Eevee V, Eevee VMAX
          and the full art.
        </p>
        <div className="card-grid cols-3">
          {EEVEE_SAMPLE.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Eevee ${c.id}, ${c.label}, Gem Vol 2`} loading="lazy" width={300} height={419} />
              <figcaption>
                {c.exclusive && <ChineseExclusiveBadge />}
                <strong>{c.id}/15</strong>
                {c.label} · {c.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="trainers-energy">Trainers and Energy</h2>
        <p>
          Packs can also hold a holo Trainer or Energy card. Poké Ball, Level Ball and Quick Ball are Double Rares, and Penny is a
          full-art Triple Rare. The six Energy cards are Basic Lightning, Psychic and Darkness Energy, each printed twice.
        </p>
        <div className="card-grid cols-4">
          {TRAINERS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/04, Gem Vol 2`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/04 · {c.rarity}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The full Eeveelution lineup: Eevee, Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon and Sylveon. The{' '}
          <Link to="/sets/chinese/gem-vol-2">full card list</Link> shows all 140 cards.
        </p>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 15 packs of 4 holo cards, 60 cards in total, with one Rare-or-better card in every pack. Pulls are random, so
          duplicates are normal and no specific card is guaranteed.
        </p>
        <p>
          Going by the print shares above, a box averages one or two Triple Rares. That slot is shared by the nine VMAX, the four full
          arts, Penny and the Energy cards, so finishing all four usually means buying some of it as singles.
        </p>

        <h2 id="gem-pack-timeline">Where Vol. 2 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, with the same 4-holo pack the whole way. Vol. 2
          grows the line to 140 cards and adds Trainer and Energy cards alongside the Pokémon.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Released</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEM_TIMELINE.map((g) => (
                <tr key={g.vol} className={g.vol === 2 ? 'is-current' : undefined}>
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
          For every V, VMAX and full art in one place, the full roster and master set math, see our{' '}
          <Link to="/blog/gem-vol-2-set-guide">Gem Vol 2 set guide</Link>.
        </p>

        <h2 id="binders">Four binders to go with it</h2>
        <p>
          Pokémon China also released a Gem Pack Vol. 2 binder the same day, in four stained-glass cover designs: Eevee, Umbreon,
          Leafeon and Sylveon. Unlike later Gem binders, each page holds nine cards, 54 in all, so there is room for a full Eeveelution
          page of V or VMAX cards.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/gem-vol-2-binders.webp`}
          alt="The four official Gem Pack Vol. 2 card binders, with stained-glass Eevee, Umbreon, Leafeon and Sylveon covers"
          loading="lazy"
          width={1600}
          height={482}
        />

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {f.a}
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
          Gem Vol 2 is the easy pick for Eevee fans. Every card is a holo, every pack has a Rare or better, and there is a V and VMAX
          for every Eeveelution. If you only chase one thing, make it the four new full arts, since they look best together.
        </p>
      </BlogPostLayout>
    </>
  )
}
