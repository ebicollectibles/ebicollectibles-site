import { Zh } from '~/components/blog/Zh'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === '30th-celebration-pikachu-cards-artists')!

const asset = (name: string) => `${SITE_URL}/assets/blog/pikachu-30-artists-${name}.webp`
/** The English card scan, by English set number (23 to 52). */
const img = (no: number) => asset(`en-${String(no).padStart(3, '0')}`)

interface Move {
  /** 'Ability' for an Ability; attacks leave this out */
  kind?: 'Ability'
  name: string
  /** Damage as printed, e.g. "20", "40×" or "10+" */
  damage?: string
  /** Effect text as printed */
  text?: string
}

interface PikachuCard {
  /** English set number, out of 128 */
  no: number
  illus: string
  hp: number
  moves: Move[]
  /** Checked facts about the artist, each with its source in the Sources list */
  bio: ReactNode
}

// The 30 Pikachu in the English 30th Celebration set (30C), 023/128 to 052/128.
// Each card also carries a Pikachu badge from 01/30 to 30/30. Illustrator, HP,
// Abilities and attacks are from TCGdex's English card data
// (api.tcgdex.net/v2/en/cards/30th-023 and so on). Card counts are from TCGdex's
// illustrator data, checked November 24, 2026: physical TCG cards only (sets in
// the "Pokémon TCG Pocket" series left out), promos and reprints included.
// "Earliest expansion" is the oldest set among those credits by TCGdex's
// release date, leaving out promo sets, McDonald's Collections and trainer kits.
// Do not add descriptions of the artwork here unless an official source gives them.
const PIKACHU: PikachuCard[] = [
  {
    no: 23,
    illus: 'Ken Sugimori',
    hp: 70,
    moves: [{ name: 'Thunder Shock', damage: '20', text: "Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed." }],
    bio: (
      <>
        Pokémon's "Creators of Pikachu" profile calls Sugimori one of the founding members of GAME FREAK, in charge of the
        official character design for Pokémon Red and Pokémon Green. TCGdex credits him on 1,119 English cards, going back to Base
        Set (1999). One of them is the Jungle Pikachu, 60/64, from 1999.
      </>
    ),
  },
  {
    no: 24,
    illus: 'danciao',
    hp: 70,
    moves: [{ name: 'Volt Tackle', damage: '80', text: 'This Pokémon also does 30 damage to itself.' }],
    bio: (
      <>
        TCGdex credits danciao on 17 English cards, going back to Twilight Masquerade (2024). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 25,
    illus: 'satoma',
    hp: 70,
    moves: [
      {
        name: 'Spark',
        damage: '20',
        text: "This attack also does 20 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
      },
    ],
    bio: <>TCGdex credits satoma on 31 English cards, going back to Obsidian Flames (2023). This is the only Pikachu among them.</>,
  },
  {
    no: 26,
    illus: 'Takeshi Nakamura',
    hp: 70,
    moves: [{ name: 'Peer At', text: 'Your opponent reveals their hand.' }],
    bio: (
      <>
        TCGdex credits Takeshi Nakamura on 30 English cards, going back to Obsidian Flames (2023). This is the only Pikachu among
        them.
      </>
    ),
  },
  {
    no: 27,
    illus: 'Asako Ito',
    hp: 80,
    moves: [{ name: 'Nap', text: 'Heal 30 damage from this Pokémon.' }],
    bio: (
      <>
        TheGamer reports that Asako Ito crochets Pokémon in the amigurumi style for her card art. TCGdex credits her on 37 English cards, going back to Poliwag in Sun &amp; Moon (2017). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 28,
    illus: 'sowsow',
    hp: 60,
    moves: [
      {
        kind: 'Ability',
        name: 'Lonely Gaze',
        text: "As long as this Pokémon is in the Active Spot, attacks used by your opponent's Active Pokémon do 20 less damage (before applying Weakness and Resistance).",
      },
      { name: 'Pika Ball', damage: '20' },
    ],
    bio: <>TCGdex credits sowsow on 112 English cards, going back to Forbidden Light (2018). This is the only Pikachu among them.</>,
  },
  {
    no: 29,
    illus: 'James Turner',
    hp: 60,
    moves: [
      {
        name: 'Find a Friend',
        text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.',
      },
    ],
    bio: (
      <>
        At GAME FREAK, Turner designed Pokémon including Vanillite, Golett, Vullaby and Phantump, and was art director on Pokémon
        Sword and Shield. He left in 2022 and co-founded All Possible Futures, the studio behind The Plucky Squire. In August 2026
        he announced a new role as Creative Director of Pokémon Art and Design at The Pokémon Company International (Video Games
        Chronicle, Nintendo Life). TCGdex credits him on 6 English cards, the earliest Pansear in Next Destinies (2012).
      </>
    ),
  },
  {
    no: 30,
    illus: 'DOM',
    hp: 60,
    moves: [{ name: 'Mach Bolt', damage: '30' }],
    bio: (
      <>
        TCGdex credits DOM on 50 English cards, going back to Brilliant Stars (2022). They include two earlier Pikachu promos, SVP
        225 and MEP 093.
      </>
    ),
  },
  {
    no: 31,
    illus: 'Atsushi Furusawa',
    hp: 50,
    moves: [{ name: 'Gnaw', damage: '10' }],
    bio: (
      <>
        Pokémon.com's roundup of Sword &amp; Shield artist debuts says Furusawa first appeared with a Lapras in Chilling Reign. It
        singles out his Lost Origin Trainer Gallery card, "featuring a Pikachu napping with its Trainer beneath a tree." TCGdex
        lists that card as TG05 and credits him on 55 English cards in all.
      </>
    ),
  },
  {
    no: 32,
    illus: 'Tomokazu Komiya',
    hp: 50,
    moves: [{ name: 'Scurry About', text: 'Switch this Pokémon with 1 of your Benched Pokémon.' }],
    bio: (
      <>
        In a conversation published for the Pokémon TCG Illustration Contest 2022, where he was a judge, Komiya said he started
        working on the Pokémon TCG in 1996, at the age of 25. The same page says he has also worked on Pokémon Center merchandise.
        TCGdex credits him on 254 English cards, going back to Neo Genesis (2000). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 33,
    illus: 'Narumi Sato',
    hp: 60,
    moves: [
      {
        kind: 'Ability',
        name: 'Keep Hidden',
        text: "As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks from your opponent's Pokémon done to this Pokémon.",
      },
      { name: 'Tiny Charge', damage: '10' },
    ],
    bio: (
      <>
        Pokémon.com says Narumi Sato took second place in the first Pokémon Card Game Illustration Grand Prix, run by Creatures
        Inc. in 2019, and that her first card came out in Shining Fates. TCGdex credits her on 52 English cards, including a
        Pikachu in Pokémon GO (028, 2022).
      </>
    ),
  },
  {
    no: 34,
    illus: 'USGMEN',
    hp: 70,
    moves: [
      {
        name: 'Pika Chain',
        damage: '40×',
        text: 'This attack does 40 damage for each of your Pikachu and Pikachu ex in play.',
      },
    ],
    bio: (
      <>
        Pokémon.com's 2023 artist debuts article says USGMEN was already known on social media before joining the TCG, with "a
        pair of dots for eyes and a straight line forming the face" as their biggest motif. Their first card was the Mew ex Special
        Illustration Rare in Paldean Fates (232). TCGdex credits USGMEN on 6 English cards.
      </>
    ),
  },
  {
    no: 35,
    illus: 'Susumu Maeya',
    hp: 60,
    moves: [{ name: 'Rollout', damage: '30' }],
    bio: (
      <>
        TCGdex credits Susumu Maeya on 19 English cards, going back to Temporal Forces (2024). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 36,
    illus: 'OKACHEKE',
    hp: 70,
    moves: [{ name: 'Slight Intrusion', damage: '40', text: 'This Pokémon also does 10 damage to itself.' }],
    bio: (
      <>
        OKACHEKE's first cards came out in Chilling Reign, according to Pokémon.com, and he was one of the TCG artists invited to
        the 2025 Pokémon World Championships. Pokémon's set announcement revealed this Pikachu together with the ones by Yuu Nishida
        and Atsuko Nishida. TCGdex credits
        him on 72 English cards, including Pikachu in Paldea Evolved (062) and Paldean Fates (018).
      </>
    ),
  },
  {
    no: 37,
    illus: 'Yuu Nishida',
    hp: 70,
    moves: [
      {
        name: 'Energized Tail',
        text: 'Search your deck for an Energy card, reveal it, and put it into your hand. Then, shuffle your deck.',
      },
      { name: 'Pika Punch', damage: '30' },
    ],
    bio: (
      <>
        One of the three Pikachu shown in Pokémon's set announcement, with the ones by OKACHEKE and Atsuko Nishida. TCGdex credits
        Yuu Nishida on 77 English cards, going back to Shining Fates (2021), including a Pikachu in Paldean Fates (131).
      </>
    ),
  },
  {
    no: 38,
    illus: 'Tetsu Kayama',
    hp: 60,
    moves: [
      {
        name: 'Targeted Spark',
        text: "This attack does 20 damage to 1 of your opponent's Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
      },
    ],
    bio: (
      <>
        Pokémon.com's 2023 artist debuts article says Tetsu Kayama debuted in Obsidian Flames with Lunatone and Solrock, and
        describes a "pointillism-like dotted style" across Kayama's cards. TCGdex credits Tetsu Kayama on 29 English cards.
      </>
    ),
  },
  {
    no: 39,
    illus: 'Teeziro',
    hp: 70,
    moves: [
      {
        name: 'Iron Tail',
        damage: '20×',
        text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.',
      },
    ],
    bio: (
      <>
        Pokémon.com says Teeziro debuted in Chilling Reign and drew two Trainer Gallery cards in Silver Tempest. TCGdex credits
        Teeziro on 95 English cards. This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 40,
    illus: 'Shinji Kanda',
    hp: 80,
    moves: [
      {
        name: 'Overwriting Bolt',
        damage: '10',
        text: "The Defending Pokémon's Weakness is now Lightning until the end of your next turn. (Apply Weakness as ×2.)",
      },
    ],
    bio: (
      <>
        Shinji Kanda's first card came out in Brilliant Stars, according to Pokémon.com, which singles out the Giratina and Ariados
        from Lost Origin. TCGdex credits Kanda on 32 English cards. This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 41,
    illus: 'Rianti Hidayat',
    hp: 60,
    moves: [
      { name: 'Hang Down', damage: '10' },
      { name: 'Zap Kick', damage: '40' },
    ],
    bio: (
      <>
        TCGdex credits Rianti Hidayat on 12 English cards, going back to Brilliant Stars (2022). This is the only Pikachu among
        them.
      </>
    ),
  },
  {
    no: 42,
    illus: 'Akira Komayama',
    hp: 60,
    moves: [
      {
        name: 'Charge-Up Dash',
        text: 'Flip a coin until you get tails. Search your deck for an amount of Basic Lightning Energy up to the number of heads and attach it to this Pokémon. Then, shuffle your deck.',
      },
      { name: 'Pika Bolt', damage: '50' },
    ],
    bio: (
      <>
        TCGdex credits Akira Komayama on 259 English cards, going back to Call of Legends (2011). They include a Pikachu in Next
        Destinies (39, 2012) and the promo SM206.
      </>
    ),
  },
  {
    no: 43,
    illus: 'OOYAMA',
    hp: 70,
    moves: [{ name: 'Tropical Vibes', text: 'This Pokémon is now Asleep. Draw cards until you have 6 cards in your hand.' }],
    bio: <>TCGdex credits OOYAMA on 27 English cards, going back to BREAKpoint (2016). This is the only Pikachu among them.</>,
  },
  {
    no: 44,
    illus: 'akagi',
    hp: 60,
    moves: [
      {
        name: 'Agility',
        damage: '10',
        text: "Flip a coin. If heads, during your opponent's next turn, prevent all damage from and effects of attacks done to this Pokémon.",
      },
    ],
    bio: <>TCGdex credits akagi on 33 English cards, going back to Paldean Fates (2024). This is the only Pikachu among them.</>,
  },
  {
    no: 45,
    illus: 'Naoyo Kimura',
    hp: 60,
    moves: [
      { name: 'Nighttime Stroll', text: 'Draw a card.' },
      { name: 'Static Shock', damage: '20' },
    ],
    bio: (
      <>
        TCGdex credits Naoyo Kimura on 268 English cards, going back to Neo Genesis (2000). They include Pikachu in Neo Genesis
        (70, 2000), Cosmic Eclipse (66, 2019) and 151 (025, 2023).
      </>
    ),
  },
  {
    no: 46,
    illus: 'svlt',
    hp: 60,
    moves: [
      { name: 'Get Some Air', text: 'This Pokémon recovers from all Special Conditions.' },
      { name: 'Smash Kick', damage: '20' },
    ],
    bio: <>TCGdex credits svlt on 11 English cards, going back to Stellar Crown (2024). This is the only Pikachu among them.</>,
  },
  {
    no: 47,
    illus: 'Atsuko Nishida',
    hp: 70,
    moves: [{ name: 'Play Rough', damage: '10+', text: 'Flip a coin. If heads, this attack does 20 more damage.' }],
    bio: (
      <>
        Nishida was a character designer for Pokémon Red and Pokémon Green. In Pokémon's "Creators of Pikachu" profile she says, "I
        designed Pikachu and Raichu," and Sugimori says she also designed Bulbasaur, Charmander and Squirtle. This Pikachu was one
        of the three shown in Pokémon's set announcement. TCGdex credits her on 419 English cards, going back to Team Rocket (2000),
        including Pikachu in Expedition (124, 2002) and Generations (26, 2016).
      </>
    ),
  },
  {
    no: 48,
    illus: 'KIYOTAKA OSHIYAMA',
    hp: 70,
    moves: [{ name: 'Store Up', text: 'Put up to 2 Basic Energy cards from your discard pile into your hand.' }],
    bio: (
      <>
        Pokémon.com says KIYOTAKA OSHIYAMA debuted in Battle Styles. TCGdex credits him on 31 English cards, going back to Rapid
        Strike Urshifu VMAX in that set (2021). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 49,
    illus: 'Nurikabe',
    hp: 80,
    moves: [
      {
        name: 'Fighting Lightning',
        damage: '20+',
        text: "If your opponent's Active Pokémon is a Pokémon ex, this attack does 80 more damage.",
      },
    ],
    bio: <>TCGdex credits Nurikabe on 25 English cards, going back to Brilliant Stars (2022). This is the only Pikachu among them.</>,
  },
  {
    no: 50,
    illus: 'Shimaris Yukichi',
    hp: 80,
    moves: [{ name: 'Satisfied Spark', damage: '100' }],
    bio: (
      <>
        Shimaris Yukichi was one of the TCG artists invited to the 2025 Pokémon World Championships. TCGdex credits Shimaris
        Yukichi on 26 English cards, going back to Temporal Forces (2024). This is the only Pikachu among them.
      </>
    ),
  },
  {
    no: 51,
    illus: 'nagimiso',
    hp: 70,
    moves: [
      {
        name: 'Lightning Crash',
        text: "Discard all Lightning Energy from this Pokémon, and this attack does 90 damage to 1 of your opponent's Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
      },
    ],
    bio: (
      <>
        TCGdex credits nagimiso on 166 English cards, going back to Double Crisis (2015), including a Pikachu in Unbroken Bonds (54,
        2019).
      </>
    ),
  },
  {
    no: 52,
    illus: 'Kazuki Minami',
    hp: 70,
    moves: [
      {
        name: 'Angry Bolt',
        damage: '10+',
        text: 'This attack does 10 more damage for each damage counter on this Pokémon.',
      },
    ],
    bio: (
      <>
        Kazuki Minami won the grand prize in the Pokémon TCG Illustration Contest 2024 with a Pikachu, which Pokémon describes as
        "unwinding with a yawn and stretch on a bright sunny day." The winning art was released as a promo card, listed by TCGdex
        as Pikachu SVP 214. TCGdex credits Minami on 4 English cards in all.
      </>
    ),
  },
]

/** The card's place in the run of 30, from its English number. */
const of30 = (no: number) => String(no - 22).padStart(2, '0')
const num = (no: number) => String(no).padStart(3, '0')

const GROUPS = [
  { id: 'cards-01-10', label: 'Pikachu 01/30 to 10/30', from: 23, to: 32 },
  { id: 'cards-11-20', label: 'Pikachu 11/30 to 20/30', from: 33, to: 42 },
  { id: 'cards-21-30', label: 'Pikachu 21/30 to 30/30', from: 43, to: 52 },
]

// How the 30 Pikachu are numbered in each language. Checked against the
// official card databases where one exists, and printed card scans otherwise.
const LANGUAGES: { lang: ReactNode; name: ReactNode; code: string; nos: string }[] = [
  { lang: 'English', name: '30th Celebration', code: '30C', nos: '023–052/128' },
  { lang: 'French, German, Italian, Spanish, Portuguese', name: 'Translated in each language', code: '30C', nos: '023–052/128' },
  {
    lang: 'Japanese',
    name: <span lang="ja">拡張パック「30th CELEBRATION」</span>,
    code: 'M6a',
    nos: '017–046/103',
  },
  { lang: 'Korean', name: <span lang="ko">MEGA 확장팩 「30th CELEBRATION」</span>, code: 'M6a', nos: '017–046/103' },
  {
    lang: 'Traditional Chinese (Taiwan and Hong Kong)',
    name: <span lang="zh-Hant">擴充包「30th CELEBRATION」</span>,
    code: 'M6a',
    nos: '017–046/103',
  },
  { lang: 'Simplified Chinese (mainland China)', name: <Zh>30周年庆典</Zh>, code: '30thC', nos: '017–046/103' },
  { lang: 'Thai', name: <span lang="th">การ์ดชุดเสริม "30th CELEBRATION"</span>, code: 'MA6', nos: '023–052/130' },
  { lang: 'Indonesian', name: <span lang="id">Booster Pack "30th CELEBRATION"</span>, code: 'MA6', nos: '023–052/130' },
]

// The Ken Sugimori Pikachu (01/30) in four of those languages.
const COMPARE = [
  { src: img(23), lang: 'English', no: '023/128', w: 400, h: 550 },
  { src: asset('ja-017'), lang: 'Japanese', no: '017/103', w: 400, h: 559 },
  { src: asset('zh-hant-017'), lang: 'Traditional Chinese', no: '017/103', w: 400, h: 559 },
  { src: asset('017'), lang: 'Simplified Chinese', no: '017/103', w: 300, h: 419 },
  { src: asset('th-023'), lang: 'Thai', no: '023/130', w: 400, h: 559 },
]

const TOC = [
  { id: 'about', label: 'How the 30 Pikachu work' },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label })),
  { id: 'languages', label: 'One Pikachu, 12 languages' },
  { id: 'gold', label: 'The gold Pikachu cards in Shanghai' },
  { id: 'at-ebi', label: 'The Chinese version at EBI Collectibles' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources' },
]

const FAQ = [
  {
    q: 'How many Pikachu cards are in 30th Celebration?',
    a: '30, each drawn by a different artist. In the English set they are numbered 023/128 to 052/128, and each card also has a Pikachu badge showing its place in the run, from 01/30 to 30/30.',
  },
  {
    q: 'Is there a Pikachu in every pack?',
    a: 'Yes. Pokémon says every 30th Celebration booster pack has one of the 30 Pikachu cards, and that every card in the set is foil.',
  },
  {
    q: 'Who drew the 30 Pikachu cards?',
    a: '30 different illustrators, one per card. They include Ken Sugimori, a founding member of GAME FREAK; Atsuko Nishida, who designed Pikachu for Pokémon Red and Pokémon Green; Tomokazu Komiya, who has drawn for the Pokémon TCG since 1996; and James Turner, who designed Pokémon at GAME FREAK and is now Creative Director of Pokémon Art and Design at The Pokémon Company International.',
  },
  {
    q: 'Which Pikachu is 01/30?',
    a: "Ken Sugimori's, numbered 023/128 in English. It has 70 HP and the attack Thunder Shock. TCGdex also credits Sugimori with the Jungle Pikachu, 60/64, from 1999.",
  },
  {
    q: 'Where is the artist name on the card?',
    a: 'At the bottom left, after "Illus.", just above the set code and card number.',
  },
  {
    q: 'What rarity are the 30 Pikachu?',
    a: 'They have their own rarity, Pikachu Rare.',
  },
  {
    q: 'What languages was 30th Celebration printed in?',
    a: '12: English, French, German, Italian, Spanish, Portuguese, Japanese, Korean, Traditional Chinese, Simplified Chinese, Thai and Indonesian. It launched worldwide on September 16, 2026. Pokémon says it is the first Pokémon TCG expansion to have a simultaneous global release.',
  },
  {
    q: 'Are the Pikachu the same in every language?',
    a: 'The 30 illustrations and artists are the same, and so is the 01/30 to 30/30 badge. The set number changes: 023 to 052/128 in English and the other European languages, 017 to 046/103 in Japanese, Korean and Chinese, and 023 to 052/130 in Thai and Indonesian.',
  },
]

const SOURCES: { label: string; href: string }[] = [
  { label: 'TCGdex English card data (card text, illustrators and card counts)', href: 'https://api.tcgdex.net/v2/en/cards/30th-023' },
  { label: 'TCGdex illustrator data', href: 'https://api.tcgdex.net/v2/en/illustrators' },
  { label: 'Pokémon.com: Get Ready for Pokémon TCG: 30th Celebration', href: 'https://www.pokemon.com/us/news/get-ready-for-pokemon-tcg-30th-celebration' },
  {
    label: 'Pokémon.com: Look at Electrifying Pikachu Cards from Pokémon TCG: 30th Celebration',
    href: 'https://www.pokemon.com/us/news/look-at-electrifying-pikachu-cards-from-pokemon-tcg-30th-celebration',
  },
  { label: 'Pokémon.com: Creator Profile: The Creators of Pikachu', href: 'https://www.pokemon.com/us/news/creator-profile-the-creators-of-pikachu' },
  { label: 'Pokémon.com: Pokémon TCG: Sword & Shield Series Artist Debuts', href: 'https://www.pokemon.com/us/news/pokemon-tcg-sword-shield-series-artist-debuts' },
  { label: 'Pokémon.com: Pokémon TCG: Scarlet & Violet 2023 Artist Debuts', href: 'https://www.pokemon.com/us/news/pokemon-tcg-scarlet-violet-2023-artist-debuts' },
  {
    label: 'Pokémon.com: Pokémon Trading Card Game Illustration Contest 2024 Winners Promo Cards',
    href: 'https://www.pokemon.com/us/pokemon-news/pokemon-trading-card-game-illustration-contest-2024-winners-promo-cards',
  },
  {
    label: 'Pokémon TCG Illustration Contest 2022: a conversation with Kouki Saitou and Tomokazu Komiya',
    href: 'https://ptcgic-cr.com/2022/en/column/article-6/',
  },
  { label: '2025 Pokémon World Championships: Special Guests', href: 'https://worlds.2025.pokemon.com/en-us/experience/special-guests/' },
  {
    label: 'Video Games Chronicle: James Turner has rejoined the franchise',
    href: 'https://videogameschronicle.com/news/james-turner-the-first-westerner-to-design-a-pokemon-has-rejoined-the-franchise/',
  },
  {
    label: 'Nintendo Life: James Turner starts new role at The Pokémon Company International',
    href: 'https://www.nintendolife.com/news/2026/08/pokemon-artist-and-plucky-squire-dev-james-turner-starts-new-role-at-the-pokemon-company-international',
  },
  { label: 'TheGamer: Asako Ito’s crochet designs', href: 'https://www.thegamer.com/pokemon-tcg-asako-ito-crochet-designs/' },
  { label: 'Pokémon Card Game official card search (Japanese)', href: 'https://www.pokemon-card.com/' },
  { label: 'Pokémon TCG Asia official card search (Traditional Chinese, Thai, Indonesian)', href: 'https://asia.pokemon-card.com/' },
  { label: 'Pokémon Card Game official site (Korean)', href: 'https://pokemoncard.co.kr/' },
  { label: 'Pokémon China official site (Simplified Chinese)', href: 'https://www.pokemon.cn/' },
]

export const Route = createFileRoute('/blog/30th-celebration-pikachu-cards-artists')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: blogShareImage(post) },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: blogShareImage(post) },
      { name: 'twitter:image:alt', content: post.heroAlt },
      { property: 'article:published_time', content: post.date },
      ...(loaderData?.liveAt ? [{ property: 'article:modified_time', content: loaderData.liveAt.slice(0, 10) }] : []),
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: PikachuArtistsPost,
})

function PikachuArtistsPost() {
  const status = Route.useLoaderData()
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: status.liveAt?.slice(0, 10) ?? post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EBI Collectibles',
      url: BLOG_SITE_URL,
      logo: { '@type': 'ImageObject', url: `${BLOG_SITE_URL}/assets/ebi-logo.jpg`, width: 240, height: 240 },
    },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The 30 Pikachu cards in Pokémon TCG 30th Celebration',
    numberOfItems: PIKACHU.length,
    itemListElement: PIKACHU.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Pikachu ${num(c.no)}/128 (${of30(c.no)}/30), illustrated by ${c.illus}`,
      image: img(c.no),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(listJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Every 30th Celebration booster pack has one of 30 Pikachu cards, and each of the 30 was drawn by a different artist. Here is every one, with its numbers, its attacks and who drew it."
        cta={{
          heading: 'Shop 30th Celebration',
          body: 'The Simplified Chinese booster box, the Dream Painting Pikachu figures and the Pikachu 30th plush keychains.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-30th-celebration-booster-box' }, label: 'Shop the booster box' },
            { to: '/blog/30th-celebration-set-guide', label: 'Read the 30th Celebration set guide', variant: 'ghost' },
          ],
        }}
      >
        <p>
          30th Celebration launched on September 16, 2026. Pokémon says it is the first Pokémon TCG expansion to have a simultaneous
          global release, that every card in it is foil, and that every booster pack has one of 30 Pikachu cards, each with a
          different illustration.
        </p>
        <p>
          The 30 artists include Ken Sugimori, a founding member of GAME FREAK, and Atsuko Nishida, who designed Pikachu for Pokémon
          Red and Pokémon Green. Tomokazu Komiya has drawn for the Pokémon TCG since 1996, James Turner designed Pokémon at GAME
          FREAK, and Kazuki Minami won the Pokémon TCG Illustration Contest 2024 with a Pikachu.
        </p>

        <nav className="toc" aria-label="In this article">
          <p className="toc-title">In this article</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="about">How the 30 Pikachu work</h2>
        <p>
          In the English set, the 30 Pikachu are cards 023/128 to 052/128, set code 30C. Right next to the number, each one has a
          small Pikachu badge showing its place in the run, from 01/30 to 30/30. Their rarity is Pikachu Rare, and the artist's
          name is printed at the bottom left, after "Illus.".
        </p>
        <p>
          Each card below shows its HP, Abilities and attacks as printed on the English card, then a note on the artist. Card counts
          come from TCGdex's English card database, checked on November 24, 2026. They count Pokémon TCG cards only, not Pokémon TCG
          Pocket, and include promos and reprints. The set named after "going back to" is the earliest expansion among those cards,
          not counting promos.
        </p>

        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={g.id}>
            <h2 id={g.id}>{g.label}</h2>
            <ol className="artist-list">
              {PIKACHU.filter((c) => c.no >= g.from && c.no <= g.to).map((c) => (
                <li key={c.no}>
                  <img
                    src={img(c.no)}
                    alt={`Pikachu ${num(c.no)}/128 (${of30(c.no)}/30) from 30th Celebration, illustrated by ${c.illus}`}
                    loading="lazy"
                    width={400}
                    height={550}
                  />
                  <div>
                    <h3>{c.illus}</h3>
                    <p className="artist-num">
                      Pikachu {of30(c.no)}/30 · {num(c.no)}/128 · {c.hp} HP
                    </p>
                    <p>
                      {c.moves.map((m, i) => (
                        <span key={m.name}>
                          {i > 0 && <br />}
                          <strong>
                            {m.kind === 'Ability' ? `Ability: ${m.name}` : m.name}
                            {m.damage ? ` · ${m.damage} damage` : ''}
                          </strong>
                          {m.text ? `. ${m.text}` : ''}
                        </span>
                      ))}
                    </p>
                    <p>{c.bio}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <h2 id="languages">One Pikachu, 12 languages</h2>
        <p>
          30th Celebration was printed in 12 languages: English, French, German, Italian, Spanish, Portuguese, Japanese, Korean,
          Traditional Chinese, Simplified Chinese, Thai and Indonesian. The 30 illustrations, the 30 artists and the 01/30 to 30/30
          badge are the same in all of them. The set number is what changes.
        </p>
        <p>
          In Japanese, Korean, Traditional Chinese and Simplified Chinese, the 30 Pikachu are 017 to 046, out of 103. In English and
          the five other European languages they are 023 to 052, out of 128, and in Thai and Indonesian 023 to 052, out of 130. The
          European numbers are from TCGdex's French, German, Italian, Spanish and Portuguese card data, and each of those
          languages uses its own translated set name.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-languages" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-languages" className="sr-only">
              How the 30 Pikachu are numbered in each language of 30th Celebration
            </caption>
            <thead>
              <tr>
                <th scope="col">Language</th>
                <th scope="col">Set name</th>
                <th scope="col">Code on the card</th>
                <th scope="col">The 30 Pikachu</th>
              </tr>
            </thead>
            <tbody>
              {LANGUAGES.map((l) => (
                <tr key={l.code + l.nos + String(l.lang)}>
                  <th scope="row">{l.lang}</th>
                  <td>{l.name}</td>
                  <td>{l.code}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.nos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Here is the Ken Sugimori Pikachu, 01/30, in five of those languages:</p>
        <ul className="card-grid">
          {COMPARE.map((c) => (
            <li key={c.lang}>
              <figure>
                <img
                  src={c.src}
                  alt={`Pikachu ${c.no} (01/30) by Ken Sugimori from the ${c.lang} 30th Celebration set`}
                  loading="lazy"
                  width={c.w}
                  height={c.h}
                  style={{ aspectRatio: `${c.w} / ${c.h}`, background: 'transparent', boxShadow: 'none' }}
                />
                <figcaption>
                  <strong>{c.lang}</strong>
                  {c.no}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <h2 id="gold">The gold Pikachu cards in Shanghai</h2>
        <p>
          Pokémon China is showing 30 pure gold cards at its 30th Anniversary Shanghai Finale, from November 28, 2026 to January 3,
          2027. Read more in our{' '}
          <Link to="/blog/pokemon-30th-shanghai-gold-pikachu-cards-news">gold cards news post</Link>.
        </p>

        <h2 id="at-ebi">The Chinese version at EBI Collectibles</h2>
        <p>
          We carry the Simplified Chinese printing, <Zh>30周年庆典</Zh>. Same 30 Pikachu, same artists, numbered 017 to 046/103, and
          every pack has one. You will find the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-30th-celebration-booster-box' }}>
            30th Celebration booster box
          </Link>
          , the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-figures-blind-box' }}>
            Dream Painting Pikachu figures
          </Link>{' '}
          and the{' '}
          <Link to="/products/$id" params={{ id: 'pokemon-chinese-pikachu-30th-celebration-plush-keychain' }}>
            Pikachu 30th plush keychains
          </Link>{' '}
          in the shop.
        </p>
        <p>More on 30th Celebration:</p>
        <ul>
          <li>
            <Link to="/blog/30th-celebration-set-guide">30th Celebration set guide</Link>
          </li>
          <li>
            <Link to="/blog/30th-celebration-release-news">30th Celebration release news</Link>
          </li>
          <li>
            <Link to="/blog/30th-celebration-card-origins">Where every 30th Celebration classic card comes from</Link>
          </li>
          <li>
            <Link to="/blog/japanese-30th-celebration-release-news">The Japanese 30th Celebration set</Link>
          </li>
          <li>
            <Link to="/blog/pikachu-dream-painting-figures-release-news">Dream Painting Pikachu figures: all 12 and the secret</Link>
          </li>
        </ul>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2 id="sources">Sources</h2>
        <ul>
          {SOURCES.map((src) => (
            <li key={src.href}>
              <a href={src.href}>{src.label}</a>
            </li>
          ))}
        </ul>
      </BlogPostLayout>
    </>
  )
}
