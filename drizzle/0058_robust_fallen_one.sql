CREATE TABLE "affiliate_contacts" (
	"email" text PRIMARY KEY NOT NULL,
	"affiliate_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "affiliate_contacts" ADD CONSTRAINT "affiliate_contacts_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_contacts_affiliate_id_idx" ON "affiliate_contacts" USING btree ("affiliate_id");