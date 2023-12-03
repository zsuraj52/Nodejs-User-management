import { Request, Response } from "express";
import { UserModel } from "../model/userModel";
import { deleteUser, fetchUserById,fetchUserByMail, getAllUsers,getAllUsersWithoutSkip, updateUserById, updateUserByMail, UserCreate } from "../services/userServices";


export const createUser =async (req:Request , res:Response) => {
    const { userName, email, password ,adminId} = req.body;
    try {
        if (!email || !password || !userName || !adminId)
            res.status(400).send({ "Status ": "FAILED", "Error ": "Please Provide Proper userName , Email and Password." });
        await UserCreate(userName, email, password, adminId).then((data) => {
            res.status(201).send({"Status ":"SUCCESS" ,"Message ":" User Registered Successfully! ", "Response ":data});
        }).catch((err) => {
            console.log("Error : ", err);
            res.status(400).send({"Status ":"FAILED" , "Response ":err});
        })
    }
    catch (e) {
        res.status(400).send({ "Status ": "FAILED", "Response ": e });
    }
}


export const getAllUsersByAdminId = async (req: Request, res: Response) => {
    try {
        let id = parseInt(req.params.adminId);
        console.log("Id :", id);
        const skip = Number(req.query.skip);
        console.log("Skip :",skip);
        if (!id) 
            res.status(400).send({"Status ": "FAILED" , "Response ":"Please Provide Valid Admin Id"})
        
        if (skip > 0) {
            await getAllUsers(skip,id).then((data) => {
            console.log("Total Users :", data);
                res.status(200).send({ "Status ": "SUCCESS", "Message ":" User's List For Given Admin-ID Is Rendered. ","Response ": data });
            }).catch((e) => {
                console.log("Error in getAllUsersByAdminId Controller ", e);
                res.status(400).send({ "Status ": "FAILED", "Response ": e });     
            })
        }
        else {
            console.log("restriction : ");
            await getAllUsersWithoutSkip(id).then((data) => {
            console.log("Total Users :", data);
                res.status(200).send({ "Status ": "SUCCESS", "Message ":" User's List For Given Admin-ID Is Rendered. ","Response ": data });
            }).catch((e) => {
                console.log("Error in getAllUsersByAdminId Controller ", e);
                res.status(400).send({ "Status ": "FAILED", "Response ": e });     
            })
        }         
    }
    catch (e) {
        console.log("Error in getAllUsersByAdminId catch :", e);
        res.status(400).send({ "Status ": "FAILED", "Response ": e });
    }
}


export const getUserByQueryData = async (req: Request, res: Response) => {
    console.log("user-id :", req.query.userid);
    console.log("user-email :",req.query.email);
    if (req.query.userid == undefined && req.query.email == undefined) 
        res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Get User " });

    try {
    const id = Number(req.query.userid);
    const mail = String(req.query.email);
        if (id) {  
        await fetchUserById(id).then((data) => {
        console.log("Data :", data);
        res.status(200).send({ "Status :": "SUCCESS", "Message ":" User For Given User-ID Is Rendered. ","Response ": data });
            }).catch((e) => {
                console.log("Error in getUserById :", e);
                throw (e);
        })
    }
    else if (mail) {
        await fetchUserByMail(mail).then((data) => {
            console.log("Data :", data);
            res.status(200).send({ "Status :": "SUCCESS", "Message ":" User For Given Mail-ID Is Rendered. ","Response ": data });
        }).catch((e) => {
            console.log("Error in getUserById :", e);
            throw (e);
        })
    }
    else {
        res.status(404).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Get User " });   
    }
}
    catch (e) {
        console.log("Error in getUserById catch :", e);
        res.status(400).send({ "Status ": "FAILED", "Response ": e });
    }
}


export const updateUser = async (req: Request, res: Response) => {
    console.log("Id :", req.query.userid);
    console.log("Email :",req.query.email);
    
    try {
        const id = Number (req.query.userid);
        const mail = String (req.query.email);
        const data: UserModel = req.body;
        if (id) {
            await updateUserById(id , data).then((data) => {
                console.log("Data :", data);
                res.status(201).send({ "Status ": "SUCCESS", "Message ":" User For Given User-ID is Rendered. ","Response ": data });  
            })
            .catch((e) => {
                console.log("Error in getUserById :", e);
                throw (e);
            })
        }
        else if(mail) {
            await updateUserByMail(mail , data).then((data) => {
                console.log("Data :", data);
                res.status(201).send({ "Status ": "SUCCESS", "Message ":" User For Given Mail-ID is Rendered. ","Response ": data });  
            })
            .catch((e) => {
                console.log("Error in getUserByMail :", e);
                throw (e);
            })
        }
        else {
            res.status(400).send({ "Status :": "FAILED", "Message :": "Please Provide Data To Update User. " });
        }
    }
    catch (e) {
        console.log("Error in getUserById catch :", e);
        res.status(400).send({ "Status ": "FAILED", "Response ": e });   
    }   
}


export const deleteUserById = async (req: Request, res: Response) => {
    console.log("User Id To Be Deleted : ",req.params.userid);
    try {
        let id = parseInt(req.params.userid);
        if (!id)
            res.status(400).send({ "Status: " : "FAILED", "Response: " : "Please Provide Admin Id" });
        await deleteUser(id).then((data) => {
            console.log(data);
            res.status(200).send({ "Status: " : "SUCCESS", "Message ":" User For Given User-ID Is Deleted. ","Response: " : data });
        }).catch((e) => {
            res.status(400).send({ "Status: " : "FAILED", "Response: " : e });
        })
    }
    catch (e) {
        console.log("Error in deleteUserById : ",e);
        res.status(400).send({ "Status ": "FAILED", "Response ": e }); 
    }
}