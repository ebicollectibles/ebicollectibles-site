import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-7-card-origins')!

// English sources the Gem Vol 7 artwork comes from.
const SETS = ['Journey Together', 'Destined Rivals', 'Black Star Promos'] as const
type SetName = (typeof SETS)[number]

type Source = { set: SetName; no: string; illus: string }

// For each Gem Vol 7 Pokémon: the English card its regular art (versions
// 01 to 06) reprints, and the English card its full art (version 07)
// reprints. Each row was matched on Pokémon name plus the illustrator
// printed on the Gem card, then checked against Limitless TCG and TCGdex.
// Misty's Psyduck's full art (0307/07) is new to Gem Vol 7, so it has no source.
const ORIGINS: Array<{ pp: string; name: string; regular: Source; full: Source | null }> = [
  { pp: '01', name: "Team Rocket's Raticate", regular: { set: 'Destined Rivals', no: '148/182', illus: 'Uninori' }, full: { set: 'Destined Rivals', no: '202/182', illus: 'Mékayu' } },
  { pp: '02', name: "Team Rocket's Meowth", regular: { set: 'Destined Rivals', no: '149/182', illus: 'Megumi Mizutani' }, full: { set: 'Destined Rivals', no: '203/182', illus: 'Shimaris Yukichi' } },
  { pp: '03', name: "Misty's Psyduck", regular: { set: 'Destined Rivals', no: '045/182', illus: 'Yuu Nishida' }, full: null },
  { pp: '04', name: 'Rapidash', regular: { set: 'Destined Rivals', no: '030/182', illus: 'SIE NANAHARA' }, full: { set: 'Destined Rivals', no: '189/182', illus: 'Rond' } },
  { pp: '05', name: "Team Rocket's Weezing", regular: { set: 'Destined Rivals', no: '126/182', illus: 'matazo' }, full: { set: 'Destined Rivals', no: '199/182', illus: 'Yukihiro Tada' } },
  { pp: '06', name: "Misty's Lapras", regular: { set: 'Destined Rivals', no: '050/182', illus: 'En Morikura' }, full: { set: 'Destined Rivals', no: '194/182', illus: 'Orca' } },
  { pp: '07', name: "Ethan's Typhlosion", regular: { set: 'Destined Rivals', no: '034/182', illus: 'danciao' }, full: { set: 'Destined Rivals', no: '190/182', illus: 'GIDORA' } },
  { pp: '08', name: 'Furret', regular: { set: 'Journey Together', no: '119/159', illus: 'Tomomi Ozaki' }, full: { set: 'Journey Together', no: '168/159', illus: 'REND' } },
  { pp: '09', name: "Team Rocket's Murkrow", regular: { set: 'Destined Rivals', no: '127/182', illus: 'Mugi Hamada' }, full: { set: 'Destined Rivals', no: '200/182', illus: 'Akira Komayama' } },
  { pp: '10', name: "Team Rocket's Wobbuffet", regular: { set: 'Destined Rivals', no: '082/182', illus: 'Kazumasa Yasukuni' }, full: { set: 'Black Star Promos', no: 'SVP 203', illus: 'Saboteri' } },
  { pp: '11', name: 'Swinub', regular: { set: 'Journey Together', no: '077/159', illus: 'REND' }, full: { set: 'Journey Together', no: '165/159', illus: 'Nakamura Ippan' } },
  { pp: '12', name: "Team Rocket's Houndoom", regular: { set: 'Destined Rivals', no: '038/182', illus: 'Anesaki Dynamic' }, full: { set: 'Destined Rivals', no: '191/182', illus: 'nagimiso' } },
  { pp: '13', name: 'Blaziken', regular: { set: 'Destined Rivals', no: '042/182', illus: 'Kazumasa Yasukuni' }, full: { set: 'Destined Rivals', no: '192/182', illus: 'kodama' } },
  { pp: '14', name: 'Clamperl', regular: { set: 'Destined Rivals', no: '054/182', illus: 'Miki Tanaka' }, full: { set: 'Destined Rivals', no: '195/182', illus: 'Mori Yuu' } },
  { pp: '15', name: "Steven's Beldum", regular: { set: 'Destined Rivals', no: '143/182', illus: 'Takeshi Nakamura' }, full: { set: 'Black Star Promos', no: 'SVP 207', illus: 'hncl' } },
  { pp: '16', name: "Cynthia's Roserade", regular: { set: 'Destined Rivals', no: '008/182', illus: 'En Morikura' }, full: { set: 'Destined Rivals', no: '184/182', illus: 'rika' } },
  { pp: '17', name: 'Shaymin', regular: { set: 'Destined Rivals', no: '010/182', illus: 'tono' }, full: { set: 'Destined Rivals', no: '185/182', illus: 'Heisuke Kitazawa' } },
  { pp: '18', name: 'Crustle', regular: { set: 'Destined Rivals', no: '012/182', illus: 'Po-Suzuki' }, full: { set: 'Destined Rivals', no: '186/182', illus: 'Takumi Wada' } },
  { pp: '19', name: "N's Zorua", regular: { set: 'Journey Together', no: '097/159', illus: 'Jiro Sasumo' }, full: { set: 'Black Star Promos', no: 'SVP 189', illus: 'Megumi Mizutani' } },
  { pp: '20', name: "Lillie's Ribombee", regular: { set: 'Journey Together', no: '067/159', illus: 'mashu' }, full: { set: 'Journey Together', no: '164/159', illus: 'saino misaki' } },
  { pp: '21', name: 'Lycanroc', regular: { set: 'Journey Together', no: '085/159', illus: 'Shiburingaru' }, full: { set: 'Journey Together', no: '166/159', illus: 'GIDORA' } },
  { pp: '22', name: "Arven's Greedent", regular: { set: 'Destined Rivals', no: '159/182', illus: 'Akira Komayama' }, full: { set: 'Destined Rivals', no: '205/182', illus: 'Natsumi Yoshida' } },
  { pp: '23', name: "Team Rocket's Orbeetle", regular: { set: 'Destined Rivals', no: '089/182', illus: 'Shin Nagasawa' }, full: { set: 'Destined Rivals', no: '198/182', illus: 'HYOGONOSUKE' } },
  { pp: '24', name: "Hop's Wooloo", regular: { set: 'Journey Together', no: '135/159', illus: 'Tomomi Ozaki' }, full: { set: 'Journey Together', no: '170/159', illus: 'MINAMINAMI Take' } },
  { pp: '25', name: "Marnie's Morpeko", regular: { set: 'Destined Rivals', no: '137/182', illus: 'Mina Nakai' }, full: { set: 'Black Star Promos', no: 'SVP 206', illus: 'Susumu Maeya' } },
  { pp: '26', name: "Team Rocket's Spidops", regular: { set: 'Destined Rivals', no: '020/182', illus: 'Taiga Kasai' }, full: { set: 'Destined Rivals', no: '187/182', illus: 'NC Empire' } },
  { pp: '27', name: "Iono's Kilowattrel", regular: { set: 'Journey Together', no: '055/159', illus: 'chibi' }, full: { set: 'Journey Together', no: '163/159', illus: 'Terada Tera' } },
  { pp: '28', name: 'Hydrapple', regular: { set: 'Destined Rivals', no: '018/182', illus: 'Anesaki Dynamic' }, full: { set: 'Destined Rivals', no: '188/182', illus: 'Jerky' } },
]

