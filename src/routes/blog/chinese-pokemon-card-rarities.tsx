import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Zh, zh } from '~/components/blog/Zh'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS, type GemSetSummary } from '~/data/gem-sets-index'
import { SET_RARITY_COUNTS, type SetRarityCounts } from '~/data/chinese-rarities'
import { RARITY_EXAMPLES, type RarityExample } from '~/data/chinese-rarity-examples'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-pokemon-card-rarities')!

// ---------------------------------------------------------------------------
// Every count on this page comes from chinese-rarities.ts, which a test
// recounts from each set's card list, and every example card from
// chinese-rarity-examples.ts, which the same test checks against its set.
// ---------------------------------------------------------------------------

const num = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`
const joinList = (items: string[]) =>
  items.length <= 1 ? items.join('') : items.length === 2 ? `${items[0]} and ${items[1]}` : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

// "Super Rare (SR)" -> "SR"; names without a code stay as they are.
const codeOf = (r: string | null) => (r === null ? null : (r.match(/\(([^)]+)\)\s*$/)?.[1] ?? r))

const isGem = (s: SetRarityCounts) => /^CBB/.test(s.code)
const setOf = (s: SetRarityCounts): GemSetSummary | undefined => GEM_SETS.find((g) => g.code === s.code)
// Collect 151's four releases share one card list (code 151C).
const setName = (s: SetRarityCounts) => (s.code === '151C' ? 'Collect 151' : (setOf(s)?.name ?? s.code))
const setNameByFile = (file: string) => setName(SET_RARITY_COUNTS.find((s) => s.file === file)!)

function SetLink({ s }: { s: SetRarityCounts }) {
  if (s.code === '151C') return <Link to="/blog/collect-151-set-guide">Collect 151</Link>
  const g = setOf(s)
  return g ? <Link to={g.path}>{g.name}</Link> : <>{s.code}</>
}

const MAIN = SET_RARITY_COUNTS.filter((s) => !isGem(s))
const GEMS = SET_RARITY_COUNTS.filter(isGem)
const cardsAt = (s: SetRarityCounts, code: string) => s.counts.find(([r]) => codeOf(r) === code)?.[1] ?? 0
const setsWith = (code: string, from = MAIN) => from.filter((s) => cardsAt(s, code) > 0)
const totalAt = (code: string, from = MAIN) => from.reduce((n, s) => n + cardsAt(s, code), 0)
const namesWith = (code: string) => joinList(setsWith(code).map(setName))

// The eight codes every main Scarlet & Violet expansion uses, then the rest.
const CORE = ['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const
const TABLE_COLS = ['C', 'U', 'R', 'RR', 'AR', 'ACE', 'SR', 'SAR', 'UR'] as const
const others = (s: SetRarityCounts) =>
  s.counts.filter(([r]) => !(TABLE_COLS as readonly string[]).includes(codeOf(r) ?? '')).map(([r, n]) => `${r === null ? 'no rarity in our list' : r} ${n}`)

const GEM_TIERS = [
  { name: 'Common', mark: '●' },
  { name: 'Uncommon', mark: '◆' },
  { name: 'Rare', mark: '★' },
  { name: 'Double Rare', mark: '★★' },
  { name: 'Triple Rare', mark: '★★★' },
] as const

// Plain descriptions. Each is checked against the set data (where in the
// numbering a rarity sits, and which kinds of card hold it) or our set guides.
const ABOUT: Record<string, { name: string; what: string }> = {
  C: { name: 'Common', what: 'The most common cards. Pokémon China’s odds charts put Commons and Uncommons in the four non-holo slots of a 5-card pack.' },
  U: { name: 'Uncommon', what: 'Pokémon and many Trainer cards, such as the Supporters Erika’s Invitation and Clavell in Miracle Journey.' },
  R: { name: 'Rare', what: 'Main-set cards that come in the holo slot. The odds charts group Rares with the Poké Ball pattern holos.' },
  RR: { name: 'Double Rare', what: 'The Pokémon ex of the main set. In every set here, every Double Rare is a Pokémon ex numbered inside the main set.' },
  AR: { name: 'Art Rare', what: 'Full illustrations of Pokémon that are not ex, numbered after the main set as secret rares.' },
  SR: { name: 'Super Rare', what: 'Full arts of Pokémon ex and Trainers, numbered after the Art Rares.' },
  SAR: { name: 'Special Art Rare', what: 'Full illustrations of Pokémon ex and Trainers.' },
  UR: { name: 'Ultra Rare', what: 'Gold cards of Pokémon ex, Trainers and Energy, at the end of the numbering.' },
  ACE: { name: 'ACE SPEC Rare', what: 'ACE SPEC Trainer and Energy cards. They are numbered in the main set, not as secret rares, and a deck can hold only one ACE SPEC card.' },
  BWR: { name: 'Black White Rare', what: 'One card per set, the last number: Zekrom ex in Black Bolt and Reshiram ex in White Flare.' },
  S: { name: 'Shiny', what: 'Main-set Pokémon in their shiny colors with star sparkles around them, numbered as secret rares.' },
  SSR: { name: 'Shiny Super Rare', what: 'Shiny full arts of Pokémon ex.' },
  'Pikachu Rare': { name: 'Pikachu Rare', what: 'Thirty Pikachu cards, each with its own art, numbered inside the main set. In place of a letter, the card shows a Pikachu face and a count out of 30.' },
  FUR: { name: 'Futuristic Rare', what: 'Mewtwo ex and Mew ex by YOSHIROTTEN, numbered after the Special Art Rares.' },
}

const EXAMPLES = (group: string) => RARITY_EXAMPLES.filter((e) => e.group === group)
const rarityLabel = (e: RarityExample) => GEM_TIERS.find((t) => t.name === e.rarity)?.mark ?? codeOf(e.rarity)

function Examples({ group, cols = 3 }: { group: string; cols?: number }) {
  const cards = EXAMPLES(group)
  return (
    <ul className={cols === 5 ? 'card-grid' : `card-grid cols-${cols}`}>
      {cards.map((e) => (
        <li key={`${e.file}-${e.number}`}>
          <figure>
            <img src={e.image} alt={`${e.name} ${e.number}, ${e.rarity.replace(/\s*\([^)]*\)$/, '')}, ${setNameByFile(e.file)}`} loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>{e.name}</strong>
              {e.number} · {rarityLabel(e)} · {setNameByFile(e.file)}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const TOC = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'marks', label: 'What the rarity marks look like' },
  { id: 'core', label: 'The eight core rarities, C to UR' },
  { id: 'ace', label: 'ACE SPEC Rare (ACE)' },
  { id: 'bwr', label: 'Black White Rare (BWR)' },
  { id: 'shiny', label: 'Shiny (S) and Shiny Super Rare (SSR)' },
  { id: '30th', label: 'Pikachu Rare, Futuristic Rare and the classics' },
  { id: 'gem', label: 'Gem Pack rarity marks' },
  { id: 'patterns', label: 'Poké Ball and Master Ball pattern holos' },
  { id: 'counts', label: 'Cards at each rarity, set by set' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

const MAIN_EXPANSIONS = MAIN.filter((s) => /^CSV\d+C$/.test(s.code))
const CORE_IN_ALL = MAIN_EXPANSIONS.filter((s) => CORE.every((c) => cardsAt(s, c) > 0))
const NO_AR = MAIN.filter((s) => /^CSV/.test(s.code) && cardsAt(s, 'AR') === 0)

const FAQ = [
  {
    q: 'What do the letters after the number on a Chinese Pokémon card mean?',
    a: 'They are the rarity mark. C is Common, U Uncommon, R Rare, RR Double Rare, AR Art Rare, SR Super Rare, SAR Special Art Rare and UR Ultra Rare. Some sets add ACE, BWR, S, SSR or FUR.',
  },
  {
    q: 'What is the rarest card rarity in Chinese Pokémon sets?',
    a: 'For the main expansions, Pokémon China’s odds charts put Super Rares, Special Art Rares and Ultra Rares (or the Black White Rare) together in the rarest group, so they do not give separate odds for each one. That group is 0.73% of the cards in a 5-card slim pack and 1.00% in a 20-card jumbo pack.',
  },
  {
    q: 'What is the difference between SR and SAR?',
    a: 'A Super Rare (SR) is a full art of a Pokémon ex or Trainer. A Special Art Rare (SAR) is a full illustration of a Pokémon ex or Trainer, numbered after the Super Rares. Many Pokémon ex come at both.',
  },
  {
    q: 'What do the stars on Gem Pack cards mean?',
    a: 'Gem Packs use symbols in place of letters: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare. Pokémon China notes that these differ from the marks in regular booster packs.',
  },
  {
    q: 'Do Poké Ball and Master Ball pattern holos have their own rarity mark?',
    a: 'No. Pokémon China describes them as the Common, Uncommon and Rare cards with a different holo finish. They keep the card’s own number, and our card lists do not list them separately.',
  },
]

export const Route = createFileRoute('/blog/chinese-pokemon-card-rarities')({
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
  component: ChineseCardRaritiesPost,
})

function ChineseCardRaritiesPost() {
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
  const thirtieth = SET_RARITY_COUNTS.find((s) => s.code === '30thC')!
  const c151 = SET_RARITY_COUNTS.find((s) => s.code === '151C')!

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Simplified Chinese Pokémon cards print their rarity as letters after the card number: C, U, R, RR, AR, SR, SAR and UR. A few sets add their own, such as ACE, BWR or Shiny, and Gem Packs use symbols: ●, ◆ and one to three stars."
        cta={{
          heading: 'Explore the Chinese sets',
          body: 'Every card list shows each card with its number and rarity.',
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer</h2>
        <ul>
          <li>
            <strong>Eight core rarities.</strong> In the order Pokémon China&rsquo;s odds charts list them: C Common, U Uncommon, R Rare, RR Double Rare, AR Art Rare,
            SR Super Rare, SAR Special Art Rare and UR Ultra Rare. {CORE_IN_ALL.length === MAIN_EXPANSIONS.length
              ? `All ${num(MAIN_EXPANSIONS.length)} main expansions on our card lists use all eight.`
              : `${num(CORE_IN_ALL.length)} of the ${num(MAIN_EXPANSIONS.length)} main expansions on our card lists use all eight.`}
          </li>
          <li>
            <strong>Secret rares start at AR.</strong> In every main expansion, the Art Rares, Super Rares, Special Art Rares and
            Ultra Rares are numbered past the main set, so 132/128 is a secret rare.
          </li>
          <li>
            <strong>Some sets add a rarity.</strong> ACE SPEC Rare in {namesWith('ACE')}; Black White Rare in {namesWith('BWR')};
            Shiny and Shiny Super Rare in Collect 151; Pikachu Rare and Futuristic Rare in 30th Celebration.
          </li>
          <li>
            <strong>Gem Packs are different.</strong> They use five symbols, ● ◆ ★ ★★ ★★★, from Common to Triple Rare.
          </li>
        </ul>
        <p>
          In this article we show what each mark looks like, give example cards for every rarity and count the cards at each rarity in
          every set we have a card list for. For how to read the rest of a card, see{' '}
          <Link to="/blog/how-to-read-chinese-pokemon-cards">how to read a Chinese Pokémon card</Link>.
        </p>

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

        <h2 id="marks">What the rarity marks look like</h2>
        <p>
          The mark sits right after the collector number in the bottom left corner, next to the set code. These are eight real cards
          from Miracle Journey (CSV2C) and Reward Round (CSV4C), one at each core rarity.
        </p>
        <figure style={{ margin: '24px auto 30px' }}>
          <img
            src={`${SITE_URL}/assets/blog/chinese-rarity-marks-close-up.webp`}
            srcSet={`${SITE_URL}/assets/blog/chinese-rarity-marks-close-up-800.webp 800w, ${SITE_URL}/assets/blog/chinese-rarity-marks-close-up.webp 1600w`}
            sizes="(max-width: 840px) 100vw, 760px"
            alt="Close-ups of eight card number strips showing the rarity marks: 054/128 C, 121/129 U, 018/128 R, 055/128 RR, 132/128 AR, 148/128 SR, 159/129 SAR and 163/128 UR"
            loading="lazy"
            width={1600}
            height={588}
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 10 }}
          />
          <figcaption className="table-note">
            Kirlia 054/128, Ortega 121/129, Oricorio 018/128, Gardevoir ex 055/128, Ralts 132/128, Clavell 148/128, Rika 159/129 and
            Artazon 163/128. Card images: Pokémon China.
          </figcaption>
        </figure>

        <div className="table-scroll" role="group" aria-labelledby="tbl-glance" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-glance" className="sr-only">
              Every rarity code in the Simplified Chinese sets, what it holds and how many cards carry it
            </caption>
            <thead>
              <tr>
                <th scope="col">Mark</th>
                <th scope="col">Rarity</th>
                <th scope="col">What it is</th>
                <th scope="col">Sets</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ABOUT).map(([code, a]) => (
                <tr key={code}>
                  <th scope="row">{code === 'Pikachu Rare' ? 'Pikachu face' : code}</th>
                  <td>{a.name}</td>
                  <td>{a.what}</td>
                  <td>{num(setsWith(code).length)}</td>
                  <td>{num(totalAt(code))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Sets and cards counted across the {plural(MAIN.length, 'card list')} other than the Gem Packs. Collect 151&rsquo;s four
          releases share one card list and count once.
        </p>

        <h2 id="core">The eight core rarities, C to UR</h2>
        <p>
          Every main expansion is built the same way. The main set holds the Commons, Uncommons, Rares and Double Rares, plus any ACE
          SPEC cards. The secret rares follow, in this order: Art Rares, Super Rares, Special Art Rares, then Ultra Rares.
        </p>
        {CORE.map((code) => (
          <React.Fragment key={code}>
            <h3 id={`rarity-${code.toLowerCase()}`}>
              {code}: {ABOUT[code].name}
            </h3>
            <p>
              {ABOUT[code].what} {plural(totalAt(code), 'card')} across {plural(setsWith(code).length, 'set')} on our card lists.
            </p>
            <Examples group={code} />
          </React.Fragment>
        ))}
        {NO_AR.length > 0 && (
          <p>
            {joinList(NO_AR.map(setName))} {NO_AR.length === 1 ? 'is the one set' : 'are the sets'} here with no Art Rares. Its
            secret rares run from Super Rare to Ultra Rare.
          </p>
        )}

        <h2 id="ace">ACE SPEC Rare (ACE)</h2>
        <p>
          {ABOUT.ACE.what} {joinList(setsWith('ACE').map((s) => `${setName(s)} has ${cardsAt(s, 'ACE')}`))}. The mark reads ACE.
          Our <Link to="/blog/blade-awakening-set-guide">Blade Awakening set guide</Link> shows all nine of its ACE SPEC cards.
        </p>
        <Examples group="ACE" />

        <h2 id="bwr">Black White Rare (BWR)</h2>
        <p>
          {ABOUT.BWR.what} Both are numbered 174/086. Pokémon China&rsquo;s odds charts group the Black White Rare with the Super Rares and
          Special Art Rares, so there are no odds for it on its own. See the{' '}
          <Link to="/blog/black-bolt-set-guide">Black Bolt</Link> and <Link to="/blog/white-flare-set-guide">White Flare</Link> set
          guides.
        </p>
        <Examples group="BWR" cols={2} />

        <h2 id="shiny">Shiny (S) and Shiny Super Rare (SSR)</h2>
        <p>
          Collect 151 is the only set on our card lists with these two rarities. It has {plural(cardsAt(c151, 'S'), 'Shiny card')}:{' '}
          {ABOUT.S.what.charAt(0).toLowerCase() + ABOUT.S.what.slice(1)} Its {plural(cardsAt(c151, 'SSR'), 'Shiny Super Rare')} are
          shiny full arts of Wigglytuff ex, Alakazam ex and Mew ex. The marks read S and SSR. More in our{' '}
          <Link to="/blog/collect-151-set-guide">Collect 151 set guide</Link>.
        </p>
        <Examples group="S" />
        <Examples group="SSR" />

        <h2 id="30th">Pikachu Rare, Futuristic Rare and the classics</h2>
        <p>
          30th Celebration (30thC) has no Uncommons, and it adds two rarities no other set on our card lists uses. The{' '}
          {plural(cardsAt(thirtieth, 'Pikachu Rare'), 'Pikachu Rare')} are numbered 017 to 046 in the main set, and each card shows a
          Pikachu face and a count out of 30 in place of a letter: 017/103 is 01/30. The{' '}
          {plural(cardsAt(thirtieth, 'FUR'), 'Futuristic Rare')}, marked FUR, are Mewtwo ex and Mew ex by YOSHIROTTEN, numbered 134 and 135, after the Special Art Rares.
        </p>
        <Examples group="PIKACHU" />
        <Examples group="FUR" cols={2} />
        <p>
          The set also reprints 30 classic cards, numbered 136 to 165, in their original frames with a gold glitter border. Our card
          list gives these, the basic Energy and the promos no rarity, which is why{' '}
          {plural(thirtieth.counts.find(([r]) => r === null)?.[1] ?? 0, 'card')} in the set have none here. Our{' '}
          <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link> covers all of them.
        </p>

        <h2 id="gem">Gem Pack rarity marks</h2>
        <p>
          Gem Packs (set codes CBB1C to CBB7C) print a symbol after the number in place of a letter. Pokémon China notes that the Gem
          Pack marks differ from those in regular booster packs.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-gem" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-gem" className="sr-only">
              Gem Pack rarity marks and the number of cards at each in Gem Vols. 1 to 7
            </caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                {GEM_TIERS.map((t) => (
                  <th key={t.name} scope="col">
                    {t.mark} {t.name}
                  </th>
                ))}
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {GEMS.map((s) => (
                <tr key={s.code}>
                  <th scope="row">
                    <SetLink s={s} />
                  </th>
                  {GEM_TIERS.map((t) => (
                    <td key={t.name}>{num(cardsAt(s, t.name))}</td>
                  ))}
                  <td>{num(s.cardCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          In Gem Vols. 4 to 7, each Pokémon comes in seven versions, and the version tells you the rarity. Versions 01 and 02 are Common, 03 and
          04 Uncommon, 05 Rare, 06 Double Rare and 07 the Triple Rare full art. Here is Misty&rsquo;s Psyduck from Gem Vol 7 at each
          rarity.
        </p>
        <Examples group="GEM" cols={5} />
        <p>
          For what each Gem Pack and box holds, see our <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link>.
        </p>

        <h2 id="patterns">Poké Ball and Master Ball pattern holos</h2>
        <p>
          The odds charts for the main expansions also list Poké Ball pattern holos (<Zh>精灵球纹样</Zh>) and Master Ball pattern holos
          (<Zh>大师球纹样</Zh>). Pokémon China&rsquo;s footnote says they are the Common, Uncommon and Rare cards with the same content
          and a different holo finish. They print the same number as the regular card and have no rarity mark of their own, so they are
          not counted on this page. The Poké Ball pattern holos share the Rare group on the charts, and the Master Ball pattern holos
          share the Double Rare group.
        </p>

        <h2 id="counts">Cards at each rarity, set by set</h2>
        <div className="table-scroll table-wide" role="group" aria-labelledby="tbl-counts" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-counts" className="sr-only">
              Number of cards at each rarity in every Simplified Chinese set on our card lists, Gem Packs excluded
            </caption>
            <thead>
              <tr>
                <th scope="col">Set</th>
                <th scope="col">Code</th>
                {TABLE_COLS.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
                <th scope="col">Other</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {MAIN.map((s) => (
                <tr key={s.code}>
                  <th scope="row">
                    <SetLink s={s} />
                  </th>
                  <td>{s.code}</td>
                  {TABLE_COLS.map((c) => (
                    <td key={c}>{cardsAt(s, c) || '–'}</td>
                  ))}
                  <td>{others(s).join(', ') || '–'}</td>
                  <td>{num(s.cardCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">From our card lists. Tap a set for its full card list.</p>
        <p>
          How often each rarity turns up depends on the pack. Our{' '}
          <Link to="/blog/chinese-pokemon-slim-vs-jumbo">slim vs jumbo guide</Link> compares the two pack sizes, each set guide gives
          that set&rsquo;s odds, and <Link to="/blog/chinese-pokemon-sets-in-order">every Chinese set in order</Link> lists them all.
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
          <li>
            <a href="https://www.pokemon.cn/tcg/product/15556.html">Pokémon China: Miracle Journey product page</a> and{' '}
            <a href="https://www.pokemon.cn/tcg/product/15488.html">Reward Round product page</a> (card images in the rarity mark
            close-ups)
          </li>
          <li>
            <a href="https://www.pokemon.cn/tcg/product/20012.html">Pokémon China: Chasing Glory product page</a> (odds chart and its
            footnote on the Poké Ball and Master Ball pattern holos)
          </li>
          <li>
            <a href="https://www.pokemon.cn/tcg/product/15582.html">Pokémon China: Gem Pack Vol. 1 product page</a> and{' '}
            <a href="https://www.pokemon.cn/tcg/product/15518.html">Gem Pack Vol. 2 product page</a> (Gem Pack rarity marks)
          </li>
        </ul>
      </BlogPostLayout>
    </>
  )
}
