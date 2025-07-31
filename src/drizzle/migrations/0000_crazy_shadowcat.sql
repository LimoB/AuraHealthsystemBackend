CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."AppointmentsStatus" AS ENUM('confirmed', 'canceled', 'completed', 'rescheduled', 'pending');--> statement-breakpoint
CREATE TYPE "public"."complaintStatus" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."userType" AS ENUM('admin', 'doctor', 'patient');--> statement-breakpoint
CREATE TABLE "appointmentsTable" (
	"appointmentId" serial PRIMARY KEY NOT NULL,
	"patientId" integer,
	"doctorId" integer,
	"appointmentDate" date NOT NULL,
	"timeSlot" time NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"totalAmount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"reason" varchar(255),
	"appointmentStatus" "AppointmentsStatus" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "doctorAppointmentUnique" UNIQUE("doctorId","appointmentDate","startTime")
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"complaintId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"relatedAppointmentId" integer,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"complaintStatus" "complaintStatus" DEFAULT 'Open',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctorsTable" (
	"doctor_id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"specialization" varchar(255),
	"contact_phone" varchar(20),
	"is_available" boolean DEFAULT false NOT NULL,
	"availability" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patientsTable" (
	"patientId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"contact_phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patientsTable_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer,
	"totalAmount" numeric(10, 2) NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'pending',
	"transaction_id" varchar(255) NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "prescriptionsTable" (
	"prescriptionId" serial PRIMARY KEY NOT NULL,
	"appointmentId" integer,
	"doctorId" integer,
	"patientId" integer,
	"notes" text,
	"issue_date" timestamp NOT NULL,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"userId" serial PRIMARY KEY NOT NULL,
	"firstName" varchar,
	"lastName" varchar,
	"email" varchar,
	"password" varchar NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"address" text,
	"userType" "userType" DEFAULT 'patient',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointmentsTable" ADD CONSTRAINT "appointmentsTable_patientId_patientsTable_patientId_fk" FOREIGN KEY ("patientId") REFERENCES "public"."patientsTable"("patientId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointmentsTable" ADD CONSTRAINT "appointmentsTable_doctorId_doctorsTable_doctor_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctorsTable"("doctor_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_relatedAppointmentId_appointmentsTable_appointmentId_fk" FOREIGN KEY ("relatedAppointmentId") REFERENCES "public"."appointmentsTable"("appointmentId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctorsTable" ADD CONSTRAINT "doctorsTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patientsTable" ADD CONSTRAINT "patientsTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_appointmentsTable_appointmentId_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointmentsTable"("appointmentId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_appointmentId_appointmentsTable_appointmentId_fk" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointmentsTable"("appointmentId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_doctorId_doctorsTable_doctor_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctorsTable"("doctor_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptionsTable" ADD CONSTRAINT "prescriptionsTable_patientId_patientsTable_patientId_fk" FOREIGN KEY ("patientId") REFERENCES "public"."patientsTable"("patientId") ON DELETE set null ON UPDATE no action;