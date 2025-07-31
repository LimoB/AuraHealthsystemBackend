import { Request, Response } from "express";
import { createAppointmentsServices, deleteAppointmentsServices, getAppointmentsByIdServices, getAppointmentsServices, updateAppointmentsServices, getAppointmentByDoctorIdServices, getAppointmentByPatientIdServices } from "./appointments.services";

//Business logic for appointments-related operations


export const getAppointments = async (req: Request, res: Response) => {
    try {
        const allappointments = await getAppointmentsServices();
        if (allappointments == null || allappointments.length == 0) {
            res.status(404).json({ message: "No appointmentss found" });
        } else {
            res.status(200).json(allappointments);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch appointmentss" });
    }
}






export const getAppointmentsById = async (req: Request, res: Response) => {
    const appointmentsId = parseInt(req.params.appointmentId);
    if (isNaN(appointmentsId)) { //NaN -not a number
        res.status(400).json({ error: "Invalid appointments ID" });
        return; // Prevent further execution
    }
    try {
        const appointments = await getAppointmentsByIdServices(appointmentsId);
        if (appointments == undefined) {
            res.status(404).json({ message: "appointments not found" });
        } else {
            res.status(200).json(appointments);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch appointments" });
    }
}

export const getAppointmentsByDoctorId = async (req: Request, res: Response) => {
    const doctorId = parseInt(req.params.doctorId);
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor Id enter the correct Id" });
        return;
    }
    try {
        const appointments = await getAppointmentByDoctorIdServices(doctorId);
        if (appointments === null || appointments.length == 0) {
            res.status(404).json({ message: "no appointments found" });
        } else {
            res.status(200).json(appointments);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch appointments" })
    }
}

export const getAppointmentsByPatientId = async (req: Request, res: Response) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient Id enter the correct Id" });
        return;
    }
    try {
        const appointments = await getAppointmentByPatientIdServices(patientId);
        if (appointments === null || appointments.length == 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(appointments);
        }
    } catch (error: any) {
        console.error("Error in getAppointmentsByPatientId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch appointments" })
    }
}




// ✅ CREATE Appointment
// ✅ CREATE Appointment (patientId from token)

import { doctorAvailabilityTable, appointmentsTable } from "../drizzle/schema"; // adjust paths
// import { Request, Response } from "express";
import { and, lte, gte } from "drizzle-orm";

export const createAppointments = async (req: Request, res: Response) => {
    const {
        appointmentDate,
        startTime,
        endTime,
        totalAmount,
        doctorId,
        reason,
    } = req.body;

    console.log("📥 Incoming Appointment Payload:", req.body);

    // 🔐 Extract user from token (middleware must populate req.user)
    const requester = req.user;
    if (!requester || requester.role !== "patient") {
        return res.status(403).json({ error: "Only patients can book appointments" });
    }

    try {
        // ✅ Lookup patientId from patientsTable using userId
        const [patient] = await db
            .select()
            .from(patientsTable)
            .where(eq(patientsTable.userId, Number(requester.userId)))
            .limit(1);

        if (!patient) {
            return res.status(404).json({ error: "Patient profile not found for this user." });
        }

        const patientId = patient.patientId;

        // 🔍 Validate input
        if (!appointmentDate || !startTime || !endTime || !totalAmount || !doctorId) {
            return res.status(400).json({
                error: "All fields except patientId are required. It is extracted from the token.",
            });
        }

        // 📅 Determine day of the week (e.g., "Monday")
        const dayOfWeek = new Date(appointmentDate).toLocaleString("en-US", {
            weekday: "long",
        });

        // ✅ Check doctor's availability for the time slot
        const [availableSlot] = await db
            .select()
            .from(doctorAvailabilityTable)
            .where(
                and(
                    eq(doctorAvailabilityTable.doctorId, doctorId),
                    eq(doctorAvailabilityTable.dayOfWeek, dayOfWeek),
                    lte(doctorAvailabilityTable.startTime, startTime),
                    gte(doctorAvailabilityTable.endTime, endTime)
                )
            )
            .limit(1);

        if (!availableSlot) {
            return res.status(400).json({
                error: `Doctor is not available on ${dayOfWeek} between ${startTime} and ${endTime}`,
            });
        }

        // ❌ Check for conflicting appointment
        const [conflict] = await db
            .select()
            .from(appointmentsTable)
            .where(
                and(
                    eq(appointmentsTable.doctorId, doctorId),
                    eq(appointmentsTable.appointmentDate, appointmentDate),
                    eq(appointmentsTable.startTime, startTime)
                )
            )
            .limit(1);

        if (conflict) {
            return res.status(409).json({
                error: "This time slot is already booked. Please choose another.",
            });
        }

        // ✅ Create the appointment
        const newAppointment = await createAppointmentsServices({
            appointmentDate,
            startTime,
            endTime,
            totalAmount,
            doctorId,
            patientId,
            reason: reason || "",
        });

        if (!newAppointment) {
            return res.status(500).json({ message: "Failed to create appointment" });
        }

        return res.status(201).json({
            message: "Appointment successfully created",
            data: newAppointment,
        });

    } catch (error: any) {
        console.error("❌ Error creating appointment:", error);
        return res.status(500).json({
            error: error.message || "Unexpected error creating appointment",
        });
    }
};







