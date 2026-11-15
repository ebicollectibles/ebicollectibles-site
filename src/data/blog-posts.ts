// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blogs/news
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'gem-vol-7-has-arrived' | 'black-bolt-white-flare-arrive' | 'gem-vol-7-card-origins' | 'gem-vol-6-has-arrived' | 'gem-vol-6-set-guide' | 'gem-vol-6-card-origins' | 'gem-vol-5-has-arrived' | 'gem-vol-5-set-guide' | 'gem-vol-5-card-origins' | 'gem-vol-4-has-arrived' | 'gem-vol-4-set-guide' | 'gem-vol-4-card-origins' | 'gem-vol-3-has-arrived' | 'gem-vol-3-set-guide' | 'gem-vol-3-card-origins' | 'gem-vol-2-has-arrived' | 'gem-vol-2-set-guide' | 'gem-vol-2-card-origins' | '30th-celebration-has-arrived' | '30th-celebration-set-guide' | '30th-celebration-card-origins' | 'chasing-glory-has-arrived' | 'chasing-glory-set-guide' | 'chasing-glory-card-origins' | 'terastal-gathering-has-arrived' | 'terastal-gathering-set-guide' | 'terastal-gathering-card-origins' | 'reward-round-has-arrived' | 'reward-round-set-guide' | 'reward-round-card-origins' | 'black-crystal-blaze-has-arrived' | 'black-crystal-blaze-set-guide' | 'black-crystal-blaze-card-origins'

