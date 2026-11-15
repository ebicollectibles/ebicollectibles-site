import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'black-bolt-white-flare-arrive')!

export const Route = createFileRoute('/blog/black-bolt-white-flare-arrive')({
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
        lede="Zekrom ex and Reshiram ex lead two Simplified Chinese Scarlet & Violet sets that split the Unova roster between them."
        cta={{
          heading: 'Shop Black Bolt & White Flare',
          body: 'Slim and jumbo booster boxes for both sets.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-black-bolt-jumbo-booster-box' }, label: 'Shop Black Bolt' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-white-flare-jumbo-booster-box' }, label: 'Shop White Flare' },
          ],
        }}
      >
        <p>
          <strong>Black Bolt</strong> (set code CSV10.5C) and <strong>White Flare</strong> (CSV10.6C) are officially-licensed Pokémon
          TCG expansions in the Simplified Chinese Scarlet & Violet series, out together on November 6, 2026. They are the Chinese
          release of the twin Unova sets that came out in English and Japanese in 2025, not a Gem-style compilation, with a few
          differences covered below.
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
            <div className="stat-label">Pack sizes, 5 and 20 cards</div>
          </div>
        </div>

        <h2>Pack sizes</h2>
        <p>
          Both sets come in two pack sizes: a small pack with 5 cards (1 holo) and a large pack with 20 cards (7 holos). The large
          pack has better odds at every rarity above Uncommon, so it is the one to open if you are after secret rares.
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
          The rarest pull in each set is its Black White Rare: Zekrom ex in Black Bolt and Reshiram ex in White Flare, both in the
          black-and-white art style only this rarity uses. Below that come the two mascots' own Special Art Rares, then{' '}
          <strong>N's Plan</strong> and <strong>Genesect ex</strong> in Black Bolt and <strong>Hilda</strong> in White Flare.
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
            { set: 'Black Bolt', id: '0169', name: 'Zekrom ex (SAR)' },
            { set: 'White Flare', id: '0168', name: 'Reshiram ex (SAR)' },
            { set: 'Black Bolt', id: '0173', name: "N's Plan (SAR)" },
            { set: 'White Flare', id: '0173', name: 'Hilda (SAR)' },
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
          The two sets share out Unova's 156 featured Pokémon, 78 each, with 6 ex in each set. Black Bolt is built around{' '}
          <strong>Zekrom ex</strong> and White Flare around <strong>Reshiram ex</strong>, the same mascots as in English. The roster
          split is not identical, though: ten Pokémon from four evolution lines (Litwick, Vullaby, Klink and Rufflet) sit in the other set compared with English.
        </p>
        <p>
          Each set is numbered 001 to 174. The first 86 cards are the main set: Pokémon, Trainers and a Special Energy, up to Double
          Rare. The 88 cards after that are secret rares. Every non-ex Pokémon gets an Art Rare, each ex Pokémon gets a Super Rare and a Special Art Rare,
          two Supporters get a Super Rare (one of them also a Special Art Rare), and each set ends with one Black White Rare.
        </p>

        <h2>Do you need both?</h2>
        <p>
          If you want the full Unova roster, yes. Each set only has its own half of the Pokémon, and its secret rares only cover that
          half, so neither one stands in for the other.
        </p>

        <h2>Our take</h2>
        <p>
          If you collected the English sets, most of these cards will look familiar, but not all of them. Each Chinese set adds a
          Special Art Rare you cannot pull in English (N's Plan in Black Bolt, Hilda in White Flare), a few Art Rares use art English
          only released as promos, and the English N's Plan and Hilda Special Illustration Rares and the Victini Black White Rares are
          not in the Chinese sets. Start with whichever mascot you like more, Zekrom or Reshiram. Our{' '}
          <Link to="/blog/black-bolt-card-origins">Black Bolt</Link> and{' '}
          <Link to="/blog/white-flare-card-origins">White Flare</Link> card origins guides map every card.
        </p>
      </BlogPostLayout>
    </>
  )
}
