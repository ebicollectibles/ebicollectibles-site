// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blogs/news
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'gem-vol-7-has-arrived' | 'black-bolt-white-flare-arrive' | 'gem-vol-7-card-origins' | 'gem-vol-6-has-arrived' | 'gem-vol-6-set-guide' | 'gem-vol-6-card-origins'

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
    slug: 'gem-vol-7-has-arrived',
    path: '/blogs/news/gem-vol-7-has-arrived',
    title: "Gem Vol 7 Is Here: Misty's Psyduck Leads a Trainer-Paired Lineup",
    excerpt:
      "The seventh Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a brand-new Misty's Psyduck full art you can only pull here.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-ebi-hero.webp`,
    heroAlt: "Misty's Psyduck full art from Gem Pack Vol. 7 in a display case, with the six holo Psyduck versions lined up beside the EBI Collectibles logo",
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
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-release-hero.webp`,
    heroAlt: 'Applin full art from Gem Pack Vol. 6 in a display case, with the six holo Applin versions lined up beside the EBI Collectibles logo',
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
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-guide-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 6 full arts, including Applin, Flapple and Appletun, in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(78 119 104 / .30)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-6-card-origins',
    path: '/blogs/news/gem-vol-6-card-origins',
    title: 'Where Every Gem Vol 6 Card Actually Comes From',
    excerpt:
      "55 of the 56 illustrations in Gem Vol 6 first appeared on English Scarlet & Violet cards, mostly from Surging Sparks. Here's the full card-by-card map.",
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 6 full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 6 Card Origins',
    glow1: 'rgb(78 119 104 / .28)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'black-bolt-white-flare-arrive',
    path: '/blogs/news/black-bolt-white-flare-arrive',
    title: 'Black Bolt & White Flare Arrive Together — Zekrom ex and Reshiram ex Split Unova',
    excerpt:
      "Two officially-licensed expansions, one release day: 174 cards apiece, a Black White Rare mascot for each, and a Special Art Rare chase card for each set.",
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
    title: "Where Every Gem Vol 7 Card Actually Comes From",
    excerpt:
      "Gem Packs reprint existing English-language illustrations under new numbers, which means every card in Gem Vol 7 traces back to Journey Together or Destined Rivals. Here's the full map.",
    tag: 'Collecting guide',
    date: '2026-11-14',
    heroImage: `${R2_IMAGE_HOST}/Chinese/Gem%207/Cards/1907.webp`,
    heroAlt: "Team Rocket's Raticate, Gem Vol 7",
    glow1: 'rgb(58 110 165 / .28)',
    glow2: 'rgb(138 61 120 / .22)',
  },
]

export const BLOG_SITE_URL = SITE_URL
