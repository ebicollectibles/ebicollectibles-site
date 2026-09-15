import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveSalesTaxRate, WA_FALLBACK_TAX_RATE } from './tax'

const contact = { street: '123 Main St', city: 'Seattle', zip: '98101' }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resolveSalesTaxRate', () => {
  it('charges no tax outside Washington, without calling the DOR lookup', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const rate = await resolveSalesTaxRate({ state: 'CA', ...contact })
    expect(rate).toBe(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('is case-insensitive and trims the state field', async () => {
    vi.stubGlobal('fetch', vi.fn())
    expect(await resolveSalesTaxRate({ state: ' wa ', ...contact })).not.toBe(0)
  })

  it('uses the live DOR rate when the lookup succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: async () => 'ResultCode=0 Rate=0.103 LocalRate=0.03' }),
    )
    const rate = await resolveSalesTaxRate({ state: 'WA', ...contact })
    expect(rate).toBe(0.103)
  })

  it('falls back to the blended rate when the DOR lookup returns a non-zero result code', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => 'ResultCode=1' }))
    expect(await resolveSalesTaxRate({ state: 'WA', ...contact })).toBe(WA_FALLBACK_TAX_RATE)
  })

  it('falls back to the blended rate when the DOR endpoint is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    expect(await resolveSalesTaxRate({ state: 'WA', ...contact })).toBe(WA_FALLBACK_TAX_RATE)
  })

  it('falls back to the blended rate on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: async () => '' }))
    expect(await resolveSalesTaxRate({ state: 'WA', ...contact })).toBe(WA_FALLBACK_TAX_RATE)
  })
})
