import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-7-card-origins')!

export const Route = createFileRoute('/blogs/news/gem-vol-7-card-origins')({
  head: () => ({
    meta: [
      { title: `${post.title} — EBI Collectibles` },
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
  component: GemVol7OriginsPost,
})

// Pokémon index in src/data/gem-vol-7.json -> which English-language set
// its artwork/card was first printed in. Researched against Bulbapedia,
// Card Codex, and set checklists per Pokémon — see the article body for
// which four Team Rocket entries are grouped by strong pattern (every
// other "Team Rocket's X" card checked came back Destined Rivals) rather
// than individually confirmed by collector number.
const ORIGIN_ROWS: Array<{ gem: string; set: 'Journey Together' | 'Destined Rivals'; setCode: string; note?: string }> = [
  { gem: "Team Rocket's Raticate", set: 'Destined Rivals', setCode: '148/182' },
  { gem: "Team Rocket's Meowth", set: 'Destined Rivals', setCode: '—', note: 'Team Rocket subset' },
  { gem: "Misty's Psyduck", set: 'Destined Rivals', setCode: '45/182' },
  { gem: 'Rapidash', set: 'Destined Rivals', setCode: '30/182' },
  { gem: "Team Rocket's Weezing", set: 'Destined Rivals', setCode: '126/182' },
  { gem: "Misty's Lapras", set: 'Destined Rivals', setCode: '50/182' },
  { gem: "Ethan's Typhlosion", set: 'Destined Rivals', setCode: '34/182' },
  { gem: "Team Rocket's Murkrow", set: 'Destined Rivals', setCode: '—', note: 'Team Rocket subset' },
  { gem: "Team Rocket's Wobbuffet", set: 'Destined Rivals', setCode: '—', note: 'Team Rocket subset' },
  { gem: 'Swinub', set: 'Journey Together', setCode: '77/159' },
  { gem: "Team Rocket's Houndoom", set: 'Destined Rivals', setCode: '38/182' },
  { gem: 'Blaziken ex', set: 'Journey Together', setCode: '24/159' },
  { gem: 'Clamperl', set: 'Destined Rivals', setCode: '—' },
  { gem: "Steven's Beldum", set: 'Destined Rivals', setCode: '143/182' },
  { gem: "Cynthia's Roserade", set: 'Destined Rivals', setCode: '8/182' },
  { gem: 'Shaymin', set: 'Destined Rivals', setCode: '10/182' },
  { gem: 'Crustle', set: 'Destined Rivals', setCode: '—' },
  { gem: "N's Zorua", set: 'Journey Together', setCode: '97/159' },
  { gem: "Lillie's Ribombee", set: 'Journey Together', setCode: '67/159' },
  { gem: 'Lycanroc', set: 'Journey Together', setCode: '—' },
  { gem: "Arven's Greedent", set: 'Destined Rivals', setCode: '159/182' },
  { gem: "Team Rocket's Orbeetle", set: 'Destined Rivals', setCode: '89/182' },
  { gem: "Hop's Wooloo", set: 'Journey Together', setCode: '135/159' },
  { gem: "Marnie's Morpeko", set: 'Destined Rivals', setCode: '137/182' },
  { gem: "Team Rocket's Spidops", set: 'Destined Rivals', setCode: '—', note: 'Team Rocket subset' },
  { gem: "Iono's Kilowattrel", set: 'Journey Together', setCode: '55/159' },
  { gem: 'Hydrapple', set: 'Destined Rivals', setCode: '—' },
  { gem: 'Furret', set: 'Journey Together', setCode: '119/159' },
]

const JTG_COUNT = ORIGIN_ROWS.filter((r) => r.set === 'Journey Together').length
const DRI_COUNT = ORIGIN_ROWS.filter((r) => r.set === 'Destined Rivals').length

function GemVol7OriginsPost() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    publisher: { '@type': 'Organization', name: 'EBI Collectibles' },
  }
  const sorted = [...ORIGIN_ROWS].sort((a, b) => a.gem.localeCompare(b.gem))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <BlogPostLayout
        post={post}
        lede="Every Gem Pack reprints existing English-language illustrations under new Chinese-only numbers rather than commissioning new art — which means every card in Gem Vol 7 traces back to a real English set. Here's exactly which one, Pokémon by Pokémon."
        cta={{
          heading: 'Browse the full Gem Vol 7 checklist',
          body: 'See every card, rarity, and version number alongside this guide.',
          links: [{ to: '/sets/gem-vol-7', label: 'Browse the card list' }],
        }}
      >
        <p>
          If you've opened Journey Together or Destined Rivals in English this year and the art in Gem Vol 7 looks familiar, that's
          not a coincidence — it's the whole point of a Gem Pack. The officially-licensed Gem Pack series is a Simplified
          Chinese-exclusive compilation line: rather than commissioning new illustrations, each volume reprints existing Pokémon TCG
          artwork under its own numbering and its own 7-tier rarity ladder (plus, usually, one genuinely new exclusive card).
        </p>
        <p>
          That makes "which set is this card actually from?" one of the most common questions about any Gem Pack release — especially
          for the "Trainer's Pokémon" cards, since that mechanic ran across more than one English set in 2025 and it's easy to assume
          they're all from the same place. They aren't. We went through Gem Vol 7's full 28-Pokémon roster and traced every one back to
          its source.
        </p>

        <h2>The short answer: two sets, both from 2025</h2>
        <p>
          Gem Vol 7 is built entirely from two English-language Scarlet & Violet expansions —{' '}
          <strong>Scarlet & Violet: Journey Together</strong> (SV9, released March 28, 2025) and{' '}
          <strong>Scarlet & Violet: Destined Rivals</strong> (SV10, released May 30, 2025). No other set contributes to this volume.
        </p>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-num">{JTG_COUNT}</div>
            <div className="stat-label">Pokémon from Journey Together (SV9)</div>
          </div>
          <div className="stat">
            <div className="stat-num">{DRI_COUNT}</div>
            <div className="stat-label">Pokémon from Destined Rivals (SV10)</div>
          </div>
        </div>

        <h2>How to tell them apart without checking a list</h2>
        <p>
          There's a clean pattern once you see it: every <strong>Team Rocket's [Pokémon]</strong> card in Gem Vol 7 comes from
          Destined Rivals — Team Rocket is that set's whole theme (its Japanese parent printing is actually titled Glory of Team
          Rocket). Trainer pairings for Misty, Steven, Cynthia, Arven, Ethan, and Marnie are Destined Rivals too. Meanwhile N, Hop,
          Iono, and Lillie's paired Pokémon all come from the earlier Journey Together — the set that introduced the "Trainer's
          Pokémon" mechanic in the first place. The handful of plain, non-paired species (Furret, Swinub, Blaziken, Lycanroc from
          Journey Together; Rapidash, Clamperl, Shaymin, Crustle, Hydrapple from Destined Rivals) just follow whichever set the rest
          of that printing's wave came from.
        </p>

        <div className="origin-wrap">
          <table className="origin-table">
            <thead>
              <tr>
                <th>Gem Vol 7 card</th>
                <th>Source set</th>
                <th>Original number</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.gem}>
                  <td>{r.gem}</td>
                  <td className={r.set === 'Journey Together' ? 'src-jtg' : 'src-dri'}>{r.set}</td>
                  <td>{r.note ?? r.setCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: 'var(--slate)' }}>
          Numbers are the original set's own English collector number (regular printing), for the Pokémon's non-full-art version —
          Gem Vol 7 renumbers everything under its own 01–28 index regardless. Four Team Rocket entries are listed by subset rather
          than an individually-confirmed number — every other "Team Rocket's [Pokémon]" card we checked came back Destined Rivals, so
          we're confident in the set, just not quoting an exact number we didn't verify directly.
        </p>

        <h2>What this means if you already collect the English sets</h2>
        <ul>
          <li>
            <strong>You already own the art, not necessarily the card.</strong> Gem Vol 7's full-art Triple Rares are new printings of
            existing illustrations — same art, different card number, different (usually simpler) border treatment than an English
            Illustration Rare or Special Illustration Rare.
          </li>
          <li>
            <strong>Misty's Psyduck is the one real exception.</strong> It's the set's single genuinely new illustration — it doesn't
            exist in Journey Together, Destined Rivals, or any other printing. Everything else in Gem Vol 7 is a reprint.
          </li>
          <li>
            <strong>Rarity doesn't carry over.</strong> A card that was a Common in Destined Rivals can be printed at any of Gem Vol
            7's 7 rarity slots depending on its version number — the Gem Pack ladder is independent of the source set's own rarity.
          </li>
        </ul>

        <h2>Why this matters for value and completism</h2>
        <p>
          If you're building a "Trainer's Pokémon" collection across languages, knowing the real source set tells you which English
          card to compare a Gem Vol 7 printing against for art, and which set's checklist to cross off once you've got it. If you're
          just chasing full arts, it's a reminder that <Link to="/blogs/news/gem-vol-7-has-arrived">Gem Vol 7's own exclusive</Link> —
          Misty's Psyduck — is the only card here you can't eventually track down in English.
        </p>
      </BlogPostLayout>
    </>
  )
}
