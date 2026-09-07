// Thin wrapper around gtag (loaded conditionally in __root.tsx, only when
// VITE_GA_MEASUREMENT_ID is set) — every call site stays a no-op when GA
// isn't configured, same "just works either way" pattern as Square/Resend.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}
