import { describe, expect, it } from 'vitest'
import { formatMoney, rankProducts, type Product } from './products'

function product(overrides: Partial<Product> & { id: string }): Product {
  return {
    name: overrides.id,
    category: 'Chinese Pokémon Products',
    subcategory: 'Booster Box',
    price: 10,
    stock: 5,
    ...overrides,
  }
}

describe('formatMoney', () => {
  it('formats with a dollar sign and two decimals', () => {
    expect(formatMoney(9.5)).toBe('$9.50')
    expect(formatMoney(0)).toBe('$0.00')
    expect(formatMoney(19.999)).toBe('$20.00')
  })
})

describe('rankProducts', () => {
  it('puts ranked products first, in rank order', () => {
    const products = [
      product({ id: 'a', bestSellingRank: 2 }),
      product({ id: 'b', bestSellingRank: 1 }),
      product({ id: 'c' }),
    ]
    const result = rankProducts(products, 'bestSellingRank')
    expect(result.map((p) => p.id)).toEqual(['b', 'a', 'c'])
  })

  it('lists unranked products after ranked ones, newest first', () => {
    // products arrive in createdAt-ascending order, per the function's contract
    const products = [product({ id: 'oldest' }), product({ id: 'middle' }), product({ id: 'newest' })]
    const result = rankProducts(products, 'bestSellingRank')
    expect(result.map((p) => p.id)).toEqual(['newest', 'middle', 'oldest'])
  })

  it('excludes a product hidden from this specific section entirely', () => {
    const products = [
      product({ id: 'shown', bestSellingRank: 1 }),
      product({ id: 'hidden', bestSellingRank: 2, hideFromBestSelling: true }),
      product({ id: 'filler-hidden', hideFromBestSelling: true }),
      product({ id: 'filler-shown' }),
    ]
    const result = rankProducts(products, 'bestSellingRank')
    expect(result.map((p) => p.id)).toEqual(['shown', 'filler-shown'])
  })

  it('a product hidden from one section can still appear, ranked, in the other', () => {
    const products = [product({ id: 'p', bestSellingRank: 1, hideFromNewAndUpcoming: true })]
    expect(rankProducts(products, 'bestSellingRank').map((p) => p.id)).toEqual(['p'])
    expect(rankProducts(products, 'newAndUpcomingRank').map((p) => p.id)).toEqual([])
  })
})
