import { chunk } from '~/lib/chunk'
import { RarityAbbr, rarityFullName } from '~/components/blog/RarityAbbr'
import { useId } from 'react'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/black-bolt.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'black-bolt-card-origins')!

type Src = 'BLK' | 'WHT' | 'SVP' | 'NEW'

// Every Black Bolt card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list English Black Bolt.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'BLK', '001/086', "Susumu Maeya"],
  ['002', 'BLK', '002/086', "Susumu Maeya"],
  ['003', 'BLK', '003/086', "PLANETA Igarashi"],
  ['004', 'BLK', '004/086', "kurumitsu"],
  ['005', 'BLK', '005/086', "kurumitsu"],
  ['006', 'BLK', '006/086', "mele"],
  ['007', 'BLK', '007/086', "mele"],
  ['008', 'BLK', '008/086', "mingo"],
  ['009', 'BLK', '009/086', "DOM"],
  ['010', 'BLK', '010/086', "Kurata So"],
  ['011', 'BLK', '011/086', "Kurata So"],
  ['012', 'BLK', '012/086', "Natsumi Yoshida"],
  ['013', 'BLK', '013/086', "svlt"],
  ['014', 'BLK', '014/086', "svlt"],
  ['015', 'WHT', '016/086', "satoma"],
  ['016', 'WHT', '017/086', "satoma"],
  ['017', 'WHT', '018/086', "satoma"],
  ['018', 'BLK', '015/086', "mashu"],
  ['019', 'BLK', '016/086', "mashu"],
  ['020', 'BLK', '017/086', "Makura Tami"],
  ['021', 'BLK', '018/086', "Makura Tami"],
  ['022', 'BLK', '019/086', "Yukihiro Tada"],
  ['023', 'BLK', '020/086', "Yukihiro Tada"],
  ['024', 'BLK', '021/086', "Yukihiro Tada"],
  ['025', 'BLK', '022/086', "Gemi"],
  ['026', 'BLK', '023/086', "Gemi"],
  ['027', 'BLK', '024/086', "Tika Matsuno"],
  ['028', 'BLK', '025/086', "OOYAMA"],
  ['029', 'BLK', '026/086', "OOYAMA"],
  ['030', 'BLK', '027/086', "Kyoko Umemoto"],
  ['031', 'BLK', '028/086', "N-DESIGN Inc."],
  ['032', 'BLK', '029/086', "Tomowaka"],
  ['033', 'BLK', '030/086', "Jerky"],
  ['034', 'BLK', '031/086', "Jerky"],
  ['035', 'BLK', '032/086', "Jerky"],
  ['036', 'BLK', '033/086', "hncl"],
  ['037', 'BLK', '034/086', "takuyoa"],
  ['038', 'BLK', '035/086', "Eri Kamei"],
  ['039', 'BLK', '036/086', "Eri Kamei"],
  ['040', 'BLK', '037/086', "LINNE"],
  ['041', 'BLK', '038/086', "LINNE"],
  ['042', 'BLK', '039/086', "LINNE"],
  ['043', 'BLK', '040/086', "Apios"],
  ['044', 'BLK', '041/086', "Apios"],
  ['045', 'BLK', '042/086', "Uta"],
  ['046', 'BLK', '043/086', "Uta"],
  ['047', 'BLK', '044/086', "5ban Graphics"],
  ['048', 'BLK', '045/086', "OKACHEKE"],
  ['049', 'BLK', '046/086', "N-DESIGN Inc."],
  ['050', 'BLK', '047/086', "Shinya Mizuno"],
  ['051', 'BLK', '048/086', "Shinya Mizuno"],
  ['052', 'BLK', '049/086', "Shinya Mizuno"],
  ['053', 'BLK', '050/086', "Shin Nagasawa"],
  ['054', 'BLK', '051/086', "Tetsu Kayama"],
  ['055', 'BLK', '052/086', "Tetsu Kayama"],
  ['056', 'BLK', '053/086', "Kazumasa Yasukuni"],
  ['057', 'BLK', '054/086', "okayamatakatoshi"],
  ['058', 'BLK', '055/086', "okayamatakatoshi"],
  ['059', 'BLK', '056/086', "okayamatakatoshi"],
  ['060', 'BLK', '057/086', "Gapao"],
  ['061', 'BLK', '058/086', "Gapao"],
  ['062', 'BLK', '059/086', "Gapao"],
  ['063', 'WHT', '063/086', "Pani Kobayashi"],
  ['064', 'WHT', '064/086', "Pani Kobayashi"],
  ['065', 'BLK', '060/086', "DOM"],
  ['066', 'BLK', '064/086', "Oku"],
  ['067', 'BLK', '065/086', "Oku"],
  ['068', 'BLK', '066/086', "HICO KIM"],
  ['069', 'BLK', '067/086', "5ban Graphics"],
  ['070', 'BLK', '068/086', "Taiga Kasai"],
  ['071', 'BLK', '069/086', "Taiga Kasai"],
  ['072', 'BLK', '070/086', "Taiga Kasai"],
  ['073', 'BLK', '071/086', "Tomomi Ozaki"],
  ['074', 'BLK', '072/086', "Tomomi Ozaki"],
  ['075', 'BLK', '073/086', "Tomomi Ozaki"],
  ['076', 'BLK', '074/086', "Saya Tsuruta"],
  ['077', 'BLK', '075/086', "Ayako Ozaki"],
  ['078', 'BLK', '076/086', "Ayako Ozaki"],
  ['079', 'BLK', '081/086', "Toyste Beach"],
  ['080', 'BLK', '080/086', "AYUMI ODASHIMA"],
  ['081', 'BLK', '084/086', "Toyste Beach"],
  ['082', 'BLK', '079/086', "Studio Bora Inc."],
  ['083', 'BLK', '083/086', "hncl"],
  ['084', 'BLK', '085/086', "Taira Akitsu"],
  ['085', 'BLK', '082/086', "Yuu Nishida"],
  ['086', 'BLK', '086/086', ""],
  ['087', 'BLK', '087/086', "Yoshimi Miyoshi"],
  ['088', 'BLK', '088/086', "Jiro Sasumo"],
  ['089', 'BLK', '089/086', "saino misaki"],
  ['090', 'BLK', '090/086', "Yuka Tanaka"],
  ['091', 'BLK', '091/086', "Tika Matsuno"],
  ['092', 'BLK', '092/086', "En Morikura"],
  ['093', 'BLK', '093/086', "Heisuke Kitazawa"],
  ['094', 'BLK', '094/086', "Tomokazu Komiya"],
  ['095', 'BLK', '095/086', "buchi"],
  ['096', 'BLK', '096/086', "OKUBO"],
  ['097', 'SVP', '208', "Amelicart"],
  ['098', 'BLK', '097/086', "Tomowaka"],
  ['099', 'BLK', '098/086', "Nisota Niso"],
  ['100', 'WHT', '101/086', "Naoyo Kimura"],
  ['101', 'WHT', '102/086', "Ligton"],
  ['102', 'WHT', '103/086', "Kuroimori"],
  ['103', 'BLK', '099/086', "Katsunori Sato"],
  ['104', 'BLK', '100/086', "AKIRA EGAWA"],
  ['105', 'BLK', '101/086', "Hoshino KURO"],
  ['106', 'BLK', '102/086', "Yoriyuki Ikegami"],
  ['107', 'BLK', '103/086', "aspara"],
  ['108', 'BLK', '104/086', "KEIICHIRO ITO"],
  ['109', 'BLK', '105/086', "Shinji Kanda"],
  ['110', 'BLK', '106/086', "Akino Fukuji"],
  ['111', 'BLK', '107/086', "Takeshi Nakamura"],
  ['112', 'BLK', '108/086', "Rond"],
  ['113', 'BLK', '109/086', "osare"],
  ['114', 'BLK', '110/086', "Whisker"],
  ['115', 'BLK', '111/086', "rika"],
  ['116', 'BLK', '112/086', "Tomomi Ozaki"],
  ['117', 'BLK', '113/086', "ryoma uratsuka"],
  ['118', 'BLK', '114/086', "Kurata So"],
  ['119', 'BLK', '115/086', "Yukiko Baba"],
  ['120', 'SVP', '209', "Anesaki Dynamic"],
  ['121', 'BLK', '116/086', "miki kudo"],
  ['122', 'BLK', '117/086', "Mizue"],
  ['123', 'BLK', '118/086', "USGMEN"],
  ['124', 'BLK', '119/086', "Kedamahadaitai Yawarakai"],
  ['125', 'SVP', '212', "satoma"],
  ['126', 'BLK', '120/086', "Masako Tomii"],
  ['127', 'BLK', '121/086', "Aya Kusube"],
  ['128', 'BLK', '122/086', "Nabatame Kazutaka"],
  ['129', 'BLK', '123/086', "Shinya Mizuno"],
  ['130', 'BLK', '124/086', "Koji Nakata"],
  ['131', 'BLK', '125/086', "Shigenori Negishi"],
  ['132', 'BLK', '126/086', "Souichirou Gunjima"],
  ['133', 'BLK', '127/086', "Kazumasa Yasukuni"],
  ['134', 'BLK', '128/086', "GOSSAN"],
  ['135', 'BLK', '129/086', "Shimaris Yukichi"],
  ['136', 'BLK', '130/086', "MINAMINAMI Take"],
  ['137', 'BLK', '131/086', "SIE NANAHARA"],
  ['138', 'BLK', '132/086', "Apios"],
  ['139', 'BLK', '133/086', "kurumitsu"],
  ['140', 'BLK', '134/086', "Oku"],
  ['141', 'BLK', '135/086', "Fujimoto Gold"],
  ['142', 'BLK', '136/086', "Tonji Matsuno"],
  ['143', 'BLK', '137/086', "Uninori"],
  ['144', 'WHT', '144/086', "Saya Tsuruta"],
  ['145', 'WHT', '145/086', "Bun Toujo"],
  ['146', 'BLK', '138/086', "Uta"],
  ['147', 'BLK', '142/086', "Dsuke"],
  ['148', 'BLK', '143/086', "toriyufu"],
  ['149', 'BLK', '144/086', "hncl"],
  ['150', 'BLK', '145/086', "Ayako Ozaki"],
  ['151', 'BLK', '146/086', "Yuya Oka"],
  ['152', 'BLK', '147/086', "akagi"],
  ['153', 'BLK', '148/086', "Mori Yuu"],
  ['154', 'BLK', '149/086', "cochi8i"],
  ['155', 'BLK', '150/086', "Yoshioka"],
  ['156', 'BLK', '151/086', "Asako Ito"],
  ['157', 'BLK', '152/086', "Natsumi Yoshida"],
  ['158', 'BLK', '153/086', "tono"],
  ['159', 'BLK', '156/086', "N-DESIGN Inc."],
  ['160', 'BLK', '157/086', "N-DESIGN Inc."],
  ['161', 'BLK', '158/086', "takuyoa"],
  ['162', 'BLK', '159/086', "5ban Graphics"],
  ['163', 'BLK', '160/086', "N-DESIGN Inc."],
  ['164', 'BLK', '161/086', "5ban Graphics"],
  ['165', 'BLK', '163/086', "hncl"],
  ['166', 'BLK', '162/086', "Yuu Nishida"],
  ['167', 'BLK', '164/086', "Ryota Murayama"],
  ['168', 'BLK', '165/086', "chibi"],
  ['169', 'BLK', '166/086', "danciao"],
  ['170', 'BLK', '167/086', "LINNE"],
  ['171', 'BLK', '168/086', "Mitsuhiro Arita"],
  ['172', 'BLK', '169/086', "kantaro"],
  ['173', 'NEW', '', "Iwamoto05"],
  ['174', 'BLK', '172/086', "takuyoa"],
]

