import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'

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
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are Gem Vol 2 cards reprints?',
    a: 'The art mostly is. 40 of the 44 artworks we traced are the same art you will find on English cards, mostly from Sword & Shield sets and promos. The cards are still new: Simplified Chinese text, their own numbers, their own foils and the Gem Pack set code.',
  },
  {
    q: 'Is any Gem Vol 2 artwork new?',
    a: 'Yes, four: the forest full arts of Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15 and Sylveon 0915/15, all by HYOGONOSUKE. None of them are on an earlier English card.',
  },
  {
    q: 'Are the VMAX the same as Evolving Skies?',
    a: 'Eight of them use the same art as the Evolving Skies VMAX. Eevee VMAX uses the art from an English Black Star Promo instead.',
  },
  {
    q: 'Where does Penny come from?',
    a: 'Penny reuses the Special Illustration Rare art by aspara from Paldean Fates, the only Scarlet & Violet artwork in Gem Vol 2.',
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-2-card-origins')({
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
  component: GemVol2OriginsPost,
})

function SourceCell({ s }: { s: Source | null }) {
  if (!s) return <td className="cell-none">None in this set</td>
  return (
    <td>
      {s.set ? sourceLabel(s) : 'New for Gem Vol 2'}
      <span className="cell-sub">Illus. {s.illus}</span>
    </td>
  )
}

function GemVol2OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 2 uses Eevee art you have already seen on an English card. Here is which one, for every card in the set."
        cta={{
          heading: 'Explore Gem Vol 2',
          body: 'See every card in the set, or read our set guide for every V, VMAX and full art in one place.',
          links: [
            { to: '/sets/gem-vol-2', label: 'Browse the card list' },
            { to: '/blogs/news/gem-vol-2-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse artwork from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new foils.
          We matched every artwork in Gem Vol 2 to the English card it came from.
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
          Each of the nine Pokémon in Gem Vol 2 has up to five artworks: two base cards (A on the odd versions from 01 to 11, B on the
          even ones), the Pokémon V, the VMAX, and for Eevee, Umbreon, Leafeon and Sylveon a full art. The four Trainer cards reuse
          English art too. We left out the basic Energy cards.
        </p>
        <p>
          That adds up to 44 artworks. 40 of them come from English cards. The other four are the forest full arts by HYOGONOSUKE,
          which were drawn for Gem Vol 2 and have no earlier version.
        </p>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Unlike later Gem Packs, almost none of it is Scarlet & Violet art. It comes from Sword & Shield sets and promos, a few older Sun & Moon cards, and one Paldean Fates Trainer, listed in release order:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">English source</th>
                <th scope="col">Artworks</th>
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
        <p className="table-note">Counts include the four Trainer cards. The four forest full arts are new, so the column adds up to 40.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Promos supply the most.</strong> 13 artworks come from English Sword & Shield Black Star Promos, including Eevee V, Eevee VMAX and the Vaporeon, Jolteon and Flareon V.
          </li>
          <li>
            <strong>Evolving Skies covers the VMAX.</strong> Eight of the nine VMAX reuse their Evolving Skies art. Only Eevee VMAX is a promo.
          </li>
          <li>
            <strong>Some base art is older still.</strong> Espeon and Umbreon base card A come from Sun & Moon Lost Thunder, and Sylveon base card A from Cosmic Eclipse.
          </li>
          <li>
            <strong>Leafeon V and Glaceon V are from Crown Zenith.</strong> Both use the Crown Zenith art rather than an Evolving Skies card.
          </li>
          <li>
            <strong>The forest four are the new part.</strong> Eevee, Umbreon, Leafeon and Sylveon each get a brand-new full art by HYOGONOSUKE, and together they form one forest scene.
          </li>
        </ul>

        <h2 id="full-map">The full card-by-card map</h2>
        <p>Every Gem Vol 2 Pokémon, with the English card behind each of its artworks and the illustrator credited on it.</p>
        <div className="table-scroll table-wide">
          <table className="data-table origins-table origins-wide">
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
        <p>The four Trainer cards reuse English art as well. Penny is aspara's Special Illustration Rare art from Paldean Fates, the only Scarlet & Violet artwork in the set.</p>
        <div className="table-scroll">
          <table className="data-table origins-table">
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

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          Lots of Pokémon have several cards by different artists, so a name match isn't enough. We matched each Gem card to its
          English original by the illustrator printed on the card, and when two cards were close, we put them side by side.
        </p>
        <p>
          For more on the set itself, see our <Link to="/blogs/news/gem-vol-2-has-arrived">Gem Vol 2 release post</Link> and the{' '}
          <Link to="/blogs/news/gem-vol-2-set-guide">Gem Vol 2 set guide</Link>.
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
