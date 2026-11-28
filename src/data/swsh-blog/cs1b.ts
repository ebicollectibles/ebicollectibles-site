import data from '~/data/swsh-cs1b.json'
import { ORIGINS } from './cs1b-origins'
import { ONE_YEAR_BOX, PARTNERS_GATHERING_BOX } from './products'
import type { SwshBlogSet, SwshSetData } from './types'

// Dynamax Clash: Flame (CS1bC). Release date, prices and pack contents:
// Pokémon China's product catalogue. Packs per box: the set's card list
// page. Types: Pokémon China's product text. Cover Pokémon: Bulbapedia.
// Other products: Pokémon China's product catalogue.
export const CS1B: SwshBlogSet = {
  key: 'dynamax-clash-flame',
  name: 'Dynamax Clash: Flame',
  zh: '极巨争锋 焰',
  code: 'CS1bC',
  mark: 'CS1b',
  released: '2023-05-19',
  releasedText: 'May 19, 2023',
  data: data as SwshSetData,
  mainCount: 136,
  mainPokemon: 120,
  cardListPath: '/sets/chinese/dynamax-clash-flame-cs1b',
  origins: ORIGINS,
  packs: [
    { label: '5-card pack', detail: '10 yuan, 1 holo per pack, 30 packs per box' },
    { label: '25-card pack', detail: '50 yuan, 5 holos per pack, 24 packs per box' },
  ],
  theme:
    'It is the Grass, Fire, Darkness and Metal half of Dynamax Clash, with Cinderace on the pack. Zacian V and Zamazenta V, the Legendary Pokémon of Sword and Shield, are in its card list.',
  partner: { name: 'Dynamax Clash: Thunder', key: 'dynamax-clash-thunder', cardListPath: '/sets/chinese/dynamax-clash-thunder-cs1a' },
  japaneseSources:
    'Most of its cards were first printed in the Japanese Sword & Shield sets Sword (S1W), Shield (S1H), VMAX Rising (S1a), Rebellion Crash (S2) and Explosive Walker (S2a), and its shiny cards in Shiny Star V (S4a).',
  products: [
    { name: 'Dynamax Clash V Starter Deck', zh: '极巨争锋 V起始卡组', released: 'May 19, 2023', contents: 'A ready-to-play 60-card deck plus a 1-card bonus pack' },
    { name: 'Dynamax Clash Deck Building Gift Box', zh: '极巨争锋 卡组构筑礼盒', released: 'May 19, 2023', contents: 'One random Pokémon V holo, Trainers, Energy and one random Dynamax Clash 25-card pack' },
    { name: "Marnie's Resolve Gift Box", zh: '【玛俐的决心】专属礼盒', released: 'June 18, 2023', contents: 'Marnie promo cards and accessories, plus one Thunder and one Flame 25-card pack' },
    {
      name: 'Pokémon Card Display Set: Grookey, Scorbunny and Sobble',
      zh: '宝可梦卡牌展示组合 敲音猴&炎兔儿&泪眼蜥',
      released: 'June 28, 2023',
      contents: 'A Grookey, Scorbunny and Sobble display frame, one Flame 25-card pack and one Dynamax Tactics pack',
    },
    ONE_YEAR_BOX('Dynamax Clash: Flame'),
    PARTNERS_GATHERING_BOX('one Dynamax Clash: Flame 25-card pack'),
  ],
  headline: ['184', '165', '192', '193', '188', '183'],
  headlineNote:
    'Cinderace prints at four rarities, from Cinderace V up to the rainbow Cinderace VMAX, and the gold Zacian V and Zamazenta V are the Legendary pair most collectors chase.',
  ladderNames: [
    'Rillaboom V',
    'Rillaboom VMAX',
    'Cinderace V',
    'Cinderace VMAX',
    'Centiskorch V',
    'Centiskorch VMAX',
    'Grimmsnarl V',
    'Grimmsnarl VMAX',
    'Malamar V',
    'Malamar VMAX',
    'Copperajah V',
    'Copperajah VMAX',
    'Zacian V',
    'Zamazenta V',
    'Dubwool V',
    "Professor's Research",
    'Milo',
  ],
  tierMeaning: { UR: 'Gold Pokémon, Items, Tools, Stadiums and Energy' },
  creditNotes: [
    { cn: '045', name: 'Fletchinder', zhCredit: 'Mitsuhiro Arita', enCredit: 'Mina Nakai' },
    { cn: '188', name: "Professor's Research", zhCredit: 'kirisAki', enCredit: 'Yusuke Ohmura' },
  ],
}
