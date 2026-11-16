import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/white-flare.json'

const post = BLOG_POSTS.find((p) => p.slug === 'white-flare-card-origins')!

type Src = 'BLK' | 'WHT' | 'SVP' | 'NEW'

// Every White Flare card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list English White Flare.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'WHT', '001/086', "Oswaldo KATO"],
  ['002', 'WHT', '002/086', "Oswaldo KATO"],
  ['003', 'WHT', '003/086', "Oswaldo KATO"],
  ['004', 'WHT', '004/086', "sui"],
  ['005', 'WHT', '005/086', "5ban Graphics"],
  ['006', 'WHT', '006/086', "Narano"],
  ['007', 'WHT', '007/086', "Narano"],
  ['008', 'WHT', '008/086', "Saboteri"],
  ['009', 'WHT', '009/086', "Saboteri"],
  ['010', 'WHT', '010/086', "Felicia Chen"],
  ['011', 'WHT', '011/086', "Teeziro"],
  ['012', 'WHT', '012/086', "Teeziro"],
  ['013', 'WHT', '013/086', "Teeziro"],
  ['014', 'WHT', '014/086', "Julie Hang"],
  ['015', 'WHT', '015/086', "Julie Hang"],
  ['016', 'WHT', '019/086', "Minahamu"],
  ['017', 'WHT', '020/086', "5ban Graphics"],
  ['018', 'WHT', '021/086', "rika"],
  ['019', 'WHT', '022/086', "rika"],
  ['020', 'WHT', '023/086', "rika"],
  ['021', 'WHT', '024/086', "KEIICHIRO ITO"],
  ['022', 'WHT', '025/086', "Mizue"],
  ['023', 'WHT', '026/086', "Mizue"],
  ['024', 'WHT', '027/086', "cochi8i"],
  ['025', 'WHT', '028/086', "cochi8i"],
  ['026', 'WHT', '029/086', "cochi8i"],
  ['027', 'WHT', '030/086', "PLANETA Yamashita"],
  ['028', 'WHT', '031/086', "Mugi Hamada"],
  ['029', 'WHT', '032/086', "Mugi Hamada"],
  ['030', 'WHT', '033/086', "Shimaris Yukichi"],
  ['031', 'WHT', '034/086', "Shimaris Yukichi"],
  ['032', 'WHT', '035/086', "Yuya Oka"],
  ['033', 'WHT', '036/086', "Wintr Wandr"],
  ['034', 'WHT', '037/086', "Wintr Wandr"],
  ['035', 'WHT', '038/086', "Krgc"],
  ['036', 'WHT', '039/086', "Bun Toujo"],
  ['037', 'WHT', '040/086', "Bun Toujo"],
  ['038', 'WHT', '041/086', "Mousho"],
  ['039', 'WHT', '042/086', "Mousho"],
  ['040', 'WHT', '043/086', "Mousho"],
  ['041', 'WHT', '044/086', "MARINA Chikazawa"],
  ['042', 'WHT', '045/086', "PLANETA Igarashi"],
  ['043', 'WHT', '046/086', "Anesaki Dynamic"],
  ['044', 'WHT', '047/086', "Anesaki Dynamic"],
  ['045', 'WHT', '048/086', "Anesaki Dynamic"],
  ['046', 'WHT', '049/086', "Dsuke"],
  ['047', 'WHT', '050/086', "Haru Akasaka"],
  ['048', 'WHT', '051/086', "Haru Akasaka"],
  ['049', 'WHT', '052/086', "Keisin"],
  ['050', 'WHT', '053/086', "Keisin"],
  ['051', 'WHT', '054/086', "Tonji Matsuno"],
  ['052', 'WHT', '055/086', "Yuu Nishida"],
  ['053', 'WHT', '056/086', "Yuu Nishida"],
  ['054', 'WHT', '057/086', "osare"],
  ['055', 'WHT', '058/086', "osare"],
  ['056', 'WHT', '059/086', "OKUBO"],
  ['057', 'WHT', '060/086', "OKUBO"],
  ['058', 'WHT', '061/086', "akagi"],
  ['059', 'WHT', '062/086', "akagi"],
  ['060', 'WHT', '065/086', "kodama"],
  ['061', 'WHT', '066/086', "kodama"],
  ['062', 'WHT', '067/086', "5ban Graphics"],
  ['063', 'WHT', '068/086', "Hasuno"],
  ['064', 'WHT', '069/086', "Hasuno"],
  ['065', 'BLK', '061/086', "Amelicart"],
  ['066', 'BLK', '062/086', "Amelicart"],
  ['067', 'BLK', '063/086', "Amelicart"],
  ['068', 'WHT', '070/086', "Yuka Morii"],
  ['069', 'WHT', '071/086', "Nurikabe"],
  ['070', 'WHT', '072/086', "Ounishi"],
  ['071', 'WHT', '073/086', "Ounishi"],
  ['072', 'WHT', '074/086', "sowsow"],
  ['073', 'WHT', '075/086', "sowsow"],
  ['074', 'WHT', '076/086', "sowsow"],
  ['075', 'WHT', '077/086', "PLANETA Tsuji"],
  ['076', 'BLK', '077/086', "Kedamahadaitai Yawarakai"],
  ['077', 'BLK', '078/086', "Kedamahadaitai Yawarakai"],
  ['078', 'WHT', '078/086', "Nisota Niso"],
  ['079', 'WHT', '082/086', "Studio Bora Inc."],
  ['080', 'WHT', '085/086', "Studio Bora Inc."],
  ['081', 'WHT', '079/086', "AYUMI ODASHIMA"],
  ['082', 'WHT', '080/086', "Toyste Beach"],
  ['083', 'WHT', '083/086', "Teeziro"],
  ['084', 'WHT', '081/086', "Atsushi Furusawa"],
  ['085', 'WHT', '084/086', "yuu"],
  ['086', 'WHT', '086/086', ""],
  ['087', 'WHT', '087/086', "nisimono"],
  ['088', 'WHT', '088/086', "0313"],
  ['089', 'WHT', '089/086', "mashu"],
  ['090', 'WHT', '090/086', "Keisin"],
  ['091', 'WHT', '091/086', "takashi shiraishi"],
  ['092', 'WHT', '092/086', "Yano Keiji"],
  ['093', 'WHT', '093/086', "M\u00e9kayu"],
  ['094', 'WHT', '094/086', "Taiga Kasai"],
  ['095', 'WHT', '095/086', "kodama"],
  ['096', 'WHT', '096/086', "Orca"],
  ['097', 'WHT', '097/086', "Masa"],
  ['098', 'WHT', '098/086', "NC Empire"],
  ['099', 'WHT', '099/086', "GOTO minori"],
  ['100', 'WHT', '100/086', "sowsow"],
  ['101', 'WHT', '104/086', "Kariya"],
  ['102', 'WHT', '105/086', "OKACHEKE"],
  ['103', 'WHT', '106/086', "Taira Akitsu"],
  ['104', 'WHT', '107/086', "DOM"],
  ['105', 'WHT', '108/086', "Nakamura Ippan"],
  ['106', 'WHT', '109/086', "GIDORA"],
  ['107', 'WHT', '110/086', "Gemi"],
  ['108', 'WHT', '111/086', "Mina Nakai"],
  ['109', 'WHT', '112/086', "Yoko Hishida"],
  ['110', 'WHT', '113/086', "aoki"],
  ['111', 'WHT', '114/086', "Natsumi Miyanose"],
  ['112', 'WHT', '115/086', "REND"],
  ['113', 'WHT', '116/086', "HYOGONOSUKE"],
  ['114', 'WHT', '117/086', "Akira Komayama"],
  ['115', 'WHT', '118/086', "Toshinao Aoki"],
  ['116', 'WHT', '119/086', "Shibuzoh."],
  ['117', 'WHT', '120/086', "Saboteri"],
  ['118', 'WHT', '121/086', "mingo"],
  ['119', 'WHT', '122/086', "YASHIRO Nanaco"],
  ['120', 'WHT', '123/086', "Haru Akasaka"],
  ['121', 'WHT', '124/086', "Kanami Ogata"],
  ['122', 'WHT', '125/086', "Terada Tera"],
  ['123', 'SVP', '211', "IKEDA Saki"],
  ['124', 'WHT', '126/086', "Shinya Komatsu"],
  ['125', 'WHT', '127/086', "Yuriko Akase"],
  ['126', 'WHT', '128/086', "Krgc"],
  ['127', 'WHT', '129/086', "toi8"],
  ['128', 'WHT', '130/086', "nagimiso"],
  ['129', 'WHT', '131/086', "Ounishi"],
  ['130', 'WHT', '132/086', "Jerky"],
  ['131', 'WHT', '133/086', "Iori Suzuki"],
  ['132', 'WHT', '134/086', "Atsuya Uki"],
  ['133', 'WHT', '135/086', "Shiburingaru"],
  ['134', 'WHT', '136/086', "Mugi Hamada"],
  ['135', 'WHT', '137/086', "matazo"],
  ['136', 'WHT', '138/086', "Nelnal"],
  ['137', 'WHT', '139/086', "Tetsu Kayama"],
  ['138', 'WHT', '140/086', "Oswaldo KATO"],
  ['139', 'WHT', '141/086', "Gapao"],
  ['140', 'WHT', '142/086', "Naoki Saito"],
  ['141', 'WHT', '143/086', "Iwamoto05"],
  ['142', 'WHT', '146/086', "Teeziro"],
  ['143', 'WHT', '147/086', "Kyoko Umemoto"],
  ['144', 'WHT', '148/086', "Nurikabe"],
  ['145', 'WHT', '149/086', "Minahamu"],
  ['146', 'BLK', '139/086', "Nobuhiro Imagawa"],
  ['147', 'BLK', '140/086', "okawamatakatoshi"],
  ['148', 'BLK', '141/086', "Yuka Morii"],
  ['149', 'WHT', '150/086', "Scav"],
  ['150', 'WHT', '151/086', "Kamome Shirahama"],
  ['151', 'WHT', '152/086', "Yukihiro Tada"],
  ['152', 'WHT', '153/086', "Mousho"],
  ['153', 'WHT', '154/086', "Narumi Sato"],
  ['154', 'WHT', '155/086', "Makura Tami"],
  ['155', 'WHT', '156/086', "Eri Kamei"],
  ['156', 'BLK', '154/086', "Miki Tanaka"],
  ['157', 'BLK', '155/086', "kamonabe"],
  ['158', 'SVP', '210', "Kouki Saitou"],
  ['159', 'WHT', '157/086', "5ban Graphics"],
  ['160', 'WHT', '158/086', "5ban Graphics"],
  ['161', 'WHT', '159/086', "N-DESIGN Inc."],
  ['162', 'WHT', '160/086', "N-DESIGN Inc."],
  ['163', 'WHT', '161/086', "5ban Graphics"],
  ['164', 'WHT', '162/086', "N-DESIGN Inc."],
  ['165', 'WHT', '163/086', "Teeziro"],
  ['166', 'WHT', '164/086', "yuu"],
  ['167', 'WHT', '165/086', "mele"],
  ['168', 'WHT', '166/086', "kawayoo"],
  ['169', 'WHT', '167/086', "Yuu Nishida"],
  ['170', 'WHT', '168/086', "Narano"],
  ['171', 'WHT', '169/086', "Takumi Wada"],
  ['172', 'WHT', '170/086', "Rianti Hidayat"],
  ['173', 'NEW', '', "Ligton"],
  ['174', 'WHT', '173/086', "5ban Graphics"],
]

