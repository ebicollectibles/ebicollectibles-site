import { describe, expect, it } from 'vitest'
import { computeAffiliateCommission } from './affiliates'

describe('computeAffiliateCommission', () => {
  it('commissions the whole order at the default rate when nothing is scoped', () => {
    const lines = [{ productId: 'a', unitPrice: 10, qty: 2 }, { productId: 'b', unitPrice: 5, qty: 1 }]
    expect(computeAffiliateCommission(lines, 10, false, [])).toBe(2.5) // 25 * 10%
  })

  it('gives one product its own rate without excluding anything else when not restricted', () => {
    const lines = [{ productId: 'a', unitPrice: 10, qty: 1 }, { productId: 'b', unitPrice: 10, qty: 1 }]
    // a overridden to 50%, b stays at the 2% default
    const commission = computeAffiliateCommission(lines, 2, false, [{ productId: 'a', commissionRate: 50 }])
    expect(commission).toBe(5.2) // 10*0.5 + 10*0.02
  })

  it('a 0% override on one item earns nothing for that item but the rest still earns the default', () => {
    const lines = [{ productId: 'a', unitPrice: 10, qty: 1 }, { productId: 'b', unitPrice: 10, qty: 1 }]
    const commission = computeAffiliateCommission(lines, 2, false, [{ productId: 'a', commissionRate: 0 }])
    expect(commission).toBe(0.2) // a: 0, b: 10*0.02
  })

  it('restricted affiliates earn nothing on products outside the list', () => {
    const lines = [{ productId: 'a', unitPrice: 10, qty: 1 }, { productId: 'b', unitPrice: 10, qty: 1 }]
    const commission = computeAffiliateCommission(lines, 10, true, [{ productId: 'a', commissionRate: null }])
    expect(commission).toBe(1) // only a, at the inherited 10% default; b earns nothing
  })

  it('a restricted product with no override still inherits the default rate', () => {
    const lines = [{ productId: 'a', unitPrice: 100, qty: 1 }]
    const commission = computeAffiliateCommission(lines, 15, true, [{ productId: 'a', commissionRate: null }])
    expect(commission).toBe(15)
  })
})
