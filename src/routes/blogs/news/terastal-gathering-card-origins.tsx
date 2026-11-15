import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv9-5.json'

const post = BLOG_POSTS.find((p) => p.slug === 'terastal-gathering-card-origins')!

type Src = 'PRE' | 'SVP' | 'PAR' | 'TWM' | 'TEF' | 'SFA' | 'PAL' | 'SVI' | 'OBF' | 'SCR' | 'SSP' | 'PAF' | 'NEW'

// Every Terastal Gathering card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art is in Prismatic Evolutions we list that, otherwise the set it
// first appeared in.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'PRE', '001/131', "Iori Suzuki"],
  ['002', 'PRE', '002/131', "Dsuke"],
  ['003', 'PRE', '003/131', "Uninori"],
  ['004', 'PRE', '004/131', "Yoriyuki Ikegami"],
  ['005', 'SVP', '170', "Iori Suzuki"],
  ['006', 'PRE', '006/131', "5ban Graphics"],
  ['007', 'PRE', '007/131', "Kyoko Umemoto"],
  ['008', 'PRE', '008/131', "Mizue"],
  ['009', 'TWM', '014/167', "Tomomi Ozaki"],
  ['010', 'SVP', '115', "Uninori"],
  ['011', 'PRE', '009/131', "Yoriyuki Ikegami"],
  ['012', 'PRE', '010/131', "Saboteri"],
  ['013', 'TEF', '020/162', "Tetsu Kayama"],
  ['014', 'TEF', '021/162', "otumami"],
  ['015', 'TEF', '023/162', "Saboteri"],
  ['016', 'TEF', '024/162', "mingo"],
  ['017', 'PAR', '018/182', "Kouki Saitou"],
  ['018', 'SVP', '128', "5ban Graphics"],
  ['019', 'TWM', '020/167', "MINAMINAMI Take"],
  ['020', 'TWM', '022/167', "Kouki Saitou"],
  ['021', 'PRE', '012/131', "5ban Graphics"],
  ['022', 'SVP', '167', "SIE NANAHARA"],
  ['023', 'PRE', '014/131', "5ban Graphics"],
  ['024', 'PRE', '015/131', "Whisker"],
  ['025', 'PRE', '016/131', "Takeshi Nakamura"],
  ['026', 'OBF', '043/197', "Saya Tsuruta"],
  ['027', 'PAR', '028/182', "Kouki Saitou"],
  ['028', 'SVP', '057', "Dsuke"],
  ['029', 'PRE', '017/131', "5ban Graphics"],
  ['030', 'SVP', '144', "PLANETA Mochizuki"],
  ['031', 'PRE', '018/131', "Natsumi Yoshida"],
  ['032', 'PRE', '019/131', "Oswaldo KATO"],
  ['033', 'PRE', '020/131', "saino misaki"],
  ['034', 'PRE', '021/131', "Nelnal"],
  ['035', 'SVP', '168', "Taira Akitsu"],
  ['036', 'PRE', '023/131', "5ban Graphics"],
  ['037', 'TEF', '039/162', "MINAMINAMI Take"],
  ['038', 'TEF', '040/162', "Jerky"],
  ['039', 'SVP', '089', "Kurata So"],
  ['040', 'PRE', '024/131', "Kuroimori"],
  ['041', 'TWM', '049/167', "Scav"],
  ['042', 'TWM', '050/167', "Taira Akitsu"],
  ['043', 'TWM', '051/167', "M\u00e9kayu"],
  ['044', 'SVP', '117', "mingo"],
  ['045', 'NEW', '', "PLANETA Mochizuki"],
  ['046', 'SVP', '171', "Keisin"],
  ['047', 'PRE', '026/131', "aky CG Works"],
  ['048', 'TEF', '047/162', "OKUBO"],
  ['049', 'PAR', '053/182', "Kouki Saitou"],
  ['050', 'TWM', '059/167', "Narumi Sato"],
  ['051', 'TWM', '060/167', "Ligton"],
  ['052', 'SVP', '126', "PLANETA Mochizuki"],
  ['053', 'SVP', '058', "Lee HyunJung"],
  ['054', 'PAR', '057/182', "Anesaki Dynamic"],
  ['055', 'SVP', '127', "takuyoa"],
  ['056', 'PRE', '027/131', "5ban Graphics"],
  ['057', 'SVP', '169', "Nisota Niso"],
  ['058', 'PRE', '030/131', "5ban Graphics"],
  ['059', 'SCR', '055/142', "Anesaki Dynamic"],
  ['060', 'PRE', '031/131', "PLANETA Mochizuki"],
  ['061', 'TEF', '062/162', "Takeshi Nakamura"],
  ['062', 'TWM', '080/167', "Kariya"],
  ['063', 'TWM', '081/167', "Uninori"],
  ['064', 'TWM', '082/167', "Masako Tomii"],
  ['065', 'PAR', '071/182', "ryoma uratsuka"],
  ['066', 'SVP', '059', "GOSSAN"],
  ['067', 'PRE', '033/131', "Kariya"],
  ['068', 'PRE', '034/131', "5ban Graphics"],
  ['069', 'PRE', '035/131', "IKEDA Saki"],
  ['070', 'PRE', '036/131', "Aya Kusube"],
  ['071', 'PRE', '037/131', "danciao"],
  ['072', 'PRE', '038/131', "ryoma uratsuka"],
  ['073', 'PRE', '039/131', "Wintr Wandr"],
  ['074', 'TWM', '089/167', "Akira Komayama"],
  ['075', 'SVP', '172', "Susumu Maeya"],
  ['076', 'PRE', '041/131', "5ban Graphics"],
  ['077', 'PAL', '098/193', "Ryota Murayama"],
  ['078', 'PRE', '042/131', "Ryota Murayama"],
  ['079', 'PRE', '043/131', "kodama"],
  ['080', 'PAR', '088/182', "Kouki Saitou"],
  ['081', 'SVP', '068', "aky CG Works"],
  ['082', 'PRE', '044/131', "kodama"],
  ['083', 'PRE', '045/131', "Kouki Saitou"],
  ['084', 'PRE', '046/131', "GIDORA"],
  ['085', 'SVP', '146', "5ban Graphics"],
  ['086', 'PRE', '047/131', "Shimaris Yukichi"],
  ['087', 'PRE', '048/131', "Shigenori Negishi"],
  ['088', 'TEF', '084/162', "Mina Nakai"],
  ['089', 'PRE', '049/131', "Uta"],
  ['090', 'PAR', '094/182', "saino misaki"],
  ['091', 'PAR', '095/182', "Nisota Niso"],
  ['092', 'PRE', '052/131', "HYOGONOSUKE"],
  ['093', 'PRE', '053/131', "Kurata So"],
  ['094', 'TEF', '085/162', "Kariya"],
  ['095', 'SVI', '118/198', "GOSSAN"],
  ['096', 'PRE', '054/131', "Souichirou Gunjima"],
  ['097', 'PRE', '055/131', "GIDORA"],
  ['098', 'SFA', '026/64', "Shinji Kanda"],
  ['099', 'PRE', '056/131', "PLANETA Mochizuki"],
  ['100', 'PAR', '109/182', "AKIRA EGAWA"],
  ['101', 'PRE', '057/131', "Souichirou Gunjima"],
  ['102', 'PRE', '058/131', "5ban Graphics"],
  ['103', 'PRE', '059/131', "matazo"],
  ['104', 'PRE', '060/131', "takuyoa"],
  ['105', 'PRE', '061/131', "Kurata So"],
  ['106', 'PRE', '062/131', "M\u00e9kayu"],
  ['107', 'PRE', '063/131', "kawayoo"],
  ['108', 'PAR', '116/182', "Miki Tanaka"],
  ['109', 'PAR', '117/182', "Aya Kusube"],
  ['110', 'SFA', '031/64', "Yuu Nishida"],
  ['111', 'SFA', '032/64', "nagimiso"],
  ['112', 'PAR', '121/182', "Cona Nitanda"],
  ['113', 'PAR', '123/182', "Anesaki Dynamic"],
  ['114', 'PRE', '065/131', "hncl"],
  ['115', 'SVP', '067', "takuyoa"],
  ['116', 'SFA', '039/64', "aky CG Works"],
  ['117', 'TEF', '113/162', "hatachu"],
  ['118', 'SVP', '090', "Uta"],
  ['119', 'PAR', '126/182', "Naoyo Kimura"],
  ['120', 'PRE', '066/131', "Souichirou Gunjima"],
  ['121', 'PRE', '067/131', "Scav"],
  ['122', 'PRE', '068/131', "Tonji Matsuno"],
  ['123', 'PAR', '131/182', "Nagomi Nijo"],
  ['124', 'PAR', '132/182', "Bun Toujo"],
  ['125', 'SVP', '060', "Takeshi Nakamura"],
  ['126', 'PRE', '069/131', "Takeshi Nakamura"],
  ['127', 'PRE', '070/131', "Oswaldo KATO"],
  ['128', 'SFA', '043/64', "HAGIYA Kaoru"],
  ['129', 'SVI', '142/198', "Anesaki Dynamic"],
  ['130', 'TEF', '118/162', "Tonji Matsuno"],
  ['131', 'PAR', '139/182', "takuyoa"],
  ['132', 'PRE', '071/131', "Scav"],
  ['133', 'PRE', '072/131', "cochi8i"],
  ['134', 'PRE', '073/131', "5ban Graphics"],
  ['135', 'SVP', '118', "Shimaris Yukichi"],
  ['136', 'SVP', '091', "Anesaki Dynamic"],
  ['137', 'SVP', '092', "akagi"],
  ['138', 'SVP', '145', "PLANETA Mochizuki"],
  ['139', 'PRE', '074/131', "Naoyo Kimura"],
  ['140', 'PRE', '075/131', "aky CG Works"],
  ['141', 'PRE', '077/131', "Nakamura Ippan"],
  ['142', 'PRE', '078/131', "matazo"],
  ['143', 'PRE', '079/131', "Sanosuke Sakuma"],
  ['144', 'PRE', '080/131', "Teeziro"],
  ['145', 'PRE', '081/131', "Keisin"],
  ['146', 'PRE', '083/131', "Naoki Saito"],
  ['147', 'PRE', '084/131', "Tika Matsuno"],
  ['148', 'PRE', '085/131', "Toshinao Aoki"],
  ['149', 'PRE', '086/131', "chibi"],
  ['150', 'PRE', '087/131', "Amelicart"],
  ['151', 'SVP', '136', "Tonji Matsuno"],
  ['152', 'PRE', '088/131', "Keisin"],
  ['153', 'PRE', '089/131', "KEIICHIRO ITO"],
  ['154', 'SVP', '177', "aky CG Works"],
  ['155', 'PAR', '158/182', "Souichirou Gunjima"],
  ['156', 'PRE', '092/131', "5ban Graphics"],
  ['157', 'PRE', '118/131', "5ban Graphics"],
  ['158', 'TWM', '148/167', "Eske Yoshinob"],
  ['159', 'PAR', '160/182', "Toyste Beach"],
  ['160', 'PRE', '110/131', "Toyste Beach"],
  ['161', 'PAL', '189/193', "Studio Bora Inc."],
  ['162', 'PRE', '106/131', "AYUMI ODASHIMA"],
  ['163', 'PRE', '116/131', "Toyste Beach"],
  ['164', 'PRE', '130/131', "inose yukie"],
  ['165', 'SSP', '189/191', "Ayaka Yoshida"],
  ['166', 'PRE', '131/131', "inose yukie"],
  ['167', 'PRE', '101/131', "AYUMI ODASHIMA"],
  ['168', 'PRE', '119/131', "Toyste Beach"],
  ['169', 'PRE', '128/131', "Toyste Beach"],
  ['170', 'PRE', '102/131', "AYUMI ODASHIMA"],
  ['171', 'SFA', '061/64', "Toyste Beach"],
  ['172', 'PRE', '129/131', "Toyste Beach"],
  ['173', 'PRE', '126/131', "Toyste Beach"],
  ['174', 'PRE', '095/131', "5ban Graphics"],
  ['175', 'PAR', '166/182', "Toyste Beach"],
  ['176', 'PRE', '111/131', "Studio Bora Inc."],
  ['177', 'PAR', '159/182', "5ban Graphics"],
  ['178', 'PAR', '164/182', "5ban Graphics"],
  ['179', 'PRE', '117/131', "inose yukie"],
  ['180', 'PAR', '178/182', "Studio Bora Inc."],
  ['181', 'PAR', '177/182', "Studio Bora Inc."],
  ['182', 'PRE', '115/131', "hncl"],
  ['183', 'PRE', '105/131', "GIDORA"],
  ['184', 'SFA', '057/64', "hncl"],
  ['185', 'PRE', '104/131', "Taira Akitsu"],
  ['186', 'PRE', '112/131', "Taira Akitsu"],
  ['187', 'PRE', '120/131', "Megumi Mizutani"],
  ['188', 'PRE', '096/131', "GOSSAN"],
  ['189', 'TWM', '155/167', "Atsushi Furusawa"],
  ['190', 'PRE', '113/131', "GIDORA"],
  ['191', 'PRE', '103/131', "kantaro"],
  ['192', 'PRE', '114/131', "Sanosuke Sakuma"],
  ['193', 'PRE', '107/131', "Hideki Ishikawa"],
  ['194', 'PRE', '093/131', "Akira Komayama"],
  ['195', 'PRE', '109/131', "Cona Nitanda"],
  ['196', 'PRE', '121/131', "hncl"],
  ['197', 'PRE', '100/131', "Naoki Saito"],
  ['198', 'TEF', '142/162', "En Morikura"],
  ['199', 'TEF', '155/162', "GIDORA"],
  ['200', 'PAR', '167/182', "kirisAki"],
  ['201', 'PRE', '108/131', "MARINA Chikazawa"],
  ['202', 'TWM', '153/167', "AYUMI ODASHIMA"],
  ['203', 'PRE', '094/131', "MARINA Chikazawa"],
  ['204', 'PAF', '081/91', "AYUMI ODASHIMA"],
  ['205', 'SFA', '060/64', "imoniii"],
  ['206', 'PAL', '190/193', ""],
  ['207', 'TEF', '161/162', ""],
  ['208', 'TWM', '167/167', ""],
  ['209', 'PRE', '139/131', "hncl"],
  ['210', 'PRE', '141/131', "Teeziro"],
  ['211', 'PRE', '135/131', "GIDORA"],
  ['212', 'PRE', '133/131', "kantaro"],
  ['213', 'PRE', '134/131', "GIDORA"],
  ['214', 'PRE', '143/131', "Yuu Nishida"],
  ['215', 'PRE', '132/131', "Akira Komayama"],
  ['216', 'PRE', '137/131', "Cona Nitanda"],
  ['217', 'PRE', '138/131', "GOSSAN"],
  ['218', 'PRE', '136/131', "Ryuta Fuse"],
  ['219', 'PRE', '140/131', "Naoki Saito"],
  ['220', 'PRE', '142/131', "hncl"],
  ['221', 'PRE', '144/131', "Jiro Sasumo"],
  ['222', 'PRE', '145/131', "Yukihiro Tada"],
  ['223', 'PRE', '146/131', "Nurikabe"],
  ['224', 'PRE', '147/131', "akagi"],
  ['225', 'PRE', '148/131', "Yukihiro Tada"],
  ['226', 'PRE', '149/131', "Narano"],
  ['227', 'PRE', '150/131', "Kamome Shirahama"],
  ['228', 'PRE', '151/131', "Tetsuo Hara"],
  ['229', 'PRE', '152/131', "Yukihiro Tada"],
  ['230', 'PRE', '153/131', "kantaro"],
  ['231', 'PRE', '154/131', "Kazumasa Yasukuni"],
  ['232', 'PRE', '155/131', "sui"],
  ['233', 'PRE', '156/131', "Cona Nitanda"],
  ['234', 'NEW', '', "rika"],
  ['235', 'PRE', '157/131', "danciao"],
  ['236', 'PRE', '158/131', "OKUBO"],
  ['237', 'PRE', '159/131', "Tetsu Kayama"],
  ['238', 'PRE', '160/131', "Yukihiro Tada"],
  ['239', 'PRE', '161/131', "YASHIRO Nanaco"],
  ['240', 'PRE', '162/131', "Shinji Kanda"],
  ['241', 'PRE', '163/131', "osare"],
  ['242', 'PRE', '164/131', "Shigenori Negishi"],
  ['243', 'PRE', '165/131', "Jerky"],
  ['244', 'PRE', '166/131', "Uninori"],
  ['245', 'PRE', '167/131', "tono"],
  ['246', 'SVP', '174', "Natsuko Shoji \u00e9t\u00e9"],
  ['247', 'PRE', '168/131', "Yano Keiji"],
  ['248', 'PRE', '169/131', "mashu"],
  ['249', 'PRE', '171/131', "Tomowaka"],
  ['250', 'PRE', '173/131', "Ligton"],
  ['251', 'PRE', '172/131', "Tomowaka"],
  ['252', 'PRE', '174/131', "Iori Suzuki"],
  ['253', 'PRE', '175/131', "Tomowaka"],
  ['254', 'PRE', '170/131', "Tomowaka"],
  ['255', 'PRE', '176/131', "5ban Graphics"],
  ['256', 'PRE', '177/131', "5ban Graphics"],
  ['257', 'PRE', '178/131', "takuyoa"],
  ['258', 'PRE', '179/131', "aky CG Works"],
  ['259', 'PRE', '180/131', "5ban Graphics"],
]

