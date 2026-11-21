import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'nuzzle-cheeks-plush-card-display-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/nuzzle-cheeks-plush-${name}.webp`

// Pokémon China's contents list for one box.
const CONTENTS = [
  { item: 'Art illustration holo promo card', qty: '1', note: 'One of 7, matching the plush' },
  { item: 'Nuzzle Cheeks plush', qty: '1', note: 'One of 6 regular designs or the secret Pawmi' },
  { item: 'Card display frame', qty: '1', note: 'Holds the card; the plush clips onto it with magnets' },
  { item: 'Metal storage tin', qty: '1', note: 'Pokémon China does not describe it further' },
  { item: 'True Mystery booster pack', qty: '1', note: 'Set code CSV6C, 5 cards' },
  { item: 'Collect 151: Gathering booster pack', qty: '1', note: 'Set code 151C, 5 cards' },
]

// The 7 plushes and their cards. Card text and illustrators read off the card images.
type Plush = {
  key: string
  name: string
  no: string
  hp: string
  illus: string
  scene: string
  shop?: string
  photoW: number
  photoH: number
}
const PLUSHES: Plush[] = [
  { key: 'pikachu', name: 'Pikachu', no: '090/SV-P', hp: '60', illus: 'Hiroyuki Yamamoto', scene: 'Pikachu running across a crossing in a busy town, with Clefairy, Growlithe and Psyduck nearby', shop: 'pikachu', photoW: 522, photoH: 515 },
  { key: 'raichu', name: 'Raichu', no: '091/SV-P', hp: '140', illus: 'Toshinao Aoki', scene: 'Raichu lying on its back on a bed, its tail hanging over the side', shop: 'raichu', photoW: 626, photoH: 531 },
  { key: 'plusle', name: 'Plusle', no: '092/SV-P', hp: '70', illus: 'OKACHEKE', scene: 'Plusle cheering with glowing pom-poms on a table of snacks', shop: 'plusle', photoW: 682, photoH: 630 },
  { key: 'minun', name: 'Minun', no: '093/SV-P', hp: '70', illus: 'OKACHEKE', scene: 'Minun cheering with glowing pom-poms next to a pizza box', shop: 'minun', photoW: 652, photoH: 638 },
  { key: 'pachirisu', name: 'Pachirisu', no: '094/SV-P', hp: '70', illus: 'zig', scene: 'Two Pachirisu pressing their cheeks together in a spark of electricity', shop: 'pachirisu', photoW: 572, photoH: 550 },
  { key: 'pawmot', name: 'Pawmot', no: '095/SV-P', hp: '130', illus: 'Kouki Saitou', scene: 'Pawmot resting on a pile of hay, with Pawmo and Pawmi working below', shop: 'pawmot', photoW: 648, photoH: 563 },
  { key: 'pawmi', name: 'Pawmi (secret)', no: '096/SV-P', hp: '60', illus: 'REND', scene: 'Five Pawmi resting together in a forest, one of them a pink shiny Pawmi', photoW: 624, photoH: 565 },
]
const REGULARS = PLUSHES.slice(0, 6)

