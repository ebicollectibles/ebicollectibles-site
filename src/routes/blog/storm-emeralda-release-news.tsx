import * as React from 'react'
import { BlogEmailSignup } from '~/components/blog/BlogEmailSignup'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'storm-emeralda-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/storm-emeralda-${name}.webp`

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

// What the official product page and Pokémon Center Online list for one pack and one box.
const CONTENTS = [
  { item: 'Booster pack', qty: '5 cards', note: 'Cards are packed at random' },
  { item: 'Booster box', qty: '30 packs', note: '150 cards in all' },
]

// Rarities, counted from the rarity marks on the official card database (113 cards).
const RARITIES = [
  { rarity: 'Common', count: 38, part: 'Main set' },
  { rarity: 'Uncommon', count: 22, part: 'Main set' },
  { rarity: 'Rare', count: 8, part: 'Main set' },
  { rarity: 'Double Rare', count: 8, part: 'Main set' },
  { rarity: 'Art Rare', count: 12, part: 'Secret rare' },
  { rarity: 'Super Rare', count: 18, part: 'Secret rare' },
  { rarity: 'Special Art Rare', count: 6, part: 'Secret rare' },
  { rarity: 'Mega Ultra Rare', count: 1, part: 'Secret rare' },
]

// The eight Double Rares in the main set.
const DOUBLE_RARES = [
  { no: '009/076', name: 'Mega Golisopod ex', jp: 'メガグソクムシャex' },
  { no: '015/076', name: 'Heat Rotom ex', jp: 'ヒートロトムex' },
  { no: '021/076', name: 'Wishiwashi ex', jp: 'ヨワシex' },
  { no: '024/076', name: 'Raikou ex', jp: 'ライコウex' },
  { no: '033/076', name: 'Mega Golurk ex', jp: 'メガゴルーグex' },
  { no: '048/076', name: 'Mega Malamar ex', jp: 'メガカラマネロex' },
  { no: '058/076', name: 'Mega Rayquaza ex', jp: 'メガレックウザex' },
  { no: '062/076', name: 'Talonflame ex', jp: 'ファイアローex' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is Storm Emeralda?' },
  { id: 'contents', label: "What's in a pack and a box?" },
  { id: 'mega-rayquaza', label: 'Mega Rayquaza ex' },
  { id: 'special-art-rares', label: 'The other Special Art Rares' },
  { id: 'stadiums', label: 'Two-card Legendary Stadiums' },
  { id: 'card-list', label: 'Card count and rarities' },
  { id: 'english', label: 'Storm Emeralda and Delta Reign' },
  { id: 'email', label: 'Get an email when it is listed' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is Storm Emeralda?',
    a: 'A Japanese Pokémon TCG expansion in the MEGA series, set code M6. Its Japanese name is 拡張パック「ストームエメラルダ」. It has 113 cards and is led by Mega Rayquaza ex.',
  },
  {
    q: 'When did Storm Emeralda release in Japan?',
    a: 'Friday, July 31, 2026.',
  },
  {
    q: 'How many cards are in a Storm Emeralda pack?',
    a: '5 cards, packed at random. A booster box holds 30 packs, which is 150 cards.',
  },
  {
    q: 'How many cards are in Storm Emeralda?',
    a: '113. The main set is 001/076 to 076/076, and 37 secret rares are numbered 077 to 113.',
  },
  {
    q: 'What are the rarest Mega Rayquaza ex cards?',
    a: 'Mega Rayquaza ex has four versions: the Double Rare 058/076, the Super Rare 095/076, the Special Art Rare 110/076 by Kazuki Minami, and the gold Mega Ultra Rare 113/076, the last card in the set.',
  },
  {
    q: 'Does Storm Emeralda have basic Energy cards?',
    a: 'No. The official site says the set has no basic Energy cards. It does have three special Energy cards.',
  },
  {
    q: 'Is Storm Emeralda the Japanese version of Delta Reign?',
    a: 'Card databases such as Bulbapedia and Limitless TCG list Storm Emeralda as the Japanese set behind the English Delta Reign. The Japanese official pages do not mention Delta Reign, and the English set has more cards.',
  },
  {
    q: 'Are the English card names official?',
    a: 'The Pokémon names are their official English names. The trainer card names are the ones these cards have in the English Delta Reign set, going by the Limitless TCG card list, not a Japanese official page.',
  },
  {
    q: 'What language are the cards?',
    a: 'Japanese. This is the Japanese release from The Pokémon Company in Japan.',
  },
]

export const Route = createFileRoute('/blog/storm-emeralda-release-news')({
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
  component: StormEmeraldaPost,
})

const cardStyle = { background: 'transparent', boxShadow: 'none' } as const
const productStyle = { aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' } as const

function StormEmeraldaPost() {
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
    name: 'What comes in a Japanese Storm Emeralda booster pack and booster box',
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
        lede="The Japanese Pokémon TCG set Storm Emeralda (M6) released on July 31, 2026. This post covers the pack and box, the 113-card list, all four Mega Rayquaza ex cards and the other Special Art Rares."
        cta={{
          heading: 'More new releases',
          body: 'See what is new and what is coming up at EBI Collectibles.',
          links: [
            { to: '/new-and-upcoming', label: 'See new and upcoming releases' },
            { to: '/blog', label: 'Read more release news', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is Storm Emeralda?</h2>
        <p>
          Storm Emeralda is a Japanese Pokémon TCG expansion in the MEGA series, with the set code M6. Its Japanese name is{' '}
          <Ja>拡張パック「ストームエメラルダ」</Ja>, and it released in Japan on Friday, July 31, 2026.
        </p>
        <p>
          The set is led by Mega Rayquaza ex, which is on the front of the booster pack and the box. Its attack shares the set's name.
          The set has 113 cards: a 76-card main set and 37 secret rares, including a Special Art Rare and a gold Mega Ultra Rare of
          Mega Rayquaza ex.
        </p>
        <p>
          The Pokémon names in this post are their official English names. Attack and Ability names are given in Japanese, with what
          they do in English. The full card list is on our{' '}
          <Link to="/sets/japanese/storm-emeralda-m6">Japanese Storm Emeralda card list</Link>.
        </p>

        <aside className="fact-box" aria-label="Storm Emeralda key facts">
          {/* Same card as in the Mega Rayquaza section below, where it is described, so this copy is decorative */}
          <img src={img('mega-rayquaza-ex')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>
                Storm Emeralda (<Ja>拡張パック「ストームエメラルダ」</Ja>)
              </dd>
              <dt>Set code</dt>
              <dd>M6</dd>
              <dt>Released</dt>
              <dd>July 31, 2026 (Friday), in Japan</dd>
              <dt>Series</dt>
              <dd>Pokémon Card Game MEGA</dd>
              <dt>Pack</dt>
              <dd>5 cards</dd>
              <dt>Box</dt>
              <dd>30 packs</dd>
              <dt>Cards</dt>
              <dd>113: 76 in the main set, 37 secret rares</dd>
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
              Contents of a Storm Emeralda booster pack and booster box
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
          Both the pack and the box show Mega Rayquaza coiling through yellow lightning on a blue and red background, with the set
          name in green Japanese letters along the bottom. The set code M6 and "5 cards at random" are printed in the top corner of the
          pack.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('booster-pack')} alt="The Japanese Storm Emeralda booster pack, with Mega Rayquaza coiling through yellow lightning and the set name in green Japanese letters along the bottom" loading="lazy" width={520} height={926} style={productStyle} />
              <figcaption>
                <strong>Booster pack</strong>5 cards
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('booster-box')} alt="The Japanese Storm Emeralda booster box, open at the top with two rows of packs showing, and Mega Rayquaza on the raised lid" loading="lazy" width={900} height={1052} style={productStyle} />
              <figcaption>
                <strong>Booster box</strong>30 packs
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The set came out in July, and Pokémon Center Online has since sold the box again by lottery.
        </p>

        <h2 id="mega-rayquaza">Mega Rayquaza ex</h2>
        <p>
          Mega Rayquaza ex is a Colorless-type Basic Pokémon with 280 HP. Its Ability, <Ja>はしゃのほうこう</Ja>, works once when you
          put it onto your Bench from your hand during your turn: you look at the top 4 cards of your deck and may attach a basic
          Energy from them to it. Its attack, <Ja>ストームエメラルダ</Ja> (the set's name), costs a Fire, a Lightning and a Colorless
          Energy and does 50 damage for each Fire and Lightning Energy attached to all of your Pokémon. As a Mega Evolution ex, it
          gives up 3 Prize cards when it is Knocked Out.
        </p>
        <p>There are four versions, all with the same text:</p>
        <ul>
          <li>
            <strong>058/076, Double Rare</strong>, illustrated by takuyoa. Mega Rayquaza bursts toward you with its jaws open, against
            pink lightning and blue streaks.
          </li>
          <li>
            <strong>095/076, Super Rare</strong>, illustrated by 5ban Graphics. A full-card Mega Rayquaza on a textured yellow and
            blue background.
          </li>
          <li>
            <strong>110/076, Special Art Rare</strong>, illustrated by Kazuki Minami. Mega Rayquaza twists through a storm of golden
            light and red streaks.
          </li>
          <li>
            <strong>113/076, Mega Ultra Rare</strong>, illustrated by takuyoa. The whole card is gold, with Mega Rayquaza drawn in
            gold line art. It is the last card in the set.
          </li>
        </ul>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('mega-rayquaza-ex')} alt="Mega Rayquaza ex 058/076 by takuyoa: Mega Rayquaza bursting forward with its jaws open, against pink lightning and blue streaks" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Rayquaza ex</strong>058/076 · Double Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mega-rayquaza-ex-sr')} alt="Mega Rayquaza ex 095/076 Super Rare by 5ban Graphics: a full-card Mega Rayquaza on a textured yellow and blue background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Rayquaza ex</strong>095/076 · Super Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mega-rayquaza-ex-sar')} alt="Mega Rayquaza ex 110/076 Special Art Rare by Kazuki Minami: Mega Rayquaza twisting through a storm of golden light and red streaks" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Rayquaza ex</strong>110/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mega-rayquaza-ex-mur')} alt="Mega Rayquaza ex 113/076 Mega Ultra Rare by takuyoa: an all-gold card with Mega Rayquaza drawn in gold line art" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Rayquaza ex</strong>113/076 · Mega Ultra Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="special-art-rares">The other Special Art Rares</h2>
        <p>Next to Mega Rayquaza ex, the set has five more Special Art Rares, three Pokémon and two Supporters:</p>
        <ul>
          <li>
            <strong>Mega Golisopod ex 107/076</strong>, illustrated by nagimiso. A Grass-type Stage 1 Pokémon with 340 HP, slashing
            with its claws over bright coloured streaks.
          </li>
          <li>
            <strong>Raikou ex 108/076</strong>, illustrated by Oku. A Lightning-type Basic Pokémon with 200 HP, leaping down through
            lightning among tall rock pillars.
          </li>
          <li>
            <strong>Mega Golurk ex 109/076</strong>, illustrated by Takeshi Nakamura. A Psychic-type Stage 1 Pokémon with 350 HP,
            glowing yellow in front of old ruins at sunset.
          </li>
          <li>
            <strong>Aarune 111/076</strong> (<Ja>ギリー</Ja>), illustrated by Shimaris Yukichi. Aarune runs along a forest path by a
            waterfall, holding up a red flag. The Supporter lets you search your deck for up to 3 Supporter and Stadium cards in total
            and put them into your hand.
          </li>
          <li>
            <strong>Zinnia's Trust 112/076</strong> (<Ja>ヒガナの信頼</Ja>), illustrated by Teeziro. Zinnia sits on a rock in streaks of
            light. The Supporter switches your Active Pokémon with one on your Bench, then moves 1 Energy from the Pokémon that went to
            the Bench onto the new Active Pokémon.
          </li>
        </ul>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={img('mega-golisopod-ex-sar')} alt="Mega Golisopod ex 107/076 Special Art Rare by nagimiso: Mega Golisopod slashing with its claws over bright coloured streaks" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Golisopod ex</strong>107/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('raikou-ex-sar')} alt="Raikou ex 108/076 Special Art Rare by Oku: Raikou leaping down through lightning among tall rock pillars" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Raikou ex</strong>108/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mega-golurk-ex-sar')} alt="Mega Golurk ex 109/076 Special Art Rare by Takeshi Nakamura: Mega Golurk glowing yellow in front of old ruins at sunset" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mega Golurk ex</strong>109/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('aarune-sar')} alt="Aarune 111/076 Special Art Rare by Shimaris Yukichi: Aarune running along a forest path by a waterfall, holding up a red flag" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Aarune</strong>111/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('zinnias-trust-sar')} alt="Zinnia's Trust 112/076 Special Art Rare by Teeziro: Zinnia sitting on a rock in streaks of light" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Zinnia's Trust</strong>112/076 · Special Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="stadiums">Two-card Legendary Stadiums</h2>
        <p>
          The main set ends with three Stadiums that come in two halves, a left card and a right card with the same name: Legendary
          Trench (071 and 072), Legendary Summit (073 and 074) and Legendary Pyroduct (075 and 076). The official site explains that
          you put both halves from your hand into play together, as one Stadium.
        </p>
        <p>
          Legendary Summit is made for Mega Rayquaza ex. While it is in play, when either player's Colorless Pokémon is Knocked Out
          by damage from an attack, the opponent takes 1 fewer Prize card. The official site points out that a Knocked Out Mega
          Rayquaza ex then gives up 2 Prize cards instead of 3. Together, the two halves show a range of mountains under a yellow storm.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('legendary-summit-left')} alt="Legendary Summit 073/076, the left half: storm clouds over mountain peaks lit yellow" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Legendary Summit</strong>073/076 · Left half
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('legendary-summit-right')} alt="Legendary Summit 074/076, the right half: the rest of the mountain range under the storm, with a bird flying low over it" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Legendary Summit</strong>074/076 · Right half
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The official site also says the set has no basic Energy cards. It does have three special Energy cards, each with a Super
          Rare version.
        </p>

        <h2 id="card-list">Card count and rarities</h2>
        <p>
          The set has 113 cards. The main set is 001/076 to 076/076, and the secret rares are 077 to 113. Counted from the rarity marks
          on the official card database:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rarities" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rarities" className="sr-only">
              Storm Emeralda cards by rarity
            </caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Cards</th>
                <th scope="col">Part of the set</th>
              </tr>
            </thead>
            <tbody>
              {RARITIES.map((r) => (
                <tr key={r.rarity}>
                  <th scope="row">{r.rarity}</th>
                  <td>{r.count}</td>
                  <td>{r.part}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>The eight Double Rares are:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rr" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rr" className="sr-only">
              Storm Emeralda Double Rare cards
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
          All eight have a Super Rare version. The other 10 Super Rares are trainer cards and the three special Energy cards. The 12
          Art Rares include Kyogre, Groudon, Altaria and Kecleon.
        </p>

        <h2 id="english">Storm Emeralda and Delta Reign</h2>
        <p>
          The Japanese official pages do not name an English version. Card databases such as Bulbapedia and Limitless TCG list
          Storm Emeralda as the Japanese set behind the English Delta Reign, released on November 6, 2026. Going by those sources,
          Delta Reign has 141 cards because it also takes cards from the 2026 Japanese ex Starter Sets, so the numbers do not match the
          Japanese set.
        </p>
        <p>
          The trainer card names in this post are the names these cards have in Delta Reign, from the Limitless TCG card list.
        </p>

        <h2 id="email">Get an email when it is listed</h2>
        <p>Storm Emeralda is not in our shop. Leave your email below to hear when it is listed. No stock or dates are confirmed.</p>
        <BlogEmailSignup heading="Get an email when it's listed" body="One email when Japanese Storm Emeralda is listed in our shop." source="blog-storm-emeralda" />

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
          Mega Rayquaza ex is on every pack and has four versions, from the Double Rare to the gold Mega Ultra Rare. The Kazuki Minami
          Special Art Rare and the gold card are the two most collectors will look for.
        </p>
      </BlogPostLayout>
    </>
  )
}
