import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-2-card-origins')!

// English sources the Gem Vol 2 artwork comes from, in release order.
const SETS = ['Lost Thunder', 'Cosmic Eclipse', 'Sword & Shield', 'Rebel Clash', 'Vivid Voltage', 'Battle Styles', 'Evolving Skies', 'Astral Radiance', 'Crown Zenith', 'Paldean Fates', 'SWSH Black Star Promos'] as const
type SetName = (typeof SETS)[number]

// A null set means new art with no earlier printing. A null cell means the
// Pokémon has no card of that kind in this set.
type Source = { set: SetName | null; no: string | null; illus: string }

const COLUMNS = ['Base card A', 'Base card B', 'Pokémon V', 'VMAX', 'Full art']

// Each artwork was matched on card name plus the illustrator printed on the
// Gem card, then checked against Limitless TCG and TCGdex.
const ROWS: Array<{ pp: string; name: string; cells: Array<Source | null> }> = [
  { pp: '01', name: 'Eevee', cells: [{ set: 'Evolving Skies', no: '125/203', illus: 'Atsushi Furusawa' }, { set: 'Astral Radiance', no: '119/189', illus: 'sowsow' }, { set: 'SWSH Black Star Promos', no: 'SWSH065', illus: 'Kagemaru Himeno' }, { set: 'SWSH Black Star Promos', no: 'SWSH087', illus: 'PLANETA Mochizuki' }, { set: null, no: null, illus: 'HYOGONOSUKE' }] },
  { pp: '02', name: 'Vaporeon', cells: [{ set: 'SWSH Black Star Promos', no: 'SWSH072', illus: 'so-taro' }, { set: 'Vivid Voltage', no: '030/185', illus: 'kodama' }, { set: 'SWSH Black Star Promos', no: 'SWSH150', illus: '5ban Graphics' }, { set: 'Evolving Skies', no: '030/203', illus: '5ban Graphics' }, null] },
  { pp: '03', name: 'Jolteon', cells: [{ set: 'Vivid Voltage', no: '047/185', illus: 'Mizue' }, { set: 'SWSH Black Star Promos', no: 'SWSH094', illus: 'Yuu Nishida' }, { set: 'SWSH Black Star Promos', no: 'SWSH151', illus: '5ban Graphics' }, { set: 'Evolving Skies', no: '051/203', illus: '5ban Graphics' }, null] },
  { pp: '04', name: 'Flareon', cells: [{ set: 'Vivid Voltage', no: '026/185', illus: 'Eri Yamaki' }, { set: 'SWSH Black Star Promos', no: 'SWSH041', illus: 'You Iribi' }, { set: 'SWSH Black Star Promos', no: 'SWSH149', illus: '5ban Graphics' }, { set: 'Evolving Skies', no: '018/203', illus: '5ban Graphics' }, null] },
  { pp: '05', name: 'Espeon', cells: [{ set: 'Lost Thunder', no: '89/214', illus: 'Ryota Murayama' }, { set: 'SWSH Black Star Promos', no: 'SWSH174', illus: 'Tika Matsuno' }, { set: 'Evolving Skies', no: '064/203', illus: '5ban Graphics' }, { set: 'Evolving Skies', no: '065/203', illus: '5ban Graphics' }, null] },
  { pp: '06', name: 'Umbreon', cells: [{ set: 'Lost Thunder', no: '120/214', illus: 'Ryota Murayama' }, { set: 'SWSH Black Star Promos', no: 'SWSH129', illus: 'Souichirou Gunjima' }, { set: 'Evolving Skies', no: '094/203', illus: '5ban Graphics' }, { set: 'Evolving Skies', no: '095/203', illus: 'AKIRA EGAWA' }, { set: null, no: null, illus: 'HYOGONOSUKE' }] },
  { pp: '07', name: 'Leafeon', cells: [{ set: 'SWSH Black Star Promos', no: 'SWSH191', illus: 'OKACHEKE' }, { set: 'Astral Radiance', no: '013/189', illus: 'Atsushi Furusawa' }, { set: 'Crown Zenith', no: '013/159', illus: 'PLANETA Mochizuki' }, { set: 'Evolving Skies', no: '008/203', illus: 'PLANETA Tsuji' }, { set: null, no: null, illus: 'HYOGONOSUKE' }] },
  { pp: '08', name: 'Glaceon', cells: [{ set: 'SWSH Black Star Promos', no: 'SWSH192', illus: 'OKACHEKE' }, { set: 'Astral Radiance', no: '038/189', illus: 'saino misaki' }, { set: 'Crown Zenith', no: '038/159', illus: 'PLANETA Mochizuki' }, { set: 'Evolving Skies', no: '041/203', illus: 'PLANETA Tsuji' }, null] },
  { pp: '09', name: 'Sylveon', cells: [{ set: 'Cosmic Eclipse', no: '155/236', illus: 'Naoyo Kimura' }, { set: 'SWSH Black Star Promos', no: 'SWSH211', illus: 'Mizue' }, { set: 'Evolving Skies', no: '074/203', illus: 'aky CG Works' }, { set: 'Evolving Skies', no: '075/203', illus: 'Ryota Murayama' }, { set: null, no: null, illus: 'HYOGONOSUKE' }] },
]

