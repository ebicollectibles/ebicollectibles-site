import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-6-card-origins')!

// English sets the Gem Vol 6 artwork comes from, in release order.
const SETS = ['Temporal Forces', 'Twilight Masquerade', 'Shrouded Fable', 'Stellar Crown', 'Surging Sparks', 'Destined Rivals'] as const
type SetName = (typeof SETS)[number]

type Source = { set: SetName; no: string; illus: string }

// For each Gem Vol 6 Pokémon: the English card its regular art (versions
// 01 to 06) reprints, and the English card its full art (version 07)
// reprints. Each row was matched on Pokémon name plus the illustrator
// printed on the Gem card, then checked against Limitless TCG and TCGdex.
// Applin's full art (1907/07) is new to Gem Vol 6, so it has no source.
const ORIGINS: Array<{ pp: string; name: string; regular: Source; full: Source | null }> = [
  { pp: '01', name: 'Alolan Dugtrio', regular: { set: 'Surging Sparks', no: '123/191', illus: 'Dsuke' }, full: { set: 'Surging Sparks', no: '208/191', illus: 'Yukihiro Tada' } },
  { pp: '02', name: 'Persian', regular: { set: 'Shrouded Fable', no: '049/064', illus: 'NC Empire' }, full: { set: 'Shrouded Fable', no: '078/064', illus: 'Whisker' } },
  { pp: '03', name: 'Exeggcute', regular: { set: 'Surging Sparks', no: '001/191', illus: 'Tetsu Kayama' }, full: { set: 'Surging Sparks', no: '192/191', illus: 'Yuriko Akase' } },
  { pp: '04', name: 'Ledian', regular: { set: 'Stellar Crown', no: '003/142', illus: 'Masako Tomii' }, full: { set: 'Stellar Crown', no: '144/142', illus: 'HYOGONOSUKE' } },
  { pp: '05', name: 'Slakoth', regular: { set: 'Surging Sparks', no: '145/191', illus: 'Aya Kusube' }, full: { set: 'Surging Sparks', no: '212/191', illus: 'Mékayu' } },
  { pp: '06', name: 'Lairon', regular: { set: 'Twilight Masquerade', no: '121/167', illus: 'takashi shiraishi' }, full: { set: 'Twilight Masquerade', no: '184/167', illus: 'Dsuke' } },
  { pp: '07', name: 'Meditite', regular: { set: 'Stellar Crown', no: '078/142', illus: 'Yuu Nishida' }, full: { set: 'Stellar Crown', no: '153/142', illus: 'Yuriko Akase' } },
  { pp: '08', name: 'Gulpin', regular: { set: 'Stellar Crown', no: '091/142', illus: 'Shimaris Yukichi' }, full: { set: 'Stellar Crown', no: '154/142', illus: 'Jerky' } },
  { pp: '09', name: 'Lileep', regular: { set: 'Stellar Crown', no: '005/142', illus: 'Ounishi' }, full: { set: 'Stellar Crown', no: '145/142', illus: 'Mori Yuu' } },
  { pp: '10', name: 'Castform Sunny Form', regular: { set: 'Surging Sparks', no: '020/191', illus: 'osare' }, full: { set: 'Surging Sparks', no: '195/191', illus: 'Narano' } },
  { pp: '11', name: 'Kecleon', regular: { set: 'Surging Sparks', no: '150/191', illus: 'Shinji Kanda' }, full: { set: 'Surging Sparks', no: '213/191', illus: 'Mori Yuu' } },
  { pp: '12', name: 'Mesprit', regular: { set: 'Surging Sparks', no: '079/191', illus: 'HYOGONOSUKE' }, full: { set: 'Surging Sparks', no: '204/191', illus: 'HYOGONOSUKE' } },
  { pp: '13', name: 'Reuniclus', regular: { set: 'Temporal Forces', no: '072/162', illus: 'Gemi' }, full: { set: 'Temporal Forces', no: '171/162', illus: 'Atsushi Furusawa' } },
  { pp: '14', name: 'Crabominable', regular: { set: 'Stellar Crown', no: '042/142', illus: 'nagimiso' }, full: { set: 'Stellar Crown', no: '149/142', illus: 'Mitsuhiro Arita' } },
  { pp: '15', name: 'Shiinotic', regular: { set: 'Surging Sparks', no: '009/191', illus: 'Aya Kusube' }, full: { set: 'Surging Sparks', no: '194/191', illus: 'matazo' } },
  { pp: '16', name: 'Bewear', regular: { set: 'Shrouded Fable', no: '053/064', illus: 'Takeshi Nakamura' }, full: { set: 'Shrouded Fable', no: '079/064', illus: 'Takeshi Nakamura' } },
  { pp: '17', name: 'Bruxish', regular: { set: 'Surging Sparks', no: '049/191', illus: 'Shibuzoh.' }, full: { set: 'Surging Sparks', no: '200/191', illus: 'Mitsuhiro Arita' } },
  { pp: '18', name: 'Tapu Bulu', regular: { set: 'Shrouded Fable', no: '006/064', illus: 'GOSSAN' }, full: { set: 'Shrouded Fable', no: '065/064', illus: 'IKEDA Saki' } },
  { pp: '19', name: 'Applin', regular: { set: 'Destined Rivals', no: '016/182', illus: 'Tetsu Kayama' }, full: null },
  { pp: '20', name: 'Flapple', regular: { set: 'Surging Sparks', no: '139/191', illus: 'GOTO minori' }, full: { set: 'Surging Sparks', no: '210/191', illus: 'Uninori' } },
  { pp: '21', name: 'Appletun', regular: { set: 'Surging Sparks', no: '140/191', illus: 'Oswaldo KATO' }, full: { set: 'Surging Sparks', no: '211/191', illus: 'MINAMINAMI Take' } },
  { pp: '22', name: 'Clobbopus', regular: { set: 'Surging Sparks', no: '112/191', illus: 'Shimaris Yukichi' }, full: { set: 'Surging Sparks', no: '207/191', illus: 'USGMEN' } },
  { pp: '23', name: 'Cufant', regular: { set: 'Shrouded Fable', no: '041/064', illus: 'Shinya Mizuno' }, full: { set: 'Shrouded Fable', no: '076/064', illus: 'Mina Nakai' } },
  { pp: '24', name: 'Dipplin', regular: { set: 'Twilight Masquerade', no: '018/167', illus: 'Saboteri' }, full: { set: 'Twilight Masquerade', no: '170/167', illus: 'Akira Komayama' } },
  { pp: '25', name: 'Poltchageist', regular: { set: 'Twilight Masquerade', no: '020/167', illus: 'MINAMINAMI Take' }, full: { set: 'Twilight Masquerade', no: '171/167', illus: 'Saboteri' } },
  { pp: '26', name: 'Okidogi', regular: { set: 'Twilight Masquerade', no: '111/167', illus: 'Souichirou Gunjima' }, full: { set: 'Shrouded Fable', no: '074/064', illus: 'AKIRA EGAWA' } },
  { pp: '27', name: 'Munkidori', regular: { set: 'Twilight Masquerade', no: '095/167', illus: 'Kodama' }, full: { set: 'Shrouded Fable', no: '072/064', illus: 'Teeziro' } },
  { pp: '28', name: 'Fezandipiti', regular: { set: 'Twilight Masquerade', no: '096/167', illus: 'Kouki Saitou' }, full: { set: 'Shrouded Fable', no: '073/064', illus: 'KEIICHIRO ITO' } },
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
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are Gem Vol 6 cards reprints?',
    a: 'The artwork is. 55 of the 56 illustrations in Gem Vol 6 were first printed on English Scarlet & Violet cards. The cards themselves are new Simplified Chinese printings with their own numbers, foils and Gem Pack set code.',
  },
  {
    q: 'Is any Gem Vol 6 artwork new?',
    a: "Yes, one: Applin's full art, 1907/07 by Jiro Sasumo. We could not find it on any earlier English, Japanese or Traditional Chinese card, which matches Pokémon China calling it new.",
  },
  {
    q: 'Which English set does most of Gem Vol 6 come from?',
    a: 'Surging Sparks. It supplies the regular art for 11 Pokémon and the full art for 11, more than any other set.',
  },
  {
    q: 'Why is Applin the only card with a different regulation mark?',
    a: "Applin's regular art comes from Destined Rivals, which uses regulation mark I. Every other Gem Vol 6 artwork comes from sets that use mark H.",
  },
]

