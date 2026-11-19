import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/csv3.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'fearless-terastal-card-origins')!

type Src = 'PAL' | 'OBF' | 'SVI' | 'SVP' | 'MEW' | 'PAR' | 'NEW'

// Every Fearless Terastal card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// image was compared with every English printing of the same name (TCGdex),
// and every pairing was then checked by eye. Where the same art was printed
// more than once we list the first set it appeared in. The illustrator is
// the one credited on the matching English card; for 155, which has no
// English card, it is the credit printed on the Chinese card.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'PAL', '001/193', "Yukiko Baba"],
  ['002', 'PAL', '002/193', "Yoriyuki Ikegami"],
  ['003', 'PAL', '003/193', "Naoyo Kimura"],
  ['004', 'PAL', '004/193', "Kouki Saitou"],
  ['005', 'PAL', '005/193', "5ban Graphics"],
  ['006', 'OBF', '006/197', "Saya Tsuruta"],
  ['007', 'OBF', '007/197', "Haru Akasaka"],
  ['008', 'PAL', '010/193', "Taira Akitsu"],
  ['009', 'PAL', '011/193', "Ryuta Fuse"],
  ['010', 'OBF', '016/197', "Kurata So"],
  ['011', 'OBF', '017/197', "nagimiso"],
  ['012', 'OBF', '018/197', "Atsushi Furusawa"],
  ['013', 'PAL', '016/193', "Kyoko Umemoto"],
  ['014', 'PAL', '018/193', "Oswaldo KATO"],
  ['015', 'PAL', '027/193', "5ban Graphics"],
  ['016', 'SVI', '031/198', "Tika Matsuno"],
  ['017', 'SVP', '011', "Ryuta Fuse"],
  ['018', 'SVI', '032/198', "5ban Graphics"],
  ['019', 'OBF', '031/197', "Mizue"],
  ['020', 'OBF', '032/197', "Shiburingaru"],
  ['021', 'SVI', '035/198', "Kurata So"],
  ['022', 'OBF', '036/197', "Nagomi Nijo"],
  ['023', 'OBF', '037/197', "Aya Kusube"],
  ['024', 'OBF', '038/197', "Haru Akasaka"],
  ['025', 'OBF', '040/197', "Yuka Morii"],
  ['026', 'OBF', '041/197', "Yukiko Baba"],
  ['027', 'PAL', '029/193', "kurumitsu"],
  ['028', 'PAL', '030/193', "Nisota Niso"],
  ['029', 'OBF', '043/197', "Saya Tsuruta"],
  ['030', 'OBF', '044/197', "Souichirou Gunjima"],
  ['031', 'PAL', '040/193', "5ban Graphics"],
  ['032', 'SVI', '044/198', "KIYOTAKA OSHIYAMA"],
  ['033', 'SVI', '045/198', "5ban Graphics"],
  ['034', 'PAL', '044/193', "saino misaki"],
  ['035', 'PAL', '045/193', "En Morikura"],
  ['036', 'PAL', '047/193', "ryoma uratsuka"],
  ['037', 'PAL', '048/193', "kawayoo"],
  ['038', 'PAL', '054/193', "Saya Tsuruta"],
  ['039', 'PAL', '055/193', "Pani Kobayashi"],
  ['040', 'PAL', '057/193', "Akira Komayama"],
  ['041', 'PAL', '059/193', "Kouki Saitou"],
  ['042', 'PAL', '060/193', "Shin Nagasawa"],
  ['043', 'PAL', '061/193', "aky CG Works"],
  ['044', 'PAL', '062/193', "OKACHEKE"],
  ['045', 'PAL', '064/193', "Teeziro"],
  ['046', 'PAL', '066/193', "sui"],
  ['047', 'PAL', '067/193', "Scav"],
  ['048', 'SVI', '066/198', "Narumi Sato"],
  ['049', 'SVI', '067/198', "Kurata So"],
  ['050', 'SVP', '016', "PLANETA Tsuji"],
  ['051', 'PAL', '073/193', "miki kudo"],
  ['052', 'PAL', '077/193', "Pani Kobayashi"],
  ['053', 'PAL', '079/193', "PLANETA Yamashita"],
  ['054', 'SVI', '077/198', "Saya Tsuruta"],
  ['055', 'SVI', '079/198', "Kouki Saitou"],
  ['056', 'PAL', '083/193', "Yuu Nishida"],
  ['057', 'PAL', '084/193', "Hitoshi Ariga"],
  ['058', 'PAR', '073/182', "chibi"],
  ['059', 'PAL', '094/193', "Toshinao Aoki"],
  ['060', 'PAL', '095/193', "Shin Nagasawa"],
  ['061', 'PAL', '096/193', "HYOGONOSUKE"],
  ['062', 'PAL', '097/193', "Kagemaru Himeno"],
  ['063', 'SVP', '004', "PLANETA Yamashita"],
  ['064', 'SVI', '102/198', "Pani Kobayashi"],
  ['065', 'SVP', '010', "Sanosuke Sakuma"],
  ['066', 'SVI', '104/198', "yuu"],
  ['067', 'SVI', '106/198', "Kouki Saitou"],
  ['068', 'PAL', '109/193', "Jerky"],
  ['069', 'OBF', '108/197', "Scav"],
  ['070', 'OBF', '109/197', "0313"],
  ['071', 'PAL', '114/193', "kawayoo"],
  ['072', 'PAL', '115/193', "Yuya Oka"],
  ['073', 'OBF', '111/197', "sowsow"],
  ['074', 'OBF', '114/197', "Nagomi Nijo"],
  ['075', 'OBF', '115/197', "Misa Tsutsui"],
  ['076', 'PAL', '118/193', "Jerky"],
  ['077', 'OBF', '120/197', "aky CG Works"],
  ['078', 'PAL', '125/193', "Sekio"],
  ['079', 'PAL', '126/193', "Shin Nagasawa"],
  ['080', 'PAL', '127/193', "5ban Graphics"],
  ['081', 'PAL', '133/193', "Kagemaru Himeno"],
  ['082', 'PAL', '134/193', "saino misaki"],
  ['083', 'OBF', '132/197', "Kurata So"],
  ['084', 'OBF', '134/197', "PLANETA Tsuji"],
  ['085', 'PAL', '137/193', "Nisota Niso"],
  ['086', 'PAR', '121/182', "Cona Nitanda"],
  ['087', 'SVI', '135/198', "kantaro"],
  ['088', 'SVI', '137/198', "KIYOTAKA OSHIYAMA"],
  ['089', 'OBF', '144/197', "Shinji Kanda"],
  ['090', 'OBF', '145/197', "Nobuhiro Imagawa"],
  ['091', 'OBF', '147/197', "kawayoo"],
  ['092', 'OBF', '152/197', "Nobuhiro Imagawa"],
  ['093', 'OBF', '153/197', "PLANETA Igarashi"],
  ['094', 'PAL', '148/193', "Scav"],
  ['095', 'PAL', '151/193', "Hitoshi Ariga"],
  ['096', 'PAL', '154/193', "kirisAki"],
  ['097', 'PAL', '155/193', "Kouki Saitou"],
  ['098', 'PAL', '156/193', "Nagomi Nijo"],
  ['099', 'PAL', '157/193', "Mina Nakai"],
  ['100', 'PAL', '158/193', "Kouki Saitou"],
  ['101', 'PAL', '159/193', "Shinya Komatsu"],
  ['102', 'PAL', '160/193', "Shigenori Negishi"],
  ['103', 'PAL', '161/193', "GIDORA"],
  ['104', 'PAL', '162/193', "Yuya Oka"],
  ['105', 'SVI', '147/198', "aoki"],
  ['106', 'PAL', '163/193', "sui"],
  ['107', 'OBF', '176/197', "saino misaki"],
  ['108', 'OBF', '177/197', "Eri Yamaki"],
  ['109', 'PAL', '164/193', "Naoki Saito"],
  ['110', 'PAL', '165/193', "sui"],
  ['111', 'SVI', '154/198', "Teeziro"],
  ['112', 'SVI', '158/198', "aky CG Works"],
  ['113', 'SVP', '096', "Hasuno"],
  ['114', 'OBF', '185/197', "Hiroki Asanuma"],
  ['115', 'PAL', '189/193', "Studio Bora Inc."],
  ['116', 'PAL', '183/193', "Studio Bora Inc."],
  ['117', 'SVI', '184/198', "OKACHEKE"],
  ['118', 'MEW', '164/165', "Toyste Beach"],
  ['119', 'MEW', '155/165', "Toyste Beach"],
  ['120', 'OBF', '197/197', "Ayaka Yoshida"],
  ['121', 'PAL', '184/193', "GIDORA"],
  ['122', 'OBF', '187/197', "GIDORA"],
  ['123', 'PAL', '185/193', "Sanosuke Sakuma"],
  ['124', 'PAL', '180/193', "Ryuta Fuse"],
  ['125', 'PAL', '182/193', "Akira Komayama"],
  ['126', 'MEW', '156/165', "GIDORA"],
  ['127', 'OBF', '194/197', "nagimiso"],
  ['128', 'PAL', '175/193', "AYUMI ODASHIMA"],
  ['129', 'PAL', '174/193', "AYUMI ODASHIMA"],
  ['130', 'PAL', '193/193', ""],
  ['131', 'PAL', '208/193', "Tomokazu Komiya"],
  ['132', 'PAL', '209/193', "Tomokazu Komiya"],
  ['133', 'PAL', '210/193', "Tomokazu Komiya"],
  ['134', 'PAL', '214/193', "Teeziro"],
  ['135', 'SVI', '218/198', "OKACHEKE"],
  ['136', 'PAL', '224/193', "OKACHEKE"],
  ['137', 'PAL', '228/193', "Mina Nakai"],
  ['138', 'PAL', '229/193', "Saya Tsuruta"],
  ['139', 'PAL', '230/193', "5ban Graphics"],
  ['140', 'PAL', '232/193', "5ban Graphics"],
  ['141', 'SVI', '224/198', "5ban Graphics"],
  ['142', 'PAL', '234/193', "PLANETA Yamashita"],
  ['143', 'SVI', '225/198', "5ban Graphics"],
  ['144', 'PAL', '236/193', "aky CG Works"],
  ['145', 'PAL', '237/193', "PLANETA Yamashita"],
  ['146', 'PAL', '243/193', "5ban Graphics"],
  ['147', 'SVI', '234/198', "aky CG Works"],
  ['148', 'PAL', '253/193', "GIDORA"],
  ['149', 'PAL', '254/193', "Sanosuke Sakuma"],
  ['150', 'PAL', '251/193', "Ryuta Fuse"],
  ['151', 'PAL', '252/193', "kantaro"],
  ['152', 'MEW', '194/165', "GIDORA"],
  ['153', 'OBF', '221/197', "nagimiso"],
  ['154', 'PAL', '257/193', "takuyoa"],
  ['155', 'NEW', '', "Gemi"],
  ['156', 'PAL', '259/193', "AKIRA EGAWA"],
  ['157', 'PAL', '261/193', "kodama"],
  ['158', 'PAL', '263/193', "KEIICHIRO ITO"],
  ['159', 'PAL', '268/193', "DOM"],
  ['160', 'PAL', '269/193', "kirisAki"],
  ['161', 'PAL', '267/193', "KIYOTAKA OSHIYAMA"],
  ['162', 'PAL', '274/193', "aky CG Works"],
  ['163', 'PAL', '275/193', "5ban Graphics"],
  ['164', 'PAL', '277/193', "Studio Bora Inc."],
  ['165', 'PAR', '266/182', ""],
]