const TRAINERS: Array<{ no: string; name: string; src: Source }> = [
  { no: '1001/04', name: 'Poké Ball', src: { set: 'Rebel Clash', no: '164/192', illus: 'Studio Bora Inc.' } },
  { no: '1002/04', name: 'Level Ball', src: { set: 'Battle Styles', no: '129/163', illus: 'Ryo Ueda' } },
  { no: '1003/04', name: 'Quick Ball', src: { set: 'Sword & Shield', no: '179/202', illus: 'sadaji' } },
  { no: '1004/04', name: 'Penny', src: { set: 'Paldean Fates', no: '239/091', illus: 'aspara' } },
]

const ALL_SOURCES = [...ROWS.flatMap((r) => r.cells), ...TRAINERS.map((t) => t.src)].filter((s): s is Source => s !== null)
const SET_COUNTS = SETS.map((set) => ({ set, count: ALL_SOURCES.filter((s) => s.set === set).length })).filter((s) => s.count > 0)

const sourceLabel = (s: Source) => (s.set?.endsWith('Promos') ? `${s.no}` : `${s.set} ${s.no}`)

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
    q: 'When was Gem Vol 2 released?',
    a: 'May 16, 2025, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Are Gem 2 cards reprints?',
    a: 'The art mostly is. 40 of the 44 illustrations we traced are the same art you will find on English cards, mostly from Sword & Shield sets and promos. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
    link: { to: '/sets/chinese/gem-vol-2', before: 'See every card on the ', label: 'Gem Vol 2 card list', after: '.' },
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 2?',
    a: 'Four: the full arts of Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15, all by HYOGONOSUKE. They are the only new illustrations in Gem Vol 2, and none of them are on an earlier English card.',
  },
  {
    q: 'Are the VMAX the same as Evolving Skies?',
    a: 'Eight of them use the same art as the Evolving Skies VMAX. Eevee VMAX uses the art from an English Black Star Promo instead.',
  },
  {
    q: 'Where does Penny come from?',
    a: 'Penny reuses the Special Illustration Rare art by aspara from Paldean Fates, the only Scarlet & Violet illustration in Gem Vol 2.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-2-card-origins')({
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
  component: GemVol2OriginsPost,
})

function SourceCell({ s }: { s: Source | null }) {
  if (!s) return <td className="cell-none">None in this set</td>
  return (
    <td>
      {s.set ? sourceLabel(s) : 'Chinese Exclusive'}
      <span className="cell-sub">Illus. {s.illus}</span>
    </td>
  )
}

