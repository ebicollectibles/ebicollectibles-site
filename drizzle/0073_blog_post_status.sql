CREATE TABLE IF NOT EXISTS "blog_post_status" (
	"slug" text PRIMARY KEY NOT NULL,
	"live" boolean DEFAULT false NOT NULL,
	"live_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
