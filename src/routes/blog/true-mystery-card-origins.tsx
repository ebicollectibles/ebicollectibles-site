import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/csv6.json'

const post = BLOG_POSTS.find((p) => p.slug === 'true-mystery-card-origins')!

type Src = 'PAR' | 'OBF' | 'PAF' | 'MEW' | 'SVP' | 'NEW'

// Every True Mystery card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
// NEW rows have no English printing; illustrators read off the Chinese card.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'PAR', '001/182', "Yoriyuki Ikegami"],
  ['002', 'PAR', '002/182', "kantaro"],
  ['003', 'PAR', '003/182', "5ban Graphics"],
  ['004', 'PAR', '004/182', "Jerky"],
  ['005', 'PAR', '005/182', "Kurata So"],
  ['006', 'PAF', '003/91', "Masako Tomii"],
  ['007', 'PAR', '006/182', "Scav"],
  ['008', 'PAR', '007/182', "Shin Nagasawa"],
  ['009', 'PAR', '008/182', "Kouki Saitou"],
  ['010', 'PAR', '009/182', "Kariya"],
  ['011', 'PAR', '010/182', "OKUBO"],
  ['012', 'PAR', '011/182', "Haru Akasaka"],
  ['013', 'PAR', '012/182', "Oku"],
  ['014', 'PAR', '013/182', "Pani Kobayashi"],
  ['015', 'PAF', '006/91', "takuyoa"],
  ['016', 'PAR', '019/182', "Naoyo Kimura"],
  ['017', 'PAF', '009/91', "miki kudo"],
  ['018', 'PAF', '010/91', "Hasuno"],
  ['019', 'PAF', '013/91', "Scav"],
  ['020', 'PAR', '020/182', "LINNE"],
  ['021', 'PAR', '021/182', "Yuya Oka"],
  ['022', 'PAR', '022/182', "Nisota Niso"],
  ['023', 'PAR', '023/182', "Gemi"],
  ['024', 'PAR', '024/182', "Pani Kobayashi"],
  ['025', 'PAR', '028/182', "Kouki Saitou"],
  ['026', 'PAR', '030/182', "HYOGONOSUKE"],
  ['027', 'PAR', '031/182', "otumami"],
  ['028', 'PAR', '032/182', "Tonji Matsuno"],
  ['029', 'OBF', '045/197', "matazo"],
  ['030', 'PAR', '035/182', "Tetsu Kayama"],
  ['031', 'PAR', '036/182', "Atsuya Uki"],
  ['032', 'PAR', '037/182', "satoma"],
  ['033', 'PAR', '041/182', "Natsumi Yoshida"],
  ['034', 'PAR', '042/182', "nagimiso"],
  ['035', 'PAR', '043/182', "miki kudo"],
  ['036', 'PAR', '044/182', "Lee HyunJung"],
  ['037', 'PAR', '045/182', "Nelnal"],
  ['038', 'PAR', '046/182', "5ban Graphics"],
  ['039', 'PAR', '052/182', "Tomokazu Komiya"],
  ['040', 'PAR', '053/182', "Kouki Saitou"],
  ['041', 'PAR', '054/182', "Oswaldo KATO"],
  ['042', 'PAR', '056/182', "Oswaldo KATO"],
  ['043', 'PAR', '057/182', "Anesaki Dynamic"],
  ['044', 'PAR', '059/182', "aoki"],
  ['045', 'OBF', '066/197', "5ban Graphics"],
  ['046', 'PAR', '062/182', "Shinji Kanda"],
  ['047', 'PAR', '063/182', "GOSSAN"],
  ['048', 'PAR', '067/182', "Saya Tsuruta"],
  ['049', 'OBF', '076/197', "Shin Nagasawa"],
  ['050', 'SVP', '094', "Mizue"],
  ['051', 'PAR', '070/182', "PLANETA Mochizuki"],
  ['052', 'PAF', '030/91', "sui"],
  ['053', 'PAF', '031/91', "HYOGONOSUKE"],
  ['054', 'PAF', '032/91', "Kagemaru Himeno"],
  ['055', 'PAF', '033/91', "Narumi Sato"],
  ['056', 'PAR', '075/182', "Misa Tsutsui"],
  ['057', 'PAR', '076/182', "kawayoo"],
  ['058', 'PAR', '077/182', "saino misaki"],
  ['059', 'PAR', '078/182', "nisimono"],
  ['060', 'PAR', '080/182', "kodama"],
  ['061', 'PAR', '081/182', "Teeziro"],
  ['062', 'PAR', '082/182', "Teeziro"],
  ['063', 'PAR', '084/182', "Souichirou Gunjima"],
  ['064', 'PAR', '085/182', "KEIICHIRO ITO"],
  ['065', 'PAR', '086/182', "Ryota Murayama"],
  ['066', 'PAR', '089/182', "aky CG Works"],
  ['067', 'PAR', '090/182', "Shiburingaru"],
  ['068', 'OBF', '105/197', "KYUPIYAMA"],
  ['069', 'OBF', '106/197', "Souichirou Gunjima"],
  ['070', 'PAR', '096/182', "Natsumi Yoshida"],
  ['071', 'PAR', '097/182', "Mousho"],
  ['072', 'OBF', '113/197', "SATOSHI NAKAI"],
  ['073', 'PAF', '051/91', "Kedamahadaitai Yawarakai"],
  ['074', 'PAF', '052/91', "Sanosuke Sakuma"],
  ['075', 'PAR', '101/182', "Mizue"],
  ['076', 'PAR', '103/182', "KEIICHIRO ITO"],
  ['077', 'PAR', '104/182', "Souichirou Gunjima"],
  ['078', 'OBF', '118/197', "Oswaldo KATO"],
  ['079', 'OBF', '119/197', "Kouki Saitou"],
  ['080', 'PAR', '105/182', "Yuya Oka"],
  ['081', 'PAF', '053/91', "kawayoo"],
  ['082', 'PAR', '107/182', "Anesaki Dynamic"],
  ['083', 'PAR', '108/182', "PLANETA Mochizuki"],
  ['084', 'PAR', '109/182', "AKIRA EGAWA"],
  ['085', 'PAR', '110/182', "Sumiyoshi Kizuki"],
  ['086', 'PAR', '111/182', "Eri Yamaki"],
  ['087', 'PAR', '112/182', "Uta"],
  ['088', 'OBF', '126/197', "Shibuzoh."],
  ['089', 'OBF', '128/197', "Kouki Saitou"],
  ['090', 'PAR', '114/182', "0313"],
  ['091', 'PAR', '115/182', "Yoshioka"],
  ['092', 'PAR', '116/182', "Miki Tanaka"],
  ['093', 'PAR', '117/182', "Aya Kusube"],
  ['094', 'PAR', '122/182', "Souichirou Gunjima"],
  ['095', 'PAR', '123/182', "Anesaki Dynamic"],
  ['096', 'PAR', '124/182', "takuyoa"],
  ['097', 'PAR', '125/182', "Po-Suzuki"],
  ['098', 'PAR', '129/182', "Kyoko Umemoto"],
  ['099', 'PAR', '137/182', "5ban Graphics"],
  ['100', 'PAF', '066/91', "toriyufu"],
  ['101', 'PAR', '142/182', "Taiga Kayama"],
  ['102', 'PAR', '143/182', "kurumitsu"],
  ['103', 'PAR', '144/182', "hatachu"],
  ['104', 'PAR', '145/182', "aspara"],
  ['105', 'PAR', '146/182', "Hitoshi Ariga"],
  ['106', 'PAR', '147/182', "sowsow"],
  ['107', 'PAR', '148/182', "sui"],
  ['108', 'PAR', '149/182', "Yukiko Baba"],
  ['109', 'PAR', '150/182', "LINNE"],
  ['110', 'PAR', '151/182', "Masakazu Fukuda"],
  ['111', 'OBF', '175/197', "Lee HyunJung"],
  ['112', 'PAR', '156/182', "PLANETA Mochizuki"],
  ['113', 'PAR', '158/182', "Souichirou Gunjima"],
  ['114', 'PAR', '160/182', "Toyste Beach"],
  ['115', 'PAR', '163/182', "AYUMI ODASHIMA"],
  ['116', 'PAR', '180/182', "inose yukie"],
  ['117', 'PAF', '083/91', "AYUMI ODASHIMA"],
  ['118', 'PAR', '159/182', "5ban Graphics"],
  ['119', 'PAR', '164/182', "5ban Graphics"],
  ['120', 'PAF', '090/91', "Studio Bora Inc."],
  ['121', 'PAR', '170/182', "Megumi Mizutani"],
  ['122', 'OBF', '188/197', "kirisAki"],
  ['123', 'PAR', '168/182', "Hideki Ishikawa"],
  ['124', 'PAR', '173/182', "Ryuta Fuse"],
  ['125', 'PAR', '171/182', "hncl"],
  ['126', 'PAR', '181/182', "Naoki Saito"],
  ['127', 'MEW', '157/165', "Oswaldo KATO"],
  ['128', 'OBF', '192/197', "Oswaldo KATO"],
  ['129', 'PAR', '187/182', "Takeshi Nakamura"],
  ['130', 'PAR', '192/182', "Shibuzoh."],
  ['131', 'PAR', '197/182', "AKIRA EGAWA"],
  ['132', 'PAR', '202/182', "kodama"],
  ['133', 'PAR', '203/182', "Takeshi Nakamura"],
  ['134', 'PAR', '204/182', "Shinya Komatsu"],
  ['135', 'PAR', '207/182', "Tomokazu Komiya"],
  ['136', 'PAR', '216/182', "GIDORA"],
  ['137', 'PAR', '217/182', "5ban Graphics"],
  ['138', 'PAR', '220/182', "5ban Graphics"],
  ['139', 'OBF', '211/197', "5ban Graphics"],
  ['140', 'PAR', '223/182', "PLANETA Mochizuki"],
  ['141', 'PAR', '224/182', "Eske Yoshinob"],
  ['142', 'PAR', '225/182', "aky CG Works"],
  ['143', 'PAR', '228/182', "PLANETA Mochizuki"],
  ['144', 'PAR', '229/182', "takuyoa"],
  ['145', 'PAR', '234/182', "PLANETA Mochizuki"],
  ['146', 'PAR', '239/182', "Megumi Mizutani"],
  ['147', 'OBF', '218/197', "kirisAki"],
  ['148', 'PAR', '237/182', "Hideki Ishikawa"],
  ['149', 'PAR', '242/182', "Ryuta Fuse"],
  ['150', 'PAR', '240/182', "hncl"],
  ['151', 'PAR', '244/182', "Naoki Saito"],
  ['152', 'NEW', '', "Tonji Matsuno"],
  ['153', 'PAR', '249/182', "kantaro"],
  ['154', 'PAR', '250/182', "Toshinao Aoki"],
  ['155', 'PAR', '251/182', "Ryota Murayama"],
  ['156', 'PAR', '256/182', "Ryota Murayama"],
  ['157', 'OBF', '226/197', "DOM"],
  ['158', 'PAR', '257/182', "Atsushi Furusawa"],
  ['159', 'PAR', '259/182', "AKIRA EGAWA"],
  ['160', 'PAR', '261/182', "aky CG Works"],
  ['161', 'PAR', '262/182', "takuyoa"],
  ['162', 'PAR', '264/182', "Toyste Beach"],
  ['163', 'NEW', '', "Studio Bora Inc."],
]

