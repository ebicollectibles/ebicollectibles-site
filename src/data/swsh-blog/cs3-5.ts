import data from '~/data/swsh-cs3-5.json'
import { ORIGINS } from './cs3-5-origins'
import { PARTNERS_GATHERING_BOX, VARIETY_TREASURE_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Scorching Skies (CS3.5C). Release date, prices and pack contents: Pokémon
// China's product catalogue. Japanese sources: 52poke. Other products:
// Pokémon China's product catalogue.
export const CS3_5: SwshBlogSet = {
  key: 'scorching-skies',
  name: 'Scorching Skies',
  zh: '怒炎灼天',
  code: 'CS3.5C',
  mark: 'CS3.5',
  released: '2024-01-05',
  releasedText: 'January 5, 2024',
  data: data as SwshSetData,
  mainCount: 66,
  mainPokemon: 54,
  cardListPath: '/sets/chinese/scorching-skies-cs3-5',
  origins: ORIGINS,
  packs: [{ label: '6-card enhanced pack', detail: '15 yuan, 2 holos per pack, 20 packs per box (300 yuan a box)' }],
  theme:
    'It is the enhanced pack set that followed Primordial Arts, with Victini VMAX and Dracozolt VMAX as its rainbow Pokémon and alternate art Super Rares of Empoleon V and Galarian Moltres V.',
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Peerless Fighters (S5a), Rapid Strike Master (S5R), Jet-Black Spirit (S6K) and Single Strike Master (S5I).',
  products: [VARIETY_TREASURE_BOX('Scorching Skies'), PARTNERS_GATHERING_BOX('two Scorching Skies packs')],
  headline: ['083', '077', '073', '082', '084', '088'],
  headlineNote:
    'Victini VMAX and Dracozolt VMAX are the rainbow Hyper Rare Pokémon, and Empoleon V and Galarian Moltres V each have two Super Rares: a full art and an alternate art.',
  ladderNames: [
    'Victini V',
    'Victini VMAX',
    'Dracozolt V',
    'Dracozolt VMAX',
    'Galarian Moltres V',
    'Empoleon V',
    'Kricketune V',
    'Volcanion V',
    'Arctovish V',
    'Klara',
    'Avery',
    'Peony',
  ],
  laterThan: 'swsh8',
  tierMeaning: {
    CHR: 'Pokémon shown with a Trainer (Trainer Gallery in English)',
    CSR: 'Pokémon V shown with a Trainer (Trainer Gallery in English)',
    SR: 'Full art and alternate art Pokémon V, and full art Supporters',
    UR: 'Gold Pokémon, Items and Stadiums',
  },
}
