import { chunk } from '~/lib/chunk'
import { Zh } from '~/components/blog/Zh'
import { RarityAbbr, rarityFullName } from '~/components/blog/RarityAbbr'
import { useId } from 'react'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv1.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'eternal-birth-card-origins')!

type Src = 'SVI' | 'PAL' | 'OBF' | 'MEW' | 'SVP' | 'PAR' | 'PAF'

// Every Eternal Birth card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// image was compared with every English printing of the same name (TCGdex),
// and every pairing was then checked by eye. Where the same art was printed
// more than once we list the first set it appeared in. The illustrator is
// the one credited on the matching English card. All 167 cards have an
// English match.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'SVI', '001/198', "Shigenori Negishi"],
  ['002', 'SVI', '002/198', "Taira Akitsu"],
  ['003', 'SVI', '005/198', "Tika Matsuno"],
  ['004', 'SVI', '006/198', "DOM"],
  ['005', 'SVI', '007/198', "aoki"],
  ['006', 'OBF', '013/197', "Tomokazu Komiya"],
  ['007', 'OBF', '014/197', "sui"],
  ['008', 'OBF', '015/197', "PLANETA Mochizuki"],
  ['009', 'SVI', '013/198', "Saya Tsuruta"],
  ['010', 'SVI', '014/198', "Kouki Saitou"],
  ['011', 'SVI', '015/198', "Ryota Murayama"],
  ['012', 'SVI', '017/198', "Pani Kobayashi"],
  ['013', 'SVI', '019/198', "takuyoa"],
  ['014', 'SVI', '020/198', "yuu"],
  ['015', 'SVI', '022/198', "Mina Nakai"],
  ['016', 'SVI', '023/198', "Kouki Saitou"],
  ['017', 'SVI', '025/198', "Tika Matsuno"],
  ['018', 'SVI', '026/198', "nagimiso"],
  ['019', 'SVI', '027/198', "Kouki Saitou"],
  ['020', 'SVI', '029/198', "KEIICHIRO ITO"],
  ['021', 'SVI', '033/198', "nagimiso"],
  ['022', 'SVI', '034/198', "hncl"],
  ['023', 'OBF', '033/197', "Saki Hayashiro"],
  ['024', 'SVI', '036/198', "Akira Komayama"],
  ['025', 'SVI', '037/198', "kantaro"],
  ['026', 'SVI', '038/198', "nagimiso"],
  ['027', 'SVI', '039/198', "Souichirou Gunjima"],
  ['028', 'SVI', '041/198', "AKIRA EGAWA"],
  ['029', 'SVI', '042/198', "Narumi Sato"],
  ['030', 'SVI', '043/198', "Shinji Kanda"],
  ['031', 'SVI', '048/198', "Shinji Kanda"],
  ['032', 'SVI', '049/198', "miki kudo"],
  ['033', 'SVI', '050/198', "Souichirou Gunjima"],
  ['034', 'SVI', '051/198', "kurumitsu"],
  ['035', 'SVI', '052/198', "Mizue"],
  ['036', 'SVI', '053/198', "kirisAki"],
  ['037', 'SVI', '054/198', "Kouki Saitou"],
  ['038', 'SVI', '055/198', "Shin Nagasawa"],
  ['039', 'SVI', '057/198', "KIYOTAKA OSHIYAMA"],
  ['040', 'SVI', '061/198', "Souichirou Gunjima"],
  ['041', 'SVI', '062/198', "OKACHEKE"],
  ['042', 'SVI', '063/198', "KIYOTAKA OSHIYAMA"],
  ['043', 'SVI', '064/198', "Shiburingaru"],
  ['044', 'SVI', '065/198', "hncl"],
  ['045', 'SVI', '068/198', "Naoki Saito"],
  ['046', 'SVI', '070/198', "Kouki Saitou"],
  ['047', 'OBF', '070/197', "GOSSAN"],
  ['048', 'SVI', '071/198', "Yuu Nishida"],
  ['049', 'SVI', '072/198', "Atsushi Furusawa"],
  ['050', 'SVI', '081/198', "5ban Graphics"],
  ['051', 'SVI', '082/198', "OKACHEKE"],
  ['052', 'SVI', '083/198', "Toshinao Aoki"],
  ['053', 'SVI', '087/198', "Jerky"],
  ['054', 'SVI', '088/198', "PLANETA Mochizuki"],
  ['055', 'PAL', '089/193', "Aya Kusube"],
  ['056', 'SVI', '091/198', "Mizue"],
  ['057', 'SVI', '092/198', "saino misaki"],
  ['058', 'SVI', '093/198', "Haru Akasaka"],
  ['059', 'SVI', '095/198', "Nelnal"],
  ['060', 'SVI', '096/198', "GOSSAN"],
  ['061', 'SVI', '098/198', "Saya Tsuruta"],
  ['062', 'SVI', '099/198', "You Iribi"],
  ['063', 'SVI', '101/198', "Tika Matsuno"],
  ['064', 'SVI', '103/198', "Hitoshi Ariga"],
  ['065', 'PAL', '101/193', "Shibuzoh."],
  ['066', 'PAL', '104/193', "sowsow"],
  ['067', 'PAL', '105/193', "Kouki Saitou"],
  ['068', 'SVP', '031', "takuyoa"],
  ['069', 'SVI', '107/198', "nagimiso"],
  ['070', 'SVI', '108/198', "Ryuta Fuse"],
  ['071', 'SVI', '109/198', "Anesaki Dynamic"],
  ['072', 'SVI', '110/198', "miki kudo"],
  ['073', 'SVI', '111/198', "Jerky"],
  ['074', 'SVI', '112/198', "Naoyo Kimura"],
  ['075', 'SVP', '017', "5ban Graphics"],
  ['076', 'SVI', '115/198', "Tomokazu Komiya"],
  ['077', 'SVI', '116/198', "kantaro"],
  ['078', 'SVI', '117/198', "Misa Tsutsui"],
  ['079', 'SVI', '118/198', "GOSSAN"],
  ['080', 'SVI', '119/198', "Kouki Saitou"],
  ['081', 'SVI', '120/198', "Yuya Oka"],
  ['082', 'SVI', '121/198', "Yuka Morii"],
  ['083', 'SVI', '123/198', "5ban Graphics"],
  ['084', 'SVI', '125/198', "aky CG Works"],
  ['085', 'SVI', '128/198', "sui"],
  ['086', 'OBF', '135/197', "Nisota Niso"],
  ['087', 'SVI', '130/198', "Shiburingaru"],
  ['088', 'SVI', '131/198', "Nisota Niso"],
  ['089', 'SVI', '132/198', "sowsow"],
  ['090', 'SVI', '133/198', "Hideki Ishikawa"],
  ['091', 'SVI', '134/198', "Anesaki Dynamic"],
  ['092', 'PAL', '144/193', "Akira Komayama"],
  ['093', 'PAL', '146/193', "Souichirou Gunjima"],
  ['094', 'SVI', '138/198', "nagimiso"],
  ['095', 'SVI', '139/198', "Lee HyunJung"],
  ['096', 'SVI', '141/198', "nagimiso"],
  ['097', 'SVI', '142/198', "Anesaki Dynamic"],
  ['098', 'SVI', '143/198', "5ban Graphics"],
  ['099', 'SVI', '151/198', "HYOGONOSUKE"],
  ['100', 'SVI', '152/198', "kantaro"],
  ['101', 'SVI', '153/198', "Kagemaru Himeno"],
  ['102', 'SVI', '160/198', "yuu"],
  ['103', 'SVI', '161/198', "KIYOTAKA OSHIYAMA"],
  ['104', 'SVI', '162/198', "Oswaldo KATO"],
  ['105', 'PAR', '157/182', "kawayoo"],
  ['106', 'SVP', '018', "5ban Graphics"],
  ['107', 'SVI', '170/198', "Toyste Beach"],
  ['108', 'SVI', '168/198', "Ayaka Yoshida"],
  ['109', 'PAL', '188/193', "Toyste Beach"],
  ['110', 'MEW', '162/165', "inose yukie"],
  ['111', 'SVI', '182/198', "Studio Bora Inc."],
  ['112', 'SVI', '196/198', "Ayaka Yoshida"],
  ['113', 'SVI', '194/198', "Studio Bora Inc."],
  ['114', 'SVI', '192/198', "Toyste Beach"],
  ['115', 'SVI', '174/198', "Toyste Beach"],
  ['116', 'PAL', '176/193', "Studio Bora Inc."],
  ['117', 'SVI', '169/198', "inose yukie"],
  ['118', 'PAL', '173/193', "Toyste Beach"],
  ['119', 'MEW', '161/165', "hncl"],
  ['120', 'SVI', '175/198', "GIDORA"],
  ['121', 'SVI', '189/198', "kirisAki"],
  ['122', 'SVI', '190/198', "kirisAki"],
  ['123', 'SVI', '166/198', "GIDORA"],
  ['124', 'SVI', '183/198', "yuu"],
  ['125', 'SVI', '179/198', "Sanosuke Sakuma"],
  ['126', 'SVI', '178/198', "Oswaldo KATO"],
  ['127', 'PAL', '191/193', ""],
  ['128', 'SVI', '199/198', "Miki Tanaka"],
  ['129', 'SVI', '200/198', "Oswaldo KATO"],
  ['130', 'SVI', '206/198', "You Iribi"],
  ['131', 'PAF', '224/091', "Tetsu Kayama"],
  ['132', 'SVI', '207/198', "AKIRA EGAWA"],
  ['133', 'PAL', '216/193', "Tika Matsuno"],
  ['134', 'PAL', '217/193', "Tika Matsuno"],
  ['135', 'PAL', '223/193', "Oswaldo KATO"],
  ['136', 'SVI', '223/198', "takuyoa"],
  ['137', 'SVI', '226/198', "PLANETA Tsuji"],
  ['138', 'SVI', '227/198', "5ban Graphics"],
  ['139', 'SVI', '229/198', "PLANETA Mochizuki"],
  ['140', 'PAL', '240/193', "takuyoa"],
  ['141', 'SVI', '230/198', "5ban Graphics"],
  ['142', 'SVI', '231/198', "aky CG Works"],
  ['143', 'OBF', '214/197', "PLANETA Mochizuki"],
  ['144', 'SVI', '232/198', "PLANETA Hiiragi"],
  ['145', 'SVI', '233/198', "5ban Graphics"],
  ['146', 'MEW', '197/165', "hncl"],
  ['147', 'SVI', '236/198', "GIDORA"],
  ['148', 'SVI', '240/198', "kirisAki"],
  ['149', 'SVI', '241/198', "kirisAki"],
  ['150', 'SVI', '235/198', "GIDORA"],
  ['151', 'SVI', '239/198', "yuu"],
  ['152', 'SVI', '238/198', "Sanosuke Sakuma"],
  ['153', 'SVI', '243/198', "Miki Tanaka"],
  ['154', 'SVI', '244/198', "kantaro"],
  ['155', 'PAL', '262/193', "Tika Matsuno"],
  ['156', 'SVI', '246/198', "Pani Kobayashi"],
  ['157', 'SVI', '247/198', "Ryota Murayama"],
  ['158', 'SVI', '248/198', "KEIICHIRO ITO"],
  ['159', 'MEW', '204/165', "Hideki Ishikawa"],
  ['160', 'SVI', '250/198', "Oswaldo KATO"],
  ['161', 'SVI', '249/198', "kantaro"],
  ['162', 'SVI', '252/198', "OKACHEKE"],
  ['163', 'SVI', '251/198', "Akira Komayama"],
  ['164', 'SVI', '253/198', "5ban Graphics"],
  ['165', 'SVI', '254/198', "aky CG Works"],
  ['166', 'PAL', '276/193', "Toyste Beach"],
  ['167', 'MEW', '206/165', "Studio Bora Inc."],
]

