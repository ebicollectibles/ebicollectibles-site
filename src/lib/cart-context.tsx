import * as React from 'react'
import { trackEvent } from './analytics'
import { placeOrder as placeOrderFn } from '~/server/orders'
import { FLAT_SHIPPING_RATE, formatMoney, type Product } from './products'
import { computeFreeGifts, FREE_GIFT_PROMOS } from './promotions'

export interface CartLine {
  id: string
  product: Product
  qty: number
  lineTotal: number
}

export interface CheckoutContact {
  email: string
  phone: string
  firstName: string
  lastName: string
  street: string
  apartment: string
  city: string
  state: string
  zip: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  street: string
  apartment: string
  city: string
  state: string
  zip: string
}

interface CartState {
  cart: Record<string, number>
}

/** A free gift the cart has earned (lib/promotions.ts). Display only: the server decides. */
export interface CartGift {
  product: Product
  qty: number
  /** How many the cart earned before stock ran short. */
  earned: number
  label: string
}

interface CartContextValue {
  products: Product[]
  lines: CartLine[]
  /** Free gifts this cart gets, capped by live stock. */
  gifts: CartGift[]
  /** Set when the cart earned more gifts than are left (or none are left). */
  giftNotice: string | null
  cartCount: number
  cartEmpty: boolean
  subtotal: number
  shippingCost: number
  shippingLabel: string
  addToCart: (product: Product) => void
  bump: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  placeOrder: (opts: {
    contact: CheckoutContact
    billing: BillingAddress
    sourceId: string | null
    emailOptIn: boolean
    creditApplied?: number
    preorderAcknowledged?: boolean
    combineWithOrderId?: string
  }) => Promise<{ orderNo: number; total: number; creditApplied: number; amountDue: number; paymentStatus: string; giftNote?: string }>
}

const CartContext = React.createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'ebi-cart'

