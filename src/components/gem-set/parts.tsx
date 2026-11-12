import { RARITY_CODE, RARITY_SYMBOL } from '~/lib/gem-sets/rarity'
import type { Card } from '~/lib/gem-sets/types'

export function RarityTag({ rarity }: { rarity: string }) {
  return (
    <span className="rtag" data-r={RARITY_CODE[rarity]}>
      <span className="sym">{RARITY_SYMBOL[rarity]}</span>
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
export function CardThumb({
  card,
  dimmed,
  showName,
  have,
  priority,
  onOpen,
}: {
  card: Card
  dimmed: boolean
  showName: boolean
  have: boolean
  priority?: boolean
  onOpen: (id: string) => void
}) {
  return (
    <button type="button" className={`card${dimmed ? ' dim' : ''}`} onClick={() => onOpen(card.id)}>
      <span className="img">
        {card.image ? (
          <img
            loading={priority ? undefined : 'lazy'}
            src={card.image}
            alt={`${card.name} ${card.id}/${card.suffix}, ${card.rarity}`}
            width={300}
            height={419}
          />
        ) : (
          <span className="img-ph">Image coming soon</span>
        )}
        {have && (
          <span className="own" aria-label="In your collection">
            ✓
          </span>
        )}
      </span>
      <span className="meta">
        <span className="no">{card.id}/{card.suffix}</span>
        <RarityTag rarity={card.rarity} />
      </span>
      {showName && <span className="nm">{card.name}</span>}
    </button>
  )
}
