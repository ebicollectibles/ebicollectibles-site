import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'are-chinese-pokemon-cards-tournament-legal')!

// ---------------------------------------------------------------------------
// Every rule here is quoted from an official document, listed in SOURCES:
// the Play! Pokémon TCG Tournament Handbook (English and Brazilian Portuguese
// versions, both last revised September 1, 2026), Pokémon China's tournament
// rules (赛场规则 Ver.3.0.0) and notices, and the Hong Kong Trainers Website.
// The quotes are copied from those documents word for word.
// ---------------------------------------------------------------------------

const HANDBOOK_EN =
  'https://www.pokemon.com/static-assets/content-assets/cms2/pdf/play-pokemon/rules/play-pokemon-tcg-tournament-handbook-en.pdf'
const HANDBOOK_BR =
  'https://www.pokemon.com/static-assets/content-assets/cms2-pt-br/pdf/play-pokemon/rules/play-pokemon-tcg-tournament-handbook-br.pdf'
const HANDBOOK_DATE = 'September 1, 2026'

// Handbook section 2.3.1 and 2.3.2, as printed.
const ZONES = [
  { zone: 'US and Canada', langs: 'English' },
  { zone: 'Latin America', langs: 'English, Spanish' },
  { zone: 'Europe', langs: 'English, French, German, Italian, Portuguese, Spanish' },
  { zone: 'Oceania', langs: 'English' },
  { zone: 'Russia', langs: 'English, Russian' },
  { zone: 'Middle East and South Africa', langs: 'English' },
]
const EXTRA = [
  { region: 'Canada', langs: 'French' },
  { region: 'Argentina, Brazil, Chile, Colombia, Ecuador, Panama, Paraguay, Peru', langs: 'Portuguese' },
  { region: 'Puerto Rico', langs: 'English, Spanish' },
]

const SOURCES = [
  { href: HANDBOOK_EN, label: `Play! Pokémon TCG Tournament Handbook, English version, last revision ${HANDBOOK_DATE}, sections 2, 2.1, 2.3 and 4` },
  { href: HANDBOOK_BR, label: 'Manual dos Torneios de Pokémon Estampas Ilustradas, versão em português do Brasil, última revisão 1 de setembro de 2026, seção 2.3' },
  {
    href: 'https://asia.pokemon-card.com/hk-en/archives/6203/',
    label: 'Pokémon Trading Card Game Trainers Website, Hong Kong: Regarding the use of English cards in events in Hong Kong and Macau from October 1st, 2024 onwards',
  },
  { href: 'https://www.pokemon.cn/tcg/event/20889.html', label: 'Pokémon China: 2026宝可梦世界锦标赛卡牌项目参赛资格 (March 9, 2026)' },
  { href: 'https://www.pokemon.cn/tcg-rules-regulation/', label: 'Pokémon China: 赛制 (formats), updated November 16, 2026' },
]

const FAQ = [
  {
    q: 'Are Chinese Pokémon cards tournament legal?',
    a: `It depends on where the event is. At Play! Pokémon Championship Series events, the Tournament Handbook (revised ${HANDBOOK_DATE}) sets the legal languages by rating zone, and no zone lists Chinese. At other tournaments and League sessions the Organizer or League staff decide. In mainland China, events for the Simplified Chinese game allow only Simplified Chinese cards.`,
  },
  {
    q: 'Can I use Chinese cards at a tournament in the US?',
    a: 'At a Championship Series event in the US, the handbook lists English as the only legal language for the US and Canada rating zone. The exceptions are Worlds, International, Regional and Special Championships and their side events, where you may also use cards in any language legal in your home country. At a local tournament or League session, the Organizer or League staff decide which languages are allowed, so ask them.',
  },
  {
    q: 'Can I mix Chinese and English cards in one deck?',
    a: 'The handbook says mixed language decks are allowed so long as the backs are consistent, but each card still has to be in a language that is legal for that event. In Hong Kong and Macau, Pokémon’s notice says a deck must be all Traditional Chinese or all English, with no mixing.',
  },
  {
    q: 'Why are Japanese cards treated differently?',
    a: 'The handbook says Japanese cards are considered marked because their card backs are different from the backs of all other Pokémon trading cards.',
  },
  {
    q: 'Which cards can I use at tournaments in mainland China?',
    a: 'Only Simplified Chinese cards. Pokémon China’s tournament rules say: 参与简体中文版宝可梦卡牌游戏的赛事活动，仅可使用简体中文版的宝可梦卡牌。',
  },
  {
    q: 'What cards could Chinese players use at the 2026 World Championships?',
    a: 'Pokémon China said players who qualified through the Simplified Chinese game could use Simplified Chinese, Traditional Chinese and English cards at the 2026 Pokémon World Championships in San Francisco.',
  },
  {
    q: 'Can a judge allow Chinese cards anyway?',
    a: 'In exceptional circumstances, the handbook lets the Head Judge or Organizer of any tournament make an exception to the language rules, at their sole discretion. Players who expect to need one should contact the Organizer before the event.',
  },
  {
    q: 'Can I play with Gem Pack cards?',
    a: 'Pokémon China says a Gem Pack on its own cannot be used to play, and suggests combining its cards with other products to build a deck.',
  },
]

