import { describe, expect, it } from 'vitest'
import { splitZh } from './zh'

describe('splitZh', () => {
  it('leaves plain English alone', () => {
    expect(splitZh('Gem Pack Vol. 7')).toEqual([{ text: 'Gem Pack Vol. 7', zh: false }])
    expect(splitZh('')).toEqual([])
  })
  it('marks a Chinese name inside an English sentence', () => {
    expect(splitZh('The Chinese name, 宝石包, translates as "gem pack".')).toEqual([
      { text: 'The Chinese name, ', zh: false },
      { text: '宝石包', zh: true },
      { text: ', translates as "gem pack".', zh: false },
    ])
  })
  it('keeps digits and punctuation that belong to the phrase', () => {
    expect(splitZh('printed with 3粒/盒, three pieces per box').filter((p) => p.zh)).toEqual([{ text: '3粒/盒', zh: true }])
    expect(splitZh('Happy Ditto (百变“快”乐)').filter((p) => p.zh)).toEqual([{ text: '百变“快”乐', zh: true }])
    expect(splitZh('30th Celebration (30周年庆典)').filter((p) => p.zh)).toEqual([{ text: '30周年庆典', zh: true }])
  })
  it('finds several snippets and rebuilds the original text', () => {
    const text = 'Funism (玩乐主义), part of Palm-Size Wonders (小小奇遇).'
    const parts = splitZh(text)
    expect(parts.filter((p) => p.zh).map((p) => p.text)).toEqual(['玩乐主义', '小小奇遇'])
    expect(parts.map((p) => p.text).join('')).toBe(text)
  })
})
