import { Zh, zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-pikachu-cards-artists')!

const img = (no: number) => `${SITE_URL}/assets/blog/pikachu-30-artists-${String(no).padStart(3, '0')}.webp`

interface PikachuCard {
  /** Set number, out of 103 */
  no: number
  illus: string
  /** What the art shows, for the image alt text */
  art: string
  note: ReactNode
}

// The 30 Pikachu in the Simplified Chinese 30th Celebration set, 017/103 to 046/103.
// Each card is also numbered 01/30 to 30/30. Illustrator names are as printed on the cards.
const PIKACHU: PikachuCard[] = [
  {
    no: 17,
    illus: 'Ken Sugimori',
    art: 'a round, classic-style Pikachu standing in a green forest with small bolts of lightning around it',
    note: (
      <>
        A round, old-school Pikachu stands in a green forest with little bolts of lightning around it. It is a fresh take on
        Sugimori's own Pikachu from the Jungle set of 1999. Sugimori drew the original art for the first Pokémon games and has
        illustrated cards since the very start.
      </>
    ),
  },
  {
    no: 18,
    illus: 'danciao',
    art: 'Pikachu charging forward in a burst of red and gold electricity as rocks break apart around it',
    note: (
      <>
        Pikachu charges straight at you in a burst of red and gold electricity, with rocks breaking apart around it. Its attack is{' '}
        <Zh>伏特攻击</Zh>, Volt Tackle, and the art looks just like it. This is one of the most action-packed cards of the 30.
      </>
    ),
  },
  {
    no: 19,
    illus: 'satoma',
    art: 'Pikachu sitting on a teal stool in a sunny garden full of flowers',
    note: (
      <>
        Pikachu sits on a little teal stool in a sunny garden full of flowers. satoma's soft, light colors give it the feel of a
        watercolor.
      </>
    ),
  },
  {
    no: 20,
    illus: 'Takeshi Nakamura',
    art: 'Pikachu hanging upside down into the frame and looking straight at the viewer, with blue sky behind it',
    note: (
      <>
        Pikachu hangs upside down into the picture and stares right at you, with blue sky behind it. Its attack name,{' '}
        <Zh>窥视</Zh>, means "peek", which fits the pose perfectly.
      </>
    ),
  },
  {
    no: 21,
    illus: 'Asako Ito',
    art: 'a crochet-style Pikachu napping on the grass',
    note: (
      <>
        A crocheted Pikachu naps on the grass with its eyes shut. Asako Ito is known for Pokémon made from yarn, and her card art
        is a photo of her handmade work. The attack, <Zh>稍事休息</Zh>, means "take a short rest".
      </>
    ),
  },
  {
    no: 22,
    illus: 'sowsow',
    art: 'Pikachu sitting among soft pillows holding a Poké Ball, with a Ditto on a cushion beside it',
    note: (
      <>
        Pikachu sits among soft pillows holding a Poké Ball, with a Ditto on the cushion next to it and a framed picture on
        the wall. The pastel, hand-drawn look makes it one of the coziest cards in the set.
      </>
    ),
  },
  {
    no: 23,
    illus: 'James Turner',
    art: 'a flat, sticker-style Pikachu bouncing past a Poké Ball on a teal background dotted with flowers',
    note: (
      <>
        A flat, sticker-style Pikachu bounces past a Poké Ball on a teal background dotted with purple flowers. Thick outlines and
        bright flat color are James Turner's trademark. Turner is a Game Freak artist who has also designed Pokémon for the games.
      </>
    ),
  },
  {
    no: 24,
    illus: 'DOM',
    art: 'Pikachu glowing with lightning as it races through a city at night',
    note: (
      <>
        Pikachu races through a city at night, wrapped in purple and yellow lightning. DOM's art here is all speed and glow.
      </>
    ),
  },
  {
    no: 25,
    illus: 'Atsushi Furusawa',
    art: 'Pikachu sitting on a cluttered desk beside an old computer, books and pens, looking over its shoulder',
    note: (
      <>
        Seen from behind, Pikachu sits on a cluttered desk beside an old computer, books and pens, and glances over its shoulder.
        It feels like a peek into someone's room.
      </>
    ),
  },
  {
    no: 26,
    illus: 'Tomokazu Komiya',
    art: 'Pikachu tumbling past a giant pink broom through a rainy, swirling scene',
    note: (
      <>
        Pikachu tumbles past a giant pink broom through a rainy, swirling scene. It is one of the strangest cards of the 30, and
        that is the point: Tomokazu Komiya has drawn Pokémon cards since the early days and is known for his unusual, offbeat style.
      </>
    ),
  },
  {
    no: 27,
    illus: 'Narumi Sato',
    art: 'Pikachu peeking out from a bush of pink flowers in bright sunlight',
    note: (
      <>
        Pikachu peeks out from a bush of pink flowers in bright sunlight. Its Ability, <Zh>藏身</Zh>, means "hide", and the art
        shows it doing just that.
      </>
    ),
  },
  {
    no: 28,
    illus: 'USGMEN',
    art: 'a flat, cut-out style Pikachu hopping across a green lawn next to a tree stump',
    note: (
      <>
        A flat, cut-out style Pikachu hops across a green lawn next to a tree stump. The simple shapes and bold outline give it a
        fun, modern look.
      </>
    ),
  },
  {
    no: 29,
    illus: 'Susumu Maeya',
    art: 'Pikachu rolling on its back in a carpet of red and orange autumn leaves',
    note: (
      <>
        Pikachu rolls on its back in a carpet of red and orange autumn leaves, eyes shut and smiling. Its attack is{' '}
        <Zh>滚动</Zh>, Rollout.
      </>
    ),
  },
  {
    no: 30,
    illus: 'OKACHEKE',
    art: 'Pikachu leaning over a wooden railing and smiling',
    note: (
      <>
        Pikachu leans over a wooden railing with a big grin, as if caught in the middle of climbing it. The warm wood and soft
        light give it a homey, painted feel.
      </>
    ),
  },
  {
    no: 31,
    illus: 'Yuu Nishida',
    art: 'Pikachu leaping toward the viewer with a happy shout, its tail crackling against a bright green background',
    note: (
      <>
        Pikachu leaps toward you with a happy shout, its tail crackling against a bright green and blue background. The bold,
        sunny colors make it one of the most cheerful cards in the set.
      </>
    ),
  },
  {
    no: 32,
    illus: 'Tetsu Kayama',
    art: 'a determined Pikachu crouching under big leaves with its cheeks sparking',
    note: (
      <>
        A tougher Pikachu crouches under big leaves with its brow furrowed and its cheeks sparking. It is one of the few serious
        faces in the set.
      </>
    ),
  },
  {
    no: 33,
    illus: 'Teeziro',
    art: 'a tiny Pikachu resting at the doorstep of an old house with wooden doors, surrounded by trees and plants',
    note: (
      <>
        A tiny Pikachu rests on the doorstep of an old house with tall wooden doors, half hidden by trees and plants. Teeziro lets
        the painted scene do the talking, and Pikachu is just a small yellow spot in it.
      </>
    ),
  },
  {
    no: 34,
    illus: 'Shinji Kanda',
    art: 'Pikachu cheering with its arms up in a bright burst of rainbow patterns and flowers',
    note: (
      <>
        Pikachu cheers with its arms up in an explosion of rainbow patterns, flowers and dots. Every corner is packed with detail,
        which is what Shinji Kanda's cards are known for.
      </>
    ),
  },
  {
    no: 35,
    illus: 'Rianti Hidayat',
    art: 'Pikachu hanging from a tree branch with a big smile, framed by jungle leaves',
    note: (
      <>
        Pikachu hangs from a tree branch with a big open-mouthed smile, framed by jungle leaves. Its first attack is even called{' '}
        <Zh>垂吊</Zh>, "hang".
      </>
    ),
  },
  {
    no: 36,
    illus: 'Akira Komayama',
    art: 'Pikachu running through tall pink grass under a bright blue sky',
    note: (
      <>
        Pikachu dashes through tall pink grass under a blue sky full of streaks and shapes. Akira Komayama is a long-time card
        illustrator with a clean, bright, anime-like style.
      </>
    ),
  },
  {
    no: 37,
    illus: 'OOYAMA',
    art: 'a crayon-style drawing of Pikachu lounging on a beach with palm trees, a boat and a smiling sun',
    note: (
      <>
        Drawn like a child's crayon picture, Pikachu lounges on a beach with palm trees, a little boat and a smiling sun. Its attack,{' '}
        <Zh>南国心境</Zh>, means "tropical mood", and it puts Pikachu to sleep.
      </>
    ),
  },
  {
    no: 38,
    illus: 'akagi',
    art: 'Pikachu bursting out of a swirl of after-images',
    note: (
      <>
        Pikachu bursts out of a swirl of after-images, like a photo of something moving too fast to catch. The attack is{' '}
        <Zh>高速移动</Zh>, Agility.
      </>
    ),
  },
  {
    no: 39,
    illus: 'Naoyo Kimura',
    art: 'Pikachu walking past white snowball flowers under an evening sky',
    note: (
      <>
        Pikachu strolls past round white flowers under a deep blue evening sky. Its attack, <Zh>夜间散步</Zh>, means "night walk".
      </>
    ),
  },
  {
    no: 40,
    illus: 'svlt',
    art: 'Pikachu sitting on a mossy rock in the breeze next to pink flowers',
    note: (
      <>
        Pikachu sits on a mossy rock with its eyes half shut in the breeze, next to pink flowers. It is a quiet, calm card, and the
        soft greens do most of the work.
      </>
    ),
  },
  {
    no: 41,
    illus: 'Atsuko Nishida',
    art: 'Pikachu skipping through a sunny meadow with hills behind it',
    note: (
      <>
        Pikachu skips through a sunny meadow with green hills behind it. Atsuko Nishida first designed Pikachu at Game Freak, so this
        one comes straight from the source.
      </>
    ),
  },
  {
    no: 42,
    illus: 'KIYOTAKA OSHIYAMA',
    art: 'Pikachu diving face-first into a pile of grapes, strawberries and other fruit, drawn with thick black outlines',
    note: (
      <>
        Pikachu dives face-first into a pile of grapes, strawberries and other fruit, all drawn with thick black outlines and bold
        color.
      </>
    ),
  },
  {
    no: 43,
    illus: 'Nurikabe',
    art: 'a close, painted portrait of Pikachu with a sly smile against a dark, sparkling background',
    note: (
      <>
        A close, glowing portrait of Pikachu with a sly little smile against a dark, sparkling background. It looks more like an oil
        painting than a cartoon.
      </>
    ),
  },
  {
    no: 44,
    illus: 'Shimaris Yukichi',
    art: 'Pikachu sitting in a meadow with its cheeks full and its eyes squeezed shut, surrounded by berries',
    note: (
      <>
        Pikachu sits in a meadow with its mouth full and its eyes squeezed shut, surrounded by berries. The soft, storybook style
        makes it one of the sweetest cards of the 30.
      </>
    ),
  },
  {
    no: 45,
    illus: 'nagimiso',
    art: 'Pikachu diving down out of the sky in a crackle of lightning',
    note: (
      <>
        Pikachu dives out of a starry sky in a crackle of green and yellow lightning, ready to strike. The sharp angles give it the
        energy of a comic book panel.
      </>
    ),
  },
  {
    no: 46,
    illus: 'Kazuki Minami',
    art: 'Pikachu winding up a punch as the background shatters into streaks of light',
    note: (
      <>
        Pikachu winds up a punch as the background shatters into streaks of light. It closes the run of 30 with a bang.
      </>
    ),
  },
]

const of30 = (no: number) => String(no - 16).padStart(2, '0')

const GROUPS = [
  { id: 'cards-01-10', label: 'Pikachu 01 to 10', from: 17, to: 26 },
  { id: 'cards-11-20', label: 'Pikachu 11 to 20', from: 27, to: 36 },
  { id: 'cards-21-30', label: 'Pikachu 21 to 30', from: 37, to: 46 },
]

const TOC = [
  { id: 'about', label: 'About the 30 Pikachu' },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label })),
  { id: 'gold', label: 'The gold Pikachu cards in Shanghai' },
  { id: 'at-ebi', label: '30th Celebration at EBI Collectibles' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many Pikachu cards are in 30th Celebration?',
    a: 'There are 30. They are numbered 017/103 to 046/103, and each card also shows its place in the run, from 01/30 to 30/30.',
  },
  {
    q: 'Is there a Pikachu in every pack?',
    a: 'Yes. Every 30th Celebration pack has one of the 30 Pikachu.',
  },
  {
    q: 'Who drew the 30 Pikachu cards?',
    a: '30 different illustrators, one for each card. They include Ken Sugimori, who drew the art for the first Pokémon games, and Atsuko Nishida, who first designed Pikachu.',
  },
  {
    q: 'Where is the artist name on the card?',
    a: 'At the bottom left, just above the card number, after "Illus.".',
  },
  {
    q: 'What rarity are the 30 Pikachu?',
    a: 'They have their own rarity, Pikachu Rare.',
  },
  {
    q: 'How many Pikachu are in a booster box?',
    a: 'A box has 20 packs, so 20 Pikachu. They come at random, so one box cannot give you all 30, and you will usually get some doubles.',
  },
  {
    q: 'Do the Chinese and English sets have the same Pikachu?',
    a: 'Yes, the same 30 illustrations. In the English set they are numbered 023 to 052 instead of 017 to 046.',
  },
  {
    q: 'When did 30th Celebration come out?',
    a: 'On September 16, 2026, in China and around the world.',
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
    name: 'The 30 Pikachu cards in 30th Celebration',
    numberOfItems: PIKACHU.length,
    itemListElement: PIKACHU.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Pikachu ${String(c.no).padStart(3, '0')}/103 (${of30(c.no)}/30), illustrated by ${c.illus}`,
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
        lede="Every pack of 30th Celebration has one of 30 different Pikachu, and each one was drawn by a different artist. Here are all 30, with a little about each card and the artist behind it."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'The booster box, the Dream Painting Pikachu figures and the Pikachu 30th plush keychains.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/blog/30th-celebration-set-guide', label: 'Read the 30th Celebration set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration is the Pokémon TCG's 30th anniversary set. It released on September 16, 2026, in China and around the
          world, and Pikachu is the star. The set has 30 different Pikachu cards, and every pack has one.
        </p>
        <p>
          Each of the 30 was drawn by a different illustrator. Some are legends, like Ken Sugimori and Atsuko Nishida, who first
          designed Pikachu. Others are newer names. Together they show just how many ways there are to draw one little yellow
          mouse.
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

        <h2 id="about">About the 30 Pikachu</h2>
        <p>
          The 30 Pikachu are numbered 017/103 to 046/103 in the Simplified Chinese set. Each card also has a small Pikachu badge
          showing its place in the run, from 01/30 to 30/30. They share the same frame, with a big Pikachu silhouette behind the
          attacks, and they have their own rarity, Pikachu Rare.
        </p>
        <p>
          The artist's name is printed at the bottom left of each card, after "Illus.". The names below are as printed on the
          Simplified Chinese cards. Many attack names match the art, so we have added a few of those too.
        </p>

        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={g.id}>
            <h2 id={g.id}>{g.label}</h2>
            <ol className="artist-list">
              {PIKACHU.filter((c) => c.no >= g.from && c.no <= g.to).map((c) => {
                const num = String(c.no).padStart(3, '0')
                return (
                  <li key={c.no}>
                    <img
                      src={img(c.no)}
                      alt={`Pikachu ${num}/103 (${of30(c.no)}/30) from 30th Celebration: ${c.art}, illustrated by ${c.illus}`}
                      loading="lazy"
                      width={300}
                      height={419}
                    />
                    <div>
                      <h3>{c.illus}</h3>
                      <p className="artist-num">
                        Pikachu {of30(c.no)}/30 · {num}/103
                      </p>
                      <p>{c.note}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}

        <h2 id="gold">The gold Pikachu cards in Shanghai</h2>
        <p>
          Pokémon China is showing 30 pure gold cards at its 30th Anniversary Shanghai Finale, from November 28, 2026 to January 3,
          2027. Read more in our{' '}
          <Link to="/blog/pokemon-30th-shanghai-gold-pikachu-cards-news">gold cards news post</Link>.
        </p>

        <h2 id="at-ebi">30th Celebration at EBI Collectibles</h2>
        <p>
          Every pack has one of the 30 Pikachu. We sell the{' '}
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
          </Link>
          .
        </p>
        <p>More on the 30th Celebration:</p>
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
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures: all 12 and the secret</Link>
          </li>
        </ul>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{zh(f.a)}</p>
            </details>
          ))}
        </div>
      </BlogPostLayout>
    </>
  )
}
