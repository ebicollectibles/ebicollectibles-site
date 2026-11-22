// Signed "view this order" links for order emails, like the order status
// links big shops send: the link opens one order without signing in.
//
// A token is a base64url HMAC-SHA256 (first 16 bytes) of the order's id, so
// it only ever opens the order it was made for and can't be guessed or
// edited to open another. Tokens don't expire, same as a store's emailed
// order link. What the page shows is limited in server/order-link.ts: no
// payment details, phone or billing address, and nothing can be changed.

import { fromB64Url, hmac, timingSafeEqual, toB64Url } from './unsubscribe-token'

const message = (orderId: string) => `order-view:v1:${orderId.toLowerCase()}`

export async function makeOrderLinkToken(orderId: string, secret: string): Promise<string> {
  return toB64Url(await hmac(secret, message(orderId)))
}

export async function verifyOrderLinkToken(orderId: string, token: string | null | undefined, secret: string): Promise<boolean> {
  if (!token || token.length > 64) return false
  const sig = fromB64Url(token)
  if (!sig || sig.length !== 16) return false
  return timingSafeEqual(sig, await hmac(secret, message(orderId)))
}
