import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { JAPANESE_SETS } from '~/data/japanese-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'simplified-vs-traditional-chinese-pokemon-cards')!

// ---------------------------------------------------------------------------
// Simplified Chinese set facts come from the set registry (gem-sets-index.ts)
// and the Japanese set codes from japanese-sets-index.ts. Everything about
// Traditional Chinese is from Pokémon's own Traditional Chinese Trainers
// Website (asia.pokemon-card.com), checked November 24, 2026.
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
const num = (n: number) => n.toLocaleString('en-US')

const SETS = [...GEM_SETS].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.code.localeCompare(b.code, 'en', { numeric: true }))
const MAIN = SETS.filter((s) => /^CSV[\d.]+C$/.test(s.code))
const GEMS = SETS.filter((s) => /^CBB[\d.]+C$/.test(s.code))
const EXCLUSIVES = SETS.reduce((n, s) => n + s.exclusiveCount, 0)

// Product codes and names on the Traditional Chinese Trainers Website (Taiwan)
// product list, with the Japanese set that uses the same code on our site.
const TC_MATCHES = [
  { code: 'M7', tc: '波導探求者' },
  { code: 'M6', tc: '綠寶石風暴' },
  { code: 'M6A', tc: '30th CELEBRATION' },
]
  .map((m) => ({ ...m, jp: JAPANESE_SETS.find((j) => j.code.toUpperCase() === m.code) }))
  .filter((m) => m.jp)


const FAQ = [
  {
    q: 'What is the difference between Simplified and Traditional Chinese Pokémon cards?',
    a: 'They are two separate official versions of the Pokémon Trading Card Game. Simplified Chinese cards are made for mainland China and announced on pokemon.cn. Traditional Chinese cards have their own Trainers Website pages for Taiwan and Hong Kong. They use different scripts, different set codes and different tournament rules.',
  },
  {
    q: 'How do I tell Simplified from Traditional Chinese at a glance?',
    a: 'Look at how Pokémon is written. Simplified Chinese writes it 宝可梦 and Traditional Chinese writes it 寶可夢. The game names differ the same way: 宝可梦集换式卡牌游戏 against 寶可夢集換式卡牌遊戲.',
  },
  {
    q: 'Do Simplified and Traditional Chinese cards have the same set codes?',
    a: 'No. Simplified Chinese set codes end in C, such as CSV1C or CBB1C. Recent Traditional Chinese products use the same codes as the Japanese sets, such as M7 and M6.',
  },
  {
    q: 'Which Chinese version has Gem Packs and Chinese Exclusives?',
    a: 'Gem Packs (codes CBB1C onward) are a Simplified Chinese line, and a Chinese Exclusive on this site is a card whose illustration is only printed in the Simplified Chinese release.',
  },
  {
    q: 'Can I use Simplified Chinese cards at events in Hong Kong?',
    a: 'Pokémon’s Hong Kong notice of October 1, 2024 says decks at official tournaments and Gym events in Hong Kong and Macau must be all Traditional Chinese or all English, Energy cards included. Simplified Chinese is not one of the two options it gives.',
  },
  {
    q: 'Can I use Traditional Chinese cards at events in mainland China?',
    a: 'Pokémon China’s tournament rules (Ver.3.0.0, section 6.2) say events for the Simplified Chinese game allow only Simplified Chinese cards.',
  },
  {
    q: 'Is Pikachu written the same in both?',
    a: 'Pikachu is 皮卡丘 in both scripts, so a Pokémon name alone does not always tell you which version you have. The word for Pokémon itself, 宝可梦 or 寶可夢, does.',
  },
]

export const Route = createFileRoute('/blog/simplified-vs-traditional-chinese-pokemon-cards')({
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
  component: SimplifiedVsTraditionalPost,
})

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'tips', label: "Tips if you don't read Chinese" },
  { id: 'at-a-glance', label: 'Side by side' },
  { id: 'script', label: 'Check how Pokémon is written' },
  { id: 'codes', label: 'Check the set code' },
  { id: 'holo', label: 'Check a holo card' },
  { id: 'sets', label: 'Different sets and products' },
  { id: 'play', label: 'Where each one can be played' },
  { id: 'faq', label: 'FAQ' },
]

