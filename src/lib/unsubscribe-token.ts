// Signed, per-subscriber unsubscribe tokens for list emails.
//
// A token is "<email>.<signature>", both base64url. The signature is an
// HMAC-SHA256 of the lower-cased email, so a link only ever unsubscribes the
// address it was made for and can't be edited to unsubscribe someone else.
// Tokens don't expire: an unsubscribe link in a two-year-old email must still
// work (CAN-SPAM requires the opt-out to keep working).
//
// Uses Web Crypto, available in Cloudflare Workers and Node 20+.

const enc = new TextEncoder()

export function toB64Url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function fromB64Url(s: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) return null
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4))
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
  } catch {
    return null
  }
}

export async function hmac(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  // 16 bytes (128 bits) is plenty against guessing and keeps links short.
  return new Uint8Array(sig).slice(0, 16)
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

const normalize = (email: string) => email.trim().toLowerCase()

export async function makeUnsubscribeToken(email: string, secret: string): Promise<string> {
  const e = normalize(email)
  return `${toB64Url(enc.encode(e))}.${toB64Url(await hmac(secret, `unsubscribe:v1:${e}`))}`
}

/** The email a token was made for, or null if the token is malformed or its signature doesn't match. */
export async function readUnsubscribeToken(token: string | null | undefined, secret: string): Promise<string | null> {
  if (!token || token.length > 600) return null
  const [emailPart, sigPart, extra] = token.split('.')
  if (!emailPart || !sigPart || extra !== undefined) return null
  const emailBytes = fromB64Url(emailPart)
  const sig = fromB64Url(sigPart)
  if (!emailBytes || !sig) return null
  const email = new TextDecoder().decode(emailBytes)
  if (!email.includes('@') || email !== normalize(email)) return null
  const expected = await hmac(secret, `unsubscribe:v1:${email}`)
  return timingSafeEqual(sig, expected) ? email : null
}
