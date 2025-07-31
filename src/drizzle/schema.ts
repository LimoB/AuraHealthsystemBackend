// 📁 schema.ts (with relations)
import {
  pgTable, serial, varchar, integer, text, boolean, timestamp, date, time, numeric,
  pgEnum, unique
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Enums ---
export const roleEnum = pgEnum("userType", ["admin", "doctor", "patient"]);
export const PaymentStatusEnum = pgEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]);
export const appointmentStatusEnum = pgEnum("AppointmentsStatus", ["confirmed", "canceled", "completed", "rescheduled", "pending"]);
export const complaintStatusEnum = pgEnum("complaintStatus", ["Open", "In Progress", "Resolved", "Closed"]);
export const paymentMethodEnum = pgEnum("paymentMethod", ["stripe", "cash"]);

// --- Tables ---
export const userTable = pgTable("userTable", {
  userId: serial("userId").primaryKey(),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  email: varchar("email").unique(),
  password: varchar("password").notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  address: text("address"),
  userType: roleEnum("userType").default("patient"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const patientsTable = pgTable("patientsTable", {
  patientId: serial("patientId").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }).unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const doctorsTable = pgTable("doctorsTable", {
  doctorId: serial("doctor_id").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  isAvailable: boolean("is_available").default(false).notNull(),
  defaultSlotDuration: integer("default_slot_duration").default(30),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const doctorAvailabilityTable = pgTable("doctorAvailability", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => doctorsTable.doctorId, { onDelete: "cascade" }).notNull(),
  dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  slotDuration: integer("slot_duration").default(30).notNull(),
  slotFee: numeric("slot_fee", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointmentsTable = pgTable("appointmentsTable", {
  appointmentId: serial("appointmentId").primaryKey(),
  patientId: integer("patientId").references(() => patientsTable.patientId, { onDelete: "set null" }),
  doctorId: integer("doctorId").references(() => doctorsTable.doctorId, { onDelete: "set null" }),
  appointmentDate: date("appointmentDate", { mode: "string" }).notNull(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  reason: varchar("reason", { length: 255 }),
  appointmentStatus: appointmentStatusEnum("appointmentStatus").default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, table => ({
  doctorAppointmentUnique: unique("doctorAppointmentUnique").on(
    table.doctorId,
    table.appointmentDate,
    table.startTime
  ),
}));

export const prescriptionsTable = pgTable("prescriptionsTable", {
  prescriptionId: serial("prescriptionId").primaryKey(),
  appointmentId: integer("appointmentId").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  doctorId: integer("doctorId").references(() => doctorsTable.doctorId, { onDelete: "set null" }),
  patientId: integer("patientId").references(() => patientsTable.patientId, { onDelete: "set null" }),
  notes: text("notes"),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsTable = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  PaymentStatus: PaymentStatusEnum("paymentStatus").default("pending"),
  transactionId: varchar("transaction_id", { length: 255 }).unique().notNull(),
  paymentMethod: paymentMethodEnum("paymentMethod").default("stripe").notNull(),
  paymentDate: timestamp("payment_date", { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

export const complaintsTable = pgTable("complaints", {
  complaintsId: serial("complaintId").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }),
  relatedAppointmentId: integer("relatedAppointmentId").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  complaintStatus: complaintStatusEnum("complaintStatus").default("Open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Relations ---
export const userRelations = relations(userTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  complaints: many(complaintsTable),
}));

export const doctorsRelations = relations(doctorsTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [doctorsTable.userId],
    references: [userTable.userId],
  }),
  availability: many(doctorAvailabilityTable),
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
}));

export const doctorAvailabilityRelations = relations(doctorAvailabilityTable, ({ one }) => ({
  doctor: one(doctorsTable, {
    fields: [doctorAvailabilityTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
}));

export const patientsRelations = relations(patientsTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [patientsTable.userId],
    references: [userTable.userId],
  }),
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
}));

export const appointmentsRelations = relations(appointmentsTable, ({ one, many }) => ({
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.patientId],
  }),
  prescriptions: many(prescriptionsTable),
  payments: many(paymentsTable),
}));

export const prescriptionsRelations = relations(prescriptionsTable, ({ one }) => ({
  doctor: one(doctorsTable, {
    fields: [prescriptionsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  patient: one(patientsTable, {
    fields: [prescriptionsTable.patientId],
    references: [patientsTable.patientId],
  }),
  appointment: one(appointmentsTable, {
    fields: [prescriptionsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [paymentsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));

export const complaintsRelations = relations(complaintsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [complaintsTable.userId],
    references: [userTable.userId],
  }),
  relatedAppointment: one(appointmentsTable, {
    fields: [complaintsTable.relatedAppointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));
