import { describe, expect, it } from 'vitest'
import { makeUnsubscribeToken, readUnsubscribeToken } from './unsubscribe-token'

const SECRET = 'test-secret'

describe('unsubscribe tokens', () => {
  it('round-trips an email', async () => {
    const t = await makeUnsubscribeToken('Someone@Example.com', SECRET)
    expect(await readUnsubscribeToken(t, SECRET)).toBe('someone@example.com')
  })

  it('rejects a token made with another secret', async () => {
    const t = await makeUnsubscribeToken('a@b.com', 'other')
    expect(await readUnsubscribeToken(t, SECRET)).toBeNull()
  })

  it('rejects an edited email', async () => {
    const t = await makeUnsubscribeToken('a@b.com', SECRET)
    const [, sig] = t.split('.')
    const forged = `${btoa('victim@b.com').replace(/=+$/, '')}.${sig}`
    expect(await readUnsubscribeToken(forged, SECRET)).toBeNull()
  })

  it('rejects junk', async () => {
    for (const bad of [null, '', 'abc', 'a.b.c', '!!.??', 'x'.repeat(700)]) {
      expect(await readUnsubscribeToken(bad, SECRET)).toBeNull()
    }
  })
})