const SET_NAME: Record<Src, string> = {
  BLK: 'Black Bolt',
  WHT: 'White Flare',
  SVP: 'SV Black Star Promo',
  NEW: 'New for Black Bolt',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 86)
const SECRET = rows.filter((r) => +r.cn > 86)

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'BWR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return { tier: t, blk: n('BLK'), wht: n('WHT'), svp: n('SVP'), fresh: n('NEW'), total: list.length }
})
const count = (s: Src) => rows.filter((r) => r.src === s).length

const PROMOS = rows.filter((r) => r.src === 'SVP')
const SWAPPED = rows.filter((r) => r.src === 'WHT')
const NPLAN = rows.filter((r) => r.name === "N's Plan" && +r.cn > 86).reverse()

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'What is different from English' },
  { id: 'secret-rares', label: 'All 88 secret rares' },
  { id: 'main-set', label: 'The 86-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Is Chinese Black Bolt the same as English Black Bolt?',
    a: "Mostly. 160 of its 174 cards match English Black Bolt. Ten match English White Flare, three Art Rares match English Black Star Promos, and one card, the N's Plan Special Art Rare, is new.",
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: "N's Plan 173/086, the Special Art Rare by Iwamoto05. It is the set's only Chinese Exclusive and has no English version.",
  },
  {
    q: 'Where are Klink and Rufflet?',
    a: 'In Chinese White Flare. English Black Bolt has Klink, Klang, Klinklang, Rufflet and Braviary, but the Chinese release moved them to White Flare and brought in Litwick, Lampent, Chandelure, Vullaby and Mandibuzz from English White Flare.',
  },
  {
    q: 'Is the Zekrom ex Black White Rare the same as in English?',
    a: 'Yes. 174/086 matches English Black Bolt 172/086 by takuyoa. English Black Bolt also has a Victini Black White Rare, which is not in the Chinese set.',
  },
]

