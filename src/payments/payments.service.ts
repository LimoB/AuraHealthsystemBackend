import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
 
  paymentsTable,
  appointmentsTable,
} from "../drizzle/schema";
import { TPaymentSelect,
  TPaymentInsert,} from "../drizzle/types"
// ✅ Get all payments
export const getPaymentsServices = async (): Promise<TPaymentSelect[] | null> => {
  try {
    const payments = await db.query.paymentsTable.findMany({
      orderBy: [desc(paymentsTable.paymentId)],
    });
    return payments;
  } catch (error) {
    console.error("Error in getPaymentsServices:", error);
    return null;
  }
};

// ✅ Get payment by ID
export const getPaymentsByIdServices = async (
  paymentId: number
): Promise<TPaymentSelect | undefined> => {
  try {
    return await db.query.paymentsTable.findFirst({
      where: eq(paymentsTable.paymentId, paymentId),
    });
  } catch (error) {
    console.error("Error in getPaymentsByIdServices:", error);
    return undefined;
  }
};

// ✅ Get payments by patient ID
export const getPaymentsByPatientIdServices = async (
  patientId: number
): Promise<
  {
    payments: TPaymentSelect;
    appointmentsTable: typeof appointmentsTable.$inferSelect | null;
  }[]
> => {
  try {
    const payments = await db
      .select()
      .from(paymentsTable)
      .leftJoin(
        appointmentsTable,
        eq(paymentsTable.appointmentId, appointmentsTable.appointmentId)
      )
      .where(eq(appointmentsTable.patientId, patientId))
      .orderBy(desc(paymentsTable.paymentDate));

    return payments;
  } catch (error) {
    console.error("Error in getPaymentsByPatientIdServices:", error);
    throw new Error("Failed to fetch payments by patient ID");
  }
};

// ✅ Get payments by doctor ID
export const getPaymentsByDoctorServices = async (
  doctorId: number
): Promise<
  {
    payments: TPaymentSelect;
    appointmentsTable: typeof appointmentsTable.$inferSelect | null;
  }[]
> => {
  try {
    const payments = await db
      .select()
      .from(paymentsTable)
      .leftJoin(
        appointmentsTable,
        eq(paymentsTable.appointmentId, appointmentsTable.appointmentId)
      )
      .where(eq(appointmentsTable.doctorId, doctorId))
      .orderBy(desc(paymentsTable.paymentDate));

    return payments;
  } catch (error) {
    console.error("Error in getPaymentsByDoctorServices:", error);
    throw new Error("Failed to fetch payments by doctor ID");
  }
};

// ✅ Create a new payment
export const createPaymentsServices = async (
  payment: TPaymentInsert
): Promise<string> => {
  try {
    await db.insert(paymentsTable).values(payment).returning();
    return "✅ Payment created successfully!";
  } catch (error) {
    console.error("Error in createPaymentsServices:", error);
    throw new Error("Failed to create payment");
  }
};

// ✅ Update an existing payment
export const updatePaymentsServices = async (
  paymentId: number,
  payment: TPaymentInsert
): Promise<string> => {
  try {
    await db
      .update(paymentsTable)
      .set(payment)
      .where(eq(paymentsTable.paymentId, paymentId));
    return "✅ Payment updated successfully!";
  } catch (error) {
    console.error("Error in updatePaymentsServices:", error);
    throw new Error("Failed to update payment");
  }
};

// ✅ Delete payment
export const deletePaymentsServices = async (
  paymentId: number
): Promise<string> => {
  try {
    await db
      .delete(paymentsTable)
      .where(eq(paymentsTable.paymentId, paymentId));
    return "🗑️ Payment deleted successfully!";
  } catch (error) {
    console.error("Error in deletePaymentsServices:", error);
    throw new Error("Failed to delete payment");
  }
};