const SET_NAME: Record<Src, string> = {
  PAL: 'Paldea Evolved',
  OBF: 'Obsidian Flames',
  SVI: 'Scarlet & Violet',
  SVP: 'SV Black Star Promo',
  MEW: '151',
  PAR: 'Paradox Rift',
  NEW: 'New for Fearless Terastal',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 130)
const SECRET = rows.filter((r) => +r.cn > 130)
const BIG3: Src[] = ['PAL', 'OBF', 'SVI']
const count = (s: Src) => rows.filter((r) => r.src === s).length

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    pal: n('PAL'),
    obf: n('OBF'),
    svi: n('SVI'),
    other: list.filter((r) => !BIG3.includes(r.src) && r.src !== 'NEW').length,
    fresh: n('NEW'),
    total: list.length,
  }
})

const SET_COUNTS = (Object.keys(SET_NAME) as Src[])
  .map((s) => ({ s, n: count(s) }))
  .filter((x) => x.n > 0 && x.s !== 'NEW')
  .sort((a, b) => b.n - a.n)

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'exclusive', label: 'Chinese Exclusive: Arcanine ex' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'secret-rares', label: `All ${SECRET.length} secret rares` },
  { id: 'main-set', label: `The ${MAIN.length}-card main set` },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Fearless Terastal?',
    a: `There is no single one. Most of its cards match Paldea Evolved (${count('PAL')}), Obsidian Flames (${count('OBF')}) and Scarlet & Violet (${count('SVI')}), with the rest from SV Black Star Promos, 151 and Paradox Rift, plus one new art.`,
  },
  {
    q: 'What is the Chinese Exclusive in Fearless Terastal?',
    a: 'The Arcanine ex Special Art Rare 155/130, credited to Gemi. English printed Tera Arcanine ex as a Double Rare and a full art in Scarlet & Violet, but never with this illustration.',
  },
  {
    q: 'Is the Iono Special Art Rare the same as in English?',
    a: 'Yes. 160/130 matches Paldea Evolved 269/193 by kirisAki.',
  },
  {
    q: 'Are any Fearless Terastal cards English promos?',
    a: 'Five: Arcanine 017/130 matches SVP 011, Ampharos ex 050/130 matches SVP 016, Mimikyu ex 063/130 matches SVP 004, Espathra 065/130 matches SVP 010 and Cyclizar 113/130 matches SVP 096.',
  },
]

