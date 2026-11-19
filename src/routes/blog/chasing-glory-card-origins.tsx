import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import setData from '~/data/csv10.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'chasing-glory-card-origins')!

type Src = 'DRI' | 'JTG' | 'ASC' | 'NEW'

// Every Chasing Glory card and its English counterpart: [Chinese number,
// English set, English number, illustrator]. Matched on card name and
// rarity tier against TCGdex, with the illustrator printed on the Chinese
// card checked wherever a name appears in both sets.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'DRI', '001/182', "GIDORA"],
  ['002', 'DRI', '002/182', "svlt"],
  ['003', 'DRI', '003/182', "takuyoa"],
  ['004', 'DRI', '007/182', "nisimono"],
  ['005', 'DRI', '008/182', "En Morikura"],
  ['006', 'DRI', '009/182', "Rianti Hidayat"],
  ['007', 'DRI', '010/182', "tono"],
  ['008', 'JTG', '008/159', "Dsuke"],
  ['009', 'DRI', '011/182', "Kanami Ogata"],
  ['010', 'DRI', '012/182', "Po-Suzuki"],
  ['011', 'DRI', '015/182', "buchi"],
  ['012', 'DRI', '016/182', "Tetsu Kayama"],
  ['013', 'DRI', '017/182', "Shigenori Negishi"],
  ['014', 'DRI', '018/182', "Anesaki Dynamic"],
  ['015', 'JTG', '016/159', "Mina Nakai"],
  ['016', 'JTG', '017/159', "Felicia Chen"],
  ['017', 'JTG', '018/159', "kodama"],
  ['018', 'DRI', '019/182', "Saboteri"],
  ['019', 'DRI', '020/182', "Taiga Kasai"],
  ['020', 'DRI', '021/182', "Yuka Morii"],
  ['021', 'DRI', '022/182', "Felicia Chen"],
  ['022', 'DRI', '023/182', "PLANETA Tsuji"],
  ['023', 'DRI', '029/182', "Ayako Ozaki"],
  ['024', 'DRI', '030/182', "SIE NANAHARA"],
  ['025', 'JTG', '020/159', "Naoyo Kimura"],
  ['026', 'JTG', '021/159', "Tonji Matsuno"],
  ['027', 'DRI', '031/182', "5ban Graphics"],
  ['028', 'DRI', '032/182', "Susumu Maeya"],
  ['029', 'DRI', '033/182', "Souichirou Gunjima"],
  ['030', 'DRI', '034/182', "danciao"],
  ['031', 'DRI', '035/182', "Sanosuke Sakuma"],
  ['032', 'DRI', '036/182', "kodama"],
  ['033', 'DRI', '037/182', "Krgc"],
  ['034', 'DRI', '038/182', "Anesaki Dynamic"],
  ['035', 'DRI', '039/182', "aky CG Works"],
  ['036', 'DRI', '040/182', "Tika Matsuno"],
  ['037', 'DRI', '041/182', "yuu"],
  ['038', 'DRI', '042/182', "Kazumasa Yasukuni"],
  ['039', 'DRI', '043/182', "Dsuke"],
  ['040', 'JTG', '026/159', "Gemi"],
  ['041', 'JTG', '027/159', "nagimiso"],
  ['042', 'JTG', '031/159', "5ban Graphics"],
  ['043', 'ASC', '039/217', "Jiro Sasumo"],
  ['044', 'ASC', '040/217', "Jiro Sasumo"],
  ['045', 'DRI', '045/182', "Yuu Nishida"],
  ['046', 'DRI', '046/182', "Shinya Komatsu"],
  ['047', 'DRI', '047/182', "Natsumi Yoshida"],
  ['048', 'DRI', '048/182', "Shimaris Yukichi"],
  ['049', 'DRI', '049/182', "GOSSAN"],
  ['050', 'DRI', '050/182', "En Morikura"],
  ['051', 'JTG', '032/159', "Takumi Wada"],
  ['052', 'DRI', '051/182', "Mitsuhiro Arita"],
  ['053', 'JTG', '040/159', "Shinya Mizuno"],
  ['054', 'JTG', '041/159', "Takeshi Nakamura"],
  ['055', 'DRI', '052/182', "kamonabe"],
  ['056', 'DRI', '053/182', "You Iribi"],
  ['057', 'DRI', '054/182', "Miki Tanaka"],
  ['058', 'DRI', '055/182', "Scav"],
  ['059', 'DRI', '056/182', "Naoyo Kimura"],
  ['060', 'DRI', '061/182', "miki kudo"],
  ['061', 'DRI', '064/182', "sui"],
  ['062', 'DRI', '065/182', "kawayoo"],
  ['063', 'DRI', '066/182', "N-DESIGN Inc."],
  ['064', 'JTG', '047/159', "Kazumasa Yasukuni"],
  ['065', 'JTG', '048/159', "GOTO minori"],
  ['066', 'DRI', '068/182', "Amelicart"],
  ['067', 'DRI', '069/182', "PLANETA Mochizuki"],
  ['068', 'DRI', '070/182', "Nurikabe"],
  ['069', 'DRI', '071/182', "Narumi Sato"],
  ['070', 'DRI', '072/182', "Teeziro"],
  ['071', 'DRI', '073/182', "Jerky"],
  ['072', 'DRI', '074/182', "Shiburingaru"],
  ['073', 'DRI', '075/182', "Narano"],
  ['074', 'DRI', '076/182', "Izucch"],
  ['075', 'DRI', '077/182', "Yoshimi Miyoshi"],
  ['076', 'JTG', '049/159', "Iori Suzuki"],
  ['077', 'DRI', '078/182', "Ryuta Fuse"],
  ['078', 'JTG', '052/159', "kurumitsu"],
  ['079', 'JTG', '053/159', "5ban Graphics"],
  ['080', 'JTG', '054/159', "Akira Komayama"],
  ['081', 'JTG', '055/159', "chibi"],
  ['082', 'JTG', '056/159', "5ban Graphics"],
  ['083', 'DRI', '079/182', "matazo"],
  ['084', 'DRI', '080/182', "Yuya Oka"],
  ['085', 'DRI', '081/182', "aky CG Works"],
  ['086', 'DRI', '082/182', "Kazumasa Yasukuni"],
  ['087', 'DRI', '083/182', "Tonji Matsuno"],
  ['088', 'DRI', '084/182', "nagimiso"],
  ['089', 'DRI', '085/182', "Mina Nakai"],
  ['090', 'JTG', '064/159', "Shiburingaru"],
  ['091', 'DRI', '086/182', "Ligton"],
  ['092', 'JTG', '066/159', "Saya Tsuruta"],
  ['093', 'JTG', '067/159', "mashu"],
  ['094', 'JTG', '068/159', "Narumi Sato"],
  ['095', 'DRI', '087/182', "DOM"],
  ['096', 'DRI', '088/182', "Scav"],
  ['097', 'DRI', '089/182', "Shin Nagasawa"],
  ['098', 'DRI', '090/182', "Ayako Ozaki"],
  ['099', 'DRI', '091/182', "GOTO minori"],
  ['100', 'DRI', '092/182', "Shiburingaru"],
  ['101', 'DRI', '093/182', "OKACHEKE"],
  ['102', 'JTG', '077/159', "REND"],
  ['103', 'JTG', '078/159', "Aliya Chen"],
  ['104', 'JTG', '079/159', "Nisota Niso"],
  ['105', 'JTG', '080/159', "Dsuke"],
  ['106', 'JTG', '081/159', "Scav"],
  ['107', 'DRI', '094/182', "Kuroimori"],
  ['108', 'DRI', '095/182', "Izucch"],
  ['109', 'DRI', '096/182', "Ryuta Fuse"],
  ['110', 'DRI', '101/182', "Nisota Niso"],
  ['111', 'DRI', '102/182', "Tomomi Ozaki"],
  ['112', 'DRI', '103/182', "Taira Akitsu"],
  ['113', 'DRI', '104/182', "5ban Graphics"],
  ['114', 'JTG', '084/159', "Yoshimi Miyoshi"],
  ['115', 'JTG', '085/159', "Shiburingaru"],
  ['116', 'JTG', '086/159', "aspara"],
  ['117', 'JTG', '087/159', "Sanosuke Sakuma"],
  ['118', 'DRI', '109/182', "Fujimoto Gold"],
  ['119', 'DRI', '110/182', "Yuya Oka"],
  ['120', 'DRI', '112/182', "KEIICHIRO ITO"],
  ['121', 'DRI', '113/182', "Teeziro"],
  ['122', 'DRI', '114/182', "REND"],
  ['123', 'DRI', '115/182', "Taiga Kasai"],
  ['124', 'DRI', '116/182', "hncl"],
  ['125', 'DRI', '117/182', "buchi"],
  ['126', 'DRI', '118/182', "KEIICHIRO ITO"],
  ['127', 'DRI', '119/182', "5ban Graphics"],
  ['128', 'DRI', '120/182', "toi8"],
  ['129', 'DRI', '121/182', "AKIRA EGAWA"],
  ['130', 'DRI', '122/182', "5ban Graphics"],
  ['131', 'DRI', '123/182', "Mousho"],
  ['132', 'DRI', '124/182', "Uta"],
  ['133', 'DRI', '125/182', "kodama"],
  ['134', 'DRI', '126/182', "matazo"],
  ['135', 'DRI', '127/182', "Mugi Hamada"],
  ['136', 'DRI', '128/182', "GIDORA"],
  ['137', 'JTG', '095/159', "AKIRA EGAWA"],
  ['138', 'DRI', '129/182', "satoma"],
  ['139', 'JTG', '096/159', "Keisin"],
  ['140', 'DRI', '130/182', "REND"],
  ['141', 'DRI', '131/182', "Hasuno"],
  ['142', 'DRI', '132/182', "Teeziro"],
  ['143', 'DRI', '133/182', "Kazumasa Yasukuni"],
  ['144', 'JTG', '097/159', "Jiro Sasumo"],
  ['145', 'JTG', '098/159', "takuyoa"],
  ['146', 'DRI', '134/182', "KEIICHIRO ITO"],
  ['147', 'DRI', '135/182', "NC Empire"],
  ['148', 'DRI', '136/182', "PLANETA Mochizuki"],
  ['149', 'DRI', '137/182', "Mina Nakai"],
  ['150', 'DRI', '138/182', "Mina Nakai"],
  ['151', 'DRI', '139/182', "akagi"],
  ['152', 'DRI', '142/182', "Nisota Niso"],
  ['153', 'DRI', '143/182', "Takeshi Nakamura"],
  ['154', 'DRI', '144/182', "Anesaki Dynamic"],
  ['155', 'DRI', '145/182', "PLANETA Mochizuki"],
  ['156', 'JTG', '103/159', "Saboteri"],
  ['157', 'JTG', '104/159', "KEIICHIRO ITO"],
  ['158', 'JTG', '105/159', "matazo"],
  ['159', 'JTG', '107/159', "rika"],
  ['160', 'JTG', '108/159', "GIDORA"],
  ['161', 'JTG', '111/159', "aky CG Works"],
  ['162', 'DRI', '146/182', "Mitsuhiro Arita"],
  ['163', 'JTG', '112/159', "Miki Tanaka"],
  ['164', 'JTG', '113/159', "Julie Hang"],
  ['165', 'JTG', '114/159', "toriyufu"],
  ['166', 'JTG', '116/159', "rika"],
  ['167', 'DRI', '147/182', "Dsuke"],
  ['168', 'DRI', '148/182', "Uninori"],
  ['169', 'DRI', '149/182', "Megumi Mizutani"],
  ['170', 'DRI', '150/182', "5ban Graphics"],
  ['171', 'DRI', '151/182', "Sanosuke Sakuma"],
  ['172', 'DRI', '153/182', "Oswaldo KATO"],
  ['173', 'DRI', '154/182', "Takeshi Nakamura"],
  ['174', 'DRI', '155/182', "Anesaki Dynamic"],
  ['175', 'JTG', '117/159', "GOSSAN"],
  ['176', 'JTG', '118/159', "Taiga Kayama"],
  ['177', 'JTG', '119/159', "Tomomi Ozaki"],
  ['178', 'JTG', '120/159', "Asako Ito"],
  ['179', 'JTG', '121/159', "5ban Graphics"],
  ['180', 'JTG', '127/159', "Tomokazu Komiya"],
  ['181', 'JTG', '128/159', "Anesaki Dynamic"],
  ['182', 'DRI', '158/182', "Oswaldo KATO"],
  ['183', 'DRI', '159/182', "Akira Komayama"],
  ['184', 'JTG', '133/159', "Shinya Mizuno"],
  ['185', 'JTG', '134/159', "Souichirou Gunjima"],
  ['186', 'JTG', '135/159', "Tomomi Ozaki"],
  ['187', 'JTG', '136/159', "Ryota Murayama"],
  ['188', 'JTG', '138/159', "Saboteri"],
  ['189', 'JTG', '158/159', "Studio Bora Inc."],
  ['190', 'JTG', '153/159', "Toyste Beach"],
  ['191', 'DRI', '164/182', "Toyste Beach"],
  ['192', 'DRI', '168/182', "Eske Yoshinob"],
  ['193', 'JTG', '156/159', "Studio Bora Inc."],
  ['194', 'DRI', '161/182', "AYUMI ODASHIMA"],
  ['195', 'JTG', '147/159', "AYUMI ODASHIMA"],
  ['196', 'DRI', '172/182', "Toyste Beach"],
  ['197', 'DRI', '175/182', "Toyste Beach"],
  ['198', 'DRI', '179/182', "Toyste Beach"],
  ['199', 'DRI', '178/182', "inose yukie"],
  ['200', 'DRI', '162/182', "Studio Bora Inc."],
  ['201', 'JTG', '148/159', "Toyste Beach"],
  ['202', 'JTG', '151/159', "AYUMI ODASHIMA"],
  ['203', 'JTG', '149/159', "yuu"],
  ['204', 'DRI', '163/182', "Cona Nitanda"],
  ['205', 'JTG', '157/159', "Hideki Ishikawa"],
  ['206', 'DRI', '167/182', "kantaro"],
  ['207', 'JTG', '146/159', "Teeziro"],
  ['208', 'DRI', '165/182', "Iori Suzuki"],
  ['209', 'DRI', '171/182', "hncl"],
  ['210', 'DRI', '170/182', "Hideki Ishikawa"],
  ['211', 'DRI', '174/182', "akagi"],
  ['212', 'DRI', '176/182', "GOSSAN"],
  ['213', 'DRI', '177/182', "Naoki Saito"],
  ['214', 'DRI', '166/182', "AYUMI ODASHIMA"],
  ['215', 'JTG', '152/159', "AYUMI ODASHIMA"],
  ['216', 'DRI', '169/182', "AYUMI ODASHIMA"],
  ['217', 'JTG', '150/159', "MARINA Chikazawa"],
  ['218', 'JTG', '154/159', "AYUMI ODASHIMA"],
  ['219', 'DRI', '180/182', "AYUMI ODASHIMA"],
  ['220', 'DRI', '173/182', "imoniii"],
  ['221', 'JTG', '159/159', ""],
  ['222', 'DRI', '182/182', ""],
  ['223', 'DRI', '183/182', "Ayako Ozaki"],
  ['224', 'JTG', '160/159', "Ounishi"],
  ['225', 'DRI', '193/182', "OKACHEKE"],
  ['226', 'DRI', '197/182', "Taiga Kayama"],
  ['227', 'DRI', '201/182', "Takumi Wada"],
  ['228', 'JTG', '167/159', "Bun Toujo"],
  ['229', 'DRI', '206/182', "takuyoa"],
  ['230', 'DRI', '207/182', "PLANETA Tsuji"],
  ['231', 'DRI', '208/182', "5ban Graphics"],
  ['232', 'DRI', '209/182', "aky CG Works"],
  ['233', 'JTG', '171/159', "5ban Graphics"],
  ['234', 'DRI', '210/182', "PLANETA Tsuji"],
  ['235', 'DRI', '211/182', "N-DESIGN Inc."],
  ['236', 'DRI', '212/182', "PLANETA Mochizuki"],
  ['237', 'JTG', '172/159', "5ban Graphics"],
  ['238', 'JTG', '173/159', "5ban Graphics"],
  ['239', 'DRI', '213/182', "aky CG Works"],
  ['240', 'DRI', '214/182', "PLANETA Mochizuki"],
  ['241', 'DRI', '215/182', "5ban Graphics"],
  ['242', 'JTG', '174/159', "N-DESIGN Inc."],
  ['243', 'DRI', '216/182', "5ban Graphics"],
  ['244', 'DRI', '217/182', "5ban Graphics"],
  ['245', 'JTG', '175/159', "takuyoa"],
  ['246', 'DRI', '218/182', "PLANETA Igarashi"],
  ['247', 'JTG', '176/159', "aky CG Works"],
  ['248', 'JTG', '177/159', "5ban Graphics"],
  ['249', 'DRI', '219/182', "5ban Graphics"],
  ['250', 'JTG', '178/159', "5ban Graphics"],
  ['251', 'JTG', '180/159', "yuu"],
  ['252', 'DRI', '220/182', "Cona Nitanda"],
  ['253', 'JTG', '181/159', "Hideki Ishikawa"],
  ['254', 'DRI', '222/182', "kantaro"],
  ['255', 'JTG', '179/159', "Teeziro"],
  ['256', 'DRI', '221/182', "Iori Suzuki"],
  ['257', 'DRI', '224/182', "hncl"],
  ['258', 'DRI', '223/182', "Hideki Ishikawa"],
  ['259', 'DRI', '225/182', "akagi"],
  ['260', 'DRI', '226/182', "GOSSAN"],
  ['261', 'DRI', '227/182', "Naoki Saito"],
  ['262', 'DRI', '228/182', "Tonji Matsuno"],
  ['263', 'DRI', '229/182', "AKIRA EGAWA"],
  ['264', 'DRI', '230/182', "Atsushi Furusawa"],
  ['265', 'JTG', '182/159', "akagi"],
  ['266', 'JTG', '183/159', "Yuu Nishida"],
  ['267', 'JTG', '184/159', "Susumu Maeya"],
  ['268', 'DRI', '231/182', "Iwamoto05"],
  ['269', 'DRI', '232/182', "HICO KIM"],
  ['270', 'DRI', '233/182', "Uninori"],
  ['271', 'DRI', '234/182', "cochi8i"],
  ['272', 'JTG', '185/159', "Megumi Mizutani"],
  ['273', 'DRI', '235/182', "Yuriko Akase"],
  ['274', 'JTG', '186/159', "DOM"],
  ['275', 'JTG', '187/159', "Tsuyoshi Nagano"],
  ['276', 'NEW', '', "Atsushi Furusawa"],
  ['277', 'DRI', '236/182', "Kariya"],
  ['278', 'DRI', '237/182', "Yoshioka"],
  ['279', 'DRI', '238/182', "Krgc"],
  ['280', 'DRI', '239/182', "aky CG Works"],
  ['281', 'JTG', '188/159', "5ban Graphics"],
  ['282', 'DRI', '240/182', "aky CG Works"],
  ['283', 'DRI', '241/182', "5ban Graphics"],
  ['284', 'DRI', '242/182', "5ban Graphics"],
  ['285', 'JTG', '189/159', "takuyoa"],
  ['286', 'DRI', '244/182', "MARINA Chikazawa"],
  ['287', 'JTG', '190/159', ""],
]

