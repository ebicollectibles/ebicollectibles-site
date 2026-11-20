import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'team-rocket-briefcase-release-news')!

const img = (name: string) => `${SITE_URL}/assets/blog/team-rocket-briefcase-${name}.webp`

// The seven items on Pokémon China's contents list, in its order.
const CONTENTS = [
  { item: "Team Rocket's Mewtwo ex holo promo card", qty: '1', note: '354/SV-P' },
  { item: 'Chasing Glory booster box', qty: '1', note: '6 packs of 20 cards, 120 cards in all' },
  { item: 'Deck box', qty: '1', note: 'With 2 dividers' },
  { item: 'Playmat', qty: '1', note: 'Mewtwo behind a red R' },
  { item: 'Playmat pouch', qty: '1', note: 'Zip pouch for the rolled playmat' },
  { item: 'Card sleeves', qty: '64', note: 'Black with a red R' },
  { item: 'Briefcase', qty: '1', note: 'Black faux leather with a red R' },
]

const ACCESSORIES = [
  { name: 'deck-box', title: 'Deck box', note: 'With 2 dividers', alt: 'Black Team Rocket deck box with a red R on the front flap', w: 1100, h: 733 },
  { name: 'playmat', title: 'Playmat', note: 'Zones labelled in English', alt: 'Black Team Rocket playmat with Mewtwo behind a large red R and outlines of other Pokémon', w: 1100, h: 608 },
  { name: 'playmat-pouch', title: 'Playmat pouch', note: 'Holds the rolled playmat', alt: 'Long black zip pouch for the playmat with a small red R', w: 1100, h: 733 },
  { name: 'sleeves', title: 'Card sleeves', note: '64 in the set', alt: 'Black Team Rocket card sleeves with a red R, fanned out', w: 1100, h: 1100 },
]

// Counted from Pokémon China's campaign page for July 16 to July 30, 2026.
const STORES = [
  { kind: 'Official Card Gyms', count: '18', what: 'Official stores that also host play and events' },
  { kind: 'Long-running pop-up stores', count: '16', what: 'Official shops, mostly inside shopping malls' },
  { kind: 'Pop-up stores', count: '2', what: 'Short-term official shops, both in Beijing' },
]

const CITIES = ['Beijing', 'Changsha', 'Chengdu', 'Chongqing', 'Dalian', 'Fuzhou', 'Guangzhou', 'Hangzhou', 'Nanjing', 'Ningbo', 'Sanya', 'Shanghai', 'Shenyang', 'Shenzhen', 'Wenzhou', 'Wuhan']

const TOC = [
  { id: 'what-it-is', label: 'What is the Team Rocket briefcase?' },
  { id: 'contents', label: 'What comes inside?' },
  { id: 'briefcase', label: 'The briefcase itself' },
  { id: 'outer-box', label: 'The outer box' },
  { id: 'promo', label: "The Team Rocket's Mewtwo ex promo" },
  { id: 'packs', label: 'The booster packs inside' },
  { id: 'accessories', label: 'The deck box, playmat and sleeves' },
  { id: 'launch', label: 'How it launched in China' },
  { id: 'names', label: 'Why it has more than one name' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the Chinese Team Rocket briefcase?',
    a: 'An official Pokémon TCG gift box from Pokémon China. Its Chinese name is 火箭队的宏图专属礼盒, which translates as Team Rocket’s Grand Plan Exclusive Gift Box. It is a black faux-leather briefcase with a red R that holds a promo card, six booster packs and a set of matching accessories.',
  },
  {
    q: 'When was the Team Rocket briefcase released in China?',
    a: 'July 16, 2026, at 10:00 China time. It released on the same day as the Chasing Glory expansion (CSV10C).',
  },
  {
    q: 'What comes in the Team Rocket briefcase?',
    a: 'Seven things: a Team Rocket’s Mewtwo ex holo promo card (354/SV-P), one Chasing Glory booster box of six 20-card packs, a deck box with two dividers, a playmat, a playmat pouch, 64 card sleeves, and the briefcase itself.',
  },
  {
    q: 'What is the promo card in the Team Rocket briefcase?',
    a: 'Team Rocket’s Mewtwo ex, numbered 354/SV-P, illustrated by aky CG Works. It has the same text as the Double Rare 085/222 in Chasing Glory but a different illustration.',
  },
  {
    q: 'How many booster packs are in the Team Rocket briefcase?',
    a: 'Six. They are 20-card Chasing Glory packs, which is one full jumbo booster box and 120 cards in all.',
  },
  {
    q: 'Is this the same as the Japanese Team Rocket briefcase?',
    a: 'No. Japan had its own Team Rocket briefcase set with the Glory of Team Rocket expansion in 2025. The Chinese gift box is a separate product, printed in Simplified Chinese and released with Chasing Glory in 2026.',
  },
  {
    q: 'Can the briefcase be used to carry cards?',
    a: 'Yes. Pokémon China describes it as built for carrying your cards and accessories to play. The lid has a pouch, and the base has a separate section for cards alongside space for the accessories.',
  },
  {
    q: 'What language are the cards?',
    a: 'Simplified Chinese. The promo card and all six booster packs are from the Simplified Chinese release.',
  },
]

