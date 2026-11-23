import { chunk } from '~/lib/chunk'
import { Zh } from '~/components/blog/Zh'
import { rarityFullName } from '~/components/blog/RarityAbbr'
import { useId } from 'react'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/collect-151.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'collect-151-card-origins')!

type Src = 'SV2A' | 'SV4A' | 'NEW'

// Every Collect 151 card and the Japanese and English cards with the same
// illustration: [Chinese number, Japanese set, Japanese number, English
// number, illustrator]. Each card image was compared with every card in
// Japanese Pokémon Card 151 (SV2a) and Shiny Treasure ex (SV4a), and with
// English 151 and Paldean Fates; the illustrators are from TCGdex and agree
// with the Chinese cards. The four Pikachu Art Rares match none of them, and
// Pokémon China calls them new illustrations.
const ORIGINS: [string, Src, string, string, string][] = [
  ['001', 'SV2A', '001', '001', 'Yuu Nishida'],
  ['002', 'SV2A', '002', '002', 'Yuu Nishida'],
  ['003', 'SV2A', '003', '003', '5ban Graphics'],
  ['004', 'SV2A', '004', '004', 'GIDORA'],
  ['005', 'SV2A', '005', '005', 'GIDORA'],
  ['006', 'SV2A', '006', '006', 'PLANETA Mochizuki'],
  ['007', 'SV2A', '007', '007', 'kantaro'],
  ['008', 'SV2A', '008', '008', 'kantaro'],
  ['009', 'SV2A', '009', '009', 'PLANETA Yamashita'],
  ['010', 'SV2A', '010', '010', 'Tika Matsuno'],
  ['011', 'SV2A', '011', '011', 'Tika Matsuno'],
  ['012', 'SV2A', '012', '012', 'Tika Matsuno'],
  ['013', 'SV2A', '013', '013', 'nisimono'],
  ['014', 'SV2A', '014', '014', 'nisimono'],
  ['015', 'SV2A', '015', '015', 'nisimono'],
  ['016', 'SV2A', '016', '016', 'Oswaldo KATO'],
  ['017', 'SV2A', '017', '017', 'Oswaldo KATO'],
  ['018', 'SV2A', '018', '018', 'Oswaldo KATO'],
  ['019', 'SV2A', '019', '019', 'sowsow'],
  ['020', 'SV2A', '020', '020', 'sowsow'],
  ['021', 'SV2A', '021', '021', 'Gemi'],
  ['022', 'SV2A', '022', '022', 'Gemi'],
  ['023', 'SV2A', '023', '023', 'Kedamahadaitai Yawarakai'],
  ['024', 'SV2A', '024', '024', 'Eske Yoshinob'],
  ['025', 'SV2A', '025', '025', 'Naoyo Kimura'],
  ['026', 'SV2A', '026', '026', 'Naoyo Kimura'],
  ['027', 'SV2A', '027', '027', 'kodama'],
  ['028', 'SV2A', '028', '028', 'kodama'],
  ['029', 'SV2A', '029', '029', 'Teeziro'],
  ['030', 'SV2A', '030', '030', 'Teeziro'],
  ['031', 'SV2A', '031', '031', 'Teeziro'],
  ['032', 'SV2A', '032', '032', 'Shiburingaru'],
  ['033', 'SV2A', '033', '033', 'Shiburingaru'],
  ['034', 'SV2A', '034', '034', 'Shiburingaru'],
  ['035', 'SV2A', '035', '035', 'ryoma uratsuka'],
  ['036', 'SV2A', '036', '036', 'ryoma uratsuka'],
  ['037', 'SV2A', '037', '037', 'kawayoo'],
  ['038', 'SV2A', '038', '038', 'kawayoo'],
  ['039', 'SV2A', '039', '039', 'saino misaki'],
  ['040', 'SV2A', '040', '040', 'Saki Hayashiro'],
  ['041', 'SV2A', '041', '041', 'Scav'],
  ['042', 'SV2A', '042', '042', 'Scav'],
  ['043', 'SV2A', '043', '043', 'Sekio'],
  ['044', 'SV2A', '044', '044', 'Sekio'],
  ['045', 'SV2A', '045', '045', 'Sekio'],
  ['046', 'SV2A', '046', '046', 'Yoriyuki Ikegami'],
  ['047', 'SV2A', '047', '047', 'Yoriyuki Ikegami'],
  ['048', 'SV2A', '048', '048', 'Kagemaru Himeno'],
  ['049', 'SV2A', '049', '049', 'Kagemaru Himeno'],
  ['050', 'SV2A', '050', '050', 'Miki Tanaka'],
  ['051', 'SV2A', '051', '051', 'Miki Tanaka'],
  ['052', 'SV2A', '052', '052', 'Naoki Saito'],
  ['053', 'SV2A', '053', '053', 'Naoki Saito'],
  ['054', 'SV2A', '054', '054', 'Taira Akitsu'],
  ['055', 'SV2A', '055', '055', 'Taira Akitsu'],
  ['056', 'SV2A', '056', '056', 'Mina Nakai'],
  ['057', 'SV2A', '057', '057', 'Mina Nakai'],
  ['058', 'SV2A', '058', '058', 'Atsushi Furusawa'],
  ['059', 'SV2A', '059', '059', 'Atsushi Furusawa'],
  ['060', 'SV2A', '060', '060', 'Kurata So'],
  ['061', 'SV2A', '061', '061', 'Kurata So'],
  ['062', 'SV2A', '062', '062', 'Kurata So'],
  ['063', 'SV2A', '063', '063', 'Mitsuhiro Arita'],
  ['064', 'SV2A', '064', '064', 'Mitsuhiro Arita'],
  ['065', 'SV2A', '065', '065', 'Mitsuhiro Arita'],
  ['066', 'SV2A', '066', '066', 'Ryuta Fuse'],
  ['067', 'SV2A', '067', '067', 'Ryuta Fuse'],
  ['068', 'SV2A', '068', '068', 'Ryuta Fuse'],
  ['069', 'SV2A', '069', '069', 'Jerky'],
  ['070', 'SV2A', '070', '070', 'Jerky'],
  ['071', 'SV2A', '071', '071', 'Jerky'],
  ['072', 'SV2A', '072', '072', 'miki kudo'],
  ['073', 'SV2A', '073', '073', 'miki kudo'],
  ['074', 'SV2A', '074', '074', 'Uta'],
  ['075', 'SV2A', '075', '075', 'Uta'],
  ['076', 'SV2A', '076', '076', 'Uta'],
  ['077', 'SV2A', '077', '077', 'Nurikabe'],
  ['078', 'SV2A', '078', '078', 'Nurikabe'],
  ['079', 'SV2A', '079', '079', 'OKACHEKE'],
  ['080', 'SV2A', '080', '080', 'OKACHEKE'],
  ['081', 'SV2A', '081', '081', 'Yuka Morii'],
  ['082', 'SV2A', '082', '082', 'Yuka Morii'],
  ['083', 'SV2A', '083', '083', 'KG-2000'],
  ['084', 'SV2A', '084', '084', 'Anesaki Dynamic'],
  ['085', 'SV2A', '085', '085', 'Anesaki Dynamic'],
  ['086', 'SV2A', '086', '086', 'aoki'],
  ['087', 'SV2A', '087', '087', 'aoki'],
  ['088', 'SV2A', '088', '088', 'Nisota Niso'],
  ['089', 'SV2A', '089', '089', 'Nisota Niso'],
  ['090', 'SV2A', '090', '090', 'Nelnal'],
  ['091', 'SV2A', '091', '091', 'Nelnal'],
  ['092', 'SV2A', '092', '092', 'Tomokazu Komiya'],
  ['093', 'SV2A', '093', '093', 'Tomokazu Komiya'],
  ['094', 'SV2A', '094', '094', 'Tomokazu Komiya'],
  ['095', 'SV2A', '095', '095', 'Shin Nagasawa'],
  ['096', 'SV2A', '096', '096', 'Mousho'],
  ['097', 'SV2A', '097', '097', 'Mousho'],
  ['098', 'SV2A', '098', '098', 'Yukiko Baba'],
  ['099', 'SV2A', '099', '099', 'Yukiko Baba'],
  ['100', 'SV2A', '100', '100', 'nagimiso'],
  ['101', 'SV2A', '101', '101', 'nagimiso'],
  ['102', 'SV2A', '102', '102', 'Shigenori Negishi'],
  ['103', 'SV2A', '103', '103', 'Shigenori Negishi'],
  ['104', 'SV2A', '104', '104', 'Shinya Komatsu'],
  ['105', 'SV2A', '105', '105', 'Shinya Komatsu'],
  ['106', 'SV2A', '106', '106', 'Hitoshi Ariga'],
  ['107', 'SV2A', '107', '107', 'DOM'],
  ['108', 'SV2A', '108', '108', 'Saya Tsuruta'],
  ['109', 'SV2A', '109', '109', 'Shibuzoh.'],
  ['110', 'SV2A', '110', '110', 'Shibuzoh.'],
  ['111', 'SV2A', '111', '111', 'GOSSAN'],
  ['112', 'SV2A', '112', '112', 'GOSSAN'],
  ['113', 'SV2A', '113', '113', 'Taiga Kayama'],
  ['114', 'SV2A', '114', '114', 'Aya Kusube'],
  ['115', 'SV2A', '115', '115', 'N-DESIGN Inc.'],
  ['116', 'SV2A', '116', '116', 'aspara'],
  ['117', 'SV2A', '117', '117', 'aspara'],
  ['118', 'SV2A', '118', '118', 'SIE NANAHARA'],
  ['119', 'SV2A', '119', '119', 'SIE NANAHARA'],
  ['120', 'SV2A', '120', '120', 'Arai Kiriko'],
  ['121', 'SV2A', '121', '121', 'Arai Kiriko'],
  ['122', 'SV2A', '122', '122', 'OOYAMA'],
  ['123', 'SV2A', '123', '123', 'Hideki Ishikawa'],
  ['124', 'SV2A', '124', '124', 'Ayaka Yoshida'],
  ['125', 'SV2A', '125', '125', 'NC Empire'],
  ['126', 'SV2A', '126', '126', 'Toshinao Aoki'],
  ['127', 'SV2A', '127', '127', 'Yuya Oka'],
  ['128', 'SV2A', '128', '128', 'Takeshi Nakamura'],
  ['129', 'SV2A', '129', '129', 'Kouki Saitou'],
  ['130', 'SV2A', '130', '130', 'Kouki Saitou'],
  ['131', 'SV2A', '131', '131', 'LINNE'],
  ['132', 'SV2A', '132', '132', 'KIYOTAKA OSHIYAMA'],
  ['133', 'SV2A', '133', '133', 'Narumi Sato'],
  ['134', 'SV2A', '134', '134', 'kirisAki'],
  ['135', 'SV2A', '135', '135', 'sui'],
  ['136', 'SV2A', '136', '136', 'Ryota Murayama'],
  ['137', 'SV2A', '137', '137', '5ban Graphics'],
  ['138', 'SV2A', '138', '138', 'Akira Komayama'],
  ['139', 'SV2A', '139', '139', 'Akira Komayama'],
  ['140', 'SV2A', '140', '140', 'Souichirou Gunjima'],
  ['141', 'SV2A', '141', '141', 'Souichirou Gunjima'],
  ['142', 'SV2A', '142', '142', 'Shinji Kanda'],
  ['143', 'SV2A', '143', '143', 'HYOGONOSUKE'],
  ['144', 'SV2A', '144', '144', 'chibi'],
  ['145', 'SV2A', '145', '145', 'takuyoa'],
  ['146', 'SV2A', '146', '146', 'KEIICHIRO ITO'],
  ['147', 'SV2A', '147', '147', 'Sanosuke Sakuma'],
  ['148', 'SV2A', '148', '148', 'Sanosuke Sakuma'],
  ['149', 'SV2A', '149', '149', 'Sanosuke Sakuma'],
  ['150', 'SV2A', '150', '150', 'AKIRA EGAWA'],
  ['151', 'SV2A', '151', '151', 'aky CG Works'],
  ['152', 'SV4A', '210', '109', 'sowsow'],
  ['153', 'SV4A', '304', '196', 'sowsow'],
  ['154', 'SV4A', '305', '197', 'Kouki Saitou'],
  ['155', 'SV4A', '237', '132', 'Sanosuke Sakuma'],
  ['156', 'SV4A', '306', '198', 'Misa Tsutsui'],
  ['157', 'SV4A', '191', '092', 'otumami'],
  ['158', 'SV4A', '192', '093', 'OKACHEKE'],
  ['159', 'SV4A', '193', '094', '0313'],
  ['160', 'SV4A', '253', '148', 'Kouki Saitou'],
  ['161', 'SV4A', '254', '149', 'Souichirou Gunjima'],
  ['162', 'SV4A', '307', '199', 'Saya Tsuruta'],
  ['163', 'SV4A', '308', '200', 'nagimiso'],
  ['164', 'SV4A', '238', '133', 'Misa Tsutsui'],
  ['165', 'SV4A', '239', '134', 'Masakazu Fukuda'],
  ['166', 'SV4A', '221', '118', 'Nisota Niso'],
  ['167', 'SV4A', '222', '119', 'Shigenori Negishi'],
  ['168', 'SV4A', '309', '201', '0313'],
  ['169', 'SV4A', '310', '202', 'Shigenori Negishi'],
  ['170', 'NEW', '', '', 'Oswaldo KATO'],
  ['171', 'NEW', '', '', 'Oswaldo KATO'],
  ['172', 'NEW', '', '', 'Oswaldo KATO'],
  ['173', 'NEW', '', '', 'Oswaldo KATO'],
  ['174', 'SV2A', '184', '182', 'PLANETA Yamashita'],
  ['175', 'SV2A', '185', '183', 'PLANETA Mochizuki'],
  ['176', 'SV2A', '186', '184', 'PLANETA Yamashita'],
  ['177', 'SV2A', '187', '185', 'Eske Yoshinob'],
  ['178', 'SV2A', '188', '186', 'PLANETA Tsuji'],
  ['179', 'SV2A', '189', '187', 'Saki Hayashiro'],
  ['180', 'SV2A', '190', '188', 'PLANETA Tsuji'],
  ['181', 'SV2A', '191', '189', 'PLANETA Igarashi'],
  ['182', 'SV2A', '192', '190', 'N-DESIGN Inc.'],
  ['183', 'SV2A', '193', '191', 'Ayaka Yoshida'],
  ['184', 'SV2A', '194', '192', 'takuyoa'],
  ['185', 'SV2A', '195', '193', 'aky CG Works'],
  ['186', 'SV4A', '336', '222', 'Saki Hayashiro'],
  ['187', 'SV4A', '326', '215', 'PLANETA Tsuji'],
  ['188', 'SV4A', '327', '216', 'aky CG Works'],
  ['189', 'SV2A', '203', '201', 'Shinya Komatsu'],
  ['190', 'SV2A', '204', '202', 'Shiburingaru'],
  ['191', 'SV4A', '347', '232', 'USGMEN'],
  ['192', 'SV2A', '208', '205', 'aky CG Works'],
]

