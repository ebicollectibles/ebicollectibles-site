import { createFileRoute, Link } from '@tanstack/react-router'
import setsIndexCssUrl from '~/styles/sets-index.css?url'
import { GEM_SETS } from '~/data/gem-sets-index'

const SITE_URL = 'https://ebicollectibles.com'

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Gem Set Card Lists',
  numberOfItems: GEM_SETS.length,
  itemListElement: GEM_SETS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${s.name} Card List`,
    url: `${SITE_URL}/sets/${s.slug}`,
    image: s.heroImage,
  })),
}

function formatReleaseDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const Route = createFileRoute('/sets/')({
  head: () => ({
    meta: [
      { title: 'Gem Set Card Lists | EBI Collectibles' },
      {
        name: 'description',
        content: 'Browse every Simplified Chinese Gem Set release from EBI Collectibles — full card lists, rarities and checklists for Gem Vol 1 through 7.',
      },
      { property: 'og:title', content: 'Gem Set Card Lists' },
      { property: 'og:description', content: 'Every card in every Simplified Chinese Gem Set release — browse, filter and track what you own.' },
      { property: 'og:image', content: GEM_SETS[0].heroImage },
      { property: 'og:url', content: `${SITE_URL}/sets` },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'stylesheet', href: setsIndexCssUrl },
      { rel: 'canonical', href: `${SITE_URL}/sets` },
    ],
  }),
  component: SetsIndexPage,
})

function SetsIndexPage() {
  return (
    <div className="gem-sets-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>Gem Sets</span>
          </div>
          <div className="eyebrow">Simplified Chinese · Gem Set series</div>
          <h1>Gem Set card lists</h1>
          <p className="lede">
            Every Gem Set release, every card. Browse by Pokémon, filter by rarity, and track your own collection — pick a set below to dive in.
          </p>
        </div>
      </section>

      <main className="wrap">
        <div className="grid">
          {GEM_SETS.map((s) => (
            <Link key={s.slug} className="card" to={s.path}>
              <div className="card-art" style={{ '--glow-1': s.glow1, '--glow-2': s.glow2 } as React.CSSProperties}>
                {s.preorder && <span className="card-preorder">Preorder</span>}
                <img src={s.heroImage} alt={s.heroAlt} loading="lazy" />
              </div>
              <div className="card-body">
                <span className="card-series">{s.series}</span>
                <h2 className="card-name">{s.name}</h2>
                <p className="card-tagline">{s.tagline}</p>
                <div className="card-meta">
                  <span>
                    <b>{s.cardCount}</b> cards
                  </span>
                  <span>{formatReleaseDate(s.releaseDate)}</span>
                  <span className="card-excl">
                    {s.exclusiveCount}× excl.
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
