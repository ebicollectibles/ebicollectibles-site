ALTER TABLE "auth_events" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "auth_events" ADD COLUMN "asn" integer;--> statement-breakpoint
ALTER TABLE "auth_events" ADD COLUMN "as_organization" text;--> statement-breakpoint
ALTER TABLE "auth_events" ADD COLUMN "country" text;