export const Route = createFileRoute('/blogs/news/gem-vol-6-card-origins')({
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
  component: GemVol6OriginsPost,
})

function GemVol6OriginsPost() {
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
        lede="Almost every illustration in Gem Pack Vol. 6 first appeared on an English Scarlet & Violet card. Here is exactly where each one comes from, card by card."
        cta={{
          heading: 'Explore Gem Vol 6',
          body: 'See every card in the set, or read our set guide for all 28 full arts and the box math.',
          links: [
            { to: '/sets/gem-vol-6', label: 'Browse the card list' },
            { to: '/blogs/news/gem-vol-6-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          If a Gem Vol 6 card looks familiar, there is a good reason. Gem Packs reuse artwork from existing Pokémon TCG cards and
          reprint it in Simplified Chinese with new numbers and new foils. We traced every illustration in the set back to the
          English card it first appeared on.
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
          Each of the 28 Pokémon in Gem Vol 6 has two illustrations. Versions 01 to 06 all use the art from that Pokémon's regular
          card, and version 07, the full art, uses the art from its Illustration Rare. So one Gem Pokémon usually brings together two
          English cards: the everyday one and the chase one.
        </p>
        <p>
          That adds up to 56 illustrations. 55 of them come from English cards. The 56th, Applin's kitchen full art (1907/07), was
          drawn for Gem Vol 6 and has no earlier version.
        </p>

        <h2 id="by-set">Which sets it comes from</h2>
        <p>Everything traces back to six English Scarlet & Violet sets, listed here in release order:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">English set</th>
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
        <p className="table-note">Counts are Gem Vol 6 Pokémon. Applin's full art is new, so the full-art column adds up to 27.</p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>Surging Sparks leads the way.</strong> It supplies both the regular art and the full art for 11 Pokémon,
            including Flapple and Appletun from the apple family.
          </li>
          <li>
            <strong>Pairs usually stay together.</strong> In 24 of the 27 Pokémon with a traced full art, the regular art and the full
            art come from the same English set.
          </li>
          <li>
            <strong>The Loyal Three are the exception.</strong> Okidogi, Munkidori and Fezandipiti take their regular art from
            Twilight Masquerade and their full arts from Shrouded Fable.
          </li>
          <li>
            <strong>Applin is the newest and the most original.</strong> Its regular art comes from Destined Rivals, the only source
            outside 2024's sets, and its full art is brand new.
          </li>
        </ul>

        <h2 id="full-map">The full card-by-card map</h2>
        <p>
          Every Gem Vol 6 Pokémon, with the English card behind its regular art (versions 01 to 06) and behind its full art (version
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
                        {o.full.set} {o.full.no}
                        <span className="cell-sub">Illus. {o.full.illus}</span>
                      </>
                    ) : (
                      <>
                        New for Gem Vol 6
                        <span className="cell-sub">Illus. Jiro Sasumo</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Card numbers are the first English printing.</p>
        <p>
          A few of these illustrations were reprinted again later in English, for example Dipplin, Okidogi, Munkidori and
          Fezandipiti in Prismatic Evolutions. The table lists where each one appeared first.
        </p>

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          Lots of Pokémon have several cards by different artists, so a name match isn't enough. We matched each Gem card to its
          English original by the illustrator printed on the card, and when two cards were close, we put them side by side.
        </p>
        <p>
          For more on the set itself, see our <Link to="/blogs/news/gem-vol-6-has-arrived">Gem Vol 6 release post</Link> and the{' '}
          <Link to="/blogs/news/gem-vol-6-set-guide">Gem Vol 6 set guide</Link>.
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
