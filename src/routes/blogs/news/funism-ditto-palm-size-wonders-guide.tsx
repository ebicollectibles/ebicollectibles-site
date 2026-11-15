import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'funism-ditto-palm-size-wonders-guide')!

const PHOTO = `${R2_IMAGE_HOST}/Chinese/Funism%20Ditto%20Blind%20Box`
const figImg = (slug: string) => `${SITE_URL}/assets/blog/ditto-figure-${slug}.webp`

// Checklist in the order Funism prints it on the display box base.
const CHECKLIST = [
  { slug: 'bulbasaur', name: 'Bulbasaur', look: 'Mint green with darker green spots' },
  { slug: 'charmander', name: 'Charmander', look: 'Orange with a cream belly' },
  { slug: 'squirtle', name: 'Squirtle', look: 'Light blue, tan shell and belly' },
  { slug: 'pikachu', name: 'Pikachu', look: 'Yellow, black-tipped ears, red cheeks' },
  { slug: 'jigglypuff', name: 'Jigglypuff', look: 'Pink, round, curl on top and pointed ears' },
  { slug: 'meowth', name: 'Meowth', look: 'Cream, whiskers and a gold charm on its forehead' },
  { slug: 'psyduck', name: 'Psyduck', look: 'Yellow, cream beak, three hairs on top' },
  { slug: 'slowpoke', name: 'Slowpoke', look: 'Pink, round ears, cream muzzle' },
  { slug: 'gengar', name: 'Gengar', look: 'Purple, spiky back and pointed ears' },
  { slug: 'lapras', name: 'Lapras', look: 'Blue, curled horns, cream belly, shell' },
  { slug: 'munchlax', name: 'Munchlax', look: 'Teal head with two pointed ears, round cream feet' },
  { slug: 'riolu', name: 'Riolu', look: 'Blue, black mask band and drooping black ears' },
]

// If every figure were an equal, independent draw: chance of all 12 after n boxes of 3.
const MATH = [
  { boxes: '4 (one case)', figs: 12, chance: 'under 0.01%' },
  { boxes: '8', figs: 24, chance: 'about 15%' },
  { boxes: '10', figs: 30, chance: 'about 36%' },
  { boxes: '12', figs: 36, chance: 'about 56%' },
  { boxes: '15', figs: 45, chance: 'about 78%' },
  { boxes: '20', figs: 60, chance: 'about 94%' },
]

const LOOKALIKES = [
  { pair: 'Jigglypuff and Slowpoke', tell: 'Both pink. Jigglypuff has a curl of hair and dark-tipped pointed ears; Slowpoke has round ears and a cream muzzle under Ditto’s smile.' },
  { pair: 'Pikachu and Psyduck', tell: 'Both yellow. Pikachu has tall black-tipped ears and red cheeks; Psyduck has a cream beak and a tuft of three hairs.' },
  { pair: 'Squirtle and Lapras', tell: 'Both light blue. Lapras has two curled horns like round ears and sits on flippers; Squirtle has a plain round head.' },
  { pair: 'Riolu and Munchlax', tell: 'Both blue and dark. Riolu has a black band across its eyes and floppy black ears; Munchlax has a teal head with two pointed ears.' },
]

const TOC = [
  { id: 'checklist', label: 'The checklist' },
  { id: 'odds', label: 'How many boxes for a full set' },
  { id: 'case-or-box', label: 'Case or single boxes' },
  { id: 'tell-apart', label: 'Telling them apart' },
  { id: 'display', label: 'Displaying them' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'How many Happy Ditto figures are there?',
    a: '12, all of Ditto transformed into another Pokémon. The packaging shows no secret figure.',
  },
  {
    q: 'How many boxes do I need for all 12?',
    a: 'A case of four boxes holds 12 figures, one for every design. Funism does not print a packing guarantee on the box, and if every figure were a fully random draw a full set would take about 12 to 13 boxes on average.',
  },
  {
    q: 'Can I get two of the same figure in one box?',
    a: 'Funism does not say on the packaging, so treat each box as three random figures.',
  },
  {
    q: 'Which Happy Ditto figures are easy to mix up?',
    a: 'The pairs that share a color: Jigglypuff and Slowpoke (pink), Pikachu and Psyduck (yellow), Squirtle and Lapras (light blue), and Riolu and Munchlax (blue and dark).',
  },
]

