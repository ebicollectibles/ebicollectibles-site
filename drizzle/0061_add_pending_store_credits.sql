CREATE TABLE "pending_store_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text,
	"note" text,
	"order_id" uuid,
	"claimed_at" timestamp with time zone,
	"claimed_user_id" uuid,
	"canceled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pending_store_credits" ADD CONSTRAINT "pending_store_credits_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_store_credits" ADD CONSTRAINT "pending_store_credits_claimed_user_id_users_id_fk" FOREIGN KEY ("claimed_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pending_store_credits_email_idx" ON "pending_store_credits" USING btree ("email");