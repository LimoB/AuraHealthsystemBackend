import { eq, desc } from "drizzle-orm";
import db from "../drizzle/db";
import {
  appointmentsTable,
} from "../drizzle/schema";

import {
  TAppointmentsSelect,
  TAppointmentsInsert,
} from "../drizzle/types";

// ✅ Get all appointments WITH doctor & patient user info
export const getAppointmentsServices = async (): Promise<any[] | null> => {
  const appointments = await db.query.appointmentsTable.findMany({
    orderBy: [desc(appointmentsTable.appointmentId)],
    with: {
      doctor: {
        with: {
          user: true, // 🧑‍⚕️ include doctor's full user data
        },
      },
      patient: {
        with: {
          user: true, // 🧑‍💼 include patient's full user data
        },
      },
    },
  });

  console.log('Appointments fetched with doctor & patient info:', JSON.stringify(appointments, null, 2));

  return appointments;
};

// 🔍 Get appointment by ID WITH doctor & patient info
export const getAppointmentsByIdServices = async (
  appointmentId: number
): Promise<any | undefined> => {
  const appointment = await db.query.appointmentsTable.findFirst({
    where: eq(appointmentsTable.appointmentId, appointmentId),
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
    },
  });

  return appointment;
};

// 👤 Get appointments by patientId WITH doctor info
export const getAppointmentByPatientIdServices = async (
  patientId: number
): Promise<any[] | null> => {
  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.patientId, patientId),
    orderBy: [desc(appointmentsTable.appointmentId)],
    with: {
      doctor: {
        with: {
          user: true,
        },
      },
    },
  });

  return appointments;
};

// 👨‍⚕️ Get appointments by doctorId WITH patient info
export const getAppointmentByDoctorIdServices = async (
  doctorId: number
): Promise<any[] | null> => {
  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.doctorId, doctorId),
    orderBy: [desc(appointmentsTable.appointmentId)],
    with: {
      patient: {
        with: {
          user: true,
        },
      },
    },
  });

  return appointments;
};

// ➕ Create a new appointment
export const createAppointmentsServices = async (
  appointments: TAppointmentsInsert
): Promise<any> => {
  const [createdAppointment] = await db
    .insert(appointmentsTable)
    .values(appointments)
    .returning();

  console.log("✅ Appointment inserted into DB:", createdAppointment);

  return createdAppointment;
};

// ✏️ Update an existing appointment
export const updateAppointmentsServices = async (
  appointmentId: number,
  appointments: TAppointmentsInsert
): Promise<string> => {
  await db
    .update(appointmentsTable)
    .set(appointments)
    .where(eq(appointmentsTable.appointmentId, appointmentId));
  return "Appointment updated successfully";
};

// ❌ Delete appointment
export const deleteAppointmentsServices = async (
  appointmentId: number
): Promise<string> => {
  await db
    .delete(appointmentsTable)
    .where(eq(appointmentsTable.appointmentId, appointmentId));
  return "Appointment deleted successfully";
};
