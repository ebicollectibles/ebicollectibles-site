import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { BuyStrip } from '~/components/blog/BlogShop'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'aura-seeker-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/aura-seeker-${name}.webp`
/** A secret rare scan, shared with the set page (public/assets/sets/cards/jp-m7/). */
const card = (no: string) => `${SITE_URL}/assets/sets/cards/jp-m7/${no}.webp`

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

// Every rarity in the 114-card set. 001-078 are counted from the official card
// database; the secret rares 079-114 are checked against three card list sites.
const RARITIES = [
  { rarity: 'Common', numbers: '001–072 (mixed)', count: 38 },
  { rarity: 'Uncommon', numbers: '003–078 (mixed)', count: 24 },
  { rarity: 'Rare', numbers: '016–073 (mixed)', count: 8 },
  { rarity: 'Double Rare', numbers: '008–067 (mixed)', count: 8 },
  { rarity: 'Art Rare', numbers: '079–090', count: 12 },
  { rarity: 'Super Rare', numbers: '091–107', count: 17 },
  { rarity: 'Special Art Rare', numbers: '108–113', count: 6 },
  { rarity: 'Mega Ultra Rare', numbers: '114', count: 1 },
]

// The 36 secret rares. Trainer and Energy names are unofficial translations.
const SECRET_RARES = [
  ['079', 'Bellsprout', 'Art Rare'], ['080', 'Ninetales', 'Art Rare'], ['081', 'Blastoise', 'Art Rare'],
  ['082', 'Buizel', 'Art Rare'], ['083', 'Oranguru', 'Art Rare'], ['084', 'Hatterene', 'Art Rare'],
  ['085', 'Riolu', 'Art Rare'], ['086', 'Hawlucha', 'Art Rare'], ['087', 'Falinks', 'Art Rare'],
  ['088', 'Glimmet', 'Art Rare'], ['089', 'Persian', 'Art Rare'], ['090', 'Regigigas', 'Art Rare'],
  ['091', 'Sceptile ex', 'Super Rare'], ['092', 'Floatzel ex', 'Super Rare'], ['093', 'Mega Absol Z ex', 'Super Rare'],
  ['094', 'Sigilyph ex', 'Super Rare'], ['095', 'Mega Glimmora ex', 'Super Rare'], ['096', 'Mega Lucario Z ex', 'Super Rare'],
  ['097', 'Togedemaru ex', 'Super Rare'], ['098', 'Mega Garchomp Z ex', 'Super Rare'], ['099', 'Pokégear 3.0', 'Super Rare'],
  ['100', 'Bond Sash', 'Super Rare'], ['101', "Korrina's Earnestness", 'Super Rare'], ['102', "Crasher Wake's Fervor", 'Super Rare'],
  ['103', 'Reporter', 'Super Rare'], ['104', 'Fight Arena', 'Super Rare'], ['105', 'Telepathic Psychic Energy', 'Super Rare'],
  ['106', 'Shadowy Darkness Energy', 'Super Rare'], ['107', 'Magnetic Metal Energy', 'Super Rare'],
  ['108', 'Mega Absol Z ex', 'Special Art Rare'], ['109', 'Sigilyph ex', 'Special Art Rare'], ['110', 'Mega Lucario Z ex', 'Special Art Rare'],
  ['111', 'Mega Garchomp Z ex', 'Special Art Rare'], ['112', "Korrina's Earnestness", 'Special Art Rare'], ['113', "Crasher Wake's Fervor", 'Special Art Rare'],
  ['114', 'Mega Lucario Z ex', 'Mega Ultra Rare'],
].map(([no, name, rarity]) => ({ no: `${no}/078`, name, rarity }))

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
  { id: 'secret-rares', label: 'The 36 secret rares' },
  { id: 'art-rares', label: 'The 12 Art Rares' },
  { id: 'mega-lucario', label: 'Mega Lucario Z ex' },
  { id: 'more-cards', label: 'Other main set cards' },
  { id: 'card-list', label: 'Full card list by rarity' },
  { id: 'names', label: 'What is it called?' },
  { id: 'not-known', label: 'What has not been announced' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is Aura Seeker?',
    a: 'A Japanese Pokémon TCG expansion in the MEGA series, set code M7. Its Japanese name is 拡張パック「ハドウシーカー」. It has 114 cards, led by Mega Lucario Z ex.',
  },
  {
    q: 'When did Aura Seeker launch in Japan?',
    a: 'It launched in Japan on Friday, November 27, 2026.',
  },
  {
    q: 'How many cards are in an Aura Seeker pack?',
    a: '5 cards, packed at random. A booster box holds 30 packs, which is 150 cards.',
  },
  {
    q: 'How many cards are in Aura Seeker?',
    a: '114 cards. The main set is 78 cards, numbered 001/078 to 078/078. The other 36 are secret rares, numbered 079/078 to 114/078: 12 Art Rares, 17 Super Rares, 6 Special Art Rares and 1 Mega Ultra Rare.',
  },
  {
    q: 'What is the rarest card in Aura Seeker?',
    a: 'The gold Mega Ultra Rare Mega Lucario Z ex, 114/078. It is the only Mega Ultra Rare in the set.',
  },
  {
    q: 'What are the Special Art Rares?',
    a: "Six cards, 108/078 to 113/078: Mega Absol Z ex, Sigilyph ex, Mega Lucario Z ex, Mega Garchomp Z ex, Korrina's Earnestness and Crasher Wake's Fervor. Crasher Wake's Fervor is illustrated by manga artist Tetsuo Hara.",
  },
  {
    q: 'Is Mega Lucario Z ex on the pack?',
    a: 'Yes. Mega Lucario Z is on the front of the booster pack and the box, and the card is 057/078, a Double Rare with 330 HP.',
  },
  {
    q: 'Are the English card names official?',
    a: 'The Pokémon names are their official English names. The Trainer and Energy card names, and the "Mega ... Z ex" styling, are unofficial translations of the Japanese and may differ when the cards come out in English.',
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
        lede="The Japanese Pokémon TCG set Aura Seeker (M7) launched in Japan on Friday, November 27, 2026. The full card list is out: 114 cards, with 36 secret rares and a gold Mega Ultra Rare Mega Lucario Z ex. Here are the pack and box, the chase cards and every secret rare."
        cta={{
          heading: 'Pre-order Aura Seeker',
          body: 'The Japanese Aura Seeker booster box is on pre-order and ships the first week of December.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-japanese-aura-seeker-m7-booster-box' }, label: 'Pre-order Aura Seeker' },
            { to: '/sets/japanese/aura-seeker-m7', label: 'See the full card list', variant: 'ghost' },
            { to: '/blog', label: 'Read more release news', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is Aura Seeker?</h2>
        <p>
          Aura Seeker is a Japanese Pokémon TCG expansion in the MEGA series, with the set code M7. Its Japanese name is{' '}
          <Ja>拡張パック「ハドウシーカー」</Ja>, and it launched in Japan on Friday, November 27, 2026.
        </p>
        <p>
          The set is led by Mega Lucario Z ex, which is on the front of the booster pack and the box. Its Ability shares the set's
          name. The set has 114 cards: a 78-card main set and 36 secret rares. The top card is a gold Mega Ultra Rare Mega Lucario Z
          ex, and one of the six Special Art Rares, Crasher Wake's Fervor, is illustrated by manga artist Tetsuo Hara.
        </p>
        <p>
          The Pokémon names in this post are their official English names. The Trainer and Energy card names and the "Mega ... Z ex"
          names are unofficial translations of the Japanese.
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
              <dt>Launched in Japan</dt>
              <dd>November 27, 2026 (Friday)</dd>
              <dt>Series</dt>
              <dd>Pokémon Card Game MEGA</dd>
              <dt>Pack</dt>
              <dd>5 cards</dd>
              <dt>Box</dt>
              <dd>30 packs</dd>
              <dt>Cards</dt>
              <dd>114 in all</dd>
              <dt>Main set</dt>
              <dd>78 cards (001–078)</dd>
              <dt>Secret rares</dt>
              <dd>36 cards (079–114)</dd>
              <dt>Top card</dt>
              <dd>Mega Lucario Z ex, Mega Ultra Rare 114/078</dd>
              <dt>Language</dt>
              <dd>Japanese</dd>
            </dl>
          </div>
        </aside>

        <nav className="toc" aria-label="Contents">
          <p className="toc-title">Contents</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="contents">What's in a pack and a box?</h2>
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

        <h2 id="secret-rares">The 36 secret rares</h2>
        <p>
          Aura Seeker has 36 secret rares, numbered 079/078 to 114/078: 12 Art Rares, 17 Super Rares, 6 Special Art Rares and one Mega
          Ultra Rare. The full list is in the <a href="#card-list">card list</a> below.
        </p>
        <p>
          The Mega Ultra Rare is a gold Mega Lucario Z ex, 114/078, the only one in the set. Mega Lucario Z ex also has a Special Art
          Rare, 110/078, which shows Mega Lucario Z mid-leap over grassy rocks.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={card('114')} alt="Mega Lucario Z ex 114/078 Mega Ultra Rare: the whole card in gold, with Mega Lucario Z etched into the gold" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Lucario Z ex</strong>114/078 · Mega Ultra Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('110')} alt="Mega Lucario Z ex 110/078 Special Art Rare: Mega Lucario Z mid-leap over grassy rocks with its blue tassels flying" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Lucario Z ex</strong>110/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>
        <BuyStrip />
        <h3>Crasher Wake's Fervor by Tetsuo Hara</h3>
        <p>
          Crasher Wake's Fervor 113/078 is a Special Art Rare (<Ja>マキシの熱血</Ja> in Japanese; the English card name is an
          unofficial translation). It is illustrated by manga artist Tetsuo Hara.
        </p>
        <p>
          The illustration shows Crasher Wake in his mask, lunging toward you with one hand reaching out and the other raised, and pale
          fists rising behind him. The card is a Supporter: you choose one of your Water Pokémon in play and shuffle it, with every card
          attached to it, back into your deck. The same Supporter is also in the main set as 076/078, an Uncommon illustrated by GOSSAN,
          and as the Super Rare 102/078.
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
        <h3>The other Special Art Rares</h3>
        <p>
          The other four Special Art Rares are Mega Absol Z ex 108/078, Sigilyph ex 109/078, Mega Garchomp Z ex 111/078 and the
          Supporter Korrina's Earnestness 112/078.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={card('108')} alt="Mega Absol Z ex 108/078 Special Art Rare: Mega Absol Z, dark blue, against a red and purple forest" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Absol Z ex</strong>108/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('109')} alt="Sigilyph ex 109/078 Special Art Rare: Sigilyph with its wings spread over swirling clouds and red rock" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Sigilyph ex</strong>109/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('111')} alt="Mega Garchomp Z ex 111/078 Special Art Rare: Mega Garchomp Z diving forward with its red fins spread" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Mega Garchomp Z ex</strong>111/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('112')} alt="Korrina's Earnestness 112/078 Special Art Rare: Korrina reaching toward a burst of light in bright rainbow colours" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Korrina's Earnestness</strong>112/078 · Special Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The 17 Super Rares are full-art versions of all eight Double Rare ex, six Trainer cards and three Special Energy cards.
          Five of the Trainer cards are from the main set (Bond Sash, Korrina's Earnestness, Crasher Wake's Fervor, Reporter and Fight
          Arena). Pokégear 3.0 and the three Energy cards are only in the secret rares.
        </p>

        <h2 id="art-rares">The 12 Art Rares</h2>
        <p>
          The 12 Art Rares, 079/078 to 090/078, are full illustrations of Pokémon from the main set, from Bellsprout to Regigigas.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={card('079')} alt="Bellsprout 079/078 Art Rare: Bellsprout among bright jungle leaves" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Bellsprout</strong>079/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('080')} alt="Ninetales 080/078 Art Rare: Ninetales surrounded by swirling flames" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Ninetales</strong>080/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('081')} alt="Blastoise 081/078 Art Rare: Blastoise standing in the sea under a bright sky" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Blastoise</strong>081/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('082')} alt="Buizel 082/078 Art Rare: Buizel leaping through a waterfall" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Buizel</strong>082/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('083')} alt="Oranguru 083/078 Art Rare: Oranguru sitting in a green forest" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Oranguru</strong>083/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('084')} alt="Hatterene 084/078 Art Rare: Hatterene floating among colourful bubbles" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Hatterene</strong>084/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('085')} alt="Riolu 085/078 Art Rare: Riolu standing on a snowy mountain" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Riolu</strong>085/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('086')} alt="Hawlucha 086/078 Art Rare: Hawlucha flying over a stadium" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Hawlucha</strong>086/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('087')} alt="Falinks 087/078 Art Rare: Falinks marching in a line across a pink field" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Falinks</strong>087/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('088')} alt="Glimmet 088/078 Art Rare: Glimmet in a glittering crystal cave" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Glimmet</strong>088/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('089')} alt="Persian 089/078 Art Rare: Persian lounging on a velvet sofa" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Persian</strong>089/078 · Art Rare
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={card('090')} alt="Regigigas 090/078 Art Rare: Regigigas, huge and white, against red and black stripes" loading="lazy" width={480} height={670} style={{ background: 'transparent', boxShadow: 'none' }} />
              <figcaption>
                <strong>Regigigas</strong>090/078 · Art Rare
              </figcaption>
            </figure>
          </li>
        </ul>

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
        <p>
          It is printed four times in the set: the Double Rare 057/078, a Super Rare 096/078, a Special Art Rare 110/078 and the gold
          Mega Ultra Rare 114/078.
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

        <h2 id="more-cards">Other main set cards</h2>
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

        <h2 id="card-list">Full card list by rarity</h2>
        <p>
          Aura Seeker has 114 cards. Counted by rarity:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-rarities" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-rarities" className="sr-only">
              Aura Seeker cards by rarity
            </caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Numbers</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {RARITIES.map((r) => (
                <tr key={r.rarity}>
                  <th scope="row">{r.rarity}</th>
                  <td>{r.numbers}</td>
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
        <p>The 36 secret rares are:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-secret" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-secret" className="sr-only">
              Aura Seeker secret rares, 079/078 to 114/078
            </caption>
            <thead>
              <tr>
                <th scope="col">Number</th>
                <th scope="col">Card</th>
                <th scope="col">Rarity</th>
              </tr>
            </thead>
            <tbody>
              {SECRET_RARES.map((c) => (
                <tr key={c.no}>
                  <td>{c.no}</td>
                  <th scope="row">{c.name}</th>
                  <td>{c.rarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          See every card, with pictures, on our <Link to="/sets/japanese/aura-seeker-m7">Aura Seeker card list</Link>.
        </p>

        <h2 id="names">What is it called?</h2>
        <p>
          The official name is <Ja>拡張パック「ハドウシーカー」</Ja>, which reads Hadō Shīkā. In English it is usually written as Aura
          Seeker, and that is the name we use.
        </p>

        <h2 id="not-known">What has not been announced</h2>
        <p>
          The full card list is out, but pull rates for the secret rares have not been announced. The official English names of the
          Trainer and Energy cards will not be known until the cards are printed in English.
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

      </BlogPostLayout>
    </>
  )
}
