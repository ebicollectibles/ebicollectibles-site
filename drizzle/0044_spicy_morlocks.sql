ALTER TABLE "products" ADD COLUMN "variant_group_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variant_label" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variant_sort_order" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "hide_from_shop_grid" boolean DEFAULT false NOT NULL;