const SET_NAME: Record<Src, string> = {
  SVI: 'Scarlet & Violet',
  PAL: 'Paldea Evolved',
  OBF: 'Obsidian Flames',
  MEW: '151',
  SVP: 'SV Black Star Promo',
  PAR: 'Paradox Rift',
  PAF: 'Paldean Fates',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 127)
const SECRET = rows.filter((r) => +r.cn > 127)
const BIG3: Src[] = ['SVI', 'PAL', 'OBF']
const count = (s: Src) => rows.filter((r) => r.src === s).length

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    svi: n('SVI'),
    pal: n('PAL'),
    obf: n('OBF'),
    other: list.filter((r) => !BIG3.includes(r.src)).length,
    total: list.length,
  }
})

const SET_COUNTS = (Object.keys(SET_NAME) as Src[])
  .map((s) => ({ s, n: count(s) }))
  .filter((x) => x.n > 0)
  .sort((a, b) => b.n - a.n)

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'chase-cards', label: 'Lead chase cards: Miraidon ex and Koraidon ex' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'secret-rares', label: `All ${SECRET.length} secret rares` },
  { id: 'main-set', label: `The ${MAIN.length}-card main set` },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Eternal Birth?',
    a: `Mostly the first Scarlet & Violet set, which matches ${count('SVI')} of the 167 cards. Paldea Evolved matches ${count('PAL')} and Obsidian Flames matches ${count('OBF')}, with ${count('MEW')} more from 151. The other ${count('SVP') + count('PAR') + count('PAF')} come from SV Black Star Promos, Paradox Rift and Paldean Fates.`,
  },
  {
    q: 'Are the Miraidon ex and Koraidon ex Special Art Rares the same as in English?',
    a: 'Yes. Miraidon ex 154/127 matches Scarlet & Violet 244/198 by kantaro, and Koraidon ex 157/127 matches Scarlet & Violet 247/198 by Ryota Murayama.',
  },
  {
    q: 'Does Eternal Birth have any cards with no English version?',
    a: 'No. All 167 cards use an illustration that was also printed in English.',
  },
  {
    q: 'Are any Eternal Birth cards English promos?',
    a: 'Yes, three. Tinkaton ex 068/127 matches SVP 031, Lucario ex 075/127 matches SVP 017 and Cyclizar ex 106/127 matches SVP 018.',
  },
]

