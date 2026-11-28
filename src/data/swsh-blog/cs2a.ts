import data from '~/data/swsh-cs2a.json'
import { ORIGINS } from './cs2a-origins'
import { ONE_YEAR_BINDER_AND_SLEEVES, ONE_YEAR_BOX, PARTNERS_GATHERING_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Vivid Portrayals: Obsidian (CS2aC). Release date, prices, pack contents and
// types: Pokémon China's product catalogue. Packs per box and cover Pokémon:
// Bulbapedia. Japanese sources: 52poke. Other products: Pokémon China's
// product catalogue.
export const CS2A: SwshBlogSet = {
  key: 'vivid-portrayals-obsidian',
  name: 'Vivid Portrayals: Obsidian',
  zh: '浓墨重彩 黎',
  code: 'CS2aC',
  mark: 'CS2a',
  released: '2023-08-18',
  releasedText: 'August 18, 2023',
  data: data as SwshSetData,
  mainCount: 115,
  mainPokemon: 101,
  cardListPath: '/sets/chinese/vivid-portrayals-obsidian-cs2a',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Grass, Fire, Fighting and Metal half of Vivid Portrayals, with Gigantamax Charizard on the pack and three Amazing Rares: Reshiram, Zamazenta and Rayquaza.',
  partner: { name: 'Vivid Portrayals: Indigo', key: 'vivid-portrayals-indigo', cardListPath: '/sets/chinese/vivid-portrayals-indigo-cs2b' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Infinity Zone (S3), Legendary Heartbeat (S3a) and Amazing Volt Tackle (S4), and its shiny cards in Shiny Star V (S4a).',
  products: [
    {
      name: 'Charizard VMAX Battle Set Gift Box',
      zh: '喷火龙VMAX对战套装礼盒',
      released: 'August 18, 2023',
      contents: 'A special finish Charizard VMAX holo, Charizard playmat, deck box, sleeves and die, and one Obsidian 25-card pack',
    },
    {
      name: 'Charizard VMAX Collection Set Gift Box',
      zh: '喷火龙VMAX收藏套装礼盒',
      released: 'August 18, 2023',
      contents: 'A special illustration Charizard VMAX holo, Charizard binder and display frame, and three Obsidian 25-card packs',
    },
    ONE_YEAR_BOX('Vivid Portrayals: Obsidian'),
    ...ONE_YEAR_BINDER_AND_SLEEVES,
    PARTNERS_GATHERING_BOX('one Vivid Portrayals: Obsidian 25-card pack'),
  ],
  headline: ['134', '133', '141', '142', '093', '138'],
  headlineNote:
    'Charizard, the Pokémon on the pack, prints as Charizard V and VMAX in the main set and again as shiny Shiny Super Rares. Leon, Bea and Allister have rainbow Hyper Rares.',
  ladderNames: [
    'Charizard V',
    'Charizard VMAX',
    'Orbeetle V',
    'Orbeetle VMAX',
    'Coalossal V',
    'Coalossal VMAX',
    'Scizor V',
    'Scizor VMAX',
    'Salamence V',
    'Salamence VMAX',
    'Zarude V',
    'Houndoom V',
    'Rhyperior V',
    'Steelix V',
    'Leon',
    'Bea',
    'Allister',
    'Snorlax',
  ],
  tierMeaning: { UR: 'Gold Pokémon and Tools' },
}
