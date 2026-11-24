import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MAIN_SET_EQUIVALENTS } from './chinese-set-equivalents'
import { GEM_SETS } from './gem-sets-index'

// Recount each card origins post's card-by-card table and check the English
// equivalents post's numbers still match it.
function recount(key: string) {
  const src = readFileSync(`src/routes/blog/${key}-card-origins.tsx`, 'utf8')
  const codes = [...src.matchAll(/^\s*\['\d{3}',\s*'([A-Z0-9]+)'/gm)].map((m) => m[1])
  const block = src.slice(src.indexOf('Record<Src, string> = {'))
  const names = Object.fromEntries([...block.slice(0, block.indexOf('}')).matchAll(/^\s*([A-Z0-9]+): '([^']+)',/gm)].map((m) => [m[1], m[2]]))
  const counts = new Map<string, number>()
  for (const c of codes) counts.set(c, (counts.get(c) ?? 0) + 1)
  const noEnglish = counts.get('NEW') ?? 0
  counts.delete('NEW')
  const english = [...counts.entries()]
    .map(([code, cards]) => ({ set: names[code].replace(/^SV Black Star Promo$/, 'SV Black Star Promos'), cards }))
    .sort((a, b) => b.cards - a.cards)
  return { total: codes.length, english, noEnglish }
}

describe('Chinese set English equivalents', () => {
  for (const row of MAIN_SET_EQUIVALENTS) {
    it(`${row.key} matches its card origins post`, () => {
      const got = recount(row.key)
      expect(got.total).toBe(row.total)
      expect(got.noEnglish).toBe(row.noEnglish)
      // Same sets and counts; order within a tie does not matter.
      const key = (l: { set: string; cards: number }[]) => l.map((e) => `${e.set}:${e.cards}`).sort()
      expect(key(got.english)).toEqual(key(row.english))
    })
  }

  it('totals match the card counts in the set index', () => {
    for (const row of MAIN_SET_EQUIVALENTS) {
      const set = GEM_SETS.find((s) => s.slug === row.key || s.slug.startsWith(`${row.key}-csv`))!
      expect([row.key, row.total]).toEqual([row.key, set.cardCount])
    }
  })

  it('covers every main expansion in the set index', () => {
    const main = GEM_SETS.filter((s) => /^CSV[\d.]+C$/.test(s.code)).map((s) => s.slug.replace(/-csv[0-9-]+$/, ''))
    expect(main.filter((k) => !MAIN_SET_EQUIVALENTS.some((r) => r.key === k))).toEqual([])
  })
})