const SET_NAME: Record<Src, string> = {
  PRE: 'Prismatic Evolutions',
  SVP: 'SV Black Star Promo',
  PAR: 'Paradox Rift',
  TWM: 'Twilight Masquerade',
  TEF: 'Temporal Forces',
  SFA: 'Shrouded Fable',
  PAL: 'Paldea Evolved',
  SVI: 'Scarlet & Violet',
  OBF: 'Obsidian Flames',
  SCR: 'Stellar Crown',
  SSP: 'Surging Sparks',
  PAF: 'Paldean Fates',
  NEW: 'New for Terastal Gathering',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 208)
const SECRET = rows.filter((r) => +r.cn > 208)
const OTHER: Src[] = ['PAR', 'TWM', 'TEF', 'SFA', 'PAL', 'SVI', 'OBF', 'SCR', 'SSP', 'PAF']
const group = (s: Src) => (s === 'PRE' ? 'pre' : s === 'SVP' ? 'promo' : s === 'NEW' ? 'new' : 'other')

const BY_TIER = (['C', 'U', 'R', 'RR', 'ACE', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (g: string) => list.filter((r) => group(r.src) === g).length
  return { tier: t, pre: n('pre'), promo: n('promo'), other: n('other'), fresh: n('new'), total: list.length }
})