const SET_COUNTS = SETS.map((set) => ({
  set,
  regular: ORIGINS.filter((o) => o.regular.set === set).length,
  full: ORIGINS.filter((o) => o.full?.set === set).length,
}))

const TOC = [
  { id: 'how-it-works', label: 'How Gem Pack art works' },
  { id: 'by-set', label: 'Which sets it comes from' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'full-map', label: 'The full card-by-card map' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are Gem 7 cards reprints?',
    a: 'The art mostly is. 55 of the 56 artworks are the same art you will find on English Scarlet & Violet cards, mostly from Destined Rivals. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: "Misty's Psyduck's full art, 0307/07 by Cona Nitanda. It is the only new artwork in Gem Vol 7 and is not on any earlier English card, which lines up with Pokémon China calling it new.",
  },
  {
    q: 'Which English set does most of Gem Vol 7 come from?',
    a: 'Destined Rivals. It supplies the regular art for 21 of the 28 Pokémon and 17 of the full arts. Journey Together covers the rest, along with four Black Star Promos.',
  },
  {
    q: 'Why do some Gem Vol 7 full arts trace to promos?',
    a: "Four of them, Team Rocket's Wobbuffet, Steven's Beldum, N's Zorua and Marnie's Morpeko, use art from English Black Star Promos instead of set Illustration Rares.",
  },
]

