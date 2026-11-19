// Search-param handling for the `?card=` deep link on every set page.
//
// TanStack Router JSON-parses each query value, so a bare all-digit id
// with no leading zero (`?card=144`, `?card=1501`) arrives as the NUMBER
// 144, while `?card=099` or `?card=P001` (not valid JSON) arrives as a
// string, and `?card=%22144%22` as the string "144". A plain
// z.string().regex() threw on the number form (and on any junk value),
// which surfaced as an HTTP 500 for the whole page.
//
// Nothing here throws: a number is turned back into its digits (no
// padding: a value that parsed as a number cannot have had a leading
// zero), the result is checked against the page's own id pattern, and
// anything that does not match simply means "no card open".
//
// The validated search keeps the value in the form it arrived in (number
// stays a number) on purpose. The router re-serialises the validated
// search and redirects when that differs from the requested URL, so
// turning 144 into "144" here made `?card=144` answer with a 307 to
// `?card=%22144%22` instead of a plain 200.
export type CardSearch = { card?: string | number }

/** The card id a raw search value refers to, or undefined when it is not a valid id for this page. */
export function parseCardParam(value: unknown, pattern: RegExp): string | undefined {
  const id = typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? String(value) : value
  return typeof id === 'string' && pattern.test(id) ? id : undefined
}

/** validateSearch for a set page whose card ids match `pattern`. */
export function cardSearchValidator(pattern: RegExp) {
  return (search: Record<string, unknown>): CardSearch => {
    const raw = search.card
    return parseCardParam(raw, pattern) === undefined ? {} : { card: raw as string | number }
  }
}

/** The open card's id (always a string) from a validated search, or null. */
export function openCardIdFromSearch(search: CardSearch): string | null {
  return search.card == null ? null : String(search.card)
}

// The value to hand the router for a card id so the URL comes out as the
// plain `?card=144` rather than `?card=%22144%22`: the router quotes any
// string that would otherwise read back as a number. Ids with a leading
// zero or a letter ("099", "0706", "P001") are not valid JSON numbers and
// stay strings, which the router already writes unquoted.
export function cardSearchValue(id: string | undefined): string | number | undefined {
  if (id === undefined) return undefined
  return /^(0|[1-9]\d*)$/.test(id) && Number.isSafeInteger(Number(id)) ? Number(id) : id
}

/** `?card=` query string for a shareable link; reads back to the same id through cardSearchValidator. */
export function cardLinkQuery(id: string): string {
  return `?card=${encodeURIComponent(id)}`
}
