import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'aura-seeker-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/aura-seeker-${name}.webp`

/** A Japanese snippet in English copy, marked so screen readers pronounce it in Japanese. */
function Ja({ children }: { children: React.ReactNode }) {
  return <span lang="ja">{children}</span>
}
/** A string (an FAQ answer, say) with any Japanese snippets in it wrapped in <Ja>. */
const JA_RUN = /([　-ヿ㐀-鿿＀-￯]+)/
function ja(text: string): React.ReactNode {
  const parts = text.split(JA_RUN)
  if (parts.length === 1) return text
  return parts.map((p, i) => (i % 2 ? <Ja key={i}>{p}</Ja> : <React.Fragment key={i}>{p}</React.Fragment>))
}

// What Pokémon Center Online lists for one pack and one box.
const CONTENTS = [
  { item: 'Booster pack', qty: '5 cards', note: 'Cards are packed at random' },
  { item: 'Booster box', qty: '30 packs', note: '150 cards in all' },
]

// The main set's rarities, counted from the official card database (78 cards).
const RARITIES = [
  { rarity: 'Common', count: 38 },
  { rarity: 'Uncommon', count: 24 },
  { rarity: 'Rare', count: 8 },
  { rarity: 'Double Rare', count: 8 },
]

// The eight Double Rares in the main set. English names are unofficial where marked in the post.
const DOUBLE_RARES = [
  { no: '008/078', name: 'Sceptile ex', jp: 'ジュカインex' },
  { no: '020/078', name: 'Floatzel ex', jp: 'フローゼルex' },
  { no: '030/078', name: 'Mega Absol Z ex', jp: 'メガアブソルZex' },
  { no: '031/078', name: 'Sigilyph ex', jp: 'シンボラーex' },
  { no: '054/078', name: 'Mega Glimmora ex', jp: 'メガキラフロルex' },
  { no: '057/078', name: 'Mega Lucario Z ex', jp: 'メガルカリオZex' },
  { no: '059/078', name: 'Togedemaru ex', jp: 'トゲデマルex' },
  { no: '067/078', name: 'Mega Garchomp Z ex', jp: 'メガガブリアスZex' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is Aura Seeker?' },
  { id: 'contents', label: "What's in a pack and a box?" },
  { id: 'mega-lucario', label: 'Mega Lucario Z ex' },
  { id: 'secret-rare', label: 'The first Special Art Rare: Crasher Wake' },
  { id: 'more-cards', label: 'Other cards revealed' },
  { id: 'card-list', label: 'The card list so far' },
  { id: 'names', label: 'What is it called?' },
  { id: 'not-known', label: 'What has not been announced' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is Aura Seeker?',
    a: 'A Japanese Pokémon TCG expansion in the MEGA series, set code M7. Its Japanese name is 拡張パック「ハドウシーカー」. The main set has 78 cards, led by Mega Lucario Z ex.',
  },
  {
    q: 'When does Aura Seeker release in Japan?',
    a: 'Friday, November 27, 2026.',
  },
  {
    q: 'How many cards are in an Aura Seeker pack?',
    a: '5 cards, packed at random. A booster box holds 30 packs, which is 150 cards.',
  },
  {
    q: 'How many cards are in Aura Seeker?',
    a: 'The main set has 78 cards, numbered 001/078 to 078/078, and all 78 are on the official card database. Secret rares are numbered after 078. Only one has been shown so far, 113/078, and the total has not been announced.',
  },
  {
    q: 'What is the Special Art Rare revealed so far?',
    a: "Crasher Wake's Fervor 113/078, a Supporter card illustrated by manga artist Tetsuo Hara. The card name is an unofficial translation of マキシの熱血.",
  },
  {
    q: 'Is Mega Lucario Z ex on the pack?',
    a: 'Yes. Mega Lucario Z is on the front of the booster pack and the box, and the card is 057/078, a Double Rare with 330 HP.',
  },
  {
    q: 'Are the English card names official?',
    a: 'The Pokémon names are their official English names. The trainer card names, and the "Mega ... Z ex" styling, are unofficial translations of the Japanese and may differ if the cards come out in English.',
  },
  {
    q: 'What language are the cards?',
    a: 'Japanese. This is the Japanese release from The Pokémon Company in Japan.',
  },
  {
    q: 'Is Aura Seeker sold under other names?',
    a: 'Yes. The Japanese name reads Hadō Shīkā, so you may also see Hadou Seeker or Hado Seeker. They are the same set.',
  },
]

export const Route = createFileRoute('/blog/aura-seeker-release-news')({
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
  component: AuraSeekerPost,
})

function AuraSeekerPost() {
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
  const contentsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'What comes in a Japanese Aura Seeker booster pack and booster box',
    numberOfItems: CONTENTS.length,
    itemListElement: CONTENTS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.item}: ${c.qty}` })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contentsJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="The Japanese Pokémon TCG set Aura Seeker (M7) releases on November 27, 2026. This post covers what we know so far: the pack and box, the 78-card main set, Mega Lucario Z ex and the first Special Art Rare."
        cta={{
          heading: 'More new releases',
          body: 'See what is new and what is coming up at EBI Collectibles.',
          links: [
            { to: '/new-and-upcoming', label: 'See new and upcoming releases' },
            { to: '/blog', label: 'Read more release news', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is Aura Seeker?</h2>
        <p>
          Aura Seeker is a Japanese Pokémon TCG expansion in the MEGA series, with the set code M7. Its Japanese name is{' '}
          <Ja>拡張パック「ハドウシーカー」</Ja>, and it releases in Japan on Friday, November 27, 2026.
        </p>
        <p>
          The set is led by Mega Lucario Z ex, which is on the front of the booster pack and the box. Its Ability shares the set's
          name. The main set has 78 cards, and all of them are on the official card database. One secret rare has been shown so far: a
          Special Art Rare of the Supporter Crasher Wake's Fervor, illustrated by manga artist Tetsuo Hara.
        </p>
        <p>
          The Pokémon names in this post are their official English names. The trainer card names and the "Mega ... Z ex" names are
          unofficial translations of the Japanese.
        </p>

        <aside className="fact-box" aria-label="Aura Seeker key facts">
          {/* Same card as in the Mega Lucario section below, where it is described, so this copy is decorative */}
          <img src={img('mega-lucario-z-ex')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>
                Aura Seeker (<Ja>拡張パック「ハドウシーカー」</Ja>)
              </dd>
              <dt>Set code</dt>
              <dd>M7</dd>
              <dt>Releases</dt>
              <dd>November 27, 2026 (Friday), in Japan</dd>
              <dt>Series</dt>
              <dd>Pokémon Card Game MEGA</dd>
              <dt>Pack</dt>
              <dd>5 cards</dd>
              <dt>Box</dt>
              <dd>30 packs</dd>
              <dt>Main set</dt>
              <dd>78 cards</dd>
              <dt>Secret rares</dt>
              <dd>1 shown so far (113/078), total not announced</dd>
              <dt>Language</dt>
              <dd>Japanese</dd>
            </dl>
          </div>
        </aside>

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

        <h2 id="contents">What's in a pack and a box?</h2>
        <p>Going by the official product page and Pokémon Center Online's box listing:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of an Aura Seeker booster pack and booster box
            </caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Holds</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {CONTENTS.map((c) => (
                <tr key={c.item}>
                  <th scope="row">{c.item}</th>
                  <td>{c.qty}</td>
                  <td>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Both the pack and the box show Mega Lucario Z mid-kick in a stadium, wrapped in pink and green ribbons. The set code M7 and
          "5 cards at random" are printed in the top corner of the pack.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('booster-pack')} alt="The Japanese Aura Seeker booster pack, green and pink, with Mega Lucario Z kicking on the front and the set name in Japanese along the bottom" loading="lazy" width={520} height={966} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Booster pack</strong>5 cards
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('booster-box')} alt="The Japanese Aura Seeker booster box, open at the top with two rows of packs showing, and Mega Lucario Z on the raised lid" loading="lazy" width={900} height={1053} style={{ aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Booster box</strong>30 packs
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          In Japan, Pokémon Center Online sold the box by lottery, one entry per person per listing. Entries ran from November 6 to
          November 10 (Japan time), and the box is listed to ship from December 1 to December 18.
        </p>

        <h2 id="mega-lucario">Mega Lucario Z ex</h2>
        <p>
          Mega Lucario Z ex is 057/078, a Double Rare illustrated by takuyoa. It shows Mega Lucario Z lunging forward with a fist out,
          its long blue tassels swirling around it against pink and green streaks.
        </p>
        <p>
          It is a Metal-type Stage 1 Pokémon that evolves from Riolu, with 330 HP. Its Ability, <Ja>ハドウシーカー</Ja> (the set's name),
          works once during your turn while it is in the Active Spot: you search your deck for a Supporter card and put it into your
          hand. Its attack does 120 damage, plus 120 more if your opponent's Active Pokémon is a Pokémon ex. As a Mega Evolution ex, it
          gives up 3 Prize cards when it is Knocked Out.
        </p>
        <ul className="card-grid cols-1">
          <li>
            <figure>
              <img src={img('mega-lucario-z-ex')} alt="Mega Lucario Z ex 057/078: Mega Lucario Z lunging forward with a fist out, blue tassels swirling, on a pink and green background" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Lucario Z ex</strong>057/078 · Double Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="secret-rare">The first Special Art Rare: Crasher Wake</h2>
        <p>
          The one secret rare shown so far is Crasher Wake's Fervor 113/078, a Special Art Rare (<Ja>マキシの熱血</Ja> in Japanese; the
          English card name is an unofficial translation). The official product page says it is illustrated by manga artist Tetsuo
          Hara, and his name is on the card.
        </p>
        <p>
          The illustration shows Crasher Wake in his mask, lunging toward you with one hand reaching out and the other raised, and pale
          fists rising behind him. The card is a Supporter: you choose one of your Water Pokémon in play and shuffle it, with every card
          attached to it, back into your deck. The same Supporter is also in the main set as 076/078, an Uncommon illustrated by GOSSAN.
        </p>
        <ul className="card-grid cols-1">
          <li>
            <figure>
              <img src={img('crasher-wakes-fervor-sar')} alt="Crasher Wake's Fervor 113/078 Special Art Rare by Tetsuo Hara: Crasher Wake in his mask lunging forward with one hand reaching out, pale fists behind him" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Crasher Wake's Fervor</strong>113/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="more-cards">Other cards revealed</h2>
        <p>
          Mega Lucario Z ex is one of three "Z ex" Mega Evolutions in the main set. Floatzel ex is built to go with Crasher Wake's
          Fervor.
        </p>
        <ul>
          <li>
            <strong>Mega Absol Z ex (030/078).</strong> A Psychic-type Basic Pokémon with 270 HP, illustrated by 5ban Graphics. Its
            attack does 160 damage, and during your opponent's next turn they cannot attach Special Energy from their hand or play a
            Stadium.
          </li>
          <li>
            <strong>Mega Garchomp Z ex (067/078).</strong> A Dragon-type Stage 2 Pokémon that evolves from Gabite, with 360 HP,
            illustrated by aky CG Works. One attack does 30 damage for each Dragon Pokémon in your discard pile. The other does 240
            damage and ignores effects on your opponent's Active Pokémon.
          </li>
          <li>
            <strong>Floatzel ex (020/078).</strong> A Water-type Stage 1 Pokémon that evolves from Buizel, with 260 HP, illustrated by
            5ban Graphics. Its first attack does 40 damage plus 100 for each Crasher Wake's Fervor you show from your hand. Its second
            does 150.
          </li>
        </ul>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('mega-absol-z-ex')} alt="Mega Absol Z ex 030/078: Mega Absol Z with its red and pink blades spread wide" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Absol Z ex</strong>030/078 · Double Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mega-garchomp-z-ex')} alt="Mega Garchomp Z ex 067/078: Mega Garchomp Z slashing forward with its jaws open against orange and pink light" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Garchomp Z ex</strong>067/078 · Double Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('floatzel-ex')} alt="Floatzel ex 020/078: Floatzel swimming through a splash of water with its mouth open" loading="lazy" width={788} height={1100} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Floatzel ex</strong>020/078 · Double Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="card-list">The card list so far</h2>
        <p>
          All 78 main set cards are on the official card database. Counted by rarity, the main set has:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rarities" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rarities" className="sr-only">
              Aura Seeker main set cards by rarity
            </caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {RARITIES.map((r) => (
                <tr key={r.rarity}>
                  <th scope="row">{r.rarity}</th>
                  <td>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>The eight Double Rares are:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rr" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rr" className="sr-only">
              Aura Seeker Double Rare cards
            </caption>
            <thead>
              <tr>
                <th scope="col">Number</th>
                <th scope="col">Card</th>
                <th scope="col">Japanese name</th>
              </tr>
            </thead>
            <tbody>
              {DOUBLE_RARES.map((c) => (
                <tr key={c.no}>
                  <td>{c.no}</td>
                  <th scope="row">{c.name}</th>
                  <td>
                    <Ja>{c.jp}</Ja>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Secret rares are numbered after 078. Crasher Wake's Fervor is 113/078, so the numbering runs to at least 113, but the official
          card list does not show cards 079 to 112 yet.
        </p>

        <h2 id="names">What is it called?</h2>
        <p>
          The official name is <Ja>拡張パック「ハドウシーカー」</Ja>, which reads Hadō Shīkā. In English it is usually written as Aura
          Seeker, and that is the name we use.
        </p>

        <h2 id="not-known">What has not been announced</h2>
        <p>
          The main set is fully shown, but the secret rares are not. Only one, 113/078, has been revealed, and the number of secret rares
          and their pull rates have not been announced.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{ja(f.a)}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Mega Lucario Z ex leads the set and is on every pack, and the first secret rare is a Crasher Wake illustrated by Tetsuo Hara.
          The rest of the secret rares have not been shown.
        </p>
      </BlogPostLayout>
    </>
  )
}
