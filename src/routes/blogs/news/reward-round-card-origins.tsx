import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import setData from '~/data/csv4.json'

const post = BLOG_POSTS.find((p) => p.slug === 'reward-round-card-origins')!

type Src = 'OBF' | 'PAL' | 'PAR' | 'SVI' | 'PAF' | 'MEW' | 'SCR' | 'TWM' | 'SVP' | 'NEW'

// Every Reward Round card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// art was compared with every English printing of the same name; where the
// same art was printed more than once we list the first set it appeared in.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'OBF', '004/197', "Shin Nagasawa"],
  ['002', 'SVI', '011/198', "Tika Matsuno"],
  ['003', 'SVI', '012/198', "Gemi"],
  ['004', 'SVI', '018/198', "Kouki Saitou"],
  ['005', 'SVP', '009', "Anesaki Dynamic"],
  ['006', 'OBF', '019/197', "Masako Tomii"],
  ['007', 'OBF', '020/197', "Mizue"],
  ['008', 'OBF', '021/197', "KEIICHIRO ITO"],
  ['009', 'PAL', '023/193', "Miki Tanaka"],
  ['010', 'PAL', '024/193', "KEIICHIRO ITO"],
  ['011', 'OBF', '024/197', "Pani Kobayashi"],
  ['012', 'OBF', '025/197', "kodama"],
  ['013', 'PAL', '026/193', "Anesaki Dynamic"],
  ['014', 'OBF', '028/197', "0313"],
  ['015', 'OBF', '029/197', "Yoshioka"],
  ['016', 'OBF', '030/197', "toriyufu"],
  ['017', 'PAF', '011/91', "Mina Nakai"],
  ['018', 'PAF', '012/91', "satoma"],
  ['019', 'PAR', '025/182', "kantaro"],
  ['020', 'SVI', '046/198', "Mizue"],
  ['021', 'SVI', '047/198', "Gemi"],
  ['022', 'OBF', '053/197', "Mizue"],
  ['023', 'OBF', '054/197', "Misa Tsutsui"],
  ['024', 'OBF', '055/197', "kirisAki"],
  ['025', 'PAR', '048/182', "sowsow"],
  ['026', 'PAR', '050/182', "N-DESIGN Inc."],
  ['027', 'OBF', '058/197', "Pani Kobayashi"],
  ['028', 'OBF', '059/197', "Akira Komayama"],
  ['029', 'OBF', '060/197', "kodama"],
  ['030', 'OBF', '062/197', "Souichirou Gunjima"],
  ['031', 'PAL', '056/193', "Anesaki Dynamic"],
  ['032', 'PAR', '068/182', "hncl"],
  ['033', 'OBF', '071/197', "AKIRA EGAWA"],
  ['034', 'OBF', '072/197', "Anesaki Dynamic"],
  ['035', 'PAL', '072/193', "Yuka Morii"],
  ['036', 'PAL', '074/193', "sowsow"],
  ['037', 'PAL', '075/193', "Hitoshi Ariga"],
  ['038', 'PAL', '076/193', "kodama"],
  ['039', 'OBF', '073/197', "aky CG Works"],
  ['040', 'OBF', '074/197', "kirisAki"],
  ['041', 'OBF', '077/197', "Kouki Saitou"],
  ['042', 'PAL', '085/193', "sowsow"],
  ['043', 'PAL', '086/193', "5ban Graphics"],
  ['044', 'OBF', '080/197', "kurumitsu"],
  ['045', 'OBF', '083/197', "Natsumi Yoshida"],
  ['046', 'OBF', '084/197', "Kyoko Umemoto"],
  ['047', 'OBF', '085/197', "Cona Nitanda"],
  ['048', 'OBF', '086/197', "Cona Nitanda"],
  ['049', 'OBF', '087/197', "Sekio"],
  ['050', 'OBF', '088/197', "Lee HyunJung"],
  ['051', 'OBF', '092/197', "Tetsu Kayama"],
  ['052', 'OBF', '093/197', "Tetsu Kayama"],
  ['053', 'OBF', '094/197', "Scav"],
  ['054', 'OBF', '095/197', "Shigenori Negishi"],
  ['055', 'PAF', '034/91', "kurumitsu"],
  ['056', 'PAF', '035/91', "KYUPIYAMA"],
  ['057', 'PAF', '036/91', "Tika Matsuno"],
  ['058', 'PAL', '093/193', "aky CG Works"],
  ['059', 'PAL', '098/193', "Ryota Murayama"],
  ['060', 'PAL', '099/193', "Oswaldo KATO"],
  ['061', 'OBF', '099/197', "Shibuzoh."],
  ['062', 'OBF', '102/197', "5ban Graphics"],
  ['063', 'PAR', '088/182', "Kouki Saitou"],
  ['064', 'PAL', '106/193', "kurumitsu"],
  ['065', 'PAL', '107/193', "Shin Nagasawa"],
  ['066', 'SVP', '032', "PLANETA Hiiragi"],
  ['067', 'PAL', '110/193', "Haru Akasaka"],
  ['068', 'PAL', '111/193', "Shigenori Negishi"],
  ['069', 'OBF', '116/197', "Jerky"],
  ['070', 'OBF', '117/197', "Mitsuhiro Arita"],
  ['071', 'PAL', '119/193', "kurumitsu"],
  ['072', 'PAL', '121/193', "Shin Nagasawa"],
  ['073', 'PAL', '122/193', "GIDORA"],
  ['074', 'PAL', '123/193', "Anesaki Dynamic"],
  ['075', 'SCR', '089/142', "5ban Graphics"],
  ['076', 'OBF', '130/197', "rika"],
  ['077', 'PAL', '135/193', "hncl"],
  ['078', 'PAL', '141/193', "DOM"],
  ['079', 'PAL', '143/193', "Souichirou Gunjima"],
  ['080', 'PAL', '147/193', "Sekio"],
  ['081', 'OBF', '141/197', "otumami"],
  ['082', 'OBF', '143/197', "sowsow"],
  ['083', 'PAR', '130/182', "aoki"],
  ['084', 'PAR', '132/182', "Bun Toujo"],
  ['085', 'PAR', '134/182', "Jiro Sasumo"],
  ['086', 'OBF', '151/197', "Sekio"],
  ['087', 'OBF', '154/197', "Kouki Saitou"],
  ['088', 'OBF', '156/197', "takuyoa"],
  ['089', 'PAR', '139/182', "takuyoa"],
  ['090', 'OBF', '157/197', "satoma"],
  ['091', 'OBF', '158/197', "Misa Tsutsui"],
  ['092', 'OBF', '159/197', "5ban Graphics"],
  ['093', 'OBF', '160/197', "kurumitsu"],
  ['094', 'PAL', '152/193', "chibi"],
  ['095', 'PAL', '153/193', "Nisota Niso"],
  ['096', 'OBF', '161/197', "hatachu"],
  ['097', 'PAF', '070/91', "GIDORA"],
  ['098', 'PAR', '141/182', "Shibuzoh."],
  ['099', 'OBF', '162/197', "Naoyo Kimura"],
  ['100', 'OBF', '163/197', "Kariya"],
  ['101', 'OBF', '164/197', "takuyoa"],
  ['102', 'OBF', '165/197', "Yuya Oka"],
  ['103', 'OBF', '166/197', "ryoma uratsuka"],
  ['104', 'OBF', '169/197', "Oswaldo KATO"],
  ['105', 'SVI', '146/198', "Yuya Oka"],
  ['106', 'OBF', '170/197', "Yuka Morii"],
  ['107', 'OBF', '171/197', "Kariya"],
  ['108', 'OBF', '172/197', "Keisin"],
  ['109', 'OBF', '173/197', "Tika Matsuno"],
  ['110', 'OBF', '182/197', "Atsuko Nishida"],
  ['111', 'OBF', '183/197', "Pani Kobayashi"],
  ['112', 'PAL', '166/193', "Oswaldo KATO"],
  ['113', 'PAL', '168/193', "Saya Tsuruta"],
  ['114', 'PAR', '155/182', "5ban Graphics"],
  ['115', 'SVI', '171/198', "Studio Bora Inc."],
  ['116', 'PAL', '178/193', "inose yukie"],
  ['117', 'PAR', '166/182', "Toyste Beach"],
  ['118', 'PAR', '162/182', "Ayaka Yoshida"],
  ['119', 'PAR', '179/182', "Studio Bora Inc."],
  ['120', 'PAR', '176/182', "Studio Bora Inc."],
  ['121', 'OBF', '190/197', "Naoki Saito"],
  ['122', 'PAR', '172/182', "GIDORA"],
  ['123', 'MEW', '158/165', "Tomomi Kaneko"],
  ['124', 'PAR', '169/182', "Cona Nitanda"],
  ['125', 'PAL', '172/193', "NC Empire"],
  ['126', 'TWM', '161/167', "hncl"],
  ['127', 'SVI', '167/198', "Oswaldo KATO"],
  ['128', 'PAL', '186/193', "AYUMI ODASHIMA"],
  ['129', 'PAL', '190/193', ""],
  ['130', 'PAL', '198/193', "sowsow"],
  ['131', 'PAR', '191/182', "Oku"],
  ['132', 'OBF', '200/197', "Akira Komayama"],
  ['133', 'PAR', '198/182', "Akira Komayama"],
  ['134', 'PAL', '220/193', "Ryota Murayama"],
  ['135', 'OBF', '206/197', "Souichirou Gunjima"],
  ['136', 'OBF', '207/197', "Jerky"],
  ['137', 'OBF', '208/197', "Jerky"],
  ['138', 'PAR', '221/182', "N-DESIGN Inc."],
  ['139', 'PAR', '222/182', "PLANETA Igarashi"],
  ['140', 'PAL', '238/193', "5ban Graphics"],
  ['141', 'PAL', '239/193', "aky CG Works"],
  ['142', 'PAL', '242/193', "PLANETA Hiiragi"],
  ['143', 'OBF', '216/197', "takuyoa"],
  ['144', 'PAR', '231/182', "takuyoa"],
  ['145', 'PAL', '246/193', "Eske Yoshinob"],
  ['146', 'OBF', '217/197', "takuyoa"],
  ['147', 'PAR', '233/182', "5ban Graphics"],
  ['148', 'OBF', '219/197', "Naoki Saito"],
  ['149', 'PAR', '241/182', "GIDORA"],
  ['150', 'MEW', '195/165', "Fumie Kittaka"],
  ['151', 'PAR', '238/182', "Cona Nitanda"],
  ['152', 'PAL', '248/193', "Hideki Ishikawa"],
  ['153', 'PAR', '246/182', "Oku"],
  ['154', 'PAR', '247/182', "Jerky"],
  ['155', 'OBF', '224/197', "Souichirou Gunjima"],
  ['156', 'PAR', '252/182', "Akira Komayama"],
  ['157', 'OBF', '225/197', "Jerky"],
  ['158', 'NEW', '', "Yoshimi Miyoshi"],
  ['159', 'NEW', '', "kantaro"],
  ['160', 'PAR', '255/182', "En Morikura"],
  ['161', 'PAL', '265/193', "hncl"],
  ['162', 'NEW', '', "5ban Graphics"],
  ['163', 'SVI', '255/198', "Toyste Beach"],
  ['164', 'PAR', '265/182', "Toyste Beach"],
  ['165', 'PAR', '263/182', "Oswaldo KATO"],
]