const SET_NAME: Record<Src, string> = {
  DRI: 'Destined Rivals',
  JTG: 'Journey Together',
  ASC: 'Ascended Heroes',
  NEW: 'New for Chasing Glory',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 222)
const SECRET = rows.filter((r) => +r.cn > 222)
const count = (list: typeof rows, src: Src) => list.filter((r) => r.src === src).length

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  return { tier: t, dri: count(list, 'DRI'), jtg: count(list, 'JTG'), other: count(list, 'ASC') + count(list, 'NEW'), total: list.length }
})

const TRAINER_SOURCES = [
  { set: 'Destined Rivals', trainers: 'Team Rocket, Ethan, Cynthia, Marnie, Steven, Misty, Arven' },
  { set: 'Journey Together', trainers: 'N, Hop, Iono, Lillie' },
]

const LEFT_OUT = [
  { set: 'Journey Together', cards: 'Amoonguss ex, Blaziken ex, Reshiram ex, Veluza ex, Tapu Koko ex, Mimikyu ex, Alcremie ex, Paldean Clodsire ex' },
  { set: 'Destined Rivals', cards: 'Rabsca ex and the gold Jamming Tower' },
  { set: 'Both', cards: '28 of the 34 Illustration Rares (Chinese keeps 6 as Art Rares)' },
]

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'secret-rares', label: 'All 65 secret rares' },
  { id: 'main-set', label: 'The 222-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English sets is Chasing Glory made from?',
    a: 'Destined Rivals (190 cards) and Journey Together (94 cards). Two more, Psyduck and Golduck, match Ascended Heroes, and Brock’s Scouting 276/222 is a Chinese Exclusive.',
  },
  {
    q: 'Is Team Rocket’s Mewtwo ex the same card as in English?',
    a: 'Yes. The Special Art Rare 268/222 is Destined Rivals 231/182 by Iwamoto05, and the gold 282/222 is Destined Rivals 240/182.',
  },
  {
    q: 'Which card is the Chinese Exclusive?',
    a: 'Brock’s Scouting 276/222, the Special Art Rare by Atsushi Furusawa, the only card with no English version. English has Brock’s Scouting as an Uncommon and a full art in Journey Together, but not this art.',
  },
  {
    q: 'Does Chasing Glory have every card from Destined Rivals and Journey Together?',
    a: 'No. It leaves out nine Pokémon ex, one gold card, 28 Illustration Rares and a number of Commons, Uncommons and Rares, mostly from Journey Together.',
  },
]

