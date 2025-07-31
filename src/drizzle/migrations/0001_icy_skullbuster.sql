CREATE TYPE "public"."paymentMethod" AS ENUM('stripe', 'cash');--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "paymentMethod" "paymentMethod" DEFAULT 'stripe' NOT NULL;