// Where a visitor came from, taken from the UTM tags our own tracked links
// add (see short_links and routes/links.$slug.tsx). Set client-side in
// __root.tsx, only with marketing consent (same rule as the affiliate
// ?ref= cookie), and read server-side when someone joins the email list or
// places an order, so admin can see sign-ups and sales per link.
//
// Nothing here is trusted: values are lower-cased, length-capped and limited
// to [a-z0-9._-], and anything else is dropped. A missing or broken cookie
// simply means "no source"; it never blocks a sign-up or an order.

export const TRAFFIC_SOURCE_COOKIE = 'ebi_src'
export const TRAFFIC_SOURCE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

export interface TrafficSource {
  source: string
  medium: string | null
  campaign: string | null
}

function clean(value: string | null | undefined): string | null {
  const v = value?.trim().toLowerCase().slice(0, 64)
  return v && /^[a-z0-9._-]+$/.test(v) ? v : null
}

/** UTM tags from a URL query string, or null when there is no usable utm_source. */
export function trafficSourceFromSearch(search: string): TrafficSource | null {
  const params = new URLSearchParams(search)
  const source = clean(params.get('utm_source'))
  if (!source) return null
  return { source, medium: clean(params.get('utm_medium')), campaign: clean(params.get('utm_campaign')) }
}

export function encodeTrafficSource(t: TrafficSource): string {
  return [t.source, t.medium ?? '', t.campaign ?? ''].join('|')
}

export function decodeTrafficSource(raw: string | null | undefined): TrafficSource | null {
  if (!raw) return null
  let text = raw
  try {
    text = decodeURIComponent(raw)
  } catch {
    return null
  }
  const [s, m, c] = text.split('|')
  const source = clean(s)
  if (!source) return null
  return { source, medium: clean(m), campaign: clean(c) }
}

/** Key used to match stored sign-ups and orders back to a tracked link. */
export function trafficSourceKey(source: string | null | undefined, medium: string | null | undefined, campaign: string | null | undefined): string {
  return [source ?? '', medium ?? '', campaign ?? ''].map((v) => v.trim().toLowerCase()).join('|')
}
