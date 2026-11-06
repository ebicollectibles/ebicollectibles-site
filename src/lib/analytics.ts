// Thin wrapper around gtag (loaded conditionally in __root.tsx, only once
// analytics cookie consent is granted — see CookieConsent.tsx) — every call
// site stays a no-op when GA isn't configured or consent isn't granted,
// same "just works either way" pattern as Square/Resend.
import { getConsent } from './cookie-consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  // Re-checked on every call, not just at script-load time — so revoking
  // analytics consent mid-session (via the cookie preferences modal) stops
  // new events immediately, even though the already-loaded gtag script
  // itself can't be unloaded.
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && getConsent()?.analytics) {
    window.gtag('event', name, params)
  }
}
