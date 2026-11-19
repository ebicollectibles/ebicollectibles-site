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
import setData from '~/data/csv2.json'
import { RARITY_NAME } from '~/components/blog/rarityNames'

const post = BLOG_POSTS.find((p) => p.slug === 'miracle-journey-card-origins')!

type Src = 'PAL' | 'SVI' | 'OBF' | 'SVP' | 'MEW' | 'PAF'

// Every Miracle Journey card and the English card with the same art:
// [Chinese number, English set, English number, illustrator]. Each card's
// image was compared with every English printing of the same name (TCGdex),
// and every pairing was then checked by eye. Where the same art was printed
// more than once we list the first main set it appeared in, and a promo only
// when no main set has it. The illustrator is the one credited on the
// matching English card. All 163 cards have an English match.
const ORIGINS: [string, Src, string, string][] = [
  ['001', 'PAL', '006/193', "GOSSAN"],
  ['002', 'PAL', '007/193', "Taira Akitsu"],
  ['003', 'PAL', '008/193', "Yoriyuki Ikegami"],
  ['004', 'PAL', '009/193', "Megumi Higuchi"],
  ['005', 'OBF', '009/197', "You Iribi"],
  ['006', 'OBF', '010/197', "Nobuhiro Imagawa"],
  ['007', 'SVI', '008/198', "sowsow"],
  ['008', 'SVI', '009/198', "Kagemaru Himeno"],
  ['009', 'SVI', '010/198', "Atsuko Nishida"],
  ['010', 'PAL', '013/193', "Naoyo Kimura"],
  ['011', 'PAL', '014/193', "nagimiso"],
  ['012', 'PAL', '015/193', "5ban Graphics"],
  ['013', 'PAL', '020/193', "Sekio"],
  ['014', 'PAL', '021/193', "Anesaki Dynamic"],
  ['015', 'PAL', '028/193', "AKIRA EGAWA"],
  ['016', 'PAL', '031/193', "Yuu Nishida"],
  ['017', 'PAL', '032/193', "Uta"],
  ['018', 'PAL', '033/193', "Haru Akasaka"],
  ['019', 'PAL', '035/193', "ryoma uratsuka"],
  ['020', 'PAL', '036/193', "Hitoshi Ariga"],
  ['021', 'PAL', '037/193', "5ban Graphics"],
  ['022', 'PAL', '041/193', "Oswaldo KATO"],
  ['023', 'PAL', '042/193', "HYOGONOSUKE"],
  ['024', 'PAL', '043/193', "Yuya Oka"],
  ['025', 'PAL', '046/193', "miki kudo"],
  ['026', 'OBF', '048/197', "Jerky"],
  ['027', 'OBF', '049/197', "Kouki Saitou"],
  ['028', 'OBF', '056/197', "Atsuya Uki"],
  ['029', 'OBF', '057/197', "Tonji Matsuno"],
  ['030', 'SVP', '054', "takuyoa"],
  ['031', 'PAL', '049/193', "sui"],
  ['032', 'PAL', '051/193', "Souichirou Gunjima"],
  ['033', 'PAL', '052/193', "5ban Graphics"],
  ['034', 'SVI', '058/198', "Shin Nagasawa"],
  ['035', 'SVI', '060/198', "Anesaki Dynamic"],
  ['036', 'OBF', '063/197', "Masakazu Fukuda"],
  ['037', 'OBF', '064/197', "kurumitsu"],
  ['038', 'OBF', '065/197', "Anesaki Dynamic"],
  ['039', 'PAL', '069/193', "Oswaldo KATO"],
  ['040', 'PAL', '070/193', "Narumi Sato"],
  ['041', 'PAL', '071/193', "aoki"],
  ['042', 'SVI', '069/198', "Nisota Niso"],
  ['043', 'SVI', '074/198', "kantaro"],
  ['044', 'SVI', '075/198', "Saya Tsuruta"],
  ['045', 'SVI', '076/198', "Mizue"],
  ['046', 'OBF', '075/197', "Saya Tsuruta"],
  ['047', 'OBF', '078/197', "Toshinao Aoki"],
  ['048', 'PAL', '081/193', "sowsow"],
  ['049', 'PAL', '082/193', "Pani Kobayashi"],
  ['050', 'OBF', '079/197', "5ban Graphics"],
  ['051', 'PAL', '087/193', "Megumi Higuchi"],
  ['052', 'PAL', '088/193', "Atsushi Furusawa"],
  ['053', 'SVI', '084/198', "Tika Matsuno"],
  ['054', 'SVI', '085/198', "kawayoo"],
  ['055', 'SVI', '086/198', "N-DESIGN Inc."],
  ['056', 'OBF', '089/197', "0313"],
  ['057', 'OBF', '090/197', "GOSSAN"],
  ['058', 'OBF', '091/197', "Scav"],
  ['059', 'SVP', '139', "hncl"],
  ['060', 'SVI', '089/198', "Taira Akitsu"],
  ['061', 'SVI', '090/198', "Yuu Nishida"],
  ['062', 'PAL', '090/193', "0313"],
  ['063', 'PAL', '091/193', "Aya Kusube"],
  ['064', 'PAL', '092/193', "Shiburingaru"],
  ['065', 'SVI', '094/198', "zig"],
  ['066', 'OBF', '097/197', "Yuka Morii"],
  ['067', 'OBF', '098/197', "Megumi Mizutani"],
  ['068', 'PAL', '100/193', "Mizue"],
  ['069', 'PAL', '103/193', "Akira Komayama"],
  ['070', 'SVP', '140', "DOM"],
  ['071', 'OBF', '103/197', "OKACHEKE"],
  ['072', 'OBF', '104/197', "Nelnal"],
  ['073', 'PAL', '108/193', "Shin Nagasawa"],
  ['074', 'PAL', '112/193', "Kurata So"],
  ['075', 'PAL', '113/193', "Hasuno"],
  ['076', 'SVI', '113/198', "chibi"],
  ['077', 'SVI', '114/198', "Nurikabe"],
  ['078', 'PAL', '116/193', "0313"],
  ['079', 'PAL', '117/193', "kawayoo"],
  ['080', 'SVI', '122/198', "nagimiso"],
  ['081', 'OBF', '124/197', "aky CG Works"],
  ['082', 'SVI', '126/198', "Kouki Saitou"],
  ['083', 'SVI', '127/198', "Haru Akasaka"],
  ['084', 'PAL', '129/193', "Saya Tsuruta"],
  ['085', 'PAL', '130/193', "PLANETA Mochizuki"],
  ['086', 'PAL', '131/193', "Teeziro"],
  ['087', 'PAL', '132/193', "Nisota Niso"],
  ['088', 'PAL', '136/193', "Nagomi Nijo"],
  ['089', 'SVI', '129/198', "Naoyo Kimura"],
  ['090', 'PAL', '138/193', "Narumi Sato"],
  ['091', 'PAL', '139/193', "nagimiso"],
  ['092', 'PAL', '140/193', "Teeziro"],
  ['093', 'OBF', '139/197', "Shiburingaru"],
  ['094', 'OBF', '140/197', "Shigenori Negishi"],
  ['095', 'SVI', '136/198', "KEIICHIRO ITO"],
  ['096', 'SVP', '086', "PLANETA Mochizuki"],
  ['097', 'OBF', '142/197', "Takeshi Nakamura"],
  ['098', 'PAL', '149/193', "Oswaldo KATO"],
  ['099', 'PAL', '150/193', "Uta"],
  ['100', 'SVI', '144/198', "sui"],
  ['101', 'SVI', '145/198', "chibi"],
  ['102', 'SVI', '148/198', "Yuka Morii"],
  ['103', 'SVI', '149/198', "kantaro"],
  ['104', 'SVI', '150/198', "Atsushi Furusawa"],
  ['105', 'PAL', '169/193', "PLANETA Mochizuki"],
  ['106', 'SVP', '099', "Hitoshi Ariga"],
  ['107', 'SVP', '100', "aky CG Works"],
  ['108', 'SVI', '164/198', "Ryota Murayama"],
  ['109', 'PAL', '170/193', "nagimiso"],
  ['110', 'SVI', '181/198', "Toyste Beach"],
  ['111', 'OBF', '189/197', "Toyste Beach"],
  ['112', 'SVI', '191/198', "Studio Bora Inc."],
  ['113', 'SVI', '186/198', "Toyste Beach"],
  ['114', 'MEW', '165/165', "Toyste Beach"],
  ['115', 'SVI', '197/198', "Studio Bora Inc."],
  ['116', 'SVI', '193/198', "Ayaka Yoshida"],
  ['117', 'MEW', '163/165', "Studio Bora Inc."],
  ['118', 'MEW', '160/165', "saino misaki"],
  ['119', 'SVI', '177/198', "Akira Komayama"],
  ['120', 'PAL', '179/193', "yuu"],
  ['121', 'PAL', '177/193', "Hitoshi Ariga"],
  ['122', 'PAL', '187/193', "nagimiso"],
  ['123', 'SVI', '176/198', "Hideki Ishikawa"],
  ['124', 'PAF', '077/91', "kantaro"],
  ['125', 'SVI', '195/198', "nagimiso"],
  ['126', 'PAF', '081/91', "AYUMI ODASHIMA"],
  ['127', 'PAL', '171/193', "Oswaldo KATO"],
  ['128', 'PAL', '192/193', ""],
  ['129', 'PAL', '195/193', "Jerky"],
  ['130', 'PAL', '200/193', "Po-Suzuki"],
  ['131', 'OBF', '201/197', "KEIICHIRO ITO"],
  ['132', 'SVI', '211/198', "Jiro Sasumo"],
  ['133', 'SVI', '212/198', "Jiro Sasumo"],
  ['134', 'PAL', '218/193', "Anesaki Dynamic"],
  ['135', 'SVI', '217/198', "Mina Nakai"],
  ['136', 'PAL', '227/193', "Shibuzoh."],
  ['137', 'PAL', '231/193', "5ban Graphics"],
  ['138', 'PAL', '233/193', "5ban Graphics"],
  ['139', 'PAL', '235/193', "5ban Graphics"],
  ['140', 'SVI', '228/198', "N-DESIGN Inc."],
  ['141', 'PAL', '241/193', "Ayaka Yoshida"],
  ['142', 'PAL', '244/193', "PLANETA Mochizuki"],
  ['143', 'PAL', '245/193', "Eske Yoshinob"],
  ['144', 'PAL', '247/193', "PLANETA Mochizuki"],
  ['145', 'MEW', '196/165', "saino misaki"],
  ['146', 'SVI', '237/198', "Akira Komayama"],
  ['147', 'PAL', '250/193', "yuu"],
  ['148', 'PAL', '249/193', "Sanosuke Sakuma"],
  ['149', 'PAL', '255/193', "nagimiso"],
  ['150', 'PAF', '228/91', "Hideki Ishikawa"],
  ['151', 'SVI', '242/198', "nagimiso"],
  ['152', 'PAL', '256/193', "Kouki Saitou"],
  ['153', 'PAL', '258/193', "kantaro"],
  ['154', 'PAL', '260/193', "Souichirou Gunjima"],
  ['155', 'SVI', '245/198', "Jiro Sasumo"],
  ['156', 'PAL', '264/193', "Amelicart"],
  ['157', 'MEW', '203/165', "Cona Nitanda"],
  ['158', 'PAL', '266/193', "GIDORA"],
  ['159', 'PAL', '270/193', "Sanosuke Sakuma"],
  ['160', 'PAL', '271/193', "5ban Graphics"],
  ['161', 'PAL', '272/193', "5ban Graphics"],
  ['162', 'PAL', '273/193', "5ban Graphics"],
  ['163', 'OBF', '229/197', "Oswaldo KATO"],
]

