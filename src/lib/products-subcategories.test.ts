import { describe, expect, it } from 'vitest'
import { inSubcategories } from './products'

describe('inSubcategories', () => {
  const FP = ['Figure', 'Plush']
  it('keeps plain subcategory matches', () => {
    expect(inSubcategories({ subcategory: 'Figure', name: 'Pikachu figure 01' }, FP)).toBe(true)
    expect(inSubcategories({ subcategory: 'Booster Box', name: 'Gem Vol 7 Booster Box' }, FP)).toBe(false)
  })
  it('counts figure and plush blind boxes as Figures & Plush', () => {
    expect(inSubcategories({ subcategory: 'Blind Box', name: 'Pokemon Pikachu Dream Painting 30th Celebration Figures Blind Box (Simplified Chinese)' }, FP)).toBe(true)
    expect(inSubcategories({ subcategory: 'Blind Box', name: 'Pokemon Funism Ditto Palm-Size Wonders Series Blind Box (Simplified Chinese)' }, FP)).toBe(true)
    expect(inSubcategories({ subcategory: 'Blind Box', name: 'Pokemon Nuzzle Cheeks Plush Toy Card Display Blind Box (Simplified Chinese)' }, FP)).toBe(true)
  })
  it('leaves card blind boxes out', () => {
    expect(inSubcategories({ subcategory: 'Blind Box', name: 'Pokemon First Partner 30th Celebration Volume 1 (Simplified Chinese)' }, FP)).toBe(false)
  })
})
