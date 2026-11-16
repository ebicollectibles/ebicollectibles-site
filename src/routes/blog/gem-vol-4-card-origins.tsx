import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-4-card-origins')!

// English sources the Gem Vol 4 artwork comes from, in release order.
const SETS = ['Temporal Forces', 'Twilight Masquerade', 'Journey Together', 'Destined Rivals', 'Phantasmal Flames', 'Black Star Promos'] as const
type SetName = (typeof SETS)[number]

// A null set means the artwork is new to Gem Vol 4, with no earlier printing.
type Source = { set: SetName | null; no: string | null; illus: string }

// For each Gem Vol 4 Pokémon: the English card its regular art (versions
// 01 to 06) reprints, and the English card its full art (version 07)
// reprints. Each row was matched on Pokémon name plus the illustrator
// printed on the Gem card, then checked against Limitless TCG and TCGdex.
const ORIGINS: Array<{ pp: string; name: string; regular: Source; full: Source }> = [
  { pp: '01', name: 'Ponyta', regular: { set: 'Destined Rivals', no: '029/182', illus: 'Ayako Ozaki' }, full: { set: null, no: null, illus: 'MINAMINAMI Take' } },
  { pp: '02', name: 'Lickitung', regular: { set: 'Temporal Forces', no: '124/162', illus: 'nisimono' }, full: { set: 'Temporal Forces', no: '180/162', illus: 'Orca' } },
  { pp: '03', name: 'Pinsir', regular: { set: 'Twilight Masquerade', no: '003/167', illus: 'HYOGONOSUKE' }, full: { set: 'Twilight Masquerade', no: '168/167', illus: 'Yukihiro Tada' } },
  { pp: '04', name: 'Eevee', regular: { set: 'Twilight Masquerade', no: '135/167', illus: 'satoma' }, full: { set: 'Twilight Masquerade', no: '188/167', illus: 'Narumi Sato' } },
  { pp: '05', name: 'Paldean Wooper', regular: { set: 'Journey Together', no: '093/159', illus: 'Lee HyunJung' }, full: { set: 'Phantasmal Flames', no: '102/094', illus: 'OKACHEKE' } },
  { pp: '06', name: 'Torkoal', regular: { set: 'Twilight Masquerade', no: '030/167', illus: 'Teeziro' }, full: { set: 'Twilight Masquerade', no: '172/167', illus: 'Masa' } },
  { pp: '07', name: 'Relicanth', regular: { set: 'Temporal Forces', no: '084/162', illus: 'Mina Nakai' }, full: { set: 'Temporal Forces', no: '173/162', illus: 'Mitsuhiro Arita' } },
  { pp: '08', name: 'Grotle', regular: { set: 'Temporal Forces', no: '011/162', illus: 'Uninori' }, full: { set: 'Temporal Forces', no: '164/162', illus: 'Oswaldo KATO' } },
  { pp: '09', name: 'Infernape', regular: { set: 'Twilight Masquerade', no: '033/167', illus: 'Takumi Wada' }, full: { set: 'Twilight Masquerade', no: '173/167', illus: 'Krgc' } },
  { pp: '10', name: 'Chatot', regular: { set: 'Temporal Forces', no: '132/162', illus: 'GOTO minori' }, full: { set: 'Temporal Forces', no: '181/162', illus: 'Scav' } },
  { pp: '11', name: 'Probopass', regular: { set: 'Twilight Masquerade', no: '102/167', illus: 'OKUBO' }, full: { set: 'Twilight Masquerade', no: '182/167', illus: 'Kariya' } },
  { pp: '12', name: 'Froslass', regular: { set: 'Twilight Masquerade', no: '053/167', illus: 'Makura Tami' }, full: { set: 'Twilight Masquerade', no: '174/167', illus: 'matazo' } },
  { pp: '13', name: 'Phione', regular: { set: 'Twilight Masquerade', no: '055/167', illus: 'aspara' }, full: { set: 'Twilight Masquerade', no: '175/167', illus: 'takashi shiraishi' } },
  { pp: '14', name: 'Excadrill', regular: { set: 'Temporal Forces', no: '086/162', illus: 'Bun Toujo' }, full: { set: 'Temporal Forces', no: '174/162', illus: 'Saboteri' } },
  { pp: '15', name: 'Minccino', regular: { set: 'Temporal Forces', no: '136/162', illus: 'Yuka Morii' }, full: { set: 'Temporal Forces', no: '182/162', illus: 'Shibuzoh.' } },
  { pp: '16', name: 'Cinccino', regular: { set: 'Temporal Forces', no: '137/162', illus: 'Yuu Nishida' }, full: { set: 'Temporal Forces', no: '183/162', illus: 'Shibuzoh.' } },
  { pp: '17', name: 'Deerling', regular: { set: 'Temporal Forces', no: '016/162', illus: 'Rond' }, full: { set: 'Temporal Forces', no: '165/162', illus: 'Susumu Maeya' } },
  { pp: '18', name: 'Sawsbuck', regular: { set: 'Temporal Forces', no: '017/162', illus: 'Akira Komayama' }, full: { set: 'Temporal Forces', no: '166/162', illus: 'Susumu Maeya' } },
  { pp: '19', name: 'Heliolisk', regular: { set: 'Twilight Masquerade', no: '071/167', illus: 'Atsuya Uki' }, full: { set: 'Twilight Masquerade', no: '177/167', illus: 'Tonji Matsuno' } },
  { pp: '20', name: 'Litten', regular: { set: 'Temporal Forces', no: '032/162', illus: 'REND' }, full: { set: 'Temporal Forces', no: '167/162', illus: 'Makura Tami' } },
  { pp: '21', name: 'Charjabug', regular: { set: 'Temporal Forces', no: '055/162', illus: 'Misa Tsutsui' }, full: { set: 'Temporal Forces', no: '169/162', illus: 'Mina Nakai' } },
  { pp: '22', name: 'Cutiefly', regular: { set: 'Temporal Forces', no: '075/162', illus: 'Sekio' }, full: { set: 'Temporal Forces', no: '172/162', illus: 'REND' } },
  { pp: '23', name: 'Mudsdale', regular: { set: 'Temporal Forces', no: '092/162', illus: 'Naoyo Kimura' }, full: { set: 'Temporal Forces', no: '175/162', illus: 'MINAMINAMI Take' } },
  { pp: '24', name: 'Meltan', regular: { set: 'Temporal Forces', no: '116/162', illus: 'Taiga Kayama' }, full: { set: 'Temporal Forces', no: '179/162', illus: 'Masa' } },
  { pp: '25', name: 'Cramorant', regular: { set: 'Twilight Masquerade', no: '058/167', illus: 'OKACHEKE' }, full: { set: 'Twilight Masquerade', no: '176/167', illus: 'Fujimoto Gold' } },
  { pp: '26', name: 'Snom', regular: { set: 'Temporal Forces', no: '045/162', illus: 'Orca' }, full: { set: 'Temporal Forces', no: '168/162', illus: 'N-DESIGN Inc.' } },
  { pp: '27', name: 'Enamorus', regular: { set: 'Twilight Masquerade', no: '093/167', illus: 'DOM' }, full: { set: 'Twilight Masquerade', no: '180/167', illus: 'GOTO minori' } },
  { pp: '28', name: 'Flutter Mane', regular: { set: 'Temporal Forces', no: '078/162', illus: 'kodama' }, full: { set: 'Black Star Promos', no: 'SVP 097', illus: 'Takumi Wada' } },
]

