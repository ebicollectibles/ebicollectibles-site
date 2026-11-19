import { describe, expect, it } from 'vitest'
import { searchText, shopSearchSchema } from './shop-search'

const parse = (search: Record<string, unknown>) => shopSearchSchema.parse(search)

describe('shopSearchSchema', () => {
  it('adds nothing to a bare /shop (no preorder=false, so no redirect)', () => {
    expect(parse({})).toEqual({})
    expect('preorder' in parse({})).toBe(false)
    expect(JSON.parse(JSON.stringify(parse({ subcategory: 'Booster Box' })))).toEqual({ subcategory: 'Booster Box' })
  })

  it('keeps valid filters', () => {
    expect(parse({ category: 'Chinese Pokémon Products' }).category).toBe('Chinese Pokémon Products')
    expect(parse({ subcategory: 'Booster Box' }).subcategory).toBe('Booster Box')
    expect(parse({ subcategories: ['Figure', 'Plush'] }).subcategories).toEqual(['Figure', 'Plush'])
    expect(parse({ q: 'pikachu', variantGroup: 'g1' })).toMatchObject({ q: 'pikachu', variantGroup: 'g1' })
  })

  it('turns preorder on only for true / "true"', () => {
    expect(parse({ preorder: true }).preorder).toBe(true)
    expect(parse({ preorder: 'true' }).preorder).toBe(true)
    for (const off of [false, 'false', 'yes', 1, null, undefined, {}]) {
      expect(parse({ preorder: off }).preorder).toBeUndefined()
    }
  })

  it('degrades unknown or wrongly typed values to "filter off" instead of throwing', () => {
    expect(parse({ subcategory: 123 }).subcategory).toBeUndefined()
    expect(parse({ subcategory: 'Nope' }).subcategory).toBeUndefined()
    expect(parse({ category: true }).category).toBeUndefined()
    expect(parse({ subcategories: 123 }).subcategories).toBeUndefined()
    expect(parse({ subcategories: { a: 1 } }).subcategories).toBeUndefined()
    expect(parse({ q: { a: 1 }, variantGroup: ['x'] })).toEqual({})
  })

  it('accepts a single subcategories value and drops unknown names from a list', () => {
    expect(parse({ subcategories: 'Figure' }).subcategories).toEqual(['Figure'])
    expect(parse({ subcategories: ['Figure', 'Nope', 7] }).subcategories).toEqual(['Figure'])
    expect(parse({ subcategories: ['Nope'] }).subcategories).toBeUndefined()
    expect(parse({ subcategories: [] }).subcategories).toBeUndefined()
  })

  it('one bad field does not discard the good ones', () => {
    expect(parse({ subcategory: 'Booster Box', category: 5, preorder: 'true' })).toEqual({ subcategory: 'Booster Box', preorder: true })
  })

  it('reads numeric-looking free text as text', () => {
    expect(searchText(parse({ q: 151 }).q)).toBe('151')
    expect(searchText(parse({ q: '  gem ' }).q)).toBe('gem')
    expect(searchText(undefined)).toBe('')
  })
})
