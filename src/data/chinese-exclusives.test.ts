import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CHINESE_EXCLUSIVES } from './chinese-exclusives'
import { GEM_SETS } from './gem-sets-index'

// The Chinese Exclusives post reads its card list from chinese-exclusives.ts,
// a copy of each set's exclusiveCardNumbers. This keeps the copy honest.
const DATA_FILE: Record<string, string> = {
  '30th-celebration': '30th-celebration',
  'eternal-birth-csv1': 'csv1',
  'miracle-journey-csv2': 'csv2',
  'fearless-terastal-csv3': 'csv3',
  'reward-round-csv4': 'csv4',
  'black-crystal-blaze-csv5': 'csv5',
  'true-mystery-csv6': 'csv6',
  'blade-awakening-csv7': 'csv7',
  'brilliant-fantasy-csv8': 'csv8',
  'stellar-crystal-csv9': 'csv9',
  'terastal-gathering-csv9-5': 'csv9-5',
  'chasing-glory-csv10': 'csv10',
  'black-bolt-csv10-5': 'black-bolt',
  'white-flare-csv10-6': 'white-flare',
  'gem-vol-1': 'gem-vol-1',
  'gem-vol-2': 'gem-vol-2',
  'gem-vol-3': 'gem-vol-3',
  'gem-vol-4': 'gem-vol-4',
  'gem-vol-5': 'gem-vol-5',
  'gem-vol-6': 'gem-vol-6',
  'gem-vol-7': 'gem-vol-7',
  'collect-151-journey': 'collect-151',
  'collect-151-hope': 'collect-151',
  'collect-151-surprise': 'collect-151',
  'collect-151-gathering': 'collect-151',
}

type Card = { number: string; name: string; rarity: string; image: string }
type SetFile = { exclusiveCardNumbers: string[]; cards: Card[] }
const readSet = (file: string) => JSON.parse(readFileSync(`src/data/${file}.json`, 'utf8')) as SetFile

// The four Collect 151 releases share one data file; each set page narrows
// exclusiveCardNumbers to its own release.
function exclusiveNumbers(slug: string): string[] {
  if (slug.startsWith('collect-151-')) {
    const page = readFileSync(`src/routes/sets/chinese/${slug}.tsx`, 'utf8')
    const m = page.match(/exclusiveCardNumbers:\s*\[([^\]]*)\]/)
    if (!m) throw new Error(`no exclusiveCardNumbers in ${slug}.tsx`)
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
  }
  return readSet(DATA_FILE[slug]).exclusiveCardNumbers
}

describe('Chinese Exclusives list', () => {
  it('covers every set in the set index', () => {
    expect(GEM_SETS.map((s) => s.slug).filter((s) => !(s in DATA_FILE))).toEqual([])
  })

  it('matches each set’s data, card for card', () => {
    for (const set of GEM_SETS) {
      const data = readSet(DATA_FILE[set.slug])
      const expected = exclusiveNumbers(set.slug).map((n) => {
        const c = data.cards.find((x) => x.number === n)!
        return { set: set.slug, number: n, name: c.name, rarity: c.rarity, image: c.image }
      })
      expect(CHINESE_EXCLUSIVES.filter((c) => c.set === set.slug)).toEqual(expected)
    }
  })

  it('agrees with exclusiveCount in the set index', () => {
    for (const set of GEM_SETS) {
      expect([set.slug, CHINESE_EXCLUSIVES.filter((c) => c.set === set.slug).length]).toEqual([set.slug, set.exclusiveCount])
    }
  })
})
