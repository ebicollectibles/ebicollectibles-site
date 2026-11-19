import { chunk } from '~/lib/chunk'
import { RarityAbbr, rarityFullName } from '~/components/blog/RarityAbbr'
import { useId } from 'react'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/csv5.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'black-crystal-blaze-card-origins')!

type Src = 'PAR' | 'OBF' | 'PAF' | 'SVI' | 'TEF' | 'MEW' | 'PAL' | 'SVP' | 'NEW'

// Every Black Crystal Blaze card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'OBF', '001/197', "Midori Harada"],
  ['002', 'OBF', '002/197', "Haru Akasaka"],
  ['003', 'OBF', '003/197', "sui"],
  ['004', 'OBF', '005/197', "Kurata So"],
  ['005', 'OBF', '008/197', "HYOGONOSUKE"],
  ['006', 'OBF', '011/197', "Narumi Sato"],
  ['007', 'OBF', '012/197', "Anesaki Dynamic"],
  ['008', 'PAR', '015/182', "Tomokazu Komiya"],
  ['009', 'PAR', '017/182', "Toshinao Aoki"],
  ['010', 'OBF', '022/197', "5ban Graphics"],
  ['011', 'SVI', '028/198', "GIDORA"],
  ['012', 'TEF', '022/162', "PLANETA Mochizuki"],
  ['013', 'PAR', '018/182', "Kouki Saitou"],
  ['014', 'OBF', '026/197', "DOM"],
  ['015', 'PAF', '008/91', "Tonji Matsuno"],
  ['016', 'OBF', '034/197', "Miki Tanaka"],
  ['017', 'OBF', '035/197', "Yuya Oka"],
  ['018', 'OBF', '039/197', "otumami"],
  ['019', 'OBF', '042/197', "5ban Graphics"],
  ['020', 'PAR', '026/182', "Mizue"],
  ['021', 'PAR', '027/182', "takuyoa"],
  ['022', 'PAR', '029/182', "Oswaldo KATO"],
  ['023', 'PAF', '016/91', "Gemi"],
  ['024', 'PAR', '033/182', "Midori Harada"],
  ['025', 'PAR', '034/182', "Yuka Morii"],
  ['026', 'OBF', '046/197', "Jerky"],
  ['027', 'OBF', '047/197', "Tonji Matsuno"],
  ['028', 'PAR', '038/182', "5ban Graphics"],
  ['029', 'PAR', '039/182', "miki kudo"],
  ['030', 'PAR', '040/182', "Ryuta Fuse"],
  ['031', 'OBF', '050/197', "OKUBO"],
  ['032', 'OBF', '051/197', "sowsow"],
  ['033', 'OBF', '052/197', "Misa Tsutsui"],
  ['034', 'PAR', '047/182', "Shigenori Negishi"],
  ['035', 'PAR', '049/182', "nagimiso"],
  ['036', 'SVI', '059/198', "Kouki Saitou"],
  ['037', 'SVP', '063', "GOSSAN"],
  ['038', 'PAR', '055/182', "Kouki Saitou"],
  ['039', 'PAR', '058/182', "aky CG Works"],
  ['040', 'PAF', '020/91', "yuu"],
  ['041', 'PAF', '021/91', "aspara"],
  ['042', 'PAR', '060/182', "Sekio"],
  ['043', 'PAR', '061/182', "Narumi Sato"],
  ['044', 'PAR', '064/182', "Kedamahadaitai Yawarakai"],
  ['045', 'PAR', '065/182', "Taira Akitsu"],
  ['046', 'OBF', '067/197', "Kagemaru Himeno"],
  ['047', 'OBF', '068/197', "Souichirou Gunjima"],
  ['048', 'OBF', '069/197', "Masakazu Fukuda"],
  ['049', 'PAR', '066/182', "Shiburingaru"],
  ['050', 'PAR', '069/182', "Yuka Morii"],
  ['051', 'PAF', '023/91', "Kariya"],
  ['052', 'PAF', '024/91', "Yoriyuki Ikegami"],
  ['053', 'PAR', '071/182', "ryoma uratsuka"],
  ['054', 'PAR', '072/182', "Tetsu Kayama"],
  ['055', 'PAR', '074/182', "Saya Tsuruta"],
  ['056', 'OBF', '096/197', "5ban Graphics"],
  ['057', 'OBF', '100/197', "Pani Kobayashi"],
  ['058', 'OBF', '101/197', "Saya Tsuruta"],
  ['059', 'PAR', '091/182', "HYOGONOSUKE"],
  ['060', 'PAR', '092/182', "GOSSAN"],
  ['061', 'PAF', '048/91', "Atsuko Nishida"],
  ['062', 'PAF', '049/91', "Shin Nagasawa"],
  ['063', 'OBF', '107/197', "Nobuhiro Imagawa"],
  ['064', 'PAR', '093/182', "Uta"],
  ['065', 'OBF', '110/197', "Mizue"],
  ['066', 'PAR', '094/182', "saino misaki"],
  ['067', 'PAR', '095/182', "Nisota Niso"],
  ['068', 'OBF', '112/197', "Sumiyoshi Kizuki"],
  ['069', 'PAR', '098/182', "5ban Graphics"],
  ['070', 'PAR', '099/182', "OKUBO"],
  ['071', 'PAR', '100/182', "5ban Graphics"],
  ['072', 'OBF', '122/197', "GIDORA"],
  ['073', 'OBF', '123/197', "5ban Graphics"],
  ['074', 'PAR', '106/182', "Anesaki Dynamic"],
  ['075', 'OBF', '125/197', "5ban Graphics"],
  ['076', 'PAF', '055/91', "Nobuhiro Imagawa"],
  ['077', 'PAF', '056/91', "DOM"],
  ['078', 'PAF', '057/91', "Nelnal"],
  ['079', 'SVP', '041', "kirisAki"],
  ['080', 'OBF', '129/197', "Shin Nagasawa"],
  ['081', 'OBF', '131/197', "Scav"],
  ['082', 'OBF', '133/197', "Haru Akasaka"],
  ['083', 'PAR', '113/182', "Shinji Kanda"],
  ['084', 'OBF', '136/197', "Bun Toujo"],
  ['085', 'PAF', '060/91', "sowsow"],
  ['086', 'PAF', '061/91', "Mousho"],
  ['087', 'OBF', '137/197', "Kedamahadaitai Yawarakai"],
  ['088', 'OBF', '138/197', "Nelnal"],
  ['089', 'PAR', '118/182', "kawayoo"],
  ['090', 'PAR', '119/182', "Yuu Nishida"],
  ['091', 'PAR', '120/182', "SIE NANAHARA"],
  ['092', 'PAR', '126/182', "Naoyo Kimura"],
  ['093', 'OBF', '146/197', "takuyoa"],
  ['094', 'PAR', '127/182', "Miki Tanaka"],
  ['095', 'PAR', '128/182', "SATOSHI NAKAI"],
  ['096', 'OBF', '148/197', "Hitoshi Ariga"],
  ['097', 'OBF', '149/197', "GIDORA"],
  ['098', 'OBF', '150/197', "Ryota Murayama"],
  ['099', 'PAR', '131/182', "Nagomi Nijo"],
  ['100', 'PAR', '133/182', "Shigenori Negishi"],
  ['101', 'PAR', '135/182', "toriyufu"],
  ['102', 'PAR', '136/182', "Tonji Matsuno"],
  ['103', 'PAR', '138/182', "Pani Kobayashi"],
  ['104', 'PAR', '140/182', "Saki Hayashiro"],
  ['105', 'OBF', '167/197', "Kagemaru Himeno"],
  ['106', 'OBF', '168/197', "Nagomi Nijo"],
  ['107', 'PAR', '152/182', "HYOGONOSUKE"],
  ['108', 'OBF', '178/197', "Taiga Kayama"],
  ['109', 'OBF', '179/197', "5ban Graphics"],
  ['110', 'OBF', '180/197', "HYOGONOSUKE"],
  ['111', 'OBF', '184/197', "Akira Komayama"],
  ['112', 'SVI', '163/198', "AKIRA EGAWA"],
  ['113', 'SVI', '165/198', "kantaro"],
  ['114', 'MEW', '159/165', "Ayaka Yoshida"],
  ['115', 'PAR', '175/182', "AYUMI ODASHIMA"],
  ['116', 'PAL', '181/193', "Ayaka Yoshida"],
  ['117', 'PAR', '161/182', "AYUMI ODASHIMA"],
  ['118', 'OBF', '191/197', "Toyste Beach"],
  ['119', 'PAR', '178/182', "Studio Bora Inc."],
  ['120', 'PAR', '177/182', "Studio Bora Inc."],
  ['121', 'PAR', '165/182', "Akira Komayama"],
  ['122', 'PAR', '174/182', "yuu"],
  ['123', 'PAF', '078/91', "GOSSAN"],
  ['124', 'PAF', '085/91', "Cona Nitanda"],
  ['125', 'PAF', '086/91', "Naoki Saito"],
  ['126', 'OBF', '193/197', "yuu"],
  ['127', 'PAR', '167/182', "kirisAki"],
  ['128', 'OBF', '196/197', "Oswaldo KATO"],
  ['129', 'PAR', '182/182', ""],
  ['130', 'OBF', '198/197', "Masako Tomii"],
  ['131', 'PAR', '185/182', "KEIICHIRO ITO"],
  ['132', 'PAR', '196/182', "Atsushi Furusawa"],
  ['133', 'PAR', '201/182', "0313"],
  ['134', 'OBF', '204/197', "KYUPIYAMA"],
  ['135', 'PAR', '205/182', "Masako Tomii"],
  ['136', 'PAR', '213/182', "Jiro Sasumo"],
  ['137', 'OBF', '209/197', "Narumi Sato"],
  ['138', 'OBF', '210/197', "5ban Graphics"],
  ['139', 'PAR', '218/182', "takuyoa"],
  ['140', 'PAR', '219/182', "5ban Graphics"],
  ['141', 'OBF', '212/197', "5ban Graphics"],
  ['142', 'PAR', '226/182', "5ban Graphics"],
  ['143', 'PAR', '227/182', "5ban Graphics"],
  ['144', 'OBF', '213/197', "5ban Graphics"],
  ['145', 'OBF', '215/197', "5ban Graphics"],
  ['146', 'PAR', '230/182', "Satoshi Shirai"],
  ['147', 'PAR', '232/182', "Saki Hayashiro"],
  ['148', 'PAR', '235/182', "Akira Komayama"],
  ['149', 'PAR', '243/182', "En Morikura"],
  ['150', 'PAF', '227/91', "GOSSAN"],
  ['151', 'OBF', '220/197', "yuu"],
  ['152', 'PAR', '236/182', "kirisAki"],
  ['153', 'OBF', '222/197', "Toshinao Aoki"],
  ['154', 'PAR', '245/182', "Oswaldo KATO"],
  ['155', 'OBF', '223/197', "AKIRA EGAWA"],
  ['156', 'PAR', '253/182', "Jiro Sasumo"],
  ['157', 'NEW', '', "Kariya"],
  ['158', 'PAF', '236/91', "Taiga Kayama"],
  ['159', 'OBF', '227/197', "Ryota Murayama"],
  ['160', 'PAR', '254/182', "rika"],
  ['161', 'PAR', '260/182', "5ban Graphics"],
  ['162', 'OBF', '228/197', "5ban Graphics"],
  ['163', 'SVI', '256/198', "Studio Bora Inc."],
  ['164', 'NEW', '', "inose yukie"],
]

