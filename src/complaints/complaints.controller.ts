import { Request, Response } from "express";
import { createComplaintsServices, deleteComplaintsServices, getComplaintsByIdServices, getComplaintsByUserIdServices, getComplaintsServices, updateComplaintsServices } from "./complaints.services";

//Business logic for complaints-related operations


export const getComplaints = async (req: Request, res: Response) => {
    try {
        const allcomplaints = await getComplaintsServices();
        if (allcomplaints == null || allcomplaints.length == 0) {
            res.status(404).json({ message: "No complaints found" });
        } else {
            res.status(200).json(allcomplaints);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" });
    }
}

export const getComplaintsByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user Id enter the correct Id" });
        return;
    }
    try {
        const complaints = await getComplaintsByUserIdServices(userId);
        if (complaints === null || complaints.length == 0) {
            res.status(404).json({ message: "no complaints found" });
        } else {
            res.status(200).json(complaints);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" })
    }
}

export const getComplaintsById = async (req: Request, res: Response) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    try {
        const complaints = await getComplaintsByIdServices(complaintsId);
        if (complaints == undefined) {
            res.status(404).json({ message: "complaints not found" });
        } else {
            res.status(200).json(complaints);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" });
    }
}



export const createComplaints = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.userId); // 👈 Convert to number
        const role = req.user?.role;
        const { relatedAppointmentId, subject, description } = req.body;

        if (!userId || !subject || !description) {
            res.status(400).json({ error: "Subject, description, and authentication are required." });
            return; // Prevent further execution
        }

        if (role !== "doctor" && !relatedAppointmentId) {
            res.status(400).json({ error: "relatedAppointmentId is required for non-doctors." });
            return; // Prevent further execution
        }

        const newComplaint = await createComplaintsServices({
            userId,
            subject,
            description,
            relatedAppointmentId: role === "doctor" ? null : relatedAppointmentId,
        });

        if (!newComplaint) {
            res.status(500).json({ message: "Failed to create complaint" });
            return; // Prevent further execution
        }

        res.status(201).json({ message: newComplaint });
        return; // Prevent further execution
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create complaint" });
        return; // Prevent further execution
    }
};


export const updateComplaints = async (req: Request, res: Response) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    const { relatedAppointmentId, subject, description } = req.body;
    if (!relatedAppointmentId || !subject || !description) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedcomplaints = await updateComplaintsServices(complaintsId, { relatedAppointmentId, subject, description });
        if (updatedcomplaints == null) {
            res.status(404).json({ message: "complaints not found or failed to update" });
        } else {
            res.status(200).json({ message: updatedcomplaints });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update complaints" });
    }
}



export const deleteComplaints = async (req: Request, res: Response) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    try {
        const deletedcomplaints = await deleteComplaintsServices(complaintsId);
        if (deletedcomplaints) {
            res.status(200).json({ message: "complaints deleted successfully" });
        } else {
            res.status(404).json({ message: "complaints not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete complaints" });
    }
}