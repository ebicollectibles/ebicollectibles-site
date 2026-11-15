import { createFileRoute } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'funism-ditto-palm-size-wonders-release-news')!

const PHOTO = `${R2_IMAGE_HOST}/Chinese/Funism%20Ditto%20Blind%20Box`
const figImg = (slug: string) => `${SITE_URL}/assets/blog/ditto-figure-${slug}.webp`

// The 12 designs, ordered by how hard collectors chase the Pokémon Ditto is copying.
const LINEUP = [
  { slug: 'pikachu', name: 'Pikachu' },
  { slug: 'gengar', name: 'Gengar' },
  { slug: 'charmander', name: 'Charmander' },
  { slug: 'squirtle', name: 'Squirtle' },
  { slug: 'bulbasaur', name: 'Bulbasaur' },
  { slug: 'psyduck', name: 'Psyduck' },
  { slug: 'jigglypuff', name: 'Jigglypuff' },
  { slug: 'lapras', name: 'Lapras' },
  { slug: 'meowth', name: 'Meowth' },
  { slug: 'slowpoke', name: 'Slowpoke' },
  { slug: 'riolu', name: 'Riolu' },
  { slug: 'munchlax', name: 'Munchlax' },
]

const TOC = [
  { id: 'lineup', label: 'All 12 designs' },
  { id: 'chase', label: 'Is there a secret?' },
  { id: 'in-the-box', label: 'The box and the display' },
  { id: 'collecting', label: 'How to collect them' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many figures are in a Happy Ditto blind box?',
    a: 'Three. The display box is printed with 3粒/盒, three pieces per box, and each box is shaped like Ditto.',
  },
  {
    q: 'Which Pokémon does Ditto turn into?',
    a: 'Twelve: Bulbasaur, Charmander, Squirtle, Riolu, Pikachu, Meowth, Jigglypuff, Gengar, Lapras, Slowpoke, Munchlax and Psyduck.',
  },
  {
    q: 'Is there a secret or hidden Happy Ditto figure?',
    a: 'None is shown. The packaging and display box show 12 designs and no secret slot, and we have not seen an official mention of a hidden figure.',
  },
  {
    q: 'How many boxes are in a case?',
    a: 'Four. The case is Funism’s display box, which holds four Ditto-shaped blind boxes, so 12 figures in all.',
  },
  {
    q: 'Who makes the Happy Ditto figures?',
    a: 'Funism (玩乐主义), an officially licensed Pokémon figure maker in China. Happy Ditto is part of its Palm-Size Wonders (小小奇遇) series.',
  },
]

export const Route = createFileRoute('/blog/funism-ditto-palm-size-wonders-release-news')({
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
  component: FunismDittoReleasePost,
})

function FunismDittoReleasePost() {
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
        lede="Ditto tries to transform into 12 Pokémon and gets everything right except its own face. Three figures per box, and the box is a Ditto too."
        cta={{
          heading: 'Shop Happy Ditto',
          body: 'Single Ditto blind boxes, or the full four-box display.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box' }, label: 'Shop the blind box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box-case' }, label: 'Shop the 4-box case', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Happy Ditto (百变“快”乐) is a blind box from Funism's Palm-Size Wonders (小小奇遇) series of small Pokémon figures. The joke is
          in every figure: Ditto has copied a Pokémon's shape and colors, from Pikachu's ears to Psyduck's beak, but kept its own dot
          eyes and long flat smile. The box text says Ditto is still practising its Transform and has slipped up again, and asks you to
          spot what is a little off. Each Ditto-shaped box holds three figures.
        </p>

        <aside className="fact-box" aria-label="Happy Ditto key facts">
          <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-display-case-badged.webp`} alt="Funism Happy Ditto display box with four Ditto-shaped blind boxes" loading="lazy" width={1000} height={1000} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Palm-Size Wonders Happy Ditto blind box (小小奇遇系列 百变“快”乐)</dd>
              <dt>Maker</dt>
              <dd>Funism (玩乐主义), officially licensed</dd>
              <dt>Designs</dt>
              <dd>12 shown, no secret announced</dd>
              <dt>Per box</dt>
              <dd>3 random figures in a Ditto-shaped box</dd>
              <dt>Case</dt>
              <dd>Display box of 4 blind boxes, 12 figures</dd>
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

        <h2 id="lineup">All 12 designs</h2>
        <p>
          The lineup is mostly Kanto favorites, plus two picks from later generations, Riolu and Munchlax. Gengar is the one that suits the gag best, since its wide grin is swapped for Ditto's thin one.
        </p>
        <div className="card-grid cols-4">
          {LINEUP.map((f) => (
            <figure key={f.slug}>
              <img src={figImg(f.slug)} alt={`Funism Happy Ditto figure: Ditto as ${f.name}`} loading="lazy" width={336} height={296} style={{ aspectRatio: '336 / 296', objectFit: 'cover' }} />
              <figcaption>
                <strong>Ditto as {f.name}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
        <figure style={{ margin: '28px auto', maxWidth: 640 }}>
          <img
            src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-all-12-figures-badged.webp`}
            alt="All 12 Funism Happy Ditto figures with their names"
            loading="lazy"
            width={1000}
            height={1000}
            style={{ width: '100%', height: 'auto', borderRadius: 10 }}
          />
        </figure>

        <h2 id="chase">Is there a secret?</h2>
        <p>
          Not that we know of. The display box prints the lineup along its front edge, 12 figures with no secret slot, and we have not
          seen an official mention of a hidden figure. If that holds, this is one of the easier blind box lines to finish: the chase is simply
          the Pokémon you like most. For most people that will be Pikachu or
          Gengar.
        </p>

        <h2 id="in-the-box">The box and the display</h2>
        <p>
          The blind box itself is a purple Ditto, smile and all, with three random figures inside. Funism sells them in a display
          box that holds four Ditto boxes, 12 figures in all, with Gengar, Jigglypuff and Pikachu on the header card and the full lineup
          printed along the base. Our case listing is that display.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-ditto-shell-badged.webp`} alt="Funism Happy Ditto blind box shaped like Ditto" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
            <figcaption>
              <strong>Blind box</strong>3 random figures
            </figcaption>
          </figure>
          <figure>
            <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-display-case-badged.webp`} alt="Funism Happy Ditto display box holding four blind boxes" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
            <figcaption>
              <strong>Case</strong>4 boxes · 12 figures
            </figcaption>
          </figure>
        </div>

        <h2 id="collecting">How to collect them</h2>
        <p>
          With 12 designs and 3 figures a box, a four-box case holds 12 figures, the same number as there are designs. Funism has not
          officially said a case is one of each, so treat the figures as random. One box is a good way to try the line, and a case is
          the quickest start on the whole set.
        </p>
        <p>
          Palm-Size Wonders started in December 2024 with six figures of Pikachu, Charmander, Squirtle, Bulbasaur, Psyduck and Eevee,
          so if you already have those, Happy Ditto's Ditto versions of five of them make a fun pairing.
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

        <h2 id="our-take">Our take</h2>
        <p>
          It is a one-joke line and the joke works twelve times. No announced secret, three figures a box and a box you will want to keep make
          it an easy, friendly blind box, and Ditto-as-Gengar is the one we would put on the desk first.
        </p>
      </BlogPostLayout>
    </>
  )
}
