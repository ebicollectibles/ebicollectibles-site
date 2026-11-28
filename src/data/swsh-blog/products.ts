import type { SwshProduct } from './types'

// Pokémon China gift boxes that hold packs from many Sword & Shield sets.
// Contents and dates: Pokémon China's product catalogue.

/** 一周年纪念 专属礼盒: one 25-card pack each of Dynamax Clash Thunder and Flame and Vivid Portrayals Obsidian and Indigo. */
export const ONE_YEAR_BOX = (which: string): SwshProduct => ({
  name: 'One Year Anniversary Gift Box',
  zh: '一周年纪念 专属礼盒',
  released: 'Pre-orders from October 28, 2023',
  contents: `Alola and Galar partner promo cards and accessories, with one ${which} 25-card pack among ten packs`,
})

/** 伙伴们的欢聚 专属礼盒: packs from every Simplified Chinese Sword & Shield set. */
export const PARTNERS_GATHERING_BOX = (packs: string): SwshProduct => ({
  name: "Partners' Gathering Gift Box",
  zh: '伙伴们的欢聚 专属礼盒',
  released: 'November 15, 2024',
  contents: `Sinnoh and Hisui partner promo cards and accessories, with ${packs} among packs from every Sword & Shield set`,
})

/** 一周年纪念 宝可梦收藏卡册礼盒 and 宝可梦艺术卡套礼盒: one Obsidian and one Indigo 5-card pack and one Brilliant Counterattack pack each. */
export const ONE_YEAR_BINDER_AND_SLEEVES: SwshProduct[] = [
  {
    name: 'One Year Anniversary Collection Binder Gift Box',
    zh: '一周年纪念 宝可梦收藏卡册礼盒',
    released: 'October 28, 2023',
    contents: 'A random Zacian V, Zamazenta V, Eternatus V or Eternatus VMAX holo and a binder, with one Obsidian and one Indigo 5-card pack and one Brilliant Counterattack pack',
  },
  {
    name: 'One Year Anniversary Art Sleeves Gift Box',
    zh: '一周年纪念 宝可梦艺术卡套礼盒',
    released: 'October 28, 2023',
    contents: 'A random Zacian V, Zamazenta V, Eternatus V or Eternatus VMAX holo and 64 sleeves, with one Obsidian and one Indigo 5-card pack and one Brilliant Counterattack pack',
  },
]

/** 收藏周边礼盒 百变宝盒: one random 25-card pack (Primordial Arts, Polychromatic Gathering, Gallant Galaxy or Marine Shadow) and one random enhanced pack (Scorching Skies, Flame Dance of the End, Overshadowed Radiance or Victory Lodestar). */
export const VARIETY_TREASURE_BOX = (which: string): SwshProduct => ({
  name: 'Variety Treasure Box',
  zh: '收藏周边礼盒 百变宝盒',
  released: 'November 15, 2024',
  contents: `A random holo, a damage counter box and a random Energy or Trainer holo, with one random 25-card pack and one random enhanced pack; ${which} is one of the possible packs`,
})
