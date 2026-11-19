import { describe, expect, it } from 'vitest'
import { cardLinkQuery, cardSearchValidator, cardSearchValue, openCardIdFromSearch, parseCardParam } from './card-search'

const CSV = /^\d{3}$/
const GEM = /^\d{4}$/
const THIRTIETH = /^P?\d{3}$/

// What TanStack Router's default search parser hands validateSearch for a
// raw query value: JSON.parse when that works, the plain string otherwise.
const routerParse = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

describe('parseCardParam', () => {
  it('accepts the number the router makes of a bare all-digit id', () => {
    expect(parseCardParam(144, CSV)).toBe('144')
    expect(parseCardParam(1501, GEM)).toBe('1501')
  })

  it('accepts string ids, including leading zeros and a letter prefix', () => {
    expect(parseCardParam('144', CSV)).toBe('144')
    expect(parseCardParam('099', CSV)).toBe('099')
    expect(parseCardParam('0706', GEM)).toBe('0706')
    expect(parseCardParam('P001', THIRTIETH)).toBe('P001')
  })

  it('returns undefined instead of throwing for anything invalid', () => {
    for (const bad of ['abc', '1', 1, 1501, '0144', -144, 14.4, 1e21, NaN, true, null, undefined, {}, ['144'], '']) {
      expect(parseCardParam(bad, CSV)).toBeUndefined()
    }
    expect(parseCardParam(144, GEM)).toBeUndefined()
  })
})

describe('cardSearchValidator', () => {
  const validate = cardSearchValidator(CSV)

  it('keeps a valid value in the form it arrived in (no URL rewrite)', () => {
    expect(validate({ card: 144 })).toEqual({ card: 144 })
    expect(validate({ card: '099' })).toEqual({ card: '099' })
    expect(validate({ card: '144' })).toEqual({ card: '144' })
  })

  it('drops an invalid or missing card and ignores other params', () => {
    expect(validate({ card: 'abc' })).toEqual({})
    expect(validate({ card: 1 })).toEqual({})
    expect(validate({})).toEqual({})
    expect(validate({ card: 144, other: 'x' })).toEqual({ card: 144 })
  })

  it('always yields a string id for the page', () => {
    expect(openCardIdFromSearch(validate({ card: 144 }))).toBe('144')
    expect(openCardIdFromSearch(validate({ card: '099' }))).toBe('099')
    expect(openCardIdFromSearch(validate({ card: 'abc' }))).toBeNull()
  })
})

describe('links round-trip', () => {
  it.each([
    ['144', CSV],
    ['099', CSV],
    ['001', CSV],
    ['1501', GEM],
    ['0706', GEM],
    ['P001', THIRTIETH],
    ['206', THIRTIETH],
  ])('copy link for %s opens the same card', (id, pattern) => {
    const raw = decodeURIComponent(cardLinkQuery(id).slice('?card='.length))
    expect(openCardIdFromSearch(cardSearchValidator(pattern)({ card: routerParse(raw) }))).toBe(id)
  })

  it.each(['144', '099', '1501', '0706', 'P001', '000', '0'])('navigating to %s reads back as the same id', (id) => {
    const value = cardSearchValue(id)
    expect(String(value)).toBe(id)
    // A number only when the router would otherwise have to quote it.
    expect(typeof value).toBe(typeof routerParse(id) === 'number' ? 'number' : 'string')
  })

  it('passes undefined through (closing the dialog)', () => {
    expect(cardSearchValue(undefined)).toBeUndefined()
  })
})
