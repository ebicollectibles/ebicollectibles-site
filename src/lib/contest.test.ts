import { describe, expect, it } from 'vitest'
import { contestLive, freePacksFor, toNextPack } from './contest'

describe('contest', () => {
  it('gives a pack on every order and one more per $100', () => {
    expect(freePacksFor(0)).toBe(0)
    expect(freePacksFor(37.99)).toBe(1)
    expect(freePacksFor(100)).toBe(2)
    expect(freePacksFor(379.9)).toBe(4)
    expect(toNextPack(379.9)).toBe(20.1)
  })
  it('ends after Monday 11/30', () => {
    expect(contestLive(Date.parse('2026-11-30T23:00:00-08:00'))).toBe(true)
    expect(contestLive(Date.parse('2026-12-01T00:00:01-08:00'))).toBe(false)
  })
})
