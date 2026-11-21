// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blog
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'chinese-pokemon-sets-in-order' | 'gem-vol-7-release-news' | 'gem-vol-7-set-guide' | 'gem-vol-7-card-origins' | 'gem-vol-6-release-news' | 'gem-vol-6-set-guide' | 'gem-vol-6-card-origins' | 'gem-vol-5-release-news' | 'gem-vol-5-set-guide' | 'gem-vol-5-card-origins' | 'gem-vol-4-release-news' | 'gem-vol-4-set-guide' | 'gem-vol-4-card-origins' | 'gem-vol-3-release-news' | 'gem-vol-3-set-guide' | 'gem-vol-3-card-origins' | 'gem-vol-2-release-news' | 'gem-vol-2-set-guide' | 'gem-vol-2-card-origins' | 'gem-vol-1-release-news' | 'gem-vol-1-set-guide' | 'gem-vol-1-card-origins' | '30th-celebration-release-news' | '30th-celebration-set-guide' | '30th-celebration-card-origins' | 'chasing-glory-release-news' | 'chasing-glory-set-guide' | 'chasing-glory-card-origins' | 'terastal-gathering-release-news' | 'terastal-gathering-set-guide' | 'terastal-gathering-card-origins' | 'reward-round-release-news' | 'reward-round-set-guide' | 'reward-round-card-origins' | 'fearless-terastal-release-news' | 'fearless-terastal-set-guide' | 'fearless-terastal-card-origins' | 'eternal-birth-release-news' | 'eternal-birth-set-guide' | 'eternal-birth-card-origins' | 'miracle-journey-release-news' | 'miracle-journey-set-guide' | 'miracle-journey-card-origins' | 'black-crystal-blaze-release-news' | 'black-crystal-blaze-set-guide' | 'black-crystal-blaze-card-origins' | 'black-bolt-white-flare-release-news' | 'black-bolt-set-guide' | 'black-bolt-card-origins' | 'white-flare-set-guide' | 'white-flare-card-origins' | 'true-mystery-release-news' | 'true-mystery-set-guide' | 'true-mystery-card-origins' | 'blade-awakening-release-news' | 'blade-awakening-set-guide' | 'blade-awakening-card-origins' | 'brilliant-fantasy-release-news' | 'brilliant-fantasy-set-guide' | 'brilliant-fantasy-card-origins' | 'stellar-crystal-release-news' | 'stellar-crystal-set-guide' | 'stellar-crystal-card-origins' | 'pikachu-dream-painting-figures-release-news' | 'funism-ditto-palm-size-wonders-release-news' | 'team-rocket-briefcase-release-news' | 'pikachu-gift-box-release-news' | 'day-night-gift-box-release-news' | 'greninja-sylveon-display-set-release-news'

export interface BlogPostSummary {
  slug: BlogPostSlug
  path: `/blog/${BlogPostSlug}`
  title: string
  excerpt: string
  tag: string
  date: string // ISO date, shown as the publish date
  heroImage: string
  heroAlt: string
  glow1: string
  glow2: string
  /** Search result title (before " | EBI Collectibles"), about 60 characters with the names people search. Falls back to title. */
  seoTitle?: string
  /** Search result snippet, under about 155 characters. Falls back to excerpt. */
  seoDescription?: string
}

export function blogSeoTitle(post: BlogPostSummary): string {
  return `${post.seoTitle ?? post.title} | EBI Collectibles`
}

/**
 * The wide 1200x630 JPG used for link previews (og:image). It is the post's
 * banner cropped to the shape chat apps and social sites show, saved as a
 * JPG because not every platform displays WebP.
 */
export function blogShareImage(post: BlogPostSummary): string {
  const file = post.heroImage.split('/').pop()!.replace(/\.webp$/, '.jpg')
  return `${SITE_URL}/assets/share/blog-${file}`
}

