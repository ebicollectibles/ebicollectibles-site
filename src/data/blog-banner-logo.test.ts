import { describe, expect, it } from 'vitest'
import { BLOG_POSTS } from './blog-posts'

// Every blog banner carries the EBI Collectibles logo in exactly the same
// place at exactly the same size, so posts look consistent side by side on
// the blog index. This measures the logo on each banner file and fails if
// one drifts. The rule itself is written up in CLAUDE.md.
//
// On the 1600x900 banner file the logo occupies this box (left, top, right,
// bottom). It is 80px tall at (150, 120) on the 1920x1080 working canvas.
const LOGO_BOX = [125, 100, 384, 167]
// A pixel of slack for resampling differences between banner scripts.
const TOLERANCE = 2

const local = (url: string) => url.replace(/^https?:\/\/[^/]+/, 'public')

async function logoBox(file: string, sharp: typeof import('sharp')) {
  // Look only at the top-left corner, above any label that sits under the logo.
  const region = { left: 90, top: 70, width: 470, height: 102 }
  const crop = () => sharp(file).extract(region).greyscale()
  const { data, info } = await crop().raw().toBuffer({ resolveWithObject: true })
  const background = await crop().blur(40).raw().toBuffer()
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -1
  let y1 = -1
  // The logo is near-white on a dark background: its pixels are much
  // brighter than the blurred background behind them.
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = y * info.width + x
      if (data[i] - background[i] > 45) {
        if (x < x0) x0 = x
        if (y < y0) y0 = y
        if (x > x1) x1 = x
        if (y > y1) y1 = y
      }
    }
  }
  return [x0 + region.left, y0 + region.top, x1 + region.left + 1, y1 + region.top + 1]
}

describe('blog banner logo', async () => {
  // sharp arrives with the build tooling. If a dependency change ever removes
  // it, fail loudly: a skipped check would let banners drift unnoticed.
  const sharp = (await import('sharp')).default

  it('sits in the same place at the same size on every banner', async () => {
    const off: string[] = []
    for (const post of BLOG_POSTS) {
      const box = await logoBox(local(post.heroImage), sharp)
      if (box.some((v, i) => Math.abs(v - LOGO_BOX[i]) > TOLERANCE)) off.push(`${post.slug}: logo at ${box.join(', ')}`)
    }
    expect(off).toEqual([])
  }, 60_000)

  it('is 1600 by 900 on every banner', async () => {
    const wrong: string[] = []
    for (const post of BLOG_POSTS) {
      const meta = await sharp(local(post.heroImage)).metadata()
      if (meta.width !== 1600 || meta.height !== 900) wrong.push(`${post.slug}: ${meta.width}x${meta.height}`)
    }
    expect(wrong).toEqual([])
  }, 60_000)
})
