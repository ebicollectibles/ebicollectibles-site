import type { BuiltGemSetData, Card, CardGroup, GemSetData } from './types'

// Pure, deterministic — safe to call once at module scope in each set's
// route file (it ships in the page the same way on the server and the
// client, same as the raw JSON import it derives from).
export function buildGemSetData(data: GemSetData): BuiltGemSetData {
  const cards: Card[] = data.cards.map((c) => {
    const id = c.number.slice(0, 4)
    const i = c.name.indexOf("'s ")
    return {
      id,
      name: c.name,
      owner: i > 0 ? c.name.slice(0, i + 2) : null,
      mon: i > 0 ? c.name.slice(i + 3) : c.name,
      rarity: c.rarity,
      version: c.version,
      image: c.image,
      exclusive: data.exclusiveCardNumbers.includes(c.number),
    }
  })
  const cardById = new Map(cards.map((c) => [c.id, c]))

  const groups: CardGroup[] = []
  for (const c of cards) {
    const groupId = c.id.slice(0, 2)
    const last = groups[groups.length - 1]
    if (last && last.groupId === groupId) last.cards.push(c)
    else groups.push({ groupId, cards: [c] })
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
    labels[rarity] = versions.length === 1 ? pad(versions[0]) : `${pad(versions[0])}–${pad(versions[versions.length - 1])}`
  }
  return labels
}
