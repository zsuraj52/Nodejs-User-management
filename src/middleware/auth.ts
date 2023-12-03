import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from "../data-source";
import { AdminEntity } from "../entity/adminEntity";
const adminRepo = AppDataSource.getRepository(AdminEntity); 

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("token :", token); 
    if (!token)
        res.status(404).send({ "Status :": "FAILED", "Response ": "Please Authenticate" })
    
    try {
        let result = await <any> jwt.verify (token, 'secret');
        console.log("JWT Verify Result :" ,result);
        
        const admin = await adminRepo.findOneBy({email: result.email});
        if (!admin) {
            throw ('No Admin Found , Please Authenticate Yourself First! ');
        }
        console.log("Admin Found");
        console.log("Validation Completed Successfully!");
        next();
    }
    catch (e) {
        console.log("Error While Authenticating Admin :", e.message);
        res.status(400).send({ "Status ":"FAILED" , "Response" :e });
    }
}    