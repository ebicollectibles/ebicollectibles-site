import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SET_RARITY_COUNTS } from './chinese-rarities'
import { RARITY_EXAMPLES } from './chinese-rarity-examples'

type SetFile = { code: string; cardCount: number; rarityOrder: string[]; cards: { number: string; name: string; rarity: string | null; image: string }[] }
const load = (file: string) => JSON.parse(readFileSync(`src/data/${file}.json`, 'utf8')) as SetFile

// The rarities post reads its numbers from chinese-rarities.ts. Recount them
// from each set's card list so a data change cannot leave the post behind.
describe('chinese rarity counts', () => {
  it('match the set data files', () => {
    for (const s of SET_RARITY_COUNTS) {
      const d = load(s.file)
      const tally = new Map<string | null, number>()
      for (const c of d.cards) tally.set(c.rarity, (tally.get(c.rarity) ?? 0) + 1)
      const expected: [string | null, number][] = d.rarityOrder.map((r) => [r, tally.get(r) ?? 0])
      if (tally.has(null)) expected.push([null, tally.get(null)!])
      expect({ code: s.code, cardCount: s.cardCount, counts: s.counts }).toEqual({ code: d.code, cardCount: d.cardCount, counts: expected })
    }
  })
})

describe('rarity example cards', () => {
  it('exist in their set with the rarity and image shown', () => {
    const wrong: string[] = []
    for (const e of RARITY_EXAMPLES) {
      const card = load(e.file).cards.find((c) => c.number === e.number)
      if (!card || card.name !== e.name || card.rarity !== e.rarity || card.image !== e.image) wrong.push(`${e.file} ${e.number}`)
    }
    expect(wrong).toEqual([])
  })
})