export function CartProvider({ children, products }: { children: React.ReactNode; products: Product[] }) {
  const [state, setState] = React.useState<CartState>({ cart: {} })
  const hydrated = React.useRef(false)

  const productById = React.useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of products) map.set(p.id, p)
    return map
  }, [products])

  // Restore the cart saved before the last full page load — a plain
  // useState only lives in memory, so without this a refresh silently
  // empties the cart. Runs once client-side after mount (server-rendered
  // state stays the empty default, so there's no hydration mismatch), and
  // clamps against current stock in case it changed since the last visit.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>
        const clamped: Record<string, number> = {}
        for (const [id, qty] of Object.entries(parsed)) {
          const product = productById.get(id)
          if (!product) continue
          const n = Math.min(Math.max(0, Math.floor(qty)), product.stock)
          if (n > 0) clamped[id] = n
        }
        setState((s) => ({ ...s, cart: clamped }))
      }
    } catch {
      // Ignore malformed/inaccessible storage — just start with an empty cart.
    }
    hydrated.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    } catch {
      // Storage can be unavailable (private mode, quota) — cart still works in-memory.
    }
  }, [state.cart])

  const addToCart = React.useCallback((product: Product) => {
    // <= 0, not === 0 — a Square-linked item can report negative stock
    // (oversold on another channel sharing the same Square inventory).
    // Without this, Math.min(1, product.stock) below would set a NEGATIVE
    // quantity into the cart instead of just refusing to add it.
    if (product.stock <= 0) return
    setState((s) => {
      const next = { ...s.cart }
      next[product.id] = Math.min((next[product.id] || 0) + 1, product.stock)
      return { ...s, cart: next }
    })
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }],
    })
  }, [])

  const bump = React.useCallback(
    (id: string, delta: number) => {
      setState((s) => {
        const next = { ...s.cart }
        const product = productById.get(id)
        if (!product) return s
        const qty = (next[id] || 0) + delta
        // product.stock <= 0 here too — e.g. the item was in the cart at a
        // positive stock, then went negative (oversold elsewhere) before
        // the user tapped "+". Math.min(qty, product.stock) alone would set
        // a NEGATIVE line quantity instead of dropping it.
        if (qty <= 0 || product.stock <= 0) delete next[id]
        else next[id] = Math.min(qty, product.stock)
        return { ...s, cart: next }
      })
    },
    [productById],
  )

  const removeFromCart = React.useCallback((id: string) => {
    setState((s) => {
      const next = { ...s.cart }
      delete next[id]
      return { ...s, cart: next }
    })
  }, [])

  const placeOrder = React.useCallback(
    async (opts: {
      contact: CheckoutContact
      billing: BillingAddress
      sourceId: string | null
      emailOptIn: boolean
      creditApplied?: number
      preorderAcknowledged?: boolean
      combineWithOrderId?: string
    }) => {
      const lines = Object.entries(state.cart).map(([productId, qty]) => ({ productId, qty }))
      const result = await placeOrderFn({
        data: {
          lines,
          contact: opts.contact,
          billing: opts.billing,
          sourceId: opts.sourceId,
          emailOptIn: opts.emailOptIn,
          creditApplied: opts.creditApplied ?? 0,
          preorderAcknowledged: opts.preorderAcknowledged ?? false,
          combineWithOrderId: opts.combineWithOrderId,
        },
      })
      setState((s) => ({ ...s, cart: {} }))
      return result
    },
    [state.cart],
  )

  const value = React.useMemo<CartContextValue>(() => {
    const lines: CartLine[] = Object.entries(state.cart)
      .map(([id, qty]) => {
        const product = productById.get(id)
        // A product that can't be bought on its own (a hub, or a free-gift
        // item like the Gem Vol 7 binder) drops out of an old cart.
        if (!product || product.notSellable) return null
        return { id, product, qty, lineTotal: product.price * qty }
      })
      .filter((l): l is CartLine => l !== null)
    const cartCount = lines.reduce((t, l) => t + l.qty, 0)
    const subtotal = lines.reduce((t, l) => t + l.lineTotal, 0)
    const shippingCost = subtotal === 0 ? 0 : FLAT_SHIPPING_RATE

    const plain = lines.map((l) => ({ productId: l.id, qty: l.qty }))
    const giftStock: Record<string, number> = {}
    for (const p of FREE_GIFT_PROMOS) {
      const g = productById.get(p.giftProductId)
      giftStock[p.giftProductId] = g ? Math.max(0, g.stock) : 0
    }
    const earnedGifts = computeFreeGifts(plain)
    const givenGifts = computeFreeGifts(plain, giftStock)
    const gifts: CartGift[] = earnedGifts.flatMap((e) => {
      const product = productById.get(e.productId)
      const qty = givenGifts.find((g) => g.productId === e.productId)?.qty ?? 0
      return product && qty > 0 ? [{ product, qty, earned: e.qty, label: e.label }] : []
    })
    let giftNotice: string | null = null
    const short = earnedGifts.find((e) => (givenGifts.find((g) => g.productId === e.productId)?.qty ?? 0) < e.qty)
    if (short) {
      const name = (productById.get(short.productId)?.name ?? 'free gift').replace(/^Pokemon\s+/, '').replace(/\s*\(Simplified Chinese\)/, '')
      const left = givenGifts.find((g) => g.productId === short.productId)?.qty ?? 0
      giftNotice =
        left > 0
          ? `Only ${left} free ${name}${left === 1 ? ' is' : 's are'} left, so your order gets ${left}. Thanks for shopping the deal!`
          : `The free ${name}s have all been claimed. Thank you to everyone who grabbed one! Your boxes are still in your cart at the regular price.`
    }

    return {
      products,
      lines,
      gifts,
      giftNotice,
      cartCount,
      cartEmpty: lines.length === 0,
      subtotal,
      shippingCost,
      shippingLabel: subtotal === 0 ? '—' : formatMoney(shippingCost),
      addToCart,
      bump,
      removeFromCart,
      placeOrder,
    }
  }, [state, products, productById, addToCart, bump, removeFromCart, placeOrder])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
