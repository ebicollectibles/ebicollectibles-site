import { describe, expect, it } from 'vitest'
import { decodeTrafficSource, encodeTrafficSource, trafficSourceFromSearch, trafficSourceKey } from './traffic-source'

describe('traffic source', () => {
  it('reads UTM tags from a tracked link', () => {
    expect(trafficSourceFromSearch('?utm_source=reddit&utm_medium=social&utm_campaign=pikachu-gift-box')).toEqual({
      source: 'reddit',
      medium: 'social',
      campaign: 'pikachu-gift-box',
    })
  })

  it('needs a utm_source', () => {
    expect(trafficSourceFromSearch('?utm_medium=social')).toBeNull()
    expect(trafficSourceFromSearch('')).toBeNull()
  })

  it('drops values that are not plain tags', () => {
    expect(trafficSourceFromSearch('?utm_source=<script>')).toBeNull()
    expect(trafficSourceFromSearch('?utm_source=Reddit&utm_campaign=a b')).toEqual({ source: 'reddit', medium: null, campaign: null })
  })

  it('round-trips through the cookie value', () => {
    const t = { source: 'x', medium: null, campaign: 'day-night-gift-box' }
    expect(decodeTrafficSource(encodeURIComponent(encodeTrafficSource(t)))).toEqual(t)
  })

  it('treats a broken cookie as no source', () => {
    expect(decodeTrafficSource(undefined)).toBeNull()
    expect(decodeTrafficSource('%E0%A4%A')).toBeNull()
    expect(decodeTrafficSource('|social|x')).toBeNull()
  })

  it('matches keys regardless of case and missing parts', () => {
    expect(trafficSourceKey('Reddit', 'social', null)).toBe(trafficSourceKey('reddit', 'social', ''))
  })
})
