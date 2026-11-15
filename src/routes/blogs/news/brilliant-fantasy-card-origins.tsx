import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv8.json'

const post = BLOG_POSTS.find((p) => p.slug === 'brilliant-fantasy-card-origins')!

type Src = 'TWM' | 'SFA' | 'SSP' | 'SCR' | 'JTG' | 'TEF' | 'SVP' | 'DRI' | 'NEW'

// Every Brilliant Fantasy card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'SSP', '002/191', "OKUBO"],
  ['002', 'SSP', '003/191', "Oswaldo KATO"],
  ['003', 'SCR', '002/142', "Whisker"],
  ['004', 'SCR', '003/142', "Masako Tomii"],
  ['005', 'TWM', '009/167', "Orca"],
  ['006', 'TWM', '010/167', "Orca"],
  ['007', 'JTG', '010/159', "Saboteri"],
  ['008', 'JTG', '011/159', "PLANETA Mochizuki"],
  ['009', 'SFA', '001/64', "Naoyo Kimura"],
  ['010', 'SFA', '002/64', "mashu"],
  ['011', 'SSP', '005/191', "Iori Suzuki"],
  ['012', 'SSP', '006/191', "tono"],
  ['013', 'SSP', '007/191', "Amelicart"],
  ['014', 'SFA', '003/64', "Yoshimi Miyoshi"],
  ['015', 'SFA', '004/64', "Tetsu Kayama"],
  ['016', 'SFA', '005/64', "DOM"],
  ['017', 'SSP', '008/191', "Tomokazu Komiya"],
  ['018', 'SSP', '009/191', "Aya Kusube"],
  ['019', 'SFA', '006/64', "GOSSAN"],
  ['020', 'TWM', '014/167', "Tomomi Ozaki"],
  ['021', 'TWM', '015/167', "GOSSAN"],
  ['022', 'TWM', '016/167', "toriyufu"],
  ['023', 'TWM', '017/167', "OKUBO"],
  ['024', 'TWM', '018/167', "Saboteri"],
  ['025', 'TWM', '021/167', "Souichirou Gunjima"],
  ['026', 'TWM', '022/167', "Kouki Saitou"],
  ['027', 'TWM', '024/167', "Sanosuke Sakuma"],
  ['028', 'TWM', '025/167', "5ban Graphics"],
  ['029', 'TEF', '028/162', "Haru Akasaka"],
  ['030', 'TEF', '029/162', "Mitsuhiro Arita"],
  ['031', 'SFA', '007/64', "REND"],
  ['032', 'SFA', '008/64', "burari"],
  ['033', 'TWM', '036/167', "Saya Tsuruta"],
  ['034', 'TWM', '037/167', "Rond"],
  ['035', 'TWM', '038/167', "saino misaki"],
  ['036', 'SSP', '024/191', "MARINA Chikazawa"],
  ['037', 'SSP', '025/191', "matazo"],
  ['038', 'JTG', '030/159', "PLANETA Mochizuki"],
  ['039', 'SSP', '033/191', "M\u00e9kayu"],
  ['040', 'SSP', '034/191', "DOM"],
  ['041', 'SSP', '035/191', "kantaro"],
  ['042', 'SFA', '009/64', "Shinji Kanda"],
  ['043', 'TWM', '040/167', "5ban Graphics"],
  ['044', 'TWM', '041/167', "Kedamahadaitai Yawarakai"],
  ['045', 'TWM', '042/167', "OKACHEKE"],
  ['046', 'TWM', '043/167', "Nisota Niso"],
  ['047', 'SFA', '010/64', "Shimaris Yukichi"],
  ['048', 'SFA', '011/64', "Yuya Oka"],
  ['049', 'SFA', '012/64', "toriyufu"],
  ['050', 'TWM', '044/167', "saino misaki"],
  ['051', 'TWM', '045/167', "Gemi"],
  ['052', 'SFA', '013/64', "Krgc"],
  ['053', 'SFA', '014/64', "aspara"],
  ['054', 'TWM', '047/167', "Kouki Saitou"],
  ['055', 'TWM', '048/167', "Kurata So"],
  ['056', 'SSP', '041/191', "Kedamahadaitai Yawarakai"],
  ['057', 'SSP', '042/191', "hncl"],
  ['058', 'SSP', '048/191', "kawayoo"],
  ['059', 'SCR', '042/142', "nagimiso"],
  ['060', 'SCR', '043/142', "Yuka Morii"],
  ['061', 'SCR', '044/142', "Dsuke"],
  ['062', 'TWM', '059/167', "Narumi Sato"],
  ['063', 'TWM', '060/167', "Ligton"],
  ['064', 'TWM', '061/167', "PLANETA Mochizuki"],
  ['065', 'SSP', '053/191', "Ayako Ozaki"],
  ['066', 'SSP', '054/191', "Uta"],
  ['067', 'TWM', '064/167', "5ban Graphics"],
  ['068', 'TWM', '073/167', "nisimono"],
  ['069', 'TWM', '074/167', "Mina Nakai"],
  ['070', 'TWM', '075/167', "Teeziro"],
  ['071', 'TWM', '076/167', "Anesaki Dynamic"],
  ['072', 'SFA', '015/64', "PLANETA Mochizuki"],
  ['073', 'TWM', '080/167', "Kariya"],
  ['074', 'TWM', '081/167', "Uninori"],
  ['075', 'TWM', '082/167', "Masako Tomii"],
  ['076', 'SFA', '016/64', "OKUBO"],
  ['077', 'SFA', '017/64', "Masako Tomii"],
  ['078', 'TWM', '083/167', "Shinji Kanda"],
  ['079', 'TWM', '084/167', "Dsuke"],
  ['080', 'SSP', '075/191', "Saya Tsuruta"],
  ['081', 'SFA', '018/64', "IKEDA Saki"],
  ['082', 'SFA', '019/64', "Aya Kusube"],
  ['083', 'SFA', '020/64', "danciao"],
  ['084', 'TWM', '085/167', "Mousho"],
  ['085', 'TWM', '089/167', "Akira Komayama"],
  ['086', 'TWM', '090/167', "mingo"],
  ['087', 'SFA', '022/64', "Kuroimori"],
  ['088', 'SVP', '179', "PLANETA Igarashi"],
  ['089', 'SSP', '092/191', "Natsumi Yoshida"],
  ['090', 'SCR', '064/142', "OKACHEKE"],
  ['091', 'SCR', '065/142', "Natsumi Yoshida"],
  ['092', 'SSP', '094/191', "buchi"],
  ['093', 'SSP', '095/191', "Anesaki Dynamic"],
  ['094', 'TWM', '095/167', "kodama"],
  ['095', 'TWM', '096/167', "Kouki Saitou"],
  ['096', 'SCR', '071/142', "GIDORA"],
  ['097', 'TWM', '099/167', "Whisker"],
  ['098', 'TWM', '100/167', "SIE NANAHARA"],
  ['099', 'SCR', '072/142', "svlt"],
  ['100', 'SCR', '073/142', "cochi8i"],
  ['101', 'SCR', '074/142', "kodama"],
  ['102', 'SCR', '075/142', "Ryuta Fuse"],
  ['103', 'SCR', '076/142', "Mitsuhiro Arita"],
  ['104', 'SSP', '102/191', "ryoma uratsuka"],
  ['105', 'SSP', '103/191', "GOSSAN"],
  ['106', 'SCR', '078/142', "Yuu Nishida"],
  ['107', 'SCR', '080/142', "PLANETA Yamashita"],
  ['108', 'SFA', '023/64', "Aliya Chen"],
  ['109', 'SFA', '024/64', "Anesaki Dynamic"],
  ['110', 'TWM', '103/167', "Kouki Saitou"],
  ['111', 'TWM', '104/167', "Aya Kusube"],
  ['112', 'TWM', '105/167', "Takeshi Nakamura"],
  ['113', 'SCR', '083/142', "Kariya"],
  ['114', 'SCR', '084/142', "MINAMINAMI Take"],
  ['115', 'SCR', '087/142', "Scav"],
  ['116', 'SFA', '025/64', "Souichirou Gunjima"],
  ['117', 'TWM', '108/167', "Miki Tanaka"],
  ['118', 'TWM', '109/167', "Kazumasa Yasukuni"],
  ['119', 'SFA', '026/64', "Shinji Kanda"],
  ['120', 'TWM', '111/167', "Souichirou Gunjima"],
  ['121', 'TWM', '112/167', "5ban Graphics"],
  ['122', 'SFA', '027/64', "osare"],
  ['123', 'SFA', '028/64', "Teeziro"],
  ['124', 'SFA', '029/64', "Nisota Niso"],
  ['125', 'TWM', '113/167', "Shibuzoh."],
  ['126', 'TWM', '114/167', "kawayoo"],
  ['127', 'SFA', '030/64', "rika"],
  ['128', 'TWM', '115/167', "Tomokazu Komiya"],
  ['129', 'TWM', '116/167', "Krgc"],
  ['130', 'TWM', '117/167', "Shiburingaru"],
  ['131', 'SFA', '033/64', "Mori Yuu"],
  ['132', 'SFA', '034/64', "akagi"],
  ['133', 'SFA', '036/64', "takuyoa"],
  ['134', 'SFA', '037/64', "takuyoa"],
  ['135', 'SFA', '038/64', "takuyoa"],
  ['136', 'SFA', '039/64', "aky CG Works"],
  ['137', 'SSP', '124/191', "kawayoo"],
  ['138', 'TWM', '120/167', "Gapao"],
  ['139', 'TWM', '121/167', "takashi shiraishi"],
  ['140', 'TWM', '122/167', "Dsuke"],
  ['141', 'SVP', '180', "PLANETA Tsuji"],
  ['142', 'TWM', '123/167', "AKIRA EGAWA"],
  ['143', 'SCR', '099/142', "osare"],
  ['144', 'SCR', '100/142', "Mina Nakai"],
  ['145', 'SCR', '101/142', "Tonji Matsuno"],
  ['146', 'SSP', '128/191', "mingo"],
  ['147', 'SFA', '041/64', "Shinya Mizuno"],
  ['148', 'SFA', '042/64', "kawayoo"],
  ['149', 'TWM', '124/167', "Shigenori Negishi"],
  ['150', 'SCR', '110/142', "PLANETA Yamashita"],
  ['151', 'SFA', '044/64', "Orca"],
  ['152', 'SFA', '045/64', "Uninori"],
  ['153', 'SFA', '046/64', "Tsuyoshi Nagano"],
  ['154', 'SSP', '137/191', "Rianti Hidayat"],
  ['155', 'TWM', '126/167', "Teeziro"],
  ['156', 'TWM', '127/167', "OKACHEKE"],
  ['157', 'TWM', '128/167', "Scav"],
  ['158', 'TWM', '129/167', "cochi8i"],
  ['159', 'TWM', '130/167', "5ban Graphics"],
  ['160', 'TWM', '131/167', "Jerky"],
  ['161', 'SCR', '111/142', "kodama"],
  ['162', 'SFA', '048/64', "sui"],
  ['163', 'SFA', '049/64', "NC Empire"],
  ['164', 'TWM', '133/167', "HYOGONOSUKE"],
  ['165', 'TWM', '134/167', "Iwamoto05"],
  ['166', 'SFA', '050/64', "Susumu Maeya"],
  ['167', 'TWM', '139/167', "Shibuzoh."],
  ['168', 'TWM', '140/167', "Susumu Maeya"],
  ['169', 'SSP', '151/191', "Anesaki Dynamic"],
  ['170', 'SFA', '052/64', "ryoma uratsuka"],
  ['171', 'SFA', '053/64', "Takeshi Nakamura"],
  ['172', 'TWM', '141/167', "aky CG Works"],
  ['173', 'TWM', '165/167', "Toyste Beach"],
  ['174', 'TWM', '159/167', "5ban Graphics"],
  ['175', 'TWM', '142/167', "AYUMI ODASHIMA"],
  ['176', 'TWM', '163/167', "Toyste Beach"],
  ['177', 'SSP', '175/191', "Studio Bora Inc."],
  ['178', 'SFA', '058/64', "inose yukie"],
  ['179', 'SSP', '181/191', "Ayaka Yoshida"],
  ['180', 'SFA', '062/64', "Toyste Beach"],
  ['181', 'TWM', '162/167', "Toyste Beach"],
  ['182', 'TWM', '143/167', "AYUMI ODASHIMA"],
  ['183', 'SFA', '061/64', "Toyste Beach"],
  ['184', 'SCR', '141/142', "Studio Bora Inc."],
  ['185', 'SCR', '140/142', "Studio Bora Inc."],
  ['186', 'SCR', '142/142', "Toyste Beach"],
  ['187', 'SFA', '055/64', "5ban Graphics"],
  ['188', 'SFA', '063/64', "Studio Bora Inc."],
  ['189', 'SCR', '134/142', "inose yukie"],
  ['190', 'TWM', '150/167', "Toyste Beach"],
  ['191', 'SFA', '057/64', "hncl"],
  ['192', 'SFA', '059/64', "Taira Akitsu"],
  ['193', 'SFA', '056/64', "Atsushi Furusawa"],
  ['194', 'TWM', '144/167', "Akira Komayama"],
  ['195', 'SFA', '064/64', "GOSSAN"],
  ['196', 'SSP', '187/191', "Sanosuke Sakuma"],
  ['197', 'TWM', '160/167', "Naoki Saito"],
  ['198', 'TWM', '154/167', "GIDORA"],
  ['199', 'TWM', '145/167', "kantaro"],
  ['200', 'SCR', '138/142', "Hideki Ishikawa"],
  ['201', 'TWM', '149/167', "MARINA Chikazawa"],
  ['202', 'TWM', '146/167', "MARINA Chikazawa"],
  ['203', 'TWM', '153/167', "AYUMI ODASHIMA"],
  ['204', 'SFA', '060/64', "imoniii"],
  ['205', 'SFA', '054/64', "AYUMI ODASHIMA"],
  ['206', 'TWM', '166/167', ""],
  ['207', 'TWM', '167/167', ""],
  ['208', 'SSP', '196/191', "Whisker"],
  ['209', 'SSP', '198/191', "Kuroimori"],
  ['210', 'SFA', '068/64', "James Turner"],
  ['211', 'SFA', '069/64', "James Turner"],
  ['212', 'SFA', '070/64', "James Turner"],
  ['213', 'SFA', '077/64', "MINAMINAMI Take"],
  ['214', 'TWM', '190/167', "5ban Graphics"],
  ['215', 'TWM', '192/167', "5ban Graphics"],
  ['216', 'SFA', '080/64', "PLANETA Igarashi"],
  ['217', 'SSP', '217/191', "N-DESIGN Inc."],
  ['218', 'SSP', '218/191', "N-DESIGN Inc."],
  ['219', 'TWM', '193/167', "PLANETA Mochizuki"],
  ['220', 'TWM', '194/167', "5ban Graphics"],
  ['221', 'SFA', '081/64', "PLANETA Mochizuki"],
  ['222', 'SCR', '161/142', "PLANETA Yamashita"],
  ['223', 'TWM', '199/167', "5ban Graphics"],
  ['224', 'SFA', '082/64', "5ban Graphics"],
  ['225', 'SFA', '083/64', "5ban Graphics"],
  ['226', 'SFA', '084/64', "5ban Graphics"],
  ['227', 'SFA', '085/64', "aky CG Works"],
  ['228', 'SCR', '162/142', "PLANETA Mochizuki"],
  ['229', 'TWM', '200/167', "5ban Graphics"],
  ['230', 'TWM', '201/167', "PLANETA Tsuji"],
  ['231', 'TWM', '202/167', "aky CG Works"],
  ['232', 'SFA', '087/64', "hncl"],
  ['233', 'SFA', '088/64', "Taira Akitsu"],
  ['234', 'SFA', '086/64', "Atsushi Furusawa"],
  ['235', 'TWM', '203/167', "Akira Komayama"],
  ['236', 'SFA', '089/64', "GOSSAN"],
  ['237', 'SSP', '235/191', "Sanosuke Sakuma"],
  ['238', 'TWM', '209/167', "Naoki Saito"],
  ['239', 'TWM', '206/167', "GIDORA"],
  ['240', 'TWM', '204/167', "kantaro"],
  ['241', 'SCR', '165/142', "Hideki Ishikawa"],
  ['242', 'TWM', '211/167', "Yano Keiji"],
  ['243', 'TWM', '212/167', "Yano Keiji"],
  ['244', 'SSP', '237/191', "Kuroimori"],
  ['245', 'TWM', '213/167', "Yano Keiji"],
  ['246', 'TWM', '215/167', "Yano Keiji"],
  ['247', 'SFA', '090/64', "kantaro"],
  ['248', 'SFA', '091/64', "kantaro"],
  ['249', 'SFA', '092/64', "kantaro"],
  ['250', 'SFA', '093/64', "kantaro"],
  ['251', 'TWM', '216/167', "MINAMINAMI Take"],
  ['252', 'SFA', '094/64', "burari"],
  ['253', 'TWM', '220/167', "GIDORA"],
  ['254', 'TWM', '218/167', "Teeziro"],
  ['255', 'NEW', '', "OKACHEKE"],
  ['256', 'TWM', '221/167', "5ban Graphics"],
  ['257', 'SFA', '095/64', "aky CG Works"],
  ['258', 'TWM', '222/167', "aky CG Works"],
  ['259', 'TWM', '224/167', "Eske Yoshinob"],
  ['260', 'SCR', '175/142', "Toyste Beach"],
  ['261', 'SSP', '250/191', "AYUMI ODASHIMA"],
  ['262', 'DRI', '243/182', "AYUMI ODASHIMA"],
  ['263', 'SSP', '252/191', ""],
  ['264', 'TWM', '226/167', ""],
]

