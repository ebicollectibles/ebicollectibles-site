ALTER TABLE "orders" ADD COLUMN "affiliate_commission_rate" numeric(5, 2);
--> statement-breakpoint
-- Backfill existing affiliate orders: affiliateCommission was already
-- computed as subtotal * rate, so recovering the rate from the two
-- already-stored numbers is exact for the common case (an unrestricted
-- affiliate, or every line already in scope) — same definition every new
-- order gets going forward (see the column's comment in schema.ts), not
-- a separate approximation just for old rows.
UPDATE "orders" SET "affiliate_commission_rate" = ROUND((("affiliate_commission" / "subtotal") * 100)::numeric, 2)
WHERE "affiliate_commission" IS NOT NULL AND "subtotal" > 0;