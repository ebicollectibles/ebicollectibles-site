import * as React from 'react'
import { Link, useLoaderData } from '@tanstack/react-router'
import type { BlogGuideLink } from '~/server/blog-status'
import { SITE_URL } from '~/lib/gem-sets/constants'
import { cardLinkQuery } from '~/lib/gem-sets/card-search'
import { buildGemSetJsonLd, safeJsonLd } from '~/lib/gem-sets/head'
import { RARITY_CODE, RARITY_SYMBOL } from '~/lib/gem-sets/rarity'
import type { BuiltGemSetData, Card, GemSetConfig, GemSetData } from '~/lib/gem-sets/types'
import { cardAlt, cardNumber, rarityName } from '~/lib/gem-sets/alt'
import { CardThumb, RarityTag, haveLabel } from './parts'

const GUIDE_LABEL: Record<string, string> = { 'release-news': 'Release news', 'set-guide': 'Set guide', 'card-origins': 'Card origins' }

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
  // The set's live blog posts, from the set route's loader (getBlogGuidesFor).
  const loaded = useLoaderData({ strict: false }) as unknown
  const guides = Array.isArray(loaded) ? (loaded as BlogGuideLink[]).filter((g) => g && g.path) : []
  const { cards, cardById, groups, versionsPerMon, monCount, rarityVersionLabels } = data

  const [view, setView] = React.useState<'ladder' | 'grid' | 'exclusives' | 'list'>('grid')
  const [query, setQuery] = React.useState('')
  const [rarities, setRarities] = React.useState<Set<string>>(() => new Set())
  const [have, setHave] = React.useState<Set<string>>(() => new Set())
  // Set once the saved checklist has been read back, so the save effect
  // below never writes the initial empty set over what is in storage.
  const [haveLoaded, setHaveLoaded] = React.useState(false)
  // Checklist tab only: which cards to list, and the two-step "Clear
  // checklist" confirmation.
  const [ownFilter, setOwnFilter] = React.useState<'all' | 'missing' | 'owned'>('all')
  const [confirmClear, setConfirmClear] = React.useState(false)
  const [headerH, setHeaderH] = React.useState(73)
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
      if (Array.isArray(saved)) setHave(new Set(saved.filter((id): id is string => typeof id === 'string')))
    } catch {
      // ignore
    }
    setHaveLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (!haveLoaded) return
    try {
      localStorage.setItem(config.storageKey, JSON.stringify([...have]))
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [have, haveLoaded])

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
  //
  // Only when focus is not already inside the dialog: stepping with the
  // arrow buttons, the arrow keys or a version thumbnail keeps focus on
  // the control that was used (so it can be pressed again), and the new
  // card is announced by the polite live region in the dialog instead of
  // "Close, button" being read out on every step.
  React.useEffect(() => {
    if (!openCard) return
    if (lbPanelRef.current?.contains(document.activeElement)) return
    lbCloseRef.current?.focus()
  }, [openCard?.id])

  React.useEffect(() => {
    if (!openCard) return
    const onKey = (e: KeyboardEvent) => {
      // A dialog opened on top of this one (cookie preferences) handles
      // its own keys.
      if (document.querySelector('[data-ebi-modal]')) return
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Tab') {
        // Keeps Tab/Shift+Tab cycling within the dialog instead of
        // escaping into the page underneath, which the backdrop can't
        // otherwise prevent since it isn't a native <dialog>.
        const panel = lbPanelRef.current
        if (!panel) return
        const focusables = Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!panel.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
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
    const url = `${SITE_URL}${config.routePath}${cardLinkQuery(openCard.id)}`
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

  // Counted against this set's own cards, not have.size, so an id left in
  // storage that the set no longer has can never push it past the total.
  const ownedCount = React.useMemo(() => cards.filter((c) => have.has(c.id)).length, [cards, have])
  const ownedPct = cards.length > 0 ? Math.round((ownedCount / cards.length) * 100) : 0
  const checklistShown = React.useMemo(
    () => (ownFilter === 'all' ? shown : shown.filter((c) => have.has(c.id) === (ownFilter === 'owned'))),
    [shown, have, ownFilter],
  )
  // The confirm buttons unmount when the question is answered, which would
  // drop keyboard focus onto <body>; send it somewhere sensible instead
  // (back to "Clear checklist" on cancel; that button is disabled once the
  // list is empty, so to the checklist header after a clear).
  const clearBtnRef = React.useRef<HTMLButtonElement>(null)
  const clHeadRef = React.useRef<HTMLElement>(null)
  const clearChecklist = () => {
    setHave(new Set())
    setConfirmClear(false)
    setOwnFilter('all')
    requestAnimationFrame(() => clHeadRef.current?.focus())
  }
  const cancelClear = () => {
    setConfirmClear(false)
    requestAnimationFrame(() => clearBtnRef.current?.focus())
  }
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
  // Where the open card sits in the list the arrows step through (see step()).
  const stepList = shown.length > 0 ? shown : cards
  const stepIndex = openCard ? Math.max(0, stepList.findIndex((c) => c.id === openCard.id)) : 0

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
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/shop">Shop</Link>
              <span aria-hidden="true">/</span>
              <Link to="/sets">Sets</Link>
              <span aria-hidden="true">/</span>
              <Link to={config.region?.path ?? '/sets/chinese'}>{config.region?.label ?? 'Chinese'}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{raw.name}</span>
            </nav>
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
                <dd>
                  <time dateTime={raw.releaseDate}>{releasedLabel}</time>
                </dd>
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
                  const list = document.getElementById('list')
                  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  list?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' })
                  // Keyboard and screen-reader focus follows the jump.
                  list?.focus({ preventScroll: true })
                }}
              >
                Browse the cards
              </a>
            </div>
            {guides.length > 0 && (
              <p className="hero-guides">
                <span>Read our guides:</span>
                {guides.map((g, i) => (
                  <React.Fragment key={g.path}>
                    {i > 0 && <span aria-hidden="true"> · </span>}
                    <Link to={g.path as never} title={g.title}>
                      {GUIDE_LABEL[g.path.match(/(release-news|set-guide|card-origins)$/)?.[1] ?? ''] ?? g.tag}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
          <div
            className="fan"
            ref={fanRef}
            role="region"
            onTouchStart={onFanTouchStart}
            onTouchMove={onFanTouchMove}
            onTouchEnd={onFanTouchEnd}
            aria-label="Featured cards"
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
                >
                  {/* The button is named by its image's alt (plus the
                      "Chinese Exclusive" tag when shown), so the visible
                      text is always part of the accessible name. */}
                  <img
                    src={c.image ?? undefined}
                    alt={cardAlt({ ...c, exclusive: false }, { setName: raw.name })}
                    width={300}
                    height={419}
                    // Only the card actually centered on first paint is
                    // this page's real LCP candidate — fetchPriority
                    // "high" on all 5 would dilute itself by putting 4
                    // cards that aren't it into the same top queue.
                    fetchPriority={i === fanIndex ? 'high' : undefined}
                  />
                  {c.exclusive && <span className="fan-excl">Chinese Exclusive</span>}
                </button>
              )
            })}
            <div className="fan-cap">{config.fanCaption ?? `${topRarity} full arts`}</div>
          </div>
        </div>
      </section>

      <div className="bar" id="list" tabIndex={-1}>
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
                <span className="sym" aria-hidden="true" style={{ color: `var(--r-${(RARITY_CODE[rarity] ?? '').toLowerCase()})` }}>
                  {RARITY_SYMBOL[rarity]}
                </span>
                {rarity}
                <span className="n">
                  {cards.filter((c) => c.rarity === rarity).length}
                  <span className="sr-only"> cards</span>
                </span>
              </button>
            ))}
          </div>
          <div className="views" role="group" aria-label="View">
            {(
              [
                ['grid', 'All cards'],
                ['ladder', 'By Pokémon'],
                ...(hasAnyExclusive ? ([['exclusives', 'Chinese Exclusives']] as const) : []),
                ['list', 'Checklist'],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {label}
              </button>
            ))}
          </div>
          <div className="count">
            <span role="status">
              <b>{shown.length}</b> of {raw.cardCount} cards<span className="sr-only"> shown</span>
            </span>
            {view !== 'list' && (
              <span className="progress">
                <i aria-hidden="true">
                  <s style={{ width: `${ownedPct}%` }} />
                </i>
                <span>
                  <b>{ownedCount}</b> of {cards.length} owned
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Not a <main>: the site layout (__root.tsx) already wraps every
          page in the one <main id="main-content"> landmark. */}
      <div className="wrap set-main">
        {view === 'list' && (
          <section className="cl-head" aria-label="Your checklist" ref={clHeadRef} tabIndex={-1}>
            <div className="cl-progress">
              <div className="cl-count" role="status">
                <b>{ownedCount}</b> of {cards.length} owned
              </div>
              <div
                className="cl-bar"
                role="progressbar"
                aria-label={`${raw.name} cards owned`}
                aria-valuemin={0}
                aria-valuemax={cards.length}
                aria-valuenow={ownedCount}
                aria-valuetext={`${ownedCount} of ${cards.length} owned`}
              >
                <span style={{ width: `${ownedPct}%` }} />
              </div>
            </div>
            <div className="cl-tools">
              <div className="chips" role="group" aria-label="Show cards">
                {(
                  [
                    ['all', 'All', cards.length],
                    ['missing', 'Missing', cards.length - ownedCount],
                    ['owned', 'Owned', ownedCount],
                  ] as const
                ).map(([f, label, n]) => (
                  <button key={f} type="button" className="chip" aria-pressed={ownFilter === f} onClick={() => setOwnFilter(f)}>
                    {label}
                    <span className="n">
                      {n}
                      <span className="sr-only"> cards</span>
                    </span>
                  </button>
                ))}
              </div>
              {confirmClear ? (
                <div className="cl-confirm" role="group" aria-label="Confirm clearing the checklist">
                  <span>Clear all {ownedCount} owned cards?</span>
                  <button type="button" className="btn btn-dark" onClick={clearChecklist}>
                    Yes, clear
                  </button>
                  <button type="button" className="btn btn-line" onClick={cancelClear} autoFocus>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn-line cl-clear" ref={clearBtnRef} disabled={ownedCount === 0} onClick={() => setConfirmClear(true)}>
                  Clear checklist
                </button>
              )}
            </div>
            <p className="cl-note">Saved in this browser only.</p>
          </section>
        )}
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
                <section className="ladder" key={c0.id}>
                  <div className="lhead">
                    <span className="lno">
                      <span className="sr-only">Number </span>
                      <span aria-hidden="true">#</span>
                      {g.groupId}
                    </span>
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
                      <CardThumb key={c.id} card={c} dimmed={!match(c)} showName={false} have={have.has(c.id)} onOpen={open} onToggleHave={toggleHave} />
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
                  <h2 className="spotlight-tag">{exclusiveShown.length > 1 ? 'Chinese Exclusives' : 'Chinese Exclusive'}</h2>
                  <p className="spotlight-sub">{config.exclusiveSub ?? 'Only in the Simplified Chinese release.'}</p>
                </div>
                <div className="grid">
                  {exclusiveShown.map((c, i) => (
                    <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} priority={i < 8} onOpen={open} onToggleHave={toggleHave} />
                  ))}
                </div>
              </section>
            )}
            {/* Always a heading for the card grid, so the list can be reached
                by heading navigation; it is only shown when the Chinese
                Exclusives block sits above it. */}
            <h2 className={exclusiveShown.length > 0 ? 'grid-head' : 'sr-only'}>All cards</h2>
            <div className="grid">
              {shown.map((c, i) => (
                <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} priority={exclusiveShown.length === 0 && i < 8} onOpen={open} onToggleHave={toggleHave} />
              ))}
            </div>
          </>
        ) : view === 'exclusives' ? (
          exclusiveShown.length === 0 ? (
            <div className="empty">No Chinese Exclusive cards match. Try another name or clear the rarity filter.</div>
          ) : (
            <>
              <h2 className="sr-only">Chinese Exclusives</h2>
              <div className="grid">
                {exclusiveShown.map((c) => (
                  <CardThumb key={c.id} card={c} dimmed={false} showName={true} have={have.has(c.id)} onOpen={open} onToggleHave={toggleHave} />
                ))}
              </div>
            </>
          )
        ) : (
          checklistShown.length === 0 ? (
          <div className="empty">
            {ownFilter === 'owned'
              ? 'No owned cards here yet. Tick a card to add it to your collection.'
              : 'Nothing missing here. You own every card that matches.'}
          </div>
        ) : (
          <div className="tablewrap">
            <table className="checklist">
              <caption className="sr-only">{raw.name} checklist</caption>
              <thead>
                <tr>
                  <th scope="col">Own</th>
                  <th scope="col" className="thumb">
                    <span className="sr-only">Image</span>
                  </th>
                  <th scope="col">No.</th>
                  <th scope="col">Card</th>
                  <th scope="col">Rarity</th>
                </tr>
              </thead>
              <tbody>
                {checklistShown.map((c) => (
                  <tr key={c.id} className={have.has(c.id) ? 'owned' : undefined}>
                    <td className="chk">
                      <label>
                        <input type="checkbox" className="have" checked={have.has(c.id)} onChange={() => toggleHave(c.id)} aria-label={haveLabel(c)} />
                      </label>
                    </td>
                    <td className="thumb">{c.image ? <img src={c.image} alt="" loading="lazy" width={36} height={50} /> : null}</td>
                    <td className="mono">
                      {c.id}/{c.suffix}
                    </td>
                    <th scope="row">
                      <button type="button" className="lnk" onClick={() => open(c.id)}>
                        {c.name}
                      </button>
                    </th>
                    <td>
                      <RarityTag rarity={c.rarity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        )}
      </div>

      <section className="about">
        <div className="wrap">
          <div>
            <h2>About {raw.name}</h2>
            {config.aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <table className="odds">
              <caption className="sr-only">{raw.name} cards by rarity</caption>
              <thead>
                <tr>
                  <th scope="col">Rarity</th>
                  <th scope="col">Versions</th>
                  <th scope="col" className="mono">
                    Cards
                  </th>
                </tr>
              </thead>
              <tbody>
                {raw.rarityOrder.map((rarity) => (
                  <tr key={rarity}>
                    <th scope="row">
                      <RarityTag rarity={rarity} />
                    </th>
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
            <button className="lb-close" type="button" aria-label="Close card details" ref={lbCloseRef} onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
            <div className="lb-art">
              {openCard.image ? (
                <img src={openCard.image} alt={cardAlt(openCard, { setName: raw.name })} width={300} height={419} />
              ) : (
                <div className="lb-art-ph">Image coming soon</div>
              )}
            </div>
            <div className="lb-info">
              <div className="lb-nav">
                <button type="button" aria-label="Previous card" aria-keyshortcuts="ArrowLeft" onClick={() => step(-1)}>
                  <span aria-hidden="true">←</span>
                </button>
                <button type="button" aria-label="Next card" aria-keyshortcuts="ArrowRight" onClick={() => step(1)}>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              {/* Read out when the card changes (arrow keys, arrow buttons,
                  a version thumbnail) without moving focus. */}
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {`${openCard.name}, ${cardNumber(openCard)}, ${rarityName(openCard.rarity)}${openCard.exclusive ? ', Chinese Exclusive' : ''}. Card ${stepIndex + 1} of ${stepList.length}.`}
              </p>
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
                  {openCard.exclusive ? ' · Chinese Exclusive' : ''}
                </dd>
                <dt>Set</dt>
                <dd>
                  {raw.name} · {raw.code}
                </dd>
              </dl>
              <h3 className="sib-h" id="gem-set-lb-versions">
                All {openGroup?.cards.length ?? 1} versions
              </h3>
              <div className="sibs" role="group" aria-labelledby="gem-set-lb-versions">
                {(openGroup?.cards ?? []).map((sib, i) => (
                  <button key={sib.id} type="button" aria-current={sib.id === openCard.id} aria-label={`Version ${i + 1}, ${cardNumber(sib)}, ${rarityName(sib.rarity)}`} onClick={() => open(sib.id)}>
                    {sib.image ? <img src={sib.image} alt="" width={300} height={419} /> : <span className="sib-ph" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn have-btn"
                aria-pressed={have.has(openCard.id)}
                onClick={() => toggleHave(openCard.id)}
              >
                {have.has(openCard.id) ? (
                  <>
                    In my collection <span aria-hidden="true">✓</span>
                  </>
                ) : (
                  'I have this card'
                )}
              </button>
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
              <div className="toast" role="status">
                {copied ? 'Link copied.' : ''}
              </div>
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