const SET_NAME: Record<Src, string> = {
  PAR: 'Paradox Rift',
  OBF: 'Obsidian Flames',
  PAF: 'Paldean Fates',
  SVI: 'Scarlet & Violet',
  TEF: 'Temporal Forces',
  MEW: '151',
  PAL: 'Paldea Evolved',
  SVP: 'SV Black Star Promo',
  NEW: 'New for Black Crystal Blaze',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 129)
const SECRET = rows.filter((r) => +r.cn > 129)
const BIG3: Src[] = ['PAR', 'OBF', 'PAF']

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    par: n('PAR'),
    obf: n('OBF'),
    paf: n('PAF'),
    other: list.filter((r) => !BIG3.includes(r.src) && r.src !== 'NEW').length,
    fresh: n('NEW'),
    total: list.length,
  }
})

const SET_COUNTS = (Object.keys(SET_NAME) as Src[])
  .map((s) => ({ s, n: rows.filter((r) => r.src === s).length }))
  .filter((x) => x.n > 0 && x.s !== 'NEW')
  .sort((a, b) => b.n - a.n)

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'secret-rares', label: 'All 35 secret rares' },
  { id: 'main-set', label: 'The 129-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Black Crystal Blaze?',
    a: 'There is no single one. Most of its cards match Paradox Rift (73), Obsidian Flames (61) and Paldean Fates (18), with the rest from five other English sources and two new arts.',
  },
  {
    q: 'Which cards are Chinese Exclusives?',
    a: 'Two: the Larry Special Art Rare 157/129 by Kariya and the gold Defiance Band Ultra Rare 164/129 by inose yukie. Neither has an English version.',
  },
  {
    q: 'Is the Charizard ex Special Art Rare the same as in English?',
    a: 'Yes. 155/129 matches Obsidian Flames 223/197 by AKIRA EGAWA, and the gold 162/129 matches Obsidian Flames 228/197.',
  },
  {
    q: 'Are any Black Crystal Blaze cards English promos?',
    a: 'Two: Cetitan 037/129 matches SVP 063 and Paldean Wooper 079/129 matches SVP 041.',
  },
]

