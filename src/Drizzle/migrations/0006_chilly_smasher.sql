ALTER TABLE "users" RENAME COLUMN "email" TO "FirstName";--> statement-breakpoint
ALTER TABLE "customer" DROP CONSTRAINT "customer_Email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "LastName" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "Email" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "PhoneNumber" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "Address" varchar(255);--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "FirstName";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "LastName";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "Email";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "PhoneNumber";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "Address";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_Email_unique" UNIQUE("Email");