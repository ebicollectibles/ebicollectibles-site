CREATE TABLE "notify_me_blasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text,
	"product_name" text NOT NULL,
	"sent_count" integer NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notify_me_events" ADD COLUMN "blast_id" uuid;--> statement-breakpoint
ALTER TABLE "notify_me_blasts" ADD CONSTRAINT "notify_me_blasts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notify_me_blasts_product_id_idx" ON "notify_me_blasts" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "notify_me_events" ADD CONSTRAINT "notify_me_events_blast_id_notify_me_blasts_id_fk" FOREIGN KEY ("blast_id") REFERENCES "public"."notify_me_blasts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notify_me_events_blast_id_idx" ON "notify_me_events" USING btree ("blast_id");