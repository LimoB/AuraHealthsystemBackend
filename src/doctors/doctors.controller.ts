import { Request, Response } from "express";
import { createDoctorsServices, deleteDoctorsServices, getDoctorByUserIdServices, getDoctorsByIdServices, getDoctorsServices, updateDoctorsServices } from "./doctors.services";

//Business logic for doctors-related operations


export const getDoctors = async (req: Request, res: Response) => {
    try {
        const alldoctors = await getDoctorsServices();
        if (alldoctors == null || alldoctors.length == 0) {
            res.status(404).json({ message: "No doctors found" });
        } else {
            res.status(200).json(alldoctors);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch doctors" });
    }
}

export const getDoctorsById = async (req: Request, res: Response) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    try {
        const doctor = await getDoctorsByIdServices(doctorsId);
        if (doctor == undefined) {
            res.status(404).json({ message: "doctors not found" });
        } else {
            res.status(200).json(doctor);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch the doctor" });
    }
}

export const createDoctors = async (req: Request, res: Response) => {
    const { firstName, lastName, specialization, contactPhone, isAvailable } = req.body;
    if (!firstName || !lastName || !specialization || !contactPhone || !isAvailable) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {


        const newdoctors = await createDoctorsServices({ firstName, lastName, specialization, contactPhone, isAvailable });
        if (newdoctors == null) {
            res.status(500).json({ message: "Failed to create doctors" });
        } else {
            res.status(201).json({ message: newdoctors });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create doctors" });
    }
}

export const updateDoctors = async (req: Request, res: Response) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    const { firstName, lastName, specialization, contactPhone, isAvailable } = req.body;
    if (!firstName || !lastName || !specialization || !contactPhone || !isAvailable) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updateddoctors = await updateDoctorsServices(doctorsId, { firstName, lastName, specialization, contactPhone, isAvailable });
        if (updateddoctors == null) {
            res.status(404).json({ message: "doctors not found or failed to update" });
        } else {
            res.status(200).json({ message: updateddoctors });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update doctors" });
    }
}



export const deleteDoctors = async (req: Request, res: Response) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    try {
        const deleteddoctors = await deleteDoctorsServices(doctorsId);
        if (deleteddoctors) {
            res.status(200).json({ message: "doctors deleted successfully" });
        } else {
            res.status(404).json({ message: "doctors not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete doctors" });
    }
}



export const getDoctorByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; // Prevent further execution
    }

    try {
        const doctor = await getDoctorByUserIdServices(userId);
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found for this user ID" });
            return; // Prevent further execution
        }
        res.status(200).json(doctor);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch doctor by user ID" });
    }
};

