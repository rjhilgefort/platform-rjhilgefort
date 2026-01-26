CREATE TABLE "app_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"negative_balance_penalty" real DEFAULT -0.25 NOT NULL
);
