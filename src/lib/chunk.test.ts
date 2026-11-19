import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('splits into groups and keeps order', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunk([1, 2, 3, 4, 5], 2).flat()).toEqual([1, 2, 3, 4, 5])
  })
  it('handles empty lists and odd sizes', () => {
    expect(chunk([], 20)).toEqual([])
    expect(chunk([1, 2], 20)).toEqual([[1, 2]])
    expect(chunk([1, 2, 3], 0)).toEqual([[1], [2], [3]])
  })
})