export const Route = createFileRoute('/blog/black-bolt-card-origins')({
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
  component: BlackBoltOrigins,
})

function OriginsTable({ list, caption }: { list: typeof rows; caption: string }) {
  // Names the table for screen readers and labels its scroll area.
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
        {/* Row groups of 20: the same table on screen and to screen readers, but no single
            group outweighs the article text when a reader mode picks the main content. */}
        {chunk(list, 20).map((group, g) => (
          <tbody key={g}>
            {group.map((r) => (
              <tr key={r.cn} className={r.src === 'NEW' ? 'is-current' : undefined}>
                <th scope="row">{r.cn}</th>
                <td>
                  {r.name}
                  <span className="cell-sub">
                    <RarityAbbr code={r.rarity} />
                  </span>
                </td>
                <td>
                  {r.src === 'NEW' ? (
                    <span className="cell-none">Chinese Exclusive, no English version</span>
                  ) : (
                    <>
                      {SET_NAME[r.src]} {r.en}
                    </>
                  )}
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

function BlackBoltOrigins() {
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
        lede="Chinese Black Bolt is close to English Black Bolt, with a few differences. We matched all 174 cards to English, including the ones borrowed from White Flare and the one Chinese Exclusive that does not exist in English."
        cta={{
          heading: 'Collect Black Bolt',
          body: 'See every card on the full card list, or pick up a box.',
          links: [
            { to: '/sets/chinese/black-bolt-csv10-5', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          {count('BLK')} of the 174 cards in Black Bolt (set code CSV10.5C) match English Black Bolt. The other {174 - count('BLK')} are where it gets interesting:{' '}
          {count('WHT')} match English White Flare, {count('SVP')} Art Rares match English Black Star Promos, and one card is new, the
          Chinese Exclusive N's Plan Special Art Rare. For the chase cards and box odds, see our{' '}
          <Link to="/blog/black-bolt-set-guide">set guide</Link>. Our{' '}
          <Link to="/blog/black-bolt-white-flare-release-news">release post</Link> covers both sets side by side.
        </p>

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

        <h2 id="at-a-glance">At a glance</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-2" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-2" className="sr-only">At a glance</caption>
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">English Black Bolt</th>
                <th scope="col">English White Flare</th>
                <th scope="col">Promo</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">
                    {RARITY_NAME[t.tier] ?? t.tier}
                    <span className="cell-sub">{t.tier}</span>
                  </th>
                  <td>{t.blk || '–'}</td>
                  <td>{t.wht || '–'}</td>
                  <td>{t.svp || '–'}</td>
                  <td>{t.fresh || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Rarity is the Chinese rarity. Art Rare matches English Illustration Rare, Super Rare matches Ultra Rare, and Special Art Rare
          matches Special Illustration Rare. Black White Rare has the same name in both.
        </p>

        <h2 id="patterns">What is different from English</h2>
        <p>
          <strong>Five Pokémon swapped sets.</strong> In English, Litwick, Lampent, Chandelure, Vullaby and Mandibuzz are White Flare
          cards. In Chinese they are in Black Bolt, along with their Art Rares, which is where the {count('WHT')} White Flare matches come
          from. Going the other way, English Black Bolt's Klink, Klang, Klinklang, Rufflet and Braviary are in Chinese White Flare. The art
          is unchanged, only the set is different, so check the right set when you look these up.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">What is different from English</caption>
            <thead>
              <tr>
                <th scope="col">Black Bolt card</th>
                <th scope="col">English White Flare</th>
              </tr>
            </thead>
            <tbody>
              {SWAPPED.map((r) => (
                <tr key={r.cn}>
                  <th scope="row">
                    {r.cn} {r.name} (<RarityAbbr code={r.rarity} />)
                  </th>
                  <td>{r.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Every non-ex Pokémon gets an Art Rare.</strong> English Black Bolt has no Illustration Rare of Victini, Thundurus or
          Reuniclus. The Chinese set gives all three an Art Rare, and each uses art that English released as an SV Black Star Promo:
        </p>
        <ul className="card-grid cols-3">
          {PROMOS.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/086 Art Rare, Black Bolt`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.cn}/086 · SVP {r.en} · {r.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          <strong>One Chinese Exclusive, two English cards left out.</strong> The Chinese Exclusive N's Plan Special Art Rare 173/086 by Iwamoto05 has no English
          version. English Black Bolt's own N's Plan Special Illustration Rare (170/086 by REND) is not in the Chinese set, and neither is
          its Victini Black White Rare (171/086), so Zekrom ex is the only Black White Rare here. The N's Plan Super Rare is the same art as
          in English.
        </p>
        <ul className="card-grid cols-2">
          {NPLAN.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/086 ${rarityFullName(r.rarity)}, Black Bolt`} loading="lazy" width={300} height={419} />
                <figcaption>
                  {r.src === 'NEW' && <ChineseExclusiveBadge />}
                  <strong>
                    {r.name} <RarityAbbr code={r.rarity} />
                  </strong>
                  {r.cn}/086 · {r.src === 'NEW' ? 'no English version' : `Black Bolt ${r.en}`} · {r.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          <strong>The Zekrom ex cards match English.</strong> The Super Rare 161/086, the Special Art Rare 169/086 and the Black White Rare
          174/086 are the same art as English Black Bolt 158, 166 and 172.
        </p>

        <h2 id="secret-rares">All 88 secret rares</h2>
        <p>Every card above 086, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the English card each one matches" />

        <BuyStrip />

        <h2 id="main-set">The 86-card main set</h2>
        <OriginsTable list={MAIN} caption="Main set cards and the English card each one matches" />

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
