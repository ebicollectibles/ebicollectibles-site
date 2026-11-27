import { describe, expect, it } from 'vitest'
import { computeFreeGifts } from './promotions'

const GEM7 = 'pokemon-chinese-gem-volume-7-booster-box'
const BINDER = 'pokemon-chinese-gem-volume-7-psyduck-collector-binder'

describe('computeFreeGifts', () => {
  it('gives nothing under 5 boxes', () => {
    expect(computeFreeGifts([{ productId: GEM7, qty: 4 }], { [BINDER]: 18 })).toEqual([])
  })
  it('gives one binder per 5 boxes', () => {
    expect(computeFreeGifts([{ productId: GEM7, qty: 5 }], { [BINDER]: 18 })[0].qty).toBe(1)
    expect(computeFreeGifts([{ productId: GEM7, qty: 14 }], { [BINDER]: 18 })[0].qty).toBe(2)
  })
  it('stops when binders run out, counting binders bought at full price', () => {
    expect(computeFreeGifts([{ productId: GEM7, qty: 15 }], { [BINDER]: 2 })[0].qty).toBe(2)
    expect(computeFreeGifts([{ productId: GEM7, qty: 5 }, { productId: BINDER, qty: 2 }], { [BINDER]: 2 })).toEqual([])
  })
})
