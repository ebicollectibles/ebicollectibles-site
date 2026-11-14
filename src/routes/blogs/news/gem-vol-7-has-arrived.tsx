import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'gem-vol-7-has-arrived')!

export const Route = createFileRoute('/blogs/news/gem-vol-7-has-arrived')({
  head: () => ({
    meta: [
      { title: `${post.title} — EBI Collectibles` },
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
  component: GemVol7Post,
})

function GemVol7Post() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    publisher: { '@type': 'Organization', name: 'EBI Collectibles' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <BlogPostLayout
        post={post}
        lede="The 7th Simplified Chinese Gem Pack is out, built around Trainer's Pokémon pulled from two of the biggest English-language sets of the year, with one full art you can only get here."
        cta={{
          heading: 'Shop Gem Vol 7',
          body: 'Booster boxes in stock now, plus the full 196-card checklist with every rarity.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Shop the booster box' },
            { to: '/sets/gem-vol-7', label: 'Browse the card list', variant: 'ghost' },
          ],
        }}
      >
        <p>
          Gem Vol 7 (set code CBB7C) released November 6, 2026 — the seventh entry in the Simplified Chinese Gem Pack series, and the
          biggest roster yet at 28 Pokémon. Every pack holds 4 holo cards, 18 packs to a box, printed in Japan for the mainland
          Chinese market.
        </p>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-num">196</div>
            <div className="stat-label">Total cards</div>
          </div>
          <div className="stat">
            <div className="stat-num">28</div>
            <div className="stat-label">Pokémon, each with 7 versions</div>
          </div>
          <div className="stat">
            <div className="stat-num">1</div>
            <div className="stat-label">Chinese-exclusive full art</div>
          </div>
          <div className="stat">
            <div className="stat-num">4</div>
            <div className="stat-label">Cards per pack, all holo</div>
          </div>
        </div>

        <h2>A full ladder for every Pokémon</h2>
        <p>
          Gem Vol 7 keeps the structure that's defined the Gem Pack series since Volume 1: every one of the 28 Pokémon gets printed
          across all 7 version slots, from Common up to a full-art Triple Rare. Versions 01–02 are Common, 03–04 Uncommon, 05 Rare,
          06 Double Rare, and 07 is the chase slot — a full-art Triple Rare. Read a card number as Pokémon index, then version: 0307/07
          is the 7th version (the full art) of the 3rd Pokémon in the set.
        </p>
        <p>
          That math works out to 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare, and 28 Triple Rare — the 28 full arts are what most
          collectors are actually opening boxes for.
        </p>

        <h2>Trainer's Pokémon, borrowed from two of 2025's biggest sets</h2>
        <p>
          The headline feature this volume is the trainer-pairing theme — more than half the roster is printed as "[Trainer]'s
          [Pokémon]" rather than a plain species name: Team Rocket's Raticate, Misty's Psyduck, Cynthia's Roserade, N's Zorua,
          Marnie's Morpeko, and more. That's not new artwork commissioned for Gem Vol 7 — it's the exact "Trainer's Pokémon" mechanic
          that ran through <strong>Scarlet & Violet: Journey Together</strong> and <strong>Scarlet & Violet: Destined Rivals</strong> in
          English earlier in 2025, reprinted here under new Chinese Gem Pack numbers. We've broken down exactly which Pokémon came
          from which set in a <Link to="/blogs/news/gem-vol-7-card-origins">separate full guide</Link> — short version: the whole Team
          Rocket half of the set traces to Destined Rivals, while N, Hop, Iono, and Lillie's cards trace to Journey Together.
        </p>

        <h2>
          Misty's Psyduck — the one card you can't get anywhere else
        </h2>
        <p>
          Every Gem Pack carries at least one genuinely exclusive illustration, and Vol 7's is <strong>Misty's Psyduck (0307/07)</strong>
          — a full art that doesn't exist in any English, Japanese, or other-language printing. If you want it, Gem Vol 7 is the only
          way to get it.
        </p>

        <div className="card-strip">
          {[
            { id: '0307', name: "Misty's Psyduck" },
            { id: '1907', name: "N's Zorua" },
            { id: '2507', name: "Marnie's Morpeko" },
            { id: '0107', name: "Team Rocket's Raticate" },
            { id: '2707', name: "Iono's Kilowattrel" },
          ].map((c) => (
            <div key={c.id} className="card-strip-item">
              <img src={`${R2_IMAGE_HOST}/Chinese/Gem%207/Cards/${c.id}.webp`} alt={`${c.name} full art, Gem Vol 7`} loading="lazy" />
              <div className="cap">{c.name}</div>
            </div>
          ))}
        </div>

        <blockquote className="pull-quote">
          28 Pokémon, 7 versions each, and one full art that only exists in this set.
        </blockquote>

        <h2>Who else is in the set</h2>
        <p>
          Beyond the trainer-paired cards, Gem Vol 7 fills out its roster with Rapidash, Furret, Swinub, Blaziken, Clamperl, Shaymin,
          Crustle, Lycanroc, and Hydrapple — all pulled from the same two source sets, just printed under their plain species names
          rather than a trainer pairing.
        </p>

        <h2>Our take</h2>
        <p>
          If you already picked up Journey Together or Destined Rivals in English, the art here will look familiar — that's the
          point of a Gem Pack. What makes Vol 7 worth a look either way is Misty's Psyduck and the fact that a full 196-card, 7-tier
          ladder is a genuinely large set to build out for the price of a pack.
        </p>
      </BlogPostLayout>
    </>
  )
}
