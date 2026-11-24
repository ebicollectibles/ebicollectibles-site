// Example cards for each rarity in the rarities post, copied from the set data files.
// chinese-rarities.test.ts checks every entry against its set file.

export interface RarityExample {
  group: string
  file: string
  number: string
  name: string
  rarity: string
  image: string
}

export const RARITY_EXAMPLES: RarityExample[] = [
  { group: 'C', file: 'csv2', number: '053/128', name: "Ralts", rarity: "Common (C)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0053.webp' },
  { group: 'C', file: 'csv7', number: '064/204', name: "Froakie", rarity: "Common (C)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0064.webp' },
  { group: 'C', file: 'collect-151', number: '025/151', name: "Pikachu", rarity: "Common (C)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0025.webp' },
  { group: 'U', file: 'csv2', number: '118/128', name: "Erika's Invitation", rarity: "Uncommon (U)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0118.webp' },
  { group: 'U', file: 'csv2', number: '121/128', name: "Clavell", rarity: "Uncommon (U)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0121.webp' },
  { group: 'U', file: 'csv10', number: '001/222', name: "Ethan's Pinsir", rarity: "Uncommon (U)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Chasing%20Glory/Cards/0001.webp' },
  { group: 'R', file: 'collect-151', number: '150/151', name: "Mewtwo", rarity: "Rare (R)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0150.webp' },
  { group: 'R', file: 'csv10', number: '005/222', name: "Cynthia's Roserade", rarity: "Rare (R)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Chasing%20Glory/Cards/0005.webp' },
  { group: 'R', file: '30th-celebration', number: '056/103', name: "Mew", rarity: "Rare (R)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0056.webp' },
  { group: 'RR', file: 'csv2', number: '055/128', name: "Gardevoir ex", rarity: "Double Rare (RR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0055.webp' },
  { group: 'RR', file: 'csv7', number: '123/204', name: "Greninja ex", rarity: "Double Rare (RR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0123.webp' },
  { group: 'RR', file: 'csv4', number: '089/129', name: "Gholdengo ex", rarity: "Double Rare (RR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0089.webp' },
  { group: 'AR', file: 'csv2', number: '132/128', name: "Ralts", rarity: "Art Rare (AR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0132.webp' },
  { group: 'AR', file: 'csv2', number: '133/128', name: "Kirlia", rarity: "Art Rare (AR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0133.webp' },
  { group: 'AR', file: 'collect-151', number: '170/151', name: "Pikachu", rarity: "Art Rare (AR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0170.webp' },
  { group: 'SR', file: 'csv2', number: '140/128', name: "Gardevoir ex", rarity: "Super Rare (SR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0140.webp' },
  { group: 'SR', file: 'csv7', number: '223/204', name: "Greninja ex", rarity: "Super Rare (SR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0223.webp' },
  { group: 'SR', file: 'csv4', number: '144/129', name: "Gholdengo ex", rarity: "Super Rare (SR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0144.webp' },
  { group: 'SAR', file: 'csv2', number: '155/128', name: "Gardevoir ex", rarity: "Special Art Rare (SAR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Miracle%20Journey%20CSV2/Cards/0155.webp' },
  { group: 'SAR', file: 'csv7', number: '242/204', name: "Greninja ex", rarity: "Special Art Rare (SAR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0242.webp' },
  { group: 'SAR', file: 'csv4', number: '156/129', name: "Gholdengo ex", rarity: "Special Art Rare (SAR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0156.webp' },
  { group: 'UR', file: 'csv4', number: '162/129', name: "Gholdengo ex", rarity: "Ultra Rare (UR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Reward%20Round%20CSV4/Cards/0162.webp' },
  { group: 'UR', file: 'collect-151', number: '192/151', name: "Mew ex", rarity: "Ultra Rare (UR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0192.webp' },
  { group: 'UR', file: 'csv7', number: '256/204', name: "Raging Bolt ex", rarity: "Ultra Rare (UR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0256.webp' },
  { group: 'ACE', file: 'csv7', number: '176/204', name: "Awakening Drum", rarity: "ACE SPEC Rare (ACE)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0176.webp' },
  { group: 'ACE', file: 'csv7', number: '181/204', name: "Master Ball", rarity: "ACE SPEC Rare (ACE)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0181.webp' },
  { group: 'ACE', file: 'csv7', number: '203/204', name: "Neo Upper Energy", rarity: "ACE SPEC Rare (ACE)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Blade%20Awakening/Cards/0203.webp' },
  { group: 'BWR', file: 'black-bolt', number: '174/086', name: "Zekrom ex", rarity: "Black White Rare (BWR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Black%20Bolt/Cards/0174.webp' },
  { group: 'BWR', file: 'white-flare', number: '174/086', name: "Reshiram ex", rarity: "Black White Rare (BWR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/White%20Flare/Cards/0174.webp' },
  { group: 'S', file: 'collect-151', number: '152/151', name: "Charmander", rarity: "Shiny (S)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0152.webp' },
  { group: 'S', file: 'collect-151', number: '155/151', name: "Raichu", rarity: "Shiny (S)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0155.webp' },
  { group: 'S', file: 'collect-151', number: '169/151', name: "Snorlax", rarity: "Shiny (S)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0169.webp' },
  { group: 'SSR', file: 'collect-151', number: '186/151', name: "Wigglytuff ex", rarity: "Shiny Super Rare (SSR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0186.webp' },
  { group: 'SSR', file: 'collect-151', number: '187/151', name: "Alakazam ex", rarity: "Shiny Super Rare (SSR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0187.webp' },
  { group: 'SSR', file: 'collect-151', number: '188/151', name: "Mew ex", rarity: "Shiny Super Rare (SSR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Collect%20151/Cards/0188.webp' },
  { group: 'PIKACHU', file: '30th-celebration', number: '017/103', name: "Pikachu", rarity: "Pikachu Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0017.webp' },
  { group: 'PIKACHU', file: '30th-celebration', number: '018/103', name: "Pikachu", rarity: "Pikachu Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0018.webp' },
  { group: 'PIKACHU', file: '30th-celebration', number: '019/103', name: "Pikachu", rarity: "Pikachu Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0019.webp' },
  { group: 'FUR', file: '30th-celebration', number: '134/103', name: "Mewtwo ex", rarity: "Futuristic Rare (FUR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0134.webp' },
  { group: 'FUR', file: '30th-celebration', number: '135/103', name: "Mew ex", rarity: "Futuristic Rare (FUR)", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/30th%20Celebration/Cards/0135.webp' },
  { group: 'GEM', file: 'gem-vol-7', number: '0301/07', name: "Misty's Psyduck", rarity: "Common", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0301.webp' },
  { group: 'GEM', file: 'gem-vol-7', number: '0303/07', name: "Misty's Psyduck", rarity: "Uncommon", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0303.webp' },
  { group: 'GEM', file: 'gem-vol-7', number: '0305/07', name: "Misty's Psyduck", rarity: "Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0305.webp' },
  { group: 'GEM', file: 'gem-vol-7', number: '0306/07', name: "Misty's Psyduck", rarity: "Double Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0306.webp' },
  { group: 'GEM', file: 'gem-vol-7', number: '0307/07', name: "Misty's Psyduck", rarity: "Triple Rare", image: 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev/Chinese/Gem%207/Cards/0307.webp' },
]
