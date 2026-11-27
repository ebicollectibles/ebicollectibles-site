// Black Friday Week spend-and-win contest (owner's terms, Nov 2026). Shown on
// the announcement bar, the homepage banner and contest section, and in the
// cart. Everything switches itself off after the end time.

/** End of Monday, November 30, 2026, Pacific time (the shop is in WA). */
export const CONTEST_ENDS_AT = Date.parse('2026-12-01T08:00:00Z')
export const CONTEST_ENDS_LABEL = 'Monday 11/30'

export const CONTEST_PRIZES = [
  { place: '1st place', label: '#1 spender', prize: '30th Celebration Pokémon Center Elite Trainer Box' },
  { place: '2nd place', label: '#2 spender', prize: '30th Celebration Elite Trainer Box' },
  { place: '3rd place', label: '#3 spender', prize: '30th Celebration Booster Bundle' },
]

/** One free pack on every order, plus one more for every $100 spent. */
export function freePacksFor(subtotal: number): number {
  if (subtotal <= 0) return 0
  return 1 + Math.floor(subtotal / 100)
}

/** How much more to spend for the next free pack. */
export function toNextPack(subtotal: number): number {
  return Math.round((100 - (subtotal % 100)) * 100) / 100
}

export function contestLive(now = Date.now()): boolean {
  return now < CONTEST_ENDS_AT
}
