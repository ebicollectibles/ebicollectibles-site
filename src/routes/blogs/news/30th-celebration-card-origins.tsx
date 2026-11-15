import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-card-origins')!

const cardImg = (n: string) => `${R2_IMAGE_HOST}/Chinese/30th%20Celebration/Cards/0${n}.webp`

// The 30 classic cards (136 to 165) and the original English card each one
// reprints. Matched on card name plus the illustrator printed on the
// Chinese card, checked against TCGdex and compared side by side.
const CLASSICS = [
  { cn: '136', name: 'Pikachu', set: 'Base Set', no: '58/102', year: '1999', illus: 'Mitsuhiro Arita' },
  { cn: '137', name: 'Charizard', set: 'Base Set', no: '4/102', year: '1999', illus: 'Mitsuhiro Arita' },
  { cn: '138', name: 'Misty', set: 'Gym Heroes', no: '102/132', year: '2000', illus: 'Ken Sugimori' },
  { cn: '139', name: 'Erika\'s Jigglypuff', set: 'Gym Challenge', no: '69/132', year: '2000', illus: 'Ken Sugimori' },
  { cn: '140', name: 'Sneasel', set: 'Neo Genesis', no: '25/111', year: '2000', illus: 'Ken Sugimori' },
  { cn: '141', name: 'Shining Celebi', set: 'Neo Destiny', no: '106/105', year: '2002', illus: 'Hironobu Yoshida' },
  { cn: '142', name: 'Lugia', set: 'Aquapolis', no: '149/147', year: '2003', illus: 'Naoyo Kimura' },
  { cn: '143', name: 'Delcatty', set: 'EX Ruby & Sapphire', no: '5/109', year: '2003', illus: 'Atsuko Nishida' },
  { cn: '144', name: 'Dark Tyranitar', set: 'EX Team Rocket Returns', no: '19/109', year: '2004', illus: 'Nakaoka' },
  { cn: '145', name: 'Scizor ex', set: 'EX Unseen Forces', no: '108/115', year: '2005', illus: 'Mitsuhiro Arita' },
  { cn: '146', name: 'Metagross δ', set: 'EX Delta Species', no: '11/113', year: '2005', illus: 'Masakazu Fukuda' },
  { cn: '147', name: 'Palkia LV.X', set: 'DP Great Encounters', no: '106/106', year: '2008', illus: 'Ryo Ueda' },
  { cn: '148', name: 'Uxie', set: 'DP Legends Awakened', no: '43/146', year: '2008', illus: 'Ken Sugimori' },
  { cn: '149', name: 'Crobat G', set: 'Platinum', no: '47/127', year: '2009', illus: 'Makoto Imai' },
  { cn: '150', name: 'Gengar', set: 'HS Triumphant', no: '94/102', year: '2010', illus: 'Takashi Yamaguchi' },
  { cn: '151', name: 'Darkrai & Cresselia LEGEND (top)', set: 'HS Triumphant', no: '99/102', year: '2010', illus: 'Shinji Higuchi + Noriko Takaya' },
  { cn: '152', name: 'Darkrai & Cresselia LEGEND (bottom)', set: 'HS Triumphant', no: '100/102', year: '2010', illus: 'Shinji Higuchi + Noriko Takaya' },
  { cn: '153', name: 'N', set: 'BW Noble Victories', no: '101/101', year: '2011', illus: 'Ken Sugimori' },
  { cn: '154', name: 'Rayquaza-EX', set: 'BW Dragons Exalted', no: '85/124', year: '2012', illus: 'Eske Yoshinob' },
  { cn: '155', name: 'Genesect-EX', set: 'BW Plasma Blast', no: '11/101', year: '2013', illus: 'Eske Yoshinob' },
  { cn: '156', name: 'M Gardevoir-EX', set: 'XY Primal Clash', no: '106/160', year: '2015', illus: '5ban Graphics' },
  { cn: '157', name: 'Greninja BREAK', set: 'XY BREAKpoint', no: '41/122', year: '2016', illus: '5ban Graphics' },
  { cn: '158', name: 'Solgaleo-GX', set: 'Sun & Moon', no: '89/149', year: '2017', illus: 'PLANETA' },
  { cn: '159', name: 'Buzzwole-GX', set: 'SM Crimson Invasion', no: '57/111', year: '2017', illus: '5ban Graphics' },
  { cn: '160', name: 'Pikachu & Zekrom-GX', set: 'SM Team Up', no: '33/181', year: '2019', illus: 'Mitsuhiro Arita' },
  { cn: '161', name: 'Zacian V', set: 'Sword & Shield', no: '138/202', year: '2020', illus: '5ban Graphics' },
  { cn: '162', name: 'Raikou', set: 'SWSH Vivid Voltage', no: '50/185', year: '2020', illus: 'Hideki Ishikawa' },
  { cn: '163', name: 'Mew VMAX', set: 'SWSH Fusion Strike', no: '114/264', year: '2021', illus: '5ban Graphics' },
  { cn: '164', name: 'Arceus VSTAR', set: 'SWSH Brilliant Stars', no: '123/172', year: '2022', illus: '5ban Graphics' },
  { cn: '165', name: 'Magikarp', set: 'SV Paldea Evolved', no: '203/193', year: '2023', illus: 'Shinji Kanda' },
]

