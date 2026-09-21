// Temporary on/off switches for whole nav sections, at Leon's request —
// flip back to true to bring one back. Kept here (not inline) since each
// of these is referenced from more than one place (header + footer).
export const SHOW_ACRYLICS = true

// hello@ebicollectibles.com isn't set up yet (mail bounces) — hides the
// "Contact us" section on /privacy and /terms-of-service until the
// ebicollectibles.com domain email is finished. Flip back to true then
// (or point those sections at eastblueinternational@gmail.com instead,
// like the refund-policy page already does for cancellation requests).
export const SHOW_CONTACT_EMAIL = false

// Shippo isn't wired up with a real API key/ship-from address yet (see
// server/shippo.ts) — until it is, block Alaska/Hawaii checkout outright
// rather than charge the flat mainland rate on a package that can
// genuinely cost more to ship there. Customers are told early (as soon as
// they pick the state, in checkout.tsx) and pointed at
// eastblueinternational@gmail.com to order directly instead. Flip to false
// once SHIPPO_API_KEY + SHIP_FROM_* are set and you've verified a real
// AK/HI quote comes back correctly.
export const BLOCK_HI_AK_CHECKOUT = true
