import data from '~/data/swsh-cs1-5.json'
import { ORIGINS } from './cs1-5-origins'
import type { SwshBlogSet, SwshSetData } from './types'

// Dynamax Tactics (CS1.5C). Release date, prices and pack contents:
// Pokémon China's product catalogue. Japanese counterpart: 52poke. Other
// products: Pokémon China's product catalogue.
export const CS1_5: SwshBlogSet = {
  key: 'dynamax-tactics',
  name: 'Dynamax Tactics',
  zh: '极巨攻防',
  code: 'CS1.5C',
  mark: 'CS1.5',
  released: '2023-06-28',
  releasedText: 'June 28, 2023',
  data: data as SwshSetData,
  mainCount: 55,
  mainPokemon: 41,
  cardListPath: '/sets/chinese/dynamax-tactics-cs1-5',
  origins: ORIGINS,
  packs: [{ label: '6-card enhanced pack', detail: '15 yuan, 2 holos per pack, 20 packs per box (300 yuan a box)' }],
  theme:
    'It is a smaller enhanced pack set that followed Dynamax Clash, with Dragapult VMAX as its top Pokémon and four Special Energy cards: Heat Fire, Speed Lightning, Horror Psychic and Capture Energy.',
  japaneseSources:
    'It broadly follows the Japanese high class set Shiny Star V (S4a), and most of its cards were first printed in the Japanese sets Explosive Walker (S2a), Rebellion Crash (S2), Shield (S1H) and Sword (S1W).',
  products: [
    {
      name: 'Pokémon Card Display Set: Pikachu',
      zh: '宝可梦卡牌展示组合 皮卡丘',
      released: 'June 28, 2023',
      contents: 'A Pikachu display frame, one Dynamax Clash: Thunder 25-card pack and one Dynamax Tactics pack',
    },
    {
      name: 'Pokémon Card Display Set: Grookey, Scorbunny and Sobble',
      zh: '宝可梦卡牌展示组合 敲音猴&炎兔儿&泪眼蜥',
      released: 'June 28, 2023',
      contents: 'A Grookey, Scorbunny and Sobble display frame, one Dynamax Clash: Flame 25-card pack and one Dynamax Tactics pack',
    },
    {
      name: "Partners' Gathering Gift Box",
      zh: '伙伴们的欢聚 专属礼盒',
      released: 'November 15, 2024',
      contents: 'Promo cards and accessories, with two Dynamax Tactics packs among packs from many Sword & Shield sets',
    },
  ],
  headline: ['087', '085', '077', '088', '091', '096'],
  headlineNote:
    'Dragapult V and Dragapult VMAX each print at three rarities, up to the shiny and rainbow Dragapult VMAX. Oleana, Kabu and Pokémon Breeder’s Nurturing are the Supporters with rainbow Hyper Rares.',
  ladderNames: [
    'Dragapult V',
    'Dragapult VMAX',
    'Eldegoss V',
    'Cramorant V',
    'Dhelmise V',
    'Milotic V',
    'Vikavolt V',
    'Galarian Stunfisk V',
    'Galarian Perrserker',
    'Oranguru',
    'Oleana',
    'Kabu',
    "Pokémon Breeder's Nurturing",
    'Capture Energy',
  ],
  tierMeaning: { UR: 'Gold Pokémon, Items, Tools and Energy' },
}
