// Shared between __root.tsx (sets this client-side from `?ref=` on any
// page) and orders.ts's placeOrder (reads it server-side at checkout) — one
// constant so the two never drift apart on the cookie name.
export const AFFILIATE_REF_COOKIE = 'ebi_ref'
