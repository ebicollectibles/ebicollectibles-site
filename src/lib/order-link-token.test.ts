import { describe, expect, it } from 'vitest'
import { makeOrderLinkToken, verifyOrderLinkToken } from './order-link-token'
import { makeUnsubscribeToken } from './unsubscribe-token'

const SECRET = 'test-secret'
const A = '6f1c2a9e-3b4d-4e5f-8a7b-1c2d3e4f5a6b'
const B = '6f1c2a9e-3b4d-4e5f-8a7b-1c2d3e4f5a6c'

describe('order link tokens', () => {
  it('opens the order it was made for', async () => {
    const t = await makeOrderLinkToken(A, SECRET)
    expect(t).toMatch(/^[A-Za-z0-9_-]{22}$/)
    expect(await verifyOrderLinkToken(A, t, SECRET)).toBe(true)
    expect(await verifyOrderLinkToken(A.toUpperCase(), t, SECRET)).toBe(true)
  })
  it("doesn't open a different order", async () => {
    expect(await verifyOrderLinkToken(B, await makeOrderLinkToken(A, SECRET), SECRET)).toBe(false)
  })
  it('rejects another secret, edits and junk', async () => {
    const t = await makeOrderLinkToken(A, SECRET)
    expect(await verifyOrderLinkToken(A, t, 'other-secret')).toBe(false)
    expect(await verifyOrderLinkToken(A, t.slice(0, -1) + (t.endsWith('A') ? 'B' : 'A'), SECRET)).toBe(false)
    for (const bad of [null, undefined, '', 'x', '!!!!', t + t, 'a'.repeat(100)]) expect(await verifyOrderLinkToken(A, bad, SECRET)).toBe(false)
  })
  it("an unsubscribe token's signature can't be reused as an order link", async () => {
    const sig = (await makeUnsubscribeToken(A, SECRET)).split('.')[1]
    expect(await verifyOrderLinkToken(A, sig, SECRET)).toBe(false)
  })
})