const SET_NAME: Record<Src, string> = {
  PAL: 'Paldea Evolved',
  SVI: 'Scarlet & Violet',
  OBF: 'Obsidian Flames',
  SVP: 'SV Black Star Promo',
  MEW: '151',
  PAF: 'Paldean Fates',
}

const CARDS = new Map(setData.cards.map((c) => [c.number.slice(0, 3), c]))
const rows = ORIGINS.map(([cn, src, en, illus]) => {
  const c = CARDS.get(cn)!
  return { cn, src, en, illus, name: c.name, rarity: c.rarity.match(/\(([^)]+)\)/)?.[1] ?? c.rarity, image: c.image }
})
const MAIN = rows.filter((r) => +r.cn <= 128)
const SECRET = rows.filter((r) => +r.cn > 128)
const BIG3: Src[] = ['PAL', 'SVI', 'OBF']
const count = (s: Src) => rows.filter((r) => r.src === s).length

const BY_TIER = (['C', 'U', 'R', 'RR', 'AR', 'SR', 'SAR', 'UR'] as const).map((t) => {
  const list = rows.filter((r) => r.rarity === t)
  const n = (s: Src) => list.filter((r) => r.src === s).length
  return {
    tier: t,
    pal: n('PAL'),
    svi: n('SVI'),
    obf: n('OBF'),
    other: list.filter((r) => !BIG3.includes(r.src)).length,
    total: list.length,
  }
})

