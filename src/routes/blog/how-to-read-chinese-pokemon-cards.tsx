import { createFileRoute, Link } from '@tanstack/react-router'
import { Zh, zh } from '~/components/blog/Zh'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { GEM_SETS } from '~/data/gem-sets-index'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'how-to-read-chinese-pokemon-cards')!

// The example card is Kirlia 054/128 from Miracle Journey (CSV2C). The large
// labelled images are made from Pokémon China's own card image on its
// Miracle Journey product page; the set facts come from the set registry.
const MJ = GEM_SETS.find((s) => s.code === 'CSV2C')!
const img = (f: string) => `${SITE_URL}/assets/blog/${f}`
const R2 = 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese'

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

// Chinese words printed on cards, each one checked against a card or a
// Pokémon China product page.
const WORDS: { zh: string; en: string; where: string }[] = [
  { zh: '基础', en: 'Basic', where: 'Top left of a Basic Pokémon' },
  { zh: '1阶进化', en: 'Stage 1', where: 'Top left, as on Kirlia' },
  { zh: '2阶进化', en: 'Stage 2', where: 'Top left, as on Gardevoir ex' },
  { zh: '从…进化', en: 'Evolves from …', where: 'Under the name of an evolved Pokémon' },
  { zh: '特性', en: 'Ability', where: 'Red label above an Ability' },
  { zh: 'ex规则', en: 'Pokémon ex rule', where: 'Box at the bottom of a Pokémon ex' },
  { zh: '弱点', en: 'Weakness', where: 'Bottom row, left' },
  { zh: '抗性', en: 'Resistance', where: 'Bottom row, middle' },
  { zh: '撤退', en: 'Retreat', where: 'Bottom row, right' },
  { zh: '训练家', en: 'Trainer', where: 'Top right of a Trainer card' },
  { zh: '支援者', en: 'Supporter', where: 'Top left of a Supporter' },
  { zh: '物品', en: 'Item', where: 'Item cards' },
  { zh: '宝可梦道具', en: 'Pokémon Tool', where: 'Top left of a Pokémon Tool' },
  { zh: '竞技场', en: 'Stadium', where: 'Top left of a Stadium' },
  { zh: '奖赏卡', en: 'Prize cards', where: 'In card text' },
  { zh: '闪卡', en: 'Holo card', where: 'On Pokémon China product pages' },
]

const TOC = [
  { id: 'labelled', label: 'A Chinese card, labelled' },
  { id: 'top', label: 'The top: stage, name, HP and type' },
  { id: 'middle', label: 'The middle: Pokédex line and attacks' },
  { id: 'bottom-row', label: 'Weakness, resistance and retreat' },
  { id: 'number-strip', label: 'The bottom strip: set code, number and rarity' },
  { id: 'ex', label: 'What changes on a Pokémon ex' },
  { id: 'other-numbers', label: 'Gem Pack and promo numbers' },
  { id: 'words', label: 'Chinese words you will see on cards' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

const FAQ = [
  {
    q: 'Where is the set code on a Chinese Pokémon card?',
    a: 'In the bottom left corner, in a small black box between the regulation mark and the card number. On Kirlia from Miracle Journey it reads csv2C, which is set code CSV2C.',
  },
  {
    q: 'What does the number at the bottom of a Chinese card mean?',
    a: 'It is the collector number. 054/128 means card 54 of the 128 cards in the main set. A number higher than the second figure, such as 163/128, is a secret rare.',
  },
  {
    q: 'What do the letters after the card number mean?',
    a: 'They are the rarity mark. C is Common, U Uncommon, R Rare, RR Double Rare, AR Art Rare, SR Super Rare, SAR Special Art Rare and UR Ultra Rare. Gem Packs use symbols instead: ●, ◆, ★, ★★ and ★★★.',
  },
  {
    q: 'What is the letter in the white box next to the set code?',
    a: 'The regulation mark. Kirlia from Miracle Journey carries G. Pokémon China uses the mark to say which cards can be played in its official events.',
  },
  {
    q: 'Where is the illustrator on a Chinese Pokémon card?',
    a: 'Just above the set code, after "Illus.", in English letters. Kirlia 054/128 reads Illus. kawayoo.',
  },
  {
    q: 'Do Chinese cards use the same art as English cards?',
    a: 'Many do. Kirlia 054/128 uses the same illustration as the English Kirlia 085/198 from Scarlet & Violet. Each of our card origins posts matches a set card by card, including the Chinese Exclusives that have no English version.',
  },
]

export const Route = createFileRoute('/blog/how-to-read-chinese-pokemon-cards')({
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
  component: HowToReadChineseCardsPost,
})

function Wide({ file, w, h, alt }: { file: string; w: number; h: number; alt: string }) {
  return (
    <img
      src={img(`${file}.webp`)}
      srcSet={`${img(`${file}-800.webp`)} 800w, ${img(`${file}.webp`)} 1600w`}
      sizes="(max-width: 840px) 100vw, 760px"
      alt={alt}
      loading="lazy"
      decoding="async"
      width={w}
      height={h}
      style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 10 }}
    />
  )
}

