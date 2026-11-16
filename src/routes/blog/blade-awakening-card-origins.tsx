import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/csv7.json'

const post = BLOG_POSTS.find((p) => p.slug === 'blade-awakening-card-origins')!

type Src = 'TEF' | 'TWM' | 'JTG' | 'SCR' | 'PRE' | 'SVP' | 'SSP' | 'SFA' | 'NEW'

// Every Blade Awakening card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
// The NEW row has no English printing; its illustrator is read off the card.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'TWM', '001/167', "Yoriyuki Ikegami"],
  ['002', 'TWM', '002/167', "LINNE"],
  ['003', 'TEF', '001/162', "Dsuke"],
  ['004', 'TWM', '003/167', "HYOGONOSUKE"],
  ['005', 'TWM', '004/167', "Saya Tsuruta"],
  ['006', 'TWM', '005/167', "Anesaki Dynamic"],
  ['007', 'TWM', '006/167', "Naoyo Kimura"],
  ['008', 'TWM', '007/167', "Ounishi"],
  ['009', 'TWM', '008/167', "Toshinao Aoki"],
  ['010', 'TEF', '003/162', "Asako Ito"],
  ['011', 'TEF', '004/162', "Lee HyunJung"],
  ['012', 'TEF', '005/162', "Souichirou Gunjima"],
  ['013', 'TEF', '006/162', "Yoriyuki Ikegami"],
  ['014', 'TEF', '007/162', "Taiga Kasai"],
  ['015', 'TEF', '008/162', "Tomomi Ozaki"],
  ['016', 'TEF', '009/162', "Gapao"],
  ['017', 'TEF', '010/162', "OKACHEKE"],
  ['018', 'TEF', '011/162', "Uninori"],
  ['019', 'TEF', '012/162', "PLANETA Tsuji"],
  ['020', 'TWM', '011/167', "Kuroimori"],
  ['021', 'TEF', '013/162', "Atsushi Furusawa"],
  ['022', 'TEF', '014/162', "Kyoko Umemoto"],
  ['023', 'TEF', '015/162', "Mizue"],
  ['024', 'TEF', '016/162', "Rond"],
  ['025', 'TEF', '017/162', "Akira Komayama"],
  ['026', 'TEF', '018/162', "Kagemaru Himeno"],
  ['027', 'TEF', '019/162', "Saya Tsuruta"],
  ['028', 'TEF', '020/162', "Tetsu Kayama"],
  ['029', 'TEF', '021/162', "otumami"],
  ['030', 'TEF', '023/162', "Saboteri"],
  ['031', 'TEF', '024/162', "mingo"],
  ['032', 'TWM', '019/167', "Mitsuhiro Arita"],
  ['033', 'TEF', '025/162', "5ban Graphics"],
  ['034', 'TWM', '028/167', "Gapao"],
  ['035', 'TWM', '029/167', "PLANETA Mochizuki"],
  ['036', 'JTG', '022/159', "OKACHEKE"],
  ['037', 'JTG', '023/159', "Fujimoto Gold"],
  ['038', 'JTG', '024/159', "takuyoa"],
  ['039', 'TWM', '030/167', "Teeziro"],
  ['040', 'TWM', '031/167', "Jerky"],
  ['041', 'TWM', '032/167', "Scav"],
  ['042', 'TWM', '033/167', "Takumi Wada"],
  ['043', 'TEF', '030/162', "Shibuzoh."],
  ['044', 'TEF', '031/162', "Masakazu Fukuda"],
  ['045', 'TEF', '032/162', "REND"],
  ['046', 'TEF', '033/162', "Saya Tsuruta"],
  ['047', 'TEF', '034/162', "N-DESIGN Inc."],
  ['048', 'TEF', '036/162', "Yukiko Baba"],
  ['049', 'TEF', '037/162', "Krgc"],
  ['050', 'TWM', '039/167', "Oku"],
  ['051', 'TEF', '038/162', "5ban Graphics"],
  ['052', 'TEF', '039/162', "MINAMINAMI Take"],
  ['053', 'TEF', '040/162', "Jerky"],
  ['054', 'TEF', '041/162', "GOSSAN"],
  ['055', 'TEF', '042/162', "Souichirou Gunjima"],
  ['056', 'TEF', '043/162', "Shinji Kanda"],
  ['057', 'TWM', '051/167', "Mékayu"],
  ['058', 'TWM', '052/167', "Oku"],
  ['059', 'TWM', '053/167', "Makura Tami"],
  ['060', 'SVP', '178', "takuyoa"],
  ['061', 'TWM', '054/167', "rika"],
  ['062', 'TWM', '055/167', "aspara"],
  ['063', 'TEF', '044/162', "satoma"],
  ['064', 'TWM', '056/167', "Yuka Morii"],
  ['065', 'TWM', '057/167', "Hitoshi Ariga"],
  ['066', 'TWM', '058/167', "OKACHEKE"],
  ['067', 'TEF', '045/162', "Orca"],
  ['068', 'TEF', '046/162', "rika"],
  ['069', 'TEF', '047/162', "OKUBO"],
  ['070', 'TEF', '048/162', "HYOGONOSUKE"],
  ['071', 'TEF', '049/162', "DOM"],
  ['072', 'TWM', '062/167', "nagimiso"],
  ['073', 'TWM', '063/167', "kawayoo"],
  ['074', 'TEF', '050/162', "takuyoa"],
  ['075', 'TEF', '053/162', "Uta"],
  ['076', 'TEF', '054/162', "Yuya Oka"],
  ['077', 'TWM', '065/167', "GOSSAN"],
  ['078', 'TWM', '066/167', "Yuu Nishida"],
  ['079', 'TWM', '067/167', "Takumi Wada"],
  ['080', 'TWM', '068/167', "PLANETA Yamashita"],
  ['081', 'TWM', '070/167', "Taiga Kayama"],
  ['082', 'TWM', '071/167', "Atsuya Uki"],
  ['083', 'TEF', '055/162', "Misa Tsutsui"],
  ['084', 'TEF', '056/162', "Hitoshi Ariga"],
  ['085', 'JTG', '051/159', "PLANETA Igarashi"],
  ['086', 'TEF', '057/162', "kantaro"],
  ['087', 'TWM', '072/167', "kodama"],
  ['088', 'TEF', '060/162', "5ban Graphics"],
  ['089', 'TEF', '061/162', "Souichirou Gunjima"],
  ['090', 'TEF', '062/162', "Takeshi Nakamura"],
  ['091', 'TWM', '077/167', "PLANETA Mochizuki"],
  ['092', 'TEF', '063/162', "Nelnal"],
  ['093', 'TEF', '066/162', "matazo"],
  ['094', 'TEF', '068/162', "Kedamahadaitai Yawarakai"],
  ['095', 'TEF', '069/162', "Katsunori Sato"],
  ['096', 'TEF', '070/162', "Cona Nitanda"],
  ['097', 'TEF', '071/162', "mele"],
  ['098', 'TEF', '072/162', "Gemi"],
  ['099', 'TWM', '086/167', "Yukiko Baba"],
  ['100', 'TWM', '087/167', "mingo"],
  ['101', 'TWM', '088/167', "Ligton"],
  ['102', 'TEF', '075/162', "Sekio"],
  ['103', 'TEF', '076/162', "Tika Matsuno"],
  ['104', 'TWM', '093/167', "DOM"],
  ['105', 'SCR', '066/142', "Narumi Sato"],
  ['106', 'SCR', '067/142', "You Iribi"],
  ['107', 'TEF', '077/162', "kawayoo"],
  ['108', 'TWM', '094/167', "akagi"],
  ['109', 'TEF', '078/162', "kodama"],
  ['110', 'TEF', '080/162', "chibi"],
  ['111', 'TEF', '081/162', "5ban Graphics"],
  ['112', 'PRE', '047/131', "Shimaris Yukichi"],
  ['113', 'PRE', '048/131', "Shigenori Negishi"],
  ['114', 'TWM', '101/167', "AKIRA EGAWA"],
  ['115', 'TWM', '102/167', "OKUBO"],
  ['116', 'TEF', '082/162', "Natsumi Miyanose"],
  ['117', 'TEF', '083/162', "Masako Tomii"],
  ['118', 'TEF', '084/162', "Mina Nakai"],
  ['119', 'TEF', '085/162', "Kariya"],
  ['120', 'TEF', '086/162', "Bun Toujo"],
  ['121', 'TEF', '087/162', "miki kudo"],
  ['122', 'TEF', '088/162', "Oku"],
  ['123', 'TWM', '106/167', "5ban Graphics"],
  ['124', 'TWM', '107/167', "Shigenori Negishi"],
  ['125', 'TEF', '091/162', "Narumi Sato"],
  ['126', 'TEF', '092/162', "Naoyo Kimura"],
  ['127', 'TEF', '093/162', "Aya Kusube"],
  ['128', 'TEF', '094/162', "Anesaki Dynamic"],
  ['129', 'TEF', '095/162', "Shiburingaru"],
  ['130', 'TEF', '096/162', "Mitsuhiro Arita"],
  ['131', 'TEF', '097/162', "GIDORA"],
  ['132', 'TEF', '098/162', "DOM"],
  ['133', 'TWM', '110/167', "Anesaki Dynamic"],
  ['134', 'TEF', '099/162', "5ban Graphics"],
  ['135', 'TEF', '100/162', "Shimaris Yukichi"],
  ['136', 'TEF', '101/162', "Minato"],
  ['137', 'PRE', '064/131', "5ban Graphics"],
  ['138', 'TEF', '105/162', "Miki Tanaka"],
  ['139', 'TEF', '106/162', "akagi"],
  ['140', 'TEF', '107/162', "0313"],
  ['141', 'TEF', '108/162', "5ban Graphics"],
  ['142', 'TWM', '118/167', "danciao"],
  ['143', 'TEF', '109/162', "hncl"],
  ['144', 'TEF', '111/162', "toriyufu"],
  ['145', 'TEF', '112/162', "aspara"],
  ['146', 'TEF', '113/162', "hatachu"],
  ['147', 'TEF', '114/162', "Nobuhiro Imagawa"],
  ['148', 'TEF', '115/162', "Nurikabe"],
  ['149', 'TEF', '116/162', "Taiga Kayama"],
  ['150', 'TEF', '117/162', "Oswaldo KATO"],
  ['151', 'TEF', '118/162', "Tonji Matsuno"],
  ['152', 'TEF', '119/162', "Teeziro"],
  ['153', 'TEF', '121/162', "GOSSAN"],
  ['154', 'TEF', '123/162', "aky CG Works"],
  ['155', 'TEF', '124/162', "nisimono"],
  ['156', 'TEF', '125/162', "kirisAki"],
  ['157', 'TWM', '135/167', "satoma"],
  ['158', 'TWM', '136/167', "Souichirou Gunjima"],
  ['159', 'TEF', '126/162', "ryoma uratsuka"],
  ['160', 'TEF', '127/162', "toi8"],
  ['161', 'TEF', '128/162', "Sanosuke Sakuma"],
  ['162', 'TEF', '129/162', "Teeziro"],
  ['163', 'PRE', '082/131', "5ban Graphics"],
  ['164', 'TEF', '130/162', "Atsuko Nishida"],
  ['165', 'TEF', '131/162', "Keisin"],
  ['166', 'TEF', '132/162', "GOTO minori"],
  ['167', 'TEF', '133/162', "Mékayu"],
  ['168', 'TEF', '134/162', "Pani Kobayashi"],
  ['169', 'TEF', '135/162', "Anesaki Dynamic"],
  ['170', 'TEF', '136/162', "Yuka Morii"],
  ['171', 'TEF', '137/162', "Yuu Nishida"],
  ['172', 'TEF', '138/162', "Toshinao Aoki"],
  ['173', 'TEF', '139/162', "KEIICHIRO ITO"],
  ['174', 'TEF', '143/162', "Studio Bora Inc."],
  ['175', 'TWM', '148/167', "Eske Yoshinob"],
  ['176', 'TEF', '141/162', "Toyste Beach"],
  ['177', 'TEF', '144/162', "AYUMI ODASHIMA"],
  ['178', 'TWM', '152/167', "Toyste Beach"],
  ['179', 'TEF', '150/162', "Ayaka Yoshida"],
  ['180', 'TEF', '157/162', "Toyste Beach"],
  ['181', 'TEF', '153/162', "Studio Bora Inc."],
  ['182', 'TWM', '156/167', "Studio Bora Inc."],
  ['183', 'TEF', '158/162', "inose yukie"],
  ['184', 'SSP', '184/191', "Studio Bora Inc."],
  ['185', 'TEF', '159/162', "Toyste Beach"],
  ['186', 'TWM', '164/167', "inose yukie"],
  ['187', 'TEF', '152/162', "Toyste Beach"],
  ['188', 'TEF', '151/162', "Ayaka Yoshida"],
  ['189', 'TEF', '154/162', "inose yukie"],
  ['190', 'TWM', '158/167', "Studio Bora Inc."],
  ['191', 'TEF', '145/162', "Taira Akitsu"],
  ['192', 'TWM', '157/167', "hncl"],
  ['193', 'TWM', '155/167', "Atsushi Furusawa"],
  ['194', 'TEF', '160/162', "Ryuta Fuse"],
  ['195', 'TEF', '147/162', "Hideki Ishikawa"],
  ['196', 'TWM', '151/167', "GOSSAN"],
  ['197', 'TEF', '146/162', "GOSSAN"],
  ['198', 'TEF', '142/162', "En Morikura"],
  ['199', 'TEF', '155/162', "GIDORA"],
  ['200', 'TEF', '156/162', "AYUMI ODASHIMA"],
  ['201', 'SSP', '177/191', "AYUMI ODASHIMA"],
  ['202', 'TEF', '148/162', "AYUMI ODASHIMA"],
  ['203', 'TEF', '162/162', ""],
  ['204', 'TEF', '161/162', ""],
  ['205', 'TEF', '163/162', "SIE NANAHARA"],
  ['206', 'SVP', '098', "Tonji Matsuno"],
  ['207', 'TEF', '170/162', "sowsow"],
  ['208', 'TEF', '176/162', "OKUBO"],
  ['209', 'TEF', '178/162', "Katsunori Sato"],
  ['210', 'TEF', '184/162', "Mékayu"],
  ['211', 'TEF', '185/162', "PLANETA Tsuji"],
  ['212', 'TEF', '186/162', "5ban Graphics"],
  ['213', 'TWM', '191/167', "PLANETA Yamashita"],
  ['214', 'TEF', '187/162', "N-DESIGN Inc."],
  ['215', 'TEF', '188/162', "5ban Graphics"],
  ['216', 'TEF', '189/162', "takuyoa"],
  ['217', 'TWM', '195/167', "PLANETA Yamashita"],
  ['218', 'TEF', '190/162', "5ban Graphics"],
  ['219', 'TWM', '196/167', "PLANETA Mochizuki"],
  ['220', 'SCR', '160/142', "PLANETA Mochizuki"],
  ['221', 'TWM', '197/167', "PLANETA Hiiragi"],
  ['222', 'TEF', '191/162', "5ban Graphics"],
  ['223', 'TWM', '198/167', "5ban Graphics"],
  ['224', 'TEF', '192/162', "5ban Graphics"],
  ['225', 'TEF', '194/162', "5ban Graphics"],
  ['226', 'TEF', '195/162', "Eske Yoshinob"],
  ['227', 'TEF', '196/162', "aky CG Works"],
  ['228', 'TEF', '198/162', "Taira Akitsu"],
  ['229', 'TWM', '208/167', "hncl"],
  ['230', 'TWM', '207/167', "Atsushi Furusawa"],
  ['231', 'TEF', '202/162', "Ryuta Fuse"],
  ['232', 'TEF', '200/162', "Hideki Ishikawa"],
  ['233', 'TWM', '205/167', "GOSSAN"],
  ['234', 'TEF', '199/162', "GOSSAN"],
  ['235', 'TEF', '197/162', "En Morikura"],
  ['236', 'TEF', '201/162', "GIDORA"],
  ['237', 'TEF', '203/162', "nagimiso"],
  ['238', 'TEF', '204/162', "Teeziro"],
  ['239', 'TEF', '205/162', "Teeziro"],
  ['240', 'SCR', '169/142', "Yuu Nishida"],
  ['241', 'TEF', '206/162', "nagimiso"],
  ['242', 'TWM', '214/167', "akagi"],
  ['243', 'TEF', '207/162', "nagimiso"],
  ['244', 'TEF', '208/162', "Teeziro"],
  ['245', 'NEW', '', "Taira Akitsu"],
  ['246', 'TWM', '219/167', "Toshinao Aoki"],
  ['247', 'TEF', '212/162', "Tetsu Kayama"],
  ['248', 'TEF', '210/162', "DOM"],
  ['249', 'TEF', '209/162', "Cona Nitanda"],
  ['250', 'TEF', '211/162', "Megumi Mizutani"],
  ['251', 'TEF', '213/162', "5ban Graphics"],
  ['252', 'TEF', '214/162', "5ban Graphics"],
  ['253', 'TEF', '215/162', "takuyoa"],
  ['254', 'TEF', '216/162', "5ban Graphics"],
  ['255', 'TEF', '217/162', "5ban Graphics"],
  ['256', 'TEF', '218/162', "aky CG Works"],
  ['257', 'SFA', '096/64', "AYUMI ODASHIMA"],
  ['258', 'TWM', '223/167', "AYUMI ODASHIMA"],
  ['259', 'TWM', '225/167', "Toyste Beach"],
]

