import { Zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-pikachu-cards-artists')!

const asset = (name: string) => `${SITE_URL}/assets/blog/pikachu-30-artists-${name}.webp`
/** The English card scan, by English set number (23 to 52). */
const img = (no: number) => asset(`en-${String(no).padStart(3, '0')}`)

interface PikachuCard {
  /** English set number, out of 128 */
  no: number
  illus: string
  /** What the art shows, for the image alt text */
  art: string
  note: ReactNode
}

// The 30 Pikachu in the English 30th Celebration set (30C), 023/128 to 052/128.
// Each card also carries a Pikachu badge from 01/30 to 30/30. Illustrator names
// and attack names are as printed on the English cards.
const PIKACHU: PikachuCard[] = [
  {
    no: 23,
    illus: 'Ken Sugimori',
    art: 'a round, classic-style Pikachu standing in a green forest with small bolts of lightning around it',
    note: (
      <>
        Where else could it start? Sugimori, whose art defined the very first Pokémon games, redraws his own Pikachu from Jungle
        (60/64, 1999): the same chubby, old-school Pikachu in the same forest, with the same little bolts crackling around it.
        Put the two side by side and 27 years fall away.
      </>
    ),
  },
  {
    no: 24,
    illus: 'danciao',
    art: 'Pikachu charging forward in a burst of red and gold electricity as rocks break apart around it',
    note: (
      <>
        Pikachu comes straight at you in a blast of red and gold electricity, with the ground breaking apart under it. The attack
        is Volt Tackle, and the art looks exactly like one. Easily one of the loudest cards of the 30.
      </>
    ),
  },
  {
    no: 25,
    illus: 'satoma',
    art: 'Pikachu sitting on a teal stool in a sunny garden full of flowers',
    note: (
      <>
        The opposite mood: Pikachu perched on a little teal stool in a sunny garden. satoma's soft, washed-out colors give it the
        feel of a watercolor you would hang in a kitchen.
      </>
    ),
  },
  {
    no: 26,
    illus: 'Takeshi Nakamura',
    art: 'Pikachu hanging upside down into the frame and looking straight at the viewer, with blue sky behind it',
    note: (
      <>
        Pikachu drops into the frame upside down and stares right at you. The attack is Peer At, which makes your opponent show
        you their hand. Card and art in perfect agreement.
      </>
    ),
  },
  {
    no: 27,
    illus: 'Asako Ito',
    art: 'a crochet-style Pikachu napping on the grass',
    note: (
      <>
        Look closely: this Pikachu is yarn. Asako Ito crochets Pokémon by hand, and her cards are photos of her handmade pieces.
        Here it dozes in the grass, and the attack is, of course, Nap.
      </>
    ),
  },
  {
    no: 28,
    illus: 'sowsow',
    art: 'Pikachu sitting among soft pillows holding a Poké Ball, with a Ditto on a cushion beside it',
    note: (
      <>
        Pikachu sits in a nest of pillows hugging a Poké Ball, with a Ditto on the next cushion and a picture frame on the wall.
        Pastel, hand-drawn and about as cozy as a card gets. Its Ability is Lonely Gaze, and its attack is Pika Ball.
      </>
    ),
  },
  {
    no: 29,
    illus: 'James Turner',
    art: 'a flat, sticker-style Pikachu bouncing past a Poké Ball on a teal background dotted with flowers',
    note: (
      <>
        Thick outlines, flat bright color, a Poké Ball and a scatter of flowers: you can spot a James Turner card from across the
        room. Turner is a Game Freak artist who has designed Pokémon for the main games. The attack, Find a Friend, searches your
        deck for a Pokémon.
      </>
    ),
  },
  {
    no: 30,
    illus: 'DOM',
    art: 'Pikachu glowing with lightning as it races through a city at night',
    note: <>Pikachu tears through a city at night, wrapped in purple and yellow lightning. The attack is Mach Bolt. All speed, all glow.</>,
  },
  {
    no: 31,
    illus: 'Atsushi Furusawa',
    art: 'Pikachu sitting on a cluttered desk beside an old computer, books and pens, looking over its shoulder',
    note: (
      <>
        Seen from behind, Pikachu sits on a cluttered desk next to an old computer, books and pens, and glances back like you
        caught it at something. The attack is Gnaw. Keep an eye on those cables.
      </>
    ),
  },
  {
    no: 32,
    illus: 'Tomokazu Komiya',
    art: 'Pikachu tumbling past a giant pink broom through a rainy, swirling scene',
    note: (
      <>
        Pikachu tumbles past a giant pink broom through a swirl of rain. It is the strangest card of the 30, and that is the point.
        Tomokazu Komiya has drawn Pokémon cards for decades, and his offbeat style is unmistakable. The attack is Scurry About.
      </>
    ),
  },
  {
    no: 33,
    illus: 'Narumi Sato',
    art: 'Pikachu peeking out from a bush of pink flowers in bright sunlight',
    note: (
      <>
        Pikachu peeks out of a bush of pink flowers in bright sun. Its Ability is Keep Hidden, which protects it from damage on
        the Bench. The art is the Ability.
      </>
    ),
  },
  {
    no: 34,
    illus: 'USGMEN',
    art: 'a flat, cut-out style Pikachu hopping across a green lawn next to a tree stump',
    note: (
      <>
        A flat, paper cut-out Pikachu hops across a green lawn by a tree stump. Simple shapes, bold outline, very modern. The
        attack is Pika Chain.
      </>
    ),
  },
  {
    no: 35,
    illus: 'Susumu Maeya',
    art: 'Pikachu rolling on its back in a carpet of red and orange autumn leaves',
    note: (
      <>
        Pikachu rolls on its back in a carpet of red and orange leaves, eyes shut, grinning. The attack is Rollout. If any card in
        the set captures the pure fun of being Pikachu, it is this one.
      </>
    ),
  },
  {
    no: 36,
    illus: 'OKACHEKE',
    art: 'Pikachu leaning over a wooden railing and smiling',
    note: (
      <>
        Pikachu hauls itself over a wooden banister with a big grin, caught mid-climb. The attack is Slight Intrusion, which is
        exactly what this looks like. Warm wood and soft light give it a homey, painted feel.
      </>
    ),
  },
  {
    no: 37,
    illus: 'Yuu Nishida',
    art: 'Pikachu leaping toward the viewer with a happy shout, its tail crackling against a bright green background',
    note: (
      <>
        Pikachu leaps at you with a happy shout, tail crackling against bright green and blue. The attacks are Energized Tail and
        Pika Punch. Sunny, bold and one of the most cheerful cards in the set.
      </>
    ),
  },
  {
    no: 38,
    illus: 'Tetsu Kayama',
    art: 'a determined Pikachu crouching under big leaves with its cheeks sparking',
    note: (
      <>
        No smiles here. Pikachu crouches under big leaves, brow furrowed, cheeks sparking, ready for a fight. The attack is
        Targeted Spark. One of the few serious faces of the 30.
      </>
    ),
  },
  {
    no: 39,
    illus: 'Teeziro',
    art: 'a tiny Pikachu resting at the doorstep of an old house with wooden doors, surrounded by trees and plants',
    note: (
      <>
        Find the Pikachu. It is the small yellow spot on the doorstep of an old house with tall wooden doors, half hidden by trees.
        Teeziro lets the painted scene do the talking. The attack is Iron Tail.
      </>
    ),
  },
  {
    no: 40,
    illus: 'Shinji Kanda',
    art: 'Pikachu cheering with its arms up in a bright burst of rainbow patterns and flowers',
    note: (
      <>
        Pikachu throws its arms up in an explosion of rainbow patterns, flowers and dots, with something new in every corner. That
        level of detail is Shinji Kanda's signature. The attack is Overwriting Bolt.
      </>
    ),
  },
  {
    no: 41,
    illus: 'Rianti Hidayat',
    art: 'Pikachu hanging from a tree branch with a big smile, framed by jungle leaves',
    note: (
      <>
        Pikachu dangles from a branch with a huge open-mouthed smile, framed by jungle leaves. Its first attack is called Hang
        Down. Its second is Zap Kick.
      </>
    ),
  },
  {
    no: 42,
    illus: 'Akira Komayama',
    art: 'Pikachu running through tall pink grass under a bright blue sky',
    note: (
      <>
        Pikachu sprints through tall pink grass under a streaked blue sky, and the first attack, Charge-Up Dash, could be the
        caption. Akira Komayama is a long-time card illustrator with a clean, bright, anime-like style.
      </>
    ),
  },
  {
    no: 43,
    illus: 'OOYAMA',
    art: 'a crayon-style drawing of Pikachu lounging on a beach with palm trees, a boat and a smiling sun',
    note: (
      <>
        Drawn like a kid's crayon picture: Pikachu lounging on a beach with palm trees, a little boat and a smiling sun. The attack
        is Tropical Vibes, and it puts Pikachu to sleep. Relatable.
      </>
    ),
  },
  {
    no: 44,
    illus: 'akagi',
    art: 'Pikachu bursting out of a swirl of after-images',
    note: (
      <>
        Pikachu bursts out of a swirl of after-images, like a photo of something too fast to catch. The attack is Agility, and it
        could not be anything else.
      </>
    ),
  },
  {
    no: 45,
    illus: 'Naoyo Kimura',
    art: 'Pikachu walking past white snowball flowers under an evening sky',
    note: (
      <>
        Pikachu strolls past round white flowers under a deep blue evening sky. The first attack is Nighttime Stroll. A quiet,
        lovely card.
      </>
    ),
  },
  {
    no: 46,
    illus: 'svlt',
    art: 'Pikachu sitting on a mossy rock in the breeze next to pink flowers',
    note: (
      <>
        Pikachu sits on a mossy rock with its eyes half shut in the breeze, beside a patch of pink flowers. The soft greens do most
        of the work. The attacks are Get Some Air and Smash Kick.
      </>
    ),
  },
  {
    no: 47,
    illus: 'Atsuko Nishida',
    art: 'Pikachu skipping through a sunny meadow with hills behind it',
    note: (
      <>
        The big one for history buffs. Atsuko Nishida first designed Pikachu at Game Freak, and 30 years on, here is her Pikachu
        skipping through a sunny meadow with green hills behind it. The attack is Play Rough.
      </>
    ),
  },
  {
    no: 48,
    illus: 'KIYOTAKA OSHIYAMA',
    art: 'Pikachu diving face-first into a pile of grapes, strawberries and other fruit, drawn with thick black outlines',
    note: (
      <>
        Pikachu dives face-first into a heap of grapes, strawberries and other fruit, all thick black outlines and bold color. The
        attack is Store Up. Yes, it is.
      </>
    ),
  },
  {
    no: 49,
    illus: 'Nurikabe',
    art: 'a close, painted portrait of Pikachu with a sly smile against a dark, sparkling background',
    note: (
      <>
        A close, glowing portrait with a sly little smile against a dark, sparkling backdrop. It reads more like an oil painting
        than a cartoon. The attack is Fighting Lightning.
      </>
    ),
  },
  {
    no: 50,
    illus: 'Shimaris Yukichi',
    art: 'Pikachu sitting in a meadow with its cheeks full and its eyes squeezed shut, surrounded by berries',
    note: (
      <>
        Pikachu sits in a meadow with its cheeks stuffed and its eyes squeezed shut, surrounded by berries. The attack is
        Satisfied Spark, and you can tell. Soft, storybook and one of the sweetest of the 30.
      </>
    ),
  },
  {
    no: 51,
    illus: 'nagimiso',
    art: 'Pikachu diving down out of the sky in a crackle of lightning',
    note: (
      <>
        Pikachu dives out of a starry sky in a crackle of green and yellow lightning. Sharp angles, comic-book energy. The attack is
        Lightning Crash.
      </>
    ),
  },
  {
    no: 52,
    illus: 'Kazuki Minami',
    art: 'Pikachu winding up a punch as the background shatters into streaks of light',
    note: (
      <>
        Pikachu winds up a punch as the background shatters into streaks of light. The attack is Angry Bolt, and it closes the run
        of 30 with a bang.
      </>
    ),
  },
]

/** The card's place in the run of 30, from its English number. */
const of30 = (no: number) => String(no - 22).padStart(2, '0')
const num = (no: number) => String(no).padStart(3, '0')

const GROUPS = [
  { id: 'cards-01-10', label: 'Pikachu 01/30 to 10/30', from: 23, to: 32 },
  { id: 'cards-11-20', label: 'Pikachu 11/30 to 20/30', from: 33, to: 42 },
  { id: 'cards-21-30', label: 'Pikachu 21/30 to 30/30', from: 43, to: 52 },
]

// How the 30 Pikachu are numbered in each language. Checked against the
// official card databases where one exists, and printed card scans otherwise.
const LANGUAGES: { lang: ReactNode; name: ReactNode; code: string; nos: string }[] = [
  { lang: 'English', name: '30th Celebration', code: '30C', nos: '023–052/128' },
  { lang: 'French, German, Italian, Spanish, Portuguese', name: 'Translated in each language', code: '30C', nos: '023–052/128' },
  {
    lang: 'Japanese',
    name: <span lang="ja">拡張パック「30th CELEBRATION」</span>,
    code: 'M6a',
    nos: '017–046/103',
  },
  { lang: 'Korean', name: <span lang="ko">MEGA 확장팩 「30th CELEBRATION」</span>, code: 'M6a', nos: '017–046/103' },
  {
    lang: 'Traditional Chinese (Taiwan and Hong Kong)',
    name: <span lang="zh-Hant">擴充包「30th CELEBRATION」</span>,
    code: 'M6a',
    nos: '017–046/103',
  },
  { lang: 'Simplified Chinese (mainland China)', name: <Zh>30周年庆典</Zh>, code: '30thC', nos: '017–046/103' },
  { lang: 'Thai', name: <span lang="th">การ์ดชุดเสริม "30th CELEBRATION"</span>, code: 'MA6', nos: '023–052/130' },
  { lang: 'Indonesian', name: <span lang="id">Booster Pack "30th CELEBRATION"</span>, code: 'MA6', nos: '023–052/130' },
]

// The Ken Sugimori Pikachu (01/30) in four of those languages.
const COMPARE = [
  { src: img(23), lang: 'English', no: '023/128', w: 400, h: 550 },
  { src: asset('ja-017'), lang: 'Japanese', no: '017/103', w: 400, h: 559 },
  { src: asset('zh-hant-017'), lang: 'Traditional Chinese', no: '017/103', w: 400, h: 559 },
  { src: asset('017'), lang: 'Simplified Chinese', no: '017/103', w: 300, h: 419 },
  { src: asset('th-023'), lang: 'Thai', no: '023/130', w: 400, h: 559 },
]

const TOC = [
  { id: 'about', label: 'How the 30 Pikachu work' },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label })),
  { id: 'languages', label: 'One Pikachu, 12 languages' },
  { id: 'gold', label: 'The gold Pikachu cards in Shanghai' },
  { id: 'at-ebi', label: 'The Chinese version at EBI Collectibles' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many Pikachu cards are in 30th Celebration?',
    a: '30, each drawn by a different artist. In the English set they are numbered 023/128 to 052/128, and each card also has a Pikachu badge showing its place in the run, from 01/30 to 30/30.',
  },
  {
    q: 'Is there a Pikachu in every pack?',
    a: 'Yes. Every 30th Celebration booster pack has one of the 30, and it is foil.',
  },
  {
    q: 'Who drew the 30 Pikachu cards?',
    a: '30 different illustrators, one per card. They include Ken Sugimori, whose art defined the first Pokémon games, Atsuko Nishida, who first designed Pikachu, and long-time card artists like Tomokazu Komiya, Akira Komayama and Shinji Kanda.',
  },
  {
    q: 'Which Pikachu is 01/30?',
    a: 'Ken Sugimori\'s, numbered 023/128 in English. It is a redraw of his Pikachu from the Jungle set (60/64), from 1999.',
  },
  {
    q: 'Where is the artist name on the card?',
    a: 'At the bottom left, after "Illus.", just above the set code and card number.',
  },
  {
    q: 'What rarity are the 30 Pikachu?',
    a: 'They have their own rarity, Pikachu Rare.',
  },
  {
    q: 'Can you get all 30 from a few packs?',
    a: 'Not reliably. Each pack has one Pikachu at random, so doubles turn up long before the 30th new one. Most collectors finish the run by trading or buying singles.',
  },
  {
    q: 'What languages was 30th Celebration printed in?',
    a: '12: English, French, German, Italian, Spanish, Portuguese, Japanese, Korean, Traditional Chinese, Simplified Chinese, Thai and Indonesian. It launched worldwide on September 16, 2026, the first Pokémon TCG expansion to release on the same day around the world.',
  },
  {
    q: 'Are the Pikachu the same in every language?',
    a: 'The 30 illustrations and artists are the same, and so is the 01/30 to 30/30 badge. The set number changes: 023 to 052/128 in English and the other European languages, 017 to 046/103 in Japanese, Korean and Chinese, and 023 to 052/130 in Thai and Indonesian.',
  },
]

