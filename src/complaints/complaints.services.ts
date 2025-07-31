//crud operations and services
import {eq, desc} from "drizzle-orm";
import db from "../drizzle/db";
import {complaintsTable, } from "../drizzle/schema";

import { TComplaintSelect, TComplaintInsert} from "../drizzle/types"
//CRUD Operations for complaints entity


//Get all complaintss
export const getComplaintsServices = async():Promise<TComplaintSelect[] | null> => {
     return await  db.query.complaintsTable.findMany({
       orderBy:[desc(complaintsTable.complaintsId)]
     });
}

//Get complaints by ID
export const getComplaintsByIdServices = async(complaintsId: number):Promise<TComplaintSelect | undefined>=> {
      return await db.query.complaintsTable.findFirst({
        where: eq(complaintsTable.complaintsId,complaintsId)
      }) 
}

//get complaints by userId
export const getComplaintsByUserIdServices = async(userId: number):Promise<TComplaintSelect[] | null> =>{
  return await db.query.complaintsTable.findMany({
    where: eq(complaintsTable.userId,userId)
  })
}

// Create a new complaints
export const createComplaintsServices = async(complaints:TComplaintInsert):Promise<string> => {
       await db.insert(complaintsTable).values(complaints).returning();
        return "complaints Created Successfully 😎"
}

// Update an existing complaints
export const updateComplaintsServices = async(complaintsId: number, complaints:TComplaintInsert):Promise<string> => {
    await db.update(complaintsTable).set(complaints).where(eq(complaintsTable.complaintsId,complaintsId));
    return "complaints Updated Succeffully 😎";
}

//delete complaints
export const deleteComplaintsServices = async(complaintsId: number):Promise<string> => {
   await db.delete(complaintsTable).where(eq(complaintsTable.complaintsId,complaintsId));
   return "complaints Delete Sucessfully";
}