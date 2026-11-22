import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import setsIndexCssUrl from '~/styles/sets-index.css?url'
import { GEM_SETS } from '~/data/gem-sets-index'
import { LIVE_JAPANESE_SETS } from '~/data/japanese-sets-index'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { safeJsonLd } from '~/lib/gem-sets/head'

// Hub for every language we track. Each language has its own list at
// /sets/<language>, and every set page lives under its language.
const byNewest = <T extends { releaseDate: string }>(sets: T[]) => [...sets].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))

const LANGUAGES = [
  {
    to: '/sets/chinese' as const,
    name: 'Simplified Chinese Pokémon sets',
    label: 'Simplified Chinese',
    native: '简体中文',
    flagline: 'Chinese Pokémon TCG',
    tagline: 'Gem Packs, the Chinese Scarlet & Violet sets, 30th Celebration and Collect 151.',
    sets: byNewest(GEM_SETS),
  },
  {
    to: '/sets/japanese' as const,
    name: 'Japanese Pokémon sets',
    label: 'Japanese',
    native: '日本語',
    flagline: 'Japanese Pokémon TCG',
    tagline: 'The Japanese Mega Evolution sets: Storm Emeralda, 30th Celebration and Aura Seeker.',
    sets: byNewest(LIVE_JAPANESE_SETS),
  },
].filter((l) => l.sets.length > 0)

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
      { title: 'Pokémon TCG Sets by Language: Card Lists | EBI Collectibles' },
      { name: 'description', content: 'Full card lists and rarities for the Pokémon TCG sets we track, sorted by language: Simplified Chinese and Japanese.' },
      { property: 'og:title', content: 'Pokémon TCG Sets by Language: Card Lists' },
      { property: 'og:description', content: 'Full card lists and rarities for the Pokémon TCG sets we track, sorted by language: Simplified Chinese and Japanese.' },
      { property: 'og:image', content: `${SITE_URL}/assets/share/sets.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Three Simplified Chinese Pokémon cards fanned beside the words Chinese Set Lists' },
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
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Sets</span>
          </nav>
          <div className="eyebrow">Pokémon TCG</div>
          <h1>Pokémon sets</h1>
          <p className="lede">Full card lists for the Pokémon sets we track. Pick a language to browse its sets.</p>
        </div>
      </section>

      <div className="wrap page-main">
        <ul className="lang-grid">
          {LANGUAGES.map((l) => {
            const fan = l.sets.slice(0, 3)
            const more = l.sets.length - 4
            return (
              <li key={l.to}>
                <Link className="lang-card" to={l.to}>
                  <div className="lang-art" style={{ '--glow-1': fan[0].glow1, '--glow-2': fan[0].glow2 } as React.CSSProperties}>
                    <span className="lang-native" aria-hidden="true">
                      {l.native}
                    </span>
                    <div className={`lang-fan lang-fan--${fan.length}`}>
                      {fan.map((s, i) => (
                        <img key={s.slug} src={s.heroImage} alt={i === 0 ? s.heroAlt : ''} width={300} height={419} loading={i === 0 ? 'eager' : 'lazy'} />
                      ))}
                    </div>
                  </div>
                  <div className="lang-body">
                    <span className="lang-kicker">{l.flagline}</span>
                    <h2 className="lang-name">{l.label}</h2>
                    <p className="lang-tagline">{l.tagline}</p>
                    <ul className="lang-chips" aria-label={`Some ${l.label} sets`}>
                      {l.sets.slice(0, 4).map((s) => (
                        <li key={s.slug}>{s.name}</li>
                      ))}
                      {more > 0 && <li className="more">+{more} more</li>}
                    </ul>
                    <span className="lang-cta">
                      Browse {l.sets.length} {l.label} set{l.sets.length === 1 ? '' : 's'} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