export const Route = createFileRoute('/blog/fearless-terastal-card-origins')({
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
  component: FearlessTerastalOrigins,
})

function OriginsTable({ list }: { list: typeof rows }) {
  return (
    <div className="table-scroll table-tall">
      <table className="data-table origins-table">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Card</th>
            <th scope="col">English card</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.cn} className={r.src === 'NEW' ? 'is-current' : undefined}>
              <th scope="row">{r.cn}</th>
              <td>
                {r.name}
                <span className="cell-sub">{r.rarity}</span>
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
      </table>
    </div>
  )
}

function FearlessTerastalOrigins() {
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
  // The Chinese Exclusive SAR, with the two Arcanine ex that English did print.
  const arcanine = ['155', '018', '141'].map((n) => rows.find((r) => r.cn === n)!)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Fearless Terastal is built mostly from Paldea Evolved, with cards from five other English sources mixed in. We matched all 165 cards to English and found one Chinese Exclusive that English never printed."
        cta={{
          heading: 'Collect Fearless Terastal',
          body: 'Browse all 165 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/fearless-terastal-csv3', label: 'See the full card list' }],
        }}
      >
        <p>
          Fearless Terastal does not follow one English set. More than half of its 165 cards match Paldea Evolved, and Obsidian Flames and
          the first Scarlet & Violet set supply most of the rest. A few come from promos, 151 and Paradox Rift, and one card is a Chinese
          Exclusive. For the chase cards and pull odds, see our <Link to="/blog/fearless-terastal-set-guide">set guide</Link>.
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
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rarity</th>
                <th scope="col">Paldea Evolved</th>
                <th scope="col">Obsidian Flames</th>
                <th scope="col">Scarlet & Violet</th>
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
                  <td>{t.pal || '–'}</td>
                  <td>{t.obf || '–'}</td>
                  <td>{t.svi || '–'}</td>
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

        <h2 id="exclusive">Chinese Exclusive: Arcanine ex</h2>
        <p>
          English printed Tera Arcanine ex twice, both in the first Scarlet & Violet set: the Double Rare 032/198 and the full art
          224/198. Both are in Fearless Terastal, as 018 and 141. The Special Art Rare 155/130 is
          the extra one. It shows the crystal Arcanine mid-roar under its red Tera Jewel crown, and no English card uses this illustration.
        </p>
        <div className="card-grid cols-3">
          {arcanine.map((r) => (
            <figure key={r.cn}>
              <img
                src={r.image}
                alt={`${r.name} ${r.cn}/130 ${r.rarity}${r.src === 'NEW' ? ', Chinese Exclusive' : ''}, Fearless Terastal`}
                loading="lazy"
                width={300}
                height={418}
              />
              <figcaption>
                {r.src === 'NEW' && <ChineseExclusiveBadge />}
                <strong>{r.name}</strong>
                {r.cn}/130 · {r.rarity} · {r.src === 'NEW' ? r.illus : `${SET_NAME[r.src]} ${r.en}`}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>Paldea Evolved does most of the work.</strong> It supplies {count('PAL')} of the 165 cards, including the four
          Treasures of Ruin at every rarity, the Grusha, Iono and Giacomo Special Art Rares, and all eight Art Rares except Mabosstiff,
          which matches Scarlet & Violet 218/198. Every card's English source, from most cards to fewest:
        </p>
        <div className="table-scroll">
          <table className="data-table">
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
          <strong>The Tera Pokémon ex come from two sets.</strong> Arcanine ex and Gyarados ex match Scarlet & Violet, and Forretress ex
          matches Paldea Evolved. Houndoom ex, Melmetal ex and Klawf ex match Obsidian Flames, which otherwise supplies only Commons and
          Uncommons plus the Ryme Super Rare.
        </p>
        <p>
          <strong>Five promo arts.</strong> Arcanine 017/130, Ampharos ex 050/130, Mimikyu ex 063/130, Espathra 065/130 and Cyclizar
          113/130 use art that English released as SV Black Star Promos.
        </p>
        <p>
          <strong>A few cards from later sets.</strong> Latios 058/130, Morpeko 086/130 and the gold Reversal Energy 165/130 match
          Paradox Rift. Protective Goggles, Big Air Balloon and both versions of Bill's Transfer match 151.
        </p>

        <h2 id="secret-rares">All {SECRET.length} secret rares</h2>
        <p>Every card above 130, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} />

        <BuyStrip />

        <h2 id="main-set">The {MAIN.length}-card main set</h2>
        <OriginsTable list={MAIN} />

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
