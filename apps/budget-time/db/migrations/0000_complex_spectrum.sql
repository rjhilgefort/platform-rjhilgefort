CREATE TABLE "active_timers" (
	"id" serial PRIMARY KEY NOT NULL,
	"kid_id" integer NOT NULL,
	"budget_type_id" integer NOT NULL,
	"earning_type_id" integer,
	"started_at" timestamp with time zone NOT NULL,
	CONSTRAINT "active_timers_kid_id_unique" UNIQUE("kid_id")
);
--> statement-breakpoint
CREATE TABLE "budget_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"allow_carryover" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "budget_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "daily_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"kid_id" integer NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "daily_balances_kid_id_date_unique" UNIQUE("kid_id","date")
);
--> statement-breakpoint
CREATE TABLE "daily_type_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"daily_balance_id" integer NOT NULL,
	"budget_type_id" integer NOT NULL,
	"remaining_seconds" integer NOT NULL,
	"carryover_seconds" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_type_balances_daily_balance_id_budget_type_id_unique" UNIQUE("daily_balance_id","budget_type_id")
);
--> statement-breakpoint
CREATE TABLE "earning_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"ratio_numerator" integer DEFAULT 1 NOT NULL,
	"ratio_denominator" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "earning_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kid_budget_defaults" (
	"id" serial PRIMARY KEY NOT NULL,
	"kid_id" integer NOT NULL,
	"budget_type_id" integer NOT NULL,
	"daily_budget_minutes" integer DEFAULT 60 NOT NULL,
	CONSTRAINT "kid_budget_defaults_kid_id_budget_type_id_unique" UNIQUE("kid_id","budget_type_id")
);
--> statement-breakpoint
CREATE TABLE "kids" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "kids_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "timer_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"kid_id" integer NOT NULL,
	"event_type" text NOT NULL,
	"budget_type_id" integer NOT NULL,
	"earning_type_id" integer,
	"seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "active_timers" ADD CONSTRAINT "active_timers_kid_id_kids_id_fk" FOREIGN KEY ("kid_id") REFERENCES "public"."kids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_timers" ADD CONSTRAINT "active_timers_budget_type_id_budget_types_id_fk" FOREIGN KEY ("budget_type_id") REFERENCES "public"."budget_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_timers" ADD CONSTRAINT "active_timers_earning_type_id_earning_types_id_fk" FOREIGN KEY ("earning_type_id") REFERENCES "public"."earning_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_balances" ADD CONSTRAINT "daily_balances_kid_id_kids_id_fk" FOREIGN KEY ("kid_id") REFERENCES "public"."kids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_type_balances" ADD CONSTRAINT "daily_type_balances_daily_balance_id_daily_balances_id_fk" FOREIGN KEY ("daily_balance_id") REFERENCES "public"."daily_balances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_type_balances" ADD CONSTRAINT "daily_type_balances_budget_type_id_budget_types_id_fk" FOREIGN KEY ("budget_type_id") REFERENCES "public"."budget_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kid_budget_defaults" ADD CONSTRAINT "kid_budget_defaults_kid_id_kids_id_fk" FOREIGN KEY ("kid_id") REFERENCES "public"."kids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kid_budget_defaults" ADD CONSTRAINT "kid_budget_defaults_budget_type_id_budget_types_id_fk" FOREIGN KEY ("budget_type_id") REFERENCES "public"."budget_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_history" ADD CONSTRAINT "timer_history_kid_id_kids_id_fk" FOREIGN KEY ("kid_id") REFERENCES "public"."kids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_history" ADD CONSTRAINT "timer_history_budget_type_id_budget_types_id_fk" FOREIGN KEY ("budget_type_id") REFERENCES "public"."budget_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_history" ADD CONSTRAINT "timer_history_earning_type_id_earning_types_id_fk" FOREIGN KEY ("earning_type_id") REFERENCES "public"."earning_types"("id") ON DELETE no action ON UPDATE no action;