function GemVol2OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 2 uses Eevee art you have already seen on an English card. We matched all 44 illustrations to their English source, and four are Chinese Exclusives."
        cta={{
          heading: 'Explore Gem Vol 2',
          body: 'See every card in the set, or read our set guide for every V, VMAX and full art in one place.',
          links: [
            { to: '/sets/chinese/gem-vol-2', label: 'See the full card list' },
            { to: '/blog/gem-vol-2-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse illustrations from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo patterns.
          We matched every illustration in Gem Vol 2 (Gem 2, set code CBB2C) to the English card it came from. The only exceptions are the four Chinese Exclusive
          full arts by HYOGONOSUKE.
          For more on the set itself, see our <Link to="/blog/gem-vol-2-release-news">Gem Vol 2 release post</Link> and the{' '}
          <Link to="/blog/gem-vol-2-set-guide">Gem Vol 2 set guide</Link>.
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
          Each of the nine Pokémon in Gem Vol 2 has up to five illustrations: two base cards (A on the odd versions from 01 to 11, B on the
          even ones), the Pokémon V, the VMAX, and for Eevee, Umbreon, Leafeon and Sylveon a full art. The four Trainer cards reuse
          English art too. We left out the basic Energy cards.
        </p>
        <p>
          That adds up to 44 illustrations. 40 of them come from English cards. The other four are the Chinese Exclusive full arts by HYOGONOSUKE,
          which were drawn for Gem Vol 2 and have no earlier version.
        </p>
        <ul className="card-grid cols-4">
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%202/Cards/0115.webp`}
                alt="Eevee 0115/15 Chinese Exclusive full art, Gem Vol 2"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Eevee 0115/15</strong>
                Full art · Illus. HYOGONOSUKE
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%202/Cards/0615.webp`}
                alt="Umbreon 0615/15 Chinese Exclusive full art, Gem Vol 2"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Umbreon 0615/15</strong>
                Full art · Illus. HYOGONOSUKE
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%202/Cards/0715.webp`}
                alt="Leafeon 0715/15 Chinese Exclusive full art, Gem Vol 2"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Leafeon 0715/15</strong>
                Full art · Illus. HYOGONOSUKE
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%202/Cards/0915.webp`}
                alt="Sylveon 0915/15 Chinese Exclusive full art, Gem Vol 2"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Sylveon 0915/15</strong>
                Full art · Illus. HYOGONOSUKE
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Unlike later Gem Packs, almost none of it is Scarlet & Violet art. It comes from Sword & Shield sets and promos, a few older Sun & Moon cards, and one Paldean Fates Trainer, listed in release order:</p>
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
        <p className="table-note">Counts include the four Trainer cards. The four Chinese Exclusive full arts have no English version, so the column adds up to 40.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Four full arts are Chinese Exclusives.</strong> Eevee, Umbreon, Leafeon and Sylveon each get a brand-new full art by HYOGONOSUKE, and together they form one forest scene.
          </li>
          <li>
            <strong>Promos supply the most.</strong> 13 illustrations come from English Sword & Shield Black Star Promos, including Eevee V, Eevee VMAX and the Vaporeon, Jolteon and Flareon V.
          </li>
          <li>
            <strong>Evolving Skies covers the VMAX.</strong> Eight of the nine VMAX reuse their Evolving Skies art. Only Eevee VMAX is a promo.
          </li>
          <li>
            <strong>Some base art is older still.</strong> Espeon and Umbreon base card A come from Sun & Moon Lost Thunder, and Sylveon base card A from Cosmic Eclipse.
          </li>
          <li>
            <strong>Leafeon V and Glaceon V are from Crown Zenith.</strong> Evolving Skies has its own Leafeon V and Glaceon V, but these use the Crown Zenith art.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>Every Gem Vol 2 Pokémon, with the English card behind each of its illustrations and the illustrator credited on it.</p>
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
        <p className="table-note">Card numbers are the first English printing.</p>

        <h2 id="trainers">Trainer cards</h2>
        <p>The four Trainer cards reuse English art as well. Penny is aspara's Special Illustration Rare art from Paldean Fates, the only Scarlet & Violet illustration in the set.</p>
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