const SET_NAME: Record<Src, string> = {
  OBF: 'Obsidian Flames',
  PAL: 'Paldea Evolved',
  PAR: 'Paradox Rift',
  SVI: 'Scarlet & Violet',
  PAF: 'Paldean Fates',
  MEW: '151',
  SCR: 'Stellar Crown',
  TWM: 'Twilight Masquerade',
  SVP: 'SV Black Star Promo',
  NEW: 'New for Reward Round',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 129)
const SECRET = rows.filter((r) => +r.cn > 129)
const BIG3: Src[] = ['OBF', 'PAL', 'PAR']

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    obf: n('OBF'),
    pal: n('PAL'),
    par: n('PAR'),
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
  { id: 'secret-rares', label: 'All 36 secret rares' },
  { id: 'main-set', label: 'The 129-card main set' },
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Reward Round?',
    a: 'There is no single one. Most of its cards match Obsidian Flames (69), Paldea Evolved (41) and Paradox Rift (31), with the rest from six other English sources and three new arts.',
  },
  {
    q: 'Which Reward Round cards have no English version?',
    a: 'The gold Gholdengo ex Ultra Rare 162/129 by 5ban Graphics, the Maushold ex Special Art Rare 158/129 by Yoshimi Miyoshi, and the Rika Special Art Rare 159/129 by kantaro.',
  },
  {
    q: 'Is the Gholdengo ex Special Art Rare the same as in English?',
    a: 'Yes. 156/129 matches Paradox Rift 252/182 by Akira Komayama. Only the gold Ultra Rare is new.',
  },
  {
    q: 'Are any Reward Round cards English promos?',
    a: 'Two: Spidops 005/129 matches SVP 009 and Annihilape ex 066/129 matches SVP 032.',
  },
]