const PROMO_EX = rows.filter((r) => r.src === 'SVP' && r.rarity === 'RR')
const PROMO_EEVEE = rows.filter((r) => r.src === 'SVP' && /eon$/.test(r.name))
const BY_OTHER_SET = OTHER.map((s) => ({ s, n: rows.filter((r) => r.src === s).length })).sort((a, b) => b.n - a.n)

const LEFT_OUT = [
  { what: 'Pokémon ex', cards: 'Pikachu ex (Double Rare), Hydrapple ex, Iron Thorns ex, Lucario ex, Tyranitar ex, Snorlax ex, Lugia ex, Noivern ex' },
  { what: 'Rare Eeveelutions', cards: 'Leafeon, Flareon, Vaporeon, Glaceon, Jolteon and Sylveon, replaced by their promo art' },
  { what: 'Trainers', cards: 'Professor’s Research (4 arts), 3 of the 4 Black Belt’s Training arts, Roto-Stick' },
  { what: 'Other', cards: 'Riolu, Noibat' },
]

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'secret-rares', label: 'All 51 secret rares' },
  { id: 'main-set', label: 'The 208-card main set' },
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Is Terastal Gathering the same as Prismatic Evolutions?',
    a: 'Not exactly. 156 of its 259 cards share art with Prismatic Evolutions, including 49 of the 51 secret rares. The rest come from other Scarlet & Violet sets, English promos and two new arts, and it leaves out 24 Prismatic Evolutions cards.',
  },
  {
    q: 'Which Terastal Gathering cards are not in English at all?',
    a: 'Sylveon ex 234/208, the Special Art Rare by rika, and Garchomp ex 045/208, a Double Rare with new art by PLANETA Mochizuki.',
  },
  {
    q: 'Why do some cards look like English promos?',
    a: 'Because they are the same art. 28 cards, including Roaring Moon ex, Raging Bolt ex, Bloodmoon Ursaluna ex and six of the plain Eeveelutions, use art that English only released as SV Black Star Promos. In Chinese they come out of booster packs.',
  },
  {
    q: 'Which Eevee ex SAR matches Prismatic Evolutions?',
    a: '245/208 by tono matches Prismatic Evolutions 167/131. The other, 246/208 by Natsuko Shoji été, matches the English promo SVP 174.',
  },
]

