import { createFileRoute, Link } from '@tanstack/react-router'
import setsIndexCssUrl from '~/styles/sets-index.css?url'
import { LIVE_JAPANESE_SETS } from '~/data/japanese-sets-index'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

// Japanese section of the set lists, linked from /sets and the header.

function formatReleaseDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const Route = createFileRoute('/sets/japanese/')({
  head: () => ({
    meta: [
      { title: 'Pokémon TCG Japanese Sets: Every Card List | EBI Collectibles' },
      { name: 'description', content: 'Card lists for Japanese Pokémon TCG sets: Storm Emeralda (M6), 30th Celebration (M6a) and Aura Seeker (M7), with every card and rarity.' },
      { property: 'og:title', content: 'Pokémon TCG Japanese Sets: Every Card List' },
      { property: 'og:url', content: `${SITE_URL}/sets/japanese` },
    ],
    links: [
      { rel: 'stylesheet', href: setsIndexCssUrl },
      { rel: 'canonical', href: `${SITE_URL}/sets/japanese` },
      { rel: 'preconnect', href: R2_IMAGE_HOST },
    ],
  }),
  component: JapaneseSetsIndexPage,
})

function JapaneseSetsIndexPage() {
  const sets = [...LIVE_JAPANESE_SETS].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  return (
    <div className="gem-sets-index">
      <section className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <Link to="/sets">Sets</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Japanese</span>
          </nav>
          <div className="eyebrow">Japanese · Pokémon TCG</div>
          <h1>Japanese Pokémon sets</h1>
          <p className="lede">Full card lists for the Japanese sets we track. Browse by Pokémon and filter by rarity.</p>
        </div>
      </section>

      <div className="wrap page-main">
        <section className="series">
          <h2 className="series-h">Japanese sets</h2>
          {sets.length === 0 ? (
            <p>No Japanese sets yet.</p>
          ) : (
            <ul className="grid">
              {sets.map((s, i) => (
                <li key={s.slug}>
                  <a className="card" href={s.path}>
                    <div
                      className={s.packImage ? 'card-art card-art--pack' : 'card-art'}
                      style={{ '--glow-1': s.glow1, '--glow-2': s.glow2 } as React.CSSProperties}
                    >
                      {s.packImage ? (
                        <img src={s.packImage.src} alt={`${s.name} booster pack`} loading={i < 8 ? undefined : 'lazy'} width={s.packImage.w} height={s.packImage.h} />
                      ) : (
                        <img src={s.heroImage} alt={s.heroAlt} loading={i < 8 ? undefined : 'lazy'} width={300} height={419} />
                      )}
                    </div>
                    <div className="card-body">
                      <span className="card-series">{s.code}</span>
                      <h3 className="card-name">{s.name}</h3>
                      <p className="card-tagline">{s.tagline}</p>
                      <div className="card-meta">
                        <span>
                          <b>{s.cardCount}</b> cards
                        </span>
                        <time dateTime={s.releaseDate}>{formatReleaseDate(s.releaseDate)}</time>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