export const Route = createFileRoute('/blogs/news/reward-round-card-origins')({
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
  component: RewardRoundOrigins,
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

function RewardRoundOrigins() {
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        wide
        post={post}
        lede="Reward Round mixes cards from several English sets into one. Here is where each of its 165 cards lines up in English, and the three that English never printed."
        cta={{
          heading: 'Collect Reward Round',
          body: 'See every card on the full checklist, or pick up a slim box.',
          links: [
            { to: '/sets/csv4', label: 'Browse the card list' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-reward-round-booster-box' }, label: 'Shop the slim box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Unlike the later Chinese sets, Reward Round does not follow one English set. Its 165 cards pull mostly from Obsidian Flames,
          Paldea Evolved and Paradox Rift, with a handful from other Scarlet & Violet sets and promos, plus three new arts. For the chase
          cards and box odds, see our <Link to="/blogs/news/reward-round-set-guide">set guide</Link>.
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
                <th scope="col">Obsidian Flames</th>
                <th scope="col">Paldea Evolved</th>
                <th scope="col">Paradox Rift</th>
                <th scope="col">Other</th>
                <th scope="col">New</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIER.map((t) => (
                <tr key={t.tier}>
                  <th scope="row">{t.tier}</th>
                  <td>{t.obf || '–'}</td>
                  <td>{t.pal || '–'}</td>
                  <td>{t.par || '–'}</td>
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
          <strong>Three sets do most of the work.</strong> Every card's English source, from most cards to fewest:
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
          <strong>The chase cards come from the same three sets.</strong> Gholdengo ex, Maushold ex, Golisopod ex and Tapu Koko ex
          match Paradox Rift, Pidgeot ex and Revavroom ex match Obsidian Flames, and Slowking ex, Dedenne ex and Boss's Orders match
          Paldea Evolved. The exceptions are the Daisy's Help Super Rare, which matches 151, and the gold Nest Ball, which matches the
          original Scarlet & Violet set.
        </p>
        <p>
          <strong>Three cards are new.</strong> English never printed a gold Gholdengo ex, a Maushold ex Special Art Rare or a Rika
          Special Art Rare. The English Gholdengo ex Special Art Rare, Maushold ex Super Rare and Rika Super Rare are all here too, so a
          Chinese binder holds one more version of each.
        </p>
        <div className="card-grid cols-3">
          {fresh.map((r) => (
            <figure key={r.cn}>
              <img src={r.image} alt={`${r.name} ${r.cn}/129, Reward Round`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{r.name}</strong>
                {r.cn}/129 · {r.rarity} · {r.illus}
              </figcaption>
            </figure>
          ))}
        </div>
        <p>
          <strong>Two promo arts.</strong> Spidops 005/129 and Annihilape ex 066/129 use art that English released as SV Black Star
          Promos, and Garganacl ex 075/129 uses its Stellar Crown art rather than its Paldea Evolved one.
        </p>

        <h2 id="secret-rares">All 36 secret rares</h2>
        <p>Every card above 129, with its English twin. Highlighted rows are new.</p>
        <OriginsTable list={SECRET} />

        <h2 id="main-set">The 129-card main set</h2>
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