export const Route = createFileRoute('/blogs/news/funism-ditto-palm-size-wonders-guide')({
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
  component: FunismDittoGuide,
})

function FunismDittoGuide() {
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
        lede="All 12 Happy Ditto figures, what a full set takes, and how to tell the look-alikes apart."
        cta={{
          heading: 'Collect Happy Ditto',
          body: 'The four-box case holds 12 figures, one per design. Or start with a single Ditto box.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box-case' }, label: 'Shop the 4-box case' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-funism-ditto-palmsize-wonders-blind-box' }, label: 'Shop a blind box', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Funism's Palm-Size Wonders Happy Ditto has 12 figures, three to a Ditto-shaped blind box. Our{' '}
          <Link to="/blogs/news/funism-ditto-palm-size-wonders-has-arrived">release post</Link> covers the line. This guide is the
          checklist.
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

        <h2 id="checklist">The checklist</h2>
        <p>In the order Funism prints them along the base of the display box. Every figure keeps Ditto's dot eyes and flat smile.</p>
        <div className="card-grid cols-4">
          {CHECKLIST.map((f) => (
            <figure key={f.slug}>
              <img src={figImg(f.slug)} alt={`Funism Happy Ditto figure: Ditto as ${f.name}`} loading="lazy" width={336} height={296} style={{ aspectRatio: '336 / 296', objectFit: 'cover' }} />
              <figcaption>
                <strong>Ditto as {f.name}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ditto as</th>
                <th scope="col">How to spot it</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST.map((f, i) => (
                <tr key={f.slug}>
                  <th scope="row">{String(i + 1).padStart(2, '0')}</th>
                  <td>{f.name}</td>
                  <td>{f.look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">The packaging shows these 12 and no secret slot.</p>

        <h2 id="odds">How many boxes for a full set</h2>
        <p>
          Funism prints no odds and no packing pattern on the box, so here is the cautious case: every figure an equal, independent
          draw. Twelve designs then take about 37 figures on average to complete, which is about 12 to 13 boxes of three. The chance
          of a full set after a given number of boxes:
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Boxes</th>
                <th scope="col">Figures</th>
                <th scope="col">Chance of all 12</th>
              </tr>
            </thead>
            <tbody>
              {MATH.map((m) => (
                <tr key={m.boxes}>
                  <th scope="row">{m.boxes}</th>
                  <td>{m.figs}</td>
                  <td>{m.chance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Computed for fully random packing. Real displays are not necessarily random, so treat this as the worst case.</p>

        <h2 id="case-or-box">Case or single boxes</h2>
        <p>
          A case is one display box: four blind boxes, 12 figures, the same number as there are designs. That is the shortest route to
          the set and the only way to get the display box, which has the whole lineup printed on it. A single box is three figures and
          a Ditto to keep, a good way to try the line or to hunt one favorite.
        </p>
        <div className="card-grid cols-2">
          <figure>
            <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-ditto-shell-badged.webp`} alt="Funism Happy Ditto blind box shaped like Ditto" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
            <figcaption>
              <strong>Blind box</strong>3 figures
            </figcaption>
          </figure>
          <figure>
            <img src={`${PHOTO}/pokemon-chinese-funism-ditto-transform-blind-box-display-case-badged.webp`} alt="Funism Happy Ditto display box with four blind boxes" loading="lazy" width={1000} height={1000} style={{ aspectRatio: '1 / 1' }} />
            <figcaption>
              <strong>Case</strong>4 boxes · 12 figures
            </figcaption>
          </figure>
        </div>

        <h2 id="tell-apart">Telling them apart</h2>
        <p>Every face is the same, so you go by color and shape. Four pairs share a color:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col">The difference</th>
              </tr>
            </thead>
            <tbody>
              {LOOKALIKES.map((l) => (
                <tr key={l.pair}>
                  <th scope="row">{l.pair}</th>
                  <td>{l.tell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="display">Displaying them</h2>
        <p>
          Keep the display box. Its base prints all 12 designs in a row with their names, so it works as a shelf label, and the four
          Ditto boxes sit in it with their smiles facing out. They are all small, squat figures, so they line up neatly in a row. Group them
          by color, so the look-alike pairs sit side by side and the gag lands, or line them up in the box order above.
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
