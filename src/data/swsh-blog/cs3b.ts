import data from '~/data/swsh-cs3b.json'
import { ORIGINS } from './cs3b-origins'
import { PARTNERS_GATHERING_BOX, VARIETY_TREASURE_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Primordial Arts: Torrent (CS3bC). Release date, prices and pack contents:
// Pokémon China's product catalogue. Packs per box, battle style theme and
// cover Pokémon: Bulbapedia. Japanese sources: 52poke. Other products:
// Pokémon China's product catalogue.
export const CS3B: SwshBlogSet = {
  key: 'primordial-arts-torrent',
  name: 'Primordial Arts: Torrent',
  zh: '洪荒演武 激',
  code: 'CS3bC',
  mark: 'CS3b',
  released: '2023-11-17',
  releasedText: 'November 17, 2023',
  data: data as SwshSetData,
  mainCount: 122,
  mainPokemon: 103,
  cardListPath: '/sets/chinese/primordial-arts-torrent-cs3b',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Rapid Strike half of Primordial Arts, with Gigantamax Blastoise on the pack and Character Rare and Character Super Rare cards among its secret cards.',
  partner: { name: 'Primordial Arts: Overgrow', key: 'primordial-arts-overgrow', cardListPath: '/sets/chinese/primordial-arts-overgrow-cs3a' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Rapid Strike Master (S5R), Silver Lance (S6H), Peerless Fighters (S5a) and Jet-Black Spirit (S6K).',
  products: [
    { name: 'Primordial Arts V Starter Deck', zh: '洪荒演武 V起始卡组', released: 'November 17, 2023', contents: 'A ready-to-play 60-card deck plus a 1-card bonus pack' },
    {
      name: 'Primordial Arts: Torrent Deck Building Gift Box',
      zh: '宝可梦卡牌 卡组构筑礼盒 洪荒演武 激',
      released: 'November 17, 2023',
      contents: 'One random Pokémon V holo, Trainers, Energy and one Torrent 25-card pack',
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
    PARTNERS_GATHERING_BOX('one Primordial Arts: Torrent 25-card pack'),
  ],
  headline: ['160', '129', '164', '161', '151', '174'],
  headlineNote:
    'Blastoise, the Pokémon on the pack, prints at four rarities, and its Super Rare and Hyper Rare use art that English printed only as regular promos or not at all. Rapid Strike Urshifu and Ice Rider Calyrex each have Character Super Rares and two rainbow Hyper Rares.',
  ladderNames: [
    'Blastoise V',
    'Blastoise VMAX',
    'Rapid Strike Urshifu V',
    'Rapid Strike Urshifu VMAX',
    'Ice Rider Calyrex V',
    'Ice Rider Calyrex VMAX',
    'Blaziken V',
    'Blaziken VMAX',
    'Flapple V',
    'Flapple VMAX',
    'Sandaconda V',
    'Sandaconda VMAX',
    'Metagross V',
    'Metagross VMAX',
    'Galarian Articuno V',
    'Zeraora V',
    'Necrozma V',
    'Stoutland V',
    'Rapid Strike Style Mustard',
    "Korrina's Focus",
    'Caitlin',
    'Siebold',
    'Brawly',
    'Doctor',
    'Melony',
  ],
  laterThan: 'swsh8',
  tierMeaning: {
    CHR: 'Pokémon shown with a Trainer (Trainer Gallery in English)',
    CSR: 'Pokémon V and VMAX shown with a Trainer (Trainer Gallery in English)',
    UR: 'Gold Pokémon, Items, Tools and Energy',
  },
}
