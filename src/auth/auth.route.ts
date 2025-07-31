import {request, Router} from "express";
import { createUser, LoginUser } from "./auth.controller";


export const authRouter = Router();

authRouter.post('/auth/register', createUser);
authRouter.post('/auth/login', LoginUser);
// console.log("received login request", request.body)