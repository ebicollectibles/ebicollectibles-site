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

/**
 * Pokémon China products with Polychromatic Gathering packs (both halves unless noted).
 * Product names in English follow Bulbapedia where it has a page for them.
 */
export const POLYCHROMATIC_PRODUCTS = (half: 'Friends' | 'Origin'): SwshProduct[] => [
  {
    name: 'Pokémon Card Display Set Gift Box',
    zh: '宝可梦卡牌展示套礼盒',
    released: 'March 1, 2024',
    contents: 'A display set with one random Friends or Origin 25-card pack',
  },
  {
    name: 'Dragon Resurgence Advanced Gift Boxes (two designs)',
    zh: '龙之再临进阶礼盒 辉光 / 凛烈',
    released: 'March 1, 2024',
    contents: 'Dragon Resurgence theme packs and accessories, with one Friends and one Origin 25-card pack',
  },
  {
    name: 'Dragon Resurgence Art Sleeves Gift Boxes (six designs)',
    zh: '龙之再临宝可梦艺术卡套礼盒',
    released: 'March 1 to May 17, 2024',
    contents: 'A Dragon Resurgence theme pack and sleeves, with one Friends and one Origin 5-card pack',
  },
  {
    name: 'Radiant Energy Art Sleeves Gift Boxes (four designs)',
    zh: '辉耀能量 宝可梦艺术卡套礼盒',
    released: 'March 29, 2024',
    contents: 'Radiant Energy theme packs and sleeves, with 30 random Polychromatic Gathering 5-card packs',
  },
  {
    name: 'Eevee Advanced Gift Boxes (Vaporeon, Jolteon and Flareon)',
    zh: '伊布进阶礼盒',
    released: 'April 26, 2024',
    contents: 'Eevee promo cards and accessories, with three Friends and three Origin 25-card packs',
  },
  half === 'Friends'
    ? { name: 'Pokémon Card Display Set: Umbreon', zh: '宝可梦卡牌展示组合 月亮伊布', released: 'April 26, 2024', contents: 'An Umbreon display frame and one Friends 25-card pack' }
    : { name: 'Pokémon Card Display Set: Mew', zh: '宝可梦卡牌展示组合 梦幻', released: 'April 26, 2024', contents: 'A Mew display frame and one Origin 25-card pack' },
  {
    name: 'Trainer Collection Gift Box',
    zh: '训练家收藏礼盒',
    released: 'May 17, 2024',
    contents: 'Trainer promo cards, with one Friends and one Origin 5-card pack',
  },
  {
    name: 'Radiant Energy Collection Binder Gift Boxes (Water and Psychic)',
    zh: '辉耀能量宝可梦收藏卡册礼盒 水属性 / 超属性',
    released: 'May 31, 2024',
    contents: 'A binder and Radiant Energy theme packs, with six random Polychromatic Gathering 25-card packs',
  },
  {
    name: 'Pokémon Art Illustration Festival Scene Poké Ball and Premier Ball Gift Boxes',
    zh: '精灵球/高级球礼盒：宝可梦艺术插画庆典 景',
    released: 'June 28, 2024',
    contents: 'A storage ball and holo cards, with one random Polychromatic Gathering 25-card pack',
  },
  ...(half === 'Origin'
    ? [
        {
          name: 'Fusion Strike Advanced Deck Building Gift Box',
          zh: '汇流卡组构筑进阶礼盒',
          released: 'July 12, 2024',
          contents: 'A Fusion Strike deck kit with six Origin 25-card packs',
        },
      ]
    : []),
  VARIETY_TREASURE_BOX('Polychromatic Gathering'),
  PARTNERS_GATHERING_BOX(`two Polychromatic Gathering: ${half} 25-card packs`),
]
