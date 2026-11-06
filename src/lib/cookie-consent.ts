import { useSyncExternalStore } from 'react'

// Single source of truth for cookie consent — the banner, the preferences
// modal, and the Cookie Policy page all read the same CATEGORY metadata so
// their descriptions can never drift out of sync with each other.
//
// Plain module-level store (not a React context) on purpose: trackEvent()
// in analytics.ts needs to check consent from a non-component function, and
// the affiliate-ref effect in __root.tsx needs the same value a render
// behind. useCookieConsent() below is just a thin useSyncExternalStore
// wrapper around it for components that need to re-render on change.

export interface ConsentCategories {
  analytics: boolean
  marketing: boolean
}

interface StoredConsent extends ConsentCategories {
  version: number
  decidedAt: string
}

const STORAGE_KEY = 'ebi-cookie-consent'

// Bump this if what we actually track changes materially (a new analytics
// tool, a new category) — a version mismatch is treated as "never decided",
// so everyone sees the banner again and re-consents under the new terms.
const CONSENT_VERSION = 1

export const COOKIE_CATEGORIES = [
  {
    key: 'necessary' as const,
    name: 'Necessary',
    required: true,
    description:
      "Required for the site to work at all — signing in, keeping items in your cart, and completing checkout securely. These can't be switched off, or the site simply won't function.",
    cookies: [
      { name: '__session, __client_uat', provider: 'Clerk (sign-in)', purpose: 'Keeps you signed in and your session secure', duration: 'Session, up to 1 year' },
      { name: 'Square payment session', provider: 'Square', purpose: 'Processes your card payment securely and screens for fraud during checkout', duration: 'Session' },
    ],
  },
  {
    key: 'analytics' as const,
    name: 'Analytics',
    required: false,
    description:
      'Helps us understand how visitors use the site — which pages are popular, where people drop off in checkout — so we can improve it. Off by default; nothing loads until you turn this on.',
    cookies: [{ name: '_ga, _ga_*, _gid', provider: 'Google Analytics', purpose: 'Distinguishes visitors and measures site usage in aggregate', duration: 'Up to 2 years' }],
  },
  {
    key: 'marketing' as const,
    name: 'Marketing',
    required: false,
    description:
      'Remembers which affiliate or referral link brought you here, so we can credit the right person for your order. Off by default.',
    cookies: [{ name: 'ebi_ref', provider: 'EBI Collectibles (first-party)', purpose: 'Attributes your order to the referral link you followed', duration: '14 days' }],
  },
]

let currentConsent: ConsentCategories | null = null
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.version === 'number' && typeof v.analytics === 'boolean' && typeof v.marketing === 'boolean'
}

// Runs once, client-side only, when this module is first imported in the
// browser — so the very first render already knows a previously-stored
// choice without waiting on an effect.
if (typeof window !== 'undefined') {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (isStoredConsent(parsed) && parsed.version === CONSENT_VERSION) {
      currentConsent = { analytics: parsed.analytics, marketing: parsed.marketing }
    }
  } catch {
    // localStorage blocked (private mode, locked-down browser) — treat as
    // "never decided"; the banner shows every visit, which is the correct,
    // safe fallback rather than silently assuming consent either way.
  }
}

export function getConsent(): ConsentCategories | null {
  return currentConsent
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setConsent(next: ConsentCategories) {
  currentConsent = next
  if (typeof window !== 'undefined') {
    try {
      const stored: StoredConsent = { ...next, version: CONSENT_VERSION, decidedAt: new Date().toISOString() }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      // Consent still holds for this session via the in-memory value above
      // even if it can't be persisted.
    }
  }
  notify()
}

function getServerSnapshot(): ConsentCategories | null {
  return null
}

/** null = no decision on record yet (show the banner). */
export function useCookieConsent(): ConsentCategories | null {
  return useSyncExternalStore(subscribeConsent, getConsent, getServerSnapshot)
}
