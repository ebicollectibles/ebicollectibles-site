import { createFileRoute, Link } from '@tanstack/react-router'
import setsIndexCssUrl from '~/styles/sets-index.css?url'
import { GEM_SETS } from '~/data/gem-sets-index'

const SITE_URL = 'https://ebicollectibles.com'

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Pokémon Sets',
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

// Display order for the series sections below — officially-licensed lines
// first, Chen's own Gem Set branding last. A series not listed here (a
// future one-off) still renders, just after all of these.
const SERIES_ORDER = ['Chinese Scarlet & Violet', '30th Anniversary Special Set', 'Gem Set']
const SERIES_LABEL: Record<string, string> = {
  'Chinese Scarlet & Violet': 'Chinese Scarlet & Violet',
  '30th Anniversary Special Set': '30th Anniversary',
  'Gem Set': 'Gem Set',
}

function groupBySeries() {
  const groups = new Map<string, typeof GEM_SETS>()
  for (const s of GEM_SETS) {
    const list = groups.get(s.series) ?? []
    list.push(s)
    groups.set(s.series, list)
  }
  return [...groups.entries()].sort(([a], [b]) => {
    const ia = SERIES_ORDER.indexOf(a)
    const ib = SERIES_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

export const Route = createFileRoute('/sets/')({
  head: () => ({
    meta: [
      { title: 'Pokémon Sets | EBI Collectibles' },
      {
        name: 'description',
        content: 'Browse every Simplified Chinese Pokémon TCG release from EBI Collectibles — full card lists, rarities and checklists for every Gem Set and officially-licensed set we carry.',
      },
      { property: 'og:title', content: 'Pokémon Sets' },
      { property: 'og:description', content: 'Every card in every Simplified Chinese set we carry — browse, filter and track what you own.' },
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
            <span>Sets</span>
          </div>
          <div className="eyebrow">Simplified Chinese · Pokémon TCG</div>
          <h1>Pokémon sets</h1>
          <p className="lede">
            Every set we carry, every card. Browse by Pokémon, filter by rarity, and track your own collection — pick a set below to dive in.
          </p>
        </div>
      </section>

      <main className="wrap">
        {groupBySeries().map(([series, sets]) => (
          <section key={series} className="series">
            <h2 className="series-h">{SERIES_LABEL[series] ?? series}</h2>
            <div className="grid">
              {sets.map((s) => (
                <Link key={s.slug} className="card" to={s.path}>
                  <div className="card-art" style={{ '--glow-1': s.glow1, '--glow-2': s.glow2 } as React.CSSProperties}>
                    {s.preorder && <span className="card-preorder">Preorder</span>}
                    <img src={s.heroImage} alt={s.heroAlt} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <span className="card-series">{s.code}</span>
                    <h3 className="card-name">{s.name}</h3>
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
          </section>
        ))}
      </main>
    </div>
  )
}
