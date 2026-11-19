import { RARITY_CODE, RARITY_SYMBOL } from '~/lib/gem-sets/rarity'
import { cardAlt, cardNumber } from '~/lib/gem-sets/alt'
import type { Card } from '~/lib/gem-sets/types'

export function RarityTag({ rarity }: { rarity: string }) {
  return (
    <span className="rtag" data-r={RARITY_CODE[rarity]}>
      <span className="sym" aria-hidden="true">
        {RARITY_SYMBOL[rarity]}
      </span>
      {rarity}
    </span>
  )
}

// One thumbnail, shared by the "By Pokémon" rail and the "All cards" grid.
// Renders exactly one rarity tag (symbol + name) in the meta row — the
// Pokémon's own name is only shown here in the grid view, since in the
// ladder it's already the row's own heading. Uses the card's own suffix
// (not a page-wide one) since a catalog block — Trainers, Energy — can
// use a different version denominator than the rest of the set.
//
// `priority`: true for the first handful of cards in whichever grid this
// sits in (the caller knows its own index) — those are reliably above
// the fold at normal viewport widths, so lazy-loading them only delays a
// fetch the browser could have started immediately. Blanket loading=lazy
// on every single card, including the first row, was actively hurting
// this page's LCP.
//
// The tile is a wrapper around two sibling buttons (a button cannot sit
// inside another button): the card itself, which opens the detail dialog,
// and a small "owned" toggle over the image's top-right corner, which
// flips the checklist state without opening anything.
export function CardThumb({
  card,
  dimmed,
  showName,
  have,
  priority,
  onOpen,
  onToggleHave,
}: {
  card: Card
  dimmed: boolean
  showName: boolean
  have: boolean
  priority?: boolean
  onOpen: (id: string) => void
  onToggleHave: (id: string) => void
}) {
  return (
    <div className={`tile${dimmed ? ' dim' : ''}${have ? ' owned' : ''}`}>
      <button type="button" className="card" onClick={() => onOpen(card.id)}>
        <span className="img">
          {card.image ? (
            <img
              loading={priority ? undefined : 'lazy'}
              src={card.image}
              alt={cardAlt(card)}
              width={300}
              height={419}
            />
          ) : (
            <span className="img-ph">Image coming soon</span>
          )}
        </span>
        {/* With an image, its alt already gives the name, number and
            rarity, so the same text below is hidden from screen readers
            rather than read twice. Without one, this text is the name. */}
        <span className="meta" aria-hidden={card.image ? true : undefined}>
          <span className="no">{cardNumber(card)}</span>
          <RarityTag rarity={card.rarity} />
        </span>
        {showName && (
          <span className="nm" aria-hidden={card.image ? true : undefined}>
            {card.name}
          </span>
        )}
        {!showName && !card.image && <span className="sr-only">{card.name}</span>}
      </button>
      <button type="button" className="own-toggle" aria-pressed={have} aria-label={haveLabel(card)} title={have ? 'In your collection' : 'Mark as owned'} onClick={() => onToggleHave(card.id)}>
        <span aria-hidden="true">{have ? '✓' : '+'}</span>
      </button>
    </div>
  )
}

/** Accessible name shared by every "owned" toggle for a card (tile, checklist row). */
export function haveLabel(card: Card): string {
  return `Mark ${card.name} ${cardNumber(card)} as owned`
}