const SET_NAME: Record<Src, string> = {
  TEF: 'Temporal Forces',
  TWM: 'Twilight Masquerade',
  JTG: 'Journey Together',
  SCR: 'Stellar Crown',
  PRE: 'Prismatic Evolutions',
  SVP: 'SV Black Star Promo',
  SSP: 'Surging Sparks',
  SFA: 'Shrouded Fable',
  NEW: 'New for Blade Awakening',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 204)
const SECRET = rows.filter((r) => +r.cn > 204)
const BIG2: Src[] = ['TEF', 'TWM']

const BY_TIER = (['C', 'U', 'R', 'RR', 'ACE', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    tef: n('TEF'),
    twm: n('TWM'),
    other: list.filter((r) => !BIG2.includes(r.src) && r.src !== 'NEW').length,
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
  { id: 'secret-rares', label: 'All 55 secret rares' },
  { id: 'main-set', label: 'The 204-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Blade Awakening?',
    a: 'Mostly Temporal Forces, which matches 173 of its 259 cards, with 68 more from Twilight Masquerade. The other 17 come from six English sources, and one card is new, the set\'s Chinese Exclusive.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: "The Ciphermaniac's Codebreaking Special Art Rare 245/204 by Taira Akitsu. It has no English version, and every other card matches an English card.",
  },
  {
    q: 'Is the Greninja ex Special Art Rare the same as in English?',
    a: 'Yes. 242/204 matches Twilight Masquerade 214/167 by akagi. The Double Rare and Super Rare match Twilight Masquerade too.',
  },
  {
    q: 'Are any Blade Awakening cards English promos?',
    a: 'Two: Kyogre ex 060/204 matches SV Black Star Promo 178, and the Iron Thorns Art Rare 206/204 matches SV Black Star Promo 098.',
  },
]

export const Route = createFileRoute('/blog/blade-awakening-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
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
  component: BladeAwakeningOrigins,
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

function BladeAwakeningOrigins() {
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
        lede="Blade Awakening is mostly Temporal Forces and Twilight Masquerade, plus a few cards from six other English sources and one Chinese Exclusive that English never printed. We matched all 259 cards to English."
        cta={{
          heading: 'Collect Blade Awakening',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/blade-awakening-csv7', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-blade-awakening-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          173 of Blade Awakening's 259 cards match Temporal Forces and 68 match Twilight Masquerade. The other 17 come from Journey
          Together, Stellar Crown, Prismatic Evolutions, Surging Sparks, Shrouded Fable and two promos. Just one card is new: the
          Chinese Exclusive Ciphermaniac's Codebreaking Special Art Rare. For the chase cards and box odds, see our{' '}
          <Link to="/blog/blade-awakening-set-guide">set guide</Link>.
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
                <th scope="col">Temporal Forces</th>
                <th scope="col">Twilight Masquerade</th>
                <th scope="col">Other</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
                  <td>{t.tef || '–'}</td>
                  <td>{t.twm || '–'}</td>
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
          matches Special Illustration Rare, Ultra Rare matches the gold Hyper Rare, and ACE SPEC Rare is the same in both.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>Two sets do most of the work.</strong> Every card's English source, from most cards to fewest:
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
          <strong>The Paradox chase is Temporal Forces.</strong> Raging Bolt ex, Walking Wake ex, Gouging Fire ex, Iron Crown ex, Iron
          Leaves ex and Iron Boulder ex match Temporal Forces at every rarity, from Double Rare to gold. So do seven of the nine ACE SPEC
          cards and four of the six Supporter Special Art Rares.
        </p>
        <p>
          <strong>Greninja ex is Twilight Masquerade.</strong> All three Greninja ex cards, including akagi's Special Art Rare, match
          Twilight Masquerade, as do the Lana's Aid Special Art Rare, Hyper Aroma, Survival Brace and the gold Buddy-Buddy Poffin and
          Rescue Board.
        </p>
        <p>
          <strong>Later sets fill the gaps.</strong> Blaziken ex and Tapu Koko ex match Journey Together, Lugia ex and Tyranitar ex
          match Prismatic Evolutions, and the whole Dachsbun ex run, from Double Rare to Special Art Rare, matches Stellar Crown. The gold
          Earthen Vessel matches Shrouded Fable.
        </p>
        <p>
          <strong>One card is a Chinese Exclusive.</strong> English has Ciphermaniac's Codebreaking as a regular Supporter and a full art, both here too,
          but no Special Illustration Rare. Pokémon China added this one specially.
        </p>
        <div className="card-grid cols-2">
          {rows
            .filter((r) => r.cn === '245' || r.cn === '228')
            .reverse()
            .map((r) => (
              <figure key={r.cn}>
                <img src={r.image} alt={`${r.name} ${r.cn}/204${r.src === 'NEW' ? ', Chinese Exclusive' : ''}, Blade Awakening`} loading="lazy" width={300} height={419} />
                <figcaption>
                  {r.src === 'NEW' && <ChineseExclusiveBadge />}
                  <strong>{r.name}</strong>
                  {r.cn}/204 · {r.rarity} · {r.src === 'NEW' ? 'New art' : `${SET_NAME[r.src]} ${r.en}`}
                </figcaption>
              </figure>
            ))}
        </div>
        <p>
          <strong>Two promo arts.</strong> Kyogre ex 060/204 uses art English released as SV Black Star Promo 178, and the Iron Thorns
          Art Rare 206/204 matches SV Black Star Promo 098.
        </p>

        <h2 id="secret-rares">All 55 secret rares</h2>
        <p>Every card above 204, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} />

        <BuyStrip />

        <h2 id="main-set">The 204-card main set</h2>
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
