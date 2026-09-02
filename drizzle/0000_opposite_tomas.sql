CREATE TABLE "order_counters" (
	"id" text PRIMARY KEY NOT NULL,
	"next_order_no" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" text NOT NULL,
	"product_name" text NOT NULL,
	"product_code" text NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"qty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_no" integer NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"street" text,
	"apartment" text,
	"city" text,
	"zip" text,
	"ship_method" text NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"square_payment_id" text,
	"fulfillment_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"img" text,
	"preorder" boolean DEFAULT false NOT NULL,
	"placeholder" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;