const SET_COUNTS = (Object.keys(SET_NAME) as Src[])
  .map((s) => ({ s, n: count(s) }))
  .filter((x) => x.n > 0)
  .sort((a, b) => b.n - a.n)

const TOC = [
  { id: 'at-a-glance', label: 'At a glance' },
  { id: 'gardevoir', label: 'The Gardevoir line' },
  { id: 'patterns', label: 'Patterns in the matches' },
  { id: 'secret-rares', label: `All ${SECRET.length} secret rares` },
  { id: 'main-set', label: `The ${MAIN.length}-card main set` },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Which English set is Miracle Journey?',
    a: `There is no single one. Most of its cards match Paldea Evolved (${count('PAL')}), Scarlet & Violet (${count('SVI')}) and Obsidian Flames (${count('OBF')}), with the rest from SV Black Star Promos (${count('SVP')}), 151 (${count('MEW')}) and Paldean Fates (${count('PAF')}).`,
  },
  {
    q: 'Does Miracle Journey have any new art?',
    a: 'No. All 163 cards use an illustration that was also printed in English.',
  },
  {
    q: 'Is the Gardevoir ex Special Art Rare the same as in English?',
    a: 'Yes. 155/128 matches Scarlet & Violet 245/198 by Jiro Sasumo.',
  },
  {
    q: 'Are any Miracle Journey cards English promos?',
    a: 'Six: Greninja ex 030/128 matches SVP 054, Latias 059/128 matches SVP 139, Tinkaton 070/128 matches SVP 140, Mabosstiff ex 096/128 matches SVP 086, Shroodle 106/128 matches SVP 099 and Grafaiai ex 107/128 matches SVP 100.',
  },
]

