import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
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
const CLASSICS = lead(byRange(136, 165), ['137', '136', '142', '138', '150', '154', '141', '163'])
const PROMOS = setData.cards.filter((c) => c.pokemonIndex > 1000)
const MISSING = [...ART_RARES, ...SAR].filter((c) => !c.image)

function Gallery({ cards, cols, label }: { cards: Card[]; cols: number; label?: (c: Card, i: number) => string }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {withImage(cards).map((c, i) => (
        <figure key={c.number}>
          <img src={c.image!} alt={`${c.name} ${c.number}, 30th Celebration`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {label ? label(c, i) : c.number}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const RARITY = [
  { name: 'Common (C)', where: 'Main set', count: 45 },
  { name: 'Pikachu', where: '017 to 046', count: 30 },
  { name: 'Rare (R)', where: 'Main set', count: 18 },
  { name: 'Double Rare (RR)', where: 'The ex in the main set', count: 10 },
  { name: 'Art Rare (AR)', where: '104 to 123', count: 20 },
  { name: 'Special Art Rare (SAR)', where: '124 to 133', count: 10 },
  { name: 'Futuristic Rare (FUR)', where: '134 to 135', count: 2 },
  { name: 'Classic', where: '136 to 165', count: 30 },
]

const BOX_AVERAGE = [
  { group: 'Common, Basic Energy and Pikachu', share: '89.83%', perBox: 'about 108' },
  { group: 'Rare, Double Rare, Art Rare and Classic', share: '9.17%', perBox: 'about 11' },
  { group: 'Special Art Rare, Futuristic Rare and RGB mark', share: '1.00%', perBox: 'about 1' },
]

const PROMO_SOURCES: Record<string, string> = {
  '028': 'Espeon ex and Umbreon ex collection box',
  '029': 'Espeon ex and Umbreon ex collection box',
  '030': 'Futuristic collection box',
  '031': 'Futuristic collection box',
  '032': 'Greninja ex card display sleeve set',
  '033': 'Sylveon ex card display sleeve set',
}

const TOC = [
  { id: 'box-average', label: 'What an average box holds' },
  { id: 'futuristic-sar', label: 'Futuristic and Special Art Rares' },
  { id: 'classics', label: 'All 30 classic cards' },
  { id: 'pikachu', label: 'All 30 Pikachu' },
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
    a: 'No. The main set goes from Common to Rare, and the 30 Pikachu have their own Pikachu rarity instead.',
  },
  {
    q: 'Can I get all 30 Pikachu from one box?',
    a: 'No. A box has 20 packs, so 20 Pikachu at most, and pulls are random, so duplicates are normal.',
  },
  {
    q: 'Are the 33 promos in booster packs?',
    a: 'No. They come in the special products around the set, such as the First Partner sets, the Espeon ex and Umbreon ex box, the Futuristic box and the display sleeve sets.',
  },
  {
    q: 'How many boxes does a master set take?',
    a: 'There is no fixed number. With about one card per box from the top group of SAR, FUR and RGB mark cards, finishing those from boxes alone takes many boxes, so most collectors finish with singles.',
  },
]

export const Route = createFileRoute('/blogs/news/30th-celebration-set-guide')({
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
  component: ThirtiethSetGuide,
})

function ThirtiethSetGuide() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
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
        wide
        post={post}
        lede="How 30th Celebration is numbered, every Pikachu, classic and secret rare in one place, all 33 promos, and what a master set takes."
        cta={{
          heading: 'Collect 30th Celebration',
          body: 'Track every card on the full checklist, or pick up a booster box and start ripping.',
          links: [
            { to: '/sets/30th-celebration', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration (30thC) is the Pokémon TCG's 30th anniversary set: 165 holo cards with a Pikachu in every pack. Our{' '}
          <Link to="/blogs/news/30th-celebration-has-arrived">release post</Link> covers what is new in the set, and our{' '}
          <Link to="/blogs/news/30th-celebration-card-origins">card origins guide</Link> traces the 30 classic cards back to their
          originals. Use this one to sort your pulls or plan a master set.
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
        <div className="table-scroll">
          <table className="data-table">
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

        <h2 id="futuristic-sar">Futuristic and Special Art Rares</h2>
        <p>The two Futuristic Rares by YOSHIROTTEN sit at the top of the set, with the ten Special Art Rares just below.</p>
        <Gallery cards={FUR} cols={2} />
        <Gallery cards={SAR} cols={4} />

        <h2 id="classics">All 30 classic cards</h2>
        <p>
          Famous cards from 1999 to 2023, back in their original frames with a gold glitter border. 151 and 152 are the two halves of
          the Darkrai &amp; Cresselia LEGEND.
        </p>
        <Gallery cards={CLASSICS} cols={3} />

        <h2 id="pikachu">All 30 Pikachu</h2>
        <p>One in every pack, each by a different illustrator, numbered 017 to 046.</p>
        <Gallery cards={PIKACHU} cols={3} label={(c, i) => `${c.number} · ${i + 1} of 30`} />

        <h2 id="art-rares">All 20 Art Rares</h2>
        <Gallery cards={ART_RARES} cols={4} />
        {MISSING.length > 0 && (
          <p className="table-note">
            Not shown yet, we are still sourcing scans: {MISSING.map((c) => `${c.name} ${c.number}`).join(', ')}.
          </p>
        )}

        <h2 id="promos">All 33 promos</h2>
        <p>
          Promos 001 to 027 are the first partner Pokémon from all nine generations, from the three First Partner special illustration
          sets. The six ex promos come from the products listed below.
        </p>
        <Gallery
          cards={PROMOS}
          cols={4}
          label={(c) => {
            const n = c.number.slice(0, 3)
            return PROMO_SOURCES[n] ? `${c.number} · ${PROMO_SOURCES[n]}` : `${c.number} · First Partner set`
          }}
        />

        <h2 id="reading-a-card">Reading a 30th Celebration card</h2>
        <p>
          Set cards are numbered out of 103, so anything past 103/103 is a secret rare. Promos are numbered separately as NNN/30th-P, so
          001/30th-P Bulbasaur and 001/103 Exeggcute are different cards. The rarities, from most to least common:
        </p>
        <div className="table-scroll">
          <table className="data-table">
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

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          A master set here means the 165 numbered cards, and many collectors add the 8 Energy and 33 promos too. The main set fills in
          fast. The 30 Pikachu take a little longer, since each box gives you 20 at random.
        </p>
        <p>
          The secret rares are the hard part. A box averages about 11 cards from the Rare to Classic group, spread across 78 different
          cards, and about one card from the top group of Special Art Rares, Futuristic Rares and RGB mark cards. Pulling all of
          those from boxes alone takes a lot of boxes.
        </p>
        <p>
          So most collectors open a few boxes for fun, then pick up the Futuristic Rares, Special Art Rares and favorite classics as
          singles. The <Link to="/sets/30th-celebration">30th Celebration card list</Link> makes it easy to track what you still need.
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
