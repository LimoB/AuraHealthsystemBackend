"use strict";
// import swaggerui from 'swagger-ui-express';
// import { Application } from 'express';
// import swaggerJSDoc, { Options } from 'swagger-jsdoc';
// // import { title } from 'process'; // Unused import, can be removed
// // import { version } from 'os'; // Unused import, can be removed
// import { userTable } from '../drizzle/schema'; // Unused import, can be removed
// const swaggerOptions: Options = {
//     definition: {
//         openapi: '3.0.0', // specifies openApi version
//         info: {
//             title: 'My Express.js API with TypeScript',
//             version: '1.0.0', // version of the the API you are documenting
//             description: "Api documentation for my backend project.",
//         },
//         servers: [
//             {
//                 url: "http://localhost:5000/api/v1", // Api's base path
//                 description: "Development server",
//             },
//         ],
//         components: {
//             // FIX 1: Corrected typo 'securitySchemas' to 'securitySchemes'
//             securitySchemes: {
//                 // FIX 2: Corrected typo 'beareAuth' to 'bearerAuth'
//                 bearerAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                     // FIX 3: Corrected bearerFormat value and added a proper description
//                     bearerFormat: 'JWT', // Standard for JWT
//                     description: 'Enter your JWT token in the format: **Bearer <token>**', // User-friendly description
//                 },
//             },
//             schemas: {
//                 // --- Enums ---
//                 UserType: {
//                     type: 'string',
//                     enum: ['admin', 'user', 'doctor', 'patient'],
//                     description: 'Role of the user',
//                     example: 'user',
//                 },
//                 PaymentStatus: {
//                     type: 'string',
//                     enum: ['pending', 'completed', 'failed', 'refunded'],
//                     description: 'Status of a payment transaction',
//                     example: 'pending',
//                 },
//                 AppointmentStatus: {
//                     type: 'string',
//                     enum: ['confirmed', 'canceled', 'completed', 'rescheduled', 'pending'],
//                     description: 'Status of an appointment',
//                     example: 'pending',
//                 },
//                 ComplaintStatus: {
//                     type: 'string',
//                     enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
//                     description: 'Status of a complaint',
//                     example: 'Open',
//                 },
//                 // --- Tables Models
//                 User: {
//                     type: 'object',
//                     properties: {
//                         userId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the user',
//                             readOnly: true,
//                             example: 1,
//                         },
//                         firstName: {
//                             type: 'string',
//                             description: 'First name of the user',
//                             example: 'John',
//                         },
//                         lastName: {
//                             type: 'string',
//                             description: 'Last name of the user',
//                             example: 'Doe',
//                         },
//                         email: {
//                             type: 'string',
//                             format: 'email',
//                             description: 'Email address of the user (must be unique)',
//                             example: 'john.doe@example.com',
//                         },
//                         password: {
//                             type: 'string',
//                             description: 'Hashed password of the user',
//                             writeOnly: true,
//                             example: 'hashed_password_string',
//                         },
//                         contactPhone: {
//                             type: 'string',
//                             description: 'Contact phone number (max 20 characters)',
//                             example: '+254712345678',
//                         },
//                         address: {
//                             type: 'string',
//                             description: 'Physical address of the user',
//                             nullable: true,
//                             example: '123 Main St, Anytown',
//                         },
//                         userType: {
//                             $ref: '#/components/schemas/UserType',
//                             description: 'Role of the user',
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the user was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the user record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['password', 'contactPhone'],
//                 },
//                 Patient: {
//                     type: 'object',
//                     properties: {
//                         patientId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the patient',
//                             readOnly: true,
//                             example: 101,
//                         },
//                         userId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated user',
//                             nullable: true,
//                             example: 1,
//                         },
//                         firstName: {
//                             type: 'string',
//                             description: 'First name of the patient',
//                             example: 'Alice',
//                         },
//                         lastName: {
//                             type: 'string',
//                             description: 'Last name of the patient',
//                             example: 'Smith',
//                         },
//                         contactPhone: {
//                             type: 'string',
//                             description: 'Contact phone number of the patient (max 20 characters)',
//                             nullable: true,
//                             example: '+254722334455',
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the patient record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the patient record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['firstName', 'lastName'],
//                 },
//                 Doctor: {
//                     type: 'object',
//                     properties: {
//                         doctorId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the doctor',
//                             readOnly: true,
//                             example: 201,
//                         },
//                         userId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated user',
//                             nullable: true,
//                             example: 2,
//                         },
//                         firstName: {
//                             type: 'string',
//                             description: 'First name of the doctor',
//                             example: 'Dr. Emily',
//                         },
//                         lastName: {
//                             type: 'string',
//                             description: 'Last name of the doctor',
//                             example: 'White',
//                         },
//                         specialization: {
//                             type: 'string',
//                             description: 'Specialization of the doctor',
//                             example: 'Cardiology',
//                         },
//                         contactPhone: {
//                             type: 'string',
//                             description: 'Contact phone number of the doctor (max 20 characters)',
//                             nullable: true,
//                             example: '+254733445566',
//                         },
//                         isAvailable: {
//                             type: 'boolean',
//                             description: 'Indicates if the doctor is generally available',
//                             example: true,
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the doctor record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the doctor record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['firstName', 'lastName', 'specialization', 'isAvailable'],
//                 },
//                 Appointment: {
//                     type: 'object',
//                     properties: {
//                         appointmentId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the appointment',
//                             readOnly: true,
//                             example: 301,
//                         },
//                         patientId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated patient',
//                             nullable: true,
//                             example: 101,
//                         },
//                         doctorId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated doctor',
//                             nullable: true,
//                             example: 201,
//                         },
//                         appointmentDate: {
//                             type: 'string',
//                             format: 'date',
//                             description: 'Date of the appointment (YYYY-MM-DD)',
//                             example: '2025-07-15',
//                         },
//                         timeSlot: {
//                             type: 'string',
//                             format: 'time',
//                             description: 'Time slot of the appointment (HH:MM:SS)',
//                             example: '09:00:00',
//                         },
//                         startTime: {
//                             type: 'string',
//                             format: 'time',
//                             description: 'Start time of the appointment (HH:MM:SS)',
//                             example: '09:00:00',
//                         },
//                         endTime: {
//                             type: 'string',
//                             format: 'time',
//                             description: 'End time of the appointment (HH:MM:SS)',
//                             example: '09:30:00',
//                         },
//                         totalAmount: {
//                             type: 'number',
//                             format: 'float',
//                             description: 'Total amount for the appointment (precision 10, scale 2)',
//                             example: 50.00,
//                         },
//                         appointmentStatus: {
//                             $ref: '#/components/schemas/AppointmentStatus',
//                             description: 'Status of the appointment',
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the appointment record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the appointment record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['appointmentDate', 'timeSlot', 'startTime', 'endTime', 'totalAmount'],
//                 },
//                 Prescription: {
//                     type: 'object',
//                     properties: {
//                         prescriptionId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the prescription',
//                             readOnly: true,
//                             example: 401,
//                         },
//                         appointmentId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated appointment',
//                             nullable: true,
//                             example: 301,
//                         },
//                         doctorId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the prescribing doctor',
//                             nullable: true,
//                             example: 201,
//                         },
//                         patientId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated patient',
//                             nullable: true,
//                             example: 101,
//                         },
//                         notes: {
//                             type: 'string',
//                             description: 'Notes or details of the prescription',
//                             nullable: true,
//                             example: 'Take 1 tablet twice daily after meals for 5 days.',
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the prescription record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the prescription record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: [],
//                 },
//                 Payment: {
//                     type: 'object',
//                     properties: {
//                         paymentId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the payment',
//                             readOnly: true,
//                             example: 501,
//                         },
//                         appointmentId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the associated appointment',
//                             nullable: true,
//                             example: 301,
//                         },
//                         totalAmount: {
//                             type: 'number',
//                             format: 'float',
//                             description: 'Total amount of the payment',
//                             example: 50.00,
//                         },
//                         PaymentStatus: {
//                             $ref: '#/components/schemas/PaymentStatus',
//                             description: 'Status of the payment',
//                         },
//                         transactionId: {
//                             type: 'string',
//                             description: 'Unique transaction identifier from the payment gateway',
//                             example: 'txn_abc123def456',
//                         },
//                         paymentDate: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the payment was processed',
//                             readOnly: true,
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the payment record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the payment record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['totalAmount', 'transactionId'],
//                 },
//                 Complaint: {
//                     type: 'object',
//                     properties: {
//                         complaintsId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Unique identifier for the complaint',
//                             readOnly: true,
//                             example: 601,
//                         },
//                         userId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the user who made the complaint',
//                             nullable: true,
//                             example: 1,
//                         },
//                         relatedAppointmentId: {
//                             type: 'integer',
//                             format: 'int32',
//                             description: 'Foreign key to the appointment related to the complaint (if any)',
//                             nullable: true,
//                             example: 301,
//                         },
//                         subject: {
//                             type: 'string',
//                             description: 'Subject of the complaint',
//                             example: 'Issue with doctor appointment',
//                         },
//                         description: {
//                             type: 'string',
//                             description: 'Detailed description of the complaint',
//                             example: 'The doctor was late for the appointment by 30 minutes.',
//                         },
//                         complaintStatus: {
//                             $ref: '#/components/schemas/ComplaintStatus',
//                             description: 'Current status of the complaint',
//                         },
//                         createdAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the complaint record was created',
//                             readOnly: true,
//                         },
//                         updatedAt: {
//                             type: 'string',
//                             format: 'date-time',
//                             description: 'Timestamp when the complaint record was last updated',
//                             readOnly: true,
//                         },
//                     },
//                     required: ['subject', 'description'],
//                 },
//                 // --- Request Body Schemas (often derived from main schemas) ---
//                 UserCreate: {
//                     type: 'object',
//                     properties: {
//                         firstName: {
//                             type: 'string',
//                             description: 'First name of the user',
//                             example: 'John',
//                         },
//                         lastName: {
//                             type: 'string',
//                             description: 'Last name of the user',
//                             example: 'Doe',
//                         },
//                         email: {
//                             type: 'string',
//                             format: 'email',
//                             description: 'Email address of the user (must be unique)',
//                             example: 'new.user@example.com',
//                         },
//                         password: {
//                             type: 'string',
//                             description: 'Password for the user account',
//                             example: 'secure_password123',
//                         },
//                         contactPhone: {
//                             type: 'string',
//                             description: 'Contact phone number (max 20 characters)',
//                             example: '+254712345678',
//                         },
//                         address: {
//                             type: 'string',
//                             description: 'Physical address of the user',
//                             nullable: true,
//                             example: '456 Oak Ave, Nairobi',
//                         },
//                         userType: {
//                             $ref: '#/components/schemas/UserType',
//                             description: 'Role of the user',
//                             example: 'user',
//                         },
//                     },
//                     required: ['firstName', 'lastName', 'email', 'password', 'contactPhone'],
//                 },
//             },
//         }, 
//     },
//     // This is the 'apis' property, correctly placed as a sibling to 'definition'
//     apis: [
//         './src/**/*.service.ts',
//         './src/**/*.controller.ts',
//         './src/**/*.route.ts',
//     ],
// };
// const swaggerSpec = swaggerJSDoc(swaggerOptions);
// export default swaggerSpec;
