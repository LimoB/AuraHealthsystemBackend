import {Request, Response} from "express";
import {getPatientsServices, getPatientsByIdServices, createPatientServices, updatePatientServices, deletePatientServices} from "./patient.service";


//Business logic, checking and json

export const getPatients = async (req:Request, res:Response) =>{
    try {
        const allPatients = await getPatientsServices();
        if (allPatients == null || allPatients.length == 0) {
            res.status(404).json({message: "No patients found"});
        }else{
            res.status(200).json(allPatients);
        }
        }catch (error:any) {
            res.status(500).json({error:error.message || "Failed to fetch patients"});
        }  
    }

export const getPatientsById =async (req:Request, res:Response)=>{
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
        res.status(400).json({error: "invalid patient Id"});
        return;//prevent further execution
    }
try{
    const patient = await getPatientsByIdServices(patientId);
    if (patient == undefined) {
        res.status(404).json({message:"patient not found"});     
    }else {
        res.status(200).json(patient);
    }
}catch (error:any) {
    res.status(500).json({error: error.message || "Failed to get patient"});
}
}

export const createPatient = async (req:Request, res:Response) =>{
    const {firstName,lastName,contactPhone} = req.body; //it creates a const that requests details and fills them giving them the names 
    if (!firstName || !lastName || !contactPhone){
        res.status(400).json({error: "All fields are required"});
        return;
    }
    try {
        const newPatient = await createPatientServices ({firstName,lastName,contactPhone});
        if (newPatient == null) {
            res.status(400).json({message: "Failed to create a patient"});
        } else{
            res.status(201).json({message:newPatient});
        }
    } catch (error:any) {
        res.status
        (500).json({error: error.message || "Fauled to create Patient"});
    }
}

export const updatePatient = async(req:Request, res:Response) =>{
    const patientId = parseInt(req.params.id);
    if(isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    const {firstName,lastName,contactPhone}= req.body;
    if((!firstName || !lastName || !contactPhone)){
        res.status(400).json({error: "All fields are required"});
        return;
    }
    try{
        const updatedPatient = await updatePatientServices(patientId, {firstName,lastName,contactPhone});
        if (updatedPatient == null) {
            res.status(404).json({ message: "patient not found or failed to update" });
        }else{
            res.status(200).json({message:updatedPatient});
        }
    }catch (error:any){
        res.status(500).json({error:error.message || "Failed to update patient"})
    }
}

export const deletePatient = async(req:Request, res:Response)=>{
    const patientId = parseInt(req.params.id);
    if(isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    try{
        const deletedPatient = await deletePatientServices(patientId);
        if (deletedPatient){
            res.status(200).json({message: "Patient deleted"});
        }else {
            res.status(404).json({message: "Patient not found"});
        }
        }catch (error:any){
            res.status(500).json({error:error.message || "Failed to delete patient"});
    }
}