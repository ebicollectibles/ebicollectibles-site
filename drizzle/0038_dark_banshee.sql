CREATE TABLE "marketplace_shipment_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"marketplace_order_item_id" uuid NOT NULL,
	"qty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_order_id" uuid NOT NULL,
	"carrier" text,
	"tracking_number" text,
	"email_status" text,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "marketplace_shipment_items" ADD CONSTRAINT "marketplace_shipment_items_shipment_id_marketplace_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."marketplace_shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_shipment_items" ADD CONSTRAINT "marketplace_shipment_items_marketplace_order_item_id_marketplace_order_items_id_fk" FOREIGN KEY ("marketplace_order_item_id") REFERENCES "public"."marketplace_order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_shipments" ADD CONSTRAINT "marketplace_shipments_marketplace_order_id_marketplace_orders_id_fk" FOREIGN KEY ("marketplace_order_id") REFERENCES "public"."marketplace_orders"("id") ON DELETE cascade ON UPDATE no action;