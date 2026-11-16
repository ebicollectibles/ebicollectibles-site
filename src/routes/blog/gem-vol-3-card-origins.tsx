import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-3-card-origins')!

// English sources the Gem Vol 3 artwork comes from, in release order.
const SETS = ['Lost Origin', 'Silver Tempest', 'Scarlet & Violet', 'Paldea Evolved', 'Obsidian Flames', '151', 'Paradox Rift', 'Paldean Fates', 'SV Black Star Promos'] as const
type SetName = (typeof SETS)[number]

// A null set means new art with no earlier printing. A null cell means the
// Pokémon has no card of that kind in this set.
type Source = { set: SetName | null; no: string | null; illus: string }

const COLUMNS = ['Regular art (01 to 06)', 'Version 07']

// Each artwork was matched on card name plus the illustrator printed on the
// Gem card, then checked against Limitless TCG and TCGdex.
const ROWS: Array<{ pp: string; name: string; cells: Array<Source | null> }> = [
  { pp: '01', name: 'Clefable', cells: [{ set: '151', no: '036/165', illus: 'ryoma uratsuka' }, { set: 'Obsidian Flames', no: '082/197', illus: 'Satoshi Shirai' }] },
  { pp: '02', name: 'Meowth', cells: [{ set: '151', no: '052/165', illus: 'Naoki Saito' }, { set: null, no: null, illus: 'Makura Tami' }] },
  { pp: '03', name: 'Gengar', cells: [{ set: 'Paldean Fates', no: '057/091', illus: 'Nelnal' }, { set: null, no: null, illus: 'aspara' }] },
  { pp: '04', name: 'Cubone', cells: [{ set: '151', no: '104/165', illus: 'Shinya Komatsu' }, { set: null, no: null, illus: 'Katsunori Sato' }] },
  { pp: '05', name: 'Houndoom', cells: [{ set: 'Scarlet & Violet', no: '034/198', illus: 'hncl' }, { set: 'Obsidian Flames', no: '134/197', illus: 'PLANETA Tsuji' }] },
  { pp: '06', name: 'Gardevoir', cells: [{ set: 'Silver Tempest', no: '069/195', illus: 'Mitsuhiro Arita' }, { set: 'Scarlet & Violet', no: '086/198', illus: 'N-DESIGN Inc.' }] },
  { pp: '07', name: 'Banette', cells: [{ set: 'Lost Origin', no: '073/196', illus: 'Kagemaru Himeno' }, { set: 'Scarlet & Violet', no: '088/198', illus: 'PLANETA Mochizuki' }] },
  { pp: '08', name: 'Absol', cells: [{ set: 'Paradox Rift', no: '113/182', illus: 'Shinji Kanda' }, { set: 'Obsidian Flames', no: '135/197', illus: 'Nisota Niso' }] },
  { pp: '09', name: 'Mismagius', cells: [{ set: 'Paldea Evolved', no: '088/193', illus: 'Atsushi Furusawa' }, { set: 'Paldea Evolved', no: '212/193', illus: 'aoki' }] },
  { pp: '10', name: 'Darkrai', cells: [{ set: 'Obsidian Flames', no: '136/197', illus: 'Bun Toujo' }, { set: 'SV Black Star Promos', no: 'SVP 110', illus: '5ban Graphics' }] },
  { pp: '11', name: 'Chandelure', cells: [{ set: 'Obsidian Flames', no: '038/197', illus: 'Haru Akasaka' }, { set: null, no: null, illus: 'satoma' }] },
  { pp: '12', name: 'Lycanroc', cells: [{ set: 'Obsidian Flames', no: '117/197', illus: 'Mitsuhiro Arita' }, { set: 'Paldea Evolved', no: '117/193', illus: 'kawayoo' }] },
  { pp: '13', name: 'Mimikyu', cells: [{ set: 'Paldea Evolved', no: '097/193', illus: 'Kagemaru Himeno' }, { set: 'SV Black Star Promos', no: 'SVP 075', illus: 'Mitsuhiro Arita' }] },
  { pp: '14', name: 'Morpeko', cells: [{ set: 'Paradox Rift', no: '121/182', illus: 'Cona Nitanda' }, { set: 'Paradox Rift', no: '206/182', illus: 'Yuu Nishida' }] },
  { pp: '15', name: 'Ceruledge', cells: [{ set: 'Paldea Evolved', no: '098/193', illus: 'Ryota Murayama' }, { set: null, no: null, illus: 'kodama' }] },
  { pp: '16', name: 'Greavard', cells: [{ set: 'Scarlet & Violet', no: '104/198', illus: 'yuu' }, { set: 'Scarlet & Violet', no: '214/198', illus: 'sowsow' }] },
  { pp: '17', name: 'Houndstone', cells: [{ set: 'Obsidian Flames', no: '101/197', illus: 'Saya Tsuruta' }, { set: 'Obsidian Flames', no: '102/197', illus: '5ban Graphics' }] },
  { pp: '18', name: 'Annihilape', cells: [{ set: 'Scarlet & Violet', no: '109/198', illus: 'Anesaki Dynamic' }, { set: 'SV Black Star Promos', no: 'SVP 032', illus: 'PLANETA Hiiragi' }] },
]

