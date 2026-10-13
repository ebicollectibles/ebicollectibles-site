ALTER TABLE "order_items" ADD COLUMN "affiliate_commission_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "affiliate_commission" numeric(10, 2);
--> statement-breakpoint
-- Backfill: every line on an order that already has a known blended rate
-- (orders.affiliate_commission_rate, itself backfilled in migration 0062)
-- gets that same rate — exact for the common case (a uniform rate across
-- the whole order), the same approximation as the order-level backfill
-- for a restricted affiliate with a mix of in/out-of-scope lines.
UPDATE "order_items" oi
SET "affiliate_commission_rate" = o."affiliate_commission_rate",
    "affiliate_commission" = ROUND((oi."unit_price" * oi."qty" * o."affiliate_commission_rate" / 100)::numeric, 2)
FROM "orders" o
WHERE oi."order_id" = o."id" AND o."affiliate_commission_rate" IS NOT NULL;