// Free-gift promotions: buy N of one product, get a gift product free.
// The server (placeOrder in server/orders.ts) works out the gift itself
// from the paid lines, so a stale or tampered cart can never claim one; the
// cart and checkout only show the same result so the shopper sees it.
// While supplies last: the gift is capped by its own stock, minus any of
// it the shopper is also buying at full price.

export interface FreeGiftPromo {
  id: string
  /** Product the shopper buys. */
  buyProductId: string
  /** How many of it earn one gift. */
  buyQty: number
  /** Product given free. */
  giftProductId: string
  /** Short line for the cart and checkout. */
  label: string
  /** Turn a promo off without deleting it. */
  active: boolean
}

export const FREE_GIFT_PROMOS: FreeGiftPromo[] = [
  {
    id: 'gem7-psyduck-binder',
    buyProductId: 'pokemon-chinese-gem-volume-7-booster-box',
    buyQty: 5,
    giftProductId: 'pokemon-chinese-gem-volume-7-psyduck-collector-binder',
    label: 'One free with every 5 Gem Vol 7 booster boxes, while supplies last',
    active: true,
  },
  // Temporary, for one real test order (owner's call, Nov 2026): the hidden
  // 1-cent test item gives a second copy of itself free, so a cheap order
  // runs the same free-gift code as the Gem Vol 7 binder. Remove after the test.
  {
    id: 'checkout-test',
    buyProductId: 'ebi-checkout-test',
    buyQty: 1,
    giftProductId: 'ebi-checkout-test',
    label: 'Test gift: one free with every test item',
    active: true,
  },
]

export interface FreeGiftLine {
  promoId: string
  productId: string
  qty: number
  label: string
}

/**
 * Gifts earned by these cart lines. giftStock is the live stock of each gift
 * product; leave a product out to treat it as unlimited (display only, the
 * server always passes real stock).
 */
export function computeFreeGifts(
  lines: Array<{ productId: string; qty: number }>,
  giftStock: Record<string, number> = {},
  promos: FreeGiftPromo[] = FREE_GIFT_PROMOS,
): FreeGiftLine[] {
  const qtyOf = (id: string) => lines.filter((l) => l.productId === id).reduce((t, l) => t + l.qty, 0)
  const out: FreeGiftLine[] = []
  for (const p of promos) {
    if (!p.active) continue
    const earned = Math.floor(qtyOf(p.buyProductId) / p.buyQty)
    if (earned <= 0) continue
    const stock = p.giftProductId in giftStock ? giftStock[p.giftProductId] : Infinity
    const left = Math.max(0, stock - qtyOf(p.giftProductId))
    const qty = Math.min(earned, left)
    if (qty > 0) out.push({ promoId: p.id, productId: p.giftProductId, qty, label: p.label })
  }
  return out
}

/** Product ids of every active gift, for fetching their rows and stock. */
export function activeGiftProductIds(): string[] {
  return FREE_GIFT_PROMOS.filter((p) => p.active).map((p) => p.giftProductId)
}

/** The promo a product is the free gift of, if any (for a note on its page). */
export function promoForGiftProduct(productId: string): FreeGiftPromo | undefined {
  return FREE_GIFT_PROMOS.find((p) => p.active && p.giftProductId === productId)
}

/** The promo a product is the "buy" side of, if any (for a note on its page). */
export function promoForBuyProduct(productId: string): FreeGiftPromo | undefined {
  return FREE_GIFT_PROMOS.find((p) => p.active && p.buyProductId === productId)
}
