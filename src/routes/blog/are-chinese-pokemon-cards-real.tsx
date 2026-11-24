import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'are-chinese-pokemon-cards-real')!

// ---------------------------------------------------------------------------
// Set facts are read from the set registry (gem-sets-index.ts), so the counts
// and examples here follow the card lists as sets are added.
//
// Everything else is from official sources:
// Pokémon China's launch posts (pokemon.cn, September and October 2022), its
// card guide and format pages, its tournament rules (Ver.3.0.0) and the
// Play! Pokémon TCG Tournament Handbook (revised September 1, 2026).
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
const num = (n: number) => n.toLocaleString('en-US')

const SETS = [...GEM_SETS].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.code.localeCompare(b.code, 'en', { numeric: true }))
const FIRST = SETS[0]
const LAST = SETS[SETS.length - 1]
const MAIN = SETS.filter((s) => /^CSV[\d.]+C$/.test(s.code))
const GEMS = SETS.filter((s) => /^CBB[\d.]+C$/.test(s.code))
const TOTAL_CARDS = SETS.reduce((n, s) => n + s.cardCount, 0)
const bySlug = (slug: string) => SETS.find((s) => s.slug === slug) as GemSetSummary
const EXAMPLES = [MAIN[0], MAIN[MAIN.length - 1], GEMS[0], bySlug('30th-celebration')].filter(Boolean)

const LAUNCH = '2022-10-28'


const FAQ = [
  {
    q: 'Are Chinese Pokémon cards real?',
    a: `Simplified Chinese Pokémon cards are official. They are made for mainland China and announced by Pokémon China on pokemon.cn. The Simplified Chinese Pokémon Trading Card Game went on sale in mainland China on ${formatDate(LAUNCH)}. Fakes of Chinese cards exist too, as they do for every language, so check the card, not just the language.`,
  },
  {
    q: 'Who makes Simplified Chinese Pokémon cards?',
    a: 'Pokémon China says the Simplified Chinese edition was designed by the Pokémon Card team in Japan together with a team in Shanghai. Its own pages name the company 宝可梦（上海）, Pokémon (Shanghai).',
  },
  {
    q: 'When did official Simplified Chinese Pokémon cards start?',
    a: `On ${formatDate(LAUNCH)}. The first products were from the Sun & Moon series: the 横空出世 GX starter deck and three booster packs, 赫, 苍 and 泽.`,
  },
  {
    q: 'What does 宝可梦 mean on a pack?',
    a: '宝可梦 is the Simplified Chinese name for Pokémon. The game itself is 宝可梦集换式卡牌游戏, the Pokémon Trading Card Game. Pokémon China notes that “Pokémon” and “宝可梦” are both Nintendo trademarks.',
  },
  {
    q: 'How can I tell a real Simplified Chinese holo card?',
    a: 'Pokémon China’s 2022 launch post says every Simplified Chinese holo card has an embossed Pokémon logo in its lower left corner, and calls it a design only genuine Simplified Chinese cards have. Also check that the set code and card number match the official card list.',
  },
  {
    q: 'Are fake Chinese cards allowed at tournaments?',
    a: 'No. The Play! Pokémon handbook allows only genuine Pokémon cards, and Pokémon China’s tournament rules ban forged cards at every event, including photocopied and hand-made cards.',
  },
  {
    q: 'Are Traditional Chinese cards the same thing?',
    a: 'No. Traditional Chinese cards are a separate official version with their own sets. This article is about Simplified Chinese cards.',
  },
]

export const Route = createFileRoute('/blog/are-chinese-pokemon-cards-real')({
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
  component: AreChineseCardsRealPost,
})

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'what-they-are', label: 'What official Simplified Chinese cards are' },
  { id: 'sets', label: 'The sets, and how to look one up' },
  { id: 'check', label: 'Five checks you can make' },
  { id: 'rules', label: 'What the official rules say about fakes' },
  { id: 'faq', label: 'FAQ' },
]

