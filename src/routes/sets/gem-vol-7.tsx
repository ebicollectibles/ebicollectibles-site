import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import gemVol7CssUrl from '~/styles/gem-vol-7.css?url'
import rawData from '~/data/gem-vol-7.json'

// Reachable only by direct URL — deliberately not linked from the nav,
// footer, sitemap, or any other page (per the approved plan). The
// approved preview is at https://claude.ai/artifact/4KCMsj8H8knHr12zLUMpPH;
// this ports it onto the real site (real Header/Footer instead of the
// preview's mock ones) and fixes its two known bugs — see gem-vol-7.css's
// top comment and the `rarityBadge` render below.

const SITE_URL = 'https://ebicollectibles.com'
const GEM_VOL_7_PRODUCT_ID = 'pokemon-chinese-gem-volume-7-booster-box'

interface RawCard {
  number: string
  pokemonIndex: number
  version: number
  name: string
  rarity: string
  image: string
}

const RARITY_CODE: Record<string, string> = { Common: 'C', Uncommon: 'U', Rare: 'R', 'Double Rare': 'RR', 'Triple Rare': 'RRR' }
const RARITY_SYMBOL: Record<string, string> = { Common: '●', Uncommon: '◆', Rare: '★', 'Double Rare': '★★', 'Triple Rare': '★★★' }
const RARITY_VERSIONS: Record<string, string> = { Common: '01–02', Uncommon: '03–04', Rare: '05', 'Double Rare': '06', 'Triple Rare': '07' }

// Precomputed once at module scope — this is static catalog data (not
// DB-driven), so there's no loader round trip: it ships in the page the
// same way on the server and the client.
const data = rawData as {
  name: string
  code: string
  series: string
  language: string
  releaseDate: string
  cardCount: number
  rarityOrder: string[]
  exclusiveCardNumbers: string[]
  cards: RawCard[]
}

interface Card {
  id: string // 4-digit "pokemon index + version", e.g. "0307"
  name: string
  owner: string | null // "Team Rocket", "Misty", etc. — null when the card has no trainer prefix
  mon: string // the Pokémon's own name, with any "X's " prefix stripped
  rarity: string
  version: number
  image: string
  exclusive: boolean
}

const cards: Card[] = data.cards.map((c) => {
  const id = c.number.slice(0, 4)
  const i = c.name.indexOf("'s ")
  return {
    id,
    name: c.name,
    owner: i > 0 ? c.name.slice(0, i + 2) : null,
    mon: i > 0 ? c.name.slice(i + 3) : c.name,
    rarity: c.rarity,
    version: c.version,
    image: c.image,
    exclusive: data.exclusiveCardNumbers.includes(c.number),
  }
})
const cardById = new Map(cards.map((c) => [c.id, c]))

interface CardGroup {
  groupId: string // first 2 digits of the card ids in it, e.g. "03"
  cards: Card[]
}
const groups: CardGroup[] = []
for (const c of cards) {
  const groupId = c.id.slice(0, 2)
  const last = groups[groups.length - 1]
  if (last && last.groupId === groupId) last.cards.push(c)
  else groups.push({ groupId, cards: [c] })
}

const FAQ: Array<{ q: string; a: string }> = [
  { q: 'How many cards are in Gem Vol 7?', a: '196 cards: 28 Pokémon with 7 versions each. That breaks down to 56 Common, 56 Uncommon, 28 Rare, 28 Double Rare and 28 Triple Rare.' },
  { q: 'What are the chase cards?', a: 'The 28 Triple Rares (version 07 of each Pokémon) are full-art cards. Misty’s Psyduck 0307/07 appears only in Gem Vol 7.' },
  { q: 'When did Gem Vol 7 release?', a: 'November 6, 2026.' },
  { q: 'What language are the cards in?', a: 'Simplified Chinese.' },
  { q: 'Where can I buy Gem Vol 7?', a: 'EBI Collectibles carries Gem Vol 7 packs and boxes.' },
]