export const Route = createFileRoute('/blogs/news/terastal-gathering-card-origins')({
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
  component: TerastalGatheringOrigins,
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

function TerastalGatheringOrigins() {
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
  const fresh = rows.filter((r) => r.src === 'NEW')
  const showcase = [...fresh, rows.find((r) => r.cn === '246')!]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        wide
        post={post}
        lede="Terastal Gathering is often called the Chinese Prismatic Evolutions, and that is mostly right. Here is where all 259 cards line up in English, including the promo arts and the two cards English never printed."
        cta={{
          heading: 'Collect Terastal Gathering',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/csv9-5', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-terastal-gathering-booster-box' }, label: 'Shop the booster box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          156 of Terastal Gathering's 259 cards have the same art as a Prismatic Evolutions card, including nearly every secret rare.
          The rest is where it gets interesting: 28 cards use art that English only released as promos, 73 are reprints from earlier
          Scarlet & Violet sets, and two are brand new. For the chase cards and box odds, see our{' '}
          <Link to="/blogs/news/terastal-gathering-set-guide">set guide</Link>.
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
                <th scope="col">Prismatic Evolutions</th>
                <th scope="col">Promo art</th>
                <th scope="col">Other SV sets</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
                  <td>{t.pre || '–'}</td>
                  <td>{t.promo || '–'}</td>
                  <td>{t.other || '–'}</td>
                  <td>{t.fresh || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Rarity is the Chinese rarity. Super Rare matches English Ultra Rare, Special Art Rare matches Special Illustration Rare, and
          Ultra Rare matches the gold Hyper Rare.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>The chase cards are Prismatic Evolutions.</strong> 49 of the 51 secret rares match Prismatic Evolutions card for card.
          The two that do not are the Chinese-exclusive Sylveon ex 234/208 and Eevee ex 246/208, whose art English only released as the
          promo SVP 174.
        </p>
        <p>
          <strong>Promo art comes out of packs.</strong> {PROMO_EX.length} Pokémon ex use art that English only printed as SV Black Star
          Promos: {PROMO_EX.map((r) => r.name).join(', ')}. So do the plain {PROMO_EEVEE.map((r) => r.name).join(', ')}, which match the
          promos SVP 167 to 172 instead of the Rare versions in Prismatic Evolutions.
        </p>
        <p>
          <strong>The rest of the main set reaches back.</strong> {BY_OTHER_SET.reduce((a, b) => a + b.n, 0)} main-set cards match
          earlier Scarlet & Violet sets, mostly Paradox Rift, Twilight Masquerade and Temporal Forces:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">English set</th>
                <th scope="col">Cards</th>
              </tr>
            </thead>
            <tbody>
              {BY_OTHER_SET.map((b) => (
                <tr key={b.s}>
                  <th scope="row">{SET_NAME[b.s]}</th>
                  <td>{b.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Two cards are new.</strong> Sylveon ex 234/208 by rika is the Chinese-exclusive Special Art Rare. Garchomp ex 045/208
          is a Double Rare with new art by PLANETA Mochizuki. In English, Garchomp ex only has its Paradox Rift arts.
        </p>
        <div className="card-grid cols-3">
          {showcase.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/208, Terastal Gathering`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{r.name}</strong>
                {r.cn}/208 · {r.src === 'NEW' ? 'New art' : `${SET_NAME[r.src]} ${r.en}`}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>Some of Prismatic Evolutions stayed out.</strong> 24 English cards have no match here:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Not in Terastal Gathering</th>
              </tr>
            </thead>
            <tbody>
              {LEFT_OUT.map((l) => (
                <tr key={l.what}>
                  <th scope="row">{l.what}</th>
                  <td>{l.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Pikachu ex is still in the set as the gold Ultra Rare 258/208.</p>

        <h2 id="secret-rares">All 51 secret rares</h2>
        <p>Every card above 208, with its English twin. Highlighted rows are new.</p>
        <OriginsTable list={SECRET} />

        <h2 id="main-set">The 208-card main set</h2>
        <OriginsTable list={MAIN} />

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          Many of these cards have been printed several times in English with different art, so matching names was not enough. We compared
          each Chinese card's art with every English printing of the same name from the Scarlet & Violet era on, then checked the close
          calls and the cards with no match by eye. Where the same art appears in Prismatic Evolutions and an older set, we list Prismatic
          Evolutions.
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
