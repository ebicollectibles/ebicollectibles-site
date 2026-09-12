ALTER TABLE "order_items" ALTER COLUMN "product_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "code" DROP NOT NULL;