import * as React from 'react'
import { hasPendingOrder } from '~/server/customers'

export interface CombineCandidate {
  id: string
  orderNo: number
}

// Shared between checkout.tsx (full form) and the cart page's Express Apple
// Pay button — both need the exact same "does this account have a pending
// order that waives/offers to combine shipping" lookup and the same
// shopper-choice state for the mismatched (pre-order-vs-regular) case, and
// they'd otherwise have drifted into two separately-maintained copies.
//
// `accountKey` is an optional extra dependency so a caller that tracks
// sign-in state mid-flow (checkout.tsx, where a guest can log in partway
// through) can force a re-check on login; the cart page has no such
// mid-flow sign-in and can omit it — hasPendingOrder itself already
// no-ops safely for a signed-out session either way.
export function useCombineShippingChoice(cartHasPreorder: boolean, accountKey?: string | null) {
  const [pendingOrderWaivesShipping, setPendingOrderWaivesShipping] = React.useState(false)
  const [mismatchedPendingOrder, setMismatchedPendingOrder] = React.useState(false)
  const [combineCandidate, setCombineCandidate] = React.useState<CombineCandidate | null>(null)
  // null = hasn't picked yet — see shipChoiceMissing's callers for what
  // happens if an order is attempted before this is set.
  const [shipTogetherChoice, setShipTogetherChoice] = React.useState<boolean | null>(null)
  const [shipChoiceMissing, setShipChoiceMissing] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    hasPendingOrder({ data: { hasPreorder: cartHasPreorder } })
      .then((result) => {
        if (cancelled) return
        setPendingOrderWaivesShipping(result.waived)
        setMismatchedPendingOrder(result.mismatchedPending)
        setCombineCandidate(result.combineCandidate)
        setShipTogetherChoice(null)
        setShipChoiceMissing(false)
      })
      .catch(() => {
        if (cancelled) return
        setPendingOrderWaivesShipping(false)
        setMismatchedPendingOrder(false)
        setCombineCandidate(null)
        setShipTogetherChoice(null)
      })
    return () => {
      cancelled = true
    }
  }, [cartHasPreorder, accountKey])

  return {
    pendingOrderWaivesShipping,
    mismatchedPendingOrder,
    combineCandidate,
    shipTogetherChoice,
    setShipTogetherChoice,
    shipChoiceMissing,
    setShipChoiceMissing,
  }
}