export const Route = createFileRoute('/blog/team-rocket-briefcase-release-news')({
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
  component: TeamRocketBriefcasePost,
})

function TeamRocketBriefcasePost() {
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
    name: 'What comes in the Chinese Team Rocket briefcase',
    numberOfItems: CONTENTS.length,
    itemListElement: CONTENTS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.qty} x ${c.item}` })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contentsJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Pokémon China's Team Rocket briefcase released on July 16, 2026, alongside Chasing Glory. This post covers everything in it, the Mewtwo ex promo, the outer box, and how the launch ran in stores in China."
        cta={{
          heading: 'Shop the Team Rocket briefcase',
          body: 'The complete gift box: briefcase, promo card, six packs and every accessory.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-glory-of-team-rocket-briefcase-set' }, label: 'Shop the briefcase' },
            { to: '/sets/chinese/chasing-glory-csv10', label: 'See the Chasing Glory card list', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is the Team Rocket briefcase?</h2>
        <p>
          It is an official Pokémon TCG gift box from Pokémon China, released on July 16, 2026, the same day as the{' '}
          <Link to="/blog/chasing-glory-release-news">Chasing Glory</Link> expansion. Its Chinese name is <Zh>火箭队的宏图专属礼盒</Zh>, which
          translates as Team Rocket's Grand Plan Exclusive Gift Box.
        </p>
        <p>
          The gift box is a black faux-leather briefcase with a red Team Rocket R on the front. Inside are a Team Rocket's Mewtwo ex
          promo card, six Chasing Glory booster packs, and a matching deck box, playmat, playmat pouch and set of sleeves. Everything
          is in black and red.
        </p>

        <aside className="fact-box" aria-label="Team Rocket briefcase key facts">
          {/* Same card as in the promo section below, where it is described, so this copy is decorative */}
          <img src={img('mewtwo-ex-promo')} alt="" loading="lazy" width={788} height={1100} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Team Rocket's Grand Plan Exclusive Gift Box (<Zh>火箭队的宏图专属礼盒</Zh>)</dd>
              <dt>Released</dt>
              <dd>July 16, 2026, 10:00 China time</dd>
              <dt>Released with</dt>
              <dd>Chasing Glory (CSV10C)</dd>
              <dt>Promo card</dt>
              <dd>Team Rocket's Mewtwo ex, 354/SV-P</dd>
              <dt>Booster packs</dt>
              <dd>6 Chasing Glory packs of 20 cards</dd>
              <dt>Accessories</dt>
              <dd>Deck box, playmat, playmat pouch, 64 sleeves</dd>
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

        <h2 id="contents">What comes inside?</h2>
        <p>Seven things, going by Pokémon China's own contents list:</p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-contents" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-contents" className="sr-only">
              Contents of the Team Rocket briefcase
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
        <figure style={{ margin: '28px auto', maxWidth: 760 }}>
          <img src={img('case-packed')} alt="The Team Rocket briefcase open and fully packed: deck box on the left, sleeves and booster box in the middle, playmat pouch along the front" loading="lazy" width={1100} height={733} style={{ width: '100%', height: 'auto', borderRadius: 10 }} />
          <figcaption>The briefcase as it comes packed.</figcaption>
        </figure>

        <BuyStrip />

        <h2 id="briefcase">The briefcase itself</h2>
        <p>
          The case is black faux leather with a textured finish, a carry handle, two latches and protectors on every corner. The red
          R sits in the middle of the front.
        </p>
        <p>
          It is made to be used. The lid has a flat pouch with its own flap. The base is divided, with a small lidded section for
          cards and open space for the deck box, sleeves and playmat. Pokémon China describes it as something you pick up by the
          handle and take to practice or a tournament.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 760 }}>
          <img src={img('case-empty')} alt="The empty Team Rocket briefcase, open, showing the pouch in the lid and the divided base with a lidded card section" loading="lazy" width={1100} height={733} style={{ width: '100%', height: 'auto', borderRadius: 10 }} />
          <figcaption>Empty, with the lid pouch and the divided base.</figcaption>
        </figure>

        <h2 id="outer-box">The outer box</h2>
        <p>
          The briefcase ships inside a black outer box. The box is printed with a thin line drawing of the briefcase, down to the
          handle and the corner protectors, with the same red R in the middle. It has a carry handle of its own on top.
        </p>
        <p>
          For a collector the outer box matters. It is what a sealed copy looks like, and it is the first thing to check when you buy
          one.
        </p>
        <figure style={{ margin: '28px auto', maxWidth: 520 }}>
          <img src={img('outer-box')} alt="The black outer box of the Team Rocket gift box, printed with a line drawing of the briefcase and a red R" loading="lazy" width={1100} height={1100} style={{ width: '100%', height: 'auto', borderRadius: 10 }} />
          <figcaption>The outer box.</figcaption>
        </figure>

        <h2 id="promo">The Team Rocket's Mewtwo ex promo</h2>
        <p>
          The gift box includes one holo promo card: Team Rocket's Mewtwo ex, numbered 354/SV-P and illustrated by aky CG Works. It
          has 280 HP. Its Ability stops it from attacking unless you have four or more Team Rocket's Pokémon in play, and its attack
          does 160 damage plus 60 more for each Energy you discard from your Benched Pokémon, up to two.
        </p>
        <p>
          The card text matches the Double Rare 085/222 in Chasing Glory, but the illustration is different. Chasing Glory also has
          this Pokémon as a Super Rare, a Special Art Rare and a gold Ultra Rare, all in the{' '}
          <Link to="/blog/chasing-glory-set-guide">Chasing Glory set guide</Link>.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('mewtwo-ex-promo')} alt="Team Rocket's Mewtwo ex 354/SV-P promo card from the Team Rocket gift box" loading="lazy" width={788} height={1100} />
              <figcaption>
                <strong>Team Rocket's Mewtwo ex</strong>354/SV-P · Promo
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('booster-pack')} alt="Chasing Glory 20-card booster pack with Mewtwo and Giovanni" loading="lazy" width={610} height={1100} />
              <figcaption>
                <strong>Chasing Glory pack</strong>20 cards · 6 in the gift box
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="packs">The booster packs inside</h2>
        <p>
          The gift box holds one Chasing Glory booster box of six packs. They are the 20-card packs, so that is 120 cards and the same
          contents as a jumbo booster box.
        </p>
        <p>
          Chasing Glory is the Trainer's Pokémon set, led by Team Rocket, with 287 cards. Our{' '}
          <Link to="/blog/chasing-glory-set-guide">set guide</Link> covers the odds for the 20-card packs, and the{' '}
          <Link to="/sets/chinese/chasing-glory-csv10">Chasing Glory card list</Link> shows every card.
        </p>

        <h2 id="accessories">The deck box, playmat and sleeves</h2>
        <p>
          All four accessories match the briefcase. The deck box and the playmat pouch are black with a red R. The 64 sleeves are
          black with a red R on the back. The playmat puts Mewtwo behind a large red R, with Weezing and other Pokémon in grey outline,
          and its zones are labelled in English: Prize, Deck, Bench, Battle Field and Trash.
        </p>
        <ul className="card-grid cols-2">
          {ACCESSORIES.map((a) => (
            <li key={a.name}>
              <figure>
                <img src={img(a.name)} alt={a.alt} loading="lazy" width={a.w} height={a.h} style={{ aspectRatio: '3 / 2', objectFit: 'contain', background: '#fff' }} />
                <figcaption>
                  <strong>{a.title}</strong>
                  {a.note}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="launch">How it launched in China</h2>
        <p>
          Pokémon China built an in-store event around the release. From July 16 to July 30, 2026, it ran a campaign called{' '}
          <Zh>共筑“火箭队的宏图”</Zh>, which translates as Build Team Rocket's Grand Plan Together.
        </p>
        <p>
          <strong>A hunt in the Official Card Gyms.</strong> Fifteen Official Card Gyms hid standees of Pokémon from Chasing Glory's Team
          Rocket cards. Visitors tapped a phone on the R mark of each standee. Finding two Pokémon that belong to Team Rocket Grunts,
          plus one that belongs to an Executive or the Boss, made you a "secret member" with your own member profile.
        </p>
        <p>
          <strong>A member card holder.</strong> Players who joined a qualifying event at a gym in those two weeks could claim a
          "secret member" card holder, black with a red R. Pokémon China made 130,000 of them, one per person.
        </p>
        <p>
          <strong>A Team Rocket paper bag.</strong> Shoppers who spent a set amount in one visit could get a black paper bag with red
          handles and red line art of Wobbuffet, Meowth, Crobat and Ekans. There were 150,000, one per person.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={img('member-card-holder')} alt="The black secret member card holder with a red R, shown with a red member card" loading="lazy" width={1100} height={1100} />
              <figcaption>
                <strong>Member card holder</strong>130,000 made
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={img('paper-bag')} alt="The Team Rocket paper bag: black with red handles and red line art of Wobbuffet, Meowth, Crobat and Ekans" loading="lazy" width={1100} height={1100} />
              <figcaption>
                <strong>Team Rocket paper bag</strong>150,000 made
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          The paper bag was offered at 36 official locations in {CITIES.length} cities: {CITIES.slice(0, -1).join(', ')} and{' '}
          {CITIES[CITIES.length - 1]}. They were three kinds of store:
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-stores" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-stores" className="sr-only">
              Official stores in China that took part in the Team Rocket campaign
            </caption>
            <thead>
              <tr>
                <th scope="col">Type of store</th>
                <th scope="col">Locations</th>
                <th scope="col">What it is</th>
              </tr>
            </thead>
            <tbody>
              {STORES.map((s) => (
                <tr key={s.kind}>
                  <th scope="row">{s.kind}</th>
                  <td>{s.count}</td>
                  <td>{s.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Counted from Pokémon China's campaign page. Shanghai had the most locations, with eight.</p>
        <p>
          The freebies were for people shopping and playing in those stores. They are not part of the gift box, and the gift box does
          not include them. Pokémon China's product page does not say which stores sold the gift box itself.
        </p>

        <h2 id="names">Why it has more than one name</h2>
        <p>
          Outside China you will see this product under several names. We list it as the Glory of Team Rocket Special Briefcase Set,
          and other shops call it the Team Rocket Briefcase or the Team Rocket Gift Box. They are all the same product: the one
          Pokémon China calls <Zh>火箭队的宏图专属礼盒</Zh>.
        </p>
        <p>
          It is not the Japanese one. Japan had its own Team Rocket briefcase set with the Glory of Team Rocket expansion in 2025. The
          Chinese gift box came a year later, is printed in Simplified Chinese, and pairs with Chasing Glory.
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
          This is a complete kit in one case: a promo card with its own illustration, a full box of 20-card packs, and a deck box,
          playmat and sleeves that all match. The briefcase is sturdy enough to use, and the outer box makes a sealed copy easy to
          recognise.
        </p>
      </BlogPostLayout>
    </>
  )
}
