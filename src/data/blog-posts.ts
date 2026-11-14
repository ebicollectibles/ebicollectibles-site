// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blogs/news
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'gem-vol-7-has-arrived' | 'black-bolt-white-flare-arrive' | 'gem-vol-7-card-origins'

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
    title: "Gem Vol 7 Has Landed — Misty's Psyduck Leads a Trainer-Paired Lineup",
    excerpt:
      "The 7th Simplified Chinese Gem Pack is here: 196 cards, 28 Pokémon each with a full 7-version ladder, and an exclusive Misty's Psyduck full art you won't find anywhere else.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${R2_IMAGE_HOST}/Chinese/Gem%207/Cards/0307.webp`,
    heroAlt: "Misty's Psyduck full art, Gem Vol 7",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
  },
  {
    slug: 'black-bolt-white-flare-arrive',
    path: '/blogs/news/black-bolt-white-flare-arrive',
    title: 'Black Bolt & White Flare Arrive Together — Zekrom ex and Reshiram ex Split Unova',
    excerpt:
      "Two officially-licensed expansions, one release day: 174 cards apiece, a Black White Rare mascot for each, and a Chinese-exclusive Special Art Rare you can only pull here.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${R2_IMAGE_HOST}/Chinese/Black%20Bolt/Cards/0174.webp`,
    heroAlt: 'Zekrom ex Black White Rare, Black Bolt',
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
