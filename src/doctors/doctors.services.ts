// 📁 services/doctorService.ts

import { eq, desc } from "drizzle-orm";
import db from "../drizzle/db";
import { doctorsTable } from "../drizzle/schema";
import { TDoctorInsert, TDoctorSelect } from "../drizzle/types";

// ✅ Get all doctors WITH user info and availability slots
export const getDoctorsServices = async () => {
  try {
    console.log("Fetching all doctors...");
    const doctors = await db.query.doctorsTable.findMany({
      orderBy: [desc(doctorsTable.doctorId)],
      with: {
        user: true,
        availability: true,
      },
    });
    console.log("Doctors fetched successfully:", doctors.length);
    return doctors;
  } catch (error) {
    console.error("Error in getDoctorsServices:", error);
    throw error;
  }
};


// ✅ Get doctor by ID WITH user and availability info
export const getDoctorsByIdServices = async (
  doctorId: number
): Promise<any | undefined> => {
  try {
    console.log(`Fetching doctor by ID: ${doctorId}`);
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.doctorId, doctorId),
      with: {
        user: true,
        availability: true,
      },
    });
    console.log("Doctor fetched:", doctor);
    return doctor;
  } catch (error) {
    console.error("Error in getDoctorsByIdServices:", error);
    throw error;
  }
};

// ✅ Create a new doctor
export const createDoctorsServices = async (
  doctor: TDoctorInsert
): Promise<string> => {
  try {
    console.log("Creating doctor:", doctor);
    await db.insert(doctorsTable).values(doctor).returning();
    console.log("Doctor created successfully.");
    return "Doctor created successfully 😎";
  } catch (error) {
    console.error("Error in createDoctorsServices:", error);
    throw error;
  }
};

// ✅ Update a doctor
export const updateDoctorsServices = async (
  doctorId: number,
  updateData: TDoctorInsert
): Promise<string> => {
  try {
    console.log(`Updating doctor ID: ${doctorId} with data:`, updateData);
    await db
      .update(doctorsTable)
      .set(updateData)
      .where(eq(doctorsTable.doctorId, doctorId));
    console.log("Doctor updated successfully.");
    return "Doctor updated successfully 😎";
  } catch (error) {
    console.error("Error in updateDoctorsServices:", error);
    throw error;
  }
};

// ✅ Delete a doctor
export const deleteDoctorsServices = async (
  doctorId: number
): Promise<string> => {
  try {
    console.log(`Deleting doctor with ID: ${doctorId}`);
    await db.delete(doctorsTable).where(eq(doctorsTable.doctorId, doctorId));
    console.log("Doctor deleted successfully.");
    return "Doctor deleted successfully 🗑️";
  } catch (error) {
    console.error("Error in deleteDoctorsServices:", error);
    throw error;
  }
};

// ✅ Get doctor by userId WITH user and availability
export const getDoctorByUserIdServices = async (
  userId: number
): Promise<any | null> => {
  try {
    console.log(`Fetching doctor by userId: ${userId}`);
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.userId, userId),
      with: {
        user: true,
        availability: true,
      },
    });
    console.log("Doctor fetched by userId:", doctor);
    return doctor;
  } catch (error) {
    console.error("Error in getDoctorByUserIdServices:", error);
    throw error;
  }
};
