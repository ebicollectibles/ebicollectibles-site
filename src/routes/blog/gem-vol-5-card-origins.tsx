import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-5-card-origins')!

// English sources the Gem Vol 5 artwork comes from, in release order.
const SETS = ['Twilight Masquerade', 'Shrouded Fable', 'Stellar Crown', 'Surging Sparks', 'Journey Together', 'Black Star Promos'] as const
type SetName = (typeof SETS)[number]

// A null set means the artwork is new to Gem Vol 5, with no earlier printing.
type Source = { set: SetName | null; no: string | null; illus: string }

// For each Gem Vol 5 Pokémon: the English card its regular art (versions
// 01 to 06) reprints, and the English card its full art (version 07)
// reprints. Each row was matched on Pokémon name plus the illustrator
// printed on the Gem card, then checked against Limitless TCG and TCGdex.
const ORIGINS: Array<{ pp: string; name: string; regular: Source; full: Source }> = [
  { pp: '01', name: 'Captain Pikachu', regular: { set: null, no: null, illus: 'Miyuki Matsumoto' }, full: { set: null, no: null, illus: 'Keita Hagiwara' } },
  { pp: '02', name: 'Hisuian Growlithe', regular: { set: 'Twilight Masquerade', no: '099/167', illus: 'Whisker' }, full: { set: 'Twilight Masquerade', no: '181/167', illus: 'GIDORA' } },
  { pp: '03', name: 'Magneton', regular: { set: 'Surging Sparks', no: '059/191', illus: 'Nisota Niso' }, full: { set: 'Black Star Promos', no: 'SVP 159', illus: 'Shinji Kanda' } },
  { pp: '04', name: 'Chansey', regular: { set: 'Twilight Masquerade', no: '133/167', illus: 'HYOGONOSUKE' }, full: { set: 'Twilight Masquerade', no: '187/167', illus: 'Toshinao Aoki' } },
  { pp: '05', name: 'Horsea', regular: { set: 'Shrouded Fable', no: '010/064', illus: 'Shimaris Yukichi' }, full: { set: 'Shrouded Fable', no: '067/064', illus: 'Shinya Komatsu' } },
  { pp: '06', name: 'Sunflora', regular: { set: 'Twilight Masquerade', no: '007/167', illus: 'Ounishi' }, full: { set: 'Twilight Masquerade', no: '169/167', illus: 'Shinya Komatsu' } },
  { pp: '07', name: 'Skarmory', regular: { set: 'Surging Sparks', no: '124/191', illus: 'kawayoo' }, full: { set: 'Surging Sparks', no: '209/191', illus: 'Takumi Wada' } },
  { pp: '08', name: 'Houndoom', regular: { set: 'Shrouded Fable', no: '008/064', illus: 'burari' }, full: { set: 'Shrouded Fable', no: '066/064', illus: 'Taiga Kasai' } },
  { pp: '09', name: 'Phanpy', regular: { set: 'Surging Sparks', no: '102/191', illus: 'ryoma uratsuka' }, full: { set: 'Surging Sparks', no: '205/191', illus: 'Saboteri' } },
  { pp: '10', name: 'Vibrava', regular: { set: 'Surging Sparks', no: '105/191', illus: 'Teeziro' }, full: { set: 'Surging Sparks', no: '206/191', illus: 'toriyufu' } },
  { pp: '11', name: 'Chimecho', regular: { set: 'Twilight Masquerade', no: '085/167', illus: 'Mousho' }, full: { set: 'Twilight Masquerade', no: '179/167', illus: 'REND' } },
  { pp: '12', name: 'Spheal', regular: { set: 'Surging Sparks', no: '043/191', illus: 'Teeziro' }, full: { set: 'Surging Sparks', no: '199/191', illus: 'miki kudo' } },
  { pp: '13', name: 'Latios', regular: { set: 'Surging Sparks', no: '077/191', illus: 'kantaro' }, full: { set: 'Surging Sparks', no: '203/191', illus: 'OKACHEKE' } },
  { pp: '14', name: 'Timburr', regular: { set: 'Twilight Masquerade', no: '103/167', illus: 'Kouki Saitou' }, full: { set: 'Twilight Masquerade', no: '183/167', illus: 'Yuriko Akase' } },
  { pp: '15', name: 'Joltik', regular: { set: 'Stellar Crown', no: '050/142', illus: 'Nisota Niso' }, full: { set: 'Stellar Crown', no: '150/142', illus: 'MARINA Chikazawa' } },
  { pp: '16', name: 'Stunfisk', regular: { set: 'Surging Sparks', no: '064/191', illus: 'Miki Tanaka' }, full: { set: 'Surging Sparks', no: '202/191', illus: 'N-DESIGN Inc.' } },
  { pp: '17', name: 'Braviary', regular: { set: 'Surging Sparks', no: '153/191', illus: 'Anesaki Dynamic' }, full: { set: 'Surging Sparks', no: '214/191', illus: 'Gapao' } },
  { pp: '18', name: 'Vivillon', regular: { set: 'Surging Sparks', no: '007/191', illus: 'Amelicart' }, full: { set: 'Surging Sparks', no: '193/191', illus: 'REND' } },
  { pp: '19', name: 'Raboot', regular: { set: 'Stellar Crown', no: '027/142', illus: 'aspara' }, full: { set: 'Stellar Crown', no: '147/142', illus: 'rika' } },
  { pp: '20', name: 'Applin', regular: { set: 'Twilight Masquerade', no: '126/167', illus: 'Teeziro' }, full: { set: 'Twilight Masquerade', no: '185/167', illus: 'Katsunori Sato' } },
  { pp: '21', name: 'Milcery', regular: { set: 'Stellar Crown', no: '064/142', illus: 'OKACHEKE' }, full: { set: 'Stellar Crown', no: '152/142', illus: 'Dsuke' } },
  { pp: '22', name: 'Floragato', regular: { set: 'Journey Together', no: '017/159', illus: 'Felicia Chen' }, full: { set: null, no: null, illus: 'Lyu YiFei' } },
  { pp: '23', name: 'Crocalor', regular: { set: 'Surging Sparks', no: '030/191', illus: 'Atsuya Uki' }, full: { set: null, no: null, illus: 'Kouki Yanagihara' } },
  { pp: '24', name: 'Quaxwell', regular: { set: 'Surging Sparks', no: '051/191', illus: 'OKACHEKE' }, full: { set: null, no: null, illus: 'Rei Yamazaki' } },
  { pp: '25', name: 'Ceruledge', regular: { set: 'Surging Sparks', no: '035/191', illus: 'kantaro' }, full: { set: 'Surging Sparks', no: '197/191', illus: 'Rond' } },
  { pp: '26', name: 'Wattrel', regular: { set: 'Twilight Masquerade', no: '075/167', illus: 'Teeziro' }, full: { set: 'Twilight Masquerade', no: '178/167', illus: 'Mitsuhiro Arita' } },
  { pp: '27', name: 'Cetitan', regular: { set: 'Surging Sparks', no: '054/191', illus: 'Uta' }, full: { set: 'Surging Sparks', no: '201/191', illus: 'Jerky' } },
  { pp: '28', name: 'Tatsugiri', regular: { set: 'Twilight Masquerade', no: '131/167', illus: 'Jerky' }, full: { set: 'Twilight Masquerade', no: '186/167', illus: 'osare' } },
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
    q: 'When was Gem Vol 5 released?',
    a: 'April 24, 2026, in mainland China. It is a Simplified Chinese release.',
  },
  {
    q: 'Are Gem 5 cards reprints?',
    a: 'The art mostly is. 51 of the 56 illustrations are the same art you will find on English Scarlet & Violet cards, mostly from Surging Sparks. What is new is the printing: Simplified Chinese text, new numbers, new holo patterns and the Gem Pack set code.',
    link: { to: '/sets/chinese/gem-vol-5', before: 'See every card on the ', label: 'Gem Vol 5 card list', after: '.' },
  },
  {
    q: 'What are the Chinese Exclusives in Gem Vol 5?',
    a: 'The four Pokémon Horizons full arts: Captain Pikachu 0107/07, Floragato 2207/07, Crocalor 2307/07 and Quaxwell 2407/07. Captain Pikachu\'s regular art (versions 01 to 06) is also new art with no English printing, but it is not one of the Chinese Exclusives.',
  },
  {
    q: 'Which English set does most of Gem Vol 5 come from?',
    a: 'Surging Sparks. It supplies the regular art for 13 Pokémon and the full art for 10, more than any other set.',
  },
  {
    q: 'Is Captain Pikachu in an English set?',
    a: 'Not with this art. Both Captain Pikachu illustrations in Gem Vol 5 are Pokémon Horizons art with no English printing, which is a big part of why it is the chase card.',
  },
]