const SET_NAME: Record<Src, string> = {
  PAR: 'Paradox Rift',
  OBF: 'Obsidian Flames',
  PAF: 'Paldean Fates',
  MEW: '151',
  SVP: 'SV Black Star Promo',
  NEW: 'No English version',
}

// The set's Chinese Exclusive (exclusiveCardNumbers in the set data). The gold
// Pal Pad also has no English printing but is not a Chinese Exclusive.
const EXCLUSIVE = new Set(['152'])

// What to say for cards with no English printing.
const NO_EN: Record<string, string> = {
  '152': 'Chinese Exclusive, no English version',
  '163': 'English has Pal Pad only as a regular Item, not in gold',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 128)
const SECRET = rows.filter((r) => +r.cn > 128)
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
  { id: 'main-set', label: 'The 128-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is True Mystery?',
    a: 'Mostly Paradox Rift: 128 of its 163 cards match Paradox Rift. The rest come from Obsidian Flames (16), Paldean Fates (15), 151 (1) and an SV Black Star Promo (1), plus 2 cards with no English version.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: 'The Iron Hands ex Special Art Rare 152/128 by Tonji Matsuno, which is new art with no English version. The gold Pal Pad Ultra Rare 163/128 has no English version either, since English has Pal Pad only as a regular Item, but it is not a Chinese Exclusive.',
  },
  {
    q: 'Is the Roaring Moon ex Special Art Rare the same as in English?',
    a: 'Yes. 155/128 matches Paradox Rift 251/182 by Ryota Murayama, and the gold 161/128 matches Paradox Rift 262/182.',
  },
  {
    q: 'Are any True Mystery cards English promos?',
    a: 'One: Bellibolt 050/128 matches SV Black Star Promo 094.',
  },
]

