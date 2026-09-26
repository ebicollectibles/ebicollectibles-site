CREATE TABLE "notify_me_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" text NOT NULL,
	"notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notify_me_signups" ADD CONSTRAINT "notify_me_signups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notify_me_signups" ADD CONSTRAINT "notify_me_signups_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "notify_me_signups_user_product_unique" ON "notify_me_signups" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE INDEX "notify_me_signups_product_id_idx" ON "notify_me_signups" USING btree ("product_id");