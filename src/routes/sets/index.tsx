import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import setsIndexCssUrl from '~/styles/sets-index.css?url'
import { GEM_SETS } from '~/data/gem-sets-index'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { safeJsonLd } from '~/lib/gem-sets/head'

// Hub for every language we track. Each language has its own list at
// /sets/<language> (only Simplified Chinese today; Japanese will sit beside
// it at /sets/japanese), and every set page lives under its language.
const LANGUAGES = [
  {
    to: '/sets/chinese' as const,
    name: 'Simplified Chinese Pokémon sets',
    label: 'Simplified Chinese',
    tagline: 'Gem Packs, the Chinese Scarlet & Violet sets, 30th Celebration and Collect 151.',
    sets: GEM_SETS,
  },
]

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE_URL}/shop` },
    { '@type': 'ListItem', position: 2, name: 'Sets', item: `${SITE_URL}/sets` },
  ],
}

export const Route = createFileRoute('/sets/')({
  head: () => ({
    meta: [
      { title: 'Pokémon TCG Sets by Language: Card Lists and Checklists | EBI Collectibles' },
      { name: 'description', content: 'Full card lists, rarities and checklists for the Pokémon TCG sets we track, sorted by language, starting with Simplified Chinese.' },
      { property: 'og:title', content: 'Pokémon TCG Sets by Language: Card Lists and Checklists' },
      { property: 'og:description', content: 'Full card lists, rarities and checklists for the Pokémon TCG sets we track, sorted by language, starting with Simplified Chinese.' },
      { property: 'og:image', content: GEM_SETS[0].heroImage },
      { property: 'og:url', content: `${SITE_URL}/sets` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: setsIndexCssUrl },
      { rel: 'canonical', href: `${SITE_URL}/sets` },
    ],
  }),
  component: SetsHubPage,
})

function SetsHubPage() {
  return (
    <div className="gem-sets-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <section className="hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>Sets</span>
          </div>
          <div className="eyebrow">Pokémon TCG</div>
          <h1>Pokémon sets</h1>
          <p className="lede">Full card lists for the Pokémon sets we track. Pick a language to browse its sets and track your collection.</p>
        </div>
      </section>

      <main className="wrap">
        <section className="series">
          <div className="grid">
            {LANGUAGES.map((l) => (
              <Link key={l.to} className="card" to={l.to}>
                <div className="card-art" style={{ '--glow-1': l.sets[0].glow1, '--glow-2': l.sets[0].glow2 } as React.CSSProperties}>
                  <img src={l.sets[0].heroImage} alt={l.sets[0].heroAlt} width={300} height={419} />
                </div>
                <div className="card-body">
                  <span className="card-series">{l.label}</span>
                  <h3 className="card-name">{l.name}</h3>
                  <p className="card-tagline">{l.tagline}</p>
                  <div className="card-meta">
                    <span>
                      <b>{l.sets.length}</b> card lists
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