export const Route = createFileRoute('/blog/chasing-glory-card-origins')({
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
  component: ChasingGloryOrigins,
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

function ChasingGloryOrigins() {
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
  const brock = rows.find((r) => r.src === 'NEW')!
  const psyduck = rows.filter((r) => r.src === 'ASC')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Chasing Glory pairs Trainers with their Pokémon, and almost every card has an English twin. We matched all 287, and found one Chinese Exclusive."
        cta={{
          heading: 'Collect Chasing Glory',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/chasing-glory-csv10', label: 'See the full card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-chasing-glory-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          If you collect English, most of Chasing Glory will look familiar. 284 of its 287 cards have the same art in Destined Rivals or
          Journey Together, two more match Ascended Heroes, and one is brand new: the Chinese Exclusive
          Brock's Scouting Special Art Rare. The Chinese set mixes cards from
          both, so the numbers do not line up. This guide maps every card. For what is in the set and the slim vs
          jumbo odds, see our <Link to="/blog/chasing-glory-set-guide">set guide</Link>.
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
                <th scope="col">Destined Rivals</th>
                <th scope="col">Journey Together</th>
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
                  <td>{t.dri}</td>
                  <td>{t.jtg}</td>
                  <td>{t.other || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Other is Psyduck and Golduck (Ascended Heroes) and Brock's Scouting 276/222 (Chinese Exclusive). Rarity is the Chinese rarity: Art Rare matches
          English Illustration Rare, Super Rare matches Ultra Rare, Special Art Rare matches Special Illustration Rare, and Ultra Rare
          matches the gold Hyper Rare.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>One card is a Chinese Exclusive.</strong> {brock.name} {brock.cn}/222, the Special Art Rare by {brock.illus}, has no English version.
          English only has Brock's Scouting as an Uncommon (Journey Together 146) and a full art (Journey Together 179), which Chinese
          also prints as 207/222 and 255/222.
        </p>
        <p>
          <strong>Psyduck and Golduck skip ahead.</strong> The plain Psyduck 043/222 and Golduck 044/222 by Jiro Sasumo are not in
          either Scarlet & Violet set. In English that art is in Ascended Heroes ({psyduck.map((p) => p.en).join(' and ')}).
          Misty's Psyduck 045/222 is a different card and comes from Destined Rivals.
        </p>
        <div className="card-grid cols-3">
          {[brock, ...psyduck].map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/222${r.src === 'NEW' ? ', Chinese Exclusive' : ''}, Chasing Glory`} loading="lazy" width={300} height={419} />
              <figcaption>
                {r.src === 'NEW' && <ChineseExclusiveBadge />}
                <strong>{r.name}</strong>
                {r.cn}/222 · {r.src === 'NEW' ? 'New for Chasing Glory' : `${SET_NAME[r.src]} ${r.en}`}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>The Trainer decides the set.</strong> Every Trainer's Pokémon comes from one English set or the other, never both:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">English set</th>
                <th scope="col">Trainers</th>
              </tr>
            </thead>
            <tbody>
              {TRAINER_SOURCES.map((t) => (
                <tr key={t.set}>
                  <th scope="row">{t.set}</th>
                  <td>{t.trainers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Plenty stayed out.</strong> Chasing Glory has 287 cards against 434 across the two English sets. What did not make
          it:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">Not in Chasing Glory</th>
              </tr>
            </thead>
            <tbody>
              {LEFT_OUT.map((l) => (
                <tr key={l.set}>
                  <th scope="row">{l.set}</th>
                  <td>{l.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>A few rarities moved.</strong> Five main-set cards print at a different rarity than in English, for example Team
          Rocket's Pupitar (Uncommon here, Common in Destined Rivals) and Marnie's Morpeko (Rare here, Common in Destined Rivals).
        </p>

        <h2 id="secret-rares">All 65 secret rares</h2>
        <p>Every card above 222, with its English twin. The highlighted row is the Chinese Exclusive.</p>
        <OriginsTable list={SECRET} />

        <BuyStrip />

        <h2 id="main-set">The 222-card main set</h2>
        <p>
          {count(MAIN, 'DRI')} main-set cards match Destined Rivals, {count(MAIN, 'JTG')} match Journey Together and{' '}
          {count(MAIN, 'ASC')} match Ascended Heroes.
        </p>
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
