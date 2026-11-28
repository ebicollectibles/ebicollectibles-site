import data from '~/data/swsh-cs1a.json'
import { ORIGINS } from './cs1a-origins'
import type { SwshBlogSet, SwshSetData } from './types'

// Dynamax Clash: Thunder (CS1aC). Release date, prices and pack contents:
// Pokémon China's product catalogue. Packs per box: the set's card list
// page. Theme and cover Pokémon: Pokémon China's product text (types) and
// the set's packaging. Other products: Pokémon China's product catalogue.
export const CS1A: SwshBlogSet = {
  key: 'dynamax-clash-thunder',
  name: 'Dynamax Clash: Thunder',
  zh: '极巨争锋 雷',
  code: 'CS1aC',
  mark: 'CS1a',
  released: '2023-05-19',
  releasedText: 'May 19, 2023',
  data: data as SwshSetData,
  mainCount: 135,
  mainPokemon: 119,
  cardListPath: '/sets/chinese/dynamax-clash-thunder-cs1a',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Water, Lightning, Psychic and Fighting half of Dynamax Clash, the set that started the Simplified Chinese Sword & Shield series, with Gigantamax Pikachu on the pack. It brought Pokémon VMAX to Simplified Chinese.',
  partner: { name: 'Dynamax Clash: Flame', key: 'dynamax-clash-flame', cardListPath: '/sets/chinese/dynamax-clash-flame-cs1b' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Sword (S1W), Shield (S1H), VMAX Rising (S1a), Rebellion Crash (S2), Explosive Walker (S2a) and Amazing Volt Tackle (S4), and its shiny cards in Shiny Star V (S4a).',
  products: [
    { name: 'Dynamax Clash V Starter Deck', zh: '极巨争锋 V起始卡组', released: 'May 19, 2023', contents: 'A ready-to-play 60-card deck plus a 1-card bonus pack' },
    { name: 'Dynamax Clash Deck Building Gift Box', zh: '极巨争锋 卡组构筑礼盒', released: 'May 19, 2023', contents: 'One random Pokémon V holo, Trainers, Energy and one random Dynamax Clash 25-card pack' },
    { name: "Marnie's Resolve Gift Box", zh: '【玛俐的决心】专属礼盒', released: 'June 18, 2023', contents: 'Marnie promo cards and accessories, plus one Thunder and one Flame 25-card pack' },
    { name: 'Pokémon Card Display Set: Pikachu', zh: '宝可梦卡牌展示组合 皮卡丘', released: 'June 28, 2023', contents: 'A Pikachu display frame, one Thunder 25-card pack and one Dynamax Tactics pack' },
  ],
  headline: ['202', '177', '029', '211', '192', '191'],
  headlineNote: 'Pikachu prints at four rarities, from Pikachu V up to the rainbow Pikachu VMAX, and Marnie and Boss’s Orders are the Supporter secret cards most collectors chase.',
  ladderNames: ['Pikachu V', 'Pikachu VMAX', 'Lapras V', 'Lapras VMAX', 'Toxtricity V', 'Toxtricity VMAX', 'Gardevoir V', 'Gardevoir VMAX', 'Snorlax V', 'Snorlax VMAX', 'Marnie', "Boss's Orders"],
}
