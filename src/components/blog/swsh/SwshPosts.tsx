import * as React from 'react'
import { useId } from 'react'
import { Link } from '@tanstack/react-router'
import { chunk } from '~/lib/chunk'
import { Zh } from '~/components/blog/Zh'
import { RarityAbbr, rarityFullName } from '~/components/blog/RarityAbbr'
import { RARITY_NAME } from '~/components/blog/rarityNames'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage, type BlogPostSummary } from '~/data/blog-posts'
import blogCssUrl from '~/styles/blog.css?url'
import { EN_SET_NAME, type EnSet, type SwshBlogSet, type SwshCard } from '~/data/swsh-blog/types'

// Shared layout for the Simplified Chinese Sword & Shield series: a set
// overview, a card origins guide and a set guide for each booster set. Each
// set's facts live in src/data/swsh-blog/<set>.ts; this file only arranges
// them, so every set's three posts read the same way.

type Status = { live: boolean; liveAt: string | null }

/** Rarity code from "Hyper Rare (HR)" -> "HR". */
const code = (r: string) => r.match(/\(([^)]+)\)/)?.[1] ?? r

/** The order the set lists its rarities, lowest first. */
const TIER_ORDER = ['C', 'U', 'R', 'RR', 'RRR', 'S', 'SR', 'SSR', 'HR', 'UR']

/** What each Simplified Chinese Sword & Shield rarity is, in English-collector terms. */
const TIER_MEANING: Record<string, string> = {
  C: 'Common',
  U: 'Uncommon',
  R: 'Rare, including holo Rares',
  RR: 'Pokémon V',
  RRR: 'Pokémon VMAX',
  S: 'Shiny Pokémon (the Shiny Vault cards in English)',
  SR: 'Full art Pokémon V and full art Supporters',
  SSR: 'Shiny Pokémon V and VMAX',
  HR: 'Rainbow Pokémon VMAX and rainbow Supporters',
  UR: 'Gold Items, Tools, Stadiums and Pokémon',
}

const meaning = (set: SwshBlogSet, tier: string) => set.tierMeaning?.[tier] ?? TIER_MEANING[tier] ?? ''

export function swshHead(post: BlogPostSummary, loaderData: Status | undefined) {
  return {
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
  }
}

type Faq = { q: string; a: string }

function JsonLd({ post, status, faq }: { post: BlogPostSummary; status: Status; faq: Faq[] }) {
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
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
    </>
  )
}