const SET_COUNTS = SETS.map((set) => ({
  set,
  regular: ORIGINS.filter((o) => o.regular.set === set).length,
  full: ORIGINS.filter((o) => o.full.set === set).length,
}))

const sourceLabel = (s: Source) => (s.set === 'Black Star Promos' ? s.no : `${s.set} ${s.no}`)

const TOC = [
  { id: 'how-it-works', label: 'How Gem Pack art works' },
  { id: 'by-set', label: 'Which sets it comes from' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'full-map', label: 'The full card-by-card map' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are Gem 4 cards reprints?',
    a: 'The art mostly is. 55 of the 56 illustrations are the same art you will find on English cards, mostly from Temporal Forces and Twilight Masquerade. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: 'Ponyta\'s full art, 0107/07 by MINAMINAMI Take. It is the only new illustration in Gem Vol 4 and is not on any earlier English card, which lines up with Pokémon China calling it new.',
  },
  {
    q: 'Which English set does most of Gem Vol 4 come from?',
    a: 'Temporal Forces. It supplies the regular art for 16 Pokémon and the full art for 15, more than any other set.',
  },
  {
    q: 'Why does Paldean Wooper\'s full art come from a newer set?',
    a: 'Its art first came out in English in Phantasmal Flames, a Mega Evolution set.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-4-card-origins')({
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
  component: GemVol4OriginsPost,
})

function GemVol4OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 4 uses art you have already seen on an English card. Here is which one, for every card in the set."
        cta={{
          heading: 'Explore Gem Vol 4',
          body: 'See every card in the set, or read our set guide for all 28 full arts and the box math.',
          links: [
            { to: '/sets/chinese/gem-vol-4', label: 'See the full card list' },
            { to: '/blog/gem-vol-4-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse illustrations from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo patterns.
          We matched every illustration in Gem Vol 4 (Gem 4) to the English card it came from. The one exception is the Chinese Exclusive
          Ponyta full art, which has no English version.
          For more on the set itself, see our <Link to="/blog/gem-vol-4-release-news">Gem Vol 4 release post</Link> and the{' '}
          <Link to="/blog/gem-vol-4-set-guide">Gem Vol 4 set guide</Link>.
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
          Each of the 28 Pokémon in Gem Vol 4 has two illustrations. Versions 01 to 06 all use the art from that Pokémon's regular
          card, and version 07, the full art, uses the art from its full-art English card. So most Gem Pokémon reprint two English
          cards, a regular one and a full art.
        </p>
        <p>
          That adds up to 56 illustrations. 55 of them come from English cards. The 56th, the Chinese Exclusive Ponyta full art (0107/07),
          was drawn for Gem Vol 4 and has no earlier version.
        </p>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Most of it comes from two English sets from the first half of 2024, Temporal Forces and Twilight Masquerade, plus a few later cards:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">English source</th>
                <th scope="col">Regular art</th>
                <th scope="col">Full arts</th>
              </tr>
            </thead>
            <tbody>
              {SET_COUNTS.map((s) => (
                <tr key={s.set}>
                  <th scope="row">{s.set}</th>
                  <td>{s.regular}</td>
                  <td>{s.full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Counts are Gem Vol 4 Pokémon. Ponyta's full art is a Chinese Exclusive, so the full-art column adds up to 27.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Ponyta stands out.</strong> Its regular art comes from Destined Rivals, the newest source of any regular art in the set, and its full art is a brand-new Chinese Exclusive.
          </li>
          <li>
            <strong>Temporal Forces supplies the most.</strong> It covers the regular art for 16 Pokémon and the full art for 15.
          </li>
          <li>
            <strong>Twilight Masquerade has almost all of the rest.</strong> It covers the regular art and the full art for 10 Pokémon each.
          </li>
          <li>
            <strong>Most pairs share a set.</strong> In 25 of the 27 Pokémon with a traced full art, the regular art and the full art come from the same English set.
          </li>
          <li>
            <strong>Two full arts break the pattern.</strong> Paldean Wooper's full art comes from Phantasmal Flames, a Mega Evolution set, and Flutter Mane's is a Black Star Promo.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>
          Every Gem Vol 4 Pokémon, with the English card behind its regular art (versions 01 to 06) and behind its full art (version
          07), plus the illustrator credited on both.
        </p>
        <div className="table-scroll">
          <table className="data-table origins-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pokémon</th>
                <th scope="col">Regular art (01 to 06)</th>
                <th scope="col">Full art (07)</th>
              </tr>
            </thead>
            <tbody>
              {ORIGINS.map((o) => (
                <tr key={o.pp} className={o.regular.set && o.full.set ? undefined : 'is-current'}>
                  <th scope="row">{o.pp}</th>
                  <td>{o.name}</td>
                  {[o.regular, o.full].map((s, i) => (
                    <td key={i}>
                      {s.set ? sourceLabel(s) : 'Chinese Exclusive'}
                      <span className="cell-sub">Illus. {s.illus}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Card numbers are the first English printing. SVP numbers are Scarlet & Violet Black Star Promos.</p>
        <p>
          A few of these illustrations were reprinted again later in English, for example Flutter Mane's regular art in Prismatic
          Evolutions and Charjabug's in Ascended Heroes. The table lists where each one appeared first.
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
