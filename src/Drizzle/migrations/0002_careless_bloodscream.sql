CREATE TABLE "admin" (
	"adminID" serial PRIMARY KEY NOT NULL,
	"userID" integer NOT NULL,
	"name" varchar(100),
	CONSTRAINT "admin_userID_unique" UNIQUE("userID")
);
--> statement-breakpoint
ALTER TABLE "customer" ALTER COLUMN "userID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE cascade ON UPDATE no action;