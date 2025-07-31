import { Router } from "express";
import { createComplaints, deleteComplaints, getComplaintsById, getComplaints, updateComplaints, getComplaintsByUserId } from "./complaints.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";
export const complaintsRouter = Router();

// Complaints routes definition


// Get all Complaints
complaintsRouter.get('/complaints',adminRoleAuth,  getComplaints);

// Get Complaints by ID
complaintsRouter.get('/complaints/:id', allRoleAuth, getComplaintsById);

// Get Complaints by User ID
complaintsRouter.get('/users/:userId/complaints', allRoleAuth, getComplaintsByUserId);

// Create a new Complaints
complaintsRouter.post('/complaints',allRoleAuth, createComplaints);

// Update an existing Complaints
complaintsRouter.put('/complaints/:id',allRoleAuth, updateComplaints);


// Delete an existing Complaints
complaintsRouter.delete('/complaints/:id', adminRoleAuth, deleteComplaints);