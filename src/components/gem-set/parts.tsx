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
// ladder it's already the row's own heading.
export function CardThumb({
  card,
  dimmed,
  showName,
  have,
  versionSuffix,
  onOpen,
}: {
  card: Card
  dimmed: boolean
  showName: boolean
  have: boolean
  versionSuffix: string
  onOpen: (id: string) => void
}) {
  return (
    <button type="button" className={`card${dimmed ? ' dim' : ''}`} onClick={() => onOpen(card.id)}>
      <span className="img">
        <img loading="lazy" src={card.image} alt={`${card.name} ${card.id}/${versionSuffix}, ${card.rarity}`} />
        {have && (
          <span className="own" aria-label="In your collection">
            ✓
          </span>
        )}
      </span>
      <span className="meta">
        <span className="no">{card.id}/{versionSuffix}</span>
        <RarityTag rarity={card.rarity} />
      </span>
      {showName && <span className="nm">{card.name}</span>}
    </button>
  )
}
