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
