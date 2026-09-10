import { createServerOnlyFn } from '@tanstack/react-start'

export interface RequestSignals {
  ipAddress: string | null
  asn: number | null
  asOrganization: string | null
  country: string | null
}

const EMPTY_SIGNALS: RequestSignals = { ipAddress: null, asn: null, asOrganization: null, country: null }

// Same reasoning as admin-auth.ts/customer-auth.ts's session helpers:
// wrapped in createServerOnlyFn so the bundler strips the
// @tanstack/react-start/server import out of the client build entirely.
// This file is reachable from client-rendered routes (checkout.tsx ->
// customer-auth.ts -> here), so a bare dynamic import isn't enough on its
// own — the import-protection plugin still flags it as client-reachable,
// and previously that surfaced as a real runtime failure (an uncaught
// ErrorEvent that broke placeOrder's server function entirely) rather than
// the caller's try/catch cleanly falling back to nulls.
const readRequestSignals = createServerOnlyFn(async (): Promise<RequestSignals> => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const request = getRequest()
  const cf = (request as unknown as { cf?: Record<string, unknown> }).cf
  return {
    ipAddress: request.headers.get('cf-connecting-ip'),
    asn: typeof cf?.asn === 'number' ? cf.asn : null,
    asOrganization: typeof cf?.asOrganization === 'string' ? cf.asOrganization : null,
    country: typeof cf?.country === 'string' ? cf.country : null,
  }
})

/**
 * Cloudflare-specific request signals — CF-Connecting-IP plus the `cf`
 * object the Workers runtime attaches to every incoming Request. All free,
 * computed by Cloudflare's edge with no extra network call. Returns all
 * nulls outside Cloudflare (e.g. local dev) rather than throwing, since
 * auth events should still record without them.
 */
export async function captureRequestSignals(): Promise<RequestSignals> {
  try {
    return await readRequestSignals()
  } catch {
    return EMPTY_SIGNALS
  }
}

// Heuristic, not a verdict — matches well-known cloud/hosting network names.
// A login from one of these is from a datacenter, not a home connection;
// update this list anytime as new providers show up, no migration needed.
const DATACENTER_KEYWORDS = [
  'amazon',
  'aws',
  'google cloud',
  'google llc',
  'microsoft azure',
  'microsoft corporation',
  'digitalocean',
  'ovh',
  'hetzner',
  'linode',
  'akamai',
  'vultr',
  'oracle cloud',
  'cloudflare warp',
  'contabo',
  'leaseweb',
  'choopa',
  'm247',
]

export function looksLikeDatacenter(asOrganization: string | null): boolean {
  if (!asOrganization) return false
  const lower = asOrganization.toLowerCase()
  return DATACENTER_KEYWORDS.some((kw) => lower.includes(kw))
}