export const Route = createFileRoute('/blog/eternal-birth-card-origins')({
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
  component: EternalBirthOrigins,
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
              <tr key={r.cn}>
                <th scope="row">{r.cn}</th>
                <td>
                  {r.name}
                  <span className="cell-sub">
                    <RarityAbbr code={r.rarity} />
                  </span>
                </td>
                <td>
                  {SET_NAME[r.src]} {r.en}
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

function EternalBirthOrigins() {
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
  // The two cover legendaries as Special Art Rares and gold Ultra Rares.
  const leadCards = ['154', '157', '164', '165'].map((n) => rows.find((r) => r.cn === n)!)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Eternal Birth follows the first English Scarlet & Violet set closely, with cards from six other English sources mixed in. We matched all 167 cards to English, and every one has an English version."
        cta={{
          heading: 'Collect Eternal Birth',
          body: 'Browse all 167 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/eternal-birth-csv1', label: 'See the full card list' }],
        }}
      >
        <p>
          Eternal Birth (<Zh>亘古开来</Zh>, set code CSV1C) released on January 17, 2025. It is the first Chinese Scarlet & Violet set, and
          four in five of its 167 cards match the first English Scarlet & Violet set. Paldea Evolved and Obsidian Flames supply most
          of the rest, and a few come from 151, promos, Paradox Rift and Paldean Fates. Every card has an English version.
        </p>
        <p>
          Our <Link to="/blog/eternal-birth-release-news">release post</Link> covers what is new, and our{' '}
          <Link to="/blog/eternal-birth-set-guide">set guide</Link> shows the chase cards and pull odds.
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
                <th scope="col">Scarlet & Violet</th>
                <th scope="col">Paldea Evolved</th>
                <th scope="col">Obsidian Flames</th>
                <th scope="col">Other</th>
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
                  <td>{t.svi || '–'}</td>
                  <td>{t.pal || '–'}</td>
                  <td>{t.obf || '–'}</td>
                  <td>{t.other || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Rarity is the Chinese rarity. Art Rare matches English Illustration Rare, Super Rare matches Ultra Rare, Special Art Rare
          matches Special Illustration Rare, and Ultra Rare matches the gold Hyper Rare.
        </p>

        <h2 id="chase-cards">Lead chase cards: Miraidon ex and Koraidon ex</h2>
        <p>
          All four versions of each legendary match the first English Scarlet & Violet set. The Miraidon ex Special Art Rare
          154/127 is the English 244/198 by kantaro, and the Koraidon ex Special Art Rare 157/127 is the English 247/198 by Ryota
          Murayama. The gold Ultra Rares 164 and 165 are the English Hyper Rares 253/198 and 254/198.
        </p>
        <ul className="card-grid cols-4">
          {leadCards.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/127 ${rarityFullName(r.rarity)}, Eternal Birth`} loading="lazy" width={300} height={418} />
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.cn}/127 · {rarityFullName(r.rarity)} · {SET_NAME[r.src]} {r.en}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>Scarlet & Violet does most of the work.</strong> It supplies {count('SVI')} of the 167 cards, including Miraidon ex
          and Koraidon ex at every rarity, nine of the eleven Special Art Rares and the three Paldea starter lines. Every card's
          English source, from most cards to fewest:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">Patterns worth knowing</caption>
            <thead>
              <tr>
                <th scope="col">English source</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {SET_COUNTS.map((b) => (
                <tr key={b.s}>
                  <th scope="row">{SET_NAME[b.s]}</th>
                  <td>{b.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>The Tinkaton line comes from Paldea Evolved.</strong> Tinkatink, Tinkatuff and Tinkaton, the Tinkatink and
          Tinkatuff Art Rares, and the Tinkaton ex Super Rare and Special Art Rare all match Paldea Evolved. So do Spiritomb,
          Shroodle, both Grafaiai, Super Rod in both versions, Choice Belt, Bravery Charm and Luminous Energy.
        </p>
        <p>
          <strong>Three Double Rares are English promos.</strong> Tinkaton ex 068/127, Lucario ex 075/127 and Cyclizar ex 106/127
          use illustrations that are SV Black Star Promos in English.
        </p>
        <p>
          <strong>Obsidian Flames adds seven cards.</strong> They are Rowlet, Dartrix and Decidueye ex, Victini ex, Thundurus, and
          Absol ex as both a Double Rare and a Super Rare.
        </p>
        <p>
          <strong>Giovanni comes from 151.</strong> All three versions of Giovanni's Charisma match 151, along with Grabber and the
          gold Switch 167/127. Cyclizar 105/127 matches Paradox Rift, and the Wugtrio Art Rare 131/127 matches Paldean Fates 224/091.
        </p>

        <h2 id="secret-rares">All {SECRET.length} secret rares</h2>
        <p>This table lists every card above 127 with its English twin.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the English card each one matches" />

        <BuyStrip />

        <h2 id="main-set">The {MAIN.length}-card main set</h2>
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