const ERAS = [
  { era: 'Wizards of the Coast era', years: '1999 to 2003', count: CLASSICS.filter((c) => +c.year <= 2003 && +c.cn <= 142).length },
  { era: 'EX, Diamond & Pearl and HeartGold SoulSilver', years: '2003 to 2010', count: CLASSICS.filter((c) => +c.cn >= 143 && +c.cn <= 152).length },
  { era: 'Black & White, XY and Sun & Moon', years: '2011 to 2019', count: CLASSICS.filter((c) => +c.cn >= 153 && +c.cn <= 160).length },
  { era: 'Sword & Shield and Scarlet & Violet', years: '2020 to 2023', count: CLASSICS.filter((c) => +c.cn >= 161).length },
]

// Most wanted first, with at least one pick from each era.
const HIGHLIGHTS = ['137', '136', '142', '150', '154', '163']

const SAMPLES = [
  { cn: '017/103 Pikachu', en: '30th Celebration 023', illus: 'Ken Sugimori' },
  { cn: '126/103 Pikachu ex SAR', en: '30th Celebration 149', illus: 'kantaro' },
  { cn: '134/103 Mewtwo ex FUR', en: '30th Celebration 157', illus: 'YOSHIROTTEN' },
  { cn: '121/103 Ditto AR', en: 'Mega Promos 106', illus: 'Ounishi' },
  { cn: '114/103 Nidorina AR', en: 'Mega Promos 101', illus: 'Taiga Kasai' },
  { cn: '001/30th-P Bulbasaur', en: 'Mega Promos 037', illus: 'Saboteri' },
]

const TOC = [
  { id: 'how-it-works', label: 'How 30th Celebration lines up' },
  { id: 'eras', label: 'Classics by era' },
  { id: 'patterns', label: 'Patterns worth knowing' },
  { id: 'classic-map', label: 'All 30 classics, card by card' },
  { id: 'rest-of-set', label: 'The rest of the set' },
  { id: 'how-we-checked', label: 'How we checked' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'Where do the 30th Celebration classic cards come from?',
    a: 'Each of the 30 classic cards, 136 to 165, reprints a famous English card from the TCG’s history, from Base Set Charizard and Pikachu in 1999 to the Paldea Evolved Magikarp Illustration Rare in 2023.',
  },
  {
    q: 'Is the Chinese 30th Celebration the same as the English set?',
    a: 'Every Chinese card is in English too, but they are split differently. The Chinese set matches the Japanese 30th CELEBRATION number for number. English puts the 30 classics in a separate 30th Classic Collection, moves the Ditto and Nidorina Art Rares to Mega Promos, and adds 25 extra Pokémon cards to its main set.',
  },
  {
    q: 'Is the Ditto Art Rare a promo in English?',
    a: 'Yes. In English the Ditto 121/103 art is Mega Promos 106. In the Chinese set it is a regular Art Rare you can pull from packs.',
  },
  {
    q: 'Which classic is the oldest?',
    a: 'The Base Set Pikachu and Charizard, both from 1999 and both by Mitsuhiro Arita.',
  },
]

export const Route = createFileRoute('/blogs/news/30th-celebration-card-origins')({
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
  component: ThirtiethOriginsPost,
})

