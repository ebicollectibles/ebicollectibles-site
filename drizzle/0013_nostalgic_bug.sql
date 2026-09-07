CREATE TABLE "shipment_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"qty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"carrier" text,
	"tracking_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Backfill: every already-shipped order becomes one shipment covering all
-- its items, carrying over whatever carrier/tracking info (if any) was
-- recorded under the old single-shipment-per-order model. Timestamped to
-- when it was actually marked shipped (falling back to order creation time
-- if that history is somehow missing), not to "now".
INSERT INTO "shipments" ("order_id", "carrier", "tracking_number", "created_at")
SELECT
  o."id",
  o."carrier",
  o."tracking_number",
  COALESCE(
    (SELECT ose."created_at" FROM "order_status_events" ose WHERE ose."order_id" = o."id" AND ose."status" = 'shipped' ORDER BY ose."created_at" DESC LIMIT 1),
    o."created_at"
  )
FROM "orders" o
WHERE o."fulfillment_status" = 'shipped';
--> statement-breakpoint
INSERT INTO "shipment_items" ("shipment_id", "order_item_id", "qty")
SELECT s."id", oi."id", oi."qty"
FROM "shipments" s
JOIN "order_items" oi ON oi."order_id" = s."order_id";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "carrier";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "tracking_number";