const TOC = [
  { id: 'what-it-is', label: 'What is the Nuzzle Cheeks plush card display box?' },
  { id: 'contents', label: 'What comes in a box?' },
  { id: 'lineup', label: 'All 6 plushes and their cards' },
  { id: 'secret', label: 'The secret Pawmi' },
  { id: 'display', label: 'How the plush holds the card' },
  { id: 'odds', label: 'What are the odds of the secret Pawmi?' },
  { id: 'packs', label: 'The 2 booster packs' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Nuzzle Cheeks plush card display box?',
    a: 'An official Pokémon TCG product from Pokémon China. Its Chinese name is 蹭蹭脸颊毛绒玩具卡牌展示礼盒. Each box holds one random plush of an Electric-type Pokémon, the matching holo promo card, a card display frame, a metal storage tin and 2 booster packs.',
  },
  {
    q: 'When was the Nuzzle Cheeks box released?',
    a: 'December 19, 2025, from 10:00 China time. Pokémon China announced it on November 28, 2025.',
  },
  {
    q: 'Which Pokémon are in the Nuzzle Cheeks line?',
    a: 'Six regular plushes: Pikachu, Raichu, Plusle, Minun, Pachirisu and Pawmot. The secret is Pawmi. All seven are Electric types that can learn the move Nuzzle, which is 蹭蹭脸颊 in Chinese.',
  },
  {
    q: 'What promo cards come with the plushes?',
    a: 'Pikachu 090/SV-P, Raichu 091/SV-P, Plusle 092/SV-P, Minun 093/SV-P, Pachirisu 094/SV-P, Pawmot 095/SV-P and the secret Pawmi 096/SV-P. Each box has the card that matches its plush.',
  },
  {
    q: 'What are the odds of the secret Pawmi?',
    a: 'Pokémon China gives 2.08% for the secret, about 1 box in 48. The 6 regular designs are made in equal numbers, so each is about 1 box in 6.',
  },
  {
    q: 'How does the plush display the card?',
    a: 'The card goes into the display frame, and the plush has magnets that let it clip onto the frame, so it looks like it is hugging the card. Two plushes can also hug each other.',
  },
  {
    q: 'Which booster packs are inside?',
    a: 'One pack of True Mystery (set code CSV6C) and one pack of Collect 151: Gathering (set code 151C). Pokémon China lists both as 5-card packs.',
  },
  {
    q: 'Is it sold under other names, like Rubbing Cheeks?',
    a: 'Yes. Pokémon China has no English name for it, so shops translate it differently. 蹭蹭脸颊 can be read as Nuzzle Cheeks or Rubbing Cheeks, so the Rubbing Cheeks Plush Card Display Box is the same product. The full Chinese name translates as Nuzzle Cheeks Plush Toy Card Display Gift Box, and since each box holds one random plush it is also called a blind box.',
  },
]

export const Route = createFileRoute('/blog/nuzzle-cheeks-plush-card-display-release-news')({
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
  component: NuzzleCheeksPlushPost,
})

const photoStyle = { aspectRatio: '1 / 1', objectFit: 'contain', background: 'transparent', boxShadow: 'none' } as const
const cardStyle = { background: 'transparent', boxShadow: 'none' } as const

