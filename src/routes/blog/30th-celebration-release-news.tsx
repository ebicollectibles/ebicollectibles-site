import { Zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-release-news')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/30th%20Celebration/Cards/${id}.webp`

type Shown = { id: string; no: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.id}>
          <figure>
            <img src={cardImg(c.id)} alt={`${c.name} ${c.no}, 30th Celebration`} loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>{c.name}</strong>
              {c.no} · {c.note}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const PIKACHU = [
  { id: '0017', no: '017/103', name: 'Pikachu', note: '1 of 30' },
  { id: '0018', no: '018/103', name: 'Pikachu', note: '2 of 30' },
  { id: '0019', no: '019/103', name: 'Pikachu', note: '3 of 30' },
  { id: '0030', no: '030/103', name: 'Pikachu', note: '14 of 30 · OKACHEKE' },
  { id: '0031', no: '031/103', name: 'Pikachu', note: '15 of 30 · Yuu Nishida' },
  { id: '0041', no: '041/103', name: 'Pikachu', note: '25 of 30 · Atsuko Nishida' },
]

const FUTURISTIC = [
  { id: '0134', no: '134/103', name: 'Mewtwo ex', note: 'Futuristic Rare · YOSHIROTTEN' },
  { id: '0135', no: '135/103', name: 'Mew ex', note: 'Futuristic Rare · YOSHIROTTEN' },
]

const SAR = [
  { id: '0126', no: '126/103', name: 'Pikachu ex', note: 'Special Art Rare · kantaro' },
  { id: '0127', no: '127/103', name: 'Pikachu ex', note: 'Special Art Rare · kantaro' },
  { id: '0130', no: '130/103', name: 'Sylveon ex', note: 'Special Art Rare · You Iribi' },
  { id: '0125', no: '125/103', name: 'Greninja ex', note: 'Special Art Rare' },
  { id: '0133', no: '133/103', name: 'Salamence ex', note: 'Special Art Rare' },
  { id: '0124', no: '124/103', name: 'Fuecoco ex', note: 'Special Art Rare' },
]

const CLASSICS = [
  { id: '0137', no: '137/103', name: 'Charizard', note: 'Base Set, 1999' },
  { id: '0136', no: '136/103', name: 'Pikachu', note: 'Base Set, 1999' },
  { id: '0142', no: '142/103', name: 'Lugia', note: 'Aquapolis, 2003' },
  { id: '0138', no: '138/103', name: 'Misty', note: 'Gym Heroes, 2000' },
  { id: '0150', no: '150/103', name: 'Gengar', note: 'Triumphant, 2010' },
  { id: '0154', no: '154/103', name: 'Rayquaza-EX', note: 'Dragons Exalted, 2012' },
]

const ART_RARES = [
  { id: '0121', no: '121/103', name: 'Ditto', note: 'Art Rare · Ounishi' },
  { id: '0108', no: '108/103', name: 'Zapdos', note: 'Art Rare' },
  { id: '0107', no: '107/103', name: 'Articuno', note: 'Art Rare' },
  { id: '0105', no: '105/103', name: 'Moltres', note: 'Art Rare' },
  { id: '0106', no: '106/103', name: 'Lapras', note: 'Art Rare · Amelicart' },
  { id: '0122', no: '122/103', name: 'Hisuian Zorua', note: 'Art Rare · 0313' },
]

const BLOCKS = [
  { nos: '001 to 103', what: 'Main set: Pokémon, the 30 Pikachu (017 to 046) and 3 Trainers', rarity: 'C, R, Pikachu, RR' },
  { nos: '104 to 123', what: 'Art Rares', rarity: 'AR' },
  { nos: '124 to 133', what: 'Special Art Rares of the ex', rarity: 'SAR' },
  { nos: '134 to 135', what: 'Futuristic Rares: Mewtwo ex and Mew ex', rarity: 'FUR' },
  { nos: '136 to 165', what: 'Classic collection: 30 famous cards from 1999 to 2023', rarity: 'Classic' },
]

const PROMOS = [
  { nos: '001 to 027/30th-P', what: 'First partner Pokémon from all nine generations', where: 'First Partner special illustration sets, Vol. 1 to 3' },
  { nos: '028 to 029/30th-P', what: 'Espeon ex and Umbreon ex', where: 'Espeon ex and Umbreon ex collection box' },
  { nos: '030 to 031/30th-P', what: 'Pikachu ex in Futuristic style', where: 'Futuristic collection box' },
  { nos: '032 to 033/30th-P', what: 'Greninja ex and Sylveon ex', where: 'Card display sleeve sets' },
]

const ODDS = [
  { group: 'Common, Basic Energy and the 30 Pikachu', share: '89.83%' },
  { group: 'Rare, Double Rare, Art Rare and Classic', share: '9.17%' },
  { group: 'Special Art Rare, Futuristic Rare and 3 RGB mark cards', share: '1.00%' },
]

const TOC = [
  { id: 'futuristic', label: 'The chase: Futuristic Rares' },
  { id: 'sar', label: 'Special Art Rares' },
  { id: 'classics', label: '30 classic cards return' },
  { id: 'pikachu', label: '30 Pikachu, one in every pack' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'how-the-set-works', label: 'How the set is built' },
  { id: 'booster-box', label: 'What is inside a booster box' },
  { id: 'promos', label: 'The 33 promos' },
  { id: 'binder', label: 'A binder for the whole set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was 30th Celebration released?',
    a: 'September 16, 2026, in mainland China. It was the first Pokémon TCG product released worldwide on the same day.',
  },
  {
    q: 'Is the Chinese 30th Celebration the same set as the English and Japanese ones?',
    a: 'It is the same release, and its card list matches the Japanese 30th Celebration card for card. English splits some cards out differently and adds 25 cards of its own, which our card origins guide covers.',
  },
  {
    q: 'How many packs come in a booster box?',
    a: '20 packs of 6 cards each, so 120 cards per box. Every card is a holo.',
  },
  {
    q: 'Is there really a Pikachu in every pack?',
    a: 'Yes. Each pack has one of the 30 Pikachu cards, numbered 017 to 046, each drawn by a different illustrator.',
  },
  {
    q: 'What are the main chase cards?',
    a: 'The two Futuristic Rares, Mewtwo ex 134/103 and Mew ex 135/103 by YOSHIROTTEN, the Pikachu ex Special Art Rares, and the classic Charizard 137/103.',
  },
  {
    q: 'What are the odds of pulling a Special Art Rare or better?',
    a: "Special Art Rares, Futuristic Rares and the three RGB mark cards make up 1.00% of the print run, going by Pokémon China's print shares. With 120 cards in a box, that averages about 1.2 per box, or roughly one in every 17 packs.",
  },
  {
    q: 'Where do the 30th Celebration illustrations come from?',
    a: 'Every card in the Chinese set is also in English, though split differently. The 30 classic cards reprint famous English cards from 1999 to 2023, from Base Set Charizard and Pikachu to the Paldea Evolved Magikarp Illustration Rare.',
    link: { to: '/sets/chinese/30th-celebration', before: 'See every card on the ', label: '30th Celebration card list', after: '.' },
  },
  {
    q: 'Are the classic cards legal to play?',
    a: 'Pokémon China says each classic card can be used wherever the original card is legal.',
  },
]

export const Route = createFileRoute('/blog/30th-celebration-release-news')({
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
  component: ThirtiethReleasePost,
})

function ThirtiethReleasePost() {
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
        lede="The Pokémon TCG turns 30 with a set made to celebrate it: a different Pikachu in every pack, a new Futuristic Rare, and 30 famous cards from 1999 to 2023 back in their original frames."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'Booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/chinese/30th-celebration', label: 'See the full card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration (set code 30thC) lands on September 16, 2026, and it is a first: the Simplified Chinese, English and Japanese versions all
          release on the same day. It marks 30 years of the Pokémon TCG with a 165-card set built around Pikachu, a brand-new
          Futuristic Rare, and a collection of 30 classic cards reprinted in their original frames.
        </p>

        <aside className="fact-box" aria-label="30th Celebration key facts">
          <img
            src={`${SITE_URL}/assets/blog/30th-celebration-booster-pack.webp`}
            alt="30th Celebration booster pack with Pikachu, Mew and Mewtwo on the front"
            loading="lazy"
            width={600}
            height={1208}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>30th Celebration (<Zh>30周年庆典</Zh>)</dd>
              <dt>Set code</dt>
              <dd>30thC</dd>
              <dt>Released</dt>
              <dd>September 16, 2026, worldwide on the same day</dd>
              <dt>Pack</dt>
              <dd>6 cards, all holo, with 1 Pikachu in every pack</dd>
              <dt>Booster box</dt>
              <dd>20 packs, 120 cards</dd>
              <dt>Set size</dt>
              <dd>165 cards: 103 in the main set, 62 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Mewtwo ex and Mew ex Futuristic Rares, classic Charizard</dd>
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

        <h2 id="futuristic">The chase: Futuristic Rares</h2>
        <p>
          Futuristic Rare is a brand-new rarity made for this set, illustrated by the graphic artist YOSHIROTTEN. There are only two:
          Mewtwo ex, whose Photon Bullet attack hits each of your opponent's Pokémon ex, and Mew ex, whose Memory Spiral ability lets it
          use the attacks of your Benched Pokémon.
        </p>
        <ul className="card-grid cols-2">
          {FUTURISTIC.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} ${c.no} Futuristic Rare, 30th Celebration`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{c.name}</strong>
                  {c.no} · {c.note}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="sar">Special Art Rares</h2>
        <p>
          The ten Special Art Rares, 124 to 133, give each Pokémon ex in the set a full scene. The two Pikachu ex by kantaro are the
          headliners, joined by Fuecoco, Greninja, Mewtwo, Mew, Sylveon, Gengar, Jirachi and Salamence ex.
        </p>
        <Grid cards={SAR} cols={3} />

        <h2 id="classics">30 classic cards return</h2>
        <p>
          Numbers 136 to 165 bring back 30 famous cards from the game's history in their original-style frames, from the Base Set
          Charizard and Pikachu of 1999 to the Paldea Evolved Magikarp of 2023. Each has a gold glitter border and a 30th anniversary
          stamp, and Pokémon China notes that this is the first Simplified Chinese printing of the Base Set Charizard.
        </p>
        <Grid cards={CLASSICS} cols={3} />
        <p>
          Our <Link to="/blog/30th-celebration-card-origins">card origins guide</Link> traces all 30 back to the original card.
        </p>

        <BuyStrip />

        <h2 id="pikachu">30 Pikachu, one in every pack</h2>
        <p>
          Every pack holds one of 30 Pikachu cards, numbered 017 to 046, and each was drawn by a different illustrator. Each one has its
          own art and a Pikachu-face holo pattern, so collecting all 30 is a set within the set.
        </p>
        <Grid cards={PIKACHU} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Twenty Art Rares, 104 to 123, give main-set Pokémon a full illustration. Ditto 121/103 is one to note: in English that art was
          only released as a promo, but here it comes out of booster packs.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="how-the-set-works">How the set is built</h2>
        <p>
          This is a regular numbered set, not a Gem-style ladder. The main set runs 001 to 103, and everything after that is a secret
          rare. There is no Uncommon tier. Instead there is a set-specific Pikachu rarity for the 30 Pikachu cards.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">How the set is built</caption>
            <thead>
              <tr>
                <th scope="col">Numbers</th>
                <th scope="col">What they are</th>
                <th scope="col">Rarity</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((b) => (
                <tr key={b.nos}>
                  <th scope="row">{b.nos}</th>
                  <td>{b.what}</td>
                  <td>{b.rarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Eight basic Energy cards and 33 promos sit outside the numbered set.</p>

        <h2 id="booster-box">What is inside a booster box</h2>
        <p>
          A box holds 20 packs of 6 holo cards, 120 cards in total, including 20 Pikachu. With 30 different Pikachu and random pulls, one
          box will not complete the Pikachu set. Pokémon China publishes how much of the print run each group of rarities makes up:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">What is inside a booster box</caption>
            <thead>
              <tr>
                <th scope="col">Rarity group</th>
                <th scope="col">Share of print</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.group}>
                  <th scope="row">{o.group}</th>
                  <td>{o.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Across 120 cards, that works out to roughly 11 cards from the Rare to Classic group and about one card from the top group per
          box. These are averages, and individual boxes vary.
        </p>
        <p>
          For every Pikachu, classic and promo in one place, see our <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link>.
        </p>

        {/* The anchor id sits on a span inside the heading: reader modes drop a heading whose own id

            contains a word like "promo" or "share", and this section would lose its title there. */}

        <h2>

          <span id="promos">The 33 promos</span>

        </h2>
        <p>Thirty-three promos, numbered 001 to 033/30th-P, come in the special products released with the set. They are not in booster packs:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">The 33 promos</caption>
            <thead>
              <tr>
                <th scope="col">Promos</th>
                <th scope="col">Cards</th>
                <th scope="col">Where they come from</th>
              </tr>
            </thead>
            <tbody>
              {PROMOS.map((p) => (
                <tr key={p.nos}>
                  <th scope="row">{p.nos}</th>
                  <td>{p.what}</td>
                  <td>{p.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="binder">A binder for the whole set</h2>
        <p>
          Pokémon China also released a black and gold zippered binder alongside the set, with 9 pockets per page and room for 360 cards,
          enough for the full set, the classics and the promos.
        </p>
        <img
          className="inline-media"
          src={`${SITE_URL}/assets/blog/30th-celebration-zip-binder.webp`}
          alt="Official 30th Celebration 9-pocket zippered card binder"
          loading="lazy"
          width={1600}
          height={1067}
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
          30th Celebration is a set to open for the fun of it. Every card is a holo, every pack has a Pikachu, and the classic collection
          puts famous cards from 1999 to 2023 in one binder. If you only chase one card, make it a Futuristic Rare. If you like completing runs,
          the 30 Pikachu are the perfect project.
        </p>
      </BlogPostLayout>
    </>
  )
}
