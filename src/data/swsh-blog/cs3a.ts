import data from '~/data/swsh-cs3a.json'
import { ORIGINS } from './cs3a-origins'
import { PARTNERS_GATHERING_BOX, VARIETY_TREASURE_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Primordial Arts: Overgrow (CS3aC). Release date, prices and pack contents:
// Pokémon China's product catalogue. Packs per box, battle style theme and
// cover Pokémon: Bulbapedia. Japanese sources: 52poke. Other products:
// Pokémon China's product catalogue.
export const CS3A: SwshBlogSet = {
  key: 'primordial-arts-overgrow',
  name: 'Primordial Arts: Overgrow',
  zh: '洪荒演武 茂',
  code: 'CS3aC',
  mark: 'CS3a',
  released: '2023-11-17',
  releasedText: 'November 17, 2023',
  data: data as SwshSetData,
  mainCount: 125,
  mainPokemon: 105,
  cardListPath: '/sets/chinese/primordial-arts-overgrow-cs3a',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Single Strike half of Primordial Arts, with Gigantamax Venusaur on the pack and Character Rare and Character Super Rare cards among its secret cards.',
  partner: { name: 'Primordial Arts: Torrent', key: 'primordial-arts-torrent', cardListPath: '/sets/chinese/primordial-arts-torrent-cs3b' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Single Strike Master (S5I), Jet-Black Spirit (S6K), Silver Lance (S6H) and Peerless Fighters (S5a).',
  products: [
    { name: 'Primordial Arts V Starter Deck', zh: '洪荒演武 V起始卡组', released: 'November 17, 2023', contents: 'A ready-to-play 60-card deck plus a 1-card bonus pack' },
    {
      name: 'Primordial Arts: Overgrow Deck Building Gift Box',
      zh: '宝可梦卡牌 卡组构筑礼盒 洪荒演武 茂',
      released: 'November 17, 2023',
      contents: 'One random Pokémon V holo, Trainers, Energy and one Overgrow 25-card pack',
    },
    {
      name: 'Pikachu Legendary Celebration Poké Ball and Great Ball Gift Boxes',
      zh: '精灵球礼盒 / 超级球礼盒：皮卡丘传奇庆典',
      released: 'December 8, 2023',
      contents: 'A storage ball, a random Pikachu holo and Legendary Pokémon holo, and one random Primordial Arts 25-card pack',
    },
    {
      name: 'Connected Quartet Gift Box: Pikachu',
      zh: '四方联结礼盒：皮卡丘大集合',
      released: 'January 19, 2024',
      contents: 'A Pikachu V-UNION set and wall frame, with two Overgrow and two Torrent 5-card packs',
    },
    {
      name: 'Connected Quartet Set Gift Box: Morpeko',
      zh: '四方联结套装礼盒：莫鲁贝可',
      released: 'January 19, 2024',
      contents: 'Two Morpeko V-UNION sets, a binder, deck box and sleeves, with three Overgrow and three Torrent 5-card packs',
    },
    VARIETY_TREASURE_BOX('Primordial Arts'),
    PARTNERS_GATHERING_BOX('one Primordial Arts: Overgrow 25-card pack'),
  ],
  headline: ['161', '130', '166', '164', '159', '177'],
  headlineNote:
    'Venusaur, the Pokémon on the pack, prints at four rarities, and its Super Rare and Hyper Rare use art that English printed only as regular promos or not at all. Single Strike Urshifu and Shadow Rider Calyrex each have Character Super Rares and two Hyper Rares, a rainbow and an alternate art.',
  ladderNames: [
    'Venusaur V',
    'Venusaur VMAX',
    'Shadow Rider Calyrex V',
    'Shadow Rider Calyrex VMAX',
    'Single Strike Urshifu V',
    'Single Strike Urshifu VMAX',
    'Celebi V',
    'Celebi VMAX',
    'Tapu Koko V',
    'Tapu Koko VMAX',
    'Tornadus VMAX',
    'Galarian Zapdos V',
    'Blissey V',
    'Galarian Rapidash V',
    'Tyranitar V',
    'Liepard V',
    'Bronzong',
    'Single Strike Style Mustard',
    "Karen's Conviction",
    'Flannery',
    'Agatha',
    'Bruno',
    'Peonia',
    'Phoebe',
    'Cheryl',
  ],
  laterThan: 'swsh8',
  tierMeaning: {
    HR: 'Rainbow and alternate art Pokémon VMAX, and rainbow Supporters',
    CHR: 'Pokémon shown with a Trainer (Trainer Gallery in English)',
    CSR: 'Pokémon V and VMAX shown with a Trainer (Trainer Gallery in English)',
    UR: 'Gold Pokémon, Items, Tools and Energy',
  },
}
