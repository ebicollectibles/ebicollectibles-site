import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'brilliant-fantasy-release-news')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/Brilliant%20Fantasy/Cards/0${n}.webp`

type Shown = { n: string; name: string; note: string }

function Grid({ cards, cols }: { cards: Shown[]; cols: number }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <figure key={c.n}>
          <img src={cardImg(c.n)} alt={`${c.name} ${c.n}/207, Brilliant Fantasy`} loading="lazy" width={300} height={419} />
          <figcaption>
            <strong>{c.name}</strong>
            {c.n}/207 · {c.note}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const CARMINE = [
  { n: '255', name: 'Carmine', note: 'SAR · OKACHEKE · Chinese exclusive' },
  { n: '240', name: 'Carmine', note: 'Super Rare · kantaro' },
]

const SAR = [
  { n: '244', name: 'Milotic ex', note: 'SAR · Kuroimori' },
  { n: '242', name: 'Teal Mask Ogerpon ex', note: 'SAR · Yano Keiji' },
  { n: '250', name: 'Pecharunt ex', note: 'SAR · kantaro' },
  { n: '254', name: 'Kieran', note: 'SAR · Teeziro' },
  { n: '251', name: 'Bloodmoon Ursaluna ex', note: 'SAR · MINAMINAMI Take' },
  { n: '245', name: 'Wellspring Mask Ogerpon ex', note: 'SAR · Yano Keiji' },
  { n: '253', name: 'Perrin', note: 'SAR · GIDORA' },
  { n: '252', name: 'Cassiopeia', note: 'SAR · burari' },
]

const ULTRA = [
  { n: '256', name: 'Teal Mask Ogerpon ex', note: 'Ultra Rare' },
  { n: '257', name: 'Pecharunt ex', note: 'Ultra Rare' },
  { n: '258', name: 'Bloodmoon Ursaluna ex', note: 'Ultra Rare' },
]

const ART_RARES = [
  { n: '209', name: 'Feebas', note: 'Art Rare · Kuroimori' },
  { n: '208', name: 'Larvesta', note: 'Art Rare · Whisker' },
  { n: '213', name: 'Fraxure', note: 'Art Rare · MINAMINAMI Take' },
  { n: '210', name: 'Duskull', note: 'Art Rare · James Turner' },
  { n: '211', name: 'Dusclops', note: 'Art Rare · James Turner' },
  { n: '212', name: 'Dusknoir', note: 'Art Rare · James Turner' },
]

// Pokémon China's two odds charts, one per pack size. Shares are of all
// cards printed for that pack size, grouped into the bands the chart uses.
const ODDS = [
  { band: 'Common and Uncommon (non-holo)', slim: '80.00%', jumbo: '70.00%' },
  { band: 'Poké Ball pattern holo and Rare', slim: '13.82%', jumbo: '22.11%' },
  { band: 'Double Rare, Art Rare, ACE SPEC and Master Ball pattern holo', slim: '5.45%', jumbo: '6.89%' },
  { band: 'Super Rare, Special Art Rare and Ultra Rare', slim: '0.73%', jumbo: '1.00%' },
]

const BLOCKS = [
  { nos: '001 to 172', what: 'Pokémon, grouped by type', rarity: 'C, U, R, RR' },
  { nos: '173 to 207', what: 'Items, Tools, Supporters, Stadiums, Special Energy', rarity: 'C, U, ACE' },
  { nos: '208 to 213', what: 'Art Rares', rarity: 'AR' },
  { nos: '214 to 241', what: 'Super Rare full arts of 18 ex and 10 Supporters', rarity: 'SR' },
  { nos: '242 to 255', what: 'Special Art Rares of 10 ex and 4 Supporters', rarity: 'SAR' },
  { nos: '256 to 264', what: 'Gold Ultra Rares', rarity: 'UR' },
]

const TOC = [
  { id: 'slim-or-jumbo', label: 'Slim or jumbo?' },
  { id: 'carmine', label: 'Carmine, only in Chinese' },
  { id: 'special-art-rares', label: 'Special Art Rares' },
  { id: 'ultra-rares', label: 'Gold Ultra Rares' },
  { id: 'art-rares', label: 'Art Rares' },
  { id: 'set-and-odds', label: 'How the set is built, and the odds' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese exclusive card in Brilliant Fantasy?',
    a: 'Carmine 255/207, a Special Art Rare by OKACHEKE showing Carmine and Kieran eating watermelon in the summer sun. English has a Carmine Special Illustration Rare, but with different art.',
  },
  {
    q: 'What is the difference between the slim and jumbo Brilliant Fantasy packs?',
    a: 'A slim pack has 5 cards: 4 non-holo and 1 holo. A jumbo pack has 20 cards: 14 non-holo and 6 holo. The card list is the same, and Pokémon China published a better odds chart for the jumbo pack.',
  },
  {
    q: 'How many big hits are in a box?',
    a: 'Super Rares, Special Art Rares and Ultra Rares are 0.73% of slim cards and 1.00% of jumbo cards. That averages about 0.55 per slim box (one every 27 packs) and about 1.2 per jumbo box (one every 5 packs).',
  },
  {
    q: 'Who is on the Brilliant Fantasy pack?',
    a: 'Milotic. Its Pokémon ex comes as a Double Rare, a Super Rare and a Special Art Rare by Kuroimori, and its pre-evolution Feebas gets an Art Rare by the same artist.',
  },
  {
    q: 'How many cards are in Brilliant Fantasy?',
    a: '264 numbered cards: 207 in the main set and 57 secret rares. With the Poké Ball and Master Ball pattern holos of all 176 Commons, Uncommons and Rares, there are 616 different cards.',
  },
]

export const Route = createFileRoute('/blog/brilliant-fantasy-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
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
  component: BrilliantFantasyReleasePost,
})

function BrilliantFantasyReleasePost() {
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
        updated={status.liveAt}
        wide
        post={post}
        lede="Milotic takes the cover of Brilliant Fantasy, the Kitakami set with four Ogerpon ex and the Loyal Three, plus a Carmine Special Art Rare you can only pull in Simplified Chinese."
        cta={{
          heading: 'Shop Brilliant Fantasy',
          body: 'Slim and jumbo booster boxes, plus the full checklist with every card.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box' }, label: 'Shop the jumbo box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-slim-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Brilliant Fantasy (璀璨诡幻) released on March 13, 2026. Milotic is on the pack, and the set is built around Kitakami: all
          four masks of Ogerpon ex, Okidogi ex, Munkidori ex, Fezandipiti ex and Pecharunt ex, with Kieran, Carmine and Perrin as
          Supporters. The big Chinese extra is a new Carmine Special Art Rare that no other language has.
        </p>

        <aside className="fact-box" aria-label="Brilliant Fantasy key facts">
          <img
            src={`${SITE_URL}/assets/blog/brilliant-fantasy-slim-pack.webp`}
            alt="Brilliant Fantasy slim booster pack with Milotic on the front"
            loading="lazy"
            width={600}
            height={1126}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>Brilliant Fantasy (璀璨诡幻)</dd>
              <dt>Set code</dt>
              <dd>CSV8C</dd>
              <dt>Released</dt>
              <dd>March 13, 2026</dd>
              <dt>Slim pack</dt>
              <dd>5 cards, 1 holo. 15 packs per box</dd>
              <dt>Jumbo pack</dt>
              <dd>20 cards, 6 holo. 6 packs per box</dd>
              <dt>Set size</dt>
              <dd>264 cards: 207 in the main set, 57 secret rares</dd>
              <dt>Chase cards</dt>
              <dd>Carmine SAR, Milotic ex SAR, the Ogerpon ex and Pecharunt ex SARs</dd>
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

        <h2 id="slim-or-jumbo">Slim or jumbo?</h2>
        <p>
          Brilliant Fantasy comes in two pack sizes with the same card list. The slim pack is 5 cards with one holo. The jumbo pack is
          20 cards with six holos. Pokémon China published a separate odds chart for each, and the jumbo pack is better at every holo
          level.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${SITE_URL}/assets/blog/brilliant-fantasy-slim-pack.webp`} alt="Brilliant Fantasy slim pack, 5 cards" loading="lazy" width={600} height={1126} />
            <figcaption>
              <strong>Slim pack</strong>5 cards · 1 holo
            </figcaption>
          </figure>
          <figure>
            <img src={`${SITE_URL}/assets/blog/brilliant-fantasy-jumbo-pack.webp`} alt="Brilliant Fantasy jumbo pack, 20 cards" loading="lazy" width={600} height={1198} />
            <figcaption>
              <strong>Jumbo pack</strong>20 cards · 6 holo
            </figcaption>
          </figure>
        </div>
        <p>
          A slim box is 15 packs, 75 cards and 15 holos. A jumbo box is 6 packs, 120 cards and 36 holos. The top band (Super Rare,
          Special Art Rare and Ultra Rare) is 1.00% of jumbo cards against 0.73% of slim cards, so a jumbo box averages about 1.2 of
          them and a slim box about 0.55. The full odds are further down.
        </p>

        <h2 id="carmine">Carmine, only in Chinese</h2>
        <p>
          Carmine 255/207 is a Special Art Rare drawn for this set by OKACHEKE. Carmine and her brother Kieran sit side by side in the
          summer sun eating watermelon, and she smiles as she watches him. English has a Carmine Special Illustration Rare with
          different art, and it is not in this set. The Carmine Super Rare by kantaro is here too.
        </p>
        <Grid cards={CARMINE} cols={2} />

        <h2 id="special-art-rares">Special Art Rares</h2>
        <p>
          Fourteen Special Art Rares, 242 to 255: ten Pokémon ex and four Supporters. Milotic ex by Kuroimori matches the pack. The four
          Ogerpon ex are a matching set by Yano Keiji, and kantaro drew Okidogi ex, Munkidori ex, Fezandipiti ex and Pecharunt ex as
          another.
        </p>
        <Grid cards={SAR} cols={4} />

        <h2 id="ultra-rares">Gold Ultra Rares</h2>
        <p>
          Nine gold cards, 256 to 264. Three are Pokémon ex: Teal Mask Ogerpon ex, Pecharunt ex and Bloodmoon Ursaluna ex. The other six
          are Enhanced Hammer, Bravery Charm, Gravity Mountain, Jamming Tower, Jet Energy and Luminous Energy.
        </p>
        <Grid cards={ULTRA} cols={3} />

        <h2 id="art-rares">Art Rares</h2>
        <p>
          Six Art Rares, 208 to 213. Feebas is by Kuroimori, the artist behind the Milotic ex Special Art Rare, and James Turner drew
          Duskull, Dusclops and Dusknoir as a set of three.
        </p>
        <Grid cards={ART_RARES} cols={3} />

        <h2 id="set-and-odds">How the set is built, and the odds</h2>
        <p>
          Every card has one number out of 207. The main set runs 001 to 207, with nine pink ACE SPEC cards among the Trainers and
          Energy, and everything above 207 is a secret rare. The rarer versions of a card sit in the secret block at unrelated numbers,
          so match them by name.
        </p>
        <div className="table-scroll">
          <table className="data-table">
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
        <p>Pokémon China's odds charts for each pack size:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Share of print</th>
                <th scope="col">Slim</th>
                <th scope="col">Jumbo</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.band}>
                  <th scope="row">{o.band}</th>
                  <td>{o.slim}</td>
                  <td>{o.jumbo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">From Pokémon China's odds chart for each pack size.</p>
        <p>
          In packs, that is roughly one top-band card in every 27 slim packs, against one in every 5 jumbo packs. Per box, a slim box
          averages about 4 cards from the Double Rare band and a jumbo box about 8.
        </p>
        <p>
          Every Common, Uncommon and Rare also comes as a Poké Ball pattern holo and a Master Ball pattern holo, 176 of each. The card is
          the same, only the foil changes, which brings a true master set to 616 cards. The Master Ball versions share the Double Rare
          band, so they are a real chase on their own. Our <Link to="/blog/brilliant-fantasy-set-guide">set guide</Link> has
          every chase card and the box math, and our{' '}
          <Link to="/blog/brilliant-fantasy-card-origins">card origins guide</Link> matches every card to its English version.
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

        <h2 id="our-take">Our take</h2>
        <p>
          Brilliant Fantasy is the set for Kitakami fans, with every Ogerpon mask and the Loyal Three at Special Art Rare. The Carmine SAR
          is the card that makes the Chinese version worth having next to English, and the Milotic ex SAR is the prettiest card in the
          set. If you are opening for hits, the jumbo box is the better buy on the odds.
        </p>
      </BlogPostLayout>
    </>
  )
}
