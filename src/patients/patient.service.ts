import {eq, desc} from "drizzle-orm";
import db from "../drizzle/db"; //default export not a named so we dont use curly braces
import {patientsTable,} from "../drizzle/schema";
 import { TPatientInsert, TPatientSelect} from "../drizzle/types"

//Get all patients
export const getPatientsServices = async():Promise<TPatientSelect[] | null>=>{
    return await db.query.patientsTable.findMany({
        orderBy:[desc(patientsTable.patientId)]
    });
}

export const getPatientsByIdServices = async(patientId:number):Promise<TPatientSelect | undefined>=>{
    return await db.query.patientsTable.findFirst({
        where: eq(patientsTable.patientId,patientId)
    })
}

//Create patient
export const createPatientServices = async(patient:TPatientInsert):Promise<String> =>{
    await db.insert(patientsTable).values(patient).returning();
    return "Patient created 🍂"

}

// Update patient
export const updatePatientServices = async(patientId:number, patient:TPatientInsert):Promise<string> =>{
    await db.update(patientsTable).set(patient).where(eq(patientsTable.patientId,patientId));
    return "Patient updated 😃"
}

//Delete patient
export const deletePatientServices = async(patientId:number):Promise<string> =>{
    await db.delete(patientsTable).where(eq(patientsTable.patientId,patientId));
    return "Patient deleted 😵"
}