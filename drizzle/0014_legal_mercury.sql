ALTER TABLE "order_items" ADD COLUMN "img" text;
--> statement-breakpoint
-- Backfill existing order lines from their product's current photo — not a
-- perfect historical snapshot (the product's photo may have changed since),
-- but far better than every past order showing a blank square. New orders
-- get a true snapshot at purchase time going forward.
UPDATE "order_items" oi
SET "img" = p."img"
FROM "products" p
WHERE p."id" = oi."product_id" AND oi."img" IS NULL AND p."img" IS NOT NULL;