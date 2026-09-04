import { boolean, integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  type: text('type').notNull(),
  price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2, mode: 'number' }),
  stock: integer('stock').notNull().default(0),
  squareVariationId: text('square_variation_id'),
  img: text('img'),
  imgAlt: text('img_alt'),
  images: text('images').array().notNull().default([]),
  preorder: boolean('preorder').notNull().default(false),
  placeholder: text('placeholder'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
  name: text('name'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Lightweight security/support log — separate from Google Analytics, which
// tracks anonymous browsing behavior. This tracks account-security-relevant
// actions on known accounts: signups, logins (successful and failed),
// Google-account linking. `email` is stored alongside `userId` so a failed
// login against an email with no matching account still leaves a record.
export const authEvents = pgTable('auth_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  email: text('email'),
  type: text('type').notNull(), // signup | login | login_failed | google_link | password_reset
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNo: integer('order_no').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  // Whether the shopper had an active session at checkout — independent of
  // whether userId ends up set (a guest checkout under an email that
  // already has an account still gets linked, but checkoutMode still
  // records that it happened while logged out).
  checkoutMode: text('checkout_mode').notNull().default('guest'), // guest | account
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