export const Route = createFileRoute('/blog/are-chinese-pokemon-cards-tournament-legal')({
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
  component: TournamentLegalPost,
})

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'genuine', label: 'Rule one: genuine cards in the right language' },
  { id: 'languages', label: 'The legal languages table' },
  { id: 'exceptions', label: 'The exceptions' },
  { id: 'mixing', label: 'Mixed language decks and card backs' },
  { id: 'china', label: 'Mainland China, Hong Kong and Macau' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

function TournamentLegalPost() {
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
        lede="It depends on where you play. At Play! Pokémon Championship Series events, Chinese is not on the handbook’s list of legal languages, apart from a few exceptions. Local events set their own language rules, and in mainland China only Simplified Chinese cards are allowed."
        cta={{
          heading: 'Explore the Chinese sets',
          body: 'Card lists for every Simplified Chinese set we cover, with rarities and set codes.',
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Championship Series events:</strong> the Play! Pokémon TCG Tournament Handbook lists the legal card languages for
            each rating zone. None of the zones lists Chinese. In the US and Canada, the only legal language is English.
          </li>
          <li>
            <strong>Worlds, International, Regional and Special Championships:</strong> you may use English cards and cards in any
            language legal in your home country.
          </li>
          <li>
            <strong>Local tournaments and League sessions:</strong> the Organizer or League staff decide. Ask before you go.
          </li>
          <li>
            <strong>Mainland China:</strong> events for the Simplified Chinese game allow only Simplified Chinese cards.
          </li>
          <li>
            <strong>Hong Kong and Macau:</strong> official tournaments and Gym events take an all Traditional Chinese or an all English
            deck.
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

        <h2 id="genuine">Rule one: genuine cards in the right language</h2>
        <p>
          The rules for Play! Pokémon events are in the TCG Tournament Handbook. The version quoted here is the English edition, last
          revised {HANDBOOK_DATE}. Section 2, Trading Card Legality, starts like this:
        </p>
        <blockquote>
          <p>
            “Only genuine Pokémon Trading Card Game cards may be used at Play! Pokémon events, unless issued a proxy card by a Judge or
            Organizer.
          </p>
          <p>Competitors must ensure that all cards they wish to use during each tournament are:</p>
          <ul>
            <li>Legal for the format in which the tournament is held.</li>
            <li>
              The correct language with respect to the region in which the tournament is held.
              <ul>
                <li>Mixed language decks are allowed so long as the backs are consistent.</li>
              </ul>
            </li>
            <li>Not marked or altered in any way.”</li>
          </ul>
        </blockquote>
        <p>
          So two questions decide whether a Chinese card is legal: is it genuine, and is Chinese a legal language where you are playing?
          Our article <Link to="/blog/are-chinese-pokemon-cards-real">Are Chinese Pokémon cards real?</Link> covers the first.
        </p>

        <h2 id="languages">The legal languages table</h2>
        <p>Section 2.3, Legal Languages, explains who decides:</p>
        <blockquote>
          <p>
            “To ease the linguistic complexity of tournament interactions, Play! Pokémon limits which languages are legal for play at
            Championship Series events according to the rating zone in which that Championship Series event is held.
          </p>
          <p>
            For all other tournaments and League sessions, the decision regarding which languages are legal for play is at the discretion
            of the Organizer or League staff.”
          </p>
        </blockquote>
        <p>Section 2.3.1 lists the languages for each rating zone:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-zones" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-zones" className="sr-only">
              Legal card languages for Championship Series events, by rating zone, from the Play! Pokémon TCG Tournament Handbook
            </caption>
            <thead>
              <tr>
                <th scope="col">Rating zone</th>
                <th scope="col">Legal languages</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map((z) => (
                <tr key={z.zone}>
                  <th scope="row">{z.zone}</th>
                  <td>{z.langs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Section 2.3.2 adds languages for some countries and regions:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-extra" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-extra" className="sr-only">
              Additional legal card languages for Championship Series events, by region
            </caption>
            <thead>
              <tr>
                <th scope="col">Region</th>
                <th scope="col">Additional legal languages</th>
              </tr>
            </thead>
            <tbody>
              {EXTRA.map((z) => (
                <tr key={z.region}>
                  <th scope="row">{z.region}</th>
                  <td>{z.langs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Source: Play! Pokémon TCG Tournament Handbook, revised {HANDBOOK_DATE}, sections 2.3.1 and 2.3.2. The Brazilian Portuguese
          edition of the same date has the same table.
        </p>
        <p>
          Chinese is not in either table, and the table has no zone for Asia. The handbook does not say which languages apply there, so
          this article does not either.
        </p>

        <h2 id="exceptions">The exceptions</h2>
        <p>Section 2.3.3 makes room for travelling players at the biggest events:</p>
        <blockquote>
          <p>
            “For the Pokémon TCG World Championships, International Championships, Regional and Special Championships, and for side
            events held at these events, regardless of which country they are hosted in, competitors are always permitted to use English
            cards as well as cards in any language that is legal in the competitor’s home country.”
          </p>
        </blockquote>
        <p>It also gives the Head Judge or Organizer of any tournament a way to allow other languages:</p>
        <blockquote>
          <p>
            “In exceptional circumstances, the Head Judge or Organizer of any tournament may also choose to make an exception to rules
            regarding the legal languages. This is at their sole discretion and should only be considered where there would be no
            operational detriment to the tournament in doing so.”
          </p>
        </blockquote>
        <p>
          The handbook asks players who would find the language rules hard to follow to contact the event Organizer before the event.
        </p>
        <p>
          For the 2026 Pokémon World Championships in San Francisco, Pokémon China told players who qualified through the Simplified
          Chinese game that they could use Simplified Chinese, Traditional Chinese and English cards (
          <Zh>可使用简体中文版、繁体中文版及英文版卡牌参赛</Zh>).
        </p>

        <h2 id="mixing">Mixed language decks and card backs</h2>
        <p>
          The handbook allows mixed language decks “so long as the backs are consistent”. Each card still has to be legal for the event.
          Section 2.1, on marked cards, adds one language note:
        </p>
        <blockquote>
          <p>
            “Japanese cards are considered ‘marked’ for the purpose of this section as their card backs are different than the card backs
            of all other Pokémon trading cards”
          </p>
        </blockquote>
        <p>
          Section 4 sets the deck limit by English name: a deck “may not contain more than 4 copies of a single card, as defined by the
          card’s English language translation, except for Basic Energy cards.”
        </p>

        <h2 id="china">Mainland China, Hong Kong and Macau</h2>
        <p>
          <strong>Mainland China.</strong> Pokémon China runs its own events for the Simplified Chinese game under its own rules,{' '}
          <Zh>宝可梦集换式卡牌游戏 赛场规则</Zh> Ver.3.0.0, last updated July 8, 2024. Section 6.2, Language, says:
        </p>
        <blockquote lang="zh-Hans">
          <p>
            宝可梦集换式卡牌游戏的卡牌在世界各地发行了许多语言版本。
            <br />
            参与简体中文版宝可梦卡牌游戏的赛事活动，仅可使用简体中文版的宝可梦卡牌。
          </p>
        </blockquote>
        <p>
          In English: Pokémon cards are released in many languages around the world, and events for the Simplified Chinese game may only
          use Simplified Chinese cards. Pokémon China’s Standard format, from November 6, 2026, allows cards with regulation marks G, H, I
          and J, the eight basic Energy cards and a short list of older cards.
        </p>
        <p>
          <strong>Hong Kong and Macau.</strong> From October 1, 2024, Pokémon’s Hong Kong site says players at official tournaments and
          Gym events will be able to use “either a deck of cards in Traditional Chinese, or a deck of cards in English”. A deck “cannot
          include a mix of cards in both languages”, and that applies to Energy cards too. Simplified Chinese is not one of the two
          options.
        </p>
        <p>
          We did not find a published card language rule for Taiwan. To tell the two Chinese versions apart, see{' '}
          <Link to="/blog/simplified-vs-traditional-chinese-pokemon-cards">Simplified vs Traditional Chinese Pokémon cards</Link>. For how
          Chinese sets differ from English ones, see{' '}
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

        <h2 id="sources">Sources</h2>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href}>{zh(s.label)}</a>
            </li>
          ))}
          <li>
            Pokémon China: <Zh>宝可梦集换式卡牌游戏 赛场规则</Zh> Ver.3.0.0, last updated July 8, 2024, section 6.2
          </li>
          <li>
            Pokémon China: Gem Pack product pages on pokemon.cn, on playing with Gem Pack cards, as cited in our{' '}
            <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link>
          </li>
        </ul>
      </BlogPostLayout>
    </>
  )
}