function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="toc" aria-label="In this guide">
      <p className="toc-title">In this guide</p>
      <ol>
        {items.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`}>{t.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function FaqList({ faq }: { faq: Faq[] }) {
  return (
    <div className="faq">
      {faq.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  const id = useId()
  return (
    <div className="table-scroll" role="group" aria-labelledby={id} tabIndex={0}>
      <table className="data-table">
        <caption id={id} className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th scope="row">{r[0]}</th>
              {r.slice(1).map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Gallery({ set, cards, cols }: { set: SwshBlogSet; cards: SwshCard[]; cols: number }) {
  return (
    <ul className={`card-grid cols-${cols}`}>
      {cards.map((c) => (
        <li key={c.number}>
          <figure>
            <img src={c.image} alt={`${c.name} ${c.number} ${rarityFullName(c.rarity)}, ${set.name}`} loading="lazy" width={300} height={419} />
            <figcaption>
              <strong>{c.name}</strong>
              {c.number} · {rarityFullName(c.rarity)}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

// ---------- shared facts, worked out from the set's card data ----------

function facts(set: SwshBlogSet) {
  const cards = set.data.cards
  const no = (c: SwshCard) => +c.number.slice(0, 3)
  const main = cards.filter((c) => no(c) <= set.mainCount)
  const secret = cards.filter((c) => no(c) > set.mainCount)
  const tiers = TIER_ORDER.map((t) => {
    const list = cards.filter((c) => code(c.rarity) === t)
    if (!list.length) return null
    const nums = list.map(no)
    const inSecret = nums.every((n) => n > set.mainCount)
    const range = inSecret ? `${String(Math.min(...nums)).padStart(3, '0')} to ${String(Math.max(...nums)).padStart(3, '0')}` : 'Main set, mixed in'
    return { tier: t, name: RARITY_NAME[t] ?? t, count: list.length, range, inSecret, cards: list }
  }).filter((t): t is NonNullable<typeof t> => t !== null)
  const reverse = cards.filter((c) => ['C', 'U', 'R'].includes(code(c.rarity))).length
  const pokemon = set.mainPokemon
  const byNo = new Map(cards.map((c) => [c.number.slice(0, 3), c]))
  return { cards, main, secret, tiers, reverse, prints: cards.length + reverse, pokemon, byNo }
}

function originStats(set: SwshBlogSet) {
  const f = facts(set)
  const rows = set.origins.map(([cn, src, en, illus]) => {
    const c = f.byNo.get(cn)!
    return { cn, src, en, illus, name: c.name, rarity: code(c.rarity), image: c.image }
  })
  const counts = (Object.keys(EN_SET_NAME) as EnSet[])
    .map((s) => ({ s, n: rows.filter((r) => r.src === s).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
  const top = counts.slice(0, 3).map((c) => c.s)
  return { f, rows, counts, top }
}

const p3 = (n: number) => String(n).padStart(3, '0')
const nf = (n: number) => n.toLocaleString('en-US')
/** "Hyper Rare" -> "Hyper Rares", "Shiny" -> "Shiny cards". */
const plural = (name: string) => (name === 'Shiny' ? 'Shiny cards' : `${name}s`)

// ---------- set overview ----------

export function SwshOverviewPost({ set, post, status }: { set: SwshBlogSet; post: BlogPostSummary; status: Status }) {
  const f = facts(set)
  const { counts } = originStats(set)
  const headline = set.headline.map((n) => f.byNo.get(n)!).filter(Boolean)
  const lead = headline[0]
  const topSecret = f.tiers.filter((t) => t.inSecret)
  const enList = counts.slice(0, 4).map((c) => `${EN_SET_NAME[c.s]} (${c.n})`)
  const others = counts.length - 4
  const faq: Faq[] = [
    { q: `When was ${set.name} released?`, a: `${set.releasedText}, in mainland China. It is a Simplified Chinese set from the Sword & Shield series.` },
    {
      q: `How many cards are in ${set.name}?`,
      a: `${f.cards.length} numbered cards: ${set.mainCount} in the main set and ${f.secret.length} secret cards numbered above ${set.mainCount}. Counting the reverse type holo of every Common, Uncommon and Rare, the official card database lists ${f.prints} prints.`,
    },
    {
      q: `What packs was ${set.name} sold in?`,
      a: set.packs.map((p) => `${p.label}: ${p.detail}.`).join(' '),
    },
    {
      q: `Is ${set.name} the same as an English set?`,
      a: `No. Its cards match several English Sword & Shield sets, mostly ${enList.join(', ')}${others > 0 ? `, plus ${others} more` : ''}. Our card origins guide lists the English twin of every card.`,
    },
    ...(set.partner
      ? [{ q: `What is the difference between ${set.name} and ${set.partner.name}?`, a: `They are the two halves of one release, out on the same day with separate card lists and their own packs. ${set.theme}` }]
      : []),
    {
      q: `Did Pokémon China publish pull rates for ${set.name}?`,
      a: 'Not that we could find. Pokémon China publishes odds charts for its newer Scarlet & Violet sets, but its product pages for this set give only the cards and holos per pack.',
    },
    { q: `What is ${set.name} called in Chinese?`, a: `${set.zh}, set code ${set.code} (printed on the cards as ${set.mark}). The English name is a translation; the set has no official English name.` },
  ]
  const toc = [
    { id: 'packs', label: 'How it was sold' },
    { id: 'rarities', label: 'Set size and rarities' },
    { id: 'headline', label: 'The cards to know' },
    { id: 'chinese-only', label: 'What only the Chinese printing has' },
    { id: 'origins', label: 'Where the cards come from' },
    ...(set.products.length ? [{ id: 'products', label: 'Other products with these packs' }] : []),
    { id: 'faq', label: 'FAQ' },
  ]
  return (
    <>
      <JsonLd post={post} status={status} faq={faq} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`${set.name} (${set.code}) released in mainland China on ${set.releasedText}. ${set.theme}`}
        cta={{
          heading: `See every ${set.name} card`,
          body: `The full card list shows all ${f.cards.length} cards with their numbers and rarities.`,
          links: [{ to: set.cardListPath, label: 'See the full card list' }],
        }}
      >
        <p>
          {set.name} (<Zh>{set.zh}</Zh>, set code {set.code}) is a Simplified Chinese Pokémon TCG set from the Sword & Shield series. It
          has {f.cards.length} cards: {set.mainCount} in the main set and {f.secret.length} secret cards. {set.japaneseSources}
        </p>
        <p>
          Our <Link to={`/blog/${set.key}-card-origins` as never}>card origins guide</Link> matches every card to its English version,
          and our <Link to={`/blog/${set.key}-set-guide` as never}>set guide</Link> shows every secret card and what a master set takes.
        </p>

        <aside className="fact-box" aria-label={`${set.name} key facts`}>
          {lead && <img src={lead.image} alt={`${lead.name} ${lead.number} ${rarityFullName(lead.rarity)}, ${set.name}`} loading="lazy" width={300} height={419} />}
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>
                {set.name} (<Zh>{set.zh}</Zh>)
              </dd>
              <dt>Set code</dt>
              <dd>
                {set.code} (printed {set.mark})
              </dd>
              <dt>Released</dt>
              <dd>{set.releasedText}, mainland China</dd>
              {set.packs.map((p) => (
                <React.Fragment key={p.label}>
                  <dt>{p.label}</dt>
                  <dd>{p.detail}</dd>
                </React.Fragment>
              ))}
              <dt>Set size</dt>
              <dd>
                {f.cards.length} cards: {set.mainCount} main set, {f.secret.length} secret
              </dd>
              <dt>Top rarities</dt>
              <dd>{topSecret.slice(-2).map((t) => t.name).reverse().join(' and ')}</dd>
              {set.partner && (
                <>
                  <dt>Other half</dt>
                  <dd>{set.partner.name}</dd>
                </>
              )}
            </dl>
          </div>
        </aside>

        <Toc items={toc} />

        <h2 id="packs">How it was sold</h2>
        <p>
          {set.packs.length === 1
            ? `Pokémon China sold ${set.name} in one pack size:`
            : `Pokémon China sold ${set.name} in ${set.packs.length} pack sizes with the same card list:`}
        </p>
        <DataTable caption={`${set.name} pack sizes`} head={['Pack', 'Contents']} rows={set.packs.map((p) => [p.label, p.detail])} />
        <p className="table-note">Prices and holos per pack from Pokémon China's product page. Pokémon China did not publish an odds chart for this set.</p>

        <h2 id="rarities">Set size and rarities</h2>
        <p>
          The main set runs 001 to {p3(set.mainCount)}, with {f.pokemon} Pokémon and the rest Trainers and Energy. Everything numbered above{' '}
          {set.mainCount} is a secret card.
        </p>
        <DataTable
          caption={`${set.name} rarities`}
          head={['Rarity', 'Cards', 'Numbers', 'What it is']}
          rows={f.tiers.map((t) => [`${t.name} (${t.tier})`, t.count, t.range, meaning(set, t.tier)])}
        />

        <h2 id="headline">The cards to know</h2>
        <p>{set.headlineNote}</p>
        <Gallery set={set} cards={headline} cols={3} />

        <h2 id="chinese-only">What only the Chinese printing has</h2>
        <p>
          Every Common, Uncommon and Rare in {set.name} also comes as a reverse type holo with the same number, a print that only
          Simplified Chinese sets have. That adds {f.reverse} cards, so the official card database lists {f.prints} prints in all. Every
          holo, reverse holos included, has an English Pokémon logo embossed at the bottom left as a mark of authenticity.
        </p>

        <h2 id="origins">Where the cards come from</h2>
        <p>
          Every card in {set.name} has an English print with the same art, spread across several Sword & Shield sets. By card count the biggest sources
          are {enList.join(', ')}
          {others > 0 ? `, with ${others} other English sets and promos supplying the rest` : ''}. The{' '}
          <Link to={`/blog/${set.key}-card-origins` as never}>card origins guide</Link> lists every card's English twin.
        </p>

        {set.products.length > 0 && (
          <>
            <h2 id="products">Other products with these packs</h2>
            <p>Pokémon China also sold these products with {set.name} cards or packs in them:</p>
            <DataTable
              caption={`Other products with ${set.name} cards or packs`}
              head={['Product', 'Released', 'What was in it']}
              rows={set.products.map((p) => [`${p.name} (${p.zh})`, p.released, p.contents])}
            />
            <p className="table-note">From Pokémon China's product catalogue.</p>
          </>
        )}

        <h2 id="faq">FAQ</h2>
        <FaqList faq={faq} />
      </BlogPostLayout>
    </>
  )
}

// ---------- card origins ----------

export function SwshOriginsPost({ set, post, status }: { set: SwshBlogSet; post: BlogPostSummary; status: Status }) {
  const { f, rows, counts, top } = originStats(set)
  const main = rows.filter((r) => +r.cn <= set.mainCount)
  const secret = rows.filter((r) => +r.cn > set.mainCount)
  const mainTop = (Object.keys(EN_SET_NAME) as EnSet[])
    .map((s) => ({ s, n: main.filter((r) => r.src === s).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
  const mainOther = main.length - mainTop.reduce((a, c) => a + c.n, 0)
  const tierRows = f.tiers.map((t) => {
    const list = rows.filter((r) => r.rarity === t.tier)
    const n = (s: EnSet) => list.filter((r) => r.src === s).length
    return [`${t.name} (${t.tier})`, ...top.map((s) => n(s) || '–'), list.filter((r) => !top.includes(r.src)).length || '–', list.length]
  })
  const promo = rows.filter((r) => r.src === 'swshp')
  const shiny = rows.filter((r) => r.src === 'swsh45sv').length
  const shinyAll = rows.filter((r) => r.rarity === 'S' || r.rarity === 'SSR').length
  const later = rows.filter((r) => !['swsh1', 'swsh2', 'swsh3', 'swsh35', 'swsh4', 'swsh45', 'swsh45sv', 'swshp'].includes(r.src))
  const faq: Faq[] = [
    {
      q: `Which English set is ${set.name}?`,
      a: `There is no single one. Its ${rows.length} cards match ${counts.length} English sources, mostly ${counts
        .slice(0, 3)
        .map((c) => `${EN_SET_NAME[c.s]} (${c.n})`)
        .join(', ')}.`,
    },
    { q: `Are there any Chinese Exclusives in ${set.name}?`, a: `No. Every card in ${set.name} matches an English card with the same illustration.` },
    ...(shiny
      ? [
          {
            q: `Where do the shiny cards come from?`,
            a:
              shinyAll === shiny
                ? `${shiny} cards, the Shiny and Shiny Super Rare cards, match the Shiny Vault of Shining Fates, the English set that collected the Japanese Shiny Star V cards.`
                : `${shiny} of the ${shinyAll} shiny cards match the Shiny Vault of Shining Fates, the English set that collected the Japanese Shiny Star V cards. The other ${shinyAll - shiny} match other English prints, listed in the secret card table.`,
          },
        ]
      : []),
    ...(promo.length
      ? [{ q: `Are any ${set.name} cards English promos?`, a: `${promo.length === 1 ? 'One' : promo.length}: ${promo.map((p) => `${p.name} ${p.cn} matches ${p.en}`).join(', ')} in the SWSH Black Star Promos.` }]
      : []),
    { q: 'How were the cards matched?', a: "By name and illustrator first, then by comparing each Chinese card's scan with the English scans. Where the same art was printed in more than one English set, we list the main expansion it first appeared in." },
  ]
  const toc = [
    { id: 'at-a-glance', label: 'At a glance' },
    { id: 'patterns', label: 'Patterns worth knowing' },
    { id: 'secret', label: `All ${secret.length} secret cards` },
    { id: 'main-set', label: `The ${main.length}-card main set` },
    { id: 'faq', label: 'FAQ' },
  ]
  return (
    <>
      <JsonLd post={post} status={status} faq={faq} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`${set.name} collects cards from several English Sword & Shield sets. We matched all ${rows.length} cards to the English card with the same illustration.`}
        cta={{
          heading: `See every ${set.name} card`,
          body: `The full card list shows all ${rows.length} cards with their numbers and rarities.`,
          links: [{ to: set.cardListPath, label: 'See the full card list' }],
        }}
      >
        <p>
          {set.name} (set code {set.code}) released on {set.releasedText}. It does not follow one English set: its {rows.length} cards match{' '}
          {counts.length} English sets and promos, and every card has an English twin with the same illustration. This guide maps every
          card.
        </p>
        <p>
          Our <Link to={`/blog/${set.key}-release-news` as never}>set overview</Link> covers how the set was sold, and our{' '}
          <Link to={`/blog/${set.key}-set-guide` as never}>set guide</Link> shows every secret card.
        </p>

        <Toc items={toc} />

        <h2 id="at-a-glance">At a glance</h2>
        <DataTable caption="Cards by rarity and English source" head={['Rarity', ...top.map((s) => EN_SET_NAME[s]), 'Other', 'Total']} rows={tierRows} />
        <p className="table-note">
          Rarity is the Chinese rarity. Super Rare matches the English full art Ultra Rare, Hyper Rare matches the rainbow Secret Rare, and
          Ultra Rare matches the gold Secret Rare.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>No Chinese Exclusives.</strong> Every card matches an English card with the same art. Unlike the newer Scarlet & Violet
          sets, {set.name} has no cards drawn for China.
        </p>
        {shiny > 0 && (
          <p>
            <strong>{shinyAll === shiny ? 'The shiny cards are the Shiny Vault.' : 'Most shiny cards are the Shiny Vault.'}</strong> {shiny} cards
            match the Shining Fates Shiny Vault, the English home of the Japanese Shiny Star V cards.
            {shinyAll > shiny &&
              ` The other ${shinyAll - shiny}, ${rows
                .filter((r) => (r.rarity === 'S' || r.rarity === 'SSR') && r.src !== 'swsh45sv')
                .map((r) => `${r.name} ${r.cn} (${EN_SET_NAME[r.src]} ${r.en})`)
                .join(', ')}, match other English prints.`}
          </p>
        )}
        {later.length > 0 && (
          <p>
            <strong>{later.length === 1 ? 'One card comes' : 'Some cards come'} from later English sets.</strong>{' '}
            {later.map((r) => `${r.name} ${r.cn} matches ${EN_SET_NAME[r.src]} ${r.en}`).join(', and ')}.
          </p>
        )}
        {set.creditNotes && set.creditNotes.length > 0 && (
          <p>
            <strong>{set.creditNotes.length === 1 ? 'One card credits' : 'Some cards credit'} a different illustrator.</strong>{' '}
            {set.creditNotes.map((c) => `${c.name} ${c.cn} credits ${c.zhCredit}, while the English print of the same art credits ${c.enCredit}`).join('. ')}.
            The tables below show the credit printed on the Chinese card.
          </p>
        )}
        <p>
          <strong>Every English source, from most cards to fewest:</strong>
        </p>
        <DataTable caption="English sources and card counts" head={['English source', 'Cards']} rows={counts.map((c) => [EN_SET_NAME[c.s], c.n])} />

        <h2 id="secret">All {secret.length} secret cards</h2>
        <p>Every card above {set.mainCount}, with its English twin.</p>
        <OriginsTable list={secret} caption="Secret cards and the English card each one matches" />

        <h2 id="main-set">The {main.length}-card main set</h2>
        <p>
          {mainTop.map((c, i) => `${c.n} main-set cards match ${EN_SET_NAME[c.s]}${i < mainTop.length - 1 ? ', ' : ''}`)}
          {mainOther ? `, and ${mainOther} match other English sources.` : '.'}
        </p>
        <OriginsTable list={main} caption="Main set cards and the English card each one matches" />

        <h2 id="faq">FAQ</h2>
        <FaqList faq={faq} />
      </BlogPostLayout>
    </>
  )
}

function OriginsTable({ list, caption }: { list: { cn: string; src: EnSet; en: string; illus: string; name: string; rarity: string }[]; caption: string }) {
  const captionId = useId()
  return (
    <div className="table-scroll table-tall" role="group" aria-labelledby={captionId} tabIndex={0}>
      <table className="data-table origins-table">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Card</th>
            <th scope="col">English card</th>
          </tr>
        </thead>
        {chunk(list, 20).map((group, g) => (
          <tbody key={g}>
            {group.map((r) => (
              <tr key={r.cn}>
                <th scope="row">{r.cn}</th>
                <td>
                  {r.name}
                  <span className="cell-sub">
                    <RarityAbbr code={r.rarity} />
                  </span>
                </td>
                <td>
                  {EN_SET_NAME[r.src]} {r.en}
                  {r.illus ? <span className="cell-sub">Illus. {r.illus}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

// ---------- set guide ----------

export function SwshGuidePost({ set, post, status }: { set: SwshBlogSet; post: BlogPostSummary; status: Status }) {
  const f = facts(set)
  const secretTiers = f.tiers.filter((t) => t.inSecret).reverse()
  const ladder = set.ladderNames
    .map((name) => ({
      name,
      nos: secretTiers
        .slice()
        .reverse()
        .map((t) => f.cards.filter((c) => c.name === name && code(c.rarity) === t.tier).map((c) => c.number.slice(0, 3)).join(', ') || '–'),
      main: f.main.filter((c) => c.name === name).map((c) => c.number.slice(0, 3)).join(', ') || '–',
    }))
    .filter((l) => l.nos.some((n) => n !== '–'))
  // Only the secret rarities a ladder card actually prints at.
  const ladderCols = secretTiers
    .slice()
    .reverse()
    .map((t, i) => ({ t, i }))
    .filter(({ i }) => ladder.some((l) => l.nos[i] !== '–'))
  const top = secretTiers[0]
  const faq: Faq[] = [
    {
      q: `What are the rarest cards in ${set.name}?`,
      a: `The ${secretTiers
        .slice(0, 2)
        .map((t) => `${t.count} ${plural(t.name)} (${t.range})`)
        .join(' and the ')}. Pokémon China did not publish pull rates for this set, so there is no official figure for how rare each one is.`,
    },
    {
      q: `How many cards are in a ${set.name} master set?`,
      a: `${f.prints}: the ${f.cards.length} numbered cards plus a reverse type holo of each of the ${f.reverse} Commons, Uncommons and Rares.`,
    },
    { q: `How many secret cards are there?`, a: `${f.secret.length}, numbered ${p3(set.mainCount + 1)} to ${p3(f.cards.length)}: ${secretTiers.slice().reverse().map((t) => `${t.count} ${t.name}`).join(', ')}.` },
    { q: 'What are the odds of pulling a Hyper Rare or Ultra Rare?', a: 'Pokémon China did not publish an odds chart for this set, so we do not estimate one. Its product pages give only the cards and holos in each pack.' },
  ]
  const toc = [
    { id: 'numbering', label: 'How the numbers work' },
    ...secretTiers.map((t) => ({ id: `tier-${t.tier.toLowerCase()}`, label: `All ${t.count} ${plural(t.name)}` })),
    ...(ladder.length ? [{ id: 'ladders', label: 'One card, several rarities' }] : []),
    { id: 'master-set', label: 'Chasing a master set' },
    { id: 'faq', label: 'FAQ' },
  ]
  return (
    <>
      <JsonLd post={post} status={status} faq={faq} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede={`Every secret card in ${set.name}, from the ${top?.name ?? 'top'} cards down, with how the numbering works and what a ${f.prints}-card master set takes.`}
        cta={{
          heading: `Collect ${set.name}`,
          body: `Track the cards you have on the full card list.`,
          links: [{ to: set.cardListPath, label: 'See the full card list' }],
        }}
      >
        <p>
          {set.name} (<Zh>{set.zh}</Zh>, set code {set.code}) released on {set.releasedText}. It has {f.cards.length} numbered cards, and{' '}
          {f.secret.length} of them are secret cards above {set.mainCount}. Use this guide to sort your pulls or plan a master set.
        </p>
        <p>
          Our <Link to={`/blog/${set.key}-release-news` as never}>set overview</Link> covers how the set was sold, and our{' '}
          <Link to={`/blog/${set.key}-card-origins` as never}>card origins guide</Link> matches every card to its English version.
        </p>

        <Toc items={toc} />

        <h2 id="numbering">How the numbers work</h2>
        <p>
          Every card has one number out of {set.mainCount}. The main set runs 001 to {p3(set.mainCount)} and mixes Commons, Uncommons, Rares,
          Pokémon V and VMAX by type. Everything above {set.mainCount} is a secret card, grouped by rarity:
        </p>
        <DataTable caption="How the numbers work" head={['Numbers', 'Rarity', 'Cards', 'What it is']} rows={f.tiers.map((t) => [t.range, `${t.name} (${t.tier})`, t.count, meaning(set, t.tier)])} />
        <p className="table-note">Pokémon China did not publish an odds chart for this set, so this guide gives card counts, not pull rates.</p>

        {secretTiers.map((t) => (
          <React.Fragment key={t.tier}>
            <h2 id={`tier-${t.tier.toLowerCase()}`}>
              All {t.count} {plural(t.name)}
            </h2>
            <p>
              Numbered {t.range}. {meaning(set, t.tier)}.
            </p>
            <Gallery set={set} cards={t.cards} cols={t.cards.length > 8 ? 4 : t.cards.length >= 4 ? 4 : 3} />
          </React.Fragment>
        ))}

        {ladder.length > 0 && (
          <>
            <h2 id="ladders">One card, several rarities</h2>
            <p>Some cards print again in the secret set. These are the numbers each one prints at:</p>
            <DataTable
              caption="One card, several rarities"
              head={['Card', 'Main set', ...ladderCols.map(({ t }) => t.name)]}
              rows={ladder.map((l) => [l.name, l.main, ...ladderCols.map(({ i }) => l.nos[i])])}
            />
          </>
        )}

        <h2 id="master-set">Chasing a master set</h2>
        <p>
          The numbered set is {nf(f.cards.length)} cards. A master set adds the reverse type holo of all {f.reverse} Commons, Uncommons and
          Rares, for {nf(f.prints)} in total. The{' '}
          <Link to={set.cardListPath as never}>{set.name} card list</Link> shows every card and lets you track the ones you have.
        </p>

        <h2 id="faq">FAQ</h2>
        <FaqList faq={faq} />
      </BlogPostLayout>
    </>
  )
}
