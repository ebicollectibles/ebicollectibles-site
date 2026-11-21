import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/30th-celebration.json'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-set-guide')!

type Card = (typeof setData.cards)[number]
const byRange = (from: number, to: number) => setData.cards.filter((c) => c.pokemonIndex >= from && c.pokemonIndex <= to)
const withImage = (cards: Card[]) => cards.filter((c) => c.image)
// Most wanted cards first (by number out of 103), then the rest in number order.
const lead = (cards: Card[], first: string[]) => [
  ...first.map((n) => cards.find((c) => c.number === `${n}/103`)!).filter(Boolean),
  ...cards.filter((c) => !first.includes(c.number.slice(0, 3))),
]

const PIKACHU = byRange(17, 46)
const ART_RARES = byRange(104, 123)
const SAR = lead(byRange(124, 133), ['126', '127', '130', '125'])
const FUR = byRange(134, 135)
const CLASSICS = lead(byRange(136, 165), ['136', '137', '160', '142', '138', '150', '154', '141', '163'])
// Pikachu leads: the two Pikachu ex promos (030 and 031) first, then the rest in number order.
const PROMOS = [
  ...setData.cards.filter((c) => c.pokemonIndex === 1030 || c.pokemonIndex === 1031),
  ...setData.cards.filter((c) => c.pokemonIndex > 1000 && c.pokemonIndex !== 1030 && c.pokemonIndex !== 1031),
]
const MISSING_AR = ART_RARES.filter((c) => !c.image)
const MISSING_SAR = SAR.filter((c) => !c.image)

