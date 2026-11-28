import data from '~/data/swsh-cs2b.json'
import { ORIGINS } from './cs2b-origins'
import { ONE_YEAR_BINDER_AND_SLEEVES, ONE_YEAR_BOX, PARTNERS_GATHERING_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Vivid Portrayals: Indigo (CS2bC). Release date, prices, pack contents and
// types: Pokémon China's product catalogue. Packs per box and cover Pokémon:
// Bulbapedia. Japanese sources: 52poke. Other products: Pokémon China's
// product catalogue.
export const CS2B: SwshBlogSet = {
  key: 'vivid-portrayals-indigo',
  name: 'Vivid Portrayals: Indigo',
  zh: '浓墨重彩 靛',
  code: 'CS2bC',
  mark: 'CS2b',
  released: '2023-08-18',
  releasedText: 'August 18, 2023',
  data: data as SwshSetData,
  mainCount: 115,
  mainPokemon: 102,
  cardListPath: '/sets/chinese/vivid-portrayals-indigo-cs2b',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Water, Lightning, Psychic and Darkness half of Vivid Portrayals, with Eternatus on the pack and three Amazing Rares: Kyogre, Raikou and Zacian.',
  partner: { name: 'Vivid Portrayals: Obsidian', key: 'vivid-portrayals-obsidian', cardListPath: '/sets/chinese/vivid-portrayals-obsidian-cs2a' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Infinity Zone (S3), Amazing Volt Tackle (S4) and Legendary Heartbeat (S3a), and its shiny cards in Shiny Star V (S4a).',
  products: [
    ONE_YEAR_BOX('Vivid Portrayals: Indigo'),
    ...ONE_YEAR_BINDER_AND_SLEEVES,
    PARTNERS_GATHERING_BOX('one Vivid Portrayals: Indigo 25-card pack'),
  ],
  headline: ['138', '129', '134', '141', '071', '006'],
  headlineNote:
    'Eternatus, the Pokémon on the pack, prints at four rarities, up to the rainbow Eternatus VMAX. Crobat V and VMAX are the shiny Shiny Super Rares, and Piers, Opal and Nessa have rainbow Hyper Rares.',
  ladderNames: [
    'Eternatus V',
    'Eternatus VMAX',
    'Crobat V',
    'Crobat VMAX',
    'Galarian Darmanitan V',
    'Galarian Darmanitan VMAX',
    'Drednaw V',
    'Drednaw VMAX',
    'Alcremie V',
    'Alcremie VMAX',
    'Ampharos V',
    'Alakazam V',
    'Drapion V',
    'Piers',
    'Opal',
    'Nessa',
  ],
  tierMeaning: { UR: 'Gold Tools' },
}
