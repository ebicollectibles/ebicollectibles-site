import data from '~/data/swsh-cs4-5.json'
import { ORIGINS } from './cs4-5-origins'
import { PARTNERS_GATHERING_BOX, VARIETY_TREASURE_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Flame Dance of the End (CS4.5C). Release date, prices and pack contents:
// Pokémon China's product catalogue. Japanese sources: 52poke. Other
// products: Pokémon China's product catalogue.
export const CS4_5: SwshBlogSet = {
  key: 'flame-dance-of-the-end',
  name: 'Flame Dance of the End',
  zh: '终末炎舞',
  code: 'CS4.5C',
  mark: 'CS4.5',
  released: '2024-04-26',
  releasedText: 'April 26, 2024',
  data: data as SwshSetData,
  mainCount: 63,
  mainPokemon: 47,
  cardListPath: '/sets/chinese/flame-dance-of-the-end-cs4-5',
  origins: ORIGINS,
  packs: [{ label: '6-card enhanced pack', detail: '15 yuan, 2 holos per pack, 20 packs per box (300 yuan a box)' }],
  theme:
    'It is the enhanced pack set that followed Polychromatic Gathering, with Inteleon VMAX and Garbodor VMAX as its Hyper Rare Pokémon and alternate art Super Rares of Dragonite V and Noivern V.',
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Skyscraping Perfection (S7D) and Blue Sky Stream (S7R).',
  products: [
    { name: 'Pokémon Card Display Sets: Umbreon and Mew', zh: '宝可梦卡牌展示组合 月亮伊布 / 梦幻', released: 'April 26, 2024', contents: 'A display frame, one Polychromatic Gathering 25-card pack and one Flame Dance of the End pack' },
    { name: 'Eevee Advanced Gift Boxes (Vaporeon, Jolteon and Flareon)', zh: '伊布进阶礼盒', released: 'April 26, 2024', contents: 'Eevee promo cards and accessories, Polychromatic Gathering packs and two Flame Dance of the End packs' },
    { name: 'Trainer Collection Gift Box', zh: '训练家收藏礼盒', released: 'May 17, 2024', contents: 'Trainer promo cards, two Polychromatic Gathering 5-card packs and one Flame Dance of the End pack' },
    { name: 'Irida and Adaman Set Gift Box', zh: '珠贝&刚石套装礼盒', released: 'June 18, 2024', contents: 'Irida and Adaman special illustration holos and accessories, three each of the Gallant Galaxy Charm and Brave 25-card packs, and three Flame Dance of the End packs' },
    VARIETY_TREASURE_BOX('Flame Dance of the End'),
    PARTNERS_GATHERING_BOX('two Flame Dance of the End packs'),
  ],
  headline: ['079', '069', '071', '078', '080', '076'],
  headlineNote:
    'Inteleon VMAX (an alternate art) and Garbodor VMAX (a rainbow) are the Hyper Rare Pokémon, Dragonite V and Noivern V each have a full art and an alternate art Super Rare, and Mimikyu V and VMAX are the Character Super Rares.',
  ladderNames: ['Inteleon VMAX', 'Garbodor V', 'Garbodor VMAX', 'Mimikyu V', 'Mimikyu VMAX', 'Dragonite V', 'Noivern V', 'Volcarona V', 'Suicune V', 'Aroma Lady', "Acerola's Premonition", "Adventurer's Discovery", 'Café Master', 'Gloria'],
  laterThan: 'swsh8',
  tierMeaning: {
    HR: 'Rainbow and alternate art Pokémon VMAX, and rainbow Supporters',
    CSR: 'Pokémon V and VMAX shown with a Trainer (Trainer Gallery in English)',
    SR: 'Full art and alternate art Pokémon V, and full art Supporters',
    UR: 'Gold Items',
  },
}