function AreChineseCardsRealPost() {
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
        lede={`Yes. Simplified Chinese Pokémon cards are an official version of the Pokémon Trading Card Game, made for mainland China and on sale there since ${formatDate(LAUNCH)}. Fakes exist in every language, so it pays to know what a real one looks like.`}
        cta={{
          heading: 'Explore the Chinese sets',
          body: `Every Simplified Chinese set we have a card list for, ${num(SETS.length)} in all.`,
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>They are official.</strong> Pokémon China launched the Simplified Chinese Pokémon Trading Card Game in mainland
            China on {formatDate(LAUNCH)}.
          </li>
          <li>
            <strong>The packs say 宝可梦.</strong> That is the Simplified Chinese name for Pokémon. The game is{' '}
            <Zh>宝可梦集换式卡牌游戏</Zh>, the Pokémon Trading Card Game.
          </li>
          <li>
            <strong>They have their own sets.</strong> Simplified Chinese sets have their own names, codes and card lists, such as{' '}
            {MAIN[0].name} ({MAIN[0].code}) and {GEMS[0].name} ({GEMS[0].code}).
          </li>
          <li>
            <strong>Fakes exist.</strong> A Chinese card is not real just because it is Chinese. The checks below use only what Pokémon
            China and Play! Pokémon publish.
          </li>
        </ul>

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

        <h2 id="what-they-are">What official Simplified Chinese cards are</h2>
        <p>
          Pokémon China runs pokemon.cn, which calls itself the official Pokémon website in China. It announced the Simplified Chinese
          edition in September 2022 and put it on sale in mainland China on {formatDate(LAUNCH)}. The first products came from the Sun
          &amp; Moon series: the <Zh>横空出世</Zh> GX starter deck and three booster packs, <Zh>赫</Zh>, <Zh>苍</Zh> and <Zh>泽</Zh>.
        </p>
        <p>
          Pokémon China says the Simplified Chinese edition was designed by the Pokémon Card team in Japan together with a team in
          Shanghai. Its pages name the company <Zh>宝可梦（上海）</Zh>, Pokémon (Shanghai). Every page on pokemon.cn carries the same
          line: “Pokémon” and “<Zh>宝可梦</Zh>” are both Nintendo trademarks.
        </p>
        <p>
          It is a full game, not only a collector product. Pokémon China runs official tournaments in mainland China, and its formats
          page lists cards from the Sun &amp; Moon, Sword &amp; Shield and Scarlet &amp; Violet series for its Open format.
        </p>
        <p>
          “Chinese Pokémon cards” can also mean Traditional Chinese cards, a separate official version with its own sets. Our{' '}
          <Link to="/blog/simplified-vs-traditional-chinese-pokemon-cards">Simplified vs Traditional Chinese guide</Link> shows how to
          tell the two apart.
        </p>

        <h2 id="sets">The sets, and how to look one up</h2>
        <p>
          We keep full card lists for the Simplified Chinese sets, starting with the Scarlet &amp; Violet era releases of{' '}
          {formatDate(FIRST.releaseDate)}. That is {num(SETS.length)} sets and {num(TOTAL_CARDS)} cards so far, up to{' '}
          {LAST.name} on {formatDate(LAST.releaseDate)}. The{' '}
          <Link to="/blog/chinese-pokemon-sets-in-order">timeline of every Simplified Chinese set</Link> puts them in order.
        </p>
        <p>Each set has a short code printed on its cards. A few examples:</p>
        <ul>
          {EXAMPLES.map((s) => (
            <li key={s.slug}>
              <strong>{s.code}</strong> is <Link to={s.path}>{s.name}</Link>, {num(s.cardCount)} cards, released{' '}
              {formatDate(s.releaseDate)}.
            </li>
          ))}
        </ul>
        <p>
          If a card claims to be from one of these sets, its code and card number should match a card on that set’s list. Our{' '}
          <Link to="/sets/chinese">Chinese sets page</Link> has every list.
        </p>

        <h2 id="check">Five checks you can make</h2>
        <p>
          These checks come from what Pokémon China publishes about its own cards. None of them alone proves a card is real, but a card
          that fails one is worth a closer look.
        </p>
        <ol>
          <li>
            <strong>The name on the pack.</strong> Official Simplified Chinese products carry the <Zh>宝可梦</Zh> name, and the game is
            called <Zh>宝可梦集换式卡牌游戏</Zh>.
          </li>
          <li>
            <strong>The product on pokemon.cn.</strong> Pokémon China announces its products on pokemon.cn, under the trading card game
            section. If you cannot find a product there or on our set lists, ask the seller where it comes from.
          </li>
          <li>
            <strong>The details at the bottom of the card.</strong> Pokémon China’s card guide lists what each card shows: a regulation
            mark and a product code in the lower left (<Zh>赛制标记</Zh> and <Zh>商品编号</Zh>), the rarity, the card number and the
            illustrator. The product code is the set code, such as {MAIN[0].code}.
          </li>
          <li>
            <strong>The embossed logo on holo cards.</strong> Pokémon China’s 2022 launch post says every Simplified Chinese holo card has a Pokémon logo
            pressed into its lower left corner with a raised printing process, and calls it a design only genuine Simplified Chinese
            cards have: <Zh>这是正版宝可梦卡牌简中版才有的独特设计</Zh>.
          </li>
          <li>
            <strong>The back.</strong> Pokémon China’s card guide says every card has the same back design (
            <Zh>所有卡牌的反面图案皆相同</Zh>). Set a card you doubt next to one from a sealed pack and compare the backs.
          </li>
        </ol>

        <h2 id="rules">What the official rules say about fakes</h2>
        <p>
          The Play! Pokémon TCG Tournament Handbook, revised September 1, 2026, opens its card rules with this line in section 2:
        </p>
        <blockquote>
          <p>
            “Only genuine Pokémon Trading Card Game cards may be used at Play! Pokémon events, unless issued a proxy card by a Judge or
            Organizer.”
          </p>
        </blockquote>
        <p>
          Pokémon China’s own tournament rules (<Zh>宝可梦集换式卡牌游戏 赛场规则</Zh> Ver.3.0.0, last updated July 8, 2024) say the same
          in section 6.5: forged cards may not be used at any event, including photocopied and hand-made cards (
          <Zh>所有赛事活动皆不可使用伪造卡牌，包括但不限于影印或是手工制作的卡牌</Zh>).
        </p>
        <p>
          Where Simplified Chinese cards can be played is a separate question.{' '}
          <Link to="/blog/are-chinese-pokemon-cards-tournament-legal">Can you play Chinese Pokémon cards in tournaments?</Link> covers
          it. For how they differ from English cards, see{' '}
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
