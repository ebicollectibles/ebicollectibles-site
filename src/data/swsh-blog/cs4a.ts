import data from '~/data/swsh-cs4a.json'
import { ORIGINS } from './cs4a-origins'
import { POLYCHROMATIC_PRODUCTS } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Polychromatic Gathering: Friends (CS4aC). Release date, prices and pack contents: Pokémon China's
// product catalogue. Packs per box, battle styles and cover Pokémon:
// Bulbapedia. Japanese sources: 52poke. Other products: Pokémon China's
// product catalogue.
export const CS4A: SwshBlogSet = {
  key: 'polychromatic-gathering-friends',
  name: 'Polychromatic Gathering: Friends',
  zh: '九彩汇聚 朋',
  code: 'CS4aC',
  mark: 'CS4a',
  released: '2024-03-01',
  releasedText: 'March 1, 2024',
  data: data as SwshSetData,
  mainCount: 132,
  mainPokemon: 117,
  cardListPath: '/sets/chinese/polychromatic-gathering-friends-cs4a',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Eevee half of Polychromatic Gathering, with the Eeveelutions on the pack and all eight Eeveelutions as Pokémon V and VMAX, each Pokémon V with two Super Rares.',
  partner: { name: 'Polychromatic Gathering: Origin', key: 'polychromatic-gathering-origin', cardListPath: '/sets/chinese/polychromatic-gathering-origin-cs4b' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Eevee Heroes (S6a), Skyscraping Perfection (S7D), Fusion Arts (S8) and Blue Sky Stream (S7R).',
  products: POLYCHROMATIC_PRODUCTS('Friends'),
  headline: ['173', '171', '166', '168', '163', '172'],
  headlineNote:
    'Umbreon VMAX, Sylveon VMAX, Leafeon VMAX and Glaceon VMAX each have two Hyper Rares, a rainbow and an alternate art, and Umbreon and Sylveon also have Character Super Rares.',
  ladderNames: [
    'Umbreon V',
    'Umbreon VMAX',
    'Sylveon V',
    'Sylveon VMAX',
    'Espeon V',
    'Espeon VMAX',
    'Leafeon V',
    'Leafeon VMAX',
    'Glaceon V',
    'Glaceon VMAX',
    'Flareon V',
    'Flareon VMAX',
    'Vaporeon V',
    'Vaporeon VMAX',
    'Jolteon V',
    'Jolteon VMAX',
    'Duraludon V',
    'Duraludon VMAX',
    'Tsareena V',
    'Crabominable V',
    'Medicham V',
    'Raihan',
    'Shauna',
    'Schoolgirl',
    'Gordie',
    'Copycat',
  ],
  creditNotes: [
    { cn: '089', name: 'Garbodor', zhCredit: 'sui', enCredit: 'Misa Tsutsui' },
  ],
  laterThan: 'swsh8',
  tierMeaning: {
    CSR: 'Pokémon V and VMAX shown with a Trainer (Trainer Gallery in English)',
    SR: 'Full art and alternate art Pokémon V, and full art Supporters',
    HR: 'Rainbow and alternate art Pokémon VMAX, and rainbow Supporters',
    UR: 'Gold Tools, Stadiums and basic Energy',
  },
}
