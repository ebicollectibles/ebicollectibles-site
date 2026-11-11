import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { buildGemSetJsonLd } from '~/lib/gem-sets/head'
import { RARITY_CODE, RARITY_SYMBOL } from '~/lib/gem-sets/rarity'
import type { BuiltGemSetData, Card, GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { CardThumb, RarityTag } from './parts'

// The shared shell behind every Gem Set card-list page (Gem Vol 7, Gem Vol
// 6, and whatever's added after). A set's own route file stays thin: it
// owns routing (validateSearch/head/navigate, since those need the file's
// own literal route path for TanStack's typing) and supplies this
// component with its data file, derived lookups (buildGemSetData) and a
// GemSetConfig of the editorial bits (hero fan, about copy, FAQ, SEO text,
// accent colors). Everything else — filtering, views, the hero fan
// carousel, the "have" checklist, the lightbox — lives here once, so a fix
// made here reaches every set's page.
export function GemSetPage({
  raw,
  data,
  config,
  openCardId,
  navigateToCard,
}: {
  raw: GemSetData
  data: BuiltGemSetData
  config: GemSetConfig
  openCardId: string | null
  navigateToCard: (id: string | undefined) => Promise<void>
}) {
  const { cards, cardById, groups, versionSuffix, versionsPerMon, monCount, rarityVersionLabels } = data

  const [view, setView] = React.useState<'ladder' | 'grid' | 'exclusives' | 'list'>('ladder')
  const [query, setQuery] = React.useState('')
  const [rarities, setRarities] = React.useState<Set<string>>(() => new Set())
  const [have, setHave] = React.useState<Set<string>>(() => new Set())
  const [headerH, setHeaderH] = React.useState(73)
  const haveLoadedRef = React.useRef(false)
  const fanRef = React.useRef<HTMLDivElement>(null)
  // Which of config.fanIds sits in the center slot. The others fall into
  // the 4 remaining fixed slots around it, wrapping cyclically — a swipe
  // moves this by exactly one step, like a revolver cylinder, rather than
  // letting the fan be dragged by any amount.
  const [fanIndex, setFanIndex] = React.useState(Math.floor(config.fanIds.length / 2))
  const [fanTouch, setFanTouch] = React.useState(false)
  const touchStartXRef = React.useRef<number | null>(null)
  const touchMovedRef = React.useRef(false)
  const justSwipedRef = React.useRef(false)

  const { itemListJsonLd, faqJsonLd } = React.useMemo(() => buildGemSetJsonLd(raw, data, config), [raw, data, config])

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const update = () => setFanTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const onFanTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null
    touchMovedRef.current = false
  }
  const onFanTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current == null) return
    if (Math.abs((e.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current) > 10) touchMovedRef.current = true
  }
  const onFanTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartXRef.current
    touchStartXRef.current = null
    if (startX == null) return
    const dx = (e.changedTouches[0]?.clientX ?? startX) - startX
    if (Math.abs(dx) > 40) {
      setFanIndex((i) => (i + (dx < 0 ? 1 : -1) + config.fanIds.length) % config.fanIds.length)
      justSwipedRef.current = true
      e.preventDefault()
      // preventDefault() here also suppresses the synthetic click browsers
      // fire after a touch, which is the point — but that click was the
      // only thing resetting this flag, so without its own timeout it
      // stayed stuck true forever after the first swipe, silently
      // swallowing every tap after that (not just the one right after
      // the swipe). This clears it independently of whether any click
      // ever fires.
      window.setTimeout(() => {
        justSwipedRef.current = false
      }, 400)
    }
  }
  // One fixed slot per card — same rotate/offset/lift desktop's own
  // :nth-child rules use, just computed from fanIndex instead of a static
  // position in the markup. rel runs -2..2 (5 slots), wrapping around
  // fanIds.length either side so advancing past an end cycles to the
  // other, same as a revolver.
  const fanSlotStyle = (originalIndex: number): React.CSSProperties => {
    let rel = originalIndex - fanIndex
    if (rel > 2) rel -= config.fanIds.length
    if (rel < -2) rel += config.fanIds.length
    const abs = Math.abs(rel)
    return {
      transform: `translate(-50%, -50%) translateX(${rel * 100}px) rotate(${rel * 7}deg) translateY(${abs === 2 ? 26 : abs === 1 ? 6 : 0}px)`,
      zIndex: 3 - abs,
    }
  }

  // Loads whatever the viewer already marked "have" on an earlier visit.
  // Guarded (localStorage can throw in a private window) and client-only —
  // the server and the first client render both start from an empty set,
  // so there's nothing to mismatch.
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(config.storageKey) ?? '[]')
      if (Array.isArray(saved)) setHave(new Set(saved))
    } catch {
      // ignore
    }
    haveLoadedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (!haveLoadedRef.current) return
    try {
      localStorage.setItem(config.storageKey, JSON.stringify([...have]))
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [have])

  // The real site Header is sticky too — this keeps our own sticky
  // toolbar sitting directly under it instead of overlapping, at
  // whatever height the header actually renders at (it varies by
  // breakpoint). Scrolling on mobile Safari shows/hides the address bar,
  // which fires its own resize event — reading layout synchronously
  // inside that handler forced a reflow at the exact moment a scroll
  // gesture started, which is what read as a sudden jump right as
  // scrolling began. Deferred to the next frame instead, and skips the
  // state update entirely when the height hasn't actually changed.
  React.useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    let rafId: number | null = null
    const update = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const next = header.getBoundingClientRect().height
        setHeaderH((prev) => (prev === next ? prev : next))
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [])

  const q = query.trim().toLowerCase()
  const match = React.useCallback(
    (c: Card) => (rarities.size === 0 || rarities.has(c.rarity)) && (!q || `${c.name} ${c.id} ${c.id}/${versionSuffix}`.toLowerCase().includes(q)),
    [rarities, q, versionSuffix],
  )
  const shown = React.useMemo(() => cards.filter(match), [cards, match])
  const exclusiveShown = React.useMemo(() => shown.filter((c) => c.exclusive), [shown])

  const openCard = cardById.get(openCardId ?? '') ?? null
  // The router's scrollRestoration is keyed to the exact URL, search
  // params included — so going from ?card=X back to no ?card lands on
  // wherever that bare URL last scrolled to (usually nowhere, i.e. the
  // top), not back to where the page was before the card opened. Saved
  // here instead, and reapplied after the navigation settles, so closing
  // (or stepping between sibling cards, which also goes through open())
  // leaves the page exactly where the user left it.
  const scrollYRef = React.useRef(0)
  const open = (id: string) => {
    if (!openCard) scrollYRef.current = window.scrollY
    navigateToCard(id).then(() => {
      window.scrollTo(0, scrollYRef.current)
    })
  }
  const close = () =>
    navigateToCard(undefined).then(() => {
      window.scrollTo(0, scrollYRef.current)
    })
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
    const url = `${SITE_URL}${config.routePath}?card=${openCard.id}`
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
  const topRarity = raw.rarityOrder[raw.rarityOrder.length - 1]
  const releasedLabel = formatReleaseDate(raw.releaseDate)

  return (
    <div
      className="gem-set"
      style={{ '--header-h': `${headerH}px`, '--glow-1': config.glow1, '--glow-2': config.glow2 } as React.CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="hero" id="top">
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span>{raw.name}</span>
            </div>
            <div className="eyebrow">
              {raw.language} · {raw.series} series
            </div>
            <h1>
              {raw.name}
              <span>Complete card list &amp; checklist</span>
            </h1>
            <p className="lede">
              All {raw.cardCount} cards in {raw.name}: {monCount} Pokémon, each printed in {versionsPerMon} versions from {raw.rarityOrder[0]} up
              to a full-art {topRarity}. Tap any card for a closer look and every version beside it.
            </p>
            <dl className="facts">
              <div>
                <dt>Set code</dt>
                <dd>{raw.code}</dd>
              </div>
              <div>
                <dt>Released</dt>
                <dd>{releasedLabel}</dd>
              </div>
              <div>
                <dt>Cards</dt>
                <dd>{raw.cardCount}</dd>
              </div>
              <div>
                <dt>Pokémon</dt>
                <dd>
                  {monCount} × {versionsPerMon}
                </dd>
              </div>
            </dl>
            <div className="hero-cta">
              <Link className="btn btn-light" to="/products/$id" params={{ id: config.productId }}>
                Shop {raw.name} →
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
          <div
            className="fan"
            ref={fanRef}
            onTouchStart={onFanTouchStart}
            onTouchMove={onFanTouchMove}
            onTouchEnd={onFanTouchEnd}
            aria-label="Featured full-art cards"
          >
            {config.fanIds.map((id, i) => {
              const c = cardById.get(id)!
              return (
                <button
                  key={id}
                  type="button"
                  style={fanTouch ? fanSlotStyle(i) : undefined}
                  onClick={() => {
                    if (justSwipedRef.current) {
                      justSwipedRef.current = false
                      return
                    }
                    open(id)
                  }}
                  aria-label={`${c.name} ${id}/${versionSuffix}`}
                >
                  <img src={c.image} alt={`${c.name} full art, ${raw.name} ${id}/${versionSuffix}`} />
                </button>
              )
            })}
            <div className="fan-cap">{topRarity} full arts</div>
          </div>
        </div>
      </section>

      <div className="bar" id="list">
        <div className="wrap">
          <label className="search" htmlFor="gem-set-q">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-4-4"></path>
            </svg>
            <input
              id="gem-set-q"
              type="search"
              placeholder="Search Pokémon, trainer or number"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="chips" role="group" aria-label="Filter by rarity">
            {raw.rarityOrder.map((rarity) => (
              <button key={rarity} type="button" className="chip" aria-pressed={rarities.has(rarity)} onClick={() => toggleRarity(rarity)}>
                <span className="sym" style={{ color: `var(--r-${(RARITY_CODE[rarity] ?? '').toLowerCase()})` }}>
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
                ['exclusives', 'Exclusives'],
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
              <b>{shown.length}</b> of {raw.cardCount} cards
            </span>
            <span className="progress">
              <span>
                You have {ownedCount} / {raw.cardCount}
              </span>
              <i>
                <s style={{ width: `${(ownedCount / raw.cardCount) * 100}%` }} />
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
                      {versionsPerMon} versions · {ownedInGroup} owned
                    </span>
                    {hasExclusive && <span className="excl">Chinese Exclusive</span>}
                  </div>
                  <div className="rail">
                    {g.cards.map((c) => (
                      <CardThumb key={c.id} card={c} dimmed={!match(c)} showName={false} have={have.has(c.id)} versionSuffix={versionSuffix} onOpen={open} />
                    ))}
                  </div>
                </section>
              )
            })
        ) : view === 'grid' ? (
          <div className="grid">
            {shown.map((c) => (
              <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} versionSuffix={versionSuffix} onOpen={open} />
            ))}
          </div>
        ) : view === 'exclusives' ? (
          exclusiveShown.length === 0 ? (
            <div className="empty">No exclusive cards match. Try another name or clear the rarity filter.</div>
          ) : (
            <div className="grid">
              {exclusiveShown.map((c) => (
                <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} versionSuffix={versionSuffix} onOpen={open} />
              ))}
            </div>
          )
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
                        aria-label={`Have ${c.name} ${c.id}/${versionSuffix}`}
                      />
                    </td>
                    <td className="thumb">
                      <img loading="lazy" src={c.image} alt="" />
                    </td>
                    <td className="mono">
                      {c.id}/{versionSuffix}
                    </td>
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
            <h2>About {raw.name}</h2>
            {config.aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <table className="odds" aria-label="Cards by rarity">
              <thead>
                <tr>
                  <th>Rarity</th>
                  <th>Versions</th>
                  <th className="mono">Cards</th>
                </tr>
              </thead>
              <tbody>
                {raw.rarityOrder.map((rarity) => (
                  <tr key={rarity}>
                    <td>
                      <RarityTag rarity={rarity} />
                    </td>
                    <td className="mono">{rarityVersionLabels[rarity]}</td>
                    <td className="mono">{cards.filter((c) => c.rarity === rarity).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="faq">
            <h2>{raw.name} questions</h2>
            {config.faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {openCard && (
        <div className="lb" role="dialog" aria-modal="true" aria-labelledby="gem-set-lb-title" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="lb-panel">
            <button className="lb-close" type="button" aria-label="Close" onClick={close}>
              ×
            </button>
            <div className="lb-art">
              <img src={openCard.image} alt={`${openCard.name} ${openCard.id}/${versionSuffix}, ${openCard.rarity}, ${raw.name}`} />
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
              <h2 id="gem-set-lb-title">
                {openCard.owner && <small>{openCard.owner}</small>}
                {openCard.mon}
              </h2>
              <dl className="lb-dl">
                <dt>Number</dt>
                <dd className="mono">
                  {openCard.id}/{versionSuffix}
                </dd>
                <dt>Rarity</dt>
                <dd>
                  <RarityTag rarity={openCard.rarity} />
                </dd>
                <dt>Version</dt>
                <dd>
                  {openCard.version} of {versionsPerMon}
                  {openCard.version === versionsPerMon ? ' · full art' : ''}
                  {openCard.exclusive ? ' · Chinese exclusive' : ''}
                </dd>
                <dt>Set</dt>
                <dd>
                  {raw.name} · {raw.code}
                </dd>
              </dl>
              <div className="sib-h">All {versionsPerMon} versions</div>
              <div className="sibs">
                {groups
                  .find((g) => g.groupId === openCard.id.slice(0, 2))!
                  .cards.map((sib) => (
                    <button key={sib.id} type="button" aria-current={sib.id === openCard.id} aria-label={`Version ${sib.version}, ${sib.rarity}`} onClick={() => open(sib.id)}>
                      <img src={sib.image} alt="" />
                    </button>
                  ))}
              </div>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                <input type="checkbox" className="have" checked={have.has(openCard.id)} onChange={() => toggleHave(openCard.id)} />
                I have this card
              </label>
              <div className="lb-actions">
                <Link className="btn btn-dark" to="/products/$id" params={{ id: config.productId }}>
                  Shop {raw.name}
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

function formatReleaseDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