function HowToReadChineseCardsPost() {
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
        post={post}
        lede="A Simplified Chinese Pokémon card is laid out like an English one. The name, HP and type are at the top, the attacks are in the middle, and the bottom left corner holds the illustrator, regulation mark, set code, collector number and rarity mark."
        cta={{
          heading: 'Explore the Chinese sets',
          body: 'Every card list shows each card with its number and rarity.',
          links: [
            { to: '/sets/chinese', label: 'See all Chinese sets' },
            { to: '/shop', label: 'Visit the shop', variant: 'ghost' },
          ],
        }}
      >
        <p>
          In this article we take one real card, Kirlia 054/128 from {MJ.name} (<Zh>奇迹启程</Zh>, set code {MJ.code}), and label
          every part of it. {MJ.name} released on {formatDate(MJ.releaseDate)}. Kirlia is a Common, so it shows the basics without
          any special frame. Further down we cover what changes on a Pokémon ex, how Gem Pack and promo numbers work, and the Chinese
          words you will meet most often.
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

        <h2 id="labelled">A Chinese card, labelled</h2>
        <figure style={{ margin: '24px auto 30px' }}>
          <Wide
            file="how-to-read-chinese-card-kirlia-annotated"
            w={1600}
            h={1367}
            alt="Kirlia 054/128 from Miracle Journey with 11 numbered labels: stage, name, evolves from, HP, type, Pokédex line, two attacks, weakness resistance and retreat, flavor text and the card number strip"
          />
          <figcaption className="table-note">Kirlia 054/128, {MJ.name} ({MJ.code}). Card image: Pokémon China.</figcaption>
        </figure>

        <h2 id="top">The top: stage, name, HP and type</h2>
        <ol>
          <li>
            <strong>Stage.</strong> <Zh>1阶进化</Zh> means Stage 1. A Basic Pokémon says <Zh>基础</Zh> here, and a Stage 2 says{' '}
            <Zh>2阶进化</Zh>. The small picture under it shows the Pokémon it evolves from.
          </li>
          <li>
            <strong>Name.</strong> <Zh>奇鲁莉安</Zh> is Kirlia. The name is printed in Chinese only, so the card list is the quickest
            way to match it to an English name.
          </li>
          <li>
            <strong>Evolves from.</strong> <Zh>从拉鲁拉丝进化</Zh> means &ldquo;evolves from Ralts&rdquo;.
          </li>
          <li>
            <strong>HP.</strong> Hit points are printed with the letters HP, as on English cards. Kirlia has 90.
          </li>
          <li>
            <strong>Type.</strong> The symbol in the top right corner is the Pokémon&rsquo;s type. Kirlia&rsquo;s eye symbol is
            Psychic.
          </li>
        </ol>

        <h2 id="middle">The middle: Pokédex line and attacks</h2>
        <ol start={6}>
          <li>
            <strong>Pokédex line.</strong> The thin bar under the picture reads <Zh>全国图鉴No.0281 感情宝可梦 身高：0.8m 体重：20.2kg</Zh>:
            National Pokédex number 0281, the Emotion Pokémon (<Zh>感情宝可梦</Zh>), 0.8 m tall and 20.2 kg.
          </li>
          <li>
            <strong>Attack.</strong> Each attack shows its Energy cost on the left, its name in the middle and its damage on the
            right. Kirlia&rsquo;s first attack, <Zh>魔法射击</Zh>, costs one Psychic and one Colorless Energy and does 30 damage.
          </li>
          <li>
            <strong>Attack with text.</strong> A line under an attack says what else it does. <Zh>精神强念</Zh> does 60+, and its
            text, <Zh>追加造成对手战斗宝可梦身上附着的能量数量×20伤害</Zh>, means it does 20 more damage for each Energy attached
            to your opponent&rsquo;s Active Pokémon.
          </li>
        </ol>

        <h2 id="bottom-row">Weakness, resistance and retreat</h2>
        <ol start={9}>
          <li>
            <strong>
              <Zh>弱点</Zh> weakness, <Zh>抗性</Zh> resistance, <Zh>撤退</Zh> retreat.
            </strong>{' '}
            Kirlia is weak to Darkness (×2), resists Fighting (−30) and needs one Colorless Energy to retreat.
          </li>
          <li>
            <strong>Flavor text.</strong> The two lines in the bottom right are a short note about the Pokémon. Kirlia&rsquo;s reads{' '}
            <Zh>可以通过操纵精神力量扭曲周围的空间来看清未来。</Zh> In our translation: it can bend the space around it with its
            psychic power to see the future.
          </li>
          <li>
            <strong>Card number strip.</strong> The most useful part for collectors. It has its own close-up below.
          </li>
        </ol>
        <p>
          The line at the very bottom, <span lang="en">©2025 Pokémon/Nintendo/Creatures/GAME FREAK.</span>, is the copyright line.
        </p>

        <h2 id="number-strip">The bottom strip: illustrator, regulation mark, set code, number and rarity</h2>
        <figure style={{ margin: '24px auto 30px' }}>
          <Wide
            file="how-to-read-chinese-card-number-strip"
            w={1600}
            h={463}
            alt="Close-up of the bottom left of Kirlia 054/128: Illus. kawayoo, regulation mark G, set code csv2C, collector number 054/128 and rarity mark C"
          />
        </figure>
        <ul>
          <li>
            <strong>Illustrator.</strong> &ldquo;Illus.&rdquo; and the artist&rsquo;s name, in English letters. Kirlia is by kawayoo.
            Our <Link to="/blog/miracle-journey-card-origins">Miracle Journey card origins</Link> post lists the artist and English
            match of every card in the set.
          </li>
          <li>
            <strong>Regulation mark.</strong> The letter in the white box. Kirlia carries G. Pokémon China uses this mark to say which
            cards can be played in its official events. Cards in one set can carry different marks: in Gem Vol 6, the Applin cards
            carry I and the rest carry H.
          </li>
          <li>
            <strong>Set code.</strong> The black box. It reads csv2C, which is the set code {MJ.code} for {MJ.name}. Our{' '}
            <Link to="/blog/chinese-pokemon-sets-in-order" hash="set-codes">
              guide to Chinese set codes
            </Link>{' '}
            explains the patterns, such as CSV for the main expansions and CBB for the Gem Packs, and lists every set in order.
          </li>
          <li>
            <strong>Collector number.</strong> 054/128 is card 54 of the 128 cards in {MJ.name}&rsquo;s main set. Cards numbered past
            128, up to {MJ.cardCount}/128, are the secret rares.
          </li>
          <li>
            <strong>Rarity mark.</strong> The letter after the number. C is Common. The rarer cards print RR, AR, SR, SAR or UR in the
            same spot.
          </li>
        </ul>
        <figure style={{ margin: '24px auto 30px' }}>
          <Wide
            file="chinese-rarity-marks-close-up"
            w={1600}
            h={588}
            alt="Close-ups of eight card number strips from Miracle Journey and Reward Round showing the rarity marks C, U, R, RR, AR, SR, SAR and UR"
          />
          <figcaption className="table-note">Rarity marks on cards from {MJ.name} (CSV2C) and Reward Round (CSV4C). Card images: Pokémon China.</figcaption>
        </figure>
        <p>
          Our <Link to="/blog/chinese-pokemon-card-rarities">Chinese card rarities guide</Link> explains every rarity, including the
          ones only a few sets use.
        </p>

        <h2 id="ex">What changes on a Pokémon ex</h2>
        <p>
          Gardevoir ex 055/128, the Pokémon on the {MJ.name} pack, adds two things to the layout. Above its attack is an Ability,
          marked with a red <Zh>特性</Zh> label. At the bottom is the <Zh>ex规则</Zh> box, the Pokémon ex rule:{' '}
          <Zh>当宝可梦ex昏厥时，对手将拿取2张奖赏卡。</Zh> It means that when your Pokémon ex is Knocked Out, your opponent takes 2 Prize
          cards. Its rarity mark is RR, for Double Rare.
        </p>
        <ul className="card-grid cols-3">
          <li>
            <figure>
              <img src={`${R2}/Miracle%20Journey%20CSV2/Cards/0053.webp`} alt="Ralts 053/128, Common, Miracle Journey" loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>Ralts</strong>053/128 · C
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${R2}/Miracle%20Journey%20CSV2/Cards/0054.webp`} alt="Kirlia 054/128, Common, Miracle Journey" loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>Kirlia</strong>054/128 · C
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${R2}/Miracle%20Journey%20CSV2/Cards/0055.webp`} alt="Gardevoir ex 055/128, Double Rare, Miracle Journey" loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>Gardevoir ex</strong>055/128 · RR
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          See every card in the set on the <Link to={MJ.path}>{MJ.name} card list</Link>.
        </p>

        <h2 id="other-numbers">Gem Pack and promo numbers</h2>
        <p>
          Gem Packs number their cards differently. Each card number has two parts: the first two digits are the Pokémon and the next
          two are its version. In Gem Vol 7, 0307/07 is Misty&rsquo;s Psyduck, version 07 of 7, the full art. The rarity is a symbol
          after the number, not a letter: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare. Our{' '}
          <Link to="/blog/gem-vol-7-set-guide">Gem Vol 7 set guide</Link> shows how to tell the seven versions apart, and our{' '}
          <Link to="/blog/chinese-gem-pack-hit-rates">Gem Pack hit rates guide</Link> covers the odds.
        </p>
        <p>
          Promos have no set number. The Poké Ball pattern Charmander promo from the Collect 151 first partner display sets is numbered 067/SV-P and
          carries a PROMO box where the set code would be. The 30th Celebration promos are numbered out of 30th-P, so 001/30th-P is a
          different card from 001/103.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 300 }}>
          <img
            src={img('collect-151-first-partner-display-charmander-poke-ball.webp')}
            alt="Charmander promo 067/SV-P in Simplified Chinese, with a PROMO box in the bottom left in place of a set code"
            loading="lazy"
            width={788}
            height={1100}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          <figcaption className="table-note">Charmander 067/SV-P, a promo: PROMO in place of a set code.</figcaption>
        </figure>

        <h2 id="words">Chinese words you will see on cards</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-words" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-words" className="sr-only">
              Chinese words printed on Pokémon cards and what they mean
            </caption>
            <thead>
              <tr>
                <th scope="col">Chinese</th>
                <th scope="col">English</th>
                <th scope="col">Where</th>
              </tr>
            </thead>
            <tbody>
              {WORDS.map((w) => (
                <tr key={w.zh}>
                  <th scope="row">
                    <Zh>{w.zh}</Zh>
                  </th>
                  <td>{w.en}</td>
                  <td>{w.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The Pokémon name itself is the word that changes most. Each of our <Link to="/sets/chinese">Chinese set lists</Link> gives
          every card with its English name, number and rarity, so you can look a card up by the number in its bottom corner.
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
            <a href="https://www.pokemon.cn/tcg/product/15556.html">Pokémon China: Miracle Journey product page</a> (card images of
            Kirlia, Ralts, Gardevoir ex and the rarity mark close-ups)
          </li>
          <li>
            <a href="https://www.pokemon.cn/tcg/product/15488.html">Pokémon China: Reward Round product page</a> (card images used in
            the rarity mark close-ups)
          </li>
        </ul>
      </BlogPostLayout>
    </>
  )
}
