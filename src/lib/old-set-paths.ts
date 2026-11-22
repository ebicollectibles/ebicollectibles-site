import { GEM_SETS } from '~/data/gem-sets-index'

// Set pages used to live at /sets/<slug> with shorter names (csv4,
// black-bolt, gem-vol-4 ...). They now live at /sets/chinese/<slug>, and
// several CSV sets gained their name in front of the code
// (csv4 -> reward-round-csv4, black-bolt -> black-bolt-csv10-5).
//
// Google still has the old addresses, many with ?card=. At the owner's
// request they are not redirected: src/server.ts answers them with
// 410 Gone so Google drops them. This only decides which addresses count
// as an old set page; anything else under /sets/ is a normal 404.
//
// Matching, in order: the same slug, the new slug ending in "-<old>" (csv4,
// csv9-5), or the new slug starting with "<old>-csv" (black-bolt).
export function newSetPathForOldSlug(oldSlug: string): string | null {
  const s = oldSlug.trim().toLowerCase()
  if (!/^[a-z0-9-]{2,60}$/.test(s)) return null
  const exact = GEM_SETS.find((g) => g.slug === s)
  if (exact) return exact.path
  const byCode = GEM_SETS.find((g) => g.slug.endsWith(`-${s}`))
  if (byCode) return byCode.path
  const byName = GEM_SETS.find((g) => g.slug.startsWith(`${s}-csv`))
  return byName?.path ?? null
}

// /sets/<old-slug> (optionally with a trailing slash), not /sets/chinese/...
// or /sets/japanese/..., which are real pages.
export function isRemovedOldSetPath(pathname: string): boolean {
  const m = /^\/sets\/([^/]+)\/?$/.exec(pathname)
  if (!m) return false
  const slug = m[1].toLowerCase()
  if (slug === 'chinese' || slug === 'japanese') return false
  return newSetPathForOldSlug(slug) !== null
}

export const REMOVED_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page removed | EBI Collectibles</title>
<style>
  body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, sans-serif; background: #f6f7f8; color: #131b28; }
  main { max-width: 520px; margin: 0 auto; padding: 96px 20px; text-align: center; }
  h1 { font-size: 26px; margin: 0 0 12px; }
  p { font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #3d4756; }
  a { display: inline-block; background: #131b28; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 2px; font-size: 14px; font-weight: 600; margin: 4px; }
</style>
</head>
<body>
<main>
<h1>This page has been removed</h1>
<p>Our card lists have moved. You can find every set on the set lists page.</p>
<a href="/sets/chinese">Simplified Chinese set lists</a>
<a href="/">Home</a>
</main>
</body>
</html>`
