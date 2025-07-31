// 📁 types.ts
import {
  userTable,
  patientsTable,
  doctorsTable,
  appointmentsTable,
  prescriptionsTable,
  paymentsTable,
  complaintsTable,
} from "./schema";

export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TPatientInsert = typeof patientsTable.$inferInsert;
export type TPatientSelect = typeof patientsTable.$inferSelect;

export type TDoctorInsert = typeof doctorsTable.$inferInsert;
export type TDoctorSelect = typeof doctorsTable.$inferSelect;

export type TAppointmentsInsert = typeof appointmentsTable.$inferInsert;
export type TAppointmentsSelect = typeof appointmentsTable.$inferSelect;

export type TPrescriptionsInsert = typeof prescriptionsTable.$inferInsert;
export type TPrescriptionsSelect = typeof prescriptionsTable.$inferSelect;

export type TPaymentInsert = typeof paymentsTable.$inferInsert;
export type TPaymentSelect = typeof paymentsTable.$inferSelect;

export type TComplaintInsert = typeof complaintsTable.$inferInsert;
export type TComplaintSelect = typeof complaintsTable.$inferSelect;