const JP_SET: Record<Src, string> = {
  SV2A: 'Pokémon Card 151 (SV2a)',
  SV4A: 'Shiny Treasure ex (SV4a)',
  NEW: 'New for Collect 151',
}
const JP_TOTAL: Record<Src, string> = { SV2A: '165', SV4A: '190', NEW: '' }
const EN_SET: Record<Src, string> = { SV2A: '151', SV4A: 'Paldean Fates', NEW: '' }
const EN_TOTAL: Record<Src, string> = { SV2A: '165', SV4A: '091', NEW: '' }

// Short rarity codes for the tables, with the two shiny rarities this set adds.
const RARITY: Record<string, string> = { ...RARITY_NAME, S: 'Shiny', SSR: 'Shiny Super Rare' }

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, jp, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, jp, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 151)
const SECRET = rows.filter((r) => +r.cn > 151)

const BY_TIER = (['C', 'U', 'R', 'RR', 'S', 'AR', 'SR', 'SSR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return { tier: t, sv2a: n('SV2A'), sv4a: n('SV4A'), fresh: n('NEW'), total: list.length }
})
const COUNT = (s: Src) => rows.filter((r) => r.src === s).length

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'not-in-chinese', label: 'What the Japanese set has that Collect 151 does not' },
  { id: 'secret-rares', label: 'All 41 secret rares' },
  { id: 'main-set', label: 'The 151-card main set' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which Japanese set is Collect 151?',
    a: 'Mostly Pokémon Card 151 (SV2a). 166 of its 192 cards match SV2a, including the whole main set. 22 match Shiny Treasure ex (SV4a), and 4 are new Pikachu Art Rares.',
  },
  {
    q: 'Which English set is Collect 151?',
    a: 'The same cards match English 151 (166 cards) and Paldean Fates (22 cards). The main set has the same numbers as English 151, 001 to 151.',
  },
  {
    q: 'Are the Collect 151 Shiny cards from Paldean Fates?',
    a: 'Yes. All 18 Shiny cards and the 3 Shiny Super Rares use the same illustrations as Japanese Shiny Treasure ex and English Paldean Fates.',
  },
  {
    q: 'Is the Collect 151 Mew ex Special Art Rare the same as the 151 one?',
    a: 'No. Mew ex 191/151 by USGMEN matches Shiny Treasure ex 347/190 and Paldean Fates 232/091, not the Mew ex Special Art Rare in Pokémon Card 151.',
  },
  {
    q: 'Which Collect 151 cards are new art?',
    a: 'The four Pikachu Art Rares, 170 to 173, by Oswaldo KATO. Pokémon China calls them new illustrations, and none of them matches a Japanese or English card.',
  },
  {
    q: 'Does Collect 151 have the Charizard ex Special Art Rare?',
    a: 'No. Pokémon Card 151 has Special Art Rares of Venusaur ex, Charizard ex and Blastoise ex, but Collect 151 does not. Its Special Art Rares are Alakazam ex, Zapdos ex and Mew ex.',
  },
]

