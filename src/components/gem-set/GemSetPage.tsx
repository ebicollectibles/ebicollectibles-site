import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { buildGemSetJsonLd, safeJsonLd } from '~/lib/gem-sets/head'
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
// Fixed left-to-right slot positions for the hero fan, keyed by how many
// cards it holds. Every set so far uses 5 (its own picks plus however
// many are genuinely exclusive); a set with a different number of real
// exclusives — Gem Vol 2 has exactly 4 — can just pass that many fanIds
// instead of padding to 5 with a non-exclusive filler. Add an entry here
// if a future set needs a size besides 4 or 5; anything else falls back
// to the 5-slot layout (an extra/missing card will just double up on or
// skip the last slot rather than crash).
//
// The 4-card layout keeps the 5-card layout's own near-left/center/near-
// right slots (an even split with no slot AT center reads as nothing
// being centered), and tucks the 4th card directly behind the center
// one — same x, lower z, nudged up and tilted so its edges peek out
// — rather than stranding it further out to one side.
const FAN_LAYOUTS: Record<number, Array<{ x: number; rot: number; y: number; z: number }>> = {
  5: [
    { x: -200, rot: -14, y: 26, z: 1 },
    { x: -100, rot: -7, y: 6, z: 2 },
    { x: 0, rot: 0, y: 0, z: 3 },
    { x: 100, rot: 7, y: 6, z: 2 },
    { x: 200, rot: 14, y: 26, z: 1 },
  ],
  4: [
    { x: -100, rot: -7, y: 6, z: 2 },
    { x: 0, rot: 0, y: 0, z: 3 },
    { x: 100, rot: 7, y: 6, z: 2 },
    { x: 0, rot: -8, y: -26, z: 1 },
  ],
}

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
  const { cards, cardById, groups, versionsPerMon, monCount, rarityVersionLabels } = data

  const [view, setView] = React.useState<'ladder' | 'grid' | 'exclusives' | 'list'>('grid')
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
  const touchStartXRef = React.useRef<number | null>(null)
  const touchMovedRef = React.useRef(false)
  const justSwipedRef = React.useRef(false)

  const { itemListJsonLd, faqJsonLd, breadcrumbJsonLd } = React.useMemo(() => buildGemSetJsonLd(raw, data, config), [raw, data, config])

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
  // One fixed slot per card, applied on every viewport (desktop included
  // — a swipe only happens on touch, but a static assignment still needs
  // to land each card somewhere). The slot a card sits in is "how many
  // steps clockwise it is from whichever card is currently front" mapped
  // onto FAN_LAYOUTS' fixed positions, with the front card itself placed
  // at the layout's own natural center slot (floor((n-1)/2) — plain
  // middle index for an odd count like 5, the left-of-center of the two
  // middle slots for an even count like 4, since an even number of slots
  // has no true center to put it in). A swipe advances fanIndex by
  // exactly one step, like a revolver cylinder, wrapping cyclically.
  const n = config.fanIds.length
  const fanLayout = FAN_LAYOUTS[n] ?? FAN_LAYOUTS[5]
  const fanFrontSlot = Math.floor((n - 1) / 2)
  const fanSlotStyle = (originalIndex: number): React.CSSProperties => {
    const stepsFromFront = ((originalIndex - fanIndex) % n + n) % n
    const slot = fanLayout[(fanFrontSlot + stepsFromFront) % fanLayout.length] ?? fanLayout[0]
    return {
      transform: `translate(-50%, -50%) translateX(${slot.x}px) rotate(${slot.rot}deg) translateY(${slot.y}px)`,
      zIndex: slot.z,
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
    (c: Card) => (rarities.size === 0 || rarities.has(c.rarity)) && (!q || `${c.name} ${c.id} ${c.id}/${c.suffix}`.toLowerCase().includes(q)),
    [rarities, q],
  )
  const shown = React.useMemo(() => cards.filter(match), [cards, match])
  const exclusiveShown = React.useMemo(() => shown.filter((c) => c.exclusive), [shown])
  const hasAnyExclusive = React.useMemo(() => cards.some((c) => c.exclusive), [cards])

  const openCard = cardById.get(openCardId ?? '') ?? null
  // The router's scrollRestoration is keyed to the exact URL, search
  // params included — so going from ?card=X back to no ?card lands on
  // wherever that bare URL last scrolled to (usually nowhere, i.e. the
  // top), not back to where the page was before the card opened. Saved
  // here instead, and reapplied after the navigation settles, so closing
  // (or stepping between sibling cards, which also goes through open())
  // leaves the page exactly where the user left it.
  const scrollYRef = React.useRef(0)
  // Where to send keyboard/screen-reader focus back to on close — the
  // element that had focus right before the dialog opened (a card thumb,
  // a fan card, ...), captured only on the FIRST open of a session, never
  // overwritten by stepping between siblings (document.activeElement by
  // then is something inside the dialog itself).
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const lbPanelRef = React.useRef<HTMLDivElement>(null)
  const lbCloseRef = React.useRef<HTMLButtonElement>(null)
  const open = (id: string) => {
    if (!openCard) {
      scrollYRef.current = window.scrollY
      previousFocusRef.current = (document.activeElement as HTMLElement) ?? null
    }
    navigateToCard(id).then(() => {
      window.scrollTo(0, scrollYRef.current)
    })
  }
  const close = () =>
    navigateToCard(undefined).then(() => {
      window.scrollTo(0, scrollYRef.current)
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    })
  const step = (dir: 1 | -1) => {
    if (!openCard) return
    const list = shown.length > 0 ? shown : cards
    let i = list.findIndex((c) => c.id === openCard.id)
    if (i < 0) i = 0
    open(list[(i + dir + list.length) % list.length].id)
  }

  // Moves focus into the dialog on open (and again on each step, so a
  // screen reader lands somewhere predictable rather than wherever focus
  // happened to be left) — paired with previousFocusRef/close() above,
  // which sends it back out to whatever opened the dialog.
  React.useEffect(() => {
    if (openCard) lbCloseRef.current?.focus()
  }, [openCard?.id])

  React.useEffect(() => {
    if (!openCard) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Tab') {
        // Keeps Tab/Shift+Tab cycling within the dialog instead of
        // escaping into the page underneath, which the backdrop can't
        // otherwise prevent since it isn't a native <dialog>.
        const panel = lbPanelRef.current
        if (!panel) return
        const focusables = Array.from(panel.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])'))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
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
  const heroLede =
    config.heroLede ??
    `All ${raw.cardCount} cards in ${raw.name}: ${monCount} Pokémon, each printed in ${versionsPerMon} versions from ${raw.rarityOrder[0]} up to a full-art ${topRarity}. Tap any card for a closer look and every version beside it.`
  const pokemonFact = config.pokemonFact ?? `${monCount} × ${versionsPerMon}`
  const oddsLabels = config.rarityVersionLabelsOverride ?? rarityVersionLabels
  // The group openCard actually belongs to — found by containment, not by
  // matching groupId alone, since a catalog block (Trainers, Energy) can
  // split one numbering prefix into several same-groupId groups (e.g. two
  // printings of "Basic Metal Energy" share prefix "20" with two other
  // energy types' groups).
  const openGroup = openCard ? groups.find((g) => g.cards.some((c) => c.id === openCard.id)) ?? null : null
  const openLocalVersion = openGroup && openCard ? openGroup.cards.findIndex((c) => c.id === openCard.id) + 1 : 0

  return (
    <div
      className="gem-set"
      style={{ '--header-h': `${headerH}px`, '--glow-1': config.glow1, '--glow-2': config.glow2 } as React.CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <section className="hero" id="top">
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <Link to="/sets">Sets</Link>
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
            <p className="lede">{heroLede}</p>
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
                <dd>{pokemonFact}</dd>
              </div>
            </dl>
            <div className="hero-cta">
              {config.productId ? (
                <Link className="btn btn-light" to="/products/$id" params={{ id: config.productId }}>
                  Shop {raw.name} →
                </Link>
              ) : (
                <Link className="btn btn-light" to="/shop">
                  Shop all Pokémon →
                </Link>
              )}
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
            role="region"
            onTouchStart={onFanTouchStart}
            onTouchMove={onFanTouchMove}
            onTouchEnd={onFanTouchEnd}
            aria-label="Featured full-art cards"
          >
            {config.fanIds.map((id, i) => {
              // Defensive: a typo'd fanId (easy to introduce by hand across
              // 15+ route files) would otherwise throw and take down the
              // whole page instead of just skipping its one slot.
              const c = cardById.get(id)
              if (!c) return null
              return (
                <button
                  key={id}
                  type="button"
                  style={fanSlotStyle(i)}
                  onClick={() => {
                    if (justSwipedRef.current) {
                      justSwipedRef.current = false
                      return
                    }
                    open(id)
                  }}
                  aria-label={`${c.name} ${id}/${c.suffix}`}
                >
                  <img
                    src={c.image ?? undefined}
                    alt={`${c.name} full art, ${raw.name} ${id}/${c.suffix}`}
                    width={300}
                    height={419}
                    fetchPriority="high"
                  />
                  {c.exclusive && <span className="fan-excl">Exclusive</span>}
                </button>
              )
            })}
            <div className="fan-cap">{config.fanCaption ?? `${topRarity} full arts`}</div>
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
                ['grid', 'All cards'],
                ['ladder', 'By Pokémon'],
                ...(hasAnyExclusive ? ([['exclusives', 'Exclusives']] as const) : []),
                ['list', 'Checklist'],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {label}
              </button>
            ))}
          </div>
          <div className="count">
            <span aria-live="polite">
              <b>{shown.length}</b> of {raw.cardCount} cards
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
                <section className="ladder" key={c0.id} aria-label={c0.mon}>
                  <div className="lhead">
                    <span className="lno">#{g.groupId}</span>
                    <h2 className="lname">
                      {c0.owner && <small>{c0.owner}</small>}
                      {c0.mon}
                    </h2>
                    <span className="lmeta">
                      {g.cards.length} versions · {ownedInGroup} owned
                    </span>
                    {hasExclusive && <span className="excl">Chinese Exclusive</span>}
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
          <>
            {exclusiveShown.length > 0 && (
              <section className="spotlight">
                <div className="spotlight-head">
                  <span className="spotlight-tag">{exclusiveShown.length > 1 ? 'Chinese Exclusives' : 'Chinese Exclusive'}</span>
                  <p className="spotlight-sub">Only in the Simplified Chinese release.</p>
                </div>
                <div className="grid">
                  {exclusiveShown.map((c) => (
                    <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} onOpen={open} />
                  ))}
                </div>
              </section>
            )}
            {exclusiveShown.length > 0 && <div className="grid-head">All cards</div>}
            <div className="grid">
              {shown.map((c) => (
                <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} onOpen={open} />
              ))}
            </div>
          </>
        ) : view === 'exclusives' ? (
          exclusiveShown.length === 0 ? (
            <div className="empty">No exclusive cards match. Try another name or clear the rarity filter.</div>
          ) : (
            <div className="grid">
              {exclusiveShown.map((c) => (
                <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} onOpen={open} />
              ))}
            </div>
          )
        ) : (
          <div className="empty">Checklist tracking is coming soon.</div>
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
                    <td className="mono">{oddsLabels[rarity]}</td>
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
          <div className="lb-panel" ref={lbPanelRef}>
            <button className="lb-close" type="button" aria-label="Close" ref={lbCloseRef} onClick={close}>
              ×
            </button>
            <div className="lb-art">
              {openCard.image ? (
                <img src={openCard.image} alt={`${openCard.name} ${openCard.id}/${openCard.suffix}, ${openCard.rarity}, ${raw.name}`} width={300} height={419} />
              ) : (
                <div className="lb-art-ph">Image coming soon</div>
              )}
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
                  {openCard.id}/{openCard.suffix}
                </dd>
                <dt>Rarity</dt>
                <dd>
                  <RarityTag rarity={openCard.rarity} />
                </dd>
                <dt>Version</dt>
                <dd>
                  {openLocalVersion} of {openGroup?.cards.length ?? 1}
                  {openCard.rarity === topRarity ? ' · full art' : ''}
                  {openCard.exclusive ? ' · Chinese exclusive' : ''}
                </dd>
                <dt>Set</dt>
                <dd>
                  {raw.name} · {raw.code}
                </dd>
              </dl>
              <div className="sib-h">All {openGroup?.cards.length ?? 1} versions</div>
              <div className="sibs">
                {(openGroup?.cards ?? []).map((sib, i) => (
                  <button key={sib.id} type="button" aria-current={sib.id === openCard.id} aria-label={`Version ${i + 1}, ${sib.rarity}`} onClick={() => open(sib.id)}>
                    {sib.image ? <img src={sib.image} alt="" width={300} height={419} /> : <span className="sib-ph" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <div className="lb-actions">
                {config.productId ? (
                  <Link className="btn btn-dark" to="/products/$id" params={{ id: config.productId }}>
                    Shop {raw.name}
                  </Link>
                ) : (
                  <Link className="btn btn-dark" to="/shop">
                    Shop all Pokémon
                  </Link>
                )}
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
