import data from '~/data/swsh-cs2-5.json'
import { ORIGINS } from './cs2-5-origins'
import { ONE_YEAR_BINDER_AND_SLEEVES, PARTNERS_GATHERING_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Brilliant Counterattack (CS2.5C). Release date, prices and pack contents:
// Pokémon China's product catalogue. Japanese sources: 52poke. Other
// products: Pokémon China's product catalogue.
export const CS2_5: SwshBlogSet = {
  key: 'brilliant-counterattack',
  name: 'Brilliant Counterattack',
  zh: '璀璨反击',
  code: 'CS2.5C',
  mark: 'CS2.5',
  released: '2023-09-29',
  releasedText: 'September 29, 2023',
  data: data as SwshSetData,
  mainCount: 59,
  mainPokemon: 45,
  cardListPath: '/sets/chinese/brilliant-counterattack-cs2-5',
  origins: ORIGINS,
  packs: [{ label: '6-card enhanced pack', detail: '15 yuan, 2 holos per pack, 20 packs per box (300 yuan a box)' }],
  theme:
    'It is the enhanced pack set that followed Vivid Portrayals, with Togekiss VMAX and Aegislash VMAX as its rainbow Pokémon and three Amazing Rares: Celebi, Yveltal and Jirachi.',
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Amazing Volt Tackle (S4), Infinity Zone (S3) and Legendary Heartbeat (S3a), and its shiny cards in Shiny Star V (S4a).',
  products: [...ONE_YEAR_BINDER_AND_SLEEVES, PARTNERS_GATHERING_BOX('two Brilliant Counterattack packs')],
  headline: ['075', '074', '073', '070', '077', '030'],
  headlineNote:
    'Togekiss VMAX and Aegislash VMAX are the rainbow Hyper Rare Pokémon, Ditto V and VMAX are the shiny Shiny Super Rares, and Beauty and Rose have rainbow Hyper Rares.',
  ladderNames: [
    'Togekiss V',
    'Togekiss VMAX',
    'Aegislash V',
    'Aegislash VMAX',
    'Ditto V',
    'Ditto VMAX',
    'Talonflame V',
    'Galarian Cursola V',
    "Galarian Sirfetch'd V",
    'Beauty',
    'Rose',
    "Professor's Research",
    "Boss's Orders",
    'Ball Guy',
    'Cufant',
    'Copperajah',
  ],
  tierMeaning: { UR: 'Gold Items and Tools' },
}