const SET_NAME: Record<Src, string> = {
  BLK: 'Black Bolt',
  WHT: 'White Flare',
  SVP: 'SV Black Star Promo',
  NEW: 'New for White Flare',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 86)
const SECRET = rows.filter((r) => +r.cn > 86)

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'BWR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return { tier: t, blk: n('BLK'), wht: n('WHT'), svp: n('SVP'), fresh: n('NEW'), total: list.length }
})
const count = (s: Src) => rows.filter((r) => r.src === s).length

const PROMOS = rows.filter((r) => r.src === 'SVP')
const SWAPPED = rows.filter((r) => r.src === 'BLK')
const HILDA = rows.filter((r) => r.name === 'Hilda' && +r.cn > 86).reverse()

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'patterns', label: 'What is different from English' },
  { id: 'secret-rares', label: 'All 88 secret rares' },
  { id: 'main-set', label: 'The 86-card main set' },
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Is Chinese White Flare the same as English White Flare?',
    a: 'Mostly. 161 of its 174 cards match English White Flare. Ten match English Black Bolt, two Art Rares match English Black Star Promos, and one card, the Hilda Special Art Rare, is new.',
  },
  {
    q: 'Which White Flare card has no English version?',
    a: "Hilda 173/086, the Special Art Rare by Ligton. It is the set's Chinese exclusive.",
  },
  {
    q: 'Where are Litwick and Vullaby?',
    a: 'In Chinese Black Bolt. English White Flare has Litwick, Lampent, Chandelure, Vullaby and Mandibuzz, but the Chinese release moved them to Black Bolt and brought in Klink, Klang, Klinklang, Rufflet and Braviary from English Black Bolt.',
  },
  {
    q: 'Is the Reshiram ex Black White Rare the same as in English?',
    a: 'Yes. 174/086 matches English White Flare 173/086 by 5ban Graphics. English White Flare also has a Victini Black White Rare, which is not in the Chinese set.',
  },
]

