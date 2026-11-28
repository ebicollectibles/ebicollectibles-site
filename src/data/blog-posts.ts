// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blog
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'chinese-pokemon-sets-in-order' | 'how-to-read-chinese-pokemon-cards' | 'chinese-pokemon-card-rarities' | 'chinese-pokemon-slim-vs-jumbo' | 'are-chinese-pokemon-cards-real' | 'simplified-vs-traditional-chinese-pokemon-cards' | 'chinese-vs-english-pokemon-cards' | 'are-chinese-pokemon-cards-tournament-legal' | 'chinese-exclusive-pokemon-cards' | 'what-is-a-gem-pack' | 'chinese-pokemon-set-english-equivalents' | 'gem-vol-7-release-news' | 'gem-vol-7-set-guide' | 'gem-vol-7-card-origins' | 'gem-vol-6-release-news' | 'gem-vol-6-set-guide' | 'gem-vol-6-card-origins' | 'gem-vol-5-release-news' | 'gem-vol-5-set-guide' | 'gem-vol-5-card-origins' | 'gem-vol-4-release-news' | 'gem-vol-4-set-guide' | 'gem-vol-4-card-origins' | 'gem-vol-3-release-news' | 'gem-vol-3-set-guide' | 'gem-vol-3-card-origins' | 'gem-vol-2-release-news' | 'gem-vol-2-set-guide' | 'gem-vol-2-card-origins' | 'gem-vol-1-release-news' | 'gem-vol-1-set-guide' | 'gem-vol-1-card-origins' | '30th-celebration-release-news' | '30th-celebration-set-guide' | '30th-celebration-card-origins' | 'chasing-glory-release-news' | 'chasing-glory-set-guide' | 'chasing-glory-card-origins' | 'terastal-gathering-release-news' | 'terastal-gathering-set-guide' | 'terastal-gathering-card-origins' | 'reward-round-release-news' | 'reward-round-set-guide' | 'reward-round-card-origins' | 'fearless-terastal-release-news' | 'fearless-terastal-set-guide' | 'fearless-terastal-card-origins' | 'eternal-birth-release-news' | 'eternal-birth-set-guide' | 'eternal-birth-card-origins' | 'miracle-journey-release-news' | 'miracle-journey-set-guide' | 'miracle-journey-card-origins' | 'black-crystal-blaze-release-news' | 'black-crystal-blaze-set-guide' | 'black-crystal-blaze-card-origins' | 'black-bolt-white-flare-release-news' | 'black-bolt-set-guide' | 'black-bolt-card-origins' | 'white-flare-set-guide' | 'white-flare-card-origins' | 'true-mystery-release-news' | 'true-mystery-set-guide' | 'true-mystery-card-origins' | 'blade-awakening-release-news' | 'blade-awakening-set-guide' | 'blade-awakening-card-origins' | 'brilliant-fantasy-release-news' | 'brilliant-fantasy-set-guide' | 'brilliant-fantasy-card-origins' | 'stellar-crystal-release-news' | 'stellar-crystal-set-guide' | 'stellar-crystal-card-origins' | 'pikachu-dream-painting-figures-release-news' | 'funism-ditto-palm-size-wonders-release-news' | 'team-rocket-briefcase-release-news' | 'pikachu-gift-box-release-news' | 'day-night-gift-box-release-news' | 'greninja-sylveon-display-set-release-news' | 'charizard-figure-box-release-news' | 'nuzzle-cheeks-plush-card-display-release-news' | 'eevee-gift-box-release-news' | 'gem-badge-set-1-release-news' | 'gem-badge-set-2-release-news' | 'pikachu-30th-plush-keychain-release-news' | 'funism-first-partner-mini-figures-release-news' | 'first-partner-30th-vol-1-release-news' | 'first-partner-30th-vol-2-release-news' | 'first-partner-30th-vol-3-release-news' | 'aura-seeker-release-news' | 'pokemon-30th-shanghai-gold-pikachu-cards-news' | '30th-celebration-pikachu-cards-artists' | 'futuristic-pikachu-box-release-news' | 'lisia-gift-box-release-news' | 'ogerpon-mask-gift-box-release-news' | 'lillie-n-battle-box-release-news' | 'japanese-30th-celebration-release-news' | 'storm-emeralda-release-news' | 'master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news' | 'master-strategy-deck-charizard-gardevoir-miraidon-release-news' | 'espeon-umbreon-deluxe-deck-release-news' | 'journey-gift-boxes-release-news' | 'collect-151-first-partner-display-sets-release-news' | 'eevee-dream-painting-figures-release-news' | 'dream-painting-151-vol-1-release-news' | 'dream-painting-water-vol-2-release-news' | 'chinese-gem-pack-hit-rates' | 'chinese-booster-box-guaranteed-hits' | 'collect-151-journey-release-news' | 'collect-151-hope-release-news' | 'collect-151-surprise-release-news' | 'collect-151-gathering-release-news' | 'collect-151-set-guide' | 'collect-151-card-origins' | 'dynamax-clash-thunder-release-news' | 'dynamax-clash-thunder-card-origins' | 'dynamax-clash-thunder-set-guide' | 'dynamax-clash-flame-release-news' | 'dynamax-clash-flame-card-origins' | 'dynamax-clash-flame-set-guide' | 'dynamax-tactics-release-news' | 'dynamax-tactics-card-origins' | 'dynamax-tactics-set-guide' | 'vivid-portrayals-obsidian-release-news' | 'vivid-portrayals-obsidian-card-origins' | 'vivid-portrayals-obsidian-set-guide' | 'vivid-portrayals-indigo-release-news' | 'vivid-portrayals-indigo-card-origins' | 'vivid-portrayals-indigo-set-guide' | 'brilliant-counterattack-release-news' | 'brilliant-counterattack-card-origins' | 'brilliant-counterattack-set-guide' | 'primordial-arts-overgrow-release-news' | 'primordial-arts-overgrow-card-origins' | 'primordial-arts-overgrow-set-guide' | 'primordial-arts-torrent-release-news' | 'primordial-arts-torrent-card-origins' | 'primordial-arts-torrent-set-guide'

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
    slug: 'chinese-exclusive-pokemon-cards',
    path: '/blog/chinese-exclusive-pokemon-cards',
    title: 'Every Chinese Exclusive Pokémon Card, Set by Set',
    excerpt:
      'Every card our Simplified Chinese set lists mark as a Chinese Exclusive, grouped by set and newest first, with card numbers, rarities and a link to each card.',
    seoTitle: 'Chinese Exclusive Pokémon Cards: Full List by Set',
    seoDescription:
      'Every Chinese Exclusive Pokémon card in the Simplified Chinese TCG, set by set: Gem Packs, CSV main sets and Collect 151, with numbers, rarities and images.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-exclusive-cards-hero.webp`,
    heroAlt: "Every Chinese Exclusive banner: the Captain Pikachu full art from Gem Vol. 5 in front, with Misty's Psyduck and Eevee beside it and the N's Plan and Hilda Special Art Rares behind",
    glow1: 'rgb(200 16 46 / .24)',
    glow2: 'rgb(64 130 170 / .30)',
  },
  {
    slug: 'what-is-a-gem-pack',
    path: '/blog/what-is-a-gem-pack',
    title: 'What Is a Gem Pack? The All-Holo Chinese Pokémon Packs Explained',
    excerpt:
      'A Gem Pack is a Simplified Chinese Pokémon TCG pack of 4 holo cards, one of them always Rare or better. What is in a pack, how the sets are built and every volume so far.',
    seoTitle: 'What Is a Pokémon Gem Pack? Chinese All-Holo Packs, Vol. 1–7',
    seoDescription:
      'A Pokémon Gem Pack is a Simplified Chinese pack of 4 holo cards, one Rare or better. Box sizes, odds, chase cards and all 7 volumes, explained.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/what-is-a-gem-pack-hero.webp`,
    heroAlt: 'What Is a Gem Pack banner: the Gem Pack Vol. 7 Psyduck booster pack in front, with the Vol. 6 Applin and Vol. 5 Floragato packs behind it',
    glow1: 'rgb(222 4 123 / .26)',
    glow2: 'rgb(58 110 165 / .30)',
  },
  {
    slug: 'chinese-pokemon-set-english-equivalents',
    path: '/blog/chinese-pokemon-set-english-equivalents',
    title: 'Chinese Pokémon Sets and Their English Equivalents',
    excerpt:
      'Which English sets each Simplified Chinese Pokémon set takes its cards from, counted card by card, with the Japanese sets for Collect 151 and 30th Celebration and the Gem Packs marked as their own line.',
    seoTitle: 'Chinese Pokémon Sets: English Equivalents for Every Set',
    seoDescription:
      'Each Simplified Chinese Pokémon TCG set and the English sets its cards come from, with card counts: CSV main sets, Collect 151, 30th Celebration and Gem Packs.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-set-english-equivalents-hero.webp`,
    heroAlt: 'Chinese Sets and English Equivalents banner: the Simplified Chinese Black Bolt and White Flare booster packs side by side',
    glow1: 'rgb(64 130 170 / .30)',
    glow2: 'rgb(200 200 210 / .20)',
  },
  {
    slug: 'true-mystery-release-news',
    path: '/blog/true-mystery-release-news',
    title: 'True Mystery Is Here: Iron Valiant ex, Roaring Moon ex and a Chinese Exclusive Iron Hands ex Special Art Rare',
    excerpt:
      'True Mystery (set code CSV6C) brings the Paradox Pokémon to Simplified Chinese, with Iron Valiant on the pack and slim and jumbo boxes. Its Chinese Exclusive is an Iron Hands ex Special Art Rare.',
    seoTitle: 'Pokémon True Mystery (CSV6C): Iron Valiant ex & Release Info',
    seoDescription:
      'Pokémon TCG True Mystery (CSV6C) in Simplified Chinese: Iron Valiant on the pack, slim and jumbo boxes, and a Chinese Exclusive Iron Hands ex Special Art Rare.',
    tag: 'New release',
    date: '2025-11-07',
    heroImage: `${SITE_URL}/assets/blog/true-mystery-release-hero.webp`,
    heroAlt: 'True Mystery slim and jumbo booster packs with the Roaring Moon ex Special Art Rare in front and the Iron Valiant ex Special Art Rare behind',
    glow1: 'rgb(86 206 210 / .30)',
    glow2: 'rgb(110 60 150 / .35)',
  },
  {
    slug: 'true-mystery-set-guide',
    path: '/blog/true-mystery-set-guide',
    title: 'True Mystery Set Guide: Slim vs Jumbo, Every Chase Card and the Paradox Runs',
    excerpt:
      'True Mystery (set code CSV6C) is the Paradox set, with Iron Valiant on the pack. This guide helps you choose between slim and jumbo boxes and plan a 393-card master set.',
    seoTitle: 'Pokémon True Mystery (CSV6C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG True Mystery (CSV6C) is the Paradox set, with Iron Valiant on the pack. This guide compares slim and jumbo boxes and shows what a 393-card master set takes.',
    tag: 'Set guide',
    date: '2025-11-07',
    heroImage: `${SITE_URL}/assets/blog/true-mystery-guide-hero.webp`,
    heroAlt: 'The Roaring Moon ex Special Art Rare in an EBI display case above six more True Mystery Special Art Rares',
    glow1: 'rgb(86 206 210 / .30)',
    glow2: 'rgb(110 60 150 / .35)',
  },
  {
    slug: 'true-mystery-card-origins',
    path: '/blog/true-mystery-card-origins',
    title: 'Where Every True Mystery Card Comes From',
    excerpt:
      'All 163 True Mystery (set code CSV6C) cards matched to their English versions: 128 from Paradox Rift, 16 from Obsidian Flames, 15 from Paldean Fates, 2 from other sources and 2 that do not exist in English.',
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
    title: 'Brilliant Fantasy Is Here: Milotic ex, Every Ogerpon Mask and a Chinese Exclusive Carmine Special Art Rare',
    excerpt:
      'Brilliant Fantasy (set code CSV8C) is the Kitakami set, with Milotic on the pack and all four Ogerpon ex. Its Chinese Exclusive is a Carmine Special Art Rare with a new illustration.',
    seoTitle: 'Pokémon Brilliant Fantasy (CSV8C): Milotic ex & Release Info',
    seoDescription:
      'Pokémon TCG Brilliant Fantasy (CSV8C) is the Kitakami set, with Milotic on the pack and all four Ogerpon ex. Its Chinese Exclusive is a Carmine Special Art Rare.',
    tag: 'New release',
    date: '2026-03-13',
    heroImage: `${SITE_URL}/assets/blog/brilliant-fantasy-release-hero.webp`,
    heroAlt: 'Brilliant Fantasy jumbo and slim booster packs with the Milotic ex Special Art Rare in front and the Carmine Special Art Rare behind',
    glow1: 'rgb(56 13 40 / .30)',
    glow2: 'rgb(64 155 148 / .25)',
  },
  {
    slug: 'brilliant-fantasy-set-guide',
    path: '/blog/brilliant-fantasy-set-guide',
    title: 'Brilliant Fantasy Set Guide: Slim vs Jumbo, Every Chase Card and the Ogerpon Run',
    excerpt:
      "Brilliant Fantasy (set code CSV8C) is the Kitakami set, with Milotic on the pack and every Ogerpon mask. This guide helps you choose between slim and jumbo boxes and plan a 616-card master set.",
    seoTitle: 'Pokémon Brilliant Fantasy (CSV8C) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG Brilliant Fantasy (CSV8C) is the Kitakami set. This guide compares slim and jumbo boxes and shows what a 616-card master set takes.',
    tag: 'Set guide',
    date: '2026-03-13',
    heroImage: `${SITE_URL}/assets/blog/brilliant-fantasy-guide-hero.webp`,
    heroAlt: 'The Milotic ex Special Art Rare in an EBI display case, with six more Brilliant Fantasy Special Art Rares below it',
    glow1: 'rgb(56 13 40 / .30)',
    glow2: 'rgb(64 155 148 / .25)',
  },
  {
    slug: 'brilliant-fantasy-card-origins',
    path: '/blog/brilliant-fantasy-card-origins',
    title: 'Where Every Brilliant Fantasy Card Comes From',
    excerpt:
      'All 264 cards in Brilliant Fantasy (set code CSV8C) matched to English. 109 match Twilight Masquerade, 76 match Shrouded Fable, and one is a Chinese Exclusive.',
    seoTitle: 'Pokémon Brilliant Fantasy (CSV8C) Card Origins: English Art Matches',
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
    heroImage: `${SITE_URL}/assets/blog/pikachu-dream-painting-figures-release-hero-v11.webp`,
    heroAlt: 'Dream Painting Pikachu figure blind box with the secret classic Pikachu figure and card 136/103 in front',
    glow1: 'rgb(246 206 60 / .30)',
    glow2: 'rgb(222 185 97 / .25)',
  },
  {
    slug: 'charizard-figure-box-release-news',
    path: '/blog/charizard-figure-box-release-news',
    title: 'Chinese Charizard Collector Figure Box: The Figure, the Jumbo Card and 15 Packs',
    excerpt:
      "Pokémon China's Charizard collector figure box released on September 16, 2026, alongside 30th Celebration. This post covers everything in it: a Charizard figure made from the classic card, a jumbo Charizard card and 15 booster packs.",
    seoTitle: 'Chinese Charizard 30th Celebration Figure Box: Jumbo Card & Contents',
    seoDescription:
      'The Chinese Pokémon TCG 30th Celebration Charizard figure box: a Charizard figure, a jumbo Charizard 137/103 card and 15 booster packs.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/charizard-figure-box-release-hero.webp`,
    heroAlt: 'The Charizard collector figure box with the Charizard figure and its jumbo card standing in front of it',
    glow1: 'rgb(246 150 70 / .30)',
    glow2: 'rgb(150 30 30 / .30)',
  },
  {
    slug: 'nuzzle-cheeks-plush-card-display-release-news',
    path: '/blog/nuzzle-cheeks-plush-card-display-release-news',
    title: 'Chinese Nuzzle Cheeks Plush Card Display Blind Box: All 7 Plushes, Promo Cards and Odds',
    excerpt:
      "Pokémon China's Nuzzle Cheeks plush card display box released on December 19, 2025. Each box holds one random Electric-type plush, its promo card, a card display frame and 2 booster packs, and about 1 box in 48 has the secret Pawmi.",
    seoTitle: 'Chinese Nuzzle Cheeks Plush Blind Box: Promos, Secret & Odds',
    seoDescription:
      'The Chinese Pokémon TCG Nuzzle Cheeks plush card display box: 6 Electric-type plushes and a secret Pawmi, each with its own promo card, plus 2 packs.',
    tag: 'New release',
    date: '2025-12-19',
    heroImage: `${SITE_URL}/assets/blog/nuzzle-cheeks-plush-blind-box-hero.webp`,
    heroAlt: 'The Pikachu plush hugging its promo card in a clear display frame, in front of the round Nuzzle Cheeks box',
    glow1: 'rgb(250 208 70 / .30)',
    glow2: 'rgb(110 170 230 / .22)',
  },
  {
    slug: 'eevee-gift-box-release-news',
    path: '/blog/eevee-gift-box-release-news',
    title: 'Chinese Eevee and Friends Gift Box: Espeon ex and Umbreon ex Promos, 15 Terastal Gathering Packs and Everything Inside',
    excerpt:
      "Pokémon China's Eevee and Friends gift box released on June 12, 2026, alongside Terastal Gathering. This post covers everything in it: the Espeon ex and Umbreon ex promos, the 15 booster packs, the playmat, the deck box and the rest of the accessories.",
    seoTitle: 'Chinese Eevee & Friends Gift Box: Espeon ex, Umbreon ex & Contents',
    seoDescription:
      'The Chinese Pokémon TCG Eevee and Friends gift box: Espeon ex and Umbreon ex promos, 15 Terastal Gathering packs (China’s Prismatic Evolutions) and accessories.',
    tag: 'New release',
    date: '2026-06-12',
    heroImage: `${SITE_URL}/assets/blog/eevee-gift-box-release-hero.webp`,
    heroAlt: 'The white Eevee and Friends gift box with the Espeon ex and Umbreon ex promo cards side by side in front of it',
    glow1: 'rgb(240 200 130 / .28)',
    glow2: 'rgb(196 160 232 / .25)',
  },
  {
    slug: 'gem-badge-set-1-release-news',
    path: '/blog/gem-badge-set-1-release-news',
    title: 'Chinese Gem Pack Badge Set: Gem Pack Vol. 1 to 3, a Starter Promo and 47 Badges',
    excerpt:
      "Pokémon China's Gem Pack Badge Set released on January 16, 2026. This post covers what is in it: one pack each of Gem Pack Vol. 1, 2 and 3, one of three starter promo cards and one of 47 Gem Pack badges, with the official hidden badge ratio.",
    seoTitle: 'Chinese Gem Pack Badge Set: Contents, Promos & 47 Badges',
    seoDescription:
      'The Chinese Gem Pack Badge Set: 3 Gem Packs (Vol. 1 to 3), a Sprigatito, Fuecoco or Quaxly promo and 1 of 47 badges, with the official hidden badge ratio.',
    tag: 'New release',
    date: '2026-01-16',
    heroImage: `${SITE_URL}/assets/blog/gem-badge-set-1-release-hero.webp`,
    heroAlt: 'The pink Gem Pack Badge Set pouch with Sprigatito on the front, the Gem Pack logo badge in front of it and the Sprigatito promo card beside it',
    glow1: 'rgb(246 128 184 / .28)',
    glow2: 'rgb(140 210 120 / .22)',
  },
  {
    slug: 'gem-badge-set-2-release-news',
    path: '/blog/gem-badge-set-2-release-news',
    title: 'Chinese Gem Pack Badge Set 2: Gem Pack Vol. 4 to 6 and 52 Badges',
    excerpt:
      "Pokémon China's Gem Pack Badge Set 2 released on November 6, 2026, the same day as Gem Pack Vol. 7. This post covers what is in it: one pack each of Gem Pack Vol. 4, 5 and 6 and one of 52 Gem Pack badges, with the official hidden badge ratio.",
    seoTitle: 'Chinese Gem Pack Badge Set 2: Contents & All 52 Badges',
    seoDescription:
      'The Chinese Gem Pack Badge Set 2: one pack each of Gem Pack Vol. 4, 5 and 6 and 1 of 52 badges, 6 of them hidden, with the official production ratio.',
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-badge-set-2-release-hero.webp`,
    heroAlt: 'The Gem Pack Badge Set 2 pouch with Floragato on the front between the pink Gem Pack logo badge and the hidden Floragato badge',
    glow1: 'rgb(214 160 248 / .28)',
    glow2: 'rgb(130 200 140 / .22)',
  },
  {
    slug: 'pikachu-30th-plush-keychain-release-news',
    path: '/blog/pikachu-30th-plush-keychain-release-news',
    title: 'Pokémon 30th Anniversary Pikachu Plush Keychains: All 30 Styles and How They Are Sold',
    excerpt:
      'Pokémon China released 30 plush Pikachu keychains for the 30th anniversary on September 16, 2026. Every style has its own expression and pose, each comes with its own version of the 30 tag, and you choose the one you want.',
    seoTitle: 'Pikachu 30th Anniversary Plush Keychain: All 30 Styles',
    seoDescription:
      'The Chinese Pokémon 30th anniversary Pikachu plush keychains: 30 styles, each with its own face, pose and 30 tag, sold as chosen styles from September 16, 2026.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/pikachu-30th-plush-keychain-release-hero.webp`,
    heroAlt: 'Three 30th anniversary Pikachu plush keychains: a waving Pikachu in front, a sleepy Pikachu and a sitting Pikachu behind, each with its 30 tag',
    glow1: 'rgb(246 206 60 / .30)',
    glow2: 'rgb(222 185 97 / .25)',
  },
  {
    slug: 'funism-first-partner-mini-figures-release-news',
    path: '/blog/funism-first-partner-mini-figures-release-news',
    title: 'Funism First Partner Figures: All 27 Starters, Three to a Suitcase',
    excerpt:
      "Funism's First Partner set has 27 small figures, the three first partner Pokémon from all nine generations. Each blind box is shaped like a suitcase and holds three figures with three Poké Balls.",
    seoTitle: 'Funism First Partner Blind Box: All 27 Pokémon Starters',
    seoDescription:
      'Funism First Partner Pokémon figures: all 27 starters from Kanto to Paldea, three per suitcase blind box, and a display of nine boxes. Released July 2026.',
    tag: 'New release',
    date: '2026-07-10',
    heroImage: `${SITE_URL}/assets/blog/funism-first-partner-suitcase-hero.webp`,
    heroAlt: 'Funism First Partner suitcase box with Charmander on the front, the open suitcase with three Poké Balls, and the Bulbasaur, Charmander and Squirtle figures',
    glow1: 'rgb(246 164 86 / .28)',
    glow2: 'rgb(150 104 66 / .24)',
  },
  {
    slug: 'first-partner-30th-vol-1-release-news',
    path: '/blog/first-partner-30th-vol-1-release-news',
    title: 'Chinese First Partner Set Vol.1: 9 Kanto, Sinnoh and Alola Cards, the Display Frame and What Is Inside',
    excerpt:
      "Pokémon China's First Partner Set Vol.1 released on March 20, 2026. Each blind box holds one of 9 new first partner cards from Kanto, Sinnoh and Alola, a magnetic acrylic display frame and a Brilliant Fantasy booster pack.",
    seoTitle: 'Chinese First Partner Set Vol.1: All 9 Cards, Odds & Contents',
    seoDescription:
      'The Chinese Pokémon TCG First Partner Set Vol.1 blind box: one of 9 new Kanto, Sinnoh and Alola first partner cards, a display frame and a Brilliant Fantasy pack.',
    tag: 'New release',
    date: '2026-03-20',
    heroImage: `${SITE_URL}/assets/blog/first-partner-30th-vol-1-release-hero.webp`,
    heroAlt: 'The First Partner Set Vol.1 box with the Bulbasaur card on the front, and the Charmander and Squirtle cards behind it',
    glow1: 'rgb(132 204 112 / .30)',
    glow2: 'rgb(240 120 70 / .22)',
  },
  {
    slug: 'first-partner-30th-vol-2-release-news',
    path: '/blog/first-partner-30th-vol-2-release-news',
    title: 'Chinese First Partner Set Vol.2: 9 Johto, Unova and Galar Cards, the Display Frame and What Is Inside',
    excerpt:
      "Pokémon China's First Partner Set Vol.2 released on June 19, 2026. Each blind box holds one of 9 new first partner cards from Johto, Unova and Galar, a magnetic acrylic display frame and a Stellar Crystal booster pack.",
    seoTitle: 'Chinese First Partner Set Vol.2: All 9 Cards, Odds & Contents',
    seoDescription:
      'The Chinese Pokémon TCG First Partner Set Vol.2 blind box: one of 9 new Johto, Unova and Galar first partner cards, a display frame and a Stellar Crystal pack.',
    tag: 'New release',
    date: '2026-06-19',
    heroImage: `${SITE_URL}/assets/blog/first-partner-30th-vol-2-release-hero.webp`,
    heroAlt: 'The First Partner Set Vol.2 box with the Totodile card on the front, and the Chikorita and Cyndaquil cards behind it',
    glow1: 'rgb(92 178 236 / .30)',
    glow2: 'rgb(240 160 60 / .22)',
  },
  {
    slug: 'first-partner-30th-vol-3-release-news',
    path: '/blog/first-partner-30th-vol-3-release-news',
    title: 'Chinese First Partner Set Vol.3: 9 Hoenn, Kalos and Paldea Cards, the Display Frame and What Is Inside',
    excerpt:
      "Pokémon China's First Partner Set Vol.3 released on August 7, 2026. Each blind box holds one of 9 new first partner cards from Hoenn, Kalos and Paldea, a magnetic acrylic display frame and a Chasing Glory booster pack.",
    seoTitle: 'Chinese First Partner Set Vol.3: All 9 Cards, Odds & Contents',
    seoDescription:
      'The Chinese Pokémon TCG First Partner Set Vol.3 blind box: one of 9 new Hoenn, Kalos and Paldea first partner cards, a display frame and a Chasing Glory pack.',
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/first-partner-30th-vol-3-release-hero.webp`,
    heroAlt: 'The First Partner Set Vol.3 box with the Torchic card on the front, and the Treecko and Mudkip cards behind it',
    glow1: 'rgb(246 150 70 / .30)',
    glow2: 'rgb(90 170 230 / .22)',
  },
  // Also add | '30th-celebration-pikachu-cards-artists' to BlogPostSlug
  {
    slug: '30th-celebration-pikachu-cards-artists',
    path: '/blog/30th-celebration-pikachu-cards-artists',
    title: 'All 30 Pikachu Cards in Pokémon 30th Celebration and the Artists Behind Them',
    excerpt:
      'One Pikachu in every pack, 30 artists, 30 different illustrations. Here are all 30 Pikachu Rares in Pokémon TCG 30th Celebration, with their attacks and the artists who drew them, from Ken Sugimori to Atsuko Nishida, who designed Pikachu for Pokémon Red and Green, plus how they are numbered in Japanese, Chinese and the other languages.',
    seoTitle: 'All 30 Pikachu Cards in Pokémon 30th Celebration & Their Artists',
    seoDescription:
      'All 30 Pikachu Rares in Pokémon TCG 30th Celebration, 023 to 052/128 in English: who drew each one, their attacks, and the Japanese and Chinese numbers.',
    tag: 'Set guide',
    date: '2026-11-23',
    heroImage: `${SITE_URL}/assets/blog/pikachu-30-artists-hero-v2.webp`,
    heroAlt: 'The English Pikachu 01/30 by Ken Sugimori from 30th Celebration in front, with Pikachu 15/30 and 25/30 behind it, beside the headline 30 Pikachus, 30 Artists',
    glow1: 'rgb(246 206 60 / .28)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  // Also add | 'pokemon-30th-shanghai-gold-pikachu-cards-news' to BlogPostSlug
  {
    slug: 'pokemon-30th-shanghai-gold-pikachu-cards-news',
    path: '/blog/pokemon-30th-shanghai-gold-pikachu-cards-news',
    title: "Pokémon China's 30 Pikachu Cards Made of Real Gold Go On Show in Shanghai",
    excerpt:
      'Pokémon China has revealed 30 Pikachu cards made of 999 pure gold, 30g each, every one in its own display case. All 30 are on show free in Shanghai from November 28 to December 27, 2026.',
    seoTitle: 'Chinese 30th Gold Cards: 30 Pure Gold Pikachu Cards, 999 Gold, 30g',
    seoDescription:
      "Pokémon China's 30 pure gold Pikachu cards: 999 gold, 30g each, every one in its own case. Free to see in Shanghai, Nov 28 to Dec 27.",
    tag: 'News',
    date: '2026-11-23',
    heroImage: `${SITE_URL}/assets/blog/shanghai-gold-pikachu-cards-news-hero-v6.webp`,
    heroAlt: "The real 999 gold Pikachu 01/30 card by Ken Sugimori in its display case, which reads 999 Gold Card at the top and has a plate under the card showing 30g and 999‰, beside the headline 30 Pikachu Cards Made of Real Gold",
    glow1: 'rgb(232 192 96 / .30)',
    glow2: 'rgb(246 206 60 / .20)',
  },
  {
    slug: 'aura-seeker-release-news',
    path: '/blog/aura-seeker-release-news',
    title: 'Aura Seeker (Japanese M7): Release Date, Full Card List and Secret Rares',
    excerpt:
      'The Japanese Pokémon TCG set Aura Seeker (M7) launched in Japan on November 27, 2026. The full card list is out: 114 cards, with 36 secret rares and a gold Mega Ultra Rare Mega Lucario Z ex.',
    seoTitle: 'Aura Seeker (Japanese M7): Full Card List & Secret Rares',
    seoDescription:
      'Japanese Aura Seeker (M7), launched in Japan November 27, 2026: all 114 cards, the 36 secret rares and the gold Mega Ultra Rare Mega Lucario Z ex.',
    tag: 'New release',
    date: '2026-11-27',
    heroImage: `${SITE_URL}/assets/blog/aura-seeker-release-hero-v4.webp`,
    heroAlt: 'A Japanese Aura Seeker booster pack with Mega Lucario Z on the front, the Mega Lucario Z ex Special Art Rare 110/078 in front of it and the Crasher Wake\'s Fervor Special Art Rare behind',
    glow1: 'rgb(112 214 226 / .28)',
    glow2: 'rgb(236 72 130 / .22)',
  },
  // Also add | 'futuristic-pikachu-box-release-news' to BlogPostSlug
  {
    slug: 'futuristic-pikachu-box-release-news',
    path: '/blog/futuristic-pikachu-box-release-news',
    title: 'Chinese 30th Celebration Futuristic Box: Two YOSHIROTTEN Pikachu ex Promos and Everything Inside',
    excerpt:
      "Pokémon China's 30th Celebration Futuristic Box released on September 16, 2026, alongside the 30th Celebration set. This post covers everything in it: two Pikachu ex promos by YOSHIROTTEN and a full set of accessories in the same design.",
    seoTitle: 'Chinese 30th Celebration Futuristic Box: Pikachu ex Promos',
    seoDescription:
      'The Chinese Pokémon TCG 30th Celebration Futuristic Box: Pikachu ex 030/30th-P and 031/30th-P by YOSHIROTTEN, sleeves, a playmat, a deck box and more.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/futuristic-pikachu-box-release-hero.webp`,
    heroAlt: 'The 30th Celebration Futuristic Box with the two Pikachu ex promo cards by YOSHIROTTEN standing in front of it',
    glow1: 'rgb(120 200 245 / .30)',
    glow2: 'rgb(214 90 200 / .24)',
  },
  // Also add | 'lisia-gift-box-release-news' to BlogPostSlug
  {
    slug: 'lisia-gift-box-release-news',
    path: '/blog/lisia-gift-box-release-news',
    title: "Chinese Lisia's Shine Gift Box: Lisia's Appeal Promo, Altaria Plush and 13 Packs",
    excerpt:
      "Pokémon China's Lisia's Shine gift box released on August 7, 2026. This post covers everything in it: the Lisia's Appeal promo, an Altaria plush, a card display frame, a deck box, sleeves and 13 booster packs from three sets.",
    seoTitle: "Chinese Lisia Gift Box: Lisia's Appeal Promo & Altaria Plush",
    seoDescription:
      "The Chinese Pokémon TCG Lisia's Shine gift box: Lisia's Appeal promo 352/SV-P, an Altaria plush, a display frame, a deck box and 13 booster packs.",
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/lisia-gift-box-release-hero.webp`,
    heroAlt: "The Lisia's Shine gift box with its Altaria plush, and the Lisia's Appeal promo card standing in front of it",
    glow1: 'rgb(176 186 250 / .30)',
    glow2: 'rgb(120 190 240 / .24)',
  },
  // Also add | 'ogerpon-mask-gift-box-release-news' to BlogPostSlug
  {
    slug: 'ogerpon-mask-gift-box-release-news',
    path: '/blog/ogerpon-mask-gift-box-release-news',
    title: 'Chinese Ogerpon Mask Gift Boxes: All Four Masks, the Kitakami Theme Pack and Everything Inside',
    excerpt:
      "Pokémon China's four Ogerpon mask gift boxes released on May 15, 2026. This post covers what is in each one: 6 booster packs, a new Kitakami theme pack with its own chase cards, and accessories in the box's mask.",
    seoTitle: 'Chinese Ogerpon Mask Gift Boxes: Kitakami Pack & Contents',
    seoDescription:
      'The Chinese Pokémon TCG Ogerpon mask gift boxes: Teal, Hearthflame, Wellspring and Cornerstone, each with 6 packs, a Kitakami theme pack and accessories.',
    tag: 'New release',
    date: '2026-05-15',
    heroImage: `${SITE_URL}/assets/blog/ogerpon-mask-gift-box-release-hero.webp`,
    heroAlt: 'The four Ogerpon mask gift boxes in a row, with the Teal Mask Ogerpon ex card from the Kitakami theme pack in front',
    glow1: 'rgb(120 210 150 / .30)',
    glow2: 'rgb(200 60 80 / .22)',
  },
  // Also add | 'lillie-n-battle-box-release-news' to BlogPostSlug
  {
    slug: 'lillie-n-battle-box-release-news',
    path: '/blog/lillie-n-battle-box-release-news',
    title: 'Chinese Lillie and N Battle Set Boxes: 6 Chasing Glory Packs and Everything Inside',
    excerpt:
      "Pokémon China's Lillie and N battle set boxes released on July 16, 2026, alongside Chasing Glory. This post covers what is in each one: 6 Chasing Glory booster packs and a set of battle accessories in the Trainer's design.",
    seoTitle: 'Chinese Lillie and N Battle Set Boxes: Contents & Release',
    seoDescription:
      'The Chinese Pokémon TCG Lillie and N battle set boxes: 6 Chasing Glory packs, sleeves, a deck box, a coin and dice in each, released July 16, 2026.',
    tag: 'New release',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/lillie-n-battle-box-stacked-hero.webp`,
    heroAlt: 'The Lillie battle set box and the N battle set box side by side',
    glow1: 'rgb(150 210 240 / .30)',
    glow2: 'rgb(140 200 80 / .24)',
  },
  // Also add | 'japanese-30th-celebration-release-news' to BlogPostSlug
  {
    slug: 'japanese-30th-celebration-release-news',
    path: '/blog/japanese-30th-celebration-release-news',
    title: 'Japanese 30th Celebration (M6a): Pikachu ex, Futuristic Rares and Everything Released With It',
    excerpt:
      'The Japanese Pokémon TCG set 30th Celebration (M6a) released on September 16, 2026. This post covers the pack and box, Pikachu ex, the two Futuristic Rares, the 30 Pikachu cards, the 30 classic cards and the other products released with it.',
    seoTitle: 'Japanese 30th Celebration (M6a): Release Date, Cards & Box',
    seoDescription:
      'Japanese Pokémon TCG 30th Celebration (M6a), released September 16, 2026: 6 holo cards a pack, 20 packs a box, Pikachu ex, Futuristic Rares and 173 cards.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/japanese-30th-celebration-release-hero.webp`,
    heroAlt: 'The Pikachu ex card standing in front of a Japanese 30th Celebration booster pack, which shows Pikachu, Mew and Mewtwo on the front',
    glow1: 'rgb(244 200 66 / .28)',
    glow2: 'rgb(90 150 230 / .22)',
  },
  // Also add | 'storm-emeralda-release-news' to BlogPostSlug
  {
    slug: 'storm-emeralda-release-news',
    path: '/blog/storm-emeralda-release-news',
    title: 'Storm Emeralda (Japanese M6): Release Date, Mega Rayquaza ex and the 113-Card List',
    excerpt:
      'The Japanese Pokémon TCG set Storm Emeralda (M6) released on July 31, 2026. This post covers the pack and box, the 113-card list, all four Mega Rayquaza ex cards and the other Special Art Rares.',
    seoTitle: 'Storm Emeralda (Japanese M6): Mega Rayquaza ex & Card List',
    seoDescription:
      'Japanese Pokémon TCG Storm Emeralda (M6), released July 31, 2026: 5 cards a pack, 30 packs a box, 113 cards and four Mega Rayquaza ex versions.',
    tag: 'New release',
    date: '2026-07-31',
    heroImage: `${SITE_URL}/assets/blog/storm-emeralda-release-hero.webp`,
    heroAlt: 'The Mega Rayquaza ex card standing in front of a Japanese Storm Emeralda booster pack, which shows Mega Rayquaza on the front',
    glow1: 'rgb(96 214 140 / .28)',
    glow2: 'rgb(236 72 60 / .20)',
  },
  // Also add | 'master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news' to BlogPostSlug
  {
    slug: 'master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news',
    path: '/blog/master-strategy-deck-raging-bolt-dragapult-gholdengo-release-news',
    title: 'Chinese Master Strategy Deck Building Sets: Raging Bolt ex, Dragapult ex and Gholdengo ex Decks and Everything Inside',
    excerpt:
      "Pokémon China's second series of Master Strategy deck building sets released on July 16, 2026, alongside Chasing Glory. This post covers what is in each one: a ready-built Raging Bolt ex, Dragapult ex or Gholdengo ex deck, a 15-card upgrade pack, 4 Chasing Glory packs and a set of battle accessories.",
    seoTitle: 'Chinese Master Strategy Decks: Raging Bolt, Dragapult, Gholdengo',
    seoDescription:
      'The Chinese Pokémon TCG Master Strategy deck sets: full Raging Bolt ex, Dragapult ex and Gholdengo ex deck lists, 4 Chasing Glory packs each.',
    tag: 'New release',
    date: '2026-07-16',
    heroImage: `${SITE_URL}/assets/blog/master-strategy-deck-2-release-hero.webp`,
    heroAlt: 'The Dragapult ex and Gholdengo ex Master Strategy deck building set boxes behind the Raging Bolt ex set',
    glow1: 'rgb(180 160 240 / .30)',
    glow2: 'rgb(240 200 80 / .22)',
  },
  // Also add | 'master-strategy-deck-charizard-gardevoir-miraidon-release-news' to BlogPostSlug
  {
    slug: 'master-strategy-deck-charizard-gardevoir-miraidon-release-news',
    path: '/blog/master-strategy-deck-charizard-gardevoir-miraidon-release-news',
    title: 'Chinese Master Strategy Deck Building Sets: Charizard ex, Gardevoir ex and Miraidon ex Decks and Everything Inside',
    excerpt:
      "Pokémon China's Master Strategy deck building sets released on January 16, 2026, alongside Blade Awakening. This post covers what is in each one: a ready-built Charizard ex, Gardevoir ex or Miraidon ex deck, a 15-card upgrade pack, 4 Blade Awakening packs and a set of battle accessories.",
    seoTitle: 'Chinese Master Strategy Decks: Charizard, Gardevoir, Miraidon',
    seoDescription:
      'The Chinese Pokémon TCG Master Strategy deck sets: full Charizard ex, Gardevoir ex and Miraidon ex deck lists, 4 Blade Awakening packs each.',
    tag: 'New release',
    date: '2026-01-16',
    heroImage: `${SITE_URL}/assets/blog/master-strategy-deck-1-release-hero.webp`,
    heroAlt: 'The Gardevoir ex and Miraidon ex Master Strategy deck building set boxes behind the Charizard ex set',
    glow1: 'rgb(255 170 70 / .30)',
    glow2: 'rgb(150 120 230 / .22)',
  },
  // Also add | 'espeon-umbreon-deluxe-deck-release-news' to BlogPostSlug
  {
    slug: 'espeon-umbreon-deluxe-deck-release-news',
    path: '/blog/espeon-umbreon-deluxe-deck-release-news',
    title: 'Chinese Espeon ex and Umbreon ex Deluxe Deck Sets: The Decks, Metal Deck Boxes and Everything Inside',
    excerpt:
      "Pokémon China's Espeon ex and Umbreon ex deluxe deck sets released on September 16, 2026, alongside 30th Celebration. This post covers what is in each one: a ready-to-play deck, a metal deck box, a playmat, a coin, two guides and 2 booster packs.",
    seoTitle: 'Chinese Espeon ex & Umbreon ex Deluxe Deck Sets: Contents',
    seoDescription:
      'The Chinese Pokémon TCG 30th Celebration Espeon ex and Umbreon ex deluxe deck sets: the decks, metal deck boxes, playmats, coins and 2 packs each.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/espeon-umbreon-deluxe-deck-centred-hero.webp`,
    heroAlt: 'The Espeon and Umbreon deluxe deck set boxes side by side',
    glow1: 'rgb(230 160 230 / .30)',
    glow2: 'rgb(90 110 220 / .24)',
  },
  // Also add | 'journey-gift-boxes-release-news' to BlogPostSlug
  {
    slug: 'journey-gift-boxes-release-news',
    path: '/blog/journey-gift-boxes-release-news',
    title: 'Chinese Journey Gift Boxes: Venusaur, Charizard, Blastoise and Gardevoir, Theme Packs and Everything Inside',
    excerpt:
      "Pokémon China's Journey gift boxes released on June 13, 2025, in four designs: Venusaur, Charizard, Blastoise and Gardevoir. This post covers what is in each one: 6 Journey theme packs, 6 booster packs and a set of accessories in the box's Pokémon.",
    seoTitle: 'Chinese Journey Gift Boxes: Charizard, Venusaur & More',
    seoDescription:
      'The Chinese Pokémon TCG Journey gift boxes: 6 Journey theme packs, 6 booster packs, sleeves and dice in Venusaur, Charizard, Blastoise or Gardevoir.',
    tag: 'New release',
    date: '2025-06-13',
    heroImage: `${SITE_URL}/assets/blog/journey-gift-boxes-release-hero.webp`,
    heroAlt: 'The Venusaur, Gardevoir and Blastoise Journey gift boxes behind the Charizard box',
    glow1: 'rgb(255 150 70 / .28)',
    glow2: 'rgb(80 190 170 / .22)',
  },
  {
    slug: 'collect-151-journey-release-news',
    path: '/blog/collect-151-journey-release-news',
    title: 'Collect 151: Journey Is Here: All 151 Kanto Pokémon and a Pikachu Art Rare',
    excerpt:
      'Collect 151: Journey is the first of four Collect 151 releases. It brings the 151 original Kanto Pokémon to Simplified Chinese in Pokédex order, with Pikachu on the pack and its own Pikachu Art Rare.',
    seoTitle: 'Pokémon Collect 151: Journey (151C): Release Info & Pikachu AR',
    seoDescription:
      'Chinese Pokémon TCG Collect 151: Journey (151C), out January 17, 2025: all 151 Kanto Pokémon, Mew ex, Shiny cards and the Journey Pikachu Art Rare.',
    tag: 'New release',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/collect-151-journey-release-hero-v1.webp`,
    heroAlt: 'The Collect 151: Journey booster pack with the Journey Pikachu Art Rare in front',
    glow1: 'rgb(120 190 90 / .30)',
    glow2: 'rgb(34 20 16 / .25)',
  },
  {
    slug: 'collect-151-hope-release-news',
    path: '/blog/collect-151-hope-release-news',
    title: 'Collect 151: Hope Is Here: A Second Pikachu Art Rare and More Water, Dragon and Colorless Holos',
    excerpt:
      'Collect 151: Hope is the second Collect 151 release, with Psyduck and Pikachu on the pack. It has the same card list as Journey, a new Pikachu Art Rare, and more Water, Dragon and Colorless pattern holos.',
    seoTitle: 'Pokémon Collect 151: Hope (151C): Release Info & Pikachu AR',
    seoDescription:
      'Chinese Pokémon TCG Collect 151: Hope (151C), out April 18, 2025: the Hope Pikachu Art Rare, boosted pattern holo types, coin sets and pack sizes.',
    tag: 'New release',
    date: '2025-04-18',
    heroImage: `${SITE_URL}/assets/blog/collect-151-hope-release-hero-v1.webp`,
    heroAlt: 'The Collect 151: Hope booster pack with the Hope Pikachu Art Rare in front',
    glow1: 'rgb(90 170 220 / .30)',
    glow2: 'rgb(34 20 16 / .25)',
  },
  {
    slug: 'collect-151-surprise-release-news',
    path: '/blog/collect-151-surprise-release-news',
    title: 'Collect 151: Surprise Is Here: Mew ex and Alakazam ex Special Art Rares and a Gengar Pikachu',
    excerpt:
      'Collect 151: Surprise is the third Collect 151 release, with Gengar and Pikachu on the pack. It has three cards of its own: a Pikachu Art Rare and the Mew ex and Alakazam ex Special Art Rares.',
    seoTitle: 'Pokémon Collect 151: Surprise (151C): Mew ex SAR & Release Info',
    seoDescription:
      'Chinese Pokémon TCG Collect 151: Surprise (151C), out July 18, 2025: the Mew ex and Alakazam ex Special Art Rares, a Pikachu Art Rare and pack sizes.',
    tag: 'New release',
    date: '2025-07-18',
    heroImage: `${SITE_URL}/assets/blog/collect-151-surprise-release-hero-v1.webp`,
    heroAlt: 'The Collect 151: Surprise booster pack with the Surprise Pikachu Art Rare in front and the Mew ex and Alakazam ex Special Art Rares behind',
    glow1: 'rgb(150 110 210 / .30)',
    glow2: 'rgb(34 20 16 / .25)',
  },
  {
    slug: 'collect-151-gathering-release-news',
    path: '/blog/collect-151-gathering-release-news',
    title: 'Collect 151: Gathering Is Here: A Zapdos ex Special Art Rare and the Last Pikachu Art Rare',
    excerpt:
      'Collect 151: Gathering is the fourth and last Collect 151 release, with Pikachu, Vulpix and Cubone on the pack. Its own cards are a Pikachu Art Rare and the Zapdos ex Special Art Rare.',
    seoTitle: 'Pokémon Collect 151: Gathering (151C): Zapdos ex SAR & Release Info',
    seoDescription:
      'Chinese Pokémon TCG Collect 151: Gathering (151C), out October 17, 2025: the Zapdos ex Special Art Rare, the last Pikachu Art Rare and boosted holo types.',
    tag: 'New release',
    date: '2025-10-17',
    heroImage: `${SITE_URL}/assets/blog/collect-151-gathering-release-hero-v1.webp`,
    heroAlt: 'The Collect 151: Gathering booster pack with the Gathering Pikachu Art Rare in front and the Zapdos ex Special Art Rare behind',
    glow1: 'rgb(240 200 70 / .30)',
    glow2: 'rgb(34 20 16 / .25)',
  },
  {
    slug: 'collect-151-set-guide',
    path: '/blog/collect-151-set-guide',
    title: 'Collect 151 Set Guide: Journey, Hope, Surprise, Gathering and Which Has Which Chase Card',
    excerpt:
      'Collect 151 is one 192-card set sold in four releases: Journey, Hope, Surprise and Gathering. This guide explains how they differ, shows which release has which chase card, and covers what a master set takes.',
    seoTitle: 'Pokémon Collect 151 (151C) Set Guide: Chase Cards by Release',
    seoDescription:
      'Chinese Pokémon TCG Collect 151 (151C) set guide: how Journey, Hope, Surprise and Gathering differ, every Special Art Rare and Pikachu Art Rare, and the master set.',
    tag: 'Set guide',
    date: '2025-10-17',
    heroImage: `${SITE_URL}/assets/blog/collect-151-guide-hero-v1.webp`,
    heroAlt: 'The Gathering Pikachu Art Rare in an EBI display case beside the Mew ex, Alakazam ex and Zapdos ex Special Art Rares',
    glow1: 'rgb(86 147 90 / .30)',
    glow2: 'rgb(34 20 16 / .25)',
  },
  {
    slug: 'collect-151-card-origins',
    path: '/blog/collect-151-card-origins',
    title: 'Where Every Collect 151 Card Comes From',
    excerpt:
      'All 192 Collect 151 cards matched to Japanese and English: 166 from Pokémon Card 151 (English 151), 22 from Shiny Treasure ex (English Paldean Fates), and 4 new Pikachu Art Rares.',
    seoTitle: 'Pokémon Collect 151 (151C) Card Origins: Japanese & English Matches',
    seoDescription:
      'All 192 Pokémon TCG Collect 151 (151C) cards matched to Japanese SV2a and Shiny Treasure ex, and to English 151 and Paldean Fates, plus 4 new Pikachu ARs.',
    tag: 'Collecting guide',
    date: '2025-10-17',
    heroImage: `${SITE_URL}/assets/blog/collect-151-origins-hero-v1.webp`,
    heroAlt: 'Collect 151 Hope, Gathering and Surprise packs linked to tiles for Pokémon Card 151, Shiny Treasure ex and four new Pikachu Art Rares',
    glow1: 'rgb(86 147 90 / .30)',
    glow2: 'rgb(60 90 70 / .30)',
  },
  // Also add | 'collect-151-first-partner-display-sets-release-news' to BlogPostSlug
  {
    slug: 'collect-151-first-partner-display-sets-release-news',
    path: '/blog/collect-151-first-partner-display-sets-release-news',
    title: 'Chinese Collect 151 First Partner Display Sets: Bulbasaur, Charmander and Squirtle Promos and Everything Inside',
    excerpt:
      "Pokémon China's Collect 151 First Partner display sets released on August 22, 2025, in three versions: Bulbasaur, Charmander and Squirtle. This post covers what is in each one: a holo promo with a new illustration, a display frame and 3 Collect 151 packs.",
    seoTitle: 'Chinese 151 First Partner Sets: Bulbasaur, Charmander, Squirtle',
    seoDescription:
      'The Chinese Pokémon TCG Collect 151 First Partner display sets: new Bulbasaur, Charmander and Squirtle holo promos, a display frame and 3 packs.',
    tag: 'New release',
    date: '2025-08-22',
    heroImage: `${SITE_URL}/assets/blog/collect-151-first-partner-display-release-hero.webp`,
    heroAlt: 'The Bulbasaur and Squirtle First Partner display sets behind the Charmander set',
    glow1: 'rgb(120 200 240 / .28)',
    glow2: 'rgb(240 110 80 / .22)',
  },
  {
    slug: 'eevee-dream-painting-figures-release-news',
    path: '/blog/eevee-dream-painting-figures-release-news',
    title: 'Dream Painting Eevee & Friends Figures: All 9, the Secret, and What Comes in a Box',
    excerpt:
      'Pokémon China turned Eevee and eight Eeveelution cards into figures that stand in front of their own card. Each box has one random figure, its card, a display stand and a Terastal Gathering pack, and about 1 box in 81 holds a secret sleeping Eevee.',
    seoTitle: 'Eevee & Friends Dream Painting Figure Blind Box: Secret & Odds',
    seoDescription:
      'Pokémon Dream Painting Eevee & Friends blind box: 9 figures of Eevee and the Eeveelutions, each with its card and a pack, and a 1 in 81 secret Eevee.',
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/eevee-dream-painting-figures-secret-hero.webp`,
    heroAlt: 'The Dream Painting Eevee & Friends blind box with the secret sleeping Eevee figure on its stand in front of it',
    glow1: 'rgb(236 190 120 / .30)',
    glow2: 'rgb(214 160 220 / .24)',
  },
  // Also add | 'dream-painting-151-vol-1-release-news' to BlogPostSlug
  {
    slug: 'dream-painting-151-vol-1-release-news',
    path: '/blog/dream-painting-151-vol-1-release-news',
    title: 'Collect 151 Dream Painting Figure Set: All 12 Figures, the Secret Machoke, and What Comes in a Box',
    excerpt:
      'Pokémon China turned 12 Collect 151 cards into figures that stand in front of their own card. Each box of the Collect 151 Dream Painting figure set has one random figure, a Poké Ball holo card of the same Pokémon and two Collect 151: Journey packs, and about 1 box in 144 holds a secret Machoke.',
    seoTitle: 'Collect 151 Dream Painting Figure Set: Secret Machoke & Odds',
    seoDescription:
      'Pokémon Collect 151 Dream Painting figure set: 12 figures from Collect 151 cards, each with its card and 2 Journey packs, and a 1 in 144 secret Machoke.',
    tag: 'New release',
    date: '2025-11-28',
    heroImage: `${SITE_URL}/assets/blog/dream-painting-151-secret-front-hero.webp`,
    heroAlt: "The Collect 151 Dream Painting blind box with the secret Machoke figure on its stand in front of it",
    glow1: 'rgb(170 132 232 / .30)',
    glow2: 'rgb(140 170 220 / .22)',
  },
  {
    slug: 'dream-painting-water-vol-2-release-news',
    path: '/blog/dream-painting-water-vol-2-release-news',
    title: 'Dream Painting Vol. 2: Water Pokémon Figure Set, All 12 Figures and the Secret Wailord',
    excerpt:
      "Pokémon China's second Dream Painting figure set turns 12 Water-type cards into figures that stand in front of their own card. Each box has one random figure, its matching card and two Brilliant Fantasy packs, and about 1 box in 144 holds a secret Wailord.",
    seoTitle: 'Dream Painting Vol. 2 Water Figure Set: Secret Wailord & Odds',
    seoDescription:
      'Pokémon Dream Painting Water figure set (Vol. 2): 12 Water-type figures, each with its card and 2 Brilliant Fantasy packs, and a 1 in 144 secret Wailord.',
    tag: 'New release',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/dream-painting-water-vol-2-release-hero.webp`,
    heroAlt: 'The Dream Painting Water figure set blind box with Starmie on the front and the secret Wailord figure on its stand beside it',
    glow1: 'rgb(120 196 246 / .30)',
    glow2: 'rgb(90 140 220 / .22)',
  },
  {
    slug: 'are-chinese-pokemon-cards-real',
    path: '/blog/are-chinese-pokemon-cards-real',
    title: 'Are Chinese Pokémon Cards Real? What Official Simplified Chinese Cards Are',
    excerpt:
      'Simplified Chinese Pokémon cards are official, made for mainland China and on sale there since October 28, 2022. What they are, who makes them, and five checks from Pokémon China’s own pages.',
    seoTitle: 'Are Chinese Pokémon Cards Real? Official Simplified Chinese TCG',
    seoDescription:
      'Yes: Simplified Chinese Pokémon cards are official, sold in mainland China since October 2022. Who makes them and how to check a card, from official sources.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/are-chinese-pokemon-cards-real-hero.webp`,
    heroAlt: 'Are Chinese Pokémon Cards Real? banner: the Simplified Chinese Black Bolt and White Flare booster packs side by side',
    glow1: 'rgb(246 206 60 / .24)',
    glow2: 'rgb(58 70 96 / .32)',
  },
  {
    slug: 'simplified-vs-traditional-chinese-pokemon-cards',
    path: '/blog/simplified-vs-traditional-chinese-pokemon-cards',
    title: 'Simplified vs Traditional Chinese Pokémon Cards: How to Tell Them Apart',
    excerpt:
      'Simplified and Traditional Chinese Pokémon cards are two separate official versions. How to tell them apart by script, set code and holo, and where each one can be played.',
    seoTitle: 'Simplified vs Traditional Chinese Pokémon Cards: How to Tell',
    seoDescription:
      'Simplified Chinese Pokémon cards say 宝可梦, Traditional Chinese say 寶可夢. Set codes, holos, products and tournament rules compared, from official sources.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/simplified-vs-traditional-chinese-pokemon-cards-hero.webp`,
    heroAlt: 'Simplified vs Traditional Chinese banner: the word Pokémon written 宝可梦 in Simplified Chinese beside 寶可夢 in Traditional Chinese',
    glow1: 'rgb(120 200 230 / .26)',
    glow2: 'rgb(246 206 60 / .20)',
  },
  {
    slug: 'chinese-vs-english-pokemon-cards',
    path: '/blog/chinese-vs-english-pokemon-cards',
    title: 'Chinese vs English Pokémon Cards: What Is Actually Different',
    excerpt:
      'Simplified Chinese Pokémon cards come in their own sets, in slim, jumbo and Gem Packs, with different rarity names and Chinese Exclusive cards. What changes from English, set by set.',
    seoTitle: 'Chinese vs English Pokémon Cards: Sets, Packs & Rarities Compared',
    seoDescription:
      'How Simplified Chinese Pokémon cards differ from English: their own sets, slim, jumbo and Gem Packs, rarity names and Chinese Exclusive cards.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-vs-english-pokemon-cards-hero.webp`,
    heroAlt: 'Chinese vs English Pokémon Cards banner: the Simplified Chinese 30th Celebration pack in front of a Gem Pack Vol. 7 pack and a Chasing Glory pack',
    glow1: 'rgb(240 120 160 / .24)',
    glow2: 'rgb(222 185 97 / .26)',
  },
  {
    slug: 'are-chinese-pokemon-cards-tournament-legal',
    path: '/blog/are-chinese-pokemon-cards-tournament-legal',
    title: 'Can You Play Chinese Pokémon Cards in Tournaments?',
    excerpt:
      'What the Play! Pokémon TCG Tournament Handbook, Pokémon China and Pokémon’s Hong Kong site say about card languages, quoted word for word: where Chinese cards are legal and where they are not.',
    seoTitle: 'Are Chinese Pokémon Cards Tournament Legal? The Official Rules',
    seoDescription:
      'Are Chinese Pokémon cards tournament legal? The Play! Pokémon handbook’s language rules, the exceptions, and the rules in mainland China, Hong Kong and Macau.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-pokemon-cards-tournament-legal-hero.webp`,
    heroAlt: 'Can You Play Chinese Cards in Tournaments? banner: the Simplified Chinese Blade Awakening pack in front of Stellar Crystal and Chasing Glory packs',
    glow1: 'rgb(110 200 150 / .24)',
    glow2: 'rgb(30 80 160 / .30)',
  },
  {
    slug: 'chinese-booster-box-guaranteed-hits',
    path: '/blog/chinese-booster-box-guaranteed-hits',
    title: 'Do Chinese Pokémon Booster Boxes Have Guaranteed Hits? Slim and Jumbo Odds',
    excerpt:
      'No Chinese Pokémon booster box has a guaranteed hit. Every pack has a guaranteed holo, and a jumbo box averages about one top card. The official odds for every Scarlet & Violet set, with the maths and the odds of one chase card.',
    seoTitle: 'Do Chinese Pokémon Booster Boxes Have Guaranteed Hits?',
    seoDescription:
      'No box has a guaranteed hit. Every pack has a holo, and a jumbo box averages about 1.2 top cards. Official slim and jumbo odds for every Chinese set.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/chinese-booster-box-guaranteed-hits-hero.webp`,
    heroAlt: 'Guaranteed Hits? banner: a fan of five Simplified Chinese booster packs with the Black Crystal Blaze Charizard pack in front, Black Bolt and White Flare beside it and Chasing Glory and Blade Awakening behind',
    glow1: 'rgb(246 178 60 / .26)',
    glow2: 'rgb(200 70 40 / .22)',
  },
  {
    slug: 'chinese-gem-pack-hit-rates',
    path: '/blog/chinese-gem-pack-hit-rates',
    title: 'Chinese Gem Pack Hit Rates: What Every Pack and Box Guarantees (Vol. 1 to 7)',
    excerpt:
      "Every Gem Pack has 4 holo cards and one Rare or better, but Pokémon China promises no full art per box. The official odds for all seven volumes, the holo Energy question and the full arts to expect per box, with the maths.",
    seoTitle: 'Do Chinese Gem Packs Have Guaranteed Hits? Hit Rates Vol. 1–7',
    seoDescription:
      'Every Chinese Gem Pack has one guaranteed Rare or better. A box averages about one full art, but none is guaranteed. Official hit rates for Vol. 1 to 7.',
    tag: 'Collecting guide',
    date: '2026-11-21',
    heroImage: `${SITE_URL}/assets/blog/gem-pack-hit-rates-guide-hero.webp`,
    heroAlt: 'Gem Pack Hit Rates banner: a fan of seven Gem Pack booster packs, Vol. 1 to Vol. 7, with the Vol. 7 Psyduck pack in front',
    glow1: 'rgb(222 4 123 / .26)',
    glow2: 'rgb(58 110 165 / .30)',
  },
  {
    slug: 'how-to-read-chinese-pokemon-cards',
    path: '/blog/how-to-read-chinese-pokemon-cards',
    title: 'How to Read a Chinese Pokémon Card: Names, Numbers, Set Codes and Rarity Marks',
    excerpt:
      'A labelled walkthrough of a real Simplified Chinese card, Kirlia 054/128 from Miracle Journey: the name, HP, type, attacks, regulation mark, set code, collector number, rarity mark and illustrator, with the Chinese words you will see.',
    seoTitle: 'How to Read Chinese Pokémon Cards: Set Codes, Numbers & Rarity',
    seoDescription:
      'How to read a Simplified Chinese Pokémon card: name, HP, attacks, set code such as CSV2C, collector number, rarity mark, regulation mark and illustrator, labelled.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/how-to-read-chinese-pokemon-cards-hero.webp`,
    heroAlt: 'How to Read a Chinese Card banner: the Simplified Chinese Gardevoir ex from Miracle Journey in front of Ralts and Kirlia',
    glow1: 'rgb(226 110 170 / .28)',
    glow2: 'rgb(70 160 90 / .22)',
  },
  {
    slug: 'chinese-pokemon-card-rarities',
    path: '/blog/chinese-pokemon-card-rarities',
    title: 'Chinese Pokémon Card Rarities Explained: C, U, R, RR, AR, SR, SAR, UR and More',
    excerpt:
      'Every rarity in the Simplified Chinese Pokémon TCG sets, from Common to Ultra Rare, plus ACE SPEC, Black White Rare, Shiny, Pikachu Rare, Futuristic Rare and the Gem Pack star marks, with example cards and counts for every set.',
    seoTitle: 'Chinese Pokémon Card Rarities: SR, SAR, UR, RR Chart and Odds',
    seoDescription:
      'Every rarity code on Simplified Chinese Pokémon cards, C to SAR and UR, with English names, official odds, Gem Pack stars and example cards.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-pokemon-card-rarities-hero-v2.webp`,
    heroAlt: "Chinese Card Rarities banner: the Zekrom ex Black White Rare 174/086 from Black Bolt in front of the N's Plan and Hilda Special Art Rares",
    glow1: 'rgb(232 192 96 / .28)',
    glow2: 'rgb(110 90 40 / .25)',
  },
  {
    slug: 'chinese-pokemon-slim-vs-jumbo',
    path: '/blog/chinese-pokemon-slim-vs-jumbo',
    title: 'Slim vs Jumbo: The Two Pack Sizes in Chinese Pokémon Sets',
    excerpt:
      'Simplified Chinese Pokémon expansions come in a 5-card slim pack with 1 holo and a 20-card jumbo pack with 6 or 7 holos. What each pack and box holds, which sets have both, and how the official odds differ.',
    seoTitle: 'Chinese Pokémon Slim vs Jumbo Packs: Cards, Holos and Odds',
    seoDescription:
      'Chinese Pokémon slim vs jumbo: a 5-card slim pack has 1 holo, a 20-card jumbo pack has 6 or 7. Box contents, which sets have both, and the official odds.',
    tag: 'Collecting guide',
    date: '2026-11-24',
    heroImage: `${SITE_URL}/assets/blog/chinese-pokemon-slim-vs-jumbo-hero.webp`,
    heroAlt: 'Slim vs Jumbo Packs banner: the Chasing Glory 5-card slim pack and 20-card jumbo pack side by side',
    glow1: 'rgb(71 118 121 / .30)',
    glow2: 'rgb(216 123 115 / .25)',
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
    heroImage: `${SITE_URL}/assets/blog/reward-round-release-hero.webp`,
    heroAlt: 'Reward Round slim and jumbo booster packs with the Gholdengo ex Special Art Rare in front and the Maushold ex Special Art Rare behind',
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
    heroImage: `${SITE_URL}/assets/blog/reward-round-guide-hero.webp`,
    heroAlt: 'The Gholdengo ex Special Art Rare in an EBI display case above six more Reward Round Special Art Rares',
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
    heroImage: `${SITE_URL}/assets/blog/fearless-terastal-release-hero.webp`,
    heroAlt: 'Fearless Terastal banner: the slim and jumbo booster packs with the Arcanine ex Special Art Rare and the gold Ting-Lu ex',
    glow1: 'rgb(214 96 40 / .30)',
    glow2: 'rgb(64 130 170 / .25)',
  },
  {
    slug: 'fearless-terastal-set-guide',
    path: '/blog/fearless-terastal-set-guide',
    title: 'Fearless Terastal Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Fearless Terastal (set code CSV3C) has Tera Arcanine ex on the pack and 35 secret rares behind a 130-card main set. This guide shows every chase card and the pull odds for the slim and jumbo packs.',
    seoTitle: 'Pokémon Fearless Terastal (CSV3C) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Fearless Terastal (CSV3C) has 165 cards, with Tera Arcanine ex on the pack and a Chinese Exclusive Arcanine ex Special Art Rare. This guide shows every Special Art Rare and the official pull odds.',
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
      'Eternal Birth (set code CSV1C) is the first Chinese Scarlet & Violet set, with Miraidon on the pack and Pokémon ex in Simplified Chinese. It comes in a 5-card slim pack and a 20-card jumbo pack, and Miraidon ex and Koraidon ex are its lead chase cards.',
    seoTitle: 'Pokémon Eternal Birth (CSV1C): Miraidon ex & Release Info',
    seoDescription:
      'Pokémon TCG Eternal Birth (set code CSV1C) is the first Chinese Scarlet & Violet set, released January 17, 2025. Miraidon ex and Koraidon ex lead it.',
    tag: 'New release',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/eternal-birth-release-miriam-hero.webp`,
    heroAlt: 'Eternal Birth banner: the slim and jumbo booster packs with the Miriam Special Art Rare in front and the Koraidon ex Special Art Rare behind',
    glow1: 'rgb(98 78 190 / .30)',
    glow2: 'rgb(230 200 60 / .25)',
  },
  {
    slug: 'eternal-birth-set-guide',
    path: '/blog/eternal-birth-set-guide',
    title: 'Eternal Birth Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Eternal Birth (set code CSV1C) has 40 secret rares behind a 127-card main set, and its 5-card slim and 20-card jumbo packs have different pull odds. This guide shows every chase card and how often you can expect to pull one.',
    seoTitle: 'Pokémon Eternal Birth (CSV1C) Set Guide: Chase Cards & Odds',
    seoDescription:
      'Pokémon TCG Eternal Birth (set code CSV1C) has 167 cards and 40 secret rares. This guide shows every chase card and the official pull odds.',
    tag: 'Set guide',
    date: '2025-01-17',
    heroImage: `${SITE_URL}/assets/blog/eternal-birth-guide-miriam-hero.webp`,
    heroAlt: 'The Miriam Special Art Rare in an EBI display case above six more Eternal Birth Special Art Rares, led by Miraidon ex and Koraidon ex',
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
    heroImage: `${SITE_URL}/assets/blog/miracle-journey-release-hero.webp`,
    heroAlt: "Miracle Journey banner: the slim and jumbo booster packs with the Gardevoir ex Special Art Rare and the Erika's Invitation Super Rare",
    glow1: 'rgb(226 110 170 / .30)',
    glow2: 'rgb(70 160 90 / .25)',
  },
  {
    slug: 'miracle-journey-set-guide',
    path: '/blog/miracle-journey-set-guide',
    title: 'Miracle Journey Set Guide: Every Chase Card and the Pull Odds',
    excerpt:
      'Miracle Journey (set code CSV2C) has 35 secret rares behind a 128-card main set, and its slim and jumbo packs have different pull odds. This guide shows every chase card and how often you can expect to pull one.',
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
    title: '30th Celebration Is Here: Pikachu ex, 30 Pikachu, Futuristic Rares and 30 Classic Cards',
    excerpt:
      '30th Celebration (set code 30thC) is the Pokémon TCG\'s 30th anniversary set, with Pikachu on the pack and one of 30 different Pikachu in every pack. It also has Pikachu ex Special Art Rares, the new Futuristic Rare and 30 famous cards from 1999 to 2023.',
    seoTitle: 'Pokémon 30th Celebration (30thC): Pikachu ex & Release Info',
    seoDescription:
      'Pokémon TCG 30th Celebration (30thC) in Simplified Chinese has Pikachu on the pack, a Pikachu in every pack, Pikachu ex Special Art Rares and 30 classic cards.',
    tag: 'New release',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-release-pikachu-hero.webp`,
    heroAlt: "The 30th Celebration booster pack with the Pikachu ex Special Art Rare 126/103 in front and the Mew ex Futuristic Rare behind",
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-set-guide',
    path: '/blog/30th-celebration-set-guide',
    title: '30th Celebration Set Guide: Every Pikachu, Classic and Promo',
    excerpt:
      "30th Celebration (set code 30thC) is the Pokémon TCG's 30th anniversary set: 165 holo cards, with Pikachu on the pack and a Pikachu in every pack. This guide helps you sort your pulls, see what a box holds on average and plan a master set.",
    seoTitle: 'Pokémon 30th Celebration (30thC) Set Guide: Chase Cards & Box Odds',
    seoDescription:
      'Pokémon TCG 30th Celebration (30thC) is the 30th anniversary set, with Pikachu on the pack. This guide shows all 30 Pikachu and what a 20-pack box holds on average.',
    tag: 'Set guide',
    date: '2026-09-16',
    heroImage: `${SITE_URL}/assets/blog/30th-celebration-guide-pikachu-hero.webp`,
    heroAlt: "The Pikachu ex Special Art Rare 126/103 in an EBI display case above six of the 30 Pikachu cards",
    glow1: 'rgb(222 185 97 / .30)',
    glow2: 'rgb(90 45 5 / .40)',
  },
  {
    slug: '30th-celebration-card-origins',
    path: '/blog/30th-celebration-card-origins',
    title: 'Where Every 30th Celebration Classic Card Comes From',
    excerpt:
      'The 30 classic cards in 30th Celebration (set code 30thC) reprint famous English cards, from the Base Set Pikachu and Charizard of 1999 to the Paldea Evolved Magikarp of 2023. This guide matches each one to its original card.',
    seoTitle: 'Pokémon 30th Celebration (30thC) Card Origins: English Art Matches',
    seoDescription:
      'The 30 classic cards in Pokémon TCG 30th Celebration (30thC) traced to English, from the Base Set Pikachu and Charizard of 1999 to Paldea Evolved Magikarp.',
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
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-guide-floragato-hero.webp`,
    heroAlt: "Gem Vol. 5 Set Guide banner: the Floragato full art 2207/07 in a display case, with six holo Floragato versions beside the EBI Collectibles logo",
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
  {
    slug: 'dynamax-clash-thunder-release-news',
    path: '/blog/dynamax-clash-thunder-release-news',
    title: 'Dynamax Clash: Thunder (CS1a) Set Overview: Pikachu VMAX, Packs and Every Rarity',
    excerpt:
      'Dynamax Clash: Thunder (CS1aC) is the Water, Lightning, Psychic and Fighting half of Dynamax Clash, which started the Simplified Chinese Sword & Shield series on May 19, 2023. How it was sold, its 217 cards and every rarity.',
    seoTitle: 'Pokémon Dynamax Clash: Thunder (CS1aC) Set Overview',
    seoDescription:
      'Simplified Chinese Dynamax Clash: Thunder (CS1aC), May 19, 2023: 5-card and 25-card packs, 217 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-thunder-overview-hero.webp`,
    heroAlt: 'The Dynamax Clash: Thunder Pikachu VMAX Hyper Rare in front, with the Pikachu V full art and the Marnie Hyper Rare behind it',
    glow1: 'rgb(250 205 60 / .26)',
    glow2: 'rgb(70 100 170 / .30)',
  },
  {
    slug: 'dynamax-clash-thunder-card-origins',
    path: '/blog/dynamax-clash-thunder-card-origins',
    title: 'Where Every Dynamax Clash: Thunder Card Comes From',
    excerpt:
      'All 217 Dynamax Clash: Thunder (CS1aC) cards matched to their English versions: 69 from Rebel Clash, 68 from Sword & Shield, 45 from the Shining Fates Shiny Vault and 35 from seven other sources.',
    seoTitle: 'Dynamax Clash: Thunder (CS1aC) Card Origins: English Matches',
    seoDescription:
      'All 217 Pokémon TCG Dynamax Clash: Thunder (CS1aC) cards matched to English: 69 Rebel Clash, 68 Sword & Shield, 45 Shining Fates Shiny Vault.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-thunder-origins-hero.webp`,
    heroAlt: 'The Dynamax Clash: Thunder Pikachu VMAX Hyper Rare beside tiles for Rebel Clash, Sword & Shield, the Shining Fates Shiny Vault and other sources',
    glow1: 'rgb(250 205 60 / .26)',
    glow2: 'rgb(70 100 170 / .30)',
  },
  {
    slug: 'dynamax-clash-thunder-set-guide',
    path: '/blog/dynamax-clash-thunder-set-guide',
    title: 'Dynamax Clash: Thunder Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Dynamax Clash: Thunder (CS1aC), from the gold Ultra Rares and rainbow Hyper Rares to the Shiny cards, plus how the numbers work and the 329-card master set.',
    seoTitle: 'Dynamax Clash: Thunder (CS1aC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Dynamax Clash: Thunder (CS1aC) set guide: every Ultra Rare, Hyper Rare, Super Rare and Shiny card, the numbering and the 329-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-thunder-guide-hero.webp`,
    heroAlt: 'The Dynamax Clash: Thunder Pikachu VMAX Hyper Rare in front of four more Hyper Rares: Marnie, Gardevoir VMAX, Snorlax VMAX and Boss\'s Orders',
    glow1: 'rgb(250 205 60 / .26)',
    glow2: 'rgb(70 100 170 / .30)',
  },
  {
    slug: 'dynamax-clash-flame-release-news',
    path: '/blog/dynamax-clash-flame-release-news',
    title: 'Dynamax Clash: Flame (CS1b) Set Overview: Cinderace VMAX, Packs and Every Rarity',
    excerpt:
      'Dynamax Clash: Flame (CS1bC) is the Grass, Fire, Darkness and Metal half of Dynamax Clash, released in mainland China on May 19, 2023. How it was sold, its 199 cards and every rarity.',
    seoTitle: 'Pokémon Dynamax Clash: Flame (CS1bC) Set Overview',
    seoDescription:
      'Simplified Chinese Dynamax Clash: Flame (CS1bC), May 19, 2023: 5-card and 25-card packs, 199 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-flame-overview-hero.webp`,
    heroAlt: 'The Dynamax Clash: Flame Cinderace VMAX Hyper Rare in front, with the gold Zacian V and Zamazenta V behind it',
    glow1: 'rgb(240 110 50 / .28)',
    glow2: 'rgb(60 120 90 / .28)',
  },
  {
    slug: 'dynamax-clash-flame-card-origins',
    path: '/blog/dynamax-clash-flame-card-origins',
    title: 'Where Every Dynamax Clash: Flame Card Comes From',
    excerpt:
      'All 199 Dynamax Clash: Flame (CS1bC) cards matched to their English versions: 73 from Rebel Clash, 52 from Sword & Shield, 33 from Darkness Ablaze, 32 from the Shining Fates Shiny Vault and 9 from five other sources.',
    seoTitle: 'Dynamax Clash: Flame (CS1bC) Card Origins: English Matches',
    seoDescription:
      'All 199 Pokémon TCG Dynamax Clash: Flame (CS1bC) cards matched to English: 73 Rebel Clash, 52 Sword & Shield, 33 Darkness Ablaze, 32 Shiny Vault.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-flame-origins-hero.webp`,
    heroAlt: 'The Dynamax Clash: Flame Cinderace VMAX Hyper Rare beside tiles for Rebel Clash, Sword & Shield, Darkness Ablaze, the Shining Fates Shiny Vault and other sources',
    glow1: 'rgb(240 110 50 / .28)',
    glow2: 'rgb(60 120 90 / .28)',
  },
  {
    slug: 'dynamax-clash-flame-set-guide',
    path: '/blog/dynamax-clash-flame-set-guide',
    title: 'Dynamax Clash: Flame Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Dynamax Clash: Flame (CS1bC), from the gold Ultra Rares and rainbow Hyper Rares to the Shiny cards, plus how the numbers work and the 315-card master set.',
    seoTitle: 'Dynamax Clash: Flame (CS1bC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Dynamax Clash: Flame (CS1bC) set guide: every Ultra Rare, Hyper Rare, Super Rare and Shiny card, the numbering and the 315-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-clash-flame-guide-hero.webp`,
    heroAlt: 'The Dynamax Clash: Flame Cinderace VMAX Hyper Rare in front of four more Hyper Rares: Rillaboom VMAX, Centiskorch VMAX, Copperajah VMAX and Milo',
    glow1: 'rgb(240 110 50 / .28)',
    glow2: 'rgb(60 120 90 / .28)',
  },
  {
    slug: 'dynamax-tactics-release-news',
    path: '/blog/dynamax-tactics-release-news',
    title: 'Dynamax Tactics (CS1.5) Set Overview: Dragapult VMAX, Packs and Every Rarity',
    excerpt:
      'Dynamax Tactics (CS1.5C) is the Simplified Chinese enhanced pack set that followed Dynamax Clash, released on June 28, 2023. How it was sold, its 96 cards and every rarity.',
    seoTitle: 'Pokémon Dynamax Tactics (CS1.5C) Set Overview',
    seoDescription:
      'Simplified Chinese Dynamax Tactics (CS1.5C), June 28, 2023: 6-card enhanced packs, 96 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-tactics-overview-hero.webp`,
    heroAlt: 'The Dynamax Tactics Dragapult VMAX Hyper Rare in front, with the shiny Dragapult VMAX and the Oleana Hyper Rare behind it',
    glow1: 'rgb(90 170 120 / .26)',
    glow2: 'rgb(120 80 170 / .28)',
  },
  {
    slug: 'dynamax-tactics-card-origins',
    path: '/blog/dynamax-tactics-card-origins',
    title: 'Where Every Dynamax Tactics Card Comes From',
    excerpt:
      'All 96 Dynamax Tactics (CS1.5C) cards matched to their English versions: 31 from Rebel Clash, 23 from Darkness Ablaze, 17 from the Shining Fates Shiny Vault, 14 from Sword & Shield and 11 from four other sources.',
    seoTitle: 'Dynamax Tactics (CS1.5C) Card Origins: English Matches',
    seoDescription:
      'All 96 Pokémon TCG Dynamax Tactics (CS1.5C) cards matched to English: 31 Rebel Clash, 23 Darkness Ablaze, 17 Shiny Vault, 14 Sword & Shield.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-tactics-origins-hero.webp`,
    heroAlt: 'The Dynamax Tactics Dragapult VMAX Hyper Rare beside tiles for Rebel Clash, Darkness Ablaze, the Shining Fates Shiny Vault, Sword & Shield and other sources',
    glow1: 'rgb(90 170 120 / .26)',
    glow2: 'rgb(120 80 170 / .28)',
  },
  {
    slug: 'dynamax-tactics-set-guide',
    path: '/blog/dynamax-tactics-set-guide',
    title: 'Dynamax Tactics Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Dynamax Tactics (CS1.5C), from the gold Ultra Rares and rainbow Hyper Rares to the Shiny cards, plus how the numbers work and the 141-card master set.',
    seoTitle: 'Dynamax Tactics (CS1.5C) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Dynamax Tactics (CS1.5C) set guide: every Ultra Rare, Hyper Rare, Super Rare and Shiny card, the numbering and the 141-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/dynamax-tactics-guide-hero.webp`,
    heroAlt: 'The Dynamax Tactics Dragapult VMAX Hyper Rare in front of the Oleana, Kabu and Pokémon Breeder\'s Nurturing Hyper Rares and the shiny Dragapult VMAX',
    glow1: 'rgb(90 170 120 / .26)',
    glow2: 'rgb(120 80 170 / .28)',
  },
  {
    slug: 'vivid-portrayals-obsidian-release-news',
    path: '/blog/vivid-portrayals-obsidian-release-news',
    title: 'Vivid Portrayals: Obsidian (CS2a) Set Overview: Charizard VMAX, Packs and Every Rarity',
    excerpt:
      'Vivid Portrayals: Obsidian (CS2aC) is the Grass, Fire, Fighting and Metal half of Vivid Portrayals, released in mainland China on August 18, 2023. How it was sold, its 143 cards and every rarity.',
    seoTitle: 'Pokémon Vivid Portrayals: Obsidian (CS2aC) Set Overview',
    seoDescription:
      'Simplified Chinese Vivid Portrayals: Obsidian (CS2aC), August 18, 2023: 5-card and 25-card packs, 143 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-obsidian-overview-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Obsidian shiny Charizard VMAX in front, with the shiny Charizard V and the Leon Hyper Rare behind it',
    glow1: 'rgb(235 95 70 / .26)',
    glow2: 'rgb(70 90 120 / .30)',
  },
  {
    slug: 'vivid-portrayals-obsidian-card-origins',
    path: '/blog/vivid-portrayals-obsidian-card-origins',
    title: 'Where Every Vivid Portrayals: Obsidian Card Comes From',
    excerpt:
      'All 143 Vivid Portrayals: Obsidian (CS2aC) cards matched to their English versions: 85 from Vivid Voltage, 46 from Darkness Ablaze and 12 from five other sources.',
    seoTitle: 'Vivid Portrayals: Obsidian (CS2aC) Card Origins: English Matches',
    seoDescription:
      'All 143 Pokémon TCG Vivid Portrayals: Obsidian (CS2aC) cards matched to English: 85 Vivid Voltage, 46 Darkness Ablaze, 12 from five other sources.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-obsidian-origins-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Obsidian shiny Charizard VMAX beside tiles for Vivid Voltage, Darkness Ablaze, the Shining Fates Shiny Vault and other sources',
    glow1: 'rgb(235 95 70 / .26)',
    glow2: 'rgb(70 90 120 / .30)',
  },
  {
    slug: 'vivid-portrayals-obsidian-set-guide',
    path: '/blog/vivid-portrayals-obsidian-set-guide',
    title: 'Vivid Portrayals: Obsidian Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Vivid Portrayals: Obsidian (CS2aC), from the gold Ultra Rares and rainbow Hyper Rares down, plus how the numbers work and the 241-card master set.',
    seoTitle: 'Vivid Portrayals: Obsidian (CS2aC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Vivid Portrayals: Obsidian (CS2aC) set guide: every Ultra Rare, Hyper Rare and Super Rare, the numbering and the 241-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-obsidian-guide-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Obsidian shiny Charizard VMAX in front of four Hyper Rares: Salamence VMAX, Leon, Allister and Bea',
    glow1: 'rgb(235 95 70 / .26)',
    glow2: 'rgb(70 90 120 / .30)',
  },
  {
    slug: 'vivid-portrayals-indigo-release-news',
    path: '/blog/vivid-portrayals-indigo-release-news',
    title: 'Vivid Portrayals: Indigo (CS2b) Set Overview: Eternatus VMAX, Packs and Every Rarity',
    excerpt:
      'Vivid Portrayals: Indigo (CS2bC) is the Water, Lightning, Psychic and Darkness half of Vivid Portrayals, released in mainland China on August 18, 2023. How it was sold, its 143 cards and every rarity.',
    seoTitle: 'Pokémon Vivid Portrayals: Indigo (CS2bC) Set Overview',
    seoDescription:
      'Simplified Chinese Vivid Portrayals: Indigo (CS2bC), August 18, 2023: 5-card and 25-card packs, 143 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-indigo-overview-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Indigo Eternatus VMAX Hyper Rare in front, with the shiny Crobat VMAX and the Eternatus V full art behind it',
    glow1: 'rgb(150 110 230 / .28)',
    glow2: 'rgb(60 90 150 / .30)',
  },
  {
    slug: 'vivid-portrayals-indigo-card-origins',
    path: '/blog/vivid-portrayals-indigo-card-origins',
    title: 'Where Every Vivid Portrayals: Indigo Card Comes From',
    excerpt:
      'All 143 Vivid Portrayals: Indigo (CS2bC) cards matched to their English versions: 71 from Vivid Voltage, 44 from Darkness Ablaze, 11 from Champion\'s Path and 17 from four other sources.',
    seoTitle: 'Vivid Portrayals: Indigo (CS2bC) Card Origins: English Matches',
    seoDescription:
      'All 143 Pokémon TCG Vivid Portrayals: Indigo (CS2bC) cards matched to English: 71 Vivid Voltage, 44 Darkness Ablaze, 11 Champion\'s Path.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-indigo-origins-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Indigo Eternatus VMAX Hyper Rare beside tiles for Vivid Voltage, Darkness Ablaze, Champion\'s Path and other sources',
    glow1: 'rgb(150 110 230 / .28)',
    glow2: 'rgb(60 90 150 / .30)',
  },
  {
    slug: 'vivid-portrayals-indigo-set-guide',
    path: '/blog/vivid-portrayals-indigo-set-guide',
    title: 'Vivid Portrayals: Indigo Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Vivid Portrayals: Indigo (CS2bC), from the gold Ultra Rares and rainbow Hyper Rares down, plus how the numbers work and the 241-card master set.',
    seoTitle: 'Vivid Portrayals: Indigo (CS2bC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Vivid Portrayals: Indigo (CS2bC) set guide: every Ultra Rare, Hyper Rare and Super Rare, the numbering and the 241-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/vivid-portrayals-indigo-guide-hero.webp`,
    heroAlt: 'The Vivid Portrayals: Indigo Eternatus VMAX Hyper Rare in front of four more Hyper Rares: Galarian Darmanitan VMAX, Drednaw VMAX, Alcremie VMAX and Nessa',
    glow1: 'rgb(150 110 230 / .28)',
    glow2: 'rgb(60 90 150 / .30)',
  },
  {
    slug: 'brilliant-counterattack-release-news',
    path: '/blog/brilliant-counterattack-release-news',
    title: 'Brilliant Counterattack (CS2.5) Set Overview: Togekiss VMAX, Packs and Every Rarity',
    excerpt:
      'Brilliant Counterattack (CS2.5C) is the Simplified Chinese enhanced pack set that followed Vivid Portrayals, released on September 29, 2023. How it was sold, its 79 cards and every rarity.',
    seoTitle: 'Pokémon Brilliant Counterattack (CS2.5C) Set Overview',
    seoDescription:
      'Simplified Chinese Brilliant Counterattack (CS2.5C), September 29, 2023: 6-card enhanced packs, 79 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/brilliant-counterattack-overview-hero.webp`,
    heroAlt: 'The Brilliant Counterattack Togekiss VMAX Hyper Rare in front, with the Aegislash VMAX Hyper Rare and the shiny Ditto VMAX behind it',
    glow1: 'rgb(240 130 170 / .26)',
    glow2: 'rgb(90 80 160 / .30)',
  },
  {
    slug: 'brilliant-counterattack-card-origins',
    path: '/blog/brilliant-counterattack-card-origins',
    title: 'Where Every Brilliant Counterattack Card Comes From',
    excerpt:
      'All 79 Brilliant Counterattack (CS2.5C) cards matched to their English versions: 38 from Vivid Voltage, 15 from Darkness Ablaze, 9 from Shining Fates, 8 from Champion\'s Path and 9 from five other sources.',
    seoTitle: 'Brilliant Counterattack (CS2.5C) Card Origins: English Matches',
    seoDescription:
      'All 79 Pokémon TCG Brilliant Counterattack (CS2.5C) cards matched to English: 38 Vivid Voltage, 15 Darkness Ablaze, 9 Shining Fates, 8 Champion\'s Path.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/brilliant-counterattack-origins-hero.webp`,
    heroAlt: 'The Brilliant Counterattack Togekiss VMAX Hyper Rare beside tiles for Vivid Voltage, Darkness Ablaze, Shining Fates, Champion\'s Path and other sources',
    glow1: 'rgb(240 130 170 / .26)',
    glow2: 'rgb(90 80 160 / .30)',
  },
  {
    slug: 'brilliant-counterattack-set-guide',
    path: '/blog/brilliant-counterattack-set-guide',
    title: 'Brilliant Counterattack Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Brilliant Counterattack (CS2.5C), from the gold Ultra Rares and rainbow Hyper Rares down, plus how the numbers work and the 126-card master set.',
    seoTitle: 'Brilliant Counterattack (CS2.5C) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Brilliant Counterattack (CS2.5C) set guide: every Ultra Rare, Hyper Rare and Super Rare, the numbering and the 126-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/brilliant-counterattack-guide-hero.webp`,
    heroAlt: 'The Brilliant Counterattack Togekiss VMAX Hyper Rare in front of the Beauty, Rose and Aegislash VMAX Hyper Rares and the shiny Ditto VMAX',
    glow1: 'rgb(240 130 170 / .26)',
    glow2: 'rgb(90 80 160 / .30)',
  },
  {
    slug: 'primordial-arts-overgrow-release-news',
    path: '/blog/primordial-arts-overgrow-release-news',
    title: 'Primordial Arts: Overgrow (CS3a) Set Overview: Venusaur VMAX, Packs and Every Rarity',
    excerpt:
      'Primordial Arts: Overgrow (CS3aC) is the Single Strike half of Primordial Arts, released in mainland China on November 17, 2023. How it was sold, its 184 cards and every rarity.',
    seoTitle: 'Pokémon Primordial Arts: Overgrow (CS3aC) Set Overview',
    seoDescription:
      'Simplified Chinese Primordial Arts: Overgrow (CS3aC), November 17, 2023: 5-card and 25-card packs, 184 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-overgrow-overview-hero.webp`,
    heroAlt: 'The Primordial Arts: Overgrow Venusaur VMAX Hyper Rare in front, with the Single Strike Urshifu VMAX and Shadow Rider Calyrex VMAX Hyper Rares behind it',
    glow1: 'rgb(80 190 110 / .26)',
    glow2: 'rgb(150 60 70 / .28)',
  },
  {
    slug: 'primordial-arts-overgrow-card-origins',
    path: '/blog/primordial-arts-overgrow-card-origins',
    title: 'Where Every Primordial Arts: Overgrow Card Comes From',
    excerpt:
      'All 184 Primordial Arts: Overgrow (CS3aC) cards matched to their English versions: 80 from Chilling Reign, 69 from Battle Styles, 19 from Evolving Skies, 10 from the Trainer Galleries and 5 promos and others, with one card that English never printed.',
    seoTitle: 'Primordial Arts: Overgrow (CS3aC) Card Origins: English Matches',
    seoDescription:
      'All 184 Pokémon TCG Primordial Arts: Overgrow (CS3aC) cards matched to English: 80 Chilling Reign, 69 Battle Styles, 19 Evolving Skies, 10 Trainer Gallery.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-overgrow-origins-hero.webp`,
    heroAlt: 'The Primordial Arts: Overgrow Venusaur VMAX Hyper Rare beside tiles for Chilling Reign, Battle Styles, Evolving Skies, the Trainer Galleries and other sources',
    glow1: 'rgb(80 190 110 / .26)',
    glow2: 'rgb(150 60 70 / .28)',
  },
  {
    slug: 'primordial-arts-overgrow-set-guide',
    path: '/blog/primordial-arts-overgrow-set-guide',
    title: 'Primordial Arts: Overgrow Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Primordial Arts: Overgrow (CS3aC), from the gold Ultra Rares and rainbow Hyper Rares down, plus how the numbers work and the 290-card master set.',
    seoTitle: 'Primordial Arts: Overgrow (CS3aC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Primordial Arts: Overgrow (CS3aC) set guide: every Ultra Rare, Hyper Rare and Super Rare, the numbering and the 290-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-overgrow-guide-hero.webp`,
    heroAlt: 'The Primordial Arts: Overgrow Venusaur VMAX Hyper Rare in front of four more Hyper Rares: Single Strike Urshifu VMAX, Shadow Rider Calyrex VMAX, Tornadus VMAX and Single Strike Style Mustard',
    glow1: 'rgb(80 190 110 / .26)',
    glow2: 'rgb(150 60 70 / .28)',
  },
  {
    slug: 'primordial-arts-torrent-release-news',
    path: '/blog/primordial-arts-torrent-release-news',
    title: 'Primordial Arts: Torrent (CS3b) Set Overview: Blastoise VMAX, Packs and Every Rarity',
    excerpt:
      'Primordial Arts: Torrent (CS3bC) is the Rapid Strike half of Primordial Arts, released in mainland China on November 17, 2023. How it was sold, its 179 cards and every rarity.',
    seoTitle: 'Pokémon Primordial Arts: Torrent (CS3bC) Set Overview',
    seoDescription:
      'Simplified Chinese Primordial Arts: Torrent (CS3bC), November 17, 2023: 5-card and 25-card packs, 179 cards, every rarity and the English sets its cards come from.',
    tag: 'Set overview',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-torrent-overview-hero.webp`,
    heroAlt: 'The Primordial Arts: Torrent Blastoise VMAX Hyper Rare in front, with the Rapid Strike Urshifu VMAX and Ice Rider Calyrex VMAX Hyper Rares behind it',
    glow1: 'rgb(70 150 230 / .28)',
    glow2: 'rgb(60 90 130 / .30)',
  },
  {
    slug: 'primordial-arts-torrent-card-origins',
    path: '/blog/primordial-arts-torrent-card-origins',
    title: 'Where Every Primordial Arts: Torrent Card Comes From',
    excerpt:
      'All 179 Primordial Arts: Torrent (CS3bC) cards matched to their English versions: 79 from Chilling Reign, 63 from Battle Styles, 21 from Evolving Skies, 11 from the Trainer Galleries and 4 promos and others, with one card that English never printed.',
    seoTitle: 'Primordial Arts: Torrent (CS3bC) Card Origins: English Matches',
    seoDescription:
      'All 179 Pokémon TCG Primordial Arts: Torrent (CS3bC) cards matched to English: 79 Chilling Reign, 63 Battle Styles, 21 Evolving Skies, 11 Trainer Gallery.',
    tag: 'Collecting guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-torrent-origins-hero.webp`,
    heroAlt: 'The Primordial Arts: Torrent Blastoise VMAX Hyper Rare beside tiles for Chilling Reign, Battle Styles, Evolving Skies, the Trainer Galleries and other sources',
    glow1: 'rgb(70 150 230 / .28)',
    glow2: 'rgb(60 90 130 / .30)',
  },
  {
    slug: 'primordial-arts-torrent-set-guide',
    path: '/blog/primordial-arts-torrent-set-guide',
    title: 'Primordial Arts: Torrent Set Guide: Every Secret Card and the Master Set',
    excerpt:
      'Every secret card in Primordial Arts: Torrent (CS3bC), from the gold Ultra Rares and rainbow Hyper Rares down, plus how the numbers work and the 283-card master set.',
    seoTitle: 'Primordial Arts: Torrent (CS3bC) Set Guide: Secret Cards',
    seoDescription:
      'Pokémon TCG Primordial Arts: Torrent (CS3bC) set guide: every Ultra Rare, Hyper Rare and Super Rare, the numbering and the 283-card master set.',
    tag: 'Set guide',
    date: '2026-11-28',
    heroImage: `${SITE_URL}/assets/blog/primordial-arts-torrent-guide-hero.webp`,
    heroAlt: 'The Primordial Arts: Torrent Blastoise VMAX Hyper Rare in front of four more Hyper Rares: Rapid Strike Urshifu VMAX, Ice Rider Calyrex VMAX, Blaziken VMAX and Rapid Strike Style Mustard',
    glow1: 'rgb(70 150 230 / .28)',
    glow2: 'rgb(60 90 130 / .30)',
  },
]

export const BLOG_SITE_URL = SITE_URL
