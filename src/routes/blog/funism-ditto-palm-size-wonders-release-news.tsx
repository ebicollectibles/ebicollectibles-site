import { Zh, zh } from '~/components/blog/Zh'
import { BuyStrip } from '~/components/blog/BlogShop'
import { createFileRoute } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
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
  { id: 'what-it-is', label: 'What is Funism Happy Ditto?' },
  { id: 'lineup', label: 'All 12 Happy Ditto figures' },
  { id: 'in-each-ditto', label: 'What comes in each Ditto?' },
  { id: 'sealed-case', label: 'Does a sealed case have all 12?' },
  { id: 'secret', label: 'Is there a secret figure?' },
  { id: 'single-or-case', label: 'One Ditto or a sealed case?' },
  { id: 'faq', label: 'FAQ' },
]

// Buying options side by side. The case row is the point of the post: a
// factory-sealed case is the only way to be sure of all 12.
const OPTIONS = [
  { row: 'What you get', single: '1 plastic Ditto', sealed: '4 plastic Dittos in a display case' },
  { row: 'Figures', single: '3', sealed: '12' },
  { row: 'Which figures', single: 'Random', sealed: 'One of each design' },
  { row: 'Duplicates', single: 'Possible if you buy more than one', sealed: 'None' },
  { row: 'Best for', single: 'Trying the line, or a small gift', sealed: 'Finishing the whole set in one go' },
]

const FAQ = [
  {
    q: 'What is Funism Happy Ditto?',
    a: 'A set of 12 small Pokémon figures made by Funism (玩乐主义), an officially licensed Pokémon figure maker in China. Each figure is Ditto transformed into another Pokémon, but still with Ditto’s own face. It is part of the Palm-Size Wonders (小小奇遇) series.',
  },
  {
    q: 'How many figures are in a Happy Ditto blind box?',
    a: 'Three. The blind box is a hollow plastic Ditto, and the display case is printed with 3粒/盒, three pieces per box. You do not know which three you have until you open it.',
  },
  {
    q: 'Does a sealed case of Happy Ditto have all 12 figures?',
    a: 'Yes. A factory-sealed case holds four plastic Dittos with three figures each, and together they are the 12 designs, one of each. Four Dittos bought loose can repeat, so the guarantee only applies to a case that is still sealed.',
  },
  {
    q: 'Which Pokémon does Ditto turn into?',
    a: 'Twelve: Bulbasaur, Charmander, Squirtle, Riolu, Pikachu, Meowth, Jigglypuff, Gengar, Lapras, Slowpoke, Munchlax and Psyduck.',
  },
  {
    q: 'Is there a secret or hidden Happy Ditto figure?',
    a: 'No. The packaging and the display case show 12 designs and no secret slot, and a sealed case of 12 figures is one of each of those 12.',
  },
  {
    q: 'How many Dittos are in a case?',
    a: 'Four. The case is Funism’s display box, which holds four plastic Dittos, so 12 figures in all.',
  },
  {
    q: 'Is the box itself a Ditto figure?',
    a: 'Yes. Each set of three figures comes inside a purple plastic Ditto with its usual dot eyes and smile, so you keep the container as a thirteenth Ditto for the shelf.',
  },
  {
    q: 'Who makes the Happy Ditto figures?',
    a: 'Funism (玩乐主义), an officially licensed Pokémon figure maker in China. Happy Ditto is part of its Palm-Size Wonders (小小奇遇) series.',
  },
]

export const Route = createFileRoute('/blog/funism-ditto-palm-size-wonders-release-news')({
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
  component: FunismDittoReleasePost,
})

