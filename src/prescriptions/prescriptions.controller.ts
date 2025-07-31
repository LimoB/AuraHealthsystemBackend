import { Request, Response } from "express";
import { createPrescriptionsServices, deletePrescriptionsServices, getPrescriptionsByIdServices, getPrescriptionssServices, updatePrescriptionsServices, getPrescriptionsByPatientIdServices, getPrescriptionsByDoctorIdServices } from "./prescriptions.services";

//Business logic for prescriptions-related operations


export const getPrescriptions = async (req: Request, res: Response) => {
    try {
        const allprescriptions = await getPrescriptionssServices();
        if (allprescriptions == null || allprescriptions.length == 0) {
          res.status(200).json(allprescriptions || []);
        }else{
            res.status(200).json(allprescriptions);             
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch prescriptions" });
    }
}

export const getPrescriptionById = async (req: Request, res: Response) => {
    const prescriptionId = parseInt(req.params.id);
    if (isNaN(prescriptionId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
         return; // Prevent further execution
    }
    try {
        const prescriptions = await getPrescriptionsByIdServices(prescriptionId);
        if (prescriptions == undefined) {
            res.status(200).json(prescriptions || []); 
        } else {
            res.status(200).json(prescriptions);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch prescriptions" });
    }
}

export const getPrescriptionsByDoctorId = async (req: Request, res:Response)=>{
    const doctorId = parseInt(req.params.doctorId);
    if(isNaN(doctorId)){
        res.status(400).json({error: "Invalid doctor Id enter the correct Id"});
        return;
    }
    try{
        const Prescriptions = await getPrescriptionsByDoctorIdServices(doctorId);
        if (Prescriptions === null || Prescriptions.length == 0){
            res.status(200).json(Prescriptions || []); ;
        } else{
            res.status(200).json(Prescriptions);
        }
        }catch(error:any){
            res.status(500).json({error:error.message || "Failed to fetch Prescriptions"})
    }
}

export const getPrescriptionsByPatientId = async (req: Request, res:Response)=>{
    const patientId = parseInt(req.params.patientId );
    if(isNaN(patientId)){
        res.status(400).json({error: "Invalid patient Id enter the correct Id"});
        return;
    }
    try{
        const Prescriptions = await getPrescriptionsByPatientIdServices(patientId);
        if (Prescriptions === null || Prescriptions.length == 0){
            res.status(200).json([]);
        } else{
            res.status(200).json(Prescriptions);
        }
        }catch(error:any){
            res.status(500).json({error:error.message || "Failed to fetch Prescriptions"})
    }
}




export const createprescriptions = async (req: Request, res: Response) => {
  const { notes, doctorId, patientId, appointmentId, expiryDate } = req.body;

  // Validate required fields
  if (!notes || !doctorId || !patientId) {
    res.status(400).json({ error: "notes, doctorId and patientId are required" });
    return;
  }

  try {
    const newPrescriptions = await createPrescriptionsServices({
      notes,
      doctorId,
      patientId,
      appointmentId: appointmentId ?? null, // optional
      expiryDate: expiryDate ? new Date(expiryDate) : null, // optional
      issueDate: new Date(), // default to now
    });

    if (!newPrescriptions) {
      res.status(500).json({ message: "Failed to create prescription" });
    } else {
      res.status(201).json({ message: newPrescriptions });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create prescription" });
  }
};



export const updatePrescriptions = async (req: Request, res: Response) => {
  const prescriptionsId = parseInt(req.params.id);
  if (isNaN(prescriptionsId)) {
    res.status(400).json({ error: "Invalid prescription ID" });
    return;
  }

  const { notes } = req.body;
  if (!notes) {
    res.status(400).json({ error: "Notes field is required" });
    return;
  }

  try {
    // ✅ Fetch the current prescription to get issueDate
    const existingPrescription = await getPrescriptionsByIdServices(prescriptionsId);
    if (!existingPrescription) {
      res.status(404).json({ message: "Prescription not found" });
      return;
    }

    // ✅ Perform the update
    const updatedPrescription = await updatePrescriptionsServices(prescriptionsId, {
      issueDate: existingPrescription.issueDate, // required field
      notes, // the new data
    });

    if (!updatedPrescription) {
      res.status(404).json({ message: "Failed to update prescription" });
    } else {
      res.status(200).json({ message: updatedPrescription });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update prescription" });
  }
};



export const deletePrescriptions = async (req: Request, res: Response) => {
    const prescriptionsId = parseInt(req.params.id);  
    if (isNaN(prescriptionsId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    try {
        const deletedPrescriptions = await deletePrescriptionsServices(prescriptionsId);
        if (deletedPrescriptions) {
            res.status(200).json({ message: "prescriptions deleted successfully" });
        } else {
            res.status(404).json({ message: "prescriptions not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete prescriptions" });
    }    
}



// import { Request, Response } from "express";
import { getPrescriptionsByUserIdServices } from "./prescriptions.services";

export const getPrescriptionsByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
  res.status(400).json({ error: "Invalid user ID" });
     return;
  }

  try {
    const prescriptions = await getPrescriptionsByUserIdServices(userId);

    if (!prescriptions || prescriptions.length === 0) {
      res.status(404).json([]);
       return;
    }

  res.status(200).json(prescriptions);
     return;
  } catch (error: any) {
    console.error("❌ Error in controller:", error);
     res.status(500).json({ error: error.message || "Server error" });
     return
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

