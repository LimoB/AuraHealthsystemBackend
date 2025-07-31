import { Router } from "express";
import { 
    createpayments, 
    deletepayments, 
    getpaymentsById, 
    getpayments, 
    updatepayments,
    getPaymentsByPatientId,
    getPaymentsByDoctorId 
} from "./payments.controllers";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";

export const paymentsRouter = Router();


// Get all payments
paymentsRouter.get('/payments', adminRoleAuth, getpayments);

// Get payments by ID
paymentsRouter.get('/payments/:id', allRoleAuth, getpaymentsById);

// Get payments by Patient ID
paymentsRouter.get('/payments/patient/:id', allRoleAuth, getPaymentsByPatientId);

// Get payments by Doctor ID
paymentsRouter.get('/payments/doctor/:id', doctorRoleAuth, getPaymentsByDoctorId);   

// Create a new payments
paymentsRouter.post('/payments', adminRoleAuth, createpayments);

// Update an existing payments
paymentsRouter.put('/payments/:id', adminRoleAuth, updatepayments);

// Delete an existing payments
paymentsRouter.delete('/payments/:id', adminRoleAuth, deletepayments);


import express from 'express';
import { createCheckoutSession } from './pay.controller';
import { handleStripeWebhook } from './webhook.controller';

// const router = express.Router();

paymentsRouter.post('/payments/checkout', createCheckoutSession);

// Stripe requires raw body for webhooks
paymentsRouter.post(
  '/payments/webhook',
  express.raw({ type: 'application/json' }), // 👈 this is required
  handleStripeWebhook
);



