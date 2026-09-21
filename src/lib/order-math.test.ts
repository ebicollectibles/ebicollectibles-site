import { describe, expect, it } from 'vitest'
import { computeOrderTotals, findUnorderableLine, hasDelayedShipment, hasMixedPreorderCart, isHiOrAk } from './order-math'

describe('computeOrderTotals', () => {
  it('computes subtotal, flat shipping, tax, and total', () => {
    const result = computeOrderTotals([{ unitPrice: 10, qty: 2 }, { unitPrice: 5, qty: 1 }], 0.1)
    expect(result.subtotal).toBe(25)
    expect(result.shippingCost).toBe(10)
    expect(result.tax).toBe(2.5)
    expect(result.total).toBe(37.5)
  })

  it('charges no shipping when the cart is somehow empty', () => {
    const result = computeOrderTotals([], 0.1)
    expect(result.subtotal).toBe(0)
    expect(result.shippingCost).toBe(0)
    expect(result.total).toBe(0)
  })

  it('rounds tax to the nearest cent', () => {
    const result = computeOrderTotals([{ unitPrice: 19.99, qty: 3 }], 0.092)
    // subtotal 59.97 * 0.092 = 5.51724 -> rounds to 5.52
    expect(result.subtotal).toBe(59.97)
    expect(result.tax).toBe(5.52)
  })

  it('charges zero tax outside of taxed states', () => {
    const result = computeOrderTotals([{ unitPrice: 40, qty: 1 }], 0)
    expect(result.tax).toBe(0)
    expect(result.total).toBe(50) // subtotal + flat shipping, no tax
  })

  it('uses the override shipping cost when given (e.g. a Shippo AK/HI quote)', () => {
    const result = computeOrderTotals([{ unitPrice: 40, qty: 1 }], 0, 27.5)
    expect(result.shippingCost).toBe(27.5)
    expect(result.total).toBe(67.5)
  })

  it('still charges no shipping for an empty cart even with an override', () => {
    const result = computeOrderTotals([], 0, 27.5)
    expect(result.shippingCost).toBe(0)
  })

  it('defaults amountDue to the full total when no credit is applied', () => {
    const result = computeOrderTotals([{ unitPrice: 40, qty: 1 }], 0)
    expect(result.creditApplied).toBe(0)
    expect(result.amountDue).toBe(result.total)
  })

  it('subtracts applied store credit from amountDue but not from total', () => {
    const result = computeOrderTotals([{ unitPrice: 40, qty: 1 }], 0, undefined, 10)
    expect(result.total).toBe(50)
    expect(result.creditApplied).toBe(10)
    expect(result.amountDue).toBe(40)
  })

  it('clamps amountDue to zero when credit covers or exceeds the total', () => {
    const result = computeOrderTotals([{ unitPrice: 40, qty: 1 }], 0, undefined, 999)
    expect(result.amountDue).toBe(0)
  })
})

describe('findUnorderableLine', () => {
  const productById = new Map([
    ['normal', { name: 'Normal Item', comingSoon: false, published: true }],
    ['soon', { name: 'Coming Soon Item', comingSoon: true, published: true }],
    ['hidden', { name: 'Hidden Item', comingSoon: false, published: false }],
  ])

  it('allows an ordinary published, available product', () => {
    expect(findUnorderableLine([{ productId: 'normal' }], productById)).toBeNull()
  })

  it('rejects a coming-soon product', () => {
    expect(findUnorderableLine([{ productId: 'soon' }], productById)).toMatch(/Coming Soon Item.*isn't available to order yet/)
  })

  it('rejects an unpublished product', () => {
    expect(findUnorderableLine([{ productId: 'hidden' }], productById)).toMatch(/Hidden Item.*no longer available/)
  })

  it('ignores a line whose product was not found (checked elsewhere)', () => {
    expect(findUnorderableLine([{ productId: 'missing' }], productById)).toBeNull()
  })

  it('reports the first unorderable line when several are unorderable', () => {
    expect(findUnorderableLine([{ productId: 'normal' }, { productId: 'soon' }, { productId: 'hidden' }], productById)).toMatch(
      /Coming Soon Item/,
    )
  })
})

describe('hasMixedPreorderCart', () => {
  it('allows an all-regular cart', () => {
    expect(hasMixedPreorderCart([{ preorder: false }, { preorder: false }])).toBe(false)
  })

  it('allows an all-preorder cart', () => {
    expect(hasMixedPreorderCart([{ preorder: true }, { preorder: true }])).toBe(false)
  })

  it('flags a cart mixing preorder and regular items', () => {
    expect(hasMixedPreorderCart([{ preorder: false }, { preorder: true }])).toBe(true)
  })

  it('allows a single-item cart of either kind', () => {
    expect(hasMixedPreorderCart([{ preorder: true }])).toBe(false)
    expect(hasMixedPreorderCart([{ preorder: false }])).toBe(false)
  })

  it('allows an empty cart', () => {
    expect(hasMixedPreorderCart([])).toBe(false)
  })
})

describe('hasDelayedShipment', () => {
  it('is false when nothing in the cart ships with delay', () => {
    expect(hasDelayedShipment([{ shipsWithDelay: false }, { shipsWithDelay: false }])).toBe(false)
  })

  it('is true when at least one line ships with delay', () => {
    expect(hasDelayedShipment([{ shipsWithDelay: false }, { shipsWithDelay: true }])).toBe(true)
  })

  it('is true for a single delayed item, unlike the preorder mixed-cart check', () => {
    expect(hasDelayedShipment([{ shipsWithDelay: true }])).toBe(true)
  })

  it('allows an empty cart', () => {
    expect(hasDelayedShipment([])).toBe(false)
  })
})

describe('isHiOrAk', () => {
  it('recognizes Hawaii and Alaska', () => {
    expect(isHiOrAk('HI')).toBe(true)
    expect(isHiOrAk('AK')).toBe(true)
  })

  it('is case-insensitive and trims whitespace', () => {
    expect(isHiOrAk('hi')).toBe(true)
    expect(isHiOrAk(' ak ')).toBe(true)
  })

  it('rejects every other state', () => {
    expect(isHiOrAk('WA')).toBe(false)
    expect(isHiOrAk('CA')).toBe(false)
  })

  it('rejects empty/missing input', () => {
    expect(isHiOrAk('')).toBe(false)
    expect(isHiOrAk(null)).toBe(false)
    expect(isHiOrAk(undefined)).toBe(false)
  })
})
