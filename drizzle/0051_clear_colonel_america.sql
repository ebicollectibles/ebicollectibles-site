CREATE TABLE "affiliate_products" (
	"affiliate_id" uuid NOT NULL,
	"product_id" text NOT NULL,
	CONSTRAINT "affiliate_products_affiliate_id_product_id_pk" PRIMARY KEY("affiliate_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "affiliate_products" ADD CONSTRAINT "affiliate_products_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_products" ADD CONSTRAINT "affiliate_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;