import * as React from 'react'
import { BlogEmailSignup } from '~/components/blog/BlogEmailSignup'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'japanese-30th-celebration-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/japanese-30th-celebration-${name}.webp`

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
  { item: 'Booster pack', qty: '6 cards', note: 'Every card is holo. 1 special 30th Pikachu card and 1 basic Energy in every pack' },
  { item: 'Booster box', qty: '20 packs', note: '120 cards in all' },
]

// The set by number range, counted from the official card database (product 961).
const PARTS = [
  { nos: '001 to 103', what: 'Main set, including the 30 Pikachu cards and 10 Double Rares', count: '103' },
  { nos: '104 to 123', what: 'Art Rare', count: '20' },
  { nos: '124 to 133', what: 'Special Art Rare', count: '10' },
  { nos: '134 and 135', what: 'Futuristic Rare (Mewtwo ex and Mew ex)', count: '2' },
  { nos: '136 to 165', what: '30 classic cards in their original-style frames', count: '30' },
  { nos: 'No number', what: 'Basic Energy designed by YOSHIROTTEN, one of each of 8 types', count: '8' },
]

// The ten Double Rares. Each one also has a Special Art Rare, numbered 124 to 133 in the same order.
const DOUBLE_RARES = [
  { no: '009/103', name: 'Fuecoco ex', jp: 'ホゲータex' },
  { no: '015/103', name: 'Greninja ex', jp: 'ゲッコウガex' },
  { no: '047/103', name: 'Pikachu ex', jp: 'ピカチュウex' },
  { no: '048/103', name: 'Pikachu ex', jp: 'ピカチュウex' },
  { no: '055/103', name: 'Mewtwo ex', jp: 'ミュウツーex' },
  { no: '057/103', name: 'Mew ex', jp: 'ミュウex' },
  { no: '059/103', name: 'Sylveon ex', jp: 'ニンフィアex' },
  { no: '076/103', name: 'Gengar ex', jp: 'ゲンガーex' },
  { no: '081/103', name: 'Jirachi ex', jp: 'ジラーチex' },
  { no: '088/103', name: 'Salamence ex', jp: 'ボーマンダex' },
]

const TOC = [
  { id: 'what-it-is', label: 'What is the Japanese 30th Celebration?' },
  { id: 'contents', label: "What's in a pack and a box?" },
  { id: 'pikachu-ex', label: 'Pikachu ex' },
  { id: 'futuristic-rare', label: 'Futuristic Rare: Mewtwo ex and Mew ex' },
  { id: 'pikachu-cards', label: '30 Pikachu cards' },
  { id: 'classics', label: '30 classic cards' },
  { id: 'card-list', label: 'Card count and rarities' },
  { id: 'released-with', label: 'What else came out' },
  { id: 'other-versions', label: 'The Chinese and English versions' },
  { id: 'email', label: 'Get an email when it is listed' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Japanese 30th Celebration set?',
    a: 'A Japanese Pokémon TCG expansion made for the game\'s 30th anniversary, set code M6a. Its Japanese name is 拡張パック「30th CELEBRATION」. Pikachu ex leads the set, and Pikachu, Mew and Mewtwo are on the pack.',
  },
  {
    q: 'When did 30th Celebration release in Japan?',
    a: 'Wednesday, September 16, 2026. The official site announces it as a worldwide simultaneous release.',
  },
  {
    q: 'How many cards are in a Japanese 30th Celebration pack?',
    a: '6 cards, and every one is holo. Pokémon Center Online says each pack has 1 special 30th Pikachu card and 1 basic Energy. A booster box holds 20 packs, which is 120 cards.',
  },
  {
    q: 'How many cards are in the set?',
    a: '173: cards 001 to 165 with the set number 103, plus 8 basic Energy cards that print no number. The main set is 001 to 103, and 104 to 165 are numbered after it.',
  },
  {
    q: 'What is a Futuristic Rare?',
    a: 'A new rarity in this set, marked FUR on the card. There are two, Mewtwo ex 134/103 and Mew ex 135/103, both illustrated by graphic artist YOSHIROTTEN.',
  },
  {
    q: 'Can the classic cards be played?',
    a: 'The official site says the 30 classic cards cannot be used in the current Standard format. They can be used in formats where the original card is allowed.',
  },
  {
    q: 'Is there a Japanese 30th Celebration booster box with promos?',
    a: 'The booster box holds only packs. The 30th CELEBRATION FUTURISTIC BOX is a separate product with two Pikachu ex promos by YOSHIROTTEN and a set of playing accessories. It has no booster packs in its contents list.',
  },
  {
    q: 'Are the English card names official?',
    a: 'The Pokémon names are their official English names. Attack and Ability names in this post are given in Japanese with what they do in English.',
  },
  {
    q: 'What language are the cards?',
    a: 'Japanese. This is the Japanese release from The Pokémon Company in Japan.',
  },
]

