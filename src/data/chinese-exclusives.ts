// Every card a set's data marks as a Chinese Exclusive, with what the
// "Every Chinese Exclusive" post needs to show it. Copied out of each set's
// exclusiveCardNumbers (src/data/*.json, and the per-release lists in the
// four Collect 151 set pages) so that post does not have to load every
// card list. chinese-exclusives.test.ts checks this list against those
// sources and against exclusiveCount in gem-sets-index.ts, so a change to a
// set's data fails the tests until this file matches it.
export interface ChineseExclusiveCard {
  /** GEM_SETS slug of the set (or Collect 151 release) the card belongs to. */
  set: string
  number: string
  name: string
  rarity: string
  image: string
}

export const CHINESE_EXCLUSIVES: ChineseExclusiveCard[] = [
  { set: 'fearless-terastal-csv3', number: '155/130', name: "Arcanine ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Fearless%20Terastal%20CSV3/Cards/0155.webp' },
  { set: 'reward-round-csv4', number: '158/129', name: "Maushold ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0158.webp' },
  { set: 'reward-round-csv4', number: '159/129', name: "Rika", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0159.webp' },
  { set: 'reward-round-csv4', number: '162/129', name: "Gholdengo ex", rarity: 'Ultra Rare (UR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0162.webp' },
  { set: 'black-crystal-blaze-csv5', number: '157/129', name: "Larry", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Dark%20Crystal%20Blaze%20CSV5/Cards/0157.webp' },
  { set: 'black-crystal-blaze-csv5', number: '164/129', name: "Defiance Band", rarity: 'Ultra Rare (UR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Dark%20Crystal%20Blaze%20CSV5/Cards/0164.webp' },
  { set: 'true-mystery-csv6', number: '152/128', name: "Iron Hands ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/True%20Mystic/Cards/0152.webp' },
  { set: 'blade-awakening-csv7', number: '245/204', name: "Ciphermaniac's Codebreaking", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0245.webp' },
  { set: 'brilliant-fantasy-csv8', number: '255/207', name: "Carmine", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Brilliant%20Fantasy/Cards/0255.webp' },
  { set: 'stellar-crystal-csv9', number: '257/208', name: "Lisia's Appeal", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Stellar%20Crystal/Cards/0257.webp' },
  { set: 'terastal-gathering-csv9-5', number: '234/208', name: "Sylveon ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Crystal%20Gathering/Cards/0234.webp' },
  { set: 'chasing-glory-csv10', number: '276/222', name: "Brock's Scouting", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Chasing%20Glory/Cards/0276.webp' },
  { set: 'black-bolt-csv10-5', number: '173/086', name: "N's Plan", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Black%20Bolt/Cards/0173.webp' },
  { set: 'white-flare-csv10-6', number: '173/086', name: "Hilda", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/White%20Flare/Cards/0173.webp' },
  { set: 'gem-vol-1', number: '0109/09', name: "Sprigatito", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%201/Cards/0109.webp' },
  { set: 'gem-vol-1', number: '0309/09', name: "Fuecoco", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%201/Cards/0309.webp' },
  { set: 'gem-vol-1', number: '0509/09', name: "Quaxly", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%201/Cards/0509.webp' },
  { set: 'gem-vol-1', number: '0709/09', name: "Captain Pikachu", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%201/Cards/0709.webp' },
  { set: 'gem-vol-2', number: '0115/15', name: "Eevee", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%202/Cards/0115.webp' },
  { set: 'gem-vol-2', number: '0615/15', name: "Umbreon", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%202/Cards/0615.webp' },
  { set: 'gem-vol-2', number: '0715/15', name: "Leafeon", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%202/Cards/0715.webp' },
  { set: 'gem-vol-2', number: '0915/15', name: "Sylveon", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%202/Cards/0915.webp' },
  { set: 'gem-vol-3', number: '0207/07', name: "Meowth", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/0207.webp' },
  { set: 'gem-vol-3', number: '0307/07', name: "Gengar", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/0307.webp' },
  { set: 'gem-vol-3', number: '0407/07', name: "Cubone", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/0407.webp' },
  { set: 'gem-vol-3', number: '1107/07', name: "Chandelure", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/1107.webp' },
  { set: 'gem-vol-3', number: '1507/07', name: "Ceruledge", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%203/Cards/1507.webp' },
  { set: 'gem-vol-4', number: '0107/07', name: "Ponyta", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%204/Cards/0107.webp' },
  { set: 'gem-vol-5', number: '0107/07', name: "Captain Pikachu", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%205/Cards/0107.webp' },
  { set: 'gem-vol-5', number: '2207/07', name: "Floragato", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%205/Cards/2207.webp' },
  { set: 'gem-vol-5', number: '2307/07', name: "Crocalor", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%205/Cards/2307.webp' },
  { set: 'gem-vol-5', number: '2407/07', name: "Quaxwell", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%205/Cards/2407.webp' },
  { set: 'gem-vol-6', number: '1907/07', name: "Applin", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%206/Cards/1907.webp' },
  { set: 'gem-vol-7', number: '0307/07', name: "Misty's Psyduck", rarity: 'Triple Rare', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0307.webp' },
  { set: 'collect-151-journey', number: '170/151', name: "Pikachu", rarity: 'Art Rare (AR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0170.webp' },
  { set: 'collect-151-hope', number: '171/151', name: "Pikachu", rarity: 'Art Rare (AR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0171.webp' },
  { set: 'collect-151-surprise', number: '172/151', name: "Pikachu", rarity: 'Art Rare (AR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0172.webp' },
  { set: 'collect-151-surprise', number: '189/151', name: "Alakazam ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0189.webp' },
  { set: 'collect-151-surprise', number: '191/151', name: "Mew ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0191.webp' },
  { set: 'collect-151-gathering', number: '173/151', name: "Pikachu", rarity: 'Art Rare (AR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0173.webp' },
  { set: 'collect-151-gathering', number: '190/151', name: "Zapdos ex", rarity: 'Special Art Rare (SAR)', image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0190.webp' },
]