export const Route = createFileRoute('/blog/black-crystal-blaze-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:image:width', content: '1600' },
      { property: 'og:image:height', content: '900' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: post.heroImage },
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
  component: BlackCrystalBlazeOrigins,
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

function BlackCrystalBlazeOrigins() {
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
  const fresh = rows.filter((r) => r.src === 'NEW')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Black Crystal Blaze mixes cards from several English sets into one. We matched all 164 cards to English and found two Chinese Exclusives that do not exist in English."
        cta={{
          heading: 'Collect Black Crystal Blaze',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/black-crystal-blaze-csv5', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-crystal-blaze-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Black Crystal Blaze (set code CSV5C) does not follow one English set. Its 164 cards pull mostly from Paradox Rift, Obsidian Flames and Paldean
          Fates, with a handful from other Scarlet & Violet sets and promos, plus two Chinese Exclusives: the Larry Special Art Rare and the gold Defiance Band. For the chase cards and box odds, see our{' '}
          <Link to="/blog/black-crystal-blaze-set-guide">set guide</Link>.
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
                <th scope="col">Paradox Rift</th>
                <th scope="col">Obsidian Flames</th>
                <th scope="col">Paldean Fates</th>
                <th scope="col">Other</th>
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
                  <td>{t.par || '–'}</td>
                  <td>{t.obf || '–'}</td>
                  <td>{t.paf || '–'}</td>
                  <td>{t.other || '–'}</td>
                  <td>{t.fresh || '–'}</td>
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

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>Two cards are Chinese Exclusives.</strong> There is no English Larry Special Art Rare or gold Defiance Band. The English Larry
          Super Rare is here too, so a Chinese binder holds one more version of Larry.
        </p>
        <ul className="card-grid cols-2">
          {fresh.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/129 ${rarityFullName(r.rarity)}, Chinese Exclusive, Black Crystal Blaze`} loading="lazy" width={300} height={419} />
                <figcaption>
                  <ChineseExclusiveBadge />
                  <strong>{r.name}</strong>
                  {r.cn}/129 · <RarityAbbr code={r.rarity} /> · {r.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          <strong>The rest of the chase mostly comes from two sets.</strong> Charizard ex, Eiscue ex, Glimmora ex and Vespiquen ex match Obsidian Flames,
          while Garchomp ex, Altaria ex, Hoopa ex and the other Pokémon ex match Paradox Rift. Clive's Super Rare and Special Art Rare match
          Paldean Fates, and the gold Rare Candy matches the original Scarlet & Violet set.
        </p>
        <p>
          <strong>Three sets do most of the work.</strong> Every card's English source, from most cards to fewest:
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
          <strong>Two promo arts.</strong> Cetitan 037/129 and Paldean Wooper 079/129 use art that English released as SV Black Star
          Promos, and Scovillain ex 012/129 uses its Temporal Forces art.
        </p>

        <h2 id="secret-rares">All 35 secret rares</h2>
        <p>Every card above 129, with its English twin. Highlighted rows are new.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the English card each one matches" />

        <BuyStrip />

        <h2 id="main-set">The 129-card main set</h2>
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