export const Route = createFileRoute('/blog/true-mystery-card-origins')({
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
  component: TrueMysteryOrigins,
})

function OriginsTable({ list }: { list: typeof rows }) {
  return (
    <div className="table-scroll">
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
                  <span className="cell-none">{NO_EN[r.cn]}</span>
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

function TrueMysteryOrigins() {
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
        lede="True Mystery is mostly Paradox Rift, plus cards from four other English sources and two that English never printed, among them the Chinese Exclusive Iron Hands ex. We matched all 163 cards to English."
        cta={{
          heading: 'Collect True Mystery',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/true-mystery-csv6', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-true-mystery-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          128 of True Mystery's 163 cards match Paradox Rift, including 30 of its 35 secret rares. The rest come from Obsidian Flames,
          Paldean Fates, 151 and one promo, and two cards have no English version at all: the Chinese Exclusive Iron Hands ex Special Art Rare and a gold
          Pal Pad. For the chase cards and box contents, see our <Link to="/blog/true-mystery-set-guide">set guide</Link>.
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
                <th scope="col">Paradox Rift</th>
                <th scope="col">Obsidian Flames</th>
                <th scope="col">Paldean Fates</th>
                <th scope="col">Other</th>
                <th scope="col">No English</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
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
          <strong>Paradox Rift does most of the work.</strong> Every card's English source, from most cards to fewest:
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
          <strong>Nearly every chase card is from Paradox Rift.</strong> Every Art Rare, every Pokémon ex Super Rare except Tyranitar ex,
          the Roaring Moon ex, Iron Valiant ex and Sandy Shocks ex Special Art Rares, and the gold Roaring Moon ex, Iron Valiant ex and
          Counter Catcher match Paradox Rift cards.
        </p>
        <p>
          <strong>Tyranitar ex and Geeta come from Obsidian Flames.</strong> Tyranitar ex matches Obsidian Flames at Double Rare and Super
          Rare, and Geeta matches it at Rare, Super Rare and Special Art Rare. Paldean Fates supplies 15 main-set cards, among them
          Espathra ex, Great Tusk ex and Iron Treads ex.
        </p>
        <p>
          <strong>Two cards have no English version.</strong> English printed an Iron Hands ex Special Illustration Rare in Paradox
          Rift, but with a different art, so Tonji Matsuno's Iron Hands ex is new art and the set's Chinese Exclusive. Pal Pad has only ever been a regular Item in English,
          so the gold Pal Pad is a version English never had.
        </p>
        <div className="card-grid cols-2">
          {fresh.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/128${EXCLUSIVE.has(r.cn) ? ', Chinese Exclusive' : ''}, True Mystery`} loading="lazy" width={300} height={419} />
              <figcaption>
                {EXCLUSIVE.has(r.cn) && <ChineseExclusiveBadge />}
                <strong>{r.name}</strong>
                {r.cn}/128 · {r.rarity} · {r.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>Two odd ones out.</strong> Bellibolt 050/128 uses art English released as SV Black Star Promo 094, and the Cycling Road
          Stadium 127/128 matches the 151 set.
        </p>

        <h2 id="secret-rares">All 35 secret rares</h2>
        <p>Every card above 128, with its English twin. Highlighted rows have no English version.</p>
        <OriginsTable list={SECRET} />

        <BuyStrip />

        <h2 id="main-set">The 128-card main set</h2>
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