function ThirtiethOriginsPost() {
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        wide
        post={post}
        lede="30th Celebration brings back 30 famous cards from the game's history. Here is where each one first appeared, plus how the rest of the set lines up with the English release."
        cta={{
          heading: 'Explore 30th Celebration',
          body: 'See every card in the set, or read our set guide for every Pikachu, classic and promo in one place.',
          links: [
            { to: '/sets/30th-celebration', label: 'Browse the card list' },
            { to: '/blogs/news/30th-celebration-set-guide', label: 'Read the set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          The classic collection is the heart of this set: 30 cards from 1999 to 2023, reprinted in their original frames with a gold
          glitter border. We matched each one to the English card it first appeared on.
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

        <h2 id="how-it-works">How 30th Celebration lines up</h2>
        <p>
          The Simplified Chinese set matches the Japanese 30th CELEBRATION card for card, with the same numbers from 001 to 165. The
          English release has every Chinese card but splits them up differently: its 30th Celebration set has 128 numbered cards, including 25 cards
          that are not in the Chinese set, the 30 classics are a separate 30th Classic Collection, and a few cards became Mega Promos.
        </p>

        <h2 id="eras">Classics by era</h2>
        <p>The 30 classics cover every era of the game:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Era</th>
                <th scope="col">Years</th>
                <th scope="col">Classics</th>
              </tr>
            </thead>
            <tbody>
              {ERAS.map((e) => (
                <tr key={e.era}>
                  <th scope="row">{e.era}</th>
                  <td>{e.years}</td>
                  <td>{e.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-grid cols-3">
          {HIGHLIGHTS.map((n) => CLASSICS.find((c) => c.cn === n)!).map((c) => (
            <figure key={c.cn}>
              <img src={cardImg(c.cn)} alt={`Classic ${c.name} ${c.cn}/103, 30th Celebration`} loading="lazy" width={300} height={419} />
              <figcaption>
                <strong>{c.name}</strong>
                {c.cn}/103 · {c.set}, {c.year}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 id="patterns">Patterns worth knowing</h2>
        <ul>
          <li>
            <strong>5ban Graphics and Ken Sugimori lead the list.</strong> 5ban Graphics made six of the classics and Ken Sugimori drew
            five. Mitsuhiro Arita drew four: the Base Set Pikachu and Charizard, Scizor ex and Pikachu &amp; Zekrom-GX.
          </li>
          <li>
            <strong>Most are the regular version.</strong> Rayquaza-EX, Genesect-EX and the GX, V, VMAX and VSTAR cards reuse the
            regular art, not the full arts. N is the exception, using the Noble Victories full art.
          </li>
          <li>
            <strong>Two newer rarities sneak in.</strong> Raikou is the Vivid Voltage Amazing Rare, and Magikarp is the Paldea Evolved
            Illustration Rare.
          </li>
          <li>
            <strong>One card takes two numbers.</strong> 151 and 152 are the two halves of the HS Triumphant Darkrai &amp; Cresselia
            LEGEND.
          </li>
          <li>
            <strong>M Gardevoir-EX got a small update.</strong> The original kept Japanese lettering for its attack name inside the art.
            The new version spells it out as BRILLIANT ARROW.
          </li>
        </ul>

        <h2 id="classic-map">All 30 classics, card by card</h2>
        <div className="table-scroll">
          <table className="data-table origins-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Card</th>
                <th scope="col">Original English card</th>
              </tr>
            </thead>
            <tbody>
              {CLASSICS.map((c) => (
                <tr key={c.cn}>
                  <th scope="row">{c.cn}</th>
                  <td>{c.name}</td>
                  <td>
                    {c.set} {c.no}, {c.year}
                    <span className="cell-sub">Illus. {c.illus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Card numbers are the original English printing.</p>

        <h2 id="rest-of-set">The rest of the set</h2>
        <p>
          Outside the classics, the main set, Art Rares, Special Art Rares and Futuristic Rares share their art with the English 30th
          Celebration release. A few examples:
        </p>
        <div className="table-scroll">
          <table className="data-table origins-table">
            <thead>
              <tr>
                <th scope="col">Chinese card</th>
                <th scope="col">English card</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLES.map((s) => (
                <tr key={s.cn}>
                  <th scope="row">{s.cn}</th>
                  <td>
                    {s.en}
                    <span className="cell-sub">Illus. {s.illus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Two Art Rares are worth knowing about. Ditto 121/103 and Nidorina 114/103 were released in English only as Mega Promos, while
          here they come out of packs. All 33 Chinese promos are Mega Promos in English too.
        </p>

        <h2 id="how-we-checked">How we checked</h2>
        <p>
          We read the illustrator printed on each Chinese card, matched it to the English card with the same name and the same artist,
          and put the two side by side to be sure.
        </p>
        <p>
          For more on the set itself, see our <Link to="/blogs/news/30th-celebration-has-arrived">30th Celebration release post</Link>{' '}
          and the <Link to="/blogs/news/30th-celebration-set-guide">30th Celebration set guide</Link>.
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