const SET_NAME: Record<Src, string> = {
  TWM: 'Twilight Masquerade',
  SFA: 'Shrouded Fable',
  SSP: 'Surging Sparks',
  SCR: 'Stellar Crown',
  JTG: 'Journey Together',
  TEF: 'Temporal Forces',
  SVP: 'SV Black Star Promo',
  DRI: 'Destined Rivals',
  NEW: 'New for Brilliant Fantasy',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 207)
const SECRET = rows.filter((r) => +r.cn > 207)
const BIG4: Src[] = ['TWM', 'SFA', 'SSP', 'SCR']

const BY_TIER = (['C', 'U', 'R', 'RR', 'ACE', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    twm: n('TWM'),
    sfa: n('SFA'),
    ssp: n('SSP'),
    scr: n('SCR'),
    other: list.filter((r) => !BIG4.includes(r.src) && r.src !== 'NEW').length,
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
  { id: 'secret-rares', label: 'All 57 secret rares' },
  { id: 'main-set', label: 'The 207-card main set' },
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Brilliant Fantasy?',
    a: 'There is no single one. Most of its cards match Twilight Masquerade (109) and Shrouded Fable (76), with 38 from Surging Sparks, 32 from Stellar Crown, 8 from four other English sources and one new art.',
  },
  {
    q: 'Which Brilliant Fantasy card has no English version?',
    a: 'The Carmine Special Art Rare 255/207 by OKACHEKE. English has a Carmine Special Illustration Rare in Twilight Masquerade, but with different art, and that one is not in the Chinese set.',
  },
  {
    q: 'Is the Milotic ex Special Art Rare the same as in English?',
    a: 'Yes. 244/207 matches Surging Sparks 237/191 by Kuroimori, and the Feebas Art Rare 209/207 matches Surging Sparks 198/191 by the same artist.',
  },
  {
    q: 'Are any Brilliant Fantasy cards English promos?',
    a: 'Two: Xerneas ex 088/207 matches SVP 179 and Dialga ex 141/207 matches SVP 180.',
  },
]