export const Route = createFileRoute('/blog/collect-151-card-origins')({
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
  component: Collect151Origins,
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
            <th scope="col">Japanese card</th>
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
                  <span className="cell-sub">{RARITY[r.rarity] ?? r.rarity}</span>
                </td>
                {r.src === 'NEW' ? (
                  <td colSpan={2}>
                    <span className="cell-none">New art, not in Japanese or English</span>
                    <span className="cell-sub">Illus. {r.illus}</span>
                  </td>
                ) : (
                  <>
                    <td>
                      {JP_SET[r.src]} {r.jp}/{JP_TOTAL[r.src]}
                      <span className="cell-sub">Illus. {r.illus}</span>
                    </td>
                    <td>
                      {EN_SET[r.src]} {r.en}/{EN_TOTAL[r.src]}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

function Collect151Origins() {
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
  const pikachu = rows.filter((r) => r.src === 'NEW')
  const mew = rows.filter((r) => r.cn === '191' || r.cn === '188')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Collect 151 is mostly the Japanese Pokémon Card 151 set, with the Shiny cards from Shiny Treasure ex. We matched all 192 cards to their Japanese and English versions and found four new Pikachu Art Rares."
        cta={{
          heading: 'See every Collect 151 card',
          body: 'See every card on the full card list.',
          links: [{ to: '/sets/chinese/collect-151-surprise', label: 'See the full card list' }],
        }}
      >
        <p>
          Collect 151 (<Zh>收集啦151</Zh>, set code 151C) came out in four releases in 2025: Journey, Hope, Surprise and Gathering.
          All four share one 192-card list, so this guide covers them all. If you collect Japanese or English, 188 of the 192 cards
          will look familiar. {COUNT('SV2A')} match Japanese Pokémon Card 151 (SV2a), which is English 151, and {COUNT('SV4A')} match
          Japanese Shiny Treasure ex (SV4a), which is English Paldean Fates. The other {COUNT('NEW')} are new Pikachu Art Rares.
        </p>
        <p>
          Our <Link to="/blog/collect-151-set-guide">set guide</Link> shows which release has which card, and each release has its
          own post: <Link to="/blog/collect-151-journey-release-news">Journey</Link>,{' '}
          <Link to="/blog/collect-151-hope-release-news">Hope</Link>,{' '}
          <Link to="/blog/collect-151-surprise-release-news">Surprise</Link> and{' '}
          <Link to="/blog/collect-151-gathering-release-news">Gathering</Link>.
        </p>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
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
                <th scope="col">Pokémon Card 151 (English 151)</th>
                <th scope="col">Shiny Treasure ex (English Paldean Fates)</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{RARITY[t.tier] ?? t.tier}</th>
                  <td>{t.sv2a || '–'}</td>
                  <td>{t.sv4a || '–'}</td>
                  <td>{t.fresh || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Rarity is the Chinese rarity. Art Rare matches English Illustration Rare, Super Rare matches Ultra Rare, Special Art Rare
          matches Special Illustration Rare, and Ultra Rare matches the gold Hyper Rare. Shiny matches Shiny Rare, and Shiny Super Rare
          matches Shiny Ultra Rare.
        </p>

        <h2 id="patterns">Patterns worth knowing</h2>
        <p>
          <strong>The main set keeps its numbers.</strong> All 151 main-set cards match Pokémon Card 151 and English 151 at the same
          number, from Bulbasaur 001 to Mew ex 151. If you know the English set, you know where every Chinese main-set card sits.
        </p>
        <p>
          <strong>The Super Rares, two Special Art Rares and the gold Mew ex are also from Pokémon Card 151.</strong> The 12 Super
          Rares match SV2a 184 to 195 (English 182 to 193). The Alakazam ex and Zapdos ex Special Art Rares match SV2a 203 and 204, and
          the gold Mew ex 192/151 matches SV2a 208.
        </p>
        <p>
          <strong>The shiny cards are from Shiny Treasure ex.</strong> The 18 Shiny cards, 152 to 169, and the 3 Shiny Super Rares,
          186 to 188, use the Kanto Pokémon from Japanese Shiny Treasure ex, which English printed in Paldean Fates.
        </p>
        <p>
          <strong>The Mew ex Special Art Rare is the Shiny Treasure ex one.</strong> Mew ex 191/151 by USGMEN, a Surprise card,
          matches Shiny Treasure ex 347/190 and Paldean Fates 232/091. The Mew ex Special Art Rare from Pokémon Card 151 is not in
          Collect 151. The Shiny Super Rare Mew ex 188/151 is from Shiny Treasure ex too.
        </p>
        <ul className="card-grid cols-2">
          {mew.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/151 ${rarityFullName(r.rarity)}, Collect 151`} loading="lazy" width={300} height={418} />
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.cn}/151 · {RARITY[r.rarity] ?? r.rarity} · Shiny Treasure ex {r.jp}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          <strong>Four cards are new.</strong> The Pikachu Art Rares, one per release, are by Oswaldo KATO and do not match any
          Japanese or English card. Pokémon China calls them new illustrations.
        </p>
        <ul className="card-grid cols-4">
          {pikachu.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/151 Art Rare, Collect 151`} loading="lazy" width={300} height={418} />
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.cn}/151 · New art
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="not-in-chinese">What the Japanese set has that Collect 151 does not</h2>
        <p>
          Collect 151 is smaller than Pokémon Card 151: 192 cards against 210. It has no Trainer or Energy cards at all, so the 14
          Trainers from SV2a 152 to 165 and their full arts are not in it, and neither are the gold Switch and Basic Psychic Energy. It
          also leaves out all 18 SV2a Art Rares, from Bulbasaur to Mewtwo, and the Venusaur ex, Charizard ex, Blastoise ex and Mew ex
          Special Art Rares. In their place it has the four Pikachu Art Rares and the shiny cards from Shiny Treasure ex.
        </p>

        <h2 id="secret-rares">All 41 secret rares</h2>
        <p>This table lists every card above 151 with the Japanese and English cards it matches. The highlighted rows are new art.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the Japanese and English cards each one matches" />

        <BuyStrip />

        <h2 id="main-set">The 151-card main set</h2>
        <p>Every main-set card matches Pokémon Card 151 and English 151 at the same number.</p>
        <OriginsTable list={MAIN} caption="Main set cards and the Japanese and English cards each one matches" />

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
