import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

// Extend the Express Request object to include user data from token
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

// ✅ Match the actual token payload structure
type DecodedToken = {
    userId: number | string;
    role: string; // was `userType` in original type
    specificId: number;
    specificIdType: string;
    email?: string;
    exp: number;
    iat?: number;
};

// 🔐 Token verification logic
export const verifyToken = async (token: string, secret: string) => {
    try {
        console.log("🔍 Verifying token...");
        const decoded = Jwt.verify(token, secret) as DecodedToken;
        console.log("✅ Token verified. Decoded payload:", decoded);
        return decoded;
    } catch (error) {
        console.error("❌ JWT Verification Error in verifyToken:", (error as Error).message);
        return null;
    }
};

// 🔒 Main middleware for authentication + role-based access
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
    requiredRoles: string
) => {
    console.log("\n🛡️ Running auth middleware...");
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn("⚠️ No Authorization header or malformed format");
        res.status(401).json({ error: "Access denied, no token or authorization header provided" });
        return;
    }

    const token = authHeader.split(' ')[1];

    console.log('🔐 Token extracted:', token.substring(0, 15) + '...');
    console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Present' : 'Missing');

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("❌ JWT secret not defined in environment variables");
        res.status(500).json({ error: "JWT secret not configured on server" });
        return;
    }

    const decodedToken = await verifyToken(token, jwtSecret);

    if (!decodedToken) {
        console.warn("⛔ Invalid or expired token");
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    req.user = decodedToken;

    // ✅ Use `role` instead of `userType`
    const userType = decodedToken.role;

    console.log("👤 Authenticated user:", {
        userId: decodedToken.userId,
        email: decodedToken.email,
        userType: userType,
    });

    console.log("🧠 Required role:", requiredRoles);
    console.log("🧠 User role:", userType);

    if (requiredRoles === "all") {
        if (["admin", "doctor", "patient"].includes(userType)) {
            console.log("✅ Access granted to all roles");
            next();
            return;
        }
    } else if (userType === requiredRoles) {
        console.log(`✅ Access granted to ${userType}`);
        next();
        return;
    }

    console.warn("🚫 Access denied: insufficient role");
    res.status(403).json({ error: "Forbidden: you do not have permission to access this resource" });
};

// ✅ Middleware shortcuts
export const adminRoleAuth = async (req: Request, res: Response, next: NextFunction) =>
    await authMiddleware(req, res, next, "admin");

export const doctorRoleAuth = async (req: Request, res: Response, next: NextFunction) =>
    await authMiddleware(req, res, next, "doctor");

export const patientRoleAuth = async (req: Request, res: Response, next: NextFunction) =>
    await authMiddleware(req, res, next, "patient");

export const allRoleAuth = async (req: Request, res: Response, next: NextFunction) =>
    await authMiddleware(req, res, next, "all");
