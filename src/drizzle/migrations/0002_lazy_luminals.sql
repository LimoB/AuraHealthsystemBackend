CREATE TABLE "doctorAvailability" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_id" integer NOT NULL,
	"day_of_week" varchar(20) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"slot_duration" integer DEFAULT 30 NOT NULL,
	"slot_fee" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctorsTable" RENAME COLUMN "availability" TO "default_slot_duration";--> statement-breakpoint
ALTER TABLE "doctorAvailability" ADD CONSTRAINT "doctorAvailability_doctor_id_doctorsTable_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctorsTable"("doctor_id") ON DELETE cascade ON UPDATE no action;