export const Route = createFileRoute('/blog/miracle-journey-card-origins')({
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
  component: MiracleJourneyOrigins,
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
              <tr key={r.cn}>
                <th scope="row">{r.cn}</th>
                <td>
                  {r.name}
                  <span className="cell-sub">
                    <RarityAbbr code={r.rarity} />
                  </span>
                </td>
                <td>
                  {SET_NAME[r.src]} {r.en}
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

function MiracleJourneyOrigins() {
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
  // Jiro Sasumo's three-card Gardevoir line.
  const gardevoir = ['132', '133', '155'].map((n) => rows.find((r) => r.cn === n)!)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Miracle Journey is built mostly from Paldea Evolved and the first Scarlet & Violet set, with cards from four other English sources mixed in. We matched all 163 cards to English, and every one has an English version."
        cta={{
          heading: 'Collect Miracle Journey',
          body: 'Browse all 163 cards on the full checklist and tick off what you have.',
          links: [{ to: '/sets/chinese/miracle-journey-csv2', label: 'See the full card list' }],
        }}
      >
        <p>
          Miracle Journey (set code CSV2C) does not follow one English set. Almost half of its 163 cards match Paldea Evolved, and the first Scarlet &
          Violet set and Obsidian Flames supply most of the rest. A few come from promos, 151 and Paldean Fates, and no card is new
          art. For the chase cards and pull odds, see our <Link to="/blog/miracle-journey-set-guide">set guide</Link>.
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
                <th scope="col">Paldea Evolved</th>
                <th scope="col">Scarlet & Violet</th>
                <th scope="col">Obsidian Flames</th>
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
                  <td>{t.pal || '–'}</td>
                  <td>{t.svi || '–'}</td>
                  <td>{t.obf || '–'}</td>
                  <td>{t.other || '–'}</td>
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

        <h2 id="gardevoir">The Gardevoir line</h2>
        <p>
          The cover Pokémon's cards all match the first Scarlet & Violet set. Ralts 053, Kirlia 054 and Gardevoir ex 055 match
          084/198, 085/198 and 086/198, and the Gardevoir ex Super Rare 140 matches 228/198. The three cards by Jiro Sasumo match too:
          the Ralts and Kirlia Art Rares and the Gardevoir ex Special Art Rare, which shows Gardevoir on a sofa holding balls of yarn
          beside a woman knitting.
        </p>
        <ul className="card-grid cols-3">
          {gardevoir.map((r) => (
            <li key={r.cn}>
              <figure>
                <img src={r.image} alt={`${r.name} ${r.cn}/128 ${rarityFullName(r.rarity)}, Miracle Journey`} loading="lazy" width={300} height={418} />
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.cn}/128 · <RarityAbbr code={r.rarity} /> · {SET_NAME[r.src]} {r.en}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="patterns">Patterns in the matches</h2>
        <p>
          <strong>Paldea Evolved does most of the work.</strong> It supplies {count('PAL')} of the 163 cards, including Meowscarada
          ex, Skeledirge ex and Quaquaval ex at every rarity, all three versions of Squawkabilly ex, and the Dendra and Saguaro
          Special Art Rares. Every card's English source, from most cards to fewest:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-3" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-3" className="sr-only">Patterns in the matches</caption>
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
          <strong>Obsidian Flames supplies Miraidon ex and Koraidon ex.</strong> Miraidon ex 050/128 matches Obsidian Flames 079/197
          and Koraidon ex 081/128 matches 124/197. The gold Artazon 163/128 also matches Obsidian Flames, 229/197, while the regular
          Artazon 127/128 matches Paldea Evolved 171/193.
        </p>
        <p>
          <strong>Six promo arts.</strong> Greninja ex 030/128, Latias 059/128, Tinkaton 070/128, Mabosstiff ex 096/128, Shroodle
          106/128 and Grafaiai ex 107/128 use art that English released as SV Black Star Promos.
        </p>
        <p>
          <strong>Erika's Invitation comes from 151.</strong> All three versions match 151: the Uncommon 118/128, the Super Rare
          145/128 and the Special Art Rare 157/128. Rigid Band and Leftovers match 151 as well. Atticus, Moonlit Hill and the Judge
          Super Rare match Paldean Fates.
        </p>

        <h2 id="secret-rares">All {SECRET.length} secret rares</h2>
        <p>Every card above 128, with its English twin.</p>
        <OriginsTable list={SECRET} caption="Secret rares and the English card each one matches" />

        <BuyStrip />

        <h2 id="main-set">The {MAIN.length}-card main set</h2>
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
