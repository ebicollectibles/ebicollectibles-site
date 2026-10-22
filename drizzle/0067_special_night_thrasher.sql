CREATE TABLE "dropnotify_alert_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text,
	"product_name" text NOT NULL,
	"trigger" text NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dropnotify_alert_events" ADD CONSTRAINT "dropnotify_alert_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dropnotify_alert_events_product_id_idx" ON "dropnotify_alert_events" USING btree ("product_id");