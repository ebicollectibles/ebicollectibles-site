import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-7-has-arrived')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%207/Cards/${id}.webp`

// All seven Misty's Psyduck cards, in collector-number order. Versions
// 01-06 share one illustration and differ only in rarity and foil
// finish; 07 is the full art.
const PSYDUCK_RUN = [
  { id: '0301', rarity: 'Common', finish: 'Water-type pattern foil' },
  { id: '0302', rarity: 'Common', finish: 'Poké Ball pattern foil' },
  { id: '0303', rarity: 'Uncommon', finish: 'Glitter foil' },
  { id: '0304', rarity: 'Uncommon', finish: 'Starburst foil' },
  { id: '0305', rarity: 'Rare', finish: 'Master Ball pattern foil' },
  { id: '0306', rarity: 'Double Rare', finish: 'Gem Pack logo stamp' },
  { id: '0307', rarity: 'Triple Rare', finish: 'Full art' },
]

// The six full arts Pokémon China showed alongside Psyduck in its
// launch announcement.
const REVEALED_FULL_ARTS = [
  { id: '0207', name: "Team Rocket's Meowth", note: 'with Giovanni' },
  { id: '1507', name: "Steven's Beldum", note: 'with Steven' },
  { id: '1607', name: "Cynthia's Roserade", note: 'with Cynthia' },
  { id: '1707', name: 'Shaymin', note: 'in a flower field' },
  { id: '1907', name: "N's Zorua", note: 'with N' },
  { id: '2007', name: "Lillie's Ribombee", note: 'with Lillie' },
]

const ODDS = [
  { symbol: '●', label: 'Common (versions 01 and 02)', pct: '50.00%' },
  { symbol: '◆', label: 'Uncommon (versions 03 and 04)', pct: '25.00%' },
  { symbol: '★', label: 'Rare (version 05)', pct: '17.39%' },
  { symbol: '★★', label: 'Double Rare (version 06)', pct: '5.80%' },
  { symbol: '★★★', label: 'Full art (version 07)', pct: '1.81%' },
]

const GEM_TIMELINE = [
  { vol: 1, date: 'January 17, 2025', cards: 115 },
  { vol: 2, date: 'May 16, 2025', cards: 140 },
  { vol: 3, date: 'September 26, 2025', cards: 136 },
  { vol: 4, date: 'February 6, 2026', cards: 196 },
  { vol: 5, date: 'April 24, 2026', cards: 196 },
  { vol: 6, date: 'August 7, 2026', cards: 196 },
  { vol: 7, date: 'November 6, 2026', cards: 196 },
]

const FAQ = [
  {
    q: 'Is Gem Pack Vol. 7 the same as "Gemstone Vol. 7"?',
    a: 'Yes. The Chinese name, 宝石包, translates as both "gem pack" and "gemstone pack", so shops use either one. The set code on the cards is CBB7C.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '18 packs of 4 cards each, so 72 cards per box.',
  },
  {
    q: 'Are all the cards foil?',
    a: 'Yes. Every card in every pack is a holo. There are no plain non-foil cards in the set.',
  },
  {
    q: 'What is the main chase card?',
    a: "Misty's Psyduck 0307/07, the full art drawn for this set. Beyond that, collectors chase the 28 full arts (every card numbered 07).",
  },
  {
    q: 'Can I complete the set from one box?',
    a: 'No. The set has 196 cards and a box holds 72, so even with zero duplicates you would need at least three boxes. In practice a full set takes several boxes or buying singles.',
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-7-has-arrived')({
  head: () => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: GemVol7Post,
})