function NuzzleCheeksPlushPost() {
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
  const contentsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'What comes in a Chinese Nuzzle Cheeks plush card display box',
    numberOfItems: CONTENTS.length,
    itemListElement: CONTENTS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.qty} x ${c.item}` })),
  }
  const lineupJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All 7 Nuzzle Cheeks plushes and their promo cards',
    numberOfItems: PLUSHES.length,
    itemListElement: PLUSHES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.name} plush with promo card ${p.no}, illustrated by ${p.illus}`,
      image: img(`${p.key}-with-card`),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contentsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(lineupJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China's Nuzzle Cheeks plush card display box released on December 19, 2025. Each box holds one random plush of an Electric-type Pokémon, its matching promo card, a card display frame and 2 booster packs. About 1 box in 48 has the secret Pawmi."
        cta={{
          heading: 'Shop the Nuzzle Cheeks blind box',
          body: 'One random plush with its promo card, the display frame, the tin and 2 booster packs.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-nuzzle-cheeks-plush-card-display-blind-box' }, label: 'Shop the blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-nuzzle-cheeks-plush-card-display-blind-box-case' }, label: 'See the case', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Nuzzle Cheeks plush card display box?</h2>
        <p>
          It is an official Simplified Chinese Pokémon TCG product from Pokémon China, released on December 19, 2025. Its Chinese name
          is <Zh>蹭蹭脸颊毛绒玩具卡牌展示礼盒</Zh>, which translates as Nuzzle Cheeks Plush Toy Card Display Gift Box. <Zh>蹭蹭脸颊</Zh> is
          the Chinese name of the move Nuzzle, and every Pokémon in the line is an Electric type that can learn it.
        </p>
        <p>
          Each box holds one random plush and the holo promo card that goes with it. The card goes in a display frame, and the plush
          clips onto the frame with magnets so it holds the card. There are 6 regular designs and a secret Pawmi. Every box also has a
          pack of True Mystery (set code CSV6C) and a pack of Collect 151: Gathering (set code 151C).
        </p>

        <aside className="fact-box" aria-label="Nuzzle Cheeks plush card display box key facts">
          {/* Same box as in the contents section below, where it is described, so this copy is decorative */}
          <img src={img('box')} alt="" loading="lazy" width={560} height={994} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Nuzzle Cheeks Plush Toy Card Display Gift Box (<Zh>蹭蹭脸颊毛绒玩具卡牌展示礼盒</Zh>)
              </dd>
              <dt>Released</dt>
              <dd>December 19, 2025, 10:00 China time</dd>
              <dt>Designs</dt>
              <dd>7: Pikachu, Raichu, Plusle, Minun, Pachirisu, Pawmot and a secret Pawmi</dd>
              <dt>Per box</dt>
              <dd>1 random plush, its promo card, a card display frame, a metal tin, 2 booster packs</dd>
              <dt>Promo cards</dt>
              <dd>090/SV-P to 096/SV-P</dd>
              <dt>Set code</dt>
              <dd>CSV6C and 151C (the 2 packs inside)</dd>
              <dt>Secret odds</dt>
              <dd>2.08%, about 1 box in 48</dd>
              <dt>Language</dt>
              <dd>Simplified Chinese</dd>
            </dl>
          </div>
        </aside>

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

        <h2 id="contents">What comes in a box?</h2>
        <p>Pokémon China lists six items in each box:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of one Nuzzle Cheeks plush card display box
            </caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {CONTENTS.map((c) => (
                <tr key={c.item}>
                  <th scope="row">{c.item}</th>
                  <td>{c.qty}</td>
                  <td>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The box itself is round, printed with Pikachu hugging its card, Plusle and Minun hugging each other, and Pachirisu. Pokémon
          China does not show what the metal tin looks like on its own, and it notes that its images are design renders, so the
          finished product may differ.
        </p>
        <figure style={{ margin: '24px auto 30px', maxWidth: 320 }}>
          <img
            src={img('box')}
            alt="The round Nuzzle Cheeks box, printed with Pikachu hugging its card in a frame, Plusle and Minun hugging, and Pachirisu"
            loading="lazy"
            width={560}
            height={994}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>

        <h2 id="lineup">All 6 plushes and their cards</h2>
        <p>
          The six regular plushes are Pikachu, Raichu, Plusle, Minun, Pachirisu and Pawmot. Each one comes with its own holo promo card,
          numbered in the SV-P promo series. Pokémon China calls them art illustration holo cards (<Zh>艺术插画闪卡</Zh>): the illustration
          fills the whole card, behind the text.
        </p>
        <ul className="card-grid cols-3">
          {REGULARS.map((p) => (
            <li key={p.key}>
              <figure>
                <img
                  src={img(`${p.key}-with-card`)}
                  alt={`The ${p.name} plush holding its ${p.no} promo card in a clear display frame`}
                  loading="lazy"
                  width={p.photoW}
                  height={p.photoH}
                  style={photoStyle}
                />
                <figcaption>
                  <strong>{p.name}</strong>
                  {p.no}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>These are the six cards, in number order.</p>
        <ul className="card-grid cols-3">
          {REGULARS.map((p) => (
            <li key={p.key}>
              <figure>
                <img src={img(`${p.key}-card`)} alt={`${p.name} ${p.no} promo: ${p.scene}`} loading="lazy" width={495} height={692} style={cardStyle} />
                <figcaption>
                  <strong>{p.name}</strong>
                  {p.no} · {p.illus}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          Pikachu 090/SV-P, by Hiroyuki Yamamoto, shows Pikachu running across a crossing in a busy town, with Clefairy, Growlithe and
          Psyduck around it. It has 60 HP, an attack that attaches a basic Lightning Energy from your deck, and Pika Punch for 50.
          Raichu 091/SV-P, by Toshinao Aoki, shows Raichu lying on its back on a bed. It has 140 HP, and Thunderbolt does 200 damage
          but discards all the Energy attached to it.
        </p>
        <p>
          Plusle 092/SV-P and Minun 093/SV-P are both by OKACHEKE and show the same living room, each Pokémon cheering with glowing
          pom-poms, with a person on the sofa behind. Plusle's attack does 10 damage plus 10 for each damage counter on your
          opponent's Active Pokémon. Minun's Ability works when you have Plusle in play: whenever your opponent attaches Energy from
          their hand, that Pokémon gets 2 damage counters.
        </p>
        <p>
          Pachirisu 094/SV-P, by zig, shows two Pachirisu pressing their cheeks together in a spark of electricity. Its Ability stops it from being Paralyzed. Pawmot 095/SV-P, by Kouki Saitou, shows Pawmot resting on a pile
          of hay while a Pawmo and a Pawmi work below. It has 130 HP, an Ability that attaches a basic Lightning Energy from your deck
          once a turn, and an attack for 230.
        </p>
        <p>
          Each regular plush also has its own listing:{' '}
          {REGULARS.map((p, i) => (
            <span key={p.key}>
              <Link to="/products/$id" params={{ id: `pokemon-chinese-nuzzle-cheeks-plush-${p.shop}` }}>
                {p.name}
              </Link>
              {i < REGULARS.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>

        <h2 id="secret">The secret Pawmi</h2>
        <p>
          The secret design is Pawmi, card 096/SV-P, illustrated by REND. Pokémon China describes the illustration as five Pawmi
          resting together in a forest, and one of them is a shiny Pawmi, which shows up pink in the middle of the group. The card has
          60 HP and two attacks, for 10 and 20. A box with the Pawmi card has the Pawmi plush with it.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pawmi-card')} alt="Pawmi 096/SV-P secret promo: five Pawmi resting in a forest, the shiny pink one in the middle" loading="lazy" width={600} height={838} style={cardStyle} />
              <figcaption>
                <strong>Pawmi</strong>096/SV-P · REND
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pawmi-with-card')} alt="The secret Pawmi plush holding its 096/SV-P promo card in a clear display frame" loading="lazy" width={624} height={565} style={photoStyle} />
              <figcaption>
                <strong>Pawmi plush</strong>Secret
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="display">How the plush holds the card</h2>
        <p>
          Pokémon China says each plush has a magnetic design that lets it clip onto the card display frame. You put your card in the
          frame, and the plush wraps its arms around the side of it, as in the photos above. The frame is clear, so the whole card
          shows. It can hold any card you choose, not only the one in the box.
        </p>
        <p>
          The plushes can also hug each other in pairs, cheek to cheek, which is the Nuzzle idea behind the line. Pokémon China shows
          Pikachu with Raichu, Plusle with Minun, Minun with Pachirisu, and Pawmot with Pawmi. It does not say where the magnets sit,
          what the frame is made of, or how big the plushes are.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('pair-pikachu-raichu')} alt="The Pikachu and Raichu plushes hugging cheek to cheek" loading="lazy" width={702} height={560} style={photoStyle} />
              <figcaption>
                <strong>Pikachu and Raichu</strong>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pair-plusle-minun')} alt="The Minun and Plusle plushes hugging cheek to cheek" loading="lazy" width={716} height={560} style={photoStyle} />
              <figcaption>
                <strong>Plusle and Minun</strong>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pair-minun-pachirisu')} alt="The Minun and Pachirisu plushes hugging cheek to cheek" loading="lazy" width={851} height={591} style={photoStyle} />
              <figcaption>
                <strong>Minun and Pachirisu</strong>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('pair-pawmot-pawmi')} alt="The Pawmot and Pawmi plushes hugging cheek to cheek" loading="lazy" width={850} height={594} style={photoStyle} />
              <figcaption>
                <strong>Pawmot and Pawmi</strong>
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="odds">What are the odds of the secret Pawmi?</h2>
        <p>
          About 1 box in 48. Pokémon China says the 6 regular designs are made in equal numbers and gives the secret a 2.08% chance.
          That leaves each regular design at about 1 box in 6.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Odds for each Nuzzle Cheeks plush
            </caption>
            <thead>
              <tr>
                <th scope="col">Plush</th>
                <th scope="col">Share of boxes</th>
                <th scope="col">About 1 box in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Each regular plush</th>
                <td>16.32%</td>
                <td>6.1</td>
              </tr>
              <tr>
                <th scope="row">Secret Pawmi</th>
                <td>2.08%</td>
                <td>48</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">Pokémon China gives the 2.08%. The regular share is what is left, split six ways. These are averages, not guarantees.</p>

        <h2 id="packs">The 2 booster packs</h2>
        <p>
          Every box has one pack of <Link to="/blog/true-mystery-release-news">True Mystery</Link> (set code CSV6C), the Paradox
          Pokémon set released on November 7, 2025, and one pack of{' '}
          <Link to="/sets/chinese/collect-151-gathering">Collect 151: Gathering</Link> (set code 151C), the fourth release of Collect
          151, from October 17, 2025. Pokémon China lists both as 5-card packs.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          This is a plush first and a card product second, and that is the appeal. Each Pokémon gets a full illustration card of its
          own, the plush doubles as a stand for any card you like, and the pairs that hug make a nice shelf display. Pawmi is a sweet
          pick for the secret, and 1 in 48 is not out of reach.
        </p>
      </BlogPostLayout>
    </>
  )
}
