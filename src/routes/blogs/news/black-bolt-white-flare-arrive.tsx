import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'black-bolt-white-flare-arrive')!

export const Route = createFileRoute('/blogs/news/black-bolt-white-flare-arrive')({
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
  component: BlackBoltWhiteFlarePost,
})

function BlackBoltWhiteFlarePost() {
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
        lede="Unova's legendary dragons headline a pair of officially-licensed Scarlet & Violet expansions that split one 156-Pokémon roster right down the middle."
        cta={{
          heading: 'Shop Black Bolt & White Flare',
          body: 'Booster boxes for both sets, Jumbo and Slim, in stock now — plus the full checklists for each.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-slim-booster-box' }, label: 'Shop Black Bolt' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-white-flare-slim-booster-box' }, label: 'Shop White Flare' },
          ],
        }}
      >
        <p>
          <strong>Black Bolt</strong> (set code CSV10.5C) and <strong>White Flare</strong> (CSV10.6C) are officially-licensed Pokémon
          TCG expansions in the Chinese Scarlet & Violet series, released together on November 6, 2026. Unlike the Gem Pack line,
          these aren't a compilation — they're the real, full Unova-region expansion, split into Pokémon-styled twin sets the same
          way the English and Japanese versions were released earlier in 2025.
        </p>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-num">174</div>
            <div className="stat-label">Cards in each set</div>
          </div>
          <div className="stat">
            <div className="stat-num">156</div>
            <div className="stat-label">Pokémon split across both, 78 each (6 ex)</div>
          </div>
          <div className="stat">
            <div className="stat-num">8</div>
            <div className="stat-label">Rarity tiers, Common to BWR</div>
          </div>
          <div className="stat">
            <div className="stat-num">2</div>
            <div className="stat-label">Special Art Rares, one per set</div>
          </div>
        </div>

        <h2>One Pokédex, two mascots</h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', margin: '4px 0 24px', flexWrap: 'wrap' }}>
          <img
            src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/black-bolt-logo.webp`}
            alt="Black Bolt set logo (黑雷奔流)"
            loading="lazy"
            width={588}
            height={180}
            style={{ width: 220, height: 'auto' }}
          />
          <img
            src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/white-flare-logo.webp`}
            alt="White Flare set logo (白焰迸涌)"
            loading="lazy"
            width={588}
            height={180}
            style={{ width: 220, height: 'auto' }}
          />
        </div>
        <p>
          Black Bolt and White Flare divide Unova's 156 featured Pokémon (6 of them ex) between two 174-card sets, 78 Pokémon each. Each half gets its
          own legendary mascot: Black Bolt is built around <strong>Zekrom ex</strong>, White Flare around <strong>Reshiram ex</strong> —
          the same split used for the English and Japanese printings this spring.
        </p>
        <p>
          Every card in both sets has its own unique collector number, 001 through 174 — unlike the Gem Pack series, there's no
          repeating version ladder here. The first 86 numbers are the main set (Pokémon, Trainers, and a Special Energy in mixed
          rarities up to Double Rare); the 88 secret rares that follow reprint select cards in progressively rarer treatments — an
          Art Rare for every non-ex Pokémon, then a Super Rare and Special Art Rare for each ex Pokémon and two Supporters, capped by
          a single Black White Rare in each set.
        </p>

        <h2>Pack sizes and pricing</h2>
        <p>
          Both sets ship in two pack sizes: a ¥10 pack with 5 cards (1 holo) and a ¥50 pack with 20 cards (7 holos). The larger pack
          carries noticeably better odds at every rarity tier above Common/Uncommon, so it's the better per-card value if you're
          chasing secret rares specifically.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', margin: '0 0 28px' }}>
          <img
            src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/black-bolt-white-flare-release-poster.webp`}
            alt="Official Black Bolt and White Flare release poster showing both pack sizes for each set"
            loading="lazy"
            width={1080}
            height={2374}
            style={{ display: 'block', maxWidth: 320, width: '100%', borderRadius: 12, boxShadow: 'var(--shadow)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 220, width: '100%' }}>
            <div>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/black-bolt-booster-packs-5-and-20-card.webp`}
                alt="Black Bolt booster packs in 5-card and 20-card sizes, Zekrom on the front"
                loading="lazy"
                width={470}
                height={430}
                style={{ display: 'block', width: '100%', borderRadius: 12, boxShadow: 'var(--shadow)' }}
              />
              <p style={{ fontSize: 12.5, color: 'var(--slate)', textAlign: 'center', margin: '6px 0 0' }}>Black Bolt packs</p>
            </div>
            <div>
              <img
                src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/white-flare-booster-packs-5-and-20-card.webp`}
                alt="White Flare booster packs in 5-card and 20-card sizes, Reshiram on the front"
                loading="lazy"
                width={465}
                height={435}
                style={{ display: 'block', width: '100%', borderRadius: 12, boxShadow: 'var(--shadow)' }}
              />
              <p style={{ fontSize: 12.5, color: 'var(--slate)', textAlign: 'center', margin: '6px 0 0' }}>White Flare packs</p>
            </div>
          </div>
        </div>

        <h2>The chase cards</h2>
        <p>
          Each set's Black White Rare is its single rarest pull — Zekrom ex in Black Bolt, Reshiram ex in White Flare, both drawn in
          the monochrome illustration style unique to this rarity tier. One tier down, each set carries its own Special Art Rare:
          <strong> N's Plan</strong> in Black Bolt, <strong>Hilda</strong> in White Flare.
        </p>

        <img
          src={`${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/zekrom-reshiram-black-white-rare-promo.webp`}
          alt="Zekrom ex and Reshiram ex Black White Rare cards side by side"
          loading="lazy"
          width={1080}
          height={1509}
          style={{ display: 'block', maxWidth: 420, width: '100%', margin: '0 auto 28px', borderRadius: 12, boxShadow: 'var(--shadow)' }}
        />

        <div className="card-strip">
          {[
            { set: 'Black Bolt', id: '0174', name: 'Zekrom ex (BWR)' },
            { set: 'White Flare', id: '0174', name: 'Reshiram ex (BWR)' },
            { set: 'Black Bolt', id: '0173', name: "N's Plan (SAR)" },
            { set: 'White Flare', id: '0173', name: 'Hilda (SAR)' },
            { set: 'Black Bolt', id: '0172', name: 'Genesect ex (SAR)' },
          ].map((c, i) => (
            <div key={i} className="card-strip-item">
              <img
                src={`${R2_IMAGE_HOST}/Chinese/${c.set === 'Black Bolt' ? 'Black%20Bolt' : 'White%20Flare'}/Cards/${c.id}.webp`}
                alt={`${c.name}, ${c.set}`}
                loading="lazy"
              />
              <div className="cap">
                {c.name}
                <br />
                {c.set}
              </div>
            </div>
          ))}
        </div>

        <blockquote className="pull-quote">Two sets, one Pokédex — anchored by a Black White Rare on each side.</blockquote>

        <h2>Why collectors are splitting their budget between both</h2>
        <p>
          Because Black Bolt and White Flare are genuinely complementary — not a reprint of each other — most collectors building
          out the Unova lineup end up wanting both rather than picking one. Each set's secret rares only cover that half's Pokémon, so
          there's no overlap to fall back on if you skip either side.
        </p>

        <h2>Our take</h2>
        <p>
          If you collected the English or Japanese versions earlier this year, the card list here will be familiar — this is the
          same set, officially localized, not a new compilation. What's actually new for collectors in the Simplified Chinese market
          is getting it at all, plus the two Special Art Rares headlining each set's chase list.
        </p>
      </BlogPostLayout>
    </>
  )
}
