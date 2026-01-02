CREATE TABLE "feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"user_id" uuid,
	CONSTRAINT "feeds_name_unique" UNIQUE("name"),
	CONSTRAINT "feeds_url_unique" UNIQUE("url")
);