function Gallery({ cards, cols, label }: { cards: Card[]; cols: number; label?: (c: Card, i: number) => string }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {withImage(cards).map((c, i) => (
        <li key={c.number}>
          <figure>
            <img src={c.image!} alt={`${c.name} ${c.number}, 30th Celebration`} loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>{c.name}</strong>
              {label ? label(c, i) : c.number}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const RARITY = [
  { name: 'Common', where: 'Main set', count: 45 },
  { name: 'Pikachu Rare', where: '017 to 046', count: 30 },
  { name: 'Rare', where: 'Main set', count: 18 },
  { name: 'Double Rare', where: 'The Pokémon ex in the main set', count: 10 },
  { name: 'Art Rare', where: '104 to 123', count: 20 },
  { name: 'Classic', where: '136 to 165', count: 30 },
  { name: 'Special Art Rare', where: '124 to 133', count: 10 },
  { name: 'Futuristic Rare', where: '134 to 135', count: 2 },
]

const BOX_AVERAGE = [
  { group: 'The 30 Pikachu, Common and basic Energy', share: '89.83%', perBox: 'about 108' },
  { group: 'Rare, Double Rare, Art Rare and Classic', share: '9.17%', perBox: 'about 11' },
  { group: 'Special Art Rare, Futuristic Rare and 3 RGB mark cards', share: '1.00%', perBox: 'about 1' },
]

const PROMO_SOURCES: Record<string, string> = {
  '028': 'Day & Night gift box',
  '029': 'Day & Night gift box',
  '030': 'Futuristic Box',
  '031': 'Futuristic Box',
  '032': 'Greninja ex card display set',
  '033': 'Sylveon ex card display set',
}
// Promos 001 to 027 run through the nine generations three at a time. Vol.1 has Kanto, Sinnoh and Alola,
// Vol.2 has Johto, Unova and Galar, and Vol.3 has Hoenn, Kalos and Paldea.
const firstPartnerVol = (n: number) => (Math.floor((n - 1) / 3) % 3) + 1

const TOC = [
  { id: 'box-average', label: 'What an average box holds' },
  { id: 'pikachu', label: 'All 30 Pikachu' },
  { id: 'futuristic-sar', label: 'Special Art Rares and Futuristic Rares' },
  { id: 'classics', label: 'All 30 classic cards' },
  { id: 'art-rares', label: 'All 20 Art Rares' },
  { id: 'promos', label: 'All 33 promos' },
  { id: 'reading-a-card', label: 'Reading a 30th Celebration card' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many cards are in 30th Celebration?',
    a: '165 numbered cards: 103 in the main set and 62 secret rares. There are also 8 basic Energy cards and 33 promos numbered 001 to 033/30th-P.',
  },
  {
    q: 'Is there an Uncommon rarity?',
    a: 'No. The main set has Common, Rare and Double Rare cards, and the 30 Pikachu have their own rarity, Pikachu Rare.',
  },
  {
    q: 'Are the 33 promos in booster packs?',
    a: 'No. They come in special products for the 30th anniversary: the First Partner Sets Vol.1 to Vol.3, the Day & Night gift box, the Futuristic Box and the Greninja ex and Sylveon ex card display sets.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. A box averages about one card from the top group of Special Art Rares, Futuristic Rares and RGB mark cards, so finishing those from boxes alone takes many boxes. Most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blog/30th-celebration-set-guide')({
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
  component: ThirtiethSetGuide,
})

function ThirtiethSetGuide() {
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
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="30th Celebration is the Pokémon TCG's 30th anniversary set: 165 holo cards, with Pikachu on the pack and one of 30 different Pikachu in every pack. Use this guide to sort your pulls and plan a master set."
        cta={{
          heading: 'Collect 30th Celebration',
          body: 'See every card on the full card list, or pick up a booster box.',
          links: [
            { to: '/sets/chinese/30th-celebration', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration (<Zh>30周年庆典</Zh>, set code 30thC) released on September 16, 2026. It is the Pokémon TCG's 30th
          anniversary set: 165 numbered cards, all holo, with Pikachu on the pack and one of 30 different Pikachu in every pack.
        </p>
        <p>
          Our <Link to="/blog/30th-celebration-release-news">release post</Link> covers what is new in the set, and our{' '}
          <Link to="/blog/30th-celebration-card-origins">card origins guide</Link> matches the 30 classic cards to their original
          English cards. Use this guide to sort your pulls or plan a master set.
        </p>

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

        <h2 id="box-average">What an average box holds</h2>
        <p>
          A booster box is 20 packs of 6, so 120 holo cards, including 20 Pikachu. Applied to one box, Pokémon China's print shares work
          out to roughly this:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">What an average box holds</caption>
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Print share</th>
                <th scope="col">Per 120-card box</th>
              </tr>
            </thead>
            <tbody>
              {BOX_AVERAGE.map((r) => (
                <tr key={r.group}>
                  <th scope="row">{r.group}</th>
                  <td>{r.share}</td>
                  <td>{r.perBox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Averages, not guarantees. Individual boxes vary.</p>

        <h2 id="pikachu">All 30 Pikachu</h2>
        <p>
          Pikachu is on the pack, and every pack has one of these 30 Pikachu. They are numbered 017 to 046, each was drawn by a
          different illustrator, and each card shows its place in the run, from 01/30 to 30/30.
        </p>
        <Gallery cards={PIKACHU} cols={3} label={(c, i) => `${c.number} · ${i + 1} of 30`} />

        <h2 id="futuristic-sar">Special Art Rares and Futuristic Rares</h2>
        <p>
          The ten Special Art Rares are numbered 124 to 133, and the two Pikachu ex by kantaro lead them. The two Futuristic Rares by
          YOSHIROTTEN, Mewtwo ex and Mew ex, are numbered 134 and 135.
        </p>
        <Gallery cards={[...SAR, ...FUR]} cols={3} />
        {MISSING_SAR.length > 0 && (
          <p className="table-note">We do not have scans of these cards, so they are not shown: {MISSING_SAR.map((c) => `${c.name} ${c.number}`).join(', ')}.</p>
        )}

        <h2 id="classics">All 30 classic cards</h2>
        <p>
          These are famous cards from 1999 to 2023, numbered 136 to 165 and reprinted in their original frames with a gold glitter
          border. 151 and 152 are the two halves of the Darkrai &amp; Cresselia LEGEND.
        </p>
        <Gallery cards={CLASSICS} cols={3} />

        <BuyStrip />

        <h2 id="art-rares">All 20 Art Rares</h2>
        <p>These are numbered 104 to 123. Each one is a full illustration of a main-set Pokémon.</p>
        <Gallery cards={ART_RARES} cols={4} />
        {MISSING_AR.length > 0 && (
          <p className="table-note">We do not have a scan of {MISSING_AR.map((c) => `${c.name} ${c.number}`).join(', ')}, so it is not shown.</p>
        )}

        {/* The anchor id sits on a span inside the heading: reader modes drop a heading whose own id

            contains a word like "promo" or "share", and this section would lose its title there. */}

        <h2>

          <span id="promos">All 33 promos</span>

        </h2>
        <p>
          The two Pikachu ex promos 030 and 031 by YOSHIROTTEN come in the{' '}
          <Link to="/blog/futuristic-pikachu-box-release-news">Futuristic Box</Link>. Promos 001 to 027 are the first partner Pokémon from
          all nine generations, from{' '}
          <Link to="/blog/first-partner-30th-vol-1-release-news">First Partner Set Vol.1</Link>,{' '}
          <Link to="/blog/first-partner-30th-vol-2-release-news">Vol.2</Link> and{' '}
          <Link to="/blog/first-partner-30th-vol-3-release-news">Vol.3</Link>. Espeon ex and Umbreon ex come in the{' '}
          <Link to="/blog/day-night-gift-box-release-news">Day &amp; Night gift box</Link>, and Greninja ex and Sylveon ex in the{' '}
          <Link to="/blog/greninja-sylveon-display-set-release-news">Greninja ex and Sylveon ex card display sets</Link>.
        </p>
        <Gallery
          cards={PROMOS}
          cols={3}
          label={(c) => {
            const n = c.number.slice(0, 3)
            return PROMO_SOURCES[n] ? `${c.number} · ${PROMO_SOURCES[n]}` : `${c.number} · First Partner Set Vol.${firstPartnerVol(+n)}`
          }}
        />

        <h2 id="reading-a-card">Reading a 30th Celebration card</h2>
        <p>
          Set cards are numbered out of 103, so anything past 103/103 is a secret rare. Promos are numbered separately as NNN/30th-P, so
          001/30th-P Bulbasaur and 001/103 Exeggcute are different cards. The rarities, from most to least common:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Reading a 30th Celebration card</caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Where</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {RARITY.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td>{r.where}</td>
                  <td>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          The order follows Pokémon China's odds chart. The chart also lists the 8 basic Energy cards after the Commons, and 3 cards marked
          with an RGB symbol after the Futuristic Rares.
        </p>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set here means the 165 numbered cards, and many collectors add the 8 Energy and 33 promos too. The main set fills in
          fast. The 30 Pikachu take a little longer, since each box gives you 20 at random.
        </p>
        <p>
          The secret rares are the hard part. A box averages about 11 cards from the Rare, Double Rare, Art Rare and Classic group,
          spread across 78 different cards, and about one card from the top group of Special Art Rares, Futuristic Rares and RGB mark
          cards. Pulling all of
          those from boxes alone takes a lot of boxes.
        </p>
        <p>
          So most collectors open a few boxes for fun, then pick up the Futuristic Rares, Special Art Rares and favorite classics as
          singles. The <Link to="/sets/chinese/30th-celebration">30th Celebration card list</Link> shows every card.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