export const Route = createFileRoute('/blog/japanese-30th-celebration-release-news')({
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
  component: Japanese30thCelebrationPost,
})

const cardStyle = { background: 'transparent', boxShadow: 'none' } as const
const productStyle = { aspectRatio: '4 / 5', objectFit: 'contain', background: 'transparent', boxShadow: 'none' } as const

function Japanese30thCelebrationPost() {
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
    name: 'What comes in a Japanese 30th Celebration booster pack and booster box',
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
        lede="The Japanese Pokémon TCG set 30th Celebration (M6a) released on September 16, 2026. This post covers the pack and box, Pikachu ex, the two Futuristic Rares, the 30 Pikachu cards, the 30 classic cards and the other products released with it."
        cta={{
          heading: 'More new releases',
          body: 'See what is new and what is coming up at EBI Collectibles.',
          links: [
            { to: '/new-and-upcoming', label: 'See new and upcoming releases' },
            { to: '/blog', label: 'Read more release news', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Japanese 30th Celebration?</h2>
        <p>
          30th Celebration is a Japanese Pokémon TCG expansion in the MEGA series, made for the game's 30th anniversary. Its set code
          is M6a and its Japanese name is <Ja>拡張パック「30th CELEBRATION」</Ja>, written in English letters on the pack. It released in
          Japan on Wednesday, September 16, 2026, and the official site announces it as a worldwide simultaneous release.
        </p>
        <p>
          Pikachu, Mew and Mewtwo are on the front of the pack and the box, and Pikachu ex leads the set. Every card in a pack is holo,
          and every pack has one of 30 special Pikachu cards and one basic Energy. The set also brings a new rarity, the Futuristic
          Rare, and 30 classic cards from the game's history in their original-style frames.
        </p>
        <p>
          The Pokémon names in this post are their official English names. Attack and Ability names are given in Japanese, with what
          they do in English. The full card list is on our{' '}
          <Link to="/sets/japanese/30th-celebration-m6a">Japanese 30th Celebration card list</Link>.
        </p>

        <aside className="fact-box" aria-label="Japanese 30th Celebration key facts">
          {/* Same card as in the Pikachu ex section below, where it is described, so this copy is decorative */}
          <img src={img('pikachu-ex-047')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Set</dt>
              <dd>
                30th Celebration (<Ja>拡張パック「30th CELEBRATION」</Ja>)
              </dd>
              <dt>Set code</dt>
              <dd>M6a</dd>
              <dt>Released</dt>
              <dd>September 16, 2026 (Wednesday), in Japan</dd>
              <dt>Series</dt>
              <dd>Pokémon Card Game MEGA</dd>
              <dt>Pack</dt>
              <dd>6 cards, all holo</dd>
              <dt>Box</dt>
              <dd>20 packs</dd>
              <dt>Cards</dt>
              <dd>173: 001 to 165/103, plus 8 basic Energy</dd>
              <dt>New rarity</dt>
              <dd>Futuristic Rare (2 cards)</dd>
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
              Contents of a Japanese 30th Celebration booster pack and booster box
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
          The pack shows Pikachu in front, with Mew and Mewtwo behind it on a streaked rainbow background and the gold 30th
          Celebration logo below. The set code M6a, "6 cards at random" and "all holo cards" are printed in the top corner. The box
          uses the same design.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('booster-pack')} alt="The Japanese 30th Celebration booster pack: Pikachu in front of Mew and Mewtwo, with the gold 30th Celebration logo along the bottom" loading="lazy" width={520} height={1047} style={productStyle} />
              <figcaption>
                <strong>Booster pack</strong>6 cards
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('booster-box')} alt="The Japanese 30th Celebration booster box, open at the top with two rows of packs showing, and Pikachu on the raised lid" loading="lazy" width={900} height={1051} style={productStyle} />
              <figcaption>
                <strong>Booster box</strong>20 packs
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="pikachu-ex">Pikachu ex</h2>
        <p>
          There are two Pikachu ex in the main set, and each has a Special Art Rare. All four are Lightning-type Basic Pokémon with 190
          HP.
        </p>
        <ul>
          <li>
            <strong>Pikachu ex 047/103</strong>, a Double Rare illustrated by 5ban Graphics. Pikachu leaps through confetti in a park.
            Its first attack, <Ja>ピカピカパレード</Ja>, lets you put any number of Basic Pokémon from your deck onto your Bench. Its
            second, <Ja>10まんボルト</Ja>, does 200 damage and discards all Energy from Pikachu ex.
          </li>
          <li>
            <strong>Pikachu ex 048/103</strong>, a Double Rare illustrated by takuyoa. Pikachu dives forward in a purple-lit city at
            night. Its first attack, <Ja>ビリビリフィーバー</Ja>, attaches any number of basic Energy from your hand to your Pokémon in
            any way you like. Its second, <Ja>かみなり</Ja>, does 200 damage and 30 damage to Pikachu ex itself.
          </li>
        </ul>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pikachu-ex-047')} alt="Pikachu ex 047/103 by 5ban Graphics: Pikachu leaping with a fist out through confetti and lightning in a park" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>047/103 · Double Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pikachu-ex-048')} alt="Pikachu ex 048/103 by takuyoa: Pikachu diving forward with sparks around it, against purple city lights" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>048/103 · Double Rare
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          Both Special Art Rares are illustrated by kantaro and have the same attacks as the Double Rare before them. The official site
          says the set's Art Rares and Special Art Rares show Pokémon at different times of one day, and these two are a pair: 126/103
          is a daytime parade, and 127/103 is a night celebration with fireworks.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pikachu-ex-126-sar')} alt="Pikachu ex 126/103 Special Art Rare by kantaro: Pikachu running at the front of a crowded daytime parade of Pokémon, with Fuecoco beside it and confetti in the air" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>126/103 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pikachu-ex-127-sar')} alt="Pikachu ex 127/103 Special Art Rare by kantaro: Pikachu dancing at a night celebration with Eevee and Hisuian Zorua, fireworks above and Umbreon in the corner" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>127/103 · Special Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="futuristic-rare">Futuristic Rare: Mewtwo ex and Mew ex</h2>
        <p>
          Futuristic Rare (FUR) is a new rarity in this set. There are two, Mewtwo ex 134/103 and Mew ex 135/103, and the official site
          says both illustrations were drawn for the 30th anniversary by graphic artist YOSHIROTTEN. Both show the Pokémon with a
          glossy, colourful sheen among floating Energy symbols, and the 30th anniversary Pikachu mark on each is in rainbow colours.
        </p>
        <ul>
          <li>
            <strong>Mewtwo ex 134/103.</strong> A Psychic-type Basic Pokémon with 230 HP. Its first attack, <Ja>フォトンバレット</Ja>,
            does 50 damage to each of your opponent's Pokémon ex. Its second, <Ja>サイキックフォース</Ja>, does 230 damage, and Mewtwo
            ex cannot attack during your next turn.
          </li>
          <li>
            <strong>Mew ex 135/103.</strong> A Psychic-type Basic Pokémon with 160 HP. Its Ability, <Ja>きおくのらせん</Ja>, lets it
            use every attack of your Benched Pokémon, as long as it has the Energy for them. Its attack, <Ja>テレポートブレイク</Ja>,
            does 30 damage, and you may switch Mew ex with one of your Benched Pokémon.
          </li>
        </ul>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('mewtwo-ex-fur')} alt="Mewtwo ex 134/103 Futuristic Rare by YOSHIROTTEN: a glossy purple Mewtwo standing among floating Energy symbols" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mewtwo ex</strong>134/103 · Futuristic Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('mew-ex-fur')} alt="Mew ex 135/103 Futuristic Rare by YOSHIROTTEN: a glossy rainbow Mew floating among Energy symbols on a pale green background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Mew ex</strong>135/103 · Futuristic Rare
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          YOSHIROTTEN also designed the set's 8 basic Energy cards. One basic Energy is in every pack, and they print no collector
          number.
        </p>

        <h2 id="pikachu-cards">30 Pikachu cards</h2>
        <p>
          Cards 017 to 046 are 30 holo Pikachu, each drawn by a different illustrator for the anniversary. Each one prints a small
          Pikachu mark with its place in the run of 30, from 01/30 to 30/30. Pokémon Center Online says one special 30th Pikachu card is
          in every pack. Two examples:
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pikachu-017')} alt="Pikachu 017/103 by Ken Sugimori: Pikachu standing in a grassy field with small sparks around it" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu</strong>017/103 · 01/30 · Ken Sugimori
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pikachu-030')} alt="Pikachu 030/103 by OKACHEKE: Pikachu peeking out between the wooden posts of a staircase" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu</strong>030/103 · 14/30 · OKACHEKE
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="classics">30 classic cards</h2>
        <p>
          Cards 136 to 165 bring back 30 cards that the official site says symbolize the game's 30 years, printed again in their
          original-style frames. They start with Pikachu and Charizard in the frame of the first expansion pack from 1996, both
          illustrated by Mitsuhiro Arita, and end with Magikarp at 165. Darkrai &amp; Cresselia LEGEND is made of two cards, 151 and 152.
        </p>
        <p>
          The official site says these cards cannot be used in the current Standard format. They can be used in formats where the
          original card is allowed.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('classic-pikachu-136')} alt="Pikachu 136/103 in the 1996 card frame, by Mitsuhiro Arita: a round Pikachu on a holo starry background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu</strong>136/103 · Classic
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('classic-charizard-137')} alt="Charizard 137/103 in the 1996 card frame, by Mitsuhiro Arita: Charizard breathing fire on a red holo background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Charizard</strong>137/103 · Classic
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="card-list">Card count and rarities</h2>
        <p>
          The official card database lists all 173 cards. Cards 001 to 165 carry the set number 103, and the 8 basic Energy cards have
          no number.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-parts" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-parts" className="sr-only">
              Japanese 30th Celebration cards by number range
            </caption>
            <thead>
              <tr>
                <th scope="col">Numbers</th>
                <th scope="col">What they are</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {PARTS.map((r) => (
                <tr key={r.nos}>
                  <th scope="row">{r.nos}</th>
                  <td>{r.what}</td>
                  <td>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Outside the Double Rares and the Pikachu mark, the main set cards print no rarity letter, and the classic cards print none
          either. The ten Double Rares are:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rr" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rr" className="sr-only">
              Japanese 30th Celebration Double Rare cards
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
          Each of the ten also has a Special Art Rare, numbered 124 to 133 in the same order. The 20 Art Rares, 104 to 123, are
          Pokémon such as Moltres, Articuno, Zapdos, Lapras, Ditto and Gholdengo.
        </p>

        <h2 id="released-with">What else came out</h2>
        <p>The official 30th anniversary site lists these products alongside the set:</p>
        <ul>
          <li>
            <strong>
              30th CELEBRATION FUTURISTIC BOX, September 16.
            </strong>{' '}
            A set of playing accessories in a design by YOSHIROTTEN, with two Pikachu ex promos. It is sold only through Pokémon Center
            Online, and the official page says Pokémon Centers and Pokémon Stores may carry it later.
          </li>
          <li>
            <strong>
              Premium Deck Set Espeon &amp; Umbreon (<Ja>プレミアムデッキセット エーフィ・ブラッキー</Ja>), September 16.
            </strong>{' '}
            Two ready-to-play 60-card decks, one built around Espeon ex and one around Umbreon ex, with full-illustration Espeon ex and
            Umbreon ex cards in them. It also has 2 sheets of damage counters and markers, an Espeon coin and an Umbreon coin, a paper
            playmat, a sliding tin double deck case and two guides. The official page notes that some cards are reprints from earlier
            series.
          </li>
          <li>
            <strong>
              30th CELEBRATION Card Set (<Ja>30th CELEBRATION カードセット</Ja>), October 16.
            </strong>{' '}
            Nine versions, one for each region's three first partner Pokémon, from Bulbasaur, Charmander and Squirtle to Sprigatito,
            Fuecoco and Quaxly. Each has three holo promo cards with full illustrations, 2 packs of 30th Celebration and a paper stand
            for three cards.
          </li>
        </ul>
        <p>
          The official FUTURISTIC BOX contents are: two Pikachu ex promos (one of each), 2 Pokémon coins, 12 metal damage-counter dice,
          a metal Poison marker and a metal Burn marker, 64 deck sleeves, a flip deck case, a display frame, a rubber playmat, a flip
          damage-counter case and a flip playmat case. No booster packs are listed.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 728 }}>
          <img
            src={img('futuristic-box-contents')}
            alt="Everything in the 30th CELEBRATION FUTURISTIC BOX laid out: the box, the two Pikachu ex promos, a display frame, a playmat and its case, sleeves, a deck case, damage-counter dice, markers and coins, all in a rainbow Poké Ball design"
            loading="lazy"
            width={1200}
            height={753}
            style={{ width: '100%', height: 'auto' }}
          />
          <figcaption>The FUTURISTIC BOX and its contents, from the official product page.</figcaption>
        </figure>
        <p>
          The two promos are Pikachu ex 131/M-P and 132/M-P. The official page calls them Futuristic Rare style, and like Mewtwo ex and
          Mew ex in the set they are illustrated by YOSHIROTTEN. They have the same attacks as Pikachu ex 047/103 and 048/103.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('futuristic-box-pikachu-ex-131')} alt="Pikachu ex 131/M-P promo by YOSHIROTTEN: a glossy rainbow Pikachu waving among floating Energy symbols on a pale background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>131/M-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('futuristic-box-pikachu-ex-132')} alt="Pikachu ex 132/M-P promo by YOSHIROTTEN: a glossy pink and purple Pikachu among floating Energy symbols on a dark purple background" loading="lazy" width={788} height={1100} style={cardStyle} />
              <figcaption>
                <strong>Pikachu ex</strong>132/M-P · Promo
              </figcaption>
            </figure>
          </li>
        </ul>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('premium-deck-set')} alt="The 30th CELEBRATION Premium Deck Set Espeon and Umbreon box, with the Espeon ex and Umbreon ex cards showing in the window" loading="lazy" width={600} height={861} style={productStyle} />
              <figcaption>
                <strong>Premium Deck Set</strong>Espeon &amp; Umbreon
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('card-set')} alt="The 30th CELEBRATION Card Set for Bulbasaur, Charmander and Squirtle, with the three holo cards in the window" loading="lazy" width={900} height={648} style={productStyle} />
              <figcaption>
                <strong>Card Set</strong>Bulbasaur, Charmander &amp; Squirtle version
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="other-versions">The Chinese and English versions</h2>
        <p>
          The Simplified Chinese version came out on the same day, September 16, 2026. Our{' '}
          <Link to="/blog/30th-celebration-release-news">post on the Simplified Chinese version</Link> covers it.
        </p>
        <p>
          There is also an English set called 30th Celebration. It is not on the Japanese official pages, but the English card list on
          Limitless TCG has 191 cards, so it is put together differently from the Japanese set.
        </p>

        <h2 id="email">Get an email when it is listed</h2>
        <p>
          The Japanese 30th Celebration is not in our shop. Leave your email below to hear when it is listed. No stock or dates are
          confirmed.
        </p>
        <BlogEmailSignup
          heading="Get an email when it's listed"
          body="One email when Japanese 30th Celebration is listed in our shop."
          source="blog-japanese-30th-celebration"
        />

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
          Every pack is all holo and has a special Pikachu in it, so this is an easy set to open for fun. The two YOSHIROTTEN
          Futuristic Rares and the kantaro Pikachu ex pair are the cards most people will be looking for.
        </p>
      </BlogPostLayout>
    </>
  )
}
