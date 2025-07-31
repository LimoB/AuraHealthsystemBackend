import { Router } from "express";
import { createAppointments, deleteAppointments, getAppointmentsById, getAppointments, getAppointmentsByDoctorId, getAppointmentsByPatientId, updateAppointments } from "./appointments.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";
export const appointmentRouter = Router();

// Appointment routes definition


// Get all Appointments
appointmentRouter.get('/appointments', getAppointments);// adminRoleAuth,

// Get Appointment by ID
appointmentRouter.get('/appointments/:appointmentId', getAppointmentsById);// allRoleAuth,

//Get specifiec doctor appointments
appointmentRouter.get('/doctors/:doctorId/appointments', getAppointmentsByDoctorId)// doctorRoleAuth,

//Get specific Patient appointments
appointmentRouter.get('/patients/:patientId/appointments', patientRoleAuth, getAppointmentsByPatientId)

// Create a new Appointment
appointmentRouter.post('/appointments', allRoleAuth, createAppointments);

// Update an existing Appointment
appointmentRouter.put('/appointments/:appointmentId', allRoleAuth, updateAppointments);


// Delete an existing Appointment
appointmentRouter.delete('/appointments/:appointmentId', adminRoleAuth, deleteAppointments);

import { getDoctorIdByUserId } from "./appointments.controller";

appointmentRouter.get("/doctor-id/by-user/:userId", getDoctorIdByUserId);


// In your routes file (e.g., appointments.routes.ts or patients.routes.ts)
import { getPatientIdByUserId } from "./appointments.controller";

appointmentRouter.get("/patient-id/:userId", getPatientIdByUserId);