export const Route = createFileRoute('/blog/gem-vol-7-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title.replace('Gem Vol 7', 'Gem Vol 7 (Gem 7)')} | EBI Collectibles` },
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
  component: GemVol7OriginsPost,
})

function GemVol7OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 7 uses art you have already seen on an English Scarlet & Violet card. Here is which one, for every card in the set."
        cta={{
          heading: 'Explore Gem Vol 7',
          body: 'See every card in the set, or read our release post for the Psyduck full art and the Trainer lineup.',
          links: [
            { to: '/sets/chinese/gem-vol-7', label: 'Browse the card list' },
            { to: '/blog/gem-vol-7-release-news', label: 'Read the release post', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse artwork from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo patterns.
          We matched every artwork in Gem Vol 7 (Gem 7) to the English card it came from. The one exception is the Chinese Exclusive
          Misty's Psyduck full art, which has no English version.
          For more on the set itself, see our <Link to="/blog/gem-vol-7-release-news">Gem Vol 7 release post</Link>, and for the
          previous volume, our <Link to="/blog/gem-vol-6-card-origins">Gem Vol 6 card origins guide</Link>.
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
          Each of the 28 Pokémon in Gem Vol 7 has two illustrations. Versions 01 to 06 all use the art from that Pokémon's regular
          card, and version 07, the full art, uses the art from its full-art English card. So most Gem Pokémon reprint two English
          cards, a regular one and a full art.
        </p>
        <p>
          That adds up to 56 illustrations. 55 of them come from English cards. The 56th, the Chinese Exclusive Misty's Psyduck beach full art
          (0307/07), was drawn for Gem Vol 7 and has no earlier version.
        </p>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Everything traces back to two English Scarlet & Violet sets from 2025, plus the Black Star Promos:</p>
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
        <p className="table-note">Counts are Gem Vol 7 Pokémon. Psyduck's full art is a Chinese Exclusive, so the full-art column adds up to 27.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Misty's Psyduck is the only new art.</strong> Its regular art comes from Destined Rivals like most of the set, but
            its full art is a brand-new Chinese Exclusive.
          </li>
          <li>
            <strong>Destined Rivals supplies the most.</strong> It supplies the regular art for 21 Pokémon, including all eight
            Team Rocket cards, and 17 of the full arts.
          </li>
          <li>
            <strong>Journey Together has the rest of the regular art.</strong> Furret, Swinub, N's Zorua, Lillie's Ribombee,
            Lycanroc, Hop's Wooloo and Iono's Kilowattrel all come from it.
          </li>
          <li>
            <strong>Four full arts come from promos.</strong> Team Rocket's Wobbuffet, Steven's Beldum, N's Zorua and Marnie's
            Morpeko reprint English Black Star Promo art, so their Gem full arts pair a set card with a promo.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>
          Every Gem Vol 7 Pokémon, with the English card behind its regular art (versions 01 to 06) and behind its full art (version
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
                <tr key={o.pp} className={o.full ? undefined : 'is-current'}>
                  <th scope="row">{o.pp}</th>
                  <td>{o.name}</td>
                  <td>
                    {o.regular.set} {o.regular.no}
                    <span className="cell-sub">Illus. {o.regular.illus}</span>
                  </td>
                  <td>
                    {o.full ? (
                      <>
                        {o.full.set === 'Black Star Promos' ? o.full.no : `${o.full.set} ${o.full.no}`}
                        <span className="cell-sub">Illus. {o.full.illus}</span>
                      </>
                    ) : (
                      <>
                        Chinese Exclusive
                        <span className="cell-sub">Illus. Cona Nitanda</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Card numbers are the first English printing. SVP numbers are Scarlet & Violet Black Star Promos.</p>
        <p>
          A few of these illustrations were reprinted again later in English, for example Team Rocket's Meowth, N's Zorua and Iono's
          Kilowattrel in Ascended Heroes. The table lists where each one appeared first.
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