const TRAINERS: Array<{ no: string; name: string; src: Source }> = [
  { no: '1901/04', name: 'Super Rod', src: { set: 'Paldea Evolved', no: '188/193', illus: 'Toyste Beach' } },
  { no: '1902/04', name: 'Nest Ball', src: { set: 'Scarlet & Violet', no: '181/198', illus: 'Toyste Beach' } },
  { no: '1903/04', name: 'Switch', src: { set: 'Scarlet & Violet', no: '194/198', illus: 'Studio Bora Inc.' } },
  { no: '1904/04', name: 'Arven', src: { set: 'Paldean Fates', no: '235/091', illus: 'aspara' } },
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
    q: 'Are Gem 3 cards reprints?',
    a: 'The art mostly is. 35 of the 40 artworks we traced are the same art you will find on English cards, mostly 2023 Scarlet & Violet sets. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
  },
  {
    q: 'Which cards are Chinese Exclusives?',
    a: 'Five full arts: Meowth 0207/07, Gengar 0307/07, Cubone 0407/07, Chandelure 1107/07 and Ceruledge 1507/07. They are the only new artwork in Gem Vol 3, and none of them are on an earlier English card.',
  },
  {
    q: 'Which English set does most of Gem Vol 3 come from?',
    a: 'Obsidian Flames and the base Scarlet & Violet set, with eight artworks each.',
  },
  {
    q: 'Why do some Gem Vol 3 cards have a different regulation mark?',
    a: 'Gardevoir and Banette reuse Sword & Shield art from Silver Tempest and Lost Origin, so their versions 01 to 06 keep mark F. Darkrai ex carries mark H, matching its English promo.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-3-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title.replace('Gem Vol 3', 'Gem Vol 3 (Gem 3)')} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
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
  component: GemVol3OriginsPost,
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

function GemVol3OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 3 uses art you have already seen on an English card. Here is which one, for every Pokémon and Trainer in the set."
        cta={{
          heading: 'Explore Gem Vol 3',
          body: 'See every card in the set, or read our set guide for every full art and ex in one place.',
          links: [
            { to: '/sets/chinese/gem-vol-3', label: 'Browse the card list' },
            { to: '/blog/gem-vol-3-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse artwork from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo patterns.
          We matched every artwork in Gem Vol 3 (Gem 3) to the English card it came from, except the five Chinese Exclusive full arts,
          which have no English version at all.
          For more on the set itself, see our <Link to="/blog/gem-vol-3-release-news">Gem Vol 3 release post</Link> and the{' '}
          <Link to="/blog/gem-vol-3-set-guide">Gem Vol 3 set guide</Link>.
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
          Each of the 18 Pokémon in Gem Vol 3 has two artworks. Versions 01 to 06 share the art from that Pokémon's regular card. Version
          07 is either a full art or a Pokémon ex, and it reuses the art from the matching English card. The four Trainer cards reuse
          English art too. We left out the basic and Luminous Energy cards.
        </p>
        <p>
          That adds up to 40 artworks. 35 of them come from English cards. The other five are the Chinese Exclusive full arts of Meowth,
          Gengar, Cubone, Chandelure and Ceruledge, which were drawn for Gem Vol 3 and have no earlier version.
        </p>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>It comes mostly from 2023's English Scarlet & Violet sets, plus two Sword & Shield cards and three Black Star Promos, listed in release order:</p>
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
        <p className="table-note">Counts include the four Trainer cards. The five Chinese Exclusive full arts have no English version, so the column adds up to 35.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Five full arts are Chinese Exclusives.</strong> Meowth, Gengar, Cubone, Chandelure and Ceruledge keep regular art from English sets but get brand-new full arts. aspara, who drew the Gengar full art, also drew the Arven Trainer.
          </li>
          <li>
            <strong>2023 sets do most of the work.</strong> Obsidian Flames and the base Scarlet & Violet set supply eight artworks each, with Paldea Evolved close behind on six.
          </li>
          <li>
            <strong>Two artworks are from Sword & Shield.</strong> Gardevoir comes from Silver Tempest and Banette from Lost Origin, which is why their versions 01 to 06 carry regulation mark F instead of G.
          </li>
          <li>
            <strong>Three 07 cards are promos.</strong> Darkrai ex, the Mimikyu full art and Annihilape ex reuse art from English Black Star Promos.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>Every Gem Vol 3 Pokémon, with the English card behind its regular art (versions 01 to 06) and behind its version 07 full art or Pokémon ex, plus the illustrator credited on both.</p>
        <div className="table-scroll">
          <table className="data-table origins-table">
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
        <p>The four Trainer cards reuse English art as well. Arven is aspara's Special Illustration Rare art from Paldean Fates.</p>
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
