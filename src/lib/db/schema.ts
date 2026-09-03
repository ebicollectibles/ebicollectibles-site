import { boolean, integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  type: text('type').notNull(),
  price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2, mode: 'number' }),
  stock: integer('stock').notNull().default(0),
  img: text('img'),
  preorder: boolean('preorder').notNull().default(false),
  placeholder: text('placeholder'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNo: integer('order_no').notNull().unique(),
  email: text('email'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  street: text('street'),
  apartment: text('apartment'),
  city: text('city'),
  zip: text('zip'),
  shipMethod: text('ship_method').notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  shippingCost: numeric('shipping_cost', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  tax: numeric('tax', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  total: numeric('total', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  paymentStatus: text('payment_status').notNull().default('unpaid'), // unpaid | paid | test | failed
  squarePaymentId: text('square_payment_id'),
  fulfillmentStatus: text('fulfillment_status').notNull().default('pending'), // pending | shipped | cancelled
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  productCode: text('product_code').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  qty: integer('qty').notNull(),
})

export const orderCounters = pgTable('order_counters', {
  id: text('id').primaryKey(),
  nextOrderNo: integer('next_order_no').notNull(),
})
