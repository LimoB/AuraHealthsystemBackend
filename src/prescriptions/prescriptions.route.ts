import { Router } from "express";
import {
    createprescriptions,
    deletePrescriptions,
    getPrescriptionById,
    getPrescriptions,
    getPrescriptionsByDoctorId,
    getPrescriptionsByPatientId,
    getPrescriptionsByUserId, // 👈 import the new controller
    updatePrescriptions
} from "./prescriptions.controller";

import {
    adminRoleAuth,
    allRoleAuth,
    patientRoleAuth,
    doctorRoleAuth
} from "../middleware/bearAuth";

export const prescriptionsRouter = Router();

// 🔒 Admin only - Get all prescriptions
prescriptionsRouter.get('/prescriptions', getPrescriptions);// adminRoleAuth,

// 🔓 All roles - Get prescription by ID
prescriptionsRouter.get('/prescriptions/:id', allRoleAuth, getPrescriptionById);

// 🩺 Doctor - Get prescriptions by doctor ID
prescriptionsRouter.get('/doctors/:doctorId/prescriptions', doctorRoleAuth, getPrescriptionsByDoctorId);

// 🧑‍🦽 Patient - Get prescriptions by patient ID
prescriptionsRouter.get('/patients/:patientId/prescriptions', patientRoleAuth, getPrescriptionsByPatientId);

// 👤 Patient - Get prescriptions using userId (requires mapping)
prescriptionsRouter.get('/users/:userId/prescriptions', getPrescriptionsByUserId); // ✅ NEW //patientRoleAuth,

// 📝 Doctor - Create a new prescription
prescriptionsRouter.post('/prescriptions', doctorRoleAuth, createprescriptions);

// ✏️ Doctor - Update an existing prescription
prescriptionsRouter.put('/prescriptions/:id', doctorRoleAuth, updatePrescriptions);

// ❌ Admin - Delete a prescription
prescriptionsRouter.delete('/prescriptions/:id', adminRoleAuth, deletePrescriptions);

import { getDoctorIdByUserId } from "./prescriptions.controller";

prescriptionsRouter.get("/doctor-id/by-user/:userId", getDoctorIdByUserId);


// In your routes file (e.g., appointments.routes.ts or patients.routes.ts)
import { getPatientIdByUserId } from "./prescriptions.controller";

prescriptionsRouter.get("/patient-id/:userId", getPatientIdByUserId);

