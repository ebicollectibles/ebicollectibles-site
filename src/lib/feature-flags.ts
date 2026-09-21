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

// Shippo is now wired up with a real API key + ship-from address (Cloudflare
// Worker secrets) — verified 2026-09-21 with live CreateShipment quotes to
// both Honolulu, HI and Anchorage, AK, both returning sane real rates
// (~$9-11 for a 1lb parcel, close to the flat $10) with no USPS Flat Rate
// service levels involved. AK/HI checkout now uses the real Shippo quote
// (server/shippo.ts) instead of being blocked. Flip back to true if Shippo
// ever needs to be disabled again (e.g. key revoked, ship-from address
// changes and needs re-verifying).
export const BLOCK_HI_AK_CHECKOUT = false
