import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-1-card-origins')!

const cardImg = (id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%201/Cards/${id}.webp`

// English sources the Gem Vol 1 illustrations come from, in release order.
const SETS = ['Scarlet & Violet', 'Paldea Evolved', '151', 'Paldean Fates', 'SV Black Star Promos'] as const
type SetName = (typeof SETS)[number]

// A null set means art with no English printing we could find: `exclusive`
// marks the four Chinese Exclusives, the rest is new art. A null cell means
// the Pokémon has no card of that kind in this set.
type Source = { set: SetName | null; no: string | null; illus: string; exclusive?: boolean }

const COLUMNS = ['Base card', 'Shiny-style (06)', 'Full art (08)', 'Horizons full art (09)']

// Each illustration was matched on card name plus the illustrator printed on
// the Gem card, then checked side by side against the English card image
// on Limitless TCG.
const ROWS: Array<{ pp: string; name: string; cells: Array<Source | null> }> = [
  { pp: '01', name: 'Sprigatito', cells: [{ set: 'Scarlet & Violet', no: '013/198', illus: 'Saya Tsuruta' }, { set: 'SV Black Star Promos', no: 'SVP 076', illus: 'kurumitsu' }, { set: 'Paldea Evolved', no: '196/193', illus: 'Kouki Saitou' }, { set: null, no: null, illus: 'Yasuda Shuhei', exclusive: true }] },
  { pp: '02', name: 'Floragato', cells: [{ set: 'Paldea Evolved', no: '014/193', illus: 'nagimiso' }, { set: 'SV Black Star Promos', no: 'SVP 077', illus: 'GIDORA' }, { set: 'Paldea Evolved', no: '197/193', illus: 'Kouki Saitou' }, null] },
  { pp: '03', name: 'Fuecoco', cells: [{ set: 'Paldea Evolved', no: '035/193', illus: 'ryoma uratsuka' }, { set: 'SV Black Star Promos', no: 'SVP 079', illus: 'OKACHEKE' }, { set: 'Paldea Evolved', no: '201/193', illus: 'kantaro' }, { set: null, no: null, illus: 'Ito Kyoko', exclusive: true }] },
  { pp: '04', name: 'Crocalor', cells: [{ set: 'Paldea Evolved', no: '036/193', illus: 'Hitoshi Ariga' }, { set: 'SV Black Star Promos', no: 'SVP 080', illus: 'Hideki Ishikawa' }, { set: 'Paldea Evolved', no: '202/193', illus: 'kantaro' }, null] },
  { pp: '05', name: 'Quaxly', cells: [{ set: 'Paldea Evolved', no: '049/193', illus: 'sui' }, { set: 'SV Black Star Promos', no: 'SVP 082', illus: 'GIDORA' }, { set: 'Paldea Evolved', no: '206/193', illus: 'Souichirou Gunjima' }, { set: null, no: null, illus: 'Yamazaki Rei', exclusive: true }] },
  { pp: '06', name: 'Quaxwell', cells: [{ set: 'Paldea Evolved', no: '051/193', illus: 'Souichirou Gunjima' }, { set: 'SV Black Star Promos', no: 'SVP 083', illus: 'Atsushi Furusawa' }, { set: 'Paldea Evolved', no: '207/193', illus: 'Souichirou Gunjima' }, null] },
  { pp: '07', name: 'Captain Pikachu', cells: [{ set: null, no: null, illus: 'Ito Kyoko' }, { set: 'Paldean Fates', no: '131/091', illus: 'Yuu Nishida' }, { set: 'SV Black Star Promos', no: 'SVP 088', illus: 'saino misaki' }, { set: null, no: null, illus: 'Yamazaki Rei', exclusive: true }] },
  { pp: '08', name: 'Vulpix', cells: [{ set: '151', no: '037/165', illus: 'kawayoo' }, null, null, null] },
  { pp: '09', name: 'Pawmo', cells: [{ set: 'Scarlet & Violet', no: '075/198', illus: 'Saya Tsuruta' }, null, null, null] },
  { pp: '10', name: 'Fidough', cells: [{ set: 'Scarlet & Violet', no: '098/198', illus: 'Saya Tsuruta' }, null, null, null] },
  { pp: '11', name: 'Sudowoodo', cells: [{ set: 'Paldea Evolved', no: '109/193', illus: 'Jerky' }, null, null, null] },
  { pp: '12', name: 'Rockruff', cells: [{ set: 'Paldea Evolved', no: '116/193', illus: '0313' }, null, null, null] },
  { pp: '13', name: 'Paldean Wooper', cells: [{ set: 'Paldea Evolved', no: '128/193', illus: 'Kouki Saitou' }, null, null, null] },
  { pp: '14', name: 'Maschiff', cells: [{ set: 'Paldea Evolved', no: '142/193', illus: 'Shibuzoh.' }, null, null, null] },
  { pp: '15', name: 'Chansey', cells: [{ set: 'Scarlet & Violet', no: '144/198', illus: 'sui' }, null, null, null] },
  { pp: '16', name: 'Lechonk', cells: [{ set: 'Scarlet & Violet', no: '155/198', illus: 'kodama' }, null, null, null] },
]

const TRAINERS: Array<{ no: string; name: string; src: Source }> = [
  { no: '1701/04', name: 'Poké Ball', src: { set: 'Scarlet & Violet', no: '185/198', illus: 'Studio Bora Inc.' } },
  { no: '1702/04', name: 'Great Ball', src: { set: 'Paldea Evolved', no: '183/193', illus: 'Studio Bora Inc.' } },
  { no: '1703/04', name: 'Ultra Ball', src: { set: 'Scarlet & Violet', no: '196/198', illus: 'Ayaka Yoshida' } },
  { no: '1704/04', name: 'Nemona', src: { set: 'Paldean Fates', no: '238/091', illus: 'aspara' } },
]

const ALL_SOURCES = [...ROWS.flatMap((r) => r.cells), ...TRAINERS.map((t) => t.src)].filter((s): s is Source => s !== null)
const SET_COUNTS = SETS.map((set) => ({ set, count: ALL_SOURCES.filter((s) => s.set === set).length })).filter((s) => s.count > 0)

const sourceLabel = (s: Source) => (s.set?.endsWith('Promos') ? `${s.no}` : `${s.set} ${s.no}`)

const EXCLUSIVES = [
  { id: '0109', name: 'Sprigatito', illus: 'Yasuda Shuhei' },
  { id: '0309', name: 'Fuecoco', illus: 'Ito Kyoko' },
  { id: '0509', name: 'Quaxly', illus: 'Yamazaki Rei' },
  { id: '0709', name: 'Captain Pikachu', illus: 'Yamazaki Rei' },
]

const TOC = [
  { id: 'how-it-works', label: 'How Gem Pack art works' },
  { id: 'by-set', label: 'Which sets it comes from' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'full-map', label: 'The full card-by-card map' },
  { id: 'trainers', label: 'Trainer cards' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'When was Gem Vol 1 released?',
    a: 'January 17, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Are Gem 1 cards reprints?',
    a: 'The art mostly is. 33 of the 38 illustrations we traced are the same art you will find on English Scarlet & Violet cards, nearly half of them from Paldea Evolved. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
    link: { to: '/sets/chinese/gem-vol-1', before: 'See every card on the ', label: 'Gem Vol 1 card list', after: '.' },
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 1?',
    a: 'Four: the Pokémon Horizons full arts of Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09 and Captain Pikachu 0709/09. None of them are on an English card. Captain Pikachu\'s base card is also Horizons art with no English printing we could find, but it is not one of the Chinese Exclusives.',
  },
  {
    q: 'Are the full arts the same as Paldea Evolved?',
    a: 'Six of the seven are. The starter full arts reuse the Paldea Evolved Illustration Rares. The Pikachu full art, 0708/09, uses the art from an English Scarlet & Violet Black Star Promo, SVP 088.',
  },
  {
    q: 'Is Captain Pikachu in an English set?',
    a: 'Not with this art, as far as we could find. Both Captain Pikachu illustrations in Gem Vol 1, the base card and the Horizons full art, have no English printing. The two plain Pikachu cards in the same row do: 0706/09 is the Paldean Fates shiny Pikachu and 0708/09 is SVP 088.',
  },
  {
    q: 'Where does Nemona come from?',
    a: "Nemona reuses aspara's Special Illustration Rare art from Paldean Fates, 238/091.",
  },
]

export const Route = createFileRoute('/blog/gem-vol-1-card-origins')({
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
  component: GemVol1OriginsPost,
})

function SourceCell({ s }: { s: Source | null }) {
  if (!s) return <td className="cell-none">None in this set</td>
  return (
    <td>
      {s.set ? sourceLabel(s) : s.exclusive ? 'Chinese Exclusive' : 'New art, no English printing'}
      <span className="cell-sub">Illus. {s.illus}</span>
    </td>
  )
}

function GemVol1OriginsPost() {
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
        lede="Most cards in Gem Pack Vol. 1 use Scarlet & Violet art you have already seen on an English card. We traced all 38 illustrations: 33 match English cards, and four of the other five are Chinese Exclusives."
        cta={{
          heading: 'Explore Gem Vol 1',
          body: 'See every card in the set, or read our set guide for every full art and shiny-style card in one place.',
          links: [
            { to: '/sets/chinese/gem-vol-1', label: 'See the full card list' },
            { to: '/blog/gem-vol-1-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse illustrations from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo
          patterns. We matched every illustration in Gem Vol 1 (Gem 1, set code CBB1C) to the English card it came from. The exceptions are Pokémon
          Horizons art: the four Chinese Exclusive full arts and Captain Pikachu's base card. For more on the set itself, see our{' '}
          <Link to="/blog/gem-vol-1-release-news">Gem Vol 1 release post</Link> and the{' '}
          <Link to="/blog/gem-vol-1-set-guide">Gem Vol 1 set guide</Link>.
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

        <h2 id="how-it-works">How Gem Pack art works</h2>
        <p>
          Each Pokémon in Gem Vol 1 has one base card, used on every version except the full arts and the shiny-style card. The seven
          long runs, the starters, their middle evolutions and Captain Pikachu, add a shiny-style card at version 06 and an illustration
          full art at version 08. Sprigatito, Fuecoco, Quaxly and Captain Pikachu also get a Horizons full art at version 09. The four
          Trainer cards reuse English art too. We left out the basic Energy cards.
        </p>
        <p>
          That adds up to 38 illustrations. 33 of them come from English cards. The other five are Pokémon Horizons art with no English
          printing we could find: the four Chinese Exclusive full arts and Captain Pikachu's base card.
        </p>
        <ul className="card-grid cols-4">
          {EXCLUSIVES.map((c) => (
            <li key={c.id}>
              <figure>
                <img src={cardImg(c.id)} alt={`${c.name} ${c.id}/09 Chinese Exclusive Horizons full art, Gem Vol 1`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <ChineseExclusiveBadge />
                  <strong>
                    {c.name} {c.id}/09
                  </strong>
                  Horizons full art · Illus. {c.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>All of it is Scarlet & Violet era art, with Paldea Evolved the biggest source, listed in release order:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Which sets it comes from</caption>
            <thead>
              <tr>
                <th scope="col">English source</th>
                <th scope="col">Illustrations</th>
              </tr>
            </thead>
            <tbody>
              {SET_COUNTS.map((s) => (
                <tr key={s.set}>
                  <th scope="row">{s.set}</th>
                  <td>{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Counts include the four Trainer cards. The four Chinese Exclusive full arts and Captain Pikachu's base card have no English
          version, so the column adds up to 33.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Four full arts are Chinese Exclusives.</strong> Sprigatito, Fuecoco, Quaxly and Captain Pikachu each get a new Pokémon
            Horizons full art, three of them with Liko, Roy and Friede, and Quaxly with Nidothing.
          </li>
          <li>
            <strong>Captain Pikachu's base card is new too.</strong> It is Horizons art with Friede in the background, and we found no
            English printing. It is new art, not one of the Chinese Exclusives.
          </li>
          <li>
            <strong>Paldea Evolved supplies the most.</strong> 16 illustrations come from it, including all six starter full arts. Those
            are the Paldea Evolved Illustration Rares, which come in pairs that share a scene.
          </li>
          <li>
            <strong>The shiny-style cards are promos.</strong> The six starter cards at version 06 reuse English Scarlet & Violet Black Star
            Promos, SVP 076 to SVP 083. Pikachu 0706/09 is the Paldean Fates shiny Pikachu.
          </li>
          <li>
            <strong>The Poké Ball is not the Gem Vol 2 one.</strong> Both are by Studio Bora Inc., but Gem Vol 1 uses the Scarlet & Violet
            Poké Ball art, while <Link to="/blog/gem-vol-2-card-origins">Gem Vol 2</Link> uses the Rebel Clash one.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>Every Gem Vol 1 Pokémon, with the English card behind each of its illustrations and the illustrator credited on it.</p>
        <div className="table-scroll table-wide" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table origins-table origins-wide">
            <caption id="tbl-2" className="sr-only">The full card-by-card map</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pokémon</th>
                {COLUMNS.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.pp} className={r.cells.some((c) => c && !c.set) ? 'is-current' : undefined}>
                  <th scope="row">{r.pp}</th>
                  <td>{r.name}</td>
                  {r.cells.map((c, i) => (
                    <SourceCell key={i} s={c} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Card numbers are the first English printing. In row 07, the base card and Horizons full art are Captain Pikachu, and the
          shiny-style card and full art are plain Pikachu.
        </p>

        <h2 id="trainers">Trainer cards</h2>
        <p>The four Trainer cards reuse English art as well. Nemona is aspara's Special Illustration Rare art from Paldean Fates.</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table origins-table">
            <caption id="tbl-3" className="sr-only">Trainer cards</caption>
            <thead>
              <tr>
                <th scope="col">Gem card</th>
                <th scope="col">Trainer</th>
                <th scope="col">English source</th>
              </tr>
            </thead>
            <tbody>
              {TRAINERS.map((t) => (
                <tr key={t.no}>
                  <th scope="row">{t.no}</th>
                  <td>{t.name}</td>
                  <SourceCell s={t.src} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </BlogPostLayout>
    </>
  )
}
