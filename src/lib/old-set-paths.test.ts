import { describe, expect, it } from 'vitest'
import { isRemovedOldSetPath, newSetPathForOldSlug } from './old-set-paths'

describe('old /sets/<slug> addresses', () => {
  // Every old slug Search Console reported as 404 or server error.
  const cases: Record<string, string> = {
    'gem-vol-1': '/sets/chinese/gem-vol-1',
    'gem-vol-4': '/sets/chinese/gem-vol-4',
    'gem-vol-7': '/sets/chinese/gem-vol-7',
    '30th-celebration': '/sets/chinese/30th-celebration',
    'black-bolt': '/sets/chinese/black-bolt-csv10-5',
    'white-flare': '/sets/chinese/white-flare-csv10-6',
    csv4: '/sets/chinese/reward-round-csv4',
    csv5: '/sets/chinese/black-crystal-blaze-csv5',
    csv6: '/sets/chinese/true-mystery-csv6',
    csv7: '/sets/chinese/blade-awakening-csv7',
    csv8: '/sets/chinese/brilliant-fantasy-csv8',
    csv9: '/sets/chinese/stellar-crystal-csv9',
    'csv9-5': '/sets/chinese/terastal-gathering-csv9-5',
    'collect-151-journey': '/sets/chinese/collect-151-journey',
    'collect-151-hope': '/sets/chinese/collect-151-hope',
    'collect-151-surprise': '/sets/chinese/collect-151-surprise',
    'collect-151-gathering': '/sets/chinese/collect-151-gathering',
  }
  for (const [oldSlug, path] of Object.entries(cases)) {
    it(`${oldSlug} -> ${path}`, () => expect(newSetPathForOldSlug(oldSlug)).toBe(path))
  }

  it('marks only old set addresses as removed', () => {
    expect(isRemovedOldSetPath('/sets/gem-vol-4')).toBe(true)
    expect(isRemovedOldSetPath('/sets/csv9-5/')).toBe(true)
    expect(isRemovedOldSetPath('/sets/chinese')).toBe(false)
    expect(isRemovedOldSetPath('/sets/japanese')).toBe(false)
    expect(isRemovedOldSetPath('/sets/chinese/gem-vol-4')).toBe(false)
    expect(isRemovedOldSetPath('/sets')).toBe(false)
    expect(isRemovedOldSetPath('/sets/hello-world')).toBe(false)
    expect(isRemovedOldSetPath('/shop')).toBe(false)
  })

  it('leaves unknown addresses as not found', () => {
    expect(newSetPathForOldSlug('hello-world')).toBeNull()
    expect(newSetPathForOldSlug('wp-login.php')).toBeNull()
    expect(newSetPathForOldSlug('chinese')).toBeNull()
  })
})
