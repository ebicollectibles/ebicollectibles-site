import { describe, expect, it } from 'vitest'
import { isHiOrAk } from './shippo'

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
