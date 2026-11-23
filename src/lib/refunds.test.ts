import { describe, expect, it } from 'vitest'
import { commissionAfterRefunds, computeRefundable, customerRefundList, customerRefundReason, isCancellationRefund, parseRefundAmount, validatePartialRefund } from './refunds'

describe('computeRefundable', () => {
  it('is the full card charge when nothing has been refunded', () => {
    expect(computeRefundable({ total: 37.5, creditApplied: 0 }, [])).toEqual({ chargedCents: 3750, refundedCents: 0, remainingCents: 3750 })
  })

  it('only counts the card charge, not store credit applied at checkout', () => {
    const r = computeRefundable({ total: 50, creditApplied: 12.25 }, [])
    expect(r.chargedCents).toBe(3775)
    expect(r.remainingCents).toBe(3775)
  })

  it('subtracts completed and pending refunds, ignores failed and rejected ones', () => {
    const r = computeRefundable({ total: 100, creditApplied: 0 }, [
      { amount: 10, status: 'COMPLETED' },
      { amount: 5.5, status: 'PENDING' },
      { amount: 20, status: 'FAILED' },
      { amount: 30, status: 'REJECTED' },
    ])
    expect(r.refundedCents).toBe(1550)
    expect(r.remainingCents).toBe(8450)
  })

  it('counts a refund row with no status yet, to be safe', () => {
    expect(computeRefundable({ total: 20, creditApplied: 0 }, [{ amount: 5, status: null }]).remainingCents).toBe(1500)
  })

  it('is exact to the cent where float subtraction would drift', () => {
    const r = computeRefundable({ total: 37.5, creditApplied: 0 }, [
      { amount: 12.3, status: 'COMPLETED' },
      { amount: 25.2, status: 'COMPLETED' },
    ])
    expect(r.remainingCents).toBe(0)
    expect(computeRefundable({ total: 0.3, creditApplied: 0.1 }, []).remainingCents).toBe(20)
  })

  it('never goes negative, and is 0 for an order fully covered by store credit', () => {
    expect(computeRefundable({ total: 10, creditApplied: 0 }, [{ amount: 12, status: 'COMPLETED' }]).remainingCents).toBe(0)
    expect(computeRefundable({ total: 25, creditApplied: 25 }, []).remainingCents).toBe(0)
  })

  it('leaves only the withheld fee refundable after a fee-charged cancellation', () => {
    // $40 charged, cancelled with a 5% fee: $38 went back.
    expect(computeRefundable({ total: 40, creditApplied: 0 }, [{ amount: 38, status: 'COMPLETED' }]).remainingCents).toBe(200)
  })
})

describe('parseRefundAmount', () => {
  it('accepts whole dollars, one or two decimals, a leading $ and commas', () => {
    expect(parseRefundAmount('12')).toEqual({ cents: 1200 })
    expect(parseRefundAmount('12.5')).toEqual({ cents: 1250 })
    expect(parseRefundAmount(' 12.05 ')).toEqual({ cents: 1205 })
    expect(parseRefundAmount('$1,200.99')).toEqual({ cents: 120099 })
    expect(parseRefundAmount('0.01')).toEqual({ cents: 1 })
  })

  it('does not round: 19.99 is 1999 cents, not 1998', () => {
    expect(parseRefundAmount('19.99')).toEqual({ cents: 1999 })
    expect(parseRefundAmount('4.35')).toEqual({ cents: 435 })
  })

  it('rejects zero, negatives, three decimals and junk', () => {
    for (const bad of ['0', '0.00', '-5', '12.345', 'abc', '', '.5', '1e3', '12.', 'NaN', 'Infinity']) {
      expect(parseRefundAmount(bad)).toHaveProperty('error')
    }
  })
})

describe('validatePartialRefund', () => {
  it('passes an amount at or under what remains, with a reason', () => {
    expect(validatePartialRefund({ amount: '10.00', reason: '  Damaged card  ', remainingCents: 1000 })).toEqual({ cents: 1000, reason: 'Damaged card' })
  })

  it('rejects more than what remains, by even one cent', () => {
    expect(validatePartialRefund({ amount: '10.01', reason: 'x', remainingCents: 1000 })).toHaveProperty('error')
  })

  it('rejects when nothing is refundable', () => {
    expect(validatePartialRefund({ amount: '1', reason: 'x', remainingCents: 0 })).toHaveProperty('error')
  })

  it('requires a reason, and keeps it within Square\'s 192 characters', () => {
    expect(validatePartialRefund({ amount: '1', reason: '   ', remainingCents: 1000 })).toHaveProperty('error')
    expect(validatePartialRefund({ amount: '1', reason: 'a'.repeat(193), remainingCents: 1000 })).toHaveProperty('error')
    expect(validatePartialRefund({ amount: '1', reason: 'a'.repeat(192), remainingCents: 1000 })).not.toHaveProperty('error')
  })
})

describe('customerRefundReason', () => {
  it('turns the cancel tool\'s internal reason into plain words', () => {
    expect(customerRefundReason('Order #EBI-1042 cancelled by admin')).toBe('Order cancelled')
    expect(customerRefundReason('Order #EBI-7 cancelled by admin, 5% cancellation fee withheld')).toBe('Order cancelled (5% cancellation fee withheld)')
  })

  it('recognises the cancel tool\'s refunds only', () => {
    expect(isCancellationRefund('Order #EBI-7 cancelled by admin')).toBe(true)
    expect(isCancellationRefund('Damaged in transit')).toBe(false)
    expect(isCancellationRefund(null)).toBe(false)
  })

  it('keeps other reasons as typed and drops empty ones', () => {
    expect(customerRefundReason('One card arrived creased')).toBe('One card arrived creased')
    expect(customerRefundReason('  ')).toBeNull()
    expect(customerRefundReason(null)).toBeNull()
  })
})

describe('customerRefundList', () => {
  it('lists completed refunds only, oldest first, with date, amount and reason', () => {
    const list = customerRefundList([
      { amount: 5, status: 'COMPLETED', reason: null, createdAt: new Date('2026-11-20T10:00:00Z') },
      { amount: 3, status: 'PENDING', reason: 'x', createdAt: new Date('2026-11-21T10:00:00Z') },
      { amount: 2, status: 'COMPLETED', reason: 'Late', createdAt: '2026-11-19T10:00:00Z' },
    ])
    expect(list).toEqual([
      { createdAt: '2026-11-19T10:00:00.000Z', amount: 2, reason: 'Late' },
      { createdAt: '2026-11-20T10:00:00.000Z', amount: 5, reason: null },
    ])
  })
})

describe('commissionAfterRefunds', () => {
  it('is unchanged with no refund', () => {
    expect(commissionAfterRefunds(2, 100, 0)).toBe(2)
  })
  it('drops in proportion to the subtotal refunded', () => {
    expect(commissionAfterRefunds(2, 100, 10)).toBe(1.8)
    expect(commissionAfterRefunds(5, 120, 30)).toBe(3.75)
  })
  it('goes to zero when the whole subtotal is refunded, shipping and tax included or not', () => {
    expect(commissionAfterRefunds(2, 100, 100)).toBe(0)
    expect(commissionAfterRefunds(2, 100, 118.49)).toBe(0)
  })
  it('stays zero when there was no commission', () => {
    expect(commissionAfterRefunds(0, 100, 10)).toBe(0)
  })
})
