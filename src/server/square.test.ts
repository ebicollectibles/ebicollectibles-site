import { describe, expect, it } from 'vitest'
import { freshIdempotencyKey } from './square'

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
