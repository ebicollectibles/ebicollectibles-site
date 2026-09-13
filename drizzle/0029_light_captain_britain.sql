CREATE TABLE "marketplace_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_order_id" uuid NOT NULL,
	"product_name" text NOT NULL,
	"img" text,
	"unit_price" numeric(10, 2),
	"qty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"square_order_id" text NOT NULL,
	"source_name" text NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"street" text,
	"apartment" text,
	"city" text,
	"state" text,
	"zip" text,
	"placed_at" timestamp with time zone NOT NULL,
	"carrier" text,
	"tracking_number" text,
	"shipped_at" timestamp with time zone,
	"email_status" text,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "marketplace_orders_square_order_id_unique" UNIQUE("square_order_id")
);
--> statement-breakpoint
ALTER TABLE "marketplace_order_items" ADD CONSTRAINT "marketplace_order_items_marketplace_order_id_marketplace_orders_id_fk" FOREIGN KEY ("marketplace_order_id") REFERENCES "public"."marketplace_orders"("id") ON DELETE cascade ON UPDATE no action;