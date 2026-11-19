import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { cardAlt, cardNumber, rarityName } from './alt'
import { GEM_SETS } from '~/data/gem-sets-index'

describe('cardAlt', () => {
  it('gives name, printed number and rarity', () => {
    expect(cardAlt({ name: "Misty's Psyduck", id: '0307', suffix: '07', rarity: 'Triple Rare' })).toBe("Misty's Psyduck 0307/07, Triple Rare")
  })
  it('drops the rarity code in brackets, which only repeats the name aloud', () => {
    expect(cardAlt({ name: 'Miraidon ex', id: '154', suffix: '127', rarity: 'Special Art Rare (SAR)' })).toBe('Miraidon ex 154/127, Special Art Rare')
    expect(rarityName('Black White Rare (BWR)')).toBe('Black White Rare')
    expect(rarityName('Pikachu Rare')).toBe('Pikachu Rare')
  })
  it('adds exclusivity and the set name when asked', () => {
    expect(cardAlt({ name: 'Arcanine ex', id: '155', suffix: '130', rarity: 'Special Art Rare (SAR)', exclusive: true }, { setName: 'Fearless Terastal' })).toBe(
      'Arcanine ex 155/130, Special Art Rare, Chinese Exclusive, Fearless Terastal',
    )
  })
  it('copes with a missing rarity or suffix', () => {
    expect(cardAlt({ name: 'Pikachu', id: 'P001', suffix: '30th-P', rarity: null })).toBe('Pikachu P001/30th-P')
    expect(cardNumber({ id: '001', suffix: '' })).toBe('001')
  })
  it('never says "image of" or "picture of"', () => {
    expect(cardAlt({ name: 'Eevee', id: '0115', suffix: '15', rarity: 'Triple Rare' })).not.toMatch(/image of|picture of|photo of/i)
  })
})

// The /sets and /sets/chinese cards and the timeline post show one card per
// set. Its alt must carry that card's printed number, read from the set data.
describe('set index hero alts', () => {
  const cards = readdirSync('src/data')
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => {
      const j = JSON.parse(readFileSync(`src/data/${f}`, 'utf8')) as { cards?: Array<{ name: string; number: string; image: string | null }> }
      return j.cards ?? []
    })
  it('name the card and its printed number', () => {
    const wrong = GEM_SETS.filter((s) => {
      const c = cards.find((x) => x.image === s.heroImage)
      return !c || !s.heroAlt.startsWith(`${c.name} ${c.number}`)
    }).map((s) => `${s.slug}: ${s.heroAlt}`)
    expect(wrong).toEqual([])
  })
})
