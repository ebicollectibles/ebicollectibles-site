// Alt text for card images, built only from what the set data says about a
// card (name, number as printed, rarity, exclusivity, set name). It never
// describes the artwork, because nothing in the data does.

/** "Special Art Rare (SAR)" -> "Special Art Rare". The code in brackets only repeats the name when read aloud. */
export function rarityName(rarity: string): string {
  return rarity.replace(/\s*\([A-Z0-9]+\)\s*$/, '').trim()
}

export interface AltCard {
  name: string
  /** The part of the printed number before the slash, e.g. "0307" or "154". */
  id: string
  /** The part after the slash, e.g. "07" or "127". */
  suffix: string
  rarity?: string | null
  exclusive?: boolean
}

/**
 * "Misty's Psyduck 0307/07, Triple Rare, Chinese Exclusive, Gem Vol 7".
 * Pass `setName` wherever the set is not already obvious from the page the
 * image sits on (a set's own card list does not need it; a blog post or the
 * sets index does).
 */
export function cardAlt(card: AltCard, opts: { setName?: string } = {}): string {
  const parts = [`${card.name} ${cardNumber(card)}`]
  if (card.rarity) parts.push(rarityName(card.rarity))
  if (card.exclusive) parts.push('Chinese Exclusive')
  if (opts.setName) parts.push(opts.setName)
  return parts.join(', ')
}

/** The collector number as printed on the card. */
export function cardNumber(card: Pick<AltCard, 'id' | 'suffix'>): string {
  return card.suffix ? `${card.id}/${card.suffix}` : card.id
}