export const Route = createFileRoute('/blog/30th-celebration-pikachu-cards-artists')({
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
  component: PikachuArtistsPost,
})

function PikachuArtistsPost() {
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
  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The 30 Pikachu cards in Pokémon TCG 30th Celebration',
    numberOfItems: PIKACHU.length,
    itemListElement: PIKACHU.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Pikachu ${num(c.no)}/128 (${of30(c.no)}/30), illustrated by ${c.illus}`,
      image: img(c.no),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(listJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Open a pack of 30th Celebration and one thing is guaranteed: a Pikachu. Which Pikachu is the fun part. There are 30 of them, each drawn by a different artist, and here is every one."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'The Simplified Chinese booster box, the Dream Painting Pikachu figures and the Pikachu 30th plush keychains.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/blog/30th-celebration-set-guide', label: 'Read the 30th Celebration set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration is the Pokémon TCG's 30th birthday set, and it went big. It launched on September 16, 2026, the first
          expansion ever to release on the same day around the world, and Pikachu is the star of the show. Every booster pack has
          one of 30 foil Pikachu cards.
        </p>
        <p>
          What makes them worth chasing is who drew them. Ken Sugimori is here, and so is Atsuko Nishida, the artist who first
          designed Pikachu. So are card veterans like Tomokazu Komiya and Akira Komayama, a Game Freak designer, a crochet artist and
          a wave of newer names. Thirty artists, one little yellow mouse, and no two alike.
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

        <h2 id="about">How the 30 Pikachu work</h2>
        <p>
          In the English set, the 30 Pikachu are cards 023/128 to 052/128, set code 30C. Right next to the number, each one has a
          small Pikachu badge showing its place in the run, from 01/30 to 30/30. It is the quickest way to tell them apart, and the
          number most collectors go by.
        </p>
        <p>
          All 30 share one frame: a giant Pikachu face behind the attack text, with the "30" printed in its red cheeks. They also get
          a rarity all to themselves, Pikachu Rare. The artist's name sits at the bottom left, after "Illus.".
        </p>
        <p>
          A fun detail to look for as you go: a lot of the attack names describe the art. A napping Pikachu knows Nap, the one
          hiding in the flowers has Keep Hidden, and the one diving into a pile of fruit uses Store Up. The notes below point out the
          best ones.
        </p>

        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={g.id}>
            <h2 id={g.id}>{g.label}</h2>
            <ol className="artist-list">
              {PIKACHU.filter((c) => c.no >= g.from && c.no <= g.to).map((c) => (
                <li key={c.no}>
                  <img
                    src={img(c.no)}
                    alt={`Pikachu ${num(c.no)}/128 (${of30(c.no)}/30) from 30th Celebration: ${c.art}, illustrated by ${c.illus}`}
                    loading="lazy"
                    width={400}
                    height={550}
                  />
                  <div>
                    <h3>{c.illus}</h3>
                    <p className="artist-num">
                      Pikachu {of30(c.no)}/30 · {num(c.no)}/128
                    </p>
                    <p>{c.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <h2 id="languages">One Pikachu, 12 languages</h2>
        <p>
          30th Celebration was printed in 12 languages: English, French, German, Italian, Spanish, Portuguese, Japanese, Korean,
          Traditional Chinese, Simplified Chinese, Thai and Indonesian. The 30 illustrations, the 30 artists and the 01/30 to 30/30
          badge are the same in all of them. The set number is what changes.
        </p>
        <p>
          The Japanese, Korean and Chinese sets have 103 cards in the main set, and their Pikachu run from 017 to 046. The English set
          adds more Pokémon ahead of them, so the same Pikachu start at 023. Thai and Indonesian follow the English order, out of 130.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-languages" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-languages" className="sr-only">
              How the 30 Pikachu are numbered in each language of 30th Celebration
            </caption>
            <thead>
              <tr>
                <th scope="col">Language</th>
                <th scope="col">Set name</th>
                <th scope="col">Code on the card</th>
                <th scope="col">The 30 Pikachu</th>
              </tr>
            </thead>
            <tbody>
              {LANGUAGES.map((l) => (
                <tr key={l.code + l.nos + String(l.lang)}>
                  <th scope="row">{l.lang}</th>
                  <td>{l.name}</td>
                  <td>{l.code}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.nos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Here is the Ken Sugimori Pikachu, 01/30, in five of those languages:</p>
        <ul className="card-grid">
          {COMPARE.map((c) => (
            <li key={c.lang}>
              <figure>
                <img
                  src={c.src}
                  alt={`Pikachu ${c.no} (01/30) by Ken Sugimori from the ${c.lang} 30th Celebration set`}
                  loading="lazy"
                  width={c.w}
                  height={c.h}
                  style={{ aspectRatio: `${c.w} / ${c.h}`, background: 'transparent', boxShadow: 'none' }}
                />
                <figcaption>
                  <strong>{c.lang}</strong>
                  {c.no}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="gold">The gold Pikachu cards in Shanghai</h2>
        <p>
          Pokémon China is showing 30 pure gold cards at its 30th Anniversary Shanghai Finale, from November 28, 2026 to January 3,
          2027. Read more in our{' '}
          <Link to="/blog/pokemon-30th-shanghai-gold-pikachu-cards-news">gold cards news post</Link>.
        </p>

        <h2 id="at-ebi">The Chinese version at EBI Collectibles</h2>
        <p>
          We carry the Simplified Chinese printing, <Zh>30周年庆典</Zh>. Same 30 Pikachu, same artists, numbered 017 to 046/103, and
          every pack has one. You will find the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-30th-celebration-booster-box' }}>
            30th Celebration booster box
          </Link>
          , the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }}>
            Dream Painting Pikachu figures
          </Link>{' '}
          and the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-plush-keychain' }}>
            Pikachu 30th plush keychains
          </Link>{' '}
          in the shop.
        </p>
        <p>More on 30th Celebration:</p>
        <ul>
          <li>
            <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link>
          </li>
          <li>
            <Link to="/blog/30th-celebration-release-news">30th Celebration release news</Link>
          </li>
          <li>
            <Link to="/blog/30th-celebration-card-origins">Where every 30th Celebration classic card comes from</Link>
          </li>
          <li>
            <Link to="/blog/japanese-30th-celebration-release-news">The Japanese 30th Celebration set</Link>
          </li>
          <li>
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures: all 12 and the secret</Link>
          </li>
        </ul>

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
