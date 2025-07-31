import {Router} from "express";
import {getPatients, getPatientsById, createPatient, deletePatient, updatePatient } from "./patient.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";

export const patientRouter = Router();

//Get all patients
patientRouter.get('/patients',adminRoleAuth, getPatients);

//Get patients Byid
patientRouter.get('/patients/:id', allRoleAuth, getPatientsById);

//Create patient
patientRouter.post('/patients',adminRoleAuth, createPatient);

//update patient
patientRouter.put('/patients/:id',adminRoleAuth, updatePatient);

//delete patient
patientRouter.delete('/patients/:id', adminRoleAuth, deletePatient);