function GemVol7Post() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    publisher: { '@type': 'Organization', name: 'EBI Collectibles' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <BlogPostLayout
        post={post}
        lede="Psyduck fronts the seventh Simplified Chinese Gem Pack: 28 Pokémon, seven cards each, every card a foil, and a brand-new Misty's Psyduck full art drawn just for this set."
        cta={{
          heading: 'Shop Gem Vol 7',
          body: 'Booster boxes in stock now, plus the full 196-card checklist with every version.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/gem-vol-7', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Pack Vol. 7 landed in mainland China on November 6, 2026. Like every Gem Pack, it is an official Simplified Chinese
          Pokémon TCG product built for collecting: small 4-card packs where every card is a holo, and a set structure that gives each
          Pokémon its own run of seven cards. This volume leans hard into Trainers and their partner Pokémon, with Misty's Psyduck on
          the pack and a new full art you can only pull here.
        </p>

        <h2>At a glance</h2>
        <table className="spec-table">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>Gem Pack Vol. 7 (宝石包 VOL.7), also sold as Gemstone Vol. 7</td>
            </tr>
            <tr>
              <th scope="row">Set code</th>
              <td>CBB7C</td>
            </tr>
            <tr>
              <th scope="row">Language</th>
              <td>Simplified Chinese</td>
            </tr>
            <tr>
              <th scope="row">Release date</th>
              <td>November 6, 2026 (mainland China)</td>
            </tr>
            <tr>
              <th scope="row">Pack</th>
              <td>4 cards, all holo</td>
            </tr>
            <tr>
              <th scope="row">Booster box</th>
              <td>18 packs, 72 cards</td>
            </tr>
            <tr>
              <th scope="row">Set size</th>
              <td>196 cards: 28 Pokémon × 7 versions</td>
            </tr>
            <tr>
              <th scope="row">Headline card</th>
              <td>Misty's Psyduck full art, 0307/07</td>
            </tr>
          </tbody>
        </table>

        <img
          src={`${R2_IMAGE_HOST}/Chinese/Blog/gem-vol-7/gem-vol-7-booster-pack.webp`}
          alt="Gem Pack Vol. 7 booster pack with Psyduck on the front"
          loading="lazy"
          width={1200}
          height={2130}
          style={{ display: 'block', maxWidth: 200, width: '60%', height: 'auto', margin: '0 auto 30px', borderRadius: 12, boxShadow: 'var(--shadow)' }}
        />

        <h2>How the set is built</h2>
        <p>
          Every one of the 28 Pokémon gets seven numbered cards. The first six share a single illustration and step up in rarity and
          foil finish. The seventh is a full art with its own illustration. Pokémon China's announcement names the finishes you will
          see across a run: Energy-type pattern foils, Master Ball pattern foils, the gold-stamped Gem Pack logo, and the full art.
        </p>
        <p>
          Card numbers tell you exactly where you are. Read 0307/07 as Pokémon 03, version 07 of 7, so it is the full art of the
          third Pokémon in the set. That structure works out to 56 Commons, 56 Uncommons, 28 Rares, 28 Double Rares and 28 full arts.
        </p>

        <h2>Misty's Psyduck, six holo versions</h2>
        <p>
          Psyduck is the best way to see the ladder in action. Versions 01 to 06 share the same pool-deck illustration by Yuu
          Nishida, and each one gets its own holo finish.
        </p>
        <div className="card-grid cols-3">
          {PSYDUCK_RUN.filter((c) => c.id !== '0307').map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`Misty's Psyduck ${c.id}/07, ${c.rarity}, ${c.finish}, Gem Vol 7`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.id}/07</strong>
                {c.rarity} · {c.finish}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2>The chase: Misty's Psyduck full art</h2>
        <figure className="feature-card">
          <img src={cardImg('0307')} alt="Misty's Psyduck 0307/07 full art, Triple Rare, Gem Vol 7" loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>0307/07</strong>
            Triple Rare · Full art · Illus. Cona Nitanda
          </figcaption>
        </figure>
        <p>
          The full art, 0307/07, is new artwork by Cona Nitanda, drawn for this set rather than reprinted from another one. Psyduck
          lounges in a beach chair holding a beach ball up high while Misty waves from behind, ready for a day at the shore. Because
          the illustration debuts here, Gem Vol 7 is the only place to pull it.
        </p>

        <blockquote className="pull-quote">One Psyduck, six holo finishes, and a full art that only exists in this set.</blockquote>

        <h2>Trainers and their Pokémon</h2>
        <p>
          19 of the 28 Pokémon are printed as a Trainer's Pokémon, and Team Rocket alone accounts for eight of them: Raticate, Meowth,
          Weezing, Murkrow, Wobbuffet, Houndoom, Orbeetle and Spidops. Misty brings Psyduck and Lapras, and the rest of the cast
          includes Ethan, Steven, Cynthia, N, Lillie, Arven, Hop, Marnie and Iono. Pokémon China revealed these six full arts
          alongside Psyduck:
        </p>
        <div className="card-grid cols-3">
          {REVEALED_FULL_ARTS.map((c) => (
            <figure key={c.id}>
              <img src={cardImg(c.id)} alt={`${c.name} full art ${c.id}/07, Gem Vol 7`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.id}/07 · {c.note}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          The other nine Pokémon appear without a Trainer: Rapidash, Furret, Swinub, Blaziken, Clamperl, Shaymin, Crustle, Lycanroc
          and Hydrapple. Curious where the artwork has appeared before? Our{' '}
          <Link to="/blogs/news/gem-vol-7-card-origins">card origins guide</Link> traces it card by card.
        </p>

        <h2>What is inside a booster box</h2>
        <p>
          A box holds 18 packs of 4 holo cards, 72 cards in total. Pulls are random, so duplicates are normal and no specific
          Pokémon or finish is guaranteed. Pokémon China publishes how much of each rarity it prints:
        </p>
        <table className="spec-table">
          <tbody>
            {ODDS.map((o) => (
              <tr key={o.label}>
                <th scope="row">
                  <span aria-hidden="true">{o.symbol} </span>
                  {o.label}
                </th>
                <td>{o.pct} of cards printed</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Those numbers work out to roughly one or two full arts per box on average. That is an estimate from the print ratios, not a
          promise, and some boxes will run hot or cold. With 196 cards in the set and 72 per box, finishing a master set takes
          several boxes or picking up singles.
        </p>

        <h2>Where Vol. 7 fits in the Gem Pack line</h2>
        <p>
          Gem Packs have been a Simplified Chinese collector line since January 2025, and the 4-holo pack has been the format the whole
          way. Since Vol. 4 every volume has settled on the same 196-card, 28 × 7 shape.
        </p>
        <table className="spec-table">
          <tbody>
            {GEM_TIMELINE.map((g) => (
              <tr key={g.vol}>
                <th scope="row">
                  <Link to={`/sets/gem-vol-${g.vol}` as never}>Gem Pack Vol. {g.vol}</Link>
                </th>
                <td>
                  {g.date} · {g.cards} cards
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>A Psyduck binder to go with it</h2>
        <p>
          Pokémon China also released a 30-pocket Gem Pack Vol. 7 binder with Psyduck on the cover the same day. It is
          sized for one card per pocket, which suits a single Psyduck run or a page of favorite full arts.
        </p>
        <img
          src={`${R2_IMAGE_HOST}/Chinese/Blog/gem-vol-7/gem-vol-7-psyduck-collector-binder.webp`}
          alt="Official Gem Pack Vol. 7 Psyduck card binder, 30 pockets"
          loading="lazy"
          width={2000}
          height={1333}
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 12, boxShadow: 'var(--shadow)', marginBottom: 28 }}
        />

        <h2>FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2>Our take</h2>
        <p>
          Gem Vol 7 is an easy set to enjoy. The packs are cheap, every card is shiny, and the Trainer theme gives the binder a real
          sense of character. If you only chase one card, make it the Misty's Psyduck full art. If you like completing runs, Psyduck's
          seven versions are the perfect place to start.
        </p>
      </BlogPostLayout>
    </>
  )
}
