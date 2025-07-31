import { eq, and, desc } from "drizzle-orm";
import db from "../drizzle/db";
import {
  prescriptionsTable,
  patientsTable,
  
} from "../drizzle/schema";
import {type TPrescriptionsSelect,
  type TPrescriptionsInsert,} from "../drizzle/types"
// ----------------------
// ✅ Get ALL prescriptions with doctor, patient, and appointment info
// ----------------------
export const getPrescriptionssServices = async (): Promise<any[] | null> => {
  return await db.query.prescriptionsTable.findMany({
    orderBy: [desc(prescriptionsTable.prescriptionId)],
    with: {
      doctor: {
        with: {
          user: true, // 👨‍⚕️ doctor user info
        },
      },
      patient: {
        with: {
          user: true, // 👩‍💼 patient user info
        },
      },
      appointment: true, // 🗓️ appointment details
    },
  });
};

// ----------------------
// ✅ Get ONE prescription by ID (with relations)
// ----------------------
export const getPrescriptionsByIdServices = async (
  prescriptionId: number
): Promise<any | undefined> => {
  return await db.query.prescriptionsTable.findFirst({
    where: eq(prescriptionsTable.prescriptionId, prescriptionId),
    with: {
      doctor: {
        with: {
          user: true,
        },
      },
      patient: {
        with: {
          user: true,
        },
      },
      appointment: true,
    },
  });
};

// ----------------------
// ✅ Get prescriptions by PATIENT ID (with relations)
// ----------------------
export const getPrescriptionsByPatientIdServices = async (
  patientId: number
): Promise<any[] | null> => {
  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.patientId, patientId),
    with: {
      doctor: {
        with: {
          user: true,
        },
      },
      appointment: true,
    },
  });
};

// ----------------------
// ✅ Get prescriptions by DOCTOR ID (with relations)
// ----------------------
export const getPrescriptionsByDoctorIdServices = async (
  doctorId: number
): Promise<any[] | null> => {
  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.doctorId, doctorId),
    with: {
      patient: {
        with: {
          user: true,
        },
      },
      appointment: true,
    },
  });
};

// ----------------------
// ✅ Get prescriptions by USER ID (via patientId + relations)
// ----------------------
export const getPrescriptionsByUserIdServices = async (
  userId: number
): Promise<any[] | null> => {
  const patient = await db
    .select({ patientId: patientsTable.patientId })
    .from(patientsTable)
    .where(eq(patientsTable.userId, userId))
    .limit(1);

  if (patient.length === 0) {
    console.warn("❌ No patient found for userId:", userId);
    return null;
  }

  const patientId = patient[0].patientId;

  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.patientId, patientId),
    with: {
      doctor: {
        with: {
          user: true,
        },
      },
      appointment: true,
    },
  });
};

// ----------------------
// ✅ Get prescriptions by doctorId AND patientId (with relations)
// ----------------------
export const getPrescriptionsByDoctorAndPatientServices = async (
  doctorId: number,
  patientId: number
): Promise<any[]> => {
  return await db.query.prescriptionsTable.findMany({
    where: and(
      eq(prescriptionsTable.doctorId, doctorId),
      eq(prescriptionsTable.patientId, patientId)
    ),
    with: {
      doctor: {
        with: {
          user: true,
        },
      },
      patient: {
        with: {
          user: true,
        },
      },
      appointment: true,
    },
    orderBy: [desc(prescriptionsTable.prescriptionId)],
  });
};

// ----------------------
// ✅ Create prescription
// ----------------------
export const createPrescriptionsServices = async (
  prescription: TPrescriptionsInsert
): Promise<string> => {
  await db.insert(prescriptionsTable).values(prescription).returning();
  return "✅ Prescription created successfully!";
};

// ----------------------
// ✅ Update prescription
// ----------------------
export const updatePrescriptionsServices = async (
  prescriptionId: number,
  prescription: TPrescriptionsInsert
): Promise<string> => {
  await db
    .update(prescriptionsTable)
    .set(prescription)
    .where(eq(prescriptionsTable.prescriptionId, prescriptionId));
  return "✅ Prescription updated successfully!";
};

// ----------------------
// ✅ Delete prescription
// ----------------------
export const deletePrescriptionsServices = async (
  prescriptionId: number
): Promise<string> => {
  await db
    .delete(prescriptionsTable)
    .where(eq(prescriptionsTable.prescriptionId, prescriptionId));
  return "🗑️ Prescription deleted successfully!";
};