function FunismDittoReleasePost() {
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
  const lineupJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All 12 Funism Happy Ditto figures',
    numberOfItems: LINEUP.length,
    itemListElement: LINEUP.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: `Ditto as ${f.name}`, image: figImg(f.slug) })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(lineupJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Funism's Happy Ditto figures show Ditto copying 12 Pokémon while keeping its own face. Three figures come inside each plastic Ditto, and a sealed case of four holds one of every design."
        cta={{
          heading: 'Shop Happy Ditto',
          body: 'One plastic Ditto with three random figures, or a sealed case with all 12.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box' }, label: 'Shop a single Ditto' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box-case' }, label: 'Shop the sealed case', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="what-it-is">What is Funism Happy Ditto?</h2>
        <p>
          Happy Ditto (<Zh>百变“快”乐</Zh>) is a set of 12 small Pokémon figures from Funism's Palm-Size Wonders (<Zh>小小奇遇</Zh>) series. Every
          figure is Ditto in the middle of a Transform that has not quite worked: it has copied a Pokémon's shape and colors, from
          Pikachu's ears to Psyduck's beak, but kept its own dot eyes and long flat smile.
        </p>
        <p>
          It is sold as a blind box, but the box is not cardboard. Each one is a hollow plastic Ditto with three random figures
          inside. Four of those Dittos make a case, and a sealed case holds all 12 figures, one of each.
        </p>

        <aside className="fact-box" aria-label="Happy Ditto key facts">
          <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-display-case-badged.webp`} alt="Funism Happy Ditto display case holding four plastic Dittos" loading="lazy" width={1000} height={1000} />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>Palm-Size Wonders Happy Ditto (<Zh>小小奇遇系列 百变“快”乐</Zh>)</dd>
              <dt>Maker</dt>
              <dd>Funism (<Zh>玩乐主义</Zh>), officially licensed</dd>
              <dt>Type</dt>
              <dd>Blind box figures</dd>
              <dt>Figures</dt>
              <dd>12 designs, no secret figure</dd>
              <dt>Per Ditto</dt>
              <dd>3 random figures inside a plastic Ditto</dd>
              <dt>Sealed case</dt>
              <dd>4 Dittos, all 12 figures, one of each</dd>
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

        <h2 id="lineup">All 12 Happy Ditto figures</h2>
        <p>
          Ditto turns into {LINEUP.slice(0, -1).map((f) => f.name).join(', ')} and {LINEUP[LINEUP.length - 1].name}. The lineup is mostly
          Kanto favorites, plus two picks from later generations, Riolu and Munchlax. Gengar works best, since its wide grin becomes
          Ditto's thin smile.
        </p>
        <ul className="card-grid cols-4">
          {LINEUP.map((f) => (
            <li key={f.slug}>
              <figure>
                <img src={figImg(f.slug)} alt={`Funism Happy Ditto figure: Ditto as ${f.name}`} loading="lazy" width={336} height={296} style={{ aspectRatio: '336 / 296', objectFit: 'cover' }} />
                <figcaption>
                  <strong>Ditto as {f.name}</strong>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
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

        <h2 id="in-each-ditto">What comes in each Ditto?</h2>
        <p>
          Three figures. The container is a purple plastic Ditto, smile and all, and it opens to show the three figures inside. The
          display case is printed with <Zh>3粒/盒</Zh>, three pieces per box.
        </p>
        <p>
          You do not know which three you have until you open it, which is why it is sold as a blind box. The plastic Ditto is worth
          keeping too: it is bigger than the figures and sits on a shelf next to them.
        </p>

        <BuyStrip />

        <h2 id="sealed-case">Does a sealed case have all 12?</h2>
        <p>
          Yes. Funism packs the Dittos in a display case of four, and a factory-sealed case holds all 12 designs, one of each. Four
          Dittos times three figures is 12, and none of them repeat.
        </p>
        <p>
          That only holds for a case that is still sealed. Four Dittos bought one at a time, or taken from different cases, are
          random and can repeat. Our case listing is the sealed display.
        </p>
        <ul className="card-grid cols-2">
          <li>
            <figure>
              <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-ditto-shell-badged.webp`} alt="Funism Happy Ditto: one plastic Ditto that holds three figures" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
              <figcaption>
                <strong>Single Ditto</strong>3 random figures
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-display-case-badged.webp`} alt="Funism Happy Ditto sealed display case holding four plastic Dittos" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
              <figcaption>
                <strong>Sealed case</strong>4 Dittos · all 12 figures
              </figcaption>
            </figure>
          </li>
        </ul>

        <h2 id="secret">Is there a secret figure?</h2>
        <p>
          No. The display case prints the lineup along its front edge, 12 figures with no secret slot, and a sealed case of 12 is one
          of each of those. That makes this one of the easier blind box lines to finish. The chase is whichever Pokémon you like
          most, and for most people that will be Pikachu or Gengar.
        </p>

        <h2 id="single-or-case">One Ditto or a sealed case?</h2>
        <p>
          It depends on whether you want the surprise or the full set. One Ditto gives you three random figures. A sealed case gives
          you every design with no duplicates.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-options" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-options" className="sr-only">
              A single Happy Ditto compared with a sealed case
            </caption>
            <thead>
              <tr>
                <td />
                <th scope="col">Single Ditto</th>
                <th scope="col">Sealed case</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((o) => (
                <tr key={o.row}>
                  <th scope="row">{o.row}</th>
                  <td>{o.single}</td>
                  <td>{o.sealed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Palm-Size Wonders started in December 2024 with six figures of Pikachu, Charmander, Squirtle, Bulbasaur, Psyduck and Eevee.
          If you already have those, Happy Ditto's Ditto versions of five of them make a fun pairing.
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
          Ditto dressed as other Pokémon is a simple idea, and it works on all twelve figures. There is no secret figure to hunt, the
          plastic Ditto is worth keeping, and a sealed case finishes the set in one purchase. Ditto as Gengar is our favorite.
        </p>
      </BlogPostLayout>
    </>
  )
}
