import * as React from 'react'
import { placeOrder as placeOrderFn } from '~/server/orders'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS, TAX_RATE, formatMoney, type Product, type ShippingOption } from './products'

export interface CartLine {
  id: string
  product: Product
  qty: number
  lineTotal: number
}

export interface CheckoutContact {
  email: string
  firstName: string
  lastName: string
  street: string
  apartment: string
  city: string
  zip: string
}

interface CartState {
  cart: Record<string, number>
  cartOpen: boolean
  ship: ShippingOption['id']
}

interface CartContextValue {
  products: Product[]
  lines: CartLine[]
  cartCount: number
  cartEmpty: boolean
  cartOpen: boolean
  subtotal: number
  shippingCost: number
  shippingLabel: string
  tax: number
  total: number
  freeShipNote: string
  ship: ShippingOption['id']
  shipOptions: Array<ShippingOption & { priceLabel: string; on: boolean }>
  addToCart: (product: Product) => void
  bump: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  openCart: () => void
  closeCart: () => void
  setShip: (id: ShippingOption['id']) => void
  placeOrder: (opts: {
    contact: CheckoutContact
    sourceId: string | null
  }) => Promise<{ orderNo: number; total: number; paymentStatus: string }>
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children, products }: { children: React.ReactNode; products: Product[] }) {
  const [state, setState] = React.useState<CartState>({
    cart: {},
    cartOpen: false,
    ship: 'std',
  })

  const productById = React.useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of products) map.set(p.id, p)
    return map
  }, [products])

  const addToCart = React.useCallback((product: Product) => {
    if (product.stock === 0) return
    setState((s) => {
      const next = { ...s.cart }
      next[product.id] = Math.min((next[product.id] || 0) + 1, product.stock)
      return { ...s, cart: next, cartOpen: true }
    })
  }, [])

  const bump = React.useCallback(
    (id: string, delta: number) => {
      setState((s) => {
        const next = { ...s.cart }
        const product = productById.get(id)
        if (!product) return s
        const qty = (next[id] || 0) + delta
        if (qty <= 0) delete next[id]
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

  const openCart = React.useCallback(() => setState((s) => ({ ...s, cartOpen: true })), [])
  const closeCart = React.useCallback(() => setState((s) => ({ ...s, cartOpen: false })), [])
  const setShip = React.useCallback((id: ShippingOption['id']) => setState((s) => ({ ...s, ship: id })), [])

  const placeOrder = React.useCallback(
    async (opts: { contact: CheckoutContact; sourceId: string | null }) => {
      const lines = Object.entries(state.cart).map(([productId, qty]) => ({ productId, qty }))
      const result = await placeOrderFn({
        data: {
          lines,
          shipMethod: state.ship,
          contact: opts.contact,
          sourceId: opts.sourceId,
        },
      })
      setState((s) => ({ ...s, cart: {} }))
      return result
    },
    [state.cart, state.ship],
  )

  const value = React.useMemo<CartContextValue>(() => {
    const lines: CartLine[] = Object.entries(state.cart)
      .map(([id, qty]) => {
        const product = productById.get(id)
        if (!product) return null
        return { id, product, qty, lineTotal: product.price * qty }
      })
      .filter((l): l is CartLine => l !== null)
    const cartCount = lines.reduce((t, l) => t + l.qty, 0)
    const subtotal = lines.reduce((t, l) => t + l.lineTotal, 0)
    const activeShip = SHIPPING_OPTIONS.find((o) => o.id === state.ship)!
    const freeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD && state.ship === 'std'
    const shippingCost = subtotal === 0 ? 0 : freeShippingUnlocked ? 0 : activeShip.price
    const tax = subtotal * TAX_RATE
    const total = subtotal + shippingCost + tax

    return {
      products,
      lines,
      cartCount,
      cartEmpty: lines.length === 0,
      cartOpen: state.cartOpen,
      subtotal,
      shippingCost,
      shippingLabel: subtotal === 0 ? '—' : shippingCost === 0 ? 'Free' : formatMoney(shippingCost),
      tax,
      total,
      freeShipNote:
        subtotal >= FREE_SHIPPING_THRESHOLD
          ? 'Free US standard shipping unlocked.'
          : subtotal > 0
            ? `${formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)} away from free US shipping.`
            : `Free US standard shipping over ${formatMoney(FREE_SHIPPING_THRESHOLD)}.`,
      ship: state.ship,
      shipOptions: SHIPPING_OPTIONS.map((o) => ({
        ...o,
        priceLabel: o.id === 'std' && subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatMoney(o.price),
        on: state.ship === o.id,
      })),
      addToCart,
      bump,
      removeFromCart,
      openCart,
      closeCart,
      setShip,
      placeOrder,
    }
  }, [state, products, productById, addToCart, bump, removeFromCart, openCart, closeCart, setShip, placeOrder])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