// The 5 full-art Triple Rares fanned in the hero — same picks as the
// approved preview.
const FAN_IDS = ['1907', '0707', '0307', '2507', '1607']

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Gem Vol 7 Card List',
  numberOfItems: cards.length,
  itemListElement: cards.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${c.name} ${c.id}/07`,
    url: `${SITE_URL}/sets/gem-vol-7?card=${c.id}`,
    image: c.image,
  })),
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export const Route = createFileRoute('/sets/gem-vol-7')({
  validateSearch: (search) => z.object({ card: z.string().regex(/^\d{4}$/).optional() }).parse(search),
  head: () => ({
    meta: [
      { title: 'Gem Vol 7 Card List — All 196 Cards | EBI Collectibles' },
      {
        name: 'description',
        content:
          'Browse every card in Pokémon TCG Gem Vol 7 (Simplified Chinese): all 28 Pokémon across 7 rarities each, with full-art Triple Rares and a printable checklist.',
      },
      { property: 'og:title', content: 'Gem Vol 7 Card List — All 196 Cards' },
      {
        property: 'og:description',
        content: 'All 196 cards in Pokémon TCG Gem Vol 7 — browse by Pokémon, filter by rarity, and track which ones you own.',
      },
      { property: 'og:image', content: cardById.get('0307')!.image },
      { property: 'og:url', content: `${SITE_URL}/sets/gem-vol-7` },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'stylesheet', href: gemVol7CssUrl },
      { rel: 'canonical', href: `${SITE_URL}/sets/gem-vol-7` },
    ],
  }),
  component: GemVol7Page,
})

function RarityTag({ rarity }: { rarity: string }) {
  return (
    <span className="rtag" data-r={RARITY_CODE[rarity]}>
      <span className="sym">{RARITY_SYMBOL[rarity]}</span>
      {rarity}
    </span>
  )
}

// One thumbnail, shared by the "By Pokémon" rail and the "All cards" grid.
// Fix for the approved preview's "rarity shown twice" bug: this renders
// exactly one rarity tag (symbol + name) in the meta row, instead of a
// symbol-only tag there plus a second, name-only tag underneath. The
// Pokémon's own name is only shown here in the grid view — in the ladder
// it's already the row's own heading, so repeating it per card would be
// its own kind of duplication.
function CardThumb({ card, dimmed, showName, have, onOpen }: { card: Card; dimmed: boolean; showName: boolean; have: boolean; onOpen: (id: string) => void }) {
  return (
    <button type="button" className={`card${dimmed ? ' dim' : ''}`} onClick={() => onOpen(card.id)}>
      <span className="img">
        <img loading="lazy" src={card.image} alt={`${card.name} ${card.id}/07, ${card.rarity}, Gem Vol 7`} />
        {have && (
          <span className="own" aria-label="In your collection">
            ✓
          </span>
        )}
      </span>
      <span className="meta">
        <span className="no">{card.id}/07</span>
        <RarityTag rarity={card.rarity} />
      </span>
      {showName && <span className="nm">{card.name}</span>}
    </button>
  )
}

function GemVol7Page() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  const [view, setView] = React.useState<'ladder' | 'grid' | 'list'>('ladder')
  const [query, setQuery] = React.useState('')
  const [rarities, setRarities] = React.useState<Set<string>>(() => new Set())
  const [have, setHave] = React.useState<Set<string>>(() => new Set())
  const [headerH, setHeaderH] = React.useState(73)
  const haveLoadedRef = React.useRef(false)
  const fanRef = React.useRef<HTMLDivElement>(null)
  const fanRafRef = React.useRef<number | null>(null)

  // Loads whatever the viewer already marked "have" on an earlier visit.
  // Guarded (localStorage can throw in a private window) and client-only —
  // the server and the first client render both start from an empty set,
  // so there's nothing to mismatch.
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gem7-have') ?? '[]')
      if (Array.isArray(saved)) setHave(new Set(saved))
    } catch {
      // ignore
    }
    haveLoadedRef.current = true
  }, [])
  React.useEffect(() => {
    if (!haveLoadedRef.current) return
    try {
      localStorage.setItem('gem7-have', JSON.stringify([...have]))
    } catch {
      // ignore
    }
  }, [have])

  // The real site Header is sticky too — this keeps our own sticky
  // toolbar sitting directly under it instead of overlapping, at
  // whatever height the header actually renders at (it varies by
  // breakpoint).
  React.useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const update = () => setHeaderH(header.getBoundingClientRect().height)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Drives the mobile carousel's "swoosh": as the fan scrolls, each card's
  // scale/opacity eases based on its distance from the carousel's center,
  // via the --gv7-scale/--gv7-opacity custom properties gem-vol-7.css
  // reads (only under its own max-width: 900px breakpoint — on desktop
  // these are set but never read, so this is a no-op there). rAF-throttled
  // since scroll fires far more often than a frame.
  const updateFanScale = React.useCallback(() => {
    const el = fanRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    for (const child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement) || child.tagName !== 'BUTTON') continue
      const cr = child.getBoundingClientRect()
      const dist = Math.abs(cr.left + cr.width / 2 - center)
      const norm = Math.min(1, dist / (rect.width / 2))
      child.style.setProperty('--gv7-scale', (1 - norm * 0.22).toFixed(3))
      child.style.setProperty('--gv7-opacity', (1 - norm * 0.55).toFixed(3))
    }
  }, [])
  const onFanScroll = React.useCallback(() => {
    if (fanRafRef.current != null) return
    fanRafRef.current = requestAnimationFrame(() => {
      fanRafRef.current = null
      updateFanScale()
    })
  }, [updateFanScale])
  React.useEffect(() => {
    updateFanScale()
    window.addEventListener('resize', updateFanScale)
    return () => window.removeEventListener('resize', updateFanScale)
  }, [updateFanScale])

  const q = query.trim().toLowerCase()
  const match = React.useCallback(
    (c: Card) => (rarities.size === 0 || rarities.has(c.rarity)) && (!q || `${c.name} ${c.id} ${c.id}/07`.toLowerCase().includes(q)),
    [rarities, q],
  )
  const shown = React.useMemo(() => cards.filter(match), [match])

  const openCard = cardById.get(search.card ?? '') ?? null
  const open = (id: string) => navigate({ to: '/sets/gem-vol-7', search: (prev) => ({ ...prev, card: id }), replace: true })
  const close = () => navigate({ to: '/sets/gem-vol-7', search: (prev) => ({ ...prev, card: undefined }), replace: true })
  const step = (dir: 1 | -1) => {
    if (!openCard) return
    const list = shown.length > 0 ? shown : cards
    let i = list.findIndex((c) => c.id === openCard.id)
    if (i < 0) i = 0
    open(list[(i + dir + list.length) % list.length].id)
  }

  React.useEffect(() => {
    if (!openCard) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCard?.id, shown])

  const toggleRarity = (rarity: string) => {
    setRarities((prev) => {
      const next = new Set(prev)
      next.has(rarity) ? next.delete(rarity) : next.add(rarity)
      return next
    })
  }
  const toggleHave = (id: string) => {
    setHave((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const [copied, setCopied] = React.useState(false)
  const copyLink = async () => {
    if (!openCard) return
    const url = `${SITE_URL}/sets/gem-vol-7?card=${openCard.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2500)
    return () => clearTimeout(t)
  }, [copied])

  const ownedCount = have.size

  return (
    <div className="gv7" style={{ '--header-h': `${headerH}px` } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="hero" id="top">
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span>Gem Vol 7</span>
            </div>
            <div className="eyebrow">Simplified Chinese · Gem Set series</div>
            <h1>
              Gem Vol 7<span>Complete card list &amp; checklist</span>
            </h1>
            <p className="lede">
              All 196 cards in Gem Vol 7: 28 Pokémon, each printed in 7 versions from Common up to a full-art Triple Rare. Tap any card for a
              closer look and every version beside it.
            </p>
            <dl className="facts">
              <div>
                <dt>Set code</dt>
                <dd>{data.code}</dd>
              </div>
              <div>
                <dt>Released</dt>
                <dd>Nov 6, 2026</dd>
              </div>
              <div>
                <dt>Cards</dt>
                <dd>{data.cardCount}</dd>
              </div>
              <div>
                <dt>Pokémon</dt>
                <dd>28 × 7</dd>
              </div>
            </dl>
            <div className="hero-cta">
              <Link className="btn btn-light" to="/products/$id" params={{ id: GEM_VOL_7_PRODUCT_ID }}>
                Shop Gem Vol 7 →
              </Link>
              <a
                className="btn btn-ghost"
                href="#list"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('list')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Browse the cards
              </a>
            </div>
          </div>
          <div className="fan" ref={fanRef} onScroll={onFanScroll} aria-label="Featured full-art cards">
            {FAN_IDS.map((id) => {
              const c = cardById.get(id)!
              return (
                <button key={id} type="button" onClick={() => open(id)} aria-label={`${c.name} ${id}/07`}>
                  <img src={c.image} alt={`${c.name} full art, Gem Vol 7 ${id}/07`} />
                </button>
              )
            })}
            <div className="fan-cap">Triple Rare full arts</div>
          </div>
        </div>
      </section>

      <div className="bar" id="list">
        <div className="wrap">
          <label className="search" htmlFor="gv7-q">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-4-4"></path>
            </svg>
            <input
              id="gv7-q"
              type="search"
              placeholder="Search Pokémon, trainer or number"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="chips" role="group" aria-label="Filter by rarity">
            {data.rarityOrder.map((rarity) => (
              <button
                key={rarity}
                type="button"
                className="chip"
                aria-pressed={rarities.has(rarity)}
                onClick={() => toggleRarity(rarity)}
              >
                <span className="sym" style={{ color: `var(--r-${RARITY_CODE[rarity].toLowerCase()})` }}>
                  {RARITY_SYMBOL[rarity]}
                </span>
                {rarity}
                <span className="n">{cards.filter((c) => c.rarity === rarity).length}</span>
              </button>
            ))}
          </div>
          <div className="views" role="group" aria-label="View">
            {(
              [
                ['ladder', 'By Pokémon'],
                ['grid', 'All cards'],
                ['list', 'Checklist'],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {label}
              </button>
            ))}
          </div>
          <div className="count">
            <span>
              <b>{shown.length}</b> of {data.cardCount} cards
            </span>
            <span className="progress">
              <span>
                You have {ownedCount} / {data.cardCount}
              </span>
              <i>
                <s style={{ width: `${(ownedCount / data.cardCount) * 100}%` }} />
              </i>
            </span>
          </div>
        </div>
      </div>

      <main className="wrap">
        {shown.length === 0 ? (
          <div className="empty">No cards match. Try another name or clear the rarity filter.</div>
        ) : view === 'ladder' ? (
          groups
            .filter((g) => g.cards.some(match))
            .map((g) => {
              const c0 = g.cards[0]
              const ownedInGroup = g.cards.filter((c) => have.has(c.id)).length
              const hasExclusive = g.cards.some((c) => c.exclusive)
              return (
                <section className="ladder" key={g.groupId} aria-label={c0.mon}>
                  <div className="lhead">
                    <span className="lno">#{g.groupId}</span>
                    <h2 className="lname">
                      {c0.owner && <small>{c0.owner}</small>}
                      {c0.mon}
                    </h2>
                    <span className="lmeta">
                      7 versions · {ownedInGroup} owned
                    </span>
                    {hasExclusive && <span className="excl">Full art only in Vol 7</span>}
                  </div>
                  <div className="rail">
                    {g.cards.map((c) => (
                      <CardThumb key={c.id} card={c} dimmed={!match(c)} showName={false} have={have.has(c.id)} onOpen={open} />
                    ))}
                  </div>
                </section>
              )
            })
        ) : view === 'grid' ? (
          <div className="grid">
            {shown.map((c) => (
              <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} onOpen={open} />
            ))}
          </div>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Have</th>
                  <th></th>
                  <th>No.</th>
                  <th>Card</th>
                  <th>Rarity</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="have"
                        checked={have.has(c.id)}
                        onChange={() => toggleHave(c.id)}
                        aria-label={`Have ${c.name} ${c.id}/07`}
                      />
                    </td>
                    <td className="thumb">
                      <img loading="lazy" src={c.image} alt="" />
                    </td>
                    <td className="mono">{c.id}/07</td>
                    <td>
                      <button type="button" className="lnk" onClick={() => open(c.id)}>
                        {c.name}
                      </button>
                    </td>
                    <td>
                      <RarityTag rarity={c.rarity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <section className="about">
        <div className="wrap">
          <div>
            <h2>About Gem Vol 7</h2>
            <p>
              Gem Vol 7 (set code {data.code}) is the seventh release in the Simplified Chinese Gem Set series, out November 6, 2026. It has
              196 cards built around 28 Pokémon, many of them partnered with trainers such as Team Rocket, Misty, Cynthia, N, Marnie and Iono.
            </p>
            <p>
              Every Pokémon comes in 7 numbered versions. Versions 01 and 02 are Common, 03 and 04 Uncommon, 05 Rare, 06 Double Rare, and 07 is
              a full-art Triple Rare. Card numbers read as Pokémon number then version, so 0307/07 is the 7th version of the 3rd Pokémon.
            </p>
            <table className="odds" aria-label="Cards by rarity">
              <thead>
                <tr>
                  <th>Rarity</th>
                  <th>Versions</th>
                  <th className="mono">Cards</th>
                </tr>
              </thead>
              <tbody>
                {data.rarityOrder.map((rarity) => (
                  <tr key={rarity}>
                    <td>
                      <RarityTag rarity={rarity} />
                    </td>
                    <td className="mono">{RARITY_VERSIONS[rarity]}</td>
                    <td className="mono">{cards.filter((c) => c.rarity === rarity).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="faq">
            <h2>Gem Vol 7 questions</h2>
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {openCard && (
        <div className="lb" role="dialog" aria-modal="true" aria-labelledby="gv7-lb-title" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="lb-panel">
            <button className="lb-close" type="button" aria-label="Close" onClick={close}>
              ×
            </button>
            <div className="lb-art">
              <img src={openCard.image} alt={`${openCard.name} ${openCard.id}/07, ${openCard.rarity}, Gem Vol 7`} />
            </div>
            <div className="lb-info">
              <div className="lb-nav">
                <button type="button" aria-label="Previous card" onClick={() => step(-1)}>
                  ←
                </button>
                <button type="button" aria-label="Next card" onClick={() => step(1)}>
                  →
                </button>
              </div>
              <h2 id="gv7-lb-title">
                {openCard.owner && <small>{openCard.owner}</small>}
                {openCard.mon}
              </h2>
              <dl className="lb-dl">
                <dt>Number</dt>
                <dd className="mono">{openCard.id}/07</dd>
                <dt>Rarity</dt>
                <dd>
                  <RarityTag rarity={openCard.rarity} />
                </dd>
                <dt>Version</dt>
                <dd>
                  {openCard.version} of 7{openCard.version === 7 ? ' · full art' : ''}
                  {openCard.exclusive ? ' · only in Gem Vol 7' : ''}
                </dd>
                <dt>Set</dt>
                <dd>Gem Vol 7 · {data.code}</dd>
              </dl>
              <div className="sib-h">All 7 versions</div>
              <div className="sibs">
                {groups
                  .find((g) => g.groupId === openCard.id.slice(0, 2))!
                  .cards.map((sib) => (
                    <button
                      key={sib.id}
                      type="button"
                      aria-current={sib.id === openCard.id}
                      aria-label={`Version ${sib.version}, ${sib.rarity}`}
                      onClick={() => open(sib.id)}
                    >
                      <img src={sib.image} alt="" />
                    </button>
                  ))}
              </div>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                <input type="checkbox" className="have" checked={have.has(openCard.id)} onChange={() => toggleHave(openCard.id)} />
                I have this card
              </label>
              <div className="lb-actions">
                <Link className="btn btn-dark" to="/products/$id" params={{ id: GEM_VOL_7_PRODUCT_ID }}>
                  Shop Gem Vol 7
                </Link>
                <button className="btn btn-line" type="button" onClick={copyLink}>
                  Copy link to card
                </button>
              </div>
              <div className="toast">{copied ? 'Link copied.' : ''}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
