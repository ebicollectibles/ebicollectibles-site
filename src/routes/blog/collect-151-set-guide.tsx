import { Zh } from '~/components/blog/Zh'
import { rarityFullName } from '~/components/blog/RarityAbbr'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'
import setData from '~/data/collect-151.json'

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-set-guide')!

// One 192-card list shared by all four releases. Each release's own cards
// (Chen Cards' per-release pages, matching Pokémon China's announcements):
const RELEASE_OF: Record<string, string> = {
  '170': 'Journey',
  '171': 'Hope',
  '172': 'Surprise',
  '189': 'Surprise',
  '191': 'Surprise',
  '173': 'Gathering',
  '190': 'Gathering',
}

type Card = (typeof setData.cards)[number]
const BY_NO = new Map(setData.cards.map((c) => [c.pokemonIndex, c]))
// Cards in the order we want them shown (most wanted first), by collector number.
const pick = (nos: number[]) => nos.map((n) => BY_NO.get(n)!)
const EXCLUSIVE = new Set<string>(setData.exclusiveCardNumbers)
const no3 = (c: Card) => c.number.slice(0, 3)

function Gallery({ cards, cols }: { cards: Card[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, Collect 151`} loading="lazy" width={300} height={418} />
            <figcaption>
              {EXCLUSIVE.has(c.number) && <ChineseExclusiveBadge />}
              <strong>{c.name}</strong>
              {c.number}
              {RELEASE_OF[no3(c)] ? ` · ${RELEASE_OF[no3(c)]} only` : ''}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

const packImg = (slug: string) => `${SITE_URL}/assets/sets/packs/collect-151-${slug}.webp`

// From Pokémon China's announcements (pokemon.cn, December 2024 to June 2025)
// and the card list. Boosted types: the types whose Poké Ball and Master Ball
// pattern holos Pokémon China says turn up more often in that release.
const RELEASES = [
  {
    name: 'Journey',
    zh: '收集啦151 旅',
    slug: 'journey',
    path: '/sets/chinese/collect-151-journey',
    date: 'January 17, 2025',
    cover: 'Pikachu',
    own: 'Pikachu 170/151 (Art Rare)',
    boosted: 'Not stated',
  },
  {
    name: 'Hope',
    zh: '收集啦151 望',
    slug: 'hope',
    path: '/sets/chinese/collect-151-hope',
    date: 'April 18, 2025',
    cover: 'Psyduck and Pikachu',
    own: 'Pikachu 171/151 (Art Rare)',
    boosted: 'Water, Dragon, Colorless',
  },
  {
    name: 'Surprise',
    zh: '收集啦151 惊',
    slug: 'surprise',
    path: '/sets/chinese/collect-151-surprise',
    date: 'July 18, 2025',
    cover: 'Gengar and Pikachu',
    own: 'Pikachu 172/151 (Art Rare), Alakazam ex 189/151 and Mew ex 191/151 (Special Art Rares)',
    boosted: 'Grass, Psychic, Darkness',
  },
  {
    name: 'Gathering',
    zh: '收集啦151 聚',
    slug: 'gathering',
    path: '/sets/chinese/collect-151-gathering',
    date: 'October 17, 2025',
    cover: 'Pikachu, Vulpix and Cubone',
    own: 'Pikachu 173/151 (Art Rare), Zapdos ex 190/151 (Special Art Rare)',
    boosted: 'Fire, Lightning, Fighting',
  },
] as const

const BLOCKS = [
  { nos: '001 to 151', what: 'The 151 Kanto Pokémon, in Pokédex order', rarity: 'Common, Uncommon, Rare, Double Rare' },
  { nos: '152 to 169', what: 'Shiny versions of 18 main-set Pokémon', rarity: 'Shiny' },
  { nos: '170 to 173', what: 'Pikachu, one per release', rarity: 'Art Rare' },
  { nos: '174 to 185', what: 'Full arts of the 12 Pokémon ex', rarity: 'Super Rare' },
  { nos: '186 to 188', what: 'Shiny full arts of Wigglytuff ex, Alakazam ex and Mew ex', rarity: 'Shiny Super Rare' },
  { nos: '189 to 191', what: 'Alakazam ex, Zapdos ex and Mew ex', rarity: 'Special Art Rare' },
  { nos: '192', what: 'Gold Mew ex', rarity: 'Ultra Rare' },
]

// Every Pokémon ex, with every number it prints at.
const LADDER_NAMES = [
  'Mew ex',
  'Alakazam ex',
  'Zapdos ex',
  'Wigglytuff ex',
  'Charizard ex',
  'Venusaur ex',
  'Blastoise ex',
  'Arbok ex',
  'Ninetales ex',
  'Golem ex',
  'Kangaskhan ex',
  'Jynx ex',
]
const TIERS = ['Double Rare (RR)', 'Super Rare (SR)', 'Shiny Super Rare (SSR)', 'Special Art Rare (SAR)', 'Ultra Rare (UR)'] as const
const LADDER = LADDER_NAMES.map((name) => ({
  name,
  nos: TIERS.map((t) => setData.cards.find((c) => c.name === name && c.rarity === t)?.number.slice(0, 3) ?? '–'),
}))

const TOC = [
  { id: 'four-releases', label: 'One card list, four releases' },
  { id: 'which-release', label: 'Which release has which chase card' },
  { id: 'special-art-rares', label: 'All 3 Special Art Rares' },
  { id: 'pikachu', label: 'The 4 Pikachu Art Rares' },
  { id: 'mew', label: 'Gold Mew ex and the Shiny Super Rares' },
  { id: 'super-rares', label: 'All 12 Super Rares' },
  { id: 'shiny', label: 'All 18 Shiny cards' },
  { id: 'ladders', label: 'Every Pokémon ex at every rarity' },
  { id: 'numbering', label: 'How the numbers work' },
  { id: 'master-set', label: 'Chasing a master set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Are Collect 151 Journey, Hope, Surprise and Gathering different sets?',
    a: 'No. They are four releases of one set, Collect 151 (收集啦151, set code 151C). All four share the same 192-card list. Each release has its own pack art and its own Pikachu Art Rare, and Surprise and Gathering also have their own Special Art Rares.',
  },
  {
    q: 'Which Collect 151 release has the Mew ex Special Art Rare?',
    a: 'Surprise. Mew ex 191/151 and Alakazam ex 189/151 are both Surprise cards. The Zapdos ex Special Art Rare 190/151 is in Gathering.',
  },
  {
    q: 'Which release has the gold Mew ex?',
    a: 'Mew ex 192/151, the gold Ultra Rare, is part of the shared card list, so it is not tied to one release.',
  },
  {
    q: 'Is there a Charizard ex Special Art Rare in Collect 151?',
    a: 'No. The Special Art Rares are Alakazam ex, Zapdos ex and Mew ex. Charizard ex comes as a Double Rare, 006/151, and a Super Rare full art, 175/151.',
  },
  {
    q: 'What are the pull rates for Collect 151?',
    a: 'Pokémon China has not published an odds chart for Collect 151, so we do not give pull rates. Its announcements say a 5-card pack has 1 holo and a 20-card pack has 7.',
  },
  {
    q: 'Does Collect 151 have Trainer cards?',
    a: 'No. Every card in the set is a Pokémon.',
  },
  {
    q: 'How many cards are in a Collect 151 master set?',
    a: '192 numbered cards, plus the Poké Ball and Master Ball pattern holos. Pokémon China confirms both patterns for the 139 Pokémon that are not ex. Counting one of each for those 139, a master set is 470 cards.',
  },
]

export const Route = createFileRoute('/blog/collect-151-set-guide')({
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
  component: Collect151SetGuide,
})

function Collect151SetGuide() {
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
        lede="Collect 151 is one 192-card set sold in four releases: Journey, Hope, Surprise and Gathering. This guide explains how they differ, shows which release has which chase card, and covers what a master set takes."
        cta={{
          heading: 'See every Collect 151 card',
          body: 'See every card on the full card list for each release.',
          links: [
            { to: '/sets/chinese/collect-151-surprise', label: 'See the full card list' },
            { to: '/sets/chinese/collect-151-gathering', label: 'Gathering card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Collect 151 (<Zh>收集啦151</Zh>, set code 151C) is the Simplified Chinese 151 set. Its main set is the 151 original Kanto
          Pokémon in Pokédex order, from Bulbasaur 001 to Mew ex 151. Pokémon China released it in four parts between January and
          October 2025. Each part is its own booster pack with its own name and cover, but all four use the same 192-card list.
        </p>
        <p>
          Each release has a post of its own:{' '}
          <Link to="/blog/collect-151-journey-release-news">Journey</Link>,{' '}
          <Link to="/blog/collect-151-hope-release-news">Hope</Link>,{' '}
          <Link to="/blog/collect-151-surprise-release-news">Surprise</Link> and{' '}
          <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>. Our{' '}
          <Link to="/blog/collect-151-card-origins">card origins guide</Link> matches every card to its Japanese and English version.
          Use this guide to pick a release, sort your pulls or plan a master set.
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

        <h2 id="four-releases">One card list, four releases</h2>
        <p>
          Journey, Hope, Surprise and Gathering are not separate sets. They share the same main set and most of the secret rares. What
          changes from one release to the next is the pack art, a small group of cards found only in that release, and which types of
          Poké Ball and Master Ball pattern holos turn up more often.
        </p>
        <ul className="card-grid cols-4">
          {RELEASES.map((r) => (
            <li key={r.slug}>
              <figure>
                <img
                  src={packImg(r.slug)}
                  alt={`Collect 151: ${r.name} booster pack with ${r.cover} on the front`}
                  loading="lazy"
                  width={r.slug === 'journey' ? 352 : 405}
                  height={r.slug === 'journey' ? 654 : 760}
                  style={{ background: 'transparent', boxShadow: 'none' }}
                />
                <figcaption>
                  <strong>{r.name}</strong>
                  <Zh>{r.zh}</Zh> · {r.date}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="table-scroll" role="group" aria-labelledby="tbl-1" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-1" className="sr-only">The four Collect 151 releases</caption>
            <thead>
              <tr>
                <th scope="col">Release</th>
                <th scope="col">Released</th>
                <th scope="col">Its own cards</th>
                <th scope="col">Boosted pattern holo types</th>
              </tr>
            </thead>
            <tbody>
              {RELEASES.map((r) => (
                <tr key={r.slug}>
                  <th scope="row">
                    <Link to={r.path}>{r.name}</Link>
                  </th>
                  <td>{r.date}</td>
                  <td>{r.own}</td>
                  <td>{r.boosted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Boosted types are from Pokémon China's announcements for Hope, Surprise and Gathering. We have not found one for Journey.
        </p>
        <p>
          Journey came in 5-card packs. Pokémon China lists Hope, Surprise and Gathering in two sizes: a 5-card pack with 1 holo and a
          20-card pack with 7 holos. It has not published an odds chart for any of them, so this guide gives no pull rates.
        </p>

        <h2 id="which-release">Which release has which chase card</h2>
        <p>
          If you are after one card, the release matters. The gold Mew ex, the 12 Super Rares, the 3 Shiny Super Rares and the 18
          Shiny cards are part of the shared list. The Pikachu Art Rares and the Special Art Rares are not.
        </p>
        <ul>
          <li>
            <strong>Mew ex or Alakazam ex Special Art Rare:</strong> open <Link to="/blog/collect-151-surprise-release-news">Surprise</Link>.
          </li>
          <li>
            <strong>Zapdos ex Special Art Rare:</strong> open <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>.
          </li>
          <li>
            <strong>A particular Pikachu Art Rare:</strong> 170 is Journey, 171 is Hope, 172 is Surprise and 173 is Gathering.
          </li>
          <li>
            <strong>Poké Ball and Master Ball holos of one type:</strong> Hope favors Water, Dragon and Colorless, Surprise favors Grass,
            Psychic and Darkness, and Gathering favors Fire, Lightning and Fighting.
          </li>
        </ul>
        <p>
          Our card lists mark each release's own cards with the Chinese Exclusive label. The four Pikachu Art Rares are new art. The three
          Special Art Rares use art first printed in Japan, which the{' '}
          <Link to="/blog/collect-151-card-origins">card origins guide</Link> covers.
        </p>

        <h2 id="special-art-rares">All 3 Special Art Rares</h2>
        <p>
          These are numbered 189 to 191. Mew ex 191/151 by USGMEN is the one most collectors want. Alakazam ex 189/151 by Shinya Komatsu
          is also a Surprise card, and Zapdos ex 190/151 by Shiburingaru is in Gathering.
        </p>
        <Gallery cards={pick([191, 189, 190])} cols={3} />

        <BuyStrip />

        <h2 id="pikachu">The 4 Pikachu Art Rares</h2>
        <p>
          Pikachu is on every Collect 151 pack, and every release has its own Pikachu Art Rare, numbered 170 to 173 in release order.
          All four are by Oswaldo KATO. Pokémon China describes the last two: in Surprise, Gengar hides behind the trees while Pikachu
          looks around under a full moon, and in Gathering, a crowd of Pikachu plays in a sunny forest with Cubone and Vulpix.
        </p>
        <Gallery cards={pick([170, 171, 172, 173])} cols={4} />

        <h2 id="mew">Gold Mew ex and the Shiny Super Rares</h2>
        <p>
          Mew is number 151, and Mew ex comes at five rarities, more than any other Pokémon ex in the set. The gold Ultra Rare 192/151
          is the top card of the list. The Shiny Super Rares, 186 to 188, are full arts of Wigglytuff ex, Alakazam ex and Mew ex in their shiny colors.
        </p>
        <Gallery cards={pick([192, 188, 187, 186])} cols={4} />

        <h2 id="super-rares">All 12 Super Rares</h2>
        <p>These are full arts of all 12 Pokémon ex in the set, numbered 174 to 185 in Pokédex order.</p>
        <Gallery cards={pick([175, 185, 174, 176, 184, 180, 179, 178, 177, 181, 182, 183])} cols={4} />

        <h2 id="shiny">All 18 Shiny cards</h2>
        <p>
          No other Chinese set in our card lists has the Shiny rarity. Each Shiny card shows a main-set Pokémon in its shiny colors with star sparkles
          around it. They are numbered 152 to 169, again in Pokédex order.
        </p>
        <Gallery cards={pick([152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169])} cols={6} />

        <h2 id="ladders">Every Pokémon ex at every rarity</h2>
        <p>
          The main set has 12 Pokémon ex, and every one has a Super Rare. This table gives the number of each version. Mew ex is the
          only one with all five.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">Every Pokémon ex at every rarity</caption>
            <thead>
              <tr>
                <th scope="col">Pokémon</th>
                <th scope="col">Double Rare</th>
                <th scope="col">Super Rare</th>
                <th scope="col">Shiny Super Rare</th>
                <th scope="col">Special Art Rare</th>
                <th scope="col">Ultra Rare</th>
              </tr>
            </thead>
            <tbody>
              {LADDER.map((l) => (
                <tr key={l.name}>
                  <th scope="row">{l.name}</th>
                  {l.nos.map((n, i) => (
                    <td key={i}>{n}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of 151. For the main set, the number is the Pokédex number, so Pikachu is 025 and Mewtwo is
          150. There are 63 Commons, 51 Uncommons, 25 Rares and 12 Double Rare ex. Everything above 151 is a secret rare, and the
          rarer versions of a card sit there at unrelated numbers, so match them by name.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">How the numbers work</caption>
            <thead>
              <tr>
                <th scope="col">Numbers</th>
                <th scope="col">What they are</th>
                <th scope="col">Rarity</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((b) => (
                <tr key={b.nos}>
                  <th scope="row">{b.nos}</th>
                  <td>{b.what}</td>
                  <td>{b.rarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is 192 cards. Pokémon China's announcements also describe Poké Ball and Master Ball pattern holos of the main-set
          Pokémon, and its coin sets confirm both patterns for the 139 Pokémon that are not ex. Our card list does not list these pattern
          holos separately. Counting one Poké Ball and one Master Ball holo for each of those 139, a master set comes to 470 cards.
        </p>
        <p>
          Because the shared list is the same in every release, any release will help with the main set and most secret rares. The
          release-only cards are what need planning: you need Journey, Hope, Surprise and Gathering packs for the four Pikachu Art Rares,
          Surprise for two of the Special Art Rares and Gathering for the third. If you collect the pattern holos by type, the boosted
          types above tell you which release to open. Picking up the rarest cards as singles is often the practical route. The{' '}
          <Link to="/sets/chinese/collect-151-surprise">Collect 151 card list</Link> shows every card.
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