export const Route = createFileRoute('/blogs/news/brilliant-fantasy-card-origins')({
  head: () => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: post.excerpt },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: post.heroImage },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: BrilliantFantasyOrigins,
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
                  <span className="cell-none">New art, no English version</span>
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

function BrilliantFantasyOrigins() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const carmine = rows.filter((r) => r.name === 'Carmine' && (r.rarity === 'SAR' || r.rarity === 'SR'))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        wide
        post={post}
        lede="Brilliant Fantasy draws on four English sets at once. Here is where each of its 264 cards lines up in English, and the one card English never printed."
        cta={{
          heading: 'Collect Brilliant Fantasy',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/csv8', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-brilliant-fantasy-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          If you collect English, 263 of Brilliant Fantasy's 264 cards will look familiar. Most match Twilight Masquerade (109) and
          Shrouded Fable (76), with 38 from Surging Sparks, 32 from Stellar Crown and 8 from four other English sources. The one new card
          is the Carmine Special Art Rare. The Chinese set mixes these sources freely, so the numbers never line up with any one English
          set. For the chase cards and box odds, see our <Link to="/blogs/news/brilliant-fantasy-set-guide">set guide</Link>.
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
                <th scope="col">Twilight Masquerade</th>
                <th scope="col">Shrouded Fable</th>
                <th scope="col">Surging Sparks</th>
                <th scope="col">Stellar Crown</th>
                <th scope="col">Other</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
                  <td>{t.twm || '–'}</td>
                  <td>{t.sfa || '–'}</td>
                  <td>{t.ssp || '–'}</td>
                  <td>{t.scr || '–'}</td>
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
          <strong>Two sets do most of the work.</strong> Twilight Masquerade and Shrouded Fable account for 185 cards between them.
          Every card's English source, from most cards to fewest:
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
          <strong>The Kitakami chase cards come from two sets.</strong> The four Ogerpon ex, Bloodmoon Ursaluna ex, Kieran, Carmine's Super
          Rare and Perrin match Twilight Masquerade. Okidogi ex, Munkidori ex, Fezandipiti ex, Pecharunt ex and the Cassiopeia Special Art
          Rare match Shrouded Fable.
        </p>
        <p>
          <strong>The pack Pokémon is from Surging Sparks.</strong> Milotic ex at all three rarities, the Feebas Art Rare, the Larvesta
          Art Rare and the gold Gravity Mountain and Jet Energy all match Surging Sparks. Stellar Crown supplies the Medicham ex, Orthworm
          ex and Kofu Super Rares and the gold Bravery Charm.
        </p>
        <p>
          <strong>One card is new.</strong> English printed Carmine as a Super Rare and as a Special Illustration Rare by En Morikura.
          Brilliant Fantasy keeps the Super Rare but swaps the Special Art Rare for a new illustration by OKACHEKE, so the English SIR is
          not in this set at all.
        </p>
        <div className="card-grid cols-2">
          {carmine.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/207, Brilliant Fantasy`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{r.name}</strong>
                {r.cn}/207 · {r.rarity} · {r.src === 'NEW' ? 'new art' : SET_NAME[r.src]}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>Two promo arts and a late gold.</strong> Xerneas ex 088/207 and Dialga ex 141/207 use art that English released as SV
          Black Star Promos. The gold Jamming Tower 262/207 matches Destined Rivals, and Foongus, Amoonguss ex and Reshiram ex match
          Journey Together.
        </p>

        <h2 id="secret-rares">All 57 secret rares</h2>
        <p>Every card above 207, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} />

        <h2 id="main-set">The 207-card main set</h2>
        <OriginsTable list={MAIN} />

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          Many of these Pokémon have several English arts, so matching names was not enough. We compared each Chinese card's art with every
          English printing of the same name from Scarlet & Violet onward, then checked the close calls and the cards with no match by eye.
          Where the same art was printed more than once, we list the first set it appeared in.
        </p>

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
