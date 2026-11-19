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
import setData from '~/data/csv9.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'stellar-crystal-card-origins')!

type Src = 'SSP' | 'SCR' | 'SFA' | 'TWM' | 'SVP' | 'PRE' | 'NEW'

// Every Stellar Crystal card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'SSP', '001/191', "Tetsu Kayama"],
  ['002', 'SCR', '005/142', "Ounishi"],
  ['003', 'SCR', '006/142', "miki kudo"],
  ['004', 'SCR', '007/142', "Mousho"],
  ['005', 'SCR', '008/142', "Amelicart"],
  ['006', 'SSP', '004/191', "PLANETA Tsuji"],
  ['007', 'SCR', '009/142', "Jerky"],
  ['008', 'SSP', '010/191', "Mori Yuu"],
  ['009', 'SCR', '010/142', "Heisuke Kitazawa"],
  ['010', 'SCR', '011/142', "Yuka Tanaka"],
  ['011', 'SCR', '012/142', "Yoriyuki Ikegami"],
  ['012', 'SCR', '013/142', "Souichirou Gunjima"],
  ['013', 'SCR', '014/142', "5ban Graphics"],
  ['014', 'SSP', '011/191', "GOSSAN"],
  ['015', 'SSP', '012/191', "Julie Hang"],
  ['016', 'SSP', '013/191', "Toshinao Aoki"],
  ['017', 'SSP', '014/191', "Masako Tomii"],
  ['018', 'SSP', '015/191', "danciao"],
  ['019', 'TWM', '020/167', "MINAMINAMI Take"],
  ['020', 'TWM', '023/167', "aky CG Works"],
  ['021', 'SSP', '019/191', "kodama"],
  ['022', 'SSP', '020/191', "osare"],
  ['023', 'SSP', '021/191', "0313"],
  ['024', 'SCR', '023/142', "Felicia Chen"],
  ['025', 'SCR', '024/142', "Taiga Kasai"],
  ['026', 'SCR', '025/142', "AKIRA EGAWA"],
  ['027', 'SCR', '026/142', "Cona Nitanda"],
  ['028', 'SCR', '027/142', "aspara"],
  ['029', 'SCR', '028/142', "5ban Graphics"],
  ['030', 'SSP', '029/191', "Tomomi Ozaki"],
  ['031', 'SSP', '030/191', "Atsuya Uki"],
  ['032', 'SSP', '031/191', "akagi"],
  ['033', 'SSP', '032/191', "Kariya"],
  ['034', 'SSP', '036/191', "5ban Graphics"],
  ['035', 'SSP', '037/191', "PLANETA Mochizuki"],
  ['036', 'SSP', '038/191', "AKIRA EGAWA"],
  ['037', 'SCR', '032/142', "5ban Graphics"],
  ['038', 'TWM', '049/167', "Scav"],
  ['039', 'TWM', '050/167', "Taira Akitsu"],
  ['040', 'SSP', '043/191', "Teeziro"],
  ['041', 'SSP', '044/191', "Mina Nakai"],
  ['042', 'SSP', '045/191', "Mitsuhiro Arita"],
  ['043', 'SSP', '046/191', "Shinya Komatsu"],
  ['044', 'SCR', '037/142', "takashi shiraishi"],
  ['045', 'SCR', '038/142', "LINNE"],
  ['046', 'SSP', '047/191', "sui"],
  ['047', 'SSP', '049/191', "Shibuzoh."],
  ['048', 'SSP', '050/191', "Saboteri"],
  ['049', 'SSP', '051/191', "OKACHEKE"],
  ['050', 'SSP', '052/191', "nagimiso"],
  ['051', 'SCR', '045/142', "GOTO minori"],
  ['052', 'SSP', '055/191', "rika"],
  ['053', 'SSP', '056/191', "Yuya Oka"],
  ['054', 'SSP', '057/191', "aky CG Works"],
  ['055', 'SSP', '058/191', "Hoshino KURO"],
  ['056', 'SSP', '059/191', "Nisota Niso"],
  ['057', 'SSP', '060/191', "Po-Suzuki"],
  ['058', 'SCR', '046/142', "Oswaldo KATO"],
  ['059', 'SCR', '047/142', "chibi"],
  ['060', 'SCR', '048/142', "Souichirou Gunjima"],
  ['061', 'SCR', '049/142', "Akira Komayama"],
  ['062', 'SSP', '061/191', "Shinya Mizuno"],
  ['063', 'SCR', '050/142', "Nisota Niso"],
  ['064', 'SCR', '051/142', "5ban Graphics"],
  ['065', 'SSP', '064/191', "Miki Tanaka"],
  ['066', 'SCR', '052/142', "Makura Tami"],
  ['067', 'SCR', '053/142', "Shiburingaru"],
  ['068', 'SSP', '065/191', "Souichirou Gunjima"],
  ['069', 'SCR', '055/142', "Anesaki Dynamic"],
  ['070', 'SSP', '069/191', "Nurikabe"],
  ['071', 'SCR', '057/142', "Teeziro"],
  ['072', 'SCR', '058/142', "Tetsu Kayama"],
  ['073', 'SSP', '070/191', "Yoko Hishida"],
  ['074', 'SSP', '071/191', "Teeziro"],
  ['075', 'SSP', '072/191', "Narano"],
  ['076', 'SSP', '073/191', "Shimaris Yukichi"],
  ['077', 'SSP', '074/191', "Orca"],
  ['078', 'SSP', '076/191', "takuyoa"],
  ['079', 'SSP', '077/191', "kantaro"],
  ['080', 'SCR', '060/142', "Miki Tanaka"],
  ['081', 'SCR', '061/142', "sowsow"],
  ['082', 'SSP', '078/191', "HYOGONOSUKE"],
  ['083', 'SSP', '079/191', "HYOGONOSUKE"],
  ['084', 'SSP', '080/191', "HYOGONOSUKE"],
  ['085', 'SFA', '021/64', "matazo"],
  ['086', 'SSP', '082/191', "IKEDA Saki"],
  ['087', 'SSP', '083/191', "Shiburingaru"],
  ['088', 'SSP', '084/191', "Natsumi Yoshida"],
  ['089', 'SSP', '085/191', "Yoriyuki Ikegami"],
  ['090', 'SSP', '086/191', "5ban Graphics"],
  ['091', 'SSP', '087/191', "Uninori"],
  ['092', 'SSP', '089/191', "saino misaki"],
  ['093', 'SSP', '090/191', "Koji Nakata"],
  ['094', 'SSP', '091/191', "5ban Graphics"],
  ['095', 'SSP', '096/191', "Ebila"],
  ['096', 'SSP', '097/191', "Scav"],
  ['097', 'SSP', '098/191', "Apios"],
  ['098', 'SSP', '099/191', "Felicia Chen"],
  ['099', 'SSP', '100/191', "SIE NANAHARA"],
  ['100', 'SSP', '104/191', "Taiga Kayama"],
  ['101', 'SSP', '105/191', "Teeziro"],
  ['102', 'SSP', '106/191', "5ban Graphics"],
  ['103', 'SSP', '107/191', "Scav"],
  ['104', 'SSP', '110/191', "Souichirou Gunjima"],
  ['105', 'SCR', '085/142', "Tomomi Ozaki"],
  ['106', 'SCR', '086/142', "Jiro Sasumo"],
  ['107', 'SSP', '112/191', "Shimaris Yukichi"],
  ['108', 'SSP', '113/191', "KEIICHIRO ITO"],
  ['109', 'SCR', '088/142', "Gapao"],
  ['110', 'SSP', '114/191', "Eri Kamei"],
  ['111', 'SSP', '115/191', "takashi shiraishi"],
  ['112', 'SSP', '116/191', "Ryuta Fuse"],
  ['113', 'SCR', '091/142', "Shimaris Yukichi"],
  ['114', 'SCR', '092/142', "OKACHEKE"],
  ['115', 'SFA', '031/64', "Yuu Nishida"],
  ['116', 'SFA', '032/64', "nagimiso"],
  ['117', 'SSP', '117/191', "YASHIRO Nanaco"],
  ['118', 'SSP', '118/191', "chibi"],
  ['119', 'SSP', '119/191', "5ban Graphics"],
  ['120', 'SCR', '093/142', "KEIICHIRO ITO"],
  ['121', 'SFA', '035/64', "SIE NANAHARA"],
  ['122', 'SCR', '094/142', "Tomokazu Komiya"],
  ['123', 'SCR', '095/142', "M\u00e9kayu"],
  ['124', 'SCR', '096/142', "Kazumasa Yasukuni"],
  ['125', 'SSP', '120/191', "Yukiko Baba"],
  ['126', 'SSP', '121/191', "NC Empire"],
  ['127', 'SVP', '149', "Souichirou Gunjima"],
  ['128', 'SSP', '122/191', "Akino Fukuji"],
  ['129', 'SSP', '123/191', "Dsuke"],
  ['130', 'TWM', '119/167', "toi8"],
  ['131', 'SSP', '126/191', "Nabatame Kazutaka"],
  ['132', 'SSP', '127/191', "kawayoo"],
  ['133', 'SFA', '040/64', "Kazumasa Yasukuni"],
  ['134', 'SCR', '103/142', "Apios"],
  ['135', 'SCR', '104/142', "Takumi Wada"],
  ['136', 'SSP', '129/191', "Tonji Matsuno"],
  ['137', 'SCR', '107/142', "Oswaldo KATO"],
  ['138', 'SSP', '130/191', "5ban Graphics"],
  ['139', 'SVP', '198', "PLANETA Mochizuki"],
  ['140', 'SFA', '043/64', "HAGIYA Kaoru"],
  ['141', 'TWM', '125/167', "Hasuno"],
  ['142', 'SSP', '131/191', "Dsuke"],
  ['143', 'SSP', '132/191', "akagi"],
  ['144', 'SSP', '133/191', "aky CG Works"],
  ['145', 'SSP', '135/191', "Takumi Wada"],
  ['146', 'SSP', '136/191', "danciao"],
  ['147', 'SFA', '047/64', "Shiburingaru"],
  ['148', 'SSP', '138/191', "Yuka Morii"],
  ['149', 'SSP', '139/191', "GOTO minori"],
  ['150', 'SSP', '140/191', "Oswaldo KATO"],
  ['151', 'SSP', '141/191', "AKIRA EGAWA"],
  ['152', 'SSP', '142/191', "5ban Graphics"],
  ['153', 'SSP', '143/191', "Naoyo Kimura"],
  ['154', 'SCR', '114/142', "Yukihiro Tada"],
  ['155', 'SCR', '115/142', "matazo"],
  ['156', 'SSP', '145/191', "Aya Kusube"],
  ['157', 'SSP', '146/191', "Kurata So"],
  ['158', 'SSP', '147/191', "PLANETA Igarashi"],
  ['159', 'SSP', '149/191', "Ligton"],
  ['160', 'SSP', '150/191', "Shinji Kanda"],
  ['161', 'SCR', '118/142', "Toshinao Aoki"],
  ['162', 'SCR', '119/142', "GOSSAN"],
  ['163', 'SSP', '152/191', "Nakamura Ippan"],
  ['164', 'SSP', '153/191', "Anesaki Dynamic"],
  ['165', 'SCR', '121/142', "Teeziro"],
  ['166', 'SCR', '122/142', "Julie Hang"],
  ['167', 'SCR', '123/142', "Nurikabe"],
  ['168', 'PRE', '090/131', "Masako Tomii"],
  ['169', 'PRE', '091/131', "PLANETA Igarashi"],
  ['170', 'SSP', '156/191', "Saboteri"],
  ['171', 'SSP', '157/191', "USGMEN"],
  ['172', 'SSP', '158/191', "DOM"],
  ['173', 'SSP', '159/191', "5ban Graphics"],
  ['174', 'SSP', '161/191', "GIDORA"],
  ['175', 'SCR', '128/142', "5ban Graphics"],
  ['176', 'SSP', '176/191', "Toyste Beach"],
  ['177', 'SSP', '165/191', "Ayaka Yoshida"],
  ['178', 'SCR', '135/142', "Toyste Beach"],
  ['179', 'SSP', '171/191', "AYUMI ODASHIMA"],
  ['180', 'SSP', '186/191', "Ayaka Yoshida"],
  ['181', 'SSP', '189/191', "Ayaka Yoshida"],
  ['182', 'SSP', '166/191', "AYUMI ODASHIMA"],
  ['183', 'SSP', '164/191', "Toyste Beach"],
  ['184', 'SCR', '130/142', "AYUMI ODASHIMA"],
  ['185', 'SCR', '129/142', "AYUMI ODASHIMA"],
  ['186', 'SSP', '185/191', "inose yukie"],
  ['187', 'SSP', '183/191', "inose yukie"],
  ['188', 'SSP', '182/191', "Toyste Beach"],
  ['189', 'SSP', '172/191', "AYUMI ODASHIMA"],
  ['190', 'SSP', '169/191', "Toyste Beach"],
  ['191', 'SSP', '162/191', "Toyste Beach"],
  ['192', 'SCR', '137/142', "Toyste Beach"],
  ['193', 'SSP', '168/191', "Studio Bora Inc."],
  ['194', 'SSP', '163/191', "Studio Bora Inc."],
  ['195', 'SSP', '188/191', "Studio Bora Inc."],
  ['196', 'SCR', '133/142', "GIDORA"],
  ['197', 'SSP', '174/191', "GIDORA"],
  ['198', 'SSP', '170/191', "Akira Komayama"],
  ['199', 'SSP', '167/191', "Naoki Saito"],
  ['200', 'SCR', '139/142', "Sanosuke Sakuma"],
  ['201', 'SSP', '173/191', "Hideki Ishikawa"],
  ['202', 'SCR', '132/142', "Naoki Saito"],
  ['203', 'SSP', '178/191', "Taira Akitsu"],
  ['204', 'SSP', '179/191', "En Morikura"],
  ['205', 'SCR', '136/142', "AYUMI ODASHIMA"],
  ['206', 'SSP', '180/191', "imoniii"],
  ['207', 'SCR', '131/142', "MARINA Chikazawa"],
  ['208', 'SSP', '191/191', ""],
  ['209', 'SCR', '146/142', "Yukihiro Tada"],
  ['210', 'SCR', '151/142', "Kazumasa Yasukuni"],
  ['211', 'SFA', '071/64', "satoma"],
  ['212', 'SFA', '075/64', "REND"],
  ['213', 'SCR', '155/142', "Toshinao Aoki"],
  ['214', 'SVP', '141', "Tetsu Kayama"],
  ['215', 'SSP', '215/191', "PLANETA Tsuji"],
  ['216', 'TWM', '189/167', "aky CG Works"],
  ['217', 'SCR', '156/142', "5ban Graphics"],
  ['218', 'SCR', '157/142', "5ban Graphics"],
  ['219', 'SSP', '216/191', "PLANETA Igarashi"],
  ['220', 'SCR', '158/142', "5ban Graphics"],
  ['221', 'SSP', '219/191', "aky CG Works"],
  ['222', 'SCR', '159/142', "5ban Graphics"],
  ['223', 'SSP', '220/191', "takuyoa"],
  ['224', 'SSP', '221/191', "5ban Graphics"],
  ['225', 'SSP', '222/191', "5ban Graphics"],
  ['226', 'SSP', '223/191', "5ban Graphics"],
  ['227', 'SSP', '224/191', "5ban Graphics"],
  ['228', 'SSP', '225/191', "aky CG Works"],
  ['229', 'SSP', '226/191', "5ban Graphics"],
  ['230', 'SSP', '227/191', "PLANETA Igarashi"],
  ['231', 'SSP', '228/191', "5ban Graphics"],
  ['232', 'SVP', '165', "5ban Graphics"],
  ['233', 'SCR', '164/142', "GIDORA"],
  ['234', 'SSP', '232/191', "GIDORA"],
  ['235', 'SSP', '230/191', "Akira Komayama"],
  ['236', 'SSP', '229/191', "Naoki Saito"],
  ['237', 'SCR', '166/142', "Sanosuke Sakuma"],
  ['238', 'SSP', '231/191', "Hideki Ishikawa"],
  ['239', 'SCR', '163/142', "Naoki Saito"],
  ['240', 'SSP', '233/191', "Taira Akitsu"],
  ['241', 'SSP', '234/191', "En Morikura"],
  ['242', 'SSP', '236/191', "osare"],
  ['243', 'TWM', '210/167', "Saboteri"],
  ['244', 'SCR', '167/142', "Teeziro"],
  ['245', 'SSP', '238/191', "GIDORA"],
  ['246', 'SCR', '168/142', "MARINA Chikazawa"],
  ['247', 'SSP', '239/191', "OKACHEKE"],
  ['248', 'SSP', '240/191', "AKIRA EGAWA"],
  ['249', 'SSP', '241/191', "Shinya Mizuno"],
  ['250', 'SSP', '242/191', "Yuriko Akase"],
  ['251', 'SCR', '170/142', "Saboteri"],
  ['252', 'SSP', '244/191', "DOM"],
  ['253', 'SSP', '243/191', "Shinya Mizuno"],
  ['254', 'SCR', '172/142', "Souichirou Gunjima"],
  ['255', 'SCR', '171/142', "DOM"],
  ['256', 'SSP', '245/191', "Fujimoto Gold"],
  ['257', 'NEW', '', "En Morikura"],
  ['258', 'SVP', '163', "5ban Graphics"],
  ['259', 'SVP', '164', "5ban Graphics"],
  ['260', 'SSP', '247/191', "aky CG Works"],
  ['261', 'SSP', '248/191', "aky CG Works"],
  ['262', 'SCR', '173/142', "5ban Graphics"],
  ['263', 'SSP', '251/191', "Toyste Beach"],
  ['264', 'SSP', '249/191', "Toyste Beach"],
  ['265', 'SFA', '097/64', "Studio Bora Inc."],
  ['266', 'SCR', '174/142', "MARINA Chikazawa"],
]

