import type { BuiltGemSetData, Card, CardGroup, GemSetData } from './types'

// Pure, deterministic — safe to call once at module scope in each set's
// route file (it ships in the page the same way on the server and the
// client, same as the raw JSON import it derives from).
export function buildGemSetData(data: GemSetData): BuiltGemSetData {
  const cards: Card[] = data.cards.map((c) => {
    const id = c.number.split('/')[0]
    const i = c.name.indexOf("'s ")
    return {
      id,
      pokemonIndex: c.pokemonIndex,
      name: c.name,
      owner: i > 0 ? c.name.slice(0, i + 2) : null,
      mon: i > 0 ? c.name.slice(i + 3) : c.name,
      rarity: c.rarity,
      version: c.version,
      suffix: c.number.split('/')[1] ?? '',
      image: c.image,
      exclusive: data.exclusiveCardNumbers.includes(c.number),
    }
  })
  const cardById = new Map(cards.map((c) => [c.id, c]))

  const catalogIndexes = new Set(data.catalogGroups ?? [])
  const groups: CardGroup[] = []
  for (const c of cards) {
    if (data.groupByName) {
      // A standard numbered set (Black Bolt, White Flare): no ladder, no
      // adjacency — a Pokémon's rarer treatments (Art Rare, Super Rare,
      // ...) sit at unrelated numbers far from its main-set card. Match
      // purely by name across the whole set; the group's label is its
      // first (lowest-numbered) card's own id.
      const existing = groups.find((g) => g.cards[0].name === c.name)
      if (existing) existing.cards.push(c)
      else groups.push({ groupId: c.id, cards: [c] })
      continue
    }
    const groupId = c.id.slice(0, 2)
    if (catalogIndexes.has(c.pokemonIndex)) {
      // A catalog block (Trainers, Energy): group by matching name
      // anywhere in the block, not by simple adjacency — two printings of
      // the same card needn't be next to each other in the list.
      const existing = groups.find((g) => g.groupId === groupId && g.cards[0].name === c.name)
      if (existing) existing.cards.push(c)
      else groups.push({ groupId, cards: [c] })
    } else {
      // Normal block: one creature's rarity ladder — everything sharing
      // this prefix is the same thing regardless of name (an "ex" card's
      // name differs from its own lower versions, e.g. "Clefable" ->
      // "Clefable ex", but it's still that Pokémon's top version).
      const last = groups[groups.length - 1]
      if (last && last.groupId === groupId) last.cards.push(c)
      else groups.push({ groupId, cards: [c] })
    }
  }

  const firstGroupCards = groups[0]?.cards ?? []
  const versionsPerMon = firstGroupCards.length || 7
  const versionSuffix = data.cards[0]?.number.split('/')[1] ?? String(versionsPerMon).padStart(2, '0')
  const monCount = groups.length
  const rarityVersionLabels = computeRarityVersionLabels(firstGroupCards, data.rarityOrder)

  return { cards, cardById, groups, versionSuffix, versionsPerMon, monCount, rarityVersionLabels }
}

// Derives e.g. { Common: '01–02', Uncommon: '03–04', Rare: '05', ... } from
// one representative group's own version numbers, so it reflects whatever
// rarity ladder a set actually uses instead of assuming Gem Vol 7's shape.
// Falls back to a comma list when a rarity's versions aren't contiguous
// (an "ex" card can repeat an earlier rarity at a later version number,
// e.g. Rare at both 05 and 07 with Double Rare at 06 in between) — a
// "05–07" range there would wrongly claim 06 is Rare too.
function computeRarityVersionLabels(sample: Card[], rarityOrder: string[]): Record<string, string> {
  const byRarity = new Map<string, number[]>()
  for (const c of [...sample].sort((a, b) => a.version - b.version)) {
    const list = byRarity.get(c.rarity) ?? []
    list.push(c.version)
    byRarity.set(c.rarity, list)
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  const labels: Record<string, string> = {}
  for (const rarity of rarityOrder) {
    const versions = byRarity.get(rarity)
    if (!versions || versions.length === 0) continue
    const contiguous = versions.every((v, i) => i === 0 || v === versions[i - 1] + 1)
    labels[rarity] = contiguous
      ? versions.length === 1
        ? pad(versions[0])
        : `${pad(versions[0])}–${pad(versions[versions.length - 1])}`
      : versions.map(pad).join(', ')
  }
  return labels
}
