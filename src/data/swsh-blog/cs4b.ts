import data from '~/data/swsh-cs4b.json'
import { ORIGINS } from './cs4b-origins'
import { POLYCHROMATIC_PRODUCTS } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Polychromatic Gathering: Origin (CS4bC). Release date, prices and pack contents: Pokémon China's
// product catalogue. Packs per box, battle styles and cover Pokémon:
// Bulbapedia. Japanese sources: 52poke. Other products: Pokémon China's
// product catalogue.
export const CS4B: SwshBlogSet = {
  key: 'polychromatic-gathering-origin',
  name: 'Polychromatic Gathering: Origin',
  zh: '九彩汇聚 源',
  code: 'CS4bC',
  mark: 'CS4b',
  released: '2024-03-01',
  releasedText: 'March 1, 2024',
  data: data as SwshSetData,
  mainCount: 132,
  mainPokemon: 115,
  cardListPath: '/sets/chinese/polychromatic-gathering-origin-cs4b',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Fusion Strike half of Polychromatic Gathering, with Mew, Genesect and Dragapult on the pack and Mew VMAX and Rayquaza VMAX as its best-known cards.',
  partner: { name: 'Polychromatic Gathering: Friends', key: 'polychromatic-gathering-friends', cardListPath: '/sets/chinese/polychromatic-gathering-friends-cs4a' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Fusion Arts (S8), Blue Sky Stream (S7R), Skyscraping Perfection (S7D) and Eevee Heroes (S6a).',
  products: POLYCHROMATIC_PRODUCTS('Origin'),
  headline: ['162', '165', '144', '138', '156', '161'],
  headlineNote:
    'Mew VMAX and Rayquaza VMAX each have two Hyper Rares, a rainbow and an alternate art. Mew V and Genesect V each have two Super Rares, and Rayquaza VMAX also has a Character Super Rare.',
  ladderNames: [
    'Mew V',
    'Mew VMAX',
    'Rayquaza V',
    'Rayquaza VMAX',
    'Genesect V',
    'Trevenant V',
    'Trevenant VMAX',
    'Chandelure V',
    'Chandelure VMAX',
    'Gyarados V',
    'Gyarados VMAX',
    'Boltund V',
    'Boltund VMAX',
    'Lycanroc V',
    'Lycanroc VMAX',
    'Greedent V',
    'Greedent VMAX',
    'Golurk V',
    'Hoopa V',
    'Sidney',
    "Elesa's Sparkle",
    'Schoolboy',
    'Dancer',
    "Zinnia's Resolve",
    'Chili & Cilan & Cress',
  ],
  creditNotes: [
    { cn: '024', name: 'Starmie', zhCredit: 'Uta', enCredit: 'Megumi Mizutani' },
    { cn: '051', name: 'Galarian Cursola', zhCredit: 'sui', enCredit: 'Misa Tsutsui' },
    { cn: '055', name: 'Indeedee', zhCredit: 'sui', enCredit: 'Misa Tsutsui' },
    { cn: '091', name: 'Altaria', zhCredit: 'sui', enCredit: 'Misa Tsutsui' },
    { cn: '110', name: 'Bunnelby', zhCredit: 'sui', enCredit: 'Misa Tsutsui' },
  ],
  laterThan: 'swsh8',
  tierMeaning: {
    CSR: 'Pokémon V and VMAX shown with a Trainer (Trainer Gallery in English)',
    SR: 'Full art and alternate art Pokémon V, and full art Supporters',
    HR: 'Rainbow and alternate art Pokémon VMAX, and rainbow Supporters',
    UR: 'Gold Pokémon, Items, Stadiums and basic Energy',
  },
}
