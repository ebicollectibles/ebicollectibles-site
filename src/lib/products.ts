export type ProductType = 'Booster box' | 'Special box' | 'Figures'

export interface Product {
  id: string
  name: string
  code: string
  type: ProductType
  price: number
  compareAtPrice?: number
  stock: number
  img?: string
  images?: string[]
  preorder?: boolean
  placeholder?: string
}

// Product catalog now lives in Postgres (see src/lib/db/schema.ts and
// scripts/seed.ts for the initial data) — fetched via src/server/products.ts.

export const PRODUCT_TYPES: ProductType[] = ['Booster box', 'Special box', 'Figures']

export const FLAT_SHIPPING_RATE = 10

export interface FaqEntry {
  question: string
  answer: string
}

export const FAQS: FaqEntry[] = [
  {
    question: 'How do I know these Chinese boxes are real?',
    answer:
      'Every unit comes through authorised mainland distribution with an invoice on file. Before listing, we weigh each box to the gram against factory spec, inspect the shrink seams under raking light, and photograph the case code. Those photos go out with your tracking email — if any product ever fails authentication, we refund it in full, shipping included.',
  },
  {
    question: 'When do pre-orders ship?',
    answer:
      'Pre-order lines are reserved against our allocation and dispatch within 48 hours of the mainland street date. If you mix pre-order and in-stock items, the whole order waits for the pre-order unless you ask us to split it — reply to your confirmation email and we will.',
  },
  {
    question: 'What does a Simplified Chinese set actually contain?',
    answer:
      'S-Chinese releases follow the Japanese set structure but with their own numbering (CBB / CSV codes) and, frequently, exclusive promos and AR treatments that never appear in English print runs. Card text is Simplified Chinese; card stock and foiling are produced to the same spec.',
  },
  {
    question: 'Do you ship outside the United States?',
    answer:
      'Yes — Canada, the UK, the EU and most of Asia-Pacific. International orders ship with full tracking and a declared value matching what you paid. Duties and import taxes are the buyer’s responsibility.',
  },
  {
    question: 'How is my order packed?',
    answer:
      'Single boxes go into a rigid mailer with corner protection. Anything over one box is double-boxed with void fill. Sealed cases ship in their original factory carton inside an overbox. Nothing leaves in a poly bag.',
  },
  {
    question: 'What if something arrives damaged?',
    answer:
      'Photograph the parcel before you fully unpack it and email us within 72 hours. Crushed corners on a sealed box are treated as damage, not cosmetic — we replace from stock or refund, your choice.',
  },
]

export const TAX_RATE = 0.0825

export function formatMoney(n: number): string {
  return '$' + n.toFixed(2)
}