// ✅ UPDATE Appointment
export const updateAppointments = async (req: Request, res: Response) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        console.warn("⚠️ Invalid appointment ID");
        res.status(400).json({ error: "Invalid appointment ID" });
        return;
    }

    const {
        appointmentDate,
        timeSlot,
        startTime,
        endTime,
        totalAmount,
        patientId,
        doctorId,
        reason,
    } = req.body;

    console.log("🛠️ Updating Appointment ID:", appointmentId);
    console.log("📥 Update Payload:", req.body);

    if (
        !appointmentDate ||
        !timeSlot ||
        !startTime ||
        !endTime ||
        !totalAmount ||
        !patientId ||
        !doctorId
    ) {
        console.warn("⚠️ Missing required fields");
        res.status(400).json({ error: "All fields including patientId and doctorId are required" });
        return;
    }

    try {
        const updatedAppointment = await updateAppointmentsServices(appointmentId, {
            appointmentDate,
            // timeSlot,
            startTime,
            endTime,
            totalAmount,
            patientId,
            doctorId,
            reason,
        });

        if (!updatedAppointment) {
            console.error("❌ Appointment not found or update failed");
            res.status(404).json({ message: "Appointment not found or failed to update" });
        } else {
            console.log("✅ Appointment updated:", updatedAppointment);
            res.status(200).json({ message: updatedAppointment });
        }
    } catch (error: any) {
        console.error("❌ Error updating appointment:", error);
        res.status(500).json({ error: error.message || "Failed to update appointment" });
    }
};


import { doctorsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";



import db from "../drizzle/db";
// ✅ make sure this path is correct

// ✅ Map userId to doctorId with logging
export const getDoctorIdByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    console.log("🔍 Incoming request to map userId to doctorId:", userId);

    if (isNaN(userId)) {
        console.warn("⚠️ Invalid user ID received:", req.params.userId);
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        console.log("📡 Querying doctors table for userId:", userId);

        const result = await db
            .select({
                doctorId: doctorsTable.doctorId,
                userId: doctorsTable.userId,
            })
            .from(doctorsTable)
            .where(eq(doctorsTable.userId, userId))
            .limit(1);

        if (result.length === 0) {
            console.warn("❌ No doctor found for userId:", userId);
            res.status(404).json({ message: "No doctor found for this user" });
            return;
        }

        const doctorId = result[0].doctorId;
        console.log(`✅ Found doctorId ${doctorId} for userId ${userId}`);
        res.status(200).json({ doctorId });
        return;

    } catch (error: any) {
        console.error("🔥 Error fetching doctorId by userId:", error);
        res.status(500).json({ error: error.message || "Server error" });
        return;
    }
};




export const deleteAppointments = async (req: Request, res: Response) => {
    const appointmentsId = parseInt(req.params.id);
    if (isNaN(appointmentsId)) {
        res.status(400).json({ error: "Invalid appointments ID" });
        return; // Prevent further execution
    }
    try {
        const deletedappointments = await deleteAppointmentsServices(appointmentsId);
        if (deletedappointments) {
            res.status(200).json({ message: "appointments deleted successfully" });
        } else {
            res.status(404).json({ message: "appointments not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete appointments" });
    }
}




import { patientsTable } from "../drizzle/schema"; // ✅ Ensure this path is correct

// ✅ Map userId to patientId with logging
export const getPatientIdByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    console.log("🔍 Incoming request to map userId to patientId:", userId);

    if (isNaN(userId)) {
        console.warn("⚠️ Invalid user ID received:", req.params.userId);
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        console.log("📡 Querying patients table for userId:", userId);

        const result = await db
            .select({
                patientId: patientsTable.patientId,
                userId: patientsTable.userId,
            })
            .from(patientsTable)
            .where(eq(patientsTable.userId, userId))
            .limit(1);

        if (result.length === 0) {
            console.warn("❌ No patient found for userId:", userId);
            res.status(404).json({ message: "No patient found for this user" });
            return;
        }

        const patientId = result[0].patientId;
        console.log(`✅ Found patientId ${patientId} for userId ${userId}`);
        res.status(200).json({ patientId });
        return;

    } catch (error: any) {
        console.error("🔥 Error fetching patientId by userId:", error);
        res.status(500).json({ error: error.message || "Server error" });
        return;
    }
};