export interface BlogPostSummary {
  slug: BlogPostSlug
  path: `/blogs/news/${BlogPostSlug}`
  title: string
  excerpt: string
  tag: string
  date: string // ISO date
  heroImage: string
  heroAlt: string
  glow1: string
  glow2: string
}

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    slug: 'black-crystal-blaze-has-arrived',
    path: '/blogs/news/black-crystal-blaze-has-arrived',
    title: 'Black Crystal Blaze Is Here: Darkness Tera Charizard ex and a Chinese-Only Larry SAR',
    excerpt:
      'The fifth Chinese Scarlet & Violet set puts Darkness Tera Charizard ex on the pack, with a Larry Special Art Rare and a gold Defiance Band you can only pull in Simplified Chinese.',
    tag: 'New release',
    date: '2025-09-12',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-release-hero-v3.webp`,
    heroAlt: 'Black Crystal Blaze slim and jumbo booster packs with the Charizard ex Special Art Rare in front',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'black-crystal-blaze-set-guide',
    path: '/blogs/news/black-crystal-blaze-set-guide',
    title: 'Black Crystal Blaze Set Guide: Slim vs Jumbo, Every Chase Card and the Charizard Run',
    excerpt:
      'Slim box or jumbo box, every Ultra Rare, Special Art Rare, Super Rare and Art Rare, each Pokémon ex at every rarity, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-guide-hero-v3.webp`,
    heroAlt: 'The Charizard ex Special Art Rare in an EBI display case above six Black Crystal Blaze Special Art Rares',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'black-crystal-blaze-card-origins',
    path: '/blogs/news/black-crystal-blaze-card-origins',
    title: 'Where Every Black Crystal Blaze Card Comes From',
    excerpt:
      'All 164 cards matched to English: 73 from Paradox Rift, 61 from Obsidian Flames, 18 from Paldean Fates, 10 from five other sources and 2 new.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-origins-hero-v3.webp`,
    heroAlt: 'Black Crystal Blaze pack linked to tiles for Paradox Rift, Obsidian Flames, Paldean Fates, other sources and new art',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'reward-round-has-arrived',
    path: '/blogs/news/reward-round-has-arrived',
    title: 'Reward Round Is Here: Gold Gholdengo and Two Chinese-Only SARs',
    excerpt:
      'The fourth Chinese Scarlet & Violet set puts Gholdengo on the pack, with a gold Gholdengo ex, a Maushold ex SAR and a Rika SAR you can only pull in Simplified Chinese.',
    tag: 'New release',
    date: '2025-07-18',
    heroImage: `${SITE_URL}/assets/blog/reward-round-release-hero-v4.webp`,
    heroAlt: 'Reward Round slim and jumbo booster packs with the Chinese-exclusive Maushold ex Special Art Rare in front',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(251 213 114 / .25)',
  },
  {
    slug: 'reward-round-set-guide',
    path: '/blogs/news/reward-round-set-guide',
    title: 'Reward Round Set Guide: Every Chase Card and What a Slim Box Holds',
    excerpt:
      'Every Ultra Rare, Special Art Rare, Super Rare and Art Rare in Reward Round, what a 15-pack slim box averages, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/reward-round-guide-hero-v4.webp`,
    heroAlt: 'The Chinese-exclusive Maushold ex Special Art Rare in an EBI display case above five Special Art Rares and the gold Gholdengo ex',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(251 213 114 / .25)',
  },
  {
    slug: 'reward-round-card-origins',
    path: '/blogs/news/reward-round-card-origins',
    title: 'Where Every Reward Round Card Comes From',
    excerpt:
      'All 165 cards matched to English: 69 from Obsidian Flames, 41 from Paldea Evolved, 31 from Paradox Rift, 21 from six other sources and 3 new.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/reward-round-origins-hero-v3.webp`,
    heroAlt: 'Reward Round pack linked to tiles for Obsidian Flames, Paldea Evolved, Paradox Rift, other sources and new art',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(179 130 68 / .30)',
  },
  {
    slug: 'terastal-gathering-has-arrived',
    path: '/blogs/news/terastal-gathering-has-arrived',
    title: 'Terastal Gathering Is Here: Stellar Eeveelutions and a Second Sylveon ex SAR',
    excerpt:
      'China\'s take on Prismatic Evolutions: Eevee and all eight Eeveelutions as Stellar Tera ex, 259 cards in 10-card packs, and a Sylveon ex Special Art Rare you will not find in English.',
    tag: 'New release',
    date: '2026-06-12',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-release-hero-v3.webp`,
    heroAlt: 'Terastal Gathering booster pack with the Umbreon ex Special Art Rare in front, flanked by Eevee ex and Sylveon ex',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'terastal-gathering-set-guide',
    path: '/blogs/news/terastal-gathering-set-guide',
    title: 'Terastal Gathering Set Guide: Every Eeveelution, Chase Card and What a Box Holds',
    excerpt:
      'Every Special Art Rare and gold Ultra Rare, the full Eeveelution checklist, the ACE SPEC cards, what a 10-pack box averages, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-guide-hero-v3.webp`,
    heroAlt: 'Umbreon ex Special Art Rare in an EBI display case above six Eeveelution ex Special Art Rares',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'terastal-gathering-card-origins',
    path: '/blogs/news/terastal-gathering-card-origins',
    title: 'Where Every Terastal Gathering Card Comes From',
    excerpt:
      'All 259 cards matched to English: 156 from Prismatic Evolutions, 28 arts that were only ever English promos, 73 from other Scarlet & Violet sets, and 2 new.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-origins-hero-v3.webp`,
    heroAlt: 'Terastal Gathering pack linked to tiles for Prismatic Evolutions, promo-only art, other sets and new art',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'chasing-glory-has-arrived',
    path: '/blogs/news/chasing-glory-has-arrived',
    title: 'Chasing Glory Is Here: Trainer\'s Pokémon in Slim and Jumbo Packs',
    excerpt:
      'The main CSV10 set brings Trainer\'s Pokémon to Simplified Chinese: 287 cards led by Team Rocket, a Chinese-exclusive Brock SAR, and two pack sizes with different odds.',
    tag: 'New release',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-release-hero-v3.webp`,
    heroAlt: 'Chasing Glory slim and jumbo booster packs with the Team Rocket\'s Mewtwo ex Special Art Rare in front',
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(29 16 19 / .30)',
  },
  {
    slug: 'chasing-glory-set-guide',
    path: '/blogs/news/chasing-glory-set-guide',
    title: 'Chasing Glory Set Guide: Slim vs Jumbo Odds, Every Chase Card and the Trainer Roster',
    excerpt:
      'Slim or jumbo? What each box holds on average, every Ultra Rare and Special Art Rare, which Trainers own which Pokémon, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-guide-hero-v3.webp`,
    heroAlt: 'Team Rocket\'s Mewtwo ex Special Art Rare in an EBI display case above the six gold Pokémon ex Ultra Rares',
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(218 189 94 / .25)',
  },
  {
    slug: 'chasing-glory-card-origins',
    path: '/blogs/news/chasing-glory-card-origins',
    title: 'Where Every Chasing Glory Card Comes From',
    excerpt:
      'All 287 cards traced to their English printings: 190 from Destined Rivals, 94 from Journey Together, 2 from Ascended Heroes, and one card made only for China.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-origins-hero-v3.webp`,
    heroAlt: 'Chasing Glory pack linked to tiles for Destined Rivals, Journey Together, Ascended Heroes and one new card',
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(173 49 26 / .30)',
  },
  {
    slug: '30th-celebration-has-arrived',
    path: '/blogs/news/30th-celebration-has-arrived',
    title: '30th Celebration Is Here: 30 Pikachu, Futuristic Rares and 30 Classic Cards',
    excerpt:
      'The Pokémon TCG\'s 30th anniversary set: a Pikachu in every pack, the new Futuristic Rare, and 30 famous cards from 1999 to 2023 back in their original frames.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-release-hero-v3.webp`,
    heroAlt: 'The 30th Celebration booster pack with the Mew ex Futuristic Rare in front, over a blurred close-up of the Pikachu pack art',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-set-guide',
    path: '/blogs/news/30th-celebration-set-guide',
    title: '30th Celebration Set Guide: Every Pikachu, Classic and Promo',
    excerpt:
      'How 30th Celebration is numbered, all 30 Pikachu, every secret rare and classic card, all 33 promos, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-guide-hero-v3.webp`,
    heroAlt: '30th Celebration Set Guide banner: the Mewtwo ex Futuristic Rare in a display case, with six of the 30 Pikachu beside the EBI Collectibles logo',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-card-origins',
    path: '/blogs/news/30th-celebration-card-origins',
    title: 'Where Every 30th Celebration Classic Card Comes From',
    excerpt:
      'The 30 classic cards in 30th Celebration reprint famous English cards from Base Set Charizard in 1999 to Paldea Evolved Magikarp in 2023. Here\'s the full map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-origins-hero-v3.webp`,
    heroAlt: '30th Celebration Card Origins banner: the booster pack linked to tiles counting the 30 classic cards by era',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: 'gem-vol-7-has-arrived',
    path: '/blogs/news/gem-vol-7-has-arrived',
    title: "Gem Vol 7 Is Here: Misty's Psyduck Leads a Trainer-Paired Lineup",
    excerpt:
      "The seventh Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a brand-new Misty's Psyduck full art you can only pull here.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 7 booster pack with Misty's Psyduck full art, over a blurred close-up of the Psyduck pack art",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
  },
  {
    slug: 'gem-vol-6-has-arrived',
    path: '/blogs/news/gem-vol-6-has-arrived',
    title: 'Gem Vol 6 Is Here: Applin Leads an Orchard of Holos',
    excerpt:
      'The sixth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, the whole apple family, and an Applin full art you can only pull here.',
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 6 booster pack with the Applin kitchen full art, over a blurred close-up of the Applin pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(78 119 104 / .30)',
  },
  {
    slug: 'gem-vol-6-set-guide',
    path: '/blogs/news/gem-vol-6-set-guide',
    title: 'Gem Vol 6 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 6 version apart, all 28 full arts in one place, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-guide-hero-v3.webp`,
    heroAlt: "Gem Vol. 6 Set Guide banner: the Applin full art 1907/07 in a display case, with six holo Applin versions beside the EBI Collectibles logo",
    glow1: 'rgb(78 119 104 / .30)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-6-card-origins',
    path: '/blogs/news/gem-vol-6-card-origins',
    title: 'Where Every Gem Vol 6 Card Actually Comes From',
    excerpt:
      "55 of the 56 artworks in Gem Vol 6 are reused from English Scarlet & Violet cards, mostly Surging Sparks. Here's the full card-by-card map.",
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 6 Card Origins banner: the Applin booster pack linked to tiles showing where its 56 artworks came from, led by Surging Sparks",
    glow1: 'rgb(78 119 104 / .28)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-5-has-arrived',
    path: '/blogs/news/gem-vol-5-has-arrived',
    title: 'Gem Vol 5 Is Here: Pokémon Horizons Sets Sail in the Gem Pack',
    excerpt:
      'The fifth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and four Pokémon Horizons full arts led by Captain Pikachu.',
    tag: 'New release',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 5 booster pack with the Floragato and Liko full art, over a blurred close-up of the Floragato pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(214 170 60 / .28)',
  },
  {
    slug: 'gem-vol-5-set-guide',
    path: '/blogs/news/gem-vol-5-set-guide',
    title: 'Gem Vol 5 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 5 version apart, all 28 full arts in one place including the four Horizons cards, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-guide-hero-v4.webp`,
    heroAlt: "Gem Vol. 5 Set Guide banner: the Captain Pikachu and Friede full art 0107/07 in a display case, with six holo Captain Pikachu versions beside the EBI Collectibles logo",
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-5-card-origins',
    path: '/blogs/news/gem-vol-5-card-origins',
    title: 'Where Every Gem Vol 5 Card Actually Comes From',
    excerpt:
      '51 of the 56 artworks in Gem Vol 5 are reused from English cards, mostly Surging Sparks. The other five are new Pokémon Horizons art. Here\'s the full card-by-card map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 5 Card Origins banner: the Floragato booster pack linked to tiles showing where its 56 artworks came from, led by Surging Sparks",
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-has-arrived',
    path: '/blogs/news/gem-vol-4-has-arrived',
    title: 'Gem Vol 4 Is Here: Ponyta Gallops In for the Year of the Horse',
    excerpt:
      'The fourth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a sunset meadow Ponyta full art you can only pull here.',
    tag: 'New release',
    date: '2026-02-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 4 booster pack with the Ponyta full art, over a blurred close-up of the Ponyta pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(208 129 105 / .30)',
  },
  {
    slug: 'gem-vol-4-set-guide',
    path: '/blogs/news/gem-vol-4-set-guide',
    title: 'Gem Vol 4 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 4 version apart, all 28 full arts in one place, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-guide-hero-v3.webp`,
    heroAlt: "Gem Vol. 4 Set Guide banner: the Ponyta full art 0107/07 in a display case, with six holo Ponyta versions beside the EBI Collectibles logo",
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-card-origins',
    path: '/blogs/news/gem-vol-4-card-origins',
    title: 'Where Every Gem Vol 4 Card Actually Comes From',
    excerpt:
      '55 of the 56 artworks in Gem Vol 4 are reused from English cards, mostly Temporal Forces and Twilight Masquerade. Here\'s the full card-by-card map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 4 Card Origins banner: the Ponyta booster pack linked to tiles showing where its 56 artworks came from, led by Temporal Forces",
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-3-has-arrived',
    path: '/blogs/news/gem-vol-3-has-arrived',
    title: 'Gem Vol 3 Is Here: Gengar Leads a Night Out in the Gem Pack',
    excerpt:
      'The third Simplified Chinese Gem Pack: 136 all-holo cards of night-time Pokémon, nine Pokémon ex, and five new lantern-lit full arts you can only pull here.',
    tag: 'New release',
    date: '2025-09-26',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 3 booster pack with the Gengar full art, over a blurred close-up of the Gengar pack art",
    glow1: 'rgb(102 63 90 / .32)',
    glow2: 'rgb(214 169 151 / .26)',
  },
  {
    slug: 'gem-vol-3-set-guide',
    path: '/blogs/news/gem-vol-3-set-guide',
    title: 'Gem Vol 3 Set Guide: Every Full Art, Every ex and Box Math',
    excerpt:
      'How to read a Gem Vol 3 card, all nine full arts and nine Pokémon ex in one place, the Trainers and Energy, the full roster, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-guide-hero-v4.webp`,
    heroAlt: "Gem Vol. 3 Set Guide banner: the Cubone lantern full art 0407/07 in a display case, with six holo Cubone versions beside the EBI Collectibles logo",
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-3-card-origins',
    path: '/blogs/news/gem-vol-3-card-origins',
    title: 'Where Every Gem Vol 3 Card Actually Comes From',
    excerpt:
      '35 of the 40 artworks in Gem Vol 3 are reused from English cards, mostly 2023 Scarlet & Violet sets. The other five are the new lantern full arts. Here\'s the full map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 3 Card Origins banner: the Gengar booster pack linked to tiles showing where its 40 artworks came from, led by Obsidian Flames",
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-2-has-arrived',
    path: '/blogs/news/gem-vol-2-has-arrived',
    title: 'Gem Vol 2 Is Here: Eevee and Friends, With Four Full Arts That Form One Scene',
    excerpt:
      'The second Simplified Chinese Gem Pack: 140 all-holo cards across Eevee and all eight Eeveelutions, a V and VMAX for each, and four exclusive full arts that join into one forest scene.',
    tag: 'New release',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-release-hero-v3.webp`,
    heroAlt: "The Gem Pack Vol. 2 booster pack with the Sylveon full art, over a blurred close-up of the Sylveon pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(86 134 135 / .30)',
  },
  {
    slug: 'gem-vol-2-set-guide',
    path: '/blogs/news/gem-vol-2-set-guide',
    title: 'Gem Vol 2 Set Guide: Every V, VMAX and Full Art, Plus Box Math',
    excerpt:
      'How to read a Gem Vol 2 card, the four forest full arts, all nine V and VMAX, the Trainers and Energy, the full roster, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-guide-hero-v4.webp`,
    heroAlt: "Gem Vol. 2 Set Guide banner: the sleeping Umbreon forest full art 0615/15 in a display case, with six holo Umbreon versions beside the EBI Collectibles logo",
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-2-card-origins',
    path: '/blogs/news/gem-vol-2-card-origins',
    title: 'Where Every Gem Vol 2 Card Actually Comes From',
    excerpt:
      '40 of the 44 artworks in Gem Vol 2 are reused from English cards, mostly Sword & Shield promos and Evolving Skies. The other four are the new forest full arts. Here\'s the full map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 2 Card Origins banner: the Sylveon booster pack linked to tiles showing where its 44 artworks came from, led by Sword & Shield promos",
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'black-bolt-white-flare-arrive',
    path: '/blogs/news/black-bolt-white-flare-arrive',
    title: 'Black Bolt and White Flare Arrive Together: Zekrom ex and Reshiram ex Split Unova',
    excerpt:
      'Two Simplified Chinese Scarlet & Violet sets out on the same day, with 174 cards each and a Black White Rare of Zekrom ex or Reshiram ex as the top pull.',
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/black-bolt-white-flare-official-key-art.webp`,
    heroAlt: 'Official key art for Black Bolt and White Flare, Zekrom ex and Reshiram ex',
    glow1: 'rgb(171 49 42 / .30)',
    glow2: 'rgb(72 121 119 / .25)',
  },
  {
    slug: 'gem-vol-7-card-origins',
    path: '/blogs/news/gem-vol-7-card-origins',
    title: 'Where Every Gem Vol 7 Card Actually Comes From',
    excerpt:
      "55 of the 56 artworks in Gem Vol 7 are reused from English cards, mostly Destined Rivals and Journey Together. Here's the full card-by-card map.",
    tag: 'Collecting guide',
    date: '2026-11-14',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-origins-hero-v3.webp`,
    heroAlt: "Gem Vol. 7 Card Origins banner: the Psyduck booster pack linked to tiles showing where its 56 artworks came from, led by Destined Rivals",
    glow1: 'rgb(58 110 165 / .28)',
    glow2: 'rgb(138 61 120 / .22)',
  },
]

export const BLOG_SITE_URL = SITE_URL