const SET_NAME: Record<Src, string> = {
  SSP: 'Surging Sparks',
  SCR: 'Stellar Crown',
  SFA: 'Shrouded Fable',
  TWM: 'Twilight Masquerade',
  SVP: 'SV Black Star Promo',
  PRE: 'Prismatic Evolutions',
  NEW: 'New for Stellar Crystal',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 208)
const SECRET = rows.filter((r) => +r.cn > 208)
const BIG4: Src[] = ['SSP', 'SCR', 'SFA', 'TWM']

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
  { id: 'secret-rares', label: 'All 58 secret rares' },
  { id: 'main-set', label: 'The 208-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Stellar Crystal?',
    a: 'Mostly Surging Sparks (160 cards) and Stellar Crown (79). The rest match Shrouded Fable (10), Twilight Masquerade (8), SV Black Star Promos (6) and Prismatic Evolutions (2), plus one Chinese Exclusive.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: "The Lisia's Appeal Special Art Rare 257/208 by En Morikura, the only card with no English version. English has a Lisia's Appeal Special Illustration Rare in Surging Sparks, but with different art, and that one is not in the Chinese set.",
  },
  {
    q: 'Is the Pikachu ex Special Art Rare the same as in English?',
    a: 'Yes. 245/208 matches Surging Sparks 238/191 by GIDORA, and the gold 260/208 matches Surging Sparks 247/191.',
  },
  {
    q: 'Are any Stellar Crystal cards English promos?',
    a: 'Six: Pecharunt 127/208, Zacian ex 139/208, the Noctowl Art Rare 214/208, the Terapagos ex Super Rare 232/208, and the gold Cinderace ex 258/208 and Lapras ex 259/208 all use art English released as SV Black Star Promos.',
  },
]