export function blogSeoDescription(post: BlogPostSummary): string {
  return post.seoDescription ?? post.excerpt
}

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    slug: 'chinese-pokemon-sets-in-order',
    path: '/blog/chinese-pokemon-sets-in-order',
    title: 'Every Simplified Chinese Pokémon TCG Set in Order (2025–2026)',
    excerpt:
      'A release timeline of the Simplified Chinese Pokémon TCG sets we have card lists for: main CSV expansions, Gem Packs, Collect 151 and special sets, with dates, set codes and card counts.',
    seoTitle: 'Simplified Chinese Pokémon TCG Sets in Order (2025–2026)',
    seoDescription:
      'Simplified Chinese Pokémon TCG sets in release order: CSV main expansions, Gem Packs, Collect 151 and special sets, with dates, set codes and card lists.',
    tag: 'Collecting guide',
    date: '2026-11-19',
    heroImage: `${SITE_URL}/assets/blog/chinese-sets-timeline-hero-v1.webp`,
    heroAlt: 'Timeline of Simplified Chinese Pokémon TCG sets from 2025 to 2026',
    glow1: 'rgb(194 26 118 / .26)',
    glow2: 'rgb(64 130 170 / .30)',
  },
  {
    slug: 'true-mystery-release-news',
    path: '/blog/true-mystery-release-news',
    title: 'True Mystery Is Here: Iron Valiant, Roaring Moon and a Chinese Exclusive Iron Hands ex',
    excerpt:
      'True Mystery (CSV6C) brings the Paradox Pokémon to Simplified Chinese, with Iron Valiant on the pack and slim and jumbo boxes. Its Chinese Exclusive is an Iron Hands ex Special Art Rare.',
    seoTitle: 'Pokémon True Mystery (CSV6C): Iron Hands ex & Release Info',
    seoDescription:
      'Pokémon TCG True Mystery (CSV6C) in Simplified Chinese: Iron Valiant on the pack, slim and jumbo boxes, and a Chinese Exclusive Iron Hands ex Special Art Rare.',
    tag: 'New release',
    date: '2025-11-07',
    heroImage: `${SITE_URL}/assets/blog/true-mystery-release-hero-v10.webp`,
    heroAlt: 'True Mystery slim and jumbo booster packs with the Iron Hands ex Special Art Rare in front',
    glow1: 'rgb(86 206 210 / .30)',
    glow2: 'rgb(110 60 150 / .35)',
  },
  {
    slug: 'true-mystery-set-guide',
    path: '/blog/true-mystery-set-guide',
    title: 'True Mystery Set Guide: Slim vs Jumbo, Every Chase Card and the Paradox Runs',
    excerpt:
      "True Mystery (CSV6C) is the Paradox set, sold in slim and jumbo boxes. This guide helps you pick a box, shows every secret rare, and explains how the 163 card numbers fit together.",
    seoTitle: 'Pokémon True Mystery (CSV6C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG True Mystery (CSV6C) set guide: slim vs jumbo box odds, every Special Art Rare and Super Rare, and how the 163 cards are numbered.',
    tag: 'Set guide',
    date: '2025-11-07',
    heroImage: `${SITE_URL}/assets/blog/true-mystery-guide-hero-v10.webp`,
    heroAlt: 'The Iron Hands ex Special Art Rare in an EBI display case above six True Mystery Special Art Rares',
    glow1: 'rgb(86 206 210 / .30)',
    glow2: 'rgb(110 60 150 / .35)',
  },
  {
    slug: 'true-mystery-card-origins',
    path: '/blog/true-mystery-card-origins',
    title: 'Where Every True Mystery Card Comes From',
    excerpt:
      'All 163 True Mystery (CSV6C) cards matched to their English versions: 128 from Paradox Rift, 16 from Obsidian Flames, 15 from Paldean Fates, 2 from other sources and 2 that do not exist in English.',
    seoTitle: 'Pokémon True Mystery (CSV6C) Card Origins: English Art Matches',
    seoDescription:
      'All 163 Pokémon TCG True Mystery (CSV6C) cards matched to English: 128 from Paradox Rift, 16 from Obsidian Flames and 15 from Paldean Fates.',
    tag: 'Collecting guide',
    date: '2025-11-07',
    heroImage: `${SITE_URL}/assets/blog/true-mystery-origins-hero-v10.webp`,
    heroAlt: 'True Mystery jumbo and slim packs linked to tiles for Paradox Rift, Obsidian Flames, Paldean Fates, other sources and cards with no English version',
    glow1: 'rgb(86 206 210 / .30)',
    glow2: 'rgb(110 60 150 / .35)',
  },
  {
    slug: 'blade-awakening-release-news',
    path: '/blog/blade-awakening-release-news',
    title: "Blade Awakening Is Here: Tera Greninja ex, ACE SPEC Cards and a Chinese Exclusive Ciphermaniac Special Art Rare",
    excerpt:
      "Blade Awakening (set code CSV7C) puts Tera Greninja ex on the pack and adds nine ACE SPEC cards. Its Chinese Exclusive is a Ciphermaniac's Codebreaking Special Art Rare.",
    seoTitle: 'Pokémon Blade Awakening (CSV7C): Tera Greninja ex & Release Info',
    seoDescription:
      "Pokémon TCG Blade Awakening (CSV7C) has Tera Greninja ex on the pack and nine ACE SPEC cards. Its Chinese Exclusive is a Ciphermaniac's Codebreaking Special Art Rare.",
    tag: 'New release',
    date: '2026-01-16',
    heroImage: `${SITE_URL}/assets/blog/blade-awakening-release-hero-v10.webp`,
    heroAlt: "Blade Awakening slim and jumbo booster packs with the Greninja ex Special Art Rare in front and Ciphermaniac's Codebreaking behind",
    glow1: 'rgb(246 160 78 / .30)',
    glow2: 'rgb(30 80 160 / .35)',
  },
  {
    slug: 'blade-awakening-set-guide',
    path: '/blog/blade-awakening-set-guide',
    title: 'Blade Awakening Set Guide: Slim vs Jumbo Odds, Every Chase Card and the ACE SPECs',
    excerpt:
      "Blade Awakening (set code CSV7C) is the Tera Greninja ex set, with nine ACE SPEC cards and slim and jumbo boxes that have different odds. This guide helps you pick a box and plan a 605-card master set.",
    seoTitle: 'Pokémon Blade Awakening (CSV7C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Blade Awakening (CSV7C) is the Tera Greninja ex set. This guide compares slim and jumbo box odds and shows what a 605-card master set takes.',
    tag: 'Set guide',
    date: '2026-01-16',
    heroImage: `${SITE_URL}/assets/blog/blade-awakening-guide-hero-v10.webp`,
    heroAlt: "The Greninja ex Special Art Rare in an EBI display case, beside a row of six Blade Awakening Special Art Rares led by Ciphermaniac's Codebreaking",
    glow1: 'rgb(246 160 78 / .30)',
    glow2: 'rgb(30 80 160 / .35)',
  },
  {
    slug: 'blade-awakening-card-origins',
    path: '/blog/blade-awakening-card-origins',
    title: 'Where Every Blade Awakening Card Comes From',
    excerpt:
      'All 259 cards in Blade Awakening (set code CSV7C) matched to English. 173 match Temporal Forces, 68 match Twilight Masquerade, and one is a Chinese Exclusive.',
    seoTitle: 'Pokémon Blade Awakening (CSV7C) Card Origins: English Art Matches',
    seoDescription:
      'All 259 Pokémon TCG Blade Awakening (CSV7C) cards matched to English. 173 match Temporal Forces, 68 match Twilight Masquerade, and one is a Chinese Exclusive.',
    tag: 'Collecting guide',
    date: '2026-01-16',
    heroImage: `${SITE_URL}/assets/blog/blade-awakening-origins-hero-v10.webp`,
    heroAlt: 'Blade Awakening jumbo and slim packs linked to tiles for Temporal Forces, Twilight Masquerade, other sources and new art',
    glow1: 'rgb(246 160 78 / .30)',
    glow2: 'rgb(30 80 160 / .35)',
  },
  {
    slug: 'brilliant-fantasy-release-news',
    path: '/blog/brilliant-fantasy-release-news',
    title: 'Brilliant Fantasy Is Here: Milotic, Every Ogerpon Mask and a Chinese Exclusive Carmine Special Art Rare',
    excerpt:
      'Brilliant Fantasy (set code CSV8C) is the Kitakami set, with Milotic on the pack and all four Ogerpon ex. Its Chinese Exclusive is a Carmine Special Art Rare with a new illustration.',
    seoTitle: 'Pokémon Brilliant Fantasy (CSV8C): Milotic, Carmine & Release Info',
    seoDescription:
      'Pokémon TCG Brilliant Fantasy (CSV8C) is the Kitakami set, with Milotic on the pack and all four Ogerpon ex. Its Chinese Exclusive is a Carmine Special Art Rare.',
    tag: 'New release',
    date: '2026-03-13',
    heroImage: `${SITE_URL}/assets/blog/brilliant-fantasy-release-hero-v10.webp`,
    heroAlt: 'Brilliant Fantasy slim and jumbo booster packs with the Carmine Special Art Rare in front',
    glow1: 'rgb(56 13 40 / .30)',
    glow2: 'rgb(64 155 148 / .25)',
  },
  {
    slug: 'brilliant-fantasy-set-guide',
    path: '/blog/brilliant-fantasy-set-guide',
    title: 'Brilliant Fantasy Set Guide: Slim vs Jumbo, Every Chase Card and the Ogerpon Run',
    excerpt:
      "Brilliant Fantasy (set code CSV8C) is the Kitakami set, with Milotic on the pack and every Ogerpon mask. This guide helps you choose between slim and jumbo boxes and plan a 616-card master set.",
    seoTitle: 'Brilliant Fantasy (CSV8C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Brilliant Fantasy (CSV8C) is the Kitakami set. This guide compares slim and jumbo boxes and shows what a 616-card master set takes.',
    tag: 'Set guide',
    date: '2026-03-13',
    heroImage: `${SITE_URL}/assets/blog/brilliant-fantasy-guide-hero-v10.webp`,
    heroAlt: 'The Carmine Special Art Rare in an EBI display case above six Brilliant Fantasy Special Art Rares',
    glow1: 'rgb(56 13 40 / .30)',
    glow2: 'rgb(64 155 148 / .25)',
  },
  {
    slug: 'brilliant-fantasy-card-origins',
    path: '/blog/brilliant-fantasy-card-origins',
    title: 'Where Every Brilliant Fantasy Card Comes From',
    excerpt:
      'All 264 cards in Brilliant Fantasy (set code CSV8C) matched to English. 109 match Twilight Masquerade, 76 match Shrouded Fable, and one is a Chinese Exclusive.',
    seoTitle: 'Brilliant Fantasy (CSV8C) Card Origins: English Art Matches',
    seoDescription:
      'All 264 Pokémon TCG Brilliant Fantasy (CSV8C) cards matched to English. 109 match Twilight Masquerade, 76 match Shrouded Fable, and one is a Chinese Exclusive.',
    tag: 'Collecting guide',
    date: '2026-03-13',
    heroImage: `${SITE_URL}/assets/blog/brilliant-fantasy-origins-hero-v10.webp`,
    heroAlt: 'Brilliant Fantasy jumbo and slim packs linked to tiles for Twilight Masquerade, Shrouded Fable, Surging Sparks, other sources and new art',
    glow1: 'rgb(56 13 40 / .30)',
    glow2: 'rgb(64 155 148 / .25)',
  },
  {
    slug: 'stellar-crystal-release-news',
    path: '/blog/stellar-crystal-release-news',
    title: "Stellar Crystal Is Here: Stellar Tera Pikachu ex and a Chinese Exclusive Lisia's Appeal",
    excerpt:
      "Stellar Crystal (set code CSV9C) is the Terapagos set, with Stellar Tera Pikachu on the pack. Pikachu ex comes at four rarities, and the Lisia's Appeal Special Art Rare is a Chinese Exclusive.",
    seoTitle: 'Pokémon Stellar Crystal (CSV9C): Pikachu ex & Release Info',
    seoDescription:
      "Pokémon TCG Stellar Crystal (CSV9C): Stellar Tera Pikachu on the pack, Pikachu ex at four rarities and a Chinese Exclusive Lisia's Appeal Special Art Rare.",
    tag: 'New release',
    date: '2026-05-15',
    heroImage: `${SITE_URL}/assets/blog/stellar-crystal-release-hero-v10.webp`,
    heroAlt: "Stellar Crystal slim and jumbo booster packs with the Pikachu ex Special Art Rare in front and Lisia's Appeal behind",
    glow1: 'rgb(210 110 123 / .30)',
    glow2: 'rgb(92 103 134 / .25)',
  },
  {
    slug: 'stellar-crystal-set-guide',
    path: '/blog/stellar-crystal-set-guide',
    title: 'Stellar Crystal Set Guide: Slim vs Jumbo, Every Chase Card and the Pikachu Run',
    excerpt:
      "Stellar Crystal (set code CSV9C) is the Stellar Tera set, with Pikachu on the pack and Terapagos ex. This guide helps you choose between slim and jumbo packs, shows every secret rare, and explains what a 620-card master set takes.",
    seoTitle: 'Pokémon Stellar Crystal (CSV9C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Stellar Crystal (CSV9C) set guide: slim vs jumbo packs, every Special Art Rare and Super Rare, the Pikachu ex run, and the 620-card master set.',
    tag: 'Set guide',
    date: '2026-05-15',
    heroImage: `${SITE_URL}/assets/blog/stellar-crystal-guide-hero-v10.webp`,
    heroAlt: "The Pikachu ex Special Art Rare in an EBI display case, beside a row of six Stellar Crystal Special Art Rares led by Lisia's Appeal",
    glow1: 'rgb(210 110 123 / .30)',
    glow2: 'rgb(92 103 134 / .25)',
  },
  {
    slug: 'stellar-crystal-card-origins',
    path: '/blog/stellar-crystal-card-origins',
    title: 'Where Every Stellar Crystal Card Comes From',
    excerpt:
      'All 266 cards in Stellar Crystal (set code CSV9C) are matched to their English versions. 160 match Surging Sparks, 79 match Stellar Crown, 26 come from four other sources, and one is a Chinese Exclusive.',
    seoTitle: 'Pokémon Stellar Crystal (CSV9C) Card Origins: English Art Matches',
    seoDescription:
      'All 266 Pokémon TCG Stellar Crystal (CSV9C) cards matched to English: 160 match Surging Sparks, 79 match Stellar Crown and one is a Chinese Exclusive.',
    tag: 'Collecting guide',
    date: '2026-05-15',
    heroImage: `${SITE_URL}/assets/blog/stellar-crystal-origins-hero-v10.webp`,
    heroAlt: 'Stellar Crystal jumbo and slim packs linked to tiles for Surging Sparks, Stellar Crown, other sources and new art',
    glow1: 'rgb(210 110 123 / .30)',
    glow2: 'rgb(92 103 134 / .25)',
  },

  {
    slug: 'pikachu-dream-painting-figures-release-news',
    path: '/blog/pikachu-dream-painting-figures-release-news',
    title: 'Dream Painting Pikachu Figures: All 12, the Secret, and What Comes in a Box',
    excerpt:
      'Pokémon China turned 12 of the 30th Celebration Pikachu cards into figures that stand in front of their own card. Each box has one random figure, its card, a display stand and a 30th Celebration pack, and about 1 box in 144 holds a secret classic Pikachu.',
    seoTitle: 'Dream Painting Pikachu Figure Blind Box: Secret & Release Info',
    seoDescription:
      'Pokémon Dream Painting Pikachu blind box: 12 figures based on 30th Celebration Pikachu cards, each with its card, a stand and a pack, and a 1 in 144 secret.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/pikachu-dream-painting-figures-release-hero-v10.webp`,
    heroAlt: 'Dream Painting Pikachu figure blind box with the secret classic Pikachu figure and card 136/103 in front',
    glow1: 'rgb(246 206 60 / .30)',
    glow2: 'rgb(222 185 97 / .25)',
  },
  {
    slug: 'greninja-sylveon-display-set-release-news',
    path: '/blog/greninja-sylveon-display-set-release-news',
    title: 'Chinese Greninja ex & Sylveon ex Keychain Sets: New Promos, Card Holders and What Is Inside',
    excerpt:
      "Pokémon China's Greninja ex and Sylveon ex card display sets released on September 16, 2026, alongside 30th Celebration. This post covers what is in each one: a new promo card, a card display keychain and 3 booster packs.",
    seoTitle: 'Chinese Greninja ex & Sylveon ex Keychain Sets: Promos & Contents',
    seoDescription:
      'The Chinese Pokémon TCG 30th Celebration Greninja ex and Sylveon ex sets: a new promo card, a card display keychain and 3 booster packs in each.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/greninja-sylveon-display-set-side-by-side-hero.webp`,
    heroAlt: 'The Greninja ex set in front of the Sylveon ex set, with both promo cards and card display keychains showing through the windows',
    glow1: 'rgb(240 150 190 / .30)',
    glow2: 'rgb(90 150 230 / .25)',
  },
  {
    slug: 'day-night-gift-box-release-news',
    path: '/blog/day-night-gift-box-release-news',
    title: 'Chinese Day & Night Gift Box: Espeon ex and Umbreon ex Promos, 15 Packs and Everything Inside',
    excerpt:
      "Pokémon China's Day & Night gift box released on September 16, 2026, alongside 30th Celebration. This post covers everything in it: the Espeon ex and Umbreon ex promos, the 15 booster packs, the display frame and the two magnets.",
    seoTitle: 'Chinese Day & Night Gift Box: Espeon ex, Umbreon ex & Contents',
    seoDescription:
      'The Chinese Pokémon TCG 30th Celebration Day & Night gift box: Espeon ex and Umbreon ex promos, 15 booster packs, a display frame and two magnets.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/day-night-gift-box-release-hero-v1.webp`,
    heroAlt: 'The Day and Night gift box with the Espeon ex and Umbreon ex promo cards side by side in front of it',
    glow1: 'rgb(196 160 232 / .30)',
    glow2: 'rgb(246 206 60 / .22)',
  },
  {
    slug: 'pikachu-gift-box-release-news',
    path: '/blog/pikachu-gift-box-release-news',
    title: 'Radiant Crystal Pikachu Gift Box (Chinese): Everything Inside, the Pikachu ex Promo and the Release Date',
    excerpt:
      "Pokémon China's Radiant Crystal Pikachu gift box releases on December 4, 2026. This post covers everything in it: the Stellar Tera Pikachu ex promo, the 21 booster packs from this year's seven sets, and the matching accessories.",
    seoTitle: 'Radiant Crystal Pikachu Gift Box (Chinese): Contents & Release',
    seoDescription:
      'The Chinese Pokémon TCG Radiant Crystal Pikachu Gift Box releases December 4, 2026: Pikachu ex promo 489/SV-P, 21 booster packs, sleeves and a deck box.',
    tag: 'New release',
    date: '2026-11-20',
    heroImage: `${SITE_URL}/assets/blog/pikachu-gift-box-radiant-crystal-hero.webp`,
    heroAlt: 'The pink Radiant Crystal Pikachu gift box with the Pikachu ex promo card standing in front of it',
    glow1: 'rgb(246 128 176 / .30)',
    glow2: 'rgb(246 206 60 / .22)',
  },
  {
    slug: 'team-rocket-briefcase-release-news',
    path: '/blog/team-rocket-briefcase-release-news',
    title: 'Team Rocket Briefcase (Chinese): Everything Inside and How It Launched in China',
    excerpt:
      "Pokémon China's Team Rocket briefcase released on July 16, 2026, alongside Chasing Glory. This post covers everything in it, the Mewtwo ex promo, the outer box, and how the launch ran in stores in China.",
    seoTitle: 'Chinese Team Rocket Briefcase: Contents, Promo & Release',
    seoDescription:
      "The Chinese Pokémon TCG Team Rocket briefcase gift box: 6 Chasing Glory packs, Team Rocket's Mewtwo ex promo 354/SV-P, playmat, sleeves and deck box.",
    tag: 'New release',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/team-rocket-briefcase-release-hero-v6.webp`,
    heroAlt: 'The black Team Rocket briefcase, front on, with a red R in the middle and a red glow along its edges',
    glow1: 'rgb(232 64 52 / .30)',
    glow2: 'rgb(60 40 90 / .25)',
  },
  {
    slug: 'funism-ditto-palm-size-wonders-release-news',
    path: '/blog/funism-ditto-palm-size-wonders-release-news',
    title: 'Funism Happy Ditto: All 12 Figures, and What a Sealed Case Holds',
    excerpt:
      'Funism’s Happy Ditto figures show Ditto copying 12 Pokémon while keeping its own face. Three figures come inside each plastic Ditto, and a sealed case of four holds one of every design.',
    seoTitle: 'Funism Happy Ditto Blind Box: All 12 Figures & Case',
    seoDescription:
      "Funism Happy Ditto Pokémon figures: all 12 Ditto transformations, 3 figures in each plastic Ditto blind box, and a sealed case of 4 that has one of each.",
    tag: 'New release',
    date: '2026-09-24',
    heroImage: `${SITE_URL}/assets/blog/funism-ditto-palm-size-wonders-release-hero-v11.webp`,
    heroAlt: 'Funism Happy Ditto display case of four plastic Dittos with the Ditto as Gengar, Pikachu and Jigglypuff figures in front',
    glow1: 'rgb(196 160 230 / .30)',
    glow2: 'rgb(246 206 60 / .22)',
  },
  {
    slug: 'black-bolt-white-flare-release-news',
    path: '/blog/black-bolt-white-flare-release-news',
    title: 'Black Bolt and White Flare Are Here: Zekrom, Reshiram and Two Chinese Exclusive SARs',
    excerpt:
      "Zekrom and Reshiram lead two sets that released on the same day and split 156 Unova Pokémon between them. Each has one Chinese Exclusive: an N's Plan and a Hilda Special Art Rare.",
    seoTitle: 'Pokémon Black Bolt & White Flare (Chinese): Release Info & Exclusives',
    seoDescription:
      "Pokémon TCG Black Bolt (CSV10.5C) and White Flare (CSV10.6C) in Simplified Chinese: release date, pull odds, Black White Rares and two Chinese Exclusive SARs.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/black-bolt-white-flare-release-hero-v6.webp`,
    heroAlt: "Black Bolt and White Flare banner: the Zekrom and Reshiram booster packs with the N's Plan and Hilda Special Art Rares in front",
    glow1: 'rgb(119 167 201 / .30)',
    glow2: 'rgb(226 120 60 / .22)',
  },
  {
    slug: 'black-bolt-set-guide',
    path: '/blog/black-bolt-set-guide',
    title: 'Black Bolt Set Guide: Slim vs Jumbo Odds, Zekrom ex and Every Chase Card',
    excerpt:
      'Black Bolt is the Zekrom half of a twin release, and its slim and jumbo boxes have different odds. This guide helps you pick a box, shows every chase card, and explains what a 334-card master set takes.',
    seoTitle: 'Pokémon Black Bolt (CSV10.5C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      "Pokémon TCG Black Bolt (CSV10.5C) set guide: slim vs jumbo odds, the Zekrom ex Black White Rare, the Chinese Exclusive N's Plan SAR, and the master set.",
    tag: 'Set guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/black-bolt-guide-hero-v11.webp`,
    heroAlt: "The Zekrom ex Black White Rare in an EBI display case beside six Black Bolt chase cards led by the Chinese Exclusive N's Plan Special Art Rare",
    glow1: 'rgb(119 167 201 / .30)',
    glow2: 'rgb(72 121 119 / .25)',
  },
  {
    slug: 'black-bolt-card-origins',
    path: '/blog/black-bolt-card-origins',
    title: 'Where Every Black Bolt Card Comes From',
    excerpt:
      'Chinese Black Bolt is close to English Black Bolt, but not identical. Ten cards come from English White Flare after five Pokémon swapped sets, and the N\'s Plan Special Art Rare does not exist in English.',
    seoTitle: 'Pokémon Black Bolt (CSV10.5C) Card Origins: English Art Matches',
    seoDescription:
      "All 174 Pokémon TCG Black Bolt (CSV10.5C) cards traced to English: 160 from Black Bolt, 10 from White Flare, 3 Black Star Promos and a new N's Plan SAR.",
    tag: 'Collecting guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/black-bolt-origins-hero-v10.webp`,
    heroAlt: 'Black Bolt slim and jumbo packs linked to tiles for English Black Bolt, English White Flare, Black Star Promos and one new card',
    glow1: 'rgb(119 167 201 / .30)',
    glow2: 'rgb(44 78 108 / .30)',
  },
  {
    slug: 'white-flare-set-guide',
    path: '/blog/white-flare-set-guide',
    title: 'White Flare Set Guide: Slim vs Jumbo Odds, Reshiram ex and Every Chase Card',
    excerpt:
      'White Flare is the Reshiram half of a twin release, and its slim and jumbo boxes have different odds. This guide helps you pick a box, shows every chase card, and explains what a 334-card master set takes.',
    seoTitle: 'Pokémon White Flare (CSV10.6C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG White Flare (CSV10.6C) set guide: slim vs jumbo odds, the Reshiram ex Black White Rare, the Chinese Exclusive Hilda SAR, and the master set.',
    tag: 'Set guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/white-flare-guide-hero-v11.webp`,
    heroAlt: 'The Reshiram ex Black White Rare in an EBI display case beside six White Flare chase cards led by the Chinese Exclusive Hilda Special Art Rare',
    glow1: 'rgb(171 49 42 / .30)',
    glow2: 'rgb(219 172 132 / .22)',
  },
  {
    slug: 'white-flare-card-origins',
    path: '/blog/white-flare-card-origins',
    title: 'Where Every White Flare Card Comes From',
    excerpt:
      'Chinese White Flare is close to English White Flare, but not identical. Ten cards come from English Black Bolt after five Pokémon swapped sets, and the Hilda Special Art Rare does not exist in English.',
    seoTitle: 'Pokémon White Flare (CSV10.6C) Card Origins: English Art Matches',
    seoDescription:
      'All 174 Pokémon TCG White Flare (CSV10.6C) cards traced to English: 161 from White Flare, 10 from Black Bolt, 2 Black Star Promos and a new Hilda SAR.',
    tag: 'Collecting guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/white-flare-origins-hero-v10.webp`,
    heroAlt: 'White Flare slim and jumbo packs linked to tiles for English White Flare, English Black Bolt, Black Star Promos and one new card',
    glow1: 'rgb(171 49 42 / .30)',
    glow2: 'rgb(80 43 39 / .30)',
  },
  {
    slug: 'black-crystal-blaze-release-news',
    path: '/blog/black-crystal-blaze-release-news',
    title: 'Black Crystal Blaze Is Here: Darkness Tera Charizard ex and a Chinese Exclusive Larry',
    excerpt:
      'Black Crystal Blaze (CSV5C) is the fifth Chinese Scarlet & Violet set, with Darkness Tera Charizard ex on the pack. It has two Chinese Exclusives: a Larry Special Art Rare and a gold Defiance Band.',
    seoTitle: 'Pokémon Black Crystal Blaze (CSV5C): Charizard ex & Release Info',
    seoDescription:
      'Pokémon TCG Black Crystal Blaze (CSV5C): Darkness Tera Charizard ex on the pack, plus two Chinese Exclusives, a Larry Special Art Rare and a gold Defiance Band.',
    tag: 'New release',
    date: '2025-09-12',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-release-hero-v10.webp`,
    heroAlt: 'Black Crystal Blaze slim and jumbo booster packs with the Charizard ex Special Art Rare in front and Larry behind',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'black-crystal-blaze-set-guide',
    path: '/blog/black-crystal-blaze-set-guide',
    title: 'Black Crystal Blaze Set Guide: Slim vs Jumbo, Every Chase Card and the Charizard Run',
    excerpt:
      "Black Crystal Blaze (CSV5C) is the Tera Charizard set, with two Chinese Exclusives and slim and jumbo boxes. This guide helps you pick a box, shows every chase card, and explains what a master set takes.",
    seoTitle: 'Black Crystal Blaze (CSV5C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Black Crystal Blaze (CSV5C) set guide: slim vs jumbo odds, every Special Art Rare and Super Rare, Charizard ex, and the 394-card master set.',
    tag: 'Set guide',
    date: '2025-09-12',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-guide-hero-v10.webp`,
    heroAlt: 'The Charizard ex Special Art Rare in an EBI display case above six Black Crystal Blaze Special Art Rares',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'black-crystal-blaze-card-origins',
    path: '/blog/black-crystal-blaze-card-origins',
    title: 'Where Every Black Crystal Blaze Card Comes From',
    excerpt:
      'All 164 Black Crystal Blaze (CSV5C) cards matched to their English versions: 73 from Paradox Rift, 61 from Obsidian Flames, 18 from Paldean Fates, 10 from five other sources and 2 Chinese Exclusives.',
    seoTitle: 'Black Crystal Blaze (CSV5C) Card Origins: English Art Matches',
    seoDescription:
      'All 164 Pokémon TCG Black Crystal Blaze (CSV5C) cards matched to English: 73 Paradox Rift, 61 Obsidian Flames, 18 Paldean Fates and 2 Chinese Exclusives.',
    tag: 'Collecting guide',
    date: '2025-09-12',
    heroImage: `${SITE_URL}/assets/blog/black-crystal-blaze-origins-hero-v10.webp`,
    heroAlt: 'Black Crystal Blaze jumbo and slim packs linked to tiles for Paradox Rift, Obsidian Flames, Paldean Fates, other sources and new art',
    glow1: 'rgb(240 112 64 / .30)',
    glow2: 'rgb(120 30 40 / .35)',
  },
  {
    slug: 'reward-round-release-news',
    path: '/blog/reward-round-release-news',
    title: 'Reward Round Is Here: Gold Gholdengo ex and Two More Chinese Exclusives',
    excerpt:
      'Reward Round (set code CSV4C) is the fourth Chinese Scarlet & Violet set, with Gholdengo on the pack. It has three Chinese Exclusives: a gold Gholdengo ex, a Maushold ex Special Art Rare and a Rika Special Art Rare.',
    seoTitle: 'Pokémon Reward Round (CSV4C): Gold Gholdengo ex & Release Info',
    seoDescription:
      'Pokémon TCG Reward Round (CSV4C) has Gholdengo on the pack and three Chinese Exclusives: a gold Gholdengo ex and Special Art Rares of Maushold ex and Rika.',
    tag: 'New release',
    date: '2025-07-18',
    heroImage: `${SITE_URL}/assets/blog/reward-round-release-hero-v10.webp`,
    heroAlt: 'Reward Round slim and jumbo booster packs with the Chinese-exclusive Maushold ex Special Art Rare in front',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(251 213 114 / .25)',
  },
  {
    slug: 'reward-round-set-guide',
    path: '/blog/reward-round-set-guide',
    title: 'Reward Round Set Guide: Every Chase Card and What a Slim Box Holds',
    excerpt:
      "Reward Round (set code CSV4C) is the Gholdengo set, with 165 cards and three Chinese Exclusives. This guide helps you sort your pulls, see what a slim box holds on average and plan a master set.",
    seoTitle: 'Pokémon Reward Round (CSV4C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Reward Round (CSV4C) is the 165-card Gholdengo set. This guide shows every Special Art Rare and what a 15-pack slim box holds on average.',
    tag: 'Set guide',
    date: '2025-07-18',
    heroImage: `${SITE_URL}/assets/blog/reward-round-guide-hero-v10.webp`,
    heroAlt: 'The Chinese-exclusive Maushold ex Special Art Rare in an EBI display case above five Special Art Rares and the gold Gholdengo ex',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(251 213 114 / .25)',
  },
  {
    slug: 'reward-round-card-origins',
    path: '/blog/reward-round-card-origins',
    title: 'Where Every Reward Round Card Comes From',
    excerpt:
      'Reward Round (set code CSV4C) does not follow one English set. We matched all 165 cards to English: most come from Obsidian Flames, Paldea Evolved and Paradox Rift, and three are Chinese Exclusives.',
    seoTitle: 'Pokémon Reward Round (CSV4C) Card Origins: English Art Matches',
    seoDescription:
      'All 165 Pokémon TCG Reward Round (CSV4C) cards matched to English. Most match Obsidian Flames, Paldea Evolved and Paradox Rift, and three are Chinese Exclusives.',
    tag: 'Collecting guide',
    date: '2025-07-18',
    heroImage: `${SITE_URL}/assets/blog/reward-round-origins-hero-v10.webp`,
    heroAlt: 'Reward Round jumbo and slim packs linked to tiles for Obsidian Flames, Paldea Evolved, Paradox Rift, other sources and new art',
    glow1: 'rgb(46 123 134 / .30)',
    glow2: 'rgb(179 130 68 / .30)',
  },
  {
    slug: 'fearless-terastal-release-news',
    path: '/blog/fearless-terastal-release-news',
    title: 'Fearless Terastal Is Here: Tera Arcanine ex and a Chinese Exclusive Special Art Rare',
    excerpt:
      'Fearless Terastal (set code CSV3C) is the third Chinese Scarlet & Violet set, with Tera Arcanine ex on the pack and the four Treasures of Ruin. Its Arcanine ex Special Art Rare is a Chinese Exclusive that does not exist in English.',
    seoTitle: 'Pokémon Fearless Terastal (CSV3C): Tera Arcanine ex & Release Info',
    seoDescription:
      'Pokémon TCG Fearless Terastal (CSV3C) in Simplified Chinese has Tera Arcanine ex on the pack and a Chinese Exclusive Arcanine ex Special Art Rare.',
    tag: 'New release',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/fearless-terastal-release-hero-v1.webp`,
    heroAlt: 'Fearless Terastal banner: the 5-card and 20-card booster packs with the Arcanine ex Special Art Rare and the gold Ting-Lu ex',
    glow1: 'rgb(214 96 40 / .30)',
    glow2: 'rgb(64 130 170 / .25)',
  },
  {
    slug: 'fearless-terastal-set-guide',
    path: '/blog/fearless-terastal-set-guide',
    title: 'Fearless Terastal Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Fearless Terastal (set code CSV3C) has 35 secret rares behind a 130-card main set, and its 5-card and 20-card packs have different pull odds. This guide shows every chase card and how often you can expect to pull one.',
    seoTitle: 'Pokémon Fearless Terastal (CSV3C) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Fearless Terastal (CSV3C) has 165 cards and one Chinese Exclusive. This guide shows every Special Art Rare and the official pull odds.',
    tag: 'Set guide',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/fearless-terastal-guide-hero-v1.webp`,
    heroAlt: 'Fearless Terastal set guide banner: the Chinese Exclusive Arcanine ex Special Art Rare 155/130 in a display case',
    glow1: 'rgb(214 96 40 / .30)',
    glow2: 'rgb(64 130 170 / .25)',
  },
  {
    slug: 'fearless-terastal-card-origins',
    path: '/blog/fearless-terastal-card-origins',
    title: 'Where Every Fearless Terastal Card Comes From',
    excerpt:
      'Fearless Terastal (set code CSV3C) is built mostly from Paldea Evolved, with Obsidian Flames and Scarlet & Violet filling in most of the rest. We matched all 165 cards to English and found one that does not exist in English.',
    seoTitle: 'Pokémon Fearless Terastal (CSV3C) Card Origins: English Matches',
    seoDescription:
      'All 165 Pokémon TCG Fearless Terastal (CSV3C) cards matched to English. Most match Paldea Evolved, and the Arcanine ex Special Art Rare is a Chinese Exclusive.',
    tag: 'Collecting guide',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/fearless-terastal-origins-hero-v1.webp`,
    heroAlt: 'Fearless Terastal card origins banner: both booster packs with tiles for Paldea Evolved, Obsidian Flames, Scarlet & Violet, three other sources and one Chinese Exclusive',
    glow1: 'rgb(214 96 40 / .30)',
    glow2: 'rgb(64 130 170 / .25)',
  },
  {
    slug: 'eternal-birth-release-news',
    path: '/blog/eternal-birth-release-news',
    title: 'Eternal Birth Is Here: Miraidon ex Opens Chinese Scarlet & Violet',
    excerpt:
      'Eternal Birth (set code CSV1C) is the first Chinese Scarlet & Violet set, with Miraidon on the pack and Pokémon ex in Simplified Chinese. It comes in a 5-card and a 20-card pack, and Miraidon ex and Koraidon ex are its lead chase cards.',
    seoTitle: 'Pokémon Eternal Birth (CSV1C): Miraidon ex & Release Info',
    seoDescription:
      'Pokémon TCG Eternal Birth (set code CSV1C) is the first Chinese Scarlet & Violet set, released January 17, 2025. Miraidon ex and Koraidon ex lead it.',
    tag: 'New release',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/eternal-birth-release-hero-v1.webp`,
    heroAlt: 'Eternal Birth banner: the 5-card and 20-card booster packs with the Koraidon ex and Miriam Special Art Rares',
    glow1: 'rgb(98 78 190 / .30)',
    glow2: 'rgb(230 200 60 / .25)',
  },
  {
    slug: 'eternal-birth-set-guide',
    path: '/blog/eternal-birth-set-guide',
    title: 'Eternal Birth Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Eternal Birth (set code CSV1C) has 40 secret rares behind a 127-card main set, and its 5-card and 20-card packs have different pull odds. This guide shows every chase card and how often you can expect to pull one.',
    seoTitle: 'Pokémon Eternal Birth (CSV1C) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Eternal Birth (set code CSV1C) has 167 cards and 40 secret rares. This guide shows every chase card and the official pull odds.',
    tag: 'Set guide',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/eternal-birth-guide-hero-v1.webp`,
    heroAlt: 'Eternal Birth set guide banner: the Koraidon ex Special Art Rare 157/127 in a display case beside a row of six more chase cards',
    glow1: 'rgb(98 78 190 / .30)',
    glow2: 'rgb(230 200 60 / .25)',
  },
  {
    slug: 'eternal-birth-card-origins',
    path: '/blog/eternal-birth-card-origins',
    title: 'Where Every Eternal Birth Card Comes From',
    excerpt:
      'Eternal Birth (set code CSV1C) follows the first English Scarlet & Violet set closely, with Paldea Evolved and Obsidian Flames filling in most of the rest. We matched all 167 cards to English, and every one has an English version.',
    seoTitle: 'Pokémon Eternal Birth (CSV1C) Card Origins: English Matches',
    seoDescription:
      'All 167 Pokémon TCG Eternal Birth (set code CSV1C) cards have an English version. 134 match Scarlet & Violet and 16 match Paldea Evolved.',
    tag: 'Collecting guide',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/eternal-birth-origins-hero-v1.webp`,
    heroAlt: 'Eternal Birth card origins banner: both booster packs with tiles for Scarlet & Violet, Paldea Evolved, Obsidian Flames and four other sources',
    glow1: 'rgb(98 78 190 / .30)',
    glow2: 'rgb(230 200 60 / .25)',
  },
  {
    slug: 'miracle-journey-release-news',
    path: '/blog/miracle-journey-release-news',
    title: 'Miracle Journey Is Here: Gardevoir ex and the Paldea Starters as Pokémon ex',
    excerpt:
      'Miracle Journey (set code CSV2C) is the second Chinese Scarlet & Violet set. It puts Gardevoir on the pack and brings the final forms of the three Paldea starters as Pokémon ex. Its Gardevoir ex Special Art Rare leads the 35 secret rares.',
    seoTitle: 'Pokémon Miracle Journey (CSV2C): Gardevoir ex & Release Info',
    seoDescription:
      'Pokémon TCG Miracle Journey (set code CSV2C) released March 21, 2025 in Simplified Chinese. Gardevoir is on the pack and Gardevoir ex leads the set.',
    tag: 'New release',
    date: '2025-03-21',
    heroImage: `${SITE_URL}/assets/blog/miracle-journey-release-hero-v1.webp`,
    heroAlt: "Miracle Journey banner: the 5-card and 20-card booster packs with the Gardevoir ex Special Art Rare and the Erika's Invitation Super Rare",
    glow1: 'rgb(226 110 170 / .30)',
    glow2: 'rgb(70 160 90 / .25)',
  },
  {
    slug: 'miracle-journey-set-guide',
    path: '/blog/miracle-journey-set-guide',
    title: 'Miracle Journey Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Miracle Journey (set code CSV2C) has 35 secret rares behind a 128-card main set, and its 5-card and 20-card packs have different pull odds. This guide shows every chase card and how often you can expect to pull one.',
    seoTitle: 'Pokémon Miracle Journey (CSV2C) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Miracle Journey (set code CSV2C) has 163 cards and 35 secret rares. This guide shows every chase card and the official pull odds.',
    tag: 'Set guide',
    date: '2025-03-21',
    heroImage: `${SITE_URL}/assets/blog/miracle-journey-guide-hero-v1.webp`,
    heroAlt: 'Miracle Journey set guide banner: the Gardevoir ex Special Art Rare 155/128 in a display case beside a row of six more chase cards',
    glow1: 'rgb(226 110 170 / .30)',
    glow2: 'rgb(70 160 90 / .25)',
  },
  {
    slug: 'miracle-journey-card-origins',
    path: '/blog/miracle-journey-card-origins',
    title: 'Where Every Miracle Journey Card Comes From',
    excerpt:
      'Miracle Journey (set code CSV2C) is built mostly from Paldea Evolved and Scarlet & Violet, with Obsidian Flames filling in most of the rest. We matched all 163 cards to English, and every one has an English version.',
    seoTitle: 'Pokémon Miracle Journey (CSV2C) Card Origins: English Matches',
    seoDescription:
      'All 163 Pokémon TCG Miracle Journey (set code CSV2C) cards have an English version. 80 match Paldea Evolved and 43 match Scarlet & Violet.',
    tag: 'Collecting guide',
    date: '2025-03-21',
    heroImage: `${SITE_URL}/assets/blog/miracle-journey-origins-hero-v1.webp`,
    heroAlt: 'Miracle Journey card origins banner: the booster packs with tiles for Paldea Evolved, Scarlet & Violet, Obsidian Flames and three other sources',
    glow1: 'rgb(226 110 170 / .30)',
    glow2: 'rgb(70 160 90 / .25)',
  },
  {
    slug: 'terastal-gathering-release-news',
    path: '/blog/terastal-gathering-release-news',
    title: 'Terastal Gathering Is Here: Stellar Eeveelutions and a Second Sylveon ex SAR',
    excerpt:
      'China\'s take on Prismatic Evolutions: Eevee and all eight Eeveelutions as Stellar Tera ex, 259 cards in 10-card packs, and a Sylveon ex Special Art Rare you will not find in English.',
    seoTitle: 'Pokémon Terastal Gathering (CSV9.5C): Eeveelutions & Release Info',
    seoDescription:
      'Pokémon TCG Terastal Gathering (CSV9.5C): 259 cards, Eevee and all eight Eeveelutions as Stellar Tera ex, and a Chinese Exclusive Sylveon ex SAR.',
    tag: 'New release',
    date: '2026-06-12',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-release-hero-v14.webp`,
    heroAlt: 'Terastal Gathering booster pack with the Chinese-exclusive Sylveon ex Special Art Rare 234/208 in front',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'terastal-gathering-set-guide',
    path: '/blog/terastal-gathering-set-guide',
    title: 'Terastal Gathering Set Guide: Every Eeveelution, Chase Card and What a Box Holds',
    excerpt:
      "Terastal Gathering is the Stellar Eeveelution set, with 34 Special Art Rares in 10-card packs. This guide shows every Eeveelution and chase card, what a box holds on average, and what a master set takes.",
    seoTitle: 'Terastal Gathering (CSV9.5C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Terastal Gathering (CSV9.5C) set guide: every Eeveelution, all 34 Special Art Rares, what a 10-pack box averages, and the 601-card master set.',
    tag: 'Set guide',
    date: '2026-06-12',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-guide-hero-v11.webp`,
    heroAlt: 'The Chinese Exclusive Sylveon ex Special Art Rare in an EBI display case beside seven Eeveelution ex Special Art Rares',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'terastal-gathering-card-origins',
    path: '/blog/terastal-gathering-card-origins',
    title: 'Where Every Terastal Gathering Card Comes From',
    excerpt:
      'All 259 cards matched to English: 156 from Prismatic Evolutions, 28 arts that were only ever English promos, 73 from other Scarlet & Violet sets, and 2 new.',
    seoTitle: 'Terastal Gathering (CSV9.5C) Card Origins: English Art Matches',
    seoDescription:
      'All 259 Pokémon TCG Terastal Gathering (CSV9.5C) cards matched to English: 156 from Prismatic Evolutions, 28 promo-only arts and 73 from other sets.',
    tag: 'Collecting guide',
    date: '2026-06-12',
    heroImage: `${SITE_URL}/assets/blog/terastal-gathering-origins-hero-v10.webp`,
    heroAlt: 'Terastal Gathering pack linked to tiles for Prismatic Evolutions, promo-only art, other sets and new art',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
  },
  {
    slug: 'chasing-glory-release-news',
    path: '/blog/chasing-glory-release-news',
    title: 'Chasing Glory Is Here: Trainer\'s Pokémon in Slim and Jumbo Packs',
    excerpt:
      'The main CSV10 set brings Trainer\'s Pokémon to Simplified Chinese: 287 cards led by Team Rocket, a Chinese-exclusive Brock SAR, and two pack sizes with different odds.',
    seoTitle: "Pokémon Chasing Glory (CSV10C): Brock's Scouting & Release Info",
    seoDescription:
      "Pokémon TCG Chasing Glory (CSV10C) in Simplified Chinese: 287 cards led by Team Rocket, slim and jumbo packs, and a Chinese Exclusive Brock's Scouting SAR.",
    tag: 'New release',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-release-hero-v10.webp`,
    heroAlt: 'Chasing Glory slim and jumbo booster packs with the Chinese-exclusive Brock\'s Scouting Special Art Rare in front',
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(29 16 19 / .30)',
  },
  {
    slug: 'chasing-glory-set-guide',
    path: '/blog/chasing-glory-set-guide',
    title: 'Chasing Glory Set Guide: Slim vs Jumbo Odds, Every Chase Card and the Trainer Roster',
    excerpt:
      "Chasing Glory is the Trainer's Pokémon set, led by Team Rocket and sold in slim and jumbo boxes. This guide helps you pick a box, shows every chase card, and lists which Trainer owns which Pokémon.",
    seoTitle: 'Pokémon Chasing Glory (CSV10C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Chasing Glory (CSV10C) set guide: slim vs jumbo odds, every Ultra Rare and Special Art Rare, the Trainer roster, and the 683-card master set.',
    tag: 'Set guide',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-guide-hero-v12.webp`,
    heroAlt: "Team Rocket's Mewtwo ex Special Art Rare in an EBI display case beside seven more Special Art Rares, led by the Chinese Exclusive Brock's Scouting",
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(218 189 94 / .25)',
  },
  {
    slug: 'chasing-glory-card-origins',
    path: '/blog/chasing-glory-card-origins',
    title: 'Where Every Chasing Glory Card Comes From',
    excerpt:
      'All 287 cards traced to their English printings: 190 from Destined Rivals, 94 from Journey Together, 2 from Ascended Heroes, and one card made only for China.',
    seoTitle: 'Pokémon Chasing Glory (CSV10C) Card Origins: English Art Matches',
    seoDescription:
      'All 287 Pokémon TCG Chasing Glory (CSV10C) cards traced to English: 190 from Destined Rivals, 94 from Journey Together, 2 from Ascended Heroes and 1 new.',
    tag: 'Collecting guide',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/chasing-glory-origins-hero-v10.webp`,
    heroAlt: 'Chasing Glory jumbo and slim packs linked to tiles for Destined Rivals, Journey Together, Ascended Heroes and one new card',
    glow1: 'rgb(232 129 61 / .30)',
    glow2: 'rgb(173 49 26 / .30)',
  },
  {
    slug: '30th-celebration-release-news',
    path: '/blog/30th-celebration-release-news',
    title: '30th Celebration Is Here: 30 Pikachu, Futuristic Rares and 30 Classic Cards',
    excerpt:
      '30th Celebration is the Pokémon TCG\'s 30th anniversary set. It has a Pikachu in every pack, the new Futuristic Rare, and 30 famous cards from 1999 to 2023 in their original frames.',
    seoTitle: 'Pokémon 30th Celebration (Chinese): 30 Pikachu & Release Info',
    seoDescription:
      'Pokémon TCG 30th Celebration in Simplified Chinese has a Pikachu in every pack, the new Futuristic Rare and 30 classic cards from 1999 to 2023.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-release-hero-v14.webp`,
    heroAlt: 'The 30th Celebration booster pack with the Mew ex Futuristic Rare in front, over a blurred close-up of the Pikachu pack art',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-set-guide',
    path: '/blog/30th-celebration-set-guide',
    title: '30th Celebration Set Guide: Every Pikachu, Classic and Promo',
    excerpt:
      "30th Celebration is the Pokémon TCG's 30th anniversary set: 165 holo cards, with a Pikachu in every pack. This guide explains how the set is numbered, shows every secret rare and promo, and tells you what a master set takes.",
    seoTitle: 'Pokémon 30th Celebration Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG 30th Celebration set guide: how the 165 cards are numbered, all 30 Pikachu, every secret rare and classic card, and all 33 promos.',
    tag: 'Set guide',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-guide-hero-v10.webp`,
    heroAlt: '30th Celebration Set Guide banner: the Mewtwo ex Futuristic Rare in a display case, with six of the 30 Pikachu beside the EBI Collectibles logo',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-card-origins',
    path: '/blog/30th-celebration-card-origins',
    title: 'Where Every 30th Celebration Classic Card Comes From',
    excerpt:
      'The 30 classic cards in 30th Celebration reprint famous English cards, from Base Set Charizard in 1999 to Paldea Evolved Magikarp in 2023. This guide matches each one to its original card.',
    seoTitle: 'Pokémon 30th Celebration Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG 30th Celebration card origins: the 30 classic cards traced to English, from Base Set Charizard in 1999 to Paldea Evolved Magikarp in 2023.',
    tag: 'Collecting guide',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-origins-hero-v10.webp`,
    heroAlt: '30th Celebration Card Origins banner: the booster pack linked to tiles counting the 30 classic cards by era',
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: 'gem-vol-7-release-news',
    path: '/blog/gem-vol-7-release-news',
    title: "Gem Vol 7 Is Here: Misty's Psyduck Leads a Trainer-Paired Lineup",
    excerpt:
      "The seventh Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a brand-new Misty's Psyduck full art you can only pull here.",
    seoTitle: "Pokémon Gem Pack Vol. 7 (Gem 7): Misty's Psyduck & Release Info",
    seoDescription:
      "Pokémon TCG Gem Pack Vol. 7 (Gem 7): 196 all-holo Simplified Chinese cards, 28 Pokémon × 7 versions, and a Chinese Exclusive Misty's Psyduck full art.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-release-hero-v15.webp`,
    heroAlt: "The Gem Pack Vol. 7 booster pack with Misty's Psyduck full art, over a blurred close-up of the Psyduck pack art",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
  },
  {
    slug: 'gem-vol-7-set-guide',
    path: '/blog/gem-vol-7-set-guide',
    title: 'Gem Vol 7 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      "Each of the 28 Pokémon comes in seven versions, from a common holo to a full art, and 19 of them are paired with a Trainer like Misty's Psyduck. This guide shows how to tell the versions apart and what it really takes to finish the set.",
    seoTitle: 'Pokémon Gem Pack Vol. 7 (Gem 7) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 7 (Gem 7) set guide: how to tell the seven versions apart, all 28 full arts, the Trainer lineup and the 196-card master set.',
    tag: 'Set guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-guide-hero-v1.webp`,
    heroAlt: "Gem Vol. 7 set guide banner: the Chinese Exclusive Misty's Psyduck 0307/07 full art with the seven Misty's Psyduck cards below",
    glow1: 'rgb(58 110 165 / .30)',
    glow2: 'rgb(138 61 120 / .22)',
  },
  {
    slug: 'gem-vol-6-release-news',
    path: '/blog/gem-vol-6-release-news',
    title: 'Gem Vol 6 Is Here: Applin Leads an All-Holo Lineup',
    excerpt:
      'The sixth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, the whole apple family, and an Applin full art you can only pull here.',
    seoTitle: 'Pokémon Gem Pack Vol. 6 (Gem 6): Applin Full Art & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 6 (Gem 6): 196 all-holo Simplified Chinese cards, 28 Pokémon × 7 versions, and a Chinese Exclusive Applin full art.',
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-release-hero-v16.webp`,
    heroAlt: "The Gem Pack Vol. 6 booster pack with the Applin full art, over a blurred close-up of the Applin pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(78 119 104 / .30)',
  },
  {
    slug: 'gem-vol-6-set-guide',
    path: '/blog/gem-vol-6-set-guide',
    title: 'Gem Vol 6 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      "Each of the 28 Pokémon comes in seven versions, from a common holo to a full art, and Applin's full art is a Chinese Exclusive. This guide shows how to tell them apart and what it really takes to finish the set.",
    seoTitle: 'Pokémon Gem Pack Vol. 6 (Gem 6) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 6 (Gem 6) set guide: how to tell the seven versions apart, all 28 full arts, the full roster, and the 196-card master set.',
    tag: 'Set guide',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-guide-hero-v10.webp`,
    heroAlt: "Gem Vol. 6 Set Guide banner: the Applin full art 1907/07 in a display case, with six holo Applin versions beside the EBI Collectibles logo",
    glow1: 'rgb(78 119 104 / .30)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-6-card-origins',
    path: '/blog/gem-vol-6-card-origins',
    title: 'Where Every Gem Vol 6 Card Actually Comes From',
    excerpt:
      "55 of the 56 illustrations in Gem Vol 6 are reused from English Scarlet & Violet cards, mostly Surging Sparks. Here's the full card-by-card map.",
    seoTitle: 'Pokémon Gem Pack Vol. 6 (Gem 6) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 6 (Gem 6) card origins: 55 of the 56 illustrations reuse English Scarlet & Violet cards, mostly Surging Sparks.',
    tag: 'Collecting guide',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-origins-hero-v12.webp`,
    heroAlt: "Gem Vol. 6 Card Origins banner: the Applin booster pack linked to tiles showing where its 56 illustrations came from, led by Surging Sparks",
    glow1: 'rgb(78 119 104 / .28)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-5-release-news',
    path: '/blog/gem-vol-5-release-news',
    title: 'Gem Vol 5 Is Here: Pokémon Horizons Sets Sail in the Gem Pack',
    excerpt:
      'The fifth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and four Pokémon Horizons full arts led by Captain Pikachu.',
    seoTitle: 'Pokémon Gem Pack Vol. 5 (Gem 5): Captain Pikachu & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 5 (Gem 5): 196 all-holo Simplified Chinese cards, 28 Pokémon × 7 versions, and four Chinese Exclusive Pokémon Horizons full arts.',
    tag: 'New release',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-release-hero-v14.webp`,
    heroAlt: "The Gem Pack Vol. 5 booster pack with the Captain Pikachu and Friede full art in front, over a blurred close-up of the Floragato pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(214 170 60 / .28)',
  },
  {
    slug: 'gem-vol-5-set-guide',
    path: '/blog/gem-vol-5-set-guide',
    title: 'Gem Vol 5 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'Each of the 28 Pokémon comes in seven versions, from a common holo to a full art, and four of the full arts are Chinese Exclusive Pokémon Horizons cards. This guide shows how to tell the versions apart and what it really takes to finish the set.',
    seoTitle: 'Pokémon Gem Pack Vol. 5 (Gem 5) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 5 (Gem 5) set guide: how to tell the seven versions apart, all 28 full arts, the four Horizons cards and the 196-card master set.',
    tag: 'Set guide',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-guide-hero-v10.webp`,
    heroAlt: "Gem Vol. 5 Set Guide banner: the Captain Pikachu and Friede full art 0107/07 in a display case, with six holo Captain Pikachu versions beside the EBI Collectibles logo",
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-5-card-origins',
    path: '/blog/gem-vol-5-card-origins',
    title: 'Where Every Gem Vol 5 Card Actually Comes From',
    excerpt:
      '51 of the 56 illustrations in Gem Vol 5 are reused from English cards, mostly Surging Sparks. The other five are new Pokémon Horizons art. Here\'s the full card-by-card map.',
    seoTitle: 'Pokémon Gem Pack Vol. 5 (Gem 5) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 5 (Gem 5) card origins: 51 of the 56 illustrations reuse English cards, mostly Surging Sparks, and five are new Horizons art.',
    tag: 'Collecting guide',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-origins-hero-v11.webp`,
    heroAlt: "Gem Vol. 5 Card Origins banner: the Floragato booster pack linked to tiles showing where its 56 illustrations came from, led by Surging Sparks",
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-release-news',
    path: '/blog/gem-vol-4-release-news',
    title: 'Gem Vol 4 Is Here: Ponyta Gallops In for the Year of the Horse',
    excerpt:
      'The fourth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a new Ponyta full art you can only pull here.',
    seoTitle: 'Pokémon Gem Pack Vol. 4 (Gem 4): Ponyta Full Art & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 4 (Gem 4): 196 all-holo Simplified Chinese cards, 28 Pokémon × 7 versions, and a Chinese Exclusive Ponyta full art.',
    tag: 'New release',
    date: '2026-02-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-release-hero-v14.webp`,
    heroAlt: "The Gem Pack Vol. 4 booster pack with the Ponyta full art, over a blurred close-up of the Ponyta pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(208 129 105 / .30)',
  },
  {
    slug: 'gem-vol-4-set-guide',
    path: '/blog/gem-vol-4-set-guide',
    title: 'Gem Vol 4 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      "Each of the 28 Pokémon comes in seven versions, from a common holo to a full art, led by Ponyta's Chinese Exclusive. This guide shows how to tell them apart and what it really takes to finish the set.",
    seoTitle: 'Pokémon Gem Pack Vol. 4 (Gem 4) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 4 (Gem 4) set guide: how to tell the seven versions apart, all 28 full arts, the full roster, and the 196-card master set.',
    tag: 'Set guide',
    date: '2026-02-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-guide-hero-v10.webp`,
    heroAlt: "Gem Vol. 4 Set Guide banner: the Ponyta full art 0107/07 in a display case, with six holo Ponyta versions beside the EBI Collectibles logo",
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-card-origins',
    path: '/blog/gem-vol-4-card-origins',
    title: 'Where Every Gem Vol 4 Card Actually Comes From',
    excerpt:
      '55 of the 56 illustrations in Gem Vol 4 are reused from English cards, mostly Temporal Forces and Twilight Masquerade. Here\'s the full card-by-card map.',
    seoTitle: 'Pokémon Gem Pack Vol. 4 (Gem 4) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 4 (Gem 4) card origins: 55 of the 56 illustrations reuse English cards, mostly Temporal Forces and Twilight Masquerade.',
    tag: 'Collecting guide',
    date: '2026-02-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-origins-hero-v12.webp`,
    heroAlt: "Gem Vol. 4 Card Origins banner: the Ponyta booster pack linked to tiles showing where its 56 illustrations came from, led by Temporal Forces",
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-3-release-news',
    path: '/blog/gem-vol-3-release-news',
    title: 'Gem Vol 3 Is Here: Gengar Leads a Night Out in the Gem Pack',
    excerpt:
      'The third Simplified Chinese Gem Pack: 136 all-holo cards of night-time Pokémon, nine Pokémon ex, and five new full arts you can only pull here.',
    seoTitle: 'Pokémon Gem Pack Vol. 3 (Gem 3): Gengar & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 3 (Gem 3): 136 all-holo Simplified Chinese cards of night-time Pokémon, nine Pokémon ex, and five Chinese Exclusive full arts.',
    tag: 'New release',
    date: '2025-09-26',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-release-hero-v14.webp`,
    heroAlt: "The Gem Pack Vol. 3 booster pack with the Cubone full art in front, flanked by Meowth and Gengar, over a blurred close-up of the Gengar pack art",
    glow1: 'rgb(102 63 90 / .32)',
    glow2: 'rgb(214 169 151 / .26)',
  },
  {
    slug: 'gem-vol-3-set-guide',
    path: '/blog/gem-vol-3-set-guide',
    title: 'Gem Vol 3 Set Guide: Every Full Art, Every ex and Box Math',
    excerpt:
      'Gem 3 mixes 18 Pokémon with nine Pokémon ex and Trainer and Energy cards, and five of its full arts are Chinese Exclusives. This guide explains how the numbering works and what it really takes to finish the set.',
    seoTitle: 'Pokémon Gem Pack Vol. 3 (Gem 3) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 3 (Gem 3) set guide: all nine full arts and nine Pokémon ex, the Trainers and Energy, and the 136-card master set.',
    tag: 'Set guide',
    date: '2025-09-26',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-guide-hero-v11.webp`,
    heroAlt: "Gem Vol. 3 Set Guide banner: the Chinese Exclusive Gengar full art 0307/07 in a display case, with six holo Gengar versions beside the EBI Collectibles logo",
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-3-card-origins',
    path: '/blog/gem-vol-3-card-origins',
    title: 'Where Every Gem Vol 3 Card Actually Comes From',
    excerpt:
      '35 of the 40 illustrations in Gem Vol 3 are reused from English cards, mostly 2023 Scarlet & Violet sets. The other five are new full arts drawn for the set. Here\'s the full map.',
    seoTitle: 'Pokémon Gem Pack Vol. 3 (Gem 3) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 3 (Gem 3) card origins: 35 of the 40 illustrations reuse English cards, mostly 2023 Scarlet & Violet sets, and five are new full arts.',
    tag: 'Collecting guide',
    date: '2025-09-26',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-origins-hero-v12.webp`,
    heroAlt: "Gem Vol. 3 Card Origins banner: the Gengar booster pack linked to tiles showing where its 40 illustrations came from, led by Obsidian Flames",
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-2-release-news',
    path: '/blog/gem-vol-2-release-news',
    title: 'Gem Vol 2 Is Here: Eevee and Friends, With Four Full Arts That Form One Scene',
    excerpt:
      'The second Simplified Chinese Gem Pack: 140 all-holo cards across Eevee and all eight Eeveelutions, a V and VMAX for each, and four exclusive full arts that join into one forest scene.',
    seoTitle: 'Pokémon Gem Pack Vol. 2 (Gem 2): Eeveelutions & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 2 (Gem 2): 140 all-holo Simplified Chinese cards, Eevee and all eight Eeveelutions, and four Chinese Exclusive full arts.',
    tag: 'New release',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-release-hero-v14.webp`,
    heroAlt: "The Gem Pack Vol. 2 booster pack with the Sylveon full art, over a blurred close-up of the Sylveon pack art",
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(86 134 135 / .30)',
  },
  {
    slug: 'gem-vol-2-set-guide',
    path: '/blog/gem-vol-2-set-guide',
    title: 'Gem Vol 2 Set Guide: Every V, VMAX and Full Art, Plus Box Math',
    excerpt:
      'Eevee and its eight evolutions fill Gem 2, with V and VMAX cards and four Chinese Exclusive full arts. This guide explains how the numbering works and what it really takes to finish the set.',
    seoTitle: 'Pokémon Gem Pack Vol. 2 (Gem 2) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 2 (Gem 2) set guide: the four Chinese Exclusive full arts, all nine V and VMAX, the full roster, and the 140-card master set.',
    tag: 'Set guide',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-guide-hero-v12.webp`,
    heroAlt: "Gem Vol. 2 Set Guide banner: the Chinese Exclusive Sylveon full art 0915/15 in a display case, with six holo Sylveon versions beside the EBI Collectibles logo",
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-2-card-origins',
    path: '/blog/gem-vol-2-card-origins',
    title: 'Where Every Gem Vol 2 Card Actually Comes From',
    excerpt:
      '40 of the 44 illustrations in Gem Vol 2 are reused from English cards, mostly Sword & Shield promos and Evolving Skies. The other four are new full arts drawn for the set. Here\'s the full map.',
    seoTitle: 'Pokémon Gem Pack Vol. 2 (Gem 2) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 2 (Gem 2) card origins: 40 of the 44 illustrations reuse English cards, mostly Sword & Shield promos and Evolving Skies.',
    tag: 'Collecting guide',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-origins-hero-v13.webp`,
    heroAlt: "Gem Vol. 2 Card Origins banner: the Sylveon booster pack linked to tiles showing where its 44 illustrations came from, led by Sword & Shield promos",
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-1-release-news',
    path: '/blog/gem-vol-1-release-news',
    title: 'Gem Vol 1 Is Here: Paldea Starters, Captain Pikachu and Four Horizons Full Arts',
    excerpt:
      'The first Simplified Chinese Gem Pack: 115 all-holo cards with Sprigatito, Fuecoco, Quaxly, their middle evolutions and Captain Pikachu, plus four Chinese Exclusive Horizons full arts.',
    seoTitle: 'Pokémon Gem Pack Vol. 1 (Gem 1): Paldea Starters & Release Info',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 1 (CBB1C): 115 all-holo Simplified Chinese cards, the Paldea starters, Captain Pikachu and four Chinese Exclusive full arts.',
    tag: 'New release',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-1-release-hero-v1.webp`,
    heroAlt: 'Gem Pack Vol. 1 banner: the Sprigatito booster pack with the Captain Pikachu and Liko and Sprigatito Horizons full arts',
    glow1: 'rgb(194 26 118 / .30)',
    glow2: 'rgb(151 202 224 / .22)',
  },
  {
    slug: 'gem-vol-1-set-guide',
    path: '/blog/gem-vol-1-set-guide',
    title: 'Gem Vol 1 Set Guide: Every Full Art, Every Shiny-Style Card and the Odds',
    excerpt:
      'The first Gem Pack mixes 9-, 8- and 5-card runs, so the numbering takes a minute to learn. This guide explains it, shows the four Chinese Exclusive Horizons full arts, and works out what it takes to finish the set.',
    seoTitle: 'Pokémon Gem Pack Vol. 1 (Gem 1) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 1 (Gem 1) set guide: the four Chinese Exclusive Horizons full arts, every full art, print shares and the 115-card master set.',
    tag: 'Set guide',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-1-guide-hero-v1.webp`,
    heroAlt: 'Gem Vol. 1 set guide banner: the Sprigatito 0109/09 Horizons full art with all nine Sprigatito cards below',
    glow1: 'rgb(151 202 224 / .22)',
    glow2: 'rgb(194 26 118 / .30)',
  },
  {
    slug: 'gem-vol-1-card-origins',
    path: '/blog/gem-vol-1-card-origins',
    title: 'Where Every Gem Vol 1 Card Actually Comes From',
    excerpt:
      '33 of the 38 illustrations in Gem Vol 1 are reused from English cards, nearly half from Paldea Evolved. The other five are Pokémon Horizons art, including four Chinese Exclusive full arts.',
    seoTitle: 'Pokémon Gem Pack Vol. 1 (Gem 1) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 1 (Gem 1) card origins: 33 of the 38 illustrations reuse English Scarlet & Violet cards, the most from Paldea Evolved.',
    tag: 'Collecting guide',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-1-origins-hero-v1.webp`,
    heroAlt: 'Gem Vol. 1 card origins banner: the Sprigatito pack with tiles for Paldea Evolved, Scarlet & Violet, three other sets and five new Horizons illustrations',
    glow1: 'rgb(151 202 224 / .22)',
    glow2: 'rgb(194 26 118 / .30)',
  },
  {
    slug: 'gem-vol-7-card-origins',
    path: '/blog/gem-vol-7-card-origins',
    title: 'Where Every Gem Vol 7 Card Actually Comes From',
    excerpt:
      "55 of the 56 illustrations in Gem Vol 7 are reused from English cards, mostly Destined Rivals and Journey Together. Here's the full card-by-card map.",
    seoTitle: 'Pokémon Gem Pack Vol. 7 (Gem 7) Card Origins: English Art Matches',
    seoDescription:
      'Pokémon TCG Gem Pack Vol. 7 (Gem 7) card origins: 55 of the 56 illustrations reuse English cards, mostly Destined Rivals and Journey Together.',
    tag: 'Collecting guide',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-origins-hero-v13.webp`,
    heroAlt: "Gem Vol. 7 Card Origins banner: the Psyduck booster pack linked to tiles showing where its 56 illustrations came from, led by Destined Rivals",
    glow1: 'rgb(58 110 165 / .28)',
    glow2: 'rgb(138 61 120 / .22)',
  },
]

export const BLOG_SITE_URL = SITE_URL
