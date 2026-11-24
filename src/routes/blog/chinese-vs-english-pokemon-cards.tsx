import { Zh, zh } from '~/components/blog/Zh'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage, type BlogPostSlug } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-vs-english-pokemon-cards')!

// ---------------------------------------------------------------------------
// Set counts, codes and Chinese Exclusive counts come from the set registry
// (gem-sets-index.ts). The English matches are the excerpts of our own card
// origins posts (blog-posts.ts), so they read exactly as those posts do.
// Pack sizes are from Pokémon China's product pages and odds charts, as cited
// in our Gem Pack and set guides, and from Pokémon's Asia site for English.
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
const num = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`

const SETS = [...GEM_SETS].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.code.localeCompare(b.code, 'en', { numeric: true }))
const FIRST = SETS[0]
const MAIN = SETS.filter((s) => /^CSV[\d.]+C$/.test(s.code))
const GEMS = SETS.filter((s) => /^CBB[\d.]+C$/.test(s.code))
const TOTAL_EXCLUSIVES = SETS.reduce((n, s) => n + s.exclusiveCount, 0)
const WITH_EXCLUSIVES = SETS.filter((s) => s.exclusiveCount > 0).length
const MOST_EXCLUSIVES = [...SETS].sort((a, b) => b.exclusiveCount - a.exclusiveCount)[0]

// Card origins posts that show how a Chinese set is put together from English sets.
const ORIGIN_SLUGS: BlogPostSlug[] = [
  'true-mystery-card-origins',
  'black-crystal-blaze-card-origins',
  'blade-awakening-card-origins',
  'brilliant-fantasy-card-origins',
  'stellar-crystal-card-origins',
  'collect-151-card-origins',
]
const ORIGINS = ORIGIN_SLUGS.map((slug) => BLOG_POSTS.find((p) => p.slug === slug)).filter((p) => p !== undefined)

// Chinese rarity names as printed in our set lists, with the English rarity
// that the same kind of card gets. The pairs are the ones stated in our card
// origins posts (Stellar Crystal, Collect 151).
const RARITIES = [
  { cn: 'Art Rare (AR)', en: 'Illustration Rare' },
  { cn: 'Super Rare (SR)', en: 'Ultra Rare' },
  { cn: 'Special Art Rare (SAR)', en: 'Special Illustration Rare' },
  { cn: 'Ultra Rare (UR)', en: 'Hyper Rare (the gold cards)' },
]


const FAQ = [
  {
    q: 'What is the difference between Chinese and English Pokémon cards?',
    a: 'Simplified Chinese cards come in their own sets, with their own names, set codes and card numbers. Most of their cards share artwork with English cards, but a Chinese set usually mixes cards from more than one English set, and some cards are Chinese Exclusives. The pack sizes and rarity names differ too.',
  },
  {
    q: 'Do Chinese sets have the same cards as English sets?',
    a: 'Mostly the same artwork, arranged differently. Our card origins posts match every card in a Chinese set to its English version. True Mystery (CSV6C), for example, takes most of its cards from Paradox Rift and the rest from Obsidian Flames, Paldean Fates and other sources.',
  },
  {
    q: 'How many cards are in a Chinese booster pack?',
    a: 'It depends on the pack. Pokémon China’s odds charts give main expansion slim packs 5 cards with one holo and jumbo packs 20 cards with six or seven holos. A Gem Pack has 4 cards, all holo. An English Scarlet & Violet booster pack has 10 cards.',
  },
  {
    q: 'What is a Special Art Rare in English?',
    a: 'A Special Illustration Rare. Chinese lists use the names Art Rare, Super Rare, Special Art Rare and Ultra Rare, where English uses Illustration Rare, Ultra Rare, Special Illustration Rare and Hyper Rare.',
  },
  {
    q: 'What is a Chinese Exclusive?',
    a: `On this site, a Chinese Exclusive is a card whose illustration is only printed in the Simplified Chinese release. Our set lists flag ${plural(TOTAL_EXCLUSIVES, 'card')} across ${plural(WITH_EXCLUSIVES, 'set')}.`,
  },
  {
    q: 'Can Chinese and English cards be played together?',
    a: 'At home, that is up to you. At official events the language rules depend on where the event is held. Our tournament article quotes the rules.',
  },
]

export const Route = createFileRoute('/blog/chinese-vs-english-pokemon-cards')({
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
  component: ChineseVsEnglishPost,
})

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'sets', label: 'Different sets, same artwork' },
  { id: 'packs', label: 'Slim, jumbo and Gem Packs' },
  { id: 'rarities', label: 'Rarity names' },
  { id: 'exclusives', label: 'Chinese Exclusives' },
  { id: 'cards', label: 'On the card itself' },
  { id: 'faq', label: 'FAQ' },
]

function ChineseVsEnglishPost() {
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
        lede="Simplified Chinese Pokémon cards are not English cards in another language. They come in their own sets, in different pack sizes, with different rarity names, and some of their cards are never printed in English."
        cta={{
          heading: 'Explore the Chinese sets',
          body: `Card lists for ${num(SETS.length)} Simplified Chinese sets, each matched to English in its card origins post.`,
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Different sets.</strong> A Chinese set usually mixes cards from more than one English set, under its own name and set
            code.
          </li>
          <li>
            <strong>Different packs.</strong> Main expansions come in 5-card slim and 20-card jumbo packs, and Gem Packs hold 4 cards, all
            holo. An English Scarlet &amp; Violet booster has 10.
          </li>
          <li>
            <strong>Different rarity names.</strong> A Special Art Rare in Chinese is a Special Illustration Rare in English.
          </li>
          <li>
            <strong>Some cards are only in Chinese.</strong> We call these Chinese Exclusives. There are {num(TOTAL_EXCLUSIVES)} on our
            set lists so far.
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

        <h2 id="sets">Different sets, same artwork</h2>
        <p>
          The Simplified Chinese game has its own release schedule. Pokémon’s Asia site dates the first English Scarlet &amp; Violet set
          to March 31, 2023. The first Scarlet &amp; Violet era Simplified Chinese sets on our lists came out on{' '}
          {formatDate(FIRST.releaseDate)}, led by <Link to={MAIN[0].path}>{MAIN[0].name}</Link> ({MAIN[0].code}).
        </p>
        <p>
          Chinese sets are not one-for-one copies of English sets. Each one is its own list of cards, numbered its own way, and most
          draw their artwork from more than one English set. Our card origins posts match every card in a Chinese set to its
          English version. Here is what some of them found:
        </p>
        <ul>
          {ORIGINS.map((p) => (
            <li key={p.slug}>
              <Link to={p.path}>{p.title}</Link>: {p.excerpt}
            </li>
          ))}
        </ul>
        <p>
          The <Link to="/blog/chinese-pokemon-sets-in-order">timeline of Simplified Chinese sets</Link> lists every set in release order
          with its code.
        </p>

        <h2 id="packs">Slim, jumbo and Gem Packs</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-packs" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-packs" className="sr-only">
              Cards per pack in Simplified Chinese and English Pokémon booster packs
            </caption>
            <thead>
              <tr>
                <th scope="col">Pack</th>
                <th scope="col">Cards per pack</th>
                <th scope="col">Holos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Chinese slim pack (main expansions)</th>
                <td>5</td>
                <td>1</td>
              </tr>
              <tr>
                <th scope="row">Chinese jumbo pack (main expansions)</th>
                <td>20</td>
                <td>6 or 7</td>
              </tr>
              <tr>
                <th scope="row">Chinese Gem Pack</th>
                <td>4</td>
                <td>All 4</td>
              </tr>
              <tr>
                <th scope="row">English Scarlet &amp; Violet booster</th>
                <td>10</td>
                <td>Not stated on Pokémon’s page</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Chinese figures from Pokémon China’s product pages and odds charts. English figure from Pokémon’s Asia site, for the Scarlet
          &amp; Violet set.
        </p>
        <p>
          Many main expansions come in both slim and jumbo boxes, and the two sizes have their own odds. Our{' '}
          <Link to="/blog/blade-awakening-set-guide">Blade Awakening set guide</Link> compares them side by side. In sets such as Blade
          Awakening, each Common, Uncommon and Rare card also comes as a Poké Ball pattern holo and a Master Ball pattern holo.
        </p>
        <p>
          Gem Packs are a Simplified Chinese line of small collector packs, {plural(GEMS.length, 'volume')} so far, from{' '}
          {GEMS[0].code} to {GEMS[GEMS.length - 1].code}. Pokémon China says a Gem Pack on its own cannot be used to play. The{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link> has the odds for every volume.
        </p>

        <h2 id="rarities">Rarity names</h2>
        <p>
          The Chinese sets use the rarity names below on our lists. Each matches an English rarity, which is how our card origins posts
          pair them.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rarity" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rarity" className="sr-only">
              Chinese rarity names and the English rarity each matches
            </caption>
            <thead>
              <tr>
                <th scope="col">Chinese rarity</th>
                <th scope="col">English rarity</th>
              </tr>
            </thead>
            <tbody>
              {RARITIES.map((r) => (
                <tr key={r.cn}>
                  <th scope="row">{r.cn}</th>
                  <td>{r.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Gem Packs have their own marks, ● ◆ ★ ★★ ★★★, and Pokémon China notes that they differ from the marks in regular booster
          packs.
        </p>

        <h2 id="exclusives">Chinese Exclusives</h2>
        <p>
          <ChineseExclusiveBadge /> On this site, a Chinese Exclusive is a card whose illustration is only printed in the Simplified Chinese
          release. Our set lists flag {plural(TOTAL_EXCLUSIVES, 'card')} across {plural(WITH_EXCLUSIVES, 'set')}. {MOST_EXCLUSIVES.name}{' '}
          has the most, with {num(MOST_EXCLUSIVES.exclusiveCount)}. Each set guide and card origins post points them out.
        </p>

        <h2 id="cards">On the card itself</h2>
        <ul>
          <li>
            <strong>The text is Simplified Chinese.</strong> Names, attacks and abilities are all in Chinese. Pokémon China’s card guide
            shows where each part sits: the regulation mark and product code in the lower left, then the rarity, the card number and the
            illustrator.
          </li>
          <li>
            <strong>The set code ends in C.</strong> The product code on the card is the Chinese set code, such as {MAIN[0].code}, not
            the English set’s code.
          </li>
          <li>
            <strong>The card number is the Chinese one.</strong> A card’s number in its Chinese set is usually not its English number. The
            card origins posts list both.
          </li>
          <li>
            <strong>An embossed logo on holos.</strong> Pokémon China’s 2022 launch post says Simplified Chinese holo cards have a Pokémon
            logo pressed into the lower left corner, which it calls a design only genuine Simplified Chinese cards have.
          </li>
          <li>
            <strong>The deck rules are the same.</strong> Pokémon China’s card guide says a deck can hold at most 4 cards with the same
            name (<Zh>相同名称的卡牌在1套卡组中最多可以放入4张</Zh>). The Play! Pokémon handbook sets the same limit of 4, counted by the
            card’s English name.
          </li>
        </ul>
        <p>
          Wondering whether a Chinese card is genuine, or which Chinese version you have? See{' '}
          <Link to="/blog/are-chinese-pokemon-cards-real">Are Chinese Pokémon cards real?</Link> and{' '}
          <Link to="/blog/simplified-vs-traditional-chinese-pokemon-cards">Simplified vs Traditional Chinese Pokémon cards</Link>. For
          playing them at events, see{' '}
          <Link to="/blog/are-chinese-pokemon-cards-tournament-legal">Can you play Chinese Pokémon cards in tournaments?</Link>
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
