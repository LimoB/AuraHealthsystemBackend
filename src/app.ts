import express, { Application, Response } from "express";

import { logger } from "./middleware/logger";
import { userRouter } from "./users/user.route";
import { doctorsRouter } from "./doctors/doctors.route";
import { patientRouter } from "./patients/patient.route";
import { appointmentRouter } from "./appointments/appointments.route";
import { paymentsRouter } from "./payments/payments.route";
import { complaintsRouter } from "./complaints/complaints.route";
import { prescriptionsRouter } from "./prescriptions/prescriptions.route";

import swaggerUi from 'swagger-ui-express'

// import { rateLimiterMiddleware } from "./middleware/rateLimiter";
import cors from "cors";
import { authRouter } from "./auth/auth.route";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

const app: Application = express();


const port = process.env.PORT || 5000;



//Basic Middleware
app.use(cors())// cross origin resource shairing prevents web pages from making request to a different domain than the one the page originated from
app.use(express.json());//It parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(logger);//It's typically used for logging details about incoming requests to the console or a log file
app.use(rateLimiterMiddleware)

// app.use(rateLimiterMiddleware)

//default route
app.get('/', (req, res: Response) => { //req contains the request info while res contains the response from express
    res.send("Welcome to Express Api Backend With Drizzle ORM and Postgresql")
})

//import routes 
app.use('/api', userRouter)
app.use('/api', doctorsRouter)
app.use('/api', patientRouter)
app.use('/api', appointmentRouter)
app.use('/api', paymentsRouter)
app.use('/api', complaintsRouter)
app.use('/api', prescriptionsRouter)
app.use('/api', authRouter)

export default app;