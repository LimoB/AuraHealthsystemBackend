import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../middleware/nodemailer";

// Drizzle ORM
import db from '../drizzle/db';
import { userTable, patientsTable, doctorsTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { InferInsertModel } from "drizzle-orm";

// Optional: Still using services for user creation
import { createUserServices, getUserByEmailServices } from "./auth.service";

// REGISTER USER
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, contactPhone, address, userType } = req.body;
    const allowedRoles = ['doctor', 'admin', 'patient'];
    const role = allowedRoles.includes(userType) ? userType : 'patient'; // Default to 'patient' if not specified or invalid

    try {
        if (!firstName || !lastName || !email || !password || !contactPhone || !address) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const existingUser = await getUserByEmailServices(email);
        if (existingUser) {
            res.status(409).json({ error: "Email is already registered" });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await createUserServices({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactPhone,
            address,
            userType: role,
        });

        if (role === 'patient') {
            type NewPatient = InferInsertModel<typeof patientsTable>;
            const patientRecord: NewPatient = {
                userId: newUser.userId,
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                contactPhone: newUser.contactPhone,
            };
            await db.insert(patientsTable).values(patientRecord);
        }

        if (role === 'doctor') {
            type NewDoctor = InferInsertModel<typeof doctorsTable>;
            const doctorRecord: NewDoctor = {
                userId: newUser.userId,
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                contactPhone: newUser.contactPhone,
                // specialization is optional; don't set if not provided
                // isAvailable defaults to false in schema
            };
            await db.insert(doctorsTable).values(doctorRecord);
        }

        const emailResult = await sendNotificationEmail(
            email,
            firstName,
            "Account created successfully",
            "Welcome to Aura Health! Your account has been created successfully. You can now login to your account using your email and password."
        );

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.userId,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                userType: newUser.userType,
            },
            emailMessage: emailResult,
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message || "Failed to create user" });
    }
};

// LOGIN USER
export const LoginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await db.query.userTable.findFirst({ where: eq(userTable.email, email) });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        let specificId: number | null = null;
        let specificIdType: 'patientId' | 'doctorId' | undefined;

        if (user.userType === 'patient') {
            const patient = await db.query.patientsTable.findFirst({
                where: eq(patientsTable.userId, user.userId)
            });
            if (patient) {
                specificId = patient.patientId;
                specificIdType = 'patientId';
            }
        } else if (user.userType === 'doctor') {
            const doctor = await db.query.doctorsTable.findFirst({
                where: eq(doctorsTable.userId, user.userId)
            });
            if (doctor) {
                specificId = doctor.doctorId;
                specificIdType = 'doctorId';
            }
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET environment variable is not set");
            res.status(500).json({ error: "Server configuration error: JWT secret missing." });
            return;
        }

        const tokenPayload: {
            userId: number;
            role: string;
            exp: number;
            specificId?: number;
            specificIdType?: 'patientId' | 'doctorId';
        } = {
            userId: user.userId,
            role: user.userType ?? '',
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };

        if (specificId !== null && specificIdType) {
            tokenPayload.specificId = specificId;
            tokenPayload.specificIdType = specificIdType;
        }

        const token = jwt.sign(tokenPayload, jwtSecret);

        const userProfileToSend: {
            userId: number;
            firstName: string;
            lastName: string;
            role: string;
            email: string;
            contactPhone?: string;
            address?: string;
            profile_picture?: string;
            patientId?: number;
            doctorId?: number;
        } = {
            userId: user.userId,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            role: user.userType ?? '',
            email: user.email ?? '',
            contactPhone: user.contactPhone,
            address: user.address ?? undefined,
        };

        if (specificIdType === 'patientId' && specificId !== null) {
            userProfileToSend.patientId = specificId;
        } else if (specificIdType === 'doctorId' && specificId !== null) {
            userProfileToSend.doctorId = specificId;
        }

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userProfileToSend,
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message || "Failed to login user due to server error." });
    }
};
