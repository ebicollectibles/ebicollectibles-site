import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chargeSquarePayment, freshIdempotencyKey } from './square'

describe('freshIdempotencyKey', () => {
  it('never exceeds Square\'s 45-character idempotency_key limit', () => {
    const cases: [string, string | number][] = [
      ['pay', 16],
      ['pay', 999999],
      ['ord', 16],
      ['ord', 999999],
      ['shp', 'L3XLLZXNZBQ2F4RNBHXZ7Z5P'],
      ['shp', 'L3XLLZXNZBQ2F4RNBHXZ7Z5PLONGERVARIANT123456'],
      ['sal', '16-RVCPDD2WIBZ5KMJCWX4SXUVE'],
      ['sal', '999999-RVCPDD2WIBZ5KMJCWX4SXUVEEXTRA'],
    ]
    for (const [prefix, id] of cases) {
      expect(freshIdempotencyKey(prefix, id).length).toBeLessThanOrEqual(45)
    }
  })

  // This is the exact bug that broke checkout twice in a row: first a bare
  // `ebi-order-${orderNo}` collided across unrelated retries (orderNo is
  // allocated inside a transaction a failed charge rolls back — see
  // placeOrder in orders.ts), then the fix for that collided with Square's
  // length limit instead. A key must be both unique per call AND short
  // enough, every time, for checkout to actually work.
  it('never produces the same key twice for the same orderNo, even when a rolled-back transaction hands out that same orderNo again', () => {
    const stuckOrderNo = 16
    const keys = new Set(Array.from({ length: 50 }, () => freshIdempotencyKey('pay', stuckOrderNo)))
    expect(keys.size).toBe(50)
  })

  it('stays under the limit no matter how long the prefix+id portion runs, by truncating the random suffix rather than the id', () => {
    const key = freshIdempotencyKey('sal', '999999-RVCPDD2WIBZ5KMJCWX4SXUVEEXTRA')
    expect(key.length).toBeLessThanOrEqual(45)
    expect(key.startsWith('sal999999-RVCPDD2WIBZ5KMJCWX4SXUVEEXTRA-')).toBe(true)
  })
})

// Square's own idempotency docs recommend retrying a transient failure
// (network error, 429, 5xx) with the SAME idempotency key — the opposite
// mistake from the one that broke checkout (a key that's reused when it
// shouldn't be). These cover the other direction: a genuine decline or
// validation error (4xx other than 429) must never be retried, since it
// would just fail again identically and only slow down a real decline.
describe('chargeSquarePayment retry behavior', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env.SQUARE_ACCESS_TOKEN = 'test-token'
    process.env.SQUARE_LOCATION_ID = 'test-location'
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.SQUARE_ACCESS_TOKEN
    delete process.env.SQUARE_LOCATION_ID
    vi.restoreAllMocks()
  })

  const chargeOpts = { sourceId: 'cnon:test', amount: 10, orderNo: 1 }

  it('succeeds immediately with no retry when the first attempt works', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ payment: { id: 'pay_1' } }) })
    global.fetch = fetchMock as any
    const result = await chargeSquarePayment(chargeOpts)
    expect(result.status).toBe('paid')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries a 429 and succeeds on the second attempt, reusing the same idempotency key', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({ errors: [{ detail: 'Rate limited' }] }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ payment: { id: 'pay_2' } }) })
    global.fetch = fetchMock as any
    const result = await chargeSquarePayment(chargeOpts)
    expect(result.status).toBe('paid')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const key1 = JSON.parse((fetchMock.mock.calls[0] as any)[1].body).idempotency_key
    const key2 = JSON.parse((fetchMock.mock.calls[1] as any)[1].body).idempotency_key
    expect(key1).toBe(key2)
  })

  it('retries a 500 up to 3 total attempts, then fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({ errors: [{ detail: 'Internal error' }] }) })
    global.fetch = fetchMock as any
    const result = await chargeSquarePayment(chargeOpts)
    expect(result.status).toBe('failed')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('never retries a genuine decline (4xx other than 429)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 402, json: async () => ({ errors: [{ detail: 'Card declined' }] }) })
    global.fetch = fetchMock as any
    const result = await chargeSquarePayment(chargeOpts)
    expect(result.status).toBe('failed')
    expect(result.error).toBe('Card declined')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries a network-level throw, then succeeds', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('network blip')).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ payment: { id: 'pay_3' } }) })
    global.fetch = fetchMock as any
    const result = await chargeSquarePayment(chargeOpts)
    expect(result.status).toBe('paid')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
