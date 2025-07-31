import { Request, Response } from "express";
import { 
    getPaymentsServices, 
    getPaymentsByIdServices, 
    createPaymentsServices, 
    deletePaymentsServices, 
    updatePaymentsServices,
    getPaymentsByPatientIdServices, // <--- Added this import
    getPaymentsByDoctorServices     // <--- Added this import
} from "./payments.service";


//crud operations and business logic including validation and json status

export const getpayments = async (req: Request, res: Response) => {
    try {
        const allpayments = await getPaymentsServices();
        if (allpayments == null || allpayments.length == 0) {
            res.status(404).json({ message: "No payments found" });
        }else{
            res.status(200).json(allpayments);             
        }             
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch payments" });
    }
}

export const getpaymentsById = async (req: Request, res: Response) => {
    const paymentsId = parseInt(req.params.id);
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    try {
        const payments = await getPaymentsByIdServices(paymentsId);
        if (payments == undefined) {
            res.status(404).json({ message: "payments not found" });
        } else {
            res.status(200).json(payments);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch payments" });
    }
}

// New controller function for getting payments by patient ID
export const getPaymentsByPatientId = async (req: Request, res: Response) => {
    const patientId = parseInt(req.params.id); // Assuming the patient ID comes from the URL parameter
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    try {
        const payments = await getPaymentsByPatientIdServices(patientId);
        if (payments === null || payments.length === 0) {
            res.status(200).json(payments || []);
        } else {
            res.status(200).json(payments);
        }
    } catch (error: any) {
        console.error("Error in getPaymentsByPatientId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch payments by patient ID" });
    }
};

// New controller function for getting payments by doctor ID
export const getPaymentsByDoctorId = async (req: Request, res: Response) => {
    const doctorId = parseInt(req.params.id); // Assuming the doctor ID comes from the URL parameter
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor ID" });
        return;
    }
    try {
        const payments = await getPaymentsByDoctorServices(doctorId);
        if (payments === null || payments.length === 0) {
            res.status(200).json(payments || []);
        } else {
            res.status(200).json(payments);
        }
    } catch (error: any) {
        console.error("Error in getPaymentsByDoctorId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch payments by doctor ID" });
    }
};


export const createpayments = async (req: Request, res: Response) => {
    const { transactionId , totalAmount} = req.body;
    if ( !transactionId || !totalAmount) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newpayments = await createPaymentsServices({transactionId,totalAmount });
        if (newpayments == null) {
            res.status(500).json({ message: "Failed to create payments" });
        } else {
            res.status(201).json({ message: newpayments });
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create payments" });
    }
}

export const updatepayments = async (req: Request, res: Response) => {
    const paymentsId = parseInt(req.params.id);
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    const { transactionId, totalAmount } = req.body;
    if (!transactionId || !totalAmount) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedpayments = await updatePaymentsServices(paymentsId, { transactionId, totalAmount});
        if (updatedpayments == null) {
            res.status(404).json({ message: "payments not found or failed to update" });
        } else {
            res.status(200).json({message:updatedpayments});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update payments" });
    }
}



export const deletepayments = async (req: Request, res: Response) => {
    const paymentsId = parseInt(req.params.id);     
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    try {
        const deletedpayments = await deletePaymentsServices(paymentsId);
        if (deletedpayments) {
            res.status(200).json({ message: "payments deleted successfully" });
        } else {
            res.status(404).json({ message: "payments not found" });
        }
    } catch (error:any) {     
        res.status(500).json({ error:error.message || "Failed to delete payments" });
    }     
}
