ALTER TABLE "products" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory" text;--> statement-breakpoint
UPDATE "products" SET
  "category" = CASE
    WHEN "type" = 'Acrylic' THEN 'Acrylic Cases'
    ELSE 'Chinese Pokémon Products'
  END,
  "subcategory" = CASE
    WHEN "type" = 'Figures' THEN 'Blind Box'
    WHEN "type" = 'Acrylic' THEN 'Booster Box Case'
    ELSE 'Gem Series'
  END;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "subcategory" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "type";