export const Route = createFileRoute('/blog/white-flare-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${post.title} | EBI Collectibles` },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
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
  component: WhiteFlareOrigins,
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

function WhiteFlareOrigins() {
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
    publisher: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
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
        lede="Chinese White Flare is close to English White Flare, with a few differences. We matched all 174 cards to English, including the ones borrowed from Black Bolt and the one card English never printed."
        cta={{
          heading: 'Collect White Flare',
          body: 'See every card on the full checklist, or pick up a box.',
          links: [
            { to: '/sets/chinese/white-flare-csv10-6', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-white-flare-jumbo-booster-box' }, label: 'Shop the jumbo box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          {count('WHT')} of White Flare's 174 cards match English White Flare. The other {174 - count('WHT')} are where it gets
          interesting: {count('BLK')} match English Black Bolt, {count('SVP')} Art Rares match English Black Star Promos, and one card is
          new, the Chinese-exclusive Hilda Special Art Rare. For the chase cards and box odds, see our{' '}
          <Link to="/blog/white-flare-set-guide">set guide</Link>.
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
                <th scope="col">English White Flare</th>
                <th scope="col">English Black Bolt</th>
                <th scope="col">Promo</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
                  <td>{t.wht || '–'}</td>
                  <td>{t.blk || '–'}</td>
                  <td>{t.svp || '–'}</td>
                  <td>{t.fresh || '–'}</td>
                  <td>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Rarity is the Chinese rarity. Art Rare matches English Illustration Rare, Super Rare matches Ultra Rare, and Special Art Rare
          matches Special Illustration Rare. Black White Rare has the same name in both.
        </p>

        <h2 id="patterns">What is different from English</h2>
        <p>
          <strong>Five Pokémon swapped sets.</strong> In English, Klink, Klang, Klinklang, Rufflet and Braviary are Black Bolt cards. In
          Chinese they are in White Flare, along with their Art Rares, which is where the {count('BLK')} Black Bolt matches come from. Going
          the other way, English White Flare's Litwick, Lampent, Chandelure, Vullaby and Mandibuzz are in Chinese Black Bolt. The art is
          unchanged, only the set is different, so check the right set when you look these up.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">White Flare card</th>
                <th scope="col">English Black Bolt</th>
              </tr>
            </thead>
            <tbody>
              {SWAPPED.map((r) => (
                <tr key={r.cn}>
                  <th scope="row">
                    {r.cn} {r.name} ({r.rarity})
                  </th>
                  <td>{r.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Every non-ex Pokémon gets an Art Rare.</strong> English White Flare has no Illustration Rare of Gothitelle or
          Tornadus. The Chinese set gives both an Art Rare, and each uses art that English released as an SV Black Star Promo:
        </p>
        <div className="card-grid cols-2">
          {PROMOS.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/086 Art Rare, White Flare`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{r.name}</strong>
                {r.cn}/086 · SVP {r.en} · {r.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>One new card, two English cards left out.</strong> The Hilda Special Art Rare 173/086 by Ligton has no English version.
          English White Flare's own Hilda Special Illustration Rare (171/086 by Naoki Saito) is not in the Chinese set, and neither is its
          Victini Black White Rare (172/086), so Reshiram ex is the only Black White Rare here. The Hilda Super Rare is the same art as in
          English.
        </p>
        <div className="card-grid cols-2">
          {HILDA.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/086 ${r.rarity}, White Flare`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>
                  {r.name} {r.rarity}
                </strong>
                {r.cn}/086 · {r.src === 'NEW' ? 'new art' : `White Flare ${r.en}`} · {r.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>The Reshiram ex cards match English.</strong> The Super Rare 160/086, the Special Art Rare 168/086 and the Black White
          Rare 174/086 are the same art as English White Flare 158, 166 and 173.
        </p>

        <h2 id="secret-rares">All 88 secret rares</h2>
        <p>Every card above 086, with its English twin. The highlighted row is new.</p>
        <OriginsTable list={SECRET} />

        <h2 id="main-set">The 86-card main set</h2>
        <OriginsTable list={MAIN} />

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          Names alone were not enough, since several of these Pokémon have more than one English art. We compared each Chinese card's art
          with every English printing of the same name from Scarlet & Violet onward, then checked the close calls and every card without a
          match by eye. Where the same art was printed more than once, as with a few reprinted cards, we list the English White Flare
          printing.
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