export const Route = createFileRoute('/blog/stellar-crystal-card-origins')({
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
  component: StellarCrystalOrigins,
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

function StellarCrystalOrigins() {
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
  const lisia = rows.filter((r) => r.name === "Lisia's Appeal" && (r.rarity === 'SAR' || r.rarity === 'SR')).reverse()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Stellar Crystal is mostly Surging Sparks and Stellar Crown, with a few surprises. We matched all 266 cards to English and found one Chinese Exclusive that does not exist in English."
        cta={{
          heading: 'Collect Stellar Crystal',
          body: 'See every card on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/stellar-crystal-csv9', label: 'See the full card list' }],
        }}
      >
        <p>
          If you collect English, 265 of the 266 cards in Stellar Crystal (set code CSV9C) will look familiar. 160 match Surging Sparks and 79 match Stellar
          Crown, with 10 from Shrouded Fable, 8 from Twilight Masquerade, 6 from SV Black Star Promos and 2 from Prismatic Evolutions. The
          one new card is the Chinese Exclusive Lisia's Appeal Special Art Rare. The Chinese set mixes these sources freely, so the numbers never line up
          with any one English set. For the chase cards and pack odds, see our{' '}
          <Link to="/blog/stellar-crystal-set-guide">set guide</Link>.
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
                <th scope="col">Surging Sparks</th>
                <th scope="col">Stellar Crown</th>
                <th scope="col">Shrouded Fable</th>
                <th scope="col">Twilight Masquerade</th>
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
                  <td>{t.ssp || '–'}</td>
                  <td>{t.scr || '–'}</td>
                  <td>{t.sfa || '–'}</td>
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
          matches Special Illustration Rare, and Ultra Rare matches the gold Hyper Rare.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>Two sets do most of the work.</strong> Surging Sparks and Stellar Crown account for 239 cards between them. Every
          card's English source, from most cards to fewest:
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
          <strong>Pikachu is all Surging Sparks.</strong> Pikachu ex matches Surging Sparks at all four rarities, as do Alolan Exeggutor
          ex, and Latias ex and Hydreigon ex at three. Galvantula ex and Hydrapple ex match Stellar Crown at all three rarities and
          Terapagos ex at three of its four, as do the Lacey and Briar Special Art Rares, and Sinistcha ex matches Twilight Masquerade at every rarity.
        </p>
        <p>
          <strong>Three chase cards are English promos.</strong> The gold Cinderace ex 258/208 and Lapras ex 259/208 and the Terapagos ex
          Super Rare 232/208 match SV Black Star Promos, not a main English set. So do the Noctowl Art Rare, Zacian ex and Pecharunt.
        </p>
        <p>
          <strong>One card is a Chinese Exclusive.</strong> English printed Lisia's Appeal as a Super Rare and as a Special Illustration Rare. Stellar
          Crystal keeps the Super Rare by En Morikura but swaps the Special Art Rare for a new illustration, also by En Morikura, so the
          English SIR is not in this set at all.
        </p>
        <ul className="card-grid cols-2">
          {lisia.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/208 ${rarityFullName(r.rarity)}${r.src === 'NEW' ? ', Chinese Exclusive' : ''}, Stellar Crystal`} loading="lazy" width={300} height={419} />
                <figcaption>
                  {r.src === 'NEW' && <ChineseExclusiveBadge />}
                  <strong>{r.name}</strong>
                  {r.cn}/208 · <RarityAbbr code={r.rarity} /> · {r.src === 'NEW' ? 'new art' : SET_NAME[r.src]}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="secret-rares">All 58 secret rares</h2>
        <p>Every card above 208, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the English card each one matches" />

        <BuyStrip />

        <h2 id="main-set">The 208-card main set</h2>
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