function SimplifiedVsTraditionalPost() {
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
        lede="Simplified and Traditional are two ways of writing the same Chinese language. Simplified Chinese cards are made for mainland China. Traditional Chinese cards are made for Taiwan, Hong Kong and Macau. They are two separate official versions of the game, with different sets."
        cta={{
          heading: 'Browse the Simplified Chinese sets',
          body: `Full card lists for ${num(SETS.length)} Simplified Chinese sets.`,
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Simplified Chinese</strong> is the way Chinese is written in mainland China. Many characters have fewer strokes.
            Pokémon is written <Zh>宝可梦</Zh>.
          </li>
          <li>
            <strong>Traditional Chinese</strong> is the older, fuller way of writing the same characters, used in Taiwan, Hong Kong and
            Macau. Pokémon is written <span lang="zh-Hant">寶可夢</span>.
          </li>
          <li>
            <strong>On cards,</strong> they are two different official versions. Simplified Chinese cards come from Pokémon China
            (pokemon.cn). Traditional Chinese cards have their own official site, the Trainers Website at asia.pokemon-card.com.
          </li>
          <li>
            <strong>The fastest check:</strong> Simplified Chinese set codes end in C, like {MAIN[MAIN.length - 1].code}. Traditional
            Chinese products use the Japanese codes, like {TC_MATCHES[0].code}.
          </li>
        </ul>

        <h2 id="tips">Tips if you don't read Chinese</h2>
        <p>
          If you don't read Chinese, the two can look almost the same at first. That's fine. You don't need to read a word to tell them apart. These checks work by sight.
        </p>
        <ol>
          <li>
            <strong>Traditional looks denser.</strong> Traditional characters keep more strokes, so a line of text looks darker, busier
            and more packed. Simplified text looks lighter, with more white space inside each character.
          </li>
          <li>
            <strong>Look at the word Pokémon.</strong> It is on every pack and box. In <Zh>宝可梦</Zh> the first character is a small
            roof over a simple shape. In <span lang="zh-Hant">寶可夢</span> the same character is crammed with strokes, and the last
            character is taller and boxier.
          </li>
          <li>
            <strong>Find the set code.</strong> It is printed along the bottom edge of every card. A code ending in C is Simplified Chinese.
          </li>
          <li>
            <strong>Don't rely on Pokémon names.</strong> Some names are written the same in both. Pikachu is <Zh>皮卡丘</Zh> either
            way.
          </li>
          <li>
            <strong>Compare a few common characters.</strong> The game's name, printed on packaging, has two easy pairs:{' '}
            <Zh>换</Zh> and <span lang="zh-Hant">換</span> (exchange), <Zh>戏</Zh> and <span lang="zh-Hant">戲</span> (game). In each
            pair, the Traditional one has more strokes.
          </li>
        </ol>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="at-a-glance">Side by side</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-svt" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-svt" className="sr-only">
              Simplified and Traditional Chinese Pokémon cards compared
            </caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Simplified Chinese</th>
                <th scope="col">Traditional Chinese</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Pokémon is written</th>
                <td>
                  <Zh>宝可梦</Zh>
                </td>
                <td>
                  <span lang="zh-Hant">寶可夢</span>
                </td>
              </tr>
              <tr>
                <th scope="row">The game is called</th>
                <td>
                  <Zh>宝可梦集换式卡牌游戏</Zh>
                </td>
                <td>
                  <span lang="zh-Hant">寶可夢集換式卡牌遊戲</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Official site</th>
                <td>pokemon.cn (Pokémon China)</td>
                <td>asia.pokemon-card.com, Taiwan and Hong Kong pages</td>
              </tr>
              <tr>
                <th scope="row">Where it is used</th>
                <td>Mainland China</td>
                <td>Taiwan, Hong Kong and Macau</td>
              </tr>
              <tr>
                <th scope="row">Set codes</th>
                <td>
                  End in C: {MAIN[0].code}, {GEMS[0].code}
                </td>
                <td>Same codes as the Japanese sets: {TC_MATCHES.map((m) => m.code).join(', ')}</td>
              </tr>
              <tr>
                <th scope="row">Official events allow</th>
                <td>Simplified Chinese cards only (mainland China)</td>
                <td>All Traditional Chinese or all English (Hong Kong and Macau)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="script">Check how Pokémon is written</h2>
        <p>
          Simplified Chinese uses simpler forms of many characters, and Traditional Chinese keeps the older, fuller forms. The word for
          Pokémon shows it straight away: <Zh>宝可梦</Zh> against <span lang="zh-Hant">寶可夢</span>. The first and last characters
          change, the middle one does not.
        </p>
        <p>
          The name of the game changes the same way. Pokémon China calls it <Zh>宝可梦集换式卡牌游戏</Zh>. The Traditional Chinese
          Trainers Website calls it <span lang="zh-Hant">寶可夢集換式卡牌遊戲</span>, with the Traditional forms of three more characters.
        </p>
        <p>
          A Pokémon’s name is not always enough. Pikachu is <Zh>皮卡丘</Zh> in both, because none of its characters has a simpler form.
        </p>

        <h2 id="codes">Check the set code</h2>
        <p>
          Every card prints a product code, the code of the set it came from. Simplified Chinese codes end in C. Main expansions run from{' '}
          <Link to={MAIN[0].path}>{MAIN[0].name}</Link> ({MAIN[0].code}) to{' '}
          <Link to={MAIN[MAIN.length - 1].path}>{MAIN[MAIN.length - 1].name}</Link> ({MAIN[MAIN.length - 1].code}), and the Gem Packs
          from {GEMS[0].code} to {GEMS[GEMS.length - 1].code}.
        </p>
        <p>
          The Traditional Chinese product list uses the codes of the Japanese sets. These three recent Traditional Chinese boosters share
          their code with a Japanese set we cover:
        </p>
        <ul>
          {TC_MATCHES.map((m) => (
            <li key={m.code}>
              <strong>{m.code}</strong>: <span lang="zh-Hant">{m.tc}</span> in Traditional Chinese, and{' '}
              {m.jp!.draft ? m.jp!.name : <a href={m.jp!.path}>{m.jp!.name}</a>} in Japanese.
            </li>
          ))}
        </ul>
        <p>So a code like CSV7C means Simplified Chinese, and a code like M7 does not.</p>

        <h2 id="holo">Check a holo card</h2>
        <p>
          Pokémon China’s 2022 launch post says every Simplified Chinese holo card has a Pokémon logo pressed into its lower left corner
          with a raised printing process, and calls it a design only genuine Simplified Chinese cards have (
          <Zh>这是正版宝可梦卡牌简中版才有的独特设计</Zh>). The same post introduced a Simplified Chinese random holo, a special holo
          pattern that Common, Uncommon and Rare cards can turn up in.
        </p>

        <h2 id="sets">Different sets and products</h2>
        <p>
          The two versions do not share set lists. Simplified Chinese has its own expansions, with their own names, card numbers and
          release dates. See every one in the{' '}
          <Link to="/blog/chinese-pokemon-sets-in-order">timeline of Simplified Chinese sets</Link>.
        </p>
        <ul>
          <li>
            <strong>Gem Packs.</strong> A Simplified Chinese line of small all-holo packs, {GEMS.length} volumes so far. The{' '}
            <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link> explains them.
          </li>
          <li>
            <strong>Chinese Exclusives.</strong> On this site, a Chinese Exclusive is a card whose illustration is only printed in the
            Simplified Chinese release. Our set lists flag {num(EXCLUSIVES)} of them so far.
          </li>
        </ul>

        <h2 id="play">Where each one can be played</h2>
        <ul>
          <li>
            <strong>Mainland China.</strong> Pokémon China’s tournament rules (<Zh>赛场规则</Zh> Ver.3.0.0, July 8, 2024, section 6.2):
            “<Zh>参与简体中文版宝可梦卡牌游戏的赛事活动，仅可使用简体中文版的宝可梦卡牌。</Zh>” Events for the Simplified Chinese game
            allow only Simplified Chinese cards.
          </li>
          <li>
            <strong>Hong Kong and Macau.</strong> Since October 1, 2024, Pokémon’s Hong Kong site says players at official tournaments
            and Gym events can use “either a deck of cards in Traditional Chinese, or a deck of cards in English”, with no mixing, Energy
            cards included.
          </li>
          <li>
            <strong>Pokémon World Championships 2026.</strong> Pokémon China said players who qualified through the Simplified Chinese
            game could use Simplified Chinese, Traditional Chinese and English cards.
          </li>
        </ul>
        <p>
          We did not find a published card language rule for Taiwan. For events elsewhere, see{' '}
          <Link to="/blog/are-chinese-pokemon-cards-tournament-legal">Can you play Chinese Pokémon cards in tournaments?</Link>
        </p>
        <p>
          For more on the Simplified Chinese version itself, read{' '}
          <Link to="/blog/are-chinese-pokemon-cards-real">Are Chinese Pokémon cards real?</Link> and{' '}
          <Link to="/blog/chinese-vs-english-pokemon-cards">Chinese vs English Pokémon cards</Link>.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