export const Route = createFileRoute('/blog/gem-vol-5-card-origins')({
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
  component: GemVol5OriginsPost,
})

function GemVol5OriginsPost() {
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
        lede="Almost every card in Gem Pack Vol. 5 uses art you have already seen on an English card. We matched all 56 illustrations to their English source, and four are Chinese Exclusives."
        cta={{
          heading: 'Explore Gem Vol 5',
          body: 'See every card in the set, or read our set guide for all 28 full arts and the box math.',
          links: [
            { to: '/sets/chinese/gem-vol-5', label: 'See the full card list' },
            { to: '/blog/gem-vol-5-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Packs reuse illustrations from existing Pokémon TCG cards, reprinted in Simplified Chinese with new numbers and new holo patterns.
          We matched every illustration in Gem Vol 5 (Gem 5, set code CBB5C) to the English card it came from. The exceptions are Pokémon Horizons art,
          including the four Chinese Exclusive full arts of Captain Pikachu, Floragato, Crocalor and Quaxwell.
          For more on the set itself, see our <Link to="/blog/gem-vol-5-release-news">Gem Vol 5 release post</Link> and the{' '}
          <Link to="/blog/gem-vol-5-set-guide">Gem Vol 5 set guide</Link>.
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
          Each of the 28 Pokémon in Gem Vol 5 has two illustrations. Versions 01 to 06 all use the art from that Pokémon's regular
          card, and version 07, the full art, uses the art from its full-art English card. So most Gem Pokémon reprint two English
          cards, a regular one and a full art.
        </p>
        <p>
          That adds up to 56 illustrations. 51 of them come from English cards. The other five are Pokémon Horizons art with no earlier
          version: the four Chinese Exclusive Horizons full arts and Captain Pikachu's new regular art.
        </p>
        <ul className="card-grid cols-4">
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%205/Cards/0107.webp`}
                alt="Captain Pikachu 0107/07 Chinese Exclusive full art, Gem Vol 5"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Captain Pikachu 0107/07</strong>
                Full art · Illus. Keita Hagiwara
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%205/Cards/2207.webp`}
                alt="Floragato 2207/07 Chinese Exclusive full art, Gem Vol 5"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Floragato 2207/07</strong>
                Full art · Illus. Lyu YiFei
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%205/Cards/2307.webp`}
                alt="Crocalor 2307/07 Chinese Exclusive full art, Gem Vol 5"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Crocalor 2307/07</strong>
                Full art · Illus. Kouki Yanagihara
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Gem%205/Cards/2407.webp`}
                alt="Quaxwell 2407/07 Chinese Exclusive full art, Gem Vol 5"
                loading="lazy"
                width={300}
                height={419}
              />
              <figcaption>
                <ChineseExclusiveBadge />
                <strong>Quaxwell 2407/07</strong>
                Full art · Illus. Rei Yamazaki
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Most of it comes from 2024's English Scarlet & Violet sets, led by Surging Sparks, plus one Journey Together card and one Black Star Promo:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">Which sets it comes from</caption>
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
        <p className="table-note">Counts are Gem Vol 5 Pokémon. Captain Pikachu's new regular art and the four Chinese Exclusive full arts have no English version, so the columns add up to 27 and 24.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>The Horizons cards are the new part.</strong> Captain Pikachu has no earlier card at all, and Floragato, Crocalor and Quaxwell keep their regular art from English sets but get brand-new full arts. All four Horizons full arts are Chinese Exclusives.
          </li>
          <li>
            <strong>Surging Sparks supplies the most.</strong> It covers the regular art for 13 Pokémon and the full art for 10.
          </li>
          <li>
            <strong>Twilight Masquerade comes next.</strong> It covers the regular art and the full art for 8 Pokémon each.
          </li>
          <li>
            <strong>Most pairs share a set.</strong> In 23 of the 24 Pokémon with both illustrations traced, the regular art and the full art come from the same English set.
          </li>
          <li>
            <strong>Magneton's full art is a promo.</strong> Its regular art is from Surging Sparks, but its full art reprints a Black Star Promo.
          </li>
        </ul>

        <BuyStrip />

        <h2 id="full-map">The full card-by-card map</h2>
        <p>
          Every Gem Vol 5 Pokémon, with the English card behind its regular art (versions 01 to 06) and behind its full art (version
          07), plus the illustrator credited on both.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table origins-table">
            <caption id="tbl-2" className="sr-only">The full card-by-card map</caption>
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
                      {s.set ? sourceLabel(s) : i === 1 ? 'Chinese Exclusive' : 'New for Gem Vol 5'}
                      <span className="cell-sub">Illus. {s.illus}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Card numbers are the first English printing. SVP numbers are Scarlet & Violet Black Star Promos.</p>

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
