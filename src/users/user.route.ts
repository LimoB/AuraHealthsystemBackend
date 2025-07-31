import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";

export const userRouter = Router();

// User routes definition

// Get all users
userRouter.get('/users', adminRoleAuth, getUsers);

// Get user by ID
userRouter.get('/users/:id',allRoleAuth, getUserById);


// Create a new user
userRouter.post('/users',adminRoleAuth, createUser);


userRouter.put('/users/:id', allRoleAuth, updateUser);

// Delete an existing user
userRouter.delete('/users/:id', adminRoleAuth